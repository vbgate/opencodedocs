---
title: "Clawdbot 完全設定リファレンス：すべての設定項目の詳細解説 | 設定チュートリアル"
sidebarTitle: "すべての設定をマスター"
subtitle: "完全設定リファレンス"
description: "Clawdbotの完全設定システムを学習します。このリファレンスドキュメントは、すべての設定セクション、フィールドタイプ、デフォルト値、実用的な例を詳しく説明し、Clawdbotの動作をカスタマイズ・最適化するのに役立ちます。認証設定、モデル設定、チャネルオプション、ツール戦略、サンドボックス分離、セッション管理、メッセージ処理、Cronタスク、Hooks、Gateway、Tailscale、Skills、Plugins、Node Host、Canvas、Talk、ブロードキャスト、ログ、更新、UIなど50以上のコア設定セクションを網羅し、基本から高度なオプションまでカバーします。利用可能なすべての設定項目を素早く確認し、必要な設定を見つけて、使用効率を上げ、パーソナライズされた設定を実現するのに適しています。各設定項目の役割と影響を理解し、必要なオプションを素早く見つけ、設定エラーを回避できます。初心者でも上級ユーザーでも、必要な設定項目を素早く見つけて、作業効率を向上させ、設定の課題を解決できます。設定リファレンスドキュメントは、Clawdbotの設定システムを包括的に理解・習得し、パーソナライズされたカスタマイズを実現するのに役立ちます。参照、デバッグ、高度な設定に適しています。すべてのユーザーにこの設定リファレンスを読んで、各設定項目の意味と使い方を理解し、Clawdbotの強力な機能を最大限に活用することをお勧めします。"
tags:
  - "設定"
  - "リファレンス"
  - "完全ガイド"
order: 340
---

# 完全設定リファレンス

ClawdbotはオプションのJSON5設定ファイル（コメントと末尾のカンマをサポート）を読み込みます：`~/.clawdbot/clawdbot.json`

設定ファイルが見つからない場合、Clawdbotは安全なデフォルト値（組み込みPiエージェント + 送信者別セッション + ワークスペース`~/clawd`）を使用します。通常、設定は以下を行うためにのみ必要です：
- 誰がボットをトリガーできるかを制限する（`channels.whatsapp.allowFrom`、`channels.telegram.allowFrom`など）
- グループホワイトリスト + メンション動作を制御する（`channels.whatsapp.groups`、`channels.telegram.groups`、`channels.discord.guilds`）
- メッセージプレフィックスをカスタマイズする（`messages`）
- エージェントのプロキシーワークスペースを設定する（`agents.defaults.workspace`または`agents.list[].workspace`）
- 組み込みエージェントのデフォルト（`agents.defaults`）とセッション動作（`session`）を調整する
- 各エージェントのアイデンティティを設定する（`agents.list[].identity`）

::: tip 初心者向け？
初めて設定する場合は、先に[クイックスタート](../../start/getting-started/)と[設定ウィザード](../../start/onboarding-wizard/)チュートリアルを読むことをお勧めします。

## 設定検証メカニズム

Clawdbotはスキーマに完全に一致する設定のみを受け入れます。不明なキー、型エラー、無効な値により、Gatewayは**起動を拒否**して安全性を確保します。

検証が失敗した場合：
- Gatewayは起動しません
- 診断コマンドのみ許可されます（例：`clawdbot doctor`、`clawdbot logs`、`clawdbot health`、`clawdbot status`、`clawdbot service`、`clawdbot help`）
- `clawdbot doctor`を実行して正確な問題を確認します
- `clawdbot doctor --fix`（または`--yes`）を実行してマイグレーション/修正を適用します

::: warning 警告
Doctorは`--fix`/`--yes`を明示的に選択しない限り、変更を書き込みません。

## 設定ファイル構造

Clawdbot設定ファイルは、以下の主要な設定セクションを含む階層オブジェクトです：

```json5
{
  // コア設定
  meta: {},
  env: {},
  wizard: {},
  diagnostics: {},
  logging: {},
  update: {},
  
  // 機能設定
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

## コア設定

### `meta`

設定ファイルのメタデータ（CLIウィザードによって自動的に書き込まれます）。

```json5
{
  meta: {
    lastTouchedVersion: "2026.1.24",
    lastTouchedAt: "2026-01-27T00:00:00.000Z"
  }
}
```

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `lastTouchedVersion` | string | - | この設定を最後に変更したClawdbotのバージョン |
| `lastTouchedAt` | string | - | この設定を最後に変更した時刻（ISO 8601） |

### `env`

環境変数設定とシェル環境のインポート。

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
    // 任意のキー値ペア
    CUSTOM_VAR: "value"
  }
}
```

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `shellEnv.enabled` | boolean | `false` | ログインシェルから環境変数をインポートするか（欠落しているキーのみインポート） |
| `shellEnv.timeoutMs` | number | `15000` | シェル環境インポートのタイムアウト（ミリ秒） |
| `vars` | object | - | インライン環境変数（キー値ペア） |

