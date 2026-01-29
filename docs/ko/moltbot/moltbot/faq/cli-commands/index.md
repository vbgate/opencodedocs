---
title: "CLI 명령 참조: 완전한 명령 목록 및 사용법 | Clawdbot 튜토리얼"
sidebarTitle: "명령을 찾을 수 없음"
subtitle: "CLI 명령 참조: 완전한 명령 목록 및 사용법"
description: "Clawdbot의 모든 CLI 명령에 대한 완전한 참조를 학습합니다. gateway, agent, models, channels, nodes, skills 등 24개의 명령 그룹에 대한 상세한 사용법, 옵션 설명, 실전 예제를 포함합니다. 임의의 CLI 명령의 사용법 및 매개변수를 빠르게 찾고, 예제를 통해 복잡한 명령을 빠르게 익히며, Gateway, Agent, 채널, 예약 작업, 디바이스 노드, 스킬 패키지, 브라우저 자동화를 효율적으로 관리합니다."
tags:
  - "CLI"
  - "명령 참조"
  - "FAQ"
prerequisite:
  - "start-getting-started"
order: 320
---
title: "CLI 命令参考：完整命令列表与用法 | Clawdbot 教程"
sidebarTitle: "命令查不到了"
subtitle: "CLI 命令参考：完整的命令列表和用法说明"
description: "学习 Clawdbot 所有 CLI 命令的完整参考，包括 gateway、agent、models、channels、nodes、skills 等 24 个命令组的详细用法、选项说明和实战示例。快速查找任何 CLI 命令的用法和参数，通过示例快速上手复杂命令，有效管理 Gateway、Agent、渠道、定时任务、设备节点、技能包和浏览器自动化。"
tags:
  - "CLI"
  - "命令参考"
  - "FAQ"
prerequisite:
  - "start-getting-started"
order: 320
---

# CLI 命令参考：完整的命令列表和用法说明

## 学完你能做什么

本课提供 Clawdbot CLI 的完整命令参考，让你能够：
- 快速查找任何 CLI 命令的用法
- 了解每个命令的选项和参数
- 通过示例快速上手复杂命令

## 什么时候用这一招

当你需要：
- 查找某个命令的具体用法
- 了解命令支持的所有选项
- 通过 CLI 管理 Gateway、Agent、渠道等系统组件

---

## 命令概览

Clawdbot CLI 提供了 24 个主要命令组，涵盖系统管理的各个方面：

| 命令组 | 说明 |
|--- | ---|
| `gateway` / `daemon` | Gateway 服务控制（启动、停止、状态） |
| `agent` / `agents` | Agent 交互与管理 |
| `models` | AI 模型配置与认证 |
| `message` | 发送消息和渠道操作 |
| `channels` | 渠道管理（登录、状态、登出） |
| `sessions` | 会话管理（列表、重置、删除） |
| `nodes` / `node` | 节点管理与控制 |
| `devices` | 设备配对与令牌管理 |
| `skills` | 技能管理（安装、更新、状态） |
| `cron` | 定时任务管理 |
| `browser` | 浏览器工具管理 |
| `approvals` | Exec 审批管理 |
| `logs` | Gateway 日志查看 |
| `system` | 系统事件、心跳和在线状态 |
| `tui` | 终端 UI |
| `sandbox` | 沙盒工具 |
| `configure` | 交互式配置向导 |
| `onboard` | 完整安装向导 |
| `doctor` | 诊断和安全检查 |
| `plugins` | 插件管理 |
| `hooks` / `webhooks` | Webhook 管理 |
| `pairing` | 配对助手 |
| `update` | CLI 更新助手 |

---

## 核心 Gateway 命令

### gateway - Gateway 服务控制

Gateway 命令用于管理 Clawdbot WebSocket Gateway 服务的生命周期。

#### gateway run

在前台运行 WebSocket Gateway。

```bash
clawdbot gateway run
```

#### gateway status

显示 Gateway 服务状态并探测运行中的 Gateway。

```bash
clawdbot gateway status [options]
```

