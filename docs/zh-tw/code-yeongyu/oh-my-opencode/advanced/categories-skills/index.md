---
title: "Categories 和 Skills：動態代理組合 | oh-my-opencode"
sidebarTitle: "動態代理像搭積木"
subtitle: "Categories 和 Skills：動態代理組合（v3.0）"
description: "學習 oh-my-opencode 的 Categories 和 Skills 系統，掌握如何組合模型和知識創建專業化 AI 子代理。通過內建的 7 個 Categories、4 個 Skills 和 delegate_task 工具，優化開發成本。"
tags:
  - "categories"
  - "skills"
  - "delegate-task"
  - "sisyphus-junior"
prerequisite:
  - "start-quick-start"
order: "100"
---

# Categories 和 Skills：動態代理組合（v3.0）

## 學完你能做什麼

- ✅ 使用 7 個內建 Categories 為不同類型任務自動選擇最優模型
- ✅ 載入 4 個內建 Skills 為代理注入專業知識和 MCP 工具
- ✅ 透過 `delegate_task` 組合 Category 和 Skill，創建專業化子代理
- ✅ 自定義 Category 和 Skill，滿足特定專案需求

## 你現在的困境

**代理不夠專業？成本太高？**

想想這個場景：

| 問題 | 傳統方案 | 實際需求 |
| --- | --- | ---|
| **UI 任務用超強大模型** | 用 Claude Opus 處理簡單樣式調整 | 成本高，浪費算力 |
| **複雜邏輯用輕量模型** | 用 Haiku 處理架構設計 | 推理能力不足，方案錯誤 |
| **Git 提交風格不統一** | 手動管理 commit，容易出錯 | 需要自動檢測並遵循專案規範 |
| **需要瀏覽器測試** | 手動打開瀏覽器驗證 | 需要 Playwright MCP 工具支援 |

**核心問題**：
1. 所有任務用一個代理處理 → 模型和工具不匹配
2. 硬編碼 10 個固定代理 → 無法靈活組合
3. 專業技能缺失 → 代理缺乏特定領域知識

**解決**：v3.0 的 Categories 和 Skills 系統，讓你像搭積木一樣組合代理：
- **Category**（模型抽象）：定義任務類型 → 自動選擇最優模型
- **Skill**（專業知識）：注入領域知識和 MCP 工具 → 讓代理更專業

## 什麼時候用這一招

| 場景 | 推薦組合 | 效果 |
| --- | --- | ---|
| **UI 設計和實現** | `category="visual-engineering"` + `skills=["frontend-ui-ux", "playwright"]` | 自動選擇 Gemini 3 Pro + 設計師思維 + 瀏覽器驗證 |
| **快速修復和提交** | `category="quick"` + `skills=["git-master"]` | 用 Haiku 低成本完成 + 自動檢測提交風格 |
| **深度架構分析** | `category="ultrabrain"` + `skills=[]` | 用 GPT-5.2 Codex (xhigh) 純推理 |
| **文件編寫** | `category="writing"` + `skills=[]` | 用 Gemini 3 Flash 快速生成文件 |

## 🎒 開始前的準備

::: warning 前置條件

開始本教程前，請確保：
1. 已安裝 oh-my-opencode（見 [安裝教程](../../start/installation/)）
2. 已配置至少一個 Provider（見 [Provider 配置](../../platforms/provider-setup/)）
3. 了解基本的 delegate_task 工具使用（見 [背景並行任務](../background-tasks/)）

:::

::: info 關鍵概念
**Category** 是「這是什麼類型的工作」（決定模型、溫度、思維模式），**Skill** 是「需要什麼專業知識和工具」（注入提示詞和 MCP 伺服器）。透過 `delegate_task(category=..., skills=[...])` 組合兩者。
:::

## 核心思路

### Categories：任務類型決定模型

oh-my-opencode 提供了 7 個內建 Categories，每個類別都預配置了最優模型和思維模式：

