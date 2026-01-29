---
title: "Rules Reference: 8 Rule Sets | Everything Claude Code"
sidebarTitle: "Rules Reference"
subtitle: "Rules Complete Reference: 8 Rule Sets Explained"
description: "Learn Everything Claude Code's 8 mandatory rule sets. Covers security, coding style, testing, Git workflow, performance optimization, and best practices."
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "start-quickstart"
order: 200
---

# Rules Complete Reference: 8 Rule Sets Explained

## What You'll Learn

- Quickly find and understand all 8 mandatory rule sets
- Correctly apply security, coding style, testing, and other standards during development
- Know which Agent to use to help comply with rules
- Understand performance optimization strategies and how the Hooks system works

## Your Current Challenges

Faced with 8 rule sets in the project, you might:

- **Can't remember all rules**: security, coding-style, testing, git-workflow... which ones must be followed?
- **Don't know how to apply**: Rules mention immutable patterns, TDD workflows, but how to implement them specifically?
- **Don't know who to ask for help**: Which Agent to use for security issues? Who to find for code review?
- **Performance vs. security trade-offs**: How to optimize development efficiency while ensuring code quality?

This reference document helps you fully understand the content, use cases, and corresponding Agent tools for each rule set.

---

## Rules Overview

Everything Claude Code includes 8 mandatory rule sets, each with clear goals and use cases:

| Rule Set | Goal | Priority | Corresponding Agent |
|--- | --- | --- | ---|
| **Security** | Prevent security vulnerabilities, sensitive data leaks | P0 | security-reviewer |
| **Coding Style** | Code readability, immutable patterns, small files | P0 | code-reviewer |
| **Testing** | 80%+ test coverage, TDD workflow | P0 | tdd-guide |
| **Git Workflow** | Standardized commits, PR workflow | P1 | code-reviewer |
| **Agents** | Correct use of sub-agents | P1 | N/A |
| **Performance** | Token optimization, context management | P1 | N/A |
| **Patterns** | Design patterns, architecture best practices | P2 | architect |
| **Hooks** | Understanding and using Hooks | P2 | N/A |

::: info Rule Priority Explanation

- **P0 (Critical)**: Must be strictly followed, violations lead to security risks or serious code quality degradation
- **P1 (Important)**: Should be followed, affects development efficiency and team collaboration
- **P2 (Recommended)**: Recommended to follow, improves code architecture and maintainability
:::

---

## 1. Security (Security Rules)

### Mandatory Security Checks

Before **any commit**, the following checks must be completed:

- [ ] No hardcoded secrets (API keys, passwords, tokens)
- [ ] All user inputs validated
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (HTML sanitization)
- [ ] CSRF protection enabled
- [ ] Authentication/authorization verified
- [ ] Rate limiting on all endpoints
- [ ] Error messages don't leak sensitive data

### Secret Management

**❌ Wrong approach**: Hardcoded secrets

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ Correct approach**: Use environment variables

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### Security Response Protocol

If security issues are found:

1. **Stop immediately** current work
2. Use **security-reviewer** agent for comprehensive analysis
3. Fix CRITICAL issues before proceeding
4. Rotate any exposed secrets
5. Check entire codebase for similar issues

::: tip Security Agent Usage

Using the `/code-review` command automatically triggers security-reviewer checks to ensure code complies with security standards.
:::

---

## 2. Coding Style (Coding Style Rules)

### Immutability (CRITICAL)

**Always create new objects, never modify existing objects**:

**❌ Wrong approach**: Direct object modification

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ Correct approach**: Create new object

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### File Organization

**Many small files > few large files**:

- **High cohesion, low coupling**
- **Typical 200-400 lines, maximum 800 lines**
- Extract utility functions from large components
- Organize by feature/domain, not by type

### Error Handling

**Always handle errors comprehensively**:

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### Input Validation

**Always validate user input**:

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### Code Quality Checklist

Before marking work as complete, must confirm:

- [ ] Code is readable with clear naming
- [ ] Functions are small (< 50 lines)
- [ ] Files are focused (< 800 lines)
- [ ] No deep nesting (> 4 levels)
- [ ] Proper error handling
- [ ] No console.log statements
- [ ] No hardcoded values
- [ ] No direct mutations (use immutable patterns)

---

## 3. Testing (Testing Rules)

