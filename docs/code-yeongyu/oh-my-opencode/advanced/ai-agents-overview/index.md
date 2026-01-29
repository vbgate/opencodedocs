---
title: "AI Agents: 10 Experts | oh-my-opencode"
subtitle: "AI Agents Team: Meet 10 Experts"
sidebarTitle: "AI Agents"
description: "Learn about oh-my-opencode's 10 specialized AI agents including Sisyphus, Oracle, Librarian, and more. Master agent collaboration mechanisms like delegation, parallel execution, and review to boost your development productivity."
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# AI Agents Team: Meet 10 Experts

## What You'll Learn

- Understand the responsibilities and expertise of the 10 built-in AI agents
- Quickly select the most appropriate agent based on task type
- Understand collaboration mechanisms between agents (delegation, parallel execution, review)
- Master permission restrictions and use cases for different agents

## Core Philosophy: Collaborate Like a Real Team

The core idea behind **oh-my-opencode** is: **Don't treat AI as a do-it-all assistant—treat it as a professional team.**

In a real development team, you need:
- **Chief Orchestrator** (Tech Lead): Responsible for planning, task allocation, and progress tracking
- **Architecture Advisor** (Architect): Provides technical decisions and architecture design recommendations
- **Code Reviewer** (Reviewer): Checks code quality, identifies potential issues
- **Research Expert** (Researcher): Finds documentation, searches open source implementations, investigates best practices
- **Code Detective** (Searcher): Quickly locates code, finds references, understands existing implementations
- **Frontend Designer** (Frontend Designer): Designs UI, adjusts styles
- **Git Expert** (Git Master): Commits code, manages branches, searches history

oh-my-opencode transforms these roles into 10 specialized AI agents that you can flexibly combine based on task type.

## Detailed Breakdown of 10 Agents

### Chief Orchestrators (2)

#### Sisyphus - Chief Orchestrator

**Role**: Chief orchestrator, your primary technical lead

**Capabilities**:
- Deep reasoning (32k thinking budget)
- Plans and delegates complex tasks
- Executes code modifications and refactoring
- Manages the entire development workflow

**Recommended Model**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Use Cases**:
- Daily development tasks (adding features, fixing bugs)
- Complex problems requiring deep reasoning
- Multi-step task decomposition and execution
- Scenarios requiring parallel delegation to other agents

**Invocation Method**:
- Default main agent ("Sisyphus" in OpenCode Agent selector)
- Enter tasks directly in prompts, no special trigger words needed

**Permissions**: Full tool permissions (write, edit, bash, delegate_task, etc.)

---

#### Atlas - TODO Manager

**Role**: Chief orchestrator, focused on TODO list management and task execution tracking

**Capabilities**:
- Manages and tracks TODO lists
- Systematically executes plans
- Task progress monitoring

**Recommended Model**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Use Cases**:
- Start project execution using the `/start-work` command
- Tasks requiring strict adherence to plan
- Systematic tracking of task progress

**Invocation Method**:
- Use slash command `/start-work`
- Automatically activated through Atlas Hook

**Permissions**: Full tool permissions

---

### Advisors and Reviewers (3)

#### Oracle - Strategic Advisor

**Role**: Read-only technical advisor, high-IQ reasoning expert

**Capabilities**:
- Architecture decision recommendations
- Complex problem diagnosis
- Code review (read-only)
- Multi-system trade-off analysis

**Recommended Model**: `openai/gpt-5.2` (temperature: 0.1)

**Use Cases**:
- Complex architecture design
- Self-review after completing important work
- Difficult debugging with 2+ failed fix attempts
- Unfamiliar code patterns or architectures
- Security/performance related issues

**Trigger Conditions**:
- Prompt contains `@oracle` or use `delegate_task(agent="oracle")`
- Automatically recommended for complex architecture decisions

**Restrictions**: Read-only permissions (write, edit, task, delegate_task prohibited)

**Core Principles**:
- **Minimalism**: Lean toward the simplest solution
- **Leverage existing resources**: Prioritize modifying current code, avoid introducing new dependencies
- **Developer experience first**: Readability and maintainability > theoretical performance
- **Single clear path**: Provide one primary recommendation, offer alternatives only when trade-off differences are significant

---

#### Metis - Pre-planning Analyst

**Role**: Requirements analysis and risk assessment expert before planning

**Capabilities**:
- Identifies hidden requirements and unclear requests
- Detects ambiguities that could cause AI failure
- Flags potential AI-slop patterns (over-engineering, scope creep)
- Prepares instructions for planning agents

