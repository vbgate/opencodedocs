---
title: "Account Selection: Strategies | opencode-antigravity-auth"
sidebarTitle: "Account Selection"
subtitle: "Account Selection: Strategies"
description: "Learn account selection strategies: sticky, round-robin, hybrid. Choose optimal configuration based on account count to optimize quota utilization and avoid rate limits."
tags:
  - "multi-account"
  - "load-balancing"
  - "configuration"
  - "advanced"
prerequisite:
  - "advanced-multi-account-setup"
order: 1
---

# Account Selection Strategies: sticky, round-robin, hybrid Best Practices

## What You'll Learn

Based on your Google account count and use case, select and configure the appropriate account selection strategy:
- 1 account → Use `sticky` strategy to preserve prompt cache
- 2-3 accounts → Use `hybrid` strategy for intelligent request distribution
- 4+ accounts → Use `round-robin` strategy to maximize throughput

Avoid the awkward situation where "all accounts are rate limited, but actual quota isn't fully utilized."

## Your Current Challenge

You've configured multiple Google accounts, but:
- Unsure which strategy to use for maximizing quota utilization
- Often encounter all accounts being rate limited while some accounts still have unused quota
- In parallel agent scenarios, multiple subprocesses always use the same account, causing rate limits

## Core Approach

### What Are Account Selection Strategies

The Antigravity Auth plugin supports three account selection strategies that determine how to distribute model requests across multiple Google accounts:

| Strategy | Behavior | Use Case |
|--- | --- | ---|
| `sticky` | Keep using the same account unless it's rate limited | Single account, need prompt cache |
| `round-robin` | Rotate to the next available account for each request | Multiple accounts, maximize throughput |
| `hybrid` (default) | Intelligent selection combining health score + Token bucket + LRU | 2-3 accounts, balance performance and stability |

::: info Why Do We Need Strategies?
Google has rate limits for each account. With only one account, frequent requests can easily trigger rate limits. Multiple accounts can distribute requests through rotation or intelligent selection, avoiding excessive quota consumption by a single account.
:::

### How the Three Strategies Work

#### 1. Sticky Strategy

**Core Logic**: Maintain the current account until it's rate limited before switching.

**Pros**:
- Preserves prompt cache, faster response for same context
- Stable account usage pattern, less likely to trigger risk control

**Cons**:
- Uneven multi-account quota utilization
- Cannot use other accounts before rate limit recovery

**Use Cases**:
- Only one account
- Value prompt cache (e.g., long conversations)

#### 2. Round-Robin Strategy

**Core Logic**: Rotate to the next available account for each request, cycling through all accounts.

**Pros**:
- Most even quota utilization
- Maximize concurrent throughput
- Suitable for high-concurrency scenarios

**Cons**:
- Doesn't consider account health, may select accounts that just recovered from rate limits
- Cannot utilize prompt cache

**Use Cases**:
- 4 or more accounts
- Batch tasks requiring maximum throughput
- Parallel agent scenarios (with `pid_offset_enabled`)

#### 3. Hybrid Strategy (Default)

**Core Logic**: Comprehensively consider three factors to select the optimal account:

**Scoring Formula**:
```
Total Score = Health Score × 2 + Token Score × 5 + Freshness Score × 0.1
```

- **Health Score** (0-200): Based on account success/failure history
  - Successful request: +1 point
  - Rate limit: -10 points
  - Other failures (authentication, network): -20 points
  - Initial value: 70 points, minimum 0 points, maximum 100 points
  - Recovers 2 points per hour (even without usage)

- **Token Score** (0-500): Based on Token bucket algorithm
  - Each account max 50 tokens, initial 50 tokens
  - Recovers 6 tokens per minute
  - Each request consumes 1 token
  - Token Score = (current token / 50) × 100 × 5

- **Freshness Score** (0-360): Based on time since last use
  - Longer time since last use = higher score
  - Reaches maximum after 3600 seconds (1 hour)

**Pros**:
- Intelligently avoids accounts with low health
- Token bucket prevents rate limits from dense requests
- LRU (Least Recently Used) gives accounts ample rest time
- Comprehensively considers performance and stability

**Cons**:
- More complex algorithm, less intuitive than round-robin
- Minimal effect with only 2 accounts

**Use Cases**:
- 2-3 accounts (default strategy)
- Need to balance quota utilization and stability

### Quick Reference for Strategy Selection

Based on README and CONFIGURATION.md recommendations:

| Your Setup | Recommended Strategy | Reason |
|--- | --- | ---|
| **1 account** | `sticky` | No rotation needed, preserve prompt cache |
| **2-3 accounts** | `hybrid` (default) | Intelligent rotation, avoid excessive rate limits |
| **4+ accounts** | `round-robin` | Maximize throughput, most even quota utilization |
| **Parallel agents** | `round-robin` + `pid_offset_enabled: true` | Different processes use different accounts |

## 🎒 Prerequisites

::: warning Prerequisites Check
Ensure you've completed:
- [x] Multi-account setup (at least 2 Google accounts)
- [x] Understand [Dual Quota System](/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)
:::

## Follow Along

### Step 1: Check Current Configuration

**Why**
First understand the current configuration state to avoid duplicate modifications.

**How**

Check your plugin configuration file:

```bash
cat ~/.config/opencode/antigravity.json
```

**You should see**:
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

If the file doesn't exist, the plugin uses default configuration (`account_selection_strategy` = `"hybrid"`).

### Step 2: Configure Strategy Based on Account Count

