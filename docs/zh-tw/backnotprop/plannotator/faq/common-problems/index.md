---
title: "常見問題: 故障排查指南 | Plannotator"
sidebarTitle: "遇到問題怎麼辦"
subtitle: "常見問題: 故障排查指南"
description: "學習 Plannotator 常見問題排查和故障解決方法。快速解決連接埠佔用、瀏覽器未開啟、Git 指令失敗、圖片上傳和整合問題。"
tags:
  - "常見問題"
  - "故障排查"
  - "連接埠佔用"
  - "瀏覽器"
  - "Git"
  - "遠端環境"
  - "整合問題"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 1
---

# 常見問題

## 學完你能做什麼

- ✅ 快速診斷並解決連接埠佔用問題
- ✅ 理解為什麼瀏覽器未自動開啟，並知道如何存取
- ✅ 排查計畫或程式碼審查未顯示的問題
- ✅ 處理 Git 指令執行失敗的情況
- ✅ 解決圖片上傳相關的錯誤
- ✅ 排查 Obsidian/Bear 整合失敗的原因
- ✅ 在遠端環境中正確存取 Plannotator

## 你現在的困境

在使用 Plannotator 時，你可能遇到這些問題：

- **問題 1**：啟動時提示連接埠被佔用，伺服器無法啟動
- **問題 2**：瀏覽器沒有自動開啟，不知道如何存取審查介面
- **問題 3**：計畫或程式碼審查頁面顯示空白，內容未載入
- **問題 4**：執行 `/plannotator-review` 時提示 Git 錯誤
- **問題 5**：上傳圖片失敗或圖片無法顯示
- **問題 6**：設定了 Obsidian/Bear 整合，但計畫沒有自動儲存
- **問題 7**：在遠端環境中無法存取本機伺服器

這些問題會中斷你的工作流程，影響使用體驗。

## 核心思路

::: info 錯誤處理機制

Plannotator 的伺服器實作了**自動重試機制**：

- **最大重試次數**：5 次
- **重試延遲**：500 毫秒
- **適用情境**：連接埠佔用（EADDRINUSE 錯誤）

如果連接埠衝突，系統會自動嘗試其他連接埠。5 次重試後仍失敗才會報錯。

:::

Plannotator 的錯誤處理遵循以下原則：

1. **本機優先**：所有錯誤訊息都會輸出到終端機或主控台
2. **優雅降級**：整合失敗（如 Obsidian 儲存失敗）不會阻塞主流程
3. **明確提示**：提供具體的錯誤訊息和建議解決方案

## 常見問題與解決方案

### 問題 1：連接埠佔用

**錯誤訊息**：

```
Port 19432 in use after 5 retries
```

**原因分析**：

- 連接埠已被其他程序佔用
- 遠端模式下設定了固定連接埠但連接埠衝突
- 上次 Plannotator 程序未正常結束

**解決方案**：

#### 方法 1：等待自動重試（僅限本機模式）

本機模式下，Plannotator 會自動嘗試隨機連接埠。如果看到連接埠佔用錯誤，通常意味著：

- 5 次隨機連接埠都被佔用（極罕見）
- 設定了固定連接埠（`PLANNOTATOR_PORT`）但衝突

**你應該看到**：終端機顯示 "Port X in use after 5 retries"

#### 方法 2：使用固定連接埠（遠端模式）

在遠端環境中，需要設定 `PLANNOTATOR_PORT`：

::: code-group

```bash [macOS/Linux]
export PLANNOTATOR_PORT=9999
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT = "9999"
plannotator start
```

:::

::: tip 連接埠選擇建議

- 選擇 1024-49151 範圍內的連接埠（使用者連接埠）
- 避免使用常見服務連接埠（80, 443, 3000, 5000 等）
- 確保連接埠未被防火牆攔截

:::

#### 方法 3：清理佔用連接埠的程序

