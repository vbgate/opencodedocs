---
title: "커스텀 Rules: 프로젝트 규범 구축 | Everything Claude Code"
subtitle: "커스텀 Rules: 프로젝트 규범 구축"
sidebarTitle: "Claude가 당신의 말을 듣게 하기"
description: "커스텀 Rules 파일 생성 방법을 배웁니다. Rule 형식, 체크리스트 작성, 보안 규칙 커스터마이징, Git 워크플로우 통합을 마스터하여 Claude가 팀 표준을 자동으로 준수하도록 합니다."
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# 커스텀 Rules: 프로젝트 전용 규범 구축

## 이 과정을 마치면 할 수 있는 것

- 커스텀 Rules 파일을 생성하여 프로젝트 전용 코딩 규범 정의
- 체크리스트를 사용하여 코드 품질 일관성 보장
- 팀 규범을 Claude Code 워크플로우에 통합
- 프로젝트 요구사항에 따라 다양한 유형의 규칙 커스터마이징

## 현재 겪고 있는 어려움

이런 문제를 겪어본 적 있나요?

- 팀원들의 코드 스타일이 일관되지 않아 리뷰할 때 같은 문제를 반복해서 지적
- 프로젝트에 특별한 보안 요구사항이 있지만 Claude가 이를 모름
- 코드를 작성할 때마다 팀 규범을 따랐는지 수동으로 확인해야 함
- Claude가 프로젝트 특정 모범 사례를 자동으로 알려주길 원함

## 언제 이 방법을 사용하나요

- **새 프로젝트 초기화 시** - 프로젝트 전용 코딩 규범과 보안 표준 정의
- **팀 협업 시** - 코드 스타일과 품질 표준 통일
- **코드 리뷰에서 자주 문제가 발견된 후** - 일반적인 문제를 규칙으로 고정
- **프로젝트에 특별한 요구사항이 있을 때** - 업계 규범이나 기술 스택 특정 규칙 통합

## 핵심 개념

Rules는 프로젝트 규범의 강제 실행 레이어로, Claude가 당신이 정의한 표준을 자동으로 준수하게 합니다.

### Rules의 작동 메커니즘

Rules 파일은 `rules/` 디렉토리에 위치하며, Claude Code는 세션 시작 시 모든 규칙을 자동으로 로드합니다. 코드를 생성하거나 리뷰할 때마다 Claude는 이러한 규칙에 따라 검사를 수행합니다.

::: info Rules와 Skills의 차이점

- **Rules**: 모든 작업에 적용되는 강제 체크리스트 (예: 보안 검사, 코드 스타일)
- **Skills**: 특정 작업에 적용되는 워크플로우 정의 및 도메인 지식 (예: TDD 프로세스, 아키텍처 설계)

Rules는 "반드시 준수해야 하는" 제약이고, Skills는 "어떻게 하는지"에 대한 가이드입니다.
:::

### Rules의 파일 구조

각 Rule 파일은 표준 형식을 따릅니다:

```markdown
# 규칙 제목

## 규칙 카테고리
규칙 설명 텍스트...

### 체크리스트
- [ ] 검사 항목 1
- [ ] 검사 항목 2

### 코드 예시
올바른/잘못된 코드 비교...
```

## 따라하기

### 1단계: 내장 규칙 유형 이해하기

Everything Claude Code는 8가지 내장 규칙을 제공합니다. 먼저 이들의 기능을 이해하세요.

**왜 필요한가요**

내장 규칙을 이해하면 커스터마이징이 필요한 내용을 파악하고 중복 작업을 피할 수 있습니다.

**내장 규칙 확인하기**

소스 코드의 `rules/` 디렉토리에서 확인하세요:

```bash
ls rules/
```

다음 8개의 규칙 파일을 볼 수 있습니다:

| 규칙 파일 | 용도 | 적용 시나리오 |
| --- | --- | --- |
| `security.md` | 보안 검사 | API 키, 사용자 입력, 데이터베이스 작업 관련 |
| `coding-style.md` | 코드 스타일 | 함수 크기, 파일 구성, 불변 패턴 |
| `testing.md` | 테스트 요구사항 | 테스트 커버리지, TDD 프로세스, 테스트 유형 |
| `performance.md` | 성능 최적화 | 모델 선택, 컨텍스트 관리, 압축 전략 |
| `agents.md` | Agent 사용 | 언제 어떤 agent를 사용할지, 병렬 실행 |
| `git-workflow.md` | Git 워크플로우 | 커밋 형식, PR 프로세스, 브랜치 관리 |
| `patterns.md` | 디자인 패턴 | Repository 패턴, API 응답 형식, 스켈레톤 프로젝트 |
| `hooks.md` | Hooks 시스템 | Hook 유형, 자동 승인 권한, TodoWrite |

