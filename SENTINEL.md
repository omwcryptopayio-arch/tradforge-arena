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

## Flux replay (Sprint 4-5)
- [ ] Écran idle « Charger le Replay » : moteur monté seulement après clic.
- [ ] Replay → pause à la donnée → réponse → reprise auto → dernière bougie → outcome.
- [ ] Aucun saut ni image figée ; même cadence à la reprise.
- [ ] Layout stable : le graphique ne se déplace jamais après une réponse.

## Débrief (Sprint 5)
- [ ] Bascule Rapide / Complète fonctionnelle.
- [ ] Hiérarchie : rapide → complète → analyse réponses → outcome → key learning.
- [ ] Analyse par réponse (pourquoi faux / pourquoi meilleure) affichée.

## Checklists étendues (Sprint 9)
- [ ] UI : tokens oklch, aucune couleur en dur.
- [ ] Backend (V2) : scoring/cohérence recalculés serveur.
- [ ] DB (V2) : RLS + GRANTs sur chaque table.
- [ ] Mobile / Responsive : chart + débrief lisibles < 640px.
- [ ] Performance / Lighthouse : pas de régression LCP.
- [ ] Accessibilité : boutons `aria-label`, contraste suffisant.
- [ ] Évaluation / Analytics / Progression / Certification : gates cohérents.

