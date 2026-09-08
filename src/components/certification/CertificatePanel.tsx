import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Award, Download, Lock, Loader2 } from "lucide-react";
import {
  readCertificateSummary,
  generateCertificatePdf,
  type CertificateSummary,
} from "@/lib/certification/certificate";
import { useI18n } from "@/lib/i18n";

export function CertificatePanel() {
  const { t, locale } = useI18n();
  // Read client storage after mount only, so SSR and hydration agree.
  const [summary, setSummary] = useState<CertificateSummary>({
    completedAll: false,
    aggregate: 0,
    perLevel: [],
  });
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const refresh = () => setSummary(readCertificateSummary());
    refresh();
    window.addEventListener("tradforge:storage", refresh);
    return () => window.removeEventListener("tradforge:storage", refresh);
  }, []);

  const unlocked = summary.completedAll;

  const onDownload = async () => {
    setBusy(true);
    try {
      await generateCertificatePdf(name, locale);
      setDone(true);
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.28, duration: 0.4 }}
      className="mt-8 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-surface-raised to-surface/40 p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
            {unlocked ? <Award className="h-6 w-6" /> : <Lock className="h-5 w-5" />}
          </div>
          <div>
            <div className="label-mono text-primary/80">{t("certificate.institute")}</div>
            <h3 className="font-display text-xl font-bold">{t("certificate.title")}</h3>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              {unlocked
                ? t("certificate.unlocked", { pct: summary.aggregate })
                : t("certificate.locked")}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-[280px]">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!unlocked}
            placeholder={t("certificate.namePlaceholder")}
            className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary/50 disabled:opacity-40"
          />
          <button
            type="button"
            disabled={!unlocked || busy}
            onClick={onDownload}
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-[var(--gold)] to-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-gold)] transition-transform enabled:hover:scale-[1.01] enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> {t("certificate.generating")}
              </>
            ) : (
              <>
                <Download className="h-4 w-4" /> {done ? t("certificate.downloadAgain") : t("certificate.download")}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        {summary.perLevel.map((l) => (
          <div key={l.level} className="rounded-lg border border-border bg-surface/60 p-3">
            <div className="label-mono text-[10px] text-muted-foreground">{l.level.toUpperCase()}</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-mono text-sm font-semibold text-foreground">{l.pct}%</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {l.passed}/{l.total}
              </span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
