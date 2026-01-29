---
title: "Copilot 额度: Premium Requests 查询 | opencode-mystatus"
sidebarTitle: "Copilot 额度"
subtitle: "GitHub Copilot 额度查询：Premium Requests 和模型明细"
description: "学习 GitHub Copilot 的 Premium Requests 使用情况。了解订阅类型月度限额、模型使用明细和超额使用次数，支持 OAuth Token 和 Fine-grained PAT 认证方式。"
tags:
  - "github-copilot"
  - "quota"
  - "premium-requests"
  - "pat-authentication"
prerequisite:
  - "start-quick-start"
order: 3
---

# GitHub Copilot 额度查询：Premium Requests 和模型明细

## 学完你能做什么

- 快速查看 GitHub Copilot 的 Premium Requests 月度使用情况
- 了解不同订阅类型（Free / Pro / Pro+ / Business / Enterprise）的限额差异
- 查看模型使用明细（如 GPT-4、Claude 等的使用次数）
- 识别超额使用次数，预估额外费用
- 解决新 OpenCode 集成的权限问题（OAuth Token 无法查询配额）

## 你现在的困境

::: info 新 OpenCode 集成的权限问题

OpenCode 的最新 OAuth 集成不再授予访问 `/copilot_internal/*` API 的权限，导致原有的 OAuth Token 方式无法查询配额。

你可能遇到这样的错误：
```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
...
```

这是正常的，本教程将教你如何解决。

:::

## 核心思路

GitHub Copilot 的配额分为以下几个核心概念：

### Premium Requests（主要配额）

Premium Requests 是 Copilot 的主要配额指标，包含：
- Chat 交互（与 AI 助手对话）
- Code Completion（代码补全）
- Copilot Workspace 功能（工作空间协作）

::: tip 什么是 Premium Requests？

简单理解：每次 Copilot 帮你"干活"（生成代码、回答问题、分析代码）都算一次 Premium Request。这是 Copilot 的主要计费单位。

:::

### 订阅类型与限额

不同订阅类型有不同的月度限额：

| 订阅类型    | 月度限额 | 适用人群               |
| ----------- | -------- | ---------------------- |
| Free        | 50 次    | 个人开发者试用         |
| Pro         | 300 次   | 个人开发者正式版       |
| Pro+        | 1,500 次 | 重度个人开发者         |
| Business    | 300 次   | 团队订阅（每账号 300） |
| Enterprise  | 1,000 次 | 企业级订阅（每账号 1000）|

### 超额使用

如果你超过了月度限额，Copilot 仍然可以使用，但会产生额外费用。超额使用次数会在输出中单独显示。

## 🎒 开始前的准备

### 前置条件

::: warning 配置检查

本教程假设你已经：

1. ✅ **安装了 opencode-mystatus 插件**
   - 参见 [快速开始](../../start/quick-start/)

2. ✅ **至少配置了以下之一**：
   - OpenCode 中登录了 GitHub Copilot（OAuth Token）
   - 手动创建了 Fine-grained PAT 配置文件（推荐）

:::

### 配置方法（二选一）

#### 方法 1：使用 Fine-grained PAT（推荐）

这是最可靠的方式，不受 OpenCode OAuth 集成变更影响。

1. 访问 https://github.com/settings/tokens?type=beta
2. 点击 "Generate new token (classic)" 或 "Generate new token (beta)"
3. 在 "Account permissions" 中，将 **Plan** 设为 **Read-only**
4. 生成 Token，格式类似 `github_pat_11A...`
5. 创建配置文件 `~/.config/opencode/copilot-quota-token.json`：

```json
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

**配置文件字段说明**：
- `token`: 你的 Fine-grained PAT
- `username`: GitHub 用户名（用于 API 调用）
- `tier`: 订阅类型，可选值：`free` / `pro` / `pro+` / `business` / `enterprise`

#### 方法 2：使用 OpenCode OAuth Token

如果你在 OpenCode 中已经登录了 GitHub Copilot，mystatus 会尝试使用你的 OAuth Token。

::: warning 兼容性说明

此方式可能因为 OpenCode OAuth 集成的权限限制而失败。如果失败，请使用方法 1（Fine-grained PAT）。

:::

## 跟我做

### 第 1 步：执行查询命令

在 OpenCode 中执行斜杠命令：

```bash
/mystatus
```

**你应该看到**：

如果配置了 Copilot 账号（使用 Fine-grained PAT 或 OAuth Token），输出会包含类似以下内容：

```
## GitHub Copilot 账号额度

