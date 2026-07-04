# CERTIFICATION ENGINE — Architecture générique

> Objectif : un **framework de certification universel** où chaque chapitre (1..N)
> est produit à partir d'un socle commun, sans redéveloppement au cas par cas.

## Règle d'or
**Aucun composant ne connaît le Chapitre 1.** Toute la spécificité passe par des
props/config alimentées par la configuration du chapitre
(`src/lib/chapters/ch{N}/config.ts`).

## Couches
```
Config chapitre (src/lib/chapters/chN/config.ts)
      │  scénarios · cards · métadonnées niveaux · seeds
      ▼
Engines (code pur · sans état UI)
  ScenarioEngine · ScoringEngine · DifficultyEngine
  CoherenceEngine · ProgressionEngine · StorageEngine
      ▼
Persistance (Lovable Cloud, RLS auth.uid())
  server functions *.functions.ts  ← source de vérité
  localStorage (cache synchrone / offline)
      ▼
UI générique (src/components/certification/*)
  ScenarioPlayer · CandleChart · ContextCard · ReasoningPanel
  DebriefPanel · ResultsView · Certificate
```

## Engines (contrats)
| Engine | Rôle | Entrées → Sorties |
|---|---|---|
| ScenarioEngine | fournit/génère les scénarios | (chapter, level, seed) → `ScenarioSpec` |
| DifficultyEngine | dose signal/bruit par niveau | (scenario, level) → cards visibles |
| ScoringEngine | score directionnel + agrégat | (chosen, correct) → 0..100 ; best-per-scenario |
| CoherenceEngine | Indice de Cohérence (Premium) | (opened, declared, cards) → 0..100 (non pénalisant) |
| ProgressionEngine | verrouillage & pass | (state) → unlocked/passed par niveau |
| StorageEngine | persistance | write-through cloud + cache local |

## Persistance (branchée)
- Server functions : `submitAttempt`, `saveJournalEntry`, `recordCardInteractions`,
  `getCertificationState`, `issueCertificate`, `resetCertification`.
- RLS : chaque table scope `user_id = auth.uid()` ; sessions **anonymes** auto.
- Scoring/progress **recalculés serveur** dans `submitAttempt` (source de vérité) ;
  le front affiche.

## Extensibilité
- Nouveau chapitre → nouvelle config + scénarios, **zéro** modification d'engine/UI.
- Nouvelle mécanique de niveau → nouveau composant sous `certification/<mecanique>/`
  + extension du type `Level`/`Difficulty`, jamais de suppression.
