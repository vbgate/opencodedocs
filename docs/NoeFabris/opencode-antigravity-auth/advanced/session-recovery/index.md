---
title: "Session Recovery: Auto Handle Tool Failures | opencode-antigravity-auth"
sidebarTitle: "Session Recovery"
subtitle: "Session Recovery: Automatically Handle Tool Call Failures and Interruptions"
description: "Learn the session recovery mechanism to automatically handle tool call failures and interruptions. This tutorial covers tool_result_missing error detection, synthetic tool_result injection, thinking_block_order fixes, thinking_disabled_violation recovery, auto_resume configuration, quiet_mode settings, session_recovery toggle, toast notification mechanism, manual recovery steps, and common troubleshooting."
tags:
  - "advanced"
  - "session-recovery"
  - "error-handling"
  - "auto-recovery"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 8
---

# Session Recovery: Automatically Handle Tool Call Failures and Interruptions

## What You'll Learn

- Understand how session recovery automatically handles tool execution interruptions
- Configure session_recovery and auto_resume options
- Troubleshoot tool_result_missing and thinking_block_order errors
- Understand how synthetic tool_result works

## Your Current Challenge

When using OpenCode, you may encounter these interruption scenarios:

- Press ESC during tool execution, causing the session to stall, requiring manual retries
- Thinking block order errors (thinking_block_order), preventing AI from continuing generation
- Incorrectly using thinking features in non-thinking models (thinking_disabled_violation)
- Need to manually repair corrupted session state, wasting time

## When to Use This

Session recovery is suitable for these scenarios:

| Scenario | Error Type | Recovery Method |
|--- | --- | ---|
| ESC interrupts tool | `tool_result_missing` | Auto-inject synthetic tool_result |
| Thinking block order error | `thinking_block_order` | Auto-prepend empty thinking block |
| Non-thinking model uses thinking | `thinking_disabled_violation` | Auto-strip all thinking blocks |
| All above errors | Generic | Auto-fix + auto continue (if enabled) |

::: warning Prerequisites
Before starting this tutorial, make sure you have completed:
- ✅ Installed the opencode-antigravity-auth plugin
- ✅ Can make requests using Antigravity models
- ✅ Understood basic tool call concepts

[Quick Install Tutorial](../../start/quick-install/) | [First Request Tutorial](../../start/first-request/)
:::

## Core Concept

The core mechanism of session recovery:

1. **Error Detection**: Automatically identifies three recoverable error types
   - `tool_result_missing`: Tool execution missing results
   - `thinking_block_order`: Incorrect thinking block order
   - `thinking_disabled_violation`: Non-thinking models禁止 thinking

2. **Auto-Recovery**: Injects synthetic messages based on error type
   - Inject synthetic tool_result (content: "Operation cancelled by user (ESC pressed)")
   - Prepend empty thinking block (thinking blocks must be at message start)
   - Strip all thinking blocks (non-thinking models不允许 thinking)

3. **Auto-Continue**: If `auto_resume` is enabled, automatically sends continue message to restore conversation

4. **Deduplication**: Uses `Set` to prevent the same error from being processed repeatedly

::: info What are synthetic messages?
Synthetic messages are "virtual" messages injected by the plugin to repair corrupted session states. For example, when a tool is interrupted, the plugin injects a synthetic tool_result, telling the AI "this tool has been cancelled", allowing the AI to continue generating new responses.
:::

## Follow Along

### Step 1: Enable Session Recovery (Already Enabled by Default)

**Why**
Session recovery is enabled by default, but if you previously disabled it manually, you need to re-enable it.

**Action**

Edit the plugin configuration file:

```bash
# macOS/Linux
nano ~/.config/opencode/antigravity.json

# Windows
notepad %APPDATA%\opencode\antigravity.json
```

