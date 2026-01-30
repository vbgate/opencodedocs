---
title: "상태 지속성: 세션 간 기록 유지 | opencode-dynamic-context-pruning"
subtitle: "상태 지속성: 세션 간 기록 유지"
sidebarTitle: "재시작 후 데이터 유지"
description: "opencode-dynamic-context-pruning의 상태 지속성 메커니즘을 학습합니다. 세션 간에 가지치기 기록을 유지하고, /dcp stats로 누적 Token 절감 효과를 확인합니다."
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# 상태 지속성: 세션 간 가지치기 기록 유지

## 학습 후 할 수 있는 것

- DCP가 OpenCode 재시작 간에 가지치기 상태를 유지하는 방법 이해
- 지속성 파일의 저장 위치와 내용 형식 확인
- 세션 전환 및 컨텍스트 압축 시 상태 관리 로직 숙지
- `/dcp stats`로 모든 세션의 누적 Token 절감 확인

## 현재 겪고 있는 문제

OpenCode를 닫았다가 다시 열었는데 이전 가지치기 기록이 사라졌나요? 또는 `/dcp stats`의 "모든 세션 누적 절감"이 어디서 오는지 궁금하신가요?

DCP의 상태 지속성 메커니즘은 백그라운드에서 자동으로 가지치기 기록과 통계 데이터를 저장하여 재시작 후에도 볼 수 있도록 합니다.

## 언제 이 기능을 사용해야 하나요

- 세션 간에 Token 절감 통계 누적 필요
- OpenCode 재시작 후 가지치기 기록 계속
- DCP를 장기적으로 사용하여 전체 효과 확인

## 핵심 개념

**상태 지속성이란 무엇인가**

**상태 지속성**은 DCP가 가지치기 기록과 통계 데이터를 디스크 파일에 저장하여 OpenCode 재시작이나 세션 전환 후에도 이 정보가 손실되지 않도록 하는 것입니다.

::: info 왜 지속성이 필요한가요?

지속성이 없으면 OpenCode를 닫을 때마다:
- 가지치기된 도구 ID 목록이 손실됩니다
- Token 절감 통계가 초기화됩니다
- AI가 동일한 도구를 반복해서 가지치기할 수 있습니다

지속성을 통해 DCP는 다음을 수행할 수 있습니다:
- 어떤 도구가 이미 가지치기되었는지 기억
- 모든 세션의 Token 절감 누적
- 재시작 후 이전 작업 계속
:::

**지속성 콘텐츠의 두 가지 주요 부분**

DCP가 저장하는 상태는 두 가지 유형의 정보를 포함합니다:

| 유형 | 내용 | 용도 |
|--- | --- | ---|
| **가지치기 상태** | 가지치기된 도구의 ID 목록 | 반복 가지치기 방지, 세션 간 추적 |
| **통계 데이터** | Token 절감 수량(현재 세션 + 누적 기록) | DCP 효과 표시, 장기 추세 분석 |

이 데이터는 OpenCode 세션 ID별로 저장되며, 각 세션은 하나의 JSON 파일에 해당합니다.

## 데이터 흐름

```mermaid
graph TD
    subgraph "가지치기 작업"
        A1[AI가 discard/extract 호출]
        A2[사용자가 /dcp sweep 실행]
    end

    subgraph "메모리 상태"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "지속성 저장소"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|비동기 저장| C1
    B2 -->|비동기 저장| C1
    C1 --> C2

    C2 -->|세션 전환 시 로드| B1
    C2 -->|세션 전환 시 로드| B2

    D[OpenCode summary 메시지] -->|캐시 비우기| B1
```

## 따라해 보세요

### 1단계: 지속성 저장 위치 이해

**이유**
데이터가 어디에 저장되는지 알면 수동으로 확인하거나 삭제할 수 있습니다(필요한 경우)

DCP는 상태를 로컬 파일 시스템에 저장하며, 클라우드에 업로드하지 않습니다.

```bash
# 지속성 디렉토리 위치
~/.local/share/opencode/storage/plugin/dcp/

# 각 세션마다 하나의 JSON 파일, 형식: {sessionId}.json
```

**확인해야 할 것**: 디렉토리에 여러 `.json` 파일이 있을 수 있으며, 각각은 하나의 OpenCode 세션에 해당합니다

::: tip 데이터 프라이버시

DCP는 로컬에서만 가지치기 상태와 통계 데이터를 저장하며, 민감한 정보는 포함하지 않습니다. 지속성 파일에는 다음이 포함됩니다:
- 도구 ID 목록(숫자 식별자)
- Token 절감 수량(통계 데이터)
- 마지막 업데이트 시간(타임스탬프)

대화 내용, 도구 출력 또는 사용자 입력은 포함되지 않습니다.
:::

### 2단계: 지속성 파일 형식 확인

**이유**
파일 구조를 이해하면 수동으로 확인하거나 문제를 디버깅할 수 있습니다

