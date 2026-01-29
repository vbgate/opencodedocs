---
title: "Concealment Mode: Width Calculation | opencode-md-table-formatter"
sidebarTitle: "Concealment Mode"
subtitle: "Concealment Mode: Width Calculation"
description: "Learn how the plugin calculates display width in concealment mode. Strip Markdown symbols, protect code blocks, and achieve perfect table alignment."
tags:
  - "concealment-mode"
  - "display-width-calculation"
  - "markdown-symbol-stripping"
  - "bun-stringwidth"
prerequisite:
  - "start-features"
order: 30
---

# Concealment Mode Principles: Why Width Calculation Matters

::: info What You'll Learn
- Understand how OpenCode concealment mode works
- Know why regular formatting tools misalign tables in concealment mode
- Master the plugin's width calculation algorithm (three steps)
- Understand the role of `Bun.stringWidth`
:::

## Your Current Challenge

You're writing code in OpenCode, and AI generates a beautiful table:

```markdown
| 字段 | 类型 | 说明 |
|--- | --- | ---|
| **name** | string | 用户名 |
| age | number | 年龄 |
```

It looks neat in the source view. But when you switch to preview mode, the table is misaligned:

```
| 字段     | 类型   | 说明   |
|--- | --- | ---|
| name | string | 用户名 |    ← Why is it shorter?
| age      | number | 年龄   |
```

Where's the problem? **Concealment mode**.

## What is Concealment Mode

OpenCode enables **concealment mode** by default, which hides Markdown syntax symbols during rendering:

| Source | Displayed in Concealment Mode |
|--- | ---|
| `**bold**` | bold（4 characters） |
| `*italic*` | italic（4 characters） |
| `~~strikethrough~~` | strikethrough（6 characters） |
| `` `code` `` | `code`（4 characters + background） |

::: tip Benefits of Concealment Mode
Focus on the content itself, not being distracted by a bunch of `**` and `*` symbols.
:::

## Why Regular Formatting Tools Have Problems

Regular table formatting tools count `**name**` as 8 characters when calculating width:

```
** n a m e ** = 8 characters
```

But in concealment mode, users see `name`, which is only 4 characters.

The result: the formatting tool aligns based on 8 characters, but users see 4 characters, so the table is naturally misaligned.

## Core Idea: Calculate "Display Width" Instead of "Character Length"

The core idea of this plugin is: **calculate the width that users actually see, not the character count in the source code**.

The algorithm consists of three steps:

```
Step 1: Protect code blocks (don't strip symbols inside code blocks)
Step 2: Strip Markdown symbols (**, *, ~~, etc.)
Step 3: Use Bun.stringWidth to calculate the final width
```

## Follow Along: Understanding the Three-Step Algorithm

### Step 1: Protect Code Blocks

**Why**

Markdown symbols in inline code (wrapped in backticks) are "literals". Users see `**bold**` as 8 characters, not `bold` as 4 characters.

So before stripping Markdown symbols, we need to "hide" the code block content first.

**Source Implementation**

```typescript
// Step 1: Extract and protect inline code
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})
```

**How It Works**

| Input | After Processing | codeBlocks Array |
|--- | --- | ---|
| `` `**bold**` `` | `\x00CODE0\x00` | `["**bold**"]` |
| `` `a` and `b` `` | `\x00CODE0\x00 and \x00CODE1\x00` | `["a", "b"]` |

Replace code blocks with special placeholders like `\x00CODE0\x00`, so they won't be accidentally damaged when stripping Markdown symbols later.

### Step 2: Strip Markdown Symbols

**Why**

In concealment mode, `**bold**` displays as `bold`, and `*italic*` displays as `italic`. When calculating width, we need to remove these symbols.

**Source Implementation**

```typescript
// Step 2: Strip Markdown symbols from non-code parts
let visualText = textWithPlaceholders
let previousText = ""

while (visualText !== previousText) {
  previousText = visualText
  visualText = visualText
    .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***bold italic*** → text
    .replace(/\*\*(.+?)\*\*/g, "$1")     // **bold** → bold
    .replace(/\*(.+?)\*/g, "$1")         // *italic* → italic
    .replace(/~~(.+?)~~/g, "$1")         // ~~strikethrough~~ → strikethrough
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, "$1")     // ![alt](url) → alt
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)") // [text](url) → text (url)
}
```

