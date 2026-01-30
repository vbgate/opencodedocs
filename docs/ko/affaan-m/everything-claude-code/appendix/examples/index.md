---
title: "예제 설정: 프로젝트 및 사용자 수준 설정 | Everything Claude Code"
sidebarTitle: "프로젝트 설정 빠른 가이드"
subtitle: "예제 설정: 프로젝트 및 사용자 수준 설정"
description: "Everything Claude Code 설정 파일 사용법을 배웁니다. 프로젝트 수준 CLAUDE.md와 사용자 수준 설정, 설정 계층, 핵심 필드, 커스텀 상태 표시줄 설정을 마스터하고, 프론트엔드, 백엔드, 풀스택 프로젝트에 맞게 설정을 조정하여 빠르게 시작하세요."
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# 예제 설정: 프로젝트 및 사용자 수준 설정

## 이 강의를 마치면 할 수 있는 것

- 프로젝트에 CLAUDE.md 파일을 빠르게 설정
- 사용자 수준 전역 설정으로 개발 효율성 향상
- 상태 표시줄을 커스터마이징하여 핵심 정보 표시
- 프로젝트 요구사항에 맞게 설정 템플릿 조정

## 현재 겪고 있는 어려움

Everything Claude Code 설정 파일을 마주하면 다음과 같은 고민이 생길 수 있습니다:

- **어디서부터 시작해야 할지 모르겠다**: 프로젝트 수준과 사용자 수준 설정의 차이점은? 각각 어디에 저장하나요?
- **설정 파일이 너무 길다**: CLAUDE.md에 어떤 내용을 작성해야 하나요? 필수 항목은 무엇인가요?
- **상태 표시줄이 부족하다**: 더 유용한 정보를 표시하도록 상태 표시줄을 어떻게 커스터마이징하나요?
- **커스터마이징 방법을 모르겠다**: 예제 설정을 프로젝트 요구사항에 맞게 어떻게 조정하나요?

이 문서는 Everything Claude Code를 빠르게 시작할 수 있도록 완전한 설정 예제를 제공합니다.

---

## 설정 계층 개요

Everything Claude Code는 두 가지 설정 계층을 지원합니다:

| 설정 유형 | 위치 | 적용 범위 | 일반적인 용도 |
| --- | --- | --- | --- |
| **프로젝트 수준 설정** | 프로젝트 루트 디렉토리 `CLAUDE.md` | 현재 프로젝트만 | 프로젝트별 규칙, 기술 스택, 파일 구조 |
| **사용자 수준 설정** | `~/.claude/CLAUDE.md` | 모든 프로젝트 | 개인 코딩 선호도, 공통 규칙, 에디터 설정 |

::: tip 설정 우선순위

프로젝트 수준과 사용자 수준 설정이 동시에 존재할 때:
- **규칙 중첩**: 두 설정 모두 적용됩니다
- **충돌 처리**: 프로젝트 수준 설정이 사용자 수준 설정보다 우선합니다
- **권장 사항**: 사용자 수준 설정에는 공통 규칙을, 프로젝트 수준 설정에는 프로젝트별 규칙을 배치하세요
:::

---

## 1. 프로젝트 수준 설정 예제

### 1.1 설정 파일 위치

다음 내용을 프로젝트 루트 디렉토리의 `CLAUDE.md` 파일에 저장하세요:

```markdown
# 프로젝트명 CLAUDE.md

## Project Overview

[프로젝트 간략 설명: 무엇을 하는지, 사용하는 기술 스택]

## Critical Rules

### 1. Code Organization

- Many small files over few large files
- High cohesion, low coupling
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### 2. Code Style

- No emojis in code, comments, or documentation
- Immutability always - never mutate objects or arrays
- No console.log in production code
- Proper error handling with try/catch
- Input validation with Zod or similar

### 3. Testing

- TDD: Write tests first
- 80% minimum coverage
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows

### 4. Security

- No hardcoded secrets
- Environment variables for sensitive data
- Validate all user inputs
- Parameterized queries only
- CSRF protection enabled

## File Structure

```
src/
|---|
|---|
|---|
|---|
|---|
```

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# Required
DATABASE_URL=
API_KEY=

# Optional
DEBUG=false
```