| Category | 預設模型 | Temperature | 用途 |
| --- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 前端、UI/UX、設計任務 |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | 高智商推理任務（複雜架構決策） |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | 創意和藝術任務（新穎想法） |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 快速、低成本任務（單檔案修改） |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 不匹配其他類別的中等任務 |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | 不匹配其他類別的高品質任務 |
| `writing` | `google/gemini-3-flash` | 0.1 | 文件和寫作任務 |

**為什麼需要 Categories？**

不同任務需要不同能力的模型：
- UI 設計 → 需要**視覺創造力**（Gemini 3 Pro）
- 架構決策 → 需要**深度推理**（GPT-5.2 Codex xhigh）
- 簡單修改 → 需要**快速回應**（Claude Haiku）

手動為每個任務選擇模型很麻煩，Categories 讓你只需宣告任務類型，系統自動選擇最優模型。

### Skills：注入專業知識

Skill 是透過 SKILL.md 檔案定義的領域專家，可以注入：
- **專業知識**（提示詞擴展）
- **MCP 伺服器**（自動載入）
- **工作流指南**（具體操作步驟）

內建 4 個 Skills：

| Skill | 功能 | MCP | 用途 |
| --- | --- | --- | ---|
| `playwright` | 瀏覽器自動化 | `@playwright/mcp` | UI 驗證、截圖、爬蟲 |
| `agent-browser` | 瀏覽器自動化（Vercel） | 手動安裝 | 同上，備選方案 |
| `frontend-ui-ux` | 設計師思維 | 無 | 打造精美介面 |
| `git-master` | Git 專家 | 無 | 自動提交、歷史搜尋、rebase |

**Skill 的工作原理**：

當你載入 Skill 時，系統會：
1. 讀取 SKILL.md 檔案的提示詞內容
2. 如果定義了 MCP，自動啟動對應伺服器
3. 將 Skill 提示詞追加到代理的系統提示詞中

例如 `git-master` Skill 包含了：
- 提交風格檢測（自動識別專案的 commit 格式）
- 原子提交規則（3 檔案 → 最少 2 個提交）
- Rebase 工作流（squash、fixup、衝突處理）
- 歷史搜尋（blame、bisect、log -S）

### Sisyphus Junior：任務執行器

當你使用 Category 時，會生成一個特殊的子代理——**Sisyphus Junior**。

**關鍵特性**：
- ✅ 繼承 Category 的模型配置
- ✅ 繼承載入的 Skills 提示詞
- ❌ **不能再次委託**（禁止使用 `task` 和 `delegate_task` 工具）

**為什麼禁止再次委託？**

防止無限循環和任務發散：
```
Sisyphus（主代理）
  ↓ delegate_task(category="quick")
Sisyphus Junior
  ↓ 嘗試 delegate_task（如果允許）
Sisyphus Junior 2
  ↓ delegate_task
...無限循環...
```

透過禁止再次委託，Sisyphus Junior 專注於完成分配的任務，確保目標清晰、執行高效。

## 跟我做

### 第 1 步：快速修復（Quick + Git Master）

讓我們用一個實際場景：你修改了幾個檔案，需要自動提交並遵循專案風格。

**為什麼**
使用 `quick` Category 的 Haiku 模型成本低，配合 `git-master` Skill 自動檢測提交風格，實現完美提交。

在 OpenCode 中輸入：

```
使用 delegate_task 提交當前的更改
- category: quick
- load_skills: ["git-master"]
- prompt: "提交當前的所有更改。遵循專案的提交風格（通過 git log 檢測）。確保原子提交，一個 commit 最多 3 個檔案。"
- run_in_background: false
```

**你應該看到**：

1. Sisyphus Junior 啟動，使用 `claude-haiku-4-5` 模型
2. `git-master` Skill 載入，提示詞包含 Git 專家知識
3. 代理執行以下操作：
   ```bash
   # 並行收集上下文
   git status
   git diff --stat
   git log -30 --oneline
   ```
