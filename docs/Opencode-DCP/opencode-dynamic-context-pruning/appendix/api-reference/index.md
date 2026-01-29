---
title: "API Reference: Plugin Development | opencode-dynamic-context-pruning"
sidebarTitle: "API Reference"
subtitle: "API Reference: Plugin Development | opencode-dynamic-context-pruning"
description: "Master DCP plugin APIs with comprehensive reference. Learn plugin entry functions, configuration interfaces, tools, hooks, and session state management."
tags:
  - "API"
  - "Plugin Development"
  - "Interface Reference"
prerequisite:
  - "start-configuration"
order: 3
---

# DCP API Reference

## What You'll Learn

This section provides a complete API reference for DCP plugin developers, enabling you to:

- Understand DCP's plugin entry and hook mechanism
- Master configuration interfaces and the purpose of all configuration options
- Learn specifications for discard and extract tools
- Use state management APIs for session state operations

## Core Concepts

DCP plugins are built on the OpenCode Plugin SDK, implementing context pruning functionality by registering hooks, tools, and commands.

**Plugin Lifecycle**:

```
1. OpenCode loads plugin
    ↓
2. Plugin function executes
    ↓
3. Registers hooks, tools, commands
    ↓
4. OpenCode calls hooks to process messages
    ↓
5. Plugin executes pruning logic
    ↓
6. Returns modified messages
```

---

## Plugin Entry API

### Plugin Function

The main entry function for DCP, returning a plugin configuration object.

**Signature**:

```typescript
import type { Plugin } from "@opencode-ai/plugin"

const plugin: Plugin = (async (ctx) => {
    // Plugin initialization logic
    return {
        // Registered hooks, tools, commands
    }) satisfies Plugin

export default plugin
```

**Parameters**:

| Parameter | Type | Description |
|--- | --- | ---|
| ctx | `PluginInput` | OpenCode plugin context, containing client and directory information |

**Return Value**:

Plugin configuration object, containing the following fields:

| Field | Type | Description |
|--- | --- | ---|
| `experimental.chat.system.transform` | `Handler` | System prompt injection hook |
| `experimental.chat.messages.transform` | `Handler` | Message transformation hook |
| `chat.message` | `Handler` | Message capture hook |
| `command.execute.before` | `Handler` | Command execution hook |
| `tool` | `Record<string, Tool>` | Registered tool mapping |
| `config` | `ConfigHandler` | Configuration mutation hook |

**Source Location**: [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102)

---

## Configuration API

### PluginConfig Interface

Complete configuration type definition for DCP.

```typescript
export interface PluginConfig {
    enabled: boolean
    debug: boolean
    pruneNotification: "off" | "minimal" | "detailed"
    commands: Commands
    turnProtection: TurnProtection
    protectedFilePatterns: string[]
    tools: Tools
    strategies: {
        deduplication: Deduplication
        supersedeWrites: SupersedeWrites
        purgeErrors: PurgeErrors
    }
}
```

**Source Location**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L53-L66)

### Configuration Options Details

#### Top-Level Configuration

| Option | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Whether to enable the plugin |
| `debug` | `boolean` | `false` | Whether to enable debug logs, logs written to `~/.config/opencode/logs/dcp/` |
| `pruneNotification` | `"off" \| "minimal" \| "detailed"` | `"detailed"` | Notification display mode |
| `protectedFilePatterns` | `string[]` | `[]` | File protection glob pattern list, matching files will not be pruned |

#### Commands Configuration