Account:        GitHub Copilot (pro)

Premium Requests [████████░░░░░░░░░] 40% (180/300)

模型使用明细:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests

Period: 2026-01
```

### 第 2 步：解读输出结果

输出包含以下关键信息：

#### 1. 账户信息

```
Account:        GitHub Copilot (pro)
```

显示你的 Copilot 订阅类型（pro / free / business 等）。

#### 2. Premium Requests 配额

```
Premium Requests [████████░░░░░░░░░] 40% (180/300)
```

- **进度条**：直观显示剩余比例
- **百分比**：剩余 40%
- **已用/总量**：已用 180 次，总量 300 次

::: tip 进度条说明

绿色/黄色填充表示已用量，空心表示剩余量。填充越多，说明使用量越大。

:::

#### 3. 模型使用明细（仅 Public API）

```
模型使用明细:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests
```

显示各模型的使用次数，按使用量降序排列（最多显示前 5 个）。

::: info 为什么我的输出没有模型明细？

模型明细仅在 Public API（Fine-grained PAT）方式下显示。如果你使用 OAuth Token（Internal API），不会显示模型明细。

:::

#### 4. 超额使用（如有）

如果你超过了月度限额，会显示：

```
超额使用: 25 次请求
```

超额使用会产生额外费用，具体费率请参考 GitHub Copilot 定价。

#### 5. 重置时间（仅 Internal API）

```
配额重置: 12d 5h (2026-02-01)
```

显示距离配额重置的倒计时。

### 第 3 步：检查常见情况

#### 情况 1：看到 "⚠️ 配额查询暂时不可用"

这是正常情况，说明 OpenCode 的 OAuth Token 没有访问配额 API 的权限。

**解决方案**：按照「方法 1：使用 Fine-grained PAT」配置 PAT。

#### 情况 2：进度条全空或接近满

- **全空** `░░░░░░░░░░░░░░░`：已用完配额，会显示超额使用次数
- **接近满** `██████████████████`：即将用完，注意控制使用频率

#### 情况 3：显示 "Unlimited"

某些 Enterprise 订阅可能显示 "Unlimited"，表示不限量。

### 第 4 步：处理错误（如果查询失败）

如果看到以下错误：

```
GitHub Copilot API 请求失败 (403): Resource not accessible by integration
```

**原因**：OAuth Token 没有足够的权限访问 Copilot API。

**解决方案**：使用 Fine-grained PAT 方式（见方法 1）。

---

## 检查点 ✅

完成以上步骤后，你应该能够：

- [ ] 在 `/mystatus` 输出中看到 GitHub Copilot 额度信息
- [ ] 读懂 Premium Requests 的进度条和百分比
- [ ] 了解自己的订阅类型和月度限额
- [ ] 知道如何查看模型使用明细（如果使用 Fine-grained PAT）
- [ ] 明白超额使用意味着什么

## 踩坑提醒

### 坑 1：OAuth Token 无法查询配额（最常见）

::: danger 常见错误

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。
```

**原因**：OpenCode 的 OAuth 集成没有授予 `/copilot_internal/*` API 的访问权限。

**解决**：使用 Fine-grained PAT 方式，见「方法 1：使用 Fine-grained PAT」。

:::

### 坑 2：配置文件格式错误

如果配置文件 `~/.config/opencode/copilot-quota-token.json` 格式错误，查询会失败。

**错误示例**：

```json
// ❌ 错误：缺少 username 字段
{
  "token": "github_pat_11A...",
  "tier": "pro"
}
```

**正确示例**：

