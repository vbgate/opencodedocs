---
title: "常见问题: 查询错误排查 | opencode-mystatus"
sidebarTitle: "故障排查"
subtitle: "常见问题：无法查询额度、Token 过期、权限问题"
description: "学习 opencode-mystatus 的故障排查方法。解决 Token 过期、权限不足、API 请求失败等常见错误，涵盖 OpenAI、智谱 AI、GitHub Copilot 和 Google Cloud 的具体解决方案。"
tags:
  - "故障排除"
  - "常见问题"
  - "Token 过期"
  - "权限问题"
prerequisite:
  - "start-quick-start"
order: 1
---

# 常见问题：无法查询额度、Token 过期、权限问题

使用 opencode-mystatus 插件时，你可能会遇到各种错误：无法读取认证文件、OAuth Token 过期、GitHub Copilot 权限不足、API 请求失败等。这些常见问题通常可以通过简单的配置或重新授权解决。本教程整理了所有常见错误的排查步骤，帮你快速定位问题根源。

## 学完你能做什么

- 快速定位 mystatus 查询失败的原因
- 解决 OpenAI Token 过期问题
- 配置 GitHub Copilot 的 Fine-grained PAT
- 处理 Google Cloud 缺少 project_id 的情况
- 应对各种 API 请求失败和超时问题

## 你现在的困境

你执行 `/mystatus` 查询额度，但看到了各种错误信息，不知道该从哪里开始排查。

## 什么时候用这一招

- **看到任何错误提示时**：本教程涵盖了所有常见错误
- **刚配置新账号时**：验证配置是否正确
- **额度查询突然失败时**：可能是 Token 过期或权限变化

::: tip 排错原则

遇到错误时，先看错误信息的关键词，再对应到本教程的解决方案。大部分错误都有明确的提示信息。

:::

## 核心思路

mystatus 工具的错误处理机制分为三层：

1. **读取认证文件层**：检查 `auth.json` 是否存在、格式是否正确
2. **平台查询层**：每个平台独立查询，失败不影响其他平台
3. **API 请求层**：网络请求可能超时或返回错误，但工具会继续尝试其他平台

这意味着：
- 一个平台失败，其他平台仍会正常显示
- 错误信息会明确指出是哪个平台出问题
- 大部分错误都可以通过配置或重新授权解决

## 问题排查清单

### 问题 1：无法读取认证文件

**错误信息**：

```
❌ 无法读取认证文件: ~/.local/share/opencode/auth.json
错误: ENOENT: no such file or directory
```

**原因**：
- OpenCode 的认证文件不存在
- 还没有配置任何平台的账号

**解决方法**：

1. **确认 OpenCode 已安装并配置**
   - 确认你已经在 OpenCode 中配置过至少一个平台（OpenAI、智谱 AI 等）
   - 如果没有，请先在 OpenCode 中完成授权

2. **检查文件路径**
   - OpenCode 的认证文件应该在 `~/.local/share/opencode/auth.json`
   - 如果你使用的是自定义配置目录，确认文件路径是否正确

3. **验证文件格式**
   - 确认 `auth.json` 是有效的 JSON 文件
   - 文件内容应该至少包含一个平台的认证信息

**你应该看到**：
重新执行 `/mystatus` 后，能看到至少一个平台的额度信息。

---

### 问题 2：未找到任何已配置的账号

**错误信息**：

```
未找到任何已配置的账号。

支持的账号类型:
- OpenAI (Plus/Team/Pro 订阅用户)
- 智谱 AI (Coding Plan)
- Z.ai (Coding Plan)
- Google Cloud (Antigravity)
```

**原因**：
- `auth.json` 存在，但里面没有任何有效的配置
- 已有的配置格式不正确（比如缺少必要字段）

**解决方法**：

1. **检查 auth.json 内容**
   打开 `~/.local/share/opencode/auth.json`，确认至少有一个平台配置：

   ```json
   {
     "openai": {
       "type": "oauth",
       "access": "eyJ...",
       "expires": 1738000000000
     }
   }
   ```

2. **配置至少一个平台**
   - 在 OpenCode 中完成 OAuth 授权
   - 或手动添加平台的 API Key（智谱 AI、Z.ai）

3. **参考配置格式**
   各平台的配置要求：
   - OpenAI：必须有 `type: "oauth"` 和 `access` token
   - 智谱 AI / Z.ai：必须有 `type: "api"` 和 `key`
   - GitHub Copilot：必须有 `type: "oauth"` 和 `refresh` token
   - Google Cloud：不依赖 `auth.json`，需要单独配置（见问题 6）

---

### 问题 3：OpenAI OAuth Token 过期

**错误信息**：

```
⚠️ OAuth 授权已过期，请在 OpenCode 中使用一次 OpenAI 模型以刷新授权。
```

**原因**：
- OpenAI 的 OAuth Token 有效期有限，过期后无法查询额度
- Token 的过期时间存储在 `auth.json` 的 `expires` 字段中

