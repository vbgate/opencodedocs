**Flaky 테스트 관리**:

**Flaky 테스트 식별**:
```bash
# 안정성 확인을 위해 테스트를 여러 번 실행
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# 재시도로 특정 테스트 실행
npx playwright test tests/markets/search.spec.ts --retries=3
```

**격리 모드**:
```typescript
// flaky 테스트를 격리하여 표시
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // Test code here...
})

// 또는 조건부 스킵
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // Test code here...
})
```

**일반적인 Flakiness 원인 및 수정**:

**1. 경쟁 상태**
```typescript
// ❌ FLAKY: Don't assume element is ready
await page.click('[data-testid="button"]')

// ✅ STABLE: Wait for element to be ready
await page.locator('[data-testid="button"]').click() // Built-in auto-wait
```

**2. 네트워크 타이밍**
```typescript
// ❌ FLAKY: Arbitrary timeout
await page.waitForTimeout(5000)

// ✅ STABLE: Wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. 애니메이션 타이밍**
```typescript
// ❌ FLAKY: Click during animation
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: Wait for animation to complete
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - 리팩토링 정리자

**언제 사용**: 사용하지 않는 코드, 중복 코드를 제거하고 리팩토링해야 할 때.

::: warning 신중한 조작
Refactor Cleaner는 분석 도구 (knip, depcheck, ts-prune)를 실행하여 죽은 코드를 식별하고 안전하게 삭제합니다. 삭제하기 전에 반드시 충분히 검증하세요!
:::

**핵심 책임**:
1. **죽은 코드 탐지**: 사용되지 않는 코드, 내보내기, 의존성 찾기
2. **중복 제거**: 중복 코드 식별 및 병합
3. **의존성 정리**: 사용되지 않는 패키지와 가져오기 제거
4. **안전한 리팩토링**: 변경이 기능을 깨뜨리지 않도록 보장
5. **문서 기록**: `DELETION_LOG.md`에서 모든 삭제 추적

**탐지 도구**:
- **knip**: 사용되지 않는 파일, 내보내기, 의존성, 타입 찾기
- **depcheck**: 사용되지 않는 npm 의존성 식별
- **ts-prune**: 사용되지 않는 TypeScript 내보내기 찾기
- **eslint**: 사용되지 않는 disable-directives 및 변수 확인

**분석 명령**:
```bash
# 사용되지 않는 내보내기/파일/의존성 찾기 위해 knip 실행
npx knip

# 사용되지 않는 의존성 확인
npx depcheck

# 사용되지 않는 TypeScript 내보내기 찾기
npx ts-prune

# 사용되지 않는 disable-directives 확인
npx eslint . --report-unused-disable-directives
```

**리팩토링 워크플로우**:

**1. 분석 단계**
```
a) 탐지 도구를 병렬로 실행
b) 모든 발견 수집
c) 위험 수준별로 분류:
   - SAFE: 사용되지 않는 내보내기, 사용되지 않는 의존성
   - CAREFUL: 동적 가져오기로 사용될 수 있는 것
   - RISKY: 공개 API, 공유 유틸리티
```

**2. 위험 평가**
```
삭제할 각 항목에 대해:
- 어디서 가져오는지 확인 (grep 검색)
- 동적 가져오기가 없는지 확인 (grep 문자열 패턴)
- 공개 API의 일부인지 확인
- 맥락을 얻기 위해 히스토리 보기
- 빌드/테스트에 미치는 영향 테스트
```

**3. 안전한 삭제 프로세스**
```
a) SAFE 항목부터만 시작
b) 한 번에 한 카테고리씩 삭제:
   1. 사용되지 않는 npm 의존성
   2. 사용되지 않는 내부 내보내기
   3. 사용되지 않는 파일
   4. 중복 코드
c) 각 배치 후 테스트 실행
d) 각 배치에 대해 git commit 생성
```

**4. 중복 병합**
```
a) 중복 컴포넌트/유틸리티 찾기
b) 최선의 구현 선택:
   - 가장 기능이 풍부한
   - 가장 잘 테스트된
   - 가장 최근에 사용된
c) 선택된 버전을 사용하도록 모든 가져오기 업데이트
d) 중복 제거
e) 테스트가 여전히 통과하는지 확인
```

**삭제 로그 형식**:

