# SCORING ENGINE — Spécification standard

## Score par scénario
`scoreDirection(chosen, correct)` :
- `100` si direction exacte
- `35` si neutre là où une direction était attendue (miss partiel)
- `0` si direction opposée

## Score agrégé par niveau
```
best_per_scenario = max(score) par scenario_index
aggregate(level)  = moyenne(best_per_scenario)
passed(level)     = completed >= SCENARIOS_PER_LEVEL (10) ET aggregate >= 70
```
Recalculé **côté serveur** dans `submitAttempt` (source de vérité), puis persisté
dans `certification_progress`.

## Coherence Index (Premium uniquement — NE PÉNALISE JAMAIS le score)
Pondération 0..100 :
```
alignmentPts = 40 * |declared ∩ opened_relevant| / |declared ∪ opened_relevant|
capturePts   = 40 * |captured_high_relevance| / |high_relevance|
noisePts     = 20 * (1 - min(1, |declared ∩ low_relevance| / |low_relevance|))
coherence    = round(alignmentPts + capturePts + noisePts)
```
- `opened_relevant` : interactions `durationMs > 500` (évite les clics accidentels)
- `high_relevance` : cards `relevance >= 80`
- `low_relevance` : cards `relevance <= 30`

Implémentation actuelle (v1, Jaccard simple) dans `engine.ts::coherenceIndex` ;
la pondération 3 termes ci-dessus est la cible standard.

## Labels
- `>= 75` : Cohérent (success)
- `50-74` : Partiellement cohérent (warning)
- `< 50` : Divergent (destructive)

## Timer Premium (facteur de processus, non pénalisant du score MCQ)
- Base **150 s** (2:30), dégressif **−7 s par scénario** (`order-1`).
- Continue en négatif après 0 → `overtimeMs` persisté (`certification_attempts.overtime_ms`).
- Alimente le feedback qualitatif de raisonnement/cohérence, jamais le score.
