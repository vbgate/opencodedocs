---
title: "세션 복구: 도구 중단 자동 복구 | Antigravity"
sidebarTitle: "도구 중단 자동 복구"
subtitle: "세션 복구: 도구 호출 실패 및 중단 자동 처리"
description: "세션 복구 메커니즘을 학습하여 도구 중단 및 오류를 자동으로 처리합니다. 오류 감지, synthetic tool_result 주입 및 auto_resume 구성을 다룹니다."
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# 세션 복구: 도구 호출 실패 및 중단 자동 처리

## 학습 후 할 수 있는 것

- 세션 복구 메커니즘이 도구 실행 중단을 자동으로 처리하는 방법 이해
- session_recovery 및 auto_resume 옵션 구성
- tool_result_missing 및 thinking_block_order 오류 문제 해결
- synthetic tool_result의 작동 원리 이해

## 현재의 어려움

OpenCode를 사용할 때 다음과 같은 중단 시나리오를 경험할 수 있습니다:

- 도구 실행 중 ESC 키를 눌러 중단하면 세션이 멈추고 수동으로 재시도해야 함
- 사고 블록 순서 오류(thinking_block_order), AI가 계속 생성할 수 없음
- 비사고 모델에서 사고 기능 잘못 사용(thinking_disabled_violation)
- 손상된 세션 상태를 수동으로 복구해야 해서 시간 낭비

## 이 기술을 사용하는 시기

세션 복구는 다음 시나리오에 적합합니다:

| 시나리오 | 오류 유형 | 복구 방식 |
|---|---|---|
| ESC 키로 도구 중단 | `tool_result_missing` | synthetic tool_result 자동 주입 |
| 사고 블록 순서 오류 | `thinking_block_order` | 빈 사고 블록 자동 미리 배치 |
| 비사고 모델에서 사고 사용 | `thinking_disabled_violation` | 모든 사고 블록 자동 제거 |
| 위 모든 오류 | 일반 | 자동 복구 + 자동 continue(활성화된 경우) |

::: warning 사전 확인
본 튜토리얼을 시작하기 전에 다음이 완료되었는지 확인하세요:
- ✅ opencode-antigravity-auth 플러그인이 설치되어 있음
- ✅ Antigravity 모델을 사용하여 요청을 보낼 수 있음
- ✅ 도구 호출의 기본 개념을 이해함

[빠른 설치 튜토리얼](../../start/quick-install/) | [첫 요청 튜토리얼](../../start/first-request/)
:::

## 핵심 개념

세션 복구의 핵심 메커니즘:

1. **오류 감지**: 세 가지 복구 가능한 오류 유형 자동 식별
   - `tool_result_missing`: 도구 실행 시 결과 누락
   - `thinking_block_order`: 사고 블록 순서 오류
   - `thinking_disabled_violation`: 비사고 모델에서 사고 금지

2. **자동 복구**: 오류 유형에 따라 synthetic 메시지 주입
   - synthetic tool_result 주입(내용: "Operation cancelled by user (ESC pressed)")
   - 빈 사고 블록 미리 배치(사고 블록은 메시지 시작에 있어야 함)
   - 모든 사고 블록 제거(비사고 모델에서 사고 허용 안 됨)

3. **자동 계속**: `auto_resume`을 활성화하면 자동으로 continue 메시지를 보내어 대화 복구

4. **중복 제거**: `Set`을 사용하여 동일한 오류가 반복적으로 처리되지 않도록 방지

::: info synthetic 메시지란 무엇인가요?
Synthetic 메시지는 플러그인이 손상된 세션 상태를 복구하기 위해 주입하는 "가상" 메시지입니다. 예를 들어, 도구가 중단되면 플러그인은 AI에게 "이 도구는 취소되었습니다"라고 알려주는 synthetic tool_result를 주입하여 AI가 새로운 응답을 생성할 수 있도록 합니다.
:::

## 실습하기

### 1단계: 세션 복구 활성화(기본적으로 활성화됨)

**이유**
세션 복구는 기본적으로 활성화되어 있지만, 이전에 수동으로 비활성화한 경우 다시 활성화해야 합니다.

**작업**

플러그인 구성 파일을 편집하세요:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

다음 구성을 확인하세요:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**확인해야 할 사항**:

1. `session_recovery`가 `true`임(기본값)
2. `auto_resume`가 `false`임(수동 continue 권장, 오작동 방지)
3. `quiet_mode`가 `false`임(toast 알림 표시, 복구 상태 파악에 용이)

::: tip 구성 항목 설명
- `session_recovery`: 세션 복구 기능 활성화/비활성화
- `auto_resume`: 자동 "continue" 메시지 전송(주의, AI가 예상치 못하게 도구를 실행할 수 있음)
- `quiet_mode`: toast 알림 숨기기(디버깅 시 일시적으로 비활성화 가능)
:::

