---
title: "Core Commands: Slash Commands Guide | Everything Claude Code"
sidebarTitle: "Commands Overview"
subtitle: "Core Commands Explained: 15 Slash Commands Complete Guide"
description: "Learn the 15 slash commands in Everything Claude Code. Master TDD, code review, E2E testing, and verification workflows with practical examples and cheat sheets."
tags:
  - "commands"
  - "slash-commands"
  - "workflow"
prerequisite:
  - "start-quickstart"
order: 50
---

# Core Commands: 15 Slash Commands Complete Guide

## What You'll Learn

- Quickly launch TDD development workflow for high-quality code
- Create systematic implementation plans to avoid missing key steps
- Run comprehensive code reviews and security audits
- Generate end-to-end tests to verify critical user flows
- Automatically fix build errors and save debugging time
- Safely clean up dead code and keep your codebase lean
- Extract and reuse patterns from solved problems
- Manage work states and checkpoints
- Run comprehensive verification to ensure code is ready

## Your Current Challenges

You may encounter these problems during development:

- **Don't know where to start** — Facing new requirements, how to break down implementation steps?
- **Low test coverage** — Lots of code written but insufficient tests, quality hard to guarantee
- **Build error pile-up** — After modifying code, type errors appear one after another, don't know where to fix
- **Non-systematic code review** — Manual review easily misses security issues
- **Repeatedly solving the same problems** — Falling into the same traps again

Everything Claude Code's 15 slash commands are designed to solve these pain points.

## Core Concept

**Commands are entry points to workflows**. Each command encapsulates a complete development process, invoking corresponding agents or skills to help you complete specific tasks.

::: tip Commands vs Agents vs Skills

- **Commands**: Quick entry points you type directly in Claude Code (like `/tdd`, `/plan`)
- **Agents**: Specialized sub-agents called by commands, responsible for specific execution
- **Skills**: Workflow definitions and domain knowledge that agents can reference

A command typically calls one or more agents, and agents may reference relevant skills.

:::

## Commands Overview

15 commands categorized by function:

| Category | Command | Purpose |
|--- | --- | ---|
| **Development Workflow** | `/plan` | Create implementation plan |
| | `/tdd` | Execute test-driven development |
| | `/orchestrate` | Execute multiple agents in sequence |
| **Code Quality** | `/code-review` | Code review |
| | `/build-fix` | Fix build errors |
| | `/refactor-clean` | Clean up dead code |
| | `/verify` | Comprehensive verification |
| **Testing** | `/e2e` | End-to-end testing |
| | `/test-coverage` | Analyze test coverage |
| | `/eval` | Manage eval-driven development |
| **Docs & Architecture** | `/update-docs` | Sync documentation |
| | `/update-codemaps` | Update architecture docs |
| **State Management** | `/checkpoint` | Save work state |
| **Learning & Optimization** | `/learn` | Extract reusable patterns |
| **Configuration** | `/setup-pm` | Configure package manager |

## Development Workflow Commands

### /plan: Plan Complex Features

**Purpose**: Create detailed implementation plans before starting to code.

**Use Cases**:
- Starting new feature development
- Major architectural changes
- Requirements unclear or ambiguous
- Multiple files/components coordinated changes

**Workflow**:

```
1. Restate requirements
   ↓
2. Identify risks and dependencies
   ↓
3. Break down into specific phases
   ↓
4. Wait for your confirmation
```

::: warning Key Feature

The planner agent **will not write any code** until you explicitly confirm the plan.

:::

**Example**:

```
You: /plan I need to add real-time notification functionality

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

**Best Practices**:
- ✅ Plan complex features before implementing
- ✅ Carefully check risks and dependencies
- ✅ Execute in phases, verify each phase
- ❌ Don't skip planning directly

---

### /tdd: Test-Driven Development

**Purpose**: Enforce TDD workflow, ensuring test coverage ≥ 80%.

**Use Cases**:
- Implementing new features
- Fixing bugs (write tests that reproduce the bug first)
- Refactoring existing code
- Writing core business logic

**TDD Loop**:

```
RED → GREEN → REFACTOR → REPEAT

