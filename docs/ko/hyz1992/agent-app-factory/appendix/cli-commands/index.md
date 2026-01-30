---
title: "CLI 명령어 레퍼런스: 전체 명령어 목록 및 매개변수 | Agent App Factory 튜토리얼"
sidebarTitle: "CLI 명령어 대전"
subtitle: "CLI 명령어 레퍼런스: 전체 명령어 목록 및 매개변수 설명"
description: "Agent App Factory CLI 명령어 완벽 가이드. init, run, continue, status, list, reset 6가지 명령어의 매개변수 설명과 사용 예제를 통해 CLI 도구를 빠르게 마스터하세요."
tags:
  - "CLI"
  - "명령줄"
  - "레퍼런스"
order: 210
---

# CLI 명령어 레퍼런스: 전체 명령어 목록 및 매개변수 설명

이 장에서는 Agent App Factory CLI 도구의 전체 명령어 레퍼런스를 제공합니다.

## 명령어 개요

| 명령어 | 기능 | 사용 시나리오 |
| --- | --- | --- |
| `factory init` | Factory 프로젝트 초기화 | 새 프로젝트 시작 |
| `factory run [stage]` | 파이프라인 실행 | 파이프라인 실행 또는 계속 |
| `factory continue` | 새 세션에서 계속 | 토큰 절약, 세션 분리 실행 |
| `factory status` | 프로젝트 상태 확인 | 현재 진행 상황 파악 |
| `factory list` | 모든 프로젝트 목록 | 여러 프로젝트 관리 |
| `factory reset` | 프로젝트 상태 초기화 | 파이프라인 재시작 |

---

## factory init

현재 디렉토리를 Factory 프로젝트로 초기화합니다.

### 문법

```bash
factory init [options]
```

### 매개변수

| 매개변수 | 축약형 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| `--name` | `-n` | string | 아니오 | 프로젝트 이름 |
| `--description` | `-d` | string | 아니오 | 프로젝트 설명 |

### 기능 설명

`factory init` 명령어를 실행하면 다음 작업이 수행됩니다:

1. 디렉토리 안전성 검사 (`.git`, `.gitignore`, `README.md` 등 설정 파일만 허용)
2. `.factory/` 디렉토리 생성
3. 다음 파일들을 `.factory/`에 복사:
   - `agents/` - Agent 정의 파일
   - `skills/` - 스킬 모듈
   - `policies/` - 정책 문서
   - `templates/` - 설정 템플릿
   - `pipeline.yaml` - 파이프라인 정의
4. `config.yaml` 및 `state.json` 생성
5. `.claude/settings.local.json` 생성 (Claude Code 권한 설정)
6. 필수 플러그인 설치 시도:
   - superpowers (Bootstrap 단계에 필요)
   - ui-ux-pro-max-skill (UI 단계에 필요)
7. AI 어시스턴트 자동 실행 (Claude Code 또는 OpenCode)

### 예제

**프로젝트 초기화 시 이름과 설명 지정**:

```bash
factory init --name "Todo App" --description "간단한 할 일 관리 앱"
```

**현재 디렉토리에서 프로젝트 초기화**:

```bash
factory init
```

### 주의사항

- 디렉토리는 비어 있거나 설정 파일(`.git`, `.gitignore`, `README.md`)만 포함해야 합니다
- `.factory/` 디렉토리가 이미 존재하면 `factory reset` 사용을 안내합니다

---

## factory run

파이프라인을 실행합니다. 현재 단계 또는 지정된 단계부터 시작합니다.

### 문법

```bash
factory run [stage] [options]
```

### 매개변수

| 매개변수 | 축약형 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- | --- |
| `stage` | - | string | 아니오 | 파이프라인 단계 이름 (bootstrap/prd/ui/tech/code/validation/preview) |

### 옵션

| 옵션 | 축약형 | 타입 | 설명 |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | 확인 프롬프트 건너뛰기 |

### 기능 설명

`factory run` 명령어를 실행하면 다음 작업이 수행됩니다:

1. Factory 프로젝트인지 확인
2. `config.yaml` 및 `state.json` 읽기
3. 현재 파이프라인 상태 표시
4. 대상 단계 결정 (매개변수 지정 또는 현재 단계)
5. AI 어시스턴트 유형 감지 (Claude Code / Cursor / OpenCode)
6. 해당 어시스턴트용 실행 명령 생성
7. 사용 가능한 단계 목록 및 진행 상황 표시

### 예제

**bootstrap 단계부터 파이프라인 실행**:

```bash
factory run bootstrap
```

**현재 단계부터 계속 실행**:

```bash
factory run
```

**확인 없이 바로 실행**:

```bash
factory run bootstrap --force
```

### 출력 예제

```
Agent Factory - Pipeline Runner

Pipeline Status:
────────────────────────────────────────
Project: Todo App
Status: Running
Current Stage: bootstrap
Completed: 

🤖 Claude Code Instructions:
──────────────────────────
This is an Agent Factory project. To execute the pipeline:

1. Read pipeline definition:
   Read(/path/to/.factory/pipeline.yaml)

2. Read orchestrator agent:
   Read(/path/to/.factory/agents/orchestrator.checkpoint.md)

3. Read project config:
   Read(/path/to/.factory/config.yaml)

Then execute the pipeline starting from: bootstrap

────────────────────────────────────────
Available stages:
  ○ bootstrap
  ○ prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

────────────────────────────────────────
Ready! Follow instructions above to continue.
```

---

## factory continue

새 세션을 열어 파이프라인을 계속 실행합니다. 토큰을 절약할 수 있습니다.

### 문법

```bash
factory continue
```

### 기능 설명

`factory continue` 명령어를 실행하면 다음 작업이 수행됩니다:

