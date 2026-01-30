---
title: "보안 메커니즘: 경로 보호 및 검증 | opencode-agent-skills"
sidebarTitle: "보안 메커니즘"
subtitle: "보안 메커니즘: 경로 보호 및 검증"
description: "OpenCode Agent Skills 플러그인의 보안 메커니즘에 대해 알아보세요. 경로 보호, YAML 파싱, 입력 검증 및 스크립트 실행 보호 등 보안 기능을 파악하고 스킬 플러그인을 안전하게 사용하세요."
tags:
  - 보안
  - 모범 사례
  - FAQ
prerequisite: []
order: 2
---

# 보안 안내

## 학습 후 달성 가능한 목표

- 플러그인이 시스템을 보안 위협으로부터 어떻게 보호하는지 이해하기
- 스킬 파일이 따라야 할 보안 규범 파악하기
- 플러그인 사용 시 보안 모범 사례 익히기

## 핵심 개념

OpenCode Agent Skills 플러그인은 로컬 환경에서 실행되며 스크립트를 실행하고 파일을 읽으며 설정을 파싱합니다. 강력하지만, 스킬 파일이 신뢰할 수 없는 출처에서 온 것이라면 보안 위험이 발생할 수 있습니다.

플러그인 설계 시 경로 접근, 파일 파싱부터 스크립트 실행까지 다층 보안 메커니즘을 내장했습니다. 이러한 메커니즘을 이해하면 플러그인을 더 안전하게 사용할 수 있습니다.

## 보안 메커니즘 상세 설명

### 1. 경로 보안 검사: 디렉토리 트래버설 방지

**문제**: 스킬 파일에 악성 경로(예: `../../etc/passwd`)가 포함되어 있으면 시스템 민감 파일에 접근할 수 있습니다.

**보호 조치**:

플러그인은 `isPathSafe()` 함수(`src/utils.ts:130-133`)를 사용하여 모든 파일 접근이 스킬 디렉토리 내에서 제한되도록 보장합니다:

```typescript
export function isPathSafe(basePath: string, requestedPath: string): boolean {
  const resolved = path.resolve(basePath, requestedPath);
  return resolved.startsWith(basePath + path.sep) || resolved === basePath;
}
```

**작동 원리**:
1. 요청 경로를 절대 경로로 변환
2. 변환된 경로가 스킬 디렉토리로 시작하는지 확인
3. 경로가 스킬 디렉토리를 벗어나려는 시도(`..` 포함)가 있으면 즉시 거부

**실제 사례**:

`read_skill_file` 도구가 파일을 읽을 때(`src/tools.ts:101-103`) 먼저 `isPathSafe`를 호출합니다:

```typescript
// Security: ensure path doesn't escape skill directory
if (!isPathSafe(skill.path, args.filename)) {
  return `Invalid path: cannot access files outside skill directory.`;
}
```

이는 다음을 의미합니다:
- ✅ `docs/guide.md` → 허용(스킬 디렉토리 내)
- ❌ `../../../etc/passwd` → 거부(시스템 파일 접근 시도)
- ❌ `/etc/passwd` → 거부(절대 경로)

::: info 왜 이것이 중요한가
경로 트래버설 공격은 웹 애플리케이션의 일반적인 취약점입니다. 플러그인이 로컬에서 실행되더라도 신뢰할 수 없는 스킬이 SSH 키, 프로젝트 설정 등 민감한 파일에 접근하려고 할 수 있습니다.
:::

### 2. YAML 보안 파싱: 코드 실행 방지

**문제**: YAML은 사용자 정의 태그와 복잡한 객체를 지원하며, 악성 YAML이 태그를 통해 코드를 실행할 수 있습니다(예: `!!js/function`).

**보호 조치**:

플러그인은 `parseYamlFrontmatter()` 함수(`src/utils.ts:41-49`)를 사용하여 엄격한 YAML 파싱 전략을 채택합니다:

```typescript
export function parseYamlFrontmatter(text: string): Record<string, unknown> {
  try {
    const result = YAML.parse(text, {
      // Use core schema which only supports basic JSON-compatible types
      // This prevents custom tags that could execute code
      schema: "core",
      // Limit recursion depth to prevent DoS attacks
      maxAliasCount: 100,
    });
    return typeof result === "object" && result !== null
      ? (result as Record<string, unknown>)
      : {};
  } catch {
    return {};
  }
}
```

**핵심 보안 설정**:

| 설정 | 역할 |
| --- | --- |
| `schema: "core"` | 기본 JSON 유형(문자열, 숫자, 불리언, 배열, 객체)만 지원하고 사용자 정의 태그 비활성화 |
| `maxAliasCount: 100` | YAML 별칭 재귀 깊이를 제한하여 DoS 공격 방지 |

**실제 사례**:

```yaml
# 악성 YAML 예시(core schema에서 거부됨)
---
!!js/function >
function () { return "malicious code" }
---

# 올바른 안전한 형식
---
name: my-skill
description: A safe skill description
---
```

