---
title: "스킬 동기화: AGENTS.md 생성 | openskills"
sidebarTitle: "AI가 스킬을 인식하도록"
subtitle: "스킬 동기화: AGENTS.md 생성"
description: "openskills sync 명령어로 AGENTS.md 파일을 생성하는 방법을 배우고, Claude Code, Cursor 등의 AI 에이전트가 설치된 스킬을 인식하도록 설정하는 방법을 익히세요. 스킬 선택과 동기화 팁을 통해 AI 컨텍스트 사용을 최적화하세요."
tags:
  - "시작하기"
  - "스킬 동기화"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: 5
---

# 스킬을 AGENTS.md에 동기화하기

## 이 튜토리얼을 마치면 할 수 있는 것

- `openskills sync`를 사용하여 AGENTS.md 파일 생성하기
- AI 에이전트가 AGENTS.md를 통해 사용 가능한 스킬을 파악하는 원리 이해하기
- 동기화할 스킬을 선택하여 AI 컨텍스트 크기 제어하기
- 사용자 지정 출력 경로를 사용하여 기존 문서에 통합하기
- AGENTS.md의 XML 형식과 사용법 이해하기

::: info 선행 지식

이 튜토리얼은 [첫 번째 스킬 설치](../first-skill/)를 완료했다고 가정합니다. 아직 스킬을 설치하지 않았다면 먼저 설치 단계를 진행해 주세요.

:::

---

## 현재 직면한 문제

몇 가지 스킬을 설치했을 수도 있지만:

- **AI 에이전트는 사용 가능한 스킬이 있는지 모름**: 스킬은 설치되었지만 Claude Code 같은 AI 에이전트는 이것들의 존재를 알지 못함
- **AI가 스킬을 알게 하는 방법을 모름**: `AGENTS.md`에 대해 들어봤지만, 그것이 무엇인지, 어떻게 생성하는지 모름
- **스킬이 너무 많아 컨텍스트를 차지하는 것에 대한 우려**: 많은 스킬을 설치했지만, 선택적으로 동기화하고 싶고 AI에게 한 번에 모두 알리고 싶지 않음

이러한 문제의 근본 원인은 **스킬 설치와 스킬 가용성은 다르다**는 것입니다. 설치는 단순히 파일을 배치하는 것이며, AI가 이를 알게 하려면 AGENTS.md로 동기화해야 합니다.

---

## 이 기능을 사용하는 적절한 때

**스킬을 AGENTS.md에 동기화**하는 기능은 다음과 같은 시나리오에 적합합니다:

- 방금 스킬을 설치하고 AI 에이전트가 이들의 존재를 알도록 해야 할 때
- 새 스킬을 추가한 후 AI의 사용 가능한 스킬 목록을 업데이트해야 할 때
- 스킬을 삭제한 후 AGENTS.md에서 제거해야 할 때
- 선택적으로 스킬을 동기화하여 AI의 컨텍스트 크기를 제어하고 싶을 때
- 다중 에이전트 환경에서 통합된 스킬 목록이 필요할 때

::: tip 권장 사항

스킬을 설치, 업데이트 또는 삭제할 때마다 `openskills sync`를 한 번 실행하여 AGENTS.md를 실제 스킬과 일치시키세요.

:::

---

## 🎒 시작하기 전 준비사항

시작하기 전에 다음을 확인하세요:

- [ ] [최소한 하나의 스킬 설치](../first-skill/)를 완료했습니다
- [ ] 프로젝트 디렉터리에 들어가 있습니다
- [ ] 스킬의 설치 위치(project 또는 global)를 알고 있습니다

::: warning 선행 확인

아직 스킬을 설치하지 않았다면 먼저 다음을 실행하세요:

```bash
npx openskills install anthropics/skills
```

:::

---

## 핵심 개념: 스킬 설치 ≠ AI에서 사용 가능

OpenSkills의 스킬 관리는 두 단계로 나뉩니다:

```
[설치 단계]            [동기화 단계]
스킬 → .claude/skills/  →  AGENTS.md
   ↓                        ↓
파일 존재              AI 에이전트 읽기
   ↓                        ↓
로컬에서 사용 가능    AI가 알고 호출 가능
```

**핵심 포인트**:

1. **설치 단계**: `openskills install`을 사용하여 스킬을 `.claude/skills/` 디렉터리로 복사
2. **동기화 단계**: `openskills sync`를 사용하여 스킬 정보를 `AGENTS.md`에 작성
3. **AI 읽기**: AI 에이전트가 `AGENTS.md`를 읽어 어떤 스킬을 사용할 수 있는지 파악
4. **요청 시 로드**: AI가 필요에 따라 `openskills read <skill>`로 구체적인 스킬을 로드

