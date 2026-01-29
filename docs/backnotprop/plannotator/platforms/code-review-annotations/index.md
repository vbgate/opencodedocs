---
title: "Code Annotations: Line-Level Feedback | Plannotator"
subtitle: "Adding Code Annotations: Line-Level Comments, Suggestions, and Concerns"
sidebarTitle: "Code Annotations"
description: "Learn Plannotator's code review annotation features. Add line-level annotations (comment/suggestion/concern) in code diffs, provide suggested code changes, mark concerns and risks, understand three annotation types, manage annotations in sidebar, and export feedback as Markdown."
tags:
  - "Code Review"
  - "Annotation"
  - "diff"
  - "comment"
  - "suggestion"
  - "concern"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
  - "platforms-code-review-basics"
order: 5
---

# Adding Code Annotations: Line-Level Comments, Suggestions, and Concerns

## What You'll Learn

- ✅ Add line-level annotations (comment/suggestion/concern) in code diffs
- ✅ Provide suggested code for code modifications (suggestedCode)
- ✅ Mark code sections that need attention (concern)
- ✅ View and manage all annotations (sidebar)
- ✅ Understand the use cases of three annotation types
- ✅ Export feedback as Markdown format

## Your Current Challenges

**Challenge 1**: When reviewing code changes, you can only view diffs in the terminal, then write "line 3 has a problem" or "suggest changing to XXX", which is not precise in location.

**Challenge 2**: Some code you just want to comment on (comment), some you want to suggest modifications (suggestion), and some are serious issues that need attention (concern), but there's no tool to help you distinguish.

**Challenge 3**: You want to give modification suggestions for a function, but you don't know how to pass code snippets to AI.

**Challenge 4**: After adding multiple annotations, you forget which parts you reviewed, and there's no overview.

**How Plannotator Helps**:
- Click line numbers to select code ranges, precise to the line
- Three annotation types (comment/suggestion/concern) correspond to different scenarios
- Can attach suggested code, so AI directly sees the modification plan
- Sidebar lists all annotations, one-click jump

## When to Use This Technique

**Use Cases**:
- After executing `/plannotator-review` command to view code changes
- Need to provide feedback on specific code lines
- Want to provide code modification suggestions to AI
- Need to mark potential issues or risk points

**Not Applicable**:
- Reviewing AI-generated implementation plans (use plan review feature)
- Only need to quickly browse diffs (use code review basics feature)

## 🎒 Before You Start

**Prerequisites**:
- ✅ Plannotator CLI installed (see [Quick Start](../../start/getting-started/))
- ✅ Learned code review basics (see [Code Review Basics](../code-review-basics/))
- ✅ Local Git repository with uncommitted changes

**Trigger Method**:
- Execute `/plannotator-review` command in OpenCode or Claude Code

## Core Concepts

### What Are Code Annotations

**Code annotations** are Plannotator's core feature for code review, used to add line-level feedback in Git diffs. By clicking line numbers to select code ranges, you can precisely add comments, suggestions, or concerns for specific code lines. Annotations are displayed below the diff, making it easy for AI to accurately understand your feedback intent.

::: info Why do we need code annotations?
In code review, you need to provide feedback on specific code lines. If you only use text descriptions like "line 5 has a problem" or "suggest changing to XXX", AI needs to locate the code itself, which is error-prone. Plannotator lets you click line numbers to select code ranges, directly add annotations at that location. Annotations are displayed below the diff (GitHub-style), so AI can accurately see which code segment your suggestions target.
:::

### Workflow

