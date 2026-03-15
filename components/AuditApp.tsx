"use client";
// components/AuditApp.tsx

import { useState, useEffect, useRef } from "react";
import type { User } from "@supabase/supabase-js";
import { MODELS, CATEGORIES, CATEGORY_MANDATORY, COMPLEXITY_META } from "@/lib/config";
import type { AuditSession, Model, Category, IntakeAnswers, ModelId } from "@/lib/types";
import { useCredits } from "@/lib/useCredits";
import PricingModal from "@/components/PricingModal";

// ── CLAUDE HELPER ─────────────────────────────────────────────────────────────
async function callClaude(
  messages: Array<{ role: string; content: string }>,
  system: string,
  maxTokens = 1000
) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, system, max_tokens: maxTokens }),
  });
  const data = await res.json();
  return (data.text as string) || "";
}

async function saveDecision(session: AuditSession) {
  await fetch("/api/decisions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(session),
  });
}

// ── LIGHT DESIGN TOKENS ───────────────────────────────────────────────────────
// All colours reference CSS variables where possible so globals.css stays as
// the single source of truth. Inline styles use these JS values for dynamic
// logic (hover states, category colours, etc.).
const C = {
  // Backgrounds
  bg:           "#F8F7F4",
  surface:      "#FFFFFF",
  surfaceHigh:  "#F1F0EC",
  // Borders
  border:       "#E6E4DF",
  borderHigh:   "#D0CEC8",
  // Text
  text:         "#1C1917",
  textMuted:    "#6B6762",
  textDim:      "#A8A49E",
  // Brand amber (darkened for light-bg contrast)
  amber:        "#B5720A",
  amberLight:   "#D4890F",
  amberBg:      "#FEF3E2",
  amberBorder:  "#F5C97A",
  // Semantic
  red:          "#C0392B",
  redBg:        "#FEF2F2",
  redBorder:    "#FECACA",
  green:        "#16783A",
  greenBg:      "#F0FDF4",
  greenBorder:  "#86EFAC",
  blue:         "#1D5FAD",
  blueBg:       "#EFF6FF",
  blueBorder:   "#BFDBFE",
  purple:       "#6D28D9",
  purpleBg:     "#F5F3FF",
  purpleBorder: "#C4B5FD",
};

// ── SHARED COMPONENTS ─────────────────────────────────────────────────────────
const Btn = ({
  children, onClick, variant = "primary", disabled = false, style = {},
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  disabled?: boolean;
  style?: React.CSSProperties;
}) => {
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: C.amber,       color: "#FFF",        boxShadow: "0 1px 3px rgba(0,0,0,.12)" },
    ghost:   { background: C.surface,     color: C.textMuted,   border: `1.5px solid ${C.border}` },
    outline: { background: "transparent", color: C.amber,       border: `1.5px solid ${C.amberBorder}` },
  };
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        padding: "10px 22px", border: "none", borderRadius: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 15,
        transition: "all .15s", opacity: disabled ? 0.4 : 1,
        ...variants[variant], ...style,
      }}
    >
      {children}
    </button>
  );
};

const Tag = ({ children, color = C.amber, bg = C.amberBg }: {
  children: React.ReactNode; color?: string; bg?: string;
}) => (
  <span style={{
    fontFamily: "var(--font-jetbrains)", fontSize: 11, fontWeight: 500,
    letterSpacing: "0.08em", color, background: bg,
    border: `1px solid ${color}44`, padding: "3px 9px",
    borderRadius: 20, textTransform: "uppercase" as const,
  }}>
    {children}
  </span>
);

const ComplexityDots = ({ level, showLabel = true }: { level: string; showLabel?: boolean }) => {
  const c = COMPLEXITY_META[level as keyof typeof COMPLEXITY_META];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
      <div style={{ display: "flex", gap: 3 }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            width: 7, height: 7, borderRadius: "50%",
            background: i <= c.dots ? c.color : C.border,
          }} />
        ))}
      </div>
      {showLabel && (
        <span style={{
          fontFamily: "var(--font-jetbrains)", fontSize: 10,
          color: c.color, letterSpacing: "0.06em",
        }}>
          {c.label}
        </span>
      )}
    </div>
  );
};

function Header({ right }: { right?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: C.amber,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 13,
        }}>BLS</div>
        <span style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700, color: C.text }}>
          BeLessStupid
        </span>
      </div>
      {right}
    </div>
  );
}

