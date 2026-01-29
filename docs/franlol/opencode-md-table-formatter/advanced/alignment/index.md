---
title: "Alignment: Left, Center, Right | opencode-md-table-formatter"
sidebarTitle: "Alignment"
subtitle: "Alignment: Left, Center, Right"
description: "Learn three Markdown table alignment methods: left, center, right. Master separator row syntax and cell padding algorithm to format AI-generated tables beautifully."
tags:
  - "left align"
  - "center align"
  - "right align"
  - "separator row syntax"
prerequisite:
  - "advanced-table-spec"
order: 50
---

# Alignment Details: Left, Center, Right

::: info What You'll Learn
- Master the syntax and effects of three alignment methods
- Understand how the separator row specifies alignment
- Learn how the cell padding algorithm works
- Know why the separator row automatically adjusts width
:::

## Your Current Problem

AI generated a table, but the column alignment isn't aesthetically pleasing:

```markdown
| 名称 | 类型 | 描述 |
|--- | --- | ---|
| 用户 | string | 用户名 |
| 年龄 | number | 年龄 |
| is_active | boolean | 是否激活 |
```

You want to center or right-align certain columns to make the table more readable, but you don't know how to specify it.

## When to Use This Approach

- You want to center certain columns in a table (such as status, tags)
- You want to right-align numeric columns (for easy comparison of sizes)
- You want to left-align text columns (default behavior)
- You want to understand the implementation principles of alignment

## Core Concept: Separator Row Determines Alignment

In Markdown tables, alignment isn't specified on every row—it's set uniformly through the **separator row**.

The separator row syntax is: `:?-+:?` (colon + dash + colon)

| Colon Position | Alignment | Example |
|--- | --- | ---|
| Both sides | Center | `:---:` |
| Right side only | Right-aligned | `---:` |
| Neither | Left-aligned | `---` or `:---` |

Each cell in the separator row corresponds to the alignment method for a column, and the plugin will format the entire column according to this rule.

## Follow Along: Three Alignment Methods

### Step 1: Left-Align (Default)

**Why**

Left-alignment is the default behavior for tables, suitable for text-based data.

**Syntax**

```markdown
| 名称 | 描述 |
| :--- | :--- |    ← Colon on the left or no colon both indicate left alignment
| 用户 | 用户名 |
```

**What You Should See**

```markdown
| 名称   | 描述   |
|--- | ---|
| 用户   | 用户名 |
```

The separator row will display as `:---` (left alignment marker), and text will be aligned to the left.

**Source Code Implementation**

```typescript
// getAlignment function: Parse alignment method
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"  // Default returns left
}
```

Source location: `index.ts:141-149`

**Logic Explanation**

- Colons on both sides (`:---:`) → Returns `"center"`
- Only right side has colon (`---:`) → Returns `"right"`
- Other cases (`---` or `:---`) → Returns `"left"` (default)

### Step 2: Center Alignment

**Why**

Center alignment is suitable for content that needs visual centering, such as status tags, short text, headers, etc.

**Syntax**

```markdown
| 名称 | 状态 | 描述 |
|--- | --- | --- | ---|
| 用户 | 激活 | 用户名 |
```

**What You Should See**

```markdown
| 名称   |  状态  | 描述   |
|--- | --- | ---|
| 用户   |  激活  | 用户名 |
```

The "激活" in the middle column will be displayed centered, and the separator row will display as `:---:` (center alignment marker).

**Separator Row Formatting Principle**

The formatting of separator row cells is handled by the `formatSeparatorCell` function:

```typescript
function formatSeparatorCell(width: number, align: "left" | "center" | "right"): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":"
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":"
  return "-".repeat(width)
}
```

Source location: `index.ts:213-217`

**Mathematical Principle of Center Alignment**

The centered separator row format is: `:` + dashes + `:`

| Target Width | Calculation Formula | Result |
|--- | --- | ---|
| 3 | `:` + ` `-`*1 ` + `:` | `:-:` |
| 5 | `:` + `-`*3 + `:` | `:---:` |
| 10 | `:` + `-`*8 + `:` | `:--------:` |

`Math.max(1, width - 2)` ensures at least 1 dash is retained, avoiding `::` (no separation effect) when width is 2.

### Step 3: Right-Align

**Why**

Right-alignment is suitable for data that needs to be compared from right to left, such as numbers, amounts, dates, etc.

**Syntax**

```markdown
| 名称 | 价格 | 数量 |
| :--- | ---: | ---: |    ← Colon on the right indicates right alignment
| 商品 | 99.9 | 100 |
```

**What You Should See**

```markdown
| 名称   | 价格 | 数量 |
|--- | --- | ---|
| 商品   |  99.9 |  100 |
```

Numbers are aligned to the right, making it easy to compare sizes.

**Mathematical Principle of Right Alignment**

The right-aligned separator row format is: dashes + `:`

| Target Width | Calculation Formula | Result |
|--- | --- | ---|
| 3 | `-`*2 + `:` | `--:` |
| 5 | `-`*4 + `:` | `----:` |
| 10 | `-`*9 + `:` | `---------:` |

`Math.max(1, width - 1)` ensures at least 1 dash is retained.

## Cell Padding Algorithm

How does the plugin decide how many spaces to pad on both sides of a cell? The answer is in the `padCell` function.

**Source Code Implementation**

