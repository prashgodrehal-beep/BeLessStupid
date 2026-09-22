"use client";
// components/SampleMemo.tsx

import { useState } from "react";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

const C = {
  bg: "#F8F7F4", surface: "#FFFFFF", surfaceHigh: "#F1F0EC",
  border: "#E6E4DF", text: "#1C1917", textMuted: "#6B6762", textDim: "#A8A49E",
  amber: "#B5720A", amberBg: "#FEF3E2", amberBorder: "#F5C97A",
  green: "#16783A", greenBg: "#F0FDF4", greenBorder: "#86EFAC",
  red: "#C0392B", redBg: "#FEF2F2", redBorder: "#FECACA",
  blue: "#1D5FAD", blueBg: "#EFF6FF", blueBorder: "#BFDBFE",
  purple: "#6D28D9", purpleBg: "#F5F3FF", purpleBorder: "#C4B5FD",
  orange: "#C05020", orangeBg: "#FFF7ED", orangeBorder: "#FED7AA",
};

const ALL_MODELS = [
  { id:"expected-value", icon:"⚖",  code:"EV", color:C.amber },
  { id:"base-rates",     icon:"📊", code:"BR", color:C.blue },
  { id:"sunk-cost",      icon:"🕳", code:"SC", color:C.purple },
  { id:"bayesian",       icon:"🔄", code:"BU", color:C.green },
  { id:"survivorship",   icon:"👻", code:"SB", color:C.orange },
  { id:"kelly",          icon:"🎯", code:"KS", color:C.green },
  { id:"inversion",      icon:"🔃", code:"IN", color:C.red },
  { id:"opp-cost",       icon:"↔",  code:"OC", color:C.textDim },
];

const SC: Record<string,string> = { pass:C.green, warn:C.amber, fail:C.red, skipped:C.textDim };
const SI: Record<string,string> = { pass:"✓", warn:"⚠", fail:"✕", skipped:"—" };

