// TradeForge Arena — scenario localisation layer.
//
// `scenarios.ts` owns the structure (chart spec, cards, correct direction).
// All human-readable copy comes from the locale overlay, so a component never
// renders a hard-coded scenario string.

import { useCallback } from "react";
import { useI18n } from "./index";
import { chartLabel } from "./content.chart";
import type { Direction, ScenarioSpec } from "@/lib/certification/types";

/** Returns a scenario whose copy is swapped for the active locale. */
export function useLocalizedScenario() {
  const { scenarioText, locale } = useI18n();

  return useCallback(
    (spec: ScenarioSpec | undefined): ScenarioSpec | undefined => {
      if (!spec) return spec;
      const text = scenarioText(spec.id);
      const L = (s: string) => chartLabel(s, locale);
      const chart = {
        ...spec.chart,
        period: L(spec.chart.period),
        eventLabel: L(spec.chart.eventLabel),
        ...(spec.chart.supportLabel ? { supportLabel: L(spec.chart.supportLabel) } : {}),
        ...(spec.chart.resistanceLabel ? { resistanceLabel: L(spec.chart.resistanceLabel) } : {}),
        ...(spec.chart.techAnnotations
          ? {
              techAnnotations: spec.chart.techAnnotations.map((a) => ({
                ...a,
                label: L(a.label),
              })),
            }
          : {}),
      };
      if (!text) return { ...spec, chart };
      return {
        ...spec,
        chart,
        title: text.title,
        brief: text.brief,
        ...(text.question ? { question: text.question } : {}),
        ...(text.options && spec.options
          ? {
              options: spec.options.map((o, i) => ({
                ...o,
                label: text.options?.[i] ?? o.label,
              })),
            }
          : {}),
        rationale: text.rationale,
        outcome: text.outcome,
      };
    },
    [scenarioText, locale],
  );
}


/** Localised Bullish / Neutral / Bearish label. */
export function useDirectionLabel() {
  const { t } = useI18n();
  const KEY: Record<Direction, string> = {
    bull: "decision.bull",
    neutral: "decision.neutral",
    bear: "decision.bear",
  };
  return (d: Direction) => t(KEY[d]);
}
