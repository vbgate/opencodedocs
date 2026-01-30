---
title: "設定檔詳解: settings.json 完整參考 | Everything Claude Code"
sidebarTitle: "自訂所有設定"
subtitle: "設定檔詳解 settings.json 完整參考"
description: "學習 Everything Claude Code 的完整設定選項。掌握 Hooks 自動化、MCP 伺服器和外掛設定，快速解決設定衝突。"
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "start-installation"
  - "start-mcp-setup"
order: 190
---

# 設定檔詳解：settings.json 完整參考

## 學完你能做什麼

- 完全理解 `~/.claude/settings.json` 的所有設定選項
- 自訂 Hooks 自動化工作流程
- 設定和管理 MCP 伺服器
- 修改外掛清單和路徑設定
- 解決設定衝突和故障

## 你現在的困境

你已經在使用 Everything Claude Code，但遇到這些問題：
- "為什麼某個 Hook 沒有觸發？"
- "MCP 伺服器連線失敗，設定哪裡不對？"
- "想自訂某個功能，不知道改哪個設定檔？"
- "多個設定檔互相覆蓋，怎麼優先順序？"

本教程會給你一份完整的設定參考手冊。

## 核心思路

Claude Code 的設定系統分為三級，優先順序從高到低：

1. **專案級設定** (`.claude/settings.json`) - 僅目前專案生效
2. **全域設定** (`~/.claude/settings.json`) - 所有專案生效
3. **外掛內建設定** (Everything Claude Code 的預設設定)

::: tip 設定優先順序
設定會**合併**而非覆蓋。專案級設定會覆蓋全域設定中的同名選項，但保留其他選項。
:::

設定檔使用 JSON 格式，遵循 Claude Code Settings Schema：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

這個 schema 提供了自動補全和驗證，建議始終包含。

## 設定檔結構

### 完整設定範本

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning JSON 語法規則
- 所有鍵名和字串值必須用**雙引號**包裹
- 最後一個鍵值對後**不要加逗號**
- 註解不是標準 JSON 語法，使用 `"_comments"` 欄位代替
:::

## Hooks 設定詳解

Hooks 是 Everything Claude Code 的核心自動化機制，定義了在特定事件觸發的自動化腳本。

### Hook 類型與觸發時機

| Hook 類型 | 觸發時機 | 用途 |
|--- | --- | ---|
| `SessionStart` | Claude Code 會話開始時 | 載入上下文、偵測套件管理器 |
| `SessionEnd` | Claude Code 會話結束時 | 儲存會話狀態、評估提取模式 |
| `PreToolUse` | 工具呼叫前 | 驗證指令、阻止危險操作 |
| `PostToolUse` | 工具呼叫後 | 格式化程式碼、型別檢查 |
| `PreCompact` | 上下文壓縮前 | 儲存狀態快照 |
| `Stop` | 每次 AI 回應結束時 | 檢查 console.log 等問題 |

### Hook 設定結構

每個 Hook 條目包含以下欄位：

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Hook 描述（可選）"
}
```

#### matcher 欄位

定義觸發條件，支援以下變數：

| 變數 | 含義 | 範例值 |
|--- | --- | ---|
| `tool` | 工具名稱 | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Bash 指令內容 | `"npm run dev"` |
| `tool_input.file_path` | Write/Edit 的檔案路徑 | `"/path/to/file.ts"` |

**符合運算子**：

```javascript
// 相等
tool == "Bash"

// 正則符合
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// 邏輯運算
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### hooks 陣列

定義執行的動作，支援兩種類型：

