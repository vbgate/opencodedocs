---
title: "数据模型: 核心类型完整定义 | Plannotator"
subtitle: "数据模型: 核心类型完整定义 | Plannotator"
sidebarTitle: "掌握核心数据模型"
description: "了解 Plannotator 的数据模型，掌握 Annotation、Block、CodeAnnotation 等核心类型的完整定义和字段说明，深入理解系统架构。"
tags:
  - "数据模型"
  - "类型定义"
  - "API 参考"
prerequisite: []
order: 2
---

# Plannotator 数据模型

本附录介绍 Plannotator 使用的所有数据模型，包括计划评审、代码评审、URL 分享等核心数据结构。

## 核心数据模型概览

Plannotator 使用 TypeScript 定义了以下核心数据模型：

| 模型 | 用途 | 定义位置 |
| --- | --- | --- |
| `Annotation` | 计划评审中的注释 | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Markdown 解析后的内容块 | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | 代码评审中的注释 | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | URL 分享的精简注释格式 | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation（计划注释）

`Annotation` 表示计划评审中的注释，用于标记计划的删除、插入、替换或评论。

### 完整定义

```typescript
export interface Annotation {
  id: string;              // 唯一标识
  blockId: string;         // 关联的 Block ID（已废弃，保留兼容性）
  startOffset: number;     // 起始偏移量（已废弃，保留兼容性）
  endOffset: number;       // 结束偏移量（已废弃，保留兼容性）
  type: AnnotationType;     // 注释类型
  text?: string;           // 评论内容（用于 INSERTION/REPLACEMENT/COMMENT）
  originalText: string;    // 被注释的原始文本
  createdA: number;        // 创建时间戳
  author?: string;         // 协作者身份（用于 URL 分享）
  imagePaths?: string[];    // 附加图片路径
  startMeta?: {            // web-highlighter 跨元素选择元数据
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // web-highlighter 跨元素选择元数据
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### AnnotationType 枚举

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // 删除此内容
  INSERTION = 'INSERTION',         // 插入此内容
  REPLACEMENT = 'REPLACEMENT',     // 替换此内容
  COMMENT = 'COMMENT',             // 评论此内容
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // 全局评论（不关联具体文本）
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 唯一标识符，通常为自动生成的 UUID |
| `blockId` | string | ✅ | 关联的 `Block` ID（已废弃，保留兼容性） |
| `startOffset` | number | ✅ | 起始字符偏移量（已废弃，保留兼容性） |
| `endOffset` | number | ✅ | 结束字符偏移量（已废弃，保留兼容性） |
| `type` | AnnotationType | ✅ | 注释类型（DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT） |
| `text` | string | ❌ | 评论内容（INSERTION/REPLACEMENT/COMMENT 时填写） |
| `originalText` | string | ✅ | 被注释的原始文本 |
| `createdA` | number | ✅ | 创建时间戳（毫秒） |
| `author` | string | ❌ | 协作者身份标识（用于 URL 分享时区分作者） |
| `imagePaths` | string[] | ❌ | 附加图片路径数组 |
| `startMeta` | object | ❌ | web-highlighter 跨元素选择的起始元数据 |
| `endMeta` | object | ❌ | web-highlighter 跨元素选择的结束元数据 |

### 示例

#### 删除注释

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "这一部分不需要",
  createdA: Date.now(),
}
```

