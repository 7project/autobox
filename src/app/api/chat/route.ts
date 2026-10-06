import { NextRequest, NextResponse } from "next/server";
import {
  AUTOBOX_SYSTEM_PROMPT,
  ChatMessage,
  FREE_MODELS,
  logOpenRouterError,
  queryOpenRouter,
} from "@/lib/openrouter";
import { SESSION_SETTINGS } from "@/config/ai.config";
import {
  extractCarInfo,
  extractFixedPrice,
  extractPhone,
  extractPreferredTime,
  extractTelegram,
  getSessionContext,
  isSupabaseConfigured,
  resetClientSession,
  saveMessageToSession,
  saveOrUpdateServiceLead,
  updateSessionCar,
} from "@/lib/supabase";
import { sendLeadNotificationEmail, TARGET_TEST_EMAIL } from "@/lib/mailer";
import {
  checkChatRateLimit,
  guardPaidModelUsage,
  recordPaidModelCall,
  getSecurityConfig,
} from "@/lib/rate-limit";

// Polite human-friendly fallback when AI models are unavailable or rate-limited
const SERVICE_FALLBACK_REPLY = `Здравствуйте! Мастер-приёмщик автосервиса "Автобокс74rus" на ул. Печёнкина, 1а сейчас консультирует клиента в боксе. 

Пожалуйста, позвоните нам напрямую по номеру **+7 (995) 927-77-54** или оставьте ваш телефон и марку авто прямо здесь в чате — мастер свяжется с вами в течение 5 минут, ответит по запчастям и забронирует удобное время!`;

export async function GET() {
  return NextResponse.json({
    models: FREE_MODELS,
    supabaseConnected: isSupabaseConfigured,
  });
}

