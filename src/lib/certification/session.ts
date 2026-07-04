// TradForge — anonymous session bootstrap.
// Learners get server-side persistence with no visible login: we mint an
// anonymous Supabase session on first load, tied to auth.uid() via RLS.

import { supabase } from "@/integrations/supabase/client";

let ensurePromise: Promise<string | null> | null = null;

/** Ensure an (anonymous) session exists. Returns the user id or null. */
export function ensureSession(): Promise<string | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (ensurePromise) return ensurePromise;
  ensurePromise = (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) return data.session.user.id;
      const { data: anon, error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.warn("[TradForge] anon sign-in failed, offline mode:", error.message);
        return null;
      }
      return anon.user?.id ?? null;
    } catch (e) {
      console.warn("[TradForge] session bootstrap error:", e);
      return null;
    }
  })();
  return ensurePromise;
}