**选项**：
- `--url <url>` - Gateway WebSocket URL（默认使用配置/远程/本地）
- `--token <token>` - Gateway token（如需要）
- `--password <password>` - Gateway 密码（密码认证）
- `--timeout <ms>` - 超时时间（毫秒），默认 10000
- `--no-probe` - 跳过 RPC 探测
- `--deep` - 扫描系统级服务
- `--json` - 输出 JSON 格式

**示例**：

```bash
# 查看本地 Gateway 状态
clawdbot gateway status

# 探测远程 Gateway（带超时）
clawdbot gateway status --url ws://remote:18789 --timeout 5000

# 深度扫描系统服务
clawdbot gateway status --deep

# JSON 输出（机器可读）
clawdbot gateway status --json
```

#### gateway install

安装 Gateway 服务（launchd/systemd/schtasks）。

```bash
clawdbot gateway install [options]
```

**选项**：
- `--port <port>` - Gateway 端口
- `--runtime <runtime>` - 守护进程运行时（node|bun），默认 node
- `--token <token>` - Gateway token（token 认证）
- `--force` - 强制重新安装/覆盖（如果已安装）
- `--json` - 输出 JSON 格式

#### gateway uninstall

卸载 Gateway 服务。

```bash
clawdbot gateway uninstall [options]
```

#### gateway start / stop / restart

启动、停止或重启 Gateway 服务。

```bash
clawdbot gateway start
clawdbot gateway stop
clawdbot gateway restart
```

---

### status - 系统状态

显示渠道健康状态和最近的会话接收者。

```bash
clawdbot status [options]
```

**选项**：
- `--json` - 输出 JSON 而非文本
- `--all` - 完整诊断（只读，可粘贴）
- `--usage` - 显示模型提供商使用量/配额快照
- `--deep` - 探测渠道（WhatsApp Web + Telegram + Discord + Slack + Signal）
- `--timeout <ms>` - 探测超时时间（毫秒），默认 10000
- `--verbose` - 详细日志
- `--debug` - `--verbose` 的别名

**示例**：

```bash
# 基本状态检查
clawdbot status

# 完整诊断
clawdbot status --all

# 显示使用量统计
clawdbot status --usage

# 深度探测所有渠道
clawdbot status --deep

# JSON 输出
clawdbot status --json
```

---

### health - Gateway 健康检查

从运行中的 Gateway 获取健康状态。

```bash
clawdbot health [options]
```

**选项**：
- `--json` - 输出 JSON 而非文本
- `--timeout <ms>` - 连接超时时间（毫秒），默认 10000
- `--verbose` - 详细日志
- `--debug` - `--verbose` 的别名

---

## Agent 命令

### agent - 运行 Agent 轮次

通过 Gateway 运行 Agent 轮次（使用 `--local` 运行嵌入式 Agent）。

```bash
clawdbot agent [options]
```

**选项**：
- `-m, --message <text>` - Agent 消息正文（必需）
- `-t, --to <number>` - 用于派生会话密钥的接收者号码（E.164 格式）
- `--session-id <id>` - 使用显式会话 ID
- `--agent <id>` - Agent ID（覆盖路由绑定）
- `--thinking <level>` - 思考级别：off | minimal | low | medium | high
- `--verbose <on|off>` - 为会话持久化 Agent 详细级别
- `--channel <channel>` - 投递渠道
- `--reply-to <target>` - 投递目标覆盖（与会话路由分离）
- `--reply-channel <channel>` - 投递渠道覆盖（与会话路由分离）
- `--reply-account <id>` - 投递账户 ID 覆盖
- `--local` - 在本地运行嵌入式 Agent（需要在 shell 中配置模型提供商 API 密钥）
- `--deliver` - 将 Agent 的回复发送回所选渠道
- `--json` - 输出结果为 JSON
- `--timeout <seconds>` - 覆盖 Agent 命令超时（秒），默认 600 或配置值

**示例**：

