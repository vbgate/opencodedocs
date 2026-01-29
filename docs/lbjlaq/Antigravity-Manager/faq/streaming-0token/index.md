---
title: "Streaming: 修复中断和签名错误 | Antigravity-Manager"
sidebarTitle: "Streaming 修复"
subtitle: "Streaming: 修复中断和签名错误"
description: "学习 Antigravity Tools 流式中断、0 Token 和签名错误的排查方法。确认 /v1/messages 或 Gemini 流式调用，理解 peek 预取和退避重试，结合 Proxy Monitor、X-Account-Email 和日志快速定位根因。"
tags:
  - "faq"
  - "streaming"
  - "troubleshooting"
  - "retry"
prerequisite:
  - "start-getting-started"
  - "start-first-run-data"
  - "advanced-monitoring"
  - "advanced-scheduling"
order: 999
---

# Streaming Interruption/0 Token/Invalid Signature: Self-Healing & Troubleshooting Path

When calling `/v1/messages` (Anthropic-compatible) or Gemini native streaming endpoints with Antigravity Tools, if you encounter issues like "streaming output interrupted," "200 OK but 0 tokens," or "Invalid `signature`," this lesson provides a troubleshooting path from UI to logs.

## What You'll Learn

- Know that 0 token/interruption issues are usually caught first by "peek prefetch" in the proxy
- Confirm the account and mapped model for the current request from Proxy Monitor (`X-Account-Email` / `X-Mapped-Model`)
- Determine from logs whether it's "upstream stream early termination," "backoff retry," "account rotation," or "signature fix retry"
- Know when to wait for proxy self-healing and when manual intervention is needed

## Your Current Struggles

You may see these "symptoms," but don't know where to start:

- Streaming output stops halfway, with the client appearing "frozen" and not continuing
- 200 OK, but `usage.output_tokens=0` or empty content
- 400 errors with `Invalid \`signature\``, `Corrupted thought signature`, `must be \`thinking\``, etc.

These issues are usually not "your request was written wrong," but rather caused by streaming transmission, upstream rate limiting/fluctuation, or signature blocks in message history triggering upstream validation. Antigravity Tools has multiple defense mechanisms at the proxy layer. You just need to verify along a fixed path which step it actually got stuck at.

## What is 0 Token?

**0 Token** typically refers to a request that ultimately returns `output_tokens=0` and appears to have "generated no content." In Antigravity Tools, it's more commonly caused by "the streaming response ending/erroring before actually outputting anything," rather than the model truly generating 0 tokens. The proxy attempts to use peek prefetch to catch such empty responses and trigger retries.

## Three Things the Proxy Does Behind the Scenes (First Build Mental Model)

### 1) Non-Streaming Requests May Be Automatically Converted to Streaming

In the `/v1/messages` path, the proxy internally converts "client non-streaming requests" to streaming requests for upstream, then collects SSE into JSON before returning (the reason stated in logs is "better quota").

Source evidence: `src-tauri/src/proxy/handlers/claude.rs#L665-L913`.

### 2) Peek Prefetch: Wait for "First Valid Data Chunk" Before Passing Stream to Client

For `/v1/messages` SSE output, the proxy first does a `timeout + next()` prefetch, skipping heartbeat/comment lines (starting with `:`) until it gets the first chunk that's "not empty, not a heartbeat" before starting actual forwarding. If an error/timeout/stream end occurs during the peek phase, it directly enters the next attempt (which usually triggers account rotation).

Source evidence: `src-tauri/src/proxy/handlers/claude.rs#L812-L926`; Gemini native streaming has similar peek: `src-tauri/src/proxy/handlers/gemini.rs#L117-L149`.

### 3) Unified Backoff Retry + Account Rotation Decided by Status Code

The proxy has clear backoff strategies for common status codes and defines which status codes trigger account rotation.

Source evidence: `src-tauri/src/proxy/handlers/claude.rs#L117-L236`.