**注意**：`vars`はプロセス環境変数に対応するキーが欠落している場合にのみ適用されます。既存の環境変数は決して上書きされません。

::: info 環境変数の優先順位
プロセス環境変数 > `.env`ファイル > `~/.clawdbot/.env` > 設定ファイル内の`env.vars`

### `wizard`

CLIウィザード（`onboard`、`configure`、`doctor`）によって書き込まれるメタデータ。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `lastRunAt` | string | - | ウィザードを最後に実行した時刻 |
| `lastRunVersion` | string | - | ウィザードを最後に実行した時のClawdbotのバージョン |
| `lastRunCommit` | string | - | ウィザードを最後に実行した時のGitコミットハッシュ |
| `lastRunCommand` | string | - | 最後に実行したウィザードコマンド |
| `lastRunMode` | string | - | ウィザードの実行モード（`local` \| `remote`） |

### `diagnostics`

診断テレメトリとOpenTelemetry設定。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `enabled` | boolean | `false` | 診断機能を有効にする |
| `flags` | string[] | - | 診断フラグのリスト |
| `otel.enabled` | boolean | `false` | OpenTelemetryテレメトリを有効にする |
| `otel.endpoint` | string | - | OTELコレクターエンドポイント |
| `otel.protocol` | string | - | OTELプロトコル（`http/protobuf` \| `grpc`） |
| `otel.headers` | object | - | OTELリクエストヘッダー |
| `otel.serviceName` | string | - | OTELサービス名 |
| `otel.traces` | boolean | - | トレースデータを収集 |
| `otel.metrics` | boolean | - | メトリックデータを収集 |
| `otel.logs` | boolean | - | ログデータを収集 |
| `otel.sampleRate` | number | - | サンプリングレート（0-1） |
| `otel.flushIntervalMs` | number | - | フラッシュ間隔（ミリ秒） |
| `cacheTrace.enabled` | boolean | `false` | トレースキャッシュを有効にする |
| `cacheTrace.filePath` | string | - | トレースキャッシュファイルパス |
| `cacheTrace.includeMessages` | boolean | - | キャッシュにメッセージを含める |
| `cacheTrace.includePrompt` | boolean | - | キャッシュにプロンプトを含める |
| `cacheTrace.includeSystem` | boolean | - | キャッシュにシステムプロンプトを含める |

### `logging`

ログ設定。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `level` | string | `info` | ログレベル（`silent` \| `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`） |
| `file` | string | - | ログファイルパス（デフォルト：`/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`） |
| `consoleLevel` | string | `info` | コンソールログレベル（`level`オプションと同じ） |
| `consoleStyle` | string | `pretty` | コンソール出力スタイル（`pretty` \| `compact` \| `json`） |
| `redactSensitive` | string | `tools` | 機密情報の秘匿モード（`off` \| `tools`） |
| `redactPatterns` | string[] | - | カスタム秘匿正規表現パターン（デフォルトを上書き） |

::: tip ログファイルパス
安定したログファイルパスが必要な場合、`logging.file`を`/tmp/clawdbot/clawdbot.log`に設定してください（デフォルトの日次ローテーションパスではなく）。

### `update`

更新チャネルと自動チェック設定。

```json5
{
  update: {
    channel: "stable",
    checkOnStart: true
  }
}
```

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `channel` | string | `stable` | 更新チャネル（`stable` \| `beta` \| `dev`） |
| `checkOnStart` | boolean | - | 起動時に更新をチェック |

### `browser`

