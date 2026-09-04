// TradeForge Arena — session accessor.
//
// Authentication is MANDATORY: the Arena is never served to an anonymous
// visitor. We no longer mint anonymous sessions; every learner owns a real
// account (email + password), which is what the certificate is issued against.

import { supabase } from "@/integrations/supabase/client";

/** Returns the signed-in user id, or null when nobody is signed in. */
export async function ensureSession(): Promise<string | null> {
  if (typeof window === "undefined") return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session?.user?.id ?? null;
  } catch (e) {
    console.warn("[TradeForge Arena] session read error:", e);
    return null;
  }
}