### 2단계: tool_result_missing 복구 테스트

**이유**
도구 실행이 중단될 때 세션 복구 메커니즘이 정상적으로 작동하는지 확인합니다.

**작업**

1. OpenCode를 열고 도구 호출을 지원하는 모델을 선택합니다(예: `google/antigravity-claude-sonnet-4-5`)
2. 도구를 호출해야 하는 작업을 입력합니다(예: "현재 디렉토리의 파일을 보여줘")
3. 도구 실행 중 `ESC`를 눌러 중단합니다

**확인해야 할 사항**:

1. OpenCode가 즉시 도구 실행을 중지함
2. toast 알림 표시: "Tool Crash Recovery - Injecting cancelled tool results..."
3. AI가 자동으로 계속 생성하고 더 이상 도구 결과를 기다리지 않음

::: info tool_result_missing 오류 원리
ESC를 누르면 OpenCode는 도구 실행을 중단하지만, 세션에는 `tool_use`가 있고 대응하는 `tool_result`가 없습니다. Antigravity API는 이러한 불일치를 감지하여 `tool_result_missing` 오류를 반환합니다. 플러그인은 이 오류를 캡처하고 synthetic tool_result를 주입하여 세션을 일관된 상태로 복구합니다.
:::

### 3단계: thinking_block_order 복구 테스트

**이유**
사고 블록 순서가 잘못되었을 때 세션 복구 메커니즘이 자동으로 복구할 수 있는지 확인합니다.

**작업**

1. OpenCode를 열고 사고를 지원하는 모델을 선택합니다(예: `google/antigravity-claude-opus-4-5-thinking`)
2. 깊이 있는 사고가 필요한 작업을 입력합니다
3. "Expected thinking but found text" 또는 "First block must be thinking" 오류가 발생하면

**확인해야 할 사항**:

1. toast 알림 표시: "Thinking Block Recovery - Fixing message structure..."
2. 세션이 자동으로 복구되고 AI가 계속 생성할 수 있음

::: tip thinking_block_order 오류 원인
이 오류는 일반적으로 다음 원인으로 인해 발생합니다:
- 사고 블록이 의도치 않게 제거됨(예: 다른 도구를 통해)
- 세션 상태가 손상됨(예: 디스크 쓰기 실패)
- 교차 모델 마이그레이션 시 형식이 호환되지 않음
:::

### 4단계: thinking_disabled_violation 복구 테스트

**이유**
비사고 모델에서 사고 기능을 잘못 사용했을 때 세션 복구가 자동으로 사고 블록을 제거할 수 있는지 확인합니다.

**작업**

1. OpenCode를 열고 사고를 지원하지 않는 모델을 선택합니다(예: `google/antigravity-claude-sonnet-4-5`)
2. 히스토리 메시지에 사고 블록이 포함된 경우

**확인해야 할 사항**:

1. toast 알림 표시: "Thinking Strip Recovery - Stripping thinking blocks..."
2. 모든 사고 블록이 자동으로 제거됨
3. AI가 계속 생성할 수 있음

::: warning 사고 블록 손실
사고 블록을 제거하면 AI의 사고 내용이 손실되어 응답 품질에 영향을 줄 수 있습니다. 사고 모델에서 사고 기능을 사용하는지 확인하세요.
:::

### 5단계: auto_resume 구성(선택사항)

**이유**
auto_resume을 활성화하면 세션 복구가 완료된 후 자동으로 "continue"를 보내어 수동 작업이 필요 없습니다.

**작업**

`antigravity.json`에서 다음을 설정하세요:

```json
{
  "auto_resume": true
}
```

파일을 저장하고 OpenCode를 다시 시작하세요.

**확인해야 할 사항**:

1. 세션 복구가 완료된 후 AI가 자동으로 계속 생성함
2. 수동으로 "continue"를 입력할 필요가 없음

::: danger auto_resume 위험
자동 continue는 AI가 의도치 않게 도구 호출을 실행할 수 있습니다. 도구 호출의 보안에 의문이 있는 경우 `auto_resume: false`를 유지하고 복구 시점을 수동으로 제어하는 것이 좋습니다.
:::

## 체크포인트 ✅

위 단계를 완료한 후 다음을 수행할 수 있어야 합니다:

- [ ] `antigravity.json`에서 session_recovery 구성 확인
- [ ] ESC로 도구를 중단할 때 "Tool Crash Recovery" 알림 확인
- [ ] 세션이 자동으로 복구되고 수동 재시도가 필요 없음
- [ ] synthetic tool_result의 작동 원리 이해
- [ ] auto_resume를 활성화/비활성화할 시기 알기

## 함정 주의

### 세션 복구가 트리거되지 않음

**증상**: 오류가 발생했지만 자동 복구되지 않음

