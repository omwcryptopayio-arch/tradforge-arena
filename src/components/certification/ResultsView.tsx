import { motion } from "motion/react";
import { ArrowRight, Trophy } from "lucide-react";
import { CandleChart } from "./CandleChart";
import { DebriefPanel } from "./DebriefPanel";
import { type Direction, type ScenarioSpec } from "@/lib/certification/types";

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
      {/* Outcome reveal — same chart cadence continues to the final candle. */}
      <div>
        <div className="label-mono mb-2 text-muted-foreground">Reprise · révélation de l'outcome</div>
        <CandleChart spec={scenario.chart} maxReveal={scenario.chart.candles} />
      </div>

      <DebriefPanel
        scenario={scenario}
        direction={direction}
        correct={correct}
        score={score}
        metrics={metrics}
        coherenceMsg={coherenceMsg}
      />

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
