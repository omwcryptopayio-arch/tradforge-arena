// TradForge — deterministic graphical datasets for Context Cards (analyst mode).
// Same seed → same series, so Premium desk cards are stable across renders.
// Raw data only: these datasets never encode the scenario conclusion.

import type {
  CardStat,
  CardTimeframe,
  ContextCardDataset,
  CycleClass,
  Direction,
  PrintVerdict,
} from "./types";

/** Mulberry32 — tiny deterministic PRNG (mirrors market-data.ts). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic random-walk series around `base` with a directional `trend`. */
function walk(seed: number, n: number, base: number, trend: number, vol: number): number[] {
  const rng = mulberry32(seed);
  const out: number[] = [];
  let v = base;
  for (let i = 0; i < n; i++) {
    const noise = (rng() - 0.5) * 2 * vol;
    v = v + trend + noise;
    out.push(Math.round(v * 1000) / 1000);
  }
  return out;
}

interface DatasetConfig {
  seed: number;
  base: number;
  unit: string;
  /** overall trend per point (signed). */
  trend: number;
  vol: number;
  cycle?: CycleClass;
  verdict?: PrintVerdict;
  actual?: string;
  consensus?: string;
  previous?: string;
  deltaLabel?: string;
  deltaTone?: Direction;
  sparkTone?: Direction;
  levels?: { value: number; label: string; tone?: Direction }[];
  stats?: CardStat[];
}

/** Builds a full multi-timeframe dataset from a compact config. */
function buildDataset(cfg: DatasetConfig): ContextCardDataset {
  const { seed, base, trend, vol } = cfg;
  // Each timeframe uses a slice of the same underlying trajectory for coherence.
  const daily = walk(seed, 30, base, trend, vol);
  const oneM = walk(seed + 1, 22, base - trend * 22, trend * 1.15, vol * 1.25);
  const threeM = walk(seed + 2, 40, base - trend * 60, trend * 0.9, vol * 1.6);
  const zoom = daily.slice(-10);

  const timeframes: CardTimeframe[] = [
    { label: "3M", series: threeM, levels: cfg.levels },
    { label: "1M", series: oneM, levels: cfg.levels },
    { label: "Daily", series: daily, levels: cfg.levels },
    { label: "Zoom", series: zoom, levels: cfg.levels },
  ];

  return {
    spark: daily.slice(-14),
    sparkTone: cfg.sparkTone,
    deltaLabel: cfg.deltaLabel,
    deltaTone: cfg.deltaTone,
    cycle: cfg.cycle,
    verdict: cfg.verdict,
    actual: cfg.actual,
    consensus: cfg.consensus,
    previous: cfg.previous,
    unit: cfg.unit,
    timeframes,
    stats: cfg.stats,
  };
}