`docs/DELETION_LOG.md`를 생성/업데이트하고, 다음 구조 사용:
```markdown
# Code Deletion Log

## [YYYY-MM-DD] Refactor Session

### Unused Dependencies Removed
- package-name@version - Last used: never, Size: XX KB
- another-package@version - Replaced by: better-package

### Unused Files Deleted
- src/old-component.tsx - Replaced by: src/new-component.tsx
- lib/deprecated-util.ts - Functionality moved to: lib/utils.ts

### Duplicate Code Consolidated
- src/components/Button1.tsx + Button2.tsx → Button.tsx
- Reason: Both implementations were identical

### Unused Exports Removed
- src/utils/helpers.ts - Functions: foo(), bar()
- Reason: No references found in codebase

### Impact
- Files deleted: 15
- Dependencies removed: 5
- Lines of code removed: 2,300
- Bundle size reduction: ~45 KB

### Testing
- All unit tests passing: ✓
- All integration tests passing: ✓
- Manual testing completed: ✓
```

**안전 검사 체크리스트**:

**무언가를 삭제하기 전에:**
- [ ] 탐지 도구 실행
- [ ] 모든 참조 grep
- [ ] 동적 가져오기 확인
- [ ] 히스토리 보기
- [ ] 공개 API인지 확인
- [ ] 모든 테스트 실행
- [ ] 백업 브랜치 생성
- [ ] DELETION_LOG.md에 문서화

**각 삭제 후:**
- [ ] 빌드 성공
- [ ] 테스트 통과
- [ ] 콘솔 오류 없음
- [ ] 변경사항 커밋
- [ ] DELETION_LOG.md 업데이트

**일반적인 삭제 패턴**:

**1. 사용되지 않는 가져오기**
```typescript
// ❌ Remove unused imports
import { useState, useEffect, useMemo } from 'react' // Only useState used

// ✅ Keep only what's used
import { useState } from 'react'
```

**2. 죽은 코드 브랜치**
```typescript
// ❌ Remove unreachable code
if (false) {
  // This never executes
  doSomething()
}

// ❌ Remove unused functions
export function unusedHelper() {
  // No references in codebase
}
```

**3. 중복 컴포넌트**
```typescript
// ❌ Multiple similar components
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolidate to one
components/Button.tsx (with variant prop)
```

### 9. Doc Updater - 문서 업데이트자

**언제 사용**: codemaps와 문서를 업데이트해야 할 때.

::: tip 문서와 코드 동기화
Doc Updater는 `/update-codemaps` 및 `/update-docs`를 실행하여 `docs/CODEMAPS/*`를 생성하고 READMEs 및 가이드를 업데이트합니다.
:::

**핵심 책임**:
1. **Codemap 생성**: 코드베이스 구조에서 아키텍처 매핑 생성
2. **문서 업데이트**: 코드에서 READMEs 및 가이드를 새로고침
3. **AST 분석**: TypeScript 컴파일러 API를 사용하여 구조 이해
4. **의존성 매핑**: 모듈 간 가져오기/내보내기 추적
5. **문서 품질**: 문서가 실제 코드와 일치하도록 보장

**분석 도구**:
- **ts-morph**: TypeScript AST 분석 및 조작
- **TypeScript Compiler API**: 심층 코드 구조 분석
- **madge**: 의존성 그래프 시각화
- **jsdoc-to-markdown**: JSDoc 주석에서 문서 생성

**분석 명령**:
```bash
# TypeScript 프로젝트 구조 분석 (ts-morph 라이브러리를 사용하는 커스텀 스크립트 실행)
npx tsx scripts/codemaps/generate.ts

# 의존성 그래프 생성
npx madge --image graph.svg src/

# JSDoc 주석 추출
npx jsdoc2md src/**/*.ts
```

**Codemap 생성 워크플로우**:

**1. 저장소 구조 분석**
```
a) 모든 workspaces/packages 식별
b) 디렉토리 구조 매핑
c) 진입점 찾기 (apps/*, packages/*, services/*)
d) 프레임워크 패턴 감지 (Next.js, Node.js 등)
```

**2. 모듈 분석**
```
각 모듈에 대해:
- 내보내기 추출 (공개 API)
- 가져오기 매핑 (의존성)
- 라우트 식별 (API 라우트, 페이지)
- 데이터베이스 모델 찾기 (Supabase, Prisma)
- queue/worker 모듈 위치
```

