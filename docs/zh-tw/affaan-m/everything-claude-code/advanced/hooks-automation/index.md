---
title: "Hooks 自動化: 15+ 鉤子解析 | Everything Claude Code"
sidebarTitle: "讓 Claude 自動幹活"
subtitle: "Hooks 自動化：15+ 個鉤子深度解析"
description: "學習 Everything Claude Code 的 15+ 個自動化鉤子機制。教學講解 6 種 Hook 類型、14 個核心功能和 Node.js 腳本實作。"
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Hooks 自動化：15+ 個鉤子深度解析

## 學完你能做什麼

- 理解 Claude Code 的 6 種 Hook 類型及其觸發機制
- 掌握 14 個內建 Hooks 的功能和設定方法
- 學會使用 Node.js 腳本自訂 Hooks
- 在會話開始/結束時自動儲存和載入上下文
- 實作智慧壓縮建議、程式碼自動格式化等自動化功能

## 你現在的困境

你希望 Claude Code 能在特定事件時自動執行一些操作，比如：
- 會話開始時自動載入之前的上下文
- 每次編輯程式碼後自動格式化
- 推送程式碼前提醒你檢查變更
- 在適當時機建議壓縮上下文

但這些功能需要你手動觸發，或者你需要深入了解 Claude Code 的 Hooks 系統才能實作。本課將幫你掌握這些自動化能力。

## 什麼時候用這一招

- 需要在會話間保持上下文和工作狀態
- 希望自動執行程式碼品質檢查（格式化、TypeScript 檢查）
- 想在特定操作前得到提醒（如 git push 前檢查變更）
- 需要最佳化 Token 使用，在適當時機壓縮上下文
- 希望自動擷取會話中的可重複使用模式

## 核心思路

**什麼是 Hooks**

**Hooks** 是 Claude Code 提供的自動化機制，可以在特定事件發生時觸發自訂腳本。它就像一個「事件監聽器」，當滿足條件時自動執行預先定義的操作。

::: info Hook 的工作原理

```
使用者操作 → 觸發事件 → Hook 檢查 → 執行腳本 → 傳回結果
    ↓           ↓            ↓           ↓           ↓
  使用工具   PreToolUse   符合條件   Node.js 腳本   輸出到主控台
```

例如，當你使用 Bash 工具執行 `npm run dev` 時：
1. PreToolUse Hook 偵測到指令模式
2. 如果不在 tmux 中，自動阻止並提示
3. 你看到提示後使用正確的方式啟動

:::

**6 種 Hook 類型**

Everything Claude Code 使用了 6 種 Hook 類型：

| Hook 類型 | 觸發時機 | 使用場景 |
|--- | --- | ---|
| **PreToolUse** | 在任何工具執行前 | 驗證指令、阻止操作、提示建議 |
| **PostToolUse** | 在任何工具執行後 | 自動格式化、型別檢查、記錄日誌 |
| **PreCompact** | 在上下文壓縮前 | 儲存狀態、記錄壓縮事件 |
| **SessionStart** | 在新會話開始時 | 載入上下文、偵測套件管理器 |
| **SessionEnd** | 在會話結束時 | 儲存狀態、評估會話、擷取模式 |
| **Stop** | 在每次回應結束時 | 檢查修改的檔案、提醒清理 |

::: tip Hook 的執行順序

一個完整的會話生命週期中，Hooks 按以下順序執行：

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

其中 `[PreToolUse → PostToolUse]` 會在每次使用工具時重複執行。

:::

**Hooks 的符合規則**

每個 Hook 使用 `matcher` 運算式來決定是否執行。Claude Code 使用 JavaScript 運算式，可以檢查：

- 工具類型：`tool == "Bash"`、`tool == "Edit"`
- 指令內容：`tool_input.command matches "npm run dev"`
- 檔案路徑：`tool_input.file_path matches "\\.ts$"`
- 組合條件：`tool == "Bash" && tool_input.command matches "git push"`

**為什麼用 Node.js 腳本**

Everything Claude Code 的所有 Hooks 都使用 Node.js 腳本實作，而不是 Shell 腳本。原因是：

| 優勢 | Shell 腳本 | Node.js 腳本 |
|--- | --- | ---|
| **跨平台** | ❌ 需要 Windows/macOS/Linux 分支 | ✅ 自動跨平台 |
| **JSON 處理** | ❌ 需要額外工具（jq） | ✅ 原生支援 |
| **檔案操作** | ⚠️ 指令複雜 | ✅ fs API 簡潔 |
| **錯誤處理** | ❌ 需要手動實作 | ✅ try/catch 原生支援 |

## 跟我做

### 第 1 步：查看目前 Hooks 設定

**為什麼**
了解現有的 Hooks 設定，知道哪些自動化功能已經啟用

