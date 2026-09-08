import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Layers, ArrowRight, Brain, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { CandleChart } from "./CandleChart";
import { ContextCard, ContextCardModal } from "./ContextCard";
import { DecisionPanel } from "./DecisionPanel";
import { ResultsView } from "./ResultsView";
import { Stepper, type Phase } from "./Stepper";
import { ReplayLoader } from "./ReplayLoader";
import { DecisionTimer } from "./DecisionTimer";
import { useDecisionTimer } from "@/hooks/useDecisionTimer";
import { getCard } from "@/lib/certification/cards";
import type { ContextCardTemplate, Direction, ScenarioSpec } from "@/lib/certification/types";
import {
  coherenceFeedback,
  coherenceIndex,
  essentialCardIds,
  REASONING_ROLES,
  researchEfficiency,
  scoreDirection,
  type ReasoningRole,
} from "@/lib/certification/engine";
import {
  addJournalEntry,
  saveAttempt,
  uid,
  type ReasoningItem,
} from "@/lib/certification/storage";
import { useI18n } from "@/lib/i18n";

interface WorkspaceRunProps {
  scenario: ScenarioSpec;
  isLast: boolean;
  onNext: () => void;
}

interface ResolvedCard {
  template: ContextCardTemplate;
  relevance: number;
}

interface Declaration {
  influenced: boolean;
  role: ReasoningRole | null;
  why: string;
  changedView: boolean;
}

