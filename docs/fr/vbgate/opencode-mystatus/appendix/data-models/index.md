---
title: "Modèles de données : auth et API | opencode-mystatus"
sidebarTitle: "Modèles de données"
subtitle: "Modèles de données : structure des fichiers d'authentification et format des réponses API"
description: "Découvrez la structure des fichiers d'authentification et les formats de réponse API pour OpenAI, Zhipu AI, GitHub Copilot et Google Cloud."
tags:
  - "Modèles de données"
  - "Fichiers d'authentification"
  - "Réponse API"
prerequisite:
  - "start-quick-start"
order: 1
---

# Modèles de données : structure des fichiers d'authentification et format des réponses API

> 💡 **Cette annexe est destinée aux développeurs** : Si vous souhaitez comprendre comment le plugin lit et analyse les fichiers d'authentification, ou étendre le support pour d'autres plateformes, vous trouverez ici une référence complète des modèles de données.

## Ce que vous apprendrez

- Découvrir quels fichiers d'authentification le plugin lit
- Comprendre les formats de réponse API de chaque plateforme
- Savoir comment étendre le plugin pour prendre en charge de nouvelles plateformes

## Contenu de cette annexe

- Structure des fichiers d'authentification (3 fichiers de configuration)
- Format des réponses API (5 plateformes)
- Types de données internes

---

## Structure des fichiers d'authentification

### Fichier d'authentification principal : `~/.local/share/opencode/auth.json`

Stockage d'authentification officielle d'OpenCode, le plugin lit les informations d'authentification pour OpenAI, Zhipu AI, Z.ai et GitHub Copilot à partir d'ici.

```typescript
interface AuthData {
  /** Authentification OAuth OpenAI */
  openai?: OpenAIAuthData;

  /** Authentification API Zhipu AI */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Authentification API Z.ai */
  "zai-coding-plan"?: ZhipuAuthData;

  /** Authentification OAuth GitHub Copilot */
  "github-copilot"?: CopilotAuthData;
}
```

#### Données d'authentification OpenAI

```typescript
interface OpenAIAuthData {
  type: string;        // Valeur fixe "oauth"
  access?: string;     // Jeton d'accès OAuth
  refresh?: string;    // Jeton de rafraîchissement OAuth
  expires?: number;    // Horodatage d'expiration (millisecondes)
}
```

**Source des données** : Processus d'authentification OAuth officielle d'OpenCode

#### Données d'authentification Zhipu AI / Z.ai

```typescript
interface ZhipuAuthData {
  type: string;   // Valeur fixe "api"
  key?: string;    // Clé API
}
```

**Source des données** : Clé API configurée par l'utilisateur dans OpenCode

#### Données d'authentification GitHub Copilot

```typescript
interface CopilotAuthData {
  type: string;        // Valeur fixe "oauth"
  refresh?: string;     // Jeton OAuth
  access?: string;      // Jeton de session Copilot (optionnel)
  expires?: number;    // Horodatage d'expiration (millisecondes)
}
```

**Source des données** : Processus d'authentification OAuth officielle d'OpenCode

---

### Configuration PAT Copilot : `~/.config/opencode/copilot-quota-token.json`

