---
title: "사용 가능한 모델: Claude와 Gemini 설정 가이드 | Antigravity Auth"
sidebarTitle: "AI 모델 선택"
subtitle: "사용 가능한 모든 모델과 변형 설정 이해하기"
description: "Antigravity Auth의 모델 설정을 배워보세요. Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash의 Thinking 변형 사용법을 익혀보세요."
tags:
  - "플랫폼"
  - "모델"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# 사용 가능한 모든 모델과 변형 설정 이해하기

## 학습 완료 후 할 수 있는 것

- Claude와 Gemini 모델 중 가장 적합한 것 선택
- Thinking 모드의 다양한 레벨(low/max 또는 minimal/low/medium/high) 이해
- Antigravity와 Gemini CLI라는 두 개의 독립적인 할당량 풀 이해
- `--variant` 파라미터로 동적으로 생각 예산 조정

## 현재의 곤란한 상황

플러그인을 방금 설치했는데, 긴 모델 이름 목록을 보고 어떤 것을 선택해야 할지 모르겠습니다:
- `antigravity-gemini-3-pro`와 `gemini-3-pro-preview`의 차이는 무엇인가요?
- `--variant=max`는 무엇을 의미하나요? 지정하지 않으면 어떻게 되나요?
- Claude의 thinking 모드와 Gemini의 thinking 모드는 동일한가요?

## 핵심 아이디어

Antigravity Auth는 두 가지 주요 모델 카테고리를 지원하며, 각각은 독립적인 할당량 풀을 가지고 있습니다:

1. **Antigravity 할당량**: Google Antigravity API를 통해 액세스, Claude와 Gemini 3 포함
2. **Gemini CLI 할당량**: Gemini CLI API를 통해 액세스, Gemini 2.5와 Gemini 3 Preview 포함

::: info Variant 시스템
OpenCode의 variant 시스템을 통해 각 thinking 레벨에 대해 개별 모델을 정의할 필요 없이, 런타임에 `--variant` 파라미터를 통해 설정을 지정할 수 있습니다. 이렇게 하면 모델 선택기가 더 간결해지고 설정도 더 유연해집니다.
:::

## Antigravity 할당량 모델

이 모델들은 `antigravity-` 접두사로 액세스되며 Antigravity API의 할당량 풀을 사용합니다.

### Gemini 3 시리즈

#### Gemini 3 Pro

| 모델명 | Variants | Thinking 레벨 | 설명 |
| --- | --- | --- | --- |
| `antigravity-gemini-3-pro` | low, high | low, high | 품질과 속도의 균형 |

**Variant 설정 예시**:

```bash
# 낮은 thinking 레벨 (더 빠름)
opencode run "빠른 답변" --model=google/antigravity-gemini-3-pro --variant=low

# 높은 thinking 레벨 (더 깊음)
opencode run "복잡한 추론" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash

| 모델명 | Variants | Thinking 레벨 | 설명 |
| --- | --- | --- | --- |
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | 초고속 응답, 4가지 thinking 레벨 지원 |

**Variant 설정 예시**:

```bash
# 최소 thinking (가장 빠름)
opencode run "간단한 작업" --model=google/antigravity-gemini-3-flash --variant=minimal

# 균형 thinking (기본값)
opencode run "일반 작업" --model=google/antigravity-gemini-3-flash --variant=medium

# 최대 thinking (가장 깊음)
opencode run "복잡한 분석" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro는 minimal/medium 지원 안 함
`gemini-3-pro`는 `low`와 `high` 두 레벨만 지원합니다. `--variant=minimal`이나 `--variant=medium`을 사용하려고 하면 API에서 오류가 반환됩니다.
:::

### Claude 시리즈

#### Claude Sonnet 4.5 (Non-Thinking)

| 모델명 | Variants | Thinking 예산 | 설명 |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5` | — | — | 표준 모드, 확장 thinking 없음 |

**사용 예시**:

```bash
# 표준 모드
opencode run "일상 대화" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking

| 모델명 | Variants | Thinking 예산 (tokens) | 설명 |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | 균형 모드 |

**Variant 설정 예시**:

```bash
# 가벼운 thinking (더 빠름)
opencode run "빠른 추론" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# 최대 thinking (가장 깊음)
opencode run "심층 분석" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking

| 모델명 | Variants | Thinking 예산 (tokens) | 설명 |
| --- | --- | --- | --- |
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | 가장 강력한 추론 능력 |

**Variant 설정 예시**:

```bash
# 가벼운 thinking
opencode run "고품질 답변" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# 최대 thinking (가장 복잡한 작업에 사용)
opencode run "전문가 수준 분석" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Claude vs Gemini Thinking 모드 차이
- **Claude**는 숫자 기반 thinking budget(tokens)을 사용, 예: 8192, 32768
- **Gemini 3**는 문자열 기반 thinking level(minimal/low/medium/high)을 사용
- 둘 다 답변 전에 추론 과정을 보여주지만, 구성 방식이 다름
:::

## Gemini CLI 할당량 모델

이 모델들은 `antigravity-` 접두사가 없으며 Gemini CLI API의 독립적인 할당량 풀을 사용합니다. Thinking 모드를 지원하지 않습니다.

