---
title: "Gemini API: 本地网关集成 | Antigravity-Manager"
sidebarTitle: "Gemini API"
subtitle: "Gemini API: 本地网关集成"
description: "学习 Antigravity Tools 的 Gemini 原生 API 集成。通过本地网关调用 /v1beta/models 端点，支持 generateContent 和 streamGenerateContent。"
tags:
  - "Gemini"
  - "Google SDK"
  - "API Proxy"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 999
---

# Gemini API Integration: Connect Google SDK Directly to Local Gateway

## What You'll Learn

- Use the Gemini native endpoints (`/v1beta/models/*`) exposed by Antigravity Tools to connect your clients
- Call your local gateway using Google-style `:generateContent` / `:streamGenerateContent` paths
- Understand why `x-goog-api-key` works directly when Proxy authentication is enabled

## Your Current Challenge

You may have already started your local reverse proxy, but get stuck when it comes to Gemini:

- Google SDK defaults to `generativelanguage.googleapis.com`, how do you change it to your own `http://127.0.0.1:<port>`?
- Gemini paths include colons (`models/<model>:generateContent`), and many clients get 404 when they concatenate paths
- You enabled proxy authentication, but Google clients don't send `x-api-key`, so you keep getting 401

## When to Use This Approach

- You prefer "Gemini native protocol" over the OpenAI/Anthropic compatibility layer
- You already have Google/third-party Gemini-style clients and want to migrate to the local gateway with minimal changes

## 🎒 Prerequisites

::: warning Prerequisites
- You've added at least 1 account in the App (otherwise the backend can't get upstream access tokens)
- You've started the local reverse proxy service and know the listening port (default `8045` will be used)
:::

## Core Approach

Antigravity Tools exposes Gemini native paths on the local Axum server:

- List: `GET /v1beta/models`
- Call: `POST /v1beta/models/<model>:generateContent`
- Stream: `POST /v1beta/models/<model>:streamGenerateContent`

The backend wraps your Gemini native request body in a v1internal structure (injecting `project`, `requestId`, `requestType`, etc.), then forwards it to Google's v1internal upstream endpoint (with account access token). (Source: `src-tauri/src/proxy/mappers/gemini/wrapper.rs`, `src-tauri/src/proxy/upstream/client.rs`)

::: info Why does the tutorial recommend using 127.0.0.1 for base URL?
The App's quick integration examples hardcode the recommendation for `127.0.0.1` to "avoid IPv6 resolution latency in some environments." (Source: `src/pages/ApiProxy.tsx`)
:::

## Follow Along

### Step 1: Confirm Gateway is Online (/healthz)

**Why**
Confirm the service is online first, then troubleshoot protocol/authentication issues—this saves time.

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**You should see**: Returns JSON, including `{"status":"ok"}` (Source: `src-tauri/src/proxy/server.rs`).

### Step 2: List Gemini Models (/v1beta/models)

**Why**
You need to confirm what the "exposed model ID" is first—all subsequent `<model>` references use this.

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**You should see**: The response has a `models` array, and each element's `name` looks like `models/<id>` (Source: `src-tauri/src/proxy/handlers/gemini.rs`).

::: tip Important
Which field for model ID?
- ✅ Use the `displayName` field (e.g., `gemini-2.0-flash`)
- ✅ Or remove the `models/` prefix from the `name` field
- ❌ Don't copy the full `name` field value (causes path errors)

If you copy the `name` field (like `models/gemini-2.0-flash`) as the model ID, the request path becomes `/v1beta/models/models/gemini-2.0-flash:generateContent`, which is wrong. (Source: `src-tauri/src/proxy/common/model_mapping.rs`)
:::

::: warning Important
The current `/v1beta/models` endpoint returns a "local dynamic model list disguised as a Gemini models list," not a real-time fetch from upstream. (Source: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Step 3: Call generateContent (Path with Colon)

**Why**
The key to Gemini's native REST API is the colon-based action like `:generateContent`. The backend parses `model:method` in the same route. (Source: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Hello"}]}
    ]
  }'
