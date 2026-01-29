---
title: "多語言: 自動切換中英文 | opencode-mystatus"
sidebarTitle: "多語言"
subtitle: "多語言: 自動切換中英文"
description: "學習 opencode-mystatus 的多語言支援機制。掌握 Intl API 和環境變數偵測原理，實現中英文自動切換輸出。"
tags:
  - "i18n"
  - "internationalization"
  - "language-detection"
  - "multi-language"
prerequisite:
  - "start-quick-start"
order: 3
---

# 多語言支援：中文和英文自動切換

## 學完你能做什麼

- 瞭解 mystatus 如何自動偵測系統語言
- 知道如何切換系統語言來改變輸出語言
- 理解語言偵測的優先級和回退機制
- 掌握 Intl API 和環境變數的工作原理

## 你現在的困境

你可能注意到 mystatus 的**多語言支援**有時候是中文，有時候是英文：

```
# 中文輸出
3小時限額
████████████████████████████ 剩餘 85%
重置: 2小時30分鐘後

# 英文輸出
3-hour limit
████████████████████████████ 85% remaining
Resets in: 2h 30m
```

但你不知道：
- 外掛是怎麼知道該用哪種語言的？
- 能不能手動切換到中文或英文？
- 如果偵測錯了怎麼辦？

本課幫你搞清楚語言偵測的機制。

## 核心思路

**多語言支援**根據系統語言環境自動選擇中文或英文輸出，無需手動設定。偵測優先級為：Intl API → 環境變數 → 預設英文。

**偵測優先級**（從高到低）：

1. **Intl API**（推薦）→ `Intl.DateTimeFormat().resolvedOptions().locale`
2. **環境變數**（回退）→ `LANG`、`LC_ALL`、`LANGUAGE`
3. **預設英文**（兜底）→ `"en"`

::: tip 為什麼不需要手動設定？
因為語言偵測基於系統環境，外掛在啟動時自動識別，使用者無需修改任何設定檔。
:::

**支援的語言**：
| 語言 | 程式碼 | 偵測條件 |
| ---- | ---- | -------- |
| 中文 | `zh` | locale 以 `zh` 開頭（如 `zh-CN`、`zh-TW`） |
| 英文 | `en` | 其他情況 |

**翻譯內容涵蓋**：
- 時間單位（天、小時、分鐘）
- 限額相關（剩餘百分比、重置時間）
- 錯誤資訊（認證失敗、API 錯誤、逾時）
- 平台標題（OpenAI、智譜 AI、Z.ai、Google Cloud、GitHub Copilot）

## 跟我做

### 第 1 步：查看目前系統語言

首先確認你的系統語言設定：

::: code-group

```bash [macOS/Linux]
echo $LANG
```

```powershell [Windows]
Get-ChildItem Env:LANG
```

:::

**你應該看到**：

- 中文系統：`zh_CN.UTF-8`、`zh_TW.UTF-8` 或類似
- 英文系統：`en_US.UTF-8`、`en_GB.UTF-8` 或類似

### 第 2 步：測試語言偵測

執行 `/mystatus` 指令，觀察輸出語言：

```
/mystatus
```

**你應該看到**：

- 如果系統語言是中文 → 輸出為中文（如 `3小時限額`、`重置: 2小時30分鐘後`）
- 如果系統語言是英文 → 輸出為英文（如 `3-hour limit`、`Resets in: 2h 30m`）

### 第 3 步：暫時切換系統語言（測試用）

如果你想測試不同語言的輸出效果，可以暫時修改環境變數：

::: code-group

```bash [macOS/Linux (暫時切換為英文)]
LANG=en_US.UTF-8 /mystatus
```

```powershell [Windows (暫時切換為英文)]
$env:LANG="en_US.UTF-8"; /mystatus
```

:::

**你應該看到**：

即使你的系統是中文，輸出也會變成英文格式。

::: warning
這只是暫時測試，不會永久改變系統語言。關閉終端機後恢復原設定。
:::

### 第 4 步：理解 Intl API 偵測機制

Intl API 是瀏覽器和 Node.js 提供的國際化標準介面。外掛會優先使用它偵測語言：

**偵測程式碼**（簡化版）：

```javascript
// 1. 優先使用 Intl API
const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;
if (intlLocale.startsWith("zh")) {
  return "zh";  // 中文
}

// 2. 回退到環境變數
const lang = process.env.LANG || process.env.LC_ALL || "";
if (lang.startsWith("zh")) {
  return "zh";
}

// 3. 預設英文
return "en";
```

