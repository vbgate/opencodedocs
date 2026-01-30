---
title: "Vue Diff : Révision des modifications sous plusieurs angles | Plannotator"
sidebarTitle: "5 types de vue diff"
subtitle: "Vue Diff : Révision des modifications sous plusieurs angles"
description: "Apprenez à changer le type de diff dans la revue de code Plannotator. Sélectionnez uncommitted, staged, last commit ou branch dans le menu déroulant pour réviser les modifications de code sous plusieurs angles."
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# Changer la vue Diff

## Ce que vous apprendrez

Lors de la révision de code, vous pourrez :
- Basculer rapidement entre 5 types de vue diff via le menu déroulant
- Comprendre la portée des modifications de code affichées par chaque vue
- Choisir le type de diff approprié selon vos besoins de révision
- Éviter de manquer des modifications importantes en sélectionnant la mauvaise vue

## Vos problèmes actuels

**Lors de la révision, vous ne regardez que la zone de travail et manquez les fichiers indexés** :

Vous exécutez la commande `/plannotator-review`, voyez quelques modifications de code et ajoutez plusieurs commentaires. Mais après le commit, vous vous rendez compte que la révision a manqué les fichiers déjà `git add` dans la zone de staging — ces fichiers n'apparaissent tout simplement pas dans le diff.

**Vous voulez voir les différences globales entre la branche actuelle et la branche main** :

Vous développez sur une branche feature depuis plusieurs semaines et voulez voir tout ce qui a changé, mais la vue « Modifications non commitées » par défaut n'affiche que les modifications des derniers jours.

**Vous voulez comparer les différences entre deux commits spécifiques** :

Vous voulez vérifier qu'un correctif de bug est correct et devez comparer le code avant et après la correction, mais vous ne savez pas comment faire afficher le diff des commits historiques par Plannotator.

## Quand utiliser cette technique

- **Lors d'une révision complète** : Voir simultanément les modifications de la zone de travail et de la zone de staging
- **Avant la fusion de branche** : Vérifier toutes les modifications de la branche actuelle par rapport à main/master
- **Lors d'une révision de rollback** : Confirmer les fichiers modifiés par le dernier commit
- **En collaboration multi-utilisateur** : Vérifier le code indexé mais non commité par les collègues

## Concept principal

La commande git diff a de nombreuses variantes, chacune affichant une portée de code différente. Plannotator regroupe ces variantes dans un menu déroulant unique, vous évitant de mémoriser des commandes git complexes.

::: info Aide-mémoire des types de Git Diff

| Type de diff | Portée d'affichage | Cas d'utilisation typique |
| --- | --- | --- |
| Uncommitted changes | Zone de travail + Zone de staging | Réviser toutes les modifications du développement en cours |
| Staged changes | Zone de staging uniquement | Réviser le contenu préparé pour le commit avant soumission |
| Unstaged changes | Zone de travail uniquement | Réviser les modifications non encore `git add` |
| Last commit | Dernier commit | Rollback ou révision du commit juste effectué |
| vs main | Branche actuelle vs branche par défaut | Vérification complète avant fusion de branche |

:::

Les options du menu déroulant changent dynamiquement selon votre état Git :
- Si vous n'êtes pas sur la branche par défaut, l'option « vs main » s'affiche
- S'il n'y a pas de fichiers indexés, la vue Staged affiche « No staged changes »

## Suivez le guide

### Étape 1 : Démarrer la révision de code

**Pourquoi**

Il faut d'abord ouvrir l'interface de révision de code de Plannotator.

**Action**

Exécutez dans le terminal :

```bash
/plannotator-review
```

**Ce que vous devriez voir**

Le navigateur ouvre la page de révision de code, avec un menu déroulant au-dessus de l'arborescence des fichiers à gauche affichant le type de diff actuel (généralement « Uncommitted changes »).

### Étape 2 : Passer à la vue Staged

**Pourquoi**

Voir les fichiers déjà `git add` mais pas encore commités.

**Action**

1. Cliquez sur le menu déroulant au-dessus de l'arborescence des fichiers à gauche
2. Sélectionnez « Staged changes »

**Ce que vous devriez voir**

- S'il y a des fichiers indexés, l'arborescence des fichiers affiche ces fichiers
- S'il n'y a pas de fichiers indexés, la zone principale affiche : « No staged changes. Stage some files with git add. »

### Étape 3 : Passer à la vue Last Commit

**Pourquoi**

Réviser le code que vous venez de committer pour confirmer qu'il n'y a pas de problème.

