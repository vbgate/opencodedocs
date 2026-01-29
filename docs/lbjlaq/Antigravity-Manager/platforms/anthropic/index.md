---
title: "Anthropic API: /v1/messages 接口 | Antigravity-Manager"
sidebarTitle: "Anthropic API"
subtitle: "Anthropic API: /v1/messages 接口"
description: "学习 Antigravity-Manager 的 Anthropic 兼容 API。配置 Claude Code 的 ANTHROPIC_BASE_URL，使用 /v1/messages 进行对话和流式传输，理解预热拦截和认证规则。"
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 999
---
# Anthropic-Compatible API: The Critical Contract Between /v1/messages and Claude Code

To route Claude Code through your local gateway without modifying its Anthropic protocol usage, simply point the Base URL to Antigravity Tools and make one successful request using `/v1/messages`.

## What Is the Anthropic-Compatible API?

The **Anthropic-compatible API** refers to the Anthropic Messages protocol endpoints provided by Antigravity Tools. It accepts `/v1/messages` requests, performs message cleanup, streaming encapsulation, and retry rotation locally, then forwards requests to upstream providers for real model capabilities.

## What You'll Learn

- Use Antigravity Tools' `/v1/messages` endpoint to connect Claude Code (or any Anthropic Messages client)
- Understand how to configure Base URL and authentication headers to avoid 401/404 trial-and-error
- Get standard SSE when streaming is needed, or JSON when it's not
- Know what "protocol patching" the proxy performs in the background (warmup interception, message cleanup, signature fallback)

## Your Current Pain Points

You want to use Claude Code/Anthropic SDK, but network issues, account availability, quota limits, and rate limiting make conversations unstable. You've already set up Antigravity Tools as a local gateway, but you often get stuck on these problems:

- Base URL written as `.../v1` or path stacking by the client, resulting in immediate 404
- Proxy authentication enabled but uncertain which header the client uses to pass the key, resulting in 401
- Claude Code's background warmup/summary tasks silently consume your quota

## When to Use This Approach

- You're integrating **Claude Code CLI** and want it to connect directly to your local gateway using the Anthropic protocol
- Your client only supports the Anthropic Messages API (`/v1/messages`) and you don't want to modify code

## 🎒 Prerequisites

::: warning Prerequisites
This lesson assumes you've already set up the basic local reverse proxy loop (can access `/healthz`, know the proxy port, and whether authentication is enabled). If not, start with **[Start Local Reverse Proxy and Connect Your First Client](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**.
:::

You'll need three things prepared:

1. Proxy address (example: `http://127.0.0.1:8045`)
2. Whether proxy authentication is enabled (and the corresponding `proxy.api_key`)
3. A client that can send Anthropic Messages requests (Claude Code or curl both work)

## Core Approach

The **Anthropic-compatible API** in Antigravity Tools maps to a fixed set of routes: `POST /v1/messages`, `POST /v1/messages/count_tokens`, `GET /v1/models/claude` (see Router definition in `src-tauri/src/proxy/server.rs`).

Among these, `/v1/messages` is the "main entry point." Before forwarding to upstream, the proxy performs a series of compatibility handling:

- Removes fields from message history that the protocol doesn't accept (e.g., `cache_control`)
- Merges consecutive messages with the same role to avoid "role alternation" validation failures
- Detects Claude Code warmup requests and directly returns a mock response to reduce quota waste
- Performs retries and account rotation based on error types (up to 3 attempts) to improve long-session stability

## Follow Along

### Step 1: Confirm Base URL Only Goes to the Port

**Why**
`/v1/messages` is a fixed route on the proxy side. Writing Base URL as `.../v1` makes it easy for the client to append `/v1/messages` again, resulting in `.../v1/v1/messages`.

You can first use curl to probe liveness:

```bash
# You should see: {"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### Step 2: If You Enabled Authentication, Remember These 3 Headers

**Why**
The proxy's authentication middleware extracts the key from `Authorization`, `x-api-key`, and `x-goog-api-key`. With authentication enabled but headers misaligned, you'll consistently get 401.

::: info Which Authentication Headers Does the Proxy Accept?
`Authorization: Bearer <key>`, `x-api-key: <key>`, and `x-goog-api-key: <key>` all work (see `src-tauri/src/proxy/middleware/auth.rs`).
:::

### Step 3: Connect Claude Code CLI Directly to Local Gateway

**Why**
Claude Code uses the Anthropic Messages protocol. By pointing its Base URL to your local gateway, you can reuse the `/v1/messages` contract.

Configure environment variables following the README example:

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**You should see**: Claude Code starts normally, and you receive replies after sending messages.

### Step 4: List Available Models First (for curl/SDK Use)

**Why**
Different clients pass the `model` parameter through as-is. Getting the model list first makes troubleshooting much faster.

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**You should see**: Returns a JSON with `object: "list"`, where `data[].id` are the available model IDs.

### Step 5: Call `/v1/messages` with curl (Non-Streaming)

**Why**
This is the minimal reproducible chain: without Claude Code, you can confirm where the error occurs in "routing + authentication + request body."

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<pick one from /v1/models/claude>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "Hello, briefly introduce yourself"}
    ]
  }'
```

**You should see**:

- HTTP 200
- Response headers may contain `X-Account-Email` and `X-Mapped-Model` (for troubleshooting)
- Response body is Anthropic Messages-style JSON (`type: "message"`)

### Step 6: Enable Streaming with `stream: true`

**Why**
Claude Code uses SSE. You can also verify SSE works with curl, confirming there are no proxy/buffer issues in between.

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<pick one from /v1/models/claude>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "Explain what a local reverse proxy is in 3 sentences"}
    ]
  }'
```

**You should see**: Line-by-line SSE events (`event: message_start`, `event: content_block_delta`, etc.).

## Checkpoint ✅

- `GET /healthz` returns `{"status":"ok"}`
- `GET /v1/models/claude` retrieves `data[].id`
- `POST /v1/messages` returns 200 (either non-streaming JSON or streaming SSE)

## Common Pitfalls

### 1) Don't Write Base URL as `.../v1`

Claude Code's example is `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"` because the proxy-side routes already include `/v1/messages`.

### 2) Authentication Enabled But `proxy.api_key` Empty Results in Direct Rejection

When proxy authentication is enabled but `api_key` is empty, the middleware immediately returns 401 (see protection logic in `src-tauri/src/proxy/middleware/auth.rs`).

### 3) `/v1/messages/count_tokens` Is a Placeholder Implementation in Default Path

When z.ai forwarding is not enabled, this endpoint directly returns `input_tokens: 0, output_tokens: 0` (see `handle_count_tokens`). Don't use it to judge real tokens.

### 4) You Didn't Enable Streaming, But See the Server "Internally Using SSE"

The proxy has a compatibility strategy for `/v1/messages`: when the client doesn't require streaming, the server may **force internal streaming** then collect results as JSON to return (see `force_stream_internally` logic in `handle_messages`).

## Summary

- To get Claude Code/Anthropic clients working, it's essentially 3 things: Base URL, authentication headers, `/v1/messages` request body
- To make the "protocol work + long sessions stable," the proxy cleans historical messages, intercepts warmup, and retries/rotates accounts on failure
- `count_tokens` currently doesn't reflect real counts (unless you enabled the corresponding forwarding path)

## Next Lesson Preview

> In the next lesson, we'll learn **[Gemini Native API: /v1beta/models and Google SDK Endpoint Integration](/lbjlaq/Antigravity-Manager/platforms/gemini/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to Expand Source Code Locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
| --- | --- | --- |
| Proxy routes: `/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Anthropic main entry: `handle_messages` (includes warmup interception and retry loop) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| Model list: `GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens` (returns 0 when z.ai not enabled) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Warmup detection and mock response | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
| Authentication header compatibility: `Authorization`/`x-api-key`/`x-goog-api-key` | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| Request cleanup: remove `cache_control` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| Request cleanup: merge consecutive same-role messages | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
| Claude -> Gemini v1internal transform entry: `transform_claude_request_in()` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L332-L618) | 332-618 |

**Key Constants**:
- `MAX_RETRY_ATTEMPTS = 3`: Maximum retry count for `/v1/messages`

</details>
