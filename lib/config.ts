// lib/config.ts
// Single source of truth for all models, categories and complexity metadata.
// Adding a new model = add one entry to MODELS. Nothing else changes.

import type { Model, Category, CategoryId, ModelId } from "./types";

// ── CATEGORIES ────────────────────────────────────────────────────────────────
export const CATEGORIES: Category[] = [
  { id: "new-business", label: "Buying a Business",  icon: "🏢", color: "#B5720A", bg: "#FEF3E2", border: "#F5C97A", tagline: "Acquisition, franchise or buy-in" },
  { id: "real-estate",  label: "Real Estate",         icon: "🏠", color: "#1D5FAD", bg: "#EFF6FF", border: "#BFDBFE", tagline: "Buy, sell, invest or develop" },
  { id: "career-move",  label: "Career Move",         icon: "🧭", color: "#16783A", bg: "#F0FDF4", border: "#86EFAC", tagline: "Job change, pivot or promotion" },
  { id: "new-venture",  label: "Starting a Venture",  icon: "🚀", color: "#6D28D9", bg: "#F5F3FF", border: "#C4B5FD", tagline: "Startup, business or practice" },
  { id: "early-retire", label: "Early Retirement",    icon: "🌅", color: "#C05020", bg: "#FFF7ED", border: "#FED7AA", tagline: "FIRE, semi-retirement or redesign" },
  { id: "generic",      label: "Other Decision",      icon: "◈",  color: "#6B6762", bg: "#F1F0EC", border: "#E6E4DF", tagline: "Relationship, health, lifestyle" },
];

// ── MANDATORY MODELS PER CATEGORY ────────────────────────────────────────────
export const CATEGORY_MANDATORY: Record<CategoryId, ModelId[]> = {
  "new-business": ["expected-value", "inversion", "opp-cost", "sunk-cost"],
  "real-estate":  ["expected-value", "inversion", "opp-cost", "base-rates", "kelly"],
  "career-move":  ["expected-value", "inversion", "opp-cost", "sunk-cost"],
  "new-venture":  ["expected-value", "inversion", "opp-cost", "sunk-cost", "base-rates", "survivorship"],
  "early-retire": ["expected-value", "inversion", "opp-cost", "kelly"],
  "generic":      ["expected-value", "inversion", "opp-cost"],
};

