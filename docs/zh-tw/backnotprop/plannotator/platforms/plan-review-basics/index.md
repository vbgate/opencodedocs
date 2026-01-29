---
title: "計畫審查: 視覺化審查 AI 計畫 | Plannotator"
subtitle: "計畫審查基礎：視覺化審查 AI 計畫"
description: "學習 Plannotator 計畫審查功能。使用視覺化介面審查 AI 產生的計畫，新增註解批准或拒絕，掌握 Approve 和 Request Changes 的區別。"
sidebarTitle: "5 分鐘學會審查計畫"
tags:
  - "計畫審查"
  - "視覺化審查"
  - "註解"
  - "批准"
  - "拒絕"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# 計畫審查基礎：視覺化審查 AI 計畫

## 學完你能做什麼

- ✅ 使用 Plannotator 視覺化介面審查 AI 產生的計畫
- ✅ 選取計畫文字，新增不同類型的註解（刪除、取代、評論）
- ✅ 批准計畫，讓 AI 繼續實施
- ✅ 拒絕計畫，將註解作為回饋傳送給 AI
- ✅ 理解註解類型的使用情境和區別

## 你現在的困境

**問題 1**：AI 產生的實施計畫在終端機裡閱讀，文字量大、結構不清晰，審查起來很累。

**問題 2**：想給 AI 回饋時，只能用文字描述「刪除第 3 段」、「修改這個函式」，溝通成本高，AI 也可能理解錯誤。

**問題 3**：計畫中有些地方不需要修改，有些地方需要取代，有些地方需要評論，但沒有工具幫你結構化這些回饋。

**問題 4**：不知道如何讓 AI 知道你批准了計畫，還是需要修改。

**Plannotator 能幫你**：
- 視覺化 UI 取代終端機閱讀，結構清晰
- 選取文字即可新增註解（刪除、取代、評論），精確回饋
- 註解自動轉換為結構化資料，AI 準確理解你的意圖
- 一鍵批准或拒絕，AI 立即回應

## 什麼時候用這一招

**使用情境**：
- AI Agent 完成計畫並呼叫 `ExitPlanMode`（Claude Code）
- AI Agent 呼叫 `submit_plan` 工具（OpenCode）
- 需要審查 AI 產生的實施計畫
- 需要精確回饋計畫的修改意見

**不適用情境**：
- 直接讓 AI 實施程式碼（跳過計畫審查）
- 已經批准計畫，需要審查實際程式碼變更（使用程式碼審查功能）

## 🎒 開始前的準備

**前置條件**：
- ✅ 已安裝 Plannotator CLI（詳見 [快速開始](../start/getting-started/)）
- ✅ 已設定 Claude Code 或 OpenCode 外掛（詳見對應安裝指南）
- ✅ AI Agent 支援計畫審查（Claude Code 2.1.7+，或 OpenCode）

**觸發方式**：
- **Claude Code**：AI 完成 plan 後自動呼叫 `ExitPlanMode`，Plannotator 自動啟動
- **OpenCode**：AI 呼叫 `submit_plan` 工具，Plannotator 自動啟動

## 核心思路

### 計畫審查是什麼

**計畫審查**是 Plannotator 的核心功能，用於視覺化審查 AI 產生的實施計畫。

::: info 為什麼需要計畫審查？
AI 產生計畫後，通常會問「這個計畫可以嗎？」或「是否開始實施？」。如果沒有視覺化工具，你只能在終端機裡閱讀純文字計畫，然後回覆「可以」、「不行，修改 XX」等模糊回饋。Plannotator 讓你用視覺化介面檢視計畫，精確選取需要修改的部分，新增結構化註解，AI 更容易理解你的意圖。
:::

### 運作流程

```
┌─────────────────┐
│  AI Agent      │
│  (產生計畫)    │
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← 瀏覽器自動開啟
│                 │
│ ┌───────────┐  │
│ │ 計畫內容   │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ 選取文字
│       ▼         │
│ ┌───────────┐  │
│ │ 新增註解   │  │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ 決策      │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} 或
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  AI Agent      │
│  (繼續實施)    │
└─────────────────┘
```

### 註解類型

Plannotator 支援四種註解類型，每種都有不同的用途：

| 註解類型 | 用途 | AI 收到的回饋 |
|--- | --- | ---|
| **Delete** | 刪除不需要的內容 | 「刪除：[選取的文字]」 |
| **Replace** | 取代為更好的內容 | 「取代：[選取的文字] 為 [你輸入的文字]」 |
| **Comment** | 評論某段內容，不要求修改 | 「評論：[選取的文字]。說明：[你輸入的評論]」 |
| **Global Comment** | 全域評論，不關聯具體文字 | 「全域評論：[你輸入的評論]」 |

### Approve vs Request Changes

| 決策類型 | 操作 | AI 收到的回饋 | 適用情境 |
|--- | --- | --- | ---|
| **Approve** | 點擊 Approve 按鈕 | `{"behavior": "allow"}` | 計畫沒問題，直接批准 |
| **Request Changes** | 點擊 Request Changes 按鈕 | `{"behavior": "deny", "message": "..."}` | 有需要修改的地方 |

