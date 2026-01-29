---
title: "Clawdbot 完整設定參考：所有設定項詳解 | 設定教學"
sidebarTitle: "掌控所有設定"
subtitle: "完整設定參考"
description: "學習 Clawdbot 完整設定系統。本參考文件詳細說明所有設定節、欄位類型、預設值和實用範例，幫助你自訂和優化 Clawdbot 的行為。包括認證設定、模型設定、管道選項、工具策略、沙箱隔離、會話管理、訊息處理、Cron 任務、Hooks、Gateway、Tailscale、Skills、Plugins、Node Host、Canvas、Talk、廣播、日誌、更新、UI 等 50+ 個核心設定節，涵蓋從基礎到進階的所有選項。適合快速查閱所有可用設定項，定位需要的設定，提升使用效率，實現個性化設定。了解每個設定項的作用和影響，快速找到需要的選項，避免設定錯誤。無論新手還是進階用戶，都能從中快速找到需要的設定項，提升工作效率，解決設定難題。設定參考文件幫助你全面了解和掌握 Clawdbot 的設定系統，實現個性化客製。適合查閱、除錯和進階設定。推薦所有用戶閱讀本設定參考，了解每個設定項的含義和用法，充分利用 Clawdbot 的強大功能。"
tags:
  - "設定"
  - "參考"
  - "完整指南"
order: 340
---

# 完整設定參考

Clawdbot 讀取選用的 JSON5 設定檔（支援註解和尾隨逗號）：`~/.clawdbot/clawdbot.json`

如果設定檔遺失，Clawdbot 使用安全的預設值（嵌入式 Pi agent + 按發送者會話 + 工作區 `~/clawd`）。你通常只需要設定來：
- 限制誰可以觸發機器人（`channels.whatsapp.allowFrom`，`channels.telegram.allowFrom` 等）
- 控制群組白名單 + 提及行為（`channels.whatsapp.groups`，`channels.telegram.groups`，`channels.discord.guilds`）
- 自訂訊息前綴（`messages`）
- 設定代理的工作區（`agents.defaults.workspace` 或 `agents.list[].workspace`）
- 調整嵌入式代理預設值（`agents.defaults`）和會話行為（`session`）
- 設定每個代理的身份（`agents.list[].identity`）

::: tip 新手入門？
如果你是第一次設定，建議先閱讀 [快速開始](../../start/getting-started/) 和 [嚮導式設定](../../start/onboarding-wizard/) 教學。

## 設定驗證機制

Clawdbot 只接受完全符合 Schema 的設定。未知鍵、格式錯誤的類型或無效值會導致 Gateway **拒絕啟動**以確保安全。

當驗證失敗時：
- Gateway 不會啟動
- 只允許診斷命令（例如：`clawdbot doctor`，`clawdbot logs`，`clawdbot health`，`clawdbot status`，`clawdbot service`，`clawdbot help`）
- 執行 `clawdbot doctor` 查看確切的問題
- 執行 `clawdbot doctor --fix`（或 `--yes`）應用遷移/修復

::: warning 警告
Doctor 除非你明確選擇 `--fix`/`--yes`，否則不會寫入任何變更。

## 設定檔結構

Clawdbot 設定檔是一個分層物件，包含以下主要設定節：

```json5
{
  // 核心設定
  meta: {},
  env: {},
  wizard: {},
  diagnostics: {},
  logging: {},
  update: {},
  
  // 功能設定
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

## 核心設定

### `meta`

設定檔的元資料（由 CLI 嚮導自動寫入）。

```json5
{
  meta: {
    lastTouchedVersion: "2026.1.24",
    lastTouchedAt: "2026-01-27T00:00:00.000Z"
  }
}
```

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `lastTouchedVersion` | string | - | 最後修改此設定的 Clawdbot 版本 |
| `lastTouchedAt` | string | - | 最後修改此設定的時間（ISO 8601） |

### `env`

環境變數設定和 shell 環境匯入。

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
    // 任意鍵值對
    CUSTOM_VAR: "value"
  }
}
```

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `shellEnv.enabled` | boolean | `false` | 是否從登入 shell 匯入環境變數（僅匯入遺失的鍵） |
| `shellEnv.timeoutMs` | number | `15000` | shell 環境匯入逾時（毫秒） |
| `vars` | object | - | 內聯環境變數（鍵值對） |