```bash
# 모든 지속성 파일 나열
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# 특정 세션의 지속성 내용 확인
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**확인해야 할 것**: 다음과 유사한 JSON 구조

```json
{
  "sessionName": "내 세션 이름",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**필드 설명**:

| 필드 | 유형 | 의미 |
|--- | --- | ---|
| `sessionName` | string (선택) | 세션 이름, 식별 용이 |
| `prune.toolIds` | string[] | 가지치기된 도구의 ID 목록 |
| `stats.pruneTokenCounter` | number | 현재 세션에서 절감된 Token 수(아카이브되지 않음) |
| `stats.totalPruneTokens` | number | 누적 기록 절감 Token 수 |
| `lastUpdated` | string | ISO 8601 형식의 마지막 업데이트 시간 |

### 3단계: 누적 통계 확인

**이유**
모든 세션의 누적 효과를 이해하여 DCP의 장기적 가치 평가

```bash
# OpenCode에서 실행
/dcp stats
```

**확인해야 할 것**: 통계 정보 패널

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
───────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
───────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**통계 데이터 의미**:

| 통계 항목 | 출처 | 설명 |
|--- | --- | ---|
| **Session** | 현재 메모리 상태 | 현재 세션의 가지치기 효과 |
| **All-time** | 모든 지속성 파일 | 모든 기록 세션의 누적 효과 |

::: info All-time 통계 계산 방법

DCP는 `~/.local/share/opencode/storage/plugin/dcp/` 디렉토리의 모든 JSON 파일을 순회하며 다음을 누적합니다:
- `totalPruneTokens`: 모든 세션에서 절감된 Token 총수
- `toolIds.length`: 모든 세션에서 가지치기된 도구 총수
- 파일 수량: 세션 총수

이렇게 하면 장기 사용 시 DCP의 전체 효과를 볼 수 있습니다.
:::

### 4단계: 자동 저장 메커니즘 이해

**이유**
DCP가 언제 상태를 저장하는지 알면 실수로 데이터를 손실하지 않도록 방지

DCP는 다음 시점에 자동으로 상태를 디스크에 저장합니다:

| 트리거 시점 | 저장 내용 | 호출 위치 |
|--- | --- | ---|
| AI가 `discard`/`extract` 도구 호출 후 | 업데이트된 가지치기 상태 + 통계 | `lib/strategies/tools.ts:148-150` |
| 사용자가 `/dcp sweep` 명령 실행 후 | 업데이트된 가지치기 상태 + 통계 | `lib/commands/sweep.ts:234-236` |
| 가지치기 작업 완료 후 | 비동기 저장, 메인 흐름 차단 안 함 | `saveSessionState()` |

**저장 흐름**:

```typescript
// 1. 메모리 상태 업데이트
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. 비동기로 디스크에 저장
await saveSessionState(state, logger)
```

::: tip 비동기 저장의 이점

DCP는 비동기 저장 메커니즘을 사용하여 가지치기 작업이 디스크 I/O로 차단되지 않도록 합니다. 저장이 실패하더라도(예: 디스크 공간 부족), 현재 세션의 가지치기 효과에는 영향을 주지 않습니다.

실패 시 `~/.config/opencode/logs/dcp/`에 경고 로그를 기록합니다.
:::

### 5단계: 자동 로드 메커니즘 이해

**이유**
DCP가 언제 지속성 상태를 로드하는지 알면 세션 전환 동작 이해

DCP는 다음 시점에 자동으로 지속성 상태를 로드합니다:

| 트리거 시점 | 로드 내용 | 호출 위치 |
|--- | --- | ---|
| OpenCode 시작 또는 세션 전환 시 | 해당 세션의 기록 가지치기 상태 + 통계 | `lib/state/state.ts:104`(`ensureSessionInitialized` 함수 내부) |

**로드 흐름**:

```typescript
// 1. 세션 ID 변경 감지
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. 메모리 상태 재설정
resetSessionState(state)
state.sessionId = lastSessionId

// 3. 디스크에서 지속성 상태 로드
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**확인해야 할 것**: 이전 세션으로 전환하면 `/dcp stats`에 표시되는 기록 통계 데이터가 그대로 유지됩니다

### 6단계: 컨텍스트 압축 시 상태 정리 이해

**이유**
OpenCode가 자동으로 컨텍스트를 압축할 때 DCP가 상태를 처리하는 방법 이해

OpenCode가 대화가 너무 길다고 감지하면 자동으로 summary 메시지를 생성하여 컨텍스트를 압축합니다. DCP는 이러한 압축을 감지하고 관련 상태를 정리합니다.

```typescript
// summary 메시지 감지 시 처리
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // 도구 캐시 비우기
    state.prune.toolIds = []       // 가지치기 상태 비우기
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info 왜 비워야 하나요?

OpenCode의 summary 메시지는 전체 대화 기록을 압축하며, 이때:
- 오래된 도구 호출이 이미 summary에 병합됨
- 도구 ID 목록 유지가 무의미함(도구가 더 이상 존재하지 않음)
- 상태 비우기로 유효하지 않은 도구 ID 참조 방지

이는 설계상의 절충: 일부 가지치기 기록을 희생하여 상태 일관성 보장
:::

## 체크포인트 ✅

다음 핵심 사항을 이해했는지 확인하세요:

- [ ] DCP의 지속성 파일은 `~/.local/share/opencode/storage/plugin/dcp/`에 저장됩니다
- [ ] 각 세션은 하나의 `{sessionId}.json` 파일에 해당합니다
- [ ] 지속성 내용은 가지치기 상태(toolIds)와 통계 데이터(totalPruneTokens)를 포함합니다
- [ ] `/dcp stats`의 "All-time" 통계는 모든 지속성 파일의 누적에서 옵니다
- [ ] 가지치기 작업 후 자동으로 비동기 저장하며, 메인 흐름을 차단하지 않습니다
- [ ] 세션 전환 시 해당 세션의 기록 상태를 자동으로 로드합니다
- [ ] OpenCode summary 메시지 감지 시 도구 캐시와 가지치기 상태를 비웁니다

## 주의사항

### ❌ 지속성 파일 실수로 삭제

**문제**: `~/.local/share/opencode/storage/plugin/dcp/` 디렉토리의 파일을 수동으로 삭제

**영향**:
- 기록 가지치기 상태 손실
- 누적 통계 초기화
- 하지만 현재 세션의 가지치기 기능에는 영향 없음

**해결**: 다시 시작하면 DCP가 자동으로 새 지속성 파일을 생성합니다

### ❌ 하위 에이전트 상태 표시 안 됨

**문제**: 하위 에이전트에서 도구를 가지치기했지만, 메인 에이전트로 돌아오면 이러한 가지치기 기록이 보이지 않음

**원인**: 하위 에이전트는 독립적인 `sessionId`를 가지며, 가지치기 상태는 별도의 파일에 지속됩니다. 하지만 메인 에이전트로 전환할 때 메인 에이전트의 `sessionId`가 다르므로 하위 에이전트의 지속성 상태를 로드하지 않습니다

**해결**: 이는 설계 동작입니다. 하위 에이전트 세션의 상태는 독립적이며 메인 에이전트와 공유되지 않습니다. 모든 가지치기 기록(하위 에이전트 포함)을 통계하려면 `/dcp stats`의 "All-time" 통계를 사용하세요(모든 지속성 파일의 데이터를 누적함)

### ❌ 디스크 공간 부족으로 저장 실패

**문제**: `/dcp stats`에 표시되는 "All-time" 통계가 증가하지 않음

**원인**: 디스크 공간 부족으로 저장 실패일 수 있음

**해결**: 로그 파일 `~/.config/opencode/logs/dcp/`를 확인하여 "Failed to save session state" 오류가 있는지 확인하세요

## 이번 수업 요약

**상태 지속성의 핵심 가치**:

1. **세션 간 기억**: 어떤 도구가 이미 가지치기되었는지 기억하여 반복 작업 방지
2. **누적 통계**: DCP의 Token 절감 효과를 장기적으로 추적
3. **재시작 복구**: OpenCode 재시작 후 이전 작업 계속

**데이터 흐름 요약**:

```
가지치기 작업 → 메모리 상태 업데이트 → 비동기 디스크 저장
                ↑
세션 전환 → 디스크에서 로드 → 메모리 상태 복구
                ↑
컨텍스트 압축 → 메모리 상태 비우기(디스크 파일 삭제 안 함)
```

**핵심 사항**:

- 지속성은 로컬 파일 작업이며 가지치기 성능에 영향 없음
- `/dcp stats`의 "All-time"은 모든 기록 세션의 누적에서 옵니다
- 하위 에이전트 세션은 지속되지 않으며, 이는 설계 동작입니다
- 컨텍스트 압축 시 캐시를 비워 상태 일관성 보장

## 다음 수업 예고

> 다음 수업에서는 **[Prompt 캐싱 영향](/ko/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - DCP 가지치기가 Prompt Caching에 어떤 영향을 미치는지
> - 캐시 적중률과 Token 절감 간의 절충 방법
> - Anthropic의 캐시 과금 메커니즘 이해

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 지속성 인터페이스 정의 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| 세션 상태 저장 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| 세션 상태 로드 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| 모든 세션 통계 로드 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| 저장 디렉토리 상수 | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| 세션 상태 초기화 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| 컨텍스트 압축 감지 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| 통계 명령 처리 | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| 가지치기 도구 상태 저장 | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**핵심 상수**:
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`：지속성 파일 저장 루트 디렉토리

**핵심 함수**:
- `saveSessionState(state, logger)`：세션 상태를 비동기로 디스크에 저장
- `loadSessionState(sessionId, logger)`：디스크에서 지정된 세션의 상태 로드
- `loadAllSessionStats(logger)`：모든 세션의 통계 데이터 집계
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`：세션이 초기화되었는지 확인하며 지속성 상태 로드

**핵심 인터페이스**:
- `PersistedSessionState`：지속성 상태의 구조 정의
- `AggregatedStats`：누적 통계 데이터의 구조 정의

</details>
