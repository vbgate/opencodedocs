---
title: "Claude Code 통합: 권한 설정으로 파이프라인 실행 | AI App Factory 튜토리얼"
sidebarTitle: "5분 만에 Claude Code 설정"
subtitle: "Claude Code 통합: 권한 설정으로 파이프라인 실행 | AI App Factory 튜토리얼"
description: "Claude Code 권한을 설정하여 AI App Factory 파이프라인을 안전하게 실행하는 방법을 배웁니다. 자동 생성된 settings.local.json, 화이트리스트 메커니즘, 크로스 플랫폼 권한 설정의 모범 사례를 알아보고 위험한 --dangerously-skip-permissions 파라미터 사용을 피하세요. 이 튜토리얼은 Windows/macOS/Linux 경로 처리와 일반적인 권한 오류 해결 방법을 다룹니다."
tags:
  - "Claude Code"
  - "권한 설정"
  - "AI 어시스턴트"
prerequisite:
  - "start-installation"
  - "start-init-project"
order: 50
---

# Claude Code 통합: 권한 설정으로 파이프라인 실행 | AI App Factory 튜토리얼

## 이 튜토리얼을 마치면 할 수 있는 것

- `--dangerously-skip-permissions` 없이 Claude Code의 안전한 권한 설정
- Factory가 자동 생성하는 권한 화이트리스트 이해
- Claude Code에서 완전한 7단계 파이프라인 실행
- 크로스 플랫폼 권한 설정 (Windows/macOS/Linux) 마스터

## 현재의 어려움

Factory를 처음 사용할 때 다음과 같은 문제를 경험할 수 있습니다:

- **권한 차단**: Claude Code가 "파일 읽기 권한 없음"을 표시
- **위험한 파라미터 사용**: 보안 검사를 우회하기 위해 `--dangerously-skip-permissions` 강제 추가
- **수동 설정의 번거로움**: 어떤 작업을 허용해야 할지 모름
- **크로스 플랫폼 문제**: Windows와 Unix 경로 권한 불일치

실제로 Factory는 **자동으로** 완전한 권한 설정을 생성하며, 올바르게 사용하기만 하면 됩니다.

## 이 방법을 사용하는 시점

Claude Code에서 Factory 파이프라인을 실행해야 할 때:

- `factory init`으로 프로젝트 초기화 후 (자동 시작)
- `factory run`으로 파이프라인을 계속할 때
- Claude Code를 수동으로 시작할 때

::: info 왜 Claude Code를 추천하나요?
Claude Code는 Anthropic의 공식 AI 프로그래밍 어시스턴트로, Factory의 권한 시스템과 깊이 통합되어 있습니다. 다른 AI 어시스턴트와 비교하여 Claude Code의 권한 관리가 더 세밀하고 안전합니다.
:::

## 핵심 개념

Factory의 권한 설정은 **화이트리스트 메커니즘**을 사용합니다: 명시적으로 허용된 작업만 가능하고, 나머지는 모두 차단됩니다.

### 권한 화이트리스트 카테고리

| 카테고리 | 허용된 작업 | 용도 |
| --- | --- | --- |
| **파일 작업** | Read/Write/Edit/Glob | 프로젝트 파일 읽기 및 수정 |
| **Git 작업** | git add/commit/push 등 | 버전 관리 |
| **디렉토리 작업** | ls/cd/tree/pwd | 디렉토리 구조 탐색 |
| **빌드 도구** | npm/yarn/pnpm | 의존성 설치, 스크립트 실행 |
| **TypeScript** | tsc/npx tsc | 타입 검사 |
| **데이터베이스** | npx prisma | 데이터베이스 마이그레이션 및 관리 |
| **Python** | python/pip | UI 디자인 시스템 |
| **테스트** | vitest/jest/test | 테스트 실행 |
| **Factory CLI** | factory init/run/continue | 파이프라인 명령어 |
| **Docker** | docker compose | 컨테이너화 배포 |
| **웹 작업** | WebFetch(domain:...) | API 문서 가져오기 |
| **Skills** | superpowers/ui-ux-pro-max | 플러그인 스킬 |

