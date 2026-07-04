# MODULE SPECS — Interfaces techniques

Contrats inputs/outputs de chaque module. Source de vérité des types :
`src/lib/certification/types.ts`.

## Domain
- `ScenarioSpec` — voir `SCENARIO_TEMPLATE.md`.
- `ContextCardTemplate` — carte catalogue réutilisable (`cards.ts`).
- `ContextCardDataset` — payload data-viz d'une card (séries, niveaux, tableaux,
  calendriers, annotations) pour l'affichage **analyste** Premium.
- `ScenarioCardRef { cardId, relevance }` — liaison scénario→card (relevance invisible).

## Engines (`engine.ts`)
- `scoreDirection(chosen, correct): number`
- `essentialCardIds(scenario): string[]`
- `researchEfficiency(scenario, opened): number`
- `coherenceIndex(opened, declared): number`
- `coherenceFeedback(index, declaredButNotOpened): string`

## Persistance (`cloud.functions.ts`, RLS)
- `submitAttempt({ ...attempt }) → { attemptId, aggregate, completed, passed }`
- `recordCardInteractions({ items }) → { ok }`
- `saveJournalEntry({ ...entry }) → { id }`
- `getCertificationState() → { attempts, journal, progress, certificate }`
- `issueCertificate({ candidateName, aggregateScore, levels }) → certificate`
- `resetCertification() → { ok }`
- `session.ts::ensureSession() → userId | null` (anonyme auto)
- `storage.ts` : cache synchrone localStorage + write-through + `hydrateFromCloud()`

## Contrats d'événements UI
- `onPauseReached` : une fois, quand `visible >= shockAt`.
- `onComplete(attempt)` : une fois par scénario.
- `onNext()` : scénario suivant / fin de niveau.

## Composants data-viz réutilisables (`components/certification/cards/`)
- `LineSeriesChart` `{ points, levels?, annotations? }`
- `YieldCurveChart` `{ points }`
- `RatesLadder` `{ steps }`
- `StatsTable` `{ rows, compact? }`
- `CalendarStrip` `{ entries }`
- `GaugeMetric` `{ value, min, max, zones? }`
- `MultiTimeframe` `{ frames }` (3M / 1M / Daily / zoom)