**注意**：`vars` 僅在程式環境變數中遺失對應鍵時應用。永遠不會覆蓋現有環境變數。

::: info 環境變數優先級
程式環境變數 > `.env` 檔 > `~/.clawdbot/.env` > 設定檔中的 `env.vars`

### `wizard`

由 CLI 嚮導（`onboard`，`configure`，`doctor`）寫入的元資料。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `lastRunAt` | string | - | 最後執行嚮導的時間 |
| `lastRunVersion` | string | - | 最後執行嚮導時的 Clawdbot 版本 |
| `lastRunCommit` | string | - | 最後執行嚮導時的 Git commit hash |
| `lastRunCommand` | string | - | 最後執行的嚮導命令 |
| `lastRunMode` | string | - | 嚮導執行模式（`local` \| `remote`） |

### `diagnostics`

診斷遙測和 OpenTelemetry 設定。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `enabled` | boolean | `false` | 啟用診斷功能 |
| `flags` | string[] | - | 診斷旗標列表 |
| `otel.enabled` | boolean | `false` | 啟用 OpenTelemetry 遙測 |
| `otel.endpoint` | string | - | OTEL 收集器端點 |
| `otel.protocol` | string | - | OTEL 協定（`http/protobuf` \| `grpc`） |
| `otel.headers` | object | - | OTEL 請求標頭 |
| `otel.serviceName` | string | - | OTEL 服務名稱 |
| `otel.traces` | boolean | - | 收集追蹤資料 |
| `otel.metrics` | boolean | - | 收集指標資料 |
| `otel.logs` | boolean | - | 收集日誌資料 |
| `otel.sampleRate` | number | - | 採樣率（0-1） |
| `otel.flushIntervalMs` | number | - | 清除間隔（毫秒） |
| `cacheTrace.enabled` | boolean | `false` | 啟用追蹤快取 |
| `cacheTrace.filePath` | string | - | 追蹤快取檔案路徑 |
| `cacheTrace.includeMessages` | boolean | - | 在快取中包含訊息 |
| `cacheTrace.includePrompt` | boolean | - | 在快取中包含提示 |
| `cacheTrace.includeSystem` | boolean | - | 在快取中包含系統提示 |

### `logging`

日誌設定。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `level` | string | `info` | 日誌層級（`silent` \| `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`） |
| `file` | string | - | 日誌檔案路徑（預設：`/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`） |
| `consoleLevel` | string | `info` | 主控台日誌層級（與 `level` 選項相同） |
| `consoleStyle` | string | `pretty` | 主控台輸出樣式（`pretty` \| `compact` \| `json`） |
| `redactSensitive` | string | `tools` | 敏感資訊脫敏模式（`off` \| `tools`） |
| `redactPatterns` | string[] | - | 自訂脫敏正則模式（覆蓋預設值） |

::: tip 日誌檔案路徑
如果你想要一個穩定的日誌檔案路徑，設定 `logging.file` 為 `/tmp/clawdbot/clawdbot.log`（而不是預設的每日輪替路徑）。

### `update`

更新通道和自動檢查設定。

```json5
{
  update: {
    channel: "stable",
    checkOnStart: true
  }
}
```

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `channel` | string | `stable` | 更新通道（`stable` \| `beta` \| `dev`） |
| `checkOnStart` | boolean | - | 啟動時檢查更新 |

### `browser`

瀏覽器自動化設定（基於 Playwright）。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | 啟用瀏覽器工具 |
| `controlUrl` | string | - | 瀏覽器控制 WebSocket URL |
| `controlToken` | string | - | 瀏覽器控制認證權杖 |
| `cdpUrl` | string | - | Chrome DevTools Protocol URL |
| `remoteCdpTimeoutMs` | number | - | 遠端 CDP 逾時（毫秒） |
| `remoteCdpHandshakeTimeoutMs` | number | - | 遠端 CDP 握手逾時（毫秒） |
| `color` | string | - | UI 中顯示的十六進制顏色 |
| `executablePath` | string | - | 瀏覽器可執行檔路徑 |
| `headless` | boolean | - | 無頭模式 |
| `noSandbox` | boolean | - | 停用沙箱（Linux 上需要） |
| `attachOnly` | boolean | - | 僅附加到現有瀏覽器實例 |
| `defaultProfile` | string | - | 預設設定檔 ID |
| `snapshotDefaults.mode` | string | - | 快照模式（`efficient`） |
| `profiles` | object | - | 設定檔映射（鍵：設定檔名稱，值：設定） |

