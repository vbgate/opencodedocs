---
title: "Thinking 모델 설정 | opencode-antigravity-auth"
sidebarTitle: "AI가 깊게 생각하도록 만들기"
subtitle: "Thinking 모델: Claude와 Gemini 3의 사고 능력"
description: "Claude와 Gemini 3 Thinking 모델을 설정하는 방법을 배웁니다. thinking budget, thinking level, variant 설정 방법을 마스터하세요."
tags:
  - "Thinking 모델"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "variant 설정"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 4
---

# Thinking 모델: Claude와 Gemini 3의 사고 능력

## 학습 후 할 수 있는 것

- Claude Opus 4.5, Sonnet 4.5 Thinking 모델의 thinking budget 설정
- Gemini 3 Pro/Flash의 thinking level 사용 (minimal/low/medium/high)
- OpenCode variant 시스템을 통한 유연한 사고 강도 조절
- interleaved thinking 이해 (도구 호출 시의 사고 메커니즘)
- thinking 블록 보존 전략 (keep_thinking 설정) 마스터

## 현재 직면한 문제

AI 모델이 복잡한 작업에서 더 나은 성과를 내기를 원합니다—예를 들어 다단계 추론, 코드 디버깅 또는 아키텍처 설계. 하지만 다음을 알고 있습니다:

- 일반 모델은 답변 너무 빠르고, 충분히 깊게 생각하지 않음
- Claude 공식적으로 thinking 기능 제한, 접근 어려움
- Gemini 3의 thinking level 설정 불분명
- how much thinking is enough 알 수 없음 (budget 얼마나 설정해야 함)
- thinking 블록 내용 읽을 때 서명 오류 발생

## 이 방법을 사용하는 시점

**적용 가능한 시나리오**:
- 다단계 추론이 필요한 복잡한 문제 (알고리즘 설계, 시스템 아키텍처)
- 신중한 생각이 필요한 코드 리뷰 또는 디버깅
- 심층 분석이 필요한 긴 문서 또는 코드베이스
- 도구 호출이 집중된 작업 (interleaved thinking 필요)

**적용 불가능한 시나리오**:
- 간단한 Q&A (thinking quota 낭비)
- 빠른 프로토타입 검증 (속도 우선)
- 사실 조회 (추론 필요 없음)

## 🎒 시작 전 준비

::: warning 선행 확인

 1. **플러그인 설치 및 인증 완료**: [빠른 설치](../../start/quick-install/) 및 [첫 인증](../../start/first-auth-login/) 참조
  2. **기본 모델 사용법 이해**: [첫 요청](../../start/first-request/) 참조
 3. **사용 가능한 Thinking 모델 확보**: 계정에 Claude Opus 4.5/Sonnet 4.5 Thinking 또는 Gemini 3 Pro/Flash 접근 권한 확인

:::

---

## 핵심 아이디어

### Thinking 모델이란

**Thinking 모델**은 최종 답변 생성 전에 내부 추론(thinking blocks)을 수행합니다. 이 사고 내용은:

- **과금되지 않음**: Thinking tokens는 일반 출력 quota에 포함되지 않음 (구체적인 과금 규칙은 Antigravity 공식 기준)
- **추론 품질 향상**: 더 많은 사고 → 더 정확하고 논리적인 답변
- **시간 소모**: Thinking은 응답 지연을 증가시키지만 더 나은 결과를 가져옴

**핵심 차이점**:

| 일반 모델 | Thinking 모델 |
|---|---|
| 직접 답변 생성 | 먼저 생각 → 그 후 답변 생성 |
| 빠르지만 얕을 수 있음 | 느리지만 더 깊음 |
| 간단한 작업에 적합 | 복잡한 작업에 적합 |

### 두 가지 Thinking 구현

Antigravity Auth 플러그인은 두 가지 Thinking 구현을 지원합니다:

#### Claude Thinking (Opus 4.5, Sonnet 4.5)

- **Token-based budget**: 숫자로 사고량 제어 (예: 8192, 32768)
- **Interleaved thinking**: 도구 호출 전후에 사고 가능
- **Snake_case keys**: `include_thoughts`, `thinking_budget` 사용

