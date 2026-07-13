# TradForge — V5 : Desk graphique + scénarios historiques + i18n (exécution continue)

Prise en compte des dernières consignes : **pause du moteur dynamique**, intégration des **bibliothèques historiques scriptées (Lot 1/2/3)**, **Context Cards graphiques** (l'apprenant analyse, ne lit pas la réponse), **analyse technique multi-timeframe**, **i18n EN/FR**. Rendu premium classe mondiale, tokens OKLCH only, docs additives.

## Analyse d'impact (gouvernance AGENTS.md)

**Composants concernés** : `ContextCard`, `CandleChart`, `WorkspaceRun`, `StandardRun`, `ResultsView`, `DebriefPanel`, `ReplayLoader`, routes certification, `__root`.
**Fichiers concernés** : `types.ts`, `cards.ts`, `scenarios.ts`, `market-data.ts`, nouveaux `cards/*`, `i18n/*`, `chapters/ch1/config.ts`.
**Risques de régression** : flux research→decision→reasoning→results, persistance cloud/localStorage, SSR (aucune server fn protégée en loader public), perf recharts (lazy au clic), déterminisme seed.

## SPRINT A — Context Cards graphiques V2 (P0, cœur des visuels fournis)
Aligné sur le desk Premium (PDF `Context Cards`, `image_10.png`, `image-2.png`, `image-3.png`).
- `types.ts` : `ContextCardDataset` (spark, deltaLabel/tone, cycle `lead|coin|lag`, verdict `beat|miss|inline`, actual/consensus/previous, unit, `timeframes[]` avec `levels[]`, `stats[]`), `CardRenderMode = guided|analyst`.
- `cards.ts` : datasets déterministes (générateur seedé `mulberry32`) sur les 18 cartes + nouvelles cartes desk (Bund 10Y, US 10Y, BCE, spreads BTP/OAT-Bund, GDP, courbe des taux).
- `ContextCard.tsx` : carte-rail avec **sparkline recharts** + chip delta + badge LEAD/LAG/COIN, état « consultée ✓ ». Modal **analyst** : line chart plein cadre, toggle **multi-timeframe (3M/1M/Daily/Zoom)**, niveaux clés annotés, grille de stats, badges BEAT/MISS, mention « Données brutes. À vous d'observer… » — **jamais de conclusion écrite** en Premium. Mode `guided` (High) conserve les résumés texte.
- `WorkspaceRun` : passe `renderMode = premium ? 'analyst' : 'guided'`.

## SPRINT B — Analyse technique multi-timeframe sur le chart
- `CandleChart.tsx` : **2e délimiteur** `decisionWindowEnd` (fin de fenêtre d'analyse, post = atténué), **HUD reveal** (fenêtre, durée, nb bougies, pips réalisés, direction), rendu `techAnnotations[]` (break/retest/zone), supports/résistances/canaux.
- `types.ts` `ChartSpec` : `decisionWindowEnd?`, `techAnnotations?[]`, `channel?`.

## SPRINT C — Bibliothèque de scénarios historiques scriptés
- **Pause du moteur dynamique** (conservé, non branché).
- `scenarios.ts` : ingestion structurée des **Lots 1/2/3** (Cas 11→160) en `ScenarioSpec` scriptés, mappés par niveau (Standard/High/Premium/Elite→premium), avec cards liées + relevance, chart seedé, débrief (rationale/outcome/quickTake/keyLearning/macroImpact) tirés des tableaux fournis.
- Sélection 10/niveau par défaut + banque complète accessible.

## SPRINT D — i18n EN/FR
- `src/lib/i18n/` : dictionnaire `en`/`fr`, hook `useI18n`, contexte dans `__root`, sélecteur de langue. Traduction UI + libellés scénarios/cards (champs `*_fr`/`*_en` ou table de traduction). Défaut FR.

## SPRINT E — Timer Premium + Certificat PDF + finitions
- `useDecisionTimer` : base 2:30, −7s×(index−1), non bloquant, overtime rouge ; `duration_ms` persisté → feedback cohérence.
- Certificat `pdf-lib` client (edge-safe) « TradForge Institut » : sceau, nom, niveaux, score, date, hash de vérification ; bouton dans hub/journal à 100 %.
- Anti-régression `SENTINEL.md` avant/après ; MAJ additive `TASKS/CHANGELOG/DECISION_LOG/COMPONENT_REGISTRY`.

## Section technique
Stack : TanStack Start, Lovable Cloud (`requireSupabaseAuth`), `recharts`, `motion`, `pdf-lib`. Déterminisme `mulberry32`. Persistance write-through (cloud + cache localStorage). Public loaders → aucune server fn protégée.

## Critères d'acceptation
- `tsgo --noEmit` vert, routes 200, aucune error boundary.
- Cartes Premium = graphiques (sparkline rail + modal chart multi-timeframe + stats + badges), zéro conclusion écrite.
- Chart : 2 délimiteurs + HUD + annotations techniques.
- Scénarios historiques scriptés jouables et persistés.
- i18n EN/FR opérationnelle. Certificat PDF téléchargeable.
- Docs additives, SENTINEL passé.

Exécution en continu des sprints A→E sans arrêt intermédiaire, sauf blocage réel.