**解决方法**：

1. **在 OpenCode 中使用一次 OpenAI 模型**
   - 向 ChatGPT 或 Codex 提一个问题
   - OpenCode 会自动刷新 Token 并更新 `auth.json`

2. **确认 Token 已更新**
   - 查看 `auth.json` 中的 `expires` 字段
   - 确认它是一个未来的时间戳

3. **重新执行 /mystatus**
   - 现在应该能正常查询 OpenAI 额度了

**为什么需要重新使用模型**：
OpenAI 的 OAuth Token 有过期机制，使用模型时会触发 Token 刷新。这是 OpenCode 官方认证流程的安全特性。

---

### 问题 4：API 请求失败（通用）

**错误信息**：

```
OpenAI API 请求失败 (401): Unauthorized
智谱 API 请求失败 (403): Forbidden
Google API 请求失败 (500): Internal Server Error
```

**原因**：
- Token 或 API Key 无效
- 网络连接问题
- API 服务暂时不可用
- 权限不足（某些平台要求特定权限）

**解决方法**：

1. **检查 Token 或 API Key**
   - OpenAI：确认 `access` token 未过期（见问题 3）
   - 智谱 AI / Z.ai：确认 `key` 正确，没有多余空格
   - GitHub Copilot：确认 `refresh` token 有效

2. **检查网络连接**
   - 确认网络正常
   - 某些平台可能有地域限制（比如 Google Cloud）

3. **尝试重新授权**
   - 在 OpenCode 中重新进行 OAuth 授权
   - 或手动更新 API Key

4. **查看具体的 HTTP 状态码**
   - `401` / `403`：权限问题，通常是 Token 或 API Key 无效
   - `500` / `503`：服务端错误，通常是 API 暂时不可用，稍后重试
   - `429`：请求过于频繁，需要等待一段时间

---

### 问题 5：请求超时

**错误信息**：

```
请求超时 (10秒)
```

**原因**：
- 网络连接缓慢
- API 响应时间过长
- 防火墙或代理阻止请求

**解决方法**：

1. **检查网络连接**
   - 确认网络稳定
   - 尝试访问该平台的网站，确认能正常访问

2. **检查代理设置**
   - 如果你使用代理，确认代理配置正确
   - 某些平台可能需要特殊的代理配置

3. **重试一次**
   - 有时只是临时的网络波动
   - 重试一次通常能解决问题

---

### 问题 6：GitHub Copilot 配额查询不可用

**错误信息**：

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
3. 创建配置文件并填写以下内容（包含必需的 `tier` 字段）：
   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的用户名",
     "tier": "pro"
   }
   ```

其他方法:
• 在 VS Code 中点击状态栏的 Copilot 图标查看配额
• 访问 https://github.com/settings/billing 查看使用情况
```

**原因**：
- OpenCode 的官方 OAuth 集成使用的是新的认证流程
- 新的 OAuth Token 没有 `copilot` 权限，无法调用内部配额 API
- 这是 OpenCode 官方的安全限制

**解决方法**（推荐）：

1. **创建 Fine-grained PAT**
   - 访问 https://github.com/settings/tokens?type=beta
   - 点击 "Generate new token" → "Fine-grained token"
   - 填写 Token 名称（如 "OpenCode Copilot Quota"）

2. **配置权限**
   - 在 "Account permissions" 中，找到 "Plan" 权限
   - 设置为 "Read-only"
   - 点击 "Generate token"

3. **创建配置文件**
   创建 `~/.config/opencode/copilot-quota-token.json`：

   ```json
   {
     "token": "github_pat_xxx...",
     "username": "你的 GitHub 用户名",
     "tier": "pro"
   }
   ```

   **tier 字段说明**：
   - `free`：Copilot Free（50 次/月）
   - `pro`：Copilot Pro（300 次/月）
   - `pro+`：Copilot Pro+（1500 次/月）
   - `business`：Copilot Business（300 次/月）
   - `enterprise`：Copilot Enterprise（1000 次/月）

4. **重新执行 /mystatus**
   - 现在应该能正常查询 GitHub Copilot 额度了

**替代方案**：

如果不想配置 PAT，可以：
- 在 VS Code 中点击状态栏的 Copilot 图标查看配额
- 访问 https://github.com/settings/billing 查看使用情况

---

### 问题 7：Google Cloud 缺少 project_id

**错误信息**：

```
⚠️ 缺少 project_id，无法查询额度。
```

**原因**：
- Google Cloud 账号配置中缺少 `projectId` 或 `managedProjectId`
- mystatus 需要项目 ID 来调用 Google Cloud API

**解决方法**：

1. **检查 antigravity-accounts.json**
   打开配置文件，确认账号配置包含 `projectId` 或 `managedProjectId`：

::: code-group

```bash [macOS/Linux]
~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
%APPDATA%\opencode\antigravity-accounts.json
```

