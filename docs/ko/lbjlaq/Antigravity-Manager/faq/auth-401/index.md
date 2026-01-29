---
title: "인증 실패: 401 오류 문제 해결 | Antigravity-Manager"
sidebarTitle: "3분 만에 401 해결"
subtitle: "401/인증 실패: 먼저 auth_mode 확인, 다음 Header 확인"
description: "Antigravity Tools 프록시의 인증 메커니즘을 학습하고 401 오류를 문제 해결합니다. auth_mode, api_key, Header 순서로 문제를 찾아내고, auto 모드 규칙과 /healthz 제외, Header 우선순위 오해를 피하는 방법을 이해하세요."
tags:
  - "FAQ"
  - "인증"
  - "401"
  - "API Key"
prerequisite:
  - "start-proxy-and-first-client"
order: 2
---

# 401/인증 실패: 먼저 auth_mode 확인, 다음 Header 확인

## 이 과정을 통해 할 수 있는 것

- 3분 내에 401이 Antigravity Tools 인증 미들웨어에 의해 차단되었는지 판단
- `proxy.auth_mode` 네 가지 모드(특히 `auto`)가 현재 구성에서 어떻게 "실제 유효값"으로 작동하는지 명확히 이해
- 올바른 API Key Header(및 Header 우선순위 함정 피하기)로 요청을 통과시키는 방법

## 현재 겪고 있는 문제

클라이언트가 로컬 리버스 프록시를 호출할 때 `401 Unauthorized` 오류가 발생합니다:
- Python/OpenAI SDK: `AuthenticationError` 발생
- curl: `HTTP/1.1 401 Unauthorized` 반환
- HTTP 클라이언트: 응답 상태 코드 401

## 401/인증 실패란?

**401 Unauthorized**는 Antigravity Tools에서 가장 일반적인 의미는: 프록시가 인증을 활성화했고(`proxy.auth_mode` 결정), 하지만 요청이 올바른 API Key를 가지고 있지 않거나, 우선순위가 더 높은 불일치 Header를 가지고 있어 `auth_middleware()`가 즉시 401을 반환합니다.

::: info 먼저 "프록시가 차단 중인지" 확인
상류 플랫폼도 401을 반환할 수 있지만, 이 FAQ는 "프록시 인증으로 인한 401"만 처리합니다. 아래의 `/healthz`를 사용하여 빠르게 구분할 수 있습니다.
:::

## 빠른 문제 해결(이 순서대로 하세요)

### 1단계: `/healthz`로 "인증이 차단 중인지" 확인

**이유**
`all_except_health`는 `/healthz`를 통과하지만 다른 라우팅을 차단합니다. 이를 통해 401이 프록시 인증 계층에서 오는지 빠르게 찾을 수 있습니다.

```bash
 # 인증 Header 없이
curl -i http://127.0.0.1:8045/healthz
```

**예상 결과**
- `auth_mode=all_except_health`(또는 `auto`이고 `allow_lan_access=true`)일 때: 보통 `200` 반환
- `auth_mode=strict`일 때: `401` 반환

::: tip `/healthz`는 라우팅 계층에서 GET
프록시는 라우팅에 `GET /healthz`를 등록합니다(참조: `src-tauri/src/proxy/server.rs`).
:::

---

### 2단계: `auth_mode`의 "실제 유효값" 확인(특히 `auto`)

**이유**
`auto`는 "독립 정책"이 아니며, `allow_lan_access`에 따라 실제 실행할 모드를 계산합니다.

| `proxy.auth_mode` | 추가 조건 | 실제 유효값(effective mode) |
| --- | --- | --- |
| `off` | - | `off` |
| `strict` | - | `strict` |
| `all_except_health` | - | `all_except_health` |
| `auto` | `allow_lan_access=false` | `off` |
| `auto` | `allow_lan_access=true` | `all_except_health` |

**GUI의 API Proxy 페이지에서 확인할 수 있습니다**: `Allow LAN Access`와 `Auth Mode`.

---

### 3단계: `api_key`가 비어 있지 않은지, 동일한 값을 사용하고 있는지 확인

**이유**
인증이 활성화되어 있을 때 `proxy.api_key`가 비어 있으면 `auth_middleware()`는 모든 요청을 즉시 거부하고 오류 로그를 기록합니다.

```text
Proxy auth is enabled but api_key is empty; denying request
```

**예상 결과**
- API Proxy 페이지에서 `sk-`로 시작하는 키를 볼 수 있음(기본값은 `ProxyConfig::default()`에서 자동 생성됨)
- "Regenerate/편집"을 클릭하여 저장하면 외부 요청은 즉시 새 키로 검증됨(재시작 불필요)

