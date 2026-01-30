---
title: "문제 해결: 알림 미표시, 포커스 감지 실패 등 자주 발생하는 문제 | opencode-notify 튜토리얼"
sidebarTitle: "알림이 안 뜰 때"
subtitle: "문제 해결: 알림 미표시, 포커스 감지 실패 등 자주 발생하는 문제"
description: "opencode-notify 사용 중 발생하는 일반적인 문제를 해결합니다. 알림 미표시, 포커스 감지 실패, 설정 오류, 사운드 미재생 등의 문제를 다룹니다. macOS 알림 권한, 방해 금지 시간대 설정, 터미널 감지 등의 문제를 진단하고 플러그인을 정상 작동시키는 방법을 배웁니다."
tags:
  - "문제 해결"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# 문제 해결: 알림 미표시, 포커스 감지 실패 등 자주 발생하는 문제

## 이 강의를 마치면

- 알림이 표시되지 않는 원인을 빠르게 파악할 수 있습니다
- macOS 알림 권한 문제를 해결할 수 있습니다
- 포커스 감지 실패 문제를 진단할 수 있습니다
- 설정 파일 형식 오류를 수정할 수 있습니다
- 플랫폼별 기능 차이를 이해할 수 있습니다

## 현재 겪고 있는 문제

AI가 작업을 완료했는데 알림을 받지 못했거나, 알림을 클릭해도 터미널이 앞으로 나오지 않습니다. 어디서 문제가 발생했는지, 어디서부터 확인해야 할지 모르겠습니다.

## 이 방법이 필요한 상황

- 플러그인 설치 후 처음 사용하는데 알림이 전혀 오지 않을 때
- 플러그인이나 시스템 업데이트 후 알림이 갑자기 작동하지 않을 때
- 특정 알림 동작을 비활성화하고 싶은데 설정이 적용되지 않는 것 같을 때
- macOS에서 Windows/Linux로 전환했는데 일부 기능이 작동하지 않을 때

## 핵심 개념

opencode-notify의 작동 흐름은 비교적 단순하지만 여러 단계를 거칩니다: OpenCode SDK → 이벤트 리스닝 → 필터링 로직 → 운영체제 알림. 어느 단계에서든 문제가 발생하면 알림이 표시되지 않을 수 있습니다.

문제 해결의 핵심은 **각 단계를 순서대로 확인**하는 것이며, 가장 가능성이 높은 원인부터 시작합니다. 80%의 문제는 다음 5가지 유형으로 해결할 수 있습니다:

1. **알림 미표시** - 가장 흔한 문제
2. **포커스 감지 실패** (macOS 전용)
3. **설정 미적용** - JSON 형식 또는 경로 오류
4. **사운드 미재생** (macOS 전용)
5. **플랫폼 차이** - 일부 기능 미지원

---

## 문제 1: 알림이 표시되지 않음

가장 흔한 문제로, 6가지 원인이 있을 수 있습니다. 순서대로 확인하세요:

### 1.1 플러그인이 올바르게 설치되었는지 확인

**증상**: OpenCode는 정상 작동하지만 알림을 전혀 받지 못함.

**진단 단계**:

```bash
# 플러그인 설치 여부 확인
ls ~/.opencode/plugin/kdco-notify

# 존재하지 않으면 재설치
ocx add kdco/notify
```

**정상 상태**: `~/.opencode/plugin/kdco-notify` 디렉토리가 존재하고, `package.json`과 `src/notify.ts` 등의 파일이 포함되어 있어야 합니다.

::: tip 수동 설치 확인
수동으로 설치한 경우 다음을 확인하세요:
1. 의존성 설치 완료: `npm install node-notifier detect-terminal`
2. 플러그인 파일이 올바른 위치에 있음: `~/.opencode/plugin/`
3. OpenCode 재시작 완료 (플러그인 변경 시 재시작 필요)
:::

### 1.2 macOS 알림 권한 확인

**증상**: macOS 사용자 전용, 플러그인은 설치되었지만 알림을 전혀 받지 못함.

**원인**: macOS는 터미널 앱이 알림을 보낼 수 있도록 명시적인 권한 부여가 필요합니다.

**진단 단계**:

```bash
# 1. 시스템 설정 열기
# macOS Ventura 이상: 시스템 설정 → 알림 및 집중 모드
# macOS 이전 버전: 시스템 환경설정 → 알림

# 2. 사용 중인 터미널 앱 찾기 (예: Ghostty, iTerm2, Terminal.app)
# 3. "알림 허용"이 켜져 있는지 확인
# 4. "잠금 화면에서" 및 "화면 잠금 시 배너 표시"가 켜져 있는지 확인
```

