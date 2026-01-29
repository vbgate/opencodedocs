---
title: "TDD Workflow: Plan to Verify | Everything Claude Code"
sidebarTitle: "TDD Workflow"
subtitle: "TDD Development Workflow: Complete Red-Green-Refactor Cycle from /plan to /verify"
description: "Learn the TDD development workflow with /plan, /tdd, /code-review, and /verify commands. Achieve 80%+ test coverage and deliver high-quality code."
tags:
  - "tdd"
  - "test-driven-development"
  - "workflow"
prerequisite:
  - "start-quick-start"
order: 70
---

# TDD Development Workflow: Complete Red-Green-Refactor Cycle from /plan to /verify

## What You'll Learn

- Use the `/plan` command to create systematic implementation plans and avoid missing requirements
- Apply the `/tdd` command to execute test-driven development, following the RED-GREEN-REFACTOR cycle
- Ensure code safety and quality through `/code-review`
- Use `/verify` to verify that code is ready for safe commit
- Achieve 80%+ test coverage and build a reliable test suite

## Your Current Challenges

When developing new features, do you encounter these situations:

- You realize you misunderstood requirements after writing code and have to redo it
- Low test coverage leads to bugs discovered after deployment
- Security issues are found during code review, requiring rework
- Type errors or build failures are discovered only after committing
- You're unsure when to write tests, resulting in incomplete test coverage

These issues lead to low development efficiency and difficulty ensuring code quality.

## When to Use This Workflow

Use the TDD development workflow in these scenarios:

- **Developing new features**: From requirements to implementation, ensuring complete functionality and adequate testing
- **Fixing bugs**: Write tests to reproduce bugs first, then fix, ensuring no new issues are introduced
- **Refactoring code**: With test protection, optimize code structure with confidence
- **Implementing API endpoints**: Write integration tests to verify interface correctness
- **Developing core business logic**: Critical code like financial calculations and authentication requires 100% test coverage

::: tip Core Principle
Test-driven development is not just about writing tests first—it's a systematic approach to ensuring code quality and improving development efficiency. All new code should be implemented through the TDD workflow.
:::

## Core Concept

The TDD development workflow consists of 4 core commands, forming a complete development cycle:

```
1. /plan        → Planning: Clarify requirements, identify risks, implement in phases
2. /tdd         → Implementation: Test-first, minimal code, continuous refactoring
3. /code-review → Review: Security checks, quality assessment, best practices
4. /verify      → Verification: Build, types, tests, code audit
```

**Why this workflow works**:

- **Plan first**: `/plan` ensures correct understanding and avoids going in the wrong direction
- **Test-driven**: `/tdd` forces tests first, ensuring every feature has test protection
- **Review gate**: `/code-review` discovers security vulnerabilities and code quality issues
- **Verify completion**: `/verify` ensures code is safe to commit

## 🎒 Prerequisites

Before starting the TDD development workflow, please confirm:

- ✅ Everything Claude Code plugin is installed
- ✅ Project is configured with a testing framework (Jest, Vitest, etc.)
- ✅ Project has a basic build process (`npm run build`)
- ✅ You understand basic command usage from [Quick Start](../../start/quickstart/)

::: warning Prerequisites
This tutorial assumes you're familiar with the basic operations from [Quick Start](../../start/quickstart/). If you haven't completed installation, please read the [Installation Guide](../../start/installation/) first.
:::

## Follow Along: Complete TDD Development Workflow

Let's learn the entire workflow through a practical example. Suppose you need to implement a "Market Liquidity Score Calculator" feature.

### Step 1: Use /plan to Create an Implementation Plan

**Why**
The planning phase ensures you understand requirements, identify potential risks, and avoid subsequent rework.

**Action**
Enter the following in Claude Code:

```
/plan I need to implement a market liquidity score calculator that calculates a score (0-100) based on trading volume, bid-ask spread, number of active traders, and time of last trade
```

**What you should see**
The planner agent will generate a detailed implementation plan:

```markdown
## Implementation Plan: Market Liquidity Score Calculator

## Requirements Restatement
- Calculate market liquidity score (0-100) based on multiple metrics
- Higher scores indicate better market liquidity
- Consider trading volume, bid-ask spread, active traders, last trade time

## Implementation Phases

### Phase 1: Define Interface
- Create `MarketData` interface to define input data
- Define `calculateLiquidityScore` function signature

### Phase 2: Write Tests
- Write unit tests covering various scenarios
- Edge cases: zero volume, extreme values
- Error handling: missing fields, invalid types

### Phase 3: Implement Calculation
- Implement scoring algorithm
- Weighted calculation of each metric
- Normalize to 0-100 range

### Phase 4: Integration
- Integrate into existing API
- Add endpoint to expose calculation functionality
- Document usage

## Dependencies
- No external dependencies

## Risks
- MEDIUM: Scoring algorithm may require weight adjustments
- LOW: Edge case handling

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

**Checkpoint ✅**
- Confirm requirements are understood correctly
- Confirm implementation steps are reasonable
- Check for any missing risks

**Next step**
If the plan is fine, reply `yes` or `proceed`. If modifications are needed, specify the changes.

---

### Step 2: Use /tdd to Execute Test-Driven Development

**Why**
The `/tdd` command forces tests to be written first, ensuring every feature has test protection and avoiding the pain of adding tests later.

**Action**
After confirming the plan, enter:

```
/tdd Implement the market liquidity score calculator according to the plan
```

**What you should see**
The tdd-guide agent will guide you through the TDD workflow:

#### RED Phase: Write Tests First

```typescript
// lib/liquidity.ts
export interface MarketData {
  totalVolume: number
  bidAskSpread: number
  activeTraders: number
  lastTradeTime: Date
}

export function calculateLiquidityScore(market: MarketData): number {
  // TODO: Implementation
  throw new Error('Not implemented')
}
```

```typescript
// lib/liquidity.test.ts
import { calculateLiquidityScore } from './liquidity'

