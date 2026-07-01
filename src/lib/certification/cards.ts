// TradForge — reusable Context Cards catalog.
// Cards are instrument/theme templates; per-scenario relevance lives on ScenarioCardRef.

import type { ContextCardTemplate } from "./types";

export const CONTEXT_CARDS: ContextCardTemplate[] = [
  {
    id: "dxy",
    ticker: "DXY",
    category: "intermarket",
    title: "Dollar Index",
    summary: "Broad USD strength gauge vs a basket of majors.",
    metric: "+0.9%",
    metricTone: "bull",
    detail: [
      { heading: "READING", body: "DXY breaks above its 50-day average as US yields firm. A rising dollar mechanically pressures EUR, GBP and most risk FX." },
      { heading: "IMPLICATION", body: "Dollar-positive prints reinforce USD-quoted pairs. Watch for exhaustion near prior swing highs." },
    ],
  },
  {
    id: "us10y",
    ticker: "US10Y",
    category: "macro",
    title: "10Y Treasury Yield",
    summary: "Benchmark risk-free rate and rate-differential driver.",
    metric: "4.38%",
    metricTone: "bull",
    detail: [
      { heading: "MOVE", body: "Yields climb +12bps on hot data. Rate differentials widen in the dollar's favour." },
      { heading: "IMPLICATION", body: "Higher US real rates attract capital, supporting USD and pressuring long-duration equities and gold." },
    ],
  },
  {
    id: "fed",
    ticker: "FED",
    category: "centralbank",
    title: "Fed Policy Stance",
    summary: "FOMC tone, dot-plot and rate expectations.",
    metric: "Hawkish",
    metricTone: "bull",
    detail: [
      { heading: "GUIDANCE", body: "Officials push back on early cuts and flag sticky services inflation. Market trims rate-cut bets for the year." },
      { heading: "IMPLICATION", body: "A hawkish repricing lifts the dollar and front-end yields; a dovish pivot does the opposite." },
    ],
  },
  {
    id: "cpi",
    ticker: "CPI",
    category: "macro",
    title: "Inflation Print",
    summary: "Headline & core consumer price surprise vs consensus.",
    metric: "+0.4% m/m",
    metricTone: "bull",
    detail: [
      { heading: "SURPRISE", body: "Core CPI runs above expectations, keeping the disinflation narrative on hold." },
      { heading: "IMPLICATION", body: "Upside inflation is dollar-positive via the rates channel and typically weighs on risk assets." },
    ],
  },
  {
    id: "nfp",
    ticker: "NFP",
    category: "macro",
    title: "Labour Market",
    summary: "Non-farm payrolls, wages and unemployment.",
    metric: "+256k",
    metricTone: "bull",
    detail: [
      { heading: "DATA", body: "Payrolls beat with firm wage growth. A resilient labour market lowers the odds of near-term easing." },
      { heading: "IMPLICATION", body: "Strong jobs data supports the dollar and yields; a sharp miss reverses the read." },
    ],
  },
  {
    id: "ecb",
    ticker: "ECB",
    category: "centralbank",
    title: "ECB Stance",
    summary: "Euro-area policy path relative to the Fed.",
    metric: "Dovish tilt",
    metricTone: "bear",
    detail: [
      { heading: "GUIDANCE", body: "Softening euro-area growth opens the door to earlier ECB cuts than the Fed." },
      { heading: "IMPLICATION", body: "A widening Fed–ECB policy gap is EUR/USD-negative." },
    ],
  },
  {
    id: "oil",
    ticker: "WTI",
    category: "intermarket",
    title: "Crude Oil",
    summary: "Energy prices — inflation and terms-of-trade signal.",
    metric: "+3.1%",
    metricTone: "neutral",
    detail: [
      { heading: "MOVE", body: "Crude jumps on supply-side risk. Energy-importer currencies weaken; exporters (CAD, NOK) firm." },
      { heading: "IMPLICATION", body: "Rising oil feeds headline inflation and can complicate central-bank easing." },
    ],
  },
  {
    id: "gold",
    ticker: "XAU",
    category: "intermarket",
    title: "Gold",
    summary: "Safe-haven and real-rate barometer.",
    metric: "-0.6%",
    metricTone: "bear",
    detail: [
      { heading: "MOVE", body: "Gold slips as real yields rise. Haven demand fades in a risk-on tape." },
      { heading: "IMPLICATION", body: "Gold and real rates move inversely; a haven bid signals risk-off rotation." },
    ],
  },
  {
    id: "vix",
    ticker: "VIX",
    category: "technicals",
    title: "Volatility Index",
    summary: "Equity implied-volatility / risk-appetite gauge.",
    metric: "18.4",
    metricTone: "neutral",
    detail: [
      { heading: "READING", body: "VIX sits mid-range — no acute stress, but hedging demand is picking up into the event." },
      { heading: "IMPLICATION", body: "A VIX spike above 25 signals risk-off; a compressed VIX favours carry and risk FX." },
    ],
  },
  {
    id: "calendar",
    ticker: "CAL",
    category: "macro",
    title: "Economic Calendar",
    summary: "Upcoming high-impact releases in the window.",
    metric: "3 red",
    metricTone: "neutral",
    detail: [
      { heading: "AHEAD", body: "A tier-1 data release and a central-bank speaker fall inside the decision horizon." },
      { heading: "IMPLICATION", body: "Event risk argues for smaller conviction until the print clears." },
    ],
  },
  {
    id: "news",
    ticker: "WIRE",
    category: "news",
    title: "Headline Flow",
    summary: "Breaking newswire relevant to the instrument.",
    metric: "Live",
    metricTone: "neutral",
    detail: [
      { heading: "FLASH", body: "Wire reports conflicting sources. Initial reaction often overshoots before fundamentals reassert." },
      { heading: "IMPLICATION", body: "Fade the knee-jerk only when the fundamental read is clearly one-sided." },
    ],
  },
  {
    id: "positioning",
    ticker: "COT",
    category: "technicals",
    title: "Positioning / COT",
    summary: "Speculative positioning extremes.",
    metric: "Net short",
    metricTone: "bull",
    detail: [
      { heading: "READING", body: "Speculators sit at a crowded net-short extreme, raising squeeze risk on any positive surprise." },
      { heading: "IMPLICATION", body: "Stretched positioning amplifies counter-trend moves." },
    ],
  },
  {
    id: "geopolitics",
    ticker: "GEO",
    category: "geopolitics",
    title: "Geopolitical Risk",
    summary: "Cross-border risk events and safe-haven flows.",
    metric: "Elevated",
    metricTone: "bear",
    detail: [
      { heading: "CONTEXT", body: "Escalation headlines drive haven demand into USD, JPY and CHF; risk currencies underperform." },
      { heading: "IMPLICATION", body: "Geopolitical stress is risk-off; magnitude depends on persistence." },
    ],
  },
  {
    id: "earnings",
    ticker: "EPS",
    category: "fundamentals",
    title: "Earnings Preview",
    summary: "Analyst expectations and historical beat rate.",
    metric: "Beat 8/8",
    metricTone: "bull",
    detail: [
      { heading: "SETUP", body: "Consensus EPS is beatable given a strong historical beat rate, but the bar is high and priced-in." },
      { heading: "IMPLICATION", body: "A beat may still sell off if guidance disappoints — reaction is guidance-driven." },
    ],
  },
  {
    id: "datacenter",
    ticker: "REV",
    category: "fundamentals",
    title: "Segment Revenue",
    summary: "Key growth-driver segment trajectory.",
    metric: "+45% YoY",
    metricTone: "bull",
    detail: [
      { heading: "DRIVER", body: "The core segment compounds at an elevated rate and remains supply-constrained." },
      { heading: "IMPLICATION", body: "Structural demand supports the multiple as long as growth holds." },
    ],
  },
  {
    id: "supplychain",
    ticker: "SPLY",
    category: "news",
    title: "Supply Chain Partner",
    summary: "Partner / supplier health and read-through risk.",
    metric: "-15%",
    metricTone: "bear",
    detail: [
      { heading: "DOWNGRADE", body: "A key partner was downgraded on accounting concerns. Read-through risk is often isolated, not systemic." },
      { heading: "IMPLICATION", body: "Verify whether the issue is partner-specific before extrapolating to the whole chain." },
    ],
  },
  {
    id: "competition",
    ticker: "PEER",
    category: "fundamentals",
    title: "Competitive Landscape",
    summary: "Peer momentum and market-share dynamics.",
    metric: "-1.2%",
    metricTone: "neutral",
    detail: [
      { heading: "READING", body: "A peer trades soft, but share gains for the leader keep the relative story intact." },
      { heading: "IMPLICATION", body: "Weak peers can be a distraction when the leader's moat is widening." },
    ],
  },
  {
    id: "technial-structure",
    ticker: "TECH",
    category: "technicals",
    title: "Chart Structure",
    summary: "Key support / resistance and trend structure.",
    metric: "At support",
    metricTone: "bull",
    detail: [
      { heading: "LEVELS", body: "Price tests a well-defined support with higher-timeframe trend intact." },
      { heading: "IMPLICATION", body: "Support holding favours continuation; a clean break flips the structure." },
    ],
  },
];

export const CARD_BY_ID = new Map(CONTEXT_CARDS.map((c) => [c.id, c]));

export function getCard(id: string): ContextCardTemplate | undefined {
  return CARD_BY_ID.get(id);
}
