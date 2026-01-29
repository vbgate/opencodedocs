---
title: "Anthropic: 兼容 API | Antigravity-Manager"
sidebarTitle: "让 Claude Code 走本地网关"
subtitle: "Anthropic: 兼容 API"
description: "学习 Antigravity-Manager 的 Anthropic 兼容 API。配置 Claude Code 的 Base URL、用 /v1/messages 跑通对话、理解鉴权与 warmup 拦截。"
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---
# Anthropic 兼容 API：/v1/messages 与 Claude Code 的关键契约

想让 Claude Code 走本地网关、但又不想改它的 Anthropic 协议用法，你只要把 Base URL 指向 Antigravity Tools，然后用 `/v1/messages` 跑通一次请求就行。

## 什么是 Anthropic 兼容 API？

**Anthropic 兼容 API** 指 Antigravity Tools 对外提供的 Anthropic Messages 协议端点。它接收 `/v1/messages` 请求，在本地做报文清理、流式封装与重试轮换后，再把请求转发到上游提供真实模型能力。

## 学完你能做什么

- 用 Antigravity Tools 的 `/v1/messages` 接口跑通 Claude Code（或任何 Anthropic Messages 客户端）
- 分清楚 Base URL 和鉴权 header 怎么配，避免 401/404 盲试
- 需要流式就拿到标准 SSE；不需要流式也能拿到 JSON
- 知道代理在后台做了哪些“协议修补”（warmup 拦截、消息清理、签名兜底）

## 你现在的困境

你想用 Claude Code/Anthropic SDK，但网络、账号、配额、限流这些问题让对话很不稳定；你已经把 Antigravity Tools 当作本地网关跑起来了，却常卡在这几类问题：

- Base URL 写成了 `.../v1` 或被客户端“叠路径”，结果直接 404
- 开了代理鉴权但不知道客户端到底用哪个 header 传 key，结果 401
- Claude Code 的后台 warmup/摘要任务把配额悄悄吃掉

## 什么时候用这一招

- 你要接入 **Claude Code CLI**，并希望它“按 Anthropic 协议”直连本地网关
- 你手头的客户端只支持 Anthropic Messages API（`/v1/messages`），不想改代码

## 🎒 开始前的准备

::: warning 前置条件
本课默认你已经跑通了本地反代的基本闭环（能访问 `/healthz`，知道代理端口与是否开启鉴权）。如果还没跑通，先看 **[启动本地反代并接入第一个客户端](/zh/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**。
:::

你需要准备三样东西：

1. 代理地址（示例：`http://127.0.0.1:8045`）
2. 是否开启了代理鉴权（以及对应的 `proxy.api_key`）
3. 一个能发 Anthropic Messages 请求的客户端（Claude Code / curl 都行）

## 核心思路

**Anthropic 兼容 API** 在 Antigravity Tools 里对应一组固定路由：`POST /v1/messages`、`POST /v1/messages/count_tokens`、`GET /v1/models/claude`（见 `src-tauri/src/proxy/server.rs` 的 Router 定义）。

其中 `/v1/messages` 是“主线入口”，代理会在真正发上游请求前做一堆兼容性处理：

- 清理历史消息里不被协议接受的字段（例如 `cache_control`）
- 合并连续同角色消息，避免“角色交替”校验失败
- 检测 Claude Code 的 warmup 报文并直接返回模拟响应，减少配额浪费
- 根据错误类型做重试与账号轮换（最多 3 次尝试），提升长会话稳定性

## 跟我做

### 第 1 步：确认 Base URL 只写到端口

**为什么**
`/v1/messages` 是代理侧固定路由，Base URL 写成 `.../v1` 很容易被客户端再拼一次 `/v1/messages`，最终变成 `.../v1/v1/messages`。

你可以先用 curl 直接探活：

```bash
#你应该看到：{"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### 第 2 步：如果你开启了鉴权，先记住这 3 种 header

**为什么**
代理的鉴权中间件会从 `Authorization`、`x-api-key`、`x-goog-api-key` 里取 key；开了鉴权但 header 没对上，就会稳定 401。

::: info 代理接受哪些鉴权 header？
`Authorization: Bearer <key>`、`x-api-key: <key>`、`x-goog-api-key: <key>` 都能用（见 `src-tauri/src/proxy/middleware/auth.rs`）。
:::

### 第 3 步：用 Claude Code CLI 直连本地网关

**为什么**
Claude Code 使用 Anthropic Messages 协议；把它的 Base URL 指向本地网关，就能复用 `/v1/messages` 这套契约。

按 README 的示例配置环境变量：

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**你应该看到**：Claude Code 能正常启动，并在你发送消息后收到回复。

### 第 4 步：先列出可用模型（给 curl/SDK 用）

**为什么**
不同客户端会把 `model` 原样传过来；先把模型列表拿到手，排查问题会快很多。

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**你应该看到**：返回一个 `object: "list"` 的 JSON，其中 `data[].id` 就是可用的模型 ID。

### 第 5 步：用 curl 调用 `/v1/messages`（非流式）

**为什么**
这是最小可复现链路：不用 Claude Code，也能确认“路由 + 鉴权 + 请求体”到底哪里出错。

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<从 /v1/models/claude 里选一个>",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "你好，简单介绍一下你自己"}
    ]
  }'
```

**你应该看到**：

- HTTP 200
- 响应头里可能包含 `X-Account-Email` 和 `X-Mapped-Model`（用于排障）
- 响应体是 Anthropic Messages 风格的 JSON（`type: "message"`）

### 第 6 步：需要流式时，打开 `stream: true`

**为什么**
Claude Code 会用 SSE；你自己用 curl 也能把 SSE 跑通，确认中间没有代理/缓冲问题。

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "<从 /v1/models/claude 里选一个>",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "用 3 句话解释什么是本地反代"}
    ]
  }'
