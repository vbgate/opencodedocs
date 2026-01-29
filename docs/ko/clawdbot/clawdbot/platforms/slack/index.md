---
title: "Slack 채널 구성 완전 가이드: Socket/HTTP Mode, 보안 설정 | Clawdbot 튜토리얼"
sidebarTitle: "Slack도 AI 사용"
subtitle: "Slack 채널 구성 완전 가이드 | Clawdbot 튜토리얼"
description: "Clawdbot에서 Slack 채널을 구성하고 사용하는 방법을 학습합니다. Socket Mode와 HTTP Mode 두 가지 연결 방식, Token 가져오기 단계, DM 보안 구성, 그룹 관리 전략 및 Slack Actions 도구 사용을 포함합니다."
tags:
  - "platforms"
  - "slack"
  - "configuration"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 90
---

# Slack 채널 구성 완전 가이드

## 학습 후 할 수 있는 것

- ✅ Slack에서 Clawdbot과 상호작용하며 AI 어시스턴트로 작업 완료
- ✅ DM 보안 정책 구성으로 개인 프라이버시 보호
- ✅ 그룹에서 Clawdbot 통합으로 @멘션 및 명령에 지능적으로 응답
- ✅ Slack Actions 도구 사용(메시지 전송, Pin 관리, 멤버 정보 확인 등)
- ✅ Socket Mode 또는 HTTP Mode 두 가지 연결 방식 선택

## 현재 겪고 있는 문제점

Slack은 팀 협업의 핵심 도구이지만 다음 문제에 직면할 수 있습니다:

- 팀 토론이 여러 채널에 분산되어 중요한 정보 누락
- 과거 메시지, Pin 또는 멤버 정보를 빠르게 조회해야 하지만 Slack 인터페이스가 불편
- 다른 앱으로 전환하지 않고 Slack에서 직접 AI 기능 사용 원함
- 그룹에서 AI 어시스턴트를 활성화할 경우 메시지 홍수나 프라이버시 유출 우려

## 언제 사용하는가

- **팀 일상 소통**: Slack이 팀의 주요 소통 도구인 경우
- **Slack 네이티브 통합 필요**: Reaction, Pin, Thread 등 기능 활용
- **다중 계정 요구**: 여러 Slack Workspace 연결 필요
- **원격 배포 시나리오**: HTTP Mode를 사용하여 원격 Gateway 연결

## 🎒 시작 전 준비

::: warning 사전 확인
시작 전 다음을 확인해주세요:
- [빠른 시작](../../start/getting-started/) 완료
- Gateway가 시작되어 실행 중
- Slack Workspace 관리자 권한 보유(App 생성)
:::

