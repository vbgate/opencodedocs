---
title: "Invalid Grant 排查: 账号禁用恢复 | Antigravity-Manager"
sidebarTitle: "账号被禁用了怎么恢复"
subtitle: "invalid_grant 与账号自动禁用：为什么会发生、如何恢复"
description: "学习 invalid_grant 错误的含义与自动处理逻辑。确认 refresh_token 失效后，通过重新 OAuth 添加账号触发自动解禁，并验证恢复对 Proxy 生效。"
tags:
  - "FAQ"
  - "错误排查"
  - "OAuth"
  - "账号管理"
  - "invalid_grant"
prerequisite:
  - "start-add-account"
  - "start-first-run-data"
  - "advanced-scheduling"
order: 1
---
# invalid_grant 与账号自动禁用：为什么会发生、如何恢复

## 学完你能做什么

- 看到 `invalid_grant` 时，知道它对应的是哪一类 refresh_token 问题
- 弄清楚“账号为什么突然不可用”：什么情况下会被自动禁用、禁用后系统怎么处理
- 用最短路径恢复账号，并确认恢复已经对正在运行的 Proxy 生效

## 你遇到的症状

- 调用本地 Proxy 时突然失败，错误信息里出现 `invalid_grant`
- 明明账号还在 Accounts 列表里，但 Proxy 总是跳过它（或者你感觉它“再也没被用到”）
- 只有少量账号时，遇到一次 `invalid_grant` 后，整体可用性明显变差

## 什么是 invalid_grant？

**invalid_grant** 是 Google OAuth 在刷新 `access_token` 时返回的一类错误。对 Antigravity Tools 来说，它意味着某个账号的 `refresh_token` 很可能已经被撤销或过期，继续重试只会反复失败，所以系统会把该账号标记为不可用并从代理池中移出。

## 核心思路：系统不是“临时跳过”，而是“持久禁用”

当 Proxy 发现刷新 token 的错误字符串包含 `invalid_grant` 时，会做两件事：

1. **把账号写成 disabled**（落盘到账号 JSON）
2. **把账号从内存 token pool 移除**（避免反复选中同一个坏账号）

这就是你看到“账号还在，但 Proxy 不再用它”的原因。

::: info disabled vs proxy_disabled

- `disabled=true`：账号被“彻底禁用”（典型原因就是 `invalid_grant`）。加载账号池时会直接跳过。
- `proxy_disabled=true`：账号只是“对 Proxy 不可用”（手动禁用/批量操作/配额保护相关逻辑），语义不同。

这两个状态在加载账号池时是分开判断的：先判断 `disabled`，再做配额保护与 `proxy_disabled` 判断。

:::

## 跟我做

### 第 1 步：确认是不是 refresh_token 刷新触发的 invalid_grant

**为什么**：`invalid_grant` 可能出现在多个调用链路里，但本项目的“自动禁用”只在**刷新 access_token 失败**时触发。

在 Proxy 日志里，你会看到类似的错误日志（关键词是 `Token 刷新失败` + `invalid_grant`）：

```text
Token 刷新失败 (<email>): <...invalid_grant...>，尝试下一个账号
Disabling account due to invalid_grant (<email>): refresh_token likely revoked/expired
```

**你应该看到**：同一个账号在出现 `invalid_grant` 后，很快就不再被选中（因为它被移出 token pool）。

### 第 2 步：在账号文件里检查 disabled 字段（可选，但最准确）

**为什么**：自动禁用是“落盘”的，你确认文件内容后，就能排除“只是临时轮换”的误判。

账号文件位于应用数据目录的 `accounts/` 目录下（数据目录位置见 **[首次启动必懂：数据目录、日志、托盘与自动启动](../../start/first-run-data/)**）。当账号被禁用时，文件会出现这三个字段：

```json
{
  "disabled": true,
  "disabled_at": 1700000000,
  "disabled_reason": "invalid_grant: ..."
}
```

**你应该看到**：`disabled` 为 `true`，并且 `disabled_reason` 里包含 `invalid_grant:` 前缀。

