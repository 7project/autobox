import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

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
      </body>
    </html>
  );
}
