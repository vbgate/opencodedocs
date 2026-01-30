---
title: "Présentation du Plugin : Fonctionnalités et Risques | Antigravity Auth"
sidebarTitle: "Ce plugin est-il fait pour vous ?"
subtitle: "Découvrez la valeur fondamentale du plugin Antigravity Auth"
description: "Découvrez la valeur fondamentale et les avertissements de risques du plugin Antigravity Auth. Accédez aux modèles Claude et Gemini 3 via Google OAuth, avec équilibrage de charge multi-comptes."
tags:
  - "Démarrage"
  - "Présentation du plugin"
  - "OpenCode"
  - "Antigravity"
order: 1
---

# Découvrez la valeur fondamentale du plugin Antigravity Auth

**Antigravity Auth** est un plugin OpenCode qui accède à l'API Antigravity via l'authentification Google OAuth. Il vous permet d'utiliser votre compte Google habituel pour appeler des modèles avancés comme Claude Opus 4.5, Sonnet 4.5 et Gemini 3 Pro/Flash, sans avoir à gérer de clés API. Le plugin offre également l'équilibrage de charge multi-comptes, un double pool de quotas et la récupération automatique de session, idéal pour les utilisateurs ayant besoin de modèles avancés et d'une gestion automatisée.

## Ce que vous apprendrez

- Déterminer si ce plugin correspond à votre cas d'utilisation
- Connaître les modèles IA et fonctionnalités principales supportés
- Comprendre les risques et précautions liés à l'utilisation de ce plugin
- Décider si vous souhaitez poursuivre l'installation et la configuration

## Votre situation actuelle

Vous souhaitez utiliser les modèles IA les plus avancés (comme Claude Opus 4.5, Gemini 3 Pro), mais l'accès officiel est limité. Vous cherchez un moyen fiable d'accéder à ces modèles, tout en espérant :

- Ne pas avoir à gérer manuellement plusieurs clés API
- Basculer automatiquement vers un autre compte en cas de limite de débit
- Récupérer automatiquement après une interruption de conversation, sans perdre le contexte

## Concept fondamental

**Antigravity Auth** est un plugin OpenCode qui accède à l'API Google Antigravity via **l'authentification Google OAuth**, vous permettant d'appeler des modèles IA avancés avec votre compte Google habituel.

Il ne s'agit pas d'un proxy pour toutes les requêtes, mais d'une **interception et transformation** de vos appels de modèles, les redirigeant vers l'API Antigravity, puis convertissant les réponses dans un format reconnaissable par OpenCode.

## Fonctionnalités principales

### Modèles supportés

| Famille de modèles | Modèles disponibles | Caractéristiques |
| --- | --- | --- |
| **Claude** | Opus 4.5, Sonnet 4.5 | Support du mode réflexion étendue |
| **Gemini 3** | Pro, Flash | Intégration Google Search, réflexion étendue |

::: info Mode Réflexion (Thinking)
Les modèles Thinking effectuent une « réflexion approfondie » avant de générer une réponse, affichant le processus de raisonnement. Vous pouvez configurer le budget de réflexion pour équilibrer qualité et vitesse de réponse.
:::

### Équilibrage de charge multi-comptes

- **Support jusqu'à 10 comptes Google**
- Basculement automatique vers le compte suivant en cas de limite de débit (erreur 429)
- Trois stratégies de sélection de compte : sticky (fixe), round-robin (rotation), hybrid (mixte intelligent)

### Système de double quota

Le plugin accède simultanément à **deux pools de quotas indépendants** :

1. **Quota Antigravity** : provenant de l'API Google Antigravity
2. **Quota Gemini CLI** : provenant de Google Gemini CLI

Lorsqu'un pool est limité, le plugin essaie automatiquement l'autre, maximisant l'utilisation des quotas.

### Récupération automatique de session

- Détection des échecs d'appels d'outils (comme l'interruption par ESC)
- Injection automatique d'un tool_result synthétique pour éviter le crash de la conversation
- Support de l'envoi automatique de "continue" pour poursuivre la conversation

### Intégration Google Search

Activez la recherche web pour les modèles Gemini, améliorant la précision factuelle :

- **Mode Auto** : le modèle décide s'il doit effectuer une recherche selon les besoins
- **Mode Always-on** : recherche systématique à chaque requête

## Quand utiliser ce plugin

::: tip Adapté aux scénarios suivants
- Vous avez plusieurs comptes Google et souhaitez augmenter votre quota total
- Vous avez besoin des modèles Thinking de Claude ou Gemini 3
- Vous souhaitez activer Google Search pour les modèles Gemini
- Vous préférez l'authentification OAuth à la gestion manuelle des clés API
- Vous rencontrez souvent des limites de débit et souhaitez un basculement automatique de compte
:::

::: warning Non adapté aux scénarios suivants
- Vous avez besoin de modèles non publics de Google
- Vous êtes très sensible aux risques liés aux CGU de Google (voir avertissement ci-dessous)
- Vous n'avez besoin que des modèles basiques Gemini 1.5 ou Claude 3 (les interfaces officielles sont plus stables)
- Vous avez des difficultés à ouvrir un navigateur dans des environnements WSL, Docker, etc.
:::

## ⚠️ Avertissement important sur les risques

L'utilisation de ce plugin **peut violer les conditions d'utilisation de Google**. Quelques utilisateurs ont signalé que leur compte Google a été **banni** ou **shadow-banni** (accès restreint sans notification explicite).

### Scénarios à haut risque

- 🚨 **Nouveaux comptes Google** : probabilité de bannissement très élevée
- 🚨 **Comptes avec abonnement Pro/Ultra récent** : facilement signalés et bannis

### Avant d'utiliser, veuillez confirmer

- Il s'agit d'un **outil non officiel**, non approuvé par Google
- Votre compte peut être suspendu ou banni définitivement
- Vous assumez tous les risques liés à l'utilisation de ce plugin

### Recommandations

- Utilisez des **comptes Google établis**, plutôt que de créer de nouveaux comptes pour ce plugin
- Évitez d'utiliser des comptes importants liés à des services critiques
- En cas de bannissement, il n'est pas possible de faire appel via ce plugin

::: danger Sécurité du compte
Tous les tokens OAuth sont stockés localement dans `~/.config/opencode/antigravity-accounts.json` et ne sont jamais téléchargés vers un serveur. Cependant, assurez-vous que votre ordinateur est sécurisé pour éviter toute fuite de tokens.
:::

## Résumé de cette leçon

Antigravity Auth est un puissant plugin OpenCode qui vous permet d'accéder aux modèles avancés Claude et Gemini 3 via Google OAuth. Il offre l'équilibrage de charge multi-comptes, un double pool de quotas, la récupération automatique de session et d'autres fonctionnalités, idéal pour les utilisateurs ayant besoin de modèles avancés et d'une gestion automatisée.

Mais attention : **l'utilisation de ce plugin comporte un risque de bannissement de compte**. Veuillez utiliser des comptes Google non critiques et comprendre les risques associés avant de poursuivre l'installation.

## Aperçu de la prochaine leçon

> Dans la prochaine leçon, nous apprendrons l'**[Installation rapide](../quick-install/)**.
>
> Vous apprendrez :
> - Installer le plugin en 5 minutes
> - Ajouter votre premier compte Google
> - Vérifier que l'installation a réussi
