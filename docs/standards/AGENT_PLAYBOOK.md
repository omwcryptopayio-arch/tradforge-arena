# AGENT PLAYBOOK — Reproduire l'architecture

Guide destiné à un futur agent IA (Lovable, Cursor, Claude Code…) pour étendre le
framework sans réinventer la roue.

## Prérequis de lecture (une fois, dans l'ordre)
1. `CHANGELOG.md` (racine)
2. `docs/implementation/PRD.md`
3. `docs/implementation/ch1/EVALUATION_ENGINE.md`
4. `docs/standards/CERTIFICATION_ENGINE_ARCHITECTURE.md`
5. `docs/standards/COMPONENT_REGISTRY.md`
6. `docs/standards/DIFFICULTY_SPEC.md`
7. `docs/standards/SCENARIO_TEMPLATE.md`
8. `SENTINEL.md`

## Décisions par défaut
- Ne créer aucun composant si un existant peut couvrir le besoin via prop.
- Ne dupliquer aucun engine — étendre par injection/config.
- Toute nouvelle donnée passe par un type dans `types.ts`.
- Toute couleur passe par un token OKLCH dans `src/styles.css`.
- Backend d'abord : brancher les server functions, ne pas laisser de mock.

## Recettes
- « Ajouter un chapitre » → `CERTIFICATION_BLUEPRINT.md`.
- « Ajouter une mécanique de niveau » → nouveau mode `Level`/`Difficulty` + composant dédié + `DIFFICULTY_SPEC.md` + tests SENTINEL.

## Interdits
- Supprimer un fichier de docs (additif uniquement).
- Supprimer une entrée passée du CHANGELOG.
- Introduire une couleur codée en dur.
- Créer une table `public.*` sans bloc `GRANT` + policy RLS.
- Appeler un server function protégé depuis un loader de route publique.
- Laisser une fonctionnalité en mock alors qu'un backend est disponible.
