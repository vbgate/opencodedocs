---
title: "图片标注: 标记图片 | plannotator"
sidebarTitle: "图片标注"
subtitle: "图片标注: 标记图片"
description: "掌握 plannotator 的图片标注功能。在方案评审中附加图片，使用画笔、箭头和圆圈工具进行标注，支持调整颜色和笔触大小，可使用快捷键提升效率。"
tags:
  - "Image Annotation"
  - "Pen"
  - "Arrow"
  - "Circle"
  - "Keyboard Shortcuts"
  - "Plan Review"
  - "Code Review"
prerequisite:
  - "platforms-plan-review-basics"
order: 3
---

# Add Image Annotations: Use Pen, Arrow, and Circle to Mark Images

## What You'll Learn

- ✅ Attach images in plan reviews or code reviews
- ✅ Use the pen tool for freehand annotations
- ✅ Use the arrow tool to highlight key areas
- ✅ Use the circle tool to outline regions
- ✅ Adjust annotation color and stroke size
- ✅ Use keyboard shortcuts to quickly switch tools and perform actions

## Your Current Challenges

**Challenge 1**: When reviewing UI design mockups or flowcharts, text descriptions aren't intuitive enough—you need to circle problematic areas.

**Challenge 2**: You want to add screenshot comments to code reviews, but you can only describe "there's a problem here" in text without being able to mark directly on the image.

**Challenge 3**: You receive an image link shared by your team and want to quickly add annotations, but you don't want to download it locally and use another tool to process it.

**How Plannotator Helps**:
- Annotate images directly in the browser—no need to download locally
- Three tools: pen, arrow, and circle—covering all annotation scenarios
- Five colors and five stroke sizes—flexibly adjust annotation effects
- Keyboard shortcuts for improved annotation efficiency

## When to Use This Technique

**Use Cases**:
- Annotate UI design mockups, flowcharts, or architecture diagrams during reviews
- Take screenshots and mark code issues in code reviews
- Share annotated images with team members
- Circle key areas on images or add arrows to guide attention

## 🎒 Before You Start

::: warning Prerequisites

This tutorial assumes you have:

- ✅ Completed [Plan Review Basics](../plan-review-basics/) or [Code Review Basics](../code-review-basics/)
- ✅ Know how to open plan review or code review pages
- ✅ Understand basic annotation operations

:::

## Core Concepts

**Three Annotation Tools**:

| Tool | Icon | Shortcut | Purpose |
| ---- | ---- | -------- | ------- |
| **Pen** | 🖊️ | 1 | Freehand drawing—ideal for handwritten notes and circling arbitrary shapes |
| **Arrow** | ➡️ | 2 | Highlight key areas or indicate direction—ideal for point-to-point annotations |
| **Circle** | ⭕ | 3 | Outline regions—ideal for highlighting specific elements |

**Workflow**:
```
Upload image → Select tool → Adjust color and size → Draw on image → Save
```

## Follow Along

### Step 1: Open Plan Review or Code Review Page

**Why**
Plannotator's image annotation feature is integrated into plan reviews and code reviews.

**Actions**

1. Start a plan review (triggered by Claude Code or via OpenCode calling submit_plan)
2. Or run the `/plannotator-review` command to start a code review

**You Should See**:
- Browser opens the review page
- An "Upload" or "Attachment" button in the top-right corner

### Step 2: Upload Image

**Why**
You need to upload an image before annotating it.

**Actions**

1. Click the "Upload" or "Attachment" button in the top-right corner
2. Select the image you want to annotate (supports PNG, JPEG, WebP formats)
3. After uploading, the image will appear in the comment list

**You Should See**:
- Image thumbnail appears in the comment area
- Clicking the thumbnail opens the annotation editor

::: tip Image Sources
You can obtain images in the following ways:
- Take a screenshot and paste (Ctrl+V / Cmd+V)
- Select from local files
- Drag and drop the image onto the page
:::

### Step 3: Open Image Annotation Editor

**Why**
The annotation editor provides drawing tools and color selection.

**Actions**

1. Click the thumbnail of the uploaded image
2. The image annotation editor opens in a modal

**You Should See**:
- Image centered in the modal
- A toolbar at the top
- Toolbar layout (left to right): tool selection, stroke size, color selection, undo, clear, save

### Step 4: Use Pen Tool for Freehand Drawing

