/**
 * ==============================================================================
 * AUTOBOX74 - RATE LIMITING & TOKEN SPENDING GUARD (SECURITY ENGINE)
 * ==============================================================================
 * Защищает баланс OpenRouter и сервер от спам-атак и бесконтрольного расхода токенов.
 * Все числовые лимиты настраиваются через переменные окружения (.env / .env.local).
 */

export interface SecurityConfig {
  cooldownSeconds: number; // Кулдаун между сообщениями (по умолч.: 5 сек)
  maxMessageLength: number; // Максимальная длина текста вопроса (по умолч.: 600 симв)
  dailyPaidLimit: number; // Максимум платных ответов в сутки на весь сервис (по умолч.: 100)
  paidSessionsPerDay: number; // Максимум платных сессий на 1 клиента/IP в сутки (по умолч.: 2)
  ipMaxPerMinute: number; // Максимум запросов в минуту с одного IP (по умолч.: 6)
  ipMaxPerHour: number; // Максимум запросов в час с одного IP (по умолч.: 40)
}

/**
 * Получить актуальные настройки безопасности из переменных окружения
 */
export function getSecurityConfig(): SecurityConfig {
  return {
    cooldownSeconds: Math.max(1, parseInt(process.env.CHAT_COOLDOWN_SECONDS || "5", 10)),
    maxMessageLength: Math.max(100, parseInt(process.env.CHAT_MAX_MESSAGE_LENGTH || "600", 10)),
    dailyPaidLimit: Math.max(1, parseInt(process.env.CHAT_DAILY_PAID_LIMIT || "100", 10)),
    paidSessionsPerDay: Math.max(1, parseInt(process.env.CHAT_PAID_SESSIONS_PER_DAY || "2", 10)),
    ipMaxPerMinute: Math.max(1, parseInt(process.env.CHAT_IP_MAX_REQUESTS_PER_MINUTE || "6", 10)),
    ipMaxPerHour: Math.max(5, parseInt(process.env.CHAT_IP_MAX_REQUESTS_PER_HOUR || "40", 10)),
  };
}

interface IpRecord {
  lastRequestTime: number;
  timestampsMinute: number[];
  timestampsHour: number[];
}

interface DailyPaidTracker {
  dayKey: string; // Формат YYYY-MM-DD
  totalPaidCalls: number;
  ipPaidSessions: Map<string, Set<string>>; // ip -> Set<sessionId/token>
}

// In-Memory структуры хранения с очисткой
const ipRecords = new Map<string, IpRecord>();

let dailyTracker: DailyPaidTracker = {
  dayKey: getTodayKey(),
  totalPaidCalls: 0,
  ipPaidSessions: new Map(),
};

function getTodayKey(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function ensureTodayTracker(): DailyPaidTracker {
  const today = getTodayKey();
  if (dailyTracker.dayKey !== today) {
    dailyTracker = {
      dayKey: today,
      totalPaidCalls: 0,
      ipPaidSessions: new Map(),
    };
  }
  return dailyTracker;
}

// Регулярная очистка устаревших IP записей раз в 10 минут
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, rec] of ipRecords.entries()) {
      if (now - rec.lastRequestTime > 3600 * 1000) {
        ipRecords.delete(ip);
      }
    }
  }, 10 * 60 * 1000);
}

export interface RateLimitCheckResult {
  allowed: boolean;
  reason?: "COOLDOWN" | "RATE_LIMIT_MINUTE" | "RATE_LIMIT_HOUR" | "MESSAGE_TOO_LONG" | "BOT_TRAP";
  waitTimeSeconds?: number;
  message?: string;
}

/**
 * Проверка частоты запросов, кулдауна и ловушки ботов
 */
export function checkChatRateLimit(
  clientIp: string,
  userMessage: string,
  botTrapField?: string
): RateLimitCheckResult {
  const config = getSecurityConfig();
  const now = Date.now();

  // 1. Проверка Honeypot-ловушки для ботов
  if (botTrapField && botTrapField.trim().length > 0) {
    console.warn(`[security:honeypot] Bot trap triggered from IP ${clientIp}: "${botTrapField}"`);
    return {
      allowed: false,
      reason: "BOT_TRAP",
      message: "Робот обнаружен",
    };
  }

  // 2. Проверка длины сообщения
  if (userMessage.length > config.maxMessageLength) {
    return {
      allowed: false,
      reason: "MESSAGE_TOO_LONG",
      message: `Вопрос слишком длинный (${userMessage.length} символов). Максимальная длина — ${config.maxMessageLength} символов. Пожалуйста, сократите текст.`,
    };
  }

  // Получаем или инициализируем запись IP
  let rec = ipRecords.get(clientIp);
  if (!rec) {
    rec = {
      lastRequestTime: 0,
      timestampsMinute: [],
      timestampsHour: [],
    };
    ipRecords.set(clientIp, rec);
  }

  // 3. Проверка кулдауна между репликами (по умолчанию 5 секунд)
  const elapsedSinceLast = (now - rec.lastRequestTime) / 1000;
  if (elapsedSinceLast < config.cooldownSeconds) {
    const waitTime = Math.ceil(config.cooldownSeconds - elapsedSinceLast);
    return {
      allowed: false,
      reason: "COOLDOWN",
      waitTimeSeconds: waitTime,
      message: `Подождите ${waitTime} сек. перед отправкой следующего сообщения.`,
    };
  }

  // 4. Очистка старых меток минутного и часового окна
  const oneMinuteAgo = now - 60 * 1000;
  const oneHourAgo = now - 3600 * 1000;
  rec.timestampsMinute = rec.timestampsMinute.filter((t) => t > oneMinuteAgo);
  rec.timestampsHour = rec.timestampsHour.filter((t) => t > oneHourAgo);

  // 5. Проверка минутного лимита
  if (rec.timestampsMinute.length >= config.ipMaxPerMinute) {
    return {
      allowed: false,
      reason: "RATE_LIMIT_MINUTE",
      waitTimeSeconds: 30,
      message: "Слишком частые запросы. Подождите 30 секунд.",
    };
  }

  // 6. Проверка часового лимита
  if (rec.timestampsHour.length >= config.ipMaxPerHour) {
    return {
      allowed: false,
      reason: "RATE_LIMIT_HOUR",
      waitTimeSeconds: 300,
      message: "Превышен часовой лимит запросов для вашего адреса. Позвоните мастеру: +7 (995) 927-77-54",
    };
  }

  // Обновляем метки времени
  rec.lastRequestTime = now;
  rec.timestampsMinute.push(now);
  rec.timestampsHour.push(now);

  return { allowed: true };
}

