---
title: "添加账号: OAuth 与 Refresh Token 双通道 | Antigravity Tools"
sidebarTitle: "加你的 Google 号"
subtitle: "添加账号：OAuth/Refresh Token 双通道与最佳实践"
description: "学习 Antigravity Tools 添加账号的两种方式。通过 OAuth 一键授权或 Refresh Token 手动添加，支持批量导入，处理回调失败并验证账号池。"
tags:
  - "账号管理"
  - "OAuth"
  - "refresh_token"
  - "Google"
  - "最佳实践"
prerequisite:
  - "start-getting-started"
duration: 15
order: 4
---

# 添加账号：OAuth/Refresh Token 双通道与最佳实践

在 Antigravity Tools 里，“添加账号”就是把 Google 账号的 `refresh_token` 写进本地账号池，让后续反代请求可以轮换使用。你可以走 OAuth 一键授权，也可以直接粘贴 `refresh_token` 手动添加。

## 学完你能做什么

- 用 OAuth 或 Refresh Token，把 Google 账号加进 Antigravity Tools 的账号池
- 复制/手动打开授权链接，并在回调成功后自动完成添加
- 遇到拿不到 `refresh_token`、回调连不上 `localhost` 这类问题时，知道应该怎么处理

## 你现在的困境

- 点了“OAuth 授权”却一直转圈，或者浏览器提示 `localhost refused to connect`
- 授权成功了，但提示“未获取到 Refresh Token”
- 你手里只有 `refresh_token`，不知道怎么一次性批量导入

## 什么时候用这一招

- 你想用最稳的方式把账号加进来（优先 OAuth）
- 你更在意可迁移/可备份（Refresh Token 更适合做“账号池资产”）
- 你要加很多号，想批量导入 `refresh_token`（支持从文本/JSON 里提取）

## 🎒 开始前的准备

- 你已经安装并能打开 Antigravity Tools 桌面端
- 你知道入口在哪：左侧导航进入 `Accounts` 页面（路由见 `source/lbjlaq/Antigravity-Manager/src/App.tsx`）

::: info 这节课里的两个关键词
**OAuth**：一种"跳到浏览器登录并授权"的流程。Antigravity Tools 会在本地临时起一个回调地址（`http://localhost/127.0.0.1/[::1]:<port>/oauth-callback`，根据系统 IPv4/IPv6 监听情况自动选择），等浏览器带着 `code` 回来后再换取 token。（实现见 `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs`）

**refresh_token**：一种"可以长期用来刷新 access_token 的凭据"。本项目添加账号时会用它先换取 access_token，再去 Google 拉取真实邮箱，并忽略你在前端输入的 email。（实现见 `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs`）
:::

## 核心思路

Antigravity Tools 的“添加账号”，最终都是为了拿到一份可用的 `refresh_token`，并把账号信息写入本地账号池。

- **OAuth 通道**：应用帮你生成授权链接并监听本地回调；授权完成后自动换取 token 并保存账号（见 `prepare_oauth_url`、`start_oauth_login`、`complete_oauth_login`）
- **Refresh Token 通道**：你直接把 `refresh_token` 粘贴进来，应用会用它刷新 access_token，并向 Google 获取真实邮箱来落盘（见 `add_account`）

## 跟我做

### 第 1 步：打开“添加账号”弹窗

**为什么**
所有添加入口都在 `Accounts` 页面统一收口。

操作：进入 `Accounts` 页面，点右侧的 **Add Account** 按钮（组件：`AddAccountDialog`）。

**你应该看到**：弹出一个包含 3 个标签页的弹窗：`OAuth` / `Refresh Token` / `Import`（见 `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx`）。

### 第 2 步：优先用 OAuth 一键授权（推荐）

**为什么**
这是产品默认推荐路径：让应用自己生成授权链接、自动打开浏览器，并在回调回来后自动完成保存。

1. 切到 `OAuth` 标签页。
2. 先复制授权链接：弹窗打开后会自动调用 `prepare_oauth_url` 预生成 URL（前端调用见 `AddAccountDialog.tsx:111-125`；后端生成与监听见 `oauth_server.rs`）。
3. 点 **Start OAuth**（对应前端 `startOAuthLogin()` / 后端 `start_oauth_login`），让应用打开默认浏览器并开始等待回调。

