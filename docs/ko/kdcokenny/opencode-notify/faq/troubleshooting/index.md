---
title: "트러블슈팅: 알림 표시 안 됨, 포커스 감지 실패 등 일반적인 문제들 | opencode-notify 튜토리얼"
sidebarTitle: "알림이 표시되지 않을 때 해결 방법"
subtitle: "트러블슈팅: 알림 표시 안 됨, 포커스 감지 실패 등 일반적인 문제들"
description: "opencode-notify 사용 중 발생하는 일반적인 문제를 해결하세요. 알림 표시 안 됨, 포커스 감지 실패, 구성 오류, 사운드 재생 안 됨 등을 포함합니다. macOS 알림 권한, 방해 금지 시간 설정, 터미널 감지 등의 문제를 해결하고 플러그인을 정상적으로 복구하는 방법을 배우세요."
tags:
  - "트러블슈팅"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# 트러블슈팅: 알림 표시 안 됨, 포커스 감지 실패 등 일반적인 문제들

## 이 튜토리얼을 마치면 할 수 있는 것

- 알림 표시 안 됨의 원인을 빠르게 찾기
- macOS 알림 권한 문제 해결하기
- 포커스 감지 실패 문제 진단하기
- 구성 파일 형식 오류 수정하기
- 플랫폼별 기능 차이점 이해하기

## 지금 직면한 문제

AI가 작업을 완료했지만 알림을 받지 못했거나, 알림을 클릭했을 때 터미널이 맨 위로 오지 않습니다. 무엇이 잘못되었는지, 어디서부터 문제를 해결해야 할지 모릅니다.

## 이 트릭을 사용해야 할 때

- 플러그인 설치 후 처음 사용했는데 알림을 받지 못함
- 플러그인 또는 시스템을 업데이트한 후 알림이 갑자기 작동하지 않음
- 특정 알림 동작을 비활성화하고 싶지만 구성이 적용되지 않는 것 같음
- macOS에서 Windows/Linux로 전환했는데 일부 기능을 사용할 수 없음

## 핵심 개념

opencode-notify의 작업 흐름은 비교적 단순하지만 관련된 단계가 많습니다: OpenCode SDK → 이벤트 감지 → 필터링 로직 → 운영 체제 알림. 이 중 어느 단계에서든 문제가 발생하면 알림이 표시되지 않을 수 있습니다.

문제를 해결하는 핵심은 **가장 가능한 원인부터 각 단계를 순서대로 확인하는 것**입니다. 80%의 문제는 다음 5가지 카테고리로 해결할 수 있습니다:

1. **알림 표시 안 됨** - 가장 일반적인 문제
2. **포커스 감지 실패** (macOS 전용)
3. **구성 적용 안 됨** - JSON 형식 또는 경로 오류
4. **사운드 재생 안 됨** (macOS 전용)
5. **플랫폼 차이** - 일부 기능 지원하지 않음

---

## 문제 1: 알림 표시 안 됨

이것이 가장 일반적인 문제이며 6가지 가능한 원인이 있습니다. 순서대로 확인하세요:

### 1.1 플러그인이 올바르게 설치되었는지 확인

**증상**: OpenCode가 정상적으로 실행되지만 알림을 전혀 받지 못함.

**진단 단계**:

```bash
# 플러그인이 설치되었는지 확인
ls ~/.opencode/plugin/kdco-notify

# 존재하지 않으면 다시 설치
ocx add kdco/notify
```

**예상 결과**: `~/.opencode/plugin/kdco-notify` 디렉터리가 존재하고 `package.json` 및 `src/notify.ts` 등의 파일이 포함되어 있어야 합니다.

::: tip 수동 설치 확인
수동 설치를 사용하는 경우 다음을 확인하세요:
1. 의존성이 설치되었는지: `npm install node-notifier detect-terminal`
2. 플러그인 파일이 올바른 위치에 있는지: `~/.opencode/plugin/`
3. OpenCode가 다시 시작되었는지 (플러그인 변경 사항 적용을 위해 다시 시작 필요)
:::

### 1.2 macOS 알림 권한 확인

**증상**: macOS 사용자에만 해당. 플러그인이 설치되었지만 알림을 전혀 받지 못함.

**원인**: macOS는 터미널 애플리케이션이 알림을 보내도록 명시적으로 권한을 부여해야 합니다.

**진단 단계**:

```bash
# 1. 시스템 설정 열기
# macOS Ventura 이상: 시스템 설정 → 알림 및 포커스 모드
# macOS 이전 버전: 시스템 환경설정 → 알림

# 2. 터미널 애플리케이션 찾기 (예: Ghostty, iTerm2, Terminal.app)
# 3. "알림 허용"이 켜져 있는지 확인
# 4. "잠금 화면에서" 및 "화면이 잠겨 있을 때 배너 표시"가 켜져 있는지 확인
```

**예상 결과**: 터미널 애플리케이션이 알림 설정에 표시되고 "알림 허용" 스위치가 켜져 있어야 합니다.

::: warning 일반적인 오류
OpenCode 자체는 알림 설정에 나타나지 않습니다. 권한을 부여해야 하는 것은 **터미널 애플리케이션** (Ghostty, iTerm2, Terminal.app 등)이지 OpenCode가 아닙니다.
:::

### 1.3 방해 금지 시간 설정 확인

**증상**: 특정 시간대에는 알림이 없고 다른 시간대에는 알림이 있음.

**원인**: 구성 파일에서 방해 금지 시간이 활성화되어 있음.

**진단 단계**:

```bash
# 구성 파일 확인
cat ~/.config/opencode/kdco-notify.json
```

**해결 방법**:

```json
{
  "quietHours": {
    "enabled": false,  // false로 변경하여 방해 금지 시간 비활성화
    "start": "22:00",
    "end": "08:00"
  }
}
```

**예상 결과**: `quietHours.enabled`가 `false`이거나 현재 시간이 방해 금지 시간 내에 있지 않아야 합니다.

::: tip 자정을 넘는 방해 금지 시간
방해 금지 시간은 자정을 넘는 시간대 (예: 22:00-08:00)를 지원합니다. 이것은 올바른 동작입니다. 현재 시간이 밤 10시에서 다음 날 아침 8시 사이라면 알림이 억제됩니다.
:::

### 1.4 터미널 창 포커스 확인

**증상**: 터미널을 보고 있을 때 알림을 받지 못함.

**원인**: 이것은 **예상된 동작**이며 버그가 아닙니다. 포커스 감지 메커니즘은 터미널을 보고 있을 때 알림을 억제하여 중복 알림을 방지합니다.

**진단 단계**:

**터미널에 포커스되어 있는지 확인**:
1. 다른 애플리케이션으로 전환 (예: 브라우저, VS Code)
2. AI에게 작업을 수행하도록 요청
3. 작업이 완료될 때까지 대기

**예상 결과**: 다른 애플리케이션에서 알림이 정상적으로 표시되어야 합니다.

::: tip 포커스 감지 설명
포커스 감지는 내장된 동작이며 구성을 통해 비활성화할 수 없습니다. 플러그인은 기본적으로 터미널에 포커스되어 있을 때 알림을 억제하여 중복 알림을 방지합니다. 이것은 설계된 예상 동작입니다.
:::

### 1.5 하위 세션 필터링 확인

**증상**: AI가 여러 하위 작업을 수행했지만 각 하위 작업에 대한 알림을 받지 못함.

**원인**: 이것은 **예상된 동작**입니다. 플러그인은 기본적으로 부모 세션만 알리고 하위 세션은 알리지 않아 알림 폭격을 방지합니다.

**진단 단계**:

**부모 세션과 하위 세션 이해**:
- 부모 세션: AI에 직접 요청한 작업 (예: "코드베이스 최적화")
- 하위 세션: AI가 분할한 하위 작업 (예: "src/components 최적화", "src/utils 최적화")

**하위 세션 알림이 실제로 필요한 경우**:

```json
{
  "notifyChildSessions": true
}
```

**예상 결과**: 각 하위 세션이 완료될 때마다 알림을 받아야 합니다.

::: tip 권장 사항
여러 동시 작업을 모니터링하는 경우가 아니면 `notifyChildSessions: false`로 유지하여 부모 세션 알림만 수신하세요.
:::

### 1.6 구성 파일이 삭제되거나 이름이 변경되었는지 확인

**증상**: 이전에는 알림이 있었는데 갑자기 표시되지 않음.

**진단 단계**:

```bash
# 구성 파일이 존재하는지 확인
ls -la ~/.config/opencode/kdco-notify.json
```

**해결 방법**:

구성 파일이 삭제되었거나 경로가 잘못된 경우 플러그인은 기본 구성을 사용합니다:

**구성 파일 삭제 및 기본 설정 복원**:

```bash
# 구성 파일 삭제, 기본 설정 사용
rm ~/.config/opencode/kdco-notify.json
```

**예상 결과**: 플러그인이 알림을 다시 보내기 시작해야 합니다 (기본 구성 사용).

