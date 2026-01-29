---
title: "Model Routing: Custom Mapping | Antigravity-Manager"
sidebarTitle: "Model Routing"
subtitle: "Model Routing: Custom Mapping"
description: "Learn model routing configuration. Map client models to physical models, use wildcards and presets for OpenAI/Claude compatibility."
tags:
  - "Model Routing"
  - "custom_mapping"
  - "Wildcard"
  - "OpenAI Compatible"
  - "Claude Compatible"
prerequisite:
  - "start-proxy-and-first-client"
  - "platforms-openai"
order: 999
---
# Model Routing: Custom Mapping, Wildcard Priority, and Preset Strategies

The `model` you write in your client isn't necessarily the same as the "physical model" Antigravity Tools ultimately requests from the upstream. **Model routing** does one thing: map "stable external model names" to "internal physical models," and puts the result in the response header `X-Mapped-Model` so you can confirm whether it followed the expected path.

## What You'll Learn

- Configure `proxy.custom_mapping` in the UI (exact mapping + wildcard mapping)
- Explain clearly how a rule gets matched (exact > wildcard > default mapping)
- Apply preset rules with one click to quickly support OpenAI/Claude clients
- Use `curl -i` to verify `X-Mapped-Model` and diagnose "why didn't it route the way I thought"

## Your Current Struggles

- You want clients to always use `gpt-4o`, but upstream should consistently route to a specific Gemini model
- You have many versioned model names (e.g., `gpt-4-xxxx`) and don't want to manually add mappings each time
- You see requests succeed but aren't sure which physical model is actually running

## When to Use This Approach

- You want to provide your team with a "fixed external model collection" to shield them from upstream model changes
- You want to route multiple OpenAI/Claude model names to a few cost-effective models
- When troubleshooting 401/429/0 token errors, you need to confirm the actual mapped model

## 🎒 Preparation

- You've already started the local reverse proxy and can successfully make external requests (recommended: complete [Start Local Reverse Proxy & First Client (/healthz + SDK Config)](/lbjlaq/Antigravity-Manager/start/proxy-and-first-client/))
- You know how to use `curl -i` to view response headers (`X-Mapped-Model` was used in the previous lesson)

