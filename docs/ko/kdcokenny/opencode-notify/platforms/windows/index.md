---
title: "Windows 플랫폼 사용 가이드: 네이티브 알림, 터미널 감지 및 설정 상세 | opencode-notify 튜토리얼"
sidebarTitle: "Windows에서 알림 사용"
subtitle: "Windows 플랫폼 특성: 네이티브 알림과 터미널 감지"
description: "opencode-notify의 Windows 플랫폼 기능과 제한 사항을 학습합니다. Windows 네이티브 알림과 터미널 감지 기능을 마스터하고, macOS 플랫폼과의 기능 차이를 이해하며, 최적의 알림 전략을 설정하여 효율성을 높이고 방해 없이 집중할 수 있습니다."
tags:
  - "Windows"
  - "플랫폼 특성"
  - "터미널 감지"
prerequisite:
  - "start-quick-start"
order: 40
---

# Windows 플랫폼 특성: 네이티브 알림과 터미널 감지

## 학습 목표

- opencode-notify가 Windows 플랫폼에서 지원하는 기능 이해
- Windows 터미널 감지 작동 방식 마스터
- macOS 플랫폼과의 기능 차이 이해
- Windows에 적합한 알림 전략 설정

## 현재 겪고 있는 문제

Windows에서 OpenCode를 사용하다 보면 일부 기능이 macOS만큼 스마트하지 않다는 것을 발견합니다. 터미널에 포커스가 있어도 알림이 계속 뜨고, 알림을 클릭해도 터미널 창으로 돌아가지 않습니다. 이것이 정상인가요? Windows 플랫폼에는 어떤 제한이 있나요?

## 이 기능이 필요한 상황

**다음 시나리오에서 Windows 플랫폼 특성을 이해하세요**:
- Windows 시스템에서 opencode-notify를 사용하는 경우
- 일부 macOS 기능이 Windows에서 작동하지 않는 것을 발견한 경우
- Windows 플랫폼에서 사용 가능한 기능을 최대한 활용하고 싶은 경우

## 핵심 개념

opencode-notify는 Windows 플랫폼에서 **기본 알림 기능**을 제공하지만, macOS에 비해 일부 기능 제한이 있습니다. 이는 운영 체제 특성에 의한 것이며, 플러그인의 문제가 아닙니다.

::: info macOS 기능이 더 풍부한 이유

macOS는 더 강력한 시스템 API를 제공합니다:
- NSUserNotificationCenter가 클릭 시 포커스 전환 지원
- AppleScript로 전면 앱 감지 가능
- 시스템 사운드 API로 커스텀 사운드 허용

Windows와 Linux의 시스템 알림 API는 상대적으로 기본적이며, opencode-notify는 이러한 플랫폼에서 `node-notifier`를 통해 시스템 네이티브 알림을 호출합니다.
:::

## Windows 플랫폼 기능 개요

| 기능 | Windows | 설명 |
| --- | --- | --- |
| **네이티브 알림** | ✅ 지원 | Windows Toast를 통해 알림 전송 |
| **터미널 감지** | ✅ 지원 | 37개 이상의 터미널 에뮬레이터 자동 인식 |
| **포커스 감지** | ❌ 미지원 | 터미널이 전면 창인지 감지 불가 |
| **클릭 시 포커스** | ❌ 미지원 | 알림 클릭 시 터미널로 전환되지 않음 |
| **커스텀 사운드** | ❌ 미지원 | 시스템 기본 알림 소리 사용 |

### Windows 알림 메커니즘

opencode-notify는 Windows에서 **Windows Toast** 알림을 사용하며, `node-notifier` 라이브러리를 통해 시스템 네이티브 API를 호출합니다.

**알림 트리거 시점**:
- AI 작업 완료 시 (session.idle)
- AI 실행 오류 시 (session.error)
- AI 권한 요청 시 (permission.updated)
- AI 질문 시 (tool.execute.before)

::: tip Windows Toast 알림 특징
- 알림이 화면 오른쪽 하단에 표시됨
- 자동으로 사라짐 (약 5초)
- 시스템 기본 알림 소리 사용
- 알림 클릭 시 알림 센터가 열림 (터미널로 전환되지 않음)
:::

## 터미널 감지

### 자동 터미널 인식

opencode-notify는 `detect-terminal` 라이브러리를 사용하여 사용 중인 터미널 에뮬레이터를 자동으로 감지합니다.

**Windows 지원 터미널**:
- Windows Terminal (권장)
- Git Bash
- ConEmu
- Cmder
- PowerShell
- VS Code 통합 터미널

::: details 터미널 감지 원리
플러그인 시작 시 `detect-terminal()`이 시스템 프로세스를 스캔하여 현재 터미널 유형을 식별합니다.

소스 코드 위치: `src/notify.ts:145-147`

