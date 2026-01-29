---
title: "Résumé des API: Interfaces officielles | opencode-mystatus"
sidebarTitle: "Résumé API"
subtitle: "Résumé des API"
description: "Découvrez les interfaces API officielles d'opencode-mystatus. Couvre OpenAI, Zhipu AI, Z.ai, Google Cloud et GitHub Copilot avec méthodes d'authentification et formats de réponse."
tags:
  - "api"
  - "endpoints"
  - "référence"
prerequisite:
  - "appendix-data-models"
order: 2
---

# Résumé des API

## Ce que vous apprendrez

- Découvrir toutes les interfaces API officielles appelées par le plugin
- Comprendre les méthodes d'authentification de chaque plateforme (OAuth / API Key)
- Maîtriser les formats de demande et de réponse
- Savoir comment appeler ces API indépendamment

## Qu'est-ce qu'une interface API

Une interface API (Application Programming Interface) est un pont de communication entre les programmes. opencode-mystatus obtient vos données de quota en appelant les interfaces API officielles de chaque plateforme.

::: info Pourquoi comprendre ces interfaces ?
Comprendre ces interfaces vous permet de :
1. Vérifier la source des données du plugin, garantissant la sécurité
2. Appeler manuellement les interfaces pour obtenir des données lorsque le plugin ne fonctionne pas
3. Apprendre à construire des outils similaires d'interrogation de quota
:::

## Interface OpenAI

### Interroger le quota

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| Méthode | GET |
| Méthode d'authentification | Bearer Token (OAuth) |
| Emplacement du code source | `plugin/lib/openai.ts:127-155` |

**En-têtes de demande** :

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // Optionnel, nécessaire pour les comptes d'équipe
```

**Exemple de réponse** :

```json
{
  "plan_type": "Plus",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9180
    },
    "secondary_window": {
      "used_percent": 5,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 82800
    }
  }
}
```

**Description des champs de réponse** :

- `plan_type`: Type d'abonnement (Plus / Team / Pro)
- `rate_limit.primary_window`: Limite de la fenêtre principale (généralement 3 heures)
- `rate_limit.secondary_window`: Limite de la fenêtre secondaire (généralement 24 heures)
- `used_percent`: Pourcentage utilisé (0-100)
- `reset_after_seconds`: Secondes avant réinitialisation

---

## Interface Zhipu AI

### Interroger le quota

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| Méthode | GET |
| Méthode d'authentification | API Key |
| Emplacement du code source | `plugin/lib/zhipu.ts:62-106` |

**En-têtes de demande** :

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Exemple de réponse** :

```json
{
  "code": 200,
  "msg": "success",
  "success": true,
  "data": {
    "limits": [
      {
        "type": "TOKENS_LIMIT",
        "usage": 10000000,
        "currentValue": 500000,
        "percentage": 5,
        "nextResetTime": 1706200000000
      },
      {
        "type": "TIME_LIMIT",
        "usage": 100,
        "currentValue": 10,
        "percentage": 10
      }
    ]
  }
}
```

**Description des champs de réponse** :

- `limits[].type`: Type de limite
  - `TOKENS_LIMIT`: Limite de token sur 5 heures
  - `TIME_LIMIT`: Quota mensuel MCP
- `usage`: Quota total
- `currentValue`: Utilisation actuelle
- `percentage`: Pourcentage utilisé (0-100)
- `nextResetTime`: Horodatage de la prochaine réinitialisation (uniquement valide pour TOKENS_LIMIT, unité : millisecondes)

---

## Interface Z.ai

### Interroger le quota

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| Méthode | GET |
| Méthode d'authentification | API Key |
| Emplacement du code source | `plugin/lib/zhipu.ts:64, 85-106` |

**En-têtes de demande** :

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Format de réponse** : Identique à Zhipu AI, voir ci-dessus.

---

## Interface Google Cloud

### 1. Rafraîchir le jeton d'accès

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://oauth2.googleapis.com/token` |
| Méthode | POST |
| Méthode d'authentification | OAuth Refresh Token |
| Emplacement du code source | `plugin/lib/google.ts:90, 162-184` |

**En-têtes de demande** :

```http
Content-Type: application/x-www-form-urlencoded
```

**Corps de la demande** :

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**Exemple de réponse** :

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**Description des champs** :

- `access_token`: Nouveau jeton d'accès (valide 1 heure)
- `expires_in`: Temps d'expiration (secondes)

