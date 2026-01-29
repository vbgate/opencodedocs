---
title: "Démarrage rapide : Installation, configuration, lancement de Gateway et premier message, avec introduction à la protection des DM | Tutoriel Clawdbot"
sidebarTitle: "Utilisation depuis zéro"
subtitle: "Démarrage rapide : de l'installation au premier message"
description: "Ce chapitre vous guide dans la première utilisation de Clawdbot, incluant l'installation, la configuration, le lancement de Gateway, l'envoi du premier message et la compréhension du mécanisme de protection des DM."
tags:
  - "Débutant"
  - "Démarrage rapide"
prerequisite: []
order: 10
---

# Démarrage rapide : de l'installation au premier message

Bienvenue sur Clawdbot ! Ce chapitre vous guidera à travers le processus complet pour utiliser Clawdbot depuis zéro. Que vous souhaitiez simplement découvrir rapidement l'assistant IA ou explorer en profondeur les options de configuration, vous trouverez ici les tutoriels correspondants.

---

## Vue d'ensemble du chapitre

Ce chapitre comprend 5 tutoriels couvrant le processus complet de prise en main de Clawdbot : de l'installation du logiciel, de la configuration des modèles IA et des canaux de communication, au lancement du processus Gateway, à l'envoi du premier message, jusqu'à la compréhension du mécanisme de protection de sécurité par défaut. À l'issue de ce chapitre, vous disposerez d'un assistant IA personnel pleinement fonctionnel.

---

## Recommandation de parcours d'apprentissage

Nous recommandons de suivre ces tutoriels dans l'ordre suivant :

```mermaid
flowchart LR
    A[getting-started<br>Démarrage rapide] --> B[onboarding-wizard<br>Configuration guidée]
    B --> C[gateway-startup<br>Lancement de Gateway]
    C --> D[first-message<br>Premier message]
    D --> E[pairing-approval<br>Appairage DM et contrôle d'accès]

    style A fill:#3b82f6,color:#fff
    style B fill:#10b981,color:#fff
    style C fill:#f59e0b,color:#fff
    style D fill:#8b5cf6,color:#fff
    style E fill:#ef4444,color:#fff
```

**Explication du parcours d'apprentissage** :

1. **Démarrage rapide** (obligatoire) : Effectuez l'installation et la configuration de base, prérequis à tous les apprentissages suivants
2. **Configuration guidée** (recommandé) : Approfondissez les différentes options du guide, idéal pour les utilisateurs souhaitant une configuration fine
3. **Lancement de Gateway** (obligatoire) : Découvrez comment lancer et gérer le processus Gateway
4. **Premier message** (obligatoire) : Vérifiez que la configuration est correcte et commencez à utiliser l'assistant IA
5. **Appairage DM et contrôle d'accès** (recommandé) : Comprenez le mécanisme de sécurité par défaut pour protéger votre assistant IA

::: tip Accès rapide
Si vous souhaitez simplement faire un test rapide, vous pouvez suivre uniquement les tutoriels « Démarrage rapide » et « Lancement de Gateway », puis envoyer directement des messages. Les autres tutoriels pourront être consultés ultérieurement selon vos besoins.
:::

---

## Prérequis

Avant de commencer ce chapitre, assurez-vous de disposer de :

- **Node.js** : ≥ 22.12.0 (vérifiez avec `node -v`)
- **Système d'exploitation** : macOS / Linux / Windows (WSL2)
- **Gestionnaire de paquets** : npm / pnpm / bun
- **Compte de modèle IA** (recommandé) :
  - Compte Anthropic Claude (abonnement Pro/Max), support du flux OAuth
  - Ou clé API d'un fournisseur tel que OpenAI / DeepSeek / OpenRouter

::: warning Attention aux utilisateurs Windows
Sur Windows, l'utilisation de **WSL2** est fortement recommandée car :
- De nombreux canaux dépendent de fichiers binaires locaux
- Les processus en arrière-plan (launchd/systemd) ne sont pas disponibles sur Windows
:::

---

## Navigation des sous-pages

### [1. Démarrage rapide](./getting-started/) ⭐ Tutoriel essentiel

**Ce que vous pourrez faire** :
- ✅ Installer Clawdbot sur votre appareil
- ✅ Configurer l'authentification du modèle IA (Anthropic / OpenAI / autres fournisseurs)
- ✅ Lancer le processus Gateway en arrière-plan
- ✅ Envoyer le premier message via WebChat ou les canaux configurés

**Public cible** : Tous les utilisateurs, tutoriel obligatoire

**Durée estimée** : 15-20 minutes

**Contenu principal** :
- Installer Clawdbot avec npm/pnpm/bun
- Exécuter le guide d'onboarding pour la configuration de base
- Lancer Gateway et vérifier son état
- Envoyer des messages de test via CLI ou canaux

**Prérequis** : Aucun

---

### [2. Configuration guidée](./onboarding-wizard/)

**Ce que vous pourrez faire** :
- ✅ Utiliser le guide interactif pour une configuration complète
- ✅ Comprendre la différence entre les modes QuickStart et Manual
- ✅ Configurer le réseau Gateway, l'authentification et Tailscale
- ✅ Configurer les fournisseurs de modèles IA (setup-token et clé API)
- ✅ Activer les canaux de communication (WhatsApp, Telegram, etc.)
- ✅ Installer et gérer les packs de compétences

**Public cible** : Utilisateurs souhaitant une configuration fine, découverte des options avancées

**Durée estimée** : 20-30 minutes

**Contenu principal** :
- Choix entre les modes QuickStart et Manual
- Configuration du réseau Gateway (ports, binding, authentification)
- Méthodes d'authentification du modèle IA (setup-token recommandé)
- Processus de configuration des canaux de communication
- Introduction au système de compétences

