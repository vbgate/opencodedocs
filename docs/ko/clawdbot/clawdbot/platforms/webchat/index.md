---
title: "WebChat 인터페이스: 브라우저 내 AI 어시스턴트 | Clawdbot 튜토리얼"
sidebarTitle: "웹 버전 AI 체험하기"
subtitle: "WebChat 인터페이스: 브라우저 내 AI 어시스턴트"
description: "Clawdbot 내장 WebChat 인터페이스를 사용하여 AI 어시스턴트와 대화하는 방법을 학습합니다. 이 튜토리얼은 WebChat 액세스 방법, 핵심 기능(세션 관리, 첨부 파일 업로드, Markdown 지원) 및 원격 액세스 구성(SSH 터널, Tailscale)을 소개하며, 추가 포트나 별도 구성이 필요하지 않습니다."
tags:
  - "WebChat"
  - "브라우저 인터페이스"
  - "채팅"
prerequisite:
  - "start-gateway-startup"
order: 150
---

# WebChat 인터페이스: 브라우저 내 AI 어시스턴트

## 학습 후 할 수 있는 것

이 튜토리얼을 완료하면 다음을 수행할 수 있습니다:

- ✅ 브라우저를 통해 WebChat 인터페이스 액세스
- ✅ WebChat에서 메시지를 보내고 AI 응답 수신
- ✅ 세션 기록 관리 및 세션 전환
- ✅ 첨부 파일(이미지, 오디오, 비디오) 업로드
- ✅ 원격 액세스 구성(Tailscale/SSH 터널)
- ✅ WebChat과 다른 채널의 차이점 이해

## 현재 겪고 있는 문제점

이미 Gateway를 시작했지만 명령줄만 사용하는 것이 아니라 더 직관적인 그래픽 인터페이스로 AI 어시스턴트와 대화하기를 원할 수 있습니다.

다음과 같은 궁금증이 있을 수 있습니다:

- "ChatGPT와 같은 웹 인터페이스가 있나요?"
- "WebChat과 WhatsApp/Telegram 채널의 차이점은 무엇인가요?"
- "WebChat을 별도로 구성해야 하나요?"
- "원격 서버에서 WebChat을 어떻게 사용하나요?"

좋은 소식은: **WebChat은 Clawdbot 내장 채팅 인터페이스**로, 별도로 설치하거나 구성할 필요 없이 Gateway를 시작하면 바로 사용할 수 있습니다.

## 언제 사용하는가

다음과 같은 경우에 사용합니다:

- 🖥️ **그래픽 인터페이스 대화**: 명령줄 대신 브라우저 내 채팅 환경 선호
- 📊 **세션 관리**: 기록 보기, 다른 세션 전환
- 🌐 **로컬 액세스**: 동일한 장치에서 AI와 대화
- 🔄 **원격 액세스**: SSH/Tailscale 터널을 통해 원격 Gateway 액세스
- 💬 **리치 텍스트 상호작용**: Markdown 형식 및 첨부 파일 지원

---

## 🎒 시작 전 준비

WebChat을 사용하기 전에 다음을 확인하세요:

### 필수 조건

| 조件                     | 확인 방법                                        |
|--- | ---|
| **Gateway 시작됨**   | `clawdbot gateway status` 또는 프로세스 실행 중인지 확인 |
| **포트 액세스 가능**       | 18789 포트(또는 사용자 지정 포트)가 사용 중이 아닌지 확인 |
| **AI 모델 구성됨** | `clawdbot models list`로 사용 가능한 모델 확인      |

::: warning 선행 수업
이 튜토리얼은 다음을 완료했다고 가정합니다:
- [빠른 시작](../../start/getting-started/) - Clawdbot 설치, 구성 및 시작
- [Gateway 시작](../../start/gateway-startup/) - Gateway의 다른 시작 모드 이해

아직 완료하지 않았다면 먼저 이 수업으로 돌아가세요.
:::

### 선택 사항: 인증 구성

WebChat은 기본적으로 인증이 필요합니다(로컬 액세스의 경우에도). 이는 AI 어시스턴트를 보호하기 위함입니다.

빠른 확인:

```bash
## 현재 인증 구성 보기
clawdbot config get gateway.auth.mode
clawdbot config get gateway.auth.token
```

구성되지 않은 경우 먼저 설정하는 것이 좋습니다:

```bash
## 토큰 인증 설정(권장)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here
```

자세한 설명: [Gateway 인증 구성](../../advanced/security-sandbox/)。

---

## 핵심 개념

### WebChat이란

**WebChat**은 Clawdbot 내장 채팅 인터페이스로 Gateway WebSocket을 통해 AI 어시스턴트와 직접 상호작용합니다.

**핵심 특징**:

```
┌─────────────────────────────────────────────────────┐
│              WebChat 아키텍처                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  브라우저/클라이언트                                     │
│      │                                              │
│      ▼                                              │
│  Gateway WebSocket (ws://127.0.0.1:18789)          │
│      │                                              │
│      ├─ chat.send → Agent → 메시지 처리              │
│      ├─ chat.history → 세션 기록 반환               │
│      ├─ chat.inject → 시스템 메모 추가              │
│      └─ 이벤트 스트림 → 실시간 업데이트                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**다른 채널과의 차이점**:

| 특성         | WebChat                          | WhatsApp/Telegram 등                |
|--- | --- | ---|
| **액세스 방식** | 브라우저에서 Gateway에 직접 액세스           | 타사 APP 및 로그인 필요         |
| **구성 요구** | 별도 구성 불필요, Gateway 포트 재사용   | 채널별 API Key/Token 필요  |
| **응답 라우팅** | WebChat로 결정적 라우팅          | 해당 채널로 라우팅              |
| **원격 액세스** | SSH/Tailscale 터널을 통해       | 채널 플랫폼에서 원격 액세스 제공         |
| **세션 모델** | Gateway의 세션 관리 사용        | Gateway의 세션 관리 사용        |

### WebChat 작동 원리

WebChat은 별도의 HTTP 서버나 포트 구성이 필요 없으며 Gateway의 WebSocket 서비스를 직접 사용합니다.

**핵심 포인트**:
- **공유 포트**: WebChat은 Gateway와 동일한 포트 사용(기본 18789)
- **추가 구성 없음**: `webchat.*` 구성 블록 없음
- **실시간 동기화**: 기록은 Gateway에서 실시간으로 가져오며 로컬에 캐시하지 않음
- **읽기 전용 모드**: Gateway에 연결할 수 없는 경우 WebChat은 읽기 전용이 됨

::: info WebChat vs 컨트롤 UI
WebChat은 채팅 경험에 초점을 맞추며 **Control UI**는 전체 Gateway 제어 패널(구성, 세션 관리, 기술 관리 등)을 제공합니다.

- WebChat: `http://localhost:18789/chat` 또는 macOS 앱의 채팅 보기
- Control UI: `http://localhost:18789/` 전체 제어 패널
:::

---

## 함께 따라하기

### 1단계: WebChat 액세스

**이유**
WebChat은 Gateway 내장 채팅 인터페이스로 추가 소프트웨어 설치가 필요 없습니다.

#### 방법 1: 브라우저 액세스

브라우저를 열고 다음에 액세스하세요:

```bash
## 기본 주소(기본 포트 18789 사용)
http://localhost:18789

## 또는 루프백 주소 사용(더 신뢰성 높음)
http://127.0.0.1:18789
```

**다음이 표시되어야 합니다**:
```
┌─────────────────────────────────────────────┐
│          Clawdbot WebChat              │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  [세션 목록]  [설정]      │   │
│  └───────────────────────────────────┘   │
│                                             │
│  ┌───────────────────────────────────┐   │
│  │  안녕하세요! 당신의 AI 어시스턴트입니다.       │   │
│  │  무엇을 도와드릴까요?        │   │
│  └───────────────────────────────────┘   │
│                                             │
│  [메시지 입력...]                  [전송]   │
└─────────────────────────────────────────────┘
```

#### 방법 2: macOS 애플리케이션

Clawdbot macOS 메뉴바 앱을 설치한 경우:

1. 메뉴바 아이콘 클릭
2. "Open WebChat" 선택 또는 채팅 아이콘 클릭
3. WebChat이 독립 창에서 열림

**장점**:
- 기본 macOS 환경
- 단축키 지원
- Voice Wake 및 Talk Mode와 통합

#### 방법 3: 명령줄 바로가기

```bash
## 브라우저에서 WebChat 자동 열기
clawdbot web
```

**다음이 표시되어야 합니다**: 기본 브라우저가 자동으로 열리고 `http://localhost:18789`로 이동

---

### 2단계: 첫 번째 메시지 보내기

**이유**
WebChat과 Gateway의 연결이 정상인지, AI 어시스턴트가 올바르게 응답하는지 확인합니다.

1. 입력 상자에 첫 번째 메시지 입력
2. "전송" 버튼 클릭 또는 `Enter` 키 누르기
3. 채팅 인터페이스 응답 관찰

**예시 메시지**:
```
Hello! I'm testing WebChat. Can you introduce yourself?
```

**다음이 표시되어야 합니다**:
```
┌─────────────────────────────────────────────┐
│  당신 → AI: Hello! I'm testing...      │
│                                             │
│  AI → 당신: 안녕하세요! Clawdbot AI    │
│  어시스턴트입니다. 질문 답변,          │
│  코드 작성, 작업 관리 등 도와드릴 수 있습니다.              │
│  무엇을 도와드릴까요?            │
│                                             │
│  [메시지 입력...]                  [전송]   │
└─────────────────────────────────────────────┘
```

::: tip 인증 프롬프트
Gateway에 인증이 구성된 경우 WebChat 액세스 시 토큰 또는 비밀번호 입력을 요청합니다:

```
┌─────────────────────────────────────────────┐
│          Gateway 인증                    │
│                                             │
│  토큰을 입력하세요:                             │
│  [•••••••••••••]              │
│                                             │
│              [취소]  [로그인]               │
└─────────────────────────────────────────────┘
```

구성된 `gateway.auth.token` 또는 `gateway.auth.password`를 입력하세요.
:::

---

### 3단계: WebChat 기능 사용

**이유**
WebChat은 풍부한 상호작용 기능을 제공하며 이러한 기능에 익숙해지면 사용 경험이 향상됩니다.

#### 세션 관리

WebChat은 다중 세션 관리를 지원하여 다른 컨텍스트에서 AI와 대화할 수 있습니다.

**작업 단계**:

1. 왼쪽 세션 목록 클릭(또는 "새 세션" 버튼)
2. 세션 선택 또는 새 세션 생성
3. 새 세션에서 대화 계속

**세션 특징**:
- ✅ 독립 컨텍스트: 각 세션의 메시지 기록이 분리됨
- ✅ 자동 저장: 모든 세션은 Gateway에서 관리되며 영구 저장됨
- ✅ 크로스 플랫폼 동기화: CLI, WebChat, macOS 앱, iOS/Android 노드와 동일한 세션 데이터 공유

::: info 메인 세션
WebChat은 기본적으로 Gateway의 **메인 세션 키**(`main`)를 사용합니다. 이는 모든 클라이언트(CLI, WebChat, macOS 앱, iOS/Android 노드)가 동일한 메인 세션 기록을 공유한다는 의미입니다.

분리된 컨텍스트가 필요한 경우 구성에서 다른 세션 키를 설정할 수 있습니다.
:::

#### 첨부 파일 업로드

WebChat은 이미지, 오디오, 비디오 등 첨부 파일 업로드를 지원합니다.

**작업 단계**:

1. 입력 상자 옆 "첨부 파일" 아이콘 클릭(일반적으로 📎 또는 📎️)
2. 업로드할 파일 선택(또는 파일을 채팅 영역으로 드래그)
3. 관련 텍스트 설명 입력
4. "전송" 클릭

**지원 형식**:
- 📷 **이미지**: JPEG, PNG, GIF
- 🎵 **오디오**: MP3, WAV, M4A
- 🎬 **비디오**: MP4, MOV
- 📄 **문서**: PDF, TXT 등(Gateway 구성에 따라 다름)