**확인해야 할 것**:
- 각 규칙 파일에 명확한 제목과 분류가 있음
- 규칙에 체크리스트와 코드 예시가 포함됨
- 규칙이 특정 시나리오와 기술 요구사항에 적용됨

### 2단계: 커스텀 규칙 파일 생성하기

프로젝트의 `rules/` 디렉토리에 새 규칙 파일을 생성합니다.

**왜 필요한가요**

커스텀 규칙은 프로젝트 고유의 문제를 해결하고 Claude가 팀 규범을 준수하게 합니다.

**규칙 파일 생성하기**

프로젝트가 Next.js와 Tailwind CSS를 사용하고 프론트엔드 컴포넌트 규범을 정의해야 한다고 가정합니다:

```bash
# 규칙 파일 생성
touch rules/frontend-conventions.md
```

**규칙 파일 편집하기**

`rules/frontend-conventions.md`를 열고 다음 내용을 추가합니다:

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**확인해야 할 것**:
- 규칙 파일이 표준 Markdown 형식을 사용함
- 명확한 제목과 분류 (##)
- 코드 예시 비교 (CORRECT vs WRONG)
- 체크리스트 (checkbox)
- 규칙 설명이 간결하고 명확함

### 3단계: 보안 관련 커스텀 규칙 정의하기

프로젝트에 특별한 보안 요구사항이 있다면 전용 보안 규칙을 생성합니다.

**왜 필요한가요**

내장된 `security.md`에는 일반적인 보안 검사가 포함되어 있지만, 프로젝트에는 특정 보안 요구사항이 있을 수 있습니다.

**프로젝트 보안 규칙 생성하기**

`rules/project-security.md`를 생성합니다:

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**확인해야 할 것**:
- 규칙이 프로젝트 특정 기술 스택을 대상으로 함 (JWT, Zod)
- 코드 예시가 올바른 구현과 잘못된 구현을 보여줌
- 체크리스트가 모든 보안 검사 항목을 포함함

### 4단계: 프로젝트 특정 Git 워크플로우 규칙 정의하기

팀에 특별한 Git 커밋 규범이 있다면 `git-workflow.md`를 확장하거나 커스텀 규칙을 생성할 수 있습니다.

**왜 필요한가요**

내장된 `git-workflow.md`에는 기본 커밋 형식이 포함되어 있지만, 팀에는 추가 요구사항이 있을 수 있습니다.

**Git 규칙 생성하기**

`rules/team-git-workflow.md`를 생성합니다:

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: 

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist

Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**확인해야 할 것**:
- Git 커밋 형식에 팀 커스텀 유형 (`team`)이 포함됨
- commit scope가 필수로 요구됨
- PR에 명확한 체크리스트가 있음
- 규칙이 팀 협업 프로세스에 적용됨

### 5단계: Rules 로드 확인하기

규칙을 생성한 후 Claude Code가 올바르게 로드하는지 확인합니다.

**왜 필요한가요**

규칙 파일 형식이 올바르고 Claude가 규칙을 읽고 적용할 수 있는지 확인합니다.

**확인 방법**

1. 새 Claude Code 세션 시작
2. Claude에게 로드된 규칙을 확인하도록 요청:
   ```
   어떤 Rules 파일이 로드되었나요?
   ```

3. 규칙이 적용되는지 테스트:
   ```
   frontend-conventions 규칙을 따르는 React 컴포넌트를 생성해주세요
   ```

**확인해야 할 것**:
- Claude가 로드된 모든 rules를 나열함 (커스텀 규칙 포함)
- 생성된 코드가 정의한 규범을 따름
- 규칙을 위반하면 Claude가 수정을 제안함

### 6단계: 코드 리뷰 프로세스에 통합하기

커스텀 규칙이 코드 리뷰 시 자동으로 검사되도록 합니다.

**왜 필요한가요**

코드 리뷰 시 규칙을 자동으로 적용하여 모든 코드가 표준을 준수하도록 보장합니다.

**code-reviewer가 규칙을 참조하도록 구성하기**

`agents/code-reviewer.md`가 관련 규칙을 참조하는지 확인합니다:

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**확인해야 할 것**:
- code-reviewer agent가 리뷰 시 모든 관련 규칙을 검사함
- 보고서가 심각도별로 분류됨
- 프로젝트 특정 규범이 리뷰 프로세스에 포함됨

## 체크포인트 ✅

- [ ] 최소 하나의 커스텀 규칙 파일을 생성함
- [ ] 규칙 파일이 표준 형식을 따름 (제목, 분류, 코드 예시, 체크리스트)
- [ ] 규칙에 올바른/잘못된 코드 비교 예시가 포함됨
- [ ] 규칙 파일이 `rules/` 디렉토리에 위치함
- [ ] Claude Code가 규칙을 올바르게 로드하는지 확인함
- [ ] code-reviewer agent가 커스텀 규칙을 참조함

## 주의사항

### ❌ 흔한 실수 1: 규칙 파일 이름이 규범에 맞지 않음

**문제**: 규칙 파일 이름에 공백이나 특수 문자가 포함되어 Claude가 로드하지 못함.

**수정**:
- ✅ 올바름: `frontend-conventions.md`, `project-security.md`
- ❌ 잘못됨: `Frontend Conventions.md`, `project-security(v2).md`

소문자와 하이픈을 사용하고 공백과 괄호를 피하세요.

### ❌ 흔한 실수 2: 규칙이 너무 광범위함

**문제**: 규칙 설명이 모호하여 준수 여부를 명확히 판단할 수 없음.

**수정**: 구체적인 체크리스트와 코드 예시를 제공하세요:

```markdown
❌ 모호한 규칙: 컴포넌트는 간결하고 읽기 쉬워야 함

✅ 구체적인 규칙:
- 컴포넌트는 300줄 미만이어야 함
- 함수는 50줄 미만이어야 함
- 4단계 이상의 중첩 금지
```

### ❌ 흔한 실수 3: 코드 예시 누락

**문제**: 텍스트 설명만 있고 올바른 구현과 잘못된 구현을 보여주지 않음.

**수정**: 항상 코드 예시 비교를 포함하세요:

```markdown
CORRECT: 규범 준수
function example() { ... }

WRONG: 규범 위반
function example() { ... }
```

### ❌ 흔한 실수 4: 체크리스트가 불완전함

**문제**: 체크리스트에 핵심 검사 항목이 누락되어 규칙이 완전히 실행되지 않음.

**수정**: 규칙 설명의 모든 측면을 포함하세요:

```markdown
체크리스트:
- [ ] 검사 항목 1
- [ ] 검사 항목 2
- [ ] ... (모든 규칙 요점 포함)
```

## 이 과정 요약

커스텀 Rules는 프로젝트 표준화의 핵심입니다:

1. **내장 규칙 이해** - 8가지 표준 규칙이 일반적인 시나리오를 포함
2. **규칙 파일 생성** - 표준 Markdown 형식 사용
3. **프로젝트 규범 정의** - 기술 스택과 팀 요구사항에 맞게 커스터마이징
4. **로드 확인** - Claude가 규칙을 올바르게 읽는지 확인
5. **리뷰 프로세스 통합** - code-reviewer가 규칙을 자동으로 검사하도록 함

커스텀 Rules를 통해 Claude가 프로젝트 규범을 자동으로 준수하게 하여 코드 리뷰 작업량을 줄이고 코드 품질 일관성을 높일 수 있습니다.

## 다음 과정 예고

> 다음 과정에서는 **[동적 컨텍스트 주입: Contexts 사용법](../dynamic-contexts/)**을 배웁니다.
>
> 배울 내용:
> - Contexts의 정의와 용도
> - 커스텀 Contexts 생성 방법
> - 다양한 작업 모드에서 Contexts 전환
> - Contexts와 Rules의 차이점

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 줄 번호 |
| --- | --- | --- |
| 보안 규칙 | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| 코드 스타일 규칙 | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| 테스트 규칙 | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| 성능 최적화 규칙 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Agent 사용 규칙 | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Git 워크플로우 규칙 | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| 디자인 패턴 규칙 | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks 시스템 규칙 | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**주요 상수**:
- `MIN_TEST_COVERAGE = 80`: 최소 테스트 커버리지 요구사항
- `MAX_FILE_SIZE = 800`: 최대 파일 줄 수 제한
- `MAX_FUNCTION_SIZE = 50`: 최대 함수 줄 수 제한
- `MAX_NESTING_LEVEL = 4`: 최대 중첩 레벨

**주요 규칙**:
- **Immutability (CRITICAL)**: 객체 직접 수정 금지, spread 연산자 사용
- **Secret Management**: 하드코딩된 키 금지, 환경 변수 사용
- **TDD Workflow**: 테스트 먼저 작성, 구현, 리팩토링 순서 요구
- **Model Selection**: 작업 복잡도에 따라 Haiku/Sonnet/Opus 선택

</details>
