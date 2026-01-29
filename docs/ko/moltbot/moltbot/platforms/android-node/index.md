---
title: "Android 노드: 기기 로컬 작업 구성 | Clawdbot 튜토리얼"
sidebarTitle: "AI로 휴대폰 제어하기"
subtitle: "Android 노드: 기기 로컬 작업 구성 | Clawdbot 튜토리얼"
description: "Android 노드를 구성하여 기기 로컬 작업(Camera, Canvas, Screen)을 실행하는 방법을 배웁니다. 이 튜토리얼은 Android 노드의 연결 절차, 페어링 메커니즘 및 사용 가능한 명령을 소개합니다."
tags:
  - "Android"
  - "노드"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Android 노드: 기기 로컬 작업 구성

## 학습 후 할 수 있는 것

- Android 기기를 Gateway에 연결하여 노드로 기기 로컬 작업 실행
- AI 어시스턴트로 Android 기기의 카메라로 사진 및 비디오 촬영 제어
- Canvas 시각화 인터페이스를 사용하여 Android에 실시간 콘텐츠 표시
- 화면 녹화, 위치 가져오기 및 SMS 발송 기능 관리

## 현재 겪고 있는 문제

AI 어시스턴트가 Android 기기에 접근할 수 있도록 하고 싶습니다—사진 촬영, 비디오 녹화, Canvas 인터페이스 표시—하지만 기기를 Gateway에 안전하게 연결하는 방법을 모릅니다.

Android 앱을 직접 설치하면 Gateway를 발견하지 못하거나, 구성 후 페어링에 실패할 수 있습니다. 명확한 연결 절차가 필요합니다.

## 이 방법을 사용할 때

- **기기 로컬 작업 필요**: AI 어시스턴트로 Android 기기가 로컬 작업(사진 촬영, 비디오 녹화, 화면 녹화)을 실행하도록 하려는 경우
- **네트워크 간 액세스**: Android 기기와 Gateway가 다른 네트워크에 있고 Tailscale을 통해 연결해야 하는 경우
- **Canvas 시각화**: Android에 AI가 생성한 실시간 HTML/CSS/JS 인터페이스를 표시해야 하는 경우

## 🎒 시작 전 준비

::: warning 사전 요구사항

시작하기 전에 다음을 확인하십시오:

- ✅ **Gateway가 설치되어 실행 중**: macOS, Linux 또는 Windows (WSL2)에서 Gateway 실행
- ✅ **Android 기기 사용 가능**: Android 8.0+ 기기 또는 에뮬레이터
- ✅ **네트워크 연결 정상**: Android 기기에서 Gateway의 WebSocket 포트(기본값 18789)에 액세스 가능
- ✅ **CLI 사용 가능**: Gateway 호스트에서 `clawdbot` 명령을 사용할 수 있음

:::

## 핵심 개념

**Android 노드**는 companion app(컴패니언 앱)으로, WebSocket을 통해 Gateway에 연결하고 AI 어시스턴트가 사용할 수 있는 기기 로컬 작업 기능을 노출합니다.

### 아키텍처 개요

```
Android 기기(노드 앱)
        ↓
    WebSocket 연결
        ↓
    Gateway(제어 평면)
        ↓
    AI 어시스턴트 + 도구 호출
```

**핵심 사항**:
- Android는 Gateway를 **호스팅하지 않고**, 실행 중인 Gateway에 노드로만 연결
- 모든 명령은 Gateway의 `node.invoke` 메서드를 통해 Android 노드로 라우팅
- 노드는 액세스 권한을 얻기 위해 페어링(pairing) 필요

### 지원되는 기능

Android 노드는 다음 기기 로컬 작업을 지원합니다:

| 기능 | 명령 | 설명 |
|--- | --- | ---|
| **Canvas** | `canvas.*` | 실시간 시각화 인터페이스 표시(A2UI) |
| **Camera** | `camera.*` | 사진 촬영(JPG) 및 비디오 녹화(MP4) |
| **Screen** | `screen.*` | 화면 녹화 |
| **Location** | `location.*` | GPS 위치 가져오기 |
| **SMS** | `sms.*` | SMS 발송 |

