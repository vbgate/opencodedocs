---
title: "API 참조: 명령어와 타입 | Agent Skills"
sidebarTitle: "명령어와 타입 조회"
subtitle: "API 참조: 명령어와 타입"
description: "Agent Skills의 빌드 명령어와 타입 정의를 참조하세요. pnpm 도구체인, TypeScript 인터페이스, SKILL.md 템플릿, Impact 열거값을 포함합니다."
tags:
  - "참조"
  - "API"
  - "CLI"
  - "타입 정의"
order: 120
prerequisite: []
---

# API와 명령어 참조

이 페이지는 Agent Skills의 전체 API와 명령어 참조를 제공하며, 빌드 도구체인 명령어, TypeScript 타입 정의, SKILL.md 템플릿 형식, 영향 레벨 열거값을 포함합니다.

## TypeScript 타입 정의

### ImpactLevel (영향 레벨)

영향 레벨은 규칙의 성능 영향 정도를 식별하는 데 사용되며, 6개 레벨이 있습니다:

| 값 | 설명 | 적용 시나리오 |
| --- | --- | --- |
| `CRITICAL` | 치명적 병목 | 반드시 수정해야 하며, 그렇지 않으면 사용자 경험에 심각한 영향을 미침 (예: 폭포수 요청, 최적화되지 않은 번들 크기) |
| `HIGH` | 중요한 개선 | 성능을 크게 향상시킴 (예: 서버 캐싱, 중복 props 제거) |
| `MEDIUM-HIGH` | 중높은 우선순위 | 눈에 띄는 성능 향상 (예: 데이터 가져오기 최적화) |
| `MEDIUM` | 중등 개선 | 측정 가능한 성능 향상 (예: Memo 최적화, Re-render 감소) |
| `LOW-MEDIUM` | 낮중 우선순위 | 약간의 성능 향상 (예: 렌더링 최적화) |
| `LOW` | 점진적 개선 | 미세 최적화 (예: 코드 스타일, 고급 패턴) |

**소스 위치**: `types.ts:5`

### CodeExample (코드 예제)

규칙 내 코드 예제 구조:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `label` | string | ✅ | 예제 레이블 (예: "Incorrect", "Correct") |
| `description` | string | ❌ | 레이블 설명 (선택사항) |
| `code` | string | ✅ | 코드 내용 |
| `language` | string | ❌ | 코드 언어 (기본값 'typescript') |
| `additionalText` | string | ❌ | 추가 설명 (선택사항) |

**소스 위치**: `types.ts:7-13`

### Rule (규칙)

단일 성능 최적화 규칙의 완전한 구조:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 규칙 ID (자동 생성, 예: "1.1", "2.3") |
| `title` | string | ✅ | 규칙 제목 |
| `section` | number | ✅ | 소속 섹션 (1-8) |
| `subsection` | number | ❌ | 하위 섹션 번호 (자동 생성) |
| `impact` | ImpactLevel | ✅ | 영향 레벨 |
| `impactDescription` | string | ❌ | 영향 설명 (예: "2-10× improvement") |
| `explanation` | string | ✅ | 규칙 설명 |
| `examples` | CodeExample[] | ✅ | 코드 예제 배열 (최소 1개) |
| `references` | string[] | ❌ | 참조 링크 |
| `tags` | string[] | ❌ | 태그 (검색용) |

**소스 위치**: `types.ts:15-26`

### Section (섹션)

규칙 섹션 구조:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `number` | number | ✅ | 섹션 번호 (1-8) |
| `title` | string | ✅ | 섹션 제목 |
| `impact` | ImpactLevel | ✅ | 전체 영향 레벨 |
| `impactDescription` | string | ❌ | 영향 설명 |
| `introduction` | string | ❌ | 섹션 소개 |
| `rules` | Rule[] | ✅ | 포함된 규칙 배열 |

**소스 위치**: `types.ts:28-35`

### GuidelinesDocument (가이드 문서)

완전한 가이드 문서 구조:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `version` | string | ✅ | 버전 번호 |
| `organization` | string | ✅ | 조직 이름 |
| `date` | string | ✅ | 날짜 |
| `abstract` | string | ✅ | 요약 |
| `sections` | Section[] | ✅ | 섹션 배열 |
| `references` | string[] | ❌ | 참조 문헌 |