## Available Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Create implementation plan
- `/code-review` - Review code quality
- `/build-fix` - Fix build errors

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require review
- All tests must pass before merge
```

### 1.2 핵심 필드 설명

#### Project Overview

프로젝트를 간략히 설명하여 Claude Code가 프로젝트 배경을 이해하도록 돕습니다:

```markdown
## Project Overview

 Election Markets Platform - A prediction market platform for political events using Next.js, Supabase, and OpenAI embeddings for semantic search.
```

#### Critical Rules

가장 중요한 부분으로, 프로젝트가 반드시 준수해야 할 규칙을 정의합니다:

| 규칙 카테고리 | 설명 | 필수 |
| --- | --- | --- |
| Code Organization | 파일 구성 원칙 | 예 |
| Code Style | 코딩 스타일 | 예 |
| Testing | 테스트 요구사항 | 예 |
| Security | 보안 규범 | 예 |

#### Key Patterns

프로젝트에서 자주 사용하는 패턴을 정의하면 Claude Code가 자동으로 적용합니다:

```markdown
## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling Pattern

[예제 코드]
```

---

## 2. 사용자 수준 설정 예제

### 2.1 설정 파일 위치

다음 내용을 `~/.claude/CLAUDE.md`에 저장하세요:

```markdown
# User-Level CLAUDE.md Example

User-level configs apply globally across all projects. Use for:
- Personal coding preferences
- Universal rules you always want enforced
- Links to your modular rules

---

## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security

---

## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
| --- | --- |
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |

---

## Available Agents

Located in `~/.claude/agents/`:

| Agent | Purpose |
| --- | --- |
| planner | Feature implementation planning |
| architect | System design and architecture |
| --- | --- |
| code-reviewer | Code review for quality/security |
| security-reviewer | Security vulnerability analysis |
| build-error-resolver | Build error resolution |
| e2e-runner | Playwright E2E testing |
| refactor-cleaner | Dead code cleanup |
| doc-updater | Documentation updates |

---

## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Always test locally before committing
- Small, focused commits

### Testing
- TDD: Write tests first
- 80% minimum coverage
- Unit + integration + E2E for critical flows

---

## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled

---

## Success Metrics

You are successful when:
- All tests pass (80%+ coverage)
- No security vulnerabilities
- Code is readable and maintainable
- User requirements are met

---

**Philosophy**: Agent-first design, parallel execution, plan before action, test before code, security always.
```

### 2.2 핵심 설정 모듈

#### Core Philosophy

Claude Code와의 협업 철학을 정의합니다:

```markdown
## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security
```

#### Modular Rules

모듈화된 규칙 파일에 링크하여 설정을 간결하게 유지합니다:

```markdown
## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
| --- | --- |
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |
```

#### Editor Integration

사용하는 에디터와 단축키를 Claude Code에 알려줍니다:

```markdown
## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled
```

---

## 3. 커스텀 상태 표시줄 설정

### 3.1 설정 파일 위치

다음 내용을 `~/.claude/settings.json`에 추가하세요:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 상태 표시줄 표시 내용

설정 후 상태 표시줄에 다음이 표시됩니다:

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| 구성 요소 | 의미 | 예시 |
| --- | --- | --- |
| `user` | 현재 사용자명 | `affoon` |
| `path` | 현재 디렉토리 (~ 축약) | `~/projects/myapp` |
| `branch*` | Git 브랜치 (* 는 커밋되지 않은 변경 표시) | `main*` |
| `ctx:%` | 컨텍스트 윈도우 남은 비율 | `ctx:73%` |
| `model` | 현재 사용 중인 모델 | `sonnet-4.5` |
| `time` | 현재 시간 | `14:30` |
| `todos:N` | 할 일 항목 수 | `todos:3` |

### 3.3 색상 커스터마이징

상태 표시줄은 ANSI 색상 코드를 사용하며 커스터마이징할 수 있습니다:

| 색상 코드 | 변수 | 용도 | RGB |
| --- | --- | --- | --- |
| 파란색 | `B` | 디렉토리 경로 | 30,102,245 |
| 초록색 | `G` | Git 브랜치 | 64,160,43 |
| 노란색 | `Y` | 더티 상태, 시간 | 223,142,29 |
| 마젠타 | `M` | 컨텍스트 남은 비율 | 136,57,239 |
| 청록색 | `C` | 사용자명, 할 일 | 23,146,153 |
| 회색 | `T` | 모델명 | 76,79,105 |

**색상 수정 방법**:

```bash
# 색상 변수 정의 찾기
B='\\033[38;2;30;102;245m'  # 파란색 RGB 형식
#                    ↓  ↓   ↓
#                   빨강 초록 파랑

