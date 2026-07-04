# MACRO_DECISION_WORKSPACE

Niveau **High (4★)** — `WorkspaceRun.tsx`.

## Pipeline
```
Brief → Research (chart ~60% + rail de Context Cards ~40%)
      → Make Decision (Bullish / Neutral / Bearish, double-clic de confirmation)
      → Results (verdict + Research Efficiency + essentiels trouvés)
      → Débrief (rationale + outcome + révélation complète du chart)
```

## Chart
`CandleChart.tsx` — SVG déterministe : bougies, supports/résistances ancrés
(`ChartSpec.support/resistance`), ligne de décision (`shockAt` + `eventLabel`),
scrubber de replay. **Pas de spoiler** : `maxReveal = shockAt` avant décision,
puis révélation complète dans les Results.

## Context Cards
Catalogue réutilisable (`cards.ts`). Chaque scénario lie des cartes via
`ScenarioCardRef { cardId, relevance }`. Indice de pertinence **invisible**.

## Indice de pertinence
- `ESSENTIAL_THRESHOLD = 72`. Une carte est essentielle si `relevance ≥ 72`.
- High = cartes principales + 2-3 distracteurs (relevance basse).
- Compteur visible : `cartes vues · essentiels trouvés / total`.

## Research Efficiency
`researchEfficiency(scenario, opened)` = couverture des essentiels − pénalité de bruit.
