import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Direction } from "@/lib/certification/types";
import { getCard } from "@/lib/certification/cards";
import { REASONING_ROLES } from "@/lib/certification/engine";
import { getJournal, resetAll, type JournalEntry } from "@/lib/certification/storage";
import { TopBar } from "@/components/certification/TopBar";
import { useI18n } from "@/lib/i18n";
import { useDirectionLabel } from "@/lib/i18n/scenario";

export const Route = createFileRoute("/_authenticated/journal")({
  head: () => ({
    meta: [
      { title: "Decision Journal · TradeForge Arena" },
      {
        name: "description",
        content: "History of your calls, your stated reasoning, your coherence and your biases.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Decision Journal · TradeForge Arena" },
      { property: "og:description", content: "Every call, its reasoning, its coherence." },
    ],
  }),
  component: Journal,
});



function DirIcon({ dir }: { dir: Direction }) {
  const Icon = dir === "bull" ? TrendingUp : dir === "bear" ? TrendingDown : Minus;
  return (
    <Icon
      className={cn(
        "h-4 w-4",
        dir === "bull" ? "text-bull" : dir === "bear" ? "text-bear" : "text-neutral",
      )}
    />
  );
}

function Journal() {
  const { t } = useI18n();
  const dirLabel = useDirectionLabel();
  const roleLabel = (role: string | null) =>
    REASONING_ROLES.some((r) => r.value === role) ? t(`reasoning.roles.${role}`) : "—";
  /** Bias values are stored as stable i18n keys ("bias.*"); legacy rows kept verbatim. */
  const biasLabel = (b: string) => (b.startsWith("bias.") ? t(b) : b);
  const [entries, setEntries] = useState<JournalEntry[]>([]);

  useEffect(() => {
    const refresh = () => setEntries(getJournal());
    refresh();
    window.addEventListener("tradforge:storage", refresh);
    return () => window.removeEventListener("tradforge:storage", refresh);
  }, []);

  const avgCoherence =
    entries.length === 0
      ? 0
      : Math.round(entries.reduce((s, e) => s + e.coherence, 0) / entries.length);
  const avgEfficiency =
    entries.length === 0
      ? 0
      : Math.round(entries.reduce((s, e) => s + e.efficiency, 0) / entries.length);
  const winRate =
    entries.length === 0
      ? 0
      : Math.round((entries.filter((e) => e.correct).length / entries.length) * 100);

  const biases = entries.filter((e) => e.bias).reduce<Record<string, number>>((acc, e) => {
    acc[e.bias as string] = (acc[e.bias as string] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="tf-grid-bg min-h-screen bg-background text-foreground">
      <TopBar />
      <div className="mx-auto max-w-4xl px-5 py-10">
        <Link
          to="/certification"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {t("common.hub")}
        </Link>

        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="label-mono mb-2 flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" /> {t("journal.title").toUpperCase()}
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              {t("journal.yourHistory")}{" "}
              <span className="text-gradient-gold">{t("journal.yourHistoryAccent")}</span>
            </h1>
          </div>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={() => {
                resetAll();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground transition-colors hover:border-bear/40 hover:text-bear"
            >
              <Trash2 className="h-3.5 w-3.5" /> {t("journal.reset")}
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
            <p className="text-muted-foreground">
              {t("journal.emptyCta")}
            </p>
            <Link
              to="/certification/$level/$n"
              params={{ level: "premium", n: "1" }}
              className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              {t("journal.startPremium")}
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 grid gap-3 sm:grid-cols-4">
              {[
                { label: t("journal.entries"), value: `${entries.length}` },
                { label: t("journal.hitRate"), value: `${winRate}%` },
                { label: t("journal.avgCoherence"), value: `${avgCoherence}%` },
                { label: t("journal.avgEfficiency"), value: `${avgEfficiency}%` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-surface/60 p-4">
                  <div className="label-mono mb-1 text-muted-foreground">{s.label}</div>
                  <div className="font-display text-2xl font-bold tabular-nums text-primary">{s.value}</div>
                </div>
              ))}
            </div>

            {/* Biases */}
            {Object.keys(biases).length > 0 && (
              <div className="mb-8 rounded-xl border border-primary/25 bg-primary/5 p-5">
                <div className="label-mono mb-2 text-primary">{t("journal.recurringBias")}</div>
                <ul className="space-y-1.5">
                  {Object.entries(biases).map(([bias, count]) => (
                    <li key={bias} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/90">{biasLabel(bias)}</span>
                      <span className="font-mono text-xs text-muted-foreground">×{count}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Entries */}
            <div className="space-y-4">
              {entries.map((e, i) => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.04, 0.3) }}
                  className="rounded-xl border border-border bg-surface/60 p-5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] text-muted-foreground">
                      {t(`levels.${e.level}.name`)}
                    </span>
                    <span className="font-mono text-sm font-semibold">{e.symbol}</span>
                    <span className="text-sm text-muted-foreground">{e.title}</span>
                    <span className="ml-auto flex items-center gap-1.5 text-sm">
                      <DirIcon dir={e.direction} /> {dirLabel(e.direction)}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-semibold",
                        e.correct ? "bg-bull/15 text-bull" : "bg-bear/15 text-bear",
                      )}
                    >
                      {e.correct ? t("journal.aligned") : t("journal.divergent")}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      {t("metrics.coherence")} <span className="font-mono text-primary">{e.coherence}%</span>
                    </span>
                    <span>
                      {t("metrics.efficiency")} <span className="font-mono text-primary">{e.efficiency}%</span>
                    </span>
                    <span>{new Date(e.at).toLocaleDateString()}</span>
                  </div>

                  {e.reasoning.length > 0 && (
                    <div className="mt-3 border-t border-border pt-3">
                      <div className="label-mono mb-2 text-muted-foreground">{t("journal.declared")}</div>
                      <div className="flex flex-wrap gap-2">
                        {e.reasoning.map((r) => (
                          <span
                            key={r.cardId}
                            className="rounded-md border border-border bg-surface px-2 py-1 text-xs"
                          >
                            <span className="font-mono font-semibold">
                              {getCard(r.cardId)?.ticker ?? r.cardId}
                            </span>
                            <span className="text-muted-foreground"> · {roleLabel(r.role)}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {e.bias && (
                    <div className="mt-3 text-xs text-[var(--gold)]">⚠ {biasLabel(e.bias)}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