**Profile 設定**：
- `cdpPort`：CDP 連接埠（1-65535）
- `cdpUrl`：CDP URL
- `driver`：驅動程式類型（`clawd` \| `extension`）
- `color`：設定檔的十六進制顏色

::: warning 瀏覽器 Profile 命名
Profile 名稱必須只包含小寫字母、數字和連字號：`^[a-z0-9-]+$`

### `ui`

UI 自訂設定（Control UI、WebChat）。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `seamColor` | string | - | Seam 顏色的十六進制值 |
| `assistant.name` | string | - | 助手顯示名稱（最多 50 字元） |
| `assistant.avatar` | string | - | 助手頭像路徑或 URL（最多 200 字元） |

**頭像支援**：
- 工作區相對路徑（必須在代理工作區內）
- `http(s)` URL
- `data:` URI

## 認證設定

### `auth`

認證設定檔元資料（不儲存金鑰，僅映射設定檔到提供者和模式）。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `profiles` | object | - | 設定檔映射（鍵：設定檔 ID，值：設定） |
| `profiles.<profileId>.provider` | string | - | 提供者名稱 |
| `profiles.<profileId>.mode` | string | - | 認證模式（`api_key` \| `oauth` \| `token`） |
| `profiles.<profileId>.email` | string | - | OAuth 電子郵件（選用） |
| `order` | object | - | 提供者故障轉移順序 |
| `cooldowns.billingBackoffHours` | number | - | 計費問題退避時長（小時） |
| `cooldowns.billingBackoffHoursByProvider` | object | - | 每個提供者的計費退避時長 |
| `cooldowns.billingMaxHours` | number | - | 最大計費退避時長（小時） |
| `cooldowns.failureWindowHours` | number | - | 失敗視窗時長（小時） |

::: tip Claude Code CLI 自動同步
Clawdbot 自動將 OAuth 權杖從 Claude Code CLI 同步到 `auth-profiles.json`（當存在於 Gateway 主機上時）：
- macOS：Keychain 專案 "Claude Code-credentials"（選擇"始終允許"以避免 launchd 提示）
- Linux/Windows：`~/.claude/.credentials.json`

**認證儲存位置**：
- `<agentDir>/auth-profiles.json`（預設：`~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`）
- 遺留匯入：`~/.clawdbot/credentials/oauth.json`

**嵌入代理執行時快取**：
- `<agentDir>/auth.json`（自動管理；不要手動編輯）

## 模型設定

### `models`

AI 模型提供者和設定。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `mode` | string | - | 模型合併模式（`merge` \| `replace`） |
| `providers` | object | - | 提供者映射（鍵：提供者 ID，值：提供者設定） |
| `providers.<providerId>.baseUrl` | string | - | API 基礎 URL |
| `providers.<providerId>.apiKey` | string | - | API 金鑰（支援環境變數替換） |
| `providers.<providerId>.auth` | string | - | 認證類型（`api_key` \| `aws-sdk` \| `oauth` \| `token`） |
| `providers.<providerId>.api` | string | - | API 類型（`openai-completions` \| `openai-responses` \| `anthropic-messages` \| `google-generative-ai` \| `github-copilot` \| `bedrock-converse-stream`） |
| `providers.<providerId>.authHeader` | boolean | - | 是否使用認證標頭 |
| `providers.<providerId>.headers` | object | - | 自訂 HTTP 標頭 |
| `providers.<providerId>.models` | array | - | 模型定義列表 |
| `bedrockDiscovery.enabled` | boolean | `false` | 啟用 AWS Bedrock 模型發現 |
| `bedrockDiscovery.region` | string | - | AWS 區域 |
| `bedrockDiscovery.providerFilter` | string[] | - | Bedrock 提供者過濾器 |
| `bedrockDiscovery.refreshInterval` | number | - | 重新整理間隔（毫秒） |
| `bedrockDiscovery.defaultContextWindow` | number | - | 預設上下文視窗 |
| `bedrockDiscovery.defaultMaxTokens` | number | - | 預設最大 token 數 |

