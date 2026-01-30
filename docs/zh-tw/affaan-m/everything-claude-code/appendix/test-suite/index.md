---
title: "測試套件: 執行與自訂 | everything-claude-code"
sidebarTitle: "執行所有測試"
subtitle: "測試套件：執行與自訂"
description: "學習 everything-claude-code 測試套件的執行方法。涵蓋 56 個測試案例，包括 utils、package-manager 和 hooks 模組，講解跨平台測試、框架使用和自訂測試步驟。"
tags:
  - "testing"
  - "test-suite"
  - "qa"
prerequisite:
  - "start-installation"
order: 220
---

# 測試套件：執行與自訂

Everything Claude Code 包含一個完整的測試套件，用於驗證腳本和工具函數的正確性。本文介紹測試套件的執行方法、覆蓋範圍以及如何新增自訂測試。

## 什麼是測試套件?

**測試套件**是一組自動化測試腳本和測試案例的集合，用於驗證軟體功能正確性。Everything Claude Code 的測試套件包含 56 個測試案例，覆蓋跨平台工具函數、套件管理器偵測和 Hook 腳本，確保在不同作業系統上都能正常運作。

::: info 為什麼需要測試套件?

測試套件確保在新增功能或修改現有程式碼時，不會意外破壞已有功能。特別是對於跨平台的 Node.js 腳本，測試可以在不同作業系統上驗證行為一致性。

:::

---

## 測試套件概覽

測試套件位於 `tests/` 目錄下，包含以下結構：

```
tests/
├── lib/                          # 工具庫測試
│   ├── utils.test.js              # 跨平台工具函數測試 (21個測試)
│   └── package-manager.test.js    # 套件管理器偵測測試 (21個測試)
├── hooks/                        # Hook 腳本測試
│   └── hooks.test.js             # Hook 腳本測試 (14個測試)
└── run-all.js                    # 主測試執行器
```

**測試覆蓋範圍**:

| 模組 | 測試數量 | 覆蓋內容 |
|--- | --- | ---|
| `utils.js` | 21 | 平台偵測、目錄操作、檔案操作、日期時間、系統指令 |
| `package-manager.js` | 21 | 套件管理器偵測、指令生成、優先順序邏輯 |
| Hook 腳本 | 14 | session 生命週期、壓縮建議、會話評估、hooks.json 驗證 |
| **總計**` | **56** | 完整的功能驗證 |

---

## 執行測試

### 執行全部測試

在外掛根目錄下執行：

```bash
node tests/run-all.js
```

**你應該看到**：

```
╔════════════════════════════════════════════════════════╗
║           Everything Claude Code - Test Suite            ║
╚════════════════════════════════════════════════════════╝

━━━ Running lib/utils.test.js ━━━

=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ✓ getTempDir returns valid temp directory
  ✓ ensureDir creates directory

...

=== Test Results ===
Passed: 21
Failed: 0
Total:  21

╔════════════════════════════════════════════════════════╗
║                     Final Results                        ║
╠════════════════════════════════════════════════════════╣
║  Total Tests:   56                                      ║
║  Passed:       56  ✓                                   ║
║  Failed:        0                                       ║
╚════════════════════════════════════════════════════════╝
```

### 執行單個測試檔案

如果只想測試特定模組，可以單獨執行測試檔案：

```bash
# 測試 utils.js
node tests/lib/utils.test.js

# 測試 package-manager.js
node tests/lib/package-manager.test.js

# 測試 Hook 腳本
node tests/hooks/hooks.test.js
```

**你應該看到** (以 utils.test.js 為例)：

```
=== Testing utils.js ===

Platform Detection:
  ✓ isWindows/isMacOS/isLinux are booleans
  ✓ exactly one platform should be true

Directory Functions:
  ✓ getHomeDir returns valid path
  ✓ getClaudeDir returns path under home
  ✓ getSessionsDir returns path under Claude dir
  ...

