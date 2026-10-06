import fs from "fs";
import path from "path";
import {
  AI_SYSTEM_PROMPT,
  AUTOBOX_SYSTEM_PROMPT,
  getAvailableModels,
  OpenRouterModelConfig,
  SALES_BOOKING_SCRIPT,
  SESSION_SETTINGS,
} from "@/config/ai.config";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type FreeModelOption = OpenRouterModelConfig;

/**
 * Реестр моделей OpenRouter из центрального конфига src/config/ai.config.ts
 */
export const FREE_MODELS = getAvailableModels();

export { AI_SYSTEM_PROMPT, AUTOBOX_SYSTEM_PROMPT };

/**
 * Prominent error logger: formats error visibly in console & logs to openrouter_errors.log
 */
export function logOpenRouterError(params: {
  model: string;
  status?: number;
  message: string;
  details?: string;
  sessionId?: string;
  attempt?: number;
}) {
  const now = new Date().toISOString();
  const banner = [
    "",
    "╔══════════════════════════════════════════════════════════════════════════════╗",
    `║ 🚨 [OPENROUTER API ERROR] ${now}`,
    "╠══════════════════════════════════════════════════════════════════════════════╣",
    `║ Модель:   ${params.model}`,
    `║ Статус:   ${params.status || "N/A"}`,
    `║ Сессия:   ${params.sessionId || "anonymous"}`,
    `║ Ошибка:   ${params.message}`,
    params.details ? `║ Детали:   ${params.details.substring(0, 180)}` : "",
    "╚══════════════════════════════════════════════════════════════════════════════╝",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  // Prominent terminal output
  console.error(banner);

  // Persistent file log
  try {
    const logPath = path.join(process.cwd(), "openrouter_errors.log");
    const logEntry = `[${now}] MODEL=${params.model} STATUS=${params.status || "ERR"} SESSION=${
      params.sessionId || "-"
    }\nERROR: ${params.message}\nDETAILS: ${params.details || "-"}\n---\n`;
    fs.appendFileSync(logPath, logEntry, "utf8");
  } catch (fsErr) {
    console.error("Failed to write to openrouter_errors.log:", fsErr);
  }
}

export interface QueryOpenRouterResult {
  text: string;
  modelUsed: string;
  isPaid: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUsd?: number;
  };
}

/**
 * Query OpenRouter with automatic fallbacks and robust error suppression
 */
export async function queryOpenRouter(
  messages: ChatMessage[],
  apiKey?: string,
  model = "openrouter/free",
  sessionId?: string
): Promise<QueryOpenRouterResult> {
  const token = apiKey || process.env.OPENROUTER_API_KEY;

  if (!token) {
    throw new Error("OPENROUTER_API_KEY_MISSING");
  }

  // Build ordered list of free models starting with the selected one
  const allFreeModelIds = FREE_MODELS.map((m) => m.id);
  const prioritizedModels = Array.from(new Set([model, ...allFreeModelIds]));

  let lastError: Error | null = null;

  for (let i = 0; i < prioritizedModels.length; i++) {
    const currentModel = prioritizedModels[i];
    const fallbackList = prioritizedModels.slice(i + 1);

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "HTTP-Referer": "https://autobox74.ru",
          "X-Title": "AutoBox74 AI Consultant",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: currentModel,
          // OpenRouter native fallback routing: accepts at most 3 fallback models
          models: fallbackList.length > 0 ? fallbackList.slice(0, 3) : undefined,
          messages,
          temperature: 0.3,
          max_tokens: 2500,
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        logOpenRouterError({
          model: currentModel,
          status: res.status,
          message: `HTTP Error ${res.status}`,
          details: errText,
          sessionId,
          attempt: i + 1,
        });
        lastError = new Error(`Model ${currentModel} returned ${res.status}: ${errText}`);
        continue; // Try next model in loop
      }

      const data = await res.json();

      // Check if OpenRouter returned an upstream error object with 200 OK
      if (data.error) {
        logOpenRouterError({
          model: currentModel,
          status: 200,
          message: data.error.message || "Upstream Provider Error",
          details: JSON.stringify(data.error),
          sessionId,
          attempt: i + 1,
        });
        lastError = new Error(data.error.message || "Upstream Provider Error");
        continue;
      }

      const choice = data.choices?.[0];
      const messageObj = choice?.message;
      let content = messageObj?.content;

      // In case of reasoning models with empty content, extract reasoning summary if safe
      if (!content && messageObj?.reasoning) {
        // Strip developer thinking headers if present
        const reasoningCleaned = messageObj.reasoning
          .replace(/^Here's a thinking process:[\s\S]*?(?=\n\n[А-ЯA-Z0-9])/i, "")
          .replace(/<think>[\s\S]*?<\/think>/g, "")
          .trim();
        if (reasoningCleaned) {
          content = reasoningCleaned;
        }
      }

      if (content && typeof content === "string" && content.trim().length > 0) {
        let cleaned = content.trim();

        // Strip <think> tags if present
        cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, "").trim();

        // If a model outputs internal thinking stream in English before Russian reply
        if (/^(?:The user|We need|Here's a thinking|Thinking Process|Let me analyze|Let's structure|I need to|To respond to)/i.test(cleaned)) {
          const splitPoint = cleaned.search(/(?:\n\n|\n)(?:Здравствуйте|Добрый день|Приветствую|\*\*|[А-ЯЁ][а-яё]+)/);
          if (splitPoint !== -1 && splitPoint > 30) {
            cleaned = cleaned.slice(splitPoint).trim();
          }
        }

        // Convert any markdown tables to clean, compact bullet lists without pipes or ASCII graphics
        cleaned = cleaned.replace(/^[ \t]*\|?[\s-:]+\|[\s\-:|]+$/gm, "");
        cleaned = cleaned.replace(/^[ \t]*\|[ \t]*([^|\r\n]+?)[ \t]*\|[ \t]*([^|\r\n]+?)[ \t]*\|?[ \t]*$/gm, (_, p1, p2) => {
          const col1 = p1.trim();
          const col2 = p2.trim();
          if (/^(?:операция|услуга|наименование|деталь|вид работ)$/i.test(col1)) return "";
          return `• ${col1} — ${col2}`;
        });

        // Clean any pseudo-graphics divider lines (---, ===, ___, ***)
        cleaned = cleaned
          .replace(/^[ \t]*[-=_*]{3,}[ \t]*$/gm, "")
          .replace(/\n{3,}/g, "\n\n")
          .trim();

        const isPaid = !currentModel.endsWith(":free") && currentModel !== "openrouter/free";
        const usageData =
          isPaid && data.usage
            ? {
                promptTokens: data.usage.prompt_tokens || 0,
                completionTokens: data.usage.completion_tokens || 0,
                totalTokens: data.usage.total_tokens || 0,
                costUsd: typeof data.usage.cost === "number" ? data.usage.cost : undefined,
              }
            : undefined;

        return {
          text: cleaned,
          modelUsed: data.model || currentModel,
          isPaid,
          usage: usageData,
        };
      } else {
        logOpenRouterError({
          model: currentModel,
          status: 200,
          message: "Model returned empty content",
          details: JSON.stringify(choice || data),
          sessionId,
          attempt: i + 1,
        });
      }
    } catch (err: any) {
      logOpenRouterError({
        model: currentModel,
        message: err.message || "Fetch Exception",
        details: err.stack,
        sessionId,
        attempt: i + 1,
      });
      lastError = err;
    }
  }

  throw lastError || new Error("All free OpenRouter models failed");
}
