---
title: "Dynamic Contexts: Mode Switching | Everything Claude Code"
sidebarTitle: "Dynamic Contexts"
subtitle: "Dynamic Context Injection: How to Use Contexts"
description: "Learn Claude Code's dynamic context injection. Master switching between dev, review, and research modes to optimize AI behavior for different scenarios."
tags:
  - "contexts"
  - "workflow-optimization"
  - "dynamic-prompts"
prerequisite:
  - "start-quick-start"
order: 140
---

# Dynamic Context Injection: Using Contexts

## What You'll Learn

After mastering dynamic context injection, you'll be able to:

- Switch AI behavior strategies based on current working mode (development, review, research)
- Make Claude follow different priorities and tool preferences in different scenarios
- Avoid mixing work goals within the same session to improve focus
- Optimize efficiency across different stages (quick implementation vs. deep review)

## Your Current Challenges

Have you encountered these issues during development?

- **When wanting to develop quickly**, Claude over-analyzes and gives too many suggestions, slowing you down
- **During code review**, Claude rushes to modify code instead of carefully reading and discovering issues
- **When researching new problems**, Claude starts writing before fully understanding, leading to wrong directions
- **In the same session**, you switch between development and review, and Claude's behavior becomes chaotic

The root cause of these problems: **Claude doesn't have a clear "working mode" signal**, so it doesn't know what to prioritize at any given time.

## When to Use This Technique

- **Development phase**: Let AI prioritize implementation, discuss details later
- **Code review**: Let AI fully understand first, then suggest improvements
- **Technical research**: Let AI explore and learn first, then reach conclusions
- **When switching working modes**: Clearly tell AI what the current goal is

## Core Concept

The core of dynamic context injection is **making AI have different behavioral strategies in different working modes**.

### Three Working Modes

Everything Claude Code provides three predefined contexts:

| Mode   | File            | Focus                     | Priority                          | Use Cases                              |
|--- | --- | --- | --- | ---|
| **dev** | `contexts/dev.md` | Implement features, iterate quickly | Get it working first, refine later | Daily development, new feature implementation |
| **review** | `contexts/review.md` | Code quality, security, maintainability | Discover issues first, suggest fixes | Code Review, PR review |
| **research** | `contexts/research.md` | Understand problems, explore solutions | Understand first, then act | Technical research, bug analysis, architecture design |

### Why Do We Need Dynamic Context?

::: info Context vs. System Prompt

**System Prompt** is the fixed instruction loaded when Claude Code starts (like content in `agents/` and `rules/` directories). It defines the AI's basic behavior.

**Context** is the temporary instruction you dynamically inject based on the current working mode. It overrides or supplements the system prompt, making AI change behavior in specific scenarios.

System prompt is the "global default", context is the "scenario override".
:::

### Working Mode Comparison

How AI's performance differs with the same task in different modes:

```markdown
### Task: Fix a bug causing login failure

#### dev mode (quick fix)
- Quickly locate the problem
- Directly modify code
- Run tests to verify
- Get it working first, then optimize

### review mode (deep analysis)
- Thoroughly read related code
- Check edge cases and error handling
- Evaluate the impact of the fix
- Discover issues first, then suggest fixes

### research mode (thorough investigation)
- Explore all possible causes
- Analyze logs and error messages
- Verify hypotheses
- Understand root cause first, then propose solutions
```

## 🎒 Prerequisites

::: warning Prerequisites

This tutorial assumes you have already:

- ✅ Completed the [Quick Start](../../start/quickstart/) tutorial
- ✅ Installed the Everything Claude Code plugin
- ✅ Understood basic session management concepts

:::

---

## Follow Along: Using Dynamic Contexts

### Step 1: Understand How the Three Contexts Work

First, understand the definition of each context:

#### dev.md - Development Mode

**Goal**: Quickly implement features, get them working first, then refine

**Priorities**:
1. Get it working
2. Get it right
3. Get it clean

**Behavior Strategy**:
- Write code first, explain after
- Prefer working solutions over perfect solutions
- Run tests after changes
- Keep commits atomic

**Tool Preferences**: Edit, Write (code modification), Bash (run tests/build), Grep/Glob (search code)

---

#### review.md - Review Mode

**Goal**: Discover code quality issues, security vulnerabilities, and maintainability problems

