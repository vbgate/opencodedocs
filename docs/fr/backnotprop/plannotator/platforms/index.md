---
title: "Fonctionnalités de plateforme: Révision de plans et de code | Plannotator"
sidebarTitle: "Révision de plans et de code IA"
subtitle: "Fonctionnalités de plateforme: Révision de plans et de code"
description: "Découvrez les fonctionnalités de plateforme de Plannotator, incluant la révision de plans et la révision de code. Maîtrisez les compétences essentielles: révision visuelle, ajout d'annotations et marquage d'images."
order: 2
---

# Fonctionnalités de plateforme

Ce chapitre présente les deux fonctionnalités principales de Plannotator : la **révision de plans** et la **révision de code**. Vous apprendrez à réviser visuellement les plans générés par l'IA, à ajouter différents types d'annotations, à joindre des marquages d'images, ainsi qu'à réviser les modifications de code via git diff.

## Prérequis

::: warning Vérifiez avant de commencer
Avant d'aborder ce chapitre, assurez-vous d'avoir complété les étapes suivantes :

- ✅ Avoir terminé le tutoriel [Démarrage rapide](../start/getting-started/)
- ✅ Avoir installé le plugin Plannotator ([Claude Code](../start/installation-claude-code/) ou [OpenCode](../start/installation-opencode/))
:::

## Contenu du chapitre

### Révision de plans

Apprenez à réviser les plans d'exécution générés par l'IA, à ajouter des suggestions de modification pour que l'IA exécute selon vos intentions.

| Tutoriel | Description |
| --- | --- |
| [Bases de la révision de plans](./plan-review-basics/) | Apprenez à utiliser Plannotator pour réviser visuellement les plans générés par l'IA, y compris l'approbation ou le rejet de plans |
| [Ajout d'annotations de plan](./plan-review-annotations/) | Maîtrisez l'ajout de différents types d'annotations dans les plans (suppression, remplacement, insertion, commentaire) |
| [Ajout de marquages d'images](./plan-review-images/) | Apprenez à joindre des images lors de la révision de plans et à utiliser les outils pinceau, flèche et cercle pour les annoter |

### Révision de code

Apprenez à réviser les modifications de code, à ajouter des annotations au niveau des lignes et à détecter les problèmes avant la validation.

| Tutoriel | Description |
| --- | --- |
| [Ajout d'annotations de code](./code-review-annotations/) | Maîtrisez l'ajout d'annotations au niveau des lignes lors de la révision de code (comment/suggestion/concern) |
| [Changement de vue Diff](./code-review-diff-types/) | Apprenez à basculer entre différents types de diff lors de la révision de code (uncommitted/staged/last commit/branch) |

## Parcours d'apprentissage

::: tip Ordre d'apprentissage recommandé
Selon votre cas d'utilisation, choisissez le parcours d'apprentissage approprié :

**Parcours A : Révision de plans en priorité** (recommandé pour les débutants)
1. [Bases de la révision de plans](./plan-review-basics/) → Commencez par maîtriser le processus de base de révision de plans
2. [Ajout d'annotations de plan](./plan-review-annotations/) → Apprenez à modifier les plans avec précision
3. [Ajout de marquages d'images](./plan-review-images/) → Exprimez vos intentions plus clairement avec des images
4. Puis passez à la série sur la révision de code

**Parcours B : Révision de code en priorité** (adapté aux développeurs expérimentés en Code Review)
1. [Bases de la révision de code](./code-review-basics/) → Familiarisez-vous avec l'interface de révision de code
2. [Ajout d'annotations de code](./code-review-annotations/) → Apprenez les annotations au niveau des lignes
3. [Changement de vue Diff](./code-review-diff-types/) → Maîtrisez les différents types de diff
4. Puis passez à la série sur la révision de plans
:::

## Étapes suivantes

Après avoir terminé ce chapitre, vous pouvez continuer avec :

- [Partage par URL](../advanced/url-sharing/) - Partagez des plans et annotations via URL pour la collaboration en équipe
- [Intégration Obsidian](../advanced/obsidian-integration/) - Sauvegardez automatiquement les plans approuvés dans Obsidian
- [Mode distant](../advanced/remote-mode/) - Utilisez Plannotator dans des environnements SSH, devcontainer ou WSL
