# BACKEND (plan V2 — non implémenté ce cycle)

Persistance actuelle : `storage.ts` (localStorage) — interface stable à conserver.

## Engines à porter serveur (Lovable Cloud / TanStack server functions)
Evaluation · Reasoning · Coherence Index · Decision Journal · Difficulty ·
Context Intelligence · Card Tracking · Replay Tracking/Analytics · Session ·
Learning/Progress Analytics · Unlock · Certification.

## Principes
- Server functions `*.functions.ts` (jamais sous `src/server/`).
- RLS par `auth.uid()` ; `GRANT` explicites (voir `DATABASE.md`).
- Scoring/cohérence recalculés côté serveur (source de vérité) ; le front n'affiche.
- Endpoints publics (webhooks/cron) sous `api/public/*` avec vérification signature.
