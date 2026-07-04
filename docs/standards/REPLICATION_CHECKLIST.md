# REPLICATION CHECKLIST

Checklist à passer pour tout nouveau chapitre / nouvelle mécanique.

## Généricité
- [ ] Aucun composant ne hardcode le titre/numéro de chapitre.
- [ ] La spécificité passe par `chapters/ch{N}/config.ts`.
- [ ] Aucune couleur codée en dur (`grep text-white|bg-black|#[0-9a-f]{3,6}`).

## Scénarios
- [ ] 10 × 3 scénarios conformes `SCENARIO_TEMPLATE.md`.
- [ ] Déterminisme vérifié (même seed → mêmes bougies).
- [ ] 2 délimiteurs verticaux (`shockAt`, `decisionWindowEnd`).
- [ ] HUD reveal : pips + direction finale.
- [ ] Banque de questions conforme `QUESTION_BANK_SPEC.md`.

## Backend
- [ ] Server functions acceptent `chapter_id`.
- [ ] Tables `certification_*` scopent `chapter_id` + `auth.uid()`.
- [ ] GRANT explicites pour toute nouvelle table `public.*`.
- [ ] Scoring/progress recalculés serveur.

## Persistance
- [ ] Rechargement (F5) préserve la progression (cloud + cache).

## Docs & QA
- [ ] `docs/chapters/ch{N}/PRD.md` créé.
- [ ] `CHANGELOG.md` daté, `TASKS.md`, `SENTINEL.md` étendus.
- [ ] Parcours S→H→P exécuté à la main.
- [ ] `tsgo --noEmit` vert, routes 200, aucune erreur console, aucune requête 4xx/5xx.
