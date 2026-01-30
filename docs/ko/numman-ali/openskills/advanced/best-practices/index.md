---
title: "베스트 프랙티스: 프로젝트 설정 및 팀 협업 | OpenSkills"
sidebarTitle: "5분 만에 팀 스킬 설정"
subtitle: "베스트 프랙티스: 프로젝트 설정 및 팀 협업"
description: "OpenSkills의 베스트 프랙티스를 배우세요. 프로젝트 로컬 vs 글로벌 설치, Universal 모드 설정, SKILL.md 작성 규칙, CI/CD 통합 방법을 마스터하여 팀 협업 효율성을 높이세요."
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# 베스트 프랙티스

## 이 과정을 완료하면 할 수 있는 것

- 프로젝트 요구사항에 맞는 스킬 설치 방법 선택 (프로젝트 로컬 vs 글로벌 vs Universal)
- 규칙에 맞는 SKILL.md 파일 작성 (명명, 설명, 지시사항)
- 심볼릭 링크를 사용한 효율적인 로컬 개발
- 스킬 버전 및 업데이트 관리
- 팀 환경에서 스킬 협업 사용
- OpenSkills를 CI/CD 파이프라인에 통합

## 현재 직면한 문제

이미 스킬을 설치하고 사용하는 방법을 배웠지만, 실제 프로젝트에서 다음 문제들을 겪고 있을 수 있습니다:

- 스킬을 프로젝트 디렉터리에 설치해야 할까, 글로벌로 설치해야 할까?
- 여러 AI 에이전트 간에 스킬을 공유하려면 어떻게 해야 할까?
- 스킬을 여러 번 작성했는데도 AI가 기억하지 못함
- 팀원들이 각자 스킬을 설치하여 버전이 일치하지 않음
- 로컬에서 스킬을 수정한 후 매번 다시 설치하는 번거로움

이 수업에서는 OpenSkills의 베스트 프랙티스를 정리하여 이러한 문제를 해결해 드립니다.

## 언제 이 방법을 사용해야 할까

- **프로젝트 설정 최적화**: 프로젝트 유형에 따라 적절한 스킬 설치 위치 선택
- **다중 에이전트 환경**: Claude Code, Cursor, Windsurf 등 여러 도구를 동시에 사용
- **스킬 표준화**: 팀 내 스킬 형식 및 작성 규칙 통일
- **로컬 개발**: 스킬의 빠른 반복 및 테스트
- **팀 협업**: 스킬 공유, 버전 관리, CI/CD 통합

## 🎒 시작 전 준비

::: warning 전제 조건 확인

시작 전에 다음을 확인하세요:

- ✅ [빠른 시작](../../start/quick-start/) 완료
- ✅ 최소 하나의 스킬을 설치하고 AGENTS.md에 동기화
- ✅ [SKILL.md 기본 형식](../../start/what-is-openskills/) 이해

:::

## 프로젝트 설정 베스트 프랙티스

### 1. 프로젝트 로컬 vs 글로벌 vs Universal 설치

적절한 설치 위치를 선택하는 것은 프로젝트 설정의 첫 번째 단계입니다.

#### 프로젝트 로컬 설치 (기본값)

**사용 시나리오**: 특정 프로젝트 전용 스킬

```bash
# .claude/skills/에 설치
npx openskills install anthropics/skills
```

**장점**:

- ✅ 스킬을 프로젝트 버전 관리와 함께 관리
- ✅ 다른 프로젝트에서 다른 스킬 버전 사용 가능
- ✅ 글로벌 설치가 필요 없어 의존성 감소

**권장 사항**:

- 프로젝트 전용 스킬 (예: 특정 프레임워크의 빌드 프로세스)
- 팀 내부에서 개발한 비즈니스 스킬
- 프로젝트 설정에 의존하는 스킬

#### 글로벌 설치

**사용 시나리오**: 모든 프로젝트에서 공통으로 사용하는 스킬

```bash
# ~/.claude/skills/에 설치
npx openskills install anthropics/skills --global
```

**장점**:

- ✅ 모든 프로젝트에서 동일한 스킬 세트 공유
- ✅ 각 프로젝트마다 반복 설치 불필요
- ✅ 업데이트를 중앙에서 관리

