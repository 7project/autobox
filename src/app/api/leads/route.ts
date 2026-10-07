import { NextRequest, NextResponse } from "next/server";
import {
  isServicePhoneNumber,
  saveOrUpdateServiceLead,
  saveUserConsent,
} from "@/lib/supabase";
import { TARGET_TEST_EMAIL } from "@/lib/mailer";
import nodemailer from "nodemailer";

interface LeadSubmissionRequest {
  clientName?: string;
  phone: string;
  telegram?: string;
  car?: string;
  category?: string;
  symptom: string;
  preferredTime?: string;
  estimatedWork?: number;
  estimatedParts?: number;
  estimatedTotal?: number;
  source?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: LeadSubmissionRequest = await req.json();
    const {
      clientName,
      phone,
      telegram,
      car,
      category,
      symptom,
      preferredTime,
      estimatedWork,
      estimatedParts,
      estimatedTotal,
      source = "contacts_calculator",
    } = body;

    // 1. Validation
    if (!phone || typeof phone !== "string" || !phone.trim()) {
      return NextResponse.json(
        { error: "Пожалуйста, укажите контактный номер телефона" },
        { status: 400 }
      );
    }

    // 2. Protect against treating service's own number as a lead
    if (isServicePhoneNumber(phone)) {
      return NextResponse.json(
        {
          error:
            "Указан служебный номер автосервиса. Пожалуйста, укажите ваш личный номер телефона.",
        },
        { status: 400 }
      );
    }

    const now = new Date();
    const timeFormatted = now.toLocaleString("ru-RU", {
      timeZone: "Asia/Yekaterinburg",
    });
    const bookingNumber = "AB-" + Math.floor(100000 + Math.random() * 900000);

    const notesSummary = [
      `Категория: ${category || "Общий осмотр"}`,
      `Симптом: ${symptom}`,
      estimatedTotal ? `Оценка сметы: ${estimatedTotal} ₽ (работа: ${estimatedWork || 0} ₽, детали: ${estimatedParts || 0} ₽)` : null,
      `Желаемое время: ${preferredTime || "Ближайшее окно"}`,
      `Источник: ${source}`,
      `Талон: ${bookingNumber}`,
    ]
      .filter(Boolean)
      .join(" | ");

    // 3. Save to Supabase (service_leads)
    let leadRecord: any = null;
    try {
      leadRecord = await saveOrUpdateServiceLead({
        clientToken: `web_${bookingNumber}`,
        clientName: clientName || undefined,
        phone: phone.trim(),
        telegram: telegram ? telegram.trim() : undefined,
        car: car || undefined,
        serviceRequested: `${category ? `[${category}] ` : ""}${symptom}`,
        preferredTime: preferredTime || undefined,
        notes: notesSummary,
      });

      // 3.1 Фиксация согласия на обработку ПДн и Оферту (152-ФЗ РФ)
      const forwardedFor = req.headers.get("x-forwarded-for");
      const realIp = req.headers.get("x-real-ip");
      const clientIp = (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp) || "127.0.0.1";
      await saveUserConsent({
        clientToken: `web_${bookingNumber}`,
        ipAddress: clientIp,
        userAgent: req.headers.get("user-agent") || "unknown",
        consentPdan: true,
        consentOferta: true,
        consentCookies: true,
        consentSource: source || "leads_booking",
        clientPhone: phone.trim(),
        clientName: clientName || undefined,
      }).catch((cErr) => console.warn("[leads API] Consent log error:", cErr));
    } catch (dbErr: any) {
      console.error("[leads API] Supabase save error:", dbErr);
    }

    // 4. Send Telegram Notification (if bot token and chat ID are configured)
    const tgBotToken = process.env.TELEGRAM_BOT_TOKEN;
    const tgChatId = process.env.TELEGRAM_CHAT_ID;

    if (tgBotToken && tgChatId) {
      try {
        const tgMessage = [
          `🔔 *НОВАЯ ЗАПИСЬ В БОКС АВТОБОКС74* (${bookingNumber})`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
          `👤 *Клиент:* ${clientName || "Не указано"}`,
          `📞 *Телефон:* \`${phone}\``,
          telegram ? `💬 *Telegram:* ${telegram}` : null,
          `🚗 *Автомобиль:* *${car || "Уточняется"}*`,
          `🔧 *Категория:* ${category || "Общая"}`,
          `⚠️ *Симптом/Услуга:* ${symptom}`,
          estimatedTotal ? `💰 *Оценка сметы:* *${estimatedTotal.toLocaleString("ru-RU")} ₽*` : null,
          `⏰ *Желаемое время:* *${preferredTime || "Ближайшее окно"}*`,
          `🕒 *Дата заявки:* ${timeFormatted}`,
          `📍 *Адрес:* г. Миасс, ул. Печёнкина, 1а`,
          `━━━━━━━━━━━━━━━━━━━━━━`,
        ]
          .filter(Boolean)
          .join("\n");

        await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: tgMessage,
            parse_mode: "Markdown",
          }),
        });
      } catch (tgErr) {
        console.warn("[leads API] Telegram notification error:", tgErr);
      }
    }

    // 5. Send Email Notification (if SMTP configured)
    try {
      const emailUser = process.env.SMTP_USER;
      const emailPass = process.env.SMTP_PASSWORD;
      const emailHost = process.env.SMTP_HOST || "smtp.mail.ru";
      const emailPort = Number(process.env.SMTP_PORT) || 465;

      if (emailUser && emailPass) {
        const transporter = nodemailer.createTransport({
          host: emailHost,
          port: emailPort,
          secure: emailPort === 465,
          auth: { user: emailUser, pass: emailPass },
        });

        await transporter.sendMail({
          from: `"AutoBox74 Сайт" <${emailUser}>`,
          to: TARGET_TEST_EMAIL,
          subject: `🚗 Новая запись в бокс #${bookingNumber}: ${car || "Авто"} (${phone})`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
              <h2 style="color: #16a34a; margin-top: 0;">Новая заявка с сайта Автобокс74</h2>
              <p><strong>Талон брони:</strong> ${bookingNumber}</p>
              <p><strong>Клиент:</strong> ${clientName || "Не указано"}</p>
              <p><strong>Телефон:</strong> <a href="tel:${phone}">${phone}</a></p>
              ${telegram ? `<p><strong>Telegram:</strong> ${telegram}</p>` : ""}
              <p><strong>Автомобиль:</strong> ${car || "Не указан"}</p>
              <p><strong>Услуга / Симптом:</strong> ${symptom}</p>
              ${estimatedTotal ? `<p><strong>Предварительный расчет:</strong> ${estimatedTotal} ₽</p>` : ""}
              <p><strong>Желаемое время:</strong> ${preferredTime || "Ближайшее свободное"}</p>
              <p><strong>Время создания:</strong> ${timeFormatted} (Миасс)</p>
            </div>
          `,
        });
      }
    } catch (mailErr) {
      console.warn("[leads API] Mail error (skipped):", mailErr);
    }

    return NextResponse.json({
      success: true,
      bookingNumber,
      leadId: leadRecord?.id || null,
      message: "Заявка успешно зафиксирована в системе автосервиса",
      estimatedTotal: estimatedTotal || null,
    });
  } catch (error: any) {
    console.error("[leads API error]:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка при сохранении заявки" },
      { status: 500 }
    );
  }
}
