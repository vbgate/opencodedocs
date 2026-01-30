---
title: "명령어 상세: OpenSkills CLI 참조 | openskills"
sidebarTitle: "7개 명령어 완전 정복"
subtitle: "명령어 상세: OpenSkills CLI 참조"
description: "OpenSkills의 7개 명령어 및 매개변수 사용법을 학습합니다. install, list, read, update, sync, manage, remove의 완전한 참조서로 CLI 도구 효율을 높이세요."
tags:
  - "CLI"
  - "명령어 참조"
  - "치트시트"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 1
---
# 명령어 상세：OpenSkills 완전 명령어 치트시트

## 학습 후 가능한 것

- OpenSkills의 7개 명령어를 능숙하게 사용
- 전역 옵션의 역할과 적용 시나리오 이해
- 명령어 매개변수와 플래그의 의미를 빠르게 찾기
- 스크립트에서 비대화형 명령어 사용

## 명령어 개요

OpenSkills는 다음 7개 명령어를 제공합니다:

| 명령어 | 용도 | 사용 시나리오 |
|--- | --- | ---|
| `install` | 스킬 설치 | GitHub, 로컬 경로 또는 개인 저장소에서 새 스킬 설치 |
| `list` | 스킬 나열 | 설치된 모든 스킬 및 위치 확인 |
| `read` | 스킬 읽기 | AI 에이전트가 스킬 콘텐츠를 로드 (주로 에이전트가 자동 호출) |
| `update` | 스킬 업데이트 | 원본 저장소에서 설치된 스킬 새로고침 |
| `sync` | 동기화 | 스킬 목록을 AGENTS.md에 작성 |
| `manage` | 관리 | 대화형 스킬 삭제 |
| `remove` | 삭제 | 지정된 스킬 삭제 (스크립트 방식) |

::: info 팁
`npx openskills --help`를 사용하면 모든 명령어의 간단한 설명을 볼 수 있습니다.
:::

## 전역 옵션

일부 명령어는 다음 전역 옵션을 지원합니다:

| 옵션 | 약어 | 역할 | 적용 명령어 |
|--- | --- | --- | ---|
| `--global` | `-g` | 전역 디렉토리 `~/.claude/skills/`에 설치 | `install` |
| `--universal` | `-u` | 공용 디렉토리 `.agent/skills/`에 설치 (다중 에이전트 환경) | `install` |
| `--yes` | `-y` | 대화형 프롬프트 건너뛰기, 기본 동작 사용 | `install`, `sync` |
| `--output <path>` | `-o <path>` | 출력 파일 경로 지정 | `sync` |

## 명령어 상세

### install - 스킬 설치

GitHub 저장소, 로컬 경로 또는 개인 git 저장소에서 스킬을 설치합니다.

```bash
openskills install <source> [options]
```

**매개변수**:

| 매개변수 | 필수 | 설명 |
|--- | --- | ---|
| `<source>` | ✅ | 스킬 소스 (GitHub shorthand, git URL 또는 로컬 경로) |

**옵션**:

| 옵션 | 약어 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `--global` | `-g` | `false` | 전역 디렉토리 `~/.claude/skills/`에 설치 |
| `--universal` | `-u` | `false` | 공용 디렉토리 `.agent/skills/`에 설치 |
| `--yes` | `-y` | `false` | 대화형 선택 건너뛰기, 찾은 모든 스킬 설치 |

**source 매개변수 예시**:

```bash
# GitHub shorthand (추천)
openskills install anthropics/skills

# 브랜치 지정
openskills install owner/repo@branch

# 개인 저장소
openskills install git@github.com:owner/repo.git

# 로컬 경로
openskills install ./path/to/skill

# Git URL
openskills install https://github.com/owner/repo.git
```

**동작 설명**:

- 설치 시 찾은 모든 스킬을 나열하여 선택
- `--yes`를 사용하면 선택을 건너뛰고 모든 스킬 설치
- 설치 위치 우선순위: `--universal` → `--global` → 기본 프로젝트 디렉토리
- 설치 후 스킬 디렉토리에 `.openskills.json` 메타데이터 파일 생성