4. 檢測提交風格（如 Semantic vs Plain vs Short）
5. 規劃原子提交（3 檔案 → 至少 2 個提交）
6. 執行提交，遵循檢測到的風格

**檢查點 ✅**：

驗證提交是否成功：
```bash
git log --oneline -5
```

你應該看到多個原子提交，每個都有清晰的消息風格。

### 第 2 步：UI 實現和驗證（Visual + Playwright + UI/UX）

場景：你需要為一個頁面添加響應式圖表組件，並進行瀏覽器驗證。

**為什麼**
- `visual-engineering` Category 選擇 Gemini 3 Pro（擅長視覺設計）
- `playwright` Skill 提供 MCP 工具進行瀏覽器測試
- `frontend-ui-ux` Skill 注入設計師思維（配色、排版、動畫）

在 OpenCode 中輸入：

```
使用 delegate_task 實現圖表組件
- category: visual-engineering
- load_skills: ["frontend-ui-ux", "playwright"]
- prompt: "在 dashboard 頁面添加響應式圖表組件。要求：
  - 使用 Tailwind CSS
  - 支援行動端和桌面端
  - 使用鮮明的配色方案（避免紫色漸變）
  - 添加交錯動畫效果
  - 完成後用 playwright 截圖驗證"
- run_in_background: false
```

**你應該看到**：

1. Sisyphus Junior 啟動，使用 `google/gemini-3-pro` 模型
2. 載入兩個 Skills 的提示詞：
   - `frontend-ui-ux`：設計師心態指南
   - `playwright`：瀏覽器自動化指令
3. `@playwright/mcp` 伺服器自動啟動
4. 代理執行：
   - 設計圖表組件（應用設計師思維）
   - 實現響應式布局
   - 添加動畫效果
   - 使用 Playwright 工具：
     ```
     playwright_navigate: http://localhost:3000/dashboard
     playwright_take_screenshot: output=dashboard-chart.png
     ```

**檢查點 ✅**：

驗證組件是否正確渲染：
```bash
# 檢查新檔案
git diff --name-only
git diff --stat

# 查看截圖
ls screenshots/
```

你應該看到：
- 新的圖表組件檔案
- 響應式樣式代碼
- 截圖檔案（驗證通過）

### 第 3 步：深度架構分析（Ultrabrain 純推理）

場景：你需要為微服務架構設計一個複雜的通訊模式。

**為什麼**
- `ultrabrain` Category 選擇 GPT-5.2 Codex (xhigh)，提供最強的推理能力
- 不載入 Skills → 純推理，避免專業知識干擾

在 OpenCode 中輸入：

```
使用 delegate_task 分析架構
- category: ultrabrain
- load_skills: []
- prompt: "為我們的微服務架構設計一個高效的通訊模式。要求：
  - 支援服務發現
  - 處理網路分割
  - 最小化延遲
  - 提供降級策略

  當前架構：[簡述]
  技術棧：gRPC, Kubernetes, Consul"
- run_in_background: false
```

**你應該看到**：

1. Sisyphus Junior 啟動，使用 `openai/gpt-5.2-codex` 模型（xhigh 變體）
2. 不載入任何 Skills
3. 代理進行深度推理：
   - 分析現有架構
   - 比較通訊模式（如 CQRS、Event Sourcing、Saga）
   - 權衡利弊
   - 提供分層建議（Bottom Line → Action Plan → Risks）

**輸出結構**：

```
Bottom Line: 建議使用混合模式（gRPC + Event Bus）

Action Plan:
1. 在服務間使用 gRPC 實現同步通訊
2. 關鍵事件透過 Event Bus 異步發布
3. 實現冪等性處理重複消息

Risks and Mitigations:
- Risk: 網路分割導致消息丟失
  Mitigation: 實現消息重試和死信佇列
```

**檢查點 ✅**：