## 🎒 Preparation

- You can open Proxy Monitor (see [Proxy Monitor: Request Logs, Filtering, Detail Restoration and Export](../../advanced/monitoring/))
- You know logs are in the `logs/` directory under the data directory (see [First Run Essentials: Data Directory, Logs, Tray & Auto-Start](../../start/first-run-data/))

## Follow Along

### Step 1: Confirm Which Endpoint Path You're Calling

**Why**
`/v1/messages` (claude handler) and Gemini native (gemini handler) have different self-healing details. Confirming the path first avoids wasting time on wrong log keywords.

Open Proxy Monitor, find that failed request, and first note down the Path:

- `/v1/messages`: Check `src-tauri/src/proxy/handlers/claude.rs` logic
- `/v1beta/models/...:streamGenerateContent`: Check `src-tauri/src/proxy/handlers/gemini.rs` logic

**What you should see**: The request record shows URL/method/status code (and request duration).

### Step 2: Grab "Account + Mapped Model" from Response Headers

**Why**
Whether the same request fails/succeeds often depends on "which account was selected this time" and "which upstream model it was routed to." The proxy writes these two pieces of information to response headers. Note them down first, so you can match them later when checking logs.

In that failed request, look for these response headers:

- `X-Account-Email`
- `X-Mapped-Model`

Both are set in `/v1/messages` and Gemini handlers (e.g., in `/v1/messages` SSE responses: `src-tauri/src/proxy/handlers/claude.rs#L887-L896`; Gemini SSE: `src-tauri/src/proxy/handlers/gemini.rs#L235-L245`).

**What you should see**: `X-Account-Email` is the email, `X-Mapped-Model` is the actual requested model name.

### Step 3: Check in app.log Whether It "Failed at Peek Phase"

**Why**
Peek failure usually means "upstream didn't even start outputting valid data." The most common handling for such issues is retry/account rotation. You need to confirm whether the proxy triggered it.

First locate the log file (log directory is `logs/` under data directory, and writes to `app.log*` with daily rotation).

::: code-group

```bash [macOS/Linux]
ls -lt "$HOME/.antigravity_tools/logs" | head
```

```powershell [Windows]
Get-ChildItem -Force (Join-Path $HOME ".antigravity_tools\logs") | Sort-Object LastWriteTime -Descending | Select-Object -First 5
```

:::

Then in the latest `app.log*`, search for these keywords:

- `/v1/messages` (claude handler): `Stream error during peek` / `Stream ended during peek` / `Timeout waiting for first data` (`src-tauri/src/proxy/handlers/claude.rs#L828-L864`)
- Gemini native streaming: `[Gemini] Empty first chunk received, retrying...` / `Stream error during peek` / `Stream ended immediately` (`src-tauri/src/proxy/handlers/gemini.rs#L117-L144`)

**What you should see**: If peek retry was triggered, logs show warnings like "retrying..." and subsequently enter the next attempt (usually bringing account rotation).

### Step 4: If 400/Invalid `signature`, Confirm Whether Proxy Did "Signature Fix Retry"

**Why**
Signature errors often come from Thinking blocks/signature blocks in message history not meeting upstream requirements. Antigravity Tools attempts "downgrade historical thinking blocks + inject fix prompt" then retry. You should let self-healing run first.

You can use 2 signals to determine whether it entered fix logic:

1. Log shows `Unexpected thinking signature error ... Retrying with all thinking blocks removed.` (`src-tauri/src/proxy/handlers/claude.rs#L999-L1025`)
2. Subsequently converts historical `Thinking` blocks to `Text`, and appends fix prompt to the last user message (`src-tauri/src/proxy/handlers/claude.rs#L1027-L1102`; Gemini handler also appends same prompt to `contents[].parts`: `src-tauri/src/proxy/handlers/gemini.rs#L300-L325`)

**What you should see**: Proxy automatically retries after a short delay (`FixedDelay`), and may enter the next attempt.

