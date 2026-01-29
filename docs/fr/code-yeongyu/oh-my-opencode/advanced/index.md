---
title: "Avancé : Workflows IA | oh-my-opencode"
sidebarTitle: "Travailler en Équipe"
subtitle: "Avancé : Workflows IA"
description: "Maîtrisez l'orchestration avancée des workflows IA dans oh-my-opencode. Apprenez les équipes d'agents, les tâches parallèles, le système Catégories/Compétences, les hooks de cycle de vie et la personnalisation approfondie pour construire des systèmes de développement alimentés par l'IA efficaces."
order: 60
---

# Avancé

Ce chapitre explore en profondeur les fonctionnalités avancées de oh-my-opencode : les équipes professionnelles d'agents IA, les tâches parallèles en arrière-plan, le système Catégories et Compétences, les hooks de cycle de vie, et plus encore. La maîtrise de ces capacités vous permettra d'orchestrer des workflows IA comme gérer une vraie équipe, pour atteindre une expérience de développement plus efficace.

## Contenu du Chapitre

<div class="grid-cards">

### [Équipes d'Agents IA : Vue d'Ensemble des 10 Experts](./ai-agents-overview/)

Introduction complète aux fonctionnalités, cas d'utilisation et méthodes d'appel des 10 agents intégrés. Apprenez à sélectionner le bon agent en fonction du type de tâche, permettant une collaboration d'équipe efficace, l'exécution parallèle de tâches et une analyse approfondie du code.

### [Planification Prometheus : Recueil des Exigences par Entretien](./prometheus-planning/)

Clarifiez les exigences et générez des plans de travail via le mode entretien. Prometheus continuera à poser des questions jusqu'à ce que les exigences soient claires, et consulte automatiquement Oracle, Metis et Momus pour vérifier la qualité du plan.

### [Tâches Parallèles en Arrière-plan : Travailler en Équipe](./background-tasks/)

Explication approfondie de l'utilisation du système de gestion des agents en arrière-plan. Apprenez le contrôle de la concurrence, le polling des tâches et la récupération des résultats, permettant à plusieurs agents IA de gérer différentes tâches simultanément, améliorant considérablement l'efficacité du travail.

### [LSP et AST-Grep : Outils de Refactoring de Code](./lsp-ast-tools/)

Introduction à l'utilisation des outils LSP et AST-Grep. Démontrez comment implémenter l'analyse et les opérations de code de niveau IDE, y compris la navigation des symboles, la recherche de références et la recherche de code structurée.

### [Catégories et Compétences : Composition Dynamique d'Agents](./categories-skills/)

Apprenez à utiliser le système Catégories et Compétences pour créer des sous-agents spécialisés. Implémentez une composition flexible d'agents, assignant dynamiquement des modèles, des outils et des compétences en fonction des exigences de la tâche.

### [Compétences Intégrées : Automatisation du Navigateur et Expert Git](./builtin-skills/)

Introduction détaillée aux cas d'utilisation et meilleures pratiques de trois Compétences intégrées (playwright, frontend-ui-ux, git-master). Accédez rapidement à des capacités professionnelles comme l'automatisation du navigateur, la conception UI frontend et les opérations Git.

### [Hooks de Cycle de Vie : Automatisation du Contexte et Contrôle de Qualité](./lifecycle-hooks/)

Introduction à l'utilisation de 32 hooks de cycle de vie. Comprenez comment automatiser l'injection de contexte, la récupération d'erreurs et le contrôle de qualité, construisant un système complet d'automatisation de workflow IA.

### [Commandes Slash : Workflows Prédéfinis](./slash-commands/)

Introduction à l'utilisation de 6 commandes slash intégrées. Y compris /ralph-loop (boucle de correction rapide), /refactor (refactoring de code), /start-work (démarrage de l'exécution de projet) et autres workflows courants.

### [Personnalisation Approfondie de la Configuration : Gestion des Agents et Permissions](./advanced-configuration/)

Enseignez aux utilisateurs la personnalisation approfondie de la configuration des agents, des paramètres de permissions, des remplacements de modèles et des modifications de prompts. Maîtrisez les capacités de configuration complètes, créant des workflows IA alignés avec les standards de l'équipe.

</div>

## Parcours d'Apprentissage

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Étape 1                  Étape 2                     Étape 3                          Étape 4                  │
│  Comprendre les Agents  →   Maîtriser la     →   Apprendre la Composition   →   Personnalisation          │
│  IA (Concepts de Base)      Planification          Dynamique d'Agents           Approfondie                │
│                             et Tâches Parallèles   (Utilisation Avancée)      (Niveau Expert)            │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Séquence Recommandée** :

1. **Commencez par les Équipes d'Agents IA** : Comprenez les responsabilités et cas d'utilisation des 10 agents — c'est la pierre angulaire pour comprendre tout le système.
2. **Ensuite Apprenez la Planification et les Tâches Parallèles** : Maîtrisez la planification Prometheus et le système de tâches en arrière-plan — c'est le cœur de la collaboration efficace.
3. **Ensuite Apprenez la Composition Dynamique d'Agents** : Apprenez les Catégories et Compétences pour atteindre une spécialisation flexible des agents.
4. **Enfin Apprenez la Personnalisation Approfondie** : Maîtrisez les hooks de cycle de vie, les commandes slash et la personnalisation de la configuration pour construire des workflows complets.

**Parcours Avancés** :
- Si votre objectif est le **démarrage rapide** : Concentrez-vous sur "Équipes d'Agents IA" et "Commandes Slash"
- Si votre objectif est la **collaboration d'équipe** : Plongez profondément dans "Planification Prometheus" et "Tâches Parallèles en Arrière-plan"
- Si votre objectif est l'**automatisation des workflows** : Apprenez "Hooks de Cycle de Vie" et "Personnalisation Approfondie de la Configuration"

## Prérequis

::: warning Avant de Commencer
Ce chapitre suppose que vous avez terminé :

- ✅ [Installation et Configuration Rapide](../start/installation/) : Installation de oh-my-opencode et configuration d'au moins un Provider
- ✅ [Premier Regard sur Sisyphus : Orchestrateur Principal](../start/sisyphus-orchestrator/) : Compréhension des mécanismes d'appel et de délégation de base des agents
- ✅ [Configuration de Provider : Claude, OpenAI, Gemini](../platforms/provider-setup/) : Configuration d'au moins un Provider IA
:::

## Prochaines Étapes

Après avoir terminé ce chapitre, nous recommandons de continuer avec :

- **[Diagnostics de Configuration et Dépannage](../faq/troubleshooting/)** : Localisez et résolvez rapidement les problèmes lorsqu'ils surviennent.
- **[Référence de Configuration](../appendix/configuration-reference/)** : Consultez le schéma complet du fichier de configuration et comprenez toutes les options de configuration.
- **[Compatibilité Claude Code](../appendix/claude-code-compatibility/)** : Apprenez à migrer les workflows Claude Code existants vers oh-my-opencode.
