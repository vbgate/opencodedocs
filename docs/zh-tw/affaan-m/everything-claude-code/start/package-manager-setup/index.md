---
title: "套件管理器設定：自動偵測 | Everything Claude Code"
sidebarTitle: "統一專案指令"
subtitle: "套件管理器設定：自動偵測 | Everything Claude Code"
description: "學習套件管理器自動偵測設定方法。掌握 6 層優先順序機制，支援 npm/pnpm/yarn/bun，統一多專案指令。"
tags:
  - "package-manager"
  - "configuration"
  - "npm"
  - "pnpm"
prerequisite:
  - "start-installation"
order: 30
---

# 套件管理器設定：自動化偵測與自訂

## 學完你能做什麼

- ✅ 自動偵測目前專案使用的套件管理器（npm/pnpm/yarn/bun）
- ✅ 理解 6 層偵測優先順序機制
- ✅ 在全域和專案層級設定套件管理器
- ✅ 使用 `/setup-pm` 指令快速設定
- ✅ 處理多專案環境下不同套件管理器的情境

## 你現在的困境

你的專案越來越多，有的用 npm，有的用 pnpm，還有的用 yarn 或 bun。每次在 Claude Code 中輸入指令時，你都要回想：

- 這個專案用 `npm install` 還是 `pnpm install`？
- 要用 `npx`、`pnpm dlx` 還是 `bunx`？
- 腳本是用 `npm run dev`、`pnpm dev` 還是 `bun run dev`？

記錯一次，指令就報錯，浪費時間。

## 什麼時候用這一招

- **新專案啟動時**：確定使用哪個套件管理器後立即設定
- **切換專案時**：驗證目前偵測是否正確
- **團隊協作時**：確保所有成員使用同一指令風格
- **多套件管理器環境**：全域設定 + 專案覆蓋，靈活管理

::: tip 為什麼需要設定套件管理器？
Everything Claude Code 的 hooks 和 agents 會自動產生套件管理器相關的指令。如果偵測錯誤，所有指令都會使用錯誤的工具，導致操作失敗。
:::

## 🎒 開始前的準備

::: warning 前置檢查
開始本課之前，請確保已完成 [安裝指南](../installation/)，外掛已正確安裝到 Claude Code。
:::

檢查一下你的系統是否已安裝套件管理器：

```bash
# 檢查已安裝的套件管理器
which npm pnpm yarn bun

# 或在 Windows (PowerShell)
Get-Command npm, pnpm, yarn, bun -ErrorAction SilentlyContinue
```

如果你看到類似輸出，說明已安裝：

```
/usr/local/bin/npm
/usr/local/bin/pnpm
```

如果某個套件管理器未找到，需要先安裝（本課不涵蓋安裝教學）。

## 核心思路

Everything Claude Code 使用**智慧偵測機制**，按 6 層優先順序自動選擇套件管理器。你只需要在最合適的地方設定一次，它就能在所有情境下正確運作。

### 偵測優先順序（從高到低）

```
1. 環境變數 CLAUDE_PACKAGE_MANAGER  ─── 最高優先順序，暫時覆蓋
2. 專案設定 .claude/package-manager.json  ─── 專案層級覆蓋
3. package.json 的 packageManager 欄位  ─── 專案規範
4. Lock 檔案（pnpm-lock.yaml 等）  ─── 自動偵測
5. 全域設定 ~/.claude/package-manager.json  ─── 全域預設
6. Fallback：按順序找第一個可用的  ─── 備援方案
```

### 為什麼用這個順序？

- **環境變數最高**：方便暫時切換（如 CI/CD 環境）
- **專案設定其次**：同一專案強制統一
- **package.json 欄位**：這是 Node.js 的標準規範
- **Lock 檔案**：專案實際使用的檔案
- **全域設定**：個人預設偏好
- **Fallback**：確保永遠有可用的工具

## 跟我做

### 第 1 步：偵測目前設定

**為什麼**
先瞭解目前的偵測情況，確認是否需要手動設定。

```bash
# 偵測目前套件管理器
node scripts/setup-package-manager.js --detect
```

**你應該看到**：

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
  ✓ npm
  ✓ pnpm (current)
  ✗ yarn
  ✓ bun

Commands:
  Install: pnpm install
  Run script: pnpm [script-name]
  Execute binary: pnpm dlx [binary-name]