---

### 2. Interroger le quota des modèles disponibles

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| Méthode | POST |
| Méthode d'authentification | Bearer Token (OAuth) |
| Emplacement du code source | `plugin/lib/google.ts:65, 193-213` |

**En-têtes de demande** :

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**Corps de la demande** :

```json
{
  "project": "{project_id}"
}
```

**Exemple de réponse** :

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.85,
        "resetTime": "2026-01-24T00:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T12:00:00Z"
      }
    }
  }
}
```

**Description des champs de réponse** :

- `models`: Liste des modèles (la clé est le nom du modèle)
- `quotaInfo.remainingFraction`: Fraction restante (0.0-1.0)
- `quotaInfo.resetTime`: Heure de réinitialisation (format ISO 8601)

---

## Interface GitHub Copilot

### 1. API Billing publique (recommandée)

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| Méthode | GET |
| Méthode d'authentification | Fine-grained PAT (Personal Access Token) |
| Emplacement du code source | `plugin/lib/copilot.ts:157-177` |

**En-têtes de demande** :

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip Qu'est-ce qu'un Fine-grained PAT ?
Le Fine-grained PAT (Personal Access Token Fine-grained) est un nouveau type de jeton de GitHub prenant en charge un contrôle plus fin des autorisations. Pour interroger le quota Copilot, vous devez accorder l'autorisation de lecture "Plan".
:::

**Exemple de réponse** :

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "username",
  "usageItems": [
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4",
      "unitType": "request",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3.5-sonnet",
      "unitType": "request",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

**Description des champs de réponse** :

- `timePeriod`: Cycle temporel (année, mois)
- `user`: Nom d'utilisateur GitHub
- `usageItems`: Tableau des détails d'utilisation
  - `sku`: Nom SKU (`Copilot Premium Request` indique Premium Requests)
  - `model`: Nom du modèle
  - `grossQuantity`: Nombre total de demandes (avant remise)
  - `netQuantity`: Nombre net de demandes (après remise)
  - `limit`: Limite

---

### 2. API de quota interne (ancienne version)

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://api.github.com/copilot_internal/user` |
| Méthode | GET |
| Méthode d'authentification | Copilot Session Token |
| Emplacement du code source | `plugin/lib/copilot.ts:242-304` |

**En-têtes de demande** :

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Exemple de réponse** :

```json
{
  "copilot_plan": "pro",
  "quota_reset_date": "2026-02-01",
  "quota_snapshots": {
    "premium_interactions": {
      "entitlement": 300,
      "overage_count": 0,
      "overage_permitted": true,
      "percent_remaining": 24,
      "quota_id": "premium_interactions",
      "quota_remaining": 71,
      "remaining": 71,
      "unlimited": false
    },
    "chat": {
      "entitlement": 1000,
      "percent_remaining": 50,
      "quota_remaining": 500,
      "unlimited": false
    },
    "completions": {
      "entitlement": 2000,
      "percent_remaining": 80,
      "quota_remaining": 1600,
      "unlimited": false
    }
  }
}
```

**Description des champs de réponse** :

- `copilot_plan`: Type d'abonnement (`free` / `pro` / `pro+` / `business` / `enterprise`)
- `quota_reset_date`: Date de réinitialisation du quota (YYYY-MM-DD)
- `quota_snapshots.premium_interactions`: Premium Requests (quota principal)
- `quota_snapshots.chat`: Quota Chat (si calculé séparément)
- `quota_snapshots.completions`: Quota Completions (si calculé séparément)

---

### 3. API d'échange de jetons

**Informations sur l'interface** :

| Élément | Valeur |
| ------- | ------ |
| URL | `https://api.github.com/copilot_internal/v2/token` |
| Méthode | POST |
| Méthode d'authentification | Jeton OAuth (obtenu à partir d'OpenCode) |
| Emplacement du code source | `plugin/lib/copilot.ts:183-208` |

**En-têtes de demande** :

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Exemple de réponse** :

```json
{
  "token": "gho_xxx_copilot_session",
  "expires_at": 1706203600,
  "refresh_in": 3600,
  "endpoints": {
    "api": "https://api.github.com"
  }
}
```

**Description des champs de réponse** :

