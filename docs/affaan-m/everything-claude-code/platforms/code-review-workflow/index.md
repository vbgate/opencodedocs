---
title: "Code Review: Security Audit Guide | Everything Claude Code"
sidebarTitle: "Code Review"
subtitle: "Code Review Workflow: /code-review and Security Audit"
description: "Learn to use /code-review for code quality and security audits. Covers OWASP Top 10 analysis, vulnerability detection, and fix recommendations."
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# Code Review Workflow: /code-review and Security Audit

## What You'll Learn

**Code review** is a critical step in ensuring code quality and security. This tutorial helps you:

- ✅ Use the `/code-review` command to automatically check code changes
- ✅ Understand the difference between code-reviewer agent and security-reviewer agent
- ✅ Master security checklists (OWASP Top 10)
- ✅ Detect and fix common security vulnerabilities (SQL injection, XSS, hardcoded keys, etc.)
- ✅ Apply code quality standards (function size, file length, test coverage, etc.)
- ✅ Understand approval criteria (CRITICAL, HIGH, MEDIUM, LOW)

## Your Current Challenges

You've written your code and are ready to commit, but:

- ❌ You don't know if there are security vulnerabilities in your code
- ❌ You're worried about missing code quality issues
- ❌ You're uncertain if you're following best practices
- ❌ Manual checks are time-consuming and error-prone
- ❌ You want to automatically discover issues before committing

**Everything Claude Code's** code review workflow solves these problems:

- **Automated checks**: The `/code-review` command automatically analyzes all changes
- **Specialized review**: code-reviewer agent focuses on code quality, security-reviewer agent focuses on security
- **Standardized grading**: Issues are classified by severity (CRITICAL, HIGH, MEDIUM, LOW)
- **Detailed recommendations**: Each issue includes specific fix recommendations

## When to Use This

**Run code review before every commit**:

- ✅ After completing new feature code
- ✅ After fixing bugs
- ✅ After refactoring code
- ✅ When adding API endpoints (must run security-reviewer)
- ✅ When handling user input (must run security-reviewer)
- ✅ When working on authentication/authorization code (must run security-reviewer)

::: tip Best Practice
Make it a habit: run `/code-review` before every `git commit`. If there are CRITICAL or HIGH issues, fix them before committing.
:::

## 🎒 Prerequisites

**You need**:
- Everything Claude Code installed (if not, check [Quick Start](../../start/quickstart/))
- Some code changes (you can use `/tdd` to write some code first)
- Basic understanding of Git operations

**You don't need**:
- You don't need to be a security expert (the agent will help you detect)
- You don't need to memorize all security best practices (the agent will remind you)

---

## Core Concepts

Everything Claude Code provides two professional review agents:

### code-reviewer agent

**Focuses on code quality and best practices**, checking:

- **Code quality**: Function size (>50 lines), file length (>800 lines), nesting depth (>4 levels)
- **Error handling**: Missing try/catch, console.log statements
- **Code style**: Naming conventions, duplicate code, immutable patterns
- **Best practices**: Emoji usage, missing tickets for TODO/FIXME, missing JSDoc
- **Test coverage**: Missing tests for new code

**Use case**: All code changes should go through code-reviewer.

### security-reviewer agent

**Focuses on security vulnerabilities and threats**, checking:

- **OWASP Top 10**: SQL injection, XSS, CSRF, authentication bypass, etc.
- **Key leaks**: Hardcoded API keys, passwords, tokens
- **Input validation**: Missing or improper user input validation
- **Authentication/authorization**: Improper identity verification and permission checks
- **Dependency security**: Outdated or vulnerable dependency packages

**Use case**: Security-sensitive code (API, authentication, payment, user input) must go through security-reviewer.

### Issue Severity Grading

| Level | Meaning | Block Commit? | Example |
|-------|---------|---------------|---------|
| **CRITICAL** | Critical security vulnerability or major quality issue | ❌ Must block | Hardcoded API key, SQL injection |
| **HIGH** | Important security or code quality issue | ❌ Must block | Missing error handling, XSS vulnerability |
| **MEDIUM** | Medium priority issue | ⚠️ Can commit with caution | Emoji usage, missing JSDoc |
| **LOW** | Minor issue | ✓ Can fix later | Inconsistent formatting, magic numbers |

