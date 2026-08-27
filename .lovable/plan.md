# TradForge Evaluation — V6 : socle industrialisable + Chapitre 1 World-Class

Périmètre strict : **codebase Evaluation uniquement**. Les blocs I / J / K (leçons, widgets, progression globale header/sidebar, préflight, onboarding) sont **exclus** — ils relèvent d'Academy. En cas de doute sur l'appartenance d'un élément, je pose la question avant d'implémenter.

Principe directeur : **additif, jamais destructif**. Rien de ce qui fonctionne (MCQ Standard, Workspace High, Reasoning Premium, backend Cloud + RLS, timer, certificat PDF, journal) n'est réécrit ; tout est étendu par métadonnées, config et injection.

## État des lieux (scan effectué)

| Domaine | État |
|---|---|
| Standard MCQ / High Workspace / Premium Reasoning | ✅ complet |
| Backend Cloud (7 tables, RLS, scoring serveur, sessions anonymes) | ✅ complet |
| Replay continu, débrief Rapide/Complète, timer dégressif, certificat PDF, journal | ✅ complet |
| Context Cards V2 | 🟡 sparkline + modal analyste OK ; pas d'onglets/filtres/recherche ; 24 cartes ; datasets riches sur 1 seul scénario |
| Analyse technique | 🟡 2ᵉ délimiteur + break/retest/zone ; pas de module TA structuré |
| Scoring Premium | 🟡 cohérence Jaccard v1, non intégrée au score |
| Scénarios | 🟡 30 scriptés, ordre fixe, aucune métadonnée historique, pas de Difficulty/Selection Engine |
| Difficulty Engine · Selection anti-répétition · chapters/chN/config · i18n | ⬜ absents (documentés seulement) |

**Conclusion clé** : l'ossature (`ScenarioSpec`, cards par `relevance`, seed déterministe, persistance serveur) est saine et suffisante. Les 3 engines manquants s'ajoutent **sans casser** l'existant → on les fait **dans le Sprint 1**, sans attendre les banques de scénarios.

## Décisions structurantes (3 options + recommandation)

**1. Architecture des ~50+ scénarios**
- A. Un jeu distinct par niveau (actuel) — simple, mais x3 la production de contenu et duplication du contexte historique.
- B. Scénario unique + Difficulty Engine — un cas historique = une vérité, la difficulté module bruit/aides/temps. Contenu divisé par 3.
- C. **Hybride (recommandé)** : banque unique de cas historiques (`ScenarioCase`), chaque cas déclarant `difficulty_compatibility: ['standard','high','premium']`. Le Difficulty Engine dérive la vue jouable ; un cas peut rester exclusif à un niveau. → industrialisable, zéro duplication, compatible avec les 150 cas à venir.

**2. Macro (Forex) vs Micro (Actions)**
- A. Deux banques séparées · B. Fusion totale · C. **Banque unique + `asset_class` (recommandé)** : filtrage et quotas par piste au niveau du Selection Engine. Une seule chaîne de production, ouverture obligations/matières premières sans refonte.

**3. Scoring Premium** — retenu par toi : **hybride**. `composite = 0.60 × direction + 0.40 × processus`, avec **plancher : processus < 50 ⇒ échec du scénario même à 100 % de direction**. Standard/High restent purement directionnels.

## SPRINT 1 — Socle industrialisable (P0, tout doit être prêt à la fin)

**1.1 Modèle de scénario enrichi** (`types.ts`, additif, tous champs optionnels) : `scenario_type: 'historical_real' | 'synthetic' | 'hybrid'`, `historical_date`, `market_context`, `asset_class` (fx/equity/bond/commodity/crypto), `asset`, `source`, `difficulty_compatibility[]`, `tags[]`, `i18n`. Les 30 scénarios existants sont **rétro-taggés** `historical_real` sans réécriture.

**1.2 Cohérence historique (garde-fous)** : validateur `scenario-integrity.ts` — cohérence date/contexte/cards, interdiction de mélanger des périodes, supports/résistances ancrés sur prix réels, outcome jamais exposé au client avant décision. Contrôle exécuté au chargement en dev.

**1.3 Difficulty Engine** (`difficulty.ts`) : `(case, level) → ScenarioSpec jouable` — dosage signal/bruit (nb de distracteurs, seuil de relevance visible), aides (résumés texte en `guided`, données brutes en `analyst`), budget temps, capture du raisonnement on/off.

