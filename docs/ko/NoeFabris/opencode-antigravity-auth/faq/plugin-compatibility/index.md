---
title: "플러그인 호환성: 일반적인 플러그인 충돌 해결 | Antigravity Auth"
sidebarTitle: "플러그인 충돌 해결"
subtitle: "다른 플러그인과의 호환성 문제 해결"
description: "Antigravity Auth와 oh-my-opencode, DCP 등 플러그인 간의 호환성 문제를 해결하는 방법을 알아봅니다. 올바른 플러그인 로드 순서 설정 및 충돌하는 인증 방식 비활성화 방법을 다룹니다."
tags:
  - "FAQ"
  - "플러그인 설정"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# 다른 플러그인과의 호환성 문제 해결

**플러그인 호환성**은 Antigravity Auth 사용 시 자주 발생하는 문제입니다. 서로 다른 플러그인이 충돌하여 인증 실패, thinking blocks 누락, 요청 형식 오류 등이 발생할 수 있습니다. 이 튜토리얼에서는 oh-my-opencode, DCP 등 플러그인과의 호환성 문제를 해결하는 방법을 안내합니다.

## 학습 목표

- 플러그인 로드 순서를 올바르게 설정하여 DCP 문제 방지
- oh-my-opencode에서 충돌하는 인증 방식 비활성화
- 불필요한 플러그인 식별 및 제거
- 병렬 에이전트 시나리오를 위한 PID 오프셋 활성화

## 일반적인 호환성 문제

### 문제 1: oh-my-opencode와의 충돌

**증상**:
- 인증 실패 또는 OAuth 인증 창이 반복적으로 표시됨
- 모델 요청에서 400 또는 401 오류 반환
- Agent 모델 설정이 적용되지 않음

**원인**: oh-my-opencode는 기본적으로 내장 Google 인증이 활성화되어 있어 Antigravity Auth의 OAuth 흐름과 충돌합니다.

::: warning 핵심 문제
oh-my-opencode는 모든 Google 모델 요청을 가로채서 자체 인증 방식을 사용합니다. 이로 인해 Antigravity Auth의 OAuth 토큰을 사용할 수 없게 됩니다.
:::

**해결 방법**:

`~/.config/opencode/oh-my-opencode.json` 파일을 편집하여 다음 설정을 추가합니다:

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**설정 설명**:

| 설정 항목 | 값 | 설명 |
| --- | --- | --- |
| `google_auth` | `false` | oh-my-opencode의 내장 Google 인증 비활성화 |
| `agents.<agent-name>.model` | `google/antigravity-*` | Agent 모델을 Antigravity 모델로 재정의 |

**체크포인트 ✅**:

- 설정 저장 후 OpenCode 재시작
- Agent가 Antigravity 모델을 사용하는지 테스트
- OAuth 인증 창이 더 이상 표시되지 않는지 확인

---

### 문제 2: DCP(@tarquinen/opencode-dcp)와의 충돌

**증상**:
- Claude Thinking 모델에서 오류 반환: `thinking must be first block in message`
- 대화 기록에서 thinking blocks 누락
- 사고 내용이 표시되지 않음

**원인**: DCP가 생성하는 synthetic assistant messages(합성 어시스턴트 메시지)에 thinking blocks가 없어 Claude API 요구사항과 충돌합니다.

::: info synthetic messages란?
Synthetic messages는 플러그인이나 시스템이 자동으로 생성하는 메시지로, 대화 기록을 복구하거나 누락된 메시지를 보완하는 데 사용됩니다. DCP는 특정 시나리오에서 이러한 메시지를 생성하지만 thinking blocks를 추가하지 않습니다.
:::

**해결 방법**:

Antigravity Auth가 DCP **이전에** 로드되도록 합니다. `~/.config/opencode/config.json` 파일을 편집합니다:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**이 순서가 필요한 이유**:

- Antigravity Auth가 thinking blocks를 처리하고 복구합니다
- DCP가 synthetic messages를 생성합니다(thinking blocks가 누락될 수 있음)
- DCP가 먼저 로드되면 Antigravity Auth가 DCP가 생성한 메시지를 복구할 수 없습니다

**체크포인트 ✅**:

- `opencode-antigravity-auth`가 `@tarquinen/opencode-dcp` 앞에 있는지 확인
- OpenCode 재시작
- Thinking 모델이 사고 내용을 정상적으로 표시하는지 테스트

---

### 문제 3: 병렬 에이전트 시나리오에서의 계정 할당

**증상**:
- 여러 병렬 에이전트가 동일한 계정 사용
- 속도 제한에 걸리면 모든 에이전트가 동시에 실패
- 할당량 활용률 저하

**원인**: 기본적으로 여러 병렬 에이전트가 동일한 계정 선택 로직을 공유하여 동시에 같은 계정을 사용할 수 있습니다.

::: tip 병렬 에이전트 시나리오
Cursor의 병렬 기능(예: 여러 Agent 동시 실행)을 사용할 때 각 Agent는 독립적으로 모델 요청을 보냅니다. 올바른 계정 할당이 없으면 "충돌"이 발생할 수 있습니다.
:::

**해결 방법**:

`~/.config/opencode/antigravity.json` 파일을 편집하여 PID 오프셋을 활성화합니다:

```json
{
  "pid_offset_enabled": true
}
```

**PID 오프셋이란?**