```

**你应该看到**：一行行的 SSE 事件（`event: message_start`、`event: content_block_delta` 等）。

## 检查点 ✅

- `GET /healthz` 返回 `{"status":"ok"}`
- `GET /v1/models/claude` 能拿到 `data[].id`
- `POST /v1/messages` 能 200 返回（非流式 JSON 或流式 SSE 二选一）

## 踩坑提醒

### 1) Base URL 不要写成 `.../v1`

Claude Code 的示例是 `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"`，因为代理侧路由本身就带 `/v1/messages`。

### 2) 开了鉴权但 `proxy.api_key` 为空，会直接拒绝

代理鉴权开启但 `api_key` 为空时，中间件会直接返回 401（见 `src-tauri/src/proxy/middleware/auth.rs` 的保护逻辑）。

### 3) `/v1/messages/count_tokens` 在默认路径下是占位实现

当 z.ai 转发没启用时，这个端点会直接返回 `input_tokens: 0, output_tokens: 0`（见 `handle_count_tokens`）。不要用它来判断真实 token。

### 4) 你明明没开流式，但看到服务端在“内部走 SSE”

代理对 `/v1/messages` 有一个兼容策略：当客户端不要求流式时，服务端可能会**内部强制走流式**再把结果收集成 JSON 返回（见 `handle_messages` 里 `force_stream_internally` 的逻辑）。

## 本课小结

- Claude Code/Anthropic 客户端要跑通，本质是 3 件事：Base URL、鉴权 header、`/v1/messages` 请求体
- 代理为了“协议能跑 + 长会话稳定”，会对历史消息做清理、对 warmup 做拦截、并在失败时重试/轮换账号
- `count_tokens` 目前不能当真实口径（除非你启用了对应的转发路径）

## 下一课预告

> 下一课我们学习 **[Gemini 原生 API：/v1beta/models 以及 Google SDK 的端点接入](/zh/lbjlaq/Antigravity-Manager/platforms/gemini/)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 代理路由：`/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Anthropic 主入口：`handle_messages`（含 warmup 拦截与重试循环） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| 模型列表：`GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens`（z.ai 未启用时返回 0） | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Warmup 检测与模拟响应 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
|--- | --- | ---|
| 请求清理：移除 `cache_control` | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| 请求清理：合并连续同角色消息 | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
|--- | --- | ---|

**关键常量**：
- `MAX_RETRY_ATTEMPTS = 3`：`/v1/messages` 的最大重试次数

</details>
