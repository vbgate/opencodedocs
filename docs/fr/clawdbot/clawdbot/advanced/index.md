---
title: "Fonctions avancées"
sidebarTitle: "Débloquer les superpouvoirs de l'IA"
subtitle: "Fonctions avancées"
description: "Découvrez la configuration des fonctions avancées de Clawdbot, incluant la configuration des modèles IA, la collaboration multi-Agents, l'automatisation de navigateur, les outils d'exécution de commandes, les outils de recherche Web, l'interface visuelle Canvas, le réveil vocal et TTS, le système de mémoire, les tâches planifiées Cron, la plateforme de compétences, le bac à sable sécurisé et la passerelle distante."
prerequisite:
  - "start/getting-started"
  - "start/gateway-startup"
order: 185
---

# Fonctions avancées

## Vue d'ensemble du chapitre

Ce chapitre présente en profondeur les fonctions avancées de Clawdbot, vous aidant à tirer pleinement parti des puissantes capacités de votre assistant IA. De la configuration des modèles IA et de la collaboration multi-Agents à l'automatisation de navigateur, au système de mémoire et aux fonctions vocales, vous pouvez choisir d'apprendre en fonction de vos besoins.

::: info Prérequis
Avant de commencer ce chapitre, veuillez d'abord terminer le contenu suivant :
- [Démarrage rapide](../../start/getting-started/)
- [Lancement de Gateway](../../start/gateway-startup/)
:::

## Parcours d'apprentissage

En fonction de vos besoins, vous pouvez choisir différents parcours d'apprentissage :

### 🚀 Parcours de démarrage rapide (recommandé aux débutants)
1. [Configuration des modèles IA et de l'authentification](./models-auth/) - Configurez vos modèles IA préférés
2. [Outils d'exécution de commandes et approbation](./tools-exec/) - Permettez à l'IA d'exécuter des commandes en toute sécurité
3. [Outils de recherche et de récupération Web](./tools-web/) - Étendez les capacités d'acquisition de connaissances de l'IA

### 🤖 Parcours d'extension des capacités IA
1. [Gestion de sessions et multi-Agents](./session-management/) - Comprenez les mécanismes de collaboration IA
2. [Système de mémoire et recherche vectorielle](./memory-system/) - Permettez à l'IA de mémoriser des informations importantes
3. [Plateforme de compétences et ClawdHub](./skills-platform/) - Utilisez et partagez des packs de compétences

### 🔧 Parcours d'outils d'automatisation
1. [Outils d'automatisation de navigateur](./tools-browser/) - Automatisation des opérations Web
2. [Tâches planifiées Cron et Webhook](./cron-automation/) - Tâches planifiées et déclenchement d'événements
3. [Passerelle distante et Tailscale](./remote-gateway/) - Accès à distance à votre assistant IA

### 🎨 Parcours d'expérience d'interaction
1. [Interface visuelle Canvas et A2UI](./canvas/) - Interface d'interaction visuelle
2. [Réveil vocal et synthèse vocale](./voice-tts/) - Fonctions d'interaction vocale

### 🔒 Parcours de sécurité et de déploiement
1. [Sécurité et isolation bac à sable](./security-sandbox/) - Comprenez en profondeur les mécanismes de sécurité
2. [Passerelle distante et Tailscale](./remote-gateway/) - Accès à distance sécurisé

## Navigation des sous-pages

### Configuration de base

| Sujet | Description | Durée estimée |
|-------|-------------|---------------|
| [Configuration des modèles IA et de l'authentification](./models-auth/) | Configurez divers fournisseurs de modèles IA et méthodes d'authentification tels que Anthropic, OpenAI, OpenRouter, Ollama, etc. | 15 minutes |
| [Gestion de sessions et multi-Agents](./session-management/) | Apprenez les concepts de base tels que le modèle de session, l'isolation de session, la collaboration de sous-Agents, la compression de contexte, etc. | 20 minutes |

### Système d'outils

| Sujet | Description | Durée estimée |
|-------|-------------|---------------|
| [Outils d'automatisation de navigateur](./tools-browser/) | Utilisez les outils de navigateur pour l'automatisation Web, les captures d'écran, les opérations de formulaire, etc. | 25 minutes |
| [Outils d'exécution de commandes et approbation](./tools-exec/) | Configurez et utilisez l'outil exec, comprenez le mécanisme d'approbation de sécurité et le contrôle des permissions | 15 minutes |
| [Outils de recherche et de récupération Web](./tools-web/) | Utilisez les outils web_search et web_fetch pour la recherche Web et la récupération de contenu | 20 minutes |

### Expérience d'interaction

| Sujet | Description | Durée estimée |
|-------|-------------|---------------|
| [Interface visuelle Canvas et A2UI](./canvas/) | Comprenez le mécanisme de push Canvas A2UI, les opérations d'interface visuelle et l'interface personnalisée | 20 minutes |
| [Réveil vocal et synthèse vocale](./voice-tts/) | Configurez Voice Wake, Talk Mode et les fournisseurs TTS pour réaliser l'interaction vocale | 15 minutes |

### Extension intelligente

| Sujet | Description | Durée estimée |
|-------|-------------|---------------|
| [Système de mémoire et recherche vectorielle](./memory-system/) | Configurez et utilisez le système de mémoire (SQLite-vec, FTS5, recherche hybride) | 25 minutes |
| [Plateforme de compétences et ClawdHub](./skills-platform/) | Comprenez le système de compétences, les compétences Bundled/Managed/Workspace et l'intégration ClawdHub | 20 minutes |

### Automatisation et déploiement

| Sujet | Description | Durée estimée |
|-------|-------------|---------------|
| [Tâches planifiées Cron et Webhook](./cron-automation/) | Configurez les tâches planifiées, le déclenchement Webhook, Gmail Pub/Sub et d'autres fonctions d'automatisation | 20 minutes |
| [Passerelle distante et Tailscale](./remote-gateway/) | Accès distant à Gateway via Tailscale Serve/Funnel ou tunnel SSH | 15 minutes |

### Mécanismes de sécurité

| Sujet | Description | Durée estimée |
|-------|-------------|---------------|
| [Sécurité et isolation bac à sable](./security-sandbox/) | Comprenez le modèle de sécurité, le contrôle des permissions d'outils, l'isolement bac à sable, le déploiement Dockerisé | 20 minutes |

## Prochaines étapes

Après avoir terminé l'apprentissage de ce chapitre, vous pouvez :

1. **Apprentissage approfondi** - Consultez [Dépannage](../../faq/troubleshooting/) pour résoudre les problèmes rencontrés
2. **Comprendre le déploiement** - Consultez [Options de déploiement](../../appendix/deployment/) pour déployer Clawdbot en environnement de production
3. **Développer des extensions** - Consultez [Guide de développement](../../appendix/development/) pour apprendre comment développer des plugins et contribuer au code
4. **Consulter la configuration** - Référez-vous à [Référence de configuration complète](../../appendix/config-reference/) pour connaître toutes les options de configuration

::: tip Conseils d'apprentissage
Nous vous recommandons de choisir un parcours d'apprentissage en fonction de vos besoins réels. Si vous n'êtes pas sûr par où commencer, vous pouvez suivre le « Parcours de démarrage rapide » étape par étape, et approfondir les autres sujets ultérieurement selon vos besoins.
:::
