---
title: "z.ai: 集成边界 | Antigravity Manager"
sidebarTitle: "z.ai 边界"
subtitle: "z.ai 集成边界（已实现 vs 明确未实现）"
description: "了解 Antigravity Manager 中 z.ai 的集成边界。掌握哪些请求通过 z.ai（仅 Claude 协议）、dispatch_mode 路由规则、模型映射方法、头部安全策略，以及 MCP 反向代理和 Vision MCP 的限制。"
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "Integration Boundaries"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 999
---
# z.ai Integration Boundaries (Implemented vs Explicitly Unimplemented)

This document focuses on the **boundaries** of z.ai integration in Antigravity Tools, not "how to integrate it." If you find a feature isn't working, check here first: is it unconfigured, or simply not implemented?

## What You'll Learn

- Determine whether you should expect z.ai for a task: what's "implemented" vs "explicitly not done"
- Understand which endpoints z.ai affects (and which are completely unaffected)
- See source code/documentation evidence for each conclusion (with GitHub line number links) for your own verification

## Your Current Struggles

You may have already enabled z.ai in Antigravity Tools, but you're encountering these uncertainties:

- Why do some requests go through z.ai while others don't at all?
- Can the MCP endpoints serve as a "complete MCP Server"?
- Do the visible switches in the UI actually correspond to real implementations?

## What Is z.ai Integration (In This Project)?

**z.ai integration** in Antigravity Tools is an optional "upstream provider + MCP extension." It only takes over Claude protocol requests under specific conditions, and provides MCP Search/Reader reverse proxy plus a minimal Vision MCP built-in server; it's not a full-protocol, full-capability replacement solution.

::: info One-Sentence Memory
Think of z.ai as "an optional upstream for Claude requests + a set of toggleable MCP endpoints," not "bringing all of z.ai's capabilities over completely."
:::

## Implemented: Stable and Available (Source Code as Truth)

### 1) Only Claude Protocol Goes Through z.ai (/v1/messages + /v1/messages/count_tokens)

z.ai's Anthropic upstream forwarding only happens in the z.ai branch of the Claude handler:

- `POST /v1/messages`: When `use_zai=true`, calls `forward_anthropic_json(...)` to forward the JSON request to z.ai's Anthropic-compatible endpoint
- `POST /v1/messages/count_tokens`: Also forwards when z.ai is enabled; otherwise returns a placeholder `{input_tokens:0, output_tokens:0}`

Evidence:

- z.ai branch selection and forwarding entry point: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- z.ai branch and placeholder return for count_tokens: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- z.ai Anthropic forwarding implementation: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip How to Understand "Streaming Response"
`forward_anthropic_json` streams the upstream response body back to the client using `bytes_stream()`, without parsing SSE (see Response body construction in `providers/zai_anthropic.rs`).
:::

### 2) The "Real Meaning" of Dispatch Mode (dispatch_mode)

`dispatch_mode` determines whether `/v1/messages` goes through z.ai:

| dispatch_mode | What Happens | Evidence |
| --- | --- | --- |
| `off` | Never use z.ai | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | All Claude requests go through z.ai | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Only go through z.ai when Google pool is unavailable (0 accounts or "no available accounts") | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | Treat z.ai as an "additional slot" participating in round-robin (no guaranteed hit) | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning Common Misconception About pooled
`pooled` doesn't mean "use both z.ai and Google account pools together, and split traffic by weight." The code explicitly states "no strict guarantees" – it's essentially a round-robin slot (z.ai only used when `slot == 0`).
:::

### 3) Model Mapping: How Claude Model Names Become z.ai's glm-*?

Before forwarding to z.ai, if the request body contains a `model` field, it gets rewritten:

1. Exact match in `proxy.zai.model_mapping` (supports both original string and lower-case key)
2. `zai:<model>` prefix: Remove `zai:` and use directly
3. `glm-*`: Keep unchanged
4. Non-`claude-*`: Keep unchanged
5. `claude-*` and contains `opus/haiku`: Map to `proxy.zai.models.opus/haiku`; otherwise default to `sonnet`

Evidence: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37), [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) Header Security Policy During Forwarding (Avoid Leaking Local Proxy Key)

z.ai upstream forwarding doesn't "pass all Headers as-is," but applies two layers of defense:

- Only allows a small subset of Headers (e.g., `content-type`, `accept`, `anthropic-version`, `user-agent`)
- Injects z.ai's API Key into upstream (prioritizes keeping the client's auth method: `x-api-key` or `Authorization: Bearer ...`)

Evidence:

- Header whitelist: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- Inject z.ai auth: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## Implemented: MCP (Search/Reader Reverse Proxy + Vision Built-in)

### 1) MCP Search/Reader: Reverse Proxy to z.ai's MCP Endpoints

Local endpoints and upstream addresses are hardcoded:

| Local Endpoint | Upstream Address | Switch | Evidence |
| --- | --- | --- | --- |
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 Is Not a "Network Problem"
As long as `proxy.zai.mcp.enabled=false`, or the corresponding `web_search_enabled/web_reader_enabled=false`, these endpoints will directly return 404.
:::

Evidence:

- MCP master switch and z.ai key validation: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- Route registration: [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP: A "Minimal Streamable HTTP MCP" Built-in Server

Vision MCP is not a reverse proxy; it's a local built-in implementation:

- Endpoint: `/mcp/zai-mcp-server/mcp`
- `POST` supports: `initialize`, `tools/list`, `tools/call`
- `GET` returns SSE keepalive (requires initialized session)
- `DELETE` ends session

Evidence:

- Handler main entry and method dispatch: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- Implementation of `initialize`, `tools/list`, `tools/call`: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Vision MCP's "minimal implementation" positioning: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Vision MCP Tool Set (8 Tools) and File Size Limits

Tool list comes from `tool_specs()`:

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

Evidence: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270), [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

Local files are read and encoded as `data:<mime>;base64,...`, with hard limits:

- Image max size: 5 MB (`image_source_to_content(..., 5)`)
- Video max size: 8 MB (`video_source_to_content(..., 8)`)

Evidence: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## Explicitly Unimplemented / Don't Expect (Based on Documentation Statements and Implementation Details)

### 1) z.ai Usage/Budget Monitoring (usage/budget) Not Implemented

`docs/zai/implementation.md` explicitly states "not implemented yet." This means:

- You cannot expect Antigravity Tools to provide z.ai usage/budget queries or alerts
- Quota Protection won't automatically read z.ai's budget/usage data

Evidence: [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP Is Not a Complete MCP Server

Vision MCP is currently positioned as a minimal implementation that's "just enough for tool calls": prompts/resources, resumability, streamed tool output, etc. are not implemented yet.

Evidence: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36), [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` Won't Reflect z.ai's Real Model List

The model list returned by this endpoint comes from local built-in mapping and custom mapping (`get_all_dynamic_models`), and won't request z.ai upstream's `/v1/models`.

Evidence:

- handler: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- List generation logic: [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## Configuration Field Quick Reference (z.ai Related)

z.ai configuration is under `ProxyConfig.zai`, including these fields:

- `enabled` / `base_url` / `api_key`
- `dispatch_mode` (`off/exclusive/pooled/fallback`)
- `model_mapping` (exact match override)
- `models.{opus,sonnet,haiku}` (Claude family default mapping)
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

Default values (base_url / default models) are also in the same file:

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

Evidence: [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116), [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## Lesson Summary

- z.ai currently only takes over Claude protocol (`/v1/messages` + `count_tokens`); other protocol endpoints don't "automatically go through z.ai"
- MCP Search/Reader are reverse proxies; Vision MCP is a local minimal implementation, not a complete MCP Server
- The model list in `/v1/models/claude` comes from local mapping and doesn't represent z.ai upstream's real models

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Version Evolution](../../changelog/release-notes/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| z.ai integration scope (Claude protocol + MCP + Vision MCP) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| z.ai dispatch mode and model defaults | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| z.ai default base_url / default models | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| `/v1/messages` routing logic (whether to go through z.ai) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| `/v1/messages/count_tokens` z.ai forwarding and placeholder return | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| z.ai Anthropic upstream forwarding (JSON forwarding + response streaming) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| z.ai model mapping rules (map_model_for_zai) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Header whitelist + inject z.ai auth | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| MCP Search/Reader reverse proxy and switches | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
| Vision MCP built-in server (GET/POST/DELETE + JSON-RPC) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L190-L397) | 190-397 |
| Vision MCP minimal implementation positioning (not full MCP Server) | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Vision tools list and limits (tool_specs + file size + stream=false) | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| `/v1/models/claude` model list source (local mapping, not upstream query) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| Usage/budget monitoring not implemented (documentation statement) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