### 왜 `--dangerously-skip-permissions`를 사용하지 않나요?

| 방식 | 안전성 | 추천 |
| --- | --- | --- |
| `--dangerously-skip-permissions` | ❌ Claude가 임의의 작업(파일 삭제 포함) 허용 | 비추천 |
| 화이트리스트 설정 | ✅ 명시된 작업만 허용, 권한 초과 시 오류 표시 | 추천 |

화이트리스트 설정은 초기 설정이 복잡하지만, 한 번 생성하면 자동으로 재사용되며 더 안전합니다.

## 🎒 시작 전 준비

시작하기 전에 다음을 확인하세요:

- [x] **설치 및 설정** 완료 ([start/installation/](../../start/installation/))
- [x] **Factory 프로젝트 초기화** 완료 ([start/init-project/](../../start/init-project/))
- [x] Claude Code 설치됨: https://claude.ai/code
- [x] 프로젝트 디렉토리가 초기화됨 (`.factory/` 디렉토리 존재)

::: warning Claude Code 설치 확인
터미널에서 다음 명령어를 실행하여 확인하세요:

```bash
claude --version
```

"command not found"가 표시되면 먼저 Claude Code를 설치하세요.
:::

## 따라하기

### 1단계: 프로젝트 초기화 (권한 자동 생성)

**이유**: `factory init`은 완전한 권한 화이트리스트가 포함된 `.claude/settings.local.json`을 자동으로 생성합니다.

프로젝트 디렉토리에서 실행:

```bash
# 새 디렉토리 생성 및 진입
mkdir my-factory-project && cd my-factory-project

# Factory 프로젝트 초기화
factory init
```

**표시되어야 하는 내용**:

```
✓ Factory project initialized!
✓ Claude Code is starting...
  (Please wait for window to open)
```

Claude Code 창이 자동으로 열리고 다음 프롬프트가 표시됩니다:

```
请阅读.factory/pipeline.yaml和.factory/agents/orchestrator.checkpoint.md，
启动流水线，帮我将产品想法碎片转化为可运行的应用，
接下来我将会输入想法碎片。注意：Agent引用的skills/和policies/
文件需要先查找.factory/目录，再查找根目录。
```

**발생한 일**:

1. `.factory/` 디렉토리 생성, 파이프라인 설정 포함
2. `.claude/settings.local.json` 생성 (권한 화이트리스트)
3. Claude Code 자동 시작, 시작 프롬프트 전달

### 2단계: 권한 설정 검증

**이유**: 권한 파일이 올바르게 생성되었는지 확인하여 런타임 권한 문제를 방지합니다.

생성된 권한 파일 확인:

```bash
# 권한 파일 내용 보기
cat .claude/settings.local.json
```

**표시되어야 하는 내용** (일부):

```json
{
  "permissions": {
    "allow": [
      "Read(/path/to/project/**)",
      "Write(/path/to/project/**)",
      "Glob(/path/to/project/**)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(npx prisma generate:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(ui-ux-pro-max)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.org)"
    ]
  },
  "features": {
    "autoSave": true,
    "telemetry": false
  }
}
```

::: tip 경로 설명
권한의 경로는 운영 체제에 따라 자동으로 조정됩니다:

- **Windows**: `Read(//c/Users/...)` (드라이브 문자 소문자 및 대문자 모두 지원)
- **macOS/Linux**: `Read(/Users/...)` (절대 경로)
:::

### 3단계: Claude Code에서 파이프라인 시작

**이유**: Claude Code가 권한이 설정되어 있으므로 Agent 정의 및 Skill 파일을 직접 읽을 수 있습니다.

열린 Claude Code 창에서 제품 아이디어를 입력하세요:

```
我想做一个移动端记账应用，帮助年轻人快速记录日常支出，
避免月底超支。主要功能是记录金额、选择分类（饮食、交通、娱乐、其他），
查看本月总支出。
```

**표시되어야 하는 내용**:

Claude Code가 다음 단계를 실행합니다 (자동 완료):

