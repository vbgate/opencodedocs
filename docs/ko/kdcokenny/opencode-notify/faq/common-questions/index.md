---
title: "opencode-notify FAQ: 성능 영향, 프라이버시 보안 및 플랫폼 호환성 상세 설명"
sidebarTitle: "핵심 문제 이해"
subtitle: "FAQ: 성능, 프라이버시 및 호환성"
description: "opencode-notify가 AI 컨텍스트에 미치는 영향과 시스템 리소스 사용 메커니즘을 알아보고, 플러그인이 완전히 로컬에서 실행되어 데이터 업로드가 필요 없음을 확인합니다. 스마트 알림 필터링 전략과 방해 금지 시간 구성 방법을 마스터하고, 다른 OpenCode 플러그인과의 호환성과 macOS/Windows/Linux 플랫폼 기능 차이를 학습하여, 알림 빈도, 프라이버시 보안, 리소스 사용, 터미널 감지 실패 처리, 구성 파일 위치 등 사용자가 가장 관심을 갖는 일반적인 질문에 대해 포괄적으로 답변합니다."
tags:
  - "FAQ"
  - "성능"
  - "프라이버시"
prerequisite:
  - "start-quick-start"
order: 120
---

# FAQ: 성능, 프라이버시 및 호환성

## 학습 목표

- 플러그인의 성능 영향과 리소스 사용량 이해
- 프라이버시 보안 보장 명확히 하기
- 알림 전략과 구성 팁 마스터하기
- 플랫폼 차이와 호환성 이해

---

## 성능 관련

### AI 컨텍스트가 증가하나요?

**아니요**. 플러그인은 이벤트 기반 모드를 사용하며 AI 대화에 도구나 프롬프트를 추가하지 않습니다.

소스 코드 구현에서 확인:

| 컴포넌트 | 유형 | 구현 | 컨텍스트에 미치는 영향 |
| --- | --- | --- | --- |
| 이벤트 수신 | 이벤트 | `session.idle`, `session.error`, `permission.updated` 이벤트 수신 | ✅ 영향 없음 |
| 도구 훅 | 훅 | `tool.execute.before`를 통해 `question` 도구 수신 | ✅ 영향 없음 |
| 대화 내용 | - | 대화 내용을 읽지 않고, 수정하지 않으며, 주입하지 않음 | ✅ 영향 없음 |

소스 코드에서 플러그인은 **수신 및 알림**만 담당하며 AI 대화의 컨텍스트는 전혀 영향을 받지 않습니다.

### 시스템 리소스를 얼마나 차지하나요?

**매우 적음**. 플러그인은 "시작 시 캐시 + 이벤트 트리거" 디자인을 채택합니다:

1. **구성 로드**: 플러그인 시작 시 구성 파일(`~/.config/opencode/kdco-notify.json`)을 한 번 읽고 이후에는 읽지 않음
2. **터미널 감지**: 시작 시 터미널 유형을 감지하고 정보(이름, Bundle ID, 프로세스명)를 캐시한 후, 이후 이벤트에서 캐시된 값 사용
3. **이벤트 기반**: AI가 특정 이벤트를 트리거할 때만 플러그인이 알림 로직 실행

리소스 사용 특징:

| 리소스 유형 | 사용량 | 설명 |
| --- | --- | --- |
| CPU | 거의 0 | 이벤트 트리거 시에만 짧게 실행 |
| 메모리 | < 5 MB | 시작 후 대기 상태 진입 |
| 디스크 | < 100 KB | 구성 파일과 코드 자체 |
| 네트워크 | 0 | 네트워크 요청 없음 |

---

## 프라이버시와 보안

### 데이터가 서버에 업로드되나요?

**아니요**. 플러그인은 완전히 로컬에서 실행되며 데이터 업로드를 수행하지 않습니다.

**프라이버시 보장**:

| 데이터 유형 | 처리 방식 | 업로드 여부 |
| --- | --- | --- |
| AI 대화 내용 | 읽지 않고, 저장하지 않음 | ❌ 아니요 |
| 세션 정보(제목) | 알림 문구에만 사용 | ❌ 아니요 |
| 오류 정보 | 알림 문구에만 사용(최대 100자) | ❌ 아니요 |
| 터미널 정보 | 로컬 감지 및 캐시 | ❌ 아니요 |
| 구성 정보 | 로컬 파일(`~/.config/opencode/`) | ❌ 아니요 |
| 알림 내용 | 시스템 네이티브 알림 API로 전송 | ❌ 아니요 |

