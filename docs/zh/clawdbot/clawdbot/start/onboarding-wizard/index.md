---
title: "向导式配置：一站式配置 Clawdbot | Clawdbot 教程"
sidebarTitle: "一键配置完成"
subtitle: "向导式配置：一站式配置 Clawdbot"
description: "学习使用交互式向导完成 Clawdbot 的完整配置，包括 Gateway 网络设置、AI 模型认证（支持 setup-token 和 API Key）、通信渠道（WhatsApp、Telegram、Slack 等）和技能系统的初始化。"
tags:
  - "入门"
  - "配置"
  - "向导"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# 向导式配置：一站式配置 Clawdbot

## 学完你能做什么

通过本教程，你将：

- ✅ 使用交互式向导完成 Clawdbot 完整配置
- ✅ 理解 QuickStart 和 Manual 两种模式的区别
- ✅ 配置 Gateway 网络和认证选项
- ✅ 设置 AI 模型提供商（setup-token 和 API Key）
- ✅ 启用通信渠道（WhatsApp、Telegram 等）
- ✅ 安装和管理技能包

完成向导后，Clawdbot Gateway 将在后台运行，你可以通过已配置的渠道与 AI 助手对话。

## 你现在的困境

手动编辑配置文件很麻烦：

- 不知道配置项的含义和默认值
- 容易遗漏关键设置导致无法启动
- AI 模型认证方式多样（OAuth、API Key）不知道怎么选
- 渠道配置复杂，每个平台的认证方式不同
- 技能系统不知道该安装哪些

向导式配置解决了这些问题，它通过交互式问题引导你完成所有配置，并提供合理的默认值。

## 什么时候用这一招

- **首次安装**：新用户第一次使用 Clawdbot
- **重新配置**：需要修改 Gateway 设置、切换 AI 模型或添加新渠道
- **快速验证**：想快速体验基本功能，不想深入研究配置文件
- **故障排查**：配置出错后，使用向导重新初始化

::: tip 提示
向导会检测现有配置，可以选择保留、修改或重置配置。
:::

## 核心思路

### 两种模式

向导提供两种配置模式：

**QuickStart 模式**（推荐新手）
- 使用安全默认值：Gateway 绑定到 loopback（127.0.0.1），端口 18789，token 认证
- 跳过大部分详细配置项
- 适合单机使用，快速上手

**Manual 模式**（适合高级用户）
- 手动配置所有选项
- 支持 LAN 绑定、Tailscale 远程访问、自定义认证方式
- 适合多机部署、远程访问或特殊网络环境

### 配置流程

```
1. 安全警告确认
2. 模式选择（QuickStart / Manual）
3. Gateway 配置（端口、绑定、认证、Tailscale）
4. AI 模型认证（setup-token / API Key）
5. 工作区设置（默认 ~/clawd）
6. 渠道配置（WhatsApp / Telegram / Slack 等）
7. 技能安装（可选）
8. 完成（启动 Gateway）
```

### 安全提醒

向导开始时会显示安全警告，你需要确认以下内容：

- Clawdbot 是业余项目，仍在 beta 阶段
- 工具启用后，AI 可以读取文件和执行操作
- 恶意提示词可能诱导 AI 做不安全的操作
- 建议使用配对/白名单 + 最小权限工具
- 定期运行安全审计

::: danger 重要
如果你不理解基本安全和访问控制机制，请勿启用工具或将 Gateway 暴露到互联网。建议请有经验的人协助配置后再使用。
:::

---

## 🎒 开始前的准备

在运行向导前，请确认：

- **已安装 Clawdbot**：参考[快速开始](../getting-started/)完成安装
- **Node.js 版本**：确保 Node.js ≥ 22（使用 `node -v` 检查）
- **AI 模型账户**（推荐）：
  - Anthropic Claude 账户（Pro/Max 订阅），支持 OAuth 流程
  - 或准备好 OpenAI/DeepSeek 等提供商的 API Key
- **渠道账户**（可选）：如需使用 WhatsApp、Telegram 等，先注册相应账户
- **网络权限**：如需使用 Tailscale，确保已安装 Tailscale 客户端

---

## 跟我做

### 第 1 步：启动向导

打开终端，运行以下命令：

```bash
clawdbot onboard
```

**为什么**
启动交互式配置向导，引导你完成所有必要设置。

**你应该看到**：
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### 第 2 步：确认安全警告

向导首先显示安全警告（如上节"核心思路"所述）。

**为什么**
确保用户了解潜在风险，避免误用导致安全问题。

**操作**：
- 阅读安全警告内容
- 输入 `y` 或选择 `Yes` 确认理解风险
- 如果不接受风险，向导会退出

