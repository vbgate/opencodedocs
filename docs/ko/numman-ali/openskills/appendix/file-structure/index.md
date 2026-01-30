---
title: "파일 구조: 디렉토리 구성 | opencode-openskills"
sidebarTitle: "스킬 위치"
subtitle: "파일 구조: 디렉토리 구성 | opencode-openskills"
description: "OpenSkills의 디렉토리 및 파일 구성 방식을 학습하세요. 스킬 설치 디렉토리, 디렉토리 구조, AGENTS.md 형식 규칙 및 조회 우선순위를 마스터하세요."
tags:
  - "부록"
  - "파일 구조"
  - "디렉토리 구성"
prerequisite: []
order: 3
---

# 파일 구조

## 개요

OpenSkills의 파일 구조는 세 가지 유형으로 나뉩니다: **스킬 설치 디렉토리**, **스킬 디렉토리 구조**, **AGENTS.md 동기화 파일**. 이러한 구조를 이해하면 스킬을 더 효과적으로 관리하고 사용할 수 있습니다.

## 스킬 설치 디렉토리

OpenSkills는 우선순위가 높은 순서대로 4개의 스킬 설치 위치를 지원합니다:

| 우선순위 | 위치 | 설명 | 언제 사용하는가 |
|---|---|---|---|
| 1 | `./.agent/skills/` | 프로젝트 로컬 Universal 모드 | 다중 에이전트 환경, Claude Code와의 충돌 방지 |
| 2 | `~/.agent/skills/` | 전역 Universal 모드 | 다중 에이전트 환경 + 전역 설치 |
| 3 | `./.claude/skills/` | 프로젝트 로컬 (기본값) | 표준 설치, 프로젝트 특정 스킬 |
| 4 | `~/.claude/skills/` | 전역 설치 | 모든 프로젝트에서 공유하는 스킬 |

**선택 권장사항**:
- 단일 에이전트 환경: 기본값인 `.claude/skills/` 사용
- 다중 에이전트 환경: `.agent/skills/` 사용 (`--universal` 플래그)
- 프로젝트 간 공용 스킬: 전역 설치 사용 (`--global` 플래그)

## 스킬 디렉토리 구조

각 스킬은 필수 파일과 선택적 리소스를 포함하는 독립적인 디렉토리입니다:

```
skill-name/
├── SKILL.md              # 필수: 스킬 메인 파일
├── .openskills.json      # 필수: 설치 메타데이터 (자동 생성)
├── references/           # 선택: 참조 문서
│   └── api-docs.md
├── scripts/             # 선택: 실행 가능한 스크립트
│   └── helper.py
└── assets/              # 선택: 템플릿 및 출력 파일
    └── template.json
```

### 파일 설명

#### SKILL.md (필수)

스킬 메인 파일로 YAML frontmatter와 스킬 지시사항을 포함합니다:

```yaml
---
name: my-skill
description: 스킬 설명
---

## 스킬 제목

스킬 지시사항 내용...
```

**핵심 사항**:
- 파일명은 반드시 `SKILL.md` (대문자)여야 합니다
- YAML frontmatter는 `name`과 `description`을 포함해야 합니다
- 내용은 명령형(imperative form)을 사용합니다

#### .openskills.json (필수, 자동 생성)

OpenSkills가 자동으로 생성하는 메타데이터 파일로 설치 소스를 기록합니다:

```json
{
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2026-01-24T12:00:00.000Z"
}
```

**용도**:
- 스킬 업데이트 지원 (`openskills update`)
- 설치 타임스탬프 기록
- 스킬 소스 추적

**소스 위치**:
- `src/utils/skill-metadata.ts:29-36` - 메타데이터 쓰기
- `src/utils/skill-metadata.ts:17-27` - 메타데이터 읽기

#### references/ (선택)

참조 문서 및 API 사양을 저장합니다:

```
references/
├── skill-format.md      # 스킬 형식 사양
├── api-docs.md         # API 문서
└── best-practices.md   # 모범 사례
```

**사용 시나리오**:
- 상세한 기술 문서 (SKILL.md 간소 유지)
- API 참조 매뉴얼
- 예제 코드 및 템플릿

#### scripts/ (선택)

실행 가능한 스크립트를 저장합니다:

```
scripts/
├── extract_text.py      # Python 스크립트
├── deploy.sh          # Shell 스크립트
└── build.js          # Node.js 스크립트
```

**사용 시나리오**:
- 스킬 실행 시 실행해야 할 자동화 스크립트
- 데이터 처리 및 변환 도구
- 배포 및 빌드 스크립트

#### assets/ (선택)

템플릿 및 출력 파일을 저장합니다:

```
assets/
├── template.json      # JSON 템플릿
├── config.yaml       # 구성 파일
└── output.md        # 샘플 출력
```

**사용 시나리오**:
- 스킬이 생성하는 콘텐츠의 템플릿
- 구성 파일 샘플
- 예상 출력 예제

## AGENTS.md 구조

`openskills sync`로 생성된 AGENTS.md 파일에는 스킬 시스템 설명과 사용 가능한 스킬 목록이 포함됩니다:

### 전체 형식

