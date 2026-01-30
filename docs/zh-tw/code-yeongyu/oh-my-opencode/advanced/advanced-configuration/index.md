---
title: "深度配置: 代理與權限 | oh-my-opencode"
sidebarTitle: "控制代理行為"
subtitle: "深度配置: 代理與權限 | oh-my-opencode"
description: "學習 oh-my-opencode 的代理配置、權限設置、模型覆蓋和提示詞修改方法。通過深度定制打造最適合你的 AI 開發團隊，精確控制每個代理的行為和能力。"
tags:
  - "configuration"
  - "agents"
  - "permissions"
  - "customization"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# 配置深度定制：代理與權限管理

## 學完你能做什麼

- 自定義每個代理使用的模型和參數
- 精確控制代理的權限（文件編輯、Bash 執行、Web 請求等）
- 通過 `prompt_append` 為代理添加額外指令
- 創建自定義 Category 實現動態代理組合
- 啟用/禁用特定代理、Skill、Hook 和 MCP

## 你現在的困境

**默認配置很好用，但不够貼合你的需求：**
- Oracle 用的 GPT 5.2 太貴，想換個便宜點的模型
- Explore 代理不應該有寫文件權限，只讓它搜索
- 想讓 Librarian 優先搜索官方文檔，而不是 GitHub
- 某個 Hook 總是誤報，想臨時禁用

**你需要的是"深度定制"**——不是"能用就行"，而是"正好夠用"。

---

## 🎒 開始前的準備

::: warning 前置要求
本教程假設你已完成 [安裝配置](../../start/installation/) 和 [Provider 設置](../../platforms/provider-setup/)。
:::

**你需要知道**：
- 配置文件位置：`~/.config/opencode/oh-my-opencode.json`（用戶級）或 `.opencode/oh-my-opencode.json`（項目級）
- 用戶級配置優先於項目級配置

---

## 核心思路

**配置優先級**：用戶級配置 > 項目級配置 > 默認配置

```
~/.config/opencode/oh-my-opencode.json (最高優先級)
    ↓ 覆蓋
.opencode/oh-my-opencode.json (項目級)
    ↓ 覆蓋
oh-my-opencode 內置默認值 (最低優先級)
```

**配置文件支持 JSONC**：
- 可以用 `//` 添加註釋
- 可以用 `/* */` 添加塊註釋
- 可以有尾隨逗號

---

## 跟我做

### 第 1 步：找到配置文件並啟用 Schema 自動補全

**為什麼**
啟用 JSON Schema 後，編輯器會自動提示所有可用字段和類型，避免寫錯配置。

**操作**：

```jsonc
{
  // 添加這行以啟用自動補全
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // 你的配置...
}
```

**你應該看到**：
- 在 VS Code / JetBrains 等編輯器中，輸入 `{` 後會自動提示所有可用字段
- 鼠標懸停在字段上會顯示說明和類型

---

### 第 2 步：自定義代理模型

**為什麼**
不同任務需要不同模型：
- **架構設計**：用最強模型（Claude Opus 4.5）
- **快速探索**：用最快模型（Grok Code）
- **UI 設計**：用視覺模型（Gemini 3 Pro）
- **成本控制**：簡單任務用便宜模型

**操作**：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle：戰略顧問，用 GPT 5.2
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // 低溫度，更確定性
    },

    // Explore：快速探索，用免費模型
    "explore": {
      "model": "opencode/gpt-5-nano",  // 免費
      "temperature": 0.3
    },

    // Librarian：文檔搜索，用大上下文模型
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // Multimodal Looker：媒體分析，用 Gemini
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**你應該看到**：
- 各代理使用不同的模型，根據任務特點優化
- 保存配置後，下次調用對應代理時會使用新模型

---

### 第 3 步：配置代理權限

**為什麼**
某些代理**不應該**有全部權限：
- Oracle（戰略顧問）：只讀，不需要寫文件
- Librarian（研究專家）：只讀，不需要執行 Bash
- Explore（探索）：只讀，不需要 Web 請求

