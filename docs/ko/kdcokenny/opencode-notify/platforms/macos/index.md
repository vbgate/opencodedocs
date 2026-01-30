---
title: "macOS 플랫폼 기능: 포커스 감지, 클릭 포커스 및 사용자 정의 알림음 | opencode-notify"
sidebarTitle: "알림 클릭으로 터미널 복귀"
subtitle: "macOS 플랫폼 기능"
description: "opencode-notify의 macOS 전용 기능을 학습합니다: 스마트 포커스 감지로 중복 알림 방지, 알림 클릭 시 터미널 자동 포커스, 12가지 내장 알림음 사용자 정의. 이 튜토리얼에서는 설정 방법, 사용 가능한 알림음 목록 및 실용적인 팁을 자세히 설명하여 macOS 네이티브 알림 기능을 최대한 활용하고 작업 효율성을 높이며 불필요한 창 전환을 줄일 수 있도록 도와드립니다."
tags:
  - "플랫폼 기능"
  - "macOS"
  - "포커스 감지"
prerequisite:
  - "start-quick-start"
order: 30
---

# macOS 플랫폼 기능

## 학습 후 할 수 있는 것

- ✅ 스마트 포커스 감지 설정으로 플러그인이 터미널을 보고 있는지 인식하도록 구성
- ✅ 알림 클릭 시 터미널 창 자동 포커스
- ✅ 다양한 이벤트에 대한 알림음 사용자 정의
- ✅ macOS 플랫폼 고유의 장점과 제한 사항 이해

## 현재 겪고 계신 문제점

OpenCode를 사용할 때 창을 자주 전환하게 됩니다: AI가 백그라운드에서 작업을 실행하는 동안 브라우저로 전환하여 자료를 찾고, 몇십 초마다 다시 돌아와서 확인해야 합니다: 작업이 완료되었나요? 오류가 발생했나요? 아니면 입력을 기다리고 있나요?

카카오톡 메시지를 받을 때처럼 네이티브 데스크톱 알림이 있다면 좋겠습니다. AI가 작업을 완료하거나 사용자가 필요할 때 알려주는 것이죠.

## 언제 사용해야 하나요

- **macOS에서 OpenCode를 사용하는 경우** - 이 수업 내용은 macOS에만 적용됩니다
- **워크플로우를 최적화하고 싶은 경우** - AI 상태 확인을 위한 잦은 창 전환 방지
- **더 나은 알림 경험을 원하는 경우** - macOS 네이티브 알림의 장점 활용

::: info 왜 macOS가 더 강력한가요?
macOS 플랫폼은 완전한 알림 기능을 제공합니다: 포커스 감지, 클릭 포커스, 사용자 정의 알림음. Windows와 Linux는 현재 기본적인 네이티브 알림 기능만 지원합니다.
:::

## 🎒 시작 전 준비

시작하기 전에 다음을 완료했는지 확인하세요:

::: warning 사전 확인
- [ ] [빠른 시작](../../start/quick-start/) 튜토리얼 완료
- [ ] 플러그인이 설치되어 정상 작동 중
- [ ] macOS 시스템 사용 중
:::

## 핵심 원리

macOS 플랫폼의 완전한 알림 경험은 세 가지 핵심 기능을 기반으로 합니다:

### 1. 스마트 포커스 감지

플러그인은 현재 터미널 창을 보고 있는지 알 수 있습니다. AI의 출력을 검토하고 있다면 알림으로 방해하지 않습니다. 다른 앱으로 전환했을 때만 알림이 전송됩니다.

**구현 원리**: macOS의 `osascript` 시스템 서비스를 통해 현재 포그라운드 앱의 프로세스 이름을 조회하고, 사용 중인 터미널의 프로세스 이름과 비교합니다.

### 2. 알림 클릭 시 터미널 포커스

알림을 받은 후 알림 카드를 직접 클릭하면 터미널 창이 자동으로 맨 앞으로 이동합니다. 즉시 작업 상태로 돌아갈 수 있습니다.

**구현 원리**: macOS Notification Center는 `activate` 옵션을 지원하며, 앱의 Bundle ID를 전달하면 클릭 포커스가 구현됩니다.

### 3. 사용자 정의 알림음

다양한 유형의 이벤트에 다른 소리를 설정할 수 있습니다: 작업 완료에는 경쾌한 알림음, 오류에는 낮은 알림음을 사용하여 알림을 보지 않고도 대략적인 상황을 파악할 수 있습니다.

