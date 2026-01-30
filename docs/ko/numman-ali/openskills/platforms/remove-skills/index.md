---
title: "스킬 삭제: 대화형 및 스크립트 방식 | OpenSkills"
sidebarTitle: "안전하게 이전 스킬 삭제"
subtitle: "스킬 삭제: 대화형 및 스크립트 방식"
description: "OpenSkills의 두 가지 스킬 삭제 방법을 학습합니다. 대화형 manage와 스크립트 remove 명령의 사용 시나리오, 위치 확인 및 일반적인 문제 해결을 통해 스킬 라이브러리를 안전하게 정리합니다."
tags:
  - "스킬 관리"
  - "명령어 사용"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
  - "platforms-list-skills"
order: 6
---

# 스킬 삭제

## 학습 후 할 수 있는 것

- `openskills manage`를 사용하여 여러 스킬을 대화형으로 삭제
- `openskills remove`를 사용하여 지정된 스킬을 스크립트 방식으로 삭제
- 두 가지 삭제 방식의 사용 시나리오 이해
- 삭제할 대상이 project인지 global인지 확인
- 더 이상 필요하지 않은 스킬을 안전하게 정리

## 현재의 어려움

스킬이 많이 설치됨에 따라 다음과 같은 문제에 직면할 수 있습니다:

- "더 이상 사용하지 않는 스킬이 몇 개 있는데, 일일이 삭제하려니 너무 번거로워요"
- "스크립트에서 자동으로 스킬을 삭제하고 싶은데, manage 명령은 대화형 선택이 필요해요"
- "스킬이 project에 설치되었는지 global에 설치되었는지 확실하지 않아, 삭제 전에 확인하고 싶어요"
- "여러 스킬을 한꺼번에 삭제하다가 사용 중인 것을 실수로 삭제할까 봐 걱정돼요"

OpenSkills는 이러한 문제를 해결하기 위해 두 가지 삭제 방법을 제공합니다: **대화형 manage**(수동으로 여러 스킬 선택에 적합)와 **스크립트 remove**(정확하게 단일 스킬 삭제에 적합).

## 이 방법을 사용하는 경우

| 시나리오 | 권장 방식 | 명령 |
| --- | --- | --- |
| 수동으로 여러 스킬 삭제 | 대화형 선택 | `openskills manage` |
| 스크립트 또는 CI/CD로 자동 삭제 | 정확한 스킬 이름 지정 | `openskills remove <name>` |
| 스킬 이름만 알고 있고 빠르게 삭제 | 직접 삭제 | `openskills remove <name>` |
| 삭제 가능한 스킬 확인 후 삭제 | 목록 먼저 확인 후 삭제 | `openskills list` → `openskills manage` |

## 핵심 개념

OpenSkills의 두 가지 삭제 방법은 다른 시나리오에 적합합니다.

### 대화형 삭제: `openskills manage`

- **특징**: 설치된 모든 스킬을 표시하고 삭제할 스킬을 체크할 수 있음
- **적용**: 수동으로 스킬 라이브러리를 관리하고 여러 스킬을 한 번에 삭제
- **장점**: 실수로 삭제할 위험이 없으며, 모든 옵션을 미리 볼 수 있음
- **기본 동작**: **어떤 스킬도 선택하지 않음**(실수 삭제 방지)

### 스크립트 삭제: `openskills remove <name>`

- **특징**: 지정된 스킬을 직접 삭제
- **적용**: 스크립트, 자동화, 정확한 삭제
- **장점**: 빠르고 상호작용 불필요
- **위험**: 스킬 이름을 잘못 입력하면 오류가 발생하며, 다른 스킬을 실수로 삭제하지 않음

### 삭제 원리

두 방법 모두 **전체 스킬 디렉토리**(SKILL.md, references/, scripts/, assets/ 등 모든 파일 포함)를 삭제하며 잔여물을 남기지 않습니다.

::: tip 삭제는 복구 불가능
스킬을 삭제하면 전체 스킬 디렉토리가 삭제되며 복구할 수 없습니다. 삭제 전에 스킬이 더 이상 필요하지 않은지 확인하거나, 필요하면 다시 설치할 수 있습니다.
:::

## 따라 해보기

### 1단계: 대화형으로 여러 스킬 삭제

**이유**
삭제할 스킬이 여러 개 있는 경우 대화형 선택이 더 안전하고 직관적입니다

다음 명령을 실행합니다:

```bash
npx openskills manage
```

**예상 결과**

