---
title: "端点速查: HTTP 路由一览 | Antigravity-Manager"
sidebarTitle: "秒查所有路由"
subtitle: "端点速查表：对外 HTTP 路由一览"
description: "学习 Antigravity 网关的 HTTP 端点分布。通过表格对照 OpenAI/Anthropic/Gemini/MCP 路由，掌握鉴权模式和 API Key Header 的使用方法。"
tags:
  - "端点速查"
  - "API 参考"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---
# 端点速查表：对外 HTTP 路由一览

## 学完你能做什么

- 快速定位需要调用的端点路径
- 理解不同协议的端点分布
- 了解鉴权模式和健康检查的特殊规则

## 端点总览

Antigravity Tools 的本地反代服务提供以下几类端点：

| 协议分类 | 用途 | 典型客户端 |
|--- | --- | ---|
| **OpenAI 协议** | 通用 AI 应用兼容 | OpenAI SDK / 兼容客户端 |
| **Anthropic 协议** | Claude 系列调用 | Claude Code / Anthropic SDK |
| **Gemini 协议** | Google 官方 SDK | Google Gemini SDK |
| **MCP 端点** | 工具调用增强 | MCP 客户端 |
| **内部/辅助** | 健康检查、拦截/内部能力 | 自动化脚本 / 监控探活 |

---

## OpenAI 协议端点

这些端点兼容 OpenAI API 格式，适合大多数支持 OpenAI SDK 的客户端。

| 方法 | 路径 | 路由入口（Rust handler） | 备注 |
|--- | --- | --- | ---|
| GET | `/v1/models` | `handlers::openai::handle_list_models` | OpenAI 兼容：模型列表 |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | OpenAI 兼容：Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | OpenAI 兼容：Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | OpenAI 兼容：Codex CLI 请求（与 `/v1/completions` 同 handler） |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | OpenAI 兼容：Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | OpenAI 兼容：Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | OpenAI 兼容：Audio Transcriptions |

::: tip 兼容性提示
`/v1/responses` 端点专为 Codex CLI 设计，实际与 `/v1/completions` 使用相同的处理逻辑。
:::

---

## Anthropic 协议端点

这些端点按 Anthropic API 的路径与请求格式组织，供 Claude Code / Anthropic SDK 调用。

| 方法 | 路径 | 路由入口（Rust handler） | 备注 |
|--- | --- | --- | ---|
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Anthropic 兼容：Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Anthropic 兼容：count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Anthropic 兼容：模型列表 |

---

## Gemini 协议端点

这些端点兼容 Google Gemini API 格式，可直接使用 Google 官方 SDK。

| 方法 | 路径 | 路由入口（Rust handler） | 备注 |
|--- | --- | --- | ---|
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini 原生：模型列表 |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini 原生：GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini 原生：generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini 原生：countTokens |

::: warning 路径说明
`/v1beta/models/:model` 在同一路径下同时注册了 GET 和 POST（见路由定义）。
:::

---

## MCP 端点

MCP（Model Context Protocol）端点用于对外暴露“工具调用”接口（由 `handlers::mcp::*` 处理）。是否启用与具体行为以配置为准；细节见 [MCP 端点](../../platforms/mcp/)。

| 方法 | 路径 | 路由入口（Rust handler） | 备注 |
|--- | --- | --- | ---|
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP：Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP：Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP：z.ai MCP Server |

::: details MCP 相关说明
MCP 的可用范围与边界说明，参见 [z.ai 集成的能力边界（已实现 vs 明确未实现）](../zai-boundaries/)。
:::

---

## 内部与辅助端点

这些端点用于系统内部功能和外部监控。

| 方法 | 路径 | 路由入口（Rust handler） | 备注 |
|--- | --- | --- | ---|
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | 内部预热端点 |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | 遥测日志拦截：直接返回 200 |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | 遥测日志拦截：直接返回 200 |
| GET | `/healthz` | `health_check_handler` | 健康检查：返回 `{"status":"ok"}` |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | 模型自动检测 |

::: tip 静默处理
事件日志端点会直接返回 `200 OK`，不进行实际处理，用于拦截客户端的遥测上报。
:::

::: warning 这些端点是否需要 API Key？
除了 `GET /healthz` 可能被豁免，其他路由是否需要携带 key，都由 `proxy.auth_mode` 的“有效模式”决定（详见下方“鉴权模式”与源码中的 `auth_middleware`）。
:::

---

## 鉴权模式

所有端点的访问权限由 `proxy.auth_mode` 控制：

| 模式 | 说明 | `/healthz` 要求鉴权？ | 其他端点要求鉴权？ |
|--- | --- | --- | ---|
| `off` | 完全开放 | ❌ 否 | ❌ 否 |
| `strict` | 全部需要鉴权 | ✅ 是 | ✅ 是 |
| `all_except_health` | 仅健康检查开放 | ❌ 否 | ✅ 是 |
| `auto` | 自动判断（默认） | ❌ 否 | 视 `allow_lan_access` 而定 |

::: info auto 模式逻辑
`auto` 不是独立策略，而是从配置推导：当 `proxy.allow_lan_access=true` 时等同 `all_except_health`，否则等同 `off`（见 `docs/proxy/auth.md`）。
:::

**鉴权请求格式**：

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key（OpenAI 风格）
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key（Gemini 风格）
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key（OpenAI 风格）
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key（Gemini 风格）
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## 本节小结

Antigravity Tools 提供了一套完整的多协议兼容端点，支持 OpenAI、Anthropic、Gemini 三大主流 API 格式，以及 MCP 工具调用扩展。

- **快速接入**：优先使用 OpenAI 协议端点，兼容性最强
- **原生功能**：需要 Claude Code 完整功能时使用 Anthropic 协议端点
- **Google 生态**：使用 Google 官方 SDK 时选择 Gemini 协议端点
- **安全配置**：根据使用场景（本地/LAN/公网）选择合适的鉴权模式

---

## 下一课预告

> 下一课我们学习 **[数据与模型](../storage-models/)**。
>
> 你会学到：
> - 账号文件的存储结构
> - SQLite 统计库的表结构
> - 关键字段口径与备份策略

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 路由注册（全部端点） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 鉴权中间件（Header 兼容 + `/healthz` 豁免 + OPTIONS 放行） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| auth_mode 模式与 auto 派生规则 | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| `/healthz` 返回值 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| 遥测日志拦截（silent 200） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**关键函数**：
- `AxumServer::start()`：启动 Axum 服务器并注册路由（第 79-254 行）
- `health_check_handler()`：健康检查处理（第 266-272 行）
- `silent_ok_handler()`：静默成功处理（第 274-277 行）

</details>
