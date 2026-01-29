---
title: "z.ai 통합: 능력 경계 상세 설명 | Antigravity-Manager"
sidebarTitle: "z.ai 경계 요약"
subtitle: "z.ai 통합: 능력 경계 상세 설명"
description: "Antigravity Tools의 z.ai 통합 경계를 파악합니다. 요청 라우팅, dispatch_mode 분산, 모델 매핑, Header 보안 정책, 그리고 MCP 리버스 프록시 및 제한 사항을 이해하고 오용을 방지합니다."
tags:
  - "z.ai"
  - "MCP"
  - "Claude"
  - "능력 경계"
prerequisite:
  - "start-getting-started"
  - "platforms-mcp"
order: 3
---
# z.ai 통합의 능력 경계 (구현됨 vs 명확히 미구현됨)

이 문서는 Antigravity Tools의 z.ai "경계"만 설명하며 "연결 방법"은 설명하지 않습니다. 특정 기능이 작동하지 않는 것을 발견하면 여기서 먼저 확인하세요: 켜지지 않은 것인지, 구성되지 않은 것인지, 아니면 아예 구현되지 않은 것인지.

## 학습 후 가능한 작업

- z.ai에 기대할 수 있는 작업 판단: "구현됨"과 "문서에서 명확히 미구현" 구분
- z.ai가 영향을 미치는 엔드포인트 확인 (완전히 영향을 받지 않는 엔드포인트도 있음)
- 각 결론의 소스코드/문서 증거 확인 (GitHub 행 번호 링크 포함), 직접 검증 가능

## 현재 어려움

이미 Antigravity Tools에서 z.ai를 열었지만 사용할 때 다음 의문이 발생할 수 있습니다:

- 왜 어떤 요청은 z.ai를 통해 가고 어떤 요청은 전혀 가지 않는가?
- MCP 엔드포인트를 "완전한 MCP Server"로 사용할 수 있는가?
- UI에서 볼 수 있는 스위치가 실제 구현에 대응되어 있는가?

## 이 프로젝트에서 z.ai 통합이란?

**z.ai 통합**은 Antigravity Tools에서 선택 가능한 "업스트림 provider + MCP 확장"입니다. 특정 조건에서만 Claude 프로토콜 요청을接管하고 MCP Search/Reader 리버스 프록시와 최소한의 Vision MCP 내장 서버를 제공합니다. 전체 프로토콜, 전체 능력의 대체 솔루션이 아닙니다.

::: info 한 문장 기억
z.ai를 "Claude 요청의 선택 가능한 업스트림 + 스위치 가능한 MCP 엔드포인트 그룹"으로 생각하고, "z.ai의 모든 능력을 완전히 가져온 것"으로 생각하지 마세요.
:::

## 구현됨: 안정적으로 사용 가능 (소스코드 기준)

### 1) Claude 프로토콜만 z.ai를 통과함 (/v1/messages + /v1/messages/count_tokens)

z.ai의 Anthropic 업스트림 포워딩은 Claude handler의 z.ai 분기에서만 발생합니다:

- `POST /v1/messages`: `use_zai=true`일 때 `forward_anthropic_json(...)`을 호출하여 JSON 요청을 z.ai Anthropic 호환 엔드포인트로 포워딩
- `POST /v1/messages/count_tokens`: z.ai 활성화 시 동일하게 포워딩, 그렇지 않으면 자리 표시자 `{input_tokens:0, output_tokens:0}` 반환

증거:

- z.ai 분기 선택 및 포워딩 진입점: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374)
- count_tokens의 z.ai 분기 및 자리 표시자 반환: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209)
- z.ai Anthropic 포워딩 구현: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219)

::: tip "응답 스트리밍" 이해 방법
`forward_anthropic_json`은 업스트림 응답 본문을 `bytes_stream()`으로 클라이언트에 스트리밍 방식으로 전달하며 SSE를 파싱하지 않습니다 (`providers/zai_anthropic.rs`의 Response body 구성 참조).
:::

### 2) 스케줄링 모드(dispatch_mode)의 "실제 의미"

`dispatch_mode`는 `/v1/messages`가 z.ai를 통과하는지 여부를 결정합니다:

| dispatch_mode | 발생하는 작업 | 증거 |
| --- | --- | --- |
| `off` | z.ai를 사용하지 않음 | `src-tauri/src/proxy/config.rs#L20-L37` + `src-tauri/src/proxy/handlers/claude.rs#L282-L314` |
| `exclusive` | 모든 Claude 요청이 z.ai를 통과함 | `src-tauri/src/proxy/handlers/claude.rs#L285-L314` |
| `fallback` | Google 풀 사용 불가(0 계정 또는 "사용 가능한 계정 없음")일 때만 z.ai를 통과함 | `src-tauri/src/proxy/handlers/claude.rs#L288-L305` |
| `pooled` | z.ai를 "추가 1개 슬롯"으로 간주하여 폴링에 참여 (반드시 적중된다는 보장 없음) | `src-tauri/src/proxy/handlers/claude.rs#L306-L312` |

::: warning pooled의 일반적인 오해
`pooled`는 "z.ai + Google 계정 풀 모두 사용하고 가중치로 안정적으로 분산"이 아닙니다. 코드에서 명확히 "no strict guarantees"라고 작성되어 있으며, 본질적으로 폴링 슬롯입니다 (`slot == 0`일 때만 z.ai를 통과).
:::

### 3) 모델 매핑: Claude 모델명이 z.ai의 glm-*로 어떻게 변하는가?

z.ai로 포워딩하기 전, 요청 본문에 `model` 필드가 있으면 다시 작성됩니다:

1. `proxy.zai.model_mapping` 정확히 일치 (원래 문자열과 lower-case key 모두 지원)
2. `zai:<model>` 접두사: `zai:`를 제거하고 직접 사용
3. `glm-*`: 변경 없음 유지
4. `claude-*` 아님: 변경 없음 유지
5. `claude-*`이고 `opus/haiku` 포함: `proxy.zai.models.opus/haiku`로 매핑, 그렇지 않으면 기본 `sonnet`

증거: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37), [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L149-L152)

### 4) 포워딩 시 Header 보안 정책 (로컬 프록시 키 유출 방지)

z.ai 업스트림 포워딩은 "모든 Header를 그대로 전달"하지 않고 두 가지 방어선을 적용합니다:

- 일부 Header만 허용 (예: `content-type`, `accept`, `anthropic-version`, `user-agent`)
- z.ai의 API Key를 업스트림에 주입 (클라이언트가 사용하는 인증 방법 우선 유지: `x-api-key` 또는 `Authorization: Bearer ...`)

증거:

- Header 허용 목록: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L89)
- z.ai auth 주입: [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L91-L110)

## 구현됨: MCP (Search/Reader 리버스 프록시 + Vision 내장)

### 1) MCP Search/Reader: z.ai의 MCP 엔드포인트로 리버스 프록시

로컬 엔드포인트와 업스트림 주소는 하드코딩되어 있습니다:

| 로컬 엔드포인트 | 업스트림 주소 | 스위치 | 증거 |
| --- | --- | --- | --- |
| `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` | `proxy.zai.mcp.web_search_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L115-L135` |
| `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` | `proxy.zai.mcp.web_reader_enabled` | `src-tauri/src/proxy/handlers/mcp.rs#L137-L157` |

::: info 404는 "네트워크 문제"가 아님
`proxy.zai.mcp.enabled=false`이거나 해당 `web_search_enabled/web_reader_enabled=false`이면 이 엔드포인트는 직접 404를 반환합니다.
:::

증거:

- MCP 총 스위치 및 z.ai key 검증: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L52-L59)
- 라우팅 등록: [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169)

### 2) Vision MCP: "최소화된 Streamable HTTP MCP" 내장 서버

Vision MCP는 리버스 프록시가 아니라 로컬 내장 구현입니다:

- 엔드포인트: `/mcp/zai-mcp-server/mcp`
- `POST` 지원: `initialize`, `tools/list`, `tools/call`
- `GET`은 SSE keepalive 반환 (초기화된 세션 필요)
- `DELETE`는 세션 종료

증거:

- handler 메인 진입점 및 메서드 디스패치: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397)
- `initialize`, `tools/list`, `tools/call` 구현: [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L229-L374)
- Vision MCP의 "최소 구현" 위치 지정: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37)

### 3) Vision MCP 도구 세트 (8개) 및 파일 크기 제한

도구 목록은 `tool_specs()`에서 가져옵니다:

- `ui_to_artifact`
- `extract_text_from_screenshot`
- `diagnose_error_screenshot`
- `understand_technical_diagram`
- `analyze_data_visualization`
- `ui_diff_check`
- `analyze_image`
- `analyze_video`

증거: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L270), [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L45-L53)

로컬 파일은 읽혀져서 `data:<mime>;base64,...`로 인코딩되며, 하드 제한이 있습니다:

- 이미지 최대 5 MB (`image_source_to_content(..., 5)`)
- 비디오 최대 8 MB (`video_source_to_content(..., 8)`)

증거: [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L111)

