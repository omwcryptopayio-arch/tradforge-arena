# TEST PLAN

## Manuel (Playwright / preview)
- Standard : idle → « Charger le Replay » → replay 60/60 → réponse → débrief.
- Bascule Rapide/Complète ; analyse par réponse visible.
- Chart non déplacé après réponse (layout stable).
- High/Premium : gate loader → recherche → décision → (reasoning) → results.

## Automatisé (cible V2)
- Unit : `engine.ts` (scoreDirection, researchEfficiency, coherenceIndex).
- Intégration : machines à états `StandardRun`/`WorkspaceRun`.
- E2E : parcours 3 niveaux + journal.

## Sanity build
`npx tsgo --noEmit` vert ; routes 200 ; aucune error boundary.