```typescript
function padCell(text: string, width: number, align: "left" | "center" | "right"): string {
  const displayWidth = calculateDisplayWidth(text)  // Calculate display width
  const totalPadding = Math.max(0, width - displayWidth)

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2)
    const rightPad = totalPadding - leftPad
    return " ".repeat(leftPad) + text + " ".repeat(rightPad)
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text
  } else {
    return text + " ".repeat(totalPadding)
  }
}
```

Source location: `index.ts:198-211`

**Padding Rules**

| Alignment | Left Padding | Right Padding | Example (target width 10, text "abc") |
|--- | --- | --- | ---|
| Left-align | 0 | totalPadding | `abc       ` |
| Center | floor(total/2) | total - floor(total/2) | `   abc    ` |
| Right-align | totalPadding | 0 | `       abc` |

**Mathematical Details of Center Alignment**

`Math.floor(totalPadding / 2)` ensures left padding is an integer, with extra space added to the right.

| Target Width | Text Width | totalPadding | Left Padding | Right Padding | Result |
|--- | --- | --- | --- | --- | ---|
| 10 | 3 | 7 | 3 (7÷2=3.5→3) | 4 (7-3) | `   abc    ` |
| 11 | 3 | 8 | 4 (8÷2=4) | 4 (8-4) | `    abc    ` |
| 12 | 3 | 9 | 4 (9÷2=4.5→4) | 5 (9-4) | `    abc     ` |

## Complete Example

**Input table** (specifying alignment for different columns):

```markdown
| 名称 | 状态 | 价格 | 描述 |
|--- | --- | --- | ---|
| 商品A | 激活 | 99.9 | 这是一个商品 |
| 商品B | 停用 | 199.0 | 这是另一个商品 |
```

**Formatted result**:

```markdown
| 名称   |  状态  | 价格 | 描述         |
|--- | --- | --- | ---|
| 商品A  |  激活  |  99.9 | 这是一个商品 |
| 商品B  |  停用  | 199.0 | 这是另一个商品 |
```

**Alignment for each column**:

| Column Name | Separator Row Syntax | Alignment | Description |
|--- | --- | --- | ---|
| 名称 | `:---` | Left-align | Text aligned left |
| 状态 | `:---:` | Center | Text centered |
| 价格 | `---:` | Right-align | Numbers aligned right |
| 描述 | `:---` | Left-align | Text aligned left |

## Checkpoints

After completing this lesson, you should be able to answer:

- [ ] How do you specify center alignment? (Answer: Separator row uses `:---:`)
- [ ] How do you specify right alignment? (Answer: Separator row uses `---:`)
- [ ] What is the default syntax for left alignment? (Answer: `---` or `:---`)
- [ ] Why does center alignment use `Math.floor(totalPadding / 2)`? (Answer: To ensure left padding is an integer, extra space goes to the right)
- [ ] What does `:---:` in the separator row represent? (Answer: Center alignment marker, one colon on each side, dashes in the middle)

## Pitfall Alerts

::: warning Common Misconceptions
**Misconception**: Every row needs to specify alignment

**Fact**: No. Only the separator row specifies alignment, and data rows automatically align by column.

The separator row is the "configuration", data rows are the "content"—one configuration row is enough.
:::

::: danger Remember
The colon position in the separator row **must** correspond to the columns.

| Wrong Example | Problem |
|--- | ---|
| `| :--- | --- |` | First column centered, second column left-aligned (2 columns) |
| `| :--- | ---: | :--- |` | First column left-aligned, second column right-aligned, third column left-aligned (3 columns) |

The separator row's column count must match the header and data row column counts!
:::

## Lesson Summary

| Alignment | Separator Row Syntax | Use Cases |
|--- | --- | ---|
| Left-align | `---` or `:---` | Text, description data (default) |
| Center | `:---:` | Status tags, short text, headers |
| Right-align | `---:` | Numbers, amounts, dates |

**Key Functions**:

| Function | Purpose | Source Location |
|--- | --- | ---|
| `getAlignment()` | Parse alignment method of separator row cells | 141-149 |
| `padCell()` | Pad cells to specified width | 198-211 |
| `formatSeparatorCell()` | Format separator row cells | 213-217 |

**Memory Mnemonic**:

> Colons on both sides center align, colon on right aligns right,
> No colons default to left, separator row sets the rules.

## Next Lesson Preview

> In the next lesson, we'll learn **[Common Issues: What to Do When Table Isn't Formatted](../../faq/troubleshooting/)**.
>
> You'll learn:
> - How to quickly locate `invalid structure` errors
> - Configuration error troubleshooting methods
> - Solutions to common table problems

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Feature | File Path | Line Number |
|--- | --- | ---|
| Alignment method parsing | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Cell padding | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L198-L211) | 198-211 |
| Separator row formatting | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L213-L217) | 213-217 |
| Alignment method application | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L107-L113) | 107-113 |

**Key functions**:
- `getAlignment(delimiterCell: string)`: Parse alignment method of separator row cells
  - Returns `"left"` | `"center"` | `"right"`
  - Logic: colons on both sides → center, only right side has colon → right align, other → left align

- `padCell(text, width, align)`: Pad cells to specified width
  - Calculate difference between display width and target width
  - Distribute left and right padding based on alignment method
  - Center alignment uses `Math.floor(totalPadding / 2)` to ensure left padding is an integer

- `formatSeparatorCell(width, align)`: Format separator row cells
  - Center: `:` + `-`*(width-2) + `:`
  - Right-align: `-`*(width-1) + `:`
  - Left-align: `-`*width
  - Uses `Math.max(1, ...)` to ensure at least 1 dash is retained

</details>
