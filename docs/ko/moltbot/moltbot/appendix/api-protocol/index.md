---
title: "Gateway WebSocket API 프로토콜 완전 가이드 | Clawdbot 튜토리얼"
sidebarTitle: "사용자 정의 클라이언트 개발"
subtitle: "Gateway WebSocket API 프로토콜 완전 가이드"
description: "Clawdbot Gateway WebSocket 프로토콜의 완전한 사양을 학습하세요. 연결 핸드셰이크, 메시지 프레임 형식, 요청/응답 모델, 이벤트 푸시, 권한 시스템 및 사용 가능한 모든 메서드를 포함합니다. 이 튜토리얼은 완전한 API 참조와 클라이언트 통합 예제를 제공하여 사용자 정의 클라이언트와 Gateway 통합을 빠르게 구현할 수 있도록 도와줍니다."
tags:
  - "API"
  - "WebSocket"
  - "프로토콜"
  - "개발자"
prerequisite:
  - "/ko/moltbot/moltbot/start-gateway-startup"
  - "/ko/moltbot/moltbot/advanced-session-management"
order: 350
---

# Gateway WebSocket API 프로토콜 완전 가이드

## 학습 후 할 수 있는 것

- 📡 Gateway WebSocket 서버에 성공적으로 연결
- 🔄 요청을 보내고 응답 처리
- 📡 서버에서 푸시하는 이벤트 수신
- 🔐 권한 시스템 이해 및 인증
- 🛠️ 사용 가능한 모든 Gateway 메서드 호출
- 📖 메시지 프레임 형식 및 오류 처리 이해

## 현재 당면한 문제

사용자 정의 클라이언트(모바일 앱, 웹 앱 또는 명령줄 도구 등)를 개발 중이며, Clawdbot Gateway와 통신해야 할 수 있습니다. Gateway의 WebSocket 프로토콜은 복잡해 보일 수 있으며, 다음이 필요합니다:

- 연결 설정 및 인증 방법 이해
- 요청/응답 메시지 형식 이해
- 사용 가능한 메서드 및 해당 매개변수 확인
- 서버에서 푸시하는 이벤트 처리
- 권한 시스템 이해

**좋은 소식**: Gateway WebSocket API 프로토콜은 명확하게 설계되었으며, 이 튜토리얼에서 완전한 참조 가이드를 제공합니다.

## 언제 사용하는가

::: info 사용 시나리오
이 프로토콜은 다음과 같은 경우에 사용하세요:
- Gateway에 연결하는 사용자 정의 클라이언트 개발
- WebChat 또는 모바일 앱 구현
- 모니터링 또는 관리 도구 생성
- 기존 시스템에 Gateway 통합
- Gateway 기능 디버깅 및 테스트
:::

## 핵심 개념

Clawdbot Gateway는 WebSocket 프로토콜을 사용하여 실시간 양방향 통신을 제공합니다. 프로토콜은 JSON 형식의 메시지 프레임을 기반으로 하며 세 가지 유형으로 나뉩니다:

1. **요청 프레임(Request Frame)**: 클라이언트가 요청을 보냄
2. **응답 프레임(Response Frame)**: 서버가 응답을 반환
3. **이벤트 프레임(Event Frame)**: 서버가 능동적으로 이벤트를 푸시

::: tip 설계 철학
프로토콜은 "요청-응답" 모델 + "이벤트 푸시" 패턴을 채택합니다:
- 클라이언트가 능동적으로 요청을 시작하면 서버가 응답을 반환
- 서버는 클라이언트 요청 없이 능동적으로 이벤트를 푸시할 수 있음
- 모든 작업은 통합된 WebSocket 연결을 통해 수행
:::

## 연결 핸드셰이크

### 단계 1: WebSocket 연결 설정

Gateway는 기본적으로 `ws://127.0.0.1:18789`를 수신합니다(구성을 통해 수정 가능).

::: code-group

```javascript [JavaScript]
// WebSocket 연결 설정
const ws = new WebSocket('ws://127.0.0.1:18789/v1/connect');

ws.onopen = () => {
  console.log('WebSocket 연결됨');
};
```

```python [Python]
import asyncio
import websockets

async def connect():
    uri = "ws://127.0.0.1:18789/v1/connect"
    async with websockets.connect(uri) as websocket:
        print("WebSocket 연결됨")
```

```bash [Bash]
# wscat 도구를 사용하여 연결 테스트
wscat -c ws://127.0.0.1:18789/v1/connect
```

:::

### 단계 2: 핸드셰이크 메시지 전송

연결이 설정된 후 클라이언트는 인증 및 버전 협상을 완료하기 위해 핸드셰이크 메시지를 보내야 합니다.

