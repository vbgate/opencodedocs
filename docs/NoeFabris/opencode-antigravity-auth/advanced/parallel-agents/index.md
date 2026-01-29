---
title: "PID Offset: Parallel Agents | opencode-antigravity-auth"
sidebarTitle: "PID Offset"
subtitle: "PID Offset: Parallel Agents"
description: "Learn PID offset optimization for parallel agents. Configure account allocation, coordinate strategies, verify effects, and troubleshoot rate limits."
tags:
  - "advanced"
  - "parallel-agents"
  - "pid-offset"
  - "oh-my-opencode"
  - "load-balancing"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
  - "advanced-multi-account-setup"
order: 5
---

# Parallel Agent Optimization: PID Offset and Account Allocation

**PID offset** is a process ID-based account allocation optimization mechanism that calculates an offset via `process.pid % accounts.length`, allowing multiple OpenCode processes or oh-my-opencode parallel agents to prioritize selecting different Google accounts. When multiple processes run concurrently, each process automatically selects a different starting account based on the remainder of its PID, effectively avoiding 429 rate limit errors caused by multiple processes crowding the same account. This significantly improves request success rates and quota utilization in parallel scenarios, making it ideal for developers who need to run multiple Agents or parallel tasks simultaneously.

## What You'll Learn

- Understand account conflicts in parallel agent scenarios
- Enable PID offset functionality to let different processes prioritize different accounts
- Coordinate with round-robin strategy to maximize multi-account utilization
- Troubleshoot rate limit and account selection issues in parallel agents

## Your Current Challenge

When using oh-my-opencode or running multiple OpenCode instances simultaneously, you may encounter:

- Multiple sub-agents using the same account simultaneously, frequently hitting 429 rate limits
- Even with multiple accounts configured, concurrent requests still crowd the same account
- Different processes all start from the first account, causing uneven account allocation
- Long wait times before retrying after request failures

## When to Use This

PID offset functionality is suitable for the following scenarios:

| Scenario | Needs PID Offset? | Reason |
|--- | --- | ---|
| Single OpenCode Instance | ❌ No | Single process, no account conflicts |
| Manual Account Switching | ❌ No | Non-concurrent, sticky strategy is sufficient |
| oh-my-opencode Multiple Agents | ✅ Recommended | Multi-process concurrency, need to distribute accounts |
| Simultaneously Running Multiple OpenCode | ✅ Recommended | Different processes have independent PIDs, automatic distribution |
| CI/CD Parallel Tasks | ✅ Recommended | Each task is an independent process, avoids competition |

::: warning Prerequisites Check
Before starting this tutorial, ensure you have completed:
- ✅ Configured at least 2 Google accounts
- ✅ Understood how account selection strategy works
- ✅ Using oh-my-opencode or need to run multiple OpenCode instances in parallel

[Multi-Account Setup Tutorial](../multi-account-setup/) | [Account Selection Strategies Tutorial](../account-selection-strategies/)
:::

## Core Approach

### What is PID Offset?

**PID (Process ID)** is a unique identifier assigned by the operating system to each process. When multiple OpenCode processes run simultaneously, each process has a different PID.

**PID offset** is a process ID-based account allocation optimization:

```
Assume there are 3 accounts (index: 0, 1, 2):

Process A (PID=123):
  123 % 3 = 0 → Prioritize account 0

Process B (PID=456):
  456 % 3 = 1 → Prioritize account 1

Process C (PID=789):
  789 % 3 = 2 → Prioritize account 2
```

Each process prioritizes a different account based on the remainder of its PID, avoiding crowding the same account from the start.

### Why Do We Need PID Offset?

Without PID offset, all processes start from account 0:

```
Timeline:
T1: Process A starts → Uses account 0
T2: Process B starts → Uses account 0  ← Conflict!
T3: Process C starts → Uses account 0  ← Conflict!
```

With PID offset enabled:

```
Timeline:
T1: Process A starts → PID offset → Uses account 0
T2: Process B starts → PID offset → Uses account 1  ← Distributed!
T3: Process C starts → PID offset → Uses account 2  ← Distributed!
```

### Coordination with Account Selection Strategy

PID offset only takes effect during the fallback phase of the sticky strategy (round-robin and hybrid strategies have their own allocation logic):

| Strategy | PID Offset Effective? | Recommended Scenario |
|--- | --- | ---|
| `sticky` | ✅ Yes | Single process + prompt cache priority |
| `round-robin` | ❌ No | Multi-process/parallel agents, max throughput |
| `hybrid` | ❌ No | Intelligent allocation, health score priority |

**Why Doesn't round-robin Need PID Offset?**

The round-robin strategy itself rotates accounts:

```typescript
// Switch to next account for each request
this.cursor++;
const account = available[this.cursor % available.length];
```

Multiple processes will naturally distribute across different accounts without additional PID offset.

