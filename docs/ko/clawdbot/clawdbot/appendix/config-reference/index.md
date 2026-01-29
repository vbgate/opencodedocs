---
title: "Clawdbot 완전한 구성 참조: 모든 구성 항목 상세 설명 | 구성 튜토리얼"
sidebarTitle: "모든 구성 제어"
subtitle: "완전한 구성 참조"
description: "Clawdbot 완전한 구성 시스템을 학습하세요. 이 참조 문서는 모든 구성 섹션, 필드 유형, 기본값 및 실용적인 예제를 상세히 설명하여 Clawdbot 동작을 사용자 지정하고 최적화하는 데 도움을 줍니다. 인증 구성, 모델 설정, 채널 옵션, 도구 전략, 샌드박스 격리, 세션 관리, 메시지 처리, Cron 작업, Hooks, Gateway, Tailscale, Skills, Plugins, Node Host, Canvas, Talk, 브로드캐스트, 로깅, 업데이트, UI 등 50개 이상의 핵심 구성 섹션을 포함합니다. 기본부터 고급까지 모든 옵션을 다룹니다. 사용 가능한 모든 구성 항목을 빠르게 찾고, 필요한 설정을 찾으며, 사용 효율을 높이고, 개인화된 구성을 구현하는 데 적합합니다. 각 구성 항목의 역할과 영향을 이해하고, 필요한 옵션을 빠르게 찾으며, 구성 오류를 방지하세요. 초보자든 고급 사용자든 모든 사용자가 필요한 구성 항목을 빠르게 찾고, 작업 효율을 높이며, 구성 문제를 해결할 수 있습니다. 구성 참조 문서는 Clawdbot 구성 시스템을 완전히 이해하고 마스터하여 개인화된 사용자 지정을 구현하는 데 도움을 줍니다. 조회, 디버깅 및 고급 구성에 적합합니다. 모든 사용자가 이 구성 참조를 읽어 각 구성 항목의 의미와 사용법을 이해하고 Clawdbot의 강력한 기능을 최대한 활용하도록 권장합니다."
tags:
  - "구성"
  - "참조"
  - "완전한 가이드"
order: 340
---

# 완전한 구성 참조

Clawdbot는 선택 사항인 JSON5 구성 파일(주석 및 후행 쉼표 지원)을 읽습니다: `~/.clawdbot/clawdbot.json`

구성 파일이 없으면 Clawdbot는 안전한 기본값을 사용합니다(내장된 Pi 에이전트 + 발신자별 세션 + 작업 공간 `~/clawd`). 일반적으로 다음을 구성하기만 하면 됩니다:
- 봇을 트리거할 수 있는 사용자 제한(`channels.whatsapp.allowFrom`, `channels.telegram.allowFrom` 등)
- 그룹 화이트리스트 + 언급 동작 제어(`channels.whatsapp.groups`, `channels.telegram.groups`, `channels.discord.guilds`)
- 메시지 접두사 사용자 지정(`messages`)
- 프록시 작업 공간 설정(`agents.defaults.workspace` 또는 `agents.list[].workspace`)
- 내장된 에이전트 기본값(`agents.defaults`) 및 세션 동작(`session`) 조정
- 각 에이전트의 ID 설정(`agents.list[].identity`)

::: tip 초보자인가요?
처음 구성하는 경우 먼저 [빠른 시작](../../start/getting-started/) 및 [마법사 구성](../../start/onboarding-wizard/) 튜토리얼을 읽는 것이 좋습니다.

## 구성 유효성 검사 메커니즘

Clawdbot는 스키마와 완전히 일치하는 구성만 허용합니다. 알 수 없는 키, 잘못된 형식의 유형 또는 잘못된 값으로 인해 보안을 보장하기 위해 Gateway가 **시작을 거부**합니다.

유효성 검사가 실패할 때:
- Gateway가 시작되지 않습니다.
- 진단 명령만 허용됩니다(예: `clawdbot doctor`, `clawdbot logs`, `clawdbot health`, `clawdbot status`, `clawdbot service`, `clawdbot help`)
- `clawdbot doctor`를 실행하여 정확한 문제를 확인하세요.
- `clawdbot doctor --fix`(또는 `--yes`)를 실행하여 마이그레이션/수정을 적용하세요.

::: warning 경고
Doctor는 명시적으로 `--fix`/`--yes`를 선택하지 않는 한 변경 사항을 기록하지 않습니다.

## 구성 파일 구조

Clawdbot 구성 파일은 다음 주요 구성 섹션을 포함하는 계층적 개체입니다.

