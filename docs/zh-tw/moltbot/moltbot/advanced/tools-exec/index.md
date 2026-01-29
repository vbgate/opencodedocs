---
title: "指令執行工具與審批完全指南：安全機制、配置與故障排除 | Clawdbot 教程"
sidebarTitle: "安全地讓 AI 跑指令"
subtitle: "指令執行工具與審批"
description: "學習如何配置和使用 Clawdbot 的 exec 工具執行 Shell 指令，了解三種執行模式（sandbox/gateway/node）、安全審批機制、允許清單配置與審批流程。本教學包含實際配置範例、CLI 指令與故障排除，協助您安全地擴展 AI 助手能力。"
tags:
  - "advanced"
  - "tools"
  - "exec"
  - "security"
  - "approvals"
prerequisite:
  - "start-gateway-startup"
order: 220
---

# 指令執行工具與審批

## 學完你能做什麼

- 配置 exec 工具在三種執行模式（sandbox/gateway/node）下執行
- 瞭解並設定安全審批機制（deny/allowlist/full）
- 管理允許清單（Allowlist）與安全 bins
- 透過 UI 或聊天頻道審批 exec 請求
- 排查 exec 工具常見問題與安全錯誤

## 你現處的困境

exec 工具讓 AI 助手可以執行 Shell 指令，這既強大又危險：

- AI 會不會刪除我系統上的重要檔案？
- 如何限制 AI 只能執行安全的指令？
- 不同執行模式有什麼區別？
- 審批流程如何運作？
- 允許清單應該怎麼配置？

## 什麼時候用這一招

- 需要讓 AI 執行系統操作（如檔案管理、程式碼建構）
- 想讓 AI 呼叫自訂腳本或工具
- 需要精細控制 AI 的執行權限
- 需要安全地允許特定指令

## 🎒 開始前的準備

::: warning 前置條件
本教學假設您已完成 [啟動 Gateway](../../start/gateway-startup/)，Gateway 守護程序正在執行。
:::

- 確保 Node ≥22 已安裝
- Gateway 守護程序正在執行
- 瞭解基本的 Shell 指令與 Linux/Unix 檔案系統

## 核心思路

### Exec 工具的安全三層防護

exec 工具採用三層安全機制，從粗粒度到細粒度控制 AI 的執行權限：

1. **工具策略（Tool Policy）**：在 `tools.policy` 中控制是否允許 `exec` 工具
2. **執行主機（Host）**：指令在 sandbox/gateway/node 三種環境執行
3. **審批機制（Approvals）**：在 gateway/node 模式下，可透過 allowlist 與審批提示進一步限制

::: info 為什麼需要多層防護？
單層防護容易繞過或配置錯誤。多層防護確保即使某一層失效，其他層仍能提供保護。
:::

### 三種執行模式對比

| 執行模式 | 執行位置 | 安全等級 | 典型場景 | 是否需要審批 |
|--- | --- | --- | --- | ---|
| **sandbox** | 容器內（如 Docker） | 高 | 隔離環境、測試 | 否 |
| **gateway** | Gateway 守護程序所在機器 | 中 | 本地開發、整合 | 是（allowlist + 審批） |
| **node** | 配對的裝置節點（macOS/iOS/Android） | 中 | 裝置本地操作 | 是（allowlist + 審批） |

**關鍵區別**：
- sandbox 模式預設**不需要審批**（但可能受 Sandbox 限制）
- gateway 與 node 模式預設**需要審批**（除非設定為 `full`）

## 跟我做

### 第 1 步：瞭解 exec 工具參數

**為什麼**
瞭解 exec 工具的參數是安全配置的基礎。

exec 工具支援以下參數：

```json
{
  "tool": "exec",
  "command": "ls -la",
  "workdir": "/path/to/dir",
  "env": { "NODE_ENV": "production" },
  "yieldMs": 10000,
  "background": false,
  "timeout": 1800,
  "pty": false,
  "host": "sandbox",
  "security": "allowlist",
  "ask": "on-miss",
  "node": "mac-1"
}
```

**參數說明**：