**操作**：

```jsonc
{
  "agents": {
    "explore": {
      // 禁止寫文件和執行 Bash，只允許 Web 搜索
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // 只讀權限
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // 需要搜索文檔
      }
    },

    "oracle": {
      // 只讀權限
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // 需要查資料
      }
    },

    // Sisyphus：主編排器，可以執行所有操作
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**權限說明**：

| 權限           | 值            | 說明                                               |
|--- | --- | ---|
| `edit`         | `ask/allow/deny` | 文件編輯權限                                    |
| `bash`         | `ask/allow/deny` 或對象 | Bash 執行權限（可細化到具體命令）             |
| `webfetch`     | `ask/allow/deny` | Web 請求權限                                  |
| `doom_loop`    | `ask/allow/deny` | 允許代理覆蓋無限循環檢測                   |
| `external_directory` | `ask/allow/deny` | 訪問項目外目錄權限                         |

**細化 Bash 權限**：

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // 允許執行 git 命令
          "grep": "allow",     // 允許執行 grep
          "rm": "deny",       // 禁止刪除文件
          "mv": "deny"        // 禁止移動文件
        }
      }
    }
  }
}
```

**你應該看到**：
- 配置權限後，代理嘗試執行被禁用的操作時會自動拒絕
- 在 OpenCode 中會看到權限被拒絕的提示

---

### 第 4 步：使用 prompt_append 添加額外指令

**為什麼**
默認系統提示已經很好，但你可能有**特殊需求**：
- 讓 Librarian 優先搜索特定文檔
- 讓 Oracle 遵循特定架構模式
- 讓 Explore 使用特定搜索關鍵詞

**操作**：

```jsonc
{
  "agents": {
    "librarian": {
      // 追加到默認系統提示後面，不會覆蓋
      "prompt_append": "Always use elisp-dev-mcp for Emacs Lisp documentation lookups. " +
                      "When searching for docs, prioritize official documentation over blog posts."
    },

    "oracle": {
      "prompt_append": "Follow SOLID principles and Clean Architecture patterns. " +
                    "Always suggest TypeScript types for all function signatures."
    },

    "explore": {
      "prompt_append": "When searching code, prioritize recent commits and actively maintained files. " +
                    "Ignore test files unless explicitly asked."
    }
  }
}
```

**你應該看到**：
- 代理的行為發生變化，但仍然保持原有能力
- 比如讓 Oracle 詢問時總是建議 TypeScript 類型

---

### 第 5 步：自定義 Category 配置

**為什麼**
Category 是 v3.0 的新特性，實現**動態代理組合**：
- 為特定任務類型預設模型和參數
- 通過 `delegate_task(category="...")` 快速調用
- 比"手動選模型+寫提示詞"更高效

**操作**：

```jsonc
{
  "categories": {
    // 自定義：數據科學任務
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Focus on data analysis, ML pipelines, and statistical methods. " +
                      "Use pandas/numpy for Python and dplyr/tidyr for R."
    },

    // 覆蓋默認：UI 任務使用自定義提示
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use shadcn/ui components and Tailwind CSS. " +
                      "Ensure responsive design and accessibility."
    },

    // 覆蓋默認：快速任務
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Be concise. Focus on simple fixes and quick searches."
    }
  }
}
```

**Category 配置字段**：

