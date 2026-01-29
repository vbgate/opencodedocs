---
title: "z.ai 集成: 能力边界详解 | Antigravity-Manager"
sidebarTitle: "z.ai 边界速查"
subtitle: "z.ai 集成: 能力边界详解"
description: "掌握 Antigravity Tools 的 z.ai 集成边界。了解请求路由、dispatch_mode 分流、模型映射、Header 安全策略，以及 MCP 反代与限制，避免误判。"
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "能力边界"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# z.ai 集成的能力边界（已实现 vs 明确未实现）

这篇文档只讲 Antigravity Tools 的 z.ai“边界”，不讲“怎么接”。如果你发现某个能力没生效，先来这里对照一下：它到底是没开、没配，还是压根就没实现。

## 学完你能做什么

- 判断一件事该不该指望 z.ai：哪些是“已实现”，哪些是“文档明确没做”
- 搞清 z.ai 只影响哪些端点（以及哪些端点完全不受影响）
- 看到每个结论的源码/文档证据（带 GitHub 行号链接），方便你自己复核

## 你现在的困境

你可能已经在 Antigravity Tools 里打开了 z.ai，但一用就遇到这些疑惑：

- 为什么有些请求会走 z.ai，有些完全不走？
- MCP 端点能不能当成“完整 MCP Server”？
- UI 里看得到的开关，到底有没有对应到真实实现？

## 什么是 z.ai 集成（在本项目里）？

**z.ai 集成**在 Antigravity Tools 里是一个可选的“上游 provider + MCP 扩展”。它只在特定条件下接管 Claude 协议请求，并提供 MCP Search/Reader 反代与一个最小化的 Vision MCP 内置服务器；它不是全协议、全能力的替换方案。

::: info 一句话记忆
你可以把 z.ai 当成“Claude 请求的可选上游 + 一组可开关的 MCP 端点”，别把它当成“把 z.ai 的所有能力完整搬进来”。
:::

## 已实现：稳定可用（以源码为准）

### 1) 仅 Claude 协议会走 z.ai（/v1/messages + /v1/messages/count_tokens）

z.ai 的 Anthropic 上游转发只在 Claude handler 的 z.ai 分支发生：

- `POST /v1/messages`：当 `use_zai=true` 时调用 `forward_anthropic_json(...)` 把 JSON 请求转发到 z.ai Anthropic 兼容端点
- `POST /v1/messages/count_tokens`：当 z.ai 启用时同样转发；否则返回占位的 `{input_tokens:0, output_tokens:0}`

证据：

- z.ai 分支选择与转发入口：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- count_tokens 的 z.ai 分支与占位返回：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- z.ai Anthropic 转发实现：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip “响应流式”怎么理解？
`forward_anthropic_json` 会把上游响应体以 `bytes_stream()` 流式回传给客户端，不解析 SSE（见 `providers/zai_anthropic.rs` 的 Response body 构建）。
:::

### 2) 调度模式（dispatch_mode）的“真实含义”

`dispatch_mode` 决定 `/v1/messages` 是否走 z.ai：

| dispatch_mode | 会发生什么 | 证据 |
|--- | --- | ---|
| `off` | 永不使用 z.ai | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | 所有 Claude 请求都走 z.ai | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Google 池不可用（0 账号或“没有可用账号”）才走 z.ai | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | 把 z.ai 当作“额外 1 个槽位”参与轮询（不保证一定命中） | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning pooled 的常见误解
`pooled` 不是“z.ai + Google 账号池都用，而且按权重稳定分流”。代码里明确写了“no strict guarantees”，本质是一个轮询槽位（`slot == 0` 才走 z.ai）。
:::

### 3) 模型映射：Claude 模型名怎么变成 z.ai 的 glm-*？

在转发到 z.ai 之前，如果请求体里有 `model` 字段，会被重写：

1. `proxy.zai.model_mapping` 精确匹配（同时支持原串和 lower-case key）
2. `zai:<model>` 前缀：去掉 `zai:` 直接用
3. `glm-*`：保持不变
4. 非 `claude-*`：保持不变
5. `claude-*` 且包含 `opus/haiku`：映射到 `proxy.zai.models.opus/haiku`；否则默认 `sonnet`

证据：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37)、[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) 转发时的 Header 安全策略（避免泄露本地 proxy key）

z.ai 上游转发不会“原样带所有 Header”，而是做了两层防线：

