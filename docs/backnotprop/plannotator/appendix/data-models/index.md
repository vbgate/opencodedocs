---
title: "Data Models | Plannotator"
sidebarTitle: "Data Models"
subtitle: "Plannotator Data Models"
description: "Learn Plannotator data models including Annotation, Block, and CodeAnnotation types with field descriptions."
tags:
  - "Data Models"
  - "Type Definitions"
  - "API Reference"
prerequisite: []
order: 2
---

# Plannotator Data Models

This appendix introduces all data models used in Plannotator, including core data structures for plan reviews, code reviews, and URL sharing.

## Core Data Model Overview

Plannotator uses TypeScript to define the following core data models:

| Model | Purpose | Definition Location |
|--- | --- | ---|
| `Annotation` | Annotations in plan reviews | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Content blocks after Markdown parsing | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | Annotations in code reviews | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | Simplified annotation format for URL sharing | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation (Plan Annotation)

`Annotation` represents an annotation in a plan review, used to mark plan deletions, insertions, replacements, or comments.

### Complete Definition

```typescript
export interface Annotation {
  id: string;              // Unique identifier
  blockId: string;         // Associated Block ID (deprecated, retained for compatibility)
  startOffset: number;     // Starting offset (deprecated, retained for compatibility)
  endOffset: number;       // Ending offset (deprecated, retained for compatibility)
  type: AnnotationType;     // Annotation type
  text?: string;           // Comment content (used for INSERTION/REPLACEMENT/COMMENT)
  originalText: string;    // Original text being annotated
  createdA: number;        // Creation timestamp
  author?: string;         // Collaborator identity (used for URL sharing)
  imagePaths?: string[];    // Attached image paths
  startMeta?: {            // web-highlighter cross-element selection metadata
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // web-highlighter cross-element selection metadata
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### AnnotationType Enum

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // Delete this content
  INSERTION = 'INSERTION',         // Insert this content
  REPLACEMENT = 'REPLACEMENT',     // Replace this content
  COMMENT = 'COMMENT',             // Comment on this content
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // Global comment (not associated with specific text)
}
```

### Field Descriptions

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `id` | string | ✅ | Unique identifier, typically an auto-generated UUID |
| `blockId` | string | ✅ | Associated `Block` ID (deprecated, retained for compatibility) |
| `startOffset` | number | ✅ | Starting character offset (deprecated, retained for compatibility) |
| `endOffset` | number | ✅ | Ending character offset (deprecated, retained for compatibility) |
| `type` | AnnotationType | ✅ | Annotation type (DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT) |
| `text` | string | ❌ | Comment content (fill in when type is INSERTION/REPLACEMENT/COMMENT) |
| `originalText` | string | ✅ | Original text being annotated |
| `createdA` | number | ✅ | Creation timestamp (milliseconds) |
| `author` | string | ❌ | Collaborator identity identifier (used to distinguish authors during URL sharing) |
| `imagePaths` | string[] | ❌ | Array of attached image paths |
| `startMeta` | object | ❌ | Start metadata for web-highlighter cross-element selection |
| `endMeta` | object | ❌ | End metadata for web-highlighter cross-element selection |

### Examples

#### Deletion Annotation

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "This part is not needed",
  createdA: Date.now(),
}
```

#### Replacement Annotation

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "New content",
  originalText: "Original content",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### Global Comment

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "Overall, the plan is clear",
  originalText: "",
  createdA: Date.now(),
}
```

