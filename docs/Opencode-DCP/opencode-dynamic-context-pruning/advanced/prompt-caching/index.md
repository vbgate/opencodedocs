---
title: "Prompt Caching: Cache vs Savings | opencode-dynamic-context-pruning"
sidebarTitle: "Prompt Caching"
subtitle: "Prompt Caching: Cache vs Savings | opencode-dynamic-context-pruning"
description: "Learn how DCP affects Prompt Caching and balance cache hit rate vs token savings. Compare 65% vs 85% rates, understand billing models for Anthropic, OpenAI, GitHub Copilot."
tags:
  - "advanced"
  - "prompt-caching"
  - "token-optimization"
  - "cost-optimization"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
  - "platforms-llm-tools"
order: 3
---

# Prompt Caching Impact: Balancing Cache Hit Rate and Token Savings

## What You'll Learn

- Understand how LLM providers' Prompt Caching mechanisms work
- Know why DCP pruning affects cache hit rate
- Learn how to trade off cache loss against token savings
- Develop optimal strategies based on your provider and billing model

## Your Current Challenge

After enabling DCP, you noticed the cache hit rate dropped from 85% to 65%, and you're worried this might increase costs. Or you want to understand whether using DCP with different LLM providers (Anthropic, OpenAI, GitHub Copilot) will have different impacts.

DCP's pruning operation modifies message content, which affects Prompt Caching. But is this trade-off worth it? Let's dive deep into the analysis.

## When to Use This

- Long sessions where context bloat becomes significant
- Using request-based billing providers (like GitHub Copilot, Google Antigravity)
- Want to reduce context pollution and improve model response quality
- The value of token savings outweighs cache hit rate loss

## Core Concepts

**What is Prompt Caching**

**Prompt Caching** is a technology provided by LLM providers (such as Anthropic, OpenAI) to optimize performance and cost. It's based on **exact prefix matching** to cache processed prompts, so identical prompt prefixes won't recalculate tokens.

::: info Caching Mechanism Example

Suppose you have the following conversation history:

```
[System prompt]
[User message 1]
[AI response 1 + tool call A]
[User message 2]
[AI response 2 + tool call A]  ← Same tool call
[User message 3]
```

Without caching, every send to the LLM requires recalculating all tokens. With caching, on the second send, the provider can reuse previously computed results, only calculating the new "User message 3" portion.

:::

**How DCP Affects Caching**

When DCP prunes tool output, it replaces the tool's original output content with a placeholder text: `"[Output removed to save context - information superseded or no longer needed]"`

This operation changes the exact content of the message (originally full tool output, now a placeholder), causing **cache invalidation**—the cached prefix from that point onward can no longer be reused.

**Trade-off Analysis**

| Metric | Without DCP | With DCP | Impact |
|--- | --- | --- | ---|
| **Cache Hit Rate** | ~85% | ~65% | ⬇️ Decrease by 20% |
| **Context Size** | Continuously growing | Controlled pruning | ⬇️ Significantly reduced |
| **Token Savings** | 0 | 10-40% | ⬆️ Significantly increased |
| **Response Quality** | May decrease | More stable | ⬆️ Improved (reduced context pollution) |

::: tip Why might cost be lower despite lower cache hit rate?

The decline in cache hit rate doesn't equal increased cost. Reasons:

1. **Token savings typically exceed cache loss**: In long sessions, tokens saved by DCP pruning (10-40%) often exceed additional token calculations from cache invalidation
2. **Reduced context pollution**: After removing redundant content, the model can focus better on current tasks, yielding higher response quality
3. **Absolute cache hit rate remains high**: Even at 65%, nearly 2/3 of content can still be cached

Test data shows DCP's token savings are more significant in most cases.

:::

## Impact of Different Billing Models

### Request-Based Billing (GitHub Copilot, Google Antigravity)

**Best use case**, no negative impact.

These providers charge per request, not by token count. Therefore:

- ✅ Tokens saved by DCP pruning don't directly affect costs
- ✅ Reducing context size can improve response speed
- ✅ Cache invalidation doesn't add extra costs

::: info GitHub Copilot and Google Antigravity

Both platforms charge per request. DCP is a **zero-cost optimization**—even if cache hit rate drops, it won't increase costs and can improve performance.

:::

### Token-Based Billing (Anthropic, OpenAI)

Need to weigh cache loss against token savings.

**Calculation Example**:

Assume a long session with 100 messages, total tokens of 100K:

| Scenario | Cache Hit Rate | Cache-Saved Tokens | DCP Pruning-Saved Tokens | Total Savings |
|--- | --- | --- | --- | ---|
| Without DCP | 85% | 85K × (1-0.85) = 12.75K | 0 | 12.75K |
| With DCP | 65% | 100K × (1-0.65) = 35K | 20K (estimated) | 35K + 20K - 12.75K = **42.25K** |

