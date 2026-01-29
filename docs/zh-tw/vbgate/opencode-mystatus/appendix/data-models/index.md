---
title: "資料模型: 認證檔案與 API | opencode-mystatus"
sidebarTitle: "資料模型"
subtitle: "資料模型: 認證檔案與 API"
description: "瞭解 opencode-mystatus 外掛的認證檔案結構和 API 回應格式。本附錄定義 OpenAI、智證 AI、Z.ai、GitHub Copilot、Google Cloud 的資料模型。"
tags:
  - "資料模型"
  - "認證檔案"
  - "API 回應"
prerequisite:
  - "start-quick-start"
order: 1
---

# 資料模型：認證檔案結構和 API 回應格式

> 💡 **本附錄是給開發者看的**：如果你想瞭解外掛如何讀取和解析認證檔案，或者想自己擴充支援更多平台，這裡有完整的資料模型參考。

## 學完你能做什麼

- 瞭解外掛讀取哪些認證檔案
- 理解各平台 API 的回應格式
- 知道如何擴充外掛支援新平台

## 本附錄內容

- 認證檔案結構（3 個設定檔）
- API 回應格式（5 個平台）
- 內部資料類型

---

## 認證檔案結構

### 主認證檔案：`~/.local/share/opencode/auth.json`

OpenCode 官方認證儲存，外掛從這裡讀取 OpenAI、智證 AI、Z.ai、GitHub Copilot 的認證資訊。

```typescript
interface AuthData {
  /** OpenAI OAuth 認證 */
  openai?: OpenAIAuthData;

  /** 智證 AI API 認證 */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Z.ai API 認證 */
  "zai-coding-plan"?: ZhipuAuthData;

  /** GitHub Copilot OAuth 認證 */
  "github-copilot"?: CopilotAuthData;
}
```

#### OpenAI 認證資料

```typescript
interface OpenAIAuthData {
  type: string;        // 固定值 "oauth"
  access?: string;     // OAuth Access Token
  refresh?: string;    // OAuth Refresh Token
  expires?: number;    // 過期時間戳（毫秒）
}
```

**資料來源**：OpenCode 官方 OAuth 認證流程

#### 智證 AI / Z.ai 認證資料

```typescript
interface ZhipuAuthData {
  type: string;   // 固定值 "api"
  key?: string;    // API Key
}
```

**資料來源**：使用者在 OpenCode 中設定的 API Key

#### GitHub Copilot 認證資料

```typescript
interface CopilotAuthData {
  type: string;        // 固定值 "oauth"
  refresh?: string;     // OAuth Token
  access?: string;      // Copilot Session Token（可選）
  expires?: number;    // 過期時間戳（毫秒）
}
```

**資料來源**：OpenCode 官方 OAuth 認證流程

---

### Copilot PAT 設定：`~/.config/opencode/copilot-quota-token.json`

使用者可選設定的 Fine-grained PAT（Personal Access Token），用於透過 GitHub 公共 API 查詢額度（不需要 Copilot 權限）。

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT（需要 "Plan" 讀取權限） */
  token: string;

  /** GitHub 使用者名稱（API 呼叫需要） */
  username: string;

  /** Copilot 訂閱類型（決定每月額度上限） */
  tier: CopilotTier;
}

/** Copilot 訂閱類型列舉 */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**各訂閱類型的額度上限**：

| tier      | 每月額度（Premium Requests） |
|--- | ---|
| `free`    | 50                          |
| `pro`     | 300                         |
| `pro+`    | 1,500                       |
| `business` | 300                         |
| `enterprise` | 1,000                     |

---

### Google Cloud 帳號：`~/.config/opencode/antigravity-accounts.json`

由 `opencode-antigravity-auth` 外掛建立的帳號檔案，支援多帳號。

