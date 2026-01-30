---
title: "Spécification API : Référence Technique de la Passerelle Antigravity | antigravity-auth"
sidebarTitle: "Déboguer les Appels API"
subtitle: "Spécification de l'API Antigravity"
description: "Apprenez la spécification de l'API Antigravity : configuration des endpoints de la passerelle unifiée, authentification OAuth 2.0, formats de requête/réponse, règles d'appel de fonctions et gestion des erreurs."
tags:
  - "API"
  - "Spécification"
  - "Antigravity"
  - "Référence Technique"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Spécification de l'API Antigravity

> **⚠️ Avertissement Important** : Il s'agit de la **spécification interne de l'API** Antigravity, et non d'une documentation publique. Ce tutoriel est basé sur des tests directs de l'API et s'adresse aux développeurs souhaitant comprendre en profondeur les détails de l'API.

Si vous souhaitez simplement utiliser le plugin, consultez le [Démarrage Rapide](/fr/NoeFabris/opencode-antigravity-auth/start/quick-install/) et le [Guide de Configuration](/fr/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/).

---

## Ce Que Vous Allez Apprendre

- Comprendre le fonctionnement de l'API de passerelle unifiée Antigravity
- Maîtriser les formats de requête/réponse et les limitations du JSON Schema
- Savoir configurer les modèles Thinking et les appels de fonctions
- Comprendre les mécanismes de limitation de débit et de gestion des erreurs
- Être capable de déboguer les problèmes d'appels API

---

## Vue d'Ensemble de l'API Antigravity

**Antigravity** est l'API de passerelle unifiée de Google qui permet d'accéder à plusieurs modèles d'IA (Claude, Gemini, etc.) via une interface de style Gemini, offrant un format unique et une structure de réponse unifiée.