::: tip 포그라운드 제한

모든 기기 로컬 작업(Canvas, Camera, Screen)은 Android 앱이 **포그라운드 실행 상태**여야 합니다. 백그라운드 호출은 `NODE_BACKGROUND_UNAVAILABLE` 오류를 반환합니다.

:::

## 함께 따라하기

### 1단계: Gateway 시작

**이유**
Android 노드는 작동하려면 실행 중인 Gateway에 연결해야 합니다. Gateway는 WebSocket 제어 평면과 페어링 서비스를 제공합니다.

```bash
clawdbot gateway --port 18789 --verbose
```

**다음을 확인해야 합니다**:
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Tailscale 모드(권장)

Gateway와 Android 기기가 다른 네트워크에 있지만 Tailscale을 통해 연결된 경우, Gateway를 tailnet IP에 바인딩합니다:

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

Gateway를 재시작한 후, Android 노드는 Wide-Area Bonjour를 통해 발견할 수 있습니다.

:::

### 2단계: 발견 확인(선택 사항)

**이유**
Gateway의 Bonjour/mDNS 서비스가 정상적으로 작동하는지 확인하여 Android 앱이 쉽게 발견할 수 있도록 합니다.

Gateway 호스트에서 다음을 실행합니다:

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**다음을 확인해야 합니다**:
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

유사한 출력이 표시되면 Gateway가 발견 서비스를 광고 중입니다.

::: details Bonjour 문제 디버깅

발견에 실패한 경우 가능한 원인:

- **mDNS 차단됨**: 일부 Wi-Fi 네트워크에서 mDNS를 비활성화
- **방화벽**: UDP 포트 5353 차단
- **네트워크 격리**: 기기가 다른 VLAN 또는 서브넷에 있음

해결 방법: Tailscale + Wide-Area Bonjour 사용 또는 Gateway 주소 수동 구성.

:::

### 3단계: Android에서 연결

**이유**
Android 앱은 mDNS/NSD를 통해 Gateway를 발견하고 WebSocket 연결을 설정합니다.

Android 앱에서:

1. **설정**(Settings) 열기
2. **Discovered Gateways**에서 Gateway 선택
3. **Connect** 클릭

**mDNS가 차단된 경우**:
- **Advanced → Manual Gateway**로 이동
- Gateway의 **호스트 이름과 포트** 입력(예: `192.168.1.100:18789`)
- **Connect (Manual)** 클릭

::: tip 자동 재연결

최초 페어링 성공 후, Android 앱은 시작 시 자동으로 재연결합니다:
- 수동 엔드포인트가 활성화된 경우 수동 엔드포인트 사용
- 그렇지 않으면 마지막으로 발견된 Gateway 사용(최선을 다해)

:::

**체크포인트 ✅**
- Android 앱이 "Connected" 상태 표시
- 앱이 Gateway의 표시 이름 표시
- 앱이 페어링 상태(Pending 또는 Paired) 표시

### 4단계: 페어링 승인(CLI)

**이유**
Gateway는 노드의 페어링 요청을 승인해야 노드에 액세스 권한을 부여할 수 있습니다.

Gateway 호스트에서:

```bash
# 대기 중인 페어링 요청 보기
clawdbot nodes pending

# 페어링 승인
clawdbot nodes approve <requestId>
```

::: details 페어링 절차

Gateway-owned 페어링 워크플로우:

1. Android 노드가 Gateway에 연결하고 페어링 요청
2. Gateway가 **pending request**를 저장하고 `node.pair.requested` 이벤트 발생
3. CLI를 통해 요청 승인 또는 거부
4. 승인 후, Gateway가 새로운 **auth token** 발급
5. Android 노드가 token을 사용하여 재연결하고 "paired" 상태로 변경

