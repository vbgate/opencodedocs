---
title: "Guide Complet du Protocole Gateway WebSocket API | Tutoriel Clawdbot"
sidebarTitle: "Développer un Client Personnalisé"
subtitle: "Guide Complet du Protocole Gateway WebSocket API"
description: "Apprenez la spécification complète du protocole Gateway WebSocket de Clawdbot, y compris la poignée de main de connexion, le format des trames de messages, le modèle requête/réponse, la diffusion d'événements, le système d'autorisations et toutes les méthodes disponibles. Ce tutoriel fournit une référence API complète et des exemples d'intégration client pour vous aider à intégrer rapidement un client personnalisé avec Gateway."
tags:
  - "API"
  - "WebSocket"
  - "Protocole"
  - "Développeur"
prerequisite:
  - "start-gateway-startup"
  - "advanced-session-management"
order: 350
---

# Guide Complet du Protocole Gateway WebSocket API

## Ce Que Vous Pourrez Faire Après Ce Tutoriel

- 📡 Se connecter avec succès au serveur Gateway WebSocket
- 🔄 Envoyer des requêtes et traiter les réponses
- 📡 Recevoir des événements poussés par le serveur
- 🔐 Comprendre le système d'autorisations et s'authentifier
- 🛠️ Appeler toutes les méthodes Gateway disponibles
- 📖 Comprendre le format des trames de messages et la gestion des erreurs

## Votre Situation Actuelle

Vous développez probablement un client personnalisé (comme une application mobile, une application Web ou un outil en ligne de commande) qui doit communiquer avec Clawdbot Gateway. Le protocole WebSocket de Gateway semble complexe, et vous avez besoin de :

- Savoir comment établir une connexion et s'authentifier
- Comprendre le format des messages de requête/réponse
- Connaître les méthodes disponibles et leurs paramètres
- Gérer les événements poussés par le serveur
- Comprendre le système d'autorisations

**Bonne nouvelle** : Le protocole Gateway WebSocket API est conçu pour être clair, et ce tutoriel vous fournira un guide de référence complet.

## Quand Utiliser Cette Technique

::: info Scénarios d'Application
Utilisez ce protocole lorsque vous devez :
- Développer un client personnalisé pour se connecter à Gateway
- Implémenter WebChat ou une application mobile
- Créer des outils de surveillance ou de gestion
- Intégrer Gateway dans un système existant
- Déboguer et tester les fonctionnalités de Gateway
:::

## Concepts Fondamentaux

Clawdbot Gateway utilise le protocole WebSocket pour fournir une communication bidirectionnelle en temps réel. Le protocole est basé sur des trames de messages au format JSON, divisées en trois types :

1. **Trame de Requête (Request Frame)** : Le client envoie une requête
2. **Trame de Réponse (Response Frame)** : Le serveur retourne une réponse
3. **Trame d'Événement (Event Frame)** : Le serveur pousse activement des événements

::: tip Philosophie de Conception
Le protocole adopte le modèle "requête-réponse" + mode "push d'événements" :
- Le client initie activement les requêtes, le serveur retourne les réponses
- Le serveur peut pousser activement des événements sans requête du client
- Toutes les opérations sont effectuées via une connexion WebSocket unifiée
:::

## Poignée de Main de Connexion

### Étape 1 : Établir la Connexion WebSocket

Gateway écoute par défaut sur `ws://127.0.0.1:18789` (modifiable via configuration).

::: code-group

```javascript [JavaScript]
// Établir la connexion WebSocket
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket connecté');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket connecté")
```

