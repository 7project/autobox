"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  Send,
  RotateCcw,
  Key,
  ShieldCheck,
  Cpu,
  ChevronDown,
  Check,
  Sparkles,
  Coins,
} from "lucide-react";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
  time: string;
  isRealAi?: boolean;
  modelUsed?: string;
  isPaid?: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    costUsd?: number;
  };
  leadCaptured?: boolean;
  quickReplies?: string[];
}

import {
  CONFIGURED_OPENROUTER_MODELS,
  SESSION_SETTINGS,
  OpenRouterModelConfig,
} from "@/config/ai.config";

export type FreeModelOption = OpenRouterModelConfig;

const FREE_MODELS_LIST = CONFIGURED_OPENROUTER_MODELS.filter((m) => m.enabled);

/**
 * Generate a unique client token. Deterministic per browser tab/session.
 */
function getOrCreateToken(): string {
  if (typeof window === "undefined") return "ssr_placeholder";
  let token = localStorage.getItem("autobox_session_token");
  if (!token) {
    token =
      "user_" +
      Math.random().toString(36).substring(2, 11) +
      "_" +
      Date.now().toString(36);
    localStorage.setItem("autobox_session_token", token);
  }
  return token;
}

export function AiAutoConsultant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "bot",
      text: "Здравствуйте! Я онлайн-консультант автосервиса Автобокс74rus в Миассе на ул. Печёнкина, 1а. Помогу рассчитать стоимость ремонта, проверю совместимость деталей по парт-номеру/артикулу и запишу вас на удобное время.",
      time: "Онлайн",
      quickReplies: [
        "Сколько стоит замена масла?",
        "Стучит стойка, что делать?",
        "Проверить артикул 54651-1R000",
        "Как доехать на Печёнкина, 1а?",
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [selectedModel, setSelectedModel] = useState<string>(
    SESSION_SETTINGS.DEFAULT_MODEL_ID
  );
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [turnCount, setTurnCount] = useState<number>(1);
  const [activeCar, setActiveCar] = useState<string | null>(null);
  const [contextSource, setContextSource] = useState<string | null>(null);
  const [fixedPriceInfo, setFixedPriceInfo] = useState<{
    price: number;
    car?: string;
    symptom?: string;
    workCost?: number;
    partsCost?: number;
  } | null>(null);
  const chatFeedRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cooldownLeft, setCooldownLeft] = useState<number>(0);
  const [botTrap, setBotTrap] = useState<string>("");
  const [downgradeNotice, setDowngradeNotice] = useState<string | null>(null);

  // Stable ref for session token — resolved synchronously, never empty
  const tokenRef = useRef<string>(getOrCreateToken());

  // Cooldown timer tick down
  useEffect(() => {
    if (cooldownLeft <= 0) return;
    const interval = setInterval(() => {
      setCooldownLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownLeft]);

  // Hydrate on client only
  useEffect(() => {
    tokenRef.current = getOrCreateToken();

    const savedKey = localStorage.getItem("autobox_openrouter_key");
    if (savedKey) setCustomApiKey(savedKey);

    const savedModel = localStorage.getItem("autobox_selected_free_model");
    if (savedModel && FREE_MODELS_LIST.some((m) => m.id === savedModel) && savedModel !== "minimax/minimax-m3") {
      setSelectedModel(savedModel);
    } else {
      setSelectedModel(SESSION_SETTINGS.DEFAULT_MODEL_ID);
    }

    // Pre-fill input from URL search params (redirected from services, prices, promos, etc.)
    try {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get("service");
      const promoParam = params.get("promo");
      const fromParam = params.get("from");
      const carParam = params.get("car");
      const lockPriceParam = params.get("lockPrice") || params.get("price");
      const symptomParam = params.get("symptom");

      if (lockPriceParam) {
        const total = parseInt(lockPriceParam, 10);
        const car = carParam || "автомобиль";
        const symptom = symptomParam || serviceParam || "ремонт и обслуживание";
        if (!isNaN(total) && total > 0) {
          setFixedPriceInfo({ price: total, car, symptom });
          setInput(`Здравствуйте! Хочу зафиксировать цену ${total.toLocaleString("ru-RU")} ₽ на ${symptom} для ${car}. Помогите согласовать удобное время для записи.`);
          setContextSource(`Фиксация цены: ${total.toLocaleString("ru-RU")} ₽`);
        }
      } else if (promoParam) {
        setInput(`Здравствуйте! Хочу записаться по акции: «${promoParam}». Подскажите свободное время для визита.`);
        setContextSource(`Акция: ${promoParam}`);
      } else if (serviceParam) {
        setInput(`Здравствуйте! Хочу записаться на услугу: «${serviceParam}». Какая ориентировочная стоимость и на когда можно записаться?`);
        setContextSource(`Услуга: ${serviceParam}`);
      } else if (carParam) {
        setInput(`Здравствуйте! У меня ${carParam}. Хочу записаться на диагностику и сервис.`);
        setContextSource(`Автомобиль: ${carParam}`);
      } else if (fromParam) {
        setInput(`Здравствуйте! Хочу записаться на осмотр и обслуживание автомобиля.`);
        setContextSource(`Раздел сайта: ${fromParam}`);
      }
    } catch {}

    // Global listener for locking in price from symptom calculator or contact forms
    const handleLockInPriceEvent = (e: any) => {
      const data = e.detail;
      if (!data) return;

      const total = data.total || data.estimatedTotal;
      const car = data.car || activeCar || "автомобиль";
      const symptom = data.symptom || "диагностика и сервис";
      const phone = data.phone || "";
      const telegram = data.telegram || "";
      const workCost = data.workCost || data.estimatedWork;
      const partsCost = data.partsCost || data.estimatedParts;

      if (total) {
        setFixedPriceInfo({
          price: total,
          car,
          symptom,
          workCost,
          partsCost,
        });
      }

      // Smooth scroll to consultant container
      const container = document.getElementById("ai-chat") || document.getElementById("ai-consultant");
      if (container) {
        container.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      const promptText = `Здравствуйте! Прошу зафиксировать специальную цену ${total ? `${total.toLocaleString("ru-RU")} ₽` : ""} на «${symptom}» для ${car}.${workCost ? ` [Смета: работы ${workCost} ₽, детали ${partsCost || 0} ₽].` : ""}${phone ? ` Мой телефон: ${phone}.` : ""}${telegram ? ` Telegram: ${telegram}.` : ""} Пожалуйста, внесите бронь в базу автосервиса и согласуйте удобное время для визита!`;

      setInput(promptText);
      setTimeout(() => {
        handleSend(promptText);
      }, 300);
    };

    window.addEventListener("autobox_lock_in_price", handleLockInPriceEvent as any);

    // Close dropdown on outside click
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowModelPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("autobox_lock_in_price", handleLockInPriceEvent as any);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (chatFeedRef.current) {
      chatFeedRef.current.scrollTo({
        top: chatFeedRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom("smooth");
  }, [messages, isTyping]);

  const handleSelectModel = (modelId: string) => {
    setSelectedModel(modelId);
    localStorage.setItem("autobox_selected_free_model", modelId);
    setShowModelPicker(false);
  };

  const handleSend = useCallback(
    async (userText: string) => {
      if (!userText.trim() || cooldownLeft > 0) return;

      // Запускаем кулдаун на 5 секунд
      setCooldownLeft(5);

      const userMsg: Message = {
        id: Date.now().toString(),
        sender: "user",
        text: userText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);
      setContextSource(null);

      // Always use the stable ref — never empty, never stale
      const activeToken = tokenRef.current;

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userText,
            sessionToken: activeToken,
            apiKey: customApiKey || undefined,
            model: selectedModel,
            bot_trap: botTrap || undefined,
          }),
        });

        const data = await res.json();

        // Обработка 429 Too Many Requests или превышения длины
        if (res.status === 429 || res.status === 400) {
          const waitTime = data.waitTimeSeconds || 5;
          setCooldownLeft(waitTime);
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              sender: "bot",
              text: `⏱️ ${data.error || "Пожалуйста, подождите несколько секунд перед следующим вопросом."}`,
              time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }

        // Если сработал Circuit Breaker для платной модели
        if (data.isDowngraded) {
          setDowngradeNotice(
            "Суточный лимит платных запросов исчерпан. Консультация продолжается на быстрой бесплатной модели."
          );
        }

        // If the server returned a sessionToken, sync it back
        if (data.sessionToken && data.sessionToken !== activeToken) {
          tokenRef.current = data.sessionToken;
          localStorage.setItem("autobox_session_token", data.sessionToken);
        }

        if (data.activeCar) {
          setActiveCar(data.activeCar);
        }

        if (data.contextReset) {
          setTurnCount(1);
        } else if (data.userTurnCount) {
          setTurnCount(data.userTurnCount);
        } else {
          setTurnCount((prev) =>
            Math.min(prev + 1, SESSION_SETTINGS.CONTEXT_WINDOW_LIMIT)
          );
        }

        let quickReplies: string[] = [];
        const botText = (data.reply || "").toLowerCase();

        if (data.fixedPrice || data.isPriceLocked) {
          const lockedVal = data.fixedPrice || (fixedPriceInfo ? fixedPriceInfo.price : 0);
          if (lockedVal) {
            setFixedPriceInfo((prev) => ({
              price: lockedVal,
              car: data.activeCar || prev?.car || "автомобиль",
              symptom: prev?.symptom || "ремонт и ТО",
              workCost: prev?.workCost,
              partsCost: prev?.partsCost,
            }));
          }

          quickReplies = [
            "Да, бронирую на сегодня 16:30",
            "Да, бронирую на завтра 11:00",
            "Оставить номер телефона",
            "Как к вам доехать?",
          ];
        } else if (data.leadCaptured) {
          if (data.leadDetails?.telegram) {
            quickReplies = [
              "Задать другой вопрос",
              "Как доехать на Печёнкина, 1а?",
              "Позвонить +7 (995) 927-77-54",
            ];
          } else {
            quickReplies = [
              "Мой Telegram @...",
              "Как доехать на Печёнкина, 1а?",
              "Задать другой вопрос",
            ];
          }
        } else if (
          botText.includes("забронировать") ||
          botText.includes("окна") ||
          botText.includes("подъемник") ||
          botText.includes("запись") ||
          botText.includes("слот")
        ) {
          quickReplies = [
            "Записаться на сегодня 16:30",
            "Записаться на завтра 11:00",
            "Оставить телефон для брони",
            "Позвонить +7 (995) 927-77-54",
          ];
        } else if (
          userText.toLowerCase().includes("номер") ||
          userText.toLowerCase().includes("артикул") ||
          /[a-z0-9]{4,}[-_][a-z0-9]{3,}/i.test(userText)
        ) {
          quickReplies = [
            "Забронировать деталь на складе",
            "Записаться на замену",
            "Позвонить мастеру",
          ];
        } else {
          quickReplies = [
            "Записаться на ремонт",
            "Сколько стоит замена масла?",
            "Узнать точный адрес",
          ];
        }

        const replyText =
          data.reply ||
          "Мастер-приёмщик сейчас консультирует в боксе. Пожалуйста, позвоните нам: +7 (995) 927-77-54 или оставьте номер — перезвоним!";

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: replyText,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRealAi: data.isRealAi,
          modelUsed: data.modelUsed,
          isPaid: data.isPaid,
          usage: data.usage,
          leadCaptured: data.leadCaptured,
          quickReplies,
        };

        setMessages((prev) => [...prev, botMsg]);
      } catch (err) {
        console.error("[AiAutoConsultant Client Error]:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            text: "Мастер-приёмщик автосервиса сейчас на связи по телефону: +7 (995) 927-77-54. Вы также можете оставить свой номер прямо здесь — мы свяжемся с вами в течение 5 минут!",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } finally {
        setIsTyping(false);
      }
    },
    [customApiKey, selectedModel]
  );

  const handleReset = useCallback(() => {
    const currentToken = tokenRef.current;
    if (currentToken) {
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset", sessionToken: currentToken }),
      }).catch(() => {});
    }
    const newToken =
      "user_" +
      Math.random().toString(36).substring(2, 11) +
      "_" +
      Date.now().toString(36);
    localStorage.setItem("autobox_session_token", newToken);
    tokenRef.current = newToken;
    setTurnCount(1);
    setActiveCar(null);
    setMessages([
      {
        id: Date.now().toString(),
        sender: "bot",
        text: "Новая сессия открыта! Задайте вопрос по ремонту или укажите парт-номер детали.",
        time: "Онлайн",
        quickReplies: [
          "Замена масла в АКПП",
          "Ремонт стоек",
          "Проверить артикул",
        ],
      },
    ]);
  }, []);

  const currentModelMeta =
    FREE_MODELS_LIST.find((m) => m.id === selectedModel) || FREE_MODELS_LIST[0];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden flex flex-col h-[600px]">
      {/* Bot Header */}
      <div className="px-4 sm:px-5 py-3 border-b border-[var(--border)] bg-[var(--secondary)] flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <div className="h-9 w-9 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shadow-sm">
              <Bot className="h-5 w-5" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-[var(--card)]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm text-[var(--foreground)] truncate">
                Автобокс AI-Консультант
              </h3>
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 truncate max-w-[220px]"
                title={activeCar ? `Автомобиль в памяти диалога: ${activeCar}` : undefined}
              >
                Контекст: {turnCount}/{SESSION_SETTINGS.CONTEXT_WINDOW_LIMIT}
                {activeCar ? ` • 🚗 ${activeCar}` : ""}
              </span>
            </div>

            {/* Model Selector Trigger */}
            <div className="relative mt-0.5" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShowModelPicker(!showModelPicker)}
                className="inline-flex items-center gap-1 text-[11px] text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors py-0.5 px-1 -ml-1 rounded hover:bg-[var(--card)]"
                title="Сменить AI-модель"
              >
                <Cpu className="h-3 w-3 text-[var(--primary)] shrink-0" />
                <span className="font-medium text-[var(--foreground)] truncate max-w-[150px] sm:max-w-[200px]">
                  {currentModelMeta.name}
                </span>
                <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
              </button>

              {/* Models Dropdown Menu */}
              {showModelPicker && (
                <div className="absolute left-0 top-full mt-1.5 w-72 sm:w-80 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1.5 border-b border-[var(--border)] mb-1 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[var(--foreground)]">
                      Выбор модели (OpenRouter):
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--primary)]/15 text-[var(--primary)] font-bold">
                      Каталог AI
                    </span>
                  </div>

                  <div className="space-y-1">
                    {FREE_MODELS_LIST.map((m) => {
                      const isSelected = m.id === selectedModel;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => handleSelectModel(m.id)}
                          className={`w-full text-left p-2 rounded-lg transition flex items-start gap-2.5 ${
                            isSelected
                              ? "bg-[var(--primary)]/15 border border-[var(--primary)]/40"
                              : "hover:bg-[var(--secondary)] border border-transparent"
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isSelected ? (
                              <Check className="h-3.5 w-3.5 text-[var(--primary)]" />
                            ) : !m.isFree ? (
                              <Coins className="h-3.5 w-3.5 text-amber-400" />
                            ) : (
                              <Sparkles className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span
                                className={`text-xs font-semibold truncate ${
                                  isSelected
                                    ? "text-[var(--primary)]"
                                    : "text-[var(--foreground)]"
                                }`}
                              >
                                {m.name}
                              </span>
                              <span
                                className={`text-[9px] font-medium shrink-0 ${
                                  !m.isFree
                                    ? "text-amber-400 font-semibold"
                                    : "text-[var(--muted-foreground)]"
                                }`}
                              >
                                {m.badge}
                              </span>
                            </div>
                            <p className="text-[10px] text-[var(--muted-foreground)] line-clamp-2 mt-0.5 leading-tight">
                              {m.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* OpenRouter Key Toggle */}
          <button
            onClick={() => setShowKeyInput(!showKeyInput)}
            className={`p-1.5 rounded-lg border transition-colors ${
              customApiKey
                ? "border-emerald-500/50 text-emerald-400 bg-emerald-500/10"
                : "border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
            }`}
            title="Настройка личного OpenRouter API ключа (необязательно)"
          >
            <Key className="h-4 w-4" />
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors"
            title="Начать новую сессию"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Optional OpenRouter Key Input Bar */}
      {showKeyInput && (
        <div className="px-4 py-2 bg-[var(--card)] border-b border-[var(--border)] flex items-center gap-2 text-xs">
          <input
            type="password"
            value={customApiKey}
            onChange={(e) => {
              setCustomApiKey(e.target.value);
              localStorage.setItem("autobox_openrouter_key", e.target.value);
            }}
            placeholder="Вставьте sk-or-v1-... если хотите использовать свой ключ"
            className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--secondary)] px-3 py-1.5 text-xs text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
          />
          <button
            onClick={() => setShowKeyInput(false)}
            className="px-3 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary)]/90"
          >
            ОК
          </button>
        </div>
      )}

      {/* Pinned Price Lock Banner */}
      {fixedPriceInfo && (
        <div className="mx-4 mt-3 mb-1 p-3 rounded-xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 flex items-center justify-between gap-3 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
              ₽
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-black text-[var(--primary)] uppercase tracking-wider">
                  ЦЕНА ЗАФИКСИРОВАНА В БАЗЕ SUPABASE
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Без скрытых доплат
                </span>
              </div>
              <div className="text-xs sm:text-sm font-bold text-[var(--foreground)] truncate">
                {fixedPriceInfo.price.toLocaleString("ru-RU")} ₽ — {fixedPriceInfo.symptom || "Услуга"} {fixedPriceInfo.car ? `(${fixedPriceInfo.car})` : ""}
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[var(--muted-foreground)] text-right shrink-0 hidden sm:block">
            ул. Печёнкина, 1а<br />
            <span className="text-[var(--primary)] font-medium">Бронь подъемника</span>
          </div>
        </div>
      )}

      {/* Messages Feed */}
      <div ref={chatFeedRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${
              m.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            <div
              className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                m.sender === "user"
                  ? "bg-[var(--primary)] text-white rounded-br-none"
                  : "bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.isRealAi && (
                <div className="mt-2 pt-2 border-t border-[var(--border)]/60 text-[10px]">
                  {m.isPaid || m.modelUsed?.includes("minimax") ? (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-amber-400">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Coins className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span>
                          Платная модель ({m.modelUsed || "MiniMax M3"})
                        </span>
                      </div>
                      {m.usage ? (
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="bg-[var(--card)] px-1.5 py-0.5 rounded border border-[var(--border)] font-mono text-[9px] text-[var(--foreground)]">
                            Расход: {m.usage.totalTokens} токенов
                          </span>
                          {typeof m.usage.costUsd === "number" && (
                            <span className="text-emerald-400 font-semibold font-mono">
                              ≈ ${m.usage.costUsd.toFixed(5)} USD (~
                              {(m.usage.costUsd * 96).toFixed(3)} ₽)
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-[9px] text-[var(--muted-foreground)]">
                          Токены подсчитываются
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-emerald-400 gap-2">
                      <div className="flex items-center gap-1">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Бесплатная модель OpenRouter</span>
                      </div>
                      {m.modelUsed && (
                        <span className="text-[9px] text-[var(--muted-foreground)] truncate max-w-[140px]">
                          {m.modelUsed}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
              {m.leadCaptured && (
                <div className="mt-2 py-1 px-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5 animate-in fade-in">
                  <Check className="h-3 w-3 shrink-0" />
                  <span>Данные записаны в базу автосервиса</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-[var(--muted-foreground)] mt-1 px-1">
              {m.time}
            </span>

            {/* Quick Replies */}
            {m.quickReplies && m.quickReplies.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5 max-w-[90%]">
                {m.quickReplies.map((qr, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      handleSend(qr);
                      inputRef.current?.focus({ preventScroll: true });
                    }}
                    className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all text-[var(--muted-foreground)] cursor-pointer"
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 bg-[var(--secondary)] border border-[var(--border)] px-4 py-2.5 rounded-2xl rounded-bl-none w-24">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-bounce" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.2s]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
      </div>

      {/* Context Source Badge (when redirected from a service or promo page) */}
      {contextSource && (
        <div className="px-4 py-2 bg-[var(--primary)]/10 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--primary)] animate-in fade-in">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles className="h-3.5 w-3.5 shrink-0" />
            <span className="font-semibold truncate">
              Контекст перехода: {contextSource}
            </span>
          </div>
          <button
            type="button"
            onClick={() => {
              setContextSource(null);
              setInput("");
            }}
            className="text-[10px] text-[var(--muted-foreground)] hover:text-[var(--foreground)] ml-2 shrink-0 underline"
            title="Очистить"
          >
            Очистить
          </button>
        </div>
      )}

      {/* Downgrade / Safety notice */}
      {downgradeNotice && (
        <div className="px-4 py-2 bg-amber-500/10 border-t border-amber-500/20 text-amber-400 text-xs flex items-center justify-between gap-2">
          <span>ℹ️ {downgradeNotice}</span>
          <button
            type="button"
            onClick={() => setDowngradeNotice(null)}
            className="text-[10px] text-amber-400/80 hover:text-amber-300 underline"
          >
            Понятно
          </button>
        </div>
      )}

      {/* Input Field */}
      <div className="p-3 border-t border-[var(--border)] bg-[var(--secondary)]/40">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
            inputRef.current?.focus({ preventScroll: true });
          }}
          className="flex items-center gap-2 relative"
        >
          {/* Honeypot hidden input for catching automated spam bots */}
          <input
            type="text"
            name="bot_trap_field"
            value={botTrap}
            onChange={(e) => setBotTrap(e.target.value)}
            style={{ display: "none", position: "absolute", left: "-9999px" }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <input
            ref={inputRef}
            type="text"
            maxLength={600}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              cooldownLeft > 0
                ? `Подождите ${cooldownLeft} сек...`
                : "Спросите о цене, стойках или введите артикул детали..."
            }
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || cooldownLeft > 0}
            className="h-10 min-w-10 px-2.5 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center hover:bg-[var(--primary)]/90 disabled:opacity-40 transition-all shrink-0 shadow-md shadow-[var(--primary)]/20 cursor-pointer"
            title={cooldownLeft > 0 ? `Подождите ${cooldownLeft} сек.` : "Отправить"}
          >
            {cooldownLeft > 0 ? (
              <span className="font-mono text-xs font-bold">{cooldownLeft}s</span>
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
