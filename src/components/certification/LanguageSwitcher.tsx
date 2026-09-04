import { useI18n, type Locale } from "@/lib/i18n";

const FLAG: Record<Locale, { emoji: string; label: string }> = {
  fr: { emoji: "🇫🇷", label: "Français" },
  en: { emoji: "🇬🇧", label: "English" },
};

const ORDER: Locale[] = ["fr", "en"];

/** Flag-based FR ⇄ EN switch. Switches the whole UI without a reload. */
export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className="inline-flex shrink-0 items-center gap-0.5 rounded-full border border-border bg-surface-raised p-0.5"
      role="group"
      aria-label="Language / Langue"
    >
      {ORDER.map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLocale(code)}
          aria-pressed={locale === code}
          aria-label={FLAG[code].label}
          title={FLAG[code].label}
          className={`grid h-7 w-8 place-items-center rounded-full text-base leading-none transition-all ${
            locale === code
              ? "bg-primary/15 ring-1 ring-primary/50"
              : "opacity-45 hover:opacity-90"
          }`}
        >
          <span aria-hidden>{FLAG[code].emoji}</span>
        </button>
      ))}
    </div>
  );
}
