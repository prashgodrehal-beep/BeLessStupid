// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

export const metadata = {
  title: "BeLessStupid — Think in Lattices. Decide with Edge.",
  description: "A thinking partner that activates your reasoning before important decisions. 3 free audits — no card needed.",
  openGraph: {
    title: "BeLessStupid — Don't Outsource Your Decision. Upgrade Your Thinking.",
    description: "A structured decision engine for career moves, investments, business calls, and major life decisions. 10 minutes. No advice. Just clarity.",
    url: "https://belessstupid.com",
    siteName: "BeLessStupid",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BeLessStupid — Stress-Test Your Decision" }],
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeLessStupid — Stress-Test Your Decision",
    description: "A thinking partner that activates the rational side of your decision-making — before you commit.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
