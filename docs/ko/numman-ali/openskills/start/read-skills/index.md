---
title: "read 명령어: 설치된 스킬 내용 읽기 | openskills"
sidebarTitle: "설치된 스킬 읽기"
subtitle: "read 명령어: 설치된 스킬 내용 읽기"
description: "openskills read 명령어로 설치된 스킬 내용을 읽는 방법을 배웁니다. AI 에이전트가 스킬 정의를 빠르게 가져와 작업을 수행할 수 있도록 4단계 우선순위와 전체 로딩 프로세스를 이해하세요."
tags:
  - "입문 튜토리얼"
  - "스킬 사용"
prerequisite:
  - "start/first-skill"
order: 6
---

# 스킬 사용

## 배울 수 있는 것

- `openskills read` 명령어로 설치된 스킬 내용 읽기
- AI 에이전트가 이 명령어를 통해 스킬을 컨텍스트에 로드하는 방식 이해
- 스킬 검색의 4단계 우선순위 순서 파악
- 여러 스킬을 한 번에 읽는 방법 (쉼표로 구분)

::: info 사전 지식

이 튜토리얼은 최소 [하나의 스킬을 설치](../first-skill/)했다고 가정합니다. 아직 스킬을 설치하지 않았다면 먼저 설치 단계를 완료하세요.

:::

---

## 현재 딜레마

스킬을 설치했을 수 있지만:

- **AI가 스킬을 사용하는 방법 모름**: 스킬은 설치했지만, AI 에이전트가 어떻게 읽지?
- **read 명령어의 역할 불명확**: `read` 명령어가 있다는 것만 알지, 출력이 뭔지 모름
- **스킬 검색 순서 불분명**: 글로벌과 프로젝트 모두에 스킬이 있으면, AI가 어느 것을 사용하지?

이러한 문제는 꽤 흔합니다.一步步 해결해 보겠습니다.

---

## 언제 이 방법을 사용하는가

**스킬 사용 (read 명령)**은 이러한场景에 적합합니다:

- **AI 에이전트가 특정 작업 수행 필요**: PDF 처리, Git 리포지토리 조작 등
- **스킬 내용 확인**: SKILL.md의 지침이 예상대로 되었는지 확인
- **스킬의 전체 구조 파악**: 스킬의 references/, scripts/ 등 리소스 확인

::: tip 권장做法

보통 직접 `read` 명령어를 사용하지는 않고, AI 에이전트가 자동으로 호출합니다. 그러나 출력 형식을 알아두면 디버깅과 사용자 정의 스킬 개발에 도움이 됩니다.

:::

---

## 🎒 시작 전 준비

시작하기 전에 확인하세요:

- [ ] [첫 번째 스킬 설치](../first-skill/) 완료
- [ ] 프로젝트 디렉토리에 최소 하나 이상의 스킬 설치
- [ ] `.claude/skills/` 디렉토리 확인 가능

::: warning 사전 확인

아직 스킬을 설치하지 않았다면, 테스트 스킬을 빠르게 설치할 수 있습니다:

```bash
npx openskills install anthropics/skills
# 인터랙티브 화면에서 원하는 스킬 선택 (예: pdf)
```

:::

---

## 핵심 아이디어: 우선순위에 따라 스킬 검색 및 출력

OpenSkills의 `read` 명령어는 다음과 같은流程입니다:

```
[지정 스킬명] → [우선순위 검색] → [첫 번째 찾음] → [SKILL.md 읽기] → [표준 출력으로 출력]
```

**핵심 포인트**:

- **4단계 검색 우선순위**:
  1. `.agent/skills/` (프로젝트 universal)
  2. `~/.agent/skills/` (글로벌 universal)
  3. `.claude/skills/` (프로젝트 claude)
  4. `~/.claude/skills/` (글로벌 claude)

- **첫 번째 매치 반환**: 찾으면 바로停止, 이후 디렉토리 검색 안 함
- **기본 디렉토리 출력**: AI 에이전트가 스킬 내 리소스 파일을解析하는 데 필요

---

## 따라 해보기

### 1단계: 단일 스킬 읽기

먼저 설치된 스킬을 읽어보세요.

**예시 명령어**:

```bash
npx openskills read pdf
```

**이유**

`pdf`는 이전 수업에서 설치한 스킬명입니다. 이 명령어는 해당 스킬의 전체 내용을 찾아서 출력합니다.

**보여야 할 것**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit for extracting text and tables...
...

