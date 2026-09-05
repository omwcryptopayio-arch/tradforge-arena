import { motion } from "motion/react";
import { TrendingUp } from "lucide-react";
import type { ChartSpec } from "@/lib/certification/types";
import { useI18n } from "@/lib/i18n";

interface ReplayLoaderProps {
  spec: ChartSpec;
  onLoad: () => void;
  /** Override the default "Load replay" label (e.g. "Replay again"). */
  label?: string;
}

/**
 * Premium "trading desk" idle screen. The replay engine is NOT mounted until
 * the user deliberately loads it — this frames the scenario as entering a real
 * institutional workstation rather than a passive animation.
 */
export function ReplayLoader({ spec, onLoad, label }: ReplayLoaderProps) {
  const { t } = useI18n();
  const text = label ?? t("replay.load");
  return (
    <button
      type="button"
      onClick={onLoad}
      className="group block w-full rounded-xl border border-border bg-surface/60 p-3 text-left sm:p-4"
      aria-label={text}
    >
      {/* Chart chrome mirrors CandleChart header so there is no layout jump. */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold tracking-tight">{spec.symbol}</span>
          <span className="text-xs text-muted-foreground">{spec.period}</span>
        </div>
        <span className="label-mono text-primary/70">{t("replay.standby")}</span>
      </div>

      <div className="grid h-[280px] place-items-center rounded-lg border border-dashed border-primary/30 bg-[radial-gradient(circle_at_50%_40%,color-mix(in_oklab,var(--gold)_10%,transparent),transparent_70%)] sm:h-[320px]">
        <div className="flex flex-col items-center gap-3 text-center">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-[var(--gold)] to-primary text-primary-foreground shadow-[var(--shadow-gold)] transition-transform group-hover:scale-105"
          >
            <TrendingUp className="h-7 w-7" />
          </motion.div>
          <div className="font-display text-xl font-bold">{text}</div>
          <div className="label-mono text-muted-foreground">
            {spec.symbol} · {spec.period.split("·").pop()?.trim() || "Candlesticks"} · {spec.candles} {t("replay.candles")}
          </div>
        </div>
      </div>

      <div className="mt-3 h-9 rounded-lg border border-border bg-surface-raised/60" aria-hidden />
    </button>
  );
}
