---
title: "CLI 命令参考 - 完整命令手册 | OpenClaw 教程"
sidebarTitle: "CLI 命令参考"
subtitle: "CLI 命令参考 - 完整命令手册"
description: "OpenClaw CLI 完整命令参考手册，包含所有命令的详细说明、参数选项和使用示例。"
tags:
  - "CLI"
  - "命令"
  - "参考"
order: 170
---

# CLI 命令参考 - 完整命令手册

## 全局选项

```bash
openclaw [options] [command]

Options:
  -V, --version           显示版本号
  -h, --help              显示帮助信息
  --config <path>         指定配置文件路径
  --json                  以 JSON 格式输出
  --verbose               显示详细输出
```

## 核心命令

### agent - 与 AI 助手对话

向指定会话或默认 Agent 发送消息。

```bash
openclaw agent [options]

Options:
  -m, --message <text>        消息内容（必需）
  -t, --to <number>           目标电话号码（E.164 格式）
  -s, --session-id <id>       会话 ID
  -k, --session-key <key>     会话密钥
  -a, --agent-id <id>         Agent ID
  --thinking <level>          思考级别: low, medium, high, xhigh
  --thinking-once <level>     仅本次思考级别
  --verbose <level>           详细级别: on, full, off
  --timeout <seconds>         超时时间（秒）
  --deliver                   发送结果到频道
  --images <paths...>         附加图片
  --json                      JSON 格式输出
```

**示例**

```bash
# 基础用法
openclaw agent -m "你好"

# 指定目标和思考级别
openclaw agent -t "+86138xxxxxxxx" -m "分析数据" --thinking high

# 带图片
openclaw agent -m "描述这张图片" --images ./photo.jpg

# 一次性高思考级别
openclaw agent -m "复杂问题" --thinking-once high
```

### gateway - 管理 Gateway 服务

控制 Gateway 服务的启动、停止和配置。

```bash
openclaw gateway [subcommand]

Subcommands:
  run [options]              启动 Gateway 服务
  stop                       停止 Gateway 服务
  restart                    重启 Gateway 服务
  status                     查看 Gateway 状态
  config                     管理 Gateway 配置

Options for 'run':
  -p, --port <port>          指定端口（默认: 18789）
  --bind <mode>              绑定模式: loopback, lan, tailnet, auto
  --host <host>              指定绑定主机
  --auth.mode <mode>         认证模式: token, password, off
  --auth.token <token>       Token 认证
  --auth.password <pass>     密码认证
  --control-ui <bool>        启用/禁用 Control UI
  --openai <bool>            启用/禁用 OpenAI API
  --openresponses <bool>      启用/禁用 OpenResponses API
```

**示例**

```bash
# 启动 Gateway
openclaw gateway run

# 指定端口和绑定
openclaw gateway run --port 18790 --bind loopback

# 带认证启动
openclaw gateway run --auth.mode token --auth.token "xxx"
```

### config - 配置管理

管理 OpenClaw 配置文件。

```bash
openclaw config [subcommand]

Subcommands:
  get [path]                 获取配置值
  set <path> <value>         设置配置值
  delete <path>             删除配置项
  list                       列出所有配置
  validate                   验证配置有效性
  import <file>             从文件导入配置
  export [file]              导出配置到文件
```

**示例**

```bash
# 获取配置
openclaw config get gateway.mode
openclaw config get channels.whatsapp.enabled

# 设置配置
openclaw config set gateway.mode local
openclaw config set channels.telegram.botToken "xxx"

# 删除配置
openclaw config delete channels.discord

# 验证配置
openclaw config validate

# 导出/导入
openclaw config export backup.json
openclaw config import backup.json
```

### channels - 频道管理

管理消息频道的配置和状态。