**Intl API 的優勢**：
- 更可靠，基於系統實際設定
- 支援瀏覽器和 Node.js 環境
- 提供完整的 locale 資訊（如 `zh-CN`、`en-US`）

**環境變數作為回退**：
- 相容不支援 Intl API 的環境
- 提供手動控制語言的方式（透過修改環境變數）

### 第 5 步：永久切換系統語言（如需）

如果你希望 mystatus 始終使用某種語言，可以修改系統語言設定：

::: info
修改系統語言會影響所有應用程式，不僅僅是 mystatus。
:::

**macOS**：
1. 開啟「系統設定」→「一般」→「語言與地區」
2. 新增所需語言並拖到最上方
3. 重新啟動 OpenCode

**Linux**：
```bash
# 修改 ~/.bashrc 或 ~/.zshrc
export LANG=zh_CN.UTF-8

# 重新載入設定
source ~/.bashrc
```

**Windows**：
1. 開啟「設定」→「時間和語言」→「語言和地區」
2. 新增所需語言並設為預設
3. 重新啟動 OpenCode

## 檢查點 ✅

驗證語言偵測是否正確：

| 測試項 | 操作 | 預期結果 |
| ------ | ---- | -------- |
| 中文系統 | 執行 `/mystatus` | 輸出為中文（如 `3小時限額`） |
| 英文系統 | 執行 `/mystatus` | 輸出為英文（如 `3-hour limit`） |
| 暫時切換 | 修改 `LANG` 環境變數後執行指令 | 輸出語言隨之改變 |

## 踩坑提醒

### 常見問題

| 問題 | 原因 | 解決方法 |
| ---- | ---- | -------- |
| 輸出語言不符合預期 | 系統語言設定錯誤 | 檢查 `LANG` 環境變數或系統語言設定 |
| Intl API 不可用 | Node.js 版本過低或環境不支援 | 外掛會自動回退到環境變數偵測 |
| 中文系統顯示英文 | 環境變數 `LANG` 未設定為 `zh_*` | 設定正確的 `LANG` 值（如 `zh_CN.UTF-8`） |

### 偵測邏輯說明

**何時使用 Intl API**：
- Node.js ≥ 0.12（支援 Intl API）
- 瀏覽器環境（所有現代瀏覽器）

**何時回退到環境變數**：
- Intl API 丟出例外
- 環境不支援 Intl API

**何時使用預設英文**：
- 環境變數未設定
- 環境變數不以 `zh` 開頭

::: tip
外掛在模組載入時**只偵測一次**語言。修改系統語言後需要重新啟動 OpenCode 才能生效。
:::

## 本課小結

- **自動偵測**：mystatus 自動偵測系統語言，無需手動設定
- **偵測優先級**：Intl API → 環境變數 → 預設英文
- **支援語言**：中文（zh）和英文（en）
- **翻譯涵蓋**：時間單位、限額相關、錯誤資訊、平台標題
- **切換語言**：修改系統語言設定，重新啟動 OpenCode

## 下一課預告

> 下一課我們學習 **[常見問題：無法查詢額度、Token 過期、權限問題](../../faq/troubleshooting/)**。
>
> 你會學到：
> - 如何排查無法讀取認證檔的問題
> - Token 過期時的解決方法
> - 權限不足時的設定建議

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 語言偵測函數 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L24-L40) | 24-40 |
| 中文翻譯定義 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L46-L124) | 46-124 |
| 英文翻譯定義 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L125-L203) | 125-203 |
| 目前語言匯出 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L210) | 210 |
| 翻譯函數匯出 | [`plugin/lib/i18n.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/i18n.ts#L213) | 213 |

**關鍵函數**：
- `detectLanguage()`: 偵測使用者系統語言，優先使用 Intl API，回退到環境變數，預設英文
- `currentLang`: 目前語言（模組載入時偵測一次）
- `t`: 翻譯函數，根據目前語言返回對應的翻譯內容

**關鍵常數**：
- `translations`: 翻譯字典，包含 `zh` 和 `en` 兩個語言套件
- 支援的翻譯類型：時間單位（days、hours、minutes）、限額相關（hourLimit、dayLimit、remaining、resetIn）、錯誤資訊（authError、apiError、timeoutError）、平台標題（openaiTitle、zhipuTitle、googleTitle、copilotTitle）

**偵測邏輯**：
1. 優先使用 `Intl.DateTimeFormat().resolvedOptions().locale` 偵測語言
2. 如果 Intl API 不可用，回退到環境變數 `LANG`、`LC_ALL`、`LANGUAGE`
3. 如果環境變數也不存在或不以 `zh` 開頭，預設英文

</details>
