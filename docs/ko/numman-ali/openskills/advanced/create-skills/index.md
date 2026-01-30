---
title: "스킬 생성: SKILL.md 작성법 | openskills"
sidebarTitle: "스킬 작성하기"
subtitle: "스킬 생성: SKILL.md 작성법"
description: "처음부터 커스텀 스킬을 생성하는 방법을 학습하고, SKILL.md 형식과 YAML frontmatter 규격을 숙지하세요. 완전한 예제와 심볼릭 링크 개발 프로세스를 통해 스킬 제작을 빠르게 시작하고, Anthropic 표준을 준수할 수 있습니다."
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# 커스텀 스킬 생성

## 이 과정을 통해 할 수 있는 것

- 처음부터 완전한 SKILL.md 스킬 파일 생성
- Anthropic 표준을 준수하는 YAML frontmatter 작성
- 합리적인 스킬 디렉토리 구조 설계(references/, scripts/, assets/)
- 심볼릭 링크를 통한 로컬 개발 및 반복
- `openskills` 명령어로 커스텀 스킬 설치 및 검증

## 현재 겪고 있는 문제

AI 에이전트에게 특정 문제를 해결하고 싶지만, 기존 스킬 라이브러리에 적합한 솔루션이 없습니다. 대화에서 요구사항을 반복해서 설명해도 AI는 항상 기억하지 못하거나 불완전하게 실행합니다. **전문 지식을 캡슐화**하여 AI 에이전트가 안정적이고 신뢰할 수 있게 재사용할 수 있는 방법이 필요합니다.

## 이 방법을 언제 사용해야 하나요?

- **워크플로우 캡슐화**: 반복적인 작업 단계를 스킬로 작성하여 AI가 한 번에 완전히 실행하도록 함
- **팀 지식 축적**: 팀 내부의 규범, API 문서, 스크립트를 스킬로 패키징하여 모든 멤버와 공유
- **도구 통합**: 특정 도구(PDF 처리, 데이터 클리닝, 배포 프로세스 등)를 위한 전용 스킬 생성
- **로컬 개발**: 개발 중 스킬을 실시간으로 수정 및 테스트, 반복적인 설치 없이

## 🎒 시작 전 준비

::: warning 사전 확인

시작 전에 다음을 확인하세요:

- ✅ [OpenSkills](/start/installation/)가 설치됨
- ✅ 최소 하나의 스킬이 설치되고 동기화됨(기본 프로세스 이해)
- ✅ Markdown 기본 문법에 익숙함

:::

## 핵심 개념

### SKILL.md란 무엇인가요?

**SKILL.md**는 Anthropic 스킬 시스템의 표준 형식으로, YAML frontmatter로 스킬 메타데이터를 설명하고 Markdown 본문으로 실행 지침을 제공합니다. 세 가지 핵심 장점이 있습니다:

1. **통일된 형식** - 모든 에이전트(Claude Code, Cursor, Windsurf 등)가 동일한 스킬 설명을 사용
2. **점진적 로딩** - 필요할 때만 전체 내용을 로드하여 AI 컨텍스트를 간결하게 유지
3. **패키징 가능한 리소스** - references/, scripts/, assets/ 세 가지 유형의 추가 리소스 지원

### 최소 vs 완전 구조

**최소 구조**(단순한 스킬에 적합):
```
my-skill/
└── SKILL.md          # 파일 하나만
```

**완전 구조**(복잡한 스킬에 적합):
```
my-skill/
├── SKILL.md          # 핵심 지침(< 5000 단어)
├── references/       # 상세 문서(필요 시 로드)
│   └── api-docs.md
├── scripts/          # 실행 가능한 스크립트
│   └── helper.py
└── assets/           # 템플릿 및 출력 파일
    └── template.json
```

::: info 언제 완전 구조를 사용하나요?