1. `.factory/pipeline.yaml` 읽기
2. `.factory/agents/orchestrator.checkpoint.md` 읽기
3. **Bootstrap 단계** 시작, 아이디어를 `input/idea.md`로 구조화
4. 완료 후 일시 중지, 확인 대기

**체크포인트 ✅**: Bootstrap 단계 완료 확인

```bash
# 생성된 구조화된 아이디어 보기
cat input/idea.md
```

### 4단계: 파이프라인 계속하기

**이유**: 각 단계가 완료되면 수동으로 확인하여 오류 누적을 방지합니다.

Claude Code에서 다음과 같이 응답:

```
继续
```

Claude Code가 다음 단계(PRD)로 자동 진입하고 "실행→일시 중지→확인" 프로세스를 반복하여 모든 7단계가 완료될 때까지 진행합니다.

::: tip `factory run`으로 다시 시작
Claude Code 창이 닫힌 경우 터미널에서 다음을 실행할 수 있습니다:

```bash
factory run
```

이렇게 하면 Claude Code 실행 명령이 다시 표시됩니다.
:::

### 5단계: 크로스 플랫폼 권한 처리 (Windows 사용자)

**이유**: Windows 경로 권한은 특별한 처리가 필요하여 Claude Code가 프로젝트 파일에 올바르게 액세스할 수 있도록 합니다.

Windows를 사용하는 경우 `factory init`이 드라이브 문자를 지원하는 권한을 자동으로 생성합니다:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Read(//C/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)",
      "Write(//C/Users/yourname/project/**)"
    ]
  }
}
```

**체크포인트 ✅**: Windows 사용자 권한 검증

```powershell
# PowerShell
Get-Content .claude\settings.local.json | Select-String -Pattern "Read|Write"
```

`//c/` 및 `//C/` 두 가지 경로 형식이 표시되면 올바르게 설정된 것입니다.

## 체크포인트 ✅

위 단계를 완료한 후 다음을 수행할 수 있어야 합니다:

- [x] `.claude/settings.local.json` 파일 찾기
- [x] 완전한 권한 화이트리스트 보기 (Read/Write/Bash/Skill/WebFetch 포함)
- [x] Claude Code에서 Bootstrap 단계 성공적으로 시작
- [x] `input/idea.md` 확인하여 아이디어가 구조화되었는지 확인
- [x] 파이프라인을 다음 단계로 계속 실행

권한 오류가 발생하면 아래의 "문제 해결"을 참조하세요.

## 문제 해결

### 문제 1: 권한 차단

**오류 메시지**:
```
Permission denied: Read(path/to/file)
```

**원인**:
- 권한 파일 생성 실패 또는 경로가 올바르지 않음
- Claude Code가 이전 권한 캐시를 사용

**해결 방법**:

1. 권한 파일이 존재하는지 확인:

```bash
ls -la .claude/settings.local.json
```

2. 권한 다시 생성:

```bash
# 이전 권한 파일 삭제
rm .claude/settings.local.json

# 다시 초기화 (재생성됨)
factory init --force
```

3. Claude Code를 다시 시작하여 캐시를 지웁니다.

### 문제 2: `--dangerously-skip-permissions` 경고

**오류 메시지**:
```
Using --dangerously-skip-permissions is not recommended.
```

**원인**:
- `.claude/settings.local.json`을 찾을 수 없음
- 권한 파일 형식 오류

**해결 방법**:

권한 파일 형식(JSON 구문) 확인:

```bash
# JSON 형식 검증
python -m json.tool .claude/settings.local.json
```

구문 오류가 표시되면 파일을 삭제하고 `factory init`을 다시 실행하세요.

### 문제 3: Windows 경로 권한이 작동하지 않음

**오류 메시지**:
```
Permission denied: Read(C:\Users\yourname\project\file.js)
```

**원인**:
- 권한 설정에 드라이브 문자 경로가 없음
- 경로 형식이 올바르지 않음 (Windows는 `//c/` 형식 필요)

**해결 방법**:

`.claude\settings.local.json`을 수동으로 편집하여 드라이브 문자 경로 추가:

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)"
    ]
  }
}
```

드라이브 문자 대소문자 모두 지원 (`//c/` 및 `//C/`)에 주의하세요.

