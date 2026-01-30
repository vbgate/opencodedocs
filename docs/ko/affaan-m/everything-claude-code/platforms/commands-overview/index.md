---
title: "Commands: 15개 슬래시 명령어 | Everything Claude Code"
subtitle: "Commands: 15개 슬래시 명령어 | Everything Claude Code"
sidebarTitle: "15개 명령어로 개발 마스터하기"
description: "Everything Claude Code의 15개 슬래시 명령어를 학습합니다. /plan, /tdd, /code-review, /e2e, /verify 등 핵심 명령어 사용법을 익혀 개발 효율을 높이세요."
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# 핵심 Commands 상세 가이드: 15개 슬래시 명령어 완전 정복

## 이 과정을 마치면 할 수 있는 것

- TDD 개발 프로세스를 빠르게 시작하여 고품질 코드 구현
- 체계적인 구현 계획을 수립하여 핵심 단계 누락 방지
- 포괄적인 코드 리뷰와 보안 감사 실행
- E2E 테스트를 생성하여 핵심 사용자 플로우 검증
- 빌드 오류 자동 수정으로 디버깅 시간 절약
- 데드 코드를 안전하게 정리하여 코드베이스 간결하게 유지
- 해결된 문제의 패턴을 추출하여 재사용
- 작업 상태와 체크포인트 관리
- 포괄적인 검증을 실행하여 코드 준비 상태 확인

## 현재 겪고 있는 어려움

개발 과정에서 이런 문제들을 겪고 계실 겁니다:

- **어디서부터 시작해야 할지 모르겠다** — 새로운 요구사항을 받았을 때, 구현 단계를 어떻게 분해해야 할까?
- **테스트 커버리지가 낮다** — 코드는 많이 작성했지만, 테스트가 부족해서 품질을 보장하기 어렵다
- **빌드 오류가 쌓인다** — 코드를 수정하면 타입 오류가 연달아 발생하는데, 어디서부터 고쳐야 할지 모르겠다
- **코드 리뷰가 체계적이지 않다** — 눈으로만 확인하면 보안 문제를 놓치기 쉽다
- **같은 문제를 반복해서 해결한다** — 이전에 겪었던 함정에 또 빠진다

Everything Claude Code의 15개 슬래시 명령어는 바로 이런 문제점들을 해결하기 위해 설계되었습니다.

## 핵심 개념

**명령어는 워크플로우의 진입점입니다**. 각 명령어는 완전한 개발 프로세스를 캡슐화하여, 해당 agent나 skill을 호출해 특정 작업을 완료하도록 도와줍니다.

::: tip 명령어 vs Agent vs Skill

- **명령어**: Claude Code에서 직접 입력하는 단축 진입점 (예: `/tdd`, `/plan`)
- **Agent**: 명령어가 호출하는 전문 서브 에이전트로, 실제 실행을 담당
- **Skill**: Agent가 참조할 수 있는 워크플로우 정의와 도메인 지식

하나의 명령어는 보통 하나 이상의 agent를 호출하고, agent는 관련 skill을 참조할 수 있습니다.

:::

## 명령어 개요

15개 명령어를 기능별로 분류:

| 카테고리 | 명령어 | 용도 |
| --- | --- | --- |
| **개발 프로세스** | `/plan` | 구현 계획 수립 |
| | `/tdd` | 테스트 주도 개발 실행 |
| | `/orchestrate` | 여러 agents 순차 실행 |
| **코드 품질** | `/code-review` | 코드 리뷰 |
| | `/build-fix` | 빌드 오류 수정 |
| | `/refactor-clean` | 데드 코드 정리 |
| | `/verify` | 포괄적 검증 |
| **테스트** | `/e2e` | E2E 테스트 |
| | `/test-coverage` | 테스트 커버리지 분석 |
| | `/eval` | eval 기반 개발 관리 |
| **문서 및 아키텍처** | `/update-docs` | 문서 동기화 |
| | `/update-codemaps` | 아키텍처 문서 업데이트 |
| **상태 관리** | `/checkpoint` | 작업 상태 저장 |
| **학습 및 최적화** | `/learn` | 재사용 가능한 패턴 추출 |
| **설정** | `/setup-pm` | 패키지 매니저 설정 |

## 개발 프로세스 명령어

### /plan: 복잡한 기능 계획하기

**용도**: 코딩을 시작하기 전에 상세한 구현 계획을 수립합니다.

**적용 시나리오**:
- 새로운 기능 개발 시작
- 대규모 아키텍처 변경 진행
- 요구사항이 불명확하거나 모호할 때
- 여러 파일/컴포넌트를 동시에 수정해야 할 때

**워크플로우**:

```
1. 요구사항 재정리
   ↓
2. 리스크와 의존성 식별
   ↓
3. 구체적인 단계로 분해
   ↓
4. 확인 대기
```

::: warning 핵심 특성

planner agent는 계획을 명확히 확인받기 전까지 **어떤 코드도 작성하지 않습니다**.

:::

**예시**:

```
사용자: /plan 실시간 알림 기능을 추가해야 합니다

Claude:
# Implementation Plan: Real-Time Market Resolution Notifications

## Requirements Restatement
- Send notifications when markets resolve
- Support multiple channels (in-app, email, webhook)
- Ensure reliable delivery
- Include market outcome and user's position result

## Implementation Phases
### Phase 1: Database Schema
- Add notifications table
- Add user_notification_preferences table
- Create indexes

### Phase 2: Notification Service
- Create notification queue using BullMQ/Redis
- Implement retry logic
- Create notification templates

...

WAITING FOR CONFIRMATION: Proceed with this plan? (yes/no/modify)
```

**모범 사례**:
- ✅ 복잡한 기능은 먼저 계획하고 구현
- ✅ 리스크와 의존성을 꼼꼼히 검토
- ✅ 단계별로 실행하고, 각 단계마다 검증
- ❌ 계획 단계를 건너뛰지 말 것

---

### /tdd: 테스트 주도 개발

**용도**: TDD 프로세스를 강제 적용하여 테스트 커버리지 ≥ 80%를 보장합니다.

**적용 시나리오**:
- 새로운 기능 구현
- 버그 수정 (먼저 버그를 재현하는 테스트 작성)
- 기존 코드 리팩토링
- 핵심 비즈니스 로직 작성

**TDD 사이클**:

```
RED → GREEN → REFACTOR → REPEAT

RED:      실패하는 테스트 작성
GREEN:    테스트를 통과시키는 최소한의 코드 작성
REFACTOR: 코드 개선, 테스트 통과 상태 유지
REPEAT:   다음 기능/시나리오로
```

::: warning 필수 요구사항

**반드시 테스트를 먼저 작성하고, 그 다음에 코드를 작성해야 합니다**. RED 단계를 건너뛸 수 없습니다.

:::

**예시**:

```
사용자: /tdd 마켓 유동성 점수를 계산하는 함수가 필요합니다

Claude (tdd-guide agent):
## Step 1: Define Interface (SCAFFOLD)
```typescript
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}
```

## Step 2: Write Failing Test (RED)
```typescript
test('should return high score for liquid market', () => {
  const market = { ... }
  expect(calculateLiquidityScore(market)).toBeGreaterThan(80)
})
```

## Step 3: Run Tests - Verify FAIL
```bash
npm test lib/liquidity.test.ts
FAIL ✕ should return high score for liquid market
  Error: Not implemented
```

## Step 4: Implement Minimal Code (GREEN)
```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // 구현 코드...
}
```

## Step 5: Run Tests - Verify PASS
```bash
npm test lib/liquidity.test.ts
PASS ✓ should return high score for liquid market
```

## Step 6: Refactor (IMPROVE)
// 코드 구조 개선...

## Step 7: Verify Tests Still Pass
```bash
npm test lib/liquidity.test.ts
PASS ✓ all tests passing
```

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)
```

**모범 사례**:
- ✅ 먼저 인터페이스 정의
- ✅ 테스트 실패 후에 구현
- ✅ 기능 하나를 완성할 때마다 즉시 테스트
- ✅ 리팩토링 전후로 테스트 통과 확인
- ✅ 커버리지 ≥ 80% (핵심 코드는 100%)
- ❌ 너무 많은 코드를 작성한 후에 테스트하지 말 것
- ❌ RED 단계를 건너뛰지 말 것
- ❌ 구현 세부사항을 테스트하지 말 것

---

### /orchestrate: agents 순차 실행

**용도**: 여러 agents의 순차 워크플로우를 자동화합니다.

**적용 시나리오**:
- 완전한 기능 개발 (planner → tdd-guide → code-reviewer → security-reviewer)
- 버그 수정 프로세스 (explorer → tdd-guide → code-reviewer)
- 보안 감사 (security-reviewer → code-reviewer → architect)

**워크플로우 유형**:

| 워크플로우 유형 | Agent 순서 |
| --- | --- |
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**예시**:

```
사용자: /orchestrate feature "사용자 인증 기능 추가"

Claude:
### ORCHESTRATION REPORT
Workflow: feature
Task: 사용자 인증 기능 추가
Agents: planner → tdd-guide → code-reviewer → security-reviewer

SUMMARY
-------
사용자 인증 기능을 성공적으로 구현했습니다. 회원가입, 로그인, 세션 관리를 포함합니다.

AGENT OUTPUTS
-------------
Planner: 4단계 구현 계획 수립
TDD Guide: 인증 서비스 구현, 커버리지 95%
Code Reviewer: 3개의 높은 우선순위 이슈 발견, 수정 완료
Security Reviewer: 보안 감사 통과, 취약점 없음

FILES CHANGED
-------------
- src/services/auth.ts
- src/api/auth/route.ts
- tests/auth.test.ts
- ...

TEST RESULTS
------------
PASS: 24/24 tests (100%)

SECURITY STATUS
---------------
✅ No vulnerabilities found

RECOMMENDATION
--------------
✅ SHIP - Ready for production
```

**모범 사례**:
- ✅ 복잡한 기능에는 orchestrate 사용
- ✅ 각 agent 사이에 명확한 핸드오프 문서 유지
- ✅ 독립적인 검사는 병렬 실행 (code-reviewer와 security-reviewer)
- ❌ 단순한 작업에는 orchestrate를 사용하지 말 것

