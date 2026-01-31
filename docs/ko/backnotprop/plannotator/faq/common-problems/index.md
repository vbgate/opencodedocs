---
title: "자주 묻는 질문: 문제 해결 가이드 | Plannotator"
sidebarTitle: "문제가 발생하면 어떻게 하나요"
subtitle: "자주 묻는 질문: 문제 해결 가이드"
description: "Plannotator 자주 묻는 질문 문제 해결 방법을 학습합니다. 포트 충돌, 브라우저 미열림, Git 명령 실패, 이미지 업로드 및 통합 문제를 빠르게 해결하세요."
tags:
  - "자주 묻는 질문"
  - "문제 해결"
  - "포트 점유"
  - "브라우저"
  - "Git"
  - "원격 환경"
  - "통합 문제"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# 자주 묻는 질문

## 학습 후 할 수 있는 것

- ✅ 포트 점유 문제를 빠르게 진단하고 해결
- ✅ 브라우저가 자동으로 열리지 않는 원인 이해 및 접근 방법 파악
- ✅ 계획 또는 코드 리뷰 미표시 문제 해결
- ✅ Git 명령 실행 실패 대처
- ✅ 이미지 업로드 관련 오류 처리
- ✅ Obsidian/Bear 통합 실패 원인 진단
- ✅ 원격 환경에서 Plannotator 정확하게 접근

## 현재 직면한 문제

Plannotator 사용 시 다음 문제들이 발생할 수 있습니다.

- **문제 1**: 시작 시 포트가 사용 중이라는 메시지와 함께 서버 시작 실패
- **문제 2**: 브라우저가 자동으로 열리지 않아 리뷰 인터페이스 접근 불가
- **문제 3**: 계획 또는 코드 리뷰 페이지가 공백으로 표시되며 내용이 로드되지 않음
- **문제 4**: `/plannotator-review` 실행 시 Git 오류 발생
- **문제 5**: 이미지 업로드 실패 또는 이미지 표시 불가
- **문제 6**: Obsidian/Bear 통합을 구성했으나 계획이 자동으로 저장되지 않음
- **문제 7**: 원격 환경에서 로컬 서버 접근 불가

이러한 문제들은 워크플로우를 중단하고 사용 경험에 영향을 미칩니다.

## 핵심 원칙

::: info 오류 처리 메커니즘

Plannotator 서버는 **자동 재시도 메커니즘**을 구현합니다.

- **최대 재시도 횟수**: 5회
- **재시도 지연**: 500ms
- **적용 시나리오**: 포트 점유(EADDRINUSE 오류)

포트 충돌 시 시스템은 자동으로 다른 포트를 시도합니다. 5회 재시도 후에도 실패할 경우에만 오류를 보고합니다.

:::

Plannotator의 오류 처리는 다음 원칙을 따릅니다.

1. **로컬 우선**: 모든 오류 메시지가 터미널 또는 콘솔에 출력됩니다.
2. **우아한 성능 저하**: 통합 실패(예: Obsidian 저장 실패)가 주요 워크플로우를 차단하지 않습니다.
3. **명확한 안내**: 구체적인 오류 메시지와 제안된 해결 방법을 제공합니다.

## 자주 묻는 질문 및 해결 방법

### 문제 1: 포트 점유

**오류 메시지**:

```
Port 19432 in use after 5 retries
```

**원인 분석**:

- 포트가 다른 프로세스에서 사용 중입니다.
- 원격 모드에서 고정 포트를 구성했으나 포트 충돌이 발생했습니다.
- 이전 Plannotator 프로세스가 정상적으로 종료되지 않았습니다.

**해결 방법**:

#### 방법 1: 자동 재시도 대기(로컬 모드만 해당)

로컬 모드에서 Plannotator는 자동으로 무작위 포트를 시도합니다. 포트 점유 오류가 표시되면 일반적으로 다음을 의미합니다.

- 5개의 무작위 포트가 모두 점유 중입니다(매우 드뭅니다).
- 고정 포트(`PLANNOTATOR_PORT`)를 구성했으나 충돌이 발생했습니다.

**예상되는 동작**: 터미널에 "Port X in use after 5 retries"가 표시됩니다.

#### 방법 2: 고정 포트 사용(원격 모드)

원격 환경에서는 `PLANNOTATOR_PORT`를 구성해야 합니다.

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip 포트 선택 권장 사항

