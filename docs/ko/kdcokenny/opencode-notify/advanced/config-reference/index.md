---
title: "opencode-notify 설정 참조: 완전한 설정 옵션 설명과 플랫폼별 차이점 | 튜토리얼"
sidebarTitle: "알림 동작 사용자 정의"
subtitle: "설정 참조: 완전한 설정 옵션 설명"
description: "opencode-notify의 완전한 설정 옵션을 배워보세요. 여기에는 하위 세션 알림 전환, 사용자 정의 사운드, 방해 금지 시간 및 터미널 유형 재정의가 포함됩니다. 이 튜토리얼은 상세한 설정 매개변수 설명, 기본값, 플랫폼별 차이점 및 완전한 예제를 제공하여 사용자 정의 알림 동작을 설정하고 작업 흐름을 최적화하고 macOS, Windows, Linux에서의 구성 팁을 익히는 데 도움이 됩니다."
tags:
  - "설정 참조"
  - "고급 설정"
prerequisite:
  - "start-quick-start"
order: 70
---

# 설정 참조

## 이 튜토리얼을 마치면 할 수 있는 것

- ✅ 모든 구성 가능한 매개변수와 그 의미 이해
- ✅ 요구사항에 따라 알림 동작 사용자 정의
- ✅ 특정 시간에 방해를 피하기 위해 방해 금지 시간 구성
- ✅ 플랫폼별 차이점이 구성에 미치는 영향 이해

## 지금 직면한 문제

기본 구성으로는 충분하지만, 당신의 작업 흐름이 특수할 수 있습니다:
- 밤에도 중요한 알림을 받고 싶지만 평소에는 방해를 받고 싶지 않습니다
- 다중 세션 병렬 작업을 하며 모든 세션에 알림을 받고 싶습니다
- tmux에서 작업하는데 포커스 감지가 예상대로 작동하지 않습니다
- 특정 구성 옵션이 정확히 무엇을 하는지 알고 싶습니다

## 이 트릭을 사용해야 할 때

- **알림 동작을 사용자 정의해야 할 때** - 기본 구성이 작업 습관을 충족하지 못함
- **알림 방해를 줄이고 싶을 때** - 방해 금지 시간 또는 하위 세션 스위치 구성
- **플러그인 동작을 디버그하고 싶을 때** - 각 구성 옵션의 역할 이해
- **여러 플랫폼에서 사용할 때** - 구성에 미치는 플랫폼별 차이점 이해

## 핵심 개념

구성 파일을 사용하면 코드를 수정하지 않고도 플러그인 동작을 조정할 수 있습니다. 플러그인에 "설정 메뉴"를 제공하는 것과 같습니다. 구성 파일은 JSON 형식이며 `~/.config/opencode/kdco-notify.json`에 위치합니다.

**구성 로드 흐름**:

```
플러그인 시작
    ↓
사용자 구성 파일 읽기
    ↓
기본 구성과 병합(사용자 구성 우선)
    ↓
병합된 구성으로 실행
```

::: info 구성 파일 경로
`~/.config/opencode/kdco-notify.json`
:::

## 📋 구성 옵션 설명