```bash
# 查找佔用連接埠的程序（替換 19432 為你的連接埠）
lsof -i :19432  # macOS/Linux
netstat -ano | findstr :19432  # Windows

# 終止程序（將 PID 替換為實際程序 ID）
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

::: warning 注意事項

終止程序前，確認該程序不是其他重要應用程式。Plannotator 會在收到決策後自動關閉伺服器，通常不需要手動終止。

:::

---

### 問題 2：瀏覽器未自動開啟

**現象**：終端機顯示伺服器已啟動，但瀏覽器沒有開啟。

**原因分析**：

| 情境 | 原因 |
| ----- | ---- |
| 遠端環境 | Plannotator 偵測到遠端模式，跳過瀏覽器自動開啟 |
| `PLANNOTATOR_BROWSER` 設定錯誤 | 瀏覽器路徑或名稱不正確 |
| 瀏覽器未安裝 | 系統預設瀏覽器不存在 |

**解決方案**：

#### 情境 1：遠端環境（SSH、Devcontainer、WSL）

**檢查是否為遠端環境**：

```bash
echo $PLANNOTATOR_REMOTE
# 輸出為 "1" 或 "true" 表示遠端模式
```

**在遠端環境中**：

1. **終端機會顯示存取 URL**：

```
Plannotator running at: http://localhost:9999
Press Ctrl+C to stop
```

2. **手動開啟瀏覽器**，存取顯示的 URL

3. **設定連接埠轉發**（如果需要從本機存取）

**你應該看到**：終端機輸出類似 "Plannotator running at: http://localhost:19432"

#### 情境 2：本機模式但瀏覽器未開啟

**檢查 `PLANNOTATOR_BROWSER` 設定**：

::: code-group

```bash [macOS/Linux]
echo $PLANNOTATOR_BROWSER
# 應該輸出瀏覽器名稱或路徑
```

```powershell [Windows PowerShell]
echo $env:PLANNOTATOR_BROWSER
```

:::

**清除自訂瀏覽器設定**：

::: code-group

```bash [macOS/Linux]
unset PLANNOTATOR_BROWSER
plannotator start
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_BROWSER = ""
plannotator start
```

:::

**設定正確的瀏覽器**（如果需要自訂）：

```bash
# macOS：使用應用程式名稱
export PLANNOTATOR_BROWSER="Google Chrome"

# Linux：使用可執行檔路徑
export PLANNOTATOR_BROWSER="/usr/bin/google-chrome"

# Windows：使用可執行檔路徑
set PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

---

### 問題 3：計畫或程式碼審查未顯示

**現象**：瀏覽器開啟，但頁面顯示空白或載入失敗。

**可能原因**：

| 原因 | 計畫審查 | 程式碼審查 |
| ---- | ------- | ------- |
| Plan 參數為空 | ✅ 常見 | ❌ 不適用 |
| Git 儲存庫問題 | ❌ 不適用 | ✅ 常見 |
| 無 diff 可顯示 | ❌ 不適用 | ✅ 常見 |
| 伺服器啟動失敗 | ✅ 可能 | ✅ 可能 |

**解決方案**：

#### 情況 1：計畫審查未顯示

**檢查終端機輸出**：

```bash
# 查找錯誤訊息
plannotator start 2>&1 | grep -i error
```

**常見錯誤 1**：Plan 參數為空

**錯誤訊息**：

```
400 Bad Request - Missing plan or plan is empty
```

**原因**：Claude Code 或 OpenCode 傳遞的 plan 為空字串。

**解決方法**：

- 確認 AI Agent 產生了有效的計畫內容
- 檢查 Hook 或 Plugin 設定是否正確
- 查看 Claude Code/OpenCode 日誌取得更多資訊

**常見錯誤 2**：伺服器未正常啟動

**解決方法**：

- 檢查終端機是否顯示 "Plannotator running at" 訊息
- 如果沒有，參考「問題 1：連接埠佔用」
- 查看 [環境變數設定](../../advanced/environment-variables/) 確認設定正確

#### 情況 2：程式碼審查未顯示

**檢查終端機輸出**：

```bash
/plannotator-review 2>&1 | grep -i error
```

**常見錯誤 1**：無 Git 儲存庫

**錯誤訊息**：

```
fatal: not a git repository
```

**解決方法**：

```bash
# 初始化 Git 儲存庫
git init

# 新增檔案並提交（如果有未提交的變更）
git add .
git commit -m "Initial commit"

# 再次執行
/plannotator-review
```

**你應該看��**：瀏覽器顯示 diff viewer

**常見錯誤 2**：無 diff 可顯示

**現象**：頁面顯示 "No changes" 或類似提示。

**解決方法**：

