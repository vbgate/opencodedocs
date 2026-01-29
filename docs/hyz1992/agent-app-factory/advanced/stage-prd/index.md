---
title: "Stage 2: PRD - Generate Product Requirements Document | Agent App Factory Tutorial"
sidebarTitle: "Generate Product Requirements Document"
subtitle: "Stage 2: PRD - Generate Product Requirements Document"
description: "Learn how the PRD stage transforms structured product ideas into MVP-level product requirements documents. This tutorial explains the PRD Agent's responsibilities, how to use skills/prd/skill.md, the standard structure of prd.md, and the MoSCoW priority framework to help you quickly define MVP scope and priorities and write testable user stories and acceptance criteria independently."
tags:
  - "Pipeline"
  - "PRD"
  - "Product Requirements"
prerequisite:
  - "start-pipeline-overview"
  - "advanced-stage-bootstrap"
order: 90
---

# Stage 2: PRD - Generate Product Requirements Document

The PRD stage is the second stage of the Agent App Factory pipeline, responsible for transforming `input/idea.md` into a complete, MVP-level (Minimum Viable Product) product requirements document. This stage will clarify target users, core features, MVP scope, and non-goals, providing clear guidance for subsequent UI design and technical architecture.

## What You'll Learn

After completing this lesson, you will be able to:

- Transform `input/idea.md` into an `artifacts/prd/prd.md` document that follows the standard template
- Understand the PRD Agent's responsibility boundaries (only define requirements, not technical implementation)
- Master the MoSCoW feature priority framework to ensure MVP focuses on core value
- Write high-quality user stories and verifiable acceptance criteria
- Know which content belongs in the PRD and which should be in later stages

## Your Current Struggle

You may have a clear product idea (Bootstrap stage completed), but encounter difficulties when converting it to a requirements document:

- "Don't know which features to include, worried about missing something or over-designing"
- "Many features, but unsure which ones are essential for MVP"
- "User stories written unclearly, development team can't understand them"
- "Accidentally mixing technical implementation details into requirements, causing scope creep"

Unclear PRDs will lead to lack of clear guidance for subsequent UI design and code development, ultimately resulting in applications that deviate from your expectations or contain unnecessary complexity.

## When to Use This Approach

When the Bootstrap stage is completed and the following conditions are met:

1. **idea.md structuring completed** (Bootstrap stage output)
2. **Haven't started UI design or technical architecture** (these come in later stages)
3. **Want to clarify MVP scope** (avoid feature over-design)
4. **Need to provide clear guidance for development and design** (user stories, acceptance criteria)

## 🎒 Before You Start

::: warning Prerequisites
Before starting the PRD stage, ensure:

- ✅ [Project initialization completed](../../start/init-project/)
- ✅ [Understood the 7-stage pipeline overview](../../start/pipeline-overview/)
- ✅ [Bootstrap stage completed](../stage-bootstrap/), generated `input/idea.md`
- ✅ AI assistant installed and configured (Claude Code recommended)
:::

## Core Concepts

### What is the PRD Stage?

**PRD** (Product Requirements Document) stage's core responsibility is **defining what to do, not how to do it**.

::: info Not Technical Documentation
PRD Agent is not an architect or UI designer, it will not decide:
- ❌ Which tech stack to use (React vs Vue, Express vs Koa)
- ❌ How to design the database (table structure, indexes)
- ❌ UI layout and interaction details (button positions, color schemes)

Its task is:
- ✅ Define target users and their pain points
- ✅ List core features and priorities
- ✅ Clarify MVP scope and non-goals
- ✅ Provide testable user stories and acceptance criteria
:::

### Why PRD?

Imagine you tell the construction team: "I want to build a house"

- ❌ No blueprints: The construction team can only guess, possibly building a house you don't want to live in at all
- ✅ Detailed blueprints: Clearly specify the number of rooms, functional layout, material requirements, the construction team builds according to the drawings

The PRD stage turns "I want to build a house" into detailed blueprints like "three bedrooms, two living rooms, master bedroom facing south, open kitchen".

### MoSCoW Feature Priority Framework

The PRD stage uses the **MoSCoW framework** to classify features, ensuring MVP focuses on core value:

| Category | Definition | Judgment Criteria | Example |
|----------|------------|-------------------|---------|
| **Must Have** | Features absolutely essential for MVP | Without it, the product cannot deliver core value | Expense tracking app: Add expense record, view expense list |
| **Should Have** | Important but non-blocking features | Users will noticeably miss it, but workarounds exist | Expense tracking app: Export reports, category statistics |
| **Could Have** | Nice-to-have features | Doesn't affect core experience, users won't specifically notice absence | Expense tracking app: Budget alerts, multi-currency support |
| **Won't Have** | Explicitly excluded features | Irrelevant to core value or high technical complexity | Expense tracking app: Social sharing, investment advice |

