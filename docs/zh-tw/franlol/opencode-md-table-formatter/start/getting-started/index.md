---
title: "快速開始：安裝與設定 | opencode-md-table-formatter"
sidebarTitle: "1 分鐘讓表格對齊"
subtitle: "一分鐘上手：安裝與設定"
description: "學習 opencode-md-table-formatter 的安裝設定方法。在 1 分鐘內完成外掛安裝，透過設定檔讓 AI 生成的表格自動對齊。"
tags:
  - "installation"
  - "configuration"
  - "opencode-plugin"
prerequisite: []
order: 10
---

# 一分鐘上手：安裝與設定

::: info 學完你能做什麼
- 在 OpenCode 中安裝表格格式化外掛
- 讓 AI 生成的 Markdown 表格自動對齊
- 驗證外掛是否正常運作
:::

## 你現在的困境

AI 生成的 Markdown 表格經常是這樣的：

```markdown
| 名稱 | 描述 | 狀態 |
|--- | --- | ---|
| 功能A | 這是一個很長的描述文字 | 已完成 |
| B | 短 | 進行中 |
```

列寬參差不齊，看著難受。手動調整？太花時間了。

## 什麼時候用這一招

- 你經常讓 AI 生成表格（對比、清單、設定說明）
- 你希望表格在 OpenCode 裡顯示整齊
- 你不想每次都手動調整列寬

## 🎒 開始前的準備

::: warning 前置條件
- 已安裝 OpenCode（版本 >= 1.0.137）
- 知道 `.opencode/opencode.jsonc` 設定檔在哪裡
:::

## 跟我做

### 第 1 步：開啟設定檔

**為什麼**：外掛透過設定檔宣告，OpenCode 啟動時會自動載入。

找到你的 OpenCode 設定檔：

::: code-group

```bash [macOS/Linux]
# 設定檔通常在專案根目錄
ls -la .opencode/opencode.jsonc

# 或者在使用者目錄
ls -la ~/.config/opencode/opencode.jsonc
```

```powershell [Windows]
# 設定檔通常在專案根目錄
Get-ChildItem .opencode\opencode.jsonc

# 或在使用者目錄
Get-ChildItem "$env:APPDATA\opencode\opencode.jsonc"
```

:::

用你喜歡的編輯器開啟這個檔案。

### 第 2 步：新增外掛設定

**為什麼**：告訴 OpenCode 載入表格格式化外掛。

在設定檔中新增 `plugin` 欄位：

```jsonc
{
  // ... 其他設定 ...
  "plugin": ["@franlol/opencode-md-table-formatter@0.0.3"]
}
```

::: tip 已有其他外掛？
如果你已經有 `plugin` 陣列，把新外掛加到陣列裡：

```jsonc
{
  "plugin": [
    "existing-plugin",
    "@franlol/opencode-md-table-formatter@0.0.3"  // 加在這裡
  ]
}
```
:::

**你應該看到**：設定檔儲存成功，沒有語法錯誤提示。

### 第 3 步：重新啟動 OpenCode

**為什麼**：外掛在 OpenCode 啟動時載入，修改設定後需要重新啟動才能生效。

關閉目前的 OpenCode 工作階段，重新啟動。

**你應該看到**：OpenCode 正常啟動，沒有報錯。

### 第 4 步：驗證外掛生效

**為什麼**：確認外掛已正確載入並運作。

讓 AI 生成一個表格，例如輸入：

```
幫我生成一個表格，對比 React、Vue、Angular 三個框架的特點
```

**你應該看到**：AI 生成的表格列寬整齊，像這樣：

```markdown
| 框架    | 特點                     | 學習曲線 |
|--- | --- | ---|
| React   | 元件化、虛擬 DOM         | 中等     |
| Vue     | 漸進式、雙向綁定         | 較低     |
| Angular | 全功能框架、TypeScript   | 較高     |
```

## 檢查點 ✅

完成上述步驟後，檢查以下幾點：

| 檢查項                   | 預期結果                       |
|--- | ---|
| 設定檔語法               | 無報錯                         |
| OpenCode 啟動            | 正常啟動，無外掛載入錯誤       |
| AI 生成表格              | 列寬自動對齊，分隔列格式統一   |

## 踩坑提醒

### 表格沒有格式化？

1. **檢查設定檔路徑**：確保修改的是 OpenCode 實際讀取的設定檔
2. **檢查外掛名稱**：必須是 `@franlol/opencode-md-table-formatter@0.0.3`，注意 `@` 符號
3. **重新啟動 OpenCode**：修改設定後必須重新啟動

### 看到 "invalid structure" 註解？

這表示表格結構不符合 Markdown 規範。常見原因：

- 缺少分隔列（`|---|---|`）
- 各列列數不一致

詳見 [常見問題](../../faq/troubleshooting/) 章節。

## 本課小結

- 外掛透過 `.opencode/opencode.jsonc` 的 `plugin` 欄位設定
- 版本號 `@0.0.3` 確保使用穩定版本
- 修改設定後需要重新啟動 OpenCode
- 外掛會自動格式化 AI 生成的所有 Markdown 表格

## 下一課預告

> 下一課我們學習 **[功能全覽](../features/)**。
>
> 你會學到：
> - 外掛的 8 大核心功能
> - 隱藏模式下的寬度計算原理
> - 哪些表格能格式化，哪些不能

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能           | 檔案路徑                                                                                     | 行號    |
|--- | --- | ---|
| 外掛入口       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L9-L23) | 9-23    |
| 鉤子註冊       | [`index.ts`](https://github.com/franlol/opencode-md-table-formatter/blob/main/index.ts#L11-L13) | 11-13   |
| 套件設定       | [`package.json`](https://github.com/franlol/opencode-md-table-formatter/blob/main/package.json#L1-L41) | 1-41    |

**關鍵常數**：
- `@franlol/opencode-md-table-formatter@0.0.3`：npm 套件名稱和版本
- `experimental.text.complete`：外掛監聽的鉤子名稱

**相依性要求**：
- OpenCode >= 1.0.137
- `@opencode-ai/plugin` >= 0.13.7

</details>