---

## Follow Along: Your First Code Review

### Step 1: Create Some Code Changes

First, use `/tdd` to write a simple API endpoint (including some security issues):

```bash
/tdd
```

Let Claude Code create a user login API, the code might look like this:

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ SQL injection risk
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ Plaintext password comparison
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ Password leak in logs
    return { token }
  }
}
```

**Why**
This code contains multiple security vulnerabilities and code quality issues, perfect for demonstrating the code review feature.

**You should see**: Code file has been created.

---

### Step 2: Run Code Review

Now run the `/code-review` command:

```bash
/code-review
```

**Why**
`/code-review` will automatically invoke the code-reviewer agent to check all uncommitted changes.

**You should see**: The agent starts analyzing the code, then outputs a review report.

---

### Step 3: Review the Report

code-reviewer will output a report similar to this:

```markdown
# Code Review Report

## Critical Issues (Fix Immediately)

### 1. [CRITICAL] Hardcoded credentials
**File:** src/api/login.ts:3
**Issue:** Password logging in console
**Fix:** Remove password from logs, only log user ID

```typescript
// ❌ Bad
console.log('User logged in:', { email, password })

// ✓ Good
console.log('User logged in:', { email, userId: user.id })
```

---

### 2. [CRITICAL] SQL injection vulnerability
**File:** src/api/login.ts:2
**Issue:** String concatenation in SQL query
**Fix:** Use parameterized queries

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✓ Good
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

---

## High Issues (Fix Before Production)

### 3. [HIGH] Plaintext password comparison
**File:** src/api/login.ts:4
**Issue:** Password stored in plaintext
**Fix:** Use bcrypt to hash passwords

```typescript
// ❌ Bad
if (user.password === password) {

// ✓ Good
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.password)
```

---

## Recommendations

1. Add input validation for email format
2. Add rate limiting to prevent brute force attacks
3. Use JWT tokens instead of generating custom tokens

## Approval Status

❌ BLOCKED - 2 CRITICAL issues found

Please fix all CRITICAL and HIGH issues before committing.
```

**Why**
The report is organized by severity, and each issue includes location, description, fix recommendations, and code examples.

**You should see**: A clear review report highlighting all issues and fix recommendations.

---

### Step 4: Fix the Issues

Fix the code based on the report:

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // Input validation
  const validated = LoginSchema.parse(input)
  
  // Parameterized query (prevent SQL injection)
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Hashed password comparison
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**Why**
Fix all CRITICAL and HIGH issues, add input validation and hashed password comparison.

**You should see**: Code has been updated, security vulnerabilities eliminated.

---

### Step 5: Review Again

Run `/code-review` again:

```bash
/code-review
```

**Why**
Verify all issues have been fixed, ensuring the code is ready to commit.

**You should see**: A pass report similar to this:

```markdown
# Code Review Report

## Summary

- **Critical Issues:** 0 ✓
- **High Issues:** 0 ✓
- **Medium Issues:** 1 ⚠️
- **Low Issues:** 1 💡

## Medium Issues (Fix When Possible)

### 1. [MEDIUM] Missing JSDoc for public API
**File:** src/api/login.ts:9
**Issue:** loginUser function missing documentation
**Fix:** Add JSDoc comments

```typescript
/**
 * Authenticates a user with email and password
 * @param input - Login credentials (email, password)
 * @returns Object with JWT token
 * @throws Error if credentials invalid
 */
export async function loginUser(input: unknown) {
```

---

## Low Issues (Consider Fixing)

### 2. [LOW] Add rate limiting
**File:** src/api/login.ts:9
**Issue:** Login endpoint lacks rate limiting
**Fix:** Add express-rate-limit middleware

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
})

app.post('/api/login', loginLimiter, loginUser)
```

---

## Approval Status

✅ APPROVED - No CRITICAL or HIGH issues

**Note:** Medium and Low issues can be fixed in follow-up commits.
```

**You should see**: Review passed, code is ready to commit.

---

### Step 6: Security-Focused Review (Optional)