```json
{
  "minProtocol": 1,
  "maxProtocol": 3,
  "client": {
    "id": "my-app-v1",
    "displayName": "My Custom Client",
    "version": "1.0.0",
    "platform": "web",
    "mode": "operator",
    "instanceId": "unique-instance-id"
  },
  "caps": [],
  "commands": [],
  "auth": {
    "token": "your-token-here"
  }
}
```

**이유**: 핸드셰이크 메시지는 서버에 다음을 알려줍니다:
- 클라이언트가 지원하는 프로토콜 버전 범위
- 클라이언트의 기본 정보
- 인증 자격 증명(token 또는 password)

**예상되는 결과**: 서버가 `hello-ok` 메시지를 반환

```json
{
  "type": "hello-ok",
  "protocol": 3,
  "server": {
    "version": "v2026.1.24",
    "commit": "abc123",
    "host": "my-mac",
    "connId": "conn-123456"
  },
  "features": {
    "methods": ["agent", "send", "chat.send", ...],
    "events": ["agent.event", "chat.event", ...]
  },
  "snapshot": {
    "presence": [...],
    "health": {...},
    "stateVersion": {...},
    "uptimeMs": 12345678
  },
  "auth": {
    "deviceToken": "device-token-here",
    "role": "operator",
    "scopes": ["operator.read", "operator.write"]
  },
  "policy": {
    "maxPayload": 1048576,
    "maxBufferedBytes": 10485760,
    "tickIntervalMs": 30000
  }
}
```

::: info Hello-Ok 필드 설명
- `protocol`: 서버에서 사용하는 프로토콜 버전
- `server.version`: Gateway 버전 번호
- `features.methods`: 사용 가능한 모든 메서드 목록
- `features.events`: 구독 가능한 모든 이벤트 목록
- `snapshot`: 현재 상태 스냅샷
- `auth.scopes`: 클라이언트에 부여된 권한 범위
- `policy.maxPayload`: 단일 메시지의 최대 크기
- `policy.tickIntervalMs`: 하트비트 간격
:::

### 단계 3: 연결 상태 확인

핸드셰이크 성공 후 연결을 확인하기 위해 상태 확인 요청을 보낼 수 있습니다:

```json
{
  "type": "req",
  "id": "req-1",
  "method": "health",
  "params": {}
}
```

**예상되는 결과**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "status": "ok",
    "uptimeMs": 12345678
  }
}
```

## 메시지 프레임 형식

### 요청 프레임(Request Frame)

클라이언트가 보내는 모든 요청은 요청 프레임 형식을 따릅니다:

```json
{
  "type": "req",
  "id": "unique-request-id",
  "method": "method.name",
  "params": {
    // 메서드 매개변수
  }
}
```

| 필드 | 유형 | 필수 | 설명 |
|--- | --- | --- | ---|
| `type` | string | 예 | 고정값 `"req"` |
| `id` | string | 예 | 요청 고유 식별자, 응답 매칭에 사용 |
| `method` | string | 예 | 메서드 이름, 예: `"agent"`, `"send"` |
| `params` | object | 아니오 | 메서드 매개변수, 구체적인 형식은 메서드에 따라 다름 |

::: warning 요청 ID의 중요성
각 요청에는 고유한 `id`가 있어야 합니다. 서버는 `id`를 사용하여 응답을 요청과 연결합니다. 여러 요청이 동일한 `id`를 사용하면 응답이 올바르게 매칭되지 않습니다.
:::

### 응답 프레임(Response Frame)

서버는 각 요청에 대해 응답 프레임을 반환합니다:

```json
{
  "type": "res",
  "id": "unique-request-id",
  "ok": true,
  "payload": {
    // 응답 데이터
  },
  "error": {
    // 오류 정보(ok=false일 때만)
  }
}
```

| 필드 | 유형 | 필수 | 설명 |
|--- | --- | --- | ---|
| `type` | string | 예 | 고정값 `"res"` |
| `id` | string | 예 | 해당 요청 ID |
| `ok` | boolean | 예 | 요청 성공 여부 |
| `payload` | any | 아니오 | 성공 시 응답 데이터 |
| `error` | object | 아니오 | 실패 시 오류 정보 |

**성공 응답 예시**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": true,
  "payload": {
    "agents": [
      { "id": "agent-1", "name": "Default Agent" }
    ]
  }
}
```

