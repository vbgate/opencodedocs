---
title: "Anthropic: 호환 API | Antigravity-Manager"
sidebarTitle: "Claude Code를 로컬 게이트웨이로"
subtitle: "Anthropic: 호환 API"
description: "Antigravity-Manager의 Anthropic 호환 API를 학습합니다. Claude Code의 Base URL 구성, /v1/messages로 대화 실행, 인증 및 warmup 인터셉트 이해를 다룹니다."
tags:
  - "anthropic"
  - "claude"
  - "claude-code"
  - "proxy"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---
# Anthropic 호환 API: /v1/messages와 Claude Code의 핵심 계약

Claude Code를 로컬 게이트웨이로 통과시키고 싶지만 Anthropic 프로토콜 사용법을 변경하고 싶지 않다면, Base URL을 Antigravity Tools로 가리키고 `/v1/messages`로 한 번의 요청을 실행하면 됩니다.

## Anthropic 호환 API란?

**Anthropic 호환 API**는 Antigravity Tools가 대외적으로 제공하는 Anthropic Messages 프로토콜 엔드포인트입니다. `/v1/messages` 요청을 수신하고, 로컬에서 메시지 정리, 스트리밍 캡슐화 및 재시작 순환을 수행한 후 실제 모델 능력을 제공하는 업스트림으로 요청을 전달합니다.

## 학습 후 할 수 있는 것

- Antigravity Tools의 `/v1/messages` 인터페이스로 Claude Code(또는 Anthropic Messages 클라이언트) 실행
- Base URL과 인증 헤더 구성 방법 구분, 401/404 오류 방지
- 스트리밍이 필요하면 표준 SSE를 받고, 스트리밍이 필요하지 않아도 JSON을 받을 수 있음
- 프록시가 백그라운드에서 수행하는 "프로토콜 패치"(warmup 인터셉트, 메시지 정리, 서명 대비) 이해

## 현재 직면한 문제

Claude Code/Anthropic SDK를 사용하고 싶지만 네트워크, 계정, 할당량, 제한 등 문제로 대화가 불안정합니다. Antigravity Tools를 로컬 게이트웨이로 실행했지만 다음과 같은 문제에 자주 막힙니다:

- Base URL을 `.../v1`로 작성하거나 클라이언트가 경로를 겹쳐 쌓아 404 발생
- 프록시 인증을 활성화했지만 클라이언트가 어떤 헤더로 key를 전달하는지 몰라 401 발생
- Claude Code의 백그라운드 warmup/요약 작업이 할당량을 조용히 소비

## 이 방법을 사용하는 경우

- **Claude Code CLI**를 연결하고 "Anthropic 프로토콜대로" 로컬 게이트웨이에 직접 연결하기를 원할 때
- 사용 중인 클라이언트가 Anthropic Messages API(`/v1/messages`)만 지원하고 코드를 변경하고 싶지 않을 때

## 🎒 시작 전 준비

::: warning 전제 조건
이 수업은 로컬 리버스 프록시의 기본 폐루프를 이미 실행할 수 있다고 가정합니다(`/healthz` 접근 가능, 프록시 포트 및 인증 활성화 여부 알기). 아직 실행하지 못했다면 먼저 **[로컬 리버스 프록시 시작 및 첫 번째 클라이언트 연결](/ko/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/)**를 참조하세요.
:::

다음 세 가지를 준비해야 합니다:

1. 프록시 주소(예: `http://127.0.0.1:8045`)
2. 프록시 인증 활성화 여부(및 해당 `proxy.api_key`)
3. Anthropic Messages 요청을 보낼 수 있는 클라이언트(Claude Code / curl 둘 다 가능)

## 핵심 아이디어

**Anthropic 호환 API**는 Antigravity Tools에서 고정된 라우트 세트에 해당합니다: `POST /v1/messages`, `POST /v1/messages/count_tokens`, `GET /v1/models/claude`(`src-tauri/src/proxy/server.rs`의 Router 정의 참조).