```typescript
export interface Commands {
    enabled: boolean
    protectedTools: string[]
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Whether to enable `/dcp` commands |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Command-protected tool list, these tools will not be pruned by `/dcp sweep` |

#### TurnProtection Configuration

```typescript
export interface TurnProtection {
    enabled: boolean
    turns: number
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | Whether to enable turn protection |
| `turns` | `number` | `4` | Number of turns to protect, tools from the most recent N turns will not be pruned |

#### Tools Configuration

```typescript
export interface Tools {
    settings: ToolSettings
    discard: DiscardTool
    extract: ExtractTool
}
```

**ToolSettings**:

```typescript
export interface ToolSettings {
    nudgeEnabled: boolean
    nudgeFrequency: number
    protectedTools: string[]
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `nudgeEnabled` | `boolean` | `true` | Whether to enable AI reminders |
| `nudgeFrequency` | `number` | `10` | Reminder frequency, remind AI to use pruning tools every N tool results |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Tool protection list |

**DiscardTool**:

```typescript
export interface DiscardTool {
    enabled: boolean
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Whether to enable discard tool |

**ExtractTool**:

```typescript
export interface ExtractTool {
    enabled: boolean
    showDistillation: boolean
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Whether to enable extract tool |
| `showDistillation` | `boolean` | `false` | Whether to display extracted content in notifications |

#### Strategies Configuration

**Deduplication**:

```typescript
export interface Deduplication {
    enabled: boolean
    protectedTools: string[]
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Whether to enable deduplication strategy |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Tool list not participating in deduplication |

**SupersedeWrites**:

```typescript
export interface SupersedeWrites {
    enabled: boolean
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `false` | Whether to enable supersede writes strategy |

**PurgeErrors**:

```typescript
export interface PurgeErrors {
    enabled: boolean
    turns: number
    protectedTools: string[]
}
```

| Field | Type | Default | Description |
|--- | --- | --- | ---|
| `enabled` | `boolean` | `true` | Whether to enable error purge strategy |
| `turns` | `number` | `4` | Error purge threshold (number of turns) |
| `protectedTools` | `string[]` | `[...DEFAULT_PROTECTED_TOOLS]` | Tool list not participating in purge |

### getConfig Function

Load and merge multi-level configurations.

```typescript
export function getConfig(ctx: PluginInput): PluginConfig
```

**Parameters**:

| Parameter | Type | Description |
|--- | --- | ---|
| ctx | `PluginInput` | OpenCode plugin context |

**Return Value**:

Merged configuration object, priority from high to low:

1. Project configuration (`.opencode/dcp.jsonc`)
2. Environment variable configuration (`$OPENCODE_CONFIG_DIR/dcp.jsonc`)
3. Global configuration (`~/.config/opencode/dcp.jsonc`)
4. Default configuration (defined in code)

**Source Location**: [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797)

---

## Tool API

### createDiscardTool

Create discard tool for removing completed tasks or noise tool outputs.

```typescript
export function createDiscardTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parameters**:

| Parameter | Type | Description |
|--- | --- | ---|
| ctx | `PruneToolContext` | Tool context, containing client, state, logger, config, workingDirectory |

**Tool Specification**:

| Field | Type | Description |
|--- | --- | ---|
| `ids` | `string[]` | First element is reason (`'completion'` or `'noise'`), followed by numeric IDs |

**Source Location**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181)

### createExtractTool

Create extract tool for extracting key findings and deleting original tool outputs.

```typescript
export function createExtractTool(ctx: PruneToolContext): ReturnType<typeof tool>
```

**Parameters**:

| Parameter | Type | Description |
|--- | --- | ---|
| ctx | `PruneToolContext` | Tool context, containing client, state, logger, config, workingDirectory |

**Tool Specification**:

| Field | Type | Description |
|--- | --- | ---|
| `ids` | `string[]` | Numeric ID array |
| `distillation` | `string[]` | Extracted content array, length matches ids |

**Source Location**: [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220)

---

## State API

### SessionState Interface

Session state object, managing runtime state for a single session.

```typescript
export interface SessionState {
    sessionId: string | null
    isSubAgent: boolean
    prune: Prune
    stats: SessionStats
    toolParameters: Map<string, ToolParameterEntry>
    nudgeCounter: number
    lastToolPrune: boolean
    lastCompaction: number
    currentTurn: number
    variant: string | undefined
}
```

**Field Descriptions**:

| Field | Type | Description |
|--- | --- | ---|
| `sessionId` | `string \| null` | OpenCode session ID |
| `isSubAgent` | `boolean` | Whether this is a sub-agent session |
| `prune` | `Prune` | Pruning state |
| `stats` | `SessionStats` | Statistics data |
| `toolParameters` | `Map<string, ToolParameterEntry>` | Tool call cache (callID → metadata) |
| `nudgeCounter` | `number` | Cumulative tool call count (used to trigger reminders) |
| `lastToolPrune` | `boolean` | Whether the last operation was a pruning tool |
| `lastCompaction` | `number` | Last context compaction timestamp |
| `currentTurn` | `number` | Current turn number |
| `variant` | `string \| undefined` | Model variant (e.g., claude-3.5-sonnet) |

**Source Location**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L27-L38)

### SessionStats Interface

Session-level token pruning statistics.

```typescript
export interface SessionStats {
    pruneTokenCounter: number
    totalPruneTokens: number
}
```

**Field Descriptions**:

| Field | Type | Description |
|--- | --- | ---|
| `pruneTokenCounter` | `number` | Pruned token count in current session (cumulative) |
| `totalPruneTokens` | `number` | Historical cumulative pruned token count |

**Source Location**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L18-L21)

### Prune Interface

Pruning state object.

```typescript
export interface Prune {
    toolIds: string[]
}
```

**Field Descriptions**:

| Field | Type | Description |
|--- | --- | ---|
| `toolIds` | `string[]` | List of tool call IDs marked for pruning |

**Source Location**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L23-L25)

### ToolParameterEntry Interface

Metadata cache for a single tool call.