::: info Différence avec Vertex AI
Antigravity **n'est pas** une API directe de modèle Vertex AI. C'est une passerelle interne qui fournit :
- Un format d'API unique (tous les modèles utilisent le style Gemini)
- Un accès au niveau projet (via l'authentification Google Cloud)
- Un routage interne vers les backends de modèles (Vertex AI pour Claude, Gemini API pour Gemini)
- Un format de réponse unifié (structure `candidates[]`)
:::

**Caractéristiques Principales** :

| Caractéristique | Description |
| --- | --- |
| **Format API Unique** | Tous les modèles utilisent le tableau `contents` de style Gemini |
| **Accès Niveau Projet** | Nécessite un Project ID Google Cloud valide |
| **Routage Interne** | Routage automatique vers le bon backend (Vertex AI ou Gemini API) |
| **Réponse Unifiée** | Tous les modèles retournent une structure `candidates[]` |
| **Support Thinking** | Claude et Gemini 3 supportent le raisonnement étendu |

---

## Endpoints et Chemins

### Environnements API

| Environnement | URL | Statut | Usage |
| --- | --- | --- | --- |
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ Actif | Endpoint principal (identique à CLIProxy) |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ Actif | Modèles Gemini CLI, loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ Indisponible | Obsolète |

**Emplacement dans le code source** : [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### Chemins API

| Action | Chemin | Description |
| --- | --- | --- |
| Générer du contenu | `/v1internal:generateContent` | Requête non-streaming |
| Génération streaming | `/v1internal:streamGenerateContent?alt=sse` | Requête streaming (SSE) |
| Charger l'assistant code | `/v1internal:loadCodeAssist` | Découverte de projet (obtention automatique du Project ID) |
| Onboarding utilisateur | `/v1internal:onboardUser` | Onboarding utilisateur (rarement utilisé) |

---

## Méthodes d'Authentification

### Flux OAuth 2.0

```
URL d'autorisation : https://accounts.google.com/o/oauth2/auth
URL du token : https://oauth2.googleapis.com/token
```

### Scopes Requis

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**Emplacement dans le code source** : [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### Headers Requis

#### Endpoint Antigravity (par défaut)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Endpoint Gemini CLI (modèles sans suffixe `:antigravity`)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### Header Supplémentaire pour les Requêtes Streaming

```http
Accept: text/event-stream
```

**Emplacement dans le code source** : [`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## Format des Requêtes

### Structure de Base

```json
{
  "project": "{project_id}",
  "model": "{model_id}",
  "request": {
    "contents": [...],
    "generationConfig": {...},
    "systemInstruction": {...},
    "tools": [...]
  },
  "userAgent": "antigravity",
  "requestId": "{unique_id}"
}
```

### Tableau Contents (obligatoire)

::: warning Limitation Importante
Vous devez utiliser le **format de style Gemini**. Le tableau `messages` de style Anthropic **n'est pas supporté**.
:::

**Format Correct** :

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Votre message ici" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Réponse de l'assistant" }
      ]
    }
  ]
}
```

**Valeurs de Role** :
- `user` - Messages de l'utilisateur/humain
- `model` - Réponses du modèle (**pas** `assistant`)

### Configuration de Génération

```json
{
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "stopSequences": ["STOP"],
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

| Champ | Type | Description |
| --- | --- | --- |
| `maxOutputTokens` | number | Nombre maximum de tokens dans la réponse |
| `temperature` | number | Aléatoire (0.0 - 2.0) |
| `topP` | number | Seuil de nucleus sampling |
| `topK` | number | Top-K sampling |
| `stopSequences` | string[] | Mots déclencheurs pour arrêter la génération |
| `thinkingConfig` | object | Configuration du raisonnement étendu (modèles Thinking) |

### Instructions Système

::: warning Limitation de Format
L'instruction système **doit être un objet contenant `parts`**, elle **ne peut pas** être une simple chaîne de caractères.
:::

```json
// ✅ Correct
{
  "systemInstruction": {
    "parts": [
      { "text": "Vous êtes un assistant utile." }
    ]
  }
}

// ❌ Incorrect - retournera une erreur 400
{
  "systemInstruction": "Vous êtes un assistant utile."
}
```

### Outils / Appel de Fonctions

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Obtenir la météo pour un lieu",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "Nom de la ville"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ]
}
```

#### Règles de Nommage des Fonctions

| Règle | Description |
| --- | --- |
| Premier caractère | Doit être une lettre (a-z, A-Z) ou un underscore (_) |
| Caractères autorisés | `a-zA-Z0-9`, underscore (_), point (.), deux-points (:), tiret (-) |
| Longueur maximale | 64 caractères |
| Non autorisé | Slash (/), espaces, autres caractères spéciaux |

**Exemples** :
- ✅ `get_weather` - Valide
- ✅ `mcp:mongodb.query` - Valide (deux-points et points autorisés)
- ✅ `read-file` - Valide (tirets autorisés)
- ❌ `mcp/query` - Invalide (slashs non autorisés)
- ❌ `123_tool` - Invalide (doit commencer par une lettre ou un underscore)

---

## Support JSON Schema

### Fonctionnalités Supportées

| Fonctionnalité | Statut | Description |
| --- | --- | --- |
| `type` | ✅ Supporté | `object`, `string`, `number`, `integer`, `boolean`, `array` |
| `properties` | ✅ Supporté | Propriétés d'objet |
| `required` | ✅ Supporté | Tableau des champs obligatoires |
| `description` | ✅ Supporté | Description des champs |
| `enum` | ✅ Supporté | Valeurs énumérées |
| `items` | ✅ Supporté | Schema des éléments de tableau |
| `anyOf` | ✅ Supporté | Converti en interne en `any_of` |
| `allOf` | ✅ Supporté | Converti en interne en `all_of` |
| `oneOf` | ✅ Supporté | Converti en interne en `one_of` |
| `additionalProperties` | ✅ Supporté | Schema des propriétés supplémentaires |

### Fonctionnalités Non Supportées (provoquent une erreur 400)

::: danger Les champs suivants provoquent une erreur 400
- `const` - Utilisez `enum: [value]` à la place
- `$ref` - Définissez le schema en ligne
- `$defs` / `definitions` - Définissez en ligne
- `$schema` - Supprimez ces champs de métadonnées
- `$id` - Supprimez ces champs de métadonnées
- `default` - Supprimez ces champs de documentation
- `examples` - Supprimez ces champs de documentation
- `title` (imbriqué) - ⚠️ Peut causer des problèmes dans les objets imbriqués
:::

```json
// ❌ Incorrect - retournera une erreur 400
{ "type": { "const": "email" } }

// ✅ Correct - utilisez enum à la place
{ "type": { "enum": ["email"] } }
```

**Traitement Automatique par le Plugin** : Le plugin gère automatiquement ces conversions via la fonction `cleanJSONSchemaForAntigravity()` dans `request-helpers.ts`.

---

## Format des Réponses

### Réponse Non-Streaming

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Texte de la réponse ici" }
          ]
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 16,
      "candidatesTokenCount": 4,
      "totalTokenCount": 20
    },
    "modelVersion": "claude-sonnet-4-5",
    "responseId": "msg_vrtx_..."
  },
  "traceId": "abc123..."
}
```

### Réponse Streaming (SSE)

**Content-Type** : `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Bonjour"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " le monde"}]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### Description des Champs de Réponse