export function WorkspaceRun({ scenario, isLast, onNext }: WorkspaceRunProps) {
  const { t } = useI18n();
  const isPremium = scenario.level === "premium";
  const startedAt = useMemo(() => Date.now(), [scenario.id]);

  const cards: ResolvedCard[] = useMemo(
    () =>
      (scenario.cards ?? [])
        .map((r) => {
          const template = getCard(r.cardId);
          return template ? { template, relevance: r.relevance } : null;
        })
        .filter((c): c is ResolvedCard => c !== null),
    [scenario],
  );

  const essentials = useMemo(() => essentialCardIds(scenario), [scenario]);

  const [phase, setPhase] = useState<Phase>("research");
  const [chartLoaded, setChartLoaded] = useState(false);
  const [openOrder, setOpenOrder] = useState<string[]>([]);
  const [activeCard, setActiveCard] = useState<ContextCardTemplate | null>(null);
  const [decision, setDecision] = useState<Direction | null>(null);
  const [overtimeMs, setOvertimeMs] = useState(0);
  const [declarations, setDeclarations] = useState<Record<string, Declaration>>({});

  // Premium decision timer: runs from replay load until the direction is chosen.
  const timer = useDecisionTimer(scenario.index, isPremium && chartLoaded && decision === null);

  const viewedSet = new Set(openOrder);
  const essentialFound = essentials.filter((id) => viewedSet.has(id)).length;

  const openCard = (tpl: ContextCardTemplate) => {
    setActiveCard(tpl);
    setOpenOrder((prev) => (prev.includes(tpl.id) ? prev : [...prev, tpl.id]));
  };

  const finalizeHigh = (dir: Direction) => {
    const score = scoreDirection(dir, scenario.correctDirection);
    const efficiency = researchEfficiency(scenario, openOrder);
    saveAttempt({
      id: uid(),
      scenarioId: scenario.id,
      level: scenario.level,
      index: scenario.index,
      direction: dir,
      correct: dir === scenario.correctDirection,
      score,
      durationMs: Date.now() - startedAt,
      at: Date.now(),
      openedCardIds: openOrder,
      efficiency,
      essentialFound,
      essentialTotal: essentials.length,
    });
    setPhase("results");
  };

  const onDecide = (dir: Direction) => {
    setDecision(dir);
    if (isPremium) {
      setOvertimeMs(timer.overtimeMs);
      // seed declarations for viewed cards
      const seed: Record<string, Declaration> = {};
      for (const c of cards) {
        seed[c.template.id] = {
          influenced: viewedSet.has(c.template.id),
          role: null,
          why: "",
          changedView: false,
        };
      }
      setDeclarations(seed);
      setPhase("reasoning");
    } else {
      finalizeHigh(dir);
    }
  };

  const declaredIds = Object.entries(declarations)
    .filter(([, d]) => d.influenced)
    .map(([id]) => id);

  const submitReasoning = () => {
    if (!decision) return;
    const score = scoreDirection(decision, scenario.correctDirection);
    const efficiency = researchEfficiency(scenario, openOrder);
    const coherence = coherenceIndex(openOrder, declaredIds);
    const reasoning: ReasoningItem[] = Object.entries(declarations)
      .filter(([, d]) => d.influenced)
      .map(([cardId, d]) => ({ cardId, role: d.role, why: d.why, changedView: d.changedView }));

    saveAttempt({
      id: uid(),
      scenarioId: scenario.id,
      level: scenario.level,
      index: scenario.index,
      direction: decision,
      correct: decision === scenario.correctDirection,
      score,
      durationMs: Date.now() - startedAt,
      at: Date.now(),
      openedCardIds: openOrder,
      efficiency,
      essentialFound,
      essentialTotal: essentials.length,
      coherence,
      overtimeMs,
    });


    const declaredNotOpened = declaredIds.filter((id) => !viewedSet.has(id)).length;
    addJournalEntry({
      id: uid(),
      scenarioId: scenario.id,
      level: scenario.level,
      title: scenario.title,
      symbol: scenario.symbol,
      at: Date.now(),
      direction: decision,
      correct: decision === scenario.correctDirection,
      coherence,
      efficiency,
      reasoning,
      bias:
        declaredNotOpened > 0
          ? "bias.rationalisation"
          : efficiency < 50
            ? "bias.overResearch"
            : null,
    });
    setPhase("results");
  };

  // ── RESULTS ──
  if (phase === "results" && decision) {
    const score = scoreDirection(decision, scenario.correctDirection);
    const efficiency = researchEfficiency(scenario, openOrder);
    const coherence = coherenceIndex(openOrder, declaredIds);
    const declaredNotOpened = declaredIds.filter((id) => !viewedSet.has(id)).length;
    const metrics = isPremium
      ? [
          {
            label: t("metrics.efficiency"),
            value: efficiency,
            suffix: "%",
            hint: `${essentialFound}/${essentials.length} ${t("cards.essentials")}`,
          },
          {
            label: t("metrics.coherence"),
            value: coherence,
            suffix: "%",
            hint: t("metrics.noScoreImpact"),
          },
          {
            label: t("metrics.cardsOpened"),
            value: openOrder.length,
            hint: `${t("common.of")} ${cards.length}`,
          },
        ]
      : [
          { label: t("metrics.efficiency"), value: efficiency, suffix: "%" },
          {
            label: t("metrics.essentialsFound"),
            value: essentialFound,
            hint: `${t("common.of")} ${essentials.length}`,
          },
          {
            label: t("metrics.cardsOpened"),
            value: openOrder.length,
            hint: `${t("common.of")} ${cards.length}`,
          },
        ];
    return (
      <ResultsView
        scenario={scenario}
        direction={decision}
        correct={decision === scenario.correctDirection}
        score={score}
        isLast={isLast}
        onNext={onNext}
        metrics={metrics}
        coherenceMsg={isPremium ? t(coherenceFeedback(coherence, declaredNotOpened)) : undefined}
      />
    );
  }

  // ── REASONING (premium) ──
  if (phase === "reasoning") {
    return (
      <div className="space-y-5">
        <Stepper current="reasoning" />
        <div className="rounded-xl border border-primary/25 bg-primary/5 p-5">
          <div className="mb-1 flex items-center gap-2 font-display text-lg font-semibold">
            <Brain className="h-5 w-5 text-primary" /> {t("reasoning.title")}
          </div>
          <p className="text-sm text-muted-foreground">
            {t("reasoning.lede")}
          </p>
        </div>

        <div className="space-y-3">
          {cards.map((c) => {
            const d = declarations[c.template.id];
            const wasViewed = viewedSet.has(c.template.id);
            return (
              <div
                key={c.template.id}
                className={cn(
                  "rounded-xl border p-4 transition-colors",
                  d?.influenced ? "border-primary/40 bg-surface-raised" : "border-border bg-surface/60",
                )}
              >
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={d?.influenced ?? false}
                    onChange={(e) =>
                      setDeclarations((p) => ({
                        ...p,
                        [c.template.id]: { ...p[c.template.id], influenced: e.target.checked },
                      }))
                    }
                    className="mt-1 h-4 w-4 accent-[var(--gold)]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-semibold">{c.template.ticker}</span>
                      <span className="text-sm text-muted-foreground">{c.template.title}</span>
                      {wasViewed && (
                        <span className="flex items-center gap-1 text-[10px] text-bull">
                          <Eye className="h-3 w-3" /> {t("reasoning.consulted")}
                        </span>
                      )}
                    </div>
                  </div>
                </label>

                <AnimatePresence>
                  {d?.influenced && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-3 pl-7">
                        <div className="flex flex-wrap gap-2">
                          {REASONING_ROLES.map((r) => (
                            <button
                              key={r.value}
                              type="button"
                              onClick={() =>
                                setDeclarations((p) => ({
                                  ...p,
                                  [c.template.id]: { ...p[c.template.id], role: r.value },
                                }))
                              }
                              className={cn(
                                "rounded-full border px-3 py-1 text-xs transition-colors",
                                d.role === r.value
                                  ? "border-primary/60 bg-primary/15 text-primary"
                                  : "border-border text-muted-foreground hover:bg-accent",
                              )}
                              title={t(`reasoning.roleHints.${r.value}`)}
                            >
                              {t(`reasoning.roles.${r.value}`)}
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={d.why}
                          onChange={(e) =>
                            setDeclarations((p) => ({
                              ...p,
                              [c.template.id]: { ...p[c.template.id], why: e.target.value },
                            }))
                          }
                          placeholder={t("reasoning.whyPlaceholder")}
                          rows={2}
                          className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary/50"
                        />
                        <label className="flex items-center gap-2 text-xs text-muted-foreground">
                          <input
                            type="checkbox"
                            checked={d.changedView}
                            onChange={(e) =>
                              setDeclarations((p) => ({
                                ...p,
                                [c.template.id]: { ...p[c.template.id], changedView: e.target.checked },
                              }))
                            }
                            className="h-3.5 w-3.5 accent-[var(--gold)]"
                          />
                          {t("reasoning.changedView")}
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={submitReasoning}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--gold)] to-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
        >
          {t("reasoning.submit")} <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    );
  }

  // ── DECISION ──
  if (phase === "decision") {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Stepper current="decision" />
          {isPremium && <DecisionTimer state={timer} />}
        </div>
        <CandleChart spec={scenario.chart} maxReveal={scenario.chart.shockAt} autoPlay={false} />
        <div className="rounded-xl border border-border bg-surface/60 p-5">
          <DecisionPanel onDecide={onDecide} />
        </div>
        <button
          type="button"
          onClick={() => setPhase("research")}
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("decision.backToResearch")}
        </button>
      </div>
    );
  }

  // ── RESEARCH ──
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <Stepper current="research" />
        {isPremium && chartLoaded && <DecisionTimer state={timer} />}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{scenario.brief}</p>


      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-3">
          {chartLoaded ? (
            <CandleChart spec={scenario.chart} maxReveal={scenario.chart.shockAt} />
          ) : (
            <ReplayLoader spec={scenario.chart} onLoad={() => setChartLoaded(true)} />
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="label-mono flex items-center gap-1.5 text-primary">
              <Layers className="h-3.5 w-3.5" /> {t("cards.title")}
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              {isPremium ? (
                <>
                  {openOrder.length} {t("cards.viewed")}
                </>
              ) : (
                <>
                  {openOrder.length} {t("cards.viewed")} · {essentialFound}/{essentials.length}{" "}
                  {t("cards.essentials")}
                </>
              )}
            </div>
          </div>
          <div className="grid max-h-[520px] gap-3 overflow-y-auto pr-1">
            {cards.map((c) => (
              <ContextCard
                key={c.template.id}
                card={c.template}
                viewed={viewedSet.has(c.template.id)}
                onOpen={() => openCard(c.template)}
                mode={isPremium ? "analyst" : "guided"}
              />
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={openOrder.length === 0}
        onClick={() => setPhase("decision")}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--gold)] to-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform enabled:hover:scale-[1.01] enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {t("decision.toDecision")} <ArrowRight className="h-4 w-4" />
      </button>

      <ContextCardModal
        card={activeCard}
        cardNumber={activeCard ? openOrder.indexOf(activeCard.id) + 1 : undefined}
        cardTotal={cards.length}
        mode={isPremium ? "analyst" : "guided"}
        onClose={() => setActiveCard(null)}
      />
    </div>
  );
}
