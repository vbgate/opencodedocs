---
title: "지원되는 터미널: 37개 이상의 터미널 에뮬레이터 전체 목록 및 자동 감지 원리 완벽 해설 | opencode-notify 튜토리얼"
sidebarTitle: "터미널이 지원되나요"
subtitle: "지원되는 터미널 목록: 37개 이상의 터미널 에뮬레이터 전체 수록"
description: "opencode-notify가 지원하는 37개 이상의 터미널 에뮬레이터를 학습합니다. macOS, Windows, Linux 플랫폼의 완전한 터미널 목록이 포함됩니다. 본 튜토리얼에서는 터미널 자동 감지 원리, 수동 지정 방법, 터미널 인식 실패 문제 해결을 소개하여 알림 경험을 최적화하고, 스마트 필터링 기능을 활성화하며, 알림 노이즈를 피하고, 창 전환을 줄이고, 집중된 작업 상태를 유지하며 효율성과 경험을 효과적으로 높이는 방법을 안내합니다."
tags:
  - "터미널"
  - "터미널 감지"
  - "플랫폼 지원"
prerequisite:
  - "start-quick-start"
order: 60
---

# 지원되는 터미널 목록: 37개 이상의 터미널 에뮬레이터 전체 수록

## 학습 후 할 수 있는 것

- opencode-notify가 지원하는 모든 터미널 에뮬레이터 이해
- 사용 중인 터미널이 지원 목록에 있는지 확인
- 터미널 자동 감지 작동 원리 이해
- 터미널 유형을 수동으로 지정하는 방법 학습

## 현재 겪고 계신 문제점

opencode-notify를 설치했지만 알림 기능이 정상적으로 작동하지 않습니다. 터미널을 인식하지 못하거나 포커스 감지가 실패할 수 있습니다. 사용 중인 터미널은 Alacritty / Windows Terminal / tmux이며 지원되는지 확실하지 않습니다. 터미널 인식 실패로 인해 스마트 필터링 기능이 작동하지 않아 사용 경험에 영향을 줍니다.

## 언제 사용해야 하나요

**다음 시나리오에서 지원되는 터미널 목록 확인**:
- 사용 중인 터미널이 지원되는지 알고 싶을 때
- 터미널 자동 감지가 실패하여 수동 구성이 필요할 때
- 여러 터미널 간에 전환하며 호환성을 이해하고 싶을 때
- 터미널 감지의 기술 원리를 알고 싶을 때

## 핵심 원리

opencode-notify는 `detect-terminal` 라이브러리를 사용하여 사용 중인 터미널 에뮬레이터를 자동으로 인식하며 **37개 이상의 터미널을 지원**합니다. 감지에 성공하면 플러그인은 다음을 수행할 수 있습니다:
- **포커스 감지 활성화**(macOS만 해당): 터미널이 포그라운드에 있을 때 알림 억제
- **클릭 포커스 지원**(macOS만 해당): 알림을 클릭하면 터미널 창으로 전환

::: info 왜 터미널 감지가 중요한가요?

터미널 감지는 스마트 필터링의 기반입니다:
- **포커스 감지**: 터미널을 보고 있을 때도 알림이 팝업되는 것을 방지
- **클릭 포커스**: macOS 사용자가 알림을 클릭하면 터미널로 바로 돌아갈 수 있음
- **성능 최적화**: 다른 터미널은 특별한 처리가 필요할 수 있음

감지에 실패해도 알림 기능은 계속 사용할 수 있지만 스마트 필터링은 작동하지 않습니다.
:::

## 지원되는 터미널 목록

### macOS 터미널

| 터미널 이름 | 프로세스 이름 | 특성 |
|---|---|---|
| **Ghostty** | Ghostty | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **iTerm2** | iTerm2 | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **Kitty** | kitty | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **WezTerm** | WezTerm | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **Alacritty** | Alacritty | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **Terminal.app** | Terminal | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **Hyper** | Hyper | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **Warp** | Warp | ✅ 포커스 감지 + ✅ 클릭 포커스 |
| **VS Code 통합 터미널** | Code / Code - Insiders | ✅ 포커스 감지 + ✅ 클릭 포커스 |

