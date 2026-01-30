---
title: "모범 사례: 스킬 개발 | opencode-agent-skills"
sidebarTitle: "고품질 스킬 작성하기"
subtitle: "모범 사례: 스킬 개발"
description: "OpenCode Agent Skills 개발 규범을 마스터하세요. 네이밍, 설명, 디렉토리, 스크립트, Frontmatter 등의 모범 사례를 배워 스킬 품질과 AI 활용 효율을 높이세요."
tags:
  - "모범 사례"
  - "스킬 개발"
  - "규범"
  - "Anthropic Skills"
prerequisite:
  - "creating-your-first-skill"
order: 1
---

# 스킬 개발 모범 사례

## 학습 목표

이 튜토리얼을 완료하면 다음을 할 수 있습니다:
- 네이밍 규칙에 맞는 스킬 이름 작성
- 자동 추천에 잘 인식되는 설명 작성
- 명확한 스킬 디렉토리 구조 구성
- 스크립트 기능의 적절한 활용
- Frontmatter 관련 흔한 실수 방지
- 스킬의 발견율과 사용성 향상

## 모범 사례가 필요한 이유

OpenCode Agent Skills 플러그인은 단순히 스킬을 저장하는 것이 아니라 다음과 같은 기능을 수행합니다:
- **자동 발견**: 여러 위치에서 스킬 디렉토리 스캔
- **시맨틱 매칭**: 스킬 설명과 사용자 메시지의 유사도를 기반으로 스킬 추천
- **네임스페이스 관리**: 여러 소스의 스킬 공존 지원
- **스크립트 실행**: 실행 가능한 스크립트 자동 스캔 및 실행

모범 사례를 따르면 스킬이:
- ✅ 플러그인에서 올바르게 인식되고 로드됨
- ✅ 시맨틱 매칭 시 더 높은 추천 우선순위 획득
- ✅ 다른 스킬과의 충돌 방지
- ✅ 팀원들이 더 쉽게 이해하고 사용 가능

---

## 네이밍 규칙

### 스킬 이름 규칙

스킬 이름은 다음 규칙을 따라야 합니다:

::: tip 네이밍 규칙
- ✅ 소문자, 숫자, 하이픈 사용
- ✅ 문자로 시작
- ✅ 단어 구분에 하이픈 사용
- ❌ 대문자나 언더스코어 사용 금지
- ❌ 공백이나 특수문자 사용 금지
:::

**예시**:

| ✅ 올바른 예시 | ❌ 잘못된 예시 | 이유 |
|---|---|---|
| `git-helper` | `GitHelper` | 대문자 포함 |
| `docker-build` | `docker_build` | 언더스코어 사용 |
| `code-review` | `code review` | 공백 포함 |
| `test-utils` | `1-test` | 숫자로 시작 |

**소스 코드 참조**: `src/skills.ts:106-108`

```typescript
name: z.string()
  .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
  .min(1, { message: "Name cannot be empty" }),
```

### 디렉토리 이름과 frontmatter의 관계

스킬 디렉토리 이름과 frontmatter의 `name` 필드는 다를 수 있습니다:

```yaml
---
# 디렉토리는 my-git-tools이지만 frontmatter의 name은 git-helper
name: git-helper
description: Git 자주 사용하는 작업 도우미
---
```

**권장 사항**:
- 디렉토리 이름과 `name` 필드를 일치시켜 유지보수 용이하게
- 디렉토리 이름은 짧고 기억하기 쉬운 식별자 사용
- `name` 필드는 스킬 용도를 더 구체적으로 설명 가능

**소스 코드 참조**: `src/skills.ts:155-158`

---

## 설명 작성 팁

### 설명의 역할

스킬 설명은 단순히 사용자를 위한 안내가 아니라 다음 용도로도 사용됩니다:

1. **시맨틱 매칭**: 플러그인이 설명과 사용자 메시지의 유사도 계산
2. **스킬 추천**: 유사도를 기반으로 관련 스킬 자동 추천
3. **퍼지 매칭**: 스킬 이름 철자 오류 시 유사한 스킬 추천에 활용

