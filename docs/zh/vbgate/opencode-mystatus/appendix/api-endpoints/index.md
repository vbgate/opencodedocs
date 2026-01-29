---
title: "API 接口: 官方接口汇总 | opencode-mystatus"
sidebarTitle: "API 接口汇总"
subtitle: "API 接口汇总"
description: "学习 opencode-mystatus 调用的所有官方 API 接口。掌握 OpenAI、智谱 AI、Google Cloud 和 GitHub Copilot 的认证方式、请求格式和响应结构。"
tags:
  - "api"
  - "endpoints"
  - "reference"
prerequisite:
  - "appendix-data-models"
order: 2
---

# API 接口汇总

## 学完你能做什么

- 了解插件调用的所有官方 API 接口
- 理解各平台的认证方式（OAuth / API Key）
- 掌握请求格式和响应数据结构
- 知道如何独立调用这些 API

## 什么是 API 接口

API 接口（Application Programming Interface）是程序之间通信的桥梁。opencode-mystatus 通过调用各平台的官方 API 接口，获取你的账号额度数据。

::: info 为什么要了解这些接口？
了解这些接口可以让你：
1. 验证插件的数据来源，确保安全性
2. 在插件无法使用时，手动调用接口获取数据
3. 学习如何构建类似的额度查询工具
:::

## OpenAI 接口

### 查询额度

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://chatgpt.com/backend-api/wham/usage` |
| 方法 | GET |
| 认证方式 | Bearer Token (OAuth) |
| 源码位置 | `plugin/lib/openai.ts:127-155` |

**请求头**：

```http
Authorization: Bearer {access_token}
User-Agent: OpenCode-Status-Plugin/1.0
ChatGPT-Account-Id: {team_account_id}  // 可选，团队账号需要
```

**响应示例**：

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

**响应字段说明**：

- `plan_type`: 订阅类型（Plus / Team / Pro）
- `rate_limit.primary_window`: 主窗口限额（通常是 3 小时）
- `rate_limit.secondary_window`: 次窗口限额（通常是 24 小时）
- `used_percent`: 使用百分比（0-100）
- `reset_after_seconds`: 距离重置的秒数

---

## 智谱 AI 接口

### 查询额度

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://bigmodel.cn/api/monitor/usage/quota/limit` |
| 方法 | GET |
| 认证方式 | API Key |
| 源码位置 | `plugin/lib/zhipu.ts:62-106` |

**请求头**：

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**响应示例**：

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

**响应字段说明**：

- `limits[].type`: 限制类型
  - `TOKENS_LIMIT`: 5 小时 Token 限额
  - `TIME_LIMIT`: MCP 搜索次数（月度配额）
- `usage`: 总配额
- `currentValue`: 当前已使用量
- `percentage`: 使用百分比（0-100）
- `nextResetTime`: 下次重置时间戳（仅 TOKENS_LIMIT 有效，单位：毫秒）

---

## Z.ai 接口

### 查询额度

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://api.z.ai/api/monitor/usage/quota/limit` |
| 方法 | GET |
| 认证方式 | API Key |
| 源码位置 | `plugin/lib/zhipu.ts:64, 85-106` |

**请求头**：

```http
Authorization: {api_key}
Content-Type: application/json
User-Agent: OpenCode-Status-Plugin/1.0
```

**响应格式**：与智谱 AI 相同，见上文。

---

## Google Cloud 接口

### 1. 刷新 Access Token

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://oauth2.googleapis.com/token` |
| 方法 | POST |
| 认证方式 | OAuth Refresh Token |
| 源码位置 | `plugin/lib/google.ts:90, 162-184` |

**请求头**：

```http
Content-Type: application/x-www-form-urlencoded
```

**请求体**：

```
client_id={client_id}
&client_secret={client_secret}
&refresh_token={refresh_token}
&grant_type=refresh_token
```

**响应示例**：

```json
{
  "access_token": "ya29.a0AfH6SMB...",
  "expires_in": 3600
}
```

**字段说明**：

