---
title: "Prometheus Planning: Interview System | oh-my-opencode"
sidebarTitle: "Prometheus Planning"
subtitle: "Prometheus Planning: Interview-Style Requirements Gathering and Work Plan Generation"
description: "Master Prometheus agent's interview-style planning system. Learn to generate high-quality work plans through structured requirements gathering, Metis consultation, and Momus validation. Achieve perfect planning and execution separation."
tags:
  - "planning"
  - "prometheus"
  - "interview"
prerequisite:
  - "start-sisyphus-orchestrator"
  - "advanced-ai-agents-overview"
order: 70
---

# Prometheus Planning: Interview-Style Requirements Gathering and Work Plan Generation

## What You'll Learn

- Start a Prometheus planning session to clarify project requirements through interview mode
- Understand Prometheus's core principle of "plan only, don't implement"
- Collaborate with Metis and Momus to generate high-quality, comprehensive work plans
- Use the `/start-work` command to hand off plans for Atlas execution

## Your Current Challenge

Imagine giving AI a complex task: "Help me refactor the authentication system."

**5 minutes later**, AI starts writing code. You're happy, feeling you've saved time.

**30 minutes later**, you realize:
- AI didn't ask which auth library to use (JWT? NextAuth? Session?)
- AI made many assumptions (like "must support OAuth" when you don't need it)
- Code is halfway done, but direction is wrong, complete redo needed
- Testing reveals core logic incompatible with existing system

This is the classic "mixed planning and execution" problem: AI starts working before requirements are clear, leading to extensive rework.

## When to Use Prometheus

::: tip When to Use
**Suitable for Prometheus**:
- Complex feature development (e.g., "add user authentication system")
- Large-scale refactoring (e.g., "refactor entire data access layer")
- Architecture design (e.g., "design microservices architecture")
- Tasks requiring strict quality assurance

**Direct Sisyphus execution**:
- Simple bug fixes (e.g., "fix login button typo")
- Clear, small features (e.g., "add form with 3 inputs")
:::

## 🎒 Preparation

Ensure the following configurations are complete:

- [ ] Prometheus agent enabled (enabled by default)
- [ ] At least one AI Provider configured (Anthropic, OpenAI, etc.)
- [ ] Understanding of basic agent concepts (completed "[AI Agents Team: Meet 10 Experts](../ai-agents-overview/)")

**Verify Prometheus is available**:

```bash
# Type in OpenCode chat
@prometheus

# Should see Prometheus prompt:
# "Hello, I am Prometheus - Strategic Planning Advisor. ..."
```

## Core Concepts

### Prometheus's Core Identity Constraint

What's Prometheus's most important feature? **It never writes code**.

| Function | Prometheus | Sisyphus | Atlas |
|--- | --- | --- | ---|
| Requirements gathering | ✅ | ❌ | ❌ |
| Work plan generation | ✅ | ❌ | ❌ |
| Code implementation | ❌ | ✅ | ✅ (delegated) |
| Task execution | ❌ | ✅ | ✅ (delegated) |

**Why is this important?**

- **Planner ≠ Executor**: Just like product managers don't write code, Prometheus's role is "how to do it," not "doing it"
- **Prevent assumptions**: If Prometheus could write code directly, it might "guess and do" when requirements are unclear
- **Force thinking**: After being banned from writing code, Prometheus must clarify all details

### Three-Phase Workflow

```mermaid
flowchart LR
    A[User input requirements] --> B[Phase 1: Interview Mode]
    B -->|Requirements clear?| C[Phase 2: Plan Generation]
    C --> D[Metis consultation]
    D -->|Need high precision?| E[Momus loop verification]
    E -->|Plan refined| F[Generate .sisyphus/plans/*.md]
    C -->|No high precision needed| F
    F --> G[/start-work execution]
```

**Phase responsibilities**:

- **Phase 1 - Interview Mode**: Collect requirements, research codebase, continuously update draft
- **Phase 2 - Plan Generation**: Consult Metis, generate complete plan, present summary
- **Phase 3 - Execution**: Hand off to Atlas via `/start-work`

## Follow Along

### Step 1: Start Prometheus Planning Session

**Why**
Trigger Prometheus via keyword or command to enter interview mode.

**Action**

Type in OpenCode chat:

```
@prometheus help me plan a user authentication system
```

**You should see**:
- Prometheus confirms entering interview mode
- Asks first question (e.g., "What tech stack is your app built with?")
- Creates draft file `.sisyphus/drafts/user-auth.md`

::: info Key Feature: Draft Files
Prometheus **continuously updates** files under `.sisyphus/drafts/`. This is its "external memory":
- Records decisions from each discussion
- Saves discovered code patterns
- Marks clear boundaries (IN/OUT)

You can check the draft anytime to verify Prometheus's understanding is correct.
:::
### Step 2: Answer Questions, Let Prometheus Gather Context

**Why**
Prometheus needs to "understand" your project to generate executable plans. It doesn't guess—it gains insight by researching codebase and best practices.

**Action**

Answer Prometheus's questions, for example:

```
User input:
My app is Next.js 14, App Router, currently no authentication.
I want to support email/password login and GitHub OAuth.
```

**What Prometheus will do**:

- Use `explore` agent to analyze existing code structure
- Use `librarian` agent to find authentication best practices
- Update "Requirements" and "Technical Decisions" sections in draft file

**You should see**:

```
I've started the explore agent to analyze your project structure...

1. explore: Find existing session patterns
2. librarian: Find NextAuth best practices

Waiting for results to return, then I'll continue with questions.
```

### Step 3: Check Draft File (Optional)

**Why**
The draft is Prometheus's "external memory." You can verify at any time if its understanding is correct.

**Action**

```bash
# Check draft content in terminal
cat .sisyphus/drafts/user-auth.md
```

**You should see** similar content:

```markdown
# Draft: user-auth

## Requirements (confirmed)
- Tech stack: Next.js 14, App Router
- Auth methods: Email/password + GitHub OAuth
- Current state: No authentication implementation

## Technical Decisions
- No decisions yet

## Research Findings
- Explore agent running...
```

### Step 4: Continue Answering Until Requirements Are Clear

**Why**
Prometheus has a "Clearance Checklist." Only after all items are checked will it automatically transition to plan generation.

**Prometheus's judgment criteria**:

```
CLEARANCE CHECKLIST (ALL must be YES to auto-transition):
□ Are core objectives clear?
□ Are scope boundaries clear (IN/OUT)?
□ No critical ambiguities left?
□ Is technical solution determined?
□ Is testing strategy confirmed (TDD/manual)?
□ No blocking issues?
```

**Action**

Continue answering Prometheus's questions until it says:

```
All requirements are clear. Consulting Metis and generating plan...
```

**You should see**:
- Prometheus calls Metis agent
- Metis analyzes potential missed issues
- Prometheus adjusts understanding based on Metis's feedback

### Step 5: Review Generated Plan

**Why**
The plan file is Prometheus's final output, containing all tasks, dependencies, and acceptance criteria.

**Action**

```bash
# Check generated plan
cat .sisyphus/plans/user-auth.md
```

**You should see** complete structure:

```markdown
# User Authentication System

## Context
[Original requirement description]
[Interview summary]
[Metis analysis results]

## Work Objectives
- Core objective: Implement email/password login and GitHub OAuth
- Specific deliverables: Login page, API endpoints, session management
- Completion definition: Users can log in and access protected routes

## Verification Strategy
- Infrastructure exists: YES
- User wants tests: TDD
- Framework: vitest

## TODOs
- [ ] 1. Install NextAuth.js and configure
  - References:
    - https://next-auth.js.org/getting-started/installation
  - Acceptance Criteria:
    - [ ] npm run test → PASS (1 test)

- [ ] 2. Create API route [...nextauth]/route.ts
  - References:
    - src/lib/session.ts:10-45 - Existing session pattern
  - Acceptance Criteria:
    - [ ] curl http://localhost:3000/api/auth/... → 200

- [ ] 3. Implement login page UI
  - References:
    - src/app/login/page.tsx - Existing login page structure
  - Acceptance Criteria:
    - [ ] Playwright verification: See login form
    - [ ] Screenshot saved to .sisyphus/evidence/

...
```

### Step 6: Choose Execution Method

**Why**
Prometheus gives you two choices: quick start or high-precision review.

**Prometheus's presentation** (using Question tool):

```
## Plan Generated: user-auth

**Key Decisions Made:**
- Use NextAuth.js (integrates well with Next.js App Router)
- GitHub OAuth provider + email/password

**Scope:**
- IN: Login functionality, session management, route protection
- OUT: Registration, password reset, user profile editing

**Guardrails Applied:**
- Must follow existing session pattern
- Do not modify core business logic

Plan saved to: `.sisyphus/plans/user-auth.md`

---

**Next Step**

How to proceed?

1. **Start Work**: Execute /start-work. The plan looks solid.
2. **High Accuracy Review**: Let Momus strictly verify every detail. Adds review cycles but guarantees precision.
```

**Action**

Select an option (click button in OpenCode or type option).

).

