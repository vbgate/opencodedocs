---
title: "이벤트 타입 설명: OpenCode 알림 트리거 시점 이해하기 | opencode-notify"
sidebarTitle: "알림이 언제 전송되는가"
subtitle: "이벤트 타입 설명: OpenCode 알림 트리거 시점 이해하기"
description: "opencode-notify 플러그인이 수신하는 OpenCode 이벤트 타입을 학습하고, session.idle, session.error, permission.updated, tool.execute.before의 트리거 조건과 필터 규칙을 이해하세요."
tags:
  - "부록"
  - "이벤트 타입"
  - "OpenCode"
prerequisite: []
order: 130
---

# 이벤트 타입 설명: OpenCode 알림 트리거 시점 이해하기

이 페이지에서는 `opencode-notify` 플러그인이 수신하는 **OpenCode 이벤트 타입**과 트리거 조건을 나열합니다. 플러그인은 네 가지 이벤트를 수신합니다: session.idle, session.error, permission.updated, tool.execute.before. 이러한 이벤트의 트리거 시점과 필터 규칙을 이해하면 알림 동작을 더 잘 구성할 수 있습니다.

## 이벤트 타입 개요

| 이벤트 타입 | 트리거 시점 | 알림 제목 | 기본 음향 | 부모 세션 확인 | 터미널 포커스 확인 |
| --- | --- | --- | --- | --- | --- |
| `session.idle` | AI 세션이 유휴 상태로 전환될 때 | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | AI 세션 실행 중 오류 발생 | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | AI가 사용자 권한이 필요할 때 | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | AI가 질문할 때(question 도구) | "Question for you" | Submarine* | ❌ | ❌ |

> *참고: question 이벤트는 기본적으로 permission 음향을 사용하며, 구성을 통해 커스터마이징 가능합니다

## 이벤트 상세 설명

### session.idle

**트리거 조건**: AI 세션이 작업 완료 후 유휴 상태로 전환될 때

**알림 내용**:
- 제목: `Ready for review`
- 메시지: 세션 제목(최대 50자)

**처리 로직**:
1. 부모 세션 여부 확인(`notifyChildSessions=false`일 때)
2. 무음 시간대 여부 확인
3. 터미널 포커스 여부 확인(포커스 시 알림 억제)
4. 네이티브 알림 전송

**소스 코드 위치**: `src/notify.ts:249-284`

---

### session.error

**트리거 조건**: AI 세션 실행 과정에서 오류 발생

**알림 내용**:
- 제목: `Something went wrong`
- 메시지: 오류 요약(최대 100자)

**처리 로직**:
1. 부모 세션 여부 확인(`notifyChildSessions=false`일 때)
2. 무음 시간대 여부 확인
3. 터미널 포커스 여부 확인(포커스 시 알림 억제)
4. 네이티브 알림 전송

**소스 코드 위치**: `src/notify.ts:286-313`

---

### permission.updated

**트리거 조건**: AI가 특정 작업을 수행하기 위해 사용자 권한이 필요할 때

**알림 내용**:
- 제목: `Waiting for you`
- 메시지: `OpenCode needs your input`

**처리 로직**:
1. **부모 세션을 확인하지 않음**(권한 요청은 항상 수동 처리 필요)
2. 무음 시간대 여부 확인
3. 터미널 포커스 여부 확인(포커스 시 알림 억제)
4. 네이티브 알림 전송

**소스 코드 위치**: `src/notify.ts:315-334`

---

### tool.execute.before

**트리거 조건**: AI가 도구를 실행하기 전, 도구 이름이 `question`일 때

**알림 내용**:
- 제목: `Question for you`
- 메시지: `OpenCode needs your input`

**처리 로직**:
1. **부모 세션을 확인하지 않음**
2. **터미널 포커스를 확인하지 않음**(tmux 워크플로우 지원)
3. 무음 시간대 여부 확인
4. 네이티브 알림 전송

**특별 설명**: 이 이벤트는 포커스 감지를 수행하지 않으므로 tmux 다중 창 워크플로우에서 정상적으로 알림을 받을 수 있습니다.

**소스 코드 위치**: `src/notify.ts:336-351`

## 트리거 조건과 필터 규칙

### 부모 세션 확인

기본적으로 플러그인은 부모 세션(루트 세션)에만 알림을 전송하여 하위 작업에서 대량의 알림이 생성되는 것을 방지합니다.

**확인 로직**:
- `client.session.get()`을 통해 세션 정보 획득
- 세션에 `parentID`가 있으면 알림 전송 건스킵

**구성 옵션**:
- `notifyChildSessions: false`(기본값) - 부모 세션에만 알림
- `notifyChildSessions: true` - 모든 세션에 알림

**적용 이벤트**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌(확인하지 않음)
- `tool.execute.before` ❌(확인하지 않음)

### 무음 시간대 확인

구성된 무음 시간대 동안에는 알림을 전송하지 않습니다.

**확인 로직**:
- `quietHours.enabled`, `quietHours.start`, `quietHours.end` 읽기
- 자정을 넘는 시간대 지원(예: 22:00-08:00)

**적용 이벤트**:
- 모든 이벤트 ✅

### 터미널 포커스 확인

사용자가 터미널을 보고 있을 때 알림을 억제하여 중복 알림을 방지합니다.

**확인 로직**:
- macOS: `osascript`를 통해 전경 애플리케이션 이름 획득
- `frontmostApp`과 터미널 `processName` 비교

**적용 이벤트**:
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌(확인하지 않음, tmux 지원)

## 플랫폼 차이점

| 기능 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| 네이티브 알림 | ✅ | ✅ | ✅ |
| 터미널 포커스 감지 | ✅ | ❌ | ❌ |
| 알림 클릭 시 터미널 포커스 | ✅ | ❌ | ❌ |
| 커스텀 음향 | ✅ | ❌ | ❌ |

## 구성 영향

알림 동작은 구성 파일을 통해 커스터마이징할 수 있습니다:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**관련 튜토리얼**:
- [구성 참조](../../advanced/config-reference/)
- [무음 시간대 상세 설명](../../advanced/quiet-hours/)

---

## 다음 수업 예고

> 다음 수업에서는 **[구성 파일 예시](../config-file-example/)**를 학습합니다.
>
> 학습 내용:
> - 완전한 구성 파일 템플릿
> - 모든 구성 필드의 상세 주석
> - 구성 파일 기본값 설명

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 이벤트 타입 | 파일 경로 | 라인 번호 | 처리 함수 |
| --- | --- | --- | --- |
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| 이벤트 리스너 설정 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**주요 상수**:
- `DEFAULT_CONFIG` (L56-68): 기본 구성, 음향 및 무음 시간대 설정 포함
- `TERMINAL_PROCESS_NAMES` (L71-84): 터미널 이름에서 macOS 프로세스 이름으로의 매핑

**주요 함수**:
- `sendNotification()` (L227-243): 네이티브 알림 전송, macOS 포커스 기능 처리
- `isParentSession()` (L205-214): 부모 세션 여부 확인
- `isQuietHours()` (L181-199): 무음 시간대 여부 확인
- `isTerminalFocused()` (L166-175): 터미널 포커스 여부 확인(仅 macOS)

</details>
