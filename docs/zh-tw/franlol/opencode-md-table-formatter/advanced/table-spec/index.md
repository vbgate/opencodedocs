---
title: "表格規範: 格式化條件 | opencode-md-table-formatter"
sidebarTitle: "解決 invalid structure 錯誤"
subtitle: "表格規範：什麼樣的表格能被格式化"
description: "學習 Markdown 表格的 4 個有效條件。掌握行列管線符號、分隔列語法、欄位數一致性，解決 invalid structure 錯誤。"
tags:
  - "表格驗證"
  - "分隔列"
  - "欄位數一致"
  - "對齊語法"
prerequisite:
  - "start-features"
order: 40
---

# 表格規範：什麼樣的表格能被格式化

::: info 學完你能做什麼
- 知道什麼樣的表格能被外掛格式化
- 理解 `invalid structure` 錯誤的原因
- 寫出符合規範的 Markdown 表格
:::

## 你現在的困境

AI 生成了一個表格，但外掛沒有格式化，還在末尾加了一句：

```markdown
<!-- table not formatted: invalid structure -->
```

什麼是「無效結構」？為什麼我的表格不行？

## 什麼時候用這一招

- 遇到 `invalid structure` 錯誤，想知道哪裡出了問題
- 想確保 AI 生成的表格能被正確格式化
- 想手寫一個符合規範的 Markdown 表格

## 核心思路

外掛在格式化前會做三層驗證：

```
第 1 層：是不是表格列？ → isTableRow()
第 2 層：有沒有分隔列？ → isSeparatorRow()
第 3 層：結構是否有效？ → isValidTable()
```

只有三層都通過，才會格式化。任何一層失敗，就保留原樣並新增錯誤註解。

## 有效表格的 4 個條件

### 條件 1：每列必須以 `|` 開頭和結尾

這是最基本的要求。Markdown 管線表格（Pipe Table）的每一列都必須用 `|` 包裹。

```markdown
✅ 正確
| 名稱 | 描述 |

❌ 錯誤
名稱 | 描述      ← 沒有開頭的 |
| 名稱 | 描述     ← 沒有結尾的 |
```

::: details 原始碼實現
```typescript
function isTableRow(line: string): boolean {
  const trimmed = line.trim()
  return trimmed.startsWith("|") && trimmed.endsWith("|") && trimmed.split("|").length > 2
}
```
原始碼位置：`index.ts:58-61`
:::

### 條件 2：每列至少有 2 個分隔符

`split("|").length > 2` 意味著至少要有 2 個 `|` 把內容分開。

```markdown
✅ 正確（3 個 |，2 個分隔符）
| 名稱 | 描述 |

❌ 錯誤（只有 2 個 |，1 個分隔符）
| 名稱 |
```

換句話說，**單列表格是有效的**，但必須寫成 `| 內容 |` 的形式。

### 條件 3：必須有分隔列

分隔列是表頭和資料列之間的那一列，用來定義對齊方式。

```markdown
| 名稱 | 描述 |
| --- | --- |      ← 這就是分隔列
| 值1 | 值2 |
```

**分隔列的語法規則**：

每個儲存格必須匹配正規表示式 `/^\s*:?-+:?\s*$/`，翻譯成人話就是：

| 組成部分 | 含義 | 範例 |
|---|---|---|
| `\s*` | 可選的空白 | 允許 `| --- |` 或 `|---|` |
| `:?` | 可選的冒號 | 用於指定對齊方式 |
| `-+` | 至少一個短橫線 | `-`、`---`、`------` 都行 |

**有效的分隔列範例**：

```markdown
| --- | --- |           ← 最簡形式
| :--- | ---: |         ← 帶對齊標記
| :---: | :---: |       ← 置中對齊
|---|---|               ← 無空格也行
| -------- | -------- | ← 長短橫線也行
```

**無效的分隔列範例**：

```markdown
| === | === |           ← 用了等號，不是短橫線
| - - | - - |           ← 短橫線中間有空格
| ::: | ::: |           ← 只有冒號，沒有短橫線
```

