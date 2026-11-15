import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import { getI18n } from "@/lib/i18n/server";
import { INDIC_FONTS_HREF } from "@/lib/i18n/fonts";

const newsreader = localFont({
  src: [
    { path: "./fonts/Newsreader-latin.woff2", weight: "200 800", style: "normal" },
    { path: "./fonts/Newsreader-italic-latin.woff2", weight: "200 800", style: "italic" },
  ],
  variable: "--font-newsreader",
  display: "swap",
});

const interTight = localFont({
  src: [{ path: "./fonts/InterTight-latin.woff2", weight: "300 800", style: "normal" }],
  variable: "--font-inter-tight",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CaseTime — the cost of waiting for justice",
  description:
    "Turn an Indian court queue into a cost statement: sourced court fees, free legal aid under s.12, the RBI repo rate, and the forums that cost less.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, dir } = getI18n();
  return (
    <html lang={locale} dir={dir} className={`${newsreader.variable} ${interTight.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={INDIC_FONTS_HREF} rel="stylesheet" />
      </head>
      <body>
        <I18nProvider initialLocale={locale}>{children}</I18nProvider>
      </body>
    </html>
  );
}
