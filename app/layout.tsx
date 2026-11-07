import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  return (
    <html lang="en" className={`${newsreader.variable} ${interTight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
