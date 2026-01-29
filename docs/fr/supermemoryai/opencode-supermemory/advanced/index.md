---
title: "Fonctionnalités avancées : Optimisation | opencode-supermemory"
sidebarTitle: "Fonctionnalités avancées"
subtitle: "Fonctionnalités avancées : Optimisation et configuration"
description: "Apprenez les mécanismes avancés de Supermemory : compactage préemptif et configuration approfondie pour optimiser la gestion du contexte."
order: 3
---

# Fonctionnalités avancées

Ce chapitre explique en profondeur les mécanismes sous-jacents de Supermemory et les options de configuration avancées. Vous apprendrez à optimiser les performances du moteur de mémoire et à personnaliser le comportement du plugin selon les besoins de votre projet.

## Contenu du chapitre

<div class="grid-cards">

### [Principe de compactage préemptif](./compaction/)

Comprenez en profondeur le mécanisme de compression automatique déclenché par le seuil de tokens. Apprenez comment Supermemory génère activement un résumé structuré et le sauvegarde de manière persistante avant que le contexte ne déborde, empêchant ainsi les problèmes d'oubli lors de longues sessions.

### [Détails de la configuration approfondie](./configuration/)

Personnalisez les seuils de compression, les règles de déclenchement par mots-clés et les paramètres de recherche. Maîtrisez toutes les options du fichier de configuration pour que Supermemory s'adapte parfaitement à votre flux de travail.

</div>

## Parcours d'apprentissage

```
┌─────────────────────────────────────────────────────────────┐
│  Étape 1              Étape 2                                │
│  Principe de compactage préemptif   →   Détails de la configuration approfondie  │
│  (Comprendre le mécanisme)          (Personnalisation pratique)                     │
└─────────────────────────────────────────────────────────────┘
```

**Ordre recommandé** :

1. **Apprenez d'abord le principe de compactage** : Comprenez comment Supermemory gère automatiquement le contexte, c'est la base de la configuration avancée.
2. **Ensuite apprenez les détails de la configuration** : Une fois que vous comprenez le mécanisme, vous pourrez prendre des décisions de configuration raisonnables (par exemple, quel seuil est approprié).

## Conditions préalables

::: warning Vérifiez avant de commencer
Ce chapitre suppose que vous avez terminé les apprentissages suivants :

- ✅ [Démarrage rapide](../start/getting-started/) : Plugin installé et clé API configurée
- ✅ [Portée et cycle de vie de la mémoire](../core/memory-management/) : Compréhension de la différence entre User Scope et Project Scope
:::

## Étapes suivantes

Après avoir terminé ce chapitre, continuez à apprendre :

- **[Confidentialité et sécurité des données](../security/privacy/)** : Comprenez le mécanisme de masquage des données sensibles et assurez-vous que votre code et vos clés ne sont pas accidentellement téléchargés.
