---
title: "LINE 채널 설정 및 사용 | Clawdbot 튜토리얼"
sidebarTitle: "LINE에서 AI 사용하기"
subtitle: "LINE 채널 설정 및 사용"
description: "Clawdbot의 LINE 채널을 설정하고 사용하는 방법을 학습합니다. 본 튜토리얼은 LINE Messaging API 통합, Webhook 설정, 액세스 제어, 리치 미디어 메시지(Flex 템플릿, 빠른 응답, Rich Menu) 및 일반적인 문제 해결 기법을 다룹니다."
tags:
  - "LINE"
  - "Messaging API"
  - "채널 설정"
prerequisite:
  - "start-gateway-startup"
order: 140
---

# LINE 채널 설정 및 사용

## 학습 후 달성할 수 있는 것

본 튜토리얼을 완료하면 다음을 수행할 수 있습니다:

- ✅ LINE Messaging API 채널 생성 및 자격 증명 획득
- ✅ Clawdbot의 LINE 플러그인 및 Webhook 구성
- ✅ DM 페어링, 그룹 액세스 제어 및 미디어 제한 설정
- ✅ 리치 미디어 메시지 전송(Flex 카드, 빠른 응답, 위치 정보)
- ✅ LINE 채널의 일반적인 문제 해결

## 현재 겪고 있는 문제

다음과 같은 고민이 있을 수 있습니다:

- "LINE을 통해 AI 어시스턴트와 대화하고 싶은데 어떻게 통합할까?"
- "LINE Messaging API의 Webhook을 어떻게 구성할까?"
- "LINE이 Flex 메시지와 빠른 응답을 지원할까?"
- "LINE을 통해 AI 어시스턴트에 액세스할 수 있는 사람을 어떻게 제어할까?"

좋은 소식: **Clawdbot은 Messaging API의 모든 핵심 기능을 지원하는 완전한 LINE 플러그인을 제공합니다**.

## 언제 사용하면 좋은가

다음이 필요할 때:

- 📱 **LINE에서** AI 어시스턴트와 대화
- 🎨 **리치 미디어 메시지 사용** (Flex 카드, 빠른 응답, Rich Menu)
- 🔒 **액세스 권한 제어** (DM 페어링, 그룹 화이트리스트)
- 🌐 **LINE을 기존** 워크플로우에 통합

## 핵심 개념

LINE 채널은 **LINE Messaging API**를 통해 통합되며, Webhook을 사용하여 이벤트를 수신하고 메시지를 전송합니다.

```
LINE 사용자
    │
    ▼ (메시지 전송)
┌──────────────────┐
│  LINE Platform  │
│  (Messaging API)│
└────────┬─────────┘
         │ (Webhook POST)
         ▼
┌──────────────────┐
│  Clawdbot       │
│  Gateway        │
│  /line/webhook   │
└────────┬─────────┘
         │ (AI 호출)
         ▼
     ┌────────┐
     │ Agent  │
     └───┬────┘
         │ (응답)
         ▼
     LINE 사용자
```

**핵심 개념**:

| 개념 | 역할 |
|--- | ---|
| **Channel Access Token** | 메시지 전송을 위한 인증 토큰 |
| **Channel Secret** | Webhook 서명을 검증하기 위한 비밀 키 |
| **Webhook URL** | Clawdbot이 LINE 이벤트를 수신하는 엔드포인트(HTTPS 필수) |
| **DM Policy** | 알 수 없는 발신자의 액세스 정책(pairing/allowlist/open/disabled) |
| **Rich Menu** | LINE의 고정 메뉴, 사용자가 클릭하여 작업을 빠르게 트리거 |

## 🎒 시작 전 준비

### 필요한 계정 및 도구

| 항목 | 요구사항 | 획득 방법 |
|--- | --- | ---|
| **LINE Developers 계정** | 무료 등록 | https://developers.line.biz/console/ |
| **LINE Provider** | Provider 및 Messaging API channel 생성 | LINE Console |
| **HTTPS 서버** | Webhook은 HTTPS 필수 | ngrok, Cloudflare Tunnel, Tailscale Serve/Funnel |