| 字段              | 說明                         | 示例                              |
|--- | --- | ---|
| `model`           | 使用的模型                   | `"anthropic/claude-sonnet-4-5"`    |
| `temperature`     | 溫度（0-2）                 | `0.2` (確定性) / `0.8` (創造性)    |
| `top_p`           | 核採樣（0-1）               | `0.9`                              |
| `maxTokens`       | 最大 Token 數               | `4000`                             |
| `thinking`        | Thinking 配置               | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append`    | 追加提示                   | `"Use X for Y"`                    |
| `tools`           | 工具權限                   | `{"bash": false}`                    |
| `is_unstable_agent` | 標記為不穩定（強制後台模式） | `true`                              |

**使用 Category**：

```
// 在 OpenCode 中
delegate_task(category="data-science", prompt="分析這個數據集並生成可視化")
delegate_task(category="visual-engineering", prompt="創建響應式儀表盤組件")
delegate_task(category="quick", prompt="搜索這個函數的定義")
```

**你應該看到**：
- 不同類型的任務自動使用最適合的模型和配置
- 無需每次手動指定模型和參數

---

### 第 6 步：禁用特定功能

**為什麼**
某些功能可能不適合你的工作流：
- `comment-checker`：你的項目允許詳細註釋
- `agent-usage-reminder`：你知道什麼時候用什麼代理
- 某個 MCP：你不需要

**操作**：

```jsonc
{
  // 禁用特定 Hooks
  "disabled_hooks": [
    "comment-checker",           // 不檢查註釋
    "agent-usage-reminder",       // 不提示代理使用建議
    "startup-toast"               // 不顯示啟動通知
  ],

  // 禁用特定 Skills
  "disabled_skills": [
    "playwright",                // 不使用 Playwright
    "frontend-ui-ux"            // 不使用內置前端 Skill
  ],

  // 禁用特定 MCPs
  "disabled_mcps": [
    "websearch",                // 不使用 Exa 搜索
    "context7",                // 不使用 Context7
    "grep_app"                 // 不使用 grep.app
  ],

  // 禁用特定代理
  "disabled_agents": [
    "multimodal-looker",        // 不使用多模態 Looker
    "metis"                   // 不使用 Metis 前規劃分析
  ]
}
```

**可用 Hooks 列表**（部分）：

| Hook 名稱                | 功能                           |
|--- | ---|
| `todo-continuation-enforcer` | 強制完成 TODO 列表              |
| `comment-checker`          | 檢測冗餘註釋                  |
| `tool-output-truncator`     | 截斷工具輸出以節省上下文        |
| `keyword-detector`         | 檢測 ultrawork 等關鍵詞          |
| `agent-usage-reminder`     | 提示應該使用哪個代理           |
| `session-notification`      | 會話結束通知                  |
| `background-notification`    | 後台任務完成通知              |

**你應該看到**：
- 被禁用的功能不再執行
- 重新啟用後恢復功能

---

### 第 7 步：配置後台任務並發控制

**為什麼**
並行後台任務需要**控制並發數**：
- 避免 API 限流
- 控制成本（昂貴模型不能太多並發）
- 遵守 Provider 配額

**操作**：

```jsonc
{
  "background_task": {
    // 默認最大並發數
    "defaultConcurrency": 5,

    // Provider 級並發限制
    "providerConcurrency": {
      "anthropic": 3,      // Anthropic API 最多 3 個並發
      "openai": 5,         // OpenAI API 最多 5 個並發
      "google": 10          // Gemini API 最多 10 個並發
    },

    // Model 級並發限制（優先級最高）
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus 太貴，限制 2 個並發
      "google/gemini-3-flash": 10,          // Flash 很便宜，允許 10 個並發
      "anthropic/claude-haiku-4-5": 15      // Haiku 更便宜，允許 15 個並發
    }
  }
}
```

**優先級順序**：
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**你應該看到**：
- 超過並發限制的後台任務會排隊等待
- 昂貴模型的並發被限制，節省成本

---

### 第 8 步：啟用實驗性功能

**為什麼**
實驗性功能提供**額外能力**，但可能有不穩定：
- `aggressive_truncation`：更激進的上下文截斷
- `auto_resume`：自動從崩潰恢復
- `truncate_all_tool_outputs`：截斷所有工具輸出

::: danger 警告
實驗性功能可能在未來版本中被移除或行為改變。啟用前請充分測試。
:::

**操作**：

```jsonc
{
  "experimental": {
    // 啟用更激進的工具輸出截斷
    "aggressive_truncation": true,

    // 自動從 thinking block 錯誤恢復
    "auto_resume": true,

    // 截斷所有工具輸出（不只是 Grep/Glob/LSP/AST-Grep）
    "truncate_all_tool_outputs": false
  }
}
```

**你應該看到**：
- 激進模式下，工具輸出被更嚴格地截斷以節省上下文
- 啟用 `auto_resume` 後，代理遇到錯誤會自動恢復繼續工作

---

## 檢查點 ✅

**驗證配置是否生效**：

```bash
# 運行診斷命令
bunx oh-my-opencode doctor --verbose
```

**你應該看到**：
- 每個代理的模型解析結果
- 你的配置覆蓋是否生效
- 禁用的功能是否被正確識別

---

## 踩坑提醒

### 1. 配置文件格式錯誤

**問題**：
- JSON 語法錯誤（少逗號、多逗號）
- 字段名拼寫錯誤（`temperature` 寫成 `temparature`）

**解決**：
```bash
# 驗證 JSON 格式
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. 權限配置過於嚴格

