import type { Metadata } from "next";
import { Star, MessageSquareQuote, ExternalLink, Award, CheckCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Отзывы клиентов — Автобокс74rus в Миассе | Оценка 5.0 в 2ГИС",
  description: "Реальные отзывы автовладельцев о работе автосервиса Автобокс74rus в г. Миасс на ул. Печёнкина, 1а.",
};

const reviews = [
  {
    name: "Константин Г.",
    car: "Lada Vesta / ремонт подвески",
    rating: 5,
    text: "Обратился в Автобокс74rus на Печёнкина по совету знакомого — стучали передние стойки. Ребята оперативно сделали дефектовку, восстановили стойки и заменили сайлентблоки. Машина снова сбитая, как из салона. Цены абсолютно адекватные, не накручивают лишнего!",
    date: "сентябрь 2026",
    source: "2ГИС (подтвержденный отзыв)",
  },
  {
    name: "Сергей П.",
    car: "Toyota Corolla / аппаратная замена масла в АКПП",
    rating: 5,
    text: "Делал полную аппаратную замену масла в автомате. Понравилось, что масло и оригинальный фильтр были в наличии прямо на складе в сервисе, не пришлось никуда ехать и ждать доставку. Коробка стала переключаться идеально плавно. Рекомендую этот сервис в Миассе!",
    date: "август 2026",
    source: "2ГИС (подтвержденный отзыв)",
  },
  {
    name: "Владимир Т.",
    car: "Renault Duster / антикоррозийная обработка",
    rating: 5,
    text: "Делал полный комплекс антикора днища и арок перед зимой. Сделали очень добротно: перед нанесением всё отмыли, высушили, обработали все скрытые полости порогов. Скинули фотоотчет процесса. Сервис заслуженно берет премию Лучший автосервис уже несколько лет!",
    date: "июль 2026",
    source: "2ГИС (подтвержденный отзыв)",
  },
  {
    name: "Михаил Ш.",
    car: "Kia Sportage / ремонт стартера",
    rating: 5,
    text: "Машина перестала заводиться в самый неподходящий момент. Приехал в Автобокс, сняли стартер, на стенде сразу показали проблему — сгорело втягивающее и стерлись щетки. Все запчасти были у них в наличии, за пару часов машина была на ходу. Огромное спасибо за оперативность!",
    date: "июнь 2026",
    source: "2ГИС (подтвержденный отзыв)",
  },
  {
    name: "Антон К.",
    car: "Hyundai Solaris / замена цепи ГРМ",
    rating: 5,
    text: "Менял комплект ГРМ на бензиновом моторе 1.6. Мастера опытные, моторы знают от и до. Выставили метки по приборам, двигатель работает тихо и ровно. Дали официальную гарантию на работы. Теперь только сюда.",
    date: "май 2026",
    source: "2ГИС (подтвержденный отзыв)",
  },
  {
    name: "Евгений В.",
    car: "Volkswagen Polo / подбор запчастей и ТО",
    rating: 5,
    text: "Удобно, что не нужно самому искать артикулы и заказывать детали в автомагазинах. Записался, приехал — всё подобрали по VIN, заменили быстро и качественно. Лучший автосервис в Миассе!",
    date: "апрель 2026",
    source: "2ГИС (подтвержденный отзыв)",
  },
];

export default function OtzyvyPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1 text-xs text-[var(--primary)] mb-4 font-semibold">
            <Award className="h-3.5 w-3.5" />
            Официальный рейтинг 2ГИС: 5.0 звёзд
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[var(--foreground)]">
            Отзывы клиентов Автобокс74rus в Миассе
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            Более 217 реальных отзывов автовладельцев на независимой площадке 2ГИС
          </p>
        </div>

        {/* Rating Trust Bar */}
        <div className="mb-12 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center sm:text-left">
              <span className="text-5xl font-black text-[var(--foreground)]">5.0</span>
              <div className="flex gap-1 mt-1 justify-center sm:justify-start">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-[var(--primary)] text-[var(--primary)]" />
                ))}
              </div>
            </div>
            <div className="border-l border-[var(--border)] pl-6 hidden sm:block">
              <p className="text-base font-bold text-[var(--foreground)]">Максимальная оценка</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">217+ оценок и 149 фото в карточке 2ГИС</p>
              <div className="flex items-center gap-1.5 text-xs text-[var(--primary)] mt-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Победитель Премии «Лучший автосервис 2026, 2025, 2023»</span>
              </div>
            </div>
          </div>

          <a
            href="https://2gis.ru/miass/firm/70000001069433338/tab/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all"
          >
            <span>Читать все 217 отзывов в 2ГИС</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)]/50 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-[var(--primary)] text-[var(--primary)]" />
                    ))}
                  </div>
                  <MessageSquareQuote className="h-5 w-5 text-[var(--muted-foreground)] opacity-40" />
                </div>
                <p className="text-sm text-[var(--foreground)] leading-relaxed mb-6">
                  «{r.text}»
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border)] flex justify-between items-end text-xs">
                <div>
                  <p className="font-bold text-sm text-[var(--foreground)]">{r.name}</p>
                  <p className="text-[var(--muted-foreground)] mt-0.5">{r.car}</p>
                  <span className="text-[var(--primary)] text-[11px] font-medium">{r.source}</span>
                </div>
                <span className="text-[var(--muted-foreground)]">{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center p-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] max-w-xl mx-auto">
          <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">
            Убедитесь в качестве лично
          </h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Запишитесь на осмотр или ремонт в Автобокс74rus на ул. Печёнкина, 1а
          </p>
          <Link
            href="/kontakty?service=Запись%20на%20осмотр%20и%20ремонт%20по%20отзывам"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[var(--primary)]/20 transition-all hover:bg-[var(--primary)]/90"
          >
            Записаться в автосервис
          </Link>
        </div>
      </div>
    </section>
  );
}
