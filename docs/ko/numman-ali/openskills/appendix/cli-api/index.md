---
title: "CLI API: 명령어 참조 | OpenSkills"
subtitle: "CLI API: 명령어 참조 | OpenSkills"
sidebarTitle: "모든 명령어"
description: "OpenSkills의 전체 명령행 API를 학습하세요. 모든 명령어의 매개변수, 옵션 및 사용 예제를 확인하여 명령어 사용법을 빠르게 마스터하세요."
tags:
  - "API"
  - "CLI"
  - "명령어 참조"
  - "옵션 설명"
prerequisite: []
order: 1
---

# OpenSkills CLI API 참조

## 학습 후 할 수 있는 것

- 모든 OpenSkills 명령어의 전체 사용법 이해
- 각 명령어의 매개변수와 옵션 마스터
- 명령어를 조합하여 작업을 완료하는 방법 이해

## 이것은 무엇인가

OpenSkills CLI API 참조는 매개변수, 옵션 및 사용 예제를 포함한 모든 명령어의 전체 문서를 제공합니다. 특정 명령어를 자세히 이해해야 할 때 참조하는 매뉴얼입니다.

---

## 개요

OpenSkills CLI는 다음 명령어를 제공합니다:

```bash
openskills install <source>   # 스킬 설치
openskills list                # 설치된 스킬 목록
openskills read <name>         # 스킬 내용 읽기
openskills sync                # AGENTS.md에 동기화
openskills update [name...]    # 스킬 업데이트
openskills manage              # 대화형 스킬 관리
openskills remove <name>       # 스킬 삭제
```

---

## install 명령어

GitHub, 로컬 경로 또는 개인 git 저장소에서 스킬을 설치합니다.

### 구문

```bash
openskills install <source> [options]
```

### 매개변수

| 매개변수 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `<source>` | string | Y | 스킬 소스(아래 소스 형식 참조) |

### 옵션

| 옵션 | 단축형 | 타입 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `--global` | `-g` | flag | false | `~/.claude/skills/`에 전역 설치 |
| `--universal` | `-u` | flag | false | `.agent/skills/`에 설치(다중 에이전트 환경) |
| `--yes` | `-y` | flag | false | 대화형 선택 건너뛰기, 찾은 모든 스킬 설치 |

### 소스 형식

| 형식 | 예시 | 설명 |
|--- | --- | ---|
| GitHub shorthand | `anthropics/skills` | GitHub 공개 저장소에서 설치 |
| Git URL | `https://github.com/owner/repo.git` | 전체 Git URL |
| SSH Git URL | `git@github.com:owner/repo.git` | SSH 개인 저장소 |
| 로컬 경로 | `./my-skill` 또는 `~/dev/skills` | 로컬 디렉토리에서 설치 |

### 예제

```bash
# GitHub에서 설치(대화형 선택)
openskills install anthropics/skills

# GitHub에서 설치(비대화형)
openskills install anthropics/skills -y

# 전역 설치
openskills install anthropics/skills --global

# 다중 에이전트 환경 설치
openskills install anthropics/skills --universal

# 로컬 경로에서 설치
openskills install ./my-custom-skill

# 개인 저장소에서 설치
openskills install git@github.com:your-org/private-skills.git
```

### 출력

설치 성공 후 다음 정보가 표시됩니다:
- 설치된 스킬 목록
- 설치 위치(project/global)
- `openskills sync` 실행 안내

---

## list 명령어

설치된 모든 스킬을 나열합니다.

### 구문

```bash
openskills list
```

### 매개변수

없음.

### 옵션

없음.

### 예제

```bash
openskills list
```

### 출력

```
설치된 스킬:

┌────────────────────┬────────────────────────────────────┬──────────┐
│ 스킬 이름           │ 설명                                 │ 위치     │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit             │ project  │
│ git-workflow       │ Git workflow automation              │ global   │
│ skill-creator      │ Guide for creating effective skills  │ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

통계: 3개 스킬(2개 프로젝트 레벨, 1개 전역)
```

### 스킬 위치 설명

- **project**: `.claude/skills/` 또는 `.agent/skills/`에 설치됨
- **global**: `~/.claude/skills/` 또는 `~/.agent/skills/`에 설치됨

---

## read 명령어

스킬 내용을 표준 출력으로 읽습니다(AI 에이전트용).

### 구문

```bash
openskills read <skill-names...>
```

### 매개변수

| 매개변수 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `<skill-names...>` | string | Y | 스킬 이름(쉼표로 구분된 목록 지원) |

### 옵션

없음.

### 예제

```bash
# 단일 스킬 읽기
openskills read pdf

# 여러 스킬 읽기(쉼표로 구분)
openskills read pdf,git-workflow

# 여러 스킬 읽기(공백으로 구분)
openskills read pdf git-workflow
```

### 출력

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### 용도

이 명령어는 주로 AI 에이전트가 스킬 내용을 로드하는 데 사용됩니다. 사용자는 스킬의 상세 설명을 보기 위해 사용할 수도 있습니다.

---

## sync 명령어

설치된 스킬을 AGENTS.md(또는 다른 파일)에 동기화합니다.

### 구문

```bash
openskills sync [options]
```

### 매개변수

없음.

### 옵션

| 옵션 | 단축형 | 타입 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `--output <path>` | `-o` | string | `AGENTS.md` | 출력 파일 경로 |
| `--yes` | `-y` | flag | false | 대화형 선택 건너뛰기, 모든 스킬 동기화 |

### 예제