**소스 위치**: `types.ts:37-44`

### TestCase (테스트 케이스)

규칙에서 추출한 테스트 케이스 구조:

| 필드 | 타입 | 필수 | 설명 |
| --- | --- | --- | --- |
| `ruleId` | string | ✅ | 규칙 ID |
| `ruleTitle` | string | ✅ | 규칙 제목 |
| `type` | 'bad' \| 'good' | ✅ | 테스트 케이스 타입 |
| `code` | string | ✅ | 코드 내용 |
| `language` | string | ✅ | 코드 언어 |
| `description` | string | ❌ | 설명 |

**소스 위치**: `types.ts:46-53`

## 빌드 도구체인 명령어

### pnpm build

규칙 문서를 빌드하고 테스트 케이스를 추출합니다.

**명령어**:
```bash
pnpm build
```

**기능**:
1. 모든 규칙 파일(`rules/*.md`)을 파싱
2. 섹션별로 그룹화 및 정렬
3. `AGENTS.md` 완전한 가이드 생성
4. 테스트 케이스를 `test-cases.json`으로 추출

**출력**:
```bash
Processed 57 rules
Generated AGENTS.md
Extracted 114 test cases
```

**소스 위치**: `build.ts`

### pnpm build --upgrade-version

빌드하고 자동으로 버전 번호를 업그레이드합니다.

**명령어**:
```bash
pnpm build --upgrade-version
```

**기능**:
1. `pnpm build`의 모든 작업을 수행
2. `metadata.json`의 버전 번호를 자동으로 증가
   - 형식: `0.1.0` → `0.1.1`
   - 마지막 숫자 증가

**소스 위치**: `build.ts:19-24, 255-273`

### pnpm validate

모든 규칙 파일의 형식과 완전성을 검증합니다.

**명령어**:
```bash
pnpm validate
```

