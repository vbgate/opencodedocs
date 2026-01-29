---
title: "MCP 端点: 暴露工具 | Antigravity-Manager"
sidebarTitle: "让 Claude 用上 z.ai 能力"
subtitle: "MCP 端点：把 Web Search/Reader/Vision 作为可调用工具暴露出去"
description: "学习 Antigravity Manager 的 MCP 端点配置。启用 Web Search/Reader/Vision，验证工具调用，对接外部客户端，掌握常见错误排查方法。"
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
order: 6
---
# MCP 端点：把 Web Search/Reader/Vision 作为可调用工具暴露出去

你会用这套 **MCP 端点**把 z.ai 的搜索、阅读、视觉能力暴露给外部 MCP 客户端，重点搞清楚"远程反向代理"和"内置服务器"的区别，以及如何启用并调用这些端点。

## 学完你能做什么

- 理解三种 MCP 端点的工作原理（远程反向代理 vs 内置服务器）
- 在 Antigravity Tools 中启用 Web Search/Web Reader/Vision MCP 端点
- 让外部 MCP 客户端（如 Claude Desktop、Cursor）通过本地网关调用这些能力
- 掌握会话管理（Vision MCP）和鉴权模型

## 你现在的困境

很多 AI 工具开始支持 MCP（Model Context Protocol），但需要配置上游 API Key 和 URL。z.ai 的 MCP 服务器也提供了强大的能力（搜索、阅读、视觉分析），但直接配置意味着要在每个客户端暴露 z.ai Key。

Antigravity Tools 的方案是：在本地网关层面统一管理 z.ai Key，把 MCP 端点暴露出来，客户端只需连本地网关，无需知道 z.ai Key。

## 什么时候用这一招

- 你有多个 MCP 客户端（Claude Desktop、Cursor、自研工具），想统一用一套 z.ai Key
- 你希望把 z.ai 的 Web Search/Web Reader/Vision 能力作为工具暴露给 AI 使用
- 你不想在多个地方重复配置和轮换 z.ai Key

## 🎒 开始前的准备

::: warning 前置条件
- 你已经在 Antigravity Tools 的 "API Proxy" 页面启动了反代服务
- 你已经获取了 z.ai API Key（从 z.ai 控制台）
- 你知道反代的端口（默认 `8045`）
:::

::: info 什么是 MCP？
MCP（Model Context Protocol）是一个开放协议，让 AI 客户端可以调用外部工具/数据源。

典型的 MCP 交互流程：
1. 客户端（如 Claude Desktop）向 MCP Server 发送 `tools/list` 请求，获取可用工具列表
2. 客户端根据上下文选择工具，发送 `tools/call` 请求
3. MCP Server 执行工具并返回结果（文本、图像、数据等）

Antigravity Tools 提供了三种 MCP 端点：
- **远程反向代理**：直接转发到 z.ai MCP 服务器（Web Search/Web Reader）
- **内置服务器**：本地实现 JSON-RPC 2.0 协议，处理工具调用（Vision）
:::

## 什么是 MCP 端点？

**MCP 端点**是 Antigravity Tools 暴露的一组 HTTP 路由，让外部 MCP 客户端可以调用 z.ai 的能力，同时由 Antigravity Tools 统一管理鉴权和配置。

### 端点分类

| 端点类型 | 实现方式 | 本地路径 | 上游目标 |
|--- | --- | --- | ---|
| **Web Search** | 远程反向代理 | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | 远程反向代理 | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | 内置服务器（JSON-RPC 2.0） | `/mcp/zai-mcp-server/mcp` | 内部调用 z.ai PaaS API |

### 关键区别

::: info 远程反向代理 vs 内置服务器
**远程反向代理**（Web Search/Web Reader）：
- 代理会保留部分请求头（`content-type`、`accept`、`user-agent`）并注入 `Authorization` 头
- 代理会转发上游的响应体和状态码，但只保留 `CONTENT_TYPE` 响应头
- 无状态，无需会话管理

