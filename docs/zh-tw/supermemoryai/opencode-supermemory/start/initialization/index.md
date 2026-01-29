---
title: "專案初始化: 建立 Agent 長期記憶 | opencode-supermemory"
sidebarTitle: "專案初始化"
subtitle: "專案初始化：建立第一印象"
description: "學習如何使用 /supermemory-init 指令讓 Agent 深度掃描程式碼庫，自動提取架構和規範並存入持久記憶，實現跨會話的上下文保持。"
tags:
  - "初始化"
  - "記憶生成"
  - "工作流程"
prerequisite:
  - "start-getting-started"
order: 2
---

# 專案初始化：建立第一印象

## 學完你能做什麼

- **一鍵熟悉專案**：讓 Agent 像新入職員工一樣，主動探索並理解整個程式碼庫。
- **建立長期記憶**：自動提取專案的技術堆疊、架構模式和編碼規範，存入 Supermemory。
- **消除重複解釋**：再也不用在每次會話開始時重複「我們用的是 Bun」或「所有元件都要寫測試」。

## 你現在的困境

你是否遇到過這些情況：

- **重複勞動**：每次開啟新會話，都要花大量篇幅告訴 Agent 專案的基本情況。
- **上下文遺忘**：Agent 經常忘記專案特定的目錄結構，把檔案建錯位置。
- **規範不統一**：Agent 寫的程式碼風格飄忽不定，一會兒用 `interface` 一會兒用 `type`。

## 什麼時候用這一招

- **剛安裝外掛後**：這是使用 opencode-supermemory 的第一步。
- **接手新專案時**：快速建立該專案的記憶庫。
- **重大重構後**：當專案架構發生變化，需要更新 Agent 的認知時。

## 🎒 開始前的準備

::: warning 前置檢查
請確保你已經完成了 [快速開始](./../getting-started/index.md) 中的安裝和配置步驟，並且 `SUPERMEMORY_API_KEY` 已正確設定。
:::

## 核心思路

`/supermemory-init` 指令本質上不是一個二進制程序，而是一個**精心設計的 Prompt**（提示詞）。

當你執行這個指令時，它會向 Agent 發送一份詳細的「入職指南」，指示 Agent：

1.  **深度調研**：主動閱讀 `README.md`、`package.json`、Git 提交記錄等。
2.  **結構化分析**：識別專案的技術堆疊、架構模式、隱式約定。
3.  **持久化儲存**：使用 `supermemory` 工具將這些洞察存入雲端資料庫。

::: info 記憶作用域
初始化過程會區分兩種記憶：
- **Project Scope**：僅對當前專案生效（如：建置指令、目錄結構）。
- **User Scope**：對你所有專案生效（如：你偏好的程式碼風格）。
:::

## 跟我做

### 第 1 步：執行初始化指令

在 OpenCode 的輸入框中，輸入以下指令並發送：

```bash
/supermemory-init
```

**為什麼**
這會載入預定義的 Prompt，啟動 Agent 的探索模式。

**你應該看到**
Agent 開始回覆，表示它理解了任務，並開始規劃調研步驟。它可能會說："I will start by exploring the codebase structure and configuration files..."

### 第 2 步：觀察 Agent 的探索過程

Agent 會自動執行一系列操作，你只需要看著就行。它通常會：

1.  **讀取配置檔案**：讀取 `package.json`、`tsconfig.json` 等了解技術堆疊。
2.  **查看 Git 歷史**：執行 `git log` 了解提交規範和活躍貢獻者。
3.  **探索目錄結構**：使用 `ls` 或 `list_files` 查看專案佈局。

**範例輸出**：
```
[Agent] Reading package.json to identify dependencies...
[Agent] Running git log to understand commit conventions...
```

::: tip 消耗提示
這個過程是一次深度調研，可能會消耗較多的 Token（通常會進行 50+ 次工具呼叫）。請耐心等待，直到 Agent 報告完成。
:::

### 第 3 步：驗證生成的記憶

當 Agent 提示初始化完成後，你可以檢查一下它到底記住了什麼。輸入：

```bash
/ask 列出當前專案的記憶
```

或者直接呼叫工具（如果你想看原始資料）：

```
supermemory(mode: "list", scope: "project")
```

**你應該看到**
Agent 列出了一系列結構化的記憶，例如：

| 類型 | 內容範例 |
| :--- | :--- |
| `project-config` | "Uses Bun runtime. Build command: bun run build" |
| `architecture` | "API routes are located in src/routes/, using Hono framework" |
| `preference` | "Strict TypeScript usage: no 'any' type allowed" |

### 第 4 步：補充遺漏（可選）

如果 Agent 漏掉了某些關鍵資訊（比如某個只有口頭約定的特殊規則），你可以手動補充：

```
請記住：在這個專案中，所有的日期處理必須使用 dayjs 函式庫，禁止使用原生 Date。
```

**你應該看到**
Agent 回覆確認，並呼叫 `supermemory(mode: "add")` 儲存這條新規則。

## 檢查點 ✅

- [ ] 執行 `/supermemory-init` 後，Agent 是否自動執行了探索任務？
- [ ] 使用 `list` 指令是否能查看到新生成的記憶？
- [ ] 記憶內容是否準確反映了當前專案的實際情況？

## 踩坑提醒

::: warning 不要頻繁執行
初始化是一個耗時且消耗 Token 的過程。通常每個專案只需要執行一次。只有在專案發生巨大變化時才需要重新執行。
:::

::: danger 隱私注意
雖然外掛會自動脫敏 `<private>` 標籤的內容，但在初始化過程中，Agent 會讀取大量檔案。請確保你的程式碼庫中沒有硬編碼的敏感金鑰（如 AWS Secret Key），否則它們可能會被作為「專案配置」存入記憶。
:::

## 本課小結

透過 `/supermemory-init`，我們完成了從「陌生人」到「熟練工」的轉變。現在，Agent 已經記住了專案的核心架構和規範，在接下來的編碼任務中，它將自動利用這些上下文，為你提供更精準的輔助。

## 下一課預告

> 下一課我們學習 **[自動上下文注入機制](./../../core/context-injection/index.md)**。
>
> 你會學到：
> - Agent 是如何在會話開始時「想起」這些記憶的。
> - 如何透過關鍵詞觸發特定的記憶召回。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| :--- | :--- | :--- |
| 初始化 Prompt 定義 | [`src/cli.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/cli.ts#L13-L163) | 13-163 |
| 記憶工具實作 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |

**關鍵常數**：
- `SUPERMEMORY_INIT_COMMAND`：定義了 `/supermemory-init` 指令的具體 Prompt 內容，指導 Agent 如何進行調研和記憶。

</details>
