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

## 2024 — Sprint 4-5 · Refonte flux d'interaction + débrief premium

### Ajouté
- **`ReplayLoader`** : écran d'attente premium « Charger le Replay » ; le moteur
  n'est monté qu'après action volontaire de l'utilisateur (Standard + Workspace).
- **`DebriefPanel`** : panneau de débriefing restructuré, bascule **Rapide / Complète**,
  hiérarchie progressive (réponse rapide → complète → analyse par réponse → outcome →
  impact macro → key learning → métriques/cohérence).
- **Types** : `McqOption.explain`, `ScenarioSpec.quickTake / keyLearning / macroImpact`
  (optionnels, avec fallbacks).

### Corrigé (UX)
- **Replay continu** : `Replay → Pause → Réponse → reprise auto → dernière bougie →
  outcome → débrief`. Plus d'image figée, plus de saut ; même cadence.
- **Stabilité du layout** : le graphique reste ancré ; le débrief s'ouvre dessous
  (fin du déplacement brutal du graphique après réponse).

### Docs (Sprint 0-2, 9-10)
- Création : `PRD.md`, `TASKS.md`, `ARCHITECTURE.md`, `IMPLEMENTATION_ROADMAP.md`,
  `UI_GUIDELINES.md`, `BACKEND.md`, `DATABASE.md`, `COMPONENT_REGISTRY.md`,
  `DECISION_LOG.md`, `SPRINTS.md`, `TEST_PLAN.md`, `RELEASE_PLAN.md`.
- Mise à jour : `AGENTS.md` (règles d'exécution/planification/anti-régression),
  `SENTINEL.md` (checklists étendues).

### Reporté (documenté, non implémenté)
- Context Cards V2 graphiques (charts/heatmaps/gauges) → V2.
- Backend complet (schémas, RLS, migrations, analytics) → V2 (`BACKEND.md` / `DATABASE.md`).
- Contenu enrichi `quickTake / keyLearning / explain / macroImpact` sur les 30 scénarios
  (fallbacks actifs) → Sprint 6.
