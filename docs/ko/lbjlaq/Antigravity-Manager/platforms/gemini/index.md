---
title: "Gemini API: 로컬 게이트웨이 연결 | Antigravity-Manager"
subtitle: "Gemini API 연결: Google SDK가 로컬 게이트웨이에 직접 연결"
sidebarTitle: "로컬 Gemini에 직접 연결"
description: "Antigravity-Manager의 Gemini 로컬 게이트웨이 연결을 학습합니다. /v1beta/models 엔드포인트를 통해 generateContent 및 streamGenerateContent 호출을 마스터하고 cURL 및 Python으로 검증합니다."
tags:
  - "Gemini"
  - "Google SDK"
  - "API 프록시"
  - "v1beta"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 3
---
# Gemini API 연결: Google SDK가 로컬 게이트웨이에 직접 연결

## 학습 후 할 수 있는 것

- Antigravity Tools가 노출하는 Gemini 네이티브 엔드포인트(`/v1beta/models/*`)로 클라이언트 연결
- Google 스타일의 `:generateContent` / `:streamGenerateContent` 경로로 로컬 게이트웨이 호출
- Proxy 인증 활성화 시 `x-goog-api-key`를 직접 사용할 수 있는 이유 이해

## 현재 직면한 문제

이미 로컬 리버스 프록시를 실행했지만 Gemini에서 막히기 시작합니다:

- Google SDK는 기본적으로 `generativelanguage.googleapis.com`을 호출하는데, 어떻게 `http://127.0.0.1:<port>`로 변경합니까?
- Gemini 경로에 콜론이 포함되어 있어(`models/<model>:generateContent`) 많은 클라이언트가 연결하면 404가 됩니다.
- 프록시 인증을 활성화했지만 Google 클라이언트는 `x-api-key`를 보내지 않으므로 계속 401입니다.

## 이 방법을 사용하는 경우

- "Gemini 네이티브 프로토콜"을 사용하고 싶고 OpenAI/Anthropic 호환 레이어를 원하지 않을 때
- 이미 Google/타사 Gemini 스타일 클라이언트가 있고 로컬 게이트웨이로 최소 비용으로 이동하고 싶을 때

## 🎒 시작 전 준비

::: warning 전제 조건
- 앱에 이미 최소 1개의 계정이 추가됨(그렇지 않으면 백엔드가 업스트림 액세스 토큰을 가져올 수 없음)
- 로컬 리버스 프록시 서비스가 이미 시작되었고 수신 포트를 알고 있음(기본값은 `8045` 사용)
:::

## 핵심 아이디어

Antigravity Tools는 로컬 Axum 서버에서 Gemini 네이티브 경로를 노출합니다:

- 목록: `GET /v1beta/models`
- 호출: `POST /v1beta/models/<model>:generateContent`
- 스트리밍: `POST /v1beta/models/<model>:streamGenerateContent`

백엔드는 Gemini 네이티브 요청 본문을 v1internal 구조로 래핑(`project`, `requestId`, `requestType` 등 주입)한 다음 Google v1internal 업스트림 엔드포인트로 전달하고 계정 액세스 토큰을 전달합니다.(소스코드: `src-tauri/src/proxy/mappers/gemini/wrapper.rs`, `src-tauri/src/proxy/upstream/client.rs`)

::: info 튜토리얼에서 base URL을 127.0.0.1로 추천하는 이유는 무엇입니까?
앱의 빠른 통합 예제에서 127.0.0.1을 하드코딩하는 이유는 "일부 환경의 IPv6 파싱 지연 문제 방지"입니다.(소스코드: `src/pages/ApiProxy.tsx`)
:::

## 따라 해 보기

### 1단계: 게이트웨이 온라인 확인(/healthz)

**이유**
서비스가 온라인인지 먼저 확인하면 프로토콜/인증 문제 해결에 많은 시간이 절약됩니다.

::: code-group

```bash [macOS/Linux]
curl -s "http://127.0.0.1:8045/healthz"
```

```powershell [Windows]
Invoke-RestMethod "http://127.0.0.1:8045/healthz"
```

:::

