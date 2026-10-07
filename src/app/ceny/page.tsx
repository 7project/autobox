import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Send } from "lucide-react";
import { BookingConsultantButton } from "@/components/BookingConsultantButton";

export const metadata: Metadata = {
  title: "Цены на ремонт авто в Миассе | Автобокс74rus",
  description: "Ориентировочный прайс-лист автосервиса Автобокс74rus в г. Миасс (ул. Печёнкина, 1а).",
};

const priceCategories = [
  {
    category: "Ходовая часть и ремонт стоек",
    items: [
      { name: "Диагностика подвески и ходовой части", price: "от 500 ₽" },
      { name: "Ремонт / восстановление стойки (1 шт.)", price: "от 1 500 ₽" },
      { name: "Замена амортизатора / пружины", price: "от 1 200 ₽" },
      { name: "Замена шаровой опоры / рулевого наконечника", price: "от 600 ₽" },
      { name: "Замена ступичного подшипника", price: "от 1 500 ₽" },
      { name: "Замена сайлентблоков рычагов (со снятием)", price: "от 1 000 ₽" },
      { name: "Замена тормозных колодок (ось)", price: "от 800 ₽" },
    ],
  },
  {
    category: "Аппаратная замена масла и ТО",
    items: [
      { name: "Аппаратная замена моторного масла с фильтром", price: "от 800 ₽" },
      { name: "Аппаратная замена масла в АКПП / вариаторе", price: "от 2 500 ₽" },
      { name: "Замена масла в МКПП / редукторе / мосту", price: "от 700 ₽" },
      { name: "Аппаратная замена охлаждающей жидкости (антифриза)", price: "от 1 200 ₽" },
      { name: "Замена тормозной жидкости с прокачкой системы", price: "от 1 000 ₽" },
      { name: "Замена воздушного / салонного фильтра", price: "от 300 ₽" },
    ],
  },
  {
    category: "Ремонт бензиновых двигателей (ДВС)",
    items: [
      { name: "Компьютерная диагностика ДВС", price: "от 800 ₽" },
      { name: "Замена ремня ГРМ с натяжителем", price: "от 3 500 ₽" },
      { name: "Замена цепи ГРМ со снятием крышек", price: "от 7 000 ₽" },
      { name: "Замена прокладки клапанной крышки", price: "от 1 200 ₽" },
      { name: "Замена сальников коленвала / распредвала", price: "от 1 500 ₽" },
      { name: "Капитальный ремонт бензинового двигателя", price: "от 25 000 ₽" },
    ],
  },
  {
    category: "Ремонт стартеров и генераторов",
    items: [
      { name: "Диагностика стартера / генератора на стенде", price: "от 500 ₽" },
      { name: "Снятие и установка генератора / стартера", price: "от 1 200 ₽" },
      { name: "Замена щеточного узла / регулятора напряжения", price: "от 800 ₽" },
      { name: "Замена диодного моста", price: "от 900 ₽" },
      { name: "Замена подшипников генератора (комплект)", price: "от 1 200 ₽" },
      { name: "Замена бендикса / втягивающего реле стартера", price: "от 900 ₽" },
    ],
  },
  {
    category: "Ремонт трансмиссии (АКПП и МКПП)",
    items: [
      { name: "Диагностика работы коробки передач", price: "от 800 ₽" },
      { name: "Замена комплекта сцепления МКПП", price: "от 4 500 ₽" },
      { name: "Замена сальника привода / кулисы", price: "от 1 000 ₽" },
      { name: "Замена внешнего / внутреннего ШРУСа", price: "от 1 200 ₽" },
      { name: "Ремонт механической коробки (МКПП)", price: "от 8 000 ₽" },
      { name: "Комплексный ремонт АКПП", price: "от 15 000 ₽" },
    ],
  },
  {
    category: "Антикоррозийная обработка авто",
    items: [
      { name: "Антикоррозийная обработка колесных арок (4 шт.)", price: "от 4 000 ₽" },
      { name: "Антикоррозийная обработка днища с мойкой и сушкой", price: "от 8 000 ₽" },
      { name: "Обработка скрытых полостей (пороги, лонжероны, двери)", price: "от 3 500 ₽" },
      { name: "Комплексный антикор всего автомобиля", price: "от 14 000 ₽" },
    ],
  },
];

export default function CenyPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1 text-xs text-[var(--primary)] mb-4 font-semibold">
            Автобокс74rus • г. Миасс, ул. Печёнкина, 1а
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)]">
            Цены на услуги автосервиса в Миассе
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Честные фиксированные цены без скрытых услуг. Точный расчет формируется после визуального осмотра и диагностики.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {priceCategories.map((cat) => (
            <div
              key={cat.category}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden"
            >
              <div className="bg-[var(--secondary)] px-6 py-4 border-b border-[var(--border)] flex justify-between items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[var(--primary)]">
                  {cat.category}
                </h2>
                <BookingConsultantButton
                  service={cat.category}
                  from="Прайс-лист / Цены"
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  title={`Записаться: ${cat.category}`}
                >
                  <span>Записаться</span>
                  <ArrowRight className="h-3 w-3" />
                </BookingConsultantButton>
              </div>
              <div className="divide-y divide-[var(--border)]">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex justify-between items-center px-6 py-3.5 hover:bg-[var(--secondary)]/40 transition-colors"
                  >
                    <span className="text-sm text-[var(--foreground)] pr-4">
                      {item.name}
                    </span>
                    <span className="text-sm font-bold text-[var(--primary)] whitespace-nowrap">
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center max-w-3xl mx-auto">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
            Нужна оценка стоимости конкретного ремонта или подбор запчастей?
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Назовите марку авто, год выпуска и симптомы — мы сразу подскажем стоимость работ и наличие запчастей на складе.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+79959277754"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)]/90"
            >
              <Phone className="h-4 w-4" />
              +7 (995) 927-77-54
            </a>
            <a
              href="https://t.me/+79959277754"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-[#229ED9]/40 bg-[#229ED9]/10 px-6 py-3 text-sm font-semibold text-[#229ED9] transition-all hover:bg-[#229ED9]/20"
            >
              <Send className="h-4 w-4" />
              Написать в Telegram
            </a>
            <BookingConsultantButton
              service="Диагностика и расчет стоимости"
              from="Страница цен / Прайс"
              prompt="Здравствуйте! Хочу записаться на диагностику и точный расчет стоимости ремонта в автосервис Автобокс74."
              className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--primary)] transition-all cursor-pointer"
            >
              Записаться на диагностику
              <ArrowRight className="h-4 w-4" />
            </BookingConsultantButton>
          </div>
        </div>
      </div>
    </section>
  );
}
