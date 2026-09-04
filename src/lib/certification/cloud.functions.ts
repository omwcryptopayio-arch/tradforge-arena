// TradForge — Cloud persistence server functions (Lovable Cloud / Supabase).
// All functions run as the authenticated user (anonymous or named); RLS scopes
// every row to auth.uid(). These are the source of truth; the UI mirrors them
// into localStorage for synchronous reads (see storage.ts).

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const CHAPTER = "ch1";

const directionSchema = z.enum(["bull", "neutral", "bear"]);
const levelSchema = z.enum(["standard", "high", "premium"]);

const reasoningItemSchema = z.object({
  cardId: z.string(),
  role: z.string().nullable(),
  why: z.string(),
  changedView: z.boolean(),
});

const attemptSchema = z.object({
  scenarioId: z.string(),
  level: levelSchema,
  index: z.number().int(),
  direction: directionSchema,
  correct: z.boolean(),
  score: z.number().int().min(0).max(100),
  durationMs: z.number().int().min(0),
  overtimeMs: z.number().int().min(0).default(0),
  openedCardIds: z.array(z.string()).default([]),
  efficiency: z.number().int().nullable().optional(),
  essentialFound: z.number().int().nullable().optional(),
  essentialTotal: z.number().int().nullable().optional(),
  coherence: z.number().int().nullable().optional(),
});

const journalSchema = z.object({
  scenarioId: z.string(),
  level: levelSchema,
  title: z.string(),
  symbol: z.string(),
  direction: directionSchema,
  correct: z.boolean(),
  coherence: z.number().int(),
  efficiency: z.number().int(),
  reasoning: z.array(reasoningItemSchema).default([]),
  bias: z.string().nullable(),
});

const cardInteractionSchema = z.object({
  scenarioId: z.string(),
  cardId: z.string(),
  openedAtMs: z.number().int().min(0),
  durationMs: z.number().int().min(0),
  reopens: z.number().int().min(0).default(0),
});

const PASS_THRESHOLD = 70;
const SCENARIOS_PER_LEVEL = 10;

/** Persist one attempt, then recompute level progress server-side (source of truth). */
export const submitAttempt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => attemptSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    const { data: inserted, error } = await supabase
      .from("certification_attempts")
      .insert({
        user_id: userId,
        chapter_id: CHAPTER,
        level: data.level,
        scenario_id: data.scenarioId,
        scenario_index: data.index,
        direction: data.direction,
        correct: data.correct,
        score: data.score,
        duration_ms: data.durationMs,
        overtime_ms: data.overtimeMs,
        opened_card_ids: data.openedCardIds,
        efficiency: data.efficiency ?? null,
        essential_found: data.essentialFound ?? null,
        essential_total: data.essentialTotal ?? null,
        coherence: data.coherence ?? null,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    // Recompute best-per-scenario aggregate for this level (server = truth).
    const { data: rows } = await supabase
      .from("certification_attempts")
      .select("scenario_index, score, correct")
      .eq("user_id", userId)
      .eq("chapter_id", CHAPTER)
      .eq("level", data.level);

    const bestByIndex = new Map<number, { score: number; correct: boolean }>();
    for (const r of rows ?? []) {
      const cur = bestByIndex.get(r.scenario_index);
      if (!cur || r.score > cur.score)
        bestByIndex.set(r.scenario_index, { score: r.score, correct: r.correct });
    }
    const best = [...bestByIndex.values()];
    const completed = best.length;
    const aggregate =
      completed === 0
        ? 0
        : Math.round(best.reduce((s, b) => s + b.score, 0) / completed);
    const passed =
      completed >= SCENARIOS_PER_LEVEL && aggregate >= PASS_THRESHOLD;

    await supabase.from("certification_progress").upsert(
      {
        user_id: userId,
        chapter_id: CHAPTER,
        level: data.level,
        best_score: aggregate,
        completed,
        passed,
        completed_at: passed ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chapter_id,level" },
    );

    return { attemptId: inserted.id, aggregate, completed, passed };
  });

/** Record silent card-interaction telemetry (Premium coherence / analytics). */
export const recordCardInteractions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ items: z.array(cardInteractionSchema) }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    if (data.items.length === 0) return { ok: true };
    const { error } = await supabase.from("certification_card_interactions").insert(
      data.items.map((i) => ({
        user_id: userId,
        scenario_id: i.scenarioId,
        card_id: i.cardId,
        opened_at_ms: i.openedAtMs,
        duration_ms: i.durationMs,
        reopens: i.reopens,
      })),
    );
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Weighted Rotation Engine — record that a scenario was served to the user. */
export const recordScenarioUsage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ level: z.string(), scenarioId: z.string() }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("scenario_usage")
      .select("id, usage_count")
      .eq("user_id", userId)
      .eq("scenario_id", data.scenarioId)
      .eq("level", data.level)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("scenario_usage")
        .update({
          usage_count: existing.usage_count + 1,
          last_used_at: new Date().toISOString(),
        })
        .eq("id", existing.id);
    } else {
      await supabase.from("scenario_usage").insert({
        user_id: userId,
        level: data.level,
        scenario_id: data.scenarioId,
        usage_count: 1,
      });
    }
    return { ok: true };
  });

/** Usage rows for the signed-in learner (hydrates the local rotation cache). */
export const getScenarioUsage = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("scenario_usage")
      .select("scenario_id, usage_count, level")
      .eq("user_id", context.userId);
    return data ?? [];
  });