describe('calculateLiquidityScore', () => {
  it('should return high score for liquid market', () => {
    const market = {
      totalVolume: 100000,
      bidAskSpread: 0.01,
      activeTraders: 500,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeGreaterThan(80)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('should return low score for illiquid market', () => {
    const market = {
      totalVolume: 100,
      bidAskSpread: 0.5,
      activeTraders: 2,
      lastTradeTime: new Date(Date.now() - 86400000) // 1 day ago
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBeLessThan(30)
    expect(score).toBeGreaterThanOrEqual(0)
  })

  it('should handle edge case: zero volume', () => {
    const market = {
      totalVolume: 0,
      bidAskSpread: 0,
      activeTraders: 0,
      lastTradeTime: new Date()
    }

    const score = calculateLiquidityScore(market)

    expect(score).toBe(0)
  })
})
```

```bash
npm test lib/liquidity.test.ts

## You should see tests fail
FAIL lib/liquidity.test.ts
  ✕ should return high score for liquid market
    Error: Not implemented
```

✅ **Tests fail as expected**

#### GREEN Phase: Implement Minimal Code

```typescript
export function calculateLiquidityScore(market: MarketData): number {
  // Handle zero volume edge case
  if (market.totalVolume === 0) {
    return 0
  }

  // Calculate component scores (0-100 scale)
  const volumeScore = Math.min(market.totalVolume / 1000, 100)
  const spreadScore = Math.max(100 - (market.bidAskSpread * 1000), 0)
  const traderScore = Math.min(market.activeTraders / 10, 100)

  // Recent activity bonus
  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = Math.max(100 - (hoursSinceLastTrade * 10), 0)

  // Weighted average
  const score = (
    volumeScore * 0.4 +
    spreadScore * 0.3 +
    traderScore * 0.2 +
    recencyScore * 0.1
  )

  return Math.min(Math.max(score, 0), 100) // Clamp to 0-100
}
```

```bash
npm test lib/liquidity.test.ts

## You should see tests pass
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **All tests pass**

#### REFACTOR Phase: Improve Code

```typescript
// lib/liquidity.ts - After refactoring
const WEIGHTS = {
  VOLUME: 0.4,
  SPREAD: 0.3,
  TRADERS: 0.2,
  RECENCY: 0.1,
} as const

const SCALE_FACTORS = {
  VOLUME: 1000,
  SPREAD: 1000,
  TRADERS: 10,
  RECENCY_PENALTY: 10,
} as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function calculateLiquidityScore(market: MarketData): number {
  if (market.totalVolume === 0) return 0

  const volumeScore = Math.min(market.totalVolume / SCALE_FACTORS.VOLUME, 100)
  const spreadScore = clamp(100 - (market.bidAskSpread * SCALE_FACTORS.SPREAD), 0, 100)
  const traderScore = Math.min(market.activeTraders / SCALE_FACTORS.TRADERS, 100)

  const hoursSinceLastTrade = (Date.now() - market.lastTradeTime.getTime()) / (1000 * 60 * 60)
  const recencyScore = clamp(100 - (hoursSinceLastTrade * SCALE_FACTORS.RECENCY_PENALTY), 0, 100)

  const weightedScore =
    volumeScore * WEIGHTS.VOLUME +
    spreadScore * WEIGHTS.SPREAD +
    traderScore * WEIGHTS.TRADERS +
    recencyScore * WEIGHTS.RECENCY

  return clamp(weightedScore, 0, 100)
}
```

```bash
npm test lib/liquidity.test.ts

## You should see tests still pass
PASS lib/liquidity.test.ts
  ✓ should return high score for liquid market (3 ms)
  ✓ should return low score for illiquid market (2 ms)
  ✓ should handle edge case: zero volume (1 ms)

3 tests passed
```

✅ **Refactoring complete, tests still pass**

#### Check Coverage

```bash
npm test -- --coverage lib/liquidity.test.ts

File           | % Stmts | % Branch | % Funcs | % Lines
---------------|---------|----------|---------|--------
liquidity.ts   |   100   |   100    |   100   |   100

Coverage: 100% ✅ (Target: 80%)
```

✅ **TDD workflow complete, coverage meets requirements**

**Checkpoint ✅**
- Tests written before code (RED)
- Code implemented after tests fail (GREEN)
- Code refactored after tests pass (REFACTOR)
- Coverage reaches 80%+

---

### Step 3: Use /code-review to Review Code

**Why**
Code review can discover security issues, code quality, and best practice issues, ensuring code is safe to merge.

**Action**
Enter:

```
/code-review
```

**What you should see**
The code-reviewer agent will check:

```markdown
## Code Review Report

## Security Issues (CRITICAL)
- ✅ No hardcoded credentials found
- ✅ No SQL injection vulnerabilities
- ✅ No XSS vulnerabilities

## Code Quality (HIGH)
- ✅ Functions under 50 lines (current: 8 lines max)
- ✅ Files under 800 lines (current: 25 lines)
- ✅ No missing error handling
- ⚠️ Found 1 console.log statement at lib/liquidity.ts:15
  - **Suggestion**: Remove or replace with proper logging

## Best Practices (MEDIUM)
- ✅ Using immutable patterns
- ✅ No TODO/FIXME comments
- ✅ All new code has tests
- ✅ JSDoc for public API present

## Summary
- Critical: 0 issues
- High: 1 issue (console.log)
- Medium: 0 issues

**Recommendation**: Fix console.log issue, then ready for commit.
```

**Next step**
Fix issues based on review results:

```typescript
// Remove console.log
// console.log(`Calculated score: ${score}`)  // Removed
return clamp(weightedScore, 0, 100)
```

**Checkpoint ✅**
- Fix all CRITICAL level issues
- Fix or explain HIGH level issues
- Check if code quality meets standards


---

### Step 4: Use /verify to Verify Code

**Why**
The verify command ensures code is ready for safe commit, with passing build, types, and tests, and no outstanding issues.

**Action**
Enter:

```
/verify
```

**What you should see**
A complete verification report:

```markdown
VERIFICATION: PASS

Build:    OK
Types:    OK (0 errors)
Lint:     OK (0 issues)
Tests:    3/3 passed, 100% coverage
Secrets:  OK (0 found)
Logs:      OK (0 console.logs)

Ready for PR: YES ✅
```

If there are issues, they will be listed in detail:

```markdown
VERIFICATION: FAIL

Build:    OK
Types:    ❌ 2 errors
  - lib/liquidity.ts:15:25 - Type 'string' is not assignable to type 'number'
  - lib/utils.ts:8:10 - Property 'toFixed' does not exist on type 'unknown'
Lint:     ⚠️ 2 warnings
  - lib/liquidity.ts:10:1 - Missing JSDoc for WEIGHTS constant
Tests:    ✅ 3/3 passed, 100% coverage
Secrets:  OK
Logs:      OK

Ready for PR: NO ❌

Fix these issues before committing.
```

**Checkpoint ✅**
- Build passes
- Type checking passes
- Lint passes (or only warnings)
- All tests pass
- Coverage reaches 80%+
- No console.log
- No hardcoded keys

---

### Step 5: Commit Code

**Why**
After verification passes, the code is ready to commit and can be safely pushed to the remote repository.

**Action**
```bash
git add lib/liquidity.ts lib/liquidity.test.ts
git commit -m "feat: add market liquidity score calculator

- Calculate 0-100 score based on volume, spread, traders, recency
- 100% test coverage with unit tests
- Edge cases handled (zero volume, illiquid markets)
- Refactored with constants and helper functions

Closes #123"
```

```bash
git push origin feature/liquidity-score
```

## Common Pitfalls

### Pitfall 1: Skip RED Phase and Write Code Directly

**Wrong approach**:
```
Implement calculateLiquidityScore function first
Then write tests
```

**Consequences**:
- Tests may just "verify existing implementation" without truly validating behavior
- Easy to miss edge cases and error handling
- Lack of confidence when refactoring

**Correct approach**:
```
1. Write tests first (should fail)
2. Run tests to confirm failure (RED)
3. Implement code to make tests pass (GREEN)
4. Refactor while keeping tests passing (REFACTOR)
```

---

### Pitfall 2: Test Coverage Below Requirements

**Wrong approach**:
```
Only write one test, coverage is only 40%
```

**Consequences**:
- Large amount of code without test protection
- Easy to introduce bugs when refactoring
- Code review will return for modifications

**Correct approach**:
```
Ensure 80%+ coverage:
- Unit tests: Cover all functions and branches
- Integration tests: Cover API endpoints
- E2E tests: Cover critical user flows
```

---

### Pitfall 3: Ignore code-review Suggestions

**Wrong approach**:
```
Continue committing even when CRITICAL issues are found
```

**Consequences**:
- Security vulnerabilities brought to production
- Low code quality, difficult to maintain
- Rejected by PR reviewers

**Correct approach**:
```
- CRITICAL issues must be fixed
- HIGH issues should be fixed when possible, or provide justification
- MEDIUM/LOW issues can be optimized later
```

---

### Pitfall 4: Commit Without Running /verify

**Wrong approach**:
```
git commit immediately after writing code, skipping verification
```

**Consequences**:
- Build fails, wasting CI resources
- Type errors cause runtime errors
- Tests fail, main branch status becomes abnormal

**Correct approach**:
```
Always run /verify before committing:
/verify
# Commit only when you see "Ready for PR: YES"
```

---

### Pitfall 5: Test Implementation Details Instead of Behavior

**Wrong approach**:
```typescript
// Test internal state
expect(component.state.count).toBe(5)
```

**Consequences**:
- Tests are fragile, many failures during refactoring
- Tests don't reflect what users actually see

**Correct approach**:
```typescript
// Test user-visible behavior
expect(screen.getByText('Count: 5')).toBeInTheDocument()
```


## Summary

The key points of the TDD development workflow:

1. **Plan first**: Use `/plan` to ensure correct understanding and avoid going in the wrong direction
2. **Test-driven**: Use `/tdd` to force tests first, following RED-GREEN-REFACTOR
3. **Code review**: Use `/code-review` to discover security and quality issues
4. **Comprehensive verification**: Use `/verify` to ensure code is ready for safe commit
5. **Coverage requirements**: Ensure 80%+ test coverage, 100% for critical code

These four commands form a complete development cycle, ensuring code quality and development efficiency.

::: tip Remember this workflow
```
Requirements → /plan → /tdd → /code-review → /verify → Commit
```

Every new feature should follow this workflow.
:::

## Coming Up Next

> In the next lesson, we'll learn **[Code Review Workflow: /code-review and Security Audit](../code-review-workflow/)**.
>
> You'll learn:
> - Deep understanding of code-reviewer agent's checking logic
> - Master security audit checklists
> - Learn to fix common security vulnerabilities
> - Understand how to configure custom review rules

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature              | File Path                                                                                     | Lines     |
|--- | --- | ---|
| /plan command        | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md)            | 1-114     |
| /tdd command        | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)              | 1-327     |
| /verify command      | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md)          | 1-60      |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|

**Key Functions**:
- `plan` calls planner agent to create implementation plan
- `tdd` calls tdd-guide agent to execute RED-GREEN-REFACTOR workflow
- `verify` performs comprehensive verification checks (build, types, lint, tests)
- `code-review` checks security vulnerabilities, code quality, best practices

**Coverage Requirements**:
- Minimum 80% code coverage (branches, functions, lines, statements)
- Financial calculations, authentication logic, security-critical code require 100% coverage

</details>

