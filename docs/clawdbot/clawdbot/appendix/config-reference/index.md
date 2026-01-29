---
title: "Complete Clawdbot Configuration Reference: All Configuration Options Explained"
sidebarTitle: "Configuration Reference"
subtitle: "Complete Configuration Reference"
description: "Learn the complete Clawdbot configuration system. This reference document explains all configuration sections, field types, default values, and practical examples to help you customize and optimize Clawdbot behavior. Includes authentication, models, channels, tools, sandbox isolation, session management, message processing, Cron tasks, Hooks, Gateway, Tailscale, Skills, Plugins, Node Host, Canvas, Talk, broadcast, logging, updates, UI, and 50+ core configuration sections covering all options from basic to advanced. Suitable for quick lookup of all available configuration items, locating needed settings, and improving usage efficiency to achieve personalized configuration. Understand the role and impact of each configuration item, quickly find the options you need, and avoid configuration errors. Whether you're a beginner or advanced user, you can quickly find the configuration items you need from here, improve work efficiency, and solve configuration challenges. The configuration reference helps you fully understand and master the Clawdbot configuration system for personalized customization. Suitable for lookup, debugging, and advanced configuration. Recommended for all users to read this configuration reference to understand the meaning and usage of each configuration item and fully leverage Clawdbot's powerful features."
tags:
  - "Configuration"
  - "Reference"
  - "Complete Guide"
order: 340
---

# Complete Configuration Reference

Clawdbot reads an optional JSON5 configuration file (supports comments and trailing commas): `~/.clawdbot/clawdbot.json`

If the configuration file is missing, Clawdbot uses safe defaults (embedded Pi agent + sender-based sessions + workspace `~/clawd`). You typically only need to configure to:
- Limit who can trigger the bot (`channels.whatsapp.allowFrom`, `channels.telegram.allowFrom`, etc.)
- Control group whitelists + mention behavior (`channels.whatsapp.groups`, `channels.telegram.groups`, `channels.discord.guilds`)
- Customize message prefixes (`messages`)
- Set proxy workspaces (`agents.defaults.workspace` or `agents.list[].workspace`)
- Adjust embedded agent defaults (`agents.defaults`) and session behavior (`session`)
- Set per-agent identity (`agents.list[].identity`)

::: tip New to configuration?
If this is your first time configuring, we recommend reading the [Quick Start](../../start/getting-started/) and [Onboarding Wizard](../../start/onboarding-wizard/) tutorials first.

## Configuration Validation Mechanism

Clawdbot only accepts configurations that fully match the Schema. Unknown keys, malformed types, or invalid values will cause the Gateway to **refuse to start** to ensure security.

When validation fails:
- Gateway will not start
- Only diagnostic commands are allowed (e.g., `clawdbot doctor`, `clawdbot logs`, `clawdbot health`, `clawdbot status`, `clawdbot service`, `clawdbot help`)
- Run `clawdbot doctor` to see the exact issue
- Run `clawdbot doctor --fix` (or `--yes`) to apply migrations/fixes

::: warning Warning
Doctor will not write any changes unless you explicitly choose `--fix`/`--yes`.

## Configuration File Structure

The Clawdbot configuration file is a hierarchical object containing the following main configuration sections:

```json5
{
  // Core configuration
  meta: {},
  env: {},
  wizard: {},
  diagnostics: {},
  logging: {},
  update: {},

  // Feature configuration
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

## Core Configuration

### `meta`

Metadata for the configuration file (automatically written by the CLI wizard).

```json5
{
  meta: {
    lastTouchedVersion: "2026.1.24",
    lastTouchedAt: "2026-01-27T00:00:00.000Z"
  }
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `lastTouchedVersion` | string | - | Last Clawdbot version to modify this configuration |
| `lastTouchedAt` | string | - | Last time this configuration was modified (ISO 8601) |

### `env`

Environment variable configuration and shell environment import.

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
    // Any key-value pairs
    CUSTOM_VAR: "value"
  }
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `shellEnv.enabled` | boolean | `false` | Whether to import environment variables from login shell (only imports missing keys) |
| `shellEnv.timeoutMs` | number | `15000` | Shell environment import timeout (milliseconds) |
| `vars` | object | - | Inline environment variables (key-value pairs) |

