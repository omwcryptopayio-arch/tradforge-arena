# SCENARIO TEMPLATE — Format unique

Format de création d'un scénario, quel que soit le niveau. Aligné sur `types.ts`.

```ts
const example: ScenarioSpec = {
  id: "ch1-standard-01",
  level: "standard",            // "standard" | "high" | "premium"
  index: 1,                     // 1..10 dans le niveau
  title: "NFP surprise haussière",
  symbol: "EUR/USD",
  brief: "Contexte lisible en 1-2 phrases.",

  chart: {
    symbol: "EUR/USD",
    period: "Jan 2024 · H4",
    seed: 101,                  // reproductibilité (mulberry32)
    candles: 120,              // Standard 60-90 · High 90-120 · Premium 120-160
    basePrice: 1.0876,
    volatility: 0.4,            // 0..1
    drift: 0.1,                 // avant l'événement
    shockAt: 60,                // 1er délimiteur : publication macro (pauseAt)
    decisionWindowEnd: 90,      // 2e délimiteur : fin de fenêtre d'analyse (post = contexte)
    shockMagnitude: -0.6,       // mouvement post-événement (signé)
    precision: 4,               // fx=4, jpy=3, indices=2
    support: 1.0820,
    resistance: 1.0950,
    eventLabel: "NFP +263K",
    techAnnotations: [          // (Premium/High) rendus sur le chart et cards TECH
      { kind: "break",  atIndex: 62, label: "Break support", tone: "danger" },
      { kind: "retest", atIndex: 78, label: "Retest",        tone: "muted" },
      { kind: "zone",   fromIndex: 55, toIndex: 60, label: "Zone décision", tone: "primary" },
    ],
  },

  correctDirection: "bear",
  // Standard (MCQ) :
  question: "Une seule question directe.",
  options: [
    { label: "…", direction: "bear", explain: "Pourquoi c'est la meilleure." },
    { label: "…", direction: "bull", explain: "Piège d'inversion causale." },
    { label: "…", direction: "neutral", explain: "Neutre facile alors que le signal est clair." },
  ],
  correctIndex: 0,

  // High / Premium (workspace) :
  cards: [
    { cardId: "nfp", relevance: 100 },
    { cardId: "fed", relevance: 90 },
    { cardId: "gold", relevance: 20 },   // distracteur (High/Premium)
  ],

  rationale: "Le raisonnement institutionnel derrière la bonne réponse.",
  outcome: "Ce qui s'est réellement passé sur le marché.",
  quickTake: "Verdict institutionnel en une ligne.",
  keyLearning: "Le takeaway transférable.",
  macroImpact: ["Différentiel de taux ↑", "USD ↑", "EUR/USD ↓"],
};
```

## Dosage des cards par niveau
- **Standard** : `cards: []` (MCQ pur, guidé).
- **High** : 4-6 cards, mix pertinent + 2-3 distracteurs (relevance basse). Affichage **guidé** (résumés texte).
- **Premium** : 6-9 cards, **aucune** indication de relevance. Affichage **analyste** (dashboards/charts/tableaux/séries).

## Invariants
- Déterminisme : `seed` → mêmes bougies + mêmes choix.
- 2 délimiteurs verticaux obligatoires (`shockAt`, `decisionWindowEnd`).
- Aucune donnée de card ne livre la conclusion : l'apprenant observe, compare, déduit.
