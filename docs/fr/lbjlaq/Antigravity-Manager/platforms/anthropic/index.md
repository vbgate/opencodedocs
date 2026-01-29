---
title: "Anthropic : API compatible | Antigravity-Manager"
sidebarTitle: "Faire passer Claude Code par la passerelle locale"
subtitle: "Anthropic : API compatible"
description: "Apprenez l'API compatible Anthropic d'Antigravity-Manager. Configurez le Base URL de Claude Code, utilisez /v1/messages, comprenez l'authentification et l'interception warmup."
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---
# API compatible Anthropic : /v1/messages et les contrats clés de Claude Code

Vous souhaitez faire passer Claude Code par la passerelle locale sans modifier son utilisation du protocole Anthropic ? Il suffit de diriger le Base URL vers Antigravity Tools et d'effectuer une requête réussie avec `/v1/messages`.

## Qu'est-ce que l'API compatible Anthropic ?

L'**API compatible Anthropic** désigne les points de terminaison du protocole Anthropic Messages exposés par Antigravity Tools. Il reçoit les requêtes `/v1/messages`, effectue un nettoyage des messages, l'encapsulation du flux et les nouvelles tentatives/rotations localement, puis transfère la requête en amont pour fournir les capacités réelles du modèle.

## Ce que vous pourrez faire après ce cours

- Utiliser le point de terminaison `/v1/messages` des outils Antigravity pour faire fonctionner Claude Code (ou tout client Messages Anthropic)
- Distinguer comment configurer le Base URL et les en-têtes d'authentification pour éviter les essais aveugles 401/404
- Obtenir le SSE standard si vous avez besoin du flux, ou du JSON si vous n'en avez pas besoin
- Comprendre quelles "corrections de protocole" le proxy effectue en arrière-plan (interception warmup, nettoyage des messages, secours de signature)

## Votre situation actuelle

Vous souhaitez utiliser Claude Code/le SDK Anthropic, mais les problèmes de réseau, de comptes, de quotas et de limitation rendent les conversations très instables. Vous avez déjà démarré Antigravity Tools comme passerelle locale, mais vous êtes souvent bloqué sur ces types de problèmes :

- Le Base URL est écrit comme `.../v1` ou est "empilé" par le client, entraînant directement une erreur 404
- Vous avez activé l'authentification du proxy mais vous ne savez pas quel en-tête le client utilise pour transmettre la clé, entraînant une erreur 401
- Les tâches warmup/résumé en arrière-plan de Claude Code consomment discrètement le quota

## Quand utiliser cette approche

- Vous souhaitez intégrer le **CLI Claude Code** et espérez qu'il se connecte directement à la passerelle locale "selon le protocole Anthropic"
- Votre client ne supporte que l'API Messages Anthropic (`/v1/messages`) et vous ne souhaitez pas modifier le code

## 🎒 Préparatifs avant de commencer

::: warning Conditions préalables
Ce cours suppose que vous avez déjà réussi le cycle de base du proxy inverse local (vous pouvez accéder à `/healthz`, vous connaissez le port du proxy et si l'authentification est activée). Si ce n'est pas encore le cas, commencez par **[Démarrer le proxy inverse local et connecter le premier client](/fr/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

Vous devez préparer trois choses :

1. L'adresse du proxy (exemple : `http://127.0.0.1:8045`)
2. Si l'authentification du proxy est activée (et le `proxy.api_key` correspondant)
3. Un client capable d'envoyer des requêtes Messages Anthropic (Claude Code / curl suffisent)

## Idée principale

L'**API compatible Anthropic** dans Antigravity Tools correspond à un ensemble de routes fixes : `POST /v1/messages`, `POST /v1/messages/count_tokens`, `GET /v1/models/claude` (voir la définition du Router dans `src-tauri/src/proxy/server.rs`).

Parmi celles-ci, `/v1/messages` est "l'entrée principale". Le proxy effectue un ensemble de traitements de compatibilité avant d'envoyer réellement la requête en amont :

- Nettoyer les champs des messages historiques non acceptés par le protocole (par exemple `cache_control`)
- Fusionner les messages consécutifs du même rôle pour éviter les échecs de validation "alternance des rôles"
- Détecter les messages warmup de Claude Code et renvoyer directement une réponse simulée, réduisant le gaspillage de quota
- Effectuer des nouvelles tentatives et la rotation des comptes en fonction du type d'erreur (jusqu'à 3 tentatives), améliorant la stabilité des longues sessions

## Suivez les étapes

### Étape 1 : Assurez-vous que le Base URL ne contient que le port

**Pourquoi**
`/v1/messages` est une route fixe côté proxy. Si le Base URL est écrit comme `.../v1`, il est facile pour le client de l'ajouter une fois `/v1/messages`, ce qui donne finalement `.../v1/v1/messages`.

Vous pouvez d'abord tester directement la disponibilité avec curl :

```bash
#Vous devriez voir : {"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### Étape 2 : Si vous avez activé l'authentification, rappelez-vous ces 3 en-têtes

**Pourquoi**
Le middleware d'authentification du proxy récupère la clé parmi `Authorization`, `x-api-key` et `x-goog-api-key`. Si l'authentification est activée mais que l'en-tête ne correspond pas, vous obtiendrez systématiquement une erreur 401.

::: info Quels en-têtes d'authentification le proxy accepte-t-il ?
`Authorization: Bearer <key>`, `x-api-key: <key>`, `x-goog-api-key: <key>` fonctionnent tous (voir `src-tauri/src/proxy/middleware/auth.rs`).
:::

### Étape 3 : Connectez le CLI Claude Code directement à la passerelle locale

**Pourquoi**
Claude Code utilise le protocole Anthropic Messages. En dirigeant son Base URL vers la passerelle locale, vous pouvez réutiliser ce contrat `/v1/messages`.

Configurez les variables d'environnement selon l'exemple du README :

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**Ce que vous devriez voir** : Claude Code démarre normalement et reçoit une réponse après avoir envoyé un message.

### Étape 4 : Listez d'abord les modèles disponibles (pour curl/SDK)

**Pourquoi**
Différents clients transmettent le `model` tel quel. Obtenir d'abord la liste des modèles accélérera considérablement le dépannage.

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**Ce que vous devriez voir** : Retourne un JSON avec `object: "list"`, où `data[].id` sont les ID de modèles disponibles.

### Étape 5 : Appelez /v1/messages avec curl (non flux)

**Pourquoi**
C'est le plus petit chemin reproductible : sans utiliser Claude Code, vous pouvez confirmer où se situe l'erreur entre "route + authentification + corps de la requête".

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<choisissez-en un dans /v1/models/claude>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "Bonjour, présentez-vous brièvement"}
    ]
  }'
```

**Ce que vous devriez voir** :

- HTTP 200
- L'en-tête de réponse peut contenir `X-Account-Email` et `X-Mapped-Model` (pour le dépannage)
- Le corps de la réponse est un JSON au style Messages Anthropic (`type: "message"`)

### Étape 6 : Si vous avez besoin du flux, activez `stream: true`

**Pourquoi**
Claude Code utilise SSE. Vous pouvez également faire fonctionner le SSE avec curl, confirmant qu'il n'y a pas de problèmes de proxy/tampon.

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<choisissez-en un dans /v1/models/claude>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Expliquez en 3 phrases ce qu'est un proxy inverse local"}
    ]
  }'