**模型定義欄位**：
- `id`：模型 ID（必填）
- `name`：模型顯示名稱（必填）
- `api`：API 類型
- `reasoning`：是否為推理模型
- `input`：支援的輸入類型（`text` \| `image`）
- `cost.input`：輸入成本
- `cost.output`：輸出成本
- `cost.cacheRead`：快取讀取成本
- `cost.cacheWrite`：快取寫入成本
- `contextWindow`：上下文視窗大小
- `maxTokens`：最大 token 數
- `compat`：相容性旗標

## 代理設定

### `agents`

代理列表和預設設定。

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

**預設設定**（`agents.defaults`）：

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `workspace` | string | `~/clawd` | 代理工作區目錄 |
| `repoRoot` | string | - | Git 儲存庫根目錄（用於系統提示） |
| `skipBootstrap` | boolean | `false` | 跳過工作區引導檔案建立 |
| `bootstrapMaxChars` | number | `20000` | 每個引導檔案的最大字元數 |
| `userTimezone` | string | - | 使用者時區（系統提示上下文） |
| `timeFormat` | string | `auto` | 時間格式（`auto` \| `12` \| `24`） |
| `model.primary` | string | - | 主要模型（字串形式：`provider/model`） |
| `model.fallbacks` | string[] | - | 故障轉移模型列表 |
| `identity.name` | string | - | 代理名稱 |
| `identity.theme` | string | - | 代理主題 |
| `identity.emoji` | string | - | 代理 emoji |
| `identity.avatar` | string | - | 代理頭像路徑或 URL |
| `groupChat.mentionPatterns` | string[] | - | 群組提及模式（正則） |
| `groupChat.historyLimit` | number | - | 群組歷史限制 |
| `sandbox.mode` | string | - | 沙箱模式（`off` \| `non-main` \| `all`） |
| `sandbox.scope` | string | - | 沙箱範圍（`session` \| `agent` \| `shared`） |
| `sandbox.workspaceAccess` | string | - | 工作區存取權限（`none` \| `ro` \| `rw`） |
| `sandbox.workspaceRoot` | string | - | 自訂沙箱工作區根目錄 |
| `subagents.allowAgents` | string[] | - | 允許的子代理 ID（`["*"]` = 任意） |
| `tools.profile` | string | - | 工具設定檔（應用在 allow/deny 之前） |
| `tools.allow` | string[] | - | 允許的工具列表 |
| `tools.deny` | string[] | - | 拒絕的工具列表（deny 優先） |
| `concurrency.maxConcurrentSessions` | number | - | 最大並發會話數 |
| `concurrency.maxConcurrentToolCalls` | number | - | 最大並發工具呼叫數 |

**代理列表**（`agents.list`）：

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `id` | string | 必填 | 代理 ID（穩定識別符） |
| `default` | boolean | `false` | 是否為預設代理（多個時第一個獲勝） |
| `name` | string | - | 代理顯示名稱 |
| `workspace` | string | `~/clawd-<agentId>` | 代理工作區（覆蓋預設值） |
| `agentDir` | string | `~/.clawdbot/agents/<agentId>/agent` | 代理目錄 |
| `model` | string/object | - | 每個代理的模型設定 |
| `identity` | object | - | 每個代理的身份設定 |
| `groupChat` | object | - | 每個代理的群組聊天設定 |
| `sandbox` | object | - | 每個代理的沙箱設定 |
| `subagents` | object | - | 每個代理的子代理設定 |
| `tools` | object | - | 每個代理的工具限制 |

::: tip 模型設定形式
代理的 `model` 欄位可以採用兩種形式：
- **字串形式**：`"provider/model"`（僅覆蓋 `primary`）
- **物件形式**：`{ primary, fallbacks }`（覆蓋 `primary` 和 `fallbacks`；`[]` 停用該代理的全域故障轉移）

## 綁定設定

### `bindings`

