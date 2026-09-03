import { Globe } from "lucide-react";
import { LOCALES, useI18n, type Locale } from "@/lib/i18n";

/** FR ⇄ EN toggle. Switches without a page reload; persists the preference. */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-raised p-0.5"
      role="group"
      aria-label="Language"
    >
      {!compact && <Globe className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" aria-hidden />}
      {LOCALES.map((code: Locale) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          className={`rounded-md px-2 py-1 text-[11px] font-semibold uppercase tracking-wider transition-colors ${
            locale === code
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
