// TradForge Institut — client-side certificate PDF (edge-safe, pdf-lib).
// Builds a landscape A4 diploma and triggers download. Attempts to register an
// official verification hash via the server; falls back to a local hash offline.

import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { issueCertificate } from "./cloud.functions";
import { ensureSession } from "./session";
import { levelSummary } from "./storage";
import { getScenarios } from "./scenarios";
import { type Level } from "./types";
import type { Locale } from "@/lib/i18n/locale";

const LEVELS: Level[] = ["standard", "high", "premium"];

// OKLCH tokens resolved to sRGB for the PDF canvas.
const NEAR_BLACK = rgb(0.043, 0.05, 0.07);
const PANEL = rgb(0.078, 0.09, 0.12);
const GOLD = rgb(0.82, 0.64, 0.25);
const GOLD_SOFT = rgb(0.62, 0.5, 0.24);
const INK = rgb(0.92, 0.93, 0.96);
const MUTED = rgb(0.62, 0.66, 0.72);

export interface CertificateSummary {
  completedAll: boolean;
  aggregate: number;
  perLevel: { level: Level; pct: number; passed: number; total: number }[];
}

/** Read local best-scores state to decide whether the certificate is unlocked. */
export function readCertificateSummary(): CertificateSummary {
  const perLevel = LEVELS.map((level) => {
    const total = getScenarios(level).length;
    const s = levelSummary(level, total);
    return { level, pct: s.aggregatePct, passed: s.passed, total };
  });
  const completedAll = perLevel.every((l) => l.passed >= l.total && l.total > 0);
  const aggregate = Math.round(
    perLevel.reduce((sum, l) => sum + l.pct, 0) / (perLevel.length || 1),
  );
  return { completedAll, aggregate, perLevel };
}

/** Certificate copy per locale — the PDF is a document, not UI, so it carries its own strings. */
const PDF_TEXT = {
  fr: {
    institute: "TRADEFORGE ARENA",
    title: "Certificat de Certification Macro Trading",
    chapter: "CHAPITRE 01 · VOIR · MANIPULER · DECIDER · COMPRENDRE",
    awardedTo: "Decerne a",
    mention: "pour avoir valide les trois niveaux de la certification finale avec distinction.",
    scenarios: "scenarios valides",
    score: "SCORE",
    aggregate: "Score agrege",
    issued: "Delivre le",
    issuer: "TradeForge Arena · Emetteur agree",
    verify: "Verification :",
    signature: "Signature numerique · TRADEFORGE ARENA",
    fallbackName: "Candidat TradeForge",
    locale: "fr-FR",
    file: "TradeForge-Certificat",
  },
  en: {
    institute: "TRADEFORGE ARENA",
    title: "Macro Trading Certification Certificate",
    chapter: "CHAPTER 01 · SEE · HANDLE · DECIDE · UNDERSTAND",
    awardedTo: "Awarded to",
    mention: "for clearing the three levels of the final certification with distinction.",
    scenarios: "scenarios cleared",
    score: "SCORE",
    aggregate: "Aggregate score",
    issued: "Issued on",
    issuer: "TradeForge Arena · Accredited issuer",
    verify: "Verification:",
    signature: "Digital signature · TRADEFORGE ARENA",
    fallbackName: "TradeForge candidate",
    locale: "en-GB",
    file: "TradeForge-Certificate",
  },
} as const;