```
┌─────────────────┐
│  /plannotator-   │  Trigger command
│  review command  │
└────────┬────────┘
          │
          │ Run git diff
          ▼
┌─────────────────┐
│  Diff Viewer    │  ← Display code diff
│  (split/unified) │
└────────┬────────┘
          │
          │ Click line number / Hover +
          ▼
┌─────────────────┐
│  Select code    │
│  range          │
│  (lineStart-    │
│   lineEnd)      │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Add annotation │  ← Toolbar pops up
│  - Comment     │     Fill in comment content
│  - Suggestion  │     Optional: provide suggested code
│  - Concern     │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Annotation     │  Below diff
│  displayed      │  Sidebar lists all annotations
│  (GitHub style) │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Export feedback│  Send Feedback
│  (Markdown)     │  AI receives structured feedback
└─────────────────┘
```

### Annotation Types

Plannotator supports three code annotation types, each with different purposes:

| Annotation Type | Purpose | Typical Scenario | Suggested Code |
| --------------- | ------- | ---------------- | -------------- |
| **Comment** | Comment on a code section, provide general feedback | "This logic can be simplified", "Variable naming is not clear" | Optional |
| **Suggestion** | Provide specific code modification suggestions | "Suggest using map instead of for loop", "Use await instead of Promise.then" | Recommended |
| **Concern** | Mark potential issues or risk points | "This SQL query may have performance issues", "Missing error handling" | Optional |

::: tip Annotation type selection advice
- **Comment**: Used for "suggesting but not forcing", such as code style, optimization directions
- **Suggestion**: Used for "strongly suggesting modification", and you have a clear modification plan
- **Concern**: Used for "issues that must be noted", such as bugs, performance risks, security concerns
:::

### Comment vs Suggestion vs Concern

| Scenario | Choose Type | Example Text |
| -------- | ----------- | ------------ |
| Code works but has optimization space | Comment | "This can be simplified with async/await" |
| Code has a clear improvement plan | Suggestion | "Suggest using `Array.from()` instead of spread operator" (with code) |
| Found bug or serious issue | Concern | "Missing null check here, may cause runtime error" |

## Follow Along

### Step 1: Trigger Code Review

Execute in the terminal:

```bash
/plannotator-review
```

**What You Should See**:
1. Browser automatically opens code review interface
2. Displays git diff content (default is `git diff HEAD`)
3. Left side is file tree, middle is diff viewer, right side is annotation sidebar

### Step 2: Browse Diff Content

View code changes in your browser:

- Default uses **split view** (left-right comparison)
- Can switch to **unified view** (top-bottom comparison)
- Click filenames in file tree to switch between files

### Step 3: Select Code Lines and Add Annotations

**Method 1: Hover and Click "+" Button**

1. Hover your mouse over the code line where you want to add annotation
2. A **+** button appears on the right side (only displays on diff lines)
3. Click the **+** button
4. Annotation toolbar pops up

**Method 2: Directly Click Line Numbers**

1. Click a line number (e.g., `L10`) to select a single line
2. Click another line number (e.g., `L15`) to select a multi-line range
3. After selecting the range, toolbar automatically pops up

**What You Should See**:
- Toolbar displays selected line numbers (e.g., `Line 10` or `Lines 10-15`)
- Toolbar includes text input box (`Leave feedback...`)
- Optional "Add suggested code" button

### Step 4: Add Comment Annotation

**Scenario**: Provide suggestions for code, but don't require mandatory modification

1. Enter comment content in the toolbar's text box
2. Optional: Click **Add suggested code** and enter suggested code
3. Click **Add Comment** button

**Example**:

```
Comment content: This function's parameter naming is not clear, suggest renaming to fetchUserData
```

**What You Should See**:
- Toolbar disappears
- Annotation displays below diff (blue box)
- New annotation record appears in sidebar
- If suggested code is provided, it displays below the annotation (code block format)

### Step 5: Add Suggestion Annotation

**Scenario**: Provide clear code modification plan, want AI to directly adopt

1. Enter suggestion description in toolbar's text box (optional)
2. Click **Add suggested code**
3. In the appearing code input box, enter the suggested code
4. Click **Add Comment** button

**Example**:

```
Suggestion description: Use async/await to simplify Promise chain

Suggested code:
async function fetchData() {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
```

