"use client";

import { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Send,
  XCircle,
  RotateCcw,
  Fingerprint,
} from "lucide-react";
import { useUserConsent } from "@/lib/consentClient";

interface ConsentFixationCardProps {
  type?: "pdan" | "oferta" | "both";
  title?: string;
  source: string;
}

export function ConsentFixationCard({
  type = "both",
  title = "Официальная электронная фиксация и управление согласием",
  source,
}: ConsentFixationCardProps) {
  const { isGranted, sessionId, isReady, grantConsent, revokeConsent } = useUserConsent();

  // State for form when consent is NOT yet granted
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "revoked" | "error" } | null>(null);

  const handleGrant = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!isChecked) {
      setMessage({
        text: "Необходимо лично подтвердить согласие, установив галочку в поле подтверждения.",
        type: "error",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await grantConsent(source);
      if (res.success) {
        setMessage({
          text: "Согласие успешно зафиксировано в базе данных автосервиса по ID сессии.",
          type: "success",
        });
      } else {
        setMessage({
          text: "Согласие сохранено локально. Запись в базе будет синхронизирована.",
          type: "success",
        });
      }
    } catch (err: any) {
      setMessage({
        text: err.message || "Ошибка при сохранении согласия",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRevoke = async () => {
    if (!window.confirm("Вы действительно хотите отозвать согласие на обработку персональных данных и условия Оферты?")) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    try {
      const res = await revokeConsent(source);
      setIsChecked(false);
      setMessage({
        text: "Согласие успешно отозвано. Изменение статуса зафиксировано в базе данных автосервиса.",
        type: "revoked",
      });
    } catch (err: any) {
      setMessage({
        text: err.message || "Ошибка при отзыве согласия",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isReady) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 text-center text-xs text-[var(--muted-foreground)]">
        Загрузка параметров сессии...
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-[var(--primary)]/30 bg-[var(--card)] p-6 sm:p-8 shadow-xl">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
              {title}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
              Унификация волеизъявления пользователя осуществляется по уникальному цифровому идентификатору сессии без сбора лишних персональных данных.
            </p>
          </div>
        </div>

        {/* Unified Session ID Badge */}
        <div className="hidden sm:flex flex-col items-end shrink-0">
          <span className="text-[10px] font-mono text-[var(--muted-foreground)] uppercase flex items-center gap-1">
            <Fingerprint className="h-3 w-3 text-[var(--primary)]" />
            ID СЕССИИ КЛИЕНТА
          </span>
          <span className="font-mono text-xs font-bold text-[var(--foreground)] bg-[var(--secondary)] px-2 py-0.5 rounded border border-[var(--border)] mt-0.5 max-w-[170px] truncate" title={sessionId}>
            {sessionId}
          </span>
        </div>
      </div>

      {/* Mobile session id */}
      <div className="sm:hidden mb-4 p-2.5 rounded-lg bg-[var(--secondary)] border border-[var(--border)] flex items-center justify-between text-xs">
        <span className="text-[11px] text-[var(--muted-foreground)] flex items-center gap-1">
          <Fingerprint className="h-3.5 w-3.5 text-[var(--primary)]" /> ID сессии:
        </span>
        <span className="font-mono text-[11px] font-bold text-[var(--foreground)] truncate max-w-[180px]">
          {sessionId}
        </span>
      </div>

      {/* Feedback banner */}
      {message && (
        <div
          className={`mb-5 p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : message.type === "revoked"
              ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : message.type === "revoked" ? (
            <XCircle className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Active Consent Management Card */}
      {isGranted ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span>Согласие активно предоставлено и действует для всех страниц сайта</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[11px] font-bold">
              STATUS: GRANTED
            </span>
          </div>

          <div className="text-xs text-[var(--foreground)] space-y-1 font-mono bg-[var(--background)]/80 p-3.5 rounded-lg border border-[var(--border)]">
            <p>
              <strong className="text-[var(--muted-foreground)]">ID субъекта в реестре:</strong> {sessionId}
            </p>
            <p>
              <strong className="text-[var(--muted-foreground)]">Правовые основания:</strong> 152-ФЗ РФ (ПДн), ст. 437 ГК РФ (Оферта), Cookies
            </p>
            <p>
              <strong className="text-[var(--muted-foreground)]">Единая синхронизация:</strong> Галочка подтверждена во всех формах и AI-чате
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-emerald-500/20">
            <p className="text-[11px] text-[var(--muted-foreground)] max-w-md leading-relaxed">
              Вы находитесь на официальной странице управления согласием. Только здесь доступен отзыв или изменение статуса согласия с фиксацией в базе.
            </p>
            <button
              type="button"
              onClick={handleRevoke}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{isSubmitting ? "Отзыв..." : "Отозвать согласие"}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form to Grant Consent */
        <form onSubmit={handleGrant} className="space-y-4">
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--secondary)]/50 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--foreground)]">
              <Lock className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>Унификация без сбора персональных данных</span>
            </div>
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              Для сохранения вашей конфиденциальности номер телефона и ФИО не требуются для фиксации волеизъявления. Ваше согласие юридически закрепляется за сессией <strong className="font-mono text-[var(--foreground)]">{sessionId}</strong> в Supabase.
            </p>
          </div>

          {/* Strictly Unprechecked Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                required
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  if (message) setMessage(null);
                }}
                className="mt-1 h-5 w-5 rounded border-2 border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)] shrink-0 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed group-hover:text-[var(--primary)] transition-colors">
                <strong>Я подтверждаю</strong>, что ознакомлен(а) с условиями Публичной оферты и Политикой обработки персональных данных автосервиса Автобокс74. Даю осознанное и информированное согласие на обработку данных и использование файлов cookie (152-ФЗ РФ).
              </span>
            </label>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !isChecked}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Фиксация в базе..." : "Зафиксировать согласие в реестре"}</span>
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)]">
              <Lock className="h-3 w-3 text-[var(--primary)]" />
              <span>Фиксация в Supabase + Серверный аудит</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
