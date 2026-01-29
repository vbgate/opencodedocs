---
title: "Table Spec: Valid Tables | opencode-md-table-formatter"
sidebarTitle: "Table Spec"
subtitle: "Table Spec: Valid Tables"
description: "Master the 4 valid conditions for Markdown tables. Learn leading/trailing pipe symbols, separator row syntax, and consistent column count to format AI-generated tables successfully."
tags:
  - "table validation"
  - "separator row"
  - "consistent columns"
  - "alignment syntax"
prerequisite:
  - "start-features"
order: 40
---

# Table Specification: What Makes a Table Formattable

::: info What You'll Learn
- Know what kinds of tables can be formatted by the plugin
- Understand the causes of `invalid structure` errors
- Write Markdown tables that conform to specifications
:::

## Your Current Problem

AI generated a table, but the plugin didn't format it and added this comment at the end:

```markdown
<!-- table not formatted: invalid structure -->
```

What is "invalid structure"? Why doesn't my table work?

## When to Use This Approach

- You encounter an `invalid structure` error and want to know what went wrong
- You want to ensure AI-generated tables are formatted correctly
- You want to hand-write a Markdown table that conforms to specifications

## Core Concept

The plugin performs three layers of validation before formatting:

```
Layer 1: Is it a table row? → isTableRow()
Layer 2: Does it have a separator row? → isSeparatorRow()
Layer 3: Is the structure valid? → isValidTable()
```

Only when all three layers pass will it format. If any layer fails, it keeps the original and adds an error comment.

## 4 Conditions for a Valid Table

### Condition 1: Each row must start and end with `|`

This is the most basic requirement. Every row of a Markdown pipe table must be wrapped with `|`.

```markdown
✅ Correct
| Name | Description |

❌ Wrong
Name | Description      ← Missing leading |
| Name | Description     ← Missing trailing |
```

::: details Source Code Implementation
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
Source location: `index.ts:58-61`
:::

### Condition 2: Each row must have at least 2 separators

`split("|").length > 2` means there must be at least 2 `|` separating content.

```markdown
✅ Correct (3 |, 2 separators)
| Name | Description |

❌ Wrong (only 2 |, 1 separator)
| Name |
```

In other words, **single-column tables are valid**, but must be written in the form `| content |`.

### Condition 3: Must have a separator row

The separator row is the line between the header and data rows, used to define alignment methods.

```markdown
| Name | Description |
| --- | --- |      ← This is the separator row
| Value 1 | Value 2 |
```

**Syntax rules for separator rows**:

Each cell must match the regex `/^\s*:?-+:?\s*$/`, which translates to:

| Component | Meaning | Example |
|--- | --- | ---|
| `\s*` | Optional whitespace | Allows `| --- |` or `|---|` |
| `:?` | Optional colon | Used to specify alignment method |
| `-+` | At least one dash | `-`, `---`, `------` all work |

**Valid separator row examples**:

```markdown
| --- | --- |           ← Simplest form
| :--- | ---: |         ← With alignment markers
| :---: | :---: |       ← Center alignment
|---|---|               ← No spaces also works
| -------- | -------- | ← Long dashes also work
```

**Invalid separator row examples**:

```markdown
| === | === |           ← Used equals sign, not dash
| - - | - - |           ← Spaces between dashes
| ::: | ::: |           ← Only colons, no dashes
```

::: details Source Code Implementation
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
Source location: `index.ts:63-68`
:::

### Condition 4: All rows must have the same number of columns

If the first row has 3 columns, every subsequent row must also have 3 columns.

```markdown
✅ Correct (each row has 3 columns)
| A | B | C |
|--- | --- | ---|
| 1 | 2 | 3 |

❌ Wrong (third row only has 2 columns)
| A | B | C |
|--- | --- | ---|
| 1 | 2 |
```

::: details Source Code Implementation
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
Source location: `index.ts:70-88`
:::

## Alignment Syntax Quick Reference

The separator row is not only for separation, but also for specifying alignment methods:

| Syntax | Alignment | Effect |
|--- | --- | ---|
| `---` or `:---` | Left-aligned | Text aligned left (default) |
| `:---:` | Center-aligned | Text centered |
| `---:` | Right-aligned | Text aligned right |

**Example**:

```markdown
| Left-aligned | Center | Right-aligned |
|--- | --- | ---|
| Text | Text | Text |
```

After formatting:

```markdown
| Left-aligned |  Center  | Right-aligned |
|--- | --- | ---|
| Text         |  Text    |          Text |
```

::: details Source Code Implementation
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
Source location: `index.ts:141-149`
:::

## Common Error Troubleshooting

| Error Symptom | Possible Cause | Solution |
|--- | --- | ---|
| `invalid structure` | Missing separator row | Add `\| --- \| --- \|` after the header |
| `invalid structure` | Inconsistent column count | Check if each row has the same number of `\|` |
| `invalid structure` | Missing leading/trailing `\|` | Add the missing `\|` |
| Table not detected | Only 1 column | Ensure at least 2 `\|` separators |
| Alignment not working | Separator row syntax error | Check if `-` is used instead of other characters |

## Checkpoints

After completing this lesson, you should be able to answer:

- [ ] What conditions must table rows meet? (Answer: Start and end with `|`, at least 2 separators)
- [ ] What does the separator row regex mean? (Answer: Optional colon + at least one dash + optional colon)
- [ ] Why does `invalid structure` occur? (Answer: Missing separator row, inconsistent column count, or missing leading/trailing `|`)
- [ ] What alignment does `:---:` represent? (Answer: Center alignment)

## Lesson Summary

| Condition | Requirement |
|--- | ---|
| Leading/trailing | Must start and end with `\|` |
| Separator count | At least 2 `\|` |
| Separator row | Must have, format is `:?-+:?` |
| Consistent columns | All rows must have the same number of columns |

**Memory Mnemonic**:

> Pipe wrapped on both sides, separator row has dashes, consistent columns can't be missing, keep these four rules in mind.

## Next Lesson Preview

> In the next lesson, we'll dive into **[Alignment Details](../alignment/)**.
>
> You'll learn:
> - Detailed usage of the three alignment methods
> - Implementation principles of separator row formatting
> - Cell padding algorithm

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Function | File path | Line number |
|--- | --- | ---|
| Table row detection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Separator row detection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Table validation | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Alignment method parsing | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Invalid table handling | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**Key regex**:
- `/^\s*:?-+:?\s*$/`: Separator row cell matching rule

**Key functions**:
- `isTableRow()`: Determine if a row is a table row
- `isSeparatorRow()`: Determine if a row is a separator row
- `isValidTable()`: Verify if table structure is valid
- `getAlignment()`: Parse alignment method

</details>
