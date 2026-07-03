# PRD — TradForge · Module Évaluation & Certification

> Product Requirements Document. Versionné, additif. Ne jamais réécrire une
> section passée — ajouter une révision datée en fin de document.

## 1. Vision produit

TradForge transforme l'apprentissage du trading macro en une expérience de
**poste de travail institutionnel**. L'utilisateur ne consomme pas un cours :
il *voit*, *manipule*, *décide*, puis *comprend*. La certification finale mesure
le **raisonnement**, pas la mémorisation.

Référence de qualité visée : desks de BlackRock / Bridgewater — densité maîtrisée,
lecture progressive, zéro bruit gratuit.

## 2. Périmètre de ce cycle

- Module Learning (leçons 1.2 → 1.5) : **inchangé** (hors périmètre).
- Module Évaluation : certification finale **3 niveaux** (Standard / High / Premium),
  10 scénarios chacun.
- Persistance : **frontend mock** (`localStorage`) isolée derrière `storage.ts`,
  remplaçable par Lovable Cloud sans changer l'UI.

## 3. Mécaniques (3 distinctes, non fusionnées)

| Niveau   | Étoiles | Mécanique | Mesure clé |
|----------|---------|-----------|------------|
| Standard | 2★ | MCQ sur replay scénarisé | Score directionnel |
| High     | 4★ | Macro Decision Workspace + Context Cards | Research Efficiency |
| Premium  | 5★ | Reasoning capturé + Indice de Cohérence | Cohérence (non pénalisante) |

## 4. Flux d'interaction (cible)

```
Idle (Charger le Replay)  → l'utilisateur charge volontairement le moteur
→ Replay (cadence continue) → Pause à la donnée décisionnelle
→ Décision (MCQ ou directionnelle)
→ Reprise automatique (même cadence) → dernière bougie → Outcome
→ Débrief hiérarchisé (Rapide / Complète)
```

Invariants :
- **Aucun spoiler** : l'outcome n'est révélé qu'après la décision.
- **Aucun saut / image figée** : le replay reprend, il ne « colle » pas l'image finale.
- **Layout stable** : le graphique ne se déplace jamais ; le débrief s'ouvre dessous.

## 5. Débrief (hiérarchie d'information)

Ordre de lecture progressive, densité cognitive réduite :
1. Verdict (Position correcte / divergente) + score + bascule Rapide/Complète
2. Réponse rapide (verdict institutionnel en une ligne)
3. Réponse complète (rationale)
4. Analyse des réponses (pourquoi chaque mauvaise réponse est fausse / la bonne est la meilleure)
5. Outcome réel de marché
6. Impact macro (optionnel)
7. Key Learning
8. Métriques workspace + message de cohérence (High/Premium)

## 6. Règles de gouvernance produit

- Progression : 20 % crédités par leçon **si évaluation ≥ 70 %**.
- Certification débloquée à 100 % (5 leçons validées).
- La cohérence **ne pénalise jamais** le score.
- Scénarios **déterministes** (seed → mêmes bougies).

## 7. Non-objectifs (ce cycle)

- Pas de backend live (documenté dans `BACKEND.md` / `DATABASE.md` pour V2).
- Pas de TradingView réel (SVG mock).
- Context Cards V2 graphiques : documentées, non implémentées (voir `TASKS.md`).

## 8. Critères d'acceptation globaux

- `tsgo --noEmit` vert, routes 200, aucune error boundary au chargement.
- SENTINEL passé avant/après chaque run.
- Visual DNA préservée (voir `UI_GUIDELINES.md`).

---

### Révisions
- **2024-Sprint 4-5** : ajout flux Idle→Replay, débrief Rapide/Complète,
  stabilité layout. Création du présent PRD.
