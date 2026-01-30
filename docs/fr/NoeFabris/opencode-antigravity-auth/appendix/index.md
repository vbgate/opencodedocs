---
title: "Annexe : Références Techniques | Antigravity Auth"
sidebarTitle: "Comprendre en Profondeur le Principe du Plugin"
subtitle: "Annexe : Architecture, API et Références Techniques de Configuration"
description: "Découvrez les références techniques du plugin Antigravity Auth, y compris la conception architecturale, les spécifications API, les formats de stockage et les options de configuration complètes pour une compréhension approfondie des mécanismes internes du plugin."
order: 5
---

# Annexe

Ce chapitre fournit des références techniques pour le plugin Antigravity Auth, y compris la conception architecturale, les spécifications API, les formats de stockage et le manuel de configuration complet, pour vous aider à comprendre en profondeur les mécanismes internes du plugin.

## Parcours d'Apprentissage

### 1. [Vue d'Ensemble de l'Architecture](./architecture-overview/)

Découvrez la structure modulaire du plugin et le flux de traitement des requêtes.

- Conception de la stratification modulaire et répartition des responsabilités
- Chaîne complète des requêtes d'OpenCode vers l'API Antigravity
- Équilibrage de charge multi-comptes et mécanisme de récupération de session

### 2. [Spécifications API](./api-spec/)

Approfondissez vos connaissances des détails techniques de l'API Antigravity.

- Interface de passerelle unifiée et configuration des points de terminaison
- Formats de requête/réponse et limitations du schéma JSON
- Configuration du modèle Thinking et règles d'appel de fonctions

### 3. [Format de Stockage](./storage-schema/)

Découvrez la structure des fichiers de stockage de comptes et la gestion des versions.

- Emplacement des fichiers de stockage et signification des champs
- Évolution des versions v1/v2/v3 et migration automatique
- Méthodes de migration de configuration de comptes entre machines

### 4. [Options de Configuration Complètes](./all-config-options/)

Manuel de référence complet pour toutes les options de configuration.

- Valeurs par défaut et scénarios d'application pour plus de 30 options de configuration
- Méthodes de remplacement de la configuration par variables d'environnement
- Combinaisons optimales de configuration pour différents scénarios d'utilisation

## Prérequis

::: warning Recommandé à Effectuer en Premier
Le contenu de ce chapitre est orienté vers la profondeur technique. Il est recommandé de compléter les éléments suivants en premier :

- [Installation Rapide](../start/quick-install/) - Effectuez l'installation du plugin et la première authentification
- [Guide de Configuration](../advanced/configuration-guide/) - Découvrez les méthodes de configuration courantes
:::

## Prochaines Étapes

Après avoir terminé l'apprentissage de l'annexe, vous pouvez :

- Consulter la [FAQ](../faq/) pour résoudre les problèmes rencontrés lors de l'utilisation
- Suivre le [Journal des Modifications](../changelog/version-history/) pour connaître les changements de version
- Participer au développement du plugin en contribuant du code ou de la documentation
