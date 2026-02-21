---
title: "Command Reference: Slash Commands Quick Reference | Superpowers Tutorial"
sidebarTitle: "Commands Quick Reference"
subtitle: "Command Reference: Slash Commands Quick Reference"
description: "Learn Superpowers slash commands. This reference details /brainstorm, /write-plan, /execute-plan commands with trigger conditions, use cases, execution steps, and best practices, helping you quickly invoke core workflows, follow TDD principles and systematic debugging, improve code quality and development efficiency, reduce debugging time and error rate, and accelerate iteration speed and delivery frequency."
tags:
  - "Commands"
  - "Reference"
  - "Slash Commands"
prerequisite: []
order: 270
---

# Command Reference: Slash Commands Quick Reference

Superpowers provides three slash commands for quickly invoking core workflow skills.

## Command Overview

| Command | Description | Calls Skill | Use Case |
| --- | --- | --- | --- |
| `/brainstorm` | Creative design requirement clarification | brainstorming | Before creative work |
| `/write-plan` | Write detailed implementation plan | writing-plans | Before multi-step tasks with specs/requirements |
| `/execute-plan` | Batch execute plan tasks | executing-plans | When executing an existing plan |

---

## /brainstorm

**Description**: Clarify requirements and explore creative ideas before design

**Trigger Conditions**:
- Create new feature
- Build new component
- Add new functionality
- Modify existing behavior

**Calls Skill**: `superpowers:brainstorming`

**Usage Example**:
```bash
/brainstorm "Add user profile editing feature"
```

**Core Process**:
1. Understand project context
2. Ask clarification questions one at a time
3. Present design proposal (in 200-300 word segments)
4. Save design document to `docs/plans/`
5. Commit design to version control

**Important Notes**:
- Must be executed before writing code
- Ask only one question at a time
- Design document must be committed

---

## /write-plan

**Description**: Break down requirements into executable small tasks

**Trigger Conditions**:
- Clear requirements or specifications exist
- Tasks require multi-step implementation
- Need detailed implementation plan

**Calls Skill**: `superpowers:writing-plans`

**Usage Example**:
```bash
/write-plan "docs/plans/2024-02-01-user-profile-design.md"
```

**Core Process**:
1. Read design document or requirement specifications
2. Break down into 2-5 minute tasks
3. Write complete code for each task
4. Include testing steps
5. Save implementation plan

**Task Breakdown Principles**:
- Each task completable in 2-5 minutes
- Task granularity small enough for "no-context" engineers to execute
- Each task includes implementation and verification

**Important Notes**:
- Tasks must be sufficiently small
- Each task must have acceptance criteria
- Plan document should be clear and readable

---

## /execute-plan

**Description**: Batch execute tasks from a plan with review checkpoints

**Trigger Conditions**:
- Implementation plan is already written
- Need to batch execute tasks
- Execute in separate session (recommended)

**Calls Skill**: `superpowers:executing-plans`

**Usage Example**:
```bash
/execute-plan "docs/plans/2024-02-01-user-profile-implementation.md"
```

**Core Process**:
1. Read implementation plan
2. Execute tasks one by one
3. Run tests after each task
4. Set review checkpoints after each batch
5. Verify after completing all tasks

**Execution Strategy**:
- Execute tasks in order
- Verify tests after each task
- Conduct code review after each batch (typically 3-5 tasks)
- Stop and debug on failure

**Important Notes**:
- Suitable for execution in separate sessions
- Difference from subagent-driven-development is in execution approach
- Must follow TDD principles

---

## Command Usage Recommendations

### When to Use Commands

**Use commands when**:
- You know exactly which workflow you need
- Want to quickly start a standard process
- Using Claude Code

**Use skills directly when**:
- Unsure which skill is needed
- AI proactively suggests using a skill
- Calling through Skill tool

### Commands vs Skills

| Aspect | Slash Commands | Skill Calls |
| --- | --- | --- |
| Invocation Method | User actively inputs `/command` | AI auto-invokes or through Skill tool |
| Use Case | You know which process is needed | Let AI recommend appropriate process |
| Platform Support | Claude Code | Claude Code, OpenCode, Codex |

### Typical Workflows

**Complete Development Process**:
1. `/brainstorm` - Design requirements
2. `/write-plan` - Write plan
3. `/execute-plan` - Execute implementation

**Bug Fix Process**:
- Use `systematic-debugging` skill directly

**Quick Prototype Process**:
- `/brainstorm` - Quick design
- Implement directly (skip detailed planning)

---

## Chapter Summary

This chapter introduced three slash commands provided by Superpowers:

- `/brainstorm`: Creative design requirement clarification
- `/write-plan`: Write detailed implementation plan
- `/execute-plan`: Batch execute plan tasks

These commands provide convenient access to core workflows in Claude Code, suitable for scenarios where you know which process you need.

## Next Lesson Preview

> In the next lesson, we'll learn **[Agent Reference](../agents-reference/)**.
>
> You'll learn:
> > - Concepts and purposes of the agent system
> > - Detailed explanation of code-reviewer agent
> > - How to define and use custom agents

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-02-01

| Command | File Path | Line |
| --- | --- | --- |
| /brainstorm command definition | [`commands/brainstorm.md`](https://github.com/obra/superpowers/blob/main/commands/brainstorm.md) | 1-7 |
| /write-plan command definition | [`commands/write-plan.md`](https://github.com/obra/superpowers/blob/main/commands/write-plan.md) | 1-7 |
| /execute-plan command definition | [`commands/execute-plan.md`](https://github.com/obra/superpowers/blob/main/commands/execute-plan.md) | 1-7 |

**Key Features**:
- `disable-model-invocation: true`: Prevents direct model invocation, ensuring execution through the skill system
- Command files only contain instruction calls; actual logic is in corresponding skills

**Invocation Chain**:
```
Slash command → Skill system (Skill tool) → Corresponding skill (SKILL.md) → Execute workflow
```

</details>
