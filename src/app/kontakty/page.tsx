"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ExternalLink,
  Send,
  Sparkles,
  Navigation,
  CheckCircle,
  Copy,
  Check,
  Shield,
  Car,
  Wrench,
  Calendar,
  Timer,
  Warehouse,
  Flame,
  ArrowRight,
  Search,
  AlertCircle,
  ShieldCheck,
  Disc,
  Zap,
  Bot,
} from "lucide-react";
import { AiAutoConsultant } from "@/components/AiAutoConsultant";
import { InteractiveMap } from "@/components/InteractiveMap";
import { BookingConsultantButton } from "@/components/BookingConsultantButton";

interface SymptomPreset {
  id: string;
  name: string;
  shortDesc: string;
  workCost: number;
  partsCost: number;
  duration: string;
}

interface CategoryGroup {
  id: string;
  name: string;
  icon: any;
  items: SymptomPreset[];
}

const symptomCategories: CategoryGroup[] = [
  {
    id: "suspension",
    name: "Ходовая и стойки",
    icon: Wrench,
    items: [
      {
        id: "struts-nitrogen",
        name: "Стук / пробои на кочках (прокачка стоек азотом)",
        shortDesc: "Закачка сухого азота высокой чистоты под заводское давление",
        workCost: 1600,
        partsCost: 600,
        duration: "~ 45–60 мин",
      },
      {
        id: "bushings-press",
        name: "Глухой стук на неровностях (сайлентблоки рычагов)",
        shortDesc: "Гидравлическая перепрессовка прессом 20 тонн",
        workCost: 1200,
        partsCost: 800,
        duration: "~ 60–90 мин",
      },
      {
        id: "ball-joints",
        name: "Люфт руля / щелчки при маневрах (шаровые и тяги)",
        shortDesc: "Устранение люфтов шарнирных соединений",
        workCost: 600,
        partsCost: 900,
        duration: "~ 40–50 мин",
      },
      {
        id: "wheel-bearing",
        name: "Гул / гудение на скорости от 50 км/ч (подшипник ступицы)",
        shortDesc: "Запрессовка нового двухрядного подшипника",
        workCost: 1500,
        partsCost: 1800,
        duration: "~ 60 мин",
      },
      {
        id: "shock-replace",
        name: "Сильная раскачка кузова (замена амортизаторов)",
        shortDesc: "Снятие/установка стойки в сборе с пружиной",
        workCost: 1200,
        partsCost: 3500,
        duration: "~ 60 мин",
      },
      {
        id: "vibro-diag",
        name: "Комплексная диагностика ходовой на вибростенде",
        shortDesc: "Инструментальная проверка люфтов и амортизаторов (0 ₽ при ремонте)",
        workCost: 500,
        partsCost: 0,
        duration: "~ 20–30 мин",
      },
    ],
  },
  {
    id: "engine",
    name: "Двигатель и ГРМ",
    icon: Car,
    items: [
      {
        id: "timing-belt-chain",
        name: "Свист / плановый регламент (замена ремня или цепи ГРМ)",
        shortDesc: "Выставление фаз по фиксаторам, замена роликов и помпы",
        workCost: 3500,
        partsCost: 4800,
        duration: "~ 3–5 часов",
      },
      {
        id: "valve-cover-leak",
        name: "Течь масла из-под крышки (замена прокладки клапанов)",
        shortDesc: "Очистка плоскостей, замена сальников свечных колодцев",
        workCost: 1200,
        partsCost: 900,
        duration: "~ 60–80 мин",
      },
      {
        id: "spark-plugs",
        name: "Троит мотор / пропуски (замена свечей зажигания)",
        shortDesc: "Проверка зазора, замена комплекта свечей NGK/Denso",
        workCost: 600,
        partsCost: 1600,
        duration: "~ 30 мин",
      },
      {
        id: "check-engine",
        name: "Горит Check Engine / потеря тяги (диагностика сканером)",
        shortDesc: "Считывание ошибок всех блоков и параметров датчиков",
        workCost: 800,
        partsCost: 0,
        duration: "~ 30 мин",
      },
      {
        id: "engine-overhaul",
        name: "Повышенный расход масла / дымность (капремонт ДВС)",
        shortDesc: "Комплексная дефектовка цилиндро-поршневой группы",
        workCost: 25000,
        partsCost: 18000,
        duration: "~ 3–6 дней",
      },
    ],
  },
  {
    id: "fluids",
    name: "Масла и ТО",
    icon: Flame,
    items: [
      {
        id: "atf-flush",
        name: "Пинки коробки / плановое ТО (аппаратная замена в АКПП)",
        shortDesc: "100% вытеснение старой жижи на стенде под давлением",
        workCost: 2500,
        partsCost: 6500,
        duration: "~ 60–80 мин",
      },
      {
        id: "engine-oil",
        name: "Плановая замена моторного масла + фильтры (вакуум)",
        shortDesc: "Откачка несливаемого остатка, синтетическое масло со склада",
        workCost: 800,
        partsCost: 2800,
        duration: "~ 25–35 мин",
      },
      {
        id: "antifreeze-flush",
        name: "Печка греет слабо / замена антифриза с промывкой",
        shortDesc: "Аппаратная промывка контура охлаждения и свежий антифриз",
        workCost: 1200,
        partsCost: 1600,
        duration: "~ 45–60 мин",
      },
      {
        id: "brake-fluid",
        name: "Замена тормозной жидкости с прокачкой контура",
        shortDesc: "Замещение жидкости DOT-4 с удалением воздуха из системы",
        workCost: 1000,
        partsCost: 600,
        duration: "~ 30–40 мин",
      },
    ],
  },
  {
    id: "brakes",
    name: "Тормозная система",
    icon: Disc,
    items: [
      {
        id: "brake-pads",
        name: "Скрип / писк при торможении (замена колодок)",
        shortDesc: "Очистка посадочных мест суппорта, смазка направляющих",
        workCost: 800,
        partsCost: 1800,
        duration: "~ 30–45 мин",
      },
      {
        id: "brake-rotors",
        name: "Биение руля при торможении (замена тормозных дисков)",
        shortDesc: "Замена дисков и колодок с контролем биения ступицы",
        workCost: 1200,
        partsCost: 4500,
        duration: "~ 60 мин",
      },
      {
        id: "caliper-service",
        name: "Подклинивает колесо / греется диск (переборка суппорта)",
        shortDesc: "Замена пыльников, поршней и направляющих пальцев",
        workCost: 1200,
        partsCost: 800,
        duration: "~ 60–90 мин",
      },
    ],
  },
  {
    id: "electrics",
    name: "Электрика и запуск",
    icon: Zap,
    items: [
      {
        id: "starter-repair",
        name: "Щёлкает, но не крутит (ремонт стартера на стенде)",
        shortDesc: "Замена втягивающего реле, щеток или бендикса",
        workCost: 1500,
        partsCost: 1200,
        duration: "~ 1.5–2.5 часа",
      },
      {
        id: "generator-repair",
        name: "Горит лампа АКБ / нет зарядки (ремонт генератора)",
        shortDesc: "Замена диодного моста, подшипников и регулятора",
        workCost: 1500,
        partsCost: 1500,
        duration: "~ 1.5–2.5 часа",
      },
    ],
  },
  {
    id: "anticor",
    name: "Антикоррозийная защита",
    icon: ShieldCheck,
    items: [
      {
        id: "full-anticor",
        name: "Полный антикор днища и арок с мойкой и сушкой",
        shortDesc: "Горячая мойка на подъемнике, сушка пушками, скрытые полости",
        workCost: 8000,
        partsCost: 5000,
        duration: "~ 24–48 часов",
      },
      {
        id: "wheel-arches-anticor",
        name: "Шумоизоляционный антикор колесных арок (4 арки)",
        shortDesc: "Нанесение вибропоглощающего антигравийного состава",
        workCost: 4000,
        partsCost: 2500,
        duration: "~ 4–6 часов",
      },
    ],
  },
];

