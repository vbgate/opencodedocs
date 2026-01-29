---
title: "AI 模型与认证配置完全指南：多提供商、认证方式和故障排查 | Clawdbot 教程"
sidebarTitle: "配置你的 AI 账号"
subtitle: "AI 模型与认证配置"
description: "学习如何为 Clawdbot 配置 AI 模型提供商（Anthropic、OpenAI、OpenRouter、Ollama 等）和三种认证方式（API Key、OAuth、Token）。本教程涵盖认证文件管理、多账户轮换、OAuth Token 自动刷新、模型别名配置、故障切换和常见错误排查，包含实际配置示例和 CLI 命令，帮助您快速上手。"
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# AI 模型与认证配置

## 学完你能做什么

- 配置多个 AI 模型提供商（Anthropic、OpenAI、OpenRouter 等）
- 使用三种认证方式（API Key、OAuth、Token）
- 管理多账户认证和认证轮换
- 配置模型选择和备用模型
- 排查常见认证问题

## 你现在的困境

Clawdbot 支持数十种模型提供商，但配置起来可能让人困惑：

- 应该用 API Key 还是 OAuth？
- 不同的提供商认证方式有什么区别？
- 如何配置多个账户？
- OAuth token 如何自动刷新？

## 什么时候用这一招

- 首次安装后需要配置 AI 模型
- 添加新的模型提供商或备用账户
- 遇到认证错误或配额限制
- 需要配置模型切换和备用机制

## 🎒 开始前的准备

::: warning 前置条件
本教程假设你已完成 [快速开始](../../start/getting-started/)，已安装并启动了 Gateway。
:::

- 确保 Node ≥22 已安装
- Gateway 守护进程正在运行
- 准备好至少一个 AI 模型提供商的凭证（API Key 或订阅账户）

## 核心思路

### 模型配置与认证是分离的

在 Clawdbot 中，**模型选择**和**认证凭证**是两个独立的概念：

- **模型配置**：告诉 Clawdbot 使用哪个模型（如 `anthropic/claude-opus-4-5`），存储在 `~/.clawdbot/models.json`
- **认证配置**：提供访问模型的凭证（如 API Key 或 OAuth token），存储在 `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

::: info 为什么分离？
这种设计让你可以在多个提供商和账户之间灵活切换，而无需重复配置模型参数。
:::

### 三种认证方式

Clawdbot 支持三种认证方式，适用于不同场景：

| 认证方式 | 存储格式 | 典型场景 | 支持的提供商 |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | 快速开始、测试 | Anthropic、OpenAI、OpenRouter、DeepSeek 等 |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | 长期运行、自动刷新 | Anthropic (Claude Code CLI)、OpenAI (Codex)、Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | 静态 Bearer token | GitHub Copilot、某些自定义代理 |

### 支持的模型提供商

Clawdbot 内置支持以下模型提供商：

::: details 内置提供商清单
| 提供商 | 认证方式 | 推荐模型 | 备注 |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | 推荐 Claude Pro/Max + Opus 4.5 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | 支持标准 OpenAI 和 Codex 版本 |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | 聚合数百个模型 |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | 本地模型，无需 API Key |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | 中国友好 |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | 通义千问 OAuth |
| **Venice** | API Key | `venice/<model>` | 隐私优先 |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | AWS 托管模型 |
| **Antigravity** | API Key | `google-antigravity/<model>` | 模型代理服务 |
:::

::: tip 推荐组合
对于大多数用户，推荐配置 **Anthropic Opus 4.5** 作为主模型，**OpenAI GPT-5.2** 作为备用。Opus 在长上下文和安全性方面表现更好。
:::

## 跟我做

### 第 1 步：配置 Anthropic（推荐）

**为什么**
Anthropic Claude 是 Clawdbot 的推荐模型，特别是 Opus 4.5，它在长上下文处理和安全性方面表现优秀。

**选项 A：使用 Anthropic API Key（最快）**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**你应该看到**：
- Gateway 重新加载配置
- 默认模型设置为 `anthropic/claude-opus-4-5`
- 认证文件 `~/.clawdbot/agents/default/agent/auth-profiles.json` 创建

**选项 B：使用 OAuth（长期运行推荐）**

OAuth 适合长期运行的 Gateway，token 会自动刷新。

1. 生成 setup-token（需要在任意机器运行 Claude Code CLI）：
```bash
claude setup-token
```

2. 复制输出的 token

3. 在 Gateway 主机上运行：
```bash
clawdbot models auth paste-token --provider anthropic
# 粘贴 token
```

**你应该看到**：
- 提示 "Auth profile added: anthropic:claude-cli"
- 认证类型为 `oauth`（不是 `api_key`）

::: tip OAuth 优势
OAuth token 会自动刷新，无需手动更新。适合持续运行的 Gateway 守护进程。
:::

### 第 2 步：配置 OpenAI 作为备用

**为什么**
配置备用模型可以在主模型（如 Anthropic）遇到配额限制或错误时自动切换。

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

或者使用 OpenAI Codex OAuth：

```bash
clawdbot onboard --openai-codex
```

**你应该看到**：
- `~/.clawdbot/clawdbot.json` 中新增 OpenAI 提供商配置
- 认证文件中新增 `openai:default` 或 `openai-codex:codex-cli` 配置

### 第 3 步：配置模型选择和备用

**为什么**
配置模型选择策略，定义主模型、备用模型和别名。

编辑 `~/.clawdbot/clawdbot.json`：

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**字段说明**：
- `primary`：默认使用的模型
- `fallbacks`：按顺序尝试的备用模型（失败时自动切换）
- `alias`：模型别名（如 `/model opus` 等同于 `/model anthropic/claude-opus-4-5`）

**你应该看到**：
- 重启 Gateway 后，主模型变为 Opus 4.5
- 备用模型配置生效

### 第 4 步：添加 OpenRouter（可选）

**为什么**
OpenRouter 聚合了数百个模型，适合访问特殊模型或免费模型。

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

然后配置模型：

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**你应该看到**：
- 模型引用格式为 `openrouter/<provider>/<model>`
- 可以使用 `clawdbot models scan` 查看可用模型

### 第 5 步：配置 Ollama（本地模型）

**为什么**
Ollama 允许你在本地运行模型，无需 API Key，适合隐私敏感场景。

编辑 `~/.clawdbot/clawdbot.json`：

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**你应该看到**：
- Ollama 模型无需 API Key
- 需要确保 Ollama 服务在 `http://localhost:11434` 运行

