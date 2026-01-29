---
title: "마법사 설정: Clawdbot 원스톱 구성 | Clawdbot 튜토리얼"
sidebarTitle: "원클릭 설정 완료"
subtitle: "마법사 설정: Clawdbot 원스톱 구성"
description: "인터랙티브 마법사를 사용하여 Clawdbot의 전체 구성을 완료하는 방법을 학습합니다. Gateway 네트워크 설정, AI 모델 인증(setup-token 및 API Key 지원), 통신 채널(WhatsApp, Telegram, Slack 등) 및 스킬 시스템 초기화를 포함합니다."
tags:
  - "입문"
  - "구성"
  - "마법사"
  - "Gateway"
prerequisite:
  - "getting-started"
order: 20
---

# 마법사 설정: Clawdbot 원스톱 구성

## 학습 후 할 수 있는 것

이 튜토리얼을 통해 다음을 수행할 수 있습니다:

- ✅ 인터랙티브 마법사를 사용하여 Clawdbot 전체 구성 완료
- ✅ QuickStart와 Manual 두 가지 모드의 차이점 이해
- ✅ Gateway 네트워크 및 인증 옵션 구성
- ✅ AI 모델 공급자 설정(setup-token 및 API Key)
- ✅ 통신 채널 활성화(WhatsApp, Telegram 등)
- ✅ 스킬 패키지 설치 및 관리

마법사 완료 후 Clawdbot Gateway가 백그라운드에서 실행되며, 구성된 채널을 통해 AI 어시스턴트와 대화할 수 있습니다.

## 현재의 어려움

수동으로 구성 파일을 편집하는 것은 번거롭습니다:

- 구성 항목의 의미와 기본값을 모름
- 중요한 설정을 놓쳐 시작할 수 없음
- AI 모델 인증 방식이 다양(OAuth, API Key)하여 선택이 어려움
- 채널 구성이 복잡하고 각 플랫폼의 인증 방식이 다름
- 스킬 시스템에서 어떤 것을 설치해야 할지 모름

마법사 설정은 이러한 문제를 해결하며, 인터랙티브 질문을 통해 모든 구성을 안내하고 합리적인 기본값을 제공합니다.

## 이 기능을 사용하는 시기

- **처음 설치**: Clawdbot를 처음 사용하는 새 사용자
- **재구성**: Gateway 설정 변경, AI 모델 전환 또는 새 채널 추가 필요 시
- **빠른 검증**: 기본 기능을 빠르게 경험하고 싶고 구성 파일을 깊이 연구하고 싶지 않을 때
- **문제 해결**: 구성 오류 발생 후 마법사를 사용하여 다시 초기화

::: tip 팁
마법사는 기존 구성을 감지하며, 구성을 유지, 수정 또는 재설정할 수 있습니다.
:::

## 핵심 개념

### 두 가지 모드

마법사는 두 가지 구성 모드를 제공합니다:

**QuickStart 모드** (신규 사용자 권장)
- 안전한 기본값 사용: Gateway가 loopback(127.0.0.1)에 바인딩, 포트 18789, token 인증
- 대부분의 상세 구성 항목 건 넘기기
- 단일 시스템 사용에 적합, 빠른 시작

**Manual 모드** (고급 사용자용)
- 모든 옵션을 수동으로 구성
- LAN 바인딩, Tailscale 원격 액세스, 사용자 정의 인증 방식 지원
- 다중 시스템 배포, 원격 액세스 또는 특수 네트워크 환경에 적합

### 구성 프로세스

```
1. 보안 경고 확인
2. 모드 선택 (QuickStart / Manual)
3. Gateway 구성 (포트, 바인딩, 인증, Tailscale)
4. AI 모델 인증 (setup-token / API Key)
5. 작업 공간 설정 (기본 ~/clawd)
6. 채널 구성 (WhatsApp / Telegram / Slack 등)
7. 스킬 설치 (선택 사항)
8. 완료 (Gateway 시작)
```

### 보안 알림

마법사 시작 시 보안 경고가 표시되며, 다음 내용을 확인해야 합니다:

- Clawdbot는 취미 프로젝트로 아직 베타 단계입니다
- 도구가 활성화되면 AI가 파일을 읽고 작업을 실행할 수 있습니다
- 악성 프롬프트가 AI를 불안전한 작업을 하도록 유도할 수 있습니다
- 페어링/화이트리스트 + 최소 권한 도구 사용 권장
- 정기적인 보안 감사 수행