::: info Key terms in this lesson
- **`custom_mapping`**: Your "custom rule table," where keys are client-passed model names (or wildcard patterns) and values are the final model name to use (source: `src/types/config.ts`).
- **Wildcard `*`**: Used for batch matching model names (e.g., `gpt-4*`); matching implementation is **case-sensitive** (source: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

## Core Approach

When the backend processes a request, it first calculates a `mapped_model`:

1. First checks if `custom_mapping` has an **exact match** (key equals `model` exactly)
2. Then attempts wildcard match: selects the rule with "**more non-`*` characters**" (more specific rules have priority)
3. If neither matches, it falls back to system default mapping (e.g., some OpenAI/Claude model aliases to internal models)

This `mapped_model` is written to the response header `X-Mapped-Model` (at least the OpenAI handler does this), which you can use to confirm "what my model ended up as."

::: tip Hot reload semantics (no restart needed)
When the reverse proxy service is running, the frontend calling `update_model_mapping` immediately writes `custom_mapping` into the backend's in-memory `RwLock`, while also persisting it to the configuration file (source: `src-tauri/src/commands/proxy.rs`; `src-tauri/src/proxy/server.rs`).
:::

## Follow Along

### Step 1: Find the "Model Routing" Card on the API Proxy Page

**Why**
The model routing configuration entry is in the UI; you don't need to manually edit config files.

Open Antigravity Tools -> `API Proxy` page and scroll down.

**What you should see**: A card with a title like "Model Routing Center," with two buttons in the top-right corner: "Apply Preset Mapping" and "Reset Mapping" (source: `src/pages/ApiProxy.tsx`).

### Step 2: Add an "Exact Mapping" (Most Controllable)

**Why**
Exact mapping has the highest priority, suitable for "I want this specific model name to map to this specific physical model."

In the "Add Mapping" area:

- Original: enter the model name you want to expose externally, e.g., `gpt-4o`
- Target: select a target model from the dropdown, e.g., `gemini-3-flash`

Click Add.

**What you should see**: The mapping list shows `gpt-4o -> gemini-3-flash`, with a save success notification.

### Step 3: Add a "Wildcard Mapping" (Batch Coverage)

**Why**
When you have many versioned model names (e.g., `gpt-4-turbo`, `gpt-4-1106-preview`), using wildcards saves you lots of repetitive configuration.

Add another mapping:

- Original: `gpt-4*`
- Target: `gemini-3-pro-high`

**What you should see**: The list shows `gpt-4* -> gemini-3-pro-high`.

::: warning Rule priority "pitfall"
When `gpt-4o` satisfies both the exact rule `gpt-4o` and the wildcard rule `gpt-4*`, the backend takes the exact match first (source: `src-tauri/src/proxy/common/model_mapping.rs`).
:::

### Step 4: Apply Preset Rules with One Click (Quick Compatibility)

**Why**
If your main goal is "quickly adapt to common OpenAI/Claude model names," presets can directly fill in a batch of wildcard rules for you.

Click "Apply Preset Mapping."

**What you should see**: Multiple new rules appear in the list, including ones like these (source: `src/pages/ApiProxy.tsx`):

```json
{
  "gpt-4*": "gemini-3-pro-high",
  "gpt-4o*": "gemini-3-flash",
  "gpt-3.5*": "gemini-2.5-flash",
  "o1-*": "gemini-3-pro-high",
  "o3-*": "gemini-3-pro-high",
  "claude-3-5-sonnet-*": "claude-sonnet-4-5",
  "claude-3-opus-*": "claude-opus-4-5-thinking",
  "claude-opus-4-*": "claude-opus-4-5-thinking",
  "claude-haiku-*": "gemini-2.5-flash",
  "claude-3-haiku-*": "gemini-2.5-flash"
}
```

### Step 5: Verify Routing Takes Effect Using `X-Mapped-Model`

**Why**
You want to confirm "configuration is written," and even more, "requests actually followed this rule." The easiest way is to check `X-Mapped-Model`.

::: code-group

```bash [macOS/Linux]
curl -i http://127.0.0.1:8045/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": "hi"}]
  }'
```

```powershell [Windows]
$resp = Invoke-WebRequest "http://127.0.0.1:8045/v1/chat/completions" -Method Post -ContentType "application/json" -Body '{
  "model": "gpt-4o",
  "messages": [{"role": "user", "content": "hi"}]
}'
$resp.Headers["X-Mapped-Model"]
```

:::

**What you should see**: The response header contains `X-Mapped-Model: ...`. If you exactly mapped `gpt-4o` to `gemini-3-flash` in Step 2, you should see the corresponding value here (see response header writing in `src-tauri/src/proxy/handlers/openai.rs`).

### Step 6: When You Need to Return to "Pure Default Mapping," Reset custom_mapping

**Why**
When troubleshooting, you often want to first exclude "custom rule effects." Clearing `custom_mapping` is the most direct rollback method.

Click "Reset Mapping."

**What you should see**: The mapping list is cleared; subsequent requests that don't match custom rules will follow system default mapping (source: `src/pages/ApiProxy.tsx`; `src-tauri/src/proxy/common/model_mapping.rs`).

## Checkpoint ✅

- [ ] You can add/delete `custom_mapping` rules in the UI
- [ ] You can explain clearly why exact rules override wildcard rules
- [ ] You can read `X-Mapped-Model` using `curl -i` or PowerShell

## Pitfall Alerts

| Scenario | What you might do (❌) | Recommended practice (✓) |
|--- | --- | ---|
| Wildcard not working | Write `GPT-4*` expecting to match `gpt-4-turbo` | Use lowercase `gpt-4*`; backend wildcard matching is case-sensitive |
| Two wildcards both match | Write both `gpt-*` and `gpt-4*`, unsure which will be used | Make the more specific rule "longer," ensuring it has more non-`*` characters |
| Rule looks right but nothing changed | Only look at response body, not response header | Use `curl -i` to confirm `X-Mapped-Model` (this is explicitly returned by the backend) |
| Two rules are "equally specific" | Write two wildcards with same non-`*` character count | Avoid this configuration; source code comments note that in this case results depend on `HashMap` iteration order and may be unstable (source: `src-tauri/src/proxy/common/model_mapping.rs`) |

## Lesson Summary

- `proxy.custom_mapping` is your main entry point for controlling "external model name → physical model"
- Backend routing priority is: exact match > wildcard match (more specific takes priority) > system default mapping
- `X-Mapped-Model` is the most reliable verification method; check it first when troubleshooting

## Next Lesson Preview

> The next lesson continues with **Quota Governance: Combined Strategy for Quota Protection + Smart Warmup** (corresponding section: `advanced-quota`).

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Config field: `proxy.custom_mapping` (frontend type) | [`src/types/config.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/config.ts#L6-L20) | 6-20 |
| UI: write/reset/presets (calls `update_model_mapping`) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L371-L475) | 371-475 |
| UI: Model Routing card (apply preset mapping / reset mapping / list and add form) | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1762-L1931) | 1762-1931 |
| Backend command: hot reload and persist `custom_mapping` | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L344-L365) | 344-365 |
| Server state: `custom_mapping` saved with `RwLock<HashMap<..>>` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L16-L53) | 16-53 |
| Routing algorithm: exact > wildcard (more specific takes priority) > default mapping | [`src-tauri/src/proxy/common/model_mapping.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/common/model_mapping.rs#L180-L228) | 180-228 |
|--- | --- | ---|
| Calculate `mapped_model` during request (example: OpenAI handler) | [`src-tauri/src/proxy/handlers/openai.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/handlers/openai.rs#L154-L159) | 154-159 |
|--- | --- | ---|

**Key functions**:
- `resolve_model_route(original_model, custom_mapping)`: main entry point for model routing (see `src-tauri/src/proxy/common/model_mapping.rs`)

</details>
