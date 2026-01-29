---
title: "Stage 1: Bootstrap - Structure Product Idea | Agent App Factory Tutorial"
sidebarTitle: "Structure Product Idea"
subtitle: "Stage 1: Bootstrap - Structure Product Idea"
description: "Learn how the Bootstrap stage transforms vague product ideas into a clear, structured input/idea.md document. This tutorial covers Bootstrap Agent responsibilities, the superpowers:brainstorm skill, the standard idea.md structure, and quality checklist."
tags:
  - "pipeline"
  - "Bootstrap"
  - "product idea"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Stage 1: Bootstrap - Structure Product Idea

Bootstrap is the first stage of the Agent App Factory pipeline, responsible for organizing your vague product idea into a clear `input/idea.md` document. This is the starting point for all subsequent stages (PRD, UI, Tech, etc.), determining the direction and quality of the entire project.

## What You'll Learn

After completing this lesson, you will be able to:

- Organize vague product ideas into a standard `input/idea.md` document
- Understand Bootstrap Agent's responsibility boundaries (collect information only, don't create requirements)
- Know how to use the superpowers:brainstorm skill to deeply explore product ideas
- Determine what information should be included in the Bootstrap stage and what should not

## Your Current Struggle

You might have a product idea, but describe it vaguely:

- "I want to build a fitness app" (too general)
- "Build an app like Xiaohongshu" (no differentiation)
- "Users need a better task management tool" (no specific problem)

Such vague descriptions will cause subsequent stages (PRD, UI, Tech) to lack clear input, and the generated application may completely deviate from your expectations.

## When to Use This Approach

When you're ready to start the pipeline and meet the following conditions:

1. **Have a preliminary product idea** (even if it's just one sentence)
2. **Haven't started writing requirement documents** (PRD is in later stages)
3. **Haven't decided on tech stack or UI style** (these are in later stages)
4. **Want to control product scope and avoid over-design** (Bootstrap stage will clarify non-goals)

## 🎒 Preparation

::: warning Prerequisites
Before starting the Bootstrap stage, ensure:

- ✅ [Project initialization](../../start/init-project/) completed
- ✅ [7-stage pipeline overview](../../start/pipeline-overview/) understood
- ✅ AI assistant installed and configured (Claude Code recommended)
- ✅ Your product idea ready (even if vague)
:::

## Core Concept

### What is the Bootstrap Stage?

**Bootstrap** is the starting point of the entire pipeline. Its sole responsibility is to **organize fragmented product ideas into a structured document**.

::: info Not a Product Manager
Bootstrap Agent is not a product manager. It will not create requirements or design features for you. Its tasks are:
- Collect information you've already provided
- Organize and structure this information
- Present it according to standard templates

It won't decide "what features should exist," it will only help you clearly express "what you want."
:::

### Why Structure?

Imagine telling a chef: "I want to eat something good"

- ❌ Vague description: Chef can only guess and might make something you don't want to eat at all
- ✅ Structured description: "I want a spicy Sichuan dish without cilantro that goes well with rice"

The Bootstrap stage transforms "I want to eat something good" into "spicy Sichuan dish without cilantro."

### Output Document Structure

The Bootstrap stage generates `input/idea.md`, including the following sections:

| Section | Content | Example |
|---------|---------|---------|
| **Brief Description** | 1-2 sentences summarizing the product | "A mobile expense tracking app helping young people quickly record daily spending" |
| **Problem** | Core pain points users face | "Young people discover overspending at month-end but don't know where the money went" |
| **Target User** | Specific user persona | "18-30-year-old young people who just started working, with average technical skills" |
| **Core Value** | Why it's valuable | "Record expenses in 3 seconds, saving 80% time compared to manual tracking" |
| **Assumptions** | 2-4 testable assumptions | "Users are willing to spend 2 minutes learning the app if it helps control budget" |
| **Non-Goals** | Clearly define what not to do | "No budget planning or financial advice" |

## Follow Along

### Step 1: Prepare Your Product Idea

Before starting the pipeline, clarify your product idea. It can be a complete description or just a simple thought.

**Example**:
```
I want to build a fitness app that helps fitness beginners track their training, including exercise type, duration, calories, and weekly statistics.
```

::: tip Ideas Can Be Rough
Even if it's just one sentence, that's fine. Bootstrap Agent will use the superpowers:brainstorm skill to help you fill in complete information.
:::

### Step 2: Start Pipeline to Bootstrap Stage

Execute in the Factory project directory:

```bash
# Start pipeline (if not started yet)
factory run

# Or directly specify starting from bootstrap
factory run bootstrap
```

The CLI will display current status and available stages.

### Step 3: AI Assistant Reads Bootstrap Agent Definition

The AI assistant (e.g., Claude Code) will automatically read `agents/bootstrap.agent.md` to understand its responsibilities and constraints.

::: info Agent Responsibilities
Bootstrap Agent can only:
- Read product ideas provided by users in conversation
- Write to `input/idea.md`

It cannot:
- Read other files
- Write to other directories
- Create new requirements
:::

### Step 4: Mandatory Use of superpowers:brainstorm Skill

This is the key step of the Bootstrap stage. The AI assistant **must** first invoke the `superpowers:brainstorm` skill, even if you think the information is already complete.

**Role of brainstorm skill**:
1. **Deeply explore the essence of the problem**: Discover blind spots in your description through structured questioning
2. **Clarify target user persona**: Help you think clearly about "who exactly are we selling to"
3. **Verify core value**: Find differentiation through competitor comparison
4. **Identify implicit assumptions**: List those assumptions you take for granted but haven't verified
5. **Control product scope**: Clarify boundaries through non-goals

**What the AI assistant will do**:
- Invoke `superpowers:brainstorm` skill
- Provide your original idea
- Ask you questions through skill-generated questions
- Collect your answers and refine the idea

::: danger Skipping This Step Will Be Rejected
The Sisyphus scheduler will verify if the brainstorm skill was used. If not, Bootstrap Agent's output will be rejected and must be re-executed.
:::

### Step 5: Confirm idea.md Content

After Bootstrap Agent completes, it will generate `input/idea.md`. You need to carefully check:

**Checkpoints ✅**:

1. **Is brief description clear?**
   - ✅ Includes: what to build + for whom + what problem to solve
   - ❌ Too generic: "A tool to improve efficiency"

2. **Is problem description specific?**
   - ✅ Includes: scenario + difficulty + negative result
   - ❌ Too vague: "User experience is poor"

3. **Is target user clear?**
   - ✅ Has specific persona (age/occupation/technical skills)
   - ❌ Vague: "Everyone"

4. **Is core value quantifiable?**
   - ✅ Has specific benefit (saves 80% time)
   - ❌ Vague: "Improve efficiency"

5. **Are assumptions testable?**
   - ✅ Can be verified through user research
   - ❌ Subjective judgment: "Users will like it"

6. **Are non-goals sufficient?**
   - ✅ Lists at least 3 features not to do
   - ❌ Missing or too few

### Step 6: Choose Continue, Retry, or Pause

After confirmation, the CLI will display options:

```bash
Select an action:
[1] Continue (enter PRD stage)
[2] Retry (regenerate idea.md)
[3] Pause (continue later)
```

::: tip Suggest Checking in Code Editor First
Before confirming in AI assistant, open `input/idea.md` in code editor and check word by word. Once entering PRD stage, modification cost will be higher.
:::

## Pitfall Alerts

### Pitfall 1: Idea Description Too Vague

**Wrong example**:
```
I want to build a fitness app
```

**Consequence**: Bootstrap Agent will ask many questions through brainstorm skill to supplement information.

**Suggestion**: Describe clearly from the start:
```
I want to build a mobile fitness app that helps fitness beginners track their training, including exercise type, duration, calories, and weekly statistics.
```

### Pitfall 2: Including Technical Implementation Details

**Wrong example**:
```
I hope to build with React Native, backend with Express, database with Prisma...
```

**Consequence**: Bootstrap Agent will reject this content (it only collects product ideas, tech stack is decided in Tech stage).

**Suggestion**: Only say "what to do," not "how to do it."

### Pitfall 3: Target User Description Too General

**Wrong example**:
```
Everyone who needs fitness
```

**Consequence**: Subsequent stages cannot clarify design direction.

**Suggestion**: Clarify persona:
```
18-30-year-old fitness beginners just starting systematic training, with average technical skills, hoping for simple recording and statistics viewing.
```

### Pitfall 4: Non-Goals Missing or Too Few

**Wrong example**:
```
Non-goals: None
```

**Consequence**: Subsequent PRD and Code stages may over-design, increasing technical complexity.

**Suggestion**: List at least 3 items:
```
Non-goals:
- Team collaboration and social features (MVP focuses on individual)
- Complex data analysis and reporting
- Integration with third-party fitness devices
```

### Pitfall 5: Assumptions Not Testable

**Wrong example**:
```
Assumption: Users will like our design
```

**Consequence**: Cannot be verified through user research, MVP may fail.

**Suggestion**: Write testable assumptions:
```
Assumption: Users are willing to spend 5 minutes learning the app if it helps systematically track training.
```

## Lesson Summary

The core of Bootstrap stage is **structuring**:

1. **Input**: Your vague product idea
2. **Process**: AI assistant deeply explores through superpowers:brainstorm skill
3. **Output**: `input/idea.md` matching standard template
4. **Validation**: Check if description is specific, user is clear, value is quantifiable

::: tip Key Principles
- ❌ What not to do: Don't create requirements, don't design features, don't decide tech stack
- ✅ What to do only: Collect information, organize and structure, present according to template
:::

## Next Lesson Preview

> In the next lesson, we'll learn **[Stage 2: PRD - Generate Product Requirements Document](../stage-prd/)**.
>
> You'll learn:
> - How to transform idea.md into MVP-level PRD
> - What PRD includes (user stories, feature list, non-functional requirements)
> - How to clarify MVP scope and priorities
> - Why PRD cannot include technical details

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Feature | File Path | Line Range |
|---------|-----------|------------|
| Bootstrap Agent definition | [`agents/bootstrap.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/bootstrap.agent.md) | 1-93 |
| Bootstrap Skill | [`skills/bootstrap/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/bootstrap/skill.md) | 1-433 |
| Pipeline definition (Bootstrap stage) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 8-18 |
| Orchestrator definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Key constraints**:
- **Mandatory use of brainstorm skill**: bootstrap.agent.md:70-71
- **Prohibit technical details**: bootstrap.agent.md:47
- **Prohibit merging multiple ideas**: bootstrap.agent.md:48
- **Output file must be saved to input/idea.md**: bootstrap.agent.md:50

**Exit conditions** (pipeline.yaml:15-18):
- idea.md exists
- idea.md describes a coherent product idea
- Agent has used `superpowers:brainstorm` skill for deep exploration

**Skill content framework**:
- **Thinking framework**: Extract vs create, problem-first, concreteness, assumption validation
- **Question templates**: About problem, target user, core value, MVP assumptions, non-goals
- **Information extraction techniques**: Reverse-engineer problem from features, extract requirements from complaints, identify implicit assumptions
- **Quality checklist**: Completeness, specificity, consistency, prohibitions
- **Decision principles**: Ask questions first, problem-oriented, concrete over abstract, testability, scope control
- **Common scenario handling**: User provides one sentence only, describes many features, describes competitors, idea contradictions
- **Example comparisons**: Bad idea.md vs good idea.md

</details>
