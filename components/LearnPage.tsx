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
  textMutedStr: "#6B6762",
};

const MODELS = [
  {
    id: "expected-value", icon: "⚖", code: "EV", name: "Expected Value",
    color: C.amber, bg: C.amberBg, border: C.amberBorder, complexity: 2,
    tagline: "What's it worth on average?",
    simple: "Before deciding, list every realistic outcome. Estimate how likely each one is. Multiply probability × payoff. Add them up. That number is your expected value — and it's almost always different from the story you've been telling yourself.",
    mistake: "Most people decide based on the best-case scenario. They imagine the startup succeeding, the investment doubling, the move working out perfectly. Expected value forces you to include all outcomes — including the ones you'd rather not think about.",
    example: {
      situation: "You're considering investing ₹10L in a friend's business.",
      breakdown: [
        { outcome: "Best case — business succeeds", prob: "25%", value: "+₹30L" },
        { outcome: "Base case — break even",        prob: "35%", value: "₹0" },
        { outcome: "Worst case — lose everything",  prob: "40%", value: "−₹10L" },
      ],
      calc: "EV = (0.25 × 30L) + (0.35 × 0) + (0.40 × −10L) = ₹7.5L − ₹4L = +₹3.5L",
      verdict: "Positive EV — but notice the 40% chance of total loss. Size this bet accordingly.",
    },
    question: "What are ALL the realistic outcomes — including the ugly ones?",
  },
  {
    id: "base-rates", icon: "📊", code: "BR", name: "Base Rates",
    color: C.blue, bg: C.blueBg, border: C.blueBorder, complexity: 2,
    tagline: "What usually happens to people like you?",
    simple: "Forget your specific situation for a moment. Ask: what percentage of people who've made this exact type of decision actually got what they were hoping for? That historical rate is your base rate — and your gut feeling needs to beat it by a lot to be trusted.",
    mistake: "We all believe our situation is special. \"Yes, most startups fail — but mine is different.\" Maybe. But your 'edge' needs to be large enough to explain why you'll succeed when most don't. If you can't name the edge clearly, you don't have one.",
    example: {
      situation: "You're confident your startup will succeed. You feel 75% sure.",
      breakdown: [
        { outcome: "Startups that survive past 5 years", prob: "~10%",  value: "Base rate" },
        { outcome: "Your confidence level",              prob: "75%",   value: "Your gut" },
        { outcome: "The gap you need to explain",        prob: "65%",   value: "⚠ Large gap" },
      ],
      calc: "You need to explain why you're 7.5× more likely to succeed than the average founder. What specifically makes your case different?",
      verdict: "Either you have a real edge (prior exits, deep domain, unfair advantage) — or you're overconfident.",
    },
    question: "What percentage of people in your exact situation actually succeed — and why are you different?",
  },
  {
    id: "sunk-cost", icon: "🕳", code: "SC", name: "Sunk Cost",
    color: "#6D28D9", bg: "#F5F3FF", border: "#C4B5FD", complexity: 1,
    tagline: "Are you staying because it's good — or because you've already paid?",
    simple: "Mentally erase everything you've already invested — the time, money, and effort. Now ask: if you were starting completely fresh today with no history, would you still choose this path? If the honest answer is no, you're being held hostage by the past.",
    mistake: "\"I've put 3 years into this — I can't stop now.\" Those 3 years are gone regardless of what you decide next. The only thing that matters is the best use of your next 3 years. The past is not a reason to continue. It's just history.",
    example: {
      situation: "You've been building a startup for 2 years and spent ₹25L. Growth has stalled.",
      breakdown: [
        { outcome: "Amount already spent",         prob: "₹25L",      value: "Gone — sunk" },
        { outcome: "Months of life invested",      prob: "24 months",  value: "Gone — sunk" },
        { outcome: "If starting fresh today",      prob: "Would you?", value: "Be honest" },
      ],
      calc: "The ₹25L is irrelevant to your decision. It's gone whether you continue or pivot. Decide based on what the next 12 months look like — not the last 24.",
      verdict: "Continuing a failing venture to 'recover' sunk costs is one of the most common and costly decision errors.",
    },
    question: "Starting completely fresh today — would you still choose this path?",
  },
  {
    id: "bayesian", icon: "🔄", code: "BU", name: "Bayesian Update",
    color: C.green, bg: C.greenBg, border: C.greenBorder, complexity: 3,
    tagline: "How much should new information actually change your mind?",
    simple: "When new evidence arrives, your beliefs should update — but by how much? Too little change means you're stubborn. Too much means you're reactive. Bayesian thinking gives you a principled way to calibrate: start with your prior belief, weigh the strength of the new evidence, arrive at a new confidence level.",
    mistake: "Most people do one of two things with new information: ignore it completely or completely reverse course on one bad result. Neither is right. The answer depends on how strong the new evidence actually is.",
    example: {
      situation: "You believed 80% your product would sell. A 20-user pilot showed weak interest.",
      breakdown: [
        { outcome: "Prior belief",         prob: "80%",    value: "Before pilot" },
        { outcome: "Pilot result",         prob: "Weak",   value: "New evidence" },
        { outcome: "Sample strength",      prob: "20 users", value: "Moderate only" },
      ],
      calc: "A small pilot with mixed results shouldn't drop you from 80% to 5%. Move to 45–55%. Strong evidence moves you far. Weak evidence moves you a little.",
      verdict: "Don't overcorrect on thin data. Don't ignore strong data. Calibrate the update to the quality of the evidence.",
    },
    question: "How strong is the new evidence — and how much should it actually move you?",
  },
  {
    id: "survivorship", icon: "👻", code: "SB", name: "Survivorship Bias",
    color: "#C05020", bg: "#FFF7ED", border: "#FED7AA", complexity: 2,
    tagline: "Who's missing from the stories you're hearing?",
    simple: "The examples inspiring your decision are almost certainly made up entirely of winners. The failures — and there are far more of them — are invisible. They didn't write the book. They don't give the TED talk. You're making a decision based on a deeply filtered sample.",
    mistake: "\"My friend built a successful D2C brand, so I can too.\" For every friend who succeeded, 50 others tried and quietly shut down. You never heard about them because failure is private. Success is loud. Decide based on the full population.",
    example: {
      situation: "You're inspired by 3 founders who dropped out of college and built unicorns.",
      breakdown: [
        { outcome: "Famous dropout founders",     prob: "~dozens",      value: "Visible — loud" },
        { outcome: "Dropouts who struggled",      prob: "tens of thousands", value: "Invisible — silent" },
        { outcome: "Sample you're deciding on",   prob: "Famous only",  value: "⚠ Filtered" },
      ],
      calc: "The dropout-to-unicorn path has maybe a 0.01% success rate. The survivors are real — but they're not representative.",
      verdict: "Always ask: where are the failures in this story? If you can't see them, that's the bias at work.",
    },
    question: "Who tried this and failed — and why aren't you hearing their stories?",
  },
  {
    id: "kelly", icon: "🎯", code: "KS", name: "Kelly Criterion",
    color: C.green, bg: C.greenBg, border: C.greenBorder, complexity: 3,
    tagline: "Even a great bet can ruin you if you oversize it.",
    simple: "Once you've decided a bet is worth making, you still need to decide how much to commit. Kelly says: commit proportional to your edge. Bet too little and you grow slowly. Bet too much and one loss can end you permanently. Ruin is irreversible.",
    mistake: "\"This is a great opportunity — I'm going all in.\" Even a genuinely great opportunity rarely justifies 100% commitment. A 90% loss requires a 900% gain just to break even. Preserve the ability to play again.",
    example: {
      situation: "You're 70% confident a business investment will return 2x. You have ₹50L.",
      breakdown: [
        { outcome: "Probability of winning",  prob: "70%",   value: "p" },
        { outcome: "Odds (2x = win 1, lose 1)", prob: "1:1", value: "b" },
        { outcome: "Kelly fraction",          prob: "f = p − (1−p)/b", value: "= 0.40" },
      ],
      calc: "Kelly says commit 40% = ₹20L. Not ₹50L. The remaining ₹30L stays for future opportunities and recovery.",
      verdict: "Size the bet to survive being wrong. You can increase later. You can't recover from ruin.",
    },
    question: "If this goes completely wrong — what exactly is your recovery path?",
  },
  {
    id: "inversion", icon: "🔃", code: "IN", name: "Inversion",
    color: C.red, bg: C.redBg, border: C.redBorder, complexity: 1,
    tagline: "How do you guarantee this fails?",
    simple: "Instead of asking \"how do I make this succeed?\", ask \"what would guarantee this fails catastrophically?\" List every path to disaster. Then build a plan to avoid them. Munger called this the most underused thinking tool.",
    mistake: "Most planning is optimism in disguise. You build the best-case roadmap, add some buffer, and call it a plan. Inversion forces you to take failure seriously before you've committed time and money.",
    example: {
      situation: "You're planning to quit your job and launch a consulting practice.",
      breakdown: [
        { outcome: "No clients in month 1–3",       prob: "High risk",   value: "→ Build 3 clients before quitting" },
        { outcome: "Underpricing your services",    prob: "Medium risk", value: "→ Set rate before launch, not after" },
        { outcome: "No referral engine",            prob: "Medium risk", value: "→ Map referral sources now" },
      ],
      calc: "Each 'guaranteed failure' path becomes an action item to neutralise before you start. You've just built a pre-mortem checklist.",
      verdict: "Avoidance of clear mistakes is often more valuable than execution of a perfect strategy.",
    },
    question: "List every way this could go catastrophically wrong — then work backwards.",
  },
  {
    id: "opp-cost", icon: "↔", code: "OC", name: "Opportunity Cost",
    color: "#6B6762", bg: C.surfaceHigh, border: C.borderHigh, complexity: 1,
    tagline: "What's the best thing you're giving up?",
    simple: "Every yes is a hundred invisible nos. When you commit time, money, or energy to one thing, you're simultaneously choosing not to use it for everything else. The real question isn't \"is this a good opportunity?\" — it's \"is this better than the single best alternative available to me right now?\"",
    mistake: "People evaluate decisions in isolation. \"Is this a good investment?\" Yes — but is it better than your next-best use of that capital? A 7% rental yield looks good until you realise index funds return 12% with zero management effort.",
    example: {
      situation: "You're considering buying a rental property that yields 5% annually.",
      breakdown: [
        { outcome: "Rental property return",      prob: "5% annual",   value: "Your choice" },
        { outcome: "Index fund (historical)",     prob: "~12% CAGR",   value: "Best alternative" },
        { outcome: "Management time",             prob: "10–15 hrs/mo", value: "Hidden cost" },
      ],
      calc: "On ₹50L over 10 years: rental = ~₹81L. Index fund = ~₹1.55Cr. Gap = ₹74L plus 1,500+ hours of your time.",
      verdict: "Not saying property is wrong — just that the comparison must be explicit, not assumed.",
    },
    question: "What is the single best alternative use of this time, money, and energy?",
  },
];

