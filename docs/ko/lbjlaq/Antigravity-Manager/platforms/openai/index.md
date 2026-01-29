---
title: "OpenAI API: 연결 구성 | Antigravity-Manager"
sidebarTitle: "5분에 OpenAI SDK 연결"
subtitle: "OpenAI API: 연결 구성"
description: "OpenAI 호환 API의 연결 구성을 학습합니다. 라우팅 변환, base_url 설정 및 401/404/429 문제 해결을 마스터하여 Antigravity Tools를 빠르게 사용합니다."
tags:
  - "OpenAI"
  - "API 프록시"
  - "Chat Completions"
  - "Responses"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 1
---

# OpenAI 호환 API: /v1/chat/completions 및 /v1/responses의 구현 전략

이 **OpenAI 호환 API**를 사용하여 기존 OpenAI SDK/클라이언트를 Antigravity Tools 로컬 게이트웨이에 직접 연결합니다. `/v1/chat/completions` 및 `/v1/responses`를 실행하고 응답 헤더로 빠르게 문제를 해결하는 방법을 학습합니다.

## 학습 후 할 수 있는 것

- OpenAI SDK(또는 curl)로 Antigravity Tools 로컬 게이트웨이에 직접 연결
- `/v1/chat/completions`(`stream: true` 포함) 및 `/v1/responses` 실행
- `/v1/models`의 모델 목록 및 응답 헤더의 `X-Mapped-Model` 이해
- 401/404/429 발생 시 먼저 어디를 확인해야 할지 알기

## 현재 직면한 문제

많은 클라이언트/SDK는 OpenAI 인터페이스 형태만 인식합니다: 고정된 URL, 고정된 JSON 필드, 고정된 SSE 스트리밍 형식.
Antigravity Tools의 목표는 클라이언트를 변경하는 것이 아니라 클라이언트가 "OpenAI를 호출하고 있다고 생각"하게 만드는 것입니다. 실제로는 요청을 내부 업스트림 호출로 변환한 다음 결과를 다시 OpenAI 형식으로 변환하여 기존 OpenAI SDK가 기본적으로 변경 없이 사용할 수 있습니다.

## 이 방법을 사용하는 경우

- 이미 OpenAI만 지원하는 도구(IDE 플러그인, 스크립트, Bot, SDK)가 많으며 각각 새로운 통합을 작성하고 싶지 않음
- `base_url`로 요청을 로컬(또는 LAN) 게이트웨이로 통일하여 게이트웨이가 계정 스케줄링, 재시작 및 모니터링을 수행하도록 하고 싶음

## 🎒 시작 전 준비

::: warning 전제 조건
- 이미 Antigravity Tools의 "API Proxy" 페이지에서 리버스 프록시 서비스를 시작했고 포트를 기록했습니다(예: `8045`)
- 이미 최소 1개의 사용 가능한 계정을 추가했습니다. 그렇지 않으면 리버스 프록시가 업스트림 토큰을 가져올 수 없음
:::

::: info 인증은 어떻게 전달합니까?
`proxy.auth_mode`를 활성화하고 `proxy.api_key`를 구성한 경우 요청에 API Key를 휴대해야 합니다.

Antigravity Tools의 미들웨어는 `Authorization`을 우선 읽으며 `x-api-key`, `x-goog-api-key`도 호환합니다(구현은 `src-tauri/src/proxy/middleware/auth.rs` 참조).
:::

## OpenAI 호환 API란?

**OpenAI 호환 API**는 "OpenAI처럼 보이는" HTTP 라우트 및 JSON/SSE 프로토콜 세트입니다. 클라이언트는 OpenAI 요청 형식으로 로컬 게이트웨이에 요청을 전송하고 게이트웨이는 요청을 내부 업스트림 호출로 변환한 다음 업스트림 응답을 OpenAI 응답 구조로 변환하여 기존 OpenAI SDK가 기본적으로 변경 없이 사용할 수 있습니다.

### 호환 엔드포인트 개요(이 수업 관련)

| 엔드포인트 | 용도 | 코드 증거 |
| --- | --- | --- |
| `POST /v1/chat/completions` | Chat Completions(스트리밍 포함) | `src-tauri/src/proxy/server.rs` 라우팅 등록; `src-tauri/src/proxy/handlers/openai.rs` |
| `POST /v1/completions` | 레거시 Completions(동일 핸들러 재사용) | `src-tauri/src/proxy/server.rs` 라우팅 등록 |
| `POST /v1/responses` | Responses/Codex CLI 호환(동일 핸들러 재사용) | `src-tauri/src/proxy/server.rs` 라우팅 등록(주석: Codex CLI 호환) |
| `GET /v1/models` | 모델 목록 반환(사용자 정의 매핑 + 동적 생성 포함) | `src-tauri/src/proxy/handlers/openai.rs` + `src-tauri/src/proxy/common/model_mapping.rs` |

