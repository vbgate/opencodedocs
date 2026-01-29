---
title: "安全: 隐私与鉴权配置 | Antigravity-Manager"
sidebarTitle: "别让局域网裸奔"
subtitle: '安全与隐私：auth_mode、allow_lan_access，以及"不要泄露账号信息"的设计'
description: "学习 Antigravity Tools 的安全配置方法。掌握 auth_mode 的 4 种模式、allow_lan_access 的地址差异、api_key 配置和 /healthz 验证，避免泄露账号信息。"
tags:
  - "security"
  - "privacy"
  - "auth_mode"
  - "allow_lan_access"
  - "api_key"
prerequisite:
  - "start-getting-started"
  - "start-proxy-and-first-client"
duration: 16
order: 2
---

# 安全与隐私：auth_mode、allow_lan_access，以及“不要泄露账号信息”的设计

你把 Antigravity Tools 当“本地 AI 网关”用时，安全问题通常只绕 2 件事：你把服务暴露给了谁（只本机，还是整个局域网/公网），以及外部请求要不要带 API Key。这节课把源码里的规则讲清楚，并给你一套能直接照做的最小安全基线。

## 学完你能做什么

- 选对 `allow_lan_access`：知道它会影响监听地址（`127.0.0.1` vs `0.0.0.0`）
- 选对 `auth_mode`：搞清 `off/strict/all_except_health/auto` 的实际行为
- 配好 `api_key` 并验证：能用 `curl` 一眼看出“到底有没有开鉴权”
- 知道隐私保护的边界：本地 proxy key 不会被转发到上游；对 API 客户端的错误信息避免泄露账号邮箱

## 你现在的困境

- 你想让手机/另一台电脑访问，但担心一开局域网访问就“裸奔”
- 你想开鉴权，但又不确定 `/healthz` 该不该豁免，怕把探活也搞挂
- 你担心把本地 key、cookie、账号邮箱泄露给外部客户端或上游平台

## 什么时候用这一招

