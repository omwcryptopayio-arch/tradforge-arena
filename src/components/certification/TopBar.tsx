import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { BookOpen } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { AccountMenu } from "./AccountMenu";
import { useAuth } from "@/lib/auth/useAuth";
import { useI18n } from "@/lib/i18n";

interface TopBarProps {
  /** Optional centre slot (level name, scenario counter, progress…). */
  center?: ReactNode;
  /** Optional left slot replacing the brand (e.g. a back link). */
  left?: ReactNode;
  /** Show the Decision Journal shortcut (signed-in surfaces only). */
  journalLink?: boolean;
}

/**
 * Universal Arena top bar: brand / back, contextual centre, language flags and
 * session-driven account control. Present on every Arena surface, including
 * the Standard / High / Premium evaluation screens. Mobile-first grid so the
 * centre slot can shrink and truncate instead of clipping the controls.
 */
export function TopBar({ center, left, journalLink = false }: TopBarProps) {
  const { t } = useI18n();
  const { isAccount } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
        <div className="flex shrink-0 items-center gap-2">
          {left ?? (
            <Link to="/" className="flex items-center gap-2">
              <span className="text-[var(--gold)]" aria-hidden>
                ✦
              </span>
              <span className="font-display text-sm font-bold tracking-tight sm:text-base">
                TradeForge <span className="text-gradient-gold">Arena</span>
              </span>
            </Link>
          )}
        </div>

        <div className="min-w-0 justify-self-center">{center}</div>

        <div className="flex shrink-0 items-center gap-2">
          {journalLink && isAccount && (
            <Link
              to="/journal"
              className="hidden items-center gap-1.5 rounded-lg border border-border bg-surface-raised px-2.5 py-1.5 text-sm transition-colors hover:bg-accent sm:inline-flex"
            >
              <BookOpen className="h-4 w-4" />
              <span className="hidden lg:inline">{t("common.journal")}</span>
            </Link>
          )}
          <LanguageSwitcher />
          <AccountMenu />
        </div>
      </div>
    </header>
  );
}
