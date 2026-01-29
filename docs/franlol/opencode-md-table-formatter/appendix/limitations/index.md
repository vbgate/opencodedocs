---
title: "Limitations: Plugin Boundaries | opencode-md-table-formatter"
sidebarTitle: "Limitations"
subtitle: "Limitations: Plugin Boundaries | opencode-md-table-formatter"
description: "Learn opencode-md-table-formatter limitations. Understand unsupported HTML tables, multi-line cells, and tables without separator rows. Avoid unsupported scenarios and improve efficiency."
tags:
  - "Known Limitations"
  - "HTML Tables"
  - "Multi-line Cells"
  - "Tables Without Separator Rows"
prerequisite:
  - "start-features"
order: 70
---

# Known Limitations: Where Are the Plugin's Boundaries

::: info What You'll Learn
- Know which table types are not supported by the plugin
- Avoid using the plugin in unsupported scenarios
- Understand the plugin's technical boundaries and design trade-offs
:::

## Core Concept

This plugin focuses on one goal: **optimizing Markdown pipe table formatting for OpenCode's concealment mode**.

To achieve this, we intentionally limited some features to ensure reliability and performance in core scenarios.

## Overview of Known Limitations

| Limitation | Description | Planned Support |
| --- | --- | --- |
| **HTML Tables** | Only supports Markdown pipe tables (`\| ... \|`) | ❌ No |
| **Multi-line Cells** | Cannot contain `<br>` or other line break tags in cells | ❌ No |
| **Tables Without Separator Rows** | Must have `|---|` separator row | ❌ No |
| **Merged Cells** | Does not support row or column spanning | ❌ No |
| **No Header Tables** | Separator row is treated as header, cannot create headerless tables | ❌ No |
| **Configuration Options** | Cannot customize column width, disable features, etc. | 🤔 Maybe |
| **Extra Large Tables** | Performance for 100+ row tables not verified | 🤔 Maybe |

---

## Detailed Limitations

### 1. HTML Tables Not Supported

**Issue**

```html
<!-- This table will not be formatted -->
<table>
  <tr>
    <th>Column 1</th>
    <th>Column 2</th>
  </tr>
  <tr>
    <td>Data 1</td>
    <td>Data 2</td>
  </tr>
</table>
```

**Reason**

The plugin only processes Markdown pipe tables, which use `|` as a separator:

```markdown
| Column 1 | Column 2 |
| --- | --- |
| Data 1 | Data 2 |
```

**Source Code Evidence**

```typescript
// index.ts:58-61
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```

The detection logic only matches lines that start and end with `|`, so HTML tables are skipped entirely.

**Workaround**

If you need to format HTML tables, consider:
- Using other specialized HTML formatting tools
- Converting HTML tables to Markdown pipe tables

---

### 2. Multi-line Cells Not Supported

**Issue**

```markdown
| Column 1 | Column 2 |
| --- | --- |
| Line 1<br>Line 2 | Single line |
```

You will see `<!-- table not formatted: invalid structure -->` comment in the output.

**Reason**

The plugin processes tables line by line and does not support line breaks within cells.

**Source Code Evidence**

```typescript
// index.ts:25-56
function formatMarkdownTables(text: string): string {
  const lines = text.split("\n")
  // ... line-by-line scanning, no multi-line merging logic
}
```

**Workaround**

- Split multi-line content into multiple data rows
- Or accept a wider table with content on a single line

---

### 3. Tables Without Separator Rows Not Supported

**Issue**

```markdown
<!-- Missing separator row -->
| Column 1 | Column 2 |
| Data 1 | Data 2 |
| Data 3 | Data 4 |
```

You will see `<!-- table not formatted: invalid structure -->` comment.

**Reason**

Markdown pipe tables must include a separator row to define the number of columns and alignment.

**Source Code Evidence**

```typescript
// index.ts:86-87
const hasSeparator = lines.some((line) => isSeparatorRow(line))
return hasSeparator  // Returns false if no separator row
```

**Correct Format**

```markdown
| Column 1 | Column 2 |
| --- | --- |  ← Separator row
| Data 1 | Data 2 |
| Data 3 | Data 4 |
```

---

### 4. Merged Cells Not Supported

**Issue**

```markdown
| Column 1 | Column 2 |
| --- | --- |
| Merged two columns |  ← Expect to span column 1 and column 2
| Data 1 | Data 2 |
```

**Reason**

Markdown standard does not support merged cell syntax, and the plugin does not implement any merging logic.

**Workaround**