::: tip Claude Code 和 OpenCode 的差異
- **Claude Code**：Approve 時不會傳送註解（註解會被忽略）
- **OpenCode**：Approve 時可以傳送註解作為備註（可選）

**拒絕計畫時**：無論哪個平台，註解都會傳送給 AI
:::

## 跟我做

### 第 1 步：觸發計畫審查

**Claude Code 範例**：

在 Claude Code 中與 AI 對話，讓 AI 產生一個實施計畫：

```
使用者：幫我寫一個使用者認證模組的實施計畫

Claude：好的，這是實施計畫：
1. 建立使用者模型
2. 實作註冊 API
3. 實作登入 API
...
（AI 呼叫 ExitPlanMode）
```

**OpenCode 範例**：

在 OpenCode 中，AI 會自動呼叫 `submit_plan` 工具。

**你應該看到**：
1. 瀏覽器自動開啟 Plannotator UI
2. 顯示 AI 產生的計畫內容（Markdown 格式）
3. 頁面底部有「Approve」和「Request Changes」按鈕

### 第 2 步：瀏覽計畫內容

在瀏覽器中檢視計畫：

- 計畫以 Markdown 格式渲染，包括標題、段落、清單、程式碼區塊
- 可以捲動檢視整個計畫
- 支援亮/暗模式切換（點擊右上角的主題切換按鈕）

### 第 3 步：選取計畫文字，新增註解

**新增 Delete 註解**：

1. 用滑鼠選取計畫中需要刪除的文字
2. 在彈出的工具列中點擊 **Delete** 按鈕
3. 文字會被標記為刪除樣式（紅色刪除線）

**新增 Replace 註解**：

1. 用滑鼠選取計畫中需要取代的文字
2. 在彈出的工具列中點擊 **Replace** 按鈕
3. 在彈出的輸入框中輸入取代後的內容
4. 按 Enter 或點擊確認
5. 原文字會被標記為取代樣式（黃色背景），並在下方顯示取代內容

**新增 Comment 註解**：

1. 用滑鼠選取計畫中需要評論的文字
2. 在彈出的工具列中點擊 **Comment** 按鈕
3. 在彈出的輸入框中輸入評論內容
4. 按 Enter 或點擊確認
5. 文字會被標記為評論樣式（藍色醒目提示），並在側邊欄顯示評論

**新增 Global Comment**：

1. 點擊頁面右上角的 **Add Global Comment** 按鈕
2. 在彈出的輸入框中輸入全域評論內容
3. 按 Enter 或點擊確認
4. 評論會顯示在側邊欄的「Global Comments」部分

**你應該看到**：
- 選取文字後，會立即彈出工具列（Delete、Replace、Comment）
- 新增註解後，文字會顯示相應的樣式（刪除線、背景色、醒目提示）
- 側邊欄會顯示所有註解清單，可以點擊跳轉到對應位置
- 可以點擊註解旁的 **刪除** 按鈕移除註解

### 第 4 步：批准計畫

**如果計畫沒有問題**：

點擊頁面底部的 **Approve** 按鈕。

**你應該看到**：
- 瀏覽器自動關閉（1.5 秒延遲）
- Claude Code/OpenCode 終端機中顯示計畫已批准
- AI 繼續實施計畫

::: info Approve 的行為
- **Claude Code**：只傳送 `{"behavior": "allow"}`，註解被忽略
- **OpenCode**：傳送 `{"behavior": "allow"}`，註解可以作為備註傳送（可選）
:::

### 第 5 步：拒絕計畫（Request Changes）

**如果計畫需要修改**：

1. 新增必要的註解（Delete、Replace、Comment）
2. 點擊頁面底部的 **Request Changes** 按鈕
3. 瀏覽器會顯示確認對話框

**你應該看到**：
- 確認對話框顯示「Send X annotations to AI?」
- 點擊確認後，瀏覽器自動關閉
- Claude Code/OpenCode 終端機中顯示回饋內容
- AI 會根據回饋修改計畫

::: tip Request Changes 的行為
- **Claude Code** 和 **OpenCode**：都會傳送 `{"behavior": "deny", "message": "..."}`
- 註解會被轉換為結構化的 Markdown 文字
- AI 會根據註解修改計畫並再次呼叫 ExitPlanMode/submit_plan
:::

### 第 6 步：檢視回饋內容（可選）

如果你想檢視 Plannotator 傳送給 AI 的回饋內容，可以在終端機中檢視：

**Claude Code**：
```
Plan rejected by user
Please modify the plan based on the following feedback:

[結構化的註解內容]
```

**OpenCode**：
```
<feedback>
[結構化的註解內容]
</feedback>
```

## 檢查點 ✅

完成以上步驟後，你應該能夠：

- [ ] 在 AI 觸發計畫審查後，瀏覽器自動開啟 Plannotator UI
- [ ] 選取計畫文字，新增 Delete、Replace、Comment 註解
- [ ] 新增 Global Comment
- [ ] 在側邊欄檢視所有註解，並跳轉到對應位置
- [ ] 點擊 Approve，瀏覽器關閉，AI 繼續實施
- [ ] 點擊 Request Changes，瀏覽器關閉，AI 修改計畫

