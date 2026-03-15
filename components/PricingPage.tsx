"use client";
// components/PricingPage.tsx

import { useState } from "react";
import { CREDIT_PACKS, FREE_CREDITS_ON_SIGNUP } from "@/lib/packs";
import { useRouter } from "next/navigation";

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceHigh: "#F1F0EC",
  border: "#E6E4DF", text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
  green: "#16783A", greenBg: "#F0FDF4", greenBorder: "#86EFAC",
};

const FAQ = [
  { q: "What counts as one audit?", a: "One full decision run — from intake through all models, stress-test, and Decision Memo. You can run as many models as you like; it still counts as one audit." },
  { q: "Do credits expire?", a: "No. Credits never expire. Buy once, use whenever." },
  { q: "Can I get a refund?", a: "If you have unused credits and are unsatisfied, email us within 7 days for a full refund of unused credits." },
  { q: "Do you offer team plans?", a: "Not yet — Power pack (30 audits) works well for small teams sharing login. Team plans are coming in a future release." },
  { q: "Is this available in USD?", a: "Yes. Razorpay supports international cards. Prices shown in INR — your bank converts at the prevailing rate." },
];

export default function PricingPage({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const router = useRouter();

  const handleCTA = (packId: string) => {
    if (isLoggedIn) router.push(`/audit?buy=${packId}`);
    else router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>

      {/* Nav */}
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 32px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 13 }}>BLS</div>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700 }}>BeLessStupid</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {isLoggedIn
              ? <button onClick={() => router.push("/audit")} style={{ padding: "8px 20px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "var(--font-dm-sans)" }}>Start Audit →</button>
              : <>
                  <button onClick={() => router.push("/login")} style={{ padding: "8px 18px", background: "transparent", border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 14, fontFamily: "var(--font-dm-sans)" }}>Sign in</button>
                  <button onClick={() => router.push("/login")} style={{ padding: "8px 20px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "var(--font-dm-sans)" }}>Start free →</button>
                </>
            }
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "72px 32px 80px" }}>

        {/* Hero */}
        <div className="animate-fade-up" style={{ textAlign: "center", marginBottom: 60 }}>
          <div style={{ display: "inline-block", marginBottom: 16, fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.12em", color: C.amber, background: C.amberBg, border: `1px solid ${C.amberBorder}`, padding: "4px 12px", borderRadius: 20, textTransform: "uppercase" as const }}>
            Simple, pay-per-use pricing
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, marginBottom: 16, lineHeight: 1.1, color: C.text }}>
            Pay for decisions, not subscriptions.
          </h1>
          <p style={{ fontSize: 17, color: C.textMuted, maxWidth: 480, margin: "0 auto", lineHeight: 1.75 }}>
            Every new account gets {FREE_CREDITS_ON_SIGNUP} free audits. Buy more when you need them — credits never expire.
          </p>
        </div>

        {/* Free tier banner */}
        <div className="animate-fade-up" style={{ animationDelay: ".06s", padding: "16px 22px", background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 12, marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 24 }}>🎁</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.green }}>Start with {FREE_CREDITS_ON_SIGNUP} free audits — no card needed</div>
              <div style={{ fontSize: 13, color: C.textMuted }}>Sign up, verify email, and run your first decision immediately.</div>
            </div>
          </div>
          <button onClick={() => router.push("/login")} style={{ padding: "9px 22px", background: C.green, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 14, fontWeight: 500, fontFamily: "var(--font-dm-sans)" }}>
            Start free →
          </button>
        </div>

        {/* Packs */}
        <div className="animate-fade-up" style={{ animationDelay: ".12s", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 60 }}>
          {CREDIT_PACKS.map(pack => (
            <div key={pack.id} style={{
              padding: "28px 22px", background: C.surface,
              border: `1.5px solid ${pack.highlight ? pack.color + "66" : C.border}`,
              borderRadius: 16, position: "relative",
              boxShadow: pack.highlight ? `0 6px 28px ${pack.color}15` : "0 1px 4px rgba(0,0,0,.05)",
            }}>
              {pack.highlight && (
                <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: pack.color, color: "#fff", fontSize: 10, fontWeight: 700, fontFamily: "var(--font-jetbrains)", letterSpacing: "0.1em", padding: "4px 14px", borderRadius: 20, whiteSpace: "nowrap" as const }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 600, color: pack.color, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: 8 }}>{pack.name}</div>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: 38, fontWeight: 900, color: C.text, lineHeight: 1, marginBottom: 4 }}>
                ₹{pack.priceInr}
              </div>
              <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>{pack.perAudit} · ~${pack.priceUsd} USD</div>

              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 18, marginBottom: 20 }}>
                {[
                  `${pack.credits} Decision Audits`,
                  "All 8 mental models",
                  "Full Decision Memo",
                  "Credits never expire",
                ].map((feat, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: C.greenBg, border: `1px solid ${C.greenBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: C.green, flexShrink: 0 }}>✓</div>
                    <span style={{ fontSize: 14, color: C.textMuted }}>{feat}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => handleCTA(pack.id)} style={{
                width: "100%", padding: "12px", border: "none",
                background: pack.highlight ? pack.color : "transparent",
                color: pack.highlight ? "#fff" : pack.color,
                border: pack.highlight ? "none" : `1.5px solid ${pack.color}`,
                borderRadius: 10, fontSize: 15, fontWeight: 500,
                fontFamily: "var(--font-dm-sans)", cursor: "pointer",
                transition: "all .15s",
              } as React.CSSProperties}>
                Get {pack.credits} Audits →
              </button>
            </div>
          ))}
        </div>

        {/* Trust */}
        <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" as const, marginBottom: 64 }}>
          {[
            { icon: "🔒", text: "Razorpay secured" },
            { icon: "⚡", text: "Credits added instantly" },
            { icon: "🔁", text: "No subscription" },
            { icon: "💸", text: "7-day refund policy" },
          ].map(t => (
            <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 14, color: C.textMuted }}>
              <span>{t.icon}</span>{t.text}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 620, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,3vw,30px)", fontWeight: 700, color: C.text }}>Frequently asked</h2>
          </div>
          {FAQ.map((item, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${C.border}`, paddingBottom: 0 }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{
                width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "18px 0", background: "none", border: "none", cursor: "pointer",
                textAlign: "left" as const, gap: 16,
              }}>
                <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{item.q}</span>
                <span style={{ color: C.textMuted, fontSize: 18, flexShrink: 0, transition: "transform .2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              {openFaq === i && (
                <div className="animate-fade-up" style={{ padding: "0 0 18px", fontSize: 14, color: C.textMuted, lineHeight: 1.75 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 72, textAlign: "center", padding: "40px 32px", background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 16 }}>
          <h3 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(20px,3vw,28px)", fontWeight: 700, marginBottom: 12, color: C.text }}>
            Start with 2 free audits today.
          </h3>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 22, lineHeight: 1.7 }}>
            No credit card. No commitment. Run your first decision through the lattice in under 10 minutes.
          </p>
          <button onClick={() => router.push("/login")} style={{ padding: "13px 32px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 16, fontWeight: 500, fontFamily: "var(--font-dm-sans)", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}>
            Start Free →
          </button>
        </div>
      </div>
    </div>
  );
}
