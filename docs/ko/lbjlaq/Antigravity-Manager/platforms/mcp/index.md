---
title: "MCP 엔드포인트: 도구 노출 | Antigravity-Manager"
sidebarTitle: "Claude가 z.ai 능력을 사용"
subtitle: "MCP 엔드포인트: Web Search/Reader/Vision을 호출 가능한 도구로 노출"
description: "Antigravity Manager의 MCP 엔드포인트 구성을 학습합니다. Web Search/Reader/Vision 활성화, 도구 호출 검증, 외부 클라이언트 연결 및 일반적인 오류 문제 해결 방법을 마스터합니다."
tags:
  - "MCP"
  - "Web Search"
  - "Web Reader"
  - "Vision"
  - "z.ai"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 6
---
# MCP 엔드포인트: Web Search/Reader/Vision을 호출 가능한 도구로 노출

이 **MCP 엔드포인트**를 사용하여 z.ai의 검색, 읽기, 시각 능력을 외부 MCP 클라이언트에 노출합니다. "원격 리버스 프록시"와 "내장 서버"의 차이를 명확히 파악하고 이러한 엔드포인트를 활성화 및 호출하는 방법을 학습합니다.

## 학습 후 할 수 있는 것

- 세 가지 MCP 엔드포인트의 작동 원리 이해(원격 리버스 프록시 vs 내장 서버)
- Antigravity Tools에서 Web Search/Web Reader/Vision MCP 엔드포인트 활성화
- 외부 MCP 클라이언트(예: Claude Desktop, Cursor)가 로컬 게이트웨이를 통해 이러한 능력을 호출
- 세션 관리(Vision MCP) 및 인증 모델 마스터

## 현재 직면한 문제

많은 AI 도구가 MCP(Model Context Protocol)를 지원하기 시작했지만 업스트림 API Key와 URL을 구성해야 합니다. z.ai의 MCP 서버도 강력한 능력(검색, 읽기, 시각 분석)을 제공하지만 직접 구성하면 각 클라이언트에 z.ai Key를 노출해야 합니다.

Antigravity Tools의 솔루션은 로컬 게이트웨이 레벨에서 z.ai Key를 통합 관리하고 MCP 엔드포인트를 노출하며 클라이언트는 로컬 게이트웨이에만 연결하면 되고 z.ai Key를 알 필요가 없습니다.

## 이 방법을 사용하는 경우

- 여러 MCP 클라이언트(Claude Desktop, Cursor, 자체 개발 도구)가 있고 통합된 z.ai Key 세트를 사용하고 싶음
- z.ai의 Web Search/Web Reader/Vision 능력을 도구로 AI에 노출하고 싶음
- 여러 곳에서 반복적으로 구성하고 z.ai Key를 순환하고 싶지 않음

## 🎒 시작 전 준비

::: warning 전제 조건
- 이미 Antigravity Tools의 "API Proxy" 페이지에서 리버스 프록시 서비스를 시작함
- 이미 z.ai API Key 획득(z.ai 콘솔에서)
- 리버스 프록시 포트 알기(기본값 `8045`)
:::

::: info MCP란 무엇입니까?
MCP(Model Context Protocol)는 AI 클라이언트가 외부 도구/데이터 소스를 호출할 수 있는 개방형 프로토콜입니다.

전형적인 MCP 상호작용 흐름:
1. 클라이언트(예: Claude Desktop)가 MCP Server에 `tools/list` 요청을 보내 사용 가능한 도구 목록 획득
2. 클라이언트가 컨텍스트에 따라 도구를 선택하고 `tools/call` 요청 전송
3. MCP Server가 도구를 실행하고 결과 반환(텍스트, 이미지, 데이터 등)

Antigravity Tools는 세 가지 MCP 엔드포인트를 제공합니다:
- **원격 리버스 프록시**: z.ai MCP 서버로 직접 전달(Web Search/Web Reader)
- **내장 서버**: 로컬에서 JSON-RPC 2.0 프로토콜 구현, 도구 호출 처리(Vision)
:::

## MCP 엔드포인트란?

**MCP 엔드포인트**는 Antigravity Tools가 노출하는 HTTP 라우트 세트로 외부 MCP 클라이언트가 z.ai의 능력을 호출할 수 있으며 Antigravity Tools가 통합적으로 인증 및 구성을 관리합니다.

### 엔드포인트 분류

