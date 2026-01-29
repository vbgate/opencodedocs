---
title: "Plan Review: Visual Interface | Plannotator"
sidebarTitle: "Plan Review"
subtitle: "Plan Review Basics: Visually Review AI Plans"
description: "Learn Plannotator's plan review feature. Use the visual interface to review AI-generated plans, add annotations, approve or reject changes."
tags:
  - "Plan Review"
  - "Visual Review"
  - "Annotation"
  - "Approve"
  - "Reject"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# Plan Review Basics: Visually Review AI Plans

## What You'll Learn

- ✅ Use the Plannotator visual interface to review AI-generated plans
- ✅ Select plan text and add different types of annotations (delete, replace, comment)
- ✅ Approve plans to let AI continue implementation
- ✅ Reject plans and send annotations as feedback to AI
- ✅ Understand the use cases and differences between annotation types

## Your Current Challenges

**Challenge 1**: AI-generated implementation plans are displayed in the terminal, making them difficult to read and review due to large text volume and unclear structure.

**Challenge 2**: When giving feedback to AI, you can only use text descriptions like "delete paragraph 3" or "modify this function", which has high communication costs and AI might misunderstand.

**Challenge 3**: Some parts of the plan don't need modification, some need replacement, and some need comments, but there's no tool to help you structure this feedback.

**Challenge 4**: You don't know how to let AI know that you've approved the plan or that it needs modification.

**How Plannotator Helps**:
- Visual UI replaces terminal reading with clear structure
- Select text to add annotations (delete, replace, comment) for precise feedback
- Annotations are automatically converted to structured data, helping AI accurately understand your intent
- One-click approve or reject, with AI responding immediately

## When to Use This Technique

**Use Cases**:
- AI Agent completes a plan and calls `ExitPlanMode` (Claude Code)
- AI Agent calls the `submit_plan` tool (OpenCode)
- Need to review AI-generated implementation plans
- Need to provide precise feedback on plan modifications

**Not Applicable**:
- Directly letting AI implement code (skipping plan review)
- Already approved a plan and need to review actual code changes (use code review feature)

## 🎒 Before You Start

**Prerequisites**:
- ✅ Plannotator CLI installed (see [Quick Start](../start/getting-started/))
- ✅ Claude Code or OpenCode plugin configured (see corresponding installation guide)
- ✅ AI Agent supports plan review (Claude Code 2.1.7+, or OpenCode)

**Trigger Method**:
- **Claude Code**: AI automatically calls `ExitPlanMode` after completing the plan, Plannotator launches automatically
- **OpenCode**: AI calls the `submit_plan` tool, Plannotator launches automatically

## Core Concepts

### What is Plan Review

**Plan Review** is Plannotator's core feature for visually reviewing AI-generated implementation plans.

::: info Why do we need plan review?
After AI generates a plan, it typically asks "Is this plan okay?" or "Should I start implementation?". Without a visual tool, you can only read plain text plans in the terminal and respond with vague feedback like "okay" or "no, modify XX". Plannotator lets you view plans with a visual interface, precisely select parts that need modification, and add structured annotations, making it easier for AI to understand your intent.
:::

### Workflow

```
┌─────────────────┐
│  AI Agent      │
│  (Generate plan)│
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← Browser opens automatically
│                 │
│ ┌───────────┐  │
│ │ Plan content│  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ Select text
│       ▼         │
│ ┌───────────┐  │
│ │ Add annotation│ │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ Decision  │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} or
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  AI Agent      │
│  (Continue implementation)│
└─────────────────┘
```

### Annotation Types

Plannotator supports four annotation types, each with different purposes:

| Annotation Type | Purpose | Feedback AI Receives |
|--- | --- | ---|
| **Delete** | Delete unnecessary content | "Delete: [selected text]" |
| **Replace** | Replace with better content | "Replace: [selected text] with [your input text]" |
| **Comment** | Comment on a section without requesting modification | "Comment: [selected text]. Note: [your input comment]" |
| **Global Comment** | Global comment not associated with specific text | "Global comment: [your input comment]" |

### Approve vs Request Changes

| Decision Type | Action | Feedback AI Receives | Use Case |
|--- | --- | --- | ---|
| **Approve** | Click Approve button | `{"behavior": "allow"}` | Plan is fine, approve directly |
| **Request Changes** | Click Request Changes button | `{"behavior": "deny", "message": "..."}` | Parts need modification |

