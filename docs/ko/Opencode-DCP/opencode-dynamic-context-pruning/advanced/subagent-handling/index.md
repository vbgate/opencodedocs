---
title: "서브에이전트 처리: 자동 비활성화 메커니즘 | opencode-dynamic-context-pruning"
subtitle: "서브에이전트 처리: 자동 비활성화 메커니즘"
sidebarTitle: "서브에이전트는 가지치기 안 함? 이유는"
description: "DCP가 서브에이전트 세션에서의 동작과 제한 사항을 학습하세요. DCP가 서브에이전트 가지치기를 자동으로 비활성화하는 이유와 서브에이전트와 메인에이전트의 토큰 사용 전략의 차이점을 이해하세요."
tags:
  - "서브에이전트"
  - "세션 관리"
  - "사용 제한"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# 서브에이전트 처리

## 학습 완료 후 할 수 있는 것

- DCP가 서브에이전트 세션에서 자동으로 비활성화되는 이유 이해하기
- 서브에이전트와 메인에이전트의 토큰 사용 전략 차이점 알기
- 서브에이전트에서 DCP 기능 사용 시 발생할 수 있는 문제 예방하기

## 현재의 곤경

어떤 OpenCode 대화에서는 DCP의 가지치기 기능이 "작동하지 않는 것처럼" 보인다는 것을 눈치챘을 수 있습니다—도구 호출이 정리되지 않고, 토큰 절약 통계도 변하지 않습니다. 이는 코드 검토, 심층 분석 등 특정 OpenCode 기능을 사용할 때 발생할 수 있습니다.

이것은 DCP에 문제가 있는 것이 아니라, 이러한 기능들이 **서브에이전트(Subagent)** 메커니즘을 사용하며, DCP가 서브에이전트에 대해 특별한 처리를 하기 때문입니다.

## 서브에이전트란

::: info 서브에이전트(Subagent)란?

**서브에이전트**는 OpenCode의 내부 AI 에이전트 메커니즘입니다. 메인에이전트가 복잡한 작업을 서브에이전트에 위임하면, 서브에이전트는 작업을 완료한 후 요약 형태로 결과를 반환합니다.

**전형적인 사용 시나리오**:
- 코드 검토: 메인에이전트가 서브에이전트를 시작하고, 서브에이전트는 여러 파일을 자세히 읽어 문제를 분석한 후 간결한 문제 목록을 반환합니다
- 심층 분석: 메인에이전트가 서브에이전트를 시작하고, 서브에이전트는 많은 도구 호출과 추론을 수행한 후 핵심 발견 사항을 반환합니다

기술적으로, 서브에이전트 세션은 부모 세션을 가리키는 `parentID` 속성을 가지고 있습니다.
:::

## DCP의 서브에이전트 동작

DCP는 서브에이전트 세션에서 **모든 가지치기 기능을 자동으로 비활성화**합니다.

### DCP가 서브에이전트를 가지치지 않는 이유

이 뒤에는 중요한 설계 철학이 있습니다:

| 역할           | 토큰 사용 전략           | 핵심 목표                     |
| -------------- | ------------------------ | ----------------------------- |
| **메인에이전트** | 효율적인 토큰 사용 필요  | 장기 대화 컨텍스트 유지, 비용 절감 |
| **서브에이전트** | 토큰을 자유롭게 사용 가능 | 풍부한 정보 생성, 메인에이전트의 요약 용이 |

**서브에이전트의 가치**는 "토큰을 정보 품질과 교환"할 수 있다는 것입니다—많은 도구 호출과 상세한 분석을 통해 부모 에이전트에 고품질의 정보 요약을 제공합니다. DCP가 서브에이전트에서 도구 호출을 가지치면 다음과 같은 문제가 발생할 수 있습니다:

1. **정보 손실**: 서브에이전트의 상세한 분석 과정이 삭제되어 완전한 요약을 생성할 수 없음
2. **요약 품질 저하**: 메인에이전트가 받은 요약이 불완전하여 최종 결정에 영향을 미침
3. **설계 의도 위반**: 서브에이전트는 "토큰을 아끼지 않고 품질을 얻기 위해" 설계됨

