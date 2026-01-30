---
title: "對齊方式: Markdown 表格排版 | opencode-md-table-formatter"
subtitle: "對齊方式: Markdown 表格排版 | opencode-md-table-formatter"
sidebarTitle: "讓表格對齊更美觀"
description: "學習 Markdown 表格的三種對齊方式和分隔列語法。掌握對齊演算法實作，讓 AI 產生的表格在不同對齊方式下都能美觀整齊。"
tags:
  - "靠左對齊"
  - "置中對齊"
  - "靠右對齊"
  - "分隔列語法"
prerequisite:
  - "advanced-table-spec"
order: 50
---

# 對齊方式詳解：靠左對齊、置中、靠右對齊

::: info 學完你能做什麼
- 掌握三種對齊方式的語法和效果
- 理解分隔列如何指定對齊方式
- 了解儲存格填充演算法的運作原理
- 知道為什麼分隔列會自動調整寬度
:::

## 你現在的困境

AI 產生了一個表格，但欄位對齊不太美觀：

```markdown
| 名稱 | 類型 | 描述 |
|--- | --- | ---|
| 使用者 | string | 使用者名稱 |
| 年齡 | number | 年齡 |
| is_active | boolean | 是否啟用 |
```

你想讓某些欄位置中或靠右對齊，讓表格更易讀，但不知道怎麼指定。

## 什麼時候用這一招

- 想讓表格的某些欄位置中（如狀態、標籤）
- 想讓數字欄位靠右對齊（便於比較大小）
- 想讓文字欄位靠左對齊（預設行為）
- 想了解對齊的實作原理

## 核心思路：分隔列決定對齊方式

Markdown 表格的對齊方式不是寫在每一列的，而是透過**分隔列**統一指定。

分隔列的語法是：`:?-+:?`（冒號 + 短橫線 + 冒號）

| 冒號位置 | 對齊方式 | 範例 |
|--- | --- | ---|
| 左右都有 | 置中 | `:---:` |
| 只有右邊 | 靠右對齊 | `---:` |
| 都沒有 | 靠左對齊 | `---` 或 `:---` |

分隔列的每個儲存格對應一欄的對齊方式，外掛會按這個規則格式化整欄。

## 跟我做：三種對齊方式

### 第 1 步：靠左對齊（預設）

**為什麼**

靠左對齊是表格的預設行為，適合文字類資料。

**語法**

```markdown
| 名稱 | 描述 |
| :--- | :--- |    ← 左邊有冒號或沒有冒號都是靠左對齊
| 使用者 | 使用者名稱 |
```

**你應該看到**

```markdown
| 名稱   | 描述   |
|--- | ---|
| 使用者   | 使用者名稱 |
```

分隔列會顯示為 `:---`（靠左對齊標記），文字靠左對齊。

**原始碼實作**

```typescript
// getAlignment 函式：解析對齊方式
function getAlignment(delimiterCell: string): "left" | "center" | "right" {
  const trimmed = delimiterCell.trim()
  const hasLeftColon = trimmed.startsWith(":")
  const hasRightColon = trimmed.endsWith(":")

  if (hasLeftColon && hasRightColon) return "center"
  if (hasRightColon) return "right"
  return "left"  // 預設回傳 left
}
```

原始碼位置：`index.ts:141-149`

**邏輯解釋**

- 左右都有冒號（`:---:`）→ 回傳 `"center"`
- 只有右邊有冒號（`---:`）→ 回傳 `"right"`
- 其他情況（`---` 或 `:---`）→ 回傳 `"left"`（預設）

### 第 2 步：置中對齊

**為什麼**

置中適合狀態標籤、短文字、標題等需要視覺置中的內容。

**語法**

```markdown
| 名稱 | 狀態 | 描述 |
|--- | --- | --- | ---|
| 使用者 | 啟用 | 使用者名稱 |
```

**你應該看到**

```markdown
| 名稱   |  狀態  | 描述   |
|--- | --- | ---|
| 使用者   |  啟用  | 使用者名稱 |
```

中間欄的「啟用」會置中顯示，分隔列會顯示為 `:---:`（置中標記）。

**分隔列格式化原理**