---

## 코드 품질 명령어

### /code-review: 코드 리뷰

**용도**: 커밋되지 않은 코드를 포괄적으로 리뷰하여 보안 문제와 코드 품질을 검사합니다.

**적용 시나리오**:
- 코드 커밋 전
- PR 병합 전
- 기능 개발 완료 후

**검사 항목**:

| 카테고리 | 검사 내용 | 심각도 |
| --- | --- | --- |
| **보안** | 하드코딩된 비밀키, SQL 인젝션, XSS, 입력 검증 누락 | CRITICAL |
| **코드 품질** | 함수 > 50줄, 파일 > 800줄, 중첩 깊이 > 4 | HIGH |
| **모범 사례** | 뮤테이션 패턴, console.log, 테스트 누락, TODO/FIXME | MEDIUM |

**예시**:

```
사용자: /code-review

Claude (code-reviewer agent):
# Code Review Report

## Security Issues (CRITICAL)
🔴 [HIGH] Hardcoded API key
File: src/api/github.ts:15
Issue: GitHub token is hardcoded
Fix: Move to environment variable

## Code Quality (HIGH)
🟡 [MEDIUM] Function exceeds 50 lines
File: src/utils/formatter.ts:62
Lines: 78
Issue: FormatLargeData function is too long
Fix: Split into smaller functions

## Best Practices (MEDIUM)
🟢 [LOW] TODO comment
File: src/services/user.ts:45
Issue: TODO: Add rate limiting
Fix: Implement or remove comment

SUMMARY
--------
CRITICAL: 1 (Must fix before commit)
HIGH: 2 (Should fix)
MEDIUM: 3 (Nice to have)

❌ BLOCKED - Critical security issues found
```

::: danger 커밋 차단 규칙

**CRITICAL** 또는 **HIGH** 수준의 문제가 발견되면 커밋이 차단됩니다.

:::

---

### /build-fix: 빌드 오류 수정

**용도**: TypeScript 및 빌드 오류를 하나씩 수정합니다.

**적용 시나리오**:
- `npm run build` 실행 실패
- TypeScript 타입 오류
- 컴파일 오류

**워크플로우**:

```
1. 빌드 실행
   ↓
2. 오류 출력 파싱, 심각도순 정렬
   ↓
3. 하나씩 수정:
   - 오류 컨텍스트 표시
   - 문제 설명
   - 수정 방안 제시
   - 수정 적용
   - 빌드 재실행
   ↓
4. 수정 요약 생성
```

**예시**:

```
사용자: /build-fix

Claude (build-error-resolver agent):
# Fixing Build Errors

Running build: npm run build
Found 5 errors

## Error 1: Type 'string' is not assignable to type 'number'
File: src/calculator.ts:15
```typescript
const result = add("10", "20")  // Error
```
Issue: add function expects numbers, received strings
Fix: Convert to numbers
```typescript
const result = add(Number("10"), Number("20"))
```
✅ Fixed. Re-running build...

## Error 2: Cannot find module './utils'
File: src/index.ts:3
Issue: Import path is incorrect
Fix: Change to './utils/helper'
```typescript
import { helper } from './utils/helper'
```
✅ Fixed. Re-running build...

...

SUMMARY
-------
Errors Fixed: 5
Errors Remaining: 0
Build Status: ✅ PASS
```

::: tip 안전 우선

한 번에 하나의 오류만 수정하여 새로운 문제 발생을 방지합니다.

:::

---

### /refactor-clean: 데드 코드 정리

**용도**: 사용되지 않는 코드를 안전하게 식별하고 제거합니다.

**적용 시나리오**:
- 코드베이스에 사용되지 않는 파일과 export가 많을 때
- 유지보수 부담 감소
- 코드 가독성 향상

**워크플로우**:

```
1. 데드 코드 분석 도구 실행
   - knip: 사용되지 않는 export와 파일 찾기
   - depcheck: 사용되지 않는 의존성 찾기
   - ts-prune: 사용되지 않는 TypeScript export 찾기
   ↓
2. 종합 보고서 생성
   ↓
3. 심각도별 분류
   - SAFE: 테스트 파일, 사용되지 않는 유틸리티 함수
   - CAUTION: API 라우트, 컴포넌트
   - DANGER: 설정 파일, 진입점 파일
   ↓
4. 하나씩 삭제 (테스트 먼저)
   ↓
5. 정리 요약 생성
```

**예시**:

```
사용자: /refactor-clean

Claude (refactor-cleaner agent):
# Dead Code Analysis

## Tools Run
- ✅ knip: Found 12 unused exports
- ✅ depcheck: Found 5 unused dependencies
- ✅ ts-prune: Found 8 unused TypeScript exports

## Classification

### SAFE (Can delete)
- `src/utils/old-helper.ts` - Unused utility function
- `src/components/Button.tsx` - Not used anywhere
- `lodash` - Unused dependency

### CAUTION (Review first)
- `src/api/users.ts` - Only used in tests
- `@types/node` - May be used in build scripts

### DANGER (Do not delete)
- `src/index.ts` - Main entry point
- `tsconfig.json` - Configuration file

## Deletion Plan

Run full test suite first:
✅ Tests passing (98% coverage)

Deleting SAFE items...

1. Removing src/utils/old-helper.ts
   ✅ Tests still passing

2. Removing src/components/Button.tsx
   ✅ Tests still passing

3. Removing lodash from package.json
   ✅ Tests still passing

SUMMARY
-------
Files deleted: 12
Dependencies removed: 5
Tests still passing: ✅
```

