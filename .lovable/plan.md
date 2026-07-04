# TradForge — Refonte majeure V4.5 (Backend + Premium Desk + Industrialisation)

Objectif : passer du prototype mock au **framework de certification industrialisé**, branché sur un vrai backend, avec un desk macro Premium de classe mondiale (BlackRock/Bridgewater). Rendu premium non négociable. Docs **additifs et versionnés** (jamais de suppression).

## Décisions validées
- **Backend** : Lovable Cloud + **sessions anonymes automatiques** (`auth.signInAnonymously`), aucun écran de login. RLS `user_id = auth.uid()`. localStorage devient fallback/cache. Migration comptes nommés plus tard.
- **Certificat** : émetteur **« TradForge Institut »**, PDF téléchargeable, standards internationaux.
- **Timer Premium** : par scénario, base **2:30**, dégressif **−7 s par scénario** (S1 2:30 → S10 1:27). Non bloquant, continue en négatif (pression). Alimente cohérence/raisonnement.
- **Ordre d'exécution** : ① Backend → ② Context Cards Premium graphiques → ③ Banque scénarios paramétrique → ④ Industrialisation/docs → ⑤ Chart 2 délimiteurs → ⑥ Certificat PDF → ⑦ reste (timer intégré au fil, High/Premium distinction).

---

## SPRINT 0 — Réorganisation documentaire (2 dossiers, non destructif)
Déplacement (git mv) des docs existantes, **contenu conservé**, entrées de version ajoutées.