**你应该看到**：
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### 第 3 步：选择配置模式

::: code-group

```bash [QuickStart 模式]
推荐新手使用，使用安全默认值：
- Gateway 端口：18789
- 绑定地址：Loopback (127.0.0.1)
- 认证方式：Token（自动生成）
- Tailscale：关闭
```

```bash [Manual 模式]
适合高级用户，手动配置所有选项：
- 自定义 Gateway 端口和绑定
- 选择 Token 或 Password 认证
- 配置 Tailscale Serve/Funnel 远程访问
- 详细配置每个步骤
```

:::

**为什么**
QuickStart 模式让新手快速上手，Manual 模式让高级用户精确控制。

**操作**：
- 使用方向键选择 `QuickStart` 或 `Manual`
- 按 Enter 确认

**你应该看到**：
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### 第 4 步：选择部署模式（仅 Manual 模式）

如果选择 Manual 模式，向导会询问 Gateway 部署位置：

::: code-group

```bash [Local gateway (this machine)]
Gateway 运行在当前机器上：
- 可以运行 OAuth 流程并写入本地凭证
- 向导会完成所有配置
- 适合本地开发或单机部署
```

```bash [Remote gateway (info-only)]
Gateway 运行在另一台机器上：
- 向导仅配置远程 URL 和认证
- 不运行 OAuth 流程，需在远程主机手动设置凭证
- 适合多机部署场景
```

:::

**为什么**
Local 模式支持完整的配置流程，Remote 模式仅配置访问信息。

**操作**：
- 选择部署模式
- 如果是 Remote 模式，输入远程 Gateway 的 URL 和 token

### 第 5 步：配置 Gateway（仅 Manual 模式）

如果选择 Manual 模式，向导会逐项询问 Gateway 配置：

#### Gateway 端口

```bash
? Gateway port (18789)
```

**说明**：
- 默认值 18789
- 如果端口被占用，输入其他端口
- 确保端口未被防火墙阻止

#### Gateway 绑定地址

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**选项说明**：
- **Loopback**：仅本机访问，最安全
- **LAN**：局域网内设备可访问
- **Tailnet**：通过 Tailscale 虚拟网络访问
- **Auto**：先尝试 loopback，失败后切换到 LAN
- **Custom IP**：手动指定 IP 地址

::: tip 提示
推荐使用 Loopback 或 Tailnet，避免直接暴露到局域网。
:::

#### Gateway 认证方式

```bash
? Gateway auth
  Token              Recommended default (local + remote)
  Password
```

**选项说明**：
- **Token**：推荐选项，自动生成随机 token，支持远程访问
- **Password**：使用自定义密码，Tailscale Funnel 模式必需

#### Tailscale 远程访问（可选）

```bash
? Tailscale exposure
  Off               No Tailscale exposure
  Serve             Private HTTPS for your tailnet (devices on Tailscale)
  Funnel            Public HTTPS via Tailscale Funnel (internet)
```

::: warning Tailscale 警告
- Serve 模式：仅 Tailscale 网络内设备可访问
- Funnel 模式：通过公网 HTTPS 暴露（需密码认证）
- 确保 Tailscale 客户端已安装：https://tailscale.com/download/mac
:::

### 第 6 步：设置工作区

向导会询问工作区目录：

```bash
? Workspace directory (~/clawd)
```

**说明**：
- 默认值 `~/clawd`（即 `/Users/你的用户名/clawd`）
- 工作区存储会话历史、代理配置、技能等数据
- 可以使用绝对路径或相对路径

::: info 多配置文件（Profile）支持
通过设置 `CLAWDBOT_PROFILE` 环境变量，可以为不同工作环境使用独立配置：

| Profile 值 | 工作区路径 | 配置文件 |
|--- | --- | ---|
| `default` 或未设置 | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (work profile) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (dev profile) |