**실패 응답 예시**:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Missing required parameter: message",
    "retryable": false
  }
}
```

### 이벤트 프레임(Event Frame)

서버는 클라이언트 요청 없이 능동적으로 이벤트를 푸시할 수 있습니다:

```json
{
  "type": "event",
  "event": "event.name",
  "payload": {
    // 이벤트 데이터
  },
  "seq": 123,
  "stateVersion": {
    "presence": 456,
    "health": 789
  }
}
```

| 필드 | 유형 | 필수 | 설명 |
|--- | --- | --- | ---|
| `type` | string | 예 | 고정값 `"event"` |
| `event` | string | 예 | 이벤트 이름 |
| `payload` | any | 아니오 | 이벤트 데이터 |
| `seq` | number | 아니오 | 이벤트 시퀀스 번호 |
| `stateVersion` | object | 아니오 | 상태 버전 번호 |

**일반적인 이벤트 예시**:

```json
// 하트비트 이벤트
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}

// Agent 이벤트
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "생각 중..."
    }
  }
}

// 채팅 이벤트
{
  "type": "event",
  "event": "chat.event",
  "payload": {
    "runId": "run-123",
    "sessionKey": "main",
    "seq": 1,
    "state": "delta",
    "message": {
      "role": "assistant",
      "content": "안녕하세요!"
    }
  }
}

// 종료 이벤트
{
  "type": "event",
  "event": "shutdown",
  "payload": {
    "reason": "시스템 재시작",
    "restartExpectedMs": 5000
  }
}
```

## 인증 및 권한

### 인증 방식

Gateway는 세 가지 인증 방식을 지원합니다:

#### 1. Token 인증(권장)

핸드셰이크 메시지에 token 제공:

```json
{
  "auth": {
    "token": "your-security-token"
  }
}
```

Token은 구성 파일에서 정의됩니다:

```json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secret-token-here"
    }
  }
}
```

#### 2. Password 인증

```json
{
  "auth": {
    "password": "your-password"
  }
}
```

Password는 구성 파일에서 정의됩니다:

```json
{
  "gateway": {
    "auth": {
      "mode": "password",
      "password": "your-password-here"
    }
  }
}
```

#### 3. Tailscale Identity(네트워크 인증)

Tailscale Serve/Funnel을 사용할 때 Tailscale Identity를 통해 인증할 수 있습니다:

```json
{
  "client": {
    "mode": "operator"
  },
  "device": {
    "id": "device-id",
    "publicKey": "public-key",
    "signature": "signature",
    "signedAt": 1706707200000
  }
}
```

### 권한 범위(Scopes)

클라이언트는 핸드셰이크 후 일련의 권한 범위를 받으며, 이는 호출 가능한 메서드를 결정합니다:

| 범위 | 권한 | 사용 가능한 메서드 |
|--- | --- | ---|
| `operator.admin` | 관리자 | 모든 메서드, 구성 수정, Wizard, 업데이트 등 포함 |
| `operator.write` | 쓰기 | 메시지 전송, Agent 호출, 세션 수정 등 |
| `operator.read` | 읽기 전용 | 상태 조회, 로그, 구성 등 |
| `operator.approvals` | 승인 | Exec 승인 관련 메서드 |
| `operator.pairing` | 페어링 | 노드 및 장치 페어링 관련 메서드 |

::: info 권한 확인
서버는 각 요청 시 권한을 확인합니다. 클라이언트에 필요한 권한이 없으면 요청이 거부됩니다:

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "INVALID_REQUEST",
    "message": "missing scope: operator.admin"
  }
}
```
:::

### 역할 시스템

범위 외에도 프로토콜은 역할 시스템을 지원합니다:

| 역할 | 설명 | 특수 권한 |
|--- | --- | ---|
| `operator` | 운영자 | 모든 Operator 메서드 호출 가능 |
| `node` | 장치 노드 | Node 전용 메서드만 호출 가능 |
| `device` | 장치 | 장치 관련 메서드 호출 가능 |

노드 역할은 장치 페어링 시 자동으로 할당되며, 장치 노드와 Gateway 간의 통신에 사용됩니다.

## 핵심 메서드 참조

### Agent 메서드

#### `agent` - Agent에 메시지 전송

AI Agent에 메시지를 보내고 스트리밍 응답을 받습니다.

```json
{
  "type": "req",
  "id": "req-1",
  "method": "agent",
  "params": {
    "message": "안녕하세요, Hello World를 작성해 주세요",
    "agentId": "default",
    "sessionId": "main",
    "idempotencyKey": "msg-123"
  }
}
```

**매개변수 설명**:

| 매개변수 | 유형 | 필수 | 설명 |
|--- | --- | --- | ---|
| `message` | string | 예 | 사용자 메시지 내용 |
| `agentId` | string | 아니오 | Agent ID, 기본값은 구성된 기본 Agent |
| `sessionId` | string | 아니오 | 세션 ID |
| `sessionKey` | string | 아니오 | 세션 키 |
| `to` | string | 아니오 | 전송 대상(채널) |
| `channel` | string | 아니오 | 채널 이름 |
| `accountId` | string | 아니오 | 계정 ID |
| `thinking` | string | 아니오 | 생각 내용 |
| `deliver` | boolean | 아니오 | 채널로 전송 여부 |
| `attachments` | array | 아니오 | 첨부 파일 목록 |
| `timeout` | number | 아니오 | 제한 시간(밀리초) |
| `lane` | string | 아니오 | 스케줄링 채널 |
| `extraSystemPrompt` | string | 아니오 | 추가 시스템 프롬프트 |
| `idempotencyKey` | string | 예 | 멱등 키, 중복 방지 |

