import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowRight, Layers, Activity, Target } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TradForge · Analyse Fondamentale" },
      {
        name: "description",
        content:
          "Le laboratoire interactif qui transforme la théorie en intuition. Certification finale de niveau institutionnel.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="tf-grid-bg relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <div className="label-mono flex items-center gap-2 text-primary">
              <span className="text-[var(--gold)]">✦</span> CHAPITRE 01 · MISSION CONTROL
            </div>
            <span className="rounded-full border border-primary/40 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
              ✦ World-Class Edition
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Analyse Fondamentale
          </h1>
          <p className="label-mono mt-4 text-primary/80">
            VOIR · MANIPULER · DÉCIDER · COMPRENDRE
          </p>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Le laboratoire interactif qui transforme la théorie en intuition. Pilotez un
            environnement d'analyse macro et micro-économique de niveau institutionnel.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/certification"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-[var(--gold)] to-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-[1.02]"
            >
              Démarrer la certification
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/journal"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-raised px-6 py-3.5 font-semibold transition-colors hover:bg-accent"
            >
              Decision Journal
            </Link>
          </div>

          <div className="mt-12 grid max-w-2xl gap-4 sm:grid-cols-3">
            {[
              { icon: Layers, value: "3", label: "Niveaux · mécaniques" },
              { icon: Activity, value: "30", label: "Scénarios de marché" },
              { icon: Target, value: "5★", label: "Reasoning Engine" },
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
        </motion.div>
      </div>
    </div>
  );
}