/** Per-card dataset config. Keyed by ContextCardTemplate.id. */
const CONFIG: Record<string, DatasetConfig> = {
  dxy: {
    seed: 4101, base: 104.2, unit: "index", trend: 0.09, vol: 0.18, cycle: "coin",
    deltaLabel: "+0.9% 5j", deltaTone: "bull", sparkTone: "bull",
    levels: [{ value: 105.0, label: "Résistance", tone: "bear" }, { value: 103.4, label: "Support", tone: "bull" }],
    stats: [
      { label: "50-DMA", value: "103.6" }, { label: "200-DMA", value: "104.8" },
      { label: "RSI 14", value: "61", tone: "bull" }, { label: "Range 1M", value: "102.9 – 104.6" },
    ],
  },
  us10y: {
    seed: 4102, base: 4.38, unit: "%", trend: 0.012, vol: 0.03, cycle: "lead",
    actual: "4.62%", consensus: "4.50%", previous: "4.44%", verdict: "beat",
    deltaLabel: "+18 bps 5j", deltaTone: "bull", sparkTone: "bull",
    levels: [{ value: 4.7, label: "Pic cycle", tone: "bear" }, { value: 4.2, label: "Plancher", tone: "bull" }],
    stats: [
      { label: "5j", value: "+18 bps", tone: "bull" }, { label: "1M", value: "+34 bps", tone: "bull" },
      { label: "Real 10Y", value: "1.98%" }, { label: "2s10s", value: "-38 bps", tone: "bear" },
    ],
  },
  fed: {
    seed: 4103, base: 5.25, unit: "%", trend: 0.0, vol: 0.01, cycle: "lag",
    actual: "5.50%", consensus: "5.50%", previous: "5.25%", verdict: "inline",
    deltaLabel: "+25 bps", deltaTone: "bull", sparkTone: "neutral",
    stats: [
      { label: "Taux directeur", value: "5.50%" }, { label: "Dots 2025", value: "4.60%" },
      { label: "Cuts 12M (mkt)", value: "-75 bps", tone: "bear" }, { label: "Bilan", value: "-QT $95bn/m" },
    ],
  },
  cpi: {
    seed: 4104, base: 3.4, unit: "% y/y", trend: -0.03, vol: 0.06, cycle: "lag",
    actual: "+0.4% m/m", consensus: "+0.3% m/m", previous: "+0.3% m/m", verdict: "beat",
    deltaLabel: "surprise +0.1", deltaTone: "bull", sparkTone: "bear",
    stats: [
      { label: "Headline y/y", value: "3.4%" }, { label: "Core y/y", value: "3.8%", tone: "bull" },
      { label: "Core m/m", value: "0.4%", tone: "bull" }, { label: "Super-core", value: "4.3%", tone: "bull" },
    ],
  },
  nfp: {
    seed: 4105, base: 190, unit: "k", trend: 3.0, vol: 28, cycle: "coin",
    actual: "+256k", consensus: "+180k", previous: "+165k", verdict: "beat",
    deltaLabel: "beat +76k", deltaTone: "bull", sparkTone: "bull",
    stats: [
      { label: "NFP", value: "+256k", tone: "bull" }, { label: "Unemp.", value: "3.7%" },
      { label: "AHE m/m", value: "+0.4%", tone: "bull" }, { label: "Particip.", value: "62.7%" },
    ],
  },
  ecb: {
    seed: 4106, base: 4.0, unit: "%", trend: -0.004, vol: 0.01, cycle: "lag",
    actual: "4.00%", consensus: "4.00%", previous: "4.00%", verdict: "inline",
    deltaLabel: "hold", deltaTone: "neutral", sparkTone: "bear",
    stats: [
      { label: "Depo rate", value: "4.00%" }, { label: "Cuts 12M (mkt)", value: "-90 bps", tone: "bear" },
      { label: "Écart Fed", value: "-150 bps", tone: "bear" }, { label: "PMI zone €", value: "47.9", tone: "bear" },
    ],
  },
  oil: {
    seed: 4107, base: 78.5, unit: "$/bbl", trend: 0.22, vol: 1.1, cycle: "lead",
    deltaLabel: "+3.1% 5j", deltaTone: "neutral", sparkTone: "bull",
    levels: [{ value: 84, label: "Résistance", tone: "bear" }, { value: 74, label: "Support", tone: "bull" }],
    stats: [
      { label: "WTI", value: "$81.4" }, { label: "Brent", value: "$86.1" },
      { label: "Spread", value: "$4.7" }, { label: "Backwardation", value: "oui", tone: "bull" },
    ],
  },
  gold: {
    seed: 4108, base: 2020, unit: "$/oz", trend: -1.4, vol: 8, cycle: "lag",
    deltaLabel: "-0.6% 5j", deltaTone: "bear", sparkTone: "bear",
    levels: [{ value: 2050, label: "ATH zone", tone: "bear" }, { value: 1980, label: "Support", tone: "bull" }],
    stats: [
      { label: "Spot", value: "$1 998" }, { label: "vs Real 10Y", value: "inverse", tone: "bear" },
      { label: "ETF flows", value: "-2.1t", tone: "bear" }, { label: "Vol 30j", value: "12.4%" },
    ],
  },
  vix: {
    seed: 4109, base: 16, unit: "index", trend: 0.12, vol: 1.4, cycle: "lead",
    deltaLabel: "+2.3 5j", deltaTone: "bear", sparkTone: "bear",
    levels: [{ value: 25, label: "Stress", tone: "bear" }, { value: 13, label: "Complaisance", tone: "bull" }],
    stats: [
      { label: "VIX", value: "18.4" }, { label: "VIX 3M", value: "19.1" },
      { label: "Term structure", value: "contango" }, { label: "Skew", value: "142" },
    ],
  },
  calendar: {
    seed: 4110, base: 3, unit: "events", trend: 0, vol: 0.6, cycle: "lead",
    deltaLabel: "3 tier-1", deltaTone: "neutral", sparkTone: "neutral",
    stats: [
      { label: "CPI US", value: "J+1" }, { label: "FOMC", value: "J+3" },
      { label: "NFP", value: "J+8" }, { label: "Impact", value: "élevé", tone: "bull" },
    ],
  },
  news: {
    seed: 4111, base: 50, unit: "flow", trend: 0.4, vol: 6, cycle: "lead",
    deltaLabel: "Live", deltaTone: "neutral", sparkTone: "neutral",
    stats: [
      { label: "Headlines/h", value: "42" }, { label: "Sentiment", value: "±0.1" },
      { label: "Sources", value: "conflit" }, { label: "Fiabilité", value: "à valider" },
    ],
  },
  positioning: {
    seed: 4112, base: -30, unit: "k net", trend: -1.8, vol: 4, cycle: "coin",
    deltaLabel: "net short", deltaTone: "bull", sparkTone: "bear",
    stats: [
      { label: "Spéc. net", value: "-62k", tone: "bear" }, { label: "Percentile 3Y", value: "8%", tone: "bull" },
      { label: "Squeeze risk", value: "élevé", tone: "bull" }, { label: "Δ 1 sem.", value: "-9k", tone: "bear" },
    ],
  },
  geopolitics: {
    seed: 4113, base: 40, unit: "index", trend: 1.3, vol: 5, cycle: "lead",
    deltaLabel: "Élevé", deltaTone: "bear", sparkTone: "bear",
    stats: [
      { label: "GPR index", value: "148", tone: "bear" }, { label: "Haven bid", value: "USD/JPY/CHF" },
      { label: "Oil risk prem.", value: "+$4", tone: "bear" }, { label: "Persistance", value: "à surveiller" },
    ],
  },
  earnings: {
    seed: 4114, base: 100, unit: "index", trend: 0.5, vol: 1.6, cycle: "coin",
    actual: "beat 8/8", consensus: "high bar", verdict: "beat",
    deltaLabel: "beat 8/8", deltaTone: "bull", sparkTone: "bull",
    stats: [
      { label: "EPS surprise", value: "+6%", tone: "bull" }, { label: "Rev. surprise", value: "+3%", tone: "bull" },
      { label: "Guidance", value: "clé" }, { label: "Priced-in", value: "élevé", tone: "bear" },
    ],
  },
  datacenter: {
    seed: 4115, base: 100, unit: "index", trend: 1.4, vol: 1.2, cycle: "lag",
    deltaLabel: "+45% YoY", deltaTone: "bull", sparkTone: "bull",
    stats: [
      { label: "Rev. YoY", value: "+45%", tone: "bull" }, { label: "Backlog", value: "record", tone: "bull" },
      { label: "Marge", value: "+310 bps", tone: "bull" }, { label: "Supply", value: "contrainte" },
    ],
  },
  supplychain: {
    seed: 4116, base: 100, unit: "index", trend: -0.9, vol: 1.4, cycle: "coin",
    deltaLabel: "-15%", deltaTone: "bear", sparkTone: "bear",
    stats: [
      { label: "Partenaire", value: "-15%", tone: "bear" }, { label: "Exposition", value: "12% CA" },
      { label: "Contagion", value: "isolée ?" }, { label: "Alternatives", value: "en cours" },
    ],
  },
  competition: {
    seed: 4117, base: 100, unit: "index", trend: -0.2, vol: 1.0, cycle: "coin",
    deltaLabel: "-1.2%", deltaTone: "neutral", sparkTone: "neutral",
    stats: [
      { label: "Pair", value: "-1.2%" }, { label: "Part de marché", value: "+0.8%", tone: "bull" },
      { label: "Momentum rel.", value: "leader" }, { label: "Moat", value: "élargi", tone: "bull" },
    ],
  },
  "technial-structure": {
    seed: 4118, base: 100, unit: "index", trend: 0.1, vol: 1.5, cycle: "coin",
    deltaLabel: "At support", deltaTone: "bull", sparkTone: "bull",
    levels: [{ value: 104, label: "Résistance", tone: "bear" }, { value: 98, label: "Support", tone: "bull" }],
    stats: [
      { label: "Support", value: "tenu", tone: "bull" }, { label: "HTF trend", value: "haussier", tone: "bull" },
      { label: "RSI", value: "48" }, { label: "Structure", value: "HH/HL" },
    ],
  },
  // ── Desk cards (Premium contagion / rates) ──
  bund10y: {
    seed: 4201, base: 2.6, unit: "%", trend: 0.02, vol: 0.03, cycle: "lead",
    actual: "2.85%", consensus: "2.72%", previous: "2.60%", verdict: "beat",
    deltaLabel: "+8 bps 5j", deltaTone: "bull", sparkTone: "bull",
    levels: [{ value: 2.9, label: "Résistance", tone: "bear" }, { value: 2.4, label: "Support", tone: "bull" }],
    stats: [
      { label: "Bund 10Y", value: "2.85%" }, { label: "5j", value: "+8 bps", tone: "bull" },
      { label: "BTP-Bund", value: "+192 bps", tone: "bear" }, { label: "OAT-Bund", value: "+58 bps", tone: "bear" },
    ],
  },
  bcerate: {
    seed: 4202, base: 3.5, unit: "%", trend: 0.02, vol: 0.01, cycle: "lag",
    actual: "4.00%", consensus: "4.00%", previous: "3.75%", verdict: "inline",
    deltaLabel: "+450 bps cycle", deltaTone: "bull", sparkTone: "bull",
    stats: [
      { label: "Depo rate", value: "4.00%" }, { label: "Cycle", value: "+450 bps", tone: "bull" },
      { label: "Écart Fed", value: "-150 bps", tone: "bear" }, { label: "Terminal (mkt)", value: "4.00%" },
    ],
  },
  spreads: {
    seed: 4203, base: 160, unit: "bps", trend: 2.2, vol: 6, cycle: "lead",
    deltaLabel: "+34 bps 5j", deltaTone: "bear", sparkTone: "bear",
    levels: [{ value: 200, label: "Stress", tone: "bear" }, { value: 130, label: "Calme", tone: "bull" }],
    stats: [
      { label: "BTP-Bund", value: "192 bps", tone: "bear" }, { label: "OAT-Bund", value: "58 bps" },
      { label: "Bono-Bund", value: "104 bps" }, { label: "Δ 5j", value: "+34 bps", tone: "bear" },
    ],
  },
  gdp: {
    seed: 4204, base: 1.8, unit: "% q/q ann.", trend: 0.05, vol: 0.25, cycle: "coin",
    actual: "+3.3%", consensus: "+2.0%", previous: "+2.1%", verdict: "beat",
    deltaLabel: "beat +1.3", deltaTone: "bull", sparkTone: "bull",
    stats: [
      { label: "PIB", value: "+3.3%", tone: "bull" }, { label: "Conso", value: "+2.8%", tone: "bull" },
      { label: "Invest.", value: "+1.4%" }, { label: "Nowcast", value: "+2.6%" },
    ],
  },
  yieldcurve: {
    seed: 4205, base: -0.4, unit: "%", trend: 0.01, vol: 0.02, cycle: "lead",
    deltaLabel: "2s10s -38 bps", deltaTone: "bear", sparkTone: "bear",
    levels: [{ value: 0, label: "Désinversion", tone: "bull" }],
    stats: [
      { label: "2s10s", value: "-38 bps", tone: "bear" }, { label: "3m10y", value: "-112 bps", tone: "bear" },
      { label: "5s30s", value: "+12 bps" }, { label: "Signal", value: "inversée", tone: "bear" },
    ],
  },
};

export function datasetFor(cardId: string): ContextCardDataset | undefined {
  const cfg = CONFIG[cardId];
  return cfg ? buildDataset(cfg) : undefined;
}
