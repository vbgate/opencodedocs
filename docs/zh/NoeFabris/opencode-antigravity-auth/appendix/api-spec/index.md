---
title: "API 规范: Antigravity 网关接口技术参考 | antigravity-auth"
sidebarTitle: "调试 API 调用"
subtitle: "Antigravity API 规范"
description: "学习 Antigravity API 规范，掌握统一网关接口的端点配置、OAuth 2.0 认证、请求响应格式、函数调用规则和错误处理机制。"
tags:
  - "API"
  - "规范"
  - "Antigravity"
  - "技术参考"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity API 规范

> **⚠️ 重要提示**：这是 Antigravity 的**内部 API 规范**，并非公开文档。本教程基于直接 API 测试验证，适用于需要深入了解 API 细节的开发者。

如果你只是想使用插件，请参考 [快速开始](/zh/NoeFabris/opencode-antigravity-auth/start/quick-install/) 和 [配置指南](/zh/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/)。

---

## 学完你能做什么

- 理解 Antigravity 统一网关 API 的工作原理
- 掌握请求/响应格式和 JSON Schema 限制
- 知道如何配置 Thinking 模型和函数调用
- 理解速率限制和错误处理的机制
- 能够调试 API 调用问题

---

## Antigravity API 概述

**Antigravity** 是 Google 的统一网关 API，通过 Gemini 风格接口访问 Claude、Gemini 等多个 AI 模型，提供单一格式和统一响应结构。

::: info 与 Vertex AI 的区别
Antigravity **不是** Vertex AI 的直接模型 API。它是一个内部网关，提供：
- 单一 API 格式（所有模型都是 Gemini 风格）
- 项目级访问（通过 Google Cloud 认证）
- 内部路由到模型后端（Vertex AI for Claude、Gemini API for Gemini）
- 统一响应格式（`candidates[]` 结构）
:::

**核心特性**：

| 特性 | 说明 |
|------|------|
| **单 API 格式** | 所有模型使用 Gemini 风格的 `contents` 数组 |
| **项目级访问** | 需要有效的 Google Cloud Project ID |
| **内部路由** | 自动路由到正确的后端（Vertex AI 或 Gemini API） |
| **统一响应** | 所有模型返回 `candidates[]` 结构 |
| **Thinking 支持** | Claude 和 Gemini 3 支持扩展推理 |

---

## 端点与路径

### API 环境

| 环境 | URL | 状态 | 用途 |
|------|------|------|------|
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ 活跃 | 主要端点（与 CLIProxy 一致） |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ 活跃 | Gemini CLI 模型、loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ 不可用 | 已废弃 |

