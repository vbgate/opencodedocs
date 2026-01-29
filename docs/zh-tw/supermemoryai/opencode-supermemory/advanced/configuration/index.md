---
title: "進階配置: 自訂記憶引擎參數 | opencode-supermemory"
sidebarTitle: "進階配置"
subtitle: "深度配置詳解：定製你的記憶引擎"
description: "掌握 opencode-supermemory 的進階配置選項。本教程教你如何自訂記憶觸發詞、調整上下文注入策略、優化壓縮閾值以及管理環境變數。"
tags:
  - "配置"
  - "進階"
  - "自訂"
prerequisite:
  - "start-getting-started"
order: 2
---

# 深度配置詳解：定製你的記憶引擎

## 學完你能做什麼

- **自訂觸發詞**：讓 Agent 聽懂你的專屬指令（如 "記一下"、"mark"）。
- **調整記憶容量**：控制注入到上下文中的記憶數量，平衡 Token 消耗與資訊量。
- **優化壓縮策略**：根據專案規模調整搶佔式壓縮的觸發時機。
- **多環境管理**：透過環境變數靈活切換 API Key。

## 配置檔案位置

opencode-supermemory 會按順序查找以下配置檔案，**找到即止**：

1. `~/.config/opencode/supermemory.jsonc`（推薦，支援註解）
2. `~/.config/opencode/supermemory.json`

::: tip 為什麼推薦 .jsonc？
`.jsonc` 格式允許在 JSON 中寫註解（`//`），非常適合用來解釋配置項的用途。
:::

## 核心配置詳解

以下是一個完整的配置範例，包含了所有可用選項及其預設值。

### 基礎配置

```jsonc
// ~/.config/opencode/supermemory.jsonc
{
  // Supermemory API Key
  // 優先級：配置檔案 > 環境變數 SUPERMEMORY_API_KEY
  "apiKey": "your-api-key-here",

  // 語意搜尋的相似度閾值 (0.0 - 1.0)
  // 值越高，檢索結果越精準但數量越少；值越低，結果越發散
  "similarityThreshold": 0.6
}
```

### 上下文注入控制

這些設定決定了 Agent 在啟動會話時，會自動讀取多少記憶注入到 Prompt 中。

```jsonc
{
  // 是否自動注入使用者設定檔（User Profile）
  // 設為 false 可節省 Token，但 Agent 可能忘記你的基本偏好
  "injectProfile": true,

  // 注入的使用者設定檔條目最大數量
  "maxProfileItems": 5,

  // 注入的使用者級記憶（User Scope）最大數量
  // 這些是跨專案共享的通用記憶
  "maxMemories": 5,

  // 注入的專案級記憶（Project Scope）最大數量
  // 這些是當前專案特有的記憶
  "maxProjectMemories": 10
}
```

### 自訂觸發詞

你可以新增自訂的正則表達式，讓 Agent 識別特定的指令並自動儲存記憶。

```jsonc
{
  // 自訂觸發詞列表（支援正則表達式）
  // 這些詞會與內建的預設觸發詞合併生效
  "keywordPatterns": [
    "記一下",           // 簡單匹配
    "mark\\s+this",     // 正則匹配：mark this
    "重要[:：]",         // 匹配 "重要:" 或 "重要："
    "TODO\\(memory\\)"  // 匹配特定標記
  ]
}
```

::: details 查看內建預設觸發詞
外掛內建了以下觸發詞，無需配置即可使用：
- `remember`, `memorize`
- `save this`, `note this`
- `keep in mind`, `don't forget`
- `learn this`, `store this`
- `record this`, `make a note`
- `take note`, `jot down`
- `commit to memory`
- `remember that`
- `never forget`, `always remember`
:::

### 搶佔式壓縮 (Preemptive Compaction)

當會話上下文過長時，外掛會自動觸發壓縮機制。

```jsonc
{
  // 壓縮觸發閾值 (0.0 - 1.0)
  // 當 Token 使用率超過此比例時觸發壓縮
  // 預設 0.80 (80%)
  "compactionThreshold": 0.80
}
```