File Operations:
  ✓ readFile returns null for non-existent file
  ✓ writeFile and readFile work together
  ✓ appendFile adds content to file
  ✓ replaceInFile replaces text
  ✓ countInFile counts occurrences
  ✓ grepFile finds matching lines

System Functions:
  ✓ commandExists finds node
  ✓ commandExists returns false for fake command
  ✓ runCommand executes simple command
  ✓ runCommand handles failed command

=== Test Results ===
Passed: 21
Failed: 0
Total:  21
```

---

## 測試框架說明

測試套件使用自訂的輕量級測試框架，不依賴外部程式庫。每個測試檔案都包含以下組件：

### 測試輔助函數

```javascript
// 同步測試輔助函數
function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

// 非同步測試輔助函數
async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}
```

### 測試斷言

使用 Node.js 內建的 `assert` 模組進行斷言：

```javascript
const assert = require('assert');

// 等值斷言
assert.strictEqual(actual, expected, 'message');

// 布林斷言
assert.ok(condition, 'message');

// 陣列/物件包含
assert.ok(array.includes(item), 'message');

// 正則匹配
assert.ok(regex.test(string), 'message');
```

---

## 各測試模組詳解

### lib/utils.test.js

測試 `scripts/lib/utils.js` 的跨平台工具函數。

**測試類別**:

| 類別 | 測試數量 | 覆蓋功能 |
|--- | --- | ---|
| 平台偵測 | 2 | `isWindows`, `isMacOS`, `isLinux` |
| 目錄函數 | 5 | `getHomeDir`, `getClaudeDir`, `getSessionsDir`, `getTempDir`, `ensureDir` |
| 日期/時間 | 3 | `getDateString`, `getTimeString`, `getDateTimeString` |
| 檔案操作 | 6 | `readFile`, `writeFile`, `appendFile`, `replaceInFile`, `countInFile`, `grepFile` |
| 系統函數 | 5 | `commandExists`, `runCommand` |

**關鍵測試範例**:

```javascript
// 測試檔案操作
test('writeFile and readFile work together', () => {
  const testFile = path.join(utils.getTempDir(), `utils-test-${Date.now()}.txt`);
  const testContent = 'Hello, World!';
  try {
    utils.writeFile(testFile, testContent);
    const read = utils.readFile(testFile);
    assert.strictEqual(read, testContent);
  } finally {
    fs.unlinkSync(testFile);
  }
});
```

### lib/package-manager.test.js

測試 `scripts/lib/package-manager.js` 的套件管理器偵測和選擇邏輯。

**測試類別**:

| 類別 | 測試數量 | 覆蓋功能 |
|--- | --- | ---|
| 套件管理器常數 | 2 | `PACKAGE_MANAGERS`, 屬性完整性 |
| Lock file 偵測 | 5 | npm, pnpm, yarn, bun 的 lock file 識別 |
| package.json 偵測 | 4 | `packageManager` 欄位解析 |
| 可用套件管理器 | 1 | 系統套件管理器偵測 |
| 套件管理器選擇 | 3 | 環境變數、lock file、專案設定優先順序 |
| 指令生成 | 6 | `getRunCommand`, `getExecCommand`, `getCommandPattern` |

**關鍵測試範例**:

```javascript
// 測試偵測優先順序
test('respects environment variable', () => {
  const originalEnv = process.env.CLAUDE_PACKAGE_MANAGER;
  try {
    process.env.CLAUDE_PACKAGE_MANAGER = 'yarn';
    const result = pm.getPackageManager();
    assert.strictEqual(result.name, 'yarn');
    assert.strictEqual(result.source, 'environment');
  } finally {
    if (originalEnv !== undefined) {
      process.env.CLAUDE_PACKAGE_MANAGER = originalEnv;
    } else {
      delete process.env.CLAUDE_PACKAGE_MANAGER;
    }
  }
});
```

### hooks/hooks.test.js

測試 Hook 腳本的執行和設定驗證。

**測試類別**:

| 類別 | 測試數量 | 覆蓋功能 |
|--- | --- | ---|
| session-start.js | 2 | 執行成功、輸出格式 |
| session-end.js | 2 | 執行成功、檔案建立 |
| pre-compact.js | 3 | 執行成功、輸出格式、日誌建立 |
| suggest-compact.js | 3 | 執行成功、計數器、閾值觸發 |
| evaluate-session.js | 3 | 短會話跳過、長會話處理、訊息計數 |
| hooks.json 驗證 | 4 | JSON 有效性、事件類型、node 前綴、路徑變數 |

**關鍵測試範例**:

```javascript
// 測試 hooks.json 設定
test('all hook commands use node', () => {
  const hooksPath = path.join(__dirname, '..', '..', 'hooks', 'hooks.json');
  const hooks = JSON.parse(fs.readFileSync(hooksPath, 'utf8'));

  const checkHooks = (hookArray) => {
    for (const entry of hookArray) {
      for (const hook of entry.hooks) {
        if (hook.type === 'command') {
          assert.ok(
            hook.command.startsWith('node'),
            `Hook command should start with 'node': ${hook.command.substring(0, 50)}...`
          );
        }
      }
    }
  };

  for (const [eventType, hookArray] of Object.entries(hooks.hooks)) {
    checkHooks(hookArray);
  }
});
```

---

## 新增測試

### 建立測試檔案

1. 在 `tests/` 目錄下建立新的測試檔案
2. 使用測試輔助函數包裝測試案例
3. 使用 `assert` 模組進行斷言
4. 在 `run-all.js` 中註冊新測試檔案

**範例**: 建立一個新的測試檔案 `tests/lib/new-module.test.js`

```javascript
/**
 * Tests for scripts/lib/new-module.js
 *
 * Run with: node tests/lib/new-module.test.js
 */

