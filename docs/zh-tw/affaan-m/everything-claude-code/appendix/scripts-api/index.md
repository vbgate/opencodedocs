---
title: "Scripts API: Node.js 腳本 | Everything Claude Code"
sidebarTitle: "編寫你的 Hook 腳本"
subtitle: "Scripts API: Node.js 腳本"
description: "學習 Everything Claude Code 的 Scripts API 介面。掌握平台檢測、檔案操作、套件管理器 API 和 Hook 腳本的使用方法。"
tags:
  - "scripts-api"
  - "api"
  - "nodejs"
  - "utils"
  - "package-manager"
  - "hooks"
prerequisite:
  - "start-package-manager-setup"
order: 215
---

# Scripts API 參考：Node.js 腳本介面

## 學完你能做什麼

- 完全理解 Everything Claude Code 的腳本 API 介面
- 使用平台檢測和跨平台工具函式
- 配置和使用套件管理器自動檢測機制
- 編寫自訂 Hook 腳本擴展自動化能力
- 除錯和修改現有的腳本實作

## 你現在的困境

你已經知道 Everything Claude Code 有很多自動化腳本，但遇到這些問題：

- 「這些 Node.js 腳本具體提供了哪些 API？」
- 「如何自訂 Hook 腳本？」
- 「套件管理器檢測的優先順序是什麼？」
- 「腳本中如何實現跨平台相容？」

本教學會給你一份完整的 Scripts API 參考手冊。

## 核心思路

Everything Claude Code 的腳本系統分為兩類：

1. **共享工具庫**（`scripts/lib/`）- 提供跨平台函式和 API
2. **Hook 腳本**（`scripts/hooks/`）- 在特定事件觸發的自動化邏輯

所有腳本都支援 **Windows、macOS 和 Linux** 三大平台，使用 Node.js 原生模組實作。

### 腳本結構

```
scripts/
├── lib/
│   ├── utils.js              # 通用工具函式
│   └── package-manager.js    # 套件管理器檢測
├── hooks/
│   ├── session-start.js       # SessionStart Hook
│   ├── session-end.js         # SessionEnd Hook
│   ├── pre-compact.js        # PreCompact Hook
│   ├── suggest-compact.js     # PreToolUse Hook
│   └── evaluate-session.js   # Stop Hook
└── setup-package-manager.js   # 套件管理器設定腳本
```

## lib/utils.js - 通用工具函式

這個模組提供了跨平台的工具函式，包括平台檢測、檔案操作、系統指令等。

### 平台檢測

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| 函式 | 類型 | 回傳值 | 說明 |
|--- | --- | --- | ---|
| `isWindows` | boolean | `true/false` | 目前是否為 Windows 平台 |
| `isMacOS` | boolean | `true/false` | 目前是否為 macOS 平台 |
| `isLinux` | boolean | `true/false` | 目前是否為 Linux 平台 |

**實作原理**：基於 `process.platform` 進行判斷

```javascript
const isWindows = process.platform === 'win32';
const isMacOS = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
```

### 目錄工具

```javascript
const {
  getHomeDir,
  getClaudeDir,
  getSessionsDir,
  getLearnedSkillsDir,
  getTempDir,
  ensureDir
} = require('./lib/utils');
```

#### getHomeDir()

取得使用者主目錄（跨平台相容）

**回傳值**：`string` - 使用者主目錄路徑

**範例**：
```javascript
const homeDir = getHomeDir();
// Windows: C:\Users\username
// macOS: /Users/username
// Linux: /home/username
```

#### getClaudeDir()

取得 Claude Code 設定目錄

**回傳值**：`string` - `~/.claude` 目錄路徑

**範例**：
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

取得工作階段檔案目錄

**回傳值**：`string` - `~/.claude/sessions` 目錄路徑

**範例**：
```javascript
const sessionsDir = getSessionsDir();
// /Users/username/.claude/sessions
```

#### getLearnedSkillsDir()

取得已學習技能目錄

**回傳值**：`string` - `~/.claude/skills/learned` 目錄路徑

**範例**：
```javascript
const learnedDir = getLearnedSkillsDir();
// /Users/username/.claude/skills/learned
```

#### getTempDir()

取得系統暫存目錄（跨平台）