**1.4 Selection Engine anti-répétition** (`selection.ts`) : sélection seedée par utilisateur + tentative, **rotation garantie** (le scénario 1 diffère à chaque nouvelle passe), historique des cas vus persistés en base, quotas par `asset_class` et par famille de contexte. Corrige l'effet « toujours le même scénario à la même position » dès ce sprint.

**1.5 Ingestion-ready** : `chapters/ch1/config.ts` + schéma Zod d'import de la banque ; loader JSON prêt à recevoir les 150 cas documentés sans toucher aux engines.

**1.6 Backend** : table `certification_case_history` (cas servis par utilisateur/niveau, anti-répétition), colonnes de scoring processus sur `certification_attempts`, GRANT + RLS `auth.uid()`.

## SPRINT 2 — Scoring Premium composite

`scoring.ts` : Score Réponse (direction), Score Raisonnement (rôles déclarés, profondeur), Score Collecte (couverture des essentiels), Score Pertinence (signal vs bruit consulté), Score Efficacité (ordre, temps, réouvertures, overtime) → composite 60/40 + plancher 50 %. Recalcul **serveur** dans `submitAttempt` (source de vérité). Restitution visuelle par sous-score dans `ResultsView` + feedback qualitatif et détection de biais (rationalisation, sur-exploration, ancrage).

## SPRINT 3 — Context Cards World-Class

Refonte du rail en **desk à onglets** : Tous · Macro · Micro · Technique · Géopolitique · Intermarché · Banques centrales, avec recherche, filtres, compteurs et badges LEAD/COIN/LAG + BEAT/MISS. Catalogue porté à ~60 cartes avec datasets graphiques déterministes généralisés (plus seulement `prm-3`). Modal analyste : multi-timeframe 3M/1M/Daily/Zoom, niveaux annotés, grille de stats, **aucune conclusion écrite** en Premium. Vue « Macro Dashboard » 11 indicateurs (actual vs consensus) en onglet dédié.

## SPRINT 4 — Module Analyse Technique

Nouvelle famille de cartes TA + panneau dédié : tendance, structure de marché (HH/HL/LH/LL), supports/résistances, figures chartistes, cassures/retests, momentum, volatilité, volumes, multi-timeframe, **score de confluence**. Le chart TradingView-like devient le **zoom décisionnel final**, alimenté par les annotations produites par ce module.

## SPRINT 5 — i18n FR → EN

Infrastructure `src/lib/i18n` (dictionnaire, `useI18n`, contexte racine, sélecteur, persistance du choix). **FR = source, EN = traduction complète** de l'UI existante et des 30 scénarios/cartes actuels. Les banques à venir sont ingérées avec champs bilingues natifs (fallback FR si EN absent).

## SPRINT 6 — Audit documentaire & pixel-perfect

Audit des 20 documents : détection des doublons, fusion, hiérarchie unique de référence (`docs/standards` = normatif, `docs/implementation` = état réel), matrice de traçabilité mise à jour. Ajout des standards pixel-perfect : chart, Context Cards, Workspace, dashboards, animations. Mise à jour additive de `CHANGELOG` / `TASKS` / `DECISION_LOG` / `SENTINEL`, plus documentation de la stratégie 3 codebases (Landing / Academy / Evaluation) et du workflow de branches parallèles.

## Section technique

TanStack Start + Lovable Cloud. Server functions protégées jamais appelées depuis un loader public. Déterminisme `mulberry32` conservé. Persistance write-through (cloud source de vérité + cache local). Tokens OKLCH exclusivement. Chaque migration : CREATE → GRANT → RLS → POLICY.

## Critères d'acceptation

- Typecheck vert, routes 200, aucune régression SENTINEL avant/après.
- Rotation des scénarios effective (deux passes ⇒ ordre et cas différents).
- Métadonnées historiques présentes et validées sur les 30 cas existants ; ingestion des 150 cas possible sans modification d'engine.
- Score Premium composite affiché sous-score par sous-score, plancher processus actif.
- Context Cards à onglets + recherche, ~60 cartes graphiques, zéro conclusion écrite en Premium.
- Module TA opérationnel avec score de confluence.
- EN complet, bascule FR/EN sans rechargement.
- Documentation dédoublonnée, référence unique.

Exécution continue des sprints 1 → 6 sans confirmation intermédiaire, arrêt uniquement sur blocage réel.
