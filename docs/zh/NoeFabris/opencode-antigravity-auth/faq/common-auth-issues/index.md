---
title: "OAuth 认证排查: 常见问题解决 | Antigravity Auth"
sidebarTitle: "OAuth 认证失败怎么办"
subtitle: "OAuth 认证排查: 常见问题解决"
description: "学习 Antigravity Auth 插件的 OAuth 认证问题排查方法。涵盖 Safari 回调失败、403 错误、速率限制、WSL2/Docker 环境配置等常见故障解决方案。"
tags:
  - FAQ
  - 故障排查
  - OAuth
  - 认证
prerequisite:
  - start-first-auth-login
  - start-quick-install
order: 1
---

# 常见认证问题排查

学完这课，你能自己解决 OAuth 认证失败、令牌刷新错误、权限被拒等常见问题，快速恢复插件正常使用。

## 你现在的困境

你刚装好 Antigravity Auth 插件，正准备用 Claude 或 Gemini 3 模型干活，结果：

- 运行 `opencode auth login` 后，浏览器授权成功，但终端提示「授权失败」
- 使用一段时间后突然报错「Permission Denied」或「invalid_grant」
- 所有账户都显示「速率限制」，明明配额还够
- WSL2 或 Docker 环境下无法完成 OAuth 认证
- Safari 浏览器 OAuth 回调总是失败

这些问题都很常见，大多数情况下不需要重装或联系支持，跟着本文一步步排查就能解决。

## 什么时候用这一招

当你遇到以下情况时，参考本教程：
- **OAuth 认证失败**：`opencode auth login` 无法完成
- **令牌失效**：invalid_grant、Permission Denied 错误
- **速率限制**：429 错误、「所有账户限速」
- **环境问题**：WSL2、Docker、远程开发环境
- **插件冲突**：与 oh-my-opencode 或其他插件不兼容

::: tip 快速重置
遇到认证问题，**90% 的情况**可以通过删除账户文件重新认证解决：
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```
:::

---

## 快速诊断流程

遇到问题时，按以下顺序快速定位：

1. **检查配置路径** → 确认文件位置正确
2. **删除账户文件重新认证** → 解决 most 认证问题
3. **查看错误信息** → 根据具体错误类型查找解决方案
4. **检查网络环境** → WSL2/Docker 需要额外配置

---

## 核心概念：OAuth 认证和令牌管理

在解决问题前，先理解几个关键概念。

::: info 什么是 OAuth 2.0 PKCE 认证？

Antigravity Auth 使用 **OAuth 2.0 with PKCE**（Proof Key for Code Exchange）认证机制：

1. **授权码**：你授权后，Google 返回一个临时授权码
2. **令牌交换**：插件用授权码换取 `access_token`（用于 API 调用）和 `refresh_token`（用于刷新）
3. **自动刷新**：`access_token` 过期前 30 分钟，插件自动用 `refresh_token` 刷新
4. **令牌存储**：所有令牌存储在本地 `~/.config/opencode/antigravity-accounts.json`，不会上传到任何服务器

**安全性**：PKCE 机制防止授权码被拦截，即使令牌泄露，攻击者也无法重新授权。

:::

::: info 什么是速率限制（Rate Limit）？

Google 对每个 Google 账户的 API 调用有频率限制。当触发限制时：

- **429 Too Many Requests**：请求过于频繁，需要等待
- **403 Permission Denied**：可能被软禁或触发滥用检测
- **请求挂起**：200 OK 但没有响应，通常表示被静默限流

**多账户的优势**：通过轮换多个账户，可以绕过单个账户的限制，最大化总体配额。

:::

---

## 配置路径说明

所有平台（包括 Windows）都使用 `~/.config/opencode/` 作为配置目录：

| 文件 | 路径 | 说明 |
|--- | --- | ---|
| 主配置 | `~/.config/opencode/opencode.json` | OpenCode 主配置文件 |
| 账户文件 | `~/.config/opencode/antigravity-accounts.json` | OAuth 令牌和账户信息 |
| 插件配置 | `~/.config/opencode/antigravity.json` | 插件特定配置 |
| 调试日志 | `~/.config/opencode/antigravity-logs/` | 调试日志文件 |

> **Windows 用户注意**：`~` 会自动解析为你的用户目录（如 `C:\Users\YourName`）。不要使用 `%APPDATA%`。

---

## OAuth 认证问题

### Safari OAuth 回调失败（macOS）

**症状**：
- 浏览器授权成功后，终端提示「fail to authorize」
- Safari 显示「Safari 无法打开页面」或「连接被拒绝」

**原因**：Safari 的「HTTPS-Only 模式」阻止了 `http://localhost` 回调地址。

**解决方案**：

**方案 1：使用其他浏览器（最简单）**