::: tip 추천 노출 방법
로컬 개발 중인 경우 다음을 사용할 수 있습니다:
- **ngrok**: `ngrok http 18789`
- **Tailscale Funnel**: `gateway.tailscale.mode = "funnel"`
- **Cloudflare Tunnel**: 무료이고 안정적
:::

## 따라하기

### 1단계: LINE 플러그인 설치

**이유**
LINE 채널은 플러그인을 통해 구현되므로 먼저 설치해야 합니다.

```bash
clawdbot plugins install @clawdbot/line
```

**예상 결과**:
```
✓ Installed @clawdbot/line plugin
```

::: tip 로컬 개발
소스 코드에서 실행 중인 경우 로컬 설치를 사용할 수 있습니다:
```bash
clawdbot plugins install ./extensions/line
```
:::

### 2단계: LINE Messaging API Channel 생성

**이유**
Clawdbot를 구성하려면 `Channel Access Token`과 `Channel Secret`이 필요합니다.

#### 2.1 LINE Developers Console 로그인

방문: https://developers.line.biz/console/

#### 2.2 Provider 생성(없는 경우)

1. "Create new provider" 클릭
2. Provider 이름 입력(예: `Clawdbot`)
3. "Create" 클릭

#### 2.3 Messaging API Channel 추가

1. Provider에서 "Add channel" → "Messaging API" 선택
2. Channel 정보 설정:
   - Channel name: `Clawdbot AI Assistant`
   - Channel description: `Personal AI assistant powered by Clawdbot`
   - Category: `Communication`
   - Subcategory: `Bot`
3. "Agree" 체크 → "Create" 클릭

#### 2.4 Webhook 활성화

1. Channel 설정 페이지에서 "Messaging API" 탭 찾기
2. "Use webhook" 스위치 클릭 → ON으로 설정
3. 다음 정보 복사:

| 항목 | 위치 | 예시 |
|--- | --- | ---|
| **Channel Access Token** | Basic settings → Channel access token (long-lived) | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| **Channel Secret** | Basic settings → Channel secret | `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7` |

::: warning 자격 증명 안전하게 보관!
Channel Access Token과 Channel Secret은 민감한 정보이므로 안전하게 보관하고 공개 저장소에 노출하지 마세요.
:::

### 3단계: Clawdbot의 LINE 채널 구성

**이유**
Messaging API를 사용하여 메시지를 전송하고 수신하도록 Gateway를 구성합니다.

#### 방법 A: 명령줄로 구성

```bash
clawdbot configure
```

마법사가 다음을 질문합니다:
- LINE 채널 활성화 여부
- Channel Access Token
- Channel Secret
- DM 정책(기본값 `pairing`)

#### 방법 B: 구성 파일 직접 편집

`~/.clawdbot/clawdbot.json` 편집:

```json5
{
  channels: {
    line: {
      enabled: true,
      channelAccessToken: "YOUR_CHANNEL_ACCESS_TOKEN",
      channelSecret: "YOUR_CHANNEL_SECRET",
      dmPolicy: "pairing",
      groupPolicy: "allowlist"
    }
  }
}
```

::: tip 환경 변수 사용
환경 변수를 통해서도 구성할 수 있습니다(기본 계정에만 유효):
```bash
export LINE_CHANNEL_ACCESS_TOKEN="your_token_here"
export LINE_CHANNEL_SECRET="your_secret_here"
```
:::

#### 방법 C: 파일을 사용하여 자격 증명 저장

자격 증명을 별도의 파일에 저장하는 것이 더 안전합니다:

```json5
{
  channels: {
    line: {
      enabled: true,
      tokenFile: "/path/to/line-token.txt",
      secretFile: "/path/to/line-secret.txt",
      dmPolicy: "pairing"
    }
  }
}
```

### 4단계: Webhook URL 설정

**이유**
LINE에서 Clawdbot으로 메시지 이벤트를 푸시하려면 Webhook URL이 필요합니다.

#### 4.1 외부에서 Gateway에 액세스할 수 있는지 확인

로컬에서 개발 중인 경우 터널 서비스를 사용해야 합니다:

```bash
# ngrok 사용
ngrok http 18789

# 출력에 HTTPS URL이 표시됩니다. 예:
# Forwarding: https://abc123.ngrok.io -> http://localhost:18789
```

#### 4.2 LINE Console에서 Webhook URL 설정

1. Messaging API 설정 페이지에서 "Webhook settings" 찾기
2. Webhook URL 입력:
   ```
   https://your-gateway-host/line/webhook
   ```
   - 기본 경로: `/line/webhook`
   - `channels.line.webhookPath`로 사용자 정의 가능
3. "Verify" 클릭 → LINE이 Gateway에 액세스할 수 있는지 확인

**예상 결과**:
```
✓ Webhook URL verification succeeded
```

#### 4.3 필요한 이벤트 유형 활성화

Webhook settings에서 다음 이벤트를 체크:

| 이벤트 | 용도 |
|--- | ---|
| **Message event** | 사용자가 보낸 메시지 수신 |
| **Follow event** | 사용자가 Bot을 친구로 추가 |
| **Unfollow event** | 사용자가 Bot을 제거 |
| **Join event** | Bot이 그룹에 참가 |
| **Leave event** | Bot이 그룹에서 나감 |
| **Postback event** | 빠른 응답 및 버튼 클릭 |

### 5단계: Gateway 시작

**이유**
LINE의 Webhook 이벤트를 수신하려면 Gateway가 실행 중이어야 합니다.

```bash
clawdbot gateway --verbose
```

**예상 결과**:
```
✓ Gateway listening on ws://127.0.0.1:18789
✓ LINE webhook server started on /line/webhook
✓ LINE plugin initialized
```

### 6단계: LINE 채널 테스트

**이유**
구성이 올바른지 확인하고 AI 어시스턴트가 정상적으로 응답하는지 테스트합니다.

#### 6.1 Bot을 친구로 추가

1. LINE Console → Messaging API → Channel settings
2. "Basic ID" 또는 "QR Code" 복사
3. LINE 앱에서 검색하거나 QR Code를 스캔하여 Bot을 친구로 추가

#### 6.2 테스트 메시지 전송

LINE에서 Bot에 메시지 전송:
```
안녕, 오늘 날씨 요약해 줘.
```

**예상 결과**:
- Bot이 "typing" 상태 표시(typing indicators 구성된 경우)
- AI 어시스턴트가 응답을 스트리밍으로 반환
- 메시지가 LINE에 올바르게 표시

### 7단계: DM 페어링 확인(선택 사항)

**이유**
기본 `dmPolicy="pairing"`을 사용하는 경우 알 수 없는 발신자는 먼저 승인되어야 합니다.

#### 승인 대기 중인 페어링 요청 보기

```bash
clawdbot pairing list line
```

**예상 결과**:
```
Pending pairing requests for LINE:
  CODE: ABC123 - User ID: U1234567890abcdef1234567890ab
```

#### 페어링 요청 승인

```bash
clawdbot pairing approve line ABC123
```

**예상 결과**:
```
✓ Approved pairing request for LINE user U1234567890abcdef1234567890ab
```

::: info DM 정책 설명
- `pairing`(기본값): 알 수 없는 발신자가 페어링 코드를 받으며, 승인될 때까지 메시지가 무시됨
- `allowlist`: 화이트리스트의 사용자만 메시지 전송 가능
- `open`: 누구나 메시지를 전송할 수 있음(신중하게 사용)
- `disabled`: 개인 메시지 비활성화
:::

## 체크포인트 ✅

구성이 올바른지 확인:

| 확인 항목 | 확인 방법 | 예상 결과 |
|--- | --- | ---|
| **플러그인 설치됨** | `clawdbot plugins list` | `@clawdbot/line` 표시 |
| **구성 유효함** | `clawdbot doctor` | LINE 관련 오류 없음 |
| **Webhook 접근 가능** | LINE Console 확인 | `✓ Verification succeeded` |
| **Bot 액세스 가능** | LINE에서 친구 추가 및 메시지 전송 | AI 어시스턴트 정상 응답 |
| **페어링 메커니즘** | 새 사용자로 DM 전송 | 페어링 코드 수신(pairing 정책 사용 시) |

## 일반적인 문제