```bash
# 檢查是否有未提交的變更
git status

# 檢查是否有 staged 變更
git diff --staged

# 檢查是否有 commit
git log --oneline

# 切換 diff 類型檢視不同範圍
# 在程式碼審查介面點擊下拉選單切換：
# - Uncommitted changes
# - Staged changes
# - Last commit
# - vs main (如果在分支上)
```

**你應該看到**：diff viewer 顯示程式碼變更或提示「No changes」

**常見錯誤 3**：Git 指令執行失敗

**錯誤訊息**：

```
Git diff error for uncommitted: [具體錯誤訊息]
```

**可能原因**：

- Git 未安裝
- Git 版本過舊
- Git 設定問題

**解決方法**：

```bash
# 檢查 Git 版本
git --version

# 測試 Git diff 指令
git diff HEAD

# 如果 Git 正常運作，問題可能是 Plannotator 內部錯誤
# 查看完整錯誤訊息並回報 Bug
```

---

### 問題 4：圖片上傳失敗

**錯誤訊息**：

```
400 Bad Request - No file provided
500 Internal Server Error - Upload failed
```

**可能原因**：

| 原因 | 解決方法 |
| ---- | ------- |
| 未選擇檔案 | 點擊上傳按鈕並選擇圖片 |
| 檔案格式不支援 | 使用 png/jpeg/webp 格式 |
| 檔案過大 | 壓縮圖片後再上傳 |
| 暫存目錄權限問題 | 檢查 /tmp/plannotator 目錄權限 |

**解決方案**：

#### 檢查上傳的檔案

**支援的格���**：

- ✅ PNG (`.png`)
- ✅ JPEG (`.jpg`, `.jpeg`)
- ✅ WebP (`.webp`)

**不支援的格式**：

- ❌ BMP (`.bmp`)
- ❌ GIF (`.gif`)
- ❌ SVG (`.svg`)

**你應該看到**：上傳成功後，圖片顯示在審查介面中

#### 檢查暫存目錄權限

Plannotator 會自動建立 `/tmp/plannotator` 目錄。如果仍然上傳失敗，請檢查系統暫存目錄權限。

**如果需要手動檢查**：

```bash
# 檢查目錄權限
ls -la /tmp/plannotator

# Windows 檢查
dir %TEMP%\plannotator
```

**你應該看到**：`drwxr-xr-x`（或類似權限）表示目錄可寫入

#### 查看瀏覽器開發者工具

1. 按 F12 開啟開發者工具
2. 切換到「Network」標籤
3. 點擊上傳按鈕
4. 查找 `/api/upload` 請求
5. 檢查請求狀態和回應

**你應該看到**：
- 狀態碼：200 OK（成功）
- 回應：`{"path": "/tmp/plannotator/xxx.png"}`

---

### 問題 5：Obsidian/Bear 整合失敗

**現象**：批准計畫後，筆記應用程式中沒有儲存的計畫。

**可能原因**：

| 原因 | Obsidian | Bear |
| ---- | -------- | ---- |
| 整合未啟用 | ✅ | ✅ |
| Vault/App 未偵測到 | ✅ | N/A |
| 路徑設定錯誤 | ✅ | ✅ |
| 檔案名稱衝突 | ✅ | ✅ |
| x-callback-url 失敗 | N/A | ✅ |

**解決方案**：

#### Obsidian 整合問題

**步驟 1：檢查整合是否啟用**

1. 在 Plannotator UI 中點擊設定（齒輪圖示）
2. 查找「Obsidian Integration」部分
3. 確保開關已開啟

**你應該看到**：開關顯示為藍色（啟用狀態）

**步驟 2：檢查 Vault 偵測**

**自動偵測**：

- Plannotator 會自動讀取 Obsidian 設定檔
- 設定檔位置：
  - macOS: `~/Library/Application Support/obsidian/obsidian.json`
  - Windows: `%APPDATA%\obsidian\obsidian.json`
  - Linux: `~/.config/obsidian/obsidian.json`

**手動驗證**：

::: code-group

