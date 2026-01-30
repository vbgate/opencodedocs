---
title: "v3.0 新特性: Categories 和 Skills 系統 | oh-my-opencode"
sidebarTitle: "讓 AI 有 7 類專長"
subtitle: "v3.0 新特性: Categories 和 Skills 系統"
description: "學習 oh-my-opencode v3.0 的 Categories 和 Skills 系統。掌握 7 個任務分類、3 個技能包和動態代理組合能力。"
tags:
  - "v3.0"
  - "categories"
  - "skills"
  - "changelog"
order: 200
---

# v3.0 新特性：Categories 和 Skills 系統全面解析

## 版本概覽

oh-my-opencode v3.0 是一個重要的里程碑版本，引入了全新的 **Categories 和 Skills 系統**，徹底改變了 AI 代理的編排方式。本版本旨在讓 AI 代理更加專業化、靈活化和可組合化。

**關鍵改進**：
- 🎯 **Categories 系統**：7 個內建任務分類，自動選擇最優模型
- 🛠️ **Skills 系統**：3 個內建專業技能包，注入領域知識
- 🔄 **動態組合**：透過 `delegate_task` 自由組合 Category 和 Skill
- 🚀 **Sisyphus-Junior**：新的委託任務執行器，防止無限循環
- 📝 **靈活配置**：支援自訂 Categories 和 Skills

---

## 核心新特性 1：Categories 系統

### 什麼是 Category？

Category 是針對特定領域優化的**代理配置預設**。它回答了一個關鍵問題：**「這是什麼類型的工作？」**

每個 Category 定義了：
- **使用的模型**（model）
- **溫度參數**（temperature）
- **提示心態**（prompt mindset）
- **推理能力**（reasoning effort）
- **工具權限**（tools）

### 7 個內建 Categories

| Category | 預設模型 | Temperature | 適用場景 |
| --- | --- | --- | --- |
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 前端、UI/UX、設計、樣式、動畫 |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | 深度邏輯推理、需要大量分析的複雜架構決策 |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | 高創意/藝術任務、新穎想法 |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 簡單任務 - 單檔案修改、拼寫錯誤修復、簡單修改 |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 不符合其他類別的任務，低工作量 |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | 不符合其他類別的任務，高工作量 |
| `writing` | `google/gemini-3-flash` | 0.1 | 文件、散文、技術寫作 |

**來源**：`docs/category-skill-guide.md:22-30`

### 如何使用 Categories？

在呼叫 `delegate_task` 工具時，指定 `category` 參數：

```typescript
// 委託前端任務到 visual-engineering category
delegate_task(
  category="visual-engineering",
  prompt="為儀表板頁面新增響應式圖表元件"
)
```

系統會自動：
1. 選擇 `visual-engineering` Category
2. 使用 `google/gemini-3-pro` 模型
3. 套用 `temperature: 0.7`（高創造性）
4. 載入該 Category 的提示心態

### Sisyphus-Junior：委託任務執行器

當你使用 Category 時，一個名為 **Sisyphus-Junior** 的特殊代理會執行任務。

**關鍵特性**：
- ❌ **不能重新委託**任務給其他代理
- 🎯 **專注於分配的任務**
- 🔄 **防止無限委託循環**

**設計目的**：確保代理專注於當前任務，避免任務層層委託導致的複雜性。

---

## 核心新特性 2：Skills 系統

### 什麼是 Skill？

Skill 是一種將**專業知識（Context）**和**工具（MCP）**注入到代理中的機制。它回答了另一個關鍵問題：**「需要什麼工具和知識？」**

### 3 個內建 Skills

#### 1. `git-master`

**能力**：
- Git 專家
- 檢測提交風格
- 拆分原子提交
- 制定 rebase 策略

**MCP**：無（使用 Git 命令）

**適用場景**：提交、歷史搜尋、分支管理

#### 2. `playwright`

**能力**：
- 瀏覽器自動化
- 網頁測試
- 截圖
- 資料抓取

**MCP**：`@playwright/mcp`（自動執行）

**適用場景**：實作後的 UI 驗證、E2E 測試編寫

#### 3. `frontend-ui-ux`

**能力**：
- 注入設計師思維模式
- 顏色、排版、動效指南

**適用場景**：超越簡單實作的美觀 UI 工作

**來源**：`docs/category-skill-guide.md:57-70`

### 如何使用 Skills？

在 `delegate_task` 中新增 `load_skills` 陣列：

```typescript
// 委託快速任務並載入 git-master 技能
delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="提交當前更改。遵循提交訊息風格。"
)
```

系統會自動：
1. 選擇 `quick` Category（Claude Haiku，低成本）
2. 載入 `git-master` Skill（注入 Git 專業知識）
3. 啟動 Sisyphus-Junior 執行任務

### 自訂 Skills

你可以直接在專案根目錄的 `.opencode/skills/` 或使用者目錄的 `~/.claude/skills/` 中新增自訂 Skills。

**範例：`.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: 我的專業自訂技能
mcp:
  my-mcp:
    command: npx
    args: ["-y", "my-mcp-server"]
---

# 我的技能提示詞

此內容將被注入到代理的系統提示詞中。
...
```

