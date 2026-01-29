---
title: "数据模型: 认证文件和 API | opencode-mystatus"
sidebarTitle: "数据模型"
subtitle: "数据模型：认证文件结构和 API 响应格式"
description: "学习 opencode-mystatus 插件如何读取认证文件结构及解析 API 响应。包含 OpenAI、智谱 AI、Z.ai、GitHub Copilot 和 Google Cloud 的数据模型定义。"
tags:
  - "数据模型"
  - "认证文件"
  - "API 响应"
prerequisite:
  - "start-quick-start"
order: 1
---

# 数据模型：认证文件结构和 API 响应格式

> 💡 **本附录是给开发者看的**：如果你想了解插件如何读取和解析认证文件，或者想自己扩展支持更多平台，这里有完整的数据模型参考。

## 学完你能做什么

- 了解插件读取哪些认证文件
- 理解各平台 API 的响应格式
- 知道如何扩展插件支持新平台

## 本附录内容

- 认证文件结构（3 个配置文件）
- API 响应格式（5 个平台）
- 内部数据类型

---

## 认证文件结构

### 主认证文件：`~/.local/share/opencode/auth.json`

OpenCode 官方认证存储，插件从这里读取 OpenAI、智谱 AI、Z.ai、GitHub Copilot 的认证信息。

```typescript
interface AuthData {
  /** OpenAI OAuth 认证 */
  openai?: OpenAIAuthData;

  /** 智谱 AI API 认证 */
  "zhipuai-coding-plan"?: ZhipuAuthData;

  /** Z.ai API 认证 */
  "zai-coding-plan"?: ZhipuAuthData;

  /** GitHub Copilot OAuth 认证 */
  "github-copilot"?: CopilotAuthData;
}
```

#### OpenAI 认证数据

```typescript
interface OpenAIAuthData {
  type: string;        // 固定值 "oauth"
  access?: string;     // OAuth Access Token
  refresh?: string;    // OAuth Refresh Token
  expires?: number;    // 过期时间戳（毫秒）
}
```

**数据来源**：OpenCode 官方 OAuth 认证流程

#### 智谱 AI / Z.ai 认证数据

```typescript
interface ZhipuAuthData {
  type: string;   // 固定值 "api"
  key?: string;    // API Key
}
```

**数据来源**：用户在 OpenCode 中配置的 API Key

#### GitHub Copilot 认证数据

```typescript
interface CopilotAuthData {
  type: string;        // 固定值 "oauth"
  refresh?: string;     // OAuth Token
  access?: string;      // Copilot Session Token（可选）
  expires?: number;    // 过期时间戳（毫秒）
}
```

**数据来源**：OpenCode 官方 OAuth 认证流程

---

### Copilot PAT 配置：`~/.config/opencode/copilot-quota-token.json`

用户可选配置的 Fine-grained PAT（Personal Access Token），用于通过 GitHub 公共 API 查询额度（不需要 Copilot 权限）。

```typescript
interface CopilotQuotaConfig {
  /** Fine-grained PAT（需要 "Plan" 读取权限） */
  token: string;

  /** GitHub 用户名（API 调用需要） */
  username: string;

  /** Copilot 订阅类型（决定每月额度上限） */
  tier: CopilotTier;
}

/** Copilot 订阅类型枚举 */
type CopilotTier = "free" | "pro" | "pro+" | "business" | "enterprise";
```

**各订阅类型的额度上限**：

| tier      | 每月额度（Premium Requests） |
|--- | ---|
| `free`    | 50                          |
| `pro`     | 300                         |
| `pro+`    | 1,500                       |
| `business` | 300                         |
| `enterprise` | 1,000                     |

---

### Google Cloud 账号：`~/.config/opencode/antigravity-accounts.json`

由 `opencode-antigravity-auth` 插件创建的账号文件，支持多账号。