### 第 6 步：验证配置

**为什么**
确保认证和模型配置正确，Gateway 可以正常调用 AI。

```bash
clawdbot doctor
```

**你应该看到**：
- 无认证错误
- 模型列表包含你配置的提供商
- 状态显示 "OK"

或者发送测试消息：

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**你应该看到**：
- AI 回复正常
- 无 "No credentials found" 错误

## 检查点 ✅

- [ ] 已配置至少一个模型提供商（Anthropic 或 OpenAI）
- [ ] 认证文件 `auth-profiles.json` 已创建
- [ ] 模型配置文件 `models.json` 已生成
- [ ] 可以通过 `/model <alias>` 切换模型
- [ ] Gateway 日志无认证错误
- [ ] 测试消息成功收到 AI 回复

## 踩坑提醒

### 认证模式不匹配

**问题**：OAuth 配置与认证模式不匹配

```yaml
# ❌ 错误：OAuth credentials 但模式是 token
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # 应该是 "oauth"
```

**修复**：

```yaml
# ✅ 正确
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot 会自动将 Claude Code CLI 导入的配置设置为 `mode: "oauth"`，无需手动修改。
:::

### OAuth Token 刷新失败

**问题**：看到 "OAuth token refresh failed for anthropic" 错误

**原因**：
- Claude Code CLI 凭证在另一台机器上失效
- OAuth token 过期

**修复**：
```bash
# 重新生成 setup-token
claude setup-token

# 重新粘贴
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"` 是静态 Bearer token，不会自动刷新。`type: "oauth"` 支持自动刷新。
:::

### 配额限制和故障切换

**问题**：主模型遇到配额限制（429 错误）

**现象**：
```
HTTP 429: rate_limit_error
```

**自动处理**：
- Clawdbot 会自动尝试 `fallbacks` 中的下一个模型
- 如果所有模型都失败，返回错误

**配置冷却期**（可选）：

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # 配额错误后 24 小时禁用该提供商
    failureWindowHours: 1      # 1 小时内的失败计入冷却
```

### 环境变量覆盖

**问题**：配置文件中使用了环境变量，但未设置

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # 未设置会报错
```

**修复**：
```bash
# 设置环境变量
export OPENAI_KEY="sk-..."

# 或在 .zshrc/.bashrc 中添加
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## 高级配置

### 多账户和认证轮换

**为什么**
为同一提供商配置多个账户，实现负载均衡和配额管理。

**配置认证文件**（`~/.clawdbot/agents/default/agent/auth-profiles.json`）：

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**`order` 字段**：
- 定义认证轮换顺序
- Clawdbot 会按顺序尝试每个账户
- 失败的账户会自动跳过

**CLI 命令管理顺序**：

```bash
# 查看当前顺序
clawdbot models auth order get --provider anthropic

# 设置顺序
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# 清除顺序（使用默认轮换）
clawdbot models auth order clear --provider anthropic
```

### 指定会话的认证

**为什么**
为特定会话或子 Agent 锁定认证配置。

**使用 `/model <alias>@<profileId>` 语法**：

```bash
# 为当前会话锁定使用特定账户
/model opus@anthropic:work

# 创建子 Agent 时指定认证
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**配置文件中的锁定**（`~/.clawdbot/clawdbot.json`）：

