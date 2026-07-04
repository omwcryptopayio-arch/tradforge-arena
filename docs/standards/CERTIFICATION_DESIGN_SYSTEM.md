# CERTIFICATION DESIGN SYSTEM

Standards UI/UX propres aux certifications. Visual DNA détaillée : `UI_GUIDELINES.md`.

## Principes
- **Dark-first institutionnel** : near-black, or (`--gold`), densité maîtrisée, zéro bruit gratuit.
- Tokens **OKLCH uniquement** (`src/styles.css`). Jamais de couleur en dur.
- Typo : Space Grotesk (display), DM Sans (body), JetBrains Mono (labels/metrics).
- Motion : `motion/react`, une animation héro par vue, transitions sobres.

## Règles data-viz (desk Premium)
- Charts sur tokens sémantiques (`--primary`, `--gold`, `--muted-foreground`, tonalités bull/bear/neutral).
- Toujours : axes lisibles, niveaux clés annotés, unités, marqueurs temporels.
- **Jamais** de conclusion écrite sur une card Premium : la donnée parle, l'apprenant déduit.
- High = résumé texte guidé ; Premium = visualisation brute + annotations.

## Layout
- Chart fixe, débrief additif dessous (pas de saut de layout).
- Context Cards : rail latéral, ouverture modale plein cadre, retour au scénario.
- Timer Premium visible, passe en rouge au dépassement (`overtime`).

## Certificat
- Format paysage A4, sceau/monogramme TradForge, or sur near-black,
  nom candidat, niveaux, score agrégé, date, hash de vérification, émetteur « TradForge Institut ».
