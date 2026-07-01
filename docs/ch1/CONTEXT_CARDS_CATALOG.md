# CONTEXT_CARDS_CATALOG

Source : `src/lib/certification/cards.ts` (`CONTEXT_CARDS`).

## Structure d'une carte
```ts
ContextCardTemplate {
  id, ticker, category, title, summary,
  metric?, metricTone?,          // valeur affichée + tonalité (bull/bear/neutral)
  detail: { heading, body }[]    // contenu du modal
}
```

## Catégories
`fundamentals · technicals · news · macro · intermarket · centralbank · geopolitics`

## Liaison scénario
Un scénario référence des cartes via `ScenarioCardRef { cardId, relevance }`.
La `relevance` (0-100) est **interne/invisible** et pilote :
- la détection d'essentiels (`relevance ≥ 72`),
- le Research Efficiency,
- le dosage signal/bruit par niveau (High = + distracteurs, Premium = aucune indication).

## Réutilisation
Une même carte sert plusieurs scénarios avec des `relevance` différentes → zéro duplication.
