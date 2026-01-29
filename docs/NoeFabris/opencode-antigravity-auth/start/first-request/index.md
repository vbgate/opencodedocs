---
title: "First Request: Verify Installation | opencode-antigravity-auth"
sidebarTitle: "First Request"
subtitle: "First Request: Verify Installation | opencode-antigravity-auth"
description: "Learn how to send your first Antigravity model request and verify OAuth authentication. This tutorial covers model selection, variant parameter usage, response verification, and common error troubleshooting."
tags:
  - "Installation Verification"
  - "Model Request"
  - "Quick Start"
prerequisite:
  - "start-quick-install"
order: 4
---

# First Request: Verify Installation Success

## What You'll Learn

- Send your first Antigravity model request
- Understand how `--model` and `--variant` parameters work
- Choose the right model and thinking configuration based on your needs
- Troubleshoot common model request errors

## Your Current Challenge

You've just installed the plugin, completed OAuth authentication, and configured model definitions, but you're unsure about:
- Is the plugin actually working?
- Which model should I use to start testing?
- How do I use the `--variant` parameter?
- If the request fails, how do I know which step has a problem?

## When to Use This Approach

Use the verification methods from this lesson in these scenarios:
- **After initial installation** — Confirm authentication, configuration, and models all work correctly
- **After adding a new account** — Verify the new account is available
- **After changing model configuration** — Confirm the new model configuration is correct
- **Before encountering problems** — Establish a baseline for easier comparison later

## 🎒 Preparation

::: warning Prerequisite Checks

Before proceeding, please confirm:

- ✅ Completed [Quick Installation](/NoeFabris/opencode-antigravity-auth/start/quick-install/)
- ✅ Ran `opencode auth login` to complete OAuth authentication
- ✅ Model definitions have been added to `~/.config/opencode/opencode.json`
- ✅ OpenCode terminal or CLI is available

:::

## Core Concepts

### Why Verify First

The plugin involves collaboration of multiple components:
1. **OAuth Authentication** — Obtain access tokens
2. **Account Management** — Select available accounts
3. **Request Transformation** — Convert OpenCode format to Antigravity format
4. **Streaming Response** — Process SSE responses and convert back to OpenCode format

Sending the first request can verify whether the entire pipeline is unobstructed. If successful, all components are working properly. If it fails, you can locate the problem based on error messages.

### Model and Variant Relationship

In the Antigravity plugin, **model and variant are two independent concepts**:

| Concept | Role | Example |
|---------|------|---------|
| **Model** | Select the specific AI model | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant** | Configure the model's thinking budget or mode | `low` (lightweight thinking), `max` (maximum thinking) |

::: info What is Thinking Budget?

Thinking budget refers to the number of tokens a model can use for "thinking" before generating a response. Higher budgets mean the model has more time for reasoning, but also increase response time and cost.

- **Claude Thinking models**: Configure with `thinkingConfig.thinkingBudget` (unit: token)
- **Gemini 3 models**: Configure with `thinkingLevel` (string level: minimal/low/medium/high)

:::

### Recommended Beginner Combinations

Recommended model and variant combinations for different needs:

| Need | Model | Variant | Characteristics |
|------|-------|---------|-----------------|
| **Quick Testing** | `antigravity-gemini-3-flash` | `minimal` | Fastest response, ideal for verification |
| **Daily Development** | `antigravity-claude-sonnet-4-5-thinking` | `low` | Balanced speed and quality |
| **Complex Reasoning** | `antigravity-claude-opus-4-5-thinking` | `max` | Strongest reasoning capability |
| **Visual Tasks** | `antigravity-gemini-3-pro` | `high` | Multimodal support (images/PDFs) |

## Follow Along

### Step 1: Send the Simplest Test Request

First, use the simplest command to test whether the basic connection is working.

**Why**
This request doesn't use thinking functionality and returns extremely fast, making it suitable for quickly verifying authentication and account status.

**Run Command**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**You Should See**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip Success Indicator

If you see the AI's response, it means:
- ✅ OAuth authentication successful
- ✅ Account has access permission
- ✅ Request transformation working correctly
- ✅ Streaming response properly parsed

:::

### Step 2: Use Thinking Model and Variant

Now test the complete thinking workflow, including the variant parameter.

**Why**
Thinking models require additional request transformation logic, which is one of the plugin's core features.

**Run Command**

```bash
opencode run "Explain what closures are, use a simple analogy" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**You Should See**

1. **Streaming thinking output**: You'll see the model first output the thinking process (with `<thinking>` tags)
2. **Thinking process**: The model will analyze in detail how to organize the answer
3. **Final answer**: After thinking completes, the final content is output

::: details See a Complete Response Example

```
<thinking>
The user is asking what closures are, needs to be explained with a simple analogy.

Closure concepts:
1. Functions can access variables in their outer scope
2. Even after the outer function has finished executing
3. This ability is like a "backpack"

Analogy approach:
- Can use "backpack" as analogy
- Function returns carrying some variables
- Like packing things from home in a bag when going out
</thinking>

A closure is like a function's "backpack".

When a function is created, it "packs up" the outer variables it can access, like putting needed items from home into a backpack before leaving. Even if the function leaves the place where it was created (the outer function finishes executing), it can still access those variables through this "backpack".

For example:
```javascript
function createCounter() {
  let count = 0;  // This variable gets packed into the "backpack"
  return function() {
    count++;  // Can still access variables in the backpack
    return count;
  };
}
```
```

:::

**Checkpoint ✅**

- [ ] See `<thinking>` block (if `keep_thinking: true` is configured)
- [ ] Response content is reasonable and logical
- [ ] Response time is within acceptable range (typically 2-10 seconds)

### Step 3: Test Gemini 3 Models

Test different thinking levels of Gemini 3 Pro.

**Why**
Gemini 3 uses string-level `thinkingLevel`, verifying support for different model families.

**Run Commands**

```bash
# Test Gemini 3 Flash (fast response)
opencode run "Write a bubble sort" --model=google/antigravity-gemini-3-flash --variant=low

