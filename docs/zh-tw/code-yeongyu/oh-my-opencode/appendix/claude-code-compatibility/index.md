---
title: "相容性: Claude Code 整合 | oh-my-opencode"
sidebarTitle: "複用 Claude Code 設定"
subtitle: "Claude Code 相容性：Commands、Skills、Agents、MCPs 和 Hooks 的完整支援"
description: "學習 oh-my-opencode 的 Claude Code 相容層。掌握設定載入、優先順序規則和停用開關，平滑遷移到 OpenCode。"
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Claude Code 相容性：Commands、Skills、Agents、MCPs 和 Hooks 的完整支援

## 學完你能做什麼

- 在 OpenCode 中使用 Claude Code 的現有設定和擴充功能
- 理解不同設定來源的優先順序規則
- 透過設定開關控制 Claude Code 相容功能的載入
- 平滑地從 Claude Code 遷移到 OpenCode

## 你現在的困境

如果你是從 Claude Code 遷移到 OpenCode 的使用者，你可能已經在 `~/.claude/` 目錄下配置了很多自訂 Commands、Skills 和 MCP 伺服器。重複配置這些內容很麻煩，你希望能夠在 OpenCode 中直接複用這些設定。

Oh My OpenCode 提供了完整的 Claude Code 相容層，讓你無需任何修改即可使用現有的 Claude Code 設定和擴充功能。

## 核心思路

Oh My OpenCode 透過**自動載入機制**相容 Claude Code 的設定格式。系統會在啟動時自動掃描 Claude Code 的標準設定目錄，將這些資源轉換為 OpenCode 可識別的格式並註冊到系統中。

相容性涵蓋以下功能：

| 功能 | 相容狀態 | 說明 |
|---|--- | ---|
| **Commands** | ✅ 完全支援 | 從 `~/.claude/commands/` 和 `.claude/commands/` 載入斜線指令 |
| **Skills** | ✅ 完全支援 | 從 `~/.claude/skills/` 和 `.claude/skills/` 載入專業技能 |
| **Agents** | ⚠️ 預留 | 預留介面，當前僅支援內建 Agents |
| **MCPs** | ✅ 完全支援 | 從 `.mcp.json` 和 `~/.claude/.mcp.json` 載入 MCP 伺服器設定 |
| **Hooks** | ✅ 完全支援 | 從 `settings.json` 載入自訂生命週期鉤子 |
| **Plugins** | ✅ 完全支援 | 從 `installed_plugins.json` 載入 Marketplace 擴充功能 |

---

## 設定載入優先順序

Oh My OpenCode 支援從多個位置載入設定，按照固定的優先順序順序合併。**優先順序高的設定會覆蓋優先順序低的設定**。

### Commands 載入優先順序

Commands 按以下順序載入（從高到低）：

1. `.opencode/command/` (專案級，最高優先順序)
2. `~/.config/opencode/command/` (使用者級)
3. `.claude/commands/` (專案級 Claude Code 相容)
4. `~/.claude/commands/` (使用者級 Claude Code 相容)

**原始碼位置**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// 從 4 個目錄載入 Commands，按優先順序合併
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**範例**: 如果在 `.opencode/command/refactor.md` 和 `~/.claude/commands/refactor.md` 都有同名指令，則 `.opencode/` 中的指令會生效。

### Skills 載入優先順序

Skills 按以下順序載入（從高到低）：

1. `.opencode/skills/*/SKILL.md` (專案級，最高優先順序)
2. `~/.config/opencode/skills/*/SKILL.md` (使用者級)
3. `.claude/skills/*/SKILL.md` (專案級 Claude Code 相容)
4. `~/.claude/skills/*/SKILL.md` (使用者級 Claude Code 相容)

**原始碼位置**: `src/features/opencode-skill-loader/loader.ts:206-215`

**範例**: 專案級的 Skills 會覆蓋使用者級的 Skills，確保每個專案的特定需求優先。

### MCPs 載入優先順序

MCP 設定按以下順序載入（從高到低）：

1. `.claude/.mcp.json` (專案級，最高優先順序)
2. `.mcp.json` (專案級)
3. `~/.claude/.mcp.json` (使用者級)

**原始碼位置**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**特性**: MCP 設定支援環境變數擴展（如 `${OPENAI_API_KEY}`），透過 `env-expander.ts` 自動解析。

**原始碼位置**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Hooks 載入優先順序

Hooks 從 `settings.json` 的 `hooks` 欄位載入，支援以下路徑（按優先順序）：

1. `.claude/settings.local.json` (本機設定，最高優先順序)
2. `.claude/settings.json` (專案級)
3. `~/.claude/settings.json` (使用者級)

