---
title: "Verification Loop Guide | Everything Claude Code"
sidebarTitle: "Verification Loop"
subtitle: "Verification Loop: Checkpoint & Evals"
description: "Learn Everything Claude Code's verification loop. Master checkpoint management, Eval-Driven Development, and continuous verification to ensure code quality."
tags:
  - "verification"
  - "checkpoint"
  - "evals"
  - "quality-gates"
prerequisite:
  - "platforms-tdd-workflow"
order: 120
---

# Verification Loop: Checkpoint & Evals

## What You'll Learn

After learning the verification loop mechanism, you can:

- Use `/checkpoint` to save and restore working state
- Use `/verify` to run comprehensive code quality checks
- Master Eval-Driven Development (EDD) concept, define and run evals
- Establish continuous verification loop, maintain code quality during development

## Your Current Challenges

You just completed a feature but不敢 submit a PR because:
- Unsure if existing functionality was broken
- Worried about declining test coverage
- Forgot the original goal, unsure if you've deviated from direction
- Want to rollback to a stable state but have no record

If there were a mechanism to "take a snapshot" at key moments and continuously verify during development, these problems would be solved.

## When to Use This Workflow

- **Before starting new features**: Create checkpoint to record starting state
- **After completing milestones**: Save progress for easy rollback and comparison
- **Before submitting PR**: Run comprehensive verification to ensure code quality
- **During refactoring**: Frequent verification to avoid breaking existing functionality
- **During team collaboration**: Share checkpoints to sync working state

## 🎒 Prerequisites

::: warning Prerequisites

This tutorial assumes you have:

- ✅ Completed [TDD Development Workflow](../../platforms/tdd-workflow/) learning
- ✅ Familiar with basic Git operations
- ✅ Understand how to use Everything Claude Code's basic commands

:::

---

## Core Concept

**Verification loop** is a quality assurance mechanism that turns "write code → test → verify" cycle into a systematic process.

### Three-Layer Verification System

Everything Claude Code provides three layers of verification:

| Layer | Mechanism | Purpose | When to Use |
|-------|-----------|---------|-------------|
| **Real-time verification** | PostToolUse Hooks | Capture type errors, console.logs, etc. immediately | After every tool call |
| **Periodic verification** | `/verify` command | Comprehensive check: build, types, tests, security | Every 15 minutes or after major changes |
| **Milestone verification** | `/checkpoint` | Compare state differences, track quality trends | After milestones, before PR submission |

### Checkpoint: Code's "Save Point"

Checkpoint "takes a snapshot" at key moments:

- Records Git SHA
- Records test pass rate
- Records code coverage
- Records timestamp

When verifying, you can compare the difference between current state and any checkpoint.

### Evals: AI Development's "Unit Tests"

**Eval-Driven Development (EDD)** treats evals as unit tests for AI development:

1. **Define success criteria first** (write evals)
2. **Write code next** (implement features)
3. **Run evals continuously** (verify correctness)
4. **Track regressions** (ensure existing functionality not broken)

This aligns with TDD (Test-Driven Development) philosophy, but for AI-assisted development.

---

## Follow Along: Using Checkpoint

### Step 1: Create Initial Checkpoint

Before starting new features, create checkpoint first:

```bash
/checkpoint create "feature-start"
```

**Why**
Record starting state for later comparison.

**What you should see**:

```
VERIFICATION: Running quick checks...
Build:    OK
Types:    OK

CHECKPOINT CREATED: feature-start
Time:     2026-01-25-14:30
Git SHA:  abc1234
Logged to: .claude/checkpoints.log
```

Checkpoint will:
1. First run `/verify quick` (only check build and types)
2. Create git stash or commit (named: `checkpoint-feature-start`)
3. Record to `.claude/checkpoints.log`

### Step 2: Implement Core Functionality

Start writing code to complete core logic.

### Step 3: Create Milestone Checkpoint

After completing core functionality:

```bash
/checkpoint create "core-done"
```

**Why**
Record milestone for easy rollback.

**What you should see**:

```
CHECKPOINT CREATED: core-done
Time:     2026-01-25-16:45
Git SHA:  def5678
Logged to: .claude/checkpoints.log
```

### Step 4: Verify and Compare

Verify if current state has deviated from goal:

```bash
/checkpoint verify "feature-start"
```

**Why**
Compare quality metric changes from start to now.

**What you should see**:

```
CHECKPOINT COMPARISON: feature-start
=====================================
Files changed: 12
Tests: +25 passed / -0 failed
Coverage: +15% / -2% (from 60% to 75%)
Build: PASS
Status: ✅ Quality improved
```