**구현 원리**: macOS 시스템에 내장된 14가지 표준 알림음(Glass, Basso, Submarine 등)을 활용하며, 설정 파일의 `sounds` 필드에서 지정할 수 있습니다.

::: tip 세 가지 기능의 협력
포커스 감지로 방해 방지 → 알림 클릭으로 빠른 복귀 → 알림음으로 이벤트 유형 빠른 구분
:::

## 따라해 보세요

### 1단계: 자동 감지된 터미널 확인

플러그인은 시작 시 사용 중인 터미널 에뮬레이터를 자동으로 감지합니다. 올바르게 인식되었는지 확인해 봅시다.

**이유**

플러그인이 포커스 감지 및 클릭 포커스 기능을 구현하려면 사용 중인 터미널이 무엇인지 알아야 합니다.

**작업**

1. OpenCode 설정 디렉터리를 엽니다:
   ```bash
   ls ~/.config/opencode/
   ```

2. `kdco-notify.json` 설정 파일을 이미 생성했다면 `terminal` 필드가 있는지 확인합니다:
   ```bash
   cat ~/.config/opencode/kdco-notify.json
   ```

3. 설정 파일에 `terminal` 필드가 없다면 플러그인이 자동 감지를 사용하고 있는 것입니다.

**다음을 확인해야 합니다**

설정 파일에 `terminal` 필드가 없으면 플러그인이 자동으로 감지합니다. 지원되는 터미널은 다음과 같습니다:
- **일반 터미널**: Ghostty, Kitty, iTerm2, WezTerm, Alacritty
- **시스템 터미널**: macOS 기본 Terminal.app
- **기타 터미널**: Hyper, Warp, VS Code 통합 터미널 등

::: info 37개 이상의 터미널 지원
플러그인은 `detect-terminal` 라이브러리를 사용하여 37개 이상의 터미널 에뮬레이터를 지원합니다. 사용 중인 터미널이 일반 목록에 없더라도 자동 인식을 시도합니다.
:::

### 2단계: 사용자 정의 알림음 설정

macOS는 14가지 내장 알림음을 제공하며, 다양한 이벤트에 다른 소리를 할당할 수 있습니다.

**이유**

다른 소리를 사용하면 알림을 보지 않고도 무슨 일이 일어났는지 대략적으로 알 수 있습니다: 작업 완료인지 오류인지, AI가 대기 중인지 단순히 작업을 완료한 것인지.

**작업**

1. 설정 파일을 열거나 생성합니다:
   ```bash
   nano ~/.config/opencode/kdco-notify.json
   ```

2. `sounds` 설정을 추가하거나 수정합니다:

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. 저장하고 종료합니다(Ctrl+O, Enter, Ctrl+X)

**다음을 확인해야 합니다**

설정 파일의 `sounds` 필드에는 네 가지 옵션이 있습니다:

| 필드 | 용도 | 기본값 | 권장 설정 |
| --- | --- | --- | --- |
| `idle` | 작업 완료 알림음 | Glass | Glass(경쾌함) |
| `error` | 오류 알림음 | Basso | Basso(낮음) |
| `permission` | 권한 요청 알림음 | Submarine | Submarine(알림) |
| `question` | AI 질문 알림음(선택) | permission | Purr(부드러움) |

::: tip 권장 조합
이 기본 조합은 직관적입니다: 완료에는 경쾌한 소리, 오류에는 경고 소리, 권한 요청에는 알림 소리.
:::

### 3단계: 사용 가능한 알림음 목록 확인

macOS에는 14가지 내장 알림음이 있으며 자유롭게 조합할 수 있습니다.

**이유**

사용 가능한 모든 알림음을 알면 자신의 작업 습관에 가장 적합한 조합을 찾는 데 도움이 됩니다.

**사용 가능한 알림음**

| 알림음 이름 | 청각적 특성 | 적합한 시나리오 |
| --- | --- | --- |
| Glass | 경쾌하고 맑음 | 작업 완료 |
| Basso | 낮고 경고성 | 오류 알림 |
| Submarine | 알림성, 부드러움 | 권한 요청 |
| Blow | 강렬함 | 중요한 이벤트 |
| Bottle | 맑음 | 하위 작업 완료 |
| Frog | 가벼움 | 비공식 알림 |
| Funk | 리듬감 | 다중 작업 완료 |
| Hero | 웅장함 | 마일스톤 완료 |
| Morse | 모스 부호 | 디버깅 관련 |
| Ping | 맑음 | 가벼운 알림 |
| Pop | 짧음 | 빠른 작업 |
| Purr | 부드러움 | 방해하지 않는 알림 |
| Sosumi | 독특함 | 특별한 이벤트 |
| Tink | 맑고 밝음 | 작은 작업 완료 |

