---
title: "工具集詳解: 掌握記憶操作 | opencode-supermemory"
sidebarTitle: "工具集"
subtitle: "工具集詳解：教 Agent 記憶"
description: "掌握 supermemory 工具的 5 種核心模式（add, search, profile, list, forget），學會透過自然語言指令控制 Agent 的記憶行為。"
tags:
  - "工具使用"
  - "記憶管理"
  - "核心功能"
prerequisite:
  - "start-getting-started"
order: 2
---

# 工具集詳解：教 Agent 記憶

## 學完你能做什麼

在這一課，你將掌握 `supermemory` 外掛的核心互動方式。雖然 Agent 通常會自動管理記憶，但作為開發者，你經常需要手動干預。

學完本課，你將能夠：
1.  使用 `add` 模式手動儲存關鍵技術決策。
2.  使用 `search` 模式驗證 Agent 是否記住了你的偏好。
3.  使用 `profile` 查看 Agent 眼中的「你」。
4.  使用 `list` 和 `forget` 清理過時或錯誤的記憶。

## 核心思路

opencode-supermemory 並不是一個黑盒，它透過標準的 OpenCode Tool 協議與 Agent 互動。這意味著你可以像呼叫函數一樣呼叫它，也可以用自然語言指揮 Agent 使用它。

外掛向 Agent 註冊了一個名為 `supermemory` 的工具，它就像一把瑞士軍刀，擁有 6 種模式：

| 模式 | 作用 | 典型場景 |
|--- | --- | ---|
| **add** | 新增記憶 | "記住，這個專案必須用 Bun 執行" |
| **search** | 搜尋記憶 | "我之前有沒有說過怎麼處理驗證？" |
| **profile** | 使用者設定檔 | 查看 Agent 總結你的編碼習慣 |
| **list** | 列出記憶 | 審計最近儲存的 10 條記憶 |
| **forget** | 刪除記憶 | 刪除一條錯誤的配置記錄 |
| **help** | 使用指南 | 查看工具說明文件 |

::: info 自動觸發機制
除了手動呼叫，外掛還會監聽你的聊天內容。當你透過自然語言說出 "Remember this" 或 "Save this" 時，外掛會自動偵測關鍵詞，並強制 Agent 呼叫 `add` 工具。
:::

## 跟我做：手動管理記憶

雖然我們通常讓 Agent 自動操作，但在除錯或建立初始記憶時，手動呼叫工具非常有用。你可以在 OpenCode 的對話框中直接透過自然語言讓 Agent 執行這些操作。

### 1. 新增記憶 (Add)

這是最常用的功能。你可以指定記憶的內容、類型和作用域。

**操作**：告訴 Agent 儲存一條關於專案架構的記憶。

**輸入指令**：
```text
使用 supermemory 工具儲存一條記憶：
內容：「本專案的所有服務層程式碼都必須放在 src/services 目錄下」
類型：architecture
範圍：project
```

**Agent 的內部行為**（原始碼邏輯）：
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "本專案的所有服務層程式碼都必須放在 src/services 目錄下",
    "type": "architecture",
    "scope": "project"
  }
}
```

**你應該看到**：
Agent 回傳類似這樣的確認資訊：
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip 記憶類型 (Type) 的選擇
為了讓檢索更精準，建議使用準確的類型：
- `project-config`: 技術堆疊、工具鏈配置
- `architecture`: 架構模式、目錄結構
- `preference`: 你的個人編碼喜好（如「喜歡箭頭函數」）
- `error-solution`: 某個報錯的特定解決方案
- `learned-pattern`: Agent 觀察到的程式碼模式
:::

### 2. 搜尋記憶 (Search)

當你想確認 Agent 是否「知道」某件事時，可以使用搜尋功能。

**操作**：搜尋關於「服務層」的記憶。

**輸入指令**：
```text
查詢 supermemory，關鍵詞是"services"，範圍是 project
```

**Agent 的內部行為**：
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**你應該看到**：
Agent 列出相關的記憶片段及其相似度（Similarity）。

### 3. 查看使用者設定檔 (Profile)

Supermemory 會自動維護一個「使用者設定檔」，包含你的長期偏好。

**操作**：查看你的設定檔。

**輸入指令**：
```text
呼叫 supermemory 工具的 profile 模式，看看你對我有什麼了解
```

**你應該看到**：
回傳兩類資訊：
- **Static**: 靜態事實（如「使用者是全端工程師」）
- **Dynamic**: 動態偏好（如「使用者最近在關注 Rust」）

### 4. 審計與遺忘 (List & Forget)

如果 Agent 記住了錯誤的資訊（比如一個已經廢棄的 API Key），你需要刪除它。

**第一步：列出最近記憶**
```text
列出最近的 5 條專案記憶
```
*(Agent 呼叫 `mode: "list", limit: 5`)*

**第二步：取得 ID 並刪除**
假設你看到一條錯誤的記憶 ID 為 `mem_abc123`。

```text
刪除記憶 ID 為 mem_abc123 的記錄
```
*(Agent 呼叫 `mode: "forget", memoryId: "mem_abc123"`)*

**你應該看到**：
> ✅ Memory mem_abc123 removed from project scope

## 進階：自然語言觸發

你不需要每次都詳細描述工具參數。外掛內建了關鍵詞偵測機制。

**試一試**：
在對話中直接說：
> **Remember this**: 所有的日期處理都必須使用 date-fns 函式庫，禁止使用 moment.js。

**發生了什麼？**
1.  外掛的 `chat.message` 鉤子偵測到關鍵詞 "Remember this"。
2.  外掛向 Agent 注入了一個系統提示：`[MEMORY TRIGGER DETECTED]`。
3.  Agent 收到指令："You MUST use the supermemory tool with mode: 'add'..."。
4.  Agent 自動提取內容並呼叫工具。

這是一個非常自然的互動方式，讓你在編碼過程中隨時「固化」知識。

## 常見問題 (FAQ)

**Q: `scope` 預設是什麼？**
A: 預設為 `project`。如果你想儲存跨專案通用的偏好（比如「我總是使用 TypeScript」），請明確指定 `scope: "user"`。

**Q: 為什麼我新增的記憶沒有立即生效？**
A: `add` 操作是非同步的。通常 Agent 會在工具呼叫成功後立即「知道」這條新記憶，但在某些極端網路延遲下可能需要幾秒鐘。

**Q: 敏感資訊會被上傳嗎？**
A: 外掛會自動脫敏 `<private>` 標籤內的內容。但為了安全，建議不要將密碼或 API Key 放入記憶中。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 工具定義 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| 關鍵詞偵測 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| 觸發提示詞 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| 客戶端實作 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 全文 |

**關鍵類型定義**：
- `MemoryType`: 定義在 [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)
- `MemoryScope`: 定義在 [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)

</details>

## 下一課預告

> 下一課我們學習 **[記憶作用域與生命週期](../memory-management/index.md)**。
>
> 你會學到：
> - User Scope 和 Project Scope 的底層隔離機制
> - 如何設計高效的記憶分區策略
> - 記憶的生命週期管理