**Recommended Model**: `anthropic/claude-sonnet-4-5` (temperature: 0.3)

**Use Cases**:
- Before Prometheus planning
- When user requests are vague or open-ended
- Preventing AI over-engineering patterns

**Invocation Method**: Automatically called by Prometheus (interview mode)

**Restrictions**: Read-only permissions (write, edit, task, delegate_task prohibited)

**Core Workflow**:
1. **Intent Classification**: Refactor / Build from scratch / Medium task / Collaboration / Architecture / Research
2. **Intent-Specific Analysis**: Provide targeted recommendations based on different types
3. **Question Generation**: Generate clear questions for the user
4. **Instruction Preparation**: Generate clear "MUST" and "MUST NOT" instructions for Prometheus

---

#### Momus - Plan Reviewer

**Role**: Strict plan review expert, finds all omissions and ambiguities

**Capabilities**:
- Verifies plan clarity, verifiability, and completeness
- Checks all file references and context
- Simulates actual implementation steps
- Identifies critical omissions

**Recommended Model**: `anthropic/claude-sonnet-4-5` (temperature: 0.1)

**Use Cases**:
- After Prometheus creates work plans
- Before executing complex TODO lists
- Verify plan quality

**Invocation Method**: Automatically called by Prometheus

**Restrictions**: Read-only permissions (write, edit, task, delegate_task prohibited)

**Four Review Criteria**:
1. **Work Clarity**: Does each task specify reference sources?
2. **Verification and Acceptance Criteria**: Are there specific success verification methods?
3. **Context Completeness**: Is sufficient context provided (90% confidence threshold)?
4. **Overall Understanding**: Does the developer understand WHY, WHAT, and HOW?

**Core Principle**: **Document reviewer, not design consultant**. Evaluates whether "the plan is clear enough to execute," not "whether the chosen approach is correct."

---

### Research and Exploration (3)

#### Librarian - Multi-repository Research Expert

**Role**: Open source codebase understanding expert, specializes in finding documentation and implementation examples

**Capabilities**:
- GitHub CLI: Clone repositories, search issues/PRs, view history
- Context7: Query official documentation
- Web Search: Search latest information
- Generate evidence with permanent links

**Recommended Model**: `opencode/big-pickle` (temperature: 0.1)

**Use Cases**:
- "How to use [library]?"
- "What are best practices for [framework feature]?"
- "Why does [external dependency] behave this way?"
- "Find usage examples for [library]"

**Trigger Conditions**:
- Automatically triggered when external libraries/sources are mentioned
- Prompt contains `@librarian`

**Request Type Classification**:
- **Type A (Conceptual)**: "How to do X?", "Best practices"
- **Type B (Implementation Reference)**: "How does X implement Y?", "Show source for Z"
- **Type C (Context and History)**: "Why was it changed this way?", "History of X?"
- **Type D (Comprehensive Research)**: Complex/vague requests

**Restrictions**: Read-only permissions (write, edit, task, delegate_task, call_omo_agent prohibited)

**Mandatory Requirement**: All code statements must include GitHub permanent links

---

#### Explore - Fast Codebase Exploration Expert

**Role**: Context-aware code search expert

**Capabilities**:
- LSP tools: Definitions, references, symbol navigation
- AST-Grep: Structural pattern search
- Grep: Text pattern search
- Glob: Filename pattern matching
- Parallel execution (3+ tools running simultaneously)

**Recommended Model**: `opencode/gpt-5-nano` (temperature: 0.1)

**Use Cases**:
- Broad searches requiring 2+ search angles
- Unfamiliar module structures
- Cross-layer pattern discovery
- Finding "Where is X?", "Which file has Y?"

**Trigger Conditions**:
- Automatically triggered when 2+ modules are involved
- Prompt contains `@explore`

**Mandatory Output Format**:
```
<analysis>
**Literal Request**: [User's literal request]
**Actual Need**: [What is actually needed]
**Success Looks Like**: [What success looks like]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [Why this file is relevant]
- /absolute/path/to/file2.ts — [Why this file is relevant]
</files>

<answer>
[Direct answer to actual need]
</answer>

<next_steps>
[What to do next]
</next_steps>
</results>
```

**Restrictions**: Read-only permissions (write, edit, task, delegate_task, call_omo_agent prohibited)

---

#### Multimodal Looker - Media Analysis Expert

**Role**: Explains media files that cannot be read as plain text

