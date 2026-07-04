# REASONING_ENGINE

Niveau **Premium (5★)** — `WorkspaceRun.tsx` (branche premium).

## Pipeline
```
Research (toutes les cartes, AUCUNE indication de pertinence)
  → Decision
  → Capture Your Reasoning (par carte : influencé ? + rôle + pourquoi + a changé mon avis)
  → Results (Research Efficiency + Indice de Cohérence animés)
  → Entrée Decision Journal
```

## Tracking silencieux
Enregistré pendant la recherche (sans le montrer) :
- cartes ouvertes + **ordre** (`openOrder`),
- cartes ignorées (déduites du catalogue),
- carte active / nombre d'ouvertures.

## Capture du raisonnement
Rôles disponibles (`REASONING_ROLES`) :
`Confirmation · Invalidation · Contexte · Timing · Risque`.
L'utilisateur peut déclarer une carte **même non consultée** → permet la détection
de rationalisation.

## Sorties
- `researchEfficiency` (qualité de la recherche),
- `coherenceIndex` (voir `COHERENCE_INDEX.md`),
- une `JournalEntry` complète.