```typescript
interface AntigravityAccountsFile {
  version: number;               // 文件格式版本号
  accounts: AntigravityAccount[];
}

interface AntigravityAccount {
  /** Google 邮箱（用于显示） */
  email?: string;

  /** OAuth Refresh Token（必需） */
  refreshToken: string;

  /** Google 项目 ID（二选一） */
  projectId?: string;

  /** 托管项目 ID（二选一） */
  managedProjectId?: string;

  /** 账号添加时间戳（毫秒） */
  addedAt: number;

  /** 最后使用时间戳（毫秒） */
  lastUsed: number;

  /** 各模型重置时间（模型 key → 时间戳） */
  rateLimitResetTimes?: Record<string, number>;
}
```

**数据来源**：`opencode-antigravity-auth` 插件的 OAuth 认证流程

---

## API 响应格式

### OpenAI 响应格式

**API 端点**：`GET https://chatgpt.com/backend-api/wham/usage`

**认证方式**：Bearer Token（OAuth Access Token）

```typescript
interface OpenAIUsageResponse {
  /** 计划类型：plus、team、pro 等 */
  plan_type: string;

  /** 额度限制信息 */
  rate_limit: {
    /** 是否达到限额 */
    limit_reached: boolean;

    /** 主窗口（3 小时） */
    primary_window: RateLimitWindow;

    /** 次窗口（24 小时，可选） */
    secondary_window: RateLimitWindow | null;
  } | null;
}

/** 限额窗口信息 */
interface RateLimitWindow {
  /** 已使用百分比 */
  used_percent: number;

  /** 限额窗口时长（秒） */
  limit_window_seconds: number;

  /** 距离重置的秒数 */
  reset_after_seconds: number;
}
```

**示例响应**：

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

### 智谱 AI / Z.ai 响应格式

**API 端点**：
- 智谱 AI：`GET https://bigmodel.cn/api/monitor/usage/quota/limit`
- Z.ai：`GET https://api.z.ai/api/monitor/usage/quota/limit`

**认证方式**：Authorization Header（API Key）

```typescript
interface QuotaLimitResponse {
  code: number;   // 成功时为 200
  msg: string;    // 错误消息（成功时为 "success"）
  data: {
    limits: UsageLimitItem[];
  };
  success: boolean;
}

/** 单个限额项 */
interface UsageLimitItem {
  /** 限额类型 */
  type: "TOKENS_LIMIT" | "TIME_LIMIT";

  /** 当前值 */
  currentValue: number;

  /** 总值 */
  usage: number;

  /** 使用百分比 */
  percentage: number;

  /** 下次重置时间戳（毫秒，仅 TOKENS_LIMIT 有效） */
  nextResetTime?: number;
}
```

**限额类型说明**：

| type          | 说明               | 重置周期  |
|--- | --- | ---|
| `TOKENS_LIMIT` | 5 小时 Token 限额  | 5 小时   |
| `TIME_LIMIT`   | MCP 月度配额      | 1 个月   |

**示例响应**：

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

### GitHub Copilot 响应格式

Copilot 支持两种 API 查询方式，响应格式不同。

#### 方式 1：内部 API（需要 Copilot 权限）

**API 端点**：`GET https://api.github.com/copilot_internal/user`

**认证方式**：Bearer Token（OAuth 或 Token Exchange 后的 Token）

```typescript
interface CopilotUsageResponse {
  /** SKU 类型（用于区分订阅） */
  access_type_sku: string;

  /** 分析追踪 ID */
  analytics_tracking_id: string;

  /** 分配日期 */
  assigned_date: string;

  /** 是否可以注册受限计划 */
  can_signup_for_limited: boolean;

  /** 是否启用聊天 */
  chat_enabled: boolean;

  /** Copilot 计划类型 */
  copilot_plan: string;

  /** 额度重置日期（格式：YYYY-MM） */
  quota_reset_date: string;

  /** 额度快照 */
  quota_snapshots: QuotaSnapshots;
}

/** 额度快照 */
interface QuotaSnapshots {
  /** 聊天额度（可选） */
  chat?: QuotaDetail;

  /** 补全额度（可选） */
  completions?: QuotaDetail;

  /** Premium Interactions（必需） */
  premium_interactions: QuotaDetail;
}

/** 额度详情 */
interface QuotaDetail {
  /** 额度上限 */
  entitlement: number;

  /** 超额使用次数 */
  overage_count: number;

  /** 是否允许超额使用 */
  overage_permitted: boolean;

  /** 剩余百分比 */
  percent_remaining: number;

  /** 额度 ID */
  quota_id: string;

  /** 剩余额度 */
  quota_remaining: number;

  /** 剩余数量（与 quota_remaining 相同） */
  remaining: number;

  /** 是否无限 */
  unlimited: boolean;
}
```

