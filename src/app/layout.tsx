import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Автобокс74rus — Автосервис в Миассе | Лучший автосервис 2ГИС",
    template: "%s | Автобокс74rus Миасс",
  },
  description:
    "Автосервис Автобокс74rus в г. Миасс (ул. Печёнкина, 1а). Ремонт ходовой и стоек, бензиновых двигателей, АКПП, МКПП, генераторов, аппаратная замена масла, антикоррозийная обработка. Тел: +7 (995) 927-77-54.",
  keywords: [
    "автосервис миасс",
    "автобокс74rus",
    "автобокс74",
    "ремонт авто миасс",
    "ремонт подвески миасс",
    "замена масла миасс",
    "ремонт акпп миасс",
    "ул печенкина 1а",
  ],
  openGraph: {
    title: "Автобокс74rus — Автосервис в Миассе",
    description: "Лучший автосервис Миасса по версии 2ГИС (2026, 2025, 2023). Оценка 5.0.",
    url: "https://autobox74.ru",
    siteName: "Автобокс74rus",
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[var(--background)] text-[var(--foreground)]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieConsentBanner />
        {/* Yandex.Metrika counter */}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){
                m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document,'script','https://mc.yandex.ru/metrika/tag.js?id=113670909', 'ym');

            ym(113670909, 'init', {ssr:true, webvisor:true, clickmap:true, ecommerce:"dataLayer", referrer: document.referrer, url: location.href, accurateTrackBounce:true, trackLinks:true});
          `}
        </Script>
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/113670909"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
        {/* /Yandex.Metrika counter */}
      </body>
    </html>
  );
}
