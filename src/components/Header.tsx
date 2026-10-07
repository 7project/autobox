"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Phone, Wrench, Send, Sparkles } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { BookingConsultantButton } from "./BookingConsultantButton";

const navLinks = [
  { href: "/", label: "Главная" },
  { href: "/uslugi", label: "Услуги" },
  { href: "/ceny", label: "Цены" },
  { href: "/galereya", label: "Галерея" },
  { href: "/otzyvy", label: "Отзывы" },
  { href: "/akcii", label: "Акции" },
  { href: "/o-nas", label: "О нас" },
  { href: "/kontakty", label: "Контакты" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-md transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25 transition-transform group-hover:scale-105">
              <Wrench className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-[var(--foreground)] uppercase leading-none">
                  АВТОБОКС<span className="text-[var(--primary)]">74</span>
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--secondary)] border border-[var(--border)] text-[9px] font-mono font-bold text-[var(--primary)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse" />
                  МИАСС
                </span>
              </div>
              <span className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                ул. Печёнкина, 1а
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-0.5 flex-nowrap shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-2 py-1.5 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:bg-[var(--secondary)] transition-all whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Quick Actions, Theme Toggle & Messengers */}
          <div className="hidden xl:flex items-center gap-2.5 shrink-0">
            {/* Social / Messengers Mini-Pills */}
            <div className="flex items-center gap-1.5 pr-2 border-r border-[var(--border)]">
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
                className="h-8 px-2 rounded-lg border border-[var(--border)] bg-[var(--secondary)] flex items-center justify-center text-xs font-bold text-blue-400 hover:bg-blue-400/10 transition-colors"
                title="ВКонтакте"
              >
                VK
              </a>
            </div>

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Phone */}
            <a
              href="tel:+79959277754"
              className="flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors pl-1"
            >
              <Phone className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>+7 (995) 927-77-54</span>
            </a>

            {/* CTA */}
            <BookingConsultantButton
              from="Шапка сайта (ПК)"
              prompt="Здравствуйте! Хочу записаться на диагностику и консультацию в Автобокс74 на ул. Печёнкина, 1а."
              className="rounded-lg bg-[var(--primary)] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Консультант 24/7</span>
            </BookingConsultantButton>
          </div>

          {/* Mobile & Tablet Right Controls */}
          <div className="flex xl:hidden items-center gap-2">
            <a
              href="tel:+79959277754"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[var(--foreground)] hover:text-[var(--primary)] transition-colors pr-1"
            >
              <Phone className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>+7 (995) 927-77-54</span>
            </a>
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-[var(--foreground)] border border-[var(--border)] bg-[var(--card)]"
              aria-label="Меню"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Nav Drawer */}
      {mobileOpen && (
        <div className="xl:hidden border-t border-[var(--border)] bg-[var(--background)] px-4 py-4 space-y-2">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2">
            <BookingConsultantButton
              from="Мобильное меню"
              prompt="Здравствуйте! Хочу записаться на диагностику и консультацию в Автобокс74 на ул. Печёнкина, 1а."
              onClick={() => setMobileOpen(false)}
              className="w-full text-center rounded-lg bg-[var(--primary)] py-2.5 text-sm font-bold text-white shadow-sm shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              <span>AI-Консультант 24/7 (Записаться)</span>
            </BookingConsultantButton>
          </div>
          <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <a
              href="tel:+79959277754"
              className="text-sm font-bold text-[var(--foreground)] flex items-center gap-1.5"
            >
              <Phone className="h-4 w-4 text-[var(--primary)]" />
              +7 (995) 927-77-54
            </a>
            <div className="flex items-center gap-1.5">
              <a
                href="https://t.me/+79959277754"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[var(--secondary)] text-[#229ED9] hover:bg-[#229ED9]/10 transition-colors"
                title="Telegram"
              >
                <Send className="h-4 w-4" />
              </a>
              <a
                href="https://vk.com/avtoboks74rus"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-[var(--secondary)] text-blue-400 font-bold text-xs hover:bg-blue-400/10 transition-colors"
                title="ВКонтакте"
              >
                VK
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
