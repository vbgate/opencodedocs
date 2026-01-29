---
title: "Clawdbot 完整配置参考：所有配置项详解 | 配置教程"
sidebarTitle: "掌控所有配置"
subtitle: "完整配置参考"
description: "学习 Clawdbot 完整配置系统。本参考文档详细说明所有配置节、字段类型、默认值和实用示例，帮助你自定义和优化 Clawdbot 的行为。包括认证配置、模型设置、渠道选项、工具策略、沙箱隔离、会话管理、消息处理、Cron 任务、Hooks、Gateway、Tailscale、Skills、Plugins、Node Host、Canvas、Talk、广播、日志、更新、UI 等 50+ 个核心配置节，涵盖从基础到高级的所有选项。适合快速查阅所有可用配置项，定位需要的设置，提升使用效率，实现个性化配置。了解每个配置项的作用和影响，快速找到需要的选项，避免配置错误。无论新手还是高级用户，都能从中快速找到需要的配置项，提升工作效率，解决配置难题。配置参考文档帮助你全面了解和掌握 Clawdbot 的配置系统，实现个性化定制。适合查阅、调试和高级配置。推荐所有用户阅读本配置参考，了解每个配置项的含义和用法，充分利用 Clawdbot 的强大功能。"
tags:
  - "配置"
  - "参考"
  - "完整指南"
order: 340
---

# 完整配置参考

Clawdbot 读取可选的 JSON5 配置文件（支持注释和尾随逗号）：`~/.clawdbot/clawdbot.json`

如果配置文件缺失，Clawdbot 使用安全的默认值（嵌入式 Pi agent + 按发送者会话 + 工作区 `~/clawd`）。你通常只需要配置来：
- 限制谁可以触发机器人（`channels.whatsapp.allowFrom`，`channels.telegram.allowFrom` 等）
- 控制群组白名单 + 提及行为（`channels.whatsapp.groups`，`channels.telegram.groups`，`channels.discord.guilds`）
- 自定义消息前缀（`messages`）
- 设置代理的工作区（`agents.defaults.workspace` 或 `agents.list[].workspace`）
- 调整嵌入式代理默认值（`agents.defaults`）和会话行为（`session`）
- 设置每个代理的身份（`agents.list[].identity`）

::: tip 新手入门？
如果你是第一次配置，建议先阅读 [快速开始](../../start/getting-started/) 和 [向导式配置](../../start/onboarding-wizard/) 教程。

## 配置验证机制

Clawdbot 只接受完全匹配 Schema 的配置。未知键、格式错误的类型或无效值会导致 Gateway **拒绝启动**以确保安全。

当验证失败时：
- Gateway 不会启动
- 只允许诊断命令（例如：`clawdbot doctor`，`clawdbot logs`，`clawdbot health`，`clawdbot status`，`clawdbot service`，`clawdbot help`）
- 运行 `clawdbot doctor` 查看确切的问题
- 运行 `clawdbot doctor --fix`（或 `--yes`）应用迁移/修复

::: warning 警告
Doctor 除非你明确选择 `--fix`/`--yes`，否则不会写入任何更改。

## 配置文件结构

Clawdbot 配置文件是一个分层对象，包含以下主要配置节：

```json5
{
  // 核心配置
  meta: {},
  env: {},
  wizard: {},
  diagnostics: {},
  logging: {},
  update: {},
  
  // 功能配置
  browser: {},
  ui: {},
  auth: {},
  models: {},
  nodeHost: {},
  agents: {},
  tools: {},
  bindings: {},
  broadcast: {},
  audio: {},
  media: {},
  messages: {},
  commands: {},
  approvals: {},
  session: {},
  cron: {},
  hooks: {},
  web: {},
  channels: {},
  discovery: {},
  canvasHost: {},
  talk: {},
  gateway: {},
  skills: {},
  plugins: {}
}
```

## 核心配置

### `meta`

配置文件的元数据（由 CLI 向导自动写入）。

