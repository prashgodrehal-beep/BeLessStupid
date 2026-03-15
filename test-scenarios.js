#!/usr/bin/env node
// test-scenarios.js
// Run: node test-scenarios.js
// Requires: ANTHROPIC_API_KEY in .env.local
//
// Tests all 6 decision categories across 3 stages:
//   Stage 1 — Quick Intake extraction
//   Stage 2 — Model Engine (runs mandatory models, generates insights + verdict)
//   Stage 3 — Decision Memo generation
//
// Output is written to ./test-results/ as JSON + a human-readable summary.

const fs   = require("fs");
const path = require("path");

// ── Load env ──────────────────────────────────────────────────────────────────
const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, "utf8").split("\n").forEach(line => {
    const [k, ...v] = line.split("=");
    if (k && !k.startsWith("#") && v.length) {
      process.env[k.trim()] = v.join("=").trim();
    }
  });
}

const API_KEY = process.env.ANTHROPIC_API_KEY;
if (!API_KEY) { console.error("❌  ANTHROPIC_API_KEY not found in .env.local"); process.exit(1); }

const RESULTS_DIR = path.join(__dirname, "test-results");
if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR);

// ── Colour helpers ────────────────────────────────────────────────────────────
const C = {
  reset:  "\x1b[0m",
  bold:   "\x1b[1m",
  dim:    "\x1b[2m",
  green:  "\x1b[32m",
  red:    "\x1b[31m",
  yellow: "\x1b[33m",
  cyan:   "\x1b[36m",
  blue:   "\x1b[34m",
  grey:   "\x1b[90m",
};
const g = s => `${C.green}${s}${C.reset}`;
const r = s => `${C.red}${s}${C.reset}`;
const y = s => `${C.yellow}${s}${C.reset}`;
const b = s => `${C.bold}${s}${C.reset}`;
const d = s => `${C.dim}${s}${C.reset}`;

// ── Claude helper ─────────────────────────────────────────────────────────────
async function claude(messages, system, maxTokens = 800) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: maxTokens,
      system,
      messages,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.content?.[0]?.text || "";
}

