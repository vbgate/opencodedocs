---
title: "Core Agents: 9 Specialized Sub-Agents | Everything Claude Code"
sidebarTitle: "Core Agents"
subtitle: "Core Agents Guide: 9 Specialized Sub-Agents"
description: "Learn 9 specialized agents in Everything Claude Code. Understand when to call planner, architect, tdd-guide for efficient AI-assisted development."
tags:
  - "agents"
  - "ai-assistant"
  - "workflow"
prerequisite:
  - "start/quickstart"
order: 60
---

# Core Agents Guide: 9 Specialized Sub-Agents

## What You'll Learn

- Understand the responsibilities and use cases of 9 specialized agents
- Know which agent to call for different development tasks
- Master how agents collaborate to build efficient development workflows
- Avoid the limitations of "general-purpose AI" by leveraging specialized agents for improved efficiency

## Your Current Challenges

- You often ask Claude to perform tasks, but the responses are not professional or deep enough
- You're unsure when to use commands like `/plan`, `/tdd`, `/code-review`, etc.
- You feel AI's suggestions are too generic and lack specificity
- You want a systematic development workflow but don't know how to organize it

## When to Use This Approach

This tutorial will help you when you need to complete the following tasks:
- Planning before complex feature development
- Writing new features or fixing bugs
- Code review and security audit
- Build error fixes
- End-to-end testing
- Code refactoring and cleanup
- Documentation updates

## Core Concept

Everything Claude Code provides 9 specialized agents, each focused on a specific domain. Just as you would consult different role experts in a real team, different development tasks should call different agents.

::: info Agent vs Command
- **Agent**: A professional AI assistant with domain-specific knowledge and tools
- **Command**: A shortcut for quickly invoking an agent or performing specific operations

For example: The `/tdd` command invokes the `tdd-guide` agent to execute the test-driven development workflow.
:::

### Overview of 9 Agents

| Agent | Role | Typical Scenarios | Key Capabilities |
|--- | --- | --- | ---|
| **planner** | Planning Expert | Creating plans before complex feature development | Requirements analysis, architecture review, step breakdown |
| **architect** | Architect | System design and technical decisions | Architecture evaluation, pattern recommendations, tradeoff analysis |
| **tdd-guide** | TDD Mentor | Writing tests and implementing features | Red-Green-Refactor workflow, coverage guarantees |
| **code-reviewer** | Code Reviewer | Reviewing code quality | Quality, security, maintainability checks |
| **security-reviewer** | Security Auditor | Security vulnerability detection | OWASP Top 10, key leaks, injection protection |
| **build-error-resolver** | Build Error Fixer | Fixing TypeScript/build errors | Minimal fixes, type inference |
| **e2e-runner** | E2E Testing Expert | End-to-end test management | Playwright tests, flaky test management, artifacts |
| **refactor-cleaner** | Refactoring Cleaner | Deleting dead code and duplicates | Dependency analysis, safe deletion, documentation |
| **doc-updater** | Documentation Updater | Generating and updating documentation | Codemap generation, AST analysis |

## Detailed Introduction

### 1. Planner - Planning Expert

**When to use**: When implementing complex features, architectural changes, or large-scale refactoring.

::: tip Best Practice
Before writing code, use `/plan` to create an implementation plan. This helps avoid missing dependencies, identify potential risks, and establish a reasonable implementation order.
:::

**Core Capabilities**:
- Requirements analysis and clarification
- Architecture review and dependency identification
- Detailed implementation step breakdown
- Risk identification and mitigation plans
- Testing strategy planning

**Output Format**:
```markdown
# Implementation Plan: [Feature Name]

## Overview
[2-3 sentence summary]

## Requirements
- [Requirement 1]
- [Requirement 2]

## Architecture Changes
- [Change 1: File path and description]
- [Change 2: File path and description]

## Implementation Steps

### Phase 1: [Phase Name]
1. **[Step Name]** (File: path/to/file.ts)
   - Action: Specific operation
   - Why: Reason
   - Dependencies: None / Requires step X
   - Risk: Low/Medium/High

## Testing Strategy
- Unit tests: [Files to test]
- Integration tests: [Flows to test]
- E2E tests: [User journeys to test]

## Risks & Mitigations
- **Risk**: [Description]
  - Mitigation: [How to resolve]

## Success Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

**Example Scenarios**:
- Adding a new API endpoint (requires database migration, cache updates, documentation)
- Refactoring a core module (affects multiple dependencies)
- Adding a new feature (involves frontend, backend, database)

### 2. Architect - Architect

**When to use**: When designing system architecture, evaluating technical solutions, or making architectural decisions.

**Core Capabilities**:
- System architecture design
- Technical tradeoff analysis
- Design pattern recommendations
- Scalability planning
- Security considerations

**Architecture Principles**:
- **Modularity**: Single responsibility, high cohesion, low coupling
- **Scalability**: Horizontal scaling, stateless design
- **Maintainability**: Clear structure, consistent patterns
- **Security**: Defense in depth, least privilege
- **Performance**: Efficient algorithms, minimal network requests

**Common Patterns**:

**Frontend Patterns**:
- Component composition, Container/Presenter pattern, custom Hooks, Context global state, code splitting

**Backend Patterns**:
- Repository pattern, Service layer, Middleware pattern, Event-driven architecture, CQRS

**Data Patterns**:
- Normalized database, denormalized read performance, event sourcing, caching layer, eventual consistency

**Architecture Decision Record (ADR) Format**:
```markdown
# ADR-001: Using Redis to Store Semantic Search Vectors

