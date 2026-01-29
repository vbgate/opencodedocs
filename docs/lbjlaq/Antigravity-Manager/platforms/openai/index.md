---
title: "OpenAI API: Chat Completions | Antigravity-Manager"
sidebarTitle: "OpenAI"
subtitle: "OpenAI API: Chat Completions"
description: "Learn Antigravity Tools' OpenAI compatible API. Configure base_url, auth headers, and troubleshoot 401/404/429 errors for /v1/chat/completions and /v1/responses."
tags:
  - "OpenAI"
  - "API Proxy"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 999
---

# OpenAI Compatible API: Implementation Strategy for /v1/chat/completions and /v1/responses

Use this **OpenAI Compatible API** to connect existing OpenAI SDKs/clients directly to your Antigravity Tools local gateway. Focus on making `/v1/chat/completions` and `/v1/responses` work, and learn to troubleshoot quickly using response headers.

## What You'll Learn

- Connect directly to Antigravity Tools' local gateway using OpenAI SDK (or curl)
- Make `/v1/chat/completions` (including `stream: true`) and `/v1/responses` work
- Understand the model list from `/v1/models` and the `X-Mapped-Model` in response headers
- Know where to start troubleshooting when encountering 401/404/429 errors

## Your Current Struggles

Many clients/SDKs only recognize OpenAI's interface shape: fixed URLs, fixed JSON fields, fixed SSE streaming format. Antigravity Tools' goal is not to make you change clients, but to make clients "think they're calling OpenAI"—actually transforming requests to internal upstream calls, then converting results back to OpenAI format.

## When to Use This Approach

- You already have a bunch of tools that only support OpenAI (IDE plugins, scripts, bots, SDKs), and don't want to write a new integration for each one
- You want to unify by routing requests to a local (or LAN) gateway using `base_url`, then let the gateway handle account scheduling, retry, and monitoring

## 🎒 Prerequisites

::: warning Prerequisites
- You have already started the reverse proxy service on Antigravity Tools' "API Proxy" page, and noted the port (e.g., `8045`)
- You have added at least one available account, otherwise the reverse proxy cannot get upstream tokens
:::

::: info How to pass authentication?
When you enable `proxy.auth_mode` and configure `proxy.api_key`, requests need to carry an API Key.

Antigravity Tools' middleware prioritizes reading `Authorization`, and also supports `x-api-key` and `x-goog-api-key`. (Implementation in `src-tauri/src/proxy/middleware/auth.rs`)
:::

## What is OpenAI Compatible API?

**OpenAI Compatible API** is a set of "looks like OpenAI" HTTP routes and JSON/SSE protocols. Clients send requests to the local gateway in OpenAI's request format, the gateway then transforms requests to internal upstream calls and converts upstream responses back to OpenAI response structure, so existing OpenAI SDKs can work with basically no modifications.

### Compatible Endpoints Overview (relevant to this lesson)

| Endpoint | Purpose | Code Evidence |
| --- | --- | --- |
| `POST /v1/chat/completions` | Chat Completions (including streaming) | Route registration in `src-tauri/src/proxy/server.rs`; `src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Legacy Completions (reuses same handler) | Route registration in `src-tauri/src/proxy/server.rs` |
| `POST /v1/responses` | Responses/Codex CLI compatible (reuses same handler) | Route registration in `src-tauri/src/proxy/server.rs` (comment: compatible with Codex CLI) |
| `GET /v1/models` | Returns model list (including custom mapping + dynamic generation) | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## Follow Along

### Step 1: Confirm Service is Running with curl (/healthz + /v1/models)

**Why**
Eliminate basic issues like "service not started / wrong port / blocked by firewall" first.

```bash
 # 1) Health check
curl -s http://127.0.0.1:8045/healthz

 # 2) Pull model list
curl -s http://127.0.0.1:8045/v1/models
```

**What you should see**: `/healthz` returns something like `{"status":"ok"}`; `/v1/models` returns `{"object":"list","data":[...]}`.

### Step 2: Call /v1/chat/completions with OpenAI Python SDK

**Why**
This step proves that the entire chain "OpenAI SDK → local gateway → upstream → OpenAI response transformation" is working.

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "你好，请自我介绍"}],
)

print(response.choices[0].message.content)
```

**What you should see**: Terminal prints a model reply text.

### Step 3: Enable stream, confirm SSE streaming return

**Why**
Many clients rely on OpenAI's SSE protocol (`Content-Type: text/event-stream`). This step confirms the streaming chain and event format are available.

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "用三句话解释一下什么是本地反代网关"}
    ]
  }'