### 완전한 구성 구조

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
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": ""
}
```

### 옵션별 설명

#### notifyChildSessions

| 구성 옵션 | 유형 | 기본값 | 설명 |
| --- | --- | --- | ---|
| `notifyChildSessions` | boolean | `false` | 하위 세션 알림 여부 |

**역할**: 하위 세션(sub-session)에 대한 알림 발송 여부를 제어합니다.

**하위 세션이란**:
OpenCode의 다중 세션 기능을 사용할 때, 세션은 부모 세션과 하위 세션으로 구분될 수 있습니다. 하위 세션은 일반적으로 부모 세션이 시작한 보조 작업입니다. 예를 들어 파일 읽기/쓰기, 네트워크 요청 등이 있습니다.

**기본 동작**(`false`):
- 부모 세션의 완료, 오류, 권한 요청 이벤트만 알림
- 하위 세션의 어떤 이벤트도 알림하지 않음
- 다중 작업 병렬 실행 시 대량의 알림을 방지

**활성화 후**(`true`):
- 모든 세션(부모 세션과 하위 세션)에 알림
- 모든 하위 작업 진행 상황을 추적해야 하는 시나리오에 적합

::: tip 권장 설정
기본값 `false`를 유지하세요. 각 하위 작업 상태를 반드시 추적해야 할 때만 활성화하세요.
:::

#### 포커스 감지(macOS)

플러그인은 터미널이 포그라운드에 있는지 자동으로 감지합니다. 터미널이 현재 활성 창이라면 알림 발송을 억제하여 중복 알림을 방지합니다.

**작동 원리**:
- macOS의 `osascript`를 사용하여 현재 포그라운드 애플리케이션 감지
- 포그라운드 앱 프로세스 이름과 터미널 프로세스 이름 비교
- 터미널이 포그라운드에 있으면 알림 발송하지 않음
- **질문 알림은 예외**(tmux 작업 흐름 지원)

::: info 플랫폼별 차이
포커스 감지 기능은 macOS에서만 작동합니다. Windows와 Linux는 이 기능을 지원하지 않습니다.
:::

#### sounds

| 구성 옵션 | 유형 | 기본값 | 플랫폼 지원 | 설명 |
| --- | --- | --- | --- | ---|
| `sounds.idle` | string | `"Glass"` | ✅ macOS | 작업 완료 효과음 |
| `sounds.error` | string | `"Basso"` | ✅ macOS | 오류 알림 효과음 |
| `sounds.permission` | string | `"Submarine"` | ✅ macOS | 권한 요청 효과음 |
| `sounds.question` | string | 설정되지 않음 | ✅ macOS | 질문 알림 효과음(선택적) |

**역할**: 다양한 유형의 알림에 대해 다른 시스템 효과음을 설정합니다(macOS 전용).

**사용 가능한 효과음 목록**:

| 효과음 이름 | 청취 특징 | 권장 시나리오 |
| --- | --- | ---|
| Glass | 가볍고 청량함 | 작업 완료(기본값) |
| Basso | 낮고 경고성 | 오류 알림(기본값) |
| Submarine | 알림성, 부드러움 | 권한 요청(기본값) |
| Blow | 강렬함 | 중요한 이벤트 |
| Bottle | 청량함 | 하위 작업 완료 |
| Frog | 가벼움 | 비공식적인 알림 |
| Funk | 리드미컬함 | 다중 작업 완료 |
| Hero | 웅장함 | 마일스톤 완료 |
| Morse | 모스 부호 | 디버깅 관련 |
| Ping | 청량함 | 가벼운 알림 |
| Pop | 짧음 | 빠른 작업 |
| Purr | 부드러움 | 방해하지 않는 알림 |
| Sosumi | 독특함 | 특별한 이벤트 |
| Tink | 맑음 | 작은 작업 완료 |

**question 필드 설명**:
`sounds.question`은 AI가 질문을 할 때 알림하는 선택적 필드입니다. 설정되지 않으면 `permission`의 효과음을 사용합니다.

::: tip 효과음 구성 팁
- 가벼운 효과음으로 성공 표시(idle)
- 낮은 효과음으로 오류 표시(error)
- 부드러운 효과음으로 주의 필요 표시(permission, question)
- 다양한 효과음 조합으로 알림을 보지 않고도 상황 파악 가능
:::

::: warning 플랫폼별 차이
`sounds` 구성은 macOS에서만 유효합니다. Windows와 Linux는 시스템 기본 알림 소리를 사용하며 사용자 정의가 불가능합니다.
:::

#### quietHours

| 구성 옵션 | 유형 | 기본값 | 설명 |
| --- | --- | --- | ---|
| `quietHours.enabled` | boolean | `false` | 방해 금지 시간 활성화 여부 |
| `quietHours.start` | string | `"22:00"` | 방해 금지 시작 시간(HH:MM 형식) |
| `quietHours.end` | string | `"08:00"` | 방해 금지 종료 시간(HH:MM 형식) |

**역할**: 지정된 시간 동안 모든 알림 발송을 억제합니다.

**기본 동작**(`enabled: false`):
- 방해 금지 시간 비활성화
- 언제든 알림을 받을 수 있음

**활성화 후**(`enabled: true`):
- `start`부터 `end`까지의 시간 동안 알림 발송하지 않음
- 자정 넘는 시간 지원(예: 22:00-08:00)

**시간 형식**:
- 24시간제 `HH:MM` 형식 사용
- 예: `"22:30"`는 오후 10시 30분

**자정 넘는 시간**:
- `start > end`(예: 22:00-08:00)이면 자정 넘음을 의미
- 오후 10시부터 다음 날 오전 8시까지 방해 금지 시간

::: info 방해 금지 시간 우선순위
방해 금지 시간의 우선순위가 가장 높습니다. 다른 모든 조건이 충족되어도 방해 금지 시간 내에서는 알림을 발송하지 않습니다.
:::

#### terminal

| 구성 옵션 | 유형 | 기본값 | 설명 |
| --- | --- | --- | ---|
| `terminal` | string | 설정되지 않음 | 수동으로 터미널 유형 지정(자동 감지 재정의) |

**역할**: 사용하는 터미널 에뮬레이터 유형을 수동으로 지정하여 플러그인의 자동 감지를 재정의합니다.

**기본 동작**(설정되지 않음):
- 플러그인이 `detect-terminal` 라이브러리를 사용하여 터미널 자동 감지
- 37개 이상의 터미널 에뮬레이터 지원

**설정 후**:
- 플러그인이 지정된 터미널 유형 사용
- 포커스 감지 및 클릭 포커스 기능에 사용(macOS)

**일반적인 터미널 값**:

| 터미널 애플리케이션 | 구성 값 |
| --- | ---|
| Ghostty | `"ghostty"` |
| Kitty | `"kitty"` |
| iTerm2 | `"iterm2"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code 통합 터미널 | `"vscode"` |

