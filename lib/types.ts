// lib/types.ts

export type ComplexityLevel = "simple" | "medium" | "advanced";

export type ModelId =
  | "expected-value"
  | "base-rates"
  | "sunk-cost"
  | "bayesian"
  | "survivorship"
  | "kelly"
  | "inversion"
  | "opp-cost";

export type CategoryId =
  | "new-business"
  | "real-estate"
  | "career-move"
  | "new-venture"
  | "early-retire"
  | "generic";

export type AuditMode = "quick" | "guided";

export type RecommendationType =
  | "Proceed"
  | "Avoid"
  | "Delay"
  | "Run experiment first"
  | "Partial commit"
  | "Exit";

export type ConfidenceLevel = "Low" | "Medium" | "High";
export type BetSize = "None" | "Small" | "Medium" | "Large" | "Staged";
export type ModelStatus = "pass" | "warn" | "fail" | "skipped";

// ── INTAKE ────────────────────────────────────────────────────────────────────
export interface IntakeAnswers {
  mode: AuditMode;
  decision: string;
  all_options?: string;
  gut_choice?: string;
  gut_conf?: string;
  stakes?: string;
  emotion_now?: string;
  fear?: string;
  assumptions?: string;
  worst_case?: string;
  raw_text?: string; // quick mode only
}

// ── MODEL ─────────────────────────────────────────────────────────────────────
export interface ModelQuestion {
  id: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
}

export interface ModelExplainer {
  plainName: string;
  what: string;
  example: string;
  why: string;
}

export interface Model {
  id: ModelId;
  name: string;
  icon: string;
  shortCode: string;
  color: string;
  complexity: ComplexityLevel;
  description: string;
  contextNote: string | null;
  explainer: ModelExplainer;
  questions: ModelQuestion[];
  flashPrompt: string;
}

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  color: string;   // text / border accent colour
  bg: string;      // tinted background for cards and tags
  border: string;  // tinted border colour
  tagline: string;
}

// ── MEMO ──────────────────────────────────────────────────────────────────────
export interface ModelFlag {
  status: ModelStatus;
  note: string;
}

export interface DecisionMemo {
  recommendation: RecommendationType;
  confidence: ConfidenceLevel;
  bet_size: BetSize;
  headline: string;
  why: string;
  key_assumptions: string[];
  disconfirming: string[];
  biggest_risk: string;
  next_action: string;
  model_flags: Partial<Record<ModelId, ModelFlag>>;
}

// ── AUDIT SESSION (full state passed through the app) ─────────────────────────
export interface AuditSession {
  category?: Category;
  intakeAns?: IntakeAnswers;
  selectedModels?: Model[];
  modelAns?: Record<ModelId, Record<string, string>>;
  insights?: Partial<Record<ModelId, string>>;
  memo?: DecisionMemo;
}

// ── SUPABASE DB TYPES ─────────────────────────────────────────────────────────
export interface DbDecision {
  id: string;
  user_id: string;
  category_id: CategoryId;
  category_label: string;
  mode: AuditMode;
  decision_text: string;
  intake_answers: IntakeAnswers;
  selected_model_ids: ModelId[];
  model_answers: Record<ModelId, Record<string, string>>;
  insights: Partial<Record<ModelId, string>>;
  recommendation: RecommendationType | null;
  confidence: ConfidenceLevel | null;
  bet_size: BetSize | null;
  memo: DecisionMemo | null;
  created_at: string;
  updated_at: string;
}
