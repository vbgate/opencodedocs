---
title: "404 路径不兼容: Base URL 配置 | Antigravity-Manager"
sidebarTitle: "修好 404 路径"
subtitle: "404/路径不兼容：Base URL、/v1 前缀与叠路径客户端"
description: "学习解决 Antigravity Tools 接入时 404 路径不兼容问题。掌握 Base URL 正确配置，避免 /v1 前缀重复，处理叠路径客户端，涵盖常见场景。"
tags:
  - "faq"
  - "base-url"
  - "404"
  - "openai"
  - "anthropic"
  - "gemini"
prerequisite:
  - "start-proxy-and-first-client"
  - "faq-auth-401"
order: 4
---

# 404/路径不兼容：Base URL、/v1 前缀与叠路径客户端

## 学完你能做什么

- 看到 404 时，先判断是“Base URL 拼接问题”还是“鉴权/服务没开”
- 按客户端类型选对 Base URL（要不要带 `/v1`）
- 识别两类高频坑：重复前缀（`/v1/v1/...`）和叠路径（`/v1/chat/completions/responses`）

## 你现在的困境

接入外部客户端时遇到 `404 Not Found` 错误，排查半天发现是 Base URL 配置问题：

- Kilo Code 调用失败，日志显示 `/v1/chat/completions/responses` 找不到
- Claude Code 虽然能连，但总提示路径不兼容
- Python OpenAI SDK 报 `404`，但明明服务已经启动

这些问题的根源不是账号配额或鉴权，而是客户端把“自己的路径”拼到了你写的 Base URL 上，结果路径就歪了。

## 什么时候用这一招

- 你确定反代已启动，但调用任意接口都返回 404
- 你把 Base URL 填成了带路径的形式（比如 `/v1/...`），但不知道客户端会不会再拼一遍
- 你用的客户端“自带一套路径拼接逻辑”，请求出来的路径看起来不像标准 OpenAI/Anthropic/Gemini

## 🎒 开始前的准备

先把“服务没开/鉴权失败”排除掉，不然你会在错误方向上越绕越远。

### 第 1 步：确认反代在跑

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/healthz
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/healthz | Select-Object -ExpandProperty Content
```

:::

**你应该看到**：HTTP 200，返回 JSON（至少包含 `{"status":"ok"}`）。

### 第 2 步：确认你遇到的是 404（不是 401）

如果你在 `auth_mode=strict/all_except_health/auto(allow_lan_access=true)` 模式下没带 key，你更可能遇到 401。先看一眼状态码，必要时先做完 **[401 鉴权失败排查](../auth-401/)**。

## 什么是 Base URL？

**Base URL** 是客户端发请求时的“根地址”。客户端通常会把自己的 API 路径拼到 Base URL 后面再请求，所以 Base URL 里到底要不要带 `/v1`，取决于客户端会追加什么路径。你只要把最终请求路径对齐到 Antigravity Tools 的路由，就不会再被 404 卡住。

## 核心思路

Antigravity Tools 的反代路由是“全路径硬编码”的（见 `src-tauri/src/proxy/server.rs`），常用入口是：

| 协议 | 路径 | 用途 |
| --- | --- | --- |
| OpenAI | `/v1/models` | 列出模型 |
| OpenAI | `/v1/chat/completions` | 聊天补全 |
| OpenAI | `/v1/responses` | Codex CLI 兼容 |
| Anthropic | `/v1/messages` | Claude 消息 API |
| Gemini | `/v1beta/models` | 列出模型 |
| Gemini | `/v1beta/models/:model` | 生成内容 |
| 健康检查 | `/healthz` | 探活端点 |

你要做的是：让客户端拼出来的“最终路径”，刚好落在这些路由上。

---

## 跟我做

### 第 1 步：用 curl 先打到“正确的路径”

**为什么**
先确认“你要走的协议”在本地确实有对应路由，避免把 404 当成“模型/账号问题”。

::: code-group

```bash [macOS/Linux]
 # OpenAI 协议：列模型
curl -i http://127.0.0.1:8045/v1/models

 # Anthropic 协议：消息接口（这里只看 404/401，不要求一定成功）
curl -i http://127.0.0.1:8045/v1/messages

 # Gemini 协议：列模型