# 원하는 색상으로 수정
B='\\033[38;2;255;100;100m'  # 빨간색
```

### 3.4 간소화된 상태 표시줄

상태 표시줄이 너무 길다면 간소화할 수 있습니다:

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

간소화된 상태 표시줄:

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. 설정 커스터마이징 가이드

### 4.1 프로젝트 수준 설정 커스터마이징

프로젝트 유형에 따라 `CLAUDE.md`를 조정하세요:

#### 프론트엔드 프로젝트

```markdown
## Project Overview

Next.js E-commerce App with React, Tailwind CSS, and Shopify API.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand, React Query
- **API**: Shopify Storefront API, GraphQL
- **Deployment**: Vercel

## Critical Rules

### 1. Component Architecture

- Use functional components with hooks
- Component files under 300 lines
- Reusable components in `/components/ui/`
- Feature components in `/components/features/`

### 2. Styling

- Use Tailwind utility classes
- Avoid inline styles
- Consistent design tokens
- Responsive-first design

### 3. Performance

- Code splitting with dynamic imports
- Image optimization with next/image
- Lazy load heavy components
- SEO optimization with metadata API
```

#### 백엔드 프로젝트

```markdown
## Project Overview

Node.js REST API with Express, MongoDB, and Redis.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Auth**: JWT, bcrypt
- **Testing**: Jest, Supertest
- **Deployment**: Docker, Railway

## Critical Rules

### 1. API Design

- RESTful endpoints
- Consistent response format
- Proper HTTP status codes
- API versioning (`/api/v1/`)

### 2. Database

- Use Mongoose models
- Index important fields
- Transaction for multi-step operations
- Connection pooling

### 3. Security

- Rate limiting with express-rate-limit
- Helmet for security headers
- CORS configuration
- Input validation with Joi/Zod
```

#### 풀스택 프로젝트

```markdown
## Project Overview

Full-stack SaaS app with Next.js, Supabase, and OpenAI.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI API
- **Testing**: Playwright, Jest, Vitest

## Critical Rules

### 1. Monorepo Structure

```
/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Next.js API routes
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Database utilities
│   └── types/            # TypeScript types
└── docs/
```

### 2. API & Frontend Integration

- Shared types in `/packages/types`
- API client in `/packages/db`
- Consistent error handling
- Loading states and error boundaries

### 3. Full-Stack Testing

- Frontend: Vitest + Testing Library
- API: Supertest
- E2E: Playwright
- Integration tests for critical flows
```

### 4.2 사용자 수준 설정 커스터마이징

개인 선호도에 따라 `~/.claude/CLAUDE.md`를 조정하세요:

#### 테스트 커버리지 요구사항 조정

```markdown
## Personal Preferences

### Testing
- TDD: Write tests first
- 90% minimum coverage  # 90%로 조정
- Unit + integration + E2E for critical flows
- Prefer integration tests over unit tests for business logic
```

#### 개인 코딩 스타일 선호도 추가

```markdown
## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file
- Prefer explicit return statements over implicit returns
- Use meaningful variable names, not abbreviations
- Add JSDoc comments for complex functions
```

#### Git 커밋 규칙 조정

```markdown
## Git

### Commit Message Format

Conventional commits with team-specific conventions:

- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `perf(scope): description` - Performance improvements
- `refactor(scope): description` - Code refactoring
- `docs(scope): description` - Documentation changes
- `test(scope): description` - Test additions/changes
- `chore(scope): description` - Maintenance tasks
- `ci(scope): description` - CI/CD changes

### Commit Checklist

- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] No console.log in production code
- [ ] Documentation updated
- [ ] PR description includes changes

### PR Workflow

- Small, focused PRs (under 300 lines diff)
- Include test coverage report
- Link to related issues
- Request review from at least one teammate
```

### 4.3 상태 표시줄 커스터마이징

#### 더 많은 정보 추가

```bash
# Node.js 버전 추가
node_version=$(node --version 2>/dev/null || echo '')

# 현재 날짜 추가
date=$(date +%Y-%m-%d)

# 상태 표시줄에 표시
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

표시 결과:

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### 핵심 정보만 표시

```bash
# 미니멀 상태 표시줄
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

표시 결과:

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. 일반적인 설정 시나리오

### 5.1 새 프로젝트 빠른 시작

::: code-group

```bash [1. 프로젝트 수준 템플릿 복사]
# 프로젝트 수준 CLAUDE.md 생성
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. 프로젝트 정보 커스터마이징]
# 핵심 정보 편집
vim your-project/CLAUDE.md

