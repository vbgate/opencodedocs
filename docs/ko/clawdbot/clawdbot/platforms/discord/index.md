---
title: "Discord 채널 설정 및 사용 | Clawdbot 튜토리얼"
sidebarTitle: "Discord Bot 연결하기"
subtitle: "Discord 채널 설정 및 사용"
description: "Discord Bot을 생성하고 Clawdbot에 설정하는 방법을 학습합니다. 본 튜토리얼은 Discord Developer Portal에서 Bot 생성, Gateway Intents 권한 설정, Bot Token 구성 방법, OAuth2 초대 URL 생성, DM 페어링 보호 메커니즘, 서버 채널 화이트리스트 설정, AI Discord 도구 호출 권한 관리 및 일반적인 문제 해결 단계를 다룹니다."
tags:
  - "채널 설정"
  - "Discord"
  - "Bot"
prerequisite:
  - "start-getting-started"
order: 100
---

# Discord 채널 설정 및 사용

## 학습 후 달성할 수 있는 것

- Discord Bot 생성 및 Bot Token 획득
- Clawdbot과 Discord Bot 통합 설정
- Discord DM(개인 메시지) 및 서버 채널에서 AI 어시스턴트 사용
- 액세스 제어 설정(DM 페어링, 채널 화이트리스트)
- AI가 Discord 도구 호출(메시지 전송, 채널 생성, 역할 관리 등)

## 현재 겪고 있는 문제

이미 Discord를 사용하여 친구나 팀과 소통 중이며, 앱 전환 없이 Discord에서 직접 AI 어시스턴트와 대화하고 싶습니다. 다음 문제를 겪고 있을 수 있습니다:

- Discord Bot 생성 방법을 모름
- Bot이 정상 작동하는 데 필요한 권한이 명확하지 않음
- Bot과 상호작용할 수 있는 사용자 제어 필요(낯선 사람의 악용 방지)
- 다른 서버 채널에서 다른 동작 설정 필요

본 튜토리얼에서는 이러한 문제를 단계별로 해결하는 방법을 가르쳐 드립니다.

## 언제 사용하면 좋은가

Discord 채널은 다음 시나리오에 적합합니다:

- ✅ Discord 헤비 사용자로 대부분의 소통이 Discord에서 이루어지는 경우
- ✅ Discord 서버에 AI 기능 추가(예: `#help` 채널의 스마트 어시스턴트)
- ✅ Discord DM을 통해 AI와 상호작용(WebChat보다 편리함)
- ✅ AI가 Discord에서 관리 작업 수행 필요(채널 생성, 메시지 전송 등)

::: info Discord 채널은 discord.js를 기반으로 하며, 완전한 Bot API 기능을 지원합니다.
:::

## 🎒 시작 전 준비

**필수 조건**:
- [빠른 시작](../../start/getting-started/) 완료, Gateway 실행 가능
- Node.js ≥ 22
- Discord 계정(애플리케이션 생성 가능)

**필요한 정보**:
- Discord Bot Token(나중에 획득 방법 안내)
- 서버 ID(선택 사항, 특정 채널 설정용)
- 채널 ID(선택 사항, 세밀한 제어용)

## 핵심 개념

### Discord 채널 작동 방식

Discord 채널은 **공식 Bot API**를 통해 Discord와 통신합니다:

```
Discord 사용자
     ↓
  Discord 서버
     ↓
  Discord Bot Gateway
     ↓ (WebSocket)
  Clawdbot Gateway
     ↓
  AI Agent (Claude/GPT 등)
     ↓
  Discord Bot API (응답 전송)
     ↓
Discord 서버
     ↓
Discord 사용자(응답 표시)
```

**핵심 포인트**:
- Bot은 WebSocket을 통해 메시지 수신(Gateway → Bot)
- Clawdbot은 메시지를 AI Agent로 전달 처리
- AI는 `discord` 도구를 호출하여 Discord 특정 작업 수행
- 모든 응답은 Bot API를 통해 Discord로 전송

### DM과 서버 채널의 차이

