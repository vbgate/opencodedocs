---
title: "MCP Endpoints: Expose Tools | Antigravity Manager"
sidebarTitle: "MCP Endpoints"
subtitle: "MCP Endpoints: Expose Tools"
description: "Learn Antigravity Manager's MCP endpoints: remote proxy for Web Search/Reader, built-in server for Vision. Enable switches, verify tools/list/call, integrate with MCP clients, and troubleshoot errors."
tags:
  - "MCP"
  - "Web Search"
  - "Web Reader"
  - "Vision"
  - "z.ai"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
duration: 25
order: 999
---

# MCP Endpoints: Expose Web Search/Reader/Vision as Callable Tools

In this lesson, you'll use these **MCP endpoints** to expose z.ai's search, reading, and vision capabilities to external MCP clients. You'll understand the difference between "remote reverse proxy" and "built-in server," and learn how to enable and call these endpoints.

## What You'll Learn

- Understand how the three MCP endpoint types work (remote reverse proxy vs built-in server)
- Enable Web Search/Web Reader/Vision MCP endpoints in Antigravity Tools
- Let external MCP clients (like Claude Desktop, Cursor) call these capabilities through the local gateway
- Master session management (Vision MCP) and the authentication model

## Your Current Challenge

Many AI tools now support MCP (Model Context Protocol), but configuring upstream API keys and URLs is required. z.ai's MCP server also provides powerful capabilities (search, reading, vision analysis), but direct configuration means exposing the z.ai Key in every client.

Antigravity Tools' solution: centrally manage the z.ai Key at the local gateway level, expose MCP endpoints, and clients only need to connect to the local gateway without knowing the z.ai Key.

## When to Use This Approach

- You have multiple MCP clients (Claude Desktop, Cursor, custom tools) and want to use a single set of z.ai Keys
- You want to expose z.ai's Web Search/Web Reader/Vision capabilities as tools for AI to use
- You don't want to repeatedly configure and rotate z.ai Keys across multiple places

## 🎒 Prerequisites

::: warning Prerequisites
- You have already started the reverse proxy service on Antigravity Tools' "API Proxy" page
- You have obtained a z.ai API Key (from the z.ai console)
- You know the reverse proxy port (default `8045`)
:::

::: info What is MCP?
MCP (Model Context Protocol) is an open protocol that lets AI clients call external tools/data sources.

Typical MCP interaction flow:
1. Client (e.g., Claude Desktop) sends a `tools/list` request to the MCP Server to get the list of available tools
2. Client selects a tool based on context and sends a `tools/call` request
3. MCP Server executes the tool and returns results (text, images, data, etc.)

Antigravity Tools provides three MCP endpoints:
- **Remote reverse proxy**: Directly forwards to z.ai MCP server (Web Search/Web Reader)
- **Built-in server**: Implements JSON-RPC 2.0 protocol locally to handle tool calls (Vision)
:::

## What Are MCP Endpoints?

**MCP endpoints** are a set of HTTP routes exposed by Antigravity Tools that let external MCP clients call z.ai's capabilities while Antigravity Tools centrally manages authentication and configuration.

### Endpoint Types

| Endpoint Type | Implementation | Local Path | Upstream Target |
|--- | --- | --- | ---|
| **Web Search** | Remote reverse proxy | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | Remote reverse proxy | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | Built-in server (JSON-RPC 2.0) | `/mcp/zai-mcp-server/mcp` | Internal call to z.ai PaaS API |

### Key Differences

::: info Remote reverse proxy vs built-in server
**Remote reverse proxy** (Web Search/Web Reader):
- Whatever the client sends, the proxy forwards it
- Antigravity Tools only injects `Authorization: Bearer {zai_key}` and forwards responses
- Stateless, no session management needed

**Built-in server** (Vision MCP):
- Fully implements JSON-RPC 2.0 protocol (`initialize`, `tools/list`, `tools/call`)
- Stateful: creates sessions (`mcp-session-id`), GET endpoint returns SSE keepalive
- Tool logic implemented locally, calls z.ai PaaS API to execute vision analysis
:::

## Core Concept

Antigravity Tools' MCP endpoints follow these design principles:

1. **Unified authentication**: Antigravity manages the z.ai Key, clients don't need to configure it
2. **Toggleable**: All three endpoints can be independently enabled/disabled
3. **Session isolation**: Vision MCP uses `mcp-session-id` to isolate different clients
4. **Transparent errors**: Upstream errors are returned as-is for easier troubleshooting

### Authentication Model

```
MCP client → Antigravity local proxy → z.ai upstream
               ↓
           [Optional] proxy.auth_mode
               ↓
           [Auto] Inject z.ai Key
```

Antigravity Tools' proxy middleware (`src-tauri/src/proxy/middleware/auth.rs`) checks `proxy.auth_mode`. If authentication is enabled, the client must include an API Key.

**Important**: Regardless of `proxy.auth_mode`, the z.ai Key is automatically injected by the proxy, and the client doesn't need to configure it.

## Follow Along

### Step 1: Configure z.ai and Enable MCP Features

**Why**
First ensure z.ai base configuration is correct, then enable MCP endpoints one by one.

