---
title: "資料模型: 核心型別完整定義 | Plannotator"
subtitle: "資料模型: 核心型別完整定義 | Plannotator"
sidebarTitle: "掌握核心資料模型"
description: "瞭解 Plannotator 的資料模型，掌握 Annotation、Block、CodeAnnotation 等核心型別的完整定義和欄位說明，深入理解系統架構。"
tags:
  - "資料模型"
  - "型別定義"
  - "API 參考"
prerequisite: []
order: 2
---

# Plannotator 資料模型

本附錄介紹 Plannotator 使用的所有資料模型，包括計畫審查、程式碼審查、URL 分享等核心資料結構。

## 核心資料模型概覽

Plannotator 使用 TypeScript 定義了以下核心資料模型：

| 模型 | 用途 | 定義位置 |
| --- | --- | --- |
| `Annotation` | 計畫審查中的註解 | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Markdown 解析後的內容區塊 | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | 程式碼審查中的註解 | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | URL 分享的精簡註解格式 | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation（計畫註解）

`Annotation` 表示計畫審查中的註解，用於標記計畫的刪除、插入、替換或評論。

### 完整定義

```typescript
export interface Annotation {
  id: string;              // 唯一識別碼
  blockId: string;         // 關聯的 Block ID（已棄用，保留相容性）
  startOffset: number;     // 起始偏移量（已棄用，保留相容性）
  endOffset: number;       // 結束偏移量（已棄用，保留相容性）
  type: AnnotationType;     // 註解類型
  text?: string;           // 評論內容（用於 INSERTION/REPLACEMENT/COMMENT）
  originalText: string;    // 被註解的原始文字
  createdA: number;        // 建立時間戳記
  author?: string;         // 協作者身分（用於 URL 分享）
  imagePaths?: string[];    // 附加圖片路徑
  startMeta?: {            // web-highlighter 跨元素選取中繼資料
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // web-highlighter 跨元素選取中繼資料
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### AnnotationType 列舉

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // 刪除此內容
  INSERTION = 'INSERTION',         // 插入此內容
  REPLACEMENT = 'REPLACEMENT',     // 替換此內容
  COMMENT = 'COMMENT',             // 評論此內容
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // 全域評論（不關聯具體文字）
}
```

### 欄位說明

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 唯一識別碼，通常為自動產生的 UUID |
| `blockId` | string | ✅ | 關聯的 `Block` ID（已棄用，保留相容性） |
| `startOffset` | number | ✅ | 起始字元偏移量（已棄用，保留相容性） |
| `endOffset` | number | ✅ | 結束字元偏移量（已棄用，保留相容性） |
| `type` | AnnotationType | ✅ | 註解類型（DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT） |
| `text` | string | ❌ | 評論內容（INSERTION/REPLACEMENT/COMMENT 時填寫） |
| `originalText` | string | ✅ | 被註解的原始文字 |
| `createdA` | number | ✅ | 建立時間戳記（毫秒） |
| `author` | string | ❌ | 協作者身分識別（用於 URL 分享時區分作者） |
| `imagePaths` | string[] | ❌ | 附加圖片路徑陣列 |
| `startMeta` | object | ❌ | web-highlighter 跨元素選取的起始中繼資料 |
| `endMeta` | object | ❌ | web-highlighter 跨元素選取的結束中繼資料 |

### 範例

#### 刪除註解

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "這一部分不需要",
  createdA: Date.now(),
}
```

#### 替換註解

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "新的內容",
  originalText: "原來的內容",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### 全域評論

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "整體來說計畫很清晰",
  originalText: "",
  createdA: Date.now(),
}
```