- `access_token`: 新的 Access Token（有效期 1 小时）
- `expires_in`: 过期时间（秒）

---

### 2. 查询可用模型额度

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` |
| 方法 | POST |
| 认证方式 | Bearer Token (OAuth) |
| 源码位置 | `plugin/lib/google.ts:65, 193-213` |

**请求头**：

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.9 windows/amd64
```

**请求体**：

```json
{
  "project": "{project_id}"
}
```

**响应示例**：

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

**响应字段说明**：

- `models`: 模型列表（键为模型名称）
- `quotaInfo.remainingFraction`: 剩余比例（0.0-1.0）
- `quotaInfo.resetTime`: 重置时间（ISO 8601 格式）

---

## GitHub Copilot 接口

### 1. 公共计费 API（推荐）

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` |
| 方法 | GET |
| 认证方式 | Fine-grained PAT（Personal Access Token） |
| 源码位置 | `plugin/lib/copilot.ts:157-177` |

**请求头**：

```http
Accept: application/vnd.github+json
Authorization: Bearer {fine_grained_pat}
X-GitHub-Api-Version: 2022-11-28
```

::: tip 什么是 Fine-grained PAT？
Fine-grained PAT（Fine-grained Personal Access Token）是 GitHub 的新一代令牌，支持更细粒度的权限控制。要查询 Copilot 额度，需要授予 "Plan" 读取权限。
:::

**响应示例**：

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

**响应字段说明**：

- `timePeriod`: 时间周期（年月）
- `user`: GitHub 用户名
- `usageItems`: 使用详情数组
  - `sku`: SKU 名称（`Copilot Premium Request` 表示 Premium Requests）
  - `model`: 模型名称
  - `grossQuantity`: 总请求数（未应用折扣）
  - `netQuantity`: 净请求数（应用折扣后）
  - `limit`: 限额

---

### 2. 内部额度 API（旧版）

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/user` |
| 方法 | GET |
| 认证方式 | Copilot Session Token |
| 源码位置 | `plugin/lib/copilot.ts:242-304` |

**请求头**：

```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {copilot_session_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**响应示例**：

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

**响应字段说明**：

- `copilot_plan`: 订阅类型（`free` / `pro` / `pro+` / `business` / `enterprise`）
- `quota_reset_date`: 配额重置日期（YYYY-MM-DD）
- `quota_snapshots.premium_interactions`: Premium Requests（主要配额）
- `quota_snapshots.chat`: Chat 配额（如单独计算）
- `quota_snapshots.completions`: Completions 配额（如单独计算）

---

### 3. Token Exchange API

**接口信息**：

| 项目 | 值 |
| --- | --- |
| URL | `https://api.github.com/copilot_internal/v2/token` |
| 方法 | POST |
| 认证方式 | OAuth Token（从 OpenCode 获取） |
| 源码位置 | `plugin/lib/copilot.ts:183-208` |

**请求头**：

```http
Accept: application/json
Authorization: Bearer {oauth_token}
User-Agent: GitHubCopilotChat/0.35.0
Editor-Version: vscode/1.107.0
Editor-Plugin-Version: copilot-chat/0.35.0
Copilot-Integration-Id: vscode-chat
```

**响应示例**：

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

**响应字段说明**：

- `token`: Copilot Session Token（用于调用内部 API）
- `expires_at`: 过期时间戳（秒）
- `refresh_in`: 建议刷新时间（秒）

::: warning 注意
此接口仅适用于旧版 GitHub OAuth 认证流程。新版 OpenCode 官方合作伙伴认证流程（2026 年 1 月起）可能需要使用 Fine-grained PAT。
:::

---

## 认证方式对比

