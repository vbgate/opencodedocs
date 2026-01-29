---
title: "State Persistence: Retain Pruning History | opencode-dynamic-context-pruning"
sidebarTitle: "State Persistence"
subtitle: "State Persistence: Retain Pruning History Across Sessions"
description: "Learn DCP state persistence to retain pruning history across sessions. Covers storage location, save and load operations, and viewing token savings via /dcp stats."
tags:
  - "advanced"
  - "state-management"
  - "persistence"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 2
---

# State Persistence: Retain Pruning History Across Sessions

## What You'll Learn

- Understand how DCP retains pruning state across OpenCode restarts
- Know where persistent files are stored and their content format
- Master state management logic during session switching and context compression
- View cumulative token savings across all sessions via `/dcp stats`

## Your Current Challenge

You closed OpenCode and reopened it, only to find that previous pruning records were gone? Or wondering where the "All-time cumulative savings" in `/dcp stats` comes from?

DCP's state persistence mechanism automatically saves your pruning history and statistics in the background, ensuring they remain visible after restarts.

## When to Use This

- Need to accumulate token savings statistics across sessions
- Continue pruning history after OpenCode restarts
- Long-term DCP usage to see overall effectiveness

## Core Concept

**What is State Persistence**

**State persistence** refers to DCP saving pruning history and statistics to disk files, ensuring these information are not lost after OpenCode restarts or session switching.

::: info Why Persistence is Needed

Without persistence, every time you close OpenCode:
- Pruned tool ID list would be lost
- Token savings statistics would be reset to zero
- AI might repeatedly prune the same tool

With persistence, DCP can:
- Remember which tools have already been pruned
- Accumulate token savings across all sessions
- Continue previous work after restart
:::

**Two Major Parts of Persistent Content**

DCP saves two types of state:

| Type | Content | Purpose |
|--- | --- | ---|
| **Pruning State** | List of pruned tool IDs | Avoid re-pruning, cross-session tracking |
| **Statistics** | Token savings count (current session + historical cumulative) | Show DCP effectiveness, long-term trend analysis |

This data is stored separately per OpenCode session ID, with each session corresponding to one JSON file.

## Data Flow

```mermaid
graph TD
    subgraph "Pruning Operations"
        A1[AI calls discard/extract]
        A2[User executes /dcp sweep]
    end

    subgraph "Memory State"
        B1[SessionState.prune.toolIds]
        B2[SessionState.stats]
    end

    subgraph "Persistent Storage"
        C1[~/.local/share/opencode/storage/plugin/dcp/]
        C2[{sessionId}.json]
    end

    A1 --> B1
    A2 --> B1
    B1 -->|Async save| C1
    B2 -->|Async save| C1
    C1 --> C2

    C2 -->|Load on session switch| B1
    C2 -->|Load on session switch| B2

    D[OpenCode summary message] -->|Clear cache| B1
```

## Follow Along

### Step 1: Understand Persistent Storage Location

**Why**
Knowing where data is stored allows you to manually check or delete (if needed)

DCP saves state to the local filesystem and does not upload to the cloud.

```bash
# Persistent directory location
~/.local/share/opencode/storage/plugin/dcp/

# Each session has one JSON file, format: {sessionId}.json
```

**You should see**: The directory may have multiple `.json` files, each corresponding to an OpenCode session

::: tip Data Privacy

DCP only saves pruning state and statistics locally, without involving any sensitive information. Persistent files contain:
- Tool ID list (numeric identifiers)
- Token savings count (statistics)
- Last updated time (timestamp)

Does not include conversation content, tool outputs, or user inputs.
:::

### Step 2: View Persistent File Format

**Why**
Understanding file structure allows you to manually check or debug issues

```bash
# List all persistent files
ls -la ~/.local/share/opencode/storage/plugin/dcp/

# View persistent content for a specific session
cat ~/.local/share/opencode/storage/plugin/dcp/{sessionId}.json
```

**You should see**: A JSON structure similar to this

```json
{
  "sessionName": "My Session Name",
  "prune": {
    "toolIds": ["12345", "12346", "12347"]
  },
  "stats": {
    "pruneTokenCounter": 0,
    "totalPruneTokens": 15420
  },
  "lastUpdated": "2026-01-23T10:30:45.123Z"
}
```

**Field Descriptions**:

| Field | Type | Meaning |
|--- | --- | ---|
| `sessionName` | string (optional) | Session name for identification |
| `prune.toolIds` | string[] | List of pruned tool IDs |
| `stats.pruneTokenCounter` | number | Tokens saved in current session (unarchived) |
| `stats.totalPruneTokens` | number | Cumulative tokens saved historically |
| `lastUpdated` | string | Last updated time in ISO 8601 format |

### Step 3: View Cumulative Statistics

**Why**
Understand cumulative effectiveness across all sessions to evaluate DCP's long-term value

```bash
# Execute in OpenCode
/dcp stats
```

**You should see**: Statistics panel

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
───────────────────────────────────────────────────────────
  Tokens pruned: ~15.4K
  Tools pruned:   3

All-time:
───────────────────────────────────────────────────────────
  Tokens saved:  ~154.2K
  Tools pruned:   47
  Sessions:       12
```

**Statistics Meaning**:

| Statistic | Source | Description |
|--- | --- | ---|
| **Session** | Current memory state | Pruning effectiveness for current session |
| **All-time** | All persistent files | Cumulative effectiveness across all historical sessions |

::: info How All-time Statistics are Calculated

DCP traverses all JSON files under `~/.local/share/opencode/storage/plugin/dcp/` directory, accumulating:
- `totalPruneTokens`: Total tokens saved across all sessions
- `toolIds.length`: Total tools pruned across all sessions
- File count: Total number of sessions

This way you can see DCP's overall effectiveness during long-term usage.
:::

### Step 4: Understand Auto-Save Mechanism

**Why**
Knowing when DCP saves state prevents accidental data loss

DCP automatically saves state to disk at the following times:

| Trigger | Saved Content | Call Location |
|--- | --- | ---|
| After AI calls `discard`/`extract` tools | Updated pruning state + stats | `lib/strategies/tools.ts:148-150` |
| After user executes `/dcp sweep` command | Updated pruning state + stats | `lib/commands/sweep.ts:234-236` |
| After pruning operations complete | Async save, doesn't block main flow | `saveSessionState()` |

**Save Process**:

```typescript
// 1. Update memory state
state.stats.totalPruneTokens += state.stats.pruneTokenCounter
state.stats.pruneTokenCounter = 0

// 2. Async save to disk
await saveSessionState(state, logger)
```

::: tip Benefits of Async Saving

DCP uses async saving mechanism to ensure pruning operations are not blocked by disk I/O. Even if saving fails (e.g., insufficient disk space), it won't affect pruning effectiveness in the current session.

On failure, a warning is logged to `~/.config/opencode/logs/dcp/`.
:::

### Step 5: Understand Auto-Load Mechanism

**Why**
Knowing when DCP loads persistent state helps understand session switching behavior

DCP automatically loads persistent state at the following times:

| Trigger | Loaded Content | Call Location |
|--- | --- | ---|
| When OpenCode starts or switches sessions | Historical pruning state + stats for that session | `lib/state/state.ts:104` (inside `ensureSessionInitialized` function) |

**Load Process**:

```typescript
// 1. Detect session ID change
if (state.sessionId !== lastSessionId) {
    await ensureSessionInitialized(client, state, lastSessionId, logger, messages)
}

// 2. Reset memory state
resetSessionState(state)
state.sessionId = lastSessionId

