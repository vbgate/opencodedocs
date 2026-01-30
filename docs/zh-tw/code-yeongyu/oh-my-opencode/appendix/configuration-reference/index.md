---
title: "配置參考：完整配置選項 | oh-my-opencode"
sidebarTitle: "配置全攻略"
subtitle: "配置參考：完整配置選項"
description: "學習 oh-my-opencode 的完整配置選項和欄位定義。涵蓋代理、Categories、Hooks、背景任務等所有配置，幫助深度客製化 OpenCode 開發環境，優化 AI 編碼工作流程。"
tags:
  - "configuration"
  - "reference"
  - "schema"
prerequisite: []
order: 180
---

# 配置參考：完整的配置檔案 Schema 說明

本頁提供 oh-my-opencode 配置檔案的完整欄位定義和說明。

::: info 配置檔案位置
- 專案級：`.opencode/oh-my-opencode.json`
- 使用者級（macOS/Linux）：`~/.config/opencode/oh-my-opencode.json`
- 使用者級（Windows）：`%APPDATA%\opencode\oh-my-opencode.json`

專案級配置優先於使用者級配置。
:::

::: tip 啟用自動補全
在配置檔案頂部新增 `$schema` 欄位可獲得 IDE 自動補全：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## 根級欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `$schema` | string | 否 | - | JSON Schema 連結，用於自動補全 |
| `disabled_mcps` | string[] | 否 | [] | 停用的 MCP 清單 |
| `disabled_agents` | string[] | 否 | [] | 停用的代理清單 |
| `disabled_skills` | string[] | 否 | [] | 停用的技能清單 |
| `disabled_hooks` | string[] | 否 | [] | 停用的鉤子清單 |
| `disabled_commands` | string[] | 否 | [] | 停用的命令清單 |
| `agents` | object | 否 | - | 代理覆寫配置 |
| `categories` | object | 否 | - | Category 自訂配置 |
| `claude_code` | object | 否 | - | Claude Code 相容性配置 |
| `sisyphus_agent` | object | 否 | - | Sisyphus 代理配置 |
| `comment_checker` | object | 否 | - | 註解檢查器配置 |
| `experimental` | object | 否 | - | 實驗性功能配置 |
| `auto_update` | boolean | 否 | true | 自動更新檢查 |
| `skills` | object\|array | 否 | - | Skills 配置 |
| `ralph_loop` | object | 否 | - | Ralph Loop 配置 |
| `background_task` | object | 否 | - | 背景任務並行配置 |
| `notification` | object | 否 | - | 通知配置 |
| `git_master` | object | 否 | - | Git Master 技能配置 |
| `browser_automation_engine` | object | 否 | - | 瀏覽器自動化引擎配置 |
| `tmux` | object | 否 | - | Tmux 工作階段管理配置 |

## agents - 代理配置

覆寫內建代理的設定。每個代理支援以下欄位：

### 通用代理欄位

| 欄位 | 類型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `model` | string | 否 | 覆寫代理使用的模型（已棄用，建議使用 category） |
| `variant` | string | 否 | 模型變體 |
| `category` | string | 否 | 從 Category 繼承模型和配置 |
| `skills` | string[] | 否 | 注入到代理提示中的技能清單 |
| `temperature` | number | 否 | 0-2，控制隨機性 |
| `top_p` | number | 否 | 0-1，核採樣參數 |
| `prompt` | string | 否 | 完全覆寫預設系統提示 |
| `prompt_append` | string | 否 | 追加到預設提示後面 |
| `tools` | object | 否 | 工具權限覆寫（`{toolName: boolean}`） |
| `disable` | boolean | 否 | 停用該代理 |
| `description` | string | 否 | 代理描述 |
| `mode` | enum | 否 | `subagent` / `primary` / `all` |
| `color` | string | 否 | Hex 顏色（如 `#FF0000`） |
| `permission` | object | 否 | 代理權限限制 |

### permission - 代理權限

