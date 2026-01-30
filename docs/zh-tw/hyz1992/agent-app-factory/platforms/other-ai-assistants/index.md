---
title: "OpenCode 與其他 AI 助手：運行流水線的 3 種方式 | Agent App Factory 教程"
sidebarTitle: "3 種運行方式"
subtitle: "OpenCode 與其他 AI 助手：運行流水線的 3 種方式"
description: "學習如何使用 OpenCode、Cursor 等 AI 助手運行 Agent App Factory 流水線。本教學詳細介紹不同 AI 助手的自動啟動與手動啟動方式、指令格式差異、適用場景以及常見問題的排查方法，幫助開發者根據個人使用習慣和專案需求選擇最合適的 AI 助手，高效快速完成應用生成全流程。"
tags:
  - "AI 助手"
  - "OpenCode"
  - "Cursor"
  - "流水線執行"
prerequisite:
  - "start-installation"
order: 60
---

# OpenCode 與其他 AI 助手：運行流水線的 3 種方式

## 學完你能做什麼

- ✅ 使用 OpenCode 啟動和運行 Factory 流水線
- ✅ 使用 Cursor 運行流水線
- ✅ 理解不同 AI 助手的指令格式差異
- ✅ 根據使用場景選擇合適的 AI 助手

## 你現在的困境

你已經初始化了 Factory 專案，但除了 Claude Code，不知道如何用其他 AI 助手運行流水線。OpenCode 和 Cursor 是主流的 AI 程式設計助手，它們能運行 Factory 流水線嗎？啟動方式和指令格式有什麼不同？

## 什麼時候用這一招

| AI 助手   | 推薦使用場景                          | 優勢                     |
| ---------- | ------------------------------------- | ------------------------ |
| **Claude Code** | 需要最穩定的 Agent 模式體驗        | 原生支援 Agent 模式，指令格式清晰 |
| **OpenCode**  | 多平台用戶，需要靈活的 AI 工具       | 跨平台，支援 Agent 模式     |
| **Cursor**    | VS Code 重度用戶，習慣 VS Code 生態  | 整合度高，無縫切換       |

::: tip 核心原則
所有 AI 助手的執行邏輯完全相同：**讀取 Agent 定義 → 執行流水線 → 生成產物**。差異僅在於啟動方式和指令格式。
:::

## 🎒 開始前的準備

在開始之前，請確保：

- ✅ 已完成 [安裝與配置](../../start/installation/)
- ✅ 已使用 `factory init` 初始化專案
- ✅ 已安裝 OpenCode 或 Cursor（至少一個）

## 核心思路：AI 助手作為流水線執行引擎

**AI 助手**是流水線的執行引擎，負責解讀 Agent 定義並生成產物。核心工作流程包括五個步驟：首先讀取 `.factory/pipeline.yaml` 了解階段順序，然後載入調度器掌握執行約束和權限檢查規則，接著根據當前狀態載入對應的 Agent 定義檔案，之後執行 Agent 指令生成產物並驗證退出條件，最後等待用戶確認後繼續下一階段。

::: info 重要：AI 助手必須支援 Agent 模式
Factory 流水線依賴於 AI 助手能夠理解並執行複雜的 Markdown 指令。所有支援的 AI 助手（Claude Code、OpenCode、Cursor）都具備 Agent 模式能力。
:::

## 跟我做

### 第 1 步：使用 OpenCode 運行流水線

#### 自動啟動（推薦）

如果你已經全域安裝了 OpenCode CLI：

```bash
# 在專案根目錄執行
factory init
```

`factory init` 會自動偵測並啟動 OpenCode，傳遞以下提示詞：

```text
請閱讀.factory/pipeline.yaml和.factory/agents/orchestrator.checkpoint.md，啟動流水線，幫我將產品想法碎片轉化為可運行的應用，接下來我將會輸入想法碎片。注意：Agent引用的skills/和policies/檔案需要先查找.factory/目錄，再查找根目錄。
```

**你應該看到**：
- 終端顯示 `Starting OpenCode...`
- OpenCode 視窗自動開啟
- 提示詞已經自動貼上到輸入框

#### 手動啟動

如果自動啟動失敗，可以手動操作：

1. 開啟 OpenCode 應用
2. 開啟你的 Factory 專案目錄
3. 複製以下提示詞到 OpenCode 輸入框：

```text
請閱讀.factory/pipeline.yaml和.factory/agents/orchestrator.checkpoint.md，啟動流水線，幫我將產品想法碎片轉化為可運行的應用，接下來我將會輸入想法碎片。注意：Agent引用的skills/和policies/檔案需要先查找.factory/目錄，再查找根目錄。
```

4. 按下 Enter 執行

#### 繼續執行流水線

