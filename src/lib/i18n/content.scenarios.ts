// TradForge — scenario copy per locale (chapter 1 scripted library).
// `scenarios.ts` remains the structural source of truth (chart specs, cards,
// correct direction). Only human-readable copy is localised here.

import type { Locale } from "./locale";

export interface ScenarioText {
  title: string;
  brief: string;
  question?: string;
  options?: string[];
  rationale: string;
  outcome: string;
}

type ScenarioTextMap = Record<string, Record<Locale, ScenarioText>>;

export const SCENARIO_TEXT: ScenarioTextMap = {
  "std-1": {
    fr: {
      title: "Surprise du PIB américain",
      brief: "Le PIB US du T4 ressort à +3,3 % contre +2,0 % attendu. L'inflation reste élevée, la Fed reste ferme.",
      question: "Publication : PIB US très supérieur aux attentes. Décision la plus cohérente sur EUR/USD ?",
      options: [
        "Biais baissier EUR/USD car USD soutenu",
        "Biais haussier EUR/USD car USD pénalisé",
        "Aucune hypothèse exploitable",
      ],
      rationale: "Une surprise de croissance US renforce l'USD via les anticipations de taux ; EUR/USD baisse mécaniquement si l'euro ne compense pas.",
      outcome: "EUR/USD a cédé ~120 pips dans les 48h, le différentiel de taux jouant en faveur du dollar.",
    },
    en: {
      title: "US GDP surprise",
      brief: "US Q4 GDP prints +3.3% vs +2.0% expected. Inflation stays elevated and the Fed holds a firm line.",
      question: "Release: US GDP far above expectations. Most coherent call on EUR/USD?",
      options: [
        "Bearish EUR/USD — the dollar is supported",
        "Bullish EUR/USD — the dollar is penalised",
        "No actionable read",
      ],
      rationale: "A US growth surprise firms the dollar through rate expectations; EUR/USD mechanically falls unless the euro offsets it.",
      outcome: "EUR/USD gave up ~120 pips within 48h as the rate differential worked for the dollar.",
    },
  },
  "std-2": {
    fr: {
      title: "Choc électoral",
      brief: "Résultat électoral surprise aux US, craintes pour le commerce Mexique–USA.",
      question: "Résultat surprise, craintes pour le commerce Mexique–USA. Que fait l'USD/MXN ?",
      options: [
        "USD/MXN bondit (peso pénalisé par le risque commercial)",
        "USD/MXN chute (le Mexique en profite)",
        "Marché neutre, pas de réaction",
      ],
      rationale: "Un choc de risque commercial frappe les devises émergentes exportatrices. Le peso se déprécie fortement : USD/MXN monte.",
      outcome: "USD/MXN a franchi 20.00 en quelques séances, un plus-haut historique à l'époque.",
    },
    en: {
      title: "Election shock",
      brief: "Surprise US election result, with fears over Mexico–US trade.",
      question: "Surprise result, fears over Mexico–US trade. What does USD/MXN do?",
      options: [
        "USD/MXN jumps (peso hit by trade risk)",
        "USD/MXN drops (Mexico benefits)",
        "Neutral market, no reaction",
      ],
      rationale: "A trade-risk shock hits exporting emerging currencies. The peso depreciates sharply, so USD/MXN rises.",
      outcome: "USD/MXN cleared 20.00 within a few sessions — an all-time high at the time.",
    },
  },
  "std-3": {
    fr: {
      title: "Divergence de politique",
      brief: "La BoJ maintient sa politique ultra-accommodante pendant que la Fed reste ferme.",
      question: "Divergence de politique BoJ vs Fed. Biais le plus cohérent sur USD/JPY ?",
      options: [
        "Haussier : le carry favorise l'USD",
        "Baissier : le yen se renforce",
        "Aucun biais exploitable",
      ],
      rationale: "Un différentiel de taux élevé et stable soutient le carry trade long USD/JPY tant que la BoJ n'intervient pas.",
      outcome: "USD/JPY a grimpé vers 150 avant que le risque d'intervention ne plafonne le mouvement.",
    },
    en: {
      title: "Policy divergence",
      brief: "The BoJ keeps its ultra-accommodative stance while the Fed stays firm.",
      question: "BoJ vs Fed policy divergence. Most coherent bias on USD/JPY?",
      options: [
        "Bullish — carry favours the dollar",
        "Bearish — the yen strengthens",
        "No actionable bias",
      ],
      rationale: "A wide, stable rate differential supports the long USD/JPY carry trade as long as the BoJ stays out.",
      outcome: "USD/JPY climbed toward 150 before intervention risk capped the move.",
    },
  },
  "std-4": {
    fr: {
      title: "Envolée des taux réels",
      brief: "Les taux réels US bondissent après une inflation persistante et un discours ferme de la Fed.",
      question: "Les taux réels montent fortement. Décision sur l'or (XAU/USD) ?",
      options: [
        "Baissier : l'or souffre de taux réels plus élevés",
        "Haussier : valeur refuge",
        "Neutre",
      ],
      rationale: "L'or ne verse pas de coupon : quand les taux réels montent, le coût d'opportunité de le détenir augmente et son prix baisse.",
      outcome: "L'or a reculé sous 1980 avant de se stabiliser une fois les taux réels calmés.",
    },
    en: {
      title: "Real rates spike",
      brief: "US real rates jump after persistent inflation and a firm Fed message.",
      question: "Real rates rise sharply. Call on gold (XAU/USD)?",
      options: [
        "Bearish — gold suffers from higher real rates",
        "Bullish — safe-haven demand",
        "Neutral",
      ],
      rationale: "Gold pays no coupon: when real rates rise, the opportunity cost of holding it increases and the price falls.",
      outcome: "Gold slid below 1980 before stabilising once real rates cooled.",
    },
  },
  "std-5": {
    fr: {
      title: "Surprise accommodante",
      brief: "La BoE surprend par un ton nettement plus accommodant que prévu.",
      question: "La BoE est plus dovish qu'attendu. Biais sur GBP/USD ?",
      options: [
        "Baissier : la livre est pénalisée par des cuts anticipés",
        "Haussier : soulagement du marché",
        "Aucun biais",
      ],
      rationale: "Un pivot dovish réduit l'attrait de rendement de la livre ; GBP/USD baisse si la Fed reste relativement ferme.",
      outcome: "GBP/USD a glissé vers 1.2550, le marché intégrant des baisses de taux plus précoces.",
    },
    en: {
      title: "Dovish surprise",
      brief: "The BoE surprises with a markedly more accommodative tone than expected.",
      question: "The BoE is more dovish than expected. Bias on GBP/USD?",
      options: [
        "Bearish — sterling is penalised by earlier cuts",
        "Bullish — market relief",
        "No bias",
      ],
      rationale: "A dovish pivot erodes sterling's yield appeal; GBP/USD falls when the Fed stays relatively firm.",
      outcome: "GBP/USD slid toward 1.2550 as the market priced earlier rate cuts.",
    },
  },
  "std-6": {
    fr: {
      title: "Surprise OPEP+",
      brief: "L'OPEP+ annonce une réduction de production plus large qu'anticipé.",
      question: "Coupe de production surprise de l'OPEP+. Direction du WTI ?",
      options: [
        "Haussier : l'offre se resserre",
        "Baissier : demande faible",
        "Neutre",
      ],
      rationale: "Une réduction d'offre non anticipée resserre le bilan offre/demande et pousse les prix à la hausse.",
      outcome: "Le WTI a gappé à la hausse de ~6% à l'ouverture puis a prolongé vers 82.",
    },
    en: {
      title: "OPEC+ surprise",
      brief: "OPEC+ announces a deeper production cut than anticipated.",
      question: "Surprise OPEC+ production cut. Direction for WTI?",
      options: [
        "Bullish — supply tightens",
        "Bearish — weak demand",
        "Neutral",
      ],
      rationale: "An unanticipated supply cut tightens the supply/demand balance and pushes prices higher.",
      outcome: "WTI gapped ~6% higher at the open, then extended toward 82.",
    },
  },
  "std-7": {
    fr: {
      title: "CPI en dessous des attentes",
      brief: "L'inflation US ressort nettement sous les attentes, ravivant les espoirs de baisses de taux.",
      question: "CPI plus faible qu'attendu. Réaction la plus cohérente des actions US ?",
      options: [
        "Haussier : la baisse d'inflation soutient les valorisations",
        "Baissier : peur de la récession",
        "Neutre",
      ],
      rationale: "Une inflation plus douce abaisse les taux d'actualisation attendus et soutient les actifs longue duration comme les actions.",
      outcome: "Le S&P a rebondi vers ses plus-hauts, mené par la tech sensible aux taux.",
    },
    en: {
      title: "Soft CPI",
      brief: "US inflation prints well below expectations, reviving rate-cut hopes.",
      question: "Softer-than-expected CPI. Most coherent reaction for US equities?",
      options: [
        "Bullish — lower inflation supports valuations",
        "Bearish — recession fear",
        "Neutral",
      ],
      rationale: "Softer inflation lowers expected discount rates and supports long-duration assets such as equities.",
      outcome: "The S&P rebounded toward its highs, led by rate-sensitive tech.",
    },
  },
  "std-8": {
    fr: {
      title: "Baisse de la BCE",
      brief: "La BCE baisse ses taux tandis que la Fed reste en pause prolongée.",
      question: "La BCE baisse, la Fed patiente. Biais EUR/USD ?",
      options: [
        "Baissier : l'écart de taux favorise l'USD",
        "Haussier : soutien à la croissance euro",
        "Aucun biais",
      ],
      rationale: "Un élargissement du différentiel Fed–BCE en faveur du dollar pèse sur EUR/USD.",
      outcome: "EUR/USD a testé 1.0680 alors que le marché élargissait l'écart de politique.",
    },
    en: {
      title: "ECB cut",
      brief: "The ECB cuts rates while the Fed stays on an extended pause.",
      question: "The ECB cuts, the Fed waits. EUR/USD bias?",
      options: [
        "Bearish — the rate gap favours the dollar",
        "Bullish — support for euro-area growth",
        "No bias",
      ],
      rationale: "A widening Fed–ECB differential in the dollar's favour weighs on EUR/USD.",
      outcome: "EUR/USD tested 1.0680 as the market widened the policy gap.",
    },
  },
  "std-9": {
    fr: {
      title: "Krach pétrolier + risk-off",
      brief: "Chute brutale du pétrole couplée à un épisode d'aversion au risque global.",
      question: "Pétrole en chute et risk-off. Direction de l'USD/CAD ?",
      options: [
        "Haussier : CAD pénalisé (pétrole) + USD refuge",
        "Baissier : le CAD résiste",
        "Neutre",
      ],
      rationale: "Le CAD est corrélé au pétrole ; sa chute plus une fuite vers l'USD refuge poussent l'USD/CAD à la hausse.",
      outcome: "USD/CAD a grimpé vers 1.3750 sur le double choc pétrole + risk-off.",
    },
    en: {
      title: "Oil crash + risk-off",
      brief: "A sharp oil selloff coupled with a global risk-aversion episode.",
      question: "Oil crashing and risk-off. Direction for USD/CAD?",
      options: [
        "Bullish — CAD hit by oil, USD bid as haven",
        "Bearish — the CAD holds up",
        "Neutral",
      ],
      rationale: "The CAD is oil-correlated; the drop plus a flight into the haven dollar pushes USD/CAD higher.",
      outcome: "USD/CAD climbed toward 1.3750 on the twin oil and risk-off shock.",
    },
  },
  "std-10": {
    fr: {
      title: "Flux entrants ETF",
      brief: "Vague d'entrées record sur les ETF spot, la demande institutionnelle s'accélère.",
      question: "Entrées record sur ETF spot. Biais le plus cohérent sur BTC ?",
      options: [
        "Haussier : la demande structurelle s'accélère",
        "Baissier : sell the news",
        "Neutre",
      ],
      rationale: "Des flux acheteurs soutenus par de la demande institutionnelle réduisent l'offre flottante et soutiennent le prix.",
      outcome: "BTC a poussé vers son plus-haut historique porté par des flux ETF persistants.",
    },
    en: {
      title: "ETF inflows",
      brief: "Record inflows into spot ETFs as institutional demand accelerates.",
      question: "Record spot-ETF inflows. Most coherent bias on BTC?",
      options: [
        "Bullish — structural demand is accelerating",
        "Bearish — sell the news",
        "Neutral",
      ],
      rationale: "Sustained institutional buying shrinks float supply and supports the price.",
      outcome: "BTC pushed to a new all-time high on persistent ETF flows.",
    },
  },
  "high-1": {
    fr: {
      title: "Marché du travail US en surchauffe",
      brief: "Payrolls US en forte hausse avec salaires fermes. La Fed martèle un discours prudent. Détermine ton biais directionnel sur EUR/USD pour les 48h.",
      rationale: "NFP solide + Fed ferme + hausse des rendements = dollar soutenu. EUR/USD baisse. Or, VIX et earnings sont du bruit ici.",
      outcome: "EUR/USD a cédé vers 1.0780, le marché repricant moins de baisses de taux Fed.",
    },
    en: {
      title: "Hot US labour market",
      brief: "US payrolls surge with firm wages. The Fed hammers a cautious message. Set your directional bias on EUR/USD for the next 48h.",
      rationale: "Solid NFP + firm Fed + rising yields = supported dollar. EUR/USD falls. Gold, VIX and earnings are noise here.",
      outcome: "EUR/USD gave way toward 1.0780 as the market repriced fewer Fed cuts.",
    },
  },
  "high-2": {
    fr: {
      title: "Squeeze du brut sur le CAD",
      brief: "Le pétrole accélère sur un risque d'offre. Évalue l'impact sur le dollar canadien.",
      rationale: "Une hausse du pétrole soutient le CAD (exportateur) : USD/CAD baisse. Le DXY est un contre-argument secondaire, pas le driver principal.",
      outcome: "USD/CAD a reflué vers 1.3450 avec la fermeté du brut.",
    },
    en: {
      title: "Crude squeeze on CAD",
      brief: "Crude accelerates on supply risk. Assess the impact on the Canadian dollar.",
      rationale: "Higher oil supports the exporter CAD, so USD/CAD falls. The DXY is a secondary counter-argument, not the main driver.",
      outcome: "USD/CAD eased toward 1.3450 as crude stayed firm.",
    },
  },
  "high-3": {
    fr: {
      title: "Écart dovish de la BCE",
      brief: "La croissance euro faiblit, la BCE penche pour des baisses précoces. La Fed patiente.",
      rationale: "Élargissement du différentiel Fed–BCE en faveur de l'USD → EUR/USD baissier. Pétrole, or, supply chain hors sujet.",
      outcome: "EUR/USD a glissé vers 1.0700 sur l'écart de politique monétaire.",
    },
    en: {
      title: "Dovish ECB gap",
      brief: "Euro-area growth weakens and the ECB leans toward early cuts. The Fed waits.",
      rationale: "A widening Fed–ECB differential in the dollar's favour makes EUR/USD bearish. Oil, gold and supply chain are off-topic.",
      outcome: "EUR/USD drifted toward 1.0700 on the policy gap.",
    },
  },
  "high-4": {
    fr: {
      title: "Demande de refuge en risk-off",
      brief: "Un choc géopolitique déclenche une fuite vers les refuges. BoJ toujours dovish.",
      rationale: "En risk-off aigu, le JPY refuge se renforce malgré le carry : USD/JPY baisse. Le VIX et l'or confirment la fuite vers la qualité.",
      outcome: "USD/JPY a chuté vers 145 sur la demande de refuge yen.",
    },
    en: {
      title: "Risk-off haven bid",
      brief: "A geopolitical shock triggers a flight to havens. The BoJ is still dovish.",
      rationale: "In acute risk-off the haven JPY strengthens despite carry, so USD/JPY falls. VIX and gold confirm the flight to quality.",
      outcome: "USD/JPY dropped toward 145 on yen haven demand.",
    },
  },
  "high-5": {
    fr: {
      title: "Inflation collante",
      brief: "CPI core au-dessus des attentes, taux réels en hausse. Évalue l'or.",
      rationale: "CPI chaud → taux réels plus élevés → or baissier (coût d'opportunité). Le risque géopolitique est un contre-argument mineur ici.",
      outcome: "L'or a testé 1975 sur la remontée des taux réels.",
    },
    en: {
      title: "Sticky inflation",
      brief: "Core CPI above expectations, real rates rising. Assess gold.",
      rationale: "Hot CPI → higher real rates → bearish gold (opportunity cost). Geopolitical risk is a minor counter-argument here.",
      outcome: "Gold tested 1975 as real rates climbed.",
    },
  },
  "high-6": {
    fr: {
      title: "Repricing hawkish",
      brief: "Le marché reprice un discours Fed plus ferme après des données solides.",
      rationale: "Un repricing hawkish relève les taux d'actualisation et pèse sur les actions longue duration ; le VIX se tend.",
      outcome: "Le S&P a corrigé vers 4780 avant de se stabiliser.",
    },
    en: {
      title: "Hawkish repricing",
      brief: "The market reprices a firmer Fed after solid data.",
      rationale: "A hawkish repricing lifts discount rates and weighs on long-duration equities; the VIX firms.",
      outcome: "The S&P corrected toward 4780 before stabilising.",
    },
  },
  "high-7": {
    fr: {
      title: "Carry sur le peso",
      brief: "Environnement risk-on, portage élevé sur le peso, Banxico prudente.",
      rationale: "En risk-on avec VIX bas, le carry favorise le peso : USD/MXN baisse. Le positionnement confirme la dynamique.",
      outcome: "USD/MXN a dérivé vers 17.00 porté par le carry.",
    },
    en: {
      title: "Peso carry",
      brief: "Risk-on environment, high peso carry, cautious Banxico.",
      rationale: "In risk-on with a low VIX, carry favours the peso, so USD/MXN falls. Positioning confirms the dynamic.",
      outcome: "USD/MXN drifted toward 17.00 on carry demand.",
    },
  },
  "high-8": {
    fr: {
      title: "La BoE reste ferme",
      brief: "La BoE reste plus ferme que la Fed, inflation services collante au UK.",
      rationale: "Une BoE plus ferme relativement à la Fed soutient la livre : GBP/USD haussier vers 1.2780.",
      outcome: "GBP/USD a grimpé vers 1.2780 sur le différentiel de politique.",
    },
    en: {
      title: "BoE stays firm",
      brief: "The BoE stays firmer than the Fed, with sticky UK services inflation.",
      rationale: "A firmer BoE relative to the Fed supports sterling: GBP/USD bullish toward 1.2780.",
      outcome: "GBP/USD climbed toward 1.2780 on the policy differential.",
    },
  },
  "high-9": {
    fr: {
      title: "Retest de support",
      brief: "Le brut reteste un support majeur alors que la demande se stabilise.",
      rationale: "Rebond net sur un support bien défini avec tendance de fond intacte → biais haussier tant que le support tient.",
      outcome: "Le WTI a rebondi du support 68 vers 80.",
    },
    en: {
      title: "Support retest",
      brief: "Crude retests a major support as demand stabilises.",
      rationale: "A clean bounce off a well-defined support with the underlying trend intact → bullish bias while support holds.",
      outcome: "WTI bounced off 68 support toward 80.",
    },
  },
  "high-10": {
    fr: {
      title: "Dollar piloté par les rendements",
      brief: "Les rendements US repartent à la hausse ; la BoJ n'agit pas.",
      rationale: "Rendements US en hausse + BoJ passive = carry favorable : USD/JPY haussier, sous réserve du risque d'intervention.",
      outcome: "USD/JPY a grimpé vers la zone d'intervention 151.5.",
    },
    en: {
      title: "Yield-driven USD",
      brief: "US yields turn higher again; the BoJ stays put.",
      rationale: "Rising US yields + a passive BoJ = favourable carry: USD/JPY bullish, subject to intervention risk.",
      outcome: "USD/JPY climbed into the 151.5 intervention zone.",
    },
  },
  "prm-1": {
    fr: {
      title: "Taux réels négatifs",
      brief: "Inflation très élevée mais taux directeurs abaissés (taux réels négatifs). Que devient l'USD/TRY ?",
      rationale: "Des taux réels profondément négatifs détruisent l'attrait de la devise : la lire se déprécie durablement, USD/TRY monte.",
      outcome: "USD/TRY a poursuivi sa dépréciation structurelle au-delà de 32.",
    },
    en: {
      title: "Negative real rates",
      brief: "Very high inflation but policy rates cut (deeply negative real rates). What happens to USD/TRY?",
      rationale: "Deeply negative real rates destroy the currency's appeal: the lira depreciates persistently and USD/TRY rises.",
      outcome: "USD/TRY continued its structural depreciation beyond 32.",
    },
  },
  "prm-2": {
    fr: {
      title: "NVDA avant résultats",
      brief: "Analyse NVDA avant ses résultats Q4. Clôture à 875.42, EPS attendu 4.62 sur 20.4B de CA. Sentiment mixte. Détermine ta vue directionnelle.",
      rationale: "Le segment data center compose à +45% et reste sous contrainte d'offre ; le beat rate historique est fort. Le downgrade d'un partenaire (supply chain) est un bruit isolé.",
      outcome: "NVDA a publié un beat avec guidance relevée et a prolongé vers de nouveaux plus-hauts.",
    },
    en: {
      title: "NVDA pre-earnings",
      brief: "Analyse NVDA ahead of Q4 results. Close at 875.42, consensus EPS 4.62 on 20.4B revenue. Mixed sentiment. Set your directional view.",
      rationale: "The data-centre segment compounds at +45% and stays supply-constrained; the historical beat rate is strong. A partner downgrade (supply chain) is isolated noise.",
      outcome: "NVDA beat with raised guidance and extended to new highs.",
    },
  },
  "prm-3": {
    fr: {
      title: "Banques centrales divergentes",
      brief: "Signaux contradictoires : la BCE tergiverse, la Fed reste data-dependent, les spreads souverains s'écartent. Tri du signal exigé.",
      rationale: "Sur l'ensemble des drivers, le différentiel penche pour l'USD ; l'écartement des spreads souverains (BTP-Bund) trahit un stress périphérique et l'euro manque de catalyseur haussier. Biais baissier mesuré.",
      outcome: "EUR/USD a lentement dérivé vers 1.0720.",
    },
    en: {
      title: "Divergent central banks",
      brief: "Conflicting signals: the ECB equivocates, the Fed stays data-dependent, sovereign spreads widen. Signal triage required.",
      rationale: "Across the drivers the differential leans to the dollar; widening sovereign spreads (BTP-Bund) betray peripheral stress and the euro lacks a bullish catalyst. Measured bearish bias.",
      outcome: "EUR/USD drifted slowly toward 1.0720.",
    },
  },
  "prm-4": {
    fr: {
      title: "Peur de stagflation",
      brief: "Inflation collante ET croissance qui ralentit. Le marché hésite entre peur des taux et peur de la récession.",
      rationale: "La stagflation est le pire régime pour les actions : marges compressées et taux d'actualisation élevés. Biais baissier, VIX en support de thèse.",
      outcome: "Le S&P a corrigé vers 4720 avec un VIX en hausse.",
    },
    en: {
      title: "Stagflation scare",
      brief: "Sticky inflation AND slowing growth. The market oscillates between rate fear and recession fear.",
      rationale: "Stagflation is the worst regime for equities: compressed margins and high discount rates. Bearish bias, with the VIX supporting the thesis.",
      outcome: "The S&P corrected toward 4720 with a rising VIX.",
    },
  },
  "prm-5": {
    fr: {
      title: "Devise matières premières",
      brief: "La Chine déçoit, les matières premières faiblissent, appétit pour le risque en baisse.",
      rationale: "L'AUD est une devise cyclique / matières premières : demande chinoise faible + risk-off + USD fort = AUD/USD baissier.",
      outcome: "AUD/USD a glissé vers 0.6450 sur la faiblesse chinoise.",
    },
    en: {
      title: "Commodity currency",
      brief: "China disappoints, commodities soften, risk appetite fades.",
      rationale: "The AUD is a cyclical/commodity currency: weak Chinese demand + risk-off + strong dollar = bearish AUD/USD.",
      outcome: "AUD/USD slid toward 0.6450 on Chinese weakness.",
    },
  },
  "prm-6": {
    fr: {
      title: "Risque de short squeeze",
      brief: "Positionnement spéculatif net short extrême sur le peso avant un risque événementiel.",
      rationale: "Un positionnement short extrême + un catalyseur de risque à venir = risque de squeeze haussier sur USD/MXN. Gestion du risque événementiel clé.",
      outcome: "USD/MXN a squeezé vers 18.00 au déclenchement du catalyseur.",
    },
    en: {
      title: "Short squeeze risk",
      brief: "Extreme net-short speculative positioning on the peso ahead of event risk.",
      rationale: "Extreme short positioning + an upcoming risk catalyst = upside squeeze risk on USD/MXN. Event-risk management is key.",
      outcome: "USD/MXN squeezed toward 18.00 when the catalyst hit.",
    },
  },
  "prm-7": {
    fr: {
      title: "Golden cross contre macro",
      brief: "Signal technique haussier sur l'or, mais macro (taux réels) contradictoire. Arbitre.",
      rationale: "Prime géopolitique + structure technique haussière l'emportent ici sur le vent contraire des taux : biais haussier tactique.",
      outcome: "L'or a cassé vers 2075 porté par la prime de risque.",
    },
    en: {
      title: "Golden cross vs macro",
      brief: "A bullish technical signal on gold, but a contradictory macro read (real rates). Arbitrate.",
      rationale: "Geopolitical premium plus bullish technical structure outweigh the rates headwind here: tactical bullish bias.",
      outcome: "Gold broke toward 2075 on the risk premium.",
    },
  },
  "prm-8": {
    fr: {
      title: "Déficits jumeaux",
      brief: "Détérioration budgétaire US et compression du différentiel de taux. Vue sur le dollar large.",
      rationale: "Un différentiel de taux qui se comprime en défaveur de l'USD + tilt dovish Fed pèsent sur le DXY. L'or confirme (inverse USD).",
      outcome: "Le DXY a reflué vers 101.5 sur la compression du différentiel.",
    },
    en: {
      title: "Twin deficits",
      brief: "US fiscal deterioration and a compressing rate differential. View on the broad dollar.",
      rationale: "A differential compressing against the dollar plus a dovish Fed tilt weigh on the DXY. Gold confirms (inverse USD).",
      outcome: "The DXY eased toward 101.5 as the differential compressed.",
    },
  },
  "prm-9": {
    fr: {
      title: "Transmission du choc énergétique",
      brief: "Flambée du pétrole mais USD globalement fort. Deux forces opposées sur l'USD/CAD.",
      rationale: "L'effet pétrole sur le CAD domine généralement l'effet USD large sur cette paire ; biais baissier USD/CAD, mais conviction modérée vu le contre-courant DXY.",
      outcome: "USD/CAD a reflué vers 1.3400, l'effet pétrole l'emportant.",
    },
    en: {
      title: "Energy shock passthrough",
      brief: "Oil spikes but the dollar is broadly strong. Two opposing forces on USD/CAD.",
      rationale: "The oil effect on the CAD usually dominates the broad-dollar effect on this pair; bearish USD/CAD bias, with moderate conviction given the DXY crosscurrent.",
      outcome: "USD/CAD eased toward 1.3400 as the oil effect won out.",
    },
  },
  "prm-10": {
    fr: {
      title: "Pivot de fin de cycle",
      brief: "Le marché anticipe la fin du cycle de hausse. Inflation qui reflue, croissance résiliente.",
      rationale: "Désinflation + croissance résiliente = régime 'goldilocks' favorable aux actions ; anticipation de pivot soutient les valorisations.",
      outcome: "Le S&P a rejoint ses plus-hauts vers 4920 sur l'espoir de pivot.",
    },
    en: {
      title: "Peak rates pivot",
      brief: "The market prices the end of the hiking cycle. Inflation receding, growth resilient.",
      rationale: "Disinflation plus resilient growth is a goldilocks regime for equities; pivot expectations support valuations.",
      outcome: "The S&P rejoined its highs near 4920 on pivot hopes.",
    },
  },
};
