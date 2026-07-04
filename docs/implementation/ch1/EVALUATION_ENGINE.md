# EVALUATION_ENGINE

Certification finale TradForge — moteur d'évaluation (mock frontend).

## Périmètre
Uniquement la **certification finale** du chapitre. Les évaluations de leçon sont hors scope.

## 3 niveaux = 3 mécaniques
| Niveau | Étoiles | Mécanique | Fichier |
|---|---|---|---|
| Standard | 2★ | MCQ replay scénarisé | `StandardRun.tsx` |
| High | 4★ | Macro Decision Workspace | `WorkspaceRun.tsx` |
| Premium | 5★ | Reasoning + Cohérence | `WorkspaceRun.tsx` (premium) |

Chaque niveau : 10 scénarios (`src/lib/certification/scenarios.ts`).

## Scoring
- `scoreDirection(chosen, correct)` : 100 (exact), 35 (neutre partiel), 0 (opposé).
- Seuil de réussite : `PASS_THRESHOLD = 70` (`isPass`).
- Score agrégé par niveau : moyenne des meilleurs scores par scénario (`levelSummary`).

## Déterminisme
Bougies générées par PRNG `mulberry32` seedé (`market-data.ts`) → scénarios stables et rejouables.

## Persistance
`localStorage` isolé derrière `storage.ts` (remplaçable par Lovable Cloud sans toucher l'UI).
