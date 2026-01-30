---
title: "문제 해결: 일반적인 문제 진단 | Plannotator"
sidebarTitle: "빠른 문제 해결"
subtitle: "문제 해결: 일반적인 문제 진단"
description: "Plannotator 문제 해결 방법을 배웁니다. 로그 확인, 포트 충돌, Hook event 디버깅, 브라우저 문제, Git 저장소 상태 및 통합 오류 처리를 다룹니다."
tags:
  - "문제 해결"
  - "디버깅"
  - "일반적인 오류"
  - "로그 확인"
prerequisite:
  - "start-getting-started"
order: 2
---

# Plannotator 문제 해결

## 이 과정을 마치면

문제가 발생했을 때 다음을 수행할 수 있습니다:

- 문제 원인을 빠르게 파악 (포트 충돌, Hook event 파싱, Git 설정 등)
- 로그 출력을 통한 오류 진단
- 오류 유형별 올바른 해결 방법 적용
- 원격/Devcontainer 모드에서 연결 문제 디버깅

## 현재 상황

Plannotator가 갑자기 작동하지 않습니다. 브라우저가 열리지 않거나 Hook에서 오류 메시지가 출력됩니다. 로그를 확인하는 방법을 모르고, 어느 부분에서 문제가 발생했는지 확실하지 않습니다. 재시작을 시도해 봤지만 문제가 계속됩니다.

## 언제 이 방법을 사용하나요

다음 상황에서 문제 해결이 필요합니다:

- 브라우저가 자동으로 열리지 않음
- Hook에서 오류 메시지 출력
- 포트 충돌로 시작 불가
- 계획 또는 코드 리뷰 페이지 표시 이상
- Obsidian/Bear 통합 실패
- Git diff가 비어 있음

---

## 핵심 개념

Plannotator 문제는 일반적으로 세 가지로 분류됩니다:

1. **환경 문제**: 포트 충돌, 환경 변수 설정 오류, 브라우저 경로 문제
2. **데이터 문제**: Hook event 파싱 실패, 계획 내용 비어 있음, Git 저장소 상태 이상
3. **통합 문제**: Obsidian/Bear 저장 실패, 원격 모드 연결 문제

디버깅의 핵심은 **로그 출력 확인**입니다. Plannotator는 `console.error`로 오류를 stderr에 출력하고, `console.log`로 일반 정보를 stdout에 출력합니다. 이 둘을 구분하면 문제 유형을 빠르게 파악할 수 있습니다.

---

## 🎒 시작하기 전에

- ✅ Plannotator 설치 완료 (Claude Code 또는 OpenCode 플러그인)
- ✅ 기본적인 명령줄 작업 이해
- ✅ 프로젝트 디렉토리와 Git 저장소 상태 파악

---

## 따라하기

### 1단계: 로그 출력 확인

**왜 필요한가요**

Plannotator의 모든 오류는 stderr로 출력됩니다. 로그 확인이 문제 진단의 첫 번째 단계입니다.

**방법**

#### Claude Code에서

Hook이 Plannotator를 트리거하면 오류 메시지가 Claude Code 터미널 출력에 표시됩니다:

```bash
# 볼 수 있는 오류 예시
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### OpenCode에서

OpenCode는 CLI의 stderr를 캡처하여 인터페이스에 표시합니다:

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**예상 결과**:

- 오류가 없으면 stderr가 비어 있거나 예상된 안내 메시지만 표시됨
- 오류가 있으면 오류 유형(예: EADDRINUSE), 오류 메시지 및 스택 정보(있는 경우) 포함

---

### 2단계: 포트 충돌 문제 해결

**왜 필요한가요**

Plannotator는 기본적으로 임의의 포트에서 서버를 시작합니다. 고정 포트가 사용 중이면 서버는 5회 재시도(각 500ms 지연)를 시도하고, 실패하면 오류를 보고합니다.

**오류 메시지**:

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**해결 방법**

#### 방법 A: Plannotator가 자동으로 포트 선택 (권장)

`PLANNOTATOR_PORT` 환경 변수를 설정하지 마세요. Plannotator가 자동으로 사용 가능한 포트를 선택합니다.

#### 방법 B: 고정 포트 사용 및 충돌 해결

원격 모드 등에서 고정 포트를 사용해야 하는 경우, 포트 충돌을 해결해야 합니다:

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

그런 다음 포트를 다시 설정합니다:

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**체크포인트 ✅**:

- Plannotator를 다시 트리거하면 브라우저가 정상적으로 열려야 함
- 여전히 오류가 발생하면 다른 포트 번호 시도

---

### 3단계: Hook event 파싱 실패 디버깅

**왜 필요한가요**

Hook event는 stdin에서 읽는 JSON 데이터입니다. 파싱에 실패하면 Plannotator가 계속 진행할 수 없습니다.

**오류 메시지**:

```
Failed to parse hook event from stdin
No plan content in hook event
```

**가능한 원인**:

1. Hook event가 유효한 JSON이 아님
2. Hook event에 `tool_input.plan` 필드가 없음
3. Hook 버전 호환성 문제

**디버깅 방법**

#### Hook event 내용 확인

Hook 서버 시작 전에 stdin 내용을 출력합니다:

```bash
# hook/server/index.ts를 임시로 수정
# 91행 뒤에 추가:
console.error("[DEBUG] Hook event:", eventJson);
```

**예상 결과**:

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**해결 방법**:

- `tool_input.plan`이 비어 있거나 없으면 AI Agent가 계획을 올바르게 생성했는지 확인
- JSON 형식 오류가 있으면 Hook 설정이 올바른지 확인
- Hook 버전이 호환되지 않으면 Plannotator를 최신 버전으로 업데이트

---

### 4단계: 브라우저가 열리지 않는 문제 해결

**왜 필요한가요**

Plannotator는 `openBrowser` 함수를 사용하여 브라우저를 자동으로 엽니다. 실패하면 크로스 플랫폼 호환성 문제 또는 브라우저 경로 오류일 수 있습니다.

**가능한 원인**:

1. 시스템 기본 브라우저가 설정되지 않음
2. 사용자 지정 브라우저 경로가 유효하지 않음
3. WSL 환경에서의 특수 처리 문제
4. 원격 모드에서는 브라우저가 자동으로 열리지 않음 (정상 동작)

**디버깅 방법**

#### 원격 모드인지 확인

```bash
# 환경 변수 확인
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

출력이 `1` 또는 `true`이면 원격 모드이며, 브라우저가 자동으로 열리지 않는 것이 예상 동작입니다.

#### 브라우저 열기 수동 테스트

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**예상 결과**:

- 수동으로 열기 성공하면 Plannotator 서버가 정상 작동 중이며, 자동 열기 로직에 문제가 있음
- 수동으로 열기 실패하면 URL이 올바른지 확인 (포트가 다를 수 있음)

**해결 방법**:

#### 방법 A: 사용자 지정 브라우저 설정 (macOS)

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# 또는 전체 경로 사용
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### 방법 B: 사용자 지정 브라우저 설정 (Linux)

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### 방법 C: 원격 모드에서 수동 열기 (Devcontainer/SSH)

```bash
# Plannotator가 URL과 포트 정보를 출력함
# URL을 복사하여 로컬 브라우저에서 열기
# 또는 포트 포워딩 사용:
ssh -L 19432:localhost:19432 user@remote
```

---

### 5단계: Git 저장소 상태 확인 (코드 리뷰)

**왜 필요한가요**

코드 리뷰 기능은 Git 명령에 의존합니다. Git 저장소 상태가 비정상(예: 커밋 없음, Detached HEAD)이면 diff가 비어 있거나 오류가 발생합니다.

**오류 메시지**:

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**디버깅 방법**

#### Git 저장소 확인

```bash
# Git 저장소인지 확인
git status

# 현재 브랜치 확인
git branch

# 커밋이 있는지 확인
git log --oneline -1
```

**예상 결과**:

- `fatal: not a git repository` 출력 시 현재 디렉토리가 Git 저장소가 아님
- `HEAD detached at <commit>` 출력 시 Detached HEAD 상태
- `fatal: your current branch 'main' has no commits yet` 출력 시 아직 커밋이 없음

**해결 방법**:

#### 문제 A: Git 저장소가 아님

```bash
# Git 저장소 초기화
git init
git add .
git commit -m "Initial commit"
```

#### 문제 B: Detached HEAD 상태

```bash
# 브랜치로 전환
git checkout main
# 또는 새 브랜치 생성
git checkout -b feature-branch
```

#### 문제 C: 커밋 없음

```bash
# diff를 보려면 최소 하나의 커밋이 필요
git add .
git commit -m "Initial commit"
```

#### 문제 D: 빈 diff (변경 사항 없음)

```bash
# 변경 사항 생성
echo "test" >> test.txt
git add test.txt

# /plannotator-review 다시 실행
```

**체크포인트 ✅**:

- `/plannotator-review`를 다시 실행하면 diff가 정상적으로 표시되어야 함
- 여전히 비어 있으면 스테이징되지 않았거나 커밋되지 않은 변경 사항이 있는지 확인

---

### 6단계: Obsidian/Bear 통합 실패 디버깅

**왜 필요한가요**

