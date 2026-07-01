import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandleChart } from "./CandleChart";
import { ResultsView } from "./ResultsView";
import type { ScenarioSpec } from "@/lib/certification/types";
import { scoreDirection } from "@/lib/certification/engine";
import { saveAttempt, uid } from "@/lib/certification/storage";

interface StandardRunProps {
  scenario: ScenarioSpec;
  isLast: boolean;
  onNext: () => void;
}

export function StandardRun({ scenario, isLast, onNext }: StandardRunProps) {
  const [chosen, setChosen] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const startedAt = useMemo(() => Date.now(), [scenario.id]);
  const options = scenario.options ?? [];

  const correctIndex = scenario.correctIndex ?? 0;
  const chosenOption = chosen != null ? options[chosen] : null;
  const isCorrect = chosen === correctIndex;

  const commit = (i: number) => {
    if (chosen != null) return;
    setChosen(i);
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

  if (showResults && chosenOption) {
    return (
      <ResultsView
        scenario={scenario}
        direction={chosenOption.direction}
        correct={isCorrect}
        score={scoreDirection(chosenOption.direction, scenario.correctDirection)}
        isLast={isLast}
        onNext={onNext}
      />
    );
  }

  return (
    <div className="space-y-5">
      <p className="text-sm leading-relaxed text-muted-foreground">{scenario.brief}</p>

      <CandleChart spec={scenario.chart} maxReveal={scenario.chart.candles} />

      <div className="rounded-xl border border-border bg-surface/60 p-4 sm:p-5">
        <div className="label-mono mb-3 flex items-center gap-1.5 text-primary">
          <span className="text-[var(--gold)]">✦</span> Score Engine · Décision
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

        <AnimatePresence>
          {chosen != null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div
                className={cn(
                  "mt-4 rounded-lg border p-4",
                  isCorrect ? "border-bull/30 bg-bull/5" : "border-bear/30 bg-bear/5",
                )}
              >
                <div
                  className={cn(
                    "mb-1 flex items-center gap-2 text-sm font-semibold",
                    isCorrect ? "text-bull" : "text-bear",
                  )}
                >
                  {isCorrect ? "Correct" : "Incorrect"}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">{scenario.rationale}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowResults(true)}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--gold)] to-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
              >
                Voir le résultat <ArrowRight className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
