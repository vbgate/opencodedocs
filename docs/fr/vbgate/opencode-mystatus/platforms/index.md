---
title: "Plateformes IA: Consultation des quotas | opencode-mystatus"
sidebarTitle: "Plateformes"
subtitle: "Plateformes IA: Consultation des quotas"
description: "Découvrez les fonctionnalités de consultation des quotas pour les 4 plateformes IA prises en charge: OpenAI, Zhipu AI, GitHub Copilot et Google Cloud."
order: 2
---

# Fonctionnalités de plateforme

Ce chapitre détaille en profondeur les fonctionnalités de consultation des quotas de chaque plateforme IA prise en charge par opencode-mystatus.

## Plateformes prises en charge

opencode-mystatus prend en charge les 4 plateformes IA principales suivantes :

| Plateforme | Type de limite | Caractéristiques |
| ---------- | ------------- | --------------- |
| OpenAI | Fenêtre glissante de 3h / 24h | Prend en charge les abonnements Plus, Team, Pro |
| Zhipu AI | Limite de token sur 5h / Quota mensuel MCP | Prend en charge le Coding Plan |
| GitHub Copilot | Quota mensuel | Affiche l'utilisation des Premium Requests |
| Google Cloud | Calculé par modèle | Prend en charge les comptes multiples, 4 modèles |

## Détails des plateformes

### [Quota OpenAI](./openai-usage/)

Approfondissez le mécanisme de consultation des quotas OpenAI :

- Différences entre les fenêtres glissantes de 3h et 24h
- Mécanisme de partage de quota pour les comptes Team
- Analyse du jeton JWT pour obtenir les informations du compte

### [Quota Zhipu AI](./zhipu-usage/)

Apprenez la consultation des quotas de Zhipu AI et Z.ai :

- Méthode de calcul de la limite de token sur 5h
- Utilisation du quota mensuel MCP
- Masquage de l'affichage de la clé API

### [Quota GitHub Copilot](./copilot-usage/)

Maîtrisez la gestion des quotas GitHub Copilot :

- Signification des Premium Requests
- Différences de quota selon le type d'abonnement
- Calcul du temps de réinitialisation mensuelle

### [Quota Google Cloud](./google-usage/)

Apprenez la consultation multi-comptes des quotas Google Cloud :

- Différences entre les 4 modèles (G3 Pro, G3 Image, G3 Flash, Claude)
- Gestion et commutation multi-comptes
- Mécanisme de lecture du fichier d'authentification

## Guide de sélection

Choisissez le tutoriel correspondant selon la plateforme que vous utilisez :

- **OpenAI uniquement** : Consultez directement [Quota OpenAI](./openai-usage/)
- **Zhipu AI uniquement** : Consultez directement [Quota Zhipu AI](./zhipu-usage/)
- **Utilisateur multi-plateforme** : Nous recommandons de lire tous les tutoriels de plateforme dans l'ordre
- **Utilisateur Google Cloud** : Vous devez d'abord installer le plugin [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)

## Étapes suivantes

Après avoir terminé ce chapitre, vous pouvez continuer avec [Fonctionnalités avancées](../advanced/) pour en savoir plus sur les options de configuration.