| 엔드포인트 유형 | 구현 방식 | 로컬 경로 | 업스트림 대상 |
| --- | --- | --- | --- |
| **Web Search** | 원격 리버스 프록시 | `/mcp/web_search_prime/mcp` | `https://api.z.ai/api/mcp/web_search_prime/mcp` |
| **Web Reader** | 원격 리버스 프록시 | `/mcp/web_reader/mcp` | `https://api.z.ai/api/mcp/web_reader/mcp` |
| **Vision MCP** | 내장 서버(JSON-RPC 2.0) | `/mcp/zai-mcp-server/mcp` | 내부에서 z.ai PaaS API 호출 |

### 핵심 차이

::: info 원격 리버스 프록시 vs 내장 서버
**원격 리버스 프록시**(Web Search/Web Reader):
- 프록시는 부분 요청 헤더(`content-type`, `accept`, `user-agent`)를 유지하고 `Authorization` 헤더를 주입
- 프록시는 업스트림 응답 본문 및 상태 코드를 전달하지만 `CONTENT_TYPE` 응답 헤더만 유지
- 상태 없음, 세션 관리 필요 없음

**내장 서버**(Vision MCP):
- JSON-RPC 2.0 프로토콜 완전 구현(`initialize`, `tools/list`, `tools/call`)
- 상태 있음: 세션 생성(`mcp-session-id`), GET 엔드포인트는 SSE keepalive 반환
- 도구 로직은 로컬에서 구현되며 z.ai PaaS API를 호출하여 시각 분석 수행
:::

## 핵심 아이디어

Antigravity Tools의 MCP 엔드포인트는 다음 설계 원칙을 따릅니다:

1. **통합 인증**: Antigravity에서 z.ai Key 관리, 클라이언트 구성 불필요
2. **온오프 가능**: 세 엔드포인트가 독립적으로 활성화/비활성화 가능
3. **세션 격리**: Vision MCP는 `mcp-session-id`로 다른 클라이언트 격리
4. **오류 투명**: 업스트림 응답 본문 및 상태 코드를 그대로 전달(응답 헤더 필터링)

### 인증 모델

```
MCP 클라이언트 → Antigravity 로컬 프록시 → z.ai 업스트림
                ↓
            [선택 사항] proxy.auth_mode
                ↓
            [자동] z.ai Key 주입
```

Antigravity Tools의 프록시 미들웨어(`src-tauri/src/proxy/middleware/auth.rs`)는 `proxy.auth_mode`를 확인합니다. 인증을 활성화하면 클라이언트가 API Key를 휴대해야 합니다.

**중요**: `proxy.auth_mode`가 어떻든 z.ai Key는 프록시에서 자동으로 주입되며 클라이언트는 구성할 필요가 없습니다.

## 따라 해 보기

### 1단계: z.ai 구성 및 MCP 기능 활성화

**이유**
먼저 z.ai 기본 구성이 올바른지 확인한 다음 MCP 엔드포인트를 하나씩 활성화합니다.

1. Antigravity Tools 열기, **API Proxy** 페이지 진입
2. **z.ai 구성** 카드 찾기, 확장 클릭
3. 다음 필드 구성:

```yaml
 # z.ai 구성
base_url: "https://api.z.ai/api/anthropic"  # z.ai Anthropic 호환 엔드포인트
api_key: "z.ai-api-key"                    # z.ai 콘솔에서 획득
enabled: true                              # z.ai 활성화
```

4. **MCP 구성** 하위 카드 찾기, 다음 구성:

```yaml
 # MCP 구성
enabled: true                              # MCP 마스터 스위치 활성화
web_search_enabled: true                    # Web Search 활성화
web_reader_enabled: true                    # Web Reader 활성화
vision_enabled: true                        # Vision MCP 활성화
```

**다음을 보아야 합니다**: 구성 저장 후 페이지 하단에 "로컬 MCP 엔드포인트" 목록이 나타나며 세 엔드포인트의 전체 URL이 표시됩니다.

### 2단계: Web Search 엔드포인트 검증

**이유**
Web Search는 원격 리버스 프록시이므로 가장 간단하며 기본 구성 검증에 적합합니다.

```bash
 # 1) 먼저 Web Search 엔드포인트가 제공하는 도구 나열(도구 이름은 실제 반환을 기준)
curl -X POST http://127.0.0.1:8045/mcp/web_search_prime/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**다음을 보아야 합니다**: `tools` 리스트가 포함된 JSON 응답을 반환합니다.

::: tip tools/call 계속 검증(선택 사항)
`tools[].name` 및 `tools[].inputSchema`를 얻은 후 schema에 따라 `tools/call` 요청을 조합할 수 있습니다(매개변수는 schema를 기준으로 하며 필드 추측 금지).
:::

::: tip 엔드포인트를 찾을 수 없음?
`404 Not Found`를 수신하면 다음을 확인하세요:
1. `proxy.zai.mcp.enabled`가 `true`인지
2. `proxy.zai.mcp.web_search_enabled`가 `true`인지
3. 리버스 프록시 서비스가 실행 중인지
:::

### 3단계: Web Reader 엔드포인트 검증

**이유**
Web Reader도 원격 리버스 프록시이지만 매개변수 및 반환 형식이 다르며 프록시가 다른 엔드포인트를 올바르게 처리하는지 검증합니다.

```bash
 # 2) Web Reader 엔드포인트가 제공하는 도구 나열