::: tip Differences between Claude Code and OpenCode
- **Claude Code**: Annotations are not sent when approving (annotations are ignored)
- **OpenCode**: Annotations can be sent as notes when approving (optional)

**When rejecting a plan**: Regardless of platform, annotations are always sent to AI
:::

## Follow Along

### Step 1: Trigger Plan Review

**Claude Code Example**:

Chat with AI in Claude Code and ask AI to generate an implementation plan:

```
User: Help me write an implementation plan for a user authentication module

Claude: Sure, here's the implementation plan:
1. Create user model
2. Implement registration API
3. Implement login API
...
(AI calls ExitPlanMode)
```

**OpenCode Example**:

In OpenCode, AI will automatically call the `submit_plan` tool.

**What You Should See**:
1. Browser automatically opens Plannotator UI
2. Displays AI-generated plan content (Markdown format)
3. "Approve" and "Request Changes" buttons at the bottom of the page

### Step 2: Browse Plan Content

View the plan in your browser:

- Plans are rendered in Markdown format, including headings, paragraphs, lists, and code blocks
- Scroll to view the entire plan
- Supports light/dark mode toggle (click theme toggle button in top right corner)

### Step 3: Select Plan Text and Add Annotations

**Add Delete Annotation**:

1. Use your mouse to select the text in the plan that needs to be deleted
2. Click the **Delete** button in the popup toolbar
3. Text will be marked with deletion style (red strikethrough)

**Add Replace Annotation**:

1. Use your mouse to select the text in the plan that needs to be replaced
2. Click the **Replace** button in the popup toolbar
3. Enter the replacement content in the popup input box
4. Press Enter or click confirm
5. Original text will be marked with replacement style (yellow background), and replacement content will be displayed below

**Add Comment Annotation**:

1. Use your mouse to select the text in the plan that needs commenting
2. Click the **Comment** button in the popup toolbar
3. Enter the comment content in the popup input box
4. Press Enter or click confirm
5. Text will be marked with comment style (blue highlight), and the comment will be displayed in the sidebar

**Add Global Comment**:

1. Click the **Add Global Comment** button in the top right corner of the page
2. Enter the global comment content in the popup input box
3. Press Enter or click confirm
4. The comment will be displayed in the "Global Comments" section of the sidebar

**What You Should See**:
- When text is selected, a toolbar immediately pops up (Delete, Replace, Comment)
- After adding annotations, text displays corresponding styles (strikethrough, background color, highlight)
- Sidebar displays a list of all annotations, click to jump to corresponding position
- You can click the **Delete** button next to an annotation to remove it

### Step 4: Approve Plan

**If the plan has no issues**:

Click the **Approve** button at the bottom of the page.

**What You Should See**:
- Browser automatically closes (1.5 second delay)
- Claude Code/OpenCode terminal shows that the plan has been approved
- AI continues to implement the plan

::: info Approve behavior
- **Claude Code**: Only sends `{"behavior": "allow"}`, annotations are ignored
- **OpenCode**: Sends `{"behavior": "allow"}`, annotations can be sent as notes (optional)
:::

### Step 5: Reject Plan (Request Changes)

**If the plan needs modification**:

1. Add necessary annotations (Delete, Replace, Comment)
2. Click the **Request Changes** button at the bottom of the page
3. Browser will display a confirmation dialog

**What You Should See**:
- Confirmation dialog shows "Send X annotations to AI?"
- After confirming, browser automatically closes
- Claude Code/OpenCode terminal displays feedback content
- AI will modify the plan based on feedback

::: tip Request Changes behavior
- **Claude Code** and **OpenCode**: Both send `{"behavior": "deny", "message": "..."}`
- Annotations are converted to structured Markdown text
- AI will modify the plan based on annotations and call ExitPlanMode/submit_plan again
:::

### Step 6: View Feedback Content (Optional)

If you want to view the feedback content Plannotator sent to AI, you can check in the terminal:

**Claude Code**:
```
Plan rejected by user
Please modify the plan based on the following feedback:

[Structured annotation content]
```

**OpenCode**:
```
<feedback>
[Structured annotation content]
</feedback>
```

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Browser automatically opens Plannotator UI when AI triggers plan review
- [ ] Select plan text and add Delete, Replace, Comment annotations
- [ ] Add Global Comment
- [ ] View all annotations in the sidebar and jump to corresponding positions
- [ ] Click Approve, browser closes, AI continues implementation
- [ ] Click Request Changes, browser closes, AI modifies plan

