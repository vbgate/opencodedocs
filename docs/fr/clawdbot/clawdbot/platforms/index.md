---
title: "Multicanal et Plateformes | Tutoriel Clawdbot"
sidebarTitle: "Intégration d'outils de chat courants"
subtitle: "Multicanal et Plateformes"
description: "Apprenez à configurer et utiliser le système multicanal de Clawdbot, incluant WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE, WebChat, macOS, iOS et les plateformes Android."
tags:
  - "channels"
  - "platforms"
  - "integration"
order: 60
---

# Multicanal et Plateformes

Clawdbot prend en charge plusieurs canaux de communication et plateformes via le plan de contrôle unifié de la Gateway, vous permettant d'interagir avec votre assistant AI sur des interfaces familières.

## Vue d'ensemble du chapitre

Ce chapitre présente tous les canaux de communication et plateformes pris en charge par Clawdbot, incluant les applications de messagerie instantanée (WhatsApp, Telegram, Slack, Discord, etc.), les nœuds mobiles (iOS, Android) et les applications de bureau (macOS). Apprenez à configurer ces canaux pour intégrer de manière transparente l'assistant AI dans votre flux de travail quotidien.

## Navigation des sous-pages

### Vue d'ensemble des canaux

- **[Vue d'ensemble du système multicanal](channels-overview/)** - Découvrez tous les canaux de communication pris en charge par Clawdbot et leurs caractéristiques, et maîtrisez les concepts de base de configuration des canaux.

### Canaux de messagerie instantanée

- **[WhatsApp](whatsapp/)** - Configurer et utiliser le canal WhatsApp (basé sur Baileys), prenant en charge la liaison de périphérique et la gestion de groupes.
- **[Telegram](telegram/)** - Configurer et utiliser le canal Telegram (basé sur grammY Bot API), configurer le Bot Token et le Webhook.
- **[Slack](slack/)** - Configurer et utiliser le canal Slack (basé sur Bolt), intégré à votre espace de travail.
- **[Discord](discord/)** - Configurer et utiliser le canal Discord (basé sur discord.js), prenant en charge les serveurs et les salons.
- **[Google Chat](googlechat/)** - Configurer et utiliser le canal Google Chat, intégré avec Google Workspace.
- **[Signal](signal/)** - Configurer et utiliser le canal Signal (basé sur signal-cli), pour une communication privée.
- **[iMessage](imessage/)** - Configurer et utiliser le canal iMessage (exclusif à macOS), intégré à l'application Messages de macOS.
- **[LINE](line/)** - Configurer et utiliser le canal LINE (Messaging API), pour interagir avec les utilisateurs LINE.

### Web et applications natives

- **[Interface WebChat](webchat/)** - Utiliser l'interface WebChat intégrée pour interagir avec l'assistant AI, sans configuration de canal externe requise.
- **[Application macOS](macos-app/)** - Découvrez les fonctionnalités de l'application dans la barre de menus macOS, incluant Voice Wake, Talk Mode et le contrôle à distance.
- **[Nœud iOS](ios-node/)** - Configurer le nœud iOS pour exécuter des opérations locales sur l'appareil (Camera, Canvas, Voice Wake).
- **[Nœud Android](android-node/)** - Configurer le nœud Android pour exécuter des opérations locales sur l'appareil (Camera, Canvas).

## Suggestions de parcours d'apprentissage

Selon votre scénario d'utilisation, nous recommandons l'ordre d'apprentissage suivant :

### Démarrage rapide pour débutants

Si vous utilisez Clawdbot pour la première fois, nous vous recommandons d'apprendre dans l'ordre suivant :

1. **[Vue d'ensemble du système multicanal](channels-overview/)** - Comprenez d'abord l'architecture globale et les concepts de canaux
2. **[Interface WebChat](webchat/)** - La méthode la plus simple, commencez à utiliser sans aucune configuration
3. **Choisir un canal courant** - Sélectionnez en fonction de vos habitudes quotidiennes :
   - Chat quotidien → [WhatsApp](whatsapp/) ou [Telegram](telegram/)
   - Collaboration d'équipe → [Slack](slack/) ou [Discord](discord/)
   - Utilisateurs macOS → [iMessage](imessage/)

### Intégration mobile

Si vous souhaitez utiliser Clawdbot sur votre téléphone mobile :

1. **[Nœud iOS](ios-node/)** - Configurez les fonctionnalités locales sur iPhone/iPad
2. **[Nœud Android](android-node/)** - Configurez les fonctionnalités locales sur les appareils Android
3. **[Application macOS](macos-app/)** - Utilisez l'application macOS comme centre de contrôle

### Déploiement de niveau entreprise

Si vous devez déployer dans un environnement d'équipe :

1. **[Slack](slack/)** - Intégrer avec les espaces de travail de l'équipe
2. **[Discord](discord/)** - Établir un serveur communautaire
3. **[Google Chat](googlechat/)** - Intégrer avec Google Workspace

## Conditions préalables

Avant de commencer l'apprentissage de ce chapitre, il est recommandé de terminer :

- **[Démarrage rapide](../start/getting-started/)** - Compléter l'installation et la configuration de base de Clawdbot
- **[Assistant de configuration](../start/onboarding-wizard/)** - Effectuer la configuration de base de la Gateway et des canaux via l'assistant

::: tip Indication
Si vous avez déjà terminé l'assistant de configuration, certains canaux peuvent déjà être configurés automatiquement. Vous pouvez sauter les étapes de configuration répétitives et consulter directement les fonctionnalités avancées des canaux spécifiques.
:::

## Prochaines étapes

Après avoir terminé l'apprentissage de ce chapitre, vous pouvez continuer à explorer :

- **[Configuration des modèles AI et de l'authentification](../advanced/models-auth/)** - Configurer différents fournisseurs de modèles AI
- **[Gestion de session et multi Agent](../advanced/session-management/)** - Apprendre l'isolation des sessions et la collaboration des sous-agents
- **[Système d'outils](../advanced/tools-browser/)** - Utiliser l'automatisation du navigateur, l'exécution de commandes et d'autres outils

## Questions fréquentes

::: details Puis-je utiliser plusieurs canaux simultanément ?
Oui ! Clawdbot prend en charge l'activation simultanée de plusieurs canaux. Vous pouvez recevoir et envoyer des messages sur différents canaux, et tous les messages sont traités via la Gateway unifiée.
:::

::: details Quel canal est recommandé ?
Cela dépend de votre scénario d'utilisation :
- **WebChat** - Le plus simple, sans aucune configuration requise
- **WhatsApp** - Adapté pour chatter avec vos amis et famille
- **Telegram** - API Bot stable, adaptée pour les réponses automatiques
- **Slack/Discord** - Adapté pour la collaboration d'équipe
:::

::: details La configuration des canaux nécessite-t-elle un paiement ?
La plupart des canaux sont gratuits, mais certains peuvent entraîner des coûts :
- WhatsApp Business API - Peut entraîner des frais
- Google Chat - Nécessite un compte Google Workspace
- Autres canaux - Généralement gratuits, il suffit de demander un Bot Token
:::
