---
title: "OpenAI 할당량 조회: 3시간/24시간 창 | opencode-mystatus"
sidebarTitle: "OpenAI 할당량"
subtitle: "OpenAI 할당량 조회: 3시간 및 24시간 할당량"
description: "OpenAI ChatGPT의 3시간 및 24시간 할당량 조회 방법을 학습합니다. 메인 창, 서브 창 해석과 토큰 만료 처리 방법을 마스터합니다."
tags:
  - "OpenAI"
  - "할당량 조회"
  - "API 할당량"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# OpenAI 할당량 조회: 3시간 및 24시간 할당량

## 학습 후 할 수 있는 것

- `/mystatus`를 사용하여 OpenAI Plus/Team/Pro 구독 할당량 조회
- 출력에서의 3시간 및 24시간 할당량 정보 이해
- 메인 창과 서브 창의 차이 이해
- 토큰 만료 시의 처리 방법 이해

## 현재 겪고 있는 문제

OpenAI의 API 호출은 할당량이 있으며, 초과 후 일시적으로 접근이 제한됩니다. 하지만 다음을 모릅니다:
- 현재 남은 할당량이 얼마인가?
- 3시간 및 24시간 창 중 어느 것이 사용 중인가?
- 언제 재설정되는가?
- 때로 두 창의 데이터가 보이는 이유는?

이 정보를 제때 파악하지 못하면 ChatGPT를 사용하여 코드를 작성하거나 프로젝트를 진행하는 데 영향을 줄 수 있습니다.

## 언제 이 기능을 사용하나요?

다음 경우에:
- OpenAI API를 자주 사용하여 개발
- 응답 속도가 느려지거나 플로우 제한을 겪을 때
- 팀 계정의 사용 상황을 알고 싶을 때
- 할당량이 언제 새로고침되는지 알고 싶을 때

## 핵심 원리

OpenAI는 API 호출에 대해 두 가지 플로우 제한 창이 있습니다:

| 창 유형 | 시간 | 역할 |
|---------|------|------|
| **메인 창**(primary) | OpenAI 서버에서 반환됨 | 단기간에 대량의 호출 방지 |
| **서브 창**(secondary) | OpenAI 서버에서 반환됨(존재하지 않을 수 있음) | 장기간 초과 사용 방지 |

mystatus는 이 두 창을 병렬로 조회하여, 각각의 다음을 표시합니다:
- 사용된 백분율
- 남은 할당량 프로그레스 바
- 재설정까지 남은 시간

::: info
창 시간은 OpenAI 서버에서 반환되며, 다른 구독 유형(Plus, Team, Pro)은 다를 수 있습니다.
:::

## 따라하기

### 1단계: 조회 명령어 실행

OpenCode에서 `/mystatus`를 입력하면, 시스템이 자동으로 모든 설정된 플랫폼의 할당량을 조회합니다.

**다음과 같이 보여야 합니다**:
설정된 모든 플랫폼(OpenAI, 지푸 AI, Z.ai, Copilot, Google Cloud 등)의 할당량 정보가 포함됩니다(어떤 플랫폼을 설정했는지에 따름).

### 2단계: OpenAI 부분 찾기

출력에서 `## OpenAI Account Quota` 부분을 찾으세요.

**다음과 같이 보여야 합니다**:

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
███████████████░░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### 3단계: 메인 창 정보 해석

**메인 창**(primary_window)은 일반적으로 다음을 표시합니다:
- **창 이름**: 예: `3-hour limit` 또는 `24-hour limit`
- **프로그레스 바**: 남은 할당량 비율을 직관적으로 표시
- **남은 백분율**: 예: `60% remaining`
- **재설정 시간**: 예: `Resets in: 2h 30m`

**다음과 같이 보여야 합니다**:
- 창 이름에 시간이 표시됨(3시간 / 24시간)
- 프로그레스 바가 가득 찼을수록 남은 것이 많고, 비었을수록 곧 다 사용됨
- 재설정 시간은 카운트다운으로, 0이 되면 할당량이 새로고침됨

::: warning
`Limit reached!`가 표시되면, 현재 창 할당량이 다 사용된 것이며, 재설정을 기다려야 합니다.
:::

### 4단계: 서브 창 확인(있다면)

OpenAI가 서브 창 데이터를 반환하면 다음을 볼 수 있습니다:

```
24-hour limit
████████████████████████████ 90% remaining
Resets in: 20h 45m
```

**다음과 같이 보여야 합니다**:
- 서브 창은 다른 시간 차원의 할당량을 표시합니다(일반적으로 24시간)
- 메인 창과 다른 남은 백분율을 가질 수 있음