## Checkpoints ✅

- [ ] You can confirm request path in Proxy Monitor (`/v1/messages` or Gemini native)
- [ ] You can get `X-Account-Email` and `X-Mapped-Model` for the current request
- [ ] You can search for peek/retry related keywords in `logs/app.log*`
- [ ] When encountering 400 signature errors, you can confirm whether proxy entered "fix prompt + clean thinking blocks" retry logic

## Common Pitfalls

| Scenario | What You Might Do (❌) | Recommended Practice (✓) |
| --- | --- | --- |
| See 0 token and immediately manually retry many times | Keep pressing client retry button, not checking logs at all | First check Proxy Monitor + app.log once, confirm if it's peek phase early termination (will auto retry/rotate) |
| Encounter `Invalid \`signature\`` and directly clear data directory | Delete `.antigravity_tools` entirely, losing accounts/statistics | First let proxy execute one "signature fix retry"; only consider manual intervention when logs explicitly indicate unrecoverable |
| Treat "server-side fluctuation" as "account broken" | Rotate account for all 400/503/529 | Whether rotation is effective depends on status code; proxy itself has `should_rotate_account(...)` rules (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`) |

## Summary

- 0 token/streaming interruption in the proxy usually goes through peek prefetch first; peek phase failure triggers retry and enters next attempt
- `/v1/messages` may internally convert non-streaming requests to streaming then collect back to JSON, which affects your understanding of "why it looks like a streaming issue"
- For signature-invalid 400 errors, proxy attempts "fix prompt + clean thinking blocks" then retry. You prioritize verifying whether this self-healing path succeeded.

## Up Next

> Next lesson: **[Endpoint Quick Reference](../../appendix/endpoints/)**.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
| --- | --- | --- |
| Claude handler: backoff retry strategy + rotation rules | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L117-L236) | 117-236 |
| Claude handler: internal non-streaming to streaming conversion (better quota) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L665-L776) | 665-776 |
| Claude handler: peek prefetch (skip heartbeat/comments, avoid empty streams) | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L812-L926) | 812-926 |
| Claude handler: 400 signature/block order error fix retry | [`src-tauri/src/proxy/handlers/claude.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/claude.rs#L999-L1102) | 999-1102 |
| Gemini handler: peek prefetch (prevent empty stream 200 OK) | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L117-L149) | 117-149 |
| Gemini handler: 400 signature error fix prompt injection | [`src-tauri/src/proxy/handlers/gemini.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/gemini.rs#L300-L325) | 300-325 |
| Signature cache (three layers: tool/family/session, with TTL/min length) | [`src-tauri/src/proxy/signature_cache.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/signature_cache.rs#L5-L207) | 5-207 |
| Claude SSE transformation: capture signature and write to signature cache | [`src-tauri/src/proxy/mappers/claude/streaming.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/mappers/claude/streaming.rs#L639-L787) | 639-787 |

**Key Constants**:
- `MAX_RETRY_ATTEMPTS = 3`: Maximum retry count (`src-tauri/src/proxy/handlers/claude.rs#L27`)
- `SIGNATURE_TTL = 2 * 60 * 60` seconds: Signature cache TTL (`src-tauri/src/proxy/signature_cache.rs#L6`)
- `MIN_SIGNATURE_LENGTH = 50`: Minimum signature length (`src-tauri/src/proxy/signature_cache.rs#L7`)

**Key Functions**:
- `determine_retry_strategy(...)`: Select backoff strategy by status code (`src-tauri/src/proxy/handlers/claude.rs#L117-L167`)
- `should_rotate_account(...)`: Decide whether to rotate account by status code (`src-tauri/src/proxy/handlers/claude.rs#L226-L236`)
- `SignatureCache::cache_session_signature(...)`: Cache session signature (`src-tauri/src/proxy/signature_cache.rs#L149-L188`)

</details>