### 문제 4: Skills 권한 차단

**오류 메시지**:
```
Permission denied: Skill(superpowers:brainstorming)
```

**원인**:
- 필수 Claude Code 플러그인(superpowers, ui-ux-pro-max)이 설치되지 않음
- 플러그인 버전이 호환되지 않음

**해결 방법**:

1. 플러그인 마켓플레이스 추가:

```bash
# superpowers 플러그인 마켓플레이스 추가
claude plugin marketplace add obra/superpowers-marketplace
```

2. superpowers 플러그인 설치:

```bash
claude plugin install superpowers@superpowers-marketplace
```

3. ui-ux-pro-max 플러그인 마켓플레이스 추가:

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

4. ui-ux-pro-max 플러그인 설치:

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

5. 파이프라인을 다시 실행합니다.

::: info Factory가 플러그인 자동 설치 시도
`factory init` 명령이 이러한 플러그인의 자동 설치를 시도합니다. 실패하면 수동으로 설치하세요.
:::

## 본 강의 요약

- **권한 화이트리스트**가 `--dangerously-skip-permissions`보다 더 안전함
- **`factory init`**이 `.claude/settings.local.json`을 자동으로 생성
- 권한 설정에는 **파일 작업, Git, 빌드 도구, 데이터베이스, 웹 작업** 등의 카테고리 포함
- **크로스 플랫폼 지원**: Windows는 `//c/` 경로 사용, Unix는 절대 경로 사용
- **수동 플러그인 설치**: 자동 설치가 실패하면 Claude Code에서 superpowers 및 ui-ux-pro-max를 수동으로 설치해야 함

## 다음 강의 예고

> 다음 강의에서는 **[OpenCode 및 기타 AI 어시스턴트](../other-ai-assistants/)**를 학습합니다.
>
> 배울 내용:
> - OpenCode에서 Factory 파이프라인을 실행하는 방법
> - Cursor, GitHub Copilot 및 기타 AI 어시스턴트의 통합 방법
> - 다양한 어시스턴트의 권한 설정 차이점

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-29

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| 권한 설정 생성 | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-292 |
| Claude Code 자동 시작 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| AI 어시스턴트 감지 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 105-124 |
| Claude Code 명령 생성 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 138-156 |
| 크로스 플랫폼 경로 처리 | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 14-67 |

**핵심 함수**:
- `generatePermissions(projectDir)`: Read/Write/Bash/Skill/WebFetch 등의 작업을 포함한 완전한 권한 화이트리스트 생성
- `generateClaudeSettings(projectDir)`: `.claude/settings.local.json` 파일 생성 및 쓰기
- `launchClaudeCode(projectDir)`: Claude Code 창 시작 및 시작 프롬프트 전달
- `detectAIAssistant()`: 현재 실행 중인 AI 어시스턴트 유형 감지 (Claude Code/Cursor/OpenCode)

**핵심 상수**:
- Windows 경로 패턴: `Read(//c/**)`, `Write(//c/**)` (드라이브 문자 소문자 및 대문자 모두 지원)
- Unix 경로 패턴: `Read(/path/to/project/**)`, `Write(/path/to/project/**)`
- Skills 권한: `'Skill(superpowers:brainstorming)'`, `'Skill(ui-ux-pro-max)'`

**권한 화이트리스트 카테고리**:
- **파일 작업**: Read/Write/Glob (와일드카드 지원)
- **Git 작업**: git add/commit/push/pull 등 (완전한 Git 명령어 세트)
- **빌드 도구**: npm/yarn/pnpm install/build/test/dev
- **TypeScript**: tsc/npx tsc/npx type-check
- **데이터베이스**: npx prisma validate/generate/migrate/push
- **Python**: python/pip install (ui-ux-pro-max용)
- **테스트**: vitest/jest/test
- **Factory CLI**: factory init/run/continue/status/reset
- **Docker**: docker compose/ps/build/run
- **웹 작업**: WebFetch(domain:github.com) 등 (지정된 도메인 화이트리스트)

</details>