---

### 4단계: 가장 간단한 Header로 시도(복잡한 SDK는 먼저 사용하지 마세요)

**이유**
미들웨어는 `Authorization`을 우선 읽고, 다음 `x-api-key`, 마지막 `x-goog-api-key`를 읽습니다. 동시에 여러 Header를 보내면 앞에 있는 것이 틀리면 뒤에 있는 것이 맞아도 사용되지 않습니다.

```bash
 # 권장 작성법: Authorization + Bearer
curl -i http://127.0.0.1:8045/v1/models \
  -H "Authorization: Bearer sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

**예상 결과**: `HTTP/1.1 200 OK`(또는 최소한 더 이상 401이 아님)

::: info 프록시의 Authorization 호환 세부 정보
`auth_middleware()`는 `Authorization`의 값을 `Bearer ` 접두사로 한 번 제거합니다. `Bearer ` 접두사가 없으면 전체 값을 key로 비교합니다. 문서는 여전히 `Authorization: Bearer <key>`를 권장합니다(일반적인 SDK 규약에 더 가깝습니다).
:::

**반드시 `x-api-key`를 사용해야 한다면**:

```bash
curl -i http://127.0.0.1:8045/v1/models \
  -H "x-api-key: sk-REPLACE_WITH_YOUR_PROXY_API_KEY"
```

---

## 일반적인 문제(모두 소스 코드에서 실제 발생함)

| 현상 | 실제 원인 | 해결 방법 |
| --- | --- | --- |
| `auth_mode=auto`이지만 로컬 호출이 여전히 401 | `allow_lan_access=true`로 인해 `auto`가 `all_except_health`로 유효함 | `allow_lan_access`를 끄거나 클라이언트에 key를 추가하세요 |
| "명백히 x-api-key를 가지고 있는데" 여전히 401 | 동시에 불일치하는 `Authorization`을 가지고 있어 미들웨어가 우선 사용함 | 불필요한 Header를 삭제하고 확인한 올바른 하나만 유지하세요 |
| `Authorization: Bearer<key>`가 여전히 401 | `Bearer` 뒤에 공백이 없어 `Bearer ` 접두사 제거 불가 | `Authorization: Bearer <key>`로 변경 |
| 모든 요청이 401이고 로그에 `api_key is empty` 표시 | `proxy.api_key`가 비어 있음 | GUI에서 다시 생성/설정하여 비어 있지 않은 key를 만드세요 |

## 이 과정 요약

- 먼저 `/healthz`로 401이 프록시 인증 계층에서 오는지 찾아내기
- 다음 `auth_mode` 확인(특히 `auto`의 effective mode)
- 마지막으로 확인한 올바른 Header 하나만 가지고 검증(Header 우선순위 함정 피하기)

## 다음 과정 예고

> 다음 과정에서는 **[429/용량 오류: 계정 로테이션의 올바른 예상과 모델 용량 고갈의 오해](../429-rotation/)**를 학습합니다.
>
> 배울 내용:
> - 429가 "할당량 부족"인지 "상류 속도 제한"인지
> - 계정 로테이션의 올바른 예상(언제 자동으로 전환되고 언제 안 되는지)
> - 구성으로 429 확률을 낮추는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능        | 파일 경로                                                                                             | 행 번호    |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------- |
| ProxyAuthMode 열거형 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L5-L18) | 5-18 |
| ProxyConfig: allow_lan_access/auth_mode/api_key 및 기본값 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L258) | 174-258 |
| auto 모드 구문 분석(effective_auth_mode) | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L1-L30) | 1-30 |
| 인증 미들웨어(Header 추출 및 우선순위, /healthz 제외, OPTIONS 통과) | [`src-tauri/src/proxy/middleware/auth.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/middleware/auth.rs#L14-L77) | 14-77 |
| /healthz 라우팅 등록 및 미들웨어 순서 | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L170-L193) | 170-193 |
| 인증 문서(모드 및 클라이언트 규약) | [`docs/proxy/auth.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/docs/proxy/auth.md#L1-L45) | 1-45 |

**핵심 열거형**:
- `ProxyAuthMode::{Off, Strict, AllExceptHealth, Auto}`: 인증 모드

**핵심 함수**:
- `ProxySecurityConfig::effective_auth_mode()`: `auto`를 실제 정책으로 구문 분석
- `auth_middleware()`: 인증 실행(Header 추출 순서 및 /healthz 제외 포함)

</details>