**Capabilities**:
- PDF: Extract text, structure, tables, specific section data
- Images: Describe layout, UI elements, text, charts
- Charts: Explain relationships, flows, architecture

**Recommended Model**: `google/gemini-3-flash` (temperature: 0.1)

**Use Cases**:
- Need to extract structured data from PDFs
- Describe UI elements or charts in images
- Parse charts in technical documentation

**Invocation Method**: Automatically triggered through `look_at` tool

**Restrictions**: **Read-only allowlist** (only read tool allowed)

---

### Planning and Execution (2)

#### Prometheus - Strategic Planner

**Role**: Interview-style requirements gathering and work plan generation expert

**Capabilities**:
- Interview mode: Continuously asks questions until requirements are clear
- Work plan generation: Structured Markdown plan documents
- Parallel delegation: Consult Oracle, Metis, Momus to validate plans

**Recommended Model**: `anthropic/claude-opus-4-5` (temperature: 0.1)

**Use Cases**:
- Creating detailed plans for complex projects
- Projects requiring clear requirements
- Systematic workflow

**Invocation Method**:
- Prompt contains `@prometheus` or "use Prometheus"
- Use slash command `/start-work`

**Workflow**:
1. **Interview Mode**: Continuously ask questions until requirements are clear
2. **Draft Plan**: Generate structured Markdown plan
3. **Parallel Delegation**:
   - `delegate_task(agent="oracle", prompt="Review architecture decisions")` → Background
   - `delegate_task(agent="metis", prompt="Identify potential risks")` → Background
   - `delegate_task(agent="momus", prompt="Verify plan completeness")` → Background
4. **Integrate Feedback**: Refine plan
5. **Output Plan**: Save to `.sisyphus/plans/{name}.md`

**Restrictions**: Planning only, no code implementation (enforced by `prometheus-md-only` Hook)

---

#### Sisyphus Junior - Task Executor

**Role**: Sub-agent executor generated by categories

**Capabilities**:
- Inherits Category configuration (model, temperature, prompt_append)
- Loads Skills (specialized capabilities)
- Executes delegated subtasks

**Recommended Model**: Inherits from Category (default `anthropic/claude-sonnet-4-5`)

**Use Cases**:
- Automatically generated when using `delegate_task(category="...", skills=["..."])`
- Tasks requiring specific Category and Skill combinations
- Lightweight fast tasks ("quick" Category uses Haiku model)

**Invocation Method**: Automatically generated through `delegate_task` tool

**Restrictions**: task, delegate_task prohibited (cannot delegate again)

---

## Agent Invocation Quick Reference

| Agent | Invocation Method | Trigger Conditions |
|--- | --- | ---|
| **Sisyphus** | Default main agent | Daily development tasks |
| **Atlas** | `/start-work` command | Start project execution |
| **Oracle** | `@oracle` or `delegate_task(agent="oracle")` | Complex architecture decisions, 2+ failed fix attempts |
| **Librarian** | `@librarian` or `delegate_task(agent="librarian")` | Automatically triggered when external libraries/sources are mentioned |
| **Explore** | `@explore` or `delegate_task(agent="explore")` | Automatically triggered when 2+ modules are involved |
| **Multimodal Looker** | `look_at` tool | When analyzing PDFs/images |
| **Prometheus** | `@prometheus` or `/start-work` | Prompt contains "Prometheus" or planning is needed |
| **Metis** | Prometheus auto-call | Automatically analyze before planning |
| **Momus** | Prometheus auto-call | Automatically review after plan generation |
| **Sisyphus Junior** | `delegate_task(category=...)` | Automatically generated when using Category/Skill |

---

## Which Agent to Use When

::: tip Quick Decision Tree

**Scenario 1: Daily Development (writing code, fixing bugs)**
→ **Sisyphus** (default)

**Scenario 2: Complex Architecture Decisions**
→ **@oracle** for consultation

**Scenario 3: Need to find documentation or implementations for external libraries**
→ **@librarian** or automatically triggered

**Scenario 4: Unfamiliar codebase, need to find related code**
→ **@explore** or automatically triggered (2+ modules)

**Scenario 5: Complex project needs detailed planning**
→ **@prometheus** or use `/start-work`

**Scenario 6: Need to analyze PDFs or images**
→ **look_at** tool (automatically triggers Multimodal Looker)

**Scenario 7: Quick simple task, want to save money**
→ `delegate_task(category="quick")`

**Scenario 8: Need professional Git operations**
→ `delegate_task(category="quick", skills=["git-master"])`

