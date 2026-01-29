---
title: "AI App Factory Best Practices: Product Descriptions, Checkpoints, Scope & Iterative Development | Tutorial"
sidebarTitle: "Best Practices"
subtitle: "Best Practices: Clear Descriptions, Checkpoint Utilization, Scope Control & Iterative Techniques"
description: "Master AI App Factory best practices to improve the quality and efficiency of AI-generated apps. Learn to write clear product descriptions, leverage checkpoints for quality control, define non-goals to prevent scope creep, iteratively validate ideas, save tokens with session splitting, and handle failures and retries. This tutorial covers input quality, checkpoint validation, MVP control, iterative development, context optimization, and failure handling."
tags:
  - "Best Practices"
  - "MVP"
  - "Iterative Development"
prerequisite:
  - "start-getting-started"
  - "start-pipeline-overview"
order: 200
---

# Best Practices: Clear Descriptions, Checkpoint Utilization, Scope Control & Iterative Techniques

## What You'll Learn

After completing this lesson, you will master:
- How to write high-quality product descriptions that help AI understand your ideas
- How to leverage the checkpoint mechanism to control output quality at each stage
- How to define scope boundaries through non-goals to prevent project bloat
- How to quickly validate ideas and continuously optimize through step-by-step iteration

## Your Current Struggles

Have you encountered these situations:
- "I explained it clearly, why isn't the output what I wanted?"
- "One small issue causes everything downstream to fail, making fixes painful"
- "Features keep getting added during development, making it impossible to finish"
- "Trying to build all features at once, but nothing gets done"

## When to Use This Approach

Whether you're using AI App Factory for the first time or have some experience, these best practices will help you:
- **Improve output quality**: Make generated apps meet expectations
- **Save modification time**: Avoid error accumulation by discovering issues early
- **Control project scale**: Focus on MVP and deliver quickly
- **Reduce development costs**: Validate in stages to avoid wasted investment

## 🎒 Prerequisites

