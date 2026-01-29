---
title: "첫 번째 메시지 보내기: WebChat 또는 채널을 통해 AI와 대화 | Clawdbot 튜토리얼"
sidebarTitle: "AI와 대화 시작하기"
subtitle: "첫 번째 메시지 보내기: WebChat 또는 채널을 통해 AI와 대화"
description: "WebChat 인터페이스 또는 구성된 채널(WhatsApp/Telegram/Slack/Discord 등)을 통해 Clawdbot AI 어시스턴트에게 첫 번째 메시지를 보내는 방법을 학습합니다. 본 튜토리얼에서는 CLI 명령, WebChat 액세스 및 채널 메시지 전송의 세 가지 방법, 예상 결과 및 일반적인 문제 해결을 다룹니다."
tags:
  - "입문"
  - "WebChat"
  - "채널"
  - "메시지"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 40
---

# 첫 번째 메시지 보내기: WebChat 또는 채널을 통해 AI와 대화

## 학습 완료 후 할 수 있는 것

이 튜토리얼을 완료하면 다음을 할 수 있게 됩니다:

- ✅ CLI를 통해 AI 어시스턴트와 대화하기
- ✅ WebChat 인터페이스를 사용하여 메시지 보내기
- ✅ 구성된 채널(WhatsApp, Telegram, Slack 등)에서 AI와 대화하기
- ✅ 메시지 전송의 예상 결과 및 상태 코드 이해하기

## 현재 겪고 계신 문제

방금 Clawdbot 설치와 Gateway 시작을 완료했지만, 모든 것이 제대로 작동하는지 확인하는 방법을 모를 수 있습니다.

다음과 같은 질문이 있을 수 있습니다:

- "Gateway가 시작되었는데, 메시지에 응답하는지 어떻게 확인하나요?"
- "명령줄 외에 사용할 수 있는 그래픽 인터페이스가 있나요?"
- "WhatsApp/Telegram을 구성했는데, 해당 플랫폼에서 어떻게 AI와 대화하나요?"

좋은 소식은: **Clawdbot은 첫 번째 메시지를 보내는 여러 가지 방법을 제공**하므로, 반드시 사용하기에 적합한 방법이 있습니다.

## 이 방법을 언제 사용해야 하나요

다음과 같은 경우에 사용하세요:

- 🧪 **설치 확인**: Gateway와 AI 어시스턴트가 정상 작동하는지 확인
- 🌐 **채널 테스트**: WhatsApp/Telegram/Slack 등 채널 연결이 정상인지 확인
- 💬 **빠른 대화**: 채널 앱을 열지 않고 CLI 또는 WebChat을 통해 직접 AI와 소통
- 🔄 **회신 전달**: AI의 회신을 특정 채널 또는 연락처로 다시 전송

---

## 🎒 시작 전 준비사항

첫 번째 메시지를 보내기 전에 다음을 확인하세요:

### 필수 조건

| 조件                     | 확인 방법                                        |
| ---------------------- | ------------------------------------------- |
| **Gateway 시작됨**   | `clawdbot gateway status` 또는 프로세스가 실행 중인지 확인 |
| **AI 모델 구성됨** | `clawdbot models list`로 사용 가능한 모델 확인      |
| **포트 접근 가능**       | 18789 포트(또는 사용자 정의 포트)가 사용 중이 아닌지 확인 |

::: warning 선행 강좌
본 튜토리얼은 다음을 완료했다고 가정합니다:
- [빠른 시작](../getting-started/) - Clawdbot 설치, 구성 및 시작
- [Gateway 시작](../gateway-startup/) - Gateway의 다양한 시작 모드 이해

아직 완료하지 않았다면 먼저 해당 강좌로 돌아가세요.
:::

### 선택사항: 채널 구성

WhatsApp/Telegram/Slack 등의 채널을 통해 메시지를 보내려면 먼저 채널을 구성해야 합니다.

빠른 확인:

```bash
## 구성된 채널 보기
clawdbot channels list
```

빈 목록이 반환되거나 원하는 채널이 없는 경우, 해당 채널의 구성 튜토리얼(`platforms/` 섹션)을 참조하세요.

---

## 핵심 개념

Clawdbot은 메시지를 보내는 세 가지 주요 방법을 지원합니다:

```
┌─────────────────────────────────────────────────────────────┐
│              Clawdbot 메시지 전송 방법                    │
├─────────────────────────────────────────────────────────────┤
│                                                         │
│  방법 1: CLI Agent 대화                                   │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → AI → 결과 반환              │
│  │ agent        │                                       │
│  │ --message    │                                       │
│  └─────────────┘                                       │
│                                                         │
│  방법 2: CLI를 통해 직접 채널로 메시지 보내기                          │
│  ┌─────────────┐                                       │
│  │ clawdbot   │ → Gateway → 채널 → 메시지 전송              │
│  │ message send │                                       │
│  │ --target     │                                       │
│  └─────────────┘                                       │
│                                                         │
│  방법 3: WebChat / 구성된 채널                              │
│  ┌─────────────┐               ┌──────────────┐   │
│  │ WebChat     │   또는         │ WhatsApp    │   │
│  │ 브라우저 인터페이스   │              │ Telegram    │ → Gateway → AI → 채널 회신 │
│  └─────────────┘               │ Slack       │   │
│                                 │ Discord     │   │
│                                 └──────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**주요 차이점**:

| 방법                     | AI 통과 여부 | 용도                           |
| ---------------------- | ----------- | ------------------------------ |
| `clawdbot agent`     | ✅ 예       | AI와 대화, 회신 및 사고 과정 얻기    |
| `clawdbot message send` | ❌ 아니오       | 채널에 직접 메시지 전송, AI 통과하지 않음    |
| WebChat / 채널       | ✅ 예       | 그래픽 인터페이스를 통해 AI와 대화         |

::: info 적합한 방법 선택
- **설치 확인**: `clawdbot agent` 또는 WebChat 사용
- **채널 테스트**: WhatsApp/Telegram 등 채널 앱 사용
- **대량 전송**: `clawdbot message send` 사용(AI 통과하지 않음)
:::

---

## 따라 해보세요

### 1단계: CLI를 통해 AI와 대화

**이유**
CLI는 브라우저나 채널 앱을 열 필요가 없는 가장 빠른 확인 방법입니다.

#### 기본 대화

```bash
## AI 어시스턴트에게 간단한 메시지 보내기
clawdbot agent --message "Hello, I'm testing Clawdbot!"
```

**다음과 같이 표시되어야 합니다**:
```
[clawdbot] Thinking...
[clawdbot] Hello! I'm your AI assistant powered by Clawdbot. How can I help you today?
```

#### 사고 수준 사용

Clawdbot은 다양한 사고 수준을 지원하며, AI의 "투명도"를 제어합니다:

```bash
## 높은 사고 수준(완전한 추론 과정 표시)
clawdbot agent --message "Ship checklist" --thinking high

## 사고 끄기(최종 답변만 표시)
clawdbot agent --message "What's 2+2?" --thinking off
```

**다음과 같이 표시되어야 합니다**(높은 사고 수준):
```
[clawdbot] I'll create a comprehensive ship checklist for you.

[THINKING]
Let me think about what needs to be checked for shipping:

1. Code readiness
   - All tests passing?
   - Code review completed?
   - Documentation updated?

2. Build configuration
   - Environment variables set correctly?
   - Build artifacts generated?

[THINKING END]

[clawdbot] 🚢 Ship checklist:
1. Check Node.js version (≥ 22)
2. Install Clawdbot globally
3. Run onboarding wizard
4. Start Gateway
5. Send test message
```

**사고 수준 옵션**:

| 수준        | 설명                           | 적용 가능한 시나리오             |
| --------- | ------------------------------ | ------------------ |
| `off`     | 사고 과정 표시 안 함               | 간단한 Q&A, 빠른 응답 |
| `minimal` | 최소한의 사고 출력              | 디버깅, 프로세스 확인     |
| `low`     | 낮은 상세도                     | 일상 대화           |
| `medium`   | 중간 상세도                   | 복잡한 작업           |
| `high`     | 높은 상세도(완전한 추론 과정 포함) | 학습, 코드 생성     |

#### 수신 채널 지정

AI가 회신을 특정 채널로 보내도록 할 수 있습니다(기본 채널 대신):

```bash
## AI 회신을 Telegram으로 보내기
clawdbot agent --message "Send me a weather update" --deliver --reply-channel telegram
```

::: tip 일반적인 매개변수
- `--to <번호>`: 수신자의 E.164 번호 지정(특정 세션 생성용)
- `--agent <id>`: 특정 Agent ID 사용(기본 main 대신)
- `--session-id <id>`: 새 세션 대신 기존 세션 계속
- `--verbose on`: 상세 로그 출력 활성화
- `--json`: JSON 형식 출력(스크립트 파싱용)
:::

---

### 2단계: WebChat 인터페이스를 통해 메시지 보내기

**이유**
WebChat은 브라우저 내 그래픽 인터페이스를 제공하며 더 직관적이고 리치 텍스트 및 첨부 파일을 지원합니다.

#### WebChat 액세스

WebChat은 Gateway의 WebSocket 서비스를 사용하며, **별도의 구성이나 추가 포트가 필요하지 않습니다**.

**액세스 방법**:

1. **브라우저 열기, 액세스**: `http://localhost:18789`
2. **또는 터미널에서 실행**: `clawdbot dashboard`(브라우저 자동 열기)