```bash
openclaw channels [subcommand]

Subcommands:
  list                       列出所有频道
  status [channel]           查看频道状态
  add <channel>             添加频道
  remove <channel>          移除频道
  enable <channel>          启用频道
  disable <channel>         禁用频道
  config <channel>          配置频道

Supported channels:
  whatsapp, telegram, discord, slack
  signal, imessage, irc, googlechat
```

**示例**

```bash
# 列出频道
openclaw channels list

# 查看状态
openclaw channels status
openclaw channels status whatsapp

# WhatsApp 登录
openclaw channels add whatsapp

# 启用/禁用
openclaw channels enable telegram
openclaw channels disable discord
```

### message - 消息操作

发送消息到指定频道。

```bash
openclaw message [action] [options]

Actions:
  send                       发送消息
  poll                       发送投票

Options:
  -t, --to <target>          目标地址
  --text <text>              消息内容
  --channel <channel>        频道
  --action <action>          消息动作
  --json                      JSON 格式输出
  --dry-run                   模拟运行
```

**示例**

```bash
# 发送消息
openclaw message send --to "+86138xxxxxxxx" --text "Hello"

# 指定频道
openclaw message send --channel whatsapp --to "..." --text "Hi"

# 模拟发送
openclaw message send --text "Test" --dry-run
```

### models - 模型管理

管理 AI 模型提供商和模型。

```bash
openclaw models [subcommand]

Subcommands:
  list                       列出可用模型
  test [model]               测试模型连接
  add <provider>            添加模型提供商
  remove <provider>         移除模型提供商
  set-default <model>       设置默认模型
```

**示例**

```bash
# 列出模型
openclaw models list

# 测试模型
openclaw models test anthropic/claude-3-5-sonnet

# 设置默认模型
openclaw models set-default openai/gpt-4o
```

### skills - 技能管理

管理 OpenClaw 技能。

```bash
openclaw skills [subcommand]

Subcommands:
  list                       列出所有技能
  info <skill>               查看技能详情
  enable <skill...>          启用技能
  disable <skill...>         禁用技能
  install <source>          安装技能
  uninstall <skill>         卸载技能
  update <skill>             更新技能
```

**示例**

```bash
# 列出技能
openclaw skills list

# 启用技能
openclaw skills enable postgres redis

# 安装技能
openclaw skills install ./my-skill
openclaw skills install https://github.com/user/skill.git

# 查看详情
openclaw skills info postgres
```

### cron - 定时任务管理

管理 Cron 定时任务。

```bash
openclaw cron [subcommand]

Subcommands:
  list                       列出所有任务
  show <name>                查看任务详情
  create [options]           创建任务
  delete <name>              删除任务
  run <name>                  立即运行任务
  pause <name>               暂停任务
  resume <name>              恢复任务
  status                     查看 Cron 状态
  upcoming                   查看即将执行的任务

Options for 'create':
  -n, --name <name>          任务名称
  -s, --schedule <cron>      Cron 表达式
  -a, --agent <agent>        Agent ID
  -m, --message <text>       任务消息
  --thinking <level>          思考级别
  --timeout <seconds>         超时时间
  --retries <count>           重试次数
  --deliver-to <target>       结果投递目标
```

**示例**

```bash
# 创建任务
openclaw cron create \
  --name "daily-report" \
  --schedule "0 9 * * *" \
  --message "生成日报"

# 列出任务
openclaw cron list

# 立即运行
openclaw cron run daily-report
```

### doctor - 诊断修复

运行系统诊断并修复问题。

```bash
openclaw doctor [options]

Options:
  --non-interactive          非交互模式
  --report                   生成诊断报告
  --fix                      自动修复问题
  --skip-checks <checks>     跳过指定检查
```

**示例**

```bash
# 运行诊断
openclaw doctor

# 非交互模式
openclaw doctor --non-interactive

# 生成报告
openclaw doctor --report > report.txt
```

### status - 查看状态

查看系统各组件状态。

```bash
openclaw status [options]

Options:
  --all                      显示所有信息
  --gateway                  仅显示 Gateway 状态
  --channels                 显示频道状态
  --models                   显示模型状态
  --probe                    主动探测状态
  --stats                    显示统计信息
```