**응답**:

Agent 응답은 이벤트 프레임을 통해 스트리밍으로 푸시됩니다:

```json
// thinking 이벤트
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 0,
    "stream": "thinking",
    "ts": 1706707200000,
    "data": {
      "content": "생각 중..."
    }
  }
}

// message 이벤트
{
  "type": "event",
  "event": "agent.event",
  "payload": {
    "runId": "run-123",
    "seq": 1,
    "stream": "message",
    "ts": 1706707200000,
    "data": {
      "role": "assistant",
      "content": "안녕하세요! 이것은 Hello World입니다..."
    }
  }
}
```

#### `agent.wait` - Agent 완료 대기

Agent 작업 완료를 대기합니다.

```json
{
  "type": "req",
  "id": "req-2",
  "method": "agent.wait",
  "params": {
    "runId": "run-123",
    "timeoutMs": 30000
  }
}
```

### Send 메서드

#### `send` - 채널에 메시지 전송

지정된 채널에 메시지를 보냅니다.

```json
{
  "type": "req",
  "id": "req-3",
  "method": "send",
  "params": {
    "to": "+1234567890",
    "message": "Hello from Clawdbot!",
    "channel": "whatsapp",
    "idempotencyKey": "send-123"
  }
}
```

**매개변수 설명**:

| 매개변수 | 유형 | 필수 | 설명 |
|--- | --- | --- | ---|
| `to` | string | 예 | 수신자 식별자(전화번호, 사용자 ID 등) |
| `message` | string | 예 | 메시지 내용 |
| `mediaUrl` | string | 아니오 | 미디어 URL |
| `mediaUrls` | array | 아니오 | 미디어 URL 목록 |
| `channel` | string | 아니오 | 채널 이름 |
| `accountId` | string | 아니오 | 계정 ID |
| `sessionKey` | string | 아니오 | 세션 키(미러링 출력용) |
| `idempotencyKey` | string | 예 | 멱등 키 |

### Poll 메서드

#### `poll` - 투표 생성

투표를 생성하고 채널로 전송합니다.

```json
{
  "type": "req",
  "id": "req-4",
  "method": "poll",
  "params": {
    "to": "+1234567890",
    "question": "좋아하는 프로그래밍 언어는 무엇인가요?",
    "options": ["Python", "JavaScript", "Go", "Rust"],
    "maxSelections": 1,
    "durationHours": 24,
    "channel": "telegram",
    "idempotencyKey": "poll-123"
  }
}
```

### Sessions 메서드

#### `sessions.list` - 세션 목록

모든 활성 세션을 나열합니다.

```json
{
  "type": "req",
  "id": "req-5",
  "method": "sessions.list",
  "params": {
    "limit": 50,
    "activeMinutes": 60,
    "includeDerivedTitles": true,
    "includeLastMessage": true
  }
}
```

**매개변수 설명**:

| 매개변수 | 유형 | 필수 | 설명 |
|--- | --- | --- | ---|
| `limit` | number | 아니오 | 최대 반환 수량 |
| `activeMinutes` | number | 아니오 | 최근 활성 세션 필터링(분) |
| `includeGlobal` | boolean | 아니오 | 전역 세션 포함 |
| `includeUnknown` | boolean | 아니오 | 알 수 없는 세션 포함 |
| `includeDerivedTitles` | boolean | 아니오 | 첫 번째 메시지에서 제목 유도 |
| `includeLastMessage` | boolean | 아니오 | 마지막 메시지 미리보기 포함 |
| `label` | string | 아니오 | 라벨로 필터링 |
| `agentId` | string | 아니오 | Agent ID로 필터링 |
| `search` | string | 아니오 | 검색 키워드 |

#### `sessions.patch` - 세션 구성 수정

세션의 구성 매개변수를 수정합니다.

```json
{
  "type": "req",
  "id": "req-6",
  "method": "sessions.patch",
  "params": {
    "key": "main",
    "label": "Main Session",
    "thinkingLevel": "minimal",
    "responseUsage": "tokens",
    "model": "claude-sonnet-4-20250514"
  }
}
```

#### `sessions.reset` - 세션 재설정

세션 기록을 비웁니다.

