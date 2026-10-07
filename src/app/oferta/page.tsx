import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, ArrowLeft, Building2, Wrench, CheckCircle2 } from "lucide-react";
import { ConsentFixationCard } from "@/components/ConsentFixationCard";

export const metadata: Metadata = {
  title: "Договор публичной оферты на оказание услуг автосервиса (ст. 435, 437 ГК РФ)",
  description:
    "Договор публичной оферты автосервиса «Автобокс74rus» (г. Миасс, ул. Печёнкина, 1а) на техническое обслуживание, диагностику и ремонт автотранспортных средств.",
};

export default function OfertaPage() {
  return (
    <div className="py-12 sm:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Вернуться на главную страницу</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-10 pb-8 border-b border-[var(--border)]">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] font-mono text-xs font-bold mb-4">
            <FileText className="h-4 w-4" />
            <span>СТАТЬИ 435 И 437 ГРАЖДАНСКОГО КОДЕКСА РФ</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--foreground)] tracking-tight">
            Договор публичной оферты на техническое обслуживание и ремонт транспортных средств
          </h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)] leading-relaxed">
            Настоящий документ является официальным публичным предложением (публичной офертой) автосервиса «Автобокс74rus» заключить договор на оказание услуг по ремонту, диагностике и сервисному обслуживанию легковых автомобилей.
          </p>
        </div>

        {/* Contractor Details */}
        <div className="mb-10 p-6 rounded-2xl border border-[var(--border)] bg-[var(--card)] space-y-4">
          <div className="flex items-center gap-2.5 text-[var(--primary)] font-bold text-sm">
            <Building2 className="h-5 w-5" />
            <span>Реквизиты и каналы связи Исполнителя</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[var(--foreground)]">
            <div>
              <p className="text-[var(--muted-foreground)]">Исполнитель:</p>
              <p className="font-semibold mt-0.5">Автосервис «Автобокс74rus» (Специализированный автотехцентр)</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Место оказания услуг / адрес бокса:</p>
              <p className="font-semibold mt-0.5">456300, Челябинская обл., г. Миасс, ул. Печёнкина, 1а</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Телефон диспетчера / мастера-приёмщика:</p>
              <p className="font-semibold mt-0.5">+7 (995) 927-77-54</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Email и официальный сайт:</p>
              <p className="font-semibold mt-0.5 text-[var(--primary)]">info@autobox74.ru | autobox74.ru</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Режим работы:</p>
              <p className="font-semibold mt-0.5">Ежедневно с 10:00 до 20:00, без перерывов</p>
            </div>
            <div>
              <p className="text-[var(--muted-foreground)]">Склад автозапчастей:</p>
              <p className="font-semibold mt-0.5">Собственный склад оригинальных и аналоговых деталей в наличии</p>
            </div>
          </div>
        </div>

        {/* Interactive Offer Acceptance Card */}
        <div className="mb-12">
          <ConsentFixationCard
            type="oferta"
            source="oferta_page"
            title="Интерактивный акцепт условий Публичной оферты (ст. 438 ГК РФ)"
          />
        </div>

        {/* Contract Text Body */}
        <div className="prose prose-invert max-w-none text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed space-y-8">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              1. Термины, определения и акцепт Оферты
            </h2>
            <p>
              1.1. <strong>Исполнитель</strong> — Автосервис «Автобокс74rus», осуществляющий деятельность по ремонту и обслуживанию автотранспортных средств на сервисной базе по адресу: г. Миасс, ул. Печёнкина, 1а.
            </p>
            <p>
              1.2. <strong>Заказчик</strong> — физическое или юридическое лицо, являющееся владельцем (или законным представителем владельца) транспортного средства, совершившее акцепт настоящей Оферты.
            </p>
            <p>
              1.3. <strong>Акцепт Оферты</strong> — полное и безоговорочное принятие условий Оферты Заказчиком. Акцептом признается любое из следующих конклюдентных действий Заказчика:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--foreground)]">
              <li>Отправка заявки на предварительную запись через интерактивные формы сайта или чат AI-консультанта с проставлением отметки в непредустановленном чекбоксе;</li>
              <li>Предоставление транспортного средства в автосервис на ул. Печёнкина, 1а для проведения диагностики или ремонта;</li>
              <li>Подписание предварительного или итогового заказ-наряда на техническое обслуживание;</li>
              <li>Внесение предоплаты либо оплаты оказанных услуг.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              2. Предмет договора
            </h2>
            <p>
              2.1. Исполнитель обязуется по заданию Заказчика оказать комплекс услуг по техническому обслуживанию, компьютерной и инструментальной диагностике, слесарному ремонту транспортного средства (ТС), а также поставке необходимых запасных частей, а Заказчик обязуется принять и оплатить оказанные услуги в соответствии с условиями настоящего Договора.
            </p>
            <p>
              2.2. Конкретный перечень, объем работ, используемые запасные части, материалы и их стоимость фиксируются в формируемом Заказ-наряде при непосредственной передаче автомобиля в автосервис.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              3. Особенности онлайн-записи и расчёта сметы (AI-Консультант)
            </h2>
            <p>
              3.1. Расчёт стоимости, предоставляемый онлайн-калькулятором, матрицей симптомов или интерактивным AI-консультантом на сайте autobox74.ru, носит <strong>предварительный информационный характер</strong> и базируется на описании симптомов со слов Заказчика.
            </p>
            <p>
              3.2. Окончательная смета формируется мастером-приемщиком после обязательной визуальной и инструментальной дефектовки узлов на подъемнике или вибростенде в присутствии Заказчика (или с его фото/видео-согласованием через мессенджеры).
            </p>
            <p>
              3.3. Специальные акционные скидки и фиксации цен, присвоенные системой онлайн-бронирования (включая уникальный номер талона), действительны при своевременном прибытии в бокс в согласованное время.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              4. Порядок приёмки, выполнения работ и выдачи автомобиля
            </h2>
            <p>
              4.1. Приёмка транспортного средства осуществляется мастером-приемщиком на площадке автосервиса (г. Миасс, ул. Печёнкина, 1а) с оформлением акта осмотра (фиксация видимых кузовных дефектов, пробега и остатка топлива).
            </p>
            <p>
              4.2. Исполнитель незамедлительно уведомляет Заказчика при обнаружении скрытых дефектов или необходимости проведения дополнительных работ, не учтенных в первоначальной смете. Работы выполняются исключительно после согласования с Заказчиком.
            </p>
            <p>
              4.3. Выдача готового автомобиля осуществляется после полной оплаты стоимости фактически оказанных услуг и установленных запасных частей.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              5. Гарантийные обязательства
            </h2>
            <p>
              5.1. Автосервис «Автобокс74rus» предоставляет официальную гарантию на выполненные работы:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[var(--foreground)]">
              <li>Слесарные работы, ремонт ходовой части и замена стоек — <strong>до 6–12 месяцев</strong> (или до 15 000 км пробега);</li>
              <li>Капитальный и текущий ремонт ДВС и трансмиссии — <strong>до 12 месяцев</strong> при соблюдении регламента обкатки;</li>
              <li>Запасные части, приобретенные со склада автосервиса — в соответствии с гарантией завода-изготовителя;</li>
              <li>Регулировочные работы (сход-развал, регулировка фар) — 14 календарных дней.</li>
            </ul>
            <p>
              5.2. Гарантия не распространяется на детали, предоставленные самим Заказчиком (давальческое сырье), а также в случаях механических повреждений, нарушения инструкций по эксплуатации или вмешательства третьих лиц.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              6. Стоимость услуг и порядок расчетов
            </h2>
            <p>
              6.1. Оплата услуг производится в рублях РФ наличными денежными средствами, безналичной оплатой банковскими картами (терминал на приёмке) или по счету на расчетный счет Исполнителя для юридических лиц.
            </p>
            <p>
              6.2. Заказчик обязан оплатить выполненные работы в день подписания акта выполненных работ при получении транспортного средства.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              7. Срок действия Оферты и разрешение споров
            </h2>
            <p>
              7.1. Настоящая Оферта вступает в силу с момента размещения на сайте autobox74.ru и действует до момента её отзыва Исполнителем.
            </p>
            <p>
              7.2. Все споры и разногласия разрешаются путем переговоров. При недостижении согласия спор подлежит разрешению в суде в соответствии с законодательством Российской Федерации.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-[var(--border)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <p>© {new Date().getFullYear()} Автосервис «Автобокс74rus». г. Миасс, ул. Печёнкина, 1а.</p>
              <Link
                href="/politika-konfidencialnosti"
                className="text-[var(--primary)] hover:underline font-semibold"
              >
                Политика обработки персональных данных (152-ФЗ) →
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