// ── Test scenarios ─────────────────────────────────────────────────────────────
// One realistic scenario per category. Quick-audit free-form text.
const SCENARIOS = [
  {
    id: "career-move",
    category: "Career Move",
    label: "Senior dev leaving stable job for startup",
    text: `I'm a senior software engineer at an MNC, been here 6 years, earning ₹32L per annum. 
A funded startup (Series A, ₹18Cr raised) wants me as their first engineering hire at ₹28L + 0.5% ESOP vesting over 4 years. 
I have a wife and a 2-year-old, EMI of ₹42,000/month for our flat. 
The startup is in B2B SaaS for logistics — I think the market is real but the founder is first-time. 
My gut says go for it but my wife is worried about stability. I've been dreaming about this for 3 years.`,
    mandatory: ["expected-value", "inversion", "opp-cost", "sunk-cost"],
  },
  {
    id: "new-venture",
    category: "Starting a Venture",
    label: "Ex-consultant launching D2C brand",
    text: `I left my consulting job 4 months ago to build a D2C brand for premium Indian spices targeting NRIs in the US and UK. 
I've done ₹4L of initial product development, have 3 SKUs ready, and got my first 12 orders from friends and family. 
I have about ₹18L in savings remaining. My co-founder handles ops, I handle marketing.
We haven't cracked paid acquisition yet — CAC is ₹900 vs AOV of ₹1,800. 
I'm wondering if I should raise a small angel round (₹50L) or keep bootstrapping. 
Instagram content is growing but slowly. I feel like we're close but burning cash.`,
    mandatory: ["expected-value", "inversion", "opp-cost", "sunk-cost", "base-rates", "survivorship"],
  },
  {
    id: "real-estate",
    category: "Real Estate",
    label: "First home vs continued renting in Bangalore",
    text: `I'm 34, renting in Whitefield Bangalore at ₹28,000/month. 
Considering buying a 3BHK apartment in the same area for ₹1.1 Cr. 
Would need a loan of ₹85L — EMI would be about ₹75,000/month at current rates. 
My monthly take-home is ₹2.2L. I have ₹28L for down payment.
The builder is reputed but it's under-construction, possession in 2.5 years. 
I keep going back and forth — rent feels like throwing money away but EMI seems very high. 
My parents think buying is always better. I change jobs every 2-3 years so not sure about Bangalore long-term.`,
    mandatory: ["expected-value", "inversion", "opp-cost", "base-rates", "kelly"],
  },
  {
    id: "new-business",
    category: "Buying a Business",
    label: "Acquiring a profitable coaching institute",
    text: `A well-established coaching institute for CA exams in Pune is up for sale. 
Owner is retiring. The business does ₹90L revenue annually, ₹28L net profit. 
Asking price is ₹1.4 Cr — about 5x earnings. 
I have ₹40L saved and would need ₹1 Cr loan. 
The business has 180 students, 4 faculty, 12 years of reputation. 
I have no background in education but I've run a small business before. 
Main risk is the owner being the face of the brand — students know HIM, not the institute. 
I think I can modernize it with online content but I'm not 100% sure.`,
    mandatory: ["expected-value", "inversion", "opp-cost", "sunk-cost"],
  },
  {
    id: "early-retire",
    category: "Early Retirement",
    label: "45-year-old considering FIRE",
    text: `I'm 45, have ₹3.2 Cr in investments (mutual funds + stocks), own my house, no EMI. 
Monthly expenses are about ₹85,000 for family of 3. 
I've been in corporate for 22 years and I'm completely burnt out. 
I hate my job but it pays ₹1.8L/month. 
My spouse earns ₹60,000/month and loves her job.
If I retire now, we'd need the corpus to last 40+ years. 
I've calculated I need ₹4-5 Cr for full FIRE but I'm impatient.
I'm thinking maybe semi-retire — do consulting 2 days a week. 
Kids' education costs peak in 4 years — college fees maybe ₹20-30L.`,
    mandatory: ["expected-value", "inversion", "opp-cost", "kelly"],
  },
  {
    id: "generic",
    category: "Other Decision",
    label: "Relocating family to Canada",
    text: `I got a job offer in Toronto, Canada. Salary CAD 110,000 per year — about ₹68L at current rates. 
My current salary in Hyderabad is ₹42L. On paper it looks great.
But my parents are here, both in their 70s with some health issues. 
My wife is not fully convinced — she'd have to leave her job (₹18L/year) and restart in Canada.
My daughter is 8 — good age to move but I worry about uprooting her.
We've visited Canada once and liked it, but tourist vs resident is very different.
The company is a mid-size tech firm, role seems stable.
I have to decide in 3 weeks. I feel both excited and terrified at the same time.`,
    mandatory: ["expected-value", "inversion", "opp-cost"],
  },
];

// ── Model definitions (prompts only — mirrors config.ts) ──────────────────────
const MODELS = {
  "expected-value": {
    name: "Expected Value",
    questions: ["outcomes", "probs", "upside", "downside"],
    flashPrompt: "State ONE key finding about the odds or payoff in max 12 words. Start with a number if possible.",
  },
  "base-rates": {
    name: "Base Rates",
    questions: ["ref_class", "hist_rate", "your_conf", "edge"],
    flashPrompt: "State ONE finding about the gap between user confidence and historical base rate. Max 12 words.",
  },
  "sunk-cost": {
    name: "Sunk Cost",
    questions: ["invested", "fresh_start", "real_reason"],
    flashPrompt: "State ONE finding about whether past investment is contaminating this decision. Max 12 words.",
  },
  "bayesian": {
    name: "Bayesian Update",
    questions: ["prior", "evidence", "update"],
    flashPrompt: "State ONE finding about whether the user is updating their beliefs correctly. Max 12 words.",
  },
  "survivorship": {
    name: "Survivorship Bias",
    questions: ["examples", "failures", "denominator"],
    flashPrompt: "State ONE finding about invisible failures or sample bias. Max 12 words.",
  },
  "kelly": {
    name: "Kelly Criterion",
    questions: ["commitment", "reversible", "recovery"],
    flashPrompt: "State ONE finding about bet sizing or risk of ruin. Max 12 words.",
  },
  "inversion": {
    name: "Inversion",
    questions: ["fail_paths", "stupid_2yr", "avoidable"],
    flashPrompt: "State ONE critical failure mode or avoidable mistake. Max 12 words.",
  },
  "opp-cost": {
    name: "Opportunity Cost",
    questions: ["next_best", "sacrifice", "comparison"],
    flashPrompt: "State ONE finding about what is being sacrificed or foregone. Max 12 words.",
  },
};

