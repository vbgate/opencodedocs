---
title: "문제 해결: 일반적인 문제 해결 방법 | opencode-agent-skills"
subtitle: "문제 해결: 일반적인 문제 해결 방법"
sidebarTitle: "문제가 발생하면 어떻게 해야 하나요"
description: "opencode-agent-skills의 문제 해결 방법을 학습합니다. 스킬 로드 실패, 스크립트 실행 오류, 경로 보안 문제 등 9가지 일반적인 문제의 해결책을 다룹니다."
tags:
  - "troubleshooting"
  - "faq"
  - "문제해결"
prerequisite: []
order: 1
---

# 일반적인 문제 해결

::: info
이 강의는 기본 기능에 익숙한 사용자든 그렇지 않든 사용 중 문제를 겪는 모든 사용자에게 적합합니다. 스킬 로드 실패, 스크립트 실행 오류 등의 문제를 겪고 있거나 일반적인 문제 해결 방법을 알고 싶다면, 이 강의가 이러한 일반적인 문제를 빠르게 파악하고 해결하는 데 도움이 될 것입니다.
:::

## 학습 후 할 수 있는 것

- 스킬 로드 실패의 원인을 빠르게 파악
- 스크립트 실행 오류와 권한 문제 해결
- 경로 보안 제한의 원리 이해
- 의미론적 매칭 및 모델 로드 문제 해결

## 스킬을 찾을 수 없음

### 증상
`get_available_skills`를 호출할 때 `No skills found matching your query`가 반환됩니다.

### 가능한 원인
1. 스킬이 검색 경로에 설치되지 않음
2. 스킬 이름 철자 오류
3. SKILL.md 형식이 규격에 맞지 않음

### 해결 방법

**스킬이 검색 경로에 있는지 확인**:

플러그인은 다음 우선순위로 스킬을 검색합니다(첫 번째 매칭이 적용됨):

| 우선순위 | 경로 | 유형 |
| --- | --- | --- |
| 1 | `.opencode/skills/` | 프로젝트 수준 (OpenCode) |
| 2 | `.claude/skills/` | 프로젝트 수준 (Claude) |
| 3 | `~/.config/opencode/skills/` | 사용자 수준 (OpenCode) |
| 4 | `~/.claude/skills/` | 사용자 수준 (Claude) |
| 5 | `~/.claude/plugins/cache/` | 플러그인 캐시 |
| 6 | `~/.claude/plugins/marketplaces/` | 설치된 플러그인 |

검증 명령어:
```bash
# 프로젝트 수준 스킬 확인
ls -la .opencode/skills/
ls -la .claude/skills/

# 사용자 수준 스킬 확인
ls -la ~/.config/opencode/skills/
ls -la ~/.claude/skills/
```

**SKILL.md 형식 검증**:

스킬 디렉토리는 `SKILL.md` 파일을 포함해야 하며, 형식은 Anthropic Skills Spec을 준수해야 합니다:

```yaml
---
name: skill-name
description: 스킬에 대한 간단한 설명
license: MIT
allowed-tools:
  - read
  - write
metadata:
  author: your-name
---

스킬 내용 부분...
```

필수 확인 항목:
- ✅ `name`은 소문자, 숫자, 하이픈만 사용해야 함(예: `git-helper`)
- ✅ `description`은 비어 있으면 안 됨
- ✅ YAML frontmatter는 `---`로 감싸야 함
- ✅ 스킬 내용은 두 번째 `---` 뒤에 와야 함

**퍼지 매칭 활용**:

플러그인은 철자 제안을 제공합니다. 예를 들어:
```
No skills found matching "git-helper". Did you mean "git-helper-tool"?
```

유사한 제안이 표시되면 제안된 이름을 사용하여 다시 시도하세요.

---

## 스킬이 존재하지 않음 오류

### 증상
`use_skill("skill-name")`을 호출할 때 `Skill "skill-name" not found`가 반환됩니다.