Skill read: pdf
```

**출력 구조 해석**:

| 부분 | 내용 | 역할 |
| --- | --- | --- |
| `Reading: pdf` | 스킬명 |正在读取的 스킬标识 |
| `Base directory: ...` | 스킬 기본 디렉토리 | AI가 references/, scripts/ 等 리소스解析에 사용 |
| SKILL.md 내용 |完整的技能定义 | 지침, 리소스 참조 등 포함 |
| `Skill read: pdf` | 종료标记 |读取 완료标识 |

::: tip 주의

**기본 디렉토리 (Base directory)**가非常重要합니다. 스킬 내의 `references/some-doc.md` 경로는 이 디렉토리를 기준으로解析됩니다.

:::

---

### 2단계: 여러 스킬 읽기

OpenSkills는 한 번에 여러 스킬을 읽을 수 있으며, 스킬명은 쉼표로 구분합니다.

**예시 명령어**:

```bash
npx openskills read pdf,git-workflow
```

**이유**

한 번에 여러 스킬을 읽으면 명령어 호출 횟수를 줄여 효율성을 높일 수 있습니다.

**보여야 할 것**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf

---
name: pdf
description: Comprehensive PDF manipulation toolkit...
...

Skill read: pdf

Reading: git-workflow
Base directory: /path/to/your/project/.claude/skills/git-workflow

---
name: git-workflow
description: Git workflow: Best practices...
...

Skill read: git-workflow
```

**특징**:
- 각 스킬 출력은 공백 줄로 구분
- 각 스킬마다独立的 `Reading:` 과 `Skill read:`标记
- 스킬은 명령어에 지정된 순서대로 읽기

::: tip 고급 사용법

스킬명에 공백이 포함될 수 있으며, `read` 명령어가 자동으로 처리합니다:

```bash
npx openskills read pdf, git-workflow  # 공백은 무시됨
```

:::

---

### 3단계: 스킬 검색 우선순위 검증

4단계 검색 순서가正しい지 확인해 보겠습니다.

**환경 준비**:

먼저 프로젝트 디렉토리와 글로벌 디렉토리에 각각 스킬을 설치합니다 (다른 설치 소스 사용):

```bash
# 프로젝트 로컬 설치 (현재 프로젝트 디렉토리에서)
npx openskills install anthropics/skills

# 글로벌 설치 (--global 사용)
npx openskills install anthropics/skills --global
```

**우선순위 검증**:

```bash
# 모든 스킬 나열
npx openskills list
```

**보여야 할 것**:

```
Available skills:

pdf (project)      /path/to/your/project/.claude/skills/pdf
pdf (global)       /home/user/.claude/skills/pdf

Total: 2 skills (1 project, 1 global)
```

**스킬 읽기**:

```bash
npx openskills read pdf
```

**보여야 할 것**:

```
Reading: pdf
Base directory: /path/to/your/project/.claude/skills/pdf  ← 프로젝트 스킬 우선 반환
...
```

**결론**: `.claude/skills/` (프로젝트)가 `~/.claude/skills/` (글로벌)보다 우선순위가 높기 때문에 프로젝트 로컬 스킬이 읽어집니다.

::: tip 실제 적용

이 우선순위 메커니즘을 활용하면 프로젝트에서 글로벌 스킬을覆盖할 수 있으며, 다른 프로젝트에는 영향이 없습니다. 예를 들어:
- 글로벌에常用 스킬 설치 (모든 프로젝트 공유)
- 프로젝트에定制 버전 설치 (글로벌 버전覆盖)

:::

---

### 4단계: 스킬의 전체 리소스 확인

스킬은 SKILL.md뿐만 아니라 references/, scripts/ 등의 리소스를 포함할 수 있습니다.

**스킬 디렉토리 구조 확인**:

```bash
ls -la .claude/skills/pdf/
```

**보여야 할 것**:

```
.claude/skills/pdf/
├── SKILL.md
├── .openskills.json
├── references/
│   ├── pdf-extraction.md
│   └── table-extraction.md
└── scripts/
    └── extract-pdf.js
```

**스킬 읽기 및 출력 확인**:

```bash
npx openskills read pdf
```

**보여야 할 것**:

SKILL.md에 다음과 같은 리소스 참조가 포함됩니다:

```markdown
## References

See [PDF extraction guide](references/pdf-extraction.md) for details.

## Scripts

Run `node scripts/extract-pdf.js` to extract text from PDF.
```

::: info 핵심 포인트

AI 에이전트가 스킬을 읽을 때:
1. `Base directory` 경로 가져오기
2. SKILL.md 내의 상대 경로 (예: `references/...`)를 기본 디렉토리와 결합
3. 실제 리소스 파일 내용 읽기

이것이 `read` 명령어가 반드시 `Base directory`를 출력해야 하는 이유입니다.

:::

---

## 체크포인트 ✅

위 단계를 완료했다면 확인하세요:

- [ ] 명령줄에 스킬의 전체 SKILL.md 내용 표시
- [ ] 출력에 `Reading: <name>` 및 `Base directory: <path>` 포함
- [ ] 출력 끝에 `Skill read: <name>` 종료标记
- [ ] 여러 스킬 읽기时, 각 스킬이 공백 줄로 구분
- [ ] 프로젝트 로컬 스킬이 아닌 글로벌 스킬 우선 읽기

모든检查항목이 통과했다면 축하합니다! 스킬 읽기의 핵심 프로세스를 완전히掌握했습니다.

---

## 함정 주의

### 문제 1: 스킬을 찾을 수 없음

**현상**:

```
Error: Skill(s) not found: pdf

Searched:
  .agent/skills/ (project universal)
  ~/.agent/skills/ (global universal)
  .claude/skills/ (project)
  ~/.claude/skills/ (global)

Install skills: npx openskills install owner/repo
```

**원인**:
- 스킬이 설치되지 않음
- 스킬명 철자 오류

**해결 방법**:
1. 설치된 스킬 나열: `npx openskills list`
2. 스킬명이 정확한지 확인
3. 설치되지 않았다면 `openskills install`로 설치

---

### 문제 2: 잘못된 스킬이 읽어짐

**현상**:

프로젝트 스킬을 읽고 싶었지만 실제로는 글로벌 스킬이 읽어졌습니다.

**원인**:
- 프로젝트 디렉토리가 올바른 위치가 아님 (잘못된 디렉토리 사용)

**해결 방법**:
1. 현재 작업 디렉토리 확인: `pwd`
2. 올바른 프로젝트 디렉토리에 있는지 확인
3. `openskills list`로 스킬의 `location`标签 확인

---

### 문제 3: 여러 스킬 읽기 순서가 예상과 다름

**현상**:

```bash
npx openskills read skill-a,skill-b
```

skill-b를 먼저 읽고 싶었지만 실제로는 skill-a가 먼저 읽어졌습니다.

**원인**:
- `read` 명령어가 매개변수에 지정된 순서대로 읽기, 자동 정렬 안 함

**해결 방법**:
- 특정 순서가 필요한 경우, 명령어에 스킬명을 순서대로 지정

---

### 문제 4: SKILL.md 내용이 잘림

**현상**:

출력된 SKILL.md 내용이不完整하고,结尾 부분이欠けています.

**원인**:
- 스킬 파일이损坏되거나 형식 오류
- 파일 인코딩 문제

**해결 방법**:
1. SKILL.md 파일 확인: `cat .claude/skills/<name>/SKILL.md`
2. 파일이 완전한지 형식이 올바른지 확인 (YAML frontmatter 필수)
3. 스킬 다시 설치: `openskills update <name>`

---

## 본 수업 요약

본 수업을 통해 배운 것:

- **사용 방법 `openskills read <name>`**로 설치된 스킬 내용 읽기
- **4단계 검색 우선순위 이해**: 프로젝트 universal > 글로벌 universal > 프로젝트 claude > 글로벌 claude
- **여러 스킬 읽기 지원**: 스킬명을 쉼표로 구분
- **출력 형식**: `Reading:`, `Base directory`, 스킬 내용, `Skill read:`标记

**핵심 개념**:

| 개념 | 설명 |
| --- | --- |
| **검색 우선순위** | 4개 디렉토리를 순서대로 검색, 첫 번째 매치 반환 |
| **기본 디렉토리** | AI 에이전트가 스킬 내 상대 경로를解析하는 기준 디렉토리 |
| **여러 스킬 읽기** | 쉼표로 구분, 지정된 순서대로 읽기 |

**핵심 명령어**:

| 명령어 | 역할 |
| --- | --- |
| `npx openskills read <name>` | 단일 스킬 읽기 |
| `npx openskills read name1,name2` | 여러 스킬 읽기 |
| `npx openskills list` | 설치된 스킬 및 위치 확인 |

---

## 다음 수업 예고

> 다음 수업에서는 **[명령어 상세 설명](../../platforms/cli-commands/)**을 학습합니다.
>
> 배울 수 있는 것:
> - OpenSkills 모든 명령어의 전체 목록과 매개변수
> - 명령줄 플래그 사용 방법과 역할
> -常用 명령어 빠른 참조

스킬 사용법을 배운 후, 이제 OpenSkills가 제공하는 모든 명령어와 그 역할에 대해 알아야 합니다.

---

## 부록: 소스 코드 참고

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 줄 번호 |
| --- | --- | --- |
| read 명령어入口 | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts#L8-L48) | 8-48 |
| 스킬 검색 (findSkill) | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84) | 69-84 |
| 스킬명 정규화 | [`src/utils/skill-names.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-names.ts) | 1-8 |
| 검색 디렉토리 가져오기 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L18-L25) | 18-25 |
| CLI 명령어 정의 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L52-L55) | 52-55 |

**핵심 함수**:
- `readSkill(skillNames)` - 표준 출력으로 스킬 읽기, 여러 스킬명 지원
- `findSkill(skillName)` - 4단계 우선순위로 스킬 검색, 첫 번째 매치 반환
- `normalizeSkillNames(input)` - 스킬명 목록 정규화, 쉼표 구분 및 중복 제거 지원
- `getSearchDirs()` - 4개 검색 디렉토리 반환, 우선순위 정렬

**핵심 타입**:
- `SkillLocation` - 스킬 위치 정보, path, baseDir, source 포함

**디렉토리 우선순위** (dirs.ts:18-24):
```typescript
[
  process.cwd() + '/.agent/skills',   // 1. Project universal
  homedir() + '/.agent/skills',       // 2. Global universal
  process.cwd() + '/.claude/skills',  // 3. Project claude
  homedir() + '/.claude/skills',      // 4. Global claude
]
```

</details>
