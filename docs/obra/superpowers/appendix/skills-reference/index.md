---
title: "Skills Complete Reference: 14 Core Skills Quick Reference | Superpowers Tutorial"
sidebarTitle: "Skills Complete Reference"
subtitle: "Skills Complete Reference: 14 Core Skills Quick Reference"
description: "Superpowers complete skills reference manual containing all 14 skills' trigger conditions, core points, and quick lookup table. Master the full skill library, choose the correct skill based on task type, understand skill dependencies, and improve AI coding agent efficiency."
tags:
  - "Skills Library"
  - "Reference"
  - "Quick Reference"
order: 260
---

# Skills Complete Reference: 14 Core Skills Quick Reference

## What You'll Learn

- Quickly find trigger conditions and use cases for all skills
- Understand core points and iron rules for each skill
- Choose the correct skill based on task type
- Master skill dependencies and invocation order

## Your Current Challenges

- Can't remember all skills' trigger conditions
- Unsure which skill to use for the current task
- Want to quickly browse the full skill library
- Need to verify a specific skill's core points

## When to Use This Approach

When you need to:
- Quickly find a skill's purpose
- Verify if a skill applies to the current task
- Understand skill dependencies
- Verify a skill's core points

## Skill Library Overview

Superpowers provides 14 core skills, divided into 4 major categories:

- **Testing**: 2 skills
- **Debugging**: 1 skill
- **Collaboration**: 9 skills
- **Meta**: 2 skills

::: tip
Skills are stored as files in the `skills/` directory and automatically loaded via the Skill tool. All skills follow the "test before write" principle to ensure AI agents follow best practices.
:::

## Core Skill Iron Rules

Before using any skill, you must remember these core principles:

1. **TDD Iron Rule** - No code without tests
2. **Debugging Iron Rule** - No fixes without root cause investigation
3. **Verification Iron Rule** - No completion claims without evidence

These iron rules are not optional—they are mandatory.

---

## Testing Skills

### test-driven-development (TDD)

**Trigger Conditions**: Before implementing any feature or fixing any bug, before writing implementation code

**Core Points**:
- Iron Rule: `NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`
- Follow the RED-GREEN-REFACTOR cycle:
  - **RED**: Write a failing test, verify it fails as expected
  - **GREEN**: Write minimal code to make the test pass
  - **REFACTOR**: Clean up code while keeping tests passing
- Every change must start with writing a test, see it fail before implementing
- Forbidden: "write code first then add tests" or "test to verify passing"
- Violating TDD iron rule = delete code and start over

**Common Misconceptions**:
- ❌ "Too simple to need a test" → Simple code also has problems
- ❌ "I'll write the test later" → Tests passing immediately proves nothing
- ❌ "Already manually tested" → Ad-hoc testing ≠ systematic testing
- ❌ "Deleting X hours of work is wasteful" → Sunk cost fallacy, keeping unverified code = technical debt

**Documentation Location**: [`skills/test-driven-development/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md)

---

#### verification-before-completion

**Trigger Conditions**: Before claiming work done, fixes complete, or passing, before committing or creating a PR

**Core Points**:
- Iron Rule: `NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE`
- Before making any success claim:
  1. **IDENTIFY**: What command proves this claim?
  2. **RUN**: Execute complete command (fresh, complete)
  3. **READ**: Read complete output, check exit code, count failures
  4. **VERIFY**: Does output confirm the claim?
  5. **ONLY THEN**: Can you make the claim
- Forbidden: Use uncertain words like "should", "might", "looks like"
- Forbidden: Express satisfaction before verification ("Great!", "Done!", etc.)
- Skipping any verification step = deception, not verification

**Verification Examples**:
- ✅ `[Run tests] [See: 34/34 passing] "All tests pass"`
- ❌ `"It should pass now"` / `"Looks correct"`

**Documentation Location**: [`skills/verification-before-completion/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md)

---

## Debugging Skills

## Debugging Skills

### systematic-debugging

**Trigger Conditions**: When encountering any bug, test failure, or unexpected behavior, before proposing a fix

