---
title: "API: 官方接口文档 | opencode-mystatus"
sidebarTitle: "API 文档"
subtitle: "API Endpoints Reference"
description: "学习 opencode-mystatus 调用的官方 API 接口文档。涵盖 OpenAI、Zhipu AI、Z.ai、Google Cloud 和 GitHub Copilot 的认证方式、请求格式和响应结构。"
tags:
  - "api"
  - "endpoints"
  - "reference"
prerequisite:
  - "appendix-data-models"
order: 999
---

# API Endpoints Reference

## What You'll Learn

- Understand all official API endpoints called by the plugin
- Understand authentication methods for each platform (OAuth / API Key)
- Master request formats and response data structures
- Know how to call these APIs independently

## What Are API Endpoints

API endpoints (Application Programming Interface) are the communication bridge between programs. The opencode-mystatus plugin retrieves your account quota data by calling official API endpoints from each platform.

::: info Why Understand These Endpoints?
Understanding these endpoints allows you to:
1. Verify the plugin's data sources to ensure security
2. Manually call endpoints to fetch data when the plugin is unavailable
3. Learn how to build similar quota query tools
:::

## OpenAI Endpoints

### Query Quota

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| Method | GET |
| Authentication | Bearer Token (OAuth) |
| Source Location | `plugin/lib/openai.ts:127-155` |

**Request Headers**:

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // Optional, required for team accounts
```

**Response Example**:

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

**Response Field Descriptions**:

- `plan_type`: Subscription type (Plus / Team / Pro)
- `rate_limit.primary_window`: Primary window limit (typically 3 hours)
- `rate_limit.secondary_window`: Secondary window limit (typically 24 hours)
- `used_percent`: Usage percentage (0-100)
- `reset_after_seconds`: Seconds until reset

---

## Zhipu AI Endpoints

### Query Quota

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| Method | GET |
| Authentication | API Key |
| Source Location | `plugin/lib/zhipu.ts:62-106` |

**Request Headers**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Response Example**:

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

**Response Field Descriptions**:

- `limits[].type`: Limit type
  - `TOKENS_LIMIT`: 5-hour Token limit
  - `TIME_LIMIT`: MCP search count (monthly quota)
- `usage`: Total quota
- `currentValue`: Current usage
- `percentage`: Usage percentage (0-100)
- `nextResetTime`: Next reset timestamp (only for TOKENS_LIMIT, in milliseconds)

---

## Z.ai Endpoints

### Query Quota

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| Method | GET |
| Authentication | API Key |
| Source Location | `plugin/lib/zhipu.ts:64, 85-106` |

**Request Headers**:

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**Response Format**: Same as Zhipu AI, see above.

---

## Google Cloud Endpoints

### 1. Refresh Access Token

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://oauth2.googleapis.com/token` |
| Method | POST |
| Authentication | OAuth Refresh Token |
| Source Location | `plugin/lib/google.ts:90, 162-184` |

**Request Headers**:

```http
Content-Type: application/x-www-form-urlencoded
```

**Request Body**:

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**Response Example**:

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**Field Descriptions**:

- `access_token`: New Access Token (valid for 1 hour)
- `expires_in`: Expiration time (seconds)

---

### 2. Query Available Model Quota

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| Method | POST |
| Authentication | Bearer Token (OAuth) |
| Source Location | `plugin/lib/google.ts:65, 193-213` |

**Request Headers**:

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**Request Body**:

```json
{
  "project": "{project_id}"
}
```

**Response Example**:

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

**Response Field Descriptions**:

- `models`: Model list (key is model name)
- `quotaInfo.remainingFraction`: Remaining fraction (0.0-1.0)
- `quotaInfo.resetTime`: Reset time (ISO 8601 format)

---

## GitHub Copilot Endpoints

### 1. Public Billing API (Recommended)

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| Method | GET |
| Authentication | Fine-grained PAT (Personal Access Token) |
| Source Location | `plugin/lib/copilot.ts:157-177` |

**Request Headers**:

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip What is Fine-grained PAT?
Fine-grained PAT (Fine-grained Personal Access Token) is GitHub's new generation token supporting more granular permission control. To query Copilot quota, you need to grant "Plan" read permission.
:::

**Response Example**:

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

**Response Field Descriptions**:

- `timePeriod`: Time period (year-month)
- `user`: GitHub username
- `usageItems`: Usage details array
  - `sku`: SKU name (`Copilot Premium Request` indicates Premium Requests)
  - `model`: Model name
  - `grossQuantity`: Total requests (before discount)
  - `netQuantity`: Net requests (after discount)
  - `limit`: Limit