그중 `/v1/messages`가 "메인 진입점"이며, 프록시는 실제 업스트림 요청을 보내기 전에 다양한 호환성 처리를 수행합니다:

- 프로토콜에서 수락되지 않는 필드를 기록 메시지에서 제거(예: `cache_control`)
- 연속된 동일 역할 메시지 병합, "역할 교차" 검증 실패 방지
- Claude Code의 warmup 메시지를 감지하고 시뮬레이션 응답을 직접 반환하여 할당량 낭비 감소
- 오류 유형에 따라 재시작 및 계정 순환(최대 3회 시도), 긴 세션 안정성 향상

## 따라 해 보기

### 1단계: Base URL이 포트까지만 작성되었는지 확인

**이유**
`/v1/messages`는 프록시 측 고정 라우트입니다. Base URL을 `.../v1`로 작성하면 클라이언트가 다시 `/v1/messages`를 연결하여 최종적으로 `.../v1/v1/messages`가 되기 쉽습니다.

curl로 먼저 활성 상태를 확인할 수 있습니다:

```bash
#다음을 보아야 합니다: {"status":"ok"}
curl -sS "http://127.0.0.1:8045/healthz"
```

### 2단계: 인증을 활성화한 경우 먼저 3가지 헤더 기억

**이유**
프록시의 인증 미들웨어는 `Authorization`, `x-api-key`, `x-goog-api-key`에서 key를 가져옵니다. 인증을 활성화했지만 헤더가 일치하지 않으면 안정적으로 401이 반환됩니다.

::: info 프록시가 허용하는 인증 헤더는 무엇입니까?
`Authorization: Bearer <key>`, `x-api-key: <key>`, `x-goog-api-key: <key>`를 모두 사용할 수 있습니다(`src-tauri/src/proxy/middleware/auth.rs` 참조).
:::

### 3단계: Claude Code CLI로 로컬 게이트웨이에 직접 연결

**이유**
Claude Code는 Anthropic Messages 프로토콜을 사용합니다. Base URL을 로컬 게이트웨이로 가리키면 `/v1/messages` 계약을 재사용할 수 있습니다.

README의 예에 따라 환경 변수를 구성합니다:

```bash
export ANTHROPIC_API_KEY="sk-antigravity"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

**다음을 보아야 합니다**: Claude Code가 정상적으로 시작되고 메시지를 보낸 후 응답을 받습니다.

### 4단계: 먼저 사용 가능한 모델 나열(curl/SDK용)

**이유**
다른 클라이언트는 `model`을 그대로 전달합니다. 먼저 모델 목록을 가져오면 문제 해결이 훨씬 빨라집니다.

```bash
curl -sS "http://127.0.0.1:8045/v1/models/claude" | jq
```

**다음을 보아야 합니다**: `object: "list"`인 JSON을 반환하며, `data[].id`가 사용 가능한 모델 ID입니다.

### 5단계: curl로 `/v1/messages` 호출(비스트리밍)

**이유**
최소 재현 가능한 체인입니다. Claude Code 없이도 "라우팅 + 인증 + 요청 본문"이 어디서 잘못되었는지 확인할 수 있습니다.

```bash
curl -i "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "</v1/models/claude>에서 선택",
    "max_tokens": 128,
    "messages": [
      {"role": "user", "content": "안녕하세요, 간단히 자신을 소개해주세요"}
    ]
  }'
```

**다음을 보아야 합니다**:

- HTTP 200
- 응답 헤더에 `X-Account-Email`과 `X-Mapped-Model`이 포함될 수 있음(문제 해결용)
- 응답 본문은 Anthropic Messages 스타일의 JSON(`type: "message"`)

### 6단계: 스트리밍이 필요할 때 `stream: true` 열기

**이유**
Claude Code는 SSE를 사용합니다. 직접 curl로 SSE를 실행하여 프록시/버퍼링 문제가 없는지 확인할 수 있습니다.

```bash
curl -N "http://127.0.0.1:8045/v1/messages" \
  -H "Content-Type: application/json" \
  -H "x-api-key: sk-antigravity" \
  -d '{
    "model": "</v1/models/claude>에서 선택",
    "max_tokens": 128,
    "stream": true,
    "messages": [
      {"role": "user", "content": "3문장으로 로컬 리버스 프록시가 무엇인지 설명해주세요"}
    ]
  }'
