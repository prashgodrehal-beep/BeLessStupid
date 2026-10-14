"use client";
// components/LandingPage.tsx — mobile-optimised

import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { MODELS } from "@/lib/config";
import { useIsMobile } from "@/lib/useIsMobile";

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceHigh: "#F1F0EC",
  border: "#E6E4DF", text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
  green: "#16783A", greenBg: "#F0FDF4", greenBorder: "#86EFAC",
  red: "#C0392B", redBg: "#FEF2F2", redBorder: "#FECACA",
  blue: "#1D5FAD",
};

const QUESTIONS = [
  { q: "What would have to be true for this to work?",          icon: "🔭", color: C.amber },
  { q: "What happens if you're completely wrong?",              icon: "🔃", color: C.red },
  { q: "Are you staying because it's good — or because you've already invested so much?", icon: "🕳", color: "#6D28D9" },
  { q: "What's the best thing you're giving up by choosing this?", icon: "↔", color: C.textDim },
  { q: "What usually happens to people who've made this exact decision before you?", icon: "📊", color: C.blue },
  { q: "What's the probability-weighted upside versus downside?", icon: "⚖", color: C.amber },
];

const DECISION_TYPES = [
  { icon: "🧭", label: "Career pivots" },
  { icon: "💼", label: "Business acquisitions" },
  { icon: "🏠", label: "Real estate" },
  { icon: "🚀", label: "Starting a venture" },
  { icon: "🌅", label: "Early retirement" },
  { icon: "📈", label: "Investments" },
  { icon: "✈️",  label: "Relocation" },
  { icon: "◈",  label: "Any major life call" },
];