---

### list - 스킬 나열

설치된 모든 스킬을 나열합니다.

```bash
openskills list
```

**옵션**: 없음

**출력 형식**:

```
Available Skills:

skill-name           [description]            (project/global)
```

**동작 설명**:

- 위치별 정렬: 프로젝트 스킬 먼저, 전역 스킬 나중
- 동일 위치 내 알파벳순 정렬
- 스킬 이름, 설명 및 위치 라벨 표시

---

### read - 스킬 읽기

하나 이상의 스킬 콘텐츠를 표준 출력으로 읽습니다. 이 명령어는 주로 AI 에이전트가 필요에 따라 스킬을 로드할 때 사용됩니다.

```bash
openskills read <skill-names...>
```

**매개변수**:

| 매개변수 | 필수 | 설명 |
|--- | --- | ---|
| `<skill-names...>` | ✅ | 스킬 이름 목록 (여러 개 지원, 공백 또는 쉼표로 구분) |

**옵션**: 없음

**예시**:

```bash
# 단일 스킬 읽기
openskills read pdf

# 여러 스킬 읽기
openskills read pdf git

# 쉼표로 구분 (지원됨)
openskills read "pdf,git,excel"
```

**출력 형식**:

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md 내용---

[SKILL.END]
```

**동작 설명**:

- 4개 디렉토리 우선순위로 스킬 검색
- 스킬 이름, 기본 디렉토리 경로 및 전체 SKILL.md 콘텐츠 출력
- 찾지 못한 스킬은 오류 메시지 표시

---

### update - 스킬 업데이트

기록된 소스에서 설치된 스킬을 새로고침합니다. 스킬 이름을 지정하지 않으면 설치된 모든 스킬을 업데이트합니다.

```bash
openskills update [skill-names...]
```

**매개변수**:

| 매개변수 | 필수 | 설명 |
|--- | --- | ---|
| `[skill-names...]` | ❌ | 업데이트할 스킬 이름 목록 (기본값: 전체) |

**옵션**: 없음

**예시**:

```bash
# 모든 스킬 업데이트
openskills update

# 지정된 스킬 업데이트
openskills update pdf git

# 쉼표로 구분 (지원됨)
openskills update "pdf,git,excel"
```

**동작 설명**:

- 메타데이터가 있는 스킬만 업데이트 (즉, install로 설치된 스킬)
- 메타데이터가 없는 스킬은 건너뛰고 알림
- 업데이트 성공 후 설치 타임스탬프 업데이트
- git 저장소에서 업데이트 시 얕은 복제 사용 (`--depth 1`)

---

### sync - AGENTS.md에 동기화

설치된 스킬을 AGENTS.md (또는 사용자 정의 파일)에 동기화하여 AI 에이전트가 사용할 수 있는 스킬 목록을 생성합니다.

```bash
openskills sync [options]
```

**옵션**:

| 옵션 | 약어 | 기본값 | 설명 |
|--- | --- | --- | ---|
| `--output <path>` | `-o <path>` | `AGENTS.md` | 출력 파일 경로 |
| `--yes` | `-y` | `false` | 대화형 선택 건너뛰기, 모든 스킬 동기화 |

**예시**:

```bash
# 기본 파일에 동기화
openskills sync

# 사용자 정의 파일에 동기화
openskills sync -o .ruler/AGENTS.md

# 대화형 선택 건너뛰기
openskills sync -y
```

**동작 설명**:

- 기존 파일을 분석하고 활성화된 스킬을 미리 선택
- 첫 동기화 시 기본적으로 프로젝트 스킬 선택
- Claude Code 호환 XML 형식 생성
- 기존 파일에서 스킬 섹션 교체 또는 추가 지원

---

### manage - 스킬 관리

설치된 스킬을 대화형으로 삭제합니다. 친절한 삭제 인터페이스를 제공합니다.

```bash
openskills manage
```

**옵션**: 없음

**동작 설명**:

- 설치된 모든 스킬을 나열하여 선택
- 기본적으로 스킬 선택 안 함
- 선택 후 즉시 삭제, 이중 확인 불필요

---

### remove - 스킬 삭제

지정된 설치된 스킬을 삭제합니다 (스크립트 방식). 스크립트에서 사용할 때 `manage`보다 편리합니다.

```bash
openskills remove <skill-name>
```

**매개변수**:

| 매개변수 | 필수 | 설명 |
|--- | --- | ---|
| `<skill-name>` | ✅ | 삭제할 스킬 이름 |

**옵션**: 없음

**예시**:

```bash
openskills remove pdf

