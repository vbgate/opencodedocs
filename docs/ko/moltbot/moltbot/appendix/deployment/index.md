---
title: "Clawdbot 배포 완전 가이드: 로컬, Docker, Nix, Fly.io, Hetzner VPS 및 exe.dev | Clawdbot 튜토리얼"
sidebarTitle: "Gateway 24/7 운영하기"
subtitle: "배포 옵션"
description: "다양한 플랫폼에서 Clawdbot을 배포하는 방법을 학습합니다: 로컬 설치, Docker 컨테이너화, Nix 선언적 구성, Fly.io 클라우드 배포, Hetzner VPS 호스팅 및 exe.dev 가상 호스트. 각 배포 방식의 특징, 적용 시나리오, 구성 단계 및 보안 모범 사례를 알아봅니다."
tags:
  - "배포"
  - "설치"
  - "Docker"
  - "Nix"
  - "클라우드 배포"
prerequisite:
  - "start-getting-started"
order: 360
---

# 배포 옵션

## 학습 목표

이 강의를 마치면 다음을 할 수 있습니다:

- 요구 사항에 따라 가장 적합한 배포 방식 선택 (로컬, Docker, Nix, 클라우드 서비스)
- 로컬 환경에서 Clawdbot 설치 및 실행
- Docker를 사용하여 Gateway 컨테이너화 배포
- Nix를 통한 Clawdbot 선언적 관리
- Gateway를 Fly.io, Hetzner VPS 또는 exe.dev에 배포
- 원격 접속 및 보안 모범 사례 구성

## 현재 상황

Clawdbot을 사용하고 싶지만 어떤 배포 방식을 선택해야 할지 모르겠습니다:

- 로컬 설치가 가장 간단하지만, 컴퓨터를 끄면 사용할 수 없습니다
- 클라우드에서 24/7 운영하고 싶지만, 어떤 클라우드 서비스가 적합한지 모르겠습니다
- 구성 오류가 두렵고, 가장 안정적인 배포 방안을 찾고 싶습니다
- 여러 기기에서 동일한 Gateway에 접속해야 하지만, 어떻게 구현해야 할지 모르겠습니다

## 언제 사용하나요

| 배포 방식 | 적용 시나리오 |
| --- | --- |
| **로컬 설치** | 개인 컴퓨터, 개발 테스트, 빠른 시작 |
| **Docker** | 격리 환경, 서버 배포, 빠른 재구축 |
| **Nix** | 재현 가능한 배포, NixOS/Home Manager 사용자, 버전 롤백 필요 |
| **Fly.io** | 클라우드 24/7 운영, 자동 HTTPS, 간소화된 운영 |
| **Hetzner VPS** | 자체 VPS, 완전한 제어, 저비용 24/7 |
| **exe.dev** | 저렴한 Linux 호스트, VPS 직접 구성 불필요 |

## 🎒 시작 전 준비

시작하기 전에 확인하세요:

::: warning 환경 요구 사항
- Node.js ≥ 22 (로컬 설치 필수)
- Docker Desktop + Docker Compose v2 (Docker 배포 필수)
- Nix flakes + Home Manager (Nix 배포 필수)
- SSH 클라이언트 (클라우드 배포 접속 필수)
- 기본 터미널 조작 능력 (복사, 붙여넣기, 명령 실행)
:::

::: tip 권장 도구
 - Clawdbot을 처음 접하신다면 [빠른 시작](../../start/getting-started/)부터 시작하세요
- AI 어시스턴트 (Claude, Cursor 등)를 사용하면 구성 과정을 가속화할 수 있습니다
- API Key (Anthropic, OpenAI 등)와 채널 자격 증명을 잘 보관하세요
:::

## 배포 방식 비교

### 로컬 설치

**적합**: 개인 컴퓨터, 개발 테스트, 빠른 시작

**장점**:
- ✅ 가장 간단하고 직접적, 추가 인프라 불필요
- ✅ 빠른 시작, 편리한 디버깅
- ✅ 구성 변경 즉시 적용

**단점**:
- ❌ 컴퓨터를 끄면 사용 불가
- ❌ 24/7 서비스에 부적합
- ❌ 다중 기기 동기화에 추가 구성 필요

### Docker 배포

**적합**: 서버 배포, 격리 환경, CI/CD

**장점**:
- ✅ 환경 격리, 쉬운 정리 및 재구축
- ✅ 크로스 플랫폼 통합 배포 가능
- ✅ 샌드박스 격리 도구 실행 지원
- ✅ 구성 버전 관리 가능

**단점**:
- ❌ Docker 지식 필요
- ❌ 초기 설정이 다소 복잡

### Nix 배포

**적합**: NixOS 사용자, Home Manager 사용자, 재현 가능한 배포 필요

**장점**:
- ✅ 선언적 구성, 재현 가능
- ✅ 빠른 롤백 (`home-manager switch --rollback`)
- ✅ 모든 컴포넌트 버전 고정
- ✅ Gateway + macOS app + 도구 전체 관리

**단점**:
- ❌ 학습 곡선이 가파름
- ❌ Nix 생태계에 익숙해야 함

### 클라우드 배포 (Fly.io / Hetzner / exe.dev)

**적합**: 24/7 온라인, 원격 접속, 팀 협업

**장점**:
- ✅ 24/7 온라인, 로컬 머신에 의존하지 않음
- ✅ 자동 HTTPS, 수동 인증서 불필요
- ✅ 빠른 확장 가능
- ✅ 다중 기기 원격 접속 지원

**단점**:
- ❌ 클라우드 서비스 비용 지불 필요
- ❌ 기본 운영 지식 필요
- ❌ 데이터가 제3자에 저장됨

---

## 로컬 설치