ブラウザ自動化設定（Playwrightベース）。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `enabled` | boolean | - | ブラウザツールを有効にする |
| `controlUrl` | string | - | ブラウザ制御WebSocket URL |
| `controlToken` | string | - | ブラウザ制御認証トークン |
| `cdpUrl` | string | - | Chrome DevTools Protocol URL |
| `remoteCdpTimeoutMs` | number | - | リモートCDPタイムアウト（ミリ秒） |
| `remoteCdpHandshakeTimeoutMs` | number | - | リモートCDPハンドシェイクタイムアウト（ミリ秒） |
| `color` | string | - | UIに表示される16進数カラー |
| `executablePath` | string | - | ブラウザ実行可能ファイルパス |
| `headless` | boolean | - | ヘッドレスモード |
| `noSandbox` | boolean | - | サンドボックスを無効化（Linuxで必要） |
| `attachOnly` | boolean | - | 既存のブラウザインスタンスにのみアタッチ |
| `defaultProfile` | string | - | デフォルトプロファイルID |
| `snapshotDefaults.mode` | string | - | スナップショットモード（`efficient`） |
| `profiles` | object | - | プロファイルマッピング（キー：プロファイル名、値：設定） |

**プロファイル設定**：
- `cdpPort`：CDPポート（1-65535）
- `cdpUrl`：CDP URL
- `driver`：ドライバタイプ（`clawd` \| `extension`）
- `color`：プロファイルの16進数カラー

::: warning ブラウザプロファイル命名
プロファイル名は小文字、数字、ハイフンのみを含める必要があります：`^[a-z0-9-]+$`

### `ui`

UIカスタマイズ設定（Control UI、WebChat）。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `seamColor` | string | - | Seamカラーの16進数値 |
| `assistant.name` | string | - | アシスタント表示名（最大50文字） |
| `assistant.avatar` | string | - | アシスタントアバターパスまたはURL（最大200文字） |

**アバーターサポート**：
- ワークスペース相対パス（エージェントワークスペース内にある必要があります）
- `http(s)` URL
- `data:` URI

## 認証設定

### `auth`

認証プロファイルメタデータ（キーは保存せず、プロファイルをプロバイダーとモードにのみマッピング）。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `profiles` | object | - | プロファイルマッピング（キー：プロファイルID、値：設定） |
| `profiles.<profileId>.provider` | string | - | プロバイダー名 |
| `profiles.<profileId>.mode` | string | - | 認証モード（`api_key` \| `oauth` \| `token`） |
| `profiles.<profileId>.email` | string | - | OAuthメール（オプション） |
| `order` | object | - | プロバイダーフェイルオーバー順序 |
| `cooldowns.billingBackoffHours` | number | - | 課金問題バックオフ期間（時間） |
| `cooldowns.billingBackoffHoursByProvider` | object | - | 各プロバイダーの課金バックオフ期間 |
| `cooldowns.billingMaxHours` | number | - | 最大課金バックオフ期間（時間） |
| `cooldowns.failureWindowHours` | number | - | 失敗ウィンドウ期間（時間） |

::: tip Claude Code CLI自動同期
ClawdbotはOAuthトークンをClaude Code CLIから`auth-profiles.json`に自動的に同期します（Gatewayホスト上に存在する場合）：
- macOS：Keychainアイテム"Claude Code-credentials"（launchdプロンプトを回避するには「常に許可」を選択）
- Linux/Windows：`~/.claude/.credentials.json`

**認証ストレージ場所**：
- `<agentDir>/auth-profiles.json`（デフォルト：`~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`）
- レガシーインポート：`~/.clawdbot/credentials/oauth.json`

**組み込みエージェントランタイムキャッシュ**：
- `<agentDir>/auth.json`（自動管理; 手動編集しないでください）

## モデル設定

### `models`

AIモデルプロバイダーと設定。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `mode` | string | - | モデルマージモード（`merge` \| `replace`） |
| `providers` | object | - | プロバイダーマッピング（キー：プロバイダーID、値：プロバイダー設定） |
| `providers.<providerId>.baseUrl` | string | - | APIベースURL |
| `providers.<providerId>.apiKey` | string | - | APIキー（環境変数置換をサポート） |
| `providers.<providerId>.auth` | string | - | 認証タイプ（`api_key` \| `aws-sdk` \| `oauth` \| `token`） |
| `providers.<providerId>.api` | string | - | APIタイプ（`openai-completions` \| `openai-responses` \| `anthropic-messages` \| `google-generative-ai` \| `github-copilot` \| `bedrock-converse-stream`） |
| `providers.<providerId>.authHeader` | boolean | - | 認証ヘッダーを使用するか |
| `providers.<providerId>.headers` | object | - | カスタムHTTPヘッダー |
| `providers.<providerId>.models` | array | - | モデル定義のリスト |
| `bedrockDiscovery.enabled` | boolean | `false` | AWS Bedrockモデルディスカバリーを有効にする |
| `bedrockDiscovery.region` | string | - | AWSリージョン |
| `bedrockDiscovery.providerFilter` | string[] | - | Bedrockプロバイダーフィルター |
| `bedrockDiscovery.refreshInterval` | number | - | リフレッシュ間隔（ミリ秒） |
| `bedrockDiscovery.defaultContextWindow` | number | - | デフォルトコンテキストウィンドウ |
| `bedrockDiscovery.defaultMaxTokens` | number | - | デフォルト最大トークン数 |

