---
title: "Quick Start: Install Plugin | opencode-md-table-formatter"
sidebarTitle: "Quick Start"
subtitle: "Quick Start: Install Plugin"
description: "Learn to install the OpenCode Markdown table formatter plugin in 1 minute. Configure opencode.jsonc to make AI-generated tables automatically aligned and beautiful."
tags:
  - "installation"
  - "configuration"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# Get Started in One Minute: Installation and Configuration

::: info What You'll Learn
- Install the table formatter plugin in OpenCode
- Make AI-generated Markdown tables automatically aligned
- Verify that the plugin is working correctly
:::

## Your Current Problem

AI-generated Markdown tables often look like this:

```markdown
| 名称 | 描述 | 状态 |
|--- | --- | ---|
| 功能A | 这是一个很长的描述文本 | 已完成 |
| B | 短 | 进行中 |
```

Column widths are uneven and look messy. Manually adjusting them? Too time-consuming.

## When to Use This Approach

- You frequently have AI generate tables (comparisons, checklists, configuration guides)
- You want tables to display neatly in OpenCode
- You don't want to manually adjust column widths every time

## 🎒 Prerequisites

::: warning Prerequisites
- OpenCode installed (version >= 1.0.137)
- Know where the `.opencode/opencode.jsonc` configuration file is located
:::

## Follow Along

### Step 1: Open the Configuration File

**Why**: Plugins are declared through the configuration file, which OpenCode automatically loads on startup.

Find your OpenCode configuration file:

::: code-group

```bash [macOS/Linux]
# Configuration file is usually in the project root directory
ls -la .opencode/opencode.jsonc

# Or in the user directory
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# Configuration file is usually in the project root directory
Get-ChildItem .opencode\opencode.jsonc

# Or in the user directory
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

Open this file with your preferred editor.

### Step 2: Add Plugin Configuration

**Why**: Tell OpenCode to load the table formatter plugin.

Add the `plugin` field to the configuration file:

```jsonc
{
  // ... other configurations ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip Already have other plugins?
If you already have a `plugin` array, add the new plugin to it:

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // Add here
  ]
}
```
:::

**You should see**: The configuration file saves successfully, with no syntax error prompts.

### Step 3: Restart OpenCode

**Why**: Plugins are loaded when OpenCode starts, so you need to restart after modifying the configuration.

Close the current OpenCode session and restart it.

**You should see**: OpenCode starts normally, with no errors.

### Step 4: Verify the Plugin Takes Effect

**Why**: Confirm that the plugin is correctly loaded and working.

Ask AI to generate a table, for example input:

```
帮我生成一个表格，对比 React、Vue、Angular 三个框架的特点
```

**You should see**: The AI-generated table has aligned column widths, like this:

```markdown
| 框架    | 特点                     | 学习曲线 |
|--- | --- | ---|
| React   | 组件化、虚拟 DOM         | 中等     |
| Vue     | 渐进式、双向绑定         | 较低     |
| Angular | 全功能框架、TypeScript   | 较高     |
```

## Checkpoints ✅

After completing the above steps, check the following points:

| Check item              | Expected result                                    |
|--- | ---|
| Configuration file syntax | No errors                                          |
| OpenCode startup        | Normal startup, no plugin loading errors           |
| AI-generated tables     | Column widths automatically aligned, separator row format unified |

## Common Pitfalls

### Table Not Formatted?

1. **Check configuration file path**: Ensure you've modified the configuration file that OpenCode actually reads
2. **Check plugin name**: Must be `@franlol/opencode-md-table-formatter@0.0.3`, note the `@` symbol
3. **Restart OpenCode**: Must restart after modifying configuration

### Seeing "invalid structure" comment?

This means the table structure doesn't conform to Markdown specification. Common causes:

- Missing separator row (`|---|---|`)
- Inconsistent number of columns across rows

See the [Troubleshooting](../../faq/troubleshooting/) section for details.

## Lesson Summary

- Plugins are configured through the `plugin` field in `.opencode/opencode.jsonc`
- Version `@0.0.3` ensures using a stable version
- Need to restart OpenCode after modifying configuration
- The plugin automatically formats all AI-generated Markdown tables

## Next Lesson Preview

> Next lesson we'll learn **[Feature Overview](../features/)**.
>
> You'll learn:
> - The 8 core features of the plugin
> - Width calculation principles in hidden mode
> - Which tables can be formatted and which cannot

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Feature            | File path                                                                                       | Line number |
|--- | --- | ---|
| Plugin entry point | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23        |
| Hook registration  | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L11-L13) | 11-13       |
| Package config     | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41        |

**Key constants**:
- `@franlol/opencode-md-table-formatter@0.0.3`: npm package name and version
- `experimental.text.complete`: hook name the plugin listens to

**Dependency requirements**:
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>