**기술 구현**:

플러그인은 시스템 네이티브 알림 사용:
- macOS: `node-notifier`를 통해 `NSUserNotificationCenter` 호출
- Windows: `node-notifier`를 통해 `SnoreToast` 호출
- Linux: `node-notifier`를 통해 `notify-send` 호출

모든 알림은 로컬에서 트리거되며 OpenCode의 클라우드 서비스를 통해 전송되지 않습니다.

### 플러그인이 세션 내용을 훔치나요?

**아니요**. 플러그인은 **필요한 메타데이터**만 읽습니다:

| 읽는 데이터 | 용도 | 제한 |
| --- | --- | --- |
| 세션 제목(title) | 알림 문구 | 처음 50자만 사용 |
| 오류 정보(error) | 알림 문구 | 처음 100자만 사용 |
| 터미널 정보 | 포커스 감지 및 클릭 포커스 | 터미널 내용을 읽지 않음 |
| 구성 파일 | 사용자 정의 설정 | 로컬 파일 |

소스 코드에는 대화 메시지(messages)나 사용자 입력(user input)을 읽는 로직이 전혀 없습니다.

---

## 알림 전략

### 알림 폭탄을 받게 되나요?

**아니요**. 플러그인은 알림 폭탄을 방지하기 위한 다중 스마트 필터링 메커니즘을 내장하고 있습니다.

**기본 알림 전략**:

| 유형 | 이벤트/도구 | 알림 여부 | 이유 |
| --- | --- | --- | --- |
| 이벤트 | 부모 세션 완료(session.idle) | ✅ 예 | 주요 작업 완료 |
| 이벤트 | 자식 세션 완료(session.idle) | ❌ 아니요 | 부모 세션이 통일하여 알림 |
| 이벤트 | 세션 오류(session.error) | ✅ 예 | 즉시 처리 필요 |
| 이벤트 | 권한 요청(permission.updated) | ✅ 예 | AI 대기 중 |
| 도구 훅 | 질문 묻기(tool.execute.before - question) | ✅ 예 | AI 입력 필요 |

**스마트 필터링 메커니즘**:

1. **부모 세션만 알림**
   - 소스: `notify.ts:256-259`
   - 기본 구성: `notifyChildSessions: false`
   - AI가 작업을 분해할 때 각 하위 작업이 모두 알림하는 것을 방지

2. **터미널 포커스 시 억제**(macOS)
   - 소스: `notify.ts:265`
   - 로직: 터미널이 포그라운드 창일 때 알림 전송 안 함(내장 동작, 구성 불필요)
   - "터미널을 보고 있을 때도 알림"하는 중복 알림 방지
   - **참고**: 이 기능은 macOS에서만 사용 가능(터미널 정보가 필요하여 감지 가능)

3. **방해 금지 시간**
   - 소스: `notify.ts:262`, `notify.ts:181-199`
   - 기본 구성: `quietHours: { enabled: false, start: "22:00", end: "08:00" }`
   - 구성 가능, 야간 방해 방지

4. **권한 요청은 항상 알림**
   - 소스: `notify.ts:319`
   - 이유: AI가 사용자 승인을 대기하고 있으므로 즉시 알림 필요
   - 부모 세션 검사 없음

### 특정 유형의 알림만 받을 수 있나요?

**가능합니다**. 플러그인에 개별 알림 스위치는 없지만, 방해 금지 시간과 터미널 포커스 감지를 통해 구현할 수 있습니다:

- **긴급 알림만 받기**: 터미널 포커스 감지는 내장 동작으로, 터미널에 있을 때 알림을 받지 않음(macOS)
- **야간 알림만 받기**: 방해 금지 시간 활성화(예: 09:00-18:00), 역방향 사용

더 세밀한 제어가 필요하면 Feature Request를 고려하세요.

---

## 플러그인 호환성

### 다른 OpenCode 플러그인과 충돌하나요?

**아니요**. 플러그인은 표준 OpenCode Plugin API를 통해 통합되어 AI 동작을 수정하거나 다른 플러그인을 방해하지 않습니다.

**통합 방식**:

| 컴포넌트 | 통합 방식 | 충돌 위험 |
| --- | --- | --- |
| 이벤트 수신 | OpenCode SDK의 `event` 훅 | ❌ 충돌 없음 |
| 도구 훅 | OpenCode Plugin API의 `tool.execute.before` 훅 | ❌ 충돌 없음(`question` 도구만 수신) |
| 세션 조회 | OpenCode SDK의 `client.session.get()` | ❌ 충돌 없음(읽기 전용) |
| 알림 전송 | `node-notifier` 독립 프로세스 | ❌ 충돌 없음 |

**공존 가능한 다른 플러그인**:

- OpenCode 공식 플러그인(예: `opencode-coder`)
- 서드파티 플러그인(예: `opencode-db`, `opencode-browser`)
- 커스텀 플러그인

모든 플러그인은 표준 Plugin API를 통해 병렬로 실행되며 서로 방해하지 않습니다.

### 어떤 플랫폼을 지원하나요? 기능에 차이가 있나요?

**macOS, Windows, Linux 세 플랫폼을 지원하지만 기능에 차이가 있습니다**.

| 기능 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| 네이티브 알림 | ✅ 지원 | ✅ 지원 | ✅ 지원 |
| 커스텀 사운드 | ✅ 지원 | ❌ 지원 안 됨 | ❌ 지원 안 됨 |
| 터미널 포커스 감지 | ✅ 지원 | ❌ 지원 안 됨 | ❌ 지원 안 됨 |
| 클릭 알림 포커스 | ✅ 지원 | ❌ 지원 안 됨 | ❌ 지원 안 됨 |
| 터미널 자동 감지 | ✅ 지원 | ✅ 지원 | ✅ 지원 |
| 방해 금지 시간 | ✅ 지원 | ✅ 지원 | ✅ 지원 |

**플랫폼 차이 원인**:

| 플랫폼 | 차이 설명 |
| --- | --- |
| macOS | 시스템이 풍부한 알림 API와 앱 관리 인터페이스(예: `osascript`)를 제공하여 사운드, 포커스 감지, 클릭 포커스 지원 |
| Windows | 시스템 알림 API 기능이 제한되어 앱 수준의 포그라운드 감지와 사운드 커스텀 미지원 |
| Linux | `notify-send` 표준에 의존, Windows와 유사한 기능 |

**크로스 플랫폼 핵심 기능**:

어떤 플랫폼을 사용하든 다음 핵심 기능은 모두 사용 가능합니다:
- 작업 완료 알림(session.idle)
- 오류 알림(session.error)
- 권한 요청 알림(permission.updated)
- 질문 묻기 알림(tool.execute.before)
- 방해 금지 시간 구성

---

## 터미널과 시스템

### 어떤 터미널을 지원하나요? 어떻게 감지하나요?

**37개 이상의 터미널 에뮬레이터를 지원**합니다.

