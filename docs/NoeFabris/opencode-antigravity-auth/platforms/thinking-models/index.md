---
title: "Thinking Models: Claude & Gemini 3 | opencode-antigravity-auth"
sidebarTitle: "Thinking Models"
subtitle: "Thinking Models: Claude & Gemini 3 Reasoning"
description: "Learn to configure Claude and Gemini 3 Thinking models with Antigravity Auth plugin. Covers thinking budget, levels, variants, interleaved thinking, and retention strategy."
tags:
  - "Thinking Models"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "variant configuration"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 4
---

# Thinking Models: Claude and Gemini 3 Reasoning Capabilities

## What You'll Learn

- Configure thinking budget for Claude Opus 4.5 and Sonnet 4.5 Thinking models
- Use thinking levels (minimal/low/medium/high) for Gemini 3 Pro/Flash
- Flexibly adjust thinking intensity through OpenCode's variant system
- Understand interleaved thinking (reasoning mechanism during tool calls)
- Master thinking block retention strategy (keep_thinking configuration)

## Your Current Struggles

You want AI models to perform better on complex tasks—like multi-step reasoning, code debugging, or architectural design. But you know:

- Regular models answer too quickly without deep reasoning
- Claude's official thinking features are restricted and hard to access
- Gemini 3's thinking level configuration is unclear
- Not sure how much thinking is enough (what should the budget be)
- Signature errors when reading thinking block content

## When to Use This

**Use Cases**:
- Complex problems requiring multi-step reasoning (algorithm design, system architecture)
- Code review or debugging that requires careful consideration
- Deep analysis of long documents or codebases
- Tool-intensive tasks (need interleaved thinking)

**Not Suitable For**:
- Simple Q&A (wastes thinking quota)
- Rapid prototyping (speed prioritized)
- Factual queries (no reasoning needed)

## 🎒 Prerequisites

::: warning Prerequisite Check

 1. **Plugin installation and authentication completed**: Refer to [Quick Install](../../start/quick-install/) and [First Authentication](../../start/first-auth-login/)
 2. **Basic model usage understood**: Refer to [First Request](../../start/first-request/)
3. **Access to Thinking models available**: Ensure your account has access to Claude Opus 4.5/Sonnet 4.5 Thinking or Gemini 3 Pro/Flash

:::

---

## Core Concepts

### What Are Thinking Models

**Thinking models** perform internal reasoning (thinking blocks) before generating the final answer. These thinking contents:

- **Not billed**: Thinking tokens don't count toward regular output quota (actual billing rules per Antigravity official policy)
- **Improves reasoning quality**: More thinking → more accurate, logical responses
- **Consumes time**: Thinking increases response latency but delivers better results

**Key Differences**:

| Regular Models | Thinking Models |
|--- | ---|
| Directly generate answer | Think first → then generate answer |
| Fast but potentially shallow | Slow but deeper |
| Suitable for simple tasks | Suitable for complex tasks |

### Two Thinking Implementations

Antigravity Auth plugin supports two Thinking implementations:

#### Claude Thinking (Opus 4.5, Sonnet 4.5)

- **Token-based budget**: Control thinking amount with numbers (e.g., 8192, 32768)
- **Interleaved thinking**: Can think before/after tool calls
- **Snake_case keys**: Uses `include_thoughts`, `thinking_budget`

#### Gemini 3 Thinking (Pro, Flash)

- **Level-based**: Control thinking intensity with strings (minimal/low/medium/high)
- **CamelCase keys**: Uses `includeThoughts`, `thinkingLevel`
- **Model differences**: Flash supports all 4 levels, Pro only supports low/high

---

## Follow Along

### Step 1: Configure Thinking Models via Variant

OpenCode's variant system lets you select thinking intensity directly from the model selector without memorizing complex model names.

#### Check Existing Configuration

View your model configuration file (usually in `.opencode/models.json` or system config directory):

```bash
## View model configuration
cat ~/.opencode/models.json
```

#### Configure Claude Thinking Models