```typescript
interface AntigravityAccountsFile {
  version: number;               // 檔案格式版本號
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Google 電子郵件（用於顯示） */
  email?: string;

  /** OAuth Refresh Token（必需） */
  refreshToken: string;

  /** Google 專案 ID（二選一） */
  projectId?: string;

  /** 託管專案 ID（二選一） */
  managedProjectId?: string;

  /** 帳號新增時間戳（毫秒） */
  addedAt: number;

  /** 最後使用時間戳（毫秒） */
  lastUsed: number;

  /** 各模型重置時間（模型 key → 時間戳） */
  rateLimitResetTimes?: Record<string, number>;
}
```

**資料來源**：`opencode-antigravity-auth` 外掛的 OAuth 認證流程

---

## API 回應格式

### OpenAI 回應格式

**API 端點**：`GET https://chatgpt.com/backend-api/wham/usage`

**認證方式**：Bearer Token（OAuth Access Token）

```typescript
interface OpenAIUsageResponse {
  /** 計劃類型：plus、team、pro 等 */
  plan_type: string;

  /** 額度限制資訊 */
  rate_limit: {
    /** 是否達到限額 */
    limit_reached: boolean;

    /** 主視窗（3 小時） */
    primary_window: RateLimitWindow;

    /** 次視窗（24 小時，可選） */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** 限額視窗資訊 */
interface RateLimitWindow {
  /** 已使用百分比 */
  used_percent: number;

  /** 限額視窗時長（秒） */
  limit_window_seconds: number;

  /** 距離重置的秒數 */
  reset_after_seconds: number;
}
```

**範例回應**：

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

### 智證 AI / Z.ai 回應格式

**API 端點**：
- 智證 AI：`GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai：`GET https://api.z.ai/api/monitor/usage/quota/limit`

**認證方式**：Authorization Header（API Key）

```typescript
interface QuotaLimitResponse {
  code: number;   // 成功時為 200
  msg: string;    // 錯誤訊息（成功時為 "success"）
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** 單個限額項 */
interface UsageLimitItem {
  /** 限額類型 */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** 目前值 */
  currentValue: number;

  /** 總值 */
  usage: number;

  /** 使用百分比 */
  percentage: number;

  /** 下次重置時間戳（毫秒，僅 TOKENS_LIMIT 有效） */
  nextResetTime?: number;
}
```

**限額類型說明**：

| type          | 說明               | 重置週期  |
|--- | --- | ---|
| `TOKENS_LIMIT` | 5 小時 Token 限額  | 5 小時   |
| `TIME_LIMIT`   | MCP 月度配額      | 1 個月   |

**範例回應**：

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

### GitHub Copilot 回應格式

Copilot 支援兩種 API 查詢方式，回應格式不同。

#### 方式 1：內部 API（需要 Copilot 權限）

**API 端點**：`GET https://api.github.com/copilot_internal/user`

**認證方式**：Bearer Token（OAuth 或 Token Exchange 後的 Token）

```typescript
interface CopilotUsageResponse {
  /** SKU 類型（用於區分訂閱） */
  access_type_sku: string;

  /** 分析追蹤 ID */
  analytics_tracking_id: string;

  /** 分配日期 */
  assigned_date: string;

  /** 是否可以註冊受限計劃 */
  can_signup_for_limited: boolean;

  /** 是否啟用聊天 */
  chat_enabled: boolean;

  /** Copilot 計劃類型 */
  copilot_plan: string;

  /** 額度重置日期（格式：YYYY-MM） */
  quota_reset_date: string;

  /** 額度快照 */
  quota_snapshots: QuotaSnapshots;
}

/** 額度快照 */
interface QuotaSnapshots {
  /** 聊天額度（可選） */
  chat?: QuotaDetail;

  /** 補全額度（可選） */
  completions?: QuotaDetail;

  /** Premium Interactions（必需） */
  premium_interactions: QuotaDetail;
}

/** 額度詳情 */
interface QuotaDetail {
  /** 額度上限 */
  entitlement: number;

  /** 超額使用次數 */
  overage_count: number;

  /** 是否允許超額使用 */
  overage_permitted: boolean;

  /** 剩餘百分比 */
  percent_remaining: number;

  /** 額度 ID */
  quota_id: string;

  /** 剩餘額度 */
  quota_remaining: number;

  /** 剩餘數量（與 quota_remaining 相同） */
  remaining: number;

  /** 是否無限 */
  unlimited: boolean;
}
```

