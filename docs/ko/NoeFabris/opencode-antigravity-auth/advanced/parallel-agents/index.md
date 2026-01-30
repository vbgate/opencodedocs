---
title: "PID 오프셋: 병렬 에이전트 계정 할당 최적화 | Antigravity Auth"
sidebarTitle: "다중 에이전트 계정 충돌 방지"
subtitle: "병렬 에이전트 최적화: PID 오프셋과 계정 할당"
description: "PID 오프셋이 oh-my-opencode 병렬 에이전트의 계정 할당을 최적화하는 방법을 배웁니다. 설정 방법, 전략 조합, 효과 검증 및 문제 해결을 다룹니다."
tags:
  - "고급"
  - "병렬 에이전트"
  - "pid 오프셋"
  - "oh-my-opencode"
  - "로드 밸런싱"
prerequisite:
  - "빠른 설치"
  - "첫 번째 인증 로그인"
  - "고급 다중 계정 설정"
order: 5
---

# 병렬 에이전트 최적화: PID 오프셋과 계정 할당

**PID 오프셋**은 프로세스 ID 기반의 계정 할당 최적화 메커니즘으로, `process.pid % accounts.length`를 통해 오프셋을 계산하여 여러 OpenCode 프로세스나 oh-my-opencode 병렬 에이전트가 서로 다른 Google 계정을 우선 선택하도록 합니다. 여러 프로세스가 동시에 실행될 때, 각 프로세스는 자신의 PID 나머지에 따라 자동으로 다른 시작 계정을 선택하여, 여러 프로세스가 동시에 동일한 계정에 몰리는 것으로 인한 429 속도 제한 오류를 효과적으로 방지합니다. 이는 병렬 시나리오에서의 요청 성공률과 할당량 활용률을 크게 향상시키며, 특히 여러 Agent나 병렬 작업을 동시에 실행해야 하는 개발자에게 적합합니다.

## 학습 완료 후 할 수 있는 것

- 병렬 에이전트 시나리오에서의 계정 충돌 문제 이해
- PID 오프셋 기능을 활성화하여 서로 다른 프로세스가 다른 계정을 우선 선택하도록 설정
- round-robin 전략과 함께 다중 계정 활용률 극대화
- 병렬 에이전트에서의 속도 제한 및 계정 선택 문제 해결

## 현재 겪고 있는 문제

oh-my-opencode를 사용하거나 여러 OpenCode 인스턴스를 동시에 실행할 때 다음과 같은 문제가 발생할 수 있습니다:

- 여러 하위 에이전트가 동시에 동일한 계정을 사용하여 429 속도 제한 오류 빈번 발생
- 여러 계정을 설정했어도 동시 요청 시 여전히 동일한 계정에 몰림
- 다른 프로세스가 시작할 때 모두 첫 번째 계정부터 시작하여 계정 할당이 불균형
- 요청 실패 후 다시 시도하기까지 오랜 시간 대기 필요

## 이 기능을 사용해야 하는 경우

PID 오프셋 기능은 다음 시나리오에 적합합니다:

| 시나리오 | PID 오프셋 필요 여부 | 이유 |
|--- | --- | ---|
| 단일 OpenCode 인스턴스 | ❌ 필요 없음 | 단일 프로세스로 계정 충돌 발생 안 함 |
| 여러 계정 수동 전환 | ❌ 필요 없음 | 비동시이므로 sticky 전략으로 충분 |
| oh-my-opencode 다중 Agent | ✅ 권장 | 다중 프로세스 동시 실행으로 계정 분산 필요 |
| 여러 OpenCode 동시 실행 | ✅ 권장 | 서로 다른 프로세스의 독립 PID로 자동 분산 |
| CI/CD 병렬 작업 | ✅ 권장 | 각 작업의 독립 프로세스로 경쟁 방지 |