**필요한 리소스**:
- [Slack API 콘솔](https://api.slack.com/apps) - Slack App 생성 및 관리
- Clawdbot 구성 파일 - 일반적으로 `~/.clawdbot/clawdbot.json` 위치

## 핵심 개념

Clawdbot의 Slack 채널은 [Bolt](https://slack.dev/bolt-js) 프레임워크를 기반으로 구현되며 두 가지 연결 모드를 지원합니다:

| 모드 | 적용 시나리오 | 장점 | 단점 |
| ------ | -------- | ------ | ------ |
| **Socket Mode** | 로컬 Gateway, 개인 사용 | 구성 간단(Token만 필요) | 지속적인 WebSocket 연결 필요 |
| **HTTP Mode** | 서버 배포, 원격 액세스 | 방화벽 통과, 로드 밸런싱 지원 | 공용 IP 필요, 구성 복잡 |

**기본값은 Socket Mode**를 사용하며 대부분 사용자에게 적합합니다.

**인증 메커니즘**:
- **Bot Token** (`xoxb-...`) - 필수, API 호출용
- **App Token** (`xapp-...`) - Socket Mode 필수, WebSocket 연결용
- **User Token** (`xoxp-...`) - 선택 사항, 읽기 전용 작업용(과거 기록, Pin, Reactions)
- **Signing Secret** - HTTP Mode 필수, Webhook 요청 검증용

## 함께 따라하기

### 1단계: Slack App 생성

**이유**
Slack App은 Clawdbot과 Workspace 간의 다리 역할을 하며 인증 및 권한 제어를 제공합니다.

1. [Slack API 콘솔](https://api.slack.com/apps) 방문
2. **Create New App** 클릭 → **From scratch** 선택
3. App 정보 입력:
   - **App Name**: `Clawdbot`(또는 원하는 이름)
   - **Pick a workspace to develop your app in**: Workspace 선택
4. **Create App** 클릭

**다음이 표시되어야 합니다**:
App 생성 성공, 기본 구성 페이지 진입.

### 2단계: Socket Mode 구성(권장)

::: tip 팁
로컬 Gateway를 사용하는 경우 Socket Mode를 권장하며 구성이 더 간단합니다.
:::

**이유**
Socket Mode는 공용 IP가 필요 없으며 Slack의 WebSocket 서비스를 통해 연결합니다.

1. App 구성 페이지에서 **Socket Mode** 찾기 → **On**으로 전환
2. **App-Level Tokens**로 스크롤 → **Generate Token and Scopes** 클릭
3. **Token** 부분에서 scope 선택:
   - `connections:write` 체크
4. **Generate Token** 클릭, 생성된 **App Token** 복사(`xapp-`로 시작)

**다음이 표시되어야 합니다**:
생성된 Token 형식: `xapp-1-A0B1C2D3E4F5G6H7I8J9K0L1M2N3O4P`

::: danger 보안 알림
App Token은 민감한 정보이므로 안전하게 보관하고 공개 저장소에 유출하지 마세요.
:::

### 3단계: Bot Token 및 권한 구성

1. **OAuth & Permissions** → **Bot Token Scopes**로 스크롤
2. 다음 scopes(권한) 추가:

**Bot Token Scopes(필수)**:

```yaml
    chat:write                    # 메시지 전송/편집/삭제
    channels:history              # 채널 기록 읽기
    channels:read                 # 채널 정보 가져오기
    groups:history                # 그룹 기록 읽기
    groups:read                   # 그룹 정보 가져오기
    im:history                   # DM 기록 읽기
    im:read                      # DM 정보 가져오기
    im:write                     # DM 세션 열기
    mpim:history                # 그룹 DM 기록 읽기
    mpim:read                   # 그룹 DM 정보 가져오기
    users:read                   # 사용자 정보 조회
    app_mentions:read            # @멘션 읽기
    reactions:read               # Reaction 읽기
    reactions:write              # Reaction 추가/삭제
    pins:read                    # Pin 목록 읽기
    pins:write                   # Pin 추가/삭제
    emoji:read                   # 사용자 정의 Emoji 읽기
    commands                     # 슬래시 명령 처리
    files:read                   # 파일 정보 읽기
    files:write                  # 파일 업로드
```

::: info 설명
위는 **Bot Token**의 필수 권한이며 Bot이 메시지 읽기, 응답 전송, Reaction 및 Pin 관리를 정상적으로 수행할 수 있습니다.
:::

3. 페이지 상단으로 스크롤 → **Install to Workspace** 클릭
4. **Allow** 클릭하여 App이 Workspace에 액세스하도록 권한 부여
5. 생성된 **Bot User OAuth Token** 복사(`xoxb-`로 시작)

**다음이 표시되어야 합니다**:
Token 형식: `xoxb-YOUR-BOT-TOKEN-HERE`

::: tip 팁
 **User Token**이 필요한 경우(읽기 전용 작업용), **User Token Scopes**로 스크롤하여 다음 권한 추가:
- `channels:history`, `groups:history`, `im:history`, `mpim:history`
- `channels:read`, `groups:read`, `im:read`, `mpim:read`
- `users:read`, `reactions:read`, `pins:read`, `emoji:read`
- `search:read`

그런 다음 **Install App** 페이지에서 **User OAuth Token** 복사(`xoxp-`로 시작).

**User Token Scopes(선택 사항, 읽기 전용)**:
- 기록, Reaction, Pin, Emoji 및 검색 읽기용만 사용
- 쓰기 작업은 여전히 Bot Token 사용(`userTokenReadOnly: false` 설정 제외)
:::

### 4단계: 이벤트 구독 구성

1. App 구성 페이지에서 **Event Subscriptions** 찾기 → **Enable Events** 활성화
2. **Subscribe to bot events**에 다음 이벤트 추가:

```yaml
    app_mention                  # @Bot 멘션
    message.channels              # 채널 메시지
    message.groups               # 그룹 메시지
    message.im                   # DM 메시지
    message.mpim                # 그룹 DM 메시지
    reaction_added               # Reaction 추가
    reaction_removed             # Reaction 삭제
    member_joined_channel       # 멤버 채널 참여
    member_left_channel          # 멤버 채널 퇴장
    channel_rename               # 채널 이름 변경
    pin_added                   # Pin 추가
    pin_removed                 # Pin 삭제
```

3. **Save Changes** 클릭

### 5단계: DM 기능 활성화

1. App 구성 페이지에서 **App Home** 찾기
2. **Messages Tab** 활성화 → **Enable Messages Tab** 켜기
3. **Messages tab read-only disabled: No** 표시 확인

**다음이 표시되어야 합니다**:
Messages Tab이 활성화되어 사용자가 Bot과 DM 대화 가능.

### 6단계: Clawdbot 구성

**이유**
Slack Token을 Clawdbot에 구성하여 연결을 설정합니다.

#### 방식 1: 환경 변수 사용(권장)

```bash
    # 환경 변수 설정
    export SLACK_BOT_TOKEN="xoxb-당신의BotToken"
    export SLACK_APP_TOKEN="xapp-당신의AppToken"

    # Gateway 재시작
    clawdbot gateway restart
```

**다음이 표시되어야 합니다**:
Gateway 시작 로그에 `Slack: connected` 표시.

#### 방식 2: 구성 파일

`~/.clawdbot/clawdbot.json` 편집:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-당신의BotToken",
      "appToken": "xapp-당신의AppToken"
    }
  }
}
```

**User Token이 있는 경우**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-당신의BotToken",
      "appToken": "xapp-당신의AppToken",
      "userToken": "xoxp-당신의UserToken",
      "userTokenReadOnly": true
    }
  }
}
```