**결론**: 서브에이전트는 최종적으로 부모 에이전트에 간결한 요약만 반환하므로 가지치기가 필요하지 않습니다.

### DCP가 서브에이전트를 감지하는 방법

DCP는 다음 단계를 통해 현재 세션이 서브에이전트인지 감지합니다:

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // parentID가 있으면 서브에이전트
    } catch (error: any) {
        return false
    }
}
```

**감지 시점**:
- 세션 초기화 시 (`ensureSessionInitialized()`)
- 각 메시지 변환 전 (`createChatMessageTransformHandler()`)

### 서브에이전트 세션에서 DCP의 동작

DCP는 서브에이전트를 감지한 후 다음 기능을 건너뜁니다:

| 기능               | 정상 세션 | 서브에이전트 세션 | 건너뛰기 위치 |
| -------------- | ------ | ---------- | -------- |
| 시스템 프롬프트 주입     | ✅ 실행  | ❌ 건너뛰기   | `hooks.ts:26-28` |
| 자동 가지치기 정책       | ✅ 실행  | ❌ 건너뛰기   | `hooks.ts:64-66` |
| 도구 목록 주입         | ✅ 실행  | ❌ 건너뛰기   | `hooks.ts:64-66` |

**코드 구현** (`lib/hooks.ts`):

```typescript
// 시스템 프롬프트 핸들러
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← 서브에이전트 감지
            return               // ← 바로 반환, 가지치기 도구 설명 주입 안 함
        }
        // ... 정상 로직
    }
}

// 메시지 변환 핸들러
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← 서브에이전트 감지
            return               // ← 바로 반환, 모든 가지치기 실행 안 함
        }

        // ... 정상 로직: 중복 제거, 덮어쓰기, 오류 지우기, 도구 목록 주입 등
    }
}
```

## 실제 사례 비교

### 사례 1: 메인에이전트 세션

**시나리오**: 메인에이전트와 대화하며 코드 분석을 요청함

**DCP 동작**:
```
사용자 입력: "src/utils.ts의 유틸리티 함수 분석"
    ↓
[메인에이전트] src/utils.ts 읽기
    ↓
[메인에이전트] 코드 분석
    ↓
사용자 입력: "src/helpers.ts도 확인해"
    ↓
DCP가 중복 읽기 패턴 감지
    ↓
DCP가 첫 번째 src/utils.ts 읽기를 가지치기 가능으로 표시 ✅
    ↓
컨텍스트가 LLM에 전송될 때 첫 번째 읽기 내용이 플레이스홀더로 대체됨
    ↓
✅ 토큰 절약
```

### 사례 2: 서브에이전트 세션

**시나리오**: 메인에이전트가 깊은 코드 검토를 위해 서브에이전트 시작

**DCP 동작**:
```
사용자 입력: "src/의 모든 파일 깊이 검토"
    ↓
[메인에이전트] 복잡한 작업 감지, 서브에이전트 시작
    ↓
[서브에이전트] src/utils.ts 읽기
    ↓
[서브에이전트] src/helpers.ts 읽기
    ↓
[서브에이전트] src/config.ts 읽기
    ↓
[서브에이전트] 더 많은 파일 읽기...
    ↓
DCP가 서브에이전트 세션 감지
    ↓
DCP가 모든 가지치기 작업 건너뜀 ❌
    ↓
[서브에이전트] 상세한 검토 결과 생성
    ↓
[서브에이전트] 메인에이전트에 간결한 요약 반환
    ↓
