---
title: "Introduction : Passerelle IA locale | Antigravity Manager"
sidebarTitle: "Qu'est-ce qu'une passerelle IA locale"
subtitle: "Antigravity Tools : transformer « compte + protocole » en passerelle IA locale"
description: "Comprendre le positionnement central d'Antigravity Manager. Il offre une interface de bureau et une passerelle HTTP locale, supportant plusieurs protocoles et la gestion de pools de comptes, vous aidant à démarrer rapidement avec le reverse proxy local et à éviter les erreurs de configuration courantes."
tags:
  - "Premiers pas"
  - "Concept"
  - "Passerelle locale"
  - "API Proxy"
prerequisite: []
order: 1
---

# Antigravity Tools : transformer « compte + protocole » en passerelle IA locale

La barrière à l'entrée de nombreux clients/SDK d'IA ne réside pas dans « comment appeler l'API », mais dans « quel protocole intégrer, comment gérer plusieurs comptes, comment assurer la récupération automatique en cas d'échec ». Antigravity Tools vise à consolider ces trois aspects en une passerelle locale.

## Qu'est-ce qu'Antigravity Tools ?

**Antigravity Tools** est une application de bureau : vous gérez vos comptes et configurations via une interface graphique, elle démarre un service de reverse proxy HTTP sur votre machine locale, transmet de manière unifiée les requêtes de différents fournisseurs/protocoles vers les services amont, puis reconvertit les réponses dans un format familier pour le client.

## Ce que vous pourrez faire après ce cours

- Expliquer clairement le problème qu'Antigravity Tools résout (et ce qu'il ne résout pas)
- Identifier ses composants principaux : GUI, pool de comptes, passerelle de reverse proxy HTTP, adaptation de protocoles
- Comprendre les limites de sécurité par défaut (127.0.0.1, ports, modes d'authentification) et quand les modifier
- Savoir où aller au chapitre suivant : installation, ajout de comptes, démarrage du reverse proxy, intégration de clients

## Votre situation actuelle

Vous avez peut-être rencontré ces difficultés :

- Un même client doit supporter les protocoles OpenAI/Anthropic/Gemini, et la configuration devient souvent confuse
- Vous avez plusieurs comptes, mais la commutation, la rotation et les tentatives de relance en cas de limitation se font manuellement
- En cas d'échec de requête, vous ne pouvez que scruter les journaux pour deviner s'il s'agit d'un « compte invalide » ou d'une « limitation de service amont/quota épuisé »

L'objectif d'Antigravity Tools est d'intégrer ces « travaux auxiliaires » dans une passerelle locale, permettant à vos clients/SDK de se concentrer sur une seule chose : envoyer les requêtes localement.

## Concept central

Vous pouvez le comprendre comme une « passerelle de dispatching IA locale », composée de trois couches :

1) GUI (Application de bureau)
- Responsable de la gestion de vos comptes, configurations, surveillance et statistiques.
- Page principale : Dashboard, Accounts, API Proxy, Monitor, Token Stats, Settings.

2) Service de reverse proxy HTTP (Axum Server)
- Responsable de l'exposition de plusieurs points de terminaison de protocoles et de la transmission des requêtes aux gestionnaires correspondants.
- Le service de reverse proxy superpose des couches d'authentification, de surveillance par middleware, CORS, Trace, etc.

3) Pool de comptes et dispatching (TokenManager, etc.)
- Responsable de la sélection de comptes disponibles dans le pool local, rafraîchissement des tokens si nécessaire, rotation et auto-récupération.

::: info Que signifie « passerelle locale » ?
Ici, « local » est au sens littéral : le service s'exécute sur votre propre machine. Vos clients (Claude Code, OpenAI SDK, divers clients tiers) pointent leur Base URL vers `http://127.0.0.1:<port>`. Les requêtes arrivent d'abord sur votre machine, puis sont transmises vers les services amont par Antigravity Tools.
:::

## Quels points de terminaison expose-t-il ?

Le service de reverse proxy enregistre plusieurs ensembles de points de terminaison de protocoles dans un Routeur. Retenez pour l'instant ces « entrées » :

- Compatible OpenAI : `/v1/chat/completions`, `/v1/completions`, `/v1/responses`, `/v1/models`
- Compatible Anthropic : `/v1/messages`, `/v1/messages/count_tokens`
- Natif Gemini : `/v1beta/models`, `/v1beta/models/:model`, `/v1beta/models/:model/countTokens`
- Vérification de santé : `GET /healthz`

Si votre client peut s'intégrer à l'un de ces protocoles, théoriquement, vous pouvez diriger les requêtes vers cette passerelle locale en « modifiant la Base URL ».

## Limites de sécurité par défaut (ne pas sauter)

Le plus grand piège de ces « reverse proxy locaux » n'est souvent pas un manque de fonctionnalités, mais que vous les exposez accidentellement.

Retenez d'abord quelques valeurs par défaut (toutes issues de la configuration par défaut) :

