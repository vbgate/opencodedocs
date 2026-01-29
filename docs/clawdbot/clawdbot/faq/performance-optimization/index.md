---
title: "Performance Optimization: Improve Gateway Response Speed and Memory Management | Clawdbot Tutorial"
sidebarTitle: "Performance Optimization"
subtitle: "Performance Optimization: Improve Gateway Response Speed and Memory Management"
description: "Learn how to optimize Clawdbot performance, including prompt caching, session pruning, concurrency control, memory management, and logging tuning to reduce latency, cut costs, and improve response speed."
tags:
  - "performance"
  - "session-management"
  - "concurrency"
  - "memory-optimization"
prerequisite:
  - "start-gateway-startup"
order: 330
---

# Performance Optimization: Improve Gateway Response Speed and Memory Management

**Performance optimization** is key to keeping Clawdbot responsive, reducing API costs, and ensuring stable operation. This tutorial teaches you how to optimize Gateway performance, including prompt caching, session pruning, concurrency control, memory management, and logging tuning.

## What You'll Learn

After completing this lesson, you will be able to:

- Configure **prompt caching** to significantly reduce Anthropic API call costs
- Enable **session pruning** to prevent unlimited context expansion
- Adjust **concurrency control** to avoid resource contention
- Optimize **log levels** and **OpenTelemetry sampling rates** to reduce I/O overhead
- Configure **memory flush** and **compaction** to keep conversations flowing smoothly
- Optimize hardware configuration when using **local models**

## Your Current Challenge

::: info Typical Symptoms
- **Slower responses over time**: Early conversations are fast, but get slower as the conversation progresses
- **Soaring API costs**: Same content billed repeatedly
- **High memory usage**: Gateway process occupies hundreds of MB or even GB
- **Queue backlog**: Message processing latency is noticeable
- **Context overflow**: Frequently encounter "context full" errors
:::

These problems are typically caused by:

1. **Full history sent on every request**: Every API call includes the complete conversation history
2. **Tool result accumulation**: Every tool call remains in context during long conversations
3. **No concurrency control**: Multiple sessions compete for CPU/memory/network simultaneously
4. **Excessive logging**: Large amounts of debug logs consume disk I/O

::: tip In a Nutshell
> Optimization core principle: **reduce redundant computation**, **control resource usage**, **leverage caching**.
:::

## Core Concepts

Clawdbot performance optimization revolves around three layers:

1. **Prompt Layer**: Reduce token count per API call
2. **Session Layer**: Control conversation history growth in memory
3. **Gateway Layer**: Manage concurrency, logging, and diagnostics overhead

### Optimization Priority

| Optimization Item | Impact | Difficulty | Priority |
| ----------------- | ------ | ---------- | -------- |
| Prompt Caching | ⭐⭐⭐ | Simple | P0 (Immediate) |
| Session Pruning | ⭐⭐⭐ | Simple | P0 (Immediate) |
| Concurrency Control | ⭐⭐ | Medium | P1 (Recommended) |
| Memory Flush | ⭐⭐ | Medium | P1 (Recommended) |
| Log Optimization | ⭐ | Simple | P2 (Debug only) |
| OpenTelemetry Sampling | ⭐ | Simple | P2 (Production) |

## 🎒 Prerequisites

Before starting, please ensure:

- **Gateway is running**: `clawdbot status`
- Backup current configuration: `cp ~/.clawdbot/clawdbot.json ~/.clawdbot/clawdbot.json.backup`
- Prepare a test scenario: Find a case that requires long AI conversations (e.g., "Help me summarize my work from the past 7 days")

---

## Optimization 1: Enable Prompt Caching

### What is Prompt Caching

Anthropic API supports **prompt caching**: Identical conversation history can be cached to avoid duplicate billing.

::: info Applicability Conditions
- Only applicable to **Anthropic models** (Claude)
- Requires **session stickiness**: Same session must use the same authentication configuration
- **Enabled by default** (automatically managed via `auth.json`)
:::

### Why It Matters

Suppose you ask the AI to complete a task requiring 10 conversation rounds:

| Scenario | Without Caching | With Caching |
| -------- | -------------- | ------------ |
| Send full history each round | 200,000 tokens × 10 rounds = 2M tokens | Round 1: 200K, next 9 rounds: ~100K (cache hit) |
| Cost (Anthropic) | ≈$30 | ≈$3.5 (88% savings) |
| Latency | Every round requires full history | Cache hit only needs to send incremental content |

### Default Configuration

**Good news**: If you configure Anthropic using **OAuth** or **setup-token**, Clawdbot has caching enabled by default.

Check current cache status:

```bash
clawdbot models status --provider anthropic
```

You should see `cacheEnabled: true`.

### Custom Cache TTL (Optional)

If you want to control cache expiration time, set it in the model configuration:

```json5
{
  agent: {
    model: "anthropic/claude-opus-4-5",
    params: {
      cacheControlTtl: "1h"  // 1 hour cache
    }
  }
}
```

::: warning Important Notes
- API Key configuration also supports caching, but requires manual `cacheControlTtl` setting
- Caching is only effective on **Anthropic API**, other providers don't support it
:::

---

## Optimization 2: Enable Session Pruning

### What is Session Pruning

Long conversations generate many **tool call results** (such as `web_search`, `browser`, `read`), which continuously accumulate in the context.

**Session Pruning** automatically cleans up outdated tool results before each API call, retaining only the most recent relevant portions.

### How to Enable

Edit `~/.clawdbot/clawdbot.json`:

```json5
{
  agent: {
    contextPruning: {
      mode: "cache-ttl",     // Use Anthropic's cache TTL as pruning timing
      ttl: "5m",              // Start pruning after 5 minutes
      keepLastAssistants: 3,  // Keep last 3 assistant messages as protection
      tools: {
        allow: ["exec", "read", "browser"],  // Only prune results from these tools
        deny: ["*image*"]  // Never prune image results (may be referenced)
      }
    }
  }
}
```

### Pruning Logic

```mermaid
flowchart LR
    A[New tool result] --> B{Exceeds TTL?}
    B -- Yes --> C[Prune old results]
    B -- No --> D[Retain full results]
    C --> E[Add "..." placeholder]
    D --> E[Keep unchanged]
```

### Pruning Effect Comparison

| Scenario | Without Pruning | With Pruning |
| -------- | --------------- | ------------ |
| Tool calls retained | All 20 calls in context | Only last 5 valid results |
| Context size | 200,000 tokens | ~80,000 tokens (60% reduction) |
| API call latency | Increases noticeably over time | Relatively stable |

---

## Optimization 3: Configure Compaction and Memory Flush

### What is Compaction

When the **context window approaches the limit**, Clawdbot automatically **compacts** conversation history:

- Summarize old conversations into a single summary
- Keep recent messages unchanged
- Store the summary in conversation history

### What is Memory Flush

Before compaction, Clawdbot can perform a **silent memory flush**:

- Trigger the agent to proactively "write to memory"
- Save persistent notes to disk (`memory/YYYY-MM-DD.md`)
- Avoid losing critical information after summarization

### Configure Compaction and Flush

```json5
{
  agent: {
    compaction: {
      autoCompact: true,           // Auto compaction (enabled by default)
      memoryFlush: {
        enabled: true,              // Enable memory flush
        softThresholdTokens: 4000, // Trigger when context reaches 4K tokens
        prompt: "Write any lasting notes to memory/YYYY-MM-DD.md; reply with NO_REPLY if nothing to store."
      }
    }
  }
}
```

### Manually Trigger Compaction

If the conversation feels "stuck" or context is full, manually compact:

```bash
# Send command in chat
/compact Focus on decisions and open questions
```

You should see:

```
🧹 Auto-compaction complete
📊 Compactions: 5
```

---

## Optimization 4: Adjust Concurrency Control

### Queue Architecture

Clawdbot uses **lane queues** to manage concurrency:

- **Main lane** (`main`): Shared by all sessions
- **Sub-lanes** (`cron`, `subagent`): Independent concurrency pools
- **Session lanes**: Each session has an independent queue, ensuring sequential execution

