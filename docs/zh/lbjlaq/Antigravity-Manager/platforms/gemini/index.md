---
title: "Gemini API: 本地网关接入 | Antigravity-Manager"
subtitle: "Gemini API 接入：让 Google SDK 直连本地网关"
sidebarTitle: "直连本地 Gemini"
description: "学习 Antigravity-Manager 的 Gemini 本地网关接入。通过 /v1beta/models 端点，掌握 generateContent 和 streamGenerateContent 调用，并用 cURL 与 Python 验证。"
tags:
  - "Gemini"
  - "Google SDK"
  - "API Proxy"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 3
---

# Gemini API 接入：让 Google SDK 直连本地网关

## 学完你能做什么

- 用 Antigravity Tools 暴露的 Gemini 原生端点（`/v1beta/models/*`）接入你的客户端
- 用 Google 风格的 `:generateContent` / `:streamGenerateContent` 路径调用本地网关
- 在开启 Proxy 鉴权时，理解为什么 `x-goog-api-key` 能直接用

## 你现在的困境

你可能已经把本地反代跑起来了，但一到 Gemini 这里就开始卡：

- Google SDK 默认打 `generativelanguage.googleapis.com`，怎么改成你自己的 `http://127.0.0.1:<port>`？
- Gemini 的路径带冒号（`models/<model>:generateContent`），很多客户端一拼接就变成 404
- 你启用了代理鉴权，但 Google 客户端不发 `x-api-key`，于是一直 401

## 什么时候用这一招

- 你希望用“Gemini 原生协议”而不是 OpenAI/Anthropic 兼容层
- 你手上已经有 Google/第三方 Gemini 风格客户端，想最低成本迁移到本地网关

## 🎒 开始前的准备

::: warning 前置条件
- 你已经在 App 里添加了至少 1 个账号（否则后端拿不到上游 access token）
- 你已经启动了本地反代服务，并知道监听端口（默认会用到 `8045`）
:::

## 核心思路

Antigravity Tools 在本地 Axum 服务器上暴露了 Gemini 原生路径：

- 列表：`GET /v1beta/models`
- 调用：`POST /v1beta/models/<model>:generateContent`
- 流式：`POST /v1beta/models/<model>:streamGenerateContent`

后端会把你的 Gemini 原生请求 body 包一层 v1internal 的结构（注入 `project`、`requestId`、`requestType` 等），再转发到 Google 的 v1internal 上游端点（并带上账号 access token）。（源码：`src-tauri/src/proxy/mappers/gemini/wrapper.rs`、`src-tauri/src/proxy/upstream/client.rs`）

::: info 为什么教程里的 base URL 推荐用 127.0.0.1？
App 的快速集成示例里写死推荐 `127.0.0.1`，原因是“避免部分环境 IPv6 解析延迟问题”。（源码：`src/pages/ApiProxy.tsx`）
:::

## 跟我做

### 第 1 步：确认网关在线（/healthz）

**为什么**
先确认服务在线，再排查协议/鉴权问题会省很多时间。

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**你应该看到**：返回 JSON，包含 `{"status":"ok"}`（源码：`src-tauri/src/proxy/server.rs`）。

### 第 2 步：列出 Gemini 模型（/v1beta/models）

**为什么**
你需要先确认“对外暴露的模型 ID”是什么，后面的 `<model>` 都以这里为准。

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**你应该看到**：响应里有 `models` 数组，每个元素的 `name` 类似 `models/<id>`（源码：`src-tauri/src/proxy/handlers/gemini.rs`）。

::: tip 重要
模型 ID 用哪个字段？
- ✅ 使用 `displayName` 字段（如 `gemini-2.0-flash`）
- ✅ 或从 `name` 字段去掉 `models/` 前缀
- ❌ 不要直接复制 `name` 字段的完整值（会导致路径错误）

如果你复制了 `name` 字段（如 `models/gemini-2.0-flash`）用作模型 ID，请求路径会变成 `/v1beta/models/models/gemini-2.0-flash:generateContent`，这是错的。（源码：`src-tauri/src/proxy/common/model_mapping.rs`）
:::

::: warning 重要
当前 `/v1beta/models` 是“把本地动态模型列表伪装成 Gemini models 列表”的返回，不是向上游实时拉取。（源码：`src-tauri/src/proxy/handlers/gemini.rs`）
:::

