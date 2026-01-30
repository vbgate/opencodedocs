---
title: "API 사양: Antigravity 게이트웨이 인터페이스 기술 참조 | antigravity-auth"
sidebarTitle: "API 호출 디버깅"
subtitle: "Antigravity API 사양"
description: "Antigravity API 사양을 학습하고, 통합 게이트웨이 인터페이스의 엔드포인트 구성, OAuth 2.0 인증, 요청/응답 형식, 함수 호출 규칙 및 오류 처리 메커니즘을 마스터하세요."
tags:
  - "API"
  - "사양"
  - "Antigravity"
  - "기술 참조"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity API 사양

> **⚠️ 중요 안내**: 이것은 Antigravity의 **내부 API 사양**이며, 공개 문서가 아닙니다. 이 튜토리얼은 직접 API 테스트를 통해 검증되었으며, API 세부 사항을 깊이 이해해야 하는 개발자를 위한 것입니다.

플러그인만 사용하려면 [빠른 시작](/ko/NoeFabris/opencode-antigravity-auth/start/quick-install/) 및 [구성 가이드](/ko/NoeFabris/opencode-antigravity-auth/advanced/configuration-guide/)를 참조하세요.

---

## 배우면 할 수 있는 것

- Antigravity 통합 게이트웨이 API의 작동 원리 이해
- 요청/응답 형식 및 JSON Schema 제한 사항 마스터
- Thinking 모델 및 함수 호출 구성 방법 파악
- 속도 제한 및 오류 처리 메커니즘 이해
- API 호출 문제 디버깅 능력

---

## Antigravity API 개요

**Antigravity**는 Google의 통합 게이트웨이 API로, Gemini 스타일 인터페이스를 통해 Claude, Gemini 등 여러 AI 모델에 접근하며, 단일 형식과 통합 응답 구조를 제공합니다.

::: info Vertex AI와의 차이점
Antigravity는 Vertex AI의 직접 모델 API가 **아닙니다**. 다음을 제공하는 내부 게이트웨이입니다:
- 단일 API 형식 (모든 모델이 Gemini 스타일)
- 프로젝트 수준 접근 (Google Cloud 인증을 통해)
- 모델 백엔드로의 내부 라우팅 (Claude용 Vertex AI, Gemini용 Gemini API)
- 통합 응답 형식 (`candidates[]` 구조)
:::

**핵심 특성**:

| 특성 | 설명 |
| --- | --- |
| **단일 API 형식** | 모든 모델이 Gemini 스타일의 `contents` 배열 사용 |
| **프로젝트 수준 접근** | 유효한 Google Cloud Project ID 필요 |
| **내부 라우팅** | 올바른 백엔드로 자동 라우팅 (Vertex AI 또는 Gemini API) |
| **통합 응답** | 모든 모델이 `candidates[]` 구조 반환 |
| **Thinking 지원** | Claude 및 Gemini 3가 확장 추론 지원 |

---

## 엔드포인트 및 경로

### API 환경

| 환경 | URL | 상태 | 용도 |
| --- | --- | --- | --- |
| **Daily (Sandbox)** | `https://daily-cloudcode-pa.sandbox.googleapis.com` | ✅ 활성 | 주요 엔드포인트 (CLIProxy와 동일) |
| **Production** | `https://cloudcode-pa.googleapis.com` | ✅ 활성 | Gemini CLI 모델, loadCodeAssist |
| **Autopush (Sandbox)** | `https://autopush-cloudcode-pa.sandbox.googleapis.com` | ❌ 사용 불가 | 폐기됨 |

**소스 코드 위치**: [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43)

### API 경로

| Action | 경로 | 설명 |
| --- | --- | --- |
| 콘텐츠 생성 | `/v1internal:generateContent` | 비스트리밍 요청 |
| 스트리밍 생성 | `/v1internal:streamGenerateContent?alt=sse` | 스트리밍 요청 (SSE) |
| 코드 어시스턴트 로드 | `/v1internal:loadCodeAssist` | 프로젝트 검색 (자동 Project ID 획득) |
| 사용자 온보딩 | `/v1internal:onboardUser` | 사용자 온보딩 (일반적으로 사용하지 않음) |

---

## 인증 방식

### OAuth 2.0 플로우

```
인증 URL: https://accounts.google.com/o/oauth2/auth
토큰 URL: https://oauth2.googleapis.com/token
```

### 필수 Scopes

