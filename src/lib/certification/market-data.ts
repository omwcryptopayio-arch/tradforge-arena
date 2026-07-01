// TradForge — deterministic synthetic market data for the scenarised replay.
// Same seed → same candles, so scenarios are stable across renders/sessions.

import type { ChartSpec } from "./types";

export interface Candle {
  i: number;
  o: number;
  h: number;
  l: number;
  c: number;
  bullish: boolean;
}

/** Mulberry32 — tiny deterministic PRNG. */
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

/**
 * Generates a coherent OHLC series:
 * - pre-event: gentle random walk with `drift`
 * - event candle (shockAt): strong directional candle
 * - post-event: continuation then partial mean-reversion (institutional shape)
 */
export function generateCandles(spec: ChartSpec): Candle[] {
  const rnd = mulberry32(spec.seed);
  const candles: Candle[] = [];
  const amp = spec.basePrice * spec.volatility;
  let price = spec.basePrice;

  const shockDir = Math.sign(spec.shockMagnitude) || 1;
  const shockTotal = spec.basePrice * spec.shockMagnitude;

  for (let i = 0; i < spec.candles; i++) {
    const o = price;
    let body: number;

    if (i < spec.shockAt) {
      // pre-event drift + noise
      body = spec.basePrice * spec.drift + (rnd() - 0.5) * amp;
    } else if (i === spec.shockAt) {
      // the release candle: dominant directional move
      body = shockTotal * 0.42 + (rnd() - 0.5) * amp * 0.4;
    } else {
      // post-event: continuation that decays, then mild retrace
      const k = i - spec.shockAt;
      const decay = Math.exp(-k / 6);
      const continuation = shockTotal * 0.12 * decay;
      const retrace = k > 5 ? -shockDir * amp * 0.35 * (1 - decay) : 0;
      body = continuation + retrace + (rnd() - 0.5) * amp * 0.9;
    }

    const c = o + body;
    const wick = amp * (0.35 + rnd() * 0.7);
    const h = Math.max(o, c) + wick * rnd();
    const l = Math.min(o, c) - wick * rnd();
    candles.push({ i, o, h, l, c, bullish: c >= o });
    price = c;
  }

  return candles;
}

export interface ChartGeometry {
  candles: Candle[];
  min: number;
  max: number;
  lastPrice: number;
  changePct: number;
  priceTicks: number[];
}

export function buildChartGeometry(spec: ChartSpec): ChartGeometry {
  const candles = generateCandles(spec);
  let min = Infinity;
  let max = -Infinity;
  for (const cndl of candles) {
    if (cndl.l < min) min = cndl.l;
    if (cndl.h > max) max = cndl.h;
  }
  if (spec.support) min = Math.min(min, spec.support);
  if (spec.resistance) max = Math.max(max, spec.resistance);

  const pad = (max - min) * 0.08;
  min -= pad;
  max += pad;

  const lastPrice = candles[candles.length - 1].c;
  const firstPrice = candles[0].o;
  const changePct = ((lastPrice - firstPrice) / firstPrice) * 100;

  const ticks = 5;
  const priceTicks = Array.from(
    { length: ticks },
    (_, k) => max - ((max - min) * k) / (ticks - 1),
  );

  return { candles, min, max, lastPrice, changePct, priceTicks };
}

export function formatPrice(value: number, precision: number): string {
  return value.toFixed(precision);
}