```bash
# 기본 AGENTS.md에 동기화(대화형)
openskills sync

# 사용자 정의 경로에 동기화
openskills sync -o .ruler/AGENTS.md

# 비대화형 동기화(CI/CD)
openskills sync -y

# 사용자 정의 경로에 비대화형 동기화
openskills sync -y -o .ruler/AGENTS.md
```

### 출력

동기화 완료 후 지정된 파일에 다음 내용이 생성됩니다:

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## update 명령어

소스에서 설치된 스킬을 새로고침합니다.

### 구문

```bash
openskills update [skill-names...]
```

### 매개변수

| 매개변수 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `[skill-names...]` | string | N | 스킬 이름(쉼표로 구분), 기본값 전체 |

### 옵션

없음.

### 예제

```bash
# 모든 설치된 스킬 업데이트
openskills update

# 지정된 스킬 업데이트
openskills update pdf,git-workflow

# 단일 스킬 업데이트
openskills update pdf
```

### 출력

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### 업데이트 규칙

- 메타데이터 기록이 있는 스킬만 업데이트
- 로컬 경로 스킬: 소스 경로에서 직접 복사
- Git 저장소 스킬: 다시 클론하고 복사
- 메타데이터가 없는 스킬: 건너뛰고 재설치 안내

---

## manage 명령어

대화형으로 설치된 스킬을 관리(삭제)합니다.

### 구문

```bash
openskills manage
```

### 매개변수

없음.

### 옵션

없음.

### 예제

```bash
openskills manage
```

### 대화형 인터페이스

```
삭제할 스킬 선택:

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

작업: [↑/↓] 선택 [스페이스] 전환 [Enter] 확인 [Esc] 취소
```

### 출력

```
1개 스킬 삭제 완료:
- skill-creator (project)
```

---

## remove 명령어

지정된 설치된 스킬을 삭제합니다(스크립트 방식).

### 구문

```bash
openskills remove <skill-name>
```

### 별칭

`rm`

### 매개변수

| 매개변수 | 타입 | 필수 | 설명 |
|--- | --- | --- | ---|
| `<skill-name>` | string | Y | 스킬 이름 |

### 옵션

없음.

### 예제

```bash
# 스킬 삭제
openskills remove pdf

# 별칭 사용
openskills rm pdf
```

### 출력

```
스킬 삭제 완료: pdf (project)
위치: /path/to/.claude/skills/pdf
소스: anthropics/skills
```

---

## 전역 옵션

다음 옵션은 모든 명령어에 적용됩니다:

| 옵션 | 단축형 | 타입 | 기본값 | 설명 |
|--- | --- | --- | --- | ---|
| `--version` | `-V` | flag | - | 버전 번호 표시 |
| `--help` | `-h` | flag | - | 도움말 정보 표시 |

### 예제

```bash
# 버전 표시
openskills --version

# 전역 도움말 표시
openskills --help

# 특정 명령어 도움말 표시
openskills install --help
```

---

## 스킬 조회 우선순위

여러 설치 위치가 있는 경우 스킬은 다음 우선순위로 조회됩니다(높은 순서부터):

1. `./.agent/skills/` - 프로젝트 레벨 universal
2. `~/.agent/skills/` - 전역 레벨 universal
3. `./.claude/skills/` - 프로젝트 레벨
4. `~/.claude/skills/` - 전역 레벨

**중요**: 찾은 첫 번째 일치하는 스킬만 반환됩니다(가장 높은 우선순위).

---

## 종료 코드

| 종료 코드 | 설명 |
|--- | ---|
| 0 | 성공 |
| 1 | 오류(매개변수 오류, 명령 실패 등) |

---

## 환경 변수

현재 버전은 환경 변수 구성을 지원하지 않습니다.

---

## 구성 파일

OpenSkills는 다음 구성 파일을 사용합니다:

- **스킬 메타데이터**: `.claude/skills/<skill-name>/.openskills.json`
  - 설치 소스, 타임스탬프 등 기록
  - `update` 명령어가 스킬을 새로고침하는 데 사용

### 메타데이터 예제

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 다음 강의 미리보기

> 다음 강의에서 **[AGENTS.md 형식 사양](../agents-md-format/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - AGENTS.md의 XML 태그 구조와 각 태그의 의미
> - 스킬 목록의 필드 정의 및 사용 제한
> - OpenSkills가 AGENTS.md를 생성하고 업데이트하는 방법
> - 마크업 방식(XML 태그 및 HTML 주석 마크업)

---

## 부록: 소스코드 참조

<details>
<summary><strong>클릭하여 소스코드 위치 펼치기</strong></summary>

> 업데이트 시간: 2026-01-24

| 명령어 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| CLI 진입점 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 13-80 |
| install 명령어 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562 |
| list 명령어 | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts) | 1-50 |
| read 명령어 | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts) | 1-50 |
| sync 명령어 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 1-101 |
| update 명령어 | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173 |
| manage 명령어 | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50 |
| remove 명령어 | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30 |
| 타입 정의 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts) | 1-25 |

**핵심 상수**:
- 전역 상수 없음

**핵심 타입**:
- `Skill`: 스킬 정보 인터페이스(name, description, location, path)
- `SkillLocation`: 스킬 위치 인터페이스(path, baseDir, source)
- `InstallOptions`: 설치 옵션 인터페이스(global, universal, yes)

**핵심 함수**:
- `program.command()`: 명령어 정의(commander.js)
- `program.option()`: 옵션 정의(commander.js)
- `program.action()`: 명령어 처리 함수 정의(commander.js)

</details>