::: info 棄用欄位說明
`blockId`、`startOffset`、`endOffset` 欄位在舊版本中用於基於字元偏移的文字醒目提示。目前版本使用 [web-highlighter](https://github.com/alvarotrigo/web-highlighter) 函式庫，透過 `startMeta` 和 `endMeta` 實現跨元素選取，這些欄位保留僅用於相容性。
:::

## Block（計畫區塊）

`Block` 表示 Markdown 文字解析後的內容區塊，用於結構化顯示計畫內容。

### 完整定義

```typescript
export interface Block {
  id: string;              // 唯一識別碼
  type: BlockType;         // 區塊類型
  content: string;        // 純文字內容
  level?: number;         // 層級（用於標題或清單）
  language?: string;      // 程式語言（用於程式碼區塊）
  checked?: boolean;      // 核取方塊狀態（用於清單項目）
  order: number;          // 排序順序
  startLine: number;      // 起始行號（1-based）
}
```

### BlockType 型別

```typescript
type BlockType =
  | 'paragraph'     // 段落
  | 'heading'       // 標題
  | 'blockquote'    // 引用區塊
  | 'list-item'     // 清單項目
  | 'code'          // 程式碼區塊
  | 'hr'            // 分隔線
  | 'table';        // 表格
```

### 欄位說明

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 唯一識別碼，格式為 `block-{數字}` |
| `type` | BlockType | ✅ | 區塊類型（paragraph/heading/blockquote/list-item/code/hr/table） |
| `content` | string | ✅ | 區塊的純文字內容 |
| `level` | number | ❌ | 層級：標題為 1-6，清單項目為縮排層級 |
| `language` | string | ❌ | 程式碼區塊的語言（如 'typescript'、'rust'） |
| `checked` | boolean | ❌ | 清單項目的核取方塊狀態（true = 已勾選，false = 未勾選） |
| `order` | number | ✅ | 排序序號，用於保持區塊的順序 |
| `startLine` | number | ✅ | 在原始 Markdown 中的起始行號（從 1 開始） |

### 範例

#### 標題區塊

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

#### 段落區塊

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### 程式碼區塊

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

#### 清單項目（帶核取方塊）

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "完成認證模組",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Markdown 解析
Plannotator 使用自訂的簡化 Markdown 解析器（`parseMarkdownToBlocks`），將原始 Markdown 轉換為 `Block[]` 陣列。解析器支援標題、清單、程式碼區塊、表格、引用區塊等常見語法。
:::

## CodeAnnotation（程式碼註解）

`CodeAnnotation` 表示程式碼審查中的行級註解，用於對 Git diff 的特定行或範圍新增回饋。

### 完整定義

```typescript
export interface CodeAnnotation {
  id: string;              // 唯一識別碼
  type: CodeAnnotationType;  // 註解類型
  filePath: string;         // 檔案路徑
  lineStart: number;        // 起始行號
  lineEnd: number;          // 結束行號
  side: 'old' | 'new';     // 側（'old' = 刪除行，'new' = 新增行）
  text?: string;           // 評論內容
  suggestedCode?: string;    // 建議的程式碼（用於 suggestion 類型）
  createdAt: number;        // 建立時間戳記
  author?: string;         // 協作者身分
}
```

### CodeAnnotationType 型別

```typescript
export type CodeAnnotationType =
  | 'comment'      // 一般評論
  | 'suggestion'  // 修改建議（需提供 suggestedCode）
  | 'concern';     // 關注點（重要事項提醒）
```

### 欄位說明

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `id` | string | ✅ | 唯一識別碼 |
| `type` | CodeAnnotationType | ✅ | 註解類型（comment/suggestion/concern） |
| `filePath` | string | ✅ | 被註解檔案的相對路徑（如 `src/auth.ts`） |
| `lineStart` | number | ✅ | 起始行號（從 1 開始） |
| `lineEnd` | number | ✅ | 結束行號（從 1 開始） |
| `side` | 'old' \| 'new' | ✅ | 側：`'old'` = 刪除行（舊版本），`'new'` = 新增行（新版本） |
| `text` | string | ❌ | 評論內容 |
| `suggestedCode` | string | ❌ | 建議的程式碼（當 type 為 'suggestion' 時必填） |
| `createdAt` | number | ✅ | 建立時間戳記（毫秒） |
| `author` | string | ❌ | 協作者身分識別 |

### side 欄位說明

`side` 欄位對應 [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs) 函式庫的 diff 檢視：

| side 值 | @pierre/diffs 對應 | 說明 |
| --- | --- | --- |
| `'old'` | `deletions` | 刪除的行（舊版本中的內容） |
| `'new'` | `additions` | 新增的行（新版本中的內容） |

### 範例

#### 一般評論（新增行）

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "這裡需要處理錯誤情況",
  createdAt: Date.now(),
}
```

#### 修改建議（刪除行）

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "建議改用 async/await",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation（分享註解）

`ShareableAnnotation` 是用於 URL 分享的精簡註解格式，透過陣列元組表示，減少 payload 大小。

### ��整定義

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### 型別說明

| 型別 | 首字元 | 元組結構 | 說明 |
| --- | --- | --- | --- |
| DELETION | `'D'` | `['D', original, author?, images?]` | 刪除內容 |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | 替換內容 |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | 評論內容 |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | 插入內容 |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | 全域評論 |

### 範例

```typescript
// 刪除
['D', '要刪除的內容', null, []]

// 替換
['R', '原文', '替換為', null, ['/tmp/img.png']]

// 評論
['C', '這段程式碼', '建議最佳化', null, []]

// 插入
['I', '上下文', '要插入的新內容', null, []]

