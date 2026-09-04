import type { Metadata } from "next";
import { Caveat, Manrope, Roboto_Condensed } from "next/font/google";
import { locales } from "../content";
import "../globals.css";

const display = Roboto_Condensed({
  variable: "--font-display",
  subsets: ["cyrillic", "latin"],
  weight: ["700", "800", "900"],
});

const body = Manrope({
  variable: "--font-body",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const handwritten = Caveat({
  variable: "--font-handwritten",
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;

  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${handwritten.variable}`}>
      <body>{children}</body>
    </html>
  );
}