**你应该看到**：
- 弹窗里出现一条可复制的授权链接（事件名：`oauth-url-generated`）
- 浏览器打开 Google 授权页；授权后会跳转到一个本地地址，并显示“Authorization Successful!”（`oauth_success_html()`）

### 第 3 步：OAuth 没自动完成时，用“完成 OAuth”手动收尾

**为什么**
OAuth 流程分两段：浏览器授权得到 `code`，再由应用用 `code` 换 token。就算你没点“Start OAuth”，只要你手动打开了授权链接并完成回调，弹窗也会尝试自动收尾；如果没收尾成功，你可以手动点一次。

1. 如果你是“把链接复制到自己的浏览器里打开”（而不是默认浏览器），授权回调回来后，应用会收到 `oauth-callback-received` 事件，并自动调用 `completeOAuthLogin()`（见 `source/lbjlaq/Antigravity-Manager/src/components/accounts/AddAccountDialog.tsx:67-109`）。
2. 如果你没看到自动完成，点击弹窗里的 **Finish OAuth**（对应后端 `complete_oauth_login`）。

**你应该看到**：弹窗提示成功并自动关闭；`Accounts` 列表出现新账号。

::: tip 小技巧：遇到回调连不上优先复制链接
后端会尽量同时监听 IPv6 `::1` 与 IPv4 `127.0.0.1`，并根据监听情况选择 `localhost/127.0.0.1/[::1]` 作为回调地址，主要是为了规避“浏览器把 localhost 解析到 IPv6”导致的连接失败。（见 `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`）
:::

### 第 4 步：用 Refresh Token 手动添加（支持批量）

**为什么**
当你拿不到 `refresh_token`（或者你更偏向“可迁移资产”）时，直接用 Refresh Token 添加更可控。

1. 切到 `Refresh Token` 标签页。
2. 把 `refresh_token` 粘贴到文本框。

支持的输入形式（前端会解析并批量添加）：

| 输入类型 | 例子 | 解析逻辑 |
|--- | --- | ---|
| 纯 token 文本 | `1//abc...` | 正则提取：`/1\/\/[a-zA-Z0-9_\-]+/g`（见 `AddAccountDialog.tsx:213-220`） |
| 夹在一大段文本里 | 日志/导出文本里包含多个 `1//...` | 正则批量提取并去重（见 `AddAccountDialog.tsx:213-224`） |
| JSON 数组 | `[{"refresh_token":"1//..."}]` | 解析数组并取 `item.refresh_token`（见 `AddAccountDialog.tsx:198-207`） |

点 **Confirm** 后，弹窗会按 token 数量逐个调用 `onAdd("", token)`（见 `AddAccountDialog.tsx:231-248`），最终落到后端 `add_account`。

**你应该看到**：
- 弹窗显示批量进度（例如 `1/5`）
- 成功后 `Accounts` 列表出现新账号

### 第 5 步：确认“账号池已可用”

**为什么**
添加成功不等于“马上能稳定用”。后端会在添加后自动触发一次“刷新配额”，并在 Proxy 运行时尝试 reload token pool，让变更立刻生效。

你可以用下面 2 个信号确认：

1. 账号出现在列表里，并显示邮箱（邮箱来自后端 `get_user_info`，不是你输入的 email）。
2. 账号配额/订阅信息开始刷新（后端会自动调用 `internal_refresh_account_quota`）。

**你应该看到**：添加后不需要手动点刷新，账号会开始出现配额信息（是否成功以界面实际展示为准）。

## 检查点 ✅

- 账号列表里能看到新增账号的邮箱
- 没有停留在“loading”状态超过你能接受的时间（OAuth 回调完成后应该很快收尾）
- 如果你正在运行 Proxy，新增账号能很快参与调度（后端会尝试 reload）

## 踩坑提醒

### 1) OAuth 提示“未获取到 Refresh Token”