```bash
# 启动新会话
clawdbot agent --to +15555550123 --message "status update"

# 使用特定 Agent
clawdbot agent --agent ops --message "Summarize logs"

# 针对特定会话并设置思考级别
clawdbot agent --session-id 1234 --message "Summarize inbox" --thinking medium

# 启用详细日志和 JSON 输出
clawdbot agent --to +15555550123 --message "Trace logs" --verbose on --json

# 投递回复
clawdbot agent --to +15555550123 --message "Summon reply" --deliver

# 发送回复到不同渠道/目标
clawdbot agent --agent ops --message "Generate report" --deliver --reply-channel slack --reply-to "#reports"
```

---

### agents - 管理隔离的 Agent

管理隔离的 Agent（工作区 + 认证 + 路由）。

#### agents list

列出已配置的 Agent。

```bash
clawdbot agents list [options]
```

**选项**：
- `--json` - 输出 JSON 而非文本
- `--bindings` - 包含路由绑定

**示例**：

```bash
clawdbot agents list
clawdbot agents list --bindings
clawdbot agents list --json
```

#### agents add

添加新的隔离 Agent。

```bash
clawdbot agents add [name] [options]
```

**选项**：
- `--workspace <dir>` - 新 Agent 的工作区目录
- `--model <id>` - 此 Agent 的模型 ID
- `--agent-dir <dir>` - 此 Agent 的 Agent 状态目录
- `--bind <channel[:accountId]>` - 路由渠道绑定（可重复）
- `--non-interactive` - 禁用提示；需要 `--workspace`
- `--json` - 输出 JSON 摘要

**示例**：

```bash
# 交互式添加（推荐）
clawdbot agents add my-agent

# 非交互式添加
clawdbot agents add my-agent --workspace ~/clawd/workspaces/my-agent --model claude-sonnet-4-20250514
```

#### agents set-identity

更新 Agent 身份（名称/主题/emoji/头像）。

```bash
clawdbot agents set-identity [options]
```

**选项**：
- `--agent <id>` - 要更新的 Agent ID
- `--workspace <dir>` - 用于定位 Agent + IDENTITY.md 的工作区目录
- `--identity-file <path>` - 显式指定要读取的 IDENTITY.md 路径
- `--from-identity` - 从 IDENTITY.md 读取值
- `--name <name>` - 身份名称
- `--theme <theme>` - 身份主题
- `--emoji <emoji>` - 身份 emoji
- `--avatar <value>` - 身份头像（工作区路径、http(s) URL 或 data URI）
- `--json` - 输出 JSON 摘要

**示例**：

```bash
# 设置名称和 emoji
clawdbot agents set-identity --agent main --name "Clawd" --emoji "🦞"

# 设置头像路径
clawdbot agents set-identity --agent main --avatar avatars/clawd.png

# 从 IDENTITY.md 加载
clawdbot agents set-identity --workspace ~/clawd --from-identity

# 使用特定的 IDENTITY.md
clawdbot agents set-identity --identity-file ~/clawd/IDENTITY.md --agent main
```

#### agents delete

删除 Agent 并清理工作区/状态。

```bash
clawdbot agents delete <id> [options]
```

**选项**：
- `--force` - 跳过确认
- `--json` - 输出 JSON 摘要

**示例**：

```bash
clawdbot agents delete my-agent
clawdbot agents delete my-agent --force
```

---

## 模型管理命令

### models - 模型发现、扫描和配置

::: info
`models` 命令用于管理 AI 模型提供商、认证配置和模型别名。
:::

#### models list

列出模型（默认显示已配置的模型）。

```bash
clawdbot models list [options]
```

**选项**：
- `--all` - 显示完整模型目录
- `--local` - 过滤为本地模型
- `--provider <name>` - 按提供商过滤
- `--json` - 输出 JSON
- `--plain` - 纯文本行输出

**示例**：

```bash
clawdbot models list
clawdbot models list --all
clawdbot models list --provider anthropic --json
```

#### models status

显示已配置的模型状态。

```bash
clawdbot models status [options]
```

