---
title: "사용자 정의 출력 경로: 유연한 스킬 위치 관리 | openskills"
sidebarTitle: "스킬을 원하는 위치에 배치"
subtitle: "사용자 정의 출력 경로: 유연한 스킬 위치 관리 | openskills"
description: "openskills sync -o 명령어를 사용하여 스킬을 임의의 위치로 유연하게 동기화하는 방법을 배웁니다. 다중 도구 환경에서 자동으로 디렉토리를 생성하고 유연한 통합 요구사항을 충족합니다."
tags:
  - "고급 기능"
  - "사용자 정의 출력"
  - "스킬 동기화"
  - "-o 플래그"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# 사용자 정의 출력 경로

## 학습 완료 후 할 수 있는 것

- `-o` 또는 `--output` 플래그를 사용하여 스킬을 임의 위치의 `.md` 파일로 동기화
- 도구가 존재하지 않는 파일과 디렉토리를 자동으로 생성하는 방법 이해
- 다른 도구(Windsurf, Cursor 등)에 대해 서로 다른 AGENTS.md 구성
- 다중 파일 환경에서 스킬 목록 관리
- 기본 `AGENTS.md`를 건너뛰고 기존 문서 시스템에 통합

::: info 사전 지식

이 튜토리얼은 이미 [기본 동기화 스킬](../../start/sync-to-agents/) 사용 방법을 마스터했다고 가정합니다. 아직 설치된 스킬이 없거나 AGENTS.md를 동기화한 적이 없다면 먼저 선행 과정을 완료하세요.

:::

---

## 현재 겪고 있는 문제

`openskills sync`가 기본적으로 `AGENTS.md`를 생성하는 것에 익숙해졌겠지만, 다음과 같은 문제를 겪을 수 있습니다:

- **도구가 특정 경로 필요**: 특정 AI 도구(예: Windsurf)는 AGENTS.md가 프로젝트 루트 디렉토리가 아닌 특정 디렉토리(예: `.ruler/`)에 있기를 기대
- **다중 도구 충돌**: 여러 코딩 도구를 동시에 사용 중이며, 도구마다 AGENTS.md가 다른 위치에 있기를 기대
- **기존 문서 통합**: 이미 스킬 목록 문서가 있으며, OpenSkills의 스킬을 새 파일이 아닌 기존 문서에 통합하고 싶음
- **디렉토리가 존재하지 않음**: 중첩된 디렉토리(예: `docs/ai-skills.md`)에 출력하고 싶지만 디렉토리가 아직 존재하지 않음

이러한 문제의 근본 원인은: **기본 출력 경로가 모든 시나리오를 충족할 수 없다**는 것입니다. 더 유연한 출력 제어가 필요합니다.

---

## 언제 이 기능을 사용해야 할까

**사용자 정의 출력 경로**는 다음 시나리오에 적합합니다:

- **다중 도구 환경**: 서로 다른 AI 도구에 대해 독립적인 AGENTS.md 구성(예: `.ruler/AGENTS.md` vs `AGENTS.md`)
- **디렉토리 구조 요구사항**: 도구가 AGENTS.md가 특정 디렉토리(예: Windsurf의 `.ruler/`)에 있기를 기대
- **기존 문서 통합**: 새로운 AGENTS.md를 생성하는 대신 기존 문서 시스템에 스킬 목록 통합
- **조직적 관리**: 프로젝트 또는 기능별로 스킬 목록 분류 저장(예: `docs/ai-skills.md`)
- **CI/CD 환경**: 자동화된 프로세스에서 고정 경로로 출력

::: tip 권장 사항

프로젝트가 단일 AI 도구만 사용하고, 도구가 프로젝트 루트의 AGENTS.md를 지원한다면 기본 경로를 사용하면 됩니다. 다중 파일 관리나 도구별 특정 경로 요구사항이 있는 경우에만 사용자 정의 출력 경로를 사용하세요.

:::

---

## 🎒 시작 전 준비

시작하기 전에 다음을 확인하세요:

- [ ] [최소 하나의 스킬 설치](../../start/first-skill/) 완료
- [ ] 프로젝트 디렉토리에 진입
- [ ] `openskills sync` 기본 사용법 이해

::: warning 사전 확인

설치된 스킬이 있는지 확인하세요:

```bash
npx openskills list
```

목록이 비어 있다면 먼저 스킬을 설치하세요:

```bash
npx openskills install anthropics/skills
```

:::

---

## 핵심 아이디어: 유연한 출력 제어

OpenSkills의 동기화 기능은 기본적으로 `AGENTS.md`에 출력하지만, `-o` 또는 `--output` 플래그를 사용하여 출력 경로를 사용자 정의할 수 있습니다.

```
[기본 동작]                    [사용자 정의 출력]
openskills sync      →      AGENTS.md (프로젝트 루트)
openskills sync -o custom.md →  custom.md (프로젝트 루트)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (중첩 디렉토리)
```

**핵심 기능**:

1. **임의 경로**: 모든 `.md` 파일 경로(상대 경로 또는 절대 경로) 지정 가능
2. **자동 파일 생성**: 파일이 존재하지 않으면 도구가 자동으로 생성
3. **자동 디렉토리 생성**: 파일이 있는 디렉토리가 존재하지 않으면 도구가 재귀적으로 생성
4. **스마트 제목**: 파일 생성 시 파일 이름을 기반으로 한 제목 자동 추가(예: `# AGENTS`)
5. **형식 유효성 검사**: `.md`로 끝나야 하며, 그렇지 않으면 오류 발생

**이 기능이 필요한 이유는?**

다른 AI 도구는 다른 예상 경로를 가질 수 있습니다:

| 도구        | 예상 경로           | 기본 경로 사용 가능 여부 |
|--- | --- | ---|
| Claude Code | `AGENTS.md`        | ✅ 사용 가능          |
| Cursor     | `AGENTS.md`        | ✅ 사용 가능          |
| Windsurf   | `.ruler/AGENTS.md` | ❌ 사용 불가능       |
| Aider      | `.aider/agents.md` | ❌ 사용 불가능       |

`-o` 플래그를 사용하면 각 도구에 올바른 경로를 구성할 수 있습니다.

---

## 따라 해보기

### 1단계: 기본 사용법 - 현재 디렉토리에 출력

먼저, 스킬을 현재 디렉토리의 사용자 정의 파일로 동기화해 보세요:

```bash
npx openskills sync -o my-skills.md
```

**이유**

`-o my-skills.md`를 사용하면 기본 `AGENTS.md` 대신 `my-skills.md`에 출력하도록 도구에 지시합니다.

**다음과 같이 표시됩니다**:

`my-skills.md`가 존재하지 않으면 도구가 생성합니다:

```
Created my-skills.md
```

그 다음 대화형 선택 인터페이스를 시작합니다:

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Space> 선택  <a> 전체 선택  <i> 반전 선택  <Enter> 확인
```

스킬을 선택한 후 다음과 같이 표시됩니다:

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip 생성된 파일 확인

생성된 파일을 확인해 보세요:

```bash
cat my-skills.md
```

다음 내용을 볼 수 있습니다:

```markdown
<!-- 파일 제목: # my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

첫 번째 줄은 `# my-skills`입니다. 이는 도구가 파일 이름을 기반으로 자동 생성한 제목입니다.

:::

---

### 2단계: 중첩 디렉토리에 출력

이제 존재하지 않는 중첩 디렉토리에 스킬을 동기화해 보세요:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**이유**

특정 도구(예: Windsurf)는 AGENTS.md가 `.ruler/` 디렉토리에 있기를 기대합니다. 디렉토리가 존재하지 않으면 도구가 자동으로 생성합니다.

**다음과 같이 표시됩니다**:

`.ruler/` 디렉토리가 존재하지 않으면 도구가 디렉토리와 파일을 생성합니다:

```
Created .ruler/AGENTS.md
```

그 다음 대화형 선택 인터페이스를 시작합니다(이전 단계와 동일).

**작업 가이드**:

```
┌─────────────────────────────────────────────────────────────┐
│  디렉토리 자동 생성 설명                                        │
│                                                             │
│  입력 명령어: openskills sync -o .ruler/AGENTS.md           │
│                                                             │
│  도구 실행:                                                    │
│  1. .ruler 디렉토리 존재 여부 확인  →  존재하지 않음            │
│  2. .ruler 디렉토리 재귀적 생성   →  mkdir .ruler            │
│  3. .ruler/AGENTS.md 생성  →  # AGENTS 제목 작성             │
│  4. 스킬 내용 동기화           →  XML 형식의 스킬 목록 작성    │
│                                                             │
│  결과: .ruler/AGENTS.md 파일이 생성되고 스킬이 동기화됨        │
└─────────────────────────────────────────────────────────────┘
```

::: tip 재귀적 생성

도구는 존재하지 않는 모든 상위 디렉토리를 재귀적으로 생성합니다. 예:

- `docs/ai/skills.md` - `docs`와 `docs/ai`가 모두 존재하지 않으면 모두 생성됨
- `.config/agents.md` - 숨김 디렉토리 `.config`가 생성됨

:::

---

### 3단계: 다중 파일 관리 - 다른 도구에 대해 구성

Windsurf와 Cursor를 동시에 사용하고, 각각에 대해 다른 AGENTS.md를 구성해야 한다고 가정해 보세요:

```bash
<!-- Windsurf 구성(.ruler/AGENTS.md 예상) -->
npx openskills sync -o .ruler/AGENTS.md

<!-- Cursor 구성(프로젝트 루트의 AGENTS.md 사용) -->
npx openskills sync
```

**이유**

다른 도구는 AGENTS.md가 다른 위치에 있기를 기대할 수 있습니다. `-o`를 사용하면 각 도구에 올바른 경로를 구성하여 충돌을 피할 수 있습니다.

**다음과 같이 표시됩니다**:

두 파일이 각각 생성됩니다:

```bash
<!-- Windsurf의 AGENTS.md 확인 -->
cat .ruler/AGENTS.md

<!-- Cursor의 AGENTS.md 확인 -->
cat AGENTS.md
```

::: tip 파일 독립성

각 `.md` 파일은 독립적이며 자체 스킬 목록을 포함합니다. 다른 파일에서 다른 스킬을 선택할 수 있습니다:

- `.ruler/AGENTS.md` - Windsurf를 위해 선택된 스킬
- `AGENTS.md` - Cursor를 위해 선택된 스킬
- `docs/ai-skills.md` - 문서의 스킬 목록

:::

---

### 4단계: 사용자 정의 파일로 비대화형 동기화

CI/CD 환경에서 대화형 선택을 건너뛰고 모든 스킬을 사용자 정의 파일로 직접 동기화해야 할 수 있습니다:

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**이유**

`-y` 플래그는 대화형 선택을 건너뛰고 설치된 모든 스킬을 동기화합니다. `-o` 플래그와 결합하여 자동화된 프로세스에서 사용자 정의 경로로 출력할 수 있습니다.

**다음과 같이 표시됩니다**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info CI/CD 사용 시나리오

CI/CD 스크립트에서 사용:

```bash
#!/bin/bash
<!-- 스킬 설치 -->
npx openskills install anthropics/skills -y

<!-- 사용자 정의 파일로 동기화(비대화형) -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### 5단계: 출력 파일 검증

마지막으로, 출력 파일이 올바르게 생성되었는지 확인하세요:

```bash
<!-- 파일 내용 확인 -->
cat .ruler/AGENTS.md

<!-- 파일 존재 여부 확인 -->
ls -l .ruler/AGENTS.md

<!-- 스킬 수 확인 -->
grep -c "<name>" .ruler/AGENTS.md
```

**다음과 같이 표시됩니다**:

1. 파일이 올바른 제목을 포함(예: `# AGENTS`)
2. 파일이 `<skills_system>` XML 태그를 포함
3. 파일이 `<available_skills>` 스킬 목록을 포함
4. 각 `<skill>`이 `<name>`, `<description>`, `<location>`을 포함

::: tip 출력 경로 확인

