"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X } from "lucide-react";
import { useUserConsent } from "@/lib/consentClient";

export function CookieConsentBanner() {
  const { isGranted, grantConsent, isReady } = useUserConsent();
  const [dismissed, setDismissed] = useState(false);
  // STRICT COMPLIANCE: Unprechecked checkbox by default (false)
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If consent is already granted across the site, don't show the banner at all
  if (!isReady || isGranted || dismissed) {
    return null;
  }

  const handleAccept = async () => {
    if (!isChecked) return;
    setIsSubmitting(true);

    try {
      await grantConsent("cookie_banner");
      setDismissed(true);
    } catch (e) {
      console.warn("Cookie consent save error:", e);
      setDismissed(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <aside
      role="region"
      aria-label="Согласие на использование cookie и обработку данных"
      className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:right-5 sm:left-auto sm:max-w-xl z-50 rounded-2xl border-2 border-[var(--primary)]/40 bg-[var(--card)]/95 backdrop-blur-md p-4 sm:p-5 shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
          <Cookie className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-xs sm:text-sm font-bold text-[var(--foreground)]">
              Файлы Cookie и правовая информация
            </h4>
            <button
              onClick={() => setDismissed(true)}
              className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] p-1 rounded-md transition-colors"
              title="Скрыть уведомление"
              aria-label="Закрыть уведомление о cookie"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="mt-1 text-xs text-[var(--muted-foreground)] leading-relaxed">
            Мы используем файлы cookie и технические данные сессии для работы онлайн-записи и фиксации расчетных смет без сбора лишних персональных данных (152-ФЗ РФ).
          </p>

          {/* Strictly Unprechecked Checkbox */}
          <div className="mt-3 pt-2.5 border-t border-[var(--border)]">
            <label className="flex items-start gap-2.5 cursor-pointer group select-none">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-2 border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)] shrink-0 cursor-pointer"
              />
              <span className="text-[11px] sm:text-xs text-[var(--foreground)] leading-tight group-hover:text-[var(--primary)] transition-colors">
                Я согласен на обработку технических данных и использование файлов cookie в соответствии с{" "}
                <Link
                  href="/politika-konfidencialnosti"
                  target="_blank"
                  className="text-[var(--primary)] underline font-medium hover:text-[var(--primary)]/80"
                >
                  Политикой конфиденциальности (152-ФЗ)
                </Link>{" "}
                и условиями{" "}
                <Link
                  href="/oferta"
                  target="_blank"
                  className="text-[var(--primary)] underline font-medium hover:text-[var(--primary)]/80"
                >
                  Публичной оферты
                </Link>
                .
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={handleAccept}
              disabled={!isChecked || isSubmitting}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Фиксация..." : "Принять и продолжить"}</span>
            </button>

            <div className="flex items-center gap-2 text-[10px] text-[var(--muted-foreground)]">
              <Link
                href="/politika-konfidencialnosti"
                className="hover:text-[var(--foreground)] underline"
              >
                152-ФЗ
              </Link>
              <span>•</span>
              <Link
                href="/oferta"
                className="hover:text-[var(--foreground)] underline"
              >
                Оферта
              </Link>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