# Test Gemini 3 Pro (deep thinking)
opencode run "Analyze the time complexity of bubble sort" --model=google/antigravity-gemini-3-pro --variant=high
```

**You Should See**

- Flash model responds faster (suitable for simple tasks)
- Pro model thinks more deeply (suitable for complex analysis)
- Both models work normally

### Step 4: Test Multimodal Capabilities (Optional)

If your model configuration supports image input, you can test multimodal functionality.

**Why**
Antigravity supports image/PDF input, a feature needed in many scenarios.

**Prepare a test image**: Any image file (e.g., `test.png`)

**Run Command**

```bash
opencode run "Describe the content of this image" --model=google/antigravity-gemini-3-pro --image=test.png
```

**You Should See**

- Model accurately describes the image content
- Response includes visual analysis results

## Checklist ✅

After completing the above tests, confirm the following checklist:

| Check Item | Expected Result | Status |
|------------|-----------------|--------|
| **Basic Connection** | Simple request from Step 1 succeeds | ☐ |
| **Thinking Model** | See thinking process in Step 2 | ☐ |
| **Gemini 3 Model** | Both models from Step 3 work normally | ☐ |
| **Variant Parameter** | Different variants produce different results | ☐ |
| **Streaming Output** | Response displays in real-time without interruption | ☐ |

::: tip All Passed?

If all check items pass, congratulations! The plugin is fully configured and ready for formal use.

Next steps you can take:
- [Explore Available Models](/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [Configure Multi-Account Load Balancing](/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [Enable Google Search](/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## Common Pitfalls

### Error 1: `Model not found`

**Error Message**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**Cause**
The model definition wasn't correctly added to `provider.google.models` in `opencode.json`.

**Solution**

Check the configuration file:

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

Confirm the model definition format is correct:

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning Watch Your Spelling

The model name must exactly match the key in the configuration file (case-sensitive):

- ❌ Incorrect: `--model=google/claude-sonnet-4-5`
- ✅ Correct: `--model=google/antigravity-claude-sonnet-4-5`

:::

### Error 2: `403 Permission Denied`

**Error Message**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**Cause**
1. OAuth authentication not completed
2. Account doesn't have access permission
3. Project ID configuration issue (for Gemini CLI models)

**Solution**

1. **Check authentication status**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   You should see at least one account record.

2. **If account is empty or authentication failed**:
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **If Gemini CLI model reports error**:
   Need to manually configure Project ID (see [FAQ - 403 Permission Denied](/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/))

### Error 3: `Invalid variant 'max'`

**Error Message**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**Cause**
Different models support different variant configuration formats.

**Solution**

Check the variant definition in the model configuration:

| Model Type | Variant Format | Example Value |
|------------|----------------|---------------|
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**Correct Configuration Example**:

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### Error 4: Request Timeout or No Response

**Symptoms**
No output for a long time after command execution, or eventually times out.

**Possible Causes**
1. Network connection issues
2. Server responding slowly
3. All accounts are in rate-limited state

**Solution**

1. **Check network connection**:
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **View debug logs**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **Check account status**:
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   If you see all accounts have `rateLimit` timestamps, it means they're all rate-limited and you need to wait for reset.

### Error 5: SSE Streaming Output Interrupted

**Symptoms**
Response stops midway, or you only see partial content.

**Possible Causes**
1. Unstable network
2. Account token expired during request
3. Server error

**Solution**

1. **Enable debug logs for detailed information**:
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **Check log file**:
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **If interruptions are frequent**:
   - Try switching to a more stable network environment
   - Use non-Thinking models to reduce request time
   - Check if accounts are approaching quota limits

## Lesson Summary

Sending the first request is a key step to verify successful installation. Through this lesson, you've learned:

- **Basic Requests**: Use `opencode run --model` to send requests
- **Variant Usage**: Configure thinking budget through `--variant`
- **Model Selection**: Choose Claude or Gemini models based on your needs
- **Troubleshooting**: Locate and solve problems based on error messages

::: tip Recommended Practices

In daily development:

1. **Start with simple tests**: After each configuration change, send a simple request first to verify
2. **Gradually increase complexity**: From no thinking → low thinking → max thinking
3. **Record baseline response**: Remember the response time under normal conditions for easier comparison
4. **Use debug logs wisely**: When encountering problems, enable `OPENCODE_ANTIGRAVITY_DEBUG=2`

---

## Coming Up Next

> Next, we'll learn **[Available Models Overview](/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**.
>
> You'll learn:
> - Complete list and characteristics of all available models
> - Guide to choosing between Claude and Gemini models
> - Comparison of context limits and output limits
> - Best use cases for Thinking models

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Function | File Path | Lines |
|----------|-----------|-------|
| Request transformation entry | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| Account selection and token management | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Claude model transformation | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | Full file |
| Gemini model transformation | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | Full file |
| Streaming response handling | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | Full file |
| Debug logging system | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | Full file |

**Key Functions**:
- `prepareAntigravityRequest()`: Converts OpenCode request to Antigravity format (`request.ts`)
- `createStreamingTransformer()`: Creates streaming response transformer (`core/streaming/`)
- `resolveModelWithVariant()`: Resolves model and variant configuration (`transform/model-resolver.ts`)
- `getCurrentOrNextForFamily()`: Selects account for request (`accounts.ts`)

**Configuration Examples**:
- Model configuration format: [`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Variant detailed explanation: [`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>