## 명확히 미구현됨 / 기대하지 마세요 (문서 선언 및 구현 세부 사항 기준)

### 1) z.ai 사용량/예산 모니터링(usage/budget) 미구현됨

`docs/zai/implementation.md`에 명확히 "not implemented yet"이라고 작성되어 있습니다. 이는 다음을 의미합니다:

- Antigravity Tools가 z.ai의 usage/budget 쿼리나 알림을 제공할 것으로 기대할 수 없음
- 할당량 관리(Quota Protection)도 z.ai의 예산/사용량 데이터를 자동으로 읽지 않음

증거: [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 2) Vision MCP는 완전한 MCP Server가 아님

Vision MCP는 현재 "도구 호출만 가능한" 최소 구현으로 지정되어 있습니다: prompts/resources, resumability, streamed tool output 등은 아직 구현되지 않았습니다.

증거: [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L34-L36), [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198)

### 3) `/v1/models/claude`는 z.ai의 실제 모델 목록을 반영하지 않음

이 엔드포인트가 반환하는 모델 목록은 로컬 내장 매핑 및 사용자 정의 매핑(`get_all_dynamic_models`)에서 가져오며, z.ai 업스트림의 `/v1/models`를 요청하지 않습니다.

증거:

- handler: [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1162-L1183)
- 목록 생성 로직: [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132)

## 구성 필드 요약 (z.ai 관련)

z.ai 구성은 `ProxyConfig.zai` 아래에 있으며 다음 필드를 포함합니다:

- `enabled` / `base_url` / `api_key`
- `dispatch_mode` (`off/exclusive/pooled/fallback`)
- `model_mapping` (정확히 일치하는 항목 덮어쓰기)
- `models.{opus,sonnet,haiku}` (Claude 제품군 기본 매핑)
- `mcp.{enabled,web_search_enabled,web_reader_enabled,vision_enabled}`

기본값(base_url / 기본 모델)도 같은 파일에 있습니다:

- `base_url = "https://api.z.ai/api/anthropic"`
- `opus/sonnet = "glm-4.7"`
- `haiku = "glm-4.5-air"`

증거: [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116), [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279)

---

## 이 장 요약

- z.ai는 현재 Claude 프로토콜(`/v1/messages` + `count_tokens`)만接管하며, 다른 프로토콜 엔드포인트는 "자동으로 z.ai를 통과"하지 않음
- MCP Search/Reader는 리버스 프록시; Vision MCP는 로컬 최소 구현, 완전한 MCP Server가 아님
- `/v1/models/claude`의 모델 목록은 로컬 매핑에서 가져오며, z.ai 업스트림의 실제 모델을 대표하지 않음

---

## 다음 강의 예고

> 다음 강의에서는 **[버전 변경 이력](../../changelog/release-notes/)**을 학습합니다.

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| z.ai 통합 범위(Claude 프로토콜 + MCP + Vision MCP) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L12-L17) | 12-17 |
| z.ai 스케줄링 모드 및 기본 모델 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L20-L116) | 20-116 |
| z.ai 기본 base_url / 기본 모델 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L265-L279) | 265-279 |
| `/v1/messages`가 z.ai를 통과하는지 여부 선택 로직 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L256-L374) | 256-374 |
| `/v1/messages/count_tokens`의 z.ai 포워딩 및 자리 표시자 반환 | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L1186-L1209) | 1186-1209 |
| z.ai Anthropic 업스트림 포워딩(JSON 포워딩 + 응답 스트리밍 전달) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L133-L219) | 133-219 |
| z.ai 모델 매핑 규칙(map_model_for_zai) | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L13-L37) | 13-37 |
| Header 허용 목록 + z.ai auth 주입 | [`src-tauri/src/proxy/providers/zai_anthropic.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/providers/zai_anthropic.rs#L70-L110) | 70-110 |
| MCP Search/Reader 리버스 프록시 및 스위치 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L45-L157) | 45-157 |
| Vision MCP 내장 서버(GET/POST/DELETE + JSON-RPC) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L190-L397) | 190-397 |
| Vision MCP 최소 구현 위치(완전한 MCP Server 아님) | [`docs/zai/vision-mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/vision-mcp.md#L17-L37) | 17-37 |
| Vision 도구 목록 및 제한(tool_specs + 파일 크기 + stream=false) | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L57-L270) | 57-270 |
| `/v1/models/claude` 모델 목록 소스(로컬 매핑, 업스트림 쿼리 안 함) | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L84-L132) | 84-132 |
| 사용량/예산 모니터링 미구현(문서 선언) | [`docs/zai/implementation.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/implementation.md#L194-L198) | 194-198 |

</details>
