// TradForge — locale primitives (importable from anywhere, no React).

export type Locale = "fr" | "en";

export const LOCALES: Locale[] = ["fr", "en"];

export const LOCALE_STORAGE_KEY = "tradforge.locale.v1";

export const LOCALE_LABEL: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

export function isLocale(value: unknown): value is Locale {
  return value === "fr" || value === "en";
}
