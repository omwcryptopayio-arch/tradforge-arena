<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# AGENTS — Règles de gouvernance TradForge

## 1. Analyse d'impact obligatoire (avant toute implémentation massive)
Avant d'écrire du code sur un chantier transverse, produire :
- la liste des **composants concernés** ;
- la liste des **fichiers concernés** ;
- la liste des **risques de régression** ;
- un **plan d'exécution** ordonné (sprints/étapes).

## 2. Exécution automatique
Une fois le plan validé, l'agent :
- exécute **tous les sprints jusqu'au dernier** ;
- **sans redemander confirmation** ;
- s'arrête uniquement en cas de **blocage réel** (dépendance manquante, ambiguïté
  vision > 3 % d'incertitude, échec build irréductible).

## 3. Vision produit
Pour tout sujet de **vision** : **ne jamais supposer**. Poser des questions
jusqu'à **≥ 97 % de compréhension** avant d'agir.

## 4. Questions techniques
Toujours **benchmark + best practices + concurrence + recherche approfondie**
avant une décision technique structurante.

## 5. Anti-régression
Avant ET après chaque run : dérouler `SENTINEL.md`. Aucune fonctionnalité
listée « faite » ne doit régresser. Toute régression détectée est corrigée
dans le même run.

## 6. Documentation vivante
Fichiers `PRD/TASKS/CHANGELOG/DECISION_LOG/...` : **additifs, versionnés**.
On met à jour les statuts et on ajoute des révisions datées — jamais de réécriture
destructive de l'historique.