- Port par défaut : `8045`
- Accès local uniquement par défaut : `allow_lan_access=false`, adresse d'écoute sur `127.0.0.1`
- Mode d'authentification par défaut : `auth_mode=off` (ne nécessite pas de clé du client)
- Un `api_key` de forme `sk-...` sera généré par défaut (pour activer l'authentification si nécessaire)

::: warning Quand est-il obligatoire d'activer l'authentification ?
Dès que vous activez l'accès au réseau local (`allow_lan_access=true`, l'adresse d'écoute devient `0.0.0.0`), vous devez simultanément activer l'authentification et gérer la clé API comme un mot de passe.
:::

## Quand utiliser Antigravity Tools

Il convient mieux à ces scénarios :

- Vous avez plusieurs clients/SDK d'IA et souhaitez qu'ils utilisent tous une même Base URL
- Vous devez consolider différents protocoles (OpenAI/Anthropic/Gemini) dans une même « sortie locale »
- Vous avez plusieurs comptes et souhaitez que le système gère la rotation et la stabilité

Si vous voulez simplement « écrire deux lignes de code pour appeler directement l'API officielle » et que vos comptes/protocoles sont fixes, il pourrait être trop lourd.

## Suivez-moi : établissez d'abord un ordre d'utilisation correct

Ce cours ne vous apprend pas les détails de configuration, il aligne d'abord l'ordre principal pour éviter que vous ne vous bloquiez en sautant des étapes :

### Étape 1 : Installer d'abord, puis démarrer

**Pourquoi**
L'application de bureau gère les comptes et démarre le service de reverse proxy. Sans elle, OAuth et le reverse proxy sont impossibles.

Allez au chapitre suivant et terminez l'installation selon le mode du README.

**Ce que vous devriez voir** : Vous pouvez ouvrir Antigravity Tools et voir la page Dashboard.

### Étape 2 : Ajouter au moins un compte

**Pourquoi**
Le service de reverse proxy doit obtenir une identité disponible dans le pool de comptes pour envoyer des requêtes vers l'amont. Sans compte, la passerelle ne peut pas « appeler pour vous ».

Allez au chapitre « Ajouter un compte », ajoutez un compte selon le processus OAuth ou Refresh Token.

**Ce que vous devriez voir** : Votre compte apparaît dans la page Accounts, et vous pouvez voir les informations de quota/état.

### Étape 3 : Démarrer l'API Proxy et faire une vérification minimale avec /healthz

**Pourquoi**
Utilisez d'abord `GET /healthz` pour vérifier que « le service local fonctionne », puis intégrez le client. Le dépannage sera beaucoup plus simple.

Allez au chapitre « Démarrer le reverse proxy local et intégrer le premier client » pour compléter la boucle.

**Ce que vous devriez voir** : Votre client/SDK peut obtenir avec succès une réponse via la Base URL locale.

## Attention aux pièges courants

| Scénario | Ce que vous pourriez faire (❌) | Approche recommandée (✓) |
|--- | --- | ---|
| Permettre à un téléphone/autre ordinateur d'accéder | Ouvrir directement `allow_lan_access=true` sans définir d'authentification | Activer simultanément l'authentification et d'abord vérifier `GET /healthz` dans le réseau local |
| Le client renvoie 404 | Ne modifier que host/port, sans se soucier de la façon dont le client concatène `/v1` | D'abord confirmer la stratégie de concaténation base_url du client, puis décider si le préfixe `/v1` est nécessaire |
| Commencer directement avec Claude Code | Intégrer directement un client complexe, ne pas savoir où chercher en cas d'échec | D'abord réussir la boucle minimale : démarrer le Proxy → `GET /healthz` → puis intégrer le client |

## Résumé du cours

- Le positionnement d'Antigravity Tools est « interface de bureau + passerelle de reverse proxy HTTP locale » : gestion GUI, Axum fournit des points de terminaison multi-protocoles
- Vous devez le considérer comme une infrastructure locale : installer d'abord, ajouter des comptes, démarrer le Proxy, puis intégrer les clients
- Par défaut, il écoute seulement sur `127.0.0.1:8045`, si vous l'exposez au réseau local, assurez-vous d'activer l'authentification

## Aperçu du prochain cours

> Le prochain cours termine l'étape d'installation : **[Installation et mise à niveau : chemin d'installation optimal pour l'application de bureau](../installation/)**.
>
> Vous apprendrez :
> - Les modes d'installation listés dans le README (ainsi que leur priorité)
> - L'entrée de mise à niveau et le traitement des blocages système courants

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour développer les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
|--- | --- | ---|
| Positionnement du produit (station de relais IA locale / fossé de protocoles) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L35-L77) | 35-77 |
| Vue d'ensemble des points de terminaison du Routeur (OpenAI/Claude/Gemini/healthz) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Logique de port par défaut / accès local uniquement par défaut / clé par défaut et bind address | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L291) | 174-291 |
|--- | --- | ---|
| Structure du routage des pages GUI (Dashboard/Accounts/API Proxy/Monitor/Token Stats/Settings) | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L48) | 19-48 |

**Valeurs par défaut clés** :
- `ProxyConfig.port = 8045` : port par défaut du service de reverse proxy
- `ProxyConfig.allow_lan_access = false` : accès local uniquement par défaut
- `ProxyAuthMode::default() = off` : pas d'authentification requise par défaut

</details>