- 只放行一小部分 Header（例如 `content-type`、`accept`、`anthropic-version`、`user-agent`）
- 把 z.ai 的 API Key 注入到上游（优先保持客户端用的鉴权方式：`x-api-key` 或 `Authorization: Bearer ...`）

证据：

- Header 白名单：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- 注入 z.ai auth：[`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## 已实现：MCP（Search/Reader 反代 + Vision 内置）

### 1) MCP Search/Reader：反向代理到 z.ai 的 MCP 端点

本地端点与上游地址是写死的：

| 本地端点 | 上游地址 | 开关 | 证据 |
|--- | --- | --- | ---|
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404 不是“网络问题”
只要 `proxy.zai.mcp.enabled=false`，或者对应 `web_search_enabled/web_reader_enabled=false`，这些端点就会直接返回 404。
:::

证据：

- MCP 总开关与 z.ai key 校验：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- 路由注册：[`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP：一个“最小化 Streamable HTTP MCP”内置服务器

Vision MCP 不是反代，它是本地内置实现：

- 端点：`/mcp/zai-mcp-server/mcp`
- `POST` 支持：`initialize`、`tools/list`、`tools/call`
- `GET` 返回 SSE keepalive（要求已初始化的 session）
- `DELETE` 结束 session

证据：

- handler 主入口与方法分发：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- `initialize`、`tools/list`、`tools/call` 的实现：[`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Vision MCP 的“最小实现”定位：[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Vision MCP 工具集（8 个）与文件大小限制

工具列表来自 `tool_specs()`：

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

证据：[`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270)、[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

本地文件会被读出来并编码成 `data:<mime>;base64,...`，同时有硬限制：

- 图片上限 5 MB（`image_source_to_content(..., 5)`）
- 视频上限 8 MB（`video_source_to_content(..., 8)`）

证据：[`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## 明确未实现 / 不要期待（以文档声明与实现细节为准）

### 1) z.ai 用量/预算监控（usage/budget）未实现

`docs/zai/implementation.md` 明确写了“not implemented yet”。这意味着：

- 你不能指望 Antigravity Tools 提供 z.ai 的 usage/budget 查询或告警
- 配额治理（Quota Protection）也不会自动读 z.ai 的预算/用量数据

证据：[`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP 不是完整 MCP Server

Vision MCP 目前定位就是“只够工具调用”的最小实现：prompts/resources、resumability、streamed tool output 等都还没做。

证据：[`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36)、[`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude` 不会反映 z.ai 的真实模型列表

这个端点返回的模型列表来自本地内置映射与自定义映射（`get_all_dynamic_models`），不会去请求 z.ai 上游的 `/v1/models`。

证据：

- handler：[`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- 列表生成逻辑：[`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## 配置字段速查（z.ai 相关）

z.ai 配置在 `ProxyConfig.zai` 下，包含这些字段：

- `enabled` / `base_url` / `api_key`
- `dispatch_mode`（`off/exclusive/pooled/fallback`）
- `model_mapping`（精确匹配覆盖）
- `models.{opus,sonnet,haiku}`（Claude 家族默认映射）
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

默认值（base_url / 默认模型）也在同一个文件里：

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

证据：[`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116)、[`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## 本课小结

- z.ai 目前只会接管 Claude 协议（`/v1/messages` + `count_tokens`），其他协议端点不是“自动走 z.ai”
- MCP Search/Reader 是反代；Vision MCP 是本地最小实现，不是完整 MCP Server
- `/v1/models/claude` 的模型列表来自本地映射，不代表 z.ai 上游真实模型

---

## 下一课预告

> 下一课我们学习 **[版本演进](../../changelog/release-notes/)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| z.ai 集成范围（Claude 协议 + MCP + Vision MCP） | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| z.ai 调度模式与模型默认值 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| z.ai 默认 base_url / 默认模型 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| `/v1/messages` 是否走 z.ai 的选择逻辑 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| `/v1/messages/count_tokens` 的 z.ai 转发与占位返回 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| z.ai Anthropic 上游转发（JSON 转发 + 响应流式回传） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| z.ai 模型映射规则（map_model_for_zai） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Header 白名单 + 注入 z.ai auth | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| MCP Search/Reader 反代与开关 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
|--- | --- | ---|
| Vision MCP 最小实现定位（非完整 MCP Server） | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Vision 工具列表与限制（tool_specs + 文件大小 + stream=false） | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| `/v1/models/claude` 模型列表来源（本地映射，不查上游） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| 用量/预算监控未实现（文档声明） | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