::: warning 테스트 우선

**코드를 삭제하기 전에 반드시 테스트를 실행**하여 기존 기능이 손상되지 않았는지 확인하세요.

:::

---

### /verify: 포괄적 검증

**용도**: 완전한 코드 검증 검사를 실행합니다.

**적용 시나리오**:
- 코드 커밋 전
- PR 병합 전
- 릴리스 준비 시

**검사 항목** (순서대로):

1. **빌드 검사** - 빌드 명령 실행
2. **타입 검사** - TypeScript 검사기 실행
3. **Lint 검사** - linter 실행
4. **테스트 스위트** - 모든 테스트 실행, 커버리지 보고
5. **Console.log 감사** - 소스 파일에서 console.log 검색
6. **Git 상태** - 커밋되지 않은 변경사항 표시

**예시**:

```
사용자: /verify pre-pr

Claude:
# Verification Report

VERIFICATION: ✅ PASS

Build:    ✅ OK
Types:    ✅ OK (0 errors)
Lint:     ✅ OK (0 issues)
Tests:    ✅ 142/145 passed, 98% coverage
Secrets:  ✅ OK (0 found)
Logs:     ⚠️ 3 console.logs found

Console.log locations:
- src/utils/logger.ts:15 (intentional logger)
- src/api/webhook.ts:42 (debug, remove before commit)
- src/services/auth.ts:89 (debug, remove before commit)

Ready for PR: ⚠️ YES (remove debug logs)

Files modified since last commit:
- src/api/webhook.ts (new)
- src/services/auth.ts (modified)
- tests/auth.test.ts (modified)
```

**매개변수**:
- `quick` - 빌드 + 타입 검사만
- `full` - 모든 검사 (기본값)
- `pre-commit` - 커밋 관련 검사
- `pre-pr` - 전체 검사 + 보안 스캔

---

## 테스트 명령어

### /e2e: E2E 테스트

**용도**: Playwright를 사용하여 E2E 테스트를 생성하고 실행합니다.

**적용 시나리오**:
- 핵심 사용자 플로우 테스트 (로그인, 거래, 결제)
- 다단계 프로세스의 E2E 통합 검증
- UI 상호작용 및 네비게이션 테스트
- 프로덕션 배포 준비

**워크플로우**:

```
1. 사용자 플로우 분석, 테스트 시나리오 식별
   ↓
2. Playwright 테스트 생성 (Page Object 패턴 사용)
   ↓
3. 여러 브라우저에서 테스트 실행 (Chrome, Firefox, Safari)
   ↓
4. 실패 시 스크린샷, 비디오, 트레이스 캡처
   ↓
5. 결과와 아티팩트가 포함된 보고서 생성
   ↓
6. 불안정한 테스트 식별 및 수정 제안
```

**예시**:

```
사용자: /e2e 마켓 검색 및 조회 플로우 테스트

Claude (e2e-runner agent):
# E2E Test Generation: Market Search and View Flow

## Test Scenario Identified
**User Journey:** Market Search → View Results → Click Market → View Details

## Generated Test Code
```typescript
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test('user can search markets and view details', async ({ page }) => {
  const marketsPage = new MarketsPage(page)
  await marketsPage.goto()

  // Perform search
  await marketsPage.searchMarkets('election')
  await page.waitForResponse(resp =>
    resp.url().includes('/api/markets/search') && resp.status() === 200
  )

  // Verify results
  const marketCards = marketsPage.marketCards
  await expect(marketCards.first()).toBeVisible()

  // Click on first result
  await marketCards.first().click()

  // Verify market details page loads
  await expect(page).toHaveURL(/\/markets\/[a-z0-9-]+/)
  await expect(page.locator('[data-testid="market-name"]')).toBeVisible()
})
```

## Running Tests
```bash
npx playwright test tests/e2e/markets/search-and-view.spec.ts

✓ [chromium] user can search markets and view details (4.2s)
✓ [chromium] search with no results shows empty state (1.8s)

2 passed (6.0s)

Artifacts generated:
- artifacts/search-results.png
- artifacts/market-details.png
- playwright-report/index.html
```

## Test Report
╔══════════════════════════════════════════════════════╗
║ Status:     ✅ ALL TESTS PASSED                       ║
║ Total:      2 tests                                    ║
║ Passed:     2 (100%)                                   ║
║ Flaky:      0                                           ║
╚══════════════════════════════════════════════════════╝
```

**빠른 명령어**:

```bash
# 모든 E2E 테스트 실행
npx playwright test

# 특정 테스트 파일 실행
npx playwright test tests/e2e/markets/search.spec.ts

# headed 모드로 실행 (브라우저 표시)
npx playwright test --headed

# 테스트 디버그
npx playwright test --debug

# 보고서 보기
npx playwright show-report
```