- 1024-49151 범위 내의 포트를 선택합니다(사용자 포트).
- 일반 서비스 포트(80, 443, 3000, 5000 등)를 피하세요.
- 방화벽이 포트를 차단하지 않는지 확인하세요.

:::

#### 방법 3: 포트를 점유한 프로세스 정리

```bash
# 포트를 점유한 프로세스 찾기(19432를 포트로 교체)
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# 프로세스 종료(PID를 실제 프로세스 ID로 교체)
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning 주의 사항

프로세스를 종료하기 전에 다른 중요한 애플리케이션이 아닌지 확인하세요. Plannotator는 결정을 수신한 후 자동으로 서버를 닫으므로 일반적으로 수동으로 종료할 필요가 없습니다.

:::

---

### 문제 2: 브라우저가 자동으로 열리지 않음

**증상**: 터미널에 서버가 시작되었다고 표시되지만 브라우저가 열리지 않습니다.

**원인 분석**:

| 시나리오 | 원인 |
|--- | ---|
| 원격 환경 | Plannotator가 원격 모드를 감지하여 브라우저 자동 열기를 건너뜀 |
| `PLANNOTATOR_BROWSER` 구성 오류 | 브라우저 경로 또는 이름이 올바르지 않음 |
| 브라우저 미설치 | 시스템 기본 브라우저가 존재하지 않음 |

**해결 방법**:

#### 시나리오 1: 원격 환경(SSH, Devcontainer, WSL)

**원격 환경인지 확인**:

```bash
echo $PLANNOTATOR_REMOTE
# 출력이 "1" 또는 "true"이면 원격 모드임
```

**원격 환경에서**:

1. **터미널에 접근 URL이 표시됩니다**:

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **수동으로 브라우저를 열고** 표시된 URL에 접근합니다.

3. **포트 포워딩을 구성**합니다(로컬에서 접근해야 하는 경우).

**예상되는 동작**: 터미널 출력이 "Plannotator running at: http://localhost:19432"와 유사합니다.

#### 시나리오 2: 로컬 모드이나 브라우저가 열리지 않음

**`PLANNOTATOR_BROWSER` 구성 확인**:

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# 브라우저 이름 또는 경로가 출력되어야 함
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**사용자 정의 브라우저 구성 지우기**:

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**올바른 브라우저 구성**(사용자 정의가 필요한 경우):

```bash
# macOS: 앱 이름 사용
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux: 실행 파일 경로 사용
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows: 실행 파일 경로 사용
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### 문제 3: 계획 또는 코드 리뷰 미표시

**증상**: 브라우저가 열리지만 페이지가 공백으로 표시되거나 로드에 실패합니다.

**가능한 원인**:

| 원인 | 계획 리뷰 | 코드 리뷰 |
|--- | --- | ---|
| Plan 매개변수가 비어 있음 | ✅ 일반적 | ❌ 해당 사항 없음 |
| Git 저장소 문제 | ❌ 해당 사항 없음 | ✅ 일반적 |
| 표시할 diff 없음 | ❌ 해당 사항 없음 | ✅ 일반적 |
| 서버 시작 실패 | ✅ 가능 | ✅ 가능 |

**해결 방법**:

#### 상황 1: 계획 리뷰 미표시

**터미널 출력 확인**:

```bash
# 오류 메시지 찾기
plannotator start 2>&1 | grep -i error
```

**일반적인 오류 1**: Plan 매개변수가 비어 있음

**오류 메시지**:

```
400 Bad Request - Missing plan or plan is empty
```

**원인**: Claude Code 또는 OpenCode에서 전달된 plan이 빈 문자열입니다.

**해결 방법**:

- AI Agent가 유효한 계획 내용을 생성했는지 확인합니다.
- Hook 또는 Plugin 구성이 올바른지 확인합니다.
- Claude Code/OpenCode 로그를 확인하여 자세한 정보를 얻습니다.

**일반적인 오류 2**: 서버가 정상적으로 시작되지 않음

**해결 방법**:

- 터미널에 "Plannotator running at" 메시지가 표시되는지 확인합니다.
- 표시되지 않으면 "문제 1: 포트 점유"를 참조하세요.
- [환경 변수 구성](../../advanced/environment-variables/)을 확인하여 구성이 올바른지 확인하세요.

#### 상황 2: 코드 리뷰 미표시

**터미널 출력 확인**:

```bash
/plannotator-review 2>&1 | grep -i error
```

**일반적인 오류 1**: Git 저장소 없음

**오류 메시지**:

```
fatal: not a git repository
```

**해결 방법**:

```bash
# Git 저장소 초기화
git init

# 파일 추가 및 커밋(커밋되지 않은 변경 사항이 있는 경우)
git add .
git commit -m "Initial commit"

# 다시 실행
/plannotator-review
```

**예상되는 동작**: 브라우저에 diff viewer가 표시됩니다.

**일반적인 오류 2**: 표시할 diff 없음

**증상**: 페이지에 "No changes" 또는 유사한 메시지가 표시됩니다.

**해결 방법**:

```bash
# 커밋되지 않은 변경 사항이 있는지 확인
git status

# 스테이지된 변경 사항이 있는지 확인
git diff --staged

# 커밋이 있는지 확인
git log --oneline

# 다른 범위를 보려면 diff 유형 전환
# 코드 리뷰 인터페이스에서 드롭다운 메뉴를 클릭하여 전환:
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main(분기에 있는 경우)
```

**예상되는 동작**: diff viewer에 코드 변경 사항이 표시되거나 "No changes"가 표시됩니다.

**일반적인 오류 3**: Git 명령 실행 실패

**오류 메시지**:

```
Git diff error for uncommitted: [구체적인 오류 메시지]
```

**가능한 원인**:

- Git이 설치되지 않음
- Git 버전이 너무 오래됨
- Git 구성 문제

**해결 방법**:

```bash
# Git 버전 확인
git --version

# Git diff 명령 테스트
git diff HEAD

# Git이 정상 작동하는 경우 Plannotator 내부 오류일 수 있음
# 전체 오류 메시지를 확인하고 Bug를 보고하세요
```

---

### 문제 4: 이미지 업로드 실패

**오류 메시지**:

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**가능한 원인**:

| 원인 | 해결 방법 |
|--- | ---|
| 파일을 선택하지 않음 | 업로드 버튼을 클릭하고 이미지 선택 |
| 지원되지 않는 파일 형식 | png/jpeg/webp 형식 사용 |
| 파일이 너무 큼 | 이미지를 압축한 후 업로드 |
| 임시 디렉토리 권한 문제 | /tmp/plannotator 디렉토리 권한 확인 |

**해결 방법**:

#### 업로드된 파일 확인

**지원되는 형식**:

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**지원되지 않는 형식**:

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**예상되는 동작**: 업로드 성공 후 이미지가 리뷰 인터페이스에 표시됩니다.

#### 임시 디렉토리 권한 확인

Plannotator는 자동으로 `/tmp/plannotator` 디렉토리를 생성합니다. 여전히 업로드에 실패하는 경우 시스템 임시 디렉토리 권한을 확인하세요.

**수동으로 확인해야 하는 경우**:

```bash
# 디렉토리 권한 확인
ls -la /tmp/plannotator

# Windows 확인
dir %TEMP%\plannotator
```

**예상되는 동작**: `drwxr-xr-x`(또는 유사한 권한)가 디렉토리에 쓰기 가능함을 나타냅니다.

#### 브라우저 개발자 도구 확인

1. F12 키를 눌러 개발자 도구 엽니다.
2. "Network" 탭으로 전환합니다.
3. 업로드 버튼을 클릭합니다.
4. `/api/upload` 요청을 찾습니다.
5. 요청 상태와 응답을 확인합니다.

**예상되는 동작**:
- 상태 코드: 200 OK(성공)
- 응답: `{"path": "/tmp/plannotator/xxx.png"}`

---

### 문제 5: Obsidian/Bear 통합 실패

**증상**: 계획을 승인한 후 메모 앱에 저장된 계획이 없습니다.

**가능한 원인**:

| 원인 | Obsidian | Bear |
|--- | --- | ---|
| 통합 사용 안 함 | ✅ | ✅ |
| Vault/App 감지되지 않음 | ✅ | N/A |
| 경로 구성 오류 | ✅ | ✅ |
| 파일 이름 충돌 | ✅ | ✅ |
| x-callback-url 실패 | N/A | ✅ |

**해결 방법**:

#### Obsidian 통합 문제

**단계 1: 통합 사용 여부 확인**

1. Plannotator UI에서 설정(기어 아이콘)을 클릭합니다.
2. "Obsidian Integration" 섹션을 찾습니다.
3. 스위치가 켜져 있는지 확인합니다.

**예상되는 동작**: 스위치가 파란색으로 표시됩니다(사용 상태).

**단계 2: Vault 감지 확인**

**자동 감지**:

- Plannotator는 자동으로 Obsidian 구성 파일을 읽습니다.
- 구성 파일 위치:
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**수동 확인**:

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**예상되는 동작**: `vaults` 필드가 포함된 JSON 파일이 표시됩니다.

**단계 3: Vault 경로 수동 구성**

자동 감지가 실패한 경우:

1. Plannotator 설정에서
2. "Manually enter vault path"를 클릭합니다.
3. 전체 Vault 경로를 입력합니다.

**예제 경로**:

- macOS: `/Users/yourname/Documents/ObsidianVault`
- Windows: `C:\Users\yourname\Documents\ObsidianVault`
- Linux: `/home/yourname/Documents/ObsidianVault`

**예상되는 동작**: 드롭다운 메뉴에 입력한 Vault 이름이 표시됩니다.

**단계 4: 터미널 출력 확인**

Obsidian 저장 결과가 터미널에 출력됩니다.

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**오류 메시지**:

```
[Obsidian] Save failed: [구체적인 오류 메시지]
```

**일반적인 오류**:

- 권한 부족 → Vault 디렉토리 권한 확인
- 디스크 공간 부족 → 공간 확보
- 경로가 잘못됨 → 경로 철자가 올바른지 확인

#### Bear 통합 문제

**Bear 앱 확인**

- macOS에 Bear가 설치되어 있는지 확인합니다.
- Bear 앱이 실행 중인지 확인합니다.

**x-callback-url 테스트**:

```bash
# 터미널에서 테스트
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**예상되는 동작**: Bear가 열리고 새 메모를 생성합니다.

**터미널 출력 확인**:

```bash
[Bear] Saved plan to Bear
```

**오류 메시지**:

```
[Bear] Save failed: [구체적인 오류 메시지]
```

**해결 방법**:

- Bear 앱을 다시 시작합니다.
- Bear가 최신 버전인지 확인합니다.
- macOS 권한 설정을 확인합니다(Bear의 파일 액세스 허용).

---

### 문제 6: 원격 환경 액세스 문제

**증상**: SSH, Devcontainer 또는 WSL에서 로컬 브라우저에서 서버에 접근할 수 없습니다.

**핵심 개념**:

::: info 원격 환경이란 무엇인가

원격 환경은 SSH, Devcontainer 또는 WSL을 통해 액세스하는 원격 컴퓨팅 환경입니다. 이러한 환경에서는 **포트 포워딩**을 사용하여 원격 포트를 로컬에 매핑해야만 로컬 브라우저에서 원격 서버에 액세스할 수 있습니다.

:::

**해결 방법**:

#### 단계 1: 원격 모드 구성

원격 환경에서 환경 변수 설정:

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**예상되는 동작**: 터미널 출력에 "Using remote mode with fixed port: 9999"가 표시됩니다.

#### 단계 2: 포트 포워딩 구성

**시나리오 1: SSH 원격 서버**

`~/.ssh/config` 편집:

```
Host your-server
    HostName server.example.com
    User yourname
    LocalForward 9999 localhost:9999
```

**서버에 연결**:

```bash
ssh your-server
```

**예상되는 동작**: SSH 연결이 설정된 후 로컬 9999 포트가 원격 9999 포트로 포워딩됩니다.

**시나리오 2: VS Code Devcontainer**

VS Code Devcontainer는 일반적으로 자동으로 포트를 포워딩합니다.

**확인 방법**:

1. VS Code에서 "Ports" 탭을 엽니다.
2. 9999 포트를 찾습니다.
3. 포트 상태가 "Forwarded"인지 확인합니다.

**예상되는 동작**: Ports 탭에 "Local Address: localhost:9999"가 표시됩니다.

**시나리오 3: WSL(Windows Subsystem for Linux)**

WSL은 기본적으로 `localhost` 포워딩을 사용합니다.

**액세스 방법**:

Windows 브라우저에서 직접 액세스:

```
http://localhost:9999
```

**예상되는 동작**: Plannotator UI가 정상적으로 표시됩니다.

#### 단계 3: 액세스 확인

1. 원격 환경에서 Plannotator를 시작합니다.
2. 로컬 브라우저에서 `http://localhost:9999`에 액세스합니다.
3. 페이지가 정상적으로 표시되는지 확인합니다.

**예상되는 동작**: 계획 리뷰 또는 코드 리뷰 인터페이스가 정상적으로 로드됩니다.

---

### 문제 7: 계획/주석이 올바르게 저장되지 않음