### 좋은 설명 vs 나쁜 설명

| ✅ 좋은 설명 | ❌ 나쁜 설명 | 이유 |
|---|---|---|
| "Git 브랜치 관리와 커밋 프로세스 자동화, 커밋 메시지 자동 생성 지원" | "Git 도구" | 너무 모호하고 구체적인 기능 부재 |
| "Node.js 프로젝트를 위한 타입 안전 API 클라이언트 코드 생성" | "유용한 도구" | 적용 시나리오 미설명 |
| "PDF를 한국어로 번역하고 원본 레이아웃 유지" | "번역 도구" | 특별한 기능 미설명 |

### 설명 작성 원칙

::: tip 설명 작성 원칙
1. **구체화**: 스킬의 구체적인 용도와 적용 시나리오 설명
2. **키워드 포함**: 사용자가 검색할 수 있는 키워드 포함 (예: "Git", "Docker", "번역")
3. **고유 가치 강조**: 다른 유사 스킬 대비 이 스킬의 장점 설명
4. **중복 방지**: 스킬 이름을 반복하지 않음
:::

**예시**:

```markdown
---
name: pdf-translator
description: 영문 PDF 문서를 한국어로 번역하고 원본 레이아웃, 이미지 위치, 표 구조를 유지합니다. 일괄 번역과 사용자 정의 용어집을 지원합니다.
---
```

이 설명에는 다음이 포함되어 있습니다:
- ✅ 구체적인 기능 (PDF 번역, 레이아웃 유지)
- ✅ 적용 시나리오 (영문 문서)
- ✅ 고유 가치 (레이아웃 유지, 일괄 처리, 용어집)

**소스 코드 참조**: `src/skills.ts:109`

```typescript
description: z.string()
  .min(1, { message: "Description cannot be empty" }),
```

---

## 디렉토리 구성

### 기본 구조

표준 스킬 디렉토리 구성:

```
my-skill/
├── SKILL.md              # 스킬 메인 파일 (필수)
├── README.md             # 상세 문서 (선택)
├── tools/                # 실행 가능한 스크립트 (선택)
│   ├── setup.sh
│   └── run.sh
└── docs/                 # 지원 문서 (선택)
    ├── guide.md
    └── examples.md
```

### 건너뛰는 디렉토리

플러그인은 다음 디렉토리를 자동으로 건너뜁니다 (스크립트 스캔 제외):

::: warning 자동으로 건너뛰는 디렉토리
- `node_modules` - Node.js 의존성
- `__pycache__` - Python 바이트코드 캐시
- `.git` - Git 버전 관리
- `.venv`, `venv` - Python 가상 환경
- `.tox`, `.nox` - Python 테스트 환경
- `.`으로 시작하는 모든 숨김 디렉토리
:::

**소스 코드 참조**: `src/skills.ts:61`

```typescript
const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);
```

### 권장 디렉토리 네이밍

| 용도 | 권장 디렉토리명 | 설명 |
|---|---|---|
| 스크립트 파일 | `tools/` 또는 `scripts/` | 실행 가능한 스크립트 저장 |
| 문서 | `docs/` 또는 `examples/` | 보조 문서 저장 |
| 설정 | `config/` | 설정 파일 저장 |
| 템플릿 | `templates/` | 템플릿 파일 저장 |

---

## 스크립트 사용

### 스크립트 발견 규칙

플러그인은 스킬 디렉토리 내의 실행 가능한 파일을 자동으로 스캔합니다:

::: tip 스크립트 발견 규칙
- ✅ 스크립트에 실행 권한 필요 (`chmod +x script.sh`)
- ✅ 최대 재귀 깊이 10단계
- ✅ 숨김 디렉토리와 의존성 디렉토리 건너뜀
- ❌ 실행 불가능한 파일은 스크립트로 인식되지 않음
:::

