---
title: "Plateformes et Intégrations : Fonctionnalités Terminal pour macOS, Windows, Linux | opencode-notify"
sidebarTitle: "Adapter votre plateforme"
subtitle: "Plateformes et Intégrations"
description: "Apprenez les différences de fonctionnalités d'opencode-notify sur macOS, Windows et Linux, maîtrisez le support terminal (37+ émulateurs), la détection de focus, le clic pour focaliser et les effets sonores personnalisés. Ce chapitre comprend des comparaisons de fonctionnalités par plateforme, des mécanismes de détection terminal et des guides de configuration pour optimiser votre expérience de notification selon votre système d'exploitation et type de terminal."
tags:
  - "Fonctionnalités plateforme"
  - "Support terminal"
  - "Compatibilité système"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 2
---

# Plateformes et Intégrations

Ce chapitre vous aide à comprendre les différences de fonctionnalités d'opencode-notify sur différents systèmes d'exploitation, à maîtriser les configurations spécifiques à chaque plateforme et à faire en sorte que votre terminal offre les meilleures performances.

## Parcours d'apprentissage

### 1. [Fonctionnalités macOS](../macos/)

Obtenez une vision complète des fonctionnalités avancées sur macOS, incluant la détection intelligente de focus, le clic sur notification pour focaliser et les effets sonores personnalisés.

- Détection de focus : Déterminer automatiquement si le terminal est la fenêtre active
- Clic pour focaliser : Passer automatiquement au terminal après avoir cliqué sur une notification
- Effets sonores personnalisés : Configurer des sons exclusifs pour différents événements
- Support de 37+ terminaux : Incluant Ghostty, iTerm2, terminal intégré VS Code, etc.

### 2. [Fonctionnalités Windows](../windows/)

Maîtrisez les bases des notifications et méthodes de configuration sur la plateforme Windows.

- Notifications natives : Utiliser le Centre de notifications Windows 10/11
- Permissions de notification : S'assurer qu'OpenCode a les droits d'envoyer des notifications
- Configuration de base : Emplacement du fichier de configuration dans l'environnement Windows
- Notes sur les limitations : La détection de focus n'est pas prise en charge sous Windows

### 3. [Fonctionnalités Linux](../linux/)

Découvrez les mécanismes de notification sur la plateforme Linux et l'installation des dépendances.

- Intégration libnotify : Utiliser notify-send pour envoyer des notifications
- Support des environnements de bureau : GNOME, KDE Plasma, XFCE et autres environnements populaires
- Installation des dépendances : Commandes d'installation pour différentes distributions
- Notes sur les limitations : La détection de focus n'est pas prise en charge sous Linux

### 4. [Terminaux pris en charge](../terminals/)

Consultez les 37+ émulateurs de terminal pris en charge et comprenez le mécanisme de détection automatique.

- Détection de terminal : Comment identifier automatiquement votre type de terminal
- Liste des terminaux : Inventaire complet des terminaux pris en charge
- Configuration manuelle : Comment spécifier manuellement quand la détection automatique échoue
- Terminaux spéciaux : Gestion des terminaux intégrés VS Code et des sessions SSH distantes

## Prérequis

::: warning Avant d'étudier ce chapitre, veuillez vous assurer d'avoir complété

- ✅ **[Démarrage rapide](../../start/quick-start/)** : Installation d'opencode-notify terminée
- ✅ **[Comment ça marche](../../start/how-it-works/)** : Compréhension des quatre types de notification et du mécanisme de filtrage intelligent

:::

## Recommandations de choix de plateforme

Choisissez le chapitre correspondant selon votre système d'exploitation :

| Système d'exploitation | Ordre d'apprentissage recommandé | Fonctionnalités clés |
|---|---|---|
| **macOS** | 1. Fonctionnalités macOS → 4. Terminaux pris en charge | Détection de focus, clic pour focaliser, effets sonores personnalisés |
| **Windows** | 2. Fonctionnalités Windows → 4. Terminaux pris en charge | Notifications natives, configuration de base |
| **Linux** | 3. Fonctionnalités Linux → 4. Terminaux pris en charge | Intégration libnotify, installation des dépendances |

::: tip Conseil général
Quelle que soit la plateforme utilisée, la leçon 4 « Terminaux pris en charge » vaut la peine d'être étudiée. Elle vous aidera à comprendre le mécanisme de détection des terminaux et à résoudre les problèmes de configuration.
:::

## Tableau comparatif des fonctionnalités

| Fonctionnalité | macOS | Windows | Linux |
|---|---|---|---|
| Notifications natives | ✅ | ✅ | ✅ |
| Détection de focus du terminal | ✅ | ❌ | ❌ |
| Clic sur notification pour focaliser | ✅ | ❌ | ❌ |
| Effets sonores personnalisés | ✅ | ✅ | ✅ (partiel) |
| Périodes de silence | ✅ | ✅ | ✅ |
| Vérification de session parent | ✅ | ✅ | ✅ |
| Support de 37+ terminaux | ✅ | ✅ | ✅ |
| Détection automatique de terminal | ✅ | ✅ | ✅ |

## Prochaines étapes

Après avoir terminé ce chapitre, vous comprendrez les différences de fonctionnalités entre les plateformes et les méthodes de configuration.

Il est recommandé de poursuivre avec :

### [Configuration avancée](../../advanced/config-reference/)

Approfondissez l'étude de toutes les options de configuration et maîtrisez les techniques de configuration avancée.

- Référence complète de la configuration : description détaillée de tous les paramètres
- Explication approfondie des périodes de silence : comment les configurer et leur fonctionnement
- Principe de détection des terminaux : mécanisme interne de la détection automatique
- Utilisations avancées : techniques de configuration et bonnes pratiques

### [Dépannage](../../faq/troubleshooting/)

Consultez les solutions aux problèmes courants lorsque vous rencontrez des difficultés.

- Notifications qui ne s'affichent pas : problèmes de permissions et de paramètres système
- Échec de la détection de focus : configuration du terminal et mécanisme de détection
- Erreurs de configuration : format du fichier de configuration et description des champs
- Problèmes de son : configuration des sons et compatibilité système

::: info Recommandation de parcours d'apprentissage
Si vous débutez, il est conseillé de suivre l'ordre **Chapitres sur les plateformes → Configuration avancée → Dépannage**. Si vous rencontrez un problème spécifique, vous pouvez accéder directement au chapitre Dépannage.
:::
