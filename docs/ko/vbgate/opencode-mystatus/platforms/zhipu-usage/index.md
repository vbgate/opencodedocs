---
title: "지푸 AI 할당량 조회 | opencode-mystatus"
sidebarTitle: "지푸 AI 할당량"
subtitle: "지푸 AI 및 Z.ai 할당량 조회: 5시간 Token 할당량 및 MCP 월간 할당량"
description: "지푸 AI와 Z.ai의 Token 및 MCP 할당량 조회 방법을 학습합니다. opencode-mystatus로 프로그레스 바와 재설정 시간을 해석합니다."
tags:
  - "지푸 AI"
  - "Z.ai"
  - "할당량 조회"
  - "Token 할당량"
  - "MCP 할당량"
prerequisite:
  - "start-quick-start"
order: 2
---

# 지푸 AI 및 Z.ai 할당량 조회: 5시간 Token 할당량 및 MCP 월간 할당량

## 학습 후 할 수 있는 것

- **지푸 AI** 및 **Z.ai**의 5시간 Token 할당량 사용 상황 조회
- **MCP 월간 할당량**의 의미와 재설정 규칙 이해
- 할당량 출력에서의 **프로그레스 바, 사용량, 총량** 등 정보 이해
- **사용률 경고**가 언제 트리거되는지 알기

## 현재 겪고 있는 문제

지푸 AI 또는 Z.ai를 사용하여 애플리케이션을 개발 중이지만, 자주 다음 문제을 겪습니다:

- **5시간 Token 할당량**이 얼마나 남았는지 모름
- 할당량을 초과하면 요청이 실패하여 개발 진도에 영향을 줌
- **MCP 월간 할당량**의 구체적인 의미를 명확하지 않음
- 두 플랫폼에 개별적으로 로그인하여 할당량을 확인해야 하여 번거로움

## 언제 이 기능을 사용하나요?

다음 경우에:

- 지푸 AI / Z.ai의 API를 사용하여 애플리케이션 개발
- Token 사용량을 모니터링하여 과도한 사용 방지
- MCP 검색 기능의 월간 할당량을 이해하고 싶을 때
- 지푸 AI와 Z.ai를 동시에 사용하며, 할당량을 통합 관리하고 싶을 때

## 핵심 원리

**지푸 AI**와 **Z.ai**의 할당량 시스템은 두 가지 유형으로 나뉩니다:

| 할당량 유형 | 의미 | 재설정 주기 |
|--- | --- | ---|
| **5시간 Token 할당량** | API 요청의 Token 사용량 제한 | 5시간 자동 재설정 |
| **MCP 월간 할당량** | MCP(Model Context Protocol) 검색 횟수의 월간 제한 | 매월 재설정 |

플러그인은 공식 API를 호출하여 실시간 데이터를 조회하고, **프로그레스 바**와 **백분율**로 남은 할당량을 직관적으로 표시합니다.

::: info MCP란?

**MCP**(Model Context Protocol)은 지푸 AI에서 제공하는 모델 컨텍스트 프로토콜로, AI 모델이 외부 리소스를 검색하고 인용할 수 있게 합니다. MCP 월간 할당량은 매월 수행할 수 있는 검색 횟수를 제한합니다.

:::

## 따라하기

### 1단계: 지푸 AI / Z.ai 계정 설정

**이유**
플러그인은 API Key가 있어야 할당량을 조회할 수 있습니다. 지푸 AI와 Z.ai는 **API Key 인증 방식**을 사용합니다.

**작업**

1. `~/.local/share/opencode/auth.json` 파일을 엽니다

2. 지푸 AI 또는 Z.ai의 API Key 설정을 추가합니다:

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "당신의 지푸 AI API Key"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "당신의 Z.ai API Key"
  }
}
```

**다음과 같이 보여야 합니다**:
- 설정 파일에 `zhipuai-coding-plan` 또는 `zai-coding-plan` 필드가 포함됨
- 각 필드는 `type: "api"`와 `key` 필드가 있음

### 2단계: 할당량 조회

**이유**
공식 API를 호출하여 실시간 할당량 사용 상황을 가져옵니다.

**작업**

OpenCode에서 슬래시 명령어를 실행합니다:

```bash
/mystatus
```

또는 자연어로 질문합니다:

```
내 지푸 AI 할당량을 보여줘
```

**다음과 같이 보여야 합니다**:

```
## 지푸 AI 계정 할당량

Account:        9c89****AQVM (Coding Plan)

5시간 Token 할당량
███████████████████████████ 95% 남음
사용됨: 0.5M / 10.0M
재설정: 4시간 후

