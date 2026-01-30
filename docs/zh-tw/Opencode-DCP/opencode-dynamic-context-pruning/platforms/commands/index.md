---
title: "命令：監控與修剪 | opencode-dynamic-context-pruning"
sidebarTitle: "監控 Token、手動修剪"
subtitle: "DCP 命令使用指南：監控與手動修剪"
description: "學習使用 DCP 的 4 個命令監控和手動修剪。教你 /dcp context 查看對話，/dcp stats 查看統計，/dcp sweep 手動觸發修剪。"
tags:
  - "DCP 命令"
  - "Token 監控"
  - "手動修剪"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
order: 3
---

# DCP 命令使用指南：監控與手動修剪

## 學完你能做什麼

- 使用 `/dcp context` 查看目前對話的 Token 使用分佈
- 使用 `/dcp stats` 查看累計修剪統計
- 使用 `/dcp sweep [n]` 手動觸發修剪
- 理解受保護工具和檔案的保護機制
- 了解 Token 計算策略和節省效果

## 你現在的困境

長對話中，Token 消耗越來越快，但你不知道：
- 目前對話的 Token 都花在哪了？
- DCP 究竟幫你省了多少？
- 怎麼手動清理那些不再需要的工具輸出？
- 哪些工具會被保護，不會被修剪？

這些問題不搞清楚，你可能無法充分利用 DCP 的最佳化效果，甚至可能在關鍵時刻誤刪重要資訊。

## 什麼時候用這一招

當你：
- 想了解目前對話的 Token 構成
- 需要快速清理對話歷史
- 想驗證 DCP 的修剪效果
- 準備開始新的任務前做一次上下文清理

## 核心思路

DCP 提供了 4 個 Slash 命令，幫助你監控和控制 Token 使用：

| 命令 | 用途 | 適用情境 |
| --- | --- | --- |
| `/dcp` | 顯示說明 | 忘記命令時查看 |
| `/dcp context` | 分析目前對話 Token 分佈 | 了解上下文構成 |
| `/dcp stats` | 查看累計修剪統計 | 驗證長期效果 |
| `/dcp sweep [n]` | 手動修剪工具 | 快速減少上下文大小 |

**受保護機制**：

所有修剪操作都會自動跳過：
- **受保護工具**：`task`、`todowrite`、`todoread`、`discard`、`extract`、`batch`、`write`、`edit`、`plan_enter`、`plan_exit`
- **受保護檔案**：符合設定中的 `protectedFilePatterns` 的檔案路徑

::: info
受保護工具和受保護檔案的設定可以透過設定檔自訂。詳見[設定全解](../../start/configuration/)。
:::

## 跟我做

### 第 1 步：查看說明資訊

在 OpenCode 對話框中輸入 `/dcp`。

**你應該看到**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Commands                         │
╰───────────────────────────────────────────────────────────╯

  /dcp context      Show token usage breakdown for current session
  /dcp stats        Show DCP pruning statistics
  /dcp sweep [n]    Prune tools since last user message, or last n tools
```

**檢查點 ✅**：確認看到了 3 個子命令的說明。

### 第 2 步：分析目前對話 Token 分佈

輸入 `/dcp context` 查看目前對話的 Token 使用情況。

**你應該看到**：

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
────────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

────────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**Token 分類說明**：

| 分類 | 計算方式 | 說明 |
| --- | --- | --- |
| **System** | `firstAssistant.input + cache.read - tokenizer(firstUserMessage)` | 系統提示詞 |
| **Tools** | `tokenizer(toolInputs + toolOutputs) - prunedTokens` | 工具呼叫（已扣除修剪部分） |
| **User** | `tokenizer(all user messages)` | 所有使用者訊息 |
| **Assistant** | `total - system - user - tools` | AI 文字輸出 + 推理 Token |

**檢查點 ✅**：確認看到了各分類的 Token 佔比和數量。

### 第 3 步：查看累計修剪統計

輸入 `/dcp stats` 查看歷史累計的修剪效果。

**你應該看到**：

```
╭───────────────────────────────────────────────────────────╮
│                    DCP Statistics                         │
╰───────────────────────────────────────────────────────────╯

Session:
────────────────────────────────────────────────────────────
  Tokens pruned: ~15.2K
  Tools pruned:   12

All-time:
────────────────────────────────────────────────────────────
  Tokens saved:  ~284.5K
  Tools pruned:   156
  Sessions:       8
```

**統計說明**：
- **Session**：目前對話的修剪資料（記憶體中）
- **All-time**：所有歷史對話的累計資料（磁碟持久化）

**檢查點 ✅**：確認看到了目前對話和歷史累計的修剪統計。

### 第 4 步：手動修剪工具

有兩種方式使用 `/dcp sweep`：

#### 方式一：修剪上一條使用者訊息後的所有工具

輸入 `/dcp sweep`（不帶參數）。

**你應該看到**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept 8 tool(s) since previous user message.
Tokens saved: ~12,345

  • Read: src/config.ts
  • Read: src/utils.ts
  • Bash: npm test
  • Read: package.json
  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
```