::: tip macOS 터미널 특성
macOS 터미널은 완전한 기능을 지원합니다:
- 네이티브 알림(Notification Center)
- 포커스 감지(AppleScript 통해)
- 알림 클릭 시 터미널 자동 포커스
- 사용자 정의 시스템 알림음

모든 터미널은 macOS Notification Center를 통해 알림을 보냅니다.
:::

### Windows 터미널

| 터미널 이름 | 특성 |
|---|---|
| **Windows Terminal** | ✅ 네이티브 알림(Toast) |
| **Git Bash** | ✅ 네이티브 알림(Toast) |
| **ConEmu** | ✅ 네이티브 알림(Toast) |
| **Cmder** | ✅ 네이티브 알림(Toast) |
| **PowerShell** | ✅ 네이티브 알림(Toast) |
| **VS Code 통합 터미널** | ✅ 네이티브 알림(Toast) |
| **기타 Windows 터미널** | ✅ 네이티브 알림(Toast) |

::: details Windows 터미널 제한 사항
Windows 플랫폼의 기능은 상대적으로 기본적입니다:
- ✅ 네이티브 알림(Windows Toast)
- ✅ 터미널 감지
- ❌ 포커스 감지(시스템 제한)
- ❌ 클릭 포커스(시스템 제한)

모든 Windows 터미널은 Windows Toast를 통해 알림을 보내며 시스템 기본 소리를 사용합니다.
:::

### Linux 터미널

| 터미널 이름 | 특성 |
|---|---|
|---|---|
| **konsole** | ✅ 네이티브 알림(notify-send) |
| **xterm** | ✅ 네이티브 알림(notify-send) |
| **lxterminal** | ✅ 네이티브 알림(notify-send) |
|---|---|
|---|---|
| **alacritty** | ✅ 네이티브 알림(notify-send) |
| **kitty** | ✅ 네이티브 알림(notify-send) |
| **wezterm** | ✅ 네이티브 알림(notify-send) |
| **VS Code 통합 터미널** | ✅ 네이티브 알림(notify-send) |
| **기타 Linux 터미널** | ✅ 네이티브 알림(notify-send) |

::: details Linux 터미널 제한 사항
Linux 플랫폼의 기능은 상대적으로 기본적입니다:
- ✅ 네이티브 알림(notify-send)
- ✅ 터미널 감지
- ❌ 포커스 감지(시스템 제한)
- ❌ 클릭 포커스(시스템 제한)

모든 Linux 터미널은 notify-send를 통해 알림을 보내며 데스크톱 환경 기본 소리를 사용합니다.
:::

### 기타 지원되는 터미널

`detect-terminal` 라이브러리는 다음 터미널도 지원합니다(완전히 나열되지 않을 수 있음):

