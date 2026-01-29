---
title: "Subagent Handling: Skip Pruning | opencode-dcp"
subtitle: "Subagent Handling"
sidebarTitle: "Subagent Handling"
description: "Learn how OpenCode DCP handles subagent sessions. Understand why DCP automatically disables pruning for subagents and the design rationale. This tutorial explains subagent detection, pruning behavior, and token usage strategies."
tags:
  - "Subagent"
  - "Session Management"
  - "Usage Limits"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# Subagent Handling

## What You'll Learn

- Understand why DCP automatically disables in subagent sessions
- Know the different token usage strategies between subagents and the main agent
- Avoid issues caused by using DCP functionality in subagents

## Your Current Challenge

You may have noticed that in some OpenCode conversations, DCP's pruning functionality appears to "not work"—tool calls aren't being cleaned up, and token savings statistics remain unchanged. This can occur when using certain OpenCode features, such as code reviews, deep analysis, and more.

This isn't a problem with DCP; rather, these features use a **Subagent** mechanism, and DCP has special handling for subagents.

## What Is a Subagent

::: info What Is a Subagent?

A **Subagent** is OpenCode's internal AI agent mechanism. The main agent delegates complex tasks to subagents for processing, and subagents return results in the form of a summary upon completion.

**Typical Use Cases**:
- Code Review: The main agent starts a subagent, which carefully reads multiple files, analyzes issues, and then returns a concise list of problems
- Deep Analysis: The main agent starts a subagent, which performs extensive tool calls and reasoning, finally returning core findings

From a technical perspective, subagent sessions have a `parentID` attribute that points to their parent session.
:::

## DCP Behavior Toward Subagents

DCP will **automatically disable all pruning functionality** in subagent sessions.

### Why Doesn't DCP Prune Subagents?

There's an important design philosophy behind this:

| Role       | Token Usage Strategy             | Core Goal                     |
|--- | --- | ---|
| **Main Agent** | Needs efficient token use        | Maintain context in long conversations, reduce costs    |
| **Subagent** | Can freely use tokens        | Generate rich information for main agent aggregation |

The **value of subagents** lies in their ability to "spend tokens for information quality"—through extensive tool calls and detailed analysis, providing high-quality information summaries to the parent agent. If DCP prunes tool calls in subagents, it could lead to:

1. **Information Loss**: The subagent's detailed analysis process is deleted, making it impossible to generate a complete summary
2. **Reduced Summary Quality**: The main agent receives an incomplete summary, affecting final decision-making
3. **Contradicts Design Intent**: Subagents are designed to "spend tokens for quality, not save them"

**Conclusion**: Subagents don't need pruning because they ultimately only return a concise summary to the parent agent.

### How DCP Detects Subagents

DCP detects whether the current session is a subagent through the following steps:

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // If there's a parentID, it's a subagent
    } catch (error: any) {
        return false
    }
}
```

**Detection Timing**:
- During session initialization (`ensureSessionInitialized()`)
- Before each message transformation (`createChatMessageTransformHandler()`)

### DCP Behavior in Subagent Sessions

After detecting a subagent, DCP will skip the following features:

| Feature               | Normal Session | Subagent Session | Skip Location |
|--- | --- | --- | ---|
| System prompt injection     | ✅ Execute  | ❌ Skip    | `hooks.ts:26-28` |
| Auto-pruning strategy       | ✅ Execute  | ❌ Skip    | `hooks.ts:64-66` |
| Tool list injection       | ✅ Execute  | ❌ Skip    | `hooks.ts:64-66` |

**Code Implementation** (`lib/hooks.ts`):

```typescript
// System prompt handler
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← Subagent detection
            return               // ← Return directly, don't inject pruning tool instructions
        }
        // ... Normal logic
    }
}

// Message transformation handler
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← Subagent detection
            return               // ← Return directly, don't execute any pruning
        }

        // ... Normal logic: deduplication, overwrite writes, clear errors, inject tool list, etc.
    }
}
```

## Real-World Comparison Cases

### Case 1: Main Agent Session

**Scenario**: You're chatting with the main agent, asking it to analyze code

**DCP Behavior**:
```
User input: "Analyze utility functions in src/utils.ts"
    ↓
