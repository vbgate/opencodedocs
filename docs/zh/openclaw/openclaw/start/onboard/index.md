---
title: "OpenClaw 入门部署教程：从零开始搭建个人 AI 助手 | 完整安装配置指南"
sidebarTitle: "从零开始部署"
subtitle: "入门指南：从零开始部署 OpenClaw"
description: "OpenClaw 入门完整教程：学习如何从零安装和配置个人 AI 助手，通过交互式向导完成 Gateway 部署、AI 模型认证（支持 Anthropic/OpenAI 等 20+ 提供商）、WhatsApp/Telegram/Slack 频道集成，包含详细配置示例、验证步骤和安全最佳实践。"
tags:
  - "入门"
  - "安装"
  - "部署"
  - "onboard"
prerequisite: []
order: 10
---

# 入门指南：从零开始部署 OpenClaw

::: info 学完你能做什么
完成本教程后，你将能够：
- 使用 `openclaw onboard` 向导完成完整部署
- 理解 Gateway、工作区和频道的核心概念
- 配置 AI 模型认证（支持 20+ 提供商）
- 设置消息频道（WhatsApp、Telegram、Slack 等）
- 验证安装并启动你的第一个 AI 助手会话
:::

## 什么是 OpenClaw

**OpenClaw** 是一款运行在你自己设备上的个人 AI 助手。它是一个多频道 AI 网关，通过统一的控制平面管理 AI 会话、消息频道、工具和事件。

核心特点：
- **本地优先**：数据保留在你的设备上
- **多频道支持**：WhatsApp、Telegram、Slack、Discord、Signal 等 12+ 频道
- **可扩展技能**：60+ 内置技能，支持自定义工具集成
- **多 Agent 路由**：支持工作空间隔离

```
┌─────────────────────────────────────────────────────────────┐
│                      OpenClaw Gateway                       │
│                   (ws://127.0.0.1:18789)                   │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Channels   │   Sessions   │    Tools     │    Skills      │
└──────────────┴──────────────┴──────────────┴────────────────┘
                            │
         ┌──────────────────┼──────────────────┐
         ▼                  ▼                  ▼
┌──────────────┐   ┌────────────────┐   ┌──────────────┐
│  WhatsApp    │   │ Browser (CDP)  │   │  iOS/Android │
│  Telegram    │   │ Canvas (A2UI)  │   │   Nodes      │
│  Slack       │   │  File System   │   │              │
└──────────────┘   └────────────────┘   └──────────────┘
```

## 环境准备

### 系统要求

| 要求 | 规格 |
|------|------|
| **Node.js** | ≥ 22.12.0（ESM 模块必需） |
| **包管理器** | npm、pnpm 或 bun |
| **操作系统** | macOS、Linux、Windows（WSL2 推荐） |
| **内存** | 建议 4GB+ |
| **存储** | 建议 2GB+ 可用空间 |