RED:      Write a failing test
GREEN:    Write minimal code to make test pass
REFACTOR: Improve code while keeping tests passing
REPEAT:   Next feature/scenario
```

::: warning Mandatory Requirement

**Must write tests first, then code**. Cannot skip RED phase.

:::

**Example**:

```
You: /tdd I need a function to calculate market liquidity score

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
  // Implementation code...
}
```

## Step 5: Run Tests - Verify PASS
```bash
npm test lib/liquidity.test.ts
PASS ✓ should return high score for liquid market
```

## Step 6: Refactor (IMPROVE)
// Improve code structure...

## Step 7: Verify Tests Still Pass
```bash
npm test lib/liquidity.test.ts
PASS ✓ all tests passing
```

## Step 8: Check Coverage
Coverage: 100% ✅ (Target: 80%)
```

**Best Practices**:
- ✅ Write interface definition first
- ✅ Implement after test fails
- ✅ Test immediately after completing each feature
- ✅ Verify tests pass before and after refactoring
- ✅ Coverage ≥ 80% (100% for critical code)
- ❌ Don't write too much code before testing
- ❌ Don't skip RED phase
- ❌ Don't test implementation details

---

### /orchestrate: Sequential Agent Execution

**Purpose**: Automate sequential workflow of multiple agents.

**Use Cases**:
- Complete feature development (planner → tdd-guide → code-reviewer → security-reviewer)
- Bug fix workflow (explorer → tdd-guide → code-reviewer)
- Security audit (security-reviewer → code-reviewer → architect)

**Workflow Types**:

| Workflow Type | Agent Sequence |
|--- | ---|
| `feature` | planner → tdd-guide → code-reviewer → security-reviewer |
| `bugfix` | explorer → tdd-guide → code-reviewer |
| `refactor` | architect → code-reviewer → tdd-guide |
| `security` | security-reviewer → code-reviewer → architect |

**Example**:

```
You: /orchestrate feature "Add user authentication functionality"

Claude:
### ORCHESTRATION REPORT
Workflow: feature
Task: 添加用户认证功能
Agents: planner → tdd-guide → code-reviewer → security-reviewer

SUMMARY
-------
Successfully implemented user authentication functionality, including registration, login, session management.

AGENT OUTPUTS
-------------
Planner: Created 4-phase implementation plan
TDD Guide: Implemented auth service, 95% coverage
Code Reviewer: Found 3 high-priority issues, fixed
Security Reviewer: Passed security audit, no vulnerabilities

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

**Best Practices**:
- ✅ Use orchestrate for complex features
- ✅ Clear handoff documents between agents
- ✅ Parallel execution for independent checks (code-reviewer and security-reviewer)
- ❌ Don't use orchestrate for simple tasks

---

## Code Quality Commands

### /code-review: Code Review

**Purpose**: Comprehensively review uncommitted code, checking for security issues and code quality.

**Use Cases**:
- Before committing code
- Before merging PR
- After completing feature development

**Check Items**:

| Category | Check Content | Severity |
|--- | --- | ---|
| **Security** | Hardcoded keys, SQL injection, XSS, missing input validation | CRITICAL |
| **Code Quality** | Functions > 50 lines, files > 800 lines, nesting depth > 4 | HIGH |
| **Best Practices** | Mutation patterns, console.log, missing tests, TODO/FIXME | MEDIUM |

**Example**:

```
You: /code-review

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

::: danger Block Commit Rule

If **CRITICAL** or **HIGH** level issues are found, commits will be blocked.

:::

---

### /build-fix: Fix Build Errors

**Purpose**: Fix TypeScript and build errors one by one.

**Use Cases**:
- `npm run build` fails
- TypeScript type errors
- Compilation errors