**Why**
The pen tool is ideal for handwritten notes or circling arbitrary shapes.

**Actions**

1. Ensure the pen tool is selected (🖊️ icon, selected by default)
2. Press the left mouse button and draw on the image
3. Release the mouse to complete the drawing

**You Should See**:
- Line trail follows your mouse movement
- After releasing the mouse, the drawn shape is fixed on the image

::: info Pen Features
- Uses the perfect-freehand library for smooth freehand effects
- Supports pressure sensitivity (if your device supports it)
- Thicker strokes result in smoother lines
:::

### Step 5: Use Arrow Tool to Highlight Key Areas

**Why**
The arrow tool is ideal for point-to-point annotations to clearly indicate problem locations.

**Actions**

1. Click the arrow tool (➡️ icon) or press shortcut `2`
2. Click on the image to set the arrow's start point
3. Drag to the target position and release the mouse to complete the arrow

**You Should See**:
- A straight line from the start point to the end point
- An arrowhead at the end point, pointing to the target location

::: tip Arrow Drawing Tips
- **Start point** is the arrow tail, **end point** is the arrowhead
- You can preview arrow direction in real-time while dragging
- Ideal for scenarios like "there's a problem here" or "needs modification here"
:::

### Step 6: Use Circle Tool to Outline Regions

**Why**
The circle tool is ideal for highlighting specific elements with clear boundaries.

**Actions**

1. Click the circle tool (⭕ icon) or press shortcut `3`
2. Click on the image to set one edge of the circle
3. Drag to the opposite edge and release the mouse to complete the circle

**You Should See**:
- A circle where the line connecting start and end points is the diameter
- The circle's center is the midpoint between the two points

::: details Circle Drawing Logic

The circle tool draws from edge to edge:
- **First click**: One edge of the circle
- **Drag**: Determines the circle's diameter
- **Release**: Completes the circle

Source implementation (utils.ts:95-124):
```typescript
// Center is the midpoint between start and end points
const cx = (x1 + x2) / 2;
const cy = (y1 + y2) / 2;

// Radius is half the distance between the two points
const radius = Math.hypot(x2 - x1, y2 - y1) / 2;
```

:::

### Step 7: Adjust Annotation Color

**Why**
Different colors can distinguish different types of annotations (e.g., red for errors, green for suggestions).

**Actions**

1. Click a color dot in the toolbar
2. Available colors: red, yellow, green, blue, white

**You Should See**:
- The currently selected color dot appears enlarged
- All newly drawn annotations use the current color

::: info Color Usage Recommendations
- **Red**: Errors, problems, content to be deleted
- **Yellow**: Warnings, attention points, items needing confirmation
- **Green**: Suggestions, optimizations, improvement ideas
- **Blue**: Supplementary notes, remarks
- **White**: Suitable for images with dark backgrounds
:::

### Step 8: Adjust Stroke Size

**Why**
Different stroke sizes suit different annotation scenarios.

**Actions**

1. Click the `-` or `+` buttons in the toolbar
2. Or observe the current stroke size preview (a dot)

**You Should See**:
- Available stroke sizes: 3, 6, 10, 16, 24
- Current stroke size preview dot shown in the middle of the toolbar

::: tip Stroke Size Recommendations
- **3**: Precise annotations for small elements (e.g., buttons, icons)
- **6**: Regular annotations (default value)
- **10**: Thick stroke annotations, suitable for outlining larger areas
- **16**: Very thick annotations, suitable for emphasizing key points
- **24**: Maximum stroke size, suitable for highlighting extra-large areas
:::

### Step 9: Undo and Clear

**Why**
Mistakes during annotation are inevitable—you need to undo or start over.

**Actions**

1. **Undo last action**: Click the undo icon (↩️) or press `Cmd+Z` / `Ctrl+Z`
2. **Clear all annotations**: Click the clear icon (❌)

**You Should See**:
- Undo: The last drawn annotation disappears
- Clear: All annotations are removed, restoring the original image

::: warning Clear Warning
The clear action cannot be undone—use with caution. It's recommended to use undo first to step back gradually.
:::

### Step 10: Save Annotations

**Why**
After saving, the image is merged into the comment and can be viewed in the review.

**Actions**

1. Click the save icon (✅) on the right side of the toolbar
2. Or press `Esc` or `Enter` keys
3. Or click outside the modal area

