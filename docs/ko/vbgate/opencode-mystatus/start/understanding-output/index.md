---
title: "출력 해석: 할당량 표시 이해 | opencode-mystatus"
sidebarTitle: "출력 해석"
subtitle: "출력 해석하기: 프로그레스 바, 재설정 시간 및 다중 계정"
description: "opencode-mystatus 출력 형식 해석 방법을 학습합니다. 프로그레스 바, 재설정 시간, 플랫폼별 할당량 주기를 이해합니다."
tags:
  - "output-format"
  - "progress-bar"
  - "reset-time"
  - "multi-account"
prerequisite:
  - "start-quick-start"
order: 3
---

# 출력 해석하기: 프로그레스 바, 재설정 시간 및 다중 계정

## 학습 후 할 수 있는 것

- mystatus 출력의 모든 정보를 이해
- 프로그레스 바 표시 의미(채워진 블록 vs 빈 블록) 이해
- 다른 플랫폼의 할당량 주기(3시간, 5시간, 월간) 이해
- 여러 계정의 할당량 차이 식별

## 현재 겪고 있는 문제

`/mystatus`를 실행했고, 프로그레스 바, 백분율, 카운트다운이 많이 표시되지만, 명확하지 않습니다:

- 프로그레스 바가 가득 차 있는 것이 좋은가, 비어 있는 것이 좋은가?
- "Resets in: 2h 30m"은 무슨 뜻인가?
- 일부 플랫폼은 두 개의 프로그레스 바가 표시되고, 일부는 하나만 표시되는 이유는?
- Google Cloud는 여러 계정이 있는 이유는?

이번 수업에서 이 정보를 하나씩 해설합니다.

## 핵심 원리

mystatus의 출력은 통일 형식이지만, 플랫폼마다 차이가 있습니다:

**통일 요소**:
- 프로그레스 바: `█`(채워진)은 남은 것을, `░`(빈)은 사용된 것을 나타냄
- 백분율: 사용량에 기반하여 남은 백분율 계산
- 재설정 시간: 다음 할당량 새로고침까지의 카운트다운

**플랫폼 차이**:
| 플랫폼 | 할당량 주기 | 특징 |
| -------------- | --------------------------- | ----------------------- |
| OpenAI | 3시간 / 24시간 | 두 개의 창이 표시될 수 있음 |
| 지푸 AI / Z.ai | 5시간 Token / MCP 월간 할당량 | 두 가지 다른 할당량 유형 |
| GitHub Copilot | 월간 | 구체적 수치 표시(229/300) |
| Google Cloud | 모델별 | 각 계정에 4개의 모델 표시 |

## 출력 구조 분석

### 완전한 출력 예시

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
█████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████░░░░░░░░░░░░ 50%
G3 Image   4h 59m     ████████████████████ 100%
```

### 각 부분 의미

#### 1. 계정 정보 행

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**: 이메일 + 구독 유형 표시
- **지푸 AI / Z.ai**: 마스킹된 API Key + 계정 유형(Coding Plan) 표시
- **Google Cloud**: 이메일 표시, 다중 계정은 `###`로 구분

#### 2. 프로그레스 바

```
███████████████████████████ 85% remaining
```

- `█`(채워진 블록): **남은** 할당량
- `░`(빈 블록): **사용된** 할당량
- **백분율**: 남은 백분율(클수록 좋음)

::: tip 기억 공식
채워진 블록이 가득 찼을수록 남은 것이 많음 → 계속 사용해도 안전
빈 블록이 가득 찼을수록 많이 사용했음 → 아끼면서 사용
:::

#### 3. 재설정 시간 카운트다운

```
Resets in: 2h 30m
```

다음 할당량 새로고침까지 남은 시간을 나타냅니다.

**재설정 주기**:
- **OpenAI**: 3시간 창 / 24시간 창
- **지푸 AI / Z.ai**: 5시간 Token 할당량 / MCP 월간 할당량
- **GitHub Copilot**: 월간(구체적 날짜 표시)
- **Google Cloud**: 각 모델에 독립적인 재설정 시간

#### 4. 수치 세부 정보(일부 플랫폼)

지푸 AI와 Copilot은 구체적 수치를 표시합니다:

```
Used: 0.5M / 10.0M              # 지푸 AI: 사용됨 / 총량(단위: 백만 Token)
Premium        24% (229/300)     # Copilot: 남은 백분율(사용됨 / 총 할당량)
```

## 플랫폼 차이 상세 설명

### OpenAI: 이중 창 할당량

OpenAI는 두 개의 프로그레스 바를 표시할 수 있습니다:

```
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
█████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit**: 3시간 슬라이딩 창, 고빈도 사용에 적합
- **24-hour limit**: 24시간 슬라이딩 창, 장기 계획에 적합

**팀 계정**(Team):
- 메인 창과 서브 창 두 가지 할당량이 있음
- 다른 팀원이 동일한 팀 할당량 공유

**개인 계정**(Plus):
- 일반적으로 3시간 창만 표시

### 지푸 AI / Z.ai: 두 가지 할당량 유형

```
5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
███████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**: 5시간 내의 Token 사용 할당량
- **MCP limit**: Model Context Protocol(모델 컨텍스트 프로토콜) 월간 할당량, 검색 기능 사용