**Core Points**:
- Iron Rule: `NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST`
- Must complete all 4 phases before proceeding to the next phase:
  1. **Root Cause Investigation**: Read error messages, reproduce consistently, check recent changes, collect evidence
  2. **Pattern Analysis**: Find working examples, compare references, identify differences, understand dependencies
  3. **Hypothesis and Testing**: Propose a single hypothesis, minimal test, verify before proceeding
  4. **Implementation**: Create failing test, implement single fix, verify fix works
- Forbidden: Skip root cause investigation and directly fix symptoms
- If 3 fixes fail, must question the architecture rather than continuing to fix

**Multi-Component System Diagnosis**:
In multi-component systems (CI → build → signing → API → service → database), add diagnostics for each component boundary before proposing fixes:
```
For each component boundary:
  - Log data entering component
  - Log data leaving component
  - Verify environment/configuration propagation
  - Check state at each layer
```

**Red Alerts - Stop and Follow Process**:
- "Quick fix first, investigate later"
- "Try changing X to see if it works"
- "Multiple changes together, run tests"
- "Skip tests, I'll verify manually"
- "It might be X, let me fix it"
- "I don't fully understand but this might work"

**Documentation Location**: [`skills/systematic-debugging/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md)

---

## Collaboration Skills

## Collaboration Skills

### brainstorming

**Trigger Conditions**: Before any creative work - creating features, building components, adding functionality, or modifying behavior

**Core Points**:
- Transform ideas into complete designs and specifications through natural conversation
- Understand project context, then ask one question at a time to refine the idea
- Exploration approach: Present 2-3 different approaches with trade-offs
- Design presentation: Present in segments (200-300 words each), confirm after each segment
- YAGNI principle: Remove unnecessary features from all designs
- After design is complete:
  - Write to `docs/plans/YYYY-MM-DD-<topic>-design.md`
  - Commit design document

**Key Principles**:
- One question at a time - Don't overwhelm users with multiple questions
- Prefer multiple choice - Easier to answer than open-ended
- YAGNI thoroughly - Remove all unnecessary features from designs
- Explore alternatives - Always present 2-3 approaches before deciding
- Incremental verification - Present design in segments, verify each one

**Documentation Location**: [`skills/brainstorming/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md)

---

#### writing-plans

**Trigger Conditions**: Before touching code for multi-step tasks with specifications or requirements

**Core Points**:
- Assume engineers have zero context on the codebase and questionable taste
- Document everything they need to know: which files, code, tests to touch for each task, what documentation to check, how to test
- Break down entire plan into bite-sized tasks (2-5 minutes each step)
- DRY, YAGNI, TDD, frequent commits
- Save plan to: `docs/plans/YYYY-MM-DD-<feature-name>.md`

**Task Granularity**:
Each step is one operation (2-5 minutes):
- "Write failing test" - step
- "Run test to confirm it fails" - step
- "Implement minimal code to make test pass" - step
- "Run test to confirm passing" - step
- "Commit" - step

**Plan Document Header**:
```markdown
## [Feature Name] Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** [One sentence describing what this builds]

**Architecture:** [2-3 sentences about approach]

**Tech Stack:** [Key technologies/libraries]

---
```

**Execution Options**:
After saving plan, provide execution choice:
1. **Subagent-Driven (this session)** - Dispatch fresh subagent for each task, review between tasks, rapid iteration
2. **Parallel Session (independent session)** - Use executing-plans in new session, batch execute with checkpoints

**Documentation Location**: [`skills/writing-plans/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/writing-plans/SKILL.md)

---

#### executing-plans

**Trigger Conditions**: Have written implementation plan, execute in independent session with review checkpoints

**Core Points**:
- Core principle: Batch execute with architect review checkpoints
- Process:
  1. **Load and Review Plan**: Read plan, review critically, raise concerns immediately if any
  2. **Execute Batches**: Default first 3 tasks, follow each step
  3. **Report**: Show implementation and verification output after batch, say "Ready for feedback"
  4. **Continue**: Apply changes based on feedback, execute next batch
  5. **Finish Development**: Use `finishing-a-development-branch` after all tasks complete
- Stop immediately and seek help when blocked, don't guess
- Forbidden: Start implementation on main/master branch without explicit user approval

**When to Stop and Seek Help**:
Stop execution immediately when:
- Encountered a blocker in the batch (missing dependency, test failure, unclear instructions)
- Plan has critical gaps preventing you from starting
- You don't understand the instructions
- Verification keeps failing

**Documentation Location**: [`skills/executing-plans/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/executing-plans/SKILL.md)