::: tip Best Practice
For parallel agent scenarios, recommended configuration:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // Not needed for round-robin
}
```

Only enable PID offset if you must use sticky or hybrid strategy.
:::

## Follow Along

### Step 1: Confirm Multi-Account Configuration

**Why**
PID offset requires at least 2 accounts to be effective. If there's only 1 account, regardless of the PID remainder, it can only use that account.

**How**

Check current account count:

```bash
opencode auth list
```

You should see at least 2 accounts:

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

If there's only 1 account, add more accounts first:

```bash
opencode auth login
```

Follow the prompts to select `(a)dd new account(s)`.

**You should see**: Account list shows 2 or more accounts.

### Step 2: Configure PID Offset

**Why**
Enable PID offset functionality through configuration file so the plugin considers process ID during account selection.

**How**

Open the OpenCode configuration file:

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

Add or modify the following configuration:

```json
{
  "pid_offset_enabled": true
}
```

Full configuration example (coordinated with sticky strategy):

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**Environment Variable Method** (optional):

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**You should see**: `pid_offset_enabled` set to `true` in configuration file.

### Step 3: Verify PID Offset Effect

**Why**
Verify PID offset is effective by running multiple processes and checking if different processes prioritize different accounts.

**How**

Open two terminal windows and run OpenCode separately:

**Terminal 1**:
```bash
opencode chat
# Send a request, record which account is used (check logs or toast)
```

**Terminal 2**:
```bash
opencode chat
# Send a request, record which account is used
```

Observe account selection behavior:

- ✅ **Expected**: Two terminals prioritize different accounts
- ❌ **Problem**: Both terminals use the same account

If the problem persists, check:

1. Whether configuration is loaded correctly
2. Whether account selection strategy is `sticky` (round-robin doesn't need PID offset)
3. Whether there's only 1 account

Enable debug logs to see detailed account selection process:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

Logs will show:

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**You should see**: Different terminals prioritize different accounts, or logs show PID offset has been applied.

### Step 4: (Optional) Coordinate with round-robin Strategy

**Why**
The round-robin strategy itself rotates accounts and doesn't need PID offset. However, for high-frequency concurrent parallel agents, round-robin is the better choice.

**How**

Modify configuration file:

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

Start multiple oh-my-opencode Agents and observe request distribution:

```
Agent 1 → Account 0 → Account 1 → Account 2 → Account 0 ...
Agent 2 → Account 1 → Account 2 → Account 0 → Account 1 ...
```

Each Agent independently rotates, fully utilizing all accounts' quotas.

**You should see**: Requests evenly distributed across all accounts, each Agent independently rotating.

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Successfully configure at least 2 Google accounts
- [ ] Enable `pid_offset_enabled` in `antigravity.json`
- [ ] When running multiple OpenCode instances, different processes prioritize different accounts
- [ ] Understand why round-robin doesn't need PID offset
- [ ] Use debug logs to view account selection process

## Common Pitfalls

### Problem 1: No Effect After Enabling

**Symptoms**: Configured `pid_offset_enabled: true`, but multiple processes still use the same account.

**Causes**: Account selection strategy might be `round-robin` or `hybrid`, both of which don't use PID offset.

**Solutions**: Switch to `sticky` strategy, or understand that current strategy doesn't need PID offset.

```json
{
  "account_selection_strategy": "sticky",  // Change to sticky
  "pid_offset_enabled": true
}
```

### Problem 2: Only 1 Account

**Symptoms**: After enabling PID offset, all processes still use account 0.

**Causes**: PID offset calculates via `process.pid % accounts.length`, and with only 1 account, the remainder is always 0.

**Solutions**: Add more accounts:

```bash
opencode auth login
# Select (a)dd new account(s)
```

### Problem 3: Prompt Cache Invalidation

**Symptoms**: After enabling PID offset, Anthropic's prompt cache no longer takes effect.

**Causes**: PID offset may cause different processes or sessions to use different accounts, and prompt cache is shared per account. After switching accounts, prompts need to be resent.

**Solutions**: This is expected behavior. If prompt cache is higher priority, disable PID offset and use sticky strategy:

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### Problem 4: oh-my-opencode Multi-Agent Conflicts

**Symptoms**: Even with multiple accounts configured, oh-my-opencode's multiple Agents still frequently encounter 429 errors.

**Causes**: oh-my-opencode might start Agents sequentially, with multiple Agents simultaneously requesting the same account in a short time.

**Solutions**:

1. Use `round-robin` strategy (recommended):

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. Or increase account count to ensure each Agent has an independent account:

```bash
# If there are 3 Agents, recommend at least 5 accounts
opencode auth login
```

## Summary

PID offset functionality optimizes account allocation in multi-process scenarios via process ID (PID):

- **Principle**: Calculate offset via `process.pid % accounts.length`
- **Purpose**: Let different processes prioritize different accounts, avoiding conflicts
- **Limitation**: Only effective under sticky strategy, round-robin and hybrid don't need it
- **Best Practice**: For parallel agent scenarios, recommend round-robin strategy, no PID offset needed

After configuring multiple accounts, choose the appropriate strategy based on your use case:

| Scenario | Recommended Strategy | PID Offset |
|--- | --- | ---|
| Single process, prompt cache priority | sticky | No |
| Multi-process/parallel agents | round-robin | No |
| hybrid strategy + staggered starts | hybrid | Optional |

## Next Lesson Preview

> In the next lesson, we'll learn **[Complete Configuration Guide](../configuration-guide/)**.
>
> You'll learn:
> - Configuration file location and priority
> - Configuration options for model behavior, account rotation, and app behavior
> - Recommended configuration schemes for different scenarios
> - Advanced configuration tuning methods

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| PID Offset Implementation | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| Config Schema Definition | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| Environment Variable Support | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| Config Injection Point | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| Usage Documentation | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| Configuration Guide | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**Key Functions**:
- `getCurrentOrNextForFamily()`: Main account selection function, handles PID offset logic internally
- `process.pid % this.accounts.length`: Core formula for calculating offset

**Key Constants**:
- `sessionOffsetApplied[family]`: Offset application marker per model family (applied only once per session)

</details>
