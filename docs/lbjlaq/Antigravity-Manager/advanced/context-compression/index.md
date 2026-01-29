---
title: "Context Compression: Long Session Stability | Antigravity-Manager"
sidebarTitle: "Context Compression"
subtitle: "Context Compression: Long Session Stability"
description: "Learn Antigravity-Manager's context compression mechanism to reduce 400 signature errors and improve long session stability with three-tier progressive processing."
tags:
  - "Context Compression"
  - "Signature Caching"
  - "Thinking"
  - "Tool Result"
  - "Stability"
prerequisite:
  - "start-proxy-and-first-client"
  - "advanced-monitoring"
order: 999
---

# Long Session Stability: Context Compression, Signature Caching, and Tool Result Compression

When running long sessions with Claude Code or Cherry Studio, the most frustrating issue isn't that the model isn't smart enough—it's that the conversation suddenly starts throwing errors: `Prompt is too long`, 400 signature errors, broken tool call chains, or tool loops that get progressively slower.

This lesson covers three things Antigravity Tools does to solve these problems: context compression (three tiers of progressive intervention), signature caching (keeping Thinking's signature chain intact), and tool result compression (preventing tool output from overwhelming context).

## What You'll Learn

- Explain what each tier of progressive context compression does and their respective trade-offs
- Know what's stored in the three-layer signature cache (Tool/Family/Session) and the impact of 2-hour TTL
- Understand tool result compression rules: when base64 images get dropped, when browser snapshots get turned into head+tail summaries
- When needed, adjust compression trigger timing via `proxy.experimental` threshold switches

## Your Current Challenges

- After long conversations, 400 errors suddenly appear—it looks like signature expiration, but you don't know where signatures come from or where they're lost
- Tool calls keep increasing, and historical tool_results stack up until upstream rejects them directly (or becomes extremely slow)
- You want to use compression as a rescue mechanism, but worry about breaking Prompt Cache, affecting consistency, or causing the model to lose information

## When to Use This Technique

- You're running long-chain tool tasks (searching/file reading/browser snapshots/multi-round tool loops)
- You're using Thinking models for complex reasoning, and sessions often span dozens of rounds
- You're troubleshooting stability issues that are reproducible on the client side but unclear in root cause

## What Is Context Compression

**Context compression** is the agent's automatic noise reduction and size reduction on historical messages when it detects excessive context pressure: first trim old tool rounds, then compress old Thinking text into placeholders while preserving signatures, and finally in extreme cases generate an XML summary and Fork a new session to continue the conversation—thereby reducing failures caused by `Prompt is too long` and broken signature chains.

::: info How Is Context Pressure Calculated?
The Claude processor performs a lightweight estimate using `ContextManager::estimate_token_usage()`, calibrates with `estimation_calibrator`, then uses `usage_ratio = estimated_usage / context_limit` to get the pressure percentage (logs will print raw/calibrated values).
:::

## 🎒 Prerequisites

- You've successfully run your local proxy, and the client is actually using the `/v1/messages` path (see [Start Local Proxy and Connect First Client](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/))
- You can view proxy logs (developer debugging or local log files). The test plan in the repository gives an example log path and grep method (see `docs/testing/context_compression_test_plan.md`)

::: tip Use Proxy Monitor for Better Localization
If you want to match compression triggers with specific request types/accounts/tool call rounds, it's recommended to keep Proxy Monitor open simultaneously.
:::

## Core Idea

This stability design doesn't simply delete all history—instead, it intervenes progressively from lowest to highest cost:

| Tier | Trigger Point (Configurable) | What It Does | Cost/Side Effects |
|--- | --- | --- | ---|
| Layer 1 | `proxy.experimental.context_compression_threshold_l1` (default 0.4) | Identify tool rounds, keep only the most recent N rounds (5 in the code), delete tool_use/tool_result pairs from earlier rounds | Doesn't modify remaining message content, more Prompt Cache-friendly |
| Layer 2 | `proxy.experimental.context_compression_threshold_l2` (default 0.55) | Compress old Thinking text into `"..."`, but preserve `signature`, and protect the most recent 4 messages from modification | Modifies historical content; comments explicitly note it breaks cache, but can preserve signature chain |
| Layer 3 | `proxy.experimental.context_compression_threshold_l3` (default 0.7) | Call background model to generate XML summary, then Fork a new message sequence to continue conversation | Depends on background model call; if it fails, returns 400 (with friendly prompt) |

Next, we'll explain each tier in detail, and cover signature caching and tool result compression together.

### Layer 1: Tool Round Trimming (Trim Tool Messages)

The key point of Layer 1 is to delete entire tool interaction rounds, avoiding context inconsistency from partial deletions.

- One tool interaction round is identified by `identify_tool_rounds()`: `tool_use` appearing in `assistant` starts a round, subsequent `tool_result` in `user` is still considered part of this round, until a regular user text ends the round.
- Actual trimming is performed by `ContextManager::trim_tool_messages(&mut messages, 5)`: when historical tool rounds exceed 5 rounds, delete messages involved in earlier rounds.

### Layer 2: Thinking Compression While Preserving Signatures

Many 400 problems aren't caused by Thinking being too long, but by Thinking's signature chain breaking. Layer 2's strategy is:

- Only process `ContentBlock::Thinking { thinking, signature, .. }` in `assistant` messages
- Only compress when `signature.is_some()` and `thinking.len() > 10`, directly change `thinking` to `"..."`
- The most recent `protected_last_n = 4` messages aren't compressed (roughly the most recent 2 user/assistant rounds)

This saves a lot of Tokens while keeping `signature` in history, avoiding situations where tool chains need to backfill signatures but can't recover them.

### Layer 3: Fork + XML Summary (Ultimate Fallback)

When pressure continues to rise, the Claude processor attempts to restart the session without losing key information:

1. Extract the last valid Thinking signature from original messages (`ContextManager::extract_last_valid_signature()`)
2. Concatenate the entire history + `CONTEXT_SUMMARY_PROMPT` into a request for XML summary generation, model fixed as `BACKGROUND_MODEL_LITE` (currently `gemini-2.5-flash`)
3. The summary must contain `<latest_thinking_signature>` for subsequent signature chain continuation
4. Fork a new message sequence:
   - `User: Context has been compressed... + XML summary`
   - `Assistant: I have reviewed...`
   - Then append the original request's last user message (if it's not just the summary instruction)

