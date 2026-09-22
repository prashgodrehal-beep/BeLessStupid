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
  title: "BeLessStupid — Think in Lattices. Decision Engine.",
  description: "Run any major decision through 8 mental models used by top investors, thinkers. Get a structured Decision Memo in under 10 minutes.",
  openGraph: {
    title: "BeLessStupid — Think in Lattices. Decision Engine.",
    description: "Run any major decision through 8 mental models. Get a structured Decision Memo in under 10 minutes, not just advice",
    url: "https://belessstupid.app",
    siteName: "BeLessStupid",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BeLessStupid Decision Audit" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BeLessStupid",
    description: "Run any major decision through 8 mental models.",
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
