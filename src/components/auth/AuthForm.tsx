import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useI18n } from "@/lib/i18n";

type Mode = "signup" | "signin";

interface AuthFormProps {
  initialMode?: Mode;
  onAuthenticated?: () => void;
}

/**
 * Arena account block. Sign-up collects email, password, password confirmation
 * and the display name printed on the certificate. After a successful sign-up
 * the learner gets an unmistakable confirmation and is routed to sign-in.
 */
export function AuthForm({ initialMode = "signup", onAuthenticated }: AuthFormProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
    setPassword("");
    setConfirm("");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 255) {
      return setError(t("auth.invalidEmail"));
    }

    if (mode === "signup") {
      if (displayName.trim().length < 2 || displayName.trim().length > 80) {
        return setError(t("auth.invalidName"));
      }
      if (password.length < 8) return setError(t("auth.tooShort"));
      if (password !== confirm) return setError(t("auth.mismatch"));
    }

    setBusy(true);
    try {
      if (mode === "signin") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });
        if (err) throw err;
        const { hydrateFromCloud } = await import("@/lib/certification/storage");
        await hydrateFromCloud();
        onAuthenticated?.();
      } else {
        const { error: err } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName.trim() },
          },
        });
        if (err) throw err;
        // Explicit hand-off: account created → go and sign in.
        await supabase.auth.signOut();
        setCreated(cleanEmail);
        setMode("signin");
        setPassword("");
        setConfirm("");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("auth.generic"));
    } finally {
      setBusy(false);
    }
  }

  const isSignUp = mode === "signup";

  return (
    <div className="rounded-2xl border border-border bg-surface-raised/80 p-5 shadow-[var(--shadow-gold)] sm:p-7">
      <p className="label-mono text-primary">
        {isSignUp ? t("auth.eyebrowSignUp") : t("auth.eyebrowSignIn")}
      </p>
      <h2 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
        {isSignUp ? t("auth.signUpTitle") : t("auth.signInTitle")}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {isSignUp ? t("auth.signUpLede") : t("auth.signInLede")}
      </p>

      {created && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-bull/50 bg-bull/10 p-4"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-bull" />
            <div className="min-w-0">
              <p className="font-semibold text-bull">{t("auth.createdTitle")}</p>
              <p className="mt-1 text-sm text-foreground/90">
                {t("auth.createdBody", { email: created })}
              </p>
              <p className="mt-1 text-sm font-medium">{t("auth.createdNext")}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {isSignUp && (
          <Field
            label={t("auth.displayName")}
            hint={t("auth.displayNameHint")}
            value={displayName}
            onChange={setDisplayName}
            type="text"
            maxLength={80}
            autoComplete="name"
          />
        )}
        <Field
          label={t("auth.email")}
          value={email}
          onChange={setEmail}
          type="email"
          maxLength={255}
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
          <p
            role="alert"
            className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-[var(--gold)] to-primary px-5 py-3 font-semibold text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {isSignUp ? t("auth.submitSignUp") : t("auth.submitSignIn")}
        </button>
      </form>

      <button
        type="button"
        onClick={() => switchMode(isSignUp ? "signin" : "signup")}
        className="mt-4 w-full text-center text-sm text-primary underline-offset-4 hover:underline"
      >
        {isSignUp ? t("auth.toSignIn") : t("auth.toSignUp")}
      </button>
    </div>
  );
}

function Field(props: {
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  type: string;
  required?: boolean;
  maxLength?: number;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="label-mono mb-1.5 block text-[11px] text-muted-foreground">
        {props.label}
      </span>
      <input
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none transition-colors focus:border-primary"
        type={props.type}
        value={props.value}
        required={props.required}
        maxLength={props.maxLength}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.hint && <span className="mt-1 block text-xs text-muted-foreground">{props.hint}</span>}
    </label>
  );
}