- `token`: Jeton de session Copilot (pour appeler l'API interne)
- `expires_at`: Horodatage d'expiration (secondes)
- `refresh_in`: Heure de rafraîchissement recommandée (secondes)

::: warning Remarque
Cette interface ne s'applique qu'au processus d'authentification OAuth de l'ancienne version de GitHub. Le nouveau processus officiel d'intégration OAuth d'OpenCode (à partir de janvier 2026) peut nécessiter l'utilisation d'un Fine-grained PAT.
:::

---

## Comparaison des méthodes d'authentification

| Plateforme | Méthode d'authentification | Source des identifiants | Fichier d'identifiants |
| ---------- | -------------------------- | ----------------------- | ----------------------- |
| **OpenAI** | OAuth Bearer Token | OAuth OpenCode | `~/.local/share/opencode/auth.json` |
| **Zhipu AI** | API Key | Configuration manuelle utilisateur | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | Configuration manuelle utilisateur | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | Plugin opencode-antigravity-auth | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | Configuration manuelle ou OAuth | `~/.config/opencode/copilot-quota-token.json` ou `~/.local/share/opencode/auth.json` |

---

## Délai de demande

Toutes les demandes API ont une limite de délai de 10 secondes pour éviter les attentes prolongées :

| Configuration | Valeur | Emplacement du code source |
| ------------- | ------ | ------------------------- |
| Temps de délai | 10 secondes | `plugin/lib/types.ts:114` |
| Implémentation du délai | Fonction `fetchWithTimeout` | `plugin/lib/utils.ts:84-100` |

---

## Sécurité

### Masquage de la clé API

Le plugin masque automatiquement la clé API lors de l'affichage, ne montrant que les 2 premiers et les 2 derniers caractères :

```typescript
// Exemple : sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**Emplacement du code source** : `plugin/lib/utils.ts:130-139`

### Stockage des données

- Tous les fichiers d'authentification sont **uniquement en lecture seule**, le plugin ne modifie aucun fichier
- Les données de réponse API **ne sont pas mises en cache**, **ne sont pas stockées**
- Les informations sensibles (clé API, jeton) sont masquées dans la mémoire avant l'affichage

**Emplacement du code source** :
- `plugin/mystatus.ts:35-46` (lecture des fichiers d'authentification)
- `plugin/lib/utils.ts:130-139` (fonction de masquage)

---

## Résumé de cette leçon

Cette leçon a présenté toutes les interfaces API officielles appelées par le plugin opencode-mystatus :

| Plateforme | Nombre d'API | Méthode d'authentification |
| ---------- | ------------ | -------------------------- |
| OpenAI | 1 | OAuth Bearer Token |
| Zhipu AI | 1 | API Key |
| Z.ai | 1 | API Key |
| Google Cloud | 2 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 | Fine-grained PAT / Copilot Session Token |

Toutes les interfaces sont des interfaces officielles de chaque plateforme, garantissant une source de données fiable et sécurisée. Le plugin obtient les identifiants via des fichiers d'authentification locaux en lecture seule, ne téléchargeant aucune donnée.

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction | Chemin du fichier | Ligne |
| --- | --- | --- |
| API d'interrogation de quota OpenAI | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| API d'interrogation de quota Zhipu AI | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| API d'interrogation de quota Z.ai | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64 (interface partagée) |
| Rafraîchissement du jeton OAuth Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| API d'interrogation de quota Google Cloud | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| API Billing publique GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| API de quota interne GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| API d'échange de jetons GitHub Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| Fonction de masquage de clé API | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| Configuration du délai de demande | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**Constantes clés** :

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"` : Interface d'interrogation de quota OpenAI
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"` : Interface d'interrogation de quota Zhipu AI
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"` : Interface d'interrogation de quota Z.ai
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"` : Interface d'interrogation de quota Google Cloud
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"` : Interface de rafraîchissement du jeton OAuth Google Cloud

**Fonctions clés** :

- `fetchOpenAIUsage()` : Appelle l'API de quota OpenAI
- `fetchUsage()` : Appelle l'API de quota Zhipu AI / Z.ai (générique)
- `refreshAccessToken()` : Rafraîchit le jeton d'accès Google
- `fetchGoogleUsage()` : Appelle l'API de quota Google Cloud
- `fetchPublicBillingUsage()` : Appelle l'API Billing publique GitHub Copilot
- `fetchCopilotUsage()` : Appelle l'API de quota interne GitHub Copilot
- `exchangeForCopilotToken()` : Échange le jeton OAuth contre un jeton de session Copilot
- `maskString()` : Masque la clé API

</details>