#### Gemini 3 Thinking (Pro, Flash)

- **Level-based**: 문자열로 사고 강도 제어 (minimal/low/medium/high)
- **CamelCase keys**: `includeThoughts`, `thinkingLevel` 사용
- **모델 차이**: Flash는 4개 levels 모두 지원, Pro는 low/high만 지원

---

## 따라해보기

### 1단계: Variant를 통해 Thinking 모델 구성

OpenCode의 variant 시스템을 통해 모델 선택기에서 직접 thinking 강도를 선택할 수 있으며, 복잡한 모델명을 기억할 필요가 없습니다.

#### 기존 설정 확인

모델 설정 파일 확인 (보통 `.opencode/models.json` 또는 시스템 설정 디렉토리에 위치):

```bash
## 모델 설정 확인
cat ~/.opencode/models.json
```

#### Claude Thinking 모델 구성

`antigravity-claude-sonnet-4-5-thinking` 또는 `antigravity-claude-opus-4-5-thinking`를 찾아 variants 추가:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "limit": { "context": 200000, "output": 64000 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "medium": { "thinkingConfig": { "thinkingBudget": 16384 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  }
}
```

**설정 설명**:
- `low`: 8192 tokens - 가벼운 사고, 중등 복잡도 작업에 적합
- `medium`: 16384 tokens - 사고와 속도의 균형
- `max`: 32768 tokens - 최대 사고, 가장 복잡한 작업에 적합

#### Gemini 3 Thinking 모델 구성

**Gemini 3 Pro** (low/high만 지원):

```json
{
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro (Antigravity)",
    "limit": { "context": 1048576, "output": 65535 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Gemini 3 Flash** (4개 levels 모두 지원):

```json
{
  "antigravity-gemini-3-flash": {
    "name": "Gemini 3 Flash (Antigravity)",
    "limit": { "context": 1048576, "output": 65536 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "minimal": { "thinkingLevel": "minimal" },
      "low": { "thinkingLevel": "low" },
      "medium": { "thinkingLevel": "medium" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**설정 설명**:
- `minimal`: 최소 사고, 가장 빠른 응답 (Flash만)
- `low`: 가벼운 사고
- `medium`: 균형 잡힌 사고 (Flash만)
- `high`: 최대 사고 (가장 느리지만 가장 깊음)

**보실 것**: OpenCode의 모델 선택기에서 Thinking 모델을 선택하면 variant 드롭다운 메뉴가 표시됩니다.

### 2단계: Thinking 모델로 요청하기

구성이 완료되면 OpenCode를 통해 모델과 variant를 선택할 수 있습니다:

```bash
## Claude Sonnet 4.5 Thinking (max) 사용
opencode run "분산 캐시 시스템의 아키텍처를 설계해줘" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## Gemini 3 Pro (high) 사용
opencode run "이 코드의 성능 병목 현상을 분석해줘" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## Gemini 3 Flash (minimal - 가장 빠름) 사용
opencode run "이 파일의 내용을 빠르게 요약해줘" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**보실 것**: 모델이 먼저 thinking blocks(사고 내용)를 출력한 후 최종 답변을 생성합니다.

### 3단계: Interleaved Thinking 이해하기

Interleaved thinking은 Claude 모델의 특수한 능력입니다—도구 호출 전후에 사고할 수 있습니다.

**시나리오 예시**: AI에게 도구(파일 작업, 데이터베이스 쿼리 등)를 사용하여 작업을 완료하도록 요청할 때:

```
Thinking: 먼저 설정 파일을 읽어야 하고, 그 내용에 따라 다음 단계를 결정해야...

[도구 호출: read_file("config.json")]

도구 결과: { "port": 8080, "mode": "production" }

Thinking: 포트는 8080, 프로덕션 모드. 설정이 올바른지 검증해야...

[도구 호출: validate_config({ "port": 8080, "mode": "production" })]

도구 결과: { "valid": true }

Thinking: 설정이 유효함. 이제 서비스를 시작할 수 있음.

[최종 답변 생성]
```

**중요한 이유**:
- 도구 호출 전후에 모두 사고 → 더 스마트한 의사결정
- 도구 반환 결과에 적응 → 동적으로 전략 조정
- 맹목적 실행 방지 → 오류 동작 감소

::: tip 플러그인 자동 처리

수동으로 interleaved thinking을 구성할 필요가 없습니다. Antigravity Auth 플러그인이 Claude Thinking 모델을 자동 감지하고 다음과 같은 시스템 명령어를 주입합니다:
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### 4단계: 사고 블록 보존 전략 제어하기

기본적으로 플러그인은 안정성 향상을 위해 **사고 블록을 분리**합니다(서명 오류 방지). 사고 내용을 읽으려면 `keep_thinking`을 구성해야 합니다.

#### 기본값이 분리되는 이유는?

**서명 오류 문제**:
- Thinking blocks는 다중 대화에서 서명 일치가 필요
- 모든 사고 블록을 보존하면 서명 충돌 발생 가능
- 사고 블록 분리는 더 안정적인 방식(하지만 사고 내용 손실)

#### 사고 블록 보존 활성화

설정 파일 생성 또는 편집:

**Linux/macOS**: `~/.config/opencode/antigravity.json`

**Windows**: `%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

또는 환경 변수 사용:

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**보실 것**:
- `keep_thinking: false` (기본값): 최종 답변만 보이고 사고 블록은 숨겨짐
- `keep_thinking: true`: 완전한 사고 과정 보임(일부 다중 대화에서 서명 오류 가능)

::: warning 권장 사항

- **프로덕션 환경**: 기본 `keep_thinking: false` 사용, 안정성 보장
- **디버깅/학습**: 일시적으로 `keep_thinking: true` 활성화, 사고 과정 관찰
- **서명 오류 발생 시**: `keep_thinking` 비활성화, 플러그인이 자동 복구

:::

### 5단계: Max Output Tokens 확인하기

Claude Thinking 모델은 더 큰 출력 토큰 제한(maxOutputTokens)이 필요하며, 그렇지 않으면 thinking budget을 완전히 사용할 수 없습니다.

**플러그인 자동 처리**:
- thinking budget을 설정하면 플러그인이 `maxOutputTokens`를 64,000으로 자동 조정
- 소스 위치: `src/plugin/transform/claude.ts:78-90`

**수동 설정 (선택사항)**:

`maxOutputTokens`를 수동으로 설정하는 경우, thinking budget보다 크도록 설정:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // 반드시 >= thinkingBudget
      }
    }
  }
}
```

**보실 것**:
- `maxOutputTokens`가 너무 작으면 플러그인이 64,000으로 자동 조정
- 디버그 로그에 "Adjusted maxOutputTokens for thinking model" 표시

---

## 체크포인트 ✅

구성이 올바른지 검증합니다:

### 1. Variant 가시성 검증

OpenCode에서:

1. 모델 선택기 열기
2. `Claude Sonnet 4.5 Thinking` 선택
3. variant 드롭다운 메뉴(low/medium/max) 확인

**예상 결과**: 3개의 variant 옵션이 표시됨.

### 2. Thinking 내용 출력 검증

```bash
opencode run "3단계로 생각해봐: 1+1=? 왜?" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**예상 결과**:
- `keep_thinking: true`인 경우: 자세한 사고 과정 표시
- `keep_thinking: false` (기본값): 직접 답변 "2" 표시

### 3. Interleaved Thinking 검증 (도구 호출 필요)

```bash
## 도구 호출이 필요한 작업 사용
opencode run "현재 디렉토리의 파일 목록을 읽고, 파일 유형을 요약해줘" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**예상 결과**:
- 도구 호출 전후에 사고 내용 표시
- AI가 도구 반환 결과에 따라 전략 조정

---

## 함정 알림

### ❌ 오류 1: Thinking Budget이 Max Output Tokens 초과

**문제**: `thinkingBudget: 32768` 설정했지만 `maxOutputTokens: 20000`

**오류 메시지**:
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**해결 방법**:
- 플러그인이 자동 처리하도록 함 (권장)
- 또는 수동으로 `maxOutputTokens >= thinkingBudget` 설정

### ❌ 오류 2: Gemini 3 Pro에서 지원되지 않는 level 사용

**문제**: Gemini 3 Pro는 low/high만 지원하지만 `minimal` 사용 시도

**오류 메시지**:
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**해결 방법**: Pro가 지원하는 levels만 사용 (low/high)

### ❌ 오류 3: 다중 대화 서명 오류 (keep_thinking: true)

**문제**: `keep_thinking: true` 활성화 후 다중 대화에서 오류 발생

**오류 메시지**:
```
Signature mismatch in thinking blocks
```

**해결 방법**:
- 임시로 `keep_thinking` 비활성화: `export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- 또는 세션 다시 시작

### ❌ 오류 4: Variant가 표시되지 않음

**문제**: variants를 구성했지만 OpenCode 모델 선택기에서 보이지 않음

**가능한 원인**:
- 설정 파일 경로 오류
- JSON 문법 오류 (쉼표, 따옴표 누락)
- 모델 ID 불일치

**해결 방법**:
1. 설정 파일 경로 확인: `~/.opencode/models.json` 또는 `~/.config/opencode/models.json`
2. JSON 문법 검증: `cat ~/.opencode/models.json | python -m json.tool`
3. 모델 ID가 플러그인이 반환한 것과 일치하는지 확인

---

## 본 강의 요약

Thinking 모델은 내부 추론을 통해 복잡한 작업의 답변 품질을 향상시킵니다:

| 기능 | Claude Thinking | Gemini 3 Thinking |
|---|---|---|
| **설정 방식** | `thinkingBudget` (숫자) | `thinkingLevel` (문자열) |
| **Levels** | 사용자 정의 budget | minimal/low/medium/high |
| **Keys** | snake_case (`include_thoughts`) | camelCase (`includeThoughts`) |
| **Interleaved** | ✅ 지원 | ❌ 지원하지 않음 |
| **Max Output** | 자동 조정至 64,000 | 기본값 사용 |

**핵심 설정**:
- **Variant 시스템**: `thinkingConfig.thinkingBudget` (Claude) 또는 `thinkingLevel` (Gemini 3)을 통해 구성
- **keep_thinking**: 기본값 false (안정성), true (사고 내용 읽기 가능)
- **Interleaved thinking**: 자동 활성화, 수동 구성 불필요

---

## 다음 강의 예고

> 다음 강의에서는 **[Google Search Grounding](../google-search-grounding/)**을 배웁니다.
>
> 배울 내용:
> - Gemini 모델을 위한 Google Search 검색 활성화
> - 동적 검색 임계값 구성
> - 사실 정확성 향상, 할루시네이션 감소

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 번호 |
|---|---|---|
| Claude Thinking 설정 구축 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Gemini 3 Thinking 설정 구축 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Gemini 2.5 Thinking 설정 구축 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Claude Thinking 모델 감지 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Gemini 3 모델 감지 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Interleaved Thinking Hint 주입 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
| Max Output Tokens 자동 조정 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 78-90 |
| keep_thinking 설정 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Claude Thinking 적용 변환 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Gemini Thinking 적용 변환 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**핵심 상수**:
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000`: Claude Thinking 모델의 최대 출력 토큰 수
- `CLAUDE_INTERLEAVED_THINKING_HINT`: 시스템 명령어에 주입되는 interleaved thinking 힌트

**핵심 함수**:
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)`: Claude Thinking 설정 구축 (snake_case keys)
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)`: Gemini 3 Thinking 설정 구축 (level string)
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)`: Gemini 2.5 Thinking 설정 구축 (numeric budget)
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)`: maxOutputTokens가 충분히 큰지 확인
- `appendClaudeThinkingHint(payload, hint)`: interleaved thinking hint 주입
- `isClaudeThinkingModel(model)`: Claude Thinking 모델인지 감지
- `isGemini3Model(model)`: Gemini 3 모델인지 감지

</details>
