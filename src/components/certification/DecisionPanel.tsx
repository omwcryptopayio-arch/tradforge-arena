import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Direction } from "@/lib/certification/types";
import { useI18n } from "@/lib/i18n";

const OPTIONS: {
  dir: Direction;
  labelKey: string;
  subKey: string;
  icon: typeof TrendingUp;
  tone: string;
}[] = [
  { dir: "bull", labelKey: "decision.bull", subKey: "decision.bullSub", icon: TrendingUp, tone: "bull" },
  { dir: "neutral", labelKey: "decision.neutral", subKey: "decision.neutralSub", icon: Minus, tone: "neutral" },
  { dir: "bear", labelKey: "decision.bear", subKey: "decision.bearSub", icon: TrendingDown, tone: "bear" },
];

export function DecisionPanel({ onDecide }: { onDecide: (d: Direction) => void }) {
  const { t } = useI18n();
  const [armed, setArmed] = useState<Direction | null>(null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">{t("decision.title")}</h3>
        {armed && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <Clock className="h-3.5 w-3.5" /> {t("decision.confirmHint")}
          </span>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {OPTIONS.map((o) => {
          const Icon = o.icon;
          const isArmed = armed === o.dir;
          return (
            <motion.button
              key={o.dir}
              type="button"
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => (isArmed ? onDecide(o.dir) : setArmed(o.dir))}
              className={cn(
                "group relative overflow-hidden rounded-xl border p-5 text-center transition-colors",
                isArmed
                  ? o.tone === "bull"
                    ? "border-bull/60 bg-bull/10 shadow-[var(--glow-bull)]"
                    : o.tone === "bear"
                      ? "border-bear/60 bg-bear/10 shadow-[var(--glow-bear)]"
                      : "border-primary/60 bg-primary/10"
                  : "border-border bg-surface hover:border-border/80 hover:bg-surface-raised",
              )}
            >
              <Icon
                className={cn(
                  "mx-auto mb-2 h-6 w-6",
                  o.tone === "bull" ? "text-bull" : o.tone === "bear" ? "text-bear" : "text-neutral",
                )}
              />
              <div className="font-display text-base font-semibold">{t(o.labelKey)}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{t(o.subKey)}</div>
              {isArmed && <div className="mt-2 text-xs font-semibold text-primary">{t("decision.confirm")}</div>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
