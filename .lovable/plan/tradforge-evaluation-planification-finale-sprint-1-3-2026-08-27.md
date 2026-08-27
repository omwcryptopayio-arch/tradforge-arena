# TradForge Evaluation — Planification finale (Sprint 1 → 3)

Périmètre strict : **codebase Evaluation**. Les blocs Academy (leçons, widgets, progression globale, préflight, onboarding) sont exclus ; en cas de doute sur l'appartenance d'un élément, je pose la question avant d'implémenter.

Principe directeur : **additif, jamais destructif**. Ce qui fonctionne est **gelé** et seulement enrichi.

## FREEZE — périmètre « ne pas casser »

Standard, High, Premium (mécaniques, scoring, raisonnement, cohérence), débrief Rapide/Complète, replay, journal, progression, persistance Cloud, certificat PDF → **gelés fonctionnellement**. Aucune modification de leur logique de scoring. Seules des retouches **visuelles** sont autorisées sur ces écrans.

**Correction majeure actée** : le scoring composite (réponse + raisonnement + collecte + pertinence + efficacité, 60/40 avec plancher processus) concerne **exclusivement le niveau Elite**. Standard/High/Premium conservent leur scoring directionnel actuel.

## État des lieux (scan réel du dépôt)

| Domaine | État |
|---|---|
| Standard / High / Premium, replay, débrief, journal, timer, certificat PDF | ✅ complet — FREEZE |
| Backend Cloud : 7 tables, RLS `auth.uid()`, scoring serveur, `user_roles` + `has_role` | ✅ en place |
| Authentification | 🟡 sessions **anonymes** uniquement — pas de compte, pas de `profiles` |
| Identité certificat | 🟡 `candidate_name` saisi à la main, non relié à un profil |
| Rotation / anti-répétition | ⬜ absente — ordre fixe, même scénario à la même position |
| i18n | ⬜ absente — tout est en FR en dur |
| Layout Premium 70/30, zoom/fullscreen | 🟡 layout existant non conforme aux visuels |
| Niveau Elite, Trial, banque historique (160 cas) | ⬜ à construire (Sprint 2) |

Conclusion : la couche backend est solide ; l'auth se **transforme** (anonyme → compte) plutôt qu'elle ne se recrée.

---

# SPRINT 1 — PUBLIC BETA READY

## 1.1 Anti-régression (avant / après)
Baseline SENTINEL : captures et checklist fonctionnelle des 3 niveaux avant modification, rejouées après chaque lot.

## 1.2 Authentification (P0)
- Auth email + mot de passe + **confirmation du mot de passe**, **sans vérification par e-mail** (auto-confirm activé côté serveur) → inscription puis connexion immédiate.
- Écran `/auth` public (SSR), sous-arbre protégé pour les surfaces personnelles ; session persistante, déconnexion, restauration au chargement.
- **Migration douce** : la session anonyme en cours est convertie en compte réel (`updateUser` email + mot de passe) → la progression déjà accumulée est **conservée**, pas de perte de données. Fallback : création de compte classique.
- Table `profiles` (display_name, email, locale, created_at/updated_at) + trigger de création à l'inscription, GRANT + RLS `auth.uid()`. `user_roles`/`has_role` existants réutilisés tels quels.

## 1.3 Identité de certification
Nom du profil injecté automatiquement dans le certificat (champ pré-rempli, éditable une fois), conditions d'éligibilité et bouton de téléchargement vérifiés de bout en bout : compte → profil → progression → éligibilité → PDF signé au bon nom.

## 1.4 Internationalisation FR ⇄ EN (P0)
- Architecture `contenu → langue → UI` (jamais de `if lang === 'en'`), extensible à DE/ES/PT sans refonte : dictionnaire par domaine, `useI18n`, fallback, langue persistée dans `profiles.locale` + localStorage, bascule sans rechargement.
- Couverture exhaustive : UI/nav/boutons/tooltips/modals/loaders/erreurs/empty states, auth, hub, replay, context cards, débriefs, scoring, certificat, journal, labels techniques du chart, métadonnées de page.
- **EN culturellement adapté** (registre desk institutionnel), pas de traduction mot à mot. Les 30 scénarios existants sont traduits ; les banques à venir seront ingérées avec champs bilingues natifs.
- Contrôle automatisé : détection de chaînes FR résiduelles en mode EN.