```bash [Bash]
# Utiliser l'outil wscat pour tester la connexion
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### Étape 2 : Envoyer le Message de Poignée de Main

Après l'établissement de la connexion, le client doit envoyer un message de poignée de main pour terminer l'authentification et la négociation de version.

```json
{
  "minProtocol": 1,
  "maxProtocol": 3,
  "client": {
    "id": "my-app-v1",
    "displayName": "Mon Client Personnalisé",
    "version": "1.0.0",
    "platform": "web",
    "mode": "operator",
    "instanceId": "unique-instance-id"
  },
  "caps": [],
  "commands": [],
  "auth": {
    "token": "your-token-here"
  }
}
```

**Pourquoi** : Le message de poignée de main informe le serveur de :
- La plage de versions de protocole supportées par le client
- Les informations de base du client
- Les informations d'identification d'authentification (token ou password)

**Ce Que Vous Devriez Voir** : Le serveur retourne le message `hello-ok`

```json
{
  "type": "hello-ok",
  "protocol": 3,
  "server": {
    "version": "v2026.1.24",
    "commit": "abc123",
    "host": "my-mac",
    "connId": "conn-123456"
  },
  "features": {
    "methods": ["agent", "send", "chat.send", ...],
    "events": ["agent.event", "chat.event", ...]
  },
  "snapshot": {
    "presence": [...],
    "health": {...},
    "stateVersion": {...},
    "uptimeMs": 12345678
  },
  "auth": {
    "deviceToken": "device-token-here",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  },
  "policy": {
    "maxPayload": 1048576,
    "maxBufferedBytes": 10485760,
    "tickIntervalMs": 30000
  }
}
```

::: info Description des Champs Hello-Ok
- `protocol` : La version du protocole utilisée par le serveur
- `server.version` : Le numéro de version de Gateway
- `features.methods` : La liste de toutes les méthodes disponibles
- `features.events` : La liste de tous les événements pouvant être abonnés
- `snapshot` : L'instantané de l'état actuel
- `auth.scopes` : Les portées d'autorisation accordées au client
- `policy.maxPayload` : La taille maximale d'un seul message
- `policy.tickIntervalMs` : L'intervalle des battements de cœur
:::

### Étape 3 : Vérifier l'État de la Connexion

Après le succès de la poignée de main, vous pouvez envoyer une requête de vérification de santé pour valider la connexion :

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**Ce Que Vous Devriez Voir** :

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "status": "ok",
    "uptimeMs": 12345678
  }
}
```

## Format des Trames de Messages

### Trame de Requête (Request Frame)

Toutes les requêtes envoyées par le client suivent le format de trame de requête :

```json
{
  "type": "req",
  "id": "unique-request-id",
  "method": "method.name",
  "params": {
    // Paramètres de la méthode
  }
}
```

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `type` | string | Oui | Valeur fixe `"req"` |
| `id` | string | Oui | Identifiant unique de la requête, utilisé pour faire correspondre la réponse |
| `method` | string | Oui | Nom de la méthode, par exemple `"agent"`, `"send"` |
| `params` | object | Non | Paramètres de la méthode, le format spécifique dépend de la méthode |

::: warning Importance de l'ID de Requête
Chaque requête doit avoir un `id` unique. Le serveur utilise l'`id` pour associer la réponse à la requête. Si plusieurs requêtes utilisent le même `id`, les réponses ne pourront pas être correctement associées.
:::

### Trame de Réponse (Response Frame)

Le serveur retourne une trame de réponse pour chaque requête :

```json
{
  "type": "res",
  "id": "unique-request-id",
  "ok": true,
  "payload": {
    // Données de réponse
  },
  "error": {
    // Informations d'erreur (uniquement lorsque ok=false)
  }
}
```

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `type` | string | Oui | Valeur fixe `"res"` |
| `id` | string | Oui | ID de la requête correspondante |
| `ok` | boolean | Oui | Indique si la requête a réussi |
| `payload` | any | Non | Données de réponse en cas de succès |
| `error` | object | Non | Informations d'erreur en cas d'échec |

**Exemple de Réponse Réussie** :

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "agents": [
      { "id": "agent-1", "name": "Default Agent" }
    ]
  }
}
```

**Exemple de Réponse Échouée** :

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: message",
    "retryable": false
  }
}
```

### Trame d'Événement (Event Frame)

Le serveur peut pousser activement des événements sans requête du client :

```json
{
  "type": "event",
  "event": "event.name",
  "payload": {
    // Données de l'événement
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| Champ | Type | Requis | Description |
| --- | --- | --- | --- |
| `type` | string | Oui | Valeur fixe `"event"` |
| `event` | string | Oui | Nom de l'événement |
| `payload` | any | Non | Données de l'événement |
| `seq` | number | Non | Numéro de séquence de l'événement |
| `stateVersion` | object | Non | Numéro de version de l'état |

**Exemples d'Événements Courants** :

```json
// Événement de battement de cœur
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Événement Agent
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Réflexion en cours..."
    }
  }
}

