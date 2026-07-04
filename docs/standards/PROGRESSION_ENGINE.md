# PROGRESSION ENGINE — Spécification

## Verrouillage
- `standard` : toujours ouvert.
- `high` : ouvert ssi `standard.passed`.
- `premium` : ouvert ssi `high.passed`.

## Progression d'un niveau
```
levelProgress(level) = {
  completed: nb de scénarios distincts tentés,
  total:      10,
  correct:    nb de bonnes réponses (best-per-scenario),
  aggregate:  moyenne des meilleurs scores,
  passed:     completed >= 10 && aggregate >= 70,
}
```
Recalculé serveur dans `submitAttempt`, persisté dans `certification_progress`.

## Récurrence
- Un scénario rejoué : latest wins sur l'attempt, `best_score` garde le max.
- `completed_at` fixé quand `passed`.

## Certificat
- Émis quand `standard && high && premium` sont `passed` (garde serveur dans `issueCertificate`).
- Non révoqué en cas de rejeu ultérieur (garantie d'obtention).
- Hash de vérification `TF-CH1-XXXXXXXXXXXX` unique.
