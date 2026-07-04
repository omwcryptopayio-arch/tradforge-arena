# QUESTION BANK — Spécification

Norme d'écriture des `options` (choices) d'un scénario.

## Contraintes
- **Exactement 1 réponse correcte** (`correctIndex`).
- **3 choix minimum, 4 maximum** (jamais 2 : reste discriminant).
- `explain` obligatoire par option, **≥ 40 caractères**, leçon transférable.

## Pièges pédagogiques à intégrer
- **Inversion causale** : « X monte donc Y monte » alors que Y est la cause.
- **Neutre facile** : l'option « aucun signal » quand l'énoncé est clair.
- **Overfitting** : s'appuyer sur une card peu pertinente.
- **Timing miss** : bonne direction, mauvais horizon.

## Génération paramétrique (banque infinie)
`scenario-engine.ts` génère des variantes seedées :
- asset, timeframe, volatilité, `drift`/`shockMagnitude`, `eventLabel`
- niveau (S/H/P) → dosage cards + bruit
- question + options dérivées du signe de `shockMagnitude` et des pièges ci-dessus

Chaque variante reste **déterministe** (seed) et rejouable.

## Interdits
- Deux réponses correctes.
- `explain` générique (< 40 car.).
- Choix qui répète l'énoncé sans plus-value.