const assert = require('assert');
const newModule = require('../../scripts/lib/new-module');

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    return true;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log(`    Error: ${err.message}`);
    return false;
  }
}

function runTests() {
  console.log('\n=== Testing new-module.js ===\n');

  let passed = 0;
  let failed = 0;

  // 你的測試案例
  if (test('basic functionality', () => {
    assert.strictEqual(newModule.test(), 'expected value');
  })) passed++; else failed++;

  // Summary
  console.log('\n=== Test Results ===');
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total:  ${passed + failed}\n`);

  process.exit(failed > 0 ? 1 : 0);
}

runTests();
```

### 註冊到 run-all.js

在 `tests/run-all.js` 中新增測試檔案：

```javascript
const testFiles = [
  'lib/utils.test.js',
  'lib/package-manager.test.js',
  'lib/new-module.test.js',  // 新增這一行
  'hooks/hooks.test.js'
];
```

---

## 測試最佳實踐

### 1. 使用 try-finally 清理資源

測試中建立的暫存檔案和目錄應該被清理：

```javascript
✅ 正確:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  try {
    utils.writeFile(testFile, 'content');
    // 測試邏輯
  } finally {
    fs.unlinkSync(testFile);  // 確保清理
  }
});

❌ 錯誤:
test('file operations', () => {
  const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);
  utils.writeFile(testFile, 'content');
  // 如果測試失敗，檔案不會被清理
  fs.unlinkSync(testFile);
});
```

### 2. 隔離測試環境

每個測試應該使用唯一的暫存檔名，避免相互干擾：

```javascript
✅ 正確:
const testFile = path.join(utils.getTempDir(), `test-${Date.now()}.txt`);

❌ 錯誤:
const testFile = path.join(utils.getTempDir(), 'test.txt');
```

### 3. 使用描述性測試名稱

測試名稱應該清楚說明測試的內容：

```javascript
✅ 正確:
test('detects pnpm from pnpm-lock.yaml', () => { ... });

❌ 錯誤:
test('test1', () => { ... });
```

### 4. 測試邊界條件

不僅要測試正常情況，還要測試邊界和錯誤情況：

```javascript
// 測試正常情況
test('detects npm from package-lock.json', () => { ... });

// 測試空目錄
test('returns null when no lock file exists', () => { ... });

// 測試多個 lock 檔案
test('respects detection priority (pnpm > npm)', () => { ... });
```

### 5. 驗證輸入安全性

對於接受輸入的函數，測試應該驗證安全性：

```javascript
test('commandExists returns false for fake command', () => {
  const exists = utils.commandExists('nonexistent_command_12345');
  assert.strictEqual(exists, false);
});
```

---

## 常見問題

### 測試失敗怎麼辦?

1. 查看具體的錯誤訊息
2. 檢查測試邏輯是否正確
3. 驗證被測試的函數是否有 bug
4. 在不同作業系統上執行測試（跨平台相容性）

### 為什麼測試檔案輸出 `Passed: X Failed: Y` 後有換行?

這是為了與 `run-all.js` 的結果解析相容。測試檔案必須輸出特定格式：

```
=== Test Results ===
Passed: X
Failed: Y
Total:  Z
```

### 可以使用其他測試框架嗎?

可以，但需要修改 `run-all.js` 以支援新框架的輸出格式。目前使用的是自訂輕量級框架，適合簡單的測試場景。

---

## 本課小結

測試套件是 Everything Claude Code 品質保證的重要組成部分。透過執行測試，可以確保：

- ✅ 跨平台工具函數在不同作業系統上正常運作
- ✅ 套件管理器偵測邏輯正確處理所有優先順序
- ✅ Hook 腳本正確建立和更新檔案
- ✅ 設定檔案格式正確且完整

**測試套件特點**:
- 輕量級: 無外部依賴
- 完整覆蓋: 56 個測試案例
- 跨平台: 支援 Windows、macOS、Linux
- 易於擴充: 新增測試只需幾行程式碼

---

## 下一課預告

> 下一課我們學習 **[貢獻指南](../contributing/)**。
>
> 你將學到:
> - 如何向專案貢獻設定、agent 和 skill
> - 程式碼貢獻的最佳實踐
> - 提交 Pull Request 的流程

---

## 附錄:原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間:2026-01-25

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 測試執行器 | [`tests/run-all.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/run-all.js) | 1-77 |
| utils 測試 | [`tests/lib/utils.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/lib/utils.test.js) | 1-237 |
|--- | --- | ---|
| hooks 測試 | [`tests/hooks/hooks.test.js`](https://github.com/affaan-m/everything-claude-code/blob/main/tests/hooks/hooks.test.js) | 1-317 |
| utils 模組 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384 |
|--- | --- | ---|

**關鍵函數**:

**run-all.js**:
- `execSync()`: 執行子程序並取得輸出 (第 8 行)
- 測試檔案陣列: `testFiles` 定義所有測試檔案路徑 (第 13-17 行)
- 結果解析: 從輸出中提取 `Passed` 和 `Failed` 計數 (第 46-62行)

**測試輔助函數**:
- `test()`: 同步測試包裝器，捕獲異常並輸出結果
- `asyncTest()`: 非同步測試包裝器，支援 Promise 測試

**utils.js**:
- 平台偵測: `isWindows`, `isMacOS`, `isLinux` (第 12-14 行)
- 目錄函數: `getHomeDir()`, `getClaudeDir()`, `getSessionsDir()` (第 19-35 行)
- 檔案操作: `readFile()`, `writeFile()`, `replaceInFile()`, `countInFile()`, `grepFile()` (第 200-343 行)
- 系統函數: `commandExists()`, `runCommand()` (第 228-269 行)

**package-manager.js**:
- `PACKAGE_MANAGERS`: 套件管理器設定常數 (第 13-54 行)
- `DETECTION_PRIORITY`: 偵測優先順序 (第 57 行)
- `getPackageManager()`:根据優先順序選擇套件管理器 (第 157-236 行)
- `getRunCommand()`: 產生執行腳本指令 (第 279-294 行)
- `getExecCommand()`: 產生執行套件指令 (第 301-304 行)

</details>