**回傳值**：`string` - 暫存目錄路徑

**範例**：
```javascript
const tempDir = getTempDir();
// macOS: /var/folders/...
// Linux: /tmp
// Windows: C:\Users\username\AppData\Local\Temp
```

#### ensureDir(dirPath)

確保目錄存在，不存在則建立

**參數**：
- `dirPath` (string) - 目錄路徑

**回傳值**：`string` - 目錄路徑

**範例**：
```javascript
const dir = ensureDir('/path/to/new/dir');
// 如果目錄不存在，會遞迴建立
```

### 日期時間工具

```javascript
const {
  getDateString,
  getTimeString,
  getDateTimeString
} = require('./lib/utils');
```

#### getDateString()

取得目前日期（格式：YYYY-MM-DD）

**回傳值**：`string` - 日期字串

**範例**：
```javascript
const date = getDateString();
// '2026-01-25'
```

#### getTimeString()

取得目前時間（格式：HH:MM）

**回傳值**：`string` - 時間字串

**範例**：
```javascript
const time = getTimeString();
// '14:30'
```

#### getDateTimeString()

取得目前日期時間（格式：YYYY-MM-DD HH:MM:SS）

**回傳值**：`string` - 日期時間字串

**範例**：
```javascript
const datetime = getDateTimeString();
// '2026-01-25 14:30:45'
```

### 檔案操作

```javascript
const {
  findFiles,
  readFile,
  writeFile,
  appendFile,
  replaceInFile,
  countInFile,
  grepFile
} = require('./lib/utils');
```

#### findFiles(dir, pattern, options)

在目錄中尋找符合模式的檔案（跨平台的 `find` 替代方案）

**參數**：
- `dir` (string) - 要搜尋的目錄
- `pattern` (string) - 檔案模式（如 `"*.tmp"`, `"*.md"`）
- `options` (object, 可選) - 選項
  - `maxAge` (number) - 最大檔案天數
  - `recursive` (boolean) - 是否遞迴搜尋

**回傳值**：`Array<{path: string, mtime: number}>` - 符合的檔案列表，按修改時間降序排序

**範例**：
```javascript
// 尋找最近 7 天的 .tmp 檔案
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// 遞迴尋找所有 .md 檔案
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip 跨平台相容
這個函式提供了跨平台的檔案尋找功能，不依賴 Unix `find` 指令，因此可以在 Windows 上正常運作。
:::

#### readFile(filePath)

安全讀取文字檔案

**參數**：
- `filePath` (string) - 檔案路徑

**回傳值**：`string | null` - 檔案內容，讀取失敗回傳 `null`

**範例**：
```javascript
const content = readFile('/path/to/file.txt');
if (content !== null) {
  console.log(content);
}
```

#### writeFile(filePath, content)

寫入文字檔案

**參數**：
- `filePath` (string) - 檔案路徑
- `content` (string) - 檔案內容

**回傳值**：無

**範例**：
```javascript
writeFile('/path/to/file.txt', 'Hello, World!');
// 如果目錄不存在，會自動建立
```

#### appendFile(filePath, content)

附加內容到文字檔案

**參數**：
- `filePath` (string) - 檔案路徑
- `content` (string) - 要附加的內容

**回傳值**：無

**範例**：
```javascript
appendFile('/path/to/log.txt', 'New log entry\n');
```

#### replaceInFile(filePath, search, replace)

替換檔案中的文字（跨平台 `sed` 替代方案）

**參數**：
- `filePath` (string) - 檔案路徑
- `search` (string | RegExp) - 要尋找的內容
- `replace` (string) - 替換內容

**回傳值**：`boolean` - 是否成功替換

**範例**：
```javascript
const success = replaceInFile('/path/to/file.txt', 'old text', 'new text');
// true: 替換成功
// false: 檔案不存在或讀取失敗
```

#### countInFile(filePath, pattern)

統計檔案中模式出現的次數

**參數**：
- `filePath` (string) - 檔案路徑
- `pattern` (string | RegExp) - 要統計的模式

**回傳值**：`number` - 符合次數

**範例**：
```javascript
const count = countInFile('/path/to/file.txt', /error/g);
// 5
```

#### grepFile(filePath, pattern)

在檔案中搜尋模式並回傳符合的行和行號

**參數**：
- `filePath` (string) - 檔案路徑
- `pattern` (string | RegExp) - 要搜尋的模式

**回傳值**：`Array<{lineNumber: number, content: string}>` - 符合的行列表

**範例**：
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```

