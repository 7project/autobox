import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && (supabaseServiceKey || supabaseAnonKey)
);

export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// ---------------------------------------------------------------------------
// In-memory fallback (offline / test environments)
// ---------------------------------------------------------------------------
interface MemorySession {
  sessionId: string;
  status: "active" | "closed" | "completed";
  clientCar?: string;
  messages: { sender: "user" | "bot"; text: string; time: string }[];
}
const memorySessions = new Map<string, MemorySession>();

export interface SessionContextData {
  history: { role: "user" | "assistant"; content: string }[];
  userTurnCount: number;
  isReset: boolean;
  sessionId: string;
  clientCar?: string;
}

/**
 * Извлечение марки/модели/года автомобиля из текста сообщения пользователя
 */
export function extractCarInfo(text: string): string | null {
  if (!text || typeof text !== "string") return null;

  const carBrands = [
    "honda", "toyota", "nissan", "mazda", "mitsubishi", "subaru", "suzuki", "isuzu", "daihatsu",
    "lexus", "infiniti", "acura",
    "hyundai", "kia", "genesis", "daewoo", "ssangyong",
    "volkswagen", "vw", "audi", "bmw", "mercedes", "skoda", "seat", "porsche", "opel",
    "renault", "peugeot", "citroen",
    "ford", "chevrolet", "dodge", "chrysler", "jeep", "cadillac",
    "lada", "ваз", "газ", "уаз", "москвич",
    "geely", "haval", "chery", "changan", "omoda", "exeed", "jaecoo", "tank", "jetour", "gac", "byd", "li", "zeekr",
    "хонда", "тойота", "ниссан", "мазда", "митсубиси", "мицубиси", "субару", "сузуки",
    "хендай", "хёндай", "хундай", "киа", "фольксваген", "ауди", "бмв", "мерседес", "шкода", "опель",
    "рено", "пежо", "ситроен", "форд", "шевроле", "лада", "джили", "хавал", "чери", "чанган"
  ];

  for (const b of carBrands) {
    const rx = new RegExp("(^|[^a-zA-Zа-яА-Я0-9_])" + b + "(?=[^a-zA-Zа-яА-Я0-9_]|$)", "i");
    const match = text.match(rx);
    if (match && typeof match.index === "number") {
      const start = match.index + match[1].length;
      const snippet = text.substring(start, start + 60).split(/[\n,;\.!?]/)[0].trim();
      if (snippet.length >= b.length) {
        return snippet;
      }
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// getSessionContext — получить контекст диалога для client_token
// Удерживает скользящее окно последних сообщений (до maxTurns диалоговых шагов),
// никогда не сбрасывает память об автомобиле.
// ---------------------------------------------------------------------------
export async function getSessionContext(
  sessionToken: string,
  maxTurns = 10
): Promise<SessionContextData> {
  const token = sessionToken || "guest_default";

  if (supabaseAdmin) {
    try {
      // 1. Найти активную сессию клиента
      const { data: activeSessions, error: listErr } = await supabaseAdmin
        .from("chat_sessions")
        .select("id, status, client_car, created_at")
        .eq("client_token", token)
        .in("status", ["active", "lead_captured"])
        .order("created_at", { ascending: false });

      if (listErr) {
        console.warn("[supabase] Error listing sessions:", listErr.message);
      }

      // Если накопилось больше 1 активной сессии — закрываем все старые
      if (activeSessions && activeSessions.length > 1) {
        const staleIds = activeSessions.slice(1).map((s) => s.id);
        await supabaseAdmin
          .from("chat_sessions")
          .update({ status: "closed", updated_at: new Date().toISOString() })
          .in("id", staleIds);
        console.log(`[supabase] Closed ${staleIds.length} duplicate active sessions for token ${token}`);
      }

      let session =
        activeSessions && activeSessions.length > 0
          ? activeSessions[0]
          : null;

      // Если активной сессии нет — создаём новую
      if (!session) {
        const { data: newSession, error: createErr } = await supabaseAdmin
          .from("chat_sessions")
          .insert({ client_token: token, status: "active" })
          .select("id, status, client_car, created_at")
          .single();

        if (createErr) {
          console.warn("[supabase] Failed to create session:", createErr.message);
        } else {
          session = newSession;
        }
      }

      if (session) {
        // 2. Считываем сообщения текущей сессии в хронологическом порядке
        const { data: messages, error: msgErr } = await supabaseAdmin
          .from("chat_messages")
          .select("sender, text, created_at")
          .eq("session_id", session.id)
          .order("created_at", { ascending: true });

        if (msgErr) {
          console.warn("[supabase] Failed to read messages:", msgErr.message);
        }

        const sessionMsgs = messages || [];
        const userMsgCount = sessionMsgs.filter((m) => m.sender === "user").length;

        // Скользящее окно последних сообщений (до maxTurns шагов = 2 * maxTurns реплик user+bot)
        // Сообщения накапливаются, а модель видит последние maxTurns реплик диалога
        const maxMessagesInContext = maxTurns * 2;
        const recentMsgs = sessionMsgs.slice(-maxMessagesInContext);

        const history = recentMsgs.map((m) => ({
          role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: m.text,
        }));

        // Номер текущего шага в цикле (1..10)
        const userTurnCount = ((userMsgCount) % maxTurns) + 1;

        return {
          history,
          userTurnCount,
          isReset: false,
          sessionId: session.id,
          clientCar: session.client_car || undefined,
        };
      }
    } catch (e: any) {
      console.warn("[supabase] getSessionContext error, falling back to memory:", e.message);
    }
  }

  // --- In-Memory Fallback ---
  let mem = memorySessions.get(token);
  if (!mem || mem.status !== "active") {
    mem = {
      sessionId: "mem_" + Date.now(),
      status: "active",
      messages: [],
    };
    memorySessions.set(token, mem);
  }

  const userCount = mem.messages.filter((m) => m.sender === "user").length;
  const recentMsgs = mem.messages.slice(-(maxTurns * 2));
  const history = recentMsgs.map((m) => ({
    role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
    content: m.text,
  }));

  const userTurnCount = ((userCount) % maxTurns) + 1;

  return {
    history,
    userTurnCount,
    isReset: false,
    sessionId: mem.sessionId,
    clientCar: mem.clientCar,
  };
}

/**
 * Сохранить обнаруженный автомобиль клиента в сессию
 */
export async function updateSessionCar(sessionId: string, car: string, sessionToken?: string) {
  if (!car) return;

  if (supabaseAdmin && sessionId) {
    try {
      await supabaseAdmin
        .from("chat_sessions")
        .update({ client_car: car, updated_at: new Date().toISOString() })
        .eq("id", sessionId);
    } catch (e: any) {
      console.warn("[supabase] updateSessionCar error:", e.message);
    }
  }

  if (sessionToken) {
    const mem = memorySessions.get(sessionToken);
    if (mem) {
      mem.clientCar = car;
    }
  }
}

/**
 * Сохранить сообщение в сессию
 */
export async function saveMessageToSession(
  sessionToken: string,
  sender: "user" | "bot",
  text: string,
  targetSessionId?: string
) {
  const token = sessionToken || "guest_default";

  if (supabaseAdmin) {
    try {
      let sessionId = targetSessionId;

      if (!sessionId) {
        const { data: activeSessions } = await supabaseAdmin
          .from("chat_sessions")
          .select("id")
          .eq("client_token", token)
          .in("status", ["active", "lead_captured"])
          .order("created_at", { ascending: false })
          .limit(1);

        if (activeSessions && activeSessions.length > 0) {
          sessionId = activeSessions[0].id;
        } else {
          const { data: newSession } = await supabaseAdmin
            .from("chat_sessions")
            .insert({ client_token: token, status: "active" })
            .select("id")
            .single();
          sessionId = newSession?.id;
        }
      }

      if (sessionId) {
        const { error } = await supabaseAdmin.from("chat_messages").insert({
          session_id: sessionId,
          sender,
          text,
        });
        if (error) {
          console.warn("[supabase] saveMessage error:", error.message);
        }
      }
      return;
    } catch (e: any) {
      console.warn("[supabase] saveMessageToSession failed:", e.message);
    }
  }

  // Memory fallback
  const mem = memorySessions.get(token);
  if (mem) {
    mem.messages.push({ sender, text, time: new Date().toISOString() });
  }
}

/**
 * Принудительный сброс контекста сессии (по кнопке пользователя)
 */
export async function resetClientSession(sessionToken: string) {
  const token = sessionToken || "guest_default";

  if (supabaseAdmin) {
    try {
      const { error } = await supabaseAdmin
        .from("chat_sessions")
        .update({ status: "closed", updated_at: new Date().toISOString() })
        .eq("client_token", token)
        .in("status", ["active", "lead_captured"]);

      if (error) {
        console.warn("[supabase] resetClientSession error:", error.message);
      } else {
        console.log(`[supabase] All active sessions closed for token ${token}`);
      }
    } catch (e: any) {
      console.warn("[supabase] resetClientSession error:", e.message);
    }
  }

  const mem = memorySessions.get(token);
  if (mem) {
    mem.status = "closed";
    memorySessions.delete(token);
  }
}

// ---------------------------------------------------------------------------
// Лиды и заявки на сервис (с поддержкой Telegram для автобота)
// ---------------------------------------------------------------------------
export interface ServiceLeadData {
  sessionId?: string;
  clientToken: string;
  clientName?: string;
  phone?: string;
  telegram?: string;
  car?: string;
  serviceRequested?: string;
  preferredTime?: string;
  notes?: string;
}

/**
 * Извлечение Telegram-никнейма из текста (например: @ivan_74, t.me/alex, тг @sergey)
 */
export function extractTelegram(text: string): string | null {
  if (!text || typeof text !== "string") return null;
  const match =
    text.match(/(?:t\.me\/|@)([a-zA-Z0-9_]{4,32})/i) ||
    text.match(/(?:тг|телеграм|telegram|телега)[\s:]+@?([a-zA-Z0-9_]{4,32})/i);
  if (match) {
    const handle = match[1];
    const excluded = [
      "honda", "toyota", "nissan", "gmail", "yandex", "mail", "admin", "autobox", "autobox74"
    ];
    if (!excluded.includes(handle.toLowerCase())) {
      return "@" + handle.replace(/^@/, "");
    }
  }
  return null;
}

/**
 * Номера телефонов самого автосервиса (не должны считаться лидами клиентов)
 */
export const EXCLUDED_SERVICE_PHONES = [
  "9959277754", // +7 (995) 927-77-54 — Автобокс74rus
  "3511234567", // устаревший / демонстрационный номер
];

/**
 * Проверка: является ли номер телефоном самого сервиса
 */
export function isServicePhoneNumber(rawPhone: string | null | undefined): boolean {
  if (!rawPhone || typeof rawPhone !== "string") return false;
  const digits = rawPhone.replace(/\D/g, "");
  return EXCLUDED_SERVICE_PHONES.some(
    (srv) => digits === srv || digits.endsWith(srv)
  );
}

/**
 * Извлечение телефонного номера (с обязательным исключением служебного телефона сервиса)
 */
export function extractPhone(text: string): string | null {
  if (!text || typeof text !== "string") return null;
  const matches = text.matchAll(
    /(?:\+?[78]\s?\(?\d{3}\)?\s?\d{3}[\s-]?\d{2}[\s-]?\d{2})|(?:\b[78]?\d{10}\b)/g
  );
  for (const match of matches) {
    const candidate = match[0].trim();
    if (!isServicePhoneNumber(candidate)) {
      return candidate;
    }
  }
  return null;
}

/**
 * Извлечение желаемого времени записи
 */
export function extractPreferredTime(text: string): string | null {
  if (!text || typeof text !== "string") return null;
  const match =
    text.match(
      /(?:сегодня|завтра|послезавтра|пн|вт|ср|чт|пт|сб|вс|понедельник|вторник|среда|четверг|пятница|суббота|воскресенье)?\s*(?:в\s*)?(?:\d{1,2}[:.]\d{2}|\d{1,2}\s*(?:часов|ч|утра|дня|вечера))/i
    ) || text.match(/(?:сегодня|завтра)\s*(?:в\s*\d{1,2}[:.]\d{2})?/i);
  return match ? match[0].trim() : null;
}

/**
 * Извлечение фиксированной цены / сметы из сообщения
 */
export function extractFixedPrice(text: string): number | null {
  if (!text || typeof text !== "string") return null;
  const match =
    text.match(/(?:зафиксировать\s+(?:специальную\s+|фиксированную\s+)?цену|фиксируем\s+цену|цена|стоимость|смета|итог|на сумму|сумма)[:\s]+(\d[\d\s]{2,8})\s*(?:₽|руб|р\b|$)/i) ||
    text.match(/\[(?:ФИКСАЦИЯ ЦЕНЫ|СМЕТА):\s*(\d[\d\s]{2,8})\s*(?:₽|руб)?\]/i) ||
    text.match(/(\d[\d\s]{2,7})\s*(?:₽|руб)/i);
  if (match) {
    const rawDigits = match[1].replace(/\s/g, "");
    const parsed = parseInt(rawDigits, 10);
    if (!isNaN(parsed) && parsed >= 300 && parsed < 1000000) {
      return parsed;
    }
  }
  return null;
}

/**
 * Сохранить или обновить лид в таблице service_leads
 */
export async function saveOrUpdateServiceLead(
  lead: ServiceLeadData
): Promise<{ id: string } | null> {
  const token = lead.clientToken || "guest_default";

  // Защита: телефон сервиса не должен попадать в базу лидов
  if (lead.phone && isServicePhoneNumber(lead.phone)) {
    console.log(`[supabase] Filtered out service's own phone (${lead.phone}) from client lead`);
    lead.phone = undefined;
  }

  const isPriceLock = Boolean(lead.notes && (lead.notes.includes("ФИКСАЦИЯ ЦЕНЫ") || lead.notes.includes("СМЕТА")));

  // Если нет контакта клиента (ни телефона, ни telegram) и нет фиксации цены — не сохраняем
  if (!lead.phone && !lead.telegram && !isPriceLock) {
    console.log("[supabase] No valid customer contact (phone or telegram) and no price lock. Skipping service_lead creation.");
    return null;
  }

  if (supabaseAdmin) {
    try {
      let existingLeadId: string | null = null;

      if (lead.sessionId) {
        const { data: bySession } = await supabaseAdmin
          .from("service_leads")
          .select("id")
          .eq("session_id", lead.sessionId)
          .order("created_at", { ascending: false })
          .limit(1);

        if (bySession && bySession.length > 0) {
          existingLeadId = bySession[0].id;
        }
      }

      if (!existingLeadId && lead.clientToken) {
        const { data: byToken } = await supabaseAdmin
          .from("service_leads")
          .select("id")
          .eq("client_token", lead.clientToken)
          .order("created_at", { ascending: false })
          .limit(1);

        if (byToken && byToken.length > 0) {
          existingLeadId = byToken[0].id;
        }
      }

      if (existingLeadId) {
        // Обновляем существующий лид
        const updatePayload: Record<string, any> = {
          updated_at: new Date().toISOString(),
        };
        if (lead.phone) updatePayload.phone = lead.phone;
        if (lead.telegram) updatePayload.telegram = lead.telegram;
        if (lead.car) updatePayload.car = lead.car;
        if (lead.preferredTime) updatePayload.preferred_time = lead.preferredTime;
        if (lead.serviceRequested) updatePayload.service_requested = lead.serviceRequested;
        if (lead.clientName) updatePayload.client_name = lead.clientName;
        if (lead.notes) updatePayload.notes = lead.notes;

        const { data: updated } = await supabaseAdmin
          .from("service_leads")
          .update(updatePayload)
          .eq("id", existingLeadId)
          .select("id")
          .single();

        console.log(`[supabase] Updated service_lead ${existingLeadId} (phone=${lead.phone}, tg=${lead.telegram})`);
        return updated || { id: existingLeadId };
      } else {
        // Создаем новый лид
        const payload = {
          session_id: lead.sessionId || null,
          client_token: token,
          client_name: lead.clientName || null,
          phone: lead.phone || null,
          telegram: lead.telegram || null,
          car: lead.car || null,
          service_requested: lead.serviceRequested || null,
          preferred_time: lead.preferredTime || null,
          notes: lead.notes || null,
          status: "new",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { data: inserted, error: insErr } = await supabaseAdmin
          .from("service_leads")
          .insert(payload)
          .select("id")
          .single();

        if (insErr) {
          console.warn("[supabase] Failed to insert service_lead:", insErr.message);
        } else {
          console.log(`[supabase] Created new service_lead ${inserted?.id} (phone=${lead.phone}, tg=${lead.telegram})`);
        }

        // Обновляем статус сессии на 'lead_captured'
        if (lead.sessionId) {
          await supabaseAdmin
            .from("chat_sessions")
            .update({
              status: "lead_captured",
              client_phone: lead.phone || undefined,
              updated_at: new Date().toISOString(),
            })
            .eq("id", lead.sessionId);
        }

        return inserted || null;
      }
    } catch (e: any) {
      console.warn("[supabase] saveOrUpdateServiceLead error:", e.message);
    }
  }

  return null;
}

// Алиас для обратной совместимости
export async function getSessionContextHistory(
  sessionToken: string,
  maxTurns = 10
) {
  const ctx = await getSessionContext(sessionToken, maxTurns);
  return ctx.history;
}

// ---------------------------------------------------------------------------
// 7. Согласия на обработку ПДн, оферту и куки (152-ФЗ РФ, ст. 437 ГК РФ)
// Унификация строго по ID сессии (без хранения ФИО и телефона)
// ---------------------------------------------------------------------------
export interface UserConsentRecord {
  sessionId: string;
  consentPdan: boolean;
  consentOferta: boolean;
  consentCookies: boolean;
  status?: "granted" | "revoked";
  consentSource: string; // 'ai_consultant', 'cookie_banner', 'contacts_matrix', 'oferta_page', 'privacy_policy_page'
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Логирование и фиксация согласия пользователя:
 * 1. В базу данных Supabase (таблица user_consents) по ID сессии
 * 2. Локально на серверный диск в файл logs/consents_audit.log (для юридического аудита)
 */
export async function saveUserConsent(
  record: UserConsentRecord
): Promise<{ id: string; success: boolean; status: string }> {
  const timestamp = new Date().toISOString();
  const consentStatus = record.status || (record.consentPdan || record.consentOferta ? "granted" : "revoked");
  let generatedId = "";

  // 1. Сохранение в Supabase
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from("user_consents")
        .insert({
          session_id: record.sessionId,
          consent_pdan: Boolean(record.consentPdan),
          consent_oferta: Boolean(record.consentOferta),
          consent_cookies: Boolean(record.consentCookies),
          status: consentStatus,
          consent_source: record.consentSource || "direct",
          ip_address: record.ipAddress || null,
          user_agent: record.userAgent || null,
          created_at: timestamp,
          updated_at: timestamp,
        })
        .select("id")
        .single();

      if (!error && data?.id) {
        generatedId = data.id;
      } else if (error) {
        console.warn("[supabase] user_consents insert error:", error.message);
      }
    } catch (e: any) {
      console.warn("[supabase] saveUserConsent exception:", e.message);
    }
  }

  if (!generatedId) {
    generatedId = "local_" + Math.random().toString(36).substring(2, 10);
  }

  // 2. Локальная запись в файл logs/consents_audit.log
  try {
    const fs = await import("fs");
    const path = await import("path");
    const logDir = path.join(process.cwd(), "logs");
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    const logFilePath = path.join(logDir, "consents_audit.log");
    const logLine = `[${timestamp}] ID=${generatedId} SESSION=${record.sessionId} STATUS=${consentStatus} SOURCE=${record.consentSource} IP=${record.ipAddress || "-"} PDAN=${record.consentPdan} OFERTA=${record.consentOferta} COOKIES=${record.consentCookies}\n`;
    fs.appendFileSync(logFilePath, logLine, "utf-8");
  } catch (fsErr: any) {
    console.warn("[audit log] Failed to write local consents_audit.log:", fsErr.message);
  }

  return { id: generatedId, success: true, status: consentStatus };
}