### Minimum Test Coverage: 80%

**Must include all test types**:

1. **Unit tests** - Isolated functions, utility functions, components
2. **Integration tests** - API endpoints, database operations
3. **E2E tests** - Critical user flows (Playwright)

### Test-Driven Development (TDD)

**Mandatory workflow**:

1. Write tests first (RED)
2. Run tests - should fail
3. Write minimal implementation (GREEN)
4. Run tests - should pass
5. Refactor (IMPROVE)
6. Verify coverage (80%+)

### Test Troubleshooting

1. Use **tdd-guide** agent
2. Check test isolation
3. Verify mocks are correct
4. Fix implementation, not tests (unless test itself is wrong)

### Agent Support

- **tdd-guide** - Proactive use for new features, mandatory write tests first
- **e2e-runner** - Playwright E2E testing expert

::: tip Using TDD Command

Using the `/tdd` command automatically calls the tdd-guide agent, guiding you through the complete TDD workflow.
:::

---

## 4. Git Workflow (Git Workflow Rules)

### Commit Message Format

```
<type>: <description>

<optional body>
```

**Types**: feat, fix, refactor, docs, test, chore, perf, ci

::: info Commit Messages

Attribution in commit messages is globally disabled via `~/.claude/settings.json`.
:::

### Pull Request Workflow

When creating PR:

1. Analyze complete commit history (not just latest commit)
2. Use `git diff [base-branch]...HEAD` to view all changes
3. Draft comprehensive PR summary
4. Include test plan and TODOs
5. Use `-u` flag when pushing new branch

### Feature Implementation Workflow

#### 1. Plan First

- Use **planner** agent to create implementation plan
- Identify dependencies and risks
- Break down into multiple phases

#### 2. TDD Approach

- Use **tdd-guide** agent
- Write tests first (RED)
- Implement to pass tests (GREEN)
- Refactor (IMPROVE)
- Verify 80%+ coverage

#### 3. Code Review

- Use **code-reviewer** agent immediately after writing code
- Fix CRITICAL and HIGH issues
- Fix MEDIUM issues where possible

#### 4. Commit and Push

- Detailed commit message
- Follow conventional commits format

---

## 5. Agents (Agent Rules)

### Available Agents

Located in `~/.claude/agents/`:

| Agent | Purpose | When to Use |
|--- | --- | ---|
| planner | Implementation planning | Complex features, refactoring |
| architect | System design | Architecture decisions |
| tdd-guide | Test-driven development | New features, bug fixes |
| code-reviewer | Code review | After writing code |
| security-reviewer | Security analysis | Before commit |
| build-error-resolver | Fix build errors | When build fails |
| e2e-runner | E2E testing | Critical user flows |
| refactor-cleaner | Dead code cleanup | Code maintenance |
| doc-updater | Documentation updates | Updating documentation |

### Use Agents Immediately

**Without user prompts**:

1. Complex feature requests - Use **planner** agent
2. Code just written/modified - Use **code-reviewer** agent
3. Bug fix or new feature - Use **tdd-guide** agent
4. Architecture decisions - Use **architect** agent

### Parallel Task Execution

**Always use parallel task execution for independent operations**:

| Approach | Description |
|--- | ---|
| ✅ Good: Parallel execution | Launch 3 agents in parallel: Agent 1 (auth.ts security analysis), Agent 2 (cache system performance review), Agent 3 (utils.ts type checking) |
| ❌ Bad: Sequential execution | Run agent 1, then agent 2, then agent 3 |

### Multi-Perspective Analysis

For complex issues, use role-playing sub-agents:

- Fact reviewer
- Senior engineer
- Security expert
- Consistency reviewer
- Redundancy checker

---

## 6. Performance (Performance Optimization Rules)

### Model Selection Strategy

**Haiku 4.5** (90% of Sonnet capabilities, 3x cost savings):

- Lightweight agents, frequent invocations
- Pair programming and code generation
- Worker agents in multi-agent systems

**Sonnet 4.5** (Best coding model):

- Main development work
- Coordinate multi-agent workflows
- Complex coding tasks

**Opus 4.5** (Deepest reasoning):

- Complex architecture decisions
- Maximum reasoning requirements
- Research and analysis tasks

### Context Window Management

**Avoid using the last 20% of context window**:

- Large-scale refactoring
- Feature implementation across multiple files
- Debugging complex interactions

**Low context sensitivity tasks**:

- Single file editing
- Standalone tool creation
- Documentation updates
- Simple bug fixes

### Ultrathink + Plan Mode

For complex tasks requiring deep reasoning:

1. Use `ultrathink` for enhanced thinking
2. Enable **Plan Mode** for structured approach
3. "Restart engine" for multi-round criticism
4. Use role-playing sub-agents for diverse analysis

### Build Troubleshooting

If build fails:

1. Use **build-error-resolver** agent
2. Analyze error messages
3. Fix step by step
4. Verify after each fix

---

## 7. Patterns (Common Pattern Rules)

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### Custom Hooks Pattern

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Repository Pattern

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### Skeleton Projects

When implementing new features:

1. Search for battle-tested skeleton projects
2. Use parallel agents to evaluate options:
   - Security assessment
   - Scalability analysis
   - Relevance score
   - Implementation planning
3. Clone best match as foundation
4. Iterate within validated structure

---

## 8. Hooks (Hooks System Rules)

### Hook Types

- **PreToolUse**: Before tool execution (validation, parameter modification)
- **PostToolUse**: After tool execution (auto-formatting, checks)
- **Stop**: At session end (final verification)

### Current Hooks (in ~/.claude/settings.json)

#### PreToolUse

- **tmux reminder**: Suggest using tmux for long-running commands (npm, pnpm, yarn, cargo, etc.)
- **git push review**: Open review in Zed before pushing
- **documentation blocker**: Block creation of unnecessary .md/.txt files

#### PostToolUse

- **PR creation**: Record PR URL and GitHub Actions status
- **Prettier**: Auto-format JS/TS files after edits
- **TypeScript check**: Run tsc after editing .ts/.tsx files
- **console.log warning**: Warn about console.log in edited files

#### Stop

- **console.log audit**: Check for console.log in all modified files before session ends

### Auto-Accept Permissions

**Use with caution**:

- Enable for trusted, well-defined plans
- Disable during exploratory work
- Never use dangerously-skip-permissions flag
- Instead, configure `allowedTools` in `~/.claude.json`

### TodoWrite Best Practices

Use the TodoWrite tool to:

- Track progress of multi-step tasks
- Verify understanding of instructions
- Enable real-time guidance
- Show fine-grained implementation steps

Todo lists reveal:

- Steps in wrong order
- Missing items
- Extra unnecessary items
- Wrong granularity
- Misunderstood requirements

---

## Coming Up Next

> In the next lesson, we'll learn **[Skills Complete Reference](../skills-reference/)**.
>
> You'll learn:
> - Complete reference to 11 skill libraries
> - Coding standards, backend/frontend patterns, continuous learning skills
> - How to choose appropriate skills for different tasks

---

## Summary

Everything Claude Code's 8 rule sets provide comprehensive guidance for the development process:

1. **Security** - Prevent security vulnerabilities and sensitive data leaks
2. **Coding Style** - Ensure code readability, immutability, small files
3. **Testing** - Enforce 80%+ coverage and TDD workflow
4. **Git Workflow** - Standardized commit and PR workflows
5. **Agents** - Guide correct use of 9 specialized sub-agents
6. **Performance** - Optimize token usage and context management
7. **Patterns** - Provide common design patterns and best practices
8. **Hooks** - Explain how the automated hooks system works

Remember, these rules are not constraints, but guides to help you write high-quality, secure, maintainable code. Using the corresponding Agents (like code-reviewer, security-reviewer) can help you automatically comply with these rules.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|--- | --- | ---|
| Security rules | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Coding Style rules | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Testing rules | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Git Workflow rules | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Agents rules | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Performance rules | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Patterns rules | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks rules | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**Key Rules**:
- **Security**: No hardcoded secrets, OWASP Top 10 checks
- **Coding Style**: Immutable patterns, files < 800 lines, functions < 50 lines
- **Testing**: 80%+ test coverage, TDD workflow enforced
- **Performance**: Model selection strategy, context window management

**Related Agents**:
- **security-reviewer**: Security vulnerability detection
- **code-reviewer**: Code quality and style review
- **tdd-guide**: TDD workflow guidance
- **planner**: Implementation planning

</details>