::: danger 중요
기본 보안 및 액세스 제어 메커니즘을 이해하지 못한 경우 도구를 활성화하거나 Gateway를 인터넷에 노출하지 마십시오. 사용 전 경험이 있는 사람에게 도움을 요청하여 구성하시기 바랍니다.
:::

---

## 🎒 시작 전 준비 사항

마법사를 실행하기 전에 다음을 확인하십시오:

- **Clawdbot 설치 완료**: [빠른 시작](../getting-started/)을 참조하여 설치 완료
- **Node.js 버전**: Node.js ≥ 22 확인 (`node -v`로 확인)
- **AI 모델 계정** (권장):
  - Anthropic Claude 계정(Pro/Max 구독), OAuth 프로세스 지원
  - 또는 OpenAI/DeepSeek 등 공급자의 API Key 준비
- **채널 계정** (선택 사항): WhatsApp, Telegram 등을 사용하려면 해당 계정 먼저 등록
- **네트워크 권한**: Tailscale을 사용하려면 Tailscale 클라이언트가 설치되어 있는지 확인

---

## 따라 하기

### 1단계: 마법사 시작

터미널을 열고 다음 명령을 실행합니다:

```bash
clawdbot onboard
```

**이유**
인터랙티브 구성 마법사를 시작하여 모든 필요한 설정을 안내합니다.

**확인해야 할 내용**:
```
  ┌─────────────────────────────────────────────────────┐
  │                                                   │
  │   Clawdbot onboarding                              │
  │                                                   │
  └─────────────────────────────────────────────────────┘
```

### 2단계: 보안 경고 확인

마법사는 먼저 보안 경고를 표시합니다(앞서 "핵심 개념" 섹션에 설명됨).

**이유**
사용자가 잠재적 위험을 인지하도록 하여 오용으로 인한 보안 문제를 방지합니다.

**작업**:
- 보안 경고 내용 읽기
- 위험을 이해했으면 `y` 입력 또는 `Yes` 선택
- 위험을 수락하지 않으면 마법사가 종료됩니다

**확인해야 할 내용**:
```
Security warning — please read.

Clawdbot is a hobby project and still in beta. Expect sharp edges.
...

I understand this is powerful and inherently risky. Continue? (y/N)
```

### 3단계: 구성 모드 선택

::: code-group

```bash [QuickStart 모드]
신규 사용자 권장, 안전한 기본값 사용:
- Gateway 포트: 18789
- 바인딩 주소: Loopback (127.0.0.1)
- 인증 방식: Token (자동 생성)
- Tailscale: 비활성화
```

```bash [Manual 모드]
고급 사용자용, 모든 옵션 수동 구성:
- 사용자 정의 Gateway 포트 및 바인딩
- Token 또는 Password 인증 선택
- Tailscale Serve/Funnel 원격 액세스 구성
- 각 단계 상세 구성
```

:::

**이유**
QuickStart 모드는 신규 사용자가 빠르게 시작할 수 있게 하고, Manual 모드는 고급 사용자가 정밀하게 제어할 수 있게 합니다.

**작업**:
- 방향키를 사용하여 `QuickStart` 또는 `Manual` 선택
- Enter 키로 확인

**확인해야 할 내용**:
```
? Onboarding mode
  QuickStart         Configure details later via clawdbot configure.
  Manual            Configure port, network, Tailscale, and auth options.
```

### 4단계: 배포 모드 선택 (Manual 모드에서만)

Manual 모드를 선택하면 마법사가 Gateway 배포 위치를 묻습니다:

::: code-group

```bash [Local gateway (this machine)]
Gateway가 현재 시스템에서 실행:
- OAuth 프로세스를 실행하고 로컬 자격 증명을 쓸 수 있음
- 마법사가 모든 구성을 완료
- 로컬 개발 또는 단일 시스템 배포에 적합
```

```bash [Remote gateway (info-only)]
Gateway가 다른 시스템에서 실행:
- 마법사는 원격 URL 및 인증만 구성
- OAuth 프로세스를 실행하지 않고 원격 호스트에서 자격 증명을 수동으로 설정해야 함
- 다중 시스템 배포 시나리오에 적합
```

:::

**이유**
Local 모드는 완전한 구성 프로세스를 지원하고, Remote 모드는 액세스 정보만 구성합니다.