### Hook I/O

```javascript
const {
  readStdinJson,
  log,
  output
} = require('./lib/utils');
```

#### readStdinJson()

從標準輸入讀取 JSON 資料（用於 Hook 輸入）

**回傳值**：`Promise<object>` - 解析後的 JSON 物件

**範例**：
```javascript
async function main() {
  const hookInput = await readStdinJson();
  console.log(hookInput.tool);
  console.log(hookInput.tool_input);
}
```

::: tip Hook 輸入格式
Claude Code 傳遞給 Hook 的輸入格式為：
```json
{
  "tool": "Bash",
  "tool_input": { "command": "npm run dev" },
  "tool_output": { "output": "..." }
}
```
:::

#### log(message)

記錄日誌到 stderr（對使用者可見）

**參數**：
- `message` (string) - 日誌訊息

**回傳值**：無

**範例**：
```javascript
log('[SessionStart] Loading context...');
// 輸出到 stderr，使用者在 Claude Code 中可見
```

#### output(data)

輸出資料到 stdout（回傳給 Claude Code）

**參數**：
- `data` (object | string) - 要輸出的資料

**回傳值**：無

**範例**：
```javascript
// 輸出物件（自動 JSON 序列化）
output({ success: true, message: 'Completed' });

// 輸出字串
output('Hello, Claude');
```

### 系統指令

```javascript
const {
  commandExists,
  runCommand,
  isGitRepo,
  getGitModifiedFiles
} = require('./lib/utils');
```

#### commandExists(cmd)

檢查指令是否存在於 PATH 中

**參數**：
- `cmd` (string) - 指令名稱

**回傳值**：`boolean` - 指令是否存在

**範例**：
```javascript
if (commandExists('pnpm')) {
  console.log('pnpm is available');
}
```

::: warning 安全驗證
該函式會對指令名稱進行正規驗證，只允許字母、數字、底線、點和短橫線，防止指令注入。
:::

#### runCommand(cmd, options)

執行指令並回傳輸出

**參數**：
- `cmd` (string) - 要執行的指令（必須是可信的、硬編碼的指令）
- `options` (object, 可選) - `execSync` 選項

**回傳值**：`{success: boolean, output: string}` - 執行結果

**範例**：
```javascript
const result = runCommand('git status');
if (result.success) {
  console.log(result.output);
} else {
  console.error(result.output);
}
```

::: danger 安全警告
**僅對可信、硬編碼的指令使用此函式**。不要將使用者控制的輸入直接傳遞給此函式。對於使用者輸入，請使用帶參數陣列的 `spawnSync`。
:::

#### isGitRepo()

檢查目前目錄是否為 Git 儲存庫

**回傳值**：`boolean` - 是否為 Git 儲存庫

**範例**：
```javascript
if (isGitRepo()) {
  console.log('This is a Git repository');
}
```

#### getGitModifiedFiles(patterns = [])

取得 Git 修改的檔案列表

**參數**：
- `patterns` (string[], 可選) - 過濾模式陣列

**回傳值**：`string[]` - 修改的檔案路徑列表

**範例**：
```javascript
// 取得所有修改的檔案
const allModified = getGitModifiedFiles();

// 只取得 TypeScript 檔案
const tsModified = getGitModifiedFiles([/\.ts$/, /\.tsx$/]);
```

## lib/package-manager.js - 套件管理器 API

這個模組提供了套件管理器自動檢測和設定 API。

### 支援的套件管理器

```javascript
const { PACKAGE_MANAGERS } = require('./lib/package-manager');
```

| 套件管理器 | lock 檔案 | install 指令 | run 指令 | exec 指令 |
|--- | --- | --- | --- | ---|
| `npm` | package-lock.json | `npm install` | `npm run` | `npx` |
| `pnpm` | pnpm-lock.yaml | `pnpm install` | `pnpm` | `pnpm dlx` |
| `yarn` | yarn.lock | `yarn` | `yarn` | `yarn dlx` |
| `bun` | bun.lockb | `bun install` | `bun run` | `bunx` |

