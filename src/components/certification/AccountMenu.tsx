import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth/useAuth";
import { useI18n } from "@/lib/i18n";

/** Session-driven sign-in affordance. Never a static "Sign in" label. */
export function AccountMenu() {
  const { t } = useI18n();
  const { user, loading, isAccount, displayName } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    void navigate({ to: "/auth", replace: true });
  }

  if (loading) {
    return <div className="h-8 w-24 animate-pulse rounded-lg bg-surface-raised" aria-hidden />;
  }

  if (!isAccount) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
      >
        <UserRound className="h-4 w-4" /> {t("nav.signIn")}
      </Link>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className="max-w-[10rem] truncate rounded-lg border border-border bg-surface-raised px-3 py-1.5 text-sm"
        title={user?.email ?? undefined}
      >
        {displayName}
      </span>
      <button
        type="button"
        onClick={() => void signOut()}
        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
        <span className="sr-only sm:not-sr-only">{t("nav.signOut")}</span>
      </button>
    </div>
  );
}
