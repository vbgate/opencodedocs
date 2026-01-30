---
title: "API 規範: Antigravity 閘道介面技術參考 | antigravity-auth"
sidebarTitle: "偵錯 API 呼叫"
subtitle: "Antigravity API 規範"
description: "學習 Antigravity API 規範，掌握統一閘道介面的端點設定、OAuth 2.0 認證、請求回應格式、函式呼叫規則和錯誤處理機制。"
tags:
  - "API"
  - "規範"
  - "Antigravity"
  - "技術參考"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity API 規範

> **⚠️ 重要提示**：這是 Antigravity 的**內部 API 規範**，並非公開文件。本教學基於直接 API 測試驗證，適用於需要深入了解 API 細節的開發者。

如果你只是想使用外掛，請參考 [快速開始](/zh-tw/NoeFabris/opencode-antigravity-auth/start/quick-install/) 和 [設定指南](/zh-tw/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/)。

---

## 學完你能做什麼

- 理解 Antigravity 統一閘道 API 的工作原理
- 掌握請求/回應格式和 JSON Schema 限制
- 知道如何設定 Thinking 模型和函式呼叫
- 理解速率限制和錯誤處理的機制
- 能夠偵錯 API 呼叫問題

---

## Antigravity API 概述

**Antigravity** 是 Google 的統一閘道 API，透過 Gemini 風格介面存取 Claude、Gemini 等多個 AI 模型，提供單一格式和統一回應結構。

::: info 與 Vertex AI 的區別
Antigravity **不是** Vertex AI 的直接模型 API。它是一個內部閘道，提供：
- 單一 API 格式（所有模型都是 Gemini 風格）
- 專案級存取（透過 Google Cloud 認證）
- 內部路由到模型後端（Vertex AI for Claude、Gemini API for Gemini）
- 統一回應格式（`candidates[]` 結構）
:::

**核心特性**：

| 特性 | 說明 |
|--- | ---|
| **單 API 格式** | 所有模型使用 Gemini 風格的 `contents` 陣列 |
| **專案級存取** | 需要有效的 Google Cloud Project ID |
| **內部路由** | 自動路由到正確的後端（Vertex AI 或 Gemini API） |
| **統一回應** | 所有模型回傳 `candidates[]` 結構 |
| **Thinking 支援** | Claude 和 Gemini 3 支援延伸推理 |

---

## 端點與路徑

### API 環境

| 環境 | URL | 狀態 | 用途 |
|--- | --- | --- | ---|
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ 活躍 | 主要端點（與 CLIProxy 一致） |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ 活躍 | Gemini CLI 模型、loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ 不可用 | 已廢棄 |