**内置服务器**（Vision MCP）：
- 完整实现 JSON-RPC 2.0 协议（`initialize`、`tools/list`、`tools/call`）
- 有状态：创建会话（`mcp-session-id`），GET 端点返回 SSE keepalive
- 工具逻辑在本地实现，调用 z.ai PaaS API 执行视觉分析
:::

## 核心思路

Antigravity Tools 的 MCP 端点遵循以下设计原则：

1. **统一鉴权**：由 Antigravity 管理 z.ai Key，客户端无需配置
2. **可开关**：三个端点可以独立启用/禁用
3. **会话隔离**：Vision MCP 使用 `mcp-session-id` 隔离不同客户端
4. **错误透明**：上游的响应体和状态码会原样转发（响应头会过滤）

### 鉴权模型

```
MCP 客户端 → Antigravity 本地代理 → z.ai 上游
               ↓
           [可选] proxy.auth_mode
               ↓
           [自动] 注入 z.ai Key
```

Antigravity Tools 的代理中间件（`src-tauri/src/proxy/middleware/auth.rs`）会检查 `proxy.auth_mode`，如果开启鉴权，需要客户端带 API Key。

**重要**：无论 `proxy.auth_mode` 如何，z.ai Key 都是代理自动注入的，客户端不需要配置。

## 跟我做

### 第 1 步：配置 z.ai 并启用 MCP 功能

**为什么**
先确保 z.ai 基础配置正确，再逐个启用 MCP 端点。

1. 打开 Antigravity Tools，进入 **API Proxy** 页面
2. 找到 **z.ai 配置** 卡片，点击展开
3. 配置以下字段：

```yaml
 # z.ai 配置
base_url: "https://api.z.ai/api/anthropic"  # z.ai Anthropic 兼容端点
api_key: "你的-z.ai-api-key"               # 从 z.ai 控制台获取
enabled: true                              # 启用 z.ai
```

4. 找到 **MCP 配置** 子卡片，配置：

```yaml
 # MCP 配置
enabled: true                              # 启用 MCP 总开关
web_search_enabled: true                    # 启用 Web Search
web_reader_enabled: true                    # 启用 Web Reader
vision_enabled: true                        # 启用 Vision MCP
```

**你应该看到**：配置保存后，页面下方会出现"本地 MCP 端点"列表，显示三个端点的完整 URL。

### 第 2 步：验证 Web Search 端点

**为什么**
Web Search 是远程反向代理，最简单，适合先验证基础配置。

```bash
 # 1) 先列出 Web Search 端点提供的工具（工具名以实际返回为准）
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**你应该看到**：返回一个包含 `tools` 列表的 JSON 响应。

::: tip 继续验证 tools/call（可选）
拿到 `tools[].name` 和 `tools[].inputSchema` 后，你就能按 schema 拼 `tools/call` 请求（参数以 schema 为准，别猜字段）。
:::

::: tip 端点未找到？
如果收到 `404 Not Found`，检查：
1. `proxy.zai.mcp.enabled` 是否为 `true`
2. `proxy.zai.mcp.web_search_enabled` 是否为 `true`
3. 反代服务是否正在运行
:::

### 第 3 步：验证 Web Reader 端点

**为什么**
Web Reader 也是远程反向代理，但参数和返回格式不同，验证代理能正确处理不同端点。

```bash
 # 2) 列出 Web Reader 端点提供的工具
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**你应该看到**：返回一个包含 `tools` 列表的 JSON 响应。

### 第 4 步：验证 Vision MCP 端点（会话管理）

**为什么**
Vision MCP 是内置服务器，有会话状态，需要先 `initialize`，再调用工具。

#### 4.1 初始化会话

```bash
 # 1) 发送 initialize 请求
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

**你应该看到**：响应中包含 `mcp-session-id` 头部，保存这个 ID。

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

::: info 提醒
`serverInfo.version` 来自 Rust 的 `env!("CARGO_PKG_VERSION")`，以你本机实际安装版本为准。
:::

响应头：
```
mcp-session-id: uuid-v4-string
```

#### 4.2 获取工具列表

```bash
 # 2) 发送 tools/list 请求（带上会话 ID）
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: 你的会话ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**你应该看到**：返回 8 个工具的定义（`ui_to_artifact`、`extract_text_from_screenshot`、`diagnose_error_screenshot` 等）。

