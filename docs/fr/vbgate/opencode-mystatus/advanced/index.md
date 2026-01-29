---
title: "Fonctions avancées | opencode-mystatus"
sidebarTitle: "Fonctionnalités avancées"
subtitle: "Fonctionnalités avancées"
description: "Découvrez les options de configuration avancées d'opencode-mystatus. Configurez Google Cloud, Copilot et le support multilingue pour une utilisation personnalisée."
order: 3
---

# Fonctionnalités avancées

Ce chapitre présente les options de configuration avancées d'opencode-mystatus, adaptées aux utilisateurs nécessitant plus de personnalisation.

## Liste des fonctionnalités

### [Configuration Google Cloud](./google-setup/)

Configurez et gérez plusieurs comptes Google Cloud Antigravity :

- Ajouter plusieurs comptes Google Cloud
- Relations de mappage de 4 modèles (G3 Pro, G3 Image, G3 Flash, Claude)
- Différences entre projectId et managedProjectId
- Résoudre les problèmes de quotas insuffisants pour un compte

### [Configuration de l'authentification Copilot](./copilot-auth/)

Résolvez les problèmes d'authentification GitHub Copilot :

- Différences entre OAuth Token et Fine-grained PAT
- Résoudre les problèmes de permissions insuffisantes du OAuth Token
- Créer un Fine-grained PAT et configurer le type d'abonnement
- Configurer le fichier `copilot-quota-token.json`

### [Support multilingue](./i18n-setup/)

Comprenez le mécanisme de détection automatique de langue :

- Principes de détection automatique de la langue système
- Mécanisme de repli sur les variables d'environnement et l'API Intl
- Comment basculer la langue de sortie (chinois/anglais)

## Scénarios d'utilisation

| Scénario | Tutoriel recommandé |
|--- | ---|
| Utiliser plusieurs comptes Google | [Configuration Google Cloud](./google-setup/) |
| Échec de la consultation des quotas Copilot | [Configuration de l'authentification Copilot](./copilot-auth/) |
| Changer la langue de sortie | [Support multilingue](./i18n-setup/) |

## Conditions préalables

Avant d'étudier ce chapitre, nous recommandons de compléter :

- [Démarrage rapide](../start/) - Compléter l'installation du plugin
- [Fonctionnalités de plateforme](../platforms/) - Comprendre l'utilisation de base de chaque plateforme

## Étapes suivantes

En cas de problème, consultez [Questions fréquentes](../faq/) pour obtenir de l'aide.