[Main Agent] Read src/utils.ts
    ↓
[Main Agent] Analyze code
    ↓
User input: "Check src/helpers.ts too"
    ↓
DCP detects duplicate read pattern
    ↓
DCP marks first src/utils.ts read as prunable ✅
    ↓
When context is sent to LLM, first read content is replaced with placeholder
    ↓
✅ Token savings
```

### Case 2: Subagent Session

**Scenario**: Main agent starts a subagent for deep code review

**DCP Behavior**:
```
User input: "Deep review of all files under src/"
    ↓
[Main Agent] Detects task complexity, starts subagent
    ↓
[Subagent] Read src/utils.ts
    ↓
[Subagent] Read src/helpers.ts
    ↓
[Subagent] Read src/config.ts
    ↓
[Subagent] Read more files...
    ↓
DCP detects subagent session
    ↓
DCP skips all pruning operations ❌
    ↓
[Subagent] Generate detailed review results
    ↓
[Subagent] Return concise summary to main agent
    ↓
[Main Agent] Generate final response based on summary
```

## FAQ

### Q: How can I confirm if the current session is a subagent?

**A**: You can confirm through the following ways:

 1. **Check DCP Logs** (if debug mode is enabled):
    ```
    2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
    2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
    ```

 2. **Observe Conversation Characteristics**:
    - Subagents are typically started when handling complex tasks (such as deep analysis, code reviews)
    - The main agent will prompt "Starting subagent" or similar messages

 3. **Use the /dcp stats Command**:
    - In subagent sessions, tool calls won't be pruned
    - The "pruned" count in token statistics is 0

### Q: Does completely skipping pruning in subagents waste a lot of tokens?

**A**: No. Here are the reasons:

1. **Subagents are Short-Lived**: Subagents end after completing their tasks, unlike the main agent which engages in long conversations
2. **Subagents Return Summaries**: Ultimately, what's passed to the main agent is a concise summary, which won't increase the main agent's context burden
3. **Different Design Goals**: The purpose of subagents is to "use tokens for quality," not to "save tokens"

### Q: Can I force DCP to prune subagents?

**A**: **No, and you shouldn't**. DCP is designed to allow subagents to fully preserve context so they can generate high-quality summaries. If you force pruning, it could:

- Cause incomplete summary information
- Affect the main agent's decision quality
- Violate OpenCode's subagent design philosophy

### Q: Is token usage in subagent sessions tracked?

**A**: Subagent sessions themselves are not tracked by DCP. DCP's statistics only track token savings in main agent sessions.

## Lesson Summary

- **Subagent Detection**: DCP identifies subagent sessions by checking `session.parentID`
- **Auto-Disable**: In subagent sessions, DCP automatically skips all pruning functionality
- **Design Reason**: Subagents need complete context to generate high-quality summaries, and pruning would interfere with this process
- **Usage Boundaries**: Subagents don't pursue token efficiency but rather information quality, which is different from the main agent's goal

## Coming Up Next

> In the next lesson, we'll learn **[Common Questions & Troubleshooting](/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)**.
>
> You'll learn:
> - How to fix configuration errors
> - How to enable debug logging
> - Common reasons why tokens aren't being reduced
> - Limitations of subagent sessions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to Expand Source Code Locations</strong></summary>

> Last Updated: 2026-01-23

| Feature           | File Path                                                                                                              | Line Number    |
|--- | --- | ---|
| Subagent Detection Function | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts)         | 1-8     |
| Session State Initialization | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts)         | 80-116   |
| System Prompt Handler (Skip Subagent) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 26-28    |
| Message Transformation Handler (Skip Subagent) | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 64-66    |
| SessionState Type Definition | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts)         | 27-38    |

**Key Functions**:
- `isSubAgentSession()`: Detect subagent via `session.parentID`
- `ensureSessionInitialized()`: Detect subagent when initializing session state
- `createSystemPromptHandler()`: Skip system prompt injection in subagent sessions
- `createChatMessageTransformHandler()`: Skip all pruning operations in subagent sessions

**Key Constants**:
- `state.isSubAgent`: Subagent flag in session state

</details>
