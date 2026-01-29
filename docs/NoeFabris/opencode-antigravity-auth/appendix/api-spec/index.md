---
title: "API 规范: 统一网关接口 | opencode-antigravity-auth"
sidebarTitle: "API 规范"
subtitle: "API 规范: 统一网关接口 | opencode-antigravity-auth"
description: "学习 Antigravity API 规范，掌握统一网关接口技术细节。涵盖端点配置、OAuth 2.0 认证、请求响应格式、函数调用规则、Thinking 模型配置、速率限制和错误处理机制。"
tags:
  - "API"
  - "Specification"
  - "Antigravity"
  - "Technical Reference"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity API Specification

> **⚠️ Important Notice**: This is Antigravity's **internal API specification**, not a public document. This tutorial is based on direct API testing and is suitable for developers who need to understand API details in depth.

If you just want to use the plugin, refer to [Quick Start](/NoeFabris/opencode-antigravity-auth/start/quick-install/) and [Configuration Guide](/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/).

---

## What You'll Learn

- Understand how Antigravity unified gateway API works
- Master request/response formats and JSON Schema limitations
- Know how to configure Thinking models and function calling
- Understand rate limiting and error handling mechanisms
- Be able to debug API call issues

---

## Antigravity API Overview

**Antigravity** is Google's unified gateway API that accesses multiple AI models including Claude and Gemini through a Gemini-style interface, providing a single format and unified response structure.

::: info Difference from Vertex AI
Antigravity **is not** Vertex AI's direct model API. It is an internal gateway that provides:
- Single API format (all models use Gemini style)
- Project-level access (through Google Cloud authentication)
- Internal routing to model backends (Vertex AI for Claude, Gemini API for Gemini)
- Unified response format (`candidates[]` structure)
:::

**Core Features**:

| Feature | Description |
|---------|-------------|
| **Single API Format** | All models use Gemini-style `contents` array |
| **Project-Level Access** | Requires valid Google Cloud Project ID |
| **Internal Routing** | Automatically routes to correct backend (Vertex AI or Gemini API) |
| **Unified Response** | All models return `candidates[]` structure |
| **Thinking Support** | Claude and Gemini 3 support extended reasoning |

---

## Endpoints and Paths

### API Environments

| Environment | URL | Status | Purpose |
|-------------|-----|--------|---------|
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ Active | Primary endpoint (consistent with CLIProxy) |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ Active | Gemini CLI models, loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ Unavailable | Deprecated |