**Prérequis** : [Démarrage rapide](./getting-started/)

---

### [3. Lancement de Gateway](./gateway-startup/) ⭐ Tutoriel essentiel

**Ce que vous pourrez faire** :
- ✅ Lancer le processus Gateway au premier plan en ligne de commande
- ✅ Configurer Gateway comme processus en arrière-plan (macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- ✅ Comprendre les différents modes de binding (loopback / LAN / Tailnet) et méthodes d'authentification
- ✅ Basculer entre le mode développement et le mode production
- ✅ Utiliser `--force` pour libérer les ports occupés

**Public cible** : Tous les utilisateurs, tutoriel obligatoire

**Durée estimée** : 15-20 minutes

**Contenu principal** :
- Mode au premier plan vs mode processus en arrière-plan
- Choix du mode de binding (loopback / LAN / Tailnet / Auto)
- Configuration des méthodes d'authentification (Token / Password / Tailscale Identity)
- Mode développement (`--dev`) et mode production
- Commandes de gestion de service (install / start / stop / restart)
- Gestion des conflits de ports (`--force`)

**Prérequis** : [Configuration guidée](./onboarding-wizard/)

---

### [4. Premier message](./first-message/) ⭐ Tutoriel essentiel

**Ce que vous pourrez faire** :
- ✅ Envoyer des messages via l'interface WebChat
- ✅ Dialoguer avec l'assistant IA via les canaux configurés (WhatsApp / Telegram / Slack, etc.)
- ✅ Comprendre le routage des messages et le flux de réponse
- ✅ Utiliser l'assistant IA pour des tâches de base (recherche, résumé, génération de code, etc.)

**Public cible** : Tous les utilisateurs, tutoriel obligatoire

**Durée estimée** : 10-15 minutes

**Contenu principal** :
- Utilisation de l'interface WebChat
- Méthodes d'envoi de messages par canal
- Format des messages et mécanisme de réponse
- Exemples de tâches courantes (recherche d'informations, génération de code, résumé de texte)
- Débogage et résolution de problèmes

**Prérequis** : [Lancement de Gateway](./gateway-startup/)

---

### [5. Appairage DM et contrôle d'accès](./pairing-approval/)

**Ce que vous pourrez faire** :
- ✅ Comprendre le mécanisme de protection des DM par défaut
- ✅ Approuver ou refuser les demandes d'appairage d'expéditeurs inconnus
- ✅ Configurer les listes blanches et noires
- ✅ Définir des stratégies de contrôle d'accès
- ✅ Comprendre les modes d'appairage et les bonnes pratiques de sécurité

**Public cible** : Utilisateurs soucieux de la sécurité, recommandé

**Durée estimée** : 10-15 minutes

**Contenu principal** :
- Principe du mécanisme d'appairage DM
- Flux d'appairage et expérience utilisateur
- Configuration des listes blanches et noires
- Paramétrage des stratégies de contrôle d'accès
- Bonnes pratiques de sécurité

**Prérequis** : [Premier message](./first-message/)

---

## FAQ

### Q : Dois-je suivre tous les tutoriels ?

**R** : Pas nécessairement. Si vous souhaitez simplement prendre en main rapidement, il suffit de suivre les deux tutoriels essentiels « Démarrage rapide » et « Lancement de Gateway », puis vous pourrez commencer à utiliser Clawdbot. Les autres tutoriels peuvent être consultés ultérieurement selon vos besoins.

### Q : Y a-t-il des conséquences à sauter certains tutoriels ?

**R** : Non. Chaque tutoriel est indépendant, mais « Démarrage rapide » est la base, incluant l'installation et la configuration de base, et devrait être suivi en premier. Les autres tutoriels peuvent être choisis en fonction de vos besoins.

### Q : Si je connais déjà les assistants IA, puis-je sauter les tutoriels de base ?

**R** : Oui. Si vous êtes déjà familiarisé avec des outils d'assistant IA similaires, vous pouvez sauter « Démarrage rapide » et suivre directement « Configuration guidée » et « Lancement de Gateway » pour découvrir les options de configuration et méthodes de lancement spécifiques à Clawdbot.

### Q : Que pourrai-je faire après avoir terminé ce chapitre ?

**R** : À l'issue de ce chapitre, vous disposerez d'un système Clawdbot pleinement fonctionnel, capable de :
- Dialoguer avec l'assistant IA via WebChat ou plusieurs canaux
- Faire exécuter des tâches de base par l'IA (recherche d'informations, génération de code, résumé de texte, etc.)
- Utiliser le mécanisme d'appairage DM pour la protection
- Poursuivre l'apprentissage des fonctions avancées (configuration multicanal, système d'outils, plateforme de compétences, etc.)

---

## Guide des étapes suivantes

Après avoir terminé ce chapitre, vous pouvez poursuivre avec :

- **[Vue d'ensemble du système multicanal](../../platforms/channels-overview/)** : Découvrir tous les canaux de communication supportés par Clawdbot et leurs caractéristiques
- **[Canal WhatsApp](../../platforms/whatsapp/)** : Approfondir la configuration et l'utilisation du canal WhatsApp
- **[Canal Telegram](../../platforms/telegram/)** : Approfondir la configuration et l'utilisation du canal Telegram
- **[Interface WebChat](../../platforms/webchat/)** : Découvrir les fonctionnalités de l'interface WebChat intégrée

::: tip Conseil
En fonction de vos besoins d'utilisation, choisissez les canaux correspondants pour un apprentissage approfondi. Si vous utilisez principalement un canal spécifique (comme WhatsApp ou Telegram), vous pouvez privilégier le tutoriel dédié à ce canal.
:::