---

## 문제 2: 포커스 감지 실패 (macOS 전용)

**증상**: 터미널을 보고 있어도 여전히 알림을 받으며 포커스 감지가 작동하지 않는 것 같음.

### 2.1 터미널이 올바르게 감지되었는지 확인

**원인**: 플러그인은 `detect-terminal` 라이브러리를 사용하여 터미널을 자동으로 인식합니다. 인식에 실패하면 포커스 감지가 작동하지 않습니다.

**진단 단계**:

```bash
# 터미널 감지가 정상인지 확인
node -e "console.log(require('detect-terminal')())"
```

**예상 결과**: 터미널 이름 (예: `ghostty`, `iterm2` 등)이 출력되어야 합니다.

출력이 비어 있으면 터미널 감지에 실패한 것입니다.

### 2.2 터미널 유형 수동 지정

**자동 감지가 실패하면 수동으로 지정할 수 있습니다**:

```json
{
  "terminal": "ghostty"  // 터미널 이름으로 변경
}
```

**지원되는 터미널 이름** (소문자):

| 터미널 | 이름 | 터미널 | 이름 |
|--- | --- | --- | ---|
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` 또는 `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | macOS 터미널 | `terminal` 또는 `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| VS Code 터미널 | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip 프로세스 이름 매핑
플러그인 내부에는 터미널 이름에서 macOS 프로세스 이름으로의 매핑 테이블이 있습니다. `terminal`을 수동으로 지정한 경우 매핑 테이블의 이름을 사용하고 있는지 확인하세요 (71-84행).
:::

---

## 문제 3: 구성 적용 안 됨

**증상**: 구성 파일을 수정했지만 플러그인 동작이 변경되지 않음.

### 3.1 JSON 형식이 올바른지 확인

**일반적인 오류**:

```json
// ❌ 오류: 따옴표 누락
{
  notifyChildSessions: true
}

// ❌ 오류: 후행 쉼표
{
  "notifyChildSessions": true,
}