**Note**: `vars` are only applied when the corresponding key is missing from process environment variables. Never overrides existing environment variables.

::: info Environment Variable Priority
Process environment variables > `.env` file > `~/.clawdbot/.env` > `env.vars` in configuration file

### `wizard`

Metadata written by CLI wizard (`onboard`, `configure`, `doctor`).

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `lastRunAt` | string | - | Last time wizard was run |
| `lastRunVersion` | string | - | Clawdbot version when wizard was last run |
| `lastRunCommit` | string | - | Git commit hash when wizard was last run |
| `lastRunCommand` | string | - | Last wizard command run |
| `lastRunMode` | string | - | Wizard run mode (`local` \| `remote`) |

### `diagnostics`

Diagnostic telemetry and OpenTelemetry configuration.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | `false` | Enable diagnostic features |
| `flags` | string[] | - | List of diagnostic flags |
| `otel.enabled` | boolean | `false` | Enable OpenTelemetry telemetry |
| `otel.endpoint` | string | - | OTEL collector endpoint |
| `otel.protocol` | string | - | OTEL protocol (`http/protobuf` \| `grpc`) |
| `otel.headers` | object | - | OTEL request headers |
| `otel.serviceName` | string | - | OTEL service name |
| `otel.traces` | boolean | - | Collect trace data |
| `otel.metrics` | boolean | - | Collect metrics data |
| `otel.logs` | boolean | - | Collect log data |
| `otel.sampleRate` | number | - | Sample rate (0-1) |
| `otel.flushIntervalMs` | number | - | Flush interval (milliseconds) |
| `cacheTrace.enabled` | boolean | `false` | Enable trace caching |
| `cacheTrace.filePath` | string | - | Trace cache file path |
| `cacheTrace.includeMessages` | boolean | - | Include messages in cache |
| `cacheTrace.includePrompt` | boolean | - | Include prompts in cache |
| `cacheTrace.includeSystem` | boolean | - | Include system prompts in cache |

### `logging`

Logging configuration.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `level` | string | `info` | Log level (`silent` \| `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`) |
| `file` | string | - | Log file path (default: `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`) |
| `consoleLevel` | string | `info` | Console log level (same as `level` option) |
| `consoleStyle` | string | `pretty` | Console output style (`pretty` \| `compact` \| `json`) |
| `redactSensitive` | string | `tools` | Sensitive data redaction mode (`off` \| `tools`) |
| `redactPatterns` | string[] | - | Custom redaction regex patterns (overrides defaults) |

::: tip Log File Path
If you want a stable log file path, set `logging.file` to `/tmp/clawdbot/clawdbot.log` (instead of the default daily rotation path).

### `update`

Update channel and auto-check configuration.

