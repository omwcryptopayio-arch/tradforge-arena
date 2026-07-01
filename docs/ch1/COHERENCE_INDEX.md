# COHERENCE_INDEX

Indice de Cohérence — Premium uniquement.

## Définition
Écart entre les cartes **réellement consultées** et les cartes **déclarées influentes**.
Implémentation : recouvrement de Jaccard (`coherenceIndex(opened, declared)` dans `engine.ts`).

```
cohérence = |opened ∩ declared| / |opened ∪ declared| × 100
```

## Règle d'or
**N'affecte JAMAIS le score de réussite.** C'est un retour qualitatif de métacognition.
Le score dépend uniquement de la direction (`scoreDirection`).

## Feedback qualitatif
`coherenceFeedback(index, declaredButNotOpened)` :
- ≥ 85 : excellente cohérence.
- 60-84 : bonne, quelques écarts.
- déclaré mais non consulté > 0 : **biais de rationalisation**.
- sinon : cohérence faible.

## Biais détectés (journal)
- **Rationalisation** : justification de cartes non consultées.
- **Sur-exploration** : efficacité < 50 (trop de bruit consulté).