**원인**: `session_recovery`가 비활성화되었거나 오류 유형이 일치하지 않음

**해결책**:

1. `session_recovery: true`인지 확인:

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. 오류 유형이 복구 가능한지 확인:

```bash
# 자세한 오류 정보를 보려면 디버그 로그 활성화
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. 콘솔에 오류 로그가 있는지 확인:

```bash
# 로그 위치
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetic tool_result가 주입되지 않음

**증상**: 도구가 중단된 후 AI가 여전히 도구 결과를 기다림

**원인**: OpenCode의 저장 경로 구성이 잘못됨

**해결책**:

1. OpenCode의 저장 경로가 올바른지 확인:

```bash
# OpenCode 구성 보기
cat ~/.config/opencode/opencode.json | grep storage
```

2. 메시지 및 파트 저장 디렉터리가 있는지 확인:

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. 디렉터리가 없으면 OpenCode 구성을 확인하세요

### Auto Resume가 예기치 않게 트리거됨

**증상**: AI가 부적절한 때 자동으로 계속됨

**원인**: `auto_resume`가 `true`로 설정됨

**해결책**:

1. auto_resume 비활성화:

```json
{
  "auto_resume": false
}
```

2. 복구 시점을 수동으로 제어

### Toast 알림이 너무 자주 표시됨

**증상**: 복구 알림이 자주 팝업되어 사용자 경험에 영향을 줌

**원인**: `quiet_mode`가 활성화되지 않음

**해결책**:

1. quiet_mode 활성화:

```json
{
  "quiet_mode": true
}
```

2. 디버깅이 필요한 경우 일시적으로 비활성화

## 수업 요약

- 세션 복구 메커니즘은 세 가지 복구 가능한 오류를 자동으로 처리합니다: tool_result_missing, thinking_block_order, thinking_disabled_violation
- Synthetic tool_result은 세션 상태를 복구하는 핵심이며, 주입 내용은 "Operation cancelled by user (ESC pressed)"입니다
- session_recovery는 기본적으로 활성화되어 있으며, auto_resume은 기본적으로 비활성화되어 있습니다(수동 제어 권장)
- 사고 블록 복구(thinking_block_order)는 빈 사고 블록을 미리 배치하여 AI가 사고 내용을 다시 생성할 수 있도록 합니다
- 사고 블록 제거(thinking_disabled_violation)는 사고 내용이 손실되므로 사고 모델에서 사고 기능을 사용하는지 확인하세요

## 다음 수업 예고

> 다음 수업에서는 **[요청 변환 메커니즘](../request-transformation/)**을 학습합니다.
>
> 배울 내용:
> - Claude와 Gemini 요청 형식의 차이점
> - Tool Schema 정리 및 변환 규칙
> - 사고 블록 서명 주입 메커니즘
> - Google Search Grounding 구성 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|---|---|---|
| 세션 복구 메인 로직 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | 전체 |
| 오류 유형 감지 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| tool_result_missing 복구 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| thinking_block_order 복구 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| thinking_disabled_violation 복구 | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| 저장소 유틸리티 함수 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | 전체 |
| 메시지 읽기 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| 파트(part) 읽기 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| 사고 블록 미리 배치 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| 사고 블록 제거 | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| 유형 정의 | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | 전체 |

**핵심 상수**:

| 상수명 | 값 | 설명 |
|---|---|---|
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Auto Resume 시 전송되는 복구 텍스트 |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | 사고 블록 유형 집합 |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | 메타데이터 유형 집합 |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | 콘텐츠 유형 집합 |

**핵심 함수**:

- `detectErrorType(error: unknown): RecoveryErrorType`: 오류 유형 감지, `"tool_result_missing"`, `"thinking_block_order"`, `"thinking_disabled_violation"` 또는 `null` 반환
- `isRecoverableError(error: unknown): boolean`: 오류가 복구 가능한지 판단
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`: 세션 복구 훅 생성
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`: tool_result_missing 오류 복구
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`: thinking_block_order 오류 복구
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`: thinking_disabled_violation 오류 복구
- `readMessages(sessionID): StoredMessageMeta[]`: 세션의 모든 메시지 읽기
- `readParts(messageID): StoredPart[]`: 메시지의 모든 파트(part) 읽기
- `prependThinkingPart(sessionID, messageID): boolean`: 메시지 시작에 빈 사고 블록 미리 배치
- `stripThinkingParts(messageID): boolean`: 메시지에서 모든 사고 블록 제거

**구성 항목**(schema.ts에서):

| 구성 항목 | 유형 | 기본값 | 설명 |
|---|---|---|---|
| `session_recovery` | boolean | `true` | 세션 복구 기능 활성화 |
| `auto_resume` | boolean | `false` | 자동으로 "continue" 메시지 전송 |
| `quiet_mode` | boolean | `false` | toast 알림 숨기기 |

</details>