```

**Ce que vous devriez voir** : Des lignes d'événements SSE (`event: message_start`, `event: content_block_delta`, etc.).

## Point de contrôle ✅

- `GET /healthz` retourne `{"status":"ok"}`
- `GET /v1/models/claude` peut obtenir `data[].id`
- `POST /v1/messages` peut retourner 200 (soit JSON non flux, soit SSE flux)

## Pièges à éviter

### 1) Le Base URL ne doit pas être écrit comme `.../v1`

L'exemple de Claude Code est `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"`, car la route côté proxy inclut déjà `/v1/messages`.

### 2) Si l'authentification est activée mais que `proxy.api_key` est vide, la requête sera directement rejetée

Lorsque l'authentification du proxy est activée mais que `api_key` est vide, le middleware retourne directement une erreur 401 (voir la logique de protection dans `src-tauri/src/proxy/middleware/auth.rs`).

### 3) `/v1/messages/count_tokens` est une implémentation fictive dans le chemin par défaut

Lorsque le transfert z.ai n'est pas activé, ce point de terminaison retourne directement `input_tokens: 0, output_tokens: 0` (voir `handle_count_tokens`). Ne l'utilisez pas pour juger les tokens réels.

### 4) Vous n'avez pas activé le flux, mais vous voyez le serveur "utiliser SSE en interne"

Le proxy a une stratégie de compatibilité pour `/v1/messages` : lorsque le client ne demande pas le flux, le serveur peut **forcer l'utilisation interne du flux** puis collecter le résultat au format JSON (voir la logique `force_stream_internally` dans `handle_messages`).

## Résumé du cours

- Pour faire fonctionner Claude Code/les clients Anthropic, l'essentiel est de 3 choses : Base URL, en-tête d'authentification, corps de la requête `/v1/messages`
- Pour "que le protocole fonctionne + sessions longues stables", le proxy nettoie les messages historiques, intercepte les warmup, et fait des nouvelles tentatives/rotation de comptes en cas d'échec
- `count_tokens` ne peut pas actuellement servir de métrique réelle (sauf si vous avez activé le chemin de transfert correspondant)

## Prochain cours

> Dans le prochain cours, nous apprenrons **[API Gemini native : /v1beta/models et l'intégration des points de terminaison du SDK Google](/fr/lbjlaq/Antigravity-Manager/platforms/gemini/)**.

---

## Annexe : Références du code source

<details>
<summary><strong>Cliquez pour voir les emplacements du code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
|--- | --- | ---|
| Routes du proxy : `/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Entrée principale Anthropic : `handle_messages` (incluant l'interception warmup et la boucle de nouvelles tentatives) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| Liste des modèles : `GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens` (retourne 0 si z.ai n'est pas activé) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Détection warmup et réponse simulée | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
|--- | --- | ---|
| Nettoyage de la requête : suppression de `cache_control` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| Nettoyage de la requête : fusion des messages consécutifs du même rôle | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
|--- | --- | ---|

**Constantes clés** :
- `MAX_RETRY_ATTEMPTS = 3` : nombre maximum de nouvelles tentatives pour `/v1/messages`

</details>