將入站訊息路由到特定代理。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `agentId` | string | 必填 | 目標代理 ID（必須在 `agents.list` 中） |
| `match.channel` | string | 必填 | 符合的管道 |
| `match.accountId` | string | - | 符合的帳戶 ID（`*` = 任意帳戶；省略 = 預設帳戶） |
| `match.peer` | object | - | 符合的同儕（對等方） |
| `match.peer.kind` | string | - | 同儕類型（`dm` \| `group` \| `channel`） |
| `match.peer.id` | string | - | 同儕 ID |
| `match.guildId` | string | - | Discord 伺服器 ID |
| `match.teamId` | string | - | Slack/Microsoft Teams 團隊 ID |

**確定性符合順序**：
1. `match.peer`（最具體）
2. `match.guildId`
3. `match.teamId`
4. `match.accountId`（精確，無同儕/guild/team）
5. `match.accountId: "*"`（管道範圍，無同儕/guild/team）
6. 預設代理（`agents.list[].default`，否則第一個列表條目，否則 `"main"`）

在每個符合層內，`bindings` 中的第一個符合條目獲勝。

## 工具設定

### `tools`

工具執行和安全策略。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `exec.elevated.enabled` | boolean | `false` | 啟用提升 bash（`! <cmd>`） |
| `exec.elevated.allowFrom` | object | - | 每個管道的提升 allowlist |
| `browser.enabled` | boolean | - | 啟用瀏覽器工具 |
| `agentToAgent.enabled` | boolean | - | 啟用代理到代理訊息傳遞 |
| `agentToAgent.allow` | string[] | - | 允許的代理 ID 列表 |

## 廣播設定

### `broadcast`

將訊息發送到多個管道/代理。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `strategy` | string | - | 廣播策略（`parallel` \| `sequential`） |
| `<peerId>` | string[] | - | 將訊息發送到這些代理（動態鍵） |

::: info 廣播鍵
- 鍵格式：`<peerId>`（例如：`+15555550123` 或 `"120363403215116621@g.us"`）
- 值：代理 ID 陣列
- 特殊鍵 `"strategy"`：控制並行與順序執行

## 音訊設定

### `audio`

音訊和轉錄設定。

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

::: info 欄位詳情
完整的轉錄設定欄位請參考 `zod-schema.core.ts` 中的 `TranscribeAudioSchema`。

## 訊息設定

### `messages`

訊息前綴、確認和佇列行為。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `responsePrefix` | string | - | 所有出站回應的前綴（支援模板變數） |
| `ackReaction` | string | - | 確認入站訊息的 emoji |
| `ackReactionScope` | string | - | 何時發送確認（`group-mentions` \| `group-all` \| `direct` \| `all`） |
| `removeAckAfterReply` | boolean | `false` | 發送回應後移除確認 |
| `queue.mode` | string | - | 佇列模式（`steer` \| `followup` \| `collect` \| `steer-backlog` \| `queue` \| `interrupt`） |
| `queue.debounceMs` | number | - | 佇列去抖動（毫秒） |
| `queue.cap` | number | - | 佇列上限 |
| `queue.drop` | string | - | 丟棄策略（`old` \| `new` \| `summarize`） |
| `queue.byChannel` | object | - | 每個管道的佇列模式 |
| `inbound.debounceMs` | number | - | 入站訊息去抖動（毫秒；0 停用） |
| `inbound.byChannel` | object | - | 每個管道的去抖動時長 |
| `groupChat.historyLimit` | number | - | 群組歷史上下文限制（0 停用） |

**模板變數**（用於 `responsePrefix`）：

| 變數 | 說明 | 範例 |
|--- | --- | ---|
| `{model}` | 簡短模型名稱 | `claude-opus-4-5`，`gpt-4` |
| `{modelFull}` | 完整模型識別符 | `anthropic/claude-opus-4-5` |
| `{provider}` | 提供者名稱 | `anthropic`，`openai` |
| `{thinkingLevel}` | 當前推理層級 | `high`，`low`，`off` |
| `{identity.name}` | 代理身份名稱 | （與 `"auto"` 模式相同） |

::: tip WhatsApp 自我聊天
自我聊天回應預設使用 `[{identity.name}]`，否則為 `[clawdbot]`，這樣相同號碼的對話保持可讀性。

## 命令設定

### `commands`