const SAMPLES = [
  {
    tab: "Career Move",
    icon: "🧭",
    catColor: C.green, catBg: C.greenBg, catBorder: C.greenBorder,
    decision: "Should I quit my ₹32L MNC job to join a Series A startup at ₹28L + 0.5% ESOP?",
    time: "~8 min", modelsRun: 4,
    intake: {
      gut_choice: "Take the startup offer", gut_conf: "60%",
      stakes: "Family income, ₹42K monthly EMI, career trajectory",
      emotion: "Excited but guilty",
      fear: "Startup fails and I can't cover EMI with my family depending on me",
      options: "Join startup / Stay at MNC / Negotiate raise at MNC",
    },
    models: [
      { id:"expected-value", icon:"⚖", code:"EV", color:C.amber,
        insight:"ESOP is positive EV only on a liquidity event with a first-time founder — historically a sub-15% outcome." },
      { id:"inversion", icon:"🔃", code:"IN", color:C.red,
        insight:"Guaranteed failure path: joining without 9-month cash buffer while carrying ₹42K EMI." },
      { id:"sunk-cost", icon:"🕳", code:"SC", color:C.purple,
        insight:"6 years of MNC tenure is inflating the 'need to prove myself' pull. Sunk time is not a reason to take on risk." },
      { id:"opp-cost", icon:"↔", code:"OC", color:C.textDim,
        insight:"Hidden cost isn't the ₹4L salary delta — it's the safety net, PF, ESIC, and career optionality at peak employability." },
    ],
    verdict:"Delay", vColor:C.blue, vBg:C.blueBg, vBorder:C.blueBorder, vIcon:"⏸",
    confidence:"Medium", bet_size:"Small",
    headline:"Negotiate a 90-day window — build cash buffer and validate the founder before signing.",
    why:"The salary cut plus EMI obligation creates a dangerous cash crunch in months 1–6. The ESOP upside only materialises on a liquidity event with a first-time founder — a low-base-rate outcome. Delaying 90 days to build emergency runway costs nothing and fundamentally changes the risk profile.",
    biggest_risk:"Joining with inadequate cash buffer and discovering the founder's style is incompatible — after EMI obligations have already locked you in financially.",
    key_assumptions:["Startup reaches Series B within 36 months for ESOP to matter","Spouse's income covers basics if there's a 1–2 month income gap","You can negotiate a decision window without losing the offer"],
    disconfirming:["Founder's direct references reveal red flags","Startup closes new funding — dramatically de-risks the bet","MNC offers meaningful counter (promotion, role change)"],
    next_action:"Call 3 ex-employees of the founder directly — not references they provide. Ask specifically how they handle adversity and missed targets.",
    flags:{
      "expected-value":{status:"warn",note:"Positive EV, low base rate"},
      "base-rates":{status:"skipped",note:"not run"},
      "sunk-cost":{status:"warn",note:"Identity bias detected"},
      "bayesian":{status:"skipped",note:"not run"},
      "survivorship":{status:"skipped",note:"not run"},
      "kelly":{status:"skipped",note:"not run"},
      "inversion":{status:"fail",note:"No cash buffer — critical"},
      "opp-cost":{status:"warn",note:"Hidden costs underestimated"},
    },
  },
  {
    tab: "Real Estate",
    icon: "🏠",
    catColor: C.blue, catBg: C.blueBg, catBorder: C.blueBorder,
    decision: "Should I buy a ₹1.1 Cr under-construction 3BHK in Whitefield on ₹85L loan (EMI ₹75K), or continue renting at ₹28K?",
    time: "~9 min", modelsRun: 5,
    intake: {
      gut_choice: "Buy — but uncertain", gut_conf: "45%",
      stakes: "₹28L down payment, 34% of take-home as EMI, long-term city lock-in",
      emotion: "Parental pressure + financial anxiety",
      fear: "EMI consuming 34% of income while job mobility gets locked to Bangalore",
      options: "Buy under-construction / Buy ready-to-move (higher cost) / Continue renting",
    },
    models: [
      { id:"expected-value", icon:"⚖", code:"EV", color:C.amber,
        insight:"EMI premium of ₹47K/month over rent. Breakeven: 11+ years. Only positive with long-term Bangalore commitment." },
      { id:"base-rates", icon:"📊", code:"BR", color:C.blue,
        insight:"Under-construction in Bangalore outskirts: 40%+ delay rate. 2.5 years historically becomes 4–5 years." },
      { id:"kelly", icon:"🎯", code:"KS", color:C.green,
        insight:"EMI at 34% of take-home with no emergency fund = zero recovery margin. One job gap = immediate default risk." },
      { id:"opp-cost", icon:"↔", code:"OC", color:C.textDim,
        insight:"₹28L down payment at 12% CAGR in index funds = ₹50L in 5 years. Property doesn't beat that risk-adjusted." },
      { id:"inversion", icon:"🔃", code:"IN", color:C.red,
        insight:"Guaranteed regret: buying under-construction in a city you're uncertain about, changing jobs every 2–3 years." },
    ],
    verdict:"Delay", vColor:C.blue, vBg:C.blueBg, vBorder:C.blueBorder, vIcon:"⏸",
    confidence:"High", bet_size:"None",
    headline:"Don't buy under-construction in a city you're uncertain about. Rent 18 more months, build EMI buffer, buy only ready-to-move.",
    why:"The EMI-to-income ratio (34%) leaves no buffer for the career mobility that changing jobs every 2–3 years demands. Under-construction adds builder risk on top. 'Rent is throwing money away' is the most persistent financial myth in India — you're buying optionality, not wasting rent.",
    biggest_risk:"Buying due to parental pressure and regret aversion — locking ₹1.1Cr into an illiquid asset in a city you might leave in 3 years, with no emergency runway.",
    key_assumptions:["Job stays in Bangalore for 5+ years","Builder delivers on time (historically 40% fail this)","Whitefield appreciation outpaces index returns over 10 years"],
    disconfirming:["Salary rises to ₹3L+ reducing EMI ratio below 25%","A ready-possession flat appears at same price point","Clear 5-year commitment to Bangalore crystallises"],
    next_action:"Invest the ₹28L down payment in a liquid fund this week. Calculate what it compounds to in 18 months vs property appreciation. Then decide with numbers, not emotion.",
    flags:{
      "expected-value":{status:"warn",note:"Breakeven 11+ years"},
      "base-rates":{status:"fail",note:"40% delay rate — high risk"},
      "sunk-cost":{status:"skipped",note:"not run"},
      "bayesian":{status:"skipped",note:"not run"},
      "survivorship":{status:"skipped",note:"not run"},
      "kelly":{status:"fail",note:"34% EMI ratio — too aggressive"},
      "inversion":{status:"warn",note:"City lock-in risk"},
      "opp-cost":{status:"fail",note:"Index fund clearly better"},
    },
  },
  {
    tab: "Venture Investment",
    icon: "🚀",
    catColor: C.purple, catBg: C.purpleBg, catBorder: C.purpleBorder,
    decision: "Should I invest ₹25L in a pre-Series A SaaS startup run by my ex-colleague — 3% equity at ₹8Cr valuation?",
    time: "~10 min", modelsRun: 6,
    intake: {
      gut_choice: "Invest — I believe in the founder", gut_conf: "70%",
      stakes: "₹25L = 30% of liquid savings, relationship with ex-colleague",
      emotion: "Excited + FOMO",
      fear: "Missing a winner I saw early, or losing ₹25L and the friendship",
      options: "Invest full ₹25L / Invest ₹10L / Pass / Ask for better terms",
    },
    models: [
      { id:"expected-value", icon:"⚖", code:"EV", color:C.amber,
        insight:"3% at ₹8Cr = ₹24L. For 10x return on ₹25L investment, company needs to reach ₹830Cr valuation. Base rate: ~2% of Series A companies." },
      { id:"base-rates", icon:"📊", code:"BR", color:C.blue,
        insight:"Pre-Series A SaaS in India: ~5–8% reach Series B. Your 70% confidence needs a very specific edge to justify the gap." },
      { id:"survivorship", icon:"👻", code:"SB", color:C.orange,
        insight:"You see this founder because you know them. You don't see the 200 ex-colleagues who also started companies and quietly shut down." },
      { id:"kelly", icon:"🎯", code:"KS", color:C.green,
        insight:"₹25L = 30% of liquid savings. Kelly says max 8–12% of net worth on a single pre-revenue bet. Massively oversized." },
      { id:"inversion", icon:"🔃", code:"IN", color:C.red,
        insight:"Guaranteed loss scenario: investing because of relationship pressure, no due diligence on unit economics, and no secondary liquidity path." },
      { id:"opp-cost", icon:"↔", code:"OC", color:C.textDim,
        insight:"₹25L deployed in index funds over 7 years = ~₹55L with zero risk of total loss and full liquidity." },
    ],
    verdict:"Partial commit", vColor:C.amber, vBg:C.amberBg, vBorder:C.amberBorder, vIcon:"◑",
    confidence:"Medium", bet_size:"Small",
    headline:"Invest ₹8–10L maximum — not ₹25L. Run real due diligence on unit economics before writing any cheque.",
    why:"The founder relationship is creating a 70% confidence where the base rate warrants 15–20%. Kelly says this bet is 3× oversized relative to your net worth. Investing ₹10L preserves the relationship and the upside exposure while keeping the downside survivable.",
    biggest_risk:"Investing ₹25L on the strength of a personal relationship and FOMO — without understanding the unit economics, CAC, or burn rate — then watching it go to zero and losing both the money and the friendship.",
    key_assumptions:["Founder's second startup has meaningfully higher odds than base rate","Company reaches Series A within 18 months — otherwise dilution risk","You have enough liquidity after ₹25L to handle personal emergencies"],
    disconfirming:["Unit economics review shows CAC > 18-month LTV","Founder can't explain churn rate or payback period clearly","Better deal structure available at next funding round"],
    next_action:"Ask the founder for 3 months of MRR data, CAC breakdown, and current burn rate. If they hesitate, that's your answer. If the numbers are good, invest ₹10L — not ₹25L.",
    flags:{
      "expected-value":{status:"warn",note:"Needs ₹830Cr exit for 10x"},
      "base-rates":{status:"fail",note:"70% confidence vs 8% base rate"},
      "sunk-cost":{status:"skipped",note:"not run"},
      "bayesian":{status:"skipped",note:"not run"},
      "survivorship":{status:"warn",note:"Relationship bias detected"},
      "kelly":{status:"fail",note:"30% net worth — 3× oversized"},
      "inversion":{status:"warn",note:"No due diligence path defined"},
      "opp-cost":{status:"warn",note:"Index fund = clear alternative"},
    },
  },
  {
    tab: "Early Retirement",
    icon: "🌅",
    catColor: C.orange, catBg: C.orangeBg, catBorder: C.orangeBorder,
    decision: "Should I retire at 45 with ₹3.2 Cr corpus, or semi-retire with 2-day consulting while spouse continues working?",
    time: "~8 min", modelsRun: 4,
    intake: {
      gut_choice: "Semi-retire with consulting", gut_conf: "65%",
      stakes: "40+ year financial horizon, children's education costs peaking in 4 years",
      emotion: "Burnout + impatience",
      fear: "Running out of money over a 40+ year retirement period",
      options: "Retire fully now / Semi-retire with consulting / Wait for ₹4–5Cr target",
    },
    models: [
      { id:"expected-value", icon:"⚖", code:"EV", color:C.amber,
        insight:"60% odds with ₹3.2Cr now vs 85% waiting for ₹4–5Cr. Burnout is costing 25% success probability through reduced performance." },
      { id:"kelly", icon:"🎯", code:"KS", color:C.green,
        insight:"Full retirement bet too aggressive — ₹3.2Cr for 40+ years creates real ruin probability with no recovery path at 45." },
      { id:"inversion", icon:"🔃", code:"IN", color:C.red,
        insight:"Critical failure mode: retiring without first testing consulting income viability or ring-fencing a separate education fund." },
      { id:"opp-cost", icon:"↔", code:"OC", color:C.textDim,
        insight:"Giving up ₹1.8L/month guaranteed salary — the fastest remaining wealth-building path — without a tested replacement income." },
    ],
    verdict:"Partial commit", vColor:C.amber, vBg:C.amberBg, vBorder:C.amberBorder, vIcon:"◑",
    confidence:"High", bet_size:"Medium",
    headline:"Semi-retire with consulting while maintaining income diversification and testing runway assumptions.",
    why:"The math strongly favours maintaining some income stream. ₹3.2Cr for 40+ years creates dangerous ruin probability with limited recovery options at 45. Semi-retirement tests consulting viability while preserving optionality and reducing the burnout that's threatening continued wealth accumulation.",
    biggest_risk:"Overestimating consulting income reliability and underestimating the irreversible nature of losing corporate benefits and career momentum — discovering this 2 years after retirement when re-entry is much harder.",
    key_assumptions:["Consulting generates ₹50–80K/month within 6 months of semi-retirement","Burnout trajectory will reduce corporate performance by 25%+ if continued","Market returns average 7–8% real over next decade"],
    disconfirming:["Consulting proves sporadic — income below ₹30K/month","Corporate role improves significantly, reducing burnout","Major market correction reduces corpus 30%+ in first 2 years"],
    next_action:"Negotiate a 3-day work week or 3-month sabbatical with current employer while simultaneously testing consulting demand through 2–3 pilot projects at full consulting rates.",
    flags:{
      "expected-value":{status:"warn",note:"60% vs 85% — material gap"},
      "base-rates":{status:"skipped",note:"not run"},
      "sunk-cost":{status:"skipped",note:"not run"},
      "bayesian":{status:"skipped",note:"not run"},
      "survivorship":{status:"skipped",note:"not run"},
      "kelly":{status:"fail",note:"Ruin probability too high"},
      "inversion":{status:"warn",note:"Education fund not ring-fenced"},
      "opp-cost":{status:"warn",note:"₹1.8L/month foregone"},
    },
  },
  {
    tab: "Start a Business",
    icon: "🏢",
    catColor: C.amber, catBg: C.amberBg, catBorder: C.amberBorder,
    decision: "Should I acquire a CA coaching institute in Pune for ₹1.4 Cr (5x earnings, ₹28L net profit) — ₹40L own funds + ₹1Cr loan?",
    time: "~9 min", modelsRun: 4,
    intake: {
      gut_choice: "Acquire with a modernisation plan", gut_conf: "55%",
      stakes: "₹40L life savings + ₹1Cr debt, no education background",
      emotion: "Cautious excitement",
      fear: "Students follow the owner out — paying 5x for a business that evaporates at handover",
      options: "Acquire as-is / Acquire with earnout structure / Build greenfield EdTech / Pass",
    },
    models: [
      { id:"expected-value", icon:"⚖", code:"EV", color:C.amber,
        insight:"₹28L profit at 5x = ₹1.4Cr. Loan interest eats ₹10–12L/year — real payback is 8–10 years, not 5. Positive only if you retain 80%+ of students." },
      { id:"inversion", icon:"🔃", code:"IN", color:C.red,
        insight:"Guaranteed failure: acquiring without a mandatory 12-month co-management clause. Students enrol for the owner's name, not the institution's." },
      { id:"sunk-cost", icon:"🕳", code:"SC", color:C.purple,
        insight:"No sunk cost yet — this is still a clean decision. Don't let deal excitement create artificial urgency before due diligence is complete." },
      { id:"opp-cost", icon:"↔", code:"OC", color:C.textDim,
        insight:"₹40L + ₹1Cr debt could instead fund a greenfield EdTech play — no key-person dependency, no acquisition premium, full control from day one." },
    ],
    verdict:"Partial commit", vColor:C.amber, vBg:C.amberBg, vBorder:C.amberBorder, vIcon:"◑",
    confidence:"Medium", bet_size:"Medium",
    headline:"Proceed only with a structured earnout — ₹70L upfront, ₹70L tied to student retention at 12 and 24 months.",
    why:"The business has real cashflows, an established brand, and a logical modernisation path. The key-person risk is the entire deal thesis — if the owner leaves and students follow, you've paid ₹1.4Cr for 4 faculty and some furniture. A retention-linked earnout aligns the seller's incentives with yours during the critical transition window.",
    biggest_risk:"Owner agreeing to a handover but subtly redirecting students to a new competing venture — legally ambiguous and practically unenforceable without a non-compete clause with genuine teeth.",
    key_assumptions:["Owner agrees to 12-month co-management at a reduced fee","Online content can extend reach beyond Pune and reduce key-person risk","80%+ student retention through the year-1 handover period"],
    disconfirming:["Owner refuses earnout or non-compete — walk away immediately","Student surveys show loyalty to owner personally, not the brand","Audited financials reveal revenue declining for 2+ years"],
    next_action:"Survey 20 current students anonymously: 'Would you continue if the founder was no longer involved?' Their answers determine whether this deal is viable at any price.",
    flags:{
      "expected-value":{status:"warn",note:"8–10 year payback — long"},
      "base-rates":{status:"skipped",note:"not run"},
      "sunk-cost":{status:"pass",note:"Clean — no sunk cost yet"},
      "bayesian":{status:"skipped",note:"not run"},
      "survivorship":{status:"skipped",note:"not run"},
      "kelly":{status:"skipped",note:"not run"},
      "inversion":{status:"fail",note:"Key-person risk is critical"},
      "opp-cost":{status:"warn",note:"Greenfield option viable"},
    },
  },
];