#### 方式二：修剪最後 N 個工具

輸入 `/dcp sweep 5` 修剪最後 5 個工具。

**你應該看到**：

```
╭───────────────────────────────────────────────────────────╮
│                      DCP Sweep                            │
╰───────────────────────────────────────────────────────────╯

Swept last 5 tool(s).
Tokens saved: ~7,892

  • Read: src/index.ts
  • Bash: git status
  • Read: README.md
  • Write: docs/tutorial.md
  • Bash: npm run build
```

**受保護工具提示**：

如果跳過了受保護工具，輸出會顯示：

```
Swept 5 tool(s).
Tokens saved: ~7,892
(2 protected tool(s) skipped)
```

::: warning
受保護工具（如 `write`、`edit`）和受保護檔案路徑會被自動跳過，不會被修剪。
:::

**檢查點 ✅**：確認看到了修剪的工具清單和節省的 Token 數量。

### 第 5 步：再次查看修剪效果

修剪後，再次輸入 `/dcp context` 查看新的 Token 分佈。

**你應該看到**：
- `Tools` 分類佔比下降
- `Summary` 中顯示已修剪的工具數增加
- `Current context` 總數減少

**檢查點 ✅**：確認 Token 使用量明顯減少。

## 踩坑提醒

### ❌ 錯誤：誤刪重要工具

**情境**：你剛用 `write` 工具寫了一個關鍵檔案，然後執行 `/dcp sweep`。

**錯誤結果**：`write` 工具被修剪，AI 可能不知道檔案已建立。

**正確做法**：
- `write`、`edit` 等工具預設受保護
- 不要手動修改 `protectedTools` 設定刪除這些工具
- 關鍵任務完成後等待幾個回合再清理

### ❌ 錯誤：修剪時機不當

**情境**：對話剛開始，只有幾個工具呼叫就執行 `/dcp sweep`。

**錯誤結果**：節省的 Token 很少，反而可能影響上下文連貫性。

**正確做法**：
- 等對話進行到一定程度（如 10+ 個工具呼叫）再清理
- 開始新任務前清理上一輪的工具輸出
- 結合 `/dcp context` 判斷是否值得清理

### ❌ 錯誤：過度依賴手動修剪

**情境**：每次對話都手動執行 `/dcp sweep`。

**錯誤結果**：
- 自動修剪策略（去重、覆蓋寫入、清除錯誤）被浪費
- 增加操作負擔

**正確做法**：
- 預設開啟自動修剪策略（設定：`strategies.*.enabled`）
- 手動修剪作為補充，在必要時使用
- 透過 `/dcp stats` 驗證自動修剪效果

## 本課小結

DCP 的 4 個命令幫助你監控和控制 Token 使用：

| 命令 | 核心功能 |
| --- | --- |
| `/dcp` | 顯示說明資訊 |
| `/dcp context` | 分析目前對話 Token 分佈 |
| `/dcp stats` | 查看累計修剪統計 |
| `/dcp sweep [n]` | 手動修剪工具 |

**Token 計算策略**：
- System：系統提示詞（從第一條回應推算）
- Tools：工具輸入輸出（扣除修剪部分）
- User：所有使用者訊息（估算）
- Assistant：AI 輸出 + 推理 Token（殘差）

**受保護機制**：
- 受保護工具：`task`、`todowrite`、`todoread`、`discard`、`extract`、`batch`、`write`、`edit`、`plan_enter`、`plan_exit`
- 受保護檔案：設定的 glob 模式
- 所有修剪操作自動跳過這些內容

**最佳實踐**：
- 定期查看 `/dcp context` 了解 Token 構成
- 新任務前執行 `/dcp sweep` 清理歷史
- 依賴自動修剪，手動修剪作為補充
- 透過 `/dcp stats` 驗證長期效果

## 下一課預告

> 下一課我們學習 **[保護機制](../../advanced/protection/)**。
>
> 你會學到：
> - 回合保護如何防止誤修剪
> - 如何自訂受保護工具清單
> - 受保護檔案模式的設定方法
> - 子代理對話的特殊處理

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| /dcp 說明命令 | [`lib/commands/help.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/help.ts) | 19-32 |
| /dcp context 命令 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 238-247 |
| Token 計算策略 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 5-38 |
| /dcp stats 命令 | [`lib/commands/stats.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/stats.ts) | 46-67 |
| /dcp sweep 命令 | [`lib/commands/sweep.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/sweep.ts) | 123-259 |
| 受保護工具設定 | [`lib/config.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/config.ts) | 461 |
| 預設受保護工具清單 | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 150-151 |

**關鍵常數**：
- `DEFAULT_PROTECTED_TOOLS`：預設受保護工具清單

**關鍵函式**：
- `handleHelpCommand()`：處理 /dcp 說明命令
- `handleContextCommand()`：處理 /dcp context 命令
- `analyzeTokens()`：計算各類別的 Token 數量
- `handleStatsCommand()`：處理 /dcp stats 命令
- `handleSweepCommand()`：處理 /dcp sweep 命令
- `buildToolIdList()`：建構工具 ID 清單

</details>