// 3. Load persistent state from disk
const persisted = await loadSessionState(sessionId, logger)
if (persisted) {
    state.prune = { toolIds: persisted.prune.toolIds }
    state.stats = {
        pruneTokenCounter: persisted.stats.pruneTokenCounter,
        totalPruneTokens: persisted.stats.totalPruneTokens
    }
}
```

**You should see**: After switching to a previous session, historical statistics displayed by `/dcp stats` remain unchanged

### Step 6: Understanding State Cleanup During Context Compression

**Why**
Understand how DCP handles state when OpenCode automatically compresses context

When OpenCode detects that the conversation is too long, it automatically generates a summary message to compress the context. DCP detects this compression and clears related state.

```typescript
// Handling when summary message is detected
if (lastCompactionTimestamp > state.lastCompaction) {
    state.lastCompaction = lastCompactionTimestamp
    state.toolParameters.clear()  // Clear tool cache
    state.prune.toolIds = []       // Clear pruning state
    logger.info("Detected compaction from messages - cleared tool cache")
}
```

::: info Why Clearing is Needed

OpenCode's summary message compresses the entire conversation history, at which point:
- Old tool calls have been merged into the summary
- Keeping the tool ID list becomes meaningless (tools no longer exist)
- Clearing state avoids references to invalid tool IDs

This is a design tradeoff: sacrificing some pruning history to ensure state consistency.
:::

## Checkpoint ✅

Confirm you understand these key points:

- [ ] DCP's persistent files are stored in `~/.local/share/opencode/storage/plugin/dcp/`
- [ ] Each session corresponds to one `{sessionId}.json` file
- [ ] Persistent content includes pruning state (toolIds) and statistics (totalPruneTokens)
- [ ] "All-time" statistics in `/dcp stats` come from accumulation of all persistent files
- [ ] Auto async save after pruning operations, doesn't block main flow
- [ ] Auto load historical state for that session when switching sessions
- [ ] Clear tool cache and pruning state when OpenCode summary message is detected

## Common Pitfalls

### ❌ Accidentally Deleting Persistent Files

**Problem**: Manually deleted files under `~/.local/share/opencode/storage/plugin/dcp/` directory

**Consequences**:
- Historical pruning state lost
- Cumulative statistics reset to zero
- But doesn't affect current session's pruning functionality

**Solution**: Start using again, DCP will automatically create new persistent files

### ❌ Sub-Agent State Not Visible

**Problem**: Pruned tools in a sub-agent, but can't see these pruning records when returning to the main agent

**Reason**: Sub-agents have independent `sessionId`, and pruning state is persisted to independent files. When switching back to the main agent, due to different `sessionId`, the sub-agent's persistent state is not loaded

**Solution**: This is design behavior. Sub-agent session states are independent and not shared with the main agent. If you want to count all pruning records (including sub-agents), you can use `/dcp stats`' "All-time" statistics (it will accumulate data from all persistent files)

### ❌ Insufficient Disk Space Causes Save Failure

**Problem**: "All-time" statistics shown by `/dcp stats` not increasing

**Reason**: Possibly insufficient disk space causing save failure

**Solution**: Check log file `~/.config/opencode/logs/dcp/` to see if there's a "Failed to save session state" error

## Lesson Summary

**Core Value of State Persistence**:

1. **Cross-Session Memory**: Remember which tools have been pruned, avoiding duplicate work
2. **Cumulative Statistics**: Long-term tracking of DCP's token savings effectiveness
3. **Restart Recovery**: Continue previous work after OpenCode restarts

**Data Flow Summary**:

```
Pruning operations → Update memory state → Async save to disk
                ↑
Session switch → Load from disk → Restore memory state
                ↑
Context compression → Clear memory state (don't delete disk files)
```

**Key Takeaways**:

- Persistence is local file operation, doesn't affect pruning performance
- "All-time" in `/dcp stats` comes from accumulation of all historical sessions
- Sub-agent sessions are not persisted, this is design behavior
- Cache is cleared during context compression to ensure state consistency

## Coming Up Next

> In the next lesson, we'll learn **[Prompt Caching Impact](/Opencode-DCP/opencode-dynamic-context-pruning/advanced/prompt-caching/)**
>
> You'll learn:
> - How DCP pruning affects Prompt Caching
> - How to balance cache hit rate and token savings
> - Understand Anthropic's caching billing mechanism

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Line Number |
|--- | --- | ---|
| Persistence interface definition | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 14-19 |
| Save session state | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 33-66 |
| Load session state | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 68-101 |
| Load all session statistics | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 109-146 |
| Storage directory constant | [`lib/state/persistence.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/persistence.ts) | 21 |
| Session state initialization | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 80-116 |
| Detect context compression | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts) | 118-126 |
| Statistics command handling | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| Pruning tools save state | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts) | 144-150 |

**Key Constants**:
- `STORAGE_DIR = ~/.local/share/opencode/storage/plugin/dcp`: Root directory for persistent file storage

**Key Functions**:
- `saveSessionState(state, logger)`: Async save session state to disk
- `loadSessionState(sessionId, logger)`: Load specified session state from disk
- `loadAllSessionStats(logger)`: Aggregate statistics from all sessions
- `ensureSessionInitialized(client, state, sessionId, logger, messages)`: Ensure session is initialized, loads persistent state

**Key Interfaces**:
- `PersistedSessionState`: Structure definition for persistent state
- `AggregatedStats`: Structure definition for cumulative statistics data

</details>