```json5
{
  meta: {
    lastTouchedVersion: "2026.1.24",
    lastTouchedAt: "2026-01-27T00:00:00.000Z"
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `lastTouchedVersion` | string | - | 最后修改此配置的 Clawdbot 版本 |
| `lastTouchedAt` | string | - | 最后修改此配置的时间（ISO 8601） |

### `env`

环境变量配置和 shell 环境导入。

```json5
{
  env: {
    shellEnv: {
      enabled: true,
      timeoutMs: 15000
    },
    vars: {
      OPENAI_API_KEY: "sk-...",
      ANTHROPIC_API_KEY: "sk-ant-..."
    },
    // 任意键值对
    CUSTOM_VAR: "value"
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `shellEnv.enabled` | boolean | `false` | 是否从登录 shell 导入环境变量（仅导入缺失的键） |
| `shellEnv.timeoutMs` | number | `15000` | shell 环境导入超时（毫秒） |
| `vars` | object | - | 内联环境变量（键值对） |

**注意**：`vars` 仅在进程环境变量中缺失对应键时应用。永远不会覆盖现有环境变量。

::: info 环境变量优先级
进程环境变量 > `.env` 文件 > `~/.clawdbot/.env` > 配置文件中的 `env.vars`

### `wizard`

由 CLI 向导（`onboard`，`configure`，`doctor`）写入的元数据。

```json5
{
  wizard: {
    lastRunAt: "2026-01-01T00:00:00.000Z",
    lastRunVersion: "2026.1.4",
    lastRunCommit: "abc1234",
    lastRunCommand: "configure",
    lastRunMode: "local"
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `lastRunAt` | string | - | 最后运行向导的时间 |
| `lastRunVersion` | string | - | 最后运行向导时的 Clawdbot 版本 |
| `lastRunCommit` | string | - | 最后运行向导时的 Git commit hash |
| `lastRunCommand` | string | - | 最后运行的向导命令 |
| `lastRunMode` | string | - | 向导运行模式（`local` \| `remote`） |

### `diagnostics`

诊断遥测和 OpenTelemetry 配置。

```json5
{
  diagnostics: {
    enabled: true,
    flags: ["debug-mode", "verbose-tool-calls"],
    otel: {
      enabled: false,
      endpoint: "https://otel.example.com",
      protocol: "http/protobuf",
      headers: {
        "X-Custom-Header": "value"
      },
      serviceName: "clawdbot",
      traces: true,
      metrics: true,
      logs: false,
      sampleRate: 0.1,
      flushIntervalMs: 5000
    },
    cacheTrace: {
      enabled: false,
      filePath: "/tmp/clawdbot/trace-cache.json",
      includeMessages: true,
      includePrompt: true,
      includeSystem: false
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | `false` | 启用诊断功能 |
| `flags` | string[] | - | 诊断标志列表 |
| `otel.enabled` | boolean | `false` | 启用 OpenTelemetry 遥测 |
| `otel.endpoint` | string | - | OTEL 收集器端点 |
| `otel.protocol` | string | - | OTEL 协议（`http/protobuf` \| `grpc`） |
| `otel.headers` | object | - | OTEL 请求头 |
| `otel.serviceName` | string | - | OTEL 服务名称 |
| `otel.traces` | boolean | - | 收集追踪数据 |
| `otel.metrics` | boolean | - | 收集指标数据 |
| `otel.logs` | boolean | - | 收集日志数据 |
| `otel.sampleRate` | number | - | 采样率（0-1） |
| `otel.flushIntervalMs` | number | - | 刷新间隔（毫秒） |
| `cacheTrace.enabled` | boolean | `false` | 启用追踪缓存 |
| `cacheTrace.filePath` | string | - | 追踪缓存文件路径 |
| `cacheTrace.includeMessages` | boolean | - | 在缓存中包含消息 |
| `cacheTrace.includePrompt` | boolean | - | 在缓存中包含提示 |
| `cacheTrace.includeSystem` | boolean | - | 在缓存中包含系统提示 |

### `logging`

日志配置。

```json5
{
  logging: {
    level: "info",
    file: "/tmp/clawdbot/clawdbot.log",
    consoleLevel: "info",
    consoleStyle: "pretty",
    redactSensitive: "tools",
    redactPatterns: [
      "\\bTOKEN\\b\\s*[=:]\\s*([\"']?)([^\\s\"']+)\\1",
      "/\\bsk-[A-Za-z0-9_-]{8,}\\b/gi"
    ]
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `level` | string | `info` | 日志级别（`silent` \| `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`） |
| `file` | string | - | 日志文件路径（默认：`/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`） |
| `consoleLevel` | string | `info` | 控制台日志级别（与 `level` 选项相同） |
| `consoleStyle` | string | `pretty` | 控制台输出样式（`pretty` \| `compact` \| `json`） |
| `redactSensitive` | string | `tools` | 敏感信息脱敏模式（`off` \| `tools`） |
| `redactPatterns` | string[] | - | 自定义脱敏正则模式（覆盖默认值） |

::: tip 日志文件路径
如果你想要一个稳定的日志文件路径，设置 `logging.file` 为 `/tmp/clawdbot/clawdbot.log`（而不是默认的每日轮转路径）。

### `update`

更新通道和自动检查配置。

```json5
{
  update: {
    channel: "stable",
    checkOnStart: true
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `channel` | string | `stable` | 更新通道（`stable` \| `beta` \| `dev`） |
| `checkOnStart` | boolean | - | 启动时检查更新 |

### `browser`

浏览器自动化配置（基于 Playwright）。

```json5
{
  browser: {
    enabled: true,
    controlUrl: "ws://localhost:9222",
    controlToken: "secret-token",
    cdpUrl: "http://localhost:9222",
    remoteCdpTimeoutMs: 10000,
    remoteCdpHandshakeTimeoutMs: 5000,
    color: "#3b82f6",
    executablePath: "/usr/bin/google-chrome",
    headless: true,
    noSandbox: false,
    attachOnly: false,
    defaultProfile: "default",
    snapshotDefaults: {
      mode: "efficient"
    },
    profiles: {
      "profile-1": {
        cdpPort: 9222,
        cdpUrl: "http://localhost:9222",
        driver: "clawd",
        color: "#ff0000"
      }
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | - | 启用浏览器工具 |
| `controlUrl` | string | - | 浏览器控制 WebSocket URL |
| `controlToken` | string | - | 浏览器控制认证令牌 |
| `cdpUrl` | string | - | Chrome DevTools Protocol URL |
| `remoteCdpTimeoutMs` | number | - | 远程 CDP 超时（毫秒） |
| `remoteCdpHandshakeTimeoutMs` | number | - | 远程 CDP 握手超时（毫秒） |
| `color` | string | - | UI 中显示的十六进制颜色 |
| `executablePath` | string | - | 浏览器可执行文件路径 |
| `headless` | boolean | - | 无头模式 |
| `noSandbox` | boolean | - | 禁用沙箱（Linux 上需要） |
| `attachOnly` | boolean | - | 仅附加到现有浏览器实例 |
| `defaultProfile` | string | - | 默认配置文件 ID |
| `snapshotDefaults.mode` | string | - | 快照模式（`efficient`） |
| `profiles` | object | - | 配置文件映射（键：配置文件名称，值：配置） |

**Profile 配置**：
- `cdpPort`：CDP 端口（1-65535）
- `cdpUrl`：CDP URL
- `driver`：驱动类型（`clawd` \| `extension`）
- `color`：配置文件的十六进制颜色

::: warning 浏览器 Profile 命名
Profile 名称必须只包含小写字母、数字和连字符：`^[a-z0-9-]+$`

### `ui`

UI 自定义配置（Control UI、WebChat）。

```json5
{
  ui: {
    seamColor: "#3b82f6",
    assistant: {
      name: "Clawdbot",
      avatar: "avatars/clawdbot.png"
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `seamColor` | string | - | Seam 颜色的十六进制值 |
| `assistant.name` | string | - | 助手显示名称（最多 50 字符） |
| `assistant.avatar` | string | - | 助手头像路径或 URL（最多 200 字符） |

**头像支持**：
- 工作区相对路径（必须在代理工作区内）
- `http(s)` URL
- `data:` URI

## 认证配置

### `auth`

认证配置文件元数据（不存储密钥，仅映射配置文件到提供商和模式）。

```json5
{
  auth: {
    profiles: {
      "anthropic:me@example.com": {
        provider: "anthropic",
        mode: "oauth",
        email: "me@example.com"
      },
      "anthropic:work": {
        provider: "anthropic",
        mode: "api_key"
      },
      "openai:default": {
        provider: "openai",
        mode: "api_key"
      }
    },
    order: {
      anthropic: ["anthropic:me@example.com", "anthropic:work"],
      openai: ["openai:default"]
    },
    cooldowns: {
      billingBackoffHours: 24,
      billingBackoffHoursByProvider: {
        anthropic: 48
      },
      billingMaxHours: 168,
      failureWindowHours: 1
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `profiles` | object | - | 配置文件映射（键：配置文件 ID，值：配置） |
| `profiles.<profileId>.provider` | string | - | 提供商名称 |
| `profiles.<profileId>.mode` | string | - | 认证模式（`api_key` \| `oauth` \| `token`） |
| `profiles.<profileId>.email` | string | - | OAuth 邮箱（可选） |
| `order` | object | - | 提供商故障转移顺序 |
| `cooldowns.billingBackoffHours` | number | - | 计费问题退避时长（小时） |
| `cooldowns.billingBackoffHoursByProvider` | object | - | 每个提供商的计费退避时长 |
| `cooldowns.billingMaxHours` | number | - | 最大计费退避时长（小时） |
| `cooldowns.failureWindowHours` | number | - | 失败窗口时长（小时） |

::: tip Claude Code CLI 自动同步
Clawdbot 自动将 OAuth 令牌从 Claude Code CLI 同步到 `auth-profiles.json`（当存在于 Gateway 主机上时）：
- macOS：Keychain 项目 "Claude Code-credentials"（选择"始终允许"以避免 launchd 提示）
- Linux/Windows：`~/.claude/.credentials.json`

**认证存储位置**：
- `<agentDir>/auth-profiles.json`（默认：`~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`）
- 遗留导入：`~/.clawdbot/credentials/oauth.json`

**嵌入代理运行时缓存**：
- `<agentDir>/auth.json`（自动管理；不要手动编辑）

## 模型配置

### `models`

AI 模型提供商和配置。

```json5
{
  models: {
    mode: "merge",
    providers: {
      "openai": {
        baseUrl: "https://api.openai.com/v1",
        apiKey: "${OPENAI_API_KEY}",
        auth: "api_key",
        api: "openai-completions",
        headers: {
          "X-Custom-Header": "value"
        },
        models: [
          {
            id: "gpt-4",
            name: "GPT-4",
            api: "openai-completions",
            reasoning: false,
            input: ["text"],
            cost: {
              input: 0.000005,
              output: 0.000015,
              cacheRead: 0.000001,
              cacheWrite: 0.000005
            },
            contextWindow: 128000,
            maxTokens: 4096,
            compat: {
              supportsStore: true,
              supportsDeveloperRole: true,
              supportsReasoningEffort: true,
              maxTokensField: "max_tokens"
            }
          }
        ]
      },
      "anthropic": {
        apiKey: "${ANTHROPIC_API_KEY}",
        auth: "oauth",
        api: "anthropic-messages",
        models: [
          {
            id: "claude-opus-4-5",
            name: "Claude Opus 4.5",
            api: "anthropic-messages",
            reasoning: true,
            input: ["text", "image"],
            contextWindow: 200000,
            maxTokens: 8192
          }
        ]
      },
      "ollama": {
        baseUrl: "http://localhost:11434",
        apiKey: "ollama"
      },
      "vercel-gateway": {
        apiKey: "${VERCEL_GATEWAY_API_KEY}"
      }
    },
    bedrockDiscovery: {
      enabled: false,
      region: "us-east-1",
      providerFilter: ["anthropic"],
      refreshInterval: 3600000,
      defaultContextWindow: 200000,
      defaultMaxTokens: 4096
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `mode` | string | - | 模型合并模式（`merge` \| `replace`） |
| `providers` | object | - | 提供商映射（键：提供商 ID，值：提供商配置） |
| `providers.<providerId>.baseUrl` | string | - | API 基础 URL |
| `providers.<providerId>.apiKey` | string | - | API 密钥（支持环境变量替换） |
| `providers.<providerId>.auth` | string | - | 认证类型（`api_key` \| `aws-sdk` \| `oauth` \| `token`） |
| `providers.<providerId>.api` | string | - | API 类型（`openai-completions` \| `openai-responses` \| `anthropic-messages` \| `google-generative-ai` \| `github-copilot` \| `bedrock-converse-stream`） |
| `providers.<providerId>.authHeader` | boolean | - | 是否使用认证头 |
| `providers.<providerId>.headers` | object | - | 自定义 HTTP 头 |
| `providers.<providerId>.models` | array | - | 模型定义列表 |
| `bedrockDiscovery.enabled` | boolean | `false` | 启用 AWS Bedrock 模型发现 |
| `bedrockDiscovery.region` | string | - | AWS 区域 |
| `bedrockDiscovery.providerFilter` | string[] | - | Bedrock 提供商过滤器 |
| `bedrockDiscovery.refreshInterval` | number | - | 刷新间隔（毫秒） |
| `bedrockDiscovery.defaultContextWindow` | number | - | 默认上下文窗口 |
| `bedrockDiscovery.defaultMaxTokens` | number | - | 默认最大令牌数 |

**模型定义字段**：
- `id`：模型 ID（必填）
- `name`：模型显示名称（必填）
- `api`：API 类型
- `reasoning`：是否为推理模型
- `input`：支持的输入类型（`text` \| `image`）
- `cost.input`：输入成本
- `cost.output`：输出成本
- `cost.cacheRead`：缓存读取成本
- `cost.cacheWrite`：缓存写入成本
- `contextWindow`：上下文窗口大小
- `maxTokens`：最大令牌数
- `compat`：兼容性标志

## 代理配置

### `agents`

代理列表和默认配置。

```json5
{
  agents: {
    defaults: {
      workspace: "~/clawd",
      repoRoot: "~/Projects/clawdbot",
      skipBootstrap: false,
      bootstrapMaxChars: 20000,
      userTimezone: "America/Chicago",
      timeFormat: "auto",
      model: {
        primary: "anthropic/claude-opus-4-5",
        fallbacks: [
          "openai/gpt-4",
          "vercel-gateway/gpt-4"
        ]
      },
      identity: {
        name: "Clawdbot",
        theme: "helpful sloth",
        emoji: "🦞",
        avatar: "avatars/clawdbot.png"
      },
      groupChat: {
        mentionPatterns: ["@clawd", "clawdbot"]
      },
      sandbox: {
        mode: "off",
        scope: "session",
        workspaceAccess: "rw",
        workspaceRoot: "/tmp/clawdbot-sandbox",
        docker: {
          image: "clawdbot/agent:latest",
          network: "bridge",
          env: {
            "CUSTOM_VAR": "value"
          },
          setupCommand: "npm install",
          limits: {
            memory: "512m",
            cpu: "0.5"
          }
        },
        browser: {
          enabled: true
        },
        prune: {
          enabled: true,
          keepLastN: 3
        }
      },
      subagents: {
        allowAgents: ["*"]
      },
      tools: {
        profile: "full-access",
        allow: ["read", "write", "edit", "browser"],
        deny: ["exec"]
      },
      concurrency: {
        maxConcurrentSessions: 5,
        maxConcurrentToolCalls: 10
      },
      cli: {
        backend: {
          command: "clawdbot agent",
          args: ["--thinking", "high"],
          output: "json",
          resumeOutput: "json",
          input: "stdin",
          maxPromptArgChars: 10000,
          env: {},
          clearEnv: ["NODE_ENV"],
          modelArg: "--model",
          modelAliases: {
            "opus": "anthropic/claude-opus-4-5"
          },
          sessionArg: "--session",
          sessionArgs: ["--verbose"],
          resumeArgs: [],
          sessionMode: "existing",
          sessionIdFields: ["agent", "channel", "accountId", "peer"],
          systemPromptArg: "--system-prompt",
          systemPromptMode: "append",
          systemPromptWhen: "always",
          imageArg: "--image",
          imageMode: "repeat",
          serialize: false
        }
      }
    },
    list: [
      {
        id: "main",
        default: true,
        name: "Main Assistant",
        workspace: "~/clawd-main",
        agentDir: "~/.clawdbot/agents/main/agent",
        model: "anthropic/claude-opus-4-5",
        identity: {
          name: "Samantha",
          theme: "helpful sloth",
          emoji: "🦥",
          avatar: "avatars/samantha.png"
        },
        groupChat: {
          mentionPatterns: ["@samantha", "sam", "assistant"]
        },
        sandbox: {
          mode: "non-main"
        },
        subagents: {
          allowAgents: ["research", "writer"]
        },
        tools: {
          allow: ["read", "write", "browser"],
          deny: []
        }
      },
      {
        id: "work",
        workspace: "~/clawd-work",
        model: {
          primary: "openai/gpt-4",
          fallbacks: []
        }
      }
    ]
  }
}
```

**默认配置**（`agents.defaults`）：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `workspace` | string | `~/clawd` | 代理工作区目录 |
| `repoRoot` | string | - | Git 仓库根目录（用于系统提示） |
| `skipBootstrap` | boolean | `false` | 跳过工作区引导文件创建 |
| `bootstrapMaxChars` | number | `20000` | 每个引导文件的最大字符数 |
| `userTimezone` | string | - | 用户时区（系统提示上下文） |
| `timeFormat` | string | `auto` | 时间格式（`auto` \| `12` \| `24`） |
| `model.primary` | string | - | 主要模型（字符串形式：`provider/model`） |
| `model.fallbacks` | string[] | - | 故障转移模型列表 |
| `identity.name` | string | - | 代理名称 |
| `identity.theme` | string | - | 代理主题 |
| `identity.emoji` | string | - | 代理 emoji |
| `identity.avatar` | string | - | 代理头像路径或 URL |
| `groupChat.mentionPatterns` | string[] | - | 群组提及模式（正则） |
| `groupChat.historyLimit` | number | - | 群组历史限制 |
| `sandbox.mode` | string | - | 沙箱模式（`off` \| `non-main` \| `all`） |
| `sandbox.scope` | string | - | 沙箱范围（`session` \| `agent` \| `shared`） |
| `sandbox.workspaceAccess` | string | - | 工作区访问权限（`none` \| `ro` \| `rw`） |
| `sandbox.workspaceRoot` | string | - | 自定义沙箱工作区根目录 |
| `subagents.allowAgents` | string[] | - | 允许的子代理 ID（`["*"]` = 任意） |
| `tools.profile` | string | - | 工具配置文件（应用在 allow/deny 之前） |
| `tools.allow` | string[] | - | 允许的工具列表 |
| `tools.deny` | string[] | - | 拒绝的工具列表（deny 优先） |
| `concurrency.maxConcurrentSessions` | number | - | 最大并发会话数 |
| `concurrency.maxConcurrentToolCalls` | number | - | 最大并发工具调用数 |

**代理列表**（`agents.list`）：

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `id` | string | 必填 | 代理 ID（稳定标识符） |
| `default` | boolean | `false` | 是否为默认代理（多个时第一个获胜） |
| `name` | string | - | 代理显示名称 |
| `workspace` | string | `~/clawd-<agentId>` | 代理工作区（覆盖默认值） |
| `agentDir` | string | `~/.clawdbot/agents/<agentId>/agent` | 代理目录 |
| `model` | string/object | - | 每个代理的模型配置 |
| `identity` | object | - | 每个代理的身份配置 |
| `groupChat` | object | - | 每个代理的群组聊天配置 |
| `sandbox` | object | - | 每个代理的沙箱配置 |
| `subagents` | object | - | 每个代理的子代理配置 |
| `tools` | object | - | 每个代理的工具限制 |

::: tip 模型配置形式
代理的 `model` 字段可以采用两种形式：
- **字符串形式**：`"provider/model"`（仅覆盖 `primary`）
- **对象形式**：`{ primary, fallbacks }`（覆盖 `primary` 和 `fallbacks`；`[]` 禁用该代理的全局故障转移）

## 绑定配置

### `bindings`

将入站消息路由到特定代理。

```json5
{
  bindings: [
    {
      agentId: "main",
      match: {
        channel: "whatsapp",
        accountId: "personal",
        peer: {
          kind: "dm",
          id: "+15555550123"
        },
        guildId: "123456789012345678",
        teamId: "T12345"
      }
    },
    {
      agentId: "work",
      match: {
        channel: "whatsapp",
        accountId: "biz"
      }
    },
    {
      agentId: "main",
      match: {
        channel: "telegram"
      }
    }
  ]
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `agentId` | string | 必填 | 目标代理 ID（必须在 `agents.list` 中） |
| `match.channel` | string | 必填 | 匹配的渠道 |
| `match.accountId` | string | - | 匹配的账户 ID（`*` = 任意账户；省略 = 默认账户） |
| `match.peer` | object | - | 匹配的同行（对等方） |
| `match.peer.kind` | string | - | 同行类型（`dm` \| `group` \| `channel`） |
| `match.peer.id` | string | - | 同行 ID |
| `match.guildId` | string | - | Discord 服务器 ID |
| `match.teamId` | string | - | Slack/Microsoft Teams 团队 ID |

**确定性匹配顺序**：
1. `match.peer`（最具体）
2. `match.guildId`
3. `match.teamId`
4. `match.accountId`（精确，无同行/guild/team）
5. `match.accountId: "*"`（渠道范围，无同行/guild/team）
6. 默认代理（`agents.list[].default`，否则第一个列表条目，否则 `"main"`）

在每个匹配层内，`bindings` 中的第一个匹配条目获胜。

## 工具配置

### `tools`

工具执行和安全策略。

```json5
{
  tools: {
    exec: {
      elevated: {
        enabled: false,
        allowFrom: {
          whatsapp: ["+15555550123"],
          telegram: ["tg:123456789"]
        }
      }
    },
    browser: {
      enabled: true
    },
    agentToAgent: {
      enabled: false,
      allow: ["main", "work"]
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `exec.elevated.enabled` | boolean | `false` | 启用提升 bash（`! <cmd>`） |
| `exec.elevated.allowFrom` | object | - | 每个渠道的提升 allowlist |
| `browser.enabled` | boolean | - | 启用浏览器工具 |
| `agentToAgent.enabled` | boolean | - | 启用代理到代理消息传递 |
| `agentToAgent.allow` | string[] | - | 允许的代理 ID 列表 |

## 广播配置

### `broadcast`

将消息发送到多个渠道/代理。

```json5
{
  broadcast: {
    strategy: "parallel",
    "+15555550123": ["main", "work"],
    "120363403215116621@g.us": ["transcribe"],
    "strategy": "sequential"
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `strategy` | string | - | 广播策略（`parallel` \| `sequential`） |
| `<peerId>` | string[] | - | 将消息发送到这些代理（动态键） |

::: info 广播键
- 键格式：`<peerId>`（例如：`+15555550123` 或 `"120363403215116621@g.us"`）
- 值：代理 ID 数组
- 特殊键 `"strategy"`：控制并行与顺序执行

## 音频配置

### `audio`

音频和转录配置。

```json5
{
  audio: {
    transcription: {
      enabled: true,
      provider: "whisper",
      model: "base"
    }
  }
}
```

::: info 字段详情
完整的转录配置字段请参考 `zod-schema.core.ts` 中的 `TranscribeAudioSchema`。

## 消息配置

### `messages`

消息前缀、确认和队列行为。

```json5
{
  messages: {
    responsePrefix: "🦞",
    ackReaction: "👀",
    ackReactionScope: "group-mentions",
    removeAckAfterReply: false,
    queue: {
      mode: "collect",
      debounceMs: 1000,
      cap: 20,
      drop: "summarize",
      byChannel: {
        whatsapp: "collect",
        telegram: "collect",
        discord: "collect",
        imessage: "collect",
        webchat: "collect"
      }
    },
    inbound: {
      debounceMs: 2000,
      byChannel: {
        whatsapp: 5000,
        slack: 1500,
        discord: 1500
      }
    },
    groupChat: {
      historyLimit: 50
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `responsePrefix` | string | - | 所有出站回复的前缀（支持模板变量） |
| `ackReaction` | string | - | 确认入站消息的 emoji |
| `ackReactionScope` | string | - | 何时发送确认（`group-mentions` \| `group-all` \| `direct` \| `all`） |
| `removeAckAfterReply` | boolean | `false` | 发送回复后移除确认 |
| `queue.mode` | string | - | 队列模式（`steer` \| `followup` \| `collect` \| `steer-backlog` \| `queue` \| `interrupt`） |
| `queue.debounceMs` | number | - | 队列去抖动（毫秒） |
| `queue.cap` | number | - | 队列上限 |
| `queue.drop` | string | - | 丢弃策略（`old` \| `new` \| `summarize`） |
| `queue.byChannel` | object | - | 每个渠道的队列模式 |
| `inbound.debounceMs` | number | - | 入站消息去抖动（毫秒；0 禁用） |
| `inbound.byChannel` | object | - | 每个渠道的去抖动时长 |
| `groupChat.historyLimit` | number | - | 群组历史上下文限制（0 禁用） |

**模板变量**（用于 `responsePrefix`）：

| 变量 | 说明 | 示例 |
|--------|------|------|
| `{model}` | 短模型名称 | `claude-opus-4-5`，`gpt-4` |
| `{modelFull}` | 完整模型标识符 | `anthropic/claude-opus-4-5` |
| `{provider}` | 提供商名称 | `anthropic`，`openai` |
| `{thinkingLevel}` | 当前推理级别 | `high`，`low`，`off` |
| `{identity.name}` | 代理身份名称 | （与 `"auto"` 模式相同） |

::: tip WhatsApp 自我聊天
自我聊天回复默认使用 `[{identity.name}]`，否则为 `[clawdbot]`，这样相同号码的对话保持可读性。

## 命令配置

### `commands`

聊天命令处理配置。

```json5
{
  commands: {
    native: "auto",
    text: true,
    bash: false,
    bashForegroundMs: 2000,
    config: false,
    debug: false,
    restart: false,
    useAccessGroups: true
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `native` | string | `auto` | 原生命令（`auto` \| `true` \| `false`） |
| `text` | boolean | `true` | 解析聊天消息中的斜杠命令 |
| `bash` | boolean | `false` | 允许 `!`（`/bash` 的别名） |
| `bashForegroundMs` | number | `2000` | bash 前台窗口（毫秒） |
| `config` | boolean | `false` | 允许 `/config`（写入磁盘） |
| `debug` | boolean | `false` | 允许 `/debug`（仅运行时覆盖） |
| `restart` | boolean | `false` | 允许 `/restart` + Gateway 重启工具 |
| `useAccessGroups` | boolean | `true` | 对命令强制访问组 allowlist/策略 |

::: warning bash 命令
`commands.bash: true` 启用 `! <cmd>` 以运行主机 shell 命令（`/bash <cmd>` 也作为别名工作）。需要 `tools.elevated.enabled` 和允许列表中的发送者。

## 会话配置

### `session`

会话持久化和行为。

```json5
{
  session: {
    activation: {
      defaultMode: "auto",
      defaultDurationMs: 900000,
      keepAlive: true
    },
    compaction: {
      auto: true,
      threshold: 0.8,
      strategy: "summary"
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `activation.defaultMode` | string | `auto` | 默认激活模式（`auto` \| `always` \| `manual`） |
| `activation.defaultDurationMs` | number | - | 默认激活时长（毫秒） |
| `activation.keepAlive` | boolean | - | 保持活动状态 |
| `compaction.auto` | boolean | `true` | 自动压缩 |
| `compaction.threshold` | number | - | 压缩阈值（0-1） |
| `compaction.strategy` | string | - | 压缩策略 |

::: info 会话压缩
上下文溢出时自动压缩，然后失败。参见 `CHANGELOG.md:122`。

## Cron 配置

### `cron`

定时任务调度。

```json5
{
  cron: {
    enabled: true,
    store: "~/.clawdbot/cron.json",
    maxConcurrentRuns: 5
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | - | 启用 Cron 引擎 |
| `store` | string | - | Cron 存储文件路径 |
| `maxConcurrentRuns` | number | - | 最大并发运行数 |

## Hooks 配置

### `hooks`

Webhook 和事件转发。

```json5
{
  hooks: {
    enabled: true,
    path: "~/.clawdbot/hooks",
    token: "webhook-secret-token",
    maxBodyBytes: 1048576,
    presets: ["slack-alerts", "discord-notifications"],
    transformsDir: "~/.clawdbot/hook-transforms",
    mappings: [
      {
        pattern: "^agent:.*$",
        target: "https://hooks.example.com/agent-events",
        headers: {
          "Authorization": "Bearer ${WEBHOOK_AUTH}"
        }
      }
    ],
    gmail: {
      enabled: false,
      credentialsPath: "~/.clawdbot/gmail-credentials.json",
      subscriptionIds: ["subscription-1", "subscription-2"]
    },
    internal: {
      onMessage: "log-message",
      onToolCall: "log-tool-call",
      onError: "log-error"
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | - | 启用 Hooks |
| `path` | string | - | Hooks 目录路径 |
| `token` | string | - | Webhook 认证令牌 |
| `maxBodyBytes` | number | - | 最大请求体大小（字节） |
| `presets` | string[] | - | 预设 Hook 列表 |
| `transformsDir` | string | - | Hook 转换脚本目录 |
| `mappings` | array | - | 自定义 Hook 映射 |
| `gmail.enabled` | boolean | - | 启用 Gmail Pub/Sub |
| `gmail.credentialsPath` | string | - | Gmail 凭证路径 |
| `gmail.subscriptionIds` | string[] | - | Gmail 订阅 ID 列表 |
| `internal.onMessage` | string | - | 消息内部 Hook |
| `internal.onToolCall` | string | - | 工具调用内部 Hook |
| `internal.onError` | string | - | 错误内部 Hook |

## 渠道配置

### `channels`

多渠道消息集成配置。

```json5
{
  channels: {
    whatsapp: {
      enabled: true,
      botToken: "123456:ABC...",
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      groups: {
        "*": { requireMention: true },
        "-1001234567890": {
          allowFrom: ["@admin"],
          systemPrompt: "Keep answers brief.",
          topics: {
            "99": {
              requireMention: false,
              skills: ["search"],
              systemPrompt: "Stay on topic."
            }
          }
        }
      },
      sendReadReceipts: true,
      textChunkLimit: 4000,
      chunkMode: "length",
      mediaMaxMb: 50,
      historyLimit: 50,
      replyToMode: "first",
      accounts: {
        default: {},
        personal: {},
        biz: {
          authDir: "~/.clawdbot/credentials/whatsapp/biz"
        }
      }
    },
    telegram: {
      enabled: true,
      botToken: "123456:ABC...",
      dmPolicy: "pairing",
      allowFrom: ["tg:123456789"],
      groups: {
        "*": { requireMention: true }
      },
      customCommands: [
        { command: "backup", description: "Git backup" },
        { command: "generate", description: "Create an image" }
      ],
      historyLimit: 50,
      replyToMode: "first",
      linkPreview: true,
      streamMode: "partial",
      draftChunk: {
        minChars: 200,
        maxChars: 800,
        breakPreference: "paragraph"
      }
    },
    discord: {
      enabled: true,
      token: "your-bot-token",
      mediaMaxMb: 8,
      allowBots: false,
      actions: {
        reactions: true,
        messages: true,
        threads: true,
        pins: true
      },
      guilds: {
        "123456789012345678": {
          requireMention: false,
          users: ["987654321098765432"],
          channels: {
            general: { allow: true },
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"]
            }
          }
        }
      },
      historyLimit: 20,
      dm: {
        enabled: true,
        policy: "pairing",
        allowFrom: ["1234567890", "username"],
        groupEnabled: false,
        groupChannels: ["clawd-dm"]
      }
    },
    slack: {
      enabled: true,
      botToken: "xoxb-...",
      appToken: "xapp-...",
      channels: {
        "#general": { allow: true, requireMention: true }
      },
      historyLimit: 50,
      allowBots: false,
      reactionNotifications: "own",
      slashCommand: {
        enabled: true,
        name: "clawd",
        sessionPrefix: "slack:slash",
        ephemeral: true
      }
    },
    signal: {
      reactionNotifications: "own",
      reactionAllowlist: ["+15551234567"],
      historyLimit: 50
    },
    imessage: {
      enabled: true,
      cliPath: "imsg",
      dbPath: "~/Library/Messages/chat.db",
      dmPolicy: "pairing",
      allowFrom: ["+15555550123"],
      historyLimit: 50,
      includeAttachments: false,
      mediaMaxMb: 16
    }
  }
}
```

::: tip 渠道特定文档
每个渠道都有详细的配置选项。请参考：
- [WhatsApp 渠道](../../platforms/whatsapp/)
- [Telegram 渠道](../../platforms/telegram/)
- [Slack 渠道](../../platforms/slack/)
- [Discord 渠道](../../platforms/discord/)
- [Google Chat 渠道](../../platforms/googlechat/)
- [Signal 渠道](../../platforms/signal/)
- [iMessage 渠道](../../platforms/imessage/)

**通用渠道字段**：
- `enabled`：启用渠道
- `dmPolicy`：DM 策略（`pairing` \| `allowlist` \| `open` \| `disabled`）
- `allowFrom`：DM allowlist（`pairing` 模式下未知发送者收到配对代码）
- `groupPolicy`：群组策略（`open` \| `disabled` \| `allowlist`）
- `historyLimit`：历史上下文限制（0 禁用）

## Gateway 配置

### `gateway`

Gateway WebSocket 服务器和认证。

```json5
{
  gateway: {
    port: 18789,
    mode: "local",
    bind: "loopback",
    controlUi: {
      enabled: true,
      basePath: "/",
      allowInsecureAuth: false,
      dangerouslyDisableDeviceAuth: false
    },
    auth: {
      mode: "token",
      token: "secret-gateway-token",
      password: "gateway-password",
      allowTailscale: false
    },
    trustedProxies: ["127.0.0.1", "10.0.0.0/8"],
    tailscale: {
      mode: "off",
      resetOnExit: false
    },
    remote: {
      url: "ws://gateway.example.com:18789",
      transport: "ssh",
      token: "remote-token",
      password: "remote-password",
      tlsFingerprint: "SHA256:...",
      sshTarget: "user@gateway-host",
      sshIdentity: "~/.ssh/id_ed25519"
    },
    reload: {
      mode: "hot",
      debounceMs: 1000
    },
    tls: {
      enabled: false,
      autoGenerate: true,
      certPath: "/path/to/cert.pem",
      keyPath: "/path/to/key.pem",
      caPath: "/path/to/ca.pem"
    },
    http: {
      endpoints: {
        chatCompletions: {
          enabled: true
        },
        responses: {
          enabled: true,
          maxBodyBytes: 10485760,
          files: {
            allowUrl: true,
            allowedMimes: ["text/*", "application/pdf"],
            maxBytes: 10485760,
            maxChars: 100000,
            maxRedirects: 10,
            timeoutMs: 30000,
            pdf: {
              maxPages: 50,
              maxPixels: 67108864,
              minTextChars: 0
            }
          },
          images: {
            allowUrl: true,
            allowedMimes: ["image/*"],
            maxBytes: 10485760,
            maxRedirects: 5,
            timeoutMs: 30000
          }
        }
      }
    },
    nodes: {
      browser: {
        mode: "auto",
        node: "macos-1"
      },
      allowCommands: [],
      denyCommands: ["rm -rf", ":(){ :|:& };:"]
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `port` | number | `18789` | Gateway WebSocket 端口 |
| `mode` | string | `local` | Gateway 模式（`local` \| `remote`） |
| `bind` | string | - | 绑定地址（`auto` \| `lan` \| `loopback` \| `custom` \| `tailnet`） |
| `controlUi.enabled` | boolean | - | 启用控制 UI |
| `controlUi.basePath` | string | - | UI 基础路径 |
| `controlUi.allowInsecureAuth` | boolean | - | 允许不安全认证 |
| `auth.mode` | string | - | 认证模式（`token` \| `password`） |
| `auth.token` | string | - | 认证令牌 |
| `auth.password` | string | - | 认证密码 |
| `auth.allowTailscale` | boolean | - | 允许 Tailscale 身份验证 |
| `tailscale.mode` | string | `off` | Tailscale 模式（`off` \| `serve` \| `funnel`） |
| `tailscale.resetOnExit` | boolean | - | 退出时重置 Serve/Funnel |
| `remote.url` | string | - | 远程 Gateway URL |
| `remote.transport` | string | - | 远程传输（`ssh` \| `direct`） |
| `remote.token` | string | - | 远程令牌 |
| `remote.password` | string | - | 远程密码 |
| `remote.tlsFingerprint` | string | - | 远程 TLS 指纹 |
| `remote.sshTarget` | string | - | SSH 目标 |
| `remote.sshIdentity` | string | - | SSH 身份文件路径 |
| `reload.mode` | string | - | 重载模式（`off` \| `restart` \| `hot` \| `hybrid`） |
| `reload.debounceMs` | number | - | 重载去抖动（毫秒） |
| `tls.enabled` | boolean | - | 启用 TLS |
| `tls.autoGenerate` | boolean | - | 自动生成证书 |
| `nodes.browser.mode` | string | - | 浏览器节点模式（`auto` \| `manual` \| `off`） |
| `nodes.allowCommands` | string[] | - | 允许的节点命令 |
| `nodes.denyCommands` | string[] | - | 拒绝的节点命令 |

::: warning Tailscale 绑定限制
启用 Serve/Funnel 时，`gateway.bind` 必须保持 `loopback`（Clawdbot 强制执行此规则）。

## 技能配置

### `skills`

技能平台和安装。

```json5
{
  skills: {
    allowBundled: ["bird", "sherpa-onnx-tts"],
    load: {
      extraDirs: ["~/custom-skills"],
      watch: true,
      watchDebounceMs: 500
    },
    install: {
      preferBrew: false,
      nodeManager: "pnpm"
    },
    entries: {
      "search": {
        enabled: true,
        apiKey: "${SEARCH_API_KEY}",
        env: {
          "SEARCH_ENGINE": "google"
        },
        config: {
          "maxResults": 10
        }
      }
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `allowBundled` | string[] | - | 允许的内置技能列表 |
| `load.extraDirs` | string[] | - | 额外的技能目录 |
| `load.watch` | boolean | - | 监视技能文件更改 |
| `load.watchDebounceMs` | number | - | 监视去抖动（毫秒） |
| `install.preferBrew` | boolean | - | 首选 Homebrew 安装 |
| `install.nodeManager` | string | - | 节点管理器（`npm` \| `pnpm` \| `yarn` \| `bun`） |
| `entries.<skillId>.enabled` | boolean | - | 启用技能 |
| `entries.<skillId>.apiKey` | string | - | 技能 API 密钥 |
| `entries.<skillId>.env` | object | - | 技能环境变量 |
| `entries.<skillId>.config` | object | - | 技能配置 |

## 插件配置

### `plugins`

插件系统配置。

```json5
{
  plugins: {
    enabled: true,
    allow: ["whatsapp", "telegram", "discord"],
    deny: [],
    load: {
      paths: ["~/.clawdbot/plugins", "./custom-plugins"]
    },
    slots: {
      memory: "custom-memory-provider"
    }
  }
}
```

| 字段 | 类型 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `enabled` | boolean | - | 启用插件系统 |
| `allow` | string[] | - | 允许的插件列表 |
| `deny` | string[] | - | 拒绝的插件列表 |
| `load.paths` | string[] | - | 插件加载路径 |
| `slots.memory` | string | - | 自定义内存提供程序 |

## 配置 Includes（`$include`）

使用 `$include` 指令将配置拆分为多个文件。

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: { port: 18789 },
  
  // 包含单个文件（替换包含键的值）
  agents: { "$include": "./agents.json5" },
  
  // 包含多个文件（按顺序深度合并）
  broadcast: { 
    "$include": [
      "./clients/mueller.json5",
      "./clients/schmidt.json5"
    ]
  }
}
```

```json5
// ~/.clawdbot/agents.json5
{
  defaults: { sandbox: { mode: "all", scope: "session" } },
  list: [
    { id: "main", workspace: "~/clawd" }
  ]
}
```

**合并行为**：
- **单个文件**：替换包含 `$include` 的对象
- **文件数组**：按顺序深度合并文件（后面的文件覆盖前面的）
- **兄弟键**：在包含之后合并兄弟键（覆盖包含的值）
- **兄弟键 + 数组/基本类型**：不支持（包含的内容必须是对象）

**路径解析**：
- **相对路径**：相对于包含文件解析
- **绝对路径**：按原样使用
- **父目录**：`../` 引用按预期工作

**嵌套包含**：
包含的文件本身可以包含 `$include` 指令（最多 10 层深度）。

## 环境变量替换

你可以在任何配置字符串值中直接使用 `${VAR_NAME}` 语法引用环境变量。变量在配置加载时替换，在验证之前。

```json5
{
  models: {
    providers: {
      "vercel-gateway": {
        apiKey: "${VERCEL_GATEWAY_API_KEY}"
      }
    }
  },
  gateway: {
    auth: {
      token: "${CLAWDBOT_GATEWAY_TOKEN}"
    }
  }
}
```

**规则**：
- 只匹配大写环境变量名称：`[A-Z_][A-Z0-9_]*`
- 缺失或空的环境变量在配置加载时抛出错误
- 使用 `$${VAR}` 转义以输出字面量 `${VAR}`
- 适用于 `$include`（包含的文件也获取替换）

::: warning 缺失变量
缺失或空的环境变量会在配置加载时抛出错误。

## 配置验证和诊断

当配置验证失败时，使用 `clawdbot doctor` 查看确切的问题。

```bash
## 诊断配置
clawdbot doctor

## 自动修复问题（需手动确认）
clawdbot doctor --fix

## 自动修复（跳过确认）
clawdbot doctor --yes
```

**诊断功能**：
- 检测未知配置键
- 验证数据类型
- 检测缺失的必需字段
- 应用配置迁移
- 检测不安全的 DM 策略
- 验证渠道配置

## 配置文件路径

| 文件 | 路径 | 说明 |
|------|--------|------|
| 主配置 | `~/.clawdbot/clawdbot.json` | 主配置文件 |
| 环境变量 | `~/.clawdbot/.env` | 全局环境变量 |
| 工作区环境 | `~/clawd/.env` | 工作区环境变量 |
| 认证配置文件 | `<agentDir>/auth-profiles.json` | 认证配置文件 |
| 运行时缓存 | `<agentDir>/auth.json` | 嵌入代理运行时缓存 |
| 遗留 OAuth | `~/.clawdbot/credentials/oauth.json` | 遗留 OAuth 导入 |
| Cron 存储 | `~/.clawdbot/cron.json` | Cron 任务存储 |
| Hooks 路径 | `~/.clawdbot/hooks` | Hooks 目录 |

---

## 本课小结

本教程详细介绍了 Clawdbot 的完整配置系统，包括：

- ✅ 配置文件结构和验证机制
- ✅ 所有核心配置节（认证、代理、渠道、会话、工具、Cron、Hooks 等）
- ✅ 环境变量替换和配置优先级
- ✅ 常见配置示例和最佳实践
- ✅ 配置文件路径和存储位置

## 下一课预告

> 下一课我们学习 **[Gateway WebSocket API 协议](./api-protocol/)**。
>
> 你会学到：
> - WebSocket 连接握手和认证
> - 消息帧格式（请求、响应、事件）
> - 核心方法参考和调用示例
> - 权限系统和角色管理
> - 错误处理和重试策略

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 配置节 | 文件路径 | 行号 |
|---------|-----------|------|
| 主 Schema | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | 1-556 |
| 核心 Schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300 |
| 代理 Schema | [`src/config/zod-schema.agents.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agents.ts) | 1-54 |
| 渠道 Schema | [`src/config/zod-schema.channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.channels.ts) | 1-11 |
| 会话 Schema | [`src/config/zod-schema.session.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.session.ts) | - |
| 工具 Schema | [`src/config/zod-schema.agent-runtime.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agent-runtime.ts) | - |
| Hooks Schema | [`src/config/zod-schema.hooks.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.hooks.ts) | - |
| 提供商 Schema | [`src/config/zod-schema.providers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers.ts) | - |
| 配置文档 | [`docs/gateway/configuration.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/gateway/configuration.md) | - |

**关键常量**：
- 默认端口：`18789`（`gateway.server-startup-log.ts`）
- 默认工作区：`~/clawd`
- 默认 Gateway 绑定：`loopback`（127.0.0.1）

**关键函数**：
- `ClawdbotSchema`：主配置 Schema 定义
- `normalizeAllowFrom()`：标准化 allowlist 值
- `requireOpenAllowFrom()`：验证 open 模式的 allowlist
</details>