**다음이 표시되어야 합니다**:
Gateway 재시작 후 Slack 연결 성공.

### 7단계: Bot을 채널에 초대

1. Slack에서 Bot을 추가하려는 채널 열기
2. `/invite @Clawdbot` 입력(Bot 이름으로 교체)
3. **Add to channel** 클릭

**다음이 표시되어야 합니다**:
Bot이 채널에 성공적으로 추가되고 "Clawdbot has joined the channel" 표시.

### 8단계: 그룹 보안 정책 구성

**이유**
Bot이 모든 채널에서 자동 응답하지 않도록 방지하여 프라이버시 보호.

`~/.clawdbot/clawdbot.json` 편집:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-당신의BotToken",
      "appToken": "xapp-당신의AppToken",
      "groupPolicy": "allowlist",
      "channels": {
        "C1234567890": {
          "allow": true,
          "requireMention": true
        },
        "#general": {
          "allow": true,
          "requireMention": true
        }
      }
    }
  }
}
```

**필드 설명**:
- `groupPolicy`: 그룹 정책
  - `"open"` - 모든 채널 허용(권장하지 않음)
  - `"allowlist"` - 나열된 채널만 허용(권장)
  - `"disabled"` - 모든 채널 차단
- `channels`: 채널 구성
  - `allow`: 허용/거부
  - `requireMention`: @멘션 필요 시 응답 여부(기본값 `true`)
  - `users`: 추가 사용자 화이트리스트
  - `skills`: 해당 채널에서 사용할 스킬 제한
  - `systemPrompt`: 추가 시스템 프롬프트

**다음이 표시되어야 합니다**:
Bot이 구성된 채널에서만 응답하며 @멘션 필요.

### 9단계: DM 보안 정책 구성

**이유**
낯선 사용자가 DM으로 Bot과 상호작용하지 못하도록 방지하여 프라이버시 보호.

`~/.clawdbot/clawdbot.json` 편집:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "botToken": "xoxb-당신의BotToken",
      "appToken": "xapp-당신의AppToken",
      "dm": {
        "enabled": true,
        "policy": "pairing",
        "allowFrom": ["U1234567890", "@alice", "user@example.com"]
      }
    }
  }
}
```

**필드 설명**:
- `dm.enabled`: DM 활성화/비활성화(기본값 `true`)
- `dm.policy`: DM 정책
  - `"pairing"` - 낯선 사용자가 페어링 코드를 받으며 승인 필요(기본값)
  - `"open"` - 누구나 DM 허용
  - `"allowlist"` - 화이트리스트 사용자만 허용
- `dm.allowFrom`: 화이트리스트
  - 사용자 ID(`U1234567890`) 지원
  - @멘션(`@alice`) 지원
  - 이메일(`user@example.com`) 지원

**페어링 프로세스**:
1. 낯선 사용자가 Bot에 DM 전송
2. Bot이 페어링 코드 응답(유효기간 1시간)
3. 사용자가 페어링 코드를 관리자에게 제공
4. 관리자 실행: `clawdbot pairing approve slack <페어링코드>`
5. 사용자가 화이트리스트에 추가되어 정상적으로 사용 가능

