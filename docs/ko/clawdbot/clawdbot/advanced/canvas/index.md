---
title: "Canvas 시각화 인터페이스와 A2UI | Clawdbot 튜토리얼"
sidebarTitle: "AI를 위한 시각화 인터페이스"
subtitle: "Canvas 시각화 인터페이스와 A2UI"
description: "Clawdbot의 Canvas 시각화 인터페이스를 사용하는 방법을 배웁니다. A2UI 푸시 메커니즘, Canvas Host 구성 및 노드 Canvas 작업을 이해하고, AI 어시스턴트를 위한 대화형 UI를 만듭니다. 이 튜토리얼은 정적 HTML과 동적 A2UI 두 가지 방법을 다루며, canvas 도구의 전체 명령어 참조, 보안 메커니즘, 구성 옵션 및 문제 해결 팁을 포함합니다."
tags:
  - "Canvas"
  - "A2UI"
  - "시각화 인터페이스"
  - "노드"
prerequisite:
  - "start-getting-started"
  - "platforms-ios-node"
  - "platforms-android-node"
order: 240
---

# Canvas 시각화 인터페이스와 A2UI

## 수업 완료 후 할 수 있는 것

이 수업을 완료하면 다음을 수행할 수 있습니다:

- Canvas Host를 구성하고 사용자 정의 HTML/CSS/JS 인터페이스를 배포
- `canvas` 도구를 사용하여 노드 Canvas 제어(표시, 숨기기, 탐색, JS 실행)
- A2UI 프로토콜 마스터로 AI가 동적으로 UI 업데이트 푸시
- Canvas 스크린샷 캡처하여 AI 컨텍스트에 활용
- Canvas 보안 메커니즘 및 액세스 제어 이해

## 현재 상황

AI 어시스턴트가 있지만 텍스트로만 상호작용할 수 있습니다. 다음을 원합니다:

- AI에 표, 차트, 양식 같은 시각화 인터페이스 표시
- 모바일 장치에서 Agent가 생성한 동적 UI 보기
- 별도 개발 없이 "앱" 같은 대화형 경험 만들기

## 언제 이 방법을 사용할까요

**Canvas + A2UI는 다음 시나리오에 적합합니다**:

| 시나리오 | 예시 |
| ------ | ------ |
| **데이터 시각화** | 통계 차트, 진행률 표시줄, 타임라인 표시 |
| **대화형 양식** | 사용자에게 작업 확인 또는 옵션 선택 요청 |
| **상태 패널** | 실시간 작업 진행률 및 시스템 상태 표시 |
| **게임 및 엔터테인먼트** | 간단한 미니게임, 대화형 데모 |

::: tip A2UI vs. 정적 HTML
- **A2UI**(Agent-to-UI): AI가 동적으로 UI를 생성 및 업데이트, 실시간 데이터에 적합
- **정적 HTML**: 미리 작성된 인터페이스, 고정 레이아웃 및 복잡한 상호작용에 적합
:::

## 🎒 시작 전 준비사항

시작하기 전에 다음이 완료되었는지 확인하세요:

- [ ] **Gateway가 실행 중**: Canvas Host는 기본적으로 Gateway와 함께 자동 시작(포트 18793)
- [ ] **노드가 페어링됨**: macOS/iOS/Android 노드가 Gateway에 연결됨
- [ ] **노드가 Canvas 지원**: 노드에 `canvas` 기능이 있는지 확인(`clawdbot nodes list`)

::: warning 전제 지식
이 튜토리얼은 다음을 이미 알고 있다고 가정합니다:
- [노드 페어링 기초](../../platforms/android-node/)
- [AI 도구 호출 메커니즘](../tools-browser/)
:::

## 핵심 개념

Canvas 시스템에는 세 가지 핵심 구성 요소가 포함됩니다:

```
┌─────────────────┐
│   Canvas Host  │ ────▶ HTTP 서버 (포트 18793)
│   (Gateway)   │        └── ~/clawd/canvas/ 파일 제공
└─────────────────┘
        │
        │ WebSocket 통신
        │
┌─────────────────┐
│    Node App   │ ────▶ WKWebView가 Canvas 렌더링
│ (iOS/Android) │        └── A2UI를 통해 푸시 수신
└─────────────────┘
        │
        │ userAction 이벤트
        │
┌─────────────────┐
│   AI Agent    │ ────▶ canvas 도구 호출
│  (pi-mono)   │        └── A2UI 업데이트 푸시
└─────────────────┘
```

**핵심 개념**:

1. **Canvas Host**(Gateway 측)
   - 정적 파일 제공: `http://<gateway-host>:18793/__clawdbot__/canvas/`
   - A2UI 호스트 호스팅: `http://<gateway-host>:18793/__clawdbot__/a2ui/`
   - 핫 리로드 지원: 파일 변경 후 자동 새로고침

