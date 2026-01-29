---
title: "Ultrawork Mode: Activate All Features | oh-my-opencode"
sidebarTitle: "Ultrawork Mode"
subtitle: "Ultrawork Mode: Activate All Features with One Command"
description: "Learn oh-my-opencode's Ultrawork mode to activate all features with one command. Enables parallel agents, forced completion, and Category + Skills system."
tags:
  - "ultrawork"
  - "background tasks"
  - "agent collaboration"
prerequisite:
  - "start-installation"
  - "start-sisyphus-orchestrator"
order: 30
---

# Ultrawork Mode: Activate All Features with One Command

## What You'll Learn

- Activate all advanced features of oh-my-opencode with a single command
- Make multiple AI agents work in parallel like a real team
- Avoid manually configuring multiple agents and background tasks
- Understand the design philosophy and best practices of Ultrawork mode

## Your Current Challenges

You may have encountered these situations during development:

- **Too many features, don't know how to use them**: You have 10 specialized agents, background tasks, LSP tools, but don't know how to quickly activate them
- **Manual configuration required**: Every complex task requires manually specifying agents, background concurrency, and other settings
- **Inefficient agent collaboration**: Calling agents in series, wasting time and costs
- **Tasks getting stuck midway**: Agents don't have enough motivation and constraints to complete tasks

These are all affecting your ability to unleash the true power of oh-my-opencode.

## Core Concept

**Ultrawork Mode** is oh-my-opencode's "one-click activate all" mechanism.

::: info What is Ultrawork Mode?
Ultrawork Mode is a special working mode triggered by a keyword. When your prompt contains `ultrawork` or its abbreviation `ulw`, the system automatically activates all advanced features: parallel background tasks, deep exploration, forced completion, multi-agent collaboration, and more.
:::

### Design Philosophy

Ultrawork mode is based on the following core principles (from the [Ultrawork Manifesto](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md)):

| Principle | Description |
|--- | ---|
| **Human intervention is a failure signal** | If you need to constantly correct AI output, it means there's a problem with the system design |
| **Indistinguishable code** | Code written by AI should be indistinguishable from code written by senior engineers |
| **Minimize cognitive burden** | You only need to say "what to do", agents are responsible for "how to do it" |
| **Predictable, consistent, delegatable** | Agents should be as stable and reliable as a compiler |

### Activation Mechanism

When the system detects the `ultrawork` or `ulw` keyword:

1. **Set maximum precision mode**: `message.variant = "max"`
2. **Display Toast notification**: "Ultrawork Mode Activated - Maximum precision engaged. All agents at your disposal."
3. **Inject complete instructions**: Inject 200+ lines of ULTRAWORK instructions to agents, including:
   - Require 100% certainty before starting implementation
   - Require parallel use of background tasks
   - Force use of Category + Skills system
   - Force completion verification (TDD workflow)
   - Prohibit any "I can't do it" excuses

## Follow Along

### Step 1: Trigger Ultrawork Mode

Enter a prompt containing the `ultrawork` or `ulw` keyword in OpenCode:

```
ultrawork develop a REST API
```

Or more concisely:

```
ulw add user authentication
```

**You should see**:
- A Toast notification pops up on the interface: "Ultrawork Mode Activated"
- Agent response starts with "ULTRAWORK MODE ENABLED!"

### Step 2: Observe Agent Behavior Changes

After activating Ultrawork mode, agents will:

1. **Parallel exploration of codebase**
   ```
   delegate_task(agent="explore", prompt="find existing API patterns", background=true)
   delegate_task(agent="explore", prompt="find test infrastructure", background=true)
   delegate_task(agent="librarian", prompt="find authentication best practices", background=true)
   ```

2. **Call Plan agent to create work plan**
   ```
   delegate_task(subagent_type="plan", prompt="create detailed plan based on gathered context")
   ```

3. **Use Category + Skills to execute tasks**
   ```
   delegate_task(category="visual-engineering", load_skills=["frontend-ui-ux", "playwright"], ...)
   ```

**You should see**:
- Multiple background tasks running simultaneously
- Agents actively calling specialized agents (Oracle, Librarian, Explore)
- Complete test plans and work breakdown
- Tasks continue executing until 100% complete

### Step 3: Verify Task Completion

After agents complete, they will:

1. **Show verification evidence**: Actual test run output, manual verification descriptions
2. **Confirm all TODOs complete**: Won't declare completion early
3. **Summarize work done**: List what was done and why

**You should see**:
- Clear test results (not "should work")
- All issues resolved
- No unfinished TODO list

## Checkpoint ✅

After completing the above steps, confirm:

- [ ] You see a Toast notification after entering `ulw`
- [ ] Agent response starts with "ULTRAWORK MODE ENABLED!"
- [ ] You observe parallel background tasks running
- [ ] Agents use the Category + Skills system
- [ ] There's verification evidence after task completion

If any item fails, check:
- Is the keyword spelled correctly (`ultrawork` or `ulw`)
- Are you in the main session (background tasks won't trigger the mode)
- Is the configuration file enabled with relevant features

## When to Use This Technique

| Scenario | Use Ultrawork | Normal Mode |
|--- | --- | ---|
| **Complex new features** | ✅ Recommended (requires multi-agent collaboration) | ❌ May not be efficient enough |
| **Urgent fixes** | ✅ Recommended (needs quick diagnosis and exploration) | ❌ May miss context |
| **Simple modifications** | ❌ Overkill (wastes resources) | ✅ More suitable |
| **Quick idea validation** | ❌ Overkill | ✅ More suitable |

**Rule of thumb**:
- Task involves multiple modules or systems → Use `ulw`
- Need deep research of codebase → Use `ulw`
- Need to call multiple specialized agents → Use `ulw`
- Single file small change → Don't need `ulw`

## Common Pitfalls

::: warning Important Notes

**1. Don't use `ulw` in every prompt**

Ultrawork mode injects a large amount of instructions, which is overkill for simple tasks. Only use it for complex tasks that truly require multi-agent collaboration, parallel exploration, and deep analysis.

**2. Background tasks won't trigger Ultrawork mode**

The keyword detector skips background sessions to avoid incorrectly injecting the mode into sub-agents. Ultrawork mode only works in the main session.

**3. Ensure Provider configuration is correct**

Ultrawork mode relies on multiple AI models working in parallel. If certain Providers are not configured or unavailable, agents may not be able to call specialized agents.
:::

## Lesson Summary

Ultrawork mode achieves the design goal of "activate all features with one command" through keyword triggering:

- **Easy to use**: Just enter `ulw` to activate
- **Automatic collaboration**: Agents automatically call other agents and execute background tasks in parallel
- **Forced completion**: Complete verification mechanism ensures 100% completion
- **Zero configuration**: No need to manually set agent priorities, concurrency limits, etc.

Remember: Ultrawork mode is designed to make agents work like a real team. You just need to express intent, agents are responsible for execution.

## Next Lesson Preview

> In the next lesson, we'll learn **[Provider Configuration](../../platforms/provider-setup/)**.
>
> You'll learn:
> - How to configure multiple Providers like Anthropic, OpenAI, Google
> - How multi-model strategy automatically degrades and selects optimal models
> - How to test Provider connections and quota usage

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Ultrawork design philosophy | [`docs/ultrawork-manifesto.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/ultrawork-manifesto.md) | 1-198 |
| Keyword detector Hook | [`src/hooks/keyword-detector/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/index.ts) | 12-100 |
| ULTRAWORK instruction template | [`src/hooks/keyword-detector/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/constants.ts) | 54-280 |
| Keyword detection logic | [`src/hooks/keyword-detector/detector.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/detector.ts) | 26-53 |

**Key constants**:
- `KEYWORD_DETECTORS`: Keyword detector configuration, including three modes: ultrawork, search, analyze
- `CODE_BLOCK_PATTERN`: Code block regex pattern, used to filter keywords in code blocks
- `INLINE_CODE_PATTERN`: Inline code regex pattern, used to filter keywords in inline code

**Key functions**:
- `createKeywordDetectorHook()`: Creates keyword detector Hook, listens for UserPromptSubmit event
- `detectKeywordsWithType()`: Detects keywords in text and returns type (ultrawork/search/analyze)
- `getUltraworkMessage()`: Generates complete ULTRAWORK mode instructions (selects Planner or normal mode based on agent type)
- `removeCodeBlocks()`: Removes code blocks from text to avoid triggering keywords in code blocks

**Business rules**:
| Rule ID | Rule Description | Tag |
|--- | --- | ---|
| BR-4.8.4-1 | Activate Ultrawork mode when "ultrawork" or "ulw" is detected | [Fact] |
| BR-4.8.4-2 | Ultrawork mode sets `message.variant = "max"` | [Fact] |
| BR-4.8.4-3 | Ultrawork mode displays Toast notification: "Ultrawork Mode Activated" | [Fact] |
| BR-4.8.4-4 | Background task sessions skip keyword detection to avoid mode injection | [Fact] |
| BR-4.8.4-5 | Non-main sessions only allow ultrawork keyword, blocking other mode injection | [Fact] |

</details>
