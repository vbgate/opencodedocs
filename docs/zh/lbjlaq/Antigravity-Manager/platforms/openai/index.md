---
title: "OpenAI API: 接入配置 | Antigravity-Manager"
sidebarTitle: "5 分钟接上 OpenAI SDK"
subtitle: "OpenAI API: 接入配置"
description: "学习 OpenAI 兼容 API 的接入配置。掌握路由转换、base_url 设置与 401/404/429 排查，快速使用 Antigravity Tools。"
tags:
  - "OpenAI"
  - "API Proxy"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# OpenAI 兼容 API：/v1/chat/completions 与 /v1/responses 的落地策略

你会用这套 **OpenAI 兼容 API** 把现成的 OpenAI SDK/客户端直连到 Antigravity Tools 本地网关，重点跑通 `/v1/chat/completions` 和 `/v1/responses`，并学会用响应头快速排障。

## 学完你能做什么

- 用 OpenAI SDK（或 curl）直连 Antigravity Tools 的本地网关
- 跑通 `/v1/chat/completions`（含 `stream: true`）和 `/v1/responses`
- 看懂 `/v1/models` 的模型列表，以及响应头里的 `X-Mapped-Model`
- 遇到 401/404/429 时，知道该先排查哪里

## 你现在的困境

很多客户端/SDK 只认 OpenAI 的接口形状：固定的 URL、固定的 JSON 字段、固定的 SSE 流式格式。
Antigravity Tools 的目标不是让你改客户端，而是让客户端“以为自己在调 OpenAI”，实际上把请求转成内部上游调用，再把结果转回 OpenAI 格式。

## 什么时候用这一招

- 你已经有一堆只支持 OpenAI 的工具（IDE 插件、脚本、Bot、SDK），不想为每个都写一套新集成
- 你希望统一用 `base_url` 把请求打到本机（或局域网）网关，再由网关做账号调度、重试与监控

## 🎒 开始前的准备

::: warning 前置条件
- 你已经在 Antigravity Tools 的 “API Proxy” 页面启动了反代服务，并记下端口（例如 `8045`）
- 你已经添加了至少一个可用账号，否则反代拿不到上游 token
:::

::: info 鉴权怎么带？
当你开启 `proxy.auth_mode` 且配置了 `proxy.api_key` 时，请求需要携带 API Key。

Antigravity Tools 的中间件会优先读取 `Authorization`，也兼容 `x-api-key`、`x-goog-api-key`。（实现见 `src-tauri/src/proxy/middleware/auth.rs`）
:::

## 什么是 OpenAI 兼容 API？

**OpenAI 兼容 API**是一组“看起来像 OpenAI”的 HTTP 路由与 JSON/SSE 协议。客户端按 OpenAI 的请求格式发送到本地网关，网关再把请求转换为内部上游调用，并把上游响应转换回 OpenAI 的响应结构，让现成的 OpenAI SDK 基本无需改动就能用。

### 兼容端点速览（本课相关）

| 端点 | 用途 | 代码证据 |
| --- | --- | --- |
| `POST /v1/chat/completions` | Chat Completions（含流式） | `src-tauri/src/proxy/server.rs` 路由注册；`src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | Legacy Completions（复用同一处理器） | `src-tauri/src/proxy/server.rs` 路由注册 |
| `POST /v1/responses` | Responses/Codex CLI 兼容（复用同一处理器） | `src-tauri/src/proxy/server.rs` 路由注册（注释：兼容 Codex CLI） |
| `GET /v1/models` | 返回模型列表（含自定义映射 + 动态生成） | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## 跟我做

### 第 1 步：用 curl 确认服务活着（/healthz + /v1/models）

**为什么**
先把“服务没启动/端口不对/被防火墙挡了”这类低级问题排掉。

```bash
 # 1) 健康检查
curl -s http://127.0.0.1:8045/healthz

 # 2) 拉取模型列表
curl -s http://127.0.0.1:8045/v1/models
```

**你应该看到**：`/healthz` 返回类似 `{"status":"ok"}`；`/v1/models` 返回 `{"object":"list","data":[...]}`。

### 第 2 步：用 OpenAI Python SDK 调用 /v1/chat/completions

**为什么**
这一步证明“OpenAI SDK → 本地网关 → 上游 → OpenAI 响应转换”整条链路是通的。

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

**你应该看到**：终端打印出一段模型回复文本。

### 第 3 步：打开 stream，确认 SSE 流式返回

**为什么**
很多客户端依赖 OpenAI 的 SSE 协议（`Content-Type: text/event-stream`）。这一步确认流式链路和事件格式可用。

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

**你应该看到**：终端不断输出以 `data: { ... }` 开头的行，并以 `data: [DONE]` 结束。

### 第 4 步：用 /v1/responses（Codex/Responses 风格）跑通一条请求

**为什么**
有些工具走的是 `/v1/responses` 或者会在请求体里使用 `instructions`、`input` 等字段。本项目会把这类请求“规范化”为 `messages` 再复用同一套转换逻辑。（处理器见 `src-tauri/src/proxy/handlers/openai.rs`）

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "你是一个严谨的代码审查员。",
    "input": "请指出下面这段代码最可能的 bug：\n\nfunction add(a, b) { return a - b }"
  }'
```