**Priorities**: Critical > High > Medium > Low

**Behavior Strategy**:
- Read thoroughly before commenting
- Prioritize issues by severity
- Suggest fixes, don't just point out problems
- Check for security vulnerabilities

**Review Checklist**:
- [ ] Logic errors
- [ ] Edge cases
- [ ] Error handling
- [ ] Security (injection, auth, secrets)
- [ ] Performance
- [ ] Readability
- [ ] Test coverage

**Output Format**: Grouped by file, severity prioritized

---

#### research.md - Research Mode

**Goal**: Deeply understand problems, explore possible solutions

**Research Process**:
1. Understand the question
2. Explore relevant code/docs
3. Form hypothesis
4. Verify with evidence
5. Summarize findings

**Behavior Strategy**:
- Read widely before concluding
- Ask clarifying questions
- Document findings as you go
- Don't write code until understanding is clear

**Tool Preferences**: Read (understand code), Grep/Glob (search patterns), WebSearch/WebFetch (external docs), Task with Explore agent (codebase issues)

**Output Format**: Findings first, suggestions later

---

### Step 2: Select and Apply Context

Choose the appropriate context based on the current working scenario.

#### Scenario 1: Implement a New Feature

**Applicable Context**: `dev.md`

**How to Apply**:

```markdown
@contexts/dev.md

Please help me implement user authentication:
1. Support email and password login
2. Generate JWT tokens
3. Implement middleware to protect routes
```

**How Claude Will Behave**:
- Quickly implement core functionality
- Don't over-design
- Run tests to verify after implementation
- Keep commits atomic (each commit completes a small feature)

**You Should See**:
- Quickly get working code
- Tests pass
- Functionality works, though may not be elegant

---

#### Scenario 2: Review a Colleague's PR

**Applicable Context**: `review.md`

**How to Apply**:

```markdown
@contexts/review.md

Please review this PR: https://github.com/your-repo/pull/123

Focus on checking:
- Security (SQL injection, XSS, authentication)
- Error handling
- Performance issues
```

**How Claude Will Behave**:
- Thoroughly read all related code first
- Prioritize issues by severity
- Provide fix suggestions for each issue
- Don't modify code directly, only suggest changes

**You Should See**:
- Structured review report (by file, by severity)
- Each issue has specific location and fix suggestions
- Critical issues are prioritized and marked

---

#### Scenario 3: Research Integration of a New Technology

**Applicable Context**: `research.md`

**How to Apply**:

```markdown
@contexts/research.md

I want to integrate ClickHouse as an analytics database in my project. Please help me research:

1. ClickHouse's advantages and disadvantages
2. How it fits with our existing PostgreSQL architecture
3. Migration strategy and risks
4. Performance benchmark results

Don't write code. Research the solution clearly first.
```

**How Claude Will Behave**:
- Search ClickHouse official documentation and best practices first
- Read related migration case studies
- Analyze compatibility with existing architecture
- Document findings while exploring
- Provide comprehensive recommendations at the end

**You Should See**:
- Detailed technical comparison analysis
- Risk assessment and migration recommendations
- No code, only solutions and conclusions

---

### Step 3: Switch Contexts in the Same Session

You can dynamically switch contexts within the same session to adapt to different working stages.

**Example: Development + Review Workflow**

```markdown
#### Step 1: Implement feature (dev mode)
@contexts/dev.md
Please implement user login functionality with email and password authentication.
...
#### Claude quickly implements the feature

#### Step 2: Self-review (review mode)
@contexts/review.md
Please review the login functionality code just implemented:
...
#### Claude switches to review mode, deeply analyzes code quality
#### Lists issues and improvement suggestions by severity

#### Step 3: Improve based on review (dev mode)
@contexts/dev.md
Based on the review above, fix Critical and High priority issues.
...
#### Claude quickly fixes the issues

#### Step 4: Review again (review mode)
@contexts/review.md
Review the fixed code again.
...
#### Claude verifies whether issues are resolved
```

**You Should See**:
- Clear focus for different stages
- Quick iteration during development stage
- Deep analysis during review stage
- Avoid behavioral conflicts within the same mode

---

### Step 4: Create Custom Contexts (Optional)

If the three predefined modes don't meet your needs, you can create custom contexts.