```bash [macOS]
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

```powershell [Windows PowerShell]
cat $env:APPDATA\obsidian\obsidian.json
```

```bash [Linux]
cat ~/.config/obsidian/obsidian.json
```

:::

**你應該看到**：包含 `vaults` 欄位的 JSON 檔案

**步驟 3：手動設定 Vault 路徑**

如果自動偵測失敗：

1. 在 Plannotator 設定中
2. 點擊「Manually enter vault path」
3. 輸入完整 Vault 路徑

**範例路徑**：

- macOS: `/Users/yourname/Documents/ObsidianVault`
- Windows: `C:\Users\yourname\Documents\ObsidianVault`
- Linux: `/home/yourname/Documents/ObsidianVault`

**你應該看到**：下拉選單顯示你輸入的 Vault 名稱

**步驟 4：檢查終端機輸出**

Obsidian 儲存結果會輸出到終端機：

```bash
[Obsidian] Saved plan to: /path/to/vault/plannotator/Title - Jan 24, 2026 2-30pm.md
```

**錯誤訊息**：

```
[Obsidian] Save failed: [具體錯誤訊息]
```

**常見錯誤**：

- 權限不足 → 檢查 Vault 目錄權限
- 磁碟空間不足 → 釋放空間
- 路徑無效 → 確認路徑拼寫正確

#### Bear 整合問題

**檢查 Bear 應用程式**

- 確保已在 macOS 上安裝 Bear
- 確保 Bear 應用程式正在執行

**測試 x-callback-url**：

```bash
# 在終端機中測試
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**你應該看到**：Bear 開啟並建立新筆記

**檢查終端機輸出**：

```bash
[Bear] Saved plan to Bear
```

**錯誤訊息**：

```
[Bear] Save failed: [具體錯誤訊息]
```

**解決方法**：

- 重新啟動 Bear 應用程式
- 確認 Bear 是最新版本
- 檢查 macOS 權限設定（允許 Bear 存取檔案）

---

### 問題 6：遠端環境存取問題

**現象**：在 SSH、Devcontainer 或 WSL 中，無法從本機瀏覽器存取伺服器。

**核心概念**：

::: info 什麼是遠端環境

遠端環境是指透過 SSH、Devcontainer 或 WSL 存取的遠端運算環境。在這種環境中，你需要透過**連接埠轉發**將遠端連接埠對應到本機，才能在本機瀏覽器中存取遠端伺服器。

:::

**解決方案**：

#### 步驟 1：設定遠端模式

在遠端環境中設定環境變數：

::: code-group

```bash [macOS/Linux/WSL]
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999
```

```powershell [Windows]
$env:PLANNOTATOR_REMOTE = "1"
$env:PLANNOTATOR_PORT = "9999"
```

:::

**你應該看到**：終端機輸出 "Using remote mode with fixed port: 9999"

#### 步驟 2：設定連接埠轉發

**情境 1：SSH 遠端伺服器**

編輯 `~/.ssh/config`：

```
Host your-server
    HostName server.example.com
    User yourname
    LocalForward 9999 localhost:9999
```

**連線到伺服器**：

```bash
ssh your-server
```

**你應該看到**：SSH 連線建立後，本機 9999 連接埠轉發到遠端 9999 連接埠

**情境 2：VS Code Devcontainer**

VS Code Devcontainer 通常會自動轉發連接埠。

**檢查方法**：

1. 在 VS Code 中開啟「Ports」標籤
2. 查找 9999 連接埠
3. 確保連接埠狀態為「Forwarded」

**你應該看到**：Ports 標籤顯示 "Local Address: localhost:9999"

**情境 3：WSL（Windows Subsystem for Linux）**

WSL 預設使用 `localhost` 轉發。

**存取方法**：

在 Windows 瀏覽器中直接存取：

```
http://localhost:9999
```

**你應該看到**：Plannotator UI 正常顯示

#### 步驟 3：驗證存取

1. 在遠端環境中啟動 Plannotator
2. 在本機瀏覽器中存取 `http://localhost:9999`
3. 確認頁面正常顯示

**你應該看到**：計畫審查或程式碼審查介面正常載入

---

### 問題 7：計畫/註解未正確儲存

**現象**：批准或拒絕計畫後，註解沒有儲存，或儲存位置不正確。

**可能原因**：

| 原因 | 解決方法 |
| ---- | ------- |
| 計畫儲存被停用 | 檢查設定中的「Plan Save」選項 |
| 自訂路徑無效 | 驗證路徑是否可寫入 |
| 註解內容為空 | 這是正常行為（僅當有註解時才儲存） |
| 伺服器權限問題 | 檢查儲存目錄權限 |