```json
// ✅ 正确：包含所有必需字段
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

### 坑 3：订阅类型填错

如果你填写的 `tier` 与实际订阅不符，限额计算会错误。

| 你的实际订阅 | tier 字段应填           | 错误填写示例 |
| ------------ | ----------------------- | ------------ |
| Free         | `free`                  | `pro` ❌     |
| Pro          | `pro`                   | `free` ❌    |
| Pro+         | `pro+`                  | `pro` ❌     |
| Business     | `business`              | `enterprise` ❌ |
| Enterprise   | `enterprise`            | `business` ❌ |

**如何查看你的实际订阅类型**：
- 访问 https://github.com/settings/billing
- 查看 "GitHub Copilot" 部分

### 坑 4：Token 权限不足

如果你使用的是 Classic Token（非 Fine-grained），没有 "Plan" 读权限，会返回 403 错误。

**解决**：
1. 确保使用 Fine-grained Token（在 beta 版本页面生成）
2. 确保授予了 "Account permissions → Plan → Read-only"

### 坑 5：模型明细不显示

::: tip 正常现象

如果你使用 OAuth Token（Internal API）方式，不会显示模型使用明细。

这是因为 Internal API 不返回模型级别的使用统计。如果需要模型明细，请使用 Fine-grained PAT 方式。

:::

## 本课小结

本课程讲解了如何使用 opencode-mystatus 查询 GitHub Copilot 的配额：

**关键要点**：

1. **Premium Requests** 是 Copilot 的主要配额指标，包含 Chat、Completion、Workspace 等功能
2. **订阅类型**决定了月度限额：Free 50 次、Pro 300 次、Pro+ 1,500 次、Business 300 次、Enterprise 1,000 次
3. **超额使用**会产生额外费用，会在输出中单独显示
4. **Fine-grained PAT** 是推荐的认证方式，不受 OpenCode OAuth 集成变更影响
5. **OAuth Token** 方式可能因为权限限制而失败，需要使用 PAT 作为替代方案

**输出解读**：
- 进度条：直观显示剩余比例
- 百分比：具体剩余量
- 已用/总量：详细使用情况
- 模型明细（可选）：各模型的使用次数
- 重置时间（可选）：距离下次重置的倒计时

## 下一课预告

> 下一课我们学习 **[Copilot 认证配置](../../advanced/copilot-auth/)**。
>
> 你会学到：
> - OAuth Token 和 Fine-grained PAT 的详细对比
> - 如何生成 Fine-grained PAT（完整步骤）
> - 如何解决权限问题的多种方案
> - 不同场景下的最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能             | 文件路径                                                                                      | 行号    |
| ---------------- | --------------------------------------------------------------------------------------------- | ------- |
| Copilot 配额查询 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
| Fine-grained PAT 读取 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 122-151 |
| Public Billing API 查询 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 157-177 |
| Internal API 查询 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 242-304 |
| Token 交换逻辑   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 183-208 |
| Internal API 格式化 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 354-393 |
| Public API 格式化 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 410-468 |
| Copilot 订阅类型定义 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 57-58  |
| CopilotQuotaConfig 类型定义 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 66-73  |
| CopilotAuthData 类型定义 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 46-51  |
| Copilot 订阅限额常量 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 397-403 |

**关键常量**：

- `COPILOT_PLAN_LIMITS`：各订阅类型的月度限额（第 397-403 行）
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

- `COPILOT_QUOTA_CONFIG_PATH`：Fine-grained PAT 配置文件路径（第 93-98 行）
  - `~/.config/opencode/copilot-quota-token.json`

**关键函数**：

- `queryCopilotUsage()`：主查询函数，支持两种认证策略（第 481-524 行）
- `fetchPublicBillingUsage()`：使用 Fine-grained PAT 查询 Public Billing API（第 157-177 行）
- `fetchCopilotUsage()`：使用 OAuth Token 查询 Internal API（第 242-304 行）
- `exchangeForCopilotToken()`：OAuth Token 交换逻辑（第 183-208 行）
- `formatPublicBillingUsage()`：Public API 响应格式化，包含模型明细（第 410-468 行）
- `formatCopilotUsage()`：Internal API 响应格式化（第 354-393 行）

**认证策略**：

1. **策略 1（优先）**：使用 Fine-grained PAT + Public Billing API
   - 优点：稳定，不受 OpenCode OAuth 集成变更影响
   - 缺点：需要用户手动配置 PAT

2. **策略 2（降级）**：使用 OAuth Token + Internal API
   - 优点：无需额外配置
   - 缺点：可能因权限限制而失败（当前 OpenCode 集成不支持）

**API 端点**：

- Public Billing API：`https://api.github.com/users/{username}/settings/billing/premium_request/usage`
- Internal Quota API：`https://api.github.com/copilot_internal/user`
- Token Exchange API：`https://api.github.com/copilot_internal/v2/token`

</details>