```yaml
auth:
  order:
    # 为 main Agent 锁定 anthropic 顺序
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### OAuth Token 自动刷新

Clawdbot 支持以下 OAuth 提供商的自动刷新：

| 提供商 | OAuth 流程 | 刷新机制 |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | 标准授权码 | pi-mono RPC 刷新 |
| **OpenAI** (Codex) | 标准授权码 | pi-mono RPC 刷新 |
| **Qwen Portal** | 自定义 OAuth | `refreshQwenPortalCredentials` |
| **Chutes** | 自定义 OAuth | `refreshChutesTokens` |

**自动刷新逻辑**：

1. 检查 token 过期时间（`expires` 字段）
2. 如果未过期，直接使用
3. 如果已过期，使用 `refresh` token 请求新的 `access` token
4. 更新存储的凭证

::: tip Claude Code CLI 同步
如果使用 Anthropic OAuth（`anthropic:claude-cli`），Clawdbot 会在刷新 token 时同步回 Claude Code CLI 的存储，确保两边一致。
:::

### 模型别名和快捷方式

**为什么**
模型别名让你可以快速切换模型，无需记住完整 ID。

**预定义别名**（推荐配置）：

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**使用方式**：

```bash
# 快速切换到 Opus
/model opus

# 等同于
/model anthropic/claude-opus-4-5

# 使用特定认证
/model opus@anthropic:work
```

::: tip 别名与认证分离
别名只是模型 ID 的快捷方式，不影响认证选择。要指定认证，使用 `@<profileId>` 语法。
:::

### 配置隐式提供商

某些提供商无需显式配置，Clawdbot 会自动检测：

| 提供商 | 检测方式 | 配置文件 |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | 无需配置 |
| **AWS Bedrock** | 环境变量或 AWS SDK 凭证 | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | 无需配置 |

::: tip 隐式配置优先级
隐式配置会被自动合并到 `models.json` 中，但显式配置可以覆盖它们。
:::

## 常见问题

### OAuth vs API Key：有什么区别？

**OAuth**：
- 适合长期运行的 Gateway
- Token 会自动刷新
- 需要订阅账户（Claude Pro/Max、OpenAI Codex）

**API Key**：
- 适合快速开始和测试
- 不会自动刷新
- 可以用于免费层级账户

::: info 推荐选择
- 长期运行 → 使用 OAuth（Anthropic、OpenAI）
- 快速测试 → 使用 API Key
- 隐私敏感 → 使用本地模型（Ollama）
:::

### 如何查看当前认证配置？

```bash
# 查看认证文件
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# 查看模型配置
cat ~/.clawdbot/models.json

# 查看主配置文件
cat ~/.clawdbot/clawdbot.json
```

或使用 CLI：

```bash
# 列出模型
clawdbot models list

# 查看认证顺序
clawdbot models auth order get --provider anthropic
```

### 如何移除某个认证？

```bash
# 编辑认证文件，删除对应的 profile
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# 或使用 CLI（手动操作）
clawdbot doctor  # 查看问题配置
```

::: warning 删除前确认
删除认证配置会导致使用该提供商的模型无法工作。确保有备用配置。
:::

### 配额限制后如何恢复？

**自动恢复**：
- Clawdbot 会在冷却期后自动重试
- 查看日志了解重试时间

**手动恢复**：
```bash
# 清除冷却状态
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# 或重启 Gateway
clawdbot gateway restart
```

## 本课小结

- Clawdbot 支持三种认证方式：API Key、OAuth、Token
- 模型配置和认证是分离的，存储在不同文件中
- 推荐配置 Anthropic Opus 4.5 作为主模型，OpenAI GPT-5.2 作为备用
- OAuth 支持自动刷新，适合长期运行
- 可以配置多账户和认证轮换，实现负载均衡
- 使用模型别名快速切换模型

## 下一课预告

> 下一课我们学习 **[会话管理与多 Agent](../session-management/)**。
>
> 你会学到：
> - 会话模型和会话隔离
> - 子 Agent 协作
> - 上下文压缩
> - 多 Agent 路由配置

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 认证凭证类型定义 | [`src/agents/auth-profiles/types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| OAuth Token 解析和刷新 | [`src/agents/auth-profiles/oauth.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| 认证配置文件管理 | [`src/agents/auth-profiles/profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| 模型配置类型 | [`src/config/types.models.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.models.ts) | 1-60 |
| 模型配置生成 | [`src/agents/models-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Zod Schema 配置 | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**关键类型**：
- `AuthProfileCredential`：认证凭证联合类型（`ApiKeyCredential | TokenCredential | OAuthCredential`）
- `ModelProviderConfig`：模型提供商配置结构
- `ModelDefinitionConfig`：模型定义结构

**关键函数**：
- `resolveApiKeyForProfile()`：解析认证凭证并返回 API Key
- `refreshOAuthTokenWithLock()`：带锁的 OAuth Token 刷新
- `ensureClawdbotModelsJson()`：生成和合并模型配置

**配置文件位置**：
- `~/.clawdbot/clawdbot.json`：主配置文件
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`：认证凭证
- `~/.clawdbot/models.json`：生成的模型配置

</details>