**모범 사례**:
- ✅ Page Object Model 사용으로 유지보수성 향상
- ✅ data-testid 속성을 셀렉터로 사용
- ✅ 임의의 타임아웃 대신 API 응답 대기
- ✅ 핵심 사용자 플로우 테스트
- ❌ 취약한 셀렉터 사용 금지 (CSS 클래스는 변경될 수 있음)
- ❌ 구현 세부사항 테스트 금지

---

### /test-coverage: 테스트 커버리지 분석

**용도**: 테스트 커버리지를 분석하고 누락된 테스트를 생성합니다.

**적용 시나리오**:
- 커버리지가 80% 미만일 때
- 테스트 보완이 필요할 때

**워크플로우**:

```
1. 커버리지와 함께 테스트 실행
   ↓
2. 커버리지 보고서 분석 (coverage/coverage-summary.json)
   ↓
3. 80% 커버리지 임계값 미만인 파일 식별
   ↓
4. 커버리지가 부족한 각 파일에 대해:
   - 테스트되지 않은 코드 경로 분석
   - 함수에 대한 단위 테스트 생성
   - API에 대한 통합 테스트 생성
   ↓
5. 새 테스트 통과 확인
   ↓
6. 전후 커버리지 지표 표시
```

**예시**:

```
사용자: /test-coverage

Claude:
# Test Coverage Analysis

Running tests with coverage...
npm test --coverage

## Coverage Report

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   65    |   50     |   75    |   63  ⚠️
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   45    |   30     |   50    |   44  ⚠️

Overall                   |   78    |   72     |   85    |   76  ⚠️

Target: 80%
Current: 76% ❌ Need to improve

## Generating Missing Tests

### File: src/utils/formatter.ts (65% coverage)
Untested paths:
- FormatCurrency with negative values
- FormatDate with custom locale
- TruncateText with long strings

Generating tests...
```typescript
describe('formatter', () => {
  it('should format negative currency', () => {
    expect(formatCurrency(-100)).toBe('-$100.00')
  })

  it('should format date with custom locale', () => {
    expect(formatDate(new Date(), 'ja-JP')).toMatch('2024年')
  })

  it('should truncate long text', () => {
    expect(truncateText('a'.repeat(100), 10)).toBe('aaaaaaaaaa...')
  })
})
```

### File: src/components/Button.tsx (45% coverage)
Untested paths:
- Disabled state
- Loading state
- onClick handler

Generating tests...

## After Adding Tests

Running tests again...

File                      | % Stmts | % Branch | % Funcs | % Lines
--------------------------|---------|----------|---------|--------
src/services/auth.ts       |   92    |   88     |   100   |   91
src/utils/formatter.ts     |   100   |   95     |   100   |   99  ✅
src/api/users.ts          |   100   |   100    |   100   |   100
src/components/Button.tsx  |   95    |   90     |   100   |   94  ✅

Overall                   |   95    |   92     |   100   |   94  ✅

Target: 80%
Current: 94% ✅ EXCEEDED

Summary: +12 tests added, Coverage: 76% → 94%
```

---

### /eval: 평가 기반 개발

**용도**: eval 기반 개발 워크플로우를 관리합니다.

**적용 시나리오**:
- 평가 기반 개발 (EDD)
- 기능 인수 테스트
- 회귀 테스트

**하위 명령어**:

- `define <name>` - 새 eval 정의 생성
- `check <name>` - eval 실행 및 확인
- `report <name>` - 전체 보고서 생성
- `list` - 모든 eval 표시

**예시 - Eval 정의**:

```
사용자: /eval define user-auth

Claude:
eval 정의 생성 중...

.claude/evals/user-auth.md:

## EVAL: user-auth
Created: 2026-01-25

### Capability Evals
- [ ] User can register with email and password
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] User can reset password via email

### Regression Evals
- [ ] Existing users can still login
- [ ] Session tokens still work
- [ ] OAuth login still works

### Success Criteria
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals

구체적인 평가 기준을 작성해 주세요...
```

**예시 - Eval 확인**:

```
사용자: /eval check user-auth

Claude:
eval 실행 중...

EVAL CHECK: user-auth
=======================
Capability: 2/4 passing
Regression: 2/3 passing
Status: IN PROGRESS

Capability Results:
✅ User can register with email and password
✅ User can login with correct credentials
❌ User cannot login with wrong password (fails intermittently)
❌ User can reset password via email (not implemented)

Regression Results:
✅ Existing users can still login
✅ Session tokens still work
❌ OAuth login still works (test failing due to rate limit)

RECOMMENDATION: NEEDS WORK - Fix password validation and implement password reset
```

**예시 - Eval 보고서**:

```
사용자: /eval report user-auth

Claude:
종합 보고서 생성 중...

EVAL REPORT: user-auth
=========================
Generated: 2026-01-25

CAPABILITY EVALS
----------------
[register-email-pass]: PASS (pass@1)
[login-credentials-pass]: PASS (pass@2) - required retry
[login-wrong-pass-fail]: FAIL - see notes
[password-reset-pass]: FAIL - not implemented

REGRESSION EVALS
----------------
[existing-users-login]: PASS
[session-tokens]: PASS
[oauth-login]: PASS

METRICS
-------
Capability pass@1: 50%
Capability pass@3: 100%
Regression pass^3: 100%

NOTES
-----
Password validation test is flaky due to timing issue.
Need to implement password reset flow.

RECOMMENDATION
--------------
NEEDS WORK - Complete password reset implementation
```