```markdown
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

### 컴포넌트 설명

| 컴포넌트 | 설명 |
|---|---|
| `<skills_system>` | XML 태그, 스킬 시스템 섹션 표시 |
| `<usage>` | 스킬 사용 설명 (AI가 스킬을 호출하는 방법 안내) |
| `<available_skills>` | 사용 가능한 스킬 목록 (각 스킬마다 `<skill>` 태그) |
| `<skill>` | 단일 스킬 정보 (name, description, location) |
| `<!-- SKILLS_TABLE_START -->` | 시작 마커 (동기화 시 위치 지정용) |
| `<!-- SKILLS_TABLE_END -->` | 종료 마커 (동기화 시 위치 지정용) |

**location 필드**:
- `project` - 프로젝트 로컬 스킬 (`.claude/skills/` 또는 `.agent/skills/`)
- `global` - 전역 스킬 (`~/.claude/skills/` 또는 `~/.agent/skills/`)

## 디렉토리 조회 우선순위

OpenSkills는 스킬을 검색할 때 다음 우선순위로 디렉토리를 순회합니다:

```typescript
// 소스 위치: src/utils/dirs.ts:18-25
[
  join(process.cwd(), '.agent/skills'),   // 1. 프로젝트 Universal
  join(homedir(), '.agent/skills'),        // 2. 전역 Universal
  join(process.cwd(), '.claude/skills'),  // 3. 프로젝트 Claude
  join(homedir(), '.claude/skills'),       // 4. 전역 Claude
]
```

**규칙**:
- 첫 번째로 일치하는 스킬을 찾으면 즉시 검색 중단
- 프로젝트 로컬 스킬이 전역 스킬보다 우선
- Universal 모드가 표준 모드보다 우선

**소스 위치**: `src/utils/skills.ts:30-64` - 모든 스킬 조회 구현

## 예시: 완전한 프로젝트 구조

OpenSkills를 사용하는 전형적인 프로젝트 구조:

```
my-project/
├── AGENTS.md                    # 동기화된 스킬 목록
├── .claude/                     # Claude Code 구성
│   └── skills/                  # 스킬 설치 디렉토리
│       ├── pdf/
│       │   ├── SKILL.md
│       │   ├── .openskills.json
│       │   ├── references/
│       │   ├── scripts/
│       │   └── assets/
│       └── git-workflow/
│           ├── SKILL.md
│           └── .openskills.json
├── .agent/                      # Universal 모드 디렉토리 (선택)
│   └── skills/
│       └── my-custom-skill/
│           ├── SKILL.md
│           └── .openskills.json
├── src/                         # 프로젝트 소스 코드
├── package.json
└── README.md
```

## 모범 사례

### 1. 디렉토리 선택

| 시나리오 | 권장 디렉토리 | 명령어 |
|---|---|---|
| 프로젝트 특정 스킬 | `.claude/skills/` | `openskills install repo` |
| 다중 에이전트 공유 | `.agent/skills/` | `openskills install repo --universal` |
| 프로젝트 간 공용 | `~/.claude/skills/` | `openskills install repo --global` |

### 2. 스킬 구성

- **단일 스킬 리포지토리**: 루트 디렉토리에 `SKILL.md` 배치
- **다중 스킬 리포지토리**: 하위 디렉토리마다 `SKILL.md` 포함
- **심볼릭 링크**: 개발 시 로컬 리포지토리에 symlink 연결 (참고: [심볼릭 링크 지원](../../advanced/symlink-support/))

### 3. AGENTS.md 버전 관리

- **제출 권장**: `AGENTS.md`를 버전 관리에 추가
- **CI 동기화**: CI/CD에서 `openskills sync -y` 실행 (참고: [CI/CD 통합](../../advanced/ci-integration/))
- **팀 협업**: 팀원이 `openskills sync`를 동시에 실행하여 일관성 유지

## 본 과정 요약

OpenSkills의 파일 구조는 간결하고 명확하게 설계되었습니다:

- **4개의 설치 디렉토리**: 프로젝트 로컬, 전역, Universal 모드 지원
- **스킬 디렉토리**: 필수인 SKILL.md + 자동 생성된 .openskills.json + 선택적 resources/scripts/assets
- **AGENTS.md**: 동기화된 스킬 목록, Claude Code 형식 준수

이러한 구조를 이해하면 스킬을 더 효율적으로 관리하고 사용할 수 있습니다.

## 다음 과정 예고

> 다음 과정에서 **[용어 사전](../glossary/)**을 학습합니다.
>
> 학습할 내용:
> - OpenSkills와 AI 스킬 시스템의 핵심 용어
> - 전문 개념의 정확한 정의
> - 일반적인 약어의 의미

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 확인</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 행 번호 |
|---|---|---|
| 디렉토리 경로 유틸리티 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 1-25 |
| 스킬 조회 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-84 |
| 메타데이터 관리 | [`src/utils/skill-metadata.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skill-metadata.ts) | 1-36 |

**핵심 함수**:
- `getSkillsDir(projectLocal, universal)` - 스킬 디렉토리 경로 가져오기
- `getSearchDirs()` - 4개의 조회 디렉토리 가져오기 (우선순위별)
- `findAllSkills()` - 모든 설치된 스킬 조회
- `findSkill(skillName)` - 지정된 스킬 조회
- `readSkillMetadata(skillDir)` - 스킬 메타데이터 읽기
- `writeSkillMetadata(skillDir, metadata)` - 스킬 메타데이터 쓰기

</details>
