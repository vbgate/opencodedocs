---
title: "Annexe opencode-notify : Référence complète des types d'événements et de la configuration | Tutoriel"
sidebarTitle: "Consulter la configuration et les événements"
subtitle: "Annexe : Types d'événements et référence de configuration"
description: "Consultez les descriptions des types d'événements du plugin opencode-notify et des exemples de fichiers de configuration. Ce tutoriel liste les quatre types d'événements OpenCode et leurs conditions de déclenchement, détaille les règles de filtrage et les différences entre plateformes pour chaque événement, et fournit un modèle de fichier de configuration complet avec des annotations détaillées pour tous les champs, les valeurs par défaut, un exemple de configuration minimale, la méthode pour désactiver le plugin et une liste complète des sons disponibles sur macOS."
order: 5
---

# Annexe : Types d'événements et référence de configuration

Ce chapitre fournit de la documentation de référence et des exemples de configuration pour vous aider à comprendre en profondeur les types d'événements et les options de configuration d'opencode-notify. Ce contenu convient comme matériel de référence et n'a pas besoin d'être étudié dans l'ordre.

## Parcours d'apprentissage

### 1. [Description des types d'événements](./event-types/)

Découvrez les types d'événements OpenCode écoutés par le plugin et leurs conditions de déclenchement.

- Quatre types d'événements (session.idle, session.error, permission.updated, tool.execute.before)
- Le moment de déclenchement et la logique de traitement pour chaque événement
- Règles de filtrage pour la vérification des sessions parentes, la vérification des heures de silence et la vérification du focus du terminal
- Différences de fonctionnalités entre les différentes plateformes

### 2. [Exemple de fichier de configuration](./config-file-example/)

Consultez un exemple de fichier de configuration complet et des annotations détaillées pour tous les champs.

- Modèle de fichier de configuration complet
- Description des champs tels que notifyChildSessions, sounds, quietHours, terminal
- Liste complète des sons disponibles sur macOS
- Exemple de configuration minimale
- Méthode pour désactiver le plugin

## Prérequis

::: tip Conseil d'apprentissage

Ce chapitre est une documentation de référence qui peut être consultée en cas de besoin. Il est recommandé de consulter le contenu de ce chapitre après avoir terminé les tutoriels de base suivants :

- [Démarrage rapide](../../start/quick-start/) - Complétez l'installation et la configuration initiale
- [Comment cela fonctionne](../../start/how-it-works/) - Comprenez les mécanismes de base du plugin

:::

## Prochaines étapes

Après avoir terminé l'apprentissage de l'annexe, vous pouvez :

- Consulter le [Journal des modifications](../changelog/release-notes/) pour connaître l'historique des versions et les nouvelles fonctionnalités
- Retourner à la [Référence de configuration](../../advanced/config-reference/) pour approfondir l'étude des options de configuration avancées
- Parcourir la [FAQ](../../faq/common-questions/) pour trouver des réponses
