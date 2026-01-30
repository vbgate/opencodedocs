---
title: "Fonctionnalités clés : trois capacités principales | opencode-dcp"
sidebarTitle: "Débloquer les trois capacités"
subtitle: "Fonctionnalités clés : trois capacités principales"
description: "Découvrez les trois fonctionnalités principales d'opencode-dcp : stratégie d'élagage automatique, outils pilotés par LLM et commandes Slash. Maîtrisez ces fonctionnalités pour exploiter pleinement le potentiel d'optimisation des tokens."
order: 20
---

# Fonctionnalités clés

Ce chapitre explore en profondeur les trois capacités principales de DCP : la stratégie d'élagage automatique, les outils pilotés par LLM et les commandes Slash. Après avoir maîtrisé ces fonctionnalités, vous pourrez exploiter pleinement le potentiel d'optimisation des tokens de DCP.

## Contenu du chapitre

<div class="grid-cards">

### [Stratégie d'élagage automatique](./auto-pruning/)

Comprendre en profondeur le fonctionnement des trois stratégies automatiques de DCP : la stratégie de déduplication, la stratégie de réécriture et la stratégie de nettoyage des erreurs. Découvrez les conditions de déclenchement et les scénarios d'application de chaque stratégie.

### [Outils d'élagage pilotés par LLM](./llm-tools/)

Comprendre comment l'IA appelle de manière autonome les outils `discard` et `extract` pour optimiser le contexte. C'est la fonctionnalité la plus intelligente de DCP, permettant à l'IA de participer activement à la gestion du contexte.

### [Utilisation des commandes Slash](./commands/)

Maîtriser l'utilisation de toutes les commandes DCP : `/dcp context` pour consulter l'état du contexte, `/dcp stats` pour consulter les statistiques, `/dcp sweep` pour déclencher manuellement l'élagage.

</div>

## Parcours d'apprentissage

Nous vous recommandons d'étudier ce chapitre dans l'ordre suivant :

```
Stratégie d'élagage automatique → Outils pilotés par LLM → Commandes Slash
           ↓                           ↓                      ↓
    Comprendre les principes     Maîtriser l'élagage intelligent   Apprendre à surveiller et déboguer
```

1. **Commencez par la stratégie d'élagage automatique** : c'est la base de DCP, comprendre le fonctionnement des trois stratégies
2. **Puis apprenez les outils pilotés par LLM** : après avoir compris les stratégies automatiques, apprenez les capacités avancées d'élagage proactif par l'IA
3. **Enfin, apprenez les commandes Slash** : maîtrisez les méthodes de surveillance et de contrôle manuel, utiles pour le débogage et l'optimisation

::: tip Prérequis
Avant d'étudier ce chapitre, assurez-vous d'avoir terminé :
- [Installation et démarrage rapide](../start/getting-started/) - Installation du plugin DCP
- [Configuration complète](../start/configuration/) - Comprendre les concepts de base du système de configuration
:::

## Prochaines étapes

Après avoir terminé ce chapitre, vous pouvez continuer à explorer :

- **[Mécanismes de protection](../advanced/protection/)** - Apprendre comment protéger le contenu critique contre un élagage incorrect
- **[Persistance de l'état](../advanced/state-persistence/)** - Comprendre comment DCP conserve l'état entre les sessions
- **[Impact du cache de prompt](../advanced/prompt-caching/)** - Comprendre les compromis entre DCP et le Prompt Caching