1. Open Antigravity Tools and go to the **API Proxy** page
2. Find the **z.ai Configuration** card and click to expand
3. Configure the following fields:

```yaml
 # z.ai configuration
base_url: "https://api.z.ai/api/anthropic"  # z.ai Anthropic-compatible endpoint
api_key: "your-z.ai-api-key"                # Get from z.ai console
enabled: true                               # Enable z.ai
```

4. Find the **MCP Configuration** subcard and configure:

```yaml
 # MCP configuration
enabled: true                               # Enable MCP master switch
web_search_enabled: true                    # Enable Web Search
web_reader_enabled: true                    # Enable Web Reader
vision_enabled: true                        # Enable Vision MCP
```

**You should see**: After saving configuration, a "Local MCP Endpoints" list appears at the bottom of the page, showing the full URLs of the three endpoints.

### Step 2: Verify Web Search Endpoint

**Why**
Web Search is a remote reverse proxy, the simplest one, suitable for verifying basic configuration first.

```bash
 # 1) List tools provided by Web Search endpoint (tool names based on actual response)
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**You should see**: A JSON response containing a `tools` list.

::: tip Continue verifying tools/call (optional)
After getting `tools[].name` and `tools[].inputSchema`, you can assemble `tools/call` requests according to the schema (parameters follow the schema, don't guess fields).
:::

::: tip Endpoint not found?
If you receive `404 Not Found`, check:
1. Is `proxy.zai.mcp.enabled` set to `true`
2. Is `proxy.zai.mcp.web_search_enabled` set to `true`
3. Is the reverse proxy service running
:::

### Step 3: Verify Web Reader Endpoint

**Why**
Web Reader is also a remote reverse proxy, but with different parameters and response formats, verifying that the proxy can correctly handle different endpoints.

```bash
 # 2) List tools provided by Web Reader endpoint
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**You should see**: A JSON response containing a `tools` list.

### Step 4: Verify Vision MCP Endpoint (Session Management)

**Why**
Vision MCP is a built-in server with session state, requiring `initialize` first, then calling tools.

#### 4.1 Initialize Session

```bash
 # 1) Send initialize request
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    },
    "id": 1
  }'
```

**You should see**: Response includes a `mcp-session-id` header, save this ID.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": {
      "name": "zai-mcp-server",
      "version": "<app-version>"
    }
  },
  "id": 1
}
```

::: info Note
`serverInfo.version` comes from Rust's `env!("CARGO_PKG_VERSION")`, based on your actual installed version.
:::

Response header:
```
mcp-session-id: uuid-v4-string
```

#### 4.2 Get Tool List

```bash
 # 2) Send tools/list request (with session ID)
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**You should see**: Returns definitions of 8 tools (`ui_to_artifact`, `extract_text_from_screenshot`, `diagnose_error_screenshot`, etc.).

#### 4.3 Call Tool

```bash
 # 3) Call analyze_image tool
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: YOUR_SESSION_ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "Describe the content of this image"
      }
    },
    "id": 3
  }'
```

**You should see**: Returns text description of the image analysis result.

::: danger Session ID is important
All Vision MCP requests (except `initialize`) must include the `mcp-session-id` header.

The session ID is returned in the `initialize` response, and subsequent requests must use the same ID. After the session is lost, you need to re-`initialize`.
:::

### Step 5: Test SSE Keepalive (Optional)

**Why**
Vision MCP's GET endpoint returns SSE (Server-Sent Events) stream, used to keep the connection alive.

```bash
 # 4) Call GET endpoint (get SSE stream)
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: YOUR_SESSION_ID"
```

**You should see**: Receive an `event: ping` message every 15 seconds, in this format:

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## Checkpoint ✅

### Configuration Check

- [ ] `proxy.zai.enabled` is `true`
- [ ] `proxy.zai.api_key` is configured (non-empty)
- [ ] `proxy.zai.mcp.enabled` is `true`
- [ ] At least one MCP endpoint is enabled (`web_search_enabled` / `web_reader_enabled` / `vision_enabled`)
- [ ] Reverse proxy service is running

### Functionality Verification

- [ ] Web Search endpoint returns search results
- [ ] Web Reader endpoint returns web page content
- [ ] Vision MCP endpoint successfully `initialize`s and gets `mcp-session-id`
- [ ] Vision MCP endpoint returns tool list (8 tools)
- [ ] Vision MCP endpoint successfully calls tools and returns results

## Vision MCP Tools Quick Reference

| Tool Name | Function | Required Parameters | Example Scenario |
|--- | --- | --- | ---|
| `ui_to_artifact` | Convert UI screenshot to code/prompt/spec/description | `image_source`, `output_type`, `prompt` | Generate frontend code from design mockup |
| `extract_text_from_screenshot` | Extract text/code from screenshot (like OCR) | `image_source`, `prompt` | Read error log screenshot |
| `diagnose_error_screenshot` | Diagnose error screenshot (stack trace, logs) | `image_source`, `prompt` | Analyze runtime errors |
| `understand_technical_diagram` | Analyze architecture/flow/UML/ER diagrams | `image_source`, `prompt` | Understand system architecture diagram |
| `analyze_data_visualization` | Analyze charts/dashboards | `image_source`, `prompt` | Extract trends from dashboard |
| `ui_diff_check` | Compare two UI screenshots and report differences | `expected_image_source`, `actual_image_source`, `prompt` | Visual regression testing |
| `analyze_image` | Generic image analysis | `image_source`, `prompt` | Describe image content |
| `analyze_video` | Video content analysis | `video_source`, `prompt` | Analyze video scenes |

