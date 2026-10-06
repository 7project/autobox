import Link from "next/link";
import Image from "next/image";
import {
  Wrench,
  Cog,
  Droplets,
  ShieldAlert,
  Zap,
  Settings,
  ShieldCheck,
  Star,
  ArrowRight,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  PackageCheck,
  Bot,
  Sparkles,
} from "lucide-react";
import { AiAutoConsultant } from "@/components/AiAutoConsultant";

const services = [
  {
    icon: Cog,
    title: "Ремонт ходовой и стоек",
    desc: "Прокачка и восстановление стоек, замена сайлентблоков, рычагов и шаровых опор.",
    price: "от 1 200 ₽",
  },
  {
    icon: Droplets,
    title: "Аппаратная замена масла",
    desc: "100% замещение рабочих жидкостей в ДВС, АКПП, мостах и редукторах.",
    price: "от 800 ₽",
  },
  {
    icon: Wrench,
    title: "Ремонт бензиновых ДВС",
    desc: "Капитальный ремонт, замена цепей и ремней ГРМ, устранение расхода масла.",
    price: "от 3 500 ₽",
  },
  {
    icon: Settings,
    title: "Ремонт АКПП и МКПП",
    desc: "Диагностика коробок передач, замена сцепления, ремонт приводов.",
    price: "от 4 000 ₽",
  },
  {
    icon: Zap,
    title: "Стартеры и генераторы",
    desc: "Проверка на стенде, замена диодных мостов, щеток, реле-регуляторов.",
    price: "от 1 500 ₽",
  },
  {
    icon: ShieldAlert,
    title: "Антикоррозийная обработка",
    desc: "Защита днища, порогов и колесных арок с предварительной мойкой и сушкой.",
    price: "от 4 000 ₽",
  },
  {
    icon: PackageCheck,
    title: "Склад автозапчастей",
    desc: "Новые детали на иномарки и авто РФ, расходники и контрактные узлы.",
    price: "в наличии",
  },
  {
    icon: ShieldCheck,
    title: "Компьютерная диагностика",
    desc: "Считывание ошибок всех электронных блоков, проверка параметров в реальном времени.",
    price: "от 800 ₽",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-[var(--border)] bg-gradient-to-b from-[var(--secondary)]/30 to-transparent">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--primary)]/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-18">
          {/* Trust Meta Ticker */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--card)] border border-[var(--border)] text-[11px] font-mono font-bold text-[var(--primary)] uppercase">
              <span className="w-2 h-2 rounded-full bg-[var(--primary)] animate-pulse" />
              Сертифицированный техцентр в Миассе
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-[11px] font-mono text-[var(--muted-foreground)]">
              <MapPin className="h-3 w-3 text-[var(--primary)]" />
              ул. Печёнкина, 1а
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-[11px] font-mono text-[var(--foreground)]">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              5.0 в 2ГИС (217+ отзывов)
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[var(--foreground)] leading-[1.1]">
                Высокотехнологичный ремонт и обслуживание авто в{" "}
                <span className="text-[var(--primary)]">Миассе</span>
              </h1>

              <p className="mt-5 text-base sm:text-lg text-[var(--muted-foreground)] leading-relaxed max-w-2xl">
                Специализированный автосервис: восстановление и ремонт подвески, заводская азотная прокачка стоек, углубленная компьютерная диагностика и ремонт ДВС с официальной гарантией до 12 месяцев.
              </p>

              {/* 3 Badges Grid from Stitch */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-7">
                <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-[var(--foreground)] font-bold truncate">Опыт мастеров</span>
                    <span className="text-xs font-mono font-bold text-[var(--primary)]">от 10 лет</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-[var(--foreground)] font-bold truncate">Гарантия работ</span>
                    <span className="text-xs font-mono font-bold text-[var(--primary)]">до 12 месяцев</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-[var(--foreground)] font-bold truncate">Экспресс-осмотр</span>
                    <span className="text-xs font-mono font-bold text-[var(--primary)]">за 30 минут</span>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  href="/#ai-consultant?service=Запись%20на%20диагностику"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 hover:scale-[1.02] transition-transform"
                >
                  <Clock className="h-4 w-4" />
                  <span>Записаться на диагностику</span>
                </Link>
                <a
                  href="#ai-consultant"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] text-sm font-bold hover:border-[var(--primary)]/50 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-[var(--primary)]" />
                  <span>Рассчитать стоимость в AI-чате</span>
                </a>
              </div>
            </div>

            {/* Right Column: Stitch High-Conversion Inversion Callout Card + Workshop Bay Photo */}
            <div className="lg:col-span-5 space-y-4">
              {/* High-Conversion Inversion Callout Card (Crisp White contrast block) */}
              <div className="relative rounded-3xl bg-white text-slate-900 p-6 sm:p-7 shadow-2xl border border-slate-100 overflow-hidden">
                <div className="absolute top-4 right-5 bg-rose-500 px-3 py-1 rounded-full text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Сегодня свободно 2 места
                </div>

                <div className="flex items-center gap-3 mb-4 pt-1">
                  <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                    <Wrench className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-950 leading-tight">
                      Срочная запись на подъёмник
                    </h3>
                    <p className="text-xs text-slate-500">
                      Миасс, приём без очередей в день звонка
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-100 mb-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-slate-500">Прямой номер мастера:</span>
                    <a
                      href="tel:+79959277754"
                      className="font-mono text-base font-black text-slate-900 hover:text-emerald-600 transition-colors"
                    >
                      +7 (995) 927-77-54
                    </a>
                  </div>
                  <a
                    href="tel:+79959277754"
                    aria-label="Позвонить сейчас"
                    className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md"
                  >
                    <Phone className="h-4 w-4" />
                  </a>
                </div>

                {/* Quick 1-click booking redirect */}
                <div className="space-y-2.5">
                  <Link
                    href="/#ai-consultant?service=Срочная%20запись%20на%20подъемник"
                    className="w-full py-3.5 px-4 rounded-xl bg-slate-950 text-white text-xs sm:text-sm font-bold hover:bg-slate-900 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <span>Забронировать пост в 1 клик</span>
                    <ArrowRight className="h-4 w-4 text-emerald-400" />
                  </Link>
                </div>

                <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Без предоплаты
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Фиксация цены
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-emerald-600" />
                    10:00 — 20:00
                  </span>
                </div>
              </div>

              {/* Stitch Workshop Bay Live Photo Card */}
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-xl group">
                <Image
                  src="/images/workshop_bay_hero.jpg"
                  alt="Ремзона автосервиса Автобокс74 в Миассе"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-black/70 backdrop-blur-md border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Ремзона в Миассе онлайн
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <div>
                    <p className="font-extrabold text-xs sm:text-sm">Цех на ул. Печёнкина, 1а</p>
                    <p className="text-[10px] sm:text-[11px] text-white/70">4 подъемника • Азотный стенд • Склад запчастей</p>
                  </div>
                  <Link
                    href="/galereya"
                    className="rounded-xl bg-white/20 backdrop-blur-md px-3 py-1.5 font-bold hover:bg-white/30 transition-colors text-[11px] shrink-0 ml-2"
                  >
                    Галерея →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI BOT CONSULTANT SECTION (Above services as requested) */}
      <section id="ai-consultant" className="py-16 sm:py-20 bg-[var(--card)] border-y border-[var(--border)] scroll-mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-3.5 py-1 text-xs text-[var(--primary)] font-semibold">
                <Sparkles className="h-3.5 w-3.5" />
                Умный ассистент 24/7
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] leading-tight">
                Задайте вопрос AI-консультанту
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
                Наш виртуальный бот знает точные цены, технологию ремонта стоек, свободные боксы и наличие запчастей на ул. Печёнкина, 1а.
              </p>
              <div className="space-y-2.5 text-xs sm:text-sm text-[var(--muted-foreground)]">
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>Мгновенный ответ без ожидания ответа мастера из ремзоны</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>Ориентировочный расчет стоимости по марке авто</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                  <span>Прямая запись на подъемник в удобный день</span>
                </div>
              </div>

              {/* SECOND CONTRAST WHITE MINI-CARD */}
              <div className="rounded-2xl bg-white text-slate-900 p-5 border border-slate-200 shadow-md">
                <p className="text-xs uppercase font-extrabold text-slate-500">Срочный вопрос?</p>
                <p className="text-sm font-bold text-slate-950 mt-1">
                  Если автомобиль не на ходу или требуется эвакуатор — звоните напрямую:
                </p>
                <a
                  href="tel:+79959277754"
                  className="mt-2 inline-flex items-center gap-2 text-emerald-700 font-black text-sm hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  +7 (995) 927-77-54
                </a>
              </div>
            </div>

            {/* Chatbot Interface */}
            <div className="lg:col-span-7">
              <AiAutoConsultant />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">
                Услуги автосервиса
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2">
                г. Миасс, ул. Печёнкина, 1а • Легковой ремонт отечественных авто и иномарок
              </p>
            </div>
            <Link
              href="/uslugi"
              className="text-xs sm:text-sm font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
            >
              Смотреть все услуги и цены →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {services.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.title}
                  href={`/#ai-consultant?service=${encodeURIComponent(s.title)}`}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-6 transition-all hover:border-[var(--primary)]/50 hover:shadow-lg flex flex-col justify-between"
                  title={`Записаться на ${s.title}`}
                >
                  <div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] mb-4 group-hover:bg-[var(--primary)]/20 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="text-base font-bold text-[var(--foreground)] mb-1.5">
                      {s.title}
                    </h3>
                    <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs">
                    <span className="font-extrabold text-[var(--primary)]">{s.price}</span>
                    <span className="text-[var(--muted-foreground)] group-hover:text-[var(--primary)] font-semibold transition-colors">
                      Записаться →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
