---
title: "다중 채널 시스템 개요: Clawdbot이 지원하는 13개 이상의 통신 채널 완전 상세 가이드 | Clawdbot 튜토리얼"
sidebarTitle: "적절한 채널 선택하기"
subtitle: "다중 채널 시스템 개요: Clawdbot이 지원하는 모든 통신 채널"
description: "Clawdbot이 지원하는 13개 이상의 통신 채널(WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage, LINE 등)을 학습하세요. 각 채널의 인증 방식, 특징, 사용 시나리오를 마스터하고 가장 적합한 채널을 선택하여 구성을 시작하세요. 튜토리얼은 DM 페어링 보호, 그룹 메시지 처리, 구성 방법을 다룹니다."
tags:
  - "채널"
  - "플랫폼"
  - "다중 채널"
  - "입문"
prerequisite:
  - "/ko/moltbot/moltbot/start/getting-started"
order: 60
---

# 다중 채널 시스템 개요: Clawdbot이 지원하는 모든 통신 채널

## 학습 후 달성 가능한 사항

이 튜토리얼을 완료한 후 다음을 수행할 수 있습니다:

- ✅ Clawdbot이 지원하는 13개 이상의 통신 채널 이해
- ✅ 각 채널의 인증 방식 및 구성 포인트 마스터
- ✅ 사용 시나리오에 따른 가장 적합한 채널 선택
- ✅ DM 페어링 보호 메커니즘의 보안 가치 이해

## 현재 상황

다음과 같은 고민이 있을 수 있습니다:

- "Clawdbot은 어떤 플랫폼을 지원하나요?"
- "WhatsApp, Telegram, Slack은 어떤 차이가 있나요?"
- "어떤 채널이 가장 간단하고 빠른가요?"
- "각 플랫폼에서 봇을 등록해야 하나요?"

좋은 소식: **Clawdbot은 다양한 채널 선택을 제공하며, 습관과 요구에 따라 자유롭게 조합할 수 있습니다**.

## 사용 시기

다음 경우에 유용합니다:

- 🌐 **다중 채널 통합 관리** — 하나의 AI 어시스턴트로 여러 채널 동시 사용 가능
- 🤝 **팀 협업** — Slack, Discord, Google Chat 등 업무 플랫폼 통합
- 💬 **개인 채팅** — WhatsApp, Telegram, iMessage 등 일상적인 통신 도구
- 🔧 **유연한 확장** — LINE, Zalo 등 지역별 플랫폼 지원

::: tip 다중 채널의 가치
여러 채널을 사용하는 장점:
- **매끄러운 전환**: 집에서 WhatsApp, 회사에서 Slack, 외출 시 Telegram 사용
- **다중 장치 동기화**: 모든 채널에서 메시지 및 세션 유지
- **다양한 시나리오 커버**: 각 플랫폼마다 장점이 있어 조합 사용 시 최적의 효과
:::

---

## 핵심 개념

Clawdbot의 채널 시스템은 **플러그인 아키텍처**를 채택합니다:

```
┌─────────────────────────────────────────────────┐
│              Gateway (제어 평면)                   │
│         ws://127.0.0.1:18789                  │
└───────────────┬─────────────────────────────────┘
                │
        ┌───────┼───────┬─────────┬───────┐
        │       │       │         │       │
    WhatsApp  Telegram  Slack  Discord  ... 등 13개 이상의 채널
        │       │       │         │       │
    Baileys  grammY   Bolt  discord.js ...
```

**핵심 개념**:

| 개념         | 역할                         |
|--- | ---|
| **채널 플러그인** | 각 채널은 독립적인 플러그인으로 구현    |
| **통합 인터페이스** | 모든 채널에서 동일한 API 사용        |
| **DM 보호**   | 기본적으로 페어링 메커니즘 활성화, 알 수 없는 발신자 차단 |
| **그룹 지원**  | `@mention` 및 명령어 트리거 지원    |

---

## 지원하는 채널 개요

Clawdbot은 **13개 이상의 통신 채널**을 지원하며, 두 가지 카테고리로 분류됩니다:

### 핵심 채널(내장)

| 채널           | 인증 방식             | 난이도 | 특징                              |
|--- | --- | --- | ---|
| **Telegram**   | Bot Token            | ⭐   | 가장 간단하고 빠름, 초보자 추천                |
| **WhatsApp**   | QR Code / Phone Link | ⭐⭐  | 실제 번호 사용, 별도 휴대폰 + eSIM 추천 |
| **Slack**      | Bot Token + App Token | ⭐⭐ | 업무 환경 최적, Socket Mode         |
| **Discord**    | Bot Token            | ⭐⭐  | 커뮤니티 및 게임 시나리오, 풍부한 기능         |
| **Google Chat** | OAuth / Service Account | ⭐⭐⭐ | Google Workspace 기업 통합        |
| **Signal**     | signal-cli           | ⭐⭐⭐ | 높은 보안성, 설정 복잡              |
| **iMessage**   | imsg (macOS)        | ⭐⭐⭐ | macOS 전용, 아직 개발 중          |

