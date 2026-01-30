---
title: "故障排查: Hooks 問題 | everything-claude-code"
sidebarTitle: "Hooks 問題 5 分鐘修復"
subtitle: "故障排查: Hooks 問題 | everything-claude-code"
description: "學習 Hooks 故障排查方法。系統化診斷環境變數、權限、JSON 語法等問題，確保 SessionStart/End、PreToolUse 正常運作。"
tags:
  - "hooks"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "advanced-hooks-automation"
order: 150
---

# Hooks 不工作怎麼辦

## 你遇到的問題

配置了 Hooks，但發現它們沒有按預期工作？你可能會遇到以下情況：

- Dev server 沒有被阻止在 tmux 外執行
- 沒有看到 SessionStart 或 SessionEnd 的日誌
- Prettier 自動格式化沒有生效
- TypeScript 檢查沒有執行
- 看到奇怪的錯誤訊息

別擔心，這些問題通常都有明確的解決方法。本課幫你系統地排查和修復 Hooks 相關問題。

## 🎒 開始前的準備

::: warning 前置檢查
確保你已經：
1. ✅ 完成了 Everything Claude Code 的[安裝](../../start/installation/)
2. ✅ 了解 [Hooks 自動化](../../advanced/hooks-automation/)的基本概念
3. ✅ 閱讀過專案 README 中的 Hooks 配置說明
:::

---

## 常見問題 1：Hooks 完全不觸發

### 症狀
執行命令後，看不到任何 `[Hook]` 日誌輸出，Hooks 似乎完全沒有被呼叫。

### 可能原因

#### 原因 A：hooks.json 路徑錯誤

**問題**：`hooks.json` 沒有放在正確的位置，Claude Code 找不到設定檔。

**解決方案**：

檢查 `hooks.json` 的位置是否正確：

```bash
# 應該在以下位置之一：
~/.claude/hooks/hooks.json              # 使用者級配置（全域）
.claude/hooks/hooks.json                 # 專案級配置
```

**檢查方法**：

```bash
# 查看使用者級配置
ls -la ~/.claude/hooks/hooks.json

# 查看專案級配置
ls -la .claude/hooks/hooks.json
```

**如果檔案不存在**，從 Everything Claude Code 外掛程式目錄複製：

```bash
# 假設外掛程式安裝在 ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/hooks/hooks.json ~/.claude/hooks/
```

#### 原因 B：JSON 語法錯誤

**問題**：`hooks.json` 有語法錯誤，導致 Claude Code 無法解析。

**解決方案**：

驗證 JSON 格式：

```bash
# 使用 jq 或 Python 驗證 JSON 語法
jq empty ~/.claude/hooks/hooks.json
# 或
python3 -m json.tool ~/.claude/hooks/hooks.json > /dev/null
```

**常見語法錯誤**：
- 缺少逗號
- 引號未閉合
- 使用了單引號（必須用雙引號）
- 註解格式錯誤（JSON 不支援 `//` 註解）

#### 原因 C：環境變數 CLAUDE_PLUGIN_ROOT 未設定

**問題**：Hook 腳本使用 `${CLAUDE_PLUGIN_ROOT}` 引用路徑，但環境變數未設定。

**解決方案**：

檢查外掛程式安裝路徑是否正確：

```bash
# 查看已安裝的外掛程式路徑
ls -la ~/.claude-plugins/
```

確保 Everything Claude Code 外掛程式已正確安裝：

```bash
# 應該看到類似這樣的目錄
~/.claude-plugins/everything-claude-code/
├── scripts/
├── hooks/
├── agents/
└── ...
```

**如果是外掛程式市場安裝**，重新啟動 Claude Code 後環境變數會自動設定。

**如果是手動安裝**，檢查 `~/.claude/settings.json` 中的外掛程式路徑：

```json
{
  "plugins": [
    {
      "name": "everything-claude-code",
      "path": "/path/to/everything-claude-code"
    }
  ]
}
```

---

## 常見問題 2：特定 Hook 不觸發

### 症狀
有些 Hooks 工作（如 SessionStart），但其他 Hooks 不觸發（如 PreToolUse 的格式化）。

### 可能原因

#### 原因 A：Matcher 表達式錯誤