**다음이 표시되어야 합니다**:
알 수 없는 발신자가 페어링 코드를 수신하며 Bot이 메시지를 처리하지 않음.

### 10단계: Bot 테스트

1. 구성된 채널에서 메시지 전송: `@Clawdbot 안녕하세요`
2. 또는 Bot에 DM 전송
3. Bot 응답 관찰

**다음이 표시되어야 합니다**:
Bot이 메시지에 정상적으로 응답.

### 확인점 ✅

- [ ] Slack App 생성 성공
- [ ] Socket Mode 활성화됨
- [ ] Bot Token 및 App Token 복사됨
- [ ] Clawdbot 구성 파일 업데이트됨
- [ ] Gateway 재시작됨
- [ ] Bot이 채널에 초대됨
- [ ] 그룹 보안 정책 구성됨
- [ ] DM 보안 정책 구성됨
- [ ] 테스트 메시지 응답 수신

## 주의 사항

### 일반적인 오류 1: Bot 응답 없음

**문제**: 메시지 전송 후 Bot 응답 없음.

**가능한 원인**:
1. Bot이 채널에 추가되지 않음 → `/invite @Clawdbot`으로 초대
2. `requireMention`이 `true`로 설정됨 → 메시지 전송 시 `@Clawdbot` 필요
3. Token 구성 오류 → `clawdbot.json`의 Token이 올바른지 확인
4. Gateway 실행 안 됨 → `clawdbot gateway status` 실행하여 상태 확인

### 일반적인 오류 2: Socket Mode 연결 실패

**문제**: Gateway 로그에 연결 실패 표시.

**해결 방법**:
1. App Token이 올바른지 확인(`xapp-`로 시작)
2. Socket Mode가 활성화되어 있는지 확인
3. 네트워크 연결 확인

### 일반적인 오류 3: User Token 권한 부족

**문제**: 일부 작업 실패, 권한 오류 메시지.

**해결 방법**:
1. User Token에 필요한 권한 포함되어 있는지 확인(3단계 참조)
2. `userTokenReadOnly` 설정 확인(기본값 `true`, 읽기 전용)
3. 쓰기 작업 필요 시 `"userTokenReadOnly": false` 설정

### 일반적인 오류 4: 채널 ID 해석 실패

**문제**: 구성된 채널 이름을 ID로 해석할 수 없음.

**해결 방법**:
1. 채널 이름 대신 채널 ID 우선 사용(예: `C1234567890`)
2. 채널 이름이 `#`로 시작하는지 확인(예: `#general`)
3. Bot이 해당 채널에 액세스할 권한이 있는지 확인

## 고급 구성

### 권한 설명

::: info Bot Token vs User Token
- **Bot Token**: 필수, Bot의 주요 기능용(메시지 전송, 기록 읽기, Pin/Reaction 관리 등)
- **User Token**: 선택 사항, 읽기 전용 작업용만(기록, Reaction, Pin, Emoji, 검색)
  - 기본 `userTokenReadOnly: true`, 읽기 전용 보장
  - 쓰기 작업(메시지 전송, Reaction 추가 등)은 여전히 Bot Token 사용
:::

**향후 필요할 수 있는 권한**:

다음 권한은 현재 버전에서 필수가 아니지만 향후 지원 추가 시 필요할 수 있습니다:

| 권한 | 용도 |
| ------ | ------ |
| `groups:write` | 프라이빗 채널 관리(생성, 이름 변경, 초대, 보관) |
| `mpim:write` | 그룹 DM 세션 관리 |
| `chat:write.public` | Bot이 참여하지 않은 채널에 메시지 게시 |
| `files:read` | 파일 메타데이터 나열/읽기 |

이러한 기능 활성화 필요 시 Slack App의 **Bot Token Scopes**에 해당 권한 추가.

### HTTP Mode(서버 배포)

Gateway가 원격 서버에 배포된 경우 HTTP Mode 사용:

1. Slack App 생성, Socket Mode 비활성화
2. **Signing Secret** 복사(Basic Information 페이지)
3. Event Subscriptions 구성, **Request URL**을 `https://당신의도메인/slack/events`로 설정
4. Interactivity & Shortcuts 구성, 동일한 **Request URL** 설정
5. Slash Commands 구성, **Request URL** 설정

**구성 파일**:

```json
{
  "channels": {
    "slack": {
      "enabled": true,
      "mode": "http",
      "botToken": "xoxb-당신의BotToken",
      "signingSecret": "당신의SigningSecret",
      "webhookPath": "/slack/events"
    }
  }
}
```