**정상 상태**: 터미널 앱이 알림 설정에 표시되고, "알림 허용" 스위치가 녹색이어야 합니다.

::: warning 흔한 실수
OpenCode 자체는 알림 설정에 나타나지 않습니다. 권한을 부여해야 하는 것은 **터미널 앱** (Ghostty, iTerm2, Terminal.app 등)이지, OpenCode가 아닙니다.
:::

### 1.3 방해 금지 시간대 설정 확인

**증상**: 특정 시간대에만 알림이 오지 않고, 다른 시간대에는 정상 작동.

**원인**: 설정 파일에서 방해 금지 시간대가 활성화되어 있음.

**진단 단계**:

```bash
# 설정 파일 확인
cat ~/.config/opencode/kdco-notify.json
```

**해결 방법**:

```json
{
  "quietHours": {
    "enabled": false,  // false로 변경하여 방해 금지 시간대 비활성화
    "start": "22:00",
    "end": "08:00"
  }
}
```

**정상 상태**: `quietHours.enabled`가 `false`이거나, 현재 시간이 방해 금지 시간대에 포함되지 않아야 합니다.

::: tip 자정을 넘기는 방해 금지 시간대
방해 금지 시간대는 자정을 넘기는 설정을 지원합니다 (예: 22:00-08:00). 이는 정상적인 동작입니다. 현재 시간이 밤 10시부터 다음 날 아침 8시 사이라면 알림이 억제됩니다.
:::

### 1.4 터미널 창 포커스 확인

**증상**: 터미널을 보고 있을 때 알림을 받지 못함.

**원인**: 이것은 **의도된 동작**이며 버그가 아닙니다. 포커스 감지 메커니즘은 터미널을 보고 있을 때 알림을 억제하여 중복 알림을 방지합니다.

**진단 단계**:

**터미널에 포커스가 있는지 확인**:
1. 다른 앱으로 전환 (예: 브라우저, VS Code)
2. AI에게 작업 실행 요청
3. 작업 완료 대기

**정상 상태**: 다른 앱에 있을 때 알림이 정상적으로 표시됩니다.

::: tip 포커스 감지 설명
포커스 감지는 내장 동작으로, 설정으로 비활성화할 수 없습니다. 플러그인은 기본적으로 터미널에 포커스가 있을 때 알림을 억제하여 중복 알림을 방지합니다. 이는 의도된 설계입니다.
:::

### 1.5 하위 세션 필터링 확인

**증상**: AI가 여러 하위 작업을 실행했지만 각 하위 작업에 대한 알림을 받지 못함.

**원인**: 이것은 **의도된 동작**입니다. 플러그인은 기본적으로 상위 세션만 알림을 보내고, 하위 세션은 알림을 보내지 않아 알림 폭탄을 방지합니다.

**진단 단계**:

**상위 세션과 하위 세션 이해하기**:
- 상위 세션: 사용자가 직접 AI에게 요청한 작업 (예: "코드베이스 최적화")
- 하위 세션: AI가 자체적으로 분할한 하위 작업 (예: "src/components 최적화", "src/utils 최적화")

**하위 세션 알림이 정말 필요한 경우**:

```json
{
  "notifyChildSessions": true
}
```

**정상 상태**: 각 하위 세션 완료 시 알림을 받습니다.

::: tip 권장 사항
여러 동시 작업을 모니터링하는 경우가 아니라면 `notifyChildSessions: false`를 유지하고 상위 세션 알림만 받는 것이 좋습니다.
:::

### 1.6 설정 파일 삭제 또는 이름 변경 확인

**증상**: 이전에는 알림이 왔는데 갑자기 표시되지 않음.

**진단 단계**:

```bash
# 설정 파일 존재 여부 확인
ls -la ~/.config/opencode/kdco-notify.json
```

**해결 방법**:

설정 파일이 삭제되었거나 경로가 잘못된 경우, 플러그인은 기본 설정을 사용합니다:

**설정 파일 삭제하여 기본값 복원**:

```bash
# 설정 파일 삭제, 기본 설정 사용
rm ~/.config/opencode/kdco-notify.json
```

**정상 상태**: 플러그인이 다시 알림을 보내기 시작합니다 (기본 설정 사용).

---

## 문제 2: 포커스 감지 실패 (macOS 전용)

**증상**: 터미널을 보고 있는데도 알림을 받음, 포커스 감지가 작동하지 않는 것 같음.

