"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";

export const YANDEX_METRIKA_ID = 113670909;

declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: any[]) => void;
  }
}

function MetrikaNavigationTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.ym === "function") {
      const url =
        pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      window.ym(YANDEX_METRIKA_ID, "hit", url);
    }
  }, [pathname, searchParams]);

  return null;
}

export function YandexMetrika() {
  return (
    <>
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

            ym(${YANDEX_METRIKA_ID}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true,
              ecommerce: "dataLayer"
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <MetrikaNavigationTracker />
      </Suspense>
      <noscript>
        <div>
          <img
            src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
            style={{ position: "absolute", left: "-9999px" }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
