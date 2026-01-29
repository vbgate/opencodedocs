---
title: "Memory Scope: Manage Lifecycle"
sidebarTitle: "Memory Management"
subtitle: "Memory Scope: Managing Your Digital Brain"
description: "Master opencode-supermemory's memory scopes. Learn to manage User and Project memories with CRUD operations, achieving cross-project reuse and isolation."
tags:
  - "memory-management"
  - "scope"
  - "crud"
prerequisite:
  - "core-tools"
order: 999
---

# Memory Scope and Lifecycle: Managing Your Digital Brain

## What You'll Learn

- **Distinguish Scopes**: Understand which memories "follow you" (cross-project) and which "follow the project" (project-specific).
- **Manage Memories**: Learn how to manually view, add, and delete memories to keep the Agent's cognition clean.
- **Debug Agent**: Know where to fix things when the Agent "remembers incorrectly".

## Core Concepts

opencode-supermemory divides memory into two isolated **Scopes**, similar to global and local variables in programming languages.

### 1. Two Types of Scopes

| Scope | Scope ID | Lifecycle | Typical Usage |
| :--- | :--- | :--- | :--- |
| **User Scope** | `user` | **Follows you permanently**<br>Shared across all projects | • Coding style preferences (e.g., "Prefer TypeScript")<br>• Personal habits (e.g., "Always write comments")<br>• General knowledge |
| **Project Scope** | `project` | **Limited to current project**<br>Invalid upon switching directories | • Project architecture design<br>• Business logic explanations<br>• Fixes for specific bugs |

::: info How are scopes generated?
The plugin automatically generates unique tags via `src/services/tags.ts`:
- **User Scope**: Based on your Git email hash (`opencode_user_{hash}`).
- **Project Scope**: Based on the current project path hash (`opencode_project_{hash}`).
:::

### 2. Memory Lifecycle

1.  **Create (Add)**: Written via CLI initialization or Agent conversation (`Remember this...`).
2.  **Activate (Inject)**: Every time a new session starts, the plugin automatically pulls relevant User and Project memories to inject into the context.
3.  **Search**: The Agent can actively search for specific memories during conversation.
4.  **Forget**: Delete via ID when memories are outdated or incorrect.

---

## Follow Along: Managing Your Memory

We will manually manage memories in these two scopes by talking to the Agent.

### Step 1: View Existing Memories

First, let's see what the Agent currently remembers.

**Action**: Type in the OpenCode chat box:

```text
Please list all memories in the current project (List memories in project scope)
```

**You should see**:
The Agent calls the `list` mode of the `supermemory` tool and returns a list:

```json
// Example Output
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "Project uses MVC architecture, Service layer handles business logic",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### Step 2: Add Cross-Project Memory (User Scope)

Suppose you want the Agent to reply in Chinese in **all** projects. This is a memory suitable for User Scope.

**Action**: Enter the following command:

```text
Please remember my personal preference: No matter which project, always reply to me in Chinese.
Please save this to User Scope.
```

**You should see**:
The Agent calls the `add` tool with parameter `scope: "user"`:

```json
{
  "mode": "add",
  "content": "User prefers responses in Chinese across all projects",
  "scope": "user",
  "type": "preference"
}
```

The system confirms the memory has been added and returns an `id`.

### Step 3: Add Project-Specific Memory (Project Scope)

Now, let's add a specific rule for the **current project**.

**Action**: Enter the following command:

```text
Please remember: In this project, all date formats must be YYYY-MM-DD.
Save to Project Scope.
```

**You should see**:
The Agent calls the `add` tool with parameter `scope: "project"` (this is the default, Agent might omit it):

```json
{
  "mode": "add",
  "content": "Date format must be YYYY-MM-DD in this project",
  "scope": "project",
  "type": "project-config"
}
```

### Step 4: Verify Isolation

To verify if the scopes are working, we can try searching.

**Action**: Enter:

```text
Search for memories about "date format"
```

**You should see**:
The Agent calls the `search` tool. If it specifies `scope: "project"` or performs a mixed search, it should find the memory just added.

::: tip Verify Cross-Project Capability
If you open a new terminal window and enter a different project directory, asking about "date format" again, the Agent should **not find** this memory (because it is isolated in the original project's Project Scope). But if you ask "What language do I want you to reply in", it should be able to retrieve the "Chinese reply" preference from User Scope.
:::

### Step 5: Delete Outdated Memory

If project specifications change, we need to delete old memories.

**Action**:
1. First perform **Step 1** to get the memory ID (e.g., `mem_987654`).
2. Enter command:

```text
Please forget the memory about date format with ID mem_987654.
```

**You should see**:
The Agent calls the `forget` tool:

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

The system returns `success: true`.

---

## FAQ

### Q: If I change computers, will User Scope memories still be there?
**A: It depends on your Git configuration.**
User Scope is generated based on `git config user.email`. If you use the same Git email on both computers and connect to the same Supermemory account (using the same API Key), then memories are **synced**.

### Q: Why can't I see the memory I just added?
**A: It might be cache or indexing latency.**
Supermemory's vector indexing is usually sub-second, but there might be brief delays during network fluctuations. Additionally, the context injected by the Agent at the start of a session is **static** (snapshot); newly added memories might require restarting the session (`/clear` or restarting OpenCode) to take effect in "auto-injection", but they can be found immediately via the `search` tool.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code location</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Number |
| :--- | :--- | :--- |
| Scope Generation Logic | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| Memory Tool Definition | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| Memory Type Definition | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| Client Implementation | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**Key Functions**:
- `getUserTag()`: Generate user tag based on Git email
- `getProjectTag()`: Generate project tag based on directory path
- `supermemoryClient.addMemory()`: Add memory API call
- `supermemoryClient.deleteMemory()`: Delete memory API call

</details>

## What's Next

> Next, we will learn **[Preemptive Compaction Principles](../../advanced/compaction/index.md)**.
>
> You will learn:
> - Why the Agent gets "amnesia" (context overflow)
> - How the plugin automatically detects Token usage
> - How to compress sessions without losing key information
