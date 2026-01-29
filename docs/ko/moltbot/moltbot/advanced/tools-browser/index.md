---
title: "브라우저 자동화 도구: 웹 제어 및 UI 자동화 | Clawdbot 튜토리얼"
sidebarTitle: "5분 만에 브라우저 제어"
subtitle: "브라우저 자동화 도구: 웹 제어 및 UI 자동화 | Clawdbot 튜토리얼"
description: "Clawdbot의 브라우저 도구를 사용하여 웹 자동화, 스크린샷, 양식 작업 및 UI 제어를 수행하는 방법을 배웁니다. 이 튜토리얼은 브라우저 시작, 페이지 스냅샷, UI 상호작용(click/type/drag 등), 파일 업로드, 대화상자 처리 및 원격 브라우저 제어를 다룹니다. Chrome 확장 프로그램 릴레이 모드와 독립 브라우저 구성, iOS/Android 노드에서 브라우저 작업 실행을 포함한 전체 워크플로우를 마스터하세요."
tags:
  - "browser"
  - "automation"
  - "ui"
prerequisite:
  - "start-gateway-startup"
  - "advanced-models-auth"
order: 210
---

# 브라우저 자동화 도구: 웹 제어 및 UI 자동화

## 배운 후 할 수 있는 것

- Clawdbot이 관리하는 브라우저 시작 및 제어
- Chrome 확장 프로그램 릴레이를 사용하여 기존 Chrome 탭 제어
- 웹페이지 스냅샷(AI/ARIA 형식) 및 스크린샷(PNG/JPEG) 촬영
- UI 자동화 작업 수행: 클릭, 텍스트 입력, 드래그, 선택, 양식 작성
- 파일 업로드 및 대화상자(alert/confirm/prompt) 처리
- 원격 브라우저 제어 서버를 통해 분산 브라우저 작업
- 노드 프록시를 사용하여 iOS/Android 장치에서 브라우저 작업 실행

## 현재 문제점

이미 Gateway를 실행하고 AI 모델을 구성했지만, 브라우저 도구 사용에 대해 여전히 궁금한 점이 있습니다:

- AI가 웹페이지 콘텐츠에 액세스할 수 없고 페이지 구조를 설명해야 하나요?
- AI가 자동으로 양식을 작성하고 버튼을 클릭하게 하고 싶지만 방법을 모르나요?
- 스크린샷이나 웹페이지 저장을 하고 싶지만 매번 수동 작업이 필요한가요?
- 새 브라우저를 시작하는 대신 자신의 Chrome 탭(로그인된 세션)을 사용하고 싶나요?
- iOS/Android 노드와 같은 원격 장치에서 브라우저 작업을 실행하고 싶나요?

## 언제 사용하나요

**브라우저 도구 사용 시나리오**:

| 시나리오 | Action | 예시 |
|--- | --- | ---|
| 양식 자동화 | `act` + `fill` | 등록 양식 작성, 주문 제출 |
| 웹 스크래핑 | `snapshot` | 웹페이지 구조 추출, 데이터 수집 |
| 스크린샷 저장 | `screenshot` | 웹페이지 스크린샷 저장, 증거 저장 |
| 파일 업로드 | `upload` | 이력서 업로드, 첨부파일 업로드 |
| 대화상자 처리 | `dialog` | alert/confirm 수락/거부 |
| 기존 세션 사용 | `profile="chrome"` | 로그인된 Chrome 탭에서 작업 |
| 원격 제어 | `target="node"` | iOS/Android 노드에서 실행 |

## 🎒 시작 전 준비

::: warning 사전 확인

브라우저 도구를 사용하기 전에 다음을 확인하세요:

1. ✅ Gateway가 실행 중입니다(`clawdbot gateway start`)
2. ✅ AI 모델이 구성되었습니다(Anthropic / OpenAI / OpenRouter 등)
3. ✅ 브라우저 도구가 활성화되어 있습니다(`browser.enabled=true`)
4. ✅ 사용하려는 target(sandbox/host/custom/node)을 이해하고 있습니다
5. ✅ Chrome 확장 프로그램 릴레이를 사용하는 경우 확장 프로그램이 설치되어 활성화되어 있습니다

:::

## 핵심 개념

**브라우저 도구란 무엇인가요?**

