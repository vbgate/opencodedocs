---
title: "子代理處理: 自動停用機制 | opencode-dynamic-context-pruning"
subtitle: "子代理處理: 自動停用機制"
sidebarTitle: "子代理不修剪？原來如此"
description: "學習 DCP 在子代理會話中的行為和限制。理解為何 DCP 自動停用子代理修剪，以及子代理與主代理在 Token 使用上的不同策略。"
tags:
  - "子代理"
  - "會話管理"
  - "使用限制"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 4
---

# 子代理處理

## 學完你能做什麼

- 理解 DCP 為什麼會在子代理會話中自動停用
- 知道子代理與主代理在 Token 使用上的不同策略
- 避免在子代理中使用 DCP 功能導致的問題

## 你現在的困境

你可能注意到了：在有些 OpenCode 對話中，DCP 的修剪功能似乎「不工作了」——工具呼叫沒有被清理，Token 節省統計也沒有變化。這可能發生在你使用某些特定的 OpenCode 功能時，比如程式碼審查、深度分析等。

這不是 DCP 出問題了，而是這些功能使用了**子代理（Subagent）**機制，而 DCP 對子代理有特殊處理。

## 什麼是子代理

::: info 子代理（Subagent）是什麼？

**子代理**是 OpenCode 的內部 AI 代理機制。主代理將複雜任務委託給子代理處理，子代理完成後以摘要形式返回結果。

**典型使用情境**：
- 程式碼審查：主代理啟動子代理，子代理仔細讀取多個檔案，分析問題，然後返回一個簡潔的問題列表
- 深度分析：主代理啟動子代理，子代理進行大量工具呼叫和推理，最後返回核心發現

從技術角度，子代理會話有一個 `parentID` 屬性，指向其父會話。
:::

## DCP 對子代理的行為

DCP 在子代理會話中會**自動停用所有修剪功能**。

### 為什麼 DCP 不修剪子代理？

這背後有一個重要的設計理念：

| 角色       | Token 使用策略             | 核心目標                     |
|--- | --- | ---|
| **主代理** | 需要高效使用 Token        | 長對話保持上下文，降低成本    |
| **子代理** | 可以自由使用 Token        | 生成豐富的資訊，便於主代理彙總 |

**子代理的價值**在於它能「花 Token 換資訊品質」——通過大量工具呼叫和詳細分析，為父代理提供高品質的資訊彙總。如果 DCP 在子代理中修剪了工具呼叫，可能會導致：

1. **資訊丟失**：子代理的詳細分析過程被刪除，無法生成完整摘要
2. **彙總品質下降**：主代理收到的摘要不完整，影響最終決策
3. **違背設計初衷**：子代理就是為「不惜 Token 換品質」設計的

**結論**：子代理不需要修剪，因為它最終只返回一個簡潔的摘要給父代理。

### DCP 如何檢測子代理

DCP 通過以下步驟檢測當前會話是否為子代理：

```typescript
// lib/state/utils.ts:1-8
export async function isSubAgentSession(client: any, sessionID: string): Promise<boolean> {
    try {
        const result = await client.session.get({ path: { id: sessionID } })
        return !!result.data?.parentID  // 如果有 parentID，就是子代理
    } catch (error: any) {
        return false
    }
}
```

**檢測時機**：
- 會話初始化時（`ensureSessionInitialized()`）
- 每次訊息轉換前（`createChatMessageTransformHandler()`）

### 子代理會話中 DCP 的行為

DCP 在檢測到子代理後，會跳過以下功能：

| 功能               | 正常會話 | 子代理會話 | 跳過位置 |
|--- | --- | --- | ---|
| 系統提示詞注入     | ✅ 執行  | ❌ 跳過    | `hooks.ts:26-28` |
| 自動修剪策略       | ✅ 執行  | ❌ 跳過    | `hooks.ts:64-66` |
| 工具列表注入       | ✅ 執行  | ❌ 跳過    | `hooks.ts:64-66` |

**程式碼實現**（`lib/hooks.ts`）：

```typescript
// 系統提示詞處理器
export function createSystemPromptHandler(state: SessionState, ...) {
    return async (_input: unknown, output: { system: string[] }) => {
        if (state.isSubAgent) {  // ← 子代理檢測
            return               // ← 直接返回，不注入修剪工具說明
        }
        // ... 正常邏輯
    }
}

// 訊息轉換處理器
export function createChatMessageTransformHandler(...) {
    return async (input: {}, output: { messages: WithParts[] }) => {
        await checkSession(client, state, logger, output.messages)

        if (state.isSubAgent) {  // ← 子代理檢測
            return               // ← 直接返回，不執行任何修剪
        }

        // ... 正常邏輯：去重、覆蓋寫入、清除錯誤、注入工具列表等
    }
}
```

## 實際案例對比

### 案例 1：主代理會話

