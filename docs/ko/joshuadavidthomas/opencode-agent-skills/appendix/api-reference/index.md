---
title: "API: 도구 레퍼런스 | opencode-agent-skills"
sidebarTitle: "4가지 도구 호출하기"
subtitle: "API: 도구 레퍼런스 | opencode-agent-skills"
description: "opencode-agent-skills의 4가지 핵심 API 도구 사용법을 학습합니다. 매개변수 설정, 반환값 처리, 오류 해결 기법을 익히고, 네임스페이스 지원과 보안 메커니즘을 이해하며, 실제 예제를 통해 개발 효율성을 높이고 프로젝트에서 도구를 효과적으로 호출하세요."
tags:
  - "API"
  - "도구 레퍼런스"
  - "인터페이스 문서"
prerequisite:
  - "start-installation"
order: 2
---

# API 도구 레퍼런스

## 학습 목표

이 API 레퍼런스를 통해 다음을 배울 수 있습니다:

- 4가지 핵심 도구의 매개변수와 반환값 이해
- 올바른 도구 호출 방법 습득
- 일반적인 오류 상황 처리 방법 학습

## 도구 개요

OpenCode Agent Skills 플러그인은 다음 4가지 도구를 제공합니다:

| 도구 이름 | 기능 설명 | 사용 시나리오 |
| --- | --- | --- |
| `get_available_skills` | 사용 가능한 스킬 목록 조회 | 모든 사용 가능한 스킬 확인, 검색 필터링 지원 |
| `read_skill_file` | 스킬 파일 읽기 | 스킬의 문서, 설정 등 지원 파일 접근 |
| `run_skill_script` | 스킬 스크립트 실행 | 스킬 디렉토리에서 자동화 스크립트 실행 |
| `use_skill` | 스킬 로드 | 스킬의 SKILL.md 내용을 세션 컨텍스트에 주입 |

---

## get_available_skills

사용 가능한 스킬 목록을 조회하며, 선택적 검색 필터링을 지원합니다.

### 매개변수

| 매개변수명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `query` | string | 아니오 | 검색 쿼리 문자열, 스킬 이름과 설명 매칭 (`*` 와일드카드 지원) |

### 반환값

포맷된 스킬 목록을 반환하며, 각 항목에는 다음이 포함됩니다:

- 스킬 이름과 출처 레이블 (예: `skill-name (project)`)
- 스킬 설명
- 사용 가능한 스크립트 목록 (있는 경우)

**반환 예시**:
```
git-helper (project)
  Git operations and workflow automation tools
  [scripts: tools/commit.sh, tools/branch.sh]

code-review (user)
  Code review checklist and quality standards
```

### 오류 처리

- 매칭 결과가 없을 경우 안내 메시지 반환
- 쿼리 매개변수 철자가 틀린 경우 유사한 스킬 제안 반환

### 사용 예시

**모든 스킬 나열**:
```
사용자 입력:
사용 가능한 모든 스킬을 나열해 주세요

AI 호출:
get_available_skills()
```

**"git" 포함 스킬 검색**:
```
사용자 입력:
git 관련 스킬을 찾아주세요

AI 호출:
get_available_skills({
  "query": "git"
})
```

**와일드카드로 검색**:
```
AI 호출:
get_available_skills({
  "query": "code*"
})

반환:
code-review (user)
  Code review checklist and quality standards
```

---

## read_skill_file

스킬 디렉토리 내의 지원 파일(문서, 설정, 예제 등)을 읽습니다.

### 매개변수

| 매개변수명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `skill` | string | 예 | 스킬 이름 |
| `filename` | string | 예 | 파일 경로 (스킬 디렉토리 기준 상대 경로, 예: `docs/guide.md`, `scripts/helper.sh`) |

### 반환값

파일 로드 성공 확인 메시지를 반환합니다.

**반환 예시**:
```
File "docs/guide.md" from skill "code-review" loaded.
```

파일 내용은 XML 형식으로 세션 컨텍스트에 주입됩니다:

```xml
<skill-file skill="code-review" file="docs/guide.md">
  <metadata>
    <directory>/path/to/skills/code-review</directory>
  </metadata>
  
  <content>
[실제 파일 내용]
  </content>
</skill-file>
```

### 오류 처리

| 오류 유형 | 반환 메시지 |
| --- | --- |
| 스킬 없음 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| 안전하지 않은 경로 | `Invalid path: cannot access files outside skill directory.` |
| 파일 없음 | `File "xxx" not found. Available files: file1, file2, ...` |

### 보안 메커니즘

- 경로 안전성 검사: 디렉토리 탐색 공격 방지 (예: `../../../etc/passwd`)
- 스킬 디렉토리 내 파일만 접근 가능

### 사용 예시

**스킬 문서 읽기**:
```
사용자 입력:
code-review 스킬의 사용 가이드를 보여주세요

AI 호출:
read_skill_file({
  "skill": "code-review",
  "filename": "docs/guide.md"
})
```

**설정 파일 읽기**:
```
AI 호출:
read_skill_file({
  "skill": "git-helper",
  "filename": "config.json"
})
```

---

## run_skill_script

스킬 디렉토리에서 실행 가능한 스크립트를 실행합니다.

### 매개변수

| 매개변수명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `skill` | string | 예 | 스킬 이름 |
| `script` | string | 예 | 스크립트 상대 경로 (예: `build.sh`, `tools/deploy.sh`) |
| `arguments` | string[] | 아니오 | 스크립트에 전달할 명령줄 인수 배열 |

### 반환값

스크립트의 출력 내용을 반환합니다.

**반환 예시**:
```
Building project...
✓ Dependencies installed
✓ Tests passed
Build complete.
```

### 오류 처리