## Context
Need to store and query 1536-dimensional embedding vectors for semantic market search.

## Decision
Use Redis Stack's vector search functionality.

## Consequences

### Positive
- Fast vector similarity search (<10ms)
- Built-in KNN algorithm
- Simple deployment
- Good performance (up to 10K vectors)

### Negative
- In-memory storage (expensive for large datasets)
- Single point of failure (no clustering)
- Only supports cosine similarity

### Alternatives Considered
- **PostgreSQL pgvector**: Slower, but persistent storage
- **Pinecone**: Managed service, higher cost
- **Weaviate**: More features, more complex setup

## Status
Accepted

## Date
2025-01-15
```

### 3. TDD Guide - TDD Mentor

**When to use**: When writing new features, fixing bugs, or refactoring code.

::: warning Core Principle
TDD Guide requires all code to be **written with tests first**, then implemented, ensuring 80%+ test coverage.
:::

**TDD Workflow**:

**Step 1: Write Tests First (RED)**
```typescript
describe('searchMarkets', () => {
  it('returns semantically similar markets', async () => {
    const results = await searchMarkets('election')

    expect(results).toHaveLength(5)
    expect(results[0].name).toContain('Trump')
    expect(results[1].name).toContain('Biden')
  })
})
```

**Step 2: Run Tests (Verify Failure)**
```bash
npm test
# Test should fail - we haven't implemented yet
```

**Step 3: Write Minimal Implementation (GREEN)**
```typescript
export async function searchMarkets(query: string) {
  const embedding = await generateEmbedding(query)
  const results = await vectorSearch(embedding)
  return results
}
```

**Step 4: Run Tests (Verify Pass)**
```bash
npm test
# Test should now pass
```

**Step 5: Refactor (IMPROVE)**
- Remove duplicate code
- Improve naming
- Optimize performance
- Enhance readability

**Step 6: Verify Coverage**
```bash
npm run test:coverage
# Verify 80%+ coverage
```

**Required Test Types**:

1. **Unit Tests** (Required): Test independent functions
2. **Integration Tests** (Required): Test API endpoints and database operations
3. **E2E Tests** (Critical flows): Test complete user journeys

**Required Edge Case Coverage**:
- Null/Undefined: What if input is null?
- Empty: What if array/string is empty?
- Invalid types: What if wrong type is passed?
- Boundaries: Minimum/maximum values
- Errors: Network failures, database errors
- Race conditions: Concurrent operations
- Large data: Performance with 10k+ items
- Special characters: Unicode, emoji, SQL characters

### 4. Code Reviewer - Code Reviewer

**When to use**: Immediately after writing or modifying code.

::: tip Mandatory Use
Code Reviewer is a **must-use** agent; all code changes must pass its review.
:::

**Review Checklist**:

**Security Checks (CRITICAL)**:
- Hardcoded credentials (API keys, passwords, tokens)
- SQL injection risks (string concatenation in queries)
- XSS vulnerabilities (unescaped user input)
- Missing input validation
- Insecure dependencies (outdated, vulnerable)
- Path traversal risks (user-controlled file paths)
- CSRF vulnerabilities
- Authentication bypass

**Code Quality (HIGH)**:
- Large functions (>50 lines)
- Large files (>800 lines)
- Deep nesting (>4 levels)
- Missing error handling (try/catch)
- console.log statements
- Changing patterns
- Missing tests for new code

**Performance (MEDIUM)**:
- Inefficient algorithms (O(n²) when O(n log n) is feasible)
- Unnecessary re-renders in React
- Missing memoization
- Large bundle sizes
- Unoptimized images
- Missing caching
- N+1 queries

**Best Practices (MEDIUM)**:
- Emojis in code/comments
- TODO/FIXME without associated ticket
- Missing JSDoc for public APIs
- Accessibility issues (missing ARIA labels, poor contrast)
- Poor variable naming (x, tmp, data)
- Unexplained magic numbers
- Inconsistent formatting

**Review Output Format**:
```markdown
[CRITICAL] Hardcoded API key
File: src/api/client.ts:42
Issue: API key exposed in source code
Fix: Move to environment variable