### 2.1 터미널이 올바르게 감지되는지 확인

**원인**: 플러그인은 `detect-terminal` 라이브러리를 사용하여 터미널을 자동 인식합니다. 인식에 실패하면 포커스 감지가 작동하지 않습니다.

**진단 단계**:

```bash
# 터미널 감지가 정상인지 확인
node -e "console.log(require('detect-terminal')())"
```

**정상 상태**: 터미널 이름이 출력됩니다 (예: `ghostty`, `iterm2` 등).

출력이 비어 있으면 터미널 감지에 실패한 것입니다.

### 2.2 터미널 유형 수동 지정

**자동 감지가 실패한 경우 수동으로 지정할 수 있습니다**:

```json
{
  "terminal": "ghostty"  // 사용 중인 터미널 이름으로 교체
}
```

**지원되는 터미널 이름** (소문자):

| 터미널 | 이름 | 터미널 | 이름 |
| --- | --- | --- | --- |
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` 또는 `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | macOS Terminal | `terminal` 또는 `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| VS Code 터미널 | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip 프로세스 이름 매핑
플러그인 내부에는 터미널 이름을 macOS 프로세스 이름으로 매핑하는 테이블이 있습니다. `terminal`을 수동으로 지정하는 경우 매핑 테이블의 이름을 사용하세요 (71-84행).
:::

---

## 문제 3: 설정이 적용되지 않음

**증상**: 설정 파일을 수정했지만 플러그인 동작이 변하지 않음.

### 3.1 JSON 형식이 올바른지 확인

**흔한 오류**:

```json
// ❌ 오류: 따옴표 누락
{
  notifyChildSessions: true
}

// ❌ 오류: 후행 쉼표
{
  "notifyChildSessions": true,
}

// ❌ 오류: 주석 미지원
{
  "notifyChildSessions": true  // 이것은 JSON 파싱 실패를 유발합니다
}
```

**올바른 형식**:

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

**JSON 형식 검증**:

```bash
# jq를 사용하여 JSON 형식 검증
cat ~/.config/opencode/kdco-notify.json | jq '.'

# 포맷된 JSON이 출력되면 형식이 올바름
# 오류가 발생하면 JSON에 문제가 있음
```

### 3.2 설정 파일 경로 확인

**증상**: 설정 파일을 만들었지만 플러그인이 읽지 않는 것 같음.

**올바른 경로**:

```
~/.config/opencode/kdco-notify.json
```

**진단 단계**:

```bash
# 설정 파일 존재 여부 확인
ls -la ~/.config/opencode/kdco-notify.json

# 존재하지 않으면 디렉토리와 파일 생성
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 OpenCode 재시작

**원인**: 플러그인은 시작 시 설정을 한 번 로드하므로, 수정 후 재시작이 필요합니다.

**진단 단계**:

```bash
# OpenCode 완전 재시작
# 1. OpenCode 종료
# 2. OpenCode 다시 시작
```

---

## 문제 4: 사운드가 재생되지 않음 (macOS 전용)

**증상**: 알림은 정상적으로 표시되지만 사운드가 재생되지 않음.

### 4.1 사운드 이름이 올바른지 확인

**지원되는 macOS 사운드**:

| 사운드 이름 | 설명 | 사운드 이름 | 설명 |
| --- | --- | --- | --- |
| Basso | 저음 | Blow | 바람 소리 |
| Bottle | 병 소리 | Frog | 개구리 소리 |
| Funk | 펑크 | Glass | 유리 소리 (기본 작업 완료) |
| Hero | 히어로 | Morse | 모스 부호 |
| Ping | 딩 소리 | Pop | 팝 소리 |
| Purr | 가르랑 소리 | Sosumi | Sosumi |
| Submarine | 잠수함 (기본 권한 요청) | Tink | 딩딩 소리 |

**설정 예시**:

```json
{
  "sounds": {
    "idle": "Glass",      // 작업 완료 사운드
    "error": "Basso",    // 오류 사운드
    "permission": "Submarine",  // 권한 요청 사운드
    "question": "Ping"   // 질문 사운드 (선택 사항)
  }
}
```

### 4.2 시스템 볼륨 설정 확인

**진단 단계**:

```bash
# 시스템 설정 → 사운드 → 출력 볼륨 열기
# 볼륨이 음소거되지 않았고 적절한 수준인지 확인
```

### 4.3 다른 플랫폼은 사용자 정의 사운드 미지원

**증상**: Windows 또는 Linux 사용자가 사운드를 설정했지만 소리가 나지 않음.