**증상**: 계획을 승인하거나 거부한 후 주석이 저장되지 않거나 저장 위치가 올바르지 않습니다.

**가능한 원인**:

| 원인 | 해결 방법 |
|--- | ---|
| 계획 저장 사용 안 함 | 설정에서 "Plan Save" 옵션 확인 |
| 사용자 정의 경로가 유효하지 않음 | 경로에 쓰기 권한이 있는지 확인 |
| 주석 내용이 비어 있음 | 정상적인 동작임(주석이 있는 경우에만 저장) |
| 서버 권한 문제 | 저장 디렉토리 권한 확인 |

**해결 방법**:

#### 계획 저장 설정 확인

1. Plannotator UI에서 설정(기어 아이콘)을 클릭합니다.
2. "Plan Save" 섹션을 확인합니다.
3. 스위치가 사용 상태인지 확인합니다.

**예상되는 동작**: "Save plans and annotations" 스위치가 파란색으로 표시됩니다(사용 상태).

#### 저장 경로 확인

**기본 저장 위치**:

```bash
~/.plannotator/plans/  # 계획과 주석이 모두 이 디렉토리에 저장됨
```

**사용자 정의 경로**:

설정에서 사용자 정의 저장 경로를 구성할 수 있습니다.

**경로 쓰기 권한 확인**:

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**예상되는 동작**: 명령이 성공적으로 실행되며 권한 오류가 없습니다.

#### 터미널 출력 확인

저장 결과가 터미널에 출력됩니다.

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**예상되는 동작**: 유사한 성공 메시지가 표시됩니다.

---

## 단원 요약

이 단원을 통해 다음을 학습했습니다.

- **포트 점유 문제 진단**: 고정 포트 사용 또는 점유 프로세스 정리
- **브라우저 미열림 처리**: 원격 모드 식별 수동 액세스 또는 브라우저 구성
- **콘텐츠 미표시 문제 해결**: Plan 매개변수 Git 저장소 diff 상태 확인
- **이미지 업로드 실패 해결**: 파일 형식 디렉토리 권한 개발자 도구 확인
- **통합 실패 수정**: 구성 경로 권한 및 터미널 출력 확인
- **원격 액세스 구성**: PLANNOTATOR_REMOTE 및 포트 포워딩 사용
- **계획 및 주석 저장**: 계획 저장 사용 설정 및 경로 권한 확인

**기억하세요**:

1. 터미널 출력이 디버깅 정보의 최고의 원천입니다.
2. 원격 환경에서는 포트 포워딩이 필요합니다.
3. 통합 실패가 주요 워크플로우를 차단하지 않습니다.
4. 개발자 도구를 사용하여 네트워크 요청 세부 정보를 확인합니다.

## 다음 단계

이 단원에서 다루지 않은 문제가 발생하는 경우 다음을 확인할 수 있습니다.

- [문제 해결](../troubleshooting/) - 고급 디버깅 기술 및 로그 분석 방법
- [API 참조](../../appendix/api-reference/) - 모든 API 엔드포인트 및 오류 코드 이해
- [데이터 모델](../../appendix/data-models/) - Plannotator 데이터 구조 이해

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 날짜: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 서버 시작 및 재시도 로직 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| 포트 점유 오류 처리(계획 리뷰) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| 포트 점유 오류 처리(코드 리뷰) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| 원격 모드 감지 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 전체 |
| 브라우저 열기 로직 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 전체 |
| Git 명령 실행 및 오류 처리 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| 이미지 업로드 처리(계획 리뷰) | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| 이미지 업로드 처리(코드 리뷰) | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Obsidian 통합 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | 전체 |
| 계획 저장 | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | 전체 |

**핵심 상수**:

| 상수 | 값 | 설명 |
|--- | --- | ---|
| `MAX_RETRIES` | 5 | 서버 시작 최대 재시도 횟수 |
| `RETRY_DELAY_MS` | 500 | 재시도 지연(밀리초) |

**핵심 함수**:

- `startPlannotatorServer()` - 계획 리뷰 서버 시작
- `startReviewServer()` - 코드 리뷰 서버 시작
- `isRemoteSession()` - 원격 환경인지 감지
- `getServerPort()` - 서버 포트 가져오기
- `openBrowser()` - 브라우저 열기
- `runGitDiff()` - Git diff 명령 실행
- `detectObsidianVaults()` - Obsidian vaults 감지
- `saveToObsidian()` - 계획을 Obsidian에 저장
- `saveToBear()` - 계획을 Bear에 저장

</details>