**3. Codemaps 생성**
```
구조:
docs/CODEMAPS/
├── INDEX.md              # 모든 영역의 개요
├── frontend.md           # 프론트엔드 구조
├── backend.md            # Backend/API 구조
├── database.md           # 데이터베이스 스키마
├── integrations.md       # 외부 서비스
└── workers.md            # 백그라운드 작업
```

**Codemap 형식**:
```markdown
# [영역] Codemap

**Last Updated:** YYYY-MM-DD
**Entry Points:** 주요 파일 목록

## Architecture

[컴포넌트 관계의 ASCII 다이어그램]

## Key Modules

| Module | Purpose | Exports | Dependencies |
|---|---|---|---|
| ... | ... | ... | ... |

## Data Flow

[이 영역에서 데이터가 어떻게 흐르는지 설명]

## External Dependencies

- package-name - Purpose, Version
- ...

## Related Areas

이 영역과 상호작용하는 다른 codemaps에 대한 링크
```

**문서 업데이트 워크플로우**:

**1. 코드에서 문서 추출**
```
- JSDoc/TSDoc 주석 읽기
- README 섹션을 package.json에서 추출
- .env.example에서 환경 변수 파싱
- API 엔드포인트 정의 수집
```

**2. 문서 파일 업데이트**
```
업데이트할 파일:
- README.md - 프로젝트 개요, 설정 지침
- docs/GUIDES/*.md - 기능 가이드, 튜토리얼
- package.json - 설명, 스크립트 문서
- API documentation - 엔드포인트 사양
```

**3. 문서 검증**
```
- 언급된 모든 파일이 존재하는지 확인
- 모든 링크가 유효한지 확인
- 예제가 실행 가능한지 확인
- 코드 스니펫이 컴파일되는지 확인
```

**예시 프로젝트 특정 Codemaps**:

**프론트엔드 Codemap (docs/CODEMAPS/frontend.md)**:
```markdown
# Frontend Architecture

**Last Updated:** YYYY-MM-DD
**Framework:** Next.js 15.1.4 (App Router)
**Entry Point:** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # API 라우트
│   ├── markets/       # 마켓 페이지
│   ├── bot/           # 봇 상호작용
│   └── creator-dashboard/
├── components/        # React 컴포넌트
├── hooks/             # 커스텀 hooks
└── lib/               # 유틸

## Key Components

| Component | Purpose | Location |
|---|---|---|
| HeaderWallet | Wallet connection | components/HeaderWallet.tsx |
| MarketsClient | Markets listing | app/markets/MarketsClient.js |
| SemanticSearchBar | Search UI | components/SemanticSearchBar.js |

## Data Flow

User → Markets Page → API Route → Supabase → Redis (optional) → Response

## External Dependencies

- Next.js 15.1.4 - Framework
- React 19.0.0 - UI library
- Privy - Authentication
- Tailwind CSS 3.4.1 - Styling
```

**백엔드 Codemap (docs/CODEMAPS/backend.md)**:
```markdown
# Backend Architecture

**Last Updated:** YYYY-MM-DD
**Runtime:** Next.js API Routes
**Entry Point:** website/src/app/api/

## API Routes

| Route | Method | Purpose |
|---|---|---|
| /api/markets | GET | List all markets |
| /api/markets/search | GET | Semantic search |
| /api/market/[slug] | GET | Single market |
| /api/market-price | GET | Real-time pricing |

## Data Flow

API Route → Supabase Query → Redis (cache) → Response

## External Services

- Supabase - PostgreSQL database
- Redis Stack - Vector search
- OpenAI - Embeddings
```

**README 업데이트 템플릿**:

README.md를 업데이트할 때:
```markdown
# Project Name

Brief description

## Setup
\`\`\`bash
# Installation
npm install

# Environment variables
cp .env.example .env.local
# Fill in: OPENAI_API_KEY, REDIS_URL, etc.

# Development
npm run dev

# Build
npm run build
\`\`\`

## Architecture

See [docs/CODEMAPS/INDEX.md](docs/CODEMAPS/INDEX.md) for detailed architecture.

### Key Directories

- `src/app` - Next.js App Router 페이지 및 API 라우트
- `src/components` - 재사용 가능한 React 컴포넌트
- `src/lib` - 유틸리티 라이브러리 및 클라이언트

## Features

- [Feature 1] - Description
- [Feature 2] - Description

## Documentation

- [Setup Guide](docs/GUIDES/setup.md)
- [API Reference](docs/GUIDES/api.md)
- [Architecture](docs/CODEMAPS/INDEX.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md)
```