**モデル定義フィールド**：
- `id`：モデルID（必須）
- `name`：モデル表示名（必須）
- `api`：APIタイプ
- `reasoning`：推論モデルかどうか
- `input`：サポートされる入力タイプ（`text` \| `image`）
- `cost.input`：入力コスト
- `cost.output`：出力コスト
- `cost.cacheRead`：キャッシュ読み取りコスト
- `cost.cacheWrite`：キャッシュ書き込みコスト
- `contextWindow`：コンテキストウィンドウサイズ
- `maxTokens`：最大トークン数
- `compat`：互換性フラグ

## エージェント設定

### `agents`

エージェントリストとデフォルト設定。

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

**デフォルト設定**（`agents.defaults`）：

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `workspace` | string | `~/clawd` | エージェントワークスペースディレクトリ |
| `repoRoot` | string | - | Gitリポジトリルートディレクトリ（システムプロンプト用） |
| `skipBootstrap` | boolean | `false` | ワークスペースブートストラップファイル作成をスキップ |
| `bootstrapMaxChars` | number | `20000` | 各ブートストラップファイルの最大文字数 |
| `userTimezone` | string | - | ユーザータイムゾーン（システムプロンプトコンテキスト） |
| `timeFormat` | string | `auto` | 時間フォーマット（`auto` \| `12` \| `24`） |
| `model.primary` | string | - | プライマリモデル（文字列形式：`provider/model`） |
| `model.fallbacks` | string[] | - | フェイルオーバーモデルリスト |
| `identity.name` | string | - | エージェント名 |
| `identity.theme` | string | - | エージェントテーマ |
| `identity.emoji` | string | - | エージェント絵文字 |
| `identity.avatar` | string | - | エージェントアバターパスまたはURL |
| `groupChat.mentionPatterns` | string[] | - | グループメンションパターン（正規表現） |
| `groupChat.historyLimit` | number | - | グループ履歴制限 |
| `sandbox.mode` | string | - | サンドボックスモード（`off` \| `non-main` \| `all`） |
| `sandbox.scope` | string | - | サンドボックススコープ（`session` \| `agent` \| `shared`） |
| `sandbox.workspaceAccess` | string | - | ワークスペースアクセス権限（`none` \| `ro` \| `rw`） |
| `sandbox.workspaceRoot` | string | - | カスタムサンドボックスワークスペースルートディレクトリ |
| `subagents.allowAgents` | string[] | - | 許可されたサブエージェントID（`["*"]` = すべて） |
| `tools.profile` | string | - | ツールプロファイル（allow/denyの前に適用） |
| `tools.allow` | string[] | - | 許可されたツールリスト |
| `tools.deny` | string[] | - | 拒否されたツールリスト（denyが優先） |
| `concurrency.maxConcurrentSessions` | number | - | 最大同時セッション数 |
| `concurrency.maxConcurrentToolCalls` | number | - | 最大同時ツール呼び出し数 |

**エージェントリスト**（`agents.list`）：

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `id` | string | 必須 | エージェントID（安定した識別子） |
| `default` | boolean | `false` | デフォルトエージェントか（複数の場合最初のものが優先） |
| `name` | string | - | エージェント表示名 |
| `workspace` | string | `~/clawd-<agentId>` | エージェントワークスペース（デフォルトを上書き） |
| `agentDir` | string | `~/.clawdbot/agents/<agentId>/agent` | エージェントディレクトリ |
| `model` | string/object | - | 各エージェントのモデル設定 |
| `identity` | object | - | 各エージェントのアイデンティティ設定 |
| `groupChat` | object | - | 各エージェントのグループチャット設定 |
| `sandbox` | object | - | 各エージェントのサンドボックス設定 |
| `subagents` | object | - | 各エージェントのサブエージェント設定 |
| `tools` | object | - | 各エージェントのツール制限 |

::: tip モデル設定形式
エージェントの`model`フィールドは2つの形式をとることができます：
- **文字列形式**：`"provider/model"`（`primary`のみを上書き）
- **オブジェクト形式**：`{ primary, fallbacks }`（`primary`と`fallbacks`を上書き；`[]`でそのエージェントのグローバルフェイルオーバーを無効化）

