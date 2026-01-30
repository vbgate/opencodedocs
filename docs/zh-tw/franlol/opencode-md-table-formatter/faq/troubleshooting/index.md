---
title: "故障排查: 表格格式化問題 | opencode-md-table-formatter"
sidebarTitle: "表格沒格式化怎麼辦"
subtitle: "故障排查: 表格格式化問題"
description: "學習 opencode-md-table-formatter 外掛的故障排查方法。快速定位表格不格式化、無效結構等常見問題，掌握設定檢查和解決方案。"
tags:
  - "troubleshooting"
  - "常見問題"
prerequisite:
  - "start-getting-started"
order: 60
---

# 常見問題：表格沒格式化怎麼辦

## 學完你能做什麼

本課將幫你快速診斷和解決外掛使用中的常見問題：

- 找出表格不格式化的原因
- 理解「無效表格結構」錯誤的含義
- 了解外掛的已知限制和不適用的場景
- 快速驗證設定是否正確

---

## 問題 1：表格沒有自動格式化

### 症狀

AI 產生了表格，但表格欄寬不一致，沒有對齊。

### 可能原因與解決方案

#### 原因 1：外掛未設定

**檢查步驟**：

1. 開啟 `.opencode/opencode.jsonc` 檔案
2. 確認外掛是否在 `plugin` 陣列中：

```jsonc
{
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

3. 如果沒有，新增外掛設定
4. **重新啟動 OpenCode** 使設定生效

::: tip 設定格式
確保版本號和套件名稱正確，使用 `@franlol/opencode-md-table-formatter` + `@` + 版本號的格式。
:::

#### 原因 2：OpenCode 未重新啟動

**解決方案**：

新增外掛後，必須完全重新啟動 OpenCode（不是重新整理頁面），外掛才會載入。

#### 原因 3：表格缺少分隔行

**症狀範例**：

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

這種表格不會被格式化。

**解決方案**：

新增分隔行（第二行，用 `|---|` 格式）：

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

::: info 分隔行作用
分隔行是 Markdown 表格的標準語法，用於區分表頭和內容行，也用於指定對齊方式。外掛**必須**偵測到分隔行才會格式化表格。
:::

#### 原因 4：OpenCode 版本過低

**檢查步驟**：

1. 開啟 OpenCode 說明選單
2. 查看目前版本號
3. 確認版本 >= 1.0.137

**解決方案**：

升級到最新版本的 OpenCode。

::: warning 版本要求
外掛使用 `experimental.text.complete` 鉤子，該 API 在 OpenCode 1.0.137+ 版本可用。
:::

---

## 問題 2：看到 "invalid structure" 註解

### 症狀

表格末尾出現：

```markdown
<!-- table not formatted: invalid structure -->
```

### 什麼是「無效表格結構」

外掛會對每個 Markdown 表格進行驗證，只有通過驗證的表格才會被格式化。如果表格結構不符合規範，外掛會保留原文並新增這條註解。

### 常見原因

#### 原因 1：表格行數不足

**錯誤範例**：

```markdown
| Name |
```

只有 1 行，格式不完整。

**正確範例**：

```markdown
| Name |
|---|
```

至少需要 2 行（包括分隔行）。

#### 原因 2：欄數不一致

**錯誤範例**：

```markdown
| Name | Age |
|--- | ---|
| Alice |
```

第一行 2 欄，第三行 1 欄，欄數不一致。

**正確範例**：

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
```

所有行的欄數必須相同。

#### 原因 3：缺少分隔行

**錯誤範例**：

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

沒有 `|---|---|` 這樣的分隔行。

**正確範例**：

```markdown
| Name | Age |
|--- | ---|
| Alice | 25 |
| Bob | 30 |
```

### 如何快速診斷

使用以下檢查清單：

- [ ] 表格至少有 2 行
- [ ] 所有行的欄數相同（數一下每行有幾個 `|`）
- [ ] 存在分隔行（第二行通常是 `|---|` 格式）

如果以上都滿足但仍然報錯，請檢查是否有隱藏字元或多餘的空格導致欄數計算錯誤。

---

## 問題 3：看到 "table formatting failed" 註解

### 症狀

文字末尾出現：

```markdown
<!-- table formatting failed: {錯誤訊息} -->
```

### 原因

這是外掛內部拋出了未預期的例外。

### 解決方案

