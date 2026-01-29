---
title: "Gateway 시작: 데몬 및 실행 모드 | Clawdbot 튜토리얼"
sidebarTitle: "Gateway 항상 온라인"
subtitle: "Gateway 시작: 데몬 및 실행 모드"
description: "Clawdbot Gateway 데몬을 시작하는 방법을 학습합니다. 개발 모드와 프로덕션 모드의 차이를 이해하고, 일반적인 시작 명령 및 매개변수 구성을 마스터합니다."
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# Gateway 시작: 데몬 및 실행 모드

## 학습 후 할 수 있는 것

- 명령줄을 사용하여 Gateway 포그라운드 프로세스 시작
- Gateway를 백그라운드 데몬으로 구성(macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- 다른 바인딩 모드(loopback / LAN / Tailnet) 및 인증 방식 이해
- 개발 모드와 프로덕션 모드 간 전환
- `--force`를 사용하여 점유된 포트 강제 해제

## 현재의 어려움

이미 마법사 구성을 완료했으며, Gateway의 기본 설정이 준비되었습니다. 하지만:

- 매번 Gateway를 사용할 때마다 터미널에서 수동으로 명령을 실행해야 합니까?
- 터미널 창을 닫으면 Gateway가 중지되고 AI 어시스턴트도 "오프라인"이 됩니까?
- LAN 또는 Tailscale 네트워크에서 Gateway에 액세스하고 싶지만 구성 방법을 모릅니다?
- Gateway가 시작 실패하지만 구성 문제인지 포트가 사용 중인지 알 수 없습니까?

## 이 기능을 사용하는 시기

**권장 시작 방식**:

| 시나리오                  | 사용 명령                               | 설명                                   |
|--- | --- | ---|
| 일상 사용                | `clawdbot gateway install` + `clawdbot gateway start` | 백그라운드 서비스로 자동 시작                  |
| 개발 디버깅                | `clawdbot gateway --dev`                     | 개발 구성 생성, 자동 리로드                  |
| 임시 테스트                | `clawdbot gateway`                           | 포그라운드 실행, 로그가 터미널에 직접 출력            |
| 포트 충돌                | `clawdbot gateway --force`                   | 포트 강제 해제 후 시작                    |
| LAN 액세스              | `clawdbot gateway --bind lan`                 | LAN 장치 연결 허용                   |
| Tailscale 원격 액세스         | `clawdbot gateway --tailscale serve`          | Tailscale 네트워크를 통해 Gateway 노출          |

## 🎒 시작 전 준비 사항

::: warning 사전 검사

Gateway를 시작하기 전에 다음을 확인하십시오:

1. ✅ 마법사 구성 완료(`clawdbot onboard`) 또는 `gateway.mode=local` 수동 설정
2. ✅ AI 모델 구성 완료(Anthropic / OpenAI / OpenRouter 등)
3. ✅ 외부 네트워크(LAN / Tailnet) 액세스가 필요한 경우 인증 방식 구성 완료
4. ✅ 사용 시나리오 이해(로컬 개발 vs 프로덕션 실행)

:::

## 핵심 개념

**Gateway란 무엇인가?**

Gateway는 Clawdbot의 WebSocket 제어 평면이며 다음을 담당합니다:

- **세션 관리**: 모든 AI 대화 세션 상태 유지
- **채널 연결**: WhatsApp, Telegram, Slack 등 12+ 종류의 메시지 채널 연결
- **도구 호출**: 브라우저 자동화, 파일 작업, 예약 작업 등 도구 실행 조정
- **노드 관리**: macOS / iOS / Android 장치 노드 관리
- **이벤트 배포**: AI 생각 진도, 도구 호출 결과 등 실시간 이벤트 푸시

**왜 데몬이 필요한가?**

백그라운드 서비스로 실행되는 Gateway는 다음과 같은 장점이 있습니다:

- **지속 온라인**: 터미널을 닫아도 AI 어시스턴트 사용 가능
- **자동 시작**: 시스템 재부팅 후 서비스 자동 복원(macOS LaunchAgent / Linux systemd)
- **통합 관리**: `start` / `stop` / `restart` 명령으로 수명 주기 제어
- **로그 집중**: 시스템 수준 로그 수집, 문제 해결 용이

## 따라 하기

### 1단계: Gateway 시작(포그라운드 모드)

**이유**

포그라운드 모드는 개발 테스트에 적합하며, 로그가 터미널에 직접 출력되어 Gateway 상태를 실시간으로 보기 쉽습니다.

```bash
# 기본 구성 사용하여 시작(127.0.0.1:18789 수신)
clawdbot gateway

# 지정된 포트로 시작
clawdbot gateway --port 19001

# 상세 로그 활성화
clawdbot gateway --verbose
```

**확인해야 할 내용**:

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip 체크포인트

- `listening on ws://...`가 표시되면 시작 성공
- 표시된 PID(프로세스 ID)를 기록하여 후속 디버깅에 사용
- 기본 포트는 18789이며, `--port`로 수정 가능

:::

### 2단계: 바인딩 모드 구성

**이유**

기본적으로 Gateway는 로컬 루프백 주소(`127.0.0.1`)만 수신하므로, 로컬 시스템만 연결할 수 있습니다. LAN 또는 Tailscale 네트워크에서 액세스하려면 바인딩 모드를 조정해야 합니다.

```bash
# 로컬 루프백 전용(기본, 가장 안전)
clawdbot gateway --bind loopback

# LAN 액세스(인증 필요)
clawdbot gateway --bind lan --token "your-token"

# Tailscale 네트워크 액세스
clawdbot gateway --bind tailnet --token "your-token"

# 자동 감지(로컬 + LAN)
clawdbot gateway --bind auto
```

**확인해야 할 내용**:

```bash
# loopback 모드
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# lan 모드
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning 보안 경고

⚠️ **비 loopback 주소에 바인딩할 때는 반드시 인증을 구성해야 합니다!**

- `--bind lan` / `--bind tailnet` 시 반드시 `--token` 또는 `--password`를 전달해야 함
- 그렇지 않으면 Gateway가 시작을 거부하고 오류를 보고함: `Refusing to bind gateway to lan without auth`
- 인증 토큰은 `gateway.auth.token` 구성 또는 `--token` 매개변수를 통해 전달

:::

### 3단계: 데몬으로 설치(macOS / Linux / Windows)

**이유**

데몬은 Gateway를 백그라운드에서 실행하며, 터미널 창을 닫아도 영향을 받지 않습니다. 시스템 재부팅 후 자동으로 시작되어 AI 어시스턴트가 항상 온라인 상태를 유지합니다.

```bash
# 시스템 서비스로 설치(macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
clawdbot gateway install

# 서비스 시작
clawdbot gateway start

# 서비스 상태 보기
clawdbot gateway status

# 서비스 재시작
clawdbot gateway restart

# 서비스 중지
clawdbot gateway stop
```

**확인해야 할 내용**:

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip 체크포인트

- `clawdbot gateway status`를 실행하여 서비스 상태가 `active` / `running`인지 확인
- 서비스가 `loaded`로 표시되지만 `runtime: inactive`인 경우 `clawdbot gateway start` 실행
- 데몬 로그는 `~/.clawdbot/logs/gateway.log`에 기록됨

:::
### 4단계: 포트 충돌 처리(--force)

**이유**

기본 포트 18789가 다른 프로세스에 의해 사용될 수 있습니다(예: 이전 Gateway 인스턴스). `--force`를 사용하여 포트를 자동으로 해제할 수 있습니다.

```bash
# 포트 강제 해제 후 Gateway 시작
clawdbot gateway --force
```

**확인해야 할 내용**:

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info 작동 원리

`--force`는 다음 작업을 순서대로 수행합니다:

1. SIGTERM으로 프로세스를 우아하게 종료 시도(700ms 대기)
2. 종료되지 않으면 SIGKILL로 강제 종료
3. 포트 해제 대기(최대 2초)
4. 새 Gateway 프로세스 시작

:::

### 5단계: 개발 모드(--dev)

**이유**

개발 모드는 독립적인 구성 파일과 디렉토리를 사용하여 프로덕션 환경 오염을 방지합니다. TypeScript 핫 리로드를 지원하며, 코드를 수정한 후 자동으로 Gateway를 다시 시작합니다.

```bash
# 개발 모드 시작(dev profile + workspace 생성)
clawdbot gateway --dev

# 개발 구성 재설정(자격 증명 + 세션 + 작업 공간 삭제)
clawdbot gateway --dev --reset
```

**확인해야 할 내용**:

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip 개발 모드 특징

- 구성 파일: `~/.clawdbot-dev/clawdbot.json`(프로덕션 구성과 독립)
- 작업 공간 디렉토리: `~/clawd-dev`
- `BOOT.md` 스크립트 실행 건너뜀
- 기본 바인딩 loopback, 인증 불필요

:::

### 6단계: Tailscale 통합

**이유**

Tailscale은 공용 IP나 포트 포워딩 없이 안전한 사설 네트워크를 통해 원격 Gateway에 액세스할 수 있습니다.

```bash
# Tailscale Serve 모드(권장)
clawdbot gateway --tailscale serve

# Tailscale Funnel 모드(추가 인증 필요)
clawdbot gateway --tailscale funnel --auth password
```

**확인해야 할 내용**:

```bash
# serve 모드
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# funnel 모드
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip 인증 구성

Tailscale 통합은 두 가지 인증 방식을 지원합니다:

1. **Identity Headers**(권장): `gateway.auth.allowTailscale=true` 설정, Tailscale 신원이 자동으로 인증을 만족
2. **Token / Password**: 전통적인 인증 방식, `--token` 또는 `--password`를 수동으로 전달

:::

### 7단계: Gateway 상태 확인

**이유**

Gateway가 정상적으로 실행 중이고 RPC 프로토콜에 액세스할 수 있는지 확인합니다.

```bash
# 전체 상태 보기(서비스 + RPC 감지)
clawdbot gateway status

# RPC 감지 건너뜀(서비스 상태만)
clawdbot gateway status --no-probe

# 헬스 체크
clawdbot gateway health

# 모든 도달 가능한 Gateway 감지
clawdbot gateway probe
```

**확인해야 할 내용**:

```bash
# status 명령 출력
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# health 명령 출력
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip 문제 해결

`status`가 `Runtime: running`으로 표시되지만 `RPC probe: failed`인 경우:

1. 포트가 올바른지 확인: `clawdbot gateway status`
2. 인증 구성 확인: LAN / Tailnet에 바인딩되었지만 인증을 제공하지 않았습니까?
3. 로그 확인: `cat ~/.clawdbot/logs/gateway.log`
4. `clawdbot doctor`를 실행하여 상세 진단 받기

:::

## 일반적인 문제 해결

### ❌ 오류: Gateway 시작 거부

**오류 메시지**:
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**원인**: `gateway.mode`가 `local`로 설정되지 않음

**해결 방법**:

```bash
# 방법 1: 마법사 구성 실행
clawdbot onboard

# 방법 2: 구성 파일 수동 수정
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# 방법 3: 일시적으로 검사 건너뜀(권장하지 않음)
clawdbot gateway --allow-unconfigured
```

### ❌ 오류: LAN에 바인딩되었지만 인증 없음

**오류 메시지**:
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**원인**: 비 loopback 바인딩은 반드시 인증을 구성해야 함(보안 제한)

**해결 방법**:

```bash
# 구성 파일을 통해 인증 설정
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# 또는 명령줄을 통해 전달
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ 오류: 포트가 이미 사용 중

**오류 메시지**:
```
Error: listen EADDRINUSE: address already in use :::18789
```

**원인**: 다른 Gateway 인스턴스 또는 다른 프로그램이 포트 점유

**해결 방법**:

```bash
# 방법 1: 포트 강제 해제
clawdbot gateway --force

# 방법 2: 다른 포트 사용
clawdbot gateway --port 19001

# 방법 3: 프로세스 수동 찾기 및 종료
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```

### ❌ 오류: dev 모드 reset은 --dev 필요

**오류 메시지**:
```
Use --reset with --dev.
```

**원인**: `--reset`은 개발 모드에서만 사용할 수 있으며, 프로덕션 데이터의 실수 삭제 방지

**해결 방법**:

```bash
# 올바른 개발 환경 재설정 명령
clawdbot gateway --dev --reset
```

### ❌ 오류: 서비스가 설치되었지만 여전히 포그라운드 모드 사용

**현상**: `clawdbot gateway`를 실행할 때 "Gateway already running locally" 메시지 표시

**원인**: 데몬이 이미 백그라운드에서 실행 중

**해결 방법**:

```bash
# 백그라운드 서비스 중지
clawdbot gateway stop

# 또는 서비스 재시작
clawdbot gateway restart

# 그런 다음 포그라운드 시작(디버깅이 필요한 경우)
clawdbot gateway --port 19001  # 다른 포트 사용
```

## 수업 요약

이 수업에서 다음을 학습했습니다:

✅ **시작 방식**: 포그라운드 모드 vs 데몬
✅ **바인딩 모드**: loopback / LAN / Tailnet / Auto
✅ **인증 방식**: Token / Password / Tailscale Identity
✅ **개발 모드**: 독립 구성, 핫 리로드, --reset 재설정
✅ **문제 해결**: `status` / `health` / `probe` 명령
✅ **서비스 관리**: `install` / `start` / `stop` / `restart` / `uninstall`

**핵심 명령 요약**:

| 시나리오                   | 명령                                        |
|--- | ---|
| 일상 사용(서비스)       | `clawdbot gateway install && clawdbot gateway start` |
| 개발 디버깅              | `clawdbot gateway --dev`                     |
| 임시 테스트              | `clawdbot gateway`                           |
| 포트 강제 해제          | `clawdbot gateway --force`                   |
| LAN 액세스           | `clawdbot gateway --bind lan --token "xxx"`   |
| Tailscale 원격       | `clawdbot gateway --tailscale serve`          |
| 상태 보기              | `clawdbot gateway status`                     |
| 헬스 체크              | `clawdbot gateway health`                     |

## 다음 수업 예고

> 다음 수업에서는 **[첫 번째 메시지 보내기](../first-message/)**를 학습합니다.
>
> 배울 내용:
> - WebChat을 통해 첫 번째 메시지 보내기
> - 구성된 채널(WhatsApp/Telegram 등)을 통해 AI 어시스턴트와 대화
> - 메시지 라우팅 및 응답 프로세스 이해

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능                        | 파일 경로                                                                                   | 라인 번호      |
|--- | --- | ---|
| Gateway 시작 입구            | [`src/cli/gateway-cli/run.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/gateway-cli/run.ts) | 55-310   |
| 데몬 서비스 추상화         | [`src/daemon/service.ts`](https://github.com/moltbot/moltbot/blob/main/src/daemon/service.ts) | 66-155    |
| 사이드바 서비스 시작           | [`src/gateway/server-startup.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-startup.ts) | 26-160    |
| Gateway 서버 구현         | [`src/gateway/server.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server.ts) | 1-500     |
| 프로그램 매개변수 파싱             | [`src/daemon/program-args.ts`](https://github.com/moltbot/moltbot/blob/main/src/daemon/program-args.ts) | 1-250     |
| 시작 로그 출력              | [`src/gateway/server-startup-log.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/server-startup-log.ts) | 7-40      |
| 개발 모드 구성             | [`src/cli/gateway-cli/dev.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/gateway-cli/dev.ts) | 1-100     |
| 포트 해제 로직             | [`src/cli/ports.ts`](https://github.com/moltbot/moltbot/blob/main/src/cli/ports.ts) | 1-80      |

**핵심 상수**:
- 기본 포트: `18789`(출처: `src/gateway/server.ts`)
- 기본 바인딩: `loopback`(출처: `src/cli/gateway-cli/run.ts:175`)
- 개발 모드 구성 경로: `~/.clawdbot-dev/`(출처: `src/cli/gateway-cli/dev.ts`)

**핵심 함수**:
- `runGatewayCommand()`: Gateway CLI 메인 입구, 명령줄 매개변수 및 시작 로직 처리
- `startGatewayServer()`: WebSocket 서버 시작, 지정된 포트 수신
- `forceFreePortAndWait()`: 포트 강제 해제 및 대기
- `resolveGatewayService()`: 플랫폼에 따라 해당 데몬 구현 반환(macOS LaunchAgent / Linux systemd / Windows Scheduled Task)
- `logGatewayStartup()`: Gateway 시작 정보 출력(모델, 수신 주소, 로그 파일)

</details>