::: tip 소리로 의미 파악
설정을 완료한 후 다양한 알림음 조합을 시도하여 자신의 워크플로우에 가장 적합한 설정을 찾아보세요.
:::

### 4단계: 클릭 포커스 기능 테스트

알림을 클릭하면 터미널 창이 자동으로 맨 앞으로 이동합니다. 이것은 macOS 고유의 기능입니다.

**이유**

알림을 받았을 때 수동으로 터미널로 전환하고 창을 찾을 필요 없이 알림을 클릭하면 바로 작업 상태로 돌아갑니다.

**작업**

1. OpenCode가 실행 중인지 확인하고 AI 작업을 시작합니다
2. 다른 앱(예: 브라우저)으로 전환합니다
3. AI 작업이 완료될 때까지 기다리면 "Ready for review" 알림을 받게 됩니다
4. 알림 카드를 클릭합니다

**다음을 확인해야 합니다**

- 알림이 사라짐
- 터미널 창이 자동으로 맨 앞으로 이동하고 포커스를 받음
- AI의 출력을 즉시 검토할 수 있음

::: info 포커스 원리
플러그인은 osascript를 통해 터미널 앱의 Bundle ID를 동적으로 가져온 다음 알림을 보낼 때 `activate` 옵션을 전달합니다. macOS Notification Center가 이 옵션을 받으면 알림 클릭 시 해당 앱이 자동으로 활성화됩니다.
:::

### 5단계: 포커스 감지 기능 확인

터미널을 보고 있을 때는 알림을 받지 않습니다. 이렇게 하면 중복 알림을 방지할 수 있습니다.

**이유**

이미 터미널을 보고 있다면 알림은 불필요합니다. 다른 앱으로 전환했을 때만 알림이 의미가 있습니다.

**작업**

1. OpenCode를 열고 AI 작업을 시작합니다
2. 터미널 창을 포그라운드에 유지합니다(전환하지 않음)
3. 작업이 완료될 때까지 기다립니다

**다음을 확인해야 합니다**

- "Ready for review" 알림을 받지 않음
- 터미널 내에 작업 완료가 표시됨

**다음으로 시도해 보세요**:

1. 다른 AI 작업을 시작합니다
2. 브라우저나 다른 앱으로 전환합니다
3. 작업이 완료될 때까지 기다립니다

**다음을 확인해야 합니다**

- "Ready for review" 알림을 받음
- 설정된 알림음이 재생됨(기본값 Glass)

::: tip 포커스 감지의 스마트함
플러그인은 터미널을 보고 있을 때와 그렇지 않을 때를 알고 있습니다. 이렇게 하면 중요한 알림을 놓치지 않으면서도 중복 알림으로 방해받지 않습니다.
:::

## 체크포인트 ✅

### 설정 확인

- [ ] 설정 파일 `~/.config/opencode/kdco-notify.json`이 존재함
- [ ] `sounds` 필드가 설정됨(최소 idle, error, permission 포함)
- [ ] `terminal` 필드가 설정되지 않음(자동 감지 사용)

### 기능 확인

- [ ] AI 작업 완료 후 알림을 받을 수 있음
- [ ] 알림 클릭 후 터미널 창이 맨 앞으로 이동함
- [ ] 터미널 창이 포그라운드에 있을 때 중복 알림을 받지 않음
- [ ] 다른 이벤트 유형에 다른 알림음이 재생됨

::: danger 포커스 감지가 작동하지 않나요?
알림 클릭 후 터미널이 맨 앞으로 이동하지 않는다면 다음이 원인일 수 있습니다:
1. 터미널 앱이 올바르게 인식되지 않음 - 설정 파일의 `terminal` 필드 확인
2. Bundle ID 가져오기 실패 - OpenCode 로그에서 오류 메시지 확인
:::

## 문제 해결

### 알림음이 재생되지 않음

**문제**: 알림음을 설정했지만 알림 시 소리가 나지 않음

**가능한 원인**:
1. 시스템 볼륨이 너무 낮거나 음소거됨
2. macOS 시스템 환경설정에서 알림 소리가 비활성화됨

**해결 방법**:
1. 시스템 볼륨 및 알림 설정 확인
2. "시스템 설정 → 알림 → OpenCode"를 열고 소리가 활성화되어 있는지 확인

### 알림 클릭 시 포커스되지 않음

**문제**: 알림 클릭 후 터미널 창이 맨 앞으로 이동하지 않음