**原始碼位置**: `src/hooks/claude-code-hooks/config.ts:46-59`

**特性**: 多個設定檔案中的 Hooks 會自動合併，而不是相互覆蓋。

---

## 設定停用開關

如果你不想載入 Claude Code 的某些設定，可以透過 `oh-my-opencode.json` 中的 `claude_code` 欄位進行細粒度控制。

### 完全停用相容性

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### 部分停用

你也可以只停用特定功能：

```jsonc
{
  "claude_code": {
    "mcp": false,         // 停用 .mcp.json 檔案（但保留內建 MCPs）
    "commands": false,     // 停用 ~/.claude/commands/ 和 .claude/commands/
    "skills": false,       // 停用 ~/.claude/skills/ 和 .claude/skills/
    "agents": false,       // 停用 ~/.claude/agents/（保留內建 Agents）
    "hooks": false,        // 停用 settings.json hooks
    "plugins": false       // 停用 Claude Code Marketplace 擴充功能
  }
}
```

**開關說明**:

| 開關 | 停用的內容 | 保留的內容 |
|---|---|---|
| `mcp` | `.mcp.json` 檔案 | 內建 MCPs（websearch、context7、grep_app） |
| `commands` | `~/.claude/commands/`、`.claude/commands/` | OpenCode 原生 Commands |
| `skills` | `~/.claude/skills/`、`.claude/skills/` | OpenCode 原生 Skills |
| `agents` | `~/.claude/agents/` | 內建 Agents（Sisyphus、Oracle、Librarian 等） |
| `hooks` | `settings.json` hooks | Oh My OpenCode 內建 Hooks |
| `plugins` | Claude Code Marketplace 擴充功能 | 內建擴充功能功能 |

### 停用特定擴充功能

