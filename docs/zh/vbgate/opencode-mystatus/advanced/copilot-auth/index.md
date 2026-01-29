---
title: "Copilot 认证: 配置认证方式 | opencode-mystatus"
sidebarTitle: "认证配置"
subtitle: "Copilot 认证: 配置认证方式"
description: "学习 Copilot 认证配置，解决 OAuth 权限问题，创建 Fine-grained PAT 并设置订阅类型。"
tags:
  - "GitHub Copilot"
  - "OAuth 认证"
  - "PAT 配置"
  - "权限问题"
prerequisite:
  - "start-quick-start"
  - "platforms-copilot-usage"
order: 2
---

# Copilot 认证配置：OAuth Token 和 Fine-grained PAT

## 学完你能做什么

- 理解 Copilot 的两种认证方式：OAuth Token 和 Fine-grained PAT
- 解决 OAuth Token 权限不足的问题
- 创建 Fine-grained PAT 并配置订阅类型
- 顺利查询 Copilot Premium Requests 额度

## 你现在的困境

执行 `/mystatus` 查询 Copilot 额度时，你可能会看到这样的错误提示：

```
⚠️ GitHub Copilot 配额查询暂时不可用。
OpenCode 的新 OAuth 集成不支持访问配额 API。

解决方案:
1. 创建一个 fine-grained PAT (访问 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中将 'Plan' 设为 'Read-only'
3. 创建配置文件 ~/.config/opencode/copilot-quota-token.json:
   {"token": "github_pat_xxx...", "username": "你的用户名"}
```

你不知道：
- 什么是 OAuth Token？什么是 Fine-grained PAT？
- 为什么 OAuth 集成不支持访问配额 API？
- 如何创建 Fine-grained PAT？
- 订阅类型（free、pro、pro+ 等）怎么选？

这些问题卡住了你，导致无法查看 Copilot 额度。

## 什么时候用这一招

当你：
- 看到提示"OpenCode 的新 OAuth 集成不支持访问配额 API"
- 想使用更稳定的 Fine-grained PAT 方式查询额度
- 需要为团队或企业账号配置 Copilot 额度查询

## 核心思路

mystatus 支持**两种 Copilot 认证方式**：

| 认证方式 | 说明 | 优点 | 缺点 |
|---------|------|------|------|
| **OAuth Token**（默认） | 使用 OpenCode 登录时获取的 GitHub OAuth Token | 无需额外配置，开箱即用 | 新版 OpenCode 的 OAuth Token 可能没有 Copilot 权限 |
| **Fine-grained PAT**（推荐） | 用户手动创建的 Fine-grained Personal Access Token | 稳定可靠，不依赖 OAuth 权限 | 需要手动创建一次 |

**优先级规则**：
1. mystatus 优先使用 Fine-grained PAT（如果配置了）
2. 如果没有配置 PAT，才回退到 OAuth Token

::: tip 推荐做法
如果你的 OAuth Token 有权限问题，创建一个 Fine-grained PAT 是最稳定的解决方案。
:::

### 两种方式的区别

**OAuth Token**：
- 存储位置：`~/.local/share/opencode/auth.json`
- 获取方式：在 OpenCode 中登录 GitHub 时自动获取
- 权限问题：新版的 OpenCode 使用不同的 OAuth 客户端，可能不授予 Copilot 相关权限

**Fine-grained PAT**：
- 存储位置：`~/.config/opencode/copilot-quota-token.json`
- 获取方式：在 GitHub Developer Settings 中手动创建
- 权限要求：需要勾选 "Plan"（订阅信息）的 read 权限

## 跟我做

### 第 1 步：检查是否已配置 Fine-grained PAT

在终端中执行以下命令，检查配置文件是否存在：

::: code-group

```bash [macOS/Linux]
ls -la ~/.config/opencode/copilot-quota-token.json
```

```powershell [Windows]
Test-Path "$env:APPDATA\opencode\copilot-quota-token.json"
```

:::

**你应该看到**：
- 如果文件存在，说明已经配置了 Fine-grained PAT
- 如果文件不存在或提示错误，需要创建一个

### 第 2 步：创建 Fine-grained PAT（如果未配置）

如果上一步检查文件不存在，按以下步骤创建：

#### 2.1 访问 GitHub PAT 创建页面

在浏览器中访问：
```
https://github.com/settings/tokens?type=beta
```

这是 GitHub 的 Fine-grained PAT 创建页面。

#### 2.2 创建新的 Fine-grained PAT

点击 **Generate new token (classic)** 或 **Generate new token (beta)**，推荐使用 Fine-grained（beta）。