// Événement de chat
{
  "type": "event",
  "event": "chat.event",
  "payload": {
    "runId": "run-123",
    "sessionKey": "main",
    "seq": 1,
    "state": "delta",
    "message": {
      "role": "assistant",
      "content": "Bonjour !"
    }
  }
}

// Événement d'arrêt
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "Redémarrage du système",
    "restartExpectedMs": 5000
  }
}
```

## Authentification et Autorisations

### Méthodes d'Authentification

Gateway prend en charge trois méthodes d'authentification :

#### 1. Authentification par Token (Recommandée)

Fournissez le token dans le message de poignée de main :

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

Le token est défini dans le fichier de configuration :

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secret-token-here"
    }
  }
}
```

#### 2. Authentification par Mot de Passe

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

Le mot de passe est défini dans le fichier de configuration :

```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "password": "your-password-here"
    }
  }
}
```

#### 3. Tailscale Identity (Authentification Réseau)

Lors de l'utilisation de Tailscale Serve/Funnel, l'authentification peut être effectuée via Tailscale Identity :

```json
{
  "client": {
    "mode": "operator"
  },
  "device": {
    "id": "device-id",
    "publicKey": "public-key",
    "signature": "signature",
    "signedAt": 1706707200000
  }
}
```

### Portées d'Autorisation (Scopes)

Après la poignée de main, le client obtient un ensemble de portées d'autorisation qui déterminent les méthodes qu'il peut appeler :

| Portée | Autorisation | Méthodes Disponibles |
| --- | --- | ---|
| `operator.admin` | Administrateur | Toutes les méthodes, y compris la modification de configuration, Wizard, mises à jour, etc. |
| `operator.write` | Écriture | Envoyer des messages, appeler des Agents, modifier des sessions, etc. |
| `operator.read` | Lecture Seule | Interroger l'état, les journaux, la configuration, etc. |
| `operator.approvals` | Approbation | Méthodes liées à l'approbation Exec |
| `operator.pairing` | Appairage | Méthodes liées à l'appairage de nœuds et d'appareils |

::: info Vérification des Autorisations
Le serveur vérifie les autorisations à chaque requête. Si le client n'a pas l'autorisation nécessaire, la requête sera rejetée :

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "missing scope: operator.admin"
  }
}
```
:::

### Système de Rôles

En plus des portées, le protocole prend également en charge un système de rôles :

| Rôle | Description | Autorisations Spéciales |
| --- | --- | ---|
| `operator` | Opérateur | Peut appeler toutes les méthodes Operator |
| `node` | Nœud d'Appareil | Ne peut appeler que les méthodes exclusives aux nœuds |
| `device` | Appareil | Peut appeler les méthodes liées aux appareils |

Le rôle de nœud est automatiquement attribué lors de l'appairage de l'appareil, utilisé pour la communication entre le nœud de l'appareil et Gateway.

## Référence des Méthodes Principales

### Méthodes Agent

#### `agent` - Envoyer un Message à l'Agent

Envoie un message à l'Agent IA et obtient une réponse en flux continu.

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "Bonjour, aidez-moi à écrire un Hello World",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**Description des Paramètres** :

| Paramètre | Type | Requis | Description |
| --- | --- | --- | ---|
| `message` | string | Oui | Contenu du message utilisateur |
| `agentId` | string | Non | ID de l'Agent, utilise par défaut l'Agent par défaut configuré |
| `sessionId` | string | Non | ID de la session |
| `sessionKey` | string | Non | Clé de session |
| `to` | string | Non | Destination d'envoi (canal) |
| `channel` | string | Non | Nom du canal |
| `accountId` | string | Non | ID du compte |
| `thinking` | string | Non | Contenu de la réflexion |
| `deliver` | boolean | Non | S'il faut envoyer vers le canal |
| `attachments` | array | Non | Liste des pièces jointes |
| `timeout` | number | Non | Temps d'attente (millisecondes) |
| `lane` | string | Non | Canal de planification |
| `extraSystemPrompt` | string | Non | Invite système supplémentaire |
| `idempotencyKey` | string | Oui | Clé d'idempotence, empêche la duplication |

**Réponse** :

La réponse de l'Agent est poussée en flux continu via des trames d'événement :

```json
// Événement de réflexion
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "Réflexion en cours..."
    }
  }
}

