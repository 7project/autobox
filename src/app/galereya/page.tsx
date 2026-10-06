"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Wrench,
  Clock,
  Gauge,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Shield,
  Sparkles,
  Camera,
  Coins,
  Filter,
} from "lucide-react";

interface CaseStudy {
  id: string;
  category: "all" | "shocks" | "suspension" | "engine" | "transmission" | "workshop";
  badge: string;
  beforeAfter: string;
  savings?: string;
  title: string;
  car: string;
  caseNumber: string;
  description: string;
  timeHours: string;
  result: string;
  parameterLabel: string;
  parameterValue: string;
  price: string;
  imageUrl: string;
  serviceBooking: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: "case-crv",
    category: "shocks",
    badge: "Прокачка стоек азотом",
    beforeAfter: "Стенд ДО/ПОСЛЕ",
    savings: "Экономия 18 000 ₽",
    title: "Восстановление и азотная прокачка передних стоек",
    car: "Honda CR-V 2.4",
    caseNumber: "Кейс #0482 • Челябинская обл.",
    description: "Заводская прокачка стоек без разбора корпуса стойки, замена сайлентблоков передних рычагов CTR. Устранен глухой стук, возвращена идеальная курсовая устойчивость на трассе.",
    timeHours: "2 часа",
    result: "Заводская геометрия",
    parameterLabel: "Давление азота:",
    parameterValue: "5.8 Bar (Norm)",
    price: "4 200 ₽",
    imageUrl: "/images/gallery_nitrogen_strut_crv.jpg",
    serviceBooking: "Прокачка стоек азотом на Honda CR-V",
  },
  {
    id: "case-qashqai",
    category: "suspension",
    badge: "Подвеска & Ступицы",
    beforeAfter: "Индикатор SKF",
    title: "Капитальный ремонт подвески и ступичных узлов",
    car: "Nissan Qashqai 2.0 (J11)",
    caseNumber: "Кейс #0514 • Миасс",
    description: "Замена ступичного подшипника в сборе (SKF), стоек и втулок стабилизатора, сайлентблоков подрамника. Полное устранение гула при движении и вибрации в руль.",
    timeHours: "3.5 часа",
    result: "Люфты 0.00 мм",
    parameterLabel: "Проверка биения:",
    parameterValue: "Допуск 0.02 мм",
    price: "5 800 ₽",
    imageUrl: "/images/gallery_suspension_qashqai.jpg",
    serviceBooking: "Ремонт подвески и ступичных узлов Nissan Qashqai",
  },
  {
    id: "case-camry",
    category: "transmission",
    badge: "Аппаратная замена масла",
    beforeAfter: "100% замещение",
    savings: "Продление ресурса АКПП",
    title: "Аппаратная промывка и замена масла в АКПП со снятием поддона",
    car: "Toyota Camry 2.5 (XV70)",
    caseNumber: "Кейс #0529 • Миасс",
    description: "Подключение автоматической промывочной станции через контур охлаждения, замена оригинального фильтра грубой очистки, очистка магнитов поддона, заливка Toyota ATF WS.",
    timeHours: "2.5 часа",
    result: "Плавное переключение",
    parameterLabel: "Объем масла:",
    parameterValue: "11.5 л (100% новое)",
    price: "4 500 ₽",
    imageUrl: "/images/gallery_atf_flush_camry.jpg",
    serviceBooking: "Аппаратная замена масла в АКПП Toyota Camry",
  },
  {
    id: "case-rio",
    category: "engine",
    badge: "Замена цепи ГРМ",
    beforeAfter: "По меткам и фазам",
    title: "Замена комплекта цепи ГРМ и регулировка фаз газораспределения",
    car: "Kia Rio 1.6 (G4FC)",
    caseNumber: "Кейс #0541 • Челябинск",
    description: "Установка усиленной цепи, гидронатяжителя, башмаков и сальника коленвала. Выравнивание угла опережения зажигания, очистка клапанной крышки и замена прокладки.",
    timeHours: "4.5 часа",
    result: "Шум и стук устранены",
    parameterLabel: "Вылет натяжителя:",
    parameterValue: "2 зуба (Завод)",
    price: "8 500 ₽",
    imageUrl: "/images/gallery_timing_chain_rio.jpg",
    serviceBooking: "Замена цепи ГРМ Kia Rio 1.6",
  },
  {
    id: "case-duster",
    category: "shocks",
    badge: "Вибростенд & Стойки",
    beforeAfter: "Тест демпфирования",
    savings: "Экономия 24 000 ₽",
    title: "Регенерация задних газомасляных амортизаторов 4WD",
    car: "Renault Duster 2.0 4x4",
    caseNumber: "Кейс #0563 • Миасс",
    description: "Проверка остаточного демпфирования на вибростенде (было 34%), полная прокачка азотом и замена клапанных пакетов. Итоговый тест демпфирования показал 82%.",
    timeHours: "3 часа",
    result: "Эффективность 82%",
    parameterLabel: "Демпфирование:",
    parameterValue: "+48% жесткости",
    price: "5 600 ₽",
    imageUrl: "/images/gallery_shock_regeneration_duster.jpg",
    serviceBooking: "Восстановление стоек Renault Duster 4x4",
  },
  {
    id: "case-vesta",
    category: "suspension",
    badge: "Усиленные компоненты",
    beforeAfter: "Полиуретан",
    title: "Установка усиленных стоек стабилизатора и полиуретановых втулок",
    car: "LADA Vesta SW Cross",
    caseNumber: "Кейс #0577 • Златоуст",
    description: "Устранение характерного скрипа и стуков в передней подвеске на мелких неровностях. Установлены усиленные тяги стабилизатора с увеличенным шаровым шарниром.",
    timeHours: "1.5 часа",
    result: "Тишина на гравии",
    parameterLabel: "Ресурс узла:",
    parameterValue: "Гарантия 12 мес.",
    price: "2 200 ₽",
    imageUrl: "/images/gallery_stabilizer_vesta.jpg",
    serviceBooking: "Усиленная подвеска LADA Vesta SW Cross",
  },
];

