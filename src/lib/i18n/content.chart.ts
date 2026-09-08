// TradeForge Arena — chart annotation copy.
// `scenarios.ts` stores chart labels in the reference language (FR). This map
// gives the English equivalent for every label used on a replay chart:
// periods, support/resistance names, event markers and technical annotations.
// Purely numeric or already-English labels are omitted (they pass through).

export const CHART_LABEL_EN: Record<string, string> = {
  // Periods
  "Janvier 2024 · H4": "January 2024 · H4",
  "Novembre 2016 · H1": "November 2016 · H1",

  // Levels
  "Support court terme": "Short-term support",
  "Support majeur 1980": "Major support 1980",
  "Résistance 1.2780": "Resistance 1.2780",
  "Résistance 1.3750": "Resistance 1.3750",
  "Résistance 18.00": "Resistance 18.00",
  "Résistance 80.00": "Resistance 80.00",
  "Résistance 82.00": "Resistance 82.00",
  "Résistance 950": "Resistance 950",
  "Cap psychologique 32": "Psychological cap 32",
  "Cap symbolique 20.00": "Symbolic cap 20.00",
  "Zone d'intervention 150": "Intervention zone 150",
  "Zone intervention 151.5": "Intervention zone 151.5",
  "Zone décision": "Decision zone",
  "Rebond sur support": "Support bounce",
  "Break support": "Support break",
  "Signal technique": "Technical signal",
  Retest: "Retest",

  // Event markers
  "BEA : PIB +3,3% (att. +2,0%)": "BEA: GDP +3.3% (exp. +2.0%)",
  "BCE : -25bps": "ECB: -25bps",
  "BoE : pivot dovish": "BoE: dovish pivot",
  "BoE ferme": "BoE firm",
  "BoJ : statu quo dovish": "BoJ: dovish hold",
  "CPI < attentes": "CPI below expectations",
  "Choc géopolitique": "Geopolitical shock",
  "Données Chine faibles": "Weak China data",
  "ETF : entrées record": "ETF: record inflows",
  "Guidance divergente": "Diverging guidance",
  "OPEP+ : coupe surprise": "OPEC+: surprise cut",
  "Pivot anticipé": "Pivot priced in",
  "Pétrole -7% / risk-off": "Oil -7% / risk-off",
  "Résultat de l'élection": "Election result",
  "Risque événementiel": "Event risk",
  "Taux réels +18bps": "Real rates +18bps",
  "Taux réels négatifs": "Negative real rates",
  "Marché neutre, pas de réaction": "Neutral market, no reaction",
  "Aucun biais": "No bias",
  "Aucun biais exploitable": "No actionable bias",
  "Aucune hypothèse exploitable": "No actionable read",
  Neutre: "Neutral",
  "USD/MXN bondit (peso pénalisé par le risque commercial)":
    "USD/MXN jumps (peso hit by trade risk)",
  "USD/MXN chute (le Mexique en profite)": "USD/MXN drops (Mexico benefits)",

  // Directional annotations
  "Baissier : demande faible": "Bearish: weak demand",
  "Baissier : l'or souffre de taux réels plus élevés":
    "Bearish: gold suffers from higher real rates",
  "Baissier : l'écart de taux favorise l'USD": "Bearish: the rate gap favours the dollar",
  "Baissier : la livre est pénalisée par des cuts anticipés":
    "Bearish: sterling is penalised by priced-in cuts",
  "Baissier : le CAD résiste": "Bearish: the loonie holds up",
  "Baissier : le yen se renforce": "Bearish: the yen strengthens",
  "Baissier : peur de la récession": "Bearish: recession fear",
  "Baissier : sell the news": "Bearish: sell the news",
  "Haussier : CAD pénalisé (pétrole) + USD refuge":
    "Bullish: loonie hit by oil + haven dollar",
  "Haussier : l'offre se resserre": "Bullish: supply tightens",
  "Haussier : la baisse d'inflation soutient les valorisations":
    "Bullish: cooling inflation supports valuations",
  "Haussier : la demande structurelle s'accélère": "Bullish: structural demand accelerates",
  "Haussier : le carry favorise l'USD": "Bullish: carry favours the dollar",
  "Haussier : soulagement du marché": "Bullish: market relief",
  "Haussier : soutien à la croissance euro": "Bullish: support for euro-area growth",
  "Haussier : valeur refuge": "Bullish: haven bid",
  "Biais baissier EUR/USD car USD soutenu": "Bearish EUR/USD — the dollar is supported",
  "Biais haussier EUR/USD car USD pénalisé": "Bullish EUR/USD — the dollar is penalised",
};

/** Translate a chart annotation into the active locale (identity for FR). */
export function chartLabel(label: string, locale: string): string {
  if (locale !== "en") return label;
  return CHART_LABEL_EN[label] ?? label;
}