::: warning 사전 확인
이 튜토리얼을 시작하기 전에 다음을 완료했는지 확인하세요:
- ✅ 최소 2개의 Google 계정 설정
- ✅ 계정 선택 전략의 작동 원리 이해
- ✅ oh-my-opencode 사용 또는 병렬로 여러 OpenCode 인스턴스 실행 필요

[다중 계정 설정 튜토리얼](../multi-account-setup/) | [계정 선택 전략 튜토리얼](../account-selection-strategies/)
:::

## 핵심 개념

### PID 오프셋이란 무엇인가?

**PID (Process ID)**는 운영 체제가 각 프로세스에 할당하는 고유 식별자입니다. 여러 OpenCode 프로세스가 동시에 실행될 때, 각 프로세스는 서로 다른 PID를 가집니다.

**PID 오프셋**은 프로세스 ID 기반의 계정 할당 최적화입니다:

```
3개 계정이 있다고 가정 (index: 0, 1, 2):

프로세스 A (PID=123):
  123 % 3 = 0 → 계정 0 우선 사용

프로세스 B (PID=456):
  456 % 3 = 1 → 계정 1 우선 사용

프로세스 C (PID=789):
  789 % 3 = 2 → 계정 2 우선 사용
```

각 프로세스는 자신의 PID 나머지에 따라 서로 다른 계정을 우선 선택하여, 처음부터 동일한 계정에 몰리는 것을 방지합니다.

### 왜 PID 오프셋이 필요한가?

PID 오프셋이 없을 때, 모든 프로세스가 시작할 때 계정 0부터 시작합니다:

```
타임라인:
T1: 프로세스 A 시작 → 계정 0 사용
T2: 프로세스 B 시작 → 계정 0 사용  ← 충돌!
T3: 프로세스 C 시작 → 계정 0 사용  ← 충돌!
```

PID 오프셋 활성화 후:

```
타임라인:
T1: 프로세스 A 시작 → PID 오프셋 → 계정 0 사용
T2: 프로세스 B 시작 → PID 오프셋 → 계정 1 사용  ← 분산!
T3: 프로세스 C 시작 → PID 오프셋 → 계정 2 사용  ← 분산!
```

### 계정 선택 전략과의 조합

PID 오프셋은 sticky 전략의 fallback 단계에서만 작동합니다(round-robin 및 hybrid 전략은 자체 할당 로직이 있음):

| 전략 | PID 오프셋 적용 여부 | 권장 시나리오 |
|--- | --- | ---|
| `sticky` | ✅ 적용 | 단일 프로세스 + prompt cache 우선 |
| `round-robin` | ❌ 미적용 | 다중 프로세스/병렬 에이전트, 최대 처리량 |
| `hybrid` | ❌ 미적용 | 스마트 할당, 건강 점수 우선 |

**왜 round-robin에는 PID 오프셋이 필요 없는가?**

round-robin 전략은 자체적으로 계정을 순환합니다:

```typescript
// 각 요청마다 다음 계정으로 전환
this.cursor++;
const account = available[this.cursor % available.length];
```

여러 프로세스는 자연스럽게 서로 다른 계정으로 분산되므로, 추가적인 PID 오프셋이 필요하지 않습니다.