### Configure Global Concurrency

```json5
{
  agent: {
    maxConcurrent: 4,           // Global maximum concurrency (default: 4)
    maxConcurrentPerSession: 1  // Maximum concurrency per session (default: 1)
  }
}
```

### Concurrency Selection Recommendations

| Use Case | Recommended Concurrency | Reason |
| -------- | --------------------- | ------ |
| Lightweight use (personal assistant) | 2-4 | Fully utilize multi-core, reduce response time |
| High-frequency messages (group chat) | 4-8 | Prevent queue backlog, maintain low latency |
| Resource-constrained (low-end device) | 1-2 | Avoid memory overflow, system stutter |
| Large model (local 200B) | 1-2 | Limited GPU memory, single task is more stable |

### Configure Message Queue Mode

If you use Clawdbot in group chats or channels, adjust queue strategy:

```json5
{
  messages: {
    queue: {
      mode: "collect",        // "collect" | "followup" | "steer" | "interrupt"
      debounceMs: 1000,      // Debounce: wait 1 second before processing
      cap: 20,                // Queue upper limit
      drop: "summarize"       // Overflow strategy: "old" | "new" | "summarize"
    }
  }
}
```

::: tip Queue Mode Comparison
| Mode | Behavior | Use Case |
| ---- | -------- | -------- |
| `collect` | Merge into single followup | Avoid duplicate responses |
| `followup` | Process each message independently | Maintain thread independence |
| `steer` | Immediately inject into current conversation (cancel pending) | Quick response to additional content |
:::

---

## Optimization 5: Optimize Logging and Diagnostics

### Adjust Log Levels

`debug` or `trace` levels are not recommended for **production environments** as they generate massive disk writes.

```json5
{
  logging: {
    level: "info",              // File log level
    consoleLevel: "warn",        // Terminal log level (less output)
    consoleStyle: "compact"     // Compact output, reduce terminal rendering overhead
  }
}
```

| Level | Purpose | Performance Impact |
| ----- | ------- | ------------------ |
| `error` | Errors only | Minimal |
| `warn` | Warnings and errors | Low |
| `info` | Normal operation info | Medium |
| `debug` | Debug details | High |
| `trace` | Most detailed tracing (every function call) | Very high |

### Configure OpenTelemetry Sampling

**OpenTelemetry** exports telemetry data (metrics, traces, logs), but high sampling rates increase network and CPU overhead.

```json5
{
  diagnostics: {
    enabled: true,
    otl: {
      enabled: true,
      endpoint: "http://otel-collector:4318",
      sampleRate: 0.2,           // Sampling rate 20% (default: 0.2)
      traces: true,             // Export traces (chain tracking)
      metrics: true,            // Export metrics (indicators)
      logs: false              // Production recommends disabling log export
    }
  }
}
```

::: warning Production Recommendations
- Set `sampleRate` to `0.1` - `0.3` (10%-30% sampling)
- Set `logs` to `false` (high log volume, analyze via file logs instead)
- Keep `metrics` and `traces` for monitoring
:::

### Use Diagnostics Flags

If you need to temporarily debug specific modules, enable **diagnostics flags** instead of global debug:

```bash
# Environment variable (one-time)
CLAWDBOT_DIAGNOSTICS=telegram.http,web.fetch

# Or configuration file
{
  diagnostics: {
    flags: ["telegram.http", "web.fetch"]
  }
}
```

::: tip Flag List
- `telegram.http`: Telegram HTTP requests
- `web.search`: Web search tool
- `web.fetch`: Web scraping tool
- `browser.*`: Browser operations
- `memory.*`: Memory system
- `*`: All diagnostics (use with caution)
:::

---

## Optimization 6: Tool and Network Cache Optimization

### Web Search and Fetch Caching

`web_search` and `web_fetch` tools cache results to reduce duplicate requests.

```json5
{
  tools: {
    web: {
      search: {
        cacheTtlMinutes: 15    // Search results cached 15 minutes (default)
      },
      fetch: {
        cacheTtlMinutes: 15    // Fetched content cached 15 minutes (default)
      }
    }
  }
}
```

