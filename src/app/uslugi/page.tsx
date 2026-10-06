"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Wrench,
  Cog,
  Droplets,
  ShieldAlert,
  Zap,
  Settings,
  ShieldCheck,
  ArrowRight,
  CheckCircle,
  Clock,
  PackageCheck,
  Flame,
  Search,
  Sparkles,
} from "lucide-react";

interface ServiceItem {
  id: string;
  category: "struts" | "suspension" | "engine" | "transmission" | "maintenance" | "electric" | "anticor";
  categoryLabel: string;
  title: string;
  description: string;
  duration: string;
  price: string;
  partsAvailability: string;
  included: string[];
  icon: any;
}

const serviceCategories = [
  { id: "all", label: "Все услуги" },
  { id: "struts", label: "Стойки и амортизаторы" },
  { id: "suspension", label: "Ходовая часть" },
  { id: "engine", label: "ДВС и ГРМ" },
  { id: "transmission", label: "АКПП / МКПП" },
  { id: "maintenance", label: "Аппаратное ТО и масла" },
  { id: "electric", label: "Стартеры / генераторы" },
  { id: "anticor", label: "Антикоррозийная обработка" },
];

const services: ServiceItem[] = [
  {
    id: "struts-nitrogen",
    category: "struts",
    categoryLabel: "Стойки и амортизаторы",
    title: "Прокачка и восстановление стоек азотом",
    description: "Заправка двухтрубных амортизаторов сухим азотом и гидравлическим синтетическим маслом под давлением через технологический штуцер без разбора стойки.",
    duration: "30-45 минут",
    price: "от 800 ₽ / шт",
    partsAvailability: "Ремкомплекты в наличии",
    included: [
      "Диагностика демпфирующего усилия стойки",
      "Закачка сухого азота высокой чистоты под давлением",
      "Очистка, полировка и смазка штока амортизатора",
    ],
    icon: Cog,
  },
  {
    id: "suspension-bushings",
    category: "suspension",
    categoryLabel: "Ходовая часть",
    title: "Замена сайлентблоков рычагов",
    description: "Гидравлическая перепрессовка сайлентблоков на стационарном прессе с соблюдением заводских монтажных меток и затяжкой под рабочей нагрузкой.",
    duration: "60-90 минут",
    price: "от 1 200 ₽ / узел",
    partsAvailability: "CTR, Lemförder на складе",
    included: [
      "Снятие и дефектовка рычагов подвески",
      "Выпрессовка/запрессовка гидропрессом 20 тонн",
      "Окончательная протяжка крепежа под весом авто",
    ],
    icon: Wrench,
  },
  {
    id: "suspension-ball-joints",
    category: "suspension",
    categoryLabel: "Ходовая часть",
    title: "Замена шаровых опор и рулевых наконечников",
    description: "Устранение люфтов рулевого управления и подвески с проверкой сопряженных тяг и рулевой рейки.",
    duration: "40-60 минут",
    price: "от 600 ₽ / сторона",
    partsAvailability: "Запчасти в наличии",
    included: [
      "Диагностика люфтов шарнирных соединений",
      "Демонтаж с сохранением посадочных мест кулака",
      "Контроль пыльников и смазочного слоя",
    ],
    icon: Settings,
  },
  {
    id: "engine-timing",
    category: "engine",
    categoryLabel: "ДВС и ГРМ",
    title: "Замена ремней и цепей ГРМ",
    description: "Установка фаз газораспределения по заводским фиксаторам и меткам, замена натяжителей, успокоителей и сальников распредвалов.",
    duration: "3-5 часов",
    price: "от 3 500 ₽",
    partsAvailability: "Gates, INA, оригиналы",
    included: [
      "Снятие приводных ремней и защитных кожухов",
      "Установка спецфиксаторов фаз ГРМ",
      "Замена роликов, помпы (по регламенту) и натяжителя",
    ],
    icon: Cog,
  },
  {
    id: "engine-gaskets",
    category: "engine",
    categoryLabel: "ДВС и ГРМ",
    title: "Устранение течей масла и замена прокладок ГБЦ",
    description: "Замена прокладок клапанных крышек, поддонов, сальников коленвала и распредвалов с очисткой и обезжириванием привалочных плоскостей.",
    duration: "2-4 часа",
    price: "от 1 200 ₽",
    partsAvailability: "Victor Reinz, Elring",
    included: [
      "Очистка и дефектовка привалочных поверхностей",
      "Протяжка динамометрическим ключом по схеме завода",
      "Замена уплотнительных колец свечных колодцев",
    ],
    icon: Wrench,
  },
  {
    id: "trans-atf-flush",
    category: "transmission",
    categoryLabel: "АКПП / МКПП",
    title: "Аппаратная 100% замена масла в АКПП и вариаторах",
    description: "Полное замещение старой отработанной трансмиссионной жидкости через контур охлаждения на специальной автоматической установке с контролем давления.",
    duration: "60-80 минут",
    price: "от 2 500 ₽",
    partsAvailability: "Масла ATF/CVT в наличии",
    included: [
      "Подключение к циркуляционному контуру АКПП",
      "Промывка гидроблока и вымывание взвесей",
      "Замена фильтра тонкой очистки и прокладки поддона",
    ],
    icon: Droplets,
  },
  {
    id: "trans-clutch",
    category: "transmission",
    categoryLabel: "АКПП / МКПП",
    title: "Замена комплекта сцепления МКПП",
    description: "Снятие коробки передач, центровка нового диска сцепления, корзины и замена выжимного гидравлического подшипника.",
    duration: "4-6 часов",
    price: "от 4 500 ₽",
    partsAvailability: "Valeo, Sachs, Luk",
    included: [
      "Снятие/установка механической трансмиссии",
      "Проверка состояния венца маховика",
      "Прокачка гидропривода выключения сцепления",
    ],
    icon: Settings,
  },
  {
    id: "maint-engine-oil",
    category: "maintenance",
    categoryLabel: "Аппаратное ТО и масла",
    title: "Аппаратная замена моторного масла и фильтров",
    description: "Откачка остатков из картера вакуумным экстрактором, заливка свежего синтетического масла из закрытой тары с заменой фильтров.",
    duration: "25-35 минут",
    price: "от 800 ₽",
    partsAvailability: "Motul, Lukoil Genesis, Shell",
    included: [
      "Вакуумная откачка несливаемого остатка",
      "Установка оригинального масляного фильтра",
      "Комплексная проверка уровней всех техжидкостей",
    ],
    icon: Droplets,
  },
  {
    id: "electric-starter",
    category: "electric",
    categoryLabel: "Стартеры / генераторы",
    title: "Ремонт стартеров и генераторов на стенде",
    description: "Диагностика под нагрузкой на стенде проверки, замена втягивающего реле, щеточного узла, диодного моста и обгонной муфты.",
    duration: "2-3 часа",
    price: "от 1 500 ₽",
    partsAvailability: "Оригинальные комплектующие",
    included: [
      "Дефектовка электрической части и обмоток",
      "Замена изношенных подшипников и щеток",
      "Финальное нагрузочное тестирование на стенде",
    ],
    icon: Zap,
  },
  {
    id: "anticor-full",
    category: "anticor",
    categoryLabel: "Антикоррозийная обработка",
    title: "Комплексная антикоррозийная обработка днища и арок",
    description: "Мойка днища на подъемнике горячей водой под давлением, глубокая сушка тепловыми пушками, обработка скрытых полостей и нанесение вибропоглощающего слоя.",
    duration: "24-48 часов",
    price: "от 8 000 ₽",
    partsAvailability: "Составы Dinitrol / Prim",
    included: [
      "Снятие подкрылков и защитных термоэкранов",
      "Обезжиривание и сушка кузова тепловыми пушками",
      "Заливка составов под давлением во все скрытые лонжероны",
    ],
    icon: ShieldAlert,
  },
];

