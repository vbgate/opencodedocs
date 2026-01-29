---
title: "Plan Annotations: Four Types | Plannotator"
sidebarTitle: "Plan Annotations"
subtitle: "Plan Annotations: Four Types"
description: "Master Plannotator's four annotation types for plan review: delete, replace, insert, and comment. Learn to select text, use type-to-comment shortcuts, attach images, and understand each type's use cases with exported Markdown formats."
tags:
  - "Plan Annotations"
  - "Annotation Types"
  - "Delete"
  - "Replace"
  - "Insert"
  - "Comment"
  - "type-to-comment"
  - "Image Attachments"
prerequisite:
  - "platforms-plan-review-basics"
order: 2
---

# Adding Plan Annotations: Master Four Annotation Types

## What You'll Learn

- ✅ Select plan text and add four different annotation types (delete, replace, insert, comment)
- ✅ Use type-to-comment shortcut to directly input comments
- ✅ Attach images to annotations (reference images, screenshots, etc.)
- ✅ Understand the meaning and use cases of each annotation type
- ✅ View the exported Markdown format of annotations

## Your Current Challenges

**Challenge 1**: You know you want to delete a section of content, but after selecting text, you don't know which button to click.

**Challenge 2**: You want to replace a piece of code, but the toolbar only shows "Delete" and "Comment" buttons, with no "Replace" option.

**Challenge 3**: When selecting multiple lines of text to directly input comments, you have to click the "Comment" button every time, which is inefficient.

**Challenge 4**: You want to attach a reference image to a section of code, but you don't know how to upload the image.

**How Plannotator Helps**:
- Clear button icons that let you instantly distinguish between delete, replace, insert, and comment
- type-to-comment shortcut for direct input without clicking buttons
- Image attachments supported in annotations for easy reference image addition
- Annotations automatically converted to structured Markdown for accurate AI understanding

## When to Use This Technique

**Use Cases**:
- Reviewing AI-generated implementation plans that require precise modification feedback
- When a section of content is not needed (delete)
- When a section of content needs to be changed to another phrasing (replace)
- When a section of content needs supplementary explanation added (insert)
- When you have questions or suggestions about a section of content (comment)

**Not Applicable**:
- Simply approving or rejecting a plan as a whole (no annotations needed, just make the decision)
- Already reviewing code changes (use the code review feature)

## 🎒 Before You Start

**Prerequisites**:
- ✅ Completed the [Plan Review Basics](../plan-review-basics/) tutorial
- ✅ Understand how to trigger the Plannotator plan review interface

**Assumptions**:
- You have already opened the Plannotator plan review page
- The page displays an AI-generated Markdown plan

## Core Concepts

### Annotation Types Explained

Plannotator supports four plan annotation types (plus one global comment type):

| Annotation Type | Icon | Purpose | Requires Input |
|----------------|------|---------|----------------|
| **Delete (DELETION)** | 🗑️ | Mark this content for removal from the plan | ❌ No |
| **Comment (COMMENT)** | 💬 | Ask questions or make suggestions about selected content | ✅ Yes |
| **Replace (REPLACEMENT)** | Implemented via comment | Replace selected content with new content | ✅ Yes |
| **Insert (INSERTION)** | Implemented via comment | Insert new content after selected content | ✅ Yes |
| **Global Comment (GLOBAL_COMMENT)** | Input box at bottom of page | Provide feedback on the entire plan | ✅ Yes |

**Why don't Replace and Insert have separate buttons?**

Looking at the source code implementation, replace and insert are essentially special comment types (`packages/ui/utils/parser.ts:287-296`):
- **Replace**: The comment content serves as the replacement text
- **Insert**: The comment content serves as the inserted text

Both are created using the **Comment (COMMENT)** button, with the difference being how you describe your intent.

### Toolbar Workflow

```
Select text → Toolbar pops up (menu step)
                  │
                  ├── Click Delete → Immediately create delete annotation
                  ├── Click Comment → Enter input step → Enter content → Save
                  └── Type directly → type-to-comment → Auto-enter input step
```

**Difference between the two steps**:
- **Menu step**: Choose operation type (delete, comment, cancel)
- **Input step**: Enter comment content or attach images (from comment/replace/enter)

### type-to-comment Shortcut

This is the key feature for efficiency. When you select a section of text, **start typing directly** (without clicking any buttons), and the toolbar will automatically:
1. Switch to "Comment" mode
2. Place your first typed character in the input box
3. Automatically position the cursor at the end of the input box