**권장 사항**:

- Anthropic 공식 스킬 라이브러리 (anthropics/skills)
- 일반 도구 스킬 (예: PDF 처리, Git 작업)
- 개인이 자주 사용하는 스킬

#### Universal 모드 (다중 에이전트 환경)

**사용 시나리오**: 여러 AI 에이전트를 동시에 사용

```bash
# .agent/skills/에 설치
npx openskills install anthropics/skills --universal
```

**우선순위 순서** (높은 순에서 낮은 순으로):

1. `./.agent/skills/` (프로젝트 로컬 Universal)
2. `~/.agent/skills/` (글로벌 Universal)
3. `./.claude/skills/` (프로젝트 로컬 Claude Code)
4. `~/.claude/skills/` (글로벌 Claude Code)

**권장 사항**:

- ✅ 여러 에이전트 사용 시 (Claude Code + Cursor + Windsurf)
- ✅ Claude Code Marketplace와의 충돌 방지
- ✅ 모든 에이전트의 스킬을 통합 관리

::: tip Universal 모드를 언제 사용해야 할까?

`AGENTS.md`가 Claude Code와 다른 에이전트 간에 공유되는 경우, `--universal`을 사용하여 스킬 충돌을 방지하세요. Universal 모드는 `.agent/skills/` 디렉터리를 사용하여 Claude Code의 `.claude/skills/`와 격리됩니다.

:::

### 2. 글로벌 설치보다 npx 우선 사용

OpenSkills는 사용 즉시 실행할 수 있도록 설계되었으므로 항상 `npx` 사용을 권장합니다:

```bash
# ✅ 권장: npx 사용
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ 피해야 할 것: 글로벌 설치 후 직접 호출
openskills install anthropics/skills
```

**장점**:

- ✅ 글로벌 설치 불필요, 버전 충돌 방지
- ✅ 항상 최신 버전 사용 (npx가 자동으로 업데이트)
- ✅ 시스템 의존성 감소

**글로벌 설치가 필요한 경우**:

- CI/CD 환경에서 (성능을 위해)
- 스크립트에서 자주 호출 (npx 시작 시간 단축)

```bash
# CI/CD 또는 스크립트에서 글로벌 설치
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## 스킬 관리 베스트 프랙티스

### 1. SKILL.md 작성 규칙

#### 명명 규칙: 하이픈 형식 사용

**규칙**:

- ✅ 올바름: `pdf-editor`, `api-client`, `git-workflow`
- ❌ 잘못됨: `PDF Editor` (공백), `pdf_editor` (밑줄), `PdfEditor` (카멜 케이스)

**이유**: 하이픈 형식은 URL 친화적인 식별자로, GitHub 저장소 및 파일 시스템 명명 규칙을 따릅니다.

#### 설명 작성: 3인칭, 1-2문장

**규칙**:

- ✅ 올바름: `Use this skill for comprehensive PDF manipulation.`
- ❌ 잘못됨: `You should use this skill to manipulate PDFs.` (2인칭)

**예시 비교**:

| 시나리오 | ❌ 잘못됨 (2인칭) | ✅ 올바름 (3인칭) |
|--- | --- | ---|
| PDF 스킬 | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Git 스킬 | When you need to manage branches, use this. | Manage Git branches with this skill. |
| API 스킬 | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### 지시사항 작성: Imperative/Infinitive 형식

**규칙**:

- ✅ 올바름: `"To accomplish X, execute Y"`
- ✅ 올바름: `"Load this skill when Z"`
- ❌ 잘못됨: `"You should do X"`
- ❌ 잘못됨: `"If you need Y"`

**작성 요령**:

1. **동사로 시작**: "Create" → "Use" → "Return"
2. **"You" 생략**: "You should"라고 말하지 않기
3. **명확한 경로**: 리소스 참조 시 `references/`로 시작

**예시 비교**:

| ❌ 잘못된 작성법 | ✅ 올바른 작성법 |
|--- | ---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip Imperative/Infinitive를 사용하는 이유?

이 작성 스타일은 AI 에이전트가 지시사항을 더 쉽게 구문 분석하고 실행할 수 있게 합니다. Imperative(명령형) 및 Infinitive(부정사) 형식은 "당신"이라는 주체를 제거하여 지시사항을 더 직접적이고 명확하게 만듭니다.

:::

### 2. 파일 크기 제어

**SKILL.md 파일 크기**:

- ✅ **권장**: 5,000 단어 이내
- ⚠️ **경고**: 8,000 단어 초과 시 컨텍스트 초과 가능
- ❌ **금지**: 10,000 단어 초과

**제어 방법**:

상세 문서를 `references/` 디렉터리로 이동:

```markdown
# SKILL.md (핵심 지시사항)

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # 상세 문서
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # 컨텍스트에 로드되지 않음, 토큰 절약
- `references/examples.md`
```

**파일 크기 비교**:

| 파일 | 크기 제한 | 컨텍스트 로드 여부 |
|--- | --- | ---|
| `SKILL.md` | < 5,000 단어 | ✅ 예 |
| `references/` | 제한 없음 | ❌ 아니오 (요청 시 로드) |
| `scripts/` | 제한 없음 | ❌ 아니오 (실행 가능) |
| `assets/` | 제한 없음 | ❌ 아니오 (템플릿 파일) |

### 3. 스킬 찾기 우선순위

OpenSkills는 다음 우선순위로 스킬을 찾습니다 (높은 순에서 낮은 순으로):

```
1. ./.agent/skills/        # Universal 프로젝트 로컬
2. ~/.agent/skills/        # Universal 글로벌
3. ./.claude/skills/      # Claude Code 프로젝트 로컬
4. ~/.claude/skills/      # Claude Code 글로벌
```

**중복 제거 메커니즘**:

- 동일한 이름의 스킬은 처음 찾은 것만 반환
- 프로젝트 로컬 스킬이 글로벌 스킬보다 우선

**예시 시나리오**:

```
프로젝트 A:
- .claude/skills/pdf        # 프로젝트 로컬 버전 v1.0
- ~/.claude/skills/pdf     # 글로벌 버전 v2.0

