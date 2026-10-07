"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tag,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  Coins,
  ShieldCheck,
  Wrench,
  Gauge,
  Percent,
} from "lucide-react";
import { BookingConsultantButton } from "@/components/BookingConsultantButton";

export default function AkciiPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyPromo = () => {
    navigator.clipboard.writeText("АВТОБОКС2025");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-xs text-[var(--primary)] mb-4 font-bold">
            <Flame className="h-3.5 w-3.5" />
            Выгодные предложения • г. Миасс, ул. Печёнкина, 1а
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight">
            Акции и <span className="text-[var(--primary)]">спецпредложения</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Экономьте на обслуживании автомобиля в автосервисе «Автобокс74rus» без потери качества и заводской гарантии
          </p>
        </div>

        {/* HERO PROMO 1: Full-Width Diagnostic Shaker Plate (From Stitch UI) */}
        <div className="mb-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="rounded-lg bg-[var(--primary)] px-3 py-1 text-xs font-bold text-white shadow-md flex items-center gap-1.5">
                  <Flame className="h-3.5 w-3.5" /> Хит сезона
                </span>
                <span className="rounded-lg bg-[var(--secondary)] px-3 py-1 font-mono text-xs text-[var(--muted-foreground)]">
                  Акция № 01 / Стенд
                </span>
                <span className="rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono text-xs font-bold text-emerald-400">
                  Постоянная акция
                </span>
              </div>

              <div>
                <h2 className="text-2xl sm:text-4xl font-black text-[var(--foreground)] leading-tight">
                  Бесплатная диагностика подвески на вибростенде
                </h2>
                <p className="text-sm sm:text-base text-[var(--muted-foreground)] mt-2.5 leading-relaxed">
                  При любом последующем ремонте ходовой части от 3 000 ₽. Выявляем скрытые стуки, люфты шаровых и реальный износ амортизаторов под нагрузкой.
                </p>
              </div>

              {/* 4-Item Inspection Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)]">
                  <div className="h-9 w-9 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--foreground)] block">32 контрольные точки</span>
                    <span className="text-[11px] text-[var(--muted-foreground)]">Полный регламент проверки</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)]">
                  <div className="h-9 w-9 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                    <Gauge className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--foreground)] block">Тест амортизаторов</span>
                    <span className="text-[11px] text-[var(--muted-foreground)]">Остаточный демпферный КПД</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)]">
                  <div className="h-9 w-9 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                    <Wrench className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--foreground)] block">Люфты и сайлентблоки</span>
                    <span className="text-[11px] text-[var(--muted-foreground)]">Шаровые, рулевые тяги</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)]">
                  <div className="h-9 w-9 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center shrink-0">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[var(--foreground)] block">Печать диагност-карты</span>
                    <span className="text-[11px] text-[var(--muted-foreground)]">Смета с ценой деталей</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-[var(--primary)]">0 ₽</span>
                  <span className="text-lg text-[var(--muted-foreground)] line-through decoration-red-500/80">
                    1 200 ₽
                  </span>
                  <span className="rounded-lg bg-[var(--primary)]/15 px-2.5 py-1 text-xs font-bold text-[var(--primary)]">
                    100% выгода
                  </span>
                </div>
                <BookingConsultantButton
                  promo="Бесплатная диагностика подвески на вибростенде (0 ₽)"
                  from="Акции: вибростенд"
                  prompt="Здравствуйте! Хочу записаться по акции: «Бесплатная диагностика подвески на вибростенде (0 ₽)». Подскажите свободное время."
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:bg-[var(--primary)]/90 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Записаться по акции</span>
                  <ArrowRight className="h-4 w-4" />
                </BookingConsultantButton>
              </div>
            </div>

            {/* Right Photo Preview */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-2xl group">
                <Image
                  src="/images/promo_vibrating_stand.jpg"
                  alt="Вибростенд автосервиса Автобокс74"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-black/70 backdrop-blur-md flex items-center justify-between text-xs text-white">
                  <div>
                    <span className="font-bold block">Стенд CarCheck-4</span>
                    <span className="text-[11px] text-emerald-400 font-mono">Точность до 0.01 мм</span>
                  </div>
                  <span className="font-mono text-[10px] bg-white/20 px-2 py-1 rounded">
                    Миасс, ул. Печёнкина, 1а
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROMO 2 & 3: Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          {/* PROMO 2: Complex Season TO (7 Cols) */}
          <article className="lg:col-span-7 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 flex flex-col justify-between shadow-xl">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-[var(--primary)]/15 border border-[var(--primary)]/30 px-3 py-1 text-xs font-bold text-[var(--primary)] uppercase tracking-wider">
                  Комплекс сезона
                </span>
                <span className="rounded-lg bg-[var(--secondary)] px-3 py-1 font-mono text-xs text-[var(--muted-foreground)]">
                  Экономия 35%
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)]">
                  Пакет «Сезонное ТО + Компьютерный скан ЭБУ»
                </h2>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2 leading-relaxed">
                  Полный профилактический сервис перед дорогами Урала: аппаратная замена моторного масла + фильтры + чтение ошибок всех электронных блоков дилерским сканером.
                </p>
              </div>

              {/* 3 Step Flow */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-md bg-[var(--card)] flex items-center justify-center font-mono font-bold text-[var(--primary)]">
                      1
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      Замена моторного масла со снятием/установкой защиты
                    </span>
                  </div>
                  <span className="text-[var(--muted-foreground)] font-mono text-[11px]">Регламент</span>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-md bg-[var(--card)] flex items-center justify-center font-mono font-bold text-[var(--primary)]">
                      2
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      Замена 3-х фильтров (масляный, воздушный, салонный)
                    </span>
                  </div>
                  <span className="text-[var(--muted-foreground)] font-mono text-[11px]">Комплекс</span>
                </div>

                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="h-6 w-6 rounded-md bg-[var(--card)] flex items-center justify-center font-mono font-bold text-[var(--primary)]">
                      3
                    </span>
                    <span className="text-[var(--foreground)] font-medium">
                      Сканирование ЭБУ всех систем (ДВС, ABS, SRS)
                    </span>
                  </div>
                  <span className="rounded bg-[var(--primary)]/20 px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--primary)]">
                    ПОДАРОК
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[var(--primary)]">1 900 ₽</span>
                <span className="text-base text-[var(--muted-foreground)] line-through">2 900 ₽</span>
              </div>
              <BookingConsultantButton
                promo="Пакет Сезонное ТО + Компьютерная диагностика (1 900 ₽)"
                from="Акции: пакет ТО"
                prompt="Здравствуйте! Хочу записаться по акции: «Пакет Сезонное ТО + Компьютерная диагностика (1 900 ₽)». Подскажите ближайшее свободное окно."
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--secondary)] px-5 py-2.5 text-xs sm:text-sm font-bold text-[var(--foreground)] hover:border-[var(--primary)] border border-[var(--border)] transition-all cursor-pointer"
              >
                <span>Выбрать пакет</span>
                <ArrowRight className="h-3.5 w-3.5 text-[var(--primary)]" />
              </BookingConsultantButton>
            </div>
          </article>

          {/* PROMO 3: High Conversion Inversion Card (5 Cols) (From Stitch UI) */}
          <article className="lg:col-span-5 rounded-3xl bg-white text-slate-900 p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-slate-100 relative overflow-hidden">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-sm">
                  Онлайн Эксклюзив
                </span>
                <span className="font-mono text-xs font-black text-emerald-700">
                  -10% СКИДКА
                </span>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-950">
                  Скидка 10% на первый визит
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  При онлайн-записи через сайт или AI-консультанта на любые слесарные работы или восстановление стоек.
                </p>
              </div>

              {/* Voucher Code Box */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-500 uppercase">Промокод на скидку:</span>
                  <span className="text-[11px] font-bold text-emerald-700">Автоматически</span>
                </div>
                <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-mono text-sm sm:text-base font-black tracking-wider text-emerald-700">
                    АВТОБОКС2025
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyPromo}
                    className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 transition-colors flex items-center gap-1"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? "Скопировано!" : "Копировать"}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200">
              <BookingConsultantButton
                promo="Скидка 10% на первый визит (промокод АВТОБОКС2025)"
                from="Акции: первый визит"
                prompt="Здравствуйте! Хочу записаться на ремонт с промокодом АВТОБОКС2025 (скидка 10% на первый визит). Подскажите свободное время."
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-slate-950 text-white text-xs sm:text-sm font-bold shadow-md hover:bg-slate-800 transition-all hover:scale-[1.02] cursor-pointer"
              >
                <span>Забронировать с промокодом</span>
                <ArrowRight className="h-4 w-4" />
              </BookingConsultantButton>
            </div>
          </article>
        </div>

        {/* PROMO 4: 4 for 3 Struts */}
        <article className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-[var(--primary)]/15 px-3 py-1 text-xs font-bold text-[var(--primary)] uppercase">
                Спецтехнология
              </span>
              <span className="text-xs text-[var(--muted-foreground)] font-mono">Гарантия 12 месяцев</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[var(--foreground)]">
              Восстановление 4-х стоек по цене 3-х!
            </h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Комплексная азотная прокачка и восстановление амортизаторов без распила. Сохраняем оригинальные стойки, возвращая заводское демпфирующее усилие. Экономия до 70% от покупки новых стоек.
            </p>
          </div>
          <div className="shrink-0">
            <BookingConsultantButton
              promo="Восстановление 4-х стоек по цене 3-х"
              from="Акции: 4 стойки"
              prompt="Здравствуйте! Хочу записаться по акции: «Восстановление 4-х стоек по цене 3-х». Подскажите свободное время на ул. Печёнкина, 1а."
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all hover:scale-105 cursor-pointer"
            >
              <span>Записаться на 4 стойки</span>
              <ArrowRight className="h-4 w-4" />
            </BookingConsultantButton>
          </div>
        </article>
      </div>
    </section>
  );
}