```

**다음을 보아야 합니다**: 한 줄씩 SSE 이벤트(`event: message_start`, `event: content_block_delta` 등).

## 체크포인트 ✅

- `GET /healthz`가 `{"status":"ok"}` 반환
- `GET /v1/models/claude`에서 `data[].id`를 가져올 수 있음
- `POST /v1/messages`가 200으로 반환(비스트리밍 JSON 또는 스트리밍 SSE 둘 중 하나)

## 피해야 할 함정

### 1) Base URL을 `.../v1`로 작성하지 않기

Claude Code의 예는 `ANTHROPIC_BASE_URL="http://127.0.0.1:8045"`입니다. 프록시 측 라우트 자체가 `/v1/messages`를 포함하기 때문입니다.

### 2) 인증을 활성화했지만 `proxy.api_key`가 비어 있으면 직접 거부

프록시 인증이 활성화되었지만 `api_key`가 비어 있으면 미들웨어가 401을 직접 반환합니다(`src-tauri/src/proxy/middleware/auth.rs`의 보호 로직 참조).

### 3) `/v1/messages/count_tokens`는 기본 경로에서 플레이스홀더 구현

z.ai 전달이 활성화되지 않으면 이 엔드포인트는 `input_tokens: 0, output_tokens: 0`을 직접 반환합니다(`handle_count_tokens` 참조). 실제 토큰을 판단하는 데 사용하지 마세요.

### 4) 스트리밍을 활성화하지 않았지만 서버가 "내부적으로 SSE로 이동"하는 것을 봄

프록시는 `/v1/messages`에 대해 호환성 전략을 가지고 있습니다: 클라이언트가 스트리밍을 요구하지 않을 때 서버는 **내부적으로 강제로 스트리밍으로 이동**한 다음 결과를 수집하여 JSON으로 반환할 수 있습니다(`handle_messages`의 `force_stream_internally` 로직 참조).

## 이 수업 요약

- Claude Code/Anthropic 클라이언트를 실행하려면 본질적으로 3가지입니다: Base URL, 인증 헤더, `/v1/messages` 요청 본문
- 프록시는 "프로토콜 실행 + 긴 세션 안정성"을 위해 기록 메시지를 정리하고, warmup을 인터셉트하고, 실패 시 재시작/계정 순환을 수행합니다
- `count_tokens`는 현재 실제 기준으로 사용할 수 없습니다(해당 전달 경로를 활성화한 경우 제외)

## 다음 수업 예고

> 다음 수업에서는 **[Gemini 네이티브 API: /v1beta/models 및 Google SDK 엔드포인트 연결](/ko/lbjlaq/Antigravity-Manager/platforms/gemini/)**를 학습합니다.

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 프록시 라우팅: `/v1/messages` / `count_tokens` / `models/claude` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L193) | 120-193 |
| Anthropic 메인 엔트리: `handle_messages`(warmup 인터셉트 및 재시작 루프 포함) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L240-L1140) | 240-1140 |
| 모델 목록: `GET /v1/models/claude` | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1163-L1183) | 1163-1183 |
| `count_tokens`(z.ai 비활성화 시 0 반환) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1210) | 1186-1210 |
| Warmup 감지 및 시뮬레이션 응답 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1375-L1493) | 1375-1493 |
|--- | --- | ---|
| 요청 정리: `cache_control` 제거 | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L68-L148) | 68-148 |
| 요청 정리: 연속된 동일 역할 메시지 병합 | [`src-tauri/src/proxy/mappers/claude/request.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/request.rs#L253-L296) | 253-296 |
|--- | --- | ---|

**핵심 상수**:
- `MAX_RETRY_ATTEMPTS = 3`: `/v1/messages`의 최대 재시작 횟수

</details>