::: tip 수동 설정이 필요한 경우
- 자동 감지가 실패하고 포커스 감지가 작동하지 않을 때
- 여러 터미널을 사용하고 특정 터미널을 지정해야 할 때
- 터미널 이름이 일반적인 목록에 없을 때
:::

## 플랫폼별 차이점 요약

다른 플랫폼은 구성 옵션 지원 정도가 다릅니다:

| 구성 옵션 | macOS | Windows | Linux |
| --- | --- | --- | ---|
| `notifyChildSessions` | ✅ | ✅ | ✅ |
| 포커스 감지(하드 코딩) | ✅ | ❌ | ❌ |
| `sounds.*` | ✅ | ❌ | ❌ |
| `quietHours.*` | ✅ | ✅ | ✅ |
| `terminal` | ✅ | ✅ | ✅ |

::: warning Windows/Linux 사용자 주의
`sounds` 구성과 포커스 감지 기능은 Windows와 Linux에서 작동하지 않습니다.
- Windows/Linux는 시스템 기본 알림 소리를 사용합니다
- Windows/Linux는 포커스 감지를 지원하지 않습니다(구성으로 제어할 수 없음)
:::

## 구성 예제

### 기본 구성(권장)

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

이 구성은 대부분의 사용자에게 적합합니다:
- 하위 작업 소음을 피하기 위해 부모 세션만 알림
- macOS에서 터미널이 포그라운드일 때 자동으로 알림 억제(구성 불필요)
- 기본 효과음 조합 사용
- 방해 금지 시간 비활성화

### 방해 금지 시간 활성화

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

밤에 방해를 받지 않고 싶은 사용자에게 적합합니다:
- 오후 10시부터 오전 8시까지 알림 발송하지 않음
- 다른 시간에는 정상적으로 알림

### 모든 하위 작업 추적

```json
{
  "notifyChildSessions": true,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Ping"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

모든 작업 진행 상황을 추적해야 하는 사용자에게 적합합니다:
- 모든 세션(부모 세션과 하위 세션)에 알림
- 질문 알림에 별도 효과음 설정(Ping)

### 터미널 수동 지정

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  },
  "terminal": "ghostty"
}
```