export async function POST(req: NextRequest) {
  let token = "anonymous-guest";
  let userMessage = "";

  try {
    const body = await req.json();
    const { message, sessionToken, apiKey, model, action } = body;

    token = sessionToken || body.clientToken || "guest_" + Math.random().toString(36).substring(2, 10);

    // Support manual session reset
    if (action === "reset") {
      await resetClientSession(token);
      return NextResponse.json({ success: true, userTurnCount: 1, isReset: true });
    }

    userMessage = message || "";

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // 0. Extract Client IP
    const forwardedFor = req.headers.get("x-forwarded-for");
    const realIp = req.headers.get("x-real-ip");
    const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";

    // 1. Rate Limiting, Cooldown & Honeypot Check
    const rateCheck = checkChatRateLimit(clientIp, userMessage, body.bot_trap);
    if (!rateCheck.allowed) {
      if (rateCheck.reason === "BOT_TRAP") {
        return NextResponse.json({
          reply: SERVICE_FALLBACK_REPLY,
          isRealAi: false,
          modelUsed: "openrouter/free",
        });
      }

      return NextResponse.json(
        {
          error: rateCheck.message,
          reason: rateCheck.reason,
          waitTimeSeconds: rateCheck.waitTimeSeconds || 5,
        },
        { status: rateCheck.reason === "MESSAGE_TOO_LONG" ? 400 : 429 }
      );
    }

    // 2. Paid Model Guard & Circuit Breaker Check
    const requestedModel = model || SESSION_SETTINGS.DEFAULT_MODEL_ID;
    const paidGuard = guardPaidModelUsage(requestedModel, clientIp, token);
    const effectiveModel = paidGuard.effectiveModel;

    // 3. Get previous messages for this active session from Supabase (holds sliding window of context)
    const sessionData = await getSessionContext(
      token,
      SESSION_SETTINGS.CONTEXT_WINDOW_LIMIT
    );

    const { history, userTurnCount, isReset, sessionId, clientCar: existingCar } = sessionData;

    // 2. Car Memory: detect vehicle from current message, or maintain previously detected vehicle
    const newlyDetectedCar = extractCarInfo(userMessage);
    const activeCar = newlyDetectedCar || existingCar;

    if (newlyDetectedCar && newlyDetectedCar !== existingCar) {
      await updateSessionCar(sessionId, newlyDetectedCar, token);
    }

    // 3. Lead, Price & Contact Detection (Phone, Telegram, Preferred Time, Fixed Price)
    const detectedPhone = extractPhone(userMessage);
    const detectedTg = extractTelegram(userMessage);
    const detectedTime = extractPreferredTime(userMessage);
    const detectedFixedPrice = extractFixedPrice(userMessage);
    const hasLeadData = Boolean(detectedPhone || detectedTg);
    const hasPriceLock = Boolean(detectedFixedPrice);

    let savedLeadInfo: any = null;
    if (hasLeadData || hasPriceLock) {
      const notesParts: string[] = [];
      if (detectedFixedPrice) {
        notesParts.push(`[ФИКСАЦИЯ ЦЕНЫ В AI-ЧАТЕ]: ${detectedFixedPrice} ₽`);
      }
      notesParts.push(`Заявка через AI-консультант сайта (сессия: ${sessionId})`);

      savedLeadInfo = await saveOrUpdateServiceLead({
        sessionId,
        clientToken: token,
        phone: detectedPhone || undefined,
        telegram: detectedTg || undefined,
        car: activeCar || undefined,
        preferredTime: detectedTime || undefined,
        serviceRequested: userMessage.slice(0, 500),
        notes: notesParts.join(" | "),
      });
    }

    // 4. Build dialogue context:
    // Car memory instruction guarantees the model NEVER forgets the car, even after many turns
    const carMemoryInstruction: ChatMessage[] = activeCar
      ? [
          {
            role: "system",
            content: `[ПАМЯТЬ АВТОСЕРВИСА О КЛИЕНТЕ]:
Автомобиль клиента: "${activeCar}".
Все работы, запчасти, артикулы, свечи, масла и стоимость работ рассчитывай ИСКЛЮЧИТЕЛЬНО для этого автомобиля!
Категорически ЗАПРЕЩЕНО переспрашивать марку, модель или год авто — ты уже точно знаешь, что это ${activeCar}!
Если клиент спрашивает конкретную деталь или работу (например: "сколько стоит поменять свечи?"), отвечай СРАЗУ с ценами на эти детали и работу именно для ${activeCar}, без общих шаблонных меню!`,
          },
        ]
      : [];

    // Cue when fixed price is requested / locked
    const priceLockCue: ChatMessage[] = detectedFixedPrice
      ? [
          {
            role: "system",
            content: `[СИСТЕМА: КЛИЕНТ ЗАПРОСИЛ ФИКСАЦИЮ ЦЕНЫ ${detectedFixedPrice} ₽ НА СЕРВИС!
Зафиксированные параметры внесены в базу service_leads автосервиса:
• Автомобиль: ${activeCar || "Уточняется"}
• Зафиксированная стоимость: ${detectedFixedPrice} ₽ (застрахована от изменений)
• Телефон: ${detectedPhone || "еще не указан"}
• Telegram: ${detectedTg || "еще не указан"}

ТВОЯ ГЛАВНАЯ ЦЕЛЬ — ЗАВЕРШИТЬ ПРОДАЖУ (ДОЖИМ ДО ЗАПИСИ):
1. Сразу и уверенно подтверди клиенту:
"✅ Специальная цена ${detectedFixedPrice} ₽ успешно зафиксирована за вашим ${activeCar || "автомобилем"} в базе автосервиса! Стоимость окончательная и застрахована от скрытых доплат."
2. Назначь встречу прямо сейчас (предложи 2 конкретных свободных окна):
"Для проведения работ у нас свободно два окна на ул. Печёнкина, 1а:
• Сегодня в 16:30
• Завтра в 11:00
Какое время вам удобнее?"
3. Если телефон или Telegram клиента еще не указаны, запроси:
"Напишите ваш контакт (телефон или Telegram @username), и наш бот пришлет вам электронный талон бронирования бокса."
4. Пиши собрано, профессионально и по-деловому, как опытный мастер-приёмщик!]`,
          },
        ]
      : [];

    // System confirmation cue when lead contact was saved to service_leads
    const leadSavedCue: ChatMessage[] = hasLeadData
      ? [
          {
            role: "system",
            content: `[СИСТЕМА: Заявка успешно зафиксирована и записана в базу service_leads автосервиса!
Зафиксированные параметры:
• Автомобиль: ${activeCar || "Уточняется"}
• Телефон: ${detectedPhone || "не указан"}
• Telegram: ${detectedTg || "не указан"}
• Время визита: ${detectedTime || "ближайшее свободное окно"}
ТЫ ОБЯЗАН в самом начале своего ответа написать:
"✅ Все данные успешно зафиксированы и записаны в систему автосервиса!"
и перечислить эти зафиксированные параметры.
Сообщи, что мастер свяжется для подтверждения, а в дальнейшем Telegram-бот пришлет талон с бронью бокса.
${!detectedTg ? 'Обязательно предложи клиенту оставить также его Telegram (@username), чтобы наш бот мог автоматически прислать талон и статус готовности машины!' : ''}]`,
          },
        ]
      : [];

    // Deduplication: prevent consecutive duplicate user messages from poisoning context
    const cleanHistory: ChatMessage[] = [];
    for (let i = 0; i < history.length; i++) {
      const prev = cleanHistory[cleanHistory.length - 1];
      const cur = history[i];
      if (prev && prev.role === cur.role && prev.content.trim() === cur.content.trim()) {
        continue;
      }
      cleanHistory.push(cur);
    }

    const trimmedContext: ChatMessage[] = [
      { role: "system", content: AUTOBOX_SYSTEM_PROMPT },
      ...carMemoryInstruction,
      ...leadSavedCue,
      ...priceLockCue,
      ...cleanHistory,
      { role: "user", content: userMessage },
    ];

    // 5. Save incoming user message to session
    await saveMessageToSession(token, "user", userMessage, sessionId);

    let reply = "";
    let isRealAi = false;
    let isPaid = false;
    let usage: any = null;
    let modelUsed = model || "openrouter/free";

    const openRouterKey = apiKey || process.env.OPENROUTER_API_KEY;

    if (openRouterKey) {
      try {
        // Query OpenRouter using configured models with automated fallbacks
        const result = await queryOpenRouter(
          trimmedContext,
          openRouterKey,
          effectiveModel,
          token
        );
        reply = result.text;
        modelUsed = result.modelUsed;
        isRealAi = true;
        isPaid = result.isPaid;
        usage = result.usage || null;

        if (result.isPaid) {
          recordPaidModelCall();
        }
      } catch (err: any) {
        logOpenRouterError({
          model: effectiveModel,
          message: "All model attempts failed in chat route",
          details: err.message || String(err),
          sessionId: token,
        });

        reply = SERVICE_FALLBACK_REPLY;
        isRealAi = false;
      }
    } else {
      console.warn("⚠️ [CHAT ROUTE] OPENROUTER_API_KEY is not defined in process.env or request body!");
      reply = SERVICE_FALLBACK_REPLY;
    }

    // 6. Save bot reply to session
    await saveMessageToSession(token, "bot", reply, sessionId);

    // 7. Check email notifications (if lead or booking intent)
    let emailStatus = null;
    if (
      hasLeadData ||
      userMessage.toLowerCase().includes("запиши") ||
      userMessage.toLowerCase().includes("запись")
    ) {
      const fullDialogForEmail = [
        ...cleanHistory,
        { role: "user", content: userMessage },
        { role: "assistant", content: reply },
      ];

      emailStatus = await sendLeadNotificationEmail({
        sessionToken: token,
        phone: detectedPhone || undefined,
        dialogHistory: fullDialogForEmail,
        clientIp: req.headers.get("x-forwarded-for") || "127.0.0.1",
        source: detectedTg ? `AI-Консультант (TG: ${detectedTg})` : "AI-Консультант на сайте",
      });
    }

    return NextResponse.json({
      reply,
      isRealAi,
      modelUsed,
      isPaid,
      usage,
      sessionToken: token,
      userTurnCount,
      activeCar: activeCar || null,
      maxTurns: SESSION_SETTINGS.CONTEXT_WINDOW_LIMIT,
      contextCount: trimmedContext.length,
      contextReset: isReset,
      leadCaptured: hasLeadData,
      isPriceLocked: hasPriceLock,
      fixedPrice: detectedFixedPrice || null,
      isDowngraded: paidGuard.downgraded,
      downgradeReason: paidGuard.downgradeReason || null,
      cooldownSeconds: getSecurityConfig().cooldownSeconds,
      leadDetails: hasLeadData || hasPriceLock
        ? {
            phone: detectedPhone || null,
            telegram: detectedTg || null,
            car: activeCar || null,
            preferredTime: detectedTime || null,
            fixedPrice: detectedFixedPrice || null,
            leadId: savedLeadInfo?.id || null,
          }
        : null,
      notificationEmail: TARGET_TEST_EMAIL,
      emailStatus,
    });
  } catch (error: any) {
    logOpenRouterError({
      model: "system-handler",
      message: "Unexpected error in POST /api/chat",
      details: error.stack || error.message,
      sessionId: token,
    });

    return NextResponse.json({
      reply: SERVICE_FALLBACK_REPLY,
      isRealAi: false,
      sessionToken: token,
      isFallback: true,
    });
  }
}