**원인**: 사용자 정의 사운드는 macOS 전용 기능으로, Windows와 Linux에서는 지원되지 않습니다.

**해결 방법**: Windows와 Linux 사용자는 알림을 받지만, 사운드는 시스템 기본 설정에 의해 제어되며 플러그인으로 설정할 수 없습니다.

::: tip Windows/Linux 사운드
Windows와 Linux의 알림 사운드는 시스템 설정에서 제어됩니다:
- Windows: 설정 → 시스템 → 알림 → 알림 사운드 선택
- Linux: 데스크톱 환경 설정 → 알림 → 사운드
:::

---

## 문제 5: 알림 클릭 시 포커스 안 됨 (macOS 전용)

**증상**: 알림을 클릭해도 터미널 창이 앞으로 나오지 않음.

### 5.1 Bundle ID 획득 성공 여부 확인

**원인**: 알림 클릭 시 포커스 기능은 터미널의 Bundle ID (예: `com.ghostty.Ghostty`)를 가져와야 합니다. 획득에 실패하면 포커스가 작동하지 않습니다.

**진단 단계**:

플러그인은 시작 시 자동으로 터미널을 감지하고 Bundle ID를 가져옵니다. 실패하면 알림 클릭 포커스 기능을 사용할 수 없습니다.

**일반적인 원인**:
1. 터미널이 매핑 테이블에 없음 (사용자 정의 터미널 등)
2. `osascript` 실행 실패 (macOS 권한 문제)

**해결 방법**: 터미널 유형을 수동으로 지정합니다 (2.2절 참조).

### 5.2 시스템 손쉬운 사용 권한 확인

**원인**: macOS는 다른 앱의 창을 제어하려면 "손쉬운 사용" 권한이 필요합니다.

**진단 단계**:

```bash
# 시스템 설정 → 개인 정보 보호 및 보안 → 손쉬운 사용 열기
# 터미널 앱에 손쉬운 사용 권한이 있는지 확인
```

**정상 상태**: 터미널 앱 (Ghostty, iTerm2 등)이 손쉬운 사용 목록에 있고 스위치가 켜져 있어야 합니다.

---

## 문제 6: 플랫폼별 기능 차이

**증상**: macOS에서 Windows/Linux로 전환했는데 일부 기능이 작동하지 않음.

### 6.1 기능 비교표

| 기능 | macOS | Windows | Linux |
| --- | --- | --- | --- |
| 네이티브 알림 | ✅ | ✅ | ✅ |
| 사용자 정의 사운드 | ✅ | ❌ | ❌ |
| 포커스 감지 | ✅ | ❌ | ❌ |
| 알림 클릭 포커스 | ✅ | ❌ | ❌ |
| 터미널 감지 | ✅ | ✅ | ✅ |
| 방해 금지 시간대 | ✅ | ✅ | ✅ |
| 하위 세션 알림 | ✅ | ✅ | ✅ |

**설명**:
- **Windows/Linux**: 기본 알림 기능만 지원하며, 고급 기능 (포커스 감지, 클릭 포커스, 사용자 정의 사운드)은 사용할 수 없습니다
- **macOS**: 모든 기능 지원

### 6.2 설정 파일 크로스 플랫폼 호환성

**문제**: macOS에서 `sounds`를 설정했는데 Windows로 전환 후 사운드가 작동하지 않음.

**원인**: `sounds` 설정은 macOS에서만 유효합니다.

**해결 방법**: 설정 파일은 크로스 플랫폼으로 사용할 수 있으며, 플러그인이 지원되지 않는 설정 항목을 자동으로 무시합니다. `sounds` 필드를 삭제할 필요 없이 Windows/Linux에서 자동으로 무시됩니다.

::: tip 모범 사례
동일한 설정 파일을 여러 플랫폼에서 사용하세요. 플러그인이 플랫폼 차이를 자동으로 처리합니다. 각 플랫폼별로 별도의 설정 파일을 만들 필요가 없습니다.
:::

---

## 이 강의 요약

opencode-notify의 문제 해결은 다음 6가지 유형으로 분류할 수 있습니다:

1. **알림 미표시**: 플러그인 설치, macOS 알림 권한, 방해 금지 시간대, 터미널 포커스, 하위 세션 필터링, 플러그인 비활성화 여부 확인
2. **포커스 감지 실패** (macOS): 터미널이 올바르게 감지되는지 확인하거나 터미널 유형을 수동으로 지정
3. **설정 미적용**: JSON 형식, 설정 파일 경로 확인, OpenCode 재시작
4. **사운드 미재생** (macOS): 사운드 이름이 올바른지 확인, 사운드는 macOS에서만 지원됨을 확인
5. **알림 클릭 시 포커스 안 됨** (macOS): Bundle ID 획득 및 손쉬운 사용 권한 확인
6. **플랫폼별 기능 차이**: Windows/Linux는 기본 알림만 지원, 고급 기능은 macOS에서만 사용 가능