驗證方案是否全面：
- 是否考慮了服務發現？
- 是否處理了網路分割？
- 是否提供了降級策略？

### 第 4 步：自定義 Category（可選）

如果內建 Categories 不滿足你的需求，可以在 `oh-my-opencode.json` 中自定義。

**為什麼**
有些專案需要特定的模型配置（如 Korean Writer、Deep Reasoning）。

編輯 `~/.config/opencode/oh-my-opencode.json`：

```jsonc
{
  "categories": {
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },
    
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false
      }
    }
  }
}
```

**欄位說明**：

| 欄位 | 類型 | 說明 |
| --- | --- | ---|
| `model` | string | 覆蓋 Category 使用的模型 |
| `temperature` | number | 創意級別（0-2） |
| `prompt_append` | string | 追加到系統提示詞的內容 |
| `thinking` | object | Thinking 配置（`{ type, budgetTokens }`） |
| `tools` | object | 工具權限禁用（`{ toolName: false }`） |

**檢查點 ✅**：

驗證自定義 Category 是否生效：
```bash
# 使用自定義 Category
delegate_task(category="korean-writer", load_skills=[], prompt="...")
```

你應該看到系統使用了你配置的模型和提示詞。

## 踩坑提醒

### 坑 1：Quick Category 提示詞不夠明確

**問題**：`quick` Category 使用 Haiku 模型，推理能力有限。如果提示詞太模糊，結果會很差。

**錯誤示例**：
```
delegate_task(category="quick", load_skills=["git-master"], prompt="提交更改")
```

**正確做法**：
```
TASK: 提交當前的所有代碼更改

MUST DO:
1. 檢測專案的提交風格（通過 git log -30）
2. 將 8 個檔案按目錄分割為 3+ 個原子提交
3. 每個提交最多 3 個檔案
4. 遵循檢測到的風格（Semantic/Plain/Short）

MUST NOT DO:
- 合併不同目錄的檔案到同一個提交
- 跳過提交規劃直接執行

EXPECTED OUTPUT:
- 多個原子提交
- 每個提交消息匹配專案風格
- 遵循依賴順序（類型定義 → 實現 → 測試）
```

### 坑 2：忘記指定 `load_skills`

**問題**：`load_skills` 是**必填參數**，不指定會報錯。

**錯誤**：
```
delegate_task(category="quick", prompt="...")
```

**錯誤輸出**：
```
Error: Invalid arguments: 'load_skills' parameter is REQUIRED.
Pass [] if no skills needed, but IT IS HIGHLY RECOMMENDED to pass proper skills.
```

**正確做法**：
```
# 不需要 Skill，顯式傳遞空陣列
delegate_task(category="unspecified-low", load_skills=[], prompt="...")
```

### 坑 3：Category 和 subagent_type 同時指定

**問題**：這兩個參數是互斥的，不能同時指定。

**錯誤**：
```
delegate_task(
  category="quick",
  subagent_type="oracle",  # ❌ 衝突
  ...
)
```

**正確做法**：
```
# 使用 Category（推薦）
delegate_task(category="quick", load_skills=[], prompt="...")

# 或者直接指定代理
delegate_task(subagent_type="oracle", load_skills=[], prompt="...")
```

### 坑 4：Git Master 的多提交規則

**問題**：`git-master` Skill 強制要求**多提交**，1 個提交從 3+ 檔案會失敗。

**錯誤**：
```
# 嘗試 1 個提交 8 個檔案
git commit -m "Update landing page"  # ❌ git-master 會拒絕
```

**正確做法**：
```
# 按目錄分割為多個提交
git add app/page.tsx app/layout.tsx
git commit -m "Add app layer"  # ✅ Commit 1

git add components/demo/*
git commit -m "Add demo components"  # ✅ Commit 2

git add e2e/*
git commit -m "Add tests"  # ✅ Commit 3
```

### 坑 5：Playwright Skill 未安裝 MCP

**問題**：使用 `playwright` Skill 前，需要確保 MCP 伺服器可用。