const apiKey = "sk-abc123";  // ❌ Bad
const apiKey = process.env.API_KEY;  // ✓ Good
```

**Approval Criteria**:
- ✅ Approve: No CRITICAL or HIGH issues
- ⚠️ Warning: Only MEDIUM issues (can be merged with caution)
- ❌ Block: CRITICAL or HIGH issues found

### 5. Security Reviewer - Security Auditor

**When to use**: After writing code that handles user input, authentication, API endpoints, or sensitive data.

::: danger Critical
Security Reviewer flags key leaks, SSRF, injection, insecure encryption, and OWASP Top 10 vulnerabilities. CRITICAL issues must be fixed immediately!
:::

**Core Responsibilities**:
1. **Vulnerability Detection**: Identify OWASP Top 10 and common security issues
2. **Key Detection**: Find hardcoded API keys, passwords, tokens
3. **Input Validation**: Ensure all user input is properly sanitized
4. **Authentication/Authorization**: Verify proper access controls
5. **Dependency Security**: Check for vulnerable npm packages
6. **Security Best Practices**: Enforce secure coding patterns

**OWASP Top 10 Checks**:

1. **Injection** (SQL, NoSQL, Command)
   - Are queries parameterized?
   - Is user input sanitized?
   - Is ORM used safely?

2. **Broken Authentication**
   - Are passwords hashed (bcrypt, argon2)?
   - Are JWTs properly validated?
   - Are sessions secure?
   - Is MFA in place?

3. **Sensitive Data Exposure**
   - Is HTTPS enforced?
   - Are keys in environment variables?
   - Is PII encrypted at rest?
   - Are logs sanitized?

4. **XML External Entities (XXE)**
   - Is XML parser configured securely?
   - Is external entity processing disabled?

5. **Broken Access Control**
   - Does every route check authorization?
   - Are object references indirect?
   - Is CORS configured correctly?

6. **Security Misconfiguration**
   - Are default credentials changed?
   - Is error handling secure?
   - Are security headers set?
   - Is debug mode disabled in production?

7. **Cross-Site Scripting (XSS)**
   - Is output escaped/sanitized?
   - Is Content-Security-Policy set?
   - Does framework escape by default?

8. **Insecure Deserialization**
   - Is user input safely deserialized?
   - Are deserialization libraries up to date?

9. **Using Components with Known Vulnerabilities**
   - Are all dependencies up to date?
   - Is npm audit clean?
   - Are CVEs monitored?

10. **Insufficient Logging & Monitoring**
    - Are security events logged?
    - Are logs monitored?
    - Are alerts configured?

**Common Vulnerability Patterns**:

**1. Hardcoded Keys (CRITICAL)**
```javascript
// ❌ CRITICAL: Hardcoded secrets
const apiKey = "sk-proj-xxxxx"

// ✅ CORRECT: Environment variables
const apiKey = process.env.OPENAI_API_KEY
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

**2. SQL Injection (CRITICAL)**
```javascript
// ❌ CRITICAL: SQL injection vulnerability
const query = `SELECT * FROM users WHERE id = ${userId}`

// ✅ CORRECT: Parameterized queries
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
```

**3. XSS (HIGH)**
```javascript
// ❌ HIGH: XSS vulnerability
element.innerHTML = userInput

// ✅ CORRECT: Use textContent or sanitize
element.textContent = userInput
```

**Security Review Report Format**:
```markdown
# Security Review Report

**File/Component:** [path/to/file.ts]
**Reviewed:** YYYY-MM-DD
**Reviewer:** security-reviewer agent

## Summary
- **Critical Issues:** X
- **High Issues:** Y
- **Medium Issues:** Z
- **Low Issues:** W
- **Risk Level:** 🔴 HIGH / 🟡 MEDIUM / 🟢 LOW

## Critical Issues (Fix Immediately)

### 1. [Issue Title]
**Severity:** CRITICAL
**Category:** SQL Injection / XSS / Authentication / etc.
**Location:** `file.ts:123`

**Issue:**
[Vulnerability description]

**Impact:**
[What happens if exploited]

**Proof of Concept:**
```javascript
// Exploit example
```

**Remediation:**
```javascript
// ✅ Secure implementation
```

**References:**
- OWASP: [link]
- CWE: [number]
```

