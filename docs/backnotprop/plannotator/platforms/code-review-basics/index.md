---
title: "Code Review: Git Diff Visualization | Plannotator"
sidebarTitle: "Code Review"
subtitle: "Code Review Basics: Review Git Diff with /plannotator-review"
description: "Learn Plannotator's code review features to visualize git diff with side-by-side and unified views, add line-level comments, and send feedback to AI Agent."
tags:
  - "Code Review"
  - "Git Diff"
  - "Line-level Comments"
  - "Side-by-side"
  - "Unified"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 4
---

# Code Review Basics: Review Git Diff with /plannotator-review

## What You'll Learn

- ✅ Use `/plannotator-review` command to review Git Diff
- ✅ Switch between side-by-side and unified views
- ✅ Click line numbers to select code ranges and add line-level comments
- ✅ Add different comment types (comment/suggestion/concern)
- ✅ Switch between different diff types (uncommitted/staged/last commit/branch)
- ✅ Send review feedback to AI Agent

## Your Current Struggles

**Problem 1**: When using `git diff` to view code changes, the output scrolls in the terminal, making it difficult to fully understand the changes.

**Problem 2**: When giving feedback to the Agent about code issues, you can only describe it in text like "line 10 has a problem" or "modify this function," which is prone to ambiguity.

**Problem 3**: You don't know exactly which files the Agent modified, making it hard to focus on key parts among numerous changes.

**Problem 4**: After reviewing code, you want to send structured feedback to the Agent so it can modify the code based on your suggestions.

**Plannotator can help you**:
- Visualize Git Diff with support for side-by-side and unified views
- Click line numbers to select code ranges and precisely mark issue locations
- Add line-level comments (comment/suggestion/concern) with suggested code
- One-click switch between diff types (uncommitted, staged, last commit, branch)
- Comments automatically convert to Markdown format, Agent accurately understands your feedback

## When to Use This Technique

**Use Cases**:
- Agent has completed code modifications and you need to review the changes
- Before committing code, you want to comprehensively check your changes
- When collaborating with a team, you need structured feedback on code issues
- Want to switch between multiple diff types (uncommitted vs staged vs last commit)

**Not Suitable For**:
- Reviewing AI-generated implementation plans (use plan review feature)
- Using `git diff` directly in terminal (no need for visualization interface)

## 🎒 Prerequisites

**Prerequisites**:
- ✅ Plannotator CLI installed (see [Getting Started](../../start/getting-started/))
- ✅ Claude Code or OpenCode plugin configured (see corresponding installation guide)
- ✅ Current directory is in a Git repository

**Trigger**:
- Execute `/plannotator-review` command in Claude Code or OpenCode

## Core Concepts

### What is Code Review

**Code Review** is a visual Git Diff review tool provided by Plannotator, allowing you to view code changes in a browser and add line-level comments.

::: info Why do we need code review?
After an AI Agent completes code modifications, it typically outputs git diff content in the terminal. This pure text approach is difficult to fully understand changes and makes it inconvenient to precisely mark issue locations. Plannotator provides a visual interface (side-by-side or unified), supports clicking line numbers to add comments, and sends structured feedback to the Agent so it can modify the code based on your suggestions.
:::

### Workflow

```
┌─────────────────┐
│  User          │
│  (execute cmd) │
└────────┬────────┘
          │
          │ /plannotator-review
          ▼
┌─────────────────┐
│  CLI          │
│  (run git)    │
│  git diff HEAD │
└────────┬────────┘
          │
          │ rawPatch + gitRef
          ▼
┌─────────────────┐
│ Review Server  │  ← Local server starts
│  /api/diff     │
└────────┬────────┘
          │
          │ Browser opens UI
          ▼
┌─────────────────┐
│ Review UI     │
│                 │
│ ┌───────────┐  │
│ │ File Tree  │  │
│ │ (file list) │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ DiffViewer │  │
│ │ (code diff) │  │
│ │ split/     │  │
│ │ unified   │  │
│ └───────────┘  │
│       │         │
│       │ click line number
│       ▼         │
│ ┌───────────┐  │
│ │ Add Comment │  │
│ │ comment/   │  │
│ │ suggestion/│  │
│ │ concern    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ Send       │  │
│ │ Feedback   │  │
│ │ or LGTM    │  │
│ └───────────┘  │
└────────┬────────┘
          │
          │ Markdown format feedback
          ▼
┌─────────────────┐
│  AI Agent     │
│  (modify based on suggestions) │
└─────────────────┘
```