**다음을 보아야 합니다**: `{"status":"ok"}`가 포함된 JSON을 반환합니다(소스코드: `src-tauri/src/proxy/server.rs`).

### 2단계: Gemini 모델 나열(/v1beta/models)

**이유**
먼저 "대외적으로 노출된 모델 ID"가 무엇인지 확인해야 합니다. 이후 `<model>`은 여기서 결정됩니다.

```bash
curl -s "http://127.0.0.1:8045/v1beta/models" | head
```

**다음을 보아야 합니다**: 응답에 `models` 배열이 있으며 각 요소의 `name`은 `models/<id>`와 같습니다(소스코드: `src-tauri/src/proxy/handlers/gemini.rs`).

::: tip 중요
모델 ID는 어떤 필드를 사용합니까?
- ✅ `displayName` 필드 사용(예: `gemini-2.0-flash`)
- ✅ 또는 `name` 필드에서 `models/` 접두사 제거
- ❌ `name` 필드의 전체 값을 직접 복사하지 마세요(경로 오류 발생)

`name` 필드를 복사(예: `models/gemini-2.0-flash`)하여 모델 ID로 사용하면 요청 경로가 `/v1beta/models/models/gemini-2.0-flash:generateContent`가 되는데 이는 잘못된 것입니다.(소스코드: `src-tauri/src/proxy/common/model_mapping.rs`)
:::

::: warning 중요
현재 `/v1beta/models`는 "로컬 동적 모델 목록을 Gemini 모델 목록으로 위장"하는 반환입니다. 업스트림에서 실시간으로 가져오는 것이 아닙니다.(소스코드: `src-tauri/src/proxy/handlers/gemini.rs`)
:::

### 3단계: generateContent 호출(콜론이 포함된 경로)

**이유**
Gemini 네이티브 REST API의 핵심은 `:generateContent`와 같은 "콜론이 포함된 액션"입니다. 백엔드는 동일한 라우트에서 `model:method`를 파싱합니다(소스코드: `src-tauri/src/proxy/handlers/gemini.rs`).

```bash
curl -s \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:generateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Hello"}]}
    ]
  }'
```

**다음을 보아야 합니다**: 응답 JSON에 `candidates`가 있습니다(또는 외부에 `response.candidates`가 있으며 프록시가 언래핑함).

### 4단계: streamGenerateContent 호출(SSE)

**이유**
스트리밍은 "긴 출력/대형 모델"에 더 안정적입니다. 프록시는 업스트림 SSE를 클라이언트로 전달하고 `Content-Type: text/event-stream`을 설정합니다(소스코드: `src-tauri/src/proxy/handlers/gemini.rs`).

```bash
curl -N \
  -H "Content-Type: application/json" \
  -X POST "http://127.0.0.1:8045/v1beta/models/<modelId>:streamGenerateContent" \
  -d '{
    "contents": [
      {"role": "user", "parts": [{"text": "Tell me a short story"}]}
    ]
  }'
```

**다음을 보아야 합니다**: 터미널이 지속적으로 `data: {...}` 형식의 SSE 라인을 출력합니다. 정상적으로 마지막에 `data: [DONE]`이 나타납니다(스트림 종료를 나타냄).

::: tip 주의
`data: [DONE]`은 SSE의 표준 종료 표시이지만 **반드시 나타나는 것은 아닙니다**:
- 업스트림이 정상적으로 종료하고 `[DONE]`을 전송하면 프록시가 전달합니다
- 업스트림이 비정상적으로 연결이 끊어지거나, 시간 초과되거나 다른 종료 신호를 전송하면 프록시가 `[DONE]`을 보완하지 않습니다

클라이언트 코드는 SSE 표준에 따라 처리해야 합니다: `data: [DONE]`을 만나거나 연결이 끊어지면 스트림 종료로 간주해야 합니다(소스코드: `src-tauri/src/proxy/handlers/gemini.rs`).
:::

### 5단계: Python Google SDK로 로컬 게이트웨이에 직접 연결

**이유**
이것은 프로젝트 UI에서 제공하는 "빠른 통합" 예시 경로입니다: Google Generative AI Python 패키지를 사용하여 `api_endpoint`를 로컬 리버스 프록시 주소로 가리킵니다(소스코드: `src/pages/ApiProxy.tsx`).