# openskills read pdf는 .claude/skills/pdf(v1.0)를 로드합니다.
```

**제안**:

- 프로젝트의 특별 요구사항 스킬은 프로젝트 로컬에 배치
- 일반 스킬은 글로벌에 배치
- 다중 에이전트 환경에서는 Universal 모드 사용

## 로컬 개발 베스트 프랙티스

### 1. 심볼릭 링크를 사용한 반복 개발

**문제**: 스킬을 수정할 때마다 다시 설치해야 하므로 개발 효율이 떨어짐

**해결책**: 심볼릭 링크(symlink) 사용

```bash
# 1. 스킬 저장소를 개발 디렉터리에 클론
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. 스킬 디렉터리 생성
mkdir -p .claude/skills

# 3. 심볼릭 링크 생성
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. AGENTS.md에 동기화
npx openskills sync
```

**장점**:

- ✅ 소스 파일을 수정하면 즉시 적용 (다시 설치 불필요)
- ✅ Git 기반 업데이트 지원 (pull만 하면 됨)
- ✅ 여러 프로젝트에서 동일한 스킬 개발 버전 공유

**심볼릭 링크 확인**:

```bash
# 심볼릭 링크 확인
ls -la .claude/skills/

# 출력 예시:
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**주의사항**:

- ✅ 심볼릭 링크는 `openskills list`에서 인식됨
- ✅ Broken symlinks는 자동으로 건너뜀 (충돌 없음)
- ⚠️ Windows 사용자는 Git Bash 또는 WSL 사용 필요 (Windows 네이티브는 심볼릭 링크를 지원하지 않음)

### 2. 다중 프로젝트 스킬 공유

**시나리오**: 여러 프로젝트에서 동일한 팀 스킬 세트를 사용해야 함

**방법 1: 글로벌 설치**

```bash
# 팀 스킬 저장소를 글로벌로 설치
npx openskills install your-org/team-skills --global
```

**방법 2: 개발 디렉터리에 심볼릭 링크**