### 檢測優先順序

```javascript
const { DETECTION_PRIORITY } = require('./lib/package-manager');

// ['pnpm', 'bun', 'yarn', 'npm']
```

套件管理器檢測按以下優先順序進行（從高到低）：

1. 環境變數 `CLAUDE_PACKAGE_MANAGER`
2. 專案級設定 `.claude/package-manager.json`
3. `package.json` 的 `packageManager` 欄位
4. Lock 檔案檢測
5. 全域使用者偏好 `~/.claude/package-manager.json`
6. 按優先順序回傳第一個可用的套件管理器

### 核心函式

```javascript
const {
  getPackageManager,
  setPreferredPackageManager,
  setProjectPackageManager,
  getAvailablePackageManagers,
  getRunCommand,
  getExecCommand,
  getCommandPattern
} = require('./lib/package-manager');
```

#### getPackageManager(options = {})

取得目前專案應使用的套件管理器

**參數**：
- `options` (object, 可選)
  - `projectDir` (string) - 專案目錄路徑，預設為 `process.cwd()`
  - `fallbackOrder` (string[]) - 備用順序，預設為 `['pnpm', 'bun', 'yarn', 'npm']`

**回傳值**：`{name: string, config: object, source: string}`

- `name`: 套件管理器名稱
- `config`: 套件管理器設定物件
- `source`: 檢測來源（`'environment' | 'project-config' | 'package.json' | 'lock-file' | 'global-config' | 'fallback' | 'default'`）

**範例**：
```javascript
const pm = getPackageManager();
console.log(pm.name);        // 'pnpm'
console.log(pm.source);      // 'lock-file'
console.log(pm.config);      // { name: 'pnpm', lockFile: 'pnpm-lock.yaml', ... }
```

#### setPreferredPackageManager(pmName)

設定全域套件管理器偏好

**參數**：
- `pmName` (string) - 套件管理器名稱（`npm | pnpm | yarn | bun`）

**回傳值**：`object` - 設定物件

**範例**：
```javascript
const config = setPreferredPackageManager('pnpm');
// 儲存到 ~/.claude/package-manager.json
// { packageManager: 'pnpm', setAt: '2026-01-25T...' }
```

#### setProjectPackageManager(pmName, projectDir)

設定專案級套件管理器偏好

**參數**：
- `pmName` (string) - 套件管理器名稱
- `projectDir` (string) - 專案目錄路徑，預設為 `process.cwd()`

**回傳值**：`object` - 設定物件

**範例**：
```javascript
const config = setProjectPackageManager('bun', '/path/to/project');
// 儲存到 /path/to/project/.claude/package-manager.json
// { packageManager: 'bun', setAt: '2026-01-25T...' }
```

#### getAvailablePackageManagers()

取得系統中已安裝的套件管理器列表

**回傳值**：`string[]` - 可用的套件管理器名稱陣列

**範例**：
```javascript
const available = getAvailablePackageManagers();
// ['pnpm', 'npm']  // 如果只安裝了 pnpm 和 npm
```

#### getRunCommand(script, options = {})

取得執行腳本的指令

**參數**：
- `script` (string) - 腳本名稱（如 `"dev"`, `"build"`, `"test"`）
- `options` (object, 可選) - 專案目錄選項

**回傳值**：`string` - 完整的執行指令

**範例**：
```javascript
const devCmd = getRunCommand('dev');
// 'npm run dev'  或  'pnpm dev'  或  'bun run dev'

const buildCmd = getRunCommand('build');
// 'npm run build'  或  'pnpm build'
```

**內建腳本捷徑**：
- `install` → 回傳 `installCmd`
- `test` → 回傳 `testCmd`
- `build` → 回傳 `buildCmd`
- `dev` → 回傳 `devCmd`
- 其他 → 回傳 `${runCmd} ${script}`

#### getExecCommand(binary, args = '', options = {})

取得執行套件二進位檔的指令

**參數**：
- `binary` (string) - 二進位檔名稱（如 `"prettier"`, `"eslint"`）
- `args` (string, 可選) - 參數字串
- `options` (object, 可選) - 專案目錄選項

**回傳值**：`string` - 完整的執行指令