| 모델명 | 설명 |
| --- | --- |
| `gemini-2.5-flash` | Gemini 2.5 Flash (빠른 응답) |
| `gemini-2.5-pro` | Gemini 2.5 Pro (품질과 속도의 균형) |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview (프리뷰 버전) |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview (프리뷰 버전) |

**사용 예시**:

```bash
# Gemini 2.5 Pro (Thinking 없음)
opencode run "빠른 작업" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview (Thinking 없음)
opencode run "프리뷰 모델 테스트" --model=google/gemini-3-pro-preview
```

::: info Preview 모델
`gemini-3-*-preview` 모델은 Google 공식 프리뷰 버전으로, 불안정하거나 언제든 변경될 수 있습니다. Thinking 기능을 사용하려면 `antigravity-gemini-3-*` 모델을 사용하세요.
:::

## 모델 비교 개요

| 특성 | Claude 4.5 | Gemini 3 | Gemini 2.5 |
| --- | --- | --- | --- |
| **Thinking 지원** | ✅ (thinkingBudget) | ✅ (thinkingLevel) | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **할당량 풀** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **적용 시나리오** | 복잡한 추론, 코딩 | 일반 작업 + 검색 | 빠른 응답, 간단한 작업 |

## 🎯 모델 선택 가이드

### Claude vs Gemini 선택?

- **Claude 선택**: 더 강한 논리적 추론 능력, 더 안정적인 코드 생성 필요 시
- **Gemini 3 선택**: Google Search, 더 빠른 응답 속도 필요 시

### Thinking vs 표준 모드 선택?

- **Thinking 사용**: 복잡한 추론, 다단계 작업, 추론 과정 보기 필요 시
- **표준 모드 사용**: 간단한 Q&A, 빠른 응답, 추론 표시 불필요 시

### 어떤 Thinking 레벨 선택?

| 레벨 | Claude (tokens) | Gemini 3 | 적용 시나리오 |
| --- | --- | --- | --- |
| **minimal** | — | Flash 전용 | 초고속 작업, 번역, 요약 |
| **low** | 8192 | Pro/Flash | 품질과 속도의 균형, 대부분의 작업에 적합 |
| **medium** | — | Flash 전용 | 중간 복잡도 작업 |
| **high/max** | 32768 | Pro/Flash | 가장 복잡한 작업, 시스템 설계, 심층 분석 |

::: tip 권장 설정
- **일상 개발**: `antigravity-claude-sonnet-4-5-thinking --variant=low`
- **복잡한 추론**: `antigravity-claude-opus-4-5-thinking --variant=max`
- **빠른 Q&A + 검색**: `antigravity-gemini-3-flash --variant=low` + Google Search 활성화
:::

## 완전한 설정 예시

다음 설정을 `~/.config/opencode/opencode.json`에 추가하세요:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
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
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details 설정 복사
위 코드 블록 우측 상단의 복사 버튼을 클릭한 후, `~/.config/opencode/opencode.json` 파일에 붙여넣으세요.
:::

## 체크포인트 ✅

모델 선택을 마스터했는지 확인하기 위해 다음 단계를 완료하세요:

- [ ] Antigravity와 Gemini CLI라는 두 개의 독립적인 할당량 풀 이해
- [ ] Claude는 thinkingBudget(tokens)을, Gemini 3은 thinkingLevel(문자열)을 사용함을 알고 있음
- [ ] 작업 복잡도에 따라 적절한 variant 선택 가능
- [ ] `opencode.json`에 완전한 설정 추가 완료

## 강의 요약

Antigravity Auth는 풍부한 모델 선택과 유연한 variant 설정을 제공합니다:

- **Antigravity 할당량**: Thinking 기능이 있는 Claude 4.5와 Gemini 3 지원
- **Gemini CLI 할당량**: Thinking 기능이 없는 Gemini 2.5와 Gemini 3 Preview 지원
- **Variant 시스템**: `--variant` 파라미터로 생각 레벨을 동적으로 조정, 여러 모델을 정의할 필요 없음

모델 선택 시 작업 유형(추론 vs 검색), 복잡도(단순 vs 복잡), 응답 속도 요구사항을 고려하세요.

## 다음 강의 예고

> 다음 강의에서는 **[Thinking 모델 상세](../thinking-models/)**를 배웁니다.
>
> 배울 내용:
> - Claude와 Gemini Thinking 모드의 원리
> - 커스텀 thinking 예산 설정 방법
> - thinking 블록 보존 기법(signature caching)

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 마지막 업데이트: 2026-01-23

| 기능 | 파일 경로 | 라인 |
| --- | --- | ---|
| 모델 파싱과 tier 추출 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Thinking tier 예산 정의 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Gemini 3 thinking 레벨 정의 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| 모델 별칭 매핑 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Variant 설정 파싱 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| 타입 정의 | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**핵심 상수**:
- `THINKING_TIER_BUDGETS`: Claude와 Gemini 2.5의 생각 예산 매핑(low/medium/high → tokens)
- `GEMINI_3_THINKING_LEVELS`: Gemini 3이 지원하는 생각 레벨(minimal/low/medium/high)

**핵심 함수**:
- `resolveModelWithTier(requestedModel)`: 모델 이름과 생각 설정 파싱
- `resolveModelWithVariant(requestedModel, variantConfig)`: variant 설정에서 모델 파싱
- `budgetToGemini3Level(budget)`: 토큰 예산을 Gemini 3 레벨로 매핑

</details>