---

#### subagent-driven-development

**Trigger Conditions**: Executing implementation plans with independent tasks, in current session

**Core Points**:
- Core principle: One fresh subagent per task + two-stage review (spec compliance, then code quality) = high quality, rapid iteration
- Difference from executing-plans:
  - Same session (no context switching)
  - Fresh subagent for each task (no context pollution)
  - Two-stage review after each task: spec compliance first, then code quality
  - Faster iteration (no human intervention between tasks)

**Process**:
```
1. Read plan, extract all tasks with complete text, create TodoWrite
2. For each task:
   - Dispatch implementer subagent
   - Implementer asks questions? → Answer, provide context
   - Implementer implements, tests, commits, self-reviews
   - Dispatch spec compliance reviewer → Does code match spec?
     - No → Implementer fixes spec gap → Re-review
   - Dispatch code quality reviewer → Reviewer approves?
     - No → Implementer fixes quality issues → Re-review
   - Mark task complete
3. After all tasks complete, dispatch final code reviewer
4. Use finishing-a-development-branch to finish development
```

**Quality Thresholds**:
- Self-review catches issues before handoff
- Two-stage review: spec compliance, then code quality
- Review loops ensure fixes actually work
- Spec compliance prevents over/under-building
- Code quality ensures good implementation

**Documentation Location**: [`skills/subagent-driven-development/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md)

---

#### using-git-worktrees

**Trigger Conditions**: Starting feature work that needs isolation from current workspace, or before executing implementation plan

**Core Points**:
- Git worktrees create isolated workspaces sharing the same repository, allowing working on multiple branches simultaneously without switching
- Core principle: Systematic directory selection + safety verification = reliable isolation
- Directory selection priority:
  1. Check existing directories (`.worktrees` or `worktrees`)
  2. Check worktree directory configuration in CLAUDE.md
  3. If none, ask user

**Safety Verification**:
For project-local directories, must verify directory is ignored before creating worktree:
```bash
git check-ignore -q .worktrees 2>/dev/null || git check-ignore -q worktrees 2>/dev/null
```
If not ignored:
1. Add appropriate line to .gitignore
2. Commit changes
3. Continue to create worktree

**Creation Steps**:
1. Detect project name
2. Create worktree: `git worktree add "$path" -b "$BRANCH_NAME"`
3. Run project setup (auto-detect and install dependencies)
4. Verify clean baseline (run tests)
5. Report location

**Documentation Location**: [`skills/using-git-worktrees/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md)

---

#### finishing-a-development-branch

**Trigger Conditions**: Implementation complete, all tests passing, need to decide how to integrate work

**Core Points**:
- Core principle: Verify tests → Show options → Execute choice → Cleanup
- Process:
  1. **Verify Tests**: Run test suite, stop if fails
  2. **Determine Base Branch**: `git merge-base HEAD main` or `master`
  3. **Show Options**: Exactly 4 options
  4. **Execute Choice**:
     - Option 1: Merge locally
     - Option 2: Push and create PR
     - Option 3: Keep branch as-is
     - Option 4: Discard (requires confirmation)
  5. **Cleanup Worktree**: Required for options 1, 2, 4

**Four Options**:
```
1. Merge back to <base-branch> locally
2. Push and create a Pull Request
3. Keep the branch as-is (I'll handle it later)
4. Discard this work
```

**Forbidden**:
- Proceed to merge/PR when tests are failing
- Delete worktree without verification
- Force push without explicit request
- Auto-cleanup worktree for option 4