2. **Canvas Panel**(노드 측)
   - macOS/iOS/Android 노드에 WKWebView가 내장됨
   - WebSocket을 통해 Gateway에 연결(실시간 리로드, A2UI 통신)
   - `eval`로 JS 실행, `snapshot`으로 화면 캡처 지원

3. **A2UI 프로토콜**(v0.8)
   - Agent가 WebSocket을 통해 UI 업데이트 푸시
   - 지원: `beginRendering`, `surfaceUpdate`, `dataModelUpdate`, `deleteSurface`

## 따라해보기

### 1단계: Canvas Host 상태 확인

**이유**
Canvas Host가 실행 중인지 확인하여 노드가 Canvas 콘텐츠를 로드할 수 있도록 합니다.

```bash
# 포트 18793이 수신 대기 중인지 확인
lsof -i :18793
```

**다음이 표시되어야 합니다**:

```text
COMMAND   PID   USER   FD   TYPE   DEVICE SIZE/OFF NODE NAME
node     12345  user   16u  IPv6  0x1234      0t0  TCP *:18793 (LISTEN)
```

::: info 구성 경로
- **Canvas 루트 디렉토리**: `~/clawd/canvas/`(`canvasHost.root`로 수정 가능)
- **포트**: `18793` = `gateway.port + 4`(`canvasHost.port`로 수정 가능)
- **핫 리로드**: 기본적으로 활성화(`canvasHost.liveReload: false`로 비활성화)
:::

### 2단계: 첫 번째 Canvas 페이지 만들기

**이유**
사용자 정의 HTML 인터페이스를 만들어 노드에 콘텐츠를 표시합니다.

```bash
# Canvas 루트 디렉토리 생성(존재하지 않는 경우)
mkdir -p ~/clawd/canvas

# 간단한 HTML 파일 생성
cat > ~/clawd/canvas/hello.html <<'EOF'
<!doctype html>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Hello Canvas</title>
<style>
  body {
    font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
    padding: 20px;
    background: #000;
    color: #fff;
    text-align: center;
  }
  h1 { color: #24e08a; }
</style>
<h1>🎉 Hello from Canvas!</h1>
<p>이것은 첫 번째 Canvas 페이지입니다.</p>
<button onclick="alert('버튼이 클릭되었습니다!')">클릭해보세요</button>
EOF
```

**다음이 표시되어야 합니다**:

```text
파일이 생성되었습니다: ~/clawd/canvas/hello.html
```

### 3단계: 노드에서 Canvas 표시

**이유**
방금 만든 페이지를 노드에 로드하고 표시합니다.

먼저 노드 ID를 찾습니다:

```bash
clawdbot nodes list
```

**다음이 표시되어야 합니다**:

```text
ID                                  Name          Type       Capabilities
──────────────────────────────────────────────────────────────────────────
abc123-def456-ghi789               iOS Phone     canvas, camera, screen
jkl012-mno345-pqr678               Android Tab   canvas, camera
```

그런 다음 Canvas를 표시합니다(iOS 노드를 예로 사용):

```bash
# 방법 1: CLI 명령어 사용
clawdbot nodes canvas present --node abc123-def456-ghi789 --target http://127.0.0.1:18793/__clawdbot__/canvas/hello.html
```

**다음이 표시되어야 합니다**:

- iOS 장치에 테두리가 없는 패널이 팝업되고 HTML 콘텐츠가 표시됩니다
- 패널은 메뉴 막대나 마우스 위치 근처에 표시됩니다
- 콘텐츠는 중앙 정렬되고 녹색 제목과 버튼이 표시됩니다

**AI 호출 예시**:

```
AI: iOS 장치에서 Canvas 패널을 열어 환영 페이지를 표시했습니다.
```

::: tip URL 형식
- **로컬 파일**: `http://<gateway-host>:18793/__clawdbot__/canvas/hello.html`
- **외부 URL**: `https://example.com`(노드에 네트워크 액세스 권한 필요)
- **기본으로 돌아가기**: `/` 또는 빈 문자열, 기본 스캐폴딩 페이지 표시
:::

### 4단계: A2UI로 동적 UI 푸시

**이유**
AI가 파일을 수정하지 않고 Canvas에 직접 UI 업데이트를 푸시할 수 있어 실시간 데이터 및 상호작용에 적합합니다.