```json
{
  "type": "req",
  "id": "req-7",
  "method": "sessions.reset",
  "params": {
    "key": "main"
  }
}
```

#### `sessions.delete` - 세션 삭제

세션 및 기록을 삭제합니다.

```json
{
  "type": "req",
  "id": "req-8",
  "method": "sessions.delete",
  "params": {
    "key": "session-123",
    "deleteTranscript": true
  }
}
```

#### `sessions.compact` - 세션 기록 압축

컨텍스트 크기를 줄이기 위해 세션 기록을 압축합니다.

```json
{
  "type": "req",
  "id": "req-9",
  "method": "sessions.compact",
  "params": {
    "key": "main",
    "maxLines": 100
  }
}
```

### Config 메서드

#### `config.get` - 구성 가져오기

현재 구성을 가져옵니다.

```json
{
  "type": "req",
  "id": "req-10",
  "method": "config.get",
  "params": {}
}
```

#### `config.set` - 구성 설정

새 구성을 설정합니다.

```json
{
  "type": "req",
  "id": "req-11",
  "method": "config.set",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash"
  }
}
```

#### `config.apply` - 구성 적용 및 재시작

구성을 적용하고 Gateway를 재시작합니다.

```json
{
  "type": "req",
  "id": "req-12",
  "method": "config.apply",
  "params": {
    "raw": "{\"agent\":{\"model\":\"claude-sonnet-4-20250514\"}}",
    "baseHash": "previous-config-hash",
    "restartDelayMs": 1000
  }
}
```

#### `config.schema` - 구성 Schema 가져오기

구성의 Schema 정의를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-13",
  "method": "config.schema",
  "params": {}
}
```

### Channels 메서드

#### `channels.status` - 채널 상태 가져오기

모든 채널의 상태를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-14",
  "method": "channels.status",
  "params": {
    "probe": true,
    "timeoutMs": 5000
  }
}
```

**응답 예시**:

```json
{
  "type": "res",
  "id": "req-14",
  "ok": true,
  "payload": {
    "ts": 1706707200000,
    "channelOrder": ["whatsapp", "telegram", "slack"],
    "channelLabels": {
      "whatsapp": "WhatsApp",
      "telegram": "Telegram",
      "slack": "Slack"
    },
    "channelAccounts": {
      "whatsapp": [
        {
          "accountId": "wa-123",
          "enabled": true,
          "linked": true,
          "connected": true,
          "lastConnectedAt": 1706707200000
        }
      ]
    }
  }
}
```

#### `channels.logout` - 채널 로그아웃

지정된 채널에서 로그아웃합니다.

```json
{
  "type": "req",
  "id": "req-15",
  "method": "channels.logout",
  "params": {
    "channel": "whatsapp",
    "accountId": "wa-123"
  }
}
```

### Models 메서드

#### `models.list` - 사용 가능한 모델 목록

사용 가능한 모든 AI 모델을 나열합니다.

```json
{
  "type": "req",
  "id": "req-16",
  "method": "models.list",
  "params": {}
}
```

**응답 예시**:

```json
{
  "type": "res",
  "id": "req-16",
  "ok": true,
  "payload": {
    "models": [
      {
        "id": "claude-sonnet-4-20250514",
        "name": "Claude Sonnet 4",
        "provider": "anthropic",
        "contextWindow": 200000,
        "reasoning": true
      },
      {
        "id": "gpt-4o",
        "name": "GPT-4o",
        "provider": "openai",
        "contextWindow": 128000,
        "reasoning": false
      }
    ]
  }
}
```

### Agents 메서드

#### `agents.list` - 모든 Agent 목록

사용 가능한 모든 Agent를 나열합니다.

```json
{
  "type": "req",
  "id": "req-17",
  "method": "agents.list",
  "params": {}
}
```

**응답 예시**:

```json
{
  "type": "res",
  "id": "req-17",
  "ok": true,
  "payload": {
    "defaultId": "default",
    "mainKey": "main",
    "scope": "per-sender",
    "agents": [
      {
        "id": "default",
        "name": "Default Agent",
        "identity": {
          "name": "Clawdbot",
          "theme": "default",
          "emoji": "🤖"
        }
      }
    ]
  }
}
```

### Cron 메서드

#### `cron.list` - 예약 작업 목록

모든 예약 작업을 나열합니다.

```json
{
  "type": "req",
  "id": "req-18",
  "method": "cron.list",
  "params": {
    "includeDisabled": true
  }
}
```

#### `cron.add` - 예약 작업 추가

새 예약 작업을 추가합니다.

