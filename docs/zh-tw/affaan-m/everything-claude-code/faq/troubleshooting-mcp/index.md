---
title: "MCP 連線失敗：排查設定故障 | Everything Claude Code"
sidebarTitle: "解決 MCP 連線問題"
subtitle: "MCP 連線失敗：排查設定故障"
description: "學習 MCP 伺服器連線問題的排查方法。解決 6 種常見故障，包括 API 金鑰錯誤、上下文視窗過小、伺服器類型設定錯誤等，提供系統化修復流程。"
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# 常見問題排查：MCP 連線失敗

## 你現在的困境

設定完 MCP 伺服器後，你可能會遇到這些問題：

- ❌ Claude Code 提示 "Failed to connect to MCP server"
- ❌ GitHub/Supabase 相關指令不工作
- ❌ 上下文視窗突然變小，工具呼叫變慢
- ❌ Filesystem MCP 無法存取檔案
- ❌ 啟用的 MCP 伺服器太多，系統卡頓

別擔心，這些問題都有明確的解決方案。本課幫你系統化排查 MCP 連線問題。

---

## 常見問題 1：API 金鑰未設定或無效

### 症狀

當你嘗試使用 GitHub、Firecrawl 等 MCP 伺服器時，Claude Code 提示：

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

或

```
Failed to connect to MCP server: Authentication failed
```

### 原因

MCP 設定檔中的 `YOUR_*_HERE` 預留位置未被替換為實際的 API 金鑰。

### 解決方案

**第 1 步：檢查設定檔**

開啟 `~/.claude.json`，找到對應 MCP 伺服器的設定：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← 檢查這裡
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**第 2 步：替換預留位置**

將 `YOUR_GITHUB_PAT_HERE` 替換為你的實際 API 金鑰：

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**第 3 步：常見 MCP 伺服器的金鑰取得**

| MCP 伺服器 | 環境變數名稱                  | 取得位置                                                    |
| --- | --- | --- |
| GitHub     | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl  | `FIRECRAWL_API_KEY`            | Firecrawl Dashboard → API Keys                              |
| Supabase   | 專案參照                      | Supabase Dashboard → Settings → API                         |

**你應該看到**：重啟 Claude Code 後，相關工具可以正常呼叫。

### 踩坑提醒

::: danger 安全提示
不要將包含真實 API 金鑰的設定檔提交到 Git 儲存庫。確保 `~/.claude.json` 在 `.gitignore` 中。
:::

---

## 常見問題 2：上下文視窗過小

### 症狀

- 工具呼叫列表突然變得很短
- Claude 提示 "Context window exceeded"
- 回應速度明顯變慢

### 原因

啟用了太多 MCP 伺服器，導致上下文視窗被佔用。根據專案 README，**200k 的上下文視窗會因為啟用過多 MCP 而收縮到 70k**。

### 解決方案

**第 1 步：檢查已啟用的 MCP 數量**

查看 `~/.claude.json` 中的 `mcpServers` 部分，統計啟用的伺服器數量。

**第 2 步：使用 `disabledMcpServers` 停用不需要的伺服器**

在專案級設定（`~/.claude/settings.json` 或專案 `.claude/settings.json`）中新增：

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**第 3 步：遵循最佳實踐**

根據 README 中的建議：

- 設定 20-30 個 MCP 伺服器（在設定檔中定義）
- 每個專案啟用 < 10 個 MCP 伺服器
- 保持活躍工具數 < 80 個

**你應該看到**：工具列表恢復到正常長度，回應速度提升。

### 踩坑提醒

::: tip 經驗之談
建議按專案類型啟用不同的 MCP 組合。例如：
- Web 專案：GitHub、Firecrawl、Memory、Context7
- 資料專案：Supabase、ClickHouse、Sequential-thinking
:::

---

## 常見問題 3：伺服器類型設定錯誤

### 症狀

```
Failed to start MCP server: Command not found
```

或

```
Failed to connect: Invalid server type
```

### 原因

混淆了 `npx` 和 `http` 兩種 MCP 伺服器類型。

### 解決方案

**第 1 步：確認伺服器類型**

檢查 `mcp-configs/mcp-servers.json`，區分兩種類型：

**npx 類型**（需要 `command` 和 `args`）：
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**http 類型**（需要 `url`）：
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**第 2 步：修正設定**

| MCP 伺服器      | 正確類型 | 正確設定                                                                |
| --- | --- | --- |
| GitHub          | npx      | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel          | http     | `type: "http"`, `url: "https://mcp.vercel.com"`                         |
| Cloudflare Docs | http     | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"`            |
| Memory          | npx      | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**你應該看到**：重啟後 MCP 伺服器正常啟動。