```

如果顯示的套件管理器和你預期的一致，說明偵測正確，無需手動設定。

### 第 2 步：設定全域預設套件管理器

**為什麼**
為你的所有專案設定一個全域預設，減少重複設定。

```bash
# 設定全域預設為 pnpm
node scripts/setup-package-manager.js --global pnpm
```

**你應該看到**：

```
✓ Global preference set to: pnpm
  Saved to: ~/.claude/package-manager.json
```

檢查產生的設定檔：

```bash
cat ~/.claude/package-manager.json
```

**你應該看到**：

```json
{
  "packageManager": "pnpm",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

### 第 3 步：設定專案層級套件管理器

**為什麼**
某些專案可能需要使用特定套件管理器（如依賴特定功能），專案層級設定會覆蓋全域設定。

```bash
# 為目前專案設定 bun
node scripts/setup-package-manager.js --project bun
```

**你應該看到**：

```
✓ Project preference set to: bun
  Saved to: .claude/package-manager.json
```

檢查產生的設定檔：

```bash
cat .claude/package-manager.json
```

**你應該看到**：

```json
{
  "packageManager": "bun",
  "setAt": "2026-01-25T12:00:00.000Z"
}
```

::: tip 專案層級 vs 全域設定
- **全域設定**：~/.claude/package-manager.json，影響所有專案
- **專案設定**：.claude/package-manager.json，只影響目前專案，優先順序更高
:::

### 第 4 步：使用 /setup-pm 指令（可選）

**為什麼**
如果你不想手動執行腳本，可以直接在 Claude Code 中使用斜線指令。

在 Claude Code 中輸入：

```
/setup-pm
```

Claude Code 會呼叫腳本並展示互動式選項。

**你應該看到**類似的偵測輸出：

```
[PackageManager] Available package managers:
  - npm
  - pnpm (current)
  - bun

To set your preferred package manager:
  - Global: Set CLAUDE_PACKAGE_MANAGER environment variable
  - Or add to ~/.claude/package-manager.json: {"packageManager": "pnpm"}
  - Or add to package.json: {"packageManager": "pnpm@8"}
```

### 第 5 步：驗證偵測邏輯

**為什麼**
理解偵測優先順序後，你可以預測不同情況下的結果。

讓我們測試幾種情境：

**情境 1：Lock 檔案偵測**

```bash
# 刪除專案設定
rm .claude/package-manager.json

# 偵測
node scripts/setup-package-manager.js --detect
```

**你應該看到** `Source: lock-file`（如果存在 lock 檔案）

**情境 2：package.json 欄位**

```bash
# 在 package.json 中新增
cat >> package.json << 'EOF'
  "packageManager": "pnpm@8.6.0"
EOF

# 偵測
node scripts/setup-package-manager.js --detect
```

**你應該看到** `From package.json: pnpm@8.6.0`

**情境 3：環境變數覆蓋**

```bash
# 暫時設定環境變數
export CLAUDE_PACKAGE_MANAGER=yarn

# 偵測
node scripts/setup-package-manager.js --detect
```

**你應該看到** `Source: environment` 和 `Package Manager: yarn`

```bash
# 清除環境變數
unset CLAUDE_PACKAGE_MANAGER
```

## 檢查點 ✅

確保以下檢查點都通過：

- [ ] 執行 `--detect` 指令能正確識別目前套件管理器
- [ ] 全域設定檔已建立：`~/.claude/package-manager.json`
- [ ] 專案設定檔已建立（如需要）：`.claude/package-manager.json`
- [ ] 不同優先順序的覆蓋關係符合預期
- [ ] 列出的可用套件管理器與實際安裝的一致

## 踩坑提醒

### ❌ 錯誤 1：設定了但未生效

**現象**：明明設定了 `pnpm`，偵測卻顯示 `npm`。

**原因**：
- Lock 檔案優先順序高於全域設定（如果存在 lock 檔案）
- package.json 的 `packageManager` 欄位優先順序也高於全域設定

**解決**：
```bash
# 檢查偵測來源
node scripts/setup-package-manager.js --detect

# 如果是 lock file 或 package.json，檢查這些檔案
ls -la | grep -E "(package-lock|yarn.lock|pnpm-lock|bun.lockb)"
cat package.json | grep packageManager
```

### ❌ 錯誤 2：設定了不存在的套件管理器

**現象**：設定了 `bun`，但系統未安裝。

**偵測結果**會顯示：

```
Available package managers:
  ✓ npm
  ✗ bun (current)  ← 注意：雖然標記為 current，但未安裝
```

**解決**：先安裝套件管理器，或設定其他已安裝的。

```bash
# 偵測可用的套件管理器
node scripts/setup-package-manager.js --list

# 切換到已安裝的
node scripts/setup-package-manager.js --global npm
```

### ❌ 錯誤 3：Windows 路徑問題

**現象**：Windows 上執行腳本報錯找不到檔案。

**原因**：Node.js 腳本路徑分隔符問題（原始碼已處理，但需確保使用正確的指令）。

**解決**：使用 PowerShell 或 Git Bash，確保路徑正確：

```powershell
# PowerShell
node scripts\setup-package-manager.js --detect
```

### ❌ 錯誤 4：專案設定影響其他專案

**現象**：專案 A 設定了 `bun`，切換到專案 B 後仍然使用 `bun`。

**原因**：專案設定只在目前專案目錄生效，切換目錄後會重新偵測。

**解決**：這是正常行為。專案設定僅影響目前專案，不會污染其他專案。

## 本課小結

Everything Claude Code 的套件管理器偵測機制非常智慧：

- **6 層優先順序**：環境變數 > 專案設定 > package.json > lock 檔案 > 全域設定 > fallback
- **靈活設定**：支援全域預設和專案覆蓋
- **自動偵測**：大多數情況下無需手動設定
- **指令統一**：設定後，所有 hooks 和 agents 都會使用正確的指令

**建議設定策略**：

1. 全域設定你最常用的套件管理器（如 `pnpm`）
2. 特殊專案在專案層級覆蓋（如依賴 `bun` 的效能）
3. 讓自動偵測處理其他情況

## 下一課預告

> 下一課我們學習 **[MCP 伺服器設定](../mcp-setup/)**。
>
> 你會學到：
> - 如何設定 15+ 個預置的 MCP 伺服器
> - MCP 伺服器如何擴充 Claude Code 的能力
> - 如何管理 MCP 伺服器的啟用狀態和 Token 使用

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 套件管理器偵測核心邏輯 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L157-L236) | 157-236 |
| Lock 檔案偵測 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L92-L102) | 92-102 |
| package.json 偵測 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L107-L126) | 107-126 |
| 套件管理器定義（設定） | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L13-L54) | 13-54 |
| 偵測優先順序定義 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L57) | 57 |
| 全域設定儲存 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L241-L252) | 241-252 |
| 專案設定儲存 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js#L257-L272) | 257-272 |
| 指令列腳本入口 | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L158-L206) | 158-206 |
| 偵測指令實作 | [`scripts/setup-package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/setup-package-manager.js#L62-L95) | 62-95 |

**關鍵常數**：
- `PACKAGE_MANAGERS`：支援的套件管理器及其指令設定（第 13-54 行）
- `DETECTION_PRIORITY`：偵測優先順序 `['pnpm', 'bun', 'yarn', 'npm']`（第 57 行）

**關鍵函式**：
- `getPackageManager()`：核心偵測邏輯，按優先順序回傳套件管理器（第 157-236 行）
- `detectFromLockFile()`：從 lock 檔案偵測套件管理器（第 92-102 行）
- `detectFromPackageJson()`：從 package.json 偵測套件管理器（第 107-126 行）
- `setPreferredPackageManager()`：儲存全域設定（第 241-252 行）
- `setProjectPackageManager()`：儲存專案設定（第 257-272 行）

**偵測優先順序實作**（原始碼第 157-236 行）：
```javascript
function getPackageManager(options = {}) {
  // 1. 環境變數（最高優先順序）
  if (envPm && PACKAGE_MANAGERS[envPm]) { return { name: envPm, source: 'environment' }; }

  // 2. 專案設定
  if (projectConfig) { return { name: config.packageManager, source: 'project-config' }; }

  // 3. package.json 欄位
  if (fromPackageJson) { return { name: fromPackageJson, source: 'package.json' }; }

  // 4. Lock 檔案
  if (fromLockFile) { return { name: fromLockFile, source: 'lock-file' }; }

  // 5. 全域設定
  if (globalConfig) { return { name: globalConfig.packageManager, source: 'global-config' }; }

  // 6. Fallback：按優先順序找第一個可用的
  for (const pmName of fallbackOrder) {
    if (available.includes(pmName)) { return { name: pmName, source: 'fallback' }; }
  }

  // 預設 npm
  return { name: 'npm', source: 'default' };
}
```

</details>
