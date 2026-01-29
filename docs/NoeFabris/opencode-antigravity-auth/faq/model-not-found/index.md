---
title: "Model Not Found: Fix 400 Errors | opencode-antigravity-auth"
sidebarTitle: "Model Not Found"
subtitle: "Model Not Found: Fix 400 Errors"
description: "Learn to fix model not found and 400 errors in opencode-antigravity-auth. Diagnose MCP compatibility issues, update to beta version, and resolve tool call failures."
tags:
  - "troubleshooting"
  - "model-errors"
  - "400-error"
  - "MCP"
prerequisite:
  - "start-quick-install"
order: 3
---

# Model Not Found and 400 Error Troubleshooting

## Your Problem

When using Antigravity models, you may encounter the following errors:

| Error Message | Typical Symptoms |
|--- | ---|
| `Model not found` | Indicates model doesn't exist, cannot make requests |
| `Invalid JSON payload received. Unknown name "parameters"` | 400 error, tool calls fail |
| MCP server call errors | Specific MCP tools unavailable |

These issues are usually related to configuration, MCP server compatibility, or plugin version.

## Quick Diagnosis

Before diving deep, confirm the following:

**macOS/Linux**:
```bash
# Check plugin version
grep "opencode-antigravity-auth" ~/.config/opencode/opencode.json

# Check configuration file
cat ~/.config/opencode/antigravity.json | grep -E "(google|npm)"
```

**Windows**:
```powershell
# Check plugin version
Get-Content "$env:USERPROFILE\.config\opencode\opencode.json" | Select-String "opencode-antigravity-auth"

# Check configuration file
Get-Content "$env:USERPROFILE\.config\opencode\antigravity.json" | Select-String "google|npm"
```

---

## Problem 1: Model not found

**Error symptom**:

```
Model not found: antigravity-claude-sonnet-4-5
```

**Cause**: OpenCode's Google provider configuration is missing the `npm` field.

**Solution**:

In your `~/.config/opencode/opencode.json`, add the `npm` field to the `google` provider:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

**Verification steps**:

1. Edit `~/.config/opencode/opencode.json`
2. Save the file
3. Retry calling the model in OpenCode
4. Check if "Model not found" error still occurs

::: tip Tip
If you're unsure about the configuration file location, run:
```bash
opencode config path
```
:::

---

## Problem 2: 400 Error - Unknown name 'parameters'

**Error symptom**:

```
Invalid JSON payload received. Unknown name "parameters" at 'request.tools[0]'
```

**What's this problem?**

Gemini 3 models use **strict protobuf validation**, while Antigravity API requires tool definitions in a specific format:

```json
// ❌ Incorrect format (will be rejected)
{
  "tools": [
    {
      "name": "my_tool",
      "parameters": { ... }  // ← This field is not accepted
    }
  ]
}

// ✅ Correct format
{
  "tools": [
    {
      "functionDeclarations": [
        {
          "name": "my_tool",
          "description": "...",
          "parameters": { ... }  // ← Inside functionDeclarations
        }
      ]
    }
  ]
}
```

The plugin automatically converts the format, but some **MCP servers return Schemas containing incompatible fields** (like `const`, `$ref`, `$defs`), causing cleanup failures.

### Solution 1: Update to latest beta version

The latest beta version includes Schema cleanup fixes:

```json
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```

**macOS/Linux**:
```bash
npm install -g opencode-antigravity-auth@beta
```

**Windows**:
```powershell
npm install -g opencode-antigravity-auth@beta
```

### Solution 2: Disable MCP servers one by one to diagnose

Some MCP servers return Schema formats that don't meet Antigravity requirements.

**Steps**:

1. Open `~/.config/opencode/opencode.json`
2. Find `mcpServers` configuration
3. **Disable all MCP servers** (comment out or delete)
4. Retry calling the model
5. If successful, **enable MCP servers one by one**, testing after each
6. Once the problematic MCP server is identified, disable it or report the issue to that project's maintainer

**Example configuration**:

```json
{
  "mcpServers": {
    // "filesystem": { ... },  ← Temporarily disabled
    // "github": { ... },       ← Temporarily disabled
    "brave-search": { ... }     ← Test this one first
  }
}
```

### Solution 3: Add npm override