### 일반적인 문제 1: Webhook 확인 실패

**증상**:
```
Webhook URL verification failed
```

**원인**:
- Webhook URL이 HTTPS가 아님
- Gateway가 실행되지 않았거나 포트가 올바르지 않음
- 방화벽이 인바운드 연결을 차단

**해결 방법**:
1. HTTPS 사용 확인: `https://your-gateway-host/line/webhook`
2. Gateway 실행 확인: `clawdbot gateway status`
3. 포트 확인: `netstat -an | grep 18789`
4. 터널 서비스 사용(ngrok/Tailscale/Cloudflare)

### 일반적인 문제 2: 메시지 수신 불가

**증상**:
- Webhook 확인 성공
- 하지만 Bot에 메시지를 보내도 응답 없음

**원인**:
- Webhook 경로 구성 오류
- 이벤트 유형이 활성화되지 않음
- 구성 파일의 `channelSecret`이 일치하지 않음

**해결 방법**:
1. `channels.line.webhookPath`가 LINE Console과 일치하는지 확인
2. LINE Console에서 "Message event" 활성화 확인
3. `channelSecret`이 올바르게 복사되었는지 확인(여분 공백 없음)

### 일반적인 문제 3: 미디어 다운로드 실패

**증상**:
```
Error downloading LINE media: size limit exceeded
```

**원인**:
- 미디어 파일이 기본 제한(10MB)을 초과

**해결 방법**:
구성에서 제한 늘리기:
```json5
{
  channels: {
    line: {
      mediaMaxMb: 25  // LINE 공식 제한 25MB
    }
  }
}
```

### 일반적인 문제 4: 그룹 메시지 응답 없음

**증상**:
- DM 정상
- 그룹에서 메시지를 보내도 응답 없음

**원인**:
- 기본 `groupPolicy="allowlist"`, 그룹이 화이트리스트에 없음
- 그룹에서 @mention Bot하지 않음

**해결 방법**:
1. 구성에 그룹 ID를 화이트리스트에 추가:
```json5
{
  channels: {
    line: {
      groupAllowFrom: ["C1234567890abcdef1234567890ab"]
    }
  }
}
```

2. 또는 그룹에서 @mention Bot: `@Clawdbot 이 작업 처리해 줘`

## 고급 기능

### 리치 미디어 메시지(Flex 템플릿 및 빠른 응답)

Clawdbot은 Flex 카드, 빠른 응답, 위치 정보 등 LINE의 리치 미디어 메시지를 지원합니다.

#### 빠른 응답 전송

```json5
{
  text: "오늘 어떤 것을 도와드릴까요?",
  channelData: {
    line: {
      quickReplies: ["날씨 확인", "알림 설정", "코드 생성"]
    }
  }
}
```

#### Flex 카드 전송

```json5
{
  text: "상태 카드",
  channelData: {
    line: {
      flexMessage: {
        altText: "서버 상태",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            contents: [
              {
                type: "text",
                text: "CPU: 45%"
              },
              {
                type: "text",
                text: "Memory: 2.1GB"
              }
            ]
          }
        }
      }
    }
  }
}
```

#### 위치 정보 전송

```json5
{
  text: "이것은 제 사무실 위치입니다",
  channelData: {
    line: {
      location: {
        title: "Office",
        address: "123 Main St, San Francisco",
        latitude: 37.7749,
        longitude: -122.4194
      }
    }
  }
}
```

### Rich Menu(고정 메뉴)

Rich Menu는 LINE의 고정 메뉴로, 사용자가 클릭하여 작업을 빠르게 트리거할 수 있습니다.

```bash
# Rich Menu 생성
clawdbot line rich-menu create

# 메뉴 이미지 업로드
clawdbot line rich-menu upload --image /path/to/menu.png

# 기본 메뉴로 설정
clawdbot line rich-menu set-default --rich-menu-id <MENU_ID>
```

::: info Rich Menu 제한
- 이미지 크기: 2500x1686 또는 2500x843 픽셀
- 이미지 형식: PNG 또는 JPEG
- 최대 10개 메뉴 항목
:::

### Markdown 변환