::: details 原始碼實現
```typescript
function isSeparatorRow(line: string): boolean {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|") || !trimmed.endsWith("|")) return false
  const cells = trimmed.split("|").slice(1, -1)
  return cells.length > 0 && cells.every((cell) => /^\s*:?-+:?\s*$/.test(cell))
}
```
原始碼位置：`index.ts:63-68`
:::

### 條件 4：所有列的欄位數必須一致

如果第一列有 3 欄，後面每一列都必須有 3 欄。

```markdown
✅ 正確（每列都是 3 欄）
| A | B | C |
|--- | --- | ---|
| 1 | 2 | 3 |

❌ 錯誤（第三列只有 2 欄）
| A | B | C |
|--- | --- | ---|
| 1 | 2 |
```

::: details 原始碼實現
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
原始碼位置：`index.ts:70-88`
:::

## 對齊語法速查

分隔列不僅用於分隔，還用於指定對齊方式：

| 語法 | 對齊方式 | 效果 |
|---|---|---|
| `---` 或 `:---` | 左對齊 | 文字靠左（預設） |
| `:---:` | 置中 | 文字置中 |
| `---:` | 右對齊 | 文字靠右 |

**範例**：

```markdown
| 左對齊 | 置中 | 右對齊 |
|--- | --- | ---|
| 文字 | 文字 | 文字 |
```

格式化後：

```markdown
| 左對齊 |  置中  | 右對齊 |
|--- | --- | ---|
| 文字   |  文字  |   文字 |
```

::: details 原始碼實現
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
原始碼位置：`index.ts:141-149`
:::

## 常見錯誤排查

| 錯誤現象 | 可能原因 | 解決方法 |
|--- | --- | ---|
| `invalid structure` | 缺少分隔列 | 在表頭後添加 `\| --- \| --- \|` |
| `invalid structure` | 欄位數不一致 | 檢查每列的 `\|` 數量是否相同 |
| `invalid structure` | 列首/列尾缺少 `\|` | 補上缺失的 `\|` |
| 表格沒被檢測到 | 只有 1 欄 | 確保至少有 2 個 `\|` 分隔符 |
| 對齊不生效 | 分隔列語法錯誤 | 檢查是否用了 `-` 而不是其他字元 |

## 檢查點

完成本課後，你應該能回答：

- [ ] 表格列必須滿足什麼條件？（答：以 `|` 開頭和結尾，至少 2 個分隔符）
- [ ] 分隔列的正規表示式是什麼意思？（答：可選冒號 + 至少一個短橫線 + 可選冒號）
- [ ] 為什麼會出現 `invalid structure`？（答：缺少分隔列、欄位數不一致、或列首/列尾缺少 `|`）
- [ ] `:---:` 表示什麼對齊方式？（答：置中對齊）

## 本課小結

| 條件 | 要求 |
|--- | ---|
| 列首列尾 | 必須以 `\|` 開頭和結尾 |
| 分隔符數量 | 至少 2 個 `\|` |
| 分隔列 | 必須有，格式為 `:?-+:?` |
| 欄位數一致 | 所有列的欄位數必須相同 |

**記憶口訣**：

> 管線包裹兩邊齊，分隔列裡短橫線，欄位數一致不能少，四條規則記心間。

## 下一課預告

> 下一課我們學習 **[對齊方式詳解](../../alignment/)**。
>
> 你會學到：
> - 三種對齊方式的詳細用法
> - 分隔列格式化的實現原理
> - 儲存格填充演算法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 表格列判定 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| 分隔列判定 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| 表格驗證 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| 對齊方式解析 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| 無效表格處理 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**關鍵正規表示式**：
- `/^\s*:?-+:?\s*$/`：分隔列儲存格匹配規則

**關鍵函式**：
- `isTableRow()`：判斷是否為表格列
- `isSeparatorRow()`：判斷是否為分隔列
- `isValidTable()`：驗證表格結構是否有效
- `getAlignment()`：解析對齊方式

</details>