**작업**:
- 배포 모드 선택
- Remote 모드인 경우 원격 Gateway의 URL과 token 입력

### 5단계: Gateway 구성 (Manual 모드에서만)

Manual 모드를 선택하면 마법사가 Gateway 구성을 개별적으로 묻습니다:

#### Gateway 포트

```bash
? Gateway port (18789)
```

**설명**:
- 기본값 18789
- 포트가 사용 중이면 다른 포트 입력
- 방화벽에서 포트가 차단되지 않았는지 확인

#### Gateway 바인딩 주소

```bash
? Gateway bind
  Loopback (127.0.0.1)
  LAN (0.0.0.0)
  Tailnet (Tailscale IP)
  Auto (Loopback → LAN)
  Custom IP
```

**옵션 설명**:
- **Loopback**: 로컬 시스템 액세스만, 가장 안전
- **LAN**: LAN 내 장치에서 액세스 가능
- **Tailnet**: Tailscale 가상 네트워크를 통해 액세스
- **Auto**: 먼저 loopback을 시도하고, 실패하면 LAN으로 전환
- **Custom IP**: IP 주소를 수동으로 지정

::: tip 팁
Loopback 또는 Tailnet 사용을 권장하며, LAN에 직접 노출하는 것을 피하십시오.
:::

#### Gateway 인증 방식

```bash
? Gateway auth
  Token              Recommended default (local + remote)
  Password
```

**옵션 설명**:
- **Token**: 권장 옵션, 무작위 token을 자동 생성, 원격 액세스 지원
- **Password**: 사용자 정의 비밀번호 사용, Tailscale Funnel 모드에 필요

#### Tailscale 원격 액세스 (선택 사항)

```bash
? Tailscale exposure
  Off               No Tailscale exposure
  Serve             Private HTTPS for your tailnet (devices on Tailscale)
  Funnel            Public HTTPS via Tailscale Funnel (internet)
```

::: warning Tailscale 경고
- Serve 모드: Tailscale 네트워크 내 장치만 액세스 가능
- Funnel 모드: 공용 HTTPS를 통해 노출(비밀번호 인증 필요)
- Tailscale 클라이언트가 설치되어 있는지 확인: https://tailscale.com/download/mac
:::

### 6단계: 작업 공간 설정

마법사가 작업 공간 디렉토리를 묻습니다:

```bash
? Workspace directory (~/clawd)
```

**설명**:
- 기본값 `~/clawd` (즉, `/Users/당신의사용자명/clawd`)
- 작업 공간은 세션 기록, 에이전트 구성, 스킬 등 데이터를 저장
- 절대 경로 또는 상대 경로 사용 가능

::: info 다중 구성 파일(Profile) 지원
`CLAWDBOT_PROFILE` 환경 변수를 설정하여 다른 작업 환경에 대해 독립적인 구성을 사용할 수 있습니다:

| Profile 값 | 작업 공간 경로 | 구성 파일 |
|----------|----------|----------|
| `default` 또는 미설정 | `~/clawd` | `~/.clawdbot/clawdbot.json` |
| `work` | `~/clawd-work` | `~/.clawdbot/clawdbot.json` (work profile) |
| `dev` | `~/clawd-dev` | `~/.clawdbot/clawdbot.json` (dev profile) |

예시:
```bash
# work profile 사용
export CLAWDBOT_PROFILE=work
clawdbot onboard
```
:::

**확인해야 할 내용**:
```
Ensuring workspace directory: /Users/당신의사용자명/clawd
Creating sessions.json...
Creating agents directory...
```

### 7단계: AI 모델 인증 구성

마법사가 지원되는 AI 모델 공급자를 나열합니다:

```bash
? Choose AI model provider
  Anthropic                    Claude Code CLI + API key
  OpenAI                       Codex OAuth + API key
  MiniMax                      M2.1 (recommended)
  Qwen                         OAuth
  Venice AI                     Privacy-focused (uncensored models)
  Google                       Gemini API key + OAuth
  Copilot                      GitHub + local proxy
  Vercel AI Gateway            API key
  Moonshot AI                  Kimi K2 + Kimi Code
  Z.AI (GLM 4.7)            API key
  OpenCode Zen                 API key
  OpenRouter                   API key
  Custom API Endpoint
  Skip for now
```