::: warning
MCP 할당량은 월간이며, 재설정 시간이 깁니다. 꽉 차 있으면 다음 달까지 기다려야 회복됩니다.
:::

### GitHub Copilot: 월간 할당량

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**: Copilot 고급 기능 사용량
- 구체적 수치 표시(사용됨 / 총 할당량)
- 월간 재설정, 구체적 날짜 표시

**구독 유형 차이**:
| 구독 유형 | 월간 할당량 | 설명 |
| ---------- | -------- | ---------------------- |
| Free | N/A | 할당량 제한 없으나, 기능 제한 |
| Pro | 300 | 표준 개인 버전 |
| Pro+ | 더 높음 | 업그레이드 버전 |
| Business | 더 높음 | 기업 버전 |
| Enterprise | 무제한 | 기업 버전 |

### Google Cloud: 다중 계정 + 다중 모델

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     2h 30m     ████████████░░░░░░░░ 75%
G3 Image   2h 30m     ██████████░░░░░░░░░ 50%
```

**형식**: `모델명 | 재설정 시간 | 프로그레스 바 + 백분율`

**4개 모델 설명**:
| 모델명 | 대응 API Key | 용도 |
| -------- | ---------------------------------------------- | ----------- |
| G3 Pro | `gemini-3-pro-high` / `gemini-3-pro-low` | 고급 추론 |
| G3 Image | `gemini-3-pro-image` | 이미지 생성 |
| G3 Flash | `gemini-3-flash` | 빠른 생성 |
| Claude | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude 모델 |

**다중 계정 표시**:
- 각 Google 계정은 `###`로 구분
- 각 계정은 자신의 4개 모델 할당량 표시
- 다른 계정의 할당량 사용 상황을 비교할 수 있음

## 일반적인 실수

### 일반적인 오해

| 오해 | 사실 |
| ------------------------- | -------------------------------------- |
| 프로그레스 바가 모두 채워짐 = 사용하지 않음 | 채워진 블록이 많음 = **남은 것이 많음**, 사용해도 안전 |
| 재설정 시간이 짧음 = 할당량이 거의 다 사용됨 | 재설정 시간이 짧음 = 곧 재설정됨, 계속 사용 가능 |
| 백분율 100% = 모두 사용됨 | 백분율 100% = **모두 남음** |
| 지푸 AI는 하나의 할당량만 표시 | 실제로는 TOKENS_LIMIT 및 TIME_LIMIT 두 가지가 있음 |

### 할당량이 다 차면 어떻게 하나요?

프로그레스 바가 모두 빈 블록(0% remaining)인 경우:

1. **단기 할당량**(예: 3시간, 5시간): 재설정 시간 카운트다운이 끝날 때까지 기다림
2. **월간 할당량**(예: Copilot, MCP): 다음 달 초까지 기다림
3. **다중 계정**: 다른 계정으로 전환(Google Cloud는 다중 계정 지원)

::: info
mystatus는 **읽기 전용 도구**로, 할당량을 소비하지 않으며, API 호출도 트리거하지 않습니다.
:::

## 이번 수업 요약

- **프로그레스 바**: 채워진 `█` = 남은 것, 빈 `░` = 사용된 것
- **재설정 시간**: 다음 할당량 새로고침까지의 카운트다운
- **플랫폼 차이**: 다른 플랫폼은 다른 할당량 주기를 가짐(3h/5h/월간)
- **다중 계정**: Google Cloud는 여러 계정을 표시하여 할당량 관리 용이

## 다음 수업 미리보기

> 다음 수업에서는 **[OpenAI 할당량 조회](../../platforms/openai-usage/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - OpenAI의 3시간 및 24시간 할당량 차이
> - 팀 계정의 할당량 공유 메커니즘
> - JWT 토큰을 파싱하여 계정 정보를 얻는 방법

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 펼치기</strong></summary>

> 업데이트 날짜:2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- | ------- |
| 프로그레스 바 생성 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53) | 40-53 |
| 시간 형식화 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29) | 18-29 |
| 남은 백분율 계산 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65) | 63-65 |
| Token 수량 형식화 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72) | 70-72 |
| OpenAI 출력 형식화 | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| 지푸 AI 출력 형식화 | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177) | 115-177 |
| Copilot 출력 형식화 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Google Cloud 출력 형식화 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294) | 265-294 |

**핵심 함수**:
- `createProgressBar(percent, width)`: 프로그레스 바 생성, 채워진 블록은 남은 것을 나타냄
- `formatDuration(seconds)`: 초 단위를 인간이 읽을 수 있는 시간 형식으로 변환(예: "2h 30m")
- `calcRemainPercent(usedPercent)`: 남은 백분율 계산(100 - 사용된 백분율)
- `formatTokens(tokens)`: Token 수량을 백만 단위로 형식화(예: "0.5M")

**핵심 상수**:
- 프로그레스 바 기본 너비: 30 문자(Google Cloud 모델은 20 문자 사용)
- 프로그레스 바 문자: `█`(채워진), `░`(빈)

</details>
