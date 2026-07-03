# DATABASE (schéma cible V2 — non implémenté)

Tables prévues (schéma `public`, RLS + GRANTs obligatoires) :
- `evaluation_attempts` (existante à étendre) : score, direction, correct, efficiency,
  coherence, opened_card_ids, duration_ms, level, scenario_id, user_id.
- `decision_journal` : reasoning[], bias, coherence, efficiency, correct.
- `card_events` : card_id, opened_at, duration_ms (Card Tracking).
- `replay_events` : play/pause/seek (Replay Analytics).
- `progress` : leçon %, unlocks, certification state.

Chaque `CREATE TABLE public.*` → `GRANT` (authenticated + service_role) → `ENABLE RLS`
→ `CREATE POLICY` (`auth.uid()`). Indexes sur `user_id`, `scenario_id`, `at`.
Rôles utilisateur : table `user_roles` séparée + `has_role()` security definer.