If Fork + summary fails, it directly returns `StatusCode::BAD_REQUEST`, prompting you to manually handle with `/compact` or `/clear` (see the error JSON returned by the handler).

### Sidecar 1: Three-Layer Signature Caching (Tool / Family / Session)

Signature caching is the fuse for context compression, especially when clients trim/discard signature fields.

- TTL: `SIGNATURE_TTL = 2 * 60 * 60` (2 hours)
- Layer 1: `tool_use_id -> signature` (tool chain recovery)
- Layer 2: `signature -> model family` (cross-model compatibility check, preventing Claude signatures from being brought to Gemini family models)
- Layer 3: `session_id -> latest signature` (session-level isolation, preventing different conversation pollution)

These three layers of cache are written/read during Claude SSE streaming parsing and request transformation:

- When streaming parsing reaches thinking's `signature`, it's written to Session Cache (and caches family)
- When streaming parsing reaches tool_use's `signature`, it's written to Tool Cache + Session Cache
- When converting Claude tool calls to Gemini `functionCall`, it prioritizes filling signatures back from Session Cache or Tool Cache

### Sidecar 2: Tool Result Compression (Tool Result Compressor)

Tool results more easily overwhelm context than chat text, so the request transformation phase performs predictable reduction on tool_result.

Core rules (all in `tool_result_compressor.rs`):