```json5
{
  // 코어 구성
  meta: {},
  env: {},
  wizard: {},
  diagnostics: {},
  logging: {},
  update: {},
  
  // 기능 구성
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

## 코어 구성

### `meta`

구성 파일의 메타데이터(CLI 마법사가 자동으로 작성).

```json5
{
  meta: {
    lastTouchedVersion: "2026.1.24",
    lastTouchedAt: "2026-01-27T00:00:00.000Z"
  }
}
```

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `lastTouchedVersion` | string | - | 이 구성을 마지막으로 수정한 Clawdbot 버전 |
| `lastTouchedAt` | string | - | 이 구성을 마지막으로 수정한 시간(ISO 8601) |

### `env`

환경 변수 구성 및 쉘 환경 가져오기.

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
    // 임의의 키-값 쌍
    CUSTOM_VAR: "value"
  }
}
```

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `shellEnv.enabled` | boolean | `false` | 로그인 쉘에서 환경 변수 가져오기(누락된 키만 가져오기) |
| `shellEnv.timeoutMs` | number | `15000` | 쉘 환경 가져오기 시간 초과(밀리초) |
| `vars` | object | - | 인라인 환경 변수(키-값 쌍) |

**참고**: `vars`는 프로세스 환경 변수에 해당 키가 누락된 경우에만 적용됩니다. 기존 환경 변수를 절대 덮어쓰지 않습니다.

::: info 환경 변수 우선 순위
프로세스 환경 변수 > `.env` 파일 > `~/.clawdbot/.env` > 구성 파일의 `env.vars`

### `wizard`

CLI 마법사(`onboard`, `configure`, `doctor`)가 작성한 메타데이터.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `lastRunAt` | string | - | 마법사를 마지막으로 실행한 시간 |
| `lastRunVersion` | string | - | 마법사를 마지막으로 실행했을 때의 Clawdbot 버전 |
| `lastRunCommit` | string | - | 마법사를 마지막으로 실행했을 때의 Git 커밋 해시 |
| `lastRunCommand` | string | - | 마지막으로 실행한 마법사 명령 |
| `lastRunMode` | string | - | 마법사 실행 모드(`local` \| `remote`) |

### `diagnostics`

진단 원격 분석 및 OpenTelemetry 구성.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | boolean | `false` | 진단 기능 활성화 |
| `flags` | string[] | - | 진단 플래그 목록 |
| `otel.enabled` | boolean | `false` | OpenTelemetry 원격 분석 활성화 |
| `otel.endpoint` | string | - | OTEL 수집기 엔드포인트 |
| `otel.protocol` | string | - | OTEL 프로토콜(`http/protobuf` \| `grpc`) |
| `otel.headers` | object | - | OTEL 요청 헤더 |
| `otel.serviceName` | string | - | OTEL 서비스 이름 |
| `otel.traces` | boolean | - | 추적 데이터 수집 |
| `otel.metrics` | boolean | - | 메트릭 데이터 수집 |
| `otel.logs` | boolean | - | 로그 데이터 수집 |
| `otel.sampleRate` | number | - | 샘플링 비율(0-1) |
| `otel.flushIntervalMs` | number | - | 플러시 간격(밀리초) |
| `cacheTrace.enabled` | boolean | `false` | 추적 캐시 활성화 |
| `cacheTrace.filePath` | string | - | 추적 캐시 파일 경로 |
| `cacheTrace.includeMessages` | boolean | - | 캐시에 메시지 포함 |
| `cacheTrace.includePrompt` | boolean | - | 캐시에 프롬프트 포함 |
| `cacheTrace.includeSystem` | boolean | - | 캐시에 시스템 프롬프트 포함 |

### `logging`

로그 구성.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `level` | string | `info` | 로그 수준(`silent` \| `fatal` \| `error` \| `warn` \| `info` \| `debug` \| `trace`) |
| `file` | string | - | 로그 파일 경로(기본값: `/tmp/clawdbot/clawdbot-YYYY-MM-DD.log`) |
| `consoleLevel` | string | `info` | 콘솔 로그 수준(`level` 옵션과 동일) |
| `consoleStyle` | string | `pretty` | 콘솔 출력 스타일(`pretty` \| `compact` \| `json`) |
| `redactSensitive` | string | `tools` | 민감 정보 수정 모드(`off` \| `tools`) |
| `redactPatterns` | string[] | - | 사용자 지정 수정 정규식 패턴(기본값 덮어쓰기) |

::: tip 로그 파일 경로
안정적인 로그 파일 경로를 원하면 `logging.file`을 `/tmp/clawdbot/clawdbot.log`로 설정하세요(기본 일일 순환 경로 대신).

### `update`

업데이트 채널 및 자동 확인 구성.

```json5
{
  update: {
    channel: "stable",
    checkOnStart: true
  }
}
```

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `channel` | string | `stable` | 업데이트 채널(`stable` \| `beta` \| `dev`) |
| `checkOnStart` | boolean | - | 시작 시 업데이트 확인 |

### `browser`