```json5
{
  update: {
    channel: "stable",
    checkOnStart: true
  }
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `channel` | string | `stable` | Update channel (`stable` \| `beta` \| `dev`) |
| `checkOnStart` | boolean | - | Check for updates on startup |

### `browser`

Browser automation configuration (based on Playwright).

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | - | Enable browser tools |
| `controlUrl` | string | - | Browser control WebSocket URL |
| `controlToken` | string | - | Browser control authentication token |
| `cdpUrl` | string | - | Chrome DevTools Protocol URL |
| `remoteCdpTimeoutMs` | number | - | Remote CDP timeout (milliseconds) |
| `remoteCdpHandshakeTimeoutMs` | number | - | Remote CDP handshake timeout (milliseconds) |
| `color` | string | - | Hex color displayed in UI |
| `executablePath` | string | - | Browser executable path |
| `headless` | boolean | - | Headless mode |
| `noSandbox` | boolean | - | Disable sandbox (required on Linux) |
| `attachOnly` | boolean | - | Only attach to existing browser instance |
| `defaultProfile` | string | - | Default profile ID |
| `snapshotDefaults.mode` | string | - | Snapshot mode (`efficient`) |
| `profiles` | object | - | Profile map (key: profile name, value: configuration) |

**Profile Configuration**:
- `cdpPort`: CDP port (1-65535)
- `cdpUrl`: CDP URL
- `driver`: Driver type (`clawd` \| `extension`)
- `color`: Profile hex color

::: warning Browser Profile Naming
Profile names must only contain lowercase letters, numbers, and hyphens: `^[a-z0-9-]+$`

### `ui`

UI customization configuration (Control UI, WebChat).

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `seamColor` | string | - | Seam color hex value |
| `assistant.name` | string | - | Assistant display name (max 50 characters) |
| `assistant.avatar` | string | - | Assistant avatar path or URL (max 200 characters) |

**Avatar Support**:
- Workspace-relative path (must be within agent workspace)
- `http(s)` URL
- `data:` URI

## Authentication Configuration

### `auth`

Authentication profile metadata (does not store keys, only maps profiles to providers and modes).

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `profiles` | object | - | Profile map (key: profile ID, value: configuration) |
| `profiles.<profileId>.provider` | string | - | Provider name |
| `profiles.<profileId>.mode` | string | - | Authentication mode (`api_key` \| `oauth` \| `token`) |
| `profiles.<profileId>.email` | string | - | OAuth email (optional) |
| `order` | object | - | Provider failover order |
| `cooldowns.billingBackoffHours` | number | - | Billing issue backoff duration (hours) |
| `cooldowns.billingBackoffHoursByProvider` | object | - | Per-provider billing backoff duration |
| `cooldowns.billingMaxHours` | number | - | Maximum billing backoff duration (hours) |
| `cooldowns.failureWindowHours` | number | - | Failure window duration (hours) |

::: tip Claude Code CLI Auto-Sync
Clawdbot automatically syncs OAuth tokens from Claude Code CLI to `auth-profiles.json` (when present on Gateway host):
- macOS: Keychain item "Claude Code-credentials" (select "Always Allow" to avoid launchd prompts)
- Linux/Windows: `~/.claude/.credentials.json`

**Authentication Storage Locations**:
- `<agentDir>/auth-profiles.json` (default: `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`)
- Legacy import: `~/.clawdbot/credentials/oauth.json`

**Embedded Agent Runtime Cache**:
- `<agentDir>/auth.json` (automatically managed; do not manually edit)

## Models Configuration

### `models`

AI model providers and configuration.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `mode` | string | - | Model merge mode (`merge` \| `replace`) |
| `providers` | object | - | Provider map (key: provider ID, value: provider configuration) |
| `providers.<providerId>.baseUrl` | string | - | API base URL |
| `providers.<providerId>.apiKey` | string | - | API key (supports environment variable substitution) |
| `providers.<providerId>.auth` | string | - | Authentication type (`api_key` \| `aws-sdk` \| `oauth` \| `token`) |
| `providers.<providerId>.api` | string | - | API type (`openai-completions` \| `openai-responses` \| `anthropic-messages` \| `google-generative-ai` \| `github-copilot` \| `bedrock-converse-stream`) |
| `providers.<providerId>.authHeader` | boolean | - | Whether to use authentication header |
| `providers.<providerId>.headers` | object | - | Custom HTTP headers |
| `providers.<providerId>.models` | array | - | Model definition list |
| `bedrockDiscovery.enabled` | boolean | `false` | Enable AWS Bedrock model discovery |
| `bedrockDiscovery.region` | string | - | AWS region |
| `bedrockDiscovery.providerFilter` | string[] | - | Bedrock provider filter |
| `bedrockDiscovery.refreshInterval` | number | - | Refresh interval (milliseconds) |
| `bedrockDiscovery.defaultContextWindow` | number | - | Default context window |
| `bedrockDiscovery.defaultMaxTokens` | number | - | Default max tokens |

**Model Definition Fields**:
- `id`: Model ID (required)
- `name`: Model display name (required)
- `api`: API type
- `reasoning`: Whether it's a reasoning model
- `input`: Supported input types (`text` \| `image`)
- `cost.input`: Input cost
- `cost.output`: Output cost
- `cost.cacheRead`: Cache read cost
- `cost.cacheWrite`: Cache write cost
- `contextWindow`: Context window size
- `maxTokens`: Max tokens
- `compat`: Compatibility flags

## Agents Configuration

### `agents`

Agent list and default configuration.

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

**Default Configuration** (`agents.defaults`):

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `workspace` | string | `~/clawd` | Agent workspace directory |
| `repoRoot` | string | - | Git repository root (used for system prompts) |
| `skipBootstrap` | boolean | `false` | Skip workspace bootstrap file creation |
| `bootstrapMaxChars` | number | `20000` | Max characters per bootstrap file |
| `userTimezone` | string | - | User timezone (system prompt context) |
| `timeFormat` | string | `auto` | Time format (`auto` \| `12` \| `24`) |
| `model.primary` | string | - | Primary model (string form: `provider/model`) |
| `model.fallbacks` | string[] | - | Failover model list |
| `identity.name` | string | - | Agent name |
| `identity.theme` | string | - | Agent theme |
| `identity.emoji` | string | - | Agent emoji |
| `identity.avatar` | string | - | Agent avatar path or URL |
| `groupChat.mentionPatterns` | string[] | - | Group mention patterns (regex) |
| `groupChat.historyLimit` | number | - | Group history limit |
| `sandbox.mode` | string | - | Sandbox mode (`off` \| `non-main` \| `all`) |
| `sandbox.scope` | string | - | Sandbox scope (`session` \| `agent` \| `shared`) |
| `sandbox.workspaceAccess` | string | - | Workspace access permission (`none` \| `ro` \| `rw`) |
| `sandbox.workspaceRoot` | string | - | Custom sandbox workspace root |
| `subagents.allowAgents` | string[] | - | Allowed sub-agent IDs (`["*"]` = any) |
| `tools.profile` | string | - | Tool profile (applied before allow/deny) |
| `tools.allow` | string[] | - | Allowed tool list |
| `tools.deny` | string[] | - | Denied tool list (deny takes precedence) |
| `concurrency.maxConcurrentSessions` | number | - | Max concurrent sessions |
| `concurrency.maxConcurrentToolCalls` | number | - | Max concurrent tool calls |

**Agent List** (`agents.list`):

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `id` | string | Required | Agent ID (stable identifier) |
| `default` | boolean | `false` | Whether it's the default agent (first wins if multiple) |
| `name` | string | - | Agent display name |
| `workspace` | string | `~/clawd-<agentId>` | Agent workspace (overrides default) |
| `agentDir` | string | `~/.clawdbot/agents/<agentId>/agent` | Agent directory |
| `model` | string/object | - | Per-agent model configuration |
| `identity` | object | - | Per-agent identity configuration |
| `groupChat` | object | - | Per-agent group chat configuration |
| `sandbox` | object | - | Per-agent sandbox configuration |
| `subagents` | object | - | Per-agent subagent configuration |
| `tools` | object | - | Per-agent tool restrictions |

::: tip Model Configuration Forms
An agent's `model` field can take two forms:
- **String form**: `"provider/model"` (only overrides `primary`)
- **Object form**: `{ primary, fallbacks }` (overrides both `primary` and `fallbacks`; `[]` disables global failover for that agent)

## Bindings Configuration

### `bindings`

Route inbound messages to specific agents.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `agentId` | string | Required | Target agent ID (must be in `agents.list`) |
| `match.channel` | string | Required | Matching channel |
| `match.accountId` | string | - | Matching account ID (`*` = any account; omit = default account) |
| `match.peer` | object | - | Matching peer |
| `match.peer.kind` | string | - | Peer type (`dm` \| `group` \| `channel`) |
| `match.peer.id` | string | - | Peer ID |
| `match.guildId` | string | - | Discord server ID |
| `match.teamId` | string | - | Slack/Microsoft Teams team ID |

**Deterministic Match Order**:
1. `match.peer` (most specific)
2. `match.guildId`
3. `match.teamId`
4. `match.accountId` (exact, no peer/guild/team)
5. `match.accountId: "*"` (channel-wide, no peer/guild/team)
6. Default agent (`agents.list[].default`, otherwise first list entry, otherwise `"main"`)

Within each match layer, the first matching entry in `bindings` wins.

## Tools Configuration

### `tools`

Tool execution and security policies.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `exec.elevated.enabled` | boolean | `false` | Enable elevated bash (`! <cmd>`) |
| `exec.elevated.allowFrom` | object | - | Per-channel elevated allowlist |
| `browser.enabled` | boolean | - | Enable browser tools |
| `agentToAgent.enabled` | boolean | - | Enable agent-to-agent messaging |
| `agentToAgent.allow` | string[] | - | Allowed agent ID list |

## Broadcast Configuration

### `broadcast`

Send messages to multiple channels/agents.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `strategy` | string | - | Broadcast strategy (`parallel` \| `sequential`) |
| `<peerId>` | string[] | - | Send messages to these agents (dynamic keys) |

::: info Broadcast Keys
- Key format: `<peerId>` (e.g., `+15555550123` or `"120363403215116621@g.us"`)
- Value: Agent ID array
- Special key `"strategy"`: Controls parallel vs sequential execution

## Audio Configuration

### `audio`

Audio and transcription configuration.

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

::: info Field Details
For complete transcription configuration fields, refer to `TranscribeAudioSchema` in `zod-schema.core.ts`.

## Messages Configuration

### `messages`

Message prefixes, acknowledgments, and queue behavior.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `responsePrefix` | string | - | Prefix for all outbound replies (supports template variables) |
| `ackReaction` | string | - | Emoji to acknowledge inbound messages |
| `ackReactionScope` | string | - | When to send acknowledgment (`group-mentions` \| `group-all` \| `direct` \| `all`) |
| `removeAckAfterReply` | boolean | `false` | Remove acknowledgment after sending reply |
| `queue.mode` | string | - | Queue mode (`steer` \| `followup` \| `collect` \| `steer-backlog` \| `queue` \| `interrupt`) |
| `queue.debounceMs` | number | - | Queue debounce (milliseconds) |
| `queue.cap` | number | - | Queue cap |
| `queue.drop` | string | - | Drop policy (`old` \| `new` \| `summarize`) |
| `queue.byChannel` | object | - | Per-channel queue mode |
| `inbound.debounceMs` | number | - | Inbound message debounce (milliseconds; 0 disables) |
| `inbound.byChannel` | object | - | Per-channel debounce duration |
| `groupChat.historyLimit` | number | - | Group history context limit (0 disables) |

**Template Variables** (for `responsePrefix`):

| Variable | Description | Examples |
|----------|-------------|----------|
| `{model}` | Short model name | `claude-opus-4-5`, `gpt-4` |
| `{modelFull}` | Full model identifier | `anthropic/claude-opus-4-5` |
| `{provider}` | Provider name | `anthropic`, `openai` |
| `{thinkingLevel}` | Current reasoning level | `high`, `low`, `off` |
| `{identity.name}` | Agent identity name | (same as `"auto"` mode) |

::: tip WhatsApp Self-Chat
Self-chat replies default to `[{identity.name}]`, otherwise `[clawdbot]`, keeping conversations with the same number readable.

## Commands Configuration

### `commands`

Chat command processing configuration.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `native` | string | `auto` | Native commands (`auto` \| `true` \| `false`) |
| `text` | boolean | `true` | Parse slash commands in chat messages |
| `bash` | boolean | `false` | Allow `!` (alias for `/bash`) |
| `bashForegroundMs` | number | `2000` | Bash foreground window (milliseconds) |
| `config` | boolean | `false` | Allow `/config` (writes to disk) |
| `debug` | boolean | `false` | Allow `/debug` (runtime override only) |
| `restart` | boolean | `false` | Allow `/restart` + Gateway restart tools |
| `useAccessGroups` | boolean | `true` | Enforce access group allowlist/policies for commands |

::: warning bash Commands
`commands.bash: true` enables `! <cmd>` to run host shell commands (`/bash <cmd>` also works as alias). Requires `tools.elevated.enabled` and sender in allowlist.

## Session Configuration

### `session`

Session persistence and behavior.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `activation.defaultMode` | string | `auto` | Default activation mode (`auto` \| `always` \| `manual`) |
| `activation.defaultDurationMs` | number | - | Default activation duration (milliseconds) |
| `activation.keepAlive` | boolean | - | Keep alive |
| `compaction.auto` | boolean | `true` | Auto compaction |
| `compaction.threshold` | number | - | Compaction threshold (0-1) |
| `compaction.strategy` | string | - | Compaction strategy |

::: info Session Compaction
Auto-compacts on context overflow before failing. See `CHANGELOG.md:122`.

## Cron Configuration

### `cron`

Scheduled task scheduling.

```json5
{
  cron: {
    enabled: true,
    store: "~/.clawdbot/cron.json",
    maxConcurrentRuns: 5
  }
}
```

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | - | Enable Cron engine |
| `store` | string | - | Cron storage file path |
| `maxConcurrentRuns` | number | - | Max concurrent runs |

## Hooks Configuration

### `hooks`

Webhooks and event forwarding.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | - | Enable Hooks |
| `path` | string | - | Hooks directory path |
| `token` | string | - | Webhook authentication token |
| `maxBodyBytes` | number | - | Max request body size (bytes) |
| `presets` | string[] | - | Preset hook list |
| `transformsDir` | string | - | Hook transform scripts directory |
| `mappings` | array | - | Custom hook mappings |
| `gmail.enabled` | boolean | - | Enable Gmail Pub/Sub |
| `gmail.credentialsPath` | string | - | Gmail credentials path |
| `gmail.subscriptionIds` | string[] | - | Gmail subscription ID list |
| `internal.onMessage` | string | - | Message internal hook |
| `internal.onToolCall` | string | - | Tool call internal hook |
| `internal.onError` | string | - | Error internal hook |

## Channels Configuration

### `channels`

Multi-channel messaging integration configuration.

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

::: tip Channel-Specific Documentation
Each channel has detailed configuration options. Refer to:
- [WhatsApp Channel](../../platforms/whatsapp/)
- [Telegram Channel](../../platforms/telegram/)
- [Slack Channel](../../platforms/slack/)
- [Discord Channel](../../platforms/discord/)
- [Google Chat Channel](../../platforms/googlechat/)
- [Signal Channel](../../platforms/signal/)
- [iMessage Channel](../../platforms/imessage/)

**Common Channel Fields**:
- `enabled`: Enable channel
- `dmPolicy`: DM policy (`pairing` \| `allowlist` \| `open` \| `disabled`)
- `allowFrom`: DM allowlist (unknown senders receive pairing code in `pairing` mode)
- `groupPolicy`: Group policy (`open` \| `disabled` \| `allowlist`)
- `historyLimit`: History context limit (0 disables)

## Gateway Configuration

### `gateway`

Gateway WebSocket server and authentication.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `port` | number | `18789` | Gateway WebSocket port |
| `mode` | string | `local` | Gateway mode (`local` \| `remote`) |
| `bind` | string | - | Bind address (`auto` \| `lan` \| `loopback` \| `custom` \| `tailnet`) |
| `controlUi.enabled` | boolean | - | Enable control UI |
| `controlUi.basePath` | string | - | UI base path |
| `controlUi.allowInsecureAuth` | boolean | - | Allow insecure authentication |
| `auth.mode` | string | - | Authentication mode (`token` \| `password`) |
| `auth.token` | string | - | Authentication token |
| `auth.password` | string | - | Authentication password |
| `auth.allowTailscale` | boolean | - | Allow Tailscale authentication |
| `tailscale.mode` | string | `off` | Tailscale mode (`off` \| `serve` \| `funnel`) |
| `tailscale.resetOnExit` | boolean | - | Reset Serve/Funnel on exit |
| `remote.url` | string | - | Remote Gateway URL |
| `remote.transport` | string | - | Remote transport (`ssh` \| `direct`) |
| `remote.token` | string | - | Remote token |
| `remote.password` | string | - | Remote password |
| `remote.tlsFingerprint` | string | - | Remote TLS fingerprint |
| `remote.sshTarget` | string | - | SSH target |
| `remote.sshIdentity` | string | - | SSH identity file path |
| `reload.mode` | string | - | Reload mode (`off` \| `restart` \| `hot` \| `hybrid`) |
| `reload.debounceMs` | number | - | Reload debounce (milliseconds) |
| `tls.enabled` | boolean | - | Enable TLS |
| `tls.autoGenerate` | boolean | - | Auto-generate certificates |
| `nodes.browser.mode` | string | - | Browser node mode (`auto` \| `manual` \| `off`) |
| `nodes.allowCommands` | string[] | - | Allowed node commands |
| `nodes.denyCommands` | string[] | - | Denied node commands |

::: warning Tailscale Binding Restriction
When enabling Serve/Funnel, `gateway.bind` must remain `loopback` (Clawdbot enforces this rule).

## Skills Configuration

### `skills`

Skill platform and installation.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `allowBundled` | string[] | - | Allowed built-in skills list |
| `load.extraDirs` | string[] | - | Additional skill directories |
| `load.watch` | boolean | - | Watch for skill file changes |
| `load.watchDebounceMs` | number | - | Watch debounce (milliseconds) |
| `install.preferBrew` | boolean | - | Prefer Homebrew installation |
| `install.nodeManager` | string | - | Node manager (`npm` \| `pnpm` \| `yarn` \| `bun`) |
| `entries.<skillId>.enabled` | boolean | - | Enable skill |
| `entries.<skillId>.apiKey` | string | - | Skill API key |
| `entries.<skillId>.env` | object | - | Skill environment variables |
| `entries.<skillId>.config` | object | - | Skill configuration |

## Plugins Configuration

### `plugins`

Plugin system configuration.

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

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `enabled` | boolean | - | Enable plugin system |
| `allow` | string[] | - | Allowed plugin list |
| `deny` | string[] | - | Denied plugin list |
| `load.paths` | string[] | - | Plugin load paths |
| `slots.memory` | string | - | Custom memory provider |

## Configuration Includes (`$include`)

Use `$include` directive to split configuration into multiple files.

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: { port: 18789 },

  // Include single file (replaces the value of the containing key)
  agents: { "$include": "./agents.json5" },

  // Include multiple files (merge deeply in order)
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

**Merge Behavior**:
- **Single file**: Replaces the object containing `$include`
- **File array**: Merges files deeply in order (later files override earlier ones)
- **Sibling keys**: Merges sibling keys after inclusion (overrides included values)
- **Sibling keys + array/primitive**: Not supported (included content must be an object)

**Path Resolution**:
- **Relative paths**: Resolved relative to the including file
- **Absolute paths**: Used as-is
- **Parent directories**: `../` references work as expected

**Nested Includes**:
Included files can themselves contain `$include` directives (up to 10 levels deep).

## Environment Variable Substitution

You can reference environment variables directly using `${VAR_NAME}` syntax in any configuration string value. Variables are substituted at configuration load time, before validation.

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

**Rules**:
- Only matches uppercase environment variable names: `[A-Z_][A-Z0-9_]*`
- Missing or empty environment variables throw an error at configuration load time
- Use `$${VAR}` to escape to output literal `${VAR}`
- Applies to `$include` (included files also get substitution)

::: warning Missing Variables
Missing or empty environment variables will throw an error at configuration load time.

## Configuration Validation and Diagnostics

When configuration validation fails, use `clawdbot doctor` to see the exact issue.

```bash
## Diagnose configuration
clawdbot doctor