```json
{
  "type": "req",
  "id": "req-19",
  "method": "cron.add",
  "params": {
    "name": "일일 보고서",
    "description": "매일 아침 8시에 일일 보고서 생성",
    "enabled": true,
    "schedule": {
      "kind": "cron",
      "expr": "0 8 * * *",
      "tz": "Asia/Shanghai"
    },
    "sessionTarget": "main",
    "wakeMode": "now",
    "payload": {
      "kind": "agentTurn",
      "message": "오늘의 업무 일일 보고서를 생성해 주세요",
      "channel": "last"
    }
  }
}
```

#### `cron.run` - 예약 작업 수동 실행

지정된 예약 작업을 수동으로 실행합니다.

```json
{
  "type": "req",
  "id": "req-20",
  "method": "cron.run",
  "params": {
    "id": "cron-123",
    "mode": "force"
  }
}
```

### Nodes 메서드

#### `nodes.list` - 모든 노드 목록

페어링된 모든 장치 노드를 나열합니다.

```json
{
  "type": "req",
  "id": "req-21",
  "method": "nodes.list",
  "params": {}
}
```

#### `nodes.describe` - 노드 세부 정보 가져오기

지정된 노드의 상세 정보를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-22",
  "method": "nodes.describe",
  "params": {
    "nodeId": "ios-node-123"
  }
}
```

#### `nodes.invoke` - 노드 명령 호출

노드에서 명령을 실행합니다.

```json
{
  "type": "req",
  "id": "req-23",
  "method": "nodes.invoke",
  "params": {
    "nodeId": "ios-node-123",
    "command": "camera.snap",
    "params": {
      "quality": "high"
    },
    "timeoutMs": 10000,
    "idempotencyKey": "invoke-123"
  }
}
```

#### `nodes.pair.list` - 페어링 대기 노드 목록

페어링을 기다리는 모든 노드 요청을 나열합니다.

```json
{
  "type": "req",
  "id": "req-24",
  "method": "nodes.pair.list",
  "params": {}
}
```

#### `nodes.pair.approve` - 노드 페어링 승인

노드 페어링 요청을 승인합니다.

```json
{
  "type": "req",
  "id": "req-25",
  "method": "nodes.pair.approve",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.pair.reject` - 노드 페어링 거부

노드 페어링 요청을 거부합니다.

```json
{
  "type": "req",
  "id": "req-26",
  "method": "nodes.pair.reject",
  "params": {
    "requestId": "pair-req-123"
  }
}
```

#### `nodes.rename` - 노드 이름 변경

노드의 이름을 변경합니다.

```json
{
  "type": "req",
  "id": "req-27",
  "method": "nodes.rename",
  "params": {
    "nodeId": "ios-node-123",
    "displayName": "My iPhone"
  }
}
```

### Logs 메서드

#### `logs.tail` - 로그 가져오기

Gateway 로그를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-28",
  "method": "logs.tail",
  "params": {
    "cursor": 0,
    "limit": 100,
    "maxBytes": 100000
  }
}
```

**응답 예시**:

```json
{
  "type": "res",
  "id": "req-28",
  "ok": true,
  "payload": {
    "file": "/path/to/gateway.log",
    "cursor": 123456,
    "size": 4567890,
    "lines": [
      "[2025-01-27 10:00:00] INFO: Starting Gateway...",
      "[2025-01-27 10:00:01] INFO: Connected to WhatsApp"
    ],
    "truncated": false
  }
}
```

### Skills 메서드

#### `skills.status` - 스킬 상태 가져오기

모든 스킬의 상태를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-29",
  "method": "skills.status",
  "params": {}
}
```

#### `skills.bins` - 스킬 라이브러리 목록

사용 가능한 스킬 라이브러리를 나열합니다.

```json
{
  "type": "req",
  "id": "req-30",
  "method": "skills.bins",
  "params": {}
}
```

#### `skills.install` - 스킬 설치

지정된 스킬을 설치합니다.

```json
{
  "type": "req",
  "id": "req-31",
  "method": "skills.install",
  "params": {
    "name": "my-custom-skill",
    "installId": "install-123",
    "timeoutMs": 60000
  }
}
```

### WebChat 메서드

#### `chat.send` - 채팅 메시지 전송(WebChat)

WebChat 전용 채팅 메서드.

```json
{
  "type": "req",
  "id": "req-32",
  "method": "chat.send",
  "params": {
    "sessionKey": "main",
    "message": "Hello from WebChat!",
    "thinking": "답변 중...",
    "deliver": true,
    "idempotencyKey": "chat-123"
  }
}
```

#### `chat.history` - 채팅 기록 가져오기

지정된 세션의 기록 메시지를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-33",
  "method": "chat.history",
  "params": {
    "sessionKey": "main",
    "limit": 50
  }
}
```

#### `chat.abort` - 채팅 중단

진행 중인 채팅을 중단합니다.