브라우저 자동화 구성(Playwright 기반).

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | 브라우저 도구 활성화 |
| `controlUrl` | string | - | 브라우저 제어 WebSocket URL |
| `controlToken` | string | - | 브라우저 제어 인증 토큰 |
| `cdpUrl` | string | - | Chrome DevTools Protocol URL |
| `remoteCdpTimeoutMs` | number | - | 원격 CDP 시간 초과(밀리초) |
| `remoteCdpHandshakeTimeoutMs` | number | - | 원격 CDP 핸드셰이크 시간 초과(밀리초) |
| `color` | string | - | UI에 표시되는 16진수 색상 |
| `executablePath` | string | - | 브라우저 실행 파일 경로 |
| `headless` | boolean | - | 헤드리스 모드 |
| `noSandbox` | boolean | - | 샌드박스 비활성화(Linux에서 필요) |
| `attachOnly` | boolean | - | 기존 브라우저 인스턴스에만 연결 |
| `defaultProfile` | string | - | 기본 프로필 ID |
| `snapshotDefaults.mode` | string | - | 스냅샷 모드(`efficient`) |
| `profiles` | object | - | 프로필 매핑(키: 프로필 이름, 값: 구성) |

**프로필 구성**:
- `cdpPort`: CDP 포트(1-65535)
- `cdpUrl`: CDP URL
- `driver`: 드라이버 유형(`clawd` \| `extension`)
- `color`: 프로필의 16진수 색상

::: warning 브라우저 프로필 명명
프로필 이름은 소문자, 숫자 및 하이픈만 포함해야 합니다: `^[a-z0-9-]+$`

### `ui`

UI 사용자 지정 구성(Control UI, WebChat).

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `seamColor` | string | - | Seam 색상의 16진수 값 |
| `assistant.name` | string | - | 어시스턴트 표시 이름(최대 50자) |
| `assistant.avatar` | string | - | 어시스턴트 아바타 경로 또는 URL(최대 200자) |

**아바타 지원**:
- 작업 공간 상대 경로(에이전트 작업 공간 내에 있어야 함)
- `http(s)` URL
- `data:` URI

## 인증 구성

### `auth`

인증 프로필 메타데이터(키는 저장하지 않고 프로필을 제공자 및 모드에만 매핑).

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `profiles` | object | - | 프로필 매핑(키: 프로필 ID, 값: 구성) |
| `profiles.<profileId>.provider` | string | - | 제공자 이름 |
| `profiles.<profileId>.mode` | string | - | 인증 모드(`api_key` \| `oauth` \| `token`) |
| `profiles.<profileId>.email` | string | - | OAuth 이메일(선택 사항) |
| `order` | object | - | 제공자 장애 조치 순서 |
| `cooldowns.billingBackoffHours` | number | - | 청구 문제 백오프 기간(시간) |
| `cooldowns.billingBackoffHoursByProvider` | object | - | 제공자별 청구 백오프 기간 |
| `cooldowns.billingMaxHours` | number | - | 최대 청구 백오프 기간(시간) |
| `cooldowns.failureWindowHours` | number | - | 실패 창 기간(시간) |

::: tip Claude Code CLI 자동 동기화
Clawdbot는 Gateway 호스트에 있을 때 OAuth 토큰을 Claude Code CLI에서 `auth-profiles.json`으로 자동 동기화합니다:
- macOS: 키체인 항목 "Claude Code-credentials"(launchd 프롬프트를 피하려면 "항상 허용" 선택)
- Linux/Windows: `~/.claude/.credentials.json`

**인증 저장 위치**:
- `<agentDir>/auth-profiles.json`(기본값: `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`)
- 레거시 가져오기: `~/.clawdbot/credentials/oauth.json`

**내장 에이전트 런타임 캐시**:
- `<agentDir>/auth.json`(자동 관리, 수동으로 편집하지 마세요)

## 모델 구성

### `models`

AI 모델 제공자 및 구성.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `mode` | string | - | 모델 병합 모드(`merge` \| `replace`) |
| `providers` | object | - | 제공자 매핑(키: 제공자 ID, 값: 제공자 구성) |
| `providers.<providerId>.baseUrl` | string | - | API 기본 URL |
| `providers.<providerId>.apiKey` | string | - | API 키(환경 변수 대체 지원) |
| `providers.<providerId>.auth` | string | - | 인증 유형(`api_key` \| `aws-sdk` \| `oauth` \| `token`) |
| `providers.<providerId>.api` | string | - | API 유형(`openai-completions` \| `openai-responses` \| `anthropic-messages` \| `google-generative-ai` \| `github-copilot` \| `bedrock-converse-stream`) |
| `providers.<providerId>.authHeader` | boolean | - | 인증 헤더 사용 여부 |
| `providers.<providerId>.headers` | object | - | 사용자 지정 HTTP 헤더 |
| `providers.<providerId>.models` | array | - | 모델 정의 목록 |
| `bedrockDiscovery.enabled` | boolean | `false` | AWS Bedrock 모델 발견 활성화 |
| `bedrockDiscovery.region` | string | - | AWS 리전 |
| `bedrockDiscovery.providerFilter` | string[] | - | Bedrock 제공자 필터 |
| `bedrockDiscovery.refreshInterval` | number | - | 새로 고침 간격(밀리초) |
| `bedrockDiscovery.defaultContextWindow` | number | - | 기본 컨텍스트 창 |
| `bedrockDiscovery.defaultMaxTokens` | number | - | 기본 최대 토큰 수 |