PAT (Personal Access Token) Fine-grained configuré par l'utilisateur, utilisé pour interroger le quota via l'API publique GitHub (sans avoir besoin d'autorisations Copilot).

```typescript
interface CopilotQuotaConfig {
  /** PAT Fine-grained (nécessite l'autorisation de lecture "Plan") */
  token: string;

  /** Nom d'utilisateur GitHub (nécessaire pour l'appel API) */
  username: string;

  /** Type d'abonnement Copilot (détermine la limite mensuelle) */
  tier: CopilotTier;
}

/** Énumération du type d'abonnement Copilot */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**Limites de quota mensuelles par type d'abonnement** :

| tier      | Quota mensuel (Premium Requests) |
|--- | ---|
| `free`    | 50                                |
| `pro`     | 300                               |
| `pro+`    | 1,500                             |
| `business` | 300                               |
| `enterprise` | 1,000                           |

---

### Comptes Google Cloud : `~/.config/opencode/antigravity-accounts.json`

Fichier de comptes créé par le plugin `opencode-antigravity-auth`, prenant en charge plusieurs comptes.

```typescript
interface AntigravityAccountsFile {
  version: number;               // Numéro de version du format de fichier
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Email Google (pour l'affichage) */
  email?: string;

  /** Jeton de rafraîchissement OAuth (requis) */
  refreshToken: string;

  /** ID de projet Google (au choix) */
  projectId?: string;

  /** ID de projet géré (au choix) */
  managedProjectId?: string;

  /** Horodatage d'ajout du compte (millisecondes) */
  addedAt: number;

  /** Horodatage de dernière utilisation (millisecondes) */
  lastUsed: number;

  /** Temps de réinitialisation par modèle (clé modèle → horodatage) */
  rateLimitResetTimes?: Record<string, number>;
}
```

**Source des données** : Processus d'authentification OAuth du plugin `opencode-antigravity-auth`

---

## Format des réponses API

### Format de réponse OpenAI

**Point de terminaison API** : `GET https://chatgpt.com/backend-api/wham/usage`

**Méthode d'authentification** : Bearer Token (Jeton d'accès OAuth)

```typescript
interface OpenAIUsageResponse {
  /** Type de plan : plus, team, pro, etc. */
  plan_type: string;

  /** Informations sur les limites de quota */
  rate_limit: {
    /** Si la limite est atteinte */
    limit_reached: boolean;

    /** Fenêtre principale (3 heures) */
    primary_window: RateLimitWindow;

    /** Fenêtre secondaire (24 heures, optionnelle) */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** Informations sur la fenêtre de limite */
interface RateLimitWindow {
  /** Pourcentage utilisé */
  used_percent: number;

  /** Durée de la fenêtre de limite (secondes) */
  limit_window_seconds: number;

  /** Secondes avant réinitialisation */
  reset_after_seconds: number;
}
```

**Exemple de réponse** :

```json
{
  "plan_type": "team",
  "rate_limit": {
    "limit_reached": false,
    "primary_window": {
      "used_percent": 15,
      "limit_window_seconds": 10800,
      "reset_after_seconds": 9000
    },
    "secondary_window": {
      "used_percent": 23,
      "limit_window_seconds": 86400,
      "reset_after_seconds": 43200
    }
  }
}
```

---

### Format de réponse Zhipu AI / Z.ai

**Point de terminaison API** :
- Zhipu AI : `GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai : `GET https://api.z.ai/api/monitor/usage/quota/limit`

**Méthode d'authentification** : En-tête Authorization (Clé API)

```typescript
interface QuotaLimitResponse {
  code: number;   // 200 en cas de succès
  msg: string;    // Message d'erreur ("success" en cas de succès)
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** Élément de limite unique */
interface UsageLimitItem {
  /** Type de limite */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** Valeur actuelle */
  currentValue: number;

  /** Valeur totale */
  usage: number;

  /** Pourcentage utilisé */
  percentage: number;

  /** Horodatage de prochaine réinitialisation (millisecondes, uniquement valide pour TOKENS_LIMIT) */
  nextResetTime?: number;
}
```

**Description des types de limites** :

| type          | Description               | Période de réinitialisation |
|--- | --- | ---|
| `TOKENS_LIMIT` | Limite de token sur 5 heures  | 5 heures                    |
| `TIME_LIMIT`   | Quota mensuel MCP          | 1 mois                      |

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
        "currentValue": 500000,
        "usage": 10000000,
        "percentage": 5,
        "nextResetTime": 1737926400000
      },
      {
        "type": "TIME_LIMIT",
        "currentValue": 120,
        "usage": 2000,
        "percentage": 6
      }
    ]
  }
}
```

---

### Format de réponse GitHub Copilot

Copilot prend en charge deux méthodes d'interrogation API, avec des formats de réponse différents.

#### Méthode 1 : API interne (nécessite les autorisations Copilot)

**Point de terminaison API** : `GET https://api.github.com/copilot_internal/user`

**Méthode d'authentification** : Bearer Token (OAuth ou jeton après échange)

```typescript
interface CopilotUsageResponse {
  /** Type SKU (pour distinguer les abonnements) */
  access_type_sku: string;

  /** ID de suivi analytique */
  analytics_tracking_id: string;

  /** Date d'attribution */
  assigned_date: string;

  /** Peut s'inscrire à un plan limité */
  can_signup_for_limited: boolean;

  /** Chat activé */
  chat_enabled: boolean;

  /** Type de plan Copilot */
  copilot_plan: string;

  /** Date de réinitialisation du quota (format : YYYY-MM) */
  quota_reset_date: string;

  /** Snapshots de quota */
  quota_snapshots: QuotaSnapshots;
}

/** Snapshots de quota */
interface QuotaSnapshots {
  /** Quota de chat (optionnel) */
  chat?: QuotaDetail;

  /** Quota de complétions (optionnel) */
  completions?: QuotaDetail;

  /** Interactions Premium (requis) */
  premium_interactions: QuotaDetail;
}

/** Détails du quota */
interface QuotaDetail {
  /** Limite de quota */
  entitlement: number;

  /** Nombre de dépassements */
  overage_count: number;

  /** Dépassement autorisé */
  overage_permitted: boolean;

  /** Pourcentage restant */
  percent_remaining: number;

  /** ID de quota */
  quota_id: string;

  /** Quota restant */
  quota_remaining: number;

  /** Quantité restante (identique à quota_remaining) */
  remaining: number;

  /** Illimité */
  unlimited: boolean;
}
```

#### Méthode 2 : API Billing publique (nécessite PAT Fine-grained)