## バインディング設定

### `bindings`

着信メッセージを特定のエージェントにルーティングします。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `agentId` | string | 必須 | ターゲットエージェントID（`agents.list`になければなりません） |
| `match.channel` | string | 必須 | 一致するチャネル |
| `match.accountId` | string | - | 一致するアカウントID（`*` = 任意のアカウント；省略 = デフォルトアカウント） |
| `match.peer` | object | - | 一致するピア（対等者） |
| `match.peer.kind` | string | - | ピアタイプ（`dm` \| `group` \| `channel`） |
| `match.peer.id` | string | - | ピアID |
| `match.guildId` | string | - | DiscordサーバーID |
| `match.teamId` | string | - | Slack/Microsoft TeamsチームID |

**決定論的マッチング順序**：
1. `match.peer`（最も具体的）
2. `match.guildId`
3. `match.teamId`
4. `match.accountId`（正確、ピア/guild/teamなし）
5. `match.accountId: "*"`（チャネルスコープ、ピア/guild/teamなし）
6. デフォルトエージェント（`agents.list[].default`、そうでなければ最初のリスト項目、そうでなければ`"main"`）

各マッチングレイヤー内で、`bindings`の最初の一致する項目が勝ちます。

## ツール設定

### `tools`

ツール実行とセキュリティポリシー。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `exec.elevated.enabled` | boolean | `false` | 昇格bashを有効にする（`! <cmd>`） |
| `exec.elevated.allowFrom` | object | - | 各チャネルの昇格allowlist |
| `browser.enabled` | boolean | - | ブラウザツールを有効にする |
| `agentToAgent.enabled` | boolean | - | エージェント間メッセージングを有効にする |
| `agentToAgent.allow` | string[] | - | 許可されたエージェントIDのリスト |

## ブロードキャスト設定

### `broadcast`

メッセージを複数のチャネル/エージェントに送信します。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `strategy` | string | - | ブロードキャスト戦略（`parallel` \| `sequential`） |
| `<peerId>` | string[] | - | これらのエージェントにメッセージを送信（動的キー） |

::: info ブロードキャストキー
- キー形式：`<peerId>`（例：`+15555550123`または`"120363403215116621@g.us"`）
- 値：エージェントID配列
- 特殊キー`"strategy"`：並列とシーケンシャル実行を制御

## オーディオ設定

### `audio`

オーディオとトランスクリプション設定。

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

::: info フィールド詳細
完全なトランスクリプション設定フィールドについては、`zod-schema.core.ts`内の`TranscribeAudioSchema`を参照してください。

## メッセージ設定

### `messages`

メッセージプレフィックス、確認、キュー動作。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `responsePrefix` | string | - | すべての送信レスポンスのプレフィックス（テンプレート変数をサポート） |
| `ackReaction` | string | - | 着信メッセージを確認する絵文字 |
| `ackReactionScope` | string | - | 確認を送信するタイミング（`group-mentions` \| `group-all` \| `direct` \| `all`） |
| `removeAckAfterReply` | boolean | `false` | レスポンス後に確認を削除 |
| `queue.mode` | string | - | キューモード（`steer` \| `followup` \| `collect` \| `steer-backlog` \| `queue` \| `interrupt`） |
| `queue.debounceMs` | number | - | キューデバウンス（ミリ秒） |
| `queue.cap` | number | - | キューキャップ |
| `queue.drop` | string | - | ドロップ戦略（`old` \| `new` \| `summarize`） |
| `queue.byChannel` | object | - | 各チャネルのキューモード |
| `inbound.debounceMs` | number | - | 着信メッセージデバウンス（ミリ秒；0で無効） |
| `inbound.byChannel` | object | - | 各チャネルのデバウンス時間 |
| `groupChat.historyLimit` | number | - | グループ履歴コンテキスト制限（0で無効） |

**テンプレート変数**（`responsePrefix`用）：

| 変数 | 説明 | 例 |
|------|------|------|
| `{model}` | 短いモデル名 | `claude-opus-4-5`、`gpt-4` |
| `{modelFull}` | 完全なモデル識別子 | `anthropic/claude-opus-4-5` |
| `{provider}` | プロバイダー名 | `anthropic`、`openai` |
| `{thinkingLevel}` | 現在の推論レベル | `high`、`low`、`off` |
| `{identity.name}` | エージェントアイデンティティ名 | （`"auto"`モードと同じ） |