# 별칭 사용 가능
openskills rm pdf
```

**동작 설명**:

- 전체 스킬 디렉토리 삭제 (모든 파일 및 하위 디렉토리 포함)
- 삭제 위치 및 소스 표시
- 스킬을 찾지 못하면 오류 표시 후 종료

## 빠른 작업 치트시트

| 작업 | 명령어 |
|--- | ---|
| 설치된 모든 스킬 보기 | `openskills list` |
| 공식 스킬 설치 | `openskills install anthropics/skills` |
| 로컬 경로에서 설치 | `openskills install ./my-skill` |
| 전역 스킬 설치 | `openskills install owner/skill --global` |
| 모든 스킬 업데이트 | `openskills update` |
| 특정 스킬 업데이트 | `openskills update pdf git` |
| 대화형 스킬 삭제 | `openskills manage` |
| 지정된 스킬 삭제 | `openskills remove pdf` |
| AGENTS.md에 동기화 | `openskills sync` |
| 사용자 정의 출력 경로 | `openskills sync -o custom.md` |

## 문제 해결 팁

### 1. 명령어를 찾을 수 없음

**문제**: 명령어 실행 시 "command not found" 메시지

**원인**:
- Node.js가 설치되지 않았거나 버전이 너무 낮음 (20.6+ 필요)
- `npx`를 사용하지 않거나 전역 설치되지 않음

**해결**:
```bash
# npx 사용 (추천)
npx openskills list

# 또는 전역 설치
npm install -g openskills
```

### 2. 스킬을 찾을 수 없음

**문제**: `openskills read skill-name` 실행 시 "Skill not found" 메시지

**원인**:
- 스킬이 설치되지 않음
- 스킬 이름 철자 오류
- 스킬 설치 위치가 검색 경로에 없음

**해결**:
```bash
# 설치된 스킬 확인
openskills list

# 스킬 디렉토리 보기
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. 업데이트 실패

**문제**: `openskills update` 실행 시 "No metadata found" 메시지

**원인**:
- 스킬이 `install` 명령어로 설치되지 않음
- 메타데이터 파일 `.openskills.json`이 삭제됨

**해결**: 스킬 재설치
```bash
openskills install <original-source>
```

## 수업 요약

OpenSkills는 스킬의 설치, 목록, 읽기, 업데이트, 동기화 및 관리를 포함하는 완전한 명령줄 인터페이스를 제공합니다. 이러한 명령어를 마스터하는 것은 OpenSkills를 효율적으로 사용하는 기초입니다:

- `install` - 새 스킬 설치 (GitHub, 로컬, 개인 저장소 지원)
- `list` - 설치된 스킬 보기
- `read` - 스킬 콘텐츠 읽기 (AI 에이전트 사용)
- `update` - 설치된 스킬 업데이트
- `sync` - AGENTS.md에 동기화
- `manage` - 대화형 스킬 삭제
- `remove` - 지정된 스킬 삭제

전역 옵션의 역할을 기억하세요:
- `--global` / `--universal` - 설치 위치 제어
- `--yes` - 대화형 프롬프트 건너뛰기 (CI/CD에 적합)
- `--output` - 사용자 정의 출력 파일 경로

## 다음 수업 예고

> 다음 수업에서는 **[설치 소스 상세](../install-sources/)**를 학습합니다.
>
> 학습할 내용:
> - 세 가지 설치 방법의 상세 사용법
> - 각 방법의 적용 시나리오
> - 개인 저장소 설정 방법
