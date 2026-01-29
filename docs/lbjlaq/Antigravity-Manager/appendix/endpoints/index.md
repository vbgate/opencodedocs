---
title: "Endpoints: HTTP Routes | Antigravity-Manager"
sidebarTitle: "Endpoints"
subtitle: "Endpoint Cheat Sheet: External HTTP Routes Overview"
description: "View all HTTP endpoints exposed by Antigravity Tools gateway including OpenAI, Anthropic, Gemini, and MCP routes. Learn authentication modes and API key header formats."
tags:
  - "Endpoint Cheat Sheet"
  - "API Reference"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 999
---

# Endpoint Cheat Sheet: External HTTP Routes Overview

## What You'll Learn

- Quickly locate the endpoint paths you need to call
- Understand the distribution of endpoints across different protocols
- Learn special rules for authentication modes and health checks

## Endpoint Overview

The local reverse proxy service of Antigravity Tools provides the following categories of endpoints:

| Protocol Category | Purpose | Typical Clients |
| --- | --- | --- |
| **OpenAI Protocol** | General AI application compatibility | OpenAI SDK / Compatible clients |
| **Anthropic Protocol** | Claude series calls | Claude Code / Anthropic SDK |
| **Gemini Protocol** | Google official SDK | Google Gemini SDK |
| **MCP Endpoints** | Tool call enhancements | MCP clients |
| **Internal/Utility** | Health checks, interception/internal capabilities | Automation scripts / Monitoring probes |

---

## OpenAI Protocol Endpoints

These endpoints are compatible with OpenAI API format, suitable for most clients that support OpenAI SDK.

| Method | Path | Route Entry (Rust handler) | Remarks |
| --- | --- | --- | --- |
| GET | `/v1/models` | `handlers::openai::handle_list_models` | OpenAI compatible: Model list |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | OpenAI compatible: Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | OpenAI compatible: Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | OpenAI compatible: Codex CLI requests (same handler as `/v1/completions`) |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | OpenAI compatible: Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | OpenAI compatible: Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | OpenAI compatible: Audio Transcriptions |

::: tip Compatibility Note
The `/v1/responses` endpoint is designed specifically for Codex CLI and actually uses the same processing logic as `/v1/completions`.
:::

---

## Anthropic Protocol Endpoints

These endpoints follow Anthropic API's path and request format for use by Claude Code / Anthropic SDK.

| Method | Path | Route Entry (Rust handler) | Remarks |
| --- | --- | --- | --- |
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Anthropic compatible: Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Anthropic compatible: count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Anthropic compatible: Model list |

---

## Gemini Protocol Endpoints

These endpoints are compatible with Google Gemini API format and can be used directly with Google's official SDK.

| Method | Path | Route Entry (Rust handler) | Remarks |
| --- | --- | --- | --- |
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini native: Model list |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini native: GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini native: generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini native: countTokens |

::: warning Path Note
`/v1beta/models/:model` registers both GET and POST methods under the same path (see route definition).
:::

---

## MCP Endpoints

MCP (Model Context Protocol) endpoints expose "tool call" interfaces externally (handled by `handlers::mcp::*`). Whether they are enabled and their specific behavior depends on configuration; see [MCP Endpoints](../../platforms/mcp/) for details.

| Method | Path | Route Entry (Rust handler) | Remarks |
| --- | --- | --- | --- |
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP: Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP: Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP: z.ai MCP Server |

::: details MCP Related Notes
For availability and boundary explanations of MCP, see [z.ai Integration Capability Boundaries (Implemented vs Explicitly Not Implemented)](../zai-boundaries/).
:::

---

## Internal and Utility Endpoints

These endpoints are used for internal system functions and external monitoring.

| Method | Path | Route Entry (Rust handler) | Remarks |
| --- | --- | --- | --- |
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | Internal warmup endpoint |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | Telemetry log interception: Returns 200 directly |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | Telemetry log interception: Returns 200 directly |
| GET | `/healthz` | `health_check_handler` | Health check: Returns `{"status":"ok"}` |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | Model auto-detection |

::: tip Silent Processing
Event log endpoints return `200 OK` directly without actual processing, used to intercept client telemetry reporting.
:::

::: warning Do These Endpoints Require an API Key?
Except that `GET /healthz` may be exempt, whether other routes require a key is determined by the "valid mode" of `proxy.auth_mode` (see "Authentication Mode" below and `auth_middleware` in source code).
:::

---

## Authentication Mode

Access permissions for all endpoints are controlled by `proxy.auth_mode`:

| Mode | Description | `/healthz` Requires Auth? | Other Endpoints Require Auth? |
| --- | --- | --- | --- |
| `off` | Fully open | ❌ No | ❌ No |
| `strict` | All require authentication | ✅ Yes | ✅ Yes |
| `all_except_health` | Only health check is open | ❌ No | ✅ Yes |
| `auto` | Automatic (default) | ❌ No | Depends on `allow_lan_access` |

::: info auto Mode Logic
`auto` is not an independent policy, but derived from configuration: when `proxy.allow_lan_access=true` it's equivalent to `all_except_health`, otherwise equivalent to `off` (see `docs/proxy/auth.md`).
:::

**Authentication Request Format**:

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (OpenAI style)
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (Gemini style)
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key (OpenAI style)
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key (Gemini style)
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## Summary

Antigravity Tools provides a complete set of multi-protocol compatible endpoints, supporting three mainstream API formats: OpenAI, Anthropic, and Gemini, plus MCP tool call extensions.

- **Quick Integration**: Prioritize OpenAI protocol endpoints for strongest compatibility
- **Native Features**: Use Anthropic protocol endpoints when you need full Claude Code functionality
- **Google Ecosystem**: Choose Gemini protocol endpoints when using Google's official SDK
- **Security Configuration**: Select appropriate authentication mode based on usage scenario (local/LAN/public)

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Data and Models](../storage-models/)**.
>
> You'll learn:
> - Storage structure of account files
> - SQLite statistics database table structure
> - Key field definitions and backup strategies

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Route registration (all endpoints) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Authentication middleware (Header compatibility + `/healthz` exemption + OPTIONS passthrough) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| auth_mode modes and auto derivation rules | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| `/healthz` return value | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| Telemetry log interception (silent 200) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**Key Functions**:
- `AxumServer::start()`: Starts Axum server and registers routes (lines 79-254)
- `health_check_handler()`: Health check handler (lines 266-272)
- `silent_ok_handler()`: Silent success handler (lines 274-277)

</details>