::: warning Windows 用户注意
Windows 原生运行可能遇到问题。**强烈推荐使用 WSL2**：
```bash
wsl --install  # 一行命令，重启后即可使用
```
参考指南：[Windows 平台文档](https://docs.openclaw.ai/platforms/windows)
:::

### 验证 Node.js 版本

```bash
node --version
# 输出: v22.12.0 或更高版本
```

如果版本过低，请从 [nodejs.org](https://nodejs.org/) 下载最新 LTS 版本。

### 安装 CLI

OpenClaw 提供两种安装方式：

**方式一：从 npm 安装（推荐）**

```bash
# 方式一: 使用 npm
npm install -g openclaw@latest

# 方式二: 使用 pnpm
pnpm add -g openclaw@latest
```

**方式二：从源码构建（开发环境）**

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
pnpm install

# 构建 UI（首次运行自动安装 UI 依赖）
pnpm ui:build

# 编译项目
pnpm build

# 运行安装向导
pnpm openclaw onboard
```

## 启动安装向导

安装完成后，运行 `onboard` 命令启动交互式向导：

```bash
openclaw onboard --install-daemon
```

::: tip 关于 `--install-daemon`
该选项会安装 Gateway 守护进程（launchd/systemd 用户服务），确保 Gateway 始终运行。
:::

### 向导流程概览

向导会引导你完成以下步骤：

1. **安全确认** - 了解安全风险和推荐配置
2. **模式选择** - QuickStart 快速配置或 Manual 手动配置
3. **工作区设置** - 指定 Agent 工作目录
4. **模型认证** - 配置 AI 提供商 API 密钥或 OAuth
5. **Gateway 配置** - 设置端口、网络绑定、认证方式
6. **频道配置** - 添加 WhatsApp、Telegram 等消息频道
7. **技能设置** - 选择并安装扩展技能

## 详细配置步骤

### 第 1 步：安全确认

向导首先显示安全警告，这是**必须阅读**的重要信息：

```
Security warning — please read.

OpenClaw is a hobby project and still in beta. Expect sharp edges.
This bot can read files and run actions if tools are enabled.
A bad prompt can trick it into doing unsafe things.

Recommended baseline:
- Pairing/allowlists + mention gating.
- Sandbox + least-privilege tools.
- Keep secrets out of the agent's reachable filesystem.
- Use the strongest available model for any bot with tools or untrusted inboxes.
```

**你应该看到**：
- 提示询问 "I understand this is powerful and inherently risky. Continue?"
- 输入 `Y` 继续（默认值为 `N`，需要显式确认）

### 第 2 步：选择配置模式

```
? Onboarding mode …
❯ QuickStart  - Configure details later via openclaw configure.
  Manual      - Configure port, network, Tailscale, and auth options.
```

| 模式 | 适用场景 | 配置内容 |
|------|----------|----------|
| **QuickStart** | 首次体验，快速上手 | 使用默认端口 18789、本地回环绑定、Token 认证 |
| **Manual** | 生产部署，需要自定义 | 自定义端口、网络绑定、Tailscale、认证方式 |

::: tip 选择建议
- 首次尝试选择 **QuickStart**
- 需要远程访问或自定义网络选择 **Manual**
:::

### 第 3 步：配置工作区

工作区是 Agent 存储文件、技能和会话数据的地方。

```
? Workspace directory …
~/.openclaw/workspace
```

默认工作区：`~/.openclaw/workspace`

工作区包含：
- `AGENTS.md` - 注入到 Agent 提示词的系统说明
- `SOUL.md` - Agent 个性定义
- `TOOLS.md` - 工具使用说明
- `skills/` - 已安装的技能
- `sessions/` - 会话记录

### 第 4 步：AI 模型认证

OpenClaw 支持 **20+ AI 提供商**，向导会分组显示：

```
? Select authentication provider …
❯ Anthropic (setup-token)
  OpenAI (openai-codex)
  OpenRouter (openrouter-api-key)
  Google (google-gemini-cli)
  Moonshot AI (moonshot-api-key)
  Z.ai (zai-api-key)
  Xiaomi (xiaomi-api-key)
  ...
  Skip for now
```

#### 支持的认证方式

| 提供商 | 认证方式 | 推荐模型 |
|--------|----------|----------|
| **Anthropic** | Setup Token (OAuth) | Claude Opus 4.6 |
| **OpenAI** | Codex OAuth / API Key | GPT-4o, Codex |
| **OpenRouter** | API Key | 多模型聚合 |
| **Google** | Gemini CLI OAuth | Gemini Pro |
| **Moonshot** | API Key | Moonshot v1 |
| **Z.ai** | API Key | Z.ai Coding |

::: tip 模型推荐
虽然支持任何模型，但强烈建议使用 **Anthropic Pro/Max (100/200) + Opus 4.6**：
- 更强的长上下文处理能力
- 更好的提示注入抵抗能力
- 更稳定的工具调用性能
:::

#### 配置示例（Anthropic Setup Token）

选择 "Anthropic (setup-token)" 后：

```
? Enter your Anthropic setup token …
sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

✓ Token validated
? Select default model …
❯ anthropic/claude-opus-4-6
  anthropic/claude-sonnet-4
  anthropic/claude-haiku-4
```

### 第 5 步：Gateway 配置

Gateway 是 OpenClaw 的核心控制平面，默认监听 `ws://127.0.0.1:18789`。

**QuickStart 默认配置**：

```
Keeping your current gateway settings:
Gateway port: 18789
Gateway bind: Loopback (127.0.0.1)
Gateway auth: Token (default)
Tailscale exposure: Off
Direct to chat channels.
```

**Manual 模式可配置项**：

| 配置项 | 选项 | 说明 |
|--------|------|------|
| **Port** | 任意可用端口 | 默认 18789 |
| **Bind** | loopback / lan / tailnet / auto / custom | 网络绑定模式 |
| **Auth** | token / password | 认证方式 |
| **Tailscale** | off / serve / funnel | 远程访问方式 |

#### 绑定模式详解

```
? Gateway bind …
❯ Loopback (127.0.0.1)    # 仅本机访问，最安全
  LAN                      # 局域网可访问
  Tailnet (Tailscale IP)   # Tailscale 网络访问
  Custom IP                # 自定义绑定地址
  Auto                     # 自动选择
```

| 模式 | 适用场景 | 安全级别 |
|------|----------|----------|
| `loopback` | 单机使用 | ⭐⭐⭐⭐⭐ |
| `lan` | 局域网多设备 | ⭐⭐⭐⭐ |
| `tailnet` | Tailscale 网络 | ⭐⭐⭐⭐ |
| `custom` | 特定 IP 绑定 | ⭐⭐⭐ |

#### Tailscale 集成（可选）

如果需要远程访问 Gateway，可以配置 Tailscale：

```
? Tailscale exposure …
❯ Off       # 不启用 Tailscale
  Serve     # Tailnet 内访问（推荐）
  Funnel    # 公网访问（需要密码认证）
```

::: warning Tailscale 安全注意
- `serve` 模式：仅 Tailscale 网络内可访问
- `funnel` 模式：公网可访问，**必须**设置密码认证
- Gateway 绑定必须保持 `loopback` 当启用 Serve/Funnel
:::

### 第 6 步：配置消息频道

OpenClaw 支持 12+ 消息频道。向导会显示已安装和可用的频道：

```
Channel status
whatsapp: not configured
telegram: not configured
slack: not configured
discord: not configured
signal: install plugin to enable
bluebubbles: install plugin to enable

? Configure chat channels now? (Y/n) › yes
```

#### DM 安全策略

在配置频道前，向导会说明 DM（私聊）安全机制：

```
How channels work
DM security: default is pairing; unknown DMs get a pairing code.
Approve with: openclaw pairing approve <channel> <code>
Public DMs require dmPolicy="open" + allowFrom=["*"].
```

| 策略 | 说明 | 适用场景 |
|------|------|----------|
| **pairing**（默认） | 未知发送者收到配对码，需手动批准 | 个人使用，最安全 |
| **allowlist** | 仅允许列表中的用户 | 小团队 |
| **open** | 允许任何人（需设置 `allowFrom: ["*"]`） | 公开机器人 |
| **disabled** | 忽略所有 DM | 纯群组使用 |

#### 频道配置示例

**WhatsApp 配置**：

```
? Select channel …
❯ WhatsApp

WhatsApp uses your phone's WhatsApp account.
You'll scan a QR code to link the device.

? Continue with WhatsApp setup? (Y/n) › yes
📱 Scan this QR code with WhatsApp → Linked Devices → Link a Device
[QR Code]

✓ WhatsApp connected!
? Configure DM policy for WhatsApp …
❯ Pairing (recommended)
  Allowlist
  Open
  Disabled
```

**Telegram 配置**：

```
? Select channel …
❯ Telegram

? Enter Telegram Bot Token …
123456789:ABCDEFghijklmnopqrstuvwxyz

✓ Bot validated
? Configure DM policy for Telegram …
❯ Pairing (recommended)
```

### 第 7 步：技能设置

技能（Skills）是扩展 Agent 能力的插件：

```
? Configure skills now? (Y/n) › yes

Available skill categories:
❯ GitHub integration    - Manage issues, PRs, repos
  Spotify player        - Control music playback
  Notion integration    - Read/write Notion pages
  Obsidian notes        - Search and edit notes
  1Password             - Access passwords (secure)
  Weather               - Get weather forecasts
  ...

? Select skills to install …
[ ] github
[ ] spotify-player
[ ] weather
```

::: tip 推荐初学者技能
- `weather` - 天气查询，简单实用
- `github` - 如果你使用 GitHub
- `obsidian` - 如果你使用 Obsidian 笔记
:::

## 验证安装

### 检查 Gateway 状态

向导完成后，验证 Gateway 是否正常运行：

```bash
openclaw status
```

**你应该看到**：

```
Gateway Status
==============
State:      running
Version:    2026.2.13
Port:       18789
Bind:       127.0.0.1
Channels:   whatsapp, telegram
Sessions:   1 active
```

### 运行诊断

```bash
openclaw doctor
```

Doctor 命令会检查：
- 配置文件有效性
- 依赖项完整性
- 频道连接状态
- 安全风险配置

### 发送测试消息

通过 CLI 与 Agent 对话：

```bash
openclaw agent --agent main --message "你好，OpenClaw！"
```

**你应该看到**：

```
🦞 Molty (claude-opus-4-6)
─────────────────────────────
你好！我是 OpenClaw 的 AI 助手。我已经成功启动，准备帮助你完成各种任务。

你可以：
- 通过 WhatsApp、Telegram 等频道给我发消息
- 使用浏览器工具访问网页
- 使用文件工具读写本地文件
- 安装更多技能来扩展我的能力

有什么我可以帮你的吗？
```

### 启动 Gateway（如未自动启动）

```bash
openclaw gateway --port 18789 --verbose
```

## 配置文件详解

安装完成后，配置文件位于 `~/.openclaw/openclaw.json`。

### 最小配置示例

```json5
{
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-6",
      "workspace": "~/.openclaw/workspace"
    }
  },
  "gateway": {
    "port": 18789,
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "your-generated-token"
    }
  }
}
```

### 完整配置结构

```typescript
// src/config/types.openclaw.ts
type OpenClawConfig = {
  meta?: {
    lastTouchedVersion?: string;
    lastTouchedAt?: string;
  };
  auth?: AuthConfig;
  env?: { shellEnv?: {...}; vars?: Record<string, string>; };
  wizard?: { lastRunAt?: string; ... };
  diagnostics?: DiagnosticsConfig;
  logging?: LoggingConfig;
  update?: { channel?: "stable" | "beta" | "dev"; checkOnStart?: boolean };
  browser?: BrowserConfig;
  ui?: { seamColor?: string; assistant?: {...} };
  skills?: SkillsConfig;
  plugins?: PluginsConfig;
  models?: ModelsConfig;
  nodeHost?: NodeHostConfig;
  agents?: AgentsConfig;
  tools?: ToolsConfig;
  bindings?: AgentBinding[];
  broadcast?: BroadcastConfig;
  audio?: AudioConfig;
  messages?: MessagesConfig;
  commands?: CommandsConfig;
  approvals?: ApprovalsConfig;
  session?: SessionConfig;
  web?: WebConfig;
  channels?: ChannelsConfig;
  cron?: CronConfig;
  hooks?: HooksConfig;
  discovery?: DiscoveryConfig;
  canvasHost?: CanvasHostConfig;
  talk?: TalkConfig;
  gateway?: GatewayConfig;
  memory?: MemoryConfig;
};
```

### 关键环境变量

| 变量 | 用途 | 示例 |
|------|------|------|
| `OPENCLAW_GATEWAY_TOKEN` | Gateway 认证 Token | `openssl rand -hex 32` |
| `OPENCLAW_GATEWAY_PASSWORD` | Gateway 密码认证 | - |
| `OPENCLAW_STATE_DIR` | 状态目录 | `~/.openclaw` |
| `OPENCLAW_CONFIG_PATH` | 配置文件路径 | `~/.openclaw/openclaw.json` |
| `ANTHROPIC_API_KEY` | Anthropic API | `sk-ant-...` |
| `OPENAI_API_KEY` | OpenAI API | `sk-...` |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot | `123456:ABCDEF...` |

## 最佳实践

### 安全建议

1. **使用配对模式（Pairing）**
   ```json5
   {
     "channels": {
       "telegram": { "dmPolicy": "pairing" },
       "whatsapp": { "dmPolicy": "pairing" },
       "discord": { "dmPolicy": "pairing" }
     }
   }
   ```

2. **启用沙箱模式处理非主会话**
   ```json5
   {
     "agents": {
       "defaults": {
         "sandbox": { "mode": "non-main" }
       }
     }
   }
   ```

3. **定期运行安全审计**
   ```bash
   openclaw security audit --deep
   openclaw security audit --fix
   ```

### 性能优化

1. **选择合适的模型**
   - 复杂任务：Claude Opus 4.6
   - 日常对话：Claude Sonnet 4
   - 快速响应：Claude Haiku 4

2. **配置模型回退**
   ```json5
   {
     "agents": {
       "defaults": {
         "model": {
           "primary": "anthropic/claude-opus-4-6",
           "fallbacks": ["openai/gpt-4.1", "google/gemini-3-pro"]
         }
       }
     }
   }
   ```

### 故障排查

**Gateway 无法启动**
```bash
# 1. 检查端口占用
lsof -i :18789

# 2. 检查配置有效性
openclaw doctor

# 3. 重置配置
openclaw onboard --reset
```

**频道连接失败**
```bash
# 检查频道状态
openclaw channels status --probe

# 重新配置特定频道
openclaw channels add whatsapp
```

**模型 API 错误**
```bash
# 验证 API 密钥配置
openclaw config get models.profiles

# 重新设置认证
openclaw onboard --auth-choice setup-token
```

## 下一步

完成安装后，你可以：

1. **配置更多频道** - 学习如何集成 [WhatsApp](../whatsapp-setup/)、[Telegram](../telegram-setup/)、[Slack](../slack-discord-setup/)
2. **探索技能系统** - 了解如何[扩展 Agent 能力](../../advanced/skills-system/)
3. **配置多模型** - 学习[模型配置和故障转移](../../advanced/models-configuration/)
4. **远程访问** - 设置 [Tailscale 远程访问](../../advanced/tailscale-remote/)

## 本课小结

在本教程中，你学会了：
- OpenClaw 的核心概念（Gateway、工作区、频道）
- 使用 `openclaw onboard` 向导完成完整部署
- 配置 20+ AI 提供商的认证
- 设置消息频道和 DM 安全策略
- 验证安装并运行诊断

OpenClaw 现已就绪，开始你的 AI 助手之旅吧！

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Onboard 主入口 | [`src/commands/onboard.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard.ts) | 1-83 |
| 交互式向导 | [`src/commands/onboard-interactive.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-interactive.ts) | 1-26 |
| 非交互式模式 | [`src/commands/onboard-non-interactive.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-non-interactive.ts) | 1-38 |
| 认证配置 | [`src/commands/onboard-auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-auth.ts) | 1-107 |
| 频道初始化 | [`src/commands/onboard-channels.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-channels.ts) | 1-680 |
| 向导主逻辑 | [`src/wizard/onboarding.ts`](https://github.com/openclaw/openclaw/blob/main/src/wizard/onboarding.ts) | 1-485 |
| 辅助函数 | [`src/commands/onboard-helpers.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-helpers.ts) | 1-487 |
| 配置类型定义 | [`src/config/types.openclaw.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.openclaw.ts) | 1-130 |
| 选项类型定义 | [`src/commands/onboard-types.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/onboard-types.ts) | 1-146 |

**关键常量**：
- `DEFAULT_WORKSPACE = "~/.openclaw/workspace"` - 默认工作区路径
- `DEFAULT_GATEWAY_PORT = 18789` - 默认 Gateway 端口
- `DEFAULT_WORKSPACE = DEFAULT_AGENT_WORKSPACE_DIR` - 工作区常量别名

**关键函数**：
- `onboardCommand()` - CLI 入口，处理选项和分发
- `runInteractiveOnboarding()` - 交互式向导入口
- `runNonInteractiveOnboarding()` - 非交互模式入口
- `runOnboardingWizard()` - 向导主逻辑实现
- `setupChannels()` - 频道配置流程
- `applyAuthChoice()` - 应用认证选择

</details>
