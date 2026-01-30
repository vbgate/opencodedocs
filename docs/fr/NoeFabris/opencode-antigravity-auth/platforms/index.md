---
title: "Fonctionnalités de la Plateforme : Modèles et Quotas | opencode-antigravity-auth"
sidebarTitle: "Débloquer le Système Double Quota"
subtitle: "Fonctionnalités de la Plateforme : Modèles et Quotas"
description: "Découvrez les types de modèles et le système de double quota d'Antigravity Auth. Maîtrisez le choix de modèles, la configuration Thinking et la méthode Google Search pour optimiser l'utilisation des quotas."
order: 2
---

# Fonctionnalités de la Plateforme

Ce chapitre vous aide à approfondir votre compréhension des modèles, du système de quotas et des fonctionnalités de la plateforme pris en charge par le plugin Antigravity Auth. Vous apprendrez à choisir le modèle approprié, à configurer les capacités Thinking, à activer Google Search et à maximiser l'utilisation des quotas.

## Prérequis

::: warning Avant de commencer, veuillez confirmer
Avant d'étudier ce chapitre, assurez-vous d'avoir terminé :
- [Installation Rapide](../start/quick-install/) : Effectuer l'installation du plugin et la première authentification
- [Première Requête](../start/first-request/) : Envoyer avec succès la première requête modèle
:::

## Parcours d'Apprentissage

Suivez cet ordre d'apprentissage pour maîtriser progressivement les fonctionnalités de la plateforme :

### 1. [Modèles Disponibles](./available-models/)

Découvrez tous les modèles disponibles et leurs configurations de variantes

- Découvrez Claude Opus 4.5, Sonnet 4.5 et Gemini 3 Pro/Flash
- Comprenez la distribution des modèles dans les deux pools de quotas Antigravity et Gemini CLI
- Maîtrisez l'utilisation du paramètre `--variant`

### 2. [Système Double Quota](./dual-quota-system/)

Comprenez le fonctionnement du système double quota Antigravity et Gemini CLI

- Découvrez comment chaque compte possède deux pools de quotas Gemini indépendants
- Activez la configuration automatique de fallback pour doubler les quotas
- Spécifiez explicitement l'utilisation du pool de quotas pour un modèle donné

### 3. [Google Search Grounding](./google-search-grounding/)

Activez Google Search pour les modèles Gemini afin d'améliorer l'exactitude factuelle

- Permettez à Gemini de rechercher des informations en temps réel sur le Web
- Ajustez le seuil de recherche pour contrôler la fréquence des recherches
- Choisissez la configuration appropriée selon les besoins de la tâche

### 4. [Modèles Thinking](./thinking-models/)

Maîtrisez la configuration et l'utilisation des modèles Thinking Claude et Gemini 3

- Configurez le thinking budget de Claude
- Utilisez les thinking levels de Gemini 3 (minimal/low/medium/high)
- Comprenez la stratégie de conservation des blocs de pensée et interleaved thinking

## Prochaines Étapes

Après avoir terminé ce chapitre, vous pouvez continuer à apprendre :

- [Configuration Multi-Comptes](../advanced/multi-account-setup/) : Configurez plusieurs comptes Google pour réaliser la mise en pool des quotas et l'équilibrage de charge
- [Stratégies de Sélection de Comptes](../advanced/account-selection-strategies/) : Maîtrisez les meilleures pratiques des trois stratégies sticky, round-robin et hybrid
- [Guide de Configuration](../advanced/configuration-guide/) : Maîtrisez toutes les options de configuration pour personnaliser le comportement du plugin selon vos besoins