// 全域評論
['G', '整體很好', null, []]
```

::: tip 為什麼要用精簡格式？
使用陣列元組而非物件可以減少 payload 大小，壓縮後 URL 更短。例如：
- 物件格式：`{"type":"DELETION","originalText":"text"}` → 38 位元組
- 精簡格式：`["D","text",null,[]]` → 18 位元組
:::

## SharePayload（分享酬載）

`SharePayload` 是 URL 分享的完整資料結構，包含計畫內容和註解。

### 完整定義

```typescript
export interface SharePayload {
  p: string;                  // 計畫的 Markdown 文字
  a: ShareableAnnotation[];    // 註解陣列（精簡格式）
  g?: string[];              // 全域附件路徑（圖片）
}
```

### 欄位說明

| 欄位 | 型別 | 必填 | 說明 |
| --- | --- | --- | --- |
| `p` | string | ✅ | 原始計畫的 Markdown 內容 |
| `a` | ShareableAnnotation[] | ✅ | 註解陣列（使用 `ShareableAnnotation` 精簡格式） |
| `g` | string[] | ❌ | 全域附件路徑（不關聯具體註解的圖片） |

### 範例

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', '需要支援 OAuth', null, []],
    ['G', '整體計畫清晰', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter（前置中繼資料）

`Frontmatter` 表示 Markdown 檔案頂部的 YAML 中繼資料，用於儲存附加資訊。

### 完整定義

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### 範例

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan（範例）
...
```

解析後：

```typescript
{
  created: "2026-01-24T14:30:00.000Z",
  source: "plannotator",
  tags: ["authentication", "typescript"],
  author: "John Doe",
}
```

::: tip 前置中繼資料用途
Plannotator 在儲存計畫到 Obsidian 時會自動產生 frontmatter，包含建立時間、來源標籤等資訊，便於筆記管理和檢索。
:::

## 相關輔助型別

### EditorMode（編輯器模式）

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`：文字選取模式
- `'comment'`：評論模式
- `'redline'`：紅線批註模式

### DiffResult（Diff 結果）

```typescript
export interface DiffResult {
  original: string;    // 原始內容
  modified: string;    // 修改後內容
  diffText: string;    // Unified diff 文字
}
```

### DiffAnnotationMetadata（Diff 註解中繼資料）

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // 關聯的註解 ID
  type: CodeAnnotationType;  // 註解類型
  text?: string;            // 評論內容
  suggestedCode?: string;   // 建議程式碼
  author?: string;          // 作者
}
```

### SelectedLineRange（選取的行範圍）

```typescript
export interface SelectedLineRange {
  start: number;                      // 起始行號
  end: number;                        // 結束行號
  side: 'deletions' | 'additions';   // 側（對應 @pierre/diffs 的 diff 檢視）
  endSide?: 'deletions' | 'additions'; // 結束側（用於跨側選取）
}
```

## 資料轉換關係

### Annotation ↔ ShareableAnnotation

```typescript
// 完整 → 精簡
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// 精簡 → 完整
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info 座標遺失
`fromShareable` 產生的 `Annotation` 中的 `blockId`、`startOffset`、`endOffset` 欄位為空或 0，需要透過文字比對或 web-highlighter 恢復精確位置。
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## 本課小結

本附錄介紹了 Plannotator 的所有核心資料模型：

- **Annotation**：計畫審查中的註解，支援刪除、插入、替換、評論等類型
- **Block**：Markdown 解析後的內容區塊，用於結構化顯示計畫
- **CodeAnnotation**：程式碼審查中的行級註解，支援評論和建議
- **ShareableAnnotation**：用於 URL 分享的精簡格式，減少 payload 大小
- **SharePayload**：URL 分享的完整資料結構

這些資料模型在計畫審查、程式碼審查、URL 分享等功能中廣泛應用。理解它們有助於深入客製化和擴充 Plannotator。

## 下一課預告

> 下一課我們學習 **[Plannotator 授權條款說明](../license/)**。
>
> 你會看到：
> - Business Source License 1.1 (BSL) 的核心條款
> - 允許的使用方式和商業限制
> - 2030 年將轉換為 Apache 2.0 的時間表
> - 如何取得商業授權

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Annotation 介面 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| AnnotationType 列舉 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Block 介面 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| CodeAnnotation 介面 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| CodeAnnotationType 型別 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| ShareableAnnotation 型別 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| SharePayload 介面 | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**關鍵常數**：
- 無

**關鍵函式**：
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`：將完整註解轉換為精簡格式
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`：將精簡格式還原為完整註解
- `parseMarkdownToBlocks(markdown: string): Block[]`：解析 Markdown 為 Block 陣列
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`：將註解匯出為 Markdown 格式

</details>