```

**What you should see**: Terminal continuously outputs lines starting with `data: { ... }`, ending with `data: [DONE]`.

### Step 4: Make a request with /v1/responses (Codex/Responses style)

**Why**
Some tools use `/v1/responses` or use fields like `instructions` and `input` in the request body. This project "normalizes" such requests into `messages` and then reuses the same transformation logic. (Handler in `src-tauri/src/proxy/handlers/openai.rs`)

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "你是一个严谨的代码审查员。",
    "input": "请指出下面这段代码最可能的 bug：\n\nfunction add(a, b) { return a - b }"
  }'
```

**What you should see**: Response body is an OpenAI-style response object (this project converts Gemini responses to OpenAI `choices[].message.content`).

### Step 5: Confirm Model Routing Works (Check X-Mapped-Model Response Header)

**Why**
The `model` you write in the client may not be the actual "physical model" being called. The gateway first does model mapping (including custom mapping/wildcards, see [Model Routing: Custom Mapping, Wildcard Priority, and Preset Strategies](/lbjlaq/Antigravity-Manager/advanced/model-router/)), then puts the final result in response headers for easy troubleshooting.

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

**What you should see**: Response headers include `X-Mapped-Model: ...` (e.g., mapped to `gemini-2.5-flash`), and may also include `X-Account-Email: ...`.

## Checkpoint ✅

- `GET /healthz` returns `{"status":"ok"}` (or equivalent JSON)
- `GET /v1/models` returns `object=list` and `data` is an array
- `/v1/chat/completions` non-streaming request can get `choices[0].message.content`
- When `stream: true`, can receive SSE ending with `[DONE]`
- `curl -i` can see `X-Mapped-Model` response header

## Common Pitfalls

### 1) Base URL wrong → 404 (most common)

- In OpenAI SDK examples, `base_url` needs to end with `/v1` (see Python example in project README).
- Some clients "stack paths". For example, README explicitly mentions: Kilo Code in OpenAI mode might build non-standard paths like `/v1/chat/completions/responses`, triggering 404.

### 2) 401: Not upstream down, but you didn't bring key or mode is wrong

When the auth strategy's "effective mode" is not `off`, middleware validates request headers: `Authorization: Bearer <proxy.api_key>`, and also supports `x-api-key` and `x-goog-api-key`. (Implementation in `src-tauri/src/proxy/middleware/auth.rs`)

::: tip Auth mode hint
When `auth_mode = auto`, it automatically decides based on `allow_lan_access`:
- `allow_lan_access = true` → effective mode is `all_except_health` (auth required except `/healthz`)
- `allow_lan_access = false` → effective mode is `off` (no auth required for local access)
:::

### 3) 429/503/529: Proxy retries + rotates accounts, but may also "pool exhausted"

OpenAI handler has built-in max 3 attempts (limited by account pool size), encounters some errors and waits/rotates accounts to retry. (Implementation in `src-tauri/src/proxy/handlers/openai.rs`)

## Lesson Summary

- `/v1/chat/completions` is the most universal entry point, `stream: true` goes through SSE
- `/v1/responses` and `/v1/completions` use the same compatible handler, core is first normalizing requests to `messages`
- `X-Mapped-Model` helps you confirm the "client model name → final physical model" mapping result

## Next Lesson Preview

> In the next lesson, we continue to look at **Anthropic Compatible API: /v1/messages and Claude Code's Key Contracts** (corresponding chapter: `platforms-anthropic`).

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
| --- | --- | --- |
| OpenAI route registration (including /v1/responses) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Chat Completions handler (including Responses format detection) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| /v1/completions and /v1/responses handler (Codex/Responses normalization + retry/rotation) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| /v1/models return (dynamic model list) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| OpenAI request data structure (messages/instructions/input/size/quality) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
| OpenAI -> Gemini request transformation (systemInstruction/thinkingConfig/tools) | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L6-L553) | 6-553 |
| Gemini -> OpenAI response transformation (choices/usageMetadata) | [`src-tauri/src/proxy/mappers/openai/response.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/response.rs#L5-L214) | 5-214 |
| Model mapping and wildcard priority (exact > wildcard > default) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| Auth middleware (Authorization/x-api-key/x-goog-api-key) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |

**Key Constants**:
- `MAX_RETRY_ATTEMPTS = 3`: Max attempts for OpenAI protocol (including rotation) (see `src-tauri/src/proxy/handlers/openai.rs`)

**Key Functions**:
- `transform_openai_request(...)`: Converts OpenAI request body to internal upstream request (see `src-tauri/src/proxy/mappers/openai/request.rs`)
- `transform_openai_response(...)`: Converts upstream response to OpenAI `choices`/`usage` (see `src-tauri/src/proxy/mappers/openai/response.rs`)

</details>