::: tip MVP Core
Must Have features should be controlled within 5-7 items, ensuring MVP focuses on core value and avoiding scope creep.
:::

## Follow Along

### Step 1: Confirm Bootstrap Stage Completed

Before starting the PRD stage, ensure `input/idea.md` exists and content meets standards.

```bash
# Check if idea.md exists
cat input/idea.md
```

**What you should see**: A structured document with sections including brief description, problem, target users, core value, assumptions, and non-goals.

::: tip If idea.md doesn't meet standards
Return to [Bootstrap stage](../stage-bootstrap/) to regenerate, or manually edit to supplement information.
:::

### Step 2: Start Pipeline to PRD Stage

Execute in the Factory project directory:

```bash
# If pipeline is already started, continue to PRD stage
factory run prd

# Or start pipeline from scratch
factory run
```

CLI will display current status and available stages, and generate PRD Agent's assistant instructions.

### Step 3: AI Assistant Reads PRD Agent Definition

AI assistant (such as Claude Code) will automatically read `agents/prd.agent.md`, understanding its responsibilities and constraints.

::: info PRD Agent Responsibilities
PRD Agent can only:
- Read `input/idea.md`
- Write to `artifacts/prd/prd.md`
- Use the thinking frameworks and decision principles in `skills/prd/skill.md`

It cannot:
- Discuss any technical implementation details or UI design
- Read other files (including upstream artifacts)
- Write to other directories
:::

### Step 4: Load skills/prd/skill.md

PRD Agent will load `skills/prd/skill.md`, obtaining the following guidance:

**Thinking Framework**:
- Target users: Who will use it? Background, role, pain points?
- Core problem: What fundamental problem does the product solve?
- Core value: Why is this solution valuable? What are the advantages over competitors?
- Success metrics: How to measure success?

**MoSCoW Feature Priority**:
- Must Have: Features absolutely essential for MVP
- Should Have: Important but non-blocking features
- Could Have: Nice-to-have features
- Won't Have: Explicitly excluded features

**User Story Writing Guidelines**:
```
As a [role/user type]
I want [feature/operation]
So that [business value/goal]
```