**모델 정의 필드**:
- `id`: 모델 ID(필수)
- `name`: 모델 표시 이름(필수)
- `api`: API 유형
- `reasoning`: 추론 모델인지 여부
- `input`: 지원되는 입력 유형(`text` \| `image`)
- `cost.input`: 입력 비용
- `cost.output`: 출력 비용
- `cost.cacheRead`: 캐시 읽기 비용
- `cost.cacheWrite`: 캐시 쓰기 비용
- `contextWindow`: 컨텍스트 창 크기
- `maxTokens`: 최대 토큰 수
- `compat`: 호환성 플래그

## 에이전트 구성

### `agents`

에이전트 목록 및 기본 구성.

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

**기본 구성**(`agents.defaults`):

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `workspace` | string | `~/clawd` | 에이전트 작업 공간 디렉터리 |
| `repoRoot` | string | - | Git 저장소 루트 디렉터리(시스템 프롬프트용) |
| `skipBootstrap` | boolean | `false` | 작업 공간 부트스트랩 파일 생성 건너뛰기 |
| `bootstrapMaxChars` | number | `20000` | 각 부트스트랩 파일의 최대 문자 수 |
| `userTimezone` | string | - | 사용자 시간대(시스템 프롬프트 컨텍스트) |
| `timeFormat` | string | `auto` | 시간 형식(`auto` \| `12` \| `24`) |
| `model.primary` | string | - | 기본 모델(문자열 형식: `provider/model`) |
| `model.fallbacks` | string[] | - | 장애 조치 모델 목록 |
| `identity.name` | string | - | 에이전트 이름 |
| `identity.theme` | string | - | 에이전트 테마 |
| `identity.emoji` | string | - | 에이전트 이모지 |
| `identity.avatar` | string | - | 에이전트 아바타 경로 또는 URL |
| `groupChat.mentionPatterns` | string[] | - | 그룹 언급 패턴(정규식) |
| `groupChat.historyLimit` | number | - | 그룹 기록 제한 |
| `sandbox.mode` | string | - | 샌드박스 모드(`off` \| `non-main` \| `all`) |
| `sandbox.scope` | string | - | 샌드박스 범위(`session` \| `agent` \| `shared`) |
| `sandbox.workspaceAccess` | string | - | 작업 공간 액세스 권한(`none` \| `ro` \| `rw`) |
| `sandbox.workspaceRoot` | string | - | 사용자 지정 샌드박스 작업 공간 루트 디렉터리 |
| `subagents.allowAgents` | string[] | - | 허용된 하위 에이전트 ID(`["*"]` = 모두) |
| `tools.profile` | string | - | 도구 프로필(allow/deny 전에 적용) |
| `tools.allow` | string[] | - | 허용된 도구 목록 |
| `tools.deny` | string[] | - | 거부된 도구 목록(deny 우선) |
| `concurrency.maxConcurrentSessions` | number | - | 최대 동시 세션 수 |
| `concurrency.maxConcurrentToolCalls` | number | - | 최대 동시 도구 호출 수 |

**에이전트 목록**(`agents.list`):

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `id` | string | 필수 | 에이전트 ID(안정적인 식별자) |
| `default` | boolean | `false` | 기본 에이전트인지 여부(여러 개인 경우 첫 번째가 우선) |
| `name` | string | - | 에이전트 표시 이름 |
| `workspace` | string | `~/clawd-<agentId>` | 에이전트 작업 공간(기본값 덮어쓰기) |
| `agentDir` | string | `~/.clawdbot/agents/<agentId>/agent` | 에이전트 디렉터리 |
| `model` | string/object | - | 에이전트별 모델 구성 |
| `identity` | object | - | 에이전트별 ID 구성 |
| `groupChat` | object | - | 에이전트별 그룹 채팅 구성 |
| `sandbox` | object | - | 에이전트별 샌드박스 구성 |
| `subagents` | object | - | 에이전트별 하위 에이전트 구성 |
| `tools` | object | - | 에이전트별 도구 제한 |

