import { Timer, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { formatClock, type DecisionTimerState } from "@/hooks/useDecisionTimer";

/**
 * Compact premium countdown HUD. Turns red and shows an overtime badge once the
 * budget is exceeded — pressure without blocking the decision.
 */
export function DecisionTimer({ state }: { state: DecisionTimerState }) {
  const { t } = useI18n();
  const { remainingMs, overtime } = state;
  const near = !overtime && remainingMs <= 20_000;
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm transition-colors",
        overtime
          ? "border-bear/60 bg-bear/10 text-bear"
          : near
            ? "border-primary/50 bg-primary/10 text-primary"
            : "border-border bg-surface text-foreground",
      )}
      role="timer"
      aria-live="off"
    >
      {overtime ? <AlertTriangle className="h-3.5 w-3.5" /> : <Timer className="h-3.5 w-3.5" />}
      <span className="font-semibold tabular-nums">{formatClock(remainingMs)}</span>
      {overtime && (
        <span className="label-mono text-[9px] uppercase tracking-wide">{t("timer.overtime")}</span>
      )}
    </div>
  );
}