#### 方式 2：公共 Billing API（需要 Fine-grained PAT）

**API 端點**：`GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**認證方式**：Bearer Token（Fine-grained PAT，需要 "Plan" 讀取權限）

```typescript
interface BillingUsageResponse {
  /** 時間週期 */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** 使用者名稱 */
  user: string;

  /** 使用項目清單 */
  usageItems: BillingUsageItem[];
}

/** 使用項目 */
interface BillingUsageItem {
  /** 產品名稱 */
  product: string;

  /** SKU 標識 */
  sku: string;

  /** 模型名稱（可選） */
  model?: string;

  /** 單位類型（如 "requests"） */
  unitType: string;

  /** 總請求數（扣減折扣前） */
  grossQuantity: number;

  /** 淨請求數（扣減折扣後） */
  netQuantity: number;

  /** 額度上限（可選） */
  limit?: number;
}
```

**範例回應**：

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

### Google Cloud 回應格式

**API 端點**：`POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**認證方式**：Bearer Token（OAuth Access Token）

**請求主體**：

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** 模型清單（key 為模型 ID） */
  models: Record<
    string,
    {
      /** 額度資訊（可選） */
      quotaInfo?: {
        /** 剩餘比例（0-1） */
        remainingFraction?: number;

        /** 重置時間（ISO 8601 格式） */
        resetTime?: string;
      };
    }
  >;
}
```

**範例回應**：

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

**顯示的 4 個模型**：

| 顯示名稱     | 模型 Key                                  | 備選 Key              |
|--- | --- | ---|
| G3 Pro       | `gemini-3-pro-high`                        | `gemini-3-pro-low`    |
| G3 Image     | `gemini-3-pro-image`                      | -                     |
| G3 Flash     | `gemini-3-flash`                          | -                     |
| Claude       | `claude-opus-4-5-thinking`                | `claude-opus-4-5`     |

---

## 內部資料類型

### 查詢結果類型

所有平台查詢函數返回統一的結果格式。

```typescript
interface QueryResult {
  /** 是否成功 */
  success: boolean;

  /** 成功時的輸出內容 */
  output?: string;

  /** 失敗時的錯誤訊息 */
  error?: string;
}
```

### 常數設定

```typescript
/** 高使用率警告閾值（百分比） */
export const HIGH_USAGE_THRESHOLD = 80;

/** API 請求逾時時間（毫秒） */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能              | 檔案路徑                                                                                              | 行號    |
|--- | --- | ---|
| 認證資料類型      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104)        | 99-104  |
| OpenAI 認證       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)         | 28-33   |
| 智證 AI 認證      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41)         | 38-41   |
| Copilot 認證      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)         | 46-51   |
| Copilot PAT 設定  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)         | 66-73   |
| Antigravity 帳號  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)         | 78-94   |
| OpenAI 回應格式   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36)         | 29-36   |
| 智證 AI 回應格式  | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50)         | 43-50   |
| Copilot 內部 API   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58)        | 47-58   |
| Copilot Billing API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84)        | 80-84   |
| Google Cloud 回應  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37)       | 27-37   |

**關鍵常數**：
- `HIGH_USAGE_THRESHOLD = 80`：高使用率警告閾值（types.ts:111）
- `REQUEST_TIMEOUT_MS = 10000`：API 請求逾時時間（types.ts:114）

**關鍵類型**：
- `QueryResult`：查詢結果類型（types.ts:15-19）
- `CopilotTier`：Copilot 訂閱類型列舉（types.ts:57）

</details>
