# TradForge — Index de la documentation

La documentation est rangée en **deux familles** :

## `docs/implementation/` — Implémentation & protocoles agents
Source de vérité de ce qui est construit et des règles de conduite des agents.
- `PRD.md`, `TASKS.md`, `SPRINTS.md`, `IMPLEMENTATION_ROADMAP.md`
- `ARCHITECTURE.md`, `TEST_PLAN.md`, `DECISION_LOG.md`
- `BACKEND.md`, `DATABASE.md`
- `ch1/` — specs moteurs du Chapitre 1 (Evaluation, Reasoning, Coherence, Journal, Workspace, Context Cards)

Points d'entrée agents à la racine du repo : `AGENTS.md`, `SENTINEL.md`, `CHANGELOG.md`.

## `docs/standards/` — Scaling, industrialisation & standardisation
Le socle réutilisable pour répliquer la certification sur les chapitres 2..N.
- `CERTIFICATION_ENGINE_ARCHITECTURE.md` — architecture générique du moteur
- `COMPONENT_REGISTRY.md` — inventaire des composants
- `MODULE_SPECS.md` — interfaces (inputs/outputs) de chaque module
- `CERTIFICATION_DESIGN_SYSTEM.md` — standards UI/UX certification
- `EVALUATION_ENGINE_STANDARDS.md` — règles communes d'évaluation
- `SCENARIO_TEMPLATE.md` — format unique de scénario
- `QUESTION_BANK_SPEC.md` — structure normalisée des banques de questions
- `SCORING_ENGINE_SPEC.md` — standard de calcul des scores + Coherence Index
- `PROGRESSION_ENGINE.md` — verrouillage & progression
- `DIFFICULTY_SPEC.md` — standard Standard / High / Premium
- `CERTIFICATION_BLUEPRINT.md` — guide « ajouter un chapitre »
- `AGENT_PLAYBOOK.md` — playbook pour agents IA
- `REPLICATION_CHECKLIST.md` — checklist de réplication
- `UI_GUIDELINES.md` — Visual DNA

> Règle : docs **additives et versionnées**. On met à jour les statuts et on ajoute
> des révisions datées — jamais de réécriture destructive.