| 欄位 | 類型 | 必填 | 值 | 描述 |
| --- | --- | --- | --- | --- |
| `edit` | string | 否 | `ask`/`allow`/`deny` | 檔案編輯權限 |
| `bash` | string/object | 否 | `ask`/`allow`/`deny` 或 per-command | Bash 執行權限 |
| `webfetch` | string | 否 | `ask`/`allow`/`deny` | Web 請求權限 |
| `doom_loop` | string | 否 | `ask`/`allow`/`deny` | 無限迴圈偵測覆寫權限 |
| `external_directory` | string | 否 | `ask`/`allow`/`deny` | 存取外部目錄權限 |

### 可配置的代理清單

| 代理名 | 說明 |
| --- | --- |
| `sisyphus` | 主編排器代理 |
| `prometheus` | 戰略規劃師代理 |
| `oracle` | 戰略顧問代理 |
| `librarian` | 多倉庫研究專家代理 |
| `explore` | 快速程式碼庫探索專家代理 |
| `multimodal-looker` | 媒體分析專家代理 |
| `metis` | 前規劃分析代理 |
| `momus` | 規劃審查者代理 |
| `atlas` | 主編排器代理 |
| `sisyphus-junior` | 類別生成的任務執行器代理 |

### 配置範例

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Category 配置

定義 Categories（模型抽象），用於動態代理組合。

### Category 欄位

| 欄位 | 類型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `description` | string | 否 | Category 的目的描述（顯示在 delegate_task 提示中） |
| `model` | string | 否 | 覆寫 Category 使用的模型 |
| `variant` | string | 否 | 模型變體 |
| `temperature` | number | 否 | 0-2，溫度 |
| `top_p` | number | 否 | 0-1，核採樣 |
| `maxTokens` | number | 否 | 最大 Token 數 |
| `thinking` | object | 否 | Thinking 配置 `{type, budgetTokens}` |
| `reasoningEffort` | enum | 否 | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | 否 | `low` / `medium` / `high` |
| `tools` | object | 否 | 工具權限 |
| `prompt_append` | string | 否 | 追加提示 |
| `is_unstable_agent` | boolean | 否 | 標記為不穩定代理（強制背景模式） |

### thinking 配置

| 欄位 | 類型 | 必填 | 值 | 描述 |
| --- | --- | --- | --- | --- |
| `type` | string | 是 | `enabled`/`disabled` | 是否啟用 Thinking |
| `budgetTokens` | number | 否 | - | Thinking budget token 數 |

### 內建 Categories

| Category | 預設模型 | Temperature | 描述 |
| --- | --- | --- | --- |
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 前端、UI/UX、設計任務 |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | 高智商推理任務 |
| `artistry` | `google/gemini-3-pro` | 0.7 | 創意和藝術任務 |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 快速、低成本任務 |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 未指定類型的中等任務 |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | 未指定類型的高品質任務 |
| `writing` | `google/gemini-3-flash` | 0.1 | 文件和寫作任務 |

### 配置範例

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Claude Code 相容配置

控制 Claude Code 相容性層的各個功能。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `mcp` | boolean | 否 | - | 是否載入 `.mcp.json` 檔案 |
| `commands` | boolean | 否 | - | 是否載入 Commands |
| `skills` | boolean | 否 | - | 是否載入 Skills |
| `agents` | boolean | 否 | - | 是否載入 Agents（預留） |
| `hooks` | boolean | 否 | - | 是否載入 settings.json hooks |
| `plugins` | boolean | 否 | - | 是否載入 Marketplace 外掛 |
| `plugins_override` | object | 否 | - | 停用特定外掛（`{pluginName: boolean}`） |

### 配置範例

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Sisyphus 代理配置

控制 Sisyphus 編排系統的行為。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `disabled` | boolean | 否 | false | 停用 Sisyphus 編排系統 |
| `default_builder_enabled` | boolean | 否 | false | 啟用 OpenCode-Builder 代理 |
| `planner_enabled` | boolean | 否 | true | 啟用 Prometheus（Planner）代理 |
| `replace_plan` | boolean | 否 | true | 將預設 plan 代理降級為 subagent |