**Type 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` 外掛根目錄的變數
- 指令會在專案根目錄執行
- 標準 JSON 格式輸出會被傳遞給 Claude Code

**Type 2: prompt**（本設定中未使用）

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### 完整 Hooks 設定範例

Everything Claude Code 提供了 15+ 個預設 Hooks，以下是完整的設定說明：

#### PreToolUse Hooks

**1. Tmux Dev Server Block**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**用途**：強制在 tmux 中執行開發伺服器，確保日誌可存取。

**符合指令**：
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Tmux Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Consider running in tmux for session persistence');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**用途**：提醒使用 tmux 執行長時間指令。

**符合指令**：
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Git Push Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**用途**：推送前提醒審查變更。

**4. Block Random MD Files**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOCKED: Unnecessary documentation file creation');console.error('[Hook] File: '+p);console.error('[Hook] Use README.md for documentation instead');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**用途**：阻止建立隨機的 .md 檔案，保持文件集中。

**允許的檔案**：
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggest Compact**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**用途**：在邏輯間隔處建議手動壓縮上下文。

#### SessionStart Hook

**Load Previous Context**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**用途**：載入上次會話上下文並偵測套件管理器。

#### PostToolUse Hooks

**1. Log PR URL**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] To review: gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**用途**：建立 PR 後記錄 URL 並提供審查指令。

**2. Auto Format**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**用途**：使用 Prettier 自動格式化 JS/TS 檔案。

**3. TypeScript Check**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**用途**：編輯 TypeScript 檔案後執行型別檢查。

**4. Console.log Warning**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] WARNING: console.log found in '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Remove console.log before committing')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**用途**：偵測並警告檔案中的 console.log 陳述式。

#### Stop Hook

**Check Console.log in Modified Files**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=>/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Remove console.log statements before committing')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**用途**：檢查修改過的檔案中的 console.log。

#### PreCompact Hook

**Save State Before Compaction**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**用途**：上下文壓縮前儲存狀態。

#### SessionEnd Hooks

**1. Persist Session State**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**用途**：持久化會話狀態。

**2. Evaluate Session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**用途**：評估會話以提取可重複使用模式。

### 自訂 Hooks

您可以透過以下方式自訂 Hooks：

#### 方法 1：修改 settings.json

```bash
# 編輯全域設定
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Your custom hook')\""
          }
        ],
        "description": "Your custom hook"
      }
    ]
  }
}
```

#### 方法 2：專案級設定覆蓋

在專案根目錄建立 `.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_custom_command\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Project-specific hook')\""
          }
        ]
      }
    ]
  }
}
```

::: tip 專案級設定的優勢
- 不影響全域設定
- 僅在特定專案生效
- 可以提交到版本控制
:::

## MCP 伺服器設定詳解

MCP（Model Context Protocol）伺服器擴充了 Claude Code 的外部服務整合能力。

### MCP 設定結構

```json
{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "your_value"
      },
      "description": "Server description"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "HTTP server description"
    }
  }
}
```

### MCP 伺服器類型

#### 類型 1: npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub operations - PRs, issues, repos"
  }
}
```

**欄位說明**：
- `command`: 執行指令，通常為 `npx`
- `args`: 參數陣列，`-y` 自動確認安裝
- `env`: 環境變數物件
- `description`: 描述文字

#### 類型 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**欄位說明**：
- `type`: 必須為 `"http"`
- `url`: 伺服器 URL
- `description`: 描述文字

### Everything Claude Code 預設 MCP 伺服器

以下是所有預設的 MCP 伺服器清單：

| 伺服器名稱 | 類型 | 描述 | 需要設定 |
|--- | --- | --- | ---|
| `github` | npx | GitHub 操作（PR、Issues、Repos） | GitHub PAT |
| `firecrawl` | npx | 網頁抓取和爬取 | Firecrawl API Key |
| `supabase` | npx | Supabase 資料庫操作 | Project Ref |
| `memory` | npx | 跨會話持久化記憶體 | 無 |
| `sequential-thinking` | npx | 鏈式推理 | 無 |
| `vercel` | http | Vercel 部署和專案管理 | 無 |
| `railway` | npx | Railway 部署 | 無 |
| `cloudflare-docs` | http | Cloudflare 文件搜尋 | 無 |
| `cloudflare-workers-builds` | http | Cloudflare Workers 建置 | 無 |
| `cloudflare-workers-bindings` | http | Cloudflare Workers 繫結 | 無 |
| `cloudflare-observability` | http | Cloudflare 日誌和監控 | 無 |
| `clickhouse` | http | ClickHouse 分析查詢 | 無 |
| `context7` | npx | 即時文件查詢 | 無 |
| `magic` | npx | Magic UI 元件 | 無 |
| `filesystem` | npx | 檔案系統操作 | 路徑設定 |

