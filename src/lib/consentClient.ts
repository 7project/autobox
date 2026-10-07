"use client";

import { useState, useEffect, useCallback } from "react";

const CONSENT_STORAGE_KEY = "autobox_consent_granted";
const SESSION_STORAGE_KEY = "autobox_session_token";
const CONSENT_EVENT_NAME = "autobox_consent_changed";

/**
 * Получить или создать единый ID сессии пользователя
 */
export function getUserSessionId(): string {
  if (typeof window === "undefined") {
    return "guest_server_default";
  }

  try {
    let token = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!token) {
      token = "usr_" + Math.random().toString(36).substring(2, 10) + "_" + Date.now().toString(36);
      localStorage.setItem(SESSION_STORAGE_KEY, token);
    }
    return token;
  } catch {
    return "guest_fallback";
  }
}

/**
 * Проверить локальное состояние согласия
 */
export function getStoredConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Отправить фиксацию или отзыв согласия на сервер
 */
export async function syncConsentWithServer(
  isGranted: boolean,
  source: string = "web_ui"
): Promise<{ success: boolean; id?: string }> {
  const sessionId = getUserSessionId();

  try {
    // 1. Немедленно сохраняем локально и уведомляем все компоненты
    if (typeof window !== "undefined") {
      localStorage.setItem(CONSENT_STORAGE_KEY, isGranted ? "true" : "false");
      window.dispatchEvent(
        new CustomEvent(CONSENT_EVENT_NAME, {
          detail: { isGranted, sessionId, source },
        })
      );
    }

    // 2. Отправляем в базу данных Supabase и локальный журнал сервера
    const res = await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        consentPdan: isGranted,
        consentOferta: isGranted,
        consentCookies: true,
        status: isGranted ? "granted" : "revoked",
        consentSource: source,
      }),
    });

    const data = await res.json();
    return { success: res.ok, id: data.id };
  } catch (e) {
    console.warn("[consentClient] Sync error:", e);
    return { success: false };
  }
}

/**
 * React-хук для реактивной синхронизации галочки согласия по всему сайту
 */
export function useUserConsent() {
  const [isGranted, setIsGranted] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>("");
  const [isReady, setIsReady] = useState<boolean>(false);

  useEffect(() => {
    const currentSessionId = getUserSessionId();
    const currentConsent = getStoredConsent();

    setSessionId(currentSessionId);
    setIsGranted(currentConsent);
    setIsReady(true);

    const handleConsentEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ isGranted: boolean }>;
      if (customEvent.detail && typeof customEvent.detail.isGranted === "boolean") {
        setIsGranted(customEvent.detail.isGranted);
      } else {
        setIsGranted(getStoredConsent());
      }
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === CONSENT_STORAGE_KEY) {
        setIsGranted(e.newValue === "true");
      }
    };

    window.addEventListener(CONSENT_EVENT_NAME, handleConsentEvent);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(CONSENT_EVENT_NAME, handleConsentEvent);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const grantConsent = useCallback(async (source: string) => {
    setIsGranted(true);
    return await syncConsentWithServer(true, source);
  }, []);

  const revokeConsent = useCallback(async (source: string) => {
    setIsGranted(false);
    return await syncConsentWithServer(false, source);
  }, []);

  return {
    isGranted,
    sessionId,
    isReady,
    grantConsent,
    revokeConsent,
  };
}
