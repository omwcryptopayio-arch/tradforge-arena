// TradForge — client-side session state.
// The app keeps automatic anonymous sessions (so a first-time learner has
// server-side persistence immediately) and upgrades them in place to a real
// email account when the learner signs up. No progress is ever lost.

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface AuthState {
  user: User | null;
  /** True while the initial session read is in flight. */
  loading: boolean;
  /** A real (non-anonymous) account, i.e. has an email identity. */
  isAccount: boolean;
  displayName: string | null;
}

export function isRealAccount(user: User | null): boolean {
  if (!user) return false;
  if (user.is_anonymous) return false;
  return Boolean(user.email);
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const displayName =
    (user?.user_metadata?.["display_name"] as string | undefined) ??
    (user?.email ? user.email.split("@")[0]! : null);

  return { user, loading, isAccount: isRealAccount(user), displayName };
}
