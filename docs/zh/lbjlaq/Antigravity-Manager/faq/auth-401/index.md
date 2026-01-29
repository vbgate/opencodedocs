---
title: "鉴权失败: 401 错误排查 | Antigravity-Manager"
sidebarTitle: "3 分钟搞定 401"
subtitle: "401/鉴权失败：先看 auth_mode，再看 Header"
description: "学习 Antigravity Tools 代理的鉴权机制，排查 401 错误。按 auth_mode、api_key、Header 顺序定位问题，了解 auto 模式规则与 /healthz 豁免，避免 Header 优先级误判。"
tags:
  - "FAQ"
  - "鉴权"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/鉴权失败：先看 auth_mode，再看 Header

## 学完你能做什么

- 3 分钟内判断 401 是不是被 Antigravity Tools 的鉴权中间件拦下
- 弄清 `proxy.auth_mode` 四种模式（尤其是 `auto`）在你当前配置下的“实际生效值”
- 用正确的 API Key Header（以及避免 Header 优先级坑）让请求通过

## 你现在的困境

客户端调用本地反代时收到 `401 Unauthorized` 错误：
- Python/OpenAI SDK：抛出 `AuthenticationError`
- curl：返回 `HTTP/1.1 401 Unauthorized`
- HTTP 客户端：响应状态码 401

## 什么是 401/鉴权失败？

**401 Unauthorized** 在 Antigravity Tools 里最常见的含义是：代理启用了鉴权（由 `proxy.auth_mode` 决定），但请求没有带对 API Key，或带了一个优先级更高但不匹配的 Header，于是 `auth_middleware()` 直接返回 401。

::: info 先确认是不是“代理在拦”
上游平台也可能返回 401，但这篇 FAQ 只处理“代理鉴权导致的 401”。你可以先用下面的 `/healthz` 快速分辨。
:::

## 快速排查（按这个顺序做）

### 第 1 步：用 `/healthz` 判断“鉴权是否在拦你”

**为什么**
`all_except_health` 会放行 `/healthz`，但会拦住其他路由；这能帮你快速定位 401 是否来自代理鉴权层。

```bash
 # 不带任何鉴权 Header
curl -i http://127.0.0.1:8045/healthz
```

**你应该看到**
- `auth_mode=all_except_health`（或 `auto` 且 `allow_lan_access=true`）时：通常会返回 `200`
- `auth_mode=strict` 时：会返回 `401`

::: tip `/healthz` 在路由层是 GET
代理在路由里注册的是 `GET /healthz`（见 `src-tauri/src/proxy/server.rs`）。
:::

---

### 第 2 步：确认 `auth_mode` 的“实际生效值”（尤其是 `auto`）

**为什么**
`auto` 不是一个“独立策略”，它会根据 `allow_lan_access` 计算出真正要执行的模式。

| `proxy.auth_mode` | 额外条件 | 实际生效值（effective mode） |
| --- | --- | --- |
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**你可以在 GUI 的 API Proxy 页面检查**：`Allow LAN Access` 和 `Auth Mode`。

---

### 第 3 步：确认 `api_key` 不是空的，并且你用的是同一个值

**为什么**
鉴权开启时，如果 `proxy.api_key` 为空，`auth_middleware()` 会直接拒绝全部请求并打错误日志。

```text
Proxy auth is enabled but api_key is empty; denying request
```

**你应该看到**
- API Proxy 页面里能看到一个以 `sk-` 开头的 key（默认值在 `ProxyConfig::default()` 会自动生成）
- 点击“Regenerate/编辑”保存后，外部请求立刻按新 key 校验（无需重启）

---

### 第 4 步：用最简单的 Header 试一次（先别用复杂 SDK）

**为什么**
中间件会优先读取 `Authorization`，再读 `x-api-key`，最后读 `x-goog-api-key`。如果你同时发了多个 Header，前面的那个错了，后面的那个就算对也不会被用上。

```bash
 # 推荐写法：Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**你应该看到**：`HTTP/1.1 200 OK`（或至少不再是 401）

::: info 代理对 Authorization 的兼容细节
`auth_middleware()` 会把 `Authorization` 的值按 `Bearer ` 前缀做一次剥离；如果没有 `Bearer ` 前缀，也会把整个值当成 key 去比对。文档仍推荐 `Authorization: Bearer <key>`（更符合通用 SDK 约定）。
:::

**如果你必须用 `x-api-key`**：

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## 常见坑（都是源码里真实会发生的）

| 现象 | 真实原因 | 你该怎么改 |
| --- | --- | --- |
| `auth_mode=auto`，但本机调用仍然 401 | `allow_lan_access=true` 导致 `auto` 生效为 `all_except_health` | 关闭 `allow_lan_access`，或让客户端带上 key |
| 你觉得“我明明带了 x-api-key”，但仍 401 | 同时带了一个不匹配的 `Authorization`，中间件优先用它 | 删掉多余 Header，只保留一个你确定正确的 |
| `Authorization: Bearer<key>` 仍 401 | `Bearer` 后少了空格，无法按 `Bearer ` 前缀剥离 | 改成 `Authorization: Bearer <key>` |
| 所有请求都 401，日志出现 `api_key is empty` | `proxy.api_key` 为空 | 在 GUI 里重新生成/设置一个非空 key |

## 本课小结

- 先用 `/healthz` 定位 401 是否来自代理鉴权层
- 再确认 `auth_mode`（尤其是 `auto` 的 effective mode）
- 最后只带一个确定正确的 Header 去验证（避免 Header 优先级坑）

## 下一课预告

> 下一课我们学习 **[429/容量错误：账号轮换的正确预期与模型容量耗尽的误区](../429-rotation/)**。
>
> 你会学到：
> - 429 到底是“配额不足”还是“上游限流”
> - 账号轮换的正确预期（什么时候会自动切、什么时候不会）
> - 用配置把 429 的概率压下去

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能        | 文件路径                                                                                             | 行号    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| ProxyAuthMode 枚举 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key 与默认值 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| auto 模式解析（effective_auth_mode） | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| 鉴权中间件（Header 提取与优先级、/healthz 豁免、OPTIONS 放行） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| /healthz 路由注册与中间件顺序 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| 鉴权文档（模式与客户端约定） | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**关键枚举**：
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`：鉴权模式

**关键函数**：
- `ProxySecurityConfig::effective_auth_mode()`：把 `auto` 解析成真实策略
- `auth_middleware()`：执行鉴权（含 Header 提取顺序与 /healthz 豁免）

</details>
