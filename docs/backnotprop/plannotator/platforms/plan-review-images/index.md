---
title: "Image Annotations: Three Tools | Plannotator"
sidebarTitle: "Image Annotations"
subtitle: "Image Annotations: Three Tools"
description: "Learn Plannotator's three image annotation tools. Attach images in plan reviews, use pen, arrow, circle tools, adjust colors and shortcuts."
tags:
  - "Image Annotation"
  - "Pen"
  - "Arrow"
  - "Circle"
  - "Shortcuts"
  - "Plan Review"
  - "Code Review"
prerequisite:
  - "platforms-plan-review-basics"
order: 3
---

# Adding Image Annotations: Mark Images with Pen, Arrow, Circle

## What You'll Learn

- ✅ Attach images in plan review or code review
- ✅ Use the pen tool for freehand drawing
- ✅ Use the arrow tool to mark key areas
- ✅ Use the circle tool to highlight regions
- ✅ Adjust annotation color and stroke size
- ✅ Use shortcuts to quickly switch tools and operations

## Your Current Challenges

**Challenge 1**: When reviewing UI design mockups or flowcharts, text descriptions aren't intuitive enough—you need to circle problem areas.

**Challenge 2**: You want to add screenshot annotations to code reviews, but can only use text to say "there's a problem here" without marking it directly on the image.

**Challenge 3**: You receive an image link shared by your team and want to quickly annotate feedback, but don't want to download it and use other tools.

**How Plannotator Helps**:
- Annotate images directly in the browser, no need to download locally
- Three tools: pen, arrow, circle covering all annotation scenarios
- Five colors and five stroke sizes for flexible adjustment
- Keyboard shortcuts to boost annotation efficiency

## When to Use This Technique

**Use Cases**:
- Reviewing UI design mockups, flowcharts, or architecture diagrams and need to mark issues
- Code reviews require screenshots with code problem annotations
- Sharing annotated images with team members
- Needing to circle key areas or add directional arrows on images

## 🎒 Before You Start

::: warning Prerequisites

This tutorial assumes you have already:

- ✅ Completed [Plan Review Basics](../plan-review-basics/) or [Code Review Basics](../code-review-basics/)
- ✅ Know how to open plan review or code review pages
- ✅ Understand basic annotation operations

:::

## Core Concepts

**Three Image Annotation Tools**:

| Tool | Icon | Shortcut | Purpose |
|--- | --- | --- | ---|
| **Pen** | 🖊️ | 1 | Freehand drawing, suitable for handwritten annotations or circling arbitrary shapes |
| **Arrow** | ➡️ | 2 | Mark key areas or indicate direction, suitable for point-to-point annotations |
| **Circle** | ⭕ | 3 | Circle regions, suitable for highlighting specific elements |

**Workflow**:
```
Upload image → Select tool → Adjust color and size → Draw on image → Save
```

## Follow Along

### Step 1: Open Plan Review or Code Review Page

**Why**
Plannotator's image annotation feature is integrated into plan review and code review.

**Actions**

1. Launch plan review (triggered by Claude Code or OpenCode calling submit_plan)
2. Or run the `/plannotator-review` command to launch code review

**What You Should See**:
- Browser opens the review page
- "Upload" or "Attachment" button in the top right corner

### Step 2: Upload Image

**Why**
You need to upload an image before annotating it.

**Actions**

1. Click the "Upload" or "Attachment" button in the top right corner
2. Select the image to annotate (supports PNG, JPEG, WebP formats)
3. The uploaded image will appear in the annotation list

**What You Should See**:
- Image thumbnail appears in the annotation area
- Click the thumbnail to open the annotation editor

::: tip Image Sources
You can get images through:
- Screenshot and paste (Ctrl+V / Cmd+V)
- Select from local files
- Drag and drop the image onto the page
:::

### Step 3: Open Image Annotation Editor

**Why**
The annotation editor provides drawing tools and color selection.

**Actions**

1. Click the uploaded image thumbnail
2. Image annotation editor opens in a modal

**What You Should See**:
- Image displayed centered
- A toolbar row at the top
- Toolbar from left to right: tool selection, stroke size, color selection, undo, clear, save

### Step 4: Use Pen Tool for Freehand Drawing

**Why**
The pen tool is suitable for handwritten annotations or circling arbitrary shapes.

**Actions**

1. Ensure the pen tool is selected (🖊️ icon, selected by default)
2. Press and hold the left mouse button to draw on the image
3. Release the mouse to complete drawing

**What You Should See**:
- Line trails following your mouse movement
- After releasing the mouse, the drawn shape is fixed on the image

::: info Pen Features
- Uses perfect-freehand library for smooth freehand drawing effects
- Supports pressure sensitivity (if your device supports it)
- Thicker strokes produce smoother lines
:::

