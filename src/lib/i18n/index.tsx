// TradForge — i18n runtime: provider, hook, dot-path resolver and content
// overlays for scenarios / context cards.
//
// Architecture: content → language → UI. UI code NEVER branches on the locale;
// it calls t("domain.key") or the content helpers below.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { fr } from "./fr";
import { en } from "./en";
import { CARD_TEXT, type CardText } from "./content.cards";
import { SCENARIO_TEXT, type ScenarioText } from "./content.scenarios";
import { DEFAULT_LOCALE, LOCALE_STORAGE_KEY, isLocale, type Locale } from "./locale";

export type { Locale } from "./locale";
export { LOCALES, LOCALE_LABEL, DEFAULT_LOCALE } from "./locale";

const DEFAULT_LOCALE_FALLBACK: Locale = DEFAULT_LOCALE;

const DICTS: Record<Locale, typeof fr> = { fr, en };

function resolve(dict: unknown, path: string): string | undefined {
  const parts = path.split(".");
  let node: unknown = dict;
  for (const part of parts) {
    if (typeof node !== "object" || node === null) return undefined;
    node = (node as Record<string, unknown>)[part];
  }
  return typeof node === "string" ? node : undefined;
}

function interpolate(value: string, vars?: Record<string, string | number>): string {
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}

export interface I18nApi {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  cardText: (cardId: string) => CardText | undefined;
  scenarioText: (scenarioId: string) => ScenarioText | undefined;
}

const I18nContext = createContext<I18nApi | null>(null);

export function readStoredLocale(): Locale {
  if (typeof window === "undefined") return DEFAULT_LOCALE_FALLBACK;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isLocale(stored)) return stored;
    const nav = window.navigator.language?.slice(0, 2).toLowerCase();
    if (nav === "en") return "en";
  } catch {
    /* storage blocked */
  }
  return DEFAULT_LOCALE_FALLBACK;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  // SSR renders the reference locale; the stored preference is applied after
  // mount so hydration stays deterministic.
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE_FALLBACK);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored !== locale) setLocaleState(stored);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, next);
    } catch {
      /* storage blocked */
    }
  }, []);

  const value = useMemo<I18nApi>(() => {
    const dict = DICTS[locale];
    return {
      locale,
      setLocale,
      t: (key, vars) =>
        interpolate(resolve(dict, key) ?? resolve(fr, key) ?? key, vars),
      cardText: (cardId) => CARD_TEXT[cardId]?.[locale] ?? CARD_TEXT[cardId]?.fr,
      scenarioText: (scenarioId) =>
        SCENARIO_TEXT[scenarioId]?.[locale] ?? SCENARIO_TEXT[scenarioId]?.fr,
    };
  }, [locale, setLocale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

const FALLBACK_API: I18nApi = {
  locale: DEFAULT_LOCALE_FALLBACK,
  setLocale: () => {},
  t: (key, vars) => interpolate(resolve(fr, key) ?? key, vars),
  cardText: (cardId) => CARD_TEXT[cardId]?.fr,
  scenarioText: (scenarioId) => SCENARIO_TEXT[scenarioId]?.fr,
};

export function useI18n(): I18nApi {
  return useContext(I18nContext) ?? FALLBACK_API;
}

/** Convenience alias — most components only need `t`. */
export function useTranslation() {
  return useI18n();
}
