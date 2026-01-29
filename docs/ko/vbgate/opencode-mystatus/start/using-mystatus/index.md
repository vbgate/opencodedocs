---
title: "사용법: 슬래시 명령어와 자연어 | opencode-mystatus"
sidebarTitle: "사용 방법"
subtitle: "사용법: 슬래시 명령어와 자연어"
description: "opencode-mystatus의 두 가지 사용 방법을 학습합니다. 슬래시 명령어 /mystatus와 자연어 질문으로 AI 플랫폼 할당량을 빠르게 조회할 수 있습니다."
tags:
  - "빠른 시작"
  - "슬래시 명령어"
  - "자연어"
prerequisite:
  - "start-quick-start"
order: 2
---
# mystatus 사용하기: 슬래시 명령어와 자연어

## 학습 후 할 수 있는 것

- `/mystatus` 슬래시 명령어를 사용하여 모든 AI 플랫폼 할당량을 일괄 조회
- 자연어 질문으로 OpenCode가 자동으로 mystatus 도구를 호출하도록 하기
- 슬래시 명령어와 자연어 두 가지 트리거 방식의 차이점과 사용 시나리오 이해

## 현재 겪고 있는 문제

여러 AI 플랫폼(OpenAI, 지푸 AI, GitHub Copilot 등)을 사용하여 개발 중이며, 각 플랫폼의 남은 할당량을 알고 싶지만, 각 플랫폼에 개별적으로 로그인하여 확인하는 것은 너무 번거롭습니다.

## 언제 이 기능을 사용하나요?

- **모든 플랫폼 할당량을 빠르게 확인해야 할 때**: 매일 개발 전에 확인하여 합리적으로 사용 계획
- **특정 플랫폼의 구체적인 할당량을 알고 싶을 때**: 예를 들어 OpenAI가 거의 다 사용되었는지 확인
- **설정이 효과적인지 확인하고 싶을 때**: 새 계정을 설정한 후, 정상적으로 조회할 수 있는지 확인

::: info 사전 확인

이 튜토리얼에서는 이미 [opencode-mystatus 플러그인 설치](/ko/vbgate/opencode-mystatus/start/quick-start/)를 완료했다고 가정합니다. 아직 설치하지 않았다면 먼저 설치 단계를 완료하세요.

:::

## 핵심 원리

opencode-mystatus는 mystatus 도구를 트리거하는 두 가지 방법을 제공합니다:

1. **슬래시 명령어 `/mystatus`**: 빠르고, 직접적이며, 명확하여 자주 조회에 적합
2. **자연어 질문**: 더 유연하여 구체적인 시나리오와 결합된 조회에 적합

두 방법 모두 동일한 `mystatus` 도구를 호출하며, 도구는 모든 설정된 AI 플랫폼 할당량을 병렬로 조회하고, 프로그레스 바, 사용 통계 및 재설정 카운트다운이 포함된 결과를 반환합니다.

## 따라하기

### 1단계: 슬래시 명령어로 할당량 조회

OpenCode에서 다음 명령어를 입력하세요:

```bash
/mystatus
```

**이유**
슬래시 명령어는 OpenCode의 빠른 명령어 메커니즘으로, 미리 정의된 도구를 빠르게 호출할 수 있습니다. `/mystatus` 명령어는 mystatus 도구를 직접 호출하며, 추가 매개변수가 필요 없습니다.

**다음과 같이 보여야 합니다**:
OpenCode는 모든 설정된 플랫폼의 할당량 정보를 반환합니다. 형식은 다음과 같습니다:

```
## OpenAI 계정 할당량

Account:        user@example.com (team)

3시간 할당량
███████████████████████████ 85% 남음
재설정: 2h 30m 후

## 지푸 AI 계정 할당량

Account:        9c89****AQVM (Coding Plan)

5시간 token 할당량
███████████████████████████ 95% 남음
사용됨: 0.5M / 10.0M
재설정: 4h 후
```

각 플랫폼은 다음을 표시합니다:
- 계정 정보(이메일 또는 마스킹된 API Key)
- 프로그레스 바(남은 할당량 시각화)
- 재설정 시간 카운트다운
- 사용량 및 총 사용량(일부 플랫폼)

### 2단계: 자연어로 질문

슬래시 명령어 외에도 자연어로 질문할 수 있으며, OpenCode는 의도를 자동으로 인식하고 mystatus 도구를 호출합니다.

다음과 같은 질문 방식을 시도해 보세요:

```bash
Check my OpenAI quota
```

또는

```bash
How much Codex quota do I have left?
```

또는

```bash
Show my AI account status
```

**이유**
자연어 조회는 일상 대화 습관에 더 가깝고, 구체적인 개발 시나리오에서 질문하기에 적합합니다. OpenCode는 의미 매칭을 통해 할당량을 조회하려는 의도를 인식하고, mystatus 도구를 자동으로 호출합니다.

**다음과 같이 보여야 합니다**:
슬래시 명령어와 동일한 출력 결과이나, 트리거 방식만 다릅니다.

### 3단계: 슬래시 명령어 설정 이해

슬래시 명령어 `/mystatus`는 어떻게 작동하나요? 이는 OpenCode 설정 파일에서 정의됩니다.