공급자를 선택하면 마법사가 공급자 유형에 따라 구체적인 인증 방식을 표시합니다. 다음은 주요 공급자의 인증 옵션입니다:

**Anthropic** 인증 방식:
- `claude-cli`: 기존 Claude Code CLI OAuth 인증 사용(Keychain 액세스 필요)
- `token`: `claude setup-token`으로 생성된 setup-token 붙여넣기
- `apiKey`: Anthropic API Key를 수동으로 입력

::: info Anthropic setup-token 방식 (권장)
setup-token 방식 사용을 권장하는 이유:
- API Key를 수동으로 관리할 필요 없음
- 장기간 유효한 token 생성
- 개인 Pro/Max 구독 사용자에게 적합

프로세스:
1. 다른 터미널에서 먼저 실행: `claude setup-token`
2. 이 명령은 브라우저를 열어 OAuth 인증을 수행
3. 생성된 setup-token 복사
4. 마법사에서 `Anthropic` → `token` 선택
5. 마법사에 setup-token 붙여넣기
6. 자격 증명이 `~/.clawdbot/credentials/` 디렉토리에 자동 저장
:::

::: info API Key 방식
API Key를 선택하면:
- 마법사가 API Key 입력을 요청
- 자격 증명이 `~/.clawdbot/credentials/` 디렉토리에 저장
- 여러 공급자 지원, 언제든지 전환 가능

예시:
```bash
? Enter API Key
sk-ant-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
:::

### 8단계: 기본 모델 선택

인증 성공 후 마법사가 사용 가능한 모델 목록을 표시합니다:

```bash
? Select default model
  anthropic/claude-sonnet-4-5      Anthropic Sonnet 4.5 (200k ctx)
  anthropic/claude-opus-4-5          Anthropic Opus 4.5 (200k ctx)
  openai/gpt-4-turbo                OpenAI GPT-4 Turbo
  deepseek/DeepSeek-V3                DeepSeek V3
  (Keep current selection)
```

**권장 사항**:
- **Claude Sonnet 4.5** 또는 **Opus 4.5** 사용 권장(200k 컨텍스트, 더 강력한 보안)
- 예산이 제한된 경우 Mini 버전 선택
- `Keep current selection` 클릭하여 기존 구성 유지

### 9단계: 통신 채널 구성

마법사가 사용 가능한 모든 통신 채널 플러그인을 나열합니다:

```bash
? Select channels to enable
  ✓ whatsapp       WhatsApp (Baileys Web Client)
  ✓ telegram       Telegram (Bot Token)
  ✓ slack          Slack (Bot Token + App Token)
  ✓ discord        Discord (Bot Token)
  ✓ googlechat     Google Chat (OAuth)
  (Press Space to select, Enter to confirm)
```

**작업**:
- 방향키로 탐색
- **스페이스바**로 선택 상태 전환
- **Enter**로 선택 확인

::: tip QuickStart 모드 최적화
QuickStart 모드에서 마법사는 빠른 활성화를 지원하는 채널(예: WebChat)을 자동으로 선택하고 DM 정책 구성을 건너뛰며, 안전한 기본값(페어링 모드)을 사용합니다.
:::

채널을 선택하면 마법사가 각 채널의 구성을 개별적으로 묻습니다:

#### WhatsApp 구성

```bash
? Configure WhatsApp
  Link new account     Open QR code in browser
  Skip
```

**작업**:
- `Link new account` 선택
- 마법사가 QR 코드를 표시
- WhatsApp을 사용하여 QR 코드 스캔하여 로그인
- 로그인 성공 후 세션 데이터가 `~/.clawdbot/credentials/`에 저장

#### Telegram 구성

```bash
? Configure Telegram
  Bot Token
  Skip
```

**작업**:
- `Bot Token` 선택
- @BotFather에서 가져온 Bot Token 입력
- 마법사가 연결을 테스트하여 성공 여부 확인

::: tip Bot Token 가져오기
1. Telegram에서 @BotFather 검색
2. `/newbot`을 보내 새 bot 생성
3. 프롬프트에 따라 bot 이름과 사용자 이름 설정
4. 생성된 Bot Token 복사
:::

#### Slack 구성

```bash
? Configure Slack
  App Token         xapp-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Bot Token         xoxb-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Signing Secret   a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
  Skip
