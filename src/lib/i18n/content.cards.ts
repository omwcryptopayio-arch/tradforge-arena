// TradForge — Context Card catalogue text, per locale.
// The catalogue in `cards.ts` stays the structural source of truth (ids,
// tickers, categories, datasets); only human-readable text is localised here.

import type { Locale } from "./locale";

export interface CardDetailText {
  heading: string;
  body: string;
}

export interface CardText {
  title: string;
  summary: string;
  metric?: string;
  detail: CardDetailText[];
}

type CardTextMap = Record<string, Record<Locale, CardText>>;

export const CARD_TEXT: CardTextMap = {
  "technial-structure": {
    en: {
      title: "Chart Structure",
      summary: "Key support / resistance and trend structure.",
      metric: "At support",
      detail: [
        { heading: "LEVELS", body: "Price tests a well-defined support with the higher-timeframe trend intact." },
        { heading: "IMPLICATION", body: "Support holding favours continuation; a clean break flips the structure." },
      ],
    },
    fr: {
      title: "Structure graphique",
      summary: "Supports / résistances clés et structure de tendance.",
      metric: "Sur support",
      detail: [
        { heading: "NIVEAUX", body: "Le prix teste un support bien défini, la tendance des unités supérieures restant intacte." },
        { heading: "IMPLICATION", body: "Un support tenu favorise la continuation ; une cassure nette inverse la structure." },
      ],
    },
  },
  dxy: {
    en: {
      title: "Dollar Index",
      summary: "Broad USD strength gauge vs a basket of majors.",
      detail: [
        { heading: "READING", body: "DXY breaks above its 50-day average as US yields firm. A rising dollar mechanically pressures EUR, GBP and most risk FX." },
        { heading: "IMPLICATION", body: "Dollar-positive prints reinforce USD-quoted pairs. Watch for exhaustion near prior swing highs." },
      ],
    },
    fr: {
      title: "Indice Dollar",
      summary: "Mesure large de la force de l'USD face à un panier de devises majeures.",
      detail: [
        { heading: "LECTURE", body: "Le DXY casse au-dessus de sa moyenne 50 jours pendant que les rendements US se tendent. Un dollar qui monte pèse mécaniquement sur l'EUR, la GBP et la plupart des devises risquées." },
        { heading: "IMPLICATION", body: "Les publications favorables au dollar renforcent les paires cotées en USD. Surveiller l'essoufflement près des précédents sommets." },
      ],
    },
  },
  us10y: {
    en: {
      title: "10Y Treasury Yield",
      summary: "Benchmark risk-free rate and rate-differential driver.",
      detail: [
        { heading: "MOVE", body: "Yields climb +12bps on hot data. Rate differentials widen in the dollar's favour." },
        { heading: "IMPLICATION", body: "Higher US real rates attract capital, supporting USD and pressuring long-duration equities and gold." },
      ],
    },
    fr: {
      title: "Rendement 10 ans US",
      summary: "Taux sans risque de référence et moteur du différentiel de taux.",
      detail: [
        { heading: "MOUVEMENT", body: "Les rendements montent de +12 pb sur une donnée chaude. Le différentiel de taux s'élargit en faveur du dollar." },
        { heading: "IMPLICATION", body: "Des taux réels US plus élevés attirent les capitaux : soutien à l'USD, pression sur les actions longue duration et l'or." },
      ],
    },
  },
  fed: {
    en: {
      title: "Fed Policy Stance",
      summary: "FOMC tone, dot-plot and rate expectations.",
      detail: [
        { heading: "GUIDANCE", body: "Officials push back on early cuts and flag sticky services inflation. Market trims rate-cut bets for the year." },
        { heading: "IMPLICATION", body: "A hawkish repricing lifts the dollar and front-end yields; a dovish pivot does the opposite." },
      ],
    },
    fr: {
      title: "Posture de la Fed",
      summary: "Ton du FOMC, dot-plot et anticipations de taux.",
      detail: [
        { heading: "GUIDANCE", body: "Les membres repoussent l'idée de baisses précoces et pointent une inflation des services collante. Le marché réduit ses paris de baisse." },
        { heading: "IMPLICATION", body: "Un repricing ferme soutient le dollar et le court de la courbe ; un pivot accommodant produit l'inverse." },
      ],
    },
  },
  cpi: {
    en: {
      title: "Inflation Print",
      summary: "Headline & core consumer price surprise vs consensus.",
      detail: [
        { heading: "SURPRISE", body: "Core CPI runs above expectations, keeping the disinflation narrative on hold." },
        { heading: "IMPLICATION", body: "Upside inflation is dollar-positive via the rates channel and typically weighs on risk assets." },
      ],
    },
    fr: {
      title: "Publication d'inflation",
      summary: "Surprise des prix à la consommation (total et sous-jacent) vs consensus.",
      detail: [
        { heading: "SURPRISE", body: "Le CPI core ressort au-dessus des attentes, ce qui met en pause le récit désinflationniste." },
        { heading: "IMPLICATION", body: "Une inflation surprise à la hausse soutient le dollar via le canal des taux et pèse généralement sur les actifs risqués." },
      ],
    },
  },
  nfp: {
    en: {
      title: "Labour Market",
      summary: "Non-farm payrolls, wages and unemployment.",
      detail: [
        { heading: "DATA", body: "Payrolls beat with firm wage growth. A resilient labour market lowers the odds of near-term easing." },
        { heading: "IMPLICATION", body: "Strong jobs data supports the dollar and yields; a sharp miss reverses the read." },
      ],
    },
    fr: {
      title: "Marché du travail",
      summary: "Emplois non agricoles, salaires et chômage.",
      detail: [
        { heading: "DONNÉE", body: "Les créations d'emplois dépassent les attentes avec des salaires fermes. Un marché du travail résilient réduit la probabilité d'un assouplissement rapide." },
        { heading: "IMPLICATION", body: "Un emploi solide soutient le dollar et les rendements ; un net raté inverse la lecture." },
      ],
    },
  },
  ecb: {
    en: {
      title: "ECB Stance",
      summary: "Euro-area policy path relative to the Fed.",
      detail: [
        { heading: "GUIDANCE", body: "Softening euro-area growth opens the door to earlier ECB cuts than the Fed." },
        { heading: "IMPLICATION", body: "A widening Fed–ECB policy gap is EUR/USD-negative." },
      ],
    },
    fr: {
      title: "Posture de la BCE",
      summary: "Trajectoire de politique en zone euro par rapport à la Fed.",
      detail: [
        { heading: "GUIDANCE", body: "Le ralentissement de la croissance en zone euro ouvre la voie à des baisses BCE plus précoces que la Fed." },
        { heading: "IMPLICATION", body: "Un écart de politique Fed–BCE qui s'élargit est défavorable à l'EUR/USD." },
      ],
    },
  },
  oil: {
    en: {
      title: "Crude Oil",
      summary: "Energy prices — inflation and terms-of-trade signal.",
      detail: [
        { heading: "MOVE", body: "Crude jumps on supply-side risk. Energy-importer currencies weaken; exporters (CAD, NOK) firm." },
        { heading: "IMPLICATION", body: "Rising oil feeds headline inflation and can complicate central-bank easing." },
      ],
    },
    fr: {
      title: "Pétrole brut",
      summary: "Prix de l'énergie — signal d'inflation et de termes de l'échange.",
      detail: [
        { heading: "MOUVEMENT", body: "Le brut bondit sur un risque d'offre. Les devises importatrices s'affaiblissent, les exportatrices (CAD, NOK) se raffermissent." },
        { heading: "IMPLICATION", body: "Un pétrole en hausse alimente l'inflation totale et complique l'assouplissement des banques centrales." },
      ],
    },
  },
  gold: {
    en: {
      title: "Gold",
      summary: "Safe-haven and real-rate barometer.",
      detail: [
        { heading: "MOVE", body: "Gold slips as real yields rise. Haven demand fades in a risk-on tape." },
        { heading: "IMPLICATION", body: "Gold and real rates move inversely; a haven bid signals risk-off rotation." },
      ],
    },
    fr: {
      title: "Or",
      summary: "Baromètre du refuge et des taux réels.",
      detail: [
        { heading: "MOUVEMENT", body: "L'or recule à mesure que les taux réels montent. La demande de refuge s'estompe en régime risk-on." },
        { heading: "IMPLICATION", body: "Or et taux réels évoluent en sens inverse ; une demande de refuge signale une rotation risk-off." },
      ],
    },
  },
  vix: {
    en: {
      title: "Volatility Index",
      summary: "Equity implied-volatility / risk-appetite gauge.",
      detail: [
        { heading: "READING", body: "VIX sits mid-range — no acute stress, but hedging demand is picking up into the event." },
        { heading: "IMPLICATION", body: "A VIX spike above 25 signals risk-off; a compressed VIX favours carry and risk FX." },
      ],
    },
    fr: {
      title: "Indice de volatilité",
      summary: "Volatilité implicite actions / jauge d'appétit pour le risque.",
      detail: [
        { heading: "LECTURE", body: "Le VIX est en milieu de fourchette — pas de stress aigu, mais la demande de couverture augmente avant l'événement." },
        { heading: "IMPLICATION", body: "Un VIX au-dessus de 25 signale un régime risk-off ; un VIX comprimé favorise le carry et les devises risquées." },
      ],
    },
  },
  calendar: {
    en: {
      title: "Economic Calendar",
      summary: "Upcoming high-impact releases in the window.",
      detail: [
        { heading: "AHEAD", body: "A tier-1 data release and a central-bank speaker fall inside the decision horizon." },
        { heading: "IMPLICATION", body: "Event risk argues for smaller conviction until the print clears." },
      ],
    },
    fr: {
      title: "Calendrier économique",
      summary: "Publications à fort impact attendues dans la fenêtre.",
      detail: [
        { heading: "À VENIR", body: "Une donnée de premier rang et une intervention de banquier central tombent dans l'horizon de décision." },
        { heading: "IMPLICATION", body: "Le risque événementiel plaide pour une conviction réduite tant que la publication n'est pas passée." },
      ],
    },
  },
  news: {
    en: {
      title: "Headline Flow",
      summary: "Breaking newswire relevant to the instrument.",
      detail: [
        { heading: "FLASH", body: "Wire reports conflicting sources. Initial reaction often overshoots before fundamentals reassert." },
        { heading: "IMPLICATION", body: "Fade the knee-jerk only when the fundamental read is clearly one-sided." },
      ],
    },
    fr: {
      title: "Flux de dépêches",
      summary: "Fil d'actualité en direct pertinent pour l'instrument.",
      detail: [
        { heading: "FLASH", body: "Les dépêches rapportent des sources contradictoires. La réaction initiale exagère souvent avant le retour des fondamentaux." },
        { heading: "IMPLICATION", body: "Ne prendre le contre-pied du réflexe initial que si la lecture fondamentale est clairement univoque." },
      ],
    },
  },
  positioning: {
    en: {
      title: "Positioning / COT",
      summary: "Speculative positioning extremes.",
      detail: [
        { heading: "READING", body: "Speculators sit at a crowded net-short extreme, raising squeeze risk on any positive surprise." },
        { heading: "IMPLICATION", body: "Stretched positioning amplifies counter-trend moves." },
      ],
    },
    fr: {
      title: "Positionnement / COT",
      summary: "Extrêmes de positionnement spéculatif.",
      detail: [
        { heading: "LECTURE", body: "Les spéculateurs sont à un extrême net short très encombré, ce qui accroît le risque de squeeze sur toute surprise positive." },
        { heading: "IMPLICATION", body: "Un positionnement tendu amplifie les mouvements de contre-tendance." },
      ],
    },
  },
  geopolitics: {
    en: {
      title: "Geopolitical Risk",
      summary: "Cross-border risk events and safe-haven flows.",
      detail: [
        { heading: "CONTEXT", body: "Escalation headlines drive haven demand into USD, JPY and CHF; risk currencies underperform." },
        { heading: "IMPLICATION", body: "Geopolitical stress is risk-off; magnitude depends on persistence." },
      ],
    },
    fr: {
      title: "Risque géopolitique",
      summary: "Événements de risque transfrontaliers et flux vers les refuges.",
      detail: [
        { heading: "CONTEXTE", body: "Les titres d'escalade poussent la demande de refuge vers l'USD, le JPY et le CHF ; les devises risquées sous-performent." },
        { heading: "IMPLICATION", body: "Un stress géopolitique est risk-off ; l'ampleur dépend de sa persistance." },
      ],
    },
  },
  earnings: {
    en: {
      title: "Earnings Preview",
      summary: "Analyst expectations and historical beat rate.",
      detail: [
        { heading: "SETUP", body: "Consensus EPS is beatable given a strong historical beat rate, but the bar is high and priced-in." },
        { heading: "IMPLICATION", body: "A beat may still sell off if guidance disappoints — reaction is guidance-driven." },
      ],
    },
    fr: {
      title: "Avant-résultats",
      summary: "Attentes des analystes et historique de dépassement.",
      detail: [
        { heading: "SETUP", body: "Le consensus BPA est dépassable vu l'historique, mais la barre est haute et déjà intégrée dans les cours." },
        { heading: "IMPLICATION", body: "Un dépassement peut quand même être vendu si la guidance déçoit — la réaction se joue sur la guidance." },
      ],
    },
  },
  datacenter: {
    en: {
      title: "Segment Revenue",
      summary: "Key growth-driver segment trajectory.",
      detail: [
        { heading: "DRIVER", body: "The core segment compounds at an elevated rate and remains supply-constrained." },
        { heading: "IMPLICATION", body: "Structural demand supports the multiple as long as growth holds." },
      ],
    },
    fr: {
      title: "Revenus par segment",
      summary: "Trajectoire du segment moteur de la croissance.",
      detail: [
        { heading: "MOTEUR", body: "Le segment cœur compose à un rythme élevé et reste contraint par l'offre." },
        { heading: "IMPLICATION", body: "Une demande structurelle soutient le multiple tant que la croissance tient." },
      ],
    },
  },
  supplychain: {
    en: {
      title: "Supply Chain Partner",
      summary: "Partner / supplier health and read-through risk.",
      detail: [
        { heading: "DOWNGRADE", body: "A key partner was downgraded on accounting concerns. Read-through risk is often isolated, not systemic." },
        { heading: "IMPLICATION", body: "Verify whether the issue is partner-specific before extrapolating to the whole chain." },
      ],
    },
    fr: {
      title: "Partenaire chaîne d'appro.",
      summary: "Santé d'un partenaire/fournisseur et risque de contagion de lecture.",
      detail: [
        { heading: "DÉGRADATION", body: "Un partenaire clé a été dégradé sur des soupçons comptables. Le risque de lecture croisée est souvent isolé, pas systémique." },
        { heading: "IMPLICATION", body: "Vérifier si le problème est propre au partenaire avant de l'extrapoler à toute la chaîne." },
      ],
    },
  },
  competition: {
    en: {
      title: "Competitive Landscape",
      summary: "Peer momentum and market-share dynamics.",
      detail: [
        { heading: "READING", body: "A peer trades soft, but share gains for the leader keep the relative story intact." },
        { heading: "IMPLICATION", body: "Weak peers can be a distraction when the leader's moat is widening." },
      ],
    },
    fr: {
      title: "Paysage concurrentiel",
      summary: "Momentum des pairs et dynamique de parts de marché.",
      detail: [
        { heading: "LECTURE", body: "Un pair est mal orienté, mais les gains de parts du leader préservent l'histoire relative." },
        { heading: "IMPLICATION", body: "Des pairs faibles peuvent être un leurre quand l'avantage concurrentiel du leader s'élargit." },
      ],
    },
  },
  "technial-structure": {
    en: {
      title: "Chart Structure",
      summary: "Key support / resistance and trend structure.",
      detail: [
        { heading: "LEVELS", body: "Price tests a well-defined support with higher-timeframe trend intact." },
        { heading: "IMPLICATION", body: "Support holding favours continuation; a clean break flips the structure." },
      ],
    },
    fr: {
      title: "Structure graphique",
      summary: "Supports / résistances clés et structure de tendance.",
      detail: [
        { heading: "NIVEAUX", body: "Le prix teste un support bien défini, avec une tendance intacte sur les unités de temps supérieures." },
        { heading: "IMPLICATION", body: "Un support qui tient favorise la continuation ; une cassure nette inverse la structure." },
      ],
    },
  },
  bund10y: {
    en: {
      title: "Bund 10Y",
      summary: "German sovereign yield — anchor of euro-area long rates.",
      detail: [
        { heading: "MOVE", body: "The Bund cheapens in sympathy with gilts and Treasuries during a global rates stress." },
        { heading: "IMPLICATION", body: "A sold-off Bund in a crisis regime accompanies a weaker EUR against the haven dollar." },
      ],
    },
    fr: {
      title: "Bund 10 ans",
      summary: "Rendement souverain allemand — ancre des taux longs zone euro.",
      detail: [
        { heading: "MOUVEMENT", body: "Le Bund se tend par sympathie avec les gilts et les Treasuries lors d'un stress de taux mondial." },
        { heading: "IMPLICATION", body: "Un Bund vendu en régime de crise accompagne un EUR fragilisé face au dollar refuge." },
      ],
    },
  },
  bcerate: {
    en: {
      title: "ECB Policy Rate",
      summary: "Deposit rate and path relative to the Fed.",
      detail: [
        { heading: "GUIDANCE", body: "The ECB holds a high deposit rate after a +450bps hiking cycle." },
        { heading: "IMPLICATION", body: "The policy gap with the Fed drives the underlying direction of EUR/USD." },
      ],
    },
    fr: {
      title: "Taux BCE",
      summary: "Taux de dépôt et trajectoire relative à la Fed.",
      detail: [
        { heading: "GUIDANCE", body: "La BCE maintient un taux de dépôt élevé après un cycle de +450 bps." },
        { heading: "IMPLICATION", body: "L'écart de politique avec la Fed pilote la direction de fond d'EUR/USD." },
      ],
    },
  },
  spreads: {
    en: {
      title: "Sovereign Spreads",
      summary: "BTP-Bund, OAT-Bund, Bono-Bund — fragmentation thermometer.",
      detail: [
        { heading: "READING", body: "Widening peripheral spreads flag systemic stress inside the euro area." },
        { heading: "IMPLICATION", body: "Fragmentation means a EUR risk premium; contagion can come from an external shock." },
      ],
    },
    fr: {
      title: "Spreads souverains",
      summary: "BTP-Bund, OAT-Bund, Bono-Bund — thermomètre de fragmentation.",
      detail: [
        { heading: "LECTURE", body: "L'élargissement des spreads périphériques signale un stress systémique en zone euro." },
        { heading: "IMPLICATION", body: "Fragmentation = prime de risque EUR ; contagion possible depuis un choc externe." },
      ],
    },
  },
  gdp: {
    en: {
      title: "GDP",
      summary: "Annualised quarterly growth vs consensus.",
      detail: [
        { heading: "DATA", body: "A growth surprise lifts rate expectations and the associated currency." },
        { heading: "IMPLICATION", body: "GDP above consensus supports the currency through the rates channel, absent a central-bank shift." },
      ],
    },
    fr: {
      title: "PIB",
      summary: "Croissance trimestrielle annualisée vs consensus.",
      detail: [
        { heading: "DONNÉE", body: "Une surprise de croissance renforce les anticipations de taux et la devise associée." },
        { heading: "IMPLICATION", body: "PIB > consensus = soutien devise via le canal des taux, sauf inflexion de la banque centrale." },
      ],
    },
  },
  yieldcurve: {
    en: {
      title: "Yield Curve",
      summary: "2s10s / 3m10y slopes — cyclical regime.",
      detail: [
        { heading: "READING", body: "An inverted curve reflects advanced tightening and slowdown risk." },
        { heading: "IMPLICATION", body: "Re-steepening (bull steepening) often accompanies the central-bank pivot." },
      ],
    },
    fr: {
      title: "Courbe des taux",
      summary: "Pentes 2s10s / 3m10y — régime cyclique.",
      detail: [
        { heading: "LECTURE", body: "Une courbe inversée reflète un resserrement avancé et un risque de ralentissement." },
        { heading: "IMPLICATION", body: "La désinversion (bull steepening) accompagne souvent le pivot des banques centrales." },
      ],
    },
  },
};