### 第 3 步：恢复账号（推荐做法：重新添加同一个账号）

**为什么**：本项目的“恢复”不是在 Proxy 里手动点一个开关，而是通过“显式更新 token”来触发自动解禁。

到 **Accounts** 页面，用你新的凭据重新添加账号（两种方式任选其一）：

1. 重新走 OAuth 授权流程（见 **[添加账号：OAuth/Refresh Token 双通道与最佳实践](../../start/add-account/)**）
2. 用新的 `refresh_token` 再添加一次（系统会以 Google 返回的邮箱为准做 upsert）

当系统检测到你这次 upsert 的 `refresh_token` 或 `access_token` 与旧值不同，并且该账号之前处于 `disabled=true`，会自动清掉：

- `disabled`
- `disabled_reason`
- `disabled_at`

**你应该看到**：账号不再处于 disabled 状态，并且（如果 Proxy 正在运行）账号池会被自动 reload，让恢复立即生效。

### 第 4 步：验证恢复是否已对 Proxy 生效

**为什么**：如果你只有一个账号，或者其他账号也不可用，恢复后你应该立刻看到“可用性回来了”。

验证方法：

1. 发起一次会触发 token 刷新的请求（例如等待 token 临近过期后再请求）
2. 观察日志不再出现“跳过 disabled 账号”的提示

**你应该看到**：请求能正常通过，且日志里不再出现针对该账号的 `invalid_grant` 禁用流程。

## 踩坑提醒

### ❌ 把 disabled 当成“临时轮换”

如果你只在 UI 里看“账号还在”，很容易误判为“系统只是暂时不用它”。但 `disabled=true` 是写到磁盘上的，重启后也会继续生效。

### ❌ 只补充 access_token，不更新 refresh_token

`invalid_grant` 的触发点是刷新 `access_token` 时使用的 `refresh_token`。如果你只是临时拿到了一个还能用的 `access_token`，但 `refresh_token` 依旧失效，后续还是会再次触发禁用。

## 检查点 ✅

- [ ] 你能在日志里确认 `invalid_grant` 来自 refresh_token 刷新失败
- [ ] 你知道 `disabled` 和 `proxy_disabled` 的语义差异
- [ ] 你能通过重新添加账号（OAuth 或 refresh_token）恢复账号
- [ ] 你能验证恢复已经对运行中的 Proxy 生效

## 本课小结

- `invalid_grant` 触发时，Proxy 会把账号 **落盘为 disabled**，并从 token pool 移除，避免反复失败
- 恢复的关键是“显式更新 token”（重新 OAuth 或用新 refresh_token 再添加一次），系统会自动清掉 `disabled_*` 字段
- 数据目录中的账号 JSON 是最权威的状态来源（禁用/原因/时间都在里面）

## 下一课预告

> 下一课我们学习 **[401/鉴权失败：auth_mode、Header 兼容与客户端配置清单](../auth-401/)**。
>
> 你会学到：
> - 401 通常是“模式/Key/Header”哪一层不匹配
> - 不同客户端该带什么鉴权 Header
> - 如何用最短路径自检并修复

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 设计说明：invalid_grant 的问题与变更行为 | [`docs/proxy-invalid-grant.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy-invalid-grant.md#L1-L52) | 1-52 |
| 加载账号池时跳过 `disabled=true` | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L70-L158) | 70-158 |
| 刷新 token 失败时识别 `invalid_grant` 并禁用账号 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L840-L890) | 840-890 |
| 持久化写入 `disabled/disabled_at/disabled_reason` 并从内存移除 | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L942-L969) | 942-969 |
| `disabled_reason` 截断（避免账号文件膨胀） | [`src-tauri/src/proxy/token_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/token_manager.rs#L1464-L1471) | 1464-1471 |
| upsert 时自动清理 `disabled_*`（token 变化即视为用户已修复凭据） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L178-L206) | 178-206 |
| 重新添加账号后自动 reload proxy accounts（运行中立即生效） | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L21-L59) | 21-59 |

</details>