```json
{
  "type": "req",
  "id": "req-34",
  "method": "chat.abort",
  "params": {
    "sessionKey": "main",
    "runId": "run-123"
  }
}
```

### Wizard 메서드

#### `wizard.start` - 마법사 시작

구성 마법사를 시작합니다.

```json
{
  "type": "req",
  "id": "req-35",
  "method": "wizard.start",
  "params": {}
}
```

#### `wizard.next` - 마법사 다음 단계

마법사의 다음 단계를 실행합니다.

```json
{
  "type": "req",
  "id": "req-36",
  "method": "wizard.next",
  "params": {
    "stepId": "step-1",
    "response": {
      "selectedOption": "option-1"
    }
  }
}
```

#### `wizard.cancel` - 마법사 취소

진행 중인 마법사를 취소합니다.

```json
{
  "type": "req",
  "id": "req-37",
  "method": "wizard.cancel",
  "params": {}
}
```

### System 메서드

#### `status` - 시스템 상태 가져오기

Gateway 시스템 상태를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-38",
  "method": "status",
  "params": {}
}
```

#### `last-heartbeat` - 마지막 하트비트 시간 가져오기

Gateway의 마지막 하트비트 시간을 가져옵니다.

```json
{
  "type": "req",
  "id": "req-39",
  "method": "last-heartbeat",
  "params": {}
}
```

### Usage 메서드

#### `usage.status` - 사용 통계 가져오기

Token 사용 통계를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-40",
  "method": "usage.status",
  "params": {}
}
```

#### `usage.cost` - 비용 통계 가져오기

API 호출 비용 통계를 가져옵니다.

```json
{
  "type": "req",
  "id": "req-41",
  "method": "usage.cost",
  "params": {}
}
```

## 오류 처리

### 오류 코드

모든 오류 응답에는 오류 코드와 설명이 포함됩니다:

| 오류 코드 | 설명 | 재시 가능 |
|--- | --- | ---|
| `NOT_LINKED` | 노드 연결되지 않음 | 예 |
| `NOT_PAIRED` | 노드 페어링되지 않음 | 아니오 |
| `AGENT_TIMEOUT` | Agent 제한 시간 초과 | 예 |
| `INVALID_REQUEST` | 요청 무효 | 아니오 |
| `UNAVAILABLE` | 서비스 사용 불가 | 예 |

### 오류 응답 형식

```json
{
  "type": "res",
  "id": "req-1",
  "ok": false,
  "error": {
    "code": "AGENT_TIMEOUT",
    "message": "Agent response timeout",
    "retryable": true,
    "retryAfterMs": 5000
  }
}
```

### 오류 처리 권장 사항

1. **`retryable` 필드 확인**: `true`이면 `retryAfterMs` 지연 후 재시도 가능
2. **오류 세부 정보 기록**: 디버깅을 위해 `code`와 `message` 기록
3. **매개변수 검증**: `INVALID_REQUEST`은 일반적으로 매개변수 검증 실패를 의미
4. **연결 상태 확인**: `NOT_LINKED`은 연결이 끊어졌음을 의미하며 재연결 필요

## 하트비트 메커니즘

Gateway는 주기적으로 하트비트 이벤트를 보냅니다:

```json
{
  "type": "event",
  "event": "tick",
  "payload": {
    "ts": 1706707200000
  }
}
```

::: tip 하트비트 처리
클라이언트는 다음을 수행해야 합니다:
1. `tick` 이벤트 수신 대기
2. 마지막 하트비트 시간 업데이트
3. `3 * tickIntervalMs` 이상 하트비트를 수신하지 못하면 재연결 고려
:::

## 완전한 예제

### JavaScript 클라이언트 예제