**Context File Format**:

```markdown
#### My Custom Context

Mode: [mode name]
Focus: [focus]

## Behavior
- Behavior rule 1
- Behavior rule 2

## Priorities
1. Priority 1
2. Priority 2

## Tools to favor
- Recommended tools to use
```

**Example: `debug.md` - Debug Mode**

```markdown
#### Debug Context

Mode: Debugging and troubleshooting
Focus: Root cause analysis and fix

## Behavior
- Start by gathering evidence (logs, error messages, stack traces)
- Form hypothesis before proposing fixes
- Test fixes systematically (control variables)
- Document findings for future reference

## Debug Process
1. Reproduce the issue consistently
2. Gather diagnostic information
3. Narrow down potential causes
4. Test hypotheses
5. Verify the fix works

## Tools to favor
- Read for code inspection
- Bash for running tests and checking logs
- Grep for searching error patterns
```

**Using Custom Contexts**:

```markdown
@contexts/debug.md

I encountered this issue in production:
[error message]
[related logs]

Please help me debug.
```

---

## Checklist ✅

After completing the above steps, you should be able to:

- [ ] Understand how the three predefined contexts work and their use cases
- [ ] Choose the appropriate context based on the working scenario
- [ ] Dynamically switch contexts within a session
- [ ] Know how to create custom contexts
- [ ] Experience significant differences in AI behavior under different contexts

---

## Common Pitfalls

### ❌ Mistake 1: Not switching contexts, expecting AI to adapt automatically

**Problem**: In the same session, switching between development and review without telling AI the current goal.

**Symptom**: Claude's behavior is chaotic—sometimes over-analyzing, sometimes rushing to modify code.

**Correct Approach**:
- Explicitly switch contexts: `@contexts/dev.md` or `@contexts/review.md`
- Declare the current goal at the start of each stage
- Use `## Step X: [goal]` to clearly mark stages

---

### ❌ Mistake 2: Using research mode for quick development

**Problem**: Need to implement a feature quickly within 30 minutes, but used `@contexts/research.md`.

**Symptom**: Claude spends a lot of time researching, discussing, and analyzing, but迟迟 doesn't start writing code.

**Correct Approach**:
- Use `dev` mode for quick development
- Use `research` mode for deep research
- Choose the mode based on time pressure and task complexity

---

### ❌ Mistake 3: Using dev mode to review critical code

**Problem**: Reviewing critical code involving security, money, or privacy, but used `@contexts/dev.md`.

**Symptom**: Claude quickly scans through, potentially missing serious security vulnerabilities.

**Correct Approach**:
- Critical code review must use `review` mode
- Ordinary PR review should use `review` mode
- Only use `dev` mode for self-quick iteration

---

## Summary

Dynamic context injection optimizes AI behavior strategies in different scenarios by clarifying the current working mode:

**Three Predefined Modes**:
- **dev**: Quick implementation, get it working first, then refine
- **review**: Deep review, discover issues and suggest fixes
- **research**: Thorough research, understand before concluding

**Key Usage Points**:
1. Switch contexts based on working stage
2. Use `@contexts/xxx.md` to explicitly load contexts
3. Can switch multiple times within the same session
4. Can create custom contexts to meet specific needs

**Core Value**: Avoid AI behavior chaos, improve focus and efficiency across different stages.

---

## Coming Up Next

> In the next lesson, we'll learn **[Configuration Guide: settings.json Complete Reference](../../appendix/config-reference/)**.
>
> You'll learn:
> - Complete configuration options for settings.json
> - How to customize Hooks configuration
> - MCP server enable and disable strategies
> - Priority of project-level and global-level configurations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature               | File Path                                                                                   | Lines |
|--- | --- | ---|
| dev context definition | [`contexts/dev.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/dev.md) | 1-21  |
| review context definition | [`contexts/review.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/review.md) | 1-23  |
| research context definition | [`contexts/research.md`](https://github.com/affaan-m/everything-claude-code/blob/main/contexts/research.md) | 1-27  |

**Key Context Files**:
- `dev.md`: Development mode context, prioritizing quick feature implementation
- `review.md`: Review mode context, prioritizing discovering code quality issues
- `research.md`: Research mode context, prioritizing deep understanding of problems

</details>