#### 替换注释

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "新的内容",
  originalText: "原来的内容",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### 全局评论

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "整体来说计划很清晰",
  originalText: "",
  createdA: Date.now(),
}
```

::: info 废弃字段说明
`blockId`、`startOffset`、`endOffset` 字段在旧版本中用于基于字符偏移的文本高亮。当前版本使用 [web-highlighter](https://github.com/alvarotrigo/web-highlighter) 库，通过 `startMeta` 和 `endMeta` 实现跨元素选择，这些字段保留仅用于兼容性。
:::

## Block（计划块）

`Block` 表示 Markdown 文本解析后的内容块，用于结构化显示计划内容。

### 完整定义

```typescript
export interface Block {
  id: string;              // 唯一标识
  type: BlockType;         // 块类型
  content: string;        // 纯文本内容
  level?: number;         // 层级（用于标题或列表）
  language?: string;      // 代码语言（用于代码块）
  checked?: boolean;      // 复选框状态（用于列表项）
  order: number;          // 排序顺序
  startLine: number;      // 起始行号（1-based）
}
```

### BlockType 类型

```typescript
type BlockType =
  | 'paragraph'     // 段落
  | 'heading'       // 标题
  | 'blockquote'    // 引用块
  | 'list-item'     // 列表项
  | 'code'          // 代码块
  | 'hr'            // 分割线
  | 'table';        // 表格
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 唯一标识符，格式为 `block-{数字}` |
| `type` | BlockType | ✅ | 块类型（paragraph/heading/blockquote/list-item/code/hr/table） |
| `content` | string | ✅ | 块的纯文本内容 |
| `level` | number | ❌ | 层级：标题为 1-6，列表项为缩进层级 |
| `language` | string | ❌ | 代码块的语言（如 'typescript'、'rust'） |
| `checked` | boolean | ❌ | 列表项的复选框状态（true = 已勾选，false = 未勾选） |
| `order` | number | ✅ | 排序序号，用于保持块的顺序 |
| `startLine` | number | ✅ | 在源 Markdown 中的起始行号（从 1 开始） |

### 示例

#### 标题块

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

#### 段落块

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### 代码块

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

#### 列表项（带复选框）

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "完成认证模块",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Markdown 解析
Plannotator 使用自定义的简化 Markdown 解析器（`parseMarkdownToBlocks`），将源 Markdown 转换为 `Block[]` 数组。解析器支持标题、列表、代码块、表格、引用块等常见语法。
:::

## CodeAnnotation（代码注释）

`CodeAnnotation` 表示代码评审中的行级注释，用于对 Git diff 的特定行或范围添加反馈。

### 完整定义

```typescript
export interface CodeAnnotation {
  id: string;              // 唯一标识
  type: CodeAnnotationType;  // 注释类型
  filePath: string;         // 文件路径
  lineStart: number;        // 起始行号
  lineEnd: number;          // 结束行号
  side: 'old' | 'new';     // 侧（'old' = 删除行，'new' = 新增行）
  text?: string;           // 评论内容
  suggestedCode?: string;    // 建议的代码（用于 suggestion 类型）
  createdAt: number;        // 创建时间戳
  author?: string;         // 协作者身份
}
```

### CodeAnnotationType 类型

```typescript
export type CodeAnnotationType =
  | 'comment'      // 普通评论
  | 'suggestion'  // 修改建议（需提供 suggestedCode）
  | 'concern';     // 关注点（重要事项提醒）
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 唯一标识符 |
| `type` | CodeAnnotationType | ✅ | 注释类型（comment/suggestion/concern） |
| `filePath` | string | ✅ | 被注释文件的相对路径（如 `src/auth.ts`） |
| `lineStart` | number | ✅ | 起始行号（从 1 开始） |
| `lineEnd` | number | ✅ | 结束行号（从 1 开始） |
| `side` | 'old' \| 'new' | ✅ | 侧：`'old'` = 删除行（旧版本），`'new'` = 新增行（新版本） |
| `text` | string | ❌ | 评论内容 |
| `suggestedCode` | string | ❌ | 建议的代码（当 type 为 'suggestion' 时必填） |
| `createdAt` | number | ✅ | 创建时间戳（毫秒） |
| `author` | string | ❌ | 协作者身份标识 |

### side 字段说明

`side` 字段对应 [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs) 库的 diff 视图：

| side 值 | @pierre/diffs 对应 | 说明 |
| --- | --- | --- |
| `'old'` | `deletions` | 删除的行（旧版本中的内容） |
| `'new'` | `additions` | 新增的行（新版本中的内容） |

### 示例

#### 普通评论（新增行）

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "这里需要处理错误情况",
  createdAt: Date.now(),
}
```

#### 修改建议（删除行）

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "建议改用 async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation（分享注释）

`ShareableAnnotation` 是用于 URL 分享的精简注释格式，通过数组元组表示，减少 payload 大小。

### 完整定义

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### 类型说明

| 类型 | 首字符 | 元组结构 | 说明 |
| --- | --- | --- | --- |
| DELETION | `'D'` | `['D', original, author?, images?]` | 删除内容 |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | 替换内容 |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | 评论内容 |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | 插入内容 |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | 全局评论 |

### 示例

```typescript
// 删除
['D', '要删除的内容', null, []]

// 替换
['R', '原文', '替换为', null, ['/tmp/img.png']]

// 评论
['C', '这段代码', '建议优化', null, []]

// 插入
['I', '上下文', '要插入的新内容', null, []]

// 全局评论
['G', '整体很好', null, []]
```

