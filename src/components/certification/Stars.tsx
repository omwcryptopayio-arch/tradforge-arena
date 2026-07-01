import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`${count} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < count ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/40",
          )}
        />
      ))}
    </span>
  );
}