If the above methods don't work, force the use of `@ai-sdk/google` in the `google` provider configuration:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google"
    }
  }
}
```

---

## Problem 3: MCP servers causing tool call failures

**Error symptoms**:

- Specific tools unavailable (e.g., WebFetch, file operations)
- Error hints at Schema-related issues
- Other tools work normally

**Cause**: JSON Schema returned by MCP server contains fields not supported by Antigravity API.

### Incompatible Schema Characteristics

The plugin automatically cleans the following incompatible features (source `src/plugin/request-helpers.ts:24-37`):

| Feature | Conversion Method | Example |
|--- | --- | ---|
| `const` | Convert to `enum` | `{ const: "text" }` → `{ enum: ["text"] }` |
| `$ref` | Convert to description hint | `{ $ref: "#/$defs/Foo" }` → `{ type: "object", description: "See: Foo" }` |
| `$defs` / `definitions` | Expand into schema | References no longer used |
| `minLength` / `maxLength` / `pattern` | Move to description | Add to `description` hint |
| `additionalProperties` | Move to description | Add to `description` hint |

However, if Schema structure is too complex (like multi-level nested `anyOf`/`oneOf`), cleanup may fail.

### Diagnosis Process

```bash
# Enable debug logs
export OPENCODE_ANTIGRAVITY_DEBUG=1  # macOS/Linux
$env:OPENCODE_ANTIGRAVITY_DEBUG=1     # Windows PowerShell

# Restart OpenCode

# View Schema conversion errors in logs
tail -f ~/.config/opencode/antigravity-logs/*.log
```

**Keywords to look for in logs**:

- `cleanJSONSchemaForAntigravity`
- `Failed to clean schema`
- `Unsupported keyword`
- `anyOf/oneOf flattening failed`

### Reporting Issues

If you've identified a specific MCP server causing the problem, please submit a [GitHub issue](https://github.com/NoeFabris/opencode-antigravity-auth/issues), including:

1. **MCP server name and version**
2. **Complete error logs** (from `~/.config/opencode/antigravity-logs/`)
3. **Example of tool triggering the problem**
4. **Plugin version** (run `opencode --version`)

---

## Common Pitfalls

::: warning Plugin Loading Order

If you're using both `opencode-antigravity-auth` and `@tarquinen/opencode-dcp`, **place the Antigravity Auth plugin first**:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",  ← Must come before DCP
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

DCP creates synthetic assistant messages lacking thought blocks, which may cause signature verification errors.
:::

::: warning Configuration Key Name Error

Make sure to use `plugin` (singular), not `plugins` (plural):

```json
// ❌ Incorrect
{
  "plugins": ["opencode-antigravity-auth@beta"]
}

// ✅ Correct
{
  "plugin": ["opencode-antigravity-auth@beta"]
}
```
:::

---

## When to Seek Help

If the problem persists after trying all the above methods:

**Check log files**:
```bash
cat ~/.config/opencode/antigravity-logs/latest.log
```

**Reset account** (clear all state):
```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

**Submit GitHub issue**, including:
- Complete error message
- Plugin version (`opencode --version`)
- `~/.config/opencode/antigravity.json` configuration (**remove sensitive info like refreshToken**)
- Debug logs (`~/.config/opencode/antigravity-logs/latest.log`)

---

## Related Courses

- [Quick Installation Guide](/NoeFabris/opencode-antigravity-auth/start/quick-install/) - Basic configuration
- [Plugin Compatibility](/NoeFabris/opencode-antigravity-auth/faq/plugin-compatibility/) - Troubleshooting other plugin conflicts
- [Debug Logging](/NoeFabris/opencode-antigravity-auth/advanced/debug-logging/) - Enable verbose logging

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to view source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| JSON Schema cleanup main function | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 658-685 |
| Convert const to enum | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 86-104 |
| Convert $ref to hints | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 55-80 |
| Flatten anyOf/oneOf | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts) | 368-453 |
| Gemini tool format conversion | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 425-517 |

**Key Constants**:
- `UNSUPPORTED_KEYWORDS`: Schema keywords removed (`request-helpers.ts:33-37`)
- `UNSUPPORTED_CONSTRAINTS`: Constraints moved to description (`request-helpers.ts:24-28`)

**Key Functions**:
- `cleanJSONSchemaForAntigravity(schema)`: Cleans incompatible JSON Schema
- `convertConstToEnum(schema)`: Converts `const` to `enum`
- `convertRefsToHints(schema)`: Converts `$ref` to description hints
- `flattenAnyOfOneOf(schema)`: Flattens `anyOf`/`oneOf` structures

</details>