curl -i http://127.0.0.1:8045/v1beta/models
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/models | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1/messages | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest -UseBasicParsing http://127.0.0.1:8045/v1beta/models | Select-Object -ExpandProperty StatusCode
```

:::

**你应该看到**：这些路径至少不应该是 404。若出现 401，先按 **[401 鉴权失败排查](../auth-401/)** 配好 key。

### 第 2 步：按客户端“会不会自己拼 /v1”选 Base URL

**为什么**
Base URL 的坑，本质是“你写的路径”和“客户端追加的路径”叠在一起了。

| 你在用的东西 | Base URL 推荐写法 | 你在对齐的路由 |
| --- | --- | --- |
| OpenAI SDK（Python/Node 等） | `http://127.0.0.1:8045/v1` | `/v1/chat/completions`、`/v1/models` |
| Claude Code CLI（Anthropic） | `http://127.0.0.1:8045` | `/v1/messages` |
| Gemini SDK / Gemini 模式客户端 | `http://127.0.0.1:8045` | `/v1beta/models/*` |

::: tip 口诀
OpenAI SDK 通常要你把 `/v1` 放在 Base URL 里；Anthropic/Gemini 更常见的是只写到 host:port。
:::

### 第 3 步：处理 Kilo Code 这种“叠路径”客户端

**为什么**
Antigravity Tools 没有 `/v1/chat/completions/responses` 这个路由。客户端拼出这个路径就一定 404。

按 README 的推荐配置：

1. 协议选择：优先用 **Gemini 协议**
2. Base URL：填写 `http://127.0.0.1:8045`

**你应该看到**：请求会走 `/v1beta/models/...` 这套路径，不再出现 `/v1/chat/completions/responses`。

### 第 4 步：别把 Base URL 写到“具体资源路径”

**为什么**
多数 SDK 会在 Base URL 后拼接自己的资源路径。如果你把 Base URL 写到了过深的位置，最终就会变成“双层路径”。

✅ 推荐（OpenAI SDK）：

```text
http://127.0.0.1:8045/v1
```

❌ 常见错误：

```text
http://127.0.0.1:8045
http://127.0.0.1:8045/v1/chat/completions
```

**你应该看到**：把 Base URL 改浅之后，请求路径回到 `/v1/...` 或 `/v1beta/...`，404 消失。

---

## 检查点 ✅

你可以用这张表快速对照你的“最终请求路径”是否可能命中 Antigravity Tools：

| 你在日志里看到的路径 | 结论 |
| --- | --- |
| 以 `/v1/` 开头（比如 `/v1/models`、`/v1/chat/completions`） | 走 OpenAI/Anthropic 兼容路由 |
| 以 `/v1beta/` 开头（比如 `/v1beta/models/...`） | 走 Gemini 原生路由 |
| 出现 `/v1/v1/` | Base URL 带了 `/v1`，客户端又拼了一次 |
| 出现 `/v1/chat/completions/responses` | 客户端叠路径，当前路由表不支持 |

---

## 踩坑提醒

### 坑 1：重复 /v1 前缀

**错误现象**：路径变成 `/v1/v1/chat/completions`

**原因**：Base URL 已经带 `/v1`，客户端又拼了一次。

**解决**：把 Base URL 改为“只到 `/v1`”，不要再往后写具体资源路径。

### 坑 2：叠路径客户端

**错误现象**：路径变成 `/v1/chat/completions/responses`

**原因**：客户端在 OpenAI 协议路径基础上又追加了业务路径。

**解决**：优先切换到该客户端的其他协议模式（比如 Kilo Code 用 Gemini）。

### 坑 3：端口写错

**错误现象**：`Connection refused` 或超时

**解决**：在 Antigravity Tools 的 "API 反代" 页面确认当前监听端口（默认 8045），Base URL 端口必须一致。

---

## 本课小结

| 现象 | 最常见原因 | 你应该怎么改 |
| --- | --- | --- |
| 一直 404 | Base URL 拼接错 | 先用 curl 验证 `/v1/models`/`/v1beta/models` 不为 404 |
| `/v1/v1/...` | `/v1` 重复 | OpenAI SDK 的 Base URL 保持到 `/v1` 结束 |
| `/v1/chat/completions/responses` | 客户端叠路径 | 换 Gemini 协议或做路径重写（不推荐新手） |

---

## 下一课预告

> 下一课我们学习 **[流式中断与 0 Token 问题](../streaming-0token/)**
>
> 你会学到：
> - 为什么流式响应会意外中断
> - 0 Token 错误的排查方法
> - Antigravity 的自动兜底机制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 反代路由定义（完整路由表） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| `AxumServer::start()`（路由构建入口） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L79-L216) | 79-216 |
| `health_check_handler()` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| README：Claude Code 的 Base URL 推荐 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L204) | 197-204 |
| README：Kilo Code 叠路径说明与推荐协议 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L206-L211) | 206-211 |
| README：Python OpenAI SDK 的 base_url 示例 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L213-L227) | 213-227 |

**关键函数**：
- `AxumServer::start()`: 启动 Axum 反代服务器并注册所有对外路由
- `health_check_handler()`: 健康检查处理器（`GET /healthz`）

</details>