::: tip WhatsAppセルフチャット
セルフチャットレスポンスはデフォルトで`[{identity.name}]`を使用し、そうでなければ`[clawdbot]`を使用します。これにより、同じ番号の会話は可読性を保ちます。

## コマンド設定

### `commands`

チャットコマンド処理設定。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `native` | string | `auto` | ネイティブコマンド（`auto` \| `true` \| `false`） |
| `text` | boolean | `true` | チャットメッセージのスラッシュコマンドを解析 |
| `bash` | boolean | `false` | `!`を許可（`/bash`のエイリアス） |
| `bashForegroundMs` | number | `2000` | bashフォアグラウンドウィンドウ（ミリ秒） |
| `config` | boolean | `false` | `/config`を許可（ディスクに書き込み） |
| `debug` | boolean | `false` | `/debug`を許可（ランタイムオーバーライドのみ） |
| `restart` | boolean | `false` | `/restart`とGateway再起動ツールを許可 |
| `useAccessGroups` | boolean | `true` | コマンドのアクセスグループallowlist/ポリシーを強制 |

::: warning bashコマンド
`commands.bash: true`はホストシェルコマンドを実行するために`! <cmd>`を有効にします（`/bash <cmd>`もエイリアスとして機能します）。`tools.elevated.enabled`とallowlist内の送信者が必要です。

## セッション設定

### `session`

セッション永続化と動作。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `activation.defaultMode` | string | `auto` | デフォルトアクティベーションモード（`auto` \| `always` \| `manual`） |
| `activation.defaultDurationMs` | number | - | デフォルトアクティベーション期間（ミリ秒） |
| `activation.keepAlive` | boolean | - | アクティブ状態を維持 |
| `compaction.auto` | boolean | `true` | 自動圧縮 |
| `compaction.threshold` | number | - | 圧縮しきい値（0-1） |
| `compaction.strategy` | string | - | 圧縮戦略 |

::: info セッション圧縮
コンテキストオーバーフロー時に自動圧縮され、その後失敗します。`CHANGELOG.md:122`を参照してください。

## Cron設定

### `cron`

スケジュールされたタスク。

```json5
{
  cron: {
    enabled: true,
    store: "~/.clawdbot/cron.json",
    maxConcurrentRuns: 5
  }
}
```

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `enabled` | boolean | - | Cronエンジンを有効にする |
| `store` | string | - | Cronストアファイルパス |
| `maxConcurrentRuns` | number | - | 最大同時実行数 |

## Hooks設定

### `hooks`

Webhookとイベント転送。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `enabled` | boolean | - | Hooksを有効にする |
| `path` | string | - | Hooksディレクトリパス |
| `token` | string | - | Webhook認証トークン |
| `maxBodyBytes` | number | - | 最大リクエストボディサイズ（バイト） |
| `presets` | string[] | - | プリセットHookリスト |
| `transformsDir` | string | - | Hook変換スクリプトディレクトリ |
| `mappings` | array | - | カスタムHookマッピング |
| `gmail.enabled` | boolean | - | Gmail Pub/Subを有効にする |
| `gmail.credentialsPath` | string | - | Gmail資格情報パス |
| `gmail.subscriptionIds` | string[] | - | GmailサブスクリプションIDリスト |
| `internal.onMessage` | string | - | メッセージ内部Hook |
| `internal.onToolCall` | string | - | ツール呼び出し内部Hook |
| `internal.onError` | string | - | エラー内部Hook |

## チャネル設定

### `channels`

マルチチャネルメッセージ統合設定。

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

::: tip チャネル固有のドキュメント
各チャネルには詳細な設定オプションがあります。以下を参照してください：
- [WhatsAppチャネル](../../platforms/whatsapp/)
- [Telegramチャネル](../../platforms/telegram/)
- [Slackチャネル](../../platforms/slack/)
- [Discordチャネル](../../platforms/discord/)
- [Google Chatチャネル](../../platforms/googlechat/)
- [Signalチャネル](../../platforms/signal/)
- [iMessageチャネル](../../platforms/imessage/)

**共通チャネルフィールド**：
- `enabled`：チャネルを有効にする
- `dmPolicy`：DMポリシー（`pairing` \| `allowlist` \| `open` \| `disabled`）
- `allowFrom`：DM allowlist（`pairing`モードで未知の送信者はペアリングコードを受け取ります）
- `groupPolicy`：グループポリシー（`open` \| `disabled` \| `allowlist`）
- `historyLimit`：履歴コンテキスト制限（0で無効）