**源码位置**：[`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### API 路径

| Action | 路径 | 说明 |
|--------|------|------|
| 生成内容 | `/v1internal:generateContent` | 非流式请求 |
| 流式生成 | `/v1internal:streamGenerateContent?alt=sse` | 流式请求（SSE） |
| 加载代码助手 | `/v1internal:loadCodeAssist` | 项目发现（自动获取 Project ID） |
| 用户引导 | `/v1internal:onboardUser` | 用户引导（一般不使用） |

---

## 认证方式

### OAuth 2.0 流程

```
授权 URL: https://accounts.google.com/o/oauth2/auth
令牌 URL: https://oauth2.googleapis.com/token
```

### 必需 Scopes

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**源码位置**：[`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### 必需 Headers

#### Antigravity 端点（默认）

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Gemini CLI 端点（无 `:antigravity` 后缀的模型）

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### 流式请求额外 Header

```http
Accept: text/event-stream
```

**源码位置**：[`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## 请求格式

### 基本结构

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

### Contents 数组（必须）

::: warning 重要限制
必须使用** Gemini 风格格式**。Anthropic 风格的 `messages` 数组**不支持**。
:::

**正确格式**：

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
- `user` - 用户/人类消息
- `model` - 模型响应（**不是** `assistant`）

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

| 字段 | 类型 | 说明 |
|------|------|------|
| `maxOutputTokens` | number | 响应最大 token 数 |
| `temperature` | number | 随机性（0.0 - 2.0） |
| `topP` | number | nucleus sampling 阈值 |
| `topK` | number | top-K sampling |
| `stopSequences` | string[] | 停止生成的触发词 |
| `thinkingConfig` | object | 扩展推理配置（Thinking 模型） |

### System Instructions

::: warning 格式限制
System Instruction **必须是包含 `parts` 的对象**，**不能**是纯字符串。
:::

```json
// ✅ 正确
{
  "systemInstruction": {
    "parts": [
      { "text": "You are a helpful assistant." }
    ]
  }
}

// ❌ 错误 - 会返回 400 错误
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

#### Function 命名规则

| 规则 | 说明 |
|------|------|
| 首字符 | 必须是字母（a-z, A-Z）或下划线（_） |
| 允许字符 | `a-zA-Z0-9`、下划线（_）、点（.）、冒号（:）、连字符（-） |
| 最大长度 | 64 字符 |
| 不允许 | 斜杠（/）、空格、其他特殊字符 |

**示例**：
- ✅ `get_weather` - 有效
- ✅ `mcp:mongodb.query` - 有效（允许冒号和点）
- ✅ `read-file` - 有效（允许连字符）
- ❌ `mcp/query` - 无效（不允许斜杠）
- ❌ `123_tool` - 无效（必须以字母或下划线开头）

---

## JSON Schema 支持

### 支持的功能

| 功能 | 状态 | 说明 |
|------|------|------|
| `type` | ✅ 支持 | `object`、`string`、`number`、`integer`、`boolean`、`array` |
| `properties` | ✅ 支持 | 对象属性 |
| `required` | ✅ 支持 | 必填字段数组 |
| `description` | ✅ 支持 | 字段描述 |
| `enum` | ✅ 支持 | 枚举值 |
| `items` | ✅ 支持 | 数组元素 schema |
| `anyOf` | ✅ 支持 | 内部转换为 `any_of` |
| `allOf` | ✅ 支持 | 内部转换为 `all_of` |
| `oneOf` | ✅ 支持 | 内部转换为 `one_of` |
| `additionalProperties` | ✅ 支持 | 额外属性 schema |

### 不支持的功能（会导致 400 错误）

::: danger 以下字段会引发 400 错误
- `const` - 使用 `enum: [value]` 代替
- `$ref` - 内联 schema 定义
- `$defs` / `definitions` - 内联定义
- `$schema` - 删除这些元数据字段
- `$id` - 删除这些元数据字段
- `default` - 删除这些文档字段
- `examples` - 删除这些文档字段
- `title`（嵌套） - ⚠️ 在嵌套对象中可能导致问题
:::

```json
// ❌ 错误 - 会返回 400 错误
{ "type": { "const": "email" } }

// ✅ 正确 - 使用 enum 代替
{ "type": { "enum": ["email"] } }
```

**插件自动处理**：插件通过 `request-helpers.ts` 中的 `cleanJSONSchemaForAntigravity()` 函数自动处理这些转换。

---

## 响应格式

### 非流式响应

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

### 流式响应（SSE）

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hello"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " world"}]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### 响应字段说明

| 字段 | 说明 |
|------|------|
| `response.candidates` | 响应候选数组 |
| `response.candidates[].content.role` | 始终为 `"model"` |
| `response.candidates[].content.parts` | 内容部分数组 |
| `response.candidates[].finishReason` | `STOP`、`MAX_TOKENS`、`OTHER` |
| `response.usageMetadata.promptTokenCount` | 输入 token 数 |
| `response.usageMetadata.candidatesTokenCount` | 输出 token 数 |
| `response.usageMetadata.totalTokenCount` | 总 token 数 |
| `response.usageMetadata.thoughtsTokenCount` | Thinking token 数（Gemini） |
| `response.modelVersion` | 实际使用的模型 |
| `response.responseId` | 请求 ID（格式因模型而异） |
| `traceId` | 调试用跟踪 ID |

### Response ID 格式

| 模型类型 | 格式 | 示例 |
|----------|------|------|
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Base64 风格 | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Base64 风格 | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Function Call 响应

当模型想要调用函数时：

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

### 提供 Function 结果

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

## Thinking / 扩展推理

### Thinking 配置

对于支持 Thinking 的模型（`*-thinking`）：

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
`maxOutputTokens` 必须**大于** `thinkingBudget`
:::

### Thinking 响应（Gemini）

Gemini 模型返回带签名的 thinking：

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

### Thinking 响应（Claude）

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

**插件处理**：插件会自动缓存 thinking 签名，避免多轮对话中的签名错误。详见 [advanced/session-recovery/](/zh/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/)。

---

## 错误响应

### 错误结构

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

### 常见错误码

| Code | Status | 说明 |
|------|--------|------|
| 400 | `INVALID_ARGUMENT` | 无效的请求格式 |
| 401 | `UNAUTHENTICATED` | 无效或过期的令牌 |
| 403 | `PERMISSION_DENIED` | 无资源访问权限 |
| 404 | `NOT_FOUND` | 模型未找到 |
| 429 | `RESOURCE_EXHAUSTED` | 速率限制超出 |

### 速率限制响应

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

**插件处理**：插件会自动检测 429 错误，切换账户或等待重置时间。详见 [advanced/rate-limit-handling/](/zh/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)。

---

## 不支持的功能

以下 Anthropic/Vertex AI 功能**不支持**：

| 功能 | 错误 |
|------|------|
| `anthropic_version` | Unknown field |
| `messages` 数组 | Unknown field（必须用 `contents`） |
| `max_tokens` | Unknown field（必须用 `maxOutputTokens`） |
| 纯字符串 `systemInstruction` | Invalid value（必须用对象格式） |
| `system_instruction`（根级 snake_case） | Unknown field |
| JSON Schema `const` | Unknown field（用 `enum: [value]` 代替） |
| JSON Schema `$ref` | 不支持（内联定义） |
| JSON Schema `$defs` | 不支持（内联定义） |
| Tool 名称包含 `/` | Invalid（用 `_` 或 `:` 代替） |
| Tool 名称以数字开头 | Invalid（必须以字母或下划线开头） |

---

## 完整请求示例

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

## 响应 Headers

| Header | 说明 |
|--------|------|
| `x-cloudaicompanion-trace-id` | 调试用跟踪 ID |
| `server-timing` | 请求持续时间 |

---

## Antigravity vs Vertex AI Anthropic 对比

| 特性 | Antigravity | Vertex AI Anthropic |
|------|-------------|---------------------|
| 端点 | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| 请求格式 | Gemini 风格 `contents` | Anthropic `messages` |
| `anthropic_version` | 不使用 | 必需 |
| 模型名称 | 简单（`claude-sonnet-4-5`） | 版本化（`claude-4-5@date`） |
| 响应格式 | `candidates[]` | Anthropic `content[]` |
| 多模型支持 | 是（Claude、Gemini 等） | 仅 Anthropic |

---

## 本课小结

本教程详细介绍了 Antigravity 统一网关 API 的内部规范：

- **端点**：三个环境（Daily、Production、Autopush），Daily Sandbox 是主要端点
- **认证**：OAuth 2.0 + Bearer Token，必需的 scopes 和 headers
- **请求格式**：Gemini 风格的 `contents` 数组，支持 System Instruction 和 Tools
- **JSON Schema**：支持常用功能，但不支持 `const`、`$ref`、`$defs`
- **响应格式**：`candidates[]` 结构，支持流式 SSE
- **Thinking**：Claude 和 Gemini 3 支持扩展推理，需要 `thinkingConfig`
- **错误处理**：标准错误格式，429 包含重试延迟

如果你在调试 API 调用问题，可以使用插件的调试模式：

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## 下一课预告

> 这是最后一课附录章节。如果你想了解更多技术细节，可以参考：
> - [架构概览](/zh/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - 了解插件的模块架构和调用链路
> - [存储格式](/zh/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - 了解账户存储文件格式
> - [配置选项](/zh/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - 所有配置选项的完整参考手册

如果你需要回到上手阶段，可以从 [什么是 Antigravity Auth](/zh/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/) 重新开始。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| API 端点常量 | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Antigravity Headers | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Gemini CLI Headers | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| 请求转换主逻辑 | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| JSON Schema 清理 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 全文件 |
| 思考签名缓存 | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | 全文件 |

**关键常量**：
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Daily Sandbox 端点
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Production 端点
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - 默认项目 ID
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - 跳过思考签名验证的哨兵值

**关键函数**：
- `cleanJSONSchemaForAntigravity(schema)` - 清理 JSON Schema 以符合 Antigravity API 要求
- `prepareAntigravityRequest(request)` - 准备并发送 Antigravity API 请求
- `createStreamingTransformer()` - 创建流式响应转换器

</details>
