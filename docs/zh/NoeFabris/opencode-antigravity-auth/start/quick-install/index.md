---
title: "快速安装: 5 分钟完成插件配置 | Antigravity Auth"
sidebarTitle: "5 分钟跑起来"
subtitle: "Antigravity Auth 快速安装：5 分钟完成插件配置"
description: "学习 Antigravity Auth 插件的快速安装。教你两种安装方式（AI 辅助/手动）、配置模型定义、Google OAuth 认证并验证成功。"
tags:
  - "快速开始"
  - "安装指南"
  - "OAuth"
  - "插件配置"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity Auth 快速安装：5 分钟完成插件配置

Antigravity Auth 快速安装让你在 5 分钟内完成 OpenCode 插件配置，开始使用 Claude 和 Gemini 3 高级模型。本教程提供两种安装方式（AI 辅助/手动配置），涵盖插件安装、OAuth 认证、模型定义和验证步骤，确保你能快速上手。

## 学完你能做什么

- ✅ 在 5 分钟内完成 Antigravity Auth 插件安装
- ✅ 配置 Claude 和 Gemini 3 模型的访问权限
- ✅ 执行 Google OAuth 认证并验证安装成功

## 你现在的困境

想试试 Antigravity Auth 的强大功能（Claude Opus 4.5、Sonnet 4.5、Gemini 3 Pro/Flash），但不知道怎么安装插件、配置模型，担心一步走错就卡住。

## 什么时候用这一招

- 第一次使用 Antigravity Auth 插件时
- 在新机器上安装 OpenCode 时
- 需要重新配置插件时

## 🎒 开始前的准备

::: warning 前置检查

在开始之前，请确认：
- [ ] 已安装 OpenCode CLI（`opencode` 命令可用）
- [ ] 有可用的 Google 账户（用于 OAuth 认证）
- [ ] 已了解 Antigravity Auth 的基本概念（阅读 [什么是 Antigravity Auth？](/zh/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/)）

:::

## 核心思路

Antigravity Auth 的安装流程分为 4 步：

1. **安装插件** → 在 OpenCode 配置中启用插件
2. **OAuth 认证** → 使用 Google 账户登录
3. **配置模型** → 添加 Claude/Gemini 模型定义
4. **验证安装** → 发起第一个请求测试

**重要提示**：配置文件路径在不同系统上都是 `~/.config/opencode/opencode.json`（Windows 的 `~` 会自动解析为用户目录，如 `C:\Users\YourName`）。

## 跟我做

### 第 1 步：选择安装方式

Antigravity Auth 提供两种安装方式，任选其一即可。

::: tip 推荐方式

如果你使用 LLM Agent（如 Claude Code、Cursor、OpenCode），**推荐使用 AI 辅助安装**，更快捷省心。

:::

**方式一：AI 辅助安装（推荐）**

直接复制以下提示词粘贴给任何 LLM Agent：

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**AI 会自动完成**：
- 编辑 `~/.config/opencode/opencode.json`
- 添加插件配置
- 添加完整的模型定义
- 执行 `opencode auth login` 进行认证

**你应该看到**：AI 输出"插件安装成功"或类似提示。

**方式二：手动安装**

如果偏好手动控制，按以下步骤操作：

**第 1.1 步：添加插件到配置文件**

编辑 `~/.config/opencode/opencode.json`（如果文件不存在则创建）：

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Beta 版本**：如果想体验最新功能，使用 `opencode-antigravity-auth@beta` 替代 `@latest`。

**你应该看到**：配置文件包含 `plugin` 字段且值为数组。

---

### 第 2 步：执行 Google OAuth 认证

在终端运行：

```bash
opencode auth login
```

**系统会自动**：
1. 启动本地 OAuth 服务器（监听 `localhost:51121`）
2. 打开浏览器跳转到 Google 授权页面
3. 接收 OAuth 回调并交换令牌
4. 自动获取 Google Cloud 项目 ID

**你需要做**：
1. 在浏览器中点击"允许"授权访问
2. 如果是 WSL 或 Docker 环境，可能需要手动复制回调 URL

**你应该看到**：

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip 多账户支持

需要添加更多账户以提升配额？再次运行 `opencode auth login` 即可。插件支持最多 10 个账户，并自动轮换负载均衡。

:::

---

### 第 3 步：配置模型定义