---

### 2. Internal Quota API (Legacy)

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/user` |
| Method | GET |
| Authentication | Copilot Session Token |
| Source Location | `plugin/lib/copilot.ts:242-304` |

**Request Headers**:

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Response Example**:

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

**Response Field Descriptions**:

- `copilot_plan`: Subscription type (`free` / `pro` / `pro+` / `business` / `enterprise`)
- `quota_reset_date`: Quota reset date (YYYY-MM-DD)
- `quota_snapshots.premium_interactions`: Premium Requests (main quota)
- `quota_snapshots.chat`: Chat quota (if calculated separately)
- `quota_snapshots.completions`: Completions quota (if calculated separately)

---

### 3. Token Exchange API

**Endpoint Information**:

| Item | Value |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/v2/token` |
| Method | POST |
| Authentication | OAuth Token (from OpenCode) |
| Source Location | `plugin/lib/copilot.ts:183-208` |

**Request Headers**:

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**Response Example**:

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

**Response Field Descriptions**:

- `token`: Copilot Session Token (for calling internal API)
- `expires_at`: Expiration timestamp (seconds)
- `refresh_in`: Recommended refresh time (seconds)

::: warning Note
This endpoint only applies to the legacy GitHub OAuth authentication flow. The new OpenCode official partner authentication flow (from January 2026) may require using Fine-grained PAT.
:::

---

## Authentication Methods Comparison

| Platform | Authentication Method | Credential Source | Credential File |
| --- | --- | --- | --- |
| **OpenAI** | OAuth Bearer Token | OpenCode OAuth | `~/.local/share/opencode/auth.json` |
| **Zhipu AI** | API Key | User manual configuration | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | User manual configuration | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | opencode-antigravity-auth plugin | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | User manual configuration or OAuth | `~/.config/opencode/copilot-quota-token.json` or `~/.local/share/opencode/auth.json` |

---

## Request Timeout

All API requests have a 10-second timeout limit to avoid long waits:

| Configuration | Value | Source Location |
| --- | --- | --- |
| Timeout | 10 seconds | `plugin/lib/types.ts:114` |
| Timeout Implementation | `fetchWithTimeout` function | `plugin/lib/utils.ts:84-100` |

---

## Security

### API Key Masking

The plugin automatically masks API Keys when displaying, showing only the first and last 2 characters:

```typescript
// Example: sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**Source Location**: `plugin/lib/utils.ts:130-139`

### Data Storage

- All authentication files are **read-only**, the plugin does not modify any files
- API response data is **not cached** and **not stored**
- Sensitive information (API Keys, Tokens) are masked in memory before display

**Source Locations**:
- `plugin/mystatus.ts:35-46` (reading authentication files)
- `plugin/lib/utils.ts:130-139` (masking function)

---

## Summary

This lesson introduced all official API endpoints called by the opencode-mystatus plugin:

| Platform | API Count | Authentication Method |
| --- | --- | --- |
| OpenAI | 1 | OAuth Bearer Token |
| Zhipu AI | 1 | API Key |
| Z.ai | 1 | API Key |
| Google Cloud | 2 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 | Fine-grained PAT / Copilot Session Token |

All endpoints are official platform endpoints, ensuring reliable and secure data sources. The plugin retrieves credentials from local read-only authentication files and does not upload any data.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
| --- | --- | --- |
| OpenAI quota query API | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| Zhipu AI quota query API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| Z.ai quota query API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64 (shared endpoint) |
| Google Cloud OAuth Token refresh | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| Google Cloud quota query API | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| GitHub Copilot public billing API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| GitHub Copilot internal quota API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| GitHub Copilot Token Exchange API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| API Key masking function | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| Request timeout configuration | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**Key Constants**:

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: OpenAI quota query endpoint
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"`: Zhipu AI quota query endpoint
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"`: Z.ai quota query endpoint
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`: Google Cloud quota query endpoint
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`: Google Cloud OAuth Token refresh endpoint

**Key Functions**:

- `fetchOpenAIUsage()`: Call OpenAI quota API
- `fetchUsage()`: Call Zhipu AI / Z.ai quota API (generic)
- `refreshAccessToken()`: Refresh Google Access Token
- `fetchGoogleUsage()`: Call Google Cloud quota API
- `fetchPublicBillingUsage()`: Call GitHub Copilot public billing API
- `fetchCopilotUsage()`: Call GitHub Copilot internal quota API
- `exchangeForCopilotToken()`: Exchange OAuth Token for Copilot Session Token
- `maskString()`: Mask API Key

</details>