**配置参数**：

| 字段 | 值 |
|------|-----|
| **Name** | `mystatus-copilot`（或任何你喜欢的名称） |
| **Expiration** | 选择过期时间（如 90 days 或 No expiration） |
| **Resource owner** | 不需要选择（默认） |

**权限配置**（重要！）：

在 **Account permissions** 部分，勾选：
- ✅ **Plan** → 选择 **Read**（这个权限是查询额度必需的）

::: warning 重要提示
只勾选 "Plan" 的 Read 权限即可，不要勾选其他不必要的权限，以保护账户安全。
:::

**你应该看到**：
- 勾选了 "Plan: Read"
- 没有勾选其他权限（保持最小权限原则）

#### 2.3 生成并保存 Token

点击页面底部的 **Generate token** 按钮。

**你应该看到**：
- 页面显示新生成的 Token（类似 `github_pat_xxxxxxxxxxxx`）
- ⚠️ **立即复制这个 Token**，页面刷新后就看不到了

### 第 3 步：获取 GitHub 用户名

在浏览器中访问你的 GitHub 首页：
```
https://github.com/
```

**你应该看到**：
- 右上角或左上角显示你的用户名（如 `john-doe`）

记录下这个用户名，配置时需要用到。

### 第 4 步：确定 Copilot 订阅类型

你需要知道自己的 Copilot 订阅类型，因为不同类型的月度配额不同：

| 订阅类型 | 月度配额 | 适用场景 |
|---------|---------|---------|
| `free` | 50 | Copilot Free（免费用户） |
| `pro` | 300 | Copilot Pro（个人专业版） |
| `pro+` | 1500 | Copilot Pro+（个人增强版） |
| `business` | 300 | Copilot Business（团队商业版） |
| `enterprise` | 1000 | Copilot Enterprise（企业版） |