Confirm the following configuration:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "session_recovery": true,
  "auto_resume": false,
  "quiet_mode": false
}
```

**You should see**:

1. `session_recovery` is `true` (default)
2. `auto_resume` is `false` (recommend manual continue to avoid accidental operations)
3. `quiet_mode` is `false` (show toast notifications for better recovery status awareness)

::: tip Configuration Options
- `session_recovery`: Enable/disable session recovery functionality
- `auto_resume`: Automatically send "continue" message (use with caution, may cause unexpected AI execution)
- `quiet_mode`: Hide toast notifications (can be disabled during debugging)
:::

### Step 2: Test tool_result_missing Recovery

**Why**
Verify that session recovery works correctly when tool execution is interrupted.

**Action**

1. Open OpenCode, select a model that supports tool calls (e.g., `google/antigravity-claude-sonnet-4-5`)
2. Enter a task that requires tool calls (e.g., "Help me check files in the current directory")
3. Press `ESC` during tool execution to interrupt

**You should see**:

1. OpenCode immediately stops tool execution
2. Toast notification appears: "Tool Crash Recovery - Injecting cancelled tool results..."
3. AI automatically continues generation without waiting for tool results

::: info How tool_result_missing error works
When you press ESC, OpenCode interrupts tool execution, causing a `tool_use` to appear in the session without a corresponding `tool_result`. The Antigravity API detects this inconsistency and returns a `tool_result_missing` error. The plugin captures this error, injects a synthetic tool_result, and restores the session to a consistent state.
:::

### Step 3: Test thinking_block_order Recovery

**Why**
Verify that session recovery can automatically fix thinking block order errors.

**Action**

1. Open OpenCode, select a thinking-enabled model (e.g., `google/antigravity-claude-opus-4-5-thinking`)
2. Enter a task that requires deep thinking
3. If you encounter "Expected thinking but found text" or "First block must be thinking" errors

**You should see**:

1. Toast notification appears: "Thinking Block Recovery - Fixing message structure..."
2. Session is automatically repaired, AI can continue generation

::: tip Causes of thinking_block_order error
This error is usually caused by:
- Thinking blocks being accidentally stripped (e.g., by other tools)
- Corrupted session state (e.g., disk write failure)
- Format incompatibility during cross-model migration
:::

### Step 4: Test thinking_disabled_violation Recovery

**Why**
Verify that session recovery can automatically strip thinking blocks when thinking features are misused in non-thinking models.

**Action**

1. Open OpenCode, select a model that doesn't support thinking (e.g., `google/antigravity-claude-sonnet-4-5`)
2. If history messages contain thinking blocks

**You should see**:

1. Toast notification appears: "Thinking Strip Recovery - Stripping thinking blocks..."
2. All thinking blocks are automatically removed
3. AI can continue generation

::: warning Thinking Block Loss
Stripping thinking blocks causes AI's thinking content to be lost, which may affect response quality. Please ensure you use thinking features in thinking models.
:::

### Step 5: Configure auto_resume (Optional)

**Why**
After enabling auto_resume, the session automatically sends "continue" after recovery is complete, requiring no manual operation.

**Action**

Set in `antigravity.json`:

```json
{
  "auto_resume": true
}
```

Save the file and restart OpenCode.

**You should see**:

1. After session recovery completes, AI automatically continues generation
2. No need to manually type "continue"

::: danger auto_resume Risks
Auto continue may cause AI to unexpectedly execute tool calls. If you have concerns about tool call safety, it's recommended to keep `auto_resume: false` and manually control recovery timing.
:::

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] See session_recovery configuration in `antigravity.json`
- [ ] See "Tool Crash Recovery" notification when pressing ESC to interrupt tools
- [ ] Session automatically recovers without manual retries
- [ ] Understand how synthetic tool_result works
- [ ] Know when to enable/disable auto_resume

## Common Pitfalls

### Session Recovery Not Triggered

**Symptom**: Encountered an error but no automatic recovery occurred

**Cause**: `session_recovery` is disabled or error type doesn't match

**Solution**:

1. Confirm `session_recovery: true`:

```bash
grep session_recovery ~/.config/opencode/antigravity.json
```

2. Check if the error type is a recoverable error:

```bash
# Enable debug logs to view detailed error information
export DEBUG=session-recovery:*
opencode run "test" --model=google/antigravity-claude-sonnet-4-5
```

3. Check if there are error logs in the console:

```bash
# Log location
~/.config/opencode/antigravity-logs/session-recovery.log
```

### Synthetic tool_result Not Injected

**Symptom**: After tool interruption, AI still waits for tool results

**Cause**: OpenCode's storage path configuration is incorrect

**Solution**:

1. Confirm OpenCode's storage path is correct:

```bash
# View OpenCode configuration
cat ~/.config/opencode/opencode.json | grep storage
```

2. Check if message and part storage directories exist:

```bash
ls -la ~/.local/share/opencode/storage/message/
ls -la ~/.local/share/opencode/storage/part/
```

3. If directories don't exist, check OpenCode's configuration

### Auto Resume Unexpectedly Triggered

**Symptom**: AI automatically continues at inappropriate times

**Cause**: `auto_resume` is set to `true`

**Solution**:

1. Disable auto_resume:

```json
{
  "auto_resume": false
}
```

2. Manually control recovery timing

### Toast Notifications Too Frequent

**Symptom**: Frequent recovery notifications affecting user experience

**Cause**: `quiet_mode` is not enabled

**Solution**:

1. Enable quiet_mode:

```json
{
  "quiet_mode": true
}
```

2. Can be temporarily disabled if debugging is needed

## Summary

- Session recovery automatically handles three recoverable error types: tool_result_missing, thinking_block_order, thinking_disabled_violation
- Synthetic tool_result is the key to repairing session state, with injected content "Operation cancelled by user (ESC pressed)"
- session_recovery is enabled by default, auto_resume is disabled by default (recommend manual control)
- Thinking block recovery (thinking_block_order) prepends an empty thinking block, allowing AI to regenerate thinking content
- Thinking block stripping (thinking_disabled_violation) causes thinking content loss; please ensure you use thinking features in thinking models

## Next Lesson Preview

> In the next lesson, we'll learn **[Request Transformation Mechanism](../request-transformation/)**.
>
> You'll learn:
> - Differences between Claude and Gemini request formats
> - Tool Schema cleanup and transformation rules
> - Thinking block signature injection mechanism
> - Google Search Grounding configuration methods

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Session Recovery Main Logic | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts) | Full |
| Error Type Detection | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L85-L110) | 85-110 |
| tool_result_missing Recovery | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L143-L183) | 143-183 |
| thinking_block_order Recovery | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L188-L217) | 188-217 |
| thinking_disabled_violation Recovery | [`src/plugin/recovery.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery.ts#L222-L240) | 222-240 |
| Storage Utility Functions | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts) | Full |
| Message Reading | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L53-L78) | 53-78 |
| Part Reading | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L84-L104) | 84-104 |
| Prepend Thinking Block | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L233-L256) | 233-256 |
| Strip Thinking Blocks | [`src/plugin/recovery/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/storage.ts#L258-L283) | 258-283 |
| Type Definitions | [`src/plugin/recovery/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/types.ts) | Full |