### 확장 채널(외부 플러그인)

| 채널             | 인증 방식             | 유형       | 특징                              |
|--- | --- | --- | ---|
| **WebChat**       | Gateway WebSocket     | 내장       | 타사 인증 불필요, 가장 간단            |
| **LINE**          | Messaging API        | 외부 플러그인   | 아시아 사용자에게 인기                     |
| **BlueBubbles**   | Private API         | 확장 플러그인   | iMessage 확장, 원격 장치 지원       |
| **Microsoft Teams** | Bot Framework       | 확장 플러그인   | 기업 협업                           |
| **Matrix**        | Matrix Bot SDK      | 확장 플러그인   | 분산형 통신                       |
| **Zalo**         | Zalo OA             | 확장 플러그인   | 베트남 사용자에게 인기                     |
| **Zalo Personal** | Personal Account     | 확장 플러그인   | Zalo 개인 계정                       |

::: info 채널 선택 방법?
- **초보자**: Telegram 또는 WebChat부터 시작
- **개인 사용**: WhatsApp(기존 번호 있는 경우), Telegram
- **팀 협업**: Slack, Google Chat, Discord
- **보안 우선**: Signal
- **Apple 생태계**: iMessage, BlueBubbles
:::

---

## 핵심 채널 상세 설명

### 1. Telegram(초보자 추천)

**추천 이유**:
- ⚡ 가장 간단한 구성 절차(Bot Token만 필요)
- 📱 Markdown 및 리치 미디어 기본 지원
- 🌍 전 세계 사용 가능, 특수 네트워크 환경 불필요

**인증 방식**:
1. Telegram에서 `@BotFather` 찾기
2. `/newbot` 명령 전송
3. 안내에 따라 봇 이름 설정
4. Bot Token 획득(형식: `123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ`)

**구성 예시**:
```yaml
channels:
  telegram:
    botToken: "123456789:ABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"  # 기본 DM 페어링 보호
    allowFrom: ["*"]     # 페어링 후 모든 사용자 허용
```

**특징**:
- ✅ Thread/Topic 지원
- ✅ Reaction 이모지 지원
- ✅ 파일, 이미지, 비디오 지원

---

### 2. WhatsApp(개인 사용자 추천)

**추천 이유**:
- 📱 실제 휴대폰 번호 사용, 새로운 연락처 추가 불필요
- 🌍 전 세계에서 가장 인기 있는 인스턴트 메시징 도구
- 📞 음성 메시지 및 통화 지원

**인증 방식**:
1. `clawdbot channels login whatsapp` 실행
2. QR 코드 스캔(WhatsApp Web 유사)
3. 또는 휴대폰 연결 사용(새로운 기능)

**구성 예시**:
```yaml
channels:
  whatsapp:
    accounts:
      my-phone:
        dmPolicy: "pairing"  # 기본 DM 페어링 보호
        allowFrom: ["*"]     # 페어링 후 모든 사용자 허용
```

**특징**:
- ✅ 리치 미디어 지원(이미지, 비디오, 문서)
- ✅ 음성 메시지 지원
- ✅ Reaction 이모지 지원
- ⚠️ **별도 휴대폰 필요**(eSIM + 예비 기기 추천)

::: warning WhatsApp 제한 사항
- 동일 번호로 여러 곳에서 동시에 로그인하지 마세요
- 잦은 재연결 피하기(일시적 정지 가능)
- 별도의 테스트 번호 사용 권장
:::

---

### 3. Slack(팀 협업 추천)

**추천 이유**:
- 🏢 기업 및 팀에서 널리 사용
- 🔧 풍부한 Actions 및 Slash Commands 지원
- 📋 워크플로우와 매끄러운 통합

