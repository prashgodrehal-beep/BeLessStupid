"use client";
// components/LearnPage.tsx

import { useState } from "react";
import { useRouter } from "next/navigation";

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceHigh: "#F1F0EC",
  border: "#E6E4DF", borderHigh: "#D0CEC8",
  text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
  green: "#16783A", greenBg: "#F0FDF4", greenBorder: "#86EFAC",
  red: "#C0392B", redBg: "#FEF2F2", redBorder: "#FECACA",
  blue: "#1D5FAD", blueBg: "#EFF6FF", blueBorder: "#BFDBFE",
};

const MODELS = [
  {
    id: "expected-value",
    icon: "⚖",
    code: "EV",
    name: "Expected Value",
    color: C.amber, bg: C.amberBg, border: C.amberBorder,
    complexity: 2,
    tagline: "What's it worth on average?",
    simple: "Before deciding, list every realistic outcome. Estimate how likely each one is. Multiply probability × payoff. Add them up. That number is your expected value — and it's almost always different from the story you've been telling yourself.",
    mistake: "Most people decide based on the best-case scenario. They imagine the startup succeeding, the investment doubling, the move working out perfectly. Expected value forces you to include all outcomes — including the ones you'd rather not think about.",
    example: {
      situation: "You're considering investing ₹10L in a friend's business.",
      breakdown: [
        { outcome: "Best case — business succeeds", prob: "25%", value: "+₹30L" },
        { outcome: "Base case — break even", prob: "35%", value: "₹0" },
        { outcome: "Worst case — lose everything", prob: "40%", value: "−₹10L" },
      ],
      calc: "EV = (0.25 × 30L) + (0.35 × 0) + (0.40 × −10L) = ₹7.5L − ₹4L = +₹3.5L",
      verdict: "Positive EV — but notice the 40% chance of total loss. Size this bet accordingly.",
    },
    question: "What are ALL the realistic outcomes — including the ugly ones?",
  },
  {
    id: "base-rates",
    icon: "📊",
    code: "BR",
    name: "Base Rates",
    color: C.blue, bg: C.blueBg, border: C.blueBorder,
    complexity: 2,
    tagline: "What usually happens to people like you?",
    simple: "Forget your specific situation for a moment. Ask: what percentage of people who've made this exact type of decision actually got what they were hoping for? That historical rate is your base rate — and your gut feeling needs to beat it by a lot to be trusted.",
    mistake: "We all believe our situation is special. \"Yes, most startups fail — but mine is different.\" Maybe. But your 'edge' needs to be large enough to explain why you'll succeed when most don't. If you can't name the edge clearly, you don't have one.",
    example: {
      situation: "You're confident your startup will succeed. You feel 75% sure.",
      breakdown: [
        { outcome: "Startups that survive past 5 years", prob: "~10%", value: "Base rate" },
        { outcome: "Your confidence level", prob: "75%", value: "Your gut" },
        { outcome: "The gap you need to explain", prob: "65%", value: "⚠ Large gap" },
      ],
      calc: "You need to explain why you're 7.5× more likely to succeed than the average founder. What specifically makes your case different?",
      verdict: "Either you have a real edge (prior exits, deep domain expertise, unfair advantage) — or you're overconfident.",
    },
    question: "What percentage of people in your exact situation actually succeed — and why are you different?",
  },
  {
    id: "sunk-cost",
    icon: "🕳",
    code: "SC",
    name: "Sunk Cost",
    color: "#6D28D9", bg: "#F5F3FF", border: "#C4B5FD",
    complexity: 1,
    tagline: "Are you staying because it's good — or because you've already paid?",
    simple: "Mentally erase everything you've already invested — the time, money, and effort. Now ask: if you were starting completely fresh today with no history, would you still choose this path? If the honest answer is no, you're being held hostage by the past.",
    mistake: "\"I've put 3 years into this — I can't stop now.\" Those 3 years are gone regardless of what you decide next. The only thing that matters is the best use of your next 3 years. The past is not a reason to continue. It's just history.",
    example: {
      situation: "You've been building a startup for 2 years and spent ₹25L. Growth has stalled.",
      breakdown: [
        { outcome: "Amount already spent", prob: "₹25L", value: "Gone — sunk" },
        { outcome: "Months of your life invested", prob: "24 months", value: "Gone — sunk" },
        { outcome: "If starting fresh today", prob: "Would you start this?", value: "Be honest" },
      ],
      calc: "The ₹25L is irrelevant to your decision. It's gone whether you continue or pivot. Decide based on what the next 12 months look like — not the last 24.",
      verdict: "Continuing a failing venture to 'recover' sunk costs is one of the most common and costly decision errors.",
    },
    question: "Starting completely fresh today — would you still choose this path?",
  },
  {
    id: "bayesian",
    icon: "🔄",
    code: "BU",
    name: "Bayesian Update",
    color: C.green, bg: C.greenBg, border: C.greenBorder,
    complexity: 3,
    tagline: "How much should new information actually change your mind?",
    simple: "When new evidence arrives, your beliefs should update — but by how much? Too little change means you're stubborn. Too much change means you're reactive. Bayesian thinking gives you a principled way to calibrate: start with your prior belief, weigh the strength of the new evidence, and arrive at a new confidence level.",
    mistake: "Most people do one of two things with new information: ignore it completely (\"I still think this will work\") or completely reverse course (\"One bad result means everything is wrong\"). Neither is right. The truth is usually somewhere in the middle — and the right answer depends on how strong the new evidence actually is.",
    example: {
      situation: "You believed 80% that your product would sell well. A pilot with 20 users showed weak interest.",
      breakdown: [
        { outcome: "Prior belief", prob: "80%", value: "Before pilot" },
        { outcome: "Pilot result", prob: "Weak signal", value: "New evidence" },
        { outcome: "Strength of evidence", prob: "20 users — small sample", value: "Moderate" },
      ],
      calc: "A small pilot with mixed results shouldn't drop you from 80% to 5%. It should move you to maybe 45–55%. Strong evidence moves you far. Weak evidence moves you a little.",
      verdict: "Don't overcorrect on thin data. Don't ignore strong data. Calibrate the update to the quality of the evidence.",
    },
    question: "How strong is the new evidence — and how much should it actually move you?",
  },
  {
    id: "survivorship",
    icon: "👻",
    code: "SB",
    name: "Survivorship Bias",
    color: "#C05020", bg: "#FFF7ED", border: "#FED7AA",
    complexity: 2,
    tagline: "Who's missing from the stories you're hearing?",
    simple: "The examples inspiring your decision are almost certainly made up entirely of winners. The failures — and there are far more of them — are invisible. They didn't write the book. They don't give the TED talk. They're not on your LinkedIn feed. You're making a decision based on a deeply filtered sample.",
    mistake: "\"My friend built a successful D2C brand, so I can too.\" Maybe. But for every friend who succeeded, 50 others tried and quietly shut down. You never heard about them because failure is private. Success is loud. Decide based on the full population — not just the visible survivors.",
    example: {
      situation: "You're inspired by 3 founders who dropped out of college and built unicorns.",
      breakdown: [
        { outcome: "Famous college-dropout founders", prob: "~dozens", value: "Visible — loud" },
        { outcome: "College dropouts who struggled", prob: "~tens of thousands", value: "Invisible — silent" },
        { outcome: "Sample you're deciding on", prob: "The famous ones only", value: "⚠ Severely filtered" },
      ],
      calc: "The dropout-to-unicorn path has maybe a 0.01% success rate. The survivors are real — but they're not representative. What's the full base rate for this path?",
      verdict: "Always ask: where are the failures in this story? If you can't see them, that's the bias at work.",
    },
    question: "Who tried this and failed — and why aren't you hearing their stories?",
  },
  {
    id: "kelly",
    icon: "🎯",
    code: "KS",
    name: "Kelly Criterion",
    color: C.green, bg: C.greenBg, border: C.greenBorder,
    complexity: 3,
    tagline: "Even a great bet can ruin you if you oversize it.",
    simple: "Once you've decided a bet is worth making, you still need to decide how much to commit. The Kelly Criterion says: the fraction of your resources you commit should be proportional to your edge. Bet too little and you grow slowly. Bet too much and one loss can end you permanently. Ruin is irreversible.",
    mistake: "\"This is a great opportunity — I'm going all in.\" Even if it's genuinely a great opportunity, committing 100% of your savings, time, and career capital to a single bet is almost never the right answer. A 90% loss requires a 900% gain just to break even. Preserve the ability to play again.",
    example: {
      situation: "You're 70% confident a business investment will return 2x. You have ₹50L.",
      breakdown: [
        { outcome: "Probability of winning", prob: "70%", value: "p" },
        { outcome: "Odds (2x = win 1, lose 1)", prob: "1:1", value: "b" },
        { outcome: "Kelly fraction", prob: "f = p − (1−p)/b", value: "= 0.70 − 0.30 = 0.40" },
      ],
      calc: "Kelly says commit 40% = ₹20L. Not ₹50L. The remaining ₹30L stays available for future opportunities and recovery if this one goes wrong.",
      verdict: "Size the bet to survive being wrong. You can always increase a bet later. You can't recover from ruin.",
    },
    question: "If this goes completely wrong — what exactly is your recovery path?",
  },
  {
    id: "inversion",
    icon: "🔃",
    code: "IN",
    name: "Inversion",
    color: C.red, bg: C.redBg, border: C.redBorder,
    complexity: 1,
    tagline: "How do you guarantee this fails?",
    simple: "Instead of asking \"how do I make this succeed?\", ask \"what would guarantee this fails catastrophically?\" List every path to disaster. Then build a plan to avoid them. Munger called this the most underused thinking tool. It's simple, takes 5 minutes, and surfaces risks that forward planning almost always misses.",
    mistake: "Most planning is optimism in disguise. You build the best-case roadmap, add some buffer, and call it a plan. Inversion forces you to take failure seriously before you've committed time and money. The avoidance list you get is often more valuable than the entire forward plan.",
    example: {
      situation: "You're planning to quit your job and launch a consulting practice.",
      breakdown: [
        { outcome: "No clients in month 1–3", prob: "High risk", value: "→ Build 3 clients before quitting" },
        { outcome: "Underpricing your services", prob: "Medium risk", value: "→ Set rate before launch, not after" },
        { outcome: "No referral engine", prob: "Medium risk", value: "→ Map referral sources now" },
      ],
      calc: "Each 'guaranteed failure' path becomes an action item to neutralise before you start. You've just built a pre-mortem checklist.",
      verdict: "Avoidance of clear mistakes is often more valuable than execution of a perfect strategy.",
    },
    question: "List every way this could go catastrophically wrong — then work backwards.",
  },
  {
    id: "opp-cost",
    icon: "↔",
    code: "OC",
    name: "Opportunity Cost",
    color: C.textMuted, bg: C.surfaceHigh, border: C.borderHigh,
    complexity: 1,
    tagline: "What's the best thing you're giving up?",
    simple: "Every yes is a hundred invisible nos. When you commit time, money, or energy to one thing, you're simultaneously choosing not to use it for everything else. The real question isn't \"is this a good opportunity?\" — it's \"is this better than the single best alternative available to me right now?\"",
    mistake: "People evaluate decisions in isolation. \"Is this a good investment?\" Yes — but is it better than your next-best use of that capital? A 7% return on a rental property might look good until you realise index funds have returned 12% with zero management time. The comparison is what matters.",
    example: {
      situation: "You're considering buying a rental property that yields 5% annually.",
      breakdown: [
        { outcome: "Rental property return", prob: "5% annual yield", value: "Your choice" },
        { outcome: "Index fund return (historical)", prob: "~12% CAGR", value: "Best alternative" },
        { outcome: "Management time cost", prob: "10–15 hrs/month", value: "Hidden cost" },
      ],
      calc: "On ₹50L over 10 years: rental = ~₹81L. Index fund = ~₹1.55Cr. The gap is ₹74L plus 1,500+ hours of your time.",
      verdict: "Not saying property is wrong — just that the comparison needs to be explicit, not assumed.",
    },
    question: "What is the single best alternative use of this time, money, and energy?",
  },
];