## 따라 해 보기

### 1단계: curl로 서비스 활성 상태 확인(/healthz + /v1/models)

**이유**
"서비스가 시작되지 않음/포트가 잘못됨/방화벽에 차단됨"과 같은 기초 문제를 먼저 제거합니다.

```bash
 # 1) 상태 확인
curl -s http://127.0.0.1:8045/healthz

 # 2) 모델 목록 가져오기
curl -s http://127.0.0.1:8045/v1/models
```

**다음을 보아야 합니다**: `/healthz`는 `{"status":"ok"}`와 유사한 것을 반환; `/v1/models`는 `{"object":"list","data":[...]}`를 반환합니다.

### 2단계: OpenAI Python SDK로 /v1/chat/completions 호출

**이유**
이 단계는 "OpenAI SDK → 로컬 게이트웨이 → 업스트림 → OpenAI 응답 변환" 전체 체인이 통과함을 증명합니다.

```python
import openai

client = openai.OpenAI(
    api_key="sk-antigravity",
    base_url="http://127.0.0.1:8045/v1",
)

response = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "안녕하세요, 자기 소개를 해주세요"}],
)

print(response.choices[0].message.content)
```

**다음을 보아야 합니다**: 터미널이 모델 응답 텍스트를 출력합니다.

### 3단계: stream 열기, SSE 스트리밍 반환 확인

**이유**
많은 클라이언트는 OpenAI의 SSE 프로토콜(`Content-Type: text/event-stream`)을 의존합니다. 이 단계는 스트리밍 체인 및 이벤트 형식이 사용 가능한지 확인합니다.

```bash
curl -N http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "stream": true,
    "messages": [
      {"role": "user", "content": "세 문장으로 로컬 리버스 프록시 게이트웨이가 무엇인지 설명해주세요"}
    ]
  }'
```

**다음을 보아야 합니다**: 터미널이 계속 `data: { ... }`로 시작하는 줄을 출력하고 `data: [DONE]`으로 끝납니다.

### 4단계: /v1/responses로 요청 실행(Codex/Responses 스타일)

**이유**
일부 도구는 `/v1/responses`를 사용하거나 요청 본문에 `instructions`, `input` 등 필드를 사용합니다. 이 프로젝트는 이러한 요청을 `messages`로 "표준화"한 다음 동일한 변환 로직을 재사용합니다(핸들러는 `src-tauri/src/proxy/handlers/openai.rs` 참조).

```bash
curl -s http://127.0.0.1:8045/v1/responses \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemini-3-flash",
    "instructions": "당신은 엄격한 코드 검토원입니다.",
    "input": "다음 코드에서 가장 가능한 버그를 지적해 주세요:\n\nfunction add(a, b) { return a - b }"
  }'
```

**다음을 보아야 합니다**: 반환 본문은 OpenAI 스타일의 응답 객체입니다(이 프로젝트는 Gemini 응답을 OpenAI `choices[].message.content`로 변환함).

### 5단계: 모델 라우팅 활성화 확인(X-Mapped-Model 응답 헤더 보기)

**이유**
클라이언트에서 작성한 `model`은 실제로 호출되는 "물리적 모델"이 아닐 수 있습니다. 게이트웨이는 먼저 모델 매핑(사용자 정의 매핑/와일드카드 포함, [모델 라우팅: 사용자 정의 매핑, 와일드카드 우선순위 및 프리셋 전략](/ko/lbjlaq/Antigravity-Manager/advanced/model-router/) 참조)을 수행하고 최종 결과를 응답 헤더에 넣어 문제 해결에 도움을 줍니다.

```bash
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "안녕하세요"}]
  }'
```

**다음을 보아야 합니다**: 응답 헤더에 `X-Mapped-Model: ...`가 포함되어 있습니다(예: `gemini-2.5-flash`로 매핑됨) 그리고 `X-Account-Email: ...`도 포함될 수 있습니다.

## 체크포인트 ✅

- `GET /healthz`가 `{"status":"ok"}`(또는 등가 JSON)를 반환
- `GET /v1/models`가 `object=list`를 반환하며 `data`는 배열
- `/v1/chat/completions` 비스트리밍 요청이 `choices[0].message.content`를 가져올 수 있음
- `stream: true` 시 SSE를 받으며 `[DONE]`으로 끝남
- `curl -i`로 `X-Mapped-Model` 응답 헤더를 볼 수 있음