如果流水線已運行到某個階段，你可以使用 `factory run` 指令繼續：

```bash
# 查看當前狀態並生成指令
factory run

# 或從指定階段開始
factory run prd
```

OpenCode 會顯示與 Claude Code 類似的指令：

```
🤖 AI Assistant Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Please:

1. Read .factory/pipeline.yaml
2. Read .factory/agents/orchestrator.checkpoint.md
3. Read .factory/config.yaml
4. Execute pipeline from: bootstrap

Note: Check .factory/ first for skills/policies/ references, then root directory.
```

### 第 2 步：使用 Cursor 運行流水線

Cursor 是基於 VS Code 的 AI 程式設計助手，使用 Composer 功能運行 Factory 流水線。

#### 偵測 Cursor

Factory CLI 會自動偵測 Cursor 環境（透過 `CURSOR` 或 `CURSOR_API_KEY` 環境變數）。

#### 使用 Composer 運行

1. 在 Cursor 中開啟你的 Factory 專案目錄
2. 執行 `factory run` 指令：

```bash
factory run
```

3. 終端會顯示 Cursor 專用指令：

```
🤖 Cursor Instructions:
──────────────────────────────────────────

This is an Agent Factory project. Use Cursor Composer to:

1. @ReadFile .factory/pipeline.yaml
2. @ReadFile .factory/agents/orchestrator.checkpoint.md
3. @ReadFile .factory/config.yaml
   (Note: Check .factory/ first for skills/policies/ references)
4. Execute pipeline from: bootstrap
```

4. 複製這些指令到 Cursor Composer 輸入框
5. 執行

#### 檢查點 ✅

- Cursor Composer 視窗已開啟
- 流水線開始執行，顯示當前階段（如 `Running: bootstrap`）
- 生成產物（如 `input/idea.md`）

### 第 3 步：理解不同 AI 助手的指令格式

雖然執行邏輯相同，但不同 AI 助手的指令格式有細微差異：

| 操作               | Claude Code 格式         | Cursor 格式               | 其他 AI 助手（OpenCode 等） |
| ------------------ | ----------------------- | ------------------------- | -------------------------- |
| 讀取檔案           | `Read(filePath)`        | `@ReadFile filePath`       | `Read filePath`             |
| 讀取多個檔案       | `Read(file1)`, `Read(file2)` | `@ReadFile file1`, `@ReadFile file2` | -                 |
| 寫入檔案           | `Write(filePath, content)` | 直接寫入                  | -                       |
| 執行 Bash 指令     | `Bash(command)`          | 直接執行                  | -                       |

::: tip Factory CLI 自動處理
當你執行 `factory run` 時，CLI 會自動偵測當前 AI 助手類型，並生成對應的指令格式。你只需要複製貼上即可，無需手動轉換。
:::

### 第 4 步：從指定階段繼續執行

如果流水線已經完成前幾個階段，你可以從任意階段繼續：

```bash
# 從 UI 階段開始
factory run ui

# 從 Tech 階段開始
factory run tech

# 從 Code 階段開始
factory run code
```

Factory CLI 會顯示當前流水線狀態：

```
Pipeline Status:
────────────────────────
Project: my-app
Status: Running
Current Stage: ui
Completed: bootstrap, prd

Available stages:
  ✓ bootstrap
  ✓ prd
  → ui
  ○ tech
  ○ code
  ○ validation
  ○ preview
```

### 第 5 步：使用 factory continue 節省 Token（僅限 Claude Code）

::: warning 注意
`factory continue` 指令目前僅支援 **Claude Code**。如果你使用 OpenCode 或 Cursor，請直接使用 `factory run` 手動啟動新會話。
:::

為了節省 Token 並避免上下文累積，Claude Code 支援分會話執行：

```bash
# 新開終端視窗，執行
factory continue
```

**執行效果**：
- 讀取當前狀態（`.factory/state.json`）
- 自動啟動新的 Claude Code 視窗
- 從上次暫停的階段繼續

**適用場景**：
- 已完成 Bootstrap → PRD，想新建會話執行 UI 階段
- 已完成 UI → Tech，想新建會話執行 Code 階段
- 任何需要避免長對話歷史的場景

## 踩坑提醒

### 問題 1：OpenCode 啟動失敗

**症狀**：執行 `factory init` 後，OpenCode 沒有自動啟動。

**原因**：
- OpenCode CLI 未新增到 PATH
- OpenCode 未安裝

**解決方案**：

```bash
# 手動啟動 OpenCode
# Windows
%LOCALAPPDATA%\Programs\OpenCode\OpenCode.exe

# macOS
/Applications/OpenCode.app

# Linux（按優先級查找：先 /usr/bin/opencode，再 /usr/local/bin/opencode）
/usr/bin/opencode
# 如果上述路徑不存在，嘗試：
/usr/local/bin/opencode
```