::: tip 모델 구성 형식
에이전트의 `model` 필드는 두 가지 형식을 사용할 수 있습니다:
- **문자열 형식**: `"provider/model"`(`primary`만 덮어쓰기)
- **객체 형식**: `{ primary, fallbacks }`(`primary`와 `fallbacks` 모두 덮어쓰기, `[]`는 이 에이전트의 전역 장애 조치 비활성화)

## 바인딩 구성

### `bindings`

인바운드 메시지를 특정 에이전트로 라우팅합니다.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `agentId` | string | 필수 | 대상 에이전트 ID(`agents.list`에 있어야 함) |
| `match.channel` | string | 필수 | 일치하는 채널 |
| `match.accountId` | string | - | 일치하는 계정 ID(`*` = 모든 계정, 생략 = 기본 계정) |
| `match.peer` | object | - | 일치하는 피어(동료) |
| `match.peer.kind` | string | - | 피어 유형(`dm` \| `group` \| `channel`) |
| `match.peer.id` | string | - | 피어 ID |
| `match.guildId` | string | - | Discord 서버 ID |
| `match.teamId` | string | - | Slack/Microsoft Teams 팀 ID |

**결정론적 일치 순서**:
1. `match.peer`(가장 구체적)
2. `match.guildId`
3. `match.teamId`
4. `match.accountId`(정확, 피어/guild/team 없음)
5. `match.accountId: "*"`(채널 범위, 피어/guild/team 없음)
6. 기본 에이전트(`agents.list[].default`, 그렇지 않으면 첫 번째 목록 항목, 그렇지 않으면 `"main"`)

각 일치 계층 내에서 `bindings`의 첫 번째 일치 항목이 우선합니다.

## 도구 구성

### `tools`

도구 실행 및 보안 정책.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `exec.elevated.enabled` | boolean | `false` | 상승된 bash 활성화(`! <cmd>`) |
| `exec.elevated.allowFrom` | object | - | 채널별 상승 허용 목록 |
| `browser.enabled` | boolean | - | 브라우저 도구 활성화 |
| `agentToAgent.enabled` | boolean | - | 에이전트 간 메시징 활성화 |
| `agentToAgent.allow` | string[] | - | 허용된 에이전트 ID 목록 |

## 브로드캐스트 구성

### `broadcast`

여러 채널/에이전트로 메시지를 보냅니다.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `strategy` | string | - | 브로드캐스트 전략(`parallel` \| `sequential`) |
| `<peerId>` | string[] | - | 메시지를 이러한 에이전트로 전송(동적 키) |

::: info 브로드캐스트 키
- 키 형식: `<peerId>`(예: `+15555550123` 또는 `"120363403215116621@g.us"`)
- 값: 에이전트 ID 배열
- 특수 키 `"strategy"`: 병렬 및 순차 실행 제어

## 오디오 구성

### `audio`

오디오 및 전사 구성.

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

::: info 필드 세부 정보
전체 전사 구성 필드는 `zod-schema.core.ts`의 `TranscribeAudioSchema`를 참조하세요.

## 메시지 구성

### `messages`

메시지 접두사, 확인 및 대기열 동작.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `responsePrefix` | string | - | 모든 아웃바운드 회신의 접두사(템플릿 변수 지원) |
| `ackReaction` | string | - | 인바운드 메시지를 확인하는 이모지 |
| `ackReactionScope` | string | - | 확인을 보낼 시기(`group-mentions` \| `group-all` \| `direct` \| `all`) |
| `removeAckAfterReply` | boolean | `false` | 회신 후 확인 제거 |
| `queue.mode` | string | - | 대기열 모드(`steer` \| `followup` \| `collect` \| `steer-backlog` \| `queue` \| `interrupt`) |
| `queue.debounceMs` | number | - | 대기열 디바운스(밀리초) |
| `queue.cap` | number | - | 대기열 상한 |
| `queue.drop` | string | - | 드롭 전략(`old` \| `new` \| `summarize`) |
| `queue.byChannel` | object | - | 채널별 대기열 모드 |
| `inbound.debounceMs` | number | - | 인바운드 메시지 디바운스(밀리초, 0은 비활성화) |
| `inbound.byChannel` | object | - | 채널별 디바운스 기간 |
| `groupChat.historyLimit` | number | - | 그룹 기록 컨텍스트 제한(0은 비활성화) |

**템플릿 변수**(`responsePrefix`용):

| 변수 | 설명 | 예 |
|--- | --- | ---|
| `{model}` | 짧은 모델 이름 | `claude-opus-4-5`, `gpt-4` |
| `{modelFull}` | 전체 모델 식별자 | `anthropic/claude-opus-4-5` |
| `{provider}` | 제공자 이름 | `anthropic`, `openai` |
| `{thinkingLevel}` | 현재 추론 수준 | `high`, `low`, `off` |
| `{identity.name}` | 에이전트 ID 이름 | (`"auto"` 모드와 동일) |