// ── Stage 1: Quick Intake extraction ─────────────────────────────────────────
async function runIntakeExtraction(scenario) {
  const sys = `Extract structured context from a free-form decision description. Return ONLY valid JSON with no markdown:
{"decision":"one-sentence statement","all_options":"options mentioned","gut_choice":"what they seem to want","gut_conf":"estimated confidence e.g. 60%","stakes":"what's at risk","emotion_now":"dominant emotion","fear":"what they fear most","assumptions":"key assumptions"}`;

  const text = await claude(
    [{ role: "user", content: `Category: ${scenario.category}\nText: ${scenario.text}` }],
    sys, 500
  );

  const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
  return parsed;
}

// ── Stage 2: Model answers + flash insights ───────────────────────────────────
async function runModelStage(scenario, intake) {
  const insights = {};
  let verdict    = null;

  for (const modelId of scenario.mandatory) {
    const model = MODELS[modelId];
    if (!model) continue;

    // Generate model answers via Claude (simulate user answering questions)
    const answerSys = `You are simulating a user answering questions about their decision.
Answer each question honestly and specifically based on the decision context.
Return ONLY valid JSON: { ${model.questions.map(q => `"${q}":"answer"`).join(", ")} }`;

    const answersText = await claude(
      [{ role: "user", content: `Decision: ${intake.decision}\nContext: ${scenario.text}\nModel: ${model.name}\nAnswer the ${model.questions.length} questions for this model.` }],
      answerSys, 600
    );
    const answers = JSON.parse(answersText.replace(/```json|```/g, "").trim());

    // Generate flash insight
    const insightSys = `Decision auditor flash insight. ${model.flashPrompt} Be specific — reference actual answers. No filler. Max 20 words.`;
    const insight = await claude(
      [{ role: "user", content: `Model: ${model.name}\nAnswers: ${JSON.stringify(answers)}\nDecision: ${intake.decision}` }],
      insightSys, 80
    );
    insights[modelId] = insight.trim();
  }

  // Generate running verdict
  const verdictSys = `Give a one-phrase preliminary verdict: Proceed / Avoid / Delay / Run experiment first / Partial commit / Exit. Return ONLY the phrase.`;
  verdict = await claude(
    [{ role: "user", content: `Decision: ${intake.decision}\nInsights: ${JSON.stringify(insights)}` }],
    verdictSys, 20
  );

  return { insights, verdict: verdict.trim() };
}