使用 `plugins_override` 停用特定的 Claude Code Marketplace 擴充功能：

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // 停用 claude-mem 擴充功能
    }
  }
}
```

**原始碼位置**: `src/config/schema.ts:143`

---

## 資料儲存相容性

Oh My OpenCode 相容 Claude Code 的資料儲存格式，確保會話和任務資料的持久化和遷移。

### Todos 儲存

- **位置**: `~/.claude/todos/`
- **格式**: Claude Code 相容的 JSON 格式
- **用途**: 儲存任務清單和待辦事項

**原始碼位置**: `src/features/claude-code-session-state/index.ts`

### Transcripts 儲存

- **位置**: `~/.claude/transcripts/`
- **格式**: JSONL（每行一個 JSON 物件）
- **用途**: 儲存會話歷史和訊息記錄

**原始碼位置**: `src/features/claude-code-session-state/index.ts`

**優勢**: 與 Claude Code 共享相同的資料目錄，可以直接遷移會話歷史。

---

## Claude Code Hooks 整合

Claude Code 的 `settings.json` 中的 `hooks` 欄位定義了在特定事件點執行的自訂腳本。Oh My OpenCode 完全支援這些 Hooks。

### Hook 事件類型

| 事件 | 觸發時機 | 可執行的操作 |
|---|---|---|
| **PreToolUse** | 工具執行前 | 阻止工具呼叫、修改輸入參數、注入上下文 |
| **PostToolUse** | 工具執行後 | 新增警告、修改輸出、注入訊息 |
| **UserPromptSubmit** | 使用者提交提示詞時 | 阻止提示詞、注入訊息、轉換提示詞 |
| **Stop** | 會話進入閒置時 | 注入後續提示詞、執行自動化任務 |

**原始碼位置**: `src/hooks/claude-code-hooks/index.ts`

### Hook 設定範例

以下是一個典型的 Claude Code Hooks 設定：

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**欄位說明**:

- **matcher**: 工具名稱匹配模式（支援萬用字元 `*`）
- **type**: Hook 類型（`command`、`inject` 等）
- **command**: 要執行的 shell 命令（支援變數如 `$FILE`）
- **content**: 要注入的訊息內容

### Hook 執行機制

Oh My OpenCode 透過 `claude-code-hooks` Hook 自動執行這些自訂 Hooks。該 Hook 在所有事件點都會檢查並載入 Claude Code 的設定。

**原始碼位置**: `src/hooks/claude-code-hooks/index.ts:36-401`

**執行流程**:

1. 載入 Claude Code 的 `settings.json`
2. 解析 `hooks` 欄位並匹配當前事件
3. 按順序執行匹配的 Hooks
4. 根據返回結果修改代理行為（阻止、注入、警告等）

**範例**: 如果 PreToolUse Hook 返回 `deny`，則工具呼叫會被阻止，代理會收到錯誤提示。

---

## 常見使用場景

### 場景 1: 遷移 Claude Code 設定

如果你已經在 Claude Code 中配置了 Commands 和 Skills，可以直接在 OpenCode 中使用：

**步驟**:

1. 確保 `~/.claude/` 目錄存在並包含你的設定
2. 啟動 OpenCode，Oh My OpenCode 會自動載入這些設定
3. 在聊天中輸入 `/` 查看已載入的 Commands
4. 使用 Commands 或呼叫 Skills

**驗證**: 在 Oh My OpenCode 的啟動日誌中查看載入的設定數量。

### 場景 2: 專案級設定覆蓋

你希望為特定專案使用不同的 Skills，而不影響其他專案：

**步驟**:

1. 在專案根目錄建立 `.claude/skills/` 目錄
2. 新增專案特定的 Skill（如 `./.claude/skills/my-skill/SKILL.md`）
3. 重新啟動 OpenCode
4. 專案級 Skill 會自動覆蓋使用者級 Skill

**優勢**: 每個專案可以有獨立的設定，互不干擾。

### 場景 3: 停用 Claude Code 相容性

你只想使用 OpenCode 原生設定，不想載入 Claude Code 的舊設定：

**步驟**:

1. 編輯 `oh-my-opencode.json`
2. 新增以下設定：

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. 重新啟動 OpenCode

**結果**: 系統將忽略所有 Claude Code 設定，僅使用 OpenCode 原生設定。

---

## 踩坑提醒

### ⚠️ 設定衝突

**問題**: 如果在多個位置有同名設定（如同一個 Command 名字出現在 `.opencode/command/` 和 `~/.claude/commands/`），會導致不確定的行為。

**解決**: 理解載入優先順序，將優先順序最高的設定放在最高優先順序的目錄中。

### ⚠️ MCP 設定格式差異

**問題**: Claude Code 的 MCP 設定格式與 OpenCode略有不同，直接複製可能不工作。

**解決**: Oh My OpenCode 會自動轉換格式，但建議參考官方文件確保設定正確。

**原始碼位置**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Hooks 效能影響

**問題**: 過多的 Hooks 或複雜的 Hook 指令碼可能導致效能下降。

**解決**: 限制 Hooks 數量，只保留必要的 Hooks。可以透過 `disabled_hooks` 停用特定 Hooks。

---

## 本課小結

Oh My OpenCode 提供了完整的 Claude Code 相容層，讓你可以無縫遷移和複用現有設定：

- **設定載入優先順序**: 按專案級 > 使用者級 > Claude Code 相容的順序載入設定
- **相容性開關**: 透過 `claude_code` 欄位精確控制載入哪些功能
- **資料儲存相容**: 共用 `~/.claude/` 目錄，支援會話和任務資料遷移
- **Hooks 整合**: 完全支援 Claude Code 的生命週期鉤子系統

如果你是從 Claude Code 遷移的使用者，這層相容性可以讓你零設定開始使用 OpenCode。

---

## 下一課預告

> 下一課我們學習 **[設定參考](../../configuration-reference/)**。
>
> 你會學到：
> - 完整的 `oh-my-opencode.json` 設定欄位說明
> - 每個欄位的型別、預設值和約束條件
> - 常用設定模式和最佳實踐

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-26

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Claude Code Hooks 主入口 | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Hooks 設定載入 | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| MCP 設定載入器 | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Commands 載入器 | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Skills 載入器 | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Plugins 載入器 | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | 全文 |
| 資料儲存相容性 | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | 全文 |
| MCP 設定轉換器 | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | 全文 |
| 環境變數擴展 | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | 全文 |

**關鍵函式**：

- `createClaudeCodeHooksHook()`: 建立 Claude Code Hooks 整合 Hook，處理所有事件（PreToolUse、PostToolUse、UserPromptSubmit、Stop）
- `loadClaudeHooksConfig()`: 載入 Claude Code 的 `settings.json` 設定
- `loadMcpConfigs()`: 載入 MCP 伺服器設定，支援環境變數擴展
- `loadAllCommands()`: 從 4 個目錄載入 Commands，按優先順序合併
- `discoverSkills()`: 從 4 個目錄載入 Skills，支援 Claude Code 相容路徑
- `getClaudeConfigDir()`: 取得 Claude Code 設定目錄路徑（平台相關）

**關鍵常數**：

- 設定載入優先順序：`.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Hook 事件型別：`PreToolUse`、`PostToolUse`、`UserPromptSubmit`、`Stop`、`PreCompact`

</details>