export default function LandingPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);

  const px = isMobile ? "16px" : "32px";
  const sectionGap = isMobile ? "40px 0 32px" : "80px 0 56px";

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <nav style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: `0 ${px}`, position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 12 }}>BLS</div>
            {!isMobile && <span style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 700 }}>BeLessStupid</span>}
          </div>

          {isMobile ? (
            /* Mobile nav: just Start free + hamburger hint */
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button onClick={() => router.push("/login")} style={{ padding: "8px 16px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-dm-sans)" }}>
                Start free →
              </button>
              <button onClick={() => setMenuOpen(o => !o)} style={{ width: 36, height: 36, borderRadius: 8, background: C.surfaceHigh, border: `1px solid ${C.border}`, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
                {[0,1,2].map(i => <div key={i} style={{ width: 16, height: 1.5, background: C.textMuted, borderRadius: 2 }} />)}
              </button>
            </div>
          ) : (
            /* Desktop nav */
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => router.push("/learn")} style={{ padding: "8px 16px", background: "transparent", border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-dm-sans)" }}>How it works</button>
              <button onClick={() => router.push("/sample")} style={{ padding: "8px 16px", background: "transparent", border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-dm-sans)" }}>See sample</button>
              <button onClick={() => router.push("/login")} style={{ padding: "8px 18px", background: "transparent", border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-dm-sans)" }}>Sign in</button>
              <button onClick={() => router.push("/login")} style={{ padding: "8px 20px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-dm-sans)", boxShadow: "0 1px 3px rgba(0,0,0,.12)" }}>Start free →</button>
            </div>
          )}
        </div>

        {/* Mobile dropdown menu */}
        {isMobile && menuOpen && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              { label: "How it works", path: "/learn" },
              { label: "See sample", path: "/sample" },
              { label: "Sign in", path: "/login" },
            ].map(item => (
              <button key={item.label} onClick={() => { router.push(item.path); setMenuOpen(false); }} style={{ padding: "10px 12px", background: C.surfaceHigh, border: `1px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 14, fontFamily: "var(--font-dm-sans)", textAlign: "left" as const }}>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: `0 ${px}` }}>

        {/* ── HERO ────────────────────────────────────────────────────────── */}
        <div className="animate-fade-up" style={{ padding: sectionGap }}>

          {/* Belief badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "6px 14px", background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 20 }}>
            <span style={{ fontSize: 13 }}>💡</span>
            <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 12, color: C.amber, fontWeight: 500 }}>
              Important decisions deserve more than your first instinct
            </span>
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? "clamp(30px,9vw,42px)" : "clamp(36px,5.5vw,58px)", lineHeight: 1.1, fontWeight: 900, marginBottom: 18, color: C.text }}>
            Your best thinking<br />doesn&apos;t always show up<br />
            <span style={{ color: C.amber, fontStyle: "italic" }}>when you need it most.</span>
          </h1>

          <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.85, color: C.textMuted, fontWeight: 300, marginBottom: 12, maxWidth: 540 }}>
            Before a big decision — a career move, an investment, a business call — most of us spend weeks going back and forth in our heads. Then we go with our gut.
          </p>
          <p style={{ fontSize: isMobile ? 16 : 18, lineHeight: 1.85, color: C.text, fontWeight: 400, marginBottom: 32, maxWidth: 540 }}>
            BeLessStupid is a <strong>thinking partner</strong> that activates the rational side of your decision-making — before you commit.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", gap: 10, marginBottom: 12, flexDirection: isMobile ? "column" : "row" as const }}>
            <button onClick={() => router.push("/login")} style={{ padding: "14px 28px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 15, fontWeight: 500, fontFamily: "var(--font-dm-sans)", boxShadow: "0 2px 8px rgba(0,0,0,.12)", textAlign: "center" as const }}>
              Stress-Test My Decision →
            </button>
            <button onClick={() => router.push("/sample")} style={{ padding: "14px 20px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 14, fontFamily: "var(--font-dm-sans)", textAlign: "center" as const }}>
              See a sample output
            </button>
          </div>
          <p style={{ fontSize: 12, color: C.textDim, marginBottom: 48 }}>3 free audits — no credit card needed</p>

          {/* ── THE CORE INSIGHT ──────────────────────────────────────────── */}
          <div style={{ padding: isMobile ? "20px 18px" : "28px 30px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, borderLeft: `4px solid ${C.amber}`, boxShadow: "0 2px 8px rgba(0,0,0,.05)", marginBottom: 48 }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.14em", color: C.amber, textTransform: "uppercase" as const, marginBottom: 12 }}>The core problem</div>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 16 : "clamp(16px,2vw,20px)", lineHeight: 1.7, color: C.text, marginBottom: 14 }}>
              Intelligent people make bad decisions all the time. Not because their intelligence disappeared — but because certain reasoning wasn&apos;t activated.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: C.textMuted, margin: 0 }}>
              The typical decision process looks like: <em>intuition → discussion → spreadsheet → confidence → GO.</em> Fast, familiar, and missing the questions that matter most.
            </p>
          </div>

          {/* ── THE QUESTIONS ─────────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.12em", color: C.textDim, textTransform: "uppercase" as const, marginBottom: 8 }}>What BeLessStupid asks before you decide</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? "clamp(20px,6vw,28px)" : "clamp(22px,3.5vw,32px)", fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
              The questions your mind skips.
            </h2>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, marginBottom: 22, maxWidth: 520 }}>
              These aren&apos;t AI questions. They come from some of the most powerful reasoning models humans have ever developed — now surfaced automatically for your specific decision.
            </p>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {QUESTIONS.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${q.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{q.icon}</div>
                  <div style={{ fontSize: 14, color: C.text, lineHeight: 1.55, paddingTop: 6, fontStyle: "italic" }}>&ldquo;{q.q}&rdquo;</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, padding: "12px 14px", background: C.surfaceHigh, borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65, margin: 0 }}>
                <strong style={{ color: C.text }}>The tool isn&apos;t giving intelligence to you.</strong> It&apos;s drawing the intelligence already in you — to the surface, in the right order, before you decide.
              </p>
            </div>
          </div>

          {/* ── HOW IT WORKS ──────────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.12em", color: C.textDim, textTransform: "uppercase" as const, marginBottom: 8 }}>The process</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? "clamp(20px,6vw,28px)" : "clamp(22px,3.5vw,32px)", fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>10 minutes. One Decision Memo.</h2>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, marginBottom: 22 }}>No advice. No opinions. Just your own reasoning — structured, stress-tested, and summarised.</p>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10 }}>
              {[
                { n:"01", title:"Describe the decision", desc:"Write what you're facing in plain language. No structure needed. The tool reads it and extracts the context." },
                { n:"02", title:"Answer focused questions", desc:"You're asked 3–4 targeted questions per reasoning model. Each one activates a different angle you may have missed." },
                { n:"03", title:"Get your blind spots named", desc:"Live insights surface after each section — your assumptions, your risks, your reasoning gaps — as you go." },
                { n:"04", title:"Receive your Decision Memo", desc:"A full output: recommendation, confidence level, biggest risk, key assumptions, and one concrete next action." },
              ].map(s => (
                <div key={s.n} style={{ padding: "16px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, fontWeight: 700, color: C.amber, letterSpacing: "0.1em", marginBottom: 6 }}>{s.n}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 5 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── IS / IS NOT ───────────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 12 }}>
              <div style={{ padding: "18px 20px", background: C.redBg, border: `1px solid ${C.redBorder}`, borderRadius: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10 }}>What BeLessStupid is NOT</div>
                {["An AI that tells you what to do", "A pros-and-cons list generator", "A guarantee of the right outcome", "Financial or legal advice"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                    <span style={{ color: C.red, fontWeight: 700, flexShrink: 0 }}>✕</span>
                    <span style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ padding: "18px 20px", background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.green, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10 }}>What it IS</div>
                {["A structured thinking partner", "Questions that activate your reasoning", "A summary of your own logic — made rigorous", "A decision you can explain and defend"].map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 7, alignItems: "flex-start" }}>
                    <span style={{ color: C.green, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── DECISION TYPES ────────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.12em", color: C.textDim, textTransform: "uppercase" as const, marginBottom: 8 }}>What you can audit</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? "clamp(20px,6vw,28px)" : "clamp(22px,3.5vw,32px)", fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>Any major decision — not just investments.</h2>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, marginBottom: 20 }}>
              Wherever the stakes are high and the pressure to decide feels real.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
              {DECISION_TYPES.map(d => (
                <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 20, boxShadow: "0 1px 3px rgba(0,0,0,.04)" }}>
                  <span style={{ fontSize: 14 }}>{d.icon}</span>
                  <span style={{ fontSize: 13, color: C.textMuted }}>{d.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── THE FRAMEWORKS ────────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, letterSpacing: "0.12em", color: C.textDim, textTransform: "uppercase" as const, marginBottom: 8 }}>Behind the questions</div>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? "clamp(20px,6vw,28px)" : "clamp(22px,3.5vw,32px)", fontWeight: 700, marginBottom: 8, lineHeight: 1.2 }}>
              The same thinking tools the best investors and leaders use.
            </h2>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.75, marginBottom: 20 }}>
              You don&apos;t need to know what these are called. You just answer the questions they surface.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "repeat(2,1fr)" : "repeat(4,1fr)", gap: 8 }}>
              {MODELS.map(m => (
                <div key={m.id} onClick={() => router.push("/learn")} style={{ padding: "12px 10px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.05)", cursor: "pointer" }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${m.color}12`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, marginBottom: 7 }}>{m.icon}</div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, fontWeight: 500, color: m.color, letterSpacing: "0.08em", marginBottom: 3 }}>{m.shortCode}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>{m.name}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 8, fontSize: 12, color: C.textDim }}>← Tap any to learn what each one does</div>
          </div>

          {/* ── SOCIAL PROOF QUOTE ────────────────────────────────────────── */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ padding: isMobile ? "20px 18px" : "28px 30px", background: C.surface, border: `1px solid ${C.border}`, borderLeft: `4px solid ${C.amber}`, borderRadius: "0 16px 16px 0", boxShadow: "0 2px 8px rgba(0,0,0,.05)" }}>
              <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? 15 : "clamp(15px,2vw,18px)", lineHeight: 1.8, color: C.text, fontStyle: "italic", marginBottom: 14 }}>
                &ldquo;It didn&apos;t work. But given what I knew at the time, I can explain exactly why I made that decision.&rdquo;
              </div>
              <p style={{ fontSize: 13, color: C.textMuted, margin: 0 }}>
                That is the standard BeLessStupid helps you reach. Not guaranteed outcomes — but decisions you can defend, even when they don&apos;t go your way.
              </p>
            </div>
          </div>

          {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
          <div style={{ padding: isMobile ? "28px 20px" : "36px 32px", background: C.amberBg, border: `1.5px solid ${C.amberBorder}`, borderRadius: 16, textAlign: "center" as const, marginBottom: 20 }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: isMobile ? "clamp(20px,6vw,28px)" : "clamp(22px,3.5vw,32px)", fontWeight: 700, marginBottom: 12, color: C.text, lineHeight: 1.2 }}>
              Don&apos;t outsource your decision.<br />Upgrade your thinking.
            </div>
            <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 20, lineHeight: 1.75 }}>
              3 free Decision Audits. No credit card. No AI telling you what to do.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexDirection: isMobile ? "column" : "row" as const, marginBottom: 12 }}>
              <button onClick={() => router.push("/login")} style={{ padding: "14px 32px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 15, fontWeight: 500, fontFamily: "var(--font-dm-sans)", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }}>
                Stress-Test My Decision →
              </button>
              <button onClick={() => router.push("/sample")} style={{ padding: "14px 20px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 14, fontFamily: "var(--font-dm-sans)" }}>
                See sample output first
              </button>
            </div>
            <p style={{ fontSize: 12, color: C.textDim }}>
              Built by Prashanth G — GrowthAspire · Bengaluru, India
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
