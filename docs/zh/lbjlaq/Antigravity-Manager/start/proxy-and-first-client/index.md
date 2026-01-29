---
title: "启动代理: 反代与客户端接入 | Antigravity-Manager"
sidebarTitle: "5 分钟跑通反代"
subtitle: "启动本地反代并接入第一个客户端（/healthz + SDK 配置）"
description: "学习 Antigravity 反代启动与客户端接入：设置端口和鉴权，用 /healthz 探活验证，完成 SDK 首次调用。"
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# 启动本地反代并接入第一个客户端（/healthz + SDK 配置）

这节课用 Antigravity Tools 把本地反代（API Proxy）跑通：启动服务、用 `/healthz` 探活，再接入一个 SDK 完成第一次请求。

## 学完你能做什么

- 在 Antigravity Tools 的 API Proxy 页面启动/停止本地反代服务
- 用 `GET /healthz` 做探活，确认“端口没错、服务真在跑”
- 搞清楚 `auth_mode` 与 API Key 的关系：哪些路径需要鉴权、要带哪个 Header
- 任选一个客户端（OpenAI / Anthropic / Gemini SDK）完成第一次真实请求

## 你现在的困境

- 你已经装好了 Antigravity Tools，也加了账号，但不知道“反代到底有没有启动成功”
- 客户端接入时容易遇到 `401`（没带 key）或 `404`（Base URL 拼错/叠路径）
- 你不想靠猜，想要一个最短闭环：启动 → 探活 → 第一次请求成功

## 什么时候用这一招

- 你刚安装完，想确认本地网关能对外工作
- 你换了端口、开启了局域网访问、或改了鉴权模式，想快速验证配置没翻车
- 你要接入一个新客户端/新 SDK，想用最小示例先跑通

## 🎒 开始前的准备

::: warning 前置条件
- 你已经完成安装，并能正常打开 Antigravity Tools。
- 你至少有一个可用账号；否则启动反代时会返回错误 `"没有可用账号，请先添加账号"`（仅当 z.ai 分发也未启用时）。
:::

::: info 这节课里会反复出现的几个词
- **Base URL**：客户端请求的“服务根地址”。不同 SDK 的拼接方式不一样，有的要带 `/v1`，有的不需要。
- **探活**：用一个最小请求确认服务可达。本项目的探活端点是 `GET /healthz`，返回 `{"status":"ok"}`。
:::

## 核心思路

1. Antigravity Tools 启动反代时，会根据配置绑定监听地址和端口：
   - `allow_lan_access=false` 时绑定 `127.0.0.1`
   - `allow_lan_access=true` 时绑定 `0.0.0.0`
2. 你不需要先写任何代码。先用 `GET /healthz` 做探活，确认“服务在跑”。
3. 如果你开启了鉴权：
   - `auth_mode=all_except_health` 会豁免 `/healthz`
   - `auth_mode=strict` 则所有路径都需要 API Key

## 跟我做

### 第 1 步：确认端口、局域网访问、鉴权模式

**为什么**
你要先确定“客户端应该连哪里（host/port）”以及“是否要带 key”，否则后面 401/404 会很难排。

在 Antigravity Tools 打开 `API Proxy` 页面，重点看这 4 个字段：

- `port`：默认是 `8045`
- `allow_lan_access`：默认关闭（仅本机访问）
- `auth_mode`：可选 `off/strict/all_except_health/auto`
- `api_key`：默认会生成 `sk-...`，并且 UI 会校验必须以 `sk-` 开头且长度至少 10

**你应该看到**
- 页面右上角有一个 Start/Stop 按钮（启动/停止反代），端口输入框在服务运行时会被禁用

::: tip 新手推荐配置（先跑通再加安全）
- 第一次跑通：`allow_lan_access=false` + `auth_mode=off`
- 需要局域网访问再开：先打开 `allow_lan_access=true`，再把 `auth_mode` 切到 `all_except_health`（至少别把整个 LAN 暴露成“裸奔 API”）
:::

### 第 2 步：启动反代服务

**为什么**
GUI 的 Start 会调用后端命令启动 Axum Server，并加载账号池；这是“对外提供 API”的前提。

