---
title: "上下文注入: Agent 自動記憶 | opencode-supermemory"
sidebarTitle: "上下文注入"
subtitle: "自動上下文注入機制：讓 Agent \"未卜先知\""
description: "學習 opencode-supermemory 的自動上下文注入機制。了解 Agent 如何在會話開始時獲取使用者設定檔和專案知識，掌握關鍵詞觸發記憶儲存的方法。"
tags:
  - "context"
  - "injection"
  - "prompt"
  - "memory"
prerequisite:
  - "start-getting-started"
order: 1
---

# 自動上下文注入機制：讓 Agent "未卜先知"

## 學完你能做什麼

學完本課，你將能夠：
1.  **理解** 為什麼 Agent 一上來就知道你的編碼習慣和專案架構。
2.  **掌握** 上下文注入的「三維模型」（使用者設定檔、專案知識、相關記憶）。
3.  **學會** 使用關鍵詞（如 "Remember this"）主動干預 Agent 的記憶行為。
4.  **配置** 注入的條目數量，平衡上下文長度與資訊豐富度。

---

## 核心思路

在沒有記憶外掛之前，每次開啟新會話，Agent 都是一張白紙。你必須重複告訴它：「我是用 TypeScript 的」、「這個專案用的是 Next.js」。

**上下文注入（Context Injection）** 解決了這個問題。它就像在 Agent 醒來的一瞬間，把一份「任務簡報」塞進它的腦子裡。

### 觸發時機

opencode-supermemory 極其克制，只在 **會話的第一條訊息** 時觸發自動注入。

- **為什麼是第一條？** 因為這是確立會話基調的關鍵時刻。
- **後續訊息呢？** 後續訊息不再自動注入，以免干擾對話流程，除非你主動觸發（見下文「關鍵詞觸發」）。

### 三維注入模型

外掛會並行獲取三類資料，組合成一個 `[SUPERMEMORY]` 提示區塊：

| 資料維度 | 來源 | 作用 | 範例 |
|--- | --- | --- | ---|
| **1. 使用者設定檔** (Profile) | `getProfile` | 你的長期偏好 | "使用者喜歡函數式程式設計"、"偏好箭頭函數" |
| **2. 專案知識** (Project) | `listMemories` | 當前專案的全面知識 | "本專案使用 Clean Architecture"、"API 放在 src/api" |
| **3. 相關記憶** (Relevant) | `searchMemories` | 與你第一句話相關的過往經驗 | 你問「怎麼修這個 Bug」，它搜出之前的類似修復記錄 |

---

## 注入了什麼？

當你在 OpenCode 中發送第一條訊息時，外掛會在背景默默將以下內容插入到 System Prompt 中。

::: details 點擊查看注入內容的真實結構
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Agent 看到這些資訊後，就會表現得像一個在這個專案工作了很久的老員工，而不是新來的實習生。

---

## 關鍵詞觸發機制 (Nudge)

除了開頭的自動注入，你還可以在對話過程中隨時「喚醒」記憶功能。

外掛內建了一個 **關鍵詞偵測器**。只要你的訊息中包含特定的觸發詞，外掛會向 Agent 發送一個「隱形提示」（Nudge），強制它呼叫儲存工具。

### 預設觸發詞

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (更多見原始碼配置)

### 互動範例

**你輸入**：
> 這裡的 API 回應格式變了，**remember** 以後都用 `data.result` 而不是 `data.payload`。

**外掛偵測到 "remember"**：
> （背景注入提示）：`[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Agent 反應**：
> 收到。我會記住這個變更。
> *(背景呼叫 `supermemory.add` 儲存記憶)*

---

## 深度配置

你可以透過修改 `~/.config/opencode/supermemory.jsonc` 來調整注入行為。

### 常用配置項

```jsonc
{
  // 是否注入使用者設定檔（預設 true）
  "injectProfile": true,

  // 每次注入多少條專案記憶（預設 10）
  // 調大能讓 Agent 更了解專案，但會消耗更多 Token
  "maxProjectMemories": 10,

  // 每次注入多少條使用者設定檔條目（預設 5）
  "maxProfileItems": 5,

  // 自訂觸發詞（支援正則）
  "keywordPatterns": [
    "記一下",
    "永久儲存"
  ]
}
```

::: tip 提示
配置修改後，需要重新啟動 OpenCode 或重新載入外掛才能生效。
:::

---

## 常見問題

### Q: 注入的資訊會佔用很多 Token 嗎？
**A**: 會佔用一部分，但通常可控。預設配置下（10條專案記憶 + 5條設定檔），大約佔用 500-1000 Token。對於現代大型模型（如 Claude 3.5 Sonnet）的 200k 上下文來說，這只是九牛一毛。

### Q: 為什麼我說了 "remember" 它沒反應？
**A**:
1. 檢查是否拼寫正確（支援正則匹配）。
2. 確認 API Key 是否配置正確（如果外掛未初始化，不會觸發）。
3. Agent 可能決定忽略（雖然外掛強制提示了，但 Agent 有最終決定權）。

### Q: "相關記憶" 是怎麼搜出來的？
**A**: 它是基於你 **第一條訊息的內容** 進行語意搜尋的。如果你第一句話只說了 "Hi"，可能搜不出什麼有用的相關記憶，但「專案知識」和「使用者設定檔」依然會被注入。

---

## 本課小結

- **自動注入** 僅在會話第一條訊息觸發。
- **三維模型** 包含使用者設定檔、專案知識和相關記憶。
- **關鍵詞觸發** 讓你可以隨時命令 Agent 儲存記憶。
- 透過 **配置檔案** 可以控制注入的資訊量。

## 下一課預告

> 下一課我們學習 **[工具集詳解：教 Agent 記憶](../tools/index.md)**。
>
> 你會學到：
> - 如何手動使用 `add`、`search` 等工具。
> - 如何查看和刪除錯誤的記憶。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 注入觸發邏輯 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| 關鍵詞偵測 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Prompt 格式化 | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| 預設配置 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**關鍵函數**：
- `formatContextForPrompt()`: 組裝 `[SUPERMEMORY]` 文字區塊。
- `detectMemoryKeyword()`: 正則匹配使用者訊息中的觸發詞。

</details>

## 下一課預告

> 下一課我們學習 **[工具集詳解：教 Agent 記憶](../tools/index.md)**。
>
> 你會學到：
> - 掌握 `add`, `search`, `profile` 等 5 種核心工具模式
> - 如何手動干預和修正 Agent 的記憶
> - 使用自然語言觸發記憶儲存