## Gateway設定

### `gateway`

Gateway WebSocketサーバーと認証。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `port` | number | `18789` | Gateway WebSocketポート |
| `mode` | string | `local` | Gatewayモード（`local` \| `remote`） |
| `bind` | string | - | バインドアドレス（`auto` \| `lan` \| `loopback` \| `custom` \| `tailnet`） |
| `controlUi.enabled` | boolean | - | コントロールUIを有効にする |
| `controlUi.basePath` | string | - | UIベースパス |
| `controlUi.allowInsecureAuth` | boolean | - | 安全でない認証を許可 |
| `auth.mode` | string | - | 認証モード（`token` \| `password`） |
| `auth.token` | string | - | 認証トークン |
| `auth.password` | string | - | 認証パスワード |
| `auth.allowTailscale` | boolean | - | Tailscale認証を許可 |
| `tailscale.mode` | string | `off` | Tailscaleモード（`off` \| `serve` \| `funnel`） |
| `tailscale.resetOnExit` | boolean | - | 終了時にServe/Funnelをリセット |
| `remote.url` | string | - | リモートGateway URL |
| `remote.transport` | string | - | リモート転送（`ssh` \| `direct`） |
| `remote.token` | string | - | リモートトークン |
| `remote.password` | string | - | リモートパスワード |
| `remote.tlsFingerprint` | string | - | リモートTLSフィンガープリント |
| `remote.sshTarget` | string | - | SSHターゲット |
| `remote.sshIdentity` | string | - | SSH IDファイルパス |
| `reload.mode` | string | - | リロードモード（`off` \| `restart` \| `hot` \| `hybrid`） |
| `reload.debounceMs` | number | - | リロードデバウンス（ミリ秒） |
| `tls.enabled` | boolean | - | TLSを有効にする |
| `tls.autoGenerate` | boolean | - | 証明書を自動生成 |
| `nodes.browser.mode` | string | - | ブラウザノードモード（`auto` \| `manual` \| `off`） |
| `nodes.allowCommands` | string[] | - | 許可されたノードコマンド |
| `nodes.denyCommands` | string[] | - | 拒否されたノードコマンド |

::: warning Tailscaleバインディング制限
Serve/Funnelが有効な場合、`gateway.bind`は`loopback`のままである必要があります（Clawdbotはこのルールを強制します）。

## スキル設定

### `skills`

スキルプラットフォームとインストール。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `allowBundled` | string[] | - | 許可されたバンドルスキルのリスト |
| `load.extraDirs` | string[] | - | 追加のスキルディレクトリ |
| `load.watch` | boolean | - | スキルファイルの変更を監視 |
| `load.watchDebounceMs` | number | - | 監視デバウンス（ミリ秒） |
| `install.preferBrew` | boolean | - | Homebrewインストールを優先 |
| `install.nodeManager` | string | - | ノードマネージャー（`npm` \| `pnpm` \| `yarn` \| `bun`） |
| `entries.<skillId>.enabled` | boolean | - | スキルを有効にする |
| `entries.<skillId>.apiKey` | string | - | スキルAPIキー |
| `entries.<skillId>.env` | object | - | スキル環境変数 |
| `entries.<skillId>.config` | object | - | スキル設定 |

## プラグイン設定

### `plugins`

プラグインシステム設定。

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

| フィールド | タイプ | 必須 | デフォルト | 説明 |
|---------|-------|-------|----------|------|
| `enabled` | boolean | - | プラグインシステムを有効にする |
| `allow` | string[] | - | 許可されたプラグインのリスト |
| `deny` | string[] | - | 拒否されたプラグインのリスト |
| `load.paths` | string[] | - | プラグインロードパス |
| `slots.memory` | string | - | カスタムメモリプロバイダー |

## 設定Includes（`$include`）

`$include`ディレクティブを使用して設定を複数のファイルに分割します。

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: { port: 18789 },
  
  // 単一ファイルを含める（含まれるキーの値を置換）
  agents: { "$include": "./agents.json5" },
  
  // 複数のファイルを含める（順番に深くマージ）
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

**マージ動作**：
- **単一ファイル**：`$include`を含むオブジェクトを置換
- **ファイル配列**：順番にファイルを深くマージ（後のファイルが前のファイルを上書き）
- **兄弟キー**：含めた後に兄弟キーをマージ（含まれた値を上書き）
- **兄弟キー + 配列/基本型**：サポートされません（含まれる内容はオブジェクトである必要があります）