**You Should See**:
- Modal closes
- Image thumbnail updates to the annotated version
- Image is attached to the current comment

::: tip Save Mechanism
- If **no annotations are drawn**, the original image is saved directly
- If **annotations are present**, the original image and annotations are merged into a new image
- The merged image is saved in PNG format to maintain high quality
:::

## Checkpoint ✅

**Verify Your Learning**:

- [ ] Successfully upload images to the review page
- [ ] Use the three tools (pen, arrow, circle) to draw annotations
- [ ] Adjust annotation color and stroke size
- [ ] Use keyboard shortcuts (1/2/3, Cmd+Z, Esc) for quick operations
- [ ] Undo incorrect annotations
- [ ] Save annotated images

## Common Pitfalls

### Issue 1: Arrow Points in Wrong Direction

**Symptom**: The arrow points in the wrong direction.

**Cause**: The arrow tool draws from the start point (tail) to the end point (head).

**Solution**:
- Redraw the arrow, ensuring the start point is the arrow tail and the end point is the arrowhead
- If already drawn, undo and redraw

### Issue 2: Circle Position is Incorrect

**Symptom**: The circle doesn't enclose the target area.

**Cause**: The circle tool draws from edge to edge, with the center being the midpoint between the two points.

**Solution**:
- First click on the edge of the target area
- Drag to the opposite edge, ensuring the target area is inside the circle
- You can undo and redraw when adjusting

### Issue 3: Stroke is Too Thick or Too Thin

**Symptom**: The annotation effect is not ideal.

**Cause**: The stroke size doesn't suit the current scenario.

**Solution**:
- Use the `-` or `+` buttons in the toolbar to adjust stroke size
- Use 3-6 for small elements, 10-24 for large areas

### Issue 4: Color is Hard to See

**Symptom**: Using a black stroke on a dark background makes the annotation hard to see.

**Cause**: Poor color selection.

**Solution**:
- Use white or yellow on dark backgrounds
- Use red, green, or blue on light backgrounds

## Keyboard Shortcut Reference

| Shortcut | Function |
| -------- | -------- |
| `1` | Switch to pen tool |
| `2` | Switch to arrow tool |
| `3` | Switch to circle tool |
| `Cmd+Z` / `Ctrl+Z` | Undo last action |
| `Esc` / `Enter` | Save annotations |

## Summary

In this lesson, you learned:

1. **Upload Images**: Via the upload button or pasting into the review page
2. **Three Annotation Tools**:
   - Pen (1): Freehand drawing, suitable for handwritten notes
   - Arrow (2): Point-to-point annotations, suitable for highlighting key points
   - Circle (3): Outline regions, suitable for emphasis
3. **Adjust Annotation Style**: 5 colors, 5 stroke sizes
4. **Undo and Clear**: Correct incorrect annotations
5. **Save Annotations**: Merge annotations into the image

## Next Lesson Preview

> Next, we'll learn **[Code Review Basics](../code-review-basics/)**.
>
> You'll learn:
> - How to use the /plannotator-review command to review git diff
> - Switch between side-by-side and unified views
> - Click line numbers to select code ranges
> - Add line-level comments (comment/suggestion/concern)
> - Switch between different diff types
> - Send feedback to the AI Agent

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Feature       | File Path                                                                                              | Lines   |
| ------------- | ------------------------------------------------------------------------------------------------------ | ------- |
| Tool type definitions   | [`packages/ui/components/ImageAnnotator/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/types.ts#L1-L40) | 1-40    |
| Render functions       | [`packages/ui/components/ImageAnnotator/utils.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/utils.ts#L1-L148) | 1-148   |
| Main component         | [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx#L1-L233) | 1-233   |
| Toolbar component     | [`packages/ui/components/ImageAnnotator/Toolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/Toolbar.tsx#L1-L219) | 1-219   |
| Annotation interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33)                 | 11-33   |

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

**renderPenStroke()** (render pen strokes):
- Uses the perfect-freehand library for smooth freehand effects
- Supports pressure sensitivity (pressure field)

**renderArrow()** (render arrows):
- Draws a straight line from start point to end point
- Draws an arrowhead at the end point

**renderCircle()** (render circles):
- Calculates the midpoint between two points as the circle's center
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

**Keyboard shortcut handling** (index.tsx:33-59):
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