### Browser Performance

Browser tools launch independent Chrome/Chromium processes, with 2 concurrent instances by default.

```json5
{
  browser: {
    enabled: true,
    controlUrl: "http://127.0.0.1:18791",
    concurrency: 2,               // Concurrency count (default: 2)
    headless: true              // Headless mode (more resource-efficient)
    snapshotTimeoutMs: 30000    // Screenshot timeout 30 seconds
  }
}
```

::: tip Browser Optimization Tips
- Use `headless: true` (no UI rendering)
- Set reasonable `snapshotTimeoutMs` (prevent hanging)
- Reduce browser launches if frequent screenshots aren't needed
:::

---

## Optimization 7: Local Model Hardware Configuration

If you run **local models** (Ollama, etc.), ensure reasonable hardware configuration.

### Memory Requirements

| Model Size | GPU Memory (Recommended) | System Memory (Recommended) | CPU (Minimum) |
| ---------- | ----------------------- | -------------------------- | ------------- |
| Small (7B) | 8 GB                    | 16 GB                      | 4 cores       |
| Medium (13B) | 16 GB                   | 32 GB                      | 8 cores       |
| Large (34B) | 24 GB                   | 64 GB                      | 16 cores      |

### Docker Memory Configuration

```json5
{
  // fly.toml example
  [vm]
  memory = "2048mb"    // 2GB per instance
  cpus = 2

  // Or
  memory = "4096mb"    // 4GB (recommended for medium models)
}
```

::: warning Common Issues
- **Out of Memory (OOM)**: Logs show `Out of memory`, need to increase memory
- **Swap causing stutter**: Avoid swap whenever possible, use sufficient RAM
- **GPU not utilized**: Check if Docker has GPU mapped
:::

---

## Optimization 8: Monitoring and Diagnostics

### Real-time Monitoring

```bash
# View real-time queue depth
clawdbot logs --follow | grep "queue.depth"

# Monitor session count
clawdbot status | grep "Sessions"
```

### Periodic Diagnostics

```bash
# Run full diagnostics
clawdbot doctor

# View API usage statistics
clawdbot models status --provider anthropic
```

You should see:

```
✓ Gateway is running
✓ 3 active sessions
✓ Last Anthropic call: 2m ago
✓ Cache hits: 85% (cost savings)
```

### Performance Baselines

Record these metrics to establish performance baselines:

| Metric | Normal Range | Abnormal Threshold |
| ------ | ------------ | ----------------- |
| First-token response latency | < 2 seconds | > 5 seconds |
| Session context size | < 100K tokens | > 150K tokens |
| Queue wait time | < 2 seconds | > 10 seconds |
| CPU usage (sustained) | < 50% | > 80% |
| Memory usage (sustained) | < 70% | > 90% |

---

## Common Pitfalls

### ❌ Don't Over-Prune

**Problem**: Setting `keepLastAssistants` too small causes important context loss.

**Incorrect Example**:
```json5
{
  agent: {
    contextPruning: {
      keepLastAssistants: 0  // ❌ Causes conversation interruption
    }
  }
}
```

**Correct Practice**: Keep 2-5 assistant messages as "memory anchors".

### ❌ Don't Disable Compaction

**Problem**: Disabling `autoCompact` leads to unlimited context expansion.

**Incorrect Example**:
```json5
{
  agent: {
    compaction: {
      autoCompact: false  // ❌ Long conversations will crash
    }
  }
}
```

**Correct Practice**: Keep `autoCompact: true`, manually `/compact` when needed.

### ❌ Don't Use Excessive Concurrency

**Problem**: Setting `maxConcurrent: 10` on low-end devices causes memory overflow.

**Correct Practice**: Set reasonably based on hardware limits, recommend not exceeding 2x CPU cores.

### ❌ Don't Enable Trace Logs in Production

**Problem**: `trace` level generates massive logs, causing:

- Disk I/O saturation
- Frequent log rotation
- Difficult querying

**Correct Practice**: Use `info` or `warn` in production, only use `debug` when debugging.