function MemoView({ s }: { s: typeof SAMPLES[0] }) {
  return (
    <div>
      {/* Meta */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap" as const, gap:10, marginBottom:16 }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span>{s.icon}</span>
          <span style={{ fontFamily:"var(--font-jetbrains)", fontSize:11, fontWeight:500, color:s.catColor, background:s.catBg, border:`1px solid ${s.catBorder}`, padding:"3px 10px", borderRadius:20 }}>{s.tab}</span>
        </div>
        <div style={{ display:"flex", gap:14 }}>
          {[{l:`${s.modelsRun} models run`},{l:s.time},{l:"Full memo"}].map((x,i) => (
            <span key={i} style={{ fontFamily:"var(--font-jetbrains)", fontSize:11, color:i===2?C.green:C.textDim }}>{x.l}</span>
          ))}
        </div>
      </div>

      {/* Decision */}
      <div style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(16px,2.2vw,20px)", fontWeight:700, lineHeight:1.35, color:C.text, marginBottom:10 }}>
        &ldquo;{s.decision}&rdquo;
      </div>

      {/* Model chips */}
      <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" as const }}>
        {s.models.map(m => (
          <span key={m.id} style={{ fontSize:12, color:m.color, background:`${m.color}10`, border:`1px solid ${m.color}33`, padding:"3px 10px", borderRadius:20 }}>{m.icon} {m.code}</span>
        ))}
      </div>

      {/* Intake */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.textDim, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:12 }}>What was extracted</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 24px" }}>
          {[
            {l:"Gut choice",    v:s.intake.gut_choice},
            {l:"Confidence",    v:s.intake.gut_conf},
            {l:"Emotion",       v:s.intake.emotion},
            {l:"Core fear",     v:s.intake.fear},
            {l:"Options",       v:s.intake.options},
            {l:"Stakes",        v:s.intake.stakes},
          ].map(x => (
            <div key={x.l}>
              <div style={{ fontSize:11, color:C.textDim, marginBottom:2 }}>{x.l}</div>
              <div style={{ fontSize:13, color:C.text, fontWeight:500, lineHeight:1.4 }}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:"16px 18px", marginBottom:12, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.textDim, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:12 }}>Live insights</div>
        {s.models.map((m,i) => (
          <div key={m.id} style={{ display:"flex", gap:12, alignItems:"flex-start", paddingBottom:i<s.models.length-1?12:0, marginBottom:i<s.models.length-1?12:0, borderBottom:i<s.models.length-1?`1px solid ${C.border}`:"none" }}>
            <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, background:`${m.color}12`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:15 }}>{m.icon}</div>
            <div>
              <div style={{ fontFamily:"var(--font-jetbrains)", fontSize:10, fontWeight:500, color:m.color, letterSpacing:"0.08em", marginBottom:3 }}>{m.code}</div>
              <div style={{ fontSize:14, color:C.text, lineHeight:1.6 }}>{m.insight}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <div style={{ padding:"20px 22px", background:s.vBg, border:`1.5px solid ${s.vBorder}`, borderRadius:16, marginBottom:12, boxShadow:"0 2px 12px rgba(0,0,0,.06)" }}>
        <div style={{ fontSize:11, fontWeight:600, color:s.vColor, textTransform:"uppercase" as const, letterSpacing:"0.1em", marginBottom:10 }}>Recommendation</div>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:10 }}>
          <div style={{ width:46, height:46, borderRadius:12, background:s.vColor, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontSize:20, fontWeight:700, flexShrink:0 }}>{s.vIcon}</div>
          <div style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(22px,3.5vw,34px)", fontWeight:900, color:s.vColor, lineHeight:1 }}>{s.verdict}</div>
        </div>
        <p style={{ fontSize:15, lineHeight:1.75, color:C.text, fontStyle:"italic", marginBottom:14 }}>{s.headline}</p>
        <div style={{ display:"flex", gap:10 }}>
          {[{l:"Confidence",v:s.confidence},{l:"Bet Size",v:s.bet_size}].map(x => (
            <div key={x.l} style={{ padding:"9px 16px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:10 }}>
              <div style={{ fontSize:10, fontWeight:600, color:C.textMuted, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:3 }}>{x.l}</div>
              <div style={{ fontSize:15, fontWeight:600, color:C.text }}>{x.v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Why */}
      <div style={{ padding:"16px 18px", background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, marginBottom:10, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:8 }}>Why this recommendation</div>
        <p style={{ fontSize:14, lineHeight:1.85, color:C.text, margin:0 }}>{s.why}</p>
      </div>

      {/* Risk */}
      <div style={{ padding:"14px 18px", background:C.redBg, border:`1px solid ${C.redBorder}`, borderRadius:14, marginBottom:10 }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.red, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:6 }}>⚠ Biggest Risk</div>
        <p style={{ fontSize:14, color:C.text, lineHeight:1.75, margin:0 }}>{s.biggest_risk}</p>
      </div>

      {/* Assumptions + disconfirming */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
        {[
          {title:"Key Assumptions", color:C.amber, bg:C.amberBg, items:s.key_assumptions, bullet:"·"},
          {title:"What Changes This", color:C.blue, bg:C.blueBg, items:s.disconfirming, bullet:"→"},
        ].map(x => (
          <div key={x.title} style={{ padding:"14px", background:x.bg, border:`1px solid ${C.border}`, borderRadius:14 }}>
            <div style={{ fontSize:11, fontWeight:600, color:C.textMuted, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:10 }}>{x.title}</div>
            {x.items.map((it,i) => (
              <div key={i} style={{ display:"flex", gap:8, marginBottom:8 }}>
                <div style={{ color:x.color, fontSize:14, flexShrink:0, fontWeight:700 }}>{x.bullet}</div>
                <div style={{ fontSize:13, color:C.text, lineHeight:1.55 }}>{it}</div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Next action */}
      <div style={{ padding:"14px 18px", background:C.greenBg, border:`1px solid ${C.greenBorder}`, borderRadius:14, marginBottom:18 }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.green, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:6 }}>Next Action — Do This in 7 Days</div>
        <p style={{ fontSize:14, fontWeight:500, color:C.text, lineHeight:1.7, margin:0 }}>{s.next_action}</p>
      </div>

      {/* Lattice */}
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:11, fontWeight:600, color:C.textDim, textTransform:"uppercase" as const, letterSpacing:"0.08em", marginBottom:10 }}>The Lattice — Model Results</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8 }}>
          {ALL_MODELS.map(m => {
            const f = s.flags[m.id as keyof typeof s.flags];
            const st = f?.status || "skipped";
            const wasRun = s.models.some(sm => sm.id === m.id);
            return (
              <div key={m.id} style={{ padding:"12px", background:C.surface, border:`1px solid ${wasRun?(SC[st]+"33"):C.border}`, borderTop:`3px solid ${wasRun?(SC[st]||C.border):C.border}`, borderRadius:"0 0 12px 12px", opacity:wasRun?1:.4 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:`${m.color}10`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{m.icon}</div>
                  {wasRun && <div style={{ width:20, height:20, borderRadius:5, background:SC[st]?`${SC[st]}15`:C.surfaceHigh, border:`1px solid ${SC[st]?SC[st]+"33":C.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:SC[st]||C.textDim }}>{SI[st]||"?"}</div>}
                </div>
                <div style={{ fontFamily:"var(--font-jetbrains)", fontSize:9, fontWeight:500, color:wasRun?m.color:C.textDim, letterSpacing:"0.08em", marginBottom:2 }}>{m.code}</div>
                <div style={{ fontSize:11, color:C.textMuted, lineHeight:1.4 }}>{wasRun?f?.note:"not run"}</div>
              </div>
            );
          })}
        </div>
        <p style={{ fontSize:12, color:C.textDim, marginTop:7, fontStyle:"italic" }}>Greyed models were not included. Add them anytime for a deeper analysis.</p>
      </div>
    </div>
  );
}

export default function SampleMemo() {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const s = SAMPLES[active];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, color:C.text }}>
      {/* Nav */}
      <nav style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"0 32px", position:"sticky", top:0, zIndex:50, boxShadow:"0 1px 4px rgba(0,0,0,.04)" }}>
        <div style={{ maxWidth:760, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", height:60 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={() => router.push("/")}>
            <div style={{ width:30, height:30, borderRadius:7, background:C.amber, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontFamily:"var(--font-jetbrains)", fontWeight:700, fontSize:12 }}>BLS</div>
            <span style={{ fontFamily:"var(--font-playfair)", fontSize:16, fontWeight:700 }}>BeLessStupid</span>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={() => router.push("/learn")} style={{ padding:"7px 16px", background:C.surface, border:`1.5px solid ${C.border}`, color:C.textMuted, cursor:"pointer", borderRadius:8, fontSize:13, fontFamily:"var(--font-dm-sans)" }}>Learn the models</button>
            <button onClick={() => router.push("/audit")} style={{ padding:"7px 18px", background:C.amber, border:"none", color:"#fff", cursor:"pointer", borderRadius:8, fontSize:13, fontWeight:500, fontFamily:"var(--font-dm-sans)" }}>Start my own audit →</button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth:700, margin:"0 auto", padding:"40px 32px 80px" }}>
        {/* Page header */}
        <div className="animate-fade-up" style={{ marginBottom:28 }}>
          <div style={{ display:"inline-block", fontFamily:"var(--font-jetbrains)", fontSize:10, letterSpacing:"0.12em", color:C.amber, textTransform:"uppercase" as const, background:C.amberBg, border:`1px solid ${C.amberBorder}`, padding:"3px 12px", borderRadius:20, marginBottom:14 }}>5 Sample Decision Memos</div>
          <h1 style={{ fontFamily:"var(--font-playfair)", fontSize:"clamp(24px,4vw,36px)", fontWeight:700, lineHeight:1.2, marginBottom:10 }}>This is what you get.</h1>
          <p style={{ fontSize:16, color:C.textMuted, lineHeight:1.75, maxWidth:520 }}>
            Five full Decision Audit outputs across different decision types. Real scenarios, real models, real recommendations. Run your own in under 10 minutes.
          </p>
        </div>

        {/* Scenario tabs */}
        <div style={{ display:"flex", gap:6, marginBottom:28, flexWrap:"wrap" as const }}>
          {SAMPLES.map((x,i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              display:"flex", alignItems:"center", gap:6,
              padding:"8px 16px",
              background:active===i ? x.catColor : C.surface,
              border:`1.5px solid ${active===i ? x.catColor : C.border}`,
              color:active===i ? "#fff" : C.textMuted,
              cursor:"pointer", borderRadius:20,
              fontSize:13, fontFamily:"var(--font-dm-sans)", fontWeight:500, transition:"all .15s",
            }}>
              <span>{x.icon}</span> {x.tab}
            </button>
          ))}
        </div>

        {/* Active memo */}
        <MemoView s={s} />

        {/* CTA */}
        <div style={{ marginTop:32, padding:"24px 28px", background:C.amberBg, border:`1.5px solid ${C.amberBorder}`, borderRadius:16, textAlign:"center" as const }}>
          <div style={{ fontFamily:"var(--font-playfair)", fontSize:20, fontWeight:700, marginBottom:8, color:C.text }}>Now run your own audit.</div>
          <p style={{ fontSize:15, color:C.textMuted, marginBottom:18, lineHeight:1.7 }}>Pick any major decision you&apos;re sitting on. 3 free audits — no card needed.</p>
          <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap" as const }}>
            <button onClick={() => router.push("/audit")} style={{ padding:"12px 28px", background:C.amber, border:"none", color:"#fff", cursor:"pointer", borderRadius:8, fontSize:15, fontWeight:500, fontFamily:"var(--font-dm-sans)", boxShadow:"0 1px 3px rgba(0,0,0,.12)" }}>Start My Free Audit →</button>
            <button onClick={() => router.push("/learn")} style={{ padding:"12px 22px", background:C.surface, border:`1.5px solid ${C.border}`, color:C.textMuted, cursor:"pointer", borderRadius:8, fontSize:14, fontFamily:"var(--font-dm-sans)" }}>Learn the 8 models first</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