Obsidian/Bear 통합 실패는 계획 승인을 차단하지 않지만 저장 실패를 유발합니다. 오류는 stderr로 출력됩니다.

**오류 메시지**:

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**디버깅 방법**

#### Obsidian 설정 확인

**macOS**:
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**:
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**예상 결과**:

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### Bear 사용 가능 여부 확인 (macOS)

```bash
# Bear URL scheme 테스트
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**예상 결과**:

- Bear 앱이 열리고 새 노트가 생성됨
- 아무 반응이 없으면 Bear가 올바르게 설치되지 않음

**해결 방법**:

#### Obsidian 저장 실패

- Obsidian이 실행 중인지 확인
- vault 경로가 올바른지 확인
- Obsidian에서 수동으로 노트를 생성하여 권한 확인

#### Bear 저장 실패

- Bear가 올바르게 설치되었는지 확인
- `bear://x-callback-url`이 작동하는지 테스트
- Bear 설정에서 x-callback-url이 활성화되어 있는지 확인

---

### 7단계: 상세 오류 로그 확인 (디버그 모드)

**왜 필요한가요**

때때로 오류 메시지가 충분히 상세하지 않아 전체 스택 트레이스와 컨텍스트를 확인해야 합니다.

**방법**

#### Bun 디버그 모드 활성화

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### Plannotator 서버 로그 확인

서버 내부 오류는 `console.error`를 통해 출력됩니다. 주요 로그 위치:

- `packages/server/index.ts:260` - 통합 오류 로그
- `packages/server/git.ts:141` - Git diff 오류 로그
- `apps/hook/server/index.ts:100-106` - Hook event 파싱 오류

**예상 결과**:

```bash
# Obsidian에 성공적으로 저장
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# 저장 실패
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Git diff 오류
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**체크포인트 ✅**:

- 오류 로그에 문제를 파악하기에 충분한 정보가 포함됨
- 오류 유형에 따라 해당 해결 방법 적용

---

## 주의사항

### ❌ stderr 출력 무시

**잘못된 방법**:

```bash
# stdout만 보고 stderr 무시
plannotator review 2>/dev/null
```

**올바른 방법**:

```bash
# stdout과 stderr 모두 확인
plannotator review
# 또는 로그 분리
plannotator review 2>error.log
```

### ❌ 무작정 서버 재시작

**잘못된 방법**:

- 문제가 발생하면 오류 원인을 확인하지 않고 재시작

**올바른 방법**:

- 먼저 오류 로그를 확인하여 문제 유형 파악
- 오류 유형에 따라 해당 해결 방법 적용
- 재시작은 최후의 수단

### ❌ 원격 모드에서 브라우저 자동 열기 기대

**잘못된 방법**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# 브라우저가 자동으로 열리기를 기대 (열리지 않음)
```

**올바른 방법**:

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# 출력된 URL을 기록하고 브라우저에서 수동으로 열기
# 또는 포트 포워딩 사용
```

---

## 이 과정 요약

- Plannotator는 `console.error`로 오류를 stderr에 출력하고, `console.log`로 일반 정보를 stdout에 출력
- 일반적인 문제: 포트 충돌, Hook event 파싱 실패, 브라우저 미열림, Git 저장소 상태 이상, 통합 실패
- 디버깅 핵심: 로그 확인 → 문제 유형 파악 → 해당 해결 방법 적용
- 원격 모드에서는 브라우저가 자동으로 열리지 않으며, URL을 수동으로 열거나 포트 포워딩 설정 필요

---

## 다음 과정 미리보기

> 다음 과정에서는 **[자주 발생하는 문제](../common-problems/)**를 배웁니다.
>
> 배울 내용:
> - 설치 및 설정 문제 해결 방법
> - 일반적인 사용 실수와 주의사항
> - 성능 최적화 권장사항

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-24

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 포트 재시도 메커니즘 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| EADDRINUSE 오류 처리 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Hook event 파싱 | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| 브라우저 열기 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Git diff 오류 처리 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Obsidian 저장 로그 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Bear 저장 로그 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**주요 상수**:
- `MAX_RETRIES = 5`: 포트 재시도 최대 횟수
- `RETRY_DELAY_MS = 500`: 포트 재시도 지연 (밀리초)

**주요 함수**:
- `startPlannotatorServer()`: 계획 리뷰 서버 시작
- `startReviewServer()`: 코드 리뷰 서버 시작
- `openBrowser()`: 크로스 플랫폼 브라우저 열기
- `runGitDiff()`: Git diff 명령 실행
- `saveToObsidian()`: Obsidian에 계획 저장
- `saveToBear()`: Bear에 계획 저장

</details>