点击页面右上角的 Start。

**你应该看到**
- 状态从 stopped 变成 running
- 旁边会显示当前加载到的账号数量（active accounts）

::: warning 如果启动失败，最常见的两类错误
- `"没有可用账号，请先添加账号"`：说明账号池为空，且 z.ai 分发未启用。
- `"启动 Axum 服务器失败: 地址 <host:port> 绑定失败: ..."`：端口被占用或没有权限（换个端口再试）。
:::

### 第 3 步：用 /healthz 探活（最短闭环）

**为什么**
`/healthz` 是最稳定的“连通性确认”。它不依赖模型、账号或协议转换，只验证服务是否可达。

把 `<PORT>` 换成你在 UI 里看到的端口（默认 `8045`）：

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**你应该看到**

```json
{"status":"ok"}
```

::: details 需要带鉴权时怎么测？
当你把 `auth_mode` 切到 `strict`，所有路径都要带 key（包括 `/healthz`）。

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

鉴权 Header 的推荐写法（兼容更多形式）：
- `Authorization: Bearer <proxy.api_key>` 或 `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### 第 4 步：接入你的第一个客户端（OpenAI / Anthropic / Gemini 三选一）

**为什么**
`/healthz` 只能说明“服务可达”；真正的接入成功，要以 SDK 发起一次真实请求为准。

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "你好，请自我介绍"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**你应该看到**
- 客户端能拿到一个非空的文本回复
- 如果开启了 Proxy Monitor，你还会在监控里看到这次请求记录

## 检查点 ✅

- `GET /healthz` 返回 `{"status":"ok"}`
- API Proxy 页面显示 running
- 你选的一个 SDK 例子能返回内容（不是 401/404，也不是空响应）

## 踩坑提醒

::: warning 401：多数是鉴权没对齐
- 你开启了 `auth_mode`，但客户端没带 key。
- 你带了 key，但 Header 名不对：本项目同时兼容 `Authorization` / `x-api-key` / `x-goog-api-key`。
:::

::: warning 404：多数是 Base URL 拼错或“叠路径”
- OpenAI SDK 通常需要 `base_url=.../v1`；而 Anthropic/Gemini 的示例是不带 `/v1` 的。
- 有些客户端会把路径重复拼接成类似 `/v1/chat/completions/responses`，会导致 404（项目 README 里专门提到过 Kilo Code 的 OpenAI 模式叠路径问题）。
:::

::: warning 局域网访问不是“打开就完事”
当你开启 `allow_lan_access=true`，服务会绑定到 `0.0.0.0`。这意味着同一局域网内的其他设备可以通过你的机器 IP + 端口访问。

如果你要这么用，至少把 `auth_mode` 打开，并设置一个强 `api_key`。
:::

## 本课小结

- 启动反代后，先用 `/healthz` 做探活，再去配 SDK
- `auth_mode` 决定哪些路径要带 key；`all_except_health` 会豁免 `/healthz`
- 接入 SDK 时，最容易错的是 Base URL 是否要带 `/v1`

## 下一课预告

> 下一课我们把 OpenAI 兼容 API 的细节讲清楚：包括 `/v1/chat/completions` 和 `/v1/responses` 的兼容边界。
>
> 去看 **[OpenAI 兼容 API：/v1/chat/completions 与 /v1/responses 的落地策略](/zh/lbjlaq/Antigravity-Manager/platforms/openai/)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 主题 | 文件路径 | 行号 |
| --- | --- | --- |
| 反代服务启动/停止/状态 | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| 启动前账号池检查（无账号时的报错条件） | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| 路由注册（含 `/healthz`） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| `/healthz` 返回值 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| 代理鉴权中间件（Header 兼容与 `/healthz` 豁免） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| `auth_mode=auto` 的实际解析逻辑 | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| ProxyConfig 默认值（端口 8045、默认仅本机） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| 绑定地址推导（127.0.0.1 vs 0.0.0.0） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| UI 启动/停止按钮调用 `start_proxy_service/stop_proxy_service` | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| UI 端口/局域网/鉴权/API key 配置区域 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| README 的 Claude Code / Python 接入示例 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