| 유형 | 세션 격리 | 기본 동작 | 사용 시나리오 |
|--- | --- | --- | ---|
| **개인 메시지(DM)** | 모든 DM이 `agent:main:main` 세션 공유 | 페어링(pairing) 보호 필요 | 개인 대화, 컨텍스트 연속 |
| **서버 채널** | 각 채널 독립 세션 `agent:<agentId>:discord:channel:<channelId>` | @멘션 시에만 응답 | 서버 스마트 어시스턴트, 다중 채널 병렬 |

::: tip
서버 채널의 세션은 완전히 격리되어 있어 서로 간섭하지 않습니다. `#help` 채널의 대화는 `#general`에 표시되지 않습니다.
:::

### 기본 보안 메커니즘

Discord 채널은 기본적으로 **DM 페어링 보호**를 활성화합니다:

```
알 수 없는 사용자 → DM 전송 → Clawdbot
                              ↓
                      처리 거부, 페어링 코드 반환
                              ↓
                사용자가 `clawdbot pairing approve discord <code>` 실행 필요
                              ↓
                            페어링 성공, 대화 가능
```

이는 낯선 사용자가 직접 AI 어시스턴트와 상호작용하는 것을 방지합니다.

---

## 따라하기

### 1단계: Discord 애플리케이션 및 Bot 생성

**이유**
Discord Bot은 Discord 서버에 연결하려면 "신원"이 필요합니다. 이 신원이 Bot Token입니다.

#### 1.1 Discord 애플리케이션 생성