| 參數 | 類型 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `command` | string | 必填 | 要執行的 Shell 指令 |
| `workdir` | string | 目前工作目錄 | 執行目錄 |
| `env` | object | 繼承環境 | 環境變數覆蓋 |
| `yieldMs` | number | 10000 | 超時後自動轉為後台（毫秒） |
| `background` | boolean | false | 立即後台執行 |
| `timeout` | number | 1800 | 執行超時（秒） |
| `pty` | boolean | false | 在虛擬終端機中執行（支援 TTY） |
| `host` | string | sandbox | 執行主機：`sandbox` \| `gateway` \| `node` |
| `security` | string | deny/allowlist | 安全策略：`deny` \| `allowlist` \| `full` |
| `ask` | string | on-miss | 審批策略：`off` \| `on-miss` \| `always` |
| `node` | string | - | node 模式下的目標節點 ID 或名稱 |

**你應該看到**：參數列表清晰說明了每種執行模式的控制方式。

### 第 2 步：配置預設執行模式

**為什麼**
透過設定檔設定全域預設值，避免每次 exec 呼叫都指定參數。

編輯 `~/.clawdbot/clawdbot.json`：

```json
{
  "tools": {
    "exec": {
      "host": "sandbox",
      "security": "allowlist",
      "ask": "on-miss",
      "node": "mac-1",
      "notifyOnExit": true,
      "approvalRunningNoticeMs": 10000,
      "pathPrepend": ["~/bin", "/opt/homebrew/bin"],
      "safeBins": ["jq", "grep", "cut"]
    }
  }
}
```

**設定項說明**：

| 設定項 | 類型 | 預設值 | 說明 |
|--- | --- | --- | ---|
| `host` | string | sandbox | 預設執行主機 |
| `security` | string | deny (sandbox) / allowlist (gateway, node) | 預設安全策略 |
| `ask` | string | on-miss | 預設審批策略 |
| `node` | string | - | node 模式下的預設節點 |
| `notifyOnExit` | boolean | true | 後台任務結束時發送系統事件 |
| `approvalRunningNoticeMs` | number | 10000 | 超時後發送「執行中」通知（0 停用） |
| `pathPrepend` | string[] | - | 預置到 PATH 的目錄列表 |
| `safeBins` | string[] | [預設列表] | 安全二進位列表（僅 stdin 操作） |

**你應該看到**：設定儲存後，exec 工具使用這些預設值。

### 第 3 步：使用 `/exec` 會話覆蓋

**為什麼**
會話覆蓋讓您在不修改設定檔的情況下臨時調整執行參數。

在聊天中傳送：

```
/exec host=gateway security=allowlist ask=on-miss node=mac-1
```

查看目前覆蓋值：

```
/exec
```

**你應該看到**：目前會話的 exec 參數設定。

### 第 4 步：配置允許清單（Allowlist）

**為什麼**
allowlist 是 gateway/node 模式下的核心安全機制，只允許特定指令執行。

#### 編輯 allowlist

**透過 UI 編輯**：

1. 開啟 Control UI
2. 進入 **Nodes** 標籤
3. 找到 **Exec approvals** 卡片
4. 選擇目標（Gateway 或 Node）
5. 選擇 Agent（如 `main`）
6. 點擊 **Add pattern** 新增指令模式
7. 點擊 **Save** 儲存

**透過 CLI 編輯**：

```bash
clawdbot approvals
```

**透過 JSON 檔案編輯**：

編輯 `~/.clawdbot/exec-approvals.json`：

```json
{
  "version": 1,
  "defaults": {
    "security": "deny",
    "ask": "on-miss",
    "askFallback": "deny",
    "autoAllowSkills": false
  },
  "agents": {
    "main": {
      "security": "allowlist",
      "ask": "on-miss",
      "askFallback": "deny",
      "autoAllowSkills": true,
      "allowlist": [
        {
          "id": "B0C8C0B3-2C2D-4F8A-9A3C-5A4B3C2D1E0F",
          "pattern": "~/Projects/**/bin/*",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg -n TODO",
          "lastResolvedPath": "/Users/user/Projects/bin/rg"
        },
        {
          "id": "C1D9D1C4-3D3E-5F9B-0B4D-6B5C4D3E2F1G",
          "pattern": "/opt/homebrew/bin/rg",
          "lastUsedAt": 1737150000000,
          "lastUsedCommand": "rg test",
          "lastResolvedPath": "/opt/homebrew/bin/rg"
        }
      ]
    }
  }
}
```

