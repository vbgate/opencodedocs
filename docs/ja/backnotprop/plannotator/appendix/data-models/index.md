---
title: "データモデル：コアタイプ完全定義 | Plannotator"
subtitle: "データモデル：コアタイプ完全定義 | Plannotator"
sidebarTitle: "コアデータモデルをマスターする"
description: "Plannotator のデータモデルについて学び、Annotation、Block、CodeAnnotation などのコアタイプの完全定義とフィールド説明を理解して、システムアーキテクチャを深く把握しましょう。"
tags:
  - "データモデル"
  - "タイプ定義"
  - "API リファレンス"
prerequisite: []
order: 2
---

# Plannotator データモデル

本付録では、Plannotator で使用されるすべてのデータモデルを紹介します。これには、計画レビュー、コードレビュー、URL 共有などのコアデータ構造が含まれます。

## コアデータモデル概要

Plannotator は TypeScript を使用して以下のコアデータモデルを定義しています：

| モデル | 用途 | 定義場所 |
|--- | --- | ---|
| `Annotation` | 計画レビューでのコメント | [`packages/ui/types.ts:11-33`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) |
| `Block` | Markdown 解析後のコンテンツブロック | [`packages/ui/types.ts:35-44`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) |
| `CodeAnnotation` | コードレビューでのコメント | [`packages/ui/types.ts:55-66`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) |
| `ShareableAnnotation` | URL 共有のための簡素化コメント形式 | [`packages/ui/utils/sharing.ts:14-19`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) |

## Annotation（計画コメント）

`Annotation` は計画レビューでのコメントを表し、計画の削除、挿入、置換、またはコメントをマークするために使用されます。

### 完全定義

```typescript
export interface Annotation {
  id: string;              // 一意識別子
  blockId: string;         // 関連する Block ID（非推奨、互換性のために保持）
  startOffset: number;     // 開始オフセット（非推奨、互換性のために保持）
  endOffset: number;       // 終了オフセット（非推奨、互換性のために保持）
  type: AnnotationType;     // コメントタイプ
  text?: string;           // コメント内容（INSERTION/REPLACEMENT/COMMENT 用）
  originalText: string;    // コメントされた元テキスト
  createdA: number;        // 作成タイムスタンプ
  author?: string;         // 協力者身份（URL 共有用）
  imagePaths?: string[];    // 追加画像パス
  startMeta?: {            // web-highlighter 跨要素選択メタデータ
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
  endMeta?: {              // web-highlighter 跨要素選択メタデータ
    parentTagName: string;
    parentIndex: number;
    textOffset: number;
  };
}
```

### AnnotationType 列挙型

```typescript
export enum AnnotationType {
  DELETION = 'DELETION',           // このコンテンツを削除
  INSERTION = 'INSERTION',         // このコンテンツを挿入
  REPLACEMENT = 'REPLACEMENT',     // このコンテンツを置換
  COMMENT = 'COMMENT',             // このコンテンツにコメント
  GLOBAL_COMMENT = 'GLOBAL_COMMENT', // グローバルコメント（特定テキストに紐付けない）
}
```

### フィールド説明

| フィールド | タイプ | 必須 | 説明 |
|--- | --- | --- | ---|
| `id` | string | ✅ | 一意識別子、通常は自動生成された UUID |
| `blockId` | string | ✅ | 関連する `Block` ID（非推奨、互換性のために保持） |
| `startOffset` | number | ✅ | 開始文字オフセット（非推奨、互換性のために保持） |
| `endOffset` | number | ✅ | 終了文字オフセット（非推奨、互換性のために保持） |
| `type` | AnnotationType | ✅ | コメントタイプ（DELETION/INSERTION/REPLACEMENT/COMMENT/GLOBAL_COMMENT） |
| `text` | string | ❌ | コメント内容（INSERTION/REPLACEMENT/COMMENT 時に記入） |
| `originalText` | string | ✅ | コメントされた元テキスト |
| `createdA` | number | ✅ | 作成タイムスタンプ（ミリ秒） |
| `author` | string | ❌ | 協力者身份識別子（URL 共有時に作者を区別するため） |
| `imagePaths` | string[] | ❌ | 追加画像パス配列 |
| `startMeta` | object | ❌ | web-highlighter 跨要素選択の開始メタデータ |
| `endMeta` | object | ❌ | web-highlighter 跨要素選択の終了メタデータ |