**빠른 진단 체크리스트**:

```
□ 플러그인이 올바르게 설치되었나요?
□ macOS 알림 권한이 부여되었나요?
□ 방해 금지 시간대가 활성화되어 있나요?
□ 터미널에 포커스가 있나요?
□ 하위 세션 필터링이 활성화되어 있나요?
□ 설정 파일 JSON 형식이 올바른가요?
□ 설정 파일 경로가 올바른가요?
□ OpenCode를 재시작했나요?
□ 사운드 이름이 지원 목록에 있나요? (macOS 전용)
□ Bundle ID를 성공적으로 가져왔나요? (macOS 전용)
□ 시스템 볼륨이 정상인가요?
```

---

## 다음 강의 예고

> 다음 강의에서는 **[자주 묻는 질문](../common-questions/)**을 배웁니다.
>
> 배우게 될 내용:
> - opencode-notify가 대화 컨텍스트 오버헤드를 증가시키는지
> - 알림 폭탄을 받게 되는지
> - 알림을 일시적으로 비활성화하는 방법
> - 성능 영향 및 개인 정보 보안 문제

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 설정 로드 및 오류 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| 터미널 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS osascript 실행 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| 터미널 포커스 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| 방해 금지 시간대 확인 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| 상위 세션 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| 알림 전송 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 기본 설정 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 터미널 프로세스 이름 매핑 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 작업 완료 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| 오류 알림 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| 권한 요청 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| 질문 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**주요 상수**:

- `DEFAULT_CONFIG`: 기본 설정 (56-68행)
  - `notifyChildSessions: false`: 기본적으로 하위 세션 알림 안 함
  - `sounds.idle: "Glass"`: 작업 완료 사운드
  - `sounds.error: "Basso"`: 오류 사운드
  - `sounds.permission: "Submarine"`: 권한 요청 사운드
  - `quietHours.start: "22:00"`, `quietHours.end: "08:00"`: 기본 방해 금지 시간대

- `TERMINAL_PROCESS_NAMES`: 터미널 이름에서 macOS 프로세스 이름으로의 매핑 (71-84행)

**주요 함수**:

- `loadConfig()`: 설정 파일과 기본 설정을 로드하고 병합, 설정 파일이 없거나 유효하지 않으면 기본값 사용
- `detectTerminalInfo()`: 터미널 정보 감지 (이름, Bundle ID, 프로세스 이름)
- `isTerminalFocused()`: 터미널이 현재 전면 앱인지 확인 (macOS)
- `isQuietHours()`: 현재 시간이 방해 금지 시간대인지 확인
- `isParentSession()`: 세션이 상위 세션인지 확인
- `sendNotification()`: 네이티브 알림 전송, macOS 클릭 포커스 지원
- `runOsascript()`: AppleScript 실행 (macOS), 실패 시 null 반환
- `getBundleId()`: 앱의 Bundle ID 가져오기 (macOS)

**비즈니스 규칙**:

- BR-1-1: 기본적으로 상위 세션만 알림, 하위 세션은 알림 안 함 (`notify.ts:256-259`)
- BR-1-2: 터미널 포커스 시 알림 억제 (`notify.ts:265`)
- BR-1-3: 방해 금지 시간대에는 알림 전송 안 함 (`notify.ts:262`)
- BR-1-4: 권한 요청은 항상 알림, 상위 세션 확인 불필요 (`notify.ts:319`)
- BR-1-5: 질문은 포커스 확인 안 함, tmux 워크플로우 지원 (`notify.ts:340`)
- BR-1-6: macOS는 알림 클릭 시 터미널 포커스 지원 (`notify.ts:238-240`)

**예외 처리**:

- `loadConfig()`: 설정 파일이 없거나 JSON 파싱 실패 시 기본 설정 사용 (`notify.ts:110-113`)
- `isParentSession()`: 세션 조회 실패 시 상위 세션으로 가정 (누락보다 알림) (`notify.ts:210-212`)
- `runOsascript()`: osascript 실행 실패 시 null 반환 (`notify.ts:120-132`)
- `handleSessionIdle()`: 세션 정보 가져오기 실패 시 기본 제목 사용 (`notify.ts:274-276`)

</details>