::: tip WhatsApp 셀프 채팅
셀프 채팅 회신은 기본적으로 `[{identity.name}]`을 사용하고, 그렇지 않으면 `[clawdbot]`를 사용하여 동일한 번호의 대화를 읽을 수 있게 합니다.

## 명령 구성

### `commands`

채팅 명령 처리 구성.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `native` | string | `auto` | 기본 명령(`auto` \| `true` \| `false`) |
| `text` | boolean | `true` | 채팅 메시지에서 슬래시 명령 구문 분석 |
| `bash` | boolean | `false` | `!` 허용(`/bash`의 별칭) |
| `bashForegroundMs` | number | `2000` | bash 포그라운드 창(밀리초) |
| `config` | boolean | `false` | `/config` 허용(디스크에 기록) |
| `debug` | boolean | `false` | `/debug` 허용(런타임 덮어쓰기만) |
| `restart` | boolean | `false` | `/restart` + Gateway 재시작 도구 허용 |
| `useAccessGroups` | boolean | `true` | 명령에 대한 액세스 그룹 허용 목록/정책 강제 적용 |

::: warning bash 명령
`commands.bash: true`는 호스트 셸 명령을 실행하기 위해 `! <cmd>`를 활성화합니다(`/bash <cmd>`도 별칭으로 작동). `tools.elevated.enabled` 및 허용 목록의 발신자가 필요합니다.

## 세션 구성

### `session`

세션 지속성 및 동작.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `activation.defaultMode` | string | `auto` | 기본 활성화 모드(`auto` \| `always` \| `manual`) |
| `activation.defaultDurationMs` | number | - | 기본 활성화 기간(밀리초) |
| `activation.keepAlive` | boolean | - | 활성 상태 유지 |
| `compaction.auto` | boolean | `true` | 자동 압축 |
| `compaction.threshold` | number | - | 압축 임계값(0-1) |
| `compaction.strategy` | string | - | 압축 전략 |

::: info 세션 압축
컨텍스트 오버플로 시 자동으로 압축된 후 실패합니다. `CHANGELOG.md:122`를 참조하세요.

## Cron 구성

### `cron`

예약된 작업 스케줄링.

```json5
{
  cron: {
    enabled: true,
    store: "~/.clawdbot/cron.json",
    maxConcurrentRuns: 5
  }
}
```

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | Cron 엔진 활성화 |
| `store` | string | - | Cron 저장 파일 경로 |
| `maxConcurrentRuns` | number | - | 최대 동시 실행 수 |

## Hooks 구성

### `hooks`

웹훅 및 이벤트 전달.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | Hooks 활성화 |
| `path` | string | - | Hooks 디렉터리 경로 |
| `token` | string | - | 웹훅 인증 토큰 |
| `maxBodyBytes` | number | - | 최대 요청 본문 크기(바이트) |
| `presets` | string[] | - | 사전 설정 Hook 목록 |
| `transformsDir` | string | - | Hook 변환 스크립트 디렉터리 |
| `mappings` | array | - | 사용자 지정 Hook 매핑 |
| `gmail.enabled` | boolean | - | Gmail Pub/Sub 활성화 |
| `gmail.credentialsPath` | string | - | Gmail 자격 증명 경로 |
| `gmail.subscriptionIds` | string[] | - | Gmail 구독 ID 목록 |
| `internal.onMessage` | string | - | 메시지 내부 Hook |
| `internal.onToolCall` | string | - | 도구 호출 내부 Hook |
| `internal.onError` | string | - | 오류 내부 Hook |

## 채널 구성

### `channels`

다중 채널 메시지 통합 구성.

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

::: tip 채널별 문서
각 채널에는 자세한 구성 옵션이 있습니다. 다음을 참조하세요:
- [WhatsApp 채널](../../platforms/whatsapp/)
- [Telegram 채널](../../platforms/telegram/)
- [Slack 채널](../../platforms/slack/)
- [Discord 채널](../../platforms/discord/)
- [Google Chat 채널](../../platforms/googlechat/)
- [Signal 채널](../../platforms/signal/)
- [iMessage 채널](../../platforms/imessage/)

**공통 채널 필드**:
- `enabled`: 채널 활성화
- `dmPolicy`: DM 정책(`pairing` \| `allowlist` \| `open` \| `disabled`)
- `allowFrom`: DM 허용 목록(`pairing` 모드에서 알 수 없는 발신자가 페어링 코드를 받음)
- `groupPolicy`: 그룹 정책(`open` \| `disabled` \| `allowlist`)
- `historyLimit`: 기록 컨텍스트 제한(0은 비활성화)

## Gateway 구성

### `gateway`

