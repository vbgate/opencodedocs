---
title: "MCP 設定：擴展外部服務 | Everything Claude Code"
sidebarTitle: "連接外部服務"
subtitle: "MCP 伺服器設定：擴展 Claude Code 的外部服務整合能力"
description: "學習 MCP 設定方法。從 15 個預設伺服器中選擇適合專案的、設定 API 金鑰和環境變數，最佳化上下文視窗使用。"
tags:
  - "mcp"
  - "configuration"
  - "integration"
prerequisite:
  - "start-installation"
order: 40
---
# MCP 伺服器設定：擴展 Claude Code 的外部服務整合能力

## 學完你能做什麼

- 理解 MCP 是什麼，以及它如何擴展 Claude Code 的能力
- 從 15 個預設 MCP 伺服器中選擇適合你專案的服務
- 正確設定 API 金鑰和環境變數
- 最佳化 MCP 使用，避免上下文視窗被佔用

## 你現在的困境

Claude Code 預設只有檔案操作和指令執行能力，但你可能需要：

- 查詢 GitHub PR 和 Issues
- 抓取網頁內容
- 操作 Supabase 資料庫
- 查詢即時文件
- 跨工作階段持久化記憶

如果手動處理這些任務，需要頻繁切換工具、複製貼上，效率低落。MCP（Model Context Protocol）伺服器可以幫你自動完成這些外部服務整合。

## 什麼時候用這一招

**適合使用 MCP 伺服器的情況**：
- 專案涉及 GitHub、Vercel、Supabase 等第三方服務
- 需要查詢即時文件（如 Cloudflare、ClickHouse）
- 需要跨工作階段保持狀態或記憶
- 需要網頁抓取或 UI 元件生成

**不需要 MCP 的情況**：
- 只涉及本機檔案操作
- 純前端開發，無外部服務整合
- 簡單的 CRUD 應用，資料庫操作少

## 🎒 開始前的準備

在開始設定前，請確認：

::: warning 前置檢查

- ✅ 已完成 [外掛安裝](../installation/)
- ✅ 熟悉基本的 JSON 設定語法
- ✅ 有需要整合服務的 API 金鑰（GitHub PAT、Firecrawl API Key 等）
- ✅ 了解 `~/.claude.json` 設定檔位置

:::

## 核心思路

### 什麼是 MCP

**MCP（Model Context Protocol）** 是 Claude Code 用來連接外部服務的協定。它讓 AI 可以存取 GitHub、資料庫、文件查詢等外部資源，就像擴展能力一樣。

**運作原理**：

```
Claude Code ←→ MCP Server ←→ External Service
   (本機)         (中介層)          (GitHub/Supabase/...)
```

### MCP 設定結構

每個 MCP 伺服器設定包含：

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",          // 啟動指令
      "args": ["-y", "package"],  // 指令參數
      "env": {                   // 環境變數
        "API_KEY": "YOUR_KEY"
      },
      "description": "功能描述"   // 說明
    }
  }
}
```

**類型**：
- **npx 類型**：使用 npm 套件執行（如 GitHub、Firecrawl）
- **http 類型**：連接到 HTTP 端點（如 Vercel、Cloudflare）

### 上下文視窗管理（重要！）

::: warning 上下文警告

每個啟用的 MCP 伺服器都會佔用上下文視窗。啟用太多會導致 200K 上下文縮小到 70K。

**黃金法則**：
- 設定 20-30 個 MCP 伺服器（全部可用）
- 每個專案啟用 < 10 個
- 活躍工具總數 < 80

使用 `disabledMcpServers` 在專案設定中停用不需要的 MCP。

:::

## 跟我做

### 第 1 步：查看可用的 MCP 伺服器

Everything Claude Code 提供了 **15 個預設 MCP 伺服器**：

| MCP 伺服器 | 類型 | 需要金鑰 | 用途 |
| --- | --- | --- | --- |
| **github** | npx | ✅ GitHub PAT | PR、Issues、Repos 操作 |
| **firecrawl** | npx | ✅ API Key | 網頁抓取和爬取 |
| **supabase** | npx | ✅ Project Ref | 資料庫操作 |
| **memory** | npx | ❌ | 跨工作階段持久化記憶 |
| **sequential-thinking** | npx | ❌ | 鏈式推理增強 |
| **vercel** | http | ❌ | 部署和專案管理 |
| **railway** | npx | ❌ | Railway 部署 |
| **cloudflare-docs** | http | ❌ | 文件搜尋 |
| **cloudflare-workers-builds** | http | ❌ | Workers 建置 |
| **cloudflare-workers-bindings** | http | ❌ | Workers 綁定 |
| **cloudflare-observability** | http | ❌ | 日誌和監控 |
| **clickhouse** | http | ❌ | 分析查詢 |
| **context7** | npx | ❌ | 即時文件查找 |
| **magic** | npx | ❌ | UI 元件生成 |
| **filesystem** | npx | ❌（需路徑） | 檔案系統操作 |

**你應該看到**：15 個 MCP 伺服器的完整列表，涵蓋 GitHub、部署、資料庫、文件查詢等常用情境。

---

### 第 2 步：複製 MCP 設定到 Claude Code

從原始碼目錄複製設定：

```bash
# 複製 MCP 設定範本
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**為什麼**：備份原始設定，方便後續參考和對比。