**範例**：
```javascript
const cmd = getExecCommand('prettier', '--write file.js');
// 'npx prettier --write file.js'  或  'pnpm dlx prettier --write file.js'

const eslintCmd = getExecCommand('eslint');
// 'npx eslint'  或  'bunx eslint'
```

#### getCommandPattern(action)

產生符合所有套件管理器指令的正規表達式模式

**參數**：
- `action` (string) - 操作類型（`'dev' | 'install' | 'test' | 'build'` 或自訂腳本名稱）

**回傳值**：`string` - 正規表達式模式

**範例**：
```javascript
const devPattern = getCommandPattern('dev');
// (npm run dev|pnpm( run)? dev|yarn dev|bun run dev)

const installPattern = getCommandPattern('install');
// (npm install|pnpm install|yarn( install)?|bun install)
```

## setup-package-manager.js - 套件管理器設定腳本

這是可執行的 CLI 腳本，用於互動式設定套件管理器偏好。

### 使用方法

```bash
# 檢測並顯示目前套件管理器
node scripts/setup-package-manager.js --detect

# 設定全域偏好
node scripts/setup-package-manager.js --global pnpm

# 設定專案偏好
node scripts/setup-package-manager.js --project bun

# 列出可用的套件管理器
node scripts/setup-package-manager.js --list

# 顯示說明
node scripts/setup-package-manager.js --help
```

### 指令列參數

| 參數 | 說明 |
|--- | ---|
| `--detect` | 檢測並顯示目前套件管理器 |
|--- | ---|
|--- | ---|
| `--list` | 列出所有可用的套件管理器 |
| `--help` | 顯示說明資訊 |

### 輸出範例