**다음이 표시되어야 합니다**:
```
┌─────────────────────────────────────────────┐
│  당신 → AI: 이 이미지를 분석해주세요         │
│  [📎 photo.jpg]                         │
│                                             │
│  AI → 당신: 이 이미지를 보니...        │
│  [분석 결과...]                              │
└─────────────────────────────────────────────┘
```

::: warning 파일 크기 제한
WebChat과 Gateway는 업로드된 파일 크기에 제한이 있습니다(일반적으로 몇 MB). 업로드에 실패한 경우 파일 크기 또는 Gateway의 미디어 구성을 확인하세요.
:::

#### Markdown 지원

WebChat은 Markdown 형식을 지원하여 메시지를 서식화할 수 있습니다.

**예시**:

```markdown
# 제목
## 2단계 제목
- 목록 항목 1
- 목록 항목 2

**굵게** 와 *기울임꼴*
`코드`
```

**미리보기 효과**:
```
# 제목
## 2단계 제목
- 목록 항목 1
- 목록 항목 2

**굵게** 와 *기울임꼴*
`코드`
```

#### 명령 바로가기

WebChat은 슬래시 명령을 지원하여 특정 작업을 빠르게 실행할 수 있습니다.

**일반적인 명령**:

| 명령             | 기능                         |
|--- | ---|
| `/new`          | 새 세션 생성                   |
| `/reset`        | 현재 세션 기록 재설정           |
| `/clear`        | 현재 세션의 모든 메시지 지우기       |
| `/status`       | Gateway 및 채널 상태 표시       |
| `/models`       | 사용 가능한 AI 모델 목록         |
| `/help`         | 도움말 정보 표시                 |

**사용 예시**:

```
/new
## 새 세션 생성

/reset
## 현재 세션 재설정
```

---

### 4단계(선택 사항): 원격 액세스 구성

**이유**
원격 서버에서 Gateway를 실행하거나 다른 장치에서 WebChat에 액세스하려는 경우 원격 액세스를 구성해야 합니다.

#### SSH 터널을 통한 액세스

**적용 시나리오**: Gateway가 원격 서버에 있고 로컬 머신에서 WebChat에 액세스하려는 경우.

**작업 단계**:

1. SSH 터널을 설정하여 원격 Gateway 포트를 로컬에 매핑:

```bash
## 원격의 18789 포트를 로컬의 18789 포트로 매핑
ssh -L 18789:localhost:18789 user@your-remote-server.com
```

2. SSH 연결을 열린 상태로 유지(또는 `-N` 매개변수를 사용하여 원격 명령 실행 안 함)

3. 로컬 브라우저에서 액세스: `http://localhost:18789`

**다음이 표시되어야 합니다**: 로컬 액세스와 동일한 WebChat 인터페이스

::: tip SSH 터널 유지
SSH 터널은 연결이 끊어지면 무효화됩니다. 지속적인 액세스가 필요한 경우:

- `autossh`를 사용하여 자동 재연결
- SSH Config에서 `LocalForward` 구성
- systemd/launchd를 사용하여 터널 자동 시작
:::

#### Tailscale을 통한 액세스

**적용 시나리오**: Tailscale를 사용하여 사설 네트워크를 구성하고 Gateway와 클라이언트가 동일한 tailnet에 있는 경우.

**구성 단계**:

1. Gateway 머신에서 Tailscale Serve 또는 Funnel 활성화:

```bash
## 구성 파일 편집
clawdbot config set gateway.tailscale.mode serve
## 또는
clawdbot config set gateway.tailscale.mode funnel
```

2. Gateway 재시작

```bash
## 구성을 적용하기 위해 Gateway 재시작
clawdbot gateway restart
```

3. Gateway의 Tailscale 주소 가져오기

```bash
## 상태 보기(Tailscale URL 표시)
clawdbot gateway status
```

4. 클라이언트 장치(동일한 tailnet)에서 액세스:

```
http://<gateway-tailscale-name>.tailnet-<tailnet-id>.ts.net:18789
```

::: info Tailscale Serve vs Funnel
- **Serve**: tailnet 내에서만 액세스 가능, 더 안전
- **Funnel**: 인터넷에 공개 액세스, `gateway.auth` 보호 필요