```http
https://www.googleapis.com/auth/cloud-platform
https://www.googleapis.com/auth/userinfo.email
https://www.googleapis.com/auth/userinfo.profile
https://www.googleapis.com/auth/cclog
https://www.googleapis.com/auth/experimentsandconfigs
```

**소스 코드 위치**: [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20)

### 필수 Headers

#### Antigravity 엔드포인트 (기본)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: antigravity/1.11.5 windows/amd64
X-Goog-Api-Client: google-cloud-sdk vscode_cloudshelleditor/0.1
Client-Metadata: {"ideType":"IDE_UNSPECIFIED","platform":"PLATFORM_UNSPECIFIED","pluginType":"GEMINI"}
```

#### Gemini CLI 엔드포인트 (`:antigravity` 접미사 없는 모델)

```http
Authorization: Bearer {access_token}
Content-Type: application/json
User-Agent: google-api-nodejs-client/9.15.1
X-Goog-Api-Client: gl-node/22.17.0
Client-Metadata: ideType=IDE_UNSPECIFIED,platform=PLATFORM_UNSPECIFIED,pluginType=GEMINI
```

#### 스트리밍 요청 추가 Header

```http
Accept: text/event-stream
```

**소스 코드 위치**: [`src/constants.ts:73-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L83)

---

## 요청 형식

### 기본 구조

```json
{
  "project": "{project_id}",
  "model": "{model_id}",
  "request": {
    "contents": [...],
    "generationConfig": {...},
    "systemInstruction": {...},
    "tools": [...]
  },
  "userAgent": "antigravity",
  "requestId": "{unique_id}"
}
```

### Contents 배열 (필수)

::: warning 중요 제한 사항
**Gemini 스타일 형식**을 사용해야 합니다. Anthropic 스타일의 `messages` 배열은 **지원되지 않습니다**.
:::

**올바른 형식**:

```json
{
  "contents": [
    {
      "role": "user",
      "parts": [
        { "text": "Your message here" }
      ]
    },
    {
      "role": "model",
      "parts": [
        { "text": "Assistant response" }
      ]
    }
  ]
}
```

**Role 값**:
- `user` - 사용자/인간 메시지
- `model` - 모델 응답 (`assistant`가 **아님**)

### Generation Config

```json
{
  "generationConfig": {
    "maxOutputTokens": 1000,
    "temperature": 0.7,
    "topP": 0.95,
    "topK": 40,
    "stopSequences": ["STOP"],
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

| 필드 | 타입 | 설명 |
| --- | --- | --- |
| `maxOutputTokens` | number | 응답 최대 토큰 수 |
| `temperature` | number | 무작위성 (0.0 - 2.0) |
| `topP` | number | nucleus sampling 임계값 |
| `topK` | number | top-K sampling |
| `stopSequences` | string[] | 생성 중지 트리거 단어 |
| `thinkingConfig` | object | 확장 추론 구성 (Thinking 모델) |

### System Instructions

::: warning 형식 제한
System Instruction은 **`parts`를 포함하는 객체여야 합니다**. 순수 문자열은 **사용할 수 없습니다**.
:::

```json
// ✅ 올바름
{
  "systemInstruction": {
    "parts": [
      { "text": "You are a helpful assistant." }
    ]
  }
}