curl -X POST http://127.0.0.1:8045/mcp/web_reader/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**다음을 보아야 합니다**: `tools` 리스트가 포함된 JSON 응답을 반환합니다.

### 4단계: Vision MCP 엔드포인트 검증(세션 관리)

**이유**
Vision MCP는 내장 서버이며 세션 상태가 있으므로 먼저 `initialize`한 다음 도구를 호출해야 합니다.

#### 4.1 세션 초기화

```bash
 # 1) initialize 요청 전송
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05"
    },
    "id": 1
  }'
```

**다음을 보아야 합니다**: 응답에 `mcp-session-id` 헤더가 포함되어 있으며 이 ID를 저장합니다.

```json
{
  "jsonrpc": "2.0",
  "result": {
    "protocolVersion": "2024-11-05",
    "capabilities": { "tools": {} },
    "serverInfo": {
      "name": "zai-mcp-server",
      "version": "<app-version>"
    }
  },
  "id": 1
}
```

::: info 알림
`serverInfo.version`은 Rust의 `env!("CARGO_PKG_VERSION")`에서 오며 본인의 실제 설치 버전을 기준으로 합니다.
:::

응답 헤더:
```
mcp-session-id: uuid-v4-string
```

#### 4.2 도구 목록 획득

```bash
 # 2) tools/list 요청 전송(세션 ID 포함)
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: 세션ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 2
  }'
```

**다음을 보아야 합니다**: 8개 도구의 정의를 반환합니다(`ui_to_artifact`, `extract_text_from_screenshot`, `diagnose_error_screenshot` 등).

#### 4.3 도구 호출

```bash
 # 3) analyze_image 도구 호출
curl -X POST http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "Content-Type: application/json" \
  -H "mcp-session-id: 세션ID" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "analyze_image",
      "arguments": {
        "image_source": "https://example.com/image.jpg",
        "prompt": "이미지 내용 설명"
      }
    },
    "id": 3
  }'
```

**다음을 보아야 합니다**: 이미지 분석 결과의 텍스트 설명을 반환합니다.

::: danger 세션 ID 중요
Vision MCP의 모든 요청(`initialize` 제외)은 `mcp-session-id` 헤더를 휴대해야 합니다.

세션 ID는 `initialize` 응답에서 반환되며 후속 요청은 동일한 ID를 사용해야 합니다. 세션이 손실되면 다시 `initialize`해야 합니다.
:::

### 5단계: SSE keepalive 테스트(선택 사항)

**이유**
Vision MCP의 GET 엔드포인트는 SSE(Server-Sent Events) 스트림을 반환하며 연결을 활성 상태로 유지하는 데 사용됩니다.

```bash
 # 4) GET 엔드포인트 호출(SSE 스트림 획득)
curl -N http://127.0.0.1:8045/mcp/zai-mcp-server/mcp \
  -H "mcp-session-id: 세션ID"
```

**다음을 보아야 합니다**: 15초마다 `event: ping` 메시지를 받으며 형식은 다음과 같습니다:

```
event: ping
data: keepalive

event: ping
data: keepalive
...
```

## 체크포인트 ✅

### 구성 확인

- [ ] `proxy.zai.enabled`가 `true`임
- [ ] `proxy.zai.api_key`가 구성되었음(비어 있지 않음)
- [ ] `proxy.zai.mcp.enabled`가 `true`임
- [ ] 최소 하나의 MCP 엔드포인트가 활성화됨(`web_search_enabled` / `web_reader_enabled` / `vision_enabled`)
- [ ] 리버스 프록시 서비스가 실행 중

### 기능 검증

- [ ] Web Search 엔드포인트가 검색 결과를 반환
- [ ] Web Reader 엔드포인트가 웹 페이지 내용을 반환
- [ ] Vision MCP 엔드포인트가 성공적으로 `initialize`하고 `mcp-session-id`를 획득
- [ ] Vision MCP 엔드포인트가 도구 목록을 반환(8개 도구)
- [ ] Vision MCP 엔드포인트가 성공적으로 도구를 호출하고 결과를 반환

