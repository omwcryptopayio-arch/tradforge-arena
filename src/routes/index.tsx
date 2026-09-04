import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Layers, Activity, Target, Loader2 } from "lucide-react";
import { TopBar } from "@/components/certification/TopBar";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/lib/auth/useAuth";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "TradeForge Arena · Fundamental Analysis Certification" },
      {
        name: "description",
        content:
          "The interactive lab that turns theory into instinct. Institutional-grade fundamental analysis certification.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "TradeForge Arena · Fundamental Analysis Certification" },
      {
        property: "og:description",
        content: "Four levels, four mechanics, one institutional certificate.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useI18n();
  const { isAccount, loading } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="tf-grid-bg relative min-h-screen bg-background text-foreground">
      <TopBar journalLink={isAccount} />
      <div className="mx-auto max-w-6xl px-5 py-10 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_420px]"
        >
          <div className="min-w-0">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <div className="label-mono flex items-center gap-2 text-primary">
                <span className="text-[var(--gold)]">✦</span> {t("landing.eyebrow")}
              </div>
              <span className="rounded-full border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                {t("landing.badge")}
              </span>
            </div>

            <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl">
              {t("landing.title")}
            </h1>
            <p className="label-mono mt-4 text-primary/80">{t("landing.tagline")}</p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {t("landing.lede")}
            </p>

            {isAccount && (
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/certification"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--gold)] to-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02]"
                >
                  {t("landing.ctaStart")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/journal"
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-6 py-3.5 font-semibold transition-colors hover:bg-accent"
                >
                  {t("common.journal")}
                </Link>
              </div>
            )}

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                { icon: Layers, value: "4", label: t("landing.statLevels") },
                { icon: Activity, value: "30", label: t("landing.statScenarios") },
                { icon: Target, value: "5★", label: t("landing.statReasoning") },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="rounded-xl border border-border bg-surface/60 p-5">
                    <Icon className="mb-3 h-5 w-5 text-primary" />
                    <div className="font-display text-3xl font-bold">{s.value}</div>
                    <div className="mt-0.5 text-sm text-muted-foreground">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mandatory auth gate: an unauthenticated visitor gets the account
              block immediately, never the platform. */}
          {!isAccount && (
            <div className="min-w-0">
              {loading ? (
                <div className="grid h-64 place-items-center rounded-2xl border border-border bg-surface-raised/60">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <h2 className="font-display text-lg font-bold">{t("auth.gateTitle")}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{t("auth.gateLede")}</p>
                  </div>
                  <AuthForm
                    initialMode="signup"
                    onAuthenticated={() => void navigate({ to: "/certification" })}
                  />
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    {t("auth.requiredNotice")}
                  </p>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
