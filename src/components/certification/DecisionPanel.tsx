import { useState } from "react";
import { TrendingUp, TrendingDown, Minus, Clock } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Direction } from "@/lib/certification/types";

const OPTIONS: {
  dir: Direction;
  label: string;
  sub: string;
  icon: typeof TrendingUp;
  tone: string;
}[] = [
  { dir: "bull", label: "Bullish", sub: "Expect price to go up", icon: TrendingUp, tone: "bull" },
  { dir: "neutral", label: "Neutral", sub: "No clear direction", icon: Minus, tone: "neutral" },
  { dir: "bear", label: "Bearish", sub: "Expect price to go down", icon: TrendingDown, tone: "bear" },
];

export function DecisionPanel({ onDecide }: { onDecide: (d: Direction) => void }) {
  const [armed, setArmed] = useState<Direction | null>(null);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold">Your Decision</h3>
        {armed && (
          <span className="flex items-center gap-1.5 text-sm text-primary">
            <Clock className="h-3.5 w-3.5" /> Clique à nouveau pour confirmer
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
              <div className="font-display text-base font-semibold">{o.label}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{o.sub}</div>
              {isArmed && <div className="mt-2 text-xs font-semibold text-primary">Confirm?</div>}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