먼저 설치된 모든 스킬 목록(project/global 순으로 정렬)이 표시됩니다:

```
? Select skills to remove:
❯◯ pdf                         (project)
  ◯ code-analyzer                (project)
  ◯ email-reader                 (global)
  ◯ git-tools                    (global)
```

- **파란색** `(project)`: 프로젝트 레벨 스킬
- **회색** `(global)`: 전역 레벨 스킬
- **스페이스바**: 체크/체크 해제
- **엔터**: 삭제 확인

예를 들어 `pdf`와 `git-tools`를 체크하고 엔터를 눌렀다고 가정해 봅시다:

**예상 결과**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info 기본적으로 선택되지 않음
manage 명령은 기본적으로 **어떤 스킬도 선택하지 않으며**, 이는 실수 삭제를 방지하기 위함입니다. 스페이스바를 사용하여 삭제할 스킬을 수동으로 체크해야 합니다.
:::

### 2단계: 스크립트 방식으로 단일 스킬 삭제

**이유**
스킬 이름을 알고 있고 빠르게 삭제하고 싶을 때

다음 명령을 실행합니다:

```bash
npx openskills remove pdf
```

**예상 결과**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

스킬이 존재하지 않는 경우:

```
Error: Skill 'pdf' not found
```

프로그램은 오류 코드 1을 반환하고 종료됩니다(스크립트 판단에 적합).

### 3단계: 삭제 위치 확인

**이유**
삭제 전 스킬 위치(project vs global)를 확인하여 실수 삭제 방지

스킬을 삭제할 때 명령은 삭제 위치를 표시합니다:

```bash
# 스크립트 방식 삭제는 상세한 위치를 표시
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# 대화형 삭제도 각 스킬의 위치를 표시
npx openskills manage
# 체크 후 엔터
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**판단 규칙**:
- 경로가 현재 프로젝트 디렉토리를 포함하면 → `(project)`
- 경로가 홈 디렉토리를 포함하면 → `(global)`

### 4단계: 삭제 후 검증

**이유**
삭제 성공을 확인하고 누락 방지

스킬을 삭제한 후 list 명령으로 검증합니다:

```bash
npx openskills list
```

**예상 결과**

삭제된 스킬은 목록에 더 이상 표시되지 않습니다.

## 체크포인트 ✅

다음 내용을 확인하세요:

- [ ] `openskills manage` 실행 시 모든 스킬 목록이 표시됨
- [ ] 스페이스바로 스킬 체크/체크 해제가 가능함
- [ ] 기본적으로 어떤 스킬도 선택되지 않음(실수 삭제 방지)
- [ ] `openskills remove <name>` 실행 시 지정된 스킬 삭제 가능
- [ ] 삭제 시 project 또는 global 위치가 표시됨
- [ ] 삭제 후 `openskills list`로 스킬이 삭제되었는지 검증

## 자주 발생하는 문제들

### 문제 1: 사용 중인 스킬을 실수로 삭제

**현상**: 삭제 후에야 스킬이 아직 사용 중임을 발견

**해결 방법**:

다시 설치하면 됩니다:

```bash
# GitHub에서 설치한 경우
npx openskills install anthropics/skills

# 로컬 경로에서 설치한 경우
npx openskills install ./path/to/skill
```

OpenSkills는 설치 소스를 기록합니다(`.openskills.json` 파일), 다시 설치할 때 원래 경로 정보를 잃지 않습니다.

### 문제 2: manage 명령에 "No skills installed" 표시

**현상**: `openskills manage` 실행 시 설치된 스킬이 없다고 표시

**원인**: 현재 디렉토리에 실제로 스킬이 없음

**문제 해결 단계**:

1. 올바른 프로젝트 디렉토리에 있는지 확인
2. 전역 스킬이 설치되었는지 확인(`openskills list --global`)
3. 스킬을 설치한 디렉토리로 이동 후 다시 시도

```bash
# 프로젝트 디렉토리로 이동
cd /path/to/your/project

# 다시 시도
npx openskills manage
```

### 문제 3: remove 명령에 "Skill not found" 오류

**현상**: `openskills remove <name>` 실행 시 스킬이 존재하지 않는다고 표시

**원인**: 스킬 이름의 철자가 틀렸거나 이미 삭제됨

**문제 해결 단계**:

1. 먼저 list 명령으로 올바른 스킬 이름 확인:

```bash
npx openskills list
```

2. 스킬 이름 철자 확인(대소문자 및 하이픈 주의)

3. 스킬이 project인지 global인지 확인(다른 디렉토리에서 찾기)

```bash
# 프로젝트 스킬 확인
ls -la .claude/skills/