**If you choose "Start Work"**:

- Prometheus deletes draft file
- Prompts you to run `/start-work`

**If you choose "High Accuracy Review"**:

- Prometheus enters Momus loop
- Continuously fixes feedback until Momus says "OKAY"
- Then prompts you to run `/start-work`

### Step 7: Execute Plan

**Why**
The plan is Prometheus's output; execution is Atlas's responsibility.

**Action**

```bash
# Type in OpenCode
/start-work
```

**You should see**:
- Atlas reads `.sisyphus/plans/user-auth.md`
- Creates `boulder.json` status file
- Executes each TODO in sequence
- Delegates tasks to specialized agents (e.g., UI work to Frontend)

**Checkpoint ✅**

- `boulder.json` file created
- Atlas starts executing task 1
- Status updates after each task completion

## Common Pitfalls

### Pitfall 1: Rushing for Plan Before Requirements Clear

**Problem**:
```
User: @prometheus do a user authentication
User: Don't ask so many questions, just generate the plan
```

**Consequence**: Plan full of assumptions, requires repeated modifications during execution.

**Correct approach**:
```
User: @prometheus do a user authentication
Prometheus: What tech stack is your app? Any auth currently?
User: Next.js 14, App Router, no auth
Prometheus: What login methods do you need?
User: Email/password + GitHub OAuth
...
(Continue answering until Prometheus auto-transitions)
```

