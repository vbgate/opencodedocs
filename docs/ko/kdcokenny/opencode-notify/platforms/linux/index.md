---
title: "Linux 플랫폼 사용 가이드: notify-send 알림 및 터미널 감지 | opencode-notify 튜토리얼"
sidebarTitle: "Linux에서도 알림 발송 가능"
subtitle: "Linux 플랫폼 기능: notify-send 알림 및 터미널 감지"
description: "opencode-notify의 Linux 플랫폼 기능과 제한사항을 학습하세요. Linux 기본 알림과 터미널 감지 기능을 마스터하고, macOS/Windows 플랫폼과의 기능 차이를 이해하며, Linux에 적합한 알림 전략을 구성하여 효율성을 높이세요. 알림 방해를 피하고 집중된 작업 상태를 유지하며, notify-send 설치, 알림 표시 및 일반적인 구성 문제를 해결하세요."
tags:
  - "Linux"
  - "플랫폼 기능"
  - "터미널 감지"
prerequisite:
  - "start-quick-start"
order: 50
---

# Linux 플랫폼 기능: notify-send 알림 및 터미널 감지

## 학습 후 할 수 있는 것

- opencode-notify가 Linux 플랫폼에서 지원하는 기능 이해
- Linux 기본 알림과 터미널 감지 작동 방식 마스터
- macOS/Windows 플랫폼과의 기능 차이 이해
- Linux에 적합한 알림 전략 구성

## 현재 겪고 있는 문제

Linux에서 OpenCode를 사용하는데, 일부 기능이 macOS만큼 스마트하지 않다는 것을 발견했습니다. 터미널에 초점이 있을 때도 알림이 계속 팝업되고, 알림을 클릭해도 터미널 창으로 돌아가지 않습니다. 이것은 정상적인 현상인가요? Linux 플랫폼에는 어떤 제한사항이 있나요?

## 언제 이 기능을 사용해야 하나요

**다음 시나리오에서 Linux 플랫폼 기능을 이해하세요**:
- Linux 시스템에서 opencode-notify를 사용하는 경우
- 일부 macOS 기능이 Linux에서 사용할 수 없다는 것을 발견한 경우
- Linux 플랫폼의 사용 가능한 기능을 최대한 활용하는 방법을 알고 싶은 경우

## 핵심 아이디어

opencode-notify는 Linux 플랫폼에서 **기본 알림 기능**을 제공하지만, macOS와 비교하여 몇 가지 기능 제한이 있습니다. 이는 운영체제 특성에 의해 결정되는 것이지 플러그인의 문제가 아닙니다.

::: info 왜 macOS 기능이 더 풍부한가요?

macOS는 더 강력한 시스템 API를 제공합니다:
- NSUserNotificationCenter는 클릭 초점 지정을 지원합니다
- AppleScript는 전면 애플리케이션을 감지할 수 있습니다
- 시스템 사운드 API는 사용자 정의 사운드를 허용합니다

Linux와 Windows의 시스템 알림 API는 상대적으로 기본적이며, opencode-notify는 이러한 플랫폼에서 `node-notifier`를 통해 시스템 기본 알림을 호출합니다.
:::

## Linux 플랫폼 기능 개요

| 기능 | Linux | 설명 |
|--- | --- | ---|
| **기본 알림** | ✅ 지원 | notify-send를 통해 알림 전송 |
| **터미널 감지** | ✅ 지원 | 37개 이상의 터미널 에뮬레이터 자동 식별 |
| **초점 감지** | ❌ 지원 안 함 | 터미널이 전면 창인지 감지할 수 없음 |
| **클릭 초점 지정** | ❌ 지원 안 함 | 알림을 클릭해도 터미널로 전환되지 않음 |
| **사용자 정의 사운드** | ❌ 지원 안 함 | 시스템 기본 알림 사운드 사용 |

### Linux 알림 메커니즘

opencode-notify는 Linux에서 **notify-send** 명령을 사용하여 시스템 알림을 전송하며, `node-notifier` 라이브러리를 통해 시스템 기본 API를 호출합니다.

**알림 트리거 타이밍**:
- AI 작업 완료 시 (session.idle)
- AI 실행 오류 시 (session.error)
- AI 권한이 필요할 때 (permission.updated)
- AI가 질문할 때 (tool.execute.before)