---

## 문서 및 아키텍처 명령어

### /update-docs: 문서 동기화

**용도**: 소스 코드에서 문서를 동기화합니다.

**적용 시나리오**:
- 코드 변경 후 문서 업데이트
- 문서와 코드 동기화 유지

**워크플로우**:

```
1. package.json scripts 섹션 읽기
   - 스크립트 참조 테이블 생성
   - 주석에서 설명 추출
   ↓
2. .env.example 읽기
   - 모든 환경 변수 추출
   - 용도와 형식 기록
   ↓
3. docs/CONTRIB.md 생성
   - 개발 워크플로우
   - 사용 가능한 스크립트
   - 환경 설정
   - 테스트 절차
   ↓
4. docs/RUNBOOK.md 생성
   - 배포 절차
   - 모니터링 및 알림
   - 일반적인 문제와 해결책
   - 롤백 절차
   ↓
5. 오래된 문서 식별
   - 90일 이상 수정되지 않은 문서 찾기
   - 수동 검토를 위해 목록 작성
   ↓
6. diff 요약 표시
```

::: tip 단일 진실 소스

package.json과 .env.example이 유일한 진실 소스입니다.

:::

---

### /update-codemaps: 아키텍처 문서 업데이트

**용도**: 코드베이스 구조를 분석하고 아키텍처 문서를 업데이트합니다.

**적용 시나리오**:
- 코드 구조 변경 후
- 아키텍처 문서 업데이트 필요 시

**워크플로우**:

```
1. 모든 소스 파일의 import, export, 의존성 스캔
   ↓
2. 간결한 codemaps 생성:
   - codemaps/architecture.md - 전체 아키텍처
   - codemaps/backend.md - 백엔드 구조
   - codemaps/frontend.md - 프론트엔드 구조
   - codemaps/data.md - 데이터 모델 및 스키마
   ↓
3. 이전 버전과의 diff 백분율 계산
   ↓
4. 변경이 > 30%이면 업데이트 전 사용자 승인 요청
   ↓
5. 각 codemap에 신선도 타임스탬프 추가
   ↓
6. 보고서를 .reports/codemap-diff.txt에 저장
```

**예시**:

```
사용자: /update-codemaps

Claude:
코드베이스 구조 분석 중...

Scanning 156 files...
Found 89 imports and 124 exports

## Codemap Diff

Previous version: 2026-01-20
Current version: 2026-01-25
Diff: 12% (under 30% threshold)

✅ Safe to update

## Updated Codemaps

codemaps/architecture.md
- Updated module dependencies
- Added new services: auth, notifications
- Removed deprecated modules: legacy-db

codemaps/backend.md
- Updated API routes structure
- Added middleware documentation

codemaps/frontend.md
- Updated component hierarchy
- Added new pages: profile, settings

codemaps/data.md
- Updated database schemas
- Added new tables: users, sessions

Summary: 4 codemaps updated, 12% change
```

---

## 상태 관리 명령어

### /checkpoint: 작업 상태 저장

**용도**: 워크플로우에서 체크포인트를 생성하거나 검증합니다.

**적용 시나리오**:
- 중요한 개발 단계 저장
- 롤백 및 진행 상황 추적 지원

**하위 명령어**:

- `create <name>` - 명명된 체크포인트 생성
- `verify <name>` - 체크포인트 검증
- `list` - 모든 체크포인트 표시
- `clear` - 오래된 체크포인트 제거 (최근 5개 유지)

**예시**:

```
사용자: /checkpoint create feature-start

Claude:
# Creating Checkpoint: feature-start

Running /verify quick...

Build: ✅ OK
Types: ✅ OK

Creating checkpoint...

✅ Checkpoint "feature-start" created
├─ Timestamp: 2026-01-25-14:30
├─ Git SHA: abc1234
└─ Status: Clean (no uncommitted changes)
```

```
사용자: /checkpoint verify feature-start

Claude:
CHECKPOINT COMPARISON: feature-start
===========================
Files changed: 5
Tests: +3 passed / -0 failed
Coverage: +5% / -0%
Build: PASS

Changes since checkpoint:
✅ src/services/auth.ts (modified)
✅ tests/auth.test.ts (added)
✅ src/components/Login.tsx (added)
```

**워크플로우**:

```
[시작] → /checkpoint create "feature-start"
   |
[구현] → /checkpoint create "core-done"
   |
[테스트] → /checkpoint verify "core-done"
   |
[리팩토링] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## 학습 및 최적화 명령어

### /learn: 재사용 가능한 패턴 추출

**용도**: 현재 세션을 분석하여 skill로 저장할 수 있는 패턴을 추출합니다.

**적용 시나리오**:
- 비평범한 문제 해결 후
- 재사용 가능한 오류 해결 패턴 발견
- 프로젝트별 규칙 기록

**추출 내용**:

1. **오류 해결 패턴**
   - 어떤 오류가 발생했는가?
   - 근본 원인은 무엇인가?
   - 어떻게 수정했는가?
   - 유사한 오류에 재사용 가능한가?

2. **디버깅 기법**
   - 명확하지 않은 디버깅 단계
   - 효과적인 도구 조합
   - 진단 패턴

3. **Workarounds**
   - 라이브러리 quirks
   - API 제한
   - 버전별 수정

4. **프로젝트별 패턴**
   - 발견된 코드베이스 규칙
   - 내린 아키텍처 결정
   - 통합 패턴

**예시**:

```
사용자: /learn

Claude:
# Extracting Patterns from Session

Reviewing session history...

Found 3 extractable patterns:

## Pattern 1: Supabase Auth Session Recovery
**Type:** Error Resolution
**Reusability:** High (affects all auth endpoints)

### Problem
After user logs in, subsequent API calls fail with 401 Unauthorized.

### Root Cause
Supabase session cookie is not being sent to backend API due to CORS configuration.

### Solution
```typescript
// Configure Supabase with correct URL
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      storageKey: 'my-app-auth',
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)
```

### When to Use
Trigger: Auth endpoints returning 401 unexpectedly

---

## Pattern 2: Playwright Test Flakiness Fix
**Type:** Debugging Technique
**Reusability:** Medium (affects async UI tests)

### Problem
Test "user can click submit button" fails intermittently with timeout.

### Root Cause
Button is disabled initially due to async validation, but test doesn't wait.

### Solution
```typescript
// Use explicit wait with predicate
await page.waitForSelector('[data-testid="submit-btn"]:not(:disabled)', {
  timeout: 10000
})

// Then click
await page.locator('[data-testid="submit-btn"]').click()
```

### When to Use
Trigger: Test timing issues with async UI state

---

Do you want to save these patterns? (yes/no/modify)
```

::: tip 집중 원칙

한 번에 하나의 패턴만 추출하여 skill을 집중적으로 유지합니다.

:::

---

## 설정 명령어

### /setup-pm: 패키지 매니저 설정

**용도**: 프로젝트 또는 전역 기본 패키지 매니저를 설정합니다.

**적용 시나리오**:
- 현재 사용 중인 패키지 매니저 감지
- 전역 또는 프로젝트 기본 설정

**감지 우선순위**:

1. 환경 변수: `CLAUDE_PACKAGE_MANAGER`
2. 프로젝트 설정: `.claude/package-manager.json`
3. package.json: `packageManager` 필드
4. Lock 파일: package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb
5. 전역 설정: `~/.claude/package-manager.json`
6. 폴백: 첫 번째 사용 가능한 패키지 매니저

**지원 패키지 매니저 우선순위**: pnpm > bun > yarn > npm

**예시**:

```bash
# 현재 패키지 매니저 감지
node scripts/setup-package-manager.js --detect

# 전역 기본 설정
node scripts/setup-package-manager.js --global pnpm

# 프로젝트 기본 설정
node scripts/setup-package-manager.js --project bun

# 사용 가능한 패키지 매니저 목록
node scripts/setup-package-manager.js --list
```

**설정 파일**:

전역 설정 (`~/.claude/package-manager.json`):
```json
{
  "packageManager": "pnpm"
}
```

프로젝트 설정 (`.claude/package-manager.json`):
```json
{
  "packageManager": "bun"
}
```

환경 변수는 모든 감지 방법을 재정의합니다:
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## 명령어 조합 워크플로우

### 완전한 기능 개발 프로세스

```
1. /plan "사용자 인증 기능 추가"
   ↓ 구현 계획 수립
2. /tdd "인증 서비스 구현"
   ↓ TDD 개발
3. /test-coverage
   ↓ 커버리지 ≥ 80% 확인
4. /code-review
   ↓ 코드 리뷰
5. /verify pre-pr
   ↓ 포괄적 검증
6. /checkpoint create "auth-feature-done"
   ↓ 체크포인트 저장
7. /update-docs
   ↓ 문서 업데이트
8. /update-codemaps
   ↓ 아키텍처 문서 업데이트
```

### 버그 수정 프로세스

```
1. /checkpoint create "bug-start"
   ↓ 현재 상태 저장
2. /orchestrate bugfix "로그인 오류 수정"
   ↓ 자동화된 버그 수정 프로세스
3. /test-coverage
   ↓ 테스트 커버리지 확인
4. /verify quick
   ↓ 수정 검증
5. /checkpoint verify "bug-start"
   ↓ 체크포인트 비교
```

### 보안 감사 프로세스

```
1. /orchestrate security "결제 프로세스 감사"
   ↓ 보안 우선 감사 프로세스
2. /e2e "결제 프로세스 테스트"
   ↓ E2E 테스트
3. /code-review
   ↓ 코드 리뷰
4. /verify pre-pr
   ↓ 포괄적 검증
