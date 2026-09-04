import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BookOpen, Trash2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIRECTION_LABELS, LEVEL_META, type Direction } from "@/lib/certification/types";
import { getCard } from "@/lib/certification/cards";
import { REASONING_ROLES } from "@/lib/certification/engine";
import { getJournal, resetAll, type JournalEntry } from "@/lib/certification/storage";

export const Route = createFileRoute("/_authenticated/journal")({
  head: () => ({
    meta: [{ title: "Decision Journal · TradForge" }],
  }),
  component: Journal,
});

function roleLabel(role: string | null) {
  return REASONING_ROLES.find((r) => r.value === role)?.label ?? "—";
}

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
      <div className="mx-auto max-w-4xl px-5 py-12">
        <Link
          to="/certification"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Hub
        </Link>

        <div className="mb-8 flex items-end justify-between">
          <div>
            <div className="label-mono mb-2 flex items-center gap-2 text-primary">
              <BookOpen className="h-4 w-4" /> DECISION JOURNAL
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Ton <span className="text-gradient-gold">historique</span>
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
              <Trash2 className="h-3.5 w-3.5" /> Réinitialiser
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
            <p className="text-muted-foreground">
              Aucune décision enregistrée. Termine un scénario Premium pour construire ton journal.
            </p>
            <Link
              to="/certification/$level/$n"
              params={{ level: "premium", n: "1" }}
              className="mt-4 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Démarrer le niveau Premium →
            </Link>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="mb-8 grid gap-3 sm:grid-cols-4">
              {[
                { label: "Décisions", value: `${entries.length}` },
                { label: "Réussite", value: `${winRate}%` },
                { label: "Cohérence moy.", value: `${avgCoherence}%` },
                { label: "Efficacité moy.", value: `${avgEfficiency}%` },
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
                <div className="label-mono mb-2 text-primary">Biais récurrents détectés</div>
                <ul className="space-y-1.5">
                  {Object.entries(biases).map(([bias, count]) => (
                    <li key={bias} className="flex items-center justify-between text-sm">
                      <span className="text-foreground/90">{bias}</span>
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
                      {LEVEL_META[e.level].name}
                    </span>
                    <span className="font-mono text-sm font-semibold">{e.symbol}</span>
                    <span className="text-sm text-muted-foreground">{e.title}</span>
                    <span className="ml-auto flex items-center gap-1.5 text-sm">
                      <DirIcon dir={e.direction} /> {DIRECTION_LABELS[e.direction]}
                    </span>
                    <span
                      className={cn(
                        "rounded-md px-2 py-0.5 text-xs font-semibold",
                        e.correct ? "bg-bull/15 text-bull" : "bg-bear/15 text-bear",
                      )}
                    >
                      {e.correct ? "Aligné" : "Divergent"}
                    </span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      Cohérence <span className="font-mono text-primary">{e.coherence}%</span>
                    </span>
                    <span>
                      Efficacité <span className="font-mono text-primary">{e.efficiency}%</span>
                    </span>
                    <span>{new Date(e.at).toLocaleDateString()}</span>
                  </div>

                  {e.reasoning.length > 0 && (
                    <div className="mt-3 border-t border-border pt-3">
                      <div className="label-mono mb-2 text-muted-foreground">Raisonnement déclaré</div>
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
                    <div className="mt-3 text-xs text-[var(--gold)]">⚠ {e.bias}</div>
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