If your code involves security-sensitive features like API endpoints, authentication, or payment, you can specifically call security-reviewer:

```bash
/security-reviewer
```

**Why**
security-reviewer performs deeper OWASP Top 10 analysis, checking for more security vulnerability patterns.

**You should see**: A detailed security review report, including OWASP analysis, dependency vulnerability checks, and security tool recommendations.

---

## Checklist ✅

After completing the steps above, you should:

- ✅ Be able to run the `/code-review` command
- ✅ Understand the structure and content of review reports
- ✅ Be able to fix code issues based on reports
- ✅ Know that CRITICAL and HIGH issues must be fixed
- ✅ Understand the difference between code-reviewer and security-reviewer
- ✅ Develop the habit of reviewing before committing

---

## Common Pitfalls

### Common Error 1: Skipping Code Review

**Problem**: Thinking code is simple and committing directly without running review.

**Consequence**: May miss security vulnerabilities, get rejected by CI/CD, or cause production incidents.

**Correct approach**: Make it a habit to run `/code-review` before every commit.

---

### Common Error 2: Ignoring MEDIUM Issues

**Problem**: Ignoring MEDIUM issues and letting them accumulate.

**Consequence**: Code quality degrades, technical debt accumulates, making future maintenance difficult.

**Correct approach**: Although MEDIUM issues don't block commits, fix them within a reasonable timeframe.

---

### Common Error 3: Manually Fixing SQL Injection

**Problem**: Writing string escaping manually instead of using parameterized queries.

**Consequence**: Incomplete escaping, SQL injection risk remains.

**Correct approach**: Always use ORM or parameterized queries, never manually concatenate SQL.

---

### Common Error 4: Confusing the Two Reviewers

**Problem**: Only running code-reviewer on all code, ignoring security-reviewer.

**Consequence**: Security vulnerabilities may be missed, especially for code involving APIs, authentication, and payments.

**Correct approach**:
- Regular code: code-reviewer is sufficient
- Security-sensitive code: Must run both code-reviewer and security-reviewer

---

## Summary

**Code Review Workflow** is one of the core features of Everything Claude Code:

| Feature | Agent | Check Content | Severity |
|---------|-------|--------------|----------|
| **Code Quality Review** | code-reviewer | Function size, error handling, best practices | HIGH/MEDIUM/LOW |
| **Security Review** | security-reviewer | OWASP Top 10, key leaks, injection vulnerabilities | CRITICAL/HIGH/MEDIUM |

**Key takeaways**:

1. Run `/code-review` **before every commit**
2. **CRITICAL/HIGH issues** must be fixed before committing
3. **Security-sensitive code** must go through security-reviewer
4. **Review reports** contain detailed locations and fix recommendations
5. **Develop the habit**: Review → Fix → Review again → Commit

---

## Coming Up Next

> In the next lesson, we'll learn **[Hooks Automation](../../advanced/hooks-automation/)**.
>
> You'll learn:
> - What Hooks are and how to automate development workflows
> - How to use 15+ automated hooks
> - How to customize Hooks to fit project needs
> - Application scenarios for SessionStart, SessionEnd, PreToolUse, and other hooks

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|---------|-----------|-------|
| /code-review command definition | [`commands/code-review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/code-review.md) | 1-41 |
| code-reviewer agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-105 |
| security-reviewer agent | [`agents/security-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/security-reviewer.md) | 1-546 |
| security-review skill | [`skills/security-review/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/security-review/SKILL.md) | 1-495 |

**Key constants**:
- Function size limit: 50 lines (code-reviewer.md:47)
- File size limit: 800 lines (code-reviewer.md:48)
- Nesting depth limit: 4 levels (code-reviewer.md:49)

**Key functions**:
- `/code-review`: Invokes code-reviewer agent for code quality review
- `/security-reviewer`: Invokes security-reviewer agent for security audit
- `git diff --name-only HEAD`: Get uncommitted changed files (code-review.md:5)

**Approval criteria** (code-reviewer.md:90-92):
- ✅ Approve: No CRITICAL or HIGH issues
- ⚠️ Warning: MEDIUM issues only (can merge with caution)
- ❌ Block: CRITICAL or HIGH issues found

</details>
