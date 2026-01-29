---
title: "iOS 노드 구성: Gateway 및 카메라 Canvas Voice Wake 연결 | Clawdbot 튜토리얼"
sidebarTitle: "AI가 iPhone 활용"
subtitle: "iOS 노드 구성 가이드"
description: "Gateway에 연결하도록 iOS 노드를 구성하는 방법을 학습합니다. 카메라로 사진 촬영, Canvas 시각화 인터페이스, Voice Wake 음성 깨우기, Talk Mode 연속 대화, 위치 정보 가져오기 등 장치 로컬 작업 기능을 사용합니다. Bonjour와 Tailscale을 통해 자동 검색, 페어링 인증 및 보안 제어 후 다중 장치 AI 협업을 구현합니다. 전경/백그라운드 및 권한 관리를 지원합니다."
tags:
  - "iOS 노드"
  - "장치 노드"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "start-gateway-startup"
order: 170
---

# iOS 노드 구성 가이드

## 학습 후 할 수 있는 작업

iOS 노드를 구성하면 다음 작업을 수행할 수 있습니다.

- ✅ AI 어시스턴트가 iOS 장치의 카메라를 사용하여 사진을 찍거나 비디오를 녹화
- ✅ iOS 장치에서 Canvas 시각화 인터페이스 렌더링
- ✅ Voice Wake 및 Talk Mode를 사용하여 음성 상호작용
- ✅ iOS 장치의 위치 정보 가져오기
- ✅ Gateway를 통해 여러 장치 노드를 통합 관리

## 현재 겪고 있는 문제

iOS 장치에서 AI 어시스턴트의 기능을 확장하여 다음 작업을 수행하기를 원합니다.

- **카메라로 사진 촬영 또는 비디오 녹화**: "사진 찍어"라고 말하면 AI가 자동으로 iPhone으로 사진을 찍습니다.
- **시각화 인터페이스 표시**: iPhone에 AI가 생성한 차트, 양식 또는 제어 패널 표시
- **음성 깨우기 및 연속 대화**: 손을 사용하지 않고 "Clawd"라고 말하기만 하면 어시스턴트가 깨어나 대화를 시작합니다.
- **장치 정보 가져오기**: AI가 위치, 화면 상태 등의 정보를 인식하도록 합니다.

## 언제 사용해야 하나요?

- **모바일 시나리오**: AI가 iPhone의 카메라, 화면 등의 기능을 사용하기를 원하는 경우
- **다중 장치 협업**: Gateway가 서버에서 실행되지만 로컬 장치 기능을 호출해야 하는 경우
- **음성 상호작용**: iPhone을 휴대용 음성 어시스턴트 단말기로 사용하고 싶은 경우

::: info iOS 노드란 무엇인가요?
iOS 노드는 iPhone/iPad에서 실행되는 Companion 앱으로, Clawdbot Gateway에 WebSocket을 통해 연결합니다. Gateway 자체가 아니라 "주변 장치"로서 장치 로컬 작업 기능을 제공합니다.

**Gateway와의 차이점**:
- **Gateway**: 서버/macOS에서 실행되며, 메시지 라우팅, AI 모델 호출, 도구 배포를 담당합니다.
- **iOS 노드**: iPhone에서 실행되며, 장치 로컬 작업(카메라, Canvas, 위치 등)을 수행합니다.
:::

---

## 🎒 시작 전 준비

::: warning 전제 조건

시작하기 전에 다음을 확인하세요.

1. **Gateway가 시작되고 실행 중**
   - Gateway가 다른 장치(macOS, Linux 또는 WSL2를 통한 Windows)에서 실행되는지 확인
   - Gateway가 액세스 가능한 네트워크 주소(LAN 또는 Tailscale)에 바인딩되어 있는지 확인

2. **네트워크 연결성**
   - iOS 장치와 Gateway가 동일한 LAN(권장)에 있거나 Tailscale을 통해 연결되어 있는지 확인
   - iOS 장치에서 Gateway의 IP 주소와 포트(기본값 18789)에 액세스할 수 있는지 확인

3. **iOS 앱 획득**
   - iOS 앱은 현재 **내부 프리뷰 버전**이며 공개 배포되지 않습니다.
   - 소스 코드에서 빌드하거나 TestFlight 테스트 버전을 받아야 합니다.
:::

## 핵심 개념

iOS 노드의 작업 흐름:

```
[Gateway] ←→ [iOS 노드]
     ↓            ↓
  [AI 모델]   [장치 기능]
     ↓            ↓
  [결정 실행]   [카메라/Canvas/음성]
```

**핵심 기술 포인트**:

1. **자동 검색**: Bonjour(LAN) 또는 Tailscale(네트워크 간)을 통해 Gateway를 자동으로 검색합니다.
2. **페어링 인증**: 첫 연결 시 Gateway 측에서 수동 승인이 필요하며 신뢰 관계를 설정합니다.
3. **프로토콜 통신**: WebSocket 프로토콜(`node.invoke`)을 사용하여 명령을 보냅니다.
4. **권한 제어**: 장치 로컬 명령은 사용자 승인이 필요합니다(카메라, 위치 등).