::: tip 모범 사례
병렬 에이전트 시나리오의 경우 다음 설정을 권장합니다:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // round-robin에는 필요 없음
}
```

sticky 또는 hybrid 전략을 반드시 사용해야 하는 경우에만 PID 오프셋을 활성화합니다.
:::

## 따라 해 보기

### 1단계: 다중 계정 설정 확인

**이유**
PID 오프셋은 최소 2개 계정이 있어야 효과를 발휘할 수 있습니다. 1개 계정만 있는 경우, PID 나머지가 무엇이든 해당 계정만 사용할 수 있습니다.

**작업**

현재 계정 수 확인:

```bash
opencode auth list
```

최소 2개 계정이 표시되어야 합니다:

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

1개 계정만 있는 경우, 더 많은 계정을 추가하세요:

```bash
opencode auth login
```

프롬프트에 따라 `(a)dd new account(s)`를 선택합니다.

**다음을 확인해야 합니다**: 계정 목록에 2개 이상의 계정이 표시되어야 합니다.

### 2단계: PID 오프셋 설정

**이유**
설정 파일을 통해 PID 오프셋 기능을 활성화하여 플러그인이 계정 선택 시 프로세스 ID를 고려하도록 합니다.

**작업**

OpenCode 설정 파일을 엽니다:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

다음 설정을 추가하거나 수정합니다:

```json
{
  "pid_offset_enabled": true
}
```

전체 설정 예시(sticky 전략과 함께 사용):

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**환경 변수 방식**(선택 사항):

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**다음을 확인해야 합니다**: 설정 파일에서 `pid_offset_enabled`가 `true`로 설정되어야 합니다.

### 3단계: PID 오프셋 효과 검증

**이유**
여러 프로세스를 실제로 실행하여 PID 오프셋이 작동하는지, 서로 다른 프로세스가 다른 계정을 우선 사용하는지 확인합니다.

**작업**

두 개의 터미널 창을 열고 각각 OpenCode를 실행합니다:

**터미널 1**:
```bash
opencode chat
# 요청 하나를 보내고 사용된 계정을 기록합니다(로그 또는 toast 확인)
```

**터미널 2**:
```bash
opencode chat
# 요청 하나를 보내고 사용된 계정을 기록합니다
```

계정 선택 동작 관찰:

- ✅ **기대**: 두 터미널이 서로 다른 계정을 우선 사용
- ❌ **문제**: 두 터미널이 동일한 계정 사용

문제가 지속되면 다음을 확인하세요:

1. 설정이 올바르게 로드되었는지
2. 계정 선택 전략이 `sticky`인지(round-robin은 PID 오프셋 필요 없음)
3. 계정이 1개뿐인지

디버그 로그를 활성화하여 상세 계정 선택 과정을 확인하세요:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

로그에 다음이 표시됩니다:

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**다음을 확인해야 합니다**: 서로 다른 터미널이 서로 다른 계정을 우선 사용하거나, 로그에 PID 오프셋이 적용되었다고 표시되어야 합니다.

### 4단계: (선택 사항) round-robin 전략과 조합

**이유**
round-robin 전략은 자체적으로 계정을 순환하므로 PID 오프셋이 필요하지 않습니다. 하지만 고빈도 동시 병렬 에이전트의 경우 round-robin이 더 나은 선택입니다.

**작업**

설정 파일 수정:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

여러 oh-my-opencode Agent를 시작하여 요청 분포를 관찰합니다:

```
Agent 1 → 계정 0 → 계정 1 → 계정 2 → 계정 0 ...
Agent 2 → 계정 1 → 계정 2 → 계정 0 → 계정 1 ...
```

각 Agent가 독립적으로 순환하며 모든 계정의 할당량을 최대한 활용합니다.

**다음을 확인해야 합니다**: 요청이 모든 계정에 균등하게 분산되고, 각 Agent가 독립적으로 순환해야 합니다.

## 체크포인트 ✅

위 단계를 완료한 후 다음을 수행할 수 있어야 합니다:

- [ ] 최소 2개의 Google 계정을 성공적으로 설정
- [ ] `antigravity.json`에서 `pid_offset_enabled` 활성화
- [ ] 여러 OpenCode 인스턴스 실행 시 서로 다른 프로세스가 서로 다른 계정을 우선 사용
- [ ] round-robin이 PID 오프셋을 필요로 하지 않는 이유 이해
- [ ] 디버그 로그를 사용하여 계정 선택 과정 확인

## 일반적인 문제

### 문제 1: 활성화 후 효과 없음

**증상**: `pid_offset_enabled: true`를 설정했지만 여러 프로세스가 여전히 동일한 계정을 사용합니다.

**원인**: 계정 선택 전략이 `round-robin` 또는 `hybrid`일 수 있으며, 이 두 전략은 PID 오프셋을 사용하지 않습니다.

**해결책**: `sticky` 전략으로 전환하거나, 현재 전략에 PID 오프셋이 필요하지 않음을 이해합니다.

```json
{
  "account_selection_strategy": "sticky",  // sticky로 변경
  "pid_offset_enabled": true
}
```

### 문제 2: 1개 계정만 있음

**증상**: PID 오프셋을 활성화한 후 모든 프로세스가 여전히 계정 0을 사용합니다.

**원인**: PID 오프셋은 `process.pid % accounts.length`로 계산되므로, 계정이 1개뿐이면 나머지는 항상 0입니다.

**해결책**: 더 많은 계정을 추가하세요:

```bash
opencode auth login
# (a)dd new account(s) 선택
```

### 문제 3: Prompt cache 비활성화

**증상**: PID 오프셋을 활성화한 후 Anthropic의 prompt cache가 더 이상 작동하지 않는 것을 발견합니다.

**원인**: PID 오프셋으로 인해 서로 다른 프로세스나 세션이 서로 다른 계정을 사용할 수 있으며, prompt cache는 계정별로 공유됩니다. 계정 전환 후 프롬프트를 다시 보내야 합니다.

**해결책**: 이는 예상된 동작입니다. prompt cache 우선순위가 더 높은 경우 PID 오프셋을 비활성화하고 sticky 전략을 사용하세요:

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### 문제 4: oh-my-opencode 다중 Agent 충돌

**증상**: 여러 계정을 설정했어도 oh-my-opencode의 여러 Agent가 여전히 429 오류를 자주 겪습니다.

**원인**: oh-my-opencode는 순서대로 Agent를 시작할 수 있으며, 짧은 시간 안에 여러 Agent가 동시에 동일 계정을 요청할 수 있습니다.

**해결책**:

1. `round-robin` 전략 사용(권장):

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. 또는 계정 수를 늘려 각 Agent가 독립 계정을 가지도록 보장:

```bash
# 3개 Agent가 있는 경우 최소 5개 계정 권장
opencode auth login
```

## 이번 수업 요약

PID 오프셋 기능은 프로세스 ID(PID)를 통해 다중 프로세스 시나리오에서의 계정 할당을 최적화합니다:

- **원리**: `process.pid % accounts.length`로 오프셋 계산
- **역할**: 서로 다른 프로세스가 서로 다른 계정을 우선 선택하여 충돌 방지
- **제한**: sticky 전략에서만 작동하며 round-robin 및 hybrid에는 필요 없음
- **모범 사례**: 병렬 에이전트 시나리오에는 round-robin 전략을 권장하며 PID 오프셋 불필요

다중 계정을 설정한 후 사용 시나리오에 따라 적절한 전략을 선택하세요:

| 시나리오 | 권장 전략 | PID 오프셋 |
|--- | --- | ---|
| 단일 프로세스, prompt cache 우선 | sticky | 아니오 |
| 다중 프로세스/병렬 에이전트 | round-robin | 아니오 |
| hybrid 전략 + 분산 시작 | hybrid | 선택 사항 |

## 다음 수업 미리보기

> 다음 수업에서는 **[설정 옵션 완전 가이드](../configuration-guide/)**를 학습합니다.
>
> 다음을 배울 수 있습니다:
> - 설정 파일 위치 및 우선순위
> - 모델 동작, 계정 순환, 애플리케이션 동작 설정 옵션
> - 다양한 시나리오별 권장 설정
> - 고급 설정 튜닝 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기를 클릭하세요</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| PID 오프셋 구현 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| 설정 Schema 정의 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| 환경 변수 지원 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| 설정 전달 위치 | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| 사용 문서 | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| 설정 가이드 | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**핵심 함수**:
- `getCurrentOrNextForFamily()`: 계정 선택 메인 함수로 내부에서 PID 오프셋 로직 처리
- `process.pid % this.accounts.length`: 오프셋 계산의 핵심 공식

**핵심 상수**:
- `sessionOffsetApplied[family]`: 각 모델 패밀리의 오프셋 적용 표시(세션당 한 번만 적용)

</details>
