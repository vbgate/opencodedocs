---
title: "Data Models: Auth & API | opencode-mystatus"
sidebarTitle: "Data Models"
subtitle: "Data Models: Auth File Structures and API Response Formats"
description: "Learn auth file structures (auth.json, antigravity-accounts.json, copilot-quota-token.json) and API response formats. Covers OpenAI, Zhipu AI, Z.ai, GitHub Copilot, and Google Cloud."
tags:
  - "Data Models"
  - "Auth Files"
  - "API Responses"
prerequisite:
  - "start-quick-start"
order: 999
---

# Data Models: Auth File Structures & API Response Formats

> 💡 **This appendix is for developers**: If you want to understand how the plugin reads and parses authentication files, or if you want to extend support for more platforms yourself, this provides a complete data model reference.

## What You'll Learn

- Understand which authentication files the plugin reads
- Understand the API response formats for each platform
- Know how to extend the plugin to support new platforms

## Appendix Contents

- Auth file structures (3 config files)
- API response formats (5 platforms)
- Internal data types

---

## Auth File Structures

### Main Auth File: `~/.local/share/opencode/auth.json`

OpenCode official authentication storage. The plugin reads authentication information for OpenAI, Zhipu AI, Z.ai, and GitHub Copilot from here.

```typescript
interface AuthData {
  /** OpenAI OAuth authentication */
  openai?: OpenAIAuthData;

  /** Zhipu AI API authentication */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Z.ai API authentication */
  "zai-coding-plan"?: ZhipuAuthData;

  /** GitHub Copilot OAuth authentication */
  "github-copilot"?: CopilotAuthData;
}
```

#### OpenAI Auth Data

```typescript
interface OpenAIAuthData {
  type: string;        // Fixed value "oauth"
  access?: string;     // OAuth Access Token
  refresh?: string;    // OAuth Refresh Token
  expires?: number;    // Expiration timestamp (milliseconds)
}
```

**Data Source**: OpenCode official OAuth authentication flow

#### Zhipu AI / Z.ai Auth Data

```typescript
interface ZhipuAuthData {
  type: string;   // Fixed value "api"
  key?: string;    // API Key
}
```

**Data Source**: API Key configured by user in OpenCode

#### GitHub Copilot Auth Data

```typescript
interface CopilotAuthData {
  type: string;        // Fixed value "oauth"
  refresh?: string;     // OAuth Token
  access?: string;      // Copilot Session Token (optional)
  expires?: number;    // Expiration timestamp (milliseconds)
}
```

**Data Source**: OpenCode official OAuth authentication flow

---

### Copilot PAT Configuration: `~/.config/opencode/copilot-quota-token.json`

Optional Fine-grained PAT (Personal Access Token) configuration for querying quotas through GitHub public API (no Copilot permissions required).

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT (requires "Plan" read permission) */
  token: string;

  /** GitHub username (required for API calls) */
  username: string;

  /** Copilot subscription type (determines monthly quota limit) */
  tier: CopilotTier;
}

/** Copilot subscription type enum */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**Quota limits for each subscription type**:

| tier      | Monthly Limit (Premium Requests) |
|--- | ---|
| `free`    | 50                          |
| `pro`     | 300                         |
| `pro+`    | 1,500                       |
| `business` | 300                         |
| `enterprise` | 1,000                     |

---

### Google Cloud Accounts: `~/.config/opencode/antigravity-accounts.json`

Account file created by `opencode-antigravity-auth` plugin, supporting multiple accounts.

```typescript
interface AntigravityAccountsFile {
  version: number;               // File format version
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Google email (for display) */
  email?: string;

  /** OAuth Refresh Token (required) */
  refreshToken: string;

  /** Google project ID (one of two) */
  projectId?: string;

  /** Managed project ID (one of two) */
  managedProjectId?: string;

  /** Account added timestamp (milliseconds) */
  addedAt: number;

  /** Last used timestamp (milliseconds) */
  lastUsed: number;

  /** Rate limit reset times for each model (model key → timestamp) */
  rateLimitResetTimes?: Record<string, number>;
}
```

**Data Source**: OAuth authentication flow from `opencode-antigravity-auth` plugin

---

## API Response Formats

### OpenAI Response Format

**API Endpoint**: `GET https://chatgpt.com/backend-api/wham/usage`

**Authentication Method**: Bearer Token (OAuth Access Token)

```typescript
interface OpenAIUsageResponse {
  /** Plan type: plus, team, pro, etc. */
  plan_type: string;

  /** Quota limit information */
  rate_limit: {
    /** Whether limit is reached */
    limit_reached: boolean;

    /** Primary window (3 hours) */
    primary_window: RateLimitWindow;

    /** Secondary window (24 hours, optional) */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** Limit window information */
interface RateLimitWindow {
  /** Used percentage */
  used_percent: number;

  /** Limit window duration (seconds) */
  limit_window_seconds: number;

  /** Seconds until reset */
  reset_after_seconds: number;
}
```

**Example Response**:

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

### Zhipu AI / Z.ai Response Format

**API Endpoints**:
- Zhipu AI: `GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai: `GET https://api.z.ai/api/monitor/usage/quota/limit`

**Authentication Method**: Authorization Header (API Key)

```typescript
interface QuotaLimitResponse {
  code: number;   // 200 on success
  msg: string;    // Error message ("success" on success)
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** Single limit item */
interface UsageLimitItem {
  /** Limit type */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** Current value */
  currentValue: number;

  /** Total value */
  usage: number;

  /** Usage percentage */
  percentage: number;

  /** Next reset timestamp (milliseconds, only for TOKENS_LIMIT) */
  nextResetTime?: number;
}
```

