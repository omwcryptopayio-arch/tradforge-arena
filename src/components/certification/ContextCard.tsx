import { motion } from "motion/react";
import { CheckCircle2, Circle } from "lucide-react";
import {
  BarChart3,
  Newspaper,
  Globe2,
  Landmark,
  Activity,
  ArrowLeftRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CATEGORY_LABELS, type ContextCardTemplate, type Direction } from "@/lib/certification/types";

const CATEGORY_ICON = {
  fundamentals: BarChart3,
  technicals: Activity,
  news: Newspaper,
  macro: Landmark,
  intermarket: ArrowLeftRight,
  centralbank: Landmark,
  geopolitics: Globe2,
} as const;

function toneClass(tone?: Direction) {
  return tone === "bull" ? "text-bull" : tone === "bear" ? "text-bear" : "text-neutral";
}

interface ContextCardProps {
  card: ContextCardTemplate;
  viewed: boolean;
  onOpen: () => void;
}

export function ContextCard({ card, viewed, onOpen }: ContextCardProps) {
  const Icon = CATEGORY_ICON[card.category];
  return (
    <motion.button
      type="button"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.99 }}
      onClick={onOpen}
      className={cn(
        "group flex w-full flex-col rounded-xl border bg-surface p-4 text-left transition-colors",
        viewed ? "border-bull/30" : "border-border hover:border-border/90 hover:bg-surface-raised",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {viewed ? (
            <CheckCircle2 className="h-4 w-4 text-bull" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground/50" />
          )}
          <span className="font-mono text-sm font-semibold">{card.ticker}</span>
          <span className="flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">
            <Icon className="h-3 w-3" />
            {CATEGORY_LABELS[card.category]}
          </span>
        </div>
        {card.metric && (
          <span className={cn("font-mono text-sm font-semibold", toneClass(card.metricTone))}>
            {card.metric}
          </span>
        )}
      </div>
      <div className="font-display text-sm font-semibold">{card.title}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{card.summary}</div>
    </motion.button>
  );
}

interface ContextCardModalProps {
  card: ContextCardTemplate | null;
  cardNumber?: number;
  cardTotal?: number;
  onClose: () => void;
}

export function ContextCardModal({ card, cardNumber, cardTotal, onClose }: ContextCardModalProps) {
  return (
    <Dialog open={!!card} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg border-border bg-popover">
        {card && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-semibold">{card.ticker}</span>
                <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] text-muted-foreground">
                  {CATEGORY_LABELS[card.category]}
                </span>
                {cardNumber && cardTotal && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Card {cardNumber} of {cardTotal}
                  </span>
                )}
              </div>
              <DialogTitle className="font-display text-xl">{card.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-1">
              {card.metric && (
                <div className={cn("font-mono text-lg font-semibold", toneClass(card.metricTone))}>
                  {card.metric}
                </div>
              )}
              {card.detail.map((d, i) => (
                <div key={i}>
                  <div className="label-mono mb-1">{d.heading}</div>
                  <p className="text-sm leading-relaxed text-foreground/90">{d.body}</p>
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