**問題**：
- 某些代理被完全禁用（`edit: "deny"`, `bash: "deny"`）
- 導致代理無法完成正常工作

**解決**：
- 只讀代理（Oracle、Librarian）可以禁用 `edit` 和 `bash`
- 主編排器（Sisyphus）需要完整權限

### 3. Category 配置不生效

**問題**：
- Category 名稱拼寫錯誤（`visual-engineering` 寫成 `visual-engineering`）
- `delegate_task` 沒有指定 `category` 參數

**解決**：
- 檢查 `delegate_task(category="...")` 中的名稱是否與配置一致
- 使用 `doctor --verbose` 驗證 Category 解析結果

### 4. 並發限制太低

**問題**：
- `modelConcurrency` 設置太低（如 `1`）
- 後台任務幾乎串行執行，失去並行優勢

**解決**：
- 根據預算和 API 配額合理設置
- 昂貴模型（Opus）限制為 2-3，便宜模型（Haiku）可以 10+

---

## 本課小結

**配置深度定制 = 精確控制**：

| 配置項           | 用途                          | 常見場景                         |
|--- | --- | ---|
| `agents.model`    | 覆蓋代理模型                  | 成本優化、任務適配             |
| `agents.permission` | 控制代理權限                | 安全隔離、只讀模式           |
| `agents.prompt_append` | 追加額外指令                | 遵循架構規範、優化搜索策略 |
| `categories`      | 動態代理組合                  | 快速調用特定類型任務           |
| `background_task` | 並發控制                     | 成本控制、API 配額           |
| `disabled_*`      | 禁用特定功能                 | 移除不常用功能               |

**記住**：
- 用戶級配置（`~/.config/opencode/oh-my-opencode.json`）優先於項目級
- 使用 JSONC 讓配置更易讀
- 運行 `oh-my-opencode doctor --verbose` 驗證配置

---

## 下一課預告

> 下一課我們學習 **[配置診斷與故障排除](../../faq/troubleshooting/)**。
>
> 你會學到：
> - 使用 doctor 命令進行健康檢查
> - 診斷 OpenCode 版本、插件註冊、Provider 配置等問題
> - 理解模型解析機制和 Categories 配置
> - 使用 JSON 輸出進行自動化診斷

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能                | 文件路徑                                                                 | 行號    |
|--- | --- | ---|
| 配置 Schema 定義    | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378   |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119   |
| CategoryConfig      | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172  |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17    |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350  |
| 配置文檔          | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595   |

**關鍵常量**：
- `PermissionValue = z.enum(["ask", "allow", "deny"])`：權限值枚舉

**關鍵類型**：
- `AgentOverrideConfig`：代理覆蓋配置（模型、溫度、提示詞等）
- `CategoryConfig`：Category 配置（模型、溫度、提示詞等）
- `AgentPermissionSchema`：代理權限配置（edit、bash、webfetch等）
- `BackgroundTaskConfig`：後台任務並發配置

**內置代理枚舉**（`BuiltinAgentNameSchema`）：
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**內置 Skill 枚舉**（`BuiltinSkillNameSchema`）：
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**內置 Category 枚舉**（`BuiltinCategoryNameSchema`）：
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>