| Champ | Description |
| --- | --- |
| `response.candidates` | Tableau des candidats de réponse |
| `response.candidates[].content.role` | Toujours `"model"` |
| `response.candidates[].content.parts` | Tableau des parties de contenu |
| `response.candidates[].finishReason` | `STOP`, `MAX_TOKENS`, `OTHER` |
| `response.usageMetadata.promptTokenCount` | Nombre de tokens en entrée |
| `response.usageMetadata.candidatesTokenCount` | Nombre de tokens en sortie |
| `response.usageMetadata.totalTokenCount` | Nombre total de tokens |
| `response.usageMetadata.thoughtsTokenCount` | Nombre de tokens Thinking (Gemini) |
| `response.modelVersion` | Modèle réellement utilisé |
| `response.responseId` | ID de requête (format variable selon le modèle) |
| `traceId` | ID de trace pour le débogage |

### Format de l'ID de Réponse

| Type de Modèle | Format | Exemple |
| --- | --- | --- |
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Style Base64 | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Style Base64 | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Réponse d'Appel de Fonction

Lorsque le modèle souhaite appeler une fonction :

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "functionCall": {
                "name": "get_weather",
                "args": {
                  "location": "Paris"
                },
                "id": "toolu_vrtx_01PDbPTJgBJ3AJ8BCnSXvUqk"
              }
            }
          ]
        },
        "finishReason": "OTHER"
      }
    ]
  }
}
```

### Fournir le Résultat de la Fonction

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "Quel temps fait-il ?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / Raisonnement Étendu

### Configuration Thinking

Pour les modèles supportant le Thinking (`*-thinking`) :

```json
{
  "generationConfig": {
    "maxOutputTokens": 10000,
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

::: warning Limitation Importante
`maxOutputTokens` doit être **supérieur à** `thinkingBudget`
:::

### Réponse Thinking (Gemini)

Les modèles Gemini retournent le thinking avec une signature :

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Laissez-moi réfléchir à cela..."
    },
    {
      "text": "La réponse est..."
    }
  ]
}
```

### Réponse Thinking (Claude)

Les modèles Claude thinking peuvent inclure des parties avec `thought: true` :

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Processus de raisonnement...",
      "thoughtSignature": "..."
    },
    {
      "text": "Réponse finale..."
    }
  ]
}
```

**Traitement par le Plugin** : Le plugin met automatiquement en cache les signatures thinking pour éviter les erreurs de signature lors des conversations multi-tours. Voir [advanced/session-recovery/](/fr/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/) pour plus de détails.

---

## Réponses d'Erreur

### Structure d'Erreur

```json
{
  "error": {
    "code": 400,
    "message": "Description de l'erreur",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### Codes d'Erreur Courants

| Code | Statut | Description |
| --- | --- | --- |
| 400 | `INVALID_ARGUMENT` | Format de requête invalide |
| 401 | `UNAUTHENTICATED` | Token invalide ou expiré |
| 403 | `PERMISSION_DENIED` | Pas d'accès à la ressource |
| 404 | `NOT_FOUND` | Modèle non trouvé |
| 429 | `RESOURCE_EXHAUSTED` | Limite de débit dépassée |

### Réponse de Limitation de Débit

```json
{
  "error": {
    "code": 429,
    "message": "You have exhausted your capacity on this model. Your quota will reset after 3s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3.957525076s"
      }
    ]
  }
}
```

**Traitement par le Plugin** : Le plugin détecte automatiquement les erreurs 429 et bascule vers un autre compte ou attend le temps de réinitialisation. Voir [advanced/rate-limit-handling/](/fr/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/) pour plus de détails.

---

## Fonctionnalités Non Supportées

Les fonctionnalités Anthropic/Vertex AI suivantes **ne sont pas supportées** :

| Fonctionnalité | Erreur |
| --- | --- |
| `anthropic_version` | Unknown field |
| Tableau `messages` | Unknown field (utilisez `contents`) |
| `max_tokens` | Unknown field (utilisez `maxOutputTokens`) |
| `systemInstruction` en chaîne simple | Invalid value (utilisez le format objet) |
| `system_instruction` (snake_case au niveau racine) | Unknown field |
| JSON Schema `const` | Unknown field (utilisez `enum: [value]`) |
| JSON Schema `$ref` | Non supporté (définissez en ligne) |
| JSON Schema `$defs` | Non supporté (définissez en ligne) |
| Nom d'outil contenant `/` | Invalid (utilisez `_` ou `:`) |
| Nom d'outil commençant par un chiffre | Invalid (doit commencer par une lettre ou un underscore) |

---

## Exemple de Requête Complète

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Bonjour, comment allez-vous ?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "Vous êtes un assistant utile." }
      ]
    },
    "generationConfig": {
      "maxOutputTokens": 1000,
      "temperature": 0.7
    }
  },
  "userAgent": "antigravity",
  "requestId": "agent-abc123"
}
```