**Documentation Location**: [`skills/finishing-a-development-branch/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/finishing-a-development-branch/SKILL.md)

---

#### requesting-code-review

**Trigger Conditions**: After completing tasks, implementing major features, or before merging to main branch, to verify work meets requirements

**Core Points**:
- Core principle: Review early, review often
- Required: After every subagent-driven development task, after completing major features, before merging to main
- Process:
  1. **Get git SHAs**:
     ```bash
     BASE_SHA=$(git rev-parse HEAD~1)
     HEAD_SHA=$(git rev-parse HEAD)
     ```
  2. **Dispatch code-reviewer subagent**: Use Task tool, fill `code-reviewer.md` template
  3. **Act on feedback**:
     - Fix Critical issues immediately
     - Fix Important issues before continuing
     - Handle Minor issues later
     - If reviewer is wrong, push back with technical reasoning

**Required Workflow Skills**:
- `using-git-worktrees` - Set up isolated workspace before starting
- `writing-plans` - Create plan for this skill to execute
- `finishing-a-development-branch` - Finish development after all tasks complete

**Documentation Location**: [`skills/requesting-code-review/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/requesting-code-review/SKILL.md)

---

#### receiving-code-review

**Trigger Conditions**: Received code review feedback, before implementing suggestions, especially when feedback is unclear or technically questionable

**Core Points**:
- Core principle: Verify before implementing. Ask before assuming. Technical correctness over social comfort
- Response pattern:
  ```
  1. READ: Read feedback completely, don't react
  2. UNDERSTAND: Restate requirement in your own words (or ask)
  3. VERIFY: Check against codebase reality
  4. EVALUATE: Is this technically sound for this codebase?
  5. RESPOND: Technical confirmation or reasoned pushback
  6. IMPLEMENT: One item at a time, test each
  ```

**Forbidden Responses**:
- ❌ "You're absolutely correct!" (explicitly violates CLAUDE.md)
- ❌ "Great!" / "Excellent feedback!" (performative)
- ❌ "I'll implement it now" (before verification)

**Handling Unclear Feedback**:
If any item is unclear, stop and ask for clarification. Items may be related, partial understanding = incorrect implementation.

**When to Push Back**:
- Suggestion breaks existing functionality
- Reviewer lacks complete context
- Violates YAGNI (unused features)
- Technically incorrect for this stack
- Legacy/compatibility reasons exist
- Conflicts with your human partner's architectural decisions

**Documentation Location**: [`skills/receiving-code-review/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/receiving-code-review/SKILL.md)

---

#### dispatching-parallel-agents

**Trigger Conditions**: Facing 2+ tasks that can work independently without shared state or sequential dependencies

**Core Points**:
- Core principle: Dispatch one agent per independent problem domain. Let them work concurrently
- When to use:
  - 3+ test files failing with different root causes
  - Multiple subsystems independently broken
  - Each problem can be understood without depending on others
  - No shared state between investigations
- Forbidden to use: Failures related (fixing one might fix others), need to understand complete system state, agents will interfere with each other

**Pattern**:
1. **Identify Independent Domains**: Group failures by what's broken
2. **Create Focused Agent Tasks**: Each agent gets specific scope, clear goals, constraints, expected output
3. **Dispatch in Parallel**:
   ```typescript
   Task("Fix agent-tool-abort.test.ts failures")
   Task("Fix batch-completion-behavior.test.ts failures")
   Task("Fix tool-approval-race-conditions.test.ts failures")
   ```
4. **Review and Integrate**: When agents return, read each summary, verify fixes don't conflict, run full test suite, integrate all changes

**Key Benefits**:
- Parallelism - Multiple investigations simultaneously
- Focus - Each agent has narrow scope, less context to track
- Independence - Agents don't interfere with each other
- Speed - 3 problems solved in time of 1

**Documentation Location**: [`skills/dispatching-parallel-agents/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/dispatching-parallel-agents/SKILL.md)

---

## Meta Skills

### using-superpowers

**Trigger Conditions**: When starting any conversation - establish how to find and use skills, requires calling Skill tool before ANY response (including clarification questions)

**Core Points**:
- Iron Rule: If you think there's even a 1% chance a skill might apply, you absolutely must call the skill
- You have no choice for tasks where skills apply. You must use them.
- This is non-negotiable, not optional, cannot be reasoned away
- Rule: Call relevant or requested skill before any response or action. Even if only 1% possibility, that means you should call the skill to check
- If the called skill result finds it doesn't apply, no need to use it