**問題**：Hook 的 `matcher` 表達式有誤，導致符合條件不滿足。

**解決方案**：

檢查 `hooks.json` 中的 matcher 語法：

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\""
}
```

**注意事項**：
- 工具名稱必須用雙引號包裹：`"Edit"`、`"Bash"`
- 正則表達式中的反斜線需要雙重跳脫：`\\\\.` 而不是 `\\.`
- 檔案路徑符合使用 `matches` 關鍵字

**測試 Matcher**：

你可以手動測試符合邏輯：

```bash
# 測試檔案路徑符合
node -e "console.log(/\\\\.(ts|tsx)$/.test('src/index.ts'))"
# 應該輸出：true
```

#### 原因 B：命令執行失敗

**問題**：Hook 命令本身執行失敗，但沒有報錯訊息。

**解決方案**：

手動執行 Hook 命令測試：

```bash
# 進入外掛程式目錄
cd ~/.claude-plugins/everything-claude-code

# 手動執行某個 Hook 腳本
node scripts/hooks/session-start.js

# 檢查是否有錯誤輸出
```

**常見失敗原因**：
- Node.js 版本不相容（需要 Node.js 14+）
- 缺少依賴（如未安裝 prettier、typescript）
- 腳本權限問題（見下文）

---

## 常見問題 3：權限問題（Linux/macOS）

### 症狀
看到類似這樣的錯誤：

```
Permission denied: node scripts/hooks/session-start.js
```

### 解決方案

給 Hook 腳本新增執行權限：

```bash
# 進入外掛程式目錄
cd ~/.claude-plugins/everything-claude-code