### 新增 MCP 伺服器

#### 從預設新增

1. 複製 `mcp-configs/mcp-servers.json` 中的伺服器設定
2. 貼上到您的 `~/.claude/settings.json`

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

3. 替換 `YOUR_*_HERE` 預留位置為實際值

#### 新增自訂 MCP 伺服器

```json
{
  "mcpServers": {
    "my_custom_server": {
      "command": "npx",
      "args": ["-y", "@your-org/your-server"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "description": "Custom MCP server"
    }
  }
}
```

### 停用 MCP 伺服器

使用 `disabledMcpServers` 陣列停用特定伺服器：

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning 上下文視窗警告
啟用太多 MCP 伺服器會佔用大量上下文視窗。建議啟用 **< 10 個** MCP 伺服器。
:::

## 外掛設定詳解

### plugin.json 結構

`.claude-plugin/plugin.json` 是外掛清單檔案，定義了外掛中繼資料和元件路徑。

```json
{
  "name": "everything-claude-code",
  "description": "Complete collection of battle-tested Claude Code configs",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### 欄位說明

| 欄位 | 類型 | 必填 | 說明 |
|--- | --- | --- | ---|
| `name` | string | Y | 外掛名稱 |
| `description` | string | Y | 外掛描述 |
| `author.name` | string | Y | 作者姓名 |
| `author.url` | string | N | 作者主頁 URL |
| `homepage` | string | N | 外掛首頁 |
| `repository` | string | N | 儲存庫 URL |
| `license` | string | N | 授權 |
| `keywords` | string[] | N | 關鍵詞陣列 |
| `commands` | string | Y | 指令目錄路徑 |
| `skills` | string | Y | 技能目錄路徑 |

### 修改外掛路徑

如果您需要自訂元件路徑，修改 `plugin.json`：

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## 其他設定檔

### package-manager.json

套件管理器設定，支援專案級和全域級：

```json
{
  "packageManager": "pnpm"
}
```

**位置**：
- 全域：`~/.claude/package-manager.json`
- 專案：`.claude/package-manager.json`

### marketplace.json

外掛市集清單，用於 `/plugin marketplace add` 指令：

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

狀態列設定範例：

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## 設定檔合併與優先順序

### 合併策略

設定檔按以下順序合併（後優先）：

1. 外掛內建設定
2. 全域設定 (`~/.claude/settings.json`)
3. 專案設定 (`.claude/settings.json`)

**範例**：

```json
// 外掛內建
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// 全域設定
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// 專案設定
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// 最終合併結果（專案設定優先）
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C 覆蓋了 A 和 B
  }
}
```

::: warning 注意事項
- **同名陣列會被完全覆蓋**，不是追加
- 建議在專案設定中只定義需要覆蓋的部分
- 檢視完整設定使用 `/debug config` 指令
:::

### 環境變數設定

在 `settings.json` 中定義環境變數：

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip 安全提醒
- 環境變數會暴露在設定檔中
- 不要在設定檔中儲存敏感資訊
- 使用系統環境變數或 `.env` 檔案管理金鑰
:::

## 常見設定問題排查

### 問題 1: Hook 不觸發

**可能原因**：
1. Matcher 運算式錯誤
2. Hook 設定格式錯誤
3. 設定檔未正確儲存

**排查步驟**：

```bash
# 檢查設定語法
cat ~/.claude/settings.json | python -m json.tool

# 驗證 Hook 是否載入
# 在 Claude Code 中執行
/debug config
```

**常見修復**：

```json
// ❌ 錯誤：單引號
{
  "matcher": "tool == 'Bash'"
}