分隔列儲存格的格式化由 `formatSeparatorCell` 函式處理：

```typescript
function formatSeparatorCell(width: number, align: "left" | "center" | "right"): string {
  if (align === "center") return ":" + "-".repeat(Math.max(1, width - 2)) + ":"
  if (align === "right") return "-".repeat(Math.max(1, width - 1)) + ":"
  return "-".repeat(width)
}
```

原始碼位置：`index.ts:213-217`

**置中對齊的數學原理**

置中的分隔列格式是：`:` + 短橫線 + `:`

| 目標寬度 | 計算公式 | 結果 |
|--- | --- | ---|
| 3 | `:` + ` `-`*1 ` + `:` | `:-:` |
| 5 | `:` + `-`*3 + `:` | `:---:` |
| 10 | `:` + `-`*8 + `:` | `:--------:` |

`Math.max(1, width - 2)` 確保至少保留 1 個短橫線，避免寬度為 2 時變成 `::`（沒有分隔效果）。

### 第 3 步：靠右對齊

**為什麼**

靠右對齊適合數字、金額、日期等需要從右向左比較的資料。

**語法**

```markdown
| 名稱 | 價格 | 數量 |
| :--- | ---: | ---: |    ← 右邊有冒號表示靠右對齊
| 商品 | 99.9 | 100 |
```

**你應該看到**

```markdown
| 名稱   | 價格 | 數量 |
|--- | --- | ---|
| 商品   |  99.9 |  100 |
```

數字靠右對齊，方便比較大小。

**靠右對齊的數學原理**

靠右對齊的分隔列格式是：短橫線 + `:`

| 目標寬度 | 計算公式 | 結果 |
|--- | --- | ---|
| 3 | `-`*2 + `:` | `--:` |
| 5 | `-`*4 + `:` | `----:` |
| 10 | `-`*9 + `:` | `---------:` |

`Math.max(1, width - 1)` 確保至少保留 1 個短橫線。

## 儲存格填充演算法

外掛如何決定儲存格兩邊要填多少空格？答案在 `padCell` 函式。

**原始碼實作**

```typescript
function padCell(text: string, width: number, align: "left" | "center" | "right"): string {
  const displayWidth = calculateDisplayWidth(text)  // 計算顯示寬度
  const totalPadding = Math.max(0, width - displayWidth)

  if (align === "center") {
    const leftPad = Math.floor(totalPadding / 2)
    const rightPad = totalPadding - leftPad
    return " ".repeat(leftPad) + text + " ".repeat(rightPad)
  } else if (align === "right") {
    return " ".repeat(totalPadding) + text
  } else {
    return text + " ".repeat(totalPadding)
  }
}
```

原始碼位置：`index.ts:198-211`

**填充規則**

| 對齊方式 | 左填充 | 右填充 | 範例（目標寬度 10，文字 "abc"） |
|--- | --- | --- | ---|
| 靠左對齊 | 0 | totalPadding | `abc       ` |
| 置中 | floor(total/2) | total - floor(total/2) | `   abc    ` |
| 靠右對齊 | totalPadding | 0 | `       abc` |

**置中對齊的數學細節**

`Math.floor(totalPadding / 2)` 確保左填充是整數，多餘的空間加到右邊。

| 目標寬度 | 文字寬度 | totalPadding | 左填充 | 右填充 | 結果 |
|--- | --- | --- | --- | --- | ---|
| 10 | 3 | 7 | 3 (7÷2=3.5→3) | 4 (7-3) | `   abc    ` |
| 11 | 3 | 8 | 4 (8÷2=4) | 4 (8-4) | `    abc    ` |
| 12 | 3 | 9 | 4 (9÷2=4.5→4) | 5 (9-4) | `    abc     ` |

## 完整範例

**輸入表格**（指定不同欄的對齊方式）：

```markdown
| 名稱 | 狀態 | 價格 | 描述 |
|--- | --- | --- | ---|
| 商品A | 啟用 | 99.9 | 這是一個商品 |
| 商品B | 停用 | 199.0 | 這是另一個商品 |
```

**格式化結果**：