**选项**：
- `--json` - 输出 JSON
- `--plain` - 纯文本输出
- `--check` - 如果认证过期/已过期则非零退出（1=过期/缺失，2=即将过期）
- `--probe` - 探测已配置的提供商认证（实时）
- `--probe-provider <name>` - 仅探测单个提供商
- `--probe-profile <id>` - 仅探测特定认证配置文件 ID（可重复或逗号分隔）
- `--probe-timeout <ms>` - 每个探测的超时时间（毫秒）
- `--probe-concurrency <n>` - 并发探测数
- `--probe-max-tokens <n>` - 探测最大 tokens（尽力而为）

**示例**：

```bash
clawdbot models status
clawdbot models status --probe
clawdbot models status --check
clawdbot models status --probe-provider anthropic --json
```

#### models set

设置默认模型。

```bash
clawdbot models set <model>
```

**参数**：
- `<model>` - 模型 ID 或别名

**示例**：

```bash
clawdbot models set claude-sonnet-4-20250514
clawdbot models set gpt-4o
```

#### models set-image

设置图像生成模型。

```bash
clawdbot models set-image <model>
```

**参数**：
- `<model>` - 模型 ID 或别名

---

### models aliases - 模型别名管理

#### models aliases list

列出模型别名。

```bash
clawdbot models aliases list [options]
```

**选项**：
- `--json` - 输出 JSON
- `--plain` - 纯文本输出

#### models aliases add

添加或更新模型别名。

```bash
clawdbot models aliases add <alias> <model>
```

**参数**：
- `<alias>` - 别名名称
- `<model>` - 模型 ID 或别名

**示例**：

```bash
clawdbot models aliases add fast claude-3-5-sonnet-20241022
```

#### models aliases remove

删除模型别名。

```bash
clawdbot models aliases remove <alias>
```

---

### models auth - 模型认证管理

#### models auth add

添加模型认证配置。

```bash
clawdbot models auth add [options]
```

**选项**：
- `--provider <name>` - 提供商名称
- `--profile <id>` - 配置文件 ID
- `--key <key>` - API 密钥
- `--token <token>` - OAuth 令牌

#### models auth login

通过 OAuth 登录模型提供商。

```bash
clawdbot models auth login [options]
```

**选项**：
- `--provider <name>` - 提供商名称

**支持的提供商**：
- Anthropic（Claude）
- OpenAI
- Qwen Portal
- GitHub Copilot

**示例**：

```bash
clawdbot models auth login --provider anthropic
```

#### models auth paste-token

粘贴 API 令牌（用于已打开的认证流程）。

```bash
clawdbot models auth paste-token [options]
```

#### models auth setup-token

设置 API 令牌（手动输入）。

```bash
clawdbot models auth setup-token [options]
```

---

### models fallbacks - 模型备选配置

#### models fallbacks list

列出模型备选配置。

```bash
clawdbot models fallbacks list [options]
```

#### models fallbacks add

添加模型备选配置。

```bash
clawdbot models fallbacks add [options]
```

#### models fallbacks remove

删除模型备选配置。

```bash
clawdbot models fallbacks remove [options]
```

#### models fallbacks clear

清除所有模型备选配置。

```bash
clawdbot models fallbacks clear [options]
```

---

### models image-fallbacks - 图像模型备选配置

#### models image-fallbacks list

列出图像模型备选配置。

```bash
clawdbot models image-fallbacks list [options]
```

#### models image-fallbacks add

添加图像模型备选配置。

```bash
clawdbot models image-fallbacks add [options]
```

#### models image-fallbacks remove

删除图像模型备选配置。

```bash
clawdbot models image-fallbacks remove [options]
```

#### models image-fallbacks clear

清除所有图像模型备选配置。

```bash
clawdbot models image-fallbacks clear [options]
```

---

### models auth-order - 认证顺序管理

#### models auth-order get

获取认证顺序。

```bash
clawdbot models auth-order get [options]
```

#### models auth-order set

设置认证顺序。

```bash
clawdbot models auth-order set [options]
```

#### models auth-order clear

清除认证顺序。

```bash
clawdbot models auth-order clear [options]
```

---

## 消息命令

### message - 发送消息和渠道操作

::: info
`message` 命令用于向各种渠道发送消息和执行渠道特定操作。
:::