后端在 `start_oauth_login/complete_oauth_login` 会显式检查 `refresh_token` 是否存在；如果不存在，会返回一段带解决方案的错误信息（见 `source/lbjlaq/Antigravity-Manager/src-tauri/src/commands/mod.rs:45-56`）。

按源码提示的处理方式：

1. 打开 `https://myaccount.google.com/permissions`
2. 撤销 **Antigravity Tools** 的访问权限
3. 回到应用重新走 OAuth

> 你也可以直接改走本课的 Refresh Token 通道。

### 2) 浏览器提示 `localhost refused to connect`

OAuth 回调需要浏览器请求本地回调地址。为降低失败率，后端会：

- 尝试同时监听 `127.0.0.1` 与 `::1`
- 两者都可用时才使用 `localhost`，否则强制用 `127.0.0.1` 或 `[::1]`

对应实现见 `source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/oauth_server.rs:53-113`。

### 3) 切换到别的标签页会取消 OAuth 准备

当弹窗从 `OAuth` 切到其他 tab 时，前端会调用 `cancelOAuthLogin()` 并清空 URL（见 `AddAccountDialog.tsx:127-136`）。

如果你正在授权过程中，别急着切 tab。

### 4) Refresh Token 的正确/错误示例

| 例子 | 是否会被识别 | 原因 |
|--- | --- | ---|
| `1//0gAbC...` | ✓ | 符合 `1//` 前缀规则（见 `AddAccountDialog.tsx:215-219`） |
| `ya29.a0...` | ✗ | 不符合前端提取规则，会被当成无效输入 |

## 本课小结

- OAuth：适合“快”，也支持复制链接到你常用浏览器并自动/手动收尾
- Refresh Token：适合“稳”和“可迁移”，并支持从文本/JSON 批量提取 `1//...`
- 拿不到 `refresh_token` 时，按错误提示撤销授权后重做，或直接改走 Refresh Token

## 下一课预告

下一课我们做一件更踏实的事：把账号池变成“可迁移资产”。

> 去学 **[账号备份与迁移：导入/导出、V1/DB 热迁移](../backup-migrate/)**。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Accounts 页面挂载添加弹窗 | [`src/pages/Accounts.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Accounts.tsx#L267-L731) | 267-731 |
| OAuth URL 预生成 + 回调事件自动收尾 | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L49-L125) | 49-125 |
| OAuth 回调事件触发 `completeOAuthLogin()` | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L67-L109) | 67-109 |
| Refresh Token 批量解析与去重 | [`src/components/accounts/AddAccountDialog.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/accounts/AddAccountDialog.tsx#L185-L268) | 185-268 |
| 前端调用 Tauri commands（add/OAuth/cancel） | [`src/services/accountService.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/services/accountService.ts#L5-L91) | 5-91 |
| 后端 add_account：忽略 email、用 refresh_token 获取真实邮箱并落盘 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L19-L60) | 19-60 |
| 后端 OAuth：检查 refresh_token 缺失并给出撤销授权方案 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L38-L79) | 38-79 |
| OAuth 回调 server：同时监听 IPv4/IPv6 并选择 redirect_uri | [`src-tauri/src/modules/oauth_server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/oauth_server.rs#L43-L113) | 43-113 |
|--- | --- | ---|

**关键事件名**：
- `oauth-url-generated`：后端生成 OAuth URL 后发给前端（见 `oauth_server.rs:250-252`）
- `oauth-callback-received`：后端收到回调并解析到 code 后通知前端（见 `oauth_server.rs:177-180` / `oauth_server.rs:232-235`）

**关键命令**：
- `prepare_oauth_url`：预生成授权链接并启动回调监听（见 `src-tauri/src/commands/mod.rs:469-473`）
- `start_oauth_login`：打开默认浏览器并等待回调（见 `src-tauri/src/commands/mod.rs:339-401`）
- `complete_oauth_login`：不打开浏览器，只等待回调并完成换 token（见 `src-tauri/src/commands/mod.rs:405-467`）
- `add_account`：用 refresh_token 落盘账号（见 `src-tauri/src/commands/mod.rs:19-60`）

</details>