聊天命令處理設定。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `native` | string | `auto` | 原生命令（`auto` \| `true` \| `false`） |
| `text` | boolean | `true` | 解析聊天訊息中的斜線命令 |
| `bash` | boolean | `false` | 允許 `!`（`/bash` 的別名） |
| `bashForegroundMs` | number | `2000` | bash 前台視窗（毫秒） |
| `config` | boolean | `false` | 允許 `/config`（寫入磁碟） |
| `debug` | boolean | `false` | 允許 `/debug`（僅執行時覆蓋） |
| `restart` | boolean | `false` | 允許 `/restart` + Gateway 重啟工具 |
| `useAccessGroups` | boolean | `true` | 對命令強制存取群組 allowlist/策略 |

::: warning bash 命令
`commands.bash: true` 啟用 `! <cmd>` 以執行主機 shell 命令（`/bash <cmd>` 也作為別名工作）。需要 `tools.elevated.enabled` 和允許列表中的發送者。

## 會話設定

### `session`

會話持續化和行為。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `activation.defaultMode` | string | `auto` | 預設啟動模式（`auto` \| `always` \| `manual`） |
| `activation.defaultDurationMs` | number | - | 預設啟動時長（毫秒） |
| `activation.keepAlive` | boolean | - | 保持活動狀態 |
| `compaction.auto` | boolean | `true` | 自動壓縮 |
| `compaction.threshold` | number | - | 壓縮閾值（0-1） |
| `compaction.strategy` | string | - | 壓縮策略 |

::: info 會話壓縮
上下文溢出時自動壓縮，然後失敗。參見 `CHANGELOG.md:122`。

## Cron 設定

### `cron`

定時任務排程。

```json5
{
  cron: {
    enabled: true,
    store: "~/.clawdbot/cron.json",
    maxConcurrentRuns: 5
  }
}
```

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | 啟用 Cron 引擎 |
| `store` | string | - | Cron 儲存檔案路徑 |
| `maxConcurrentRuns` | number | - | 最大並發執行數 |

## Hooks 設定

### `hooks`

Webhook 和事件轉發。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | 啟用 Hooks |
| `path` | string | - | Hooks 目錄路徑 |
| `token` | string | - | Webhook 認證權杖 |
| `maxBodyBytes` | number | - | 最大請求主體大小（位元組） |
| `presets` | string[] | - | 預設 Hook 列表 |
| `transformsDir` | string | - | Hook 轉換腳本目錄 |
| `mappings` | array | - | 自訂 Hook 映射 |
| `gmail.enabled` | boolean | - | 啟用 Gmail Pub/Sub |
| `gmail.credentialsPath` | string | - | Gmail 憑證路徑 |
| `gmail.subscriptionIds` | string[] | - | Gmail 訂閱 ID 列表 |
| `internal.onMessage` | string | - | 訊息內部 Hook |
| `internal.onToolCall` | string | - | 工具呼叫內部 Hook |
| `internal.onError` | string | - | 錯誤內部 Hook |

## 管道設定

### `channels`

多管道訊息整合設定。

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

::: tip 管道特定文件
每個管道都有詳細的設定選項。請參考：
- [WhatsApp 管道](../../platforms/whatsapp/)
- [Telegram 管道](../../platforms/telegram/)
- [Slack 管道](../../platforms/slack/)
- [Discord 管道](../../platforms/discord/)
- [Google Chat 管道](../../platforms/googlechat/)
- [Signal 管道](../../platforms/signal/)
- [iMessage 管道](../../platforms/imessage/)

**通用管道欄位**：
- `enabled`：啟用管道
- `dmPolicy`：DM 策略（`pairing` \| `allowlist` \| `open` \| `disabled`）
- `allowFrom`：DM allowlist（`pairing` 模式下未知發送者收到配對代碼）
- `groupPolicy`：群組策略（`open` \| `disabled` \| `allowlist`）
- `historyLimit`：歷史上下文限制（0 停用）

## Gateway 設定

### `gateway`