export async function generateCertificatePdf(
  candidateName: string,
  locale: Locale = "fr",
): Promise<void> {
  const L = PDF_TEXT[locale] ?? PDF_TEXT.fr;
  const summary = readCertificateSummary();
  const name = candidateName.trim() || L.fallbackName;

  // Try to register officially; fall back to a deterministic local hash.
  let hash = `TF-CH1-${Math.random().toString(36).slice(2, 14).toUpperCase()}`;
  let issuedAt = new Date().toISOString();
  try {
    if (!(await ensureSession())) throw new Error("no session");
    const res = await issueCertificate({
      data: { candidateName: name, aggregateScore: summary.aggregate, levels: LEVELS },
    });
    hash = res.hash;
    issuedAt = res.issuedAt;
  } catch (e) {
    console.warn("[TradForge] issueCertificate unavailable, using local hash:", e);
  }

  const doc = await PDFDocument.create();
  const page = doc.addPage([842, 595]); // A4 landscape (pt)
  const { width: W, height: H } = page.getSize();
  const display = await doc.embedFont(StandardFonts.TimesRomanBold);
  const displayReg = await doc.embedFont(StandardFonts.TimesRoman);
  const mono = await doc.embedFont(StandardFonts.Courier);
  const monoBold = await doc.embedFont(StandardFonts.CourierBold);

  // Background + border frame
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: NEAR_BLACK });
  page.drawRectangle({ x: 24, y: 24, width: W - 48, height: H - 48, borderColor: GOLD_SOFT, borderWidth: 1.5 });
  page.drawRectangle({ x: 32, y: 32, width: W - 64, height: H - 64, borderColor: GOLD, borderWidth: 0.75 });

  // Monogram seal (top center)
  const cx = W / 2;
  page.drawCircle({ x: cx, y: H - 96, size: 30, borderColor: GOLD, borderWidth: 1.5 });
  page.drawCircle({ x: cx, y: H - 96, size: 24, borderColor: GOLD_SOFT, borderWidth: 0.75 });
  const tfW = display.widthOfTextAtSize("TF", 22);
  page.drawText("TF", { x: cx - tfW / 2, y: H - 104, size: 22, font: display, color: GOLD });

  const center = (text: string, y: number, size: number, font = display, color = INK) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: cx - w / 2, y, size, font, color });
  };

  center(L.institute, H - 150, 13, monoBold, GOLD);
  center(L.title, H - 182, 26, display, INK);
  center(L.chapter, H - 204, 9, mono, MUTED);

  center(L.awardedTo, H - 250, 12, displayReg, MUTED);
  center(name, H - 288, 32, display, INK);
  page.drawLine({ start: { x: cx - 180, y: H - 300 }, end: { x: cx + 180, y: H - 300 }, thickness: 0.5, color: GOLD_SOFT });

  center(
    L.mention,
    H - 322,
    11,
    displayReg,
    MUTED,
  );

  // Per-level score panels
  const panelW = 210;
  const gap = 24;
  const startX = cx - (panelW * 1.5 + gap);
  summary.perLevel.forEach((l, i) => {
    const x = startX + i * (panelW + gap);
    const y = H - 430;
    page.drawRectangle({ x, y, width: panelW, height: 78, color: PANEL, borderColor: GOLD_SOFT, borderWidth: 0.5 });
    page.drawText(l.level.toUpperCase(), { x: x + 14, y: y + 54, size: 11, font: monoBold, color: GOLD });
    page.drawText(`${l.passed}/${l.total} ${L.scenarios}`, { x: x + 14, y: y + 36, size: 9, font: mono, color: MUTED });
    page.drawText(`${l.pct}%`, { x: x + 14, y: y + 12, size: 20, font: display, color: INK });
    page.drawText(L.score, { x: x + panelW - 52, y: y + 18, size: 8, font: mono, color: MUTED });
  });

  // Aggregate score badge
  center(`${L.aggregate} · ${summary.aggregate}%`, H - 468, 13, monoBold, GOLD);

  // Footer: date, hash, issuer
  const date = new Date(issuedAt).toLocaleDateString(L.locale, { year: "numeric", month: "long", day: "numeric" });
  page.drawText(`${L.issued} ${date}`, { x: 56, y: 58, size: 9, font: mono, color: MUTED });
  page.drawText(L.issuer, { x: 56, y: 44, size: 9, font: mono, color: MUTED });

  const hashLabel = `${L.verify} ${hash}`;
  const hw = mono.widthOfTextAtSize(hashLabel, 9);
  page.drawText(hashLabel, { x: W - 56 - hw, y: 58, size: 9, font: monoBold, color: GOLD });
  const sig = L.signature;
  const sw = mono.widthOfTextAtSize(sig, 9);
  page.drawText(sig, { x: W - 56 - sw, y: 44, size: 9, font: mono, color: MUTED });

  // Faint watermark
  page.drawText("TRADEFORGE", {
    x: cx - 150,
    y: H / 2 - 30,
    size: 60,
    font: display,
    color: GOLD,
    opacity: 0.04,
    rotate: degrees(18),
  });

  const bytes = await doc.save();
  const ab = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(ab).set(bytes);
  const blob = new Blob([ab], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${L.file}-${name.replace(/\s+/g, "_")}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
