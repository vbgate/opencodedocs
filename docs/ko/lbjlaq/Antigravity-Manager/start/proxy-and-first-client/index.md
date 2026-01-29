---
title: "프록시 시작: 역방향 프록시 및 클라이언트 연결 | Antigravity-Manager"
sidebarTitle: "5분 안에 역방향 프록시 실행"
subtitle: "로컬 역방향 프록시 시작 및 첫 번째 클라이언트 연결 (/healthz + SDK 설정)"
description: "Antigravity 역방향 프록시 시작 및 클라이언트 연결 학습: 포트 및 인증 설정, /healthz 헬스체크 검증, SDK 첫 번째 호출 완성."
tags:
  - "API Proxy"
  - "healthz"
  - "OpenAI SDK"
  - "Anthropic SDK"
  - "Gemini SDK"
  - "Base URL"
prerequisite:
  - "start-installation"
  - "start-add-account"
duration: 18
order: 6
---

# 로컬 역방향 프록시 시작 및 첫 번째 클라이언트 연결 (/healthz + SDK 설정)

이 수업에서는 Antigravity Tools로 로컬 역방향 프록시(API Proxy)를 실행합니다: 서비스 시작, `/healthz` 헬스체크, SDK를 연결하여 첫 번째 요청을 완료합니다.

## 학습 완료 후 가능한 작업

- Antigravity Tools의 API Proxy 페이지에서 로컬 역방향 프록시 서비스 시작/중지
- `GET /healthz`로 헬스체크하여 "포트 올바름, 서비스 실제 실행 중" 확인
- `auth_mode`와 API Key의 관계 명확히: 어떤 경로가 인증 필요, 어떤 Header를 가져야 하는지
- 임의의 클라이언트(OpenAI / Anthropic / Gemini SDK) 선택하여 첫 번째 실제 요청 완료

## 현재 겪고 있는 문제

- Antigravity Tools를 설치하고 계정을 추가했지만, "역방향 프록시가 성공적으로 시작되었는지" 모름
- 클라이언트 연결 시 401(key 미포함) 또는 404(Base URL 잘못/경로 중복)를 쉽게 겪음
- 추측에 의존하지 않고, 가장 짧은 완성 루프를 원함: 시작 → 헬스체크 → 첫 번째 요청 성공

## 이 기능을 언제 사용해야 할까

- 방금 설치를 완료하고, 로컬 게이트웨이가 외부에서 작동할 수 있는지 확인하고 싶을 때
- 포트 변경, LAN 액세스 활성화, 인증 모드 변경 후, 구성이 문제 없는지 빠르게 검증하고 싶을 때
- 새 클라이언트/새 SDK를 연결하고, 최소 예제로 먼저 실행하고 싶을 때

## 🎒 시작 전 준비

::: warning 사전 조건
- 설치 완료 및 Antigravity Tools 정상 실행 가능.
- 최소 하나의 사용 가능한 계정이 있음; 역방향 프록시 시작 시 오류 `"사용 가능한 계정이 없습니다, 먼저 계정을 추가하세요"` 반환 (z.ai 배포가 활성화되지 않은 경우에만).
:::

::: info 이 수업에서 자주 등장하는 용어
- **Base URL**: 클라이언트 요청의 "서비스 루트 주소". 다른 SDK의 연결 방식이 다름, 일부는 `/v1`을 가져야 하고 일부는 필요 없음.
- **헬스체크**: 최소 요청으로 서비스 도달 가능 확인. 이 프로젝트의 헬스체크 엔드포인트는 `GET /healthz`, `{"status":"ok"}` 반환.
:::

## 핵심 개념

1. Antigravity Tools가 역방향 프록시를 시작할 때, 구성에 따라 수신 주소와 포트를 바인딩:
   - `allow_lan_access=false`일 때 `127.0.0.1` 바인딩
   - `allow_lan_access=true`일 때 `0.0.0.0` 바인딩
2. 먼저 코드를 작성할 필요 없습니다. 먼저 `GET /healthz`로 헬스체크하여 "서비스 실행 중"을 확인하세요.
3. 인증을 활성화한 경우:
   - `auth_mode=all_except_health`는 `/healthz`를 제외
   - `auth_mode=strict`는 모든 경로에 API Key 필요