### 가능한 원인
1. 스킬 이름 철자 오류
2. 스킬이 동일한 이름의 스킬에 의해 덮어쓰여짐(우선순위 충돌)
3. 스킬 디렉토리에 SKILL.md가 없거나 형식 오류

### 해결 방법

**모든 사용 가능한 스킬 보기**:

```bash
get_available_skills 도구를 사용하여 모든 스킬 나열
```

**우선순위 덮어쓰기 규칙 이해**:

여러 경로에 동일한 이름의 스킬이 존재하면 **우선순위가 가장 높은** 것만 적용됩니다. 예를 들어:
- 프로젝트 수준 `.opencode/skills/git-helper/` → ✅ 적용
- 사용자 수준 `~/.config/opencode/skills/git-helper/` → ❌ 덮어쓰여짐

동일 이름 충돌 확인:
```bash
# 모든 동일한 이름의 스킬 검색
find .opencode/skills .claude/skills ~/.config/opencode/skills ~/.claude/skills \
  -name "git-helper" -type d
```

**SKILL.md 존재 여부 검증**:

```bash
# 스킬 디렉토리로 이동
cd .opencode/skills/git-helper/

# SKILL.md 확인
ls -la SKILL.md

# YAML 형식이 올바른지 확인
head -10 SKILL.md
```

---

## 스크립트 실행 실패

### 증상
`run_skill_script`를 호출할 때 스크립트 오류 또는 0이 아닌 종료 코드가 반환됩니다.

### 가능한 원인
1. 스크립트 경로가 올바르지 않음
2. 스크립트에 실행 권한이 없음
3. 스크립트 자체에 논리 오류가 있음

### 해결 방법

**스크립트가 스킬의 scripts 목록에 있는지 확인**:

스킬을 로드할 때 사용 가능한 스크립트가 나열됩니다:
```
Skill loaded. Available scripts:
- tools/build.sh
- scripts/setup.js
```

호출 시 존재하지 않는 스크립트를 지정하면:
```
Script "build.sh" not found in skill "my-skill". Available scripts: tools/build.sh, scripts/setup.js
```

**올바른 상대 경로 사용**:

스크립트 경로는 스킬 디렉토리를 기준으로 하며, 선행 `/`를 포함하지 않아야 합니다:
- ✅ 올바름: `tools/build.sh`
- ❌ 잘못됨: `/tools/build.sh`

**스크립트에 실행 권한 부여**:

플러그인은 실행 비트가 설정된 파일만 실행합니다(`mode & 0o111`).

::: code-group

```bash [macOS/Linux]
# 실행 권한 부여
chmod +x .opencode/skills/my-skill/tools/build.sh

# 권한 검증
ls -la .opencode/skills/my-skill/tools/build.sh
# 출력에 다음이 포함되어야 함: -rwxr-xr-x
```

```powershell [Windows]
# Windows는 Unix 권한 비트를 사용하지 않으므로 스크립트 확장자가 올바르게 연결되어 있는지 확인
# PowerShell 스크립트: .ps1
# Bash 스크립트(Git Bash 통해): .sh
```

:::

**스크립트 실행 오류 디버깅**:

스크립트가 오류를 반환하면 플러그인은 종료 코드와 출력을 표시합니다:
```
Script failed (exit 1): Error: Build failed at /path/to/script.js:42
```

수동 디버깅:
```bash
# 스킬 디렉토리로 이동
cd .opencode/skills/my-skill/

# 스크립트를 직접 실행하여 자세한 오류 확인
./tools/build.sh
```

---

## 경로가 안전하지 않음 오류

### 증상
`read_skill_file` 또는 `run_skill_script`를 호출할 때 경로가 안전하지 않다는 오류가 반환됩니다.

### 가능한 원인
1. 경로에 `..`이 포함됨(디렉토리 탐색)
2. 경로가 절대 경로임
3. 경로에 비표준 문자가 포함됨

### 해결 방법

**경로 보안 규칙 이해**:

플러그인은 디렉토리 탐색 공격을 방지하기 위해 스킬 디렉토리 외부의 파일에 대한 접근을 금지합니다.

허용되는 경로 예시(스킬 디렉토리 기준):
- ✅ `docs/guide.md`
- ✅ `config/settings.json`
- ✅ `tools/setup.sh`

금지된 경로 예시:
- ❌ `../../../etc/passwd`(디렉토리 탐색)
- ❌ `/tmp/file.txt`(절대 경로)
- ❌ `./../other-skill/file.md`(다른 디렉토리로 탐색)

**상대 경로 사용**:

항상 스킬 디렉토리를 기준으로 한 상대 경로를 사용하고 `/` 또는 `../`로 시작하지 마세요:
```bash
# 스킬 문서 읽기
read_skill_file("my-skill", "docs/guide.md")

# 스킬 스크립트 실행
run_skill_script("my-skill", "tools/build.sh")
```

**사용 가능한 파일 나열**:

파일 이름이 확실하지 않으면 먼저 스킬 파일 목록을 확인하세요:
```
use_skill 호출 후 반환됩니다:
Available files:
- docs/guide.md
- config/settings.json
- README.md
```

---

## Embedding 모델 로드 실패

### 증상
의미론적 매칭 기능이 작동하지 않고 로그에 `Model failed to load`가 표시됩니다.

### 가능한 원인
1. 네트워크 연결 문제(모델 첫 다운로드 시)
2. 모델 파일 손상
3. 캐시 디렉토리 권한 문제

### 해결 방법

**네트워크 연결 확인**:

처음 사용할 때 플러그인은 Hugging Face에서 `all-MiniLM-L6-v2` 모델(약 238MB)을 다운로드해야 합니다. 네트워크가 Hugging Face에 접근할 수 있는지 확인하세요.

**캐시를 정리하고 모델 다시 다운로드**:

모델은 `~/.cache/opencode-agent-skills/`에 캐시됩니다:

```bash
# 캐시 디렉토리 삭제
rm -rf ~/.cache/opencode-agent-skills/

# OpenCode를 재시작하면 플러그인이 자동으로 모델을 다시 다운로드합니다
```

**캐시 디렉토리 권한 확인**:

```bash
# 캐시 디렉토리 보기
ls -la ~/.cache/opencode-agent-skills/

# 읽기/쓰기 권한 확인
chmod -R 755 ~/.cache/opencode-agent-skills/
```

**모델 로드를 수동으로 검증**:

문제가 지속되면 플러그인 로그에서 자세한 오류를 확인할 수 있습니다:
```
OpenCode 로그를 보고 "embedding" 또는 "model"을 검색하세요
```

---

## SKILL.md 파싱 실패

### 증상
스킬 디렉토리가 존재하지만 플러그인에서 발견되지 않거나 로드 시 형식 오류가 반환됩니다.

### 가능한 원인
1. YAML frontmatter 형식 오류
2. 필수 필드 누락
3. 필드 값이 검증 규칙에 맞지 않음

### 해결 방법

**YAML 형식 확인**:

SKILL.md의 구조는 다음과 같아야 합니다:

```markdown
---
name: my-skill
description: 스킬 설명
---

스킬 내용...
```

일반적인 오류:
- ❌ `---` 구분자 누락
- ❌ YAML 들여쓰기가 올바르지 않음(YAML은 2칸 공백 들여쓰기 사용)
- ❌ 콜론 뒤에 공백 누락

**필수 필드 검증**:

| 필드 | 유형 | 필수 | 제약 조건 |
| --- | --- | --- | --- |
| name | string | ✅ | 소문자, 숫자, 하이픈, 비어 있지 않음 |
| description | string | ✅ | 비어 있지 않음 |

**YAML 유효성 테스트**:

온라인 도구를 사용하여 YAML 형식을 검증하세요:
- [YAML Lint](https://www.yamllint.com/)

또는 명령줄 도구 사용:
```bash
# yamllint 설치
pip install yamllint

# 파일 검증
yamllint SKILL.md
```

**스킬 내용 영역 확인**:

스킬 내용은 두 번째 `---` 뒤에 와야 합니다:

```markdown
---
name: my-skill
description: 스킬 설명
---

여기부터 스킬 내용이 시작되며 AI 컨텍스트에 주입됩니다...
```

스킬 내용이 비어 있으면 플러그인은 해당 스킬을 무시합니다.

---

## 자동 추천이 작동하지 않음

### 증상
관련 메시지를 보낸 후 AI가 스킬 추천 프롬프트를 받지 못합니다.

### 가능한 원인
1. 유사도가 임계값 미만(기본값 0.35)
2. 스킬 설명이 충분히 자세하지 않음
3. 모델이 로드되지 않음

### 해결 방법

**스킬 설명 품질 향상**:

스킬 설명이 구체적일수록 의미론적 매칭이 더 정확해집니다.

| ❌ 나쁜 설명 | ✅ 좋은 설명 |
| --- | --- |
| "Git 도구" | "Git 작업 실행 지원: 브랜치 생성, 코드 커밋, PR 병합, 충돌 해결" |
| "테스트 보조" | "단위 테스트 생성, 테스트 스위트 실행, 테스트 커버리지 분석, 실패한 테스트 수정" |

**스킬 수동 호출**:

자동 추천이 작동하지 않으면 수동으로 로드할 수 있습니다:

```
use_skill("skill-name") 도구 사용
```

**유사도 임계값 조정**(고급):

기본 임계값은 0.35이며, 추천이 너무 적다고 느끼면 소스 코드에서 조정할 수 있습니다(`src/embeddings.ts:10`):

```typescript
export const SIMILARITY_THRESHOLD = 0.35; // 이 값을 낮추면 추천이 증가
```

::: warning
소스 코드를 수정하려면 플러그인을 다시 컴파일해야 하므로 일반 사용자에게는 권장하지 않습니다.
:::

---

## 컨텍스트 압축 후 스킬이 무효화됨

### 증상
긴 대화 후 AI가 로드된 스킬을 "잊어버린" 것처럼 보입니다.

### 가능한 원인
1. 플러그인 버전이 v0.1.0 미만
2. 세션 초기화가 완료되지 않음

### 해결 방법

**플러그인 버전 검증**:

압축 복구 기능은 v0.1.0+에서 모두 지원됩니다. 플러그인이 npm을 통해 설치된 경우 버전을 확인하세요:

```bash
# OpenCode 플러그인 디렉토리의 package.json 보기
cat ~/.config/opencode/plugins/opencode-agent-skills/package.json | grep version
```

**세션 초기화 완료 확인**:

플러그인은 첫 번째 메시지에서 스킬 목록을 주입합니다. 세션 초기화가 완료되지 않으면 압축 복구가 실패할 수 있습니다.

증상:
- 첫 번째 메시지 후 스킬 목록이 표시되지 않음
- AI가 사용 가능한 스킬을 모름

**세션 다시 시작**:

문제가 지속되면 현재 세션을 삭제하고 새로 만드세요:
```
OpenCode에서 세션을 삭제하고 대화를 다시 시작하세요
```

---

## 스크립트 재귀 검색 실패

### 증상
스킬에 깊게 중첩된 스크립트가 포함되어 있지만 플러그인에서 발견되지 않습니다.

### 가능한 원인
1. 재귀 깊이가 10단계를 초과
2. 스크립트가 숨겨진 디렉토리에 있음(`.`으로 시작)
3. 스크립트가 의존성 디렉토리에 있음(예: `node_modules`)

### 해결 방법

**재귀 검색 규칙 이해**:

플러그인이 스크립트를 재귀적으로 검색할 때:
- 최대 깊이: 10단계
- 숨겨진 디렉토리(디렉토리 이름이 `.`으로 시작) 건너뛰기: `.git`, `.vscode` 등
- 의존성 디렉토리 건너뛰기: `node_modules`, `__pycache__`, `vendor`, `.venv`, `venv`, `.tox`, `.nox`

**스크립트 위치 조정**:

스크립트가 깊은 디렉토리에 있는 경우:
- 더 얕은 디렉토리로 이동(예: `src/lib/utils/tools/` 대신 `tools/`)
- 스크립트 위치에 심볼릭 링크 사용(Unix 시스템)

```bash
# 심볼릭 링크 생성
ln -s ../../../scripts/build.sh tools/build.sh
```

**발견된 스크립트 나열**:

스킬을 로드한 후 플러그인은 스크립트 목록을 반환합니다. 스크립트가 목록에 없으면 확인하세요:
1. 파일에 실행 권한이 있는지
2. 디렉토리가 건너뛰기 규칙과 일치하는지

---

## 강의 요약

이 강의는 OpenCode Agent Skills 플러그인 사용 시 일반적인 9가지 문제 유형을 다룹니다:

| 문제 유형 | 핵심 확인 지점 |
| --- | --- |
| 스킬을 찾을 수 없음 | 검색 경로, SKILL.md 형식, 철자 |
| 스킬이 존재하지 않음 | 이름 정확성, 우선순위 덮어쓰기, 파일 존재 여부 |
| 스크립트 실행 실패 | 스크립트 경로, 실행 권한, 스크립트 논리 |
| 경로가 안전하지 않음 | 상대 경로, `..` 없음, 절대 경로 없음 |
| 모델 로드 실패 | 네트워크 연결, 캐시 정리, 디렉토리 권한 |
| 파싱 실패 | YAML 형식, 필수 필드, 스킬 내용 |
| 자동 추천이 작동하지 않음 | 설명 품질, 유사도 임계값, 수동 호출 |
| 컨텍스트 압축 후 무효화 | 플러그인 버전, 세션 초기화 |
| 스크립트 재귀 검색 실패 | 깊이 제한, 디렉토리 건너뛰기 규칙, 실행 권한 |

---

## 다음 강의 예고

> 다음 강의에서는 **[보안 고려사항](../security-considerations/)**을 학습합니다.
>
> 학습 내용:
> - 플러그인의 보안 메커니즘 설계
> - 안전한 스킬 작성 방법
> - 경로 검증 및 권한 제어 원리
> - 보안 모범 사례

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 줄 번호 |
| --- | --- | --- |
| 스킬 쿼리 퍼지 매칭 제안 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L49-L59) | 49-59 |
| 스킬이 존재하지 않음 오류 처리 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L89-L97) | 89-97 |
| 스크립트가 존재하지 않음 오류 처리 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L167-L177) | 167-177 |
| 스크립트 실행 실패 오류 처리 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L184-L195) | 184-195 |
| 경로 보안 검사 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| SKILL.md 파싱 오류 처리 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L127-L152) | 127-152 |
| 모델 로드 실패 오류 | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L38-L40) | 38-40 |
| 퍼지 매칭 알고리즘 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L88-L125) | 88-125 |

**핵심 상수**:
- `SIMILARITY_THRESHOLD = 0.35`(유사도 임계값): `src/embeddings.ts:10`
- `TOP_K = 5`(반환할 가장 유사한 스킬 수): `src/embeddings.ts:11`

**기타 중요 값**:
- `maxDepth = 10`(스크립트 재귀 최대 깊이, findScripts 함수 기본 매개변수): `src/skills.ts:59`
- `0.4`(퍼지 매칭 임계값, findClosestMatch 함수 반환 조건): `src/utils.ts:124`

**핵심 함수**:
- `findClosestMatch()`: 퍼지 매칭 알고리즘, 철자 제안 생성에 사용
- `isPathSafe()`: 경로 보안 검사, 디렉토리 탐색 방지
- `ensureModel()`: embedding 모델이 로드되었는지 확인
- `parseSkillFile()`: SKILL.md 파싱 및 형식 검증

</details>