**--detect 輸出**：
```
=== Package Manager Detection ===

Current selection:
  Package Manager: pnpm
  Source: lock-file

Detection results:
  From package.json: not specified
  From lock file: pnpm
  Environment var: not set

Available package managers:
  ✓ pnpm (current)
  ✓ npm
  ✗ yarn
  ✗ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

## Hook 腳本詳解

### session-start.js - 工作階段開始 Hook

**Hook 類型**：`SessionStart`

**觸發時機**：Claude Code 工作階段開始時

**功能**：
- 檢查最近的工作階段檔案（最近 7 天）
- 檢查已學習的技能檔案
- 檢測並回報套件管理器
- 如果套件管理器透過 fallback 檢測，顯示選擇提示

**輸出範例**：
```
[SessionStart] Found 3 recent session(s)
[SessionStart] Latest: /Users/username/.claude/sessions/2026-01-25-session.tmp
[SessionStart] 5 learned skill(s) available in /Users/username/.claude/skills/learned
[SessionStart] Package manager: pnpm (lock-file)
```

### session-end.js - 工作階段結束 Hook

**Hook 類型**：`SessionEnd`

**觸發時機**：Claude Code 工作階段結束時

**功能**：
- 建立或更新當日工作階段檔案
- 記錄工作階段開始和結束時間
- 提供工作階段狀態模板（已完成、進行中、筆記）

**工作階段檔案模板**：
```markdown
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 14:30
**Last Updated:** 15:45

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
```
[relevant files]
```
```

### pre-compact.js - 壓縮前 Hook

**Hook 類型**：`PreCompact`

**觸發時機**：Claude Code 壓縮上下文之前

**功能**：
- 記錄壓縮事件到日誌檔案
- 在活動工作階段檔案中標記壓縮發生時間

**輸出範例**：
```
[PreCompact] State saved before compaction
```

**日誌檔案**：`~/.claude/sessions/compaction-log.txt`

### suggest-compact.js - 壓縮建議 Hook

**Hook 類型**：`PreToolUse`

**觸發時機**：每次工具呼叫後（通常是 Edit 或 Write）

**功能**：
- 追蹤工具呼叫次數
- 在達到閾值時建議手動壓縮
- 定期提示壓縮時機

**環境變數**：
- `COMPACT_THRESHOLD` - 壓縮閾值（預設：50）
- `CLAUDE_SESSION_ID` - 工作階段 ID

**輸出範例**：
```
[StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
[StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
```

::: tip 手動壓縮 vs 自動壓縮
為什麼推薦手動壓縮？
- 自動壓縮通常在任務中途觸發，導致上下文遺失
- 手動壓縮可以在邏輯階段切換時保留重要資訊
- 壓縮時機：探索階段結束、執行階段開始、里程碑完成
:::

### evaluate-session.js - 工作階段評估 Hook

**Hook 類型**：`Stop`

**觸發時機**：每次 AI 回應結束時

**功能**：
- 檢查工作階段長度（基於使用者訊息數）
- 評估工作階段是否包含可提取的模式
- 提示儲存學習到的技能

**設定檔案**：`skills/continuous-learning/config.json`

**環境變數**：
- `CLAUDE_TRANSCRIPT_PATH` - 工作階段記錄檔案路徑

**輸出範例**：
```
[ContinuousLearning] Session has 25 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/username/.claude/skills/learned
```

::: tip 為什麼使用 Stop 而非 UserPromptSubmit？
- Stop 每個回應只觸發一次（輕量級）
- UserPromptSubmit 每則訊息都觸發（高延遲）
:::

## 自訂 Hook 腳本

### 建立自訂 Hook

1. **在 `scripts/hooks/` 目錄下建立腳本**

```javascript
#!/usr/bin/env node
/**
 * Custom Hook - Your Description
 *
 * Cross-platform (Windows, macOS, Linux)
 */

const { log, output } = require('../lib/utils');

async function main() {
  // 你的邏輯
  log('[CustomHook] Processing...');
  
  // 輸出結果
  output({ success: true });
  
  process.exit(0);
}

main().catch(err => {
  console.error('[CustomHook] Error:', err.message);
  process.exit(0); // 不阻擋工作階段
});
```

2. **在 `hooks/hooks.json` 中設定 Hook**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/your-hook.js\""
    }
  ],
  "description": "Your custom hook description"
}
```

3. **測試 Hook**

```bash
# 在 Claude Code 中觸發條件，檢查輸出
```

### 最佳實踐

#### 1. 錯誤處理

```javascript
main().catch(err => {
  console.error('[HookName] Error:', err.message);
  process.exit(0); // 不阻擋工作階段
});
```

#### 2. 使用工具庫

```javascript
const {
  log,
  readFile,
  writeFile,
  ensureDir
} = require('../lib/utils');
```

#### 3. 跨平台路徑

```javascript
const path = require('path');
const filePath = path.join(getHomeDir(), '.claude', 'config.json');
```

#### 4. 環境變數

```javascript
const sessionId = process.env.CLAUDE_SESSION_ID || 'default';
const transcriptPath = process.env.CLAUDE_TRANSCRIPT_PATH;
```

## 測試腳本

### 測試工具函式

```javascript
const { findFiles, readFile, writeFile } = require('./lib/utils');

// 測試檔案尋找
const files = findFiles('/tmp', '*.tmp', { maxAge: 7 });
console.log('Found files:', files);

// 測試檔案讀寫
writeFile('/tmp/test.txt', 'Hello, World!');
const content = readFile('/tmp/test.txt');
console.log('Content:', content);
```

### 測試套件管理器檢測

```javascript
const { getPackageManager, getRunCommand } = require('./lib/package-manager');

const pm = getPackageManager();
console.log('Package manager:', pm.name);
console.log('Source:', pm.source);
console.log('Dev command:', getRunCommand('dev'));
```

### 測試 Hook 腳本

```bash
# 直接執行 Hook 腳本（需要提供環境變數）
CLAUDE_SESSION_ID=test CLAUDE_TRANSCRIPT_PATH=/tmp/transcript.json \
  node scripts/hooks/session-start.js
```

## 除錯技巧

### 1. 使用 log 輸出

```javascript
const { log } = require('../lib/utils');

log('[Debug] Current value:', value);
```

### 2. 捕獲錯誤

```javascript
try {
  // 可能出錯的程式碼
} catch (err) {
  console.error('[Error]', err.message);
  console.error('[Stack]', err.stack);
}
```

### 3. 驗證檔案路徑

```javascript
const path = require('path');
const { existsSync } = require('fs');

const filePath = path.join(getHomeDir(), '.claude', 'config.json');
console.log('Config path:', filePath);
console.log('Exists:', existsSync(filePath));
```

### 4. 查看 Hook 執行日誌

```bash
# 在 Claude Code 中，Hook 的 stderr 輸出會顯示在回應中
# 尋找 [HookName] 前綴的日誌
```

## 常見問題

### Q1: Hook 腳本沒有執行？

**可能原因**：
1. `hooks/hooks.json` 中的 matcher 設定錯誤
2. 腳本路徑錯誤
3. 腳本沒有執行權限

**排查步驟**：
```bash
# 檢查腳本路徑
ls -la scripts/hooks/

# 手動執行腳本測試
node scripts/hooks/session-start.js

# 驗證 hooks.json 語法
cat hooks/hooks.json | jq '.'
```

### Q2: Windows 上路徑錯誤？

**原因**：Windows 使用反斜線，而 Unix 使用正斜線

**解決方案**：
```javascript
// ❌ 錯誤：硬編碼路徑分隔符號
const path = 'C:\\Users\\username\\.claude';

// ✅ 正確：使用 path.join()
const path = require('path');
const claudePath = path.join(getHomeDir(), '.claude');
```

### Q3: 如何除錯 Hook 輸入？

**方法**：將 Hook 輸入寫入暫存檔案

```javascript
const { writeFileSync } = require('fs');
const path = require('path');

async function main() {
  const hookInput = await readStdinJson();
  
  // 寫入除錯檔案
  const debugPath = path.join(getTempDir(), 'hook-debug.json');
  writeFileSync(debugPath, JSON.stringify(hookInput, null, 2));
  
  console.error('[Debug] Input saved to:', debugPath);
}
```

## 本課小結

本課系統講解了 Everything Claude Code 的 Scripts API：

**核心模組**：
- `lib/utils.js`：跨平台工具函式（平台檢測、檔案操作、系統指令）
- `lib/package-manager.js`：套件管理器檢測和設定 API
- `setup-package-manager.js`：CLI 設定工具

**Hook 腳本**：
- `session-start.js`：工作階段開始時載入上下文
- `session-end.js`：工作階段結束時儲存狀態
- `pre-compact.js`：壓縮前儲存狀態
- `suggest-compact.js`：建議手動壓縮時機
- `evaluate-session.js`：評估工作階段提取模式

**最佳實踐**：
- 使用工具庫函式確保跨平台相容
- Hook 腳本不阻擋工作階段（錯誤時退出碼為 0）
- 使用 `log()` 輸出除錯資訊
- 使用 `process.env` 讀取環境變數

**除錯技巧**：
- 直接執行腳本測試
- 使用暫存檔案儲存除錯資料
- 檢查 matcher 設定和腳本路徑

## 下一課預告

> 下一課我們學習 **[測試套件：執行與自訂](../test-suite/)**。
>
> 你會學到：
> - 如何執行測試套件
> - 如何為工具函式撰寫單元測試
> - 如何為 Hook 腳本撰寫整合測試
> - 如何新增自訂測試案例

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能模組 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 通用工具函式 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
| 套件管理器 API | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-391 |
| 套件管理器設定腳本 | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js) | 1-207 |
| SessionStart Hook | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd Hook | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session Hook | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |

**關鍵常數**：
- `DETECTION_PRIORITY = ['pnpm', 'bun', 'yarn', 'npm']`：套件管理器檢測優先順序（`scripts/lib/package-manager.js:57`）
- `COMPACT_THRESHOLD`：壓縮建議閾值（預設 50，可透過環境變數覆蓋）

**關鍵函式**：
- `getPackageManager()`：檢測和選擇套件管理器（`scripts/lib/package-manager.js:157`）
- `findFiles()`：跨平台檔案尋找（`scripts/lib/utils.js:102`）
- `readStdinJson()`：讀取 Hook 輸入（`scripts/lib/utils.js:154`）
- `commandExists()`：檢查指令是否存在（`scripts/lib/utils.js:228`）

**環境變數**：
- `CLAUDE_PACKAGE_MANAGER`：強制指定套件管理器
- `CLAUDE_SESSION_ID`：工作階段 ID
- `CLAUDE_TRANSCRIPT_PATH`：工作階段記錄檔案路徑
- `COMPACT_THRESHOLD`：壓縮建議閾值

**平台檢測**：
- `process.platform === 'win32'`：Windows
- `process.platform === 'darwin'`：macOS
- `process.platform === 'linux'`：Linux

</details>