---

## 常見問題 4：Filesystem MCP 路徑設定錯誤

### 症狀

- Filesystem 工具無法存取任何檔案
- 提示 "Path not accessible" 或 "Permission denied"

### 原因

Filesystem MCP 的路徑參數未替換為實際的專案路徑。

### 解決方案

**第 1 步：檢查設定**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**第 2 步：替換為實際路徑**

根據你的作業系統替換路徑：

**macOS/Linux**：
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**：
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**第 3 步：驗證權限**

確保設定的路徑你有讀寫權限。

**你應該看到**：Filesystem 工具可以正常存取和操作指定路徑下的檔案。

### 踩坑提醒

::: warning 注意事項
- 不要使用 `~` 符號，必須使用完整路徑
- Windows 路徑中的反斜線需要跳脫為 `\\`
- 確保路徑末尾沒有多餘的分隔符
:::

---

## 常見問題 5：Supabase 專案參照未設定

### 症狀

Supabase MCP 連線失敗，提示 "Missing project reference"。

### 原因

Supabase MCP 的 `--project-ref` 參數未設定。

### 解決方案

**第 1 步：取得專案參照**

在 Supabase Dashboard 中：
1. 進入專案設定
2. 找到 "Project Reference" 或 "API" 部分
3. 複製專案 ID（格式類似 `xxxxxxxxxxxxxxxx`）

**第 2 步：更新設定**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**你應該看到**：Supabase 工具可以正常查詢資料庫。

---

## 常見問題 6：npx 指令未找到

### 症狀

```
Failed to start MCP server: npx: command not found
```

### 原因

系統未安裝 Node.js 或 npx 不在 PATH 中。

### 解決方案

**第 1 步：檢查 Node.js 版本**

```bash
node --version
```

**第 2 步：安裝 Node.js（如果缺失）**

造訪 [nodejs.org](https://nodejs.org/) 下載並安裝最新的 LTS 版本。

**第 3 步：驗證 npx**

```bash
npx --version
```

**你應該看到**：npx 版本號正常顯示。

---

## 排查流程圖

遇到 MCP 問題時，按以下順序排查：

```
1. 檢查 API 金鑰是否設定
   ↓ (已設定)
2. 檢查啟用的 MCP 數量是否 < 10
   ↓ (數量正常)
3. 檢查伺服器類型（npx vs http）
   ↓ (類型正確)
4. 檢查路徑參數（Filesystem、Supabase）
   ↓ (路徑正確)
5. 檢查 Node.js 和 npx 是否可用
   ↓ (可用)
問題解決！
```

---

## 本課小結

MCP 連線問題大多與設定相關，記住以下要點：

- ✅ **API 金鑰**：替換所有 `YOUR_*_HERE` 預留位置
- ✅ **上下文管理**：啟用 < 10 個 MCP，使用 `disabledMcpServers` 停用不需要的
- ✅ **伺服器類型**：區分 npx 和 http 類型
- ✅ **路徑設定**：Filesystem 和 Supabase 需要設定具體路徑/參照
- ✅ **環境相依**：確保 Node.js 和 npx 可用

如果問題仍未解決，檢查 `~/.claude/settings.json` 和專案級設定是否有衝突。

---


## 下一課預告

> 下一課我們學習 **[Agent 呼叫失敗排查](../troubleshooting-agents/)**。
>
> 你會學到：
> - Agent 未載入和設定錯誤的排查方法
> - 工具權限不足的解決策略
> - Agent 執行逾時和輸出不符合預期的診斷

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能           | 檔案路徑                                                                                                               | 行號  |
| --- | --- | --- |
| MCP 設定檔     | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91  |
| 上下文視窗警告 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                                          | 67-75 |

**關鍵設定**：
- `mcpServers.mcpServers.*.command`：npx 類型伺服器的啟動指令
- `mcpServers.mcpServers.*.args`：啟動參數
- `mcpServers.mcpServers.*.env`：環境變數（API 金鑰）
- `mcpServers.mcpServers.*.type`：伺服器類型（"npx" 或 "http"）
- `mcpServers.mcpServers.*.url`：http 類型伺服器的 URL

**重要註解**：
- `mcpServers._comments.env_vars`：替換 `YOUR_*_HERE` 預留位置
- `mcpServers._comments.disabling`：使用 `disabledMcpServers` 停用伺服器
- `mcpServers._comments.context_warning`：啟用 < 10 個 MCP 保留上下文視窗

</details>