// ── MODEL REGISTRY ────────────────────────────────────────────────────────────
export const MODELS: Model[] = [
  {
    id: "expected-value",
    name: "Expected Value",
    icon: "⚖",
    shortCode: "EV",
    color: "#B5720A",
    complexity: "medium",
    description: "Forces explicit odds and outcomes. Kills vague hope.",
    contextNote: null,
    explainer: {
      plainName: "What's it worth on average?",
      what: "List possible outcomes, estimate how likely each is, multiply probability × payoff. Forces vague hope into explicit numbers.",
      example: "30% chance of ₹10L gain, 70% chance of ₹2L loss. EV = +₹1.6L. Positive — but size the bet carefully.",
      why: "Most people decide on the best-case story. EV forces all outcomes into the calculation — including the ugly ones.",
    },
    questions: [
      { id: "outcomes", label: "List 2–4 plausible outcomes (one per line)",           type: "textarea", placeholder: "Best case: ...\nBase case: ...\nWorst case: ..." },
      { id: "probs",    label: "Rough probability of each (should total ~100%)",        type: "text",     placeholder: "e.g. 20% / 50% / 30%" },
      { id: "upside",   label: "If best case — what exactly do you gain?",              type: "textarea", placeholder: "Financial, time, freedom, optionality..." },
      { id: "downside", label: "If worst case — what exactly do you lose?",             type: "textarea", placeholder: "Money, time, relationships, reputation..." },
    ],
    flashPrompt: "State ONE key finding about the odds or payoff in max 12 words. Start with a number if possible.",
  },
  {
    id: "base-rates",
    name: "Base Rates",
    icon: "📊",
    shortCode: "BR",
    color: "#1D5FAD",
    complexity: "medium",
    description: "What usually happens to people like you?",
    contextNote: null,
    explainer: {
      plainName: "What usually happens to people like you?",
      what: "Ignore your story. Ask: what percentage of people who made this type of decision actually succeeded? Your confidence must account for the historical graveyard.",
      example: "You feel 70% confident. Base rate: ~60% of similar decisions fail within 3 years. Your 'edge' must explain a large gap.",
      why: "Your optimism is real, but so is the graveyard of people who also felt special. Base rates ground you in reality.",
    },
    questions: [
      { id: "ref_class", label: "Closest reference class? (people like you doing this)",             type: "text",     placeholder: "e.g. First-time founders in India building B2B SaaS" },
      { id: "hist_rate", label: "How often does this type of thing succeed historically?",            type: "text",     placeholder: "Roughly 1 in 10 / ~40% / I honestly don't know" },
      { id: "your_conf", label: "How confident are YOU this succeeds? (0–100%)",                     type: "text",     placeholder: "e.g. 65%" },
      { id: "edge",      label: "What makes your case genuinely different from the base rate?",      type: "textarea", placeholder: "Unlike most, I have: X advantage, Y relationship..." },
    ],
    flashPrompt: "State ONE finding about the gap between user confidence and historical base rate. Max 12 words.",
  },
  {
    id: "sunk-cost",
    name: "Sunk Cost",
    icon: "🕳",
    shortCode: "SC",
    color: "#6D28D9",
    complexity: "simple",
    description: "Are you staying because it's good — or because you've already paid?",
    contextNote: null,
    explainer: {
      plainName: "Are you staying because it's good — or because you've already paid?",
      what: "Mentally erase everything already invested. Starting fresh today with zero history — would you still choose this path?",
      example: "3 years building a failing startup. You stay because 'I've given too much to quit.' But those 3 years are gone regardless of what you do next.",
      why: "Past investment is gone whether you continue or not. The only question is: what's the best use of your next year?",
    },
    questions: [
      { id: "invested",    label: "What have you already put in? (time, money, identity)",                             type: "textarea", placeholder: "3 years, ₹40L, my professional reputation..." },
      { id: "fresh_start", label: "Starting completely fresh today — would you still choose this?",                    type: "textarea", placeholder: "Honestly: Yes / No / Maybe, because..." },
      { id: "real_reason", label: "Continuing because it's good, or because stopping feels like failure?",            type: "text",     placeholder: "Be brutally honest..." },
    ],
    flashPrompt: "State ONE finding about whether past investment is contaminating this decision. Max 12 words.",
  },
  {
    id: "bayesian",
    name: "Bayesian Update",
    icon: "🔄",
    shortCode: "BU",
    color: "#16783A",
    complexity: "advanced",
    description: "How much should new information actually change your mind?",
    contextNote: "Most useful when something significant has changed recently — new data, a failed pilot, a market shift.",
    explainer: {
      plainName: "How much should new information change your mind?",
      what: "What did you believe before? What new evidence has arrived? By how much should confidence shift — and in which direction?",
      example: "You believed 80% your product would sell. Early tests show weak interest. Should you now believe 10% or 60%? Bayesian thinking gives a principled answer.",
      why: "Most people either ignore new evidence (stubborn) or completely reverse on one bad result (reactive). Calibration sits between the two.",
    },
    questions: [
      { id: "prior",    label: "What was your original belief before recent new information?",                      type: "text",     placeholder: "I originally believed this would work because..." },
      { id: "evidence", label: "What new signals or events have arrived recently?",                                 type: "textarea", placeholder: "Market shifted, pilot failed, competitor raised funding..." },
      { id: "update",   label: "How much has this changed your confidence — and in which direction?",              type: "textarea", placeholder: "Moved me from ~75% to ~40% / reinforced from 50% to 70%..." },
    ],
    flashPrompt: "State ONE finding about whether the user is updating their beliefs correctly. Max 12 words.",
  },
  {
    id: "survivorship",
    name: "Survivorship Bias",
    icon: "👻",
    shortCode: "SB",
    color: "#C05020",
    complexity: "medium",
    description: "Who's missing from the stories you're hearing?",
    contextNote: null,
    explainer: {
      plainName: "Who's missing from the stories you're hearing?",
      what: "Are the examples influencing your decision entirely made up of visible winners — while the much larger failure group stays invisible?",
      example: "Inspired by 3 founders who built unicorns. But 10,000 others failed quietly and you never heard about them.",
      why: "Success is loud. Failure is silent. Deciding based on visible winners systematically overstates your real odds.",
    },
    questions: [
      { id: "examples",    label: "Which success stories are shaping your thinking?",                         type: "textarea", placeholder: "My friend who did X, that founder who dropped out..." },
      { id: "failures",    label: "Who tried this and failed — and roughly how many were there?",             type: "textarea", placeholder: "Who are the invisible failures in this story?" },
      { id: "denominator", label: "Are you only seeing winners because losers stay quiet?",                   type: "text",     placeholder: "Yes / No / Partially — explain..." },
    ],
    flashPrompt: "State ONE finding about invisible failures or sample bias. Max 12 words.",
  },
  {
    id: "kelly",
    name: "Kelly Criterion",
    icon: "🎯",
    shortCode: "KS",
    color: "#16783A",
    complexity: "advanced",
    description: "Even a great bet can ruin you if oversized.",
    contextNote: "Especially important on irreversible or large financial commitments — prevents catastrophic over-commitment.",
    explainer: {
      plainName: "How big should this bet actually be?",
      what: "Even if a decision is positive EV, what fraction of your total resources should you commit? Overbetting ruins you even when you're right about direction.",
      example: "70% confident an investment will 2x. Kelly says don't put 100% in — commit proportional to your edge. Preserve capital for future rounds.",
      why: "Ruin is permanent. A 90% loss requires a 900% gain just to break even. Size bets to survive being wrong.",
    },
    questions: [
      { id: "commitment", label: "What % of your total resources (money, time, career capital) does this consume?", type: "text",     placeholder: "e.g. 80% of savings, 100% of working hours" },
      { id: "reversible", label: "How reversible is this decision if it goes wrong?",                               type: "text",     placeholder: "Fully / Mostly / Partially / Irreversible" },
      { id: "recovery",   label: "If completely wrong — describe your specific recovery path.",                     type: "textarea", placeholder: "I still have X. Could do Y. Would take Z months..." },
    ],
    flashPrompt: "State ONE finding about bet sizing or risk of ruin. Max 12 words.",
  },
  {
    id: "inversion",
    name: "Inversion",
    icon: "🔃",
    shortCode: "IN",
    color: "#C0392B",
    complexity: "simple",
    description: "How do you guarantee this fails?",
    contextNote: null,
    explainer: {
      plainName: "How do you guarantee this fails?",
      what: "Instead of 'how do I succeed?' ask 'how could this go catastrophically wrong?' Then build a plan to avoid those paths.",
      example: "Instead of planning how to make the startup succeed, list every way it definitely fails. You get a concrete avoidance checklist before committing.",
      why: "Most planning is optimism in disguise. Inversion forces you to take failure seriously before you've spent time and money.",
    },
    questions: [
      { id: "fail_paths", label: "List every realistic way this decision could fail badly.",            type: "textarea", placeholder: "It fails if:\n- The market doesn't exist\n- I run out of money in month 6..." },
      { id: "stupid_2yr", label: "What would make this obviously stupid in hindsight, 2 years later?",  type: "textarea", placeholder: "If X happens I'll have clearly been wrong about..." },
      { id: "avoidable",  label: "What are the 2–3 most preventable mistakes here?",                   type: "textarea", placeholder: "1. Committing before validating demand\n2. Wrong co-founder..." },
    ],
    flashPrompt: "State ONE critical failure mode or avoidable mistake. Max 12 words.",
  },
  {
    id: "opp-cost",
    name: "Opportunity Cost",
    icon: "↔",
    shortCode: "OC",
    color: "#6B6762",
    complexity: "simple",
    description: "What's the best thing you're giving up?",
    contextNote: null,
    explainer: {
      plainName: "What's the best thing you're giving up?",
      what: "What are you NOT doing with your time, energy, and capital by choosing this path? Every yes is a hundred implicit nos.",
      example: "₹50L in rental at 4% yield. Opportunity cost: index funds return ~12% historically. Good deal — but is it the best use of capital?",
      why: "The right question isn't 'is this good?' but 'is this better than my very best alternative?' Most people skip the comparison.",
    },
    questions: [
      { id: "next_best",  label: "What is the single best alternative use of this time, money, and energy?", type: "textarea", placeholder: "Instead of this, the best thing I could do is..." },
      { id: "sacrifice",  label: "What specifically are you giving up by committing to this path?",          type: "textarea", placeholder: "Freedom, income, opportunities, relationships..." },
      { id: "comparison", label: "Compared to that best alternative — is this still clearly better?",       type: "text",     placeholder: "Yes / No / Marginal — and why..." },
    ],
    flashPrompt: "State ONE finding about what is being sacrificed or foregone. Max 12 words.",
  },
];

// ── COMPLEXITY METADATA ───────────────────────────────────────────────────────
export const COMPLEXITY_META = {
  simple:   { label: "Simple",   dots: 1, color: "#16783A", tip: "Intuitive — takes 2–3 min." },
  medium:   { label: "Medium",   dots: 2, color: "#B5720A", tip: "Some estimation required — takes 3–5 min." },
  advanced: { label: "Advanced", dots: 3, color: "#C0392B", tip: "Quantitative reasoning — takes 5–8 min." },
};

// ── HELPERS ───────────────────────────────────────────────────────────────────
export const getModel    = (id: ModelId)    => MODELS.find(m => m.id === id)!;
export const getCategory = (id: CategoryId) => CATEGORIES.find(c => c.id === id)!;