| 平台 | 认证方式 | 凭证来源 | 凭证文件 |
| --- | --- | --- | --- |
| **OpenAI** | OAuth Bearer Token | OpenCode OAuth | `~/.local/share/opencode/auth.json` |
| **智谱 AI** | API Key | 用户手动配置 | `~/.local/share/opencode/auth.json` |
| **Z.ai** | API Key | 用户手动配置 | `~/.local/share/opencode/auth.json` |
| **Google Cloud** | OAuth Bearer Token | opencode-antigravity-auth 插件 | `~/.config/opencode/antigravity-accounts.json` |
| **GitHub Copilot** | Fine-grained PAT / Copilot Session Token | 用户手动配置或 OAuth | `~/.config/opencode/copilot-quota-token.json` 或 `~/.local/share/opencode/auth.json` |

---

## 请求超时

所有 API 请求都设置了 10 秒超时限制，避免长时间等待：

| 配置 | 值 | 源码位置 |
| --- | --- | --- |
| 超时时间 | 10 秒 | `plugin/lib/types.ts:114` |
| 超时实现 | `fetchWithTimeout` 函数 | `plugin/lib/utils.ts:84-100` |

---

## 安全性

### API Key 脱敏

插件在显示时自动脱敏 API Key，只显示首尾各 2 个字符：

```typescript
// 示例：sk-1234567890abcdef → sk-1****cdef
maskString("sk-1234567890abcdef")  // "sk-1****cdef"
```

**源码位置**：`plugin/lib/utils.ts:130-139`

### 数据存储

- 所有认证文件仅**只读**，插件不会修改任何文件
- API 响应数据**不缓存**、**不存储**
- 敏感信息（API Key、Token）在内存中脱敏后显示

**源码位置**：
- `plugin/mystatus.ts:35-46`（读取认证文件）
- `plugin/lib/utils.ts:130-139`（脱敏函数）

---

## 本课小结

本课介绍了 opencode-mystatus 插件调用的所有官方 API 接口：

| 平台 | API 数量 | 认证方式 |
| --- | --- | --- |
| OpenAI | 1 个 | OAuth Bearer Token |
| 智谱 AI | 1 个 | API Key |
| Z.ai | 1 个 | API Key |
| Google Cloud | 2 个 | OAuth Refresh Token + Access Token |
| GitHub Copilot | 3 个 | Fine-grained PAT / Copilot Session Token |

所有接口都是各平台官方接口，确保数据来源可靠、安全。插件通过本地只读认证文件获取凭证，不上传任何数据。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| OpenAI 额度查询 API | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L127-L155) | 127-155 |
| 智谱 AI 额度查询 API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L62-L106) | 62-106 |
| Z.ai 额度查询 API | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L64) | 64（共用接口） |
| Google Cloud OAuth Token 刷新 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L162-L184) | 162-184 |
| Google Cloud 额度查询 API | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L193-L213) | 193-213 |
| GitHub Copilot 公共计费 API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| GitHub Copilot 内部额度 API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| GitHub Copilot Token Exchange API | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| API Key 脱敏函数 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L139) | 130-139 |
| 请求超时配置 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |

**关键常量**：

- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`：OpenAI 额度查询接口
- `ZHIPU_QUOTA_QUERY_URL = "https://bigmodel.cn/api/monitor/usage/quota/limit"`：智谱 AI 额度查询接口
- `ZAI_QUOTA_QUERY_URL = "https://api.z.ai/api/monitor/usage/quota/limit"`：Z.ai 额度查询接口
- `GOOGLE_QUOTA_API_URL = "https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels"`：Google Cloud 额度查询接口
- `GOOGLE_TOKEN_REFRESH_URL = "https://oauth2.googleapis.com/token"`：Google Cloud OAuth Token 刷新接口

**关键函数**：

- `fetchOpenAIUsage()`：调用 OpenAI 额度 API
- `fetchUsage()`：调用智谱 AI / Z.ai 额度 API（通用）
- `refreshAccessToken()`：刷新 Google Access Token
- `fetchGoogleUsage()`：调用 Google Cloud 额度 API
- `fetchPublicBillingUsage()`：调用 GitHub Copilot 公共计费 API
- `fetchCopilotUsage()`：调用 GitHub Copilot 内部额度 API
- `exchangeForCopilotToken()`：交换 OAuth Token 为 Copilot Session Token
- `maskString()`：脱敏 API Key

</details>