::: tip 如何确定订阅类型？
1. 访问 [GitHub Copilot 订阅页面](https://github.com/settings/copilot)
2. 查看当前显示的订阅计划
3. 对照上表选择对应的类型
:::

### 第 5 步：创建配置文件

根据你的操作系统，创建配置文件并填入信息。

::: code-group

```bash [macOS/Linux]
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/copilot-quota-token.json << 'EOF'
{
  "token": "你的_PAT_Token",
  "username": "你的_GitHub_用户名",
  "tier": "订阅类型"
}
EOF
```

```powershell [Windows]
# 创建目录（如果不存在）
New-Item -ItemType Directory -Force -Path "$env:APPDATA\opencode" | Out-Null

# 创建配置文件
@"
{
  "token": "你的_PAT_Token",
  "username": "你的_GitHub_用户名",
  "tier": "订阅类型"
}
"@ | Out-File -FilePath "$env:APPDATA\opencode\copilot-quota-token.json" -Encoding utf8
```

:::

**配置示例**：

假设你的 PAT 是 `github_pat_abc123`，用户名是 `johndoe`，订阅类型是 `pro`：

```json
{
  "token": "github_pat_abc123",
  "username": "johndoe",
  "tier": "pro"
}
```

::: danger 安全提醒
- 不要将 Token 提交到 Git 仓库或分享给他人
- Token 是访问你 GitHub 账户的凭证，泄露可能导致安全问题
:::

### 第 6 步：验证配置

在 OpenCode 中执行 `/mystatus` 命令。

**你应该看到**：
- Copilot 部分正常显示额度信息
- 不再出现权限错误提示
- 显示类似这样的内容：

```
## GitHub Copilot Account Quota

Account:        GitHub Copilot (@johndoe)

Premium requests
████████████████████░░░░░░░ 70% (90/300)

Period: 2026-01
```

## 检查点 ✅

验证一下你理解了：

| 场景 | 你应该看到/做 |
|------|--------------|
| 配置文件已存在 | `ls ~/.config/opencode/copilot-quota-token.json` 显示文件 |
| PAT 创建成功 | Token 以 `github_pat_` 开头 |
| 订阅类型正确 | 配置中的 `tier` 值是 free/pro/pro+/business/enterprise 之一 |
| 验证成功 | 执行 `/mystatus` 后看到 Copilot 额度信息 |

## 踩坑提醒

### ❌ 错误操作：忘记勾选 "Plan: Read" 权限

**错误现象**：执行 `/mystatus` 时看到 API 错误（403 或 401）

**原因**：创建 PAT 时没有勾选必要的权限。

**正确做法**：
1. 删除旧的 Token（在 GitHub Settings 中）
2. 重新创建，确保勾选 **Plan: Read**
3. 更新配置文件中的 `token` 字段

### ❌ 错误操作：订阅类型填错

**错误现象**：额度显示不正确（如 Free 用户显示 300 次额度）

**原因**：`tier` 字段填错了（如填了 `pro` 但实际是 `free`）。

**正确做法**：
1. 访问 GitHub Copilot 设置页面确认订阅类型
2. 修改配置文件中的 `tier` 字段

### ❌ 错误操作：Token 过期

**错误现象**：执行 `/mystatus` 时看到 401 错误

**原因**：Fine-grained PAT 设置了过期时间，已经失效。

**正确做法**：
1. 访问 GitHub Settings → Tokens 页面
2. 找到已过期的 Token，删除它
3. 创建新的 Token，更新配置文件

### ❌ 错误操作：用户名大小写错误

**错误现象**：看到 404 或用户不存在错误

**原因**：GitHub 用户名是区分大小写的（如 `Johndoe` 和 `johndoe` 是不同的用户）。

**正确做法**：
1. 复制 GitHub 首页显示的用户名（完全一致）
2. 不要手动输入，避免大小写错误

::: tip 小窍门
如果遇到 404 错误，直接从 GitHub URL 中复制用户名，例如访问 `https://github.com/YourName`，URL 中的 `YourName` 就是你的用户名。
:::

## 本课小结

mystatus 支持两种 Copilot 认证方式：

1. **OAuth Token**（默认）：自动获取，但可能有权限问题
2. **Fine-grained PAT**（推荐）：手动配置，稳定可靠

推荐配置 Fine-grained PAT 的步骤：
1. 在 GitHub Settings 创建 Fine-grained PAT
2. 勾选 "Plan: Read" 权限
3. 记录 GitHub 用户名和订阅类型
4. 创建 `~/.config/opencode/copilot-quota-token.json` 配置文件
5. 验证配置成功

配置完成后，mystatus 会优先使用 PAT 查询 Copilot 额度，避免 OAuth 权限问题。

## 下一课预告

> 下一课我们学习 **[多语言支持：中文和英文自动切换](../i18n-setup/)**。
>
> 你会学到：
> - 语言检测机制（Intl API、环境变量）
> - 如何手动切换语言
> - 中英文对照表

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能                        | 文件路径                                                                                   | 行号    |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------- |
| Copilot 认证策略入口        | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L481-L524) | 481-524 |
| 读取 Fine-grained PAT 配置  | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L122-L151) | 122-151 |
| 公共 Billing API 调用       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L157-L177) | 157-177 |
| OAuth Token 交换           | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L183-L208) | 183-208 |
| 内部 API 调用（OAuth）     | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L242-L304) | 242-304 |
| 格式化公共 Billing API 输出 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L410-L468) | 410-468 |
| CopilotAuthData 类型定义    | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L46-L51)    | 46-51   |
| CopilotQuotaConfig 类型定义 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L66-L73)    | 66-73   |
| CopilotTier 枚举定义       | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L57)        | 57      |
| Copilot 订阅类型配额       | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L397-L403) | 397-403 |

**关键常量**：
- `COPILOT_QUOTA_CONFIG_PATH = "~/.config/opencode/copilot-quota-token.json"`：Fine-grained PAT 配置文件路径
- `COPILOT_PLAN_LIMITS`：各订阅类型的月度配额限制（第 397-403 行）

**关键函数**：
- `queryCopilotUsage(authData)`：查询 Copilot 额度的主函数，包含两种认证策略
- `readQuotaConfig()`：读取 Fine-grained PAT 配置文件
- `fetchPublicBillingUsage(config)`：调用 GitHub 公共 Billing API（使用 PAT）
- `fetchCopilotUsage(authData)`：调用 GitHub 内部 API（使用 OAuth Token）
- `exchangeForCopilotToken(oauthToken)`：交换 OAuth Token 为 Copilot Session Token
- `formatPublicBillingUsage(data, tier)`：格式化公共 Billing API 的响应
- `formatCopilotUsage(data)`：格式化内部 API 的响应

**认证流程对比**：

| 策略 | Token 类型 | API 端点 | 优先级 |
|------|-----------|---------|--------|
| Fine-grained PAT | Fine-grained PAT | `/users/{username}/settings/billing/premium_request/usage` | 1（优先） |
| OAuth Token（缓存） | Copilot Session Token | `/copilot_internal/user` | 2 |
| OAuth Token（直接） | GitHub OAuth Token | `/copilot_internal/user` | 3 |
| OAuth Token（交换） | Copilot Session Token（交换后） | `/copilot_internal/v2/token` | 4 |

</details>