Gateway WebSocket 서버 및 인증.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `port` | number | `18789` | Gateway WebSocket 포트 |
| `mode` | string | `local` | Gateway 모드(`local` \| `remote`) |
| `bind` | string | - | 바인딩 주소(`auto` \| `lan` \| `loopback` \| `custom` \| `tailnet`) |
| `controlUi.enabled` | boolean | - | 제어 UI 활성화 |
| `controlUi.basePath` | string | - | UI 기본 경로 |
| `controlUi.allowInsecureAuth` | boolean | - | 안전하지 않은 인증 허용 |
| `auth.mode` | string | - | 인증 모드(`token` \| `password`) |
| `auth.token` | string | - | 인증 토큰 |
| `auth.password` | string | - | 인증 비밀번호 |
| `auth.allowTailscale` | boolean | - | Tailscale 인증 허용 |
| `tailscale.mode` | string | `off` | Tailscale 모드(`off` \| `serve` \| `funnel`) |
| `tailscale.resetOnExit` | boolean | - | 종료 시 Serve/Funnel 재설정 |
| `remote.url` | string | - | 원격 Gateway URL |
| `remote.transport` | string | - | 원격 전송(`ssh` \| `direct`) |
| `remote.token` | string | - | 원격 토큰 |
| `remote.password` | string | - | 원격 비밀번호 |
| `remote.tlsFingerprint` | string | - | 원격 TLS 지문 |
| `remote.sshTarget` | string | - | SSH 대상 |
| `remote.sshIdentity` | string | - | SSH ID 파일 경로 |
| `reload.mode` | string | - | 다시 로드 모드(`off` \| `restart` \| `hot` \| `hybrid`) |
| `reload.debounceMs` | number | - | 다시 로드 디바운스(밀리초) |
| `tls.enabled` | boolean | - | TLS 활성화 |
| `tls.autoGenerate` | boolean | - | 인증서 자동 생성 |
| `nodes.browser.mode` | string | - | 브라우저 노드 모드(`auto` \| `manual` \| `off`) |
| `nodes.allowCommands` | string[] | - | 허용된 노드 명령 |
| `nodes.denyCommands` | string[] | - | 거부된 노드 명령 |

::: warning Tailscale 바인딩 제한
Serve/Funnel을 활성화하면 `gateway.bind`는 `loopback`(Clawdbot가 이 규칙을 강제 적용)로 유지되어야 합니다.

## 스킬 구성

### `skills`

스킬 플랫폼 및 설치.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `allowBundled` | string[] | - | 허용된 내장 스킬 목록 |
| `load.extraDirs` | string[] | - | 추가 스킬 디렉터리 |
| `load.watch` | boolean | - | 스킬 파일 변경 감시 |
| `load.watchDebounceMs` | number | - | 감시 디바운스(밀리초) |
| `install.preferBrew` | boolean | - | Homebrew 설치 우선 |
| `install.nodeManager` | string | - | 노드 관리자(`npm` \| `pnpm` \| `yarn` \| `bun`) |
| `entries.<skillId>.enabled` | boolean | - | 스킬 활성화 |
| `entries.<skillId>.apiKey` | string | - | 스킬 API 키 |
| `entries.<skillId>.env` | object | - | 스킬 환경 변수 |
| `entries.<skillId>.config` | object | - | 스킬 구성 |

## 플러그인 구성

### `plugins`

플러그인 시스템 구성.

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

| 필드 | 유형 | 필수 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | boolean | - | 플러그인 시스템 활성화 |
| `allow` | string[] | - | 허용된 플러그인 목록 |
| `deny` | string[] | - | 거부된 플러그인 목록 |
| `load.paths` | string[] | - | 플러그인 로드 경로 |
| `slots.memory` | string | - | 사용자 지정 메모리 공급자 |

## 구성 포함(`$include`)

`$include` 지시문을 사용하여 구성을 여러 파일로 분할하세요.

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: { port: 18789 },
  
  // 단일 파일 포함(포함된 키의 값 대체)
  agents: { "$include": "./agents.json5" },
  
  // 여러 파일 포함(순서대로 깊이 병합)
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

**병합 동작**:
- **단일 파일**: `$include`가 포함된 개체를 대체합니다.
- **파일 배열**: 순서대로 파일을 깊이 병합합니다(뒤에 있는 파일이 앞에 있는 파일을 덮어쓰기).
- **형제 키**: 포함 후 형제 키를 병합합니다(포함된 값을 덮어쓰기).
- **형제 키 + 배열/기본 유형**: 지원되지 않음(포함된 콘텐츠는 개체여야 함).

**경로 확인**:
- **상대 경로**: 포함하는 파일을 기준으로 확인합니다.
- **절대 경로**: 있는 그대로 사용합니다.
- **상위 디렉터리**: `../` 참조가 예상대로 작동합니다.

