---
title: "Démarrage rapide: Installation | opencode-supermemory"
sidebarTitle: "Démarrage rapide"
subtitle: "Démarrage rapide: Installation"
description: "Apprenez à installer et configurer le plugin opencode-supermemory. Donnez à votre Agent une mémoire persistante pour mémoriser l'architecture du projet."
order: 1
---

# Démarrage rapide

Ce chapitre vous guide depuis zéro pour installer et configurer le plugin opencode-supermemory, donnant à votre OpenCode Agent la capacité de mémoire persistante. À la fin de ce chapitre, l'Agent sera capable de mémoriser l'architecture du projet et vos préférences.

## Contenu du chapitre

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Démarrage rapide : Installation et configuration</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">Installez le plugin, configurez la clé API, résolvez les conflits de plugins, et connectez l'Agent à la banque de mémoire cloud.</p>
</a>

<a href="./initialization/" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Initialisation du projet : Créer une première impression</h3>
  <p class="text-sm text-neutral-600 dark:text-neutral-400">Utilisez la commande /supermemory-init pour permettre à l'Agent d'analyser en profondeur le dépôt de code et de mémoriser automatiquement l'architecture et les conventions du projet.</p>
</a>

</div>

## Parcours d'apprentissage

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│   1. Démarrage rapide      2. Initialisation du projet            │
│   ─────────────   →   ─────────────                             │
│   Installer le plugin     Laisser l'Agent mémoriser                │
│   Configurer la clé API   l'architecture du projet                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Recommandé de suivre l'ordre** :

1. **[Démarrage rapide](./getting-started/)** : Complétez d'abord l'installation du plugin et la configuration de la clé API, c'est la condition préalable à toutes les fonctionnalités.
2. **[Initialisation du projet](./initialization/)** : Une fois l'installation terminée, exécutez la commande d'initialisation pour que l'Agent se familiarise avec votre projet.

## Conditions préalables

Avant de commencer ce chapitre, assurez-vous que :

- ✅ [OpenCode](https://opencode.ai) est installé et que la commande `opencode` est disponible dans le terminal
- ✅ Vous avez enregistré un compte [Supermemory](https://console.supermemory.ai) et obtenu une clé API

## Étapes suivantes

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :

- **[Fonctionnalités principales](../core/)** : Comprenez en profondeur le mécanisme d'injection de contexte, l'utilisation de l'ensemble d'outils et la gestion de la mémoire
- **[Configuration avancée](../advanced/)** : Personnalisez les seuils de compactage, les règles de déclenchement par mots-clés et autres paramètres avancés
