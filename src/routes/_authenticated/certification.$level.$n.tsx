import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Stars } from "@/components/certification/Stars";
import { StandardRun } from "@/components/certification/StandardRun";
import { WorkspaceRun } from "@/components/certification/WorkspaceRun";
import { LEVEL_META, type Level } from "@/lib/certification/types";
import { getScenario, getScenarios } from "@/lib/certification/scenarios";

export const Route = createFileRoute("/_authenticated/certification/$level/$n")({
  component: Runner,
});

const VALID: Level[] = ["standard", "high", "premium"];

function Runner() {
  const { level, n } = Route.useParams();
  const navigate = useNavigate();

  const lvl = level as Level;
  const index = Number(n);

  if (!VALID.includes(lvl) || !Number.isFinite(index)) {
    return <NotValid />;
  }

  const total = getScenarios(lvl).length;
  const scenario = getScenario(lvl, index);
  const meta = LEVEL_META[lvl];

  if (!scenario) return <NotValid />;

  const isLast = index >= total;
  const onNext = () => {
    if (isLast) {
      navigate({ to: "/certification" });
    } else {
      navigate({ to: "/certification/$level/$n", params: { level: lvl, n: String(index + 1) } });
    }
  };

  return (
    <div className="tf-grid-bg min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-3.5">
          <Link
            to="/certification"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Hub
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold">{meta.name}</span>
            <Stars count={meta.stars} />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="font-mono text-xs text-muted-foreground">
              Scénario {index}/{total}
            </span>
            <div className="hidden h-1.5 w-28 overflow-hidden rounded-full bg-border sm:block">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-primary"
                style={{ width: `${(index / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-6 sm:py-8">
        <div className="mb-5">
          <div className="label-mono mb-1 text-primary/80">{scenario.symbol}</div>
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {scenario.title}
          </h1>
        </div>

        {lvl === "standard" ? (
          <StandardRun key={scenario.id} scenario={scenario} isLast={isLast} onNext={onNext} />
        ) : (
          <WorkspaceRun key={scenario.id} scenario={scenario} isLast={isLast} onNext={onNext} />
        )}
      </main>
    </div>
  );
}

function NotValid() {
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">Scénario introuvable</h1>
        <Link to="/certification" className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline">
          ← Retour au hub
        </Link>
      </div>
    </div>
  );
}