브라우저 도구는 Clawdbot에 내장된 자동화 도구로, AI가 CDP(Chrome DevTools Protocol)를 통해 브라우저를 제어할 수 있습니다:

- **제어 서버**: `http://127.0.0.1:18791`(기본값)
- **UI 자동화**: Playwright 기반 요소 위치 지정 및 작업
- **스냅샷 메커니즘**: AI 형식 또는 ARIA 형식으로 페이지 구조 및 요소 참조 반환
- **다중 타겟 지원**: sandbox(기본값), host(Chrome 릴레이), custom(원격), node(장치 노드)

**두 가지 브라우저 모드**:

| 모드 | Profile | 드라이버 | 설명 |
|--- | --- | --- | ---|
| **독립 브라우저** | `clawd`(기본값) | clawd | Clawdbot이 독립적인 Chrome/Chromium 인스턴스 시작 |
| **Chrome 릴레이** | `chrome` | extension | 기존 Chrome 탭 제어(확장 프로그램 설치 필요) |

**워크플로우**:

```
1. 브라우저 시작(start)
   ↓
2. 탭 열기(open)
   ↓
3. 페이지 스냅샷 가져오기(snapshot) → 요소 참조(ref) 얻기
   ↓
4. UI 작업 수행(act: click/type/fill/drag)
   ↓
5. 결과 확인(screenshot/snapshot)
```

## 단계별 따라하기

### 1단계: 브라우저 시작

**왜 필요한가요**

브라우저 도구를 처음 사용할 때 먼저 브라우저 제어 서버를 시작해야 합니다.

```bash
# 채팅에서 AI에게 브라우저 시작 요청
브라우저를 시작해주세요

# 또는 브라우저 도구 사용
action: start
profile: clawd  # 또는 chrome(Chrome 확장 프로그램 릴레이)
target: sandbox
```

**다음 결과가 표시됩니다**:

```
✓ Browser control server: http://127.0.0.1:18791
✓ Profile: clawd
✓ CDP endpoint: http://127.0.0.1:18792
✓ Headless: false
✓ Color: #FF4500
```

::: tip 체크포인트

- `Browser control server`가 표시되면 시작 성공입니다
- 기본적으로 `clawd` profile을 사용합니다(독립 브라우저)
- Chrome 확장 프로그램 릴레이를 사용하려면 `profile="chrome"`을 사용하세요
- 브라우저 창이 자동으로 열립니다(비 헤드리스 모드)

:::

### 2단계: 웹페이지 열기

**왜 필요한가요**

자동화 작업을 위해 대상 웹페이지를 엽니다.

```bash
# 채팅에서
https://example.com을 열어주세요

# 또는 브라우저 도구 사용
action: open
targetUrl: https://example.com
profile: clawd
target: sandbox
```

**다음 결과가 표시됩니다**:

```
✓ Tab opened: https://example.com
targetId: tab_abc123
url: https://example.com
```

::: tip 요소 참조(targetId)

탭을 열거나 포커스할 때마다 `targetId`가 반환됩니다. 이 ID는 후속 작업(snapshot/act/screenshot)에 사용됩니다.

:::

### 3단계: 페이지 스냅샷 가져오기

**왜 필요한가요**

스냅샷을 통해 AI가 페이지 구조를 이해하고 작업 가능한 요소 참조(ref)를 얻을 수 있습니다.

```bash
# AI 형식 스냅샷 가져오기(기본값)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: ai
refs: aria  # Playwright aria-ref ids 사용(호출 간 안정적)

# 또는 ARIA 형식 스냅샷 가져오기(구조화된 출력)
action: snapshot
profile: clawd
targetId: tab_abc123
snapshotFormat: aria
```

**다음 결과가 표시됩니다**(AI 형식):

```
Page snapshot:

[header]
  Logo [aria-label="Example Logo"]
  Navigation [role="navigation"]
    Home [href="/"] [ref="e1"]
    About [href="/about"] [ref="e2"]
    Contact [href="/contact"] [ref="e3"]

[main]
  Hero section
    Title: "Welcome to Example" [ref="e4"]
    Button: "Get Started" [ref="e5"] [type="primary"]

[form section]
  Login form
    Input: Email [type="email"] [ref="e6"]
    Input: Password [type="password"] [ref="e7"]
    Button: "Sign In" [ref="e8"]
```

