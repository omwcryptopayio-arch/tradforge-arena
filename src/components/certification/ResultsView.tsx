import { motion } from "motion/react";
import { CheckCircle2, XCircle, ArrowRight, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandleChart } from "./CandleChart";
import { AnimatedNumber } from "./AnimatedNumber";
import { DIRECTION_LABELS, type Direction, type ScenarioSpec } from "@/lib/certification/types";

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
}

interface ResultsViewProps {
  scenario: ScenarioSpec;
  direction: Direction;
  correct: boolean;
  score: number;
  isLast: boolean;
  onNext: () => void;
  metrics?: Metric[];
  coherenceMsg?: string;
}

export function ResultsView({
  scenario,
  direction,
  correct,
  score,
  isLast,
  onNext,
  metrics,
  coherenceMsg,
}: ResultsViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5"
    >
      {/* Verdict banner */}
      <div
        className={cn(
          "flex items-center gap-4 rounded-xl border p-5",
          correct ? "border-bull/40 bg-bull/5" : "border-bear/40 bg-bear/5",
        )}
      >
        {correct ? (
          <CheckCircle2 className="h-10 w-10 shrink-0 text-bull" />
        ) : (
          <XCircle className="h-10 w-10 shrink-0 text-bear" />
        )}
        <div>
          <div className={cn("font-display text-xl font-bold", correct ? "text-bull" : "text-bear")}>
            {correct ? "Décision alignée" : "Décision divergente"}
          </div>
          <div className="text-sm text-muted-foreground">
            Ton biais : <span className="font-semibold text-foreground">{DIRECTION_LABELS[direction]}</span>
            {" · "}Attendu :{" "}
            <span className="font-semibold text-foreground">
              {DIRECTION_LABELS[scenario.correctDirection]}
            </span>
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="label-mono text-muted-foreground">Score</div>
          <AnimatedNumber
            value={score}
            suffix="%"
            className={cn("font-display text-3xl font-bold tabular-nums", correct ? "text-bull" : "text-bear")}
          />
        </div>
      </div>

      {/* Workspace metrics */}
      {metrics && metrics.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-xl border border-border bg-surface/60 p-4">
              <div className="label-mono mb-1 text-muted-foreground">{m.label}</div>
              <AnimatedNumber
                value={m.value}
                suffix={m.suffix}
                className="font-display text-2xl font-bold tabular-nums text-primary"
              />
              {m.hint && <div className="mt-1 text-xs text-muted-foreground">{m.hint}</div>}
            </div>
          ))}
        </div>
      )}

      {coherenceMsg && (
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/90">
          {coherenceMsg}
        </div>
      )}

      {/* Rationale + outcome */}
      <div className="rounded-xl border border-border bg-surface/60 p-5">
        <div className="label-mono mb-1.5 text-muted-foreground">Rationale</div>
        <p className="text-sm leading-relaxed text-foreground/90">{scenario.rationale}</p>
        <div className="label-mono mb-1.5 mt-4 text-muted-foreground">Outcome réel</div>
        <p className="text-sm leading-relaxed text-foreground/90">{scenario.outcome}</p>
      </div>

      {/* Full reveal */}
      <div>
        <div className="label-mono mb-2 text-muted-foreground">Révélation complète</div>
        <CandleChart spec={scenario.chart} maxReveal={scenario.chart.candles} autoPlay={false} />
      </div>

      <button
        type="button"
        onClick={onNext}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--gold)] to-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
      >
        {isLast ? (
          <>
            <Trophy className="h-4 w-4" /> Terminer le niveau
          </>
        ) : (
          <>
            Scénario suivant <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </motion.div>
  );
}
