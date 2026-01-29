---
title: "故障排除: 排查常見問題 | Plannotator"
sidebarTitle: "快速排查問題"
subtitle: "故障排除: 排查常見問題"
description: "學習 Plannotator 故障排查方法，包括日誌檢視、連接埠佔用、Hook event 除錯、瀏覽器問題、Git 儲存庫狀態和整合錯誤處理。"
tags:
  - "故障排查"
  - "除錯"
  - "常見錯誤"
  - "日誌檢視"
prerequisite:
  - "start-getting-started"
order: 2
---

# Plannotator 故障排查

## 學完你能做什麼

遇到問題時，你將能夠：

- 快速定位問題來源（連接埠佔用、Hook event 解析、Git 設定等）
- 透過日誌輸出診斷錯誤
- 針對不同錯誤類型採取正確的解決方法
- 在遠端/Devcontainer 模式下除錯連線問題

## 你現在的困境

Plannotator 突然無法運作了，瀏覽器沒有開啟，或者 Hook 輸出了錯誤訊息。你不知道如何檢視日誌，也不確定是哪個環節出了問題。你可能嘗試過重新啟動，但問題依然存在。

## 什麼時候用這一招

以下情況需要故障排查：

- 瀏覽器沒有自動開啟
- Hook 輸出錯誤訊息
- 連接埠佔用導致無法啟動
- 計畫或程式碼審查頁面顯示異常
- Obsidian/Bear 整合失敗
- Git diff 顯示為空

---

## 核心思路

Plannotator 的問題通常分為三類：

1. **環境問題**：連接埠佔用、環境變數設定錯誤、瀏覽器路徑問題
2. **資料問題**：Hook event 解析失敗、計畫內容為空、Git 儲存庫狀態異常
3. **整合問題**：Obsidian/Bear 儲存失敗、遠端模式連線問題

除錯的核心是**檢視日誌輸出**。Plannotator 使用 `console.error` 輸出錯誤到 stderr，用 `console.log` 輸出正常資訊到 stdout。區分這兩者能幫你快速定位問題類型。

---

## 🎒 開始前的準備

- ✅ 已安裝 Plannotator（Claude Code 或 OpenCode 外掛）
- ✅ 瞭解基本的命令列操作
- ✅ 熟悉你的專案目錄和 Git 儲存庫狀態

---

## 跟我做

### 第 1 步：檢查日誌輸出

**為什麼**

Plannotator 的所有錯誤都會輸出到 stderr。檢視日誌是診斷問題的第一步。

**操作方法**

#### 在 Claude Code 中

當 Hook 觸發 Plannotator 時，錯誤訊息會顯示在 Claude Code 的終端機輸出中：

```bash
# 你可能看到的錯誤範例
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### 在 OpenCode 中

OpenCode 會擷取 CLI 的 stderr 並顯示在介面中：

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**你應該看到**：

- 如果沒有錯誤，stderr 應該為空或僅有預期的提示訊息
- 如果有錯誤，會包含錯誤類型（如 EADDRINUSE）、錯誤訊息和堆疊資訊（如果有）

---

### 第 2 步：處理連接埠佔用問題

**為什麼**

Plannotator 預設在隨機連接埠啟動伺服器。如果固定連接埠被佔用，伺服器會嘗試重試 5 次（每次延遲 500ms），失敗後報錯。

**錯誤訊息**：

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**解決方案**

#### 方案 A：讓 Plannotator 自動選擇連接埠（推薦）

不要設定 `PLANNOTATOR_PORT` 環境變數，Plannotator 會自動選擇可用連接埠。

#### 方案 B：使用固定連接埠並解決佔用

如果必須使用固定連接埠（如遠端模式），需要解決連接埠佔用：

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

然後重新設定連接埠：

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**檢查點 ✅**：

- 再次觸發 Plannotator，瀏覽器應該能正常開啟
- 如果仍然報錯，嘗試換一個連接埠號

---

### 第 3 步：除錯 Hook event 解析失敗

**為什麼**

Hook event 是從 stdin 讀取的 JSON 資料。如果解析失敗，Plannotator 無法繼續。

**錯誤訊息**：

```
Failed to parse hook event from stdin
No plan content in hook event
```

**可能原因**：

1. Hook event 不是有效的 JSON
2. Hook event 缺少 `tool_input.plan` 欄位
3. Hook 版本不相容

**除錯方法**

#### 檢視 Hook event 內容

在 Hook server 啟動前，印出 stdin 內容：

```bash
# 暫時修改 hook/server/index.ts
# 在第 91 行後新增：
console.error("[DEBUG] Hook event:", eventJson);
```

**你應該看到**：

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**解決方案**：

- 如果 `tool_input.plan` 為空或缺失，檢查 AI Agent 是否正確產生了計畫
- 如果 JSON 格式錯誤，檢查 Hook 設定是否正確
- 如果 Hook 版本不相容，更新 Plannotator 到最新版本

---

### 第 4 步：解決瀏覽器未開啟問題

**為什麼**

Plannotator 使用 `openBrowser` 函式自動開啟瀏覽器。如果失敗，可能是跨平台相容性問題或瀏覽器路徑錯誤。

**可能原因**：

1. 系統預設瀏覽器未設定
2. 自訂瀏覽器路徑無效
3. WSL 環境下的特殊處理問題
4. 遠端模式下不會自動開啟瀏覽器（這是正常的）

**除錯方法**

#### 檢查是否在遠端模式

```bash
# 檢視環境變數
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