**示例**

```bash
# 查看状态
openclaw status

# 详细状态
openclaw status --all

# 带探测
openclaw status --probe
```

### logs - 查看日志

查看系统日志。

```bash
openclaw logs [options]

Options:
  --follow                   实时跟踪
  --lines <n>                显示行数
  --level <level>            日志级别: error, warn, info, debug
  --channel <channel>        频道过滤
  --since <time>             起始时间
  --until <time>             结束时间
```

**示例**

```bash
# 查看日志
openclaw logs

# 实时跟踪
openclaw logs --follow

# 频道日志
openclaw logs --channel whatsapp

# 错误日志
openclaw logs --level error
```

### browser - 浏览器控制

管理浏览器配置文件和操作。

```bash
openclaw browser [subcommand]

Subcommands:
  status                     查看浏览器状态
  profile [action]           管理配置文件
  navigate <url>             导航到 URL
  screenshot [options]       截图
  tabs [action]              管理标签页
```

**示例**

```bash
# 查看状态
openclaw browser status

# 创建配置文件
openclaw browser profile create work

# 截图
openclaw browser screenshot --full-page
```

### pairing - DM 配对管理

管理用户配对状态。

```bash
openclaw pairing [subcommand]

Subcommands:
  list                       列出已配对用户
  remove <id>                取消配对
  clear                      清除所有配对
  history                    查看配对历史
```

### sessions - 会话管理

管理 AI 对话会话。

```bash
openclaw sessions [subcommand]

Subcommands:
  list                       列出会话
  show <key>                 查看会话详情
  delete <key>                删除会话
  prune [options]            清理旧会话
  export <key> [file]        导出会话
```

**示例**

```bash
# 列出会话
openclaw sessions list

# 清理旧会话
openclaw sessions prune --older-than 7d
```

## 快捷命令

| 快捷命令 | 等效命令 | 说明 |
|----------|----------|------|
| `openclaw g` | `openclaw gateway` | Gateway 快捷方式 |
| `openclaw c` | `openclaw config` | Config 快捷方式 |
| `openclaw s` | `openclaw status` | Status 快捷方式 |
| `openclaw m` | `openclaw message` | Message 快捷方式 |
| `openclaw a` | `openclaw agent` | Agent 快捷方式 |

## 环境变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `OPENCLAW_CONFIG_PATH` | 配置文件路径 | `~/.openclaw/openclaw.json` |
| `OPENCLAW_LOG_LEVEL` | 日志级别 | `debug`, `info`, `warn`, `error` |
| `OPENCLAW_HOME` | OpenClaw 主目录 | `~/.openclaw` |
| `OPENCLAW_GATEWAY_PORT` | Gateway 端口 | `18789` |

## 退出码

| 码 | 含义 |
|----|------|
| 0 | 成功 |
| 1 | 一般错误 |
| 2 | 配置错误 |
| 3 | 网络错误 |
| 4 | 认证错误 |
| 5 | 超时 |
| 130 | 用户中断 (Ctrl+C) |

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 命令注册 | [`src/cli/program/command-registry.ts`](https://github.com/openclaw/openclaw/blob/main/src/cli/program/command-registry.ts) | - |
| Agent 命令 | [`src/commands/agent.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/agent.ts) | 64-529 |
| Gateway 命令 | [`src/commands/configure.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/configure.gateway.ts) | - |
| Doctor 命令 | [`src/commands/doctor.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor.ts) | 65-300 |
| Status 命令 | [`src/commands/status.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/status.ts) | - |
| 消息命令 | [`src/commands/message.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/message.ts) | 14-67 |
| 模型命令 | [`src/commands/models.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/models.ts) | - |

**命令目录结构**：
- `src/commands/` - 所有命令实现
- `src/cli/program/` - CLI 程序入口和命令注册

</details>