::: info Parameter description
- `image_source`: Local file path (e.g., `/tmp/screenshot.png`) or remote URL (e.g., `https://example.com/image.jpg`)
- `video_source`: Local file path or remote URL (supports MP4, MOV, M4V)
- `output_type` (`ui_to_artifact`): `code` / `prompt` / `spec` / `description`
:::

## Common Pitfalls

### 404 Not Found

**Symptom**: Calling MCP endpoint returns `404 Not Found`.

**Cause**:
1. Endpoint not enabled (corresponding `*_enabled` is `false`)
2. Reverse proxy service not started
3. URL path incorrect (note the `/mcp/` prefix)

**Solution**:
1. Check `proxy.zai.mcp.enabled` and corresponding `*_enabled` configuration
2. Check reverse proxy service status
3. Confirm URL path format (e.g., `/mcp/web_search_prime/mcp`)

### 400 Bad Request: Missing Mcp-Session-Id

**Symptom**: Calling Vision MCP (except `initialize`) returns `400 Bad Request`.

**Cause**: Request header missing `mcp-session-id` or ID is invalid.

**Solution**:
1. Ensure `initialize` request succeeds and get `mcp-session-id` from response header
2. Subsequent requests (`tools/list`, `tools/call`) must include this header
3. If session is lost (e.g., service restart), you need to re-`initialize`

### z.ai is not configured

**Symptom**: Returns `400 Bad Request` or `500 Internal Server Error`, prompting `z.ai is not configured`.

**Cause**: `proxy.zai.enabled` is `false` or `api_key` is empty.

**Solution**:
1. Ensure `proxy.zai.enabled` is `true`
2. Ensure `proxy.zai.api_key` is configured (non-empty)

### Upstream Request Failed

**Symptom**: Returns `502 Bad Gateway` or internal error.

**Cause**:
1. z.ai API Key is invalid or expired
2. Network connection issues (need upstream proxy)
3. z.ai server-side error

**Solution**:
1. Verify z.ai API Key is correct
2. Check `proxy.upstream_proxy` configuration (if you need a proxy to access z.ai)
3. Check logs for detailed error information

## Integrating with External MCP Clients

### Claude Desktop Configuration Example

Claude Desktop's MCP client configuration file (`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Claude Desktop limitations
Claude Desktop's MCP client requires `stdio` communication. If you directly use HTTP endpoints, you need to write a wrapper script to convert `stdio` to HTTP requests.

Alternatively, use clients that support HTTP MCP (like Cursor).
:::

### HTTP MCP Client (e.g., Cursor)

If the client supports HTTP MCP, simply configure the endpoint URL:

```yaml
 # Cursor MCP configuration
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## Lesson Summary

Antigravity Tools' MCP endpoints expose z.ai's capabilities as callable tools, divided into two categories:
- **Remote reverse proxy** (Web Search/Web Reader): Simple forwarding, stateless
- **Built-in server** (Vision MCP): Fully implements JSON-RPC 2.0, with session management

Key points:
1. Unified authentication: z.ai Key is managed by Antigravity, clients don't need to configure it
2. Toggleable: All three endpoints can be independently enabled/disabled
3. Session isolation: Vision MCP uses `mcp-session-id` to isolate clients
4. Flexible integration: Supports any MCP protocol-compatible client

## Coming Up Next

> In the next lesson, we'll learn **[Cloudflared One-Click Tunnel](/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**.
>
> You'll learn:
> - How to install and start Cloudflared tunnel with one click
> - The difference between quick mode and auth mode
> - How to safely expose your local API to the public internet

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Web Search endpoint | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Web Reader endpoint | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Vision MCP endpoint (main entry) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Vision MCP initialize handler | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Vision MCP tools/list handler | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Vision MCP tools/call handler | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Vision MCP session state management | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Vision MCP tool definitions | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Vision MCP tool call implementation | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| Route registration | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| Authentication middleware | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| MCP configuration UI | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| Repository internal documentation | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**Key constants**:
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`: z.ai PaaS API endpoint (used for Vision tool calls)

**Key functions**:
- `handle_web_search_prime()`: Handles remote reverse proxy for Web Search endpoint
- `handle_web_reader()`: Handles remote reverse proxy for Web Reader endpoint
- `handle_zai_mcp_server()`: Handles all methods for Vision MCP endpoint (GET/POST/DELETE)
- `mcp_session_id()`: Extracts `mcp-session-id` from request header
- `forward_mcp()`: Generic MCP forwarding function (injects authentication and forwards to upstream)
- `tool_specs()`: Returns list of Vision MCP tool definitions
- `call_tool()`: Executes specified Vision MCP tool

</details>
