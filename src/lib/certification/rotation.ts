// TradForge — Weighted Rotation Engine (anti-repetition).
//
// Goal: two consecutive passes of the same level must NOT replay the same
// scenario at the same position. Selection is weighted by:
//   - usage count (a case already played a lot is deprioritised),
//   - cooldown (a case played in the current or previous pass is pushed back),
//   - diversity (avoid two consecutive cases on the same symbol),
//   - a per-user + per-pass seed (deterministic, so a refresh mid-pass keeps
//     the exact same order).
//
// The engine is dimensioned for the full historical bank (160+ cases) without
// modification: it only needs the list of candidate scenarios for a level.

import type { Level, ScenarioSpec } from "./types";
import { getScenarios } from "./scenarios";

const ORDER_KEY = "tradforge.rotation.order.v1";
const USAGE_KEY = "tradforge.rotation.usage.v1";
const PASS_KEY = "tradforge.rotation.pass.v1";

/** Deterministic PRNG (same family as the market-data generator). */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

type UsageMap = Record<string, { count: number; lastPass: number }>;
type OrderMap = Partial<Record<Level, { pass: number; ids: string[] }>>;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage blocked */
  }
}

function readPass(level: Level): number {
  const passes = readJson<Partial<Record<Level, number>>>(PASS_KEY, {});
  return passes[level] ?? 0;
}

/** Start a new pass on a level: the next computed order will differ. */
export function startNewPass(level: Level): number {
  const passes = readJson<Partial<Record<Level, number>>>(PASS_KEY, {});
  const next = (passes[level] ?? 0) + 1;
  passes[level] = next;
  writeJson(PASS_KEY, passes);
  const orders = readJson<OrderMap>(ORDER_KEY, {});
  delete orders[level];
  writeJson(ORDER_KEY, orders);
  return next;
}

/**
 * Weighted rotation ordering. Pure: same inputs → same output.
 * `pool` is the candidate bank for the level.
 */
export function weightedOrder(
  pool: ScenarioSpec[],
  usage: UsageMap,
  pass: number,
  seed: number,
): ScenarioSpec[] {
  const rnd = mulberry32(seed ^ (pass * 0x9e3779b9));
  const remaining = [...pool];
  const ordered: ScenarioSpec[] = [];
  let lastSymbol: string | null = null;

  while (remaining.length > 0) {
    const weights = remaining.map((s) => {
      const u = usage[s.id];
      const count = u?.count ?? 0;
      const cooldown = u && pass - u.lastPass <= 1 ? 0.25 : 1;
      const diversity = lastSymbol && s.symbol === lastSymbol ? 0.35 : 1;
      // Jitter keeps ties from always resolving the same way.
      const jitter = 0.75 + rnd() * 0.5;
      return (1 / (1 + count)) * cooldown * diversity * jitter;
    });
    const total = weights.reduce((a, b) => a + b, 0);
    let pick = rnd() * total;
    let idx = 0;
    for (let i = 0; i < weights.length; i++) {
      pick -= weights[i]!;
      if (pick <= 0) {
        idx = i;
        break;
      }
      idx = i;
    }
    const chosen = remaining.splice(idx, 1)[0]!;
    ordered.push(chosen);
    lastSymbol = chosen.symbol;
  }

  return ordered;
}

/** Stable seed for the current learner (falls back to a device-local seed). */
function learnerSeed(): number {
  if (typeof window === "undefined") return 1;
  const KEY = "tradforge.rotation.seed.v1";
  try {
    let s = window.localStorage.getItem(KEY);
    if (!s) {
      s = String(Math.floor(Math.random() * 0xffffffff));
      window.localStorage.setItem(KEY, s);
    }
    return Number(s) >>> 0;
  } catch {
    return 1;
  }
}

/** The scenario order for the current pass of a level (memoised in storage). */
export function currentOrder(level: Level): ScenarioSpec[] {
  const pool = getScenarios(level);
  if (typeof window === "undefined") return pool;

  const pass = readPass(level);
  const orders = readJson<OrderMap>(ORDER_KEY, {});
  const cached = orders[level];
  if (cached && cached.pass === pass) {
    const byId = new Map(pool.map((s) => [s.id, s]));
    const restored = cached.ids.map((id) => byId.get(id)).filter(Boolean) as ScenarioSpec[];
    if (restored.length === pool.length) return restored;
  }

  const usage = readJson<UsageMap>(USAGE_KEY, {});
  const ordered = weightedOrder(pool, usage, pass, learnerSeed() ^ hashString(level));
  orders[level] = { pass, ids: ordered.map((s) => s.id) };
  writeJson(ORDER_KEY, orders);
  return ordered;
}

/** Scenario shown at 1-based position `position` of the current pass. */
export function scenarioAtPosition(level: Level, position: number): ScenarioSpec | undefined {
  const order = currentOrder(level);
  return order[position - 1];
}

/** Record that a scenario was played (local cache + cloud write-through). */
export function markScenarioUsed(level: Level, scenarioId: string): void {
  if (typeof window === "undefined") return;
  const usage = readJson<UsageMap>(USAGE_KEY, {});
  const pass = readPass(level);
  const prev = usage[scenarioId];
  usage[scenarioId] = { count: (prev?.count ?? 0) + 1, lastPass: pass };
  writeJson(USAGE_KEY, usage);

  void (async () => {
    try {
      const { ensureSession } = await import("./session");
      if (!(await ensureSession())) return;
      const { recordScenarioUsage } = await import("./cloud.functions");
      await recordScenarioUsage({ data: { level, scenarioId } });
    } catch {
      /* offline: local cache remains authoritative for ordering */
    }
  })();
}

/** Hydrate the local usage cache from the cloud (called after sign-in). */
export function applyCloudUsage(
  rows: { scenario_id: string; usage_count: number }[],
): void {
  if (typeof window === "undefined") return;
  const usage = readJson<UsageMap>(USAGE_KEY, {});
  for (const row of rows) {
    const prev = usage[row.scenario_id];
    usage[row.scenario_id] = {
      count: Math.max(prev?.count ?? 0, row.usage_count),
      lastPass: prev?.lastPass ?? -1,
    };
  }
  writeJson(USAGE_KEY, usage);
}