현재 작업 디렉토리가 확실하지 않은 경우 다음을 사용할 수 있습니다:

```bash
<!-- 현재 디렉토리 확인 -->
pwd

<!-- 상대 경로가 어디로 해결되는지 확인 -->
realpath .ruler/AGENTS.md
```

:::

---

## 체크포인트 ✅

위 단계를 완료한 후 다음을 확인하세요:

- [ ] `-o` 플래그를 사용하여 사용자 정의 파일로 출력 성공
- [ ] 도구가 존재하지 않는 파일을 자동으로 생성
- [ ] 도구가 존재하지 않는 중첩 디렉토리를 자동으로 생성
- [ ] 생성된 파일이 올바른 제목을 포함(파일 이름 기반)
- [ ] 생성된 파일이 `<skills_system>` XML 태그를 포함
- [ ] 생성된 파일이 전체 스킬 목록을 포함
- [ ] 다른 도구에 대해 다른 출력 경로 구성 가능
- [ ] CI/CD 환경에서 `-y`와 `-o` 조합 사용 가능

위 검사 항목을 모두 통과했다면 축하합니다! 사용자 정의 출력 경로 사용 방법을 마스터했으며, 스킬을 임의의 위치로 유연하게 동기화할 수 있습니다.

---

## 자주 발생하는 문제

### 문제 1: 출력 파일이 markdown이 아님

**증상**:

```
Error: Output file must be a markdown file (.md)
```

**원인**:

`-o` 플래그를 사용할 때 지정한 파일 확장자가 `.md`가 아님. 도구는 AI 도구가 올바르게 구문 분석할 수 있도록 markdown 파일로만 출력하도록 강제합니다.

**해결 방법**:

출력 파일이 `.md`로 끝나는지 확인하세요:

```bash
<!-- ❌ 잘못됨 -->
npx openskills sync -o skills.txt

<!-- ✅ 올바름 -->
npx openskills sync -o skills.md
```

---

### 문제 2: 디렉토리 생성 권한 오류

**증상**:

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**원인**:

디렉토리를 생성할 때 현재 사용자에게 상위 디렉토리에 대한 쓰기 권한이 없음.

**해결 방법**:

1. 상위 디렉토리 권한 확인:

```bash
ls -ld .
```

2. 권한이 부족하면 관리자에게 문의하거나 권한이 있는 디렉토리 사용:

```bash
<!-- 프로젝트 디렉토리 사용 -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### 문제 3: 출력 경로가 너무 긺

**증상**:

파일 경로가 너무 길어서 명령어를 읽고 유지 관리하기 어려움:

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**원인**:

중첩 디렉토리가 너무 깊어서 경로 관리가 어려움.

**해결 방법**:

1. 상대 경로 사용(프로젝트 루트에서 시작)
2. 디렉토리 구조 단순화
3. 심볼릭 링크 사용 고려([심볼릭 링크 지원](../symlink-support/) 참조)

```bash
<!-- 권장 사항: 평면화된 디렉토리 구조 -->
npx openskills sync -o docs/agents.md
```

---

### 문제 4: -o 플래그 사용을 잊음

**증상**:

사용자 정의 파일로 출력하려고 했지만, 도구가 여전히 기본 `AGENTS.md`에 출력함.

**원인**:

`-o` 플래그 사용을 잊거나 철자 오류 발생.

**해결 방법**:

1. 명령어에 `-o` 또는 `--output`이 포함되어 있는지 확인:

```bash
<!-- ❌ 잘못됨: -o 플래그 누락 -->
npx openskills sync

<!-- ✅ 올바름: -o 플래그 사용 -->
npx openskills sync -o .ruler/AGENTS.md
```

2. `--output` 전체 형식 사용(더 명확함):

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### 문제 5: 파일 이름에 특수 문자 포함

**증상**:

파일 이름에 공백이나 특수 문자가 포함되어 있어 경로 구문 분석 오류 발생:

```bash
npx openskills sync -o "my skills.md"
```

**원인**:

특정 셸에서 특수 문자를 다르게 처리하여 경로 오류가 발생할 수 있음.

**해결 방법**:

1. 공백과 특수 문자 사용 피하기
2. 사용해야 한다면 따옴표로 감싸기:

```bash
<!-- 권장하지 않음 -->
npx openskills sync -o "my skills.md"

