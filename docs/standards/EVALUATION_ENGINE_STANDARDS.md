# EVALUATION ENGINE — Standards communs

## Périmètre
Uniquement la **certification finale** d'un chapitre. Les évaluations de leçon
(mode Learning) sont hors scope et n'utilisent pas ce moteur.

## Deux familles de scénarios
- **Learning (cours)** : cas historiques réels, dates/données réelles. Non concerné ici.
- **Evaluation** : bibliothèque dynamique, difficulté S/H/P, génération paramétrique,
  pause décisionnelle, variantes infinies. Teste le **raisonnement**, pas la mémorisation.

## Règles
- Seuil de réussite `PASS_THRESHOLD = 70`.
- 10 scénarios par niveau.
- Déterminisme par seed (mulberry32).
- Progression : 20 % crédités / leçon si évaluation ≥ 70 % ; certification à 100 %.
- Cohérence non pénalisante.
- Scoring/progress = **source de vérité serveur** (`submitAttempt`).

## Principe pédagogique central
Difficulté = plus de bruit + plus d'autonomie. On évalue **d'abord** le raisonnement
explicite (déclarations), **puis** progressivement l'implicite (parcours réel :
cards ouvertes, ordre, durée, réouvertures) — comparés via le Coherence Index.
