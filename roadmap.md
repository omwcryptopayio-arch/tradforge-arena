# TradeForge Arena — Roadmap d'exécution

Nom officiel de la codebase : **TradeForge Arena**.

## BLOC CORRECTIF PRIORITAIRE (avant reprise de la roadmap Sprint 1→3)

### P0-A — Auth gate obligatoire
- [x] Route `/auth` (création de compte : email, password, confirm, display name)
- [x] Message de confirmation explicite après création + renvoi vers Sign in
- [x] Homepage Arena : utilisateur non authentifié → bloc Create account immédiat
- [x] Niveaux Standard / High / Premium inaccessibles sans authentification
- [x] Aucun contournement de navigation possible
- [x] Sign out depuis la top bar

### P0-B — Top bar universelle
- [x] Présente sur hub + pages de niveau + interfaces d'évaluation
- [x] Sélecteur de langue par drapeaux 🇫🇷 / 🇬🇧
- [x] Mobile-friendly (grid + min-w-0 + shrink-0)
- [x] Sign in / Sign out accessibles partout

### P0-C — English completion (approche par couches, pas écran par écran)
- [x] Couche Global UI (navigation, boutons, labels)
- [x] Couche Level system (Standard / High / Premium)
- [x] Couche Level descriptions
- [x] Couche Scenario metadata (titres, contexte, données)
- [x] Couche Scenario content (texte complet)
- [x] Couche Questions
- [x] Couche Reasoning
- [x] Couche Coherence
- [x] Couche Feedback (correct / incorrect / explications)
- [x] Couche Results (scores, progression, messages)
- [x] Couche Certificates (génération, téléchargement, messages)
- [x] Couche Errors (validation, auth, système)
- [x] Couche Mobile UI (aucun texte tronqué / non traduit)
- [x] Context Cards (titres, résumés, corps d'analyse)

### P1 — Audit français
- [x] EN = 100 % anglais, FR = 100 % français (script de détection de résidus)

## REPRISE DE LA ROADMAP (Sprint 1 → 3)
- [x] Sprint 1.2 Authentification (email/password, migration douce anonyme → compte)
- [x] Sprint 1.4 i18n FR ⇄ EN
- [x] Sprint 1.5 Anti-répétition — Weighted Rotation Engine
- [ ] Sprint 1.3 Identité de certification (nom du profil → certificat)
- [ ] Sprint 1.6 Correctifs visuels (workspace 70/30, zoom/fullscreen)
- [ ] Sprint 2 — Banque historique 160 cas, niveau Elite, Trial, module TA
- [ ] Sprint 3 — Moteur synthétique (préparé, non activé)