<!-- 권장 -->
npx openskills sync -o my-skills.md
```

---

## 이 과정 요약

이 과정을 통해 다음을 배웠습니다:

- **`-o` 또는 `--output` 플래그 사용**으로 스킬을 사용자 정의 `.md` 파일로 동기화
- **자동 파일 및 디렉토리 생성** 메커니즘, 수동으로 디렉토리 구조를 준비할 필요 없음
- **다른 도구에 대해 다른 AGENTS.md 구성**, 다중 도구 충돌 방지
- **다중 파일 관리 기술**, 도구 또는 기능별로 스킬 목록 분류
- **CI/CD 환경 사용** `-y`와 `-o` 조합으로 자동화된 동기화 구현

**핵심 명령어**:

| 명령어 | 기능 |
|--- | ---|
| `npx openskills sync -o custom.md` | 프로젝트 루트의 `custom.md`로 동기화 |
| `npx openskills sync -o .ruler/AGENTS.md` | `.ruler/AGENTS.md`로 동기화(디렉토리 자동 생성) |
| `npx openskills sync -o path/to/file.md` | 임의 경로로 동기화(중첩 디렉토리 자동 생성) |
| `npx openskills sync -o custom.md -y` | 사용자 정의 파일로 비대화형 동기화 |

**핵심 요점**:

- 출력 파일은 `.md`로 끝나야 함
- 도구는 존재하지 않는 파일과 디렉토리를 자동으로 생성
- 파일 생성 시 파일 이름을 기반으로 한 제목 자동 추가
- 각 `.md` 파일은 독립적이며 자체 스킬 목록을 포함
- 다중 도구 환경, 디렉토리 구조 요구사항, 기존 문서 통합 등의 시나리오에 적합

---

## 다음 과정 예고

> 다음 과정에서 **[심볼릭 링크 지원](../symlink-support/)**을 학습합니다.
>
> 다음을 배우게 됩니다:
> - git 기반 스킬 업데이트를 위한 심볼릭 링크 사용 방법
> - 심볼릭 링크의 장점과 사용 시나리오
> - 로컬 개발에서 스킬 관리 방법
> - 심볼릭 링크 감지 및 처리 메커니즘

사용자 정의 출력 경로를 통해 스킬 목록의 위치를 유연하게 제어할 수 있으며, 심볼릭 링크는 로컬 개발 시나리오에 특히 적합한 더 고급스러운 스킬 관리 방법을 제공합니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|--- | --- | ---|
| sync 명령어 진입점 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| CLI 옵션 정의 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| 출력 경로 가져오기 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| 출력 파일 유효성 검사 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
| 존재하지 않는 파일 생성 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| 디렉토리 재귀적 생성 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| 자동 제목 생성 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| 대화형 프롬프트에서 출력 파일 이름 사용 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**핵심 함수**:
- `syncAgentsMd(options: SyncOptions)` - 지정된 출력 파일로 스킬 동기화
- `options.output` - 사용자 정의 출력 경로(선택 사항, 기본값 'AGENTS.md')

**핵심 상수**:
- `'AGENTS.md'` - 기본 출력 파일 이름
- `'.md'` - 강제 요구되는 파일 확장자

**중요한 로직**:
- 출력 파일은 `.md`로 끝나야 하며, 그렇지 않으면 오류를 보고하고 종료(sync.ts:23-26)
- 파일이 존재하지 않으면 상위 디렉토리(재귀적)와 파일을 자동으로 생성(sync.ts:28-36)
- 파일 생성 시 파일 이름을 기반으로 한 제목 작성: `# ${outputName.replace('.md', '')}` (sync.ts:34)
- 대화형 프롬프트에 출력 파일 이름 표시(sync.ts:70)
- 동기화 성공 메시지에 출력 파일 이름 표시(sync.ts:105, 107)

</details>