**Source Location**: [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### API Paths

| Action | Path | Description |
|--------|------|-------------|
| Generate Content | `/v1internal:generateContent` | Non-streaming request |
| Streaming Generation | `/v1internal:streamGenerateContent?alt=sse` | Streaming request (SSE) |
| Load Code Assistant | `/v1internal:loadCodeAssist` | Project discovery (auto-get Project ID) |
| User Onboarding | `/v1internal:onboardUser` | User onboarding (generally not used) |

---

## Authentication

### OAuth 2.0 Flow

```
Authorization URL: https://accounts.google.com/o/oauth2/auth
Token URL: https://oauth2.googleapis.com/token
```

### Required Scopes

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**Source Location**: [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### Required Headers

#### Antigravity Endpoint (Default)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Gemini CLI Endpoint (Models without `:antigravity` suffix)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### Streaming Request Additional Header

```http
Accept: text/event-stream
```

**Source Location**: [`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## Request Format

### Basic Structure

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

### Contents Array (Required)

::: warning Important Limitation
Must use **Gemini-style format**. Anthropic-style `messages` array is **not supported**.
:::

**Correct Format**:

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

**Role Values**:
- `user` - User/human message
- `model` - Model response (**not** `assistant`)

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

| Field | Type | Description |
|-------|------|-------------|
| `maxOutputTokens` | number | Maximum response token count |
| `temperature` | number | Randomness (0.0 - 2.0) |
| `topP` | number | nucleus sampling threshold |
| `topK` | number | top-K sampling |
| `stopSequences` | string[] | Triggers to stop generation |
| `thinkingConfig` | object | Extended reasoning configuration (Thinking models) |

### System Instructions

::: warning Format Limitation
System Instruction **must be an object containing `parts`**, **cannot** be a plain string.
:::

```json
// ✅ Correct
{
  "systemInstruction": {
    "parts": [
      { "text": "You are a helpful assistant." }
    ]
  }
}

// ❌ Incorrect - Will return 400 error
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

#### Function Naming Rules

| Rule | Description |
|------|-------------|
| First Character | Must be letter (a-z, A-Z) or underscore (_) |
| Allowed Characters | `a-zA-Z0-9`, underscore (_), dot (.), colon (:), hyphen (-) |
| Max Length | 64 characters |
| Not Allowed | Slash (/), spaces, other special characters |

**Examples**:
- ✅ `get_weather` - Valid
- ✅ `mcp:mongodb.query` - Valid (colons and dots allowed)
- ✅ `read-file` - Valid (hyphen allowed)
- ❌ `mcp/query` - Invalid (slash not allowed)
- ❌ `123_tool` - Invalid (must start with letter or underscore)

---

## JSON Schema Support

### Supported Features

| Feature | Status | Description |
|---------|--------|-------------|
| `type` | ✅ Supported | `object`, `string`, `number`, `integer`, `boolean`, `array` |
| `properties` | ✅ Supported | Object properties |
| `required` | ✅ Supported | Required field array |
| `description` | ✅ Supported | Field description |
| `enum` | ✅ Supported | Enum values |
| `items` | ✅ Supported | Array element schema |
| `anyOf` | ✅ Supported | Internally converted to `any_of` |
| `allOf` | ✅ Supported | Internally converted to `all_of` |
| `oneOf` | ✅ Supported | Internally converted to `one_of` |
| `additionalProperties` | ✅ Supported | Additional properties schema |

### Unsupported Features (Will Cause 400 Error)

::: danger The following fields will cause 400 errors
- `const` - Use `enum: [value]` instead
- `$ref` - Inline schema definitions
- `$defs` / `definitions` - Inline definitions
- `$schema` - Delete these metadata fields
- `$id` - Delete these metadata fields
- `default` - Delete these documentation fields
- `examples` - Delete these documentation fields
- `title` (nested) - ⚠️ Can cause issues in nested objects
:::

```json
// ❌ Incorrect - Will return 400 error
{ "type": { "const": "email" } }

// ✅ Correct - Use enum instead
{ "type": { "enum": ["email"] } }
```

**Plugin Auto-Handling**: The plugin automatically handles these conversions through the `cleanJSONSchemaForAntigravity()` function in `request-helpers.ts`.

---

## Response Format

### Non-Streaming Response

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

### Streaming Response (SSE)

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hello"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " world"}]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### Response Field Descriptions

| Field | Description |
|-------|-------------|
| `response.candidates` | Response candidate array |
| `response.candidates[].content.role` | Always `"model"` |
| `response.candidates[].content.parts` | Content parts array |
| `response.candidates[].finishReason` | `STOP`, `MAX_TOKENS`, `OTHER` |
| `response.usageMetadata.promptTokenCount` | Input token count |
| `response.usageMetadata.candidatesTokenCount` | Output token count |
| `response.usageMetadata.totalTokenCount` | Total token count |
| `response.usageMetadata.thoughtsTokenCount` | Thinking token count (Gemini) |
| `response.modelVersion` | Actual model used |
| `response.responseId` | Request ID (format varies by model) |
| `traceId` | Debug trace ID |

### Response ID Format

| Model Type | Format | Example |
|-------------|--------|---------|
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Base64-style | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Base64-style | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Function Call Response

When the model wants to call a function:

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

### Providing Function Result

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

## Thinking / Extended Reasoning

### Thinking Configuration

For Thinking-enabled models (`*-thinking`):

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

::: warning Important Limitation
`maxOutputTokens` must be **greater than** `thinkingBudget`
:::

### Thinking Response (Gemini)

Gemini models return signed thinking:

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

### Thinking Response (Claude)

Claude thinking models may include `thought: true` parts:

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

**Plugin Handling**: The plugin automatically caches thinking signatures to avoid signature errors in multi-turn conversations. See [`advanced/session-recovery/`](/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/) for details.

---

## Error Responses

### Error Structure

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

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| 400 | `INVALID_ARGUMENT` | Invalid request format |
| 401 | `UNAUTHENTICATED` | Invalid or expired token |
| 403 | `PERMISSION_DENIED` | No access to resource |
| 404 | `NOT_FOUND` | Model not found |
| 429 | `RESOURCE_EXHAUSTED` | Rate limit exceeded |

### Rate Limit Response

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

**Plugin Handling**: The plugin automatically detects 429 errors and switches accounts or waits for reset time. See [`advanced/rate-limit-handling/`](/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/) for details.

---

## Unsupported Features

The following Anthropic/Vertex AI features are **not supported**:

| Feature | Error |
|---------|-------|
| `anthropic_version` | Unknown field |
| `messages` array | Unknown field (must use `contents`) |
| `max_tokens` | Unknown field (must use `maxOutputTokens`) |
| Plain string `systemInstruction` | Invalid value (must use object format) |
| `system_instruction` (root-level snake_case) | Unknown field |
| JSON Schema `const` | Unknown field (use `enum: [value]` instead) |
| JSON Schema `$ref` | Not supported (inline definitions) |
| JSON Schema `$defs` | Not supported (inline definitions) |
| Tool name containing `/` | Invalid (use `_` or `:` instead) |
| Tool name starting with number | Invalid (must start with letter or underscore) |

---

## Complete Request Example

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

## Response Headers

| Header | Description |
|--------|-------------|
| `x-cloudaicompanion-trace-id` | Debug trace ID |
| `server-timing` | Request duration |

---

## Antigravity vs Vertex AI Anthropic Comparison

| Feature | Antigravity | Vertex AI Anthropic |
|---------|-------------|---------------------|
| Endpoint | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| Request Format | Gemini-style `contents` | Anthropic `messages` |
| `anthropic_version` | Not used | Required |
| Model Names | Simple (`claude-sonnet-4-5`) | Versioned (`claude-4-5@date`) |
| Response Format | `candidates[]` | Anthropic `content[]` |
| Multi-Model Support | Yes (Claude, Gemini, etc.) | Anthropic only |

---

## Summary

This tutorial provided detailed coverage of Antigravity unified gateway API internal specifications:

- **Endpoints**: Three environments (Daily, Production, Autopush), Daily Sandbox is primary endpoint
- **Authentication**: OAuth 2.0 + Bearer Token, required scopes and headers
- **Request Format**: Gemini-style `contents` array, supports System Instruction and Tools
- **JSON Schema**: Supports common features, but not `const`, `$ref`, `$defs`
- **Response Format**: `candidates[]` structure, supports streaming SSE
- **Thinking**: Claude and Gemini 3 support extended reasoning, requires `thinkingConfig`
- **Error Handling**: Standard error format, 429 includes retry delay

If you're debugging API call issues, you can use the plugin's debug mode:

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## Next Lesson Preview

> This is the final appendix chapter. If you want to learn more technical details, you can refer to:
> - [Architecture Overview](/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - Learn about the plugin's modular architecture and call chain
> - [Storage Schema](/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - Learn about account storage file format
> - [Configuration Options](/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - Complete reference manual for all configuration options

If you need to return to the getting started phase, you can start over from [What is Antigravity Auth?](/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/).

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|---------|-----------|-------|
| API Endpoint Constants | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Antigravity Headers | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Gemini CLI Headers | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| Request Transformation Main Logic | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| JSON Schema Cleaning | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | Full file |
| Thought Signature Caching | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | Full file |

**Key Constants**:
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Daily Sandbox endpoint
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Production endpoint
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - Default Project ID
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - Sentinel value to skip thought signature verification

**Key Functions**:
- `cleanJSONSchemaForAntigravity(schema)` - Clean JSON Schema to comply with Antigravity API requirements
- `prepareAntigravityRequest(request)` - Prepare and send Antigravity API request
- `createStreamingTransformer()` - Create streaming response transformer

</details>