## Auto-fix issues (requires manual confirmation)
clawdbot doctor --fix

## Auto-fix (skip confirmation)
clawdbot doctor --yes
```

**Diagnostic Features**:
- Detect unknown configuration keys
- Validate data types
- Detect missing required fields
- Apply configuration migrations
- Detect insecure DM policies
- Validate channel configuration

## Configuration File Paths

| File | Path | Description |
|------|------|-------------|
| Main Config | `~/.clawdbot/clawdbot.json` | Main configuration file |
| Environment Variables | `~/.clawdbot/.env` | Global environment variables |
| Workspace Environment | `~/clawd/.env` | Workspace environment variables |
| Auth Profiles | `<agentDir>/auth-profiles.json` | Authentication profile configuration |
| Runtime Cache | `<agentDir>/auth.json` | Embedded agent runtime cache |
| Legacy OAuth | `~/.clawdbot/credentials/oauth.json` | Legacy OAuth import |
| Cron Store | `~/.clawdbot/cron.json` | Cron task storage |
| Hooks Path | `~/.clawdbot/hooks` | Hooks directory |

---

## Lesson Summary

This tutorial covered the complete Clawdbot configuration system in detail, including:

- ✅ Configuration file structure and validation mechanism
- ✅ All core configuration sections (authentication, agents, channels, sessions, tools, Cron, Hooks, etc.)
- ✅ Environment variable substitution and configuration priority
- ✅ Common configuration examples and best practices
- ✅ Configuration file paths and storage locations

## Next Lesson Preview

> In the next lesson, we'll learn about **[Gateway WebSocket API Protocol](./api-protocol/)**.
>
> You'll learn:
> - WebSocket connection handshake and authentication
> - Message frame formats (requests, responses, events)
> - Core method reference and invocation examples
> - Permission system and role management
> - Error handling and retry strategies

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Configuration Section | File Path | Line Numbers |
|---------------------|-----------|--------------|
| Main Schema | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | 1-556 |
| Core Schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300 |
| Agents Schema | [`src/config/zod-schema.agents.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agents.ts) | 1-54 |
| Channels Schema | [`src/config/zod-schema.channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.channels.ts) | 1-11 |
| Session Schema | [`src/config/zod-schema.session.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.session.ts) | - |
| Tools Schema | [`src/config/zod-schema.agent-runtime.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agent-runtime.ts) | - |
| Hooks Schema | [`src/config/zod-schema.hooks.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.hooks.ts) | - |
| Providers Schema | [`src/config/zod-schema.providers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers.ts) | - |
| Configuration Documentation | [`docs/gateway/configuration.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/gateway/configuration.md) | - |

**Key Constants**:
- Default port: `18789` (`gateway.server-startup-log.ts`)
- Default workspace: `~/clawd`
- Default Gateway binding: `loopback` (127.0.0.1)

**Key Functions**:
- `ClawdbotSchema`: Main configuration Schema definition
- `normalizeAllowFrom()`: Normalize allowlist values
- `requireOpenAllowFrom()`: Validate open mode allowlist
</details>
