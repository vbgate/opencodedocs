---
title: "記憶管理: User 與 Project 作用域 | opencode-supermemory"
sidebarTitle: "記憶作用域"
subtitle: "記憶作用域與生命週期：管理你的數位大腦"
description: "深入理解 opencode-supermemory 的 User 與 Project 作用域，掌握記憶的增刪改查（CRUD）操作，實現跨專案經驗復用與專案隔離。"
tags:
  - "memory-management"
  - "scope"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# 記憶作用域與生命週期：管理你的數位大腦

## 學完你能做什麼

- **區分作用域**：明白哪些記憶是「跟著你走的」（跨專案），哪些是「跟著專案走的」（專案專用）。
- **管理記憶**：學會手動查看、新增和刪除記憶，保持 Agent 認知的整潔。
- **除錯 Agent**：當 Agent 「記錯」東西時，知道去哪裡修正。

## 核心思路

opencode-supermemory 將記憶分為兩個隔離的**作用域 (Scope)**，類似於程式設計語言中的全域變數和區域變數。

### 1. 兩種作用域

| 作用域 | 識別符 (Scope ID) | 生命週期 | 典型用途 |
| :--- | :--- | :--- | :--- |
| **User Scope**<br>(使用者作用域) | `user` | **永久跟隨你**<br>跨所有專案共享 | • 編碼風格偏好 (如 "喜歡 TypeScript")<br>• 個人習慣 (如 "總是寫註解")<br>• 通用知識 |
| **Project Scope**<br>(專案作用域) | `project` | **僅限當前專案**<br>切換目錄即失效 | • 專案架構設計<br>• 業務邏輯說明<br>• 特定 Bug 的修復方案 |

::: info 作用域是如何生成的？
外掛透過 `src/services/tags.ts` 自動生成唯一標籤：
- **User Scope**: 基於你的 Git 郵箱雜湊 (`opencode_user_{hash}`)。
- **Project Scope**: 基於當前專案路徑雜湊 (`opencode_project_{hash}`)。
:::

### 2. 記憶的生命週期

1.  **建立 (Add)**: 透過 CLI 初始化或 Agent 對話 (`Remember this...`) 寫入。
2.  **啟用 (Inject)**: 每次開啟新會話時，外掛會自動拉取相關的 User 和 Project 記憶注入上下文。
3.  **檢索 (Search)**: Agent 在對話過程中可以主動搜尋特定記憶。
4.  **遺忘 (Forget)**: 當記憶過時或錯誤時，透過 ID 刪除。

---

## 跟我做：管理你的記憶

我們將透過與 Agent 對話，手動管理這兩個作用域的記憶。

### 第 1 步：查看現有記憶

首先，看看 Agent 現在記住了什麼。

**操作**：在 OpenCode 聊天框中輸入：

```text
請列出當前專案的所有記憶 (List memories in project scope)
```

**你應該看到**：
Agent 呼叫 `supermemory` 工具的 `list` 模式，並回傳一個列表：

```json
// 範例輸出
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "專案使用 MVC 架構，Service 層負責業務邏輯",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### 第 2 步：新增跨專案記憶 (User Scope)

假設你希望 Agent 在**所有**專案中都使用中文回覆。這是一條適合 User Scope 的記憶。

**操作**：輸入以下指令：

```text
請記住我的個人偏好：無論在哪個專案，都請始終用中文回覆我。
請將其儲存到 User Scope。
```

**你應該看到**：
Agent 呼叫 `add` 工具，參數 `scope: "user"`：

```json
{
  "mode": "add",
  "content": "User prefers responses in Chinese across all projects",
  "scope": "user",
  "type": "preference"
}
```

系統確認記憶已新增，並回傳一個 `id`。

### 第 3 步：新增專案專用記憶 (Project Scope)

現在，我們為**當前專案**新增一條特定規則。

**操作**：輸入以下指令：

```text
請記住：在這個專案中，所有的日期格式必須是 YYYY-MM-DD。
儲存到 Project Scope。
```

**你應該看到**：
Agent 呼叫 `add` 工具，參數 `scope: "project"`（這是預設值，Agent 可能省略）：

```json
{
  "mode": "add",
  "content": "Date format must be YYYY-MM-DD in this project",
  "scope": "project",
  "type": "project-config"
}
```

### 第 4 步：驗證隔離性

為了驗證作用域是否生效，我們可以嘗試搜尋。

**操作**：輸入：

```text
搜尋關於「日期格式」的記憶
```

**你應該看到**：
Agent 呼叫 `search` 工具。如果它指定了 `scope: "project"` 或進行混合搜尋，應該能找到剛才那條記憶。

::: tip 驗證跨專案能力
如果你新建一個終端機視窗，進入另一個不同的專案目錄，再次詢問「日期格式」，Agent 應該**找不到**這條記憶（因為它被隔離在原專案的 Project Scope 中）。但如果你問「我希望用什麼語言回覆」，它應該能從 User Scope 找回「中文回覆」的偏好。
:::

### 第 5 步：刪除過時記憶

如果專案規範變了，我們需要刪除舊記憶。

**操作**：
1. 先執行 **第 1 步** 取得記憶 ID（例如 `mem_987654`）。
2. 輸入指令：

```text
請忘記 ID 為 mem_987654 的那條關於日期格式的記憶。
```

**你應該看到**：
Agent 呼叫 `forget` 工具：

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

系統回傳 `success: true`。

---

## 常見問題 (FAQ)

### Q: 如果我換了電腦，User Scope 的記憶還在嗎？
**A: 取決於你的 Git 配置。**
User Scope 是基於 `git config user.email` 生成的。如果你在兩台電腦上使用相同的 Git 郵箱，並且連接到同一個 Supermemory 帳號（使用相同的 API Key），那麼記憶是**同步**的。

### Q: 為什麼我看不到剛才新增的記憶？
**A: 可能是快取或索引延遲。**
Supermemory 的向量索引通常是秒級的，但在網路波動時可能有短暫延遲。此外，Agent 在會話開始時注入的上下文是**靜態**的（快照），新增的記憶可能需要重新啟動會話（`/clear` 或重新啟動 OpenCode）才能在「自動注入」中生效，但透過 `search` 工具可以立即查到。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| :--- | :--- | :--- |
| Scope 生成邏輯 | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| 記憶工具定義 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| 記憶類型定義 | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| 客戶端實作 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**關鍵函數**：
- `getUserTag()`: 基於 Git 郵箱產生使用者標籤
- `getProjectTag()`: 基於目錄路徑產生專案標籤
- `supermemoryClient.addMemory()`: 新增記憶 API 呼叫
- `supermemoryClient.deleteMemory()`: 刪除記憶 API 呼叫

</details>

## 下一課預告

> 下一課我們學習 **[搶佔式壓縮原理](../../advanced/compaction/index.md)**。
>
> 你會學到：
> - 為什麼 Agent 會「失憶」（上下文溢出）
> - 外掛如何自動偵測 Token 使用率
> - 如何在不丟失關鍵資訊的前提下壓縮會話
