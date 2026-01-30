---
title: "AGENTS.md 형식: 스킬 사양 | openskills"
sidebarTitle: "AI가 스킬을 인식하도록"
subtitle: "AGENTS.md 형식 사양"
description: "AGENTS.md 파일의 XML 태그 구조와 스킬 목록 정의를 학습하세요. 필드 의미, 생성 메커니즘, 모범 사례를 이해하고 스킬 시스템의 작동 원리를 파악하세요."
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "sync-to-agents"
order: 2
---

# AGENTS.md 형식 사양

**AGENTS.md**는 OpenSkills가 생성하는 스킬 설명 파일로, Claude Code, Cursor, Windsurf 등의 AI 에이전트에게 사용 가능한 스킬과 호출 방법을 알려줍니다.

## 학습 완료 후 할 수 있는 것

- AGENTS.md의 XML 구조와 각 태그의 의미 읽기
- 스킬 목록의 필드 정의와 사용 제한 이해
- AGENTS.md 수동 편집 방법 이해(권장하지 않지만 필요할 수 있음)
- OpenSkills가 이 파일을 생성하고 업데이트하는 방식 이해

## 완전한 형식 예제

아래는 완전한 AGENTS.md 파일 예제입니다:

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## 태그 구조 상세 설명

### 외부 컨테이너: `<skills_system>`

```xml
<skills_system priority="1">
  <!-- 스킬 내용 -->
</skills_system>
```

- **priority**: 우선순위 표시(고정 값 `"1"`), AI 에이전트에게 이 스킬 시스템의 중요성을 알림

::: tip 설명
`priority` 속성은 향후 확장을 위해 예약되어 있으며, 모든 AGENTS.md는 고정 값 `"1"`을 사용합니다.
:::

### 사용 설명: `<usage>`

`<usage>` 태그는 AI 에이전트가 스킬을 사용하는 방법에 대한 지침을 포함합니다:

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**핵심 요점**:
- **트리거 조건**: 사용자의 작업을 더 효율적으로 완료할 수 있는지 확인
- **호출 방식**: `npx openskills read <skill-name>` 명령 사용
- **배치 호출**: 쉼표로 구분된 여러 스킬 이름 지원
- **기본 디렉토리**: 출력에 `base_dir` 필드 포함, 스킬의 참조 파일(`references/`, `scripts/`, `assets/`) 해석에 사용
- **사용 제한**:
  - `<available_skills>`에 나열된 스킬만 사용
  - 이미 컨텍스트에 로드된 스킬을 다시 호출하지 않음
  - 각 스킬 호출은 상태 비저장

### 스킬 목록: `<available_skills>`

`<available_skills>`는 사용 가능한 모든 스킬의 목록을 포함하며, 각 스킬은 `<skill>` 태그로 정의됩니다:

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>스킬 설명...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>다른 스킬 설명...</description>
<location>global</location>
</skill>

</available_skills>
```

#### `<skill>` 태그 필드

각 `<skill>`은 다음 필수 필드를 포함합니다:

| 필드 | 타입 | 옵션 | 설명 |
| --- | --- | --- | --- |
| `<name>` | string | - | 스킬 이름(SKILL.md 파일명 또는 YAML의 `name`과 일치) |
| `<description>` | string | - | 스킬 설명(SKILL.md의 YAML frontmatter에서 가져옴) |
| `<location>` | string | `project` \| `global` | 스킬 설치 위치 표시(AI 에이전트가 스킬 출처를 이해하는 데 사용) |

**필드 설명**:

- **`<name>`**: 스킬의 고유 식별자, AI 에이전트는 이 이름으로 스킬을 호출
- **`<description>`**: 스킬의 기능과 사용 시기를 자세히 설명하여 AI가 이 스킬이 필요한지 판단하는 데 도움
- **`<location>`**:
  - `project`: 프로젝트 로컬에 설치(`.claude/skills/` 또는 `.agent/skills/`)
  - `global`: 전역 디렉토리에 설치(`~/.claude/skills/`)

::: info location 표시가 필요한 이유는?
`<location>` 표시는 AI 에이전트가 스킬의 가시성 범위를 이해하는 데 도움:
- `project` 스킬은 현재 프로젝트에서만 사용 가능
- `global` 스킬은 모든 프로젝트에서 사용 가능
이것은 AI 에이전트의 스킬 선택 전략에 영향을 줍니다.
:::

## 마크 방법

AGENTS.md는 두 가지 마크 방법을 지원하며, OpenSkills는 자동으로 인식합니다:

### 방법 1: XML 마크(권장)

```xml
<skills_system priority="1">
  <!-- 스킬 내용 -->