**Action**

1. Rouvrez le menu déroulant
2. Sélectionnez « Last commit »

**Ce que vous devriez voir**

- Affiche tous les fichiers modifiés par le dernier commit
- Le contenu du diff est la différence `HEAD~1..HEAD`

### Étape 4 : Passer à la vue vs main (si disponible)

**Pourquoi**

Voir toutes les modifications de la branche actuelle par rapport à la branche par défaut.

**Action**

1. Vérifiez si l'option « vs main » ou « vs master » existe dans le menu déroulant
2. Si oui, sélectionnez-la

**Ce que vous devriez voir**

- L'arborescence des fichiers affiche tous les fichiers différents entre la branche actuelle et la branche par défaut
- Le contenu du diff est les modifications complètes `main..HEAD`

::: tip Vérifier la branche actuelle

Si vous ne voyez pas l'option « vs main », c'est que vous êtes sur la branche par défaut. Vous pouvez vérifier la branche actuelle avec la commande suivante :

```bash
git rev-parse --abbrev-ref HEAD
```

Passez à une branche feature et réessayez :

```bash
git checkout feature-branch
```

:::

## Point de contrôle ✅

Confirmez que vous avez maîtrisé :

- [ ] Pouvoir trouver et ouvrir le menu déroulant des types de diff
- [ ] Comprendre les différences entre « Uncommitted », « Staged » et « Last commit »
- [ ] Pouvoir identifier quand l'option « vs main » apparaît
- [ ] Savoir quel type de diff utiliser dans quel scénario

## Pièges à éviter

### Piège 1 : Lors de la révision, vous ne regardez que Uncommitted et manquez les fichiers Staged

**Symptôme**

Après le commit, vous vous rendez compte que la révision a manqué certains fichiers indexés.

**Cause**

La vue Uncommitted affiche toutes les modifications de la zone de travail et de la zone de staging (`git diff HEAD`), les fichiers indexés sont également inclus.

**Solution**

Avant la révision, passez d'abord à la vue Staged pour vérifier, ou utilisez la vue Uncommitted (qui inclut la zone de staging).

### Piège 2 : Pas de comparaison avec main avant la fusion de branche

**Symptôme**

Après avoir fusionné vers main, vous découvrez des modifications non pertinentes introduites.

**Cause**

Vous n'avez regardé que les commits des derniers jours, sans comparer les différences globales de la branche par rapport à main.

**Solution**

Avant la fusion, vérifiez complètement avec la vue « vs main ».

### Piège 3 : Penser que changer de vue perd les commentaires

**Symptôme**

Vous n'osez pas changer le type de diff, de peur que les commentaires précédemment ajoutés disparaissent.

**Cause**

Mauvaise compréhension du mécanisme de changement.

**Situation réelle**

Lorsque vous changez le type de diff, Plannotator conserve les commentaires précédents — ils peuvent toujours être pertinents, ou vous pouvez supprimer manuellement les commentaires non pertinents.

## Résumé de la leçon

Les 5 types de diff pris en charge par Plannotator :

| Type | Commande Git | Scénario |
| --- | --- | --- |
| Uncommitted | `git diff HEAD` | Réviser toutes les modifications du développement en cours |
| Staged | `git diff --staged` | Réviser la zone de staging avant commit |
| Unstaged | `git diff` | Réviser les modifications de la zone de travail |
| Last commit | `git diff HEAD~1..HEAD` | Rollback ou révision du commit le plus récent |
| vs main | `git diff main..HEAD` | Vérification complète avant fusion de branche |

Changer de vue ne perd pas les commentaires, vous pouvez voir les mêmes commentaires ou de nouveaux sous différentes perspectives.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons **[Partage par URL](../../advanced/url-sharing/)**.
>
> Vous apprendrez :
> - Comment compresser le contenu de révision dans une URL pour le partager avec des collègues
> - Comment le destinataire ouvre le lien de révision partagé
> - Les limitations et précautions en mode partage

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-24

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Définition des types de Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Récupération du contexte Git | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| Exécution de Git Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Traitement du changement de Diff | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| Rendu des options Diff dans l'arborescence des fichiers | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**Types clés** :

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**Fonctions clés** :

- `getGitContext()`: Récupère la branche actuelle, la branche par défaut et les options de diff disponibles
- `runGitDiff(diffType, defaultBranch)`: Exécute la commande git correspondante selon le type de diff

**API clés** :

- `POST /api/diff/switch`: Change le type de diff et retourne les nouvelles données de diff

</details>
