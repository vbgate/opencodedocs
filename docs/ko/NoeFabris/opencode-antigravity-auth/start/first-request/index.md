---
title: "첫 번째 요청: Antigravity 설치 확인 | opencode-antigravity-auth"
sidebarTitle: "첫 번째 요청 보내기"
description: "첫 번째 Antigravity 모델 요청을 보내 OAuth 인증과 구성이 올바른지 확인하는 방법을 배웁니다. 모델 선택, variant 매개변수 사용 및 일반적인 오류 해결 방법을 익히세요."
subtitle: "첫 번째 요청: 설치 성공 확인"
tags:
  - "설치 확인"
  - "모델 요청"
  - "빠른 시작"
prerequisite:
  - "start-quick-install"
order: 4
---

# 첫 번째 요청: 설치 성공 확인

## 학습 완료 후 할 수 있는 것

- 첫 번째 Antigravity 모델 요청 보내기
- `--model` 및 `--variant` 매개변수의 역할 이해하기
- 요구사항에 따라 적절한 모델 및 사고 구성 선택하기
- 일반적인 모델 요청 오류 해결하기

## 현재 직면한 문제

플러그인을 방금 설치하고 OAuth 인증을 완료했으며, 모델 정의를 구성했는데 이제는:
- 플러그인이 정말로 정상 작동하는지?
- 테스트를 시작하기 위해 어떤 모델을 사용해야 할지?
- `--variant` 매개변수는 어떻게 사용하는지?
- 요청이 실패하면 어디에서 문제가 발생했는지 어떻게 알지?

## 이 방법을 사용할 때

다음 시나리오에서 본 강좌의 검증 방법을 사용하세요:
- **최초 설치 후** — 인증, 구성, 모델이 모두 정상 작동하는지 확인
- **새 계정 추가 후** — 새 계정을 사용할 수 있는지 검증
- **모델 구성 변경 후** — 새 모델 구성이 올바른지 확인
- **문제 발생 전** — 기준선을 설정하여 후속 비교 용이하게 함

## 🎒 시작 전 준비

::: warning 전제 조건 확인

계속하기 전에 다음을 확인하세요:

- ✅ [빠른 설치](/ko/NoeFabris/opencode-antigravity-auth/start/quick-install/) 완료
- ✅ `opencode auth login` 실행하여 OAuth 인증 완료
- ✅ `~/.config/opencode/opencode.json`에 모델 정의 추가
- ✅ OpenCode 터미널 또는 CLI 사용 가능

:::

## 핵심 개념

### 검증이 필요한 이유

플러그인은 여러 구성 요소의 협업을 포함합니다:
1. **OAuth 인증** — 액세스 토큰 획득
2. **계정 관리** — 사용 가능한 계정 선택
3. **요청 변환** — OpenCode 형식을 Antigravity 형식으로 변환
4. **스트리밍 응답** — SSE 응답 처리 및 OpenCode 형식으로 변환

첫 번째 요청을 보내면 전체 체인이 원활한지 확인할 수 있습니다. 성공하면 모든 구성 요소가 정상 작동함을 의미합니다. 실패하면 오류 정보를 통해 문제를 파악할 수 있습니다.

### Model과 Variant의 관계

Antigravity 플러그인에서 **모델과 variant는 두 개의 독립적인 개념**입니다:

| 개념 | 역할 | 예시 |
|---|---|---|
| **Model(모델)** | 특정 AI 모델 선택 | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant(변형)** | 모델의 사고 예산 또는 모드 구성 | `low`(경량 사고), `max`(최대 사고) |

::: info 사고 예산이란?

사고 예산(thinking budget)은 모델이 답변을 생성하기 전에 "사고"하는 데 사용할 수 있는 토큰 수를 의미합니다. 더 높은 예산은 모델이 더 많은 시간을 추론할 수 있음을 의미하지만 응답 시간과 비용도 증가합니다.

- **Claude Thinking 모델**: `thinkingConfig.thinkingBudget`로 구성(단위: 토큰)
- **Gemini 3 모델**: `thinkingLevel`로 구성(문자열 레벨: minimal/low/medium/high)

:::

### 추천 입문 조합

다양한 요구사항에 따른 추천 모델 및 variant 조합:

| 요구사항 | 모델 | Variant | 특징 |
|---|---|---|---|
| **빠른 테스트** | `antigravity-gemini-3-flash` | `minimal` | 가장 빠른 응답, 검증에 적합 |
| **일상 개발** | `antigravity-claude-sonnet-4-5-thinking` | `low` | 속도와 품질의 균형 |
| **복잡한 추론** | `antigravity-claude-opus-4-5-thinking` | `max` | 가장 강력한 추론 능력 |
| **비전 작업** | `antigravity-gemini-3-pro` | `high` | 멀티모달 지원(이미지/PDF) |

## 따라 해보기

### 1단계: 가장 간단한 테스트 요청 보내기

가장 먼저 기본 연결이 정상적인지 간단한 명령으로 테스트합니다.

**이유**
이 요청은 thinking 기능을 사용하지 않아 매우 빠르게 반환되어 인증과 계정 상태를 빠르게 확인할 수 있습니다.