**Workflow**:

```
1. Run build
   ↓
2. Parse error output, sort by severity
   ↓
3. Fix one by one:
   - Show error context
   - Explain problem
   - Propose fix
   - Apply fix
   - Re-run build
   ↓
4. Generate fix summary
```

**Example**:

```
You: /build-fix

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

::: tip Safety First

Fix only one error at a time to prevent introducing new issues.

:::

---

### /refactor-clean: Clean Up Dead Code

**Purpose**: Safely identify and remove unused code.

**Use Cases**:
- Large amounts of unused files and exports in codebase
- Reduce maintenance burden
- Improve code readability

**Workflow**:

```
1. Run dead code analysis tools
   - knip: Find unused exports and files
   - depcheck: Find unused dependencies
   - ts-prune: Find unused TypeScript exports
   ↓
2. Generate comprehensive report
   ↓
3. Classify by severity
   - SAFE: Test files, unused utility functions
   - CAUTION: API routes, components
   - DANGER: Config files, entry files
   ↓
4. Delete one by one (test first)
   ↓
5. Generate cleanup summary
```

**Example**:

```
You: /refactor-clean

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

::: warning Test First

**Must run tests before deleting code** to ensure existing functionality isn't broken.

:::

---

### /verify: Comprehensive Verification

**Purpose**: Run complete code verification checks.

**Use Cases**:
- Before committing code
- Before merging PR
- When preparing for release

**Check Items** (in order):

1. **Build check** - Run build command
2. **Type check** - Run TypeScript checker
3. **Lint check** - Run linter
4. **Test suite** - Run all tests, report coverage
5. **Console.log audit** - Search source files for console.log
6. **Git status** - Show uncommitted changes

**Example**:

```
You: /verify pre-pr

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

**Parameters**:
- `quick` - Only build + type check
- `full` - All checks (default)
- `pre-commit` - Commit-related checks
- `pre-pr` - Full checks + security scan

---

## Testing Commands

### /e2e: End-to-End Testing

**Purpose**: Generate and run end-to-end tests using Playwright.

**Use Cases**:
- Test critical user flows (login, trading, payment)
- Verify end-to-end integration of multi-step flows
- Test UI interactions and navigation
- Prepare for production deployment

**Workflow**:

```
1. Analyze user flows, identify test scenarios
   ↓
2. Generate Playwright tests (using Page Object pattern)
   ↓
3. Run tests across multiple browsers (Chrome, Firefox, Safari)
   ↓
4. Capture screenshots, videos, traces on failure
   ↓
5. Generate report with results and artifacts
   ↓
6. Identify flaky tests and suggest fixes
```

**Example**:

```
You: /e2e Test market search and view flow

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

**Quick Commands**:

```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/e2e/markets/search.spec.ts

# Run in headed mode (see browser)
npx playwright test --headed

# Debug test
npx playwright test --debug

# View report
npx playwright show-report
```

**Best Practices**:
- ✅ Use Page Object Model for maintainability
- ✅ Use data-testid attributes as selectors
- ✅ Wait for API responses, not arbitrary timeouts
- ✅ Test critical user flows
- ❌ Don't use fragile selectors (CSS classes change)
- ❌ Don't test implementation details

---

### /test-coverage: Test Coverage Analysis

**Purpose**: Analyze test coverage and generate missing tests.

**Use Cases**:
- Coverage below 80%
- Need to supplement tests

**Workflow**:

```
1. Run tests with coverage
   ↓
2. Analyze coverage report (coverage/coverage-summary.json)
   ↓
3. Identify files below 80% coverage threshold
   ↓
4. For each under-covered file:
   - Analyze untested code paths
   - Generate unit tests for functions
   - Generate integration tests for APIs
   ↓
5. Verify new tests pass
   ↓
6. Show before/after coverage metrics
```

**Example**:

```
You: /test-coverage

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

### /eval: Eval-Driven Development

**Purpose**: Manage eval-driven development workflow.

**Use Cases**:
- Eval-driven development (EDD)
- Feature acceptance testing
- Regression testing

**Subcommands**:

- `define <name>` - Create new eval definition
- `check <name>` - Run and check evals
- `report <name>` - Generate comprehensive report
- `list` - Show all evals

**Example - Define Eval**:

```
You: /eval define user-auth

Claude:
Creating eval definition...

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

Please fill in specific evaluation criteria...
```

**Example - Check Eval**:

```
You: /eval check user-auth

Claude:
Running evals...

EVAL CHECK: user-auth
======================
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

**Example - Report Eval**:

```
You: /eval report user-auth

Claude:
Generating comprehensive report...

EVAL REPORT: user-auth
========================
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

## Documentation & Architecture Commands

### /update-docs: Sync Documentation

**Purpose**: Sync documentation from source code.

**Use Cases**:
- Update documentation after code changes
- Keep documentation in sync with code

**Workflow**:

```
1. Read package.json scripts section
   - Generate script reference table
   - Extract descriptions from comments
   ↓
2. Read .env.example
   - Extract all environment variables
   - Record purpose and format
   ↓
3. Generate docs/CONTRIB.md
   - Development workflow
   - Available scripts
   - Environment setup
   - Testing procedures
   ↓
4. Generate docs/RUNBOOK.md
   - Deployment procedures
   - Monitoring and alerts
   - Common issues and fixes
   - Rollback procedures
   ↓
5. Identify outdated documentation
   - Find docs not modified in 90+ days
   - List for manual review
   ↓
6. Show diff summary
```

::: tip Single Source of Truth

package.json and .env.example are the single source of truth.

:::

---

### /update-codemaps: Update Architecture Documentation

**Purpose**: Analyze codebase structure and update architecture documentation.

**Use Cases**:
- After code structure changes
- Need to update architecture docs

**Workflow**:

```
1. Scan all source files for imports, exports, and dependencies
   ↓
2. Generate concise codemaps:
   - codemaps/architecture.md - Overall architecture
   - codemaps/backend.md - Backend structure
   - codemaps/frontend.md - Frontend structure
   - codemaps/data.md - Data models and schemas
   ↓
3. Calculate diff percentage from previous version
   ↓
4. If change > 30%, request user approval before updating
   ↓
5. Add freshness timestamp to each codemap
   ↓
6. Save report to .reports/codemap-diff.txt
```

**Example**:

```
You: /update-codemaps

Claude:
Analyzing codebase structure...

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

## State Management Commands

### /checkpoint: Save Work State

**Purpose**: Create or verify checkpoints in workflows.

**Use Cases**:
- Save important development stages
- Support rollback and progress tracking

**Subcommands**:

- `create <name>` - Create named checkpoint
- `verify <name>` - Verify checkpoint
- `list` - Show all checkpoints
- `clear` - Remove old checkpoints (keep last 5)

**Example**:

```
You: /checkpoint create feature-start

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
You: /checkpoint verify feature-start

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

**Workflow**:

```
[Start] → /checkpoint create "feature-start"
   |
[Implement] → /checkpoint create "core-done"
   |
[Test] → /checkpoint verify "core-done"
   |
[Refactor] → /checkpoint create "refactor-done"
   |
[PR] → /checkpoint verify "feature-start"
```

---

## Learning & Optimization Commands

### /learn: Extract Reusable Patterns

**Purpose**: Analyze current session and extract patterns that can be saved as skills.

**Use Cases**:
- After solving non-trivial problems
- Discover reusable error resolution patterns
- Record project-specific conventions

**Extraction Content**:

1. **Error Resolution Patterns**
   - What error occurred?
   - What was the root cause?
   - How was it fixed?
   - Is it reusable for similar errors?

2. **Debugging Techniques**
   - Non-obvious debugging steps
   - Effective tool combinations
   - Diagnostic patterns

3. **Workarounds**
   - Library quirks
   - API limitations
   - Version-specific fixes

4. **Project-Specific Patterns**
   - Discovered codebase conventions
   - Architectural decisions made
   - Integration patterns

**Example**:

```
You: /learn

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