```markdown
| 名稱   |  狀態  | 價格 | 描述         |
|--- | --- | --- | ---|
| 商品A  |  啟用  |  99.9 | 這是一個商品 |
| 商品B  |  停用  | 199.0 | 這是另一個商品 |
```

**每一欄的對齊方式**：

| 欄名 | 分隔列語法 | 對齊方式 | 說明 |
|--- | --- | --- | ---|
| 名稱 | `:---` | 靠左對齊 | 文字靠左 |
| 狀態 | `:---:` | 置中 | 文字置中 |
| 價格 | `---:` | 靠右對齊 | 數字靠右 |
| 描述 | `:---` | 靠左對齊 | 文字靠左 |

## 檢查點

完成本課後，你應該能回答：

- [ ] 如何指定置中對齊？（答：分隔列用 `:---:`）
- [ ] 如何指定靠右對齊？（答：分隔列用 `---:`）
- [ ] 靠左對齊的預設語法是什麼？（答：`---` 或 `:---`）
- [ ] 為什麼置中對齊用 `Math.floor(totalPadding / 2)`？（答：確保左填充為整數，多餘空間加到右邊）
- [ ] 分隔列的 `:---:` 表示什麼？（答：置中對齊標記，左右各一個冒號，中間是短橫線）

## 踩坑提醒

::: warning 常見誤解
**誤解**：每一列都要指定對齊方式

**事實**：不需要。只有分隔列指定對齊方式，資料列會自動按欄對齊。

分隔列是「設定」，資料列是「內容」，設定一列就夠了。
:::

::: danger 切記
分隔列的冒號位置**必須**與欄對應。

| 錯誤範例 | 問題 |
|--- | ---|
| `| :--- | --- |` | 第一欄置中，第二欄靠左對齊（2 欄） |
| `| :--- | ---: | :--- |` | 第一欄靠左對齊，第二欄靠右對齊，第三欄靠左對齊（3 欄） |

分隔列的欄數必須與表頭和資料列的欄數一致！
:::

## 本課小結

| 對齊方式 | 分隔列語法 | 適用情境 |
|--- | --- | ---|
| 靠左對齊 | `---` 或 `:---` | 文字、描述類資料（預設） |
| 置中 | `:---:` | 狀態標籤、短文字、標題 |
| 靠右對齊 | `---:` | 數字、金額、日期 |

**關鍵函式**：

| 函式 | 作用 | 原始碼位置 |
|--- | --- | ---|
| `getAlignment()` | 解析分隔列儲存格的對齊方式 | 141-149 |
| `padCell()` | 填充儲存格到指定寬度 | 198-211 |
| `formatSeparatorCell()` | 格式化分隔列儲存格 | 213-217 |

**記憶口訣**：

> 左右冒號置中放，右邊冒號靠右齊，
> 沒有冒號預設左，分隔列裡定規矩。

## 下一課預告

> 下一課我們學習 **[常見問題：表格沒格式化怎麼辦](../../faq/troubleshooting/)**。
>
> 你會學到：
> - 如何快速定位 `invalid structure` 錯誤
> - 設定錯誤的排查方法
> - 常見表格問題的解決方案

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 對齊方式解析 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L141-L149) | 141-149 |
| 儲存格填充 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L198-L211) | 198-211 |
| 分隔列格式化 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L213-L217) | 213-217 |
| 對齊方式套用 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L107-L113) | 107-113 |

**關鍵函式**：
- `getAlignment(delimiterCell: string)`：解析分隔列儲存格的對齊方式
  - 回傳 `"left"` | `"center"` | `"right"`
  - 邏輯：左右都有冒號 → 置中，只有右邊有冒號 → 靠右對齊，其他 → 靠左對齊

- `padCell(text, width, align)`：填充儲存格到指定寬度
  - 計算顯示寬度與目標寬度的差值
  - 根據對齊方式分配左右填充
  - 置中用 `Math.floor(totalPadding / 2)` 確保左填充為整數

- `formatSeparatorCell(width, align)`：格式化分隔列儲存格
  - 置中：`:` + `-`*(width-2) + `:`
  - 靠右對齊：`-`*(width-1) + `:`
  - 靠左對齊：`-`*width
  - 使用 `Math.max(1, ...)` 確保至少保留 1 個短橫線

</details>