---

## Headers de Réponse

| Header | Description |
| --- | --- |
| `x-cloudaicompanion-trace-id` | ID de trace pour le débogage |
| `server-timing` | Durée de la requête |

---

## Comparaison Antigravity vs Vertex AI Anthropic

| Caractéristique | Antigravity | Vertex AI Anthropic |
| --- | --- | --- |
| Endpoint | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| Format de requête | `contents` style Gemini | `messages` Anthropic |
| `anthropic_version` | Non utilisé | Requis |
| Nom du modèle | Simple (`claude-sonnet-4-5`) | Versionné (`claude-4-5@date`) |
| Format de réponse | `candidates[]` | `content[]` Anthropic |
| Support multi-modèles | Oui (Claude, Gemini, etc.) | Anthropic uniquement |

---

## Résumé de Cette Leçon

Ce tutoriel a présenté en détail la spécification interne de l'API de passerelle unifiée Antigravity :

- **Endpoints** : Trois environnements (Daily, Production, Autopush), Daily Sandbox est l'endpoint principal
- **Authentification** : OAuth 2.0 + Bearer Token, scopes et headers requis
- **Format de requête** : Tableau `contents` de style Gemini, support des System Instructions et Tools
- **JSON Schema** : Supporte les fonctionnalités courantes, mais pas `const`, `$ref`, `$defs`
- **Format de réponse** : Structure `candidates[]`, support du streaming SSE
- **Thinking** : Claude et Gemini 3 supportent le raisonnement étendu, nécessite `thinkingConfig`
- **Gestion des erreurs** : Format d'erreur standard, 429 inclut le délai de réessai

Si vous déboguez des problèmes d'appels API, vous pouvez utiliser le mode debug du plugin :

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## Aperçu de la Prochaine Leçon

> Ceci est la dernière leçon de la section annexe. Si vous souhaitez en savoir plus sur les détails techniques, consultez :
> - [Vue d'Ensemble de l'Architecture](/fr/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - Comprendre l'architecture modulaire et la chaîne d'appels du plugin
> - [Format de Stockage](/fr/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - Comprendre le format des fichiers de stockage des comptes
> - [Options de Configuration](/fr/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - Manuel de référence complet de toutes les options de configuration

Si vous souhaitez revenir à la phase de démarrage, vous pouvez recommencer depuis [Qu'est-ce qu'Antigravity Auth](/fr/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/).

---

## Annexe : Référence du Code Source

<details>
<summary><strong>Cliquez pour voir les emplacements dans le code source</strong></summary>

> Dernière mise à jour : 2026-01-23

| Fonctionnalité | Chemin du fichier | Lignes |
| --- | --- | --- |
| Constantes des endpoints API | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Headers Antigravity | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Headers Gemini CLI | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| Scopes OAuth | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| Logique principale de transformation des requêtes | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| Nettoyage JSON Schema | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | Fichier entier |
| Cache des signatures thinking | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | Fichier entier |

**Constantes Clés** :
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Endpoint Daily Sandbox
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Endpoint Production
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - Project ID par défaut
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - Valeur sentinelle pour ignorer la validation des signatures thinking

**Fonctions Clés** :
- `cleanJSONSchemaForAntigravity(schema)` - Nettoie le JSON Schema pour se conformer aux exigences de l'API Antigravity
- `prepareAntigravityRequest(request)` - Prépare et envoie une requête à l'API Antigravity
- `createStreamingTransformer()` - Crée un transformateur de réponse streaming

</details>