### 6. Build Error Resolver - Build Error Fixer

**When to use**: When build fails or type errors occur.

::: tip Minimal Fixes
Build Error Resolver's core principle is **minimal fixes**—only fix errors, do not make architectural changes or refactor.
:::

**Core Responsibilities**:
1. **TypeScript Error Fixes**: Fix type errors, inference issues, generic constraints
2. **Build Error Fixes**: Resolve compilation failures, module resolution
3. **Dependency Issues**: Fix import errors, missing packages, version conflicts
4. **Configuration Errors**: Resolve tsconfig.json, webpack, Next.js configuration issues
5. **Minimal Changes**: Make the smallest possible changes to fix errors
6. **No Architectural Changes**: Only fix errors, do not refactor or redesign

**Diagnostic Commands**:
```bash
# TypeScript type checking (no output)
npx tsc --noEmit

# TypeScript with pretty output
npx tsc --noEmit --pretty

# Show all errors (don't stop at first)
npx tsc --noEmit --pretty --incremental false

# Check specific file
npx tsc --noEmit path/to/file.ts

# ESLint check
npx eslint . --ext .ts,.tsx,.js,.jsx

# Next.js build (production)
npm run build
```

**Error Fixing Workflow**:

**1. Collect All Errors**
```
a) Run full type check
   - npx tsc --noEmit --pretty
   - Capture ALL errors, not just the first

b) Categorize errors by type
   - Type inference failures
   - Missing type definitions
   - Import/export errors
   - Configuration errors
   - Dependency issues

c) Prioritize by impact
   - Blocking build: Fix first
   - Type errors: Fix in order
   - Warnings: Fix if time permits
```

**2. Fix Strategy (Minimal Changes)**
```
For each error:

1. Understand the error
   - Read the error message carefully
   - Check file and line numbers
   - Understand expected vs actual types

2. Find the minimal fix
   - Add missing type annotations
   - Fix import statements
   - Add null checks
   - Use type assertions (last resort)

3. Verify the fix doesn't break other code
   - Run tsc after each fix
   - Check related files
   - Ensure no new errors are introduced

4. Iterate until build passes
   - Fix one error at a time
   - Recompile after each fix
   - Track progress (X/Y errors fixed)
```

**Common Error Patterns and Fixes**:

**Pattern 1: Type Inference Failure**
```typescript
// ❌ ERROR: Parameter 'x' implicitly has an 'any' type
function add(x, y) {
  return x + y
}

// ✅ FIX: Add type annotations
function add(x: number, y: number): number {
  return x + y
}
```

**Pattern 2: Null/Undefined Errors**
```typescript
// ❌ ERROR: Object is possibly 'undefined'
const name = user.name.toUpperCase()

// ✅ FIX: Optional chaining
const name = user?.name?.toUpperCase()

// ✅ OR: Null check
const name = user && user.name ? user.name.toUpperCase() : ''
```

**Pattern 3: Import Errors**
```typescript
// ❌ ERROR: Cannot find module '@/lib/utils'
import { formatDate } from '@/lib/utils'

// ✅ FIX 1: Check if tsconfig paths are correct
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// ✅ FIX 2: Use relative import
import { formatDate } from '../lib/utils'
```

**Minimal Difference Strategy**:

**CRITICAL: Make the smallest possible changes**

**DO:**
✅ Add missing type annotations
✅ Add required null checks
✅ Fix imports/exports
✅ Add missing dependencies
✅ Update type definitions
✅ Fix configuration files

**DON'T:**
❌ Refactor unrelated code
❌ Change architecture
❌ Rename variables/functions (unless causing errors)
❌ Add new features
❌ Change logic flow (unless fixing errors)
❌ Optimize performance
❌ Improve code style

### 7. E2E Runner - E2E Testing Expert

**When to use**: When generating, maintaining, and running E2E tests.

::: tip Value of End-to-End Testing
E2E tests are the last line of defense before production; they catch integration issues that unit tests miss.
:::

**Core Responsibilities**:
1. **Test Journey Creation**: Write Playwright tests for user flows
2. **Test Maintenance**: Keep tests in sync with UI changes
3. **Flaky Test Management**: Identify and isolate unstable tests
4. **Artifact Management**: Capture screenshots, videos, traces
5. **CI/CD Integration**: Ensure tests run reliably in pipelines
6. **Test Reporting**: Generate HTML reports and JUnit XML