#### message send

发送文本/媒体消息。

```bash
clawdbot message send [options]
```

**选项**：
- `--target <target>` - 目标接收者（渠道特定格式）
- `--message <text>` - 消息文本
- `--media <path>` - 媒体文件路径
- `--channel <channel>` - 投递渠道
- `--reply-to <id>` - 回复到消息 ID

**示例**：

```bash
# 发送文本消息
clawdbot message send --target +15555550123 --message "Hi"

# 发送带媒体的消息
clawdbot message send --target +15555550123 --message "Check this" --media photo.jpg

# 回复消息
clawdbot message send --target 123 --message "Reply" --reply-to 456 --channel discord
```

#### message broadcast

发送广播消息到多个接收者。

```bash
clawdbot message broadcast [options]
```

#### message poll

创建投票（Discord 等）。

```bash
clawdbot message poll [options]
```

**选项**：
- `--channel <channel>` - 渠道（如 discord）
- `--target <target>` - 目标（如 channel:123）
- `--poll-question <text>` - 投票问题
- `--poll-option <text>` - 投票选项（可重复）

**示例**：

```bash
clawdbot message poll --channel discord --target channel:123 --poll-question "Snack?" --poll-option Pizza --poll-option Sushi
```

#### message react

对消息做出反应（添加 emoji）。

```bash
clawdbot message react [options]
```

**选项**：
- `--channel <channel>` - 渠道（如 discord）
- `--target <target>` - 消息 ID
- `--message-id <id>` - 消息 ID
- `--emoji <emoji>` - Emoji（如 ✅）

**示例**：

```bash
clawdbot message react --channel discord --target 123 --message-id 456 --emoji "✅"
```

#### message pin / unpin

固定/取消固定消息。

```bash
clawdbot message pin [options]
clawdbot message unpin [options]
```

#### message read / edit / delete

读取、编辑或删除消息。

```bash
clawdbot message read [options]
clawdbot message edit [options]
clawdbot message delete [options]
```

#### message permissions

管理消息权限。

```bash
clawdbot message permissions [options]
```

#### message search

搜索消息。

```bash
clawdbot message search [options]
```

#### message thread

线程操作（Telegram 等）。

```bash
clawdbot message thread [options]
```

#### message emoji / sticker

Emoji 和贴纸操作。

```bash
clawdbot message emoji [options]
clawdbot message sticker [options]
```

#### message discord-admin

Discord 管理操作（频道、角色等）。

```bash
clawdbot message discord-admin [options]
```

---

## 渠道管理命令

### channels - 渠道管理

管理渠道的登录、状态和登出。

```bash
clawdbot channels [command] [options]
```

**子命令**：
- `login` - 登录渠道账户
- `status` - 显示渠道状态
- `logout` - 登出渠道账户
- `list` - 列出所有渠道

**支持的渠道**：
- WhatsApp
- Telegram
- Slack
- Discord
- Google Chat
- Signal
- iMessage
- BlueBubbles
- Microsoft Teams
- Matrix
- Zalo
- Zalo Personal
- LINE

**示例**：

```bash
# 查看所有渠道状态
clawdbot channels status

# 登录 WhatsApp
clawdbot channels login whatsapp

# 登出 Telegram
clawdbot channels logout telegram
```

---

## 会话管理命令

### sessions - 会话管理

管理会话列表、重置、删除和压缩。

```bash
clawdbot sessions [command] [options]
```

**子命令**：
- `list` - 列出活跃会话
- `reset` - 重置会话（清空历史）
- `delete` - 删除会话
- `compact` - 压缩会话历史
- `history` - 获取会话历史
- `send` - 向其他会话发送消息
- `spawn` - 创建子 Agent 会话

**示例**：

```bash
# 列出所有会话
clawdbot sessions list

# 重置特定会话
clawdbot sessions reset --session-id 123

# 删除会话
clawdbot sessions delete --session-id 456

# 查看会话历史
clawdbot sessions history --session-id 789
```

---

## 节点管理命令

### nodes - 管理网关拥有的节点配对

管理 Gateway 拥有的节点配对。