#### 方式 2：公共 Billing API（需要 Fine-grained PAT）

**API 端点**：`GET https://api.github.com/users/{username}/settings/billing/premium_request/usage`

**认证方式**：Bearer Token（Fine-grained PAT，需要 "Plan" 读取权限）

```typescript
interface BillingUsageResponse {
  /** 时间周期 */
  timePeriod: {
    year: number;
    month?: number;
  };

  /** 用户名 */
  user: string;

  /** 使用项目列表 */
  usageItems: BillingUsageItem[];
}

/** 使用项目 */
interface BillingUsageItem {
  /** 产品名称 */
  product: string;

  /** SKU 标识 */
  sku: string;

  /** 模型名称（可选） */
  model?: string;

  /** 单位类型（如 "requests"） */
  unitType: string;

  /** 总请求数（扣减折扣前） */
  grossQuantity: number;

  /** 净请求数（扣减折扣后） */
  netQuantity: number;

  /** 额度上限（可选） */
  limit?: number;
}
```

**示例响应**：

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

### Google Cloud 响应格式

**API 端点**：`POST https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels`

**认证方式**：Bearer Token（OAuth Access Token）

**请求体**：

```json
{
  "project": "your-project-id"
}
```

```typescript
interface GoogleQuotaResponse {
  /** 模型列表（key 为模型 ID） */
  models: Record<
    string,
    {
      /** 额度信息（可选） */
      quotaInfo?: {
        /** 剩余比例（0-1） */
        remainingFraction?: number;

        /** 重置时间（ISO 8601 格式） */
        resetTime?: string;
      };
    }
  >;
}
```

**示例响应**：

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

**显示的 4 个模型**：

| 显示名称     | 模型 Key                                  | 备选 Key              |
|--- | --- | ---|
| G3 Pro       | `gemini-3-pro-high`                        | `gemini-3-pro-low`    |
| G3 Image     | `gemini-3-pro-image`                      | -                     |
| G3 Flash     | `gemini-3-flash`                          | -                     |
| Claude       | `claude-opus-4-5-thinking`                | `claude-opus-4-5`     |

---

## 内部数据类型

### 查询结果类型

所有平台查询函数返回统一的结果格式。

```typescript
interface QueryResult {
  /** 是否成功 */
  success: boolean;

  /** 成功时的输出内容 */
  output?: string;

  /** 失败时的错误信息 */
  error?: string;
}
```

### 常量配置

```typescript
/** 高使用率警告阈值（百分比） */
export const HIGH_USAGE_THRESHOLD = 80;

/** API 请求超时时间（毫秒） */
export const REQUEST_TIMEOUT_MS = 10000;
```

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能              | 文件路径                                                                                              | 行号    |
|--- | --- | ---|
| 认证数据类型      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L99-L104)        | 99-104  |
| OpenAI 认证       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)         | 28-33   |
| 智谱 AI 认证      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L38-L41)         | 38-41   |
| Copilot 认证      | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)         | 46-51   |
| Copilot PAT 配置  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)         | 66-73   |
| Antigravity 账号  | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L78-L94)         | 78-94   |
| OpenAI 响应格式   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L29-L36)         | 29-36   |
| 智谱 AI 响应格式  | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L43-L50)         | 43-50   |
| Copilot 内部 API   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L47-L58)        | 47-58   |
| Copilot Billing API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L80-L84)        | 80-84   |
| Google Cloud 响应  | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L27-L37)       | 27-37   |

**关键常量**：
- `HIGH_USAGE_THRESHOLD = 80`：高使用率警告阈值（types.ts:111）
- `REQUEST_TIMEOUT_MS = 10000`：API 请求超时时间（types.ts:114）

**关键类型**：
- `QueryResult`：查询结果类型（types.ts:15-19）
- `CopilotTier`：Copilot 订阅类型枚举（types.ts:57）

</details>