After DCP pruning, although cache hit rate drops, due to 20K tokens reduced from context, actual total savings are greater.

::: warning Significant advantage in long sessions

In long sessions, DCP's advantage is more obvious:

- **Short sessions** (< 10 messages): Cache invalidation may dominate, with limited benefits
- **Long sessions** (> 30 messages): Context bloat is severe, and tokens saved by DCP pruning far exceed cache loss

Recommendation: Prioritize enabling DCP in long sessions; you can disable it for short sessions.

:::

## Observation and Verification

### Step 1: Observe Cache Token Usage

**Why**
Understand the proportion of cached tokens in total tokens to evaluate the importance of caching

```bash
# Execute in OpenCode
/dcp context
```

**You should see**: Token analysis like this

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Key Metrics Interpretation**:

| Metric | Meaning | How to Evaluate |
|--- | --- | ---|
| **Pruned** | Number of pruned tools and token count | Higher means DCP saves more |
| **Current context** | Total tokens in current session context | Should be significantly smaller than Without DCP |
| **Without DCP** | How large context would be without DCP | Used to compare savings effect |

### Step 2: Compare With/Without DCP

**Why**
Intuitively feel the difference in caching and token savings through comparison

```bash
# 1. Disable DCP (set enabled: false in config)
# Or temporarily disable:
/dcp sweep 999  # Prune all tools, observe cache effect

# 2. Have a few conversations

# 3. View statistics
/dcp stats

# 4. Re-enable DCP
# (Modify config or restore default values)

# 5. Continue conversations, compare statistics
/dcp stats
```

**You should see**:

Use `/dcp context` to observe changes in key metrics:

| Metric | Without DCP | With DCP | Explanation |
|--- | --- | --- | ---|
| **Pruned** | 0 tools | 5-20 tools | Number of tools pruned by DCP |
| **Current context** | Larger | Smaller | Context significantly reduced after DCP |
| **Without DCP** | Same as Current | Greater than Current | Shows DCP's savings potential |

::: tip Practical testing recommendations

Test in different session types:

1. **Short sessions** (5-10 messages): Observe whether caching is more important
2. **Long sessions** (30+ messages): Observe whether DCP's savings are more obvious
3. **Repeated reads**: Scenarios with frequent reads of the same file

This helps you make the best choice based on your actual usage patterns.

:::

### Step 3: Understand Context Pollution Impact

**Why**
DCP pruning not only saves tokens but also reduces context pollution, improving response quality

::: info What is context pollution?

**Context pollution** refers to excessive redundant, irrelevant, or outdated information filling conversation history, causing:

- Model attention scattered, difficult to focus on current tasks
- May reference old data (like modified file contents)
- Decreased response quality, requiring more tokens to "understand" context

DCP reduces this pollution by removing completed tool outputs, duplicate read operations, etc.

:::

**Actual effect comparison**:

| Scenario | Without DCP | With DCP |
|--- | --- | ---|
| Read the same file 3 times | Keep 3 complete outputs (redundant) | Keep only the latest one |
| Re-read after writing to file | Old write + new read | Keep only new read |
| Error tool output | Keep complete error input | Keep only error message |

After reducing context pollution, the model can more accurately understand current state, reducing "hallucination" or referencing outdated data.

## Best Practices

### Choose Strategy Based on Provider

| Provider | Billing Model | Recommendation | Reason |
|--- | --- | --- | ---|
| **GitHub Copilot** | Per request | ✅ Always enable | Zero-cost optimization, only improves performance |
| **Google Antigravity** | Per request | ✅ Always enable | Same as above |
| **Anthropic** | Per token | ✅ Enable for long sessions<br>⚠️ Optional for short sessions | Weigh caching vs savings |
| **OpenAI** | Per token | ✅ Enable for long sessions<br>⚠️ Optional for short sessions | Same as above |

### Adjust Configuration Based on Session Type

```jsonc
// ~/.config/opencode/dcp.jsonc or project config

{
  // Long sessions (> 30 messages): Enable all strategies
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": true },  // Recommended to enable
    "purgeErrors": { "enabled": true }
  },

  // Short sessions (< 10 messages): Only enable deduplication
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": false },
    "purgeErrors": { "enabled": false }
  }
}
```

**Strategy Explanation**:

- **deduplication**: Small impact, recommended to always enable
- **supersedeWrites**: Medium impact, recommended for long sessions
- **purgeErrors**: Small impact, recommended to enable

### Dynamic Strategy Adjustment

Use `/dcp context` to observe token composition and pruning effect:

```bash
# If Pruned value is high, DCP is actively saving tokens
# Compare Current context and Without DCP to evaluate savings effect

/dcp context
```

## Checkpoint ✅

Confirm you understand the following points:

- [ ] Prompt Caching is based on exact prefix matching; message content changes invalidate cache
- [ ] DCP pruning changes message content, causing cache hit rate to drop (~20%)
- [ ] In long sessions, token savings typically exceed cache loss
- [ ] GitHub Copilot and Google Antigravity use request-based billing; DCP is zero-cost optimization
- [ ] Anthropic and OpenAI use token-based billing; need to weigh caching vs savings
- [ ] Use `/dcp context` to observe token composition and pruning effect
- [ ] Dynamically adjust strategy configuration based on session length

## Pitfalls

### ❌ Thinking cache hit rate drop equals cost increase

**Problem**: Seeing cache hit rate drop from 85% to 65%, assuming costs will increase

**Cause**: Only focused on cache hit rate, ignored token savings and context reduction effects

**Solution**: Use `/dcp context` to view actual data, focusing on:
1. Tokens saved by DCP pruning (`Pruned`)
2. Current context size (`Current context`)
3. Theoretical size without pruning (`Without DCP`)

By comparing `Without DCP` and `Current context`, you can see the actual number of tokens saved by DCP.

### ❌ Over-aggressive pruning in short sessions

**Problem**: Short sessions with 5-10 messages, enabled all strategies, cache invalidation is obvious

**Cause**: Context bloat is not severe in short sessions; aggressive pruning has small benefits

**Solution**:
- For short sessions, only enable `deduplication` and `purgeErrors`
- Disable `supersedeWrites` strategy
- Or completely disable DCP (`enabled: false`)

### ❌ Ignoring billing model differences between providers

**Problem**: Worried about cache invalidation increasing costs on GitHub Copilot

**Cause**: Didn't notice Copilot uses request-based billing; cache invalidation doesn't add costs

**Solution**:
- Copilot and Antigravity: Always enable DCP
- Anthropic and OpenAI: Adjust strategies based on session length

### ❌ Making decisions without observing actual data

**Problem**: Judging whether to enable DCP based on feeling

**Cause**: Didn't use `/dcp context` and `/dcp stats` to observe actual effects

**Solution**:
- Collect data across different sessions
- Compare differences with/without DCP
- Make choices based on your own usage patterns

## Summary

**Core Mechanism of Prompt Caching**:

- LLM providers cache prompts based on **exact prefix matching**
- DCP pruning changes message content, causing cache invalidation
- Cache hit rate drops (~20%), but token savings are more significant

**Trade-off Decision Matrix**:

| Scenario | Recommended Configuration | Reason |
|--- | --- | ---|
| GitHub Copilot/Google Antigravity | ✅ Always enable | Request-based billing, zero-cost optimization |
| Anthropic/OpenAI long sessions | ✅ Enable all strategies | Token savings > cache loss |
| Anthropic/OpenAI short sessions | ⚠️ Only enable deduplication + purge errors | Caching is more important |

**Key Takeaways**:

1. **Cache hit rate drop doesn't equal cost increase**: Need to look at total token savings
2. **Provider billing models affect strategy**: Request-based vs token-based
3. **Dynamically adjust based on session length**: Long sessions benefit more
4. **Use tools to observe data**: `/dcp context` and `/dcp stats`

**Best Practices Summary**:

```
1. Confirm your provider and billing model
2. Adjust strategy configuration based on session length
3. Regularly use /dcp context to observe effects
4. Prioritize token savings in long sessions
5. Prioritize cache hit rate in short sessions
```

## Next Lesson Preview

> Next lesson: **[Subagent Handling](/Opencode-DCP/opencode-dynamic-context-pruning/advanced/subagent-handling/)**.
>
> You'll learn:
> - How DCP detects subagent sessions
> - Why subagents don't participate in pruning
> - How pruning results in subagents are passed to the main agent

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Prompt Caching explanation | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 46-52 |
| Token calculation (including cache) | [`lib/messages/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/utils.ts) | 66-78 |
| Context analysis command | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |
| Cache token calculation | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 106-107 |
| Logging cache tokens | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts) | 141 |
| Pruning placeholder definition | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 6-7 |
| Tool output pruning | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 22-46 |

**Key Constants**:
- None

**Key Functions**:
- `calculateTokens(messages, tokenizer)`: Calculate message token count, including cache.read and cache.write
- `buildSessionContext(messages)`: Build session context analysis, distinguishing System/User/Assistant/Tools
- `formatContextAnalysis(analysis)`: Format context analysis output

**Key Types**:
- `TokenCounts`: Token counting structure, including input/output/reasoning/cache

**Caching Mechanism Explanation** (from README):
- Anthropic and OpenAI cache prompts based on exact prefix matching
- DCP pruning changes message content, causing cache invalidation
- With DCP enabled, cache hit rate is approximately 65%; without DCP, approximately 85%
- Best use case: Request-based billing providers (GitHub Copilot, Google Antigravity) have no negative impact

</details>
