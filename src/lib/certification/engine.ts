// TradForge — evaluation engine: scoring, essential detection, research
// efficiency and the (non-penalising) coherence index.

import type { Direction, ScenarioSpec } from "./types";

export const ESSENTIAL_THRESHOLD = 72;

export const REASONING_ROLES = [
  { value: "confirmation", label: "reasoning.roles.confirmation", hint: "reasoning.roleHints.confirmation" },
  { value: "invalidation", label: "reasoning.roles.invalidation", hint: "reasoning.roleHints.invalidation" },
  { value: "contexte", label: "reasoning.roles.contexte", hint: "reasoning.roleHints.contexte" },
  { value: "timing", label: "reasoning.roles.timing", hint: "reasoning.roleHints.timing" },
  { value: "risque", label: "reasoning.roles.risque", hint: "reasoning.roleHints.risque" },
] as const;

export type ReasoningRole = (typeof REASONING_ROLES)[number]["value"];

export function isEssential(relevance: number): boolean {
  return relevance >= ESSENTIAL_THRESHOLD;
}

export function essentialCardIds(scenario: ScenarioSpec): string[] {
  return (scenario.cards ?? [])
    .filter((c) => isEssential(c.relevance))
    .map((c) => c.cardId);
}

export function scoreDirection(chosen: Direction, correct: Direction): number {
  if (chosen === correct) return 100;
  // Neutral when a directional answer was expected is a partial miss.
  if (chosen === "neutral" || correct === "neutral") return 35;
  return 0; // opposite direction
}

/**
 * Research efficiency (0-100): rewards finding the essential cards while
 * penalising excessive noise consultation. Mirrors the reference "55" metric.
 */
export function researchEfficiency(
  scenario: ScenarioSpec,
  openedIds: string[],
): number {
  const essentials = essentialCardIds(scenario);
  if (essentials.length === 0) return 100;
  const openedSet = new Set(openedIds);
  const foundEssential = essentials.filter((id) => openedSet.has(id)).length;
  const nonEssentialOpened = openedIds.filter(
    (id) => !essentials.includes(id),
  ).length;
  const coverage = (foundEssential / essentials.length) * 100;
  const noisePenalty = Math.min(40, nonEssentialOpened * 9);
  return Math.max(0, Math.round(coverage - noisePenalty));
}

/**
 * Coherence index (0-100): agreement between cards actually consulted and
 * cards the user declared as influential. Jaccard overlap. Does NOT affect
 * the pass/fail score — it powers qualitative feedback only.
 */
export function coherenceIndex(
  openedIds: string[],
  declaredIds: string[],
): number {
  const opened = new Set(openedIds);
  const declared = new Set(declaredIds);
  if (opened.size === 0 && declared.size === 0) return 100;
  let inter = 0;
  const union = new Set<string>([...opened, ...declared]);
  for (const id of declared) if (opened.has(id)) inter++;
  return Math.round((inter / union.size) * 100);
}

export function coherenceFeedback(index: number, declaredButNotOpened: number): string {
  // Returns a stable i18n key; the UI resolves it through `t()`.
  if (index >= 85) return "coherence.high";
  if (index >= 60) return "coherence.mid";
  if (declaredButNotOpened > 0) return "coherence.rationalisation";
  return "coherence.low";
}

export const PASS_THRESHOLD = 70;

export function isPass(aggregatePct: number): boolean {
  return aggregatePct >= PASS_THRESHOLD;
}