// ❌ 잘못됨 - 400 오류 반환
{
  "systemInstruction": "You are a helpful assistant."
}
```

### Tools / Function Calling

```json
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "get_weather",
          "description": "Get weather for a location",
          "parameters": {
            "type": "object",
            "properties": {
              "location": {
                "type": "string",
                "description": "City name"
              }
            },
            "required": ["location"]
          }
        }
      ]
    }
  ]
}
```

#### Function 명명 규칙

| 규칙 | 설명 |
| --- | --- |
| 첫 문자 | 문자 (a-z, A-Z) 또는 밑줄 (_)이어야 함 |
| 허용 문자 | `a-zA-Z0-9`, 밑줄 (_), 점 (.), 콜론 (:), 하이픈 (-) |
| 최대 길이 | 64자 |
| 허용되지 않음 | 슬래시 (/), 공백, 기타 특수 문자 |

**예시**:
- ✅ `get_weather` - 유효
- ✅ `mcp:mongodb.query` - 유효 (콜론과 점 허용)
- ✅ `read-file` - 유효 (하이픈 허용)
- ❌ `mcp/query` - 무효 (슬래시 허용되지 않음)
- ❌ `123_tool` - 무효 (문자 또는 밑줄로 시작해야 함)

---

## JSON Schema 지원

### 지원되는 기능

| 기능 | 상태 | 설명 |
| --- | --- | --- |
| `type` | ✅ 지원 | `object`, `string`, `number`, `integer`, `boolean`, `array` |
| `properties` | ✅ 지원 | 객체 속성 |
| `required` | ✅ 지원 | 필수 필드 배열 |
| `description` | ✅ 지원 | 필드 설명 |
| `enum` | ✅ 지원 | 열거형 값 |
| `items` | ✅ 지원 | 배열 요소 schema |
| `anyOf` | ✅ 지원 | 내부적으로 `any_of`로 변환 |
| `allOf` | ✅ 지원 | 내부적으로 `all_of`로 변환 |
| `oneOf` | ✅ 지원 | 내부적으로 `one_of`로 변환 |
| `additionalProperties` | ✅ 지원 | 추가 속성 schema |

### 지원되지 않는 기능 (400 오류 발생)

::: danger 다음 필드는 400 오류를 발생시킵니다
- `const` - `enum: [value]`로 대체
- `$ref` - schema 정의를 인라인으로 작성
- `$defs` / `definitions` - 정의를 인라인으로 작성
- `$schema` - 이 메타데이터 필드 삭제
- `$id` - 이 메타데이터 필드 삭제
- `default` - 이 문서 필드 삭제
- `examples` - 이 문서 필드 삭제
- `title` (중첩) - ⚠️ 중첩 객체에서 문제 발생 가능
:::

```json
// ❌ 잘못됨 - 400 오류 반환
{ "type": { "const": "email" } }

// ✅ 올바름 - enum 사용
{ "type": { "enum": ["email"] } }
```

**플러그인 자동 처리**: 플러그인은 `request-helpers.ts`의 `cleanJSONSchemaForAntigravity()` 함수를 통해 이러한 변환을 자동으로 처리합니다.

---

## 응답 형식

### 비스트리밍 응답

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            { "text": "Response text here" }
          ]
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": 16,
      "candidatesTokenCount": 4,
      "totalTokenCount": 20
    },
    "modelVersion": "claude-sonnet-4-5",
    "responseId": "msg_vrtx_..."
  },
  "traceId": "abc123..."
}
```

### 스트리밍 응답 (SSE)

**Content-Type**: `text/event-stream`

```
data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": "Hello"}]}}], "usageMetadata": {...}, "modelVersion": "...", "responseId": "..."}, "traceId": "..."}

data: {"response": {"candidates": [{"content": {"role": "model", "parts": [{"text": " world"}]}, "finishReason": "STOP"}], "usageMetadata": {...}}, "traceId": "..."}
```

### 응답 필드 설명

| 필드 | 설명 |
| --- | --- |
| `response.candidates` | 응답 후보 배열 |
| `response.candidates[].content.role` | 항상 `"model"` |
| `response.candidates[].content.parts` | 콘텐츠 부분 배열 |
| `response.candidates[].finishReason` | `STOP`, `MAX_TOKENS`, `OTHER` |
| `response.usageMetadata.promptTokenCount` | 입력 토큰 수 |
| `response.usageMetadata.candidatesTokenCount` | 출력 토큰 수 |
| `response.usageMetadata.totalTokenCount` | 총 토큰 수 |
| `response.usageMetadata.thoughtsTokenCount` | Thinking 토큰 수 (Gemini) |
| `response.modelVersion` | 실제 사용된 모델 |
| `response.responseId` | 요청 ID (모델에 따라 형식이 다름) |
| `traceId` | 디버깅용 추적 ID |

### Response ID 형식

| 모델 타입 | 형식 | 예시 |
| --- | --- | --- |
| Claude | `msg_vrtx_...` | `msg_vrtx_01UDKZG8PWPj9mjajje8d7u7` |
| Gemini | Base64 스타일 | `ypM9abPqFKWl0-kPvamgqQw` |
| GPT-OSS | Base64 스타일 | `y5M9aZaSKq6z2roPoJ7pEA` |

---

## Function Call 응답

모델이 함수를 호출하려고 할 때:

```json
{
  "response": {
    "candidates": [
      {
        "content": {
          "role": "model",
          "parts": [
            {
              "functionCall": {
                "name": "get_weather",
                "args": {
                  "location": "Paris"
                },
                "id": "toolu_vrtx_01PDbPTJgBJ3AJ8BCnSXvUqk"
              }
            }
          ]
        },
        "finishReason": "OTHER"
      }
    ]
  }
}
```

### Function 결과 제공