```

**You should see**: The response JSON has `candidates` (or `response.candidates` in the outer layer, the proxy will unwrap it).

### Step 4: Call streamGenerateContent (SSE)

**Why**
Streaming is more stable for "long outputs/large models." The proxy forwards upstream SSE back to your client and sets `Content-Type: text/event-stream`. (Source: `src-tauri/src/proxy/handlers/gemini.rs`)

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Tell me a short story"}]}
    ]
  }'
```

**You should see**: Terminal continuously outputs `data: {...}` SSE lines, and normally `data: [DONE]` appears at the end (indicating stream end).

::: tip Note
`data: [DONE]` is the standard SSE end marker, but it's **not guaranteed**:
- If upstream ends normally and sends `[DONE]`, the proxy forwards it
- If upstream disconnects abnormally, times out, or sends other end signals, the proxy won't supplement `[DONE]`

Client code should handle per SSE standard: treat both `data: [DONE]` and connection disconnection as stream end. (Source: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### Step 5: Connect Python Google SDK Directly to Local Gateway

**Why**
This is the "quick integration" example path given in the project UI: use the Google Generative AI Python package to point `api_endpoint` to your local reverse proxy address. (Source: `src/pages/ApiProxy.tsx`)

```python
# Install: pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("Hello")
print(response.text)
```

**You should see**: The program outputs a model response text.

## Checkpoint ✅

- `/healthz` returns `{"status":"ok"}`
- `/v1beta/models` can list models (at least 1)
- `:generateContent` can return `candidates`
- `:streamGenerateContent` returns `Content-Type: text/event-stream` and can stream continuously

## Common Pitfalls

- **401 keeps failing**: If you enabled authentication but `proxy.api_key` is empty, the backend will directly reject requests. (Source: `src-tauri/src/proxy/middleware/auth.rs`)
- **What header key to use**: The proxy recognizes `Authorization`, `x-api-key`, and `x-goog-api-key` simultaneously. So "Google-style clients only sending `x-goog-api-key`" works too. (Source: `src-tauri/src/proxy/middleware/auth.rs`)
- **countTokens result is always 0**: Current `POST /v1beta/models/<model>/countTokens` returns fixed `{"totalTokens":0}`, a placeholder implementation. (Source: `src-tauri/src/proxy/handlers/gemini.rs`)

## Lesson Summary

- You're connecting to `/v1beta/models/*`, not `/v1/*`
- The key path format is `models/<modelId>:generateContent` / `:streamGenerateContent`
- When authentication is enabled, `x-goog-api-key` is a request header explicitly supported by the proxy

## Next Lesson Preview

> In the next lesson, we'll learn **[Imagen 3 Image Generation: Automatic Mapping of OpenAI Images Parameters size/quality](../imagen/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Function | File Path | Line Numbers |
| --- | --- | --- |
| Gemini route registration (/v1beta/models/*) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| Model ID parsing and routing (why `models/` prefix causes routing errors) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| Parse `model:method` + generate/stream main logic | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| SSE streaming logic (forward `[DONE]` rather than auto-supplement) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| `/v1beta/models` response structure (dynamic model list disguise) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| `countTokens` placeholder implementation (fixed 0) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
| Authentication header compatibility (including `x-goog-api-key`) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |
| Google SDK Python example (`api_endpoint` points to local gateway) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Gemini session fingerprint (sticky/cache with session_id) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Gemini request v1internal wrapper (inject project/requestId/requestType etc.) | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| Upstream v1internal endpoint and fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**Key Constants**:
- `MAX_RETRY_ATTEMPTS = 3`: Maximum rotation attempts for Gemini requests (Source: `src-tauri/src/proxy/handlers/gemini.rs`)

</details>