```text
docs/implementation/   (implémentation + protocoles agents)
  PRD.md TASKS.md ARCHITECTURE.md SPRINTS.md IMPLEMENTATION_ROADMAP.md
  TEST_PLAN.md DECISION_LOG.md BACKEND.md DATABASE.md
  ch1/*  (COHERENCE_INDEX, EVALUATION_ENGINE, REASONING_ENGINE, ...)
docs/standards/        (scaling / industrialisation / standardisation)
  CERTIFICATION_ENGINE_ARCHITECTURE.md  COMPONENT_REGISTRY.md
  MODULE_SPECS.md  CERTIFICATION_DESIGN_SYSTEM.md
  EVALUATION_ENGINE_STANDARDS.md  SCENARIO_TEMPLATE.md
  QUESTION_BANK_SPEC.md  SCORING_ENGINE_SPEC.md  PROGRESSION_ENGINE.md
  DIFFICULTY_SPEC.md  CERTIFICATION_BLUEPRINT.md
  AGENT_PLAYBOOK.md  REPLICATION_CHECKLIST.md  UI_GUIDELINES.md
```
- Racine : `AGENTS.md`, `SENTINEL.md`, `CHANGELOG.md` restent (points d'entrée agents) + stub pointeur vers `docs/implementation/`.
- MAJ additive : `CHANGELOG.md`, `PRD.md` (révision datée), `TASKS.md`, `SPRINTS.md`.

## SPRINT 1 — Backend Lovable Cloud (PRIORITÉ #1)
Activer Cloud, migrations conformes aux PDF (GRANT → RLS → policies).
- **Tables** : `user_roles` (+ `app_role`, `has_role()`), `certification_attempts`, `certification_card_interactions`, `certification_reasoning`, `certification_progress`, `decision_journal_entries`, `certificates_issued`. Toutes scopées `chapter_id` + `auth.uid()`.
- **Session anonyme** : hook `useAnonSession` dans `__root.tsx` (`signInAnonymously` si pas de session).
- **Server functions** (`src/lib/certification/*.functions.ts`, `requireSupabaseAuth`) : `submitAttempt`, `saveReasoning`, `recordCardInteraction`, `getProgress`, `getJournal`, `issueCertificate`. Scoring/cohérence **recalculés serveur** (source de vérité).
- **Bearer** : append `attachSupabaseAuth` dans `src/start.ts` (`functionMiddleware`).
- **storage.ts** : refactor en couche adaptateur → appelle server functions, garde localStorage en cache offline (interface UI inchangée). Migration one-shot des données locales existantes.

## SPRINT 2 — Context Cards Premium graphiques (desk institutionnel)
Refonte affichage (logique conservée). **Moins de texte, plus de data-viz** via `recharts` (déjà installé).
- Nouveau modèle `ContextCardDataset` dans `types.ts` : séries temporelles, niveaux clés, seuils, annotations, tableaux, calendriers — **jamais la conclusion** (l'apprenant déduit).
- Composants réutilisables `src/components/certification/cards/` : `LineSeriesChart`, `YieldCurveChart`, `RatesLadder`, `StatsTable`, `CalendarStrip`, `GaugeMetric`, `MultiTimeframe` (3M / 1M / Daily / zoom cassure), `TechAnnotationsLayer` (supports/résistances/canaux/figures/ruptures).
- **Analyse technique** (cards TECH) : multi-timeframe + zooms successifs + structure de marché ; le TradingView scénarisé = uniquement la zone de décision zoomée.
- **Confluence** : cards macro (taux, spreads, courbe, DXY, CPI, NFP, PIB, VIX, Gold, Oil, calendrier) présentées comme **outils d'analyse** interactifs annotés → apprend « cassure technique sans validation macro = sans valeur ».
- **High vs Premium** : High = résumé texte guidé ; Premium = dashboards/charts/stats/calendriers, aucun indice de pertinence. Prop `renderMode: 'guided' | 'analyst'` sur `ContextCard`.

## SPRINT 3 — Banque de scénarios paramétrique (variantes infinies)
Moteur de génération conforme `SCENARIO_TEMPLATE.md` / V8.1.
- `src/lib/certification/scenario-engine.ts` : génération paramétrique seedée (asset, timeframe, volatilité, trendPre/Post, event, difficulté S/H/P, distribution de bruit des cards). Déterministe (seed → mêmes bougies + mêmes choix).
- Banque de questions normalisée (`QUESTION_BANK_SPEC`) : 1 correcte, 3-4 choix, pièges (inversion causale, neutre facile, overfitting, timing miss), `explanation` ≥ 40 car.
- Sélection de cards par niveau via `relevance` (seuils Standard/High/Premium).

## SPRINT 4 — Industrialisation / standardisation (framework réplicable)
- Généricité totale : **aucun composant ne connaît le Chapitre 1** (specificité via props/config).
- `src/lib/chapters/ch1/config.ts` ; route param `$chapter` prête pour ch2..N.
- Engines purs isolés : `ScenarioEngine, ScoringEngine, DifficultyEngine, CoherenceEngine, ProgressionEngine, StorageEngine`.
- Livrables docs `docs/standards/` (voir Sprint 0) : architecture, registry, module specs, design system certif, blueprint « ajouter un chapitre », `AGENT_PLAYBOOK`, `REPLICATION_CHECKLIST`.

## SPRINT 5 — Chart : 2 délimiteurs verticaux + HUD (candles conservés)
`CandleChart.tsx` — richesse visuelle intacte.
- Délimiteur 1 (déjà là) : publication macro (`pauseAt`).
- **Délimiteur 2 (nouveau)** : fin de fenêtre d'analyse (`decisionWindowEnd`) ; au-delà = contexte marché hors évaluation (rendu atténué).
- **HUD reveal** : fenêtre du scénario, durée, nb bougies, **pips réalisés**, direction finale.
- `techAnnotations[]` (break/retest/zone) rendus sur le chart.

## SPRINT 6 — Certificat PDF « TradForge Institut »
- Server route `src/routes/api/certificate.$id.ts` (générée serveur) OU génération client `pdf-lib` (edge-safe) — bench inclus, défaut `pdf-lib` client pour éviter contraintes Worker.
- Design world-class : sceau/monogramme, nom candidat, chapitre, niveaux validés, score, date, **hash de vérification** (`certificates_issued.hash`), mention émetteur « TradForge Institut ». Bouton téléchargement dans le hub/journal une fois 100 % validé.

## SPRINT 7 — Timer Premium + finitions + anti-régression
- `useDecisionTimer` : base 2:30, `−7 s × (order-1)`, non bloquant, passage négatif visible (rouge + « dépassement »).
- Durée + dépassement persistés (`duration_ms`) → entrent dans feedback cohérence/raisonnement.
- SENTINEL déroulé avant/après ; MAJ `TASKS`, `CHANGELOG`, `DECISION_LOG`, `COMPONENT_REGISTRY`.

---

## Section technique
- **Stack** : TanStack Start, Cloud (Supabase), `requireSupabaseAuth`, `recharts`, `motion`, `pdf-lib`. Tokens OKLCH only (Visual DNA conservée).
- **Sécurité** : RLS `auth.uid()` partout, GRANT explicites, scoring serveur, `/api/public/*` réservé aux appels externes signés.
- **Déterminisme** : PRNG `mulberry32` seedé conservé (chart + génération).
- **Fichiers clés touchés** : `types.ts`, `engine.ts`→`scoring.ts`+`scenario-engine.ts`, `storage.ts`, `cards.ts`, `CandleChart.tsx`, `ContextCard.tsx`, `WorkspaceRun.tsx`, `StandardRun.tsx`, `ResultsView.tsx`, `DebriefPanel.tsx`, routes `certification.*`, `journal.tsx`, `__root.tsx`, `start.ts` + nouveaux `cards/*`, `*.functions.ts`, `chapters/ch1/config.ts`.

## Risques de régression
- Refacto `storage.ts` (le PDF impose interface stable → adaptateur, pas de réécriture UI).
- SSR/prerender : ne jamais appeler une server fn protégée depuis un loader public (Premium/journal en composant).
- `pdf-lib`/génération : rester edge-safe (pas de dépendance Node-only).
- Perf recharts sur cards multiples : lazy-render au clic (déjà le pattern d'ouverture).

## Critères d'acceptation
- `tsgo --noEmit` vert, routes 200, aucune error boundary.
- Tentatives/raisonnement/cohérence/journal **persistés en base** et rechargés après refresh.
- Premium = desk graphique (charts/tableaux/calendriers, multi-timeframe), aucune conclusion pré-donnée.
- Certificat PDF téléchargeable et cohérent (QA visuelle page par page).
- Docs rangées en 2 dossiers, historique intact, SENTINEL passé.

Exécution en continu des sprints ①→⑦ sans arrêt intermédiaire, sauf blocage réel.
