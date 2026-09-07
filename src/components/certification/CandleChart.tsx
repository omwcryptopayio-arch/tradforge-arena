import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RotateCcw, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import {
  buildChartGeometry,
  formatPrice,
  type ChartGeometry,
} from "@/lib/certification/market-data";
import type { ChartSpec } from "@/lib/certification/types";

const VB_W = 1000;
const VB_H = 380;
const PAD_R = 74; // price axis gutter
const PAD_L = 8;
const PAD_T = 16;
const PAD_B = 14;

interface CandleChartProps {
  spec: ChartSpec;
  /** Max number of candles the user is allowed to reveal (no spoilers). */
  maxReveal: number;
  autoPlay?: boolean;
  onReachMax?: () => void;
  className?: string;
}

export function CandleChart({
  spec,
  maxReveal,
  autoPlay = true,
  onReachMax,
  className,
}: CandleChartProps) {
  const geo: ChartGeometry = useMemo(() => buildChartGeometry(spec), [spec]);
  const total = geo.candles.length;
  const cap = Math.min(maxReveal, total);

  const [cur, setCur] = useState(autoPlay ? 1 : cap);
  const [playing, setPlaying] = useState(autoPlay);
  const reachedRef = useRef(false);

  // When the allowed reveal grows (e.g. outcome phase), animate up to it.
  useEffect(() => {
    reachedRef.current = false;
    setPlaying(true);
    setCur((c) => Math.min(c, cap));
  }, [cap]);

  useEffect(() => {
    if (!playing) return;
    if (cur >= cap) {
      setPlaying(false);
      if (!reachedRef.current) {
        reachedRef.current = true;
        onReachMax?.();
      }
      return;
    }
    const id = setTimeout(() => setCur((c) => Math.min(c + 1, cap)), 55);
    return () => clearTimeout(id);
  }, [playing, cur, cap, onReachMax]);

  const scaleX = useCallback(
    (i: number) => {
      const plotW = VB_W - PAD_L - PAD_R;
      return PAD_L + (plotW * (i + 0.5)) / total;
    },
    [total],
  );
  const scaleY = useCallback(
    (price: number) => {
      const plotH = VB_H - PAD_T - PAD_B;
      return PAD_T + (plotH * (geo.max - price)) / (geo.max - geo.min);
    },
    [geo.max, geo.min],
  );

  const candleW = ((VB_W - PAD_L - PAD_R) / total) * 0.62;
  const visible = geo.candles.slice(0, cur);
  const shockRevealed = cur > spec.shockAt;
  const winEnd = spec.decisionWindowEnd;
  const winEndRevealed = winEnd != null && cur > winEnd;
  const lastVisible = visible[visible.length - 1];
  const shownLast = lastVisible ? lastVisible.c : geo.candles[0].o;
  const shownChange =
    ((shownLast - geo.candles[0].o) / geo.candles[0].o) * 100;

  // HUD reveal: available once the full series is on screen (outcome phase).
  const fullyRevealed = cur >= total;
  const pipFactor = Math.pow(10, spec.precision === 2 || spec.precision === 3 ? 2 : 4);
  const eventClose = geo.candles[spec.shockAt]?.c ?? geo.candles[0].o;
  const finalClose = geo.candles[total - 1].c;
  const realizedPips = Math.round((finalClose - eventClose) * pipFactor);
  const finalDir = realizedPips > 3 ? "bull" : realizedPips < -3 ? "bear" : "neutral";

  const replay = () => {
    reachedRef.current = false;
    setCur(1);
    setPlaying(true);
  };

  return (
    <div className={cn("rounded-xl border border-border bg-surface/60 p-3 sm:p-4", className)}>
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-lg font-bold tracking-tight">{spec.symbol}</span>
          <span className="text-xs text-muted-foreground">{spec.period}</span>
        </div>
        <div className="flex items-baseline gap-2 font-mono">
          <span className="text-base font-semibold tabular-nums">
            {formatPrice(shownLast, spec.precision)}
          </span>
          <span
            className={cn(
              "text-xs font-semibold tabular-nums",
              shownChange >= 0 ? "text-bull" : "text-bear",
            )}
          >
            {shownChange >= 0 ? "+" : ""}
            {shownChange.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Chart */}
      <svg
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        className="h-[280px] w-full sm:h-[320px]"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${spec.symbol} candle replay`}
      >
        {/* gridlines + price ticks */}
        {geo.priceTicks.map((p, k) => {
          const y = scaleY(p);
          return (
            <g key={k}>
              <line
                x1={PAD_L}
                x2={VB_W - PAD_R}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-border"
                strokeWidth={1}
              />
              <text
                x={VB_W - PAD_R + 8}
                y={y + 3}
                className="fill-muted-foreground font-mono"
                fontSize={11}
              >
                {formatPrice(p, spec.precision)}
              </text>
            </g>
          );
        })}

        {/* support / resistance */}
        {spec.support != null && (
          <Level y={scaleY(spec.support)} label={spec.supportLabel ?? t("chart.support")} tone="bull" />
        )}
        {spec.resistance != null && (
          <Level y={scaleY(spec.resistance)} label={spec.resistanceLabel ?? t("chart.resistance")} tone="bear" />
        )}

        {/* decision / event line */}
        {shockRevealed && (
          <g>
            <line
              x1={scaleX(spec.shockAt)}
              x2={scaleX(spec.shockAt)}
              y1={PAD_T}
              y2={VB_H - PAD_B}
              stroke="var(--gold)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.85}
            />
            <circle cx={scaleX(spec.shockAt)} cy={PAD_T} r={3} fill="var(--gold)" />
            <text
              x={scaleX(spec.shockAt) + 6}
              y={PAD_T + 10}
              className="fill-[var(--gold)] font-mono"
              fontSize={11}
            >
              {spec.eventLabel}
            </text>
          </g>
        )}

        {/* 2nd delimiter — end of analysis window */}
        {winEndRevealed && winEnd != null && (
          <g>
            <rect
              x={scaleX(winEnd)}
              y={PAD_T}
              width={Math.max(0, VB_W - PAD_R - scaleX(winEnd))}
              height={VB_H - PAD_T - PAD_B}
              fill="var(--muted-foreground)"
              opacity={0.06}
            />
            <line
              x1={scaleX(winEnd)}
              x2={scaleX(winEnd)}
              y1={PAD_T}
              y2={VB_H - PAD_B}
              stroke="var(--muted-foreground)"
              strokeWidth={1.25}
              strokeDasharray="2 4"
              opacity={0.7}
            />
            <text
              x={scaleX(winEnd) + 6}
              y={PAD_T + 24}
              className="fill-muted-foreground font-mono"
              fontSize={10}
            >
              Fin fenêtre d'analyse
            </text>
          </g>
        )}

        {/* technical annotations (break / retest / zone) */}
        {(spec.techAnnotations ?? []).map((a, k) => {
          const tone =
            a.tone === "danger" || a.tone === "bear"
              ? "var(--bear)"
              : a.tone === "bull"
                ? "var(--bull)"
                : a.tone === "muted"
                  ? "var(--muted-foreground)"
                  : "var(--primary)";
          if (a.kind === "zone" && a.fromIndex != null && a.toIndex != null) {
            if (cur <= a.fromIndex) return null;
            const x = scaleX(a.fromIndex);
            const w = scaleX(a.toIndex) - x;
            return (
              <g key={k}>
                <rect x={x} y={PAD_T} width={w} height={VB_H - PAD_T - PAD_B} fill={tone} opacity={0.08} />
                <text x={x + 4} y={PAD_T + 12} fill={tone} className="font-mono" fontSize={9}>
                  {a.label}
                </text>
              </g>
            );
          }
          if (a.atIndex != null) {
            if (cur <= a.atIndex) return null;
            const x = scaleX(a.atIndex);
            return (
              <g key={k}>
                <line x1={x} x2={x} y1={PAD_T} y2={VB_H - PAD_B} stroke={tone} strokeWidth={1} strokeDasharray="1 3" opacity={0.6} />
                <circle cx={x} cy={VB_H - PAD_B - 6} r={2.5} fill={tone} />
                <text x={x + 4} y={VB_H - PAD_B - 8} fill={tone} className="font-mono" fontSize={9}>
                  {a.label}
                </text>
              </g>
            );
          }
          return null;
        })}

        {/* candles */}
        {visible.map((c) => {
          const x = scaleX(c.i);
          const color = c.bullish ? "var(--bull)" : "var(--bear)";
          const yHigh = scaleY(c.h);
          const yLow = scaleY(c.l);
          const yO = scaleY(c.o);
          const yC = scaleY(c.c);
          const bodyTop = Math.min(yO, yC);
          const bodyH = Math.max(1.5, Math.abs(yC - yO));
          const postWindow = winEnd != null && c.i > winEnd;
          return (
            <g key={c.i} opacity={postWindow ? 0.4 : 1}>
              <line x1={x} x2={x} y1={yHigh} y2={yLow} stroke={color} strokeWidth={1.2} />
              <rect
                x={x - candleW / 2}
                y={bodyTop}
                width={candleW}
                height={bodyH}
                fill={color}
                rx={0.5}
              />
            </g>
          );
        })}
      </svg>

      {/* HUD reveal — shown once the full series is on screen (outcome) */}
      {fullyRevealed && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            { label: t("chart.window"), value: `${spec.shockAt}–${winEnd ?? total}` },
            { label: t("chart.candles"), value: `${total}` },
            {
              label: t("chart.pips"),
              value: `${realizedPips >= 0 ? "+" : ""}${realizedPips}`,
              tone: finalDir,
            },
            {
              label: t("chart.direction"),
              value: dirLabel(finalDir),
              tone: finalDir,
            },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-border bg-surface p-2.5">
              <div className="label-mono text-[9px] text-muted-foreground">{m.label}</div>
              <div
                className={cn(
                  "font-mono text-sm font-semibold",
                  m.tone === "bull"
                    ? "text-bull"
                    : m.tone === "bear"
                      ? "text-bear"
                      : "text-foreground",
                )}
              >
                {m.value}
              </div>
            </div>
          ))}
        </div>
      )}



      {/* Replay control */}
      <div className="mt-3 flex items-center gap-3">
        <button
          type="button"
          onClick={replay}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[var(--gold)] to-primary text-primary-foreground shadow-[var(--shadow-gold)] transition-transform hover:scale-105 active:scale-95"
          aria-label={t("chart.replay")}
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setPlaying((p) => !p)}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-border bg-surface-raised text-foreground transition-colors hover:bg-accent"
          aria-label={playing ? t("chart.pause") : t("chart.play")}
        >
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
        <input
          type="range"
          min={1}
          max={cap}
          value={cur}
          onChange={(e) => {
            setPlaying(false);
            setCur(Number(e.target.value));
          }}
          className="tf-range h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-border"
          aria-label={t("chart.progress")}
        />
        <span className="w-14 text-right font-mono text-xs tabular-nums text-muted-foreground">
          {cur}/{cap}
        </span>
      </div>
    </div>
  );
}

function Level({ y, label, tone }: { y: number; label: string; tone: "bull" | "bear" }) {
  const color = tone === "bull" ? "var(--bull)" : "var(--bear)";
  return (
    <g opacity={0.75}>
      <line
        x1={PAD_L}
        x2={VB_W - PAD_R}
        y1={y}
        y2={y}
        stroke={color}
        strokeWidth={1}
        strokeDasharray="6 5"
      />
      <text x={PAD_L + 4} y={y - 4} fill={color} className="font-mono" fontSize={10}>
        {label}
      </text>
    </g>
  );
}