**인증 방식**:
1. [Slack API](https://api.slack.com/apps)에서 앱 생성
2. Bot Token Scopes 활성화
3. App-Level Token 활성화
4. Socket Mode 활성화
5. Bot Token 및 App Token 획득

**구성 예시**:
```yaml
channels:
  slack:
    botToken: "xoxb-YOUR-BOT-TOKEN-HERE"
    appToken: "xapp-YOUR-APP-TOKEN-HERE"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**특징**:
- ✅ 채널, DM, 그룹 지원
- ✅ Slack Actions 지원(채널 생성, 사용자 초대 등)
- ✅ 파일 업로드, 이모지 지원
- ⚠️ Socket Mode 활성화 필요(포트 노출 방지)

---

### 4. Discord(커뮤니티 시나리오 추천)

**추천 이유**:
- 🎮 게임 및 커뮤니티 시나리오에 적합
- 🤖 Discord 고유 기능 지원(역할, 채널 관리)
- 👥 강력한 그룹 및 커뮤니티 기능

**인증 방식**:
1. [Discord Developer Portal](https://discord.com/developers/applications)에서 앱 생성
2. Bot 사용자 생성
3. Message Content Intent 활성화
4. Bot Token 획득

**구성 예시**:
```yaml
channels:
  discord:
    botToken: "MTIzNDU2Nzg5MDEyMzQ1Njgw.GhIJKlmNoPQRsTUVwxyZABCDefGhIJKlmNoPQRsTUVwxyZ"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

**특징**:
- ✅ 역할 및 권한 관리 지원
- ✅ 채널, 스레드, 이모지 지원
- ✅ 특정 Actions 지원(채널 생성, 역할 관리 등)
- ⚠️ Intents 올바른 구성 필요

---

### 5. 기타 핵심 채널

#### Google Chat
- **사용 시나리오**: Google Workspace 기업 사용자
- **인증 방식**: OAuth 또는 Service Account
- **특징**: Gmail, Calendar와 통합

#### Signal
- **사용 시나리오**: 보안 우선 사용자
- **인증 방식**: signal-cli
- **특징**: 종단 간 암호화, 높은 보안성

#### iMessage
- **사용 시나리오**: macOS 사용자
- **인증 방식**: imsg (macOS 전용)
- **특징**: Apple 생태계 통합, 아직 개발 중

---

## 확장 채널 소개

### WebChat(가장 간단)

**추천 이유**:
- 🚀 타사 계정 또는 Token 불필요
- 🌐 내장 Gateway WebSocket 지원
- 🔧 빠른 개발 및 디버깅

**사용 방법**:

Gateway 시작 후 다음 방법으로 직접 접근:
- **macOS/iOS app**: 기본 SwiftUI 인터페이스
- **Control UI**: 브라우저에서 콘솔 채팅 탭 접근

**특징**:
- ✅ 구성 불필요, 바로 사용 가능
- ✅ 테스트 및 디버깅 지원
- ✅ 다른 채널과 세션 및 라우팅 규칙 공유
- ⚠️ 로컬 액세스만 가능(Tailscale로 노출 가능)

---

### LINE(아시아 사용자)

**사용 시나리오**: 일본, 대만, 태국 등 LINE 사용자

**인증 방식**: Messaging API(LINE Developers Console)

**특징**:
- ✅ 버튼, 빠른 응답 지원
- ✅ 아시아 시장에서 널리 사용
- ⚠️ 심사 및 비즈니스 계정 필요

---

### BlueBubbles(iMessage 확장)

**사용 시나리오**: 원격 iMessage 액세스 필요

**인증 방식**: Private API

**특징**:
- ✅ iMessage 원격 제어
- ✅ 여러 장치 지원
- ⚠️ 별도 BlueBubbles 서버 필요

---

### Microsoft Teams(기업 협업)

**사용 시나리오**: Office 365 사용 기업

**인증 방식**: Bot Framework

**특징**:
- ✅ Teams와 깊은 통합
- ✅ Adaptive Cards 지원
- ⚠️ 복잡한 구성

---

### Matrix(분산형)

**사용 시나리오**: 분산형 통신 애호가

**인증 방식**: Matrix Bot SDK

**특징**:
- ✅ 연합 네트워크
- ✅ 종단 간 암호화
- ⚠️ Homeserver 구성 필요

---

### Zalo / Zalo Personal(베트남 사용자)

**사용 시나리오**: 베트남 시장

**인증 방식**: Zalo OA / Personal Account

**특징**:
- ✅ 개인 계정 및 기업 계정 지원
- ⚠️ 지역 제한(베트남)

---

## DM 페어링 보호 메커니즘

### DM 페어링 보호란?

Clawdbot은 기본적으로 **DM 페어링 보호**(`dmPolicy="pairing"`)를 활성화합니다. 이는 보안 기능입니다:

1. **알 수 없는 발신자**는 페어링 코드를 받습니다
2. 페어링이 승인될 때까지 메시지가 처리되지 않습니다
3. 승인 후 발신자는 로컬 허용 목록에 추가됩니다

::: warning 페어링 보호가 필요한 이유?
Clawdbot은 실제 메시징 플랫폼에 연결되므로 **인바운드 DM을 신뢰할 수 없는 입력으로 처리해야 합니다**. 페어링 보호는 다음을 방지할 수 있습니다:
- 스팸 메시지 및 남용
- 악성 명령 처리
- AI 할당량 및 개인정보 보호
:::

### 페어링 승인 방법?

```bash
# 승인 대기 중인 페어링 요청 확인
clawdbot pairing list

# 페어링 승인
clawdbot pairing approve <channel> <code>

# 예시: Telegram 발신자 승인
clawdbot pairing approve telegram 123456
```

### 페어링 프로세스 예시

```
알 수 없는 발신자: Hello AI!
Clawdbot: 🔒 먼저 페어링하세요. 페어링 코드: ABC123
당신의 작업: clawdbot pairing approve telegram ABC123
Clawdbot: ✅ 페어링 성공! 이제 메시지를 보낼 수 있습니다.
```

::: tip DM 페어링 보호 비활성화(비추천)
공개 액세스를 원하는 경우 다음과 같이 설정:
```yaml
channels:
  telegram:
    dmPolicy: "open"
    allowFrom: ["*"]  # 모든 사용자 허용
```

⚠️ 보안이 낮아지므로 주의해서 사용하세요!
:::

---

## 그룹 메시지 처리

### @mention 트리거

기본적으로 그룹 메시지는 봇을 **@mention**해야 응답합니다:

```yaml
channels:
  slack:
    allowUnmentionedGroups: false  # 기본: @mention 필요
```

### 명령어 트리거

명령어 접두사로 트리거할 수도 있습니다:

```bash
# 그룹에서 전송
/ask 양자 얽힘 설명
/help 사용 가능한 명령어 나열
/new 새 세션 시작
```

### 구성 예시

```yaml
channels:
  discord:
    allowUnmentionedGroups: false  # @mention 필요
    # 또는
    allowUnmentionedGroups: true   # 모든 메시지에 응답(비추천)
```

---

## 채널 구성: 위저드 vs 수동

### 방법 A: 온보딩 위저드 사용(추천)

```bash
clawdbot onboard
```

위저드는 다음을 안내합니다:
1. 채널 선택
2. 인증 구성(Token, API Key 등)
3. DM 정책 설정
4. 연결 테스트

### 방법 B: 수동 구성

구성 파일 `~/.clawdbot/clawdbot.json` 편집:

```yaml
channels:
  telegram:
    botToken: "your-bot-token"
    dmPolicy: "pairing"
    allowFrom: ["*"]
  whatsapp:
    accountId: "my-phone"
    dmPolicy: "pairing"
    allowFrom: ["*"]
```

Gateway 재시작하여 구성 적용:

```bash
clawdbot gateway restart
```

---

## 체크포인트 ✅

이 튜토리얼을 완료한 후 다음을 수행할 수 있어야 합니다:

- [ ] Clawdbot이 지원하는 모든 채널 나열
- [ ] DM 페어링 보호 메커니즘 이해
- [ ] 가장 적합한 채널 선택
- [ ] 채널 구성 방법 숙지(위저드 또는 수동)
- [ ] 그룹 메시지 트리거 방법 이해

::: tip 다음 단계
채널을 하나 선택하고 구성 시작:
- [WhatsApp 채널 구성](../whatsapp/) - 실제 번호 사용
- [Telegram 채널 구성](../telegram/) - 가장 간단하고 빠름
- [Slack 채널 구성](../slack/) - 팀 협업에 적합
- [Discord 채널 구성](../discord/) - 커뮤니티 시나리오
:::

---

## 주요 사항 주의

### ❌ DM 페어링 보호 활성화를 잊음

**잘못된 방법**:
```yaml
channels:
  telegram:
    dmPolicy: "open"  # 너무 개방적!
```

**올바른 방법**:
```yaml
channels:
  telegram:
    dmPolicy: "pairing"  # 보안 기본값
```

::: danger DM 개방 위험
DM을 개방하면 누구나 AI 어시스턴트에게 메시지를 보낼 수 있으며, 다음과 같은 문제가 발생할 수 있습니다:
- 할당량 남용
- 개인정보 유출
- 악성 명령 실행
:::

### ❌ WhatsApp 여러 곳에서 로그인

**잘못된 방법**:
- 휴대폰과 Clawdbot에서 동일 번호로 동시에 로그인
- WhatsApp을 자주 재연결

**올바른 방법**:
- 별도의 테스트 번호 사용
- 잦은 재연결 피하기
- 연결 상태 모니터링

### ❌ Slack Socket Mode 비활성화

**잘못된 방법**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    # appToken 누락
```

**올바른 방법**:
```yaml
channels:
  slack:
    botToken: "xoxb-..."
    appToken: "xapp-..."  # 필수
```

### ❌ Discord Intents 구성 오류

**잘못된 방법**:
- 기본 Intents만 활성화
- Message Content Intent 활성화를 잊음

**올바른 방법**:
- Discord Developer Portal에서 모든 필수 Intents 활성화
- 특히 Message Content Intent

---

## 수업 요약

이 수업에서 학습한 내용:

1. ✅ **채널 개요**: Clawdbot은 13개 이상의 통신 채널 지원
2. ✅ **핵심 채널**: Telegram, WhatsApp, Slack, Discord의 특징 및 구성
3. ✅ **확장 채널**: LINE, BlueBubbles, Teams, Matrix 등 특수 채널
4. ✅ **DM 보호**: 페어링 메커니즘의 보안 가치 및 사용 방법
5. ✅ **그룹 처리**: @mention 및 명령어 트리거 메커니즘
6. ✅ **구성 방법**: 위저드 및 수동 구성 두 가지 방법

**다음 단계**:

- [WhatsApp 채널 구성](../whatsapp/) 학습, 실제 번호 설정
- [Telegram 채널 구성](../telegram/) 학습, 가장 빠른 시작 방법
- [Slack 채널 구성](../slack/) 이해, 팀 협업 통합
- [Discord 채널 구성](../discord/) 마스터, 커뮤니티 시나리오

---

## 다음 수업 예고

> 다음 수업에서 **[WhatsApp 채널 구성](../whatsapp/)**을 학습합니다.
>
> 다음 내용을 배웁니다:
> - QR Code 또는 휴대폰 연결로 WhatsApp 로그인 방법
> - DM 정책 및 그룹 규칙 구성 방법
> - 여러 WhatsApp 계정 관리 방법
> - WhatsApp 연결 문제 해결 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능            | 파일 경로                                                                                               | 행 번호    |
|--- | --- | ---|
| 채널 레지스트리       | [`src/channels/registry.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/registry.ts) | 7-100   |
| 채널 플러그인 디렉토리   | [`src/channels/plugins/`](https://github.com/moltbot/moltbot/tree/main/src/channels/plugins/) | 전체 디렉토리  |
| 채널 메타데이터 유형   | [`src/channels/plugins/types.core.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/types.core.ts) | 74-93   |
| DM 페어링 메커니즘     | [`src/channels/plugins/pairing.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/pairing.ts) | 전체 파일  |
| 그룹 @mention | [`src/channels/plugins/group-mentions.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/group-mentions.ts) | 전체 파일  |
| 허용 목록 매칭     | [`src/channels/plugins/allowlist-match.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/allowlist-match.ts) | 전체 파일  |
| 채널 디렉토리 구성   | [`src/channels/plugins/directory-config.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/directory-config.ts) | 전체 파일  |
| WhatsApp 플러그인 | [`src/channels/plugins/onboarding/whatsapp.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/whatsapp.ts) | 전체 파일  |
| Telegram 플러그인 | [`src/channels/plugins/onboarding/telegram.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/telegram.ts) | 전체 파일  |
| Slack 플러그인     | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 전체 파일  |
| Discord 플러그인   | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/moltbot/moltbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 전체 파일  |

**핵심 상수**:
- `CHAT_CHANNEL_ORDER`：핵심 채널 순서 배열(`src/channels/registry.ts:7-15`에서 가져옴)
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`：기본 채널(`src/channels/registry.ts:21`에서 가져옴)
- `dmPolicy="pairing"`：기본 DM 페어링 정책(`README.md:110`에서 가져옴)

**핵심 유형**:
- `ChannelMeta`：채널 메타데이터 인터페이스(`src/channels/plugins/types.core.ts:74-93`에서 가져옴)
- `ChannelAccountSnapshot`：채널 계정 상태 스냅샷(`src/channels/plugins/types.core.ts:95-142`에서 가져옴)
- `ChannelSetupInput`：채널 구성 입력 인터페이스(`src/channels/plugins/types.core.ts:19-51`에서 가져옴)

**핵심 함수**:
- `listChatChannels()`：모든 핵심 채널 나열(`src/channels/registry.ts:114-116`)
- `normalizeChatChannelId()`：채널 ID 정규화(`src/channels/registry.ts:126-133`)
- `buildChannelUiCatalog()`：UI 카탈로그 구축(`src/channels/plugins/catalog.ts:213-239`)

</details>