**錯誤**：
```
delegate_task(category="visual-engineering", load_skills=["playwright"], prompt="截圖...")
```

**正確做法**：

檢查 MCP 配置（`~/.config/opencode/mcp.json` 或 `.claude/.mcp.json`）：

```jsonc
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

如果 Playwright MCP 未配置，`playwright` Skill 會自動啟動它。

## 本課小結

Categories 和 Skills 系統讓你可以靈活組合代理：

| 組件 | 作用 | 配置方式 |
| --- | --- | ---|
| **Category** | 決定模型和思維模式 | `delegate_task(category="...")` 或配置文件 |
| **Skill** | 注入專業知識和 MCP | `delegate_task(load_skills=["..."])` 或 SKILL.md 檔案 |
| **Sisyphus Junior** | 執行任務，不能再次委託 | 自動生成，無需手動指定 |

**組合策略**：
1. **UI 任務**：`visual-engineering` + `frontend-ui-ux` + `playwright`
2. **快速修復**：`quick` + `git-master`
3. **深度推理**：`ultrabrain`（不加 Skill）
4. **文件編寫**：`writing`（不加 Skill）

**最佳實踐**：
- ✅ 總是指定 `load_skills`（即使是空陣列）
- ✅ `quick` Category 的提示詞必須明確（Haiku 推理能力有限）
- ✅ Git 任務總是用 `git-master` Skill（自動檢測風格）
- ✅ UI 任務總是用 `playwright` Skill（瀏覽器驗證）
- ✅ 根據任務類型選擇合適的 Category（而不是預設用主代理）

## 下一課預告

> 下一課我們將學習 **[內建 Skills：瀏覽器自動化、Git 專家與 UI 設計師](../builtin-skills/)**。
>
> 你會學到：
> - `playwright` Skill 的詳細工作流程
> - `git-master` Skill 的 3 種模式（Commit/Rebase/History Search）
> - `frontend-ui-ux` Skill 的設計理念
> - 如何創建自定義 Skill

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| delegate_task 工具實現 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 全文（1070 行） |
| resolveCategoryConfig 函數 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 113-152 |
| buildSystemContent 函數 | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 176-188 |
| 預設 Categories 配置 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 158-166 |
| Categories 提示詞追加 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 168-176 |
| Categories 描述 | [`src/tools/delegate-task/constants.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/constants.ts) | 178-186 |
| Category 配置 Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172 |
| 內建 Skills 定義 | [`src/features/builtin-skills/`](https://github.com/code-yeongyu/oh-my-opencode/tree/main/src/features/builtin-skills) | 目錄結構 |
| git-master Skill 提示詞 | [`src/features/builtin-skills/git-master/SKILL.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/git-master/SKILL.md) | 全文（1106 行） |

**關鍵常數**：
- `SISYPHUS_JUNIOR_AGENT = "sisyphus-junior"`：Category 委託的執行代理
- `DEFAULT_CATEGORIES`：7 個內建 Category 的模型配置
- `CATEGORY_PROMPT_APPENDS`：每個 Category 的提示詞追加內容
- `CATEGORY_DESCRIPTIONS`：每個 Category 的描述（顯示在 delegate_task 提示中）

**關鍵函數**：
- `resolveCategoryConfig()`：解析 Category 配置，合併用戶覆蓋和預設值
- `buildSystemContent()`：合併 Skill 和 Category 的提示詞內容
- `createDelegateTask()`：建立 delegate_task 工具定義

**內建 Skills 檔案**：
- `src/features/builtin-skills/frontend-ui-ux/SKILL.md`：設計師思維提示詞
- `src/features/builtin-skills/git-master/SKILL.md`：Git 專家完整工作流
- `src/features/builtin-skills/agent-browser/SKILL.md`：Vercel agent-browser 配置
- `src/features/builtin-skills/dev-browser/SKILL.md`：瀏覽器自動化參考文件

</details>
