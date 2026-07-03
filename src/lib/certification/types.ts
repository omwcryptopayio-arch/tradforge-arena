// TradForge — Certification domain types (mock data layer)

export type Level = "standard" | "high" | "premium";

export type Direction = "bull" | "neutral" | "bear";

export type CardCategory =
  | "fundamentals"
  | "technicals"
  | "news"
  | "macro"
  | "intermarket"
  | "centralbank"
  | "geopolitics";

/** Chart / candle replay specification (drives CandleChart, ref: market-data.ts). */
export interface ChartSpec {
  symbol: string; // "EUR/USD"
  period: string; // "Janvier 2024 · H4"
  seed: number;
  candles: number; // total candle count
  basePrice: number;
  volatility: number; // relative amplitude of the random walk
  drift: number; // per-candle pre-event drift (relative)
  shockAt: number; // index of the decision / economic-release candle (pauseAt)
  shockMagnitude: number; // signed relative post-event move
  precision: number; // price decimals
  support?: number; // absolute price
  resistance?: number; // absolute price
  supportLabel?: string;
  resistanceLabel?: string;
  eventLabel: string; // vertical decision line annotation
}

export interface McqOption {
  label: string;
  direction: Direction;
  /** Optional per-option debrief: why this answer is wrong / why it is best. */
  explain?: string;
}

/** Reusable context card template (catalog). Relevance is per-scenario, not here. */
export interface ContextCardTemplate {
  id: string;
  ticker: string;
  category: CardCategory;
  title: string;
  summary: string;
  metric?: string;
  metricTone?: Direction;
  detail: { heading: string; body: string }[];
}

/** Binding of a catalog card into a scenario, with internal relevance. */
export interface ScenarioCardRef {
  cardId: string;
  /** 0-100 internal relevance index (invisible to the user). */
  relevance: number;
}

export interface ScenarioSpec {
  id: string;
  level: Level;
  index: number; // 1..10 within the level
  title: string;
  symbol: string;
  brief: string;
  chart: ChartSpec;
  correctDirection: Direction;
  rationale: string;
  outcome: string;
  /** Debrief "Réponse rapide" — one-line institutional verdict (optional). */
  quickTake?: string;
  /** Debrief "Key Learning" — transferable takeaway (optional). */
  keyLearning?: string;
  /** Optional macro-impact bullets for the "Impact macro" debrief block. */
  macroImpact?: string[];
  // Standard (MCQ engine)
  question?: string;
  options?: McqOption[];
  correctIndex?: number;
  // High / Premium (macro workspace)
  cards?: ScenarioCardRef[];
}

export const DIRECTION_LABELS: Record<Direction, string> = {
  bull: "Bullish",
  neutral: "Neutral",
  bear: "Bearish",
};

export const CATEGORY_LABELS: Record<CardCategory, string> = {
  fundamentals: "fundamentals",
  technicals: "technicals",
  news: "news",
  macro: "macro",
  intermarket: "intermarket",
  centralbank: "central bank",
  geopolitics: "geopolitics",
};

export const LEVEL_META: Record<
  Level,
  { name: string; stars: number; tagline: string; blurb: string }
> = {
  standard: {
    name: "Standard",
    stars: 2,
    tagline: "MCQ · Replay scénarisé",
    blurb:
      "Lis le contexte, laisse le replay se dérouler jusqu'à la zone de décision, puis choisis le biais le plus cohérent.",
  },
  high: {
    name: "High",
    stars: 4,
    tagline: "Macro Desk · Context Cards",
    blurb:
      "Explore librement les Context Cards, distingue le signal du bruit, puis engage ta décision directionnelle.",
  },
  premium: {
    name: "Premium",
    stars: 5,
    tagline: "Reasoning · Indice de Cohérence",
    blurb:
      "Aucune indication. Décide, puis justifie ton raisonnement carte par carte. Ta cohérence est mesurée.",
  },
};