// Événement de message
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 1,
    "stream": "message",
    "ts": 1706707200000,
    "data": {
      "role": "assistant",
      "content": "Bonjour ! Voici un Hello World..."
    }
  }
}
```

#### `agent.wait` - Attendre la Fin de l'Agent

Attend que la tâche de l'Agent se termine.

```json
{
  "type": "req",
  "id": "req-2",
  "method": "agent.wait",
  "params": {
    "runId": "run-123",
    "timeoutMs": 30000
  }
}
```

### Méthodes Send

#### `send` - Envoyer un Message au Canal

Envoie un message vers le canal spécifié.

```json
{
  "type": "req",
  "id": "req-3",
  "method": "send",
  "params": {
    "to": "+1234567890",
    "message": "Hello from Clawdbot!",
    "channel": "whatsapp",
    "idempotencyKey": "send-123"
  }
}
```

**Description des Paramètres** :

| Paramètre | Type | Requis | Description |
| --- | --- | --- | ---|
| `to` | string | Oui | Identifiant du destinataire (numéro de téléphone, ID utilisateur, etc.) |
| `message` | string | Oui | Contenu du message |
| `mediaUrl` | string | Non | URL du média |
| `mediaUrls` | array | Non | Liste des URLs de médias |
| `channel` | string | Non | Nom du canal |
| `accountId` | string | Non | ID du compte |
| `sessionKey` | string | Non | Clé de session (utilisée pour la sortie miroir) |
| `idempotencyKey` | string | Oui | Clé d'idempotence |

### Méthodes Poll

#### `poll` - Créer un Sondage

Crée un sondage et l'envoie vers le canal.

```json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "Quel est votre langage de programmation préféré ?",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
```

### Méthodes Sessions

#### `sessions.list` - Lister les Sessions

Liste toutes les sessions actives.

```json
{
  "type": "req",
  "id": "req-5",
  "method": "sessions.list",
  "params": {
    "limit": 50,
    "activeMinutes": 60,
    "includeDerivedTitles": true,
    "includeLastMessage": true
  }
}
```

**Description des Paramètres** :

| Paramètre | Type | Requis | Description |
| --- | --- | --- | ---|
| `limit` | number | Non | Nombre maximal de résultats à retourner |
| `activeMinutes` | number | Non | Filtrer les sessions récemment actives (minutes) |
| `includeGlobal` | boolean | Non | Inclure les sessions globales |
| `includeUnknown` | boolean | Non | Inclure les sessions inconnues |
| `includeDerivedTitles` | boolean | Non | Déduire les titres de la première ligne de message |
| `includeLastMessage` | boolean | Non | Inclure l'aperçu du dernier message |
| `label` | string | Non | Filtrer par étiquette |
| `agentId` | string | Non | Filtrer par ID d'Agent |
| `search` | string | Non | Mot-clé de recherche |

#### `sessions.patch` - Modifier la Configuration de la Session

Modifie les paramètres de configuration de la session.

```json
{
  "type": "req",
  "id": "req-6",
  "method": "sessions.patch",
  "params": {
    "key": "main",
    "label": "Session Principale",
    "thinkingLevel": "minimal",
    "responseUsage": "tokens",
    "model": "claude-sonnet-4-20250514"
  }
}
```

#### `sessions.reset` - Réinitialiser la Session

Vide l'historique de la session.

```json
{
  "type": "req",
  "id": "req-7",
  "method": "sessions.reset",
  "params": {
    "key": "main"
  }
}
```

#### `sessions.delete` - Supprimer la Session

Supprime la session et son historique.

```json
{
  "type": "req",
  "id": "req-8",
  "method": "sessions.delete",
  "params": {
    "key": "session-123",
    "deleteTranscript": true
  }
}
```

#### `sessions.compact` - Compacter l'Historique de la Session

Compresse l'historique de la session pour réduire la taille du contexte.

```json
{
  "type": "req",
  "id": "req-9",
  "method": "sessions.compact",
  "params": {
    "key": "main",
    "maxLines": 100
  }
}
```

### Méthodes Config

#### `config.get` - Obtenir la Configuration

Obtient la configuration actuelle.

```json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
```

#### `config.set` - Définir la Configuration

Définit une nouvelle configuration.

```json
{
  "type": "req",
  "id": "req-11",
  "method": "config.set",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash"
  }
}
```

#### `config.apply` - Appliquer la Configuration et Redémarrer

Applique la configuration et redémarre Gateway.

```json
{
  "type": "req",
  "id": "req-12",
  "method": "config.apply",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash",
    "restartDelayMs": 1000
  }
}
```

#### `config.schema` - Obtenir le Schéma de Configuration

Obtient la définition du schéma de configuration.

```json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
```

### Méthodes Channels

#### `channels.status` - Obtenir l'État des Canaux

Obtient l'état de tous les canaux.

```json
{
  "type": "req",
  "id": "req-14",
  "method": "channels.status",
  "params": {
    "probe": true,
    "timeoutMs": 5000
  }
}
```

**Exemple de Réponse** :

```json
{
  "type": "res",
  "id": "req-14",
  "ok": true,
  "payload": {
    "ts": 1706707200000,
    "channelOrder": ["whatsapp", "telegram", "slack"],
    "channelLabels": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "slack": "Slack"
    },
    "channelAccounts": {
      "whatsapp": [
        {
          "accountId": "wa-123",
          "enabled": true,
          "linked": true,
          "connected": true,
          "lastConnectedAt": 1706707200000
        }
      ]
    }
  }
}
```

#### `channels.logout` - Déconnexion du Canal

Déconnecte le canal spécifié.

```json
{
  "type": "req",
  "id": "req-15",
  "method": "channels.logout",
  "params": {
    "channel": "whatsapp",
    "accountId": "wa-123"
  }
}
```

### Méthodes Models

#### `models.list` - Lister les Modèles Disponibles

Liste tous les modèles d'IA disponibles.

```json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
```

**Exemple de Réponse** :

```json
{
  "type": "res",
  "id": "req-16",
  "ok": true,
  "payload": {
    "models": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "contextWindow": 200000,
        "reasoning": true
      },
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "openai",
        "contextWindow": 128000,
        "reasoning": false
      }
    ]
  }
}
```

### Méthodes Agents

#### `agents.list` - Lister Tous les Agents

Liste tous les Agents disponibles.

```json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
```

**Exemple de Réponse** :

```json
{
  "type": "res",
  "id": "req-17",
  "ok": true,
  "payload": {
    "defaultId": "default",
    "mainKey": "main",
    "scope": "per-sender",
    "agents": [
      {
        "id": "default",
        "name": "Default Agent",
        "identity": {
          "name": "Clawdbot",
          "theme": "default",
          "emoji": "🤖"
        }
      }
    ]
  }
}
```

### Méthodes Cron

#### `cron.list` - Lister les Tâches Planifiées

Liste toutes les tâches planifiées.

```json
{
  "type": "req",
  "id": "req-18",
  "method": "cron.list",
  "params": {
    "includeDisabled": true
  }
}
```

#### `cron.add` - Ajouter une Tâche Planifiée

Ajoute une nouvelle tâche planifiée.

```json
{
  "type": "req",
  "id": "req-19",
  "method": "cron.add",
  "params": {
    "name": "Rapport Quotidien",
    "description": "Générer le rapport quotidien chaque matin à 8h",
    "enabled": true,
    "schedule": {
      "kind": "cron",
      "expr": "0 8 * * *",
      "tz": "Europe/Paris"
    },
    "sessionTarget": "main",
    "wakeMode": "now",
    "payload": {
      "kind": "agentTurn",
      "message": "Veuillez générer le rapport de travail d'aujourd'hui",
      "channel": "last"
    }
  }
}
```

#### `cron.run` - Exécuter Manuellement une Tâche Planifiée

Exécute manuellement la tâche planifiée spécifiée.

```json
{
  "type": "req",
  "id": "req-20",
  "method": "cron.run",
  "params": {
    "id": "cron-123",
    "mode": "force"
  }
}
```

### Méthodes Nodes

#### `nodes.list` - Lister Tous les Nœuds

Liste tous les nœuds d'appareils appairés.

```json
{
  "type": "req",
  "id": "req-21",
  "method": "nodes.list",
  "params": {}
}
```

#### `nodes.describe` - Obtenir les Détails d'un Nœud

Obtient les informations détaillées du nœud spécifié.

```json
{
  "type": "req",
  "id": "req-22",
  "method": "nodes.describe",
  "params": {
    "nodeId": "ios-node-123"
  }
}
```

#### `nodes.invoke` - Invoquer une Commande sur un Nœud

Exécute une commande sur le nœud.

```json
{
  "type": "req",
  "id": "req-23",
  "method": "nodes.invoke",
  "params": {
    "nodeId": "ios-node-123",
    "command": "camera.snap",
    "params": {
      "quality": "high"
    },
    "timeoutMs": 10000,
    "idempotencyKey": "invoke-123"
  }
}
```

#### `nodes.pair.list` - Lister les Nœuds en Attente d'Appairage

Liste toutes les demandes de nœuds en attente d'appairage.

```json
{
  "type": "req",
  "id": "req-24",
  "method": "nodes.pair.list",
  "params": {}
}
```

#### `nodes.pair.approve` - Approuver l'Appairage d'un Nœud

Approuve la demande d'appairage du nœud.

```json
{
  "type": "req",
  "id": "req-25",
  "method": "nodes.pair.approve",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.pair.reject` - Refuser l'Appairage d'un Nœud

Refuse la demande d'appairage du nœud.

```json
{
  "type": "req",
  "id": "req-26",
  "method": "nodes.pair.reject",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.rename` - Renommer un Nœud

Renomme le nœud.

```json
{
  "type": "req",
  "id": "req-27",
  "method": "nodes.rename",
  "params": {
    "nodeId": "ios-node-123",
    "displayName": "Mon iPhone"
  }
}
```

### Méthodes Logs

#### `logs.tail` - Obtenir les Journaux

Obtient les journaux Gateway.

```json
{
  "type": "req",
  "id": "req-28",
  "method": "logs.tail",
  "params": {
    "cursor": 0,
    "limit": 100,
    "maxBytes": 100000
  }
}
```

**Exemple de Réponse** :

```json
{
  "type": "res",
  "id": "req-28",
  "ok": true,
  "payload": {
    "file": "/path/to/gateway.log",
    "cursor": 123456,
    "size": 4567890,
    "lines": [
      "[2025-01-27 10:00:00] INFO: Démarrage de Gateway...",
      "[2025-01-27 10:00:01] INFO: Connecté à WhatsApp"
    ],
    "truncated": false
  }
}
```

### Méthodes Skills

#### `skills.status` - Obtenir l'État des Compétences

Obtient l'état de toutes les compétences.

```json
{
  "type": "req",
  "id": "req-29",
  "method": "skills.status",
  "params": {}
}
```

#### `skills.bins` - Lister les Bibliothèques de Compétences

Liste les bibliothèques de compétences disponibles.

```json
{
  "type": "req",
  "id": "req-30",
  "method": "skills.bins",
  "params": {}
}
```

#### `skills.install` - Installer une Compétence

Installe la compétence spécifiée.

```json
{
  "type": "req",
  "id": "req-31",
  "method": "skills.install",
  "params": {
    "name": "my-custom-skill",
    "installId": "install-123",
    "timeoutMs": 60000
  }
}
```

### Méthodes WebChat

#### `chat.send` - Envoyer un Message de Chat (WebChat)

Méthode de chat dédiée à WebChat.

```json
{
  "type": "req",
  "id": "req-32",
  "method": "chat.send",
  "params": {
    "sessionKey": "main",
    "message": "Hello from WebChat!",
    "thinking": "Réponse en cours...",
    "deliver": true,
    "idempotencyKey": "chat-123"
  }
}
```

#### `chat.history` - Obtenir l'Historique du Chat

Obtient l'historique des messages de la session spécifiée.

```json
{
  "type": "req",
  "id": "req-33",
  "method": "chat.history",
  "params": {
    "sessionKey": "main",
    "limit": 50
  }
}
```

#### `chat.abort` - Interrompre le Chat

Interrompt le chat en cours.

```json
{
  "type": "req",
  "id": "req-34",
  "method": "chat.abort",
  "params": {
    "sessionKey": "main",
    "runId": "run-123"
  }
}
```

### Méthodes Wizard

#### `wizard.start` - Démarrer l'Assistant

Démarre l'assistant de configuration.

```json
{
  "type": "req",
  "id": "req-35",
  "method": "wizard.start",
  "params": {}
}
```

#### `wizard.next` - Étape Suivante de l'Assistant

Exécute l'étape suivante de l'assistant.

```json
{
  "type": "req",
  "id": "req-36",
  "method": "wizard.next",
  "params": {
    "stepId": "step-1",
    "response": {
      "selectedOption": "option-1"
    }
  }
}
```

#### `wizard.cancel` - Annuler l'Assistant

Annule l'assistant en cours.

```json
{
  "type": "req",
  "id": "req-37",
  "method": "wizard.cancel",
  "params": {}
}
```

### Méthodes System

#### `status` - Obtenir l'État du Système

Obtient l'état du système Gateway.

```json
{
  "type": "req",
  "id": "req-38",
  "method": "status",
  "params": {}
}
```

#### `last-heartbeat` - Obtenir le Dernier Temps de Battement de Cœur

Obtient le dernier temps de battement de cœur de Gateway.

```json
{
  "type": "req",
  "id": "req-39",
  "method": "last-heartbeat",
  "params": {}
}
```

### Méthodes Usage

#### `usage.status` - Obtenir les Statistiques d'Utilisation

Obtient les statistiques d'utilisation des Tokens.

```json
{
  "type": "req",
  "id": "req-40",
  "method": "usage.status",
  "params": {}
}
```

#### `usage.cost` - Obtenir les Statistiques de Coût

Obtient les statistiques de coût des appels API.

```json
{
  "type": "req",
  "id": "req-41",
  "method": "usage.cost",
  "params": {}
}
```

## Gestion des Erreurs

### Codes d'Erreur

Toutes les réponses d'erreur contiennent un code d'erreur et une description :

| Code d'Erreur | Description | Réessayable |
| --- | --- | ---|
| `NOT_LINKED` | Nœud non lié | Oui |
| `NOT_PAIRED` | Nœud non appairé | Non |
| `AGENT_TIMEOUT` | Délai d'attente de l'Agent dépassé | Oui |
| `INVALID_REQUEST` | Requête invalide | Non |
| `UNAVAILABLE` | Service indisponible | Oui |

### Format de Réponse d'Erreur

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "AGENT_TIMEOUT",
    "message": "Agent response timeout",
    "retryable": true,
    "retryAfterMs": 5000
  }
}
```

### Recommandations de Gestion des Erreurs

1. **Vérifiez le champ `retryable`** : Si `true`, vous pouvez réessayer après le délai spécifié par `retryAfterMs`
2. **Enregistrez les détails de l'erreur** : Enregistrez le `code` et le `message` pour le débogage
3. **Validez les paramètres** : `INVALID_REQUEST` indique généralement une validation de paramètre échouée
4. **Vérifiez l'état de la connexion** : `NOT_LINKED` indique que la connexion a été interrompue et doit être rétablie

## Mécanisme de Battement de Cœur

Gateway envoie régulièrement des événements de battement de cœur :

```json
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}
```

::: tip Traitement du Battement de Cœur
Le client doit :
1. Écouter les événements `tick`
2. Mettre à jour le dernier temps de battement de cœur
3. Si aucun battement de cœur n'est reçu pendant plus de `3 * tickIntervalMs`, envisager une reconnexion
:::

## Exemple Complet

### Exemple de Client JavaScript

```javascript
const WebSocket = require('ws');

class GatewayClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        // Envoyer le message de poignée de main
        this.sendHandshake();
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data));
      });

      this.ws.on('error', (error) => {
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket déconnecté');
      });
    });
  }

  sendHandshake() {
    this.ws.send(JSON.stringify({
      minProtocol: 1,
      maxProtocol: 3,
      client: {
        id: 'my-client',
        displayName: 'Mon Client Gateway',
        version: '1.0.0',
        platform: 'node',
        mode: 'operator'
      },
      auth: {
        token: this.token
      }
    }));
  }

  async request(method, params = {}) {
    const id = `req-${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'req',
        id,
        method,
        params
      }));

      // Définir le délai d'attente
      setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('Délai d\'attente de la requête dépassé'));
      }, 30000);
    });
  }

  handleMessage(message) {
    if (message.type === 'res') {
      const { id, ok, payload, error } = message;
      const pending = this.pendingRequests.get(id);
      
      if (pending) {
        this.pendingRequests.delete(id);
        if (ok) {
          pending.resolve(payload);
        } else {
          pending.reject(new Error(`${error.code}: ${error.message}`));
        }
      }
    } else if (message.type === 'event') {
      this.handleEvent(message);
    }
  }

  handleEvent(event) {
    console.log('Événement reçu:', event.event, event.payload);
  }

  async sendAgentMessage(message) {
    return this.request('agent', {
      message,
      idempotencyKey: `msg-${Date.now()}`
    });
  }

  async listSessions() {
    return this.request('sessions.list', {
      limit: 50,
      includeLastMessage: true
    });
  }

  async getChannelsStatus() {
    return this.request('channels.status', {
      probe: true
    });
  }
}

