---
title: "엔드포인트 빠른 찾기: HTTP 라우팅 개요 | Antigravity-Manager"
sidebarTitle: "모든 라우팅을 한눈에"
subtitle: "엔드포인트 빠른 찾기: 외부 HTTP 라우팅 개요"
description: "Antigravity 게이트웨이의 HTTP 엔드포인트 배치를 학습합니다. 테이블로 OpenAI/Anthropic/Gemini/MCP 라우팅을 대조하고, 인증 모드 및 API Key Header 사용 방법을 마스터합니다."
tags:
  - "엔드포인트 빠른 찾기"
  - "API 참조"
  - "OpenAI"
  - "Anthropic"
  - "Gemini"
prerequisite:
  - "start-getting-started"
order: 1
---

# 엔드포인트 빠른 찾기: 외부 HTTP 라우팅 개요

## 수업을 마치면 할 수 있는 것

- 호출해야 할 엔드포인트 경로를 빠르게 찾습니다
- 다른 프로토콜의 엔드포인트 배치를 이해합니다
- 인증 모드 및 헬스 체크의 특수 규칙을 알고 있습니다

## 엔드포인트 개요

Antigravity Tools의 로컬 리버스 프록시 서비스는 다음과 같은 엔드포인트를 제공합니다:

| 프로토콜 분류 | 용도 | 전형적인 클라이언트 |
|--- | --- | ---|
| **OpenAI 프로토콜** | 범용 AI 애플리케이션 호환 | OpenAI SDK / 호환 클라이언트 |
| **Anthropic 프로토콜** | Claude 시리즈 호출 | Claude Code / Anthropic SDK |
| **Gemini 프로토콜** | Google 공식 SDK | Google Gemini SDK |
| **MCP 엔드포인트** | 도구 호출 강화 | MCP 클라이언트 |
| **내부/보조** | 헬스 체크, 인터셉트/내부 기능 | 자동화 스크립트 / 모니터링 헬스 체크 |

---

## OpenAI 프로토콜 엔드포인트

이 엔드포인트는 OpenAI API 형식을 호환하며, OpenAI SDK를 지원하는 대부분의 클라이언트에 적합합니다.

| 메서드 | 경로 | 라우팅 진입점(Rust handler) | 비고 |
|--- | --- | --- | ---|
| GET | `/v1/models` | `handlers::openai::handle_list_models` | OpenAI 호환: 모델 리스트 |
| POST | `/v1/chat/completions` | `handlers::openai::handle_chat_completions` | OpenAI 호환: Chat Completions |
| POST | `/v1/completions` | `handlers::openai::handle_completions` | OpenAI 호환: Legacy Completions |
| POST | `/v1/responses` | `handlers::openai::handle_completions` | OpenAI 호환: Codex CLI 요청(`/v1/completions`과 동일 handler) |
| POST | `/v1/images/generations` | `handlers::openai::handle_images_generations` | OpenAI 호환: Images Generations |
| POST | `/v1/images/edits` | `handlers::openai::handle_images_edits` | OpenAI 호환: Images Edits |
| POST | `/v1/audio/transcriptions` | `handlers::audio::handle_audio_transcription` | OpenAI 호환: Audio Transcriptions |

::: tip 호환성 프롬프트
`/v1/responses` 엔드포인트는 Codex CLI 전용으로 설계되었으며, 실제로 `/v1/completions`과 동일한 처리 로직을 사용합니다.
:::

---

## Anthropic 프로토콜 엔드포인트

이 엔드포인트는 Anthropic API의 경로 및 요청 형식에 따라 구성되어, Claude Code / Anthropic SDK 호출에 사용됩니다.

| 메서드 | 경로 | 라우팅 진입점(Rust handler) | 비고 |
|--- | --- | --- | ---|
| POST | `/v1/messages` | `handlers::claude::handle_messages` | Anthropic 호환: Messages |
| POST | `/v1/messages/count_tokens` | `handlers::claude::handle_count_tokens` | Anthropic 호환: count_tokens |
| GET | `/v1/models/claude` | `handlers::claude::handle_list_models` | Anthropic 호환: 모델 리스트 |

---

## Gemini 프로토콜 엔드포인트

이 엔드포인트는 Google Gemini API 형식을 호환하며, Google 공식 SDK를 직접 사용할 수 있습니다.

| 메서드 | 경로 | 라우팅 진입점(Rust handler) | 비고 |
|--- | --- | --- | ---|
| GET | `/v1beta/models` | `handlers::gemini::handle_list_models` | Gemini 네이티브: 모델 리스트 |
| GET | `/v1beta/models/:model` | `handlers::gemini::handle_get_model` | Gemini 네이티브: GetModel |
| POST | `/v1beta/models/:model` | `handlers::gemini::handle_generate` | Gemini 네이티브: generateContent / streamGenerateContent |
| POST | `/v1beta/models/:model/countTokens` | `handlers::gemini::handle_count_tokens` | Gemini 네이티브: countTokens |

::: warning 경로 설명
`/v1beta/models/:model`은 동일한 경로에서 GET과 POST를 동시에 등록합니다(라우팅 정의 참조).
:::

---

## MCP 엔드포인트

MCP(Model Context Protocol) 엔드포인트는 "도구 호출" 인터페이스를 외부에 노출하는 데 사용됩니다(`handlers::mcp::*`로 처리). 활성화 여부 및 구체적인 동작은 구성에 따릅니다. 세부 사항은 [MCP 엔드포인트](../../platforms/mcp/)를 참조하세요.