Gateway WebSocket 伺服器和認證。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `port` | number | `18789` | Gateway WebSocket 連接埠 |
| `mode` | string | `local` | Gateway 模式（`local` \| `remote`） |
| `bind` | string | - | 綁定位址（`auto` \| `lan` \| `loopback` \| `custom` \| `tailnet`） |
| `controlUi.enabled` | boolean | - | 啟用控制 UI |
| `controlUi.basePath` | string | - | UI 基礎路徑 |
| `controlUi.allowInsecureAuth` | boolean | - | 允許不安全認證 |
| `auth.mode` | string | - | 認證模式（`token` \| `password`） |
| `auth.token` | string | - | 認證權杖 |
| `auth.password` | string | - | 認證密碼 |
| `auth.allowTailscale` | boolean | - | 允許 Tailscale 身份驗證 |
| `tailscale.mode` | string | `off` | Tailscale 模式（`off` \| `serve` \| `funnel`） |
| `tailscale.resetOnExit` | boolean | - | 退出時重設 Serve/Funnel |
| `remote.url` | string | - | 遠端 Gateway URL |
| `remote.transport` | string | - | 遠端傳輸（`ssh` \| `direct`） |
| `remote.token` | string | - | 遠端權杖 |
| `remote.password` | string | - | 遠端密碼 |
| `remote.tlsFingerprint` | string | - | 遠端 TLS 指紋 |
| `remote.sshTarget` | string | - | SSH 目標 |
| `remote.sshIdentity` | string | - | SSH 身份檔案路徑 |
| `reload.mode` | string | - | 重載模式（`off` \| `restart` \| `hot` \| `hybrid`） |
| `reload.debounceMs` | number | - | 重載去抖動（毫秒） |
| `tls.enabled` | boolean | - | 啟用 TLS |
| `tls.autoGenerate` | boolean | - | 自動產生憑證 |
| `nodes.browser.mode` | string | - | 瀏覽器節點模式（`auto` \| `manual` \| `off`） |
| `nodes.allowCommands` | string[] | - | 允許的節點命令 |
| `nodes.denyCommands` | string[] | - | 拒絕的節點命令 |

::: warning Tailscale 綁定限制
啟用 Serve/Funnel 時，`gateway.bind` 必須保持 `loopback`（Clawdbot 強制執行此規則）。

## 技能設定

### `skills`

技能平台和安裝。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `allowBundled` | string[] | - | 允許的內建技能列表 |
| `load.extraDirs` | string[] | - | 額外的技能目錄 |
| `load.watch` | boolean | - | 監視技能檔案變更 |
| `load.watchDebounceMs` | number | - | 監視去抖動（毫秒） |
| `install.preferBrew` | boolean | - | 首選 Homebrew 安裝 |
| `install.nodeManager` | string | - | 節點管理器（`npm` \| `pnpm` \| `yarn` \| `bun`） |
| `entries.<skillId>.enabled` | boolean | - | 啟用技能 |
| `entries.<skillId>.apiKey` | string | - | 技能 API 金鑰 |
| `entries.<skillId>.env` | object | - | 技能環境變數 |
| `entries.<skillId>.config` | object | - | 技能設定 |

## 外掛設定

### `plugins`

外掛系統設定。

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

| 欄位 | 類型 | 必填 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | 啟用外掛系統 |
| `allow` | string[] | - | 允許的外掛列表 |
| `deny` | string[] | - | 拒絕的外掛列表 |
| `load.paths` | string[] | - | 外掛載入路徑 |
| `slots.memory` | string | - | 自訂記憶體提供程式 |

## 設定 Includes（`$include`）

使用 `$include` 指令將設定拆分為多個檔案。

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: { port: 18789 },
  
  // 包含單一檔案（替換包含鍵的值）
  agents: { "$include": "./agents.json5" },
  
  // 包含多個檔案（按順序深度合併）
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

**合併行為**：
- **單一檔案**：替換包含 `$include` 的物件
- **檔案陣列**：按順序深度合併檔案（後面的檔案覆蓋前面的）
- **兄弟鍵**：在包含之後合併兄弟鍵（覆蓋包含的值）
- **兄弟鍵 + 陣列/基本類型**：不支援（包含的內容必須是物件）

**路徑解析**：
- **相對路徑**：相對於包含檔案解析
- **絕對路徑**：按原樣使用
- **父目錄**：`../` 引用按預期工作