공용 네트워크에서 액세스해야 하는 경우가 아니면 Serve 모드 사용을 권장합니다.
:::

#### 원격 액세스 인증

SSH 터널이나 Tailscale을 사용하든 Gateway에 인증이 구성된 경우 여전히 토큰 또는 비밀번호를 제공해야 합니다.

**인증 구성 확인**:

```bash
## 인증 모드 보기
clawdbot config get gateway.auth.mode

## 토큰 모드인 경우 토큰이 설정되었는지 확인
clawdbot config get gateway.auth.token
```

---

## 검사점 ✅

위 단계를 완료하면 다음을 수행할 수 있어야 합니다:

- [ ] 브라우저에서 WebChat 액세스(`http://localhost:18789`)
- [ ] 메시지를 보내고 AI 응답 수신
- [ ] 세션 관리 기능 사용(새 세션, 전환, 재설정)
- [ ] 첨부 파일을 업로드하고 AI 분석
- [ ] (선택 사항) SSH 터널을 통해 WebChat 원격 액세스
- [ ] (선택 사항) Tailscale를 통해 WebChat 액세스

::: tip 연결 확인
WebChat에 액세스할 수 없거나 메시지 전송에 실패한 경우 다음을 확인하세요:

1. Gateway 실행 중: `clawdbot gateway status`
2. 포트가 올바른지 확인: `http://127.0.0.1:18789` 액세스 확인(`localhost:18789`가 아님)
3. 인증 구성: `clawdbot config get gateway.auth.*`
4. 자세한 로그 보기: `clawdbot gateway --verbose`
:::

---

## 함정 경고

### ❌ Gateway 시작되지 않음

**잘못된 방법**:
```
http://localhost:18789에 직접 액세스
## 결과: 연결 실패 또는 로드 불가
```

**올바른 방법**:
```bash
## 먼저 Gateway 시작
clawdbot gateway --port 18789

## 그다음 WebChat 액세스
open http://localhost:18789
```

::: warning Gateway가 먼저 시작되어야 함
WebChat은 Gateway의 WebSocket 서비스에 의존합니다. 실행 중인 Gateway가 없으면 WebChat이 정상적으로 작동하지 않습니다.
:::

### ❌ 포트 구성 오류

**잘못된 방법**:
```
http://localhost:8888에 액세스
## Gateway가 실제로 18789 포트에서 실행 중
## 결과: 연결 거부됨
```

**올바른 방법**:
```bash
## 1. Gateway 실제 포트 확인
clawdbot config get gateway.port

## 2. 올바른 포트로 액세스
open http://localhost:<gateway.port>
```

### ❌ 인증 구성 누락

**잘못된 방법**:
```
gateway.auth.mode 또는 토큰 설정 안 함
## 결과: WebChat에서 인증 실패 프롬프트
```

**올바른 방법**:
```bash
## 토큰 인증 설정(권장)
clawdbot config set gateway.auth.mode token
clawdbot config set gateway.auth.token your-secure-token-here

## Gateway 재시작
clawdbot gateway restart

## WebChat 액세스 시 토큰 입력
```

### ❌ 원격 액세스 구성되지 않음

**잘못된 방법**:
```
로컬에서 원격 서버 IP에 직접 액세스
http://remote-server-ip:18789
## 결과: 연결 시간 초과(방화벽 차단)
```

**올바른 방법**:
```bash
## SSH 터널 사용
ssh -L 18789:localhost:18789 user@remote-server.com

## 또는 Tailscale Serve 사용
clawdbot config set gateway.tailscale.mode serve
clawdbot gateway restart

## 로컬 브라우저에서 액세스
http://localhost:18789
```

---

## 수업 요약

이 수업에서 다음을 배웠습니다:

1. ✅ **WebChat 소개**: Gateway WebSocket 기반의 내장 채팅 인터페이스, 별도 구성 불필요
2. ✅ **액세스 방법**: 브라우저 액세스, macOS 앱, 명령줄 바로가기
3. ✅ **핵심 기능**: 세션 관리, 첨부 파일 업로드, Markdown 지원, 슬래시 명령
4. ✅ **원격 액세스**: SSH 터널 또는 Tailscale를 통해 원격 Gateway 액세스
5. ✅ **인증 구성**: Gateway 인증 모드 이해(token/password/Tailscale)
6. ✅ **문제 해결**: 일반적인 문제 및 해결 방법