export default function UslugiPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredServices = services.filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.included.some((item) => item.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-xs text-[var(--primary)] font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            Технологический регламент автосервиса • Миасс, ул. Печёнкина, 1а
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[var(--foreground)]">
            Услуги и цены автосервиса <span className="text-[var(--primary)]">Автобокс74rus</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-[var(--muted-foreground)] max-w-3xl">
            Специализированный ремонт стоек азотом, перепрессовка подвески, аппаратная замена техжидкостей и переборка моторов с гарантией до 12 месяцев.
          </p>
        </div>

        {/* Promo Top Highlights from Stitch */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Promo 1 */}
          <div className="relative overflow-hidden rounded-2xl border border-[var(--primary)]/30 bg-gradient-to-br from-[var(--secondary)] to-[var(--card)] p-6 sm:p-8 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/15 text-[var(--primary)] text-xs font-bold uppercase tracking-wider mb-4">
                <Flame className="h-3.5 w-3.5" />
                Спецпредложение недели
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
                Бесплатная диагностика подвески
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
                При выполнении любого ремонта ходовой части или прокачки стоек в нашем автосервисе на ул. Печёнкина, 1а — полная инструментальная дефектовка проводится абсолютно бесплатно (экономия 800 ₽).
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Стоимость по акции</span>
                <span className="text-xl font-black text-[var(--primary)]">0 ₽ вместо 800 ₽</span>
              </div>
              <Link
                href="/#ai-consultant?promo=Бесплатная%20диагностика%20подвески"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-transform active:scale-95"
              >
                <span>Записаться</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Promo 2 */}
          <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[var(--card)] to-[var(--secondary)] p-6 sm:p-8 flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="h-3.5 w-3.5" />
                Заводское качество стоек
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] mb-2">
                Прокачка 4 стоек по цене 3-х
              </h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-6">
                Сохраняем оригинальные заводские стойки и геометрию автомобиля. Закачиваем сухой азот высокой степени очистки и восстанавливаем заводскую жесткость подвески за 1 час.
              </p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
              <div>
                <span className="text-xs text-[var(--muted-foreground)] block">Экономия до 2 400 ₽</span>
                <span className="text-xl font-black text-[var(--foreground)]">от 2 400 ₽ за 4 стойки</span>
              </div>
              <Link
                href="/#ai-consultant?promo=Прокачка%204%20стоек%20по%20цене%203-х"
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-5 py-2.5 text-xs font-bold text-[var(--foreground)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
              >
                <span>Забронировать слот</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Filter Chips & Search Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по названию или процедуре..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--secondary)] pl-10 pr-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div className="text-xs font-medium text-[var(--muted-foreground)]">
              Показано операций: <span className="font-bold text-[var(--foreground)]">{filteredServices.length}</span> из {services.length}
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-2 pt-2">
            {serviceCategories.map((c) => {
              const isActive = activeCategory === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25 scale-[1.02]"
                      : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--primary)]/50"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catalog of Services Grid (Stitch UI 3-column / 2-column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-lg transition-all duration-300 hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[var(--secondary)] text-[11px] font-mono font-medium text-[var(--muted-foreground)]">
                      <Clock className="h-3 w-3" />
                      {service.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed mb-4">
                    {service.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[var(--border)]">
                    <span className="text-[11px] uppercase tracking-wider text-[var(--muted-foreground)] font-bold block">
                      Что входит:
                    </span>
                    <ul className="space-y-1.5">
                      {service.included.map((inc, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-[var(--foreground)]">
                          <CheckCircle className="h-3.5 w-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[var(--border)] flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-[var(--muted-foreground)] block">Работа</span>
                      <span className="text-lg font-extrabold font-mono text-[var(--primary)]">
                        {service.price}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-[var(--muted-foreground)] block">Запчасти</span>
                      <span className="text-xs font-semibold text-[var(--foreground)] flex items-center gap-1 justify-end">
                        <PackageCheck className="h-3.5 w-3.5 text-[var(--primary)]" />
                        {service.partsAvailability}
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/#ai-consultant?service=${encodeURIComponent(service.title)}`}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-md shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)]/90 hover:scale-[1.01]"
                  >
                    <span>Записаться со скидкой 10%</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 rounded-2xl border border-[var(--border)] bg-gradient-to-r from-[var(--secondary)] via-[var(--card)] to-[var(--secondary)] p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-[var(--foreground)] mb-2">
            Не нашли нужную технологическую операцию?
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-6 max-w-xl mx-auto">
            Опишите проблему нашему AI-консультанту или позвоните прямо мастеру-приемщику в автосервис на ул. Печёнкина, 1а.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/#ai-consultant"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Спросить AI-консультанта
            </Link>
            <Link
              href="/#ai-consultant?service=Индивидуальный%20расчет%20ремонта"
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-sm font-bold text-[var(--foreground)] hover:border-[var(--primary)] transition-all"
            >
              Записаться на осмотр
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
