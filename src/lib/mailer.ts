import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";

export interface DialogLeadPayload {
  sessionToken: string;
  phone?: string;
  car?: string;
  dialogHistory: { role: string; content: string }[];
  clientIp?: string;
  source?: string;
}

export const TARGET_TEST_EMAIL = process.env.LEAD_NOTIFICATION_EMAIL || process.env.NOTIFICATION_EMAIL || "info@autobox74.ru";

export async function sendLeadNotificationEmail(payload: DialogLeadPayload): Promise<{ success: boolean; mode: string; message: string }> {
  const recipient = TARGET_TEST_EMAIL;
  const now = new Date().toLocaleString("ru-RU", { timeZone: "Asia/Yekaterinburg" });

  const subject = `🚗 Новая заявка / диалог с сайта AutoBox74rus (${now})`;

  const textLines = [
    `=== НОВАЯ ЗАЯВКА С САЙТА AUTOBOX74.RU ===`,
    `Время обращения: ${now} (Миасс)`,
    `Телефон клиента: ${payload.phone || "Не указан (только чат)"}`,
    `Автомобиль: ${payload.car || "Уточняется в диалоге"}`,
    `Токен сессии: ${payload.sessionToken}`,
    `IP адрес: ${payload.clientIp || "localhost"}`,
    `\n--- ИСТОРИЯ ДИАЛОГА С AI-КОНСУЛЬТАНТОМ (последние сообщения) ---`,
    ...payload.dialogHistory.map((m, i) => `${i + 1}. [${m.role === "user" ? "Клиент" : "AI-Консультант"}]: ${m.content}\n`),
    `=========================================`,
  ];

  const fullText = textLines.join("\n");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
      <div style="background-color: #0f1117; color: #ffffff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; color: #22c55e;">AutoBox74rus</h2>
        <p style="margin: 5px 0 0 0; font-size: 13px; color: #9ca3af;">Новый диалог с клиентом (г. Миасс, ул. Печёнкина, 1а)</p>
      </div>
      <div style="padding: 20px; background-color: #ffffff; color: #1e293b;">
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0 0 8px 0;"><strong>📞 Телефон:</strong> <span style="font-size: 16px; color: #16a34a; font-weight: bold;">${payload.phone || "Уточняется в переписке"}</span></p>
          <p style="margin: 0 0 8px 0;"><strong>🚘 Автомобиль:</strong> ${payload.car || "Не указан"}</p>
          <p style="margin: 0; font-size: 12px; color: #64748b;"><strong>🕒 Дата:</strong> ${now}</p>
        </div>

        <h3 style="font-size: 14px; text-transform: uppercase; color: #475569; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px;">Стенограмма переписки:</h3>
        <div style="margin-top: 12px; font-size: 13px; line-height: 1.6;">
          ${payload.dialogHistory.map((m) => `
            <div style="margin-bottom: 10px; padding: 10px; border-radius: 8px; background-color: ${m.role === "user" ? "#dcfce7" : "#f8fafc"}; border: 1px solid ${m.role === "user" ? "#86efac" : "#e2e8f0"};">
              <strong style="color: ${m.role === "user" ? "#166534" : "#334155"};">${m.role === "user" ? "Клиент" : "AI-Консультант"}:</strong>
              <div style="margin-top: 4px; white-space: pre-wrap;">${m.content}</div>
            </div>
          `).join("")}
        </div>
      </div>
      <div style="background-color: #f8fafc; padding: 12px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        Уведомление отправлено на ${recipient} • Автосервис Автобокс74rus Миасс
      </div>
    </div>
  `;

  // Check if SMTP is configured
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: `"AutoBox74 Бот" <${smtpUser}>`,
        to: recipient,
        subject,
        text: fullText,
        html: htmlContent,
      });

      console.log(`[Email sent] Successfully delivered lead email to ${recipient}`);
      return { success: true, mode: "smtp", message: `Письмо успешно отправлено на ${recipient}` };
    } catch (err: any) {
      console.error("[Email SMTP error]:", err);
      // Fallback to file logging so lead is never lost
    }
  }

  // Backup file logger for test mode / fallback
  try {
    const logPath = path.join(process.cwd(), "leads_mail_log.txt");
    const logEntry = `\n[${new Date().toISOString()}] TO: ${recipient}\n${fullText}\n----------------------------------------\n`;
    fs.appendFileSync(logPath, logEntry, "utf8");
    console.log(`[Email logged] Saved lead to leads_mail_log.txt for ${recipient}`);
  } catch (logErr) {
    console.warn("Failed to write to leads_mail_log.txt", logErr);
  }

  return {
    success: true,
    mode: "test_logger",
    message: `Диалог зафиксирован для ${recipient} (сохранен в leads_mail_log.txt). Для реальной отправки через почтовый сервер укажите SMTP_USER и SMTP_PASS в .env.local.`,
  };
}