**실행 명령**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**확인할 사항**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip 성공 표시

AI의 응답이 보인다면 다음을 의미합니다:
- ✅ OAuth 인증 성공
- ✅ 계정에 액세스 권한 있음
- ✅ 요청 변환 정상 작동
- ✅ 스트리밍 응답 올바르게 구문 분석

:::

### 2단계: Thinking 모델과 Variant 사용하기

이제 variant 매개변수를 포함한 완전한 사고 프로세스를 테스트합니다.

**이유**
Thinking 모델은 추가적인 요청 변환 로직이 필요하며, 이는 플러그인의 핵심 기능 중 하나입니다.

**실행 명령**

```bash
opencode run "클로저가 무엇인지 간단한 비유로 설명해줘" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**확인할 사항**

1. **스트리밍 사고 출력**: 모델이 먼저 `<thinking>` 태그로 사고 과정을 출력하는 것을 볼 수 있습니다
2. **사고 과정**: 모델이 응답을 어떻게 구성할지 자세히 분석합니다
3. **최종 답변**: 사고 완료 후 최종 내용을 출력합니다

::: details 전체 응답 예시 보기

```
<thinking>
사용자가 클로저가 무엇인지 간단한 비유로 설명해달라고 했습니다.

클로저 개념:
1. 함수가 외부 스코프의 변수에 접근할 수 있음
2. 외부 함수가 이미 실행을 마쳤어도
3. 이 능력은 "백팩"과 같음

비유 아이디어:
- "백팩" 비유 사용 가능
- 함수가 반환될 때 변수들을 가져감
- 마치 집에서 필요한 것을 챙겨 백팩에 넣고 나가는 것처럼
</thinking>

클로저는 함수의 "백팩"과 같습니다.

함수가 생성될 때, 접근할 수 있는 외부 변수들을 "백팩"에 담습니다. 마치 집에서 필요한 것을 챙겨 백팩에 넣고 나가는 것처럼요. 함수가 생성된 곳을 떠나도(외부 함수 실행 완료) 이 "백팩"을 통해 여전히 그 변수들에 접근할 수 있습니다.

예제:
```javascript
function createCounter() {
  let count = 0;  // 이 변수가 "백팩"에 담김
  return function() {
    count++;  // 백팩의 변수에 여전히 접근 가능
    return count;
  };
}
```
```

:::

**체크포인트 ✅**

- [ ] `<thinking>` 블록 보임(`keep_thinking: true`로 설정된 경우)
- [ ] 응답 내용이 합리적이고 논리적임
- [ ] 응답 시간이 허용 가능한 범위 내(보통 2-10초)

### 3단계: Gemini 3 모델 테스트

Gemini 3 Pro의 다양한 사고 레벨을 테스트합니다.

**이유**
Gemini 3은 문자열 레벨의 `thinkingLevel`을 사용하며, 다양한 모델 제품군 지원을 검증합니다.

**실행 명령**

```bash
# Gemini 3 Flash 테스트(빠른 응답)
opencode run "버블 정렬을 작성해줘" --model=google/antigravity-gemini-3-flash --variant=low