[메인에이전트] 요약을 바탕으로 최종 답변 생성
```

## 자주 묻는 질문

### Q: 현재 세션이 서브에이전트인지 어떻게 확인하나요?

**A**: 다음 방법으로 확인할 수 있습니다:

 1. **DCP 로그 확인** (debug 모드가 활성화된 경우):
   ```
   2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
   2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
   ```

 2. **대화 특징 관찰**:
    - 서브에이전트는 일반적으로 복잡한 작업을 처리할 때 시작됩니다 (예: 심층 분석, 코드 검토)
    - 메인에이전트가 "서브에이전트를 시작하는 중" 또는 유사한 메시지를 표시합니다

 3. **/dcp stats 명령 사용**:
    - 서브에이전트 세션에서 도구 호출은 가지치기되지 않습니다
    - 토큰 통계에서 "가지치기됨" 수량이 0입니다

### Q: 서브에이전트에서 전혀 가지치기를 하지 않으면 토큰이 낭비되지 않나요?

**A**: 그렇지 않습니다. 이유는 다음과 같습니다:

1. **서브에이전트는 수명이 짧습니다**: 서브에이전트는 작업을 완료한 후 종료되며, 메인에이전트처럼 장기간 대화를 유지하지 않습니다
2. **서브에이전트는 요약을 반환합니다**: 최종적으로 메인에이전트에 전달되는 것은 간결한 요약으로, 메인에이전트의 컨텍스트 부담을 증가시키지 않습니다
3. **설계 목표가 다릅니다**: 서브에이전트의 목적은 "토큰을 절약하는 것"이 아니라 "토큰으로 품질을 얻는 것"입니다

### Q: DCP가 서브에이전트에서 강제로 가지치기하도록 할 수 있나요?

**A**: **할 수 없으며, 그래서도 안 됩니다**. DCP의 설계는 서브에이전트가 고품질의 요약을 생성할 수 있도록 완전한 컨텍스트를 유지하도록 하는 것입니다. 강제로 가지치기를 하면 다음과 같은 문제가 발생할 수 있습니다:

- 요약 정보가 불완전해짐
- 메인에이전트의 의사 결정 품질에 영향을 미침
- OpenCode의 서브에이전트 설계 철학에 반함

### Q: 서브에이전트 세션의 토큰 사용량이 통계에 포함되나요?

**A**: 서브에이전트 세션 자체는 DCP 통계에 포함되지 않습니다. DCP의 통계는 메인에이전트 세션에서의 토큰 절약만 추적합니다.

## 본 강의 요약

- **서브에이전트 감지**: DCP는 `session.parentID`를 확인하여 서브에이전트 세션을 식별합니다
- **자동 비활성화**: 서브에이전트 세션에서 DCP는 자동으로 모든 가지치기 기능을 건너뜁니다
- **설계 이유**: 서브에이전트는 고품질의 요약을 생성하기 위해 완전한 컨텍스트가 필요하며, 가지치기는 이 과정을 방해합니다
- **사용 경계**: 서브에이전트는 토큰 효율성보다는 정보 품질을 추구하며, 이는 메인에이전트의 목표와 다릅니다

## 다음 강의 예고

> 다음 강의에서는 **[자주 묻는 질문 및 문제 해결](/ko/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)**을 학습합니다.
>
> 학습할 내용:
> - 구성 오류 수정 방법
> - 디버그 로그 활성화 방법
> - 토큰이 감소하지 않는 일반적인 원인
> - 서브에이전트 세션의 제한 사항

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능           | 파일 경로                                                                                                              | 행 번호    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ---------- |
| 서브에이전트 감지 함수 | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts)         | 1-8     |
| 세션 상태 초기화 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts)         | 80-116   |
| 시스템 프롬프트 핸들러 (서브에이전트 건너뛰기) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 26-28    |
| 메시지 변환 핸들러 (서브에이전트 건너뛰기) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 64-66    |
| SessionState 타입 정의 | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts)         | 27-38    |

**핵심 함수**:
- `isSubAgentSession()`: `session.parentID`를 통해 서브에이전트 감지
- `ensureSessionInitialized()`: 세션 상태 초기화 시 서브에이전트 감지
- `createSystemPromptHandler()`: 서브에이전트 세션에서 시스템 프롬프트 주입 건너뛰기
- `createChatMessageTransformHandler()`: 서브에이전트 세션에서 모든 가지치기 작업 건너뛰기

**핵심 상수**:
- `state.isSubAgent`: 세션 상태의 서브에이전트 플래그

</details>