```javascript
const WebSocket = require('ws');

class GatewayClient {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.ws = null;
    this.requestId = 0;
    this.pendingRequests = new Map();
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);

      this.ws.on('open', () => {
        // 핸드셰이크 메시지 전송
        this.sendHandshake();
        resolve();
      });

      this.ws.on('message', (data) => {
        this.handleMessage(JSON.parse(data));
      });

      this.ws.on('error', (error) => {
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('WebSocket 연결 끊김');
      });
    });
  }

  sendHandshake() {
    this.ws.send(JSON.stringify({
      minProtocol: 1,
      maxProtocol: 3,
      client: {
        id: 'my-client',
        displayName: 'My Gateway Client',
        version: '1.0.0',
        platform: 'node',
        mode: 'operator'
      },
      auth: {
        token: this.token
      }
    }));
  }

  async request(method, params = {}) {
    const id = `req-${++this.requestId}`;
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      this.ws.send(JSON.stringify({
        type: 'req',
        id,
        method,
        params
      }));

      // 제한 시간 설정
      setTimeout(() => {
        this.pendingRequests.delete(id);
        reject(new Error('요청 제한 시간 초과'));
      }, 30000);
    });
  }

  handleMessage(message) {
    if (message.type === 'res') {
      const { id, ok, payload, error } = message;
      const pending = this.pendingRequests.get(id);
      
      if (pending) {
        this.pendingRequests.delete(id);
        if (ok) {
          pending.resolve(payload);
        } else {
          pending.reject(new Error(`${error.code}: ${error.message}`));
        }
      }
    } else if (message.type === 'event') {
      this.handleEvent(message);
    }
  }

  handleEvent(event) {
    console.log('이벤트 수신:', event.event, event.payload);
  }

  async sendAgentMessage(message) {
    return this.request('agent', {
      message,
      idempotencyKey: `msg-${Date.now()}`
    });
  }

  async listSessions() {
    return this.request('sessions.list', {
      limit: 50,
      includeLastMessage: true
    });
  }

  async getChannelsStatus() {
    return this.request('channels.status', {
      probe: true
    });
  }
}

// 사용 예제
(async () => {
  const client = new GatewayClient('ws://127.0.0.1:18789/v1/connect', 'your-token');
  await client.connect();

  // Agent에 메시지 전송
  const response = await client.sendAgentMessage('안녕하세요!');
  console.log('Agent 응답:', response);

  // 세션 목록
  const sessions = await client.listSessions();
  console.log('세션 목록:', sessions);

  // 채널 상태 가져오기
  const channels = await client.getChannelsStatus();
  console.log('채널 상태:', channels);
})();
```

## 이번 강의 요약

이 튜토리얼에서는 Clawdbot Gateway WebSocket API 프로토콜을 자세히 설명했습니다:

- ✅ 연결 핸드셰이크 절차 및 인증 메커니즘
- ✅ 세 가지 메시지 프레임 유형(요청, 응답, 이벤트)
- ✅ 핵심 메서드 참조(Agent, Send, Sessions, Config 등)
- ✅ 권한 시스템 및 역할 관리
- ✅ 오류 처리 및 재시도 전략
- ✅ 하트비트 메커니즘 및 연결 관리
- ✅ 완전한 JavaScript 클라이언트 예제

## 다음 강의 예고

> 다음 강의에서는 **[완전한 구성 참조](../config-reference/)**를 학습합니다.
>
> 다음을 배우게 됩니다:
> - 모든 구성 항목의 상세 설명
> - 구성 Schema 및 기본값
> - 환경 변수 치환 메커니즘
> - 구성 검증 및 오류 처리

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 프로토콜 진입점 및 검증기 | `src/gateway/protocol/index.ts` | 1-521 |
| 기본 프레임 유형 정의 | `src/gateway/protocol/schema/frames.ts` | 1-165 |
| 프로토콜 버전 정의 | `src/gateway/protocol/schema/protocol-schemas.ts` | 231 |
| 오류 코드 정의 | `src/gateway/protocol/schema/error-codes.ts` | 3-24 |
| Agent 관련 Schema | `src/gateway/protocol/schema/agent.ts` | 1-107 |
| Chat/Logs Schema | `src/gateway/protocol/schema/logs-chat.ts` | 1-83 |
| Sessions Schema | `src/gateway/protocol/schema/sessions.ts` | 1-105 |
| Config Schema | `src/gateway/protocol/schema/config.ts` | 1-72 |
| Nodes Schema | `src/gateway/protocol/schema/nodes.ts` | 1-103 |
| Cron Schema | `src/gateway/protocol/schema/cron.ts` | 1-246 |
| Channels Schema | `src/gateway/protocol/schema/channels.ts` | 1-108 |
| Models/Agents/Skills Schema | `src/gateway/protocol/schema/agents-models-skills.ts` | 1-86 |
| 요청 처리기 | `src/gateway/server-methods.ts` | 1-200 |
| 권한 검증 로직 | `src/gateway/server-methods.ts` | 91-144 |
| 상태 스냅샷 정의 | `src/gateway/protocol/schema/snapshot.ts` | 1-58 |

**주요 상수**:
- `PROTOCOL_VERSION = 3`: 현재 프로토콜 버전
- `ErrorCodes`: 오류 코드 열거형(NOT_LINKED, NOT_PAIRED, AGENT_TIMEOUT, INVALID_REQUEST, UNAVAILABLE)

**주주 유형**:
- `GatewayFrame`: 게이트웨이 프레임 유니온 유형(RequestFrame | ResponseFrame | EventFrame)
- `RequestFrame`: 요청 프레임 유형
- `ResponseFrame`: 응답 프레임 유형
- `EventFrame`: 이벤트 프레임 유형
- `HelloOk`: 핸드셰이크 성공 응답 유형
- `ErrorShape`: 오류 형상 유형

</details>