### View Modes

| View Mode | Description | Use Case |
| --------- | ----------- | -------- |
| **Split (Side-by-side)** | Left-right split, old code on left, new code on right | Compare large changes, clearly see before/after |
| **Unified** | Vertical merge, deletions and additions in same column | View small changes, save vertical space |

### Comment Types

Plannotator supports three code comment types:

| Comment Type | Purpose | UI Representation |
| ------------ | ------- | ----------------- |
| **Comment** | Comment on a line of code, ask questions or provide explanations | Purple/blue border markers |
| **Suggestion** | Provide specific code modification suggestions | Green border markers with suggested code block |
| **Concern** | Mark potential issues that need attention | Yellow/orange border markers |

::: tip Difference Between Comment Types
- **Comment**: Used for questions, explanations, general feedback
- **Suggestion**: Used to provide specific code modification solutions (with suggested code)
- **Concern**: Used to mark issues that need fixing or potential risks
:::

### Diff Types

| Diff Type | Git Command | Description |
| --------- | ----------- | ----------- |
| **Uncommitted** | `git diff HEAD` | Uncommitted changes (default) |
| **Staged** | `git diff --staged` | Staged changes |
| **Unstaged** | `git diff` | Unstaged changes |
| **Last commit** | `git diff HEAD~1..HEAD` | Content of last commit |
| **Branch** | `git diff main..HEAD` | Comparison between current branch and default branch |

## Follow Along

### Step 1: Trigger Code Review

Execute `/plannotator-review` command in Claude Code or OpenCode:

```
User: /plannotator-review

CLI: Running git diff...
     Browser opened
```

**You should see**:
1. Browser automatically opens Plannotator code review interface
2. Left side shows file list (File Tree)
3. Right side shows Diff Viewer (default is split view)
4. Top has view toggle buttons (Split/Unified)
5. Bottom has "Send Feedback" and "LGTM" buttons

### Step 2: Browse File List

View changed files in the left File Tree:

- Files are grouped by path
- Each file shows change statistics (additions/deletions)
- Click a file to switch to its diff content

**You should see**:
```
src/
  auth/
    login.ts          (+12, -5)  ← Click to view this file's diff
    user.ts          (+8, -2)
  api/
    routes.ts        (+25, -10)
```

### Step 3: Switch View Mode

Click "Split" or "Unified" button at the top of the page to switch views:

**Split View** (Side-by-side):
- Old code on left (gray background, red deletion line)
- New code on right (white background, green addition line)
- Suitable for comparing large changes

**Unified View** (merged):
- Old code and new code in the same column
- Deleted lines with red background, added lines with green background
- Suitable for viewing small changes

**You should see**:
- Split view: Left-right split, clear comparison before/after
- Unified view: Vertical merge, saves vertical space

### Step 4: Select Code Lines, Add Comments

**Add Comment Annotation**:

1. Hover mouse over a code line, `+` button appears next to the line number
2. Click `+` button, or directly click line number to select that line
3. Select multiple lines: Click start line number, hold Shift and click end line number
4. Enter comment content in the popup toolbar
5. Click "Add Comment" button

**Add Suggestion Annotation** (with suggested code):

1. Add annotation following the above steps
2. Click "Add suggested code" button in the toolbar
3. Enter suggested code in the popup code box
4. Click "Add Comment" button

**You should see**:
- Comments display below code lines
- Comment annotation: Purple/blue border markers, showing comment content
- Suggestion annotation: Green border markers, showing comment content and suggested code block
- Right sidebar displays all comments list

### Step 5: Switch Diff Type