**情境**：你在與主代理對話，要求它分析程式碼

**DCP 行為**：
```
使用者輸入："分析 src/utils.ts 中的工具函式"
    ↓
[主代理] 讀取 src/utils.ts
    ↓
[主代理] 分析程式碼
    ↓
使用者輸入："再檢查 src/helpers.ts"
    ↓
DCP 檢測到重複讀取模式
    ↓
DCP 標記第一次 src/utils.ts 讀取為可修剪 ✅
    ↓
上下文傳送給 LLM 時，第一次讀取內容被替換為佔位符
    ↓
✅ Token 節省
```

### 案例 2：子代理會話

**情境**：主代理啟動子代理進行深度程式碼審查

**DCP 行為**：
```
使用者輸入："深度審查 src/ 下的所有檔案"
    ↓
[主代理] 檢測到任務複雜，啟動子代理
    ↓
[子代理] 讀取 src/utils.ts
    ↓
[子代理] 讀取 src/helpers.ts
    ↓
[子代理] 讀取 src/config.ts
    ↓
[子代理] 讀取更多檔案...
    ↓
DCP 檢測到子代理會話
    ↓
DCP 跳過所有修剪操作 ❌
    ↓
[子代理] 生成詳細的審查結果
    ↓
[子代理] 返回簡潔摘要給主代理
    ↓
[主代理] 基於摘要生成最終回覆
```

## 常見問題

### Q: 如何確認目前會話是子代理？

**A**: 你可以通過以下方式確認：

 1. **查看 DCP 日誌**（如果啟用 debug 模式）：
   ```
   2026-01-23T10:30:45.123Z INFO state: session ID = abc-123
   2026-01-23T10:30:45.124Z INFO state: isSubAgent = true
   ```

 2. **觀察對話特徵**：
    - 子代理通常在處理複雜任務時啟動（如深度分析、程式碼審查）
    - 主代理會提示"正在啟動子代理"或類似訊息

 3. **使用 /dcp stats 命令**：
    - 子代理會話中，工具呼叫不會被修剪
    - Token 統計中"已修剪"數量為 0

### Q: 子代理中完全不修剪，會不會很浪費 Token？

**A**: 不會。原因如下：

1. **子代理是短命的**：子代理完成任務後就結束，不像主代理那樣進行長對話
2. **子代理返回摘要**：最終傳給主代理的是簡潔摘要，不會增加主代理的上下文負擔
3. **設計目標不同**：子代理的目的是「用 Token 換品質」，而不是「省 Token」

### Q: 能否強制 DCP 修剪子代理？

**A**: **不能，也不應該**。DCP 的設計就是為了讓子代理能夠完整保留上下文，以便生成高品質的摘要。如果強制修剪，可能會：

- 導致摘要資訊不完整
- 影響主代理的決策品質
- 違背 OpenCode 的子代理設計理念

### Q: 子代理會話中的 Token 使用會被統計嗎？

**A**: 子代理會話本身不會被 DCP 統計。DCP 的統計只追蹤主代理會話中的 Token 節省。

## 本課小結

- **子代理檢測**：DCP 通過檢查 `session.parentID` 來識別子代理會話
- **自動停用**：在子代理會話中，DCP 會自動跳過所有修剪功能
- **設計原因**：子代理需要完整上下文來生成高品質摘要，修剪會干擾這個過程
- **使用邊界**：子代理不追求 Token 效率，而是追求資訊品質，這與主代理的目標不同

## 下一課預告

> 下一課我們學習 **[常見問題與排錯](/zh-tw/Opencode-DCP/opencode-dynamic-context-pruning/faq/troubleshooting/)**。
>
> 你會學到：
> - 配置錯誤如何修復
> - 如何啟用偵錯日誌
> - Token 沒有減少的常見原因
> - 子代理會話的限制

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能           | 檔案路徑                                                                                                              | 行號    |
|--- | --- | ---|
| 子代理檢測函式 | [`lib/state/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/utils.ts)         | 1-8     |
| 會話狀態初始化 | [`lib/state/state.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/state.ts)         | 80-116   |
| 系統提示詞處理器（跳過子代理） | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 26-28    |
| 訊息轉換處理器（跳過子代理） | [`lib/hooks.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/hooks.ts)         | 64-66    |
| SessionState 型別定義 | [`lib/state/types.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/state/types.ts)         | 27-38    |

**關鍵函式**：
- `isSubAgentSession()`：通過 `session.parentID` 檢測子代理
- `ensureSessionInitialized()`：初始化會話狀態時檢測子代理
- `createSystemPromptHandler()`：子代理會話跳過系統提示詞注入
- `createChatMessageTransformHandler()`：子代理會話跳過所有修剪操作

**關鍵常數**：
- `state.isSubAgent`：會話狀態中的子代理標誌

</details>