```typescript
export interface ToolParameterEntry {
    tool: string
    parameters: any
    status?: ToolStatus
    error?: string
    turn: number
}
```

**Field Descriptions**:

| Field | Type | Description |
|--- | --- | ---|
| `tool` | `string` | Tool name |
| `parameters` | `any` | Tool parameters |
| `status` | `ToolStatus \| undefined` | Tool execution status |
| `error` | `string \| undefined` | Error message (if any) |
| `turn` | `number` | Turn number when this call was created |

**ToolStatus Enum**:

```typescript
export type ToolStatus = "pending" | "running" | "completed" | "error"
```

**Source Location**: [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L10-L16)

### createSessionState

Create a new session state object.

```typescript
export function createSessionState(): SessionState
```

**Return Value**: Initialized SessionState object

---

## Hook API

### createSystemPromptHandler

Create system prompt injection hook handler.

```typescript
export function createSystemPromptHandler(
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parameters**:

| Parameter | Type | Description |
|--- | --- | ---|
| state | `SessionState` | Session state object |
| logger | `Logger` | Logger system instance |
| config | `PluginConfig` | Configuration object |

**Behavior**:

- Check if this is a sub-agent session, skip if true
- Check if this is an internal agent (e.g., summary generator), skip if true
- Load the corresponding prompt template based on configuration (both/discard/extract)
- Inject pruning tool descriptions into the system prompt

**Source Location**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53)

### createChatMessageTransformHandler

Create message transformation hook handler, execute automatic pruning logic.

```typescript
export function createChatMessageTransformHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
): Handler
```

**Parameters**:

| Parameter | Type | Description |
|--- | --- | ---|
| client | `any` | OpenCode client instance |
| state | `SessionState` | Session state object |
| logger | `Logger` | Logger system instance |
| config | `PluginConfig` | Configuration object |

**Processing Flow**:

1. Check session state (whether it's a sub-agent)
2. Sync tool cache
3. Execute automatic strategies (deduplication, supersede writes, purge errors)
4. Prune marked tool contents
5. Inject `<prunable-tools>` list
6. Save context snapshot (if configured)

**Source Location**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82)

### createCommandExecuteHandler

Create command execution hook handler, handle `/dcp` series commands.

```typescript
export function createCommandExecuteHandler(
    client: any,
    state: SessionState,
    logger: Logger,
    config: PluginConfig,
    workingDirectory: string,
): Handler
```

**Parameters**:

| Parameter | Type | Description |
|--- | --- | ---|
| client | `any` | OpenCode client instance |
| state | `SessionState` | Session state object |
| logger | `Logger` | Logger system instance |
| config | `PluginConfig` | Configuration object |
| workingDirectory | `string` | Working directory path |

**Supported Commands**:

- `/dcp` - Display help information
- `/dcp context` - Display current session token usage analysis
- `/dcp stats` - Display cumulative pruning statistics
- `/dcp sweep [n]` - Manually prune tools (optionally specify quantity)

**Source Location**: [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156)

---

## Summary

This section provides a complete API reference for the DCP plugin, covering:

- Plugin entry function and hook registration mechanism
- Configuration interfaces and detailed descriptions of all configuration options
- Specifications and creation methods for discard and extract tools
- Type definitions for session state, statistics, and tool cache
- Hook handlers for system prompts, message transformation, and command execution

If you need to understand the internal implementation details of DCP, we recommend reading the [Architecture Overview](/Opencode-DCP/opencode-dynamic-context-pruning/appendix/architecture/) and [Token Calculation Principles](/Opencode-DCP/opencode-dynamic-context-pruning/appendix/token-calculation/).

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Plugin entry function | [`index.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/index.ts#L12-L102) | 12-102 |
| Configuration interface definition | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L7-L66) | 7-66 |
| getConfig function | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts#L669-L797) | 669-797 |
| Discard tool creation | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L155-L181) | 155-181 |
| Extract tool creation | [`lib/strategies/tools.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/strategies/tools.ts#L183-L220) | 183-220 |
| State type definitions | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts#L1-L39) | 1-39 |
| System prompt hook | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L20-L53) | 20-53 |
| Message transformation hook | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L55-L82) | 55-82 |
| Command execution hook | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts#L84-L156) | 84-156 |

**Key Types**:
- `Plugin`: OpenCode plugin function signature
- `PluginConfig`: DCP configuration interface
- `SessionState`: Session state interface
- `ToolStatus`: Tool status enum (pending | running | completed | error)

**Key Functions**:
- `plugin()`: Plugin entry function
- `getConfig()`: Load and merge configuration
- `createDiscardTool()`: Create discard tool
- `createExtractTool()`: Create extract tool
- `createSessionState()`: Create session state

</details>