```

**설명**:
Slack에는 세 가지 자격 증명이 필요하며, Slack App 설정에서 가져옵니다:
- **App Token**: Workspace 수준 token
- **Bot Token**: Bot 사용자 OAuth token
- **Signing Secret**: 요청 서명 검증에 사용

::: tip Slack App 생성
1. https://api.slack.com/apps 방문
2. 새 App 생성
3. Basic Information 페이지에서 Signing Secret 가져오기
4. OAuth & Permissions 페이지에서 App을 Workspace에 설치
5. Bot Token 및 App Token 가져오기
:::

### 10단계: 스킬 구성 (선택 사항)

마법사가 스킬 설치 여부를 묻습니다:

```bash
? Install skills? (Y/n)
```

**권장 사항**:
- `Y` 선택하여 권장 스킬 설치(예: bird 패키지 관리자, sherpa-onnx-tts 로컬 TTS)
- `n` 선택하여 건너뛰기, 이후 `clawdbot skills` 명령으로 관리 가능

설치를 선택하면 마법사가 사용 가능한 스킬을 나열합니다:

```bash
? Select skills to install
  ✓ bird           macOS Homebrew 패키지 설치
  ✓ sherpa-onnx-tts  로컬 TTS 엔진(프라이버시 우선)
  (Press Space to select, Enter to confirm)
```

### 11단계: 구성 완료

마법사가 모든 구성을 요약하고 구성 파일에 씁니다:

```bash
✓ Writing config to ~/.clawdbot/clawdbot.json
✓ Workspace initialized at ~/clawd
✓ Channels configured: whatsapp, telegram, slack
✓ Skills installed: bird, sherpa-onnx-tts

────────────────────────────────────────────────────

Configuration complete!

Next steps:
  1. Start Gateway:
     clawdbot gateway --daemon

  2. Test connection:
     clawdbot message send --to +1234567890 --message "Hello!"

  3. Manage configuration:
     clawdbot configure

Docs: https://docs.clawd.bot/start/onboarding
────────────────────────────────────────────────────
```

## 확인 지점 ✅

마법사 완료 후 다음을 확인하십시오:

- [ ] 구성 파일이 생성됨: `~/.clawdbot/clawdbot.json`
- [ ] 작업 공간이 초기화됨: `~/clawd/` 디렉토리 존재
- [ ] AI 모델 자격 증명이 저장됨: `~/.clawdbot/credentials/` 확인
- [ ] 채널이 구성됨: `clawdbot.json`의 `channels` 노드 확인
- [ ] 스킬이 설치됨(선택한 경우): `clawdbot.json`의 `skills` 노드 확인

**검증 명령**:

```bash
## 구성 요약 보기
```bash
clawdbot doctor
```

## Gateway 상태 보기
```bash
clawdbot gateway status
```

## 사용 가능한 채널 보기
```bash
clawdbot channels list
```
```

## 문제 해결 팁

### 일반적인 오류 1: 포트 사용 중

**오류 메시지**:
```
Error: Port 18789 is already in use
```

**해결 방법**:
1. 사용 중인 프로세스 찾기: `lsof -i :18789` (macOS/Linux) 또는 `netstat -ano | findstr 18789` (Windows)
2. 충돌하는 프로세스 중지 또는 다른 포트 사용

### 일반적인 오류 2: OAuth 프로세스 실패

**오류 메시지**:
```
Error: OAuth exchange failed
```

**가능한 원인**:
- 네트워크 문제로 Anthropic 서버에 액세스할 수 없음
- OAuth code가 만료되거나 형식이 잘못됨
- 브라우저가 차단되어 열 수 없음

**해결 방법**:
1. 네트워크 연결 확인
2. `clawdbot onboard`를 다시 실행하여 OAuth 재시도
3. 또는 API Key 방식으로 전환

### 일반적인 오류 3: 채널 구성 실패

**오류 메시지**:
```
Error: WhatsApp authentication failed
```

**가능한 원인**:
- QR 코드 만료
- WhatsApp에서 계정이 제한됨
- 종속성이 설치되지 않음(예: signal-cli)

**해결 방법**:
1. WhatsApp: QR 코드를 다시 스캔
2. Signal: signal-cli가 설치되어 있는지 확인(채널별 문서 참조)
3. Bot Token: token 형식이 올바르고 만료되지 않았는지 확인

### 일반적인 오류 4: Tailscale 구성 실패

**오류 메시지**:
```
Error: Tailscale binary not found in PATH or /Applications.
```

**해결 방법**:
1. Tailscale 설치: https://tailscale.com/download/mac
2. PATH에 추가되었거나 `/Applications`에 설치되었는지 확인
3. 또는 Tailscale 구성을 건너뛰고 이후 수동으로 설정

### 일반적인 오류 5: 구성 파일 형식 오류

**오류 메시지**:
```
Error: Invalid config at ~/.clawdbot/clawdbot.json
```

**해결 방법**:
```bash
# 구성 복구
clawdbot doctor

