---
title: "テーブル仕様: フォーマット条件 | opencode-md-table-formatter"
sidebarTitle: "invalid structure エラーの解決"
subtitle: "テーブル仕様：どのようなテーブルがフォーマット可能か"
description: "Markdown テーブルの 4 つの有効条件を学びます。行頭行末のパイプ記号、区切り行の構文、列数の一貫性をマスターし、invalid structure エラーを解決します。"
tags:
  - "テーブル検証"
  - "区切り行"
  - "列数一致"
  - "整列構文"
prerequisite:
  - "start-features"
order: 40
---

# テーブル仕様：どのようなテーブルがフォーマット可能か

::: info このレッスンでできること
- プラグインがフォーマット可能なテーブルを知る
- `invalid structure` エラーの原因を理解する
- 仕様に準拠した Markdown テーブルを書く
:::

## 現在の問題

AI がテーブルを生成しましたが、プラグインはフォーマットせず、末尾に次のコメントを追加しました：

```markdown
<!-- table not formatted: invalid structure -->
```

「無効な構造」とは何ですか？なぜ私のテーブルはダメなのでしょうか？

## いつこの方法を使うか

- `invalid structure` エラーが発生し、どこに問題があるかを知りたい場合
- AI が生成したテーブルが正しくフォーマットされることを確認したい場合
- 仕様に準拠した Markdown テーブルを手書きしたい場合

## 核心概念

プラグインはフォーマット前に 3 層の検証を行います：

```
第 1 層：テーブル行か？ → isTableRow()
第 2 層：区切り行があるか？ → isSeparatorRow()
第 3 層：構造が有効か？ → isValidTable()
```

3 層すべてを通過した場合のみフォーマットされます。いずれかの層で失敗すると、元のままエラーコメントが追加されます。

## 有効なテーブルの 4 つの条件

### 条件 1：各行は `|` で始まり終わる必要がある

これは最も基本的な要件です。Markdown パイプテーブル（Pipe Table）の各行は `|` で囲まれている必要があります。

```markdown
✅ 正しい
| 名称 | 説明 |

❌ 間違い
名称 | 説明      ← 先頭に | がない
| 名称 | 説明     ← 末尾に | がない
```

::: details ソースコード実装
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
ソースコード位置：`index.ts:58-61`
:::

### 条件 2：各行には少なくとも 2 つの区切り文字が必要

`split("|").length > 2` は、少なくとも 2 つの `|` で内容を区切る必要があることを意味します。

```markdown
✅ 正しい（3 つの |、2 つの区切り文字）
| 名称 | 説明 |

❌ 間違い（2 つの | のみ、1 つの区切り文字）
| 名称 |
```

言い換えると、**単一列のテーブルは有効ですが**、必ず `| 内容 |` の形式で書く必要があります。

### 条件 3：区切り行が必要

区切り行はヘッダー行とデータ行の間の行で、整列方法を定義するために使用されます。

```markdown
| 名称 | 説明 |
| --- | --- |      ← これが区切り行
| 値1 | 値2 |
```

**区切り行の構文規則**：

各セルは正規表現 `/^\s*:?-+:?\s*$/` に一致する必要があります。人間の言葉で言うと：

| 構成要素 | 意味 | 例 |
| --- | --- | --- |
| `\s*` | オプションの空白 | `| --- |` または `|---|` を許可 |
| `:?` | オプションのコロン | 整列方法を指定するために使用 |
| `-+` | 少なくとも 1 つのハイフン | `-`、`---`、`------` はすべて OK |

**有効な区切り行の例**：

```markdown
| --- | --- |           ← 最もシンプルな形式
| :--- | ---: |         ← 整列マーク付き
| :---: | :---: |       ← 中央揃え
|---|---|               ← スペースなしでも OK
| -------- | -------- | ← 長いハイフンでも OK
```

**無効な区切り行の例**：

```markdown
| === | === |           ← 等号を使用、ハイフンではない
| - - | - - |           ← ハイフンの間にスペース
| ::: | ::: |           ← コロンのみ、ハイフンなし
```

::: details ソースコード実装
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
ソースコード位置：`index.ts:63-68`
:::

### 条件 4：すべての行の列数が一致している必要がある

最初の行が 3 列の場合、後続のすべての行も 3 列である必要があります。

```markdown
✅ 正しい（すべての行が 3 列）
| A | B | C |
| --- | --- | --- |
| 1 | 2 | 3 |

❌ 間違い（3 行目が 2 列のみ）
| A | B | C |
| --- | --- | --- |
| 1 | 2 |
```

