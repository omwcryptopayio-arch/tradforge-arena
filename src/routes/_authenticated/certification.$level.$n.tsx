import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Stars } from "@/components/certification/Stars";
import { StandardRun } from "@/components/certification/StandardRun";
import { WorkspaceRun } from "@/components/certification/WorkspaceRun";
import { TopBar } from "@/components/certification/TopBar";
import { type Level, LEVEL_META } from "@/lib/certification/types";
import { getScenario, getScenarios } from "@/lib/certification/scenarios";
import { useI18n } from "@/lib/i18n";
import { useLocalizedScenario } from "@/lib/i18n/scenario";

export const Route = createFileRoute("/_authenticated/certification/$level/$n")({
  component: Runner,
});

const VALID: Level[] = ["standard", "high", "premium"];

function Runner() {
  const { level, n } = Route.useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const localize = useLocalizedScenario();

  const lvl = level as Level;
  const index = Number(n);
  const valid = VALID.includes(lvl) && Number.isFinite(index);

  const total = valid ? getScenarios(lvl).length : 0;
  const scenario = valid ? localize(getScenario(lvl, index)) : undefined;

  if (!valid || !scenario) return <NotValid />;

  const meta = LEVEL_META[lvl];
  const isLast = index >= total;
  const onNext = () => {
    if (isLast) {
      void navigate({ to: "/certification" });
    } else {
      void navigate({
        to: "/certification/$level/$n",
        params: { level: lvl, n: String(index + 1) },
      });
    }
  };

  return (
    <div className="tf-grid-bg min-h-screen bg-background text-foreground">
      <TopBar
        left={
          <Link
            to="/certification"
            className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">{t("common.hub")}</span>
          </Link>
        }
        center={
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="truncate font-display text-sm font-semibold">
              {t(`levels.${lvl}.name`)}
            </span>
            <span className="hidden sm:block">
              <Stars count={meta.stars} />
            </span>
            <span className="shrink-0 font-mono text-xs text-muted-foreground">
              {index}/{total}
            </span>
            <div className="hidden h-1.5 w-24 shrink-0 overflow-hidden rounded-full bg-border md:block">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--gold)] to-primary"
                style={{ width: `${(index / total) * 100}%` }}
              />
            </div>
          </div>
        }
      />

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-5 sm:py-8">
        <div className="mb-5">
          <div className="label-mono mb-1 text-primary/80">
            {t("common.scenario")} {index} · {scenario.symbol}
          </div>
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
  const { t } = useI18n();
  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-center">
      <div>
        <h1 className="font-display text-2xl font-bold text-foreground">{t("common.notFound")}</h1>
        <Link
          to="/certification"
          className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline"
        >
          {t("common.backToHub")}
        </Link>
      </div>
    </div>
  );
}