```bash
## 查看 hooks.json 設定
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**你應該看到**：JSON 設定檔，包含 6 種 Hook 類型的定義

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### 第 2 步：理解 PreToolUse Hooks

**為什麼**
PreToolUse 是最常用的 Hook 類型，可以阻止操作或提供提示

讓我們看看 Everything Claude Code 中的 5 個 PreToolUse Hooks：

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**功能**：阻止在 tmux 外啟動 dev server

**為什麼需要**：在 tmux 中執行 dev server 可以分離會話，即使關閉 Claude Code 也能繼續查看日誌

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**功能**：在 `git push` 前提醒你檢查變更

**為什麼需要**：避免誤提交未審查的程式碼

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**功能**：阻止建立非文件類的 .md 檔案

**為什麼需要**：避免文件分散，保持專案整潔

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**功能**：在編輯或寫入檔案時，建議進行上下文壓縮

**為什麼需要**：在適當時機手動壓縮，保持上下文精簡

### 第 3 步：理解 PostToolUse Hooks

**為什麼**
PostToolUse 在操作完成後自動執行，適合自動化品質檢查

Everything Claude Code 有 4 個 PostToolUse Hooks：

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**功能**：編輯 .js/.ts/.jsx/.tsx 檔案後自動執行 Prettier 格式化

**為什麼需要**：保持程式碼風格一致

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches( \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**功能**：編輯 .ts/.tsx 檔案後自動執行 TypeScript 型別檢查

**為什麼需要**：及早發現型別錯誤

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**功能**：編輯檔案後檢查是否有 console.log 陳述式

**為什麼需要**：避免提交除錯程式碼

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**功能**：建立 PR 後自動輸出 PR URL 和審查指令

**為什麼需要**：方便快速存取新建立的 PR

### 第 4 步：理解會話生命週期 Hooks

**為什麼**
SessionStart 和 SessionEnd Hook 用於會話間的上下文持久化

#### SessionStart Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**功能**：
- 檢查最近 7 天的會話檔案
- 檢查已學習的 skills
- 偵測套件管理器
- 輸出可載入的上下文資訊

**腳本邏輯**（`session-start.js`）：

```javascript
// 檢查最近 7 天的會話檔案
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// 檢查已學習的 skills
const learnedSkills = findFiles(learnedDir, '*.md');

// 偵測套件管理器
const pm = getPackageManager();

// 如果使用預設值，提示選擇
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### SessionEnd Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**功能**：
- 建立或更新會話檔案
- 記錄會話的開始和結束時間
- 產生會話範本（Completed、In Progress、Notes）

**會話檔案範本**（`session-end.js`）：

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
[relevant files]
```

範本中的 `[Session context goes here]` 和 `[relevant files]` 是預留位置，需要你手動填寫實際的會話內容和相關檔案。

### 第 5 步：理解壓縮相關 Hooks

**為什麼**
PreCompact 和 Stop Hook 用於上下文管理和壓縮決策

#### PreCompact Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**功能**：
- 記錄壓縮事件到日誌
- 在活動會話檔案中標記壓縮發生的時間

**腳本邏輯**（`pre-compact.js`）：

```javascript
// 記錄壓縮事件
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// 在會話檔案中標記
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Stop Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**功能**：檢查所有修改的檔案中是否有 console.log

**為什麼需要**：作為最後一道防線，避免提交除錯程式碼

### 第 6 步：理解持續學習 Hook

**為什麼**
Evaluate Session Hook 用於從會話中擷取可重複使用模式

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**功能**：
- 讀取會話記錄（transcript）
- 統計使用者訊息數量
- 如果會話長度足夠（預設 > 10 條訊息），提示評估可擷取的模式

**腳本邏輯**（`evaluate-session.js`）：

```javascript
// 讀取設定
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// 統計使用者訊息
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// 跳過短會話
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// 提示評估
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### 第 7 步：自訂 Hook

**為什麼**
根據專案需求，建立自己的自動化規則

**範例：阻止在生產環境執行危險指令**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**設定步驟**：

1. 建立自訂 Hook 腳本：
   ```bash
   # 建立 scripts/hooks/custom-hook.js
   vi scripts/hooks/custom-hook.js
   ```

2. 編輯 `~/.claude/settings.json`：
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. 重新啟動 Claude Code

**你應該看到**：Hook 觸發時的輸出資訊

## 檢查點 ✅

確認你理解了以下要點：

- [ ] Hook 是事件驅動的自動化機制
- [ ] Claude Code 有 6 種 Hook 類型
- [ ] PreToolUse 在工具執行前觸發，可以阻止操作
- [ ] PostToolUse 在工具執行後觸發，適合自動化檢查
- [ ] SessionStart/SessionEnd 用於會話間上下文持久化
- [ ] Everything Claude Code 使用 Node.js 腳本實作跨平台相容
- [ ] 可以透過修改 `~/.claude/settings.json` 自訂 Hooks

## 踩坑提醒

### ❌ Hook 腳本中的錯誤導致會話卡死

**問題**：Hook 腳本拋出例外後沒有正確退出，導致 Claude Code 等待逾時

**原因**：Node.js 腳本中的錯誤沒有被正確擷取

**解決**：
```javascript
// 錯誤範例
main();  // 如果拋出例外，會導致問題