## Vision MCP 도구 요약

| 도구 이름 | 기능 | 필수 매개변수 | 예시 시나리오 |
| --- | --- | --- | --- |
| `ui_to_artifact` | UI 스크린샷을 코드/프롬프트/사양/설명으로 변환 | `image_source`, `output_type`, `prompt` | 디자인 초안에서 프론트엔드 코드 생성 |
| `extract_text_from_screenshot` | 스크린샷에서 텍스트/코드 추출(OCR과 유사) | `image_source`, `prompt` | 오류 로그 스크린샷 읽기 |
| `diagnose_error_screenshot` | 오류 스크린샷 진단(스택 추적, 로그) | `image_source`, `prompt` | 런타임 오류 분석 |
| `understand_technical_diagram` | 아키텍처/흐름/UML/ER 다이어그램 분석 | `image_source`, `prompt` | 시스템 아키텍처 다이어그램 이해 |
| `analyze_data_visualization` | 차트/대시보드 분석 | `image_source`, `prompt` | 대시보드에서 트렌드 추출 |
| `ui_diff_check` | 두 UI 스크린샷 비교 및 차이점 보고 | `expected_image_source`, `actual_image_source`, `prompt` | 시각적 회귀 테스트 |
| `analyze_image` | 일반 이미지 분석 | `image_source`, `prompt` | 이미지 내용 설명 |
| `analyze_video` | 비디오 내용 분석 | `video_source`, `prompt` | 비디오 장면 분석 |

::: info 매개변수 설명
- `image_source`: 로컬 파일 경로(예: `/tmp/screenshot.png`) 또는 원격 URL(예: `https://example.com/image.jpg`)
- `video_source`: 로컬 파일 경로 또는 원격 URL(MP4, MOV, M4V 지원)
- `output_type`(`ui_to_artifact`): `code` / `prompt` / `spec` / `description`
:::

## 피해야 할 함정

### 404 Not Found

**현상**: MCP 엔드포인트 호출 시 `404 Not Found` 반환.

**원인**:
1. 엔드포인트 활성화되지 않음(해당 `*_enabled`가 `false`)
2. 리버스 프록시 서비스 시작되지 않음
3. URL 경로 오류(`/mcp/` 접두사 주의)

**해결**:
1. `proxy.zai.mcp.enabled` 및 해당 `*_enabled` 구성 확인
2. 리버스 프록시 서비스 상태 확인
3. URL 경로 형식 확인(예: `/mcp/web_search_prime/mcp`)

### 400 Bad Request: Missing Mcp-Session-Id

**현상**: Vision MCP 호출 시(`initialize` 제외) `400 Bad Request` 반환.

- GET 엔드포인트: 순 텍스트 `Missing Mcp-Session-Id` 반환
- POST 엔드포인트: JSON-RPC 오류 `{"error":{"code":-32000,"message":"Bad Request: missing Mcp-Session-Id"}}` 반환

**원인**: 요청 헤더에 `mcp-session-id`가 없거나 ID가 무효함.

**해결**:
1. `initialize` 요청이 성공했는지 확인하고 응답 헤더에서 `mcp-session-id` 획득
2. 후속 요청(`tools/list`, `tools/call`, SSE keepalive)는 모두 해당 헤더를 휴대해야 함
3. 세션이 손실된 경우(예: 서비스 재시작) 다시 `initialize`해야 함

### z.ai is not configured

**현상**: `400 Bad Request`를 반환하며 `z.ai is not configured` 메시지.

**원인**: `proxy.zai.enabled`가 `false`이거나 `api_key`가 비어 있음.

**해결**:
1. `proxy.zai.enabled`가 `true`인지 확인
2. `proxy.zai.api_key`가 구성되었는지 확인(비어 있지 않음)

### 업스트림 요청 실패

**현상**: `502 Bad Gateway` 또는 내부 오류 반환.

**원인**:
1. z.ai API Key가 무효하거나 만료됨
2. 네트워크 연결 문제(업스트림 프록시 필요)
3. z.ai 서버 오류

**해결**:
1. z.ai API Key가 올바른지 확인
2. `proxy.upstream_proxy` 구성 확인(z.ai 액세스에 프록시가 필요한 경우)
3. 로그를 확인하여 상세한 오류 정보 획득

## 외부 MCP 클라이언트와 통합

### Claude Desktop 구성 예시