## 언제 어떤 Agent를 호출할지

작업 유형에 따라 적절한 agent를 선택하세요:

| 작업 유형 | 권장 호출 | 대안 |
|---|---|---|
| **새 기능 계획** | `/plan` → planner agent | planner agent 수동 호출 |
| **시스템 아키텍처 설계** | architect agent 수동 호출 | `/orchestrate` → agents 순차 호출 |
| **새 기능 작성** | `/tdd` → tdd-guide agent | planner → tdd-guide |
| **버그 수정** | `/tdd` → tdd-guide agent | build-error-resolver (타입 오류인 경우) |
| **코드 리뷰** | `/code-review` → code-reviewer agent | code-reviewer agent 수동 호출 |
| **보안 감사** | security-reviewer agent 수동 호출 | code-reviewer (부분 커버) |
| **빌드 실패** | `/build-fix` → build-error-resolver agent | 수동 수정 |
| **E2E 테스트** | `/e2e` → e2e-runner agent | Playwright 테스트 수동 작성 |
| **죽은 코드 정리** | `/refactor-clean` → refactor-cleaner agent | 수동 삭제 |
| **문서 업데이트** | `/update-docs` → doc-updater agent | `/update-codemaps` → doc-updater agent |

## Agent 협업 예시

### 시나리오 1: 처음부터 새 기능 개발

```
1. /plan (planner agent)
   - 구현 계획 생성
   - 의존성 및 위험 식별

2. /tdd (tdd-guide agent)
   - 계획에 따라 테스트 작성
   - 기능 구현
   - 커버리지 보장

3. /code-review (code-reviewer agent)
   - 코드 품질 검토
   - 보안 취약점 확인

4. /verify (command)
   - 빌드, 타입 검사, 테스트 실행
   - console.log, git 상태 확인
```

### 시나리오 2: 빌드 오류 수정

```
1. /build-fix (build-error-resolver agent)
   - TypeScript 오류 수정
   - 빌드 통과 보장

2. /test-coverage (command)
   - 커버리지가 기준에 도달하는지 확인

3. /code-review (code-reviewer agent)
   - 수정된 코드 검토
```

### 시나리오 3: 코드 정리

```
1. /refactor-clean (refactor-cleaner agent)
   - 탐지 도구 실행
   - 죽은 코드 삭제
   - 중복 코드 병합

2. /update-docs (doc-updater agent)
   - codemaps 업데이트
   - 문서 새로고침

3. /verify (command)
   - 모든 검사 실행
```

## 이 과정 요약

Everything Claude Code는 9개의 전문화된 agents를 제공하며, 각 agent는 특정 분야에 집중합니다:

1. **planner** - 복잡한 기능 계획
2. **architect** - 시스템 아키텍처 설계
3. **tdd-guide** - TDD 프로세스 실행
4. **code-reviewer** - 코드 품질 검토
5. **security-reviewer** - 보안 취약점 탐지
6. **build-error-resolver** - 빌드 오류 수정
7. **e2e-runner** - 종단 간 테스트 관리
8. **refactor-cleaner** - 죽은 코드 정리
9. **doc-updater** - 문서 및 codemap 업데이트

**핵심 원칙**:
- 작업 유형에 따라 적절한 agent 선택
- agents 간의 협업을 활용하여 효율적인 워크플로우 구축
- 복잡한 작업은 여러 agents를 순차적으로 호출할 수 있음
- 코드 변경 후 반드시 code review 수행

## 다음 과정 예고

> 다음 과정에서는 **[TDD 개발 프로세스](../tdd-workflow/)**를 학습합니다.
>
> 배울 내용:
> - `/plan`을 사용하여 구현 계획을 만드는 방법
> - `/tdd`를 사용하여 Red-Green-Refactor 주기를 실행하는 방법
> - 80%+ 테스트 커버리지를 보장하는 방법
> - `/verify`를 사용하여 전면적인 검증을 실행하는 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 |
|---|---|---|
| Planner Agent | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architect Agent | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guide Agent | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewer Agent | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolver Agent | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runner Agent | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleaner Agent | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updater Agent | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**주요 상수**:
- 없음

**주요 함수**:
- 없음

</details>