::: info Deprecated Field Explanation
The `blockId`, `startOffset`, and `endOffset` fields were used in older versions for character offset-based text highlighting. The current version uses the [web-highlighter](https://github.com/alvarotrigo/web-highlighter) library, implementing cross-element selection through `startMeta` and `endMeta`. These fields are retained only for compatibility.
:::

## Block (Plan Block)

`Block` represents a content block after Markdown text parsing, used for structured display of plan content.

### Complete Definition

```typescript
export interface Block {
  id: string;              // Unique identifier
  type: BlockType;         // Block type
  content: string;        // Plain text content
  level?: number;         // Level (for headings or lists)
  language?: string;      // Code language (for code blocks)
  checked?: boolean;      // Checkbox state (for list items)
  order: number;          // Sort order
  startLine: number;      // Starting line number (1-based)
}
```

### BlockType Type

```typescript
type BlockType =
  | 'paragraph'     // Paragraph
  | 'heading'       // Heading
  | 'blockquote'    // Blockquote
|---|
  | 'code'          // Code block
  | 'hr'            // Horizontal rule
  | 'table';        // Table
```

### Field Descriptions

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `id` | string | ✅ | Unique identifier, format is `block-{number}` |
| `type` | BlockType | ✅ | Block type (paragraph/heading/blockquote/list-item/code/hr/table) |
| `content` | string | ✅ | Plain text content of the block |
| `level` | number | ❌ | Level: 1-6 for headings, indentation level for list items |
| `language` | string | ❌ | Code block language (e.g., 'typescript', 'rust') |
| `checked` | boolean | ❌ | Checkbox state for list items (true = checked, false = unchecked) |
| `order` | number | ✅ | Sort ordinal, used to maintain block order |
| `startLine` | number | ✅ | Starting line number in source Markdown (starts from 1) |

### Examples

#### Heading Block

```typescript
{
  id: "block-0",
  type: "heading",
  content: "Implementation Plan",
  level: 1,
  order: 1,
  startLine: 1,
}
```

#### Paragraph Block

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### Code Block

```typescript
{
  id: "block-2",
  type: "code",
  content: "function hello() {\n  return 'world';\n}",
  language: "typescript",
  order: 3,
  startLine: 5,
}
```

#### List Item (with Checkbox)

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "Complete authentication module",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Markdown Parsing
Plannotator uses a custom simplified Markdown parser (`parseMarkdownToBlocks`) to convert source Markdown into a `Block[]` array. The parser supports common syntax like headings, lists, code blocks, tables, and blockquotes.
:::

## CodeAnnotation (Code Annotation)

`CodeAnnotation` represents a line-level annotation in code reviews, used to add feedback on specific lines or ranges of Git diffs.

### Complete Definition

```typescript
export interface CodeAnnotation {
  id: string;              // Unique identifier
  type: CodeAnnotationType;  // Annotation type
  filePath: string;         // File path
  lineStart: number;        // Starting line number
  lineEnd: number;          // Ending line number
  side: 'old' | 'new';     // Side ('old' = deleted lines, 'new' = added lines)
  text?: string;           // Comment content
  suggestedCode?: string;    // Suggested code (for suggestion type)
  createdAt: number;        // Creation timestamp
  author?: string;         // Collaborator identity
}
```

### CodeAnnotationType Type

```typescript
export type CodeAnnotationType =
  | 'comment'      // Regular comment
  | 'suggestion'  // Suggestion (requires suggestedCode)
  | 'concern';     // Concern (important reminder)
```

### Field Descriptions

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `id` | string | ✅ | Unique identifier |
| `type` | CodeAnnotationType | ✅ | Annotation type (comment/suggestion/concern) |
| `filePath` | string | ✅ | Relative path of the file being annotated (e.g., `src/auth.ts`) |
| `lineStart` | number | ✅ | Starting line number (starts from 1) |
| `lineEnd` | number | ✅ | Ending line number (starts from 1) |
| `side` | 'old' \| 'new' | ✅ | Side: `'old'` = deleted lines (old version), `'new'` = added lines (new version) |
| `text` | string | ❌ | Comment content |
| `suggestedCode` | string | ❌ | Suggested code (required when type is 'suggestion') |
| `createdAt` | number | ✅ | Creation timestamp (milliseconds) |
| `author` | string | ❌ | Collaborator identity identifier |

### side Field Explanation

The `side` field corresponds to the diff view of the [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs) library:

| side value | @pierre/diffs counterpart | Description |
|--- | --- | ---|
| `'old'` | `deletions` | Deleted lines (content in the old version) |
| `'new'` | `additions` | Added lines (content in the new version) |

### Examples

#### Regular Comment (Added Lines)

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "Error cases need to be handled here",
  createdAt: Date.now(),
}
```

#### Suggestion (Deleted Lines)

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "Suggest using async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation (Shareable Annotation)

`ShareableAnnotation` is a simplified annotation format for URL sharing, represented as array tuples to reduce payload size.

### Complete Definition

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### Type Explanations

| Type | First Character | Tuple Structure | Description |
|--- | --- | --- | ---|
| DELETION | `'D'` | `['D', original, author?, images?]` | Delete content |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | Replace content |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | Comment on content |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | Insert content |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | Global comment |

### Examples

```typescript
// Deletion
['D', 'Content to delete', null, []]