```typescript
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
	const terminalName = config.terminal || detectTerminal() || null
	
	if (!terminalName) {
		return { name: null, bundleId: null, processName: null }
	}
	
	return {
		name: terminalName,
		bundleId: null,  // Windows는 bundleId 불필요
		processName: null,  // Windows는 프로세스명 불필요
	}
}
```
:::

### 수동 터미널 지정

자동 감지가 실패하면 설정 파일에서 터미널 유형을 수동으로 지정할 수 있습니다.

**설정 예시**:

```json
{
  "terminal": "Windows Terminal"
}
```

**사용 가능한 터미널 이름**: [`detect-terminal` 지원 터미널 목록](https://github.com/jonschlinkert/detect-terminal#supported-terminals)을 참조하세요.

## 플랫폼 기능 비교

| 기능 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| **네이티브 알림** | ✅ Notification Center | ✅ Toast | ✅ notify-send |
| **커스텀 사운드** | ✅ 시스템 사운드 목록 | ❌ 시스템 기본 | ❌ 시스템 기본 |
| **포커스 감지** | ✅ AppleScript API | ❌ 미지원 | ❌ 미지원 |
| **클릭 시 포커스** | ✅ activate bundleId | ❌ 미지원 | ❌ 미지원 |
| **터미널 감지** | ✅ 37개 이상 터미널 | ✅ 37개 이상 터미널 | ✅ 37개 이상 터미널 |

### Windows에서 포커스 감지가 지원되지 않는 이유

소스 코드에서 `isTerminalFocused()` 함수는 Windows에서 직접 `false`를 반환합니다:

```typescript
// src/notify.ts:166-168
async function isTerminalFocused(terminalInfo: TerminalInfo): Promise<boolean> {
	if (!terminalInfo.processName) return false
	if (process.platform !== "darwin") return false  // ← Windows/Linux는 직접 false 반환
	// ... macOS의 포커스 감지 로직
}
```

**이유**:
- Windows는 macOS AppleScript와 같은 전면 앱 조회 API를 제공하지 않음
- Windows PowerShell로 전면 창을 가져올 수 있지만 COM 인터페이스 호출이 필요하여 구현이 복잡함
- 현재 버전은 안정성을 우선시하여 Windows 포커스 감지를 아직 구현하지 않음

### Windows에서 클릭 시 포커스가 지원되지 않는 이유

소스 코드에서 `sendNotification()` 함수는 macOS에서만 `activate` 옵션을 설정합니다:

```typescript
// src/notify.ts:238-240
// macOS 전용: 알림 클릭 시 터미널로 포커스
if (process.platform === "darwin" && terminalInfo.bundleId) {
	notifyOptions.activate = terminalInfo.bundleId
}
```

**이유**:
- Windows Toast는 `activate` 매개변수를 지원하지 않음
- Windows 알림은 앱 ID로만 연결할 수 있으며, 대상 창을 동적으로 지정할 수 없음
- 알림 클릭 시 특정 창으로 포커스되지 않고 알림 센터가 열림

## Windows 플랫폼 모범 사례

### 설정 권장 사항

Windows는 포커스 감지를 지원하지 않으므로, 알림 노이즈를 줄이기 위해 설정을 조정하는 것이 좋습니다.

**권장 설정**:

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

**설정 설명**:
- `notifyChildSessions: false` - 부모 세션만 알림, 하위 작업 노이즈 방지
- `quietHours.enabled: true` - 방해 금지 시간 활성화, 야간 방해 방지

### 지원되지 않는 설정 항목

다음 설정 항목은 Windows에서 효과가 없습니다:

| 설정 항목 | macOS 효과 | Windows 효과 |
| --- | --- | --- |
| `sounds.idle` | Glass 사운드 재생 | 시스템 기본 소리 사용 |
| `sounds.error` | Basso 사운드 재생 | 시스템 기본 소리 사용 |
| `sounds.permission` | Submarine 사운드 재생 | 시스템 기본 소리 사용 |

### 사용 팁

**팁 1: 수동으로 알림 끄기**

터미널을 보고 있어서 방해받고 싶지 않다면:

1. 작업 표시줄의 "알림 센터" 아이콘 클릭 (Windows + A)
2. opencode-notify 알림 끄기

**팁 2: 방해 금지 시간 사용**

근무 시간과 휴식 시간을 설정하여 비근무 시간에 방해받지 않도록 합니다:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "18:00",
    "end": "09:00"
  }
}
```

**팁 3: 플러그인 임시 비활성화**

알림을 완전히 비활성화해야 하는 경우, 설정 파일을 삭제하거나 방해 금지 시간을 하루 종일로 설정할 수 있습니다:

```json
{
  "quietHours": {
    "enabled": true,
    "start": "00:00",
    "end": "23:59"
  }
}
```

## 따라하기

### Windows 알림 확인

**1단계: 테스트 알림 트리거**

OpenCode에서 간단한 작업을 입력합니다:

```
1+1의 결과를 계산해 주세요.
```

**예상 결과**:
- 오른쪽 하단에 Windows Toast 알림 표시
- 알림 제목은 "Ready for review"
- 시스템 기본 알림 소리 재생

**2단계: 포커스 억제 테스트 (미지원 확인)**

터미널 창을 전면에 유지한 상태에서 다시 작업을 트리거합니다.

**예상 결과**:
- 알림이 여전히 표시됨 (Windows는 포커스 감지를 지원하지 않기 때문)

**3단계: 알림 클릭 테스트**

표시된 알림을 클릭합니다.

**예상 결과**:
- 터미널 창으로 전환되지 않고 알림 센터가 열림

### 방해 금지 시간 설정

**1단계: 설정 파일 생성**

설정 파일 편집 (PowerShell):

```powershell
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