**가능한 원인**:
1. 터미널 앱이 자동으로 감지되지 않음
2. Bundle ID 가져오기 실패

**해결 방법**:
1. 터미널 유형을 수동으로 지정:
   ```json
   {
     "terminal": "ghostty"  // 또는 다른 터미널 이름
   }
   ```

2. 터미널 앱 이름이 올바른지 확인(대소문자 구분)

### 포커스 감지가 작동하지 않음

**문제**: 터미널이 포그라운드에 있어도 여전히 알림을 받음

**가능한 원인**:
1. 터미널 프로세스 이름 감지 실패
2. 터미널 앱이 자동 감지 목록에 없음

**해결 방법**:
1. 터미널 유형을 수동으로 지정:
   ```json
   {
     "terminal": "ghostty"  // 또는 다른 터미널 이름
   }
   ```

2. 터미널 앱 이름이 올바른지 확인(대소문자 구분)
3. 로그를 확인하여 터미널이 올바르게 인식되었는지 확인

## 요약

macOS 플랫폼은 완전한 알림 경험을 제공합니다:

| 기능 | 용도 | 플랫폼 지원 |
| --- | --- | --- |
| 네이티브 알림 | 시스템 수준 알림 표시 | ✅ macOS<br>✅ Windows<br>✅ Linux |
| 사용자 정의 알림음 | 다른 이벤트에 다른 소리 | ✅ macOS |
| 포커스 감지 | 중복 알림 방지 | ✅ macOS |
| 클릭 포커스 | 빠른 작업 복귀 | ✅ macOS |

**핵심 설정**:
```json
{
  "sounds": {
    "idle": "Glass",       // 작업 완료
    "error": "Basso",      // 오류
    "permission": "Submarine"  // 권한 요청
  }
}
```

**워크플로우**:
1. AI 작업 완료 → 알림 전송 → Glass 알림음 재생
2. 브라우저에서 작업 중 → 알림 수신 → 클릭
3. 터미널 자동으로 맨 앞으로 이동 → AI 출력 검토

## 다음 수업 미리보기

> 다음 수업에서는 **[Windows 플랫폼 기능](../windows/)**을 학습합니다.
>
> 다음을 학습하게 됩니다:
> - Windows 플랫폼에서 지원하는 기능
> - macOS와 비교한 차이점
> - Windows에서 알림을 설정하는 방법

---

## 부록: ��스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 포커스 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| 클릭 포커스 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Bundle ID 가져오기 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| 포그라운드 앱 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| 터��널 이름 매핑 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 기본 알림음 설정 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| macOS 알림음 목록 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| 플랫폼 기능 비교표 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**핵심 상수**:

- `TERMINAL_PROCESS_NAMES` (행 71-84): 터미널 이름에서 macOS 프로세스 이름으로의 매핑 테이블
  - `ghostty` → `"Ghostty"`
  - `kitty` → `"kitty"`
  - `iterm` / `iterm2` → `"iTerm2"`
  - `wezterm` → `"WezTerm"`
  - `alacritty` → `"Alacritty"`
  - `terminal` / `apple_terminal` → `"Terminal"`
  - `hyper` → `"Hyper"`
  - `warp` → `"Warp"`
  - `vscode` → `"Code"`
  - `vscode-insiders` → `"Code - Insiders"`

**기본 설정**:

- `sounds.idle = "Glass"`: 작업 완료 알림음
- `sounds.error = "Basso"`: 오류 알림음
- `sounds.permission = "Submarine"`: 권한 요청 알림음

**핵심 함수**:

- `isTerminalFocused(terminalInfo)` (행 166-175): 터미널이 포그라운드 앱인지 감지
  - `osascript`를 사용하여 포그라운드 앱 프로세스 이름 가져오기
  - 터미널의 `processName`과 비교(대소문자 구분 없음)
  - macOS 플랫폼에서만 활성화

- `getBundleId(appName)` (행 135-137): 앱의 Bundle ID를 동적으로 가져오기
  - `osascript`를 사용하여 조회
  - Bundle ID는 알림 클릭 포커스 기능에 사용됨

- `getFrontmostApp()` (행 139-143): 현재 포그라운드 앱 가져오기
  - `osascript`를 사용하여 System Events 조회
  - 포그라운드 앱의 프로세스 이름 반환

- `sendNotification(options)` (행 227-243): 알림 전송
  - macOS 기능: 플랫폼이 darwin이고 `terminalInfo.bundleId`가 있으면 `activate` 옵션을 설정하여 클릭 포커스 구현

</details>
