"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Lock, Send } from "lucide-react";

interface ConsentFixationCardProps {
  type: "pdan" | "oferta" | "both";
  title?: string;
  source: string;
}

export function ConsentFixationCard({
  type = "both",
  title = "Официальная электронная фиксация согласия (152-ФЗ РФ и ст. 437 ГК РФ)",
  source,
}: ConsentFixationCardProps) {
  // STRICT COMPLIANCE: Unprechecked checkbox by default (false)
  const [isChecked, setIsChecked] = useState(false);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ id: string; timestamp: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isChecked) {
      setError("Необходимо лично подтвердить согласие, установив галочку в поле подтверждения.");
      return;
    }

    setIsSubmitting(true);

    try {
      let clientToken = "";
      if (typeof window !== "undefined") {
        clientToken = localStorage.getItem("autobox_session_token") || "web_legal_" + Math.random().toString(36).substring(2, 9);
      }

      const res = await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consentPdan: type === "pdan" || type === "both",
          consentOferta: type === "oferta" || type === "both",
          consentCookies: true,
          consentSource: source,
          clientToken,
          clientPhone: phone.trim() || undefined,
          clientName: name.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка фиксации согласия");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("autobox_consent_accepted", "true");
        localStorage.setItem("autobox_consent_id", data.id);
        localStorage.setItem("autobox_consent_timestamp", data.timestamp);
      }

      setResult({
        id: data.id,
        timestamp: new Date(data.timestamp).toLocaleString("ru-RU", {
          timeZone: "Asia/Yekaterinburg",
        }),
      });
    } catch (err: any) {
      setError(err.message || "Не удалось зафиксировать согласие. Проверьте интернет-соединение.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border-2 border-[var(--primary)]/30 bg-[var(--card)] p-6 sm:p-8 shadow-xl">
      <div className="flex items-start gap-3.5 mb-4">
        <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 text-[var(--primary)] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)]">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">
            Электронная форма фиксации юридического волеизъявления с сохранением записи в базе данных Supabase и локальном журнале аудита автосервиса.
          </p>
        </div>
      </div>

      {result ? (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5 space-y-3 animate-in fade-in">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            <span>Согласие успешно зафиксировано в реестре оператора!</span>
          </div>
          <div className="text-xs text-[var(--foreground)] space-y-1 font-mono bg-[var(--background)]/70 p-3.5 rounded-lg border border-[var(--border)]">
            <p>
              <strong className="text-[var(--muted-foreground)]">ID записи:</strong> {result.id}
            </p>
            <p>
              <strong className="text-[var(--muted-foreground)]">Время фиксации (Екатеринбург/Миасс):</strong> {result.timestamp}
            </p>
            <p>
              <strong className="text-[var(--muted-foreground)]">Статус:</strong> Юридически действительно, занесено в реестр
            </p>
            {phone && (
              <p>
                <strong className="text-[var(--muted-foreground)]">Привязанный телефон:</strong> {phone}
              </p>
            )}
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            Вы можете отозвать согласие в любой момент, обратившись к оператору по телефону +7 (995) 927-77-54 или email info@autobox74.ru с указанием данного идентификатора.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                Ваш телефон (для привязки согласия)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-xs placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--foreground)] mb-1">
                ФИО или Имя (необязательно)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] text-xs placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          {/* Strictly Unprechecked Checkbox (Required) */}
          <div className="pt-2">
            <label className="flex items-start gap-3 cursor-pointer group select-none">
              <input
                type="checkbox"
                required
                checked={isChecked}
                onChange={(e) => {
                  setIsChecked(e.target.checked);
                  if (error) setError(null);
                }}
                className="mt-1 h-5 w-5 rounded border-2 border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)] accent-[var(--primary)] shrink-0 cursor-pointer"
              />
              <span className="text-xs sm:text-sm text-[var(--foreground)] leading-relaxed group-hover:text-[var(--primary)] transition-colors">
                <strong>Я подтверждаю</strong>, что ознакомлен(а) с положениями настоящего документа, действую добровольно и в своем интересе. Даю конкретное, информированное и сознательное согласие на обработку моих персональных данных (152-ФЗ), принятие условий Публичной оферты автосервиса Автобокс74 и использование технических файлов cookie.
              </span>
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="submit"
              disabled={isSubmitting || !isChecked}
              className="px-6 py-3 rounded-xl bg-[var(--primary)] text-white text-xs sm:text-sm font-bold shadow-lg shadow-[var(--primary)]/20 hover:bg-[var(--primary)]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Сохранение в реестре...</span>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  <span>Зафиксировать согласие в реестре</span>
                </>
              )}
            </button>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-[var(--muted-foreground)]">
              <Lock className="h-3 w-3 text-[var(--primary)]" />
              <span>Шифрование SSL • Аудит Supabase</span>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