如果輸出為 `1` 或 `true`，說明是遠端模式，瀏覽器不會自動開啟，這是預期行為。

#### 手動測試瀏覽器開啟

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**你應該看到**：

- 如果手動開啟成功，說明 Plannotator 伺服器正常運作，問題出在自動開啟邏輯
- 如果手動開啟失敗，檢查 URL 是否正確（連接埠可能不同）

**解決方案**：

#### 方案 A：設定自訂瀏覽器（macOS）

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# 或使用完整路徑
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### 方案 B：設定自訂瀏覽器（Linux）

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### 方案 C：遠端模式手動開啟（Devcontainer/SSH）

```bash
# Plannotator 會輸出 URL 和連接埠資訊
# 複製 URL，在本機瀏覽器中開啟
# 或使用連接埠轉發：
ssh -L 19432:localhost:19432 user@remote
```

---

### 第 5 步：檢查 Git 儲存庫狀態（程式碼審查）

**為什麼**

程式碼審查功能依賴 Git 指令。如果 Git 儲存庫狀態異常（如沒有提交、Detached HEAD），會導致 diff 顯示為空或錯誤。

**錯誤訊息**：

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**除錯方法**

#### 檢查 Git 儲存庫

```bash
# 檢查是否在 Git 儲存庫中
git status

# 檢查目前分支
git branch

# 檢查是否有提交
git log --oneline -1
```

**你應該看到**：

- 如果輸出 `fatal: not a git repository`，說明目前目錄不是 Git 儲存庫
- 如果輸出 `HEAD detached at <commit>`，說明處於 Detached HEAD 狀態
- 如果輸出 `fatal: your current branch 'main' has no commits yet`，說明還沒有任何提交

**解決方案**：

#### 問題 A：不在 Git 儲存庫中

```bash
# 初始化 Git 儲存庫
git init
git add .
git commit -m "Initial commit"
```

#### 問題 B：Detached HEAD 狀態

```bash
# 切換到一個分支
git checkout main
# 或建立新分支
git checkout -b feature-branch
```

#### 問題 C：沒有提交

```bash
# 至少需要一個提交才能檢視 diff
git add .
git commit -m "Initial commit"
```

#### 問題 D：空 diff（沒有變更）

```bash
# 建立一些變更
echo "test" >> test.txt
git add test.txt

# 再次執行 /plannotator-review
```

**檢查點 ✅**：

- 再次執行 `/plannotator-review`，diff 應該正常顯示
- 如果仍然為空，檢查是否有未暫存或未提交的變更

---

### 第 6 步：除錯 Obsidian/Bear 整合失敗

**為什麼**

Obsidian/Bear 整合失敗不會阻止計畫批准，但會導致儲存失敗。錯誤會輸出到 stderr。