# 給所有 hooks 腳本新增執行權限
chmod +x scripts/hooks/*.js

# 驗證權限
ls -la scripts/hooks/
# 應該看到類似：-rwxr-xr-x  session-start.js
```

**批次修復所有腳本**：

```bash
# 修復所有 scripts 下的 .js 檔案
find ~/.claude-plugins/everything-claude-code/scripts -name "*.js" -exec chmod +x {} \;
```

---

## 常見問題 4：跨平台相容性問題

### 症狀
在 Windows 上正常運作，但在 macOS/Linux 上失敗；或者相反。

### 可能原因

#### 原因 A：路徑分隔符

**問題**：Windows 使用反斜線 `\`，Unix 使用正斜線 `/`。

**解決方案**：

Everything Claude Code 的腳本已經做了跨平台處理（使用 Node.js `path` 模組），但如果你自定義了 Hook，需要注意：

**錯誤寫法**：
```json
{
  "command": "node scripts/hooks\\session-start.js"  // Windows 風格
}
```

**正確寫法**：
```json
{
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\"  // 使用環境變數和正斜線
}
```

#### 原因 B：Shell 命令差異

**問題**：不同平台的命令語法不同（如 `which` vs `where`）。

**解決方案**：

Everything Claude Code 的 `scripts/lib/utils.js` 已經處理了這些差異。自定義 Hook 時，參考該檔案中的跨平台函數：

```javascript
// utils.js 中的跨平台命令檢測
function commandExists(cmd) {
  if (isWindows) {
    spawnSync('where', [cmd], { stdio: 'pipe' });
  } else {
    spawnSync('which', [cmd], { stdio: 'pipe' });
  }
}
```

---

## 常見問題 5：自動格式化不工作

### 症狀
編輯 TypeScript 檔案後，Prettier 沒有自動格式化程式碼。

### 可能原因

#### 原因 A：Prettier 未安裝

**問題**：PostToolUse Hook 呼叫 `npx prettier`，但專案中未安裝。

**解決方案**：

```bash
# 安裝 Prettier（專案級）
npm install --save-dev prettier
# 或
pnpm add -D prettier

# 或全域安裝
npm install -g prettier
```

#### 原因 B：Prettier 配置缺失

**問題**：Prettier 找不到設定檔，使用預設格式化規則。

**解決方案**：

建立 Prettier 設定檔：

```bash
# 專案根目錄建立 .prettierrc
cat > .prettierrc << 'EOF'
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5"
}
EOF
```

#### 原因 C：檔案類型不符合

**問題**：編輯的檔案副檔名不在 Hook 的符合規則中。

**目前符合規則**（`hooks.json` L92-97）：

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**如果需要支援其他檔案類型**（如 `.vue`），需要修改配置：

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx|vue)$\""
}
```

---

## 常見問題 6：TypeScript 檢查不工作

### 症狀
編輯 `.ts` 檔案後，沒有看到型別檢查的錯誤輸出。

### 可能原因

#### 原因 A：tsconfig.json 缺失

**問題**：Hook 腳本向上查找 `tsconfig.json` 檔案，但找不到。

**解決方案**：

確保專案根目錄或父目錄有 `tsconfig.json`：

```bash
# 查找 tsconfig.json
find . -name "tsconfig.json" -type f

# 如果不存在，建立基礎配置
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
EOF
```

#### 原因 B：TypeScript 未安裝

**問題**：Hook 呼叫 `npx tsc`，但未安裝 TypeScript。

**解決方案**：

```bash
npm install --save-dev typescript
# 或
pnpm add -D typescript
```

---

## 常見問題 7：SessionStart/SessionEnd 不觸發

### 症狀
啟動或結束會話時，看不到 `[SessionStart]` 或 `[SessionEnd]` 日誌。

### 可能原因

#### 原因 A：會話檔案目錄不存在

**問題**：`~/.claude/sessions/` 目錄不存在，Hook 腳本無法建立會話檔案。

**解決方案**：

手動建立目錄：

```bash
# macOS/Linux
mkdir -p ~/.claude/sessions

# Windows PowerShell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.claude\sessions"
```

#### 原因 B：腳本路徑錯誤

**問題**：`hooks.json` 中引用的腳本路徑不正確。

**檢查方法**：

```bash
# 驗證腳本是否存在
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-start.js
ls -la ~/.claude-plugins/everything-claude-code/scripts/hooks/session-end.js
```

**如果不存在**，檢查外掛程式是否完整安裝：

```bash
# 查看外掛程式目錄結構
ls -la ~/.claude-plugins/everything-claude-code/
```

---

## 常見問題 8：Dev Server 阻止不工作

### 症狀
直接執行 `npm run dev` 沒有被阻止，可以啟動 dev server。

### 可能原因

#### 原因 A：正則表達式不符合

**問題**：你的 dev server 命令不在 Hook 的符合規則中。

**目前符合規則**（`hooks.json` L6）：

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\""
}
```

**測試符合**：

```bash
# 測試你的命令是否符合
node -e "console.log(/(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)/.test('npm run dev'))"
```

**如果需要支援其他命令**（如 `npm start`），修改 `hooks.json`：

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (run dev|start)|pnpm( run)? (dev|start)|yarn (dev|start)|bun run (dev|start))\""
}
```

#### 原因 B：未在 tmux 中執行但未被阻止

**問題**：Hook 應該阻止 dev server 在 tmux 外執行，但沒有生效。

**檢查點**：

1. 確認 Hook 命令執行成功：
```bash
# 模擬 Hook 命令
node -e "console.error('[Hook] BLOCKED: Dev server must run in tmux');process.exit(1)"
# 應該看到錯誤輸出並退出碼為 1
```

2. 檢查 `process.exit(1)` 是否正確阻止了命令：
- Hook 命令中的 `process.exit(1)` 應該會阻止後續命令執行

3. 如果仍然不工作，可能需要升級 Claude Code 版本（Hooks 支援可能需要最新版本）

---

## 診斷工具和技巧

### 啟用詳細日誌

查看 Claude Code 的詳細日誌，了解 Hook 執行情況：

```bash
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait -Tail 50
```

### 手動測試 Hook

在終端手動執行 Hook 腳本，驗證其功能：

```bash
# 測試 SessionStart
cd ~/.claude-plugins/everything-claude-code
node scripts/hooks/session-start.js

# 測試 Suggest Compact
node scripts/hooks/suggest-compact.js

# 測試 PreCompact
node scripts/hooks/pre-compact.js
```

### 檢查環境變數

查看 Claude Code 的環境變數：

```bash
# 在 Hook 腳本中新增除錯輸出
node -e "console.log('CLAUDE_PLUGIN_ROOT:', process.env.CLAUDE_PLUGIN_ROOT); console.log('COMPACT_THRESHOLD:', process.env.COMPACT_THRESHOLD)"
```

---

## 檢查點 ✅

按以下清單逐一檢查：

- [ ] `hooks.json` 在正確位置（`~/.claude/hooks/` 或 `.claude/hooks/`）
- [ ] `hooks.json` JSON 格式正確（透過 `jq` 驗證）
- [ ] 外掛程式路徑正確（`${CLAUDE_PLUGIN_ROOT}` 已設定）
- [ ] 所有腳本有執行權限（Linux/macOS）
- [ ] 依賴工具已安裝（Node.js、Prettier、TypeScript）
- [ ] 會話目錄存在（`~/.claude/sessions/`）
- [ ] Matcher 表達式正確（正則跳脫、引號包裹）
- [ ] 跨平台相容性（使用 `path` 模組，環境變數）

---

## 何時需要協助

如果以上方法都無法解決問題：

1. **收集診斷資訊**：
   ```bash
   # 輸出以下資訊
   echo "Node version: $(node -v)"
   echo "Claude Code version: $(claude-code --version)"
   echo "Plugin path: $(ls -la ~/.claude-plugins/everything-claude-code)"
   echo "Hooks config: $(cat ~/.claude/hooks/hooks.json | jq -c .)"
   ```

2. **查看 GitHub Issues**：
   - 訪問 [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - 搜尋相似問題

3. **提交 Issue**：
   - 包含完整的錯誤日誌
   - 提供作業系統和版本資訊
   - 附上 `hooks.json` 內容（隱藏敏感資訊）

---

## 本課小結

Hooks 不工作通常有以下幾類原因：

| 問題類型 | 常見原因 | 快速排查 |
|--- | --- | ---|
| **完全不觸發** | hooks.json 路徑錯誤、JSON 語法錯誤 | 檢查檔案位置、驗證 JSON 格式 |
| **特定 Hook 不觸發** | Matcher 表達式錯誤、命令執行失敗 | 檢查正則語法、手動執行腳本 |
| **權限問題** | 腳本缺少執行權限（Linux/macOS） | `chmod +x scripts/hooks/*.js` |
| **跨平台相容性** | 路徑分隔符、Shell 命令差異 | 使用 `path` 模組、參考 utils.js |
| **功能不工作** | 依賴工具未安裝（Prettier、TypeScript） | 安裝相應工具、檢查設定檔 |

記住：大多數問題都可以透過檢查檔案路徑、驗證 JSON 格式、確認依賴安裝來解決。

---

## 下一課預告

> 下一課我們學習 **[MCP 連線失敗排查](../troubleshooting-mcp/)**。
>
> 你會學到：
> - MCP 伺服器配置常見錯誤
> - 如何除錯 MCP 連線問題
> - MCP 環境變數和占位符設定

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能                    | 檔案路徑                                                                                    | 行號    |
|--- | --- | ---|
| Hooks 主配置            | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158   |
| SessionStart Hook       | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62    |
| SessionEnd Hook         | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83    |
| PreCompact Hook         | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49    |
| Suggest Compact Hook    | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61    |
| 跨平台工具函數          | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-384   |

**關鍵函數**：
- `getHomeDir()` / `getClaudeDir()` / `getSessionsDir()`：取得配置目錄路徑（utils.js 19-34）
- `ensureDir(dirPath)`：確保目錄存在，不存在則建立（utils.js 54-59）
- `log(message)`：輸出日誌到 stderr（可見於 Claude Code）（utils.js 182-184）
- `findFiles(dir, pattern, options)`：跨平台檔案查找（utils.js 102-149）
- `commandExists(cmd)`：檢查命令是否存在（跨平台相容）（utils.js 228-246）

**關鍵正則表達式**：
- Dev server 阻止：`npm run dev|pnpm( run)? dev|yarn dev|bun run dev`（hooks.json 6）
- 檔案編輯符合：`\\.(ts|tsx|js|jsx)$`（hooks.json 92）
- TypeScript 檔案：`\\.(ts|tsx)$`（hooks.json 102）

**環境變數**：
- `${CLAUDE_PLUGIN_ROOT}`：外掛程式根目錄路徑
- `CLAUD_SESSION_ID`：會話識別碼
- `COMPACT_THRESHOLD`：壓縮建議閾值（預設 50）

</details>