// Exemple d'utilisation
(async () => {
  const client = new GatewayClient('ws://127.0.0.1:18789/v1/connect', 'your-token');
  await client.connect();

  // Envoyer un message à l'Agent
  const response = await client.sendAgentMessage('Bonjour !');
  console.log('Réponse de l\'Agent:', response);

  // Lister les sessions
  const sessions = await client.listSessions();
  console.log('Liste des sessions:', sessions);

  // Obtenir l'état des canaux
  const channels = await client.getChannelsStatus();
  console.log('État des canaux:', channels);
})();
```

## Résumé de Ce Cours

Ce tutoriel a présenté en détail le protocole Gateway WebSocket API de Clawdbot, y compris :

- ✅ Le flux de poignée de main de connexion et le mécanisme d'authentification
- ✅ Les trois types de trames de messages (requête, réponse, événement)
- ✅ La référence des méthodes principales (Agent, Send, Sessions, Config, etc.)
- ✅ Le système d'autorisations et la gestion des rôles
- ✅ La gestion des erreurs et les stratégies de réessai
- ✅ Le mécanisme de battement de cœur et la gestion des connexions
- ✅ Un exemple complet de client JavaScript

## Aperçu de la Leçon Suivante

> Dans la prochaine leçon, nous apprendrons la **[Référence Complète de Configuration](../config-reference/)**.
>
> Vous apprendrez :
> - La description détaillée de tous les éléments de configuration
> - Le schéma de configuration et les valeurs par défaut
> - Le mécanisme de substitution des variables d'environnement
> - La validation de la configuration et la gestion des erreurs

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour développer et voir l'emplacement du code source</strong></summary>

> Dernière mise à jour : 2026-01-27

| Fonction | Chemin du Fichier | Numéro de Ligne |
| --- | --- | ---|
| Point d'entrée du protocole et validateur | `src/gateway/protocol/index.ts` | 1-521 |
| Définition des types de trames de base | `src/gateway/protocol/schema/frames.ts` | 1-165 |
| Définition de la version du protocole | `src/gateway/protocol/schema/protocol-schemas.ts` | 231 |
| Définition des codes d'erreur | `src/gateway/protocol/schema/error-codes.ts` | 3-24 |
| Schéma lié à l'Agent | `src/gateway/protocol/schema/agent.ts` | 1-107 |
| Schéma Chat/Logs | `src/gateway/protocol/schema/logs-chat.ts` | 1-83 |
| Schéma Sessions | `src/gateway/protocol/schema/sessions.ts` | 1-105 |
| Schéma Config | `src/gateway/protocol/schema/config.ts` | 1-72 |
| Schéma Nodes | `src/gateway/protocol/schema/nodes.ts` | 1-103 |
| Schéma Cron | `src/gateway/protocol/schema/cron.ts` | 1-246 |
| Schéma Channels | `src/gateway/protocol/schema/channels.ts` | 1-108 |
| Schéma Models/Agents/Skills | `src/gateway/protocol/schema/agents-models-skills.ts` | 1-86 |
| Gestionnaire de requêtes | `src/gateway/server-methods.ts` | 1-200 |
| Logique de vérification des autorisations | `src/gateway/server-methods.ts` | 91-144 |
| Définition de l'instantané d'état | `src/gateway/protocol/schema/snapshot.ts` | 1-58 |

**Constantes Clés** :
- `PROTOCOL_VERSION = 3` : Version actuelle du protocole
- `ErrorCodes` : Énumération des codes d'erreur (NOT_LINKED, NOT_PAIRED, AGENT_TIMEOUT, INVALID_REQUEST, UNAVAILABLE)

**Types Clés** :
- `GatewayFrame` : Type union de trame de passerelle (RequestFrame | ResponseFrame | EventFrame)
- `RequestFrame` : Type de trame de requête
- `ResponseFrame` : Type de trame de réponse
- `EventFrame` : Type de trame d'événement
- `HelloOk` : Type de réponse de succès de poignée de main
- `ErrorShape` : Type de forme d'erreur

</details>
