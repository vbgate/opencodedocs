---
title: "소개: 로컬 AI 게이트웨이 | Antigravity Manager"
sidebarTitle: "로컬 AI 게이트웨이란 무엇인가"
subtitle: "Antigravity Tools란 무엇인가: '계정 + 프로토콜'을 로컬 AI 게이트웨이로"
description: "Antigravity Manager의 핵심 포지셔닝을 이해합니다. 데스크톱 버전 및 로컬 HTTP 게이트웨이를 제공하여 다중 프로토콜 엔드포인트와 계정 풀 스케줄링을 지원하고, 로컬 역방향 프록시를 빠르게 시작하며 일반적인 설정 오류를 피할 수 있도록 돕습니다."
tags:
  - "입문"
  - "개념"
  - "로컬 게이트웨이"
  - "API Proxy"
prerequisite: []
order: 1
---

# Antigravity Tools란 무엇인가: "계정 + 프로토콜"을 로컬 AI 게이트웨이로

많은 AI 클라이언트/SDK의 접근 장벽은 "API를 호출할 줄 아는지"가 아니라 "어떤 프로토콜을 어떻게 연결할지, 여러 계정을 어떻게 관리할지, 실패 시 자동 복구를 어떻게 할지"에 있습니다. Antigravity Tools는 이 세 가지를 로컬 게이트웨이로 통합하려고 합니다.

## Antigravity Tools란 무엇인가?

**Antigravity Tools**는 데스크톱 애플리케이션입니다: GUI에서 계정 및 설정을 관리하고, 로컬에 HTTP 역방향 프록시 서비스를 시작하여 다양한 공급업체/프로토콜의 요청을 통합하여 업스트림으로 전달하고 응답을 클라이언트에 익숙한 형식으로 변환합니다.

## 학습 완료 후 가능한 작업

- Antigravity Tools가 해결하는 문제(그리고 해결하지 않는 문제) 명확히 설명
- 핵심 구성 파악: GUI, 계정 풀, HTTP 역방향 프록시 게이트웨이, 프로토콜 어댑터
- 기본 보안 경계(127.0.0.1, 포트, 인증 모드) 및 언제 변경해야 하는지 이해
- 다음에 어느 장으로 가야 하는지 알기: 설치, 계정 추가, 역방향 프록시 시작, 클라이언트 연결

## 현재 겪고 있는 문제

다음과 같은 문제를 겪을 수 있습니다:

- 동일한 클라이언트가 OpenAI/Anthropic/Gemini 세 가지 프로토콜을 지원해야 하는데, 설정이 자주 혼동됨
- 여러 계정이 있지만, 전환, 순환, 속도 제한 재시도가 모두 수동임
- 요청 실패 시, "계정 무효화"인지 "업스트림 속도 제한/용량 소진"인지 로그만 보고 추측해야 함

Antigravity Tools의 목표는 이러한 "부수 작업"을 로컬 게이트웨이로 통합하여, 클라이언트/SDK가 한 가지만 신경 쓰게 하는 것: 요청을 로컬로 보내는 것.

## 핵심 개념

로컬 **AI 스케줄링 게이트웨이**로 이해할 수 있으며, 세 개의 계층으로 구성됩니다:

1) GUI(데스크톱 애플리케이션)
- 계정, 설정, 모니터링, 통계를 관리합니다.
- 메인 페이지 포함: Dashboard, Accounts, API Proxy, Monitor, Token Stats, Settings.

2) HTTP 역방향 프록시 서비스(Axum Server)
- 다중 프로토콜 엔드포인트를 외부에 노출하고, 요청을 해당 핸들러에 전달합니다.
- 역방향 프록시 서비스는 인증, 미들웨어 모니터링, CORS, Trace 등의 계층을 마운트합니다.

3) 계정 풀 및 스케줄링(TokenManager 등)
- 로컬 계정 풀에서 사용 가능한 계정을 선택하고, 필요 시 토큰 갱신, 순환 및 자가 복구를 수행합니다.

::: info "로컬 게이트웨이"란 무엇인가?
여기서 "로컬"은 문자 그대로의 의미입니다: 서비스가 자신의 컴퓨터에서 실행되며, 클라이언트(Claude Code, OpenAI SDK, 다양한 타사 클라이언트)가 Base URL을 `http://127.0.0.1:<port>`로 가리키면 요청이 먼저 로컬로 도착한 다음 Antigravity Tools에서 업스트림으로 전달됩니다.
:::

## 외부에 제공하는 엔드포인트

역방향 프록시 서비스는 하나의 Router에 여러 세트의 프로토콜 엔드포인트를 등록합니다. 먼저 이러한 "진입점"을 기억하세요:

- OpenAI 호환: `/v1/chat/completions`, `/v1/completions`, `/v1/responses`, `/v1/models`
- Anthropic 호환: `/v1/messages`, `/v1/messages/count_tokens`
- Gemini 원생: `/v1beta/models`, `/v1beta/models/:model`, `/v1beta/models/:model/countTokens`
- 건강 확인: `GET /healthz`

클라이언트가 그중 어떤 프로토콜에 연결할 수 있다면, 이론적으로 "Base URL 변경"을 통해 요청을 이 로컬 게이트웨이로 보낼 수 있습니다.

## 기본 보안 경계(건너뛰지 마세요)

이러한 "로컬 역방향 프록시"의 가장 큰 함정은 종종 기능 부족이 아니라 실수로 외부에 노출하는 것입니다.

먼저 몇 가지 기본값(모두 기본 구성에서 옴)을 기억하세요:

- 기본 포트: `8045`
- 기본 로컬 액세스만: `allow_lan_access=false`, 수신 주소는 `127.0.0.1`
- 기본 인증 모드: `auth_mode=off` (클라이언트가 key를 가져오지 않아도 됨)
- 기본적으로 `sk-...` 형식의 `api_key`를 생성합니다 (인증이 필요할 때 활성화)

::: warning 언제 인증을 반드시 활성화해야 하는가?
LAN 액세스를 활성화(`allow_lan_access=true`, 수신 주소가 `0.0.0.0`로 변경)하는 즉시, 동시에 인증을 활성화하고 API Key를 암호처럼 관리해야 합니다.
:::

## Antigravity Tools를 언제 사용해야 하는가

다음 시나리오에 더 적합합니다:

- 여러 AI 클라이언트/SDK가 있고, 하나의 Base URL로 통합하고 싶을 때
- 다른 프로토콜(OpenAI/Anthropic/Gemini)을 동일한 "로컬 출구"로 통합하고 싶을 때
- 여러 계정이 있고, 시스템이 순환 및 안정성 처리를 담당하기를 원할 때

"두 줄 코드로 공식 API 직접 호출"만 원하고, 계정/프로토콜이 매우 고정되어 있다면 약간 무거울 수 있습니다.

## 함께 실습: 올바른 사용 순서 먼저 수립

이 수업은 세부 설정을 가르치지 않고, 주요 순서만 정렬하여 건너뛰어 사용하는 것을 방지합니다:

### 1단계: 먼저 설치 후 시작

**이유**
데스크톱 버전은 계정 관리 및 역방향 프록시 서비스 시작을 담당합니다. 이것이 없으면 이후의 OAuth/역방향 프록시가 불가능합니다.

다음 장에서 README의 설치 방법대로 설치를 완료하세요.

**예상 화면**: Antigravity Tools를 열고 Dashboard 페이지를 볼 수 있습니다.

### 2단계: 최소 하나의 계정 추가

**이유**
역방향 프록시 서비스는 계정 풀에서 사용 가능한 ID를 가져와 업스트림으로 요청을 보내야 합니다; 계정이 없으면 게이트웨이도 "대신 호출"할 수 없습니다.

「계정 추가」 장에서 OAuth 또는 Refresh Token 프로세스를 따라 계정을 추가하세요.

**예상 화면**: Accounts 페이지에 계정이 나타나고 할당량/상태 정보를 볼 수 있습니다.

### 3단계: API Proxy 시작 및 /healthz로 최소 검증

**이유**
먼저 `GET /healthz`로 "로컬 서비스 실행 중"을 확인한 다음 클라이언트를 연결하면 문제 해결이 훨씬 쉬워집니다.

「로컬 역방향 프록시 시작 및 첫 번째 클라이언트 연결」 장에서 완성 루프를 완료하세요.

**예상 화면**: 클라이언트/SDK가 로컬 Base URL을 통해 성공적으로 응답을 받을 수 있습니다.

## 흔한 오류

| 시나리오 | 잘못된 방법 (❌) | 권장 방법 (✓) |
|--- | --- | ---|
| 휴대폰/다른 컴퓨터가 액세스하게 하고 싶음 | `allow_lan_access=true`를 열지만 인증 설정하지 않음 | 동시에 인증을 활성화하고 LAN에서 먼저 `GET /healthz` 검증 |
| 클라이언트가 404 보고 | host/port만 변경, 클라이언트가 `/v1`을 어떻게 연결하는지 고려하지 않음 | 먼저 클라이언트의 base_url 연결 전략 확인 후 `/v1` 접두사 필요 여부 결정 |
| 처음부터 Claude Code 문제 해결 | 복잡한 클라이언트 직접 연결, 실패 후 어디서 확인할지 모름 | 먼저 최소 완성 루프 실행: Proxy 시작 -> `GET /healthz` -> 클라이언트 연결 |

## 이 수업 요약

- Antigravity Tools의 포지셔닝은 "데스크톱 + 로컬 HTTP 역방향 프록시 게이트웨이": GUI 관리, Axum이 다중 프로토콜 엔드포인트 제공
- 로컬 인프라로 취급: 먼저 설치 -> 계정 추가 -> Proxy 시작 -> 클라이언트 연결
- 기본적으로 `127.0.0.1:8045`만 수신, LAN에 노출하려면 반드시 동시에 인증 활성화

## 다음 수업 예고

> 다음 수업에서 설치 단계를 완료합니다: **[설치 및 업그레이드: 데스크톱 최적 설치 경로](../installation/)**.
>
> 배울 내용:
> - README에 나열된 여러 설치 방법(및 우선순위)
> - 업그레이드 진입점 및 일반적인 시스템 차단 처리 방식

---

## 부록: 소스 코드 참조

<details>
<summary><strong>확장하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-23

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 제품 포지셔닝(로컬 AI 중계소/프로토콜 간극) | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L35-L77) | 35-77 |
| Router 엔드포인트 개요(OpenAI/Claude/Gemini/healthz) | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |
| 기본 포트/기본 로컬만/기본 key 및 바인드 주소 로직 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L174-L291) | 174-291 |
|--- | --- | ---|
| GUI 페이지 라우터 구조(Dashboard/Accounts/API Proxy/Monitor/Token Stats/Settings) | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L19-L48) | 19-48 |

**핵심 기본값**:
- `ProxyConfig.port = 8045`: 역방향 프록시 서비스 기본 포트
- `ProxyConfig.allow_lan_access = false`: 기본 로컬 액세스만
- `ProxyAuthMode::default() = off`: 기본 인증 요구하지 않음

</details>
