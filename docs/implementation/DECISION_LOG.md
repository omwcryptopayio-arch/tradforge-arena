# DECISION LOG & Matrice d'audit (V7 → V9)

## Décisions clés
- Learning et Évaluation = moteurs séparés (V8) — **retenu**.
- 3 mécaniques distinctes, non fusionnées — **retenu**.
- Reasoning explicite puis implicite (V8.1) — **retenu**.
- Cohérence non pénalisante — **retenu**.
- Frontend mock d'abord, Cloud ensuite — **retenu**.
- Idle → Replay volontaire + débrief Rapide/Complète — **retenu (S4-5)**.

## Matrice Doc source → Statut
| Décision | Source | Statut |
|---|---|---|
| Séparation Learning/Éval | V8 | ✅ (front) |
| Workspace macro + Context Cards | V8 | ✅ |
| Reasoning 3 niveaux (why/rôle/changed) | V8.1 | ✅ |
| Génération paramétrique difficulté | V8/V9 | 🟡 (seed déterministe, pas de scaling) |
| Persistance `evaluation_attempts` | V7 | 🟡 (localStorage) |
| Gate 20 %/leçon, 100 % certif | V7 | 🟡 (front) |
| Alternative A/B/C moteur | V9 | ✅ (B/C = Workspace/Reasoning) |
| Context Cards graphiques | V8 | ⏸ V2 |
| Backend/RLS/analytics | V9 | ⬜ V2 |

## Matrice Sprint × Fonction (traçabilité)
| Sprint | Fonction | Statut | Backend | UI | Tests | Docs |
|---|---|---|---|---|---|---|
| S1 | Standard MCQ | ✅ | ⬜ | ✅ | 🟡 | ✅ |
| S2 | High Workspace | ✅ | ⬜ | ✅ | 🟡 | ✅ |
| S3 | Premium Reasoning/Cohérence | ✅ | ⬜ | ✅ | 🟡 | ✅ |
| S4 | Replay continu | ✅ | — | ✅ | ✅ | ✅ |
| S5 | Débrief premium | ✅ | — | ✅ | ✅ | ✅ |
| V2 | Backend/Analytics | ⬜ | ⬜ | — | ⬜ | ✅ |
