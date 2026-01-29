---
title: "Context Injection: Give Agents Foresight | opencode-supermemory"
sidebarTitle: "Context Injection"
subtitle: "Automatic Context Injection: Giving Agents 'Foresight'"
description: "Learn about automatic context injection in opencode-supermemory. Understand how agents acquire user profiles and project knowledge at the start of a session, and master keyword-triggered memory saving."
tags:
  - "context"
  - "injection"
  - "prompt"
  - "memory"
prerequisite:
  - "start-getting-started"
order: 999
---

# Automatic Context Injection: Giving Agents "Foresight"

## What You'll Learn

By the end of this lesson, you will be able to:
1.  **Understand** why the Agent knows your coding habits and project architecture from the very beginning.
2.  **Master** the "3D Model" of context injection (User Profile, Project Knowledge, Relevant Memories).
3.  **Learn** to use keywords (like "Remember this") to actively intervene in the Agent's memory behavior.
4.  **Configure** the number of injected items to balance context length with information richness.

---

## Core Concept

Before memory plugins, every time you started a new session, the Agent was a blank slate. You had to repeatedly tell it: "I use TypeScript," "This project uses Next.js."

**Context Injection** solves this problem. It's like slipping a "mission briefing" into the Agent's mind the moment it wakes up.

### Trigger Timing

opencode-supermemory is extremely restrained, triggering automatic injection only on the **first message of the session**.

- **Why only the first?** Because this is the critical moment to establish the session's tone.
- **What about subsequent messages?** Subsequent messages are not automatically injected to avoid disrupting the flow of conversation, unless you actively trigger it (see "Keyword Trigger" below).

### The 3D Injection Model

The plugin fetches three types of data in parallel and combines them into a `[SUPERMEMORY]` prompt block:

| Data Dimension | Source | Function | Example |
|--- | --- | --- | ---|
| **1. User Profile** (Profile) | `getProfile` | Your long-term preferences | "User likes functional programming", "Prefers arrow functions" |
| **2. Project Knowledge** (Project) | `listMemories` | Global knowledge of the current project | "This project uses Clean Architecture", "APIs are in src/api" |
| **3. Relevant Memories** (Relevant) | `searchMemories` | Past experiences related to your first sentence | You ask "How to fix this bug", it finds similar fix records from the past |

---

## What is Injected?

When you send your first message in OpenCode, the plugin silently inserts the following content into the System Prompt in the background.

::: details Click to view the actual structure of injected content
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

After seeing this information, the Agent behaves like a veteran employee who has worked on this project for a long time, rather than a new intern.

---

## Keyword Trigger Mechanism (Nudge)

In addition to the automatic injection at the start, you can "wake up" the memory function at any time during the conversation.

The plugin has a built-in **Keyword Detector**. As long as your message contains specific trigger words, the plugin sends an "invisible hint" (Nudge) to the Agent, forcing it to call the save tool.

### Default Keywords

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (See source code configuration for more)

### Interaction Example

**You type**:
> The API response format has changed here, **remember** to use `data.result` instead of `data.payload` from now on.

**Plugin detects "remember"**:
> (Background injection hint): `[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Agent reacts**:
> Understood. I will remember this change.
> *(Calls `supermemory.add` in the background to save memory)*

---

## Advanced Configuration

You can adjust the injection behavior by modifying `~/.config/opencode/supermemory.jsonc`.

### Common Configuration Options

```jsonc
{
  // Whether to inject user profile (default true)
  "injectProfile": true,

  // How many project memories to inject each time (default 10)
  // Increasing this helps the Agent understand the project better but consumes more Tokens
  "maxProjectMemories": 10,

  // How many user profile items to inject each time (default 5)
  "maxProfileItems": 5,

  // Custom trigger words (supports Regex)
  "keywordPatterns": [
    "note this",
    "save forever"
  ]
}
```

::: tip Tip
After modifying the configuration, you need to restart OpenCode or reload the plugin for changes to take effect.
:::

---

## FAQ

### Q: Does the injected information consume a lot of Tokens?
**A**: It consumes some, but it is usually manageable. Under the default configuration (10 project memories + 5 profile items), it takes up about 500-1000 Tokens. For the 200k context of modern large models (like Claude 3.5 Sonnet), this is a drop in the bucket.

### Q: Why didn't it react when I said "remember"?
**A**: 
1. Check if the spelling is correct (Regex matching is supported).
2. Confirm if the API Key is configured correctly (it won't trigger if the plugin is not initialized).
3. The Agent might have decided to ignore it (although the plugin forces a hint, the Agent has the final say).

### Q: How are "Relevant Memories" found?
**A**: It performs a semantic search based on the **content of your first message**. If your first sentence is just "Hi", it might not find any useful relevant memories, but "Project Knowledge" and "User Profile" will still be injected.

---

## Summary

- **Automatic Injection** triggers only on the first message of the session.
- **The 3D Model** includes User Profile, Project Knowledge, and Relevant Memories.
- **Keyword Trigger** allows you to command the Agent to save memories at any time.
- You can control the amount of injected information via the **Configuration File**.

## Next Step

> Next, we will learn **[Tool Set Details: Teaching Agents to Remember](../tools/index.md)**.
>
> You will learn:
> - How to manually use tools like `add`, `search`, etc.
> - How to view and delete incorrect memories.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Number |
|--- | --- | ---|
| Injection Trigger Logic | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| Keyword Detection | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Prompt Formatting | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| Default Configuration | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**Key Functions**:
- `formatContextForPrompt()`: Assembles the `[SUPERMEMORY]` text block.
- `detectMemoryKeyword()`: Regex matches trigger words in user messages.

</details>

## Next Step

> Next, we will learn **[Tool Set Details: Teaching Agents to Remember](../tools/index.md)**.
>
> You will learn:
> - Master 5 core tool modes including `add`, `search`, `profile`
> - How to manually intervene and correct Agent memories
> - Triggering memory saves using natural language
