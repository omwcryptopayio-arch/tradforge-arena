import { useEffect, useRef, useState } from "react";

/**
 * Premium decision timer.
 * Base budget 2:30 (150 s), degressive −7 s per scenario order (S1 → S10).
 * Non-blocking: keeps counting into negative territory (overtime pressure).
 */
export function premiumBudgetMs(order: number): number {
  const seconds = Math.max(30, 150 - 7 * Math.max(0, order - 1));
  return seconds * 1000;
}

export interface DecisionTimerState {
  /** Milliseconds remaining (negative once in overtime). */
  remainingMs: number;
  /** Total elapsed since the timer started. */
  elapsedMs: number;
  /** Overrun past the budget (0 while within budget). */
  overtimeMs: number;
  overtime: boolean;
  budgetMs: number;
}

export function useDecisionTimer(order: number, running: boolean): DecisionTimerState {
  const budgetMs = premiumBudgetMs(order);
  const startRef = useRef<number | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!running) return;
    if (startRef.current == null) startRef.current = Date.now();
    const id = window.setInterval(() => {
      if (startRef.current != null) setElapsedMs(Date.now() - startRef.current);
    }, 250);
    return () => window.clearInterval(id);
  }, [running]);

  const remainingMs = budgetMs - elapsedMs;
  const overtimeMs = Math.max(0, elapsedMs - budgetMs);
  return { remainingMs, elapsedMs, overtimeMs, overtime: overtimeMs > 0, budgetMs };
}

export function formatClock(ms: number): string {
  const neg = ms < 0;
  const total = Math.floor(Math.abs(ms) / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${neg ? "−" : ""}${m}:${String(s).padStart(2, "0")}`;
}
