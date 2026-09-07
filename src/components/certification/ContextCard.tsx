import { useState } from "react";
import { useI18n } from "@/lib/i18n";
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
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CATEGORY_LABELS,
  type CardRenderMode,
  type CardTimeframe,
  type ContextCardDataset,
  type ContextCardTemplate,
  type Direction,
} from "@/lib/certification/types";

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

function toneVar(tone?: Direction) {
  return tone === "bull"
    ? "var(--bull)"
    : tone === "bear"
      ? "var(--bear)"
      : "var(--muted-foreground)";
}

const CYCLE_LABEL: Record<string, string> = { lead: "LEAD", coin: "COIN", lag: "LAG" };

function seriesToData(series: number[]) {
  return series.map((v, i) => ({ i, v }));
}

// ── Rail-card sparkline ──
function Sparkline({ series, tone }: { series: number[]; tone?: Direction }) {
  const color = toneVar(tone);
  const gid = `spark-${tone ?? "n"}`;
  return (
    <div className="h-9 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={seriesToData(series)} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={`url(#${gid})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

interface ContextCardProps {
  card: ContextCardTemplate;
  viewed: boolean;
  onOpen: () => void;
  /** analyst = graphical (Premium) · guided = text summary (High). */
  mode?: CardRenderMode;
}

export function ContextCard({ card, viewed, onOpen, mode = "guided" }: ContextCardProps) {
  const { t, cardText } = useI18n();
  const text = cardText(card.id);
  const Icon = CATEGORY_ICON[card.category];
  const ds = card.dataset;
  const analyst = mode === "analyst" && !!ds;

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
          {ds?.cycle ? (
            <span className="rounded-md border border-border px-1.5 py-0.5 font-mono text-[9px] tracking-wider text-muted-foreground">
              {CYCLE_LABEL[ds.cycle]}
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-md bg-accent px-1.5 py-0.5 text-[10px] text-muted-foreground">
              <Icon className="h-3 w-3" />
              {t(`cards.categories.${card.category}`)}
            </span>
          )}
        </div>
        {card.metric && (
          <span className={cn("font-mono text-sm font-semibold", toneClass(card.metricTone))}>
            {card.metric}
          </span>
        )}
      </div>

      <div className="font-display text-sm font-semibold">{text?.title ?? card.title}</div>

      {analyst ? (
        <>
          <Sparkline series={ds!.spark} tone={ds!.sparkTone} />
          <div className="mt-1 flex items-center justify-between">
            {ds!.deltaLabel && (
              <span className={cn("font-mono text-[11px]", toneClass(ds!.deltaTone))}>
                {ds!.deltaLabel}
              </span>
            )}
            <span className="label-mono text-[9px] text-muted-foreground/70">
              {viewed ? "consultée ✓" : "cliquer pour ouvrir"}
            </span>
          </div>
        </>
      ) : (
        <div className="mt-0.5 text-xs text-muted-foreground">{text?.summary ?? card.summary}</div>
      )}
    </motion.button>
  );
}

// ── Analyst modal chart ──
function AnalystChart({ tf, unit }: { tf: CardTimeframe; unit?: string }) {
  const data = seriesToData(tf.series);
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, bottom: 4, left: -8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
          <XAxis dataKey="i" hide />
          <YAxis
            width={44}
            domain={["auto", "auto"]}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickFormatter={(v) => `${v}${unit === "%" ? "%" : ""}`}
          />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
            formatter={(v: number | string) => [`${v}${unit ? ` ${unit}` : ""}`, "·"]}
          />
          {(tf.levels ?? []).map((lvl, i) => (
            <ReferenceLine
              key={i}
              y={lvl.value}
              stroke={toneVar(lvl.tone)}
              strokeDasharray="4 4"
              strokeOpacity={0.7}
              label={{
                value: lvl.label,
                position: "insideTopRight",
                fill: toneVar(lvl.tone),
                fontSize: 9,
              }}
            />
          ))}
          <Line
            type="monotone"
            dataKey="v"
            stroke="var(--gold)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function VerdictBadge({ ds }: { ds: ContextCardDataset }) {
  if (!ds.verdict) return null;
  const map = {
    beat: { label: "BEAT", cls: "border-bull/40 bg-bull/10 text-bull" },
    miss: { label: "MISS", cls: "border-bear/40 bg-bear/10 text-bear" },
    inline: { label: "INLINE", cls: "border-border bg-accent text-muted-foreground" },
  } as const;
  const v = map[ds.verdict];
  return (
    <span className={cn("rounded-md border px-2 py-0.5 font-mono text-[10px] tracking-wider", v.cls)}>
      {v.label}
    </span>
  );
}

interface ContextCardModalProps {
  card: ContextCardTemplate | null;
  cardNumber?: number;
  cardTotal?: number;
  mode?: CardRenderMode;
  onClose: () => void;
}

export function ContextCardModal({
  card,
  cardNumber,
  cardTotal,
  mode = "guided",
  onClose,
}: ContextCardModalProps) {
  const { t, cardText } = useI18n();
  const text = card ? cardText(card.id) : undefined;
  const ds = card?.dataset;
  const analyst = mode === "analyst" && !!ds && !!ds.timeframes?.length;
  const [tfIndex, setTfIndex] = useState(2); // default "Daily"

  const tfs = ds?.timeframes ?? [];
  const activeTf = tfs[Math.min(tfIndex, Math.max(tfs.length - 1, 0))];

  return (
    <Dialog open={!!card} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className={cn("border-border bg-popover", analyst ? "max-w-2xl" : "max-w-lg")}>
        {card && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <span className="font-mono text-base font-semibold">{card.ticker}</span>
                <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] text-muted-foreground">
                  {t(`cards.categories.${card.category}`)}
                </span>
                {ds && <VerdictBadge ds={ds} />}
                {cardNumber && cardTotal && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Card {cardNumber} of {cardTotal}
                  </span>
                )}
              </div>
              <DialogTitle className="font-display text-xl">{text?.title ?? card.title}</DialogTitle>
            </DialogHeader>

            {analyst ? (
              <div className="space-y-4 py-1">
                {/* actual / consensus / previous */}
                {(ds!.actual || ds!.consensus) && (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { k: "Actual", v: ds!.actual, tone: ds!.deltaTone },
                      { k: "Consensus", v: ds!.consensus },
                      { k: "Prev.", v: ds!.previous },
                    ]
                      .filter((x) => x.v)
                      .map((x) => (
                        <div key={x.k} className="rounded-lg border border-border bg-surface p-2.5">
                          <div className="label-mono text-[9px] text-muted-foreground">{x.k}</div>
                          <div className={cn("font-mono text-sm font-semibold", toneClass(x.tone))}>
                            {x.v}
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                {/* multi-timeframe toggle */}
                <div className="flex items-center gap-1.5">
                  {tfs.map((tf, i) => (
                    <button
                      key={tf.label}
                      type="button"
                      onClick={() => setTfIndex(i)}
                      className={cn(
                        "rounded-md border px-2.5 py-1 font-mono text-[11px] transition-colors",
                        i === tfIndex
                          ? "border-primary/60 bg-primary/15 text-primary"
                          : "border-border text-muted-foreground hover:bg-accent",
                      )}
                    >
                      {tf.label}
                    </button>
                  ))}
                </div>

                {activeTf && <AnalystChart tf={activeTf} unit={ds!.unit} />}

                {/* stats grid */}
                {ds!.stats && ds!.stats.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {ds!.stats.map((s, i) => (
                      <div key={i} className="rounded-lg border border-border bg-surface p-2.5">
                        <div className="label-mono text-[9px] text-muted-foreground">{s.label}</div>
                        <div className={cn("font-mono text-sm font-semibold", toneClass(s.tone))}>
                          {s.value}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <p className="border-t border-border/60 pt-3 text-center text-xs italic text-muted-foreground/70">
                  {t("cards.rawData")}
                </p>
              </div>
            ) : (
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
            )}

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
