---
title: "API 참조: 플러그인 인터페이스 문서 | opencode-dynamic-context-pruning"
sidebarTitle: "플러그인 API 참조"
subtitle: "DCP API 참조"
description: "OpenCode DCP 플러그인의 전체 API 참조 문서를 학습하세요. 플러그인 진입점 함수, 구성 인터페이스, 도구 정의, 훅 핸들러 및 세션 상태 관리 인터페이스의 상세 설명을 포함합니다."
tags:
  - "API"
  - "플러그인 개발"
  - "인터페이스 참조"
prerequisite:
  - "start-configuration"
order: 3
---

# DCP API 참조

## 학습 후 할 수 있는 것

이 섹션은 플러그인 개발자를 위해 DCP의 전체 API 참조를 제공하며, 다음을 수행할 수 있습니다:

- DCP의 플러그인 진입점과 훅 메커니즘 이해
- 구성 인터페이스와 모든 구성 항목의 역할 숙지
- discard 및 extract 도구의 사양 이해
- 상태 관리 API를 사용하여 세션 상태 조작

## 핵심 개념

DCP 플러그인은 OpenCode Plugin SDK를 기반으로 하며, 훅, 도구 및 명령을 등록하여 컨텍스트 가지치기 기능을 구현합니다.

**플러그인 수명 주기**:

```
1. OpenCode가 플러그인 로드
    ↓
2. Plugin 함수 실행
    ↓
3. 훅, 도구, 명령 등록
    ↓
4. OpenCode가 메시지 처리를 위해 훅 호출
    ↓
5. 플러그인이 가지치기 로직 실행
    ↓
6. 수정된 메시지 반환
```

---

## 플러그인 진입점 API

### Plugin 함수

DCP의 메인 진입점 함수로, 플러그인 구성 객체를 반환합니다.

**시그니처**:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // 플러그인 초기화 로직
    return {
        // 등록된 훅, 도구, 명령
    }) satisfies Plugin