### 配置範例

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - 背景任務配置

控制背景代理管理系統的並行行為。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `defaultConcurrency` | number | 否 | - | 預設最大並行數 |
| `providerConcurrency` | object | 否 | - | Provider 級並行限制（`{providerName: number}`） |
| `modelConcurrency` | object | 否 | - | Model 級並行限制（`{modelName: number}`） |
| `staleTimeoutMs` | number | 否 | 180000 | 逾時時間（毫秒），最小 60000 |

### 優先順序

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### 配置範例

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Git Master 技能配置

控制 Git Master 技能的行為。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `commit_footer` | boolean | 否 | true | 在提交訊息中新增 "Ultraworked with Sisyphus" footer |
| `include_co_authored_by` | boolean | 否 | true | 在提交訊息中新增 "Co-authored-by: Sisyphus" trailer |

### 配置範例

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - 瀏覽器自動化配置

選擇瀏覽器自動化提供程式。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `provider` | enum | 否 | `playwright` | 瀏覽器自動化提供程式 |

### provider 可選值

| 值 | 描述 | 安裝要求 |
| --- | --- | --- |
| `playwright` | 使用 Playwright MCP 伺服器 | 自動安裝 |

### 配置範例

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Tmux 工作階段配置

控制 Tmux 工作階段管理行為。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 否 | false | 是否啟用 Tmux 工作階段管理 |
| `layout` | enum | 否 | `main-vertical` | Tmux 佈局 |
| `main_pane_size` | number | 否 | 60 | 主窗格大小（20-80） |
| `main_pane_min_width` | number | 否 | 120 | 主窗格最小寬度 |
| `agent_pane_min_width` | number | 否 | 40 | 代理窗格最小寬度 |

### layout 可選值

| 值 | 描述 |
| --- | --- |
| `main-horizontal` | 主窗格在頂部，代理窗格在底部堆疊 |
| `main-vertical` | 主窗格在左側，代理窗格在右側堆疊（預設） |
| `tiled` | 所有窗格相同大小的網格 |
| `even-horizontal` | 所有窗格水平排列 |
| `even-vertical` | 所有窗格垂直堆疊 |

### 配置範例

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Ralph Loop 配置

控制 Ralph Loop 循環工作流程的行為。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 否 | false | 是否啟用 Ralph Loop 功能 |
| `default_max_iterations` | number | 否 | 100 | 預設最大迭代次數（1-1000） |
| `state_dir` | string | 否 | - | 自訂狀態檔案目錄（相對於專案根目錄） |

### 配置範例

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - 通知配置

控制系統通知行為。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `force_enable` | boolean | 否 | false | 強制啟用 session-notification，即使偵測到外部通知外掛 |

### 配置範例

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - 註解檢查器配置

控制註解檢查器行為。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `custom_prompt` | string | 否 | - | 自訂提示，替換預設警告訊息。使用 `{{comments}}` 佔位符表示偵測到的註解 XML |

### 配置範例

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - 實驗性功能配置

控制實驗性功能的啟用。

### 欄位

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `aggressive_truncation` | boolean | 否 | - | 啟用更激進的截斷行為 |
| `auto_resume` | boolean | 否 | - | 啟用自動恢復（從思考區塊錯誤或思考停用違規中恢復） |
| `truncate_all_tool_outputs` | boolean | 否 | false | 截斷所有工具輸出，而不僅僅是白名單工具 |
| `dynamic_context_pruning` | object | 否 | - | 動態上下文修剪配置 |

### dynamic_context_pruning 配置

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 否 | false | 啟用動態上下文修剪 |
| `notification` | enum | 否 | `detailed` | 通知級別：`off` / `minimal` / `detailed` |
| `turn_protection` | object | 否 | - | Turn 保護配置 |
| `protected_tools` | string[] | 否 | - | 永不修剪的工具清單 |
| `strategies` | object | 否 | - | 修剪策略配置 |