**原始碼位置**：[`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### API 路徑

| Action | 路徑 | 說明 |
|--- | --- | ---|
| 產生內容 | `/v1internal:generateContent` | 非串流請求 |
| 串流產生 | `/v1internal:streamGenerateContent?alt=sse` | 串流請求（SSE） |
| 載入程式碼助手 | `/v1internal:loadCodeAssist` | 專案發現（自動取得 Project ID） |
| 使用者引導 | `/v1internal:onboardUser` | 使用者引導（一般不使用） |

---

## 認證方式

### OAuth 2.0 流程

```
授權 URL: https://accounts.google.com/o/oauth2/auth
權杖 URL: https://oauth2.googleapis.com/token
```

### 必需 Scopes

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**原始碼位置**：[`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### 必需 Headers

#### Antigravity 端點（預設）

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Gemini CLI 端點（無 `:antigravity` 後綴的模型）

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### 串流請求額外 Header

```http
Accept: text/event-stream
```

**原始碼位置**：[`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## 請求格式

### 基本結構

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

### Contents 陣列（必須）

::: warning 重要限制
必須使用** Gemini 風格格式**。Anthropic 風格的 `messages` 陣列**不支援**。
:::

**正確格式**：

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Your message here" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Assistant response" }
      ]
    }
  ]
}
```

**Role 值**：
- `user` - 使用者/人類訊息
- `model` - 模型回應（**不是** `assistant`）

### Generation Config

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

| 欄位 | 型別 | 說明 |
|--- | --- | ---|
| `maxOutputTokens` | number | 回應最大 token 數 |
| `temperature` | number | 隨機性（0.0 - 2.0） |
| `topP` | number | nucleus sampling 閾值 |
| `topK` | number | top-K sampling |
| `stopSequences` | string[] | 停止產生的觸發詞 |
| `thinkingConfig` | object | 延伸推理設定（Thinking 模型） |

### System Instructions

::: warning 格式限制
System Instruction **必須是包含 `parts` 的物件**，**不能**是純字串。
:::

```json
// ✅ 正確
{
  "systemInstruction": {
    "parts": [
      { "text": "You are a helpful assistant." }
    ]
  }
}

// ❌ 錯誤 - 會回傳 400 錯誤
{
  "systemInstruction": "You are a helpful assistant."
}
```

### Tools / Function Calling

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Get weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
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

#### Function 命名規則

| 規則 | 說明 |
|--- | ---|
| 首字元 | 必須是字母（a-z, A-Z）或底線（_） |
| 允許字元 | `a-zA-Z0-9`、底線（_）、點（.）、冒號（:）、連字號（-） |
| 最大長度 | 64 字元 |
| 不允許 | 斜線（/）、空格、其他特殊字元 |

**範例**：
- ✅ `get_weather` - 有效
- ✅ `mcp:mongodb.query` - 有效（允許冒號和點）
- ✅ `read-file` - 有效（允許連字號）
- ❌ `mcp/query` - 無效（不允許斜線）
- ❌ `123_tool` - 無效（必須以字母或底線開頭）

---

## JSON Schema 支援

### 支援的功能

| 功能 | 狀態 | 說明 |
|--- | --- | ---|
| `type` | ✅ 支援 | `object`、`string`、`number`、`integer`、`boolean`、`array` |
| `properties` | ✅ 支援 | 物件屬性 |
| `required` | ✅ 支援 | 必填欄位陣列 |
| `description` | ✅ 支援 | 欄位描述 |
| `enum` | ✅ 支援 | 列舉值 |
| `items` | ✅ 支援 | 陣列元素 schema |
| `anyOf` | ✅ 支援 | 內部轉換為 `any_of` |
| `allOf` | ✅ 支援 | 內部轉換為 `all_of` |
| `oneOf` | ✅ 支援 | 內部轉換為 `one_of` |
| `additionalProperties` | ✅ 支援 | 額外屬性 schema |

### 不支援的功能（會導致 400 錯誤）

::: danger 以下欄位會引發 400 錯誤
- `const` - 使用 `enum: [value]` 代替
- `$ref` - 內聯 schema 定義
- `$defs` / `definitions` - 內聯定義
- `$schema` - 刪除這些後設資料欄位
- `$id` - 刪除這些後設資料欄位
- `default` - 刪除這些文件欄位
- `examples` - 刪除這些文件欄位
- `title`（巢狀） - ⚠️ 在巢狀物件中可能導致問題
:::

```json
// ❌ 錯誤 - 會回傳 400 錯誤
{ "type": { "const": "email" } }

// ✅ 正確 - 使用 enum 代替
{ "type": { "enum": ["email"] } }
```

**外掛自動處理**：外掛透過 `request-helpers.ts` 中的 `cleanJSONSchemaForAntigravity()` 函式自動處理這些轉換。

---

## 回應格式

### 非串流回應

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Response text here" }
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

### 串流回應（SSE）

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hello"]}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " world"]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### 回應欄位說明

| 欄位 | 說明 |
|--- | ---|
| `response.candidates` | 回應候選陣列 |
| `response.candidates[].content.role` | 始終為 `"model"` |
| `response.candidates[].content.parts` | 內容部分陣列 |
| `response.candidates[].finishReason` | `STOP`、`MAX_TOKENS`、`OTHER` |
| `response.usageMetadata.promptTokenCount` | 輸入 token 數 |
| `response.usageMetadata.candidatesTokenCount` | 輸出 token 數 |
| `response.usageMetadata.totalTokenCount` | 總 token 數 |
| `response.usageMetadata.thoughtsTokenCount` | Thinking token 數（Gemini） |
| `response.modelVersion` | 實際使用的模型 |
| `response.responseId` | 請求 ID（格式因模型而異） |
| `traceId` | 除錯用追蹤 ID |

### Response ID 格式

| 模型型別 | 格式 | 範例 |
|--- | --- | ---|
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Base64 風格 | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Base64 風格 | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Function Call 回應

當模型想要呼叫函式時：

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

### 提供 Function 結果

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "What's the weather?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / 延伸推理

### Thinking 設定

對於支援 Thinking 的模型（`*-thinking`）：

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

::: warning 重要限制
`maxOutputTokens` 必須**大於** `thinkingBudget`
:::

### Thinking 回應（Gemini）

Gemini 模型回傳帶簽名的 thinking：

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Let me think about this..."
    },
    {
      "text": "The answer is..."
    }
  ]
}
```

### Thinking 回應（Claude）

Claude thinking 模型可能包含 `thought: true` 部分：

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Reasoning process...",
      "thoughtSignature": "..."
    },
    {
      "text": "Final answer..."
    }
  ]
}
```