```

---

## 명령어 비교 빠른 참조표

| 명령어 | 주요 용도 | 트리거 Agent | 출력 |
| --- | --- | --- | --- |
| `/plan` | 구현 계획 수립 | planner | 단계별 계획 |
| `/tdd` | TDD 개발 | tdd-guide | 테스트 + 구현 + 커버리지 |
| `/orchestrate` | agents 순차 실행 | 여러 agents | 종합 보고서 |
| `/code-review` | 코드 리뷰 | code-reviewer, security-reviewer | 보안 및 품질 보고서 |
| `/build-fix` | 빌드 오류 수정 | build-error-resolver | 수정 요약 |
| `/refactor-clean` | 데드 코드 정리 | refactor-cleaner | 정리 요약 |
| `/verify` | 포괄적 검증 | Bash | 검증 보고서 |
| `/e2e` | E2E 테스트 | e2e-runner | Playwright 테스트 + 아티팩트 |
| `/test-coverage` | 커버리지 분석 | Bash | 커버리지 보고서 + 누락된 테스트 |
| `/eval` | 평가 기반 개발 | Bash | Eval 상태 보고서 |
| `/checkpoint` | 상태 저장 | Bash + Git | 체크포인트 보고서 |
| `/learn` | 패턴 추출 | continuous-learning skill | Skill 파일 |
| `/update-docs` | 문서 동기화 | doc-updater agent | 문서 업데이트 |
| `/update-codemaps` | 아키텍처 업데이트 | doc-updater agent | Codemap 업데이트 |
| `/setup-pm` | 패키지 매니저 설정 | Node.js 스크립트 | 패키지 매니저 감지 |

---

## 주의사항

### ❌ 계획 단계를 건너뛰지 마세요

복잡한 기능에서 바로 코딩을 시작하면:
- 중요한 의존성 누락
- 아키텍처 불일치
- 요구사항 이해 오류

**✅ 올바른 방법**: `/plan`을 사용하여 상세 계획을 수립하고, 확인 후 구현합니다.

---

### ❌ TDD에서 RED 단계를 건너뛰지 마세요

코드를 먼저 작성하고 테스트를 나중에 작성하면, 그것은 TDD가 아닙니다.

**✅ 올바른 방법**: RED → GREEN → REFACTOR 사이클을 엄격히 따릅니다.

---

### ❌ /code-review의 CRITICAL 문제를 무시하지 마세요

보안 취약점은 데이터 유출, 금전적 손실 등 심각한 결과를 초래할 수 있습니다.

**✅ 올바른 방법**: 모든 CRITICAL 및 HIGH 수준 문제를 수정한 후 커밋합니다.

---

### ❌ 테스트 없이 코드를 삭제하지 마세요

데드 코드 분석에 오탐이 있을 수 있으며, 직접 삭제하면 기능이 손상될 수 있습니다.

**✅ 올바른 방법**: 삭제 전에 테스트를 실행하여 기존 기능이 손상되지 않았는지 확인합니다.

---

### ❌ /learn 사용을 잊지 마세요

비평범한 문제를 해결한 후 패턴을 추출하지 않으면, 다음에 같은 문제를 처음부터 다시 해결해야 합니다.

**✅ 올바른 방법**: 정기적으로 `/learn`을 사용하여 재사용 가능한 패턴을 추출하고 지식을 축적합니다.

---

## 이 과정 요약

Everything Claude Code의 15개 슬래시 명령어는 완전한 개발 워크플로우를 지원합니다:

- **개발 프로세스**: `/plan` → `/tdd` → `/orchestrate`
- **코드 품질**: `/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **테스트**: `/e2e` → `/test-coverage` → `/eval`
- **문서 및 아키텍처**: `/update-docs` → `/update-codemaps`
- **상태 관리**: `/checkpoint`
- **학습 및 최적화**: `/learn`
- **설정**: `/setup-pm`

이 명령어들을 마스터하면 효율적이고 안전하며 고품질의 개발 작업을 수행할 수 있습니다.

---

## 다음 과정 예고

> 다음 과정에서는 **[핵심 Agents 상세 가이드](../agents-overview/)**를 학습합니다.
>
> 배우게 될 내용:
> - 9개 전문화된 agents의 역할과 적용 시나리오
> - 언제 어떤 agent를 호출해야 하는지
> - Agent 간 협업 방식
> - Agent 설정 커스터마이징 방법

---

## 부록: 소스 코드 참조

<details>
<summary><strong>클릭하여 소스 코드 위치 보기</strong></summary>

> 업데이트 시간: 2026-01-25

| 기능 | 파일 경로 | 라인 번호 |
| --- | --- | --- |
| TDD 명령어 | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Plan 명령어 | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Code Review 명령어 | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| E2E 명령어 | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Build Fix 명령어 | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Refactor Clean 명령어 | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Learn 명령어 | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Checkpoint 명령어 | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify 명령어 | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Test Coverage 명령어 | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Setup PM 명령어 | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Update Docs 명령어 | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Orchestrate 명령어 | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Update Codemaps 명령어 | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Eval 명령어 | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Plugin 정의 | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**핵심 상수**:
- TDD 커버리지 목표: 80% (핵심 코드 100%) - `commands/tdd.md:293-300`

**핵심 함수**:
- TDD 사이클: RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Plan 확인 대기 메커니즘 - `commands/plan.md:96`
- Code Review 심각도 수준: CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
