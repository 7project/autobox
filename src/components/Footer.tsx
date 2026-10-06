import Link from "next/link";
import { Wrench, Phone, MapPin, Clock, MessageCircle, Send, ExternalLink } from "lucide-react";

const services = [
  "Ремонт ходовой части и стоек",
  "Ремонт бензиновых ДВС",
  "Ремонт АКПП и МКПП",
  "Ремонт стартеров и генераторов",
  "Аппаратная замена масла",
  "Антикоррозийная обработка",
  "Склад автозапчастей",
];

const links = [
  { href: "/uslugi", label: "Все услуги" },
  { href: "/ceny", label: "Цены" },
  { href: "/galereya", label: "Галерея работ" },
  { href: "/otzyvy", label: "Отзывы (★ 5.0)" },
  { href: "/akcii", label: "Акции" },
  { href: "/o-nas", label: "О сервисе" },
  { href: "/kontakty", label: "Контакты и AI-Бот" },
];

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--card)] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm">
                <Wrench className="h-4 w-4" />
              </div>
              <span className="text-lg font-black text-[var(--foreground)]">
                Автобокс<span className="text-[var(--primary)]">74rus</span>
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed">
              Легковой автосервис в г. Миасс. Ремонт подвески и стоек, бензиновых двигателей, КПП, аппаратная замена масла. Собственный склад автозапчастей.
            </p>
            {/* Custom compact social buttons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://wa.me/79959277754"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-center text-[#25D366] hover:bg-[#25D366]/10 transition-colors"
                title="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://t.me/+79959277754"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 w-8 rounded-lg border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-center text-[#229ED9] hover:bg-[#229ED9]/10 transition-colors"
                title="Telegram"
              >
                <Send className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://vk.com/avtoboks74rus"
                target="_blank"
                rel="noopener noreferrer"
                className="h-8 px-2.5 rounded-lg border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-center text-xs font-bold text-blue-400 hover:bg-blue-400/10 transition-colors"
                title="ВКонтакте"
              >
                VK
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--foreground)] mb-3">
              Услуги
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="/uslugi"
                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--foreground)] mb-3">
              Разделы
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-[var(--foreground)] mb-3">
              Контакты в Миассе
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-[var(--primary)] shrink-0" />
                <a
                  href="https://yandex.ru/maps/?rtext=~55.057502%2C60.096123&rtt=auto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors inline-flex items-center gap-1 group"
                  title="Построить маршрут в Яндекс Навигаторе (Печёнкина, 1а)"
                >
                  <span>г. Миасс, ул. Печёнкина, 1а</span>
                  <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--primary)]" />
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-[var(--primary)] shrink-0" />
                <a
                  href="tel:+79959277754"
                  className="font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors"
                >
                  +7 (995) 927-77-54
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 mt-0.5 text-[var(--primary)] shrink-0" />
                <div className="text-[var(--muted-foreground)]">
                  <span>Пн–Вс: 10:00 — 20:00 (ежедневно)</span>
                </div>
              </li>
              <li className="pt-1">
                <a
                  href="https://2gis.ru/miass/firm/70000001069433338"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--primary)] hover:underline inline-flex items-center gap-1 font-medium"
                >
                  Страница в 2ГИС (★ 5.0)
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} Автобокс74rus. г. Миасс, Челябинская область.</p>
          <div className="flex items-center gap-3">
            <span>ул. Печёнкина, 1а</span>
            <span>•</span>
            <Link href="/kontakty" className="hover:text-[var(--primary)] transition-colors">
              Онлайн AI-консультант
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