**Skill Priority**:
When multiple skills apply, follow this order:
1. **Process skills first** (brainstorming, debugging) - determine how to handle the task
2. **Implementation skills second** (frontend-design, mcp-builder) - guide execution

**Skill Types**:
- **Rigid** (TDD, debugging): Follow exactly, no adaptation discipline
- **Flexible** (patterns): Adjust principles based on context

**Red Alerts - These thoughts mean stop, you're rationalizing**:
| Thought | Reality |
|--------|---------|
| "This is just a simple question" | Questions are also tasks, check skills |
| "I need more context" | Skill check is before clarification questions |
| "Let me explore the codebase first" | Skills tell you how to explore, check first |
| "I can quickly check git/files" | Files lack conversation context, check skills |
| "Let me gather information first" | Skills tell you how to gather information |
| "This doesn't need a formal skill" | If a skill exists, use it |
| "I remember this skill" | Skills evolve, read current version |
| "This doesn't count as a task" | Action = task, check skills |
| "The skill is too heavy" | Simple things get complex, use it |
| "I'll do this one thing first" | Check skills before doing anything |
| "This feels productive" | Undisciplined actions waste time, skills prevent this |
| "I know what that means" | Knowing concept ≠ using skill, call it |

**Documentation Location**: [`skills/using-superpowers/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md)

---

#### writing-skills

**Trigger Conditions**: Creating new skills, editing existing skills, or verifying skills work before deploying

**Core Points**:
- **Writing skills is test-driven development applied to process documentation**
- TDD mapping:
  - Test case → Stress scenarios for subagents
  - Production code → Skill documentation (SKILL.md)
  - Test failing (RED) → Agents violate rules without skill (baseline)
  - Test passing (GREEN) → Agents follow the skill when it exists
  - Refactor → Close loopholes while maintaining compliance

**When to Create Skills**:
- Technical approach is not obvious to you
- You'll reference it again in the project
- Pattern is widely applicable (not project-specific)
- Others will benefit

**SKILL.md Structure**:
```yaml
---
name: Skill-Name-With-Hyphens
description: Use when [specific triggering conditions and symptoms]
---

## Skill Name

### Overview
What is this? Core principle in 1-2 sentences.

## When to Use
[Small inline flowchart IF decision non-obvious]
Bullet list with SYMPTOMS and use cases
When NOT to use

## Core Pattern (for techniques/patterns)
Before/after code comparison

## Quick Reference
Table or bullets for scanning common operations

## Implementation
Inline code for simple patterns
Link to file for heavy reference or reusable tools

## Common Mistakes
What goes wrong + fixes
```

**Iron Rule** (same as TDD):
```
NO SKILL WITHOUT A FAILING TEST FIRST
```
Writing skills before testing? Delete it. Start over.
Editing skills without testing? Same violation.

**Required Background**: Must understand `test-driven-development` skill first, which defines the basic RED-GREEN-REFACTOR cycle.

**Documentation Location**: [`skills/writing-skills/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md)

---

## Skill Dependency Graph

```mermaid
graph TD
    subgraph Entry
        using-superpowers
    end

    subgraph Design Process
        brainstorming
    end

    subgraph Plan Writing
        writing-plans
    end

    subgraph Execution Process
        subagent-driven-development
        executing-plans
    end

    subgraph Testing
        test-driven-development
    end

    subgraph Debugging
        systematic-debugging
    end

    subgraph Collaboration
        using-git-worktrees
        dispatching-parallel-agents
        requesting-code-review
        receiving-code-review
        finishing-a-development-branch
    end

    subgraph Meta
        writing-skills
    end

    using-superpowers --> All other skills

    brainstorming --> writing-plans
    writing-plans --> subagent-driven-development
    writing-plans --> executing-plans

    subagent-driven-development --> test-driven-development
    subagent-driven-development --> requesting-code-review

    executing-plans --> test-driven-development

    systematic-debugging --> test-driven-development

    using-git-worktrees --> subagent-driven-development
    using-git-worktrees --> executing-plans
    using-git-worktrees --> finishing-a-development-branch

    subagent-driven-development --> finishing-a-development-branch
    executing-plans --> finishing-a-development-branch

    writing-skills --> test-driven-development
```

---

## Quick Lookup Table

