# SENTINEL — Checklist anti-régression

À vérifier **avant et après** chaque run/sprint sur la certification.

## Visual DNA (à préserver)
- [ ] Fond near-black, accent gold/amber, bull vert / bear rouge.
- [ ] Display = Space Grotesk, body = DM Sans, micro-labels = JetBrains Mono (`label-mono`).
- [ ] Tokens oklch dans `src/styles.css` uniquement (pas de couleurs en dur ailleurs).

## Mécaniques (3 distinctes)
- [ ] Standard = MCQ replay (chart complet → question → feedback).
- [ ] High = Workspace + Context Cards + décision directionnelle.
- [ ] Premium = Workspace sans indication → décision → capture raisonnement → cohérence.
- [ ] **Aucun spoiler** : High/Premium révèlent l'outcome seulement après décision.

## Règles invariantes
- [ ] La cohérence NE pénalise PAS le score.
- [ ] Scénarios déterministes (même seed → mêmes bougies).
- [ ] Persistance isolée dans `storage.ts` (aucune dépendance UI directe à localStorage).

## Sanity build
- [ ] `npx tsgo --noEmit` sans erreur.
- [ ] Routes 200 : `/`, `/certification`, `/certification/{level}/{n}`, `/journal`.
- [ ] Pas d'error boundary au chargement.