**소스 코드 참조**: `src/skills.ts:86`

```typescript
if (stats.mode & 0o111) {
  scripts.push({
    relativePath: newRelPath,
    absolutePath: fullPath
  });
}
```

### 스크립트 권한 설정

**Bash 스크립트**:
```bash
chmod +x tools/setup.sh
chmod +x tools/run.sh
```

**Python 스크립트**:
```bash
chmod +x tools/scan.py
```

파일 시작 부분에 shebang 추가:
```python
#!/usr/bin/env python3
import sys
# ...
```

### 스크립트 호출 예시

스킬이 로드되면 AI가 사용 가능한 스크립트 목록을 확인합니다:

```
Available scripts:
- tools/setup.sh: 개발 환경 초기화
- tools/build.sh: 프로젝트 빌드
- tools/deploy.sh: 프로덕션 배포
```

AI는 `run_skill_script` 도구를 통해 이러한 스크립트를 호출할 수 있습니다:

```javascript
run_skill_script({
  skill: "project-builder",
  script: "tools/build.sh",
  arguments: ["--release", "--verbose"]
})
```

---

## Frontmatter 모범 사례

### 필수 필드

**name**: 스킬 고유 식별자
- 소문자, 숫자, 하이픈
- 짧지만 설명적
- 일반적인 이름 피하기 (예: `helper`, `tool`)

**description**: 스킬 설명
- 기능을 구체적으로 설명
- 적용 시나리오 포함
- 적절한 길이 (1-2문장)

### 선택 필드

**license**: 라이선스 정보
```yaml
license: MIT
```

**allowed-tools**: 스킬이 사용할 수 있는 도구 제한
```yaml
allowed-tools:
  - read
  - write
  - bash
```

**metadata**: 사용자 정의 메타데이터
```yaml
metadata:
  author: "Your Name"
  version: "1.0.0"
  category: "development"
```

**소스 코드 참조**: `src/skills.ts:105-114`

```typescript
const SkillFrontmatterSchema = z.object({
  name: z.string()
    .regex(/^[\p{Ll}\p{N}-]+$/u, { message: "Name must be lowercase alphanumeric with hyphens" })
    .min(1, { message: "Name cannot be empty" }),
  description: z.string()
    .min(1, { message: "Description cannot be empty" }),
  license: z.string().optional(),
  "allowed-tools": z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.string()).optional()
});
```

### 전체 예시

```markdown
---
name: docker-deploy
description: Docker 이미지 빌드 및 배포 프로세스 자동화, 다중 환경 설정, 헬스 체크, 롤백 지원
license: MIT
allowed-tools:
  - read
  - write
  - bash
metadata:
  version: "2.1.0"
  author: "DevOps Team"
  category: "deployment"
---

# Docker 자동 배포

이 스킬은 Docker 이미지의 빌드, 푸시, 배포 프로세스를 자동화합니다.

## 사용 방법

...
```

---

## 흔한 실수 피하기

### 실수 1: 이름이 규칙에 맞지 않음

**잘못된 예시**:
```yaml
name: MyAwesomeSkill  # ❌ 대문자
```

**수정**:
```yaml
name: my-awesome-skill  # ✅ 소문자 + 하이픈
```

### 실수 2: 설명이 너무 모호함

**잘못된 예시**:
```yaml
description: "유용한 도구"  # ❌ 너무 모호함
```

**수정**:
```yaml
description: "Git 커밋 프로세스 자동화, 규칙에 맞는 커밋 메시지 자동 생성"  # ✅ 구체적이고 명확함
```

### 실수 3: 스크립트에 실행 권한 없음

**문제**: 스크립트가 실행 가능한 스크립트로 인식되지 않음

**해결**:
```bash
chmod +x tools/setup.sh
```

**확인**:
```bash
ls -l tools/setup.sh
# 다음과 같이 표시되어야 함: -rwxr-xr-x (x 권한 있음)
```