**Why**
Different account counts suit different strategies. Choosing the wrong strategy may lead to quota waste or frequent rate limits.

::: code-group

```bash [1 Account - Sticky Strategy]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3 Accounts - Hybrid Strategy (default)]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+ Accounts - Round-Robin Strategy]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**You should see**: Configuration file updated to the corresponding strategy.

### Step 3: Enable PID Offset (Parallel Agents Scenario)

**Why**
If you use plugins like oh-my-opencode to generate parallel agents, multiple subprocesses may initiate requests simultaneously. By default, they all start selecting from the same starting account, causing account competition and rate limits.

**How**

Modify configuration to add PID offset:

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**You should see**: `pid_offset_enabled` set to `true`.

**How It Works**:
- Each process calculates offset based on its PID (process ID)
- Offset = `PID % account count`
- Different processes will prioritize using different starting accounts
- Example: With 3 accounts, processes with PIDs 100, 101, 102 use accounts 1, 2, 0 respectively

### Step 4: Verify Strategy Takes Effect

**Why**
Confirm configuration is correct and the strategy works as expected.

**How**

Initiate multiple concurrent requests to observe account switching:

```bash
# Enable debug logging
export OPENCODE_ANTIGRAVITY_DEBUG=1

# Send 5 requests
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**You should see**:
- Logs show different requests using different accounts
- `account-switch` events record account switching

Example log (round-robin strategy):
```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### Step 5: Monitor Account Health Status (Hybrid Strategy)

**Why**
Hybrid strategy selects accounts based on health scores. Understanding health status helps determine if the configuration is reasonable.

**How**

Check health scores in debug logs:

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**You should see**:
```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**Interpretation**:
- Account 0: Health score 85 (excellent)
- Account 1: Health score 60 (usable, but has 2 consecutive failures)
- Account 2: Health score 70 (good)
- Final selection: account 0 with comprehensive score 270.2

## Checkpoint ✅

::: tip How to Verify Configuration Takes Effect?
1. Check configuration file to confirm `account_selection_strategy` value
2. Send multiple requests and observe account switching behavior in logs
3. Hybrid strategy: accounts with lower health scores should be selected less frequently
4. Round-robin strategy: accounts should cycle through with no obvious preference
:::

## Common Pitfalls

### ❌ Account Count Doesn't Match Strategy

**Incorrect Behavior**:
- Only have 2 accounts but use round-robin, causing frequent switching
- Have 5 accounts but use sticky, resulting in uneven quota utilization

**Correct Practice**: Choose strategy according to the quick reference table.

### ❌ Parallel Agents Without PID Offset

**Incorrect Behavior**:
- Multiple parallel agents use the same account simultaneously
- Causes rapid rate limiting

**Correct Practice**: Set `pid_offset_enabled: true`.

### ❌ Ignoring Health Scores (Hybrid Strategy)

**Incorrect Behavior**:
- An account frequently rate limits but is still used at high frequency
- Not utilizing health scores to avoid problematic accounts

**Correct Practice**: Regularly check health scores in debug logs. If abnormalities (e.g., an account has > 5 consecutive failures), consider removing that account or switching strategy.

### ❌ Mixing Dual Quota Pools and Single Quota Strategy

**Incorrect Behavior**:
- Gemini models use `:antigravity` suffix to force using Antigravity quota pool
- Also configured `quota_fallback: false`
- Causes inability to fallback to the other pool when one quota pool is exhausted

**Correct Practice**: Understand the [Dual Quota System](/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/), configure `quota_fallback` based on needs.

## Summary

| Strategy | Core Feature | Use Case |
|--- | --- | ---|
| `sticky` | Keep account until rate limited | 1 account, need prompt cache |
| `round-robin` | Cycle through accounts | 4+ accounts, maximize throughput |
| `hybrid` | Health + Token + LRU intelligent selection | 2-3 accounts, balance performance and stability |

**Key Configurations**:
- `account_selection_strategy`: Set strategy (`sticky` / `round-robin` / `hybrid`)
- `pid_offset_enabled`: Enable for parallel agent scenarios (`true`)
- `quota_fallback`: Gemini dual quota pool fallback (`true` / `false`)

**Verification Methods**:
- Enable debug logging: `OPENCODE_ANTIGRAVITY_DEBUG=1`
- Check account switching logs and health scores
- Observe account indices used by different requests

## Next Lesson Preview

> In the next lesson, we'll learn **[Rate Limit Handling](/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)**.
>
> You'll learn:
> - How to understand different types of 429 errors (quota exhausted, rate limited, capacity exhausted)
> - How automatic retry and backoff algorithms work
> - When to switch accounts and when to wait for reset


---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Account selection strategy entry | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Sticky strategy implementation | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
|--- | --- | ---|
| Hybrid strategy implementation | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| Health scoring system | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Token bucket system | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| LRU selection algorithm | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| PID offset logic | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| Configuration Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | See file |

**Key Constants**:
- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70`: Initial health score for new accounts
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50`: Minimum usable health score for accounts
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50`: Maximum tokens per account
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6`: Tokens regenerated per minute

**Key Functions**:
- `getCurrentOrNextForFamily()`: Select account based on strategy
- `selectHybridAccount()`: Hybrid strategy scoring selection algorithm
- `getScore()`: Get account health score (includes time-based recovery)
- `hasTokens()` / `consume()`: Token bucket check and consume
- `sortByLruWithHealth()`: LRU + health score sorting

</details>
