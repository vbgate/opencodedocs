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

這個模組提供了跨平台的工具函式，包括平台檢測、檔案操作、系統命令等。

### 平台檢測

```javascript
const {
  isWindows,
  isMacOS,
  isLinux
} = require('./lib/utils');
```

| 函式 | 類型 | 回傳值 | 說明 |
| --- | --- | --- | --- |
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

取得 Claude Code 配置目錄

**回傳值**：`string` - `~/.claude` 目錄路徑

**範例**：
```javascript
const claudeDir = getClaudeDir();
// /Users/username/.claude
```

#### getSessionsDir()

取得會話檔案目錄

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

**回傳值**：`Array<{path: string, mtime: number}>` - 符合的檔案清單，按修改時間降序排序

**範例**：
```javascript
// 尋找最近 7 天的 .tmp 檔案
const recentFiles = findFiles('/tmp', '*.tmp', { maxAge: 7 });
// [{ path: '/tmp/session.tmp', mtime: 1737804000000 }]

// 遞迴尋找所有 .md 檔案
const allMdFiles = findFiles('./docs', '*.md', { recursive: true });
```

::: tip 跨平台相容
這個函式提供了跨平台的檔案尋找功能，不依賴 Unix `find` 命令，因此可以在 Windows 上正常運作。
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

追加內容到文字檔案

**參數**：
- `filePath` (string) - 檔案路徑
- `content` (string) - 要追加的內容

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

**回傳值**：`Array<{lineNumber: number, content: string}>` - 符合的行清單

**範例**：
```javascript
const matches = grepFile('/path/to/file.txt', /function\s+\w+/);
// [{ lineNumber: 10, content: 'function test() {...}' }]
```