**Windows / WSL**:
- WSL 터미널
- Windows 명령 프롬프트(cmd)
- PowerShell(pwsh)
- PowerShell Core(pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**:
- tmux(환경 변수를 통해 감지)
- screen
- rxvt-unicode(urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip 터미널 수 통계
opencode-notify는 `detect-terminal` 라이브러리를 통해 **37개 이상의 터미널 에뮬레이터**를 지원합니다.
사용 중인 터미널이 목록에 없다면 [detect-terminal 전체 목록](https://github.com/jonschlinkert/detect-terminal#supported-terminals)을 확인할 수 있습니다.
:::

## 터미널 감지 원리

### 자동 감지 프로세스

플러그인이 시작될 때 자동으로 터미널 유형을 감지합니다:

```
1. detect-terminal() 라이브러리 호출
    ↓
2. 시스템 프로세스를 스캔하여 현재 터미널 식별
    ↓
3. 터미널 이름 반환(예: "ghostty", "kitty")
    ↓
4. 매핑 테이블을 조회하여 macOS 프로세스 이름 가져오기
    ↓
5. macOS: 동적으로 Bundle ID 가져오기
    ↓
6. 터미널 정보를 저장하여 향후 알림에 사용
```

### macOS 터미널 매핑 테이블

소스 코드에 일반적으로 사용되는 터미널의 프로세스 이름 매핑이 미리 정의되어 있습니다:

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details 감지 소스 코드
전체 터미널 감지 로직:

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null

    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }

    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName

    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)

    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### macOS 특별 처리

macOS 플랫폼에는 추가 감지 단계가 있습니다:

1. **Bundle ID 가져오기**: `osascript`를 통해 앱의 Bundle ID를 동적으로 조회(예: `com.mitchellh.ghostty`)
2. **포커스 감지**: `osascript`를 통해 포그라운드 앱 프로세스 이름 조회
3. **클릭 포커스**: 알림에 `activate` 매개변수를 설정하고 클릭 시 Bundle ID를 통해 터미널로 전환

::: info 동적 Bundle ID의 장점
소스 코드는 Bundle ID를 하드코딩하지 않고 `osascript`를 통해 동적으로 조회합니다. 이것은 다음을 의미합니다:
- ✅ 터미널 업데이트 지원(Bundle ID가 동일하면 됨)
- ✅ 유지 관리 비용 감소(목록을 수동으로 업데이트할 필요 없음)
- ✅ 더 나은 호환성(모든 macOS 터미널은 이론적으로 지원됨)
:::

### tmux 터미널 지원

tmux는 터미널 멀티플렉서이며 플러그인은 환경 변수를 통해 tmux 세션을 감지합니다:

```bash
# tmux 세션 내에서
echo $TMUX
# 출력: /tmp/tmux-1000/default,1234,0

# tmux 외부
echo $TMUX
# 출력: (비어 있음)
```

::: tip tmux 워크플로우 지원
tmux 사용자는 알림 기능을 정상적으로 사용할 수 있습니다:
- tmux 세션 자동 감지
- 알림을 현재 터미널 창으로 전송
- **포커스 감지 수행 안 함**(tmux 다중 창 워크플로우 지원)
:::

## 터미널 수동 지정

자동 감지가 실패하면 설정 파일에서 터미널 유형을 수동으로 지정할 수 있습니다.

### 언제 수동 지정이 필요한가요?

다음 상황에서 수동 구성이 필요합니다:
- 사용 중인 터미널이 `detect-terminal` 지원 목록에 없을 때
- 한 터미널 내에서 다른 터미널을 중첩하여 사용할 때(예: tmux + Alacritty)
- 자동 감지 결과가 올바르지 않을 때(다른 터미널로 잘못 인식됨)

### 구성 방법

**1단계: 설정 파일 열기**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**2단계: terminal 구성 추가**

```json
{
  "terminal": "ghostty"
}
```

**3단계: 저장하고 OpenCode 다시 시작**

### 사용 가능한 터미널 이름

터미널 이름은 `detect-terminal` 라이브러리가 인식하는 이름이어야 합니다. 일반적인 이름:

| 터미널 | 구성 값 |
|---|---|
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` 또는 `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` 또는 `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` 또는 `"Windows Terminal"` |

::: details 사용 가능한 전체 이름
[detect-terminal 소스 코드](https://github.com/jonschlinkert/detect-terminal)에서 전체 목록을 확인하세요.
:::

### macOS 터미널 완전 기능 예시

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Windows/Linux 터미널 예시

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Windows/Linux 구성 제한 사항
Windows와 Linux는 `sounds` 구성 항목을 지원하지 않으며(시스템 기본 소리 사용), 포커스 감지도 지원하지 않습니다(시스템 제한).
:::

## 체크포인트 ✅

읽기를 완료한 후 다음을 확인하세요:

- [ ] 사용 중인 터미널이 지원되는지 알고 있음
- [ ] 터미널 자동 감지 원리를 이해함
- [ ] 터미널 유형을 수동으로 지정하는 방법을 알고 있음
- [ ] 다른 플랫폼의 기능 차이를 이해함

## 문제 해결 팁

### 일반적인 문제 1: 터미널 감지 실패

**현상**: 알림이 표시되지 않거나 포커스 감지가 작동하지 않음

**원인**: `detect-terminal`에서 터미널을 인식하지 못함

**해결 방법**:

1. 터미널 이름이 올바른지 확인(대소문자 구분)
2. 설정 파일에서 수동으로 지정:

```json
{
  "terminal": "터미널 이름"
}
```

3. [detect-terminal 지원 목록](https://github.com/jonschlinkert/detect-terminal#supported-terminals) 확인

### 일반적인 문제 2: macOS 클릭 포커스가 작동하지 않음

**현상**: 알림을 클릭해도 터미널 창으로 전환되지 않음

**원인**: Bundle ID 가져오기 실패 또는 터미널이 매핑 테이블에 없음

**해결 방법**:

1. 터미널이 `TERMINAL_PROCESS_NAMES` 매핑 테이블에 있는지 확인
2. 없다면 터미널 이름을 수동으로 지정

**확인 방법**:

```typescript
// 임시 디버깅(notify.ts에 console.log 추가)
console.log("Terminal info:", terminalInfo)
// 다음을 볼 수 있어야 함: { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### 일반적인 문제 3: tmux 터미널 포커스 감지가 작동하지 않음

**현상**: tmux 세션에서 터미널이 포그라운드에 있어도 알림이 계속 팝업됨

**원인**: tmux에는 자체 세션 관리가 있어 포커스 감지가 부정확할 수 있음

**설명**: 이것은 정상적인 현상입니다. tmux 워크플로우에서는 포커스 감지 기능이 제한되지만 알림은 정상적으로 받을 수 있습니다.

### 일반적인 문제 4: VS Code 통합 터미널이 Code로 인식됨

**현상**: 구성에서 `"vscode"`와 `"vscode-insiders"`가 모두 유효하지만 무엇을 사용해야 할지 모름

**설명**:
- **VS Code Stable** 사용 → `"vscode"` 구성
- **VS Code Insiders** 사용 → `"vscode-insiders"` 구성

자동 감지는 설치된 버전에 따라 올바른 프로세스 이름을 자동으로 선택합니다.

### 일반적인 문제 5: Windows Terminal 인식 실패

**현상**: Windows Terminal이 "windows-terminal" 이름을 사용하지만 감지되지 않음

**원인**: Windows Terminal의 프로세스 이름은 `WindowsTerminal.exe` 또는 `Windows Terminal`일 수 있음

**해결 방법**: 다른 구성 값을 시도:

```json
{
  "terminal": "windows-terminal"  // 또는 "Windows Terminal"
}
```

## 본 수업 요약

본 수업에서 다음을 학습했습니다:

- ✅ opencode-notify는 37개 이상의 터미널 에뮬레이터를 지원함
- ✅ macOS 터미널은 완전한 기능을 지원함(포커스 감지 + 클릭 포커스)
- ✅ Windows/Linux 터미널은 기본 알림을 지원함
- ✅ 터미널 자동 감지 원리 및 소스 코드 구현
- ✅ 터미널 유형을 수동으로 지정하는 방법
- ✅ 일반적인 터미널 인식 문제 해결 방법

**핵심 요점**:
1. 터미널 감지는 스마트 필터링의 기반이며 37개 이상의 터미널을 지원함
2. macOS 터미널 기능이 가장 풍부하며 Windows/Linux 기능은 상대적으로 기본적임
3. 자동 감지가 실패하면 터미널 이름을 수동으로 구성할 수 있음
4. tmux 사용자는 알림을 정상적으로 사용할 수 있지만 포커스 감지는 제한됨
5. macOS의 Bundle ID는 동적으로 가져오므로 호환성이 더 좋음

## 다음 수업 미리보기

> 다음 수업에서는 **[구성 참조](../../advanced/config-reference/)**를 학습합니다.
>
> 다음을 학습하게 됩니다:
> - 전체 구성 항목 설명 및 기본값
> - 알림음 사용자 정의(macOS)
> - 무음 시간 구성
> - 하위 세션 알림 켜기/끄기
> - 터미널 유형 재정의
> - 고급 구성 팁

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|---|---|---|
| 터미널 매핑 테이블 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 터미널 감지 함수 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS Bundle ID 가져오기 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| macOS 포그라운드 앱 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| macOS 포커스 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**핵심 상수**:
- `TERMINAL_PROCESS_NAMES`: 터미널 이름에서 macOS 프로세스 이름으로의 매핑 테이블

**핵심 함수**:
- `detectTerminalInfo()`: 터미널 정보 감지(이름, Bundle ID, 프로세스 이름)
- `detectTerminal()`: detect-terminal 라이브러리를 호출하여 터미널 식별
- `getBundleId()`: osascript를 통해 macOS 앱의 Bundle ID를 동적으로 가져오기
- `getFrontmostApp()`: 현재 포그라운드 앱 이름 조회
- `isTerminalFocused()`: 터미널이 포그라운드 창인지 감지(macOS만 해당)

**외부 종속성**:
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal): 터미널 감지 라이브러리, 37개 이상의 터미널 지원

</details>
