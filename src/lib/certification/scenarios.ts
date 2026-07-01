// TradForge — Certification scenario library (mock). 10 per level.
// Standard = MCQ replay. High/Premium = macro workspace with Context Cards.

import type { ScenarioSpec, ScenarioCardRef, ChartSpec } from "./types";

function chart(p: Partial<ChartSpec> & Pick<ChartSpec, "symbol" | "period" | "seed" | "basePrice" | "precision" | "shockMagnitude" | "eventLabel">): ChartSpec {
  return {
    candles: 60,
    volatility: 0.006,
    drift: 0,
    shockAt: 34,
    support: undefined,
    resistance: undefined,
    ...p,
  };
}

function ref(cardId: string, relevance: number): ScenarioCardRef {
  return { cardId, relevance };
}

// ─────────────────────────────────────────────────────────────
// STANDARD — MCQ replay engine (2★)
// ─────────────────────────────────────────────────────────────
export const STANDARD: ScenarioSpec[] = [
  {
    id: "std-1", level: "standard", index: 1, title: "US GDP surprise", symbol: "EUR/USD",
    brief: "US Q4 GDP prints +3.3% vs +2.0% expected. Inflation reste élevée, la Fed reste ferme.",
    chart: chart({ symbol: "EUR/USD", period: "Janvier 2024 · H4", seed: 101, basePrice: 1.092, precision: 4, shockMagnitude: -0.014, support: 1.085, supportLabel: "Support court terme", eventLabel: "BEA : PIB +3,3% (att. +2,0%)" }),
    correctDirection: "bear",
    question: "Publication : PIB US très supérieur aux attentes. Décision la plus cohérente sur EUR/USD ?",
    options: [
      { label: "Biais baissier EUR/USD car USD soutenu", direction: "bear" },
      { label: "Biais haussier EUR/USD car USD pénalisé", direction: "bull" },
      { label: "Aucune hypothèse exploitable", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Une surprise de croissance US renforce l'USD via les anticipations de taux ; EUR/USD baisse mécaniquement si l'euro ne compense pas.",
    outcome: "EUR/USD a cédé ~120 pips dans les 48h, le différentiel de taux jouant en faveur du dollar.",
  },
  {
    id: "std-2", level: "standard", index: 2, title: "Election shock", symbol: "USD/MXN",
    brief: "Résultat électoral surprise aux US, craintes pour le commerce Mexique–USA.",
    chart: chart({ symbol: "USD/MXN", period: "Novembre 2016 · H1", seed: 202, basePrice: 18.4, precision: 3, shockMagnitude: 0.05, resistance: 20.0, resistanceLabel: "Cap symbolique 20.00", shockAt: 30, candles: 44, eventLabel: "Résultat de l'élection" }),
    correctDirection: "bull",
    question: "Résultat surprise, craintes pour le commerce Mexique–USA. Que fait l'USD/MXN ?",
    options: [
      { label: "USD/MXN bondit (peso pénalisé par le risque commercial)", direction: "bull" },
      { label: "USD/MXN chute (le Mexique en profite)", direction: "bear" },
      { label: "Marché neutre, pas de réaction", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Un choc de risque commercial frappe les devises émergentes exportatrices. Le peso se déprécie fortement : USD/MXN monte.",
    outcome: "USD/MXN a franchi 20.00 en quelques séances, un plus-haut historique à l'époque.",
  },
  {
    id: "std-3", level: "standard", index: 3, title: "Policy divergence", symbol: "USD/JPY",
    brief: "La BoJ maintient sa politique ultra-accommodante pendant que la Fed reste ferme.",
    chart: chart({ symbol: "USD/JPY", period: "2023 · D1", seed: 303, basePrice: 145.0, precision: 2, shockMagnitude: 0.03, resistance: 150.0, resistanceLabel: "Zone d'intervention 150", eventLabel: "BoJ : statu quo dovish" }),
    correctDirection: "bull",
    question: "Divergence de politique BoJ vs Fed. Biais le plus cohérent sur USD/JPY ?",
    options: [
      { label: "Haussier : le carry favorise l'USD", direction: "bull" },
      { label: "Baissier : le yen se renforce", direction: "bear" },
      { label: "Aucun biais exploitable", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Un différentiel de taux élevé et stable soutient le carry trade long USD/JPY tant que la BoJ n'intervient pas.",
    outcome: "USD/JPY a grimpé vers 150 avant que le risque d'intervention ne plafonne le mouvement.",
  },
  {
    id: "std-4", level: "standard", index: 4, title: "Real rates spike", symbol: "XAU/USD",
    brief: "Les taux réels US bondissent après une inflation persistante et un discours ferme de la Fed.",
    chart: chart({ symbol: "XAU/USD", period: "H4", seed: 404, basePrice: 2020, precision: 1, shockMagnitude: -0.02, support: 1980, supportLabel: "Support majeur 1980", eventLabel: "Taux réels +18bps" }),
    correctDirection: "bear",
    question: "Les taux réels montent fortement. Décision sur l'or (XAU/USD) ?",
    options: [
      { label: "Baissier : l'or souffre de taux réels plus élevés", direction: "bear" },
      { label: "Haussier : valeur refuge", direction: "bull" },
      { label: "Neutre", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "L'or ne verse pas de coupon : quand les taux réels montent, le coût d'opportunité de le détenir augmente et son prix baisse.",
    outcome: "L'or a reculé sous 1980 avant de se stabiliser une fois les taux réels calmés.",
  },
  {
    id: "std-5", level: "standard", index: 5, title: "Dovish surprise", symbol: "GBP/USD",
    brief: "La BoE surprend par un ton nettement plus accommodant que prévu.",
    chart: chart({ symbol: "GBP/USD", period: "H1", seed: 505, basePrice: 1.27, precision: 4, shockMagnitude: -0.018, support: 1.255, supportLabel: "Support 1.2550", eventLabel: "BoE : pivot dovish" }),
    correctDirection: "bear",
    question: "La BoE est plus dovish qu'attendu. Biais sur GBP/USD ?",
    options: [
      { label: "Baissier : la livre est pénalisée par des cuts anticipés", direction: "bear" },
      { label: "Haussier : soulagement du marché", direction: "bull" },
      { label: "Aucun biais", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Un pivot dovish réduit l'attrait de rendement de la livre ; GBP/USD baisse si la Fed reste relativement ferme.",
    outcome: "GBP/USD a glissé vers 1.2550, le marché intégrant des baisses de taux plus précoces.",
  },
  {
    id: "std-6", level: "standard", index: 6, title: "OPEC+ surprise", symbol: "WTI",
    brief: "L'OPEP+ annonce une réduction de production plus large qu'anticipé.",
    chart: chart({ symbol: "WTI", period: "D1", seed: 606, basePrice: 74.0, precision: 2, shockMagnitude: 0.06, resistance: 82.0, resistanceLabel: "Résistance 82.00", eventLabel: "OPEP+ : coupe surprise" }),
    correctDirection: "bull",
    question: "Coupe de production surprise de l'OPEP+. Direction du WTI ?",
    options: [
      { label: "Haussier : l'offre se resserre", direction: "bull" },
      { label: "Baissier : demande faible", direction: "bear" },
      { label: "Neutre", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Une réduction d'offre non anticipée resserre le bilan offre/demande et pousse les prix à la hausse.",
    outcome: "Le WTI a gappé à la hausse de ~6% à l'ouverture puis a prolongé vers 82.",
  },
  {
    id: "std-7", level: "standard", index: 7, title: "Soft CPI", symbol: "US500",
    brief: "L'inflation US ressort nettement sous les attentes, ravivant les espoirs de baisses de taux.",
    chart: chart({ symbol: "US500", period: "H1", seed: 707, basePrice: 4800, precision: 1, shockMagnitude: 0.02, resistance: 4900, resistanceLabel: "ATH 4900", eventLabel: "CPI < attentes" }),
    correctDirection: "bull",
    question: "CPI plus faible qu'attendu. Réaction la plus cohérente des actions US ?",
    options: [
      { label: "Haussier : la baisse d'inflation soutient les valorisations", direction: "bull" },
      { label: "Baissier : peur de la récession", direction: "bear" },
      { label: "Neutre", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Une inflation plus douce abaisse les taux d'actualisation attendus et soutient les actifs longue duration comme les actions.",
    outcome: "Le S&P a rebondi vers ses plus-hauts, mené par la tech sensible aux taux.",
  },
  {
    id: "std-8", level: "standard", index: 8, title: "ECB cut", symbol: "EUR/USD",
    brief: "La BCE baisse ses taux tandis que la Fed reste en pause prolongée.",
    chart: chart({ symbol: "EUR/USD", period: "H4", seed: 808, basePrice: 1.08, precision: 4, shockMagnitude: -0.013, support: 1.068, supportLabel: "Support 1.0680", eventLabel: "BCE : -25bps" }),
    correctDirection: "bear",
    question: "La BCE baisse, la Fed patiente. Biais EUR/USD ?",
    options: [
      { label: "Baissier : l'écart de taux favorise l'USD", direction: "bear" },
      { label: "Haussier : soutien à la croissance euro", direction: "bull" },
      { label: "Aucun biais", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Un élargissement du différentiel Fed–BCE en faveur du dollar pèse sur EUR/USD.",
    outcome: "EUR/USD a testé 1.0680 alors que le marché élargissait l'écart de politique.",
  },
  {
    id: "std-9", level: "standard", index: 9, title: "Oil crash + risk-off", symbol: "USD/CAD",
    brief: "Chute brutale du pétrole couplée à un épisode d'aversion au risque global.",
    chart: chart({ symbol: "USD/CAD", period: "H1", seed: 909, basePrice: 1.35, precision: 4, shockMagnitude: 0.02, resistance: 1.375, resistanceLabel: "Résistance 1.3750", eventLabel: "Pétrole -7% / risk-off" }),
    correctDirection: "bull",
    question: "Pétrole en chute et risk-off. Direction de l'USD/CAD ?",
    options: [
      { label: "Haussier : CAD pénalisé (pétrole) + USD refuge", direction: "bull" },
      { label: "Baissier : le CAD résiste", direction: "bear" },
      { label: "Neutre", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Le CAD est corrélé au pétrole ; sa chute plus une fuite vers l'USD refuge poussent l'USD/CAD à la hausse.",
    outcome: "USD/CAD a grimpé vers 1.3750 sur le double choc pétrole + risk-off.",
  },
  {
    id: "std-10", level: "standard", index: 10, title: "ETF inflows", symbol: "BTC/USD",
    brief: "Vague d'entrées record sur les ETF spot, la demande institutionnelle s'accélère.",
    chart: chart({ symbol: "BTC/USD", period: "D1", seed: 110, basePrice: 62000, precision: 0, shockMagnitude: 0.05, resistance: 69000, resistanceLabel: "ATH 69k", eventLabel: "ETF : entrées record" }),
    correctDirection: "bull",
    question: "Entrées record sur ETF spot. Biais le plus cohérent sur BTC ?",
    options: [
      { label: "Haussier : la demande structurelle s'accélère", direction: "bull" },
      { label: "Baissier : sell the news", direction: "bear" },
      { label: "Neutre", direction: "neutral" },
    ],
    correctIndex: 0,
    rationale: "Des flux acheteurs soutenus par de la demande institutionnelle réduisent l'offre flottante et soutiennent le prix.",
    outcome: "BTC a poussé vers son plus-haut historique porté par des flux ETF persistants.",
  },
];

// ─────────────────────────────────────────────────────────────
// HIGH — Macro Decision Workspace (4★) : essentiels + distracteurs
// ─────────────────────────────────────────────────────────────
export const HIGH: ScenarioSpec[] = [
  {
    id: "high-1", level: "high", index: 1, title: "Hot US labour market", symbol: "EUR/USD",
    brief: "Payrolls US en forte hausse avec salaires fermes. La Fed martèle un discours prudent. Détermine ton biais directionnel sur EUR/USD pour les 48h.",
    chart: chart({ symbol: "EUR/USD", period: "H4", seed: 211, basePrice: 1.088, precision: 4, shockMagnitude: -0.012, support: 1.078, supportLabel: "Support 1.0780", eventLabel: "NFP +256k" }),
    correctDirection: "bear",
    cards: [ref("nfp", 90), ref("fed", 86), ref("us10y", 82), ref("gold", 40), ref("vix", 30), ref("earnings", 15)],
    rationale: "NFP solide + Fed ferme + hausse des rendements = dollar soutenu. EUR/USD baisse. Or, VIX et earnings sont du bruit ici.",
    outcome: "EUR/USD a cédé vers 1.0780, le marché repricant moins de baisses de taux Fed.",
  },
  {
    id: "high-2", level: "high", index: 2, title: "Crude squeeze on CAD", symbol: "USD/CAD",
    brief: "Le pétrole accélère sur un risque d'offre. Évalue l'impact sur le dollar canadien.",
    chart: chart({ symbol: "USD/CAD", period: "H1", seed: 212, basePrice: 1.36, precision: 4, shockMagnitude: -0.014, support: 1.345, supportLabel: "Support 1.3450", eventLabel: "WTI +4%" }),
    correctDirection: "bear",
    cards: [ref("oil", 90), ref("technial-structure", 78), ref("dxy", 55), ref("vix", 28), ref("geopolitics", 45), ref("earnings", 12)],
    rationale: "Une hausse du pétrole soutient le CAD (exportateur) : USD/CAD baisse. Le DXY est un contre-argument secondaire, pas le driver principal.",
    outcome: "USD/CAD a reflué vers 1.3450 avec la fermeté du brut.",
  },
  {
    id: "high-3", level: "high", index: 3, title: "Dovish ECB gap", symbol: "EUR/USD",
    brief: "La croissance euro faiblit, la BCE penche pour des baisses précoces. La Fed patiente.",
    chart: chart({ symbol: "EUR/USD", period: "H4", seed: 213, basePrice: 1.082, precision: 4, shockMagnitude: -0.011, support: 1.07, supportLabel: "Support 1.0700", eventLabel: "ECB dovish" }),
    correctDirection: "bear",
    cards: [ref("ecb", 90), ref("fed", 84), ref("us10y", 76), ref("oil", 30), ref("gold", 25), ref("supplychain", 10)],
    rationale: "Élargissement du différentiel Fed–BCE en faveur de l'USD → EUR/USD baissier. Pétrole, or, supply chain hors sujet.",
    outcome: "EUR/USD a glissé vers 1.0700 sur l'écart de politique monétaire.",
  },
  {
    id: "high-4", level: "high", index: 4, title: "Risk-off haven bid", symbol: "USD/JPY",
    brief: "Un choc géopolitique déclenche une fuite vers les refuges. BoJ toujours dovish.",
    chart: chart({ symbol: "USD/JPY", period: "H1", seed: 214, basePrice: 148.0, precision: 2, shockMagnitude: -0.02, support: 145.0, supportLabel: "Support 145.00", eventLabel: "Choc géopolitique" }),
    correctDirection: "bear",
    cards: [ref("geopolitics", 88), ref("vix", 84), ref("gold", 72), ref("fed", 45), ref("oil", 40), ref("earnings", 10)],
    rationale: "En risk-off aigu, le JPY refuge se renforce malgré le carry : USD/JPY baisse. Le VIX et l'or confirment la fuite vers la qualité.",
    outcome: "USD/JPY a chuté vers 145 sur la demande de refuge yen.",
  },
  {
    id: "high-5", level: "high", index: 5, title: "Sticky inflation", symbol: "XAU/USD",
    brief: "CPI core au-dessus des attentes, taux réels en hausse. Évalue l'or.",
    chart: chart({ symbol: "XAU/USD", period: "H4", seed: 215, basePrice: 2010, precision: 1, shockMagnitude: -0.017, support: 1975, supportLabel: "Support 1975", eventLabel: "Core CPI beat" }),
    correctDirection: "bear",
    cards: [ref("cpi", 90), ref("us10y", 85), ref("fed", 80), ref("geopolitics", 38), ref("vix", 30), ref("competition", 8)],
    rationale: "CPI chaud → taux réels plus élevés → or baissier (coût d'opportunité). Le risque géopolitique est un contre-argument mineur ici.",
    outcome: "L'or a testé 1975 sur la remontée des taux réels.",
  },
  {
    id: "high-6", level: "high", index: 6, title: "Hawkish repricing", symbol: "US500",
    brief: "Le marché reprice un discours Fed plus ferme après des données solides.",
    chart: chart({ symbol: "US500", period: "H1", seed: 216, basePrice: 4850, precision: 1, shockMagnitude: -0.015, support: 4780, supportLabel: "Support 4780", eventLabel: "Fed hawkish" }),
    correctDirection: "bear",
    cards: [ref("fed", 88), ref("us10y", 84), ref("vix", 78), ref("oil", 30), ref("gold", 25), ref("supplychain", 10)],
    rationale: "Un repricing hawkish relève les taux d'actualisation et pèse sur les actions longue duration ; le VIX se tend.",
    outcome: "Le S&P a corrigé vers 4780 avant de se stabiliser.",
  },
  {
    id: "high-7", level: "high", index: 7, title: "Peso carry", symbol: "USD/MXN",
    brief: "Environnement risk-on, portage élevé sur le peso, Banxico prudente.",
    chart: chart({ symbol: "USD/MXN", period: "D1", seed: 217, basePrice: 17.5, precision: 3, shockMagnitude: -0.02, support: 17.0, supportLabel: "Support 17.00", eventLabel: "Risk-on / carry" }),
    correctDirection: "bear",
    cards: [ref("vix", 84), ref("positioning", 80), ref("us10y", 62), ref("oil", 35), ref("geopolitics", 30), ref("earnings", 8)],
    rationale: "En risk-on avec VIX bas, le carry favorise le peso : USD/MXN baisse. Le positionnement confirme la dynamique.",
    outcome: "USD/MXN a dérivé vers 17.00 porté par le carry.",
  },
  {
    id: "high-8", level: "high", index: 8, title: "BoE stays firm", symbol: "GBP/USD",
    brief: "La BoE reste plus ferme que la Fed, inflation services collante au UK.",
    chart: chart({ symbol: "GBP/USD", period: "H4", seed: 218, basePrice: 1.26, precision: 4, shockMagnitude: 0.013, resistance: 1.278, resistanceLabel: "Résistance 1.2780", eventLabel: "BoE ferme" }),
    correctDirection: "bull",
    cards: [ref("fed", 82), ref("cpi", 80), ref("us10y", 70), ref("oil", 25), ref("gold", 20), ref("supplychain", 8)],
    rationale: "Une BoE plus ferme relativement à la Fed soutient la livre : GBP/USD haussier vers 1.2780.",
    outcome: "GBP/USD a grimpé vers 1.2780 sur le différentiel de politique.",
  },
  {
    id: "high-9", level: "high", index: 9, title: "Support retest", symbol: "WTI",
    brief: "Le brut reteste un support majeur alors que la demande se stabilise.",
    chart: chart({ symbol: "WTI", period: "D1", seed: 219, basePrice: 72.0, precision: 2, shockMagnitude: 0.03, resistance: 80.0, resistanceLabel: "Résistance 80.00", support: 68.0, supportLabel: "Support 68.00", eventLabel: "Rebond sur support" }),
    correctDirection: "bull",
    cards: [ref("technial-structure", 88), ref("oil", 82), ref("geopolitics", 66), ref("vix", 30), ref("gold", 22), ref("earnings", 8)],
    rationale: "Rebond net sur un support bien défini avec tendance de fond intacte → biais haussier tant que le support tient.",
    outcome: "Le WTI a rebondi du support 68 vers 80.",
  },
  {
    id: "high-10", level: "high", index: 10, title: "Yield-driven USD", symbol: "USD/JPY",
    brief: "Les rendements US repartent à la hausse ; la BoJ n'agit pas.",
    chart: chart({ symbol: "USD/JPY", period: "H4", seed: 220, basePrice: 147.0, precision: 2, shockMagnitude: 0.02, resistance: 151.5, resistanceLabel: "Zone intervention 151.5", eventLabel: "US10Y +12bps" }),
    correctDirection: "bull",
    cards: [ref("us10y", 90), ref("fed", 82), ref("positioning", 60), ref("vix", 28), ref("gold", 22), ref("supplychain", 8)],
    rationale: "Rendements US en hausse + BoJ passive = carry favorable : USD/JPY haussier, sous réserve du risque d'intervention.",
    outcome: "USD/JPY a grimpé vers la zone d'intervention 151.5.",
  },
];

// ─────────────────────────────────────────────────────────────
// PREMIUM — Reasoning + Coherence (5★) : toutes les cards, aucun indice
// ─────────────────────────────────────────────────────────────
export const PREMIUM: ScenarioSpec[] = [
  {
    id: "prm-1", level: "premium", index: 1, title: "Negative real rates", symbol: "USD/TRY",
    brief: "Inflation très élevée mais taux directeurs abaissés (taux réels négatifs). Que devient l'USD/TRY ?",
    chart: chart({ symbol: "USD/TRY", period: "H4", seed: 311, basePrice: 28.0, precision: 3, shockMagnitude: 0.05, resistance: 32.0, resistanceLabel: "Cap psychologique 32", eventLabel: "Taux réels négatifs" }),
    correctDirection: "bull",
    cards: [ref("cpi", 90), ref("fed", 78), ref("us10y", 70), ref("geopolitics", 52), ref("vix", 40), ref("oil", 34), ref("gold", 30)],
    rationale: "Des taux réels profondément négatifs détruisent l'attrait de la devise : la lire se déprécie durablement, USD/TRY monte.",
    outcome: "USD/TRY a poursuivi sa dépréciation structurelle au-delà de 32.",
  },
  {
    id: "prm-2", level: "premium", index: 2, title: "NVDA pre-earnings", symbol: "NVDA",
    brief: "Analyse NVDA avant ses résultats Q4. Clôture à 875.42, EPS attendu 4.62 sur 20.4B de CA. Sentiment mixte. Détermine ta vue directionnelle.",
    chart: chart({ symbol: "NVDA", period: "D1", seed: 312, basePrice: 860, precision: 2, shockMagnitude: 0.04, resistance: 950, resistanceLabel: "Résistance 950", support: 820, supportLabel: "Support 820", eventLabel: "Q4 earnings" }),
    correctDirection: "bull",
    cards: [ref("earnings", 88), ref("datacenter", 90), ref("competition", 45), ref("supplychain", 40), ref("vix", 30), ref("technial-structure", 66), ref("news", 35)],
    rationale: "Le segment data center compose à +45% et reste sous contrainte d'offre ; le beat rate historique est fort. Le downgrade d'un partenaire (supply chain) est un bruit isolé.",
    outcome: "NVDA a publié un beat avec guidance relevée et a prolongé vers de nouveaux plus-hauts.",
  },
  {
    id: "prm-3", level: "premium", index: 3, title: "Divergent central banks", symbol: "EUR/USD",
    brief: "Signaux contradictoires : la BCE tergiverse, la Fed reste data-dependent. Tri du signal exigé.",
    chart: chart({ symbol: "EUR/USD", period: "H4", seed: 313, basePrice: 1.085, precision: 4, shockMagnitude: -0.012, support: 1.072, supportLabel: "Support 1.0720", eventLabel: "Guidance divergente" }),
    correctDirection: "bear",
    cards: [ref("ecb", 86), ref("fed", 84), ref("us10y", 78), ref("cpi", 70), ref("oil", 34), ref("gold", 26), ref("vix", 30)],
    rationale: "Sur l'ensemble des drivers, le différentiel penche pour l'USD ; l'euro manque de catalyseur haussier. Biais baissier mesuré.",
    outcome: "EUR/USD a lentement dérivé vers 1.0720.",
  },
  {
    id: "prm-4", level: "premium", index: 4, title: "Stagflation scare", symbol: "US500",
    brief: "Inflation collante ET croissance qui ralentit. Le marché hésite entre peur des taux et peur de la récession.",
    chart: chart({ symbol: "US500", period: "H1", seed: 314, basePrice: 4820, precision: 1, shockMagnitude: -0.018, support: 4720, supportLabel: "Support 4720", eventLabel: "Stagflation signals" }),
    correctDirection: "bear",
    cards: [ref("cpi", 85), ref("fed", 82), ref("us10y", 80), ref("vix", 76), ref("oil", 60), ref("gold", 40), ref("geopolitics", 30)],
    rationale: "La stagflation est le pire régime pour les actions : marges compressées et taux d'actualisation élevés. Biais baissier, VIX en support de thèse.",
    outcome: "Le S&P a corrigé vers 4720 avec un VIX en hausse.",
  },
  {
    id: "prm-5", level: "premium", index: 5, title: "Commodity currency", symbol: "AUD/USD",
    brief: "La Chine déçoit, les matières premières faiblissent, appétit pour le risque en baisse.",
    chart: chart({ symbol: "AUD/USD", period: "H4", seed: 315, basePrice: 0.66, precision: 4, shockMagnitude: -0.02, support: 0.645, supportLabel: "Support 0.6450", eventLabel: "Données Chine faibles" }),
    correctDirection: "bear",
    cards: [ref("oil", 70), ref("vix", 78), ref("dxy", 82), ref("us10y", 66), ref("gold", 40), ref("geopolitics", 34), ref("positioning", 55)],
    rationale: "L'AUD est une devise cyclique / matières premières : demande chinoise faible + risk-off + USD fort = AUD/USD baissier.",
    outcome: "AUD/USD a glissé vers 0.6450 sur la faiblesse chinoise.",
  },
  {
    id: "prm-6", level: "premium", index: 6, title: "Short squeeze risk", symbol: "USD/MXN",
    brief: "Positionnement spéculatif net short extrême sur le peso avant un risque événementiel.",
    chart: chart({ symbol: "USD/MXN", period: "H1", seed: 316, basePrice: 17.2, precision: 3, shockMagnitude: 0.03, resistance: 18.0, resistanceLabel: "Résistance 18.00", eventLabel: "Risque événementiel" }),
    correctDirection: "bull",
    cards: [ref("positioning", 88), ref("calendar", 80), ref("vix", 70), ref("geopolitics", 60), ref("oil", 34), ref("us10y", 40), ref("gold", 22)],
    rationale: "Un positionnement short extrême + un catalyseur de risque à venir = risque de squeeze haussier sur USD/MXN. Gestion du risque événementiel clé.",
    outcome: "USD/MXN a squeezé vers 18.00 au déclenchement du catalyseur.",
  },
  {
    id: "prm-7", level: "premium", index: 7, title: "Golden cross vs macro", symbol: "XAU/USD",
    brief: "Signal technique haussier sur l'or, mais macro (taux réels) contradictoire. Arbitre.",
    chart: chart({ symbol: "XAU/USD", period: "D1", seed: 317, basePrice: 2000, precision: 1, shockMagnitude: 0.02, resistance: 2075, resistanceLabel: "ATH 2075", support: 1960, supportLabel: "Support 1960", eventLabel: "Signal technique" }),
    correctDirection: "bull",
    cards: [ref("technial-structure", 84), ref("us10y", 78), ref("geopolitics", 80), ref("fed", 60), ref("vix", 66), ref("gold", 70), ref("cpi", 40)],
    rationale: "Prime géopolitique + structure technique haussière l'emportent ici sur le vent contraire des taux : biais haussier tactique.",
    outcome: "L'or a cassé vers 2075 porté par la prime de risque.",
  },
  {
    id: "prm-8", level: "premium", index: 8, title: "Twin deficits", symbol: "DXY",
    brief: "Détérioration budgétaire US et compression du différentiel de taux. Vue sur le dollar large.",
    chart: chart({ symbol: "DXY", period: "D1", seed: 318, basePrice: 104.0, precision: 2, shockMagnitude: -0.015, support: 101.5, supportLabel: "Support 101.5", eventLabel: "Fed dovish tilt" }),
    correctDirection: "bear",
    cards: [ref("fed", 86), ref("us10y", 84), ref("ecb", 70), ref("cpi", 66), ref("gold", 60), ref("vix", 40), ref("oil", 34)],
    rationale: "Un différentiel de taux qui se comprime en défaveur de l'USD + tilt dovish Fed pèsent sur le DXY. L'or confirme (inverse USD).",
    outcome: "Le DXY a reflué vers 101.5 sur la compression du différentiel.",
  },
  {
    id: "prm-9", level: "premium", index: 9, title: "Energy shock passthrough", symbol: "USD/CAD",
    brief: "Flambée du pétrole mais USD globalement fort. Deux forces opposées sur l'USD/CAD.",
    chart: chart({ symbol: "USD/CAD", period: "H4", seed: 319, basePrice: 1.355, precision: 4, shockMagnitude: -0.012, support: 1.34, supportLabel: "Support 1.3400", eventLabel: "WTI +5% / DXY +0.5%" }),
    correctDirection: "bear",
    cards: [ref("oil", 88), ref("dxy", 74), ref("us10y", 62), ref("technial-structure", 66), ref("vix", 40), ref("gold", 26), ref("geopolitics", 44)],
    rationale: "L'effet pétrole sur le CAD domine généralement l'effet USD large sur cette paire ; biais baissier USD/CAD, mais conviction modérée vu le contre-courant DXY.",
    outcome: "USD/CAD a reflué vers 1.3400, l'effet pétrole l'emportant.",
  },
  {
    id: "prm-10", level: "premium", index: 10, title: "Peak rates pivot", symbol: "US500",
    brief: "Le marché anticipe la fin du cycle de hausse. Inflation qui reflue, croissance résiliente.",
    chart: chart({ symbol: "US500", period: "D1", seed: 320, basePrice: 4780, precision: 1, shockMagnitude: 0.02, resistance: 4920, resistanceLabel: "ATH 4920", eventLabel: "Pivot anticipé" }),
    correctDirection: "bull",
    cards: [ref("cpi", 84), ref("fed", 82), ref("us10y", 78), ref("vix", 70), ref("earnings", 60), ref("gold", 40), ref("oil", 30)],
    rationale: "Désinflation + croissance résiliente = régime 'goldilocks' favorable aux actions ; anticipation de pivot soutient les valorisations.",
    outcome: "Le S&P a rejoint ses plus-hauts vers 4920 sur l'espoir de pivot.",
  },
];

export const ALL_SCENARIOS: ScenarioSpec[] = [...STANDARD, ...HIGH, ...PREMIUM];

export function getScenarios(level: "standard" | "high" | "premium"): ScenarioSpec[] {
  return level === "standard" ? STANDARD : level === "high" ? HIGH : PREMIUM;
}

export function getScenario(level: "standard" | "high" | "premium", index: number): ScenarioSpec | undefined {
  return getScenarios(level).find((s) => s.index === index);
}