// 正確範例
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // 即使出錯也正常退出
});
```

### ❌ 使用 Shell 腳本導致跨平台問題

**問題**：在 Windows 上執行時，Shell 腳本失敗

**原因**：Shell 指令在不同作業系統上不相容

**解決**：使用 Node.js 腳本代替 Shell 腳本

| 功能 | Shell 腳本 | Node.js 腳本 |
|--- | --- | ---|
| 檔案讀取 | `cat file.txt` | `fs.readFileSync('file.txt')` |
| 目錄檢查 | `[ -d dir ]` | `fs.existsSync(dir)` |
| 環境變數 | `$VAR` | `process.env.VAR` |

### ❌ Hook 輸出過多導致上下文膨脹

**問題**：每次操作都輸出大量除錯資訊，導致上下文快速膨脹

**原因**：Hook 腳本使用了過多的 console.log

**解決**：
- 只輸出必要的資訊
- 使用 `console.error` 輸出重要提示（會被 Claude Code 高亮顯示）
- 使用條件輸出，只在需要時列印

```javascript
// 錯誤範例
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // 輸出過多

// 正確範例
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUse Hook 阻止了必要的操作

**問題**：Hook 的符合規則過於寬泛，誤阻止了正常操作

**原因**：matcher 運算式沒有精確符合場景

**解決**：
- 測試 matcher 運算式的準確性
- 新增更多條件限制觸發範圍
- 提供明確的錯誤資訊和解決建議

```json
// 錯誤範例：符合所有 npm 指令
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// 正確範例：只符合 dev 指令
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## 本課小結

**6 種 Hook 類型總結**：

| Hook 類型 | 觸發時機 | 典型用途 | Everything Claude Code 數量 |
|--- | --- | --- | ---|
| PreToolUse | 工具執行前 | 驗證、阻止、提示 | 5 個 |
| PostToolUse | 工具執行後 | 格式化、檢查、記錄 | 4 個 |
| PreCompact | 上下文壓縮前 | 儲存狀態 | 1 個 |
| SessionStart | 新會話開始 | 載入上下文、偵測 PM | 1 個 |
| SessionEnd | 會話結束 | 儲存狀態、評估會話 | 2 個 |
| Stop | 回應結束 | 檢查修改 | 1 個 |

**核心要點**：

1. **Hook 是事件驅動**：在特定事件時自動執行
2. **Matcher 決定觸發**：使用 JavaScript 運算式符合條件
3. **Node.js 腳本實作**：跨平台相容，避免 Shell 腳本
4. **錯誤處理重要**：腳本出錯也要正常退出
5. **輸出要精簡**：避免過多日誌導致上下文膨脹
6. **設定在 settings.json**：透過修改 `~/.claude/settings.json` 新增自訂 Hook

**最佳實踐**：

```
1. 使用 PreToolUse 驗證危險操作
2. 使用 PostToolUse 自動化品質檢查
3. 使用 SessionStart/End 持久化上下文
4. 自訂 Hook 時先測試 matcher 運算式
5. 腳本中使用 try/catch 和 process.exit(0)
6. 只輸出必要資訊，避免上下文膨脹
```

## 下一課預告

> 下一課我們學習 **[持續學習機制](../continuous-learning/)**。
>
> 你會學到：
> - Continuous Learning 如何自動擷取可重複使用模式
> - 使用 `/learn` 指令手動擷取模式
> - 設定會話評估的最小長度
> - 管理 learned skills 目錄

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Hooks 主設定 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart 腳本 | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd 腳本 | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact 腳本 | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact 腳本 | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session 腳本 | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| 工具庫 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| 套件管理器偵測 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**關鍵常數**：
- 無（設定動態載入）

**關鍵函數**：
- `getSessionsDir()`：取得會話目錄路徑
- `getLearnedSkillsDir()`：取得 learned skills 目錄路徑
- `findFiles(dir, pattern, options)`：尋找檔案，支援按時間過濾
- `ensureDir(path)`：確保目錄存在，不存在則建立
- `getPackageManager()`：偵測套件管理器（支援 6 種優先順序）
- `log(message)`：輸出 Hook 日誌資訊

**關鍵設定**：
- `min_session_length`：會話評估的最小訊息數（預設 10）
- `COMPACT_THRESHOLD`：建議壓縮的工具呼叫閾值（預設 50）
- `CLAUDE_PLUGIN_ROOT`：外掛根目錄環境變數

**14 個核心 Hooks**：
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
