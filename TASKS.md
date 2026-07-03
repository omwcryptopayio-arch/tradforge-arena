# TASKS — TradForge · Registre des fonctionnalités

> Source de vérité de l'avancement. Statuts : ✅ faite · 🟡 partielle · ⬜ non faite ·
> ⏸ reportée · ❌ abandonnée. Additif : on met à jour le statut, on ne supprime pas.

## Légende colonnes
`Statut · Dépendances · Sprint cible · Fichiers concernés`

## A. Flux d'évaluation (UX)

| Fonction | Statut | Dépendances | Sprint | Fichiers |
|---|---|---|---|---|
| Idle screen « Charger le Replay » | ✅ | ChartSpec | 4 | `ReplayLoader.tsx`, `StandardRun.tsx`, `WorkspaceRun.tsx` |
| Play / Replay propre | ✅ | CandleChart | 4 | `CandleChart.tsx` |
| Replay continu (pas de saut/image figée) | ✅ | reveal state | 4 | `StandardRun.tsx`, `ResultsView.tsx`, `CandleChart.tsx` |
| Pause à la donnée décisionnelle | ✅ | shockAt | 4 | `CandleChart.tsx` |
| Reprise auto → dernière bougie → outcome | ✅ | reveal state | 4 | `StandardRun.tsx`, `ResultsView.tsx` |
| Layout stable (chart fixe, débrief dessous) | ✅ | — | 5 | `StandardRun.tsx`, `ResultsView.tsx` |
| Débrief Rapide / Complète | ✅ | scenario | 5 | `DebriefPanel.tsx` |
| Analyse par réponse (why wrong / why best) | ✅ | McqOption.explain | 5 | `DebriefPanel.tsx`, `types.ts` |
| Outcome réel + Key Learning + Impact macro | 🟡 | contenu scénarios | 5 | `DebriefPanel.tsx`, `scenarios.ts` |

## B. Mécaniques

| Fonction | Statut | Dépendances | Sprint | Fichiers |
|---|---|---|---|---|
| Standard MCQ | ✅ | — | 1 | `StandardRun.tsx` |
| High Workspace + Context Cards | ✅ | cards catalog | 2 | `WorkspaceRun.tsx`, `ContextCard.tsx` |
| Premium Reasoning capture | ✅ | REASONING_ROLES | 3 | `WorkspaceRun.tsx` |
| Indice de Cohérence (Jaccard) | ✅ | — | 3 | `engine.ts` |
| Research Efficiency | ✅ | relevance | 2 | `engine.ts` |
| Decision Journal + biais | ✅ | storage | 3 | `journal.tsx`, `storage.ts` |

## C. Contenu

| Fonction | Statut | Dépendances | Sprint | Fichiers |
|---|---|---|---|---|
| 30 scénarios (10/niveau) | ✅ | — | 1-3 | `scenarios.ts` |
| `quickTake` par scénario | 🟡 (fallback) | — | 6 | `scenarios.ts` |
| `keyLearning` par scénario | 🟡 (fallback) | — | 6 | `scenarios.ts` |
| `explain` par option MCQ | 🟡 (fallback) | — | 6 | `scenarios.ts` |
| `macroImpact` par scénario | ⬜ | — | 6 | `scenarios.ts` |

## D. Context Cards V2 (graphique)

| Fonction | Statut | Sprint | Notes |
|---|---|---|---|
| line charts / sparklines | ⏸ | V2 | Documenté (`docs/ch1/CONTEXT_CARDS_CATALOG.md`) |
| heatmaps / yield spreads | ⏸ | V2 | Documenté |
| mini dashboards / gauges macro | ⏸ | V2 | Documenté |
| calendar views / distributions | ⏸ | V2 | Documenté |

## E. Backend (V2 — voir BACKEND.md / DATABASE.md)

| Engine | Statut | Sprint | Notes |
|---|---|---|---|
| Evaluation Engine | 🟡 (front) | V2 | scoring local → serveur |
| Reasoning Engine | 🟡 (front) | V2 | capture locale |
| Coherence Index | ✅ (front) | V2 | à persister |
| Decision Journal | 🟡 (front) | V2 | localStorage → table |
| Difficulty Engine | ⬜ | V2 | distribution S/H/P |
| Context Intelligence / Card Tracking | 🟡 (front) | V2 | ordre + durée capturés partiellement |
| Replay Tracking / Analytics | ⬜ | V2 | — |
| Session / Learning / Progress Analytics | ⬜ | V2 | — |
| Unlock Engine / Certification Engine | 🟡 (front) | V2 | gates front only |
| Supabase schema / RLS / indexes / migrations | ⬜ | V2 | `DATABASE.md` |

## F. Documentation & gouvernance

| Doc | Statut | Sprint |
|---|---|---|
| PRD / TASKS / ARCHITECTURE / ROADMAP | ✅ | 0 |
| UI_GUIDELINES / COMPONENT_REGISTRY | ✅ | 0 |
| BACKEND / DATABASE / DECISION_LOG | ✅ | 0 |
| SPRINTS / TEST_PLAN / RELEASE_PLAN | ✅ | 0 |
| AGENTS.md (règles d'exécution) | ✅ | 1 |
| SENTINEL.md étendu | ✅ | 9 |
| Matrice audit V7→V9 | ✅ | 2 (`DECISION_LOG.md`) |
