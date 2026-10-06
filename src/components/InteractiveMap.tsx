"use client";

import { useState } from "react";
import {
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
  Check,
  Copy,
  Car,
} from "lucide-react";

interface InteractiveMapProps {
  className?: string;
}

export function InteractiveMap({ className }: InteractiveMapProps = {}) {
  // Google is default upon page load, Yandex is second
  const [provider, setProvider] = useState<"google" | "yandex">("google");
  const [loadError, setLoadError] = useState(false);
  const [copied, setCopied] = useState(false);

  const coordinates = { lat: 55.057502, lon: 60.096123 };
  const addressText = "г. Миасс, ул. Печёнкина, 1а";

  // Verified navigation and maps URLs
  const yandexMapsUrl = `https://yandex.ru/maps/?text=Автосервис%20Автобокс74rus%20Миасс%20Печёнкина%201а&ll=${coordinates.lon}%2C${coordinates.lat}&z=17`;
  const yandexNaviUrl = `https://yandex.ru/maps/?rtext=~${coordinates.lat}%2C${coordinates.lon}&rtt=auto`;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lon}`;
  const dgisUrl = "https://2gis.ru/miass/firm/70000001069433338";

  // Embed iframes
  const googleEmbedUrl = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lon}&hl=ru&z=16&output=embed`;
  const yandexEmbedUrl = `https://yandex.ru/map-widget/v1/?ll=${coordinates.lon}%2C${coordinates.lat}&z=16&pt=${coordinates.lon},${coordinates.lat},pm2gnm`;

  const handleCopyYandexLink = () => {
    navigator.clipboard.writeText(yandexMapsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 overflow-hidden shadow-sm ${className || ""}`}>
      {/* Header with Switcher Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-[var(--primary)] shrink-0" />
          <div>
            <h3 className="font-bold text-sm text-[var(--foreground)]">Схема проезда</h3>
            <p className="text-[11px] text-[var(--muted-foreground)]">{addressText}</p>
          </div>
        </div>

        {/* Provider Switch: Google first, Yandex second */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          <div className="inline-flex rounded-lg border border-[var(--border)] bg-[var(--secondary)] p-0.5 text-xs font-semibold">
            {/* 1. Google (Primary by default) */}
            <button
              onClick={() => {
                setProvider("google");
                setLoadError(false);
              }}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                provider === "google"
                  ? "bg-[var(--card)] text-[var(--primary)] shadow-sm font-bold"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Google
            </button>

            {/* 2. Yandex (Secondary) */}
            <button
              onClick={() => {
                setProvider("yandex");
                setLoadError(false);
              }}
              className={`px-3 py-1 rounded-md transition-all flex items-center gap-1 ${
                provider === "yandex"
                  ? "bg-[var(--card)] text-[var(--primary)] shadow-sm font-bold"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              }`}
            >
              Яндекс
            </button>
          </div>

          <a
            href={dgisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-xs text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors"
            title="Открыть в 2ГИС (отзывы и рейтинг)"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Map Embed Frame */}
      <div className="aspect-[16/9] rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--secondary)] relative">
        {loadError ? (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
            <p className="text-xs text-[var(--muted-foreground)] mb-3">
              Карта временно недоступна в текущем режиме.
            </p>
            <button
              onClick={() => {
                setProvider(provider === "google" ? "yandex" : "google");
                setLoadError(false);
              }}
              className="px-4 py-2 rounded-xl bg-[var(--primary)] text-white text-xs font-bold hover:bg-[var(--primary)]/90 transition-all"
            >
              Переключить на {provider === "google" ? "Яндекс Карту" : "Google Карту"}
            </button>
          </div>
        ) : (
          <iframe
            key={provider}
            src={provider === "google" ? googleEmbedUrl : yandexEmbedUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            allowFullScreen={true}
            className="w-full h-full border-0"
            title={`Интерактивная карта Автобокс74rus (${provider})`}
            onError={() => {
              // Automatic failover
              if (provider === "google") {
                setProvider("yandex");
              } else {
                setLoadError(true);
              }
            }}
          />
        )}
      </div>

      {/* Direct Yandex Maps & Navigator Action Bar */}
      <div className="mt-3.5 space-y-2.5">
        {/* Quick Route Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {/* Yandex Navigator */}
          <a
            href={yandexNaviUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold hover:bg-amber-500/20 transition-all text-center"
            title="Открыть маршрут в Яндекс Навигаторе"
          >
            <Car className="h-3.5 w-3.5 shrink-0" />
            <span>Яндекс Навигатор</span>
          </a>

          {/* Google Navigator */}
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold hover:bg-blue-500/20 transition-all text-center"
            title="Открыть маршрут в Google Maps"
          >
            <Compass className="h-3.5 w-3.5 shrink-0" />
            <span>Google Навигатор</span>
          </a>

          {/* Yandex Maps direct */}
          <a
            href={yandexMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-[var(--primary)]/20 font-bold hover:bg-[var(--primary)]/20 transition-all text-center"
            title="Открыть карточку автосервиса на Яндекс Картах"
          >
            <Navigation className="h-3.5 w-3.5 shrink-0" />
            <span>Яндекс Карты</span>
          </a>

          {/* 2GIS direct */}
          <a
            href={dgisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)] font-bold hover:border-[var(--primary)] transition-all text-center"
            title="Открыть карточку и отзывы в 2ГИС"
          >
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
            <span>2ГИС (★ 5.0)</span>
          </a>
        </div>

        {/* Direct Link Banner to Yandex Maps */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 rounded-xl border border-[var(--border)] bg-[var(--secondary)] text-[11px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-[var(--foreground)] shrink-0">
              Ссылка на Яндекс Картах:
            </span>
            <a
              href={yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary)] hover:underline truncate"
              title="Перейти на страницу Яндекс Карт"
            >
              {yandexMapsUrl}
            </a>
          </div>

          <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleCopyYandexLink}
              className="px-2 py-1 rounded-lg border border-[var(--border)] bg-[var(--card)] hover:text-[var(--primary)] text-[10px] font-medium transition-colors flex items-center gap-1"
              title="Скопировать ссылку на Яндекс Карты"
            >
              {copied ? (
                <>
                  <Check className="h-3 w-3 text-emerald-400" />
                  <span className="text-emerald-400">Скопировано!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Копировать</span>
                </>
              )}
            </button>
            <a
              href={yandexMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[var(--primary)] text-white text-[10px] font-bold hover:bg-[var(--primary)]/90 transition-all flex items-center gap-1"
            >
              <span>Открыть</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