Select different diff type at the top of the page:

- **Uncommitted changes** (default): Uncommitted changes
- **Staged changes**: Staged changes
- **Last commit**: Content of last commit
- **vs main** (if not on default branch): Comparison with default branch

**You should see**:
- Diff Viewer updates to newly selected diff content
- File list refreshes to show new change statistics

### Step 6: Send Feedback to Agent

**Send Feedback**:

1. Add necessary comments (Comment/Suggestion/Concern)
2. Click "Send Feedback" button at the bottom of the page
3. If no comments, confirmation dialog appears asking whether to continue

**LGTM** (Looks Good To Me):

If the code has no issues, click "LGTM" button.

**You should see**:
- Browser automatically closes (1.5 second delay)
- Terminal displays feedback content or "LGTM - no changes requested."
- Agent receives feedback and starts modifying code

### Step 7: View Feedback Content (Optional)

If you want to view the feedback content that Plannotator sends to the Agent, you can check it in the terminal:

```
# Code Review Feedback

## src/auth/login.ts

### Line 15 (new)
Error handling logic needs to be added here.

### Line 20-25 (old)
**Suggested code:**
```typescript
try {
  await authenticate(req);
} catch (error) {
  return res.status(401).json({ error: 'Authentication failed' });
}
```

## src/api/routes.ts

### Line 10 (new)
This function lacks input validation.
```

**You should see**:
- Feedback grouped by file
- Each comment shows file path, line number, type
- Suggestion comments include suggested code blocks

## Checklist ✅

After completing the above steps, you should be able to:

- [ ] Execute `/plannotator-review` command, browser automatically opens code review interface
- [ ] View changed file list in File Tree
- [ ] Switch between Split and Unified views
- [ ] Click line numbers or `+` button to select code lines
- [ ] Add Comment, Suggestion, and Concern annotations
- [ ] Add suggested code in comments
- [ ] Switch between different diff types (uncommitted/staged/last commit/branch)
- [ ] Click Send Feedback, browser closes, terminal displays feedback content
- [ ] Click LGTM, browser closes, terminal displays "LGTM - no changes requested."

**If any step fails**, see:
- [Common Problems](../../faq/common-problems/)
- [Claude Code Installation Guide](../../start/installation-claude-code/)
- [OpenCode Installation Guide](../../start/installation-opencode/)

## Common Pitfalls

**Common Error 1**: After executing `/plannotator-review`, browser doesn't open

**Cause**: Port may be occupied or server failed to start.

**Solution**:
- Check for error messages in terminal
- Try manually opening the displayed URL in browser
- If problem persists, see [Troubleshooting](../../faq/troubleshooting/)

**Common Error 2**: After clicking line numbers, toolbar doesn't pop up

**Cause**: May be because selected line is empty, or browser window is too small.

**Solution**:
- Try selecting lines that contain code
- Enlarge browser window
- Ensure JavaScript is not disabled

**Common Error 3**: After adding comments, they don't display below code lines

**Cause**: May be because selected line is empty, or browser window is too small.

**Solution**:
- Try selecting lines that contain code
- Enlarge browser window
- Ensure JavaScript is not disabled
- Check if right sidebar displays comments list

**Common Error 4**: After clicking Send Feedback, terminal doesn't display feedback content

**Cause**: May be network issues or server error.

**Solution**:
- Check for error messages in terminal
- Try sending feedback again
- If problem persists, see [Troubleshooting](../../faq/troubleshooting/)

**Common Error 5**: After Agent receives feedback, it doesn't modify code according to suggestions

**Cause**: Agent may not have correctly understood the comment's intent.

**Solution**:
- Try using clearer comments (Suggestion is clearer than Comment)
- Use Comment to add detailed explanations
- Provide complete suggested code in Suggestion
- If problem persists, run `/plannotator-review` again to review new changes

**Common Error 6**: After switching diff type, file list is empty

**Cause**: May be because selected diff type has no change content.

**Solution**:
- Try switching back to "Uncommitted changes"
- Check git status, confirm there are changes
- Use `git status` to view current state