---

### 第 3 步：選擇需要的 MCP 伺服器

根據你的專案需求，選擇需要的 MCP 伺服器。

**範例情境**：

| 專案類型 | 建議啟用的 MCP |
| --- | --- |
| **全端應用**（GitHub + Supabase + Vercel） | github, supabase, vercel, memory, context7 |
| **前端專案**（Vercel + 文件查詢） | vercel, cloudflare-docs, context7, magic |
| **資料專案**（ClickHouse + 分析） | clickhouse, sequential-thinking, memory |
| **通用開發** | github, filesystem, memory, context7 |

**你應該看到**：清晰的專案類型與 MCP 伺服器對應關係。

---

### 第 4 步：編輯 `~/.claude.json` 設定檔

開啟你的 Claude Code 設定檔：

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

在 `~/.claude.json` 中新增 `mcpServers` 部分：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
      },
      "description": "GitHub operations - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Persistent memory across sessions"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "Live documentation lookup"
    }
  }
}
```

**為什麼**：這是核心設定，告訴 Claude Code 啟動哪些 MCP 伺服器。

**你應該看到**：`mcpServers` 物件包含你選擇的 MCP 伺服器設定。

---

### 第 5 步：替換 API 金鑰佔位符

對於需要 API 金鑰的 MCP 伺服器，替換 `YOUR_*_HERE` 佔位符：

**GitHub MCP 範例**：

1. 產生 GitHub Personal Access Token：
   - 前往 https://github.com/settings/tokens
   - 建立新 Token，勾選 `repo` 權限

2. 替換設定中的佔位符：

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // 替換為實際 Token
  }
}
```

**其他需要金鑰的 MCP**：

| MCP | 金鑰名稱 | 取得網址 |
| --- | --- | --- |
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**為什麼**：沒有實際金鑰，MCP 伺服器無法連接外部服務。

**你應該看到**：所有 `YOUR_*_HERE` 佔位符被替換為實際金鑰。

---

### 第 6 步：設定專案級 MCP 停用（建議）

為了避免所有專案都啟用所有 MCP，在專案根目錄建立 `.claude/config.json`：

```json
{
  "disabledMcpServers": [
    "supabase",      // 停用不需要的 MCP
    "railway",
    "firecrawl"
  ]
}
```

**為什麼**：這樣可以在專案級別靈活控制哪些 MCP 生效，避免上下文視窗被佔用。

**你應該看到**：`.claude/config.json` 檔案包含 `disabledMcpServers` 陣列。

---

### 第 7 步：重新啟動 Claude Code

重新啟動 Claude Code 使設定生效：

```bash
# 停止 Claude Code（如果正在執行）
# 然後重新啟動
claude
```

**為什麼**：MCP 設定在啟動時載入，需要重新啟動才能生效。

**你應該看到**：Claude Code 啟動後，MCP 伺服器自動載入。