**來源**：`docs/category-skill-guide.md:87-103`

---

## 核心新特性 3：動態組合能力

### 組合策略：建立專業代理

透過組合不同的 Categories 和 Skills，你可以建立強大的專業代理。

#### 🎨 設計師（UI 實作）

- **Category**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **效果**：實作美觀的 UI 並直接在瀏覽器中驗證渲染結果

#### 🏗️ 架構師（設計審查）

- **Category**: `ultrabrain`
- **load_skills**: `[]`（純推理）
- **效果**：利用 GPT-5.2 的邏輯推理能力進行深入的系統架構分析

#### ⚡ 維護者（快速修復）

- **Category**: `quick`
- **load_skills**: `["git-master"]`
- **效果**：使用成本效益高的模型快速修復程式碼並產生乾淨的提交

**來源**：`docs/category-skill-guide.md:111-124`

### delegate_task 提示詞指南

委託任務時，**清晰且具體**的提示詞至關重要。包含以下 7 個元素：

1. **TASK**：需要做什麼？（單一目標）
2. **EXPECTED OUTCOME**：交付物是什麼？
3. **REQUIRED SKILLS**：應該透過 `load_skills` 載入哪些技能？
4. **REQUIRED TOOLS**：必須使用哪些工具？（白名單）
5. **MUST DO**：必須做什麼（約束）
6. **MUST NOT DO**：絕不能做什麼
7. **CONTEXT**：檔案路徑、現有模式、參考資料

**❌ 壞範例**：
> "修復這個"

**✅ 好範例**：
> **TASK**：修復 `LoginButton.tsx` 中的行動端版面破壞問題
> **CONTEXT**：`src/components/LoginButton.tsx`，使用 Tailwind CSS
> **MUST DO**：在 `md:` 斷點處更改 flex-direction
> **MUST NOT DO**：修改現有桌面版面
> **EXPECTED**：按鈕在行動端垂直對齊

**來源**：`docs/category-skill-guide.md:130-148`

---

## 配置指南

### Category 配置 Schema

你可以在 `oh-my-opencode.json` 中微調 Categories。

| 欄位 | 類型 | 描述 |
| --- | --- | --- |
| `description` | string | Category 目的的可讀描述。顯示在 delegate_task 提示中。 |
| `model` | string | 使用的 AI 模型 ID（如 `anthropic/claude-opus-4-5`） |
| `variant` | string | 模型變體（如 `max`、`xhigh`） |
| `temperature` | number | 創造性級別（0.0 ~ 2.0）。越低越確定。 |
| `top_p` | number | 核採樣參數（0.0 ~ 1.0） |
| `prompt_append` | string | 選擇此 Category 時追加到系統提示詞的內容 |
| `thinking` | object | Thinking 模型配置（`{ type: "enabled", budgetTokens: 16000 }`） |
| `reasoningEffort` | string | 推理努力級別（`low`、`medium`、`high`） |
| `textVerbosity` | string | 文字詳細程度（`low`、`medium`、`high`） |
| `tools` | object | 工具使用控制（使用 `{ "tool_name": false }` 停用） |
| `maxTokens` | number | 最大回應 token 數 |
| `is_unstable_agent` | boolean | 標記代理為不穩定 - 強制背景模式以進行監控 |

**來源**：`docs/category-skill-guide.md:159-172`

### 配置範例

```jsonc
{
  "categories": {
    // 1. 定義新的自訂 category
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },

    // 2. 覆蓋現有 category（更改模型）
    "visual-engineering": {
      "model": "openai/gpt-5.2",
      "temperature": 0.8
    },

    // 3. 配置 thinking 模型並限制工具
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false // 停用網路搜尋
      }
    }
  },

  // 停用 skills
  "disabled_skills": ["playwright"]
}
```

**來源**：`docs/category-skill-guide.md:175-206`

---

## 其他重要改進

除了 Categories 和 Skills 系統，v3.0 還包含以下重要改進：

### 穩定性提升
- ✅ 版本標記為穩定（3.0.1）
- ✅ 優化了代理委託機制
- ✅ 改進了錯誤恢復能力

### 效能優化
- ✅ 減少了不必要的上下文注入
- ✅ 優化了背景任務輪詢機制
- ✅ 提升了多模型編排效率

### Claude Code 相容性
- ✅ 完整相容 Claude Code 的配置格式
- ✅ 支援載入 Claude Code 的 Skills、Commands、MCPs
- ✅ 自動發現和配置

**來源**：`README.md:18-20`, `README.md:292-304`

---

## 下一步

v3.0 的 Categories 和 Skills 系統為 oh-my-opencode 奠定了靈活擴充的基礎。如果你想要深入了解如何使用這些新特性，可以參考以下章節：

- [Categories 和 Skills：動態代理組合](../../advanced/categories-skills/) - 詳細使用指南
- [內建 Skills：瀏覽器自動化與 Git 專家](../../advanced/builtin-skills/) - Skills 深度解析
- [配置深度定製：代理與權限管理](../../advanced/advanced-configuration/) - 自訂配置指南

開始探索這些新特性，讓 AI 代理更加專業化、高效化！