**Point de terminaison API** : `GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**Méthode d'authentification** : Bearer Token (PAT Fine-grained, nécessite l'autorisation de lecture "Plan")

```typescript
interface BillingUsageResponse {
  /** Période temporelle */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** Nom d'utilisateur */
  user: string;

  /** Liste des éléments d'utilisation */
  usageItems: BillingUsageItem[];
}

/** Élément d'utilisation */
interface BillingUsageItem {
  /** Nom du produit */
  product: string;

  /** Identifiant SKU */
  sku: string;

  /** Nom du modèle (optionnel) */
  model?: string;

  /** Type d'unité (comme "requests") */
  unitType: string;

  /** Quantité totale de demandes (avant remise) */
  grossQuantity: number;

  /** Quantité nette de demandes (après remise) */
  netQuantity: number;

  /** Limite de quota (optionnelle) */
  limit?: number;
}
```

**Exemple de réponse** :

```json
{
  "timePeriod": {
    "year": 2026,
    "month": 1
  },
  "user": "octocat",
  "usageItems": [
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "gpt-4o",
      "unitType": "requests",
      "grossQuantity": 229,
      "netQuantity": 229,
      "limit": 300
    },
    {
      "product": "GitHub Copilot",
      "sku": "Copilot Premium Request",
      "model": "claude-3-5-sonnet",
      "unitType": "requests",
      "grossQuantity": 71,
      "netQuantity": 71,
      "limit": 300
    }
  ]
}
```

---

### Format de réponse Google Cloud

**Point de terminaison API** : `POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**Méthode d'authentification** : Bearer Token (Jeton d'accès OAuth)

**Corps de la demande** :

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** Liste des modèles (clé = ID de modèle) */
  models: Record<
    string,
    {
      /** Informations de quota (optionnel) */
      quotaInfo?: {
        /** Fraction restante (0-1) */
        remainingFraction?: number;

        /** Heure de réinitialisation (format ISO 8601) */
        resetTime?: string;
      };
    }
  >;
}
```

**Exemple de réponse** :

```json
{
  "models": {
    "gemini-3-pro-high": {
      "quotaInfo": {
        "remainingFraction": 0.83,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-pro-image": {
      "quotaInfo": {
        "remainingFraction": 0.91,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "gemini-3-flash": {
      "quotaInfo": {
        "remainingFraction": 1.0,
        "resetTime": "2026-01-23T20:00:00Z"
      }
    },
    "claude-opus-4-5-thinking": {
      "quotaInfo": {
        "remainingFraction": 0.0,
        "resetTime": "2026-01-25T00:00:00Z"
      }
    }
  }
}
```

**4 modèles affichés** :

| Nom affiché | Clé de modèle                               | Clé alternative           |
|--- | --- | ---|
| G3 Pro      | `gemini-3-pro-high`                         | `gemini-3-pro-low`        |
| G3 Image    | `gemini-3-pro-image`                        | -                         |
| G3 Flash    | `gemini-3-flash`                            | -                         |
| Claude      | `claude-opus-4-5-thinking`                  | `claude-opus-4-5`         |

---

## Types de données internes

### Type de résultat de requête

Toutes les fonctions de requête de plateforme renvoient un format de résultat unifié.

```typescript
interface QueryResult {
  /** Si réussi */
  success: boolean;

  /** Contenu de sortie en cas de succès */
  output?: string;

  /** Message d'erreur en cas d'échec */
  error?: string;
}
```

### Configuration des constantes

```typescript
/** Seuil d'avertissement d'utilisation élevée (pourcentage) */
export const HIGH_USAGE_THRESHOLD = 80;

/** Délai d'expiration de demande API (millisecondes) */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquez pour afficher l'emplacement du code source</strong></summary>

> Date de mise à jour : 2026-01-23

| Fonction              | Chemin du fichier                                                                                              | Ligne    |
|--- | --- | ---|
| Type de données d'authentification      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104)        | 99-104  |
| Authentification OpenAI       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)         | 28-33   |
| Authentification Zhipu AI      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41)         | 38-41   |
| Authentification Copilot      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)         | 46-51   |
| Configuration PAT Copilot  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)         | 66-73   |
| Comptes Antigravity  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)         | 78-94   |
| Format de réponse OpenAI   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36)         | 29-36   |
| Format de réponse Zhipu AI  | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50)         | 43-50   |
| API interne Copilot   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58)        | 47-58   |
| API Billing Copilot | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84)        | 80-84   |
| Réponse Google Cloud  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37)       | 27-37   |

**Constantes clés** :
- `HIGH_USAGE_THRESHOLD = 80` : Seuil d'avertissement d'utilisation élevée (types.ts:111)
- `REQUEST_TIMEOUT_MS = 10000` : Délai d'expiration de demande API (types.ts:114)

**Types clés** :
- `QueryResult` : Type de résultat de requête (types.ts:15-19)
- `CopilotTier` : Énumération du type d'abonnement Copilot (types.ts:57)

</details>