**巢狀包含**：
包含的檔案本身可以包含 `$include` 指令（最多 10 層深度）。

## 環境變數替換

你可以在任何設定字串值中直接使用 `${VAR_NAME}` 語法引用環境變數。變數在設定載入時替換，在驗證之前。

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

**規則**：
- 只符合大寫環境變數名稱：`[A-Z_][A-Z0-9_]*`
- 遺失或空的環境變數在設定載入時拋出錯誤
- 使用 `$${VAR}` 跳脫以輸出字面量 `${VAR}`
- 適用於 `$include`（包含的檔案也獲取替換）

::: warning 遺失變數
遺失或空的環境變數會在設定載入時拋出錯誤。

## 設定驗證和診斷

當設定驗證失敗時，使用 `clawdbot doctor` 查看確切的問題。

```bash
## 診斷設定
clawdbot doctor

## 自動修復問題（需手動確認）
clawdbot doctor --fix

## 自動修復（跳過確認）
clawdbot doctor --yes
```

**診斷功能**：
- 偵測未知設定鍵
- 驗證資料類型
- 偵測遺失的必填欄位
- 應用設定遷移
- 偵測不安全的 DM 策略
- 驗證管道設定

## 設定檔路徑

| 檔案 | 路徑 | 說明 |
|--- | --- | ---|
| 主設定 | `~/.clawdbot/clawdbot.json` | 主設定檔 |
| 環境變數 | `~/.clawdbot/.env` | 全域環境變數 |
| 工作區環境 | `~/clawd/.env` | 工作區環境變數 |
| 認證設定檔 | `<agentDir>/auth-profiles.json` | 認證設定檔 |
| 執行時快取 | `<agentDir>/auth.json` | 嵌入代理執行時快取 |
| 遺留 OAuth | `~/.clawdbot/credentials/oauth.json` | 遺留 OAuth 匯入 |
| Cron 儲存 | `~/.clawdbot/cron.json` | Cron 任務儲存 |
| Hooks 路徑 | `~/.clawdbot/hooks` | Hooks 目錄 |

---

## 本課小結

本教學詳細介紹了 Clawdbot 的完整設定系統，包括：

- ✅ 設定檔結構和驗證機制
- ✅ 所有核心設定節（認證、代理、管道、會話、工具、Cron、Hooks 等）
- ✅ 環境變數替換和設定優先級
- ✅ 常見設定範例和最佳實務
- ✅ 設定檔路徑和儲存位置

## 下一課預告

> 下一課我們學習 **[Gateway WebSocket API 協定](./api-protocol/)**。
>
> 你會學到：
> - WebSocket 連線握手和認證
> - 訊息幀格式（請求、回應、事件）
> - 核心方法參考和呼叫範例
> - 權限系統和角色管理
> - 錯誤處理和重試策略

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 設定節 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 主 Schema | [`src/config/zod-schema.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.ts) | 1-556 |
| 核心 Schema | [`src/config/zod-schema.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.core.ts) | 1-300 |
| 代理 Schema | [`src/config/zod-schema.agents.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.agents.ts) | 1-54 |
| 管道 Schema | [`src/config/zod-schema.channels.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.channels.ts) | 1-11 |
| 會話 Schema | [`src/config/zod-schema.session.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.session.ts) | - |
| 工具 Schema | [`src/config/zod-schema.agent-runtime.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.agent-runtime.ts) | - |
| Hooks Schema | [`src/config/zod-schema.hooks.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.hooks.ts) | - |
| 提供者 Schema | [`src/config/zod-schema.providers.ts`](https://github.com/moltbot/moltbot/blob/main/src/config/zod-schema.providers.ts) | - |
| 設定文件 | [`docs/gateway/configuration.md`](https://github.com/moltbot/moltbot/blob/main/docs/gateway/configuration.md) | - |

**關鍵常數**：
- 預設連接埠：`18789`（`gateway.server-startup-log.ts`）
- 預設工作區：`~/clawd`
- 預設 Gateway 綁定：`loopback`（127.0.0.1）

**關鍵函數**：
- `ClawdbotSchema`：主設定 Schema 定義
- `normalizeAllowFrom()`：標準化 allowlist 值
- `requireOpenAllowFrom()`：驗證 open 模式的 allowlist
</details>