| 오류 유형 | 반환 메시지 |
| --- | --- |
| 스킬 없음 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |
| 스크립트 없음 | `Script "xxx" not found in skill "yyy". Available scripts: script1, script2, ...` |
| 실행 실패 | `Script failed (exit 1): error message` |

### 스크립트 탐색 규칙

플러그인은 스킬 디렉토리 내의 실행 가능한 파일을 자동으로 스캔합니다:

- 최대 재귀 깊이: 10단계
- 숨김 디렉토리 건너뛰기 (`.`으로 시작)
- 일반적인 의존성 디렉토리 건너뛰기 (`node_modules`, `__pycache__`, `.git` 등)
- 실행 권한이 있는 파일만 포함 (`mode & 0o111`)

### 실행 환경

- 작업 디렉토리(CWD)가 스킬 디렉토리로 전환됨
- 스크립트는 스킬 디렉토리 컨텍스트에서 실행됨
- 출력이 AI에게 직접 반환됨

### 사용 예시

**빌드 스크립트 실행**:
```
사용자 입력:
프로젝트의 빌드 스크립트를 실행해 주세요

AI 호출:
run_skill_script({
  "skill": "git-helper",
  "script": "tools/build.sh"
})
```

**인수와 함께 실행**:
```
AI 호출:
run_skill_script({
  "skill": "deployment",
  "script": "deploy.sh",
  "arguments": ["--env", "production", "--force"]
})
```

---

## use_skill

스킬의 SKILL.md 내용을 세션 컨텍스트에 로드합니다.

### 매개변수

| 매개변수명 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `skill` | string | 예 | 스킬 이름 (네임스페이스 접두사 지원, 예: `project:my-skill`, `user:my-skill`) |

### 반환값

스킬 로드 성공 확인 메시지와 함께 사용 가능한 스크립트 및 파일 목록을 반환합니다.

**반환 예시**:
```
Skill "code-review" loaded.
Available scripts: tools/check.sh, tools/format.sh
Available files: docs/guide.md, examples/bad.js
```

스킬 내용은 XML 형식으로 세션 컨텍스트에 주입됩니다:

```xml
<skill name="code-review">
  <metadata>
    <source>user</source>
    <directory>/path/to/skills/code-review</directory>
    <scripts>
      <script>tools/check.sh</script>
      <script>tools/format.sh</script>
    </scripts>
    <files>
      <file>docs/guide.md</file>
      <file>examples/bad.js</file>
    </files>
  </metadata>

  [Claude Code 도구 매핑...]
  
  <content>
[SKILL.md 실제 내용]
  </content>
</skill>
```

### 네임스페이스 지원

네임스페이스 접두사를 사용하여 스킬 출처를 정확히 지정합니다:

| 네임스페이스 | 설명 | 예시 |
| --- | --- | --- |
| `project:` | 프로젝트 레벨 OpenCode 스킬 | `project:my-skill` |
| `user:` | 사용자 레벨 OpenCode 스킬 | `user:my-skill` |
| `claude-project:` | 프로젝트 레벨 Claude 스킬 | `claude-project:my-skill` |
| `claude-user:` | 사용자 레벨 Claude 스킬 | `claude-user:my-skill` |
| 접두사 없음 | 기본 우선순위 사용 | `my-skill` |

### 오류 처리

| 오류 유형 | 반환 메시지 |
| --- | --- |
| 스킬 없음 | `Skill "xxx" not found. Use get_available_skills to list available skills.` |

### 자동 주입 기능

스킬 로드 시 플러그인이 자동으로 수행하는 작업:

1. 스킬 디렉토리 내 모든 파일 나열 (SKILL.md 제외)
2. 모든 실행 가능한 스크립트 나열
3. Claude Code 도구 매핑 주입 (스킬에서 필요한 경우)

### 사용 예시

**스킬 로드**:
```
사용자 입력:
코드 리뷰를 도와주세요

AI 호출:
use_skill({
  "skill": "code-review"
})
```

**네임스페이스로 출처 지정**:
```
AI 호출:
use_skill({
  "skill": "user:git-helper"
})
```

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 날짜: 2026-01-24

| 도구 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| GetAvailableSkills 도구 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L29-L72) | 29-72 |
| ReadSkillFile 도구 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L74-L135) | 74-135 |
| RunSkillScript 도구 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| UseSkill 도구 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L200-L267) | 200-267 |
| 도구 등록 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L160-L167) | 160-167 |
| Skill 타입 정의 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L43-L52) | 43-52 |
| Script 타입 정의 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L35-L38) | 35-38 |
| SkillLabel 타입 정의 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L30) | 30 |
| resolveSkill 함수 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L269-L283) | 269-283 |

**핵심 타입**:
- `Skill`: 스킬 전체 메타데이터 (name, description, path, scripts, template 등)
- `Script`: 스크립트 메타데이터 (relativePath, absolutePath)
- `SkillLabel`: 스킬 출처 식별자 (project, user, claude-project 등)

**핵심 함수**:
- `resolveSkill()`: 스킬 이름 해석, 네임스페이스 접두사 지원
- `isPathSafe()`: 경로 안전성 검증, 디렉토리 탐색 방지
- `findClosestMatch()`: 퍼지 매칭 제안

</details>

---

## 다음 강의 예고

이 강의에서 OpenCode Agent Skills의 API 도구 레퍼런스 문서를 완료했습니다.

더 많은 정보가 필요하시면 다음을 참조하세요:
- [스킬 개발 모범 사례](../best-practices/) - 고품질 스킬 작성 팁과 규범 학습
- [자주 묻는 질문 해결](../../faq/troubleshooting/) - 플러그인 사용 시 발생하는 일반적인 문제 해결