复制以下完整配置并追加到 `~/.config/opencode/opencode.json`（注意不要覆盖已有的 `plugin` 字段）：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info 模型分类

- **Antigravity 配额**（Claude + Gemini 3）：`antigravity-gemini-*`、`antigravity-claude-*`
- **Gemini CLI 配额**（独立）：`gemini-2.5-*`、`gemini-3-*-preview`

更多模型配置细节，参考 [可用模型完整列表](/zh/NoeFabris/opencode-antigravity-auth/platforms/available-models/)。

:::

**你应该看到**：配置文件包含完整的 `provider.google.models` 定义，且 JSON 格式有效（无语法错误）。

---

### 第 4 步：验证安装

运行以下命令测试插件是否正常工作：

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**你应该看到**：

```
正在使用: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: 你好！我是 Claude Sonnet 4.5 Thinking。
```

::: tip 检查点 ✅

如果看到 AI 正常回复，恭喜你！Antigravity Auth 插件已成功安装并配置完成。

:::

---

## 踩坑提醒

### 问题 1：OAuth 认证失败

**症状**：运行 `opencode auth login` 后出现错误提示，如 `invalid_grant` 或授权页面无法打开。

**原因**：Google 账户密码更改、安全事件、或回调 URL 不完整。

**解决方案**：
1. 检查浏览器是否正确打开 Google 授权页面
2. 如果是 WSL/Docker 环境，手动复制终端中显示的回调 URL 到浏览器
3. 删除 `~/.config/opencode/antigravity-accounts.json` 后重新认证

### 问题 2：模型未找到（400 错误）

**症状**：运行请求时返回 `400 Unknown name 'xxx'`。

**原因**：模型名称拼写错误或配置文件格式问题。

**解决方案**：
1. 检查 `--model` 参数是否与配置文件中的 key 完全一致（区分大小写）
2. 验证 `opencode.json` 是否为有效的 JSON（使用 `cat ~/.config/opencode/opencode.json | jq` 检查）
3. 确认 `provider.google.models` 字段下有对应的模型定义

### 问题 3：配置文件路径错误

**症状**：提示"配置文件不存在"或修改无效。

**原因**：在不同系统上使用了错误的路径。

**解决方案**：所有系统统一使用 `~/.config/opencode/opencode.json`，包括 Windows（`~` 自动解析为用户目录）。

| 系统 | 正确路径 | 错误路径 |
|--- | --- | ---|
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\YourName\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## 本课小结

本课我们完成了：
1. ✅ 两种安装方式（AI 辅助 / 手动配置）
2. ✅ Google OAuth 认证流程
3. ✅ 完整的模型配置（Claude + Gemini 3）
4. ✅ 安装验证和常见问题排查

**关键要点**：
- 配置文件统一路径：`~/.config/opencode/opencode.json`
- OAuth 认证自动获取 Project ID，无需手动配置
- 支持多账户，提升配额上限
- 使用 `variant` 参数控制 Thinking 模型的思考深度

## 下一课预告

> 下一课我们学习 **[首次认证：深入理解 OAuth 2.0 PKCE 流程](/zh/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**。
>
> 你会学到：
> - OAuth 2.0 PKCE 的工作原理
> - 令牌刷新机制
> - Project ID 自动解析过程
> - 账户存储格式

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能                | 文件路径                                                                                       | 行号    |
|--- | --- | ---|
| OAuth 授权 URL 生成 | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113  |
| PKCE 密钥对生成    | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2)   | 1-2     |
| 令牌交换            | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Project ID 自动获取  | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| 用户信息获取        | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**关键常量**：
- `ANTIGRAVITY_CLIENT_ID`：OAuth 客户端 ID（用于 Google 认证）
- `ANTIGRAVITY_REDIRECT_URI`：OAuth 回调地址（固定为 `http://localhost:51121/oauth-callback`）
- `ANTIGRAVITY_SCOPES`：OAuth 权限范围列表

**关键函数**：
- `authorizeAntigravity()`：构建 OAuth 授权 URL，包含 PKCE challenge
- `exchangeAntigravity()`：交换授权码获取访问令牌和刷新令牌
- `fetchProjectID()`：自动解析 Google Cloud 项目 ID
- `encodeState()` / `decodeState()`：编码/解码 OAuth state 参数（包含 PKCE verifier）

</details>