PID(Process ID) 오프셋은 각 병렬 에이전트가 서로 다른 계정 시작 인덱스를 사용하도록 합니다:

```
에이전트 1 (PID 100) → 계정 0
에이전트 2 (PID 101) → 계정 1
에이전트 3 (PID 102) → 계정 2
```

이렇게 하면 동시에 요청을 보내더라도 같은 계정을 사용하지 않습니다.

**전제 조건**:
- 최소 2개의 Google 계정 필요
- `account_selection_strategy: "round-robin"` 또는 `"hybrid"` 활성화 권장

**체크포인트 ✅**:

- 여러 계정이 설정되어 있는지 확인(`opencode auth list` 실행)
- `pid_offset_enabled: true` 활성화
- 병렬 에이전트가 서로 다른 계정을 사용하는지 테스트(디버그 로그 확인)

---

### 문제 4: 불필요한 플러그인

**증상**:
- 인증 충돌 또는 중복 인증
- 플러그인 로드 실패 또는 경고 메시지
- 설정 혼란, 어떤 플러그인이 작동 중인지 파악 어려움

**원인**: 기능이 중복되는 플러그인이 설치되어 있습니다.

::: tip 중복 플러그인 점검
정기적으로 `config.json`의 plugin 목록을 확인하세요. 불필요한 플러그인을 제거하면 충돌과 성능 문제를 방지할 수 있습니다.
:::

**불필요한 플러그인**:

| 플러그인 유형 | 예시 | 이유 |
| --- | --- | --- |
| **gemini-auth 플러그인** | `opencode-gemini-auth`, `@username/gemini-auth` | Antigravity Auth가 모든 Google OAuth를 처리함 |
| **Claude 인증 플러그인** | `opencode-claude-auth` | Antigravity Auth는 Claude 인증을 사용하지 않음 |

**해결 방법**:

`~/.config/opencode/config.json`에서 이러한 플러그인을 제거합니다:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // 다음 항목 제거:
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**체크포인트 ✅**:

- `~/.config/opencode/config.json`의 plugin 목록 확인
- 모든 gemini-auth 관련 플러그인 제거
- OpenCode 재시작 후 인증 충돌이 없는지 확인

---

## 일반적인 오류 해결

### 오류 1: `thinking must be first block in message`

**가능한 원인**:
- DCP가 Antigravity Auth보다 먼저 로드됨
- oh-my-opencode의 session recovery가 Antigravity Auth와 충돌

**해결 단계**:

1. 플러그인 로드 순서 확인:
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. Antigravity Auth가 DCP보다 앞에 있는지 확인

3. 문제가 지속되면 oh-my-opencode의 session recovery 비활성화 시도(해당 기능이 있는 경우)

### 오류 2: `invalid_grant` 또는 인증 실패

**가능한 원인**:
- oh-my-opencode의 `google_auth`가 비활성화되지 않음
- 여러 인증 플러그인이 동시에 요청을 처리하려고 함

**해결 단계**:

1. oh-my-opencode 설정 확인:
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. 값이 `false`인지 확인

3. 다른 gemini-auth 플러그인 제거

### 오류 3: 병렬 에이전트가 모두 같은 계정 사용

**가능한 원인**:
- `pid_offset_enabled`가 활성화되지 않음
- 계정 수가 에이전트 수보다 적음

**해결 단계**:

1. Antigravity 설정 확인:
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. 값이 `true`인지 확인

3. 계정 수 확인:
   ```bash
   opencode auth list
   ```

4. 계정이 에이전트 수보다 적으면 계정 추가 권장

---

## 설정 예시

### 전체 설정 예시(oh-my-opencode 포함)

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## 이번 강의 요약

플러그인 호환성 문제는 일반적으로 인증 충돌, 플러그인 로드 순서 또는 기능 중복에서 발생합니다. 올바른 설정을 통해:

- ✅ oh-my-opencode의 내장 Google 인증 비활성화(`google_auth: false`)
- ✅ Antigravity Auth가 DCP보다 먼저 로드되도록 설정
- ✅ 병렬 에이전트를 위한 PID 오프셋 활성화(`pid_offset_enabled: true`)
- ✅ 중복 gemini-auth 플러그인 제거

이러한 설정으로 대부분의 호환성 문제를 방지하고 OpenCode 환경을 안정적으로 운영할 수 있습니다.

## 다음 강의 예고

> 다음 강의에서는 **[마이그레이션 가이드](../migration-guide/)**를 학습합니다.
>
> 배우게 될 내용:
> - 다른 기기 간 계정 설정 마이그레이션
> - 버전 업그레이드 시 설정 변경 처리
> - 계정 데이터 백업 및 복원

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-23

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| Thinking blocks 처리 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930) | 898-930 |
| 사고 블록 서명 캐시 | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | 전체 파일 |
| PID 오프셋 설정 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72) | 69-72 |
| Session recovery(oh-my-opencode 기반) | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 전체 파일 |

**주요 설정**:
- `pid_offset_enabled: true`: 프로세스 ID 오프셋 활성화, 병렬 에이전트에 서로 다른 계정 할당
- `account_selection_strategy: "hybrid"`: 스마트 하이브리드 계정 선택 전략

**주요 함수**:
- `deepFilterThinkingBlocks()`: 모든 thinking blocks 제거(request-helpers.ts:898)
- `filterThinkingBlocksWithSignatureCache()`: 서명 캐시 기반 thinking blocks 필터링(request-helpers.ts:1183)

</details>