**解決方案**：

#### 檢查計畫儲存設定

1. 在 Plannotator UI 中點擊設定（齒輪圖示）
2. 查看「Plan Save」部分
3. 確認開關已啟用

**你應該看到**：「Save plans and annotations」開關為藍色（啟用狀態）

#### 檢查儲存路徑

**預設儲存位置**：

```bash
~/.plannotator/plans/  # 計畫和註解都儲存在此目錄
```

**自訂路徑**：

在設定中可以設定自訂儲存路徑。

**驗證路徑可寫入**：

::: code-group

```bash [macOS/Linux]
ls -la ~/.plannotator
mkdir -p ~/.plannotator/plans
touch ~/.plannotator/plans/test.txt
rm ~/.plannotator/plans/test.txt
```

```powershell [Windows PowerShell]
dir $env:USERPROFILE\.plannotator
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.plannotator\plans"
```

:::

**你應該看到**：指令執行成功，沒有權限錯誤

#### 查看終端機輸出

儲存結果會輸出到終端機：

```bash
[Plan] Saved annotations to: ~/.plannotator/annotations/slug.json
[Plan] Saved snapshot to: ~/.plannotator/plans/slug-approved.md
```

**你應該看到**：類似的成功訊息

---

## 本課小結

透過本課，你學會了：

- **診斷連接埠佔用問題**：使用固定連接埠或清理佔用程序
- **處理瀏覽器未開啟**：識別遠端模式，手動存取或設定瀏覽器
- **排查內容未顯示**：檢查 Plan 參數、Git 儲存庫、diff 狀態
- **解決圖片上傳失敗**：檢查檔案格式、目錄權限、開發者工具
- **修復整合失敗**：檢查設定、路徑、權限和終端機輸出
- **設定遠端存取**：使用 PLANNOTATOR_REMOTE 和連接埠轉發
- **儲存計畫與註解**：啟用計畫儲存並驗證路徑權限

**記住**：

1. 終端機輸出是最好的除錯資訊來源
2. 遠端環境需要連接埠轉發
3. 整合失敗不會阻塞主流程
4. 使用開發者工具查看網路請求詳情

## 下一步

如果你遇到的問題未在本課中涵蓋，可以查看：

- [故障排查](../troubleshooting/) - 深入的除錯技巧和日誌分析方法
- [API 參考](../../appendix/api-reference/) - 瞭解所有 API 端點和錯誤碼
- [資料模型](../../appendix/data-models/) - 瞭解 Plannotator 的資料結構

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 伺服器啟動與重試邏輯 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L335) | 79-335 |
| 連接埠佔用錯誤處理（計畫審查） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L319-L334) | 319-334 |
| 連接埠佔用錯誤處理（程式碼審查） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L252-L267) | 252-267 |
| 遠端模式偵測 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 全文 |
| 瀏覽器開啟邏輯 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 全文 |
| Git 指令執行與錯誤處理 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L36-L147) | 36-147 |
| 圖片上傳處理（計畫審查） | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L153-L174) | 153-174 |
| 圖片上傳處理（程式碼審查） | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L181-L201) | 181-201 |
| Obsidian 整合 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts) | 全文 |
| 計畫儲存 | [`packages/server/storage.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/storage.ts) | 全文 |

**關鍵常數**：

| 常數 | 值 | 說明 |
| --- | --- | --- |
| `MAX_RETRIES` | 5 | 伺服器啟動最大重試次數 |
| `RETRY_DELAY_MS` | 500 | 重試延遲（毫秒） |

**關鍵函式**：

- `startPlannotatorServer()` - 啟動計畫審查伺服器
- `startReviewServer()` - 啟動程式碼審查伺服器
- `isRemoteSession()` - 偵測是否為遠端環境
- `getServerPort()` - 取得伺服��連接埠
- `openBrowser()` - 開啟瀏覽器
- `runGitDiff()` - 執行 Git diff 指令
- `detectObsidianVaults()` - 偵測 Obsidian vaults
- `saveToObsidian()` - 儲存計畫到 Obsidian
- `saveToBear()` - 儲存計畫到 Bear

</details>