**2단계: 방해 금지 시간 설정 추가**

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

현재 시간이 방해 금지 시간에 들어갈 때까지 기다린 후 작업을 트리거합니다.

**예상 결과**:
- 알림이 표시되지 않음 (방해 금지 시간 적용됨)

## 체크포인트 ✅

위 단계를 완료한 후 확인하세요:

- [ ] Windows Toast 알림이 정상적으로 표시됨
- [ ] 알림에 올바른 작업 제목이 표시됨
- [ ] 방해 금지 시간 설정이 적용됨
- [ ] Windows 플랫폼에서 지원되지 않는 기능 이해

## 문제 해결

### 일반적인 문제 1: 알림이 표시되지 않음

**원인**: Windows 알림 권한이 부여되지 않음

**해결 방법**:

1. "설정" → "시스템" → "알림" 열기
2. "앱 및 다른 보낸 사람의 알림 받기"가 켜져 있는지 확인
3. OpenCode를 찾아 알림 권한이 켜져 있는지 확인

### 일반적인 문제 2: 터미널 감지 실패

**원인**: `detect-terminal`이 터미널을 인식하지 못함

**해결 방법**:

설정 파일에서 터미널 유형을 수동으로 지정:

```json
{
  "terminal": "Windows Terminal"
}
```

### 일반적인 문제 3: 커스텀 사운드가 적용되지 않음

**원인**: Windows 플랫폼은 커스텀 사운드를 지원하지 않음

**설명**: 이것은 정상적인 현상입니다. Windows Toast 알림은 시스템 기본 소리를 사용하며, 설정 파일로 변경할 수 없습니다.

### 일반적인 문제 4: 알림 클릭 시 터미널로 포커스되지 않음

**원인**: Windows Toast는 `activate` 매개변수를 지원하지 않음

**설명**: 이것은 Windows API의 제한입니다. 알림 클릭 시 알림 센터가 열리며, 터미널 창으로 수동 전환이 필요합니다.

## 이번 강의 요약

이번 강의에서 배운 내용:

- ✅ Windows 플랫폼은 네이티브 알림과 터미널 감지 지원
- ✅ Windows는 포커스 감지와 클릭 시 포커스 미지원
- ✅ Windows는 커스텀 사운드 미지원
- ✅ 권장 설정 (방해 금지 시간, 부모 세션만 알림)
- ✅ 일반적인 문제 해결 방법

**핵심 포인트**:
1. Windows 플랫폼 기능은 상대적으로 기본적이지만, 핵심 알림 기능은 완전함
2. 포커스 감지와 클릭 시 포커스는 macOS 전용 기능
3. 방해 금지 시간 설정으로 알림 노이즈 감소 가능
4. 터미널 감지는 수동 지정을 지원하여 호환성 향상

## 다음 강의 예고

> 다음 강의에서는 **[Linux 플랫폼 특성](../linux/)**을 학습합니다.
>
> 배울 내용:
> - Linux 플랫폼의 알림 메커니즘 (notify-send)
> - Linux 터미널 감지 기능
> - Windows 플랫폼과의 기능 비교
> - Linux 배포판 호환성 문제

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| Windows 플랫폼 제한 검사 (osascript) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L121-L133) | 121-133 |
| Windows 플랫폼 제한 검사 (포커스 감지) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| macOS 전용: 클릭 시 포커스 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| 알림 전송 (크로스 플랫폼) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 터미널 감지 (크로스 플랫폼) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| 설정 로드 (크로스 플랫폼) | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |

**주요 함수**:
- `runOsascript()`: macOS에서만 실행, Windows는 null 반환
- `isTerminalFocused()`: Windows는 직접 false 반환
- `sendNotification()`: macOS에서만 `activate` 매개변수 설정
- `detectTerminalInfo()`: 크로스 플랫폼 터미널 감지

**플랫폼 판별**:
- `process.platform === "darwin"`: macOS
- `process.platform === "win32"`: Windows
- `process.platform === "linux"`: Linux

</details>