function StepLabel({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, background: C.amberBg,
        border: `1px solid ${C.amberBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "var(--font-jetbrains)", fontSize: 12, fontWeight: 700, color: C.amber,
      }}>{n}</div>
      <div style={{
        fontSize: 11, fontWeight: 600, color: C.textDim,
        letterSpacing: "0.12em", textTransform: "uppercase" as const,
      }}>{label}</div>
    </div>
  );
}

function SectionDivider({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color, whiteSpace: "nowrap" as const }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: C.border }} />
      <div style={{ fontSize: 12, color: C.textDim }}>{count} models</div>
    </div>
  );
}

// ── EXPLAINER MODAL ───────────────────────────────────────────────────────────
function ExplainerModal({ model, onClose }: { model: Model; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div className="modal-overlay animate-scale-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: C.surface, borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: "0 20px 60px rgba(0,0,0,.15)",
        maxWidth: 480, width: "100%", padding: 28,
        position: "relative", maxHeight: "88vh", overflowY: "auto",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 16,
          background: C.surfaceHigh, border: "none", color: C.textMuted,
          cursor: "pointer", fontSize: 14, width: 28, height: 28,
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
        }}>✕</button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: `${model.color}18`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
          }}>{model.icon}</div>
          <div>
            <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: model.color, letterSpacing: "0.1em" }}>
              {model.shortCode}
            </div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700 }}>{model.name}</div>
          </div>
        </div>

        <div style={{ marginBottom: 14 }}>
          <ComplexityDots level={model.complexity} />
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, fontStyle: "italic" }}>
            {COMPLEXITY_META[model.complexity as keyof typeof COMPLEXITY_META].tip}
          </div>
        </div>

        <div style={{
          padding: "12px 16px", background: C.amberBg,
          border: `1px solid ${C.amberBorder}`, borderRadius: 8, marginBottom: 18,
        }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontStyle: "italic", color: C.amber }}>
            &ldquo;{model.explainer.plainName}&rdquo;
          </div>
        </div>

        {(["what", "example", "why"] as const).map(k => {
          const labels = { what: "What it does", example: "Real example", why: "Why it matters" };
          return (
            <div key={k} style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 11, fontWeight: 600, color: C.textMuted,
                textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6,
              }}>{labels[k]}</div>
              <p style={{
                fontSize: 14, lineHeight: 1.75,
                color: k === "example" ? C.textMuted : C.text,
                fontStyle: k === "example" ? "italic" : "normal",
              }}>{model.explainer[k]}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── FLASH INSIGHT ─────────────────────────────────────────────────────────────
function FlashInsight({ model, text, onDismiss }: {
  model: Model; text: string; onDismiss?: () => void;
}) {
  return (
    <div className="animate-pop-in" style={{
      padding: "12px 14px", background: C.surface,
      border: `1px solid ${C.border}`, borderLeft: `3px solid ${model.color}`,
      borderRadius: "0 10px 10px 0", marginBottom: 8,
      boxShadow: "0 1px 4px rgba(0,0,0,.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `${model.color}15`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
          }}>{model.icon}</div>
          <div>
            <div style={{
              fontFamily: "var(--font-jetbrains)", fontSize: 10,
              color: model.color, marginBottom: 3, letterSpacing: "0.06em",
            }}>{model.shortCode} INSIGHT</div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.55 }}>{text}</div>
          </div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} style={{
            background: "none", border: "none", color: C.textDim,
            cursor: "pointer", fontSize: 13, flexShrink: 0,
          }}>✕</button>
        )}
      </div>
    </div>
  );
}

// ── VERDICT BADGE ─────────────────────────────────────────────────────────────
function VerdictBadge({ verdict, done, total }: { verdict: string; done: number; total: number }) {
  if (!verdict || done === 0) return null;
  const VS: Record<string, { c: string; bg: string; border: string; i: string }> = {
    "Proceed":              { c: C.green,  bg: C.greenBg,  border: C.greenBorder,  i: "✓" },
    "Avoid":                { c: C.red,    bg: C.redBg,    border: C.redBorder,    i: "✕" },
    "Delay":                { c: C.blue,   bg: C.blueBg,   border: C.blueBorder,   i: "⏸" },
    "Run experiment first": { c: C.amber,  bg: C.amberBg,  border: C.amberBorder,  i: "⚗" },
    "Partial commit":       { c: C.amber,  bg: C.amberBg,  border: C.amberBorder,  i: "◑" },
    "Exit":                 { c: C.red,    bg: C.redBg,    border: C.redBorder,    i: "↩" },
  };
  const vs = VS[verdict] || { c: C.amber, bg: C.amberBg, border: C.amberBorder, i: "◈" };
  return (
    <div className="animate-pop-in" style={{
      padding: "12px 14px", background: vs.bg,
      border: `1px solid ${vs.border}`, borderRadius: 10,
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, background: vs.c,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 15, fontWeight: 700, flexShrink: 0,
      }}>{vs.i}</div>
      <div>
        <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.textMuted, marginBottom: 2 }}>
          PRELIMINARY · {done}/{total} MODELS
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: vs.c }}>{verdict}</div>
      </div>
    </div>
  );
}

// ── SCREEN: CATEGORY PICKER ───────────────────────────────────────────────────
function CategoryPicker({ onSelect }: { onSelect: (c: Category) => void }) {
  const [hov, setHov] = useState<string | null>(null);
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <Header right={<Tag>Step 1 of 4</Tag>} />
      <div className="animate-fade-up" style={{ maxWidth: 660, margin: "0 auto" }}>
        <StepLabel n="01" label="Decision Type" />
        <h2 style={{
          fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,4vw,36px)",
          fontWeight: 700, marginBottom: 10, lineHeight: 1.2, color: C.text,
        }}>What kind of decision is this?</h2>
        <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 32, lineHeight: 1.7 }}>
          Your category determines which mental models are mandatory — and which are optional depth.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 }}>
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div
                onClick={() => onSelect(cat)}
                onMouseEnter={() => setHov(cat.id)}
                onMouseLeave={() => setHov(null)}
                style={{
                  padding: "20px 18px", cursor: "pointer", userSelect: "none",
                  background: hov === cat.id ? cat.bg : C.surface,
                  border: `1.5px solid ${hov === cat.id ? cat.border : C.border}`,
                  borderRadius: 12, transition: "all .16s",
                  boxShadow: hov === cat.id
                    ? "0 4px 16px rgba(0,0,0,.08)"
                    : "0 1px 4px rgba(0,0,0,.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <div style={{
                    width: 38, height: 38, borderRadius: 10,
                    background: `${cat.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                  }}>{cat.icon}</div>
                  <div style={{
                    fontSize: 16, fontWeight: 600,
                    color: hov === cat.id ? cat.color : C.text, transition: "color .16s",
                  }}>{cat.label}</div>
                </div>
                <div style={{ fontSize: 13, color: C.textMuted, paddingLeft: 48 }}>{cat.tagline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SCREEN: MODE SELECTOR ─────────────────────────────────────────────────────
function ModeSelector({ category, onSelect }: { category: Category; onSelect: (m: "quick" | "guided") => void }) {
  const modes = [
    {
      id: "quick" as const, icon: "⚡", title: "Quick Audit", time: "~5 min",
      color: C.amber, bg: C.amberBg, border: C.amberBorder,
      desc: "Describe your decision in your own words. Claude extracts the structure and runs the models.",
      tags: ["Free-form input", "Claude extracts context", "Complete memo"],
    },
    {
      id: "guided" as const, icon: "🧭", title: "Guided Audit", time: "~10 min",
      color: C.blue, bg: C.blueBg, border: C.blueBorder,
      desc: "Answer 3 required questions to frame your decision, with optional depth questions available.",
      tags: ["3 required fields", "Optionals available", "Complete memo"],
    },
  ];
  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <Header right={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>{category.icon}</span>
          <Tag color={category.color} bg={category.bg}>{category.label}</Tag>
        </div>
      } />
      <div className="animate-fade-up" style={{ maxWidth: 580, margin: "0 auto" }}>
        <StepLabel n="02" label="Audit Mode" />
        <h2 style={{
          fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,4vw,34px)",
          fontWeight: 700, marginBottom: 10, lineHeight: 1.2, color: C.text,
        }}>How do you want to work through this?</h2>
        <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 30, lineHeight: 1.7 }}>
          Both paths produce the same Decision Memo — full models, full recommendation.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {modes.map(o => (
            <div key={o.id} onClick={() => onSelect(o.id)} style={{
              padding: "22px 20px", cursor: "pointer", background: C.surface,
              border: `1.5px solid ${o.border}`, borderRadius: 14, transition: "all .16s",
              boxShadow: "0 1px 4px rgba(0,0,0,.05)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, background: o.bg,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                    }}>{o.icon}</div>
                    <div>
                      <div style={{ fontSize: 17, fontWeight: 600, color: o.color }}>{o.title}</div>
                      <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: C.textMuted }}>{o.time}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.7, marginBottom: 12 }}>{o.desc}</p>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                    {o.tags.map(t => (
                      <span key={t} style={{
                        fontSize: 12, color: C.textMuted, background: C.surfaceHigh,
                        border: `1px solid ${C.border}`, padding: "3px 10px", borderRadius: 20,
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{
                  width: 32, height: 32, borderRadius: 8, background: o.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: o.color, fontSize: 16, flexShrink: 0, marginLeft: 12,
                }}>→</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SCREEN: QUICK INTAKE ──────────────────────────────────────────────────────
function QuickIntake({ category, onComplete }: { category: Category; onComplete: (a: IntakeAnswers) => void }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const words = text.trim().split(/\s+/).filter(Boolean).length;

  const proceed = async () => {
    setLoading(true);
    const sys = `Extract structured context from a free-form decision description. Return ONLY valid JSON with no markdown:
{"decision":"one-sentence statement","all_options":"options mentioned","gut_choice":"what they seem to want","gut_conf":"estimated confidence e.g. 60%","stakes":"what's at risk","emotion_now":"dominant emotion","fear":"what they fear most","assumptions":"key assumptions"}`;
    const r = await callClaude(
      [{ role: "user", content: `Category: ${category.label}\nText: ${text}` }],
      sys, 400
    );
    try {
      const d = JSON.parse(r.replace(/```json|```/g, "").trim());
      onComplete({ ...d, raw_text: text, mode: "quick" });
    } catch {
      onComplete({ decision: text, raw_text: text, gut_choice: "", gut_conf: "50%", all_options: "Not specified", emotion_now: "Not specified", mode: "quick" });
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <Header right={<Tag>Quick Audit</Tag>} />
      <div className="animate-fade-up" style={{ maxWidth: 560, margin: "0 auto" }}>
        <StepLabel n="03" label="Your Decision" />
        <h2 style={{
          fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,3.5vw,32px)",
          fontWeight: 700, marginBottom: 10, lineHeight: 1.25, color: C.text,
        }}>Think out loud. No structure needed.</h2>
        <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 24, lineHeight: 1.7 }}>
          Write what the decision is, what&apos;s pulling you, what you&apos;re afraid of. Claude reads it and extracts the structure.
        </p>
        <div style={{ position: "relative" }}>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder={`Tell me about your ${category.label.toLowerCase()} decision...\n\nFor example: "I'm thinking about quitting my job to build my startup. I've been building nights and weekends for 8 months. I have 3 paying customers and 10 months of savings. My co-founder is ready but I keep hesitating..."`}
            style={{ minHeight: 240, paddingBottom: 38 }}
          />
          <div style={{
            position: "absolute", bottom: 12, right: 14,
            fontFamily: "var(--font-jetbrains)", fontSize: 11,
            color: words >= 20 ? C.green : C.textDim, transition: "color .3s",
          }}>
            {words} words {words >= 20 ? "✓" : "— write at least 20"}
          </div>
        </div>
        <div style={{ marginTop: 14, marginBottom: 28 }}>
          <div style={{
            fontSize: 12, fontWeight: 600, color: C.textDim,
            textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10,
          }}>Prompts if you&apos;re stuck</div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const }}>
            {["What's pulling me toward this?", "What am I most afraid of?", "What happens if I do nothing?", "What's my best alternative?"].map(p => (
              <button key={p} onClick={() => setText(t => t + (t ? "\n\n" : "") + p + " ")} style={{
                padding: "6px 12px", background: C.surface, border: `1.5px solid ${C.border}`,
                borderRadius: 20, color: C.textMuted, fontSize: 13, cursor: "pointer",
                fontFamily: "var(--font-dm-sans)",
              }}>+ {p}</button>
            ))}
          </div>
        </div>
        <Btn onClick={proceed} disabled={words < 20 || loading} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
          {loading ? "Claude is reading this..." : "Extract & Build My Model List →"}
        </Btn>
      </div>
    </div>
  );
}

// ── SCREEN: GUIDED INTAKE ─────────────────────────────────────────────────────
function GuidedIntake({ category, onComplete }: { category: Category; onComplete: (a: IntakeAnswers) => void }) {
  const [ans, setAns] = useState<Record<string, string>>({});
  const [showOpt, setShowOpt] = useState(false);
  const set = (k: string, v: string) => setAns(p => ({ ...p, [k]: v }));

  const required = [
    { id: "decision",    label: "State the decision in one clear sentence", type: "text",     placeholder: "e.g. Should I quit my job to build my startup full-time?" },
    { id: "all_options", label: "List ALL realistic options — including doing nothing",  type: "textarea", placeholder: "Option A: ...\nOption B: ...\nOption C: Do nothing" },
    { id: "gut_choice",  label: "What does your gut want? How confident? (0–100%)",   type: "text",     placeholder: "I want to quit — about 65% confident" },
  ];
  const optional = [
    { id: "worst_case",  label: "Worst case if this goes wrong?",          type: "textarea", placeholder: "What exactly happens to your life?" },
    { id: "assumptions", label: "Key assumptions driving your view?",      type: "textarea", placeholder: "I assume the market exists..." },
    { id: "emotion_now", label: "What emotion is loudest right now?",      type: "text",     placeholder: "Fear / Excitement / Urgency / Regret..." },
  ];
  const ok = required.every(f => ans[f.id]?.trim());

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      <Header right={<Tag color={category.color} bg={category.bg}>Guided Audit</Tag>} />
      <div className="animate-fade-up" style={{ maxWidth: 540, margin: "0 auto" }}>
        <StepLabel n="03" label="Frame Your Decision" />
        <h2 style={{
          fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,3.5vw,32px)",
          fontWeight: 700, marginBottom: 10, lineHeight: 1.25, color: C.text,
        }}>3 questions to start.</h2>
        <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 28, lineHeight: 1.7 }}>
          Answer these three required questions, then add optional depth if you want more precision.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, marginBottom: 24 }}>
          {required.map((f, i) => (
            <div key={f.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 26, height: 26, borderRadius: 8, flexShrink: 0,
                  background: ans[f.id]?.trim() ? C.amber : C.surfaceHigh,
                  border: `1.5px solid ${ans[f.id]?.trim() ? C.amber : C.border}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 600, fontSize: 13,
                  color: ans[f.id]?.trim() ? "#fff" : C.textDim, transition: "all .2s",
                }}>{ans[f.id]?.trim() ? "✓" : i + 1}</div>
                <label style={{ fontSize: 15, fontWeight: 500, color: C.text, lineHeight: 1.5 }}>{f.label}</label>
              </div>
              {f.type === "textarea"
                ? <textarea value={ans[f.id] || ""} onChange={e => set(f.id, e.target.value)} placeholder={f.placeholder} style={{ marginLeft: 36 }} />
                : <input type="text" value={ans[f.id] || ""} onChange={e => set(f.id, e.target.value)} placeholder={f.placeholder} style={{ marginLeft: 36 }} />
              }
            </div>
          ))}
        </div>

        <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20, marginBottom: 24 }}>
          <button onClick={() => setShowOpt(s => !s)} style={{
            display: "flex", alignItems: "center", gap: 8, background: "none", border: "none",
            cursor: "pointer", color: C.textMuted, fontSize: 14,
            fontFamily: "var(--font-dm-sans)", fontWeight: 500,
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: 6, background: C.surfaceHigh,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, transition: "transform .2s",
              transform: showOpt ? "rotate(90deg)" : "rotate(0)",
            }}>▶</div>
            {showOpt ? "Hide" : "Add"} optional depth questions
            <span style={{ fontSize: 12, color: C.textDim }}>({optional.length} available)</span>
          </button>
          {showOpt && (
            <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 20 }}>
              {optional.map(f => (
                <div key={f.id}>
                  <label style={{ fontSize: 15, fontWeight: 500, color: C.textMuted, display: "block", marginBottom: 8 }}>
                    {f.label} <span style={{ color: C.textDim, fontSize: 13 }}>(optional)</span>
                  </label>
                  {f.type === "textarea"
                    ? <textarea value={ans[f.id] || ""} onChange={e => set(f.id, e.target.value)} placeholder={f.placeholder} />
                    : <input type="text" value={ans[f.id] || ""} onChange={e => set(f.id, e.target.value)} placeholder={f.placeholder} />
                  }
                </div>
              ))}
            </div>
          )}
        </div>

        <Btn onClick={() => onComplete({
          decision: ans.decision, all_options: ans.all_options,
          gut_choice: ans.gut_choice, gut_conf: "",
          worst_case: ans.worst_case || "", assumptions: ans.assumptions || "",
          emotion_now: ans.emotion_now || "", mode: "guided",
        })} disabled={!ok} style={{ width: "100%", justifyContent: "center", padding: "14px" }}>
          Choose My Models →
        </Btn>
      </div>
    </div>
  );
}

// ── SCREEN: MODEL SELECTOR ────────────────────────────────────────────────────
function ModelSelector({ category, intakeAns, onComplete }: {
  category: Category; intakeAns: IntakeAnswers; onComplete: (models: Model[]) => void;
}) {
  const mandatoryIds = CATEGORY_MANDATORY[category.id as keyof typeof CATEGORY_MANDATORY] || ["expected-value", "inversion", "opp-cost"];
  const [selected, setSelected] = useState<Set<string>>(() => new Set(mandatoryIds));
  const [explainer, setExplainer] = useState<Model | null>(null);

  const toggle = (id: string) => {
    if (mandatoryIds.includes(id as ModelId)) return;
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const selectedModels = MODELS.filter(m => selected.has(m.id));
  const estMins = selectedModels.reduce((a, m) => a + (m.complexity === "simple" ? 2 : m.complexity === "medium" ? 4 : 6), 0);
  const mandatory = MODELS.filter(m => mandatoryIds.includes(m.id as ModelId));
  const optional  = MODELS.filter(m => !mandatoryIds.includes(m.id as ModelId));

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      {explainer && <ExplainerModal model={explainer} onClose={() => setExplainer(null)} />}
      <Header right={
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span>{category.icon}</span>
          <Tag color={category.color} bg={category.bg}>{category.label}</Tag>
        </div>
      } />

      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div className="animate-fade-up">
          <StepLabel n="04" label="Choose Your Models" />
          <h2 style={{
            fontFamily: "var(--font-playfair)", fontSize: "clamp(22px,3.5vw,32px)",
            fontWeight: 700, marginBottom: 10, lineHeight: 1.25, color: C.text,
          }}>Choose your depth.</h2>
          <p style={{ fontSize: 16, color: C.textMuted, marginBottom: 28, lineHeight: 1.7 }}>
            Mandatory models are required for a sound audit of your decision type. Add optional ones for a more precise memo.
          </p>
        </div>

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <SectionDivider label={`🔒 Required for ${category.label}`} count={mandatory.length} color={C.amber} />
            {mandatory.map(m => (
              <ModelCard key={m.id} model={m} checked mandatory onExplain={() => setExplainer(m)} onToggle={() => {}} />
            ))}
            <div style={{ marginTop: 24 }}>
              <SectionDivider label="Optional — add for deeper audit" count={optional.length} color={C.textMuted} />
              {optional.map(m => (
                <ModelCard key={m.id} model={m} checked={selected.has(m.id)} mandatory={false}
                  onToggle={() => toggle(m.id)} onExplain={() => setExplainer(m)} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ width: 192, flexShrink: 0 }}>
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 14, padding: "18px 16px", marginBottom: 12,
              boxShadow: "0 1px 4px rgba(0,0,0,.05)",
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>
                Your Audit
              </div>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 5, marginBottom: 14 }}>
                {MODELS.map(m => (
                  <div key={m.id} title={m.name} style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: selected.has(m.id) ? `${m.color}15` : C.surfaceHigh,
                    border: `1.5px solid ${selected.has(m.id) ? m.color : C.border}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13, transition: "all .2s",
                  }}>{selected.has(m.id) ? m.icon : ""}</div>
                ))}
              </div>
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
                {[{ l: "Models selected", v: `${selected.size} / 8` }, { l: "Est. time", v: `~${estMins} min` }].map(s => (
                  <div key={s.l} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>{s.l}</span>
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, fontWeight: 500, color: s.l.includes("time") ? C.amber : C.text }}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
            <Btn onClick={() => onComplete(selectedModels)} style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: 14 }}>
              Run {selected.size} Models →
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModelCard({ model, checked, mandatory, onToggle, onExplain }: {
  model: Model; checked: boolean; mandatory: boolean; onToggle: () => void; onExplain: () => void;
}) {
  return (
    <div onClick={mandatory ? undefined : onToggle} style={{
      padding: "14px 16px",
      background: checked ? `${model.color}07` : C.surface,
      border: `1.5px solid ${checked ? model.color + "44" : C.border}`,
      borderRadius: 12, cursor: mandatory ? "default" : "pointer",
      transition: "all .16s", display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
      boxShadow: "0 1px 3px rgba(0,0,0,.04)",
    }}>
      <div style={{
        flexShrink: 0, width: 22, height: 22, borderRadius: 6,
        background: mandatory ? C.amberBg : checked ? model.color : C.surface,
        border: `1.5px solid ${mandatory ? C.amberBorder : checked ? model.color : C.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 700,
        color: mandatory ? C.amber : "#fff", transition: "all .2s",
      }}>{mandatory ? "🔒" : checked ? "✓" : ""}</div>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: `${model.color}12`,
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0,
      }}>{model.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: checked ? C.text : C.textMuted }}>{model.name}</span>
          {mandatory && (
            <span style={{
              fontFamily: "var(--font-jetbrains)", fontSize: 10, color: C.amber,
              background: C.amberBg, border: `1px solid ${C.amberBorder}`,
              padding: "1px 7px", borderRadius: 20,
            }}>Required</span>
          )}
        </div>
        <div style={{ fontSize: 13, color: C.textDim, lineHeight: 1.4 }}>{model.description}</div>
        {model.contextNote && <div style={{ fontSize: 12, color: C.blue, marginTop: 3, fontStyle: "italic" }}>ℹ {model.contextNote}</div>}
      </div>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column" as const, alignItems: "flex-end", gap: 6 }}>
        <ComplexityDots level={model.complexity} />
        <button onClick={e => { e.stopPropagation(); onExplain(); }} style={{
          background: C.surfaceHigh, border: `1px solid ${C.border}`, color: model.color,
          cursor: "pointer", fontSize: 11, fontFamily: "monospace",
          padding: "3px 8px", borderRadius: 6, fontWeight: 500,
        }}>ⓘ info</button>
      </div>
    </div>
  );
}

// ── SCREEN: MODEL ENGINE ──────────────────────────────────────────────────────
function ModelEngine({ category, intakeAns, selectedModels, onComplete }: {
  category: Category; intakeAns: IntakeAnswers; selectedModels: Model[];
  onComplete: (d: AuditSession) => void;
}) {
  const [idx, setIdx]         = useState(0);
  const [mAns, setMAns]       = useState<Record<string, Record<string, string>>>({});
  const [explainer, setExp]   = useState<Model | null>(null);
  const [insights, setIns]    = useState<Record<string, string>>({});
  const [verdict, setVerdict] = useState<string | null>(null);
  const [generating, setGen]  = useState(false);
  const [dismissed, setDis]   = useState<Set<string>>(new Set());

  const model        = selectedModels[idx];
  const cur          = mAns[model?.id] || {};
  const upd          = (fid: string, v: string) => setMAns(p => ({ ...p, [model.id]: { ...(p[model.id] || {}), [fid]: v } }));
  const ok           = model?.questions.every(q => cur[q.id]?.trim());
  const completedCount = Object.keys(insights).length;
  const isMandatory  = (CATEGORY_MANDATORY[category.id as keyof typeof CATEGORY_MANDATORY] || []).includes(model?.id);

  const genInsight = async (m: Model, answers: Record<string, string>, curIns: Record<string, string>) => {
    const sys = `Decision auditor flash insight. ${m.flashPrompt} Be specific — reference actual user answers. No filler.`;
    const text = await callClaude([{ role: "user", content: `Model: ${m.name}\nAnswers: ${JSON.stringify(answers)}\nDecision: ${intakeAns.decision}` }], sys, 100);
    const next = { ...curIns, [m.id]: text.trim() };
    setIns(next);
    if (Object.keys(next).length % 2 === 0 || Object.keys(next).length === selectedModels.length) {
      const v = await callClaude(
        [{ role: "user", content: `Decision: ${intakeAns.decision}\nInsights: ${JSON.stringify(next)}` }],
        `Give a one-phrase preliminary verdict: Proceed / Avoid / Delay / Run experiment first / Partial commit / Exit. Return ONLY the phrase.`, 30
      );
      setVerdict(v.trim());
    }
    return next;
  };

  const next = async () => {
    const answers = mAns[model.id] || {};
    if (idx < selectedModels.length - 1) {
      genInsight(model, answers, insights);
      setIdx(i => i + 1);
    } else {
      setGen(true);
      const finalIns = await genInsight(model, answers, insights);
      setGen(false);
      onComplete({ category, intakeAns, selectedModels, modelAns: mAns, insights: finalIns });
    }
  };

  const skip = () => {
    if (idx < selectedModels.length - 1) setIdx(i => i + 1);
    else onComplete({ category, intakeAns, selectedModels, modelAns: mAns, insights });
  };

  const visible = Object.entries(insights).filter(([mid]) => !dismissed.has(mid)).slice(-3);
  if (!model) return null;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: 24 }}>
      {explainer && <ExplainerModal model={explainer} onClose={() => setExp(null)} />}

      {/* Progress bar */}
      <div style={{
        background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
        padding: "14px 20px", marginBottom: 28,
        display: "flex", alignItems: "center", gap: 16,
        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
      }}>
        <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 13, color: C.textMuted, fontWeight: 500, flexShrink: 0 }}>
          {idx + 1} / {selectedModels.length}
        </span>
        <div style={{ flex: 1, height: 6, background: C.surfaceHigh, borderRadius: 10 }}>
          <div style={{
            height: "100%", borderRadius: 10, background: C.amber,
            width: `${((idx + 1) / selectedModels.length) * 100}%`, transition: "width .4s ease",
          }} />
        </div>
        <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
          {selectedModels.map((m, i) => (
            <div key={m.id} title={m.name} style={{
              width: 24, height: 24, borderRadius: 6,
              background: insights[m.id] ? `${m.color}20` : i === idx ? C.amberBg : C.surfaceHigh,
              border: `1.5px solid ${insights[m.id] ? m.color : i === idx ? C.amberBorder : C.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, transition: "all .3s",
            }}>
              {insights[m.id] ? "✓" : i === idx ? m.icon : ""}
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", gap: 22, alignItems: "flex-start" }}>
        {/* Main panel */}
        <div className="animate-fade-up" key={idx} style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            padding: "18px 20px", background: C.surface,
            border: `1.5px solid ${C.border}`, borderRadius: 14, marginBottom: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,.06)",
            borderTop: `3px solid ${model.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: `${model.color}12`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0,
                }}>{model.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, color: model.color, fontWeight: 500, letterSpacing: "0.08em" }}>
                      MODEL {idx + 1} — {model.shortCode}
                    </span>
                    <ComplexityDots level={model.complexity} />
                    {isMandatory && <Tag color={C.amber} bg={C.amberBg}>Required</Tag>}
                  </div>
                  <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 4, color: C.text }}>{model.name}</div>
                  <p style={{ fontSize: 14, color: C.textMuted, fontStyle: "italic" }}>{model.description}</p>
                  {model.contextNote && <p style={{ fontSize: 13, color: C.blue, marginTop: 4, fontStyle: "italic" }}>ℹ {model.contextNote}</p>}
                </div>
              </div>
              <button onClick={() => setExp(model)} style={{
                flexShrink: 0, marginLeft: 8, padding: "6px 12px",
                background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 8,
                color: C.textMuted, cursor: "pointer", fontSize: 13, fontFamily: "var(--font-dm-sans)",
              }}>What is this?</button>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {model.questions.map(q => (
              <div key={q.id}>
                <label style={{ fontSize: 15, fontWeight: 500, color: C.text, display: "block", marginBottom: 8, lineHeight: 1.5 }}>{q.label}</label>
                {q.type === "textarea"
                  ? <textarea value={cur[q.id] || ""} onChange={e => upd(q.id, e.target.value)} placeholder={q.placeholder} />
                  : <input type="text" value={cur[q.id] || ""} onChange={e => upd(q.id, e.target.value)} placeholder={q.placeholder} />
                }
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 28, alignItems: "center" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {idx > 0 && <Btn variant="ghost" onClick={() => setIdx(i => i - 1)}>← Back</Btn>}
              {!isMandatory && (
                <button onClick={skip} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: C.textDim, fontSize: 13, fontFamily: "var(--font-dm-sans)",
                  textDecoration: "underline",
                }}>Skip this model</button>
              )}
            </div>
            <Btn onClick={next} disabled={!ok || generating}>
              {generating ? "Generating insight..." : idx < selectedModels.length - 1 ? `Next: ${selectedModels[idx + 1].name} →` : "Run Stress-Test →"}
            </Btn>
          </div>
        </div>

        {/* Live sidebar */}
        <div style={{ width: 216, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          {verdict && <VerdictBadge verdict={verdict} done={completedCount} total={selectedModels.length} />}
          {visible.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>Live Insights</div>
              {visible.map(([mid, text]) => {
                const m = MODELS.find(m => m.id === mid);
                return m ? <FlashInsight key={mid} model={m} text={text} onDismiss={() => setDis(s => new Set([...s, mid]))} /> : null;
              })}
            </div>
          )}
          {generating && (
            <div className="animate-blink" style={{
              padding: "10px 14px", background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 10, fontSize: 12, color: C.textMuted, fontStyle: "italic",
            }}>Generating insight...</div>
          )}
          <div style={{
            padding: "13px 14px", background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 12, boxShadow: "0 1px 3px rgba(0,0,0,.04)",
          }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Auditing</div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>
              {(intakeAns.decision || "").substring(0, 80)}{(intakeAns.decision || "").length > 80 ? "..." : ""}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SCREEN: STRESS TEST ───────────────────────────────────────────────────────
function StressTest({ session, onComplete }: { session: AuditSession; onComplete: (s: AuditSession) => void }) {
  const [msgs, setMsgs]     = useState<Array<{ role: string; content: string }>>([]);
  const [inp, setInp]       = useState("");
  const [loading, setLoading] = useState(false);
  const [count, setCount]   = useState(0);
  const [done, setDone]     = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const MAX = 4;

  const sys = `Munger-style decision auditor. Stress-test this decision. Direct. Never reassure.
Decision: ${session.intakeAns?.decision}
Category: ${session.category?.label}
Gut: ${session.intakeAns?.gut_choice}
Models run: ${session.selectedModels?.map(m => m.name).join(", ")}
Insights: ${JSON.stringify(session.insights || {})}
Rules: ONE question per message. Target biggest contradiction. Under 100 words. After ${MAX} exchanges output AUDIT_COMPLETE then one sentence.`;

  useEffect(() => { runFirst(); }, []);
  useEffect(() => { ref.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const runFirst = async () => {
    setLoading(true);
    const r = await callClaude([{ role: "user", content: `I completed ${session.selectedModels?.length} models for: "${session.intakeAns?.decision}". Begin. Challenge my biggest inconsistency.` }], sys);
    setMsgs([{ role: "assistant", content: r }]);
    setLoading(false);
  };

  const send = async () => {
    if (!inp.trim() || loading || done) return;
    const m = { role: "user", content: inp };
    const nm = [...msgs, m];
    setMsgs(nm); setInp(""); setLoading(true);
    const nc = count + 1; setCount(nc);
    const r = await callClaude(nm, sys);
    setMsgs(p => [...p, { role: "assistant", content: r }]);
    setLoading(false);
    if (nc >= MAX || r.includes("AUDIT_COMPLETE")) { setDone(true); setTimeout(() => onComplete(session), 1500); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: C.bg }}>
      {/* Header */}
      <div style={{
        padding: "16px 24px", background: C.surface, borderBottom: `1px solid ${C.border}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        boxShadow: "0 1px 4px rgba(0,0,0,.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 12 }}>BLS</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="animate-blink" style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: C.red }}>Stress-Test</span>
          <span style={{ fontSize: 13, color: C.textMuted }}>— {MAX - count} challenges left</span>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: MAX }).map((_, i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < count ? C.amber : C.border, transition: "background .3s" }} />
          ))}
        </div>
      </div>

      {/* Decision context strip */}
      <div style={{ padding: "10px 24px", background: C.amberBg, borderBottom: `1px solid ${C.amberBorder}` }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.amber, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 2 }}>Auditing</div>
        <div style={{ fontSize: 14, color: C.text }}>{session.intakeAns?.decision}</div>
      </div>

      {/* Chat */}
      <div style={{ flex: 1, overflow: "auto", padding: 22 }}>
        <div style={{ maxWidth: 580, margin: "0 auto" }}>
          {msgs.map((m, i) => (
            <div key={i} className="animate-fade-up" style={{
              marginBottom: 18, display: "flex",
              flexDirection: m.role === "user" ? "row-reverse" : "row",
              gap: 10, alignItems: "flex-start",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                background: m.role === "assistant" ? C.redBg : C.amberBg,
                border: `1.5px solid ${m.role === "assistant" ? C.redBorder : C.amberBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600, color: m.role === "assistant" ? C.red : C.amber,
              }}>{m.role === "assistant" ? "AU" : "ME"}</div>
              <div className={m.role === "assistant" ? "chat-bubble-ai" : "chat-bubble-user"}
                style={{ maxWidth: "87%" }}>
                {m.content.replace("AUDIT_COMPLETE", "").trim()}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: C.redBg, border: `1.5px solid ${C.redBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: C.red }}>AU</div>
              <div className="chat-bubble-ai animate-blink" style={{ fontSize: 14, color: C.textMuted, fontStyle: "italic" }}>Auditing...</div>
            </div>
          )}
          {done && (
            <div className="animate-fade-up" style={{ textAlign: "center", padding: 20, color: C.amber, fontSize: 15, fontWeight: 500 }}>
              Audit complete — generating your Decision Memo...
            </div>
          )}
          <div ref={ref} />
        </div>
      </div>

      {/* Input */}
      {!done && (
        <div style={{ padding: "14px 24px", background: C.surface, borderTop: `1px solid ${C.border}`, boxShadow: "0 -2px 8px rgba(0,0,0,.06)" }}>
          <div style={{ maxWidth: 580, margin: "0 auto", display: "flex", gap: 10 }}>
            <input type="text" value={inp} onChange={e => setInp(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Respond honestly. Don't defend — think."
              disabled={loading || done} style={{ flex: 1 }} />
            <Btn onClick={send} disabled={loading || !inp.trim() || done}>Send</Btn>
          </div>
        </div>
      )}
    </div>
  );
}

// ── SCREEN: DECISION MEMO ─────────────────────────────────────────────────────
function Memo({ session, onReset }: { session: AuditSession; onReset: () => void }) {
  const [memo, setMemo]     = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { generate(); }, []);

  const generate = async () => {
    const ctx = JSON.stringify({
      category: session.category?.label, decision: session.intakeAns?.decision,
      options: session.intakeAns?.all_options, gut: session.intakeAns?.gut_choice,
      models_run: session.selectedModels?.map(m => m.name), insights: session.insights,
    });
    const sys = `Munger-style decision auditor. Return ONLY valid JSON:
{"recommendation":"Proceed|Avoid|Delay|Run experiment first|Partial commit|Exit","confidence":"Low|Medium|High","bet_size":"None|Small|Medium|Large|Staged","headline":"One crisp verdict sentence","why":"2-3 sentence reasoning","key_assumptions":["a1","a2","a3"],"disconfirming":["d1","d2","d3"],"biggest_risk":"Single most dangerous blind spot","next_action":"One concrete action in 7 days","model_flags":{"expected-value":{"status":"pass|warn|fail|skipped","note":"max 8 words"},"base-rates":{"status":"pass|warn|fail|skipped","note":"..."},"sunk-cost":{"status":"pass|warn|fail|skipped","note":"..."},"bayesian":{"status":"pass|warn|fail|skipped","note":"..."},"survivorship":{"status":"pass|warn|fail|skipped","note":"..."},"kelly":{"status":"pass|warn|fail|skipped","note":"..."},"inversion":{"status":"pass|warn|fail|skipped","note":"..."},"opp-cost":{"status":"pass|warn|fail|skipped","note":"..."}}}`;
    const r = await callClaude([{ role: "user", content: `Context: ${ctx}\nGenerate memo.` }], sys);
    try { setMemo(JSON.parse(r.replace(/```json|```/g, "").trim())); }
    catch { setMemo({ recommendation: "Partial commit", confidence: "Medium", bet_size: "Staged", headline: "A staged approach is most defensible.", why: r, key_assumptions: ["Verify market", "Confirm runway", "Test assumptions"], disconfirming: ["Traction fails", "Economics break", "Better option emerges"], biggest_risk: "Confidence gap vs base rate.", next_action: "Run a 30-day test with clear criteria.", model_flags: {} }); }
    setLoading(false);
    saveDecision({ ...session, memo }).catch(console.error);
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
      <div className="animate-blink" style={{ fontSize: 40 }}>⚖</div>
      <div style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 700, color: C.text }}>Synthesising the Lattice</div>
      <div style={{ fontSize: 16, color: C.textMuted }}>Combining {session.selectedModels?.length} model analyses into your Decision Memo...</div>
      <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
        {(session.selectedModels || MODELS).map((m, i) => (
          <div key={m.id} className="animate-blink" style={{ width: 9, height: 9, borderRadius: "50%", background: m.color, animationDelay: `${i * 0.12}s` }} />
        ))}
      </div>
    </div>
  );

  const RS: Record<string, { c: string; bg: string; border: string; i: string }> = {
    "Proceed":              { c: C.green,  bg: C.greenBg,  border: C.greenBorder,  i: "✓" },
    "Avoid":                { c: C.red,    bg: C.redBg,    border: C.redBorder,    i: "✕" },
    "Delay":                { c: C.blue,   bg: C.blueBg,   border: C.blueBorder,   i: "⏸" },
    "Run experiment first": { c: C.amber,  bg: C.amberBg,  border: C.amberBorder,  i: "⚗" },
    "Partial commit":       { c: C.amber,  bg: C.amberBg,  border: C.amberBorder,  i: "◑" },
    "Exit":                 { c: C.red,    bg: C.redBg,    border: C.redBorder,    i: "↩" },
  };
  const SC: Record<string, string> = { pass: C.green, warn: C.amber, fail: C.red, skipped: C.textDim };
  const SI: Record<string, string> = { pass: "✓", warn: "⚠", fail: "✕", skipped: "—" };
  const rec = RS[memo?.recommendation as string] || { c: C.amber, bg: C.amberBg, border: C.amberBorder, i: "◈" };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, padding: "24px 24px 80px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <Header right={
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>{session.category?.icon}</span>
            <Tag color={session.category?.color} bg={session.category?.bg || C.surfaceHigh}>{session.category?.label}</Tag>
          </div>
        } />

        <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 6 }}>Decision Audit Subject</div>
        <div style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(17px,2.5vw,24px)", fontWeight: 700, lineHeight: 1.3, marginBottom: 10, color: C.text }}>
          &ldquo;{session.intakeAns?.decision}&rdquo;
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 28, flexWrap: "wrap" as const }}>
          {session.selectedModels?.map(m => (
            <span key={m.id} style={{ fontSize: 12, color: m.color, background: `${m.color}10`, border: `1px solid ${m.color}33`, padding: "3px 10px", borderRadius: 20 }}>{m.icon} {m.shortCode}</span>
          ))}
        </div>

        {/* Recommendation */}
        <div className="animate-fade-up" style={{ padding: "24px 26px", background: rec.bg, border: `1.5px solid ${rec.border}`, borderRadius: 16, marginBottom: 16, boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: rec.c, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12 }}>Recommendation</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: rec.c, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{rec.i}</div>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(24px,4vw,38px)", fontWeight: 900, color: rec.c, lineHeight: 1 }}>{memo?.recommendation as string}</div>
          </div>
          <p style={{ fontSize: 16, lineHeight: 1.75, color: C.text, fontStyle: "italic", marginBottom: 18 }}>{memo?.headline as string}</p>
          <div style={{ display: "flex", gap: 10 }}>
            {[{ l: "Confidence", v: memo?.confidence }, { l: "Bet Size", v: memo?.bet_size }].map(s => (
              <div key={s.l} style={{ padding: "10px 18px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 3 }}>{s.l}</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{s.v as string}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Why */}
        <div style={{ padding: "20px 22px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 12, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 10 }}>Why this recommendation</div>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: C.text }}>{memo?.why as string}</p>
        </div>

        {/* Risk */}
        <div style={{ padding: "18px 22px", background: C.redBg, border: `1px solid ${C.redBorder}`, borderRadius: 14, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.red, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>⚠ Biggest Risk</div>
          <p style={{ fontSize: 15, color: C.text, lineHeight: 1.75 }}>{memo?.biggest_risk as string}</p>
        </div>

        {/* Assumptions & disconfirming */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          {[
            { title: "Key Assumptions",  c: C.amber, bg: C.amberBg, items: memo?.key_assumptions as string[], b: "·" },
            { title: "What Changes This", c: C.blue,  bg: C.blueBg,  items: memo?.disconfirming as string[],   b: "→" },
          ].map(s => (
            <div key={s.title} style={{ padding: "18px", background: s.bg, border: `1px solid ${C.border}`, borderRadius: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.textMuted, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>{s.title}</div>
              {s.items?.map((it, i) => (
                <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ color: s.c, fontSize: 14, flexShrink: 0, paddingTop: 2, fontWeight: 700 }}>{s.b}</div>
                  <div style={{ fontSize: 14, color: C.text, lineHeight: 1.6 }}>{it}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Next action */}
        <div style={{ padding: "18px 22px", background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 14, marginBottom: 22 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.green, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 8 }}>Next Action — Do This in 7 Days</div>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.text, lineHeight: 1.7 }}>{memo?.next_action as string}</p>
        </div>

        {/* Lattice results */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: 12 }}>The Lattice — Model Results</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
            {MODELS.map(m => {
              const flags = memo?.model_flags as Record<string, { status: string; note: string }> | undefined;
              const f     = flags?.[m.id];
              const st    = f?.status || "skipped";
              const wasRun = session.selectedModels?.some(sm => sm.id === m.id);
              return (
                <div key={m.id} style={{
                  padding: "14px 12px", background: C.surface,
                  border: `1px solid ${wasRun ? (SC[st] ? SC[st] + "33" : C.border) : C.border}`,
                  borderTop: `3px solid ${wasRun ? (SC[st] || C.border) : C.border}`,
                  borderRadius: "0 0 12px 12px", opacity: wasRun ? 1 : 0.4,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${m.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{m.icon}</div>
                    {wasRun && (
                      <div style={{ width: 22, height: 22, borderRadius: 6, background: SC[st] ? `${SC[st]}15` : C.surfaceHigh, border: `1px solid ${SC[st] ? SC[st] + "33" : C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: SC[st] || C.textDim }}>{SI[st] || "?"}</div>
                    )}
                  </div>
                  <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 500, color: wasRun ? m.color : C.textDim, letterSpacing: "0.08em", marginBottom: 2 }}>{m.shortCode}</div>
                  <div style={{ fontSize: 12, color: C.textMuted, lineHeight: 1.4 }}>{wasRun ? (f?.note || m.name) : "not run"}</div>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: C.textDim, marginTop: 8, fontStyle: "italic" }}>Greyed models were not included. Run them anytime for deeper analysis.</p>
        </div>

        {/* GrowthAspire CTA */}
        <div style={{ padding: "24px 26px", background: C.amberBg, border: `1px solid ${C.amberBorder}`, borderRadius: 16, textAlign: "center", marginBottom: 22 }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 700, marginBottom: 8, color: C.text }}>
            Want a human expert to pressure-test this further?
          </div>
          <p style={{ fontSize: 14, color: C.textMuted, marginBottom: 18, lineHeight: 1.7 }}>
            Book a Decision Strategy Session with Prashanth — Decision Science Coach &amp; AI Strategist at GrowthAspire
          </p>
          <Btn onClick={() => window.open("https://growthaspire.com", "_blank")} style={{ padding: "13px 28px", fontSize: 15 }}>
            Book a Strategy Session →
          </Btn>
        </div>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <Btn variant="ghost" onClick={() => {
            if (!memo) return;
            navigator.clipboard.writeText(
              `BELESSSTUPID — DECISION MEMO\n${"=".repeat(30)}\n` +
              `Decision: ${session.intakeAns?.decision}\nCategory: ${session.category?.label}\n\n` +
              `RECOMMENDATION: ${memo.recommendation}\nCONFIDENCE: ${memo.confidence} | BET SIZE: ${memo.bet_size}\n\n` +
              `${memo.headline}\n\nWHY:\n${memo.why}\n\nBIGGEST RISK: ${memo.biggest_risk}\n\nNEXT ACTION (7 DAYS): ${memo.next_action}`
            );
          }}>Copy Memo</Btn>
          <Btn variant="ghost" onClick={() => window.location.href = "/dashboard"}>My Decisions</Btn>
          <Btn variant="ghost" onClick={onReset}>New Decision →</Btn>
        </div>
      </div>
    </div>
  );
}

// ── ROOT ORCHESTRATOR ─────────────────────────────────────────────────────────
export default function AuditApp({ user }: { user: User | null }) {
  type Screen = "category" | "mode" | "quick-intake" | "guided-intake" | "model-select" | "models" | "stress" | "memo";
  const [screen, setScreen]       = useState<Screen>("category");
  const [session, setSession]     = useState<AuditSession>({});
  const [showPricing, setShowPricing] = useState(false);
  const { credits, loading: creditsLoading, deductCredit, addCredits } = useCredits();

  const upd   = (patch: Partial<AuditSession>) => setSession(s => ({ ...s, ...patch }));
  const reset = () => { setSession({}); setScreen("category"); };

  // Called when user clicks "Run X Models →" — gate on credits
  const handleModelsStart = async (models: Model[]) => {
    upd({ selectedModels: models });
    if (credits !== null && credits < 1) {
      setShowPricing(true);
      return;
    }
    const ok = await deductCredit();
    if (!ok) { setShowPricing(true); return; }
    setScreen("models");
  };

  const CreditBadge = () => {
    if (!user || creditsLoading || credits === null) return null;
    const low = credits <= 1;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          onClick={() => setShowPricing(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            padding: "5px 12px", borderRadius: 20, cursor: "pointer",
            background: low ? "#FEF3E2" : C.surfaceHigh,
            border: `1px solid ${low ? C.amberBorder : C.border}`,
            transition: "all .15s",
          }}
        >
          <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, fontWeight: 700,
            color: low ? C.amber : C.textMuted }}>
            {credits} credit{credits !== 1 ? "s" : ""}
          </span>
          {low && <span style={{ fontSize: 10, color: C.amber }}>+ Buy</span>}
        </div>
        <a href="/dashboard" style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10,
          letterSpacing: "0.1em", color: C.textDim, textDecoration: "none",
          textTransform: "uppercase" as const, borderBottom: `1px solid ${C.border}`, paddingBottom: 1 }}>
          My Decisions
        </a>
      </div>
    );
  };

  return (
    <div style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      {/* Fixed top-right credit badge */}
      {user && (
        <div style={{ position: "fixed", top: 0, right: 16, zIndex: 100,
          display: "flex", gap: 12, alignItems: "center", padding: "12px 0" }}>
          <CreditBadge />
        </div>
      )}

      {/* Pricing modal */}
      {showPricing && (
        <PricingModal
          onClose={() => setShowPricing(false)}
          onSuccess={n => { addCredits(n); setShowPricing(false); }}
        />
      )}

      {screen === "category"      && <CategoryPicker onSelect={c => { upd({ category: c }); setScreen("mode"); }} />}
      {screen === "mode"          && <ModeSelector category={session.category!} onSelect={m => setScreen(m === "quick" ? "quick-intake" : "guided-intake")} />}
      {screen === "quick-intake"  && <QuickIntake category={session.category!} onComplete={a => { upd({ intakeAns: a }); setScreen("model-select"); }} />}
      {screen === "guided-intake" && <GuidedIntake category={session.category!} onComplete={a => { upd({ intakeAns: a }); setScreen("model-select"); }} />}
      {screen === "model-select"  && <ModelSelector category={session.category!} intakeAns={session.intakeAns!} onComplete={handleModelsStart} />}
      {screen === "models"        && <ModelEngine category={session.category!} intakeAns={session.intakeAns!} selectedModels={session.selectedModels!} onComplete={d => { upd(d); setScreen("stress"); }} />}
      {screen === "stress"        && <StressTest session={session} onComplete={s => { upd(s); setScreen("memo"); }} />}
      {screen === "memo"          && <Memo session={session} onReset={reset} />}
    </div>
  );
}