::: tip Remember this principle
**Planning time ≠ wasted time**
- Spend 5 minutes clarifying requirements to save 2 hours of rework
- Prometheus's interview mode is saving your future self time
:::

### Pitfall 2: Not Checking Draft Files

**Problem**: Prometheus records many decisions and boundaries in draft, but you don't check before asking it to generate plan.

**Consequences**:
- Plan contains incorrect understanding
- You realize during execution "I never asked for this!"

**Correct approach**:
```
1. After starting planning, constantly monitor .sisyphus/drafts/ files
2. Correct misunderstandings immediately: "No, I don't want OAuth, just simple JWT"
3. Continue after correction
```

### Pitfall 3: Splitting Plans into Multiple Generations

**Problem**:
```
User: This project is too big, let's plan phase 1 first
```

**Consequences**:
- Context fragmentation between phase 1 and phase 2
- Inconsistent architectural decisions
- Requirements missed across multiple sessions

**Correct approach**:
```
✅ Single Plan Principle: No matter how big, all TODOs go in one .sisyphus/plans/{name}.md
```

**Why?**
- Both Prometheus and Atlas can handle large plans
- Single plan ensures architectural consistency
- Avoids context fragmentation

### Pitfall 4: Forgetting Metis's Role

**Problem**:
```
User: Requirements are done, quickly generate the plan
Prometheus: (Generates directly, skipping Metis)
```

**Consequences**:
- Plan might miss key boundaries
- No "Must NOT Have" explicitly excludes scope
- AI slop appears during execution (over-engineering)

**Correct approach**:
```
✅ Metis consultation is mandatory, no need to rush it
```

**What does Metis do?**
- Identifies questions Prometheus should have asked but didn't
- Raises boundaries that need clarification
- Prevents AI over-engineering

### Pitfall 5: Ignoring Testing Strategy Decisions

**Problem**: Prometheus asks "Do you need tests?" and you say "doesn't matter" or skip.

**Consequences**:
- If testing infrastructure exists but TDD not utilized, opportunity missed
- If no tests and no detailed manual verification steps, execution failure rate is high

**Correct approach**:
```
Prometheus: I see you have the vitest testing framework. Should the work include tests?
User: YES (TDD)
```

**Impact**:
- Prometheus structures each task as: RED → GREEN → REFACTOR
- TODO Acceptance Criteria will explicitly include test commands
- Atlas will follow TDD workflow during execution

## Lesson Summary

**Prometheus Core Value**:
- **Separate planning from execution**: Through "no code writing" constraint, ensures clear requirements
- **Interview mode**: Continuous questioning, researching codebase, updating drafts
- **Quality assurance**: Metis consultation, Momus validation, single plan principle

**Typical workflow**:
1. Input `@prometheus [requirement]` to start planning
2. Answer questions, check `.sisyphus/drafts/` draft
3. Wait for Prometheus auto-transition (Clearance Checklist all checked)
4. Review generated `.sisyphus/plans/{name}.md`
5. Choose "Start Work" or "High Accuracy Review"
6. Run `/start-work` to hand off to Atlas for execution

**Best practices**:
- Spend time understanding requirements, don't rush for the plan
- Continuously check draft files, correct misunderstandings promptly
- Follow single plan principle, don't split large tasks
- Clarify testing strategy, affects entire plan structure

## Next Lesson Preview

> Next, we'll learn **[Background Tasks: Working Like a Team](../background-tasks/)**.
>
> You'll learn:
> - How to make multiple agents work in parallel, greatly improving efficiency
> - Configure concurrency limits to avoid API rate limiting
> - Manage background tasks, retrieve results and cancel operations
> - Coordinate multiple expert agents like a "real team"

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-26

| Function | File Path | Line Number |
|--- | --- | ---|
| Prometheus system prompt | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 19-1184 |
| Prometheus permission config | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1187-1197 |
| Metis agent | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | - |
| Momus agent | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | - |
| Orchestration guide | [`docs/orchestration-guide.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/orchestration-guide.md) | 67-90 |

**Core Constants**:
- `PROMETHEUS_SYSTEM_PROMPT`: Complete system prompt defining Prometheus's identity, workflow, and constraints

**Key Functions/Tools**:
- `PROMETHEUS_PERMISSION`: Defines Prometheus's tool permissions (only allows .md file editing)

**Business Rules**:
- Prometheus default mode: INTERVIEW MODE
- Auto-transition condition: Clearance Checklist all items are YES
- Metis consultation: Mandatory, executed before plan generation
- Momus loop: Optional high-precision mode, loops until "OKAY"
- Single plan principle: No matter how large the task, all TODOs in one `.md` file
- Draft management: Continuously updates `.sisyphus/drafts/{name}.md`, deletes after plan completion
</details>