YAML 파싱이 실패하면 플러그인은 해당 스킬을 자동으로 건너뛰고 다른 스킬을 계속 탐색합니다(`src/skills.ts:142-145`):

```typescript
let frontmatterObj: unknown;
try {
  frontmatterObj = parseYamlFrontmatter(frontmatterText);
} catch {
  return null;  // 파싱 실패, 이 스킬 건너뛰기
}
```

### 3. 입력 검증: Zod Schema 엄격 검사

**문제**: 스킬의 frontmatter 필드가 규격에 맞지 않으면 플러그인 동작에 이상이 발생할 수 있습니다.

**보호 조치**:

플러그인은 frontmatter를 엄격하게 검증하기 위해 Zod Schema(`src/skills.ts:105-114`)를 사용합니다:

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

**검증 규칙**:

| 필드 | 규칙 | 거부 예시 |
| --- | --- | --- |
| `name` | 소문자, 숫자, 하이픈, 빈 값 불가 | `MySkill`(대문자), `my skill`(공백) |
| `description` | 빈 값 불가 | `""`(빈 문자열) |
| `license` | 선택적 문자열 | - |
| `allowed-tools` | 선택적 문자열 배열 | `[123]`(비문자열) |
| `metadata` | 선택적 키-값 객체(값은 문자열) | `{key: 123}`(값이 문자열 아님) |

**실제 사례**:

```yaml
# ❌ 오류: name에 대문자 포함
---
name: GitHelper
description: Git operations helper
---

# ✅ 올바른: 규격 준수
---
name: git-helper
description: Git operations helper
---
```

검증에 실패하면 플러그인은 해당 스킬을 건너뜁니다(`src/skills.ts:147-152`):

```typescript
let frontmatter: SkillFrontmatter;
try {
  frontmatter = SkillFrontmatterSchema.parse(frontmatterObj);
} catch (error) {
  return null;  // 검증 실패, 이 스킬 건너뛰기
}
```

### 4. 스크립트 실행 보안: 실행 파일만 실행

**문제**: 플러그인이 임의 파일(설정 파일, 문서 등)을 실행하면 예상치 못한 결과가 발생할 수 있습니다.

**보호 조치**:

플러그인이 스크립트를 탐색할 때(`src/skills.ts:59-99`) 실행 권한이 있는 파일만 수집합니다:

```typescript
async function findScripts(skillPath: string, maxDepth: number = 10): Promise<Script[]> {
  const scripts: Script[] = [];
  const skipDirs = new Set(['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']);

  // ... 재귀 탐색 로직 ...

  if (stats.isFile()) {
    // 핵심: 실행 비트 파일만 수집
    if (stats.mode & 0o111) {
      scripts.push({
        relativePath: newRelPath,
        absolutePath: fullPath
      });
    }
  }
  // ...
}
```

**보안 특성**:

| 검사 메커니즘 | 역할 |
| --- | --- |
| **실행 비트 검사**(`stats.mode & 0o111`) | 사용자가 명시적으로 실행 가능으로 표시한 파일만 실행하여 문서나 설정의 실수로 인한 실행 방지 |
| **숨겨진 디렉토리 건너뛰기**(`entry.name.startsWith('.')`) | `.git`, `.vscode` 등 숨겨진 디렉토리를 스캔하지 않아 불필요한 파일 스캔 방지 |
| **종속 디렉토리 건너뛰기**(`skipDirs.has(entry.name)`) | `node_modules`, `__pycache__` 등을 건너뛰어 서드파티 종속 스캔 방지 |
| **재귀 깊이 제한**(`maxDepth: 10`) | 재귀 깊이를 10层으로 제한하여 악성 스킬의 깊은 디렉토리로 인한 성능 문제 방지 |

**실제 사례**:

스킬 디렉토리에서:

```bash
my-skill/
├── SKILL.md
├── deploy.sh          # ✓ 실행 가능(스크립트로 인식됨)
├── build.sh           # ✓ 실행 가능(스크립트로 인식됨)
├── README.md          # ✗ 실행 불가(스크립트로 인식되지 않음)
├── config.json        # ✗ 실행 불가(스크립트로 인식되지 않음)
└── node_modules/      # ✗ 건너뛰기(종속 디렉토리)
    └── ...           # ✗ 건너뛰기
```

`run_skill_script("my-skill", "README.md")`를 호출하면 README.md에 실행 권한이 없어 스크립트로 인식되지 않으며(`src/skills.ts:86`) 결과적으로 "찾을 수 없음" 오류를 반환합니다(`src/tools.ts:165-177`).

## 보안 모범 사례

### 1. 신뢰할 수 있는 출처에서 스킬获取

- ✓ 공식 스킬 저장소 또는 신뢰할 수 있는 개발자 사용
- ✓ 스킬의 GitHub Star 수와 기여자 활동 확인
- ✗ 출처 불명의 스킬을 임의로 다운로드하여 실행하지 않기

### 2. 스킬 내용 검토

새 스킬을 로드하기 전에 SKILL.md와 스크립트 파일을 빠르게 검토하세요:

```bash
# 스킬 설명 및 메타데이터 확인
cat .opencode/skills/skill-name/SKILL.md

# 스크립트 내용 확인
cat .opencode/skills/skill-name/scripts/*.sh
```

특히 다음을 확인하세요:
- 스크립트가 시스템 민감 경로(`/etc`, `~/.ssh`)에 접근하는지
- 스크립트가 외부 종속을 설치하는지
- 스크립트가 시스템 설정을 수정하는지

### 3. 스크립트 권한 올바르게 설정

실행이 필요한 파일에만 실행 권한을 추가합니다:

```bash
# 올바른: 스크립트에 실행 권한 추가
chmod +x .opencode/skills/my-skill/tools/deploy.sh

# 올바른: 문서는 기본 권한 유지(실행 불가)
# README.md, config.json 등은 실행할 필요 없음
```

### 4. 민감한 파일 숨기기

스킬 디렉토리에 민감 정보를 포함하지 마세요:

- ✗ `.env` 파일(API 키)
- ✗ `.pem` 파일(개인 키)
- ✗ `credentials.json`(인증 정보)
- ✓ 환경 변수 또는 외부 설정을 사용하여 민감한 데이터 관리

### 5. 프로젝트급 스킬이 사용자급 스킬을 덮어쓰기

스킬 탐색 우선순위(`src/skills.ts:241-246`):

1. `.opencode/skills/`(프로젝트급)
2. `.claude/skills/`(프로젝트급, Claude)
3. `~/.config/opencode/skills/`(사용자급)
4. `~/.claude/skills/`(사용자급, Claude)
5. `~/.claude/plugins/cache/`(플러그인 캐시)
6. `~/.claude/plugins/marketplaces/`(플러그인 마켓플레이스)

**모범 사례**:

- 프로젝트별 스킬은 `.opencode/skills/`에 배치하면 동일한 이름의 사용자급 스킬을 자동으로 덮어쓰기
- 공통 스킬은 `~/.config/opencode/skills/`에 배치하면 모든 프로젝트에서 사용 가능
- 신뢰할 수 없는 출처의 스pillars을 전역적으로 설치하는 것은 권장하지 않음

## 본 수업 요약

OpenCode Agent Skills 플러그인은 다층 보안防护을 내장했습니다:

| 보안 메커니즘 | 보호 대상 | 코드 위치 |
| --- | --- | --- |
| 경로 보안 검사 | 디렉토리 트래버설 방지, 파일 접근 범위 제한 | `utils.ts:130-133` |
| YAML 보안 파싱 | 악성 YAML의 코드 실행 방지 | `utils.ts:41-49` |
| Zod Schema 검증 | 스킬 frontmatter가 규격에 맞는지 확인 | `skills.ts:105-114` |
| 스크립트 실행 검사 | 사용자가 명시적으로 실행 가능으로 표시한 파일만 실행 | `skills.ts:86` |
| 디렉토리 건너뛰기 논리 | 숨겨진 디렉토리와 종속 디렉토리 스캔 방지 | `skills.ts:61, 70` |

기억하세요: 보안은 공동 책임입니다. 플러그인이防护 메커니즘을 제공하지만 최종 결정권은 당신에게 있습니다. 신뢰할 수 있는 출처의 스킬만 사용하고 코드를 검토하는 습관을 들이세요.

## 다음 수업 예고

> 다음 수업에서는 **[스킬 개발 모범 사례](../../appendix/best-practices/)**를 학습합니다.
>
> 다음을 다룹니다:
> - 명명 규범 및 설명 작성 팁
> - 디렉토리 조직 및 스크립트 사용 방법
> - Frontmatter 모범 사례
> - 일반적인 오류 방지 방법

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-24

| 보안 메커니즘 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| 경로 보안 검사 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L130-L133) | 130-133 |
| YAML 보안 파싱 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L41-L56) | 41-56 |
| Zod Schema 검증 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L105-L114) | 105-114 |
| 스크립트 실행 검사 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L86) | 86 |
| 디렉토리 건너뛰기 논리 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L61-L70) | 61, 70 |
| 도구에서의 경로 보안 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L101-L103) | 101-103 |

**핵심 함수**:
- `isPathSafe(basePath, requestedPath)`: 경로가 안전한지 검증하여 디렉토리 트래버설 방지
- `parseYamlFrontmatter(text)`: core schema 및 재귀 제한을 사용하여 YAML 안전하게 파싱
- `SkillFrontmatterSchema`: 스킬 frontmatter 필드를 검증하는 Zod schema
- `findScripts(skillPath, maxDepth)`: 숨겨진 디렉토리와 종속 디렉토리를 건너뛰며 실행 가능한 스크립트를 재귀적으로 탐색

**핵심 상수**:
- `maxAliasCount: 100`: YAML 파싱의 최대 별칭 수, DoS 공격 방지
- `maxDepth: 10`: 스크립트 탐색의 최대 재귀 깊이
- `0o111`: 실행 비트 마스크(파일이 실행 가능한지 확인)

</details>