#### 4.3 调用工具

```bash
 # 3) 调用 analyze_image 工具
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: 你的会话ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "描述这张图片的内容"
      }
    },
    "id": 3
  }'
```

**你应该看到**：返回图片分析结果的文本描述。

::: danger 会话 ID 重要
Vision MCP 的所有请求（除了 `initialize`）都必须带 `mcp-session-id` 头部。

会话 ID 在 `initialize` 响应中返回，后续请求必须使用同一个 ID。会话丢失后需要重新 `initialize`。
:::

### 第 5 步：测试 SSE keepalive（可选）

**为什么**
Vision MCP 的 GET 端点返回 SSE（Server-Sent Events）流，用于保持连接活跃。

```bash
 # 4) 调用 GET 端点（获取 SSE 流）
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: 你的会话ID"
```

**你应该看到**：每 15 秒收到一个 `event: ping` 消息，格式如下：

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## 检查点 ✅

### 配置检查

- [ ] `proxy.zai.enabled` 为 `true`
- [ ] `proxy.zai.api_key` 已配置（非空）
- [ ] `proxy.zai.mcp.enabled` 为 `true`
- [ ] 至少启用了一个 MCP 端点（`web_search_enabled` / `web_reader_enabled` / `vision_enabled`）
- [ ] 反代服务正在运行

### 功能验证

- [ ] Web Search 端点返回搜索结果
- [ ] Web Reader 端点返回网页内容
- [ ] Vision MCP 端点成功 `initialize` 并获取 `mcp-session-id`
- [ ] Vision MCP 端点返回工具列表（8 个工具）
- [ ] Vision MCP 端点成功调用工具并返回结果

## Vision MCP 工具速查

| 工具名 | 功能 | 必需参数 | 示例场景 |
|--- | --- | --- | ---|
| `ui_to_artifact` | 把 UI 截图转为代码/提示词/规格/描述 | `image_source`、`output_type`、`prompt` | 从设计稿生成前端代码 |
| `extract_text_from_screenshot` | 从截图提取文本/代码（类似 OCR） | `image_source`、`prompt` | 读取错误日志截图 |
| `diagnose_error_screenshot` | 诊断错误截图（堆栈跟踪、日志） | `image_source`、`prompt` | 分析运行时错误 |
| `understand_technical_diagram` | 分析架构/流程/UML/ER 图 | `image_source`、`prompt` | 理解系统架构图 |
| `analyze_data_visualization` | 分析图表/仪表板 | `image_source`、`prompt` | 从仪表板提取趋势 |
| `ui_diff_check` | 比较两个 UI 截图并报告差异 | `expected_image_source`、`actual_image_source`、`prompt` | 视觉回归测试 |
| `analyze_image` | 通用图像分析 | `image_source`、`prompt` | 描述图片内容 |
| `analyze_video` | 视频内容分析 | `video_source`、`prompt` | 分析视频场景 |

::: info 参数说明
- `image_source`：本地文件路径（如 `/tmp/screenshot.png`）或远程 URL（如 `https://example.com/image.jpg`）
- `video_source`：本地文件路径或远程 URL（支持 MP4、MOV、M4V）
- `output_type`（`ui_to_artifact`）：`code` / `prompt` / `spec` / `description`
:::

## 踩坑提醒

### 404 Not Found

**现象**：调用 MCP 端点返回 `404 Not Found`。

**原因**：
1. 端点未启用（对应的 `*_enabled` 为 `false`）
2. 反代服务未启动
3. URL 路径错误（注意 `/mcp/` 前缀）

**解决**：
1. 检查 `proxy.zai.mcp.enabled` 和对应的 `*_enabled` 配置
2. 检查反代服务状态
3. 确认 URL 路径格式（如 `/mcp/web_search_prime/mcp`）

### 400 Bad Request: Missing Mcp-Session-Id