```python
#설치 필요: pip install google-generativeai
import google.generativeai as genai

genai.configure(
    api_key="YOUR_PROXY_API_KEY",
    transport='rest',
    client_options={'api_endpoint': 'http://127.0.0.1:8045'}
)

model = genai.GenerativeModel('<modelId>')
response = model.generate_content("Hello")
print(response.text)
```

**다음을 보아야 합니다**: 프로그램이 모델 응답 텍스트를 출력합니다.

## 체크포인트 ✅

- `/healthz`가 `{"status":"ok"}`를 반환
- `/v1beta/models`가 모델을 나열할 수 있음(최소 1개)
- `:generateContent`가 `candidates`를 반환
- `:streamGenerateContent`가 `Content-Type: text/event-stream`을 반환하고 지속적으로 스트림을 출력

## 피해야 할 함정

- **401이 계속 해결되지 않음**: 인증을 활성화했지만 `proxy.api_key`가 비어 있으면 백엔드가 요청을 직접 거부합니다(소스코드: `src-tauri/src/proxy/middleware/auth.rs`).
- **헤더에 어떤 key를 포함해야 합니까**: 프록시는 `Authorization`, `x-api-key`, `x-goog-api-key`를 동시에 인식합니다. 따라서 "Google 스타일 클라이언트는 `x-goog-api-key`만 전송"해도 통과할 수 있습니다(소스코드: `src-tauri/src/proxy/middleware/auth.rs`).
- **countTokens 결과가 항상 0**: 현재 `POST /v1beta/models/<model>/countTokens`는 고정 `{"totalTokens":0}`을 반환하며 플레이스홀더 구현입니다(소스코드: `src-tauri/src/proxy/handlers/gemini.rs`).

## 이 수업 요약

- 연결해야 하는 것은 `/v1beta/models/*`가 아니라 `/v1/*`입니다
- 핵심 경로 작성법은 `models/<modelId>:generateContent` / `:streamGenerateContent`입니다
- 인증 활성화 시 `x-goog-api-key`는 프록시가 명확히 지원하는 요청 헤더입니다

## 다음 수업 예고

> 다음 수업에서는 **[Imagen 3 이미지 생성: OpenAI Images 매개변수 size/quality 자동 매핑](../imagen/)**를 학습합니다.

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| Gemini 라우팅 등록(/v1beta/models/*) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L181) | 170-181 |
| 모델 ID 파싱 및 라우팅(왜 `models/` 접두사가 라우팅 오류를 일으키는지) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L58-L77) | 58-77 |
| `model:method` 파싱 + generate/stream 메인 로직 | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L14-L337) | 14-337 |
| SSE 출력 로직(`[DONE]` 전달, 자동 보완 아님) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L161-L183) | 161-183 |
| `/v1beta/models` 반환 구조(동적 모델 목록 위장) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L39-L71) | 39-71 |
| `countTokens` 플레이스홀더 구현(고정 0) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L73-L79) | 73-79 |
| 인증 헤더 호환(`x-goog-api-key` 포함) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L15-L77) | 15-77 |
| Google SDK Python 예시(`api_endpoint`를 로컬 게이트웨이로 가리킴) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L692-L734) | 692-734 |
| Gemini 세션 지문(스티키/캐시용 session_id) | [`src-tauri/src/proxy/session_manager.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/session_manager.rs#L121-L158) | 121-158 |
| Gemini 요청 v1internal 래핑(project/requestId/requestType 등 주입) | [`src-tauri/src/proxy/mappers/gemini/wrapper.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/gemini/wrapper.rs#L5-L160) | 5-160 |
| 업스트림 v1internal 엔드포인트 및 fallback | [`src-tauri/src/proxy/upstream/client.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/upstream/client.rs#L8-L182) | 8-182 |

**핵심 상수**:
- `MAX_RETRY_ATTEMPTS = 3`: Gemini 요청 최대 순환 횟수 상한(소스코드: `src-tauri/src/proxy/handlers/gemini.rs`)

</details>