::: tip
서브 창은 독립적인 할당량 풀로, 메인 창이 사용해도 서브 창에 영향을 주지 않으며, 그 반대도 마찬가지입니다.
:::

### 5단계: 구독 유형 확인

`Account` 행에서 구독 유형을 볼 수 있습니다:

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   구독 유형
```

**일반적인 구독 유형**:
- `plus`: 개인 Plus 구독
- `team`: 팀/조직 구독
- `pro`: Pro 구독

**다음과 같이 보여야 합니다**:
- 계정 유형이 이메일 뒤의 괄호에 표시됨
- 다른 유형의 할당량은 다를 수 있음

## 체크포인트 ✅

다음을 이해했는지 확인하세요:

| 시나리오 | 보여야 하는 것 |
|------|----------|
| 메인 창 남음 60% | 프로그레스 바가 약 60% 차고, `60% remaining` 표시 |
| 2.5시간 후 재설정 | `Resets in: 2h 30m` 표시 |
| 할당량 도달 | `Limit reached!` 표시 |
| 서브 창 있음 | 메인 창과 서브 창 각각 한 줄의 데이터 |

## 일반적인 실수

### ❌ 잘못된 작업: 토큰 만료 후 새로고침하지 않음

**오류 증상**: `⚠️ OAuth 인증이 만료되었습니다`(한국어) 또는 `⚠️ OAuth token expired`(영어) 표시

**원인**: OAuth 토큰이 만료됨(서버에서 제어하는 구체적인 시간), 만료 후 할당량을 조회할 수 없음

**올바른 작업**:
1. OpenCode에서 OpenAI를 다시 로그인
2. 토큰이 자동으로 새로고침됨
3. 다시 `/mystatus` 실행하여 조회

### ❌ 잘못된 작업: 메인 창과 서브 창 혼동

**오류 증상**: 하나의 창 할당량만 있는 줄 알고, 메인 창이 다 사용됐을 때 서브 창을 계속 사용

**원인**: 두 창은 독립적인 할당량 풀

**올바른 작업**:
- 두 창의 각 재설정 시간에 주의
- 메인 창 재설정이 빠르고, 서브 창 재설정이 느림
- 합리적으로 사용하여 특정 창이 장기간 초과하지 않도록 함

### ❌ 잘못된 작업: 팀 계정 ID 무시

**오류 증상**: Team 구독이 자신의 사용 상황이 아닌 것을 표시

**원인**: Team 구독은 팀 계정 ID를 전달해야 하며, 그렇지 않으면 기본 계정을 조회할 수 있음

**올바른 작업**:
- OpenCode에 올바른 팀 계정으로 로그인했는지 확인
- 토큰에 자동으로 `chatgpt_account_id`가 포함됨

## 이번 수업 요약

mystatus는 OpenAI 공식 API를 호출하여 할당량을 조회합니다:
- OAuth 인증 지원(Plus/Team/Pro)
- 메인 창 및 서브 창 표시(있다면)
- 프로그레스 바로 남은 할당량 시각화
- 카운트다운으로 재설정 시간 표시
- 토큰 만료 자동 감지

## 다음 수업 미리보기

> 다음 수업에서는 **[지푸 AI 및 Z.ai 할당량 조회](../zhipu-usage/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - 5시간 Token 할당량은 무엇인가
> - MCP 월간 할당량을 어떻게 보는가
> - 사용률이 80%를 초과할 때의 경고 표시

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 펼치기</strong></summary>

> 업데이트 날짜:2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------- |
| OpenAI 할당량 조회 엔트리 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| OpenAI API 호출 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| 형식화 출력 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| JWT 토큰 파싱 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73) | 64-73 |
| 사용자 이메일 추출 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81) | 78-81 |
| 토큰 만료 확인 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| OpenAIAuthData 유형 정의 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33) | 28-33 |

**상수**:
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`: OpenAI 공식 할당량 조회 API

**핵심 함수**:
- `queryOpenAIUsage(authData)`: OpenAI 할당량 조회의 메인 함수
- `fetchOpenAIUsage(accessToken)`: OpenAI API 호출
- `formatOpenAIUsage(data, email)`: 형식화 출력
- `parseJwt(token)`: JWT 토큰 파싱(비표준 라이브러리 구현)
- `getEmailFromJwt(token)`: 토큰에서 사용자 이메일 추출
- `getAccountIdFromJwt(token)`: 토큰에서 팀 계정 ID 추출

</details>