**왜 AGENTS.md가 필요한가요?**

Claude Code, Cursor 같은 AI 에이전트는 파일 시스템을 능동적으로 스캔하지 않습니다. 이들은 사용 가능한 도구가 무엇인지 알려주는 명확한 "스킬 목록"이 필요합니다. 이 목록이 바로 `AGENTS.md`입니다.

---

## 따라 해보기

### 1단계: 프로젝트 디렉터리로 이동

먼저 스킬을 설치한 프로젝트 디렉터리로 이동하세요:

```bash
cd /path/to/your/project
```

**이유**

`openskills sync`는 기본적으로 현재 디렉터리에서 설치된 스킬을 찾고 현재 디렉터리에 `AGENTS.md`를 생성하거나 업데이트합니다.

**확인해야 할 사항**:

프로젝트 디렉터리에는 `.claude/skills/` 디렉터리(스킬을 설치한 경우)가 있어야 합니다:

```bash
ls -la
# 예상 출력:
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r--  1 user  staff  package.json
```

---

### 2단계: 스킬 동기화

다음 명령어를 사용하여 설치된 스킬을 AGENTS.md에 동기화하세요:

```bash
npx openskills sync
```

**이유**

`sync` 명령어는 모든 설치된 스킬을 찾아 XML 형식의 스킬 목록을 생성하여 `AGENTS.md` 파일에 작성합니다.

**확인해야 할 사항**:

명령어가 대화형 선택 인터페이스를 시작합니다:

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◉ check-branch-first          (global)   Git workflow: Always check current branch...

<Space> 선택  <a> 전체 선택  <i> 반전  <Enter> 확인
```

**작업 가이드**:

```
┌─────────────────────────────────────────────────────────────┐
│  작업 설명                                                   │
│                                                             │
│  1단계         2단계          3단계                           │
│  커서 이동   →   Space로 선택   →   Enter로 확인            │
│                                                             │
│  ○ 선택 안 됨           ◉ 선택 됨                           │
│                                                             │
│  (project)         프로젝트 스킬, 파란색 강조                │
│  (global)          전역 스킬, 회색 표시                      │
└─────────────────────────────────────────────────────────────┘

확인해야 할 사항:
- 커서를 위아래로 이동할 수 있음
- Space 키로 선택 상태 전환 (○ ↔ ◉)
- 프로젝트 스킬은 파란색, 전역 스킬은 회색으로 표시
- Enter 키로 동기화 확인
```

::: tip 스마트 사전 선택

첫 동기화에서는 도구가 기본적으로 모든 **프로젝트 스킬**을 선택합니다. 기존 AGENTS.md를 업데이트하는 경우에는 도구가 **파일에 이미 활성화된 스킬**을 사전 선택합니다.

:::

---

### 3단계: 스킬 선택

대화형 인터페이스에서 AI 에이전트가 알도록 하려는 스킬을 선택하세요.

**예시**:

모든 설치된 스킬을 동기화하고 싶다고 가정해 봅니다:

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← 이 전역 스킬은 선택하지 않음
```

작업:
1. **커서 이동**: 위아래 방향키를 사용하여 이동
2. **선택/해제**: **Space 키**를 눌러 선택 상태 전환 (`○` ↔ `◉`)
3. **동기화 확인**: **Enter 키**를 눌러 동기화 시작

**확인해야 할 사항**:

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip 선택 전략

- **프로젝트 스킬**: 현재 프로젝트 전용 스킬, 동기화 권장
- **전역 스킬**: 일반적인 스킬(예: 코딩 표준), 필요에 따라 동기화
- **너무 많지 않도록**: 스킬이 너무 많으면 AI 컨텍스트를 차지하므로, 자주 사용하는 스킬만 동기화하세요

:::

---

### 4단계: AGENTS.md 확인

동기화가 완료되면 생성된 AGENTS.md 파일을 확인하세요:

```bash
cat AGENTS.md
```

**확인해야 할 사항**:

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**핵심 요소 설명**:

| 요소 | 역할 |
|---|---|
| `<skills_system>` | XML 태그, AI에게 이것이 스킬 시스템 정의임을 알림 |
| `<usage>` | 사용 설명, AI에게 스킬 사용 방법 알려주기 |
| `<available_skills>` | 사용 가능한 스킬 목록 |
| `<skill>` | 개별 스킬 정의 |
| `<name>` | 스킬 이름 |
| `<description>` | 스킬 설명 |
| `<location>` | 스킬 위치 |