**What You Should See**:
- Annotation displays below diff (blue box)
- Suggested code displays as code block with "Suggested:" label
- Sidebar displays first line of suggested code (with ellipsis)

### Step 6: Add Concern Annotation

**Scenario**: Mark potential issues or risk points, remind AI to pay attention

**Note**: In the current version of Plannotator UI, the default annotation type is **Comment**. If you need to mark **Concern**, you can explicitly state it in the annotation text.

1. Enter concern description in toolbar's text box
2. Can use `Concern:` or `⚠️` markers to explicitly indicate this is a concern
3. Click **Add Comment** button

**Example**:

```
Concern: Missing null check here, if user is null it will cause runtime error

Suggested addition:
if (!user) return null;
```

**What You Should See**:
- Annotation displays below diff
- Sidebar displays annotation content

### Step 7: View and Manage Annotations

**View all annotations in sidebar**:

1. Right sidebar displays list of all annotations
2. Each annotation shows:
   - Filename (extracts last path component)
   - Line number range (e.g., `L10` or `L10-L15`)
   - Author (if collaborative review)
   - Timestamp (e.g., `5m`, `2h`, `1d`)
   - Annotation content (displays up to 2 lines)
   - Suggested code preview (first line)

**Click annotation to jump**:

1. Click an annotation in the sidebar
2. Diff viewer automatically scrolls to corresponding position
3. That annotation is highlighted

**Delete annotation**:

1. Hover your mouse over an annotation in the sidebar
2. Click the **×** button in the top right corner
3. Annotation is deleted, highlight in diff disappears

**What You Should See**:
- Sidebar displays annotation count (e.g., `Annotations: 3`)
- After clicking annotation, diff viewer smoothly scrolls to corresponding line
- After deleting annotation, count updates

### Step 8: Export Feedback

After completing all annotations, click the **Send Feedback** button at the bottom of the page.

**What You Should See**:
- Browser automatically closes
- Terminal displays feedback content in Markdown format
- AI receives structured feedback and can automatically respond

**Exported Markdown format**:

```markdown
# Code Review Feedback

## src/app/api/users.ts

### Line 10 (new)
This logic can be simplified, suggest using async/await

### Lines 15-20 (new)
**Suggested code:**
```typescript
async function fetchUserData() {
  const response = await fetch(url);
  return await response.json();
}
```

### Line 25 (old)
Concern: Missing null check here, if user is null it will cause runtime error
```

::: tip Copy feedback
If you need to manually copy feedback content, you can click the **Copy Feedback** button at the bottom of the sidebar to copy the Markdown-formatted feedback to the clipboard.
:::

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Click line numbers or Hover "+" button in code diff to select code lines
- [ ] Add Comment annotations (general comments)
- [ ] Add Suggestion annotations (with suggested code)
- [ ] Add Concern annotations (mark potential issues)
- [ ] View all annotations in sidebar, click to jump to corresponding positions
- [ ] Delete unwanted annotations
- [ ] Export feedback as Markdown format
- [ ] Copy feedback content to clipboard

**If a step fails**, see:
- [Common Problems](../../faq/common-problems/)
- [Code Review Basics](../code-review-basics/)
- [Troubleshooting](../../faq/troubleshooting/)

## Pitfall Alerts

**Common Error 1**: After clicking line numbers, toolbar doesn't pop up

**Cause**: Possibly clicked on a filename or line number is not within diff range.

**Solution**:
- Ensure clicking on diff line numbers (green or red lines)
- For deleted lines (red), click the line number on the left side
- For added lines (green), click the line number on the right side

**Common Error 2**: After selecting multiple lines, annotation displays at wrong position

**Cause**: side (old/new) is incorrect.

**Solution**:
- Check if you selected old code (deletions) or new code (additions)
- Annotations display below the last line of the range
- If position is wrong, delete annotation and add again

**Common Error 3**: After adding suggested code, code format is messy

**Cause**: Suggested code may contain special characters or indentation issues.