1. 运行 `opencode auth login`
2. 复制终端显示的 OAuth URL
3. 粘贴到 Chrome 或 Firefox 中打开
4. 完成授权

**方案 2：临时禁用 HTTPS-Only 模式**

1. Safari → 设置（⌘,）→ 隐私
2. 取消勾选「启用 HTTPS-Only 模式」
3. 运行 `opencode auth login`
4. 认证完成后重新启用 HTTPS-Only 模式

**方案 3：手动提取回调（高级）**

Safari 显示错误时，地址栏包含 `?code=...&scope=...`，可以手动提取回调参数。详见 [issue #119](https://github.com/NoeFabris/opencode-antigravity-auth/issues/119)。

### 端口已被占用

**错误信息**：`Address already in use`

**原因**：OAuth 回调服务器默认使用 `localhost:51121`，如果端口被占用则无法启动。

**解决方案**：

**macOS / Linux：**
```bash
# 查找占用端口的进程
lsof -i :51121

# 杀死进程（替换 <PID> 为实际进程 ID）
kill -9 <PID>

# 重新认证
opencode auth login
```

**Windows：**
```powershell
# 查找占用端口的进程
netstat -ano | findstr :51121

# 杀死进程（替换 <PID> 为实际进程 ID）
taskkill /PID <PID> /F

# 重新认证
opencode auth login
```

### WSL2 / Docker / 远程开发环境

**问题**：OAuth 回调需要浏览器能访问运行 OpenCode 的 `localhost`，但在容器或远程环境中无法直接访问。

**WSL2 解决方案**：
- 使用 VS Code 的端口转发
- 或配置 Windows → WSL 端口转发

**SSH / 远程开发解决方案**：
```bash
# 建立 SSH 隧道，将远程的 51121 端口转发到本地
ssh -L 51121:localhost:51121 user@remote-host
```

**Docker / 容器解决方案**：
- 容器内无法使用 localhost 回调
- 等待 30 秒后使用手动 URL 流程
- 或使用 SSH 端口转发

### 多账户认证问题

**症状**：多个账户认证失败或混淆。

**解决方案**：
1. 删除账户文件：`rm ~/.config/opencode/antigravity-accounts.json`
2. 重新认证：`opencode auth login`
3. 确保每个账户使用不同的 Google 邮箱

---

## 令牌刷新问题

### invalid_grant 错误

**错误信息**：
```
Error: invalid_grant
Token has been revoked or expired.
```

**原因**：
- Google 账户密码更改
- 账户发生安全事件（如可疑登录）
- `refresh_token` 失效

**解决方案**：
```bash
# 删除账户文件
rm ~/.config/opencode/antigravity-accounts.json

# 重新认证
opencode auth login
```

### 令牌过期

**症状**：一段时间未使用后，再次调用模型时报错。

**原因**：`access_token` 有效期约 1 小时，`refresh_token` 有效期更长但也会过期。

**解决方案**：
- 插件会在令牌过期前 30 分钟自动刷新，无需手动操作
- 如果自动刷新失败，重新认证：`opencode auth login`

---

## 权限错误

### 403 Permission Denied（rising-fact-p41fc）

**错误信息**：
```
Permission 'cloudaicompanion.companions.generateChat' denied on resource
'//cloudaicompanion.googleapis.com/projects/rising-fact-p41fc/locations/global'
```

**原因**：插件在没有找到有效项目时，会回退到默认的 Project ID（如 `rising-fact-p41fc`）。这适用于 Antigravity 模型，但对 Gemini CLI 模型会失败，因为 Gemini CLI 需要你自己账户中的 GCP 项目。

**解决方案**：

**第 1 步：创建或选择 GCP 项目**

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建一个新项目或选择现有项目
3. 记下项目 ID（如 `my-gemini-project`）

**第 2 步：启用 Gemini for Google Cloud API**

1. 在 Google Cloud Console 中，进入「API 和服务」→「库」
2. 搜索「Gemini for Google Cloud API」（`cloudaicompanion.googleapis.com`）
3. 点击「启用」

**第 3 步：在账户文件中添加 projectId**

编辑 `~/.config/opencode/antigravity-accounts.json`：

```json
{
  "version": 3,
  "accounts": [
    {
      "email": "your@gmail.com",
      "refreshToken": "...",
      "projectId": "my-gemini-project"
    }
  ]
}
```

::: warning 多账户配置
如果配置了多个 Google 账户，每个账户都需要添加对应的 `projectId`。
:::

---

## 速率限制问题

### 所有账户限速（但配额可用）

**症状**：
- 提示「All accounts rate-limited」
- 配额看起来还够用，但无法发起新请求
- 新添加的账户立即被限速

**原因**：这是插件在 hybrid 模式下的一个级联 bug（`clearExpiredRateLimits()`），已在最近的 beta 版本中修复。

**解决方案**：

**方案 1：更新到最新 beta 版本**
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**方案 2：删除账户文件重新认证**
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**方案 3：切换账户选择策略**
编辑 `~/.config/opencode/antigravity.json`，将策略改为 `sticky`：
```json
{
  "account_selection_strategy": "sticky"
}
```

### 429 Too Many Requests

**症状**：
- 请求频繁返回 429 错误
- 提示「Rate limit exceeded」

**原因**：Google 已显著收紧配额和速率限制 enforcement。所有用户都会受影响，不只是本插件。关键因素：

1. **更严格的 enforcement**：即使配额「看起来可用」，Google 也可能对触发滥用检测的账户进行节流或软禁
2. **OpenCode 的请求模式**：OpenCode 比原生应用发起更多 API 调用（工具调用、重试、流式传输、多轮对话链），这比「正常」使用更快触发限制
3. **Shadow bans**：某些账户一旦被标记，会长时间无法使用，而其他账户继续正常工作

::: danger 使用风险
使用此插件可能会增加触发自动滥用/速率限制保护的机会。上游提供商可自行决定限制、暂停或终止访问。**使用风险自负**。
:::

**解决方案**：

**方案 1：等待重置（最可靠）**

速率限制通常在几小时后重置。如果问题持续：
- 停止使用受影响的账户 24-48 小时
- 期间使用其他账户
- 检查账户文件中的 `rateLimitResetTimes` 查看限制何时过期

**方案 2：在 Antigravity IDE 中「热身」账户（社区经验）**

用户报告这种方法有效：
1. 在浏览器中直接打开 [Antigravity IDE](https://idx.google.com/)
2. 用受影响的 Google 账户登录
3. 运行几个简单的提示（如「你好」、「2+2 等于几」）
4. 5-10 次成功提示后，尝试再次使用账户与插件

**原理**：通过「官方」界面使用账户可能会重置一些内部标志，或让账户看起来不那么可疑。

**方案 3：减少请求量和突发性**

- 使用更短的会话
- 避免并行/重试密集型工作流（如同时生成多个子代理）
- 如果使用 oh-my-opencode，考虑减少并发代理生成数
- 设置 `max_rate_limit_wait_seconds: 0` 以快速失败而不是重试

**方案 4：直接使用 Antigravity IDE（单账户用户）**

如果你只有一个账户，直接使用 [Antigravity IDE](https://idx.google.com/) 可能会有更好的体验，因为 OpenCode 的请求模式会更快触发限制。

**方案 5：新账户设置**

如果添加新账户：
1. 删除账户文件：`rm ~/.config/opencode/antigravity-accounts.json`
2. 重新认证：`opencode auth login`
3. 更新到最新 beta：`"plugin": ["opencode-antigravity-auth@beta"]`
4. 考虑先在 Antigravity IDE 中「热身」账户

**需要报告的信息**：

如果你遇到异常的速率限制行为，请在 [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues) 中分享：
- 调试日志中的状态码（403、429 等）
- 速率限制状态持续的时间
- 账户数量和使用的选择策略

### 请求挂起（无响应）

**症状**：
- 提示一直挂起，没有返回
- 日志显示 200 OK，但没有响应内容

**原因**：通常是 Google 的静默限流或软禁。

**解决方案**：
1. 停止当前请求（Ctrl+C 或 ESC）
2. 等待 24-48 小时后再使用该账户
3. 在期间使用其他账户

---

## 会话恢复问题

### 工具执行中断后报错

**症状**：工具执行时按 ESC 中断，后续对话报错 `tool_result_missing`。

**解决方案**：
1. 在对话中输入 `continue` 触发自动恢复
2. 如果被阻塞，使用 `/undo` 回退到错误前的状态
3. 重试操作

::: tip 自动恢复
插件会话恢复功能默认启用。如果工具执行中断，它会自动注入 synthetic `tool_result` 并尝试恢复。
:::

---

## 插件兼容性问题

### 与 oh-my-opencode 冲突

**问题**：oh-my-opencode 内置 Google 认证，与本插件冲突。

**解决方案**：在 `~/.config/opencode/oh-my-opencode.json` 中禁用内置认证：
```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**并行代理问题**：生成并行子代理时，多个进程可能命中同一个账户。**解决方法**：
- 启用 `pid_offset_enabled: true`（在 `antigravity.json` 中配置）
- 或添加更多账户

### 与 @tarquinen/opencode-dcp 冲突

**问题**：DCP 创建缺少思考块的 synthetic assistant 消息，与本插件冲突。

**解决方案**：**将本插件列在 DCP 之前**：
```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

### 其他 gemini-auth 插件

**问题**：安装了其他 Google Gemini 认证插件，导致冲突。

**解决方案**：你不需要它们。本插件已经处理了所有 Google OAuth 认证。卸载其他 gemini-auth 插件。

---

## 配置问题

### 配置键拼写错误

**错误信息**：`Unrecognized key: "plugins"`

**原因**：使用了错误的键名。

**解决方案**：正确的键是 `plugin`（单数）：
```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**不是** `"plugins"`（复数），这会导致「Unrecognized key」错误。

### 模型未找到

**症状**：使用模型时报错「Model not found」或 400 错误。

**解决方案**：在 `google` provider 配置中添加：
```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

---

## 迁移问题

### 机器间迁移账户

**问题**：将 `antigravity-accounts.json` 复制到新机器后，提示「API key missing」。

**解决方案**：
1. 确保插件已安装：`"plugin": ["opencode-antigravity-auth@beta"]`
2. 复制 `~/.config/opencode/antigravity-accounts.json` 到新机器的相同路径
3. 如果仍然报错，`refresh_token` 可能已失效 → 重新认证：`opencode auth login`

---

## 调试技巧

### 启用调试日志

**基本日志**：
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

**详细日志**（完整请求/响应）：
```bash
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode
```

日志文件位置：`~/.config/opencode/antigravity-logs/`

### 查看速率限制状态

查看账户文件中的 `rateLimitResetTimes` 字段：
```bash
cat ~/.config/opencode/antigravity-accounts.json | grep rateLimitResetTimes
```

---

## 检查点 ✅

完成排查后，你应该能：
- [ ] 正确理解配置文件路径（`~/.config/opencode/`）
- [ ] 解决 Safari OAuth 回调失败问题
- [ ] 处理 invalid_grant 和 403 错误
- [ ] 理解速率限制的原因和应对策略
- [ ] 解决与 oh-my-opencode 的冲突
- [ ] 启用调试日志定位问题

---

## 踩坑提醒

### 不要提交账户文件到版本控制

`antigravity-accounts.json` 包含 OAuth refresh tokens，等同于密码文件。插件会自动创建 `.gitignore`，但请确保你的 `.gitignore` 包含：
```
~/.config/opencode/antigravity-accounts.json
```

### 避免频繁重试

触发 429 限制后，不要反复重试。等待一段时间再试，否则可能被标记为滥用。

### 多账户设置时注意 projectId

如果使用 Gemini CLI 模型，**每个账户**都需要配置自己的 `projectId`。不要使用同一个 project ID。

---

## 本课小结

本课涵盖了 Antigravity Auth 插件最常见的认证和账户问题：

1. **OAuth 认证问题**：Safari 回调失败、端口占用、WSL2/Docker 环境
2. **令牌刷新问题**：invalid_grant、令牌过期
3. **权限错误**：403 Permission Denied、缺失 projectId
4. **速率限制问题**：429 错误、Shadow bans、所有账户限速
5. **插件兼容性**：oh-my-opencode、DCP 冲突
6. **配置问题**：拼写错误、模型未找到

遇到问题时，先尝试**快速重置**（删除账户文件重新认证），90% 的情况下能解决。如果问题持续，启用调试日志查看详细信息。

---

## 下一课预告

> 下一课我们学习 **[模型未找到错误排查](../model-not-found/)**。
>
> 你会学到：
> - Gemini 3 模型的 400 错误（Unknown name 'parameters'）
> - Tool Schema 不兼容问题
> - MCP 服务器导致错误的诊断方法
> - 如何通过调试定位问题源头

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| OAuth 认证（PKCE） | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts) | 91-270 |
| 令牌验证与刷新 | [`src/plugin/auth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/auth.ts) | 1-53 |
| 账户存储与管理 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-715 |
| 速率限制检测 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 9-75 |
| 会话恢复 | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 1-150 |
| 调试日志系统 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 1-300 |

**关键常量**：
- `OAUTH_PORT = 51121`：OAuth 回调服务器端口（`constants.ts:25`）
- `CLIENT_ID`：OAuth 客户端 ID（`constants.ts:4`）
- `TOKEN_EXPIRY_BUFFER = 30 * 60 * 1000`：令牌过期前 30 分钟刷新（`auth.ts:33`）

**关键函数**：
- `authorizeAntigravity()`：启动 OAuth 认证流程（`oauth.ts:91`）
- `exchangeAntigravity()`：交换授权码获取令牌（`oauth.ts:209`）
- `refreshAccessToken()`：刷新过期的访问令牌（`oauth.ts:263`）
- `isOAuthAuth()`：检查是否为 OAuth 认证类型（`auth.ts:5`）
- `accessTokenExpired()`：检查令牌是否即将过期（`auth.ts:33`）
- `markRateLimitedWithReason()`：标记账户为限速状态（`accounts.ts:9`）
- `detectErrorType()`：检测可恢复的错误类型（`recovery/index.ts`）

</details>