/** Persist declared reasoning + a full decision-journal entry. */
export const saveJournalEntry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => journalSchema.parse(d))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await supabase.from("certification_reasoning").insert({
      user_id: userId,
      scenario_id: data.scenarioId,
      items: data.reasoning,
      bias: data.bias,
    });
    const { data: inserted, error } = await supabase
      .from("decision_journal_entries")
      .insert({
        user_id: userId,
        chapter_id: CHAPTER,
        scenario_id: data.scenarioId,
        level: data.level,
        title: data.title,
        symbol: data.symbol,
        direction: data.direction,
        correct: data.correct,
        coherence: data.coherence,
        efficiency: data.efficiency,
        reasoning: data.reasoning,
        bias: data.bias,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted.id };
  });

/** Hydrate the full user state (attempts + journal + progress) for local cache. */
export const getCertificationState = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const [attempts, journal, progress, certs] = await Promise.all([
      supabase
        .from("certification_attempts")
        .select("*")
        .eq("user_id", userId)
        .eq("chapter_id", CHAPTER)
        .order("created_at", { ascending: true }),
      supabase
        .from("decision_journal_entries")
        .select("*")
        .eq("user_id", userId)
        .eq("chapter_id", CHAPTER)
        .order("created_at", { ascending: false }),
      supabase
        .from("certification_progress")
        .select("*")
        .eq("user_id", userId)
        .eq("chapter_id", CHAPTER),
      supabase
        .from("certificates_issued")
        .select("*")
        .eq("user_id", userId)
        .eq("chapter_id", CHAPTER)
        .order("issued_at", { ascending: false }),
    ]);

    return {
      attempts: (attempts.data ?? []).map((a) => ({
        id: a.id as string,
        scenarioId: a.scenario_id as string,
        level: a.level as "standard" | "high" | "premium",
        index: a.scenario_index as number,
        direction: (a.direction ?? "neutral") as "bull" | "neutral" | "bear",
        correct: a.correct as boolean,
        score: a.score as number,
        durationMs: a.duration_ms as number,
        overtimeMs: a.overtime_ms as number,
        at: new Date(a.created_at as string).getTime(),
        openedCardIds: (a.opened_card_ids ?? []) as string[],
        efficiency: (a.efficiency ?? undefined) as number | undefined,
        essentialFound: (a.essential_found ?? undefined) as number | undefined,
        essentialTotal: (a.essential_total ?? undefined) as number | undefined,
        coherence: (a.coherence ?? undefined) as number | undefined,
      })),
      journal: (journal.data ?? []).map((j) => ({
        id: j.id as string,
        scenarioId: j.scenario_id as string,
        level: j.level as "standard" | "high" | "premium",
        title: j.title as string,
        symbol: j.symbol as string,
        at: new Date(j.created_at as string).getTime(),
        direction: j.direction as "bull" | "neutral" | "bear",
        correct: j.correct as boolean,
        coherence: j.coherence as number,
        efficiency: j.efficiency as number,
        reasoning: (j.reasoning ?? []) as z.infer<typeof reasoningItemSchema>[],
        bias: (j.bias ?? null) as string | null,
      })),
      progress: (progress.data ?? []).map((p) => ({
        level: p.level as string,
        passed: p.passed as boolean,
        bestScore: p.best_score as number,
        completed: p.completed as number,
      })),
      certificate: certs.data?.[0]
        ? {
            id: certs.data[0].id as string,
            candidateName: certs.data[0].candidate_name as string,
            hash: certs.data[0].hash as string,
            aggregateScore: certs.data[0].aggregate_score as number,
            issuedAt: certs.data[0].issued_at as string,
          }
        : null,
    };
  });

/** Issue (or return existing) the final chapter certificate. */
export const issueCertificate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        candidateName: z.string().min(1).max(120),
        aggregateScore: z.number().int().min(0).max(100),
        levels: z.array(z.string()).default(["standard", "high", "premium"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Guard: all three levels must be passed (server-side truth).
    const { data: prog } = await supabase
      .from("certification_progress")
      .select("level, passed")
      .eq("user_id", userId)
      .eq("chapter_id", CHAPTER);
    const passedLevels = new Set(
      (prog ?? []).filter((p) => p.passed).map((p) => p.level),
    );
    const allPassed = ["standard", "high", "premium"].every((l) =>
      passedLevels.has(l),
    );
    if (!allPassed)
      throw new Error("Certification incomplète : les 3 niveaux doivent être validés.");

    const { data: existing } = await supabase
      .from("certificates_issued")
      .select("*")
      .eq("user_id", userId)
      .eq("chapter_id", CHAPTER)
      .maybeSingle();
    if (existing) {
      return {
        id: existing.id as string,
        hash: existing.hash as string,
        candidateName: existing.candidate_name as string,
        aggregateScore: existing.aggregate_score as number,
        issuedAt: existing.issued_at as string,
      };
    }

    const rand = crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase();
    const hash = `TF-CH1-${rand}`;
    const { data: inserted, error } = await supabase
      .from("certificates_issued")
      .insert({
        user_id: userId,
        chapter_id: CHAPTER,
        candidate_name: data.candidateName,
        levels: data.levels,
        aggregate_score: data.aggregateScore,
        hash,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return {
      id: inserted.id as string,
      hash: inserted.hash as string,
      candidateName: inserted.candidate_name as string,
      aggregateScore: inserted.aggregate_score as number,
      issuedAt: inserted.issued_at as string,
    };
  });

/** Wipe all of the current user's certification data. */
export const resetCertification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await Promise.all([
      supabase.from("certification_attempts").delete().eq("user_id", userId),
      supabase.from("decision_journal_entries").delete().eq("user_id", userId),
      supabase.from("certification_reasoning").delete().eq("user_id", userId),
      supabase.from("certification_card_interactions").delete().eq("user_id", userId),
      supabase.from("certification_progress").delete().eq("user_id", userId),
    ]);
    return { ok: true };
  });