::: tip 스냅샷 형식 선택

| 형식 | 용도 | 특징 |
|--- | --- | ---|
| `ai` | 기본값, AI 이해 | 가독성이 좋고 AI 구문 분석에 적합 |
| `aria` | 구조화된 출력 | 정확한 구조가 필요한 시나리오에 적합 |
| `refs="aria"` | 호출 간 안정적 | 다단계 작업(snapshot → act)에 권장 |

:::

### 4단계: UI 작업 수행(act)

**왜 필요한가요**

스냅샷에서 반환된 요소 참조(ref)를 사용하여 자동화 작업을 수행합니다.

```bash
# 버튼 클릭
action: act
request: {
  kind: "click",
  ref: "e5",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 텍스트 입력
action: act
request: {
  kind: "type",
  ref: "e6",
  text: "user@example.com",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 양식 작성(여러 필드)
action: act
request: {
  kind: "fill",
  fields: [
    { ref: "e6", value: "user@example.com" },
    { ref: "e7", value: "password123" }
  ],
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox

# 제출 버튼 클릭
action: act
request: {
  kind: "click",
  ref: "e8",
  targetId: "tab_abc123"
}
profile: clawd
target: sandbox
```

**다음 결과가 표시됩니다**:

```
✓ Clicked ref=e5
✓ Typed "user@example.com" into ref=e6
✓ Typed "password123" into ref=e7
✓ Clicked ref=e8
✓ Form submitted successfully
```

::: tip 일반적인 UI 작업

| 작업 | Kind | 매개변수 |
|--- | --- | ---|
| 클릭 | `click` | `ref`, `doubleClick`, `button`, `modifiers` |
| 텍스트 입력 | `type` | `ref`, `text`, `submit`, `slowly` |
| 키 누르기 | `press` | `key`, `targetId` |
| 마우스 오버 | `hover` | `ref`, `targetId` |
| 드래그 | `drag` | `startRef`, `endRef`, `targetId` |
| 선택 | `select` | `ref`, `values` |
| 양식 작성 | `fill` | `fields`(배열) |
| 대기 | `wait` | `timeMs`, `text`, `textGone`, `selector` |
| JS 실행 | `evaluate` | `fn`, `ref`, `targetId` |

:::

### 5단계: 웹페이지 스크린샷 찍기

**왜 필요한가요**

작업 결과를 확인하거나 웹페이지 스크린샷을 저장합니다.

```bash
# 현재 탭 스크린샷
action: screenshot
profile: clawd
targetId: tab_abc123
type: png

# 전체 페이지 스크린샷
action: screenshot
profile: clawd
targetId: tab_abc123
fullPage: true
type: png

# 지정된 요소 스크린샷
action: screenshot
profile: clawd
targetId: tab_abc123
ref: "e4"  # 스냅샷의 ref 사용
type: jpeg
```

**다음 결과가 표시됩니다**:

```
📸 Screenshot saved: ~/.clawdbot/media/browser-screenshot-12345.png
```

::: tip 스크린샷 형식

| 형식 | 용도 |
|--- | ---|
| `png` | 기본값, 무손실 압축, 문서에 적합 |
| `jpeg` | 손실 압축, 파일 크기가 작음, 저장에 적합 |

:::

### 6단계: 파일 업로드 처리

**왜 필요한가요**

양식의 파일 업로드 작업을 자동화합니다.

```bash
# 먼저 파일 선택기 트리거(업로드 버튼 클릭)
action: act
request: {
  kind: "click",
  ref: "upload_button"
}
profile: clawd
targetId: tab_abc123

# 파일 업로드
action: upload
paths:
  - "/Users/you/Documents/resume.pdf"
  - "/Users/you/Documents/photo.jpg"
ref: "upload_button"  # 선택 사항: 파일 선택기의 ref 지정
targetId: tab_abc123
profile: clawd
```

**다음 결과가 표시됩니다**:

```
✓ Files uploaded: 2
  - /Users/you/Documents/resume.pdf
  - /Users/you/Documents/photo.jpg
```

::: warning 파일 경로 주의사항

- 절대 경로를 사용하세요, 상대 경로는 지원되지 않습니다
- 파일이 존재하고 읽기 권한이 있는지 확인하세요
- 여러 파일의 경우 배열 순서대로 업로드됩니다

