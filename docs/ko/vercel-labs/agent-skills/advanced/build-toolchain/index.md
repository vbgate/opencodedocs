---
title: "Agent Skills Build Toolchain: 검증, 빌드 및 CI 통합 | Agent Skills 튜토리얼"
sidebarTitle: "규칙 검증 및 자동 빌드"
subtitle: "빌드 툴체인 사용"
description: "Agent Skills 빌드 툴체인 사용법을 학습합니다. pnpm validate로 규칙 완성도 검증, pnpm build로 AGENTS.md 및 test-cases.json 생성, pnpm dev 개발 워크플로우, GitHub Actions CI 통합 설정, 테스트 케이스 추출 및 LLM 자동 평가를 다룹니다. 이 튜토리얼에서는 규칙 라이브러리 관리, 자동화된 검증 워크플로우, 지속적 통합 통합, 테스트 케이스 추출, 빌드 시스템 유지 관리, 규칙 품질 보장 방법을 배웁니다."
tags:
  - "빌드 도구"
  - "CI/CD"
  - "자동화"
  - "코드 검증"
order: 80
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# 빌드 툴체인 사용

## 학습 완료 후 할 수 있는 것

이 강의를 마치면 다음을 수행할 수 있습니다:

- ✅ `pnpm validate`를 사용하여 규칙 파일의 형식과 완성도 검증
- ✅ `pnpm build`를 사용하여 AGENTS.md 및 test-cases.json 생성
- ✅ 빌드 프로세스 이해: parse → validate → group → sort → generate
- ✅ GitHub Actions CI 자동 검증 및 빌드 구성
- ✅ LLM 자동 평가를 위한 테스트 케이스 추출
- ✅ `pnpm dev`를 사용한 빠른 개발 워크플로우 (build + validate)

## 현재 겪고 있는 어려움

React 규칙 라이브러리를 유지 관리하거나 확장하는 중 다음과 같은 문제가 발생했을 수 있습니다:

- ✗ 규칙을 수정한 후 형식 검증을 잊어 생성된 AGENTS.md에 오류가 발생
- ✗ 규칙 파일이 점점 늘어나 각 파일의 완성도를 수동으로 확인하는 데 시간이 너무 오래 걸림
- ✗ 코드를 제출한 후에야 특정 규칙에 코드 예제가 없음을 발견하여 PR 검토 효율성에 영향을 미침
- ✗ CI에서 규칙을 자동으로 검증하려고 하지만 GitHub Actions를 구성하는 방법을 모름
- ✗ `build.ts`의 빌드 프로세스를 이해하지 못하여 오류 발생 시 어디에서 조사를 시작해야 할지 모름

## 이 기능을 사용하는 시기

다음이 필요할 때 사용하세요:

- 🔍 **규칙 검증**: 코드 제출 전 모든 규칙 파일이 규격을 준수하는지 확인
- 🏗️ **문서 생성**: Markdown 규칙 파일에서 구조화된 AGENTS.md 생성
- 🤖 **테스트 케이스 추출**: LLM 자동 평가를 위한 테스트 데이터 준비
- 🔄 **CI 통합**: GitHub Actions에서 자동화된 검증 및 빌드
- 🚀 **빠른 개발**: `pnpm dev`를 사용하여 규칙을 빠르게 반복하고 검증

## 🎒 시작하기 전 준비 사항

시작하기 전에 다음을 확인하세요:

::: warning 전제 조건 확인

- [Agent Skills 시작하기](../../start/getting-started/) 완료
- Agent Skills 설치 및 기본 사용법 숙지
- React 규칙 작성 규격 이해 ([React 모범 사례 규칙 작성](../rule-authoring/) 학습 권장)
- 기본적인 명령줄 작업 경험
- pnpm 패키지 관리자 기본 사용법 이해

:::

## 핵심 개념

**빌드 툴체인의 역할**:

Agent Skills 규칙 라이브러리는 본질적으로 57개의 독립적인 Markdown 파일이지만, Claude는 구조화된 AGENTS.md가 있어야 효율적으로 사용할 수 있습니다. 빌드 툴체인은 다음을 담당합니다:

1. **규칙 파일 파싱**: Markdown에서 title, impact, examples 등의 필드 추출
2. **완성도 검증**: 각 규칙에 title, explanation, 코드 예제가 있는지 확인
3. **그룹화 및 정렬**: 챕터별로 그룹화하고, 제목 알파벳 순으로 정렬하고, ID 할당 (1.1, 1.2...)
4. **문서 생성**: 형식화된 AGENTS.md 및 test-cases.json 출력

**빌드 프로세스**:

```
rules/*.md (57개 파일)
    ↓
[parser.ts] Markdown 파싱
    ↓
[validate.ts] 완성도 검증
    ↓
[build.ts] 그룹화 → 정렬 → AGENTS.md 생성
    ↓
[extract-tests.ts] 테스트 케이스 추출 → test-cases.json
```

**네 가지 핵심 명령어**:

| 명령어                 | 기능                              | 사용 시기             |
| --- | --- | ---|
| `pnpm validate`      | 모든 규칙 파일의 형식과 완성도 검증    | 제출 전 확인, CI 검증  |
| `pnpm build`         | AGENTS.md 및 test-cases.json 생성 | 규칙 수정 후, 배포 전   |
| `pnpm dev`           | build + validate 실행（개발 워크플로우）| 빠른 반복, 새 규칙 개발 |
| `pnpm extract-tests` | 테스트 케이스만 추출（재빌드 없이）    | 테스트 데이터만 업데이트할 때 |

---

## 따라하기: 빌드 툴체인 사용

### 1단계: 규칙 검증 (`pnpm validate`)

**이유**
규칙을 개발하거나 수정할 때 먼저 모든 규칙 파일이 규격을 준수하는지 확인하여 빌드 시점에서야 오류를 발견하는 것을 방지합니다.

빌드 툴체인 디렉토리로 이동:

```bash
cd packages/react-best-practices-build
```

검증 명령어 실행:

```bash
pnpm validate
```

**보여야 하는 결과**:

```bash
Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**오류가 있을 경우**:

```bash
✗ Validation failed:

  async-parallel.md: Missing or empty title
  bundle-dynamic-imports.md: Missing code examples
  rerender-memo.md: Invalid impact level: SUPER_HIGH
```

**검증하는 내용** (소스: `validate.ts`):

- ✅ title이 비어있지 않음
- ✅ explanation이 비어있지 않음
- ✅ 최소 하나의 코드 예제 포함
- ✅ 최소 하나의 "Incorrect/bad" 또는 "Correct/good" 예제 포함
- ✅ impact 레벨이 유효함 (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

### 2단계: 문서 빌드 (`pnpm build`)

**이유**
규칙 파일에서 Claude가 사용하는 AGENTS.md 및 test-cases.json을 생성합니다.

빌드 명령어 실행:

```bash
pnpm build
```

**보여야 하는 결과**:

```bash
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules
```

**생성된 파일**:

1. **AGENTS.md** (위치: `skills/react-best-practices/AGENTS.md`)
   - 구조화된 React 성능 최적화 가이드
   - 8개 섹션, 57개 규칙 포함
   - impact 레벨 순으로 정렬 (CRITICAL → HIGH → MEDIUM...)

2. **test-cases.json** (위치: `packages/react-best-practices-build/test-cases.json`)
   - 모든 규칙에서 추출한 테스트 케이스
   - bad 및 good 예제 포함
   - LLM 자동 평가에 사용

**AGENTS.md 구조 예시**:

```markdown
# React Best Practices

Version 1.0
Vercel Engineering
January 2026

---

## Abstract

