import { BarChart3, Scale, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type Phase = "research" | "decision" | "reasoning" | "results";

const STEPS: { key: Phase; label: string; icon: typeof BarChart3 }[] = [
  { key: "research", label: "Research", icon: BarChart3 },
  { key: "decision", label: "Decision", icon: Scale },
  { key: "results", label: "Results", icon: CheckCircle2 },
];

const ORDER: Phase[] = ["research", "decision", "reasoning", "results"];

export function Stepper({ current }: { current: Phase }) {
  const currentIdx = ORDER.indexOf(current);
  return (
    <div className="flex items-center gap-2">
      {STEPS.map((step, i) => {
        // reasoning collapses under "decision" visually
        const stepIdx = ORDER.indexOf(step.key);
        const active = current === step.key || (current === "reasoning" && step.key === "decision");
        const done = currentIdx > stepIdx && !(current === "reasoning" && step.key === "decision");
        const Icon = step.icon;
        return (
          <div key={step.key} className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                active
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : done
                    ? "border-border bg-surface-raised text-foreground"
                    : "border-border bg-surface text-muted-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {step.label}
            </div>
            {i < STEPS.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>
        );
      })}
    </div>
  );
}
