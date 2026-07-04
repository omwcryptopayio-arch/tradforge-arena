# DECISION_JOURNAL

Route : `/journal` — `src/routes/journal.tsx`.

## Contenu
Historique des décisions Premium (`getJournal()` depuis `localStorage`).

Chaque entrée (`JournalEntry`) :
- niveau, symbole, titre, date,
- direction choisie + alignée/divergente,
- Indice de Cohérence + Research Efficiency,
- raisonnement déclaré (carte · rôle),
- biais détecté éventuel.

## Agrégats
- nombre de décisions, taux de réussite,
- cohérence moyenne, efficacité moyenne,
- **biais récurrents** (comptés et listés).

## Persistance
`addJournalEntry` / `getJournal` / `resetAll` dans `storage.ts`.
Événement `tradforge:storage` → rafraîchissement live des vues (hub + journal).