// Replacement
['R', 'Original text', 'Replace with', null, ['/tmp/img.png']]

// Comment
['C', 'This code', 'Suggest optimization', null, []]

// Insertion
['I', 'Context', 'New content to insert', null, []]

// Global comment
['G', 'Overall good', null, []]
```

::: tip Why Use Simplified Format?
Using array tuples instead of objects reduces payload size, resulting in shorter compressed URLs. For example:
- Object format: `{"type":"DELETION","originalText":"text"}` → 38 bytes
- Simplified format: `["D","text",null,[]]` → 18 bytes
:::

## SharePayload (Share Payload)

`SharePayload` is the complete data structure for URL sharing, containing plan content and annotations.

### Complete Definition

```typescript
export interface SharePayload {
  p: string;                  // Plan's Markdown text
  a: ShareableAnnotation[];    // Annotation array (simplified format)
  g?: string[];              // Global attachment paths (images)
}
```

### Field Descriptions

| Field | Type | Required | Description |
|--- | --- | --- | ---|
| `p` | string | ✅ | Original plan's Markdown content |
| `a` | ShareableAnnotation[] | ✅ | Annotation array (using `ShareableAnnotation` simplified format) |
| `g` | string[] | ❌ | Global attachment paths (images not associated with specific annotations) |

### Example

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', 'Need to support OAuth', null, []],
    ['G', 'Overall plan is clear', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter

`Frontmatter` represents YAML metadata at the top of Markdown files, used for storing additional information.

### Complete Definition

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### Example

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan (example)
...
```

After parsing:

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip Frontmatter Use
Plannotator automatically generates frontmatter when saving plans to Obsidian, including creation time, source tags, and other information for note management and retrieval.
:::

## Related Helper Types

### EditorMode (Editor Mode)

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`: Text selection mode
- `'comment'`: Comment mode
- `'redline'`: Redline annotation mode

### DiffResult (Diff Result)

```typescript
export interface DiffResult {
  original: string;    // Original content
  modified: string;    // Modified content
  diffText: string;    // Unified diff text
}
```

### DiffAnnotationMetadata (Diff Annotation Metadata)

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // Associated annotation ID
  type: CodeAnnotationType;  // Annotation type
  text?: string;            // Comment content
  suggestedCode?: string;   // Suggested code
  author?: string;          // Author
}
```

### SelectedLineRange (Selected Line Range)

```typescript
export interface SelectedLineRange {
  start: number;                      // Starting line number
  end: number;                        // Ending line number
  side: 'deletions' | 'additions';   // Side (corresponds to @pierre/diffs diff view)
  endSide?: 'deletions' | 'additions'; // Ending side (for cross-side selection)
}
```

## Data Transformation Relationships

### Annotation ↔ ShareableAnnotation

```typescript
// Complete → Simplified
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// Simplified → Complete
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info Coordinate Loss
The `blockId`, `startOffset`, and `endOffset` fields in `Annotation` generated by `fromShareable` are empty or 0. Precise positions need to be restored through text matching or web-highlighter.
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## Lesson Summary

This appendix introduced all core data models in Plannotator:

- **Annotation**: Annotations in plan reviews, supporting deletion, insertion, replacement, and comment types
- **Block**: Content blocks after Markdown parsing, used for structured display of plans
- **CodeAnnotation**: Line-level annotations in code reviews, supporting comments and suggestions
- **ShareableAnnotation**: Simplified format for URL sharing, reducing payload size
- **SharePayload**: Complete data structure for URL sharing

These data models are widely used in plan reviews, code reviews, and URL sharing features. Understanding them helps with deep customization and extension of Plannotator.

## Next Up

> In the next lesson, we'll learn **[Plannotator License](../license/)**.
>
> You'll see:
> - Core terms of Business Source License 1.1 (BSL)
> - Allowed usage methods and commercial restrictions
> - Timeline for conversion to Apache 2.0 in 2030
> - How to obtain a commercial license

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Number |
|--- | --- | ---|
| Annotation interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| AnnotationType enum | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Block interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| CodeAnnotation interface | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| CodeAnnotationType type | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| ShareableAnnotation type | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| SharePayload interface | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**Key Constants**:
- None

**Key Functions**:
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`: Convert complete annotations to simplified format
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`: Restore simplified format to complete annotations
- `parseMarkdownToBlocks(markdown: string): Block[]`: Parse Markdown into Block array
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`: Export annotations to Markdown format

</details>