::: tip 为什么要用精简格式？
使用数组元组而非对象可以减少 payload 大小，压缩后 URL 更短。例如：
- 对象格式：`{"type":"DELETION","originalText":"text"}` → 38 字节
- 精简格式：`["D","text",null,[]]` → 18 字节
:::

## SharePayload（分享载荷）

`SharePayload` 是 URL 分享的完整数据结构，包含计划内容和注释。

### 完整定义

```typescript
export interface SharePayload {
  p: string;                  // 计划的 Markdown 文本
  a: ShareableAnnotation[];    // 注释数组（精简格式）
  g?: string[];              // 全局附件路径（图片）
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `p` | string | ✅ | 原始计划的 Markdown 内容 |
| `a` | ShareableAnnotation[] | ✅ | 注释数组（使用 `ShareableAnnotation` 精简格式） |
| `g` | string[] | ❌ | 全局附件路径（不关联具体注释的图片） |

### 示例

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', '需要支持 OAuth', null, []],
    ['G', '整体计划清晰', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter（前置元数据）

`Frontmatter` 表示 Markdown 文件顶部的 YAML 元数据，用于存储附加信息。

### 完整定义

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### 示例

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan（示例）
...
```

解析后：

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip 前置元数据用途
Plannotator 在保存计划到 Obsidian 时会自动生成 frontmatter，包含创建时间、来源标签等信息，便于笔记管理和检索。
:::

## 相关辅助类型

### EditorMode（编辑器模式）

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`：文本选择模式
- `'comment'`：评论模式
- `'redline'`：红线批注模式

### DiffResult（Diff 结果）

```typescript
export interface DiffResult {
  original: string;    // 原始内容
  modified: string;    // 修改后内容
  diffText: string;    // Unified diff 文本
}
```

### DiffAnnotationMetadata（Diff 注释元数据）

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // 关联的注释 ID
  type: CodeAnnotationType;  // 注释类型
  text?: string;            // 评论内容
  suggestedCode?: string;   // 建议代码
  author?: string;          // 作者
}
```

### SelectedLineRange（选中的行范围）

```typescript
export interface SelectedLineRange {
  start: number;                      // 起始行号
  end: number;                        // 结束行号
  side: 'deletions' | 'additions';   // 侧（对应 @pierre/diffs 的 diff 视图）
  endSide?: 'deletions' | 'additions'; // 结束侧（用于跨侧选择）
}
```

## 数据转换关系

### Annotation ↔ ShareableAnnotation

```typescript
// 完整 → 精简
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// 精简 → 完整
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info 坐标丢失
`fromShareable` 生成的 `Annotation` 中的 `blockId`、`startOffset`、`endOffset` 字段为空或 0，需要通过文本匹配或 web-highlighter 恢复精确位置。
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## 本课小结

本附录介绍了 Plannotator 的所有核心数据模型：

- **Annotation**：计划评审中的注释，支持删除、插入、替换、评论等类型
- **Block**：Markdown 解析后的内容块，用于结构化显示计划
- **CodeAnnotation**：代码评审中的行级注释，支持评论和建议
- **ShareableAnnotation**：用于 URL 分享的精简格式，减少 payload 大小
- **SharePayload**：URL 分享的完整数据结构

这些数据模型在计划评审、代码评审、URL 分享等功能中广泛应用。理解它们有助于深入定制和扩展 Plannotator。

## 下一课预告

> 下一课我们学习 **[Plannotator 许可证说明](../license/)**。
>
> 你会看到：
> - Business Source License 1.1 (BSL) 的核心条款
> - 允许的使用方式和商业限制
> - 2030 年将转换为 Apache 2.0 的时间表
> - 如何获取商业许可

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| Annotation 接口 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| AnnotationType 枚举 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Block 接口 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| CodeAnnotation 接口 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| CodeAnnotationType 类型 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| ShareableAnnotation 类型 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| SharePayload 接口 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**关键常量**：
- 无

**关键函数**：
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`：将完整注释转换为精简格式
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`：将精简格式恢复为完整注释
- `parseMarkdownToBlocks(markdown: string): Block[]`：解析 Markdown 为 Block 数组
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`：将注释导出为 Markdown 格式

</details>