```bash
# 각 프로젝트에 심볼릭 링크 생성
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**방법 3: Git Submodule**

```bash
# 스킬 저장소를 서브모듈로 추가
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# 서브모듈 업데이트
git submodule update --init --recursive
```

**권장 선택**:

| 방법 | 사용 시나리오 | 장점 | 단점 |
|--- | --- | --- | ---|
| 글로벌 설치 | 모든 프로젝트에서 통일된 스킬 공유 | 중앙 관리, 업데이트 편리 | 프로젝트별 사용자 정의 불가 |
| 심볼릭 링크 | 로컬 개발 및 테스트 | 수정 즉시 적용 | 링크 수동 생성 필요 |
| Git Submodule | 팀 협업, 버전 관리 | 프로젝트와 함께 버전 관리 | 서브모듈 관리 복잡 |

## 팀 협업 베스트 프랙티스

### 1. 스킬 버전 관리

**베스트 프랙티스**: 스킬 저장소를 독립적으로 버전 관리

```bash
# 팀 스킬 저장소 구조
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**설치 방법**:

```bash
# 팀 저장소에서 스킬 설치
npx openskills install git@github.com:your-org/team-skills.git
```

**업데이트 프로세스**:

```bash
# 모든 스킬 업데이트
npx openskills update

# 특정 스킬 업데이트
npx openskills update pdf-editor,api-client
```

**버전 관리 제안**:

- 안정적인 버전을 표시하기 위해 Git Tag 사용: `v1.0.0`, `v1.1.0`
- AGENTS.md에 스킬 버전 기록: `<skill name="pdf-editor" version="1.0.0">`
- CI/CD에서 안정적인 버전 고정 사용

### 2. 스킬 명명 규칙

**팀 통일 명명 규칙**:

| 스킬 유형 | 명명 패턴 | 예시 |
|--- | --- | ---|
| 일반 도구 | `<tool-name>` | `pdf`, `git`, `docker` |
| 프레임워크 관련 | `<framework>-<purpose>` | `react-component`, `django-model` |
| 워크플로우 | `<workflow>` | `ci-cd`, `code-review` |
| 팀 전용 | `<team>-<purpose>` | `team-api`, `company-deploy` |

**예시**:

```bash
# ✅ 통일된 명명
team-skills/
├── pdf/                     # PDF 처리
├── git-workflow/           # Git 워크플로우
├── react-component/        # React 컴포넌트 생성
└── team-api/             # 팀 API 클라이언트
```

### 3. 스킬 문서 규칙

**팀 통일 문서 구조**:

```markdown
---
name: <skill-name>
description: <1-2문장, 3인칭>
author: <팀/작성자>
version: <버전 번호>
---

# <스킬 제목>

## When to Use

Load this skill when:
- 시나리오 1
- 시나리오 2

## Instructions

To accomplish task:

1. 단계 1
2. 단계 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**필수 확인 항목**:

- [ ] `name`이 하이픈 형식인지
- [ ] `description`이 1-2문장, 3인칭인지
- [ ] 지시사항이 imperative/infinitive 형식인지
- [ ] `author` 및 `version` 필드 포함 (팀 규칙)
- [ ] 상세한 `When to Use` 설명 포함

## CI/CD 통합 베스트 프랙티스

### 1. 비대화식 설치 및 동기화

**시나리오**: CI/CD 환경에서 스킬 관리 자동화

**`-y` 플래그를 사용하여 대화형 프롬프트 건너뛰기**:

```bash
# CI/CD 스크립트 예시
#!/bin/bash

# 스킬 설치 (비대화식)
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# AGENTS.md에 동기화 (비대화식)
npx openskills sync -y
```

**GitHub Actions 예시**:

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. 스킬 업데이트 자동화

**정기적인 스킬 업데이트**:

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # 매주 일요일 업데이트
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. 사용자 정의 출력 경로

**시나리오**: 스킬을 사용자 정의 파일 (예: `.ruler/AGENTS.md`)로 동기화

```bash
# 사용자 정의 파일에 동기화
npx openskills sync -o .ruler/AGENTS.md -y
```

**CI/CD 예시**:

```yaml
# 다른 AI 에이전트용 다른 AGENTS.md 생성
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## 자주 묻는 질문 및 해결 방법

### 질문 1: 스킬을 찾을 수 없음

**증상**:

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**문제 해결 단계**:

1. 스킬이 설치되어 있는지 확인:
   ```bash
   npx openskills list
   ```