// ── Stage 3: Decision Memo ────────────────────────────────────────────────────
async function runMemo(scenario, intake, modelResults) {
  const ctx = JSON.stringify({
    category:   scenario.category,
    decision:   intake.decision,
    options:    intake.all_options,
    gut:        intake.gut_choice,
    models_run: scenario.mandatory.map(id => MODELS[id]?.name),
    insights:   modelResults.insights,
  });

  const sys = `Munger-style decision auditor. Return ONLY valid JSON:
{"recommendation":"Proceed|Avoid|Delay|Run experiment first|Partial commit|Exit","confidence":"Low|Medium|High","bet_size":"None|Small|Medium|Large|Staged","headline":"One crisp verdict sentence","why":"2-3 sentence reasoning","key_assumptions":["a1","a2","a3"],"disconfirming":["d1","d2","d3"],"biggest_risk":"Single most dangerous blind spot","next_action":"One concrete action in 7 days"}`;

  const text = await claude(
    [{ role: "user", content: `Context: ${ctx}\nGenerate memo.` }],
    sys, 800
  );

  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ── Validate results ──────────────────────────────────────────────────────────
function validateIntake(intake) {
  const required = ["decision", "all_options", "gut_choice", "gut_conf", "stakes"];
  const missing  = required.filter(k => !intake[k] || intake[k].trim() === "");
  return { pass: missing.length === 0, missing };
}

function validateInsights(insights, mandatory) {
  const missing  = mandatory.filter(id => !insights[id] || insights[id].length < 5);
  const tooShort = mandatory.filter(id => insights[id] && insights[id].split(" ").length < 4);
  return { pass: missing.length === 0 && tooShort.length === 0, missing, tooShort };
}

function validateMemo(memo) {
  const validRec  = ["Proceed","Avoid","Delay","Run experiment first","Partial commit","Exit"];
  const validConf = ["Low","Medium","High"];
  const validBet  = ["None","Small","Medium","Large","Staged"];
  const issues    = [];
  if (!validRec.includes(memo.recommendation))        issues.push(`Bad recommendation: "${memo.recommendation}"`);
  if (!validConf.includes(memo.confidence))           issues.push(`Bad confidence: "${memo.confidence}"`);
  if (!validBet.includes(memo.bet_size))              issues.push(`Bad bet_size: "${memo.bet_size}"`);
  if (!memo.headline || memo.headline.length < 10)    issues.push("Headline too short");
  if (!memo.why || memo.why.length < 30)              issues.push("Why too short");
  if (!Array.isArray(memo.key_assumptions) || memo.key_assumptions.length < 2) issues.push("Need ≥2 key_assumptions");
  if (!Array.isArray(memo.disconfirming)   || memo.disconfirming.length < 2)   issues.push("Need ≥2 disconfirming");
  if (!memo.biggest_risk || memo.biggest_risk.length < 10) issues.push("biggest_risk too short");
  if (!memo.next_action  || memo.next_action.length < 10)  issues.push("next_action too short");
  return { pass: issues.length === 0, issues };
}

// ── Print helpers ─────────────────────────────────────────────────────────────
function box(title, color = C.cyan) {
  const line = "─".repeat(60);
  console.log(`\n${color}┌${line}┐${C.reset}`);
  console.log(`${color}│  ${b(title.padEnd(57))}${color}│${C.reset}`);
  console.log(`${color}└${line}┘${C.reset}`);
}

function section(title) {
  console.log(`\n  ${C.bold}${C.blue}◆ ${title}${C.reset}`);
}

function printKV(key, value, indent = "    ") {
  const val = typeof value === "string" ? value : JSON.stringify(value);
  const truncated = val.length > 120 ? val.slice(0, 120) + "…" : val;
  console.log(`${indent}${d(key.padEnd(18))} ${truncated}`);
}

// ── Run single scenario ───────────────────────────────────────────────────────
async function runScenario(scenario, index, total) {
  const start  = Date.now();
  const result = {
    id:        scenario.id,
    category:  scenario.category,
    label:     scenario.label,
    stages:    {},
    passed:    0,
    failed:    0,
    errors:    [],
    durationMs: 0,
  };

  box(`${index}/${total}  ${scenario.category}  —  ${scenario.label}`);
  console.log(`  ${d("Mandatory models:")} ${scenario.mandatory.join(", ")}\n`);

  // ── Stage 1 ────────────────────────────────────────────────────────────────
  section("Stage 1 — Quick Intake Extraction");
  let intake;
  try {
    process.stdout.write("    Extracting intake… ");
    intake = await runIntakeExtraction(scenario);
    const v = validateIntake(intake);
    if (v.pass) {
      console.log(g("✓ PASS"));
      result.passed++;
    } else {
      console.log(r(`✗ FAIL  (missing: ${v.missing.join(", ")})`));
      result.failed++;
    }
    result.stages.intake = { data: intake, validation: v };
    printKV("decision",   intake.decision);
    printKV("gut_choice", intake.gut_choice);
    printKV("gut_conf",   intake.gut_conf);
    printKV("stakes",     intake.stakes);
    printKV("emotion",    intake.emotion_now);
    printKV("fear",       intake.fear);
  } catch (e) {
    console.log(r(`✗ ERROR: ${e.message}`));
    result.failed++; result.errors.push(`intake: ${e.message}`);
    result.stages.intake = { error: e.message };
    intake = { decision: scenario.text.slice(0, 100), all_options: "", gut_choice: "", gut_conf: "50%", stakes: "" };
  }

  // ── Stage 2 ────────────────────────────────────────────────────────────────
  section("Stage 2 — Model Engine");
  let modelResults;
  try {
    process.stdout.write(`    Running ${scenario.mandatory.length} models… `);
    modelResults = await runModelStage(scenario, intake);
    const v = validateInsights(modelResults.insights, scenario.mandatory);
    if (v.pass) {
      console.log(g("✓ PASS"));
      result.passed++;
    } else {
      const issues = [...v.missing.map(id => `missing:${id}`), ...v.tooShort.map(id => `short:${id}`)];
      console.log(y(`⚠ PARTIAL  (${issues.join(", ")})`));
      result.failed++;
    }
    result.stages.models = { data: modelResults, validation: v };

    console.log(`\n    ${b("Flash Insights:")}`);
    for (const [modelId, insight] of Object.entries(modelResults.insights)) {
      const icon = { "expected-value":"⚖","base-rates":"📊","sunk-cost":"🕳","bayesian":"🔄","survivorship":"👻","kelly":"🎯","inversion":"🔃","opp-cost":"↔" }[modelId] || "◈";
      console.log(`    ${icon} ${C.cyan}${modelId.padEnd(18)}${C.reset} ${insight}`);
    }
    const verdictColor = { Proceed: C.green, Avoid: C.red, Delay: C.blue }[modelResults.verdict] || C.yellow;
    console.log(`\n    ${b("Preliminary Verdict:")} ${verdictColor}${b(modelResults.verdict)}${C.reset}`);
  } catch (e) {
    console.log(r(`✗ ERROR: ${e.message}`));
    result.failed++; result.errors.push(`models: ${e.message}`);
    result.stages.models = { error: e.message };
    modelResults = { insights: {}, verdict: "Delay" };
  }

  // ── Stage 3 ────────────────────────────────────────────────────────────────
  section("Stage 3 — Decision Memo");
  try {
    process.stdout.write("    Generating memo… ");
    const memo = await runMemo(scenario, intake, modelResults);
    const v    = validateMemo(memo);
    if (v.pass) {
      console.log(g("✓ PASS"));
      result.passed++;
    } else {
      console.log(y(`⚠ ISSUES  (${v.issues.join(" | ")})`));
      result.failed++;
    }
    result.stages.memo = { data: memo, validation: v };

    const recColor = { Proceed: C.green, Avoid: C.red, Delay: C.blue }[memo.recommendation] || C.yellow;
    console.log();
    printKV("Recommendation", `${recColor}${b(memo.recommendation)}${C.reset} — ${memo.confidence} confidence, ${memo.bet_size} bet`);
    printKV("Headline",       memo.headline);
    printKV("Why",            memo.why);
    printKV("Biggest Risk",   memo.biggest_risk);
    printKV("Next Action",    memo.next_action);
    console.log(`\n    ${b("Key Assumptions:")}`);
    memo.key_assumptions?.forEach((a, i) => console.log(`      ${i + 1}. ${a}`));
    console.log(`\n    ${b("What Changes This:")}`);
    memo.disconfirming?.forEach((d_, i) => console.log(`      ${i + 1}. ${d_}`));
  } catch (e) {
    console.log(r(`✗ ERROR: ${e.message}`));
    result.failed++; result.errors.push(`memo: ${e.message}`);
    result.stages.memo = { error: e.message };
  }

  // ── Summary ────────────────────────────────────────────────────────────────
  result.durationMs = Date.now() - start;
  const total3 = result.passed + result.failed;
  const status  = result.failed === 0 ? g("ALL PASS") : result.passed > 0 ? y("PARTIAL") : r("FAILED");
  console.log(`\n  ${b("Result:")} ${status}  (${result.passed}/${total3} stages)  ${d(`${(result.durationMs / 1000).toFixed(1)}s`)}`);

  return result;
}

// ── Main runner ───────────────────────────────────────────────────────────────
async function main() {
  const totalStart = Date.now();

  console.clear();
  console.log(`\n${C.bold}${C.cyan}
╔══════════════════════════════════════════════════════════════╗
║           BeLessStupid — End-to-End Test Suite               ║
║           6 scenarios  ×  3 stages  =  18 checks             ║
╚══════════════════════════════════════════════════════════════╝${C.reset}`);
  console.log(`  ${d("Model: claude-sonnet-4-20250514")}`);
  console.log(`  ${d(`Started: ${new Date().toLocaleString()}`)}\n`);

  const allResults = [];
  let totalPassed  = 0;
  let totalFailed  = 0;

  for (let i = 0; i < SCENARIOS.length; i++) {
    const result = await runScenario(SCENARIOS[i], i + 1, SCENARIOS.length);
    allResults.push(result);
    totalPassed += result.passed;
    totalFailed += result.failed;
  }

  // ── Final summary ──────────────────────────────────────────────────────────
  const elapsed  = ((Date.now() - totalStart) / 1000).toFixed(1);
  const allPass  = totalFailed === 0;
  const line     = "═".repeat(62);

  console.log(`\n\n${C.bold}${C.cyan}╔${line}╗${C.reset}`);
  console.log(`${C.bold}${C.cyan}║  FINAL RESULTS${C.reset}${C.bold}${C.cyan}${" ".repeat(47)}║${C.reset}`);
  console.log(`${C.bold}${C.cyan}╚${line}╝${C.reset}\n`);

  // Per-scenario table
  console.log(`  ${"Scenario".padEnd(40)} ${"Stages".padEnd(10)} ${"Time".padEnd(8)} Status`);
  console.log(`  ${"─".repeat(70)}`);
  allResults.forEach(r_ => {
    const status  = r_.failed === 0 ? g("✓ PASS") : r_.passed > 0 ? y("△ PARTIAL") : r("✗ FAIL");
    const stages  = `${r_.passed}/${r_.passed + r_.failed}`;
    const time    = `${(r_.durationMs / 1000).toFixed(1)}s`;
    const label   = r_.label.length > 38 ? r_.label.slice(0, 36) + "…" : r_.label;
    console.log(`  ${label.padEnd(40)} ${stages.padEnd(10)} ${time.padEnd(8)} ${status}`);
  });

  console.log(`\n  ${"─".repeat(70)}`);
  console.log(`  ${"TOTAL".padEnd(40)} ${`${totalPassed}/${totalPassed + totalFailed}`.padEnd(10)} ${elapsed}s    ${allPass ? g("ALL PASS ✓") : r(`${totalFailed} FAILED`)}`);

  // Quality observations
  console.log(`\n\n  ${b("Quality Observations:")}`);
  allResults.forEach(r_ => {
    if (r_.stages.memo?.data) {
      const rec = r_.stages.memo.data.recommendation;
      const conf = r_.stages.memo.data.confidence;
      const recColor = { Proceed: C.green, Avoid: C.red, Delay: C.blue }[rec] || C.yellow;
      console.log(`  ${r_.category.padEnd(25)} → ${recColor}${rec.padEnd(22)}${C.reset} (${conf} confidence)`);
    }
  });

  // Save full results JSON
  const outFile = path.join(RESULTS_DIR, `results-${Date.now()}.json`);
  fs.writeFileSync(outFile, JSON.stringify({
    runAt:   new Date().toISOString(),
    elapsed: `${elapsed}s`,
    summary: { totalPassed, totalFailed, scenarios: SCENARIOS.length },
    results: allResults,
  }, null, 2));
  console.log(`\n  ${d(`Full results saved to: ${outFile}`)}`);
  console.log(`  ${d(`Run again: node test-scenarios.js`)}\n`);

  process.exit(totalFailed > 0 ? 1 : 0);
}

main().catch(e => {
  console.error(r(`\nFatal error: ${e.message}`));
  process.exit(1);
});