### turn_protection 配置

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 否 | true | 啟用 turn 保護 |
| `turns` | number | 否 | 3 | 保護最近 N 輪的工具輸出（1-10） |

### strategies 配置

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `deduplication` | object | 否 | - | 去重策略配置 |
| `supersede_writes` | object | 否 | - | 寫入覆蓋策略配置 |
| `purge_errors` | object | 否 | - | 錯誤清理策略配置 |

### deduplication 配置

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 否 | true | 移除重複的工具呼叫（相同工具 + 相同參數） |

### supersede_writes 配置

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 否 | true | 在後續讀取時修剪寫入輸入 |
| `aggressive` | boolean | 否 | false | 激進模式：如果 ANY 後續讀取則修剪 ANY 寫入 |

### purge_errors 配置

| 欄位 | 類型 | 必填 | 預設值 | 描述 |
| --- | --- | --- | --- | --- |
| `enabled` | boolean | 否 | true | 在 N 輪後修剪錯誤的工具輸入 |
| `turns` | number | 否 | 5 | 修剪錯誤工具輸入的輪數（1-20） |

### 配置範例

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Skills 配置

配置 Skills（專業技能）的載入和行為。

### 配置格式

Skills 支援兩種格式：

**格式 1：簡單陣列**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**格式 2：物件配置**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Skill 定義欄位

| 欄位 | 類型 | 必填 | 描述 |
| --- | --- | --- | --- |
| `description` | string | 否 | Skill 描述 |
| `template` | string | 否 | Skill 範本 |
| `from` | string | 否 | 來源 |
| `model` | string | 否 | 使用的模型 |
| `agent` | string | 否 | 使用的代理 |
| `subtask` | boolean | 否 | 是否為子任務 |
| `argument-hint` | string | 否 | 參數提示 |
| `license` | string | 否 | 授權條款 |
| `compatibility` | string | 否 | 相容性 |
| `metadata` | object | 否 | 中繼資料 |
| `allowed-tools` | string[] | 否 | 允許的工具清單 |
| `disable` | boolean | 否 | 停用該 Skill |

### 內建 Skills

| Skill | 描述 |
| --- | --- |
| `playwright` | 瀏覽器自動化（預設） |
| `agent-browser` | 瀏覽器自動化（Vercel CLI） |
| `frontend-ui-ux` | 前端 UI/UX 設計 |
| `git-master` | Git 專家 |

## 禁用清單

以下欄位用於停用特定功能模組。

### disabled_mcps - 停用的 MCP 清單

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - 停用的代理清單

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - 停用的技能清單

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - 停用的鉤子清單

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - 停用的命令清單

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 配置 Schema 定義 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| 配置文件 | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**關鍵類型**：
- `OhMyOpenCodeConfig`：主配置類型
- `AgentOverrideConfig`：代理覆寫配置類型
- `CategoryConfig`：Category 配置類型
- `BackgroundTaskConfig`：背景任務配置類型
- `PermissionValue`：權限值類型（`ask`/`allow`/`deny`）

**關鍵列舉**：
- `BuiltinAgentNameSchema`：內建代理名稱列舉
- `BuiltinSkillNameSchema`：內建技能名稱列舉
- `BuiltinCategoryNameSchema`：內建 Category 名稱列舉
- `HookNameSchema`：鉤子名稱列舉
- `BrowserAutomationProviderSchema`：瀏覽器自動化提供程式列舉

---

## 下一課預告

> 下一課我們學習 **[內建 MCP 伺服器](../builtin-mcps/)**。
>
> 你會學到：
> - 3 個內建 MCP 伺服器的功能和使用方法
> - Exa Websearch、Context7、grep.app 的配置和最佳實踐
> - 如何使用 MCP 搜尋文件和程式碼

</details>