### 第 3 步：调用 generateContent（带冒号的路径）

**为什么**
Gemini 原生 REST API 的关键就是 `:generateContent` 这种“带冒号的 action”。后端会在同一路由里解析 `model:method`。（源码：`src-tauri/src/proxy/handlers/gemini.rs`）

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

**你应该看到**：响应 JSON 里有 `candidates`（或外层有 `response.candidates`，代理会解包）。

### 第 4 步：调用 streamGenerateContent（SSE）

**为什么**
流式对“长输出/大模型”更稳；代理会把上游 SSE 转发回你的客户端，并设置 `Content-Type: text/event-stream`。（源码：`src-tauri/src/proxy/handlers/gemini.rs`）

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

**你应该看到**：终端持续输出 `data: {...}` 形式的 SSE 行，正常情况下最后会出现 `data: [DONE]`（表示流结束）。

::: tip 注意
`data: [DONE]` 是 SSE 的标准结束标记，但**不是一定出现**：
- 如果上游正常结束并发送 `[DONE]`，代理会转发它
- 如果上游异常断开、超时或发送其他结束信号，代理不会补发 `[DONE]`

客户端代码应按 SSE 标准处理：遇到 `data: [DONE]` 或连接断开都应视为流结束。（源码：`src-tauri/src/proxy/handlers/gemini.rs`）
:::

### 第 5 步：用 Python Google SDK 直连本地网关

**为什么**
这是项目 UI 里给的“快速集成”示例路径：用 Google Generative AI Python 包把 `api_endpoint` 指到你的本地反代地址。（源码：`src/pages/ApiProxy.tsx`）

```python
#需要安装: pip install google-generativeai
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

**你应该看到**：程序输出一段模型回复文本。

## 检查点 ✅

- `/healthz` 能返回 `{"status":"ok"}`
- `/v1beta/models` 能列出模型（至少 1 个）
- `:generateContent` 能返回 `candidates`
- `:streamGenerateContent` 返回 `Content-Type: text/event-stream` 且能持续出流

## 踩坑提醒

- **401 一直过不去**：如果你启用了鉴权，但 `proxy.api_key` 为空，后端会直接拒绝请求。（源码：`src-tauri/src/proxy/middleware/auth.rs`）
- **Header 带什么 key**：代理会同时识别 `Authorization`、`x-api-key`、`x-goog-api-key`。所以“Google 风格客户端只发 `x-goog-api-key`”也能过。（源码：`src-tauri/src/proxy/middleware/auth.rs`）
- **countTokens 结果永远是 0**：当前 `POST /v1beta/models/<model>/countTokens` 返回固定 `{"totalTokens":0}`，属于占位实现。（源码：`src-tauri/src/proxy/handlers/gemini.rs`）

## 本课小结

- 你要接的是 `/v1beta/models/*`，不是 `/v1/*`
- 关键路径写法是 `models/<modelId>:generateContent` / `:streamGenerateContent`
- 启用鉴权时，`x-goog-api-key` 是被代理明确支持的请求头

## 下一课预告

> 下一课我们学习 **[Imagen 3 图片生成：OpenAI Images 参数 size/quality 的自动映射](../imagen/)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| Gemini 路由注册（/v1beta/models/*） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| 模型 ID 解析与路由（为什么 `models/` 前缀会导致路由错误） | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| 解析 `model:method` + generate/stream 主逻辑 | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| SSE 出流逻辑（转发 `[DONE]` 而非自动补发） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| `/v1beta/models` 返回结构（动态模型列表伪装） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| `countTokens` 占位实现（固定 0） | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
| 鉴权 Header 兼容（含 `x-goog-api-key`） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |
| Google SDK Python 示例（`api_endpoint` 指向本地网关） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Gemini 会话指纹（粘性/缓存用 session_id） | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Gemini 请求 v1internal 包装（注入 project/requestId/requestType 等） | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| 上游 v1internal 端点与 fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**关键常量**：
- `MAX_RETRY_ATTEMPTS = 3`：Gemini 请求最大轮换次数上限（源码：`src-tauri/src/proxy/handlers/gemini.rs`）

</details>
