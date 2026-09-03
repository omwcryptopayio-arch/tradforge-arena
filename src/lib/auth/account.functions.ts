// TradForge — profile-side server functions (RLS as the signed-in user).

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase
      .from("profiles")
      .select("id, display_name, email, locale")
      .eq("id", context.userId)
      .maybeSingle();
    return data ?? null;
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { displayName?: string; locale?: string }) => input)
  .handler(async ({ data, context }) => {
    const patch: Record<string, string> = {};
    if (typeof data.displayName === "string") {
      patch["display_name"] = data.displayName.trim().slice(0, 80);
    }
    if (data.locale === "fr" || data.locale === "en") patch["locale"] = data.locale;
    if (Object.keys(patch).length === 0) return { ok: true };

    const { error } = await context.supabase
      .from("profiles")
      .upsert({ id: context.userId, ...patch }, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