</skills_system>
```

이것은 기본 방식이며, 표준 XML 태그로 스킬 시스템의 시작과 끝을 표시합니다.

### 방법 2: HTML 주석 마크(호환 모드)

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- 사용 설명 -->
</usage>

<available_skills>
  <!-- 스킬 목록 -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

이 형식은 외부 `<skills_system>` 컨테이너를 제거하고, HTML 주석만으로 스킬 영역의 시작과 끝을 표시합니다.

::: tip OpenSkills 처리 로직
`replaceSkillsSection()` 함수(`src/utils/agents-md.ts:67-93`)는 다음 우선순위로 마크를 찾습니다:
1. 먼저 `<skills_system>` XML 마크 검색
2. 찾지 못하면 `<!-- SKILLS_TABLE_START -->` HTML 주석 검색
3. 둘 다 없으면 파일 끝에 내용 추가
:::

## OpenSkills가 AGENTS.md를 생성하는 방법

`openskills sync`를 실행할 때, OpenSkills는 다음을 수행합니다:

1. **모든 설치된 스킬 찾기**(`findAllSkills()`)
2. **대화형 스킬 선택**(`-y` 플래그를 사용하지 않는 경우)
3. **XML 내용 생성**(`generateSkillsXml()`)
   - `<usage>` 사용 설명 구축
   - 각 스킬에 대한 `<skill>` 태그 생성
4. **파일의 스킬 부분 교체**(`replaceSkillsSection()`)
   - 기존 마크(XML 또는 HTML 주석) 검색
   - 마크 사이의 내용 교체
   - 마크가 없으면 파일 끝에 추가

### 소스 코드 위치

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| XML 생성 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| 스킬 부분 교체 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 기존 스킬 파싱 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Skill 타입 정의 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |

## 수동 편집 주의사항

::: warning 수동 편집 권장하지 않음
AGENTS.md를 수동으로 편집할 수 있지만 다음을 권장합니다:
1. `openskills sync` 명령어를 사용하여 생성 및 업데이트
2. 수동으로 편집한 내용은 다음 `sync` 시 덮어써집니다
3. 스킬 목록을 커스터마이즈하려면 대화형 선택을 사용하세요(`-y` 플래그 없이)
:::

수동 편집이 정말 필요한 경우 주의사항:

1. **XML 구문 유지**: 모든 태그가 올바르게 닫혔는지 확인
2. **마크 수정 금지**: `<skills_system>` 또는 `<!-- SKILLS_TABLE_START -->` 등의 마크는 그대로 유지
3. **필드 완성**: 각 `<skill>`은 `<name>`, `<description>`, `<location>` 세 필드를 포함해야 함
4. **스킬 중복 금지**: 같은 이름의 스킬을 반복 추가하지 마세요

## 자주 묻는 질문

### Q1: AGENTS.md에 `<skills_system>` 태그가 없는 이유는?

**A**: 이것은 호환 모드입니다. 파일이 HTML 주석 마크(`<!-- SKILLS_TABLE_START -->`)를 사용하는 경우, OpenSkills도 인식합니다. 다음 `sync` 시 자동으로 XML 마크로 변환됩니다.

### Q2: 모든 스킬을 삭제하려면?

**A**: `openskills sync`를 실행하고 대화형 인터페이스에서 모든 스킬을 선택 해제하거나, 다음 명령어를 실행합니다:

```bash
openskills sync -y --output /dev/null
```

이렇게 하면 AGENTS.md의 스킬 부분이 비워집니다(마크는 유지됨).

### Q3: location 필드가 AI 에이전트에 실제 영향을 미치나요?

**A**: 이것은 구체적인 AI 에이전트 구현에 따라 다릅니다. 일반적으로:
- `location="project"`는 스킬이 현재 프로젝트 컨텍스트에서만 의미 있음을 나타냅니다
- `location="global"`는 스킬이 범용 도구이며 모든 프로젝트에서 사용할 수 있음을 나타냅니다

AI 에이전트는 이 마크를 기반으로 스킬 로딩 전략을 조정할 수 있지만, 대부분의 에이전트(예: Claude Code)는 이 필드를 무시하고 `openskills read`를 직접 호출합니다.

### Q4: 스킬 설명은 얼마나 길어야 하나요?

**A**: 스킬 설명은 다음을 충족해야 합니다:
- **간결하지만 완전함**: 스킬의 핵심 기능과 주요 사용 시나리오 설명
- **너무 짧지 않음**: 단일 라인 설명은 AI가 언제 사용해야 하는지 이해하기 어려움
- **너무 길지 않음**: 지나치게 긴 설명은 컨텍스트를 낭비하며 AI는 세심하게 읽지 않음

권장 길이: **50-150 단어**.

## 모범 사례

1. **sync 명령어 사용**: 항상 `openskills sync`를 사용하여 AGENTS.md를 생성하고, 수동 편집은 하지 마세요
2. **정기 업데이트**: 스킬을 설치하거나 업데이트한 후, `openskills sync`를 실행하는 것을 잊지 마세요
3. **적절한 스킬 선택**: 설치된 모든 스킬이 AGENTS.md에 있어야 하는 것은 아닙니다. 프로젝트 요구사항에 따라 선택하세요
4. **형식 확인**: AI 에이전트가 스킬을 인식할 수 없는 경우 AGENTS.md의 XML 태그가 올바른지 확인하세요

## 다음 수업 예고

> 다음 수업에서는 **[파일 구조](../file-structure/)**를 학습합니다.
>
> 학습 내용:
> - OpenSkills가 생성하는 디렉토리 및 파일 구조
> - 각 파일의 역할과 위치
> - 스킬 디렉토리 이해 및 관리 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 라인 |
| --- | --- | --- |
| 스킬 XML 생성 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| 스킬 부분 교체 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 기존 스킬 파싱 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Skill 타입 정의 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |

**주요 상수**:
- `priority="1"`: 스킬 시스템 우선순위 표시(고정 값)

**주요 함수**:
- `generateSkillsXml(skills: Skill[])`: XML 형식의 스킬 목록 생성
- `replaceSkillsSection(content: string, newSection: string)`: 스킬 부분 교체 또는 추가
- `parseCurrentSkills(content: string)`: AGENTS.md에서 활성화된 스킬명 파싱

</details>