::: tip notify-send 알림 특징
- 알림이 화면 오른쪽 상단에 표시됨 (GNOME/Ubuntu)
- 자동으로 사라짐 (약 5초)
- 시스템 기본 알림 사운드 사용
- 알림을 클릭하면 알림 센터가 열림 (터미널로 전환되지 않음)
:::

## 터미널 감지

### 터미널 자동 식별

opencode-notify는 `detect-terminal` 라이브러리를 사용하여 사용하는 터미널 에뮬레이터를 자동으로 감지합니다.

**Linux 지원 터미널**:
- gnome-terminal (GNOME 데스크톱 기본)
- konsole (KDE 데스크톱)
- xterm
- lxterminal (LXDE 데스크톱)
- alacritty
- kitty
- terminator
- guake
- tilix
- hyper
- VS Code 통합 터미널
- 그 외 37개 이상의 터미널 에뮬레이터

::: details 터미널 감지 원리

플러그인 시작 시, `detect-terminal()`은 시스템 프로세스를 스캔하여 현재 터미널 유형을 식별합니다.

소스 코드 위치: `src/notify.ts:145-164`

`detectTerminalInfo()` 함수는 다음 작업을 수행합니다:
1. 구성에서 `terminal` 필드 읽기 (수동으로 지정한 경우)
2. `detectTerminal()` 호출하여 터미널 유형 자동 감지
3. 프로세스 이름 가져오기 (macOS 초점 감지용)
4. macOS에서 bundle ID 가져오기 (클릭 초점 지정용)

Linux 플랫폼에서는 `bundleId`와 `processName`이 `null`이 됩니다. Linux는 이러한 정보가 필요하지 않기 때문입니다.
:::

### 터미널 수동 지정

자동 감지가 실패하는 경우, 구성 파일에서 터미널 유형을 수동으로 지정할 수 있습니다.

**구성 예시**:

```json
{
  "terminal": "gnome-terminal"
}
```

**사용 가능한 터미널 이름**: [`detect-terminal` 지원 터미널 목록](https://github.com/jonschlinkert/detect-terminal#supported-terminals)을 참조하세요.

## 플랫폼 기능 비교

| 기능 | macOS | Windows | Linux |
|--- | --- | --- | ---|
| **기본 알림** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **사용자 정의 사운드** | ✅ 시스템 사운드 목록 | ❌ 시스템 기본 | ❌ 시스템 기본 |
| **초점 감지** | ✅ AppleScript API | ❌ 지원 안 함 | ❌ 지원 안 함 |
| **클릭 초점 지정** | ✅ activate bundleId | ❌ 지원 안 함 | ❌ 지원 안 함 |
| **터미널 감지** | ✅ 37개 이상 터미널 | ✅ 37개 이상 터미널 | ✅ 37개 이상 터미널 |

### 왜 Linux는 초점 감지를 지원하지 않나요?

소스 코드에서, `isTerminalFocused()` 함수는 Linux에서 바로 `false`를 반환합니다:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux는 바로 false 반환
	// ... macOS 초점 감지 로직
}
```

**원인**:
- Linux 데스크톱 환경이 다양함 (GNOME, KDE, XFCE 등), 통합된 전면 애플리케이션 조회 API가 없음
- Linux DBus는 활성 창을 가져올 수 있지만, 구현이 복잡하고 데스크톱 환경에 의존함
- 현재 버전은 안정성을 우선으로 하여 Linux 초점 감지는 아직 구현되지 않음

### 왜 Linux는 클릭 초점 지정을 지원하지 않나요?

소스 코드에서, `sendNotification()` 함수는 macOS에서만 `activate` 옵션을 설정합니다:

```typescript
// src/notify.ts:238-240
// macOS 전용: 알림을 클릭하여 터미널에 초점 지정
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**원인**:
- notify-send는 `activate` 매개변수를 지원하지 않음
- Linux 알림은 애플리케이션 ID로만 연결할 수 있으며, 대상 창을 동적으로 지정할 수 없음
- 알림을 클릭하면 알림 센터가 열리며, 특정 창으로 초점 지정되지 않음

### 왜 Linux는 사용자 정의 사운드를 지원하지 않나요?

::: details 사운드 구성 원리

macOS에서, `sendNotification()`은 시스템 알림에 `sound` 매개변수를 전달합니다:

```typescript
// src/notify.ts:227-243
function sendNotification(options: NotificationOptions): void {
	const { title, message, sound, terminalInfo } = options
	
	const notifyOptions: Record<string, unknown> = {
		title,
		message,
		sound,  // ← macOS는 이 매개변수를 받음
	}
	
	// macOS 전용: 알림을 클릭하여 터미널에 초점 지정
	if (process.platform === "darwin" && terminalInfo.bundleId) {
		notifyOptions.activate = terminalInfo.bundleId
	}
	
	notifier.notify(notifyOptions)
}
```

Linux notify-send는 사용자 정의 사운드 매개변수를 지원하지 않으므로, `sounds` 구성은 Linux에서 작동하지 않습니다.
:::

## Linux 플랫폼 모범 사례

### 구성 권장사항

Linux는 초점 감지를 지원하지 않으므로, 알림 노이즈를 줄이기 위해 구성을 조정하는 것이 좋습니다.

**권장 구성**:

```json
{
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**구성 설명**:
- `notifyChildSessions: false` - 부모 세션만 알림, 하위 작업 노이즈 방지
- `quietHours.enabled: true` - 무음 시간 활성화, 밤시간 방해 방지

### 지원되지 않는 구성 항목

다음 구성 항목은 Linux에서 작동하지 않습니다:

| 구성 항목 | macOS 효과 | Linux 효과 |
|--- | --- | ---|
| `sounds.idle` | Glass 사운드 재생 | 시스템 기본 사운드 사용 |
| `sounds.error` | Basso 사운드 재생 | 시스템 기본 사운드 사용 |
| `sounds.permission` | Submarine 사운드 재생 | 시스템 기본 사운드 사용 |

### 사용 팁

**팁 1: 알림 수동 끄기**

터미널을 보고 있고, 방해받고 싶지 않은 경우:

1. 화면 오른쪽 상단의 알림 아이콘 클릭
2. opencode-notify 알림 끄기

**팁 2: 무음 시간 사용**

작업 시간과 휴식 시간을 설정하여 비작업 시간 방해를 피하세요:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**팁 3: 플러그인 일시 비활성화**

알림을 완전히 비활성화해야 하는 경우, `quietHours` 구성을 사용하여 하루 종일 무음을 설정하거나 구성 파일을 삭제/이름 변경하여 플러그인을 비활성화하는 것이 좋습니다.

**팁 4: 시스템 알림 사운드 구성**

opencode-notify는 사용자 정의 사운드를 지원하지 않지만, 시스템 설정에서 기본 알림 사운드를 변경할 수 있습니다:

- **GNOME**: 설정 → 소리 → 알림음
- **KDE**: 시스템 설정 → 알림 → 기본 사운드
- **XFCE**: 설정 → 모양 → 알림 → 소리

## 따라해 보세요

### Linux 알림 확인

**1단계: 테스트 알림 트리거**

OpenCode에서 간단한 작업을 입력하세요:

```
1+1의 결과를 계산해주세요.
```

**다음을 확인해야 합니다**:
- 화면 오른쪽 상단에 notify-send 알림 팝업 (GNOME/Ubuntu)
- 알림 제목이 "Ready for review"임
- 시스템 기본 알림 사운드 재생

**2단계: 초점 억제 테스트 (지원 안 함 확인)**

터미널 창을 전면에 유지한 상태에서 다시 작업을 트리거하세요.

**다음을 확인해야 합니다**:
- 여전히 알림이 팝업됨 (Linux는 초점 감지를 지원하지 않으므로)

**3단계: 알림 클릭 테스트**

팝업된 알림을 클릭하세요.

**다음을 확인해야 합니다**:
- 알림 센터가 확장되며, 터미널 창으로 전환되지 않음

### 무음 시간 구성

**1단계: 구성 파일 생성**

구성 파일을 편집하세요 (bash):

```bash
nano ~/.config/opencode/kdco-notify.json
```

**2단계: 무음 시간 구성 추가**

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**3단계: 저장 및 테스트**

현재 시간이 무음 시간에 들어갈 때까지 기다린 후 작업을 트리거하세요.

**다음을 확인해야 합니다**:
- 알림이 팝업되지 않음 (무음 시간 적용)

## 체크포인트 ✅

위 단계를 완료한 후, 다음을 확인하세요:

- [ ] notify-send 알림이 정상적으로 표시됨
- [ ] 알림에 올바른 작업 제목이 표시됨
- [ ] 무음 시간 구성이 적용됨
- [ ] Linux 플랫폼에서 지원되지 않는 기능 이해

## 주의사항

### 일반적인 문제 1: 알림이 표시되지 않음

**원인 1**: notify-send가 설치되지 않음

**해결 방법**:

```bash
# Ubuntu/Debian
sudo apt install libnotify-bin