### npm/pnpm/bun 전역 설치 (권장)

공식 npm 저장소에서 설치하는 것이 가장 간단합니다:

::: code-group

```bash [npm]
# npm으로 설치
npm install -g clawdbot@latest
```

```bash [pnpm]
# pnpm으로 설치 (권장)
pnpm add -g clawdbot@latest
```

```bash [bun]
# bun으로 설치 (가장 빠름)
bun add -g clawdbot@latest
```

:::

설치 완료 후, 마법사를 실행합니다:

```bash
clawdbot onboard --install-daemon
```

이 명령은:
- Gateway, 채널, 모델 구성을 안내합니다
- Gateway 데몬 설치 (macOS launchd / Linux systemd)
- 기본 구성 파일 `~/.clawdbot/clawdbot.json` 설정

### 소스에서 빌드

소스에서 빌드해야 하는 경우 (개발, 커스터마이징):

::: code-group

```bash [macOS/Linux]
# 저장소 클론
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# 의존성 설치 및 빌드
pnpm install
pnpm ui:build
pnpm build

# 설치 및 실행
pnpm clawdbot onboard --install-daemon
```

```bash [Windows (WSL2)]
# WSL2에서 빌드 (권장)
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

wsl.exe -d Ubuntu bash -c "pnpm install && pnpm ui:build && pnpm build"
```

:::

::: info 개발 루프
`pnpm gateway:watch`를 실행하면 코드 수정 시 Gateway가 자동으로 리로드됩니다.
:::

---

## Docker 배포

### 빠른 시작 (권장)

제공된 스크립트로 원클릭 배포:

```bash
./docker-setup.sh
```

이 스크립트는:
- Gateway 이미지 빌드
- onboarding 마법사 실행
- 프로바이더 구성 힌트 출력
- Docker Compose로 Gateway 시작
- Gateway 토큰 생성 및 `.env`에 기록

완료 후:
1. 브라우저에서 `http://127.0.0.1:18789/` 열기
2. Control UI 설정에서 토큰 붙여넣기

스크립트는 호스트에 다음을 생성합니다:
- `~/.clawdbot/` (구성 디렉토리)
- `~/clawd` (워크스페이스 디렉토리)

### 수동 프로세스

Docker Compose 구성을 커스터마이징해야 하는 경우:

```bash
# 이미지 빌드
docker build -t clawdbot:local -f Dockerfile .

# CLI 컨테이너로 구성 완료
docker compose run --rm clawdbot-cli onboard

# Gateway 시작
docker compose up -d clawdbot-gateway
```

### 추가 마운트 (선택 사항)

컨테이너에 추가 호스트 디렉토리를 마운트하려면, `docker-setup.sh` 실행 전에 환경 변수를 설정합니다:

```bash
export CLAWDBOT_EXTRA_MOUNTS="$HOME/.codex:/home/node/.codex:ro,$HOME/github:/home/node/github:rw"
./docker-setup.sh
```

**주의 사항**:
- 경로는 Docker Desktop과 공유되어야 함 (macOS/Windows)
- `CLAWDBOT_EXTRA_MOUNTS`를 수정하면 `docker-setup.sh`를 다시 실행하여 compose 파일 재생성 필요

### 컨테이너 홈 디렉토리 영구화 (선택 사항)

`/home/node`를 컨테이너 재구축 시에도 영구화하려면:

```bash
export CLAWDBOT_HOME_VOLUME="clawdbot_home"
./docker-setup.sh
```

**주의 사항**:
- 명명된 볼륨은 `docker volume rm`으로 삭제할 때까지 영구화됨
- `CLAWDBOT_EXTRA_MOUNTS`와 함께 사용 가능

### 추가 시스템 패키지 설치 (선택 사항)

이미지에 추가 시스템 패키지를 설치해야 하는 경우 (예: 빌드 도구, 미디어 라이브러리):

```bash
export CLAWDBOT_DOCKER_APT_PACKAGES="ffmpeg build-essential"
./docker-setup.sh
```

### 채널 구성 (선택 사항)

CLI 컨테이너로 채널 구성:

::: code-group

```bash [WhatsApp]
# WhatsApp 로그인 (QR 코드 표시)
docker compose run --rm clawdbot-cli channels login
```

```bash [Telegram]
# Telegram 봇 추가
docker compose run --rm clawdbot-cli channels add --channel telegram --token "<token>"
```

```bash [Discord]
# Discord 봇 추가
docker compose run --rm clawdbot-cli channels add --channel discord --token "<token>"
```

:::

### 헬스 체크

```bash
docker compose exec clawdbot-gateway node dist/index.js health --token "$CLAWDBOT_GATEWAY_TOKEN"
```

### Agent Sandbox (호스트 Gateway + Docker 도구)