Performance optimization guide for React and Next.js applications, ordered by impact.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 [Parallel async operations](#11-parallel-async-operations)
   - 1.2 [Deferring non-critical async operations](#12-deferring-non-critical-async-outputs)

2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 [Dynamic imports for large components](#21-dynamic-imports-for-large-components)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Eliminating request waterfalls is the most impactful performance optimization you can make in React and Next.js applications.

### 1.1 Parallel async operations

**Impact: CRITICAL**

...

**Incorrect:**

```typescript
// Sequential fetching creates waterfalls
const userData = await fetch('/api/user').then(r => r.json())
const postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())
```

**Correct:**

```typescript
// Fetch in parallel
const [userData, postsData] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
])
```
```

**test-cases.json 구조 예시**:

```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "bad",
    "code": "// Sequential fetching creates waterfalls\nconst userData = await fetch('/api/user').then(r => r.json())\nconst postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())",
    "language": "typescript",
    "description": "Incorrect example for Parallel async operations"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "good",
    "code": "// Fetch in parallel\nconst [userData, postsData] = await Promise.all([\n  fetch('/api/user').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json())\n])",
    "language": "typescript",
    "description": "Correct example for Parallel async operations"
  }
]
```

### 3단계: 개발 워크플로우 (`pnpm dev`)

**이유**
새 규칙을 개발하거나 기존 규칙을 수정할 때 빠르게 반복하고 검증하며 전체 프로세스를 빌드해야 합니다.

개발 명령어 실행:

```bash
pnpm dev
```

**이 명령어는 다음을 수행합니다**:

1. `pnpm build-agents` 실행 (AGENTS.md 생성)
2. `pnpm extract-tests` 실행 (test-cases.json 생성)
3. `pnpm validate` 실행 (모든 규칙 검증)

**보여야 하는 결과**:

```bash
pnpm build-agents && pnpm extract-tests
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules

Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57

Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**개발 워크플로우 권장사항**:

```bash
# 1. 규칙 파일 수정 또는 생성
vim skills/react-best-practices/rules/my-new-rule.md

# 2. pnpm dev로 빠른 검증 및 빌드 실행
cd packages/react-best-practices-build
pnpm dev

# 3. 생성된 AGENTS.md 확인
cat ../skills/react-best-practices/AGENTS.md

# 4. Claude가 새 규칙을 올바르게 사용하는지 테스트
# (Claude Code에서 스킬을 활성화하고 테스트)
```

**버전 번호 업그레이드** (선택사항):

```bash
pnpm build --upgrade-version
```

이 명령어는 자동으로 다음을 수행합니다:
- `metadata.json`의 버전 번호 증가 (예: 1.0 → 1.1)
- `SKILL.md` Front Matter의 version 필드 업데이트

**보여야 하는 결과**:

```bash
Upgrading version: 1.0 -> 1.1
✓ Updated metadata.json
✓ Updated SKILL.md
```

### 4단계: 테스트 케이스 개별 추출 (`pnpm extract-tests`)

**이유**
테스트 데이터 추출 로직만 업데이트했고 AGENTS.md를 다시 빌드할 필요가 없는 경우 `extract-tests`를 개별적으로 실행할 수 있습니다.

```bash
pnpm extract-tests
```

**보여야 하는 결과**:

```bash
Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57
```

---

## 체크포인트 ✅

이제 빌드 툴체인을 이해했는지 확인하세요:

- [ ] `pnpm validate`가 어떤 필드를 검증하는지 알고 있음
- [ ] `pnpm build`가 어떤 파일을 생성하는지 알고 있음
- [ ] `pnpm dev`의 개발 워크플로우를 알고 있음
- [ ] test-cases.json의 용도를 알고 있음
- [ ] 버전 번호를 업그레이드하는 방법을 알고 있음 (`--upgrade-version`)
- [ ] AGENTS.md의 구조를 알고 있음 (챕터 → 규칙 → 예제)

---

## GitHub Actions CI 통합

### CI가 필요한 이유

팀 협업에서 CI는 다음을 수행할 수 있습니다:
- ✅ 규칙 파일 형식 자동 검증
- ✅ AGENTS.md 자동 빌드
- ✅ 규격에 맞지 않는 코드 제출 방지

### CI 설정 파일

GitHub Actions 설정은 `.github/workflows/react-best-practices-ci.yml`에 위치합니다:

```yaml
name: React Best Practices CI

on:
  push:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'
  pull_request:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/react-best-practices-build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.24.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: packages/react-best-practices-build/pnpm-lock.yaml
      - run: pnpm install
      - run: pnpm validate
      - run: pnpm build
```

### CI 트리거 조건

CI는 다음 상황에서 자동으로 실행됩니다:

| 이벤트           | 조건                                                                                                      |
| --- | ---|
| `push`         | `main` 브랜치에 푸시하고, `skills/react-best-practices/**` 또는 `packages/react-best-practices-build/**`를 수정한 경우 |
| `pull_request` | `main` 브랜치로 PR을 생성하거나 업데이트하고, 위 경로를 수정한 경우                                                            |

### CI 실행 단계

1. **코드 체크아웃**: `actions/checkout@v4`
2. **pnpm 설치**: `pnpm/action-setup@v2` (버전 10.24.0)
3. **Node.js 설치**: `actions/setup-node@v4` (버전 20)
4. **의존성 설치**: `pnpm install` (pnpm 캐시 사용)
5. **규칙 검증**: `pnpm validate`
6. **문서 빌드**: `pnpm build`

어떤 단계에서라도 실패하면 CI는 ❌로 표시되고 병합이 차단됩니다.

---

## 함정 피하기

### 함정 1: 검증은 통과했지만 빌드가 실패함

**증상**: `pnpm validate`는 통과했지만 `pnpm build`에서 오류가 발생합니다.

**원인**: 검증은 규칙 파일 형식만 확인하고, _sections.md나 metadata.json은 확인하지 않습니다.

**해결 방법**:
```bash
# _sections.md가 있는지 확인
ls skills/react-best-practices/rules/_sections.md

# metadata.json이 있는지 확인
ls skills/react-best-practices/metadata.json

# 빌드 로그에서 구체적인 오류 확인
pnpm build 2>&1 | grep -i error
```

### 함정 2: 규칙 ID가 연속적이지 않음

**증상**: 생성된 AGENTS.md에서 규칙 ID가 건너뜁니다 (예: 1.1, 1.3, 1.5).

**원인**: 규칙은 제목 알파벳 순으로 정렬되며, 파일명 순으로 정렬되지 않습니다.

**해결 방법**:
```bash
# 빌드가 자동으로 제목 순으로 정렬하고 ID를 할당합니다
# 사용자 정의 순서가 필요한 경우 규칙의 title을 수정하세요
# 예: "A. Parallel"로 변경 (A로 시작하면 앞에 정렬됨)
pnpm build
```

### 함정 3: test-cases.json에 bad 예제만 있음

**증상**: `pnpm extract-tests` 출력에 "Bad examples: 0"이 표시됩니다.

**원인**: 규칙 파일의 예제 태그가 규격에 맞지 않습니다.

**해결 방법**:
```markdown
# ❌ 잘못됨: 태그가 규격에 맞지 않음
**Example:**

**Typo:**

# ✅ 올바름: Incorrect 또는 Correct 사용
**Incorrect:**

**Correct:**

# 또는 bad/good 태그 사용 (wrong, usage 등도 지원됨)
**Bad example:**

**Good example:**
```

### 함정 4: CI에서 pnpm validate 실패

**증상**: 로컬 `pnpm validate`는 통과하지만 CI에서는 실패합니다.

**원인**:
- Node.js 버전 불일치 (CI는 v20 사용, 로컬은 다른 버전 사용 가능)
- pnpm 버전 불일치 (CI는 10.24.0 사용)
- Windows와 Linux 줄바꿈 문자 차이

**해결 방법**:
```bash
# 로컬 Node 버전 확인
node --version  # v20.x 여야 함

# 로컬 pnpm 버전 확인
pnpm --version  # >= 10.24.0 여야 함

# 줄바꿈 통일 (LF로 변환)
git config core.autocrlf input
git add --renormalize .
git commit -m "Fix line endings"
```

### 함정 5: 버전 번호 업그레이드 후 SKILL.md가 업데이트되지 않음

**증상**: `pnpm build --upgrade-version` 후 `metadata.json` 버전 번호는 변경되었지만 `SKILL.md`는 변경되지 않았습니다.

**원인**: SKILL.md Front Matter의 version 형식이 일치하지 않습니다.

**해결 방법**:
```yaml
# SKILL.md Front Matter 확인
---
version: "1.0"  # ✅ 반드시 따옴표 필요
---

# 버전 번호에 따옴표가 없으면 수동으로 추가
---
version: 1.0   # ❌ 잘못됨
version: "1.0" # ✅ 올바름 (따옴표 추가)
---
```

---

## 본 강의 요약

**핵심 요점**:

1. **검증 (validate)**: 규칙 형식, 완성도, impact 레벨 확인
2. **빌드 (build)**: 규칙 파싱 → 그룹화 → 정렬 → AGENTS.md 생성
3. **테스트 추출 (extract-tests)**: examples에서 bad/good 예제 추출
4. **개발 워크플로우 (dev)**: `validate + build + extract-tests`로 빠른 반복
5. **CI 통합**: GitHub Actions 자동 검증 및 빌드, 잘못된 코드 제출 방지

**개발 워크플로우**:

```
규칙 수정/생성
    ↓
pnpm dev（검증 + 빌드 + 테스트 추출）
    ↓
AGENTS.md 및 test-cases.json 확인
    ↓
코드 제출 → CI 자동 실행
    ↓
PR 검토 → main에 병합
```

**모범 사례 구두诀**:

> 수정 후 검증하고, 빌드 후 제출하라
> dev 명령으로 전체 프로세스, 한 번에 끝내 효율적으로
> CI가 자동 검증, PR 검토가 더 수월
> 버전 업그레이드할 때 metadata도 함께 수정

---

## 다음 강의 예고

> 다음 강의에서는 **[문제 해결](../../faq/troubleshooting/)**을 학습합니다.
>
> 배울 내용:
> - 배포 네트워크 오류(Network Egress Error) 해결
> - 스킬이 활성화되지 않는 문제 처리
> - 규칙 검증 실패(VALIDATION_ERROR) 문제 해결
> - 프레임워크 감지 부정확 문제 수정
> - 파일 권한 문제 해결

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능                  | 파일 경로                                                                                                                                                                     | 라인 번호    |
| --- | --- | ---|
| package.json 스크립트 정의 | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json)                 | 6-12    |
| 빌드 진입 함수          | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)                 | 131-290 |
| 규칙 파서            | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts)               | 전체    |
| 규칙 검증 함수          | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)           | 21-66   |
| 테스트 케이스 추출          | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38   |
| 경로 설정              | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts)               | 전체    |
| GitHub Actions CI     | [`.github/workflows/react-best-practices-ci.yml`](https://github.com/vercel-labs/agent-skills/blob/main/.github/workflows/react-best-practices-ci.yml)                       | 전체    |
| 규칙 파일 템플릿          | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md)                     | 전체    |