**핵심 개념 복습**:

- WebChat은 Gateway와 동일한 포트를 사용하며 별도의 HTTP 서버가 필요 없음
- 기록은 Gateway에서 관리하며 실시간으로 동기화되고 로컬에 캐시되지 않음
- Gateway에 연결할 수 없는 경우 WebChat은 읽기 전용 모드가 됨
- 응답은 WebChat으로 결정적으로 라우팅되며 다른 채널과 다름

**다음 단계**:

- [macOS 앱](../macos-app/)을 살펴보고 메뉴바 제어 및 Voice Wake 기능 이해
- [iOS 노드](../ios-node/)를 학습하여 모바일 장치에서 로컬 작업 실행 구성
- [Canvas 시각화 인터페이스](../../advanced/canvas/)를 이해하고 AI 기반 시각화 워크스페이스 체험

---

## 다음 수업 예고

> 다음 수업에서는 **[macOS 앱](../macos-app/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - macOS 메뉴바 앱의 기능 및 레이아웃
> - Voice Wake 및 Talk Mode 사용
> - WebChat과 macOS 앱의 통합 방식
> - 디버깅 도구 및 원격 Gateway 제어

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능                  | 파일 경로                                                                                    | 행 번호    |
|--- | --- | ---|
| WebChat 원리 설명     | [`docs/web/webchat.md`](https://github.com/clawdbot/clawdbot/blob/main/docs/web/webchat.md) | 전체 파일   |
| Gateway WebSocket API | [`src/gateway/protocol/`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/protocol/) | 전체 디렉토리   |
| chat.send 메서드        | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 296-380  |
| chat.history 메서드     | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 1-295    |
| chat.inject 메서드      | [`src/gateway/server-methods/chat.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-methods/chat.ts) | 381-450  |
| Web UI 진입점         | [`ui/index.html`](https://github.com/clawdbot/clawdbot/blob/main/ui/index.html) | 1-15     |
| Gateway 인증 구성     | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-100    |
| Tailscale 통합       | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 전체 파일   |
| macOS WebChat 통합  | [`apps/macos/`](https://github.com/clawdbot/clawdbot/blob/main/apps/macos/) | 전체 디렉토리   |

**핵심 상수**:
- `INTERNAL_MESSAGE_CHANNEL = "webchat"`: WebChat 내부 메시지 채널 식별자(`src/utils/message-channel.ts:17`에서)

**핵심 구성 항목**:
- `gateway.port`: WebSocket 포트(기본 18789)
- `gateway.auth.mode`: 인증 모드(token/password/tailscale)
- `gateway.auth.token`: 토큰 인증의 토큰 값
- `gateway.auth.password`: 비밀번호 인증의 비밀번호 값
- `gateway.tailscale.mode`: Tailscale 모드(serve/funnel/disabled)
- `gateway.remote.url`: 원격 Gateway의 WebSocket 주소
- `gateway.remote.token`: 원격 Gateway 인증 토큰
- `gateway.remote.password`: 원격 Gateway 인증 비밀번호

**핵심 WebSocket 메서드**:
- `chat.send(message)`: Agent에 메시지 전송(`src/gateway/server-methods/chat.ts`에서)
- `chat.history(sessionId)`: 세션 기록 가져오기(`src/gateway/server-methods/chat.ts`에서)
- `chat.inject(message)`: 시스템 메모를 세션에 직접 주입(Agent 통과 안 함, `src/gateway/server-methods/chat.ts`에서)

**아키텍처 특징**:
- WebChat은 별도의 HTTP 서버나 포트 구성이 필요 없음
- Gateway와 동일한 포트 사용(기본 18789)
- 기록은 Gateway에서 실시간으로 가져오며 로컬에 캐시되지 않음
- 응답은 WebChat으로 결정적으로 라우팅됨(다른 채널과 다름)

</details>