- Use empty cells as placeholders: `| Merged two columns | |`
- Or accept Markdown's limitation and switch to HTML tables

---

### 5. Separator Row Treated as Header

**Issue**

```markdown
| :--- | :---: | ---: |
| Left | Center | Right |
| Data 1 | Data 2 | Data 3 |
```

The separator row is treated as a header row, making it impossible to create headerless pure data tables.

**Reason**

The Markdown specification treats the first line after the separator row as the table header.

**Workaround**

- This is a limitation of Markdown itself, not specific to this plugin
- For headerless tables, consider other formats like CSV

---

### 6. No Configuration Options

**Issue**

Cannot adjust via configuration file:
- Minimum/maximum column width
- Disable specific features
- Custom cache policy

**Reason**

The current version (v0.0.3) does not provide a configuration interface. All parameters are hardcoded in the source code.

::: tip Version Note
The current plugin version is v0.0.3 (as declared in package.json). v0.1.0 recorded in CHANGELOG.md is a future version plan and has not been released yet.
:::

**Source Code Evidence**

```typescript
// index.ts:115 - Column minimum width hardcoded to 3
const colWidths: number[] = Array(colCount).fill(3)

// index.ts:222 - Cache threshold hardcoded
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Future Plans**

The CHANGELOG mentions possible future support:
> Configuration options (min/max column width, disable features)

---

### 7. Extra Large Tables Performance Not Verified

**Issue**

For tables with 100+ rows, formatting may be slow or consume more memory.

**Reason**

The plugin uses line-by-line scanning and a caching mechanism, which theoretically can handle large tables, but no specific performance optimization has been done.

**Source Code Evidence**

```typescript
// index.ts:5-7
const widthCache = new Map<string, number>()
let cacheOperationCount = 0

// Cache is cleared after 100 operations or 1000 entries
if (cacheOperationCount > 100 || widthCache.size > 1000) {
  cleanupCache()
}
```

**Recommendation**

- For extra large tables, consider splitting into multiple smaller tables
- Or wait for future performance-optimized versions

---

## Checkpoints

After completing this lesson, you should be able to answer:

- [ ] Which table formats does the plugin support? (Answer: Only Markdown pipe tables)
- [ ] Why can't multi-line cells be formatted? (Answer: Plugin processes line by line, no merging logic)
- [ ] What is the purpose of the separator row? (Answer: Defines column count and alignment, required)
- [ ] Can column width be customized? (Answer: Not supported in current version)

---

## Common Pitfalls

::: warning Common Mistakes

**Mistake 1**: Expecting HTML tables to be formatted

The plugin only processes Markdown pipe tables. HTML tables need manual formatting or other tools.

**Mistake 2**: Tables without separator row

The separator row is a required part of Markdown tables. Missing it results in an "invalid structure" error.

**Mistake 3**: Cell content too long, making the table too wide

The plugin has no maximum column width limit. If cell content is too long, the entire table becomes very wide. Consider manual line breaks or simplifying content.

:::

---

## Lesson Summary

| Limitation | Reason | Workaround |
| --- | --- | --- |
| HTML tables not supported | Plugin focuses on Markdown pipe tables | Use HTML formatting tools |
| Multi-line cells not supported | Line-by-line processing logic | Split into multiple rows or accept wider table |
| Tables without separator not supported | Markdown specification requirement | Add `|---|` separator row |
| No configuration options | Not implemented in current version | Wait for future version updates |

## Next Lesson Preview

> In the next lesson, we will learn **[Technical Details](../tech-details/)**.
>
> You will learn:
> - How the plugin's caching mechanism works
> - Performance optimization strategies
> - Why the cache is cleared after 100 operations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Limitation | File Path | Line Number |
| --- | --- | --- |
| HTML table detection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Separator row detection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| Table validation (must include separator row) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Column minimum width hardcoded | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L115) | 115 |
| Cache threshold hardcoded | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L222-L224) | 222-224 |

**Key Functions**:
- `isTableRow()`: Detects if a line is a Markdown pipe table row
- `isSeparatorRow()`: Detects separator row
- `isValidTable()`: Validates table structure validity

**Key Constants**:
- `colWidths minimum width = 3`: Minimum display width for columns
- `Cache threshold = 100 operations or 1000 entries`: Condition to trigger cache cleanup

**CHANGELOG Reference**:
- Known limitations section: [`CHANGELOG.md`](https://github.com/franlol/opencode-md-table-formatter/blob/main/CHANGELOG.md#L31-L36) lines 31-36

</details>