**Solution**:
- In suggested code input box, ensure indentation is correct
- Use monospace font to edit suggested code
- If there are line breaks, use `Shift + Enter` instead of directly pressing Enter

**Common Error 4**: Can't see newly added annotations in sidebar

**Cause**: Sidebar may not have refreshed, or annotation was added to another file.

**Solution**:
- Switch files then switch back
- Check if annotation was added to the currently viewed file
- Refresh browser page (may lose uncommitted annotations)

**Common Error 5**: After exporting feedback, AI doesn't modify according to suggestions

**Cause**: AI may not have correctly understood the annotation intent, or suggestion is not feasible.

**Solution**:
- Use more explicit annotations (Suggestion is more explicit than Comment)
- Add explanatory comments in suggested code
- If issue persists, send feedback again and adjust annotation content

## Lesson Summary

Code annotations are Plannotator's core feature for code review, allowing you to precisely feedback code issues:

**Core Operations**:
1. **Trigger**: Execute `/plannotator-review`, browser automatically opens diff viewer
2. **Browse**: View code changes (switch split/unified views)
3. **Select**: Click line numbers or Hover "+" button to select code range
4. **Annotate**: Add Comment/Suggestion/Concern annotations
5. **Manage**: View, jump to, delete annotations in sidebar
6. **Export**: Send Feedback, AI receives structured feedback

**Annotation Types**:
- **Comment**: General comment, provide suggestions but not mandatory
- **Suggestion**: Clearly suggest modification, attach suggested code
- **Concern**: Mark potential issues or risk points

**Best Practices**:
- When using Suggestion, try to provide complete runnable code
- For performance or security issues, use Concern to mark
- Annotation content should be specific, avoid vague descriptions (like "this is not good")
- Can attach images to help explain (use image annotation feature)

## Next Lesson Preview

> Next, we'll learn **[Switching Diff Views](../code-review-diff-types/)**.
>
> You'll learn:
> - How to switch between different diff types (uncommitted/staged/last commit/branch)
> - Use cases for different diff types
> - How to quickly switch between multiple diff types

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| CodeAnnotation type definition | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L56) | 53-56 |
| CodeAnnotation interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| DiffViewer component | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| ReviewPanel component | [`packages/review-editor/components/ReviewPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/ReviewPanel.tsx#L1-L211) | 1-211 |
| Export feedback Markdown | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L86-L126) | 86-126 |
| Hover "+" button | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L180-L199) | 180-199 |
| Annotation toolbar | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L267-L344) | 267-344 |
| Annotation rendering | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L140-L177) | 140-177 |

**Key Types**:
- `CodeAnnotationType`: Code annotation type ('comment' | 'suggestion' | 'concern') (`packages/ui/types.ts:53`)
- `CodeAnnotation`: Code annotation interface (`packages/ui/types.ts:55-66`)
- `SelectedLineRange`: Selected code range (`packages/ui/types.ts:77-82`)

**Key Functions**:
- `exportReviewFeedback()`: Convert annotations to Markdown format (`packages/review-editor/App.tsx:86`)
- `renderAnnotation()`: Render annotation in diff (`packages/review-editor/components/DiffViewer.tsx:140`)
- `renderHoverUtility()`: Render Hover "+" button (`packages/review-editor/components/DiffViewer.tsx:180`)

**API Routes**:
- `POST /api/feedback`: Submit review feedback (`packages/server/review.ts`)
- `GET /api/diff`: Get git diff (`packages/server/review.ts:111`)
- `POST /api/diff/switch`: Switch diff type (`packages/server/review.ts`)

**Business Rules**:
- Default view uncommitted diff (`git diff HEAD`) (`packages/server/review.ts:111`)
- Annotations display below the last line of the range (GitHub style) (`packages/review-editor/components/DiffViewer.tsx:81`)
- Support attaching suggested code in annotations (`suggestedCode` field) (`packages/ui/types.ts:63`)

</details>