### Step 5: Use Arrow Tool to Mark Key Areas

**Why**
Arrows are suitable for point-to-point annotations, clearly indicating problem locations.

**Actions**

1. Click the arrow tool (➡️ icon) or press shortcut `2`
2. Click on the image to set the arrow start point
3. Drag to the target position and release the mouse to complete the arrow

**What You Should See**:
- A straight line from start to end point
- An arrow head at the end pointing to the target location

::: tip Arrow Drawing Tips
- **Start point** is the arrow tail, **end point** is the arrow head
- You can preview arrow direction in real-time while dragging
- Suitable for scenarios like "there's a problem here" or "needs modification here"
:::

### Step 6: Use Circle Tool to Highlight Regions

**Why**
Circles are suitable for highlighting specific elements with clear region selection.

**Actions**

1. Click the circle tool (⭕ icon) or press shortcut `3`
2. Click on the image to set one edge of the circle
3. Drag to the opposite edge and release the mouse to complete the circle

**What You Should See**:
- A circle with the line from start to end point as its diameter
- Circle center is the midpoint of the two points

::: details Circle Drawing Principle

The circle tool draws from edge to edge:
- **First click**: One edge of the circle
- **Drag**: Determine the circle's diameter
- **Release**: Circle drawing complete

Source code implementation (`utils.ts:95-124`):
```typescript
// Center is the midpoint of start and end points
const cx = (x1 + x2) / 2;
const cy = (y1 + y2) / 2;

// Radius is half the distance between two points
const radius = Math.hypot(x2 - x1, y2 - y1) / 2;
```

:::

### Step 7: Adjust Annotation Color

**Why**
Different colors can distinguish different types of annotations (e.g., red for errors, green for suggestions).

**Actions**

1. Click the color circle in the toolbar
2. Available colors: red, yellow, green, blue, white

**What You Should See**:
- The currently selected color circle appears enlarged
- All newly drawn annotations use the current color

::: info Color Usage Recommendations
- **Red**: Errors, problems, content to delete
- **Yellow**: Warnings, attention, items needing confirmation
- **Green**: Suggestions, optimizations, improvement ideas
- **Blue**: Supplementary notes, remarks
- **White**: For images with dark backgrounds
:::

### Step 8: Adjust Stroke Size

**Why**
Different stroke sizes suit different annotation scenarios.

**Actions**

1. Click the `-` or `+` button in the toolbar
2. Or observe the current stroke size preview (a dot)

**What You Should See**:
- Stroke size options: 3, 6, 10, 16, 24
- Toolbar center displays a preview dot of the current stroke size

::: tip Stroke Size Recommendations
- **3**: Precise annotation of small elements (like buttons, icons)
- **6**: Regular annotations (default value)
- **10**: Thick strokes, suitable for circling larger areas
- **16**: Very thick annotations, suitable for emphasizing key points
- **24**: Maximum stroke, suitable for highlighting very large areas
:::

### Step 9: Undo and Clear

**Why**
Mistakes happen during annotation, requiring undo or restart.

**Actions**

1. **Undo last step**: Click the undo icon (↩️) or press `Cmd+Z` / `Ctrl+Z`
2. **Clear all annotations**: Click the clear icon (❌)

**What You Should See**:
- Undo: The last drawn annotation disappears
- Clear: All annotations are removed, restoring the original image

::: warning Clear Warning
Clear action cannot be undone—use with caution. It's recommended to use undo to step back gradually.
:::

### Step 10: Save Annotations

**Why**
After saving, the image is merged into the annotation and can be viewed in the review.

**Actions**

1. Click the save icon (✅) on the right side of the toolbar
2. Or press `Esc` or `Enter` key
3. Or click outside the modal

**What You Should See**:
- Modal closes
- Image thumbnail updates to the annotated version
- Image is now attached to the current annotation

::: tip Save Mechanism
- If **no annotations are drawn**, the original image is saved directly
- If **annotations exist**, the original image and annotations are merged into a new image
- The merged image is saved in PNG format, maintaining high quality
:::

## Checkpoint ✅

**Verify your learning**:

- [ ] Can successfully upload images to the review page
- [ ] Can use pen, arrow, and circle tools to draw annotations
- [ ] Can adjust annotation colors and stroke sizes
- [ ] Can use shortcuts (1/2/3, Cmd+Z, Esc) for quick operations
- [ ] Can undo incorrect annotations
- [ ] Can save annotated images

## Pitfall Alerts

### Issue 1: Arrow Direction Reversed

**Symptom**: Arrow points in the wrong direction.

**Cause**: Arrow tool draws from start point (tail) to end point (head).

**Solution**:
- Redraw, ensuring the start point is the arrow tail and end point is the arrow head
- If already drawn, undo and redraw

