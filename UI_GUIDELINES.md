# UI GUIDELINES — Visual DNA "Institutional Desk"

- **Fond** near-black ; **accent** gold/amber ; **bull** vert / **bear** rouge.
- **Type** : Space Grotesk (display), DM Sans (body), JetBrains Mono (`label-mono`).
- **Tokens oklch** dans `src/styles.css` uniquement — jamais de couleur en dur.
- **Motion** : `motion/react`, transitions sobres, une animation forte par écran.
- **Débrief** : hiérarchie progressive, densité réduite, sections à icône + `label-mono`.
- **Chart** : jamais déplacé après une réponse ; le débrief s'ouvre dessous.
- **Idle state** : `ReplayLoader` reprend le chrome du chart (pas de saut de layout).