- 你准备把 `allow_lan_access` 打开（NAS、家庭局域网、团队内网）
- 你要用 cloudflared/反向代理把本地服务暴露到公网（先看 **[Cloudflared 一键隧道](/zh/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**）
- 你遇到 `401`，需要确认是“没带 key”，还是“模式没对齐”

## 🎒 开始前的准备

::: warning 前置条件
- 你已经能在 GUI 里启动 API Proxy（如果还没跑通，先看 **[启动本地反代并接入第一个客户端](/zh/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**）。
- 你知道自己要解决的问题：只本机访问，还是要让局域网/公网访问。
:::

::: info 这节课里会反复出现的 3 个字段
- `allow_lan_access`：是否允许局域网访问。
- `auth_mode`：鉴权策略（决定哪些路由必须带 key）。
- `api_key`：本地代理的 API Key（只用于本地代理鉴权，不会转发到上游）。
:::

## 什么是 auth_mode？

**auth_mode** 是 Antigravity Tools 的“代理鉴权开关 + 豁免策略”。它决定外部客户端访问本地代理端点时，哪些请求必须携带 `proxy.api_key`，以及 `/healthz` 这样的探活路由是否允许无鉴权访问。

## 核心思路

1. 先把“暴露面”定下来：`allow_lan_access=false` 时只监听 `127.0.0.1`；`true` 时监听 `0.0.0.0`。
2. 再把“入口钥匙”定下来：`auth_mode` 决定是否要带 key，以及 `/healthz` 是否豁免。
3. 最后做“隐私收口”：不要把本地 proxy key/cookie 透传给上游；对外错误信息尽量不带账号邮箱。

## 跟我做

### 第 1 步：先决定你要不要开局域网访问（allow_lan_access）

**为什么**
你只有在“需要其他设备访问”时才应该打开局域网访问，否则默认只本机访问是最省心的安全策略。

在 `ProxyConfig` 里，监听地址由 `allow_lan_access` 决定：

```rust
pub fn get_bind_address(&self) -> &str {
    if self.allow_lan_access {
        "0.0.0.0"
    } else {
        "127.0.0.1"
    }
}
```

在 GUI 的 `API Proxy` 页面，把“允许局域网访问”开关按你的需求设置即可。

**你应该看到**
- 关闭时：提示语是“仅本机访问”的语义（具体文案取决于语言包）
- 开启时：界面会显示醒目的风险提示（提醒这是一次“暴露面扩大”）

### 第 2 步：选一个 auth_mode（建议先用 auto）

**为什么**
`auth_mode` 不只是“开/关鉴权”，它还决定了 `/healthz` 这种探活端点是不是豁免。

项目支持 4 种模式（来自 `docs/proxy/auth.md`）：

- `off`：所有路由都不需要鉴权
- `strict`：所有路由都需要鉴权
- `all_except_health`：除了 `/healthz`，其他路由都需要鉴权
- `auto`：自动模式，会根据 `allow_lan_access` 推导实际策略

`auto` 的推导逻辑在 `ProxySecurityConfig::effective_auth_mode()`：

```rust
match self.auth_mode {
    ProxyAuthMode::Auto => {
        if self.allow_lan_access {
            ProxyAuthMode::AllExceptHealth
        } else {
            ProxyAuthMode::Off
        }
    }
    ref other => other.clone(),
}
```

**推荐做法**
- 只本机访问：`allow_lan_access=false` + `auth_mode=auto`（最终等价于 `off`）
- 局域网访问：`allow_lan_access=true` + `auth_mode=auto`（最终等价于 `all_except_health`）

**你应该看到**
- 在 `API Proxy` 页面，“Auth Mode”下拉框里有 `off/strict/all_except_health/auto` 四个选项

### 第 3 步：确认你的 api_key（必要时重新生成）

**为什么**
只要你的代理需要对外访问（局域网/公网），`api_key` 就应该当作密码管理。

默认情况下 `ProxyConfig::default()` 会生成一个 `sk-...` 形式的 key：

```rust
api_key: format!("sk-{}", uuid::Uuid::new_v4().simple()),
```

在 `API Proxy` 页面，你可以编辑、重新生成、复制当前 `api_key`。

**你应该看到**
- 页面上有 `api_key` 输入框，以及编辑/重新生成/复制按钮

### 第 4 步：用 /healthz 验证“豁免策略”是否符合预期

**为什么**
`/healthz` 是最短闭环：你不用真的调用模型，就能确认“服务可达 + 鉴权策略正确”。

把 `<PORT>` 换成你自己的端口（默认 `8045`）：

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

::: details 如果你把 auth_mode 设成 strict
`strict` 不会豁免 `/healthz`。你需要带上 key：

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```
:::

### 第 5 步：用一个“非 health 端点”验证 401（以及带 key 后不再是 401）

**为什么**
你要确认鉴权中间件真的在生效，而不是 UI 里选了模式但实际没起作用。

下面这个请求体是故意写得不完整的，它的目的不是“调用成功”，而是验证是否被鉴权拦截：

```bash
#不带 key：当 auth_mode != off 时，应该直接 401
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -d "{}"

#带 key：不应该再是 401（可能返回 400/422，因为请求体不完整）
curl -i "http://127.0.0.1:<PORT>/v1/messages" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <API_KEY>" \
  -d "{}"
```

**你应该看到**
- 不带 key：`HTTP/1.1 401 Unauthorized`
- 带 key：状态码不再是 401

## 检查点 ✅

- 你能说清楚自己当前的暴露面：只本机（127.0.0.1）还是局域网（0.0.0.0）
- `auth_mode=auto` 时，你能预测实际生效模式（LAN -> `all_except_health`，本机 -> `off`）
- 你能用 2 条 `curl` 命令复现“没带 key 的 401”

## 踩坑提醒

::: warning 错误做法 vs 推荐做法

| 场景 | ❌ 常见错误 | ✓ 推荐做法 |
|--- | --- | ---|
| 需要局域网访问 | 只打开 `allow_lan_access=true`，但 `auth_mode=off` | 用 `auth_mode=auto`，并设置强 `api_key` |
| 开了鉴权但一直 401 | 客户端带了 key，但 header 名不兼容 | 代理兼容 `Authorization`/`x-api-key`/`x-goog-api-key` 三种 header |
| 鉴权开启却没配 key | `api_key` 为空也打开了鉴权 | 后端会直接拒绝（日志会提示 key 为空） |
:::

::: warning /healthz 的豁免只在 all_except_health 生效
中间件会在“有效模式”为 `all_except_health` 且路径是 `/healthz` 时放行；你要把它当作“探活口”，不要拿它当业务 API。
:::

## 隐私与“不要泄露账号信息”的设计

### 1) 本地 proxy key 不会转发到上游

鉴权只发生在本地代理入口；`docs/proxy/auth.md` 明确说明：proxy API key 不会被转发到上游。

### 2) 转发到 z.ai 时，会刻意收缩可透传的 header

当请求被转发到 z.ai（Anthropic 兼容）时，代码会只放行少量 header，避免把本地 proxy key 或 cookie 带出去：

```rust
// Only forward a conservative set of headers to avoid leaking the local proxy key or cookies.
```

### 3) Token 刷新失败的错误信息避免包含账号邮箱

当 Token 刷新失败时，日志里会记录具体账号，但返回给 API 客户端的错误会被改写成不包含邮箱的形式：

```rust
// Avoid leaking account emails to API clients; details are still in logs.
last_error = Some(format!("Token refresh failed: {}", e));
```

## 本课小结

- 先定暴露面（`allow_lan_access`），再定入口钥匙（`auth_mode` + `api_key`）
- `auth_mode=auto` 的规则很简单：LAN 就至少 `all_except_health`，只本机就 `off`
- 隐私的底线是“本地 key 不外带、账号邮箱不对外报错泄露”，细节在中间件与上游转发代码里

## 下一课预告

> 下一课我们会看 **[高可用调度：轮换、固定账号、粘性会话与失败重试](/zh/lbjlaq/Antigravity-Manager/advanced/scheduling/)**，把“安全入口”之后的“稳定出口”补齐。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| auth_mode 的四种模式与 auto 语义说明 | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L10-L24) | 10-24 |
| ProxyAuthMode 枚举与默认值（默认 off） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig 的关键字段与默认值（allow_lan_access、api_key） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L259) | 174-259 |
| 监听地址推导（127.0.0.1 vs 0.0.0.0） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L292) | 281-292 |
|--- | --- | ---|
| 鉴权中间件（OPTIONS 放行、/healthz 豁免、三种 header 兼容） | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| UI：allow_lan_access 与 auth_mode 的开关/下拉框 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L943-L1046) | 943-1046 |
| UI：api_key 的编辑/重置/复制 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1048-L1120) | 1048-1120 |
| invalid_grant 自动禁用与“避免泄露邮箱”的错误改写 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L841-L940) | 841-940 |
| disable_account：写入 disabled/disabled_at/disabled_reason 并移出内存池 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| z.ai 转发时收缩可透传 header（避免泄露本地 key/cookies） | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89) | 70-89 |
| 账号池禁用与 UI 展示的行为说明（文档） | [`docs/proxy/accounts.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/accounts.md#L9-L44) | 9-44 |

</details>