**아키텍처 특징**:

- **보안**: 모든 장치 작업은 iOS 측에서 명시적인 사용자 승인이 필요합니다.
- **격리성**: 노드는 Gateway를 실행하지 않으며 로컬 작업만 수행합니다.
- **유연성**: 전경, 백그라운드, 원격 등 다양한 사용 시나리오를 지원합니다.

---

## 함께 따라하기

### 1단계: Gateway 시작

Gateway 호스트에서 서비스를 시작하세요:

```bash
clawdbot gateway --port 18789
```

**다음을 볼 수 있어야 합니다**:

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip 네트워크 간 액세스
Gateway와 iOS 장치가 동일한 LAN에 있지 않은 경우 **Tailscale Serve/Funnel**을 사용하세요:

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

iOS 장치는 Tailscale을 통해 Gateway를 자동으로 검색합니다.
:::

### 2단계: iOS 앱 연결

iOS 앱에서:

1. **설정(Settings)**을 엽니다.
2. **Gateway** 섹션을 찾습니다.
3. 자동으로 검색된 Gateway를 선택하거나 아래에서 **Manual Host**를 사용하여 호스트와 포트를 수동으로 입력합니다.

**다음을 볼 수 있어야 합니다**:

- 앱이 Gateway에 연결을 시도합니다.
- 상태가 "Connected" 또는 "Pairing pending"으로 표시됩니다.

::: details 수동 호스트 구성

자동 검색이 실패한 경우 수동으로 Gateway 주소를 입력하세요:

1. **Manual Host**를 활성화합니다.
2. Gateway 호스트(예: `192.168.1.100`)를 입력합니다.
3. 포트(기본값 `18789`)를 입력합니다.
4. "Connect"를 탭합니다.

:::

### 3단계: 페어링 요청 승인

**Gateway 호스트에서** iOS 노드의 페어링 요청을 승인하세요:

```bash
# 승인 대기 중인 노드 보기
clawdbot nodes pending

# 특정 노드 승인(<requestId>로 대체)
clawdbot nodes approve <requestId>
```

**다음을 볼 수 있어야 합니다**:

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip 페어링 거부
특정 노드의 연결 요청을 거부하려는 경우:

```bash
clawdbot nodes reject <requestId>
```

:::

**체크포인트 ✅**: Gateway에서 노드 상태를 확인합니다.

```bash
clawdbot nodes status
```

iOS 노드가 `paired` 상태로 표시되어야 합니다.

### 4단계: 노드 연결 테스트

**Gateway에서 노드 통신 테스트**:

```bash
# Gateway를 통해 노드 명령 호출
clawdbot gateway call node.list --params "{}"
```

**다음을 볼 수 있어야 합니다**:

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## 노드 기능 사용

### 카메라로 사진 촬영

iOS 노드는 카메라 사진 촬영 및 비디오 녹화를 지원합니다:

```bash
# 사진 촬영(기본 전면 카메라)
clawdbot nodes camera snap --node "iPhone (iOS)"

# 사진 촬영(후면 카메라, 사용자 정의 해상도)
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# 비디오 녹화(5초)
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**다음을 볼 수 있어야 합니다**:

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning 전경 요구사항
카메라 명령은 iOS 앱이 **전경**에 있어야 합니다. 앱이 백그라운드에 있으면 `NODE_BACKGROUND_UNAVAILABLE` 오류가 반환됩니다.

:::

**iOS 카메라 매개변수**:

| 매개변수 | 유형 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `facing` | `front\|back` | `front` | 카메라 방향 |
| `maxWidth` | number | `1600` | 최대 너비(픽셀) |
| `quality` | `0..1` | `0.9` | JPEG 품질(0-1) |
| `durationMs` | number | `3000` | 비디오 길이(밀리초) |
| `includeAudio` | boolean | `true` | 오디오 포함 여부 |

### Canvas 시각화 인터페이스

iOS 노드는 Canvas 시각화 인터페이스를 표시할 수 있습니다:

```bash
# URL로 이동
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# JavaScript 실행
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# 스크린샷(JPEG로 저장)
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**다음을 볼 수 있어야 합니다**:

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip A2UI 자동 푸시
Gateway가 `canvasHost`로 구성된 경우, iOS 노드는 연결 시 자동으로 A2UI 인터페이스로 이동합니다.
:::

### Voice Wake 음성 깨우기

iOS 앱의 **설정(Settings)**에서 Voice Wake를 활성화하세요:

1. **Voice Wake** 스위치를 켭니다.
2. 웨이크 워드(기본값: "clawd", "claude", "computer")를 설정합니다.
3. iOS에서 마이크 권한을 부여했는지 확인합니다.

::: info 전역 웨이크 워드
Clawdbot의 웨이크 워드는 **전역 구성**이며 Gateway에서 관리됩니다. 모든 노드(iOS, Android, macOS)가 동일한 웨이크 워드 목록을 사용합니다.

