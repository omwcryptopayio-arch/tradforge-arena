import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/certification/LanguageSwitcher";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Connexion · TradForge Institut" },
      {
        name: "description",
        content:
          "Crée ton compte TradForge Institut pour sauvegarder ta progression, ton journal de décision et ton certificat.",
      },
      { property: "og:title", content: "Connexion · TradForge Institut" },
      {
        property: "og:description",
        content: "Accède à ta progression, ton journal et ton certificat TradForge.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (mode === "signup") {
      if (password.length < 8) return setError(t("auth.tooShort"));
      if (password !== confirm) return setError(t("auth.mismatch"));
    }
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) throw err;
      } else {
        // Soft migration: if an anonymous session already holds progress, we
        // upgrade it in place so nothing is lost.
        const { data: sess } = await supabase.auth.getSession();
        const anon = sess.session?.user?.is_anonymous;
        if (anon) {
          const { error: upErr } = await supabase.auth.updateUser({
            email,
            password,
            data: { display_name: displayName || email.split("@")[0] },
          });
          if (upErr) throw upErr;
        } else {
          const { error: suErr } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: window.location.origin,
              data: { display_name: displayName || email.split("@")[0] },
            },
          });
          if (suErr) throw suErr;
          const { error: siErr } = await supabase.auth.signInWithPassword({ email, password });
          if (siErr) throw siErr;
        }
      }
      const { hydrateFromCloud } = await import("@/lib/certification/storage");
      await hydrateFromCloud();
      void navigate({ to: "/certification" });
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.generic"));
    } finally {
      setBusy(false);
    }
  }

  const isSignUp = mode === "signup";

  return (
    <div className="tf-grid-bg flex min-h-screen items-center justify-center bg-background px-5 py-12 text-foreground">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="label-mono text-xs text-muted-foreground hover:text-foreground">
            ← TradForge Institut
          </Link>
          <LanguageSwitcher />
        </div>

        <div className="rounded-2xl border border-border bg-surface-raised p-6 shadow-lg">
          <h1 className="font-display text-2xl font-bold tracking-tight">
            {isSignUp ? t("auth.signUpTitle") : t("auth.signInTitle")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp ? t("auth.signUpLede") : t("auth.signInLede")}
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {isSignUp && (
              <Field
                label={t("auth.displayName")}
                value={displayName}
                onChange={setDisplayName}
                type="text"
                autoComplete="name"
              />
            )}
            <Field
              label={t("auth.email")}
              value={email}
              onChange={setEmail}
              type="email"
              required
              autoComplete="email"
            />
            <Field
              label={t("auth.password")}
              value={password}
              onChange={setPassword}
              type="password"
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
            {isSignUp && (
              <Field
                label={t("auth.confirmPassword")}
                value={confirm}
                onChange={setConfirm}
                type="password"
                required
                autoComplete="new-password"
              />
            )}

            {error && (
              <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? t("common.loading") : isSignUp ? t("auth.submitSignUp") : t("auth.submitSignIn")}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {t("auth.noEmailVerification")}
          </p>

          <button
            type="button"
            onClick={() => {
              setMode(isSignUp ? "signin" : "signup");
              setError(null);
            }}
            className="mt-4 w-full text-center text-sm text-primary underline-offset-4 hover:underline"
          >
            {isSignUp ? t("auth.toSignIn") : t("auth.toSignUp")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="label-mono mb-1.5 block text-[11px] text-muted-foreground">
        {props.label}
      </span>
      <input
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
        type={props.type}
        value={props.value}
        required={props.required}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </label>
  );
}