Clawdbot은 Markdown 형식을 LINE이 지원하는 형식으로 자동 변환합니다:

| Markdown | LINE 변환 결과 |
|--- | ---|
| 코드 블록 | Flex 카드 |
| 표 | Flex 카드 |
| 링크 | 자동 감지 및 Flex 카드로 변환 |
| 굵게/기울임꼴 | 제거됨(LINE에서 지원하지 않음) |

::: tip 형식 유지
LINE은 Markdown 형식을 지원하지 않으므로 Clawdbot은 Flex 카드로 변환하려고 시도합니다. 순수 텍스트를 원하면 구성에서 자동 변환을 비활성화할 수 있습니다.
:::

## 요약

본 튜토리얼에서는 다음을 다루었습니다:

1. ✅ LINE 플러그인 설치
2. ✅ LINE Messaging API Channel 생성
3. ✅ Webhook 및 자격 증명 구성
4. ✅ 액세스 제어 설정(DM 페어링, 그룹 화이트리스트)
5. ✅ 리치 미디어 메시지 전송(Flex, 빠른 응답, 위치)
6. ✅ Rich Menu 사용
7. ✅ 일반적인 문제 해결

LINE 채널은 풍부한 메시지 유형과 상호 작용 방식을 제공하며, LINE에서 개인화된 AI 어시스턴트 경험을 구축하는 데 매우 적합합니다.

---

## 다음 과정 예고

> 다음 과정에서는 **[WebChat 인터페이스](../webchat/)**를 학습합니다.
>
> 학습할 내용:
> - 브라우저를 통해 WebChat 인터페이스 액세스 방법
> - WebChat의 핵심 기능(세션 관리, 첨부 파일 업로드, Markdown 지원)
> - 원격 액세스 구성(SSH 터널, Tailscale)
> - WebChat과 다른 채널의 차이점 이해

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| LINE Bot 핵심 구현 | [`src/line/bot.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/bot.ts) | 27-83 |
| 구성 Schema 정의 | [`src/line/config-schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/config-schema.ts) | 1-54 |
| Webhook 이벤트 핸들러 | [`src/line/bot-handlers.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/bot-handlers.ts) | 1-100 |
| 메시지 전송 기능 | [`src/line/send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/send.ts) | - |
| Flex 템플릿 생성 | [`src/line/flex-templates.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/flex-templates.ts) | - |
| Rich Menu 작업 | [`src/line/rich-menu.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/rich-menu.ts) | - |
| Template 메시지 | [`src/line/template-messages.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/template-messages.ts) | - |
| Markdown을 LINE으로 변환 | [`src/line/markdown-to-line.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/markdown-to-line.ts) | - |
| Webhook 서버 | [`src/line/webhook.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/line/webhook.ts) | - |

**핵심 구성 필드**:
- `channelAccessToken`: LINE Channel Access Token(`config-schema.ts:19`)
- `channelSecret`: LINE Channel Secret(`config-schema.ts:20`)
- `dmPolicy`: DM 액세스 정책(`config-schema.ts:26`)
- `groupPolicy`: 그룹 액세스 정책(`config-schema.ts:27`)
- `mediaMaxMb`: 미디어 크기 제한(`config-schema.ts:28`)
- `webhookPath`: 사용자 정의 Webhook 경로(`config-schema.ts:29`)

**핵심 함수**:
- `createLineBot()`: LINE Bot 인스턴스 생성(`bot.ts:27`)
- `handleLineWebhookEvents()`: LINE Webhook 이벤트 처리(`bot-handlers.ts:100`)
- `sendMessageLine()`: LINE 메시지 전송(`send.ts`)
- `createFlexMessage()`: Flex 메시지 생성(`send.ts:20`)
- `createQuickReplyItems()`: 빠른 응답 생성(`send.ts:21`)

**지원되는 DM 정책**:
- `open`: 개방형 액세스
- `allowlist`: 화이트리스트 모드
- `pairing`: 페어링 모드(기본값)
- `disabled`: 비활성화

**지원되는 그룹 정책**:
- `open`: 개방형 액세스
- `allowlist`: 화이트리스트 모드(기본값)
- `disabled`: 비활성화

</details>