**중첩 포함**:
포함된 파일 자체가 `$include` 지시문을 포함할 수 있습니다(최대 10계층 깊이).

## 환경 변수 대체

`${VAR_NAME}` 구문을 사용하여 모든 구성 문자열 값에서 환경 변수를 직접 참조할 수 있습니다. 변수는 구성이 로드될 때 유효성 검사 전에 대체됩니다.

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

**규칙**:
- 대문자 환경 변수 이름만 일치합니다: `[A-Z_][A-Z0-9_]*`
- 누락되거나 비어 있는 환경 변수는 구성이 로드될 때 오류를 throw합니다.
- `$${VAR}`을 사용하여 리터럴 `${VAR}`을 출력하도록 이스케이프합니다.
- `$include`에 적용됩니다(포함된 파일도 대체를 가져옴).

::: warning 누락된 변수
누락되거나 비어 있는 환경 변수는 구성이 로드될 때 오류를 throw합니다.

## 구성 유효성 검사 및 진단

구성 유효성 검사가 실패하면 `clawdbot doctor`를 사용하여 정확한 문제를 확인하세요.

```bash
## 구성 진단
clawdbot doctor

## 문제 자동 수정(수동 확인 필요)
clawdbot doctor --fix

## 자동 수정(확인 건너뛰기)
clawdbot doctor --yes
```

**진단 기능**:
- 알 수 없는 구성 키 감지
- 데이터 유형 유효성 검사
- 누락된 필수 필드 감지
- 구성 마이그레이션 적용
- 안전하지 않은 DM 정책 감지
- 채널 구성 유효성 검사

## 구성 파일 경로

| 파일 | 경로 | 설명 |
|--- | --- | ---|
| 주 구성 | `~/.clawdbot/clawdbot.json` | 주 구성 파일 |
| 환경 변수 | `~/.clawdbot/.env` | 전역 환경 변수 |
| 작업 공간 환경 | `~/clawd/.env` | 작업 공간 환경 변수 |
| 인증 프로필 | `<agentDir>/auth-profiles.json` | 인증 프로필 |
| 런타임 캐시 | `<agentDir>/auth.json` | 내장 에이전트 런타임 캐시 |
| 레거시 OAuth | `~/.clawdbot/credentials/oauth.json` | 레거시 OAuth 가져오기 |
| Cron 저장소 | `~/.clawdbot/cron.json` | Cron 작업 저장소 |
| Hooks 경로 | `~/.clawdbot/hooks` | Hooks 디렉터리 |

---

## 이 강의 요약

이 튜토리얼은 Clawdbot의 완전한 구성 시스템을 자세히 설명합니다:

- ✅ 구성 파일 구조 및 유효성 검사 메커니즘
- ✅ 모든 핵심 구성 섹션(인증, 에이전트, 채널, 세션, 도구, Cron, Hooks 등)
- ✅ 환경 변수 대체 및 구성 우선 순위
- ✅ 일반적인 구성 예제 및 모범 사례
- ✅ 구성 파일 경로 및 저장 위치

## 다음 강의 미리보기

> 다음 강의에서는 **[Gateway WebSocket API 프로토콜](./api-protocol/)**을 학습합니다.
>
> 다음을 학습합니다:
> - WebSocket 연결 핸드셰이크 및 인증
> - 메시지 프레임 형식(요청, 응답, 이벤트)
> - 핵심 메서드 참조 및 호출 예제
> - 권한 시스템 및 역할 관리
> - 오류 처리 및 재시도 전략

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-27

| 구성 섹션 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 주 스키마 | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | 1-556 |
| 코어 스키마 | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300 |
| 에이전트 스키마 | [`src/config/zod-schema.agents.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agents.ts) | 1-54 |
| 채널 스키마 | [`src/config/zod-schema.channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.channels.ts) | 1-11 |
| 세션 스키마 | [`src/config/zod-schema.session.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.session.ts) | - |
| 도구 스키마 | [`src/config/zod-schema.agent-runtime.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.agent-runtime.ts) | - |
| Hooks 스키마 | [`src/config/zod-schema.hooks.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.hooks.ts) | - |
| 제공자 스키마 | [`src/config/zod-schema.providers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers.ts) | - |
| 구성 문서 | [`docs/gateway/configuration.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/gateway/configuration.md) | - |

**주요 상수**:
- 기본 포트: `18789`(`gateway.server-startup-log.ts`)
- 기본 작업 공간: `~/clawd`
- 기본 Gateway 바인딩: `loopback`(127.0.0.1)

**주요 함수**:
- `ClawdbotSchema`: 주 구성 스키마 정의
- `normalizeAllowFrom()`: 허용 목록 값 표준화
- `requireOpenAllowFrom()`: open 모드 허용 목록 유효성 검사
</details>