**Test Commands**:
```bash
# Run all E2E tests
npx playwright test

# Run specific test file
npx playwright test tests/markets.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Debug tests with inspector
npx playwright test --debug

# Generate test code from browser actions
npx playwright codegen http://localhost:3000

# Run tests with trace
npx playwright test --trace on

# Show HTML report
npx playwright show-report

# Update snapshots
npx playwright test --update-snapshots

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

**E2E Testing Workflow**:

**1. Test Planning Phase**
```
a) Identify critical user journeys
   - Authentication flow (login, logout, registration)
   - Core features (market creation, trading, search)
   - Payment flow (deposit, withdrawal)
   - Data integrity (CRUD operations)

b) Define test scenarios
   - Happy path (everything works)
   - Edge cases (empty states, limits)
   - Error cases (network failures, validation)

c) Prioritize by risk
   - HIGH: Financial transactions, authentication
   - MEDIUM: Search, filtering, navigation
   - LOW: UI polish, animations, styling
```

**2. Test Creation Phase**
```
For each user journey:

1. Write tests in Playwright
   - Use Page Object Model (POM) pattern
   - Add meaningful test descriptions
   - Add assertions at key steps
   - Add screenshots at key points

2. Make tests resilient
   - Use appropriate locators (data-testid preferred)
   - Add waits for dynamic content
   - Handle race conditions
   - Implement retry logic

3. Add artifact capture
   - Screenshots on failure
   - Video recording
   - Traces for debugging
   - Network logs when needed
```

**Playwright Test Structure**:

**Test File Organization**:
```
tests/
├── e2e/                       # End-to-end user journeys
│   ├── auth/                  # Authentication flow
│   │   ├── login.spec.ts
│   │   ├── logout.spec.ts
│   │   └── register.spec.ts
│   ├── markets/               # Market functionality
│   │   ├── browse.spec.ts
│   │   ├── search.spec.ts
│   │   ├── create.spec.ts
│   │   └── trade.spec.ts
│   ├── wallet/                # Wallet operations
│   │   ├── connect.spec.ts
│   │   └── transactions.spec.ts
│   └── api/                   # API endpoint tests
│       ├── markets-api.spec.ts
│       └── search-api.spec.ts
├── fixtures/                  # Test data and helpers
│   ├── auth.ts                # Authentication fixtures
│   ├── markets.ts             # Market test data
│   └── wallets.ts             # Wallet fixtures
└── playwright.config.ts       # Playwright configuration
```

**Page Object Model Pattern**:
```typescript
// pages/MarketsPage.ts
import { Page, Locator } from '@playwright/test'

export class MarketsPage {
  readonly page: Page
  readonly searchInput: Locator
  readonly marketCards: Locator
  readonly createMarketButton: Locator
  readonly filterDropdown: Locator

  constructor(page: Page) {
    this.page = page
    this.searchInput = page.locator('[data-testid="search-input"]')
    this.marketCards = page.locator('[data-testid="market-card"]')
    this.createMarketButton = page.locator('[data-testid="create-market-btn"]')
    this.filterDropdown = page.locator('[data-testid="filter-dropdown"]')
  }

  async goto() {
    await this.page.goto('/markets')
    await this.page.waitForLoadState('networkidle')
  }

  async searchMarkets(query: string) {
    await this.searchInput.fill(query)
    await this.page.waitForResponse(resp => resp.url().includes('/api/markets/search'))
    await this.page.waitForLoadState('networkidle')
  }

  async getMarketCount() {
    return await this.marketCards.count()
  }

  async clickMarket(index: number) {
    await this.marketCards.nth(index).click()
  }

  async filterByStatus(status: string) {
    await this.filterDropdown.selectOption(status)
    await this.page.waitForLoadState('networkidle')
  }
}
```

**Best Practice Test Example**:
```typescript
// tests/e2e/markets/search.spec.ts
import { test, expect } from '@playwright/test'
import { MarketsPage } from '../../pages/MarketsPage'

test.describe('Market Search', () => {
  let marketsPage: MarketsPage

  test.beforeEach(async ({ page }) => {
    marketsPage = new MarketsPage(page)
    await marketsPage.goto()
  })

  test('should search markets by keyword', async ({ page }) => {
    // Arrange
    await expect(page).toHaveTitle(/Markets/)

    // Act
    await marketsPage.searchMarkets('trump')

    // Assert
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBeGreaterThan(0)

    // Verify first result contains search term
    const firstMarket = marketsPage.marketCards.first()
    await expect(firstMarket).toContainText(/trump/i)

    // Take screenshot for verification
    await page.screenshot({ path: 'artifacts/search-results.png' })
  })

  test('should handle no results gracefully', async ({ page }) => {
    // Act
    await marketsPage.searchMarkets('xyznonexistentmarket123')

    // Assert
    await expect(page.locator('[data-testid="no-results"]')).toBeVisible()
    const marketCount = await marketsPage.getMarketCount()
    expect(marketCount).toBe(0)
  })
})
```

**Flaky Test Management**:

**Identify Flaky Tests**:
```bash
# Run tests multiple times to check stability
npx playwright test tests/markets/search.spec.ts --repeat-each=10