**Scenario 9: Need frontend UI design**
→ `delegate_task(category="visual-engineering")`

**Scenario 10: Need high-IQ reasoning tasks**
→ `delegate_task(category="ultrabrain")`

:::

---

## Agent Collaboration Examples: Complete Workflows

### Example 1: Complex Feature Development

```
User: Develop a user authentication system

→ Sisyphus receives task
  → Analyzes requirements, finds need for external library (JWT)
  → Parallel delegation:
    - @librarian: "Find Next.js JWT best practices" → [Background]
    - @explore: "Find existing authentication-related code" → [Background]
  → Waits for results, integrates information
  → Implements JWT authentication feature
  → After completion, delegates:
    - @oracle: "Review architecture design" → [Background]
  → Optimizes based on recommendations
```

---

### Example 2: Project Planning

```
User: Use Prometheus to plan this project

→ Prometheus receives task
  → Interview mode:
    - Question 1: What are core features?
    - [User answers]
    - Question 2: Target user group?
    - [User answers]
    - ...
  → After requirements are clear, parallel delegation:
    - delegate_task(agent="oracle", prompt="Review architecture decisions") → [Background]
    - delegate_task(agent="metis", prompt="Identify potential risks") → [Background]
    - delegate_task(agent="momus", prompt="Verify plan completeness") → [Background]
  → Waits for all background tasks to complete
  → Integrates feedback, refines plan
  → Outputs Markdown plan document
→ User reviews plan, confirms
→ Use /start-work to start execution
```

---

## Agent Permissions and Restrictions

| Agent | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
|--- | --- | --- | --- | --- | --- | --- | --- | ---|
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## Summary

oh-my-opencode's 10 AI agents cover all stages of the development workflow:

- **Orchestration and Execution**: Sisyphus (chief orchestrator), Atlas (TODO management)
- **Advisors and Reviewers**: Oracle (strategic advisor), Metis (pre-planning analysis), Momus (plan review)
- **Research and Exploration**: Librarian (multi-repository research), Explore (codebase exploration), Multimodal Looker (media analysis)
- **Planning**: Prometheus (strategic planning), Sisyphus Junior (subtask execution)

**Key Points**:
1. Don't treat AI as a do-it-all assistant—treat it as a professional team
2. Select the most appropriate agent based on task type
3. Leverage parallel delegation to improve efficiency (Librarian, Explore, Oracle can all run in the background)
4. Understand permission restrictions for each agent (read-only agents cannot modify code)
5. Collaboration between agents can form complete workflows (planning → execution → review)

---

## Next Lesson Preview

> Next, we'll learn **[Prometheus Planning: Interview-Style Requirements Gathering](../prometheus-planning/)**.
>
> You'll learn:
> - How to use Prometheus for interview-style requirements gathering
> - How to generate structured work plans
> - How to have Metis and Momus validate your plans
> - How to retrieve and cancel background tasks

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-26

| Agent | File Path | Line Number |
|--- | --- | ---|
| Sisyphus Chief Orchestrator | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas Chief Orchestrator | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle Advisor | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian Research Expert | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore Search Expert | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus Planner | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
|--- | --- | ---|
| Momus Plan Reviewer | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| Agent Metadata Definition | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| Agent Tool Restrictions | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**Key Configurations**:
- `ORACLE_PROMPT_METADATA`: Oracle agent metadata (trigger conditions, use cases)
- `LIBRARIAN_PROMPT_METADATA`: Librarian agent metadata
- `EXPLORE_PROMPT_METADATA`: Explore agent metadata
- `MULTIMODAL_LOOKER_PROMPT_METADATA`: Multimodal Looker agent metadata
- `METIS_SYSTEM_PROMPT`: Metis agent system prompt
- `MOMUS_SYSTEM_PROMPT`: Momus agent system prompt

**Key Functions**:
- `createOracleAgent(model)`: Create Oracle agent configuration
- `createLibrarianAgent(model)`: Create Librarian agent configuration
- `createExploreAgent(model)`: Create Explore agent configuration
- `createMultimodalLookerAgent(model)`: Create Multimodal Looker agent configuration
- `createMetisAgent(model)`: Create Metis agent configuration
- `createMomusAgent(model)`: Create Momus agent configuration

**Permission Restrictions**:
- `createAgentToolRestrictions()`: Create agent tool restrictions (used by Oracle, Librarian, Explore, Metis, Momus)
- `createAgentToolAllowlist()`: Create agent tool allowlist (used by Multimodal Looker)

</details>