```json
{
  "contents": [
    { "role": "user", "parts": [{ "text": "What's the weather?" }] },
    { "role": "model", "parts": [{ "functionCall": { "name": "get_weather", "args": {...}, "id": "..." } }] },
    { "role": "user", "parts": [{ "functionResponse": { "name": "get_weather", "id": "...", "response": { "temperature": "22C" } } }] }
  ]
}
```

---

## Thinking / 확장 추론

### Thinking 구성

Thinking을 지원하는 모델 (`*-thinking`)의 경우:

```json
{
  "generationConfig": {
    "maxOutputTokens": 10000,
    "thinkingConfig": {
      "thinkingBudget": 8000,
      "includeThoughts": true
    }
  }
}
```

::: warning 중요 제한 사항
`maxOutputTokens`는 `thinkingBudget`보다 **커야 합니다**
:::

### Thinking 응답 (Gemini)

Gemini 모델은 서명이 포함된 thinking을 반환합니다:

```json
{
  "parts": [
    {
      "thoughtSignature": "ErADCq0DAXLI2nx...",
      "text": "Let me think about this..."
    },
    {
      "text": "The answer is..."
    }
  ]
}
```

### Thinking 응답 (Claude)

Claude thinking 모델은 `thought: true` 부분을 포함할 수 있습니다:

```json
{
  "parts": [
    {
      "thought": true,
      "text": "Reasoning process...",
      "thoughtSignature": "..."
    },
    {
      "text": "Final answer..."
    }
  ]
}
```

**플러그인 처리**: 플러그인은 thinking 서명을 자동으로 캐시하여 다중 턴 대화에서 서명 오류를 방지합니다. 자세한 내용은 [advanced/session-recovery/](/ko/NoeFabris/opencode-antigravity-auth/advanced/session-recovery/)를 참조하세요.

---

## 오류 응답

### 오류 구조

```json
{
  "error": {
    "code": 400,
    "message": "Error description",
    "status": "INVALID_ARGUMENT",
    "details": [...]
  }
}
```

### 일반적인 오류 코드

| Code | Status | 설명 |
| --- | --- | --- |
| 400 | `INVALID_ARGUMENT` | 잘못된 요청 형식 |
| 401 | `UNAUTHENTICATED` | 유효하지 않거나 만료된 토큰 |
| 403 | `PERMISSION_DENIED` | 리소스 접근 권한 없음 |
| 404 | `NOT_FOUND` | 모델을 찾을 수 없음 |
| 429 | `RESOURCE_EXHAUSTED` | 속도 제한 초과 |

### 속도 제한 응답

```json
{
  "error": {
    "code": 429,
    "message": "You have exhausted your capacity on this model. Your quota will reset after 3s.",
    "status": "RESOURCE_EXHAUSTED",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.RetryInfo",
        "retryDelay": "3.957525076s"
      }
    ]
  }
}
```

**플러그인 처리**: 플러그인은 429 오류를 자동으로 감지하고 계정을 전환하거나 리셋 시간을 기다립니다. 자세한 내용은 [advanced/rate-limit-handling/](/ko/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)을 참조하세요.

---

## 지원되지 않는 기능

다음 Anthropic/Vertex AI 기능은 **지원되지 않습니다**:

| 기능 | 오류 |
| --- | --- |
| `anthropic_version` | Unknown field |
| `messages` 배열 | Unknown field (`contents` 사용 필수) |
| `max_tokens` | Unknown field (`maxOutputTokens` 사용 필수) |
| 순수 문자열 `systemInstruction` | Invalid value (객체 형식 사용 필수) |
| `system_instruction` (루트 레벨 snake_case) | Unknown field |
| JSON Schema `const` | Unknown field (`enum: [value]`로 대체) |
| JSON Schema `$ref` | 지원되지 않음 (인라인 정의) |
| JSON Schema `$defs` | 지원되지 않음 (인라인 정의) |
| Tool 이름에 `/` 포함 | Invalid (`_` 또는 `:`로 대체) |
| Tool 이름이 숫자로 시작 | Invalid (문자 또는 밑줄로 시작해야 함) |

---

## 전체 요청 예시

```json
{
  "project": "my-project-id",
  "model": "claude-sonnet-4-5",
  "request": {
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Hello, how are you?" }
        ]
      }
    ],
    "systemInstruction": {
      "parts": [
        { "text": "You are a helpful assistant." }
      ]
    },
    "generationConfig": {
      "maxOutputTokens": 1000,
      "temperature": 0.7
    }
  },
  "userAgent": "antigravity",
  "requestId": "agent-abc123"
}
```