## 피해야 할 함정

### 1) Base URL 잘못 작성으로 인한 404(가장 흔함)

- OpenAI SDK 예제에서 `base_url`은 `/v1`로 끝나야 합니다(프로젝트 README의 Python 예제 참조).
- 일부 클라이언트는 "경로를 겹칠" 수 있습니다. 예: README에서 명시적으로 언급한 바와 같이 Kilo Code는 OpenAI 모드에서 `/v1/chat/completions/responses`와 같은 비표준 경로를 조합하여 404를 트리거할 수 있습니다.

### 2) 401: 업스트림이 고장난 것이 아니라 key를 휴대하지 않거나 모드가 잘못됨

인증 전략의 "유효 모드"가 `off`가 아닐 때 미들웨어는 요청 헤더를 검증합니다: `Authorization: Bearer <proxy.api_key>` 또한 `x-api-key`, `x-goog-api-key`도 호환합니다(구현은 `src-tauri/src/proxy/middleware/auth.rs` 참조).

::: tip 인증 모드 알림
`auth_mode = auto`일 때 `allow_lan_access`에 따라 자동으로 결정:
- `allow_lan_access = true` → 유효 모드는 `all_except_health`(`/healthz` 제외 모두 인증 필요)
- `allow_lan_access = false` → 유효 모드는 `off`(로컬 액세스 인증 불필요)
:::

### 3) 429/503/529: 프록시가 재시작 + 계정 순환을 하지만 "풀이 고갈"될 수도 있음

OpenAI 핸들러는 최대 3회 시도(계정 풀 크기 제한 포함)를 내장하며 일부 오류 발생 시 대기/계정 순환 재시작을 수행합니다(구현은 `src-tauri/src/proxy/handlers/openai.rs` 참조).

## 이 수업 요약

- `/v1/chat/completions`는 가장 보편적인 엔트리 포인트이며 `stream: true`는 SSE를 사용합니다
- `/v1/responses` 및 `/v1/completions`는 동일한 호환 핸들러를 사용하며 핵심은 요청을 먼저 `messages`로 표준화하는 것입니다
- `X-Mapped-Model`은 "클라이언트 모델 이름 → 최종 물리적 모델" 매핑 결과를 확인하는 데 도움을 줍니다

## 다음 수업 예고

> 다음 수업에서는 계속해서 **[Anthropic 호환 API: /v1/messages 및 Claude Code의 핵심 계약](/ko/lbjlaq/Antigravity-Manager/platforms/anthropic/)**을 보게 됩니다(해당 장: `platforms-anthropic`).

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| OpenAI 라우팅 등록(/v1/responses 포함) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| Chat Completions 핸들러(Responses 형식 감지 포함) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L70-L462) | 70-462 |
| /v1/completions 및 /v1/responses 핸들러(Codex/Responses 표준화 + 재시작/순환) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L464-L1080) | 464-1080 |
| /v1/models 반환(동적 모델 목록) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L1082-L1102) | 1082-1102 |
| OpenAI 요청 데이터 구조(messages/instructions/input/size/quality) | [`src-tauri/src/proxy/mappers/openai/models.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/models.rs#L7-L38) | 7-38 |
| OpenAI -> Gemini 요청 변환(systemInstruction/thinkingConfig/tools) | [`src-tauri/src/proxy/mappers/openai/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/request.rs#L6-L553) | 6-553 |
| Gemini -> OpenAI 응답 변환(choices/usageMetadata) | [`src-tauri/src/proxy/mappers/openai/response.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/openai/response.rs#L5-L214) | 5-214 |
| 모델 매핑 및 와일드카드 우선순위(정확 > 와일드카드 > 기본값) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
| 인증 미들웨어(Authorization/x-api-key/x-goog-api-key) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |

**핵심 상수**:
- `MAX_RETRY_ATTEMPTS = 3`: OpenAI 프로토콜 최대 시도 횟수(순환 포함)(`src-tauri/src/proxy/handlers/openai.rs` 참조)

**핵심 함수**:
- `transform_openai_request(...)`: OpenAI 요청 본문을 내부 업스트림 요청으로 변환(`src-tauri/src/proxy/mappers/openai/request.rs` 참조)
- `transform_openai_response(...)`: 업스트림 응답을 OpenAI `choices`/`usage`로 변환(`src-tauri/src/proxy/mappers/openai/response.rs` 참조)

</details>
