---
title: "故障排查: 表格格式化问题 | opencode-md-table-formatter"
sidebarTitle: "故障排查"
subtitle: "故障排查: 表格格式化问题"
description: "学习快速诊断和解决表格格式化问题。涵盖配置错误、无效结构、版本要求和已知限制，提供详细的症状诊断和解决方案。"
tags:
  - "troubleshooting"
  - "FAQ"
prerequisite:
  - "start-getting-started"
order: 60
---

# FAQ: Tables Not Formatting? Troubleshooting Guide

## What You'll Learn

This lesson will help you quickly diagnose and resolve common issues when using the plugin:

- Identify why tables aren't formatting
- Understand the meaning of "invalid structure" errors
- Learn about the plugin's known limitations and scenarios where it doesn't apply
- Quickly verify if your configuration is correct

---

## Problem 1: Tables Not Formatting Automatically

### Symptoms

AI generated a table, but column widths are inconsistent and not aligned.

### Possible Causes and Solutions

#### Cause 1: Plugin Not Configured

**Check Steps**:

1. Open the `.opencode/opencode.jsonc` file
2. Confirm the plugin is in the `plugin` array:

```jsonc
{
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

3. If not, add the plugin configuration
4. **Restart OpenCode** to make the configuration take effect

::: tip Configuration Format
Ensure the version number and package name are correct. Use the format `@franlol/opencode-md-table-formatter` + `@` + version number.
:::

#### Cause 2: OpenCode Not Restarted

**Solution**:

After adding the plugin, you must completely restart OpenCode (not just refresh the page) for the plugin to load.

#### Cause 3: Table Missing Separator Row

**Symptom Example**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

This type of table won't be formatted.

**Solution**:

Add a separator row (second row, using `|---|` format):

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

::: info Purpose of Separator Row
The separator row is standard Markdown syntax used to distinguish header rows from content rows, and also to specify alignment. The plugin **must** detect a separator row before formatting the table.
:::

#### Cause 4: OpenCode Version Too Low

**Check Steps**:

1. Open the OpenCode help menu
2. Check the current version number
3. Confirm version >= 1.0.137

**Solution**:

Upgrade to the latest version of OpenCode.

::: warning Version Requirement
The plugin uses the `experimental.text.complete` hook, which is available in OpenCode version 1.0.137+.
:::

---

## Problem 2: Seeing "invalid structure" Comment

### Symptoms

This comment appears at the end of the table:

```markdown
<!-- table not formatted: invalid structure -->
```

### What Is "Invalid Table Structure"

The plugin validates every Markdown table, and only tables that pass validation are formatted. If the table structure doesn't conform to specifications, the plugin preserves the original text and adds this comment.

### Common Causes

#### Cause 1: Insufficient Table Rows

**Error Example**:

```markdown
| Name |
```

Only 1 row, incomplete format.

**Correct Example**:

```markdown
| Name |
|---|
```

At least 2 rows are required (including separator row).

#### Cause 2: Inconsistent Column Count

**Error Example**:

```markdown
| Name | Age |
|--- | ---|
| Alice |
```

First row has 2 columns, second row has 1 column. Column count is inconsistent.

**Correct Example**:

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
```

All rows must have the same number of columns.

#### Cause 3: Missing Separator Row

**Error Example**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

No separator row like `|---|---|`.

**Correct Example**:

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

### How to Quickly Diagnose

Use the following checklist:

- [ ] Table has at least 2 rows
- [ ] All rows have the same number of columns (count the number of `|` in each row)
- [ ] Separator row exists (second row is usually in `|---|` format)

If all conditions are met but the error persists, check for hidden characters or extra spaces causing column count calculation errors.

---

## Problem 3: Seeing "table formatting failed" Comment

### Symptoms

This comment appears at the end of the text:

```markdown
<!-- table formatting failed: {error message} -->
```

### Cause

This indicates the plugin threw an unexpected internal exception.

### Solution