const filterTabs = [
  { key: "all", label: "Все работы", count: 120 },
  { key: "shocks", label: "Прокачка стоек", count: 42 },
  { key: "suspension", label: "Подвеска", count: 54 },
  { key: "engine", label: "ДВС и ГРМ", count: 26 },
  { key: "transmission", label: "АКПП и масла", count: 31 },
];

export default function GalereyaPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredCases = activeTab === "all"
    ? caseStudies
    : caseStudies.filter((c) => c.category === activeTab);

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-xs text-[var(--primary)] font-bold mb-4">
            <Camera className="h-3.5 w-3.5" />
            Открытая ремзона • г. Миасс, ул. Печёнкина, 1а
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight">
            Примеры выполненных работ <br className="hidden sm:inline" />
            <span className="text-[var(--primary)]">&amp; открытая ремзона</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Реальные кейсы ремонта автомобилей наших клиентов. Честная смета, заводские допуски и гарантия до 1 года на все выполненные работы.
          </p>

          {/* Interactive Filter Pills */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20 scale-105"
                    : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/40"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.key ? "bg-white/20 text-white" : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mosaic Grid of Real Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCases.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/10"
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--secondary)]">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-black/30" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="rounded-lg bg-[var(--primary)] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                      {item.badge}
                    </span>
                    <span className="rounded-lg bg-black/60 backdrop-blur-md px-2.5 py-1 text-[11px] font-semibold text-white">
                      {item.beforeAfter}
                    </span>
                  </div>

                  {/* Savings Pill */}
                  {item.savings && (
                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/70 backdrop-blur-md border border-emerald-500/40 px-2.5 py-1 text-[11px] font-extrabold text-emerald-400 flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {item.savings}
                    </div>
                  )}
                </div>

                {/* Content Body */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <div className="flex items-center justify-between text-xs text-[var(--muted-foreground)]">
                    <span className="font-mono text-[11px] font-bold text-[var(--primary)] uppercase">
                      {item.car}
                    </span>
                    <span className="text-[11px]">{item.caseNumber}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>

                  {/* Technical Specs Box */}
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--secondary)]/60 p-3 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-[var(--primary)]" /> Время работы:
                      </span>
                      <span className="font-bold text-[var(--foreground)]">{item.timeHours}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" /> Результат:
                      </span>
                      <span className="font-semibold text-emerald-400">{item.result}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--muted-foreground)] flex items-center gap-1.5">
                        <Gauge className="h-3.5 w-3.5 text-blue-400" /> {item.parameterLabel}
                      </span>
                      <span className="font-mono text-[var(--foreground)]">{item.parameterValue}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="p-5 sm:p-6 pt-0">
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[var(--muted-foreground)] block">
                      Работа под ключ:
                    </span>
                    <span className="text-lg font-black text-[var(--primary)]">
                      {item.price}
                    </span>
                  </div>
                  <Link
                    href={`/kontakty?service=${encodeURIComponent(item.serviceBooking)}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)]/90 hover:scale-105"
                  >
                    <span>Записаться</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Live Workshop Overview Banner */}
        <div className="mt-14 sm:mt-20 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-10 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 font-bold">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                Видеотрансляция и открытый доступ
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">
                Открытая ремзона Автобокс74rus
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                Вы всегда можете лично присутствовать в ремзоне на ул. Печёнкина, 1а при диагностике подвески или наблюдать за ходом ремонта из комфортной клиентской зоны с кофе и Wi-Fi. Никаких скрытых работ и навязанных замен.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" /> 4 современных двухстоечных подъемника
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" /> Азотный стенд высокого давления
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[var(--foreground)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--primary)]" /> Дилерские диагностические сканеры
                </div>
              </div>
              <div className="pt-3">
                <Link
                  href="/kontakty?service=Бесплатная%20диагностика%20ходовой%20в%20ремзоне"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/25 hover:bg-[var(--primary)]/90 transition-all hover:scale-[1.02]"
                >
                  <span>Записаться на осмотр в боксе</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden border border-[var(--border)] shadow-xl">
                <Image
                  src="/images/gallery_workshop_overview.jpg"
                  alt="Ремзона автосервиса Автобокс74 в Миассе"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-mono bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm">
                    Цех №1 • ул. Печёнкина, 1а
                  </span>
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Онлайн 10:00 — 20:00
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2GIS Reviews Link */}
        <div className="mt-10 text-center">
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            Смотрите еще больше реальных фотоотчетов и отзывов на нашей странице в 2ГИС:
          </p>
          <a
            href="https://2gis.ru/miass/firm/70000001069433338"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--primary)] hover:underline"
          >
            <span>Карточка Автобокс74rus в 2ГИС (149+ фото работ)</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
