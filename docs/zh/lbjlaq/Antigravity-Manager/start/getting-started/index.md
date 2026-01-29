---
title: "介绍: 本地 AI 网关 | Antigravity Manager"
sidebarTitle: "什么是本地 AI 网关"
subtitle: "Antigravity Tools 是什么：把「账号 + 协议」做成本地 AI 网关"
description: "了解 Antigravity Manager 的核心定位。它提供桌面端和本地 HTTP 网关，支持多协议端点和账号池调度，帮助你快速上手本地反代并避免常见配置错误。"
tags:
  - "入门"
  - "概念"
  - "本地网关"
  - "API Proxy"
prerequisite: []
order: 1
---

# Antigravity Tools 是什么：把“账号 + 协议”做成本地 AI 网关

很多 AI 客户端/SDK 的接入门槛，不在“会不会调用 API”，而在“你到底要对接哪家协议、怎么管理多个账号、怎么让失败自动恢复”。Antigravity Tools 试图把这三件事，收敛成一个本地网关。

## 什么是 Antigravity Tools？

**Antigravity Tools** 是一个桌面应用：你在 GUI 里管理账号与配置，它在本机启动一个 HTTP 反代服务，把不同厂商/协议的请求统一转发到上游，并把响应再转换回客户端熟悉的格式。

## 学完你能做什么

- 说清楚 Antigravity Tools 解决的是什么问题（以及它不解决什么）
- 认清它的核心组成：GUI、账号池、HTTP 反代网关、协议适配
- 了解默认安全边界（127.0.0.1、端口、鉴权模式）以及什么情况下需要改
- 知道下一步该去哪一章：安装、添加账号、启动反代、接入客户端

## 你现在的困境

你可能遇到过这些麻烦：

- 同一个客户端要支持 OpenAI/Anthropic/Gemini 三种协议，配置经常写乱
- 有多个账号，但切换、轮换、限流重试都靠手动
- 请求失败时，你只能盯日志猜是“账号失效”还是“上游限流/容量耗尽”

Antigravity Tools 的目标是把这些“边角工作”做进一个本地网关里，让你的客户端/SDK 尽量只关心一件事：把请求发到本地。

## 核心思路

你可以把它理解成一套本地的「AI 调度网关」，由三层组成：

1) GUI（桌面应用）
- 负责让你管理账号、配置、监控与统计。
- 主页面包含：Dashboard、Accounts、API Proxy、Monitor、Token Stats、Settings。

2) HTTP 反代服务（Axum Server）
- 负责对外暴露多个协议的端点，并把请求转交给对应 handler。
- 反代服务会挂载鉴权、中间件监控、CORS、Trace 等层。

3) 账号池与调度（TokenManager 等）
- 负责从本地账号池中挑选可用账号，必要时刷新 token、做轮换与自愈。

::: info “本地网关”是什么意思？
这里的“本地”是字面意思：服务跑在你自己的机器上，你的客户端（Claude Code、OpenAI SDK、各类第三方客户端）把 Base URL 指向 `http://127.0.0.1:<port>`，请求先到本机，再由 Antigravity Tools 转发到上游。
:::

## 它对外提供哪些端点

反代服务在一个 Router 里注册了多套协议端点，你可以先记住这几个“入口”：

- OpenAI 兼容：`/v1/chat/completions`、`/v1/completions`、`/v1/responses`、`/v1/models`
- Anthropic 兼容：`/v1/messages`、`/v1/messages/count_tokens`
- Gemini 原生：`/v1beta/models`、`/v1beta/models/:model`、`/v1beta/models/:model/countTokens`
- 健康检查：`GET /healthz`

如果你的客户端能对接其中任意一种协议，理论上都可以通过“改 Base URL”的方式，把请求导到这个本地网关。

## 默认安全边界（别跳过）

这类“本地反代”最大的坑，往往不是功能不够，而是你不小心把它暴露出去了。

先记住几条默认值（都来自默认配置）：