## 함께 실습

### 1단계: 포트, LAN 액세스, 인증 모드 확인

**이유**
먼저 "클라이언트가 어디에 연결해야 하는지(host/port)"와 "key를 가져와야 하는지"를 결정해야 합니다, 그렇지 않으면 이후 401/404 문제 해결이 어렵습니다.

Antigravity Tools에서 `API Proxy` 페이지 열고, 이 4개의 필드에 중점:

- `port`: 기본 `8045`
- `allow_lan_access`: 기본 닫힘 (로컬 액세스만)
- `auth_mode`: 선택 `off/strict/all_except_health/auto`
- `api_key`: 기본적으로 `sk-...` 생성, UI는 `sk-`로 시작하고 길이가 최소 10이어야 함을 검증

**예상 화면**
- 페이지 오른쪽 위에 Start/Stop 버튼 (역방향 프록시 시작/중지), 서비스 실행 시 포트 입력 상자 비활성화됨

::: tip 초보자 권장 구성 (먼저 실행 후 보안 추가)
- 처음 실행: `allow_lan_access=false` + `auth_mode=off`
- LAN 액세스 필요 시 열기: 먼저 `allow_lan_access=true` 열기, 다음 `auth_mode`를 `all_except_health`로 전환 (적어도 전체 LAN을 "노출 API"로 노출하지 마세요)
:::

### 2단계: 역방향 프록시 서비스 시작

**이유**
GUI의 Start는 백엔드 명령을 호출하여 Axum Server를 시작하고 계정 풀을 로드합니다; 이것이 "외부에 API 제공"의 전제입니다.

페이지 오른쪽 위의 Start 클릭.

**예상 화면**
- 상태가 stopped에서 running으로 변경
- 옆에 현재 로드된 계정 수 표시 (active accounts)

::: warning 시작 실패 시, 가장 흔한 두 가지 오류
- `"사용 가능한 계정이 없습니다, 먼저 계정을 추가하세요"`: 계정 풀이 비어 있고 z.ai 배포가 활성화되지 않음.
- `"Axum 서버 시작 실패: 주소 <host:port> 바인딩 실패: ..."`: 포트 점유 또는 권한 없음 (다른 포트로 변경 후 재시도).
:::

### 3단계: /healthz로 헬스체크 (최소 완성 루프)

**이유**
`/healthz`는 가장 안정적인 "연결성 확인". 모델, 계정 또는 프로토콜 변환에 의존하지 않고, 서비스 도달 가능 여부만 검증.

`<PORT>`를 UI에서 보는 포트(기본 `8045`)로 교체:

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:<PORT>/healthz"
```

```powershell [Windows]
curl.exe -sS "http://127.0.0.1:<PORT>/healthz"
```

:::

**예상 화면**

```json
{"status":"ok"}
```

::: details 인증 필요 시 어떻게 테스트?
`auth_mode`를 `strict`로 전환하면, 모든 경로에 key 필요 (포함 `/healthz`).

```bash
curl -sS "http://127.0.0.1:<PORT>/healthz" \
  -H "Authorization: Bearer <API_KEY>"
```

인증 Header의 권장 작성법 (더 많은 형식 호환):
- `Authorization: Bearer <proxy.api_key>` 또는 `Authorization: <proxy.api_key>`
- `x-api-key: <proxy.api_key>`
- `x-goog-api-key: <proxy.api_key>`
:::

### 4단계: 첫 번째 클라이언트 연결 (OpenAI / Anthropic / Gemini 셋 중 하나 선택)

**이유**
`/healthz`는 "서비스 도달 가능"만 설명합니다; 진정한 연결 성공은 SDK가 실제 요청을 발사하는 것을 기준으로 합니다.

::: code-group

```python [OpenAI SDK (Python)]
import openai

client = openai.OpenAI(
    api_key="<API_KEY>",
    base_url="http://127.0.0.1:8045/v1",
)

resp = client.chat.completions.create(
    model="gemini-3-flash",
    messages=[{"role": "user", "content": "안녕하세요, 자기소개 부탁드립니다"}],
)