**你应该看到**：返回体是一个 OpenAI 风格的响应对象（本项目会把 Gemini 响应转换为 OpenAI `choices[].message.content`）。

### 第 5 步：确认模型路由生效（看 X-Mapped-Model 响应头）

**为什么**
你在客户端里写的 `model` 不一定是实际调用的“物理模型”。网关会先做模型映射（含自定义映射/通配符，见 [模型路由：自定义映射、通配符优先级与预设策略](/zh/lbjlaq/Antigravity-Manager/advanced/model-router/)），并把最终结果放在响应头里，方便你排障。

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

**你应该看到**：响应头里包含 `X-Mapped-Model: ...`（例如映射到 `gemini-2.5-flash`），并且可能还会包含 `X-Account-Email: ...`。

## 检查点 ✅

- `GET /healthz` 返回 `{"status":"ok"}`（或等价 JSON）
- `GET /v1/models` 返回 `object=list` 且 `data` 是数组
- `/v1/chat/completions` 非流式请求能拿到 `choices[0].message.content`
- `stream: true` 时能收到 SSE，并以 `[DONE]` 结束
- `curl -i` 能看到 `X-Mapped-Model` 响应头

## 踩坑提醒

### 1) Base URL 写错导致 404（最常见）

- OpenAI SDK 示例里，`base_url` 需要以 `/v1` 结尾（见项目 README 的 Python 示例）。
- 有些客户端会“叠路径”。例如 README 明确提到：Kilo Code 在 OpenAI 模式下可能会拼出 `/v1/chat/completions/responses` 这类非标准路径，从而触发 404。

### 2) 401：不是上游挂了，是你没带 key 或模式不对

当鉴权策略的"有效模式"不是 `off` 时，中间件会校验请求头：`Authorization: Bearer <proxy.api_key>`，也兼容 `x-api-key`、`x-goog-api-key`。（实现见 `src-tauri/src/proxy/middleware/auth.rs`）

::: tip 鉴权模式提示
`auth_mode = auto` 时会根据 `allow_lan_access` 自动决定：
- `allow_lan_access = true` → 有效模式为 `all_except_health`（除 `/healthz` 外都需要鉴权）
- `allow_lan_access = false` → 有效模式为 `off`（本机访问无需鉴权）
:::

### 3) 429/503/529：代理会重试 + 轮换账号，但也可能“池子耗尽”

OpenAI 处理器内置最多 3 次尝试（并受账号池大小限制），遇到部分错误会等待/轮换账号重试。（实现见 `src-tauri/src/proxy/handlers/openai.rs`）

## 本课小结

- `/v1/chat/completions` 是最通用的接入点，`stream: true` 会走 SSE
- `/v1/responses` 和 `/v1/completions` 走同一套兼容处理器，核心是先把请求规范化为 `messages`
- `X-Mapped-Model` 帮你确认“客户端模型名 → 最终物理模型”的映射结果

## 下一课预告

> 下一课我们会继续看 **Anthropic 兼容 API：/v1/messages 与 Claude Code 的关键契约**（对应章节：`platforms-anthropic`）。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| OpenAI 路由注册（含 /v1/responses） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Chat Completions 处理器（含 Responses 格式探测） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| /v1/completions 与 /v1/responses 处理器（Codex/Responses 规范化 + 重试/轮换） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| /v1/models 的返回（动态模型列表） | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| OpenAI 请求数据结构（messages/instructions/input/size/quality） | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
| OpenAI -> Gemini 请求转换（systemInstruction/thinkingConfig/tools） | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L6-L553) | 6-553 |
| Gemini -> OpenAI 响应转换（choices/usageMetadata） | [`src-tauri/src/proxy/mappers/openai/response.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/response.rs#L5-L214) | 5-214 |
| 模型映射与通配符优先级（精确 > 通配符 > 默认） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| 鉴权中间件（Authorization/x-api-key/x-goog-api-key） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |

**关键常量**：
- `MAX_RETRY_ATTEMPTS = 3`：OpenAI 协议最大尝试次数（含轮换）（见 `src-tauri/src/proxy/handlers/openai.rs`）

**关键函数**：
- `transform_openai_request(...)`：把 OpenAI 请求体转换成内部上游请求（见 `src-tauri/src/proxy/mappers/openai/request.rs`）
- `transform_openai_response(...)`：把上游响应转换成 OpenAI `choices`/`usage`（见 `src-tauri/src/proxy/mappers/openai/response.rs`）

</details>