**Allowlist 模式說明**：

allowlist 使用 **glob 模式匹配**（不區分大小寫）：

| 模式 | 匹配 | 說明 |
|--- | --- | ---|
| `~/Projects/**/bin/*` | `/Users/user/Projects/any/bin/rg` | 匹配所有子目錄 |
| `~/.local/bin/*` | `/Users/user/.local/bin/jq` | 匹配本地 bin |
| `/opt/homebrew/bin/rg` | `/opt/homebrew/bin/rg` | 絕對路徑匹配 |

::: warning 重要規則
- **只匹配解析後的二進位路徑**，不支援 basename 匹配（如 `rg`）
- Shell 連結（`&&`、`||`、`;`）需要每個段落都滿足 allowlist
- 重導向（`>`、`<`）在 allowlist 模式下不支援
:::

**你應該看到**：allowlist 配置後，只有匹配的指令可以執行。

### 第 5 步：瞭解安全 bins（Safe Bins）

**為什麼**
safe bins 是一組僅支援 stdin 操作的安全二進位，可以在 allowlist 模式下無需顯式 allowlist。

**預設安全 bins**：

`jq`、`grep`、`cut`、`sort`、`uniq`、`head`、`tail`、`tr`、`wc`

**安全 bin 的安全特性**：

- 拒絕位置檔案參數
- 拒絕路徑-like 標記
- 只能操作傳入流（stdin）

**設定自訂 safe bins**：

```json
{
  "tools": {
    "exec": {
      "safeBins": ["jq", "grep", "my-safe-tool"]
    }
  }
}
```

**你應該看到**：safe bins 指令可以在 allowlist 模式下直接執行。

### 第 6 步：透過聊天頻道審批 exec 請求

**為什麼**
當 UI 不可用時，可以透過任何聊天頻道（WhatsApp、Telegram、Slack 等）審批 exec 請求。

#### 啟用審批轉發

編輯 `~/.clawdbot/clawdbot.json`：

```json
{
  "approvals": {
    "exec": {
      "enabled": true,
      "mode": "session",
      "agentFilter": ["main"],
      "sessionFilter": ["discord"],
      "targets": [
        { "channel": "slack", "to": "U12345678" },
        { "channel": "telegram", "to": "123456789" }
      ]
    }
  }
}
```

**設定項說明**：

| 設定項 | 說明 |
|--- | ---|
| `enabled` | 是否啟用 exec 審批轉發 |
| `mode` | `"session"` \| `"targets"` \| `"both"` - 審批目標模式 |
| `agentFilter` | 只處理特定 agent 的審批請求 |
| `sessionFilter` | 會話過濾（substring 或 regex） |
| `targets` | 目標頻道列表（`channel` + `to`） |

#### 審批請求

當 exec 工具需要審批時，您會收到包含以下資訊的訊息：

```
Exec approval request (id: abc-123)
Command: ls -la
CWD: /home/user
Agent: main
Resolved: /usr/bin/ls
Host: gateway
Security: allowlist
```

**審批選項**：

```
/approve abc-123 allow-once     # 允許一次
/approve abc-123 allow-always    # 總是允許（新增到 allowlist）
/approve abc-123 deny           # 拒絕
```

**你應該看到**：審批後，指令執行或被拒絕。

## 檢查點 ✅

- [ ] 瞭解三種執行模式（sandbox/gateway/node）的區別
- [ ] 配置了全域 exec 預設參數
- [ ] 能使用 `/exec` 指令會話覆蓋
- [ ] 配置了 allowlist（至少一條模式）
- [ ] 瞭解 safe bins 的安全特性
- [ ] 能透過聊天頻道審批 exec 請求

## 踩坑提醒

### 常見錯誤