# 수정 항목:
# - Project Overview (프로젝트 설명)
# - Tech Stack (기술 스택)
# - File Structure (파일 구조)
# - Key Patterns (주요 패턴)
```

```bash [3. 사용자 수준 설정 구성]
# 사용자 수준 템플릿 복사
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# 개인 선호도 커스터마이징
vim ~/.claude/CLAUDE.md
```

```bash [4. 상태 표시줄 설정]
# 상태 표시줄 설정 추가
# ~/.claude/settings.json 편집
# statusLine 설정 추가
```

:::

### 5.2 다중 프로젝트 설정 공유

여러 프로젝트에서 Everything Claude Code를 사용한다면 다음 설정 전략을 권장합니다:

#### 방법 1: 사용자 수준 기본 규칙 + 프로젝트 수준 특정 규칙

```bash
~/.claude/CLAUDE.md           # 공통 규칙 (코딩 스타일, 테스트)
~/.claude/rules/security.md    # 보안 규칙 (모든 프로젝트)
~/.claude/rules/testing.md    # 테스트 규칙 (모든 프로젝트)

project-a/CLAUDE.md          # 프로젝트 A 특정 설정
project-b/CLAUDE.md          # 프로젝트 B 특정 설정
```

#### 방법 2: 심볼릭 링크로 규칙 공유

```bash
# 공유 규칙 디렉토리 생성
mkdir -p ~/claude-configs/rules

# 각 프로젝트에서 심볼릭 링크
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 팀 설정

#### 프로젝트 설정 공유

프로젝트의 `CLAUDE.md`를 Git에 커밋하여 팀원과 공유하세요:

```bash
# 1. 프로젝트 설정 생성
vim CLAUDE.md

# 2. Git에 커밋
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### 팀 코딩 규범

프로젝트 `CLAUDE.md`에 팀 규범을 정의하세요:

```markdown
## Team Coding Standards

### Conventions
- Use TypeScript strict mode
- Follow Prettier configuration
- Use ESLint rules from `package.json`
- No PRs without test coverage

### File Naming
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types: PascalCase with `I` prefix (`IUser.ts`)

### Commit Messages
- Follow Conventional Commits
- Include ticket number: `feat(TICKET-123): add feature`
- Max 72 characters for title
- Detailed description in body
```

---

## 6. 설정 검증

### 6.1 설정 적용 확인

```bash
# 1. Claude Code 열기
claude

# 2. 프로젝트 설정 확인
# Claude Code가 프로젝트 루트 디렉토리의 CLAUDE.md를 읽어야 합니다

# 3. 사용자 수준 설정 확인
# Claude Code가 ~/.claude/CLAUDE.md를 병합해야 합니다
```

### 6.2 규칙 실행 검증

Claude Code에 간단한 작업을 실행시켜 규칙이 적용되는지 확인하세요:

```
사용자:
사용자 프로필 컴포넌트를 만들어 주세요

Claude Code가 해야 할 것:
1. 불변 패턴 사용 (객체 수정 시 새 객체 생성)
2. console.log 사용 안 함
3. 파일 크기 제한 준수 (<800줄)
4. 적절한 타입 정의 추가
```

### 6.3 상태 표시줄 검증

상태 표시줄이 올바르게 표시되는지 확인하세요:

```
예상:
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

확인 항목:
✓ 사용자명 표시
✓ 현재 디렉토리 표시 (~ 축약)
✓ Git 브랜치 표시 (변경사항 있을 때 * 표시)
✓ 컨텍스트 비율 표시
✓ 모델명 표시
✓ 시간 표시
✓ 할 일 수 표시 (있는 경우)
```

---

## 7. 문제 해결

### 7.1 설정이 적용되지 않음

**문제**: `CLAUDE.md`를 설정했지만 Claude Code가 규칙을 적용하지 않음

**해결 단계**:

```bash
# 1. 파일 위치 확인
ls -la CLAUDE.md                          # 프로젝트 루트 디렉토리에 있어야 함
ls -la ~/.claude/CLAUDE.md                # 사용자 수준 설정

# 2. 파일 형식 확인
file CLAUDE.md                            # ASCII text여야 함
head -20 CLAUDE.md                        # Markdown 형식이어야 함