Pending 요청은 **5분** 후 자동으로 만료됩니다.

:::

**다음을 확인해야 합니다**:
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

Android 앱이 자동으로 재연결되고 "Paired" 상태를 표시합니다.

### 5단계: 노드 연결 확인

**이유**
Android 노드가 성공적으로 페어링되고 Gateway에 연결되었는지 확인합니다.

CLI를 통해 확인:

```bash
clawdbot nodes status
```

**다음을 확인해야 합니다**:
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

또는 Gateway API를 통해:

```bash
clawdbot gateway call node.list --params '{}'
```

### 6단계: Camera 기능 테스트

**이유**
Android 노드의 Camera 명령이 정상 작동하고 권한이 부여되었는지 확인합니다.

CLI를 통해 사진 촬영 테스트:

```bash
# 사진 촬영(기본 전면 카메라)
clawdbot nodes camera snap --node "android-node"

# 후면 카메라 지정
clawdbot nodes camera snap --node "android-node" --facing back

# 비디오 녹화(3초)
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**다음을 확인해야 합니다**:
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Camera 권한

Android 노드는 다음 런타임 권한이 필요합니다:

- **CAMERA**: `camera.snap` 및 `camera.clip`용
- **RECORD_AUDIO**: `camera.clip`용(`includeAudio=true`인 경우)

Camera 명령을 처음 호출할 때, 앱이 권한 부여를 요청합니다. 거부하면 명령이 `CAMERA_PERMISSION_REQUIRED` 또는 `AUDIO_PERMISSION_REQUIRED` 오류를 반환합니다.

:::

### 7단계: Canvas 기능 테스트

**이유**
Canvas 시각화 인터페이스가 Android 기기에 표시될 수 있는지 확인합니다.

::: info Canvas Host

Canvas는 HTML/CSS/JS 콘텐츠를 제공하는 HTTP 서버가 필요합니다. Gateway는 기본적으로 포트 18793에서 Canvas Host를 실행합니다.

:::

Gateway 호스트에서 Canvas 파일 생성:

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

Android 앱에서 Canvas로 탐색:

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**다음을 확인해야 합니다**:
Android 앱에 "Hello from AI!" 페이지가 표시됩니다.

::: tip Tailscale 환경

Android 기기와 Gateway가 모두 Tailscale 네트워크에 있는 경우, MagicDNS 이름 또는 tailnet IP를 사용하여 `.local`을 대체:

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### 8단계: Screen 및 Location 기능 테스트

**이유**
화면 녹화 및 위치 가져오기 기능이 정상 작동하는지 확인합니다.

화면 녹화:

```bash
# 10초 화면 녹화
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**다음을 확인해야 합니다**:
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

위치 가져오기:

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**다음을 확인해야 합니다**:
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning 권한 요구사항

화면 녹화는 Android **RECORD_AUDIO** 권한(오디오 활성화된 경우)과 포그라운드 액세스가 필요합니다. 위치 가져오기는 **LOCATION** 권한이 필요합니다.

처음 호출할 때 앱이 권한 부여를 요청합니다.

:::

## 문제 해결 팁

### 문제 1: Gateway를 발견할 수 없음

**증상**: Android 앱에서 Gateway가 표시되지 않음

**가능한 원인**:
- Gateway가 시작되지 않았거나 loopback에 바인딩됨
- 네트워크에서 mDNS가 차단됨
- 방화벽이 UDP 5353 포트 차단

**해결 방법**:
1. Gateway 실행 확인: `clawdbot nodes status`
2. 수동 Gateway 주소 사용: Android 앱에서 Gateway IP와 포트 입력
3. Tailscale + Wide-Area Bonjour 구성(권장)

### 문제 2: 페어링 후 연결 실패

**증상**: "Paired"가 표시되지만 연결할 수 없음

**가능한 원인**:
- Token 만료(페어링 후마다 token이 회전됨)
- Gateway가 재시작되었으나 노드가 재연결되지 않음
- 네트워크 변경

