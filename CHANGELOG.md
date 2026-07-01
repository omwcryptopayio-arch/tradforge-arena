# CHANGELOG

Format daté, additif. Ne jamais réécrire une entrée passée.

## 2024 — Sprint 1-3 · Certification finale (3 niveaux, 3 mécaniques)

### Ajouté
- **Visual DNA "Institutional Desk"** (`src/styles.css`) : tokens oklch dark-first,
  gold/amber, bull/bear, Space Grotesk + DM Sans + JetBrains Mono, `tf-grid-bg`.
- **Domaine** : `types.ts`, `market-data.ts` (PRNG déterministe), `cards.ts`
  (catalogue de Context Cards), `scenarios.ts` (30 scénarios : 10/niveau),
  `engine.ts` (scoring, efficiency, cohérence), `storage.ts` (persistance localStorage).
- **Composants** : `CandleChart` (replay SVG + supports/résistances + ligne de décision),
  `ContextCard` (+ modal), `DecisionPanel` (double-clic), `Stepper`, `Stars`,
  `AnimatedNumber`, `StandardRun`, `WorkspaceRun`, `ResultsView`.
- **Routes** : `/` (landing), `/certification` (hub 3 niveaux),
  `/certification/$level/$n` (runner), `/journal` (Decision Journal).
- **Docs** : `docs/ch1/*.md`, `SENTINEL.md`, ce `CHANGELOG.md`.

### Sprint 1 — Standard (MCQ)
Coquille commune, tokens, replay complet, question 4 choix, feedback + débrief.

### Sprint 2 — High (Workspace)
Rail de Context Cards, indice de pertinence invisible, décision directionnelle,
Research Efficiency, compteur essentiels.

### Sprint 3 — Premium (Reasoning + Cohérence)
Tracking silencieux, capture du raisonnement (rôle/why/changed view),
Indice de Cohérence (non pénalisant), Decision Journal + détection de biais.

### Notes
- Frontend mock (aucun backend ce cycle). Persistance remplaçable par Lovable Cloud.
- Visuels Bolt utilisés comme référence de structure uniquement ; Visual DNA du projet conservée.