**If a step fails**, see:
- [Common Problems](../../faq/common-problems/)
- [Claude Code Installation Guide](../../start/installation-claude-code/)
- [OpenCode Installation Guide](../../start/installation-opencode/)

## Pitfall Alerts

**Common Error 1**: After selecting text, the toolbar doesn't appear

**Cause**: Might be because text in a code block is selected, or the selected text spans multiple elements.

**Solution**:
- Try to select text within a single paragraph or list item
- For code blocks, you can use Comment annotation, don't select across multiple lines

**Common Error 2**: After adding Replace annotation, replacement content doesn't display

**Cause**: Replacement content input box might not have been submitted correctly.

**Solution**:
- After entering replacement content, press Enter or click the confirm button
- Check if the replacement content is displayed in the sidebar

**Common Error 3**: After clicking Approve or Request Changes, browser doesn't close

**Cause**: Might be a server error or network issue.

**Solution**:
- Check if there are error messages in the terminal
- Manually close the browser
- If the problem persists, see [Troubleshooting](../../faq/troubleshooting/)

**Common Error 4**: AI doesn't modify the plan according to annotations after receiving feedback

**Cause**: AI might not have correctly understood the annotation intent.

**Solution**:
- Try using more explicit annotations (Replace is more explicit than Comment)
- Use Comment to add detailed explanations
- If the problem persists, you can reject the plan again and adjust the annotation content

**Common Error 5**: After adding multiple Delete annotations, AI only deleted some content

**Cause**: Multiple Delete annotations might overlap or conflict with each other.

**Solution**:
- Ensure the text range of each Delete annotation doesn't overlap
- If you need to delete a large section, you can select the entire paragraph to delete at once

## Lesson Summary

Plan review is Plannotator's core feature, allowing you to visually review AI-generated plans:

**Core Operations**:
1. **Trigger**: AI calls `ExitPlanMode` or `submit_plan`, browser automatically opens UI
2. **Browse**: View plan content in the visual interface (Markdown format)
3. **Annotate**: Select text, add Delete, Replace, Comment, or Global Comment
4. **Decide**: Click Approve or Request Changes
5. **Feedback**: Annotations are converted to structured data, AI continues or modifies the plan based on feedback

**Annotation Types**:
- **Delete**: Delete unnecessary content
- **Replace**: Replace with better content
- **Comment**: Comment on a section without requesting modification
- **Global Comment**: Global comment not associated with specific text

**Decision Types**:
- **Approve**: Plan is fine, approve directly (Claude Code ignores annotations)
- **Request Changes**: Parts need modification, annotations sent to AI

## Next Lesson Preview

> Next, we'll learn **[Adding Plan Annotations](../plan-review-annotations/)**.
>
> You'll learn:
> - How to precisely use Delete, Replace, Comment annotations
> - How to add image annotations
> - How to edit and delete annotations
> - Best practices and common scenarios for annotations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Plan Review UI | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200) | 1-200 |
| Annotation Type Definitions | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70) | 1-70 |
| Plan Review Server | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310) | 91-310 |
| API: Get Plan Content | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134) | 132-134 |
| API: Approve Plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277) | 201-277 |
| API: Reject Plan | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309) | 280-309 |
| Viewer Component | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100) | 1-100 |
| AnnotationPanel Component | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50 |

**Key Types**:
- `AnnotationType`: Annotation type enum (DELETION, INSERTION, REPLACEMENT, COMMENT, GLOBAL_COMMENT) (`packages/ui/types.ts:1-7`)
- `Annotation`: Annotation interface (`packages/ui/types.ts:11-33`)
- `Block`: Plan block interface (`packages/ui/types.ts:35-44`)

**Key Functions**:
- `startPlannotatorServer()`: Start plan review server (`packages/server/index.ts:91`)
- `parseMarkdownToBlocks()`: Parse Markdown to Blocks (`packages/ui/utils/parser.ts`)

**API Routes**:
- `GET /api/plan`: Get plan content (`packages/server/index.ts:132`)
- `POST /api/approve`: Approve plan (`packages/server/index.ts:201`)
- `POST /api/deny`: Reject plan (`packages/server/index.ts:280`)

**Business Rules**:
- Claude Code doesn't send annotations when approving (`apps/hook/server/index.ts:132`)
- OpenCode can send annotations as notes when approving (`apps/opencode-plugin/index.ts:270`)
- Annotations are always sent when rejecting a plan (`apps/hook/server/index.ts:154`)

</details>