export interface PaidGuardCheckResult {
  isAllowed: boolean;
  effectiveModel: string;
  downgraded: boolean;
  downgradeReason?: "DAILY_BUDGET_EXCEEDED" | "SESSION_QUOTA_EXCEEDED";
  remainingPaidBudget: number;
}

/**
 * Проверка разрешения на использование платной модели (Circuit Breaker)
 */
export function guardPaidModelUsage(
  requestedModel: string,
  clientIp: string,
  sessionToken: string
): PaidGuardCheckResult {
  const config = getSecurityConfig();
  const tracker = ensureTodayTracker();

  // Если модель бесплатная — пропускаем без ограничений
  const isPaid = !requestedModel.endsWith(":free") && requestedModel !== "openrouter/free";
  if (!isPaid) {
    return {
      isAllowed: true,
      effectiveModel: requestedModel,
      downgraded: false,
      remainingPaidBudget: Math.max(0, config.dailyPaidLimit - tracker.totalPaidCalls),
    };
  }

  // 1. Проверка общего суточного лимита платных вызовов (Circuit Breaker: макс 100)
  if (tracker.totalPaidCalls >= config.dailyPaidLimit) {
    console.warn(
      `[security:budget] Daily paid limit reached (${tracker.totalPaidCalls}/${config.dailyPaidLimit}). Downgrading to openrouter/free.`
    );
    return {
      isAllowed: false,
      effectiveModel: "openrouter/free",
      downgraded: true,
      downgradeReason: "DAILY_BUDGET_EXCEEDED",
      remainingPaidBudget: 0,
    };
  }

  // 2. Проверка лимита сессий на пользователя/IP (макс 2 сессии в сутки)
  let sessionsForIp = tracker.ipPaidSessions.get(clientIp);
  if (!sessionsForIp) {
    sessionsForIp = new Set();
    tracker.ipPaidSessions.set(clientIp, sessionsForIp);
  }

  // Если эта сессия еще не использовала платную модель, но у IP уже исчерпан лимит 2 сессий
  if (!sessionsForIp.has(sessionToken) && sessionsForIp.size >= config.paidSessionsPerDay) {
    console.warn(
      `[security:quota] IP ${clientIp} exceeded daily paid sessions limit (${sessionsForIp.size}/${config.paidSessionsPerDay}). Downgrading to openrouter/free.`
    );
    return {
      isAllowed: false,
      effectiveModel: "openrouter/free",
      downgraded: true,
      downgradeReason: "SESSION_QUOTA_EXCEEDED",
      remainingPaidBudget: Math.max(0, config.dailyPaidLimit - tracker.totalPaidCalls),
    };
  }

  // Регистрируем эту сессию в списке платных сессий данного IP
  sessionsForIp.add(sessionToken);

  return {
    isAllowed: true,
    effectiveModel: requestedModel,
    downgraded: false,
    remainingPaidBudget: Math.max(0, config.dailyPaidLimit - tracker.totalPaidCalls),
  };
}

/**
 * Зафиксировать успешный платный вызов (инкремент суточного счетчика)
 */
export function recordPaidModelCall(): void {
  const tracker = ensureTodayTracker();
  tracker.totalPaidCalls += 1;
}

/**
 * Получить текущую статистику расхода бюджета
 */
export function getPaidUsageStats() {
  const config = getSecurityConfig();
  const tracker = ensureTodayTracker();
  return {
    todayKey: tracker.dayKey,
    totalPaidCallsToday: tracker.totalPaidCalls,
    dailyLimit: config.dailyPaidLimit,
    remainingPaidCalls: Math.max(0, config.dailyPaidLimit - tracker.totalPaidCalls),
    uniqueIpCount: tracker.ipPaidSessions.size,
  };
}
