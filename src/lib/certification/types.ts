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
  /** 2nd vertical delimiter — end of the analysis window (post = dimmed context). */
  decisionWindowEnd?: number;
  /** Technical annotations rendered on the chart (break / retest / zone). */
  techAnnotations?: TechAnnotation[];
  /** Optional trend channel (two parallel lines across the reveal). */
  channel?: { fromIndex: number; toIndex: number; slope: number; halfWidth: number };
}

export type TechAnnotationKind = "break" | "retest" | "zone";

export interface TechAnnotation {
  kind: TechAnnotationKind;
  label: string;
  tone?: "primary" | "danger" | "muted" | "bull" | "bear";
  atIndex?: number; // for break / retest
  fromIndex?: number; // for zone
  toIndex?: number; // for zone
}

export interface McqOption {
  label: string;
  direction: Direction;
  /** Optional per-option debrief: why this answer is wrong / why it is best. */
  explain?: string;
}

/** Where a series/indicator sits in the economic cycle (desk taxonomy). */
export type CycleClass = "lead" | "coin" | "lag";

/** Print vs consensus classification for data-release cards. */
export type PrintVerdict = "beat" | "miss" | "inline";

/** A single labelled statistic shown in the analyst grid. */
export interface CardStat {
  label: string;
  value: string;
  tone?: Direction;
}

/** A named timeframe with its own price/level series (3M · 1M · Daily · Zoom). */
export interface CardTimeframe {
  label: string; // "3M" · "1M" · "Daily" · "Zoom"
  series: number[]; // ordered oldest → newest
  /** Optional horizontal reference levels drawn on the chart. */
  levels?: { value: number; label: string; tone?: Direction }[];
}

/**
 * Graphical dataset powering the analyst (Premium) Context Card.
 * Raw data only — never a written conclusion. The learner deduces.
 */
export interface ContextCardDataset {
  /** Sparkline series shown on the rail card (oldest → newest). */
  spark: number[];
  sparkTone?: Direction;
  /** Compact delta chip on the rail card, e.g. "+18 bps 5j". */
  deltaLabel?: string;
  deltaTone?: Direction;
  /** Cycle taxonomy badge (LEAD / COIN / LAG). */
  cycle?: CycleClass;
  /** Print verdict badge (BEAT / MISS / INLINE) for release cards. */
  verdict?: PrintVerdict;
  /** Actual / consensus / previous for release cards. */
  actual?: string;
  consensus?: string;
  previous?: string;
  /** Unit shown on the analyst chart axis, e.g. "%", "bps", "index". */
  unit?: string;
  /** Multi-timeframe series (analyst chart). First entry is the default view. */
  timeframes?: CardTimeframe[];
  /** Labelled statistics grid (spreads, ratios, extremes…). */
  stats?: CardStat[];
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
  /** Graphical dataset for analyst-mode (Premium) rendering. */
  dataset?: ContextCardDataset;
}

/** Presentation mode for a Context Card. */
export type CardRenderMode = "guided" | "analyst";

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