**现象**：调用 Vision MCP（除 `initialize` 外）返回 `400 Bad Request`。

- GET 端点：返回纯文本 `Missing Mcp-Session-Id`
- POST 端点：返回 JSON-RPC 错误 `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}`

**原因**：请求头缺少 `mcp-session-id` 或 ID 无效。

**解决**：
1. 确保 `initialize` 请求成功，并从响应头获取 `mcp-session-id`
2. 后续请求（`tools/list`、`tools/call`，以及 SSE keepalive）都必须带该头部
3. 如果会话丢失（如服务重启），需要重新 `initialize`

### z.ai is not configured

**现象**：返回 `400 Bad Request`，提示 `z.ai is not configured`。

**原因**：`proxy.zai.enabled` 为 `false` 或 `api_key` 为空。

**解决**：
1. 确保 `proxy.zai.enabled` 为 `true`
2. 确保 `proxy.zai.api_key` 已配置（非空）

### 上游请求失败

**现象**：返回 `502 Bad Gateway` 或内部错误。

**原因**：
1. z.ai API Key 无效或过期
2. 网络连接问题（需要上游代理）
3. z.ai 服务端错误

**解决**：
1. 验证 z.ai API Key 是否正确
2. 检查 `proxy.upstream_proxy` 配置（如果需要代理访问 z.ai）
3. 查看日志获取详细错误信息

## 与外部 MCP 客户端集成

### Claude Desktop 配置示例

Claude Desktop 的 MCP 客户端配置文件（`~/.config/claude/claude_desktop_config.json`）：

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

::: tip Claude Desktop 的限制
Claude Desktop 的 MCP 客户端需要通过 `stdio` 通信，如果你直接用 HTTP 端点，需要编写一个 wrapper 脚本把 `stdio` 转为 HTTP 请求。

或者使用支持 HTTP MCP 的客户端（如 Cursor）。
:::

### HTTP MCP 客户端（如 Cursor）

如果客户端支持 HTTP MCP，直接配置端点 URL 即可：

```yaml
 # Cursor MCP 配置
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## 本课小结

Antigravity Tools 的 MCP 端点把 z.ai 的能力暴露为可调用工具，分为两类：
- **远程反向代理**（Web Search/Web Reader）：简单转发，无状态
- **内置服务器**（Vision MCP）：完整实现 JSON-RPC 2.0，有会话管理

关键点：
1. 统一鉴权：z.ai Key 由 Antigravity 管理，客户端无需配置
2. 可开关：三个端点可独立启用/禁用
3. 会话隔离：Vision MCP 使用 `mcp-session-id` 隔离客户端
4. 灵活集成：支持任何兼容 MCP 协议的客户端

## 下一课预告

> 下一课我们学习 **[Cloudflared 一键隧道](/zh/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**。
>
> 你会学到：
> - 如何一键安装和启动 Cloudflared 隧道
> - quick 模式 vs auth 模式的区别
> - 如何安全地把本地 API 暴露到公网

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Web Search 端点 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Web Reader 端点 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Vision MCP 端点（主入口） | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Vision MCP initialize 处理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Vision MCP tools/list 处理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Vision MCP tools/call 处理 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Vision MCP 会话状态管理 | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Vision MCP 工具定义 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Vision MCP 工具调用实现 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| 路由注册 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| 鉴权中间件 | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| MCP 配置 UI | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| 仓库内说明文档 | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**关键常量**：
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`：z.ai PaaS API 端点（用于 Vision 工具调用）

**关键函数**：
- `handle_web_search_prime()`：处理 Web Search 端点的远程反向代理
- `handle_web_reader()`：处理 Web Reader 端点的远程反向代理
- `handle_zai_mcp_server()`：处理 Vision MCP 端点的所有方法（GET/POST/DELETE）
- `mcp_session_id()`：从请求头提取 `mcp-session-id`
- `forward_mcp()`：通用 MCP 转发函数（注入鉴权并转发到上游）
- `tool_specs()`：返回 Vision MCP 的工具定义列表
- `call_tool()`：执行指定的 Vision MCP 工具

</details>