## 1.5 Anti-répétition — dès maintenant, sur les 30 scénarios (P0)
Trois options : **A** aléatoire simple + exclusion récente (faible valeur) · **B** cooldown mémoire (bon) · **C** **Weighted Rotation Engine (recommandé, retenu)** : cooldown par scénario, `usage_count`, `last_used_at`, poids de diversité (classe d'actifs, famille de contexte, difficulté), seed par utilisateur+tentative.
- Table `scenario_usage` (user_id, scenario_id, level, used_at, usage_count, cooldown_until) + RLS.
- Effet immédiat : à chaque nouvelle passe, le scénario 1 **change**, l'ordre change, la couverture pédagogique reste contrôlée. Le moteur est déjà dimensionné pour absorber 160 cas sans modification.

## 1.6 Correctifs visuels (sans toucher la logique)
- **Workspace 70 / 30** : chart 70 % de largeur, rail Context Cards 30 %, conformément aux visuels de référence — et au-delà : densité, hiérarchie typographique, states de survol.
- **Zoom / Focus** : plein écran chart (ESC pour sortir), plein écran Context Card, transitions premium, responsive.
- Replay : fluidité des bougies, fenêtre de décision, marqueurs, compteurs pré/post décision.
- Context Cards : framing, hiérarchie, focus/zoom, graphiques temporels conservés. Industrialisation complète du catalogue → Sprint 2.

## 1.7 QA bilingue
Matrice Auth · Hub · Replay · Context · Certification · Certificat · Mobile · Desktop × FR/EN × fonctionnel/visuel — aucune case vide en clôture.

**Definition of Done Sprint 1** : compte + connexion opérationnels sans e-mail de confirmation, profil relié au certificat, FR et EN complets sans résidu, rotation anti-répétition active, layout 70/30 + zoom livrés, zéro régression Standard/High/Premium.

---

# SPRINT 2 — INFRASTRUCTURE SCÉNARIOS + ELITE

## 2.1 Audit quantitatif de la banque
Inventaire réel des 160 cas fournis (Lots 1A→3B) : doublons, cas incomplets, cas exploitables, classe d'actifs, date historique, indicateurs disponibles. Aucune décision d'architecture avant ce chiffre réel.

## 2.2 Modèle de métadonnées (extension additive)
`scenario_type` (`historical_real` actif ; `synthetic` / `hybrid` préparés mais inactifs), `historical_date`, `market_context`, `asset_class`, `asset`, `market_session`, `source`, `event_date`, `data_snapshot`, `difficulty_compatibility[]`, `tags[]`, `used_at`, `usage_count`, `cooldown`.

## 2.3 Temporalité et intégrité historique
Chaque scénario est ancré à un instant précis : indicateurs, supports/résistances et cartes doivent tous provenir de **cette** date. Interdiction stricte de mélanger des périodes ou d'inventer une « valeur plausible ». Validateur `scenario-integrity.ts` bloquant en dev ; outcome jamais exposé au client avant décision.

## 2.4 Stockage — source de vérité unique
Audit `scenarios` (DB) vs bucket `simulation-scenarios` avant toute création, pour éviter la duplication. Chaîne : Library → Supabase → Selection Engine → Scenario Engine → Difficulty Engine → Évaluation.

## 2.5 Architecture de la banque (recommandation)
Banque **unique** de cas historiques, chaque cas déclarant sa `difficulty_compatibility` ; le Difficulty Engine dérive la vue jouable par niveau. `asset_class` gère macro (Forex) et micro (Actions) dans une seule chaîne, avec quotas au niveau de la sélection — obligations et matières premières s'ouvrent sans refonte.

## 2.6 Niveau ELITE (extension, pas 4ᵉ implémentation)
Standard → High → Premium → **Elite**. Conditions proches du réel : capital et contraintes, contexte complet, informations contradictoires, ratio signal/bruit élevé, macro + micro + technique + géopolitique + sentiment + intermarché, recherche obligatoire.
**Scoring Elite (et Elite seul)** : `composite = 0,60 × direction + 0,40 × processus` (raisonnement, collecte, pertinence des cartes, efficacité du parcours), **plancher : processus < 50 ⇒ échec**, recalcul serveur, restitution sous-score par sous-score + détection de biais.

## 2.7 TRIAL (fenêtre promotionnelle, pas un niveau)
État normal : Standard disponible, High/Premium/Elite verrouillés selon la progression. Trial actif : Elite **exceptionnellement ouvert**, essais illimités, résultats persistés et tentatives tracées. Ouverture/fermeture **pilotées serveur** (flag en base) — aucun hardcode frontend.

## 2.8 Module Analyse Technique & Context Cards industrialisés
Desk à onglets (Tous · Macro · Micro · Technique · Géopolitique · Intermarché · Banques centrales) avec recherche, filtres, compteurs, badges LEAD/COIN/LAG et BEAT/MISS ; vue Macro Dashboard multi-indicateurs. Module TA : tendance, structure (HH/HL/LH/LL), supports/résistances, figures, cassures/retests, momentum, volatilité, volumes, multi-timeframe, **score de confluence**. Le chart devient le zoom décisionnel final.

---

# SPRINT 3 — MOTEUR SYNTHÉTIQUE (reporté, préparé)

Activé seulement après stabilisation de la banque, d'Elite, de la rotation et du data model. Sprint 1-2 ne laissent que des interfaces compatibles : `scenario_type`, briques de description, aucune dépendance IA.

---

## Section technique
TanStack Start + Lovable Cloud. Aucune server function protégée appelée depuis un loader public ; routes protégées sous `_authenticated`. Déterminisme `mulberry32` conservé. Persistance write-through (cloud = vérité, cache local). Tokens OKLCH exclusivement. Chaque migration : CREATE → GRANT → RLS → POLICY. Documentation additive (`CHANGELOG`, `TASKS`, `DECISION_LOG`, `SENTINEL`, standards pixel-perfect) mise à jour en fin de chaque sprint.

Exécution continue Sprint 1 → 2 → 3 sans confirmation intermédiaire, arrêt uniquement sur blocage réel.
