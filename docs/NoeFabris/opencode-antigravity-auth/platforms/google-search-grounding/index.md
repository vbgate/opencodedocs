---
title: "Google Search: 实时搜索配置 | opencode-antigravity-auth"
sidebarTitle: "Google Search"
subtitle: "Google Search: 实时搜索配置"
description: "学习 Google Search Grounding 的配置和使用方法。通过 grounding_threshold 控制搜索频率，让 Gemini 模型获取实时网络信息。"
order: 3
---

The latest stable version of VS Code is 1.96.4 (as of January 2026)...

[citation:1] ← Citation source marker
```

**You should see**:
- Model response includes citation sources (`[citation:1]`, etc.)
- Response content is up-to-date, not old version from training data

### Step 5: Test Different Thresholds

Try adjusting `grounding_threshold` and observe model behavior changes:

```json
// Low threshold (frequent searches)
"grounding_threshold": 0.1

// High threshold (rare searches)
"grounding_threshold": 0.7
```

After each adjustment, test with the same question and observe:
- Whether it searches (check if response has citations)
- Search count (multiple `citation`s)
- Response speed

**You should see**:
- Low threshold: More frequent searches, but slightly slower response
- High threshold: Fewer searches, but potentially inaccurate answers

## Checkpoint ✅

::: details Click to expand verification checklist

Complete the following checks to confirm correct configuration:

- [ ] Configuration file contains `web_search` configuration
- [ ] `default_mode` set to `"auto"`
- [ ] `grounding_threshold` is between `0.0` and `1.0`
- [ ] Make a request requiring real-time information, model returns response with citations
- [ ] After adjusting threshold, model search behavior changes

If all pass, Google Search Grounding is correctly enabled!

:::

## Troubleshooting

### Problem 1: Model Not Searching

**Symptoms**: After enabling `auto` mode, the model still doesn't search, and no citation sources appear.

**Causes**:
- Threshold too high (e.g., `0.9`), model needs very high confidence to search
- Question itself doesn't require searching (e.g., programming problems)

**Solutions**:
- Lower `grounding_threshold` to `0.2` or below
- Test with questions that clearly need real-time information (e.g., "What's the weather today", "Latest news")

### Problem 2: Too Frequent Searches, Slow Responses

**Symptoms**: Every question triggers a search, response time significantly increases.

**Causes**:
- Threshold too low (e.g., `0.1`), model triggers searches too frequently
- Question type itself requires real-time information (e.g., stock prices, news)

**Solutions**:
- Raise `grounding_threshold` to `0.5` or higher
- If the task doesn't need real-time information, change `default_mode` to `"off"`

### Problem 3: Configuration File Format Error

**Symptoms**: Plugin reports error, cannot load configuration.

**Cause**: JSON format error (e.g., extra commas, mismatched quotes).

**Solution**: Use a JSON validation tool to check the configuration file, ensure correct format.

```bash
# Validate JSON format
cat ~/.config/opencode/antigravity.json | python3 -m json.tool
```

## Summary

- **Google Search Grounding** enables Gemini models to search real-time web information
- Enable with `web_search.default_mode: "auto"`, disable with `"off"`
- `grounding_threshold` controls search frequency: lower values mean more frequent searches
- Default threshold `0.3` works for most scenarios, adjust based on experience
- Model will cite sources in responses, marked as `[citation:1]`, etc.

## Next Lesson Preview

> Next, we'll learn about **[Dual Quota System](../dual-quota-system/)**.
>
> You'll learn:
> - How the two independent quota pools (Antigravity and Gemini CLI) work
> - How to switch between quota pools to maximize utilization
> - Best practices for quota pooling

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to view source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| Google Search Config Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 303-319 |
| Google Search Type Definitions | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 85-88 |
| Google Search Injection Logic | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 402-419 |
| Google Search Config Loading | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 173-184 |
| Google Search Config Application | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts) | 1194-1196 |

**Key Configuration Options**:

- `web_search.default_mode`: `"auto"` or `"off"`, defaults to `"off"`
- `web_search.grounding_threshold`: `0.0` - `1.0`, defaults to `0.3`

**Key Functions**:

- `applyGeminiTransforms()`: Applies all Gemini transformations, including Google Search injection
- `normalizeGeminiTools()`: Normalizes tool format, preserves `googleSearchRetrieval` tool
- `wrapToolsAsFunctionDeclarations()`: Wraps tools as `functionDeclarations` format

**How It Works**:

1. Plugin reads `web_search.default_mode` and `web_search.grounding_threshold` from configuration file
2. When `mode === "auto"`, injects `googleSearchRetrieval` tool in the request's `tools` array:
   ```json
   {
     "googleSearchRetrieval": {
       "dynamicRetrievalConfig": {
         "mode": "MODE_DYNAMIC",
         "dynamicThreshold": 0.3  // grounding_threshold
       }
     }
   }
   ```
3. Gemini model decides whether to call the search tool based on the threshold
4. Search results are included in the response, marked with citation sources (`[citation:1]`, etc.)

</details>