然後手動複製提示詞貼上到 OpenCode。

### 問題 2：Cursor Composer 無法識別指令

**症狀**：複製 `factory run` 生成的指令到 Cursor Composer，但沒有回應。

**原因**：
- Cursor Composer 的 `@ReadFile` 語法需要精確匹配
- 檔案路徑可能不正確

**解決方案**：
1. 確認使用 `@ReadFile` 而非 `Read` 或 `ReadFile`
2. 確認檔案路徑相對於專案根目錄
3. 嘗試使用絕對路徑

**示例**：

```text
# ✅ 正確
@ReadFile .factory/pipeline.yaml

# ❌ 錯誤
Read(.factory/pipeline.yaml)
@readfile .factory/pipeline.yaml
```

### 問題 3：Agent 引用技能檔案失敗

**症狀**：Agent 報錯找不到 `skills/bootstrap/skill.md` 或 `policies/failure.policy.md`。

**原因**：
- Agent 查找路徑順序錯誤
- 專案中同時存在 `.factory/` 和根目錄的 `skills/`、`policies/`

**解決方案**：
所有 AI 助手都遵循相同的查找順序：

1. **優先查找** `.factory/skills/` 和 `.factory/policies/`
2. **回退到根目錄** `skills/` 和 `policies/`

確保：
- Factory 專案初始化後，`skills/` 和 `policies/` 已複製到 `.factory/`
- Agent 定義中明確提示："先查找 `.factory/` 目錄，再查找根目錄"

### 問題 4：流水線狀態不同步

**症狀**：AI 助手顯示已完成某個階段，但 `factory run` 仍顯示 `running` 狀態。

**原因**：
- AI 助手手動更新了 `state.json`，但與 CLI 狀態不一致
- 可能是多個視窗同時修改了狀態檔案

**解決方案**：
```bash
# 重置專案狀態
factory reset

# 重新運行流水線
factory run
```

::: warning 最佳實踐
避免在多個 AI 助手視窗中同時運行同一專案的流水線。這會導致狀態衝突和產物覆蓋。
:::

## 本課小結

本課學習了如何使用 OpenCode、Cursor 等 AI 助手運行 Factory 流水線：

**核心要點**：
- ✅ Factory 支援多種 AI 助手（Claude Code、OpenCode、Cursor）
- ✅ `factory init` 自動偵測並啟動可用的 AI 助手
- ✅ `factory run` 根據當前 AI 助手生成對應指令
- ✅ `factory continue`（僅限 Claude Code）支援分會話執行，節省 Token
- ✅ 所有 AI 助手遵循相同的執行邏輯，僅指令格式不同

**關鍵檔案**：
- `.factory/pipeline.yaml` —— 流水線定義
- `.factory/agents/orchestrator.checkpoint.md` —— 調度器規則
- `.factory/state.json` —— 流水線狀態

**選擇建議**：
- Claude Code：最穩定的 Agent 模式體驗（推薦）
- OpenCode：跨平台用戶首選
- Cursor：VS Code 重度用戶

## 下一課預告

> 下一課我們學習 **[必需外掛安裝](../plugins/)**。
>
> 你會學到：
> - 為什麼需要安裝 superpowers 和 ui-ux-pro-max 外掛
> - 如何自動或手動安裝外掛
> - 外掛安裝失敗時的處理方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-29

| 功能              | 檔案路徑                                                                                     | 行號    |
| ----------------- | -------------------------------------------------------------------------------------------- | ------- |
| OpenCode 啟動     | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| Claude Code 啟動   | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| AI 助手偵測     | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L105-L124)     | 105-124 |
| 指令生成         | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js#L130-L183)     | 130-183 |

**關鍵常數**：
- `CLAUDE_CODE` / `ANTHROPIC_API_KEY`：Claude Code 環境變數偵測（run.js:109-110）
- `CURSOR` / `CURSOR_API_KEY`：Cursor 環境變數偵測（run.js:114-115）
- `OPENCODE` / `OPENCODE_VERSION`：OpenCode 環境變數偵測（run.js:119-120）

**關鍵函數**：
- `launchClaudeCode(projectDir)`：啟動 Claude Code 並傳遞提示詞（init.js:119-147）
- `launchOpenCode(projectDir)`：啟動 OpenCode，支援 CLI 和可執行檔案兩種方式（init.js:152-215）
- `detectAIAssistant()`：透過環境變數偵測當前 AI 助手類型（run.js:105-124）
- `getAssistantInstructions(assistant, ...)`：根據 AI 助手類型生成對應指令（run.js:130-183）

</details>