자동 감지가 실패하거나 여러 터미널을 사용하는 사용자에게 적합합니다:
- Ghostty 터미널 수동 지정
- 포커스 감지 및 클릭 포커스 기능이 정상 작동하도록 보장

### Windows/Linux 최소 구성

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

Windows/Linux 사용자에게 적합한(단순화된) 구성입니다:
- 플랫폼에서 지원하는 구성 옵션만 유지
- Windows/Linux에서 `sounds` 구성과 포커스 감지 기능이 작동하지 않으므로 설정할 필요 없음

## 구성 파일 관리

### 구성 파일 생성

**macOS/Linux**:

```bash
# 구성 디렉토리 생성(존재하지 않는 경우)
mkdir -p ~/.config/opencode

# 구성 파일 생성
nano ~/.config/opencode/kdco-notify.json
```

**Windows (PowerShell)**:

```powershell
# 구성 디렉토리 생성(존재하지 않는 경우)
New-Item -ItemType Directory -Path "$env:APPDATA\opencode" -Force

# 구성 파일 생성
notepad "$env:APPDATA\opencode\kdco-notify.json"
```

### 구성 파일 확인

**파일 존재 여부 확인**:

```bash
# macOS/Linux
cat ~/.config/opencode/kdco-notify.json

# Windows PowerShell
Get-Content "$env:APPDATA\opencode\kdco-notify.json"
```

**구성이 적용되었는지 확인**:

1. 구성 파일 수정
2. OpenCode 재시작(또는 구성 재로드 트리거)
3. 알림 동작이 예상대로인지 관찰

### 구성 파일 오류 처리

구성 파일 형식에 오류가 있으면:
- 플러그인이 잘못된 구성 파일을 무시
- 기본 구성을 사용하여 계속 실행
- OpenCode 로그에 경고 메시지 출력

**일반적인 JSON 오류**:

| 오류 유형 | 예시 | 수정 방법 |
| --- | --- | ---|
| 쉼표 누락 | `"key1": "value1" "key2": "value2"` | 쉼표 추가: `"key1": "value1",` |
| 불필요한 쉼표 | `"key1": "value1",}` | 마지막 쉼표 제거: `"key1": "value1"}` |
| 따옴표 미닫힘 | `"key": value` | 따옴표 추가: `"key": "value"` |
| 작은따옴표 사용 | `'key': 'value'` | 큰따옴표로 변경: `"key": "value"` |
| 주석 문법 오류 | `{"key": "value" /* comment */}` | JSON은 주석을 지원하지 않으므로 제거 |

::: tip JSON 검증 도구 사용
온라인 JSON 검증 도구(예: jsonlint.com)를 사용하여 구성 파일 형식이 올바른지 확인할 수 있습니다.
:::

## 이번 강의 요약

이 강의에서는 opencode-notify의 완전한 구성 참조를 제공했습니다:

**핵심 구성 옵션**:

| 구성 옵션 | 역할 | 기본값 | 플랫폼 지원 |
| --- | --- | --- | ---|
| `notifyChildSessions` | 하위 세션 알림 스위치 | `false` | 전 플랫폼 |
| 포커스 감지 | 터미널 포커스 억제(하드 코딩) | 구성 없음 | macOS 전용 |
| `sounds.*` | 사용자 정의 효과음 | 필드별 참조 | macOS 전용 |
| `quietHours.*` | 방해 금지 시간 구성 | 필드별 참조 | 전 플랫폼 |
| `terminal` | 수동으로 터미널 지정 | 설정되지 않음 | 전 플랫폼 |

**구성 원칙**:
- **대부분의 사용자**: 기본 구성으로 충분
- **방해가 필요한 경우**: `quietHours` 활성화
- **하위 작업을 추적해야 하는 경우**: `notifyChildSessions` 활성화
- **macOS 사용자**: `sounds` 사용자 정의 가능, 자동 포커스 감지 제공
- **Windows/Linux 사용자**: 구성 옵션이 적으며 `notifyChildSessions`와 `quietHours`에 집중