**PRD Document Structure Requirements** (8 sections):
1. Overview
2. Target User Persona
3. Core Value Proposition
4. Feature Requirements (MoSCoW classification)
5. User Flow
6. Non-goals (Won't Have)
7. Success Metrics
8. Assumptions and Risks

### Step 5: Generate PRD Document

AI assistant will generate a complete PRD document based on the content of `input/idea.md`, using the thinking frameworks and decision principles from the skill.

**What PRD Agent Will Do**:
1. Read `input/idea.md`, extract key elements (target users, problems, core value, etc.)
2. Classify features according to MoSCoW framework
3. Write user stories and acceptance criteria for Must Have features
4. List non-goals to prevent scope creep
5. Provide quantifiable success metrics
6. Write the organized document to `artifacts/prd/prd.md`

::: tip Key Constraint
PRD Agent is prohibited from discussing technical implementation details or UI design. If such content is found, PRD Agent will refuse to write it.
:::

### Step 6: Confirm prd.md Content

After PRD Agent completes, it will generate `artifacts/prd/prd.md`. You need to carefully check:

**Checkpoints ✅**:

1. **Are target users specific?**
   - ✅ Have specific personas (age/profession/technical ability/use scenario/pain points)
   - ❌ Vague: "Everyone" or "People who need to track expenses"

2. **Is the core problem clear?**
   - ✅ Describes the problem users encounter in real-world scenarios
   - ❌ Vague: "User experience is poor"

3. **Is core value quantifiable?**
   - ✅ Has specific benefits (save 80% time, improve 50% efficiency)
   - ❌ Vague: "Improve efficiency", "better experience"

4. **Are Must Have features focused?**
   - ✅ No more than 5-7 core features
   - ❌ Too many features or includes secondary features

5. **Does each Must Have feature have a user story?**
   - ✅ Uses standard format (As a... I want... so that...)
   - ❌ Missing user story or incorrect format

6. **Are acceptance criteria verifiable?**
   - ✅ Has specific verifiable criteria (can input amount, displays in list)
   - ❌ Vague ("user-friendly", "smooth experience")

7. **Are Should Have and Won't Have clearly listed?**
   - ✅ Should Have marked as "future iteration" with reasons
   - ✅ Won't Have explains why it's excluded
   - ❌ Missing or too few

8. **Are success metrics quantifiable?**
   - ✅ Has specific values (user retention rate > 30%, task completion time < 30 seconds)
   - ❌ Vague ("users like it", "good experience")

9. **Are assumptions verifiable?**
   - ✅ Can be verified through user research
   - ❌ Subjective judgment ("users will like it")

10. **Does it contain technical implementation details or UI design?**
    - ✅ No technical details and UI descriptions
    - ❌ Includes tech stack choices, database design, UI layout, etc.

### Step 7: Choose Continue, Retry, or Pause

After confirmation, CLI will display options:

```bash
Please choose an action:
[1] Continue (enter UI stage)
[2] Retry (regenerate prd.md)
[3] Pause (continue later)
```

::: tip Recommended: Check in code editor first
Before confirming in the AI assistant, open `artifacts/prd/prd.md` in your code editor and check word by word. Once you enter the UI stage, modification costs will be higher.
:::

## Pitfall Alerts

### Pitfall 1: Too Many Must Have Features

**Bad Example**:
```
Must Have:
1. Add expense record
2. View expense list
3. Export reports
4. Category statistics
5. Budget alerts
6. Multi-currency support
7. Social sharing
8. Investment advice
```

**Consequence**: MVP scope too large, long development cycle, high risk.

**Recommendation**: Control to 5-7 core features:
```
Must Have:
1. Add expense record
2. View expense list
3. Select expense category

Should Have (future iteration):
4. Export reports
5. Category statistics

Won't Have (explicitly excluded):
6. Social sharing (irrelevant to core value)
7. Investment advice (requires professional qualifications, high technical complexity)
```

### Pitfall 2: Missing or Incorrect User Story Format

**Bad Example**:
```
Feature: Add expense record
Description: Users can add expense records
```

**Consequence**: Development team doesn't know who they're building for, what problem they're solving.

**Recommendation**: Use standard format:
```
Feature: Add expense record
User Story: As a budget-conscious user
I want to record every expense
So I can understand where my money goes and control my budget

Acceptance Criteria:
- Can input expense amount and description
- Can select expense category
- Record immediately displays in expense list
- Shows current date and time
```

### Pitfall 3: Unverifiable Acceptance Criteria

**Bad Example**:
```
Acceptance Criteria:
- User interface is friendly
- Operations are smooth
- Good experience
```

**Consequence**: Cannot be tested, development team doesn't know what counts as "friendly", "smooth", "good".

**Recommendation**: Write specific verifiable criteria:
```
Acceptance Criteria:
- Can input expense amount and description
- Can select from 10 preset categories
- Record displays in expense list within 1 second
- Automatically records current date and time
```

### Pitfall 4: Target User Description Too Vague

**Bad Example**:
```
Target users: Everyone who needs to track expenses
```

**Consequence**: Subsequent UI design and technical architecture lack clear direction.

**Recommendation**: Clarify personas:
```
Main user group:
- Role: Young professionals aged 18-30 who just started working
- Age: 18-30 years old
- Technical ability: Intermediate, familiar with smartphone apps
- Use scenario: Record immediately after daily consumption, check statistics at month-end
- Pain points: Discover overspending at month-end, don't know where money went, no budget control
```

### Pitfall 5: Missing or Too Few Non-goals

**Bad Example**:
```
Non-goals: None
```

**Consequence**: Subsequent PRD and Code stages may over-design, increasing technical complexity.

**Recommendation**: List at least 3 items:
```
Non-goals (Out of Scope):
- Social sharing functionality (MVP focuses on personal expense tracking)
- Financial advice and investment analysis (requires professional qualifications, beyond core value)
- Integration with third-party financial systems (high technical complexity, MVP doesn't need it)
- Complex data analysis and reports (Should Have, future iteration)
```

### Pitfall 6: Includes Technical Implementation Details

**Bad Example**:
```
Feature: Add expense record
Technical implementation: Use React Hook Form for form management, API endpoint POST /api/expenses
```

**Consequence**: PRD Agent will refuse these contents (only define requirements, not technical implementation).

**Recommendation**: Only say "what to do", not "how to do it":
```
Feature: Add expense record
User Story: As a budget-conscious user
I want to record every expense
So I can understand where my money goes and control my budget

Acceptance Criteria:
- Can input expense amount and description
- Can select expense category
- Record immediately displays in expense list
- Shows current date and time
```

### Pitfall 7: Unquantifiable Success Metrics

**Bad Example**:
```
Success Metrics:
- Users like our app
- Experience is smooth
- High user retention
```

**Consequence**: Cannot measure whether the product is successful.

**Recommendation**: Write quantifiable metrics:
```
Success Metrics:
Product Goals:
- Acquire 100 active users in the first month
- Users use at least 3 times per week
- Core feature (add expense record) usage rate > 80%

Key Performance Indicators (KPIs):
- User retention rate: 7-day retention > 30%, 30-day retention > 15%
- Core feature usage rate: Add expense record usage > 80%
- Task completion time: Add one expense < 30 seconds

Validation Methods:
- Record user behavior through backend logs
- Use A/B testing to verify user retention
- Collect satisfaction through user feedback surveys
```

### Pitfall 8: Unverifiable Assumptions

**Bad Example**:
```
Assumption: Users will like our design
```

**Consequence**: Cannot be verified through user research, MVP may fail.

**Recommendation**: Write verifiable assumptions:
```
Assumptions:
Market Assumptions:
- Young people (18-30 years old) have the pain point of "not knowing where money went"
- Existing expense tracking apps are too complex, young people need a simpler solution

User Behavior Assumptions:
- Users are willing to spend 2 minutes recording expenses after each purchase if it helps control budget
- Users prefer minimalist UI, don't need complex charts and analysis

Technical Feasibility Assumptions:
- Mobile apps can achieve a fast 3-step expense tracking flow
- Offline storage can meet basic requirements
```

## Lesson Summary

The core of the PRD stage is **defining requirements, not implementation**:

1. **Input**: Structured `input/idea.md` (Bootstrap stage output)
2. **Process**: AI assistant uses thinking frameworks from `skills/prd/skill.md` and MoSCoW priority framework
3. **Output**: Complete `artifacts/prd/prd.md` document
4. **Validation**: Check whether users are clear, value is quantifiable, features are focused, and whether technical details are included

::: tip Key Principles
- ❌ What not to do: Don't discuss technical implementation, don't design UI layout, don't decide database structure
- ✅ What to do: Define target users, list core features, clarify MVP scope, provide testable user stories
:::

## Next Lesson Preview

> In the next lesson, we'll learn **[Stage 3: UI - Design Interface and Prototypes](../stage-ui/)**.
>
> You'll learn:
> - How to design UI structure based on PRD
> - How to use ui-ux-pro-max skill to generate design systems
> - How to generate previewable HTML prototypes
> - Output files and exit criteria for UI stage

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Feature | File Path | Line |
| --- | --- | --- |
| PRD Agent definition | [`agents/prd.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/prd.agent.md) | 1-33 |
| PRD Skill | [`skills/prd/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/prd/skill.md) | 1-325 |
| Pipeline definition (PRD stage) | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 20-33 |
| Scheduler definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-100+ |

**Key Constraints**:
- **Prohibit technical implementation details**: prd.agent.md:23
- **Prohibit UI design descriptions**: prd.agent.md:23
- **Must include target users**: pipeline.yaml:29
- **Must define MVP scope**: pipeline.yaml:30
- **Must list non-goals**: pipeline.yaml:31
- **Output file must be saved to artifacts/prd/prd.md**: prd.agent.md:13

**Exit Criteria** (pipeline.yaml:28-32):
- PRD includes target users
- PRD defines MVP scope
- PRD lists non-goals (Out of Scope)
- PRD contains no technical implementation details

**Skill Content Framework**:
- **Thinking Framework**: Target users, core problem, core value, success metrics
- **MoSCoW Feature Priority Framework**: Must Have, Should Have, Could Have, Won't Have
- **User Story Writing Guidelines**: Standard format and examples
- **PRD Document Structure Requirements**: 8 required sections
- **Decision Principles**: User-centered, focus on MVP, clear non-goals, testability
- **Quality Checklist**: Users and problems, feature scope, user stories, document completeness, prohibited items check
- **NEVER**: 7 explicitly prohibited behaviors

**PRD Document Required Sections**:
1. Overview (product overview, background, and goals)
2. Target User Persona (primary user groups, secondary user groups)
3. Core Value Proposition (problem solved, our solution, differentiation advantages)
4. Feature Requirements (Must Have, Should Have, Could Have)
5. User Flow (main process description)
6. Non-goals (Won't Have)
7. Success Metrics (product goals, key metrics, validation methods)
8. Assumptions and Risks (market assumptions, user behavior assumptions, technical feasibility assumptions, risk table)

</details>