# Gemini 3 Pro 테스트(깊은 사고)
opencode run "버블 정렬의 시간 복잡도 분석" --model=google/antigravity-gemini-3-pro --variant=high
```

**확인할 사항**

- Flash 모델 응답이 더 빠름(간단한 작업에 적합)
- Pro 모델이 더 깊은 사고(복잡한 분석에 적합)
- 두 모델 모두 정상 작동

### 4단계: 멀티모달 기능 테스트(선택사항)

모델 구성이 이미지 입력을 지원하는 경우 멀티모달 기능을 테스트할 수 있습니다.

**이유**
Antigravity는 이미지/PDF 입력을 지원하며, 많은 시나리오에서 필요한 기능입니다.

**테스트 이미지 준비**: 임의의 이미지 파일(예: `test.png`)

**실행 명령**

```bash
opencode run "이 이미지의 내용을 설명해줘" --model=google/antigravity-gemini-3-pro --image=test.png
```

**확인할 사항**

- 모델이 이미지 내용을 정확히 설명함
- 응답에 시각적 분석 결과가 포함됨

## 체크포인트 ✅

위 테스트를 완료한 후 다음 체크리스트를 확인하세요:

| 확인 항목 | 예상 결과 | 상태 |
|---|---|---|
| **기본 연결** | 1단계의 간단한 요청 성공 | ☐ |
| **Thinking 모델** | 2단계에서 사고 과정 확인 | ☐ |
| **Gemini 3 모델** | 3단계에서 두 모델 모두 정상 작동 | ☐ |
| **Variant 매개변수** | 다른 variant가 다른 결과를 생성 | ☐ |
| **스트리밍 출력** | 응답이 실시간으로 표시되고 중단 없음 | ☐ |

::: tip 모두 통과했다면?

모든 확인 항목을 통과했다면 축하합니다! 플러그인이 완전히 구성되어 사용을 시작할 수 있습니다.

다음 단계:
- [사용 가능한 모델 둘러보기](/ko/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [다중 계정 로드 밸런싱 구성](/ko/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [Google 검색 활성화](/ko/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## 문제 해결 팁

### 오류 1: `Model not found`

**오류 메시지**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**원인**
모델 정의가 `opencode.json`의 `provider.google.models`에 올바르게 추가되지 않았습니다.

**해결 방법**

구성 파일을 확인합니다:

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

모델 정의 형식이 올바른지 확인합니다:

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning 철자 주의

모델 이름은 구성 파일의 키와 정확히 일치해야 합니다(대소문자 구분):

- ❌ 오류: `--model=google/claude-sonnet-4-5`
- ✅ 올바름: `--model=google/antigravity-claude-sonnet-4-5`

:::

### 오류 2: `403 Permission Denied`

**오류 메시지**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**원인**
1. OAuth 인증이 완료되지 않음
2. 계정에 액세스 권한 없음
3. Project ID 구성 문제(Gemini CLI 모델의 경우)

**해결 방법**

1. **인증 상태 확인**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   최소한 하나의 계정 레코드가 보여야 합니다.

2. **계정이 비어 있거나 인증에 실패한 경우**:
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **Gemini CLI 모델에서 오류가 발생하는 경우**:
   수동으로 Project ID를 구성해야 합니다(자세한 내용은 [FAQ - 403 Permission Denied](/ko/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/) 참조)

### 오류 3: `Invalid variant 'max'`

**오류 메시지**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**원인**
다른 모델은 다른 variant 구성 형식을 지원합니다.

**해결 방법**

모델 구성에서 variant 정의를 확인합니다:

| 모델 유형 | Variant 형식 | 예시 값 |
|---|---|---|
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**올바른 구성 예시**:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### 오류 4: 요청 시간 초과 또는 응답 없음

**증상**
명령 실행 후 오랫동안 출력이 없거나 최종적으로 시간 초과됨.

**가능한 원인**
1. 네트워크 연결 문제
2. 서버 응답 지연
3. 모든 계정이 속도 제한 상태

**해결 방법**

1. **네트워크 연결 확인**:
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **디버그 로그 보기**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **계정 상태 확인**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   모든 계정에 `rateLimit` 타임스탬프가 표시되면 모두 속도 제한된 것이므로 재설정을 기다려야 합니다.

### 오류 5: SSE 스트리밍 출력 중단

**증상**
응답이 중간에 중지되거나 일부 내용만 표시됨.

**가능한 원인**
1. 네트워크 불안정
2. 요청 중 계정 토큰 만료
3. 서버 오류

**해결 방법**

1. **자세한 정보를 보려면 디버그 로그 활성화**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **로그 파일 확인**:
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **빈번한 중단이 발생하는 경우**:
   - 더 안정적인 네트워크 환경으로 전환해 보세요
   - 요청 시간을 줄이려면 non-Thinking 모델 사용
   - 계정이 할당량 제한에 근접했는지 확인

## 본 강좌 요약

첫 번째 요청을 보내는 것은 설치 성공을 검증하는 핵심 단계입니다. 본 강좌를 통해 다음을 배웠습니다:

- **기본 요청**: `opencode run --model`을 사용하여 요청 보내기
- **Variant 사용**: `--variant`를 통해 사고 예산 구성
- **모델 선택**: 요구사항에 따라 Claude 또는 Gemini 모델 선택
- **문제 해결**: 오류 메시지를 통해 문제 파악 및 해결

::: tip 권장되는 실천

일상적인 개발에서:

1. **간단한 테스트부터**: 구성 변경 후마다 먼저 간단한 요청으로 검증
2. **복잡도 점진적 증가**: no thinking → low thinking → max thinking
3. **기준선 응답 기록**: 정상 상황의 응답 시간을 기억하여 비교에 활용
4. **디버그 로그 활용**: 문제 발생 시 `OPENCODE_ANTIGRAVITY_DEBUG=2` 활성화

---

## 다음 강좌 예고

> 다음 강좌에서는 **[사용 가능한 모델 전체 보기](/ko/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**를 배웁니다.
>
> 배울 내용:
> - 사용 가능한 모든 모델의 전체 목록과 특징
> - Claude와 Gemini 모델 선택 가이드
> - 컨텍스트 제한 및 출력 제한 비교
> - Thinking 모델의 최적 사용 시나리오

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 번호 |
|---|---|---|
| 요청 변환 진입점 | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| 계정 선택 및 토큰 관리 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Claude 모델 변환 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 전체 |
| Gemini 모델 변환 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 전체 |
| 스트리밍 응답 처리 | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | 전체 |
| 디버그 로그 시스템 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 전체 |

**주요 함수**:
- `prepareAntigravityRequest()`: OpenCode 요청을 Antigravity 형식으로 변환(`request.ts`)
- `createStreamingTransformer()`: 스트리밍 응답 변환기 생성(`core/streaming/`)
- `resolveModelWithVariant()`: 모델 및 variant 구성 구문 분석(`transform/model-resolver.ts`)
- `getCurrentOrNextForFamily()`: 요청할 계정 선택(`accounts.ts`)

**구성 예시**:
- 모델 구성 형식: [`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Variant 상세 설명: [`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>