**구성 파일 경로**: `~/.config/opencode/kdco-notify.json`

## 다음 강의 예고

> 다음 강의에서는 **[방해 금지 시간 자세히 알아보기](../quiet-hours/)**를 학습합니다.
>
> 배울 내용:
> - 방해 금지 시간의 상세한 작동 원리
> - 자정을 넘는 시간의 구성 방법
> - 방해 금지 시간과 다른 구성의 우선순위
> - 일반적인 문제와 해결책

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | ---|
| 구성 인터페이스 정의 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48 |
| 기본 구성 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 구성 파일 로드 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L91-L114) | 91-114 |
| 하위 세션 확인 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L256-L259) | 256-259 |
| 터미널 포커스 확인 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L265) | 265 |
| 방해 금지 시간 확인 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L262) | 262 |
| 효과음 구성 사용 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L236) | 227-236 |
| README 구성 예제 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L68-L79) | 68-79 |

**구성 인터페이스** (NotifyConfig):

```typescript
interface NotifyConfig {
  /** 하위/하위 세션 이벤트 알림(기본값: false) */
  notifyChildSessions: boolean
  /** 이벤트 유형별 효과음 구성 */
  sounds: {
    idle: string
    error: string
    permission: string
    question?: string
  }
  /** 방해 금지 시간 구성 */
  quietHours: {
    enabled: boolean
    start: string // "HH:MM" 형식
    end: string // "HH:MM" 형식
  }
  /** 터미널 감지 재정의(선택적) */
  terminal?: string
}
```

**참고**: 구성 인터페이스에는 `suppressWhenFocused` 필드가 **없습니다**. 포커스 감지는 macOS 플랫폼의 하드 코딩 동작이며 사용자는 구성 파일로 제어할 수 없습니다.

**기본 구성** (DEFAULT_CONFIG):

```typescript
const DEFAULT_CONFIG: NotifyConfig = {
  notifyChildSessions: false,
  sounds: {
    idle: "Glass",      // 작업 완료 효과음
    error: "Basso",     // 오류 효과음
    permission: "Submarine",  // 권한 요청 효과음
  },
  quietHours: {
    enabled: false,     // 기본값은 방해 금지 시간 비활성화
    start: "22:00",    // 오후 10시
    end: "08:00",      // 오전 8시
  },
}
```

**구성 로드 함수** (loadConfig):

- 경로: `~/.config/opencode/kdco-notify.json`
- `fs.readFile()`을 사용하여 구성 파일 읽기
- `DEFAULT_CONFIG`와 병합(사용자 구성 우선)
- 중첩된 객체(`sounds`, `quietHours`)도 병합됨
- 구성 파일이 없거나 형식에 오류가 있으면 기본 구성 사용

**하위 세션 확인** (isParentSession):

- `sessionID`에 `/`가 포함되어 있는지 확인(하위 세션 식별)
- `notifyChildSessions`가 `false`이면 하위 세션 알림 건너뛰기
- 권한 요청 알림(`permission.updated`)은 이 제한을 받지 않고 항상 발송

**터미널 포커스 확인** (isTerminalFocused):

- `osascript`를 사용하여 현재 포그라운드 애플리케이션 프로세스 이름 가져오기
- 터미널의 `processName`과 비교(대소문자 구분 안 함)
- macOS 플랫폼에서만 활성화되며 **구성으로 끌 수 없음**
- 질문 알림(`question`)은 포커스 확인을 하지 않음(tmux 작업 흐름 지원)

**방해 금지 시간 확인** (isQuietHours):

- 현재 시간을 분 단위로 변환(자정부터 시작)
- 구성된 `start` 및 `end`와 비교
- 자정 넘는 시간 지원(예: 22:00-08:00)
- `start > end`이면 자정 넘음을 의미

**효과음 구성 사용** (sendNotification):

- 구성에서 해당 이벤트의 효과음 이름 읽기
- `node-notifier`의 `sound` 옵션에 전달
- macOS 플랫폼에서만 유효
- `question` 이벤트가 효과음을 구성하지 않으면 `permission`의 효과음 사용

</details>