**방법 A: 빠른 텍스트 푸시**

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --text "Hello from A2UI"
```

**다음이 표시되어야 합니다**:

- Canvas에 파란색 A2UI 인터페이스가 표시됩니다
- 텍스트가 중앙에 표시됩니다: `Hello from A2UI`

**방법 B: 전체 JSONL 푸시**

A2UI 정의 파일을 만듭니다:

```bash
cat > /tmp/a2ui-demo.jsonl <<'EOF'
{"surfaceUpdate":{"surfaceId":"main","components":[{"id":"root","component":{"Column":{"children":{"explicitList":["title","status","button"]}}}},{"id":"title","component":{"Text":{"text":{"literalString":"A2UI 데모"},"usageHint":"h1"}}},{"id":"status","component":{"Text":{"text":{"literalString":"시스템 상태: 실행 중"},"usageHint":"body"}}},{"id":"button","component":{"Button":{"label":{"literalString":"테스트 버튼"},"onClick":{"action":{"name":"testAction","sourceComponentId":"demo.test"}}}}}]}
{"beginRendering":{"surfaceId":"main","root":"root"}}
EOF
```

A2UI를 푸시합니다:

```bash
clawdbot nodes canvas a2ui push --node abc123-def456-ghi789 --jsonl /tmp/a2ui-demo.jsonl
```

**다음이 표시되어야 합니다**:

```
┌────────────────────────────┐
│     A2UI 데모         │
│                        │
│  시스템 상태: 실행 중       │
│                        │
│   [ 테스트 버튼 ]          │
└────────────────────────────┘
```

::: details A2UI JSONL 형식 설명
JSONL(JSON Lines)는 각 줄에 하나의 JSON 객체를 포함하며 스트리밍 업데이트에 적합합니다:

```jsonl
{"surfaceUpdate":{...}}   // 표면 컴포넌트 업데이트
{"beginRendering":{...}}   // 렌더링 시작
{"dataModelUpdate":{...}} // 데이터 모델 업데이트
{"deleteSurface":{...}}   // 표면 삭제
```
:::

### 5단계: Canvas JavaScript 실행

**이유**
Canvas에서 사용자 정의 JS를 실행하여 DOM 수정, 상태 읽기 등을 수행합니다.

```bash
clawdbot nodes canvas eval --node abc123-def456-ghi789 --js "document.title"
```

**다음이 표시되어야 합니다**:

```text
"Hello from Canvas"
```

::: tip JS 실행 예시
- 요소 읽기: `document.querySelector('h1').textContent`
- 스타일 수정: `document.body.style.background = '#333'`
- 값 계산: `innerWidth + 'x' + innerHeight`
- 클로저 실행: `(() => { ... })()`
:::

### 6단계: Canvas 스크린샷 캡처

**이유**
AI가 현재 Canvas 상태를 볼 수 있게 하여 컨텍스트 이해에 활용합니다.

```bash
# 기본 형식(JPEG)
clawdbot nodes canvas snapshot --node abc123-def456-ghi789

# PNG 형식 + 최대 너비 제한
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format png --max-width 1200

# 고품질 JPEG
clawdbot nodes canvas snapshot --node abc123-def456-ghi789 --format jpg --quality 0.9
```

**다음이 표시되어야 합니다**:

```text
Canvas snapshot saved to: /var/folders/.../canvas-snapshot.jpg
```

파일 경로는 시스템에 의해 자동 생성되며, 일반적으로 임시 디렉토리에 저장됩니다.

### 7단계: Canvas 숨기기

**이유**
Canvas 패널을 닫아 화면 공간을 확보합니다.

```bash
clawdbot nodes canvas hide --node abc123-def456-ghi789
```

**다음이 표시되어야 합니다**:

- iOS 장치의 Canvas 패널이 사라집니다
- 노드 상태가 복구됩니다(이전에 사용 중이었던 경우)

## 체크포인트 ✅

**Canvas 기능이 정상 작동하는지 확인**:

| 항목 | 확인 방법 |
| ------- | -------- |
| Canvas Host 실행 중 | `lsof -i :18793`에 출력이 있음 |
| 노드 Canvas 기능 | `clawdbot nodes list`에 `canvas` 표시됨 |
| 페이지 로드 성공 | 노드에 HTML 콘텐츠 표시됨 |
| A2UI 푸시 성공 | Canvas에 파란색 A2UI 인터페이스 표시됨 |
| JS 실행 결과 반환 | `eval` 명령어가 값을 반환함 |
| 스크린샷 생성됨 | 임시 디렉토리에 `.jpg` 또는 `.png` 파일 있음 |

## 주의사항

::: warning 포그라운드/백그라운드 제한
- **iOS/Android 노드**: `canvas.*` 및 `camera.*` 명령어는**포그라운드에서 실행해야 합니다**
- 백그라운드 호출 시 다음 반환: `NODE_BACKGROUND_UNAVAILABLE`
- 해결 방법: 장치를 포그라운드로 깨우기
:::

::: danger 보안 주의사항
- **디렉토리 순회 보호**: Canvas URL은 `..`에 의한 상위 디렉토리 액세스를 금지
- **사용자 정의 스킴**: `clawdbot-canvas://`는 노드 내부에서만 사용 제한
- **HTTPS 제한**: 외부 HTTPS URL은 노드 네트워크 권한 필요
- **파일 액세스**: Canvas Host는 `canvasHost.root` 아래의 파일만 액세스 허용
:::

::: tip 디버깅 팁
- **Gateway 로그 보기**: `clawdbot gateway logs`
- **노드 로그 보기**: iOS 설정 → Debug Logs, Android 앱 내 로그
- **URL 테스트**: 브라우저에서 직접 `http://<gateway-host>:18793/__clawdbot__/canvas/` 접근
:::

## 수업 요약

이 수업에서 다음을 배웠습니다:

1. **Canvas 아키텍처**: Canvas Host, Node App 및 A2UI 프로토콜 간의 관계 이해
2. **Canvas Host 구성**: 루트 디렉토리, 포트, 핫 리로드 설정 조정
3. **사용자 정의 페이지 만들기**: HTML/CSS/JS 작성 및 노드에 배포
4. **A2UI 사용**: JSONL을 통한 동적 UI 업데이트 푸시
5. **JavaScript 실행**: Canvas에서 코드 실행, 상태 읽기 및 수정
6. **스크린샷 캡처**: AI에 현재 Canvas 상태 인식시키기

**핵심 요점**:

- Canvas Host는 Gateway와 함께 자동 시작되며 추가 구성 불필요
- A2UI는 실시간 데이터에 적합하고 정적 HTML은 복잡한 상호작용에 적합
- 노드는 포그라운드에서 실행 중인 경우에만 Canvas 작업 가능
- `canvas snapshot`을 사용하여 UI 상태를 AI에 전달

## 다음 수업 예고

> 다음 수업에서는 **[음성 웨이크업 및 텍스트 음성 변환](../voice-tts/)**을 학습합니다.
>
> 학습 내용:
> - Voice Wake 웨이크업 키워드 구성
> - Talk Mode를 사용한 지속적인 음성 대화
> - 다양한 TTS 제공자 통합(Edge, Deepgram, ElevenLabs)

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능 | 파일 경로 | 줄 번호 |
| ----- | --------- | ---- |
| Canvas Host 서버 | [`src/canvas-host/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/server.ts) | 372-441 |
| A2UI 프로토콜 처리 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 150-203 |
| Canvas 도구 정의 | [`src/agents/tools/canvas-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/canvas-tool.ts) | 52-179 |
| Canvas 경로 상수 | [`src/canvas-host/a2ui.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/canvas-host/a2ui.ts) | 8-10 |

**주요 상수**:
- `A2UI_PATH = "/__clawdbot__/a2ui"`: A2UI 호스트 경로
- `CANVAS_HOST_PATH = "/__clawdbot__/canvas"`: Canvas 파일 경로
- `CANVAS_WS_PATH = "/__clawdbot__/ws"`: WebSocket 핫 리로드 경로

**주요 함수**:
- `createCanvasHost()`: Canvas HTTP 서버 시작(포트 18793)
- `injectCanvasLiveReload()`: HTML에 WebSocket 핫 리로드 스크립트 주입
- `handleA2uiHttpRequest()`: A2UI 리소스 요청 처리
- `createCanvasTool()`: `canvas` 도구 등록(present/hide/navigate/eval/snapshot/a2ui_push/a2ui_reset)

**지원되는 Canvas Actions**:
- `present`: Canvas 표시(선택적 URL, 위치, 크기)
- `hide`: Canvas 숨기기
- `navigate`: URL로 탐색(로컬 경로/HTTP/file://)
- `eval`: JavaScript 실행
- `snapshot`: 스크린샷 캡처(PNG/JPEG, 선택적 maxWidth/quality)
- `a2ui_push`: A2UI 업데이트 푸시(JSONL 또는 텍스트)
- `a2ui_reset`: A2UI 상태 재설정

**구성 Schema**:
- `canvasHost.root`: Canvas 루트 디렉토리(기본값 `~/clawd/canvas`)
- `canvasHost.port`: HTTP 포트(기본값 18793)
- `canvasHost.liveReload`: 핫 리로드 활성화 여부(기본값 true)
- `canvasHost.enabled`: Canvas Host 활성화 여부(기본값 true)

**A2UI v0.8에서 지원하는 메시지**:
- `beginRendering`: 지정된 표면 렌더링 시작
- `surfaceUpdate`: 표면 컴포넌트 업데이트(Column, Text, Button 등)
- `dataModelUpdate`: 데이터 모델 업데이트
- `deleteSurface`: 지정된 표면 삭제

</details>
