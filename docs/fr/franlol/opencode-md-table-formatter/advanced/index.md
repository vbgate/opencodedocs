---
title: "Fonctionnalités avancées : Principe du formatage | opencode-md-table-formatter"
subtitle: "Fonctionnalités avancées : Principe du formatage"
sidebarTitle: "Comprendre le fonctionnement"
order: 2
description: "Approfondissez le principe de formatage d'opencode-md-table-formatter. Maîtrisez le mode de masquage, les spécifications des tableaux et les modes d'alignement."
prerequisite:
  - "start-getting-started"
  - "start-features"
tags:
  - "Avancé"
  - "Principe"
  - "Spécifications"
---

# Fonctionnalités avancées : Détails techniques du formatage des tableaux Markdown

## Vue d'ensemble du chapitre

Ce chapitre explore en profondeur les détails techniques du formatage des tableaux Markdown, y compris le fonctionnement du mode de masquage d'OpenCode, les spécifications de structure des tableaux valides et les modes d'alignement. En apprenant ces contenus, vous comprendrez comment le plugin traite le formatage des tableaux et comment éviter les erreurs courantes.

## Parcours d'apprentissage

Il est recommandé d'étudier ce chapitre dans l'ordre suivant :

::: info Parcours d'apprentissage
1. **Principe du mode de masquage** → Comprendre pourquoi un traitement spécial est nécessaire pour le mode de masquage d'OpenCode
2. **Spécifications des tableaux** → Maîtriser quels types de tableaux peuvent être correctement formatés
3. **Détails des modes d'alignement** → Apprendre à contrôler l'alignement et l'esthétique des tableaux
:::

## Prérequis

Avant de commencer ce chapitre, assurez-vous d'avoir :

- [x] Terminé [Démarrage en une minute](../start/getting-started/), installé et configuré le plugin avec succès
- [x] Lu [Aperçu des fonctionnalités](../start/features/), compris les fonctionnalités de base du plugin

::: warning Remarque importante
Si vous n'avez pas encore terminé l'apprentissage de base, il est recommandé de revenir au [Guide de démarrage](../start/getting-started/) pour commencer.
:::

## Navigation du cours

### [Principe du mode de masquage](./concealment-mode/)

Comprendre le fonctionnement du mode de masquage d'OpenCode et comment le plugin calcule correctement la largeur d'affichage. Vous apprendrez :
- Qu'est-ce que le mode de masquage et pourquoi un traitement spécial est nécessaire
- Comment fonctionne l'algorithme de suppression des symboles Markdown
- Le rôle de `Bun.stringWidth()` dans le calcul de la largeur

**Durée estimée** : 8 minutes | **Difficulté** : Moyenne | **Prérequis** : Aperçu des fonctionnalités

---

### [Spécifications des tableaux](./table-spec/)

Maîtriser les exigences de structure des tableaux Markdown valides et éviter les erreurs de "tableau invalide". Vous apprendrez :
- Quelles structures de tableau sont valides
- Le rôle et les exigences de format de la ligne de séparation
- Le principe de vérification de la cohérence du nombre de colonnes
- Comment identifier rapidement les problèmes de structure de tableau

**Durée estimée** : 6 minutes | **Difficulté** : Débutant | **Prérequis** : Principe du mode de masquage

---

### [Détails des modes d'alignement](./alignment/)

Maîtriser la syntaxe et les effets des trois modes d'alignement pour rendre les tableaux plus esthétiques. Vous apprendrez :
- La syntaxe de l'alignement à gauche, centré et à droite
- Comment spécifier le mode d'alignement dans la ligne de séparation
- L'algorithme de remplissage du contenu des cellules
- La relation entre l'alignement et la largeur d'affichage

**Durée estimée** : 10 minutes | **Difficulté** : Moyenne | **Prérequis** : Spécifications des tableaux

---

## Résumé du chapitre

Après avoir terminé ce chapitre, vous serez capable de :

- ✅ Comprendre le fonctionnement du mode de masquage d'OpenCode
- ✅ Maîtriser les exigences de structure des tableaux valides
- ✅ Identifier et réparer les tableaux invalides
- ✅ Utiliser熟练ment les trois modes d'alignement
- ✅ Comprendre les détails techniques de l'implémentation interne du plugin

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez :

1. **Résoudre des problèmes réels** → Apprendre [Questions fréquentes](../../faq/troubleshooting/), localiser et résoudre rapidement les problèmes
2. **Comprendre les limites techniques** → Lire [Limitations connues](../../appendix/limitations/), comprendre les scénarios d'application du plugin
3. **Approfondir l'implémentation** → Voir [Détails techniques](../../appendix/tech-details/), comprendre le mécanisme de cache et l'optimisation des performances

---

::: tip Conseil pratique
Si vous souhaitez résoudre rapidement les problèmes de formatage de tableau, vous pouvez d'abord lire les [Spécifications des tableaux](./table-spec/) de ce chapitre, qui contient les cas de tableaux invalides les plus courants.
:::
