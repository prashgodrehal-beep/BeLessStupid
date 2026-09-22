// components/Footer.tsx
"use client";

import { useRouter } from "next/navigation";

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", border: "#E6E4DF",
  text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
};

export default function Footer() {
  const router = useRouter();
  return (
    <footer style={{
      background: C.surface, borderTop: `1px solid ${C.border}`,
      padding: "28px 32px",
    }}>
      <div style={{
        maxWidth: 760, margin: "0 auto",
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 6, background: C.amber,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 10,
          }}>BLS</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>BeLessStupid</div>
            <div style={{ fontSize: 11, color: C.textDim }}>A GrowthAspire Product</div>
          </div>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" as const, alignItems: "center" }}>
          {[
            { label: "How it works",    action: () => router.push("/learn") },
            { label: "Sample Memos",    action: () => router.push("/sample") },
            { label: "Privacy Policy",  action: () => router.push("/privacy") },
            { label: "Terms of Use",    action: () => router.push("/terms") },
            { label: "prashgodrehal.com", action: () => window.open("https://prashgodrehal.com", "_blank") },
          ].map(l => (
            <button key={l.label} onClick={l.action} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 13, color: C.textMuted, fontFamily: "var(--font-dm-sans)",
              padding: 0, textDecoration: "none",
              transition: "color .15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.amber)}
            onMouseLeave={e => (e.currentTarget.style.color = C.textMuted)}
            >{l.label}</button>
          ))}
        </div>

        {/* Copyright */}
        <div style={{ fontSize: 12, color: C.textDim, width: "100%", textAlign: "center" as const, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          © {new Date().getFullYear()} GrowthAspire. All rights reserved. BeLessStupid is a decision science tool — not financial, legal or professional advice.
        </div>
      </div>
    </footer>
  );
}