::: info WebChat 포트
WebChat은 Gateway와 동일한 포트(기본값 18789)를 사용합니다. Gateway 포트를 수정한 경우 WebChat도 동일한 포트를 사용합니다.
:::

**다음과 같이 표시되어야 합니다**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│  ┌───────────────────────────────────┐   │
│  │  안녕하세요! 당신의 AI 어시스턴트입니다.       │   │
│  │  어떤 도움이 필요하신가요?        │   │
│  └───────────────────────────────────┘   │
│  [입력창...                       │   │
│  [보내기]                            │   │
└─────────────────────────────────────────────┘
```

#### 메시지 보내기

1. 입력창에 메시지 입력
2. "보내기" 클릭 또는 `Enter` 키 누르기
3. AI 응답 대기

**다음과 같이 표시되어야 합니다**:
- AI 회신이 채팅 인터페이스에 표시됨
- 사고 수준이 활성화된 경우 `[THINKING]` 태그 표시됨

**WebChat 기능**:

| 기능     | 설명                           |
| ------ | ------------------------------ |
| 리치 텍스트   | Markdown 형식 지원            |
| 첨부 파일     | 이미지, 오디오, 비디오 업로드 지원    |
| 기록 | 세션 기록 자동 저장             |
| 세션 전환 | 왼쪽 패널에서 다른 세션으로 전환         |

::: tip macOS 메뉴 바 앱
Clawdbot macOS 앱을 설치한 경우 메뉴 바의 "Open WebChat" 버튼을 통해 WebChat을 직접 열 수도 있습니다.
:::

---

### 3단계: 구성된 채널을 통해 메시지 보내기

**이유**
채널(WhatsApp, Telegram, Slack 등) 연결이 정상인지 확인하고 실제 크로스 플랫폼 대화를 경험합니다.

#### WhatsApp 예제

onboarding 또는 구성에서 WhatsApp을 설정한 경우:

1. **WhatsApp 앱 열기**(모바일 또는 데스크톱 버전)
2. **Clawdbot 번호 검색**(또는 저장된 연락처)
3. **메시지 보내기**: `Hello from WhatsApp!`

**다음과 같이 표시되어야 합니다**:
```
[WhatsApp]
당신 → Clawdbot: Hello from WhatsApp!

Clawdbot → 당신: Hello! I received your message via WhatsApp.
How can I help you today?
```

#### Telegram 예제

Telegram Bot을 구성한 경우:

1. **Telegram 앱 열기**
2. **Bot 검색**(사용자명 사용)
3. **메시지 보내기**: `/start` 또는 `Hello from Telegram!`

**다음과 같이 표시되어야 합니다**:
```
[Telegram]
당신 → @your_bot: /start

@your_bot → 당신: Welcome! I'm Clawdbot's AI assistant.
You can talk to me here, and I'll respond via AI.
```

#### Slack/Discord 예제

Slack 또는 Discord의 경우:

1. **해당 앱 열기**
2. **Bot이 있는 채널 또는 서버 찾기**
3. **메시지 보내기**: `Hello from Slack!`

**다음과 같이 표시되어야 합니다**:
- Bot이 메시지에 회신
- 메시지 앞에 "AI Assistant" 태그가 표시될 수 있음

::: info DM 페어링 보호
기본적으로 Clawdbot은 **DM 페어링 보호**를 활성화합니다:
- 알 수 없는 발신자는 페어링 코드를 받게 됩니다
- 페어링을 승인할 때까지 메시지가 처리되지 않습니다

채널에서 처음 메시지를 보내는 경우 다음이 필요할 수 있습니다:
```bash
## 승인 대기 중인 페어링 요청 보기
clawdbot pairing list

## 페어링 요청 승인(<channel>과 <code>를 실제 값으로 교체)
clawdbot pairing approve <channel> <code>
```

자세한 설명: [DM 페어링 및 액세스 제어](../pairing-approval/)
:::

---

### 4단계(선택사항): 채널에 직접 메시지 보내기

**이유**
AI를 통과하지 않고 채널에 직접 메시지를 보냅니다. 대량 알림, 푸시 메시지 등의 시나리오에 적합합니다.

#### 텍스트 메시지 보내기

```bash
## WhatsApp으로 텍스트 메시지 보내기
clawdbot message send --target +15555550123 --message "Hello from CLI!"
```

#### 첨부 파일이 있는 메시지 보내기

```bash
## 이미지 보내기
clawdbot message send --target +15555550123 \
  --message "Check out this photo" \
  --media ~/Desktop/photo.jpg

## URL 이미지 보내기
clawdbot message send --target +15555550123 \
  --message "Here's a link" \
  --media https://example.com/image.png
```

**다음과 같이 표시되어야 합니다**:
```
[clawdbot] Message sent successfully
[clawdbot] Message ID: 3EB0A1234567890
```

::: tip message send 일반적인 매개변수
- `--channel`: 채널 지정(기본값: whatsapp)
- `--reply-to <id>`: 지정된 메시지에 회신
- `--thread-id <id>`: Telegram 스레드 ID
- `--buttons <json>`: Telegram 인라인 버튼(JSON 형식)
- `--card <json>`: Adaptive Card(지원되는 채널)
:::

---

## 확인점 ✅

위 단계를 완료한 후 다음을 할 수 있어야 합니다:

- [ ] CLI를 통해 메시지를 보내고 AI 회신 수신
- [ ] WebChat 인터페이스에서 메시지를 보내고 응답 확인
- [ ] (선택사항) 구성된 채널에서 메시지를 보내고 AI 회신 수신
- [ ] (선택사항) `clawdbot message send`를 사용하여 채널에 직접 메시지 보내기

::: tip 일반적인 문제

**Q: AI가 내 메시지에 회신하지 않나요?**

A: 다음 사항을 확인하세요:
1. Gateway가 실행 중인지 확인: `clawdbot gateway status`
2. AI 모델이 구성되어 있는지 확인: `clawdbot models list`
3. 상세 로그 확인: `clawdbot agent --message "test" --verbose on`

**Q: WebChat을 열 수 없나요?**

A: 다음을 확인하세요:
1. Gateway가 실행 중인지 확인
2. 포트가 올바른지 확인: 기본값 18789
3. 브라우저가 `http://127.0.0.1:18789`에 액세스하는지 확인(`localhost` 아님)

**Q: 채널 메시지 전송이 실패하나요?**

A: 다음을 확인하세요:
1. 채널이 로그인되어 있는지 확인: `clawdbot channels status`
2. 네트워크 연결이 정상인지 확인
3. 채널별 오류 로그 확인: `clawdbot gateway --verbose`
:::

---

## 주의할 점

### ❌ Gateway 시작되지 않음

**잘못된 방법**:
```bash
clawdbot agent --message "Hello"
## 오류: Gateway connection failed
```

**올바른 방법**:
```bash
## 먼저 Gateway 시작
clawdbot gateway --port 18789

## 그 다음 메시지 보내기
clawdbot agent --message "Hello"
```

::: warning Gateway 먼저 시작해야 함
모든 메시지 전송 방법(CLI, WebChat, 채널)은 Gateway의 WebSocket 서비스에 의존합니다. Gateway가 실행 중인지 확인하는 것이 첫 번째 단계입니다.
:::

### ❌ 채널 로그인되지 않음

**잘못된 방법**:
```bash
## WhatsApp이 로그인되지 않은 상태에서 메시지 보내기
clawdbot message send --target +15555550123 --message "Hi"
## 오류: WhatsApp not authenticated
```

**올바른 방법**:
```bash
## 먼저 채널 로그인
clawdbot channels login whatsapp

## 상태 확인
clawdbot channels status

## 그 다음 메시지 보내기
clawdbot message send --target +15555550123 --message "Hi"
```

### ❌ DM 페어링 잊어버림

**잘못된 방법**:
```bash
## Telegram에서 처음 메시지를 보내지만 페어링을 승인하지 않음
## 결과: Bot이 메시지를 받지만 처리하지 않음
```

**올바른 방법**:
```bash
## 1. 승인 대기 중인 페어링 요청 보기
clawdbot pairing list

## 2. 페어링 승인
clawdbot pairing approve telegram ABC123
## 3. 다시 메시지 보내기

### 이제 메시지가 처리되고 AI 회신을 받게 됩니다
```

### ❌ agent와 message send 혼동

**잘못된 방법**:
```bash
## AI와 대화하고 싶지만 message send 사용
clawdbot message send --target +15555550123 --message "Help me write code"
## 결과: 메시지가 채널로 직접 전송되고 AI가 처리하지 않음
```

**올바른 방법**:
```bash
## AI와 대화: agent 사용
clawdbot agent --message "Help me write code" --to +15555550123

## 직접 메시지 보내기: message send 사용(AI 통과하지 않음)
clawdbot message send --target +15555550123 --message "Meeting at 3pm"
```

---

## 요약

이 강좌에서 다음을 배웠습니다:

1. ✅ **CLI Agent 대화**: `clawdbot agent --message`로 AI와 소통, 사고 수준 제어 지원
2. ✅ **WebChat 인터페이스**: `http://localhost:18789`에 액세스하여 그래픽 인터페이스로 메시지 전송
3. ✅ **채널 메시지**: WhatsApp, Telegram, Slack 등 구성된 채널에서 AI와 대화
4. ✅ **직접 전송**: `clawdbot message send`로 AI를 우회하여 채널에 직접 메시지 전송
5. ✅ **문제 해결**: 일반적인 실패 원인 및 해결 방법 이해

**다음 단계**:

- [DM 페어링 및 액세스 제어](../pairing-approval/)를 학습하여 알 수 없는 발신자를 안전하게 관리하는 방법 이해
- [다중 채널 시스템 개요](../../platforms/channels-overview/)를 탐색하여 지원되는 모든 채널 및 구성 이해
- 크로스 플랫폼 AI 어시스턴트 경험을 위해 더 많은 채널(WhatsApp, Telegram, Slack, Discord 등) 구성

---

## 다음 강좌 예고

> 다음 강좌에서는 **[DM 페어링 및 액세스 제어](../pairing-approval/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - 기본 DM 페어링 보호 메커니즘 이해
> - 알 수 없는 발신자의 페어링 요청 승인 방법
> - 허용 목록 및 보안 정책 구성

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확장</strong></summary>

> 업데이트: 2026-01-27

| 기능                  | 파일 경로                                                                                             | 행 번호    |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| CLI Agent 명령 등록  | [`src/cli/program/register.agent.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/register.agent.ts) | 20-82    |
| Agent CLI 실행        | [`src/commands/agent-via-gateway.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/commands/agent-via-gateway.ts) | 82-184   |
| CLI message send 등록 | [`src/cli/program/message/register.send.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/program/message/register.send.ts) | 1-30     |
| Gateway chat.send 메서드 | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380   |
| WebChat 내부 메시지 처리 | [`src/gateway/server-chat.gateway-server-chat.e2e.test.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-chat.gateway-server-chat.e2e.test.ts) | 50-290    |
| 메시지 채널 유형 정의   | [`src/gateway/protocol/client-info.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/client-info.ts) | 2-23     |
| 채널 레지스트리         | [`src/channels/registry.js`](https://github.com/clawdbot/clawdbot/blob/main/src/channels/registry.js) | 전체 파일   |

**주요 상수**:
- `DEFAULT_CHAT_CHANNEL = "whatsapp"`: 기본 메시지 채널(`src/channels/registry.js`에서)
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: WebChat 내부 메시지 채널(`src/utils/message-channel.ts`에서)

**주요 함수**:
- `agentViaGatewayCommand()`: Gateway WebSocket을 통해 agent 메서드 호출(`src/commands/agent-via-gateway.ts`)
- `agentCliCommand()`: CLI agent 명령 진입점, 로컬 및 Gateway 모드 지원(`src/commands/agent-via-gateway.ts`)
- `registerMessageSendCommand()`: `message send` 명령 등록(`src/cli/program/message/register.send.ts`)
- `chat.send`: Gateway WebSocket 메서드, 메시지 전송 요청 처리(`src/gateway/server-methods/chat.ts`)

</details>