```bash
clawdbot nodes [command] [options]
```

**子命令**：
- `status` - 节点状态
- `pair` - 配对新节点
- `unpair` - 取消配对节点
- `invoke` - 调用节点操作
- `notify` - 发送系统通知
- `canvas` - Canvas 操作
- `camera` - 相机操作
- `screen` - 屏幕录制
- `location` - 位置获取

---

### node - 节点控制

控制单个节点的操作。

```bash
clawdbot node [command] [options]
```

---

### devices - 设备配对和令牌管理

管理设备配对和访问令牌。

```bash
clawdbot devices [command] [options]
```

---

## 技能管理命令

### skills - 技能管理

管理技能的安装、更新和状态。

```bash
clawdbot skills [command] [options]
```

**子命令**：
- `list` - 列出技能
- `info` - 显示技能信息
- `check` - 检查技能依赖
- `install` - 安装技能
- `update` - 更新技能
- `uninstall` - 卸载技能

**示例**：

```bash
# 列出所有技能
clawdbot skills list

# 列出可用的技能
clawdbot skills list --eligible

# 查看技能信息
clawdbot skills info <skill-name>

# 检查技能依赖
clawdbot skills check
```

::: tip
使用 `npx clawdhub` 搜索、安装和同步技能。
:::

---

## 定时任务命令

### cron - Cron 调度器

管理定时任务。

```bash
clawdbot cron [command] [options]
```

**子命令**：
- `list` - 列出定时任务
- `add` - 添加定时任务
- `remove` - 删除定时任务
- `run` - 手动运行定时任务
- `logs` - 查看定时任务日志

**示例**：

```bash
# 列出所有定时任务
clawdbot cron list

# 添加定时任务
clawdbot cron add --cron "0 9 * * *" --message "Good morning"

# 手动运行任务
clawdbot cron run <job-id>
```

---

## 浏览器命令

### browser - 浏览器工具管理

管理浏览器自动化工具。

```bash
clawdbot browser [command] [options]
```

**子命令**：
- `status` - 浏览器状态
- `inspect` - 检查浏览器实例
- `actions` - 执行浏览器操作
- `observe` - 观察浏览器事件
- `debug` - 调试浏览器
- `extension` - 扩展管理

---

## 审批命令

### approvals - Exec 审批

管理 Shell 命令执行的审批。

```bash
clawdbot approvals [command] [options]
```

**子命令**：
- `list` - 列出审批规则
- `add` - 添加审批规则
- `remove` - 删除审批规则
- `clear` - 清除所有规则

---

## 其他管理命令

### logs - Gateway 日志

查看 Gateway 日志。

```bash
clawdbot logs [options]
```

**选项**：
- `--follow` - 跟踪日志输出
- `--tail <n>` - 显示最后 n 行

---

### system - 系统事件

系统事件、心跳和在线状态。

```bash
clawdbot system [command] [options]
```

**子命令**：
- `events` - 系统事件
- `heartbeat` - 心跳状态
- `presence` - 在线状态

---

### tui - 终端 UI

启动终端 UI。

```bash
clawdbot tui
```

---

### sandbox - 沙盒工具

沙盒隔离工具。

```bash
clawdbot sandbox [command] [options]
```

---

### configure - 交互式配置

交互式提示以设置凭据、设备和 Agent 默认值。

```bash
clawdbot configure [options]
```

**选项**：
- `--section <section>` - 配置部分（可重复）

**配置部分**：
- credentials
- devices
- agent
- channels
- tools
- 等等

---

### onboard - 完整安装向导

运行完整的首次安装向导。

```bash
clawdbot onboard
```

---

### doctor - 诊断和安全检查

运行诊断和安全检查。

```bash
clawdbot doctor [options]
```

**子命令**：
- `check` - 运行健康检查
- `diagnose` - 诊断问题
- `security` - 安全检查

---

### plugins - 插件管理

插件管理。

```bash
clawdbot plugins [command] [options]
```

---

### hooks / webhooks - Webhook 管理

Webhook 工具。