Find `antigravity-claude-sonnet-4-5-thinking` or `antigravity-claude-opus-4-5-thinking`, add variants:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "limit": { "context": 200000, "output": 64000 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "medium": { "thinkingConfig": { "thinkingBudget": 16384 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  }
}
```

**Configuration Notes**:
- `low`: 8192 tokens - lightweight thinking, suitable for medium-complexity tasks
- `medium`: 16384 tokens - balanced thinking and speed
- `max`: 32768 tokens - maximum thinking, suitable for most complex tasks

#### Configure Gemini 3 Thinking Models

**Gemini 3 Pro** (only supports low/high):

```json
{
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro (Antigravity)",
    "limit": { "context": 1048576, "output": 65535 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Gemini 3 Flash** (supports all 4 levels):

```json
{
  "antigravity-gemini-3-flash": {
    "name": "Gemini 3 Flash (Antigravity)",
    "limit": { "context": 1048576, "output": 65536 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "minimal": { "thinkingLevel": "minimal" },
      "low": { "thinkingLevel": "low" },
      "medium": { "thinkingLevel": "medium" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Configuration Notes**:
- `minimal`: Minimum thinking, fastest response (Flash only)
- `low`: Lightweight thinking
- `medium`: Balanced thinking (Flash only)
- `high`: Maximum thinking (slowest but most in-depth)

**You should see**: In OpenCode's model selector, after selecting a Thinking model, you can see a variant dropdown menu.

### Step 2: Make Requests with Thinking Models

After configuration, you can select models and variants through OpenCode:

```bash
## Use Claude Sonnet 4.5 Thinking (max)
opencode run "Help me design a distributed caching system architecture" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## Use Gemini 3 Pro (high)
opencode run "Analyze performance bottlenecks in this code" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## Use Gemini 3 Flash (minimal - fastest)
opencode run "Quickly summarize the content of this file" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**You should see**: The model will first output thinking blocks (thinking content), then generate the final answer.

### Step 3: Understand Interleaved Thinking

Interleaved thinking is a special capability of Claude models—it can think before and after tool calls.

**Scenario Example**: When asking AI to use tools (like file operations, database queries) to complete tasks:

```
Thinking: I need to first read the config file, then decide next steps based on the content...

[Calling tool: read_file("config.json")]

Tool Result: { "port": 8080, "mode": "production" }

Thinking: Port is 8080, production mode. I need to verify the configuration is correct...

[Calling tool: validate_config({ "port": 8080, "mode": "production" })]

Tool Result: { "valid": true }

Thinking: Configuration is valid. Now I can start the service.

[Generate final answer]
```

**Why it matters**:
- Thinking before/after tool calls → smarter decisions
- Adapts to tool results → dynamic strategy adjustment
- Avoids blind execution → reduces errors

::: tip Plugin Auto-Handles

You don't need to manually configure interleaved thinking. Antigravity Auth plugin automatically detects Claude Thinking models and injects system instructions:
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### Step 4: Control Thinking Block Retention Strategy

By default, the plugin **strips thinking blocks** to improve reliability (avoid signature errors). If you want to read thinking content, configure `keep_thinking`.

#### Why Strip by Default?

**Signature Error Issue**:
- Thinking blocks in multi-turn conversations require signature matching
- Keeping all thinking blocks may cause signature conflicts
- Stripping thinking blocks is a more stable solution (but loses thinking content)

#### Enable Thinking Block Retention

Create or edit configuration file:

**Linux/macOS**: `~/.config/opencode/antigravity.json`

**Windows**: `%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

Or use environment variable:

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**You should see**:
- `keep_thinking: false` (default): Only see final answer, thinking blocks hidden
- `keep_thinking: true`: See complete thinking process (may encounter signature errors in some multi-turn conversations)

::: warning Recommended Practice

- **Production**: Use default `keep_thinking: false`, ensure stability
- **Debugging/Learning**: Temporarily enable `keep_thinking: true`, observe thinking process
- **If signature errors occur**: Disable `keep_thinking`, plugin auto-recovers

:::

### Step 5: Check Max Output Tokens

Claude Thinking models require larger output token limits (maxOutputTokens), otherwise thinking budget may not be fully utilized.

**Plugin Auto-Handles**:
- If you set thinking budget, plugin automatically adjusts `maxOutputTokens` to 64,000
- Source location: `src/plugin/transform/claude.ts:78-90`

**Manual Configuration (Optional)**:

If you manually set `maxOutputTokens`, ensure it's greater than thinking budget:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // Must be >= thinkingBudget
      }
    }
  }
}
```

**You should see**:
- If `maxOutputTokens` too small, plugin automatically adjusts to 64,000
- Debug log shows "Adjusted maxOutputTokens for thinking model"

---

## Checkpoint ✅

Verify your configuration is correct:

### 1. Verify Variant Visibility

In OpenCode:

1. Open model selector
2. Select `Claude Sonnet 4.5 Thinking`
3. Check if variant dropdown menu exists (low/medium/max)

**Expected Result**: You should see 3 variant options.

### 2. Verify Thinking Content Output

```bash
opencode run "Think 3 steps: 1+1=? Why?" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**Expected Result**:
- If `keep_thinking: true`: See detailed thinking process
- If `keep_thinking: false` (default): Directly see answer "2"

### 3. Verify Interleaved Thinking (requires tool calls)

```bash
## Use task requiring tool calls
opencode run "Read the current directory's file list, then summarize file types" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**Expected Result**:
- See thinking content before and after tool calls
- AI adjusts strategy based on tool return results

---

## Troubleshooting

### ❌ Error 1: Thinking Budget Exceeds Max Output Tokens

**Problem**: Set `thinkingBudget: 32768`, but `maxOutputTokens: 20000`

**Error Message**:
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**Solution**:
- Let plugin auto-handle (recommended)
- Or manually set `maxOutputTokens >= thinkingBudget`

### ❌ Error 2: Gemini 3 Pro Uses Unsupported Level

**Problem**: Gemini 3 Pro only supports low/high, but you try using `minimal`

**Error Message**:
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**Solution**: Only use levels supported by Pro (low/high)

### ❌ Error 3: Signature Errors in Multi-Turn Conversations (keep_thinking: true)

**Problem**: After enabling `keep_thinking: true`, encounter errors in multi-turn conversations

**Error Message**:
```
Signature mismatch in thinking blocks
```

**Solution**:
- Temporarily disable `keep_thinking`: `export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- Or start a new conversation

### ❌ Error 4: Variant Not Displayed

**Problem**: Configured variants, but can't see them in OpenCode model selector

**Possible Causes**:
- Wrong configuration file path
- JSON syntax error (missing commas, quotes)
- Model ID mismatch

**Solution**:
1. Check configuration file path: `~/.opencode/models.json` or `~/.config/opencode/models.json`
2. Validate JSON syntax: `cat ~/.opencode/models.json | python -m json.tool`
3. Check if model ID matches what plugin returns

---

## Summary

Thinking models improve response quality for complex tasks by performing internal reasoning before generating answers:

| Feature | Claude Thinking | Gemini 3 Thinking |
|--- | --- | ---|
| **Configuration** | `thinkingBudget` (number) | `thinkingLevel` (string) |
| **Levels** | Custom budget | minimal/low/medium/high |
| **Keys** | snake_case (`include_thoughts`) | camelCase (`includeThoughts`) |
| **Interleaved** | ✅ Supported | ❌ Not supported |
| **Max Output** | Auto-adjusted to 64,000 | Uses default value |

**Key Configurations**:
- **Variant System**: Configure via `thinkingConfig.thinkingBudget` (Claude) or `thinkingLevel` (Gemini 3)
- **keep_thinking**: Default false (stable), true (readable thinking content)
- **Interleaved thinking**: Auto-enabled, no manual configuration needed

---

## Next Lesson Preview

> Next, we'll learn **[Google Search Grounding](../google-search-grounding/)**.
>
> You'll learn:
> - Enable Google Search retrieval for Gemini models
> - Configure dynamic retrieval thresholds
> - Improve factual accuracy, reduce hallucinations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to view source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Claude Thinking Config Build | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Gemini 3 Thinking Config Build | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Gemini 2.5 Thinking Config Build | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Claude Thinking Model Detection | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Gemini 3 Model Detection | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Interleaved Thinking Hint Injection | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
|--- | --- | ---|
| keep_thinking Config Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Claude Thinking Apply Transform | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Gemini Thinking Apply Transform | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**Key Constants**:
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000`: Maximum output tokens for Claude Thinking models
- `CLAUDE_INTERLEAVED_THINKING_HINT`: Interleaved thinking hint injected into system instructions

**Key Functions**:
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)`: Build Claude Thinking configuration (snake_case keys)
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)`: Build Gemini 3 Thinking configuration (level string)
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)`: Build Gemini 2.5 Thinking configuration (numeric budget)
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)`: Ensure maxOutputTokens is large enough
- `appendClaudeThinkingHint(payload, hint)`: Inject interleaved thinking hint
- `isClaudeThinkingModel(model)`: Detect if it's a Claude Thinking model
- `isGemini3Model(model)`: Detect if it's a Gemini 3 model

</details>