::: info 왜 XML 형식을 사용하나요?

XML 형식은 AI 에이전트(특히 Claude Code)의 표준 형식으로, 구문 분석과 이해가 쉽습니다. 도구는 대체 방법으로 HTML 주석 형식도 지원합니다.

:::

---

### 5단계: AI 읽기 확인

이제 AI 에이전트가 AGENTS.md를 읽어 어떤 스킬이 사용 가능한지 확인하도록 해보세요.

**예시 대화**:

```
사용자:
PDF 파일에서 표 데이터를 추출하고 싶어요

AI 에이전트:
`pdf` 스킬을 사용하여 표 데이터 추출을 도와드릴 수 있습니다. 먼저 이 스킬의 상세 내용을 읽어오겠습니다.

AI 실행:
npx openskills read pdf

출력:
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[PDF 스킬의 상세 내용...]

AI:
좋습니다, PDF 스킬을 로드했습니다. 이제 표 데이터 추출을 도와드리겠습니다...
```

**확인해야 할 사항**:

- AI 에이전트가 `pdf` 스킬을 사용할 수 있음을 인식함
- AI가 자동으로 `npx openskills read pdf`를 실행하여 스킬 내용을 로드함
- AI가 스킬의 지침에 따라 작업을 수행함

---

### 6단계 (선택사항): 사용자 지정 출력 경로

스킬을 다른 파일(예: `.ruler/AGENTS.md`)에 동기화하려면 `-o` 또는 `--output` 옵션을 사용하세요:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**이유**

Windsurf와 같은 특정 도구는 AGENTS.md가 특정 디렉터리에 있기를 기대할 수 있습니다. `-o`를 사용하면 기존 문서 시스템에 유연하게 통합할 수 있습니다.

**확인해야 할 사항**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip 비대화식 동기화

CI/CD 환경에서 `-y` 또는 `--yes` 플래그를 사용하여 대화식 선택을 건너뛰고 모든 스킬을 동기화할 수 있습니다:

```bash
npx openskills sync -y
```

:::

---

## 체크포인트 ✅

위 단계를 완료한 후 다음을 확인하세요:

- [ ] 명령줄에 대화형 선택 인터페이스가 표시됨
- [ ] 최소한 하나의 스킬이 성공적으로 선택됨(앞에 `◉` 표시됨)
- [ ] 동기화가 성공하여 `✅ Synced X skill(s) to AGENTS.md` 메시지가 표시됨
- [ ] `AGENTS.md` 파일이 생성되거나 업데이트됨
- [ ] 파일에 `<skills_system>` XML 태그가 포함됨
- [ ] 파일에 `<available_skills>` 스킬 목록이 포함됨
- [ ] 각 `<skill>`에 `<name>`, `<description>`, `<location>`이 포함됨

위의 모든 검사 항목이 통과되면 축하합니다! 스킬이 AGENTS.md에 성공적으로 동기화되었고, 이제 AI 에이전트가 이를 인식하고 사용할 수 있습니다.

---

## 문제 해결

### 문제 1: 스킬을 찾을 수 없음

**현상**:

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**원인**:

- 현재 디렉터리나 전역 디렉터리에 스킬이 설치되지 않음

**해결 방법**:

1. 스킬이 설치되어 있는지 확인:

```bash
npx openskills list
```

2. 없다면 먼저 스킬을 설치:

```bash
npx openskills install anthropics/skills
```

---

### 문제 2: AGENTS.md가 업데이트되지 않음

**현상**:

`openskills sync`를 실행한 후 AGENTS.md 내용이 변경되지 않음.

**원인**:

- `-y` 플래그를 사용했지만 스킬 목록이 이전과 동일함
- AGENTS.md가 존재하지만 동일한 스킬을 동기화함

**해결 방법**:

1. `-y` 플래그 사용 여부 확인

```bash
# -y 제거, 대화 모드로 다시 진행
npx openskills sync
```

2. 현재 디렉터리가 올바른지 확인

```bash
# 스킬을 설치한 프로젝트 디렉터리인지 확인
pwd
ls .claude/skills/
```

---

### 문제 3: AI 에이전트가 스킬을 모름

**현상**:

AGENTS.md가 생성되었지만 AI 에이전트는 여전히 사용 가능한 스킬을 알지 못함.

**원인**:

- AI 에이전트가 AGENTS.md를 읽지 않음
- AGENTS.md 형식이 올바르지 않음
- AI 에이전트가 스킬 시스템을 지원하지 않음

**해결 방법**:

1. AGENTS.md가 프로젝트 루트에 있는지 확인
2. AGENTS.md 형식이 올바른지 확인(`<skills_system>` 태그 포함)
3. AI 에이전트가 AGENTS.md를 지원하는지 확인(예: Claude Code는 지원, 다른 도구는 구성이 필요할 수 있음)

---

### 문제 4: 출력 파일이 마크다운이 아님

**현상**:

```
Error: Output file must be a markdown file (.md)
```

**원인**:

- `-o` 옵션을 사용했지만 지정한 파일이 `.md` 확장자가 아님

**해결 방법**:

1. 출력 파일이 `.md`로 끝나는지 확인

```bash
# ❌ 잘못됨
npx openskills sync -o skills.txt

# ✅ 올바름
npx openskills sync -o skills.md
```

---

### 문제 5: 모든 선택 취소

**현상**:

대화형 인터페이스에서 모든 스킬의 선택을 취소하면 AGENTS.md의 스킬 섹션이 삭제됩니다.

**원인**:

이는 정상적인 동작입니다. 모든 스킬을 취소하면 도구가 AGENTS.md에서 스킬 섹션을 제거합니다.

**해결 방법**:

이것이 실수였다면 `openskills sync`를 다시 실행하고 동기화할 스킬을 선택하세요.

---

## 본 수업 요약

이 수업을 통해 다음을 배웠습니다:

- **`openskills sync` 사용**: AGENTS.md 파일 생성
- **스킬 동기화 흐름 이해**: 설치 → 동기화 → AI 읽기 → 요청 시 로드
- **대화형 스킬 선택**하여 AI 컨텍스트 크기 제어
- **사용자 지정 출력 경로**로 기존 문서 시스템에 통합
- **AGENTS.md 형식 이해**: `<skills_system>` XML 태그와 스킬 목록 포함

**핵심 명령어**:

| 명령어 | 역할 |
|---|---|
| `npx openskills sync` | 대화형으로 AGENTS.md에 스킬 동기화 |
| `npx openskills sync -y` | 비대화형으로 모든 스킬 동기화 |
| `npx openskills sync -o custom.md` | 사용자 지정 파일에 동기화 |
| `cat AGENTS.md` | 생성된 AGENTS.md 내용 보기 |

**AGENTS.md 형식 요점**:

- `<skills_system>` XML 태그로 감싸기
- `<usage>` 사용 설명 포함
- `<available_skills>` 스킬 목록 포함
- 각 `<skill>`에 `<name>`, `<description>`, `<location>` 포함

---

## 다음 수업 예고

> 다음 수업에서는 **[스킬 사용하기](../read-skills/)**를 배웁니다.
>
> 배울 내용:
> - AI 에이전트가 `openskills read` 명령어로 스킬을 로드하는 방법
> - 스킬의 완전한 로드 흐름
> - 여러 스킬 읽는 방법
> - 스킬 콘텐츠의 구조와 구성

스킬을 동기화하는 것은 AI가 사용할 수 있는 도구가 무엇인지 알게 하는 것일 뿐, 실제로 사용할 때는 AI가 `openskills read` 명령어로 구체적인 스킬 콘텐츠를 로드합니다.

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-24

| 기능 | 파일 경로 | 라인 |
|---|---|---|
| sync 명령어 진입점 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| 출력 파일 검증 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| 존재하지 않는 파일 생성 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| 대화형 선택 인터페이스 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| 기존 AGENTS.md 파싱 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| 스킬 XML 생성 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| 스킬 섹션 교체 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 스킬 섹션 삭제 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**핵심 함수**:
- `syncAgentsMd()` - AGENTS.md 파일로 스킬 동기화
- `parseCurrentSkills()` - 기존 AGENTS.md에서 스킬 이름 파싱
- `generateSkillsXml()` - XML 형식의 스킬 목록 생성
- `replaceSkillsSection()` - 스킬 섹션을 파일에 교체 또는 추가
- `removeSkillsSection()` - 파일에서 스킬 섹션 제거

**핵심 상수**:
- `AGENTS.md` - 기본 출력 파일명
- `<skills_system>` - XML 태그, 스킬 시스템 정의 표시에 사용
- `<available_skills>` - XML 태그, 사용 가능한 스킬 목록 표시에 사용

**중요한 로직**:
- 기본적으로 파일에 이미 존재하는 스킬 사전 선택(증분 업데이트)
- 첫 동기화 시 기본적으로 모든 프로젝트 스킬 선택
- 두 가지 마커 형식 지원: XML 태그 및 HTML 주석
- 모든 선택을 취소하면 스킬 섹션을 삭제하며 빈 목록이 아님

</details>