示例：
```bash
# 使用 work profile
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**你应该看到**：
```
Ensuring workspace directory: /Users/你的用户名/clawd
Creating sessions.json...
Creating agents directory...
```

### 第 7 步：配置 AI 模型认证

向导会列出支持的 AI 模型提供商：

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommended)
  Qwen                         OAuth
  Venice AI                     Privacy-focused (uncensored models)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + local proxy
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

选择提供商后，向导会根据提供商类型显示具体的认证方式。以下是主要提供商的认证选项：

**Anthropic** 认证方式：
- `claude-cli`：使用现有的 Claude Code CLI OAuth 认证（需 Keychain 访问）
- `token`：粘贴通过 `claude setup-token` 生成的 setup-token
- `apiKey`：手动输入 Anthropic API Key

::: info Anthropic setup-token 方式（推荐）
推荐使用 setup-token 方式，原因：
- 无需手动管理 API Key
- 生成长期有效的 token
- 适合个人 Pro/Max 订阅用户

流程：
1. 先在另一个终端运行：`claude setup-token`
2. 此命令会打开浏览器进行 OAuth 授权
3. 复制生成的 setup-token
4. 在向导中选择 `Anthropic` → `token`
5. 粘贴 setup-token 到向导中
6. 凭证自动保存到 `~/.clawdbot/credentials/` 目录
:::

::: info API Key 方式
如果选择 API Key：
- 向导会提示输入 API Key
- 凭证保存到 `~/.clawdbot/credentials/` 目录
- 支持多个提供商，可随时切换

示例：
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### 第 8 步：选择默认模型

认证成功后，向导会显示可用模型列表：

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**建议**：
- 推荐使用 **Claude Sonnet 4.5** 或 **Opus 4.5**（200k 上下文，更强安全性）
- 如果预算有限，可选择 Mini 版本
- 点击 `Keep current selection` 保留现有配置

### 第 9 步：配置通信渠道

向导会列出所有可用的通信渠道插件：

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**操作**：
- 使用方向键导航
- 按 **空格键** 切换选中状态
- 按 **Enter** 确认选择

::: tip QuickStart 模式优化
QuickStart 模式下，向导会自动选中支持快速启用的渠道（如 WebChat），并跳过 DM 策略配置，使用安全的默认值（pairing 模式）。
:::

选中渠道后，向导会逐个询问每个渠道的配置：

#### WhatsApp 配置

```bash
? Configure WhatsApp
  Link new account     Open QR code in browser
  Skip
```

**操作**：
- 选择 `Link new account`
- 向导会显示二维码
- 使用 WhatsApp 扫描二维码登录
- 登录成功后，会话数据保存到 `~/.clawdbot/credentials/`

#### Telegram 配置

```bash
? Configure Telegram
  Bot Token
  Skip
```

**操作**：
- 选择 `Bot Token`
- 输入从 @BotFather 获取的 Bot Token
- 向导会测试连接是否成功

::: tip Bot Token 获取
1. 在 Telegram 中搜索 @BotFather
2. 发送 `/newbot` 创建新 bot
3. 按提示设置 bot 名称和用户名
4. 复制生成的 Bot Token
:::

#### Slack 配置

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**说明**：
Slack 需要三个凭证，从 Slack App 设置获取：
- **App Token**：Workspace level token
- **Bot Token**：Bot user OAuth token
- **Signing Secret**：用于验证请求签名

::: tip Slack App 创建
1. 访问 https://api.slack.com/apps
2. 创建新 App
3. 在 Basic Information 页面获取 Signing Secret
4. 在 OAuth & Permissions 页面安装 App 到 Workspace
5. 获取 Bot Token 和 App Token
:::

### 第 10 步：配置技能（可选）

向导会提示是否安装技能：

```bash
? Install skills? (Y/n)
```

**推荐**：
- 选择 `Y` 安装推荐技能（如 bird 包管理器、sherpa-onnx-tts 本地 TTS）
- 选择 `n` 跳过，后续可通过 `clawdbot skills` 命令管理

如果选择安装，向导会列出可用技能：

```bash
? Select skills to install
  ✓ bird           macOS Homebrew 包安装
  ✓ sherpa-onnx-tts  本地 TTS 引擎（隐私优先）
  (Press Space to select, Enter to confirm)
```

### 第 11 步：完成配置

向导会总结所有配置并写入配置文件：

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## 检查点 ✅

完成向导后，请确认以下内容：

- [ ] 配置文件已创建：`~/.clawdbot/clawdbot.json`
- [ ] 工作区已初始化：`~/clawd/` 目录存在
- [ ] AI 模型凭证已保存：检查 `~/.clawdbot/credentials/`
- [ ] 渠道已配置：查看 `clawdbot.json` 中的 `channels` 节点
- [ ] 技能已安装（如果选择）：查看 `clawdbot.json` 中的 `skills` 节点

**验证命令**：

```bash
## 查看配置摘要
```bash
clawdbot doctor
```

## 查看 Gateway 状态
```bash
clawdbot gateway status
```