2. 스킬 이름이 올바른지 확인 (대소문자 구분):
   ```bash
   # ❌ 잘못됨
   npx openskills read My-Skill

   # ✅ 올바름
   npx openskills read my-skill
   ```

3. 스킬이 우선순위가 더 높은 디렉터리에서 덮어쓰였는지 확인:
   ```bash
   # 스킬 위치 확인
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### 질문 2: 심볼릭 링크에 액세스할 수 없음

**증상**:

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**해결 방법**:

- **macOS**: 시스템 환경설정에서 심볼릭 링크 허용
- **Windows**: Git Bash 또는 WSL 사용 (Windows 네이티브는 심볼릭 링크를 지원하지 않음)
- **Linux**: 파일 시스템 권한 확인

### 질문 3: 스킬 업데이트 후 적용되지 않음

**증상**:

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# 내용이 여전히 이전 버전임
```

**원인**: AI 에이전트가 이전 스킬 내용을 캐시함

**해결 방법**:

1. AGENTS.md를 다시 동기화:
   ```bash
   npx openskills sync
   ```

2. 스킬 파일의 타임스탬프 확인:
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. 심볼릭 링크를 사용하는 경우 스킬 다시 로드:
   ```bash
   npx openskills read my-skill
   ```

## 이 수업 요약

OpenSkills 베스트 프랙티스 핵심 요점:

### 프로젝트 설정

- ✅ 프로젝트 로컬 설치: 특정 프로젝트 전용 스킬
- ✅ 글로벌 설치: 모든 프로젝트에 공통적인 스킬
- ✅ Universal 모드: 다중 에이전트 환경에서 스킬 공유
- ✅ 글로벌 설치보다 `npx` 우선 사용

### 스킬 관리

- ✅ SKILL.md 작성 규칙: 하이픈 명명, 3인칭 설명, imperative 지시사항
- ✅ 파일 크기 제어: SKILL.md < 5,000 단어, 상세 문서는 `references/`에
- ✅ 스킬 찾기 우선순위: 4개 디렉터리의 우선순위와 중복 제거 메커니즘 이해

### 로컬 개발

- ✅ 심볼릭 링크를 사용한 반복 개발
- ✅ 다중 프로젝트 스킬 공유: 글로벌 설치, 심볼릭 링크, Git Submodule

### 팀 협업

- ✅ 스킬 버전 관리: 독립 저장소, Git Tag
- ✅ 통일 명명 규칙: 도구, 프레임워크, 워크플로우
- ✅ 통일 문서 규칙: author, version, When to Use

### CI/CD 통합

- ✅ 비대화식 설치 및 동기화: `-y` 플래그
- ✅ 자동화 업데이트: 정기 작업, workflow_dispatch
- ✅ 사용자 정의 출력 경로: `-o` 플래그

## 다음 수업 예고

> 다음 수업에서는 **[자주 묻는 질문](../faq/faq/)**을 학습합니다.
>
> 다음 내용을 배우게 됩니다:
> - OpenSkills 자주 묻는 질문에 대한 빠른 답변
> - 설치 실패, 스킬이 로드되지 않는 등의 문제 해결 방법
> - Claude Code와 공존하는 설정 팁

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| 스킬 찾기 우선순위 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| 스킬 중복 제거 메커니즘 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| 심볼릭 링크 처리 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| YAML 필드 추출 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| 경로 탐색 보호 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| 비대화식 설치 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| 사용자 정의 출력 경로 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**핵심 상수**:
- 4개 스킬 검색 디렉터리: `./.agent/skills/`, `~/.agent/skills/`, `./.claude/skills/`, `~/.claude/skills/`

**핵심 함수**:
- `getSearchDirs(): string[]` - 우선순위별로 정렬된 스킬 검색 디렉터리 반환
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - 디렉터리 또는 디렉터리를 가리키는 심볼릭 링크 확인
- `extractYamlField(content: string, field: string): string` - YAML 필드 값 추출 (비탐욕 매칭)
- `isPathInside(path: string, targetDir: string): boolean` - 경로가 대상 디렉터리 내에 있는지 확인 (경로 탐색 방지)

**예시 스킬 파일**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 최소 구조 예시
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 형식 규칙 참조

</details>
