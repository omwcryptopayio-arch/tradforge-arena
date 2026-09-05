import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  CheckCircle2,
  XCircle,
  Zap,
  BookOpen,
  Target,
  Lightbulb,
  Activity,
  Check,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedNumber } from "./AnimatedNumber";
import { useI18n } from "@/lib/i18n";
import { useDirectionLabel } from "@/lib/i18n/scenario";
import {
  type Direction,
  type McqOption,
  type ScenarioSpec,
} from "@/lib/certification/types";

interface Metric {
  label: string;
  value: number;
  suffix?: string;
  hint?: string;
}

export interface McqBreakdown {
  options: McqOption[];
  correctIndex: number;
  chosenIndex: number;
}

interface DebriefPanelProps {
  scenario: ScenarioSpec;
  direction: Direction;
  correct: boolean;
  score: number;
  metrics?: Metric[];
  coherenceMsg?: string;
  mcq?: McqBreakdown;
}

type Density = "rapide" | "complete";



/**
 * Restructured, progressive debrief. Same TradForge content, hierarchised for
 * lower cognitive load: a "Rapide" verdict first, "Complète" expands the full
 * reasoning (outcome, key learning, per-answer breakdown, macro impact).
 * Layout is additive — it opens below the chart, never displaces it.
 */
export function DebriefPanel({
  scenario,
  direction,
  correct,
  score,
  metrics,
  coherenceMsg,
  mcq,
}: DebriefPanelProps) {
  const { t } = useI18n();
  const dirLabel = useDirectionLabel();
  const [density, setDensity] = useState<Density>("rapide");
  const quickTake =
    scenario.quickTake ??
    t("debrief.quickTakeFallback", {
      dir: dirLabel(scenario.correctDirection).toLowerCase(),
      symbol: scenario.symbol,
    });
  const keyLearning = scenario.keyLearning ?? scenario.rationale;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-2xl border border-border bg-surface/60"
    >
      {/* Verdict header + density toggle */}
      <div
        className={cn(
          "flex flex-wrap items-center gap-3 border-b p-4 sm:p-5",
          correct ? "border-bull/30 bg-bull/5" : "border-bear/30 bg-bear/5",
        )}
      >
        {correct ? (
          <CheckCircle2 className="h-6 w-6 shrink-0 text-bull" />
        ) : (
          <XCircle className="h-6 w-6 shrink-0 text-bear" />
        )}
        <div className="min-w-0">
          <div className={cn("font-display text-lg font-bold", correct ? "text-bull" : "text-bear")}>
            {correct ? t("debrief.correct") : t("debrief.incorrect")}
          </div>
          <div className="text-xs text-muted-foreground">
            {t("debrief.yourBias")}{" "}
            <span className="font-semibold text-foreground">{dirLabel(direction)}</span>
            {" · "}
            {t("debrief.expected")}{" "}
            <span className="font-semibold text-foreground">
              {dirLabel(scenario.correctDirection)}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <AnimatedNumber
            value={score}
            suffix="%"
            className={cn(
              "font-display text-2xl font-bold tabular-nums",
              correct ? "text-bull" : "text-bear",
            )}
          />
          <div className="flex rounded-lg border border-border bg-background/60 p-0.5">
            {(["rapide", "complete"] as const).map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDensity(d)}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
                  density === d
                    ? "bg-gradient-to-br from-[var(--gold)] to-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {d === "rapide" ? <Zap className="h-3.5 w-3.5" /> : <BookOpen className="h-3.5 w-3.5" />}
                {d === "rapide" ? t("debrief.quick") : t("debrief.full")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-5">
        {/* Réponse rapide — always visible */}
        <Section icon={Zap} title={t("debrief.quickTake")} tone="gold">
          <p className="text-sm leading-relaxed text-foreground/90">{quickTake}</p>
        </Section>

        <AnimatePresence initial={false}>
          {density === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-4 overflow-hidden"
            >
              <Section icon={BookOpen} title={t("debrief.rationale")}>
                <p className="text-sm leading-relaxed text-foreground/90">{scenario.rationale}</p>
              </Section>

              {mcq && (
                <Section icon={Target} title={t("debrief.perOption")}>
                  <ul className="space-y-2.5">
                    {mcq.options.map((opt, i) => {
                      const isCorrect = i === mcq.correctIndex;
                      const isChosen = i === mcq.chosenIndex;
                      return (
                        <li
                          key={i}
                          className={cn(
                            "rounded-lg border p-3 text-sm",
                            isCorrect
                              ? "border-bull/40 bg-bull/5"
                              : "border-border bg-background/40",
                          )}
                        >
                          <div className="flex items-start gap-2">
                            {isCorrect ? (
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-bull" />
                            ) : (
                              <X className="mt-0.5 h-4 w-4 shrink-0 text-bear" />
                            )}
                            <div>
                              <span className="font-medium text-foreground">{opt.label}</span>
                              {isChosen && (
                                <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                  ton choix
                                </span>
                              )}
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                {opt.explain ??
                                  (isCorrect
                                    ? t("debrief.optionCorrectFallback")
                                    : t("debrief.optionWrongFallback"))}
                              </p>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Section>
              )}

              <Section icon={Activity} title={t("debrief.realOutcome")} tone="gold">
                <p className="font-mono text-sm leading-relaxed text-foreground/80">
                  {scenario.outcome}
                </p>
              </Section>

              {scenario.macroImpact && scenario.macroImpact.length > 0 && (
                <Section icon={Activity} title={t("debrief.macroImpact")}>
                  <ul className="space-y-1.5">
                    {scenario.macroImpact.map((m, i) => (
                      <li key={i} className="flex gap-2 text-sm text-foreground/90">
                        <span className="text-[var(--gold)]">›</span>
                        {m}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              <Section icon={Lightbulb} title={t("debrief.keyLearning")} tone="primary">
                <p className="text-sm font-medium leading-relaxed text-foreground">{keyLearning}</p>
              </Section>

              {metrics && metrics.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-3">
                  {metrics.map((m) => (
                    <div key={m.label} className="rounded-xl border border-border bg-background/40 p-4">
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Section({
  icon: Icon,
  title,
  tone = "muted",
  children,
}: {
  icon: typeof Zap;
  title: string;
  tone?: "muted" | "gold" | "primary";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "gold" ? "text-[var(--gold)]" : tone === "primary" ? "text-primary" : "text-muted-foreground";
  return (
    <div>
      <div className={cn("label-mono mb-1.5 flex items-center gap-1.5", toneClass)}>
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      {children}
    </div>
  );
}