::: tip Focus Principle

Extract one pattern at a time to keep skills focused.

:::

---

## Configuration Commands

### /setup-pm: Configure Package Manager

**Purpose**: Configure preferred package manager for project or global use.

**Use Cases**:
- Detect current package manager
- Set global or project preferences

**Detection Priority**:

1. Environment variable: `CLAUDE_PACKAGE_MANAGER`
2. Project config: `.claude/package-manager.json`
3. package.json: `packageManager` field
4. Lock files: package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb
5. Global config: `~/.claude/package-manager.json`
6. Fallback: First available package manager

**Supported Package Manager Priority**: pnpm > bun > yarn > npm

**Example**:

```bash
# Detect current package manager
node scripts/setup-package-manager.js --detect

# Set global preference
node scripts/setup-package-manager.js --global pnpm

# Set project preference
node scripts/setup-package-manager.js --project bun

# List available package managers
node scripts/setup-package-manager.js --list
```

**Configuration Files**:

Global config (`~/.claude/package-manager.json`):
```json
{
  "packageManager": "pnpm"
}
```

Project config (`.claude/package-manager.json`):
```json
{
  "packageManager": "bun"
}
```

Environment variable overrides all detection methods:
```bash
# macOS/Linux
export CLAUDE_PACKAGE_MANAGER=pnpm

# Windows (PowerShell)
$env:CLAUDE_PACKAGE_MANAGER = "pnpm"
```

---

## Command Combination Workflows

### Complete Feature Development Workflow

```
1. /plan "Add user authentication functionality"
   ↓ Create implementation plan
2. /tdd "Implement auth service"
   ↓ TDD development
3. /test-coverage
   ↓ Ensure coverage ≥ 80%
4. /code-review
   ↓ Code review
5. /verify pre-pr
   ↓ Comprehensive verification
6. /checkpoint create "auth-feature-done"
   ↓ Save checkpoint
7. /update-docs
   ↓ Update documentation
8. /update-codemaps
   ↓ Update architecture docs
```

### Bug Fix Workflow

```
1. /checkpoint create "bug-start"
   ↓ Save current state
2. /orchestrate bugfix "Fix login error"
   ↓ Automated bug fix workflow
3. /test-coverage
   ↓ Ensure test coverage
4. /verify quick
   ↓ Verify fix
5. /checkpoint verify "bug-start"
   ↓ Compare with checkpoint
```

### Security Audit Workflow

```
1. /orchestrate security "Audit payment flow"
   ↓ Security-first review workflow
2. /e2e "Test payment flow"
   ↓ End-to-end testing
3. /code-review
   ↓ Code review
4. /verify pre-pr
   ↓ Comprehensive verification
```

---

## Command Comparison Cheat Sheet

| Command | Main Purpose | Triggers Agent | Output |
|--- | --- | --- | ---|
| `/plan` | Create implementation plan | planner | Phased plan |
| `/tdd` | TDD development | tdd-guide | Tests + implementation + coverage |
| `/orchestrate` | Execute agents in sequence | Multiple agents | Comprehensive report |
| `/code-review` | Code review | code-reviewer, security-reviewer | Security and quality report |
| `/build-fix` | Fix build errors | build-error-resolver | Fix summary |
| `/refactor-clean` | Clean up dead code | refactor-cleaner | Cleanup summary |
| `/verify` | Comprehensive verification | Bash | Verification report |
| `/e2e` | End-to-end testing | e2e-runner | Playwright tests + artifacts |
| `/test-coverage` | Analyze coverage | Bash | Coverage report + missing tests |
| `/eval` | Eval-driven development | Bash | Eval status report |
| `/checkpoint` | Save state | Bash + Git | Checkpoint report |
| `/learn` | Extract patterns | continuous-learning skill | Skill file |
| `/update-docs` | Sync documentation | doc-updater agent | Documentation update |
| `/update-codemaps` | Update architecture | doc-updater agent | Codemap update |
| `/setup-pm` | Configure package manager | Node.js script | Package manager detection |