- 默认端口：`8045`
- 默认仅本机访问：`allow_lan_access=false`，监听地址为 `127.0.0.1`
- 默认鉴权模式：`auth_mode=off`（不要求客户端带 key）
- 默认会生成一个 `sk-...` 形式的 `api_key`（供你在需要鉴权时开启）

::: warning 什么时候必须开鉴权？
只要你开启了局域网访问（`allow_lan_access=true`，监听地址变为 `0.0.0.0`），就应该同时启用鉴权，并把 API Key 当作密码管理。
:::

## 什么时候用 Antigravity Tools

它更适合这类场景：

- 你有多个 AI 客户端/SDK，希望统一走一个 Base URL
- 你需要把不同协议（OpenAI/Anthropic/Gemini）收敛到同一套“本地出口”
- 你有多个账号，希望由系统负责轮换与稳定性处理

如果你只想“写两行代码直接调官方 API”，并且账号/协议都很固定，那它可能有点重。

## 跟我做：先建立一个正确的使用顺序

这节课不教你细节配置，只把主线顺序先对齐，避免你跳着用导致卡住：

### 第 1 步：先安装再启动

**为什么**
桌面端负责账号管理与启动反代服务，没有它，后续的 OAuth/反代都无从谈起。

去下一章按 README 的安装方式完成安装。

**你应该看到**：你能打开 Antigravity Tools，并看到 Dashboard 页面。

### 第 2 步：添加至少一个账号

**为什么**
反代服务需要从账号池里拿到可用身份去向上游发请求；没有账号，网关也无法“代你调用”。

去「添加账号」那一章，按 OAuth 或 Refresh Token 流程把账号加进来。

**你应该看到**：Accounts 页面里出现你的账号，并能看到配额/状态信息。

### 第 3 步：启动 API Proxy，并用 /healthz 做最小验证

**为什么**
先用 `GET /healthz` 验证“本地服务在跑”，再去接入客户端，排障会简单很多。

去「启动本地反代并接入第一个客户端」那一章完成闭环。

**你应该看到**：你的客户端/SDK 能通过本地 Base URL 成功拿到响应。

## 踩坑提醒

| 场景 | 你可能会怎么做（❌） | 推荐做法（✓） |
|--- | --- | ---|
| 想让手机/另一台电脑访问 | 直接打开 `allow_lan_access=true` 但不设鉴权 | 同时启用鉴权，并先在局域网里验证 `GET /healthz` |
| 客户端报 404 | 只改 host/port，不管客户端如何拼接 `/v1` | 先确认客户端的 base_url 拼接策略，再决定是否需要带 `/v1` 前缀 |
| 一上来就排 Claude Code | 直接接入复杂客户端，失败后不知道从哪查 | 先跑通最小闭环：启动 Proxy -> `GET /healthz` -> 再接入客户端 |

## 本课小结

- Antigravity Tools 的定位是“桌面端 + 本地 HTTP 反代网关”：GUI 管理，Axum 提供多协议端点
- 你需要把它当作一个本地基础设施：先安装、再加账号、再启动 Proxy、最后接入客户端
- 默认只监听 `127.0.0.1:8045`，如果要暴露到局域网，务必同时启用鉴权

## 下一课预告

> 下一课我们把安装这一步走完：**[安装与升级：桌面端最佳安装路径](../installation/)**。
>
> 你会学到：
> - README 里列出的几种安装方式（以及优先级）
> - 升级入口与常见系统拦截的处理方式

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 产品定位（本地 AI 中转站/协议鸿沟） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L35-L77) | 35-77 |
| Router 端点总览（OpenAI/Claude/Gemini/healthz） | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 默认端口/默认仅本机/默认 key 与 bind address 逻辑 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L291) | 174-291 |
|--- | --- | ---|
| GUI 页面路由结构（Dashboard/Accounts/API Proxy/Monitor/Token Stats/Settings） | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L48) | 19-48 |

**关键默认值**：
- `ProxyConfig.port = 8045`：反代服务默认端口
- `ProxyConfig.allow_lan_access = false`：默认仅本机访问
- `ProxyAuthMode::default() = off`：默认不要求鉴权

</details>