# 또는 구성 재설정
clawdbot onboard --mode reset
```

---

## 수업 요약

마법사 설정은 인터랙티브 질문을 통해 모든 필요한 설정을 안내하므로 Clawdbot를 구성하는 권장 방법입니다:

**핵심 포인트 복습**:
- ✅ **QuickStart** 및 **Manual** 두 가지 모드 지원
- ✅ 보안 경고로 잠재적 위험 알림
- ✅ 기존 구성을 자동으로 감지하고, 유지/수정/재설정 가능
- ✅ **Anthropic setup-token** 프로세스(권장) 및 API Key 방식 지원
- ✅ **CLAWDBOT_PROFILE** 다중 구성 파일 환경 지원
- ✅ 채널 및 스킬 자동 구성
- ✅ 안전한 기본값 생성(loopback 바인딩, token 인증)

**권장 워크플로우**:
1. 처음 사용: `clawdbot onboard --install-daemon`
2. 구성 수정: `clawdbot configure`
3. 문제 해결: `clawdbot doctor`
4. 원격 액세스: Tailscale Serve/Funnel 구성

**다음 단계**:
- [Gateway 시작](../gateway-startup/): Gateway를 백그라운드에서 실행
- [첫 번째 메시지 보내기](../first-message/): AI 어시스턴트와 대화 시작
- [DM 페어링 이해하기](../pairing-approval/): 보안 제어로 알 수 없는 발신자 차단

---

## 다음 수업 예고

> 다음 수업에서는 **[Gateway 시작](../gateway-startup/)**을 학습합니다.
>
> 배울 내용:
> - Gateway 데몬을 시작하는 방법
> - 개발 모드와 프로덕션 모드의 차이점
> - Gateway 상태를 모니터링하는 방법
> - launchd/systemd를 사용하여 자동 시작

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능           | 파일 경로                                                                                                  | 라인 번호      |
| -------------- | ------------------------------------------------------------------------------------------------- | --------- |
| 마법사 메인 프로세스     | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 87-452    |
| 보안 경고 확인   | [`src/wizard/onboarding.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.ts) | 46-85     |
| Gateway 구성   | [`src/wizard/onboarding.gateway-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.gateway-config.ts) | 28-249    |
| 마법사 인터페이스 정의   | [`src/wizard/prompts.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/prompts.ts) | 36-52     |
| 채널 구성     | [`src/commands/onboard-channels.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-channels.ts) | -         |
| 스킬 구성     | [`src/commands/onboard-skills.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/onboard-skills.ts) | -         |
| 마법사 타입 정의   | [`src/wizard/onboarding.types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/wizard/onboarding.types.ts) | 1-26      |
| 구성 파일 Schema | [`src/config/zod-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.ts) | -         |

**핵심 타입**:
- `WizardFlow`: `"quickstart" | "advanced"` - 마법사 모드 타입
- `QuickstartGatewayDefaults`: QuickStart 모드의 Gateway 기본 구성
- `GatewayWizardSettings`: Gateway 구성 설정
- `WizardPrompter`: 마법사 인터랙션 인터페이스

**핵심 함수**:
- `runOnboardingWizard()`: 메인 마법사 프로세스
- `configureGatewayForOnboarding()`: Gateway 네트워크 및 인증 구성
- `requireRiskAcknowledgement()`: 보안 경고 표시 및 확인

**기본 구성값** (QuickStart 모드):
- Gateway 포트: 18789
- 바인딩 주소: loopback (127.0.0.1)
- 인증 방식: token (무작위 token 자동 생성)
- Tailscale: off
- 작업 공간: `~/clawd`

**구성 파일 위치**:
- 메인 구성: `~/.clawdbot/clawdbot.json`
- OAuth 자격 증명: `~/.clawdbot/credentials/oauth.json`
- API Key 자격 증명: `~/.clawdbot/credentials/`
- 세션 데이터: `~/clawd/sessions.json`

</details>