- Total character limit: `MAX_TOOL_RESULT_CHARS = 200_000`
- base64 image blocks are removed directly (append a prompt text)
- If it detects output saved to file prompts, it extracts key information and uses `[tool_result omitted ...]` as placeholder
- If it detects browser snapshots (containing features like `page snapshot` / `ref=`), it changes to head + tail summary, and notes how many characters were omitted
- If input looks like HTML, it first removes `<style>`/`<script>`/base64 segments before truncation

## Follow Along

### Step 1: Confirm Compression Thresholds (and Default Values)

**Why**
Compression trigger points aren't hardcoded; they come from `proxy.experimental.*`. You need to know current thresholds first to judge why it intervenes so early/late.

Default values (Rust side `ExperimentalConfig::default()`):

```json
{
  "proxy": {
    "experimental": {
      "enable_signature_cache": true,
      "enable_tool_loop_recovery": true,
      "enable_cross_model_checks": true,
      "enable_usage_scaling": true,
      "context_compression_threshold_l1": 0.4,
      "context_compression_threshold_l2": 0.55,
      "context_compression_threshold_l3": 0.7
    }
  }
}
```

**What you should see**: Your configuration has `proxy.experimental` (field names match above), and thresholds are ratio values like `0.x`.

::: warning Configuration File Location Not Repeated Here
Configuration file persistence location and whether restart is needed after modification belong to configuration management. Following this tutorial system, prioritize referring to [Configuration Full Guide: AppConfig/ProxyConfig, Persistence Location & Hot Update Semantics](/lbjlaq/Antigravity-Manager/advanced/config/).
:::

### Step 2: Use Logs to Confirm Whether Layer 1/2/3 Are Triggered

**Why**
All three tiers are internal proxy behaviors; the most reliable verification is seeing if logs contain `[Layer-1]` / `[Layer-2]` / `[Layer-3]`.

The repository's test plan provides an example command (adjust to your actual log path as needed):

```bash
tail -f ~/Library/Application\ Support/com.antigravity.tools/logs/antigravity.log | grep -E "Layer-[123]"
```

**What you should see**: When pressure increases, logs show records like `Tool trimming triggered`, `Thinking compression triggered`, `Fork successful` (specific fields based on actual log text).

### Step 3: Understand the Difference Between Purification and Compression (Don't Mix Expectations)