**パス解決**：
- **相対パス**：含むファイルに対して相対的に解決
- **絶対パス**：そのまま使用
- **親ディレクトリ**：`../`参照は期待通りに動作

**ネストされたインクルード**：
含まれるファイル自体が`$include`ディレクティブを含めることができます（最大10レベルの深さまで）。

## 環境変数置換

任意の設定文字列値で`${VAR_NAME}`構文を使用して環境変数を直接参照できます。変数は設定のロード時に置換され、検証の前に置換されます。

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

**ルール**：
- 大文字の環境変数名のみに一致：`[A-Z_][A-Z0-9_]*`
- 欠落または空の環境変数は設定のロード時にエラーをスローします
- `$${VAR}`を使用してエスケープし、リテラル`${VAR}`を出力します
- `$include`に適用されます（含まれるファイルも置換を取得します）

::: warning 欠落した変数
欠落または空の環境変数は設定のロード時にエラーをスローします。

## 設定検証と診断

設定の検証が失敗した場合、`clawdbot doctor`を実行して正確な問題を確認します。

```bash
## 設定を診断
clawdbot doctor

## 問題を自動修正（手動確認が必要）
clawdbot doctor --fix

## 自動修正（確認をスキップ）
clawdbot doctor --yes
```

**診断機能**：
- 不明な設定キーの検出
- データ型の検証
- 欠落した必須フィールドの検出
- 設定マイグレーションの適用
- 安全でないDMポリシーの検出
- チャネル設定の検証

## 設定ファイルパス

| ファイル | パス | 説明 |
|--------|------|------|
| メイン設定 | `~/.clawdbot/clawdbot.json` | メイン設定ファイル |
| 環境変数 | `~/.clawdbot/.env` | グローバル環境変数 |
| ワークスペース環境 | `~/clawd/.env` | ワークスペース環境変数 |
| 認証プロファイル | `<agentDir>/auth-profiles.json` | 認証プロファイル |
| ランタイムキャッシュ | `<agentDir>/auth.json` | 組み込みエージェントランタイムキャッシュ |
| レガシーOAuth | `~/.clawdbot/credentials/oauth.json` | レガシーOAuthインポート |
| Cronストア | `~/.clawdbot/cron.json` | Cronタスクストア |
| Hooksパス | `~/.clawdbot/hooks` | Hooksディレクトリ |

---

## 本レッスンのまとめ

このチュートリアルでは、Clawdbotの完全な設定システムについて詳しく説明しました：

- ✅ 設定ファイル構造と検証メカニズム
- ✅ すべてのコア設定セクション（認証、エージェント、チャネル、セッション、ツール、Cron、Hooksなど）
- ✅ 環境変数置換と設定優先順位
- ✅ 一般的な設定例とベストプラクティス
- ✅ 設定ファイルパスとストレージ場所

## 次のレッスン

> 次のレッスンでは**[Gateway WebSocket APIプロトコル](./api-protocol/)**を学習します。
>
> 学習内容：
> - WebSocket接続ハンドシェイクと認証
> - メッセージフレーム形式（要求、応答、イベント）
> - コアメソッドリファレンスと呼び出し例
> - 権限システムとロール管理
> - エラー処理と再試行戦略

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-27

| 設定セクション | ファイルパス | 行番号 |
|--------------|-----------|------|
| メインSchema | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | 1-556 |
| コアSchema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300 |
| エージェントSchema | [`src/config/zod-schema.agents.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agents.ts) | 1-54 |
| チャネルSchema | [`src/config/zod-schema.channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.channels.ts) | 1-11 |
| セッションSchema | [`src/config/zod-schema.session.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.session.ts) | - |
| ツールSchema | [`src/config/zod-schema.agent-runtime.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agent-runtime.ts) | - |
| Hooks Schema | [`src/config/zod-schema.hooks.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.hooks.ts) | - |
| プロバイダーSchema | [`src/config/zod-schema.providers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers.ts) | - |
| 設定ドキュメント | [`docs/gateway/configuration.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/gateway/configuration.md) | - |

**重要な定数**：
- デフォルトポート：`18789`（`gateway.server-startup-log.ts`）
- デフォルトワークスペース：`~/clawd`
- デフォルトGatewayバインド：`loopback`（127.0.0.1）

**重要な関数**：
- `ClawdbotSchema`：メイン設定Schema定義
- `normalizeAllowFrom()`：allowlist値を正規化
- `requireOpenAllowFrom()`：オープンモードのallowlistを検証
</details>
