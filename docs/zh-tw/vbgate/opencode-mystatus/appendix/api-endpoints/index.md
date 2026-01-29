---
title: "API 介面: 官方介面總覽 | opencode-mystatus"
sidebarTitle: "API 介面"
subtitle: "API 介面: 官方介面總覽"
description: "學習 opencode-mystatus 外掛呼叫的所有官方 API 介面。涵蓋 OpenAI、智譜 AI、Z.ai、Google Cloud 和 GitHub Copilot 的認證方式、請求格式和回應資料結構。"
tags:
  - "api"
  - "endpoints"
  - "reference"
prerequisite:
  - "appendix-data-models"
order: 2
---

# API 介面總覽

## 學完你能做什麼

- 瞭解外掛呼叫的所有官方 API 介面
- 理解各平台的認證方式（OAuth / API Key）
- 掌握請求格式和回應資料結構
- 知道如何獨立呼叫這些 API

## 什麼是 API 介面

API 介面（Application Programming Interface）是程式之間通訊的橋樑。opencode-mystatus 透過呼叫各平台的官方 API 介面，取得你的帳號額度資料。

::: info 為什麼要瞭解這些介面？
瞭解這些介面可以讓你：
1. 驗證外掛的資料來源，確保安全性
2. 在外掛無法使用時，手動呼叫介面取得資料
3. 學習如何建構類似的額度查詢工具
:::

## OpenAI 介面

### 查詢額度

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| 方法 | GET |
| 認證方式 | Bearer Token (OAuth) |
| 原始碼位置 | `plugin/lib/openai.ts:127-155` |

**請求標頭**：

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // 可選，團隊帳號需要
```

**回應範例**：

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

**回應欄位說明**：

- `plan_type`: 訂閱類型（Plus / Team / Pro）
- `rate_limit.primary_window`: 主視窗限額（通常是 3 小時）
- `rate_limit.secondary_window`: 次視窗限額（通常是 24 小時）
- `used_percent`: 使用百分比（0-100）
- `reset_after_seconds`: 距離重置的秒數

---

## 智證 AI 介面

### 查詢額度

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| 方法 | GET |
| 認證方式 | API Key |
| 原始碼位置 | `plugin/lib/zhipu.ts:62-106` |

**請求標頭**：

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**回應範例**：

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

**回應欄位說明**：

- `limits[].type`: 限制類型
  - `TOKENS_LIMIT`: 5 小時 Token 限額
  - `TIME_LIMIT`: MCP 搜尋次數（月度配額）
- `usage`: 總配額
- `currentValue`: 目前已使用量
- `percentage`: 使用百分比（0-100）
- `nextResetTime`: 下次重置時間戳（僅 TOKENS_LIMIT 有效，單位：毫秒）

---

## Z.ai 介面

### 查詢額度

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| 方法 | GET |
| 認證方式 | API Key |
| 原始碼位置 | `plugin/lib/zhipu.ts:64, 85-106` |

**請求標頭**：

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**回應格式**：與智證 AI 相同，見上文。

---

## Google Cloud 介面

### 1. 重新整理 Access Token

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://oauth2.googleapis.com/token` |
| 方法 | POST |
| 認證方式 | OAuth Refresh Token |
| 原始碼位置 | `plugin/lib/google.ts:90, 162-184` |

**請求標頭**：

```http
Content-Type: application/x-www-form-urlencoded
```

**請求主體**：

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**回應範例**：

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**欄位說明**：

- `access_token`: 新的 Access Token（有效期 1 小時）
- `expires_in`: 過期時間（秒）

---

### 2. 查詢可用模型額度

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| 方法 | POST |
| 認證方式 | Bearer Token (OAuth) |
| 原始碼位置 | `plugin/lib/google.ts:65, 193-213` |

**請求標頭**：

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**請求主體**：

```json
{
  "project": "{project_id}"
}
```

**回應範例**：

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

**回應欄位說明**：

- `models`: 模型清單（鍵為模型名稱）
- `quotaInfo.remainingFraction`: 剩餘比例（0.0-1.0）
- `quotaInfo.resetTime`: 重置時間（ISO 8601 格式）

---

## GitHub Copilot 介面

### 1. 公共計費 API（推薦）

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| 方法 | GET |
| 認證方式 | Fine-grained PAT（Personal Access Token） |
| 原始碼位置 | `plugin/lib/copilot.ts:157-177` |

**請求標頭**：

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip 什麼是 Fine-grained PAT？
Fine-grained PAT（Fine-grained Personal Access Token）是 GitHub 的新一代令牌，支援更細緻的權限控制。要查詢 Copilot 額度，需要授予 "Plan" 讀取權限。
:::

**回應範例**：

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

**回應欄位說明**：

- `timePeriod`: 時間週期（年月）
- `user`: GitHub 使用者名稱
- `usageItems`: 使用詳情陣列
  - `sku`: SKU 名稱（`Copilot Premium Request` 表示 Premium Requests）
  - `model`: 模型名稱
  - `grossQuantity`: 總請求數（未應用折扣）
  - `netQuantity`: 淨請求數（應用折扣後）
  - `limit`: 限額