**주요 상수** (`config.ts`):
- `RULES_DIR`: 규칙 파일 디렉토리 경로
- `METADATA_FILE`: 메타데이터 파일 (metadata.json) 경로
- `OUTPUT_FILE`: AGENTS.md 출력 경로
- `TEST_CASES_FILE`: 테스트 케이스 JSON 출력 경로

**주요 함수**:
- `build()`: 메인 빌드 함수, 규칙 파싱 → 그룹화 → 정렬 → 문서 생성
- `validateRule()`: 개별 규칙의 완성도 검증 (title, explanation, examples, impact)
- `extractTestCases()`: 규칙의 examples에서 bad/good 테스트 케이스 추출
- `generateMarkdown()`: Section 배열에서 AGENTS.md 콘텐츠 생성

**검증 규칙** (`validate.ts:21-66`):
- title이 비어있지 않음
- explanation이 비어있지 않음
- 최소 하나의 코드 예제 포함
- 최소 하나의 "Incorrect/bad" 또는 "Correct/good" 예제 포함
- impact 레벨이 유효함

**CI 워크플로우**:
- 트리거 조건: `skills/react-best-practices/**` 또는 `packages/react-best-practices-build/**`를 수정하여 `main`에 push/PR
- 실행 단계: checkout → pnpm 설치 → Node.js 설치 → pnpm install → pnpm validate → pnpm build

</details>