# Run specific tests with retries
npx playwright test tests/markets/search.spec.ts --retries=3
```

**Isolation Mode**:
```typescript
// Mark flaky tests for isolation
test('flaky: market search with complex query', async ({ page }) => {
  test.fixme(true, 'Test is flaky - Issue #123')

  // Test code here...
})

// Or use conditional skip
test('market search with complex query', async ({ page }) => {
  test.skip(process.env.CI, 'Test is flaky in CI - Issue #123')

  // Test code here...
})
```

**Common Flakiness Causes and Fixes**:

**1. Race Conditions**
```typescript
// ❌ FLAKY: Don't assume element is ready
await page.click('[data-testid="button"]')

// ✅ STABLE: Wait for element to be ready
await page.locator('[data-testid="button"]').click() // Built-in auto-wait
```

**2. Network Timing**
```typescript
// ❌ FLAKY: Arbitrary timeout
await page.waitForTimeout(5000)

// ✅ STABLE: Wait for specific condition
await page.waitForResponse(resp => resp.url().includes('/api/markets'))
```

**3. Animation Timing**
```typescript
// ❌ FLAKY: Click during animation
await page.click('[data-testid="menu-item"]')

// ✅ STABLE: Wait for animation to complete
await page.locator('[data-testid="menu-item"]').waitFor({ state: 'visible' })
await page.waitForLoadState('networkidle')
await page.click('[data-testid="menu-item"]')
```

### 8. Refactor Cleaner - Refactoring Cleaner

**When to use**: When deleting unused code, duplicates, and performing refactoring.

::: warning Proceed with Caution
Refactor Cleaner runs analysis tools (knip, depcheck, ts-prune) to identify dead code and safely delete it. Always verify thoroughly before deletion!
:::

**Core Responsibilities**:
1. **Dead Code Detection**: Find unused code, exports, dependencies
2. **Duplicate Elimination**: Identify and merge duplicate code
3. **Dependency Cleanup**: Remove unused packages and imports
4. **Safe Refactoring**: Ensure changes don't break functionality
5. **Documentation**: Track all deletions in `DELETION_LOG.md`

**Detection Tools**:
- **knip**: Find unused files, exports, dependencies, types
- **depcheck**: Identify unused npm dependencies
- **ts-prune**: Find unused TypeScript exports
- **eslint**: Check unused disable-directives and variables

**Analysis Commands**:
```bash
# Run knip to find unused exports/files/dependencies
npx knip

# Check for unused dependencies
npx depcheck

# Find unused TypeScript exports
npx ts-prune

# Check for unused disable-directives
npx eslint . --report-unused-disable-directives
```

**Refactoring Workflow**:

**1. Analysis Phase**
```
a) Run detection tools in parallel
b) Collect all findings
c) Categorize by risk level:
   - SAFE: Unused exports, unused dependencies
   - CAREFUL: Possibly used via dynamic imports
   - RISKY: Public APIs, shared utilities
```

**2. Risk Assessment**
```
For each item to delete:
- Check if imported anywhere (grep search)
- Verify no dynamic imports (grep string patterns)
- Check if part of public API
- Review history for context
- Test impact on build/tests
```

**3. Safe Deletion Process**
```
a) Start with SAFE items only
b) Delete one category at a time:
   1. Unused npm dependencies
   2. Unused internal exports
   3. Unused files
   4. Duplicate code
c) Run tests after each batch
d) Create git commit for each batch
```

**4. Duplicate Consolidation**
```
a) Find duplicate components/utilities
b) Select best implementation:
   - Most features
   - Best tests
   - Most recently used
c) Update all imports to use selected version
d) Delete duplicates
e) Verify tests still pass
```

**Deletion Log Format**:

Create/update `docs/DELETION_LOG.md` with the following structure:
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

**Safety Checklist**:

**Before deleting anything:**
- [ ] Run detection tools
- [ ] Grep all references
- [ ] Check dynamic imports
- [ ] Review history
- [ ] Check if public API
- [ ] Run all tests
- [ ] Create backup branch
- [ ] Document in DELETION_LOG.md

**After each deletion:**
- [ ] Build succeeds
- [ ] Tests pass
- [ ] No console errors
- [ ] Commit changes
- [ ] Update DELETION_LOG.md

**Common Patterns to Delete**:

**1. Unused Imports**
```typescript
// ❌ Remove unused imports
import { useState, useEffect, useMemo } from 'react' // Only useState used