**Why**
Some problems (like forced downgrade to models that don't support Thinking) need purification rather than compression. Purification directly deletes Thinking blocks; compression preserves the signature chain.

In the Claude handler, backend task downgrading goes through `ContextManager::purify_history(..., PurificationStrategy::Aggressive)`, which directly removes historical Thinking blocks.

**What you should see**: You can distinguish two types of behaviors:

- Purification is deleting Thinking blocks
- Layer 2 compression is replacing old Thinking text with `"..."`, but the signature is still there

### Step 4: When You Encounter 400 Signature Errors, First Check if Session Cache Hit

**Why**
The root cause of many 400s isn't missing signatures, but signatures not following messages. During request transformation, it prioritizes filling signatures from Session Cache.

Clues (request transformation phase logs will indicate recovering signatures from SESSION/TOOL cache):

- `[Claude-Request] Recovered signature from SESSION cache ...`
- `[Claude-Request] Recovered signature from TOOL cache ...`

**What you should see**: When client drops signatures but proxy cache still has them, logs show "Recovered signature from ... cache" records.

### Step 5: Understand What Tool Result Compression Will Drop

**Why**
If you let tools stuff large HTML/browser snapshots/base64 images back into conversation, the proxy will proactively reduce them. You need to know in advance which content will be replaced with placeholders to avoid mistakenly thinking the model didn't see it.

Remember three key points:

1. base64 images will be removed (changed to prompt text)
2. Browser snapshots will become head/tail summaries (with omitted character counts)
3. Exceeding 200,000 characters will be truncated and append `...[truncated ...]` prompt

**What you should see**: In `tool_result_compressor.rs`, these rules have explicit constants and branches—it's not empirical deletion.

## Checkpoints

- You can clearly explain L1/L2/L3 trigger points come from `proxy.experimental.context_compression_threshold_*`, defaulting to `0.4/0.55/0.7`
- You can explain why Layer 2 breaks cache: because it modifies historical thinking text content
- You can explain why Layer 3 is called Fork: it transforms conversation into a new sequence of XML summary + confirmation + latest user message
- You can explain that tool result compression will remove base64 images and convert browser snapshots to head/tail summaries

## Common Pitfalls

| Scenario | Possible Cause | What You Can Do |
|--- | --- | ---|
| Context feels less stable after Layer 2 triggers | Layer 2 modifies historical content; comments explicitly note it breaks cache | If you depend on Prompt Cache consistency, try to let L1 solve problems first, or increase L2 threshold |
| Direct 400 returned after Layer 3 triggers | Fork + summary failed calling background model (network/account/upstream error, etc.) | First use `/compact` or `/clear` per error JSON suggestion; simultaneously check background model call chain |
| Images/large content disappear in tool output | tool_result removes base64 images, truncates oversized output | Drop important content to local file/link and reference it; don't expect to stuff 100k lines of text directly back into conversation |
| Using Gemini model but it brought Claude signature causing error | Signatures aren't cross-model compatible (code has family check) | Confirm signature source; if needed, let proxy strip historical signatures in retry scenarios (see request transformation logic) |

## Summary

- Three-tier compression's core is cost-graded: first delete old tool rounds, then compress old Thinking, finally Fork + XML summary
- Signature caching is the key to keeping tool chains continuous: Session/Tool/Family three layers each handle one type of problem, TTL is 2 hours
- Tool result compression is a hard limit to prevent tool output from overwhelming context: 200,000 character limit + snapshot/large file prompt specialization

## Up Next

> Next lesson we'll cover system capabilities: multi-language/themes/updates/auto-start/HTTP API Server.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Experimental config: compression threshold and switch defaults | `src-tauri/src/proxy/config.rs` | 119-168 |
| Context estimation: multilingual character estimation + 15% margin | `src-tauri/src/proxy/mappers/context_manager.rs` | 9-37 |
| Token usage estimation: iterate system/messages/tools/thinking | `src-tauri/src/proxy/mappers/context_manager.rs` | 103-198 |
| Layer 1: identify tool rounds + trim old rounds | `src-tauri/src/proxy/mappers/context_manager.rs` | 311-439 |
| Layer 2: Thinking compression while preserving signature (protect last N) | `src-tauri/src/proxy/mappers/context_manager.rs` | 200-271 |
| Layer 3 helper: extract last valid signature | `src-tauri/src/proxy/mappers/context_manager.rs` | 73-109 |
| Backend task downgrade: Aggressive purification of Thinking blocks | `src-tauri/src/proxy/handlers/claude.rs` | 540-583 |
|--- | --- | ---|
| Layer 3: XML summary + Fork session implementation | `src-tauri/src/proxy/handlers/claude.rs` | 1560-1687 |
|--- | --- | ---|
| Signature caching: Session signature write/read | `src-tauri/src/proxy/signature_cache.rs` | 141-223 |
| SSE streaming parsing: cache thinking/tool signature to Session/Tool cache | `src-tauri/src/proxy/mappers/claude/streaming.rs` | 766-776 |
|--- | --- | ---|
| Request transformation: tool_use prioritize filling signature from Session/Tool cache | `src-tauri/src/proxy/mappers/claude/request.rs` | 1045-1142 |
| Request transformation: tool_result trigger tool result compression | `src-tauri/src/proxy/mappers/claude/request.rs` | 1159-1225 |
| Tool result compression: entry `compact_tool_result_text()` | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 28-69 |
| Tool result compression: browser snapshot head/tail summary | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 123-178 |
| Tool result compression: remove base64 images + total character limit | `src-tauri/src/proxy/mappers/tool_result_compressor.rs` | 247-320 |
| Test plan: three-tier compression trigger and log verification | `docs/testing/context_compression_test_plan.md` | 1-116 |

</details>