MCP 월간 할당량
██████████████████░░░░░░░ 60% 남음
사용됨: 200 / 500
```

### 3단계: 출력 해석

**이유**
각 줄 출력의 의미를 이해해야 효과적으로 할당량을 관리할 수 있습니다.

**작업**

다음 설명에 따라 출력을 확인합니다:

| 출력 필드 | 의미 | 예시 |
|--- | --- | ---|
| **Account** | 마스킹된 API Key와 계정 유형 | `9c89****AQVM (Coding Plan)` |
| **5시간 Token 할당량** | 현재 5시간 주기 내 Token 사용 상황 | 프로그레스 바 + 백분율 |
| **사용됨: X / Y** | 사용된 Token / 총 할당량 | `0.5M / 10.0M` |
| **재설정: X시간 후** | 다음 재설정까지의 카운트다운 | `4시간 후` |
| **MCP 월간 할당량** | 당월 MCP 검색 횟수 사용 상황 | 프로그레스 바 + 백분율 |
| **사용됨: X / Y** | 사용된 횟수 / 총 할당량 | `200 / 500` |

**다음과 같이 보여야 합니다**:
- 5시간 Token 할당량 부분에는 **재설정 시간 카운트다운**이 있음
- MCP 월간 할당량 부분에는 **재설정 시간이 없음**(월간 재설정이므로)
- 사용률이 80%를 초과하면 하단에 **경고 표시**가 나타남

## 체크포인트 ✅

다음 내용을 이해했는지 확인하세요:

- [ ] 5시간 Token 할당량에는 재설정 시간 카운트다운이 있음
- [ ] MCP 월간 할당량은 월간 재설정이며, 카운트다운이 표시되지 않음
- [ ] 사용률이 80%를 초과하면 경고가 표시됨
- [ ] API Key는 마스킹되어 표시됨(앞 4자와 뒤 4자만 표시)

## 일반적인 실수

### ❌ 일반적인 오류 1: 설정 파일에 `type` 필드 누락

**오류 증상**: 조회 시 "설정된 계정을 찾을 수 없습니다" 표시

**원인**: `auth.json`에 `type: "api"` 필드가 없음

**수정**:

```json
// ❌ 오류
{
  "zhipuai-coding-plan": {
    "key": "당신의 API Key"
  }
}

// ✅ 올바름
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "당신의 API Key"
  }
}
```

### ❌ 일반적인 오류 2: API Key 만료 또는 무효

**오류 증상**: "API 요청 실패" 또는 "인증 실패" 표시

**원인**: API Key가 만료되었거나 취소됨

**수정**:
- 지푸 AI / Z.ai 콘솔에 로그인
- API Key를 다시 생성
- `auth.json`의 `key` 필드를 업데이트

### ❌ 일반적인 오류 3: 두 가지 할당량 유형 혼동

**오류 증상**: Token 할당량과 MCP 할당량이 같은 것이라고 생각함

**수정**:
- **Token 할당량**: API 호출의 Token 사용량, 5시간 재설정
- **MCP 할당량**: MCP 검색 횟수, 매월 재설정
- 이는 **두 개의 독립적인 할당량**으로, 서로 영향을 주지 않음

## 이번 수업 요약

이번 수업에서는 opencode-mystatus를 사용하여 지푸 AI와 Z.ai의 할당량을 조회하는 방법을 배웠습니다:

**핵심 개념**:
- 5시간 Token 할당량: API 호출 제한, 재설정 카운트다운 있음
- MCP 월간 할당량: MCP 검색 횟수, 매월 재설정

**작업 단계**:
1. `auth.json`에 `zhipuai-coding-plan` 또는 `zai-coding-plan` 설정
2. `/mystatus` 실행하여 할당량 조회
3. 출력의 프로그레스 바, 사용량, 재설정 시간 해석

**핵심 포인트**:
- 사용률이 80%를 초과하면 경고 표시
- API Key는 자동으로 마스킹 표시
- Token 할당량과 MCP 할당량은 두 개의 독립적인 할당량

## 다음 수업 미리보기

> 다음 수업에서는 **[GitHub Copilot 할당량 조회](../copilot-usage/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - Premium Requests 사용 상황을 보는 방법
> - 다른 구독 유형의 월간 할당량 차이
> - 모델 사용 세부 정보를 해석하는 방법

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 펼치기</strong></summary>

> 업데이트 날짜: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 지푸 AI 할당량 조회 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| Z.ai 할당량 조회 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| 형식화 출력 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| API 엔드포인트 설정 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| ZhipuAuthData 유형 정의 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| 높은 사용률 경고 임계값 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**핵심 상수**:
- `HIGH_USAGE_THRESHOLD = 80`: 사용률이 80%를 초과할 때 경고 표시(`types.ts:111`)

**핵심 함수**:
- `queryZhipuUsage(authData)`: 지푸 AI 계정 할당량 조회(`zhipu.ts:213-217`)
- `queryZaiUsage(authData)`: Z.ai 계정 할당량 조회(`zhipu.ts:224-228`)
- `formatZhipuUsage(data, apiKey, accountLabel)`: 할당량 출력 형식화(`zhipu.ts:115-177`)
- `fetchUsage(apiKey, config)`: 공식 API 호출하여 할당량 데이터 가져오기(`zhipu.ts:81-106`)

**API 엔드포인트**:
- 지푸 AI: `https://bigmodel.cn/api/monitor/usage/quota/limit`(`zhipu.ts:63`)
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit`(`zhipu.ts:64`)

</details>