print(resp.choices[0].message.content)
```

```bash [Claude Code / Anthropic CLI]
export ANTHROPIC_API_KEY="<API_KEY>"
export ANTHROPIC_BASE_URL="http://127.0.0.1:8045"
claude
```

```python [Gemini SDK (Python)]
import google.generativeai as genai

genai.configure(
    api_key="<API_KEY>",
    transport="rest",
    client_options={"api_endpoint": "http://127.0.0.1:8045"},
)

model = genai.GenerativeModel("gemini-3-flash")
resp = model.generate_content("Hello")
print(resp.text)
```

:::

**예상 화면**
- 클라이언트가 비어 있지 않은 텍스트 응답을 받음
- Proxy Monitor를 활성화한 경우, 모니터에서 이 요청 기록 보임

## 체크포인트 ✅

- `GET /healthz`가 `{"status":"ok"}` 반환
- API Proxy 페이지에 running 표시
- 선택한 SDK 예제가 내용을 반환 (401/404가 아님, 빈 응답도 아님)

## 흔한 오류

::: warning 401: 대부분 인증 정렬 실패
- `auth_mode`를 활성화했지만, 클라이언트가 key를 가져오지 않음.
- key를 가져왔지만 Header 이름이 잘못됨: 이 프로젝트는 `Authorization` / `x-api-key` / `x-goog-api-key`를 동시에 호환.
:::

::: warning 404: 대부분 Base URL 잘못 또는 "경로 중복"
- OpenAI SDK는 보통 `base_url=.../v1` 필요; Anthropic/Gemini 예제는 `/v1` 없음.
- 일부 클라이언트가 경로를 반복 연결하여 `/v1/chat/completions/responses`와 유사하게 만들면 404 발생 (프로젝트 README는 Kilo Code의 OpenAI 모드 경로 중복 문제를 특별히 언급함).
:::

::: warning LAN 액세스는 "열기만 하면 끝"이 아님
`allow_lan_access=true`를 활성화하면, 서비스가 `0.0.0.0`에 바인딩됩니다. 이것은 동일 LAN 내 다른 기기가 기기 IP + 포트를 통해 액세스할 수 있음을 의미합니다.

이렇게 사용하려면 최소 `auth_mode`를 열고, 강력한 `api_key`를 설정하세요.
:::

## 이 수업 요약

- 역방향 프록시 시작 후, 먼저 `/healthz`로 헬스체크 후 SDK 구성
- `auth_mode`는 어떤 경로에 key를 가져와야 하는지 결정; `all_except_health`는 `/healthz` 제외
- SDK 연결 시, 가장 흔히 잘못하는 것은 Base URL에 `/v1`을 가져야 하는지 여부

## 다음 수업 예고

> 다음 수업에서 OpenAI 호환 API의 세부 사항을 명확히 설명합니다: `/v1/chat/completions`와 `/v1/responses`의 호환 경계 포함.
>
> **[OpenAI 호환 API: /v1/chat/completions 및 /v1/responses 구현 전략](/ko/lbjlaq/Antigravity-Manager/platforms/openai/)** 참조.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>확장하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 주제 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 역방향 프록시 서비스 시작/중지/상태 | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L178) | 42-178 |
| 시작 전 계정 풀 확인 (계정 없는 시 오류 조건) | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L81-L91) | 81-91 |
| 라우터 등록 (포함 `/healthz`) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| `/healthz` 반환값 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L266-L272) | 266-272 |
| 프록시 인증 미들웨어 (Header 호환 및 `/healthz` 제외) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L78) | 14-78 |
| `auth_mode=auto`의 실제 분석 로직 | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L19-L30) | 19-30 |
| ProxyConfig 기본값 (포트 8045, 기본 로컬만) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L257) | 174-257 |
| 바인딩 주소 유도 (127.0.0.1 vs 0.0.0.0) | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L281-L291) | 281-291 |
| UI 시작/중지 버튼이 `start_proxy_service/stop_proxy_service` 호출 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L624-L639) | 624-639 |
| UI 포트/LAN/인증/API key 구성 영역 | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L868-L1121) | 868-1121 |
| README의 Claude Code / Python 연결 예제 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L197-L227) | 197-227 |

</details>
