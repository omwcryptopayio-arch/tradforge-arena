// TradForge — localStorage persistence (mock backend).
// Isolated behind this module so it can be swapped for Lovable Cloud later
// without touching the UI.

import type { Direction, Level } from "./types";
import type { ReasoningRole } from "./engine";

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
    /* ignore quota errors in mock */
  }
}

export function getAttempts(): Attempt[] {
  return read<Attempt[]>(ATTEMPTS_KEY, []);
}

export function saveAttempt(attempt: Attempt): void {
  const all = getAttempts();
  all.push(attempt);
  write(ATTEMPTS_KEY, all);
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
}

export function resetAll(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ATTEMPTS_KEY);
  window.localStorage.removeItem(JOURNAL_KEY);
  window.dispatchEvent(new CustomEvent("tradforge:storage"));
}

export function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