**如果某一步失敗**，詳見：
- [常見問題](../../faq/common-problems/)
- [Claude Code 安裝指南](../../start/installation-claude-code/)
- [OpenCode 安裝指南](../../start/installation-opencode/)

## 踩坑提醒

**常見錯誤 1**：選取文字後，工具列沒有彈出

**原因**：可能是因為選取的是程式碼區塊中的文字，或者選取的文字跨多個元素。

**解決**：
- 儘量選取單個段落或清單項目中的文字
- 對於���式碼區塊，可以使用 Comment 註解，不要跨多行選取

**常見錯誤 2**：新增 Replace 註解後，取代內容沒有顯示

**原因**：取代內容輸入框可能沒有正確提交。

**解決**：
- 輸入取代內容後，按 Enter 鍵或點擊確認按鈕
- 檢查側邊欄中是否顯示了取代內容

**常見錯誤 3**：點擊 Approve 或 Request Changes 後，瀏覽器沒有關閉

**原因**：可能是伺服器錯誤或網路問題。

**解決**：
- 檢查終端機中是否有錯誤訊息
- 手動關閉瀏覽器
- 如果問題持續，詳見 [故障排除](../../faq/troubleshooting/)

**常見錯誤 4**：AI 收到回饋後，沒有按照註解修改

**原因**：AI 可能沒有正確理解註解的意圖。

**解決**：
- 嘗試使用更明確的註解（Replace 比 Comment 更明確）
- 使用 Comment 新增詳細說明
- 如果問題持續，可以再次拒絕計畫，並調整註解內容

**常見錯誤 5**：新增多個 Delete 註解後，AI 只刪除了部分內容

**原因**：多個 Delete 註解之間可能有重疊或衝突。

**解決**：
- 確保每個 Delete 註解的文字範圍不重疊
- 如果需要刪除大段內容，可以選取整個段落一次性刪除

## 本課小結

計畫審查是 Plannotator 的核心功能，讓你可以視覺化審查 AI 產生的計畫：

**核心操作**：
1. **觸發**：AI 呼叫 `ExitPlanMode` 或 `submit_plan`，瀏覽器自動開啟 UI
2. **瀏覽**：在視覺化介面中檢視計畫內容（Markdown 格式）
3. **註解**：選取文字，新增 Delete、Replace、Comment 或 Global Comment
4. **決策**：點擊 Approve（批准）或 Request Changes（拒絕）
5. **回饋**：註解被轉換為結構化資料，AI 根據回饋繼續或修改計畫

**註解類型**：
- **Delete**：刪除不需要的內容
- **Replace**：取代為更好的內容
- **Comment**：評論某段內容，不要求修改
- **Global Comment**：全域評論，不關聯具體文字

**決策類型**：
- **Approve**：計畫沒問題，直接批准（Claude Code 會忽略註解）
- **Request Changes**：有需要修改的地方，註解傳送給 AI

## 下一課預告

> 下一課我們學習 **[新增計畫註解](../plan-review-annotations/)**。
>
> 你會學到：
> - 如何精確使用 Delete、Replace、Comment 註解
> - 如何新增圖像標註
> - 如何編輯和刪除註解
> - 註解的最佳實踐和常見情境

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能              | 檔案路徑                                                                                              | 行號    |
|--- | --- | ---|
| 計畫審查 UI       | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200)          | 1-200   |
| 註解類型定義      | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70)                | 1-70    |
| 計畫審查伺服器     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310)            | 91-310  |
| API: 取得計畫內容  | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134)         | 132-134 |
| API: 批准計畫     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277)         | 201-277 |
| API: 拒絕計畫     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309)         | 280-309 |
| Viewer 元件       | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100)   | 1-100   |
| AnnotationPanel 元件 | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50    |

**關鍵類型**：
- `AnnotationType`：註解類型列舉（DELETION、INSERTION、REPLACEMENT、COMMENT、GLOBAL_COMMENT）（`packages/ui/types.ts:1-7`）
- `Annotation`：註解介面（`packages/ui/types.ts:11-33`）
- `Block`：計畫區塊介面（`packages/ui/types.ts:35-44`）

**關鍵函式**：
- `startPlannotatorServer()`：啟動計畫審查伺服器（`packages/server/index.ts:91`）
- `parseMarkdownToBlocks()`：將 Markdown 解析為 Blocks（`packages/ui/utils/parser.ts`）

**API 路由**：
- `GET /api/plan`：取得計畫內容（`packages/server/index.ts:132`）
- `POST /api/approve`：批准計畫（`packages/server/index.ts:201`）
- `POST /api/deny`：拒絕計畫（`packages/server/index.ts:280`）

**業務規則**：
- Claude Code 批准時不傳送註解（`apps/hook/server/index.ts:132`）
- OpenCode 批准時可傳送註解作為備註（`apps/opencode-plugin/index.ts:270`）
- 拒絕計畫時註解總是傳送（`apps/hook/server/index.ts:154`）

</details>
