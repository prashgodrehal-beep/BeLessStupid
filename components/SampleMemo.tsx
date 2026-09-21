"use client";
// components/SampleMemo.tsx
// Shows a fully worked sample Decision Audit so users know what to expect.

import { useRouter } from "next/navigation";

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceHigh: "#F1F0EC",
  border: "#E6E4DF", text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
  green: "#16783A", greenBg: "#F0FDF4", greenBorder: "#86EFAC",
  red: "#C0392B", redBg: "#FEF2F2", redBorder: "#FECACA",
  blue: "#1D5FAD", blueBg: "#EFF6FF", blueBorder: "#BFDBFE",
};

const SAMPLE = {
  category: { label: "Career Move", icon: "🧭", color: C.green, bg: C.greenBg, border: C.greenBorder },
  decision: "Should I quit my ₹32L MNC job to join a Series A startup at ₹28L + 0.5% ESOP?",
  intake: {
    gut_choice: "Take the startup offer",
    gut_conf: "60%",
    stakes: "Family income, ₹42K monthly EMI, career trajectory",
    emotion: "Excited but guilty",
    fear: "Startup fails and I can't cover EMI with my family depending on me",
    options: "Join startup / Stay at MNC / Negotiate raise at MNC",
  },
  models: [
    { id:"expected-value", icon:"⚖", code:"EV", color:C.amber,
      insight:"ESOP is positive EV only on a liquidity event with a first-time founder — historically a sub-15% outcome.", status:"warn" },
    { id:"inversion", icon:"🔃", code:"IN", color:C.red,
      insight:"Guaranteed failure path: joining without 9-month cash buffer while carrying ₹42K EMI.", status:"fail" },
    { id:"sunk-cost", icon:"🕳", code:"SC", color:"#6D28D9",
      insight:"6 years of MNC tenure is inflating the 'need to prove myself' pull. Sunk time is not a reason to take risk.", status:"warn" },
    { id:"opp-cost", icon:"↔", code:"OC", color:C.textMuted,
      insight:"Hidden cost isn't the ₹4L salary delta — it's the safety net, PF, ESIC, and career optionality at peak employability.", status:"warn" },
  ],
  verdict: "Delay",
  verdictColor: C.blue, verdictBg: C.blueBg, verdictBorder: C.blueBorder, verdictIcon: "⏸",
  confidence: "Medium",
  bet_size: "Small",
  headline: "Negotiate a 90-day window — use it to build cash buffer and validate the founder before signing.",
  why: "The salary cut plus EMI obligation creates a dangerous cash crunch in months 1–6. The ESOP upside is real but only materialises on a liquidity event with a first-time founder — a low-base-rate outcome. Delaying 90 days to build emergency runway costs nothing and fundamentally changes the risk profile.",
  biggest_risk: "Joining with inadequate cash buffer and discovering the founder's style is incompatible — after EMI obligations have already locked you in financially.",
  key_assumptions: [
    "Startup reaches Series B within 36 months for ESOP to have value",
    "Spouse's income can cover basics if there is a 1–2 month income gap",
    "You can negotiate a decision window without losing the offer",
  ],
  disconfirming: [
    "Founder's references reveal red flags or prior team conflicts",
    "Startup closes a new funding round — dramatically de-risks the bet",
    "MNC offers a meaningful counter (promotion, role change)",
  ],
  next_action: "Call 3 ex-employees of the founder directly — not references they provide. Ask specifically: how do they handle adversity and missed targets?",
  model_flags: {
    "expected-value": { status: "warn", note: "Positive EV, low base rate" },
    "base-rates":     { status: "skipped", note: "not run" },
    "sunk-cost":      { status: "warn", note: "Identity bias detected" },
    "bayesian":       { status: "skipped", note: "not run" },
    "survivorship":   { status: "skipped", note: "not run" },
    "kelly":          { status: "skipped", note: "not run" },
    "inversion":      { status: "fail", note: "No cash buffer — critical" },
    "opp-cost":       { status: "warn", note: "Hidden costs underestimated" },
  },
};