### 例

#### 削除コメント

```typescript
{
  id: "anno-001",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.DELETION,
  originalText: "この部分は不要",
  createdA: Date.now(),
}
```

#### 置換コメント

```typescript
{
  id: "anno-002",
  blockId: "block-0",
  startOffset: 0,
  endOffset: 50,
  type: AnnotationType.REPLACEMENT,
  text: "新しいコンテンツ",
  originalText: "元のコンテンツ",
  createdA: Date.now(),
  imagePaths: ["/tmp/plannotator/screenshot-001.png"],
}
```

#### グローバルコメント

```typescript
{
  id: "anno-003",
  blockId: "",
  startOffset: 0,
  endOffset: 0,
  type: AnnotationType.GLOBAL_COMMENT,
  text: "全体として計画が明確です",
  originalText: "",
  createdA: Date.now(),
}
```

::: info 非推奨フィールドの説明
`blockId`、`startOffset`、`endOffset` フィールドは旧バージョンで文字オフセットに基づくテキストハイライトに使用されていました。現在のバージョンでは [web-highlighter](https://github.com/alvarotrigo/web-highlighter) ライブラリを使用し、`startMeta` と `endMeta` を通して跨要素選択を実現しており、これらのフィールドは互換性のためにのみ保持されています。
:::

## Block（計画ブロック）

`Block` は Markdown テキスト解析後のコンテンツブロックを表し、計画内容を構造的に表示するために使用されます。

### 完全定義

```typescript
export interface Block {
  id: string;              // 一意識別子
  type: BlockType;         // ブロックタイプ
  content: string;        // プレーンテキストコンテンツ
  level?: number;         // レベル（見出しやリスト用）
  language?: string;      // コード言語（コードブロック用）
  checked?: boolean;      // チェックボックス状態（リスト項目用）
  order: number;          // ソート順序
  startLine: number;      // 開始行番号（1-based）
}
```

### BlockType タイプ

```typescript
type BlockType =
  | 'paragraph'     // 段落
  | 'heading'       // 見出し
  | 'blockquote'    // 引用ブロック
|---|
  | 'code'          // コードブロック
  | 'hr'            // 区切り線
  | 'table';        // テーブル
```

### フィールド説明

| フィールド | タイプ | 必須 | 説明 |
|--- | --- | --- | ---|
| `id` | string | ✅ | 一意識別子、形式は `block-{数字}` |
| `type` | BlockType | ✅ | ブロックタイプ（paragraph/heading/blockquote/list-item/code/hr/table） |
| `content` | string | ✅ | ブロックのプレーンテキストコンテンツ |
| `level` | number | ❌ | レベル：見出しは 1-6、リスト項目はインデントレベル |
| `language` | string | ❌ | コードブロックの言語（'typescript'、'rust' など） |
| `checked` | boolean | ❌ | リスト項目のチェックボックス状態（true = チェック済み、false = 未チェック） |
| `order` | number | ✅ | ソート番号、ブロックの順序を維持するため |
| `startLine` | number | ✅ | ソース Markdown での開始行番号（1 から開始） |

### 例

#### 見出しブロック

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

#### 段落ブロック

```typescript
{
  id: "block-1",
  type: "paragraph",
  content: "This is a paragraph with some text.",
  order: 2,
  startLine: 3,
}
```

#### コードブロック

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

#### リスト項目（チェックボックス付き）

```typescript
{
  id: "block-3",
  type: "list-item",
  content: "認証モジュールを完成",
  level: 0,
  checked: true,
  order: 4,
  startLine: 10,
}
```

::: tip Markdown 解析
Plannotator はカスタムの簡素化 Markdown パーサー（`parseMarkdownToBlocks`）を使用して、ソース Markdown を `Block[]` 配列に変換します。パーサーは見出し、リスト、コードブロック、テーブル、引用ブロックなどの一般的な構文をサポートしています。
:::

## CodeAnnotation（コードコメント）

`CodeAnnotation` はコードレビューでの行レベルコメントを表し、Git diff の特定の行または範囲にフィードバックを追加するために使用されます。

### 完全定義

```typescript
export interface CodeAnnotation {
  id: string;              // 一意識別子
  type: CodeAnnotationType;  // コメントタイプ
  filePath: string;         // ファイルパス
  lineStart: number;        // 開始行番号
  lineEnd: number;          // 終了行番号
  side: 'old' | 'new';     // 側（'old' = 削除行、'new' = 新規行）
  text?: string;           // コメント内容
  suggestedCode?: string;    // 提案コード（suggestion タイプ用）
  createdAt: number;        // 作成タイムスタンプ
  author?: string;         // 協力者身份
}
```

### CodeAnnotationType タイプ

```typescript
export type CodeAnnotationType =
  | 'comment'      // 通常コメント
  | 'suggestion'  // 修正提案（suggestedCode が必要）
  | 'concern';     // 懸念点（重要事項の注意）
```

### フィールド説明

| フィールド | タイプ | 必須 | 説明 |
|--- | --- | --- | ---|
| `id` | string | ✅ | 一意識別子 |
| `type` | CodeAnnotationType | ✅ | コメントタイプ（comment/suggestion/concern） |
| `filePath` | string | ✅ | コメントされたファイルの相対パス（`src/auth.ts` など） |
| `lineStart` | number | ✅ | 開始行番号（1 から開始） |
| `lineEnd` | number | ✅ | 終了行番号（1 から開始） |
| `side` | 'old' \| 'new' | ✅ | 側：`'old'` = 削除行（旧バージョン）、`'new'` = 新規行（新バージョン） |
| `text` | string | ❌ | コメント内容 |
| `suggestedCode` | string | ❌ | 提案コード（type が 'suggestion' の場合必須） |
| `createdAt` | number | ✅ | 作成タイムスタンプ（ミリ秒） |
| `author` | string | ❌ | 協力者身份識別子 |

### side フィールドの説明

`side` フィールドは [@pierre/diffs](https://www.npmjs.com/package/@pierre/diffs) ライブラリの diff ビューに対応しています：

| side 値 | @pierre/diffs 対応 | 説明 |
|--- | --- | ---|
| `'old'` | `deletions` | 削除された行（旧バージョンのコンテンツ） |
| `'new'` | `additions` | 新規追加された行（新バージョンのコンテンツ） |

### 例

#### 通常コメント（新規行）

```typescript
{
  id: "code-anno-001",
  type: "comment",
  filePath: "src/auth.ts",
  lineStart: 15,
  lineEnd: 15,
  side: "new",
  text: "ここでエラー状況を処理する必要があります",
  createdAt: Date.now(),
}
```

#### 修正提案（削除行）

```typescript
{
  id: "code-anno-002",
  type: "suggestion",
  filePath: "src/auth.ts",
  lineStart: 10,
  lineEnd: 12,
  side: "old",
  text: "async/await を使用することをお勧めします",
  suggestedCode: "async function authenticate() {\n  const user = await fetchUser();\n  return user;\n}",
  createdAt: Date.now(),
}
```

## ShareableAnnotation（共有コメント）

`ShareableAnnotation` は URL 共有のための簡素化コメント形式であり、配列タプルで表現することでペイロードサイズを削減します。

### 完全定義

```typescript
export type ShareableAnnotation =
  | ['D', string, string | null, string[]?]           // Deletion: [type, original, author, images]
  | ['R', string, string, string | null, string[]?]   // Replacement: [type, original, replacement, author, images]
  | ['C', string, string, string | null, string[]?]   // Comment: [type, original, comment, author, images]
  | ['I', string, string, string | null, string[]?]   // Insertion: [type, context, new text, author, images]
  | ['G', string, string | null, string[]?];          // Global Comment: [type, comment, author, images]
```

### タイプ説明

| タイプ | 先頭文字 | タプル構造 | 説明 |
|--- | --- | --- | ---|
| DELETION | `'D'` | `['D', original, author?, images?]` | コンテンツを削除 |
| REPLACEMENT | `'R'` | `['R', original, replacement, author?, images?]` | コンテンツを置換 |
| COMMENT | `'C'` | `['C', original, comment, author?, images?]` | コンテンツにコメント |
| INSERTION | `'I'` | `['I', context, newText, author?, images?]` | コンテンツを挿入 |
| GLOBAL_COMMENT | `'G'` | `['G', comment, author?, images?]` | グローバルコメント |

### 例

```typescript
// 削除
['D', '削除するコンテンツ', null, []]

// 置換
['R', '元テキスト', '置換後', null, ['/tmp/img.png']]

// コメント
['C', 'このコード', '最適化を提案', null, []]

// 挿入
['I', 'コンテキスト', '挿入する新コンテンツ', null, []]

// グローバルコメント
['G', '全体が良い', null, []]
```

::: tip なぜ簡素化形式を使用するのか？
配列タプルではなくオブジェクトを使用すると、ペイロードサイズを削減でき、圧縮後の URL が短くなります。例えば：
- オブジェクト形式：`{"type":"DELETION","originalText":"text"}` → 38 バイト
- 簡素化形式：`["D","text",null,[]]` → 18 バイト
:::

## SharePayload（共有ペイロード）

`SharePayload` は URL 共有の完全なデータ構造であり、計画コンテンツとコメントを含みます。

### 完全定義

```typescript
export interface SharePayload {
  p: string;                  // 計画の Markdown テキスト
  a: ShareableAnnotation[];    // コメント配列（簡素化形式）
  g?: string[];              // グローバル添付ファイルパス（画像）
}
```

### フィールド説明

| フィールド | タイプ | 必須 | 説明 |
|--- | --- | --- | ---|
| `p` | string | ✅ | 元計画の Markdown コンテンツ |
| `a` | ShareableAnnotation[] | ✅ | コメント配列（`ShareableAnnotation` 簡素化形式を使用） |
| `g` | string[] | ❌ | グローバル添付ファイルパス（特定のコメントに紐付けない画像） |

### 例

```typescript
{
  p: "# Implementation Plan\n\n1. Add auth\n2. Add UI",
  a: [
    ['C', 'Add auth', 'OAuth のサポートが必要', null, []],
    ['G', '全体の計画が明確', null, []],
  ],
  g: ['/tmp/plannotator/diagram.png'],
}
```

## Frontmatter（フロントメタデータ）

`Frontmatter` は Markdown ファイルの先頭にある YAML メタデータを表し、追加情報を保存するために使用されます。

### 完全定義

```typescript
export interface Frontmatter {
  [key: string]: string | string[];
}
```

### 例

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [authentication, typescript]
author: John Doe
---

### Implementation Plan（例）
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

::: tip フロントメタデータの用途
Plannotator は計画を Obsidian に保存する際に自動的に frontmatter を生成し、作成時間、ソースタグなどの情報を含め、ノートの管理と検索を容易にします。
:::

## 関連補助タイプ

### EditorMode（エディタモード）

```typescript
export type EditorMode = 'selection' | 'comment' | 'redline';
```

- `'selection'`：テキスト選択モード
- `'comment'`：コメントモード
- `'redline'`：赤線註釈モード

### DiffResult（Diff 結果）

```typescript
export interface DiffResult {
  original: string;    // 元コンテンツ
  modified: string;    // 修正後コンテンツ
  diffText: string;    // Unified diff テキスト
}
```

### DiffAnnotationMetadata（Diff コメントメタデータ）

```typescript
export interface DiffAnnotationMetadata {
  annotationId: string;      // 関連するコメント ID
  type: CodeAnnotationType;  // コメントタイプ
  text?: string;            // コメント内容
  suggestedCode?: string;   // 提案コード
  author?: string;          // 作者
}
```

### SelectedLineRange（選択された行範囲）

```typescript
export interface SelectedLineRange {
  start: number;                      // 開始行番号
  end: number;                        // 終了行番号
  side: 'deletions' | 'additions';   // 側（@pierre/diffs の diff ビューに対応）
  endSide?: 'deletions' | 'additions'; // 終了側（跨側選択用）
}
```

## データ変換関係

### Annotation ↔ ShareableAnnotation

```typescript
// 完全 → 簡素化
function toShareable(annotations: Annotation[]): ShareableAnnotation[]

// 簡素化 → 完全
function fromShareable(data: ShareableAnnotation[]): Annotation[]
```

::: info 座標の喪失
`fromShareable` で生成された `Annotation` の `blockId`、`startOffset`、`endOffset` フィールドは空または 0 であり、テキスト一致または web-highlighter を通じて正確な位置を復元する必要があります。
:::

### Markdown ↔ Block[]

```typescript
// Markdown → Block[]
function parseMarkdownToBlocks(markdown: string): Block[]

// Block[] + Annotation[] → Markdown
function exportDiff(blocks: Block[], annotations: Annotation[]): string
```

## 本課のまとめ

本付録では Plannotator のすべてのコアデータモデルを紹介しました：

- **Annotation**：計画レビューでのコメント、削除、挿入、置換、コメントなどのタイプをサポート
- **Block**：Markdown 解析後のコンテンツブロック、計画を構造的に表示するため
- **CodeAnnotation**：コードレビューでの行レベルコメント、コメントと提案をサポート
- **ShareableAnnotation**：URL 共有のための簡素化形式、ペイロードサイズを削減
- **SharePayload**：URL 共有の完全なデータ構造

これらのデータモデルは、計画レビュー、コードレビュー、URL 共有などの機能で広く使用されています。それらを理解することで、Plannotator のカスタマイズと拡張に役立ちます。

## 次回予告

> 次回のレッスンでは **[Plannotator ライセンス説明](../license/)** を学びます。
>
> 次の内容が含まれます：
> - Business Source License 1.1 (BSL) のコア条項
> - 許可される使用方法と商業的制限
> - 2030 年に Apache 2.0 に転換されるスケジュール
> - 商業ライセンスの取得方法

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコードの場所を表示</strong></summary>

> 更新日時：2026-01-24

| 機能 | ファイルパス | 行番号 |
|--- | --- | ---|
| Annotation インターフェース | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L11-L33) | 11-33 |
| AnnotationType 列挙型 | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L7) | 1-7 |
| Block インターフェース | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L35-L44) | 35-44 |
| CodeAnnotation インターフェース | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L55-L66) | 55-66 |
| CodeAnnotationType タイプ | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L53) | 53 |
| ShareableAnnotation タイプ | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L14-L19) | 14-19 |
| SharePayload インターフェース | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L21-L25) | 21-25 |
| toShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L76-L95) | 76-95 |
| fromShareable() | [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts#L102-L155) | 102-155 |
| parseMarkdownToBlocks() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L70-L244) | 70-244 |
| exportDiff() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L246-L323) | 246-323 |
| extractFrontmatter() | [`packages/ui/utils/parser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/parser.ts#L14-L63) | 14-63 |

**重要定数**：
- なし

**重要関数**：
- `toShareable(annotations: Annotation[]): ShareableAnnotation[]`：完全コメントを簡素化形式に変換
- `fromShareable(data: ShareableAnnotation[]): Annotation[]`：簡素化形式を完全コメントに復元
- `parseMarkdownToBlocks(markdown: string): Block[]`：Markdown を Block 配列に解析
- `exportDiff(blocks: Block[], annotations: Annotation[]): string`：コメントを Markdown 形式でエクスポート

</details>