Source code implementation location: `packages/ui/components/AnnotationToolbar.tsx:127-147`

## Follow Along

### Step 1: Launch Plan Review

**Why**
You need an actual plan to practice adding annotations.

**Action**

Trigger plan review in Claude Code or OpenCode:

```bash
# Claude Code example: After AI generates a plan, it calls ExitPlanMode
"Please generate an implementation plan for user authentication"

# Wait for AI to complete the plan, Plannotator will automatically open in browser
```

**What You Should See**:
- Browser opens the plan review page
- Page displays a Markdown-formatted implementation plan

### Step 2: Add Delete Annotation

**Why**
Delete annotations are used to mark content you don't want to appear in the final plan.

**Action**

1. Find a paragraph in the plan you don't need (for example, a description of an unrelated feature)
2. Use your mouse to select the text
3. Toolbar automatically pops up, click the **Delete button (🗑️)**

**What You Should See**:
- Selected text displays with deletion style (typically strikethrough or red background)
- Toolbar automatically closes

::: tip Characteristics of Delete Annotation
Delete annotations **do not require any input**. After clicking the delete button, the annotation is created immediately.
:::

### Step 3: Use type-to-comment to Add Comment

**Why**
Comment is the most common annotation type, and type-to-comment lets you skip one button click.

**Action**

1. Select text in the plan (for example, a function name or description)
2. **Do not click any buttons, start typing directly**
3. Enter your comment content (for example: "This function name is not clear enough")
4. Press `Enter` key to save, or click the **Save** button

**What You Should See**:
- Toolbar automatically switches to input box mode
- The first character you typed is already in the input box
- Cursor automatically positioned at the end of the input box
- After pressing `Enter`, selected text displays with comment style (typically yellow background)

::: tip type-to-comment Shortcuts
- `Enter`: Save annotation (if input box has content)
- `Shift + Enter`: Line break (use when entering multi-line comments)
- `Escape`: Cancel input and return to menu step
:::

### Step 4: Add Replace Annotation

**Why**
Replace annotations are used to replace selected content with new content. AI will modify the plan based on your annotation.

**Action**

1. Select text in the plan (for example, "使用 JWT token 进行认证")
2. Use type-to-comment or click the comment button
3. Enter the new content in the input box (for example: "使用 session cookie 进行认证")
4. Press `Enter` to save

**What You Should See**:
- Selected text displays with comment style
- Your comment content displays in the annotation sidebar

**Exported Format** (`packages/ui/utils/parser.ts:292-296`):

```markdown
## 1. Change this

**From:**
```
使用 JWT token 进行认证
```

**To:**
```
使用 session cookie 进行认证
```
```

::: info Difference Between Replace and Delete
- **Delete**: Directly remove content, no need to explain the reason
- **Replace**: Replace old content with new content, need to specify the new content
:::

### Step 5: Add Insert Annotation

**Why**
Insert annotations are used to add supplementary explanation or code snippets after selected content.

**Action**

1. Select text in the plan (for example, at the end of a function signature)
2. Use type-to-comment or click the comment button
3. Enter the content to insert in the input box (for example: "，需要处理认证失败的情况")
4. Press `Enter` to save

**What You Should See**:
- Selected text displays with comment style
- Your comment displays in the annotation sidebar

**Exported Format** (`packages/ui/utils/parser.ts:287-290`):

```markdown
## 1. Add this

```
，需要处理认证失败的情况
```
```

### Step 6: Attach Images to Annotations

**Why**
Sometimes text descriptions aren't intuitive enough, and you need to attach reference images or screenshots.

**Action**

1. Select any text and enter the input step (click comment button or type-to-comment)
2. Next to the toolbar input box, click the **Attachment button (📎)**
3. Select the image to upload (supports PNG, JPEG, WebP formats)
4. You can continue entering comment content
5. Press `Enter` to save

**What You Should See**:
- Image thumbnail displays in the input box
- After saving, image displays in the annotation sidebar

::: warning Image Storage Location
Uploaded images are saved in the local `/tmp/plannotator` directory (source location: `packages/server/index.ts:163`). If temporary files are cleaned up, images will be lost.
:::

### Step 7: Add Global Comment

**Why**
When you have feedback on the entire plan (not targeting specific text), use global comment.

**Action**

1. Find the input box at the bottom of the page (label might be "Add a general comment about the plan...")
2. Enter your comment content
3. Press `Enter` to save or click the send button