const ALL_MODELS = [
  { id:"expected-value", icon:"⚖", code:"EV", color:C.amber },
  { id:"base-rates",     icon:"📊", code:"BR", color:C.blue },
  { id:"sunk-cost",      icon:"🕳", code:"SC", color:"#6D28D9" },
  { id:"bayesian",       icon:"🔄", code:"BU", color:C.green },
  { id:"survivorship",   icon:"👻", code:"SB", color:"#C05020" },
  { id:"kelly",          icon:"🎯", code:"KS", color:C.green },
  { id:"inversion",      icon:"🔃", code:"IN", color:C.red },
  { id:"opp-cost",       icon:"↔",  code:"OC", color:C.textMuted },
];

const STATUS_COLORS: Record<string, string> = { pass:C.green, warn:C.amber, fail:C.red, skipped:C.textDim };
const STATUS_ICONS:  Record<string, string> = { pass:"✓", warn:"⚠", fail:"✕", skipped:"—" };

export default function SampleMemo() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      {/* Nav */}
      <nav style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: "0 32px", position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 1px 4px rgba(0,0,0,.04)",
      }}>
        <div style={{
          maxWidth: 760, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between", height: 60,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
            onClick={() => router.push("/")}>
            <div style={{
              width: 30, height: 30, borderRadius: 7, background: C.amber,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 12,
            }}>BLS</div>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>BeLessStupid</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => router.push("/learn")} style={{
              padding: "7px 16px", background: C.surface, border: `1.5px solid ${C.border}`,
              color: C.textMuted, cursor: "pointer", borderRadius: 8,
              fontSize: 13, fontFamily: "var(--font-dm-sans)",
            }}>Learn the models</button>
            <button onClick={() => router.push("/audit")} style={{
              padding: "7px 18px", background: C.amber, border: "none",
              color: "#fff", cursor: "pointer", borderRadius: 8,
              fontSize: 13, fontWeight: 500, fontFamily: "var(--font-dm-sans)",
            }}>Start my own audit →</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Page header */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <div style={{
            display: "inline-block", fontFamily: "var(--font-jetbrains)", fontSize: 10,
            letterSpacing: "0.12em", color: C.amber, textTransform: "uppercase" as const,
            background: C.amberBg, border: `1px solid ${C.amberBorder}`,
            padding: "3px 12px", borderRadius: 20, marginBottom: 14,
          }}>Sample Decision Memo</div>
          <h1 style={{
            fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,4vw,36px)",
            fontWeight: 700, lineHeight: 1.2, marginBottom: 10,
          }}>This is what you get.</h1>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.75, maxWidth: 520 }}>
            A full Decision Audit output — real scenario, real models, real recommendation. Run your own in under 10 minutes.
          </p>
        </div>

        {/* Audit metadata */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap" as const, gap: 10, marginBottom: 20,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>{SAMPLE.category.icon}</span>
            <span style={{
              fontFamily: "var(--font-jetbrains)", fontSize: 11, fontWeight: 500,
              color: SAMPLE.category.color, background: SAMPLE.category.bg,
              border: `1px solid ${SAMPLE.category.border}`,
              padding: "3px 10px", borderRadius: 20,
            }}>{SAMPLE.category.label}</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {[
              { l: "4 models run", c: C.textDim },
              { l: "~8 minutes", c: C.textDim },
              { l: "Full memo", c: C.green },
            ].map(s => (
              <span key={s.l} style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: s.c }}>{s.l}</span>
            ))}
          </div>
        </div>

        {/* Decision subject */}
        <div style={{ marginBottom: 16 }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: C.textDim,
            textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6,
          }}>Decision audited</div>
          <div style={{
            fontFamily: "var(--font-playfair)", fontSize: "clamp(17px,2.5vw,22px)",
            fontWeight: 700, lineHeight: 1.35, color: C.text,
          }}>&ldquo;{SAMPLE.decision}&rdquo;</div>
        </div>

        {/* Model chips */}
        <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" as const }}>
          {SAMPLE.models.map(m => (
            <span key={m.id} style={{
              fontSize: 12, color: m.color, background: `${m.color}10`,
              border: `1px solid ${m.color}33`, padding: "3px 10px", borderRadius: 20,
            }}>{m.icon} {m.code}</span>
          ))}
        </div>

        {/* Intake */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "18px 20px", marginBottom: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: C.textDim,
            textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 14,
          }}>What was extracted from the description</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            {[
              { l: "Gut choice", v: SAMPLE.intake.gut_choice },
              { l: "Gut confidence", v: SAMPLE.intake.gut_conf },
              { l: "Dominant emotion", v: SAMPLE.intake.emotion },
              { l: "Core fear", v: SAMPLE.intake.fear },
              { l: "Options considered", v: SAMPLE.intake.options },
              { l: "Stakes", v: SAMPLE.intake.stakes },
            ].map(s => (
              <div key={s.l}>
                <div style={{ fontSize: 11, color: C.textDim, marginBottom: 2 }}>{s.l}</div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Model insights */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, padding: "18px 20px", marginBottom: 14,
          boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: C.textDim,
            textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 14,
          }}>Live insights — generated after each model</div>
          {SAMPLE.models.map((m, i) => (
            <div key={m.id} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              paddingBottom: i < SAMPLE.models.length - 1 ? 14 : 0,
              marginBottom: i < SAMPLE.models.length - 1 ? 14 : 0,
              borderBottom: i < SAMPLE.models.length - 1 ? `1px solid ${C.border}` : "none",
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                background: `${m.color}12`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>{m.icon}</div>
              <div>
                <div style={{
                  fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 500,
                  color: m.color, letterSpacing: "0.08em", marginBottom: 4,
                }}>{m.code} — {m.id.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase())}</div>
                <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{m.insight}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div className="animate-fade-up" style={{
          padding: "22px 24px", background: SAMPLE.verdictBg,
          border: `1.5px solid ${SAMPLE.verdictBorder}`, borderRadius: 16,
          marginBottom: 12, boxShadow: "0 2px 12px rgba(0,0,0,.06)",
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: SAMPLE.verdictColor,
            textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12,
          }}>Recommendation</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{
              width: 50, height: 50, borderRadius: 13, background: SAMPLE.verdictColor,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 22, fontWeight: 700, flexShrink: 0,
            }}>{SAMPLE.verdictIcon}</div>
            <div style={{
              fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,4vw,36px)",
              fontWeight: 900, color: SAMPLE.verdictColor, lineHeight: 1,
            }}>{SAMPLE.verdict}</div>
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: C.text, fontStyle: "italic", marginBottom: 16 }}>
            {SAMPLE.headline}
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ l: "Confidence", v: SAMPLE.confidence }, { l: "Bet Size", v: SAMPLE.bet_size }].map(s => (
              <div key={s.l} style={{
                padding: "9px 16px", background: C.surface,
                border: `1px solid ${C.border}`, borderRadius: 10,
              }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>{s.l}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why */}
        <div style={{
          padding: "18px 20px", background: C.surface,
          border: `1px solid ${C.border}`, borderRadius: 14,
          marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.04)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Why this recommendation</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: C.text, margin: 0 }}>{SAMPLE.why}</p>
        </div>

        {/* Biggest risk */}
        <div style={{
          padding: "16px 20px", background: C.redBg,
          border: `1px solid ${C.redBorder}`, borderRadius: 14, marginBottom: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>⚠ Biggest Risk</div>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75, margin: 0 }}>{SAMPLE.biggest_risk}</p>
        </div>

        {/* Assumptions + disconfirming */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[
            { title: "Key Assumptions",  color: C.amber, bg: C.amberBg, items: SAMPLE.key_assumptions, bullet: "·" },
            { title: "What Changes This", color: C.blue,  bg: C.blueBg,  items: SAMPLE.disconfirming,    bullet: "→" },
          ].map(s => (
            <div key={s.title} style={{
              padding: "16px", background: s.bg,
              border: `1px solid ${C.border}`, borderRadius: 14,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>{s.title}</div>
              {s.items.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 9 }}>
                  <div style={{ color: s.color, fontSize: 14, flexShrink: 0, fontWeight: 700 }}>{s.bullet}</div>
                  <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>{it}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Next action */}
        <div style={{
          padding: "16px 20px", background: C.greenBg,
          border: `1px solid ${C.greenBorder}`, borderRadius: 14, marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.green, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>Next Action — Do This in 7 Days</div>
          <p style={{ fontSize: 15, fontWeight: 500, color: C.text, lineHeight: 1.7, margin: 0 }}>{SAMPLE.next_action}</p>
        </div>

        {/* Lattice */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>
            The Lattice — Model Results
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {ALL_MODELS.map(m => {
              const f = SAMPLE.model_flags[m.id as keyof typeof SAMPLE.model_flags];
              const st = f?.status || "skipped";
              const wasRun = SAMPLE.models.some(sm => sm.id === m.id);
              return (
                <div key={m.id} style={{
                  padding: "12px", background: C.surface,
                  border: `1px solid ${wasRun ? (STATUS_COLORS[st] + "33") : C.border}`,
                  borderTop: `3px solid ${wasRun ? (STATUS_COLORS[st] || C.border) : C.border}`,
                  borderRadius: "0 0 12px 12px", opacity: wasRun ? 1 : 0.4,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 7, background: `${m.color}10`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
                    }}>{m.icon}</div>
                    {wasRun && (
                      <div style={{
                        width: 20, height: 20, borderRadius: 5,
                        background: STATUS_COLORS[st] ? `${STATUS_COLORS[st]}15` : C.surfaceHigh,
                        border: `1px solid ${STATUS_COLORS[st] ? STATUS_COLORS[st] + "33" : C.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 10, fontWeight: 700, color: STATUS_COLORS[st] || C.textDim,
                      }}>{STATUS_ICONS[st] || "?"}</div>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 9, fontWeight: 500, color: wasRun ? m.color : C.textDim, letterSpacing: "0.08em", marginBottom: 2 }}>{m.code}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, lineHeight: 1.4 }}>{wasRun ? f?.note : "not run"}</div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 12, color: C.textDim, marginTop: 8, fontStyle: "italic" }}>
            Greyed models were not included. Run them anytime for a deeper analysis.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          padding: "26px 28px", background: C.amberBg,
          border: `1.5px solid ${C.amberBorder}`, borderRadius: 16, textAlign: "center" as const,
        }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 8, color: C.text }}>
            Now run your own audit.
          </div>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 20, lineHeight: 1.7 }}>
            Pick any major decision you&apos;re sitting on. You get 3 free audits — no card needed.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const }}>
            <button onClick={() => router.push("/audit")} style={{
              padding: "12px 28px", background: C.amber, border: "none",
              color: "#fff", cursor: "pointer", borderRadius: 8,
              fontSize: 15, fontWeight: 500, fontFamily: "var(--font-dm-sans)",
              boxShadow: "0 1px 3px rgba(0,0,0,.12)",
            }}>Start My Free Audit →</button>
            <button onClick={() => router.push("/learn")} style={{
              padding: "12px 22px", background: C.surface, border: `1.5px solid ${C.border}`,
              color: C.textMuted, cursor: "pointer", borderRadius: 8,
              fontSize: 14, fontFamily: "var(--font-dm-sans)",
            }}>Learn the 8 models first</button>
          </div>
        </div>

      </div>
    </div>
  );
}