export default plugin
```

**매개변수**:

| 매개변수명 | 타입 | 설명 |
|--- | --- | ---|
| ctx | `PluginInput` | OpenCode 플러그인 컨텍스트, client 및 directory 등의 정보 포함 |

**반환값**:

플러그인 구성 객체로, 다음 필드를 포함합니다:

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `experimental.chat.system.transform` | `Handler` | 시스템 프롬프트 주입 훅 |
| `experimental.chat.messages.transform` | `Handler` | 메시지 변환 훅 |
| `chat.message` | `Handler` | 메시지 캡처 훅 |
| `command.execute.before` | `Handler` | 명령 실행 훅 |
| `tool` | `Record<string, Tool>` | 등록된 도구 매핑 |
| `config` | `ConfigHandler` | 구성 변이 훅 |

**소스 코드 위치**: [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## 구성 API

### PluginConfig 인터페이스

DCP의 전체 구성 타입 정의입니다.

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**소스 코드 위치**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### 구성 항목 상세 설명

#### 최상위 구성

| 구성 항목 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 플러그인 활성화 여부 |
| `debug` | `boolean` | `false` | 디버그 로그 활성화 여부, 로그는 `~/.config/opencode/logs/dcp/`에 기록 |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | 알림 표시 모드 |
| `protectedFilePatterns` | `string[]` | `[]` | 파일 보호 glob 패턴 목록, 일치하는 파일은 가지치기되지 않음 |

#### Commands 구성

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | `/dcp` 명령 활성화 여부 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 명령 보호 도구 목록, 이 도구들은 `/dcp sweep`로 가지치기되지 않음 |

#### TurnProtection 구성

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | 턴 보호 활성화 여부 |
| `turns` | `number` | `4` | 보호 턴 수, 최근 N 턴의 도구는 가지치기되지 않음 |

#### Tools 구성

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolToolSettings**:

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `nudgeEnabled` | `boolean` | `true` | AI 알림 활성화 여부 |
| `nudgeFrequency` | `number` | `10` | 알림 빈도, N개의 도구 결과마다 AI에 가지치기 도구 사용을 알림 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 도구 보호 목록 |

**DiscardTool**:

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | | ---|
| `enabled` | `boolean` | `true` | discard 도구 활성화 여부 |

**ExtractTool**:

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | extract 도구 활성화 여부 |
| `showDistillation` | `boolean` | `false` | 알림에 추출 내용 표시 여부 |

#### Strategies 구성

**Deduplication**:

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 중복 제거 전략 활성화 여부 |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 중복 제거에 참여하지 않는 도구 목록 |

**SupersedeWrites**:

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | 덮어쓰기 전략 활성화 여부 |

**PurgeErrors**:

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| 필드 | 타입 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | 오류 정리 전략 활성화 여부 |
| `turns` | `number` | `4` | 오류 정리 임계값(턴 수) |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | 정리에 참여하지 않는 도구 목록 |

### getConfig 함수

다중 레벨 구성을 로드하고 병합합니다.

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**매개변수**:

| 매개변수명 | 타입 | 설명 |
|--- | --- | ---|
| ctx | `PluginInput` | OpenCode 플러그인 컨텍스트 |

**반환값**:

병합된 구성 객체로, 우선순위는 높은 순서대로 다음과 같습니다:

1. 프로젝트 구성 (`.opencode/dcp.jsonc`)
2. 환경 변수 구성 (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. 전역 구성 (`~/.config/opencode/dcp.jsonc`)
4. 기본 구성(코드에 정의됨)

**소스 코드 위치**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## 도구 API

### createDiscardTool

discard 도구를 생성하여 완료된 작업이나 노이즈 도구 출력을 제거합니다.

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**매개변수**:

| 매개변수명 | 타입 | 설명 |
|--- | --- | ---|
| ctx | `PruneToolContext` | 도구 컨텍스트, client, state, logger, config, workingDirectory 포함 |

**도구 사양**:

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `ids` | `string[]` | 첫 번째 요소는 원인(`'completion'` 또는 `'noise'`), 이후는 숫자 ID |

**소스 코드 위치**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

extract 도구를 생성하여 핵심 발견 사항을 추출한 후 원본 도구 출력을 삭제합니다.

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**매개변수**:

| 매개변수명 | 타입 | 설명 |
|--- | --- | ---|
| ctx | `PruneToolContext` | 도구 컨텍스트, client, state, logger, config, workingDirectory 포함 |

**도구 사양**:

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `ids` | `string[]` | 숫자 ID 배열 |
| `distillation` | `string[]` | 추출 내용 배열, id와 길이가 일치 |

**소스 코드 위치**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## 상태 API

### SessionState 인터페이스

세션 상태 객체로, 단일 세션의 런타임 상태를 관리합니다.

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**필드 설명**:

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `sessionId` | `string \| null` | OpenCode 세션 ID |
| `isSubAgent` | `boolean` | 하위 에이전트 세션 여부 |
| `prune` | `Prune` | 가지치기 상태 |
| `stats` | `SessionStats` | 통계 데이터 |
| `toolParameters` | `Map<string, ToolParameterEntry>` | 도구 호출 캐시(callID → 메타데이터) |
| `nudgeCounter` | `number` | 누적 도구 호출 횟수(알림 트리거용) |
| `lastToolPrune` | `boolean` | 마지막 작업이 가지치기 도구였는지 여부 |
| `lastCompaction` | `number` | 마지막 컨텍스트 압축 타임스탬프 |
| `currentTurn` | `number` | 현재 턴 수 |
| `variant` | `string \| undefined` | 모델 변형(예: claude-3.5-sonnet) |

**소스 코드 위치**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### SessionStats 인터페이스

세션 수준의 Token 가지치기 통계입니다.

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**필드 설명**:

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `pruneTokenCounter` | `number` | 현재 세션에서 가지치기된 Token 수(누적) |
| `totalPruneTokens` | `number` | 역사 누적 가지치기된 Token 수 |

**소스 코드 위치**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Prune 인터페이스

가지치기 상태 객체입니다.

```typescript
export interface Prune {
    toolIds: string[]
}
```

**필드 설명**:

| 필드 | 타입 | 설명 |
|| --- | --- | ---|
| `toolIds` | `string[]` | 가지치기로 표시된 도구 호출 ID 목록 |

**소스 코드 위치**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### ToolParameterEntry 인터페이스

단일 도구 호출의 메타데이터 캐시입니다.

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**필드 설명**:

| 필드 | 타입 | 설명 |
|--- | --- | ---|
| `tool` | `string` | 도구 이름 |
| `parameters` | `any` | 도구 매개변수 |
| `status` | `ToolStatus \| undefined` | 도구 실행 상태 |
| `error` | `string \| undefined` | 오류 메시지(있는 경우) |
| `turn` | `number` | 이 호출을 생성한 턴 수 |

**ToolStatus 열거형**:

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**소스 코드 위치**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

새 세션 상태 객체를 생성합니다.

```typescript
export function createSessionState(): SessionState
```

**반환값**: 초기화된 SessionState 객체

---

## 훅 API

### createSystemPromptHandler

시스템 프롬프트 주입 훅 핸들러를 생성합니다.

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**매개변수**:

| 매개변수명 | 타입 | 설명 |
|--- | --- | ---|
| state | `SessionState` | 세션 상태 객체 |
| logger | `Logger` | 로그 시스템 인스턴스 |
| config | `PluginConfig` | 구성 객체 |

**동작**:

- 하위 에이전트 세션인지 확인하고, 그렇다면 건너뜀
- 내부 에이전트(예: 요약 생성기)인지 확인하고, 그렇다면 건너뜀
- 구성에 따라 해당 프롬프트 템플릿 로드(both/discard/extract)
- 시스템 프롬프트에 가지치기 도구 설명 주입

**소스 코드 위치**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

메시지 변환 훅 핸들러를 생성하여 자동 가지치기 로직을 실행합니다.

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**매개변수**:

| 매개변수명 | 타입 | 설명 |
|--- | --- | ---|
| client | `any` | OpenCode 클라이언트 인스턴스 |
| state | `SessionState` | 세션 상태 객체 |
| logger | `Logger` | 로그 시스템 인스턴스 |
| config | `PluginConfig` | 구성 객체 |

**처리 흐름**:

1. 세션 상태 확인(하위 에이전트 여부)
2. 도구 캐시 동기화
3. 자동 전략 실행(중복 제거, 덮어쓰기, 오류 정리)
4. 표시된 도구 내용 가지치기
5. `<prunable-tools>` 목록 주입
6. 컨텍스트 스냅샷 저장(구성된 경우)

**소스 코드 위치**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

명령 실행 훅 핸들러를 생성하여 `/dcp` 시리즈 명령을 처리합니다.

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**매개변수**:

| 매개변수명 | 타입 | 설명 |
|--- | --- | ---|
| client | `any` | OpenCode 클라이언트 인스턴스 |
| state | `SessionState` | 세션 상태 객체 |
| logger | `Logger` | 로그 시스템 인스턴스 |
| config | `PluginConfig` | 구성 객체 |
| workingDirectory | `string` | 작업 디렉토리 경로 |

**지원하는 명령**:

- `/dcp` - 도움말 정보 표시
- `/dcp context` - 현재 세션 Token 사용 분석 표시
- `/dcp stats` - 누적 가지치기 통계 표시
- `/dcp sweep [n]` - 수동 도구 가지치기(선택적 수량 지정)

**소스 코드 위치**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## 이 수업 요약

이 섹션은 DCP 플러그인의 전체 API 참조를 제공하며, 다음을 포함합니다:

- 플러그인 진입점 함수와 훅 등록 메커니즘
- 구성 인터페이스와 모든 구성 항목의 상세 설명
- discard 및 extract 도구의 사양과 생성 방법
- 세션 상태, 통계 데이터 및 도구 캐시의 타입 정의
- 시스템 프롬프트, 메시지 변환 및 명령 실행 훅 핸들러

DCP의 내부 구현 세부 사항을 더 깊이 이해하려면 [아키텍처 개요](/ko/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/)와 [Token 계산 원리](/ko/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/)를 읽는 것을 권장합니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능        | 파일 경로                                                                                    | 행 번호    |
|--- | --- | ---|
| 플러그인 진입점 함수 | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)         | 12-102   |
| 구성 인터페이스 정의 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66   |
| getConfig 함수 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797   |
| discard 도구 생성 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181   |
| extract 도구 생성 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220   |
| 상태 타입 정의 | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39   |
| 시스템 프롬프트 훅 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53   |
| 메시지 변환 훅 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#LL55-L82) | 55-82   |
| 명령 실행 훅 | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156   |

**핵심 타입**:
- `Plugin`: OpenCode 플러그인 함수 시그니처
- `PluginConfig`: DCP 구성 인터페이스
- `SessionState`: 세션 상태 인터페이스
- `ToolStatus`: 도구 상태 열거형(pending | running | completed | error)

**핵심 함수**:
- `plugin()`: 플러그인 진입점 함수
- `getConfig()`: 구성 로드 및 병합
- `createDiscardTool()`: discard 도구 생성
- `createExtractTool()`: extract 도구 생성
- `createSessionState()`: 세션 상태 생성

</details>