::: warning 閾值設定建議
- **不要設得太高**（如 > 0.95）：可能導致在壓縮完成前就耗盡上下文視窗。
- **不要設得太低**（如 < 0.50）：會導致頻繁壓縮，打斷心流且浪費 Token。
- **推薦值**：0.70 - 0.85 之間。
:::

## 環境變數支援

除了配置檔案，你也可以使用環境變數來管理敏感資訊或覆蓋預設行為。

| 環境變數 | 描述 | 優先級 |
|--- | --- | ---|
| `SUPERMEMORY_API_KEY` | Supermemory API 金鑰 | 低於配置檔案 |
| `USER` 或 `USERNAME` | 用於產生使用者作用域 Hash 的識別符 | 系統預設 |

### 使用場景：多環境切換

如果你在公司和個人專案中使用不同的 Supermemory 帳號，可以利用環境變數：

::: code-group

```bash [macOS/Linux]
# 在 .zshrc 或 .bashrc 中設定預設 Key
export SUPERMEMORY_API_KEY="key_personal"

# 在公司專案目錄下，暫時覆蓋 Key
export SUPERMEMORY_API_KEY="key_work" && opencode
```

```powershell [Windows]
# 設定環境變數
$env:SUPERMEMORY_API_KEY="key_work"
opencode
```

:::

## 跟我做：定製你的專屬配置

讓我們來建立一個適合大多數開發者的優化配置。

### 第 1 步：建立配置檔案

如果檔案不存在，請建立它。

```bash
mkdir -p ~/.config/opencode
touch ~/.config/opencode/supermemory.jsonc
```

### 第 2 步：寫入優化配置

將以下內容複製到 `supermemory.jsonc` 中。這個配置增加了專案記憶的權重，並新增了繁體中文觸發詞。

```jsonc
{
  // 保持預設相似度
  "similarityThreshold": 0.6,

  // 增加專案記憶數量，減少通用記憶，更適合深度開發
  "maxMemories": 3,
  "maxProjectMemories": 15,

  // 新增繁體中文習慣的觸發詞
  "keywordPatterns": [
    "記一下",
    "記住",
    "儲存記憶",
    "別忘了"
  ],

  // 稍微提前觸發壓縮，預留更多安全空間
  "compactionThreshold": 0.75
}
```

### 第 3 步：驗證配置

重新啟動 OpenCode，在對話中嘗試使用新定義的觸發詞：

```
使用者輸入：
記一下：這個專案的 API 基礎路徑是 /api/v2

系統回覆（預期）：
(Agent 呼叫 supermemory 工具儲存記憶)
已儲存記憶：這個專案的 API 基礎路徑是 /api/v2
```

## 常見問題

### Q: 修改配置後需要重新啟動嗎？
**A: 需要。** 外掛在啟動時載入配置，修改 `supermemory.jsonc` 後必須重新啟動 OpenCode 才能生效。

### Q: `keywordPatterns` 支援繁體中文正則嗎？
**A: 支援。** 底層使用 JavaScript 的 `new RegExp()`，完全支援 Unicode 字元。

### Q: 如果配置檔案格式錯了會怎樣？
**A: 外掛會回退到預設值。** 如果 JSON 格式無效（如多餘的逗號），外掛會捕獲錯誤並使用內建的 `DEFAULTS`，不會導致 OpenCode 崩潰。

## 下一課預告

> 下一課我們學習 **[隱私與資料安全](../../security/privacy/)**。
>
> 你會學到：
> - 敏感資料自動脫敏機制
> - 如何使用 `<private>` 標籤保護隱私
> - 資料儲存的安全邊界

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 配置介面定義 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L12-L23) | 12-23 |
| 預設值定義 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |
| 預設觸發詞 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L25-L42) | 25-42 |
| 配置檔案載入 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L73-L86) | 73-86 |
| 環境變數讀取 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |

</details>