:::

### 7단계: 대화상자 처리

**왜 필요한가요**

웹페이지의 alert, confirm, prompt 대화상자를 자동으로 처리합니다.

```bash
# 대화상자 수락(alert/confirm)
action: dialog
accept: true
targetId: tab_abc123
profile: clawd

# 대화상자 거부(confirm)
action: dialog
accept: false
targetId: tab_abc123
profile: clawd

# prompt 대화상자에 답변
action: dialog
accept: true
promptText: "사용자가 입력한 답변"
targetId: tab_abc123
profile: clawd
```

**다음 결과가 표시됩니다**:

```
✓ Dialog handled: accepted (prompt: "사용자가 입력한 답변")
```

## 일반적인 문제

### ❌ 오류: Chrome 확장 프로그램 릴레이가 연결되지 않음

**오류 메시지**:
```
No Chrome tabs are attached via Clawdbot Browser Relay extension. Click toolbar icon on tab you want to control (badge ON), then retry.
```

**원인**: `profile="chrome"`을 사용했지만 탭이 연결되지 않았습니다

**해결 방법**:

1. Clawdbot Browser Relay 확장 프로그램 설치(Chrome Web Store)
2. 제어하려는 탭에서 확장 프로그램 아이콘 클릭(배지가 ON 표시)
3. `action: snapshot profile="chrome"` 다시 실행

### ❌ 오류: 요소 참조가 만료됨(stale targetId)

**오류 메시지**:
```
Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.
```

**원인**: 탭이 닫혔거나 targetId가 만료되었습니다

**해결 방법**:

```bash
# 탭 목록 다시 가져오기
action: tabs
profile: chrome

# 새 targetId 사용
action: snapshot
targetId: "새로운_targetId"
profile: chrome
```

### ❌ 오류: 브라우저 제어 서버가 시작되지 않음

**오류 메시지**:
```
Browser control server not available. Run action=start first.
```

**원인**: 브라우저 제어 서버가 시작되지 않았습니다

**해결 방법**:

```bash
# 브라우저 시작
action: start
profile: clawd
target: sandbox
```

### ❌ 오류: 원격 브라우저 연결 시간 초과

**오류 메시지**:
```
Remote CDP handshake timeout. Check remoteCdpTimeoutMs/remoteCdpHandshakeTimeoutMs.
```

**원인**: 원격 브라우저 연결 시간 초과

**해결 방법**:

```bash
# 구성 파일에서 시간 초과 시간 늘리기
# ~/.clawdbot/clawdbot.json
{
  "browser": {
    "remoteCdpTimeoutMs": 3000,
    "remoteCdpHandshakeTimeoutMs": 5000
  }
}
```

### ❌ 오류: 노드 브라우저 프록시를 사용할 수 없음

**오류 메시지**:
```
Node browser proxy is disabled (gateway.nodes.browser.mode=off).
```

**원인**: 노드 브라우저 프록시가 비활성화되어 있습니다

**해결 방법**:

```bash
# 구성 파일에서 노드 브라우저 활성화
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "nodes": {
      "browser": {
        "mode": "auto"  # 또는 "manual"
      }
    }
  }
}
```

## 이 단원 요약

이 단원에서 다음을 배웠습니다:

✅ **브라우저 제어**: 시작/중지/상태 확인
✅ **탭 관리**: 탭 열기/포커스/닫기
✅ **페이지 스냅샷**: AI/ARIA 형식, 요소 참조 가져오기
✅ **UI 자동화**: click/type/drag/fill/wait/evaluate
✅ **스크린샷 기능**: PNG/JPEG 형식, 전체 페이지 또는 요소 스크린샷
✅ **파일 업로드**: 파일 선택기 처리, 여러 파일 지원
✅ **대화상자 처리**: accept/reject/alert/confirm/prompt
✅ **Chrome 릴레이**: `profile="chrome"`을 사용하여 기존 탭 제어
✅ **노드 프록시**: `target="node"`를 통해 장치 노드에서 실행

**핵심 작업 빠른 참조**:

| 작업 | Action | 핵심 매개변수 |
|--- | --- | ---|
| 브라우저 시작 | `start` | `profile`(clawd/chrome) |
| 웹페이지 열기 | `open` | `targetUrl` |
| 스냅샷 가져오기 | `snapshot` | `targetId`, `snapshotFormat`, `refs` |
| UI 작업 | `act` | `request.kind`, `request.ref` |
| 스크린샷 | `screenshot` | `targetId`, `fullPage`, `ref` |
| 파일 업로드 | `upload` | `paths`, `ref` |
| 대화상자 | `dialog` | `accept`, `promptText` |

## 다음 단원 예고

> 다음 단원에서는 **[명령 실행 도구 및 승인](../tools-exec/)**을 학습합니다.
>
> 학습 내용:
> - exec 도구 구성 및 사용
> - 보안 승인 메커니즘 이해
> - allowlist를 사용하여 실행 가능한 명령 제어
> - 샌드박스를 사용하여 위험 작업 격리

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 펼치기</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| Browser 도구 정의 | [`src/agents/tools/browser-tool.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.ts) | 269-791 |
| Browser Schema | [`src/agents/tools/browser-tool.schema.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/browser-tool.schema.ts) | 1-115 |
| Action 유형 정의 | [`src/browser/client-actions-core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/client-actions-core.ts) | 18-86 |
| 브라우저 구성 분석 | [`src/browser/config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/config.ts) | 140-231 |
| 브라우저 상수 | [`src/browser/constants.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/constants.ts) | 1-9 |
| CDP 클라이언트 | [`src/browser/cdp.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/cdp.ts) | 1-500 |
| Chrome 실행 파일 감지 | [`src/browser/chrome.executables.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/browser/chrome.executables.ts) | 1-500 |

**핵심 상수**:
- `DEFAULT_CLAWD_BROWSER_CONTROL_URL = "http://127.0.0.1:18791"`: 기본 제어 서버 주소(출처: `src/browser/constants.ts:2`)
- `DEFAULT_AI_SNAPSHOT_MAX_CHARS = 80000`: AI 스냅샷 기본 최대 문자 수(출처: `src/browser/constants.ts:6`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS = 10000`: efficient 모드 최대 문자 수(출처: `src/browser/constants.ts:7`)
- `DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH = 6`: efficient 모드 깊이(출처: `src/browser/constants.ts:8`)

**핵심 함수**:
- `createBrowserTool()`: 브라우저 도구 생성, 모든 actions 및 매개변수 처리 정의
- `browserSnapshot()`: 페이지 스냅샷 가져오기, AI/ARIA 형식 지원
- `browserScreenshotAction()`: 스크린샷 작업 실행, 전체 페이지 및 요소 스크린샷 지원
- `browserAct()`: UI 자동화 작업 실행(click/type/drag/fill/wait/evaluate 등)
- `browserArmFileChooser()`: 파일 업로드 처리, 파일 선택기 트리거
- `browserArmDialog()`: 대화상자 처리(alert/confirm/prompt)
- `resolveBrowserConfig()`: 브라우저 구성 분석, 제어 서버 주소 및 포트 반환
- `resolveProfile()`: profile 구성 분석(clawd/chrome)

**Browser Actions Kind**(출처: `src/agents/tools/browser-tool.schema.ts:5-17`):
- `click`: 요소 클릭
- `type`: 텍스트 입력
- `press`: 키 누르기
- `hover`: 마우스 오버
- `drag`: 드래그
- `select`: 드롭다운 옵션 선택
- `fill`: 양식 작성(여러 필드)
- `resize`: 창 크기 조정
- `wait`: 대기
- `evaluate`: JavaScript 실행
- `close`: 탭 닫기

**Browser Tool Actions**(출처: `src/agents/tools/browser-tool.schema.ts:19-36`):
- `status`: 브라우저 상태 가져오기
- `start`: 브라우저 시작
- `stop`: 브라우저 중지
- `profiles`: 모든 profiles 나열
- `tabs`: 모든 탭 나열
- `open`: 새 탭 열기
- `focus`: 탭 포커스
- `close`: 탭 닫기
- `snapshot`: 페이지 스냅샷 가져오기
- `screenshot`: 스크린샷 찍기
- `navigate`: 지정된 URL로 이동
- `console`: 콘솔 메시지 가져오기
- `pdf`: 페이지를 PDF로 저장
- `upload`: 파일 업로드
- `dialog`: 대화상자 처리
- `act`: UI 작업 실행

</details>
