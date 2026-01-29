---
title: "Features: Overview | opencode-md-table-formatter"
sidebarTitle: "Features"
subtitle: "Features: Overview"
description: "Learn the 8 core features of opencode-md-table-formatter: automatic formatting, Concealment Mode compatibility, alignment support, code block protection, and Unicode handling."
tags:
  - "automatic formatting"
  - "hidden mode"
  - "alignment support"
  - "code block protection"
prerequisite:
  - "start-getting-started"
order: 20
---

# Feature Overview: Automatic Formatting Magic

::: info What You'll Learn
- Understand the 8 core features of the plugin
- Know which scenarios are suitable for using this plugin
- Understand the boundaries of the plugin (what it cannot do)
:::

## Your Current Problem

::: info Plugin Information
The full name of this plugin is **@franlol/opencode-md-table-formatter**, hereafter referred to as "Table Formatter Plugin".
:::

AI-generated Markdown tables often look like this:

```markdown
| Name | Description | Status |
|--- | --- | ---|
| **User Management** | Manage system users | ✅ Complete |
| API | API documentation | 🚧 In Progress |
```

Column widths are uneven and look uncomfortable. Manually adjusting? Every time AI generates a new table, you have to adjust it again—too tedious.

## When to Use This Approach

- AI has generated a Markdown table and you want it to be neater
- You have enabled OpenCode's Concealment Mode and table alignment always has issues
- You're too lazy to manually adjust table column widths

## Core Concept

The working principle of this plugin is very simple:

```
AI generates text → Plugin detects tables → Validate structure → Format → Return beautified text
```

It mounts on OpenCode's `experimental.text.complete` hook. Every time AI finishes generating text, the plugin automatically processes it. You don't need to manually trigger it—the entire process is seamless.

## 8 Core Features

### 1. Automatic Table Formatting

The plugin automatically detects Markdown tables in AI-generated text and unifies column widths to make tables neat and beautiful.

**Before formatting**:

```markdown
| Name | Description | Status |
|--- | --- | ---|
| **User Management** | Manage system users | ✅ Complete |
| API | API documentation | 🚧 In Progress |
```

**After formatting**:

```markdown
| Name         | Description         | Status       |
|--- | --- | ---|
| **User Management** | Manage system users | ✅ Complete    |
| API          | API documentation     | 🚧 In Progress  |
```

::: tip Trigger Conditions
The plugin mounts on the `experimental.text.complete` hook and automatically triggers after AI finishes generating text—no manual operation needed.
:::

### 2. Concealment Mode Compatibility

OpenCode enables Concealment Mode by default, which hides Markdown symbols (like `**`, `*`, `~~`).

Ordinary table formatting tools don't consider this point. When calculating width, they also count `**`, causing alignment misalignment.

This plugin is specifically optimized for Concealment Mode:

- When calculating width, strip symbols like `**bold**`, `*italic*`, `~~strikethrough~~`
- Keep original Markdown syntax when outputting
- Final effect: tables align perfectly in Concealment Mode

::: details Technical Detail: Width Calculation Logic
```typescript
// Strip Markdown symbols (for width calculation)
visualText = visualText
  .replace(/\*\*\*(.+?)\*\*\*/g, "$1") // ***bold italic*** → text
  .replace(/\*\*(.+?)\*\*/g, "$1")     // **bold** → bold
  .replace(/\*(.+?)\*/g, "$1")         // *italic* → italic
  .replace(/~~(.+?)~~/g, "$1")         // ~~strikethrough~~ → strikethrough
```
Source location: `index.ts:181-185`
:::

### 3. Alignment Support

Supports three alignment methods for Markdown tables:

| Syntax | Alignment | Effect |
|--- | --- | ---|
| `---` or `:---` | Left-aligned | Text aligned left (both syntaxes have the same effect) |
| `:---:` | Center-aligned | Text centered |
| `---:` | Right-aligned | Text aligned right |

**Example**:

```markdown
| Left-aligned | Center | Right-aligned |
|--- | --- | ---|
| Text | Text | Text |
```

After formatting, each column aligns according to the specified method, and the separator row is regenerated based on the alignment method.

### 4. Nested Markdown Handling

Table cells may contain nested Markdown syntax, like `***bold italic***`.

The plugin uses a multi-round regex algorithm to strip layer by layer from outside to inside:

```
***bold italic*** → **bold italic** → *bold italic* → bold italic
```

This way, even with multiple layers of nesting, width calculation is accurate.