---

## Common Pitfalls

### ❌ Don't Skip Planning Phase

For complex features, starting to code directly leads to:
- Missing important dependencies
- Architectural inconsistencies
- Misunderstanding of requirements

**✅ Correct Approach**: Use `/plan` to create a detailed plan, wait for confirmation before implementing.

---

### ❌ Don't Skip RED Phase in TDD

Writing code first then tests is not TDD.

**✅ Correct Approach**: Strictly follow RED → GREEN → REFACTOR loop.

---

### ❌ Don't Ignore CRITICAL Issues from /code-review

Security vulnerabilities can lead to serious consequences like data breaches and financial loss.

**✅ Correct Approach**: Fix all CRITICAL and HIGH level issues before committing.

---

### ❌ Don't Delete Code Without Testing

Dead code analysis may have false positives, direct deletion may break functionality.

**✅ Correct Approach**: Run tests before each deletion to ensure existing functionality isn't broken.

---

### ❌ Don't Forget to Use /learn

Not extracting patterns after solving non-trivial problems means solving the same problem from scratch next time.

**✅ Correct Approach**: Regularly use `/learn` to extract reusable patterns and accumulate knowledge.

---

## Summary

Everything Claude Code's 15 slash commands provide complete development workflow support:

- **Development Workflow**: `/plan` → `/tdd` → `/orchestrate`
- **Code Quality**: `/code-review` → `/build-fix` → `/refactor-clean` → `/verify`
- **Testing**: `/e2e` → `/test-coverage` → `/eval`
- **Documentation & Architecture**: `/update-docs` → `/update-codemaps`
- **State Management**: `/checkpoint`
- **Learning & Optimization**: `/learn`
- **Configuration**: `/setup-pm`

Master these commands to complete development work efficiently, safely, and with quality.

---

## Coming Up Next

> In next lesson, we'll learn **[Core Agents Overview](../agents-overview/)**.
>
> You'll learn:
> - Responsibilities and use cases for 9 specialized agents
> - When to call which agent
> - How agents collaborate
> - How to customize agent configurations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|--- | --- | ---|
| TDD Command | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-327 |
| Plan Command | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114 |
| Code Review Command | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| E2E Command | [`commands/e2e.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/e2e.md) | 1-364 |
| Build Fix Command | [`commands/build-fix.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/build-fix.md) | 1-30 |
| Refactor Clean Command | [`commands/refactor-clean.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/refactor-clean.md) | 1-29 |
| Learn Command | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Checkpoint Command | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify Command | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Test Coverage Command | [`commands/test-coverage.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/test-coverage.md) | 1-28 |
| Setup PM Command | [`commands/setup-pm.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/setup-pm.md) | 1-81 |
| Update Docs Command | [`commands/update-docs.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-docs.md) | 1-32 |
| Orchestrate Command | [`commands/orchestrate.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/orchestrate.md) | 1-173 |
| Update Codemaps Command | [`commands/update-codemaps.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/update-codemaps.md) | 1-18 |
| Eval Command | [`commands/eval.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/eval.md) | 1-121 |
| Plugin Definition | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |

**Key Constants**:
- TDD coverage target: 80% (100% for critical code) - `commands/tdd.md:293-300`

**Key Functions**:
- TDD loop: RED → GREEN → REFACTOR - `commands/tdd.md:40-47`
- Plan wait confirmation mechanism - `commands/plan.md:96`
- Code Review severity levels: CRITICAL, HIGH, MEDIUM - `commands/code-review.md:33`

</details>