::: details ソースコード実装
```typescript
function isValidTable(lines: string[]): boolean {
  if (lines.length < 2) return false

  const rows = lines.map((line) =>
    line.split("|").slice(1, -1).map((cell) => cell.trim()),
  )

  if (rows.length === 0 || rows[0].length === 0) return false

  const firstRowCellCount = rows[0].length
  const allSameColumnCount = rows.every((row) => row.length === firstRowCellCount)
  if (!allSameColumnCount) return false

  const hasSeparator = lines.some((line) => isSeparatorRow(line))
  return hasSeparator
}
```
ソースコード位置：`index.ts:70-88`
:::

## 整列構文クイックリファレンス

区切り行は区切りのためだけでなく、整列方法を指定するためにも使用されます：

| 構文 | 整列方法 | 効果 |
| --- | --- | --- |
| `---` または `:---` | 左揃え | テキストを左に寄せる（デフォルト） |
| `:---:` | 中央揃え | テキストを中央に配置 |
| `---:` | 右揃え | テキストを右に寄せる |

**例**：

```markdown
| 左揃え | 中央揃え | 右揃え |
| :--- | :---: | ---: |
| テキスト | テキスト | テキスト |
```

フォーマット後：

```markdown
| 左揃え |  中央揃え  | 右揃え |
| :----- | :-------: | -----: |
| テキスト |  テキスト  |   テキスト |
```

::: details ソースコード実装
```typescript
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"
}
```
ソースコード位置：`index.ts:141-149`
:::

## 一般的なエラーのトラブルシューティング

| エラー現象 | 可能な原因 | 解決方法 |
| --- | --- | --- |
| `invalid structure` | 区切り行が不足 | ヘッダーの後に `\| --- \| --- \|` を追加 |
| `invalid structure` | 列数が不一致 | 各行の `\|` の数が同じか確認 |
| `invalid structure` | 行頭/行末に `\|` が不足 | 欠けている `\|` を補完 |
| テーブルが検出されない | 1 列のみ | 少なくとも 2 つの `\|` 区切り文字があることを確認 |
| 整列が有効にならない | 区切り行の構文エラー | `-` 以外の文字を使用していないか確認 |

## チェックポイント

このレッスンを完了すると、以下の質問に答えられるはずです：

- [ ] テーブル行はどのような条件を満たす必要がありますか？（答え：`|` で始まり終わる、少なくとも 2 つの区切り文字）
- [ ] 区切り行の正規表現はどういう意味ですか？（答え：オプションのコロン + 少なくとも 1 つのハイフン + オプションのコロン）
- [ ] なぜ `invalid structure` が発生しますか？（答え：区切り行が不足、列数が不一致、または行頭/行末に `|` がない）
- [ ] `:---:` はどのような整列方法を表しますか？（答え：中央揃え）

## このレッスンのまとめ

| 条件 | 要件 |
| --- | --- |
| 行頭行末 | `\|` で始まり終わる必要がある |
| 区切り文字の数 | 少なくとも 2 つの `\|` |
| 区切り行 | 必須、形式は `:?-+:?` |
| 列数一致 | すべての行の列数が同じである必要がある |

**記憶の口诀**：

> パイプで両端を囲み、区切り行にハイフン、列数一致は欠かせず、4 つのルールを心に刻む。

## 次のレッスンの予告

> 次のレッスンでは **[整列方法の詳細](../alignment/)** を学びます。
>
> 学ぶこと：
> - 3 つの整列方法の詳細な使い方
> - 区切り行フォーマットの実装原理
> - セルのパディングアルゴリズム

---

## 付録：ソースコード参照

<details>
<summary><strong>クリックしてソースコード位置を展開</strong></summary>

> 更新日時：2026-01-26

| 機能 | ファイルパス | 行番号 |
| --- | --- | --- |
| テーブル行判定 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| 区切り行判定 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| テーブル検証 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| 整列方法の解析 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| 無効なテーブルの処理 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**重要な正規表現**：
- `/^\s*:?-+:?\s*$/`：区切り行セルの一致ルール

**重要な関数**：
- `isTableRow()`：テーブル行かどうかを判定
- `isSeparatorRow()`：区切り行かどうかを判定
- `isValidTable()`：テーブル構造が有効かどうかを検証
- `getAlignment()`：整列方法を解析

</details>