### 5. Code Block Protection

Markdown symbols within inline code (wrapped in backticks) should remain unchanged and not be stripped.

For example, `` `**bold**` ``—what users see is the 8 characters `**bold**`, not the 4 characters `bold`.

The plugin first extracts code block content, strips Markdown symbols from other parts, then puts the code block content back.

::: details Technical Detail: Code Block Protection Logic
```typescript
// Step 1: Extract and protect inline code
const codeBlocks: string[] = []
let textWithPlaceholders = text.replace(/`(.+?)`/g, (match, content) => {
  codeBlocks.push(content)
  return `\x00CODE${codeBlocks.length - 1}\x00`
})

// Step 2: Strip Markdown symbols from non-code parts
// ...

// Step 3: Restore inline code content
visualText = visualText.replace(/\x00CODE(\d+)\x00/g, (match, index) => {
  return codeBlocks[parseInt(index)]
})
```
Source location: `index.ts:168-193`
:::

### 6. Edge Case Handling

The plugin correctly handles various edge cases:

| Scenario | Handling Method |
|--- | ---|
| Emoji emojis | Use `Bun.stringWidth` to correctly calculate display width |
| Unicode characters | Chinese, Japanese, and other full-width characters align correctly |
| Empty cells | Pad with spaces to minimum width (3 characters) |
| Excessively long content | Process normally without truncation |

### 7. Silent Operation

The plugin runs silently in the background:

- **No log output**: Won't print any information to the console
- **Errors don't interrupt**: Even if formatting fails, it won't affect AI's normal output

If an error occurs during formatting, the plugin retains the original text and adds an HTML comment at the end:

```markdown
<!-- table formatting failed: [error information] -->
```

### 8. Validation Feedback

The plugin validates whether the table structure is valid. Invalid tables will not be formatted but kept as-is, with a prompt added:

```markdown
<!-- table not formatted: invalid structure -->
```

**Requirements for valid tables**:

- At least 2 rows (including separator row)
- All rows have the same number of columns
- Must have a separator row (format: `|---|---|`)

## Plugin Boundaries

::: warning Unsupported Scenarios
- **HTML tables**: Only handles Markdown pipe tables (`| ... |`)
- **Multi-line cells**: Cells containing `<br>` tags are not supported
- **Tables without separator row**: Must have `|---|---|` separator row
- **Tables without header**: Must have a header row
:::

## Checkpoints

After completing this lesson, you should be able to answer:

- [ ] How does the plugin automatically trigger? (Answer: `experimental.text.complete` hook)
- [ ] Why is "Concealment Mode compatibility" needed? (Answer: Concealment Mode hides Markdown symbols, affecting width calculation)
- [ ] Will Markdown symbols in inline code be stripped? (Answer: No, Markdown symbols within code are fully preserved)
- [ ] How are invalid tables handled? (Answer: Kept as-is, with error comment added)

## Lesson Summary

| Feature | Description |
|--- | ---|
| Automatic Formatting | Triggers automatically after AI generates text, no manual operation needed |
| Concealment Mode Compatibility | Correctly calculates display width after Markdown symbols are hidden |
| Alignment Support | Left-aligned, center-aligned, right-aligned |
| Nested Markdown | Multi-round regex stripping, supports nested syntax |
| Code Block Protection | Symbols within inline code remain unchanged |
| Edge Cases | Emoji, Unicode, empty cells, excessively long content |
| Silent Operation | No logs, errors don't interrupt |
| Validation Feedback | Add error comment to invalid tables |

## Next Lesson Preview

> In the next lesson, we'll dive into **[Concealment Mode Principles](../../advanced/concealment-mode/)**.
>
> You'll learn:
> - How OpenCode's Concealment Mode works
> - How the plugin correctly calculates display width
> - The role of `Bun.stringWidth`

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-26

| Feature | File path | Line number |
|--- | --- | ---|
| Plugin entry point | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23 |
| Table detection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| Table validation | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| Width calculation (Concealment Mode) | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L161-L196) | 161-196 |
| Alignment method parsing | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| Code block protection | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L168-L173) | 168-173 |

**Key constants**:
- `colWidths[col] = 3`: Column minimum width is 3 characters (`index.ts:115`)

**Key functions**:
- `formatMarkdownTables()`: Main processing function, formats all tables in text
- `getStringWidth()`: Calculates string display width, strips Markdown symbols
- `isValidTable()`: Validates whether table structure is valid

</details>
