import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  Users,
  Wrench,
  CheckCircle2,
  Star,
  ExternalLink,
  PackageCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "О компании и команда мастеров — Автобокс74rus в Миассе",
  description: "Команда сертифицированных мастеров, оснащение ремзоны и собственный склад автосервиса Автобокс74rus (г. Миасс, ул. Печёнкина, 1а). Победитель премии 2ГИС.",
};

const teamMembers = [
  {
    name: "Алексей Морозов",
    role: "Старший инженер-диагност",
    experience: "Опыт 14 лет",
    specialization: "Компьютерная диагностика, электрика, настройка фаз ГРМ, чип-тюнинг и прошивка ЭБУ",
    imageUrl: "/images/team_alexey_diagnost.jpg",
  },
  {
    name: "Денис Смирнов",
    role: "Ведущий мастер ходовой части",
    experience: "Опыт 11 лет",
    specialization: "Азотное восстановление стоек, подвеска иномарок, сход-развал, запрессовка сайлентблоков",
    imageUrl: "/images/team_denis_suspension.jpg",
  },
  {
    name: "Константин Павлов",
    role: "Мастер-приёмщик",
    experience: "Опыт 9 лет",
    specialization: "Оценка сметы, подбор оригинальных запчастей и дубликатов, согласование сроков",
    imageUrl: "/images/team_konstantin_reception.jpg",
  },
];

const facilities = [
  {
    title: "Главный цех на ул. Печёнкина, 1а",
    desc: "4 гидравлических двухстоечных подъемника грузоподъемностью до 4.5 тонн, чистое полимерное покрытие пола и профессиональный пневмоинструмент.",
    imageUrl: "/images/facility_main_hall.jpg",
  },
  {
    title: "Участок азотной регенерации стоек",
    desc: "Специализированный стенд высокого давления с контролем демпфирования и закачкой азота под заводские параметры без разгерметизации стойки.",
    imageUrl: "/images/facility_strut_bench.jpg",
  },
  {
    title: "Собственный склад автозапчастей",
    desc: "Более 3 000 позиций в наличии: оригинальные масла, свечи NGK/Denso, фильтра, элементы подвески CTR, 555, Lynx, тормозные диски и ремни ГРМ.",
    imageUrl: "/images/facility_parts_warehouse.jpg",
  },
];

export default function ONasPage() {
  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-1.5 text-xs text-[var(--primary)] mb-4 font-bold">
            <Award className="h-3.5 w-3.5" />
            Автосервис №1 в Миассе по оценкам клиентов 2ГИС
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[var(--foreground)] tracking-tight">
            О нашем автосервисе <span className="text-[var(--primary)]">Автобокс74rus</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto">
            г. Миасс, ул. Печёнкина, 1а. Профессиональное обслуживание и ремонт автомобилей с открытой ремзоной и честными сметами.
          </p>
        </div>

        {/* Story & Facts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 items-center">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--foreground)]">
              Честный автосервис, которому доверяет весь Миасс
            </h2>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
              <strong>Автобокс74rus</strong> — это современный легковой автосервис, расположенный в городе Миасс на улице Печёнкина, 1а. Мы заслужили доверие тысяч автовладельцев благодаря принципиальной открытости, профессионализму мастеров и отсутствию навязанных услуг.
            </p>
            <p className="text-sm sm:text-base text-[var(--muted-foreground)] leading-relaxed">
              Главное подтверждение нашего уровня — это признание самих клиентов: наш сервис трижды становился победителем официальной <strong>Премии 2ГИС («Лучший автосервис 2023, 2025 и 2026 годов»)</strong> и удерживает наивысший рейтинг <strong>5.0</strong> на основе более чем 200 реальных отзывов.
            </p>

            <ul className="space-y-3 pt-2">
              {[
                "Победитель Премии 2ГИС: «Лучший автосервис 2026, 2025, 2023» в Миассе",
                "Собственный склад автозапчастей (для иномарок, ВАЗ и контрактных деталей)",
                "Специализированный ремонт и прокачка амортизационных стоек азотом",
                "Аппаратная замена масел со 100% обновлением рабочих жидкостей",
                "Открытая ремонтная зона и фотоотчеты по каждому этапу работ",
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-xs sm:text-sm text-[var(--foreground)]">
                  <CheckCircle2 className="h-4 w-4 text-[var(--primary)] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                href="/#ai-consultant?service=Запись%20на%20осмотр%20и%20консультацию"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all hover:scale-[1.02]"
              >
                <span>Записаться в сервис</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Stat Badges Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center hover:border-[var(--primary)]/50 transition-colors">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Award className="h-6 w-6" />
              </div>
              <p className="text-2xl font-black text-[var(--foreground)]">3 года подряд</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Победитель Премии 2ГИС</p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center hover:border-[var(--primary)]/50 transition-colors">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Star className="h-6 w-6 fill-[var(--primary)] text-[var(--primary)]" />
              </div>
              <p className="text-2xl font-black text-[var(--foreground)]">5.0 / 5.0</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Рейтинг на основе 200+ отзывов</p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center hover:border-[var(--primary)]/50 transition-colors">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <Shield className="h-6 w-6" />
              </div>
              <p className="text-2xl font-black text-[var(--foreground)]">До 12 мес</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Гарантия на все работы и детали</p>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center hover:border-[var(--primary)]/50 transition-colors">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                <PackageCheck className="h-6 w-6" />
              </div>
              <p className="text-2xl font-black text-[var(--foreground)]">3 000+</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-1">Запчастей в наличии на складе</p>
            </div>
          </div>
        </div>

        {/* TEAM SECTION (From Stitch UI) */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-bold uppercase tracking-wider mb-2">
              <Users className="h-3.5 w-3.5" /> Наша команда
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--foreground)]">
              Мастера, отвечающие за результат
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-xl mx-auto mt-2">
              Каждый автомобиль обслуживается профильным специалистом с подтвержденной квалификацией
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all hover:border-[var(--primary)]/50 hover:shadow-xl hover:shadow-[var(--primary)]/10"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[var(--secondary)]">
                  <Image
                    src={member.imageUrl}
                    alt={member.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--card)] via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 rounded-lg bg-[var(--primary)] px-2.5 py-1 text-[11px] font-bold text-white shadow-md">
                    {member.experience}
                  </span>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold text-[var(--primary)]">
                    {member.role}
                  </p>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed pt-1">
                    {member.specialization}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FACILITIES & WORKSHOP EQUIPMENT SECTION (From Stitch UI) */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs text-[var(--primary)] font-bold uppercase tracking-wider mb-2">
              <Wrench className="h-3.5 w-3.5" /> Оснащение сервиса
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[var(--foreground)]">
              Ремзона и оборудование
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] max-w-xl mx-auto mt-2">
              Современные посты, дилерское оборудование и собственный склад автозапчастей на ул. Печёнкина, 1а
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {facilities.map((fac) => (
              <div
                key={fac.title}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden transition-all hover:border-[var(--primary)]/50"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--secondary)]">
                  <Image
                    src={fac.imageUrl}
                    alt={fac.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-base font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer 2GIS link */}
        <div className="mt-16 text-center">
          <a
            href="https://2gis.ru/miass/firm/70000001069433338"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-3 text-xs sm:text-sm font-bold text-[var(--foreground)] hover:border-[var(--primary)]/50 transition-colors"
          >
            <span>Посмотреть все дипломы и подтверждения наград в 2ГИС</span>
            <ExternalLink className="h-4 w-4 text-[var(--primary)]" />
          </a>
        </div>
      </div>
    </section>
  );
}