플러그인은 [`detect-terminal`](https://github.com/jonschlinkert/detect-terminal) 라이브러리를 사용하여 터미널을 자동 인식하며, 지원하는 터미널은 다음과 같습니다:

**macOS 터미널**:
- Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- macOS Terminal, Hyper, Warp
- VS Code 통합 터미널(Code / Code - Insiders)

**Windows 터미널**:
- Windows Terminal, Git Bash, ConEmu, Cmder
- PowerShell, CMD(기본 감지 통해)

**Linux 터미널**:
- gnome-terminal, konsole, xterm, lxterminal
- terminator, tilix, alacritty, kitty

**감지 메커니즘**:

1. **자동 감지**: 플러그인 시작 시 `detectTerminal()` 라이브러리 호출
2. **수동 오버라이드**: 사용자가 구성 파일에서 `terminal` 필드를 지정하여 자동 감지 덮어쓰기
3. **macOS 매핑**: 터미널 이름을 프로세스명으로 매핑(예: `ghostty` → `Ghostty`), 포커스 감지에 사용

**구성 예시**:

```json
{
  "terminal": "ghostty"
}
```

### 터미널 감지에 실패하면 어떻게 되나요?

**플러그인은 정상적으로 작동하며 포커스 감지 기능만 비활성화됩니다**.

**실패 처리 로직**:

| 실패 시나리오 | 표시 | 영향 |
| --- | --- | --- |
| `detectTerminal()`이 `null` 반환 | 터미널 정보가 `{ name: null, bundleId: null, processName: null }` | 포커스 감지 없음, 하지만 알림은 정상 전송 |
| macOS `osascript` 실행 실패 | Bundle ID 획득 실패 | macOS 클릭 포커스 기능 비활성화, 하지만 알림은 정상 |
| 구성 파일의 `terminal` 값이 유효하지 않음 | 자동 감지 결과 사용 | 자동 감지도 실패하면 포커스 감지 없음 |

소스 코드의 관련 로직(`notify.ts:149-150`):

```typescript
if (!terminalName) {
  return { name: null, bundleId: null, processName: null }
}
```

**해결 방법**:

터미널 감지에 실패하면 터미널 유형을 수동으로 지정할 수 있습니다:

```json
{
  "terminal": "iterm2"
}
```

---

## 구성 및 문제 해결

### 구성 파일은 어디에 있나요? 어떻게 수정하나요?

**구성 파일 경로**: `~/.config/opencode/kdco-notify.json`

**완전한 구성 예시**:

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

**구성 수정 단계**:

1. 터미널을 열고 구성 파일을 편집합니다:
   ```bash
   # macOS/Linux
   nano ~/.config/opencode/kdco-notify.json
   
   # Windows
   notepad %USERPROFILE%\.config\opencode\kdco-notify.json
   ```

2. 구성 항목 수정(위 예시 참조)

3. 파일 저장, 구성이 자동으로 적용됨(재시작 불필요)

### 구성 파일이 손상되면 어떻게 되나요?

**플러그인은 기본 구성을 사용하고 오류를 조용히 처리합니다**.

**오류 처리 로직**(`notify.ts:110-113`):

```typescript
} catch {
  // Config doesn't exist or is invalid, use defaults
  return DEFAULT_CONFIG
}
```

**해결 방법**:

구성 파일이 손상되었을 때(JSON 형식 오류), 플러그인은 기본 구성으로 대체합니다. 수정 단계:

1. 손상된 구성 파일 삭제:
   ```bash
   rm ~/.config/opencode/kdco-notify.json
   ```

2. 플러그인은 기본 구성으로 계속 작동

3. 커스텀 구성이 필요하면 구성 파일을 다시 생성

---

## 수업 요약

본 수업은 사용자가 가장 관심을 갖는 일반적인 질문에 답변했습니다:

- **성능 영향**: 플러그인은 AI 컨텍스트를 증가시키지 않으며, 리소스 사용량이 매우 낮음(CPU 거의 0, 메모리 < 5 MB)
- **프라이버시 보안**: 완전히 로컬에서 실행되어 데이터를 업로드하지 않으며, 필요한 메타데이터만 읽음
- **알림 전략**: 스마트 필터링 메커니즘(부모 세션만 알림, macOS 터미널 포커스 시 억제, 방해 금지 시간)
- **플러그인 호환성**: 다른 플러그인과 충돌하지 않으며, 세 플랫폼을 지원하지만 기능에 차이가 있음
- **터미널 지원**: 37개 이상의 터미널 지원, 자동 감지 실패 시에도 정상 작동

---

## 다음 수업 예고

> 다음 수업에서는 **[이벤트 유형 설명](../../appendix/event-types/)**을 학습합니다.
>
> 학습 내용:
> - 플러그인이 수신하는 네 가지 OpenCode 이벤트 유형
> - 각 이벤트의 트리거 시점과 알림 내용
> - 이벤트의 필터링 규칙(부모 세션 검사, 방해 금지 시간, 터미널 포커스)
> - 플랫폼별 이벤트 처리 차이

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 플러그인 시작 및 구성 로드 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L357-L364) | 357-364 |
| 이벤트 수신 로직 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L372-L400) | 372-400 |
| 부모 세션 검사 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| 방해 금지 시간 검사 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| 터미널 포커스 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| 구성 파일 로드 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| 터미널 정보 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| 기본 구성 정의 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |

**핵심 상수**:
- `DEFAULT_CONFIG`: 기본 구성(부모 세션만 알림, Glass/Basso/Submarine 사운드, 방해 금지 시간 기본 비활성화)

**핵심 함수**:
- `loadConfig()`: 사용자 구성 로드 및 기본값 병합
- `detectTerminalInfo()`: 터미널 정보 감지 및 캐시
- `isQuietHours()`: 현재 시간이 방해 금지 시간인지 확인
- `isTerminalFocused()`: 터미널이 포그라운드 창인지 확인(macOS)
- `isParentSession()`: 세션이 부모 세션인지 확인

</details>