## 檢查點 ✅

驗證 MCP 設定是否成功：

1. **檢查 MCP 載入狀態**：

在 Claude Code 中輸入：

```bash
/tool list
```

**預期結果**：看到已載入的 MCP 伺服器和工具列表。

2. **測試 MCP 功能**：

如果你啟用了 GitHub MCP，測試查詢：

```bash
# 查詢 GitHub Issues
@mcp list issues
```

**預期結果**：回傳你儲存庫的 Issues 列表。

3. **檢查上下文視窗**：

查看 `~/.claude.json` 中的工具數量：

```bash
jq '.mcpServers | length' ~/.claude.json
```

**預期結果**：啟用的 MCP 伺服器數量 < 10。

::: tip 除錯技巧

如果 MCP 沒有載入成功，檢查 Claude Code 的日誌檔：
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## 踩坑提醒

### 坑 1：啟用太多 MCP 導致上下文不足

**症狀**：對話開始時上下文視窗只有 70K 而非 200K。

**原因**：每個 MCP 啟用的工具都會佔用上下文視窗。

**解決**：
1. 檢查啟用的 MCP 數量（`~/.claude.json`）
2. 使用專案級 `disabledMcpServers` 停用不需要的 MCP
3. 保持活躍工具總數 < 80

---

### 坑 2：API 金鑰未正確設定

**症狀**：呼叫 MCP 功能時提示權限錯誤或連線失敗。

**原因**：`YOUR_*_HERE` 佔位符未被替換。

**解決**：
1. 檢查 `~/.claude.json` 中的 `env` 欄位
2. 確認所有佔位符都被替換為實際金鑰
3. 驗證金鑰是否有足夠權限（如 GitHub Token 需要 `repo` 權限）

---

### 坑 3：Filesystem MCP 路徑錯誤

**症狀**：Filesystem MCP 無法存取指定目錄。

**原因**：`args` 中的路徑未替換為實際路徑。

**解決**：
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"],  // 替換為你的專案路徑
    "description": "Filesystem operations"
  }
}
```

---

### 坑 4：專案級設定未生效

**症狀**：專案根目錄的 `disabledMcpServers` 沒有停用 MCP。

**原因**：`.claude/config.json` 路徑或格式錯誤。

**解決**：
1. 確認檔案在專案根目錄：`.claude/config.json`
2. 檢查 JSON 格式是否正確（使用 `jq .` 驗證）
3. 確認 `disabledMcpServers` 是字串陣列

## 本課小結

本課學習了 MCP 伺服器的設定方法：

**關鍵點**：
- MCP 擴展 Claude Code 的外部服務整合能力
- 從 15 個預設 MCP 中選擇適合的（建議 < 10 個）
- 替換 `YOUR_*_HERE` 佔位符為實際 API 金鑰
- 使用專案級 `disabledMcpServers` 控制啟用數量
- 保持活躍工具總數 < 80，避免上下文視窗被佔用

**下一步**：你已經設定好 MCP 伺服器，下一課學習如何使用核心 Commands。

## 下一課預告

> 下一課我們學習 **[核心 Commands 詳解](../../platforms/commands-overview/)**。
>
> 你會學到：
> - 14 個斜線指令的功能和使用情境
> - `/plan` 指令如何建立實作計畫
> - `/tdd` 指令如何執行測試驅動開發
> - 如何透過指令快速觸發複雜工作流程

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| MCP 設定範本 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| README 重要提示 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |
| --- | --- | --- |

**關鍵設定**：
- 15 個 MCP 伺服器（GitHub、Firecrawl、Supabase、Memory、Sequential-thinking、Vercel、Railway、Cloudflare 系列、ClickHouse、Context7、Magic、Filesystem）
- 支援兩種類型：npx（命令列）和 http（端點連接）
- 使用 `disabledMcpServers` 專案級設定控制啟用數量

**關鍵規則**：
- 設定 20-30 個 MCP 伺服器
- 每個專案啟用 < 10 個
- 活躍工具總數 < 80
- 上下文視窗從 200K 縮小到 70K 的風險

</details>