| Skill Name | Category | Trigger Conditions Summary | Iron Rule / Core Principle |
|-----------|----------|---------------------------|-----------------------------|
| **using-superpowers** | Meta | When starting any conversation | Must call even at 1% applicability |
| **brainstorming** | Collaboration | Before creative work | One question at a time, verify in segments |
| **writing-plans** | Collaboration | Before multi-step tasks with specs | Zero-context assumption, complete documentation |
| **subagent-driven-development** | Collaboration | Executing plans with independent tasks | Two-stage review per task |
| **executing-plans** | Collaboration | Batch executing plans | Batch checkpoints, continue after review |
| **test-driven-development** | Testing | Before implementing features/bugfixes | No code without failing test |
| **systematic-debugging** | Debugging | Before encountering bug/failure | No fixes without root cause |
| **verification-before-completion** | Debugging | Before claiming completion | No claims without fresh verification evidence |
| **using-git-worktrees** | Collaboration | Before needing isolated work | Directory priority, safety verification |
| **finishing-a-development-branch** | Collaboration | After implementation, tests pass | Verify→4 options→cleanup |
| **requesting-code-review** | Collaboration | After tasks/major features | Review early, review often |
| **receiving-code-review** | Collaboration | Before receiving review feedback | Verify then implement, push back errors |
| **dispatching-parallel-agents** | Collaboration | When 2+ independent tasks | One agent per domain, work concurrently |
| **writing-skills** | Meta | Before creating/editing/testing skills | No skill without failing test |

---

## Chapter Summary

- Superpowers provides 14 core skills covering 4 major categories: testing, debugging, collaboration, and meta skills
- Each skill has clear trigger conditions, iron rules, and core points
- Skills have dependencies and should be called in the correct order
- All skills follow the "test before write" principle to ensure quality

## Next Lesson Preview

> In the next lesson, we'll learn **[Command Reference](../commands-reference/)**.
>
> You'll learn:
> - Detailed explanation of all slash commands
> - Usage of `/brainstorm`, `/write-plan`, `/execute-plan`
> - Correspondence between commands and skills

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-02-01

| Skill | Source File Path |
|------|-----------|
| using-superpowers | [`skills/using-superpowers/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md) |
| brainstorming | [`skills/brainstorming/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/brainstorming/SKILL.md) |
| writing-plans | [`skills/writing-plans/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/writing-plans/SKILL.md) |
| subagent-driven-development | [`skills/subagent-driven-development/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/subagent-driven-development/SKILL.md) |
| executing-plans | [`skills/executing-plans/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/executing-plans/SKILL.md) |
| test-driven-development | [`skills/test-driven-development/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/test-driven-development/SKILL.md) |
| systematic-debugging | [`skills/systematic-debugging/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/systematic-debugging/SKILL.md) |
| using-git-worktrees | [`skills/using-git-worktrees/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-git-worktrees/SKILL.md) |
| finishing-a-development-branch | [`skills/finishing-a-development-branch/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/finishing-a-development-branch/SKILL.md) |
| requesting-code-review | [`skills/requesting-code-review/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/requesting-code-review/SKILL.md) |
| receiving-code-review | [`skills/receiving-code-review/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/receiving-code-review/SKILL.md) |
| verification-before-completion | [`skills/verification-before-completion/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/verification-before-completion/SKILL.md) |
| dispatching-parallel-agents | [`skills/dispatching-parallel-agents/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/dispatching-parallel-agents/SKILL.md) |
| writing-skills | [`skills/writing-skills/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/writing-skills/SKILL.md) |

**Key Principles**:
- **TDD Iron Rule**: `NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST`
- **Debugging Iron Rule**: `NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST`
- **Verification Iron Rule**: `NO COMPLETION CLAIMS WITHOUT FRESH VERIFICATION EVIDENCE`

**Skill Classification**:
- **Testing**: test-driven-development, verification-before-completion
- **Debugging**: systematic-debugging
- **Collaboration**: brainstorming, writing-plans, executing-plans, dispatching-parallel-agents, requesting-code-review, receiving-code-review, using-git-worktrees, finishing-a-development-branch, subagent-driven-development
- **Meta**: writing-skills, using-superpowers

</details>