**外掛處理**：外掛會自動快取 thinking 簽名，避免多輪對話中的簽名錯誤。詳見 [advanced/session-recovery/](/zh-tw/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/)。

---

## 錯誤回應

### 錯誤結構

```json
{
  "error": {
    "code": 400,
    "message": "Error description",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### 常見錯誤碼

| Code | Status | 說明 |
|--- | --- | ---|
| 400 | `INVALID_ARGUMENT` | 無效的請求格式 |
| 401 | `UNAUTHENTICATED` | 無效或過期的權杖 |
| 403 | `PERMISSION_DENIED` | 無資源存取權限 |
| 404 | `NOT_FOUND` | 模型未找到 |
| 429 | `RESOURCE_EXHAUSTED` | 速率限制超出 |

### 速率限制回應

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

**外掛處理**：外掛會自動偵測 429 錯誤，切換帳號或等待重置時間。詳見 [advanced/rate-limit-handling/](/zh-tw/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)。

---

## 不支援的功能

以下 Anthropic/Vertex AI 功能**不支援**：

| 功能 | 錯誤 |
|--- | ---|
| `anthropic_version` | Unknown field |
| `messages` 陣列 | Unknown field（必須用 `contents`） |
| `max_tokens` | Unknown field（必須用 `maxOutputTokens`） |
| 純字串 `systemInstruction` | Invalid value（必須用物件格式） |
| `system_instruction`（根級 snake_case） | Unknown field |
| JSON Schema `const` | Unknown field（用 `enum: [value]` 代替） |
| JSON Schema `$ref` | 不支援（內聯定義） |
| JSON Schema `$defs` | 不支援（內聯定義） |
| Tool 名稱包含 `/` | Invalid（用 `_` 或 `:` 代替） |
| Tool 名稱以數字開頭 | Invalid（必須以字母或底線開頭） |

---

## 完整請求範例

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Hello, how are you?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "You are a helpful assistant." }
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

## 回應 Headers

| Header | 說明 |
|--- | ---|
| `x-cloudaicompanion-trace-id` | 除錯用追蹤 ID |
| `server-timing` | 請求持續時間 |

---

## Antigravity vs Vertex AI Anthropic 對比

| 特性 | Antigravity | Vertex AI Anthropic |
|--- | --- | ---|
| 端點 | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| 請求格式 | Gemini 風格 `contents` | Anthropic `messages` |
| `anthropic_version` | 不使用 | 必需 |
| 模型名稱 | 簡單（`claude-sonnet-4-5`） | 版本化（`claude-4-5@date`） |
| 回應格式 | `candidates[]` | Anthropic `content[]` |
| 多模型支援 | 是（Claude、Gemini 等） | 僅 Anthropic |

---

## 本課小結

本教學詳細介紹了 Antigravity 統一閘道 API 的內部規範：

- **端點**：三個環境（Daily、Production、Autopush），Daily Sandbox 是主要端點
- **認證**：OAuth 2.0 + Bearer Token，必需的 scopes 和 headers
- **請求格式**：Gemini 風格的 `contents` 陣列，支援 System Instruction 和 Tools
- **JSON Schema**：支援常用功能，但不支援 `const`、`$ref`、`$defs`
- **回應格式**：`candidates[]` 結構，支援串流 SSE
- **Thinking**：Claude 和 Gemini 3 支援延伸推理，需要 `thinkingConfig`
- **錯誤處理**：標準錯誤格式，429 包含重試延遲

如果你在偵錯 API 呼叫問題，可以使用外掛的除錯模式：

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## 下一課預告

> 這是最後一課附錄章節。如果你想了解更多技術細節，可以參考：
> - [架構概覽](/zh-tw/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - 了解外掛的模組架構和呼叫鏈路
> - [儲存格式](/zh-tw/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - 了解帳號儲存檔案格式
> - [設定選項](/zh-tw/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - 所有設定選項的完整參考手冊

如果你需要回到上手階段，可以從 [什麼是 Antigravity Auth](/zh-tw/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/) 重新開始。

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| API 端點常數 | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Antigravity Headers | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Gemini CLI Headers | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| 請求轉換主邏輯 | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| JSON Schema 清理 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 全檔案 |
| 思考簽名快取 | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | 全檔案 |

**關鍵常數**：
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Daily Sandbox 端點
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Production 端點
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - 預設專案 ID
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - 跳過思考簽名驗證的哨兵值

**關鍵函式**：
- `cleanJSONSchemaForAntigravity(schema)` - 清理 JSON Schema 以符合 Antigravity API 要求
- `prepareAntigravityRequest(request)` - 準備並發送 Antigravity API 請求
- `createStreamingTransformer()` - 建立串流回應轉換器

</details>