// ✅ 正確：雙引號
{
  "matcher": "tool == \"Bash\""
}
```

### 問題 2: MCP 伺服器連線失敗

**可能原因**：
1. 環境變數未設定
2. 網路問題
3. 伺服器 URL 錯誤

**排查步驟**：

```bash
# 測試 MCP 伺服器
npx @modelcontextprotocol/server-github --help

# 檢查環境變數
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**常見修復**：

```json
// ❌ 錯誤：環境變數名稱錯誤
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // 應該是 GITHUB_PERSONAL_ACCESS_TOKEN
  }
}

// ✅ 正確
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### 問題 3: 設定衝突

**症狀**：某些設定項不生效

**原因**：專案級設定覆蓋了全域設定

**解決方案**：

```bash
# 檢視專案設定
cat .claude/settings.json

# 檢視全域設定
cat ~/.claude/settings.json

# 刪除專案設定（如果不需要）
rm .claude/settings.json
```

### 問題 4: JSON 格式錯誤

**症狀**：Claude Code 無法讀取設定

**排查工具**：

```bash
# 使用 jq 驗證
cat ~/.claude/settings.json | jq '.'

# 使用 Python 驗證
cat ~/.claude/settings.json | python -m json.tool

# 使用線上工具
# https://jsonlint.com/
```

**常見錯誤**：

```json
// ❌ 錯誤：末尾逗號
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ 錯誤：單引號
{
  "description": 'Hooks configuration'
}

// ❌ 錯誤：註解
{
  "hooks": {
    // This is a comment
  }
}

// ✅ 正確
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## 本課小結

本課系統講解了 Everything Claude Code 的完整設定體系：

**核心概念**：
- 設定分為三級：專案級、全域級、外掛級
- 設定優先順序：專案 > 全域 > 外掛
- JSON 格式嚴格，注意雙引號和語法

**Hooks 設定**：
- 6 種 Hook 類型，15+ 個預設 Hook
- Matcher 運算式定義觸發條件
- 支援自訂 Hook 和專案級覆蓋

**MCP 伺服器**：
- 兩種類型：npx 和 http
- 15+ 個預設伺服器
- 支援停用和自訂

**外掛設定**：
- plugin.json 定義外掛中繼資料
- 支援自訂元件路徑
- marketplace.json 用於外掛市集

**其他設定**：
- package-manager.json：套件管理器設定
- statusline.json：狀態列設定
- environmentVariables：環境變數定義

**常見問題**：
- Hook 不觸發 → 檢查 matcher 和 JSON 格式
- MCP 連線失敗 → 檢查環境變數和網路
- 設定衝突 → 檢視專案級和全域級設定
- JSON 格式錯誤 → 使用 jq 或線上工具驗證

## 下一課預告

> 下一課我們學習 **[Rules 完整參考：8 套規則集詳解](../rules-reference/)**。
>
> 你會學到：
> - Security 規則：防止敏感資料洩露
> - Coding Style 規則：程式碼風格和最佳實踐
> - Testing 規則：測試覆蓋率和 TDD 要求
> - Git Workflow 規則：提交規範和 PR 流程
> - 如何自訂規則集適應專案需求

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能          | 檔案路徑                                                                                         | 行號  |
|--- | --- | ---|
| Hooks 設定    | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json)                 | 1-158 |
| 外掛清單      | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| MCP 伺服器設定 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92  |
| 外掛市集清單  | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | -     |

**關鍵 Hook 腳本**：
- `session-start.js`：會話開始時載入上下文
- `session-end.js`：會話結束時儲存狀態
- `suggest-compact.js`：建議手動壓縮上下文
- `pre-compact.js`：壓縮前儲存狀態
- `evaluate-session.js`：評估會話提取模式

**關鍵環境變數**：
- `CLAUDE_PLUGIN_ROOT`：外掛根目錄
- `GITHUB_PERSONAL_ACCESS_TOKEN`：GitHub API 認證
- `FIRECRAWL_API_KEY`：Firecrawl API 認證

</details>