### Issue 2: Circle Position Incorrect

**Symptom**: Circle doesn't enclose the target area.

**Cause**: Circle tool draws from edge to edge, with the center at the midpoint of the two points.

**Solution**:
- First click on the edge of the target area
- Drag to the opposite edge, ensuring the target area is within the circle
- You can undo and redraw while adjusting

### Issue 3: Stroke Too Thick or Too Thin

**Symptom**: Annotation effect is not ideal.

**Cause**: Stroke size doesn't fit the current scenario.

**Solution**:
- Use the `-` or `+` buttons in the toolbar to adjust stroke size
- Use 3-6 for small elements, 10-24 for large areas

### Issue 4: Color Not Visible

**Symptom**: Using black strokes on a dark background, annotations are hard to see.

**Cause**: Inappropriate color selection.

**Solution**:
- Use white or yellow on dark backgrounds
- Use red, green, or blue on light backgrounds

## Shortcut Reference

| Shortcut | Function |
|--- | ---|
| `1` | Switch to pen tool |
| `2` | Switch to arrow tool |
| `3` | Switch to circle tool |
| `Cmd+Z` / `Ctrl+Z` | Undo last step |
| `Esc` / `Enter` | Save annotations |

## Lesson Summary

In this lesson you learned:

1. **Uploading Images**: Via upload button or paste to review page
2. **Three Annotation Tools**:
   - Pen (1): Freehand drawing, suitable for handwritten annotations
   - Arrow (2): Point-to-point annotation, suitable for highlighting key points
   - Circle (3): Circling regions, suitable for highlighting elements
3. **Adjusting Annotation Styles**: 5 colors, 5 stroke sizes
4. **Undo and Clear**: Correct incorrect annotations
5. **Saving Annotations**: Merge annotations into the image

## Next Lesson Preview

> Next, we'll learn **[Code Review Basics](../code-review-basics/)**.
>
> You'll learn:
> - How to use the /plannotator-review command to review git diff
> - Switch between side-by-side and unified views
> - Click line numbers to select code ranges
> - Add line-level annotations (comment/suggestion/concern)
> - Switch different diff types
> - Send feedback to AI Agent

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Tool type definitions | [`packages/ui/components/ImageAnnotator/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/types.ts#L1-L40) | 1-40 |
| Render functions | [`packages/ui/components/ImageAnnotator/utils.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/utils.ts#L1-L148) | 1-148 |
| Main component | [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx#L1-L233) | 1-233 |
| Toolbar component | [`packages/ui/components/ImageAnnotator/Toolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/Toolbar.tsx#L1-L219) | 1-219 |
| Annotation interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |

**Key Types**:

**Tool** (tool type):
```typescript
export type Tool = 'pen' | 'arrow' | 'circle';
```

**Point** (coordinate point):
```typescript
export interface Point {
  x: number;
  y: number;
  pressure?: number;
}
```

**Stroke** (stroke):
```typescript
export interface Stroke {
  id: string;
  tool: Tool;
  points: Point[];
  color: string;
  size: number;
}
```

**AnnotatorState** (annotator state):
```typescript
export interface AnnotatorState {
  tool: Tool;
  color: string;
  strokeSize: number;
  strokes: Stroke[];
  currentStroke: Stroke | null;
}
```

**COLORS** (color array):
```typescript
export const COLORS = [
  '#ef4444', // red
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#ffffff', // white
] as const;
```

**STROKE_SIZES** (stroke sizes):
```typescript
const STROKE_SIZES = [3, 6, 10, 16, 24];
```

**Key Functions**:

**renderPenStroke()** (render pen stroke):
- Uses perfect-freehand library for smooth freehand effects
- Supports pressure sensitivity (pressure field)

**renderArrow()** (render arrow):
- Draws a straight line from start to end point
- Draws an arrow head at the end point

**renderCircle()** (render circle):
- Calculates the midpoint of two points as the circle center
- Calculates half the distance between two points as the radius

**renderStroke()** (render based on tool type):
- Calls the corresponding render function based on the tool field
- Supports scaling (scale parameter)

**Annotation.imagePaths** (attached image field):
```typescript
export interface Annotation {
  // ...
  imagePaths?: string[]; // Attached images (local paths or URLs)
}
```

**Shortcut handling** (index.tsx:33-59):
```typescript
// 1/2/3 to switch tools
if (e.key === '1') setState(s => ({ ...s, tool: 'pen' }));
if (e.key === '2') setState(s => ({ ...s, tool: 'arrow' }));
if (e.key === '3') setState(s => ({ ...s, tool: 'circle' }));

// Cmd+Z to undo
if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
  e.preventDefault();
  handleUndo();
}
```

</details>