1. **查看錯誤訊息**：註解中的 `{錯誤訊息}` 部分會說明具體問題
2. **檢查表格內容**：確認是否有極端特殊情況（如超長單列、特殊字元組合）
3. **保留原文**：即使失敗，外掛也不會破壞原文，你的內容是安全的
4. **回報問題**：如果問題反覆出現，可以在 [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) 提交問題報告

::: tip 錯誤隔離
外掛使用 try-catch 包裹格式化邏輯，即使出錯也不會中斷 OpenCode 的工作流程。
:::

---

## 問題 4：某些表格類型不支援

### 不支援的表格類型

#### HTML 表格

**不支援**：

```html
<table>
  <tr><th>Name</th></tr>
  <tr><td>Alice</td></tr>
</table>
```

**只支援**：Markdown 管道表格（Pipe Table）

#### 多行儲存格

**不支援**：

```markdown
| Name | Description |
|--- | ---|
| Alice | Line 1<br>Line 2 |
```

::: info 為什麼不支援
外掛設計用於 AI 產生的簡單表格，多行儲存格需要更複雜的版面配置邏輯。
:::

#### 無分隔行的表格

**不支援**：

```markdown
| Name | Age |
| Alice | 25 |
| Bob | 30 |
```

必須有分隔行（見上文「原因 3」）。

---

## 問題 5：表格格式化後仍然不對齊

### 可能原因

#### 原因 1：隱藏模式未啟用

外掛是為 OpenCode 的隱藏模式（Concealment Mode）最佳化的，該模式會隱藏 Markdown 符號（如 `**`、`*`）。

如果你的編輯器沒有啟用隱藏模式，表格看起來可能會「不對齊」，因為 Markdown 符號佔用了實際寬度。

**解決方案**：

確認 OpenCode 隱藏模式已啟用（預設啟用）。

#### 原因 2：儲存格內容超長

如果某個儲存格內容非常長，表格可能會拉伸得很寬。

這是正常行為，外掛不會截斷內容。

#### 原因 3：行內程式碼中的符號

行內程式碼（`` `**code**` ``）中的 Markdown 符號會**按字面寬度**計算，不會被剝離。

**範例**：

```
| 符號 | 寬度 |
|--- | ---|
| 普通文字 | 4 |
| `**bold**` | 8 |
```

這是正確行為，因為隱藏模式下程式碼區塊內的符號是可見的。

---

## 本課小結

透過本課，你學會了：

- **診斷表格不格式化**：檢查設定、重新啟動、版本要求、分隔行
- **理解無效表格錯誤**：行數、欄數、分隔行驗證
- **識別已知限制**：HTML 表格、多行儲存格、無分隔行表格不支援
- **快速自檢**：使用檢查清單驗證表格結構

---

## 還沒解決？

如果以上問題都排查了但問題仍然存在：

1. **查看完整日誌**：外掛預設靜默執行，沒有詳細日誌
2. **提交 Issue**：在 [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues) 提供你的表格範例和錯誤訊息
3. **參考進階課程**：閱讀 [表格規範](../../advanced/table-spec/) 和 [隱藏模式原理](../../advanced/concealment-mode/) 了解更多技術細節

---

## 下一課預告

> 下一課我們學習 **[已知限制：外掛的邊界在哪裡](../../appendix/limitations/)**。
>
> 你會學到：
> - 外掛的設計邊界和約束
> - 未來可能的增強功能
> - 如何判斷一個場景是否適合使用本外掛

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 表格驗證邏輯 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L70-L88) | 70-88 |
| 表格行偵測 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L58-L61) | 58-61 |
| 分隔行偵測 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L63-L68) | 63-68 |
| 錯誤處理 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L15-L20) | 15-20 |
| 無效表格註解 | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L44-L47) | 44-47 |

**關鍵業務規則**：
- `isValidTable()`：驗證表格必須至少 2 行、所有行欄數一致、存在分隔行（第 70-88 行）
- `isSeparatorRow()`：使用正規表示式 `/^\s*:?-+:?\s*$/` 偵測分隔行（第 63-68 行）
- 欄最小寬度：3 字元（第 115 行）

**錯誤處理機制**：
- try-catch 包裹主處理函式（第 15-20 行）
- 格式化失敗：保留原文 + 新增 `<!-- table formatting failed: {message} -->` 註解
- 驗證失敗：保留原文 + 新增 `<!-- table not formatted: invalid structure -->` 註解

</details>