1. **Check the error message**: The `{error message}` part in the comment explains the specific problem
2. **Check table content**: Confirm if there are extreme special cases (such as very long single lines, special character combinations)
3. **Preserve original text**: Even if formatting fails, the plugin won't destroy your original text, your content is safe
4. **Report the issue**: If the problem repeatedly occurs, you can submit an issue report at [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues)

::: tip Error Isolation
The plugin wraps formatting logic in try-catch, so even if an error occurs, it won't interrupt the OpenCode workflow.
:::

---

## Problem 4: Certain Table Types Not Supported

### Unsupported Table Types

#### HTML Tables

**Not Supported**:

```html
<table>
  <tr><th>Name</th></tr>
  <tr><td>Alice</td></tr>
</table>
```

**Only Supports**: Markdown Pipe Tables

#### Multi-line Cells

**Not Supported**:

```markdown
| Name | Description |
|--- | ---|
| Alice | Line 1<br>Line 2 |
```

::: info Why Not Supported
The plugin is designed for simple tables generated by AI. Multi-line cells require more complex layout logic.
:::

#### Tables Without Separator Rows

**Not Supported**:

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

Must have a separator row (see "Cause 3" above).

---

## Problem 5: Tables Still Appear Misaligned After Formatting

### Possible Causes

#### Cause 1: Concealment Mode Not Enabled

The plugin is optimized for OpenCode's Concealment Mode, which hides Markdown symbols (like `**`, `*`).

If your editor hasn't enabled concealment mode, tables may appear "misaligned" because Markdown symbols take up actual width.

**Solution**:

Confirm OpenCode concealment mode is enabled (enabled by default).

#### Cause 2: Excessively Long Cell Content

If a cell's content is very long, the table may stretch quite wide.

This is normal behavior. The plugin won't truncate content.

#### Cause 3: Symbols in Inline Code

Markdown symbols in inline code (`` `**code**` ``) are calculated at **literal width** and won't be stripped.

**Example**:

```
| Symbol | Width |
|--- | ---|
| Normal text | 4 |
| `**bold**` | 8 |
```

This is correct behavior because in concealment mode, symbols inside code blocks are visible.

---

## Lesson Summary

Through this lesson, you've learned:

- **Diagnose tables not formatting**: Check configuration, restart, version requirements, separator rows
- **Understand invalid table errors**: Row count, column count, separator row validation
- **Identify known limitations**: HTML tables, multi-line cells, tables without separator rows not supported
- **Quick self-check**: Use checklist to verify table structure

---

## Still Not Resolved?

If you've checked all the above issues but the problem still exists:

1. **Check full logs**: The plugin runs silently by default with no detailed logs
2. **Submit an Issue**: Provide your table example and error message at [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues)
3. **Reference advanced lessons**: Read [Table Specification](../../advanced/table-spec/) and [Concealment Mode Principles](../../advanced/concealment-mode/) for more technical details

---

## Next Lesson Preview

> Next lesson we'll learn **[Known Limitations: Plugin Boundaries](../../appendix/limitations/)**.
>
> You'll learn:
> - Plugin design boundaries and constraints
> - Possible future enhancements
> - How to determine if a scenario is suitable for using this plugin

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Feature            | File path                                                                                    | Line number |
|--- | --- | ---|
| Table validation logic | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88)     | 70-88       |
| Table row detection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61)     | 58-61       |
| Separator row detection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68)     | 63-68       |
| Error handling     | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L15-L20)     | 15-20       |
| Invalid table comment | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47)     | 44-47       |

**Key Business Rules**:
- `isValidTable()`: Validates that table must have at least 2 rows, all rows have consistent column counts, and a separator row exists (lines 70-88)
- `isSeparatorRow()`: Uses regex `/^\s*:?-+:?\s*$/` to detect separator rows (lines 63-68)
- Column minimum width: 3 characters (line 115)

**Error Handling Mechanism**:
- try-catch wraps the main processing function (lines 15-20)
- Formatting failure: Preserve original text + add `<!-- table formatting failed: {message} -->` comment
- Validation failure: Preserve original text + add `<!-- table not formatted: invalid structure -->` comment

</details>