`~/.config/opencode/opencode.json`을 열고, `command` 부분을 찾으세요:

```json
{
  "plugin": ["opencode-mystatus"],
  "command": {
    "mystatus": {
      "description": "Query quota usage for all AI accounts",
      "template": "Use the mystatus tool to query quota usage. Return the result as-is without modification."
    }
  }
}
```

**핵심 설정 항목 설명**:

| 설정 항목 | 값 | 역할 |
|--- | --- | ---|
| `description` | "Query quota usage for all AI accounts" | 명령어 목록에 표시되는 설명 |
| `template` | "Use to mystatus tool..." | OpenCode가 이 명령어를 처리하는 방법 안내 |

**template가 필요한 이유**
template는 OpenCode에 대한 "지시"로, 사용자가 `/mystatus`를 입력할 때 mystatus 도구를 호출하고, 결과를 그대로 반환한다는 것(수정하지 않음)을 알립니다.

## 체크포인트 ✅

두 가지 사용 방법을 마스터했는지 확인하세요:

| 기술 | 확인 방법 | 예상 결과 |
|--- | --- | ---|
| 슬래시 명령어 조회 | `/mystatus` 입력 | 모든 플랫폼의 할당량 정보 표시 |
| 자연어 조회 | "Check my OpenAI quota" 입력 | 할당량 정보 표시 |
| 설정 이해 | opencode.json 확인 | mystatus 명령어 설정 찾기 |

## 일반적인 실수

### 일반적인 오류 1: 슬래시 명령어가 응답하지 않음

**증상**: `/mystatus` 입력 후 아무 응답이 없음

**원인**: OpenCode 설정 파일에 슬래시 명령어가 올바르게 설정되지 않음

**해결 방법**:
1. `~/.config/opencode/opencode.json` 열기
2. `command` 부분에 `mystatus` 설정이 포함되어 있는지 확인(3단계 참조)
3. OpenCode 재시작

### 일반적인 오류 2: 자연어 질문이 mystatus 도구를 트리거하지 않음

**증상**: "Check my OpenAI quota" 입력 후, OpenCode가 mystatus 도구를 호출하지 않고 스스로 답변을 시도함

**원인**: OpenCode가 의도를 올바르게 인식하지 못함

**해결 방법**:
1. 더 명확한 표현을 시도: "Use mystatus tool to check my OpenAI quota"
2. 또는 직접 슬래시 명령어 `/mystatus`를 사용하여 더 신뢰성 확보

### 일반적인 오류 3: "설정된 계정을 찾을 수 없습니다" 표시

**증상**: `/mystatus` 실행 후 "설정된 계정을 찾을 수 없습니다" 표시

**원인**: 아직 플랫폼 인증 정보가 설정되지 않음

**해결 방법**:
- 최소 하나의 플랫폼 인증 정보를 설정하세요(OpenAI, 지푸 AI, Z.ai, GitHub Copilot 또는 Google Cloud)
- 자세한 내용은 [빠른 시작 튜토리얼](/ko/vbgate/opencode-mystatus/start/quick-start/)의 설정 설명을 참조하세요

## 이번 수업 요약

mystatus 도구는 두 가지 사용 방법을 제공합니다:
1. **슬래시 명령어 `/mystatus`**: 빠르고 직접적이며, 자주 조회에 적합
2. **자연어 질문**: 더 유연하며, 구체적인 시나리오와 결합에 적합

두 방법 모두 모든 설정된 AI 플랫폼 할당량을 병렬로 조회하고, 프로그레스 바 및 재설정 카운트다운이 포함된 결과를 반환합니다. 슬래시 명령어 설정은 `~/.config/opencode/opencode.json`에 정의되며, template를 통해 OpenCode가 mystatus 도구를 호출하는 방법을 안내합니다.

## 다음 수업 미리보기

> 다음 수업에서는 **[출력 해석하기: 프로그레스 바, 재설정 시간 및 다중 계정](/ko/vbgate/opencode-mystatus/start/understanding-output/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - 프로그레스 바의 의미를 해석하는 방법
> - 재설정 시간 카운트다운이 어떻게 계산되는지
> - 다중 계정 시나리오에서의 출력 형식
> - 프로그레스 바 생성 원리

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 펼치기</strong></summary>

> 업데이트 날짜:2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| mystatus 도구 정의 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 29-33 |
| 도구 설명 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 30-31 |
| 슬래시 명령어 설정 | [`command/mystatus.md`](https://github.com/vbgate/opencode-mystatus/blob/main/command/mystatus.md) | 1-6 |
| 모든 플랫폼 병렬 조회 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 49-56 |
| 결과 수집 및 요약 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts) | 58-89 |

**핵심 상수**:
없음(이 섹션은 주로 호출 방법을 소개하며, 구체적인 상수는 관여하지 않음)

**핵심 함수**:
- `mystatus()`: mystatus 도구의 메인 함수, 인증 파일을 읽고 모든 플랫폼을 병렬로 조회(`plugin/mystatus.ts:29-33`)
- `collectResult()`: 조회 결과를 results 및 errors 배열에 수집(`plugin/mystatus.ts:100-116`)

</details>