```bash
clawdbot hooks [command] [options]
clawdbot webhooks [command] [options]
```

---

### pairing - 配对助手

配对助手工具。

```bash
clawdbot pairing [command] [options]
```

---

### directory - 目录命令

目录管理命令。

```bash
clawdbot directory [command] [options]
```

---

### security - 安全助手

安全助手工具。

```bash
clawdbot security [command] [options]
```

---

### update - CLI 更新助手

CLI 更新助手。

```bash
clawdbot update [command] [options]
```

---

### dns - DNS 助手

DNS 辅助工具。

```bash
clawdbot dns [command] [options]
```

---

### docs - 文档助手

文档辅助工具。

```bash
clawdbot docs [command] [options]
```

---

## 常用选项说明

以下选项在多个命令中通用：

### JSON 输出

大多数命令支持 `--json` 选项，输出机器可读的 JSON 格式。

```bash
clawdbot status --json
clawdbot models list --json
clawdbot sessions list --json
```

### 超时设置

网络相关命令通常支持 `--timeout <ms>` 选项。

```bash
clawdbot gateway status --timeout 5000
clawdbot health --timeout 3000
```

### 详细日志

调试时使用 `--verbose` 或 `--debug` 选项。

```bash
clawdbot status --verbose
clawdbot agent --debug --message "test"
```

---

## 帮助和文档

### 查看帮助

所有命令和子命令都支持 `--help` 选项。

```bash
clawdbot --help              # 显示主帮助
clawdbot gateway --help       # 显示 gateway 命令帮助
clawdbot models status --help # 显示 models status 子命令帮助
```

### 在线文档

许多命令在帮助输出中包含在线文档链接。

---

## 故障排除

### 命令未找到

如果命令未找到，确保：
1. Clawdbot 已正确安装
2. 使用的是最新版本：`clawdbot update`
3. 命令拼写正确

### 连接失败

如果 Gateway 连接失败：
1. 检查 Gateway 是否运行：`clawdbot gateway status`
2. 验证端口配置
3. 检查认证凭据

---

## 本课小结

本课提供了 Clawdbot CLI 的完整命令参考，包括：
- 核心 Gateway 命令（gateway、status、health）
- Agent 管理命令（agent、agents）
- 模型配置命令（models、models auth、models aliases）
- 消息发送命令（message）
- 渠道管理命令（channels）
- 会话管理命令（sessions）
- 节点管理命令（nodes、node、devices）
- 技能管理命令（skills）
- 定时任务命令（cron）
- 其他管理命令（logs、system、configure、doctor 等）

---

## 下一课预告

> 下一课我们学习 **[性能优化](../performance-optimization/)**。
>
> 你会学到：
> - 如何优化 Gateway 性能
> - 减少延迟的方法
> - 内存管理技巧
> - 并发控制策略

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| CLI 主程序 | [`src/cli/program.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program.ts) | 全文    |
| 命令注册   | [`src/cli/program/register.subclis.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.subclis.ts) | 30-225  |
| Agent 命令 | [`src/cli/program/register.agent.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.agent.ts) | 20-210  |
| Message 命令 | [`src/cli/program/register.message.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.message.ts) | 24-68   |
| Models 命令 | [`src/cli/models-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/models-cli.ts) | 38-150  |
| Gateway 命令 | [`src/cli/gateway-cli/register.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/gateway-cli/register.ts) | 98-150  |
| Status/Health 命令 | [`src/cli/program/register.status-health-sessions.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.status-health-sessions.ts) | 27-100  |
| Configure 命令 | [`src/cli/program/register.configure.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/program/register.configure.ts) | 12-52   |
| Skills 命令 | [`src/cli/skills-cli.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/skills-cli.ts) | 16-100  |
| Nodes 命令 | [`src/cli/nodes-cli/register.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/nodes-cli/register.ts) | 13-32   |

**关键命令组注册**：
- 24 个主要命令组：gateway, daemon, logs, system, models, approvals, nodes, devices, node, sandbox, tui, cron, dns, docs, hooks, webhooks, pairing, plugins, channels, directory, security, skills, update, acp

</details>