## Summary

Code Review is a visual Git Diff review tool provided by Plannotator:

**Core Operations**:
1. **Trigger**: Execute `/plannotator-review`, browser automatically opens UI
2. **Browse**: View changed file list in File Tree
3. **View**: Switch between Split (side-by-side) and Unified views
4. **Comment**: Click line numbers to select code lines, add Comment/Suggestion/Concern annotations
5. **Switch**: Select different diff types (uncommitted/staged/last commit/branch)
6. **Feedback**: Click Send Feedback or LGTM, feedback sent to Agent

**View Modes**:
- **Split (Side-by-side)**: Left-right split, old code on left, new code on right
- **Unified**: Vertical merge, deletions and additions in same column

**Comment Types**:
- **Comment**: Comment on a line of code, ask questions or provide explanations
- **Suggestion**: Provide specific code modification suggestions (with suggested code)
- **Concern**: Mark potential issues that need attention

**Diff Types**:
- **Uncommitted**: Uncommitted changes (default)
- **Staged**: Staged changes
- **Unstaged**: Unstaged changes
- **Last commit**: Content of last commit
- **Branch**: Comparison between current branch and default branch

## Next Up

> In the next lesson, we'll learn **[Code Review Annotations](../code-review-annotations/)**.
>
> You'll learn:
> - How to precisely use Comment, Suggestion, and Concern annotations
> - How to add suggested code with formatted display
> - How to edit and delete comments
> - Best practices and common scenarios for comments
> - How to select old/new side in side-by-side view

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
| ----------------- | ---------------------------------------------------------------------------------------------------- | ------- |
| Code Review Server | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L302) | 1-302 |
| Code Review UI | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L150) | 1-150 |
| DiffViewer Component | [`packages/review-editor/components/DiffViewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/DiffViewer.tsx#L1-L349) | 1-349 |
| Git Utilities | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L148) | 1-148 |
| Hook Entry (review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84) | 46-84 |
| Code Annotation Type Definitions | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53-L83) | 53-83 |

**Key Types**:
- `CodeAnnotationType`: Code annotation type enum (comment, suggestion, concern) ([`packages/ui/types.ts:53`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53))
- `CodeAnnotation`: Code annotation interface ([`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66))
- `DiffType`: Diff type enum (uncommitted, staged, unstaged, last-commit, branch) ([`packages/server/git.ts:10-15`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15))
- `GitContext`: Git context interface ([`packages/server/git.ts:22-26`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L22-L26))

**Key Functions**:
- `startReviewServer()`: Start code review server ([`packages/server/review.ts:79`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L79))
- `runGitDiff()`: Run git diff command ([`packages/server/git.ts:101`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101))
- `getGitContext()`: Get Git context (branch info and diff options) ([`packages/server/git.ts:79`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79))
- `parseDiffToFiles()`: Parse diff to file list ([`packages/review-editor/App.tsx:48`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L48))
- `exportReviewFeedback()`: Export annotations to Markdown feedback ([`packages/review-editor/App.tsx:86`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L86))

**API Routes**:
- `GET /api/diff`: Get diff content ([`packages/server/review.ts:118`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L118))
- `POST /api/diff/switch`: Switch diff type ([`packages/server/review.ts:130`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L130))
- `POST /api/feedback`: Submit review feedback ([`packages/server/review.ts:222`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L222))
- `GET /api/image`: Get image ([`packages/server/review.ts:164`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L164))
- `POST /api/upload`: Upload image ([`packages/server/review.ts:181`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181))
- `GET /api/agents`: Get available agents (OpenCode) ([`packages/server/review.ts:204`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L204))

**Business Rules**:
- Default view uncommitted diff ([`apps/hook/server/index.ts:55`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L55))
- Support switching to vs main diff ([`packages/server/git.ts:131`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L131))
- Feedback formatted as Markdown ([`packages/review-editor/App.tsx:86`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L86))
- Send "LGTM" text on approval ([`packages/review-editor/App.tsx:430`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L430))

</details>