const carBrands = [
  "Honda",
  "Toyota",
  "ВАЗ / Lada",
  "Kia / Hyundai",
  "Nissan",
  "Renault",
  "VAG (VW/Skoda)",
  "Geely / Haval",
  "+ Другая",
];

const timeSlots = [
  "Сегодня, 16:30",
  "Сегодня, 18:00",
  "Завтра, 10:00",
  "Завтра, 14:30",
  "Завтра, 17:00",
];

export default function KontaktyPage() {
  const [selectedBrand, setSelectedBrand] = useState("Honda");
  const [customCarInput, setCustomCarInput] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState("suspension");
  const [selectedPreset, setSelectedPreset] = useState<SymptomPreset>(symptomCategories[0].items[0]);
  const [customSymptomText, setCustomSymptomText] = useState("");
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedTime, setSelectedTime] = useState("Сегодня, 16:30");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [bookingResult, setBookingResult] = useState<{ bookingNumber: string; total: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Read URL query parameters (e.g. redirected from Services or Promos)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const serviceParam = params.get("service");
      const carParam = params.get("car");

      if (carParam) {
        setSelectedBrand(carParam);
      }
      if (serviceParam) {
        let matched = false;
        for (const cat of symptomCategories) {
          const found = cat.items.find((it) =>
            serviceParam.toLowerCase().includes(it.name.toLowerCase().slice(0, 10))
          );
          if (found) {
            setActiveCategoryId(cat.id);
            setSelectedPreset(found);
            setIsCustomMode(false);
            matched = true;
            break;
          }
        }
        if (!matched) {
          setIsCustomMode(true);
          setCustomSymptomText(serviceParam);
        }
      }
    } catch {}
  }, []);

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText("г. Миасс, ул. Печёнкина, 1а");
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2500);
  };

  // Dynamic cost calculation based on preset or custom text
  const currentWorkCost = isCustomMode
    ? customSymptomText.toLowerCase().includes("стойк")
      ? 1600
      : customSymptomText.toLowerCase().includes("масл")
      ? 800
      : customSymptomText.toLowerCase().includes("грм")
      ? 3500
      : 800
    : selectedPreset.workCost;

  const currentPartsCost = isCustomMode
    ? customSymptomText.toLowerCase().includes("стойк")
      ? 600
      : customSymptomText.toLowerCase().includes("масл")
      ? 2800
      : customSymptomText.toLowerCase().includes("грм")
      ? 4800
      : 500
    : selectedPreset.partsCost;

  const totalCost = currentWorkCost + currentPartsCost;
  const currentDuration = isCustomMode ? "~ 30–60 мин (уточняется при осмотре)" : selectedPreset.duration;
  const activeCarName = customCarInput.trim() || selectedBrand;
  const activeSymptomTitle = isCustomMode
    ? customSymptomText.trim() || "Индивидуальное обращение / диагностика"
    : selectedPreset.name;

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const activeCategoryObj = symptomCategories.find((c) => c.id === activeCategoryId);

      const bookingPayload = {
        car: activeCarName,
        category: activeCategoryObj?.name || "Общий осмотр",
        symptom: activeSymptomTitle,
        preferredTime: selectedTime,
        workCost: currentWorkCost,
        partsCost: currentPartsCost,
        total: totalCost,
        phone: phone.trim() || undefined,
        name: name.trim() || undefined,
        telegram: telegram.trim() || undefined,
      };

      // 1. Если номер телефона указан — фоново сохраняем также прямой лид в Supabase
      if (phone.trim()) {
        try {
          fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              clientName: name.trim() || undefined,
              phone: phone.trim(),
              telegram: telegram.trim() || undefined,
              car: activeCarName,
              category: activeCategoryObj?.name || "Общий осмотр",
              symptom: activeSymptomTitle,
              preferredTime: selectedTime,
              estimatedWork: currentWorkCost,
              estimatedParts: currentPartsCost,
              estimatedTotal: totalCost,
              source: "contacts_symptom_matrix_ai_transfer",
            }),
          }).catch(() => {});
        } catch {}
      }

      // 2. Диспатчим событие в AI-Чат для фиксации цены, закрытия продажи и записи в Supabase
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("autobox_lock_in_price", { detail: bookingPayload })
        );
      }

      // 3. Плавно перенаправляем пользователя прямо в чат к AI-Мастеру ("перенаправлять сюда")
      const chatElement = document.getElementById("ai-chat");
      if (chatElement) {
        chatElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage("Ошибка при передаче в AI-чат. Напишите напрямую в чат ниже.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeCategory = symptomCategories.find((c) => c.id === activeCategoryId) || symptomCategories[0];

  return (
    <div className="py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section 1: Hero & Status Ticker (From Stitch Screen 6) */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--card)] border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--primary)] mb-4">
            <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
            <span>ЦЕНТРАЛЬНЫЙ БОКС • МИАСС</span>
            <span className="text-[var(--muted-foreground)]">•</span>
            <span className="text-[var(--foreground)]">БОКС 4Т / ВИБРОСТЕНД</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight">
            Контакты и <span className="text-[var(--primary)]">схема проезда</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--muted-foreground)] max-w-3xl leading-relaxed">
            Специализированный автосервис Автобокс74 на ул. Печёнкина, 1а. Просторная асфальтированная парковка, комфортный подъезд и круглосуточная AI-запись с моментальной оценкой неисправности.
          </p>

          {/* Quick status ticker */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-[var(--muted-foreground)]">СТАТУС БОКСА</p>
                <p className="text-xs sm:text-sm font-bold text-[var(--foreground)] truncate">Открыто до 20:00</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                <Timer className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-[var(--muted-foreground)]">ОТВЕТ ДИСПЕТЧЕРА</p>
                <p className="text-xs sm:text-sm font-bold text-[var(--foreground)] truncate">~ 15 секунд</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                <Warehouse className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-[var(--muted-foreground)]">ВЫСОТА ВОРОТ</p>
                <p className="text-xs sm:text-sm font-bold text-[var(--foreground)] truncate">3.6 м (въезд бусов)</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                <Car className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-mono uppercase text-[var(--muted-foreground)]">ПАРКОВКА</p>
                <p className="text-xs sm:text-sm font-bold text-[var(--foreground)] truncate">14 мест • Асфальт</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 4 Detailed Contact Tiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {/* Card 1: Address */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between group hover:border-[var(--primary)]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase">Локация</span>
              </div>
              <h3 className="text-base font-bold text-[var(--foreground)]">г. Миасс, ул. Печёнкина, 1а</h3>
              <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                Удобный съезд с проспекта Автозаводцев. Ровное асфальтированное покрытие прямо до сервисных ворот.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[var(--primary)]">GPS: 55.0575, 60.0961</span>
              <button
                onClick={copyAddressToClipboard}
                className="inline-flex items-center gap-1 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1"
                title="Скопировать адрес"
              >
                {copiedAddress ? <Check className="h-4 w-4 text-[var(--primary)]" /> : <Copy className="h-4 w-4" />}
                <span className="text-[11px]">{copiedAddress ? "Скопировано!" : "Копировать"}</span>
              </button>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between group hover:border-[var(--primary)]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> На линии
                </span>
              </div>
              <p className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase">ПРЯМОЙ ТЕЛЕФОН МАСТЕРА</p>
              <a
                href="tel:+79959277754"
                className="block mt-1 font-mono text-base font-black text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
              >
                +7 (995) 927-77-54
              </a>
              <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                Прямая линия мастера-приемщика. Соединение до 15 секунд. Консультация по звукам подвески и запись.
              </p>
            </div>
            <div className="mt-5">
              <a
                href="tel:+79959277754"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all"
              >
                <Phone className="h-3.5 w-3.5" />
                <span>Позвонить в бокс</span>
              </a>
            </div>
          </div>

          {/* Card 3: Working Hours */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between group hover:border-[var(--primary)]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Clock className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase">Режим</span>
              </div>
              <h3 className="text-base font-bold text-[var(--foreground)]">10:00 — 20:00</h3>
              <p className="text-xs font-bold text-[var(--primary)] mt-0.5">Ежедневно, без обеда</p>
              <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                Понедельник — Воскресенье. Прием авто на дефектовку до 19:30. Выдача готовых машин в день обращения.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-[var(--border)] flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)]">
              <CheckCircle className="h-3.5 w-3.5 text-[var(--primary)] shrink-0" />
              <span>Срочный прием без очереди</span>
            </div>
          </div>

          {/* Card 4: AI Consultant Booking */}
          <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between group hover:border-[var(--primary)]/50 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors">
                  <Bot className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-mono font-bold text-[var(--primary)] uppercase flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" /> 24/7 Онлайн
                </span>
              </div>
              <p className="text-[10px] font-mono font-bold text-[var(--muted-foreground)] uppercase">ОНЛАЙН-КОНСУЛЬТАЦИЯ</p>
              <h3 className="text-base font-bold text-[var(--foreground)] mt-0.5">
                Записаться через AI-консультанта
              </h3>
              <p className="mt-2 text-xs text-[var(--muted-foreground)] leading-relaxed">
                Моментальный расчет стоимости по марке авто, подбор свободного бокса и запись на ул. Печёнкина, 1а без звонков и ожидания.
              </p>
            </div>
            <div className="mt-5">
              <BookingConsultantButton
                from="Контакты: карточка AI-записи"
                prompt="Здравствуйте! Хочу записаться на диагностику и консультацию в Автобокс74 на ул. Печёнкина, 1а. Подскажите свободное время."
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all cursor-pointer"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Записаться через AI</span>
              </BookingConsultantButton>
            </div>
          </div>
        </div>

        {/* Section 3: Interactive Map & Route Times (Stitch Screen 6) */}
        <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 shadow-xl mb-16">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary)] animate-pulse" />
                <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)]">
                  Интерактивная карта и заезд
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
                Свободный съезд для легковых, кроссоверов и коммерческого транспорта высотой до 3.6 м
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://yandex.ru/maps/?rtext=~55.057502%2C60.096123&rtt=auto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--secondary)] hover:bg-[var(--primary)] hover:text-white text-[var(--foreground)] text-xs font-bold transition-all border border-[var(--border)]"
              >
                <Navigation className="h-3.5 w-3.5 text-[var(--primary)]" />
                <span>В Яндекс Навигатор</span>
              </a>
              <a
                href="https://2gis.ru/miass/firm/70000001069433338"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--secondary)] hover:bg-emerald-600 hover:text-white text-[var(--foreground)] text-xs font-bold transition-all border border-[var(--border)]"
              >
                <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
                <span>В 2ГИС (Рейтинг 5.0)</span>
              </a>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden border border-[var(--border)]">
            <InteractiveMap className="h-[400px] sm:h-[460px] w-full" />

            <div className="absolute bottom-3 right-3 left-3 sm:left-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 rounded-2xl bg-black/80 backdrop-blur-md border border-[var(--border)] shadow-xl pointer-events-none">
              <div className="px-3 py-1.5 rounded-xl bg-[var(--card)]/90 flex items-center gap-2 border border-white/5">
                <Car className="h-4 w-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[9px] font-mono text-[var(--muted-foreground)]">МАШГОРОДОК</p>
                  <p className="text-xs font-bold text-white font-mono">~ 12 минут</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[var(--card)]/90 flex items-center gap-2 border border-white/5">
                <Car className="h-4 w-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[9px] font-mono text-[var(--muted-foreground)]">СТАРАЯ ЧАСТЬ</p>
                  <p className="text-xs font-bold text-white font-mono">~ 15 минут</p>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[var(--card)]/90 flex items-center gap-2 border border-white/5">
                <Navigation className="h-4 w-4 text-[var(--primary)]" />
                <div>
                  <p className="text-[9px] font-mono text-[var(--muted-foreground)]">С ТРАССЫ М-5</p>
                  <p className="text-xs font-bold text-white font-mono">~ 9 минут</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                01
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">С проспекта Автозаводцев</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                  Поворачивайте на ул. Печёнкина у перекрестка с автомойкой. Дорога освещена и очищена круглый год.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                02
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">Ориентир вывески</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                  Через 180 метров справа вы увидите светящуюся вывеску «АВТОБОКС 74» и флагштоки с въездом.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/15 text-[var(--primary)] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                03
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--foreground)]">Парковка и приёмка</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-1 leading-relaxed">
                  Паркуйтесь на клиентских местах. Мастер-приемщик выйдет для первичного осмотра в течение 2 минут.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Visual Landmarks Photo Guide */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-mono font-bold text-[var(--primary)] uppercase tracking-wider">
                ФОТОГИД МАРШРУТА
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight mt-1">
                Визуальные ориентиры подъезда
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-md">
              Вы точно не проедете мимо — подготовленные фото ключевых точек по ходу движения к нашему сервису на ул. Печёнкина, 1а.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden group flex flex-col hover:border-[var(--primary)]/50 transition-all">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--secondary)]">
                <Image
                  src="/images/contacts_facade.jpg"
                  alt="Фасад автосервиса Автобокс74"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md font-mono text-[10px] font-bold text-[var(--primary)]">
                  ОРИЕНТИР 1
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    Фасад бокса с вывеской
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-1">
                    Главный въездной фасад с ярким логотипом Автобокс74 и указателем приёмки.
                  </p>
                </div>
                <p className="text-[11px] font-mono text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)] flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-[var(--primary)]" /> ул. Печёнкина, 1а (главный вход)
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden group flex flex-col hover:border-[var(--primary)]/50 transition-all">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--secondary)]">
                <Image
                  src="/images/contacts_turn_sign.jpg"
                  alt="Поворот с улицы Печёнкина"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md font-mono text-[10px] font-bold text-[var(--primary)]">
                  ОРИЕНТИР 2
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    Поворот с ул. Печёнкина
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-1">
                    Крупный навигационный указатель на развилке. Сворачивайте направо к огороженному автокомплексу.
                  </p>
                </div>
                <p className="text-[11px] font-mono text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)] flex items-center gap-1.5">
                  <Navigation className="h-3 w-3 text-[var(--primary)]" /> 180 м до ворот сервиса
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden group flex flex-col hover:border-[var(--primary)]/50 transition-all">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--secondary)]">
                <Image
                  src="/images/contacts_parking.jpg"
                  alt="Клиентская парковка автосервиса"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md font-mono text-[10px] font-bold text-[var(--primary)]">
                  ОРИЕНТИР 3
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    Клиентская парковка
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed mt-1">
                    Широкая огороженная площадка с видеонаблюдением. Места для легковых авто и микроавтобусов.
                  </p>
                </div>
                <p className="text-[11px] font-mono text-[var(--muted-foreground)] pt-2 border-t border-[var(--border)] flex items-center gap-1.5">
                  <Car className="h-3 w-3 text-[var(--primary)]" /> Бесплатно для клиентов сервиса
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: REDESIGNED SMART SYMPTOM MATRIX & ESTIMATION ENGINE */}
        <div className="rounded-3xl border border-[var(--border)] bg-gradient-to-br from-[var(--secondary)] via-[var(--card)] to-[var(--secondary)] p-6 sm:p-10 shadow-2xl mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
            {/* Left Column: Multi-Category Symptom Configurator */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] text-[var(--primary)] font-mono text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5" />
                  ИНТЕЛЛЕКТУАЛЬНЫЙ РАСЧЁТ И БРОНИРОВАНИЕ
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight mt-2">
                  Интеллектуальный расчёт ремонта и бронь подъёмника
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
                  Выберите марку, категорию узла или опишите симптом своими словами — алгоритм рассчитает смету и передаст мастеру.
                </p>
              </div>

              {bookingResult ? (
                /* Dynamic Booking Success Voucher */
                <div className="rounded-2xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 p-7 sm:p-8 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-[var(--primary)]/20">
                    <span className="font-mono text-xs font-bold text-[var(--primary)] uppercase">
                      Электронный талон бронирования
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-[var(--primary)] text-white font-mono text-xs font-black">
                      {bookingResult.bookingNumber}
                    </span>
                  </div>

                  <div className="space-y-2 text-sm text-[var(--foreground)]">
                    <p className="text-xl font-black text-[var(--foreground)] flex items-center gap-2">
                      <CheckCircle className="h-6 w-6 text-[var(--primary)]" />
                      Заявка успешно зафиксирована в системе!
                    </p>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      Мастер-приемщик автосервиса на ул. Печёнкина, 1а получил ваши данные и свяжется с вами по номеру{" "}
                      <strong className="text-[var(--foreground)]">{phone}</strong> для подтверждения брони бокса на{" "}
                      <strong className="text-[var(--primary)]">{selectedTime}</strong>.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between text-[var(--muted-foreground)]">
                      <span>Автомобиль:</span>
                      <strong className="text-[var(--foreground)]">{activeCarName}</strong>
                    </div>
                    <div className="flex justify-between text-[var(--muted-foreground)]">
                      <span>Симптом / Услуга:</span>
                      <strong className="text-[var(--foreground)] text-right truncate max-w-[240px]">{activeSymptomTitle}</strong>
                    </div>
                    <div className="flex justify-between text-[var(--muted-foreground)]">
                      <span>Предварительная смета:</span>
                      <strong className="text-[var(--primary)] text-sm">{bookingResult.total.toLocaleString("ru-RU")} ₽</strong>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <a
                      href="tel:+79959277754"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary)]/90 transition-all shadow-md"
                    >
                      <Phone className="h-3.5 w-3.5" />
                      Позвонить мастеру (+7 995 927-77-54)
                    </a>
                    <button
                      onClick={() => setBookingResult(null)}
                      className="px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-xs font-semibold hover:border-[var(--primary)] text-[var(--foreground)] transition-all"
                    >
                      Рассчитать другую неисправность
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-6">
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Step 1: Vehicle Brand & Model */}
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-mono text-[11px] flex items-center justify-center font-bold">
                          1
                        </span>
                        Марка и модель вашего авто:
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted-foreground)]">каталог иномарок и РФ</span>
                    </label>

                    {/* Quick brand chips */}
                    <div className="flex flex-wrap gap-1.5">
                      {carBrands.map((brand) => {
                        const isSelected = selectedBrand === brand && !customCarInput;
                        return (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => {
                              setSelectedBrand(brand);
                              if (brand !== "+ Другая") setCustomCarInput("");
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25 scale-[1.02]"
                                : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)]/50"
                            }`}
                          >
                            {brand}
                          </button>
                        );
                      })}
                    </div>

                    {/* Precise model input */}
                    <div className="relative pt-1">
                      <input
                        type="text"
                        value={customCarInput}
                        onChange={(e) => setCustomCarInput(e.target.value)}
                        placeholder="Уточните модель и год (например: Toyota Camry 2018 2.5 или Lada Vesta SW)"
                        className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs placeholder:text-[var(--muted-foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <Car className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)] pointer-events-none" />
                    </div>
                  </div>

                  {/* Step 2: Multi-Category Symptom Matrix (NOT just 4 hardcoded options!) */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-mono text-[11px] flex items-center justify-center font-bold">
                          2
                        </span>
                        Симптом поломки или узел авто:
                      </span>
                      <span className="text-[11px] font-mono text-[var(--primary)] font-bold">
                        {isCustomMode ? "Свой симптом" : activeCategory.name}
                      </span>
                    </label>

                    {/* Level 1: Category Tabs */}
                    <div className="flex flex-wrap gap-1.5 p-1 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                      {symptomCategories.map((cat) => {
                        const isSelected = activeCategoryId === cat.id && !isCustomMode;
                        const Icon = cat.icon;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setActiveCategoryId(cat.id);
                              setIsCustomMode(false);
                              setSelectedPreset(cat.items[0]);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                              isSelected
                                ? "bg-[var(--primary)] text-white shadow-sm font-bold"
                                : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{cat.name}</span>
                          </button>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => setIsCustomMode(true)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isCustomMode
                            ? "bg-[var(--primary)] text-white shadow-sm font-bold"
                            : "text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)]"
                        }`}
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>Своими словами</span>
                      </button>
                    </div>

                    {/* Level 2: Specific Symptoms in Selected Category OR Custom Textarea */}
                    {isCustomMode ? (
                      <div className="space-y-2 pt-1">
                        <textarea
                          rows={3}
                          value={customSymptomText}
                          onChange={(e) => setCustomSymptomText(e.target.value)}
                          placeholder="Опишите, что происходит с машиной (например: при повороте направо глухой стук спереди, свистит ремень на холодную, уходит антифриз)..."
                          className="w-full p-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs sm:text-sm placeholder:text-[var(--muted-foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] resize-none"
                        />
                        <div className="flex flex-wrap gap-1.5 text-[11px] text-[var(--muted-foreground)]">
                          <span className="font-bold">Быстрые подсказки:</span>
                          <button
                            type="button"
                            onClick={() => setCustomSymptomText("Стучит стойка на ямах и полицейских")}
                            className="text-[var(--primary)] hover:underline"
                          >
                            Стучит стойка на ямах
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setCustomSymptomText("Аппаратная замена масла в АКПП и ДВС")}
                            className="text-[var(--primary)] hover:underline"
                          >
                            Замена масла АКПП
                          </button>
                          <span>•</span>
                          <button
                            type="button"
                            onClick={() => setCustomSymptomText("Свистит ремень ГРМ / генератора")}
                            className="text-[var(--primary)] hover:underline"
                          >
                            Свистит ремень
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-[300px] overflow-y-auto pr-1">
                        {activeCategory.items.map((item) => {
                          const isSelected = selectedPreset.id === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setSelectedPreset(item)}
                              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                                isSelected
                                  ? "border-[var(--primary)] bg-[var(--card)] ring-2 ring-[var(--primary)]/40 shadow-md"
                                  : "border-[var(--border)] bg-[var(--card)]/70 hover:border-[var(--primary)]/50 text-[var(--foreground)]"
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-[var(--foreground)] leading-snug">
                                  {item.name}
                                </p>
                                <p className="text-[10px] text-[var(--muted-foreground)] mt-1 line-clamp-1">
                                  {item.shortDesc}
                                </p>
                              </div>
                              <div className="mt-2.5 pt-2 border-t border-[var(--border)] flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-[var(--primary)]">
                                  от {item.workCost} ₽
                                </span>
                                <span className="text-[10px] text-[var(--muted-foreground)] font-mono">
                                  {item.duration}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Step 3: Preferred Time & Client Contacts */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[var(--foreground)] flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] font-mono text-[11px] flex items-center justify-center font-bold">
                          3
                        </span>
                        Желаемое время и контакты:
                      </span>
                      <span className="text-[11px] font-mono text-[var(--muted-foreground)]">прием до 19:30</span>
                    </label>

                    <div className="flex flex-wrap gap-1.5">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedTime === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                              isSelected
                                ? "bg-[var(--primary)] text-white shadow-sm"
                                : "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--primary)]/50"
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      <div>
                        <label className="block text-[10px] font-mono text-[var(--muted-foreground)] uppercase mb-1">
                          ВАШ ТЕЛЕФОН *
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+7 (___) ___-__-__"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] font-mono text-xs placeholder:text-[var(--muted-foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[var(--muted-foreground)] uppercase mb-1">
                          ВАШЕ ИМЯ
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Константин"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs placeholder:text-[var(--muted-foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-[var(--muted-foreground)] uppercase mb-1">
                          TELEGRAM (ДЛЯ ТАЛОНА)
                        </label>
                        <input
                          type="text"
                          value={telegram}
                          onChange={(e) => setTelegram(e.target.value)}
                          placeholder="@username"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-xs placeholder:text-[var(--muted-foreground)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Dynamic Estimate HUD Card */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div className="p-6 sm:p-7 rounded-2xl border border-[var(--border)] bg-[var(--card)] flex flex-col justify-between h-full shadow-lg">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-[var(--primary)]" />
                      <h3 className="text-base font-black text-[var(--foreground)]">
                        Предварительная смета
                      </h3>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[var(--primary)]/15 text-[var(--primary)] font-mono text-[10px] font-bold">
                      LIVE AI
                    </span>
                  </div>

                  <div className="space-y-3 py-4 text-xs">
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[var(--muted-foreground)]">Автомобиль:</span>
                      <span className="font-bold text-[var(--foreground)]">{activeCarName}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[var(--muted-foreground)]">Выбранный узел:</span>
                      <span className="font-bold text-[var(--foreground)] text-right truncate max-w-[200px]">
                        {activeSymptomTitle}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[var(--muted-foreground)]">Ориентир по времени:</span>
                      <span className="font-mono text-[var(--foreground)]">{currentDuration}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-[var(--muted-foreground)]">Слот в боксе:</span>
                      <span className="font-mono text-[var(--primary)] font-bold">{selectedTime}</span>
                    </div>

                    {/* Breakdown */}
                    <div className="pt-3 border-t border-[var(--border)] space-y-1.5">
                      <div className="flex justify-between text-[var(--muted-foreground)]">
                        <span>Стоимость работы мастеров:</span>
                        <span className="font-mono text-[var(--foreground)] font-bold">
                          {currentWorkCost.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                      <div className="flex justify-between text-[var(--muted-foreground)]">
                        <span>Расходные детали (оценка):</span>
                        <span className="font-mono text-[var(--foreground)] font-bold">
                          {currentPartsCost.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                      <div className="pt-2 flex items-baseline justify-between">
                        <span className="font-black text-sm text-[var(--foreground)]">Итого к оплате:</span>
                        <span className="text-2xl font-black font-mono text-[var(--primary)]">
                          {totalCost.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border)] space-y-3">
                  <button
                    type="button"
                    onClick={handleBookingSubmit}
                    disabled={isSubmitting}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-emerald-600 text-white text-xs sm:text-sm font-black shadow-xl shadow-[var(--primary)]/30 hover:shadow-[var(--primary)]/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
                    <span>{isSubmitting ? "Перенаправляем в AI-Чат..." : "Записаться и зафиксировать цену"}</span>
                    <ArrowRight className="h-4 w-4 ml-1 opacity-80 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[var(--secondary)] border border-[var(--border)]">
                    <Shield className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
                    <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">
                      Гарантия на работы до 12 месяцев. Запрос перенаправляется в AI-чат для согласования удобного окна и сохранения брони в Supabase.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6: AI-Consultant 24/7 Deep Technical Chat & Sales Closer */}
        <div id="ai-chat" className="pt-6 scroll-mt-20">
          <div className="text-center mb-8">
            <span className="text-xs font-mono font-bold text-[var(--primary)] uppercase tracking-wider">
              ЭЛЕКТРОННЫЙ МАСТЕР-ПРИЁМЩИК 24/7
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--foreground)] tracking-tight mt-1">
              Фиксация цены и подтверждение записи
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] max-w-xl mx-auto mt-2">
              Здесь фиксируется расчетная смета со скидкой, резервируется подъемник на ул. Печёнкина, 1а и сохраняется бронь в базе автосервиса
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <AiAutoConsultant />
          </div>
        </div>
      </div>
    </div>
  );
}
