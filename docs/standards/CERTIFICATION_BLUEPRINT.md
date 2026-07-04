# CERTIFICATION BLUEPRINT — Ajouter un chapitre (2..N)

Guide pour créer un nouveau chapitre **sans repartir de zéro**.

## Recette
1. Lire `CERTIFICATION_ENGINE_ARCHITECTURE.md` + `SCENARIO_TEMPLATE.md`.
2. Créer `src/lib/chapters/ch{N}/config.ts` (métadonnées niveaux, seeds, catalogue cards spécifiques).
3. Rédiger 30 scénarios (10 × 3) via `SCENARIO_TEMPLATE.md` — ou paramétrer le `scenario-engine`.
4. Enrichir `cards.ts` si de nouvelles Context Cards apparaissent (catalogue global réutilisable).
5. Étendre le route param `$chapter` (ou dupliquer la route et adapter).
6. Mettre à jour le hub `/certification`.
7. Clé de progression distincte + `chapter_id` dans toutes les server functions/RLS.
8. Certificat : préfixe hash `TF-CH{N}-`.
9. Docs : `docs/chapters/ch{N}/PRD.md` + entrée `CHANGELOG.md` + case `TASKS.md`.
10. Passer `REPLICATION_CHECKLIST.md` + dérouler `SENTINEL.md`.

## Contraintes
- Ne pas modifier `types.ts` de façon destructive — étendre uniquement.
- Ne pas modifier les composants génériques pour un chapitre — passer par props/config.
- Toute nouvelle card réutilisable → catalogue global.
- Toute nouvelle mécanique → nouveau composant `certification/<mecanique>/`.