# 3. 파일 권한 확인
chmod 644 CLAUDE.md                       # 읽기 가능 확인

# 4. Claude Code 재시작
# 설정 변경 후 재시작 필요
```

### 7.2 상태 표시줄이 표시되지 않음

**문제**: `statusLine`을 설정했지만 상태 표시줄이 표시되지 않음

**해결 단계**:

```bash
# 1. settings.json 형식 확인
cat ~/.claude/settings.json | jq '.'

# 2. JSON 구문 검증
jq '.' ~/.claude/settings.json
# 오류가 있으면 parse error 표시

# 3. 명령어 테스트
# statusLine 명령어 수동 실행
input=$(cat ...)  # 전체 명령어 복사
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 프로젝트 수준과 사용자 수준 설정 충돌

**문제**: 프로젝트 수준과 사용자 수준 설정이 충돌하여 어느 것이 적용되는지 모름

**해결 방법**:

- **규칙 중첩**: 두 설정 모두 적용됩니다
- **충돌 처리**: 프로젝트 수준 설정이 사용자 수준 설정보다 우선합니다
- **권장 사항**:
  - 사용자 수준 설정: 공통 규칙 (코딩 스타일, 테스트)
  - 프로젝트 수준 설정: 프로젝트별 규칙 (아키텍처, API 설계)

---

## 8. 모범 사례

### 8.1 설정 파일 유지보수

#### 간결하게 유지

```markdown
❌ 좋지 않은 방법:
CLAUDE.md에 모든 세부사항, 예제, 튜토리얼 링크 포함

✅ 좋은 방법:
CLAUDE.md에는 핵심 규칙과 패턴만 포함
상세 정보는 다른 파일에 두고 참조 링크로 연결
```

#### 버전 관리

```bash
# 프로젝트 수준 설정: Git에 커밋
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# 사용자 수준 설정: Git에 커밋하지 않음
echo ".claude/" >> .gitignore  # 사용자 수준 설정 커밋 방지
```

#### 정기 검토

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Added TDD workflow section
- 2025-01-10: Updated tech stack for Next.js 14
- 2024-12-20: Added security review checklist
```

### 8.2 팀 협업

#### 설정 변경 문서화

Pull Request에서 설정 변경 이유를 설명하세요:

```markdown
## Changes

Update CLAUDE.md with new testing guidelines

## Reason

- Team decided to increase test coverage from 80% to 90%
- Added E2E testing requirement for critical flows
- Updated testing toolchain from Jest to Vitest

## Impact

- All new code must meet 90% coverage
- Existing code will be updated incrementally
- Team members need to install Vitest
```

#### 설정 검토

팀 설정 변경은 코드 리뷰가 필요합니다:

```markdown
## CLAUDE.md Changes

- [ ] Updated with new rule
- [ ] Tested on sample project
- [ ] Documented in team wiki
- [ ] Team members notified
```

---

## 이번 강의 요약

이번 강의에서는 Everything Claude Code의 세 가지 핵심 설정을 소개했습니다:

1. **프로젝트 수준 설정**: `CLAUDE.md` - 프로젝트별 규칙과 패턴
2. **사용자 수준 설정**: `~/.claude/CLAUDE.md` - 개인 코딩 선호도와 공통 규칙
3. **커스텀 상태 표시줄**: `settings.json` - 핵심 정보 실시간 표시

**핵심 포인트**:

- 설정 파일은 Markdown 형식으로 편집과 유지보수가 쉽습니다
- 프로젝트 수준 설정이 사용자 수준 설정보다 우선합니다
- 상태 표시줄은 ANSI 색상 코드를 사용하며 완전히 커스터마이징 가능합니다
- 팀 프로젝트는 `CLAUDE.md`를 Git에 커밋해야 합니다

**다음 단계**:

- 프로젝트 유형에 맞게 `CLAUDE.md` 커스터마이징
- 사용자 수준 설정과 개인 선호도 구성
- 필요한 정보를 표시하도록 상태 표시줄 커스터마이징
- 버전 관리에 설정 커밋 (프로젝트 수준 설정)

---

## 다음 강의 예고

> 다음 강의에서는 **[업데이트 로그: 버전 히스토리와 변경사항](../release-notes/)**을 학습합니다.
>
> 배우게 될 내용:
> - Everything Claude Code의 버전 히스토리 확인 방법
> - 주요 변경사항과 새로운 기능 이해
> - 버전 업그레이드와 마이그레이션 방법