Docker는 non-main 세션의 도구 실행을 샌드박스 격리하는 데에도 사용할 수 있습니다. 자세한 내용: [Sandboxing](https://docs.clawd.bot/gateway/sandboxing)

---

## Nix 설치

**권장 방식**: [nix-clawdbot](https://github.com/clawdbot/nix-clawdbot) Home Manager 모듈 사용

### 빠른 시작

이 내용을 AI 어시스턴트 (Claude, Cursor 등)에 붙여넣으세요:

```text
I want to set up nix-clawdbot on my Mac.
Repository: github:clawdbot/nix-clawdbot

What I need you to do:
1. Check if Determinate Nix is installed (if not, install it)
2. Create a local flake at ~/code/clawdbot-local using templates/agent-first/flake.nix
3. Help me create a Telegram bot (@BotFather) and get my chat ID (@userinfobot)
4. Set up secrets (bot token, Anthropic key) - plain files at ~/.secrets/ is fine
5. Fill in the template placeholders and run home-manager switch
6. Verify: launchd running, bot responds to messages

Reference nix-clawdbot README for module options.
```

> **📦 전체 가이드**: [github.com/clawdbot/nix-clawdbot](https://github.com/clawdbot/nix-clawdbot)

### Nix 모드 런타임 동작

`CLAWDBOT_NIX_MODE=1`을 설정하면 (nix-clawdbot이 자동 설정):

- 구성이 결정적이 되고, 자동 설치 프로세스가 비활성화됨
- 의존성이 누락되면 Nix 전용 수정 정보 표시
- UI 표면에 읽기 전용 Nix 모드 배너 표시

macOS에서 GUI 앱은 셸 환경 변수를 자동으로 상속하지 않습니다. defaults를 통해 Nix 모드를 활성화할 수도 있습니다:

```bash
defaults write com.clawdbot.mac clawdbot.nixMode -bool true
```

### 구성 및 상태 경로

Nix 모드에서는 다음 환경 변수를 명시적으로 설정합니다:

- `CLAWDBOT_STATE_DIR` (기본값: `~/.clawdbot`)
- `CLAWDBOT_CONFIG_PATH` (기본값: `$CLAWDBOT_STATE_DIR/clawdbot.json`)

이렇게 하면 런타임 상태와 구성이 Nix가 관리하는 불변 저장소 외부에 유지됩니다.

---

## Fly.io 클라우드 배포

**적합**: 클라우드 24/7 운영, 간소화된 운영, 자동 HTTPS 필요

### 필요한 것

- [flyctl CLI](https://fly.io/docs/hands-on/install-flyctl/)
- Fly.io 계정 (무료 티어 사용 가능)
- 모델 인증: Anthropic API Key (또는 다른 프로바이더 Key)
- 채널 자격 증명: Discord 봇 토큰, Telegram 토큰 등

### 1단계: Fly 앱 생성

```bash
# 저장소 클론
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot

# 새 Fly 앱 생성 (자신만의 이름 선택)
fly apps create my-clawdbot

# 영구 볼륨 생성 (1GB면 보통 충분)
fly volumes create clawdbot_data --size 1 --region iad
```

::: tip 리전 선택
가장 가까운 리전을 선택하세요. 일반적인 옵션:
- `lhr` (런던)
- `iad` (버지니아)
- `sjc` (산호세)
:::

### 2단계: fly.toml 구성

앱 이름과 요구 사항에 맞게 `fly.toml`을 편집합니다.

::: warning 보안 참고
기본 구성은 공개 URL을 노출합니다. 공개 IP 없이 강화된 배포를 원하면 [프라이빗 배포](#프라이빗-배포-강화)를 참조하거나 `fly.private.toml`을 사용하세요.
:::

```toml
app = "my-clawdbot"  # 앱 이름
primary_region = "iad"

[build]
  dockerfile = "Dockerfile"

[env]
  NODE_ENV = "production"
  CLAWDBOT_PREFER_PNPM = "1"
  CLAWDBOT_STATE_DIR = "/data"
  NODE_OPTIONS = "--max-old-space-size=1536"

[processes]
  app = "node dist/index.js gateway --allow-unconfigured --port 3000 --bind lan"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[vm]]
  size = "shared-cpu-2x"
  memory = "2048mb"

[mounts]
  source = "clawdbot_data"
  destination = "/data"
```

**주요 설정 설명**:

| 설정 | 이유 |
| --- | --- |
| `--bind lan` | `0.0.0.0`에 바인딩하여 Fly 프록시가 Gateway에 접근 가능 |
| `--allow-unconfigured` | 구성 파일 없이 시작 (나중에 생성) |
| `internal_port = 3000` | Fly 헬스 체크를 위해 `--port 3000` (또는 `CLAWDBOT_GATEWAY_PORT`)과 일치해야 함 |
| `memory = "2048mb"` | 512MB는 너무 작음; 2GB 권장 |
| `CLAWDBOT_STATE_DIR = "/data"` | 볼륨에 상태 영구화 |

### 3단계: secrets 설정

```bash
# 필수: Gateway 토큰 (non-loopback 바인딩에 필요)
fly secrets set CLAWDBOT_GATEWAY_TOKEN=$(openssl rand -hex 32)

# 모델 프로바이더 API Keys
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly secrets set OPENAI_API_KEY=sk-...
fly secrets set GOOGLE_API_KEY=...

# 채널 토큰
fly secrets set DISCORD_BOT_TOKEN=MTQ...
```

::: tip 보안 권장 사항
Non-loopback 바인딩 (`--bind lan`)은 보안을 위해 `CLAWDBOT_GATEWAY_TOKEN`이 필요합니다. 이 토큰을 비밀번호처럼 취급하세요. 모든 API 키와 토큰은 구성 파일보다 환경 변수를 우선 사용하세요. 이렇게 하면 자격 증명이 `clawdbot.json`에 노출되는 것을 방지할 수 있습니다.
:::

### 4단계: 배포

```bash
fly deploy
```

첫 배포는 Docker 이미지를 빌드합니다 (약 2-3분). 이후 배포는 더 빠릅니다.

배포 후 확인:

```bash
fly status
fly logs
```

다음과 같이 표시되어야 합니다:

```
[gateway] listening on ws://0.0.0.0:3000 (PID xxx)
[discord] logged in to discord as xxx
```

### 5단계: 구성 파일 생성

머신에 SSH로 접속하여 구성 파일을 생성합니다:

```bash
fly ssh console
```

구성 디렉토리와 파일 생성:

```bash
mkdir -p /data
cat > /data/clawdbot.json << 'EOF'
{
  "agents": {
    "defaults": {
      "model": {
        "primary": "anthropic/claude-opus-4-5",
        "fallbacks": ["anthropic/claude-sonnet-4-5", "openai/gpt-4o"]
      },
      "maxConcurrent": 4
    },
    "list": [
      {
        "id": "main",
        "default": true
      }
    ]
  },
  "auth": {
    "profiles": {
      "anthropic:default": { "mode": "token", "provider": "anthropic" },
      "openai:default": { "mode": "token", "provider": "openai" }
    }
  },
  "bindings": [
    {
      "agentId": "main",
      "match": { "channel": "discord" }
    }
  ],
  "channels": {
    "discord": {
      "enabled": true,
      "groupPolicy": "allowlist",
      "guilds": {
        "YOUR_GUILD_ID": {
          "channels": { "general": { "allow": true } },
          "requireMention": false
        }
      }
    }
  },
  "gateway": {
    "mode": "local",
    "bind": "auto"
  },
  "meta": {
    "lastTouchedVersion": "2026.1.25"
  }
}
EOF
```

구성 적용을 위해 재시작:

```bash
exit
fly machine restart <machine-id>
```

### 6단계: Gateway 접속

**Control UI**:

```bash
fly open
```

또는 방문: `https://my-clawdbot.fly.dev/`

인증을 위해 Gateway 토큰 (`CLAWDBOT_GATEWAY_TOKEN`에서)을 붙여넣습니다.

**로그**:

```bash
fly logs              # 실시간 로그
fly logs --no-tail    # 최근 로그
```

**SSH 콘솔**:

```bash
fly ssh console
```

### 문제 해결

**"App is not listening on expected address"**:

Gateway가 `0.0.0.0` 대신 `127.0.0.1`에 바인딩되고 있습니다.

**해결**: `fly.toml`의 프로세스 명령에 `--bind lan`을 추가합니다.

**헬스 체크 실패 / 연결 거부**:

Fly가 구성된 포트에서 Gateway에 접근할 수 없습니다.

**해결**: `internal_port`가 Gateway 포트와 일치하는지 확인합니다 (`--port 3000` 또는 `CLAWDBOT_GATEWAY_PORT=3000` 설정).

**OOM / 메모리 문제**:

컨테이너가 계속 재시작되거나 종료됩니다. 징후: `SIGABRT`, `v8::internal::Runtime_AllocateInYoungGeneration` 또는 조용한 재시작.

**해결**: `fly.toml`에서 메모리 증가:

```toml
[[vm]]
  memory = "2048mb"
```

또는 기존 머신 업데이트:

```bash
fly machine update <machine-id> --vm-memory 2048 -y
```

**참고**: 512MB는 너무 작습니다. 1GB는 가능하지만 부하나 상세 로그에서 OOM이 발생할 수 있습니다. **2GB 권장**.

**Gateway Lock 문제**:

Gateway가 "already running" 오류로 시작을 거부합니다.

컨테이너가 재시작되었지만 PID lock 파일이 볼륨에 영구화되어 있을 때 발생합니다.

**해결**: lock 파일 삭제:

```bash
fly ssh console --command "rm -f /data/gateway.*.lock"
fly machine restart <machine-id>
```

Lock 파일은 `/data/gateway.*.lock`에 있습니다 (하위 디렉토리가 아님).

### 프라이빗 배포 (강화)

기본적으로 Fly.io는 공개 IP를 할당하여 Gateway를 `https://your-app.fly.dev`에서 접근 가능하게 합니다. 편리하지만 인터넷 스캐너 (Shodan, Censys 등)에 의해 배포가 발견될 수 있습니다.

**프라이빗 템플릿 사용**으로 공개 노출 없이 강화된 배포:

::: info 프라이빗 배포 시나리오
- **아웃바운드** 호출/메시지만 수행 (인바운드 웹훅 없음)
- 웹훅 콜백에 **ngrok 또는 Tailscale** 터널 사용
- 브라우저 대신 **SSH, 프록시 또는 WireGuard**로 Gateway 접속
- 배포를 **인터넷 스캐너로부터 숨기고** 싶음
:::

**설정**:

표준 구성 대신 `fly.private.toml` 사용:

```bash
# 프라이빗 구성으로 배포
fly deploy -c fly.private.toml
```

또는 기존 배포 변환:

```bash
# 현재 IP 목록
fly ips list -a my-clawdbot

# 공개 IP 해제
fly ips release <public-ipv4> -a my-clawdbot
fly ips release <public-ipv6> -a my-clawdbot

# 향후 배포에서 공개 IP가 재할당되지 않도록 프라이빗 구성으로 전환
fly deploy -c fly.private.toml

# 프라이빗 IPv6만 할당
fly ips allocate-v6 --private -a my-clawdbot
```

**프라이빗 배포 접속**:

공개 URL이 없으므로 다음 방법 중 하나를 사용:

**옵션 1: 로컬 프록시 (가장 간단)**

```bash
# 로컬 포트 3000을 앱으로 포워딩
fly proxy 3000:3000 -a my-clawdbot

# 그런 다음 브라우저에서 http://localhost:3000 열기
```

**옵션 2: WireGuard VPN**

```bash
# WireGuard 구성 생성 (일회성)
fly wireguard create

# WireGuard 클라이언트로 가져온 후 내부 IPv6로 접속
# 예: http://[fdaa:x:x:x:x::x]:3000
```

**옵션 3: SSH 전용**

```bash
fly ssh console -a my-clawdbot
```

### 비용

권장 구성 (`shared-cpu-2x`, 2GB RAM) 사용 시:
- 사용량에 따라 약 $10-15/월
- 무료 티어에 일부 할당량 포함

자세한 내용: [Fly.io 가격](https://fly.io/docs/about/pricing/)

---

## Hetzner VPS 배포

**적합**: 자체 VPS, 완전한 제어, 저비용 24/7 운영

### 목표

Hetzner VPS에서 Docker를 사용하여 영구 Clawdbot Gateway를 실행합니다. 영구 상태, 내장 바이너리 및 안전한 재시작 동작을 갖춥니다.

"Clawdbot 24/7, 약 $5/월"을 원한다면 이것이 가장 간단하고 안정적인 설정입니다.

### 필요한 것

- root 접근 권한이 있는 Hetzner VPS
- 노트북에서 SSH 접속
- 기본 SSH + 복사/붙여넣기 능숙도
- 약 20분
- Docker 및 Docker Compose
- 모델 인증 자격 증명
- 선택적 프로바이더 자격 증명 (WhatsApp QR, Telegram 봇 토큰, Gmail OAuth)

### 1단계: VPS 구성

Hetzner에서 Ubuntu 또는 Debian VPS를 생성합니다.

root로 연결:

```bash
ssh root@YOUR_VPS_IP
```

이 가이드는 VPS가 상태를 유지한다고 가정합니다. 일회용 인프라로 취급하지 마세요.

### 2단계: VPS에 Docker 설치

```bash
apt-get update
apt-get install -y git curl ca-certificates
curl -fsSL https://get.docker.com | sh
```

확인:

```bash
docker --version
docker compose version
```

### 3단계: Clawdbot 저장소 클론

```bash
git clone https://github.com/clawdbot/clawdbot.git
cd clawdbot
```

이 가이드는 바이너리 영구화를 보장하기 위해 커스텀 이미지를 빌드한다고 가정합니다.

### 4단계: 영구 호스트 디렉토리 생성

Docker 컨테이너는 임시적입니다. 모든 장기 실행 상태는 호스트에 존재해야 합니다.

```bash
mkdir -p /root/.clawdbot
mkdir -p /root/clawd

# 컨테이너 사용자 (uid 1000)에게 소유권 설정:
chown -R 1000:1000 /root/.clawdbot
chown -R 1000:1000 /root/clawd
```

### 5단계: 환경 변수 구성

저장소 루트에 `.env`를 생성합니다.

```bash
CLAWDBOT_IMAGE=clawdbot:latest
CLAWDBOT_GATEWAY_TOKEN=change-me-now
CLAWDBOT_GATEWAY_BIND=lan
CLAWDBOT_GATEWAY_PORT=18789
CLAWDBOT_CONFIG_DIR=/root/.clawdbot
CLAWDBOT_WORKSPACE_DIR=/root/clawd
GOG_KEYRING_PASSWORD=change-me-now
XDG_CONFIG_HOME=/home/node/.clawdbot
```

강력한 secrets 생성:

```bash
openssl rand -hex 32
```

::: warning 이 파일을 커밋하지 마세요
`.env`를 `.gitignore`에 추가하세요.
:::

### 6단계: Docker Compose 구성

`docker-compose.yml`을 생성하거나 업데이트합니다.

```yaml
services:
  clawdbot-gateway:
    image: ${CLAWDBOT_IMAGE}
    build: .
    restart: unless-stopped
    env_file:
      - .env
    environment:
      - HOME=/home/node
      - NODE_ENV=production
      - TERM=xterm-256color
      - CLAWDBOT_GATEWAY_BIND=${CLAWDBOT_GATEWAY_BIND}
      - CLAWDBOT_GATEWAY_PORT=${CLAWDBOT_GATEWAY_PORT}
      - CLAWDBOT_GATEWAY_TOKEN=${CLAWDBOT_GATEWAY_TOKEN}
      - GOG_KEYRING_PASSWORD=${GOG_KEYRING_PASSWORD}
      - XDG_CONFIG_HOME=${XDG_CONFIG_HOME}
      - PATH=/home/linuxbrew/.linuxbrew/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
    volumes:
      - ${CLAWDBOT_CONFIG_DIR}:/home/node/.clawdbot
      - ${CLAWDBOT_WORKSPACE_DIR}:/home/node/clawd
    ports:
      # 권장: VPS에서 Gateway를 loopback으로만 유지; SSH 터널로 접속.
      # 공개 노출하려면 `127.0.0.1:` 접두사를 제거하고 방화벽을 적절히 구성하세요.
      - "127.0.0.1:${CLAWDBOT_GATEWAY_PORT}:18789"
      # 선택 사항: 이 VPS에 대해 iOS/Android 노드를 실행하고 Canvas 호스트가 필요한 경우에만.
      # 이 포트를 공개 노출하는 경우 /gateway/security를 읽고 방화벽을 적절히 구성하세요.
      # - "18793:18793"
    command:
      [
        "node",
        "dist/index.js",
        "gateway",
        "--bind",
        "${CLAWDBOT_GATEWAY_BIND}",
        "--port",
        "${CLAWDBOT_GATEWAY_PORT}"
      ]
```

### 7단계: 필요한 바이너리를 이미지에 베이킹 (중요)

실행 중인 컨테이너에 바이너리를 설치하는 것은 함정입니다. 런타임에 설치된 모든 것은 재시작 시 손실됩니다.

스킬에 필요한 모든 외부 바이너리는 이미지 빌드 시 설치해야 합니다.

다음 예제는 세 가지 일반적인 바이너리만 보여줍니다:
- `gog` - Gmail 접근용
- `goplaces` - Google Places용
- `wacli` - WhatsApp용

이것들은 예제이며 완전한 목록이 아닙니다. 동일한 패턴을 사용하여 필요한 만큼 많은 바이너리를 설치할 수 있습니다.

나중에 추가 바이너리에 의존하는 새 스킬을 추가하면 다음을 수행해야 합니다:

1. Dockerfile 업데이트
2. 이미지 재빌드
3. 컨테이너 재시작

**예제 Dockerfile**:

```dockerfile
FROM node:22-bookworm

RUN apt-get update && apt-get install -y socat && rm -rf /var/lib/apt/lists/*

# 예제 바이너리 1: Gmail CLI
RUN curl -L https://github.com/steipete/gog/releases/latest/download/gog_Linux_x86_64.tar.gz \
| tar xz -C /usr/local/bin

# 예제 바이너리 2: Google Places CLI
RUN curl -L https://github.com/steipete/goplaces/releases/latest/download/goplaces_Linux_x86_64.tar.gz \
| tar xz -C /usr/local/bin

# 예제 바이너리 3: WhatsApp CLI
RUN curl -L https://github.com/steipete/wacli/releases/latest/download/wacli_Linux_x86_64.tar.gz \
| tar xz -C /usr/local/bin

# 동일한 패턴을 사용하여 아래에 더 많은 바이너리 추가

WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY ui/package.json ./ui/package.json
COPY scripts ./scripts

RUN corepack enable
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
RUN pnpm ui:install
RUN pnpm ui:build

ENV NODE_ENV=production

CMD ["node","dist/index.js"]
```

### 8단계: 빌드 및 시작

```bash
docker compose build
docker compose up -d clawdbot-gateway
```

바이너리 확인:

```bash
docker compose exec clawdbot-gateway which gog
docker compose exec clawdbot-gateway which goplaces
docker compose exec clawdbot-gateway which wacli
```

예상 출력:

```
/usr/local/bin/gog
/usr/local/bin/goplaces
/usr/local/bin/wacli
```

### 9단계: Gateway 확인

```bash
docker compose logs -f clawdbot-gateway
```

성공:

```
[gateway] listening on ws://0.0.0.0:18789
```

노트북에서:

```bash
ssh -N -L 18789:127.0.0.1:18789 root@YOUR_VPS_IP
```

열기:

`http://127.0.0.1:18789/`

Gateway 토큰을 붙여넣습니다.

### 상태 영구화 위치 (진실의 원천)

Clawdbot은 Docker에서 실행되지만 Docker는 진실의 원천이 아닙니다.

모든 장기 실행 상태는 재시작, 재빌드 및 재시작 후에도 유지되어야 합니다.

| 컴포넌트 | 위치 | 영구화 메커니즘 | 비고 |
| --- | --- | --- | --- |
| Gateway config | `/home/node/.clawdbot/` | 호스트 볼륨 마운트 | `clawdbot.json`, 토큰 포함 |
| Model auth profiles | `/home/node/.clawdbot/` | 호스트 볼륨 마운트 | OAuth 토큰, API 키 |
| Skill configs | `/home/node/.clawdbot/skills/` | 호스트 볼륨 마운트 | 스킬 수준 상태 |
| Agent workspace | `/home/node/clawd/` | 호스트 볼륨 마운트 | 코드 및 에이전트 아티팩트 |
| WhatsApp session | `/home/node/.clawdbot/` | 호스트 볼륨 마운트 | QR 로그인 유지 |
| Gmail keyring | `/home/node/.clawdbot/` | 호스트 볼륨 + 비밀번호 | `GOG_KEYRING_PASSWORD` 필요 |
| External binaries | `/usr/local/bin/` | Docker 이미지 | 빌드 시 베이킹 필수 |
| Node runtime | 컨테이너 파일시스템 | Docker 이미지 | 이미지 빌드마다 재빌드 |
| OS packages | 컨테이너 파일시스템 | Docker 이미지 | 런타임에 설치하지 마세요 |
| Docker container | 임시 | 재시작 가능 | 안전하게 삭제 가능 |

---

## exe.dev 배포

**적합**: 저렴한 Linux 호스트, 원격 접속, VPS 직접 구성 불필요

### 목표

exe.dev VM에서 Clawdbot Gateway를 실행하고 노트북에서 다음을 통해 접속:
- **exe.dev HTTPS 프록시** (간단, 터널 불필요)
- **SSH 터널** (가장 안전; loopback Gateway만)

이 가이드는 **Ubuntu/Debian**을 가정합니다. 다른 배포판을 선택한 경우 패키지를 적절히 매핑하세요. 다른 Linux VPS에서도 동일한 단계가 적용됩니다—exe.dev 프록시 명령만 사용하지 않습니다.

### 필요한 것

- exe.dev 계정 + 노트북에서 `ssh exe.dev` 실행 가능
- SSH 키 설정 (노트북 → exe.dev)
- 사용할 모델 인증 (OAuth 또는 API 키)
- 선택적 프로바이더 자격 증명 (WhatsApp QR 스캔, Telegram 봇 토큰, Discord 봇 토큰 등)

### 1단계: VM 생성

노트북에서:

```bash
ssh exe.dev new --name=clawdbot
```

그런 다음 연결:

```bash
ssh clawdbot.exe.xyz
```

::: tip VM을 상태 유지로 유지
이 VM을 **상태 유지**로 유지하세요. Clawdbot은 `~/.clawdbot/` 및 `~/clawd/` 아래에 상태를 저장합니다.
:::

### 2단계: VM에 전제 조건 설치

```bash
sudo apt-get update
sudo apt-get install -y git curl jq ca-certificates openssl
```

### Node 22

Node **≥ 22.12** 설치 (어떤 방법이든 가능). 빠른 확인:

```bash
node -v
```

VM에 아직 Node 22가 없다면 선호하는 Node 관리자 또는 Node 22+를 제공하는 배포판 패키지 소스를 사용하세요.

### 3단계: Clawdbot 설치

서버에서는 npm 전역 설치를 권장합니다:

```bash
npm i -g clawdbot@latest
clawdbot --version
```

네이티브 의존성 설치가 실패하면 (드물게; 보통 `sharp`), 빌드 도구를 추가합니다:

```bash
sudo apt-get install -y build-essential python3
```

### 4단계: 초기 설정 (마법사)

VM에서 onboarding 마법사를 실행합니다:

```bash
clawdbot onboard --install-daemon
```

설정할 수 있는 것:
- `~/clawd` 워크스페이스 부트스트랩
- `~/.clawdbot/clawdbot.json` 구성
- 모델 인증 프로필
- 모델 프로바이더 구성/로그인
- Linux systemd **user** 서비스

헤드리스 VM에서 OAuth를 수행하는 경우, 먼저 일반 머신에서 OAuth를 수행한 다음 인증 프로필을 VM에 복사합니다 ([도움말](https://docs.clawd.bot/help/) 참조).

### 5단계: 원격 접속 옵션

#### 옵션 A (권장): SSH 터널 (loopback만)

Gateway를 loopback (기본값)으로 유지하고 노트북에서 터널링:

```bash
ssh -N -L 18789:127.0.0.1:18789 clawdbot.exe.xyz
```

로컬에서 열기:

- `http://127.0.0.1:18789/` (Control UI)

자세한 내용: [원격 접속](https://docs.clawd.bot/gateway/remote)

#### 옵션 B: exe.dev HTTPS 프록시 (터널 불필요)

exe.dev가 VM으로 트래픽을 프록시하도록 하려면 Gateway를 LAN 인터페이스에 바인딩하고 토큰을 설정합니다:

```bash
export CLAWDBOT_GATEWAY_TOKEN="$(openssl rand -hex 32)"
clawdbot gateway --bind lan --port 8080 --token "$CLAWDBOT_GATEWAY_TOKEN"
```

서비스 실행을 위해 `~/.clawdbot/clawdbot.json`에 영구화:

```json5
{
  "gateway": {
    "mode": "local",
    "port": 8080,
    "bind": "lan",
    "auth": { "mode": "token", "token": "YOUR_TOKEN" }
  }
}
```

::: info 중요 참고
Non-loopback 바인딩은 `gateway.auth.token` (또는 `CLAWDBOT_GATEWAY_TOKEN`)이 필요합니다. `gateway.remote.token`은 원격 CLI 호출에만 사용됩니다; 로컬 인증을 활성화하지 않습니다.
:::

그런 다음 exe.dev에서 선택한 포트 (이 예제에서는 `8080` 또는 선택한 포트)로 프록시를 지정하고 VM의 HTTPS URL을 엽니다:

```bash
ssh exe.dev share port clawdbot 8080
```

열기:

`https://clawdbot.exe.xyz/`

Control UI에서 토큰을 붙여넣습니다 (UI → 설정 → 토큰). UI는 이를 `connect.params.auth.token`으로 전송합니다.

::: tip 프록시 포트
프록시가 앱 포트를 기대하는 경우 **비기본** 포트 (예: `8080`)를 선호합니다. 토큰을 비밀번호처럼 취급하세요.
:::

### 6단계: 계속 실행 유지 (서비스)

Linux에서 Clawdbot은 systemd **user** 서비스를 사용합니다. `--install-daemon` 후 확인:

```bash
systemctl --user status clawdbot-gateway[-<profile>].service
```

로그아웃 후 서비스가 종료되면 lingering을 활성화합니다:

```bash
sudo loginctl enable-linger "$USER"
```

### 7단계: 업데이트

```bash
npm i -g clawdbot@latest
clawdbot doctor
clawdbot gateway restart
clawdbot health
```

자세한 내용: [업데이트](https://docs.clawd.bot/install/updating)

---

## 선택 권장 사항

### 사용 시나리오별 선택

| 시나리오 | 권장 배포 | 이유 |
| --- | --- | --- |
| **개인 사용, 빠른 시작** | 로컬 설치 | 가장 간단, 인프라 불필요 |
| **다중 기기 접속, 가끔 종료** | Fly.io | 24/7 온라인, 어디서나 접속 가능 |
| **완전한 제어, 자체 인프라** | Hetzner VPS | 완전한 제어, 영구 상태, 저비용 |
| **저비용, VPS 관리 원치 않음** | exe.dev | 저렴한 호스트, 빠른 설정 |
| **재현 가능, 빠른 롤백 필요** | Nix | 선언적 구성, 버전 고정 |
| **테스트, 격리 환경** | Docker | 쉬운 재구축, 테스트 격리 |

### 보안 모범 사례

어떤 배포 방식을 선택하든 다음 보안 원칙을 따르세요:

::: warning 인증 및 접근 제어
- Gateway에 항상 토큰 또는 비밀번호 인증 설정 (non-loopback 바인딩 시)
- 민감한 자격 증명 (API 키, 토큰)은 환경 변수로 저장
- 클라우드 배포의 경우 공개 노출을 피하거나 프라이빗 네트워크 사용
:::

::: tip 상태 영구화
- 컨테이너화 배포의 경우 구성과 워크스페이스가 호스트 볼륨에 올바르게 마운트되었는지 확인
- VPS 배포의 경우 `~/.clawdbot/` 및 `~/clawd/` 디렉토리를 정기적으로 백업
:::

### 모니터링 및 로그

- Gateway 상태를 정기적으로 확인: `clawdbot doctor`
- 디스크 공간 고갈을 방지하기 위해 로그 로테이션 구성
- 헬스 체크 엔드포인트로 서비스 가용성 확인

---

## 체크포인트 ✅

**로컬 설치 확인**:

```bash
clawdbot --version
clawdbot health
```

Gateway가 수신 대기 중이라는 메시지가 표시되어야 합니다.

**Docker 확인**:

```bash
docker compose ps
docker compose logs clawdbot-gateway
```

컨테이너 상태가 `Up`이어야 하고, 로그에 `[gateway] listening on ws://...`가 표시되어야 합니다.

**Nix 확인**:

```bash
# 서비스 상태 확인
systemctl --user status clawdbot-gateway

# Nix 모드 확인
defaults read com.clawdbot.mac clawdbot.nixMode
```

**클라우드 배포 확인**:

```bash
# Fly.io
fly status
fly logs

# Hetzner / exe.dev
ssh root@YOUR_VPS_IP "docker compose logs -f clawdbot-gateway"
```

브라우저로 Control UI에 접속하거나 SSH 터널을 통해 접속할 수 있어야 합니다.

---

## 주의 사항

::: warning Docker 일반적인 문제
- **마운트 경로 오류**: 호스트 경로가 Docker Desktop 공유에 있는지 확인
- **포트 충돌**: 18789 포트가 사용 중인지 확인
- **권한 문제**: 컨테이너 사용자 (uid 1000)가 마운트된 볼륨에 대한 읽기/쓰기 권한 필요
:::

::: warning 클라우드 배포 문제
- **OOM 오류**: 메모리 할당 증가 (최소 2GB)
- **Gateway Lock**: `/data/gateway.*.lock` 파일 삭제 후 컨테이너 재시작
- **헬스 체크 실패**: `internal_port`가 Gateway 포트와 일치하는지 확인
:::

::: tip 바이너리 영구화 (Hetzner)
런타임에 의존성을 설치하지 마세요! 스킬에 필요한 모든 바이너리는 Docker 이미지에 베이킹해야 합니다. 그렇지 않으면 컨테이너 재시작 후 손실됩니다.
:::

---

## 강의 요약

이 강의에서는 Clawdbot의 다양한 배포 방식을 소개했습니다:

1. **로컬 설치**: 가장 간단하고 빠름, 개인 사용 및 개발에 적합
2. **Docker 배포**: 격리 환경, 쉬운 재구축, 샌드박스 지원
3. **Nix 배포**: 선언적 구성, 재현 가능, 빠른 롤백
4. **Fly.io**: 클라우드 플랫폼, 자동 HTTPS, 24/7 온라인
5. **Hetzner VPS**: 자체 VPS, 완전한 제어, 영구 상태
6. **exe.dev**: 저렴한 호스트, 빠른 설정, 간소화된 운영

배포 방식을 선택할 때 사용 시나리오, 기술 능력 및 운영 요구 사항을 고려하세요. 상태 영구화와 보안 구성이 성공적인 배포의 핵심입니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능/섹션 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| Docker 배포 스크립트 | [`docker-setup.sh`](https://github.com/moltbot/moltbot/blob/main/docker-setup.sh) | 전체 |
| Docker 이미지 정의 | [`Dockerfile`](https://github.com/moltbot/moltbot/blob/main/Dockerfile) | 전체 |
| Docker Compose 구성 | [`docker-compose.yml`](https://github.com/moltbot/moltbot/blob/main/docker-compose.yml) | 전체 |
| Fly.io 구성 | [`fly.toml`](https://github.com/moltbot/moltbot/blob/main/fly.toml) | 전체 |
| Fly 프라이빗 구성 | [`fly.private.toml`](https://github.com/moltbot/moltbot/blob/main/fly.private.toml) | 전체 |
| Docker 샌드박스 이미지 | [`Dockerfile.sandbox`](https://github.com/moltbot/moltbot/blob/main/Dockerfile.sandbox) | 전체 |
| Nix 통합 | [`nix-clawdbot`](https://github.com/clawdbot/nix-clawdbot) | README |
| 설치 스크립트 | [`scripts/package-mac-app.sh`](https://github.com/moltbot/moltbot/blob/main/scripts/package-mac-app.sh) | 전체 |

**주요 구성 파일**:
- `~/.clawdbot/clawdbot.json`: 메인 구성 파일
- `~/.clawdbot/`: 상태 디렉토리 (세션, 토큰, 인증 프로필)
- `~/clawd/`: 워크스페이스 디렉토리

**주요 환경 변수**:
- `CLAWDBOT_GATEWAY_TOKEN`: Gateway 인증 토큰
- `CLAWDBOT_STATE_DIR`: 상태 디렉토리 경로
- `CLAWDBOT_CONFIG_PATH`: 구성 파일 경로
- `CLAWDBOT_NIX_MODE`: Nix 모드 활성화

**주요 스크립트**:
- `scripts/sandbox-setup.sh`: 기본 샌드박스 이미지 빌드
- `scripts/sandbox-common-setup.sh`: 공통 샌드박스 이미지 빌드
- `scripts/sandbox-browser-setup.sh`: 브라우저 샌드박스 이미지 빌드

**Docker 환경 변수** (.env):
- `CLAWDBOT_IMAGE`: 사용할 이미지 이름
- `CLAWDBOT_GATEWAY_BIND`: 바인딩 모드 (lan/auto)
- `CLAWDBOT_GATEWAY_PORT`: Gateway 포트
- `CLAWDBOT_CONFIG_DIR`: 구성 디렉토리 마운트
- `CLAWDBOT_WORKSPACE_DIR`: 워크스페이스 마운트
- `GOG_KEYRING_PASSWORD`: Gmail keyring 비밀번호
- `XDG_CONFIG_HOME`: XDG 구성 디렉토리

**Fly.io 환경 변수**:
- `NODE_ENV`: 런타임 환경 (production)
- `CLAWDBOT_PREFER_PNPM`: pnpm 사용
- `CLAWDBOT_STATE_DIR`: 영구 상태 디렉토리
- `NODE_OPTIONS`: Node.js 런타임 옵션

</details>