# Fedora/RHEL
sudo dnf install libnotify

# Arch Linux
sudo pacman -S libnotify
```

**원인 2**: Linux 알림 권한이 부여되지 않음

**해결 방법**:

1. 시스템 설정 열기
2. '알림' 또는 '개인정보' → '알림' 찾기
3. '애플리케이션에서 알림 보내기 허용'이 활성화되어 있는지 확인
4. OpenCode 찾기, 알림 권한이 켜져 있는지 확인

### 일반적인 문제 2: 터미널 감지 실패

**원인**: `detect-terminal`이 사용하는 터미널을 인식할 수 없음

**해결 방법**:

구성 파일에서 터미널 유형을 수동으로 지정하세요:

```json
{
  "terminal": "gnome-terminal"
}
```

### 일반적인 문제 3: 사용자 정의 사운드가 작동하지 않음

**원인**: Linux 플랫폼은 사용자 정의 사운드를 지원하지 않음

**설명**: 이것은 정상적인 현상입니다. notify-send는 시스템 기본 사운드를 사용하며, 구성 파일로 변경할 수 없습니다.

**해결 방법**: 시스템 설정에서 기본 알림 사운드를 변경하세요.

### 일반적인 문제 4: 알림 클릭 시 터미널 초점 지정 안 됨

**원인**: notify-send는 `activate` 매개변수를 지원하지 않음

**설명**: 이것은 Linux API의 제한입니다. 알림을 클릭하면 알림 센터가 열리며, 터미널 창으로 수동 전환해야 합니다.

### 일반적인 문제 5: 다른 데스크톱 환경의 알림 동작 차이

**현상**: 다른 데스크톱 환경 (GNOME, KDE, XFCE)에서 알림 표시 위치와 동작이 다를 수 있습니다.

**설명**: 이것은 정상이며, 각 데스크톱 환경에는 자체적인 알림 시스템 구현이 있습니다.

**해결 방법**: 사용하는 데스크톱 환경에 따라 시스템 설정에서 알림 동작을 조정하세요.

## 이 강의 요약

이번 강의에서 다음을 배웠습니다:

- ✅ Linux 플랫폼은 기본 알림과 터미널 감지를 지원
- ✅ Linux는 초점 감지와 클릭 초점 지정을 지원하지 않음
- ✅ Linux는 사용자 정의 사운드를 지원하지 않음
- ✅ 권장 구성 (무음 시간, 부모 세션만 알림)
- ✅ 일반적인 문제 해결 방법

**핵심 요점**:
1. Linux 플랫폼 기능은 상대적으로 기본적이지만, 핵심 알림 기능은 완전함
2. 초점 감지와 클릭 초점 지정은 macOS 전용 기능
3. 무음 시간 구성을 통해 알림 노이즈를 줄일 수 있음
4. 터미널 감지는 수동 지정을 지원하여 호환성 향상
5. notify-send는 미리 설치해야 함 (일부 배포판은 기본 포함)

## 다음 강의 미리보기

> 다음 강의에서는 **[지원되는 터미널](../terminals/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - opencode-notify가 지원하는 37개 이상의 터미널 목록
> - 다른 터미널의 감지 메커니즘
> - 터미널 유형 덮어쓰기 구성 방법
> - VS Code 통합 터미널 사용 팁

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| Linux 플랫폼 제한 확인 (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Linux 플랫폼 제한 확인 (초점 감지) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS 전용: 클릭 초점 지정 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 알림 전송 (플랫폼 간) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 터미널 감지 (플랫폼 간) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 구성 로드 (플랫폼 간) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**주요 함수**:
- `runOsascript()`: macOS에서만 실행, Linux는 null 반환
- `isTerminalFocused()`: Linux는 바로 false 반환
- `sendNotification()`: macOS에서만 `activate` 매개변수 설정
- `detectTerminalInfo()`: 플랫폼 간 터미널 감지

**플랫폼 판별**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

**Linux 알림 종속성**:
- 외부 종속성: `node-notifier` → `notify-send` 명령
- 시스템 요구사항: libnotify-bin 또는 동등한 패키지

</details>