**錯誤訊息**：

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**除錯方法**

#### 檢查 Obsidian 設定

**macOS**：
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**：
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**你應該看到**：

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### 檢查 Bear 可用性（macOS）

```bash
# 測試 Bear URL scheme
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**你應該看到**：

- Bear 應用程式開啟並建立新筆記
- 如果沒有任何反應，說明 Bear 未正確安裝

**解決方案**：

#### Obsidian 儲存失敗

- 確保 Obsidian 正在執行
- 檢查 vault 路徑是否正確
- 嘗試手動在 Obsidian 中建立筆記，驗證權限

#### Bear 儲存失敗

- 確保 Bear 已正確安裝
- 測試 `bear://x-callback-url` 是否可用
- 檢查 Bear 設定中是否啟用了 x-callback-url

---

### 第 7 步：檢視詳細錯誤日誌（除錯模式）

**為什麼**

有時錯誤訊息不夠詳細，需要檢視完整的堆疊追蹤和上下文。

**操作方法**

#### 啟用 Bun 除錯模式

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### 檢視 Plannotator 伺服器日誌

伺服器內部的錯誤會透過 `console.error` 輸出。關鍵日誌位置：

- `packages/server/index.ts:260` - 整合錯誤日誌
- `packages/server/git.ts:141` - Git diff 錯誤日誌
- `apps/hook/server/index.ts:100-106` - Hook event 解析錯誤

**你應該看到**：

```bash
# 成功儲存到 Obsidian
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# 儲存失敗
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Git diff 錯誤
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**檢查點 ✅**：

- 錯誤日誌包含足夠的資訊來定位問題
- 根據錯誤類型採取對應的解決方案

---

## 踩坑提醒

### ❌ 忽略 stderr 輸出

**錯誤做法**：

```bash
# 只關注 stdout，忽略 stderr
plannotator review 2>/dev/null
```

**正確做法**：

```bash
# 同時檢視 stdout 和 stderr
plannotator review
# 或分離日誌
plannotator review 2>error.log
```

### ❌ 盲目重新啟動伺服器

**錯誤做法**：

- 遇到問題就重新啟動，不檢視錯誤原因

**正確做法**：

- 先檢視錯誤日誌，確定問題類型
- 根據錯誤類型採取對應的解決方案
- 重新啟動只是最後的手段

### ❌ 在遠端模式下期待瀏覽器自動開啟

**錯誤做法**：

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# 期待瀏覽器自動開啟（不會發生）
```

**正確做法**：

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# 記錄輸出的 URL，手動在瀏覽器中開啟
# 或使用連接埠轉發
```

---

## 本課小結

- Plannotator 使用 `console.error` 輸出錯誤到 stderr，`console.log` 輸出正常資訊到 stdout
- 常見問題包括：連接埠佔用、Hook event 解析失敗、瀏覽器未開啟、Git 儲存庫狀態異常、整合失敗
- 除錯的核心是：檢視日誌 → 定位問題類型 → 採取對應解決方案
- 遠端模式下不會自動開啟瀏覽器，需要手動開啟 URL 或設定連接埠轉發

---

## 下一課預告

> 下一課我們學習 **[常見問題](../common-problems/)**。
>
> 你會學到：
> - 如何解決安裝和設定問題
> - 常見的使用誤區和注意事項
> - 效能最佳化建議

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 連接埠重試機制 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| EADDRINUSE 錯誤處理 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Hook event 解析 | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| 瀏覽器開啟 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Git diff 錯誤處理 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Obsidian 儲存日誌 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Bear 儲存日誌 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**關鍵常數**：
- `MAX_RETRIES = 5`：連接埠重試最大次數
- `RETRY_DELAY_MS = 500`：連接埠重試延遲（毫秒）

**關鍵函式**：
- `startPlannotatorServer()`：啟動計畫審查伺服器
- `startReviewServer()`：啟動程式碼審查伺服器
- `openBrowser()`：跨平台瀏覽器開啟
- `runGitDiff()`：執行 Git diff 指令
- `saveToObsidian()`：儲存計畫到 Obsidian
- `saveToBear()`：儲存計畫到 Bear

</details>