**검사 항목**:
- ✅ 규칙 제목 비어있지 않음
- ✅ 규칙 설명 비어있지 않음
- ✅ 최소 하나의 코드 예제 포함
- ✅ Bad/Incorrect 및 Good/Correct 예제 포함
- ✅ Impact 레벨 유효 (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

**성공 출력**:
```bash
✓ All 57 rules are valid
```

**실패 출력**:
```bash
✗ Validation failed

✖ [async-parallel.md]: Missing or empty title
   rules/async-parallel.md:2

2 errors found
```

**소스 위치**: `validate.ts`

### pnpm extract-tests

규칙에서 테스트 케이스를 추출합니다.

**명령어**:
```bash
pnpm extract-tests
```

**기능**:
1. 모든 규칙 파일을 읽기
2. `Bad/Incorrect` 및 `Good/Correct` 예제 추출
3. `test-cases.json` 파일 생성

**출력**:
```bash
Extracted 114 test cases (57 bad, 57 good)
```

**소스 위치**: `extract-tests.ts`

### pnpm dev

개발 워크플로우 (빌드 + 검증).

**명령어**:
```bash
pnpm dev
```

**기능**:
1. `pnpm build`를 실행
2. `pnpm validate`를 실행
3. 개발 시 규칙 형식이 올바른지 확인

**적용 시나리오**:
- 새 규칙 작성 후 검증
- 규칙 수정 후 완전성 검사

**소스 위치**: `package.json:12`

## SKILL.md 템플릿

### Claude.ai Skill 정의 템플릿

각 Claude.ai Skill은 `SKILL.md` 파일을 포함해야 합니다:

```markdown
---
name: {skill-name}
description: {이 스킬을 사용할 때를 설명하는 한 문장. "Deploy my app", "Check logs" 등의 트리거 문구를 포함하세요.}
---

# {Skill 제목}

{스킬이 하는 일에 대한 간략한 설명.}

## How It Works

{스킬의 워크플로우를 설명하는 번호 목록}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - 설명 (기본값은 X)

**Examples:**
{2-3가지 일반적인 사용 패턴을 보여주세요}

## Output

{사용자가 볼 출력 결과 예시}

## Present Results to User

{결과를 사용자에게 표시할 때 Claude가 사용해야 할 형식 템플릿}

## Troubleshooting

{일반적인 문제와 해결책, 특히 네트워크/권한 오류}
```

**소스 위치**: `AGENTS.md:29-69`

### 필수 필드 설명

| 필드 | 설명 | 예시 |
| --- | --- | --- |
| `name` | Skill 이름 (디렉토리명) | `vercel-deploy` |
| `description` | 한 문장 설명, 트리거 문구 포함 | `Deploy applications to Vercel when user requests "Deploy my app"` |
| `title` | Skill 제목 | `Vercel Deploy` |
| `How It Works` | 워크플로우 설명 | 번호 목록, 4-6 단계 설명 |
| `Usage` | 사용법 | 명령줄 예시와 매개변수 설명 |
| `Output` | 출력 예시 | 사용자가 보게 될 결과 |
| `Present Results to User` | 결과 형식화 템플릿 | Claude가 결과를 표시할 때의 표준 형식 |

**소스 위치**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md`

## Impact 레벨 매핑 규칙

### 규칙 파일명 접두어 → 섹션 → 레벨

| 파일 접두어 | 섹션 번호 | 섹션 제목 | 기본 레벨 |
| --- | --- | --- | --- |
| `async-` | 1 | 폭포 제거 | CRITICAL |
| `bundle-` | 2 | 번들 최적화 | CRITICAL |
| `server-` | 3 | 서버 성능 | HIGH |
| `client-` | 4 | 클라이언트 데이터 가져오기 | MEDIUM-HIGH |
| `rerender-` | 5 | Re-render 최적화 | MEDIUM |
| `rendering-` | 6 | 렌더링 성능 | MEDIUM |
| `js-` | 7 | JavaScript 성능 | LOW-MEDIUM |
| `advanced-` | 8 | 고급 패턴 | LOW |

### 예시 파일

| 파일명 | 자동 유추 섹션 | 자동 유추 레벨 |
| --- | --- | --- |
| `async-parallel.md` | 1 (폭포 제거) | CRITICAL |
| `bundle-dynamic-imports.md` | 2 (번들 최적화) | CRITICAL |
| `server-cache-react.md` | 3 (서버 성능) | HIGH |
| `rerender-memo.md` | 5 (Re-render 최적화) | MEDIUM |

**소스 위치**: `parser.ts:201-210`

## 배포 명령어 참조

### bash deploy.sh [path]

Vercel 배포 스크립트 명령어.

**명령어**:
```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**매개변수**:
- `path` - 배포 디렉토리 또는 `.tgz` 파일 (기본값 현재 디렉토리)

**예시**:
```bash
# 현재 디렉토리 배포
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh

# 지정된 프로젝트 배포
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project

# 기존 tarball 배포
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project.tgz
```

**출력 형식**:
- **사람이 읽을 수 있음** (stderr): 미리보기 URL 및 소유권 이전 링크
- **JSON** (stdout): 구조화된 데이터 (deploymentId, projectId 포함)

**소스 위치**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md:20-65`

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 행 번호 |
| --- | --- | --- |
| ImpactLevel 타입 | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5) | 5 |
| CodeExample 인터페이스 | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13) | 7-13 |
| Rule 인터페이스 | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L15-L26) | 15-26 |
| Section 인터페이스 | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L28-L35) | 28-35 |
| GuidelinesDocument 인터페이스 | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L37-L44) | 37-44 |
| TestCase 인터페이스 | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L46-L53) | 46-53 |
| build.ts 명령줄 인자 | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L12-L14) | 12-14 |
| 빌드 스크립트 버전 업그레이드 로직 | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L19-L24) | 19-24 |
| validate.ts 검증 로직 | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66) | 21-66 |
| 규칙 템플릿 파일 | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | 전체 |
| SKILL.md 템플릿 형식 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L31-L69) | 31-69 |
| Vercel Deploy SKILL | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 전체 |
| 파일 접두어 매핑 | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts#L201-L210) | 201-210 |

**핵심 상수**:
- `ImpactLevel` 열거: `'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**핵심 함수**:
- `incrementVersion(version: string)`: 버전 번호 증가 (build.ts)
- `generateMarkdown(sections, metadata)`: AGENTS.md 생성 (build.ts)
- `validateRule(rule, file)`: 규칙 완전성 검증 (validate.ts)

</details>