### 다중 계정 구성

여러 Slack Workspace 연결 지원:

```json
{
  "channels": {
    "slack": {
      "accounts": {
        "workspace1": {
          "name": "Team A",
          "enabled": true,
          "botToken": "xoxb-Workspace1Token",
          "appToken": "xapp-Workspace1Token"
        },
        "workspace2": {
          "name": "Team B",
          "enabled": true,
          "botToken": "xoxb-Workspace2Token",
          "appToken": "xapp-Workspace2Token"
        }
      }
    }
  }
}
```

### 슬래시 명령 구성

`/clawd` 명령 활성화:

1. App 구성 페이지에서 **Slash Commands** 찾기
2. 명령 생성:
   - **Command**: `/clawd`
   - **Request URL**: Socket Mode는 필요 없음(WebSocket 통해 처리)
   - **Description**: `Send a message to Clawdbot`

**구성 파일**:

```json
{
  "channels": {
    "slack": {
      "slashCommand": {
        "enabled": true,
        "name": "clawd",
        "ephemeral": true
      }
    }
  }
}
```

### 답장 스레드 구성

채널에서 Bot의 답장 방식 제어:

```json
{
  "channels": {
    "slack": {
      "replyToMode": "off",
      "replyToModeByChatType": {
        "direct": "all",
        "group": "first"
      }
    }
  }
}
```

| 모드 | 동작 |
| ----- | ------ |
| `off` | 기본값, 메인 채널에서 답장 |
| `first` | 첫 번째 답장이 스레드로, 이후 답장은 메인 채널 |
| `all` | 모든 답장이 스레드 |

### Slack Actions 도구 활성화

Agent가 Slack 특정 작업을 호출하도록 허용:

```json
{
  "channels": {
    "slack": {
      "actions": {
        "reactions": true,
        "messages": true,
        "pins": true,
        "memberInfo": true,
        "emojiList": true
      }
    }
  }
}
```

**사용 가능한 작업**:
- `sendMessage` - 메시지 전송
- `editMessage` - 메시지 편집
- `deleteMessage` - 메시지 삭제
- `readMessages` - 과거 메시지 읽기
- `react` - Reaction 추가
- `reactions` - Reactions 나열
- `pinMessage` - 메시지 Pin
- `unpinMessage` - Pin 해제
- `listPins` - Pin 나열
- `memberInfo` - 멤버 정보 가져오기
- `emojiList` - 사용자 정의 Emoji 나열

## 수업 요약

- Slack 채널은 Socket Mode와 HTTP Mode 두 가지 연결 방식 지원
- Socket Mode 구성 간단, 로컬 사용 권장
- DM 보안 정책 기본값은 `pairing`, 낯선 사용자는 승인 필요
- 그룹 보안 정책은 화이트리스트 및 @멘션 필터링 지원
- Slack Actions 도구는 풍부한 작업 능력 제공
- 다중 계정 지원으로 여러 Workspace 연결

## 다음 수업 예고

> 다음 수업에서는 **[Discord 채널](../discord/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - Discord Bot 구성 방법
> - Token 가져오기 및 권한 설정
> - 그룹 및 DM 보안 정책
> - Discord 특정 도구 사용

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능            | 파일 경로                                                                                               | 행 번호       |
| --------------- | ------------------------------------------------------------------------------------------------ | ---------- |
| Slack 구성 타입 | [`src/config/types.slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.slack.ts) | 1-150      |
| Slack 온보딩 로직  | [`src/channels/plugins/onboarding/slack.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/plugins/onboarding/slack.ts) | 1-539      |
| Slack Actions 도구 | [`src/agents/tools/slack-actions.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/slack-actions.ts) | 1-301      |
| Slack 공식 문서 | [`docs/channels/slack.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/channels/slack.md) | 1-508      |

**핵심 타입 정의**:
- `SlackConfig`: Slack 채널 메인 구성 타입
- `SlackAccountConfig`: 단일 계정 구성(socket/http 모드 지원)
- `SlackChannelConfig`: 채널 구성(화이트리스트, mention 정책 등)
- `SlackDmConfig`: DM 구성(pairing, allowlist 등)
- `SlackActionConfig`: Actions 도구 권한 제어

**핵심 함수**:
- `handleSlackAction()`: Slack Actions 도구 호출 처리
- `resolveThreadTsFromContext()`: replyToMode에 따라 스레드 ID 해석
- `buildSlackManifest()`: Slack App Manifest 생성

</details>