:::

   ```json
   {
     "accounts": [
       {
         "email": "your-email@gmail.com",
         "refreshToken": "1//xxx",
         "projectId": "your-project-id",
         "addedAt": 1738000000000,
         "lastUsed": 1738000000000,
         "rateLimitResetTimes": {}
       }
     ]
   }
   ```

2. **如何获取 project_id**
   - 访问 https://console.cloud.google.com/
   - 选择你的项目
   - 在项目信息中找到 "项目 ID"（Project ID）
   - 将其复制到配置文件中

3. **如果没有 project_id**
   - 如果你使用的是托管项目，可能需要使用 `managedProjectId`
   - 联系你的 Google Cloud 管理员确认项目 ID

---

### 问题 8：智谱 AI / Z.ai API 返回无效数据

**错误信息**：

```
智谱 API 请求失败 (200): {"code": 401, "msg": "Invalid API key"}
Z.ai API 请求失败 (200): {"code": 400, "msg": "Bad request"}
```

**原因**：
- API Key 无效或格式错误
- API Key 已过期或被撤销
- 账号没有对应服务的权限

**解决方法**：

1. **确认 API Key 正确**
   - 登录智谱 AI 或 Z.ai 控制台
   - 检查你的 API Key 是否有效
   - 确认没有多余的空格或换行符

2. **检查 API Key 权限**
   - 智谱 AI：确认你有 "Coding Plan" 权限
   - Z.ai：确认你有 "Coding Plan" 权限

3. **重新生成 API Key**
   - 如果 API Key 有问题，可以在控制台中重新生成
   - 更新 `auth.json` 中的 `key` 字段

---

## 检查点 ✅

确认你能独立解决常见问题：

| 技能 | 检查方法 | 预期结果 |
|--- | --- | ---|
| 排查认证文件问题 | 检查 auth.json 是否存在且格式正确 | 文件存在，JSON 格式正确 |
| 刷新 OpenAI Token | 在 OpenCode 中使用一次 OpenAI 模型 | Token 已更新，能正常查询额度 |
| 配置 Copilot PAT | 创建 copilot-quota-token.json | 能正常查询 Copilot 额度 |
| 处理 API 错误 | 查看 HTTP 状态码并采取对应措施 | 知道 401/403/500 等错误码的含义 |
| 配置 Google project_id | 添加 projectId 到 antigravity-accounts.json | 能正常查询 Google Cloud 额度 |

## 本课小结

mystatus 的错误处理分为三层：认证文件读取、平台查询、API 请求。遇到错误时，先看错误信息的关键词，再对应到解决方案。最常见的问题包括：

1. **认证文件问题**：检查 `auth.json` 是否存在、格式是否正确
2. **Token 过期**：在 OpenCode 中使用一次对应模型刷新 Token
3. **API 错误**：根据 HTTP 状态码判断是权限问题还是服务端问题
4. **Copilot 特殊权限**：新 OAuth 集成需要配置 Fine-grained PAT
5. **Google 配置**：需要 project_id 才能查询额度

大部分错误都可以通过配置或重新授权解决，一个平台失败不会影响其他平台的查询。

## 下一课预告

> 下一课我们学习 **[安全与隐私：本地文件访问、API 脱敏、官方接口](/zh/vbgate/opencode-mystatus/faq/security/)**。
>
> 你会学到：
> - mystatus 如何保护你的敏感数据
> - API Key 自动脱敏的原理
> - 为什么插件是安全的本地工具
> - 数据不存储、不上传的保证

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 错误处理主逻辑 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 41-87 |
| 认证文件读取 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 38-46 |
| 未找到账号提示 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 78-80 |
| 结果收集和汇总 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |
| OpenAI Token 过期检查 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 216-221 |
| API 错误处理 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts) | 149-152 |
| Copilot PAT 读取 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Copilot OAuth 失败提示 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 298-303 |
| Google project_id 检查 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts) | 232-234 |
| 智谱 API 错误处理 | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 94-103 |
| 错误消息定义 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts) | 66-123 (中文), 144-201 (英文) |

**关键常量**：

- `HIGH_USAGE_THRESHOLD = 80`：高使用率警告阈值（`plugin/lib/types.ts:111`）

**关键函数**：

- `collectResult()`：收集查询结果到 results 和 errors 数组（`plugin/mystatus.ts:100-116`）
- `queryOpenAIUsage()`：查询 OpenAI 额度，包含 Token 过期检查（`plugin/lib/openai.ts:207-236`）
- `readQuotaConfig()`：读取 Copilot PAT 配置（`plugin/lib/copilot.ts:122-151`）
- `fetchAccountQuota()`：查询单个 Google Cloud 账号额度（`plugin/lib/google.ts:218-256`）
- `fetchUsage()`：查询智谱/Z.ai 使用情况（`plugin/lib/zhipu.ts:81-106`）

</details>