::: warning Requirements
- Read [Quick Start](../../start/getting-started/) to understand basic concepts of AI App Factory
- Read [7-Stage Pipeline Overview](../../start/pipeline-overview/) to understand the complete process
- Completed at least one full pipeline execution (so you have an intuitive feel for each stage's output)
:::

## Core Principles

AI App Factory's best practices revolve around four core principles:

1. **Input quality determines output quality**: Clear, detailed product descriptions are the first step to success
2. **Checkpoints are quality barriers**: Carefully validate after each stage to avoid error accumulation
3. **MVP focus**: Define non-goals, control scope, and deliver core features quickly
4. **Continuous iteration**: Validate core ideas first, then expand functionality gradually

These principles are derived from source code and practical experience. Following them can improve your development efficiency several times over.

## Follow Along

### Technique 1: Provide Clear Product Descriptions

#### Why

When AI understands your ideas, it relies solely on the text information you provide. The clearer the description, the more the generated output meets expectations.

#### How

**A good product description includes these elements**:
- **Target users**: Who will use this product?
- **Core problem**: What difficulties are users facing?
- **Solution**: How does the product solve this difficulty?
- **Key features**: What features must be included?
- **Use scenarios**: In what situations do users use it?
- **Constraints**: What limitations or special requirements exist?

#### Comparison Examples

| ❌ Poor Description | ✅ Good Description |
| --- | --- |
| Make a fitness app | An app to help fitness beginners track workouts, supporting exercise type recording, duration, calories burned, and weekly workout statistics. Target users are young people just starting fitness. Core features are quick recording and progress viewing, without social sharing or payment features |
| Make a bookkeeping app | A mobile bookkeeping app to help young people quickly record daily expenses. Main features include recording amounts, selecting categories (food, transport, entertainment, other), and viewing monthly total expenses and category statistics. Supports offline use, data stored locally only |
| Make a task management tool | A simple tool to help small teams manage tasks, supporting task creation, member assignment, deadline setting, and task list viewing. Team members can share task status. No complex workflows or permission management needed |

#### Checklist ✅

- [ ] Target users are clearly defined in the description
- [ ] Core problem users face is explained in the description
- [ ] Key features are listed in the description (no more than 5)
- [ ] Description includes constraints or non-goals

---

### Technique 2: Carefully Validate at Checkpoints

#### Why

The pipeline pauses at a checkpoint after completing each stage, waiting for your confirmation. This is a **quality barrier** that lets you discover issues early and prevent errors from propagating to subsequent stages.

If you discover an issue at this stage, you only need to rerun the current stage; if you wait until the end, you may need to roll back multiple stages, wasting significant time and tokens.

#### How

**When validating at each checkpoint, check the following**:

**Bootstrap Stage Checkpoint**:
- [ ] Problem definition in `input/idea.md` is accurate
- [ ] Target user persona is clear and specific
- [ ] Core value proposition is clear
- [ ] Assumptions are reasonable

**PRD Stage Checkpoint**:
- [ ] User stories are clear and include acceptance criteria
- [ ] Feature list does not exceed 7 items (MVP principle)
- [ ] Non-goals are explicitly listed
- [ ] Does not include technical details (such as React, API, database)

**UI Stage Checkpoint**:
- [ ] Page structure is reasonable, no more than 3 pages
- [ ] Prototype can be previewed in browser
- [ ] Interaction flow is clear
- [ ] Aesthetic style is distinct (avoid common AI style)

**Tech Stage Checkpoint**:
- [ ] Tech stack selection is reasonable and follows MVP principle
- [ ] Data model design is simple, number of tables does not exceed 10
- [ ] API endpoint list is complete
- [ ] No over-engineering like microservices or caching

**Code Stage Checkpoint**:
- [ ] Frontend and backend code structure is complete
- [ ] Includes test cases
- [ ] No obvious `any` types
- [ ] Includes README.md explaining how to run

**Validation Stage Checkpoint**:
- [ ] No serious security issues in validation report
- [ ] Test coverage > 60%
- [ ] No dependency installation conflicts
- [ ] TypeScript type checking passes

**Preview Stage Checkpoint**:
- [ ] README.md includes complete running instructions
- [ ] Docker configuration builds successfully
- [ ] Frontend and backend services can start locally
- [ ] Includes environment variable configuration instructions

#### Checkpoint Validation Process

At each checkpoint, the system provides these options:
- **Continue**: If the output meets expectations, proceed to the next stage
- **Retry**: If the output has issues, provide modification feedback and rerun the current stage
- **Pause**: If more information is needed or you want to adjust the idea, pause the pipeline

**Decision Principles**:
- ✅ **Continue**: All checklist items meet requirements
- ⚠️ **Retry**: Minor issues (format, omissions, details) that can be immediately fixed
- 🛑 **Pause**: Major issues (wrong direction, scope out of control, cannot be fixed) that require re-planning

#### Common Pitfalls

::: danger Common Mistakes
**Don't skip checkpoint validation just to "get it done quickly"!**

The pipeline is designed to "pause and validate at each stage" precisely to let you discover issues in time. If you habitually click "Continue" and discover problems at the end, you may need to:
- Roll back multiple stages
- Re-execute significant work
- Waste large amounts of tokens

Remember: **Time invested in checkpoint validation is far less than the time cost of rolling back and redoing**.
:::

---

### Technique 3: Control Scope with Non-Goals

#### Why

**Non-goals are a core weapon for MVP development**. Explicitly listing "what not to do" effectively prevents scope creep.

Many projects fail not because of too few features, but because of too many features. Each new feature adds complexity, development time, and maintenance cost. Define boundaries, focus on core value, and deliver quickly.

#### How

**In the Bootstrap stage, explicitly list non-goals**:

```markdown
## Non-Goals (Features Not in This Version)

1. No multi-user collaboration support
2. No real-time synchronization
3. No third-party service integration (such as payments, maps)
4. No data analytics or reporting features
5. No social sharing functionality
6. No user authentication or login functionality
```

**In the PRD stage, make non-goals a separate section**:

```markdown
## Non-Goals (Explicitly Not Doing This Version)

The following features have value but are not within the scope of this MVP:

| Feature | Reason | Future Plan |
| --- | --- | --- |
| Multi-user collaboration | Focus on individual users | Consider for v2.0 |
| Real-time sync | Increases technical complexity | Consider after strong user feedback |
| Payment integration | Not core value | Consider for v1.5 |
| Data analytics | Not needed for MVP | Consider for v2.0 |
```

#### Non-Goal Judgment Criteria

**How to determine if something should be a non-goal**:
- ❌ This feature is not essential to validating the core idea → Make it a non-goal
- ❌ This feature significantly increases technical complexity → Make it a non-goal
- ❌ This feature can be replaced by manual means → Make it a non-goal
- ✅ This feature is the reason the product exists → Must include

#### Common Pitfalls

::: warning Scope Creep Traps
**Common scope creep signals**:

1. "It's simple anyway, let's just add one..."
2. "Competitors have this feature, so do we..."
3. "Users might need it, let's just build it first..."
4. "This feature is interesting, it can enhance product highlights..."

**When encountering these thoughts, ask yourself three questions**:
1. Is this feature useful for validating the core idea?
2. Can the product still work without this feature?
3. Will adding this feature delay delivery?

If the answers are "not needed," "can work," and "will delay," then decisively mark it as a non-goal.
:::

---

### Technique 4: Iterate Step-by-Step, Validate Quickly

#### Why

**The core principle of MVP (Minimum Viable Product) is to quickly validate ideas**, not to build everything perfectly at once.

Through iterative development, you can:
- Get user feedback early
- Adjust direction in time
- Reduce sunk costs
- Maintain development momentum

#### How

**Steps for iterative development**:

**Round 1: Core Feature Validation**
1. Use AI App Factory to generate the first version of the app
2. Include only the 3-5 most core features
3. Run and test quickly
4. Show the prototype to real users and collect feedback

**Round 2: Optimize Based on Feedback**
1. Based on user feedback, determine the highest priority improvements
2. Modify `input/idea.md` or `artifacts/prd/prd.md`
3. Use `factory run <stage>` to re-execute from the corresponding stage
4. Generate a new version and test

**Round 3: Feature Expansion**
1. Evaluate whether core goals are achieved
2. Select 2-3 high-value features
3. Generate and integrate through the pipeline
4. Iterate continuously and improve gradually

#### Practical Iteration Example

**Scenario**: You want to build a task management app

**Round 1 MVP**:
- Core features: Create tasks, view list, mark complete
- Non-goals: Member management, permission control, reminder notifications
- Delivery time: 1 day

**Round 2 Optimization** (based on feedback):
- User feedback: Want to add tags to tasks
- Modify PRD, add "tag categorization" feature
- Re-execute pipeline from UI stage
- Delivery time: Half a day

**Round 3 Expansion** (after successful validation):
- Add member management feature
- Add deadline reminders
- Add task comment feature
- Delivery time: 2 days

#### Checklist ✅

Before each iteration, check:
- [ ] New features align with core goals
- [ ] New features are supported by user demand
- [ ] New features won't significantly increase complexity
- [ ] Clear acceptance criteria exist

---

## Advanced Techniques

### Technique 5: Save Tokens with Session Splitting

#### Why

Running the pipeline for a long time causes context accumulation and consumes large amounts of tokens. **Split-session execution** allows each stage to have its own clean context, greatly reducing usage costs.

#### How

**At each checkpoint, choose "Continue in new session"**:

```bash
# Execute in a new command line window
factory continue
```

The system will automatically:
1. Read `.factory/state.json` to restore state
2. Launch a new Claude Code window
3. Continue from the next stage to be executed
4. Load only the input files needed for that stage

**Comparison**:

| Approach | Pros | Cons |
| --- | --- | --- |
| Continue in same session | Simple, no need to switch windows | Context accumulates, high token consumption |
| Continue in new session | Each stage gets clean context, saves tokens | Need to switch windows |

::: tip Recommended Practice
**For large projects or limited token budgets, we strongly recommend using "Continue in new session"**.

For detailed explanations, see the [Context Optimization](../../advanced/context-optimization/) tutorial.
:::

---

### Technique 6: Handle Failures and Retries

#### Why

During pipeline execution, you may encounter failures (insufficient input, permission issues, code errors, etc.). Understanding how to handle failures lets you recover progress more quickly.

#### How

**Best practices for failure handling** (refer to `failure.policy.md:267-274`):

1. **Fail early**: Discover issues as early as possible to avoid wasting time in subsequent stages
2. **Detailed logging**: Record sufficient context information for troubleshooting
3. **Atomic operations**: Each stage's output should be atomic for easy rollback
4. **Preserve evidence**: Archive failed artifacts before retrying for comparative analysis
5. **Progressive retry**: Provide more specific guidance during retry rather than simple repetition

**Common failure scenarios**:

| Failure Type | Symptoms | Solution |
| --- | --- | --- |
| Missing output | `input/idea.md` doesn't exist | Retry, check write path |
| Scope creep | Feature count > 7 | Retry, require simplification to MVP |
| Technical error | TypeScript compilation fails | Check type definitions, retry |
| Permission issue | Agent writes to unauthorized directory | Check capability boundary matrix |

**Failure recovery checklist**:
- [ ] Failure cause is clear
- [ ] Fix solution is implemented
- [ ] Relevant configuration is updated
- [ ] Restart from the failed stage

::: tip Failure is Normal
**Don't fear failure!** AI App Factory is designed with robust failure handling mechanisms:
- Each stage allows one automatic retry
- Failed artifacts are automatically archived to `artifacts/_failed/`
- Can roll back to the most recent successful checkpoint

When encountering failures, calmly analyze the cause and handle according to the failure strategy.
:::

---

## Summary

This lesson introduced six best practices for AI App Factory:

1. **Clear product descriptions**: Detail target users, core problems, key features, and constraints
2. **Careful checkpoint validation**: Check output quality after each stage to avoid error accumulation
3. **Control scope with non-goals**: Explicitly list features not to do, prevent scope creep
4. **Step-by-step iteration**: Validate core ideas first, then expand gradually based on user feedback
5. **Save tokens with session splitting**: Create new sessions at each checkpoint, reduce usage costs
6. **Handle failures correctly**: Leverage failure handling mechanisms to quickly recover progress

Following these best practices will make your AI App Factory experience smoother, generate higher quality apps, and improve development efficiency several times over.

---

## Next Up

> In the next lesson, we will learn **[CLI Command Reference](../../appendix/cli-commands/)**.
>
> You will learn:
> - All parameters and options for the `factory init` command
> - How the `factory run` command starts from a specified stage
> - How the `factory continue` command continues in a new session
> - How `factory status` and `factory list` view project information
> - How `factory reset` resets project state

---

## Appendix: Source Code References

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-29

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Product description techniques | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L186-L210) | 186-210 |
| Checkpoint mechanism | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md#L98-L112) | 98-112 |
| Non-goal control | [`README.md`](https://github.com/hyz1992/agent-app-factory/blob/main/README.md#L199-L203) | 199-203 |
| Failure handling strategy | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md#L267-L274) | 267-274 |
| Context isolation | [`policies/context-isolation.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/context-isolation.md#L10-L42) | 10-42 |
| Code standards | [`policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | Full document |

**Key Constants**:
- `MAX_RETRY_COUNT = 1`: Each stage allows one automatic retry by default

**Key Rules**:
- Must Have features ≤ 7 (MVP principle)
- Page count ≤ 3 pages (UI stage)
- Data model count ≤ 10 (Tech stage)
- Test coverage > 60% (Validation stage)

</details>