### Step 5: View All Checkpoints

View checkpoint history:

```bash
/checkpoint list
```

**What you should see**:

```
CHECKPOINTS HISTORY
===================
Name           | Time             | Git SHA  | Status
---------------|------------------|----------|--------
feature-start  | 2026-01-25-14:30 | abc1234  | behind
core-done      | 2026-01-25-16:45 | def5678  | current
```

**Checkpoint ✅**: Verify understanding

- Does checkpoint automatically run `/verify quick`? ✅ Yes
- Which file records checkpoints? ✅ `.claude/checkpoints.log`
- What metrics does `/checkpoint verify` compare? ✅ File changes, test pass rate, coverage

---

## Follow Along: Using Verify Command

### Step 1: Run Quick Verification

During development, run quick verification frequently:

```bash
/verify quick
```

**Why**
Only check build and types, fastest speed.

**What you should see**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK

Ready for next task: YES
```

### Step 2: Run Full Verification

Before submitting PR, run complete check:

```bash
/verify full
```

**Why**
Comprehensive check of all quality gates.

**What you should see**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK (2 warnings)
Tests:    120/125 passed, 76% coverage
Secrets:  OK
Logs:     3 console.logs found in src/

Ready for PR: NO

Issues to Fix:
1. Remove console.log statements before PR
   Found in: src/utils/logger.ts:15, src/api/client.ts:23, src/ui/button.ts:8
2. Increase test coverage from 76% to 80% (target)
   Missing coverage in: src/components/Form.tsx
```

### Step 3: Run Pre-PR Verification

Strictest check, includes security scan:

```bash
/verify pre-pr
```

**What you should see**:

```
VERIFICATION: FAIL

Build:    OK
Types:    OK (1 error)
Lint:     OK
Tests:    120/125 passed, 76% coverage
Secrets:  ❌ FOUND (2 API keys)
Logs:     3 console.logs

Security Issues Found:
1. Hardcoded API key in src/api/config.ts:10
2. Secret key in .env.example

Ready for PR: NO

Critical Issues:
1. Remove hardcoded secrets
2. Fix type error in src/components/Form.tsx:45
3. Remove console.logs
4. Increase coverage to 80%
```

### Step 4: Re-verify After Fixing Issues

After fixing issues, run verification again:

```bash
/verify full
```

**What you should see**:

```
VERIFICATION: PASS

Build:    OK
Types:    OK
Lint:     OK
Tests:    125/125 passed, 81% coverage
Secrets:  OK
Logs:     OK

Ready for PR: YES
```

**Checkpoint ✅**: Verify understanding

- What does `/verify quick` only check? ✅ Build and types
- What items does `/verify full` check? ✅ Build, types, Lint, tests, Secrets, Console.log, Git status
- Which verification mode includes security scan? ✅ `pre-pr`

---

## Follow Along: Using Evals (Eval-Driven Development)

### Step 1: Define Evals (Before Writing Code)

**Define success criteria before starting to code**:

```markdown
## EVAL: user-authentication

### Capability Evals
- [ ] User can register with email/password
- [ ] User can login with valid credentials
- [ ] Invalid credentials rejected with proper error
- [ ] Sessions persist across page reloads
- [ ] Logout clears session

### Regression Evals
- [ ] Public routes still accessible
- [ ] API responses unchanged
- [ ] Database schema compatible

### Success Metrics
- pass@3 > 90% for capability evals
- pass^3 = 100% for regression evals
```

**Why**
Define success criteria first, force thinking about "what does completion look like".

Save to: `.claude/evals/user-authentication.md`

### Step 2: Implement Functionality

Write code based on evals.

### Step 3: Run Capability Evals

Test if new features meet evals:

```markdown
[CERTAIN CAPABILITY EVAL: user-authentication]

Test 1: User can register with email/password
Task: Call registration API with valid credentials
Expected: User account created, token returned
Actual: PASS

Test 2: User can login with valid credentials
Task: Call login API with registered credentials
Expected: JWT token returned
Actual: PASS

Test 3: Invalid credentials rejected
Task: Call login API with wrong password
Expected: 401 Unauthorized with error message
Actual: PASS

Overall: 3/3 passed
```

### Step 4: Run Regression Evals

Ensure existing functionality not broken:

```bash
npm test -- --testPathPattern="existing"
```

**What you should see**:

```
PASS  existing/auth.test.ts
PASS  existing/api.test.ts
PASS  existing/db.test.ts

All regression tests: 15/15 passed
```

### Step 5: Generate Eval Report

Summarize results:

```markdown
EVAL REPORT: user-authentication
=================================

Capability Evals:
  register-user:       PASS (pass@1)
  login-user:          PASS (pass@2)
  reject-invalid:      PASS (pass@1)
  session-persistence: PASS (pass@1)
  logout-clears:       PASS (pass@1)
  Overall:             5/5 passed

Regression Evals:
  public-routes:       PASS
  api-responses:       PASS
  db-schema:           PASS
  Overall:             3/3 passed

Metrics:
  pass@1: 80% (4/5)
  pass@3: 100% (5/5)
  pass^3: 100% (3/3)

Status: READY FOR REVIEW
```

**Checkpoint ✅**: Verify understanding

- When should evals be defined? ✅ Before writing code
- What's the difference between capability evals and regression evals? ✅ Former tests new features, latter ensures existing functionality not broken
- What's the meaning of pass@3? ✅ Probability of success within 3 attempts

---

## Common Pitfalls

### Pitfall 1: Forgetting to Create Checkpoint

**Problem**: After developing for a while, want to rollback to a state but have no record.

**Solution**: Create checkpoint before starting each new feature:

```bash
# Good practice: before new feature starts
/checkpoint create "feature-name-start"

# Good practice: every milestone
/checkpoint create "phase-1-done"
/checkpoint create "phase-2-done"
```

### Pitfall 2: Evals Defined Too Vaguely

**Problem**: Evals written too vaguely, cannot verify.

**Wrong example**:
```markdown
- [ ] User can login
```

**Correct example**:
```markdown
- [ ] User can login with valid credentials
  Task: POST /api/login with email="test@example.com", password="Test123!"
  Expected: HTTP 200 with JWT token in response body
  Actual: ___________
```

### Pitfall 3: Only Running Verification Before Submitting PR

**Problem**: Discovering issues only before PR, high cost to fix.

**Solution**: Establish continuous verification habit:

```
Every 15 minutes:   /verify quick
After each feature: /checkpoint create "milestone"
Before PR:          /verify pre-pr
```

### Pitfall 4: Evals Not Updated

**Problem**: After requirements change, evals are still old, causing verification to fail.

**Solution**: Evals are "first-class code", update synchronously when requirements change:

```bash
# Requirements change → update Evals → update code
1. Modify .claude/evals/feature-name.md
2. Modify code based on new evals
3. Re-run evals
```

---

## Summary

Verification loop is a systematic approach to maintaining code quality:

| Mechanism | Purpose | Frequency |
|-----------|---------|-----------|
| **PostToolUse Hooks** | Capture errors in real-time | Every tool call |
| **`/verify`** | Periodic comprehensive check | Every 15 minutes |
| **`/checkpoint`** | Milestone recording and comparison | Each feature phase |
| **Evals** | Feature verification and regression testing | Each new feature |

Core principles:
1. **Define first, implement second** (Evals)
2. **Verify frequently, improve continuously** (`/verify`)
3. **Record milestones, facilitate rollback** (`/checkpoint`)

---

## Coming Up Next

> In the next lesson, we'll learn **[Custom Rules: Building Project-Specific Standards](../custom-rules/)**.
>
> You'll learn:
> - How to create custom Rules files
> - Rule file format and checklist writing
> - Define project-specific security rules
> - Integrate team standards into code review workflow

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|---------|-----------|-------|
| Checkpoint command definition | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |
| Verify command definition | [`commands/verify.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/verify.md) | 1-60 |
| Verification Loop Skill | [`skills/verification-loop/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/verification-loop/SKILL.md) | 1-121 |
| Eval Harness Skill | [`skills/eval-harness/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/eval-harness/SKILL.md) | 1-222 |

**Key Flows**:
- Checkpoint creation flow: Run `/verify quick` first → Create git stash/commit → Record to `.claude/checkpoints.log`
- Verify verification flow: Build Check → Type Check → Lint Check → Test Suite → Console.log Audit → Git Status
- Eval workflow: Define (define evals) → Implement (write code) → Evaluate (run evals) → Report (generate report)

**Key Parameters**:
- `/checkpoint [create|verify|list] [name]` - Checkpoint operations
- `/verify [quick|full|pre-commit|pre-pr]` - Verification modes
- pass@3 - Target of success within 3 attempts (>90%)
- pass^3 - 3 consecutive successes (100%, used for critical paths)

</details>