**What You Should See**:
- Comment appears in the global comment area at the bottom of the page
- Comment displays as an independent card, not associated with any text block

::: tip Global Comment vs Text Comment
- **Global Comment**: Feedback on the entire plan, not associated with specific text (for example: "The entire plan lacks performance considerations")
- **Text Comment**: Feedback on a section of text, will highlight the corresponding text
:::

## Checkpoint ✅

After completing the above steps, you should:

- [ ] Successfully added at least one delete annotation
- [ ] Used type-to-comment to add a comment
- [ ] Added replace and insert annotations
- [ ] Attached an image to an annotation
- [ ] Added a global comment
- [ ] Seen all annotations listed in the right sidebar

## Pitfall Alerts

### Pitfall 1: Cannot Find "Replace" Button

**Incorrect Action**:
- After selecting text, toolbar only shows Delete and Comment, no Replace or Insert buttons

**Correct Approach**:
- Replace and insert are implemented via the **Comment (COMMENT)** button
- Describe your intent (replace or insert) in the comment content
- AI will understand your intent based on the comment content

### Pitfall 2: type-to-comment Not Working

**Possible Reasons**:
1. No text selected
2. Clicked a button first, toolbar already entered input step
3. Typed a special key (`Ctrl`, `Alt`, `Escape`, etc.)

**Correct Approach**:
1. First select text, ensure toolbar displays in menu step (has Delete, Comment buttons)
2. Type ordinary characters directly (letters, numbers, punctuation)
3. Don't press function keys

### Pitfall 3: Cannot Find Uploaded Images

**Possible Reasons**:
- Images are saved in the `/tmp/plannotator` directory
- System cleaned up temporary files

**Correct Approach**:
- If you need to save images long-term, consider copying to the project directory
- When exporting annotations, image paths are absolute paths, ensure other tools can access them

### Pitfall 4: Pressing `Enter` to Line Break Saves Annotation Instead

**Incorrect Action**:
- Wanting to line break in the input box, directly pressing `Enter`, but the annotation gets saved

**Correct Approach**:
- Use `Shift + Enter` for line breaks
- `Enter` key is dedicated to saving annotations

## Lesson Summary

**Four Annotation Types**:
- **Delete (DELETION)**: Mark content not desired in the plan
- **Replace (REPLACEMENT)**: Replace selected content with new content (implemented via comment)
- **Insert (INSERTION)**: Add content after selected content (implemented via comment)
- **Comment (COMMENT)**: Ask questions or make suggestions about selected content
- **Global Comment (GLOBAL_COMMENT)**: Feedback on the entire plan

**Key Operations**:
- Select → Toolbar pops up → Choose operation type
- type-to-comment: Type characters directly, auto-enter comment mode
- `Shift + Enter`: Line break; `Enter`: Save
- Attachment button: Upload images to annotations

**Annotation Export Format**:
- Delete: `## Remove this` + original text
- Insert: `## Add this` + new text
- Replace: `## Change this` + From/To comparison
- Comment: `## Feedback on: "..."` + comment content

## Next Lesson Preview

> Next, we'll learn **[Adding Image Annotations](../plan-review-images/)**.
>
> You'll learn:
> - How to attach images in plan review
> - Using brush, arrow, and circle tools for annotations
> - Annotating images as reference feedback

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
| --------------- | ------------------------------------------------------------------------------------------------------------------- | ------------ |
| Annotation type enum definition | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Annotation interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| Annotation toolbar component | [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L29-L272) | 29-272 |
| type-to-comment implementation | [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L127-L147) | 127-147 |
| Annotation export formatting | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| Markdown parsing to Blocks | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| Viewer component (text selection handling) | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L66-L350) | 66-350 |

**Key Constants**:
- `AnnotationType.DELETION = 'DELETION'`: Delete annotation type
- `AnnotationType.INSERTION = 'INSERTION'`: Insert annotation type
- `AnnotationType.REPLACEMENT = 'REPLACEMENT'`: Replace annotation type
- `AnnotationType.COMMENT = 'COMMENT'`: Comment annotation type
- `AnnotationType.GLOBAL_COMMENT = 'GLOBAL_COMMENT'`: Global comment type

**Key Functions**:
- `exportDiff(blocks, annotations)`: Export annotations to Markdown format, including From/To comparison
- `parseMarkdownToBlocks(markdown)`: Parse Markdown to linear Block array
- `createAnnotationFromSource()`: Create Annotation object from text selection

</details>
