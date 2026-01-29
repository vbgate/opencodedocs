---
title: "Tools: Core Modes | opencode-supermemory"
sidebarTitle: "Core Tools"
subtitle: "Tools Explained: Teaching Agents to Remember"
description: "Master supermemory's 5 core tools: add, search, profile, list, forget. Control Agent memory via natural language commands."
tags:
  - "Tool Usage"
  - "Memory Management"
  - "Core Features"
prerequisite:
  - "start-getting-started"
order: 999
---

# Tools Explained: Teaching Agents to Remember

## What You'll Learn

In this lesson, you will master the core interaction methods of the `supermemory` plugin. Although Agents usually manage memory automatically, as a developer, you often need to intervene manually.

By the end of this lesson, you will be able to:
1.  Use `add` mode to manually save key technical decisions.
2.  Use `search` mode to verify if the Agent remembers your preferences.
3.  Use `profile` to view the "you" from the Agent's perspective.
4.  Use `list` and `forget` to clean up outdated or incorrect memories.

## Core Concept

opencode-supermemory is not a black box; it interacts with the Agent via the standard OpenCode Tool protocol. This means you can call it like a function or direct the Agent to use it with natural language.

The plugin registers a tool named `supermemory` to the Agent, which acts like a Swiss Army knife with 6 modes:

| Mode | Function | Typical Scenario |
| :--- | :--- | :--- |
| **add** | Add memory | "Remember, this project must run with Bun" |
| **search** | Search memory | "Did I say how to handle authentication before?" |
| **profile** | User profile | View the coding habits summarized by the Agent |
| **list** | List memories | Audit the last 10 saved memories |
| **forget** | Delete memory | Delete an incorrect configuration record |
| **help** | Guide | View tool help documentation |

::: info Automatic Trigger Mechanism
In addition to manual calls, the plugin also listens to your chat content. When you say "Remember this" or "Save this" in natural language, the plugin automatically detects keywords and forces the Agent to call the `add` tool.
:::

## Follow Me: Managing Memory Manually

Although we usually let the Agent operate automatically, manual tool invocation is very useful during debugging or establishing initial memories. You can ask the Agent to perform these operations directly via natural language in the OpenCode dialog box.

### 1. Add Memory (Add)

This is the most common feature. You can specify the content, type, and scope of the memory.

**Action**: Tell the Agent to save a memory about the project architecture.

**Input Command**:
```text
Use the supermemory tool to save a memory:
Content: "All service layer code in this project must be placed in the src/services directory"
Type: architecture
Scope: project
```

**Agent's Internal Behavior** (Source Logic):
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "All service layer code in this project must be placed in the src/services directory",
    "type": "architecture",
    "scope": "project"
  }
}
```

**You Should See**:
The Agent returns a confirmation message similar to this:
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip Choosing Memory Type
To make retrieval more precise, it is recommended to use accurate types:
- `project-config`: Tech stack, toolchain configuration
- `architecture`: Architecture patterns, directory structure
- `preference`: Your personal coding preferences (e.g., "prefer arrow functions")
- `error-solution`: Specific solutions to certain errors
- `learned-pattern`: Code patterns observed by the Agent
:::

### 2. Search Memory (Search)

When you want to confirm if the Agent "knows" something, you can use the search function.

**Action**: Search for memories about "service layer".

**Input Command**:
```text
Query supermemory, keyword is "services", scope is project
```

**Agent's Internal Behavior**:
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**You Should See**:
The Agent lists relevant memory fragments and their similarity scores.

### 3. View User Profile (Profile)

Supermemory automatically maintains a "user profile" containing your long-term preferences.

**Action**: View your profile.

**Input Command**:
```text
Call the profile mode of the supermemory tool to see what you know about me
```

**You Should See**:
Two types of information returned:
- **Static**: Static facts (e.g., "User is a full-stack engineer")
- **Dynamic**: Dynamic preferences (e.g., "User has been focusing on Rust recently")

### 4. Audit and Forget (List & Forget)

If the Agent remembers incorrect information (such as a deprecated API Key), you need to delete it.

**Step 1: List recent memories**
```text
List the last 5 project memories
```
*(Agent calls `mode: "list", limit: 5`)*

**Step 2: Get ID and delete**
Suppose you see an incorrect memory with ID `mem_abc123`.

```text
Delete the record with memory ID mem_abc123
```
*(Agent calls `mode: "forget", memoryId: "mem_abc123"`)*

**You Should See**:
> ✅ Memory mem_abc123 removed from project scope

## Advanced: Natural Language Triggers

You don't need to describe tool parameters in detail every time. The plugin has built-in keyword detection mechanisms.

**Try It**:
Say directly in the conversation:
> **Remember this**: All date handling must use the date-fns library, moment.js is prohibited.

**What Happened?**
1.  The plugin's `chat.message` hook detected the keyword "Remember this".
2.  The plugin injected a system prompt into the Agent: `[MEMORY TRIGGER DETECTED]`.
3.  The Agent received the instruction: "You MUST use the supermemory tool with mode: 'add'...".
4.  The Agent automatically extracted the content and called the tool.

This is a very natural interaction method, allowing you to "solidify" knowledge at any time during the coding process.

## FAQ

**Q: What is the default `scope`?**
A: The default is `project`. If you want to save preferences common across projects (e.g., "I always use TypeScript"), please explicitly specify `scope: "user"`.

**Q: Why didn't the memory I added take effect immediately?**
A: The `add` operation is asynchronous. Usually, the Agent "knows" the new memory immediately after the tool call succeeds, but under extreme network latency, it may take a few seconds.

**Q: Is sensitive information uploaded?**
A: The plugin automatically masks content within `<private>` tags. However, for security, it is recommended not to put passwords or API Keys into memory.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code location</strong></summary>

> Last Updated: 2026-01-23

| Feature | File Path | Line Number |
| :--- | :--- | :--- |
| Tool Definition | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Keyword Detection | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Trigger Prompts | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| Client Implementation | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | Full File |

**Key Type Definitions**:
- `MemoryType`: Defined in [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)
- `MemoryScope`: Defined in [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)

</details>

## Next Step

> Next lesson we will learn **[Memory Scopes & Lifecycle](../memory-management/index.md)**.
>
> You will learn:
> - Underlying isolation mechanisms of User Scope and Project Scope
> - How to design efficient memory partitioning strategies
> - Memory lifecycle management