Claude Desktop의 MCP 클라이언트 구성 파일(`~/.config/claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "antigravity-vision": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/zai-mcp-server/mcp"
      ]
    },
    "antigravity-web-search": {
      "command": "node",
      "args": [
        "/path/to/mcp-client-wrapper.js",
        "--endpoint",
        "http://127.0.0.1:8045/mcp/web_search_prime/mcp"
      ]
    }
  }
}
```

::: tip Claude Desktop의 제한
Claude Desktop의 MCP 클라이언트는 `stdio`로 통신해야 합니다. HTTP 엔드포인트를 직접 사용하면 `stdio`를 HTTP 요청으로 변환하는 wrapper 스크립트를 작성해야 합니다.

또는 HTTP MCP를 지원하는 클라이언트(예: Cursor)를 사용하세요.
:::

### HTTP MCP 클라이언트(예: Cursor)

클라이언트가 HTTP MCP를 지원하면 엔드포인트 URL을 직접 구성할 수 있습니다:

```yaml
 # Cursor MCP 구성
mcpServers:
  - name: antigravity-vision
    url: http://127.0.0.1:8045/mcp/zai-mcp-server/mcp
  - name: antigravity-web-search
    url: http://127.0.0.1:8045/mcp/web_search_prime/mcp
```

## 이 수업 요약

Antigravity Tools의 MCP 엔드포인트는 z.ai의 능력을 호출 가능한 도구로 노출하며 두 가지 유형으로 나뉩니다:
- **원격 리버스 프록시**(Web Search/Web Reader): 간단한 전달, 상태 없음
- **내장 서버**(Vision MCP): JSON-RPC 2.0 완전 구현, 세션 관리 포함

핵심 포인트:
1. 통합 인증: z.ai Key는 Antigravity에서 관리하며 클라이언트는 구성할 필요 없음
2. 온오프 가능: 세 엔드포인트가 독립적으로 활성화/비활성화 가능
3. 세션 격리: Vision MCP는 `mcp-session-id`로 클라이언트 격리
4. 유연한 통합: MCP 프로토콜을 지원하는 모든 클라이언트 지원

## 다음 수업 예고

> 다음 수업에서는 **[Cloudflared 원클릭 터널](/ko/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**를 학습합니다.
>
> 학습하게 될 내용:
> - Cloudflared 터널을 원클릭으로 설치 및 시작하는 방법
> - quick 모드 vs auth 모드의 차이
> - 로컬 API를 공개 네트워크에 안전하게 노출하는 방법

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| Web Search 엔드포인트 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L115-L135) | 115-135 |
| Web Reader 엔드포인트 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L137-L157) | 137-157 |
| Vision MCP 엔드포인트(메인 엔트리) | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L376-L397) | 376-397 |
| Vision MCP initialize 처리 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L271-L293) | 271-293 |
| Vision MCP tools/list 처리 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L311-L314) | 311-314 |
| Vision MCP tools/call 처리 | [`src-tauri/src/proxy/handlers/mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/mcp.rs#L315-L363) | 315-363 |
| Vision MCP 세션 상태 관리 | [`src-tauri/src/proxy/zai_vision_mcp.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_mcp.rs#L1-L42) | 1-42 |
| Vision MCP 도구 정의 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L166-L271) | 166-271 |
| Vision MCP 도구 호출 구현 | [`src-tauri/src/proxy/zai_vision_tools.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/zai_vision_tools.rs#L273-L400) | 273-400 |
| 라우팅 등록 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L157-L169) | 157-169 |
| 인증 미들웨어 | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L1-L78) | 1-78 |
| MCP 구성 UI | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1304-L1357) | 1304-1357 |
| 저장소 내 설명 문서 | [`docs/zai/mcp.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/zai/mcp.md#L1-L57) | 1-57 |

**핵심 상수**:
- `ZAI_PAAZ_CHAT_COMPLETIONS_URL = "https://api.z.ai/api/paas/v4/chat/completions"`: z.ai PaaS API 엔드포인트(Vision 도구 호출용)

**핵심 함수**:
- `handle_web_search_prime()`: Web Search 엔드포인트의 원격 리버스 프록시 처리
- `handle_web_reader()`: Web Reader 엔드포인트의 원격 리버스 프록시 처리
- `handle_zai_mcp_server()`: Vision MCP 엔드포인트의 모든 메서드 처리(GET/POST/DELETE)
- `mcp_session_id()`: 요청 헤더에서 `mcp-session-id` 추출
- `forward_mcp()`: 일반 MCP 전달 함수(인증 주입 및 업스트림 전달)
- `tool_specs()`: Vision MCP의 도구 정의 목록 반환
- `call_tool()`: 지정된 Vision MCP 도구 실행

</details>