# 전역 스킬 확인
ls -la ~/.claude/skills/
```

### 문제 4: 삭제 후 스킬이 AGENTS.md에 계속 표시

**현상**: 스킬을 삭제한 후 AGENTS.md에 여전히 이 스킬의 참조가 있음

**원인**: 스킬 삭제는 AGENTS.md를 자동으로 업데이트하지 않음

**해결 방법**:

sync 명령을 다시 실행합니다:

```bash
npx openskills sync
```

sync는 설치된 스킬을 다시 스캔하고 AGENTS.md를 업데이트하며, 삭제된 스킬은 목록에서 자동으로 제거됩니다.

## 강의 요약

OpenSkills는 두 가지 스킬 삭제 방법을 제공합니다:

### 대화형 삭제: `openskills manage`

- 🎯 **적용 시나리오**: 수동으로 스킬 라이브러리를 관리하고 여러 스킬 삭제
- ✅ **장점**: 직관적, 실수 없음, 미리보기 가능
- ⚠️ **주의**: 기본적으로 어떤 스킬도 선택되지 않으며, 수동으로 체크 필요

### 스크립트 삭제: `openskills remove <name>`

- 🎯 **적용 시나리오**: 스크립트, 자동화, 정확한 삭제
- ✅ **장점**: 빠르고 상호작용 불필요
- ⚠️ **주의**: 스킬 이름을 잘못 입력하면 오류 발생

**핵심 요점**:

1. 두 방법 모두 전체 스킬 디렉토리를 삭제하며 복구 불가능
2. 삭제 시 project 또는 global 위치가 표시됨
3. 삭제 후 `openskills list`로 검증
4. `openskills sync`를 다시 실행하여 AGENTS.md 업데이트

## 다음 강의 예고

> 다음 강의에서는 **[Universal 모드: 다중 에이전트 환경](../../advanced/universal-mode/)**을 학습합니다.
>
> 배울 내용:
> - `--universal` 플래그를 사용하여 Claude Code와의 충돌 방지 방법
> - 다중 에이전트 환경에서 통합 스킬 관리
> - `.agent/skills` 디렉토리의 역할

---

## 부록: 소스코드 참조

<details>
<summary><strong>소스코드 위치 확인 (클릭하여 펼치기)</strong></summary>

> 최종 업데이트: 2026-01-24

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| manage 명령 구현 | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62 |
| remove 명령 구현 | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21 |
| 모든 스킬 찾기 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64 |
| 지정된 스킬 찾기 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90 |

**핵심 함수**:
- `manageSkills()`: 대화형으로 스킬을 삭제하고 inquirer checkbox를 사용하여 사용자가 선택하게 함
- `removeSkill(skillName)`: 스크립트 방식으로 지정된 스킬을 삭제하고, 찾지 못하면 오류를 출력하고 종료
- `findAllSkills()`: 4개의 검색 디렉토리를 순회하며 모든 스킬을 수집
- `findSkill(skillName)`: 지정된 스킬을 찾고 Skill 객체를 반환

**핵심 상수**:
- 없음(모든 경로와 구성은 동적으로 계산됨)

**핵심 로직**:

1. **manage 명령**(src/commands/manage.ts):
   - `findAllSkills()`를 호출하여 모든 스킬을 가져옴(11번 라인)
   - project/global으로 정렬(20-25번 라인)
   - inquirer `checkbox`를 사용하여 사용자가 선택하게 함(33-37번 라인)
   - 기본 `checked: false`, 어떤 스킬도 선택하지 않음(30번 라인)
   - 선택된 스킬을 순회하며 `rmSync`를 호출하여 삭제(45-52번 라인)

2. **remove 명령**(src/commands/remove.ts):
   - `findSkill(skillName)`를 호출하여 스킬을 찾음(9번 라인)
   - 찾지 못하면 오류를 출력하고 `process.exit(1)`로 종료(12-14번 라인)
   - `rmSync`를 호출하여 전체 스킬 디렉토리를 삭제(16번 라인)
   - `homedir()`를 통해 project인지 global인지 판단(18번 라인)

3. **삭제 작업**:
   - `rmSync(baseDir, { recursive: true, force: true })`를 사용하여 전체 스킬 디렉토리를 삭제
   - `recursive: true`: 모든 하위 파일과 하위 디렉토리를 재귀적으로 삭제
   - `force: true`: 파일이 없는 오류를 무시

</details>
