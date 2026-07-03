# ARCHITECTURE — TradForge Évaluation

## Stack
TanStack Start (routes fichiers) · React 19 · Tailwind v4 (tokens `src/styles.css`) ·
motion/react · shadcn · SVG mock charts. Aucun backend ce cycle.

## Couches
```
Routes (src/routes)            → orchestration & navigation
Components (src/components/certification) → UI + machines à états locales
Domain (src/lib/certification) → types, scenarios, engine, market-data
Persistence (storage.ts)       → localStorage isolé (swap Cloud plus tard)
```

## Flux de données
`scenarios.ts` (spec) → `market-data.ts` (PRNG déterministe → géométrie) →
`CandleChart` (replay) ; décisions → `engine.ts` (scoring/efficiency/cohérence) →
`storage.ts` (attempts + journal).

## Machines à états
- **StandardRun** : `loading → replay → debrief` (reveal: `shockAt → candles`).
- **WorkspaceRun** : `research → decision → (reasoning) → results`, gate `chartLoaded`.

## Invariants techniques
- Déterminisme : `seed` → mêmes bougies.
- Aucune couleur en dur (tokens oklch only).
- Persistance jamais lue directement en UI (toujours via `storage.ts`).
- Débrief additif (n'unmounte pas le chart).