| 錯誤 | 原因 | 解決方法 |
|--- | --- | ---|
| `Command not allowed by exec policy` | `security=deny` 或 allowlist 不匹配 | 檢查 `tools.exec.security` 與 allowlist 配置 |
| `Approval timeout` | UI 不可用，`askFallback=deny` | 設定 `askFallback=allowlist` 或啟用 UI |
| `Pattern does not resolve to binary` | allowlist 模式使用 basename | 使用完整路徑（如 `/opt/homebrew/bin/rg`） |
| `Unsupported shell token` | allowlist 模式使用 `>` 或 `&&` | 拆分指令或使用 `security=full` |
| `Node not found` | node 模式下節點未配對 | 先完成節點配對 |

### Shell 連結與重導向

::: danger 警告
在 `security=allowlist` 模式下，以下 Shell 特性**不支援**：
- 管道：`|`（但 `||` 支援）
- 重導向：`>`、`<`、`>>`
- 指令替換：`$()`、`` ` ` ``
- 後台：`&`、`;`
:::

**解決方法**：
- 使用 `security=full`（謹慎）
- 拆分為多個 exec 呼叫
- 撰寫包裝腳本並 allowlist 腳本路徑

### PATH 環境變數

不同執行模式的 PATH 處理方式不同：

| 執行模式 | PATH 處理 | 說明 |
|--- | --- | ---|
| `sandbox` | 繼承 shell login，可能被 `/etc/profile` 重置 | `pathPrepend` 會在 profile 之後套用 |
| `gateway` | 合併登入 shell PATH 到 exec 環境 | daemon 保持最小 PATH，但 exec 繼承使用者 PATH |
| `node` | 只使用傳遞的環境變數覆蓋 | macOS 節點會丟棄 `PATH` 覆蓋，headless 節點支援 prepend |

**你應該看到**：PATH 配置正確影響指令查找。

## 本課小結

exec 工具透過三層防護機制（工具策略、執行主機、審批）讓 AI 助手可以安全地執行 Shell 指令：

- **執行模式**：sandbox（容器隔離）、gateway（本地執行）、node（裝置操作）
- **安全策略**：deny（完全禁止）、allowlist（白名單）、full（完全允許）
- **審批機制**：off（不提示）、on-miss（未匹配時提示）、always（總是提示）
- **允許清單**：glob 模式匹配解析後的二進位路徑
- **安全 bins**：僅 stdin 操作的二進位可在 allowlist 模式下免審批

## 下一課預告

> 下一課我們學習 **[網路搜尋與抓取工具](../tools-web/)**
>
> 你會學到：
> - 如何使用 `web_search` 工具進行網路搜尋
> - 如何使用 `web_fetch` 工具抓取網頁內容
> - 如何設定搜尋引擎供應商（Brave、Perplexity）
> - 如何處理搜尋結果與網頁抓取錯誤

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| exec 工具定義 | [`src/agents/bash-tools.exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/bash-tools.exec.ts) | 1-500+ |
| exec 審批邏輯 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1-1268 |
| Shell 指令分析 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 500-1100 |
| Allowlist 匹配 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 507-521 |
| Safe bins 驗證 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 836-873 |
| 審批 Socket 通訊 | [`src/infra/exec-approvals.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/infra/exec-approvals.ts) | 1210-1267 |
| 程序執行 | [`src/process/exec.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/process/exec.ts) | 1-125 |
| 工具配置 Schema | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | - |

**關鍵類型**：
- `ExecHost`: `"sandbox" \| "gateway" \| "node"` - 執行主機類型
- `ExecSecurity`: `"deny" \| "allowlist" \| "full"` - 安全策略
- `ExecAsk`: `"off" \| "on-miss" \| "always"` - 審批策略
- `ExecAllowlistEntry`: allowlist 條目類型（包含 `pattern`、`lastUsedAt` 等）

**關鍵常數**：
- `DEFAULT_SECURITY = "deny"` - 預設安全策略
- `DEFAULT_ASK = "on-miss"` - 預設審批策略
- `DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"]` - 預設安全 bins

**關鍵函數**：
- `resolveExecApprovals()`: 解析 exec-approvals.json 設定
- `evaluateShellAllowlist()`: 評估 Shell 指令是否滿足 allowlist
- `matchAllowlist()`: 檢查指令路徑是否匹配 allowlist 模式
- `isSafeBinUsage()`: 驗證指令是否為安全 bin 使用
- `requestExecApprovalViaSocket()`: 透過 Unix socket 請求審批

</details>
