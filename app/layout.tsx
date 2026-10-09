import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE } from "@/lib/site";
import "./globals.css";

const bricolage = localFont({ src: "./fonts/bricolage.woff2", variable: "--font-bricolage", weight: "200 800", display: "swap" });
const hanken = localFont({ src: "./fonts/hanken.woff2", variable: "--font-hanken", weight: "100 900", display: "swap" });
const kalam = localFont({
  src: [
    { path: "./fonts/kalam-latin.woff2", weight: "400" },
    { path: "./fonts/kalam-deva.woff2", weight: "400" },
  ],
  variable: "--font-kalam",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Mahina — Monthly Fee Collection App with WhatsApp Reminders & UPI",
    template: "%s | Mahina by SlotRecover",
  },
  description: SITE.description,
  applicationName: SITE.fullName,
  keywords: [
    "fee reminder app", "tuition fee management app", "monthly fee tracker", "fee collection app india",
    "whatsapp payment reminder", "upi payment link", "fee receipt", "tiffin service billing",
    "gym fee reminder", "pg rent reminder", "fees register app",
  ],
  authors: [{ name: "SlotRecover" }],
  creator: "SlotRecover",
  publisher: SITE.legalEntity,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE.url,
    siteName: SITE.fullName,
    title: "Mahina — Collect monthly fees on time, without the awkward ask",
    description: SITE.description,
  },
  twitter: { card: "summary_large_image", title: "Mahina by SlotRecover", description: SITE.tagline },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  category: "business",
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#2433A6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${hanken.variable} ${kalam.variable}`}>
      <body className="antialiased">
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