---

## 응답 Headers

| Header | 설명 |
| --- | --- |
| `x-cloudaicompanion-trace-id` | 디버깅용 추적 ID |
| `server-timing` | 요청 지속 시간 |

---

## Antigravity vs Vertex AI Anthropic 비교

| 특성 | Antigravity | Vertex AI Anthropic |
| --- | --- | --- |
| 엔드포인트 | `cloudcode-pa.googleapis.com` | `aiplatform.googleapis.com` |
| 요청 형식 | Gemini 스타일 `contents` | Anthropic `messages` |
| `anthropic_version` | 사용하지 않음 | 필수 |
| 모델 이름 | 단순 (`claude-sonnet-4-5`) | 버전화 (`claude-4-5@date`) |
| 응답 형식 | `candidates[]` | Anthropic `content[]` |
| 다중 모델 지원 | 예 (Claude, Gemini 등) | Anthropic만 |

---

## 이번 강의 요약

이 튜토리얼에서는 Antigravity 통합 게이트웨이 API의 내부 사양을 자세히 설명했습니다:

- **엔드포인트**: 세 가지 환경 (Daily, Production, Autopush), Daily Sandbox가 주요 엔드포인트
- **인증**: OAuth 2.0 + Bearer Token, 필수 scopes 및 headers
- **요청 형식**: Gemini 스타일의 `contents` 배열, System Instruction 및 Tools 지원
- **JSON Schema**: 일반적인 기능 지원, 단 `const`, `$ref`, `$defs`는 지원되지 않음
- **응답 형식**: `candidates[]` 구조, 스트리밍 SSE 지원
- **Thinking**: Claude 및 Gemini 3가 확장 추론 지원, `thinkingConfig` 필요
- **오류 처리**: 표준 오류 형식, 429에 재시도 지연 포함

API 호출 문제를 디버깅하려면 플러그인의 디버그 모드를 사용할 수 있습니다:

```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode
```

---

## 다음 강의 예고

> 이것은 마지막 부록 섹션입니다. 더 많은 기술 세부 사항을 알고 싶다면 다음을 참조하세요:
> - [아키텍처 개요](/ko/NoeFabris/opencode-antigravity-auth/appendix/architecture-overview/) - 플러그인의 모듈 아키텍처 및 호출 체인 이해
> - [저장 형식](/ko/NoeFabris/opencode-antigravity-auth/appendix/storage-schema/) - 계정 저장 파일 형식 이해
> - [구성 옵션](/ko/NoeFabris/opencode-antigravity-auth/appendix/all-config-options/) - 모든 구성 옵션의 완전한 참조 매뉴얼

시작 단계로 돌아가려면 [Antigravity Auth란 무엇인가](/ko/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/)에서 다시 시작할 수 있습니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| API 엔드포인트 상수 | [`src/constants.ts:32-43`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L32-L43) | 32-43 |
| Antigravity Headers | [`src/constants.ts:73-77`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L73-L77) | 73-77 |
| Gemini CLI Headers | [`src/constants.ts:79-83`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L79-L83) | 79-83 |
| OAuth Scopes | [`src/constants.ts:14-20`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/constants.ts#L14-L20) | 14-20 |
| 요청 변환 메인 로직 | [`src/plugin/request.ts:1`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts#L1) | 1-2000+ |
| JSON Schema 정리 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 전체 파일 |
| 사고 서명 캐시 | [`src/plugin/cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache.ts) | 전체 파일 |

**주요 상수**:
- `ANTIGRAVITY_ENDPOINT_DAILY = "https://daily-cloudcode-pa.sandbox.googleapis.com"` - Daily Sandbox 엔드포인트
- `ANTIGRAVITY_ENDPOINT_PROD = "https://cloudcode-pa.googleapis.com"` - Production 엔드포인트
- `ANTIGRAVITY_DEFAULT_PROJECT_ID = "rising-fact-p41fc"` - 기본 프로젝트 ID
- `SKIP_THOUGHT_SIGNATURE = "skip_thought_signature_validator"` - 사고 서명 검증 건너뛰기 센티넬 값

**주요 함수**:
- `cleanJSONSchemaForAntigravity(schema)` - Antigravity API 요구 사항에 맞게 JSON Schema 정리
- `prepareAntigravityRequest(request)` - Antigravity API 요청 준비 및 전송
- `createStreamingTransformer()` - 스트리밍 응답 변환기 생성

</details>