const COMPLEXITY_LABELS = ["", "Simple", "Medium", "Advanced"];
const COMPLEXITY_COLORS = ["", C.green, C.amber, C.red];

function ModelCard({ model, isOpen, onToggle }: {
  model: typeof MODELS[0]; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${isOpen ? model.color + "55" : C.border}`,
      borderRadius: 14, overflow: "hidden", transition: "all .2s",
      boxShadow: isOpen ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.04)",
    }}>
      {/* Header */}
      <div onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "18px 20px", cursor: "pointer",
        background: isOpen ? model.bg : C.surface,
        transition: "background .2s",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${model.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>{model.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{
              fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 500,
              color: model.color, letterSpacing: "0.1em",
            }}>{model.code}</span>
            <span style={{
              fontFamily: "var(--font-jetbrains)", fontSize: 9, fontWeight: 500,
              color: COMPLEXITY_COLORS[model.complexity],
              background: `${COMPLEXITY_COLORS[model.complexity]}15`,
              border: `1px solid ${COMPLEXITY_COLORS[model.complexity]}33`,
              padding: "1px 7px", borderRadius: 20,
            }}>{COMPLEXITY_LABELS[model.complexity]}</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{model.name}</div>
          <div style={{ fontSize: 13, color: C.textMuted, marginTop: 2 }}>{model.tagline}</div>
        </div>
        <div style={{
          width: 28, height: 28, borderRadius: 8, flexShrink: 0,
          background: isOpen ? model.color : C.surfaceHigh,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isOpen ? "#fff" : C.textMuted, fontSize: 14, transition: "all .2s",
        }}>{isOpen ? "−" : "+"}</div>
      </div>

      {/* Body */}
      {isOpen && (
        <div className="animate-fade-up" style={{ padding: "0 20px 24px" }}>
          <div style={{ height: 1, background: C.border, marginBottom: 20 }} />

          {/* Plain explanation */}
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: C.textDim,
              textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8,
            }}>What it does</div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.text }}>{model.simple}</p>
          </div>

          {/* Common mistake */}
          <div style={{
            padding: "14px 16px", background: C.redBg,
            border: `1px solid ${C.redBorder}`, borderRadius: 10, marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: C.red,
              textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6,
            }}>⚠ The mistake people make without this</div>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: 0 }}>{model.mistake}</p>
          </div>

          {/* Example */}
          <div style={{
            background: model.bg, border: `1px solid ${model.border}`,
            borderRadius: 10, padding: "16px 18px", marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 600, color: model.color,
              textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10,
            }}>Real example</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 14, lineHeight: 1.5 }}>
              {model.example.situation}
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, marginBottom: 14 }}>
              {model.example.breakdown.map((row, i) => (
                <div key={i} style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  gap: 12, padding: "8px 12px",
                  background: C.surface, borderRadius: 8,
                  border: `1px solid ${C.border}`,
                }}>
                  <span style={{ fontSize: 13, color: C.textMuted, flex: 1 }}>{row.outcome}</span>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: model.color, flexShrink: 0 }}>{row.prob}</span>
                  <span style={{ fontSize: 12, color: C.textDim, flexShrink: 0, textAlign: "right" as const }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{
              padding: "10px 14px", background: C.surface,
              border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 10,
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>The calculation</div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: C.text, lineHeight: 1.6 }}>{model.example.calc}</div>
            </div>
            <div style={{
              padding: "8px 12px", background: C.greenBg,
              border: `1px solid ${C.greenBorder}`, borderRadius: 8,
            }}>
              <span style={{ fontSize: 13, color: C.green, fontWeight: 500 }}>{model.example.verdict}</span>
            </div>
          </div>

          {/* Key question */}
          <div style={{
            padding: "12px 16px", background: C.surfaceHigh,
            border: `1px solid ${C.border}`, borderRadius: 10,
            display: "flex", gap: 12, alignItems: "flex-start",
          }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>
                The key question this model asks
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: model.color, lineHeight: 1.5 }}>
                &ldquo;{model.question}&rdquo;
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LearnPage() {
  const router = useRouter();
  const [openId, setOpenId] = useState<string | null>("expected-value");
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? MODELS
    : filter === "simple" ? MODELS.filter(m => m.complexity === 1)
    : filter === "medium" ? MODELS.filter(m => m.complexity === 2)
    : MODELS.filter(m => m.complexity === 3);

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
            <button onClick={() => router.push("/sample")} style={{
              padding: "7px 16px", background: C.surface, border: `1.5px solid ${C.border}`,
              color: C.textMuted, cursor: "pointer", borderRadius: 8,
              fontSize: 13, fontFamily: "var(--font-dm-sans)",
            }}>See sample memo</button>
            <button onClick={() => router.push("/audit")} style={{
              padding: "7px 18px", background: C.amber, border: "none",
              color: "#fff", cursor: "pointer", borderRadius: 8,
              fontSize: 13, fontWeight: 500, fontFamily: "var(--font-dm-sans)",
            }}>Start free audit →</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px 80px" }}>
        {/* Header */}
        <div className="animate-fade-up" style={{ marginBottom: 40 }}>
          <div style={{
            fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.12em",
            color: C.amber, textTransform: "uppercase" as const, marginBottom: 12,
          }}>The Decision Science Toolkit</div>
          <h1 style={{
            fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,5vw,44px)",
            fontWeight: 700, lineHeight: 1.15, marginBottom: 14, color: C.text,
          }}>8 Mental Models.<br />Plain English.</h1>
          <p style={{ fontSize: 17, color: C.textMuted, lineHeight: 1.8, maxWidth: 540, marginBottom: 24 }}>
            These are the frameworks behind every Decision Audit. No academic jargon — just what each model does, the mistake it prevents, and a real Indian example.
          </p>
          {/* Stats */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const }}>
            {[
              { n: "3", l: "Simple models — intuitive, 2 min each" },
              { n: "3", l: "Medium models — some estimation, 4 min each" },
              { n: "2", l: "Advanced models — quantitative, 6 min each" },
            ].map(s => (
              <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  fontFamily: "var(--font-jetbrains)", fontSize: 20, fontWeight: 700, color: C.amber,
                }}>{s.n}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
          {[
            { id: "all", label: "All 8 models" },
            { id: "simple", label: "● Simple" },
            { id: "medium", label: "●● Medium" },
            { id: "advanced", label: "●●● Advanced" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "7px 16px",
              background: filter === f.id ? C.amber : C.surface,
              border: `1.5px solid ${filter === f.id ? C.amber : C.border}`,
              color: filter === f.id ? "#fff" : C.textMuted,
              cursor: "pointer", borderRadius: 20,
              fontSize: 13, fontFamily: "var(--font-dm-sans)", fontWeight: 500,
              transition: "all .15s",
            }}>{f.label}</button>
          ))}
        </div>

        {/* Models */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {filtered.map(model => (
            <ModelCard
              key={model.id}
              model={model}
              isOpen={openId === model.id}
              onToggle={() => setOpenId(openId === model.id ? null : model.id)}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 48, padding: "28px 32px",
          background: C.amberBg, border: `1.5px solid ${C.amberBorder}`,
          borderRadius: 16, textAlign: "center" as const,
        }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Ready to run your own audit?
          </div>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 20, lineHeight: 1.7 }}>
            You get 3 free Decision Audits. Pick any major decision you&apos;re sitting on right now.
          </p>
          <button onClick={() => router.push("/audit")} style={{
            padding: "12px 32px", background: C.amber, border: "none",
            color: "#fff", cursor: "pointer", borderRadius: 8,
            fontSize: 15, fontWeight: 500, fontFamily: "var(--font-dm-sans)",
            boxShadow: "0 1px 3px rgba(0,0,0,.12)",
          }}>Start My Free Audit →</button>
        </div>
      </div>
    </div>
  );
}