// ✅ Keep only what's used
import { useState } from 'react'
```

**2. Dead Code Branches**
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

**3. Duplicate Components**
```typescript
// ❌ Multiple similar components
components/Button.tsx
components/PrimaryButton.tsx
components/NewButton.tsx

// ✅ Consolidate to one
components/Button.tsx (with variant prop)
```

### 9. Doc Updater - Documentation Updater

**When to use**: When updating codemaps and documentation.

::: tip Documentation-Code Sync
Doc Updater runs `/update-codemaps` and `/update-docs`, generating `docs/CODEMAPS/*`, updating READMEs and guides.
:::

**Core Responsibilities**:
1. **Codemap Generation**: Create architecture mappings from codebase structure
2. **Documentation Updates**: Refresh READMEs and guides from code
3. **AST Analysis**: Use TypeScript Compiler API to understand structure
4. **Dependency Mapping**: Track imports/exports across modules
5. **Documentation Quality**: Ensure documentation matches actual code

**Analysis Tools**:
- **ts-morph**: TypeScript AST analysis and manipulation
- **TypeScript Compiler API**: Deep code structure analysis
- **madge**: Dependency graph visualization
- **jsdoc-to-markdown**: Generate documentation from JSDoc comments

**Analysis Commands**:
```bash
# Analyze TypeScript project structure (run custom script using ts-morph library)
npx tsx scripts/codemaps/generate.ts

# Generate dependency graph
npx madge --image graph.svg src/

# Extract JSDoc comments
npx jsdoc2md src/**/*.ts
```

**Codemap Generation Workflow**:

**1. Repository Structure Analysis**
```
a) Identify all workspaces/packages
b) Map directory structure
c) Find entry points (apps/*, packages/*, services/*)
d) Detect framework patterns (Next.js, Node.js, etc.)
```

**2. Module Analysis**
```
For each module:
- Extract exports (public API)
- Map imports (dependencies)
- Identify routes (API routes, pages)
- Find database models (Supabase, Prisma)
- Locate queue/worker modules
```

**3. Generate Codemaps**
```
Structure:
docs/CODEMAPS/
├── INDEX.md              # Overview of all areas
├── frontend.md           # Frontend structure
├── backend.md            # Backend/API structure
├── database.md           # Database schema
├── integrations.md       # External services
└── workers.md            # Background tasks
```

**Codemap Format**:
```markdown
# [Area] Codemap

**Last Updated:** YYYY-MM-DD
**Entry Points:** List of main files

## Architecture

[ASCII diagram of component relationships]

## Key Modules

| Module | Purpose | Exports | Dependencies |
|--- | --- | --- | ---|
| ... | ... | ... | ... |

## Data Flow

[Description of how data flows through this area]

## External Dependencies

- package-name - Purpose, Version
- ...

## Related Areas

Links to other codemaps that interact with this area
```

**Documentation Update Workflow**:

**1. Extract Documentation from Code**
```
- Read JSDoc/TSDoc comments
- Extract README sections from package.json
- Parse environment variables from .env.example
- Collect API endpoint definitions
```

**2. Update Documentation Files**
```
Files to update:
- README.md - Project overview, setup instructions
- docs/GUIDES/*.md - Feature guides, tutorials
- package.json - Description, script documentation
- API documentation - Endpoint specifications
```

**3. Documentation Validation**
```
- Verify all mentioned files exist
- Check all links are valid
- Ensure examples are runnable
- Verify code snippets compile
```

**Example Project-Specific Codemaps**:

**Frontend Codemap (docs/CODEMAPS/frontend.md)**:
```markdown
# Frontend Architecture

**Last Updated:** YYYY-MM-DD
**Framework:** Next.js 15.1.4 (App Router)
**Entry Point:** website/src/app/layout.tsx

## Structure

website/src/
├── app/                # Next.js App Router
│   ├── api/           # API routes
│   ├── markets/       # Market pages
│   ├── bot/           # Bot interactions
│   └── creator-dashboard/
├── components/        # React components
├── hooks/             # Custom hooks
└── lib/               # Utilities

## Key Components

| Component | Purpose | Location |
|--- | --- | ---|
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

**Backend Codemap (docs/CODEMAPS/backend.md)**:
```markdown
# Backend Architecture

**Last Updated:** YYYY-MM-DD
**Runtime:** Next.js API Routes
**Entry Point:** website/src/app/api/

## API Routes

| Route | Method | Purpose |
|--- | --- | ---|
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

**README Update Template**:

When updating README.md:
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

- `src/app` - Next.js App Router pages and API routes
- `src/components` - Reusable React components
- `src/lib` - Utility libraries and clients

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

## Which Agent to Call When

Based on your task type, choose the appropriate agent:

| Task Type | Recommended Call | Alternative |
|--- | --- | ---|
| **Plan New Feature** | `/plan` → planner agent | Manually call planner agent |
| **System Architecture Design** | Manually call architect agent | `/orchestrate` → Sequential agent calls |
| **Write New Feature** | `/tdd` → tdd-guide agent | planner → tdd-guide |
| **Fix Bug** | `/tdd` → tdd-guide agent | build-error-resolver (if type errors) |
| **Code Review** | `/code-review` → code-reviewer agent | Manually call code-reviewer agent |
| **Security Audit** | Manually call security-reviewer agent | code-reviewer (partial coverage) |
| **Build Failure** | `/build-fix` → build-error-resolver agent | Manual fix |
| **E2E Testing** | `/e2e` → e2e-runner agent | Manually write Playwright tests |
| **Clean Dead Code** | `/refactor-clean` → refactor-cleaner agent | Manual deletion |
| **Update Documentation** | `/update-docs` → doc-updater agent | `/update-codemaps` → doc-updater agent |

## Agent Collaboration Examples

### Scenario 1: Develop New Feature from Scratch

```
1. /plan (planner agent)
   - Create implementation plan
   - Identify dependencies and risks

2. /tdd (tdd-guide agent)
   - Write tests according to plan
   - Implement features
   - Ensure coverage

3. /code-review (code-reviewer agent)
   - Review code quality
   - Check for security vulnerabilities

4. /verify (command)
   - Run build, type checking, tests
   - Check console.log, git status
```

### Scenario 2: Fix Build Errors

```
1. /build-fix (build-error-resolver agent)
   - Fix TypeScript errors
   - Ensure build passes

2. /test-coverage (command)
   - Check if coverage meets requirements

3. /code-review (code-reviewer agent)
   - Review fixed code
```

### Scenario 3: Code Cleanup

```
1. /refactor-clean (refactor-cleaner agent)
   - Run detection tools
   - Delete dead code
   - Consolidate duplicate code

2. /update-docs (doc-updater agent)
   - Update codemaps
   - Refresh documentation

3. /verify (command)
   - Run all checks
```

## Lesson Summary

Everything Claude Code provides 9 specialized agents, each focused on a specific domain:

1. **planner** - Complex feature planning
2. **architect** - System architecture design
3. **tdd-guide** - TDD workflow execution
4. **code-reviewer** - Code quality review
5. **security-reviewer** - Security vulnerability detection
6. **build-error-resolver** - Build error fixes
7. **e2e-runner** - End-to-end test management
8. **refactor-cleaner** - Dead code cleanup
9. **doc-updater** - Documentation and codemap updates

**Core Principles**:
- Choose the appropriate agent based on task type
- Leverage collaboration between agents to build efficient workflows
- Complex tasks can call multiple agents in sequence
- Always perform code review after code changes

## Coming Up Next

> In the next lesson, we'll learn **[TDD Development Workflow](../tdd-workflow/)**.
>
> You'll learn:
> - How to use `/plan` to create implementation plans
> - How to use `/tdd` to execute the Red-Green-Refactor cycle
> - How to ensure 80%+ test coverage
> - How to use `/verify` to run comprehensive verification

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|--- | --- | ---|
| Planner Agent | [agents/planner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120 |
| Architect Agent | [agents/architect.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/architect.md) | 1-212 |
| TDD Guide Agent | [agents/tdd-guide.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281 |
| Code Reviewer Agent | [agents/code-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| Security Reviewer Agent | [agents/security-reviewer.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| Build Error Resolver Agent | [agents/build-error-resolver.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/build-error-resolver.md) | 1-533 |
| E2E Runner Agent | [agents/e2e-runner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/e2e-runner.md) | 1-709 |
| Refactor Cleaner Agent | [agents/refactor-cleaner.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/refactor-cleaner.md) | 1-307 |
| Doc Updater Agent | [agents/doc-updater.md](https://github.com/affaan-m/everything-claude-code/blob/main/agents/doc-updater.md) | 1-453 |

**Key Constants**:
- None

**Key Functions**:
- None

</details>