**Key Constants**:

| Constant Name | Value | Description |
|--- | --- | ---|
| `RECOVERY_RESUME_TEXT` | `"[session recovered - continuing previous task]"` | Recovery text sent during Auto Resume |
| `THINKING_TYPES` | `Set(["thinking", "redacted_thinking", "reasoning"])` | Thinking block type set |
| `META_TYPES` | `Set(["step-start", "step-finish"])` | Metadata type set |
| `CONTENT_TYPES` | `Set(["text", "tool", "tool_use", "tool_result"])` | Content type set |

**Key Functions**:

- `detectErrorType(error: unknown): RecoveryErrorType`: Detects error type, returns `"tool_result_missing"`, `"thinking_block_order"`, `"thinking_disabled_violation"` or `null`
- `isRecoverableError(error: unknown): boolean`: Determines if an error is recoverable
- `createSessionRecoveryHook(ctx, config): SessionRecoveryHook | null`: Creates session recovery hook
- `recoverToolResultMissing(client, sessionID, failedMsg): Promise<boolean>`: Recovers tool_result_missing error
- `recoverThinkingBlockOrder(sessionID, failedMsg, error): Promise<boolean>`: Recovers thinking_block_order error
- `recoverThinkingDisabledViolation(sessionID, failedMsg): Promise<boolean>`: Recovers thinking_disabled_violation error
- `readMessages(sessionID): StoredMessageMeta[]`: Reads all messages in a session
- `readParts(messageID): StoredPart[]`: Reads all parts (parts) of a message
- `prependThinkingPart(sessionID, messageID): boolean`: Prepends empty thinking block at message start
- `stripThinkingParts(messageID): boolean`: Removes all thinking blocks from a message

**Configuration Options** (from schema.ts):

| Option | Type | Default | Description |
|--- | --- | --- | ---|
| `session_recovery` | boolean | `true` | Enable session recovery functionality |
| `auto_resume` | boolean | `false` | Automatically send "continue" message |
| `quiet_mode` | boolean | `false` | Hide toast notifications |

</details>
