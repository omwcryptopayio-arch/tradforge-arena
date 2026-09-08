// TradForge — persistence layer.
// Source of truth = Lovable Cloud (server functions, RLS per auth.uid()).
// localStorage is kept as a synchronous read cache so the UI stays sync and
// works offline; every write is mirrored to the cloud (write-through), and
// hydrateFromCloud() pulls the authoritative state on load.

import type { Direction, Level } from "./types";
import type { ReasoningRole } from "./engine";
import { ensureSession } from "./session";
import {
  submitAttempt,
  saveJournalEntry,
  resetCertification,
  getCertificationState,
} from "./cloud.functions";

const ATTEMPTS_KEY = "tradforge.attempts.v1";
const JOURNAL_KEY = "tradforge.journal.v1";

export interface Attempt {
  id: string;
  scenarioId: string;
  level: Level;
  index: number;
  direction: Direction;
  correct: boolean;
  score: number; // 0-100
  durationMs: number;
  overtimeMs?: number; // premium timer overrun (ms past the countdown)
  at: number; // epoch ms
  // workspace metrics
  openedCardIds?: string[];
  efficiency?: number;
  essentialFound?: number;
  essentialTotal?: number;
  // premium
  coherence?: number;
}

export interface ReasoningItem {
  cardId: string;
  role: ReasoningRole | null;
  why: string;
  changedView: boolean;
}

export interface JournalEntry {
  id: string;
  scenarioId: string;
  level: Level;
  title: string;
  symbol: string;
  at: number;
  direction: Direction;
  correct: boolean;
  coherence: number;
  efficiency: number;
  reasoning: ReasoningItem[];
  bias: string | null;
}

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent("tradforge:storage"));
  } catch {
    /* ignore quota errors */
  }
}

export function getAttempts(): Attempt[] {
  return read<Attempt[]>(ATTEMPTS_KEY, []);
}

export function saveAttempt(attempt: Attempt): void {
  const all = getAttempts();
  all.push(attempt);
  write(ATTEMPTS_KEY, all);
  // Write-through to the cloud (fire-and-forget; local cache already updated).
  void (async () => {
    try {
      // Signed-out visitors keep a local-only cache; never call protected endpoints.
      if (!(await ensureSession())) return;
      await submitAttempt({
        data: {
          scenarioId: attempt.scenarioId,
          level: attempt.level,
          index: attempt.index,
          direction: attempt.direction,
          correct: attempt.correct,
          score: attempt.score,
          durationMs: Math.round(attempt.durationMs),
          overtimeMs: Math.round(attempt.overtimeMs ?? 0),
          openedCardIds: attempt.openedCardIds ?? [],
          efficiency: attempt.efficiency ?? null,
          essentialFound: attempt.essentialFound ?? null,
          essentialTotal: attempt.essentialTotal ?? null,
          coherence: attempt.coherence ?? null,
        },
      });
    } catch (e) {
      console.warn("[TradForge] submitAttempt failed (kept locally):", e);
    }
  })();
}

/** Best (max score) attempt per scenario index for a level. */
export function bestScoresByIndex(level: Level): Record<number, Attempt> {
  const best: Record<number, Attempt> = {};
  for (const a of getAttempts()) {
    if (a.level !== level) continue;
    if (!best[a.index] || a.score > best[a.index].score) best[a.index] = a;
  }
  return best;
}

export interface LevelSummary {
  completed: number;
  passed: number;
  total: number;
  aggregatePct: number; // average best score across attempted scenarios
}

export function levelSummary(level: Level, total: number): LevelSummary {
  const best = bestScoresByIndex(level);
  const scores = Object.values(best);
  const completed = scores.length;
  const passed = scores.filter((s) => s.correct).length;
  const aggregatePct =
    completed === 0
      ? 0
      : Math.round(scores.reduce((sum, s) => sum + s.score, 0) / completed);
  return { completed, passed, total, aggregatePct };
}

export function getJournal(): JournalEntry[] {
  return read<JournalEntry[]>(JOURNAL_KEY, []).sort((a, b) => b.at - a.at);
}

export function addJournalEntry(entry: JournalEntry): void {
  const all = read<JournalEntry[]>(JOURNAL_KEY, []);
  all.push(entry);
  write(JOURNAL_KEY, all);
  void (async () => {
    try {
      // Signed-out visitors keep a local-only cache; never call protected endpoints.
      if (!(await ensureSession())) return;
      await saveJournalEntry({
        data: {
          scenarioId: entry.scenarioId,
          level: entry.level,
          title: entry.title,
          symbol: entry.symbol,
          direction: entry.direction,
          correct: entry.correct,
          coherence: entry.coherence,
          efficiency: entry.efficiency,
          reasoning: entry.reasoning,
          bias: entry.bias,
        },
      });
    } catch (e) {
      console.warn("[TradForge] saveJournalEntry failed (kept locally):", e);
    }
  })();
}

export function resetAll(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ATTEMPTS_KEY);
  window.localStorage.removeItem(JOURNAL_KEY);
  window.dispatchEvent(new CustomEvent("tradforge:storage"));
  void (async () => {
    try {
      // Signed-out visitors keep a local-only cache; never call protected endpoints.
      if (!(await ensureSession())) return;
      await resetCertification();
    } catch (e) {
      console.warn("[TradForge] resetCertification failed:", e);
    }
  })();
}

/**
 * Pull authoritative state from the cloud into the local cache. Call once on
 * app load (after session bootstrap). Merges by taking the cloud as source of
 * truth when it has data, so persistence survives refresh / new device.
 */
export async function hydrateFromCloud(): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    if (!(await ensureSession())) return;
    const state = await getCertificationState();
    const localAttempts = getAttempts();
    const localJournal = read<JournalEntry[]>(JOURNAL_KEY, []);
    // Cloud is source of truth once it has rows; otherwise keep local (and it
    // will be pushed up by subsequent writes).
    if (state.attempts.length >= localAttempts.length) {
      write(ATTEMPTS_KEY, state.attempts as Attempt[]);
    }
    if (state.journal.length >= localJournal.length) {
      write(JOURNAL_KEY, state.journal as unknown as JournalEntry[]);
    }
  } catch (e) {
    console.warn("[TradForge] hydrateFromCloud failed (offline cache):", e);
  }
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