**Why Use a While Loop?**

To handle nested syntax. For example `***bold italic***`:

```
Round 1: ***bold italic*** → **bold italic**（strip outermost ***）
Round 2: **bold italic** → *bold italic*（strip **）
Round 3: *bold italic* → bold italic（strip *）
Round 4: bold italic = bold italic（no change, exit loop）
```

::: details Image and Link Processing
- **Images** `![alt](url)`: OpenCode only displays alt text, so it's replaced with `alt`
- **Links** `[text](url)`: Displayed as `text (url)`, preserving URL information
:::

### Step 3: Restore Code Blocks + Calculate Width

**Why**

Code block content needs to be restored, then use `Bun.stringWidth` to calculate the final display width.

**Source Implementation**

```typescript
// Step 3: Restore code block content
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})

return Bun.stringWidth(visualText)
```

**Why Use Bun.stringWidth?**

`Bun.stringWidth` correctly calculates:

| Character Type | Example | Character Count | Display Width |
|--- | --- | --- | ---|
| ASCII | `abc` | 3 | 3 |
| Chinese | `你好` | 2 | 4（each occupies 2 cells） |
| Emoji | `😀` | 1 | 2（occupies 2 cells） |
| Zero-width | `a\u200Bb` | 3 | 2（zero-width character doesn't take space） |

Ordinary `text.length` can only count characters, unable to handle these special cases.

## Complete Example

Assume the cell content is: `` **`code`** and *text* ``

**Step 1: Protect Code Blocks**

```
Input: **`code`** and *text*
Output: **\x00CODE0\x00** and *text*
codeBlocks = ["code"]
```

**Step 2: Strip Markdown Symbols**

```
Round 1: **\x00CODE0\x00** and *text* → \x00CODE0\x00 and text
Round 2: No change, exit
```

**Step 3: Restore Code Blocks + Calculate Width**

```
After restoration: code and text
Width: Bun.stringWidth("code and text") = 13
```

Ultimately, the plugin aligns this cell with a width of 13 characters, not the source code's 22 characters.

## Checkpoint

After completing this lesson, you should be able to answer:

- [ ] What symbols are hidden in concealment mode? (Answer: `**`, `*`, `~~`, etc. Markdown syntax symbols)
- [ ] Why protect code blocks first? (Answer: Symbols inside code blocks are literals and should not be stripped)
- [ ] Why use a while loop to strip symbols? (Answer: To handle nested syntax, like `***bold italic***`)
- [ ] How is `Bun.stringWidth` better than `text.length`? (Answer: Can correctly calculate display width for Chinese, emoji, zero-width characters)

## Common Pitfalls

::: warning Common Misconceptions
**Misconception**: `**` in code blocks will also be stripped

**Fact**: No. The plugin first protects code block content with placeholders, then strips symbols from other parts, and finally restores.

So the width of `` `**bold**` `` is 8（`**bold**`）, not 4（`bold`）。
:::

## Lesson Summary

| Step | Purpose | Key Code |
|--- | --- | ---|
| Protect Code Blocks | Prevent symbols inside code blocks from being accidentally stripped | `text.replace(/\`(.+?)\`/g, ...)` |
| Strip Markdown | Calculate actual displayed content in concealment mode | Multiple rounds of regex replacement |
| Calculate Width | Handle Chinese, emoji, and other special characters | `Bun.stringWidth()` |

## Next Lesson Preview

> In the next lesson, we'll learn **[Table Specifications](../table-spec/)**.
>
> You will learn:
> - What tables can be formatted
> - 4 rules for table validation
> - How to avoid "invalid table" errors

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-26

| Function | File Path | Line Numbers |
|--- | --- | ---|
| Display width calculation entry | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L151-L159) | 151-159 |
| Code block protection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |
| Markdown symbol stripping | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L175-L188) | 175-188 |
| Code block restoration | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L190-L193) | 190-193 |
| Bun.stringWidth call | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L195) | 195 |

**Key Functions**:
- `calculateDisplayWidth()`: Width calculation entry with caching
- `getStringWidth()`: Core algorithm, strips Markdown symbols and calculates display width

**Key Constants**:
- `\x00CODE{n}\x00`: Code block placeholder format

</details>