const COMPLEXITY_LABELS = ["", "Simple", "Medium", "Advanced"];
const COMPLEXITY_COLORS = ["", C.green, C.amber, C.red];

function ModelCard({ model, isOpen, onToggle }: { model: typeof MODELS[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{
      background: C.surface, border: `1.5px solid ${isOpen ? model.color + "55" : C.border}`,
      borderRadius: 14, overflow: "hidden", transition: "all .2s",
      boxShadow: isOpen ? "0 4px 16px rgba(0,0,0,.08)" : "0 1px 4px rgba(0,0,0,.04)",
    }}>
      <div onClick={onToggle} style={{
        display: "flex", alignItems: "center", gap: 14, padding: "18px 20px",
        cursor: "pointer", background: isOpen ? model.bg : C.surface, transition: "background .2s",
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 12, flexShrink: 0,
          background: `${model.color}15`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
        }}>{model.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 10, fontWeight: 500, color: model.color, letterSpacing: "0.1em" }}>{model.code}</span>
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

      {isOpen && (
        <div className="animate-fade-up" style={{ padding: "0 20px 24px" }}>
          <div style={{ height: 1, background: C.border, marginBottom: 20 }} />
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 8 }}>What it does</div>
            <p style={{ fontSize: 15, lineHeight: 1.8, color: C.text, margin: 0 }}>{model.simple}</p>
          </div>
          <div style={{ padding: "14px 16px", background: C.redBg, border: `1px solid ${C.redBorder}`, borderRadius: 10, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.red, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 6 }}>⚠ The mistake people make without this</div>
            <p style={{ fontSize: 14, color: C.text, lineHeight: 1.7, margin: 0 }}>{model.mistake}</p>
          </div>
          <div style={{ background: model.bg, border: `1px solid ${model.border}`, borderRadius: 10, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: model.color, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 10 }}>Real example</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: C.text, marginBottom: 14, lineHeight: 1.5 }}>{model.example.situation}</div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 6, marginBottom: 14 }}>
              {model.example.breakdown.map((row, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "8px 12px", background: C.surface, borderRadius: 8, border: `1px solid ${C.border}` }}>
                  <span style={{ fontSize: 13, color: C.textMuted, flex: 1 }}>{row.outcome}</span>
                  <span style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: model.color, flexShrink: 0 }}>{row.prob}</span>
                  <span style={{ fontSize: 12, color: C.textDim, flexShrink: 0, textAlign: "right" as const }}>{row.value}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: "10px 14px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, marginBottom: 4, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>The calculation</div>
              <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 12, color: C.text, lineHeight: 1.6 }}>{model.example.calc}</div>
            </div>
            <div style={{ padding: "8px 12px", background: C.greenBg, border: `1px solid ${C.greenBorder}`, borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: C.green, fontWeight: 500 }}>{model.example.verdict}</span>
            </div>
          </div>
          <div style={{ padding: "12px 16px", background: C.surfaceHigh, border: `1px solid ${C.border}`, borderRadius: 10, display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 4 }}>The key question this model asks</div>
              <div style={{ fontSize: 14, fontWeight: 500, color: model.color, lineHeight: 1.5 }}>&ldquo;{model.question}&rdquo;</div>
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
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? MODELS
    : filter === "simple"   ? MODELS.filter(m => m.complexity === 1)
    : filter === "medium"   ? MODELS.filter(m => m.complexity === 2)
    : MODELS.filter(m => m.complexity === 3);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      {/* Nav */}
      <nav style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "0 32px", position: "sticky", top: 0, zIndex: 50, boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => router.push("/")}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "var(--font-jetbrains)", fontWeight: 700, fontSize: 12 }}>BLS</div>
            <span style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 700 }}>BeLessStupid</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => router.push("/sample")} style={{ padding: "7px 16px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 13, fontFamily: "var(--font-dm-sans)" }}>See sample memos</button>
            <button onClick={() => router.push("/audit")} style={{ padding: "7px 18px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 13, fontWeight: 500, fontFamily: "var(--font-dm-sans)" }}>Start free audit →</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 32px 80px" }}>

        {/* ── MUNGER INTRO ──────────────────────────────────────────────── */}
        <div className="animate-fade-up" style={{ marginBottom: 52 }}>
          <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 11, letterSpacing: "0.12em", color: C.amber, textTransform: "uppercase" as const, marginBottom: 12 }}>
            Why Lattice Thinking Changes Everything
          </div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,5vw,44px)", fontWeight: 700, lineHeight: 1.15, marginBottom: 16, color: C.text }}>
            The most important insight Charlie Munger ever shared about decision-making.
          </h1>

          {/* Munger quote */}
          <div style={{ borderLeft: `4px solid ${C.amber}`, paddingLeft: 20, margin: "24px 0 28px" }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontStyle: "italic", color: C.text, lineHeight: 1.7, marginBottom: 10 }}>
              &ldquo;You&apos;ve got to have models in your head. And you&apos;ve got to array your experience — both vicarious and direct — on this latticework of models. You may have noticed students who just try to remember and pound back what is remembered. Well, they fail in school and in life. You&apos;ve got to hang experience on a latticework of models in your head.&rdquo;
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, fontWeight: 500 }}>
              — Charlie Munger, <em>Poor Charlie&apos;s Almanack</em>
            </div>
          </div>

          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.85, marginBottom: 20 }}>
            Munger spent decades arguing that single-framework thinkers — the economist who sees everything as incentives, the engineer who sees everything as systems — make systematically bad decisions. Not because their framework is wrong. Because any single lens distorts reality.
          </p>
          <p style={{ fontSize: 16, color: C.textMuted, lineHeight: 1.85, marginBottom: 28 }}>
            His solution was to build a <strong style={{ color: C.text }}>latticework</strong> — a collection of the 80–100 most important mental models from across disciplines. When you run any decision through multiple models simultaneously, each one illuminates a different blind spot. The result isn&apos;t a single answer — it&apos;s a much richer, more accurate picture of reality.
          </p>

          {/* Why lattice section */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 }}>
            {[
              { icon: "🔭", title: "Single model = one lens", desc: "An economist sees every decision as an incentive problem. An engineer sees every decision as a systems problem. Both are partly right — and dangerously incomplete.", color: C.redBg, border: C.redBorder },
              { icon: "🕸", title: "Lattice = multiple lenses", desc: "Running a decision through 8 models catches what any single model misses. Each model adds a layer of clarity the others can't provide.", color: C.greenBg, border: C.greenBorder },
              { icon: "🧠", title: "Most people's mental model", desc: "\"Does this feel right?\" Gut intuition is fast and sometimes correct — but it's systematically biased by emotion, recency, and anchoring.", color: C.redBg, border: C.redBorder },
              { icon: "⚖", title: "Munger's mental model", desc: "Array the decision against multiple frameworks. See where they agree. Investigate where they conflict. The answer usually lives in the tension.", color: C.greenBg, border: C.greenBorder },
            ].map(s => (
              <div key={s.title} style={{ padding: "16px", background: s.color, border: `1px solid ${s.border}`, borderRadius: 12 }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>

          {/* The 8 models rationale */}
          <div style={{ padding: "20px 22px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.1em", marginBottom: 12 }}>
              Why these 8 models specifically
            </div>
            <p style={{ fontSize: 14, color: C.textMuted, lineHeight: 1.8, marginBottom: 12, margin: 0 }}>
              Munger referenced over 100 mental models across his career. We distilled them to the 8 that matter most for the decisions most people actually face — career pivots, business decisions, investments, and life changes. Together they cover:
            </p>
            <div style={{ marginTop: 12, display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {[
                { icon: "⚖", text: "Expected Value + Base Rates — the probabilistic foundation. Are the odds actually in your favour?" },
                { icon: "🕳", text: "Sunk Cost + Opportunity Cost — the past and the alternatives. Are you deciding on what's real, or what you've invested?" },
                { icon: "👻", text: "Survivorship Bias + Bayesian Update — the data you're missing and the signals you're misreading." },
                { icon: "🔃", text: "Inversion + Kelly Criterion — failure-proofing and bet sizing. Even a great decision can go wrong if approached wrong." },
              ].map(s => (
                <div key={s.icon} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 12px", background: C.surfaceHigh, borderRadius: 8 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                  <span style={{ fontSize: 14, color: C.text, lineHeight: 1.55 }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" as const, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
            {[
              { n: "3", l: "Simple models — intuitive, 2 min each" },
              { n: "3", l: "Medium models — some estimation, 4 min each" },
              { n: "2", l: "Advanced models — quantitative, 6 min each" },
            ].map(s => (
              <div key={s.l} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontFamily: "var(--font-jetbrains)", fontSize: 22, fontWeight: 700, color: C.amber }}>{s.n}</div>
                <div style={{ fontSize: 13, color: C.textMuted }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── THE 8 MODELS ─────────────────────────────────────────────── */}
        <div style={{ fontSize: 11, fontWeight: 600, color: C.textDim, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: 16 }}>
          The 8 Models — click any to expand
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" as const }}>
          {[
            { id: "all",      label: "All 8 models" },
            { id: "simple",   label: "● Simple" },
            { id: "medium",   label: "●● Medium" },
            { id: "advanced", label: "●●● Advanced" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)} style={{
              padding: "7px 16px",
              background: filter === f.id ? C.amber : C.surface,
              border: `1.5px solid ${filter === f.id ? C.amber : C.border}`,
              color: filter === f.id ? "#fff" : C.textMuted,
              cursor: "pointer", borderRadius: 20,
              fontSize: 13, fontFamily: "var(--font-dm-sans)", fontWeight: 500, transition: "all .15s",
            }}>{f.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
          {filtered.map(model => (
            <ModelCard key={model.id} model={model} isOpen={openId === model.id}
              onToggle={() => setOpenId(openId === model.id ? null : model.id)} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ marginTop: 48, padding: "28px 32px", background: C.amberBg, border: `1.5px solid ${C.amberBorder}`, borderRadius: 16, textAlign: "center" as const }}>
          <div style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
            Ready to run your own audit?
          </div>
          <p style={{ fontSize: 15, color: C.textMuted, marginBottom: 20, lineHeight: 1.7 }}>
            You get 3 free Decision Audits. Pick any major decision you&apos;re sitting on right now.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" as const }}>
            <button onClick={() => router.push("/audit")} style={{ padding: "12px 32px", background: C.amber, border: "none", color: "#fff", cursor: "pointer", borderRadius: 8, fontSize: 15, fontWeight: 500, fontFamily: "var(--font-dm-sans)", boxShadow: "0 1px 3px rgba(0,0,0,.12)" }}>Start My Free Audit →</button>
            <button onClick={() => router.push("/sample")} style={{ padding: "12px 22px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.textMuted, cursor: "pointer", borderRadius: 8, fontSize: 14, fontFamily: "var(--font-dm-sans)" }}>See sample memos</button>
          </div>
        </div>
      </div>
    </div>
  );
}