웨이크 워드를 수정하면 모든 장치에 자동으로 동기화됩니다.
:::

### Talk Mode 연속 대화

Talk Mode를 활성화하면 AI는 TTS를 통해 응답을 계속 읽어주고 음성 입력을 계속 수신합니다:

1. iOS 앱 **설정(Settings)**에서 **Talk Mode**를 활성화합니다.
2. AI 응답 시 자동으로 읽어줍니다.
3. 음성으로 계속 대화할 수 있으며 수동으로 탭할 필요가 없습니다.

::: warning 백그라운드 제한
iOS는 백그라운드 오디오를 일시 중단할 수 있습니다. 앱이 전경에 있지 않을 때 음성 기능은 **최선 노력**(best-effort)입니다.
:::

---

## 자주 묻는 질문

### 페어링 프롬프트가 표시되지 않음

**문제**: iOS 앱에 "Connected"가 표시되지만 Gateway에서 페어링 프롬프트가 표시되지 않습니다.

**해결 방법**:

```bash
# 1. 승인 대기 중인 노드 수동 보기
clawdbot nodes pending

# 2. 노드 승인
clawdbot nodes approve <requestId>

# 3. 연결 확인
clawdbot nodes status
```

### 연결 실패(재설치 후)

**문제**: iOS 앱을 재설치한 후 Gateway에 연결할 수 없습니다.

**원인**: 키체인의 페어링 토큰이 삭제되었습니다.

**해결 방법**: 페어링 절차(3단계)를 다시 수행하세요.

### A2UI_HOST_NOT_CONFIGURED

**문제**: Canvas 명령이 실패하고 `A2UI_HOST_NOT_CONFIGURED` 메시지가 표시됩니다.

**원인**: Gateway가 `canvasHost` URL로 구성되지 않았습니다.

**해결 방법**:

Gateway 구성에서 Canvas 호스트를 설정하세요:

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**문제**: 카메라/Canvas 명령이 실패하고 `NODE_BACKGROUND_UNAVAILABLE`가 반환됩니다.

**원인**: iOS 앱이 전경에 있지 않습니다.

**해결 방법**: iOS 앱을 전경으로 전환한 다음 명령을 다시 시도하세요.

---

## 이 과정 요약

이 과정을 통해 다음을 학습했습니다:

✅ iOS 노드의 개념과 아키텍처
✅ Gateway에 자동으로 검색하고 연결하는 방법
✅ 페어링 인증 절차
✅ 카메라, Canvas, Voice Wake 등의 기능 사용
✅ 일반적인 문제 해결 방법

**핵심 포인트**:

- iOS 노드는 장치 로컬 작업 기능의 제공자이며 Gateway가 아닙니다.
- 모든 장치 작업은 사용자 승인 및 전경 상태가 필요합니다.
- 페어링은 보안의 필수 단계이며 승인된 노드만 신뢰합니다.
- Voice Wake 및 Talk Mode는 마이크 권한이 필요합니다.

## 다음 과정 미리보기

> 다음 과정에서는 **[Android 노드 구성](../android-node/)**을 학습합니다.
>
> 학습할 내용:
> - Gateway에 연결하도록 Android 노드를 구성하는 방법
> - Android 장치의 카메라, 화면 녹화, Canvas 기능 사용
> - Android 고유의 권한 및 호환성 문제 처리

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보려면 클릭하세요</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| iOS 앱 진입점 | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Canvas 렌더링 | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Gateway 연결 | [`apps/ios/Sources/Gateway/`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/Gateway/) | - |
| 노드 프로토콜 runner | [`src/node-host/runner.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| 노드 구성 | [`src/node-host/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/config.ts) | 1-50 |
| iOS 플랫폼 문서 | [`docs/platforms/ios.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/ios.md) | 1-105 |
| 노드 시스템 문서 | [`docs/nodes/index.md`](https://github.com/moltbot/moltbot/blob/main/docs/nodes/index.md) | 1-306 |

**핵심 상수**:
- `GATEWAY_DEFAULT_PORT = 18789`: Gateway 기본 포트
- `NODE_ROLE = "node"`: 노드 연결 역할 식별자

**핵심 명령**:
- `clawdbot nodes pending`: 승인 대기 중인 노드 나열
- `clawdbot nodes approve <requestId>`: 노드 페어링 승인
- `clawdbot nodes invoke --node <id> --command <cmd>`: 노드 명령 호출
- `clawdbot nodes camera snap --node <id>`: 사진 촬영
- `clawdbot nodes canvas navigate --node <id> --target <url>`: Canvas 탐색

**프로토콜 메서드**:
- `node.invoke.request`: 노드 명령 호출 요청
- `node.invoke.result`: 노드 명령 실행 결과
- `voicewake.get`: 웨이크 워드 목록 가져오기
- `voicewake.set`: 웨이크 워드 목록 설정
- `voicewake.changed`: 웨이크 워드 변경 이벤트

</details>
