import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandleChart } from "./CandleChart";
import { ReplayLoader } from "./ReplayLoader";
import { DebriefPanel } from "./DebriefPanel";
import type { ScenarioSpec } from "@/lib/certification/types";
import { scoreDirection } from "@/lib/certification/engine";
import { saveAttempt, uid } from "@/lib/certification/storage";
import { useI18n } from "@/lib/i18n";

interface StandardRunProps {
  scenario: ScenarioSpec;
  isLast: boolean;
  onNext: () => void;
}

type Phase = "loading" | "replay" | "debrief";

export function StandardRun({ scenario, isLast, onNext }: StandardRunProps) {
  const { t } = useI18n();
  const [phase, setPhase] = useState<Phase>("loading");
  const [chosen, setChosen] = useState<number | null>(null);
  const startedAt = useMemo(() => Date.now(), [scenario.id]);
  const options = scenario.options ?? [];

  const correctIndex = scenario.correctIndex ?? 0;
  // Chart reveals only up to the decision candle until the user answers, then
  // continues (same cadence, same animation) to the final candle — no jump.
  const reveal = chosen == null ? scenario.chart.shockAt : scenario.chart.candles;
  const isCorrect = chosen === correctIndex;

  const commit = (i: number) => {
    if (chosen != null) return;
    setChosen(i);
    setPhase("debrief");
    const dir = options[i].direction;
    saveAttempt({
      id: uid(),
      scenarioId: scenario.id,
      level: scenario.level,
      index: scenario.index,
      direction: dir,
      correct: i === correctIndex,
      score: scoreDirection(dir, scenario.correctDirection),
      durationMs: Date.now() - startedAt,
      at: Date.now(),
    });
  };

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-muted-foreground">{scenario.brief}</p>

      {/* Chart region stays anchored in place across every phase. */}
      {phase === "loading" ? (
        <ReplayLoader spec={scenario.chart} onLoad={() => setPhase("replay")} />
      ) : (
        <CandleChart spec={scenario.chart} maxReveal={reveal} />
      )}

      {phase !== "loading" && (
        <div className="rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
          <div className="label-mono mb-3 flex items-center gap-1.5 text-primary">
            <span className="text-[var(--gold)]">✦</span> {t("debrief.scoreEngine")}
          </div>
          <h3 className="mb-4 font-display text-base font-semibold sm:text-lg">{scenario.question}</h3>
          <div className="space-y-2.5">
            {options.map((opt, i) => {
              const isChosen = chosen === i;
              const isTheCorrect = i === correctIndex;
              const showState = chosen != null;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={chosen != null}
                  onClick={() => commit(i)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3.5 text-left text-sm transition-colors",
                    !showState && "border-border bg-surface hover:border-border/90 hover:bg-surface-raised",
                    showState && isTheCorrect && "border-bull/60 bg-bull/10",
                    showState && isChosen && !isTheCorrect && "border-bear/60 bg-bear/10",
                    showState && !isChosen && !isTheCorrect && "border-border opacity-50",
                  )}
                >
                  <span>{opt.label}</span>
                  {showState && isTheCorrect && <CheckCircle2 className="h-5 w-5 shrink-0 text-bull" />}
                  {showState && isChosen && !isTheCorrect && <XCircle className="h-5 w-5 shrink-0 text-bear" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Debrief opens BELOW the chart — the chart never moves. */}
      <AnimatePresence>
        {phase === "debrief" && chosen != null && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-5 overflow-hidden"
          >
            <DebriefPanel
              scenario={scenario}
              direction={options[chosen].direction}
              correct={isCorrect}
              score={scoreDirection(options[chosen].direction, scenario.correctDirection)}
              mcq={{ options, correctIndex, chosenIndex: chosen }}
            />
            <button
              type="button"
              onClick={onNext}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--gold)] to-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {isLast ? (
                <>
                  <Trophy className="h-4 w-4" /> {t("results.finish")}
                </>
              ) : (
                <>
                  {t("results.next")} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