// ❌ 오류: 주석 지원 안 됨
{
  "notifyChildSessions": true  // 이것은 JSON 구문 분석 실패를 유발함
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

# 형식화된 JSON이 출력되면 형식이 올바른 것
# 오류가 보고되면 JSON에 문제가 있는 것
```

### 3.2 구성 파일 경로 확인

**증상**: 구성 파일을 생성했지만 플러그인이 읽지 않는 것 같음.

**올바른 경로**:

```
~/.config/opencode/kdco-notify.json
```

**진단 단계**:

```bash
# 구성 파일이 존재하는지 확인
ls -la ~/.config/opencode/kdco-notify.json

# 존재하지 않으면 디렉터리와 파일 생성
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 OpenCode 다시 시작

**원인**: 플러그인은 시작 시 구성을 한 번 로드하며 수정 후 다시 시작해야 합니다.

**진단 단계**:

```bash
# OpenCode 완전히 다시 시작
# 1. OpenCode 종료
# 2. OpenCode 다시 시작
```

---

## 문제 4: 사운드 재생 안 됨 (macOS 전용)

**증상**: 알림이 정상적으로 표시되지만 사운드가 재생되지 않음.

### 4.1 사운드 이름이 올바른지 확인

**지원되는 macOS 사운드**:

| 사운드 이름 | 설명 | 사운드 이름 | 설명 |
|--- | --- | --- | ---|
| Basso | 저음 | Blow | 바람 소리 |
| Bottle | 병 소리 | Frog | 개구리 소리 |
| Funk | 펑크 | Glass | 유리 소리 (기본 작업 완료) |
| Hero | 히어로 | Morse | 모스 부호 |
| Ping | 딩 소리 | Pop | 거품 소리 |
| Purr | 골골 소리 | Sosumi | Sosumi |
| Submarine | 잠수함 (기본 권한 요청) | Tink | 딩딩 소리 |

**구성 예시**:

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
# 볼륨이 음소거 상태가 아니고 적절한 볼륨인지 확인
```

### 4.3 다른 플랫폼에서는 사용자 정의 사운드 지원 안 됨

**증상**: Windows 또는 Linux 사용자가 사운드를 구성했지만 소리가 들리지 않음.

**원인**: 사용자 정의 사운드는 macOS 전용 기능이며 Windows와 Linux는 지원하지 않습니다.

**해결 방법**: Windows 및 Linux 사용자는 알림을 받지만 사운드는 시스템 기본 설정에 의해 제어되며 플러그인 구성을 통해 제어할 수 없습니다.

::: tip Windows/Linux 사운드
Windows 및 Linux 알림 사운드는 시스템 설정에 의해 제어됩니다:
- Windows: 설정 → 시스템 → 알림 → 알림 사운드 선택
- Linux: 데스크톱 환경 설정 → 알림 → 사운드
:::

---

## 문제 5: 알림 클릭 시 포커스 안 됨 (macOS 전용)

**증상**: 알림을 클릭했을 때 터미널 창이 맨 위로 오지 않음.

### 5.1 Bundle ID가 성공적으로 가져와졌는지 확인

**원인**: 알림 클릭 포커스 기능은 터미널의 Bundle ID (예: `com.ghostty.Ghostty`)를 가져와야 합니다. 가져오기에 실패하면 포커스할 수 없습니다.

**진단 단계**:

플러그인은 시작 시 터미널을 자동으로 감지하고 Bundle ID를 가져옵니다. 실패하면 알림 클릭 포커스 기능을 사용할 수 없습니다.

**일반적인 원인**:
1. 매핑 테이블에 터미널이 없음 (예: 사용자 정의 터미널)
2. `osascript` 실행 실패 (macOS 권한 문제)

**해결 방법**: 터미널 유형을 수동으로 지정합니다 (2.2절 참조).

### 5.2 시스템 보조 기능 권한 확인

**원인**: macOS는 다른 애플리케이션의 창을 제어하려면 "보조 기능" 권한이 필요합니다.

**진단 단계**:

```bash
# 시스템 설정 → 개인 정보 보호 및 보안 → 보조 기능 열기
# 터미널 애플리케이션에 보조 기능 권한이 있는지 확인
```

**예상 결과**: 터미널 애플리케이션 (Ghostty, iTerm2 등)이 보조 기능 목록에 표시되고 스위치가 켜져 있어야 합니다.

---

## 문제 6: 플랫폼 기능 차이

**증상**: macOS에서 Windows/Linux로 전환했는데 일부 기능을 사용할 수 없음.

### 6.1 기능 비교표

| 기능 | macOS | Windows | Linux |
|--- | --- | --- | ---|
| 기본 알림 | ✅ | ✅ | ✅ |
| 사용자 정의 사운드 | ✅ | ❌ | ❌ |
| 포커스 감지 | ✅ | ❌ | ❌ |
| 알림 클릭 포커스 | ✅ | ❌ | ❌ |
| 터미널 감지 | ✅ | ✅ | ✅ |
| 방해 금지 시간 | ✅ | ✅ | ✅ |
| 하위 세션 알림 | ✅ | ✅ | ✅ |

**설명**:
- **Windows/Linux**: 기본 알림 기능만 지원하며 고급 기능 (포커스 감지, 클릭 포커스, 사용자 정의 사운드)을 사용할 수 없음
- **macOS**: 모든 기능 지원

### 6.2 구성 파일 플랫폼 간 호환성

**문제**: macOS에서 `sounds`를 구성한 후 Windows로 전환했는데 사운드가 작동하지 않음.

**원인**: `sounds` 구성은 macOS에서만 유효합니다.

**해결 방법**: 구성 파일은 플랫폼 간에 사용할 수 있으며 플러그인은 지원되지 않는 구성 항목을 자동으로 무시합니다. `sounds` 필드를 삭제할 필요가 없으며 Windows/Linux는 조용히 무시합니다.

::: tip 모범 사례
여러 플랫폼 간을 전환할 때 동일한 구성 파일 세트를 사용하세요. 플러그인은 플랫폼 차이를 자동으로 처리합니다. 각 플랫폼에 대해 별도의 구성 파일을 만들 필요가 없습니다.
:::

---

## 요약

opencode-notify 트러블슈팅은 다음 6가지 카테고리의 문제로 요약할 수 있습니다:

1. **알림 표시 안 됨**: 플러그인 설치, macOS 알림 권한, 방해 금지 시간, 터미널 포커스, 하위 세션 필터링, 플러그인 비활성화 여부 확인
2. **포커스 감지 실패** (macOS): 터미널이 올바르게 감지되었는지 확인하거나 터미널 유형을 수동으로 지정
3. **구성 적용 안 됨**: JSON 형식, 구성 파일 경로, OpenCode 다시 시작 확인
4. **사운드 재생 안 됨** (macOS): 사운드 이름이 올바른지 확인하고 사운드는 macOS에서만 지원된다는 것을 확인
5. **알림 클릭 포커스 안 됨** (macOS): Bundle ID 가져오기 및 보조 기능 권한 확인
6. **플랫폼 기능 차이**: Windows/Linux는 기본 알림만 지원하며 고급 기능은 macOS에서만 사용 가능

**빠른 문제 해결 체크리스트**:

```
□ 플러그인이 올바르게 설치되었나요?
□ macOS 알림 권한이 부여되었나요?
□ 방해 금지 시간이 활성화되었나요?
□ 터미널에 포커스되어 있나요?
□ 하위 세션 필터링이 활성화되었나요?
□ 구성 파일 JSON 형식이 올바른가요?
□ 구성 파일 경로가 올바른가요?
□ OpenCode를 다시 시작했나요?
□ 사운드 이름이 지원 목록에 있나요? (macOS만 해당)
□ Bundle ID가 성공적으로 가져와졌나요? (macOS만 해당)
□ 시스템 볼륨이 정상인가요?
```

---

## 다음 강의 예고

> 다음 강의에서 **[일반적인 질문](../common-questions/)**을 학습합니다.
>
> 배우게 될 내용:
> - opencode-notify가 대화 컨텍스트 오버헤드를 증가시키는지 여부
> - 대량의 알림 폭격을 받을지 여부
> - 알림을 일시적으로 비활성화하는 방법
> - 성능 영향 및 개인 정보 보안 문제

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-27

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 구성 로드 및 오류 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| 터미널 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS osascript 실행 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| 터미널 포커스 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| 방해 금지 시간 확인 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| 부모 세션 감지 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| 알림 전송 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 기본 구성 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 터미널 프로세스 이름 매핑 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 작업 완료 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| 오류 알림 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| 권한 요청 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| 질문 요청 처리 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**주요 상수**:

- `DEFAULT_CONFIG`: 기본 구성 (56-68행)
  - `notifyChildSessions: false`: 기본적으로 하위 세션 알림 안 함
  - `sounds.idle: "Glass"`: 작업 완료 사운드
  - `sounds.error: "Basso"`: 오류 사운드
  - `sounds.permission: "Submarine"`: 권한 요청 사운드
  - `quietHours.start: "22:00"`, `quietHours.end: "08:00"`: 기본 방해 금지 시간

- `TERMINAL_PROCESS_NAMES`: 터미널 이름에서 macOS 프로세스 이름으로의 매핑 (71-84행)

**주요 함수**:

- `loadConfig()`: 구성 파일과 기본 구성을 로드하고 병합하며 구성 파일이 없거나 유효하지 않을 때 기본값 사용
- `detectTerminalInfo()`: 터미널 정보 감지 (이름, Bundle ID, 프로세스 이름)
- `isTerminalFocused()`: 터미널이 현재 전면 애플리케이션인지 확인 (macOS)
- `isQuietHours()`: 현재 시간이 방해 금지 시간 내에 있는지 확인
- `isParentSession()`: 세션이 부모 세션인지 확인
- `sendNotification()`: 기본 알림 전송, macOS 클릭 포커스 지원
- `runOsascript()`: AppleScript 실행 (macOS), 실패 시 null 반환
- `getBundleId()`: 애플리케이션의 Bundle ID 가져오기 (macOS)

**비즈니스 규칙**:

- BR-1-1: 기본적으로 부모 세션만 알리고 하위 세션은 알리지 않음 (`notify.ts:256-259`)
- BR-1-2: 터미널에 포커스되어 있을 때 알림 억제 (`notify.ts:265`)
- BR-1-3: 방해 금지 시간 내에는 알림 전송 안 함 (`notify.ts:262`)
- BR-1-4: 권한 요청은 항상 알리고 부모 세션 확인 불필요 (`notify.ts:319`)
- BR-1-5: 질문 요청은 포커스 확인을 수행하지 않으며 tmux 워크플로우 지원 (`notify.ts:340`)
- BR-1-6: macOS는 알림 클릭으로 터미널 포커스 지원 (`notify.ts:238-240`)

**예외 처리**:

- `loadConfig()`: 구성 파일이 없거나 JSON 구문 분석 실패 시 기본 구성 사용 (`notify.ts:110-113`)
- `isParentSession()`: 세션 쿼리 실패 시 부모 세션으로 가정 (알리지 않고 누락하지 않음) (`notify.ts:210-212`)
- `runOsascript()`: osascript 실행 실패 시 null 반환 (`notify.ts:120-132`)
- `handleSessionIdle()`: 세션 정보 가져오기 실패 시 기본 제목 사용 (`notify.ts:274-276`)

</details>
