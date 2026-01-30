---
title: "Fonctions avancées : Collaboration et intégration de notes | plannotator"
sidebarTitle: "Collaboration et intégration de notes"
subtitle: "Fonctions avancées : Collaboration et intégration avec des applications de prise de notes"
order: 3
description: "Maîtrisez les fonctionnalités de collaboration d'équipe et d'intégration de notes de Plannotator. Partagez via URL pour collaborer, intégrez Obsidian/Bear et supportez les environnements de développement à distance."
---

# Fonctions avancées

Après avoir maîtrisé les bases de la revue de plans et de code, ce chapitre vous permettra de débloquer les capacités avancées de Plannotator : le partage en équipe, l'intégration avec des applications de prise de notes, le support du développement à distance, et la configuration flexible des variables d'environnement.

::: warning Prérequis
Avant de commencer ce chapitre, assurez-vous d'avoir terminé :
- [Démarrage rapide](../../start/getting-started/) : Comprendre les concepts de base de Plannotator
- [Basics de revue de plan](../../platforms/plan-review-basics/) : Maîtriser les opérations de base de revue de plans
:::

## Contenu de ce chapitre

| Cours | Description | Cas d'usage |
| --- | --- | --- |
| [Partage via URL](./url-sharing/) | Partagez des plans et des annotations via URL pour une collaboration sans backend | Besoin de partager des résultats de revue avec l'équipe |
| [Intégration Obsidian](./obsidian-integration/) | Enregistrez automatiquement les plans approuvés dans votre vault Obsidian | Utiliser Obsidian pour gérer sa base de connaissances |
| [Intégration Bear](./bear-integration/) | Enregistrez des plans dans Bear via x-callback-url | Utilisateurs macOS/iOS utilisant Bear pour les notes |
| [Mode à distance](./remote-mode/) | Utilisez Plannotator dans des environnements à distance comme SSH, devcontainer, WSL | Scénarios de développement à distance |
| [Configuration des variables d'environnement](./environment-variables/) | Découvrez toutes les variables d'environnement disponibles et leurs usages | Besoin de personnaliser le comportement de Plannotator |

## Recommandation d'ordre d'apprentissage

```
┌─────────────────────────────────────────────────────────────────┐
│  Ordre d'apprentissage recommandé                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Partage via URL          ← Le plus utilisé, essentiel pour  │
│       ↓                         la collaboration en équipe        │
│  2. Intégration avec app de    ← Choisissez selon votre app     │
│       notes                     de prise de notes                │
│     ├─ Intégration Obsidian   (Utilisateurs Obsidian)          │
│     └─ Intégration Bear       (Utilisateurs Bear)              │
│       ↓                                                         │
│  3. Mode à distance          ← Si vous développez dans un        │
│       ↓                         environnement à distance         │
│  4. Configuration des         ← À consulter pour une            │
│       variables d'env.          personnalisation avancée       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

::: tip Apprenez selon vos besoins
Il n'est pas nécessaire de tout suivre dans l'ordre. Si vous avez uniquement besoin de la fonction de partage, apprenez simplement le partage via URL. Si vous ne faites pas de développement à distance, vous pouvez sauter le mode à distance.
:::

## Prochaines étapes

Après avoir terminé les fonctions avancées, vous pouvez :

- Consulter les [FAQ](../../faq/common-problems/) : Résoudre les problèmes rencontrés
- Consulter la [Référence API](../../appendix/api-reference/) : Découvrir l'API complète de Plannotator
- Consulter les [Modèles de données](../../appendix/data-models/) : Comprendre en profondeur les structures de données internes