---

### 2. 內部額度 API（舊版）

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://api.github.com/copilot_internal/user` |
| 方法 | GET |
| 認證方式 | Copilot Session Token |
| 原始碼位置 | `plugin/lib/copilot.ts:242-304` |

**請求標頭**：

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**回應範例**：

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

**回應欄位說明**：

- `copilot_plan`: 訂閱類型（`free` / `pro` / `pro+` / `business` / `enterprise`）
- `quota_reset_date`: 配額重置日期（YYYY-MM-DD）
- `quota_snapshots.premium_interactions`: Premium Requests（主要配額）
- `quota_snapshots.chat`: Chat 配額（如單獨計算）
- `quota_snapshots.completions`: Completions 配額（如單獨計算）

---

### 3. Token Exchange API

**介面資訊**：

| 項目 | 值 |
|--- | ---|
| URL | `https://api.github.com/copilot_internal/v2/token` |
| 方法 | POST |
| 認證方式 | OAuth Token（從 OpenCode 取得） |
| 原始碼位置 | `plugin/lib/copilot.ts:183-208` |

**請求標頭**：

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**回應範例**：

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

**回應欄位說明**：

- `token`: Copilot Session Token（用於呼叫內部 API）
- `expires_at`: 過期時間戳（秒）
- `refresh_in`: 建議重新整理時間（秒）

::: warning 注意
此介面僅適用於舊版 GitHub OAuth 認證流程。新版 OpenCode 官方合作夥伴認證流程（2026 年 1 月起）可能需要使用 Fine-grained PAT。
:::

---

## 認證方式對比

| 平台 | 認證方式 | 憑證來源 | 憑證檔案 |
|--- | --- | --- | ---|
| **OpenAI** | OAuth Bearer Token | OpenCode OAuth | `~/.local/share/opencode/auth.json` |
| **智證 AI** | API Key | 使用者手動設定 | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | 使用者手動設定 | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | opencode-antigravity-auth 外掛 | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | 使用者手動設定或 OAuth | `~/.config/opencode/copilot-quota-token.json` 或 `~/.local/share/opencode/auth.json` |

---

## 請求逾時

所有 API 請求都設定了 10 秒逾時限制，避免長時間等待：

| 設定 | 值 | 原始碼位置 |
|--- | --- | ---|
| 逾時時間 | 10 秒 | `plugin/lib/types.ts:114` |
| 逾時實作 | `fetchWithTimeout` 函數 | `plugin/lib/utils.ts:84-100` |

---

## 安全性

### API Key 脫敏

外掛在顯示時自動脫敏 API Key，只顯示首尾各 2 個字元：

```typescript
// 範例：sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**原始碼位置**：`plugin/lib/utils.ts:130-139`

### 資料儲存

- 所有認證檔案僅**唯讀**，外掛不會修改任何檔案
- API 回應資料**不快取**、**不儲存**
- 敏感資訊（API Key、Token）在記憶體中脫敏後顯示

**原始碼位置**：
- `plugin/mystatus.ts:35-46`（讀取認證檔案）
- `plugin/lib/utils.ts:130-139`（脫敏函數）

---

## 本課小結

本課介紹了 opencode-mystatus 外掛呼叫的所有官方 API 介面：

| 平台 | API 數量 | 認證方式 |
|--- | --- | ---|
| OpenAI | 1 個 | OAuth Bearer Token |
| 智證 AI | 1 個 | API Key |
| Z.ai | 1 個 | API Key |
| Google Cloud | 2 個 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 個 | Fine-grained PAT / Copilot Session Token |

所有介面都是各平台官方介面，確保資料來源可靠、安全。外掛透過本地唯讀認證檔案取得憑證，不上傳任何資料。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| OpenAI 額度查詢 API | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| 智證 AI 額度查詢 API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| Z.ai 額度查詢 API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64（共用介面） |
| Google Cloud OAuth Token 重新整理 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| Google Cloud 額度查詢 API | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| GitHub Copilot 公共計費 API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| GitHub Copilot 內部額度 API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| GitHub Copilot Token Exchange API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| API Key 脫敏函數 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| 請求逾時設定 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**關鍵常數**：

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`：OpenAI 額度查詢介面
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"`：智證 AI 額度查詢介面
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"`：Z.ai 額度查詢介面
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`：Google Cloud 額度查詢介面
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`：Google Cloud OAuth Token 重新整理介面

**關鍵函數**：

- `fetchOpenAIUsage()`：呼叫 OpenAI 額度 API
- `fetchUsage()`：呼叫智證 AI / Z.ai 額度 API（通用）
- `refreshAccessToken()`：重新整理 Google Access Token
- `fetchGoogleUsage()`：呼叫 Google Cloud 額度 API
- `fetchPublicBillingUsage()`：呼叫 GitHub Copilot 公共計費 API
- `fetchCopilotUsage()`：呼叫 GitHub Copilot 內部額度 API
- `exchangeForCopilotToken()`：交換 OAuth Token 為 Copilot Session Token
- `maskString()`：脫敏 API Key

</details>