---

## Summary

In this lesson, we learned **complete performance optimization strategies** for Clawdbot:

### Core Optimization Points

1. ✅ **Prompt Caching**: Reduce Anthropic API costs by 70%+
2. ✅ **Session Pruning**: Control context growth, avoid overflow
3. ✅ **Compaction and Flush**: Auto-summarize history, save persistent memory
4. ✅ **Concurrency Control**: Balance resource usage, prevent queue backlog
5. ✅ **Log Optimization**: Adjust levels, reduce I/O overhead
6. ✅ **OpenTelemetry Sampling**: Monitor without impacting performance
7. ✅ **Tool Caching**: Reduce duplicate network requests
8. ✅ **Hardware Configuration**: Memory and CPU optimization for local models

### Recommended Configuration Template

```json5
{
  agent: {
    model: "anthropic/claude-opus-4-5",
    params: {
      cacheControlTtl: "1h"
    },
    maxConcurrent: 4,
    contextPruning: {
      mode: "cache-ttl",
      ttl: "5m",
      keepLastAssistants: 3
    },
    compaction: {
      autoCompact: true,
      memoryFlush: {
        enabled: true,
        softThresholdTokens: 4000
      }
    }
  },
  logging: {
    level: "info",
    consoleLevel: "warn",
    consoleStyle: "compact"
  },
  diagnostics: {
    enabled: true,
    otl: {
      enabled: true,
      sampleRate: 0.2,
      traces: true,
      metrics: true,
      logs: false
    }
  }
}
```

### Expected Results

| Metric | Before | After | Improvement |
| ------ | ------ | ----- | ----------- |
| Average response latency | 3-5 seconds | 1-2 seconds | -50% |
| Single API call cost | $0.50 | $0.15 | -70% |
| Memory usage (stable) | 1.2 GB | 400 MB | -67% |
| Session stability | 85% | 98% | +13% |

---

## Next Lesson

> In the next lesson, we'll learn **[Complete Configuration Reference](../../appendix/config-reference/)**, covering detailed explanations and advanced usage of all Clawdbot configuration items.
>
> You'll learn:
> - Structure and hierarchy of all configuration sections
> - Value ranges and defaults for each configuration item
> - Advanced configuration: Sandbox, Security, Gateway Network, etc.
> - Configuration validation and best practices

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-27

| Function | File Path | Lines |
| --------------------- | ------------------------------------------------------------------- | --------- |
| Session Pruning | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts#L1750-L1800) | 1750-1800 |
| Compaction | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts#L1830-L1900) | 1830-1900 |
| Memory Flush | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts#L1840-L1870) | 1840-1870 |
| Queue + Concurrency | [`src/gateway/server-lanes.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-lanes.ts#L1-L78) | 1-78     |
| Prompt Cache | [`src/agents/auth-profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles.ts#L1-L500) | 1-500     |
| Logging | [`src/logging/index.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/logging/index.ts#L1-L200) | 1-200     |
| Diagnostics + OpenTelemetry | [`src/diagnostics/index.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/diagnostics/index.ts#L1-L300) | 1-300     |
| Web Search Cache | [`src/agents/tools/web-search.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-search.ts#L1-L200) | 1-200     |
| Web Fetch Cache | [`src/agents/tools/web-fetch.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/tools/web-fetch.ts#L1-L150) | 1-150     |
| Browser Concurrency | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts#L1970-L1980) | 1970-1980 |

**Key Configuration Constants**:
- `DEFAULT_MAX_CONCURRENT = 4`: Global maximum concurrency
- `DEFAULT_CACHE_TTL_MINUTES = 15`: Default cache time for web tools
- `DEFAULT_OTEL_SAMPLE_RATE = 0.2`: Default OpenTelemetry sampling rate

**Key Functions**:
- `pruneContext()`: Function to prune tool results
- `compactHistory()`: Function to compress conversation history
- `flushMemory()`: Function to execute memory flush
- `drainLane()`: Queue processing function
- `updateSampleRate()`: Function to dynamically adjust sampling rate

</details>