**Limit type explanations**:

| type          | Description               | Reset Cycle  |
|--- | --- | ---|
| `TOKENS_LIMIT` | 5-hour Token limit  | 5 hours   |
| `TIME_LIMIT`   | MCP monthly quota      | 1 month   |

**Example Response**:

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

### GitHub Copilot Response Format

Copilot supports two API query methods with different response formats.

#### Method 1: Internal API (requires Copilot permission)

**API Endpoint**: `GET https://api.github.com/copilot_internal/user`

**Authentication Method**: Bearer Token (Token after OAuth or Token Exchange)

```typescript
interface CopilotUsageResponse {
  /** SKU type (for distinguishing subscriptions) */
  access_type_sku: string;

  /** Analytics tracking ID */
  analytics_tracking_id: string;

  /** Assignment date */
  assigned_date: string;

  /** Whether can sign up for limited plan */
  can_signup_for_limited: boolean;

  /** Whether chat is enabled */
  chat_enabled: boolean;

  /** Copilot plan type */
  copilot_plan: string;

  /** Quota reset date (format: YYYY-MM) */
  quota_reset_date: string;

  /** Quota snapshots */
  quota_snapshots: QuotaSnapshots;
}

/** Quota snapshots */
interface QuotaSnapshots {
  /** Chat quota (optional) */
  chat?: QuotaDetail;

  /** Completions quota (optional) */
  completions?: QuotaDetail;

  /** Premium Interactions (required) */
  premium_interactions: QuotaDetail;
}

/** Quota detail */
interface QuotaDetail {
  /** Quota entitlement */
  entitlement: number;

  /** Overage count */
  overage_count: number;

  /** Whether overage is permitted */
  overage_permitted: boolean;

  /** Percentage remaining */
  percent_remaining: number;

  /** Quota ID */
  quota_id: string;

  /** Quota remaining */
  quota_remaining: number;

  /** Remaining count (same as quota_remaining) */
  remaining: number;

  /** Whether unlimited */
  unlimited: boolean;
}
```

#### Method 2: Public Billing API (requires Fine-grained PAT)

**API Endpoint**: `GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**Authentication Method**: Bearer Token (Fine-grained PAT, requires "Plan" read permission)

```typescript
interface BillingUsageResponse {
  /** Time period */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** Username */
  user: string;

  /** Usage items list */
  usageItems: BillingUsageItem[];
}

/** Usage item */
interface BillingUsageItem {
  /** Product name */
  product: string;

  /** SKU identifier */
  sku: string;

  /** Model name (optional) */
  model?: string;

  /** Unit type (e.g., "requests") */
  unitType: string;

  /** Total requests (before discount) */
  grossQuantity: number;

  /** Net requests (after discount) */
  netQuantity: number;

  /** Quota limit (optional) */
  limit?: number;
}
```

**Example Response**:

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

### Google Cloud Response Format

**API Endpoint**: `POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**Authentication Method**: Bearer Token (OAuth Access Token)

**Request Body**:

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** Model list (key is model ID) */
  models: Record<
    string,
    {
      /** Quota information (optional) */
      quotaInfo?: {
        /** Remaining fraction (0-1) */
        remainingFraction?: number;

        /** Reset time (ISO 8601 format) */
        resetTime?: string;
      };
    }
  >;
}
```

**Example Response**:

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

**The 4 displayed models**:

| Display Name | Model Key                                  | Alternate Key              |
|--- | --- | ---|
| G3 Pro       | `gemini-3-pro-high`                        | `gemini-3-pro-low`    |
| G3 Image     | `gemini-3-pro-image`                      | -                     |
| G3 Flash     | `gemini-3-flash`                          | -                     |
| Claude       | `claude-opus-4-5-thinking`                | `claude-opus-4-5`     |

---

## Internal Data Types

### Query Result Type

All platform query functions return a unified result format.

```typescript
interface QueryResult {
  /** Whether successful */
  success: boolean;

  /** Output content on success */
  output?: string;

  /** Error message on failure */
  error?: string;
}
```

### Constant Configuration

```typescript
/** High usage warning threshold (percentage) */
export const HIGH_USAGE_THRESHOLD = 80;

/** API request timeout (milliseconds) */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature              | File Path                                                                                              | Line    |
|--- | --- | ---|
| Auth data types      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104)        | 99-104  |
| OpenAI auth       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)         | 28-33   |
| Zhipu AI auth      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41)         | 38-41   |
| Copilot auth      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)         | 46-51   |
| Copilot PAT config  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)         | 66-73   |
| Antigravity accounts  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)         | 78-94   |
| OpenAI response format   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36)         | 29-36   |
| Zhipu AI response format  | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50)         | 43-50   |
| Copilot internal API   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58)        | 47-58   |
| Copilot Billing API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84)        | 80-84   |
| Google Cloud response  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37)       | 27-37   |

**Key constants**:
- `HIGH_USAGE_THRESHOLD = 80`: High usage warning threshold (types.ts:111)
- `REQUEST_TIMEOUT_MS = 10000`: API request timeout (types.ts:114)

**Key types**:
- `QueryResult`: Query result type (types.ts:15-19)
- `CopilotTier`: Copilot subscription type enum (types.ts:57)

</details>