1. [Discord Developer Portal](https://discord.com/developers/applications) 열기
2. **New Application**(새 애플리케이션) 클릭
3. 애플리케이션 이름 입력(예: `Clawdbot AI`)
4. **Create**(생성) 클릭

#### 1.2 Bot 사용자 추가

1. 왼쪽 탐색에서 **Bot**(로봇) 클릭
2. **Add Bot** → **Reset Token** → **Reset Token**(토큰 재설정) 클릭
3. **중요**: 즉시 Bot Token 복사(한 번만 표시됩니다!)

```
Bot Token 형식: MTAwOTk1MDk5NjQ5NTExNjUy.Gm9...
(재설정할 때마다 변경되므로 안전하게 보관하세요!)
```

#### 1.3 필요한 Gateway Intents 활성화

Discord는 기본적으로 Bot이 메시지 내용을 읽도록 허용하지 않으므로 수동으로 활성화해야 합니다.

**Bot → Privileged Gateway Intents**(특권 Gateway 의도)에서 활성화:

| Intent | 필수 여부 | 설명 |
|--- | --- | ---|
| **Message Content Intent** | ✅ **필수** | 메시지 텍스트 내용 읽기(없으면 Bot이 메시지를 볼 수 없음) |
| **Server Members Intent** | ⚠️ **권장** | 멤버 검색 및 사용자 이름 확인용 |

::: danger 금지사항
실제로 사용자 온라인 상태가 필요하지 않은 한 **Presence Intent**(상태 의도)를 활성화하지 마세요.
:::

**확인해야 할 항목**: 두 스위치 모두 녹색(ON) 상태여야 합니다.

---

### 2단계: 초대 URL 생성 및 서버에 추가

**이유**
Bot이 서버에서 메시지를 읽고 보내려면 권한이 필요합니다.

1. 왼쪽 탐색에서 **OAuth2 → URL Generator** 클릭
2. **Scopes**(범위)에서 선택:
   - ✅ **bot**
   - ✅ **applications.commands**(기본 명령용)

3. **Bot Permissions**(Bot 권한)에서 최소한 다음을 선택:

| 권한 | 설명 |
|--- | ---|
| **View Channels** | 채널 보기 |
| **Send Messages** | 메시지 전송 |
| **Read Message History** | 메시지 기록 읽기 |
| **Embed Links** | 링크 임베드 |
| **Attach Files** | 파일 업로드 |

선택적 권한(필요에 따라 추가):
- **Add Reactions**(반응 추가)
- **Use External Emojis**(사용자 정의 이모지 사용)

::: warning 보안 팁
디버깅 중이고 Bot을 완전히 신뢰하는 경우가 아니라면 **Administrator**(관리자) 권한을 부여하지 마세요.
:::

4. 생성된 URL 복사
5. 브라우저에서 URL 열기
6. 서버 선택, **Authorize**(승인) 클릭

**확인해야 할 항목**: Bot이 성공적으로 서버에 가입하고 녹색 온라인 상태로 표시되어야 합니다.

---

### 3단계: 필요한 ID 획득(서버, 채널, 사용자)

**이유**
Clawdbot 구성은 ID(숫자) 사용을 우선시합니다. ID는 변경되지 않기 때문입니다.

#### 3.1 Discord 개발자 모드 활성화

1. Discord 데스크톱/웹 → **User Settings**(사용자 설정)
2. **Advanced**(고급) → **Developer Mode**(개발자 모드) 활성화

#### 3.2 ID 복사

| 유형 | 작업 |
|--- | ---|
| **서버 ID** | 서버 이름 우클릭 → **Copy Server ID** |
| **채널 ID** | 채널(예: `#general`) 우클릭 → **Copy Channel ID** |
| **사용자 ID** | 사용자 아바타 우클릭 → **Copy User ID** |

::: tip ID vs 이름
구성 시 ID 사용을 우선시하세요. 이름은 변경될 수 있지만 ID는 절대 변경되지 않습니다.
:::

**확인해야 할 항목**: ID가 클립보드에 복사되어야 합니다(형식: `123456789012345678`).

---

### 4단계: Clawdbot Discord 연결 설정

**이유**
Clawdbot에 Discord Bot에 연결하는 방법을 알려줍니다.

#### 방법 1: 환경 변수(권장, 서버용)

```bash
export DISCORD_BOT_TOKEN="YOUR_BOT_TOKEN"

clawdbot gateway --port 18789
```

#### 방법 2: 구성 파일

`~/.clawdbot/clawdbot.json` 편집:

```json5
{
  channels: {
    discord: {
      enabled: true,
      token: "YOUR_BOT_TOKEN"  // 1단계에서 복사한 Token
    }
  }
}
```

::: tip 환경 변수 우선순위
환경 변수와 구성 파일을 동시에 설정한 경우 **구성 파일이 우선**합니다.
:::

**확인해야 할 항목**: Gateway 시작 후 Discord Bot이 온라인 상태로 표시되어야 합니다.

---

### 5단계: 연결 확인 및 테스트

**이유**
구성이 올바르고 Bot이 정상적으로 메시지를 수신하고 전송할 수 있는지 확인합니다.

1. Gateway 시작(아직 시작하지 않은 경우):

```bash
clawdbot gateway --port 18789 --verbose
```

2. Discord Bot 상태 확인:
   - Bot이 서버 멤버 목록에서 **녹색 온라인**으로 표시되어야 함
   - 회색 오프라인인 경우 Token이 올바른지 확인

3. 테스트 메시지 전송:

Discord에서:
- **DM**: Bot에 직접 메시지 전송(페어링 코드 수신, 다음 섹션 참조)
- **서버 채널**: @멘션 Bot, 예: `@ClawdbotAI hello`

**확인해야 할 항목**: Bot이 메시지로 응답해야 합니다(내용은 AI 모델에 따라 다름).

::: tip 테스트 실패?
Bot이 응답하지 않는 경우 [문제 해결](#문제-해결) 섹션을 확인하세요.
:::

---

## 체크포인트 ✅

계속하기 전에 다음을 확인하세요:

- [ ] Bot Token이 올바르게 구성됨
- [ ] Bot이 서버에 성공적으로 가입됨
- [ ] Message Content Intent가 활성화됨
- [ ] Gateway가 실행 중임
- [ ] Bot이 Discord에서 온라인으로 표시됨
- [ ] @멘션 Bot으로 응답을 받을 수 있음

---

## 고급 구성

### DM 액세스 제어

기본 정책은 `pairing`(페어링 모드)으로 개인 사용에 적합합니다. 필요에 따라 조정할 수 있습니다:

| 정책 | 설명 | 구성 예시 |
|--- | --- | ---|
| **pairing**(기본) | 낯선 사용자가 페어링 코드를 받고 수동 승인 필요 | `"dm": { "policy": "pairing" }` |
| **allowlist** | 목록에 있는 사용자만 허용 | `"dm": { "policy": "allowlist", "allowFrom": ["123456", "alice"] }` |
| **open** | 모두 허용(`allowFrom`에 `"*"` 포함 필요) | `"dm": { "policy": "open", "allowFrom": ["*"] }` |
| **disabled** | 모든 DM 비활성화 | `"dm": { "enabled": false }` |

#### 구성 예시: 특정 사용자 허용

```json5
{
  channels: {
    discord: {
      dm: {
        enabled: true,
        policy: "allowlist",
        allowFrom: [
          "123456789012345678",  // 사용자 ID
          "@alice",                   // 사용자 이름(ID로 확인됨)
          "alice#1234"              // 전체 사용자 이름
        ]
      }
    }
  }
}
```

#### 페어링 요청 승인

낯선 사용자가 처음으로 DM을 보낼 때 페어링 코드를 받습니다. 승인 방법:

```bash
clawdbot pairing approve discord <페어링 코드>
```

### 서버 채널 구성

#### 기본 구성: 특정 채널만 허용

```json5
{
  channels: {
    discord: {
      groupPolicy: "allowlist",  // 화이트리스트 모드(기본)
      guilds: {
        "123456789012345678": {
          requireMention: true,  // @멘션 시에만 응답
          channels: {
            help: { allow: true },    // #help 허용
            general: { allow: true } // #general 허용
          }
        }
      }
    }
  }
}
```

::: tip
`requireMention: true`는 권장 구성으로, Bot이 공개 채널에서 "스스로 똑똑해지는 것"을 방지합니다.
:::

#### 고급 구성: 채널별 동작

```json5
{
  channels: {
    discord: {
      guilds: {
        "123456789012345678": {
          slug: "my-server",              // 표시 이름(선택 사항)
          reactionNotifications: "own",      // Bot 자신 메시지의 반응만 이벤트 트리거
          channels: {
            help: {
              allow: true,
              requireMention: true,
              users: ["987654321098765432"], // 특정 사용자만 트리거 가능
              skills: ["search", "docs"],    // 사용 가능한 스킬 제한
              systemPrompt: "Keep answers under 50 words."  // 추가 시스템 프롬프트
            }
          }
        }
      }
    }
  }
}
```

### Discord 도구 작업

AI Agent는 `discord` 도구를 호출하여 Discord 특정 작업을 수행할 수 있습니다. `channels.discord.actions`를 통해 권한 제어:

| 작업 범주 | 기본 상태 | 설명 |
|--- | --- | ---|
| **reactions** | ✅ 활성화 | 반응 추가/읽기 |
| **messages** | ✅ 활성화 | 메시지 읽기/전송/편집/삭제 |
| **threads** | ✅ 활성화 | 스레드 생성/응답 |
| **channels** | ✅ 활성화 | 채널 생성/편집/삭제 |
| **pins** | ✅ 활성화 | 메시지 고정/고정 해제 |
| **search** | ✅ 활성화 | 메시지 검색 |
| **memberInfo** | ✅ 활성화 | 멤버 정보 쿼리 |
| **roleInfo** | ✅ 활성화 | 역할 목록 쿼리 |
| **roles** | ❌ **비활성화** | 역할 추가/제거 |
| **moderation** | ❌ **비활성화** | 차단/추방/타임아웃 |

#### 특정 작업 비활성화

```json5
{
  channels: {
    discord: {
      actions: {
        channels: false,      // 채널 관리 비활성화
        moderation: false,   // 모더레이션 작업 비활성화
        roles: false         // 역할 관리 비활성화
      }
    }
  }
}
```

::: danger 보안 경고
`moderation` 및 `roles` 작업을 활성화할 때는 AI에 엄격한 프롬프트와 액세스 제어가 있는지 확인하여 오류로 사용자가 차단되지 않도록 하세요.
:::

### 기타 구성 옵션

| 구성 항목 | 설명 | 기본값 |
|--- | --- | ---|
| `historyLimit` | 서버 채널 컨텍스트에 포함할 기록 메시지 수 | 20 |
| `dmHistoryLimit` | DM 세션 기록 메시지 수 | 무제한 |
| `textChunkLimit` | 단일 메시지 최대 문자 수 | 2000 |
| `maxLinesPerMessage` | 단일 메시지 최대 줄 수 | 17 |
| `mediaMaxMb` | 업로드 미디어 파일 최대 크기(MB) | 8 |
| `chunkMode` | 메시지 청킹 모드(`length`/`newline`) | `length` |

---

## 주요 주의사항

### ❌ "Used disallowed intents" 오류

**원인**: **Message Content Intent**가 활성화되지 않음.

**해결**:
1. Discord Developer Portal로 돌아가기
2. Bot → Privileged Gateway Intents
3. **Message Content Intent** 활성화
4. Gateway 재시작

### ❌ Bot이 연결되지만 응답하지 않음

**가능한 원인**:
1. **Message Content Intent** 누락
2. Bot에 채널 권한 없음
3. 구성에 @멘션이 필요하지만 멘션하지 않음
4. 채널이 화이트리스트에 없음

**해결 단계**:
```bash
# 진단 도구 실행
clawdbot doctor

# 채널 상태 및 권한 확인
clawdbot channels status --probe
```

### ❌ DM 페어링 코드 만료

**원인**: 페어링 코드 유효기간은 **1시간**입니다.

**해결**: 사용자가 다시 DM을 보내 새 페어링 코드를 받은 후 승인하도록 합니다.

### ❌ 그룹 DM 무시됨

**원인**: 기본 `dm.groupEnabled: false`.

**해결**:

```json5
{
  channels: {
    discord: {
      dm: {
        groupEnabled: true,
        groupChannels: ["clawd-dm"]  // 선택 사항: 특정 그룹 DM만 허용
      }
    }
  }
}
```

---

## 문제 해결

### 일반적인 문제 진단

```bash
# 1. Gateway 실행 여부 확인
clawdbot gateway status

# 2. 채널 연결 상태 확인
clawdbot channels status

# 3. 전체 진단 실행(권장!)
clawdbot doctor
```

### 로그 디버깅

Gateway 시작 시 `--verbose`를 사용하여 상세한 로그 확인:

```bash
clawdbot gateway --port 18789 --verbose
```

**다음 로그에 주목**:
- `Discord channel connected: ...` → 연결 성공
- `Message received from ...` → 메시지 수신
- `ERROR: ...` → 오류 정보

---

## 이 과정 요약

- Discord 채널은 **discord.js**를 통해 연결되며 DM과 서버 채널을 지원
- Bot 생성에는 **애플리케이션, Bot 사용자, Gateway Intents, 초대 URL** 4단계 필요
- **Message Content Intent**는 필수이며 없으면 Bot이 메시지를 읽을 수 없음
- 기본적으로 **DM 페어링 보호**가 활성화되어 낯선 사용자가 페어링해야 대화 가능
- 서버 채널은 `guilds.<id>.channels`를 통해 화이트리스트와 동작 설정 가능
- AI는 Discord 도구를 호출하여 관리 작업 수행 가능(`actions`로 제어 가능)

---

## 다음 과정 예고

> 다음 과정에서는 **[Google Chat 채널](../googlechat/)**을 학습합니다.
>
> 다음 내용을 학습하게 됩니다:
> - Google Chat OAuth 인증 구성 방법
> - Google Chat Space의 메시지 라우팅
> - Google Chat API 사용 시 제한 사항

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| Discord Bot 구성 Schema | [`src/config/zod-schema.providers-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.providers-core.ts#L320-L427) | 320-427 |
| Discord 온보딩 마법사 | [`src/channels/plugins/onboarding/discord.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/discord.ts) | 1-485 |
| Discord 도구 작업 | [`src/agents/tools/discord-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions.ts) | 1-72 |
| Discord 메시지 작업 | [`src/agents/tools/discord-actions-messaging.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-messaging.ts) | - |
| Discord 서버 작업 | [`src/agents/tools/discord-actions-guild.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/discord-actions-guild.ts) | - |
| Discord 공식 문서 | [`docs/channels/discord.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/discord.md) | 1-400 |

**주요 Schema 필드**:
- `DiscordAccountSchema`: Discord 계정 구성(token, guilds, dm, actions 등)
- `DiscordDmSchema`: DM 구성(enabled, policy, allowFrom, groupEnabled)
- `DiscordGuildSchema`: 서버 구성(slug, requireMention, reactionNotifications, channels)
- `DiscordGuildChannelSchema`: 채널 구성(allow, requireMention, skills, systemPrompt)

**주요 함수**:
- `handleDiscordAction()`: Discord 도구 작업 처리 진입점
- `discordOnboardingAdapter.configure()`: 마법사식 구성 프로세스

</details>