## 查看可用渠道
```bash
clawdbot channels list
```
```

## 踩坑提醒

### 常见错误 1：端口被占用

**错误信息**：
```
Error: Port 18789 is already in use
```

**解决方法**：
1. 查找占用进程：`lsof -i :18789`（macOS/Linux）或 `netstat -ano | findstr 18789`（Windows）
2. 停止冲突进程或使用其他端口

### 常见错误 2：OAuth 流程失败

**错误信息**：
```
Error: OAuth exchange failed
```

**可能原因**：
- 网络问题导致无法访问 Anthropic 服务器
- OAuth code 过期或格式错误
- 浏览器被拦截导致无法打开

**解决方法**：
1. 检查网络连接
2. 重新运行 `clawdbot onboard` 重试 OAuth
3. 或改用 API Key 方式

### 常见错误 3：渠道配置失败

**错误信息**：
```
Error: WhatsApp authentication failed
```

**可能原因**：
- 二维码过期
- 账号被 WhatsApp 限制
- 依赖项未安装（如 signal-cli）

**解决方法**：
1. WhatsApp：重新扫描二维码
2. Signal：确保已安装 signal-cli（见渠道特定文档）
3. Bot Token：确认 token 格式正确且未过期

### 常见错误 4：Tailscale 配置失败

**错误信息**：
```
Error: Tailscale binary not found in PATH or /Applications.
```

**解决方法**：
1. 安装 Tailscale：https://tailscale.com/download/mac
2. 确保添加到 PATH 或安装到 `/Applications`
3. 或跳过 Tailscale 配置，后续手动设置

### 常见错误 5：配置文件格式错误

**错误信息**：
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**解决方法**：
```bash
# 修复配置
clawdbot doctor

# 或重置配置
clawdbot onboard --mode reset
```

---

## 本课小结

向导式配置是配置 Clawdbot 的推荐方式，它通过交互式问题引导你完成所有必要设置：

**关键点回顾**：
- ✅ 支持 **QuickStart** 和 **Manual** 两种模式
- ✅ 安全警告提醒潜在风险
- ✅ 自动检测现有配置，可保留/修改/重置
- ✅ 支持 **Anthropic setup-token** 流程（推荐）和 API Key 方式
- ✅ 支持 **CLAWDBOT_PROFILE** 多配置文件环境
- ✅ 自动配置渠道和技能
- ✅ 生成安全的默认值（loopback 绑定、token 认证）

**推荐工作流**：
1. 首次使用：`clawdbot onboard --install-daemon`
2. 修改配置：`clawdbot configure`
3. 故障排查：`clawdbot doctor`
4. 远程访问：配置 Tailscale Serve/Funnel

**下一步**：
- [启动 Gateway](../gateway-startup/)：让 Gateway 在后台运行
- [发送第一条消息](../first-message/)：与 AI 助手开始对话
- [了解 DM 配对](../pairing-approval/)：安全控制陌生发送者

---

## 下一课预告

> 下一课我们学习 **[启动 Gateway](../gateway-startup/)**。
>
> 你将学到：
> - 如何启动 Gateway 守护进程
> - 开发模式和生产模式的区别
> - 如何监控 Gateway 状态
> - 使用 launchd/systemd 自动启动

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能           | 文件路径                                                                                                  | 行号      |
|--- | --- | ---|
| 向导主流程     | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 87-452    |
| 安全警告确认   | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 46-85     |
| Gateway 配置   | [`src/wizard/onboarding.gateway-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.gateway-config.ts) | 28-249    |
| 向导接口定义   | [`src/wizard/prompts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/prompts.ts) | 36-52     |
| 渠道配置     | [`src/commands/onboard-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-channels.ts) | -         |
| 技能配置     | [`src/commands/onboard-skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-skills.ts) | -         |
| 向导类型定义   | [`src/wizard/onboarding.types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.types.ts) | 1-26      |
| 配置文件 Schema | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | -         |

**关键类型**：
- `WizardFlow`：`"quickstart" | "advanced"` - 向导模式类型
- `QuickstartGatewayDefaults`：QuickStart 模式的 Gateway 默认配置
- `GatewayWizardSettings`：Gateway 配置设置
- `WizardPrompter`：向导交互接口

**关键函数**：
- `runOnboardingWizard()`：主向导流程
- `configureGatewayForOnboarding()`：配置 Gateway 网络和认证
- `requireRiskAcknowledgement()`：显示并确认安全警告

**默认配置值**（QuickStart 模式）：
- Gateway 端口：18789
- 绑定地址：loopback (127.0.0.1)
- 认证方式：token（自动生成随机 token）
- Tailscale：off
- 工作区：`~/clawd`

**配置文件位置**：
- 主配置：`~/.clawdbot/clawdbot.json`
- OAuth 凭证：`~/.clawdbot/credentials/oauth.json`
- API Key 凭证：`~/.clawdbot/credentials/`
- 会话数据：`~/clawd/sessions.json`

</details>