**해결 방법**:
1. Android 앱에서 "Reconnect" 수동 클릭
2. Gateway 로그 확인: `bonjour: client disconnected ...`
3. 재페어링: 노드 삭제 후 재승인

### 문제 3: Camera 명령이 권한 오류 반환

**증상**: `camera.snap`이 `CAMERA_PERMISSION_REQUIRED` 반환

**가능한 원인**:
- 사용자가 권한 거부
- 시스템 정책으로 권한 비활성화

**해결 방법**:
1. Android 설정에서 "Clawdbot" 앱 찾기
2. "Permissions"로 이동
3. Camera 및 Microphone 권한 부여
4. Camera 명령 재시도

### 문제 4: 백그라운드 호출 실패

**증상**: 백그라운드 호출이 `NODE_BACKGROUND_UNAVAILABLE` 반환

**원인**: Android 노드는 포그라운드에서만 기기 로컬 명령 호출을 허용

**해결 방법**:
1. 앱이 포그라운드에서 실행 중인지 확인(앱 열기)
2. 시스템 최적화(배터리 최적화)로 인한 앱 확인
3. "절전 모드"의 앱 제한 해제

## 이 강의 요약

이 강의에서는 기기 로컬 작업을 실행하도록 Android 노드를 구성하는 방법을 배웠습니다:

- **연결 절차**: mDNS/NSD 또는 수동 구성을 통해 Android 노드를 Gateway에 연결
- **페어링 메커니즘**: Gateway-owned 페어링을 사용하여 노드 액세스 권한 승인
- **사용 가능한 기능**: Camera, Canvas, Screen, Location, SMS
- **CLI 도구**: `clawdbot nodes` 명령을 사용하여 노드 및 기능 호출 관리
- **권한 요구사항**: Android 앱은 Camera, Audio, Location 등 런타임 권한 필요

**핵심 사항**:
- Android 노드는 companion app이며 Gateway를 호스팅하지 않음
- 모든 기기 로컬 작업은 앱이 포그라운드에서 실행되어야 함
- 페어링 요청은 5분 후 자동으로 만료됨
- Tailscale 네트워크의 Wide-Area Bonjour 발견 지원

## 다음 강의 예고

> 다음 강의에서는 **[Canvas 시각화 인터페이스와 A2UI](../../advanced/canvas/)**를 배웁니다.
>
> 다음 내용을 배우게 됩니다:
> - Canvas A2UI 푸시 메커니즘
> - Canvas에 실시간 콘텐츠 표시 방법
> - Canvas 명령 전체 목록

---

## 부록: 소스코드 참조

<details>
<summary><strong>소스코드 위치 보기 클릭</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능        | 파일路径                                                                                    | 행번    |
|--- | --- | ---|
| 노드 명령 정책 | [`src/gateway/node-command-policy.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| 노드 프로토콜 스키마 | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Android 문서  | [`docs/platforms/android.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/android.md) | 1-142   |
| 노드 CLI  | [`docs/cli/nodes.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/nodes.md) | 1-69    |

**핵심 상수**:
- `PLATFORM_DEFAULTS`: 각 플랫폼에서 지원하는 명령 목록 정의(`node-command-policy.ts:32-58`)
- Android에서 지원하는 명령: Canvas, Camera, Screen, Location, SMS(`node-command-policy.ts:34-40`)

**핵심 함수**:
- `resolveNodeCommandAllowlist()`: 플랫폼별 허용된 명령 목록 해석(`node-command-policy.ts:77-91`)
- `normalizePlatformId()`: 플랫폼 ID 정규화(`node-command-policy.ts:60-75`)

**Android 노드 특징**:
- 클라이언트 ID: `clawdbot-android`(`gateway/protocol/client-info.ts:9`)
- 기기 패밀리 감지: `deviceFamily` 필드로 Android 식별(`node-command-policy.ts:70`)
- 기본적으로 Canvas 및 Camera 기능 활성화(`docs/platforms/android.md`)

</details>