1. Factory 프로젝트인지 확인
2. `state.json`에서 현재 상태 읽기
3. Claude Code 권한 설정 재생성
4. 새 Claude Code 창 실행
5. 현재 단계부터 계속 실행

### 사용 시나리오

- 각 단계 완료 후 토큰 누적 방지
- 각 단계마다 깨끗한 컨텍스트 유지
- 중단 후 복구 지원

### 예제

**파이프라인 계속 실행**:

```bash
factory continue
```

### 주의사항

- Claude Code가 설치되어 있어야 합니다
- 새 Claude Code 창이 자동으로 실행됩니다

---

## factory status

현재 Factory 프로젝트의 상세 상태를 표시합니다.

### 문법

```bash
factory status
```

### 기능 설명

`factory status` 명령어를 실행하면 다음 정보가 표시됩니다:

- 프로젝트 이름, 설명, 경로, 생성 시간
- 파이프라인 상태 (idle/running/waiting_for_confirmation/paused/failed/completed)
- 현재 단계
- 완료된 단계 목록
- 각 단계별 진행 상황
- 입력 파일 상태 (input/idea.md)
- 산출물 디렉토리 상태 (artifacts/)
- 산출물 파일 수 및 크기

### 예제

```bash
factory status
```

### 출력 예제

```
Agent Factory - Project Status

Project:
  Name: Todo App
  Description: 간단한 할 일 관리 앱
  Path: /Users/user/Projects/todo-app
  Created: 2026-01-29T10:00:00.000Z

Pipeline:
  Status: Running
  Current Stage: prd
  Completed: bootstrap

Progress:
  ✓ bootstrap
  → prd
  ○ ui
  ○ tech
  ○ code
  ○ validation
  ○ preview

Input:
  File: input/idea.md
  Lines: 25
  Preview:
    # Todo App

    간단한 할 일 관리 앱...

Artifacts:
  ✓ prd (3 files, 12.5 KB)

────────────────────────────────────────
Commands:
  factory run     - Run pipeline
  factory run <stage> - Run from stage
  factory reset  - Reset pipeline state
```

---

## factory list

모든 Factory 프로젝트를 나열합니다.

### 문법

```bash
factory list
```

### 기능 설명

`factory list` 명령어를 실행하면 다음 작업이 수행됩니다:

1. 일반적인 프로젝트 디렉토리 검색 (`~/Projects`, `~/Desktop`, `~/Documents`, `~`)
2. 현재 디렉토리 및 상위 디렉토리 검색 (최대 3단계)
3. `.factory/` 디렉토리가 포함된 모든 프로젝트 나열
4. 프로젝트 상태 표시 (실행 중, 대기 중, 실패, 완료 순으로 정렬)

### 예제

```bash
factory list
```

### 출력 예제

```
Agent Factory - Projects

Found 2 project(s):

◉ Todo App
  간단한 할 일 관리 앱
  Path: /Users/user/Projects/todo-app
  Stage: prd

○ Blog System
  블로그 시스템
  Path: /Users/user/Projects/blog
  Completed: bootstrap

────────────────────────────────────────
Work on a project: cd <path> && factory run
```

---

## factory reset

현재 프로젝트의 파이프라인 상태를 초기화합니다. 산출물은 유지됩니다.

### 문법

```bash
factory reset [options]
```

### 옵션

| 옵션 | 축약형 | 타입 | 설명 |
| --- | --- | --- | --- |
| `--force` | `-f` | flag | 확인 건너뛰기 |

### 기능 설명

`factory reset` 명령어를 실행하면 다음 작업이 수행됩니다:

1. Factory 프로젝트인지 확인
2. 현재 상태 표시
3. 초기화 확인 (`--force` 사용 시 생략)
4. `state.json`을 초기 상태로 리셋
5. `config.yaml`의 pipeline 섹션 업데이트
6. 모든 `artifacts/` 산출물 유지

### 사용 시나리오

- bootstrap 단계부터 다시 시작
- 상태 오류 해결
- 파이프라인 재설정

### 예제

**프로젝트 상태 초기화**:

```bash
factory reset
```

**확인 없이 바로 초기화**:

```bash
factory reset --force
```

### 주의사항

- 파이프라인 상태만 초기화되며, 산출물은 삭제되지 않습니다
- 프로젝트를 완전히 삭제하려면 `.factory/` 및 `artifacts/` 디렉토리를 수동으로 삭제해야 합니다

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트: 2026-01-29

| 명령어 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| CLI 진입점 | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js) | 17-122 |
| init 명령어 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 1-457 |
| run 명령어 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 1-335 |
| continue 명령어 | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |
| status 명령어 | [`cli/commands/status.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/status.js) | 1-203 |
| list 명령어 | [`cli/commands/list.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/list.js) | 1-160 |
| reset 명령어 | [`cli/commands/reset.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/reset.js) | 1-100 |

**주요 함수**:
- `getFactoryRoot()` - Factory 루트 디렉토리 가져오기 (factory.js:22-52)
- `isFactoryProject()` - Factory 프로젝트인지 확인 (init.js:22-26)
- `generateConfig()` - 프로젝트 설정 생성 (init.js:58-76)
- `launchClaudeCode()` - Claude Code 실행 (init.js:119-147)
- `launchOpenCode()` - OpenCode 실행 (init.js:152-215)
- `detectAIAssistant()` - AI 어시스턴트 유형 감지 (run.js:105-124)
- `updateState()` - 파이프라인 상태 업데이트 (run.js:94-100)

**의존성 라이브러리**:
- `commander` - CLI 매개변수 파싱
- `chalk` - 터미널 컬러 출력
- `ora` - 로딩 애니메이션
- `inquirer` - 대화형 프롬프트
- `yaml` - YAML 파일 파싱
- `fs-extra` - 파일 시스템 작업

</details>