| 메서드 | 경로 | 라우팅 진입점(Rust handler) | 비고 |
|--- | --- | --- | ---|
| ANY | `/mcp/web_search_prime/mcp` | `handlers::mcp::handle_web_search_prime` | MCP: Web Search Prime |
| ANY | `/mcp/web_reader/mcp` | `handlers::mcp::handle_web_reader` | MCP: Web Reader |
| ANY | `/mcp/zai-mcp-server/mcp` | `handlers::mcp::handle_zai_mcp_server` | MCP: z.ai MCP Server |

::: details MCP 관련 설명
MCP의 사용 가능 범위와 경계 설명은 [z.ai 통합 능력 경계(이미 구현됨 vs 명시적으로 미구현됨)](../zai-boundaries/)을 참조하세요.
:::

---

## 내부 및 보조 엔드포인트

이 엔드포인트는 시스템 내부 기능 및 외부 모니터링에 사용됩니다.

| 메서드 | 경로 | 라우팅 진입점(Rust handler) | 비고 |
|--- | --- | --- | ---|
| POST | `/internal/warmup` | `handlers::warmup::handle_warmup` | 내부 웜업 엔드포인트 |
| POST | `/v1/api/event_logging` | `silent_ok_handler` | 텔레메트리 로그 인터셉트: 직접 200 반환 |
| POST | `/v1/api/event_logging/batch` | `silent_ok_handler` | 텔레메트리 로그 인터셉트: 직접 200 반환 |
| GET | `/healthz` | `health_check_handler` | 헬스 체크: `{"status":"ok"}` 반환 |
| POST | `/v1/models/detect` | `handlers::common::handle_detect_model` | 모델 자동 검출 |

::: tip 무음 처리
이벤트 로그 엔드포인트는 직접 `200 OK`를 반환하며 실제 처리하지 않습니다. 클라이언트의 텔레메트리 보고를 차단하는 데 사용됩니다.
:::

::: warning 이 엔드포인트에 API Key가 필요한가요?
`GET /healthz`가 면제될 수 있고, 나머지 라우트에 key를 가져야 하는지는 `proxy.auth_mode`의 "유효 모드"에 따라 결정됩니다(아래의 "인증 모드" 및 소스 코드의 `auth_middleware` 참조).
:::

---

## 인증 모드

모든 엔드포인트의 액세스 권한은 `proxy.auth_mode`로 제어됩니다:

| 모드 | 설명 | `/healthz` 인증 필요? | 다른 엔드포인트 인증 필요? |
|--- | --- | --- | ---|
| `off` | 완전 개방 | ❌ 아니오 | ❌ 아니오 |
| `strict` | 모든 라우트 인증 필요 | ✅ 예 | ✅ 예 |
| `all_except_health` | 헬스 체크만 개방 | ❌ 아니오 | ✅ 예 |
| `auto` | 자동 판단(기본값) | ❌ 아니오 | `allow_lan_access`에 따름 |

::: info auto 모드 로직
`auto`는 독립적인 전략이 아니라 구성에서 유도됩니다: `proxy.allow_lan_access=true`일 때 `all_except_health`와 동등, 그렇지 않으면 `off`와 동등(참조: `docs/proxy/auth.md`).
:::

**인증 요청 형식**:

::: code-group

```bash [macOS/Linux]
 # Authorization: Bearer
curl -H "Authorization: Bearer YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key(OpenAI 스타일)
curl -H "x-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key(Gemini 스타일)
curl -H "x-goog-api-key: YOUR_API_KEY" \
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

```powershell [Windows]
 # Authorization: Bearer
curl.exe -H "Authorization: Bearer YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/messages"

 # x-api-key(OpenAI 스타일)
curl.exe -H "x-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1/chat/completions"

 # x-goog-api-key(Gemini 스타일)
curl.exe -H "x-goog-api-key: YOUR_API_KEY" `
  "http://127.0.0.1:<PORT>/v1beta/models/gemini-2-pro"
```

:::

---

## 이 섹션 요약

Antigravity Tools는 완전한 다중 프로토콜 호환 엔드포인트를 제공하며, OpenAI, Anthropic, Gemini 세 가지 주요 API 형식 및 MCP 도구 호출 확장을 지원합니다.

- **빠른 통합**: 우선 OpenAI 프로토콜 엔드포인트를 사용하고 호환성이 가장 강력합니다.
- **네이티브 기능**: Claude Code 완전 기능이 필요할 때 Anthropic 프로토콜 엔드포인트를 사용합니다.
- **Google 생태계**: Google 공식 SDK를 사용할 때 Gemini 프로토콜 엔드포인트를 선택합니다.
- **보안 구성**: 사용 시나리오(로컬/LAN/공개 인터넷)에 따라 적절한 인증 모드를 선택합니다.

---

## 다음 수업 예고

> 다음 수업에서는 **[데이터 및 모델](../storage-models/)**를 학습합니다.
>
> 배우게 될 것:
> - 계정 파일의 저장 구조
> - SQLite 통계 데이터베이스의 테이블 구조
> - 핵심 필드 기준 및 백업 전략

---

## 부록: 소스 코드 참조

<details>
<summary><strong>펼쳐서 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 라우팅 등록(모든 엔드포인트) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 인증 미들웨어(Header 호환 + `/healthz` 면제 + OPTIONS 통과) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| auth_mode 모드 및 auto 파생 규칙 | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L9-L24) | 9-24 |
| `/healthz` 반환값 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| 텔레메트리 로그 인터셉트(silent 200) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L274-L277) | 274-277 |

**핵심 함수**:
- `AxumServer::start()`: Axum 서버 시작 및 라우팅 등록(79-254행)
- `health_check_handler()`: 헬스 체크 처리(266-272행)
- `silent_ok_handler()`: 무음 성공 처리(274-277행)

</details>