- **references/**: API 문서, 데이터베이스 스키마, 상세 가이드가 5000 단어를 초과할 때
- **scripts/**: 결정적이고 반복 가능한 작업을 실행해야 할 때(데이터 변환, 포맷팅 등)
- **assets/**: 템플릿, 이미지, 샘플 코드를 출력해야 할 때

:::
## 함께 따라하기

### 1단계: 스킬 디렉토리 생성

**이유**: 스킬 파일을 구성하기 위해 독립적인 디렉토리 생성

```bash
mkdir my-skill
cd my-skill
```

**다음과 같이 보여야 합니다**: 현재 디렉토리가 비어 있음

---

### 2단계: SKILL.md 핵심 구조 작성

**이유**: SKILL.md는 YAML frontmatter로 시작하여 스킬 메타데이터를 정의해야 함

`SKILL.md` 파일 생성:

```markdown
---
name: my-skill                    # 필수: 하이픈 형식 식별자
description: When to use this skill.  # 필수: 1-2문장, 3인칭
---

# 스킬 제목

스킬의 상세 설명.
```

**검증 포인트**:

- ✅ 첫 번째 줄이 `---`
- ✅ `name` 필드 포함(하이픈 형식, 예: `pdf-editor`, `api-client`)
- ✅ `description` 필드 포함(1-2문장, 3인칭 사용)
- ✅ YAML 끝에 다시 `---` 사용

::: danger 일반적인 오류

| 오류 예시 | 수정 방법 |
|--- | ---|
| `name: My Skill`(공백) | `name: my-skill`(하이픈)로 변경 |
| `description: You should use this for...`(2인칭) | `description: Use this skill for...`(3인칭)로 변경 |
|--- | ---|
| `description`가 너무 김(100단어 초과) | 1-2문장의 개요로 간소화 |

:::

---

### 3단계: 지침 내용 작성

**이유**: 지침은 AI 에이전트에게 작업을 실행하는 방법을 알려주며, imperative/infinitive 형식을 사용해야 함

`SKILL.md` 계속 편집:

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**작성 규칙**:

| ✅ 올바른 작성법(imperative/infinitive) | ❌ 잘못된 작성법(second person) |
|--- | ---|
| "To accomplish X, execute Y"        | "You should do X"          |
| "Load this skill when Z"            | "If you need Y"            |
| "See references/guide.md"           | "When you want Z"           |

::: tip 기억법

**지침 작성 3가지 원칙**:
1. **동사로 시작**: "Create" → "Use" → "Return"
2. **"You" 생략**: "You should"라고 하지 않기
3. **명확한 경로**: 리소스 참조 시 `references/`로 시작

:::

---

### 4단계: 번들 리소스 추가(선택 사항)

**이유**: 스킬에 상세 문서나 실행 가능한 스크립트가 많이 필요할 때, bundled resources를 사용하여 SKILL.md를 간결하게 유지

#### 4.1 references/ 추가

```bash
mkdir references
```

`references/api-docs.md` 생성:

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

`SKILL.md`에서 참조:

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```
#### 4.2 scripts/ 추가

```bash
mkdir scripts
```

`scripts/process.py` 생성:

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

`SKILL.md`에서 참조:

```markdown
## Instructions

To process data:

1. Execute the script:
   ```bash
   python scripts/process.py
   ```
2. Review the output
```

::: info scripts/의 장점

- **컨텍스트에 로드되지 않음**: 토큰 절약, 대용량 파일에 적합
- **독립 실행 가능**: AI 에이전트가 내용을 먼저 로드하지 않고 직접 호출 가능
- **결정적 작업에 적합**: 데이터 변환, 포맷팅, 생성 등

:::

#### 4.3 assets/ 추가

```bash
mkdir assets
```

템플릿 파일 `assets/template.json` 추가:

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

`SKILL.md`에서 참조:

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### 5단계: SKILL.md 형식 검증

**이유**: 설치 전에 형식을 검증하여 설치 시 오류 방지

```bash
npx openskills install ./my-skill
```

**다음과 같이 보여야 합니다**:

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

스킬을 선택하고 엔터를 누르면 다음과 같이 보여야 함:

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip 검증 체크리스트

설치 전 다음 항목을 확인하세요:

- [ ] SKILL.md가 `---`로 시작
- [ ] `name` 및 `description` 필드 포함
- [ ] `name`이 하이픈 형식(`my-skill`이지 `my_skill`이 아님)
- [ ] `description`이 1-2문장의 개요
- [ ] 지침이 imperative/infinitive 형식 사용
- [ ] 모든 `references/`, `scripts/`, `assets/` 참조 경로가 정확함

:::

---

### 6단계: AGENTS.md에 동기화

**이유**: AI 에이전트가 사용 가능한 스킬이 있음을 인식하도록 함

```bash
npx openskills sync
```

**다음과 같이 보여야 합니다**:

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

생성된 `AGENTS.md` 확인:

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### 7단계: 스킬 로딩 테스트

**이유**: 스킬이 AI 컨텍스트에 올바르게 로드되는지 검증

```bash
npx openskills read my-skill
```

**다음과 같이 보여야 합니다**:

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (전체 SKILL.md 내용)
```
## 체크포인트 ✅

위 단계를 완료한 후 다음을 수행해야 합니다:

- ✅ SKILL.md가 포함된 스킬 디렉토리 생성
- ✅ SKILL.md에 올바른 YAML frontmatter와 Markdown 내용 포함
- ✅ 스킬이 `.claude/skills/`에 성공적으로 설치됨
- ✅ 스킬이 AGENTS.md에 동기화됨
- ✅ `openskills read`를 사용하여 스킬 내용을 로드할 수 있음

## 주의할 점

### 문제 1: 설치 시 "Invalid SKILL.md (missing YAML frontmatter)" 오류

**원인**: SKILL.md가 `---`로 시작하지 않음

**해결 방법**: 파일 첫 번째 줄이 `---`인지 확인, `# My Skill` 또는 다른 내용이 아님

---

### 문제 2: AI 에이전트가 스킬을 인식하지 못함

**원인**: `openskills sync`가 실행되지 않았거나 AGENTS.md가 업데이트되지 않음

**해결 방법**: `npx openskills sync`를 실행하고 AGENTS.md에 스킬 항목이 포함되어 있는지 확인

---

### 문제 3: 리소스 경로 파싱 오류

**원인**: SKILL.md에서 절대 경로나 잘못된 상대 경로 사용

**해결 방법**:
- ✅ 올바름: `references/api-docs.md`(상대 경로)
- ❌ 잘못됨: `/path/to/skill/references/api-docs.md`(절대 경로)
- ❌ 잘못됨: `../other-skill/references/api-docs.md`(스킬 간 참조)

---

### 문제 4: SKILL.md가 너무 길어서 토큰 제한 초과

**원인**: SKILL.md가 5000단어를 초과하거나 대량의 상세 문서 포함

**해결 방법**: 상세 내용을 `references/` 디렉토리로 이동하고 SKILL.md에서 참조

## 이 강의 요약

커스텀 스킬 생성의 핵심 단계:

1. **디렉토리 구조 생성**: 최소 구조(SKILL.md만) 또는 완전 구조(references/, scripts/, assets/ 포함)
2. **YAML frontmatter 작성**: 필수 필드 `name`(하이픈 형식) 및 `description`(1-2문장)
3. **지침 내용 작성**: imperative/infinitive 형식 사용, second person 회피
4. **리소스 추가**(선택 사항): references/, scripts/, assets/
5. **형식 검증**: `openskills install ./my-skill`로 검증
6. **AGENTS.md에 동기화**: `openskills sync` 실행하여 AI 에이전트에 알림
7. **로딩 테스트**: `openskills read my-skill`로 로딩 검증

## 다음 강의 미리보기

> 다음 강의에서는 **[스킬 구조 상세 설명](../skill-structure/)**을 학습합니다.
>
> 배울 내용:
> - SKILL.md의 전체 필드 설명
> - references/, scripts/, assets/의 모범 사례
> - 스킬의 가독성과 유지보수성을 최적화하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능           | 파일 경로                                                                 | 행 번호    |
|--- | --- | ---|
| YAML frontmatter 검증 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14   |
| YAML 필드 추출  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7     |
| 설치 시 형식 검증  | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| 스킬 이름 추출    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**예제 스킬 파일**:
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 최소 구조 예제
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 형식 규격 참조

**주요 함수**:
- `hasValidFrontmatter(content: string): boolean` - SKILL.md가 `---`로 시작하는지 검증
- `extractYamlField(content: string, field: string): string` - YAML 필드 값 추출(비탐욕적 일치)

</details>