### 실수 4: 디렉토리 이름 충돌

**문제**: 여러 스킬이 동일한 이름 사용

**해결 방법**:
- 네임스페이스 사용 (플러그인 설정 또는 디렉토리 구조를 통해)
- 또는 더 설명적인 이름 사용

**소스 코드 참조**: `src/skills.ts:258-259`

```typescript
// 동일한 이름의 스킬은 첫 번째만 유지, 이후는 무시
if (skillsByName.has(skill.name)) {
  continue;
}
```

---

## 발견율 높이기

### 1. 설명 키워드 최적화

설명에 사용자가 검색할 수 있는 키워드 포함:

```yaml
---
name: code-reviewer
description: 자동화된 코드 리뷰 도구, 코드 품질, 잠재적 버그, 보안 취약점, 성능 문제 검사. JavaScript, TypeScript, Python 등 다양한 언어 지원.
---
```

키워드: 코드 리뷰, 코드 품질, 버그, 보안 취약점, 성능 문제, JavaScript, TypeScript, Python

### 2. 표준 스킬 위치 사용

플러그인은 다음 우선순위로 스킬을 발견합니다:

1. `.opencode/skills/` - 프로젝트 레벨 (최우선)
2. `.claude/skills/` - 프로젝트 레벨 Claude
3. `~/.config/opencode/skills/` - 사용자 레벨
4. `~/.claude/skills/` - 사용자 레벨 Claude

**권장 사항**:
- 프로젝트 특정 스킬 → 프로젝트 레벨에 배치
- 범용 스킬 → 사용자 레벨에 배치

### 3. 상세 문서 제공

SKILL.md 외에도 다음을 제공할 수 있습니다:
- `README.md` - 상세 설명 및 사용 예시
- `docs/guide.md` - 완전한 사용 가이드
- `docs/examples.md` - 실전 예시

---

## 요약

이 튜토리얼에서는 스킬 개발 모범 사례를 소개했습니다:

- **네이밍 규칙**: 소문자, 숫자, 하이픈 사용
- **설명 작성**: 구체화, 키워드 포함, 고유 가치 강조
- **디렉토리 구성**: 명확한 구조, 불필요한 디렉토리 건너뛰기
- **스크립트 사용**: 실행 권한 설정, 깊이 제한 주의
- **Frontmatter 규범**: 필수 및 선택 필드 올바르게 작성
- **실수 방지**: 흔한 문제와 해결 방법

이러한 모범 사례를 따르면 스킬이:
- ✅ 플러그인에서 올바르게 인식되고 로드됨
- ✅ 시맨틱 매칭 시 더 높은 추천 우선순위 획득
- ✅ 다른 스킬과의 충돌 방지
- ✅ 팀원들이 더 쉽게 이해하고 사용 가능

## 다음 단계

> 다음에는 **[API 도구 참조](../api-reference/)**를 학습합니다.
>
> 다루는 내용:
> - 모든 사용 가능한 도구의 상세 파라미터 설명
> - 도구 호출 예시와 반환값 형식
> - 고급 사용법과 주의사항

---

## 부록: 소스 코드 참조

<details>
<summary><strong>소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 기능 | 파일 경로 | 라인 번호 |
|---|---|---|
| 스킬 이름 검증 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L106-L108) | 106-108 |
| 스킬 설명 검증 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L109-L110) | 109-110 |
| Frontmatter Schema 정의 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| 건너뛰는 디렉토리 목록 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61) | 61 |
| 스크립트 실행 권한 검사 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| 동일 이름 스킬 중복 제거 로직 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L258-L259) | 258-259 |

**주요 상수**:
- 건너뛰는 디렉토리: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`

**주요 함수**:
- `findScripts(skillPath: string, maxDepth: number = 10)`: 스킬 디렉토리 내 실행 가능한 스크립트 재귀 검색
- `parseSkillFile(skillPath: string)`: SKILL.md 파싱 및 frontmatter 검증

</details>
