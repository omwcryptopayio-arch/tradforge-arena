import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, Lock, CheckCircle2 } from "lucide-react";
import { Stars } from "@/components/certification/Stars";
import { CertificatePanel } from "@/components/certification/CertificatePanel";
import { TopBar } from "@/components/certification/TopBar";
import { LEVEL_META, type Level } from "@/lib/certification/types";
import { getScenarios } from "@/lib/certification/scenarios";
import { levelSummary, type LevelSummary } from "@/lib/certification/storage";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/certification/")({
  head: () => ({
    meta: [
      { title: "Final certification · TradeForge Arena" },
      {
        name: "description",
        content: "Four-level final certification: Standard, High, Premium, Elite.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:title", content: "Final certification · TradeForge Arena" },
      {
        property: "og:description",
        content: "Move from scripted replay to measured institutional reasoning.",
      },
    ],
  }),
  component: Hub,
});

const LEVELS: Level[] = ["standard", "high", "premium"];

function Hub() {
  const { t } = useI18n();
  const [summaries, setSummaries] = useState<Record<Level, LevelSummary>>();

  useEffect(() => {
    const refresh = () =>
      setSummaries({
        standard: levelSummary("standard", getScenarios("standard").length),
        high: levelSummary("high", getScenarios("high").length),
        premium: levelSummary("premium", getScenarios("premium").length),
      });
    refresh();
    window.addEventListener("tradforge:storage", refresh);
    return () => window.removeEventListener("tradforge:storage", refresh);
  }, []);

  return (
    <div className="tf-grid-bg min-h-screen bg-background text-foreground">
      <TopBar journalLink />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
        {/* Hero */}
        <div className="mb-10">
          <div className="label-mono mb-3 flex items-center gap-2 text-primary">
            <span className="text-[var(--gold)]">✦</span> {t("hub.eyebrow")}
          </div>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {t("hub.title")} <span className="text-gradient-gold">{t("hub.titleAccent")}</span>
          </h1>
          <p className="label-mono mt-3 text-primary/80">{t("landing.tagline")}</p>
          <p className="mt-4 max-w-2xl text-muted-foreground">{t("hub.lede")}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
            >
              <BookOpen className="h-4 w-4" /> {t("common.journal")}
            </Link>
          </div>
        </div>

        {/* Level cards */}
        <div className="grid gap-5 lg:grid-cols-3">
          {LEVELS.map((level, i) => {
            const meta = LEVEL_META[level];
            const total = getScenarios(level).length;
            const summary = summaries?.[level];
            const done = summary ? summary.completed >= total : false;
            const locked = false; // free navigation this cycle
            return (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Link
                  to="/certification/$level/$n"
                  params={{ level, n: "1" }}
                  disabled={locked}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface/70 p-6 transition-colors hover:border-primary/40 hover:bg-surface-raised"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <Stars count={meta.stars} />
                    {locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : done ? (
                      <CheckCircle2 className="h-5 w-5 text-bull" />
                    ) : null}
                  </div>
                  <h2 className="font-display text-2xl font-bold">
                    {t(`levels.${level}.name`)}
                  </h2>
                  <div className="label-mono mt-1 text-primary/80">
                    {t(`levels.${level}.tagline`)}
                  </div>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {t(`levels.${level}.blurb`)}
                  </p>

                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">{t("common.progression")}</span>
                      <span className="font-mono tabular-nums">
                        {summary?.completed ?? 0}/{total}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-primary transition-all"
                        style={{ width: `${((summary?.completed ?? 0) / total) * 100}%` }}
                      />
                    </div>
                    {summary && summary.completed > 0 && (
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t("hub.aggregate")}</span>
                        <span className="font-mono tabular-nums text-primary">
                          {summary.aggregatePct}%
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    {summary && summary.completed > 0 ? t("common.continue") : t("common.start")}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Rules */}
        <div className="mt-10 rounded-2xl border border-border bg-surface/60 p-6">
          <div className="label-mono mb-3 text-primary">{t("hub.ruleTitle")}</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>› {t("hub.rule1")}</li>
            <li>› {t("hub.rule2")}</li>
            <li>› {t("hub.rule3")}</li>
          </ul>
        </div>

        <CertificatePanel />
      </div>
    </div>
  );
}
