---
title: "環境變數: 遠端模式與連接埠設定 | plannotator"
sidebarTitle: "5 分鐘搞定遠端設定"
subtitle: "環境變數: 遠端模式與連接埠設定"
description: "學習 plannotator 環境變數設定方法。設定遠端模式、固定連接埠、自訂瀏覽器和分享開關，適配 SSH、Devcontainer 和 WSL 環境。"
tags:
  - "環境變數"
  - "遠端模式"
  - "連接埠設定"
  - "瀏覽器設定"
  - "URL 分享"
  - "Devcontainer"
  - "WSL"
prerequisite:
  - "start-getting-started"
  - "start-installation-claude-code"
  - "start-installation-opencode"
order: 5
---

# 環境變數設定

## 學完你能做什麼

- ✅ 在 SSH、Devcontainer、WSL 等遠端環境中正確設定 Plannotator
- ✅ 使用固定連接埠避免連接埠衝突和頻繁設定連接埠轉發
- ✅ 指定自訂瀏覽器開啟計畫評審介面
- ✅ 啟用或停用 URL 分享功能
- ✅ 理解每個環境變數的預設值和行為

## 你現在的困境

**問題 1**：在 SSH 或 Devcontainer 中使用 Plannotator，瀏覽器沒有自動開啟，或者無法存取本地伺服器。

**問題 2**：每次重啟 Plannotator 都使用隨機連接埠，需要不斷更新連接埠轉發設定。

**問題 3**：系統預設瀏覽器不符合你的使用習慣，希望在特定瀏覽器中檢視計畫。

**問題 4**：出於安全考量，想停用 URL 分享功能，防止計畫被意外分享。

**Plannotator 能幫你**：
- 透過環境變數自動偵測遠端環境並停用瀏覽器自動開啟
- 固定連接埠方便連接埠轉發設定
- 支援自訂瀏覽器
- 提供環境變數控制 URL 分享開關

## 什麼時候用這一招

**使用場景**：
- 在 SSH 遠端伺服器上使用 Claude Code 或 OpenCode
- 在 Devcontainer 容器中開發
- 在 WSL（Windows Subsystem for Linux）環境中工作
- 需要固定連接埠簡化連接埠轉發設定
- 希望使用特定瀏覽器（如 Chrome、Firefox）
- 企業安全策略要求停用 URL 分享功能

**不適用場景**：
- 本地開發且使用預設瀏覽器（無需任何環境變數）
- 不需要連接埠轉發（如完全本地開發）

## 核心思路

### 環境變數是什麼

**環境變數**是作業系統提供的鍵值對設定機制。Plannotator 透過讀取環境變數適配不同的執行環境（本地或遠端）。

::: info 為什麼需要環境變數？

Plannotator 預設假設你在本地開發環境中使用：
- 本地模式：隨機連接埠（避免連接埠衝突）
- 本地模式：自動開啟系統預設瀏覽器
- 本地模式：啟用 URL 分享功能

但在遠端環境（SSH、Devcontainer、WSL）中，這些預設行為需要調整：
- 遠端模式：使用固定連接埠（方便連接埠轉發）
- 遠端模式：不自動開啟瀏覽器（需要在主機開啟）
- 遠端模式：可能需要停用 URL 分享（安全考量）

環境變數讓你無需修改程式碼，就能在不同環境中調整 Plannotator 的行為。
:::

### 環境變數優先順序

Plannotator 讀取環境變數的優先順序：

```
顯式環境變數 > 預設行為

例如：
PLANNOTATOR_PORT=3000 > 遠端模式預設連接埠 19432 > 本地模式隨機連接埠
```

這意味著：
- 如果設定了 `PLANNOTATOR_PORT`，無論是否是遠端模式，都使用該連接埠
- 如果未設定 `PLANNOTATOR_PORT`，遠端模式使用 19432，本地模式使用隨機連接埠

## 🎒 開始前的準備

在設定環境變數前，確認：

- [ ] 已完成 Plannotator 安裝（[Claude Code 安裝](../../installation-claude-code/) 或 [OpenCode 安裝](../../installation-opencode/)）
- [ ] 了解你目前的執行環境（本地、SSH、Devcontainer、WSL）
- [ ] （遠端環境）已設定連接埠轉發（如 SSH 的 `-L` 參數或 Devcontainer 的 `forwardPorts`）

## 跟我做

### 第 1 步：設定遠端模式（SSH、Devcontainer、WSL）

**為什麼**
遠端模式會自動使用固定連接埠並停用瀏覽器自動開啟，適合 SSH、Devcontainer、WSL 等環境。

**操作方式**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
export PLANNOTATOR_REMOTE=1
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_REMOTE="1"
```

```cmd [Windows CMD]
set PLANNOTATOR_REMOTE=1
```

:::

**你應該看到**：沒有視覺回饋，環境變數已設定。

**永久生效**（推薦）：

::: code-group

```bash [~/.bashrc 或 ~/.zshrc]
echo 'export PLANNOTATOR_REMOTE=1' >> ~/.bashrc
source ~/.bashrc
```

```powershell [PowerShell Profile]
[Environment]::SetEnvironmentVariable('PLANNOTATOR_REMOTE', '1', 'User')
```

```cmd [系統環境變數]
# 透過「系統屬性 > 環境變數」介面新增
```

:::

### 第 2 步：設定固定連接埠（遠端環境必需）

**為什麼**
遠端環境需要固定連接埠才能設定連接埠轉發。本地環境如需固定連接埠也可以設定。

**預設連接埠規則**：
- 本地模式（未設定 `PLANNOTATOR_REMOTE`）：隨機連接埠（`0`）
- 遠端模式（`PLANNOTATOR_REMOTE=1`）：預設 `19432`
- 顯式設定 `PLANNOTATOR_PORT`：使用指定連接埠

**操作方式**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# 設定為 19432（遠端模式預設）
export PLANNOTATOR_PORT=19432

# 或自訂連接埠
export PLANNOTATOR_PORT=3000
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_PORT="19432"
```

```cmd [Windows CMD]
set PLANNOTATOR_PORT=19432
```

:::

**你應該看到**：沒有視覺回饋，環境變數已設定。

**檢查點 ✅**：驗證連接埠是否生效

重啟 Claude Code 或 OpenCode 後，觸發計畫評審，檢視終端機輸出的 URL：

```bash
# 本地模式輸出（隨機連接埠）
http://localhost:54321

# 遠端模式輸出（固定連接埠 19432）
http://localhost:19432
```

**連接埠轉發設定範例**：

SSH 遠端開發：
```bash
ssh -L 19432:localhost:19432 user@remote-server
```

Devcontainer（`.devcontainer/devcontainer.json`）：
```json
{
  "forwardPorts": [19432]
}
```

### 第 3 步：設定自訂瀏覽器

**為什麼**
系統預設瀏覽器可能不是你希望的（例如你在 Chrome 上工作，但預設是 Safari）。

**操作方式**

::: code-group

```bash [macOS (Bash)]
# 使用應用程式名稱（macOS 支援）
export PLANNOTATOR_BROWSER="Google Chrome"

# 或使用完整路徑
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

```bash [Linux (Bash)]
# 使用可執行檔路徑
export PLANNOTATOR_BROWSER="/usr/bin/firefox"

# 或使用相對路徑（如果在 PATH 中）
export PLANNOTATOR_BROWSER="firefox"
```

```powershell [Windows PowerShell]
# 使用可執行檔路徑
$env:PLANNOTATOR_BROWSER="C:\Program Files\Google\Chrome\Application\chrome.exe"
```

```cmd [Windows CMD]
set PLANNOTATOR_BROWSER=C:\Program Files\Google\Chrome\Application\chrome.exe
```

:::

**你應該看到**：下次觸發計畫評審時，Plannotator 會在指定的瀏覽器中開啟。

**檢查點 ✅**：驗證瀏覽器是否生效

重啟後觸發計畫評審，觀察：
- macOS：指定的應用程式會開啟
- Windows：指定的瀏覽器程序會啟動
- Linux：指定的瀏覽器指令會執行

**常見瀏覽器路徑**：

| 作業系統 | 瀏覽器 | 路徑/指令 |
|--- | --- | ---|
| macOS | Chrome | `Google Chrome` 或 `/Applications/Google Chrome.app` |
| macOS | Firefox | `Firefox` 或 `/Applications/Firefox.app` |
| macOS | Safari | `Safari` |
| Linux | Chrome | `google-chrome` 或 `/usr/bin/google-chrome` |
| Linux | Firefox | `firefox` 或 `/usr/bin/firefox` |
| Windows | Chrome | `C:\Program Files\Google\Chrome\Application\chrome.exe` |
| Windows | Firefox | `C:\Program Files\Mozilla Firefox\firefox.exe` |

### 第 4 步：設定 URL 分享開關

**為什麼**
URL 分享功能預設啟用，但出於安全考量（如企業環境），你可能需要停用此功能。

**預設行為**：
- 未設定 `PLANNOTATOR_SHARE`：啟用 URL 分享
- 設定為 `disabled`：停用 URL 分享

**操作方式**

::: code-group

```bash [macOS/Linux/WSL (Bash)]
# 停用 URL 分享
export PLANNOTATOR_SHARE="disabled"
```

```powershell [Windows PowerShell]
$env:PLANNOTATOR_SHARE="disabled"
```

```cmd [Windows CMD]
set PLANNOTATOR_SHARE=disabled
```

:::

**你應該看到**：Export 按鈕點擊後，「Share as URL」選項消失或無法使用。

**檢查點 ✅**：驗證 URL 分享是否停用

1. 重啟 Claude Code 或 OpenCode
2. 開啟任意計畫評審
3. 點擊右上角「Export」按鈕
4. 觀察選項列表

**啟用狀態**（預設）：
- ✅ 顯示「Share」和「Raw Diff」兩個分頁
- ✅「Share」分頁顯示可分享 URL 和複製按鈕

**停用狀態**（`PLANNOTATOR_SHARE="disabled"`）：
- ✅ 直接顯示「Raw Diff」內容
- ✅ 顯示「Copy」和「Download .diff」按鈕
- ❌ 無「Share」分頁和分享 URL 功能

### 第 5 步：驗證所有環境變數

**為什麼**
確保所有環境變數正確設定，並按預期生效。

**驗證方法**

```bash
# macOS/Linux/WSL
echo "PLANNOTATOR_REMOTE=$PLANNOTATOR_REMOTE"
echo "PLANNOTATOR_PORT=$PLANNOTATOR_PORT"
echo "PLANNOTATOR_BROWSER=$PLANNOTATOR_BROWSER"
echo "PLANNOTATOR_SHARE=$PLANNOTATOR_SHARE"
```

```powershell
# Windows PowerShell
Write-Host "PLANNOTATOR_REMOTE=$env:PLANNOTATOR_REMOTE"
Write-Host "PLANNOTATOR_PORT=$env:PLANNOTATOR_PORT"
Write-Host "PLANNOTATOR_BROWSER=$env:PLANNOTATOR_BROWSER"
Write-Host "PLANNOTATOR_SHARE=$env:PLANNOTATOR_SHARE"
```

**你應該看到**：所有設定的環境變數及其值。

**預期輸出範例**（遠端環境設定）：
```bash
PLANNOTATOR_REMOTE=1
PLANNOTATOR_PORT=19432
PLANNOTATOR_BROWSER=
PLANNOTATOR_SHARE=
```

**預期輸出範例**（本地環境設定）：
```bash
PLANNOTATOR_REMOTE=
PLANNOTATOR_PORT=
PLANNOTATOR_BROWSER=Google Chrome
PLANNOTATOR_SHARE=disabled
```

## 踩坑提醒

### 坑 1：環境變數未生效

**症狀**：設定環境變數後，Plannotator 行為未改變。

**原因**：環境變數只在新的終端機工作階段中生效，或者需要重啟應用程式。

**解決**：
- 確認環境變數已永久寫入設定檔（如 `~/.bashrc`）
- 重啟終端機或執行 `source ~/.bashrc`
- 重啟 Claude Code 或 OpenCode

### 坑 2：連接埠被佔用

**症狀**：設定 `PLANNOTATOR_PORT` 後，啟動失敗。

**原因**：指定連接埠已被其他程序佔用。

**解決**：
```bash
# 檢查連接埠佔用（macOS/Linux）
lsof -i :19432

# 更換連接埠
export PLANNOTATOR_PORT=19433
```

### 坑 3：瀏覽器路徑錯誤

**症狀**：設定 `PLANNOTATOR_BROWSER` 後，瀏覽器未開啟。

**原因**：路徑不正確或檔案不存在。

**解決**：
- macOS：使用應用程式名稱而非完整路徑（如 `Google Chrome`）
- Linux/Windows：使用 `which` 或 `where` 指令確認可執行檔路徑
  ```bash
  which firefox  # Linux
  where chrome   # Windows
  ```

### 坑 4：遠端模式瀏覽器意外開啟

**症狀**：設定 `PLANNOTATOR_REMOTE=1` 後，瀏覽器仍在遠端伺服器上開啟。

**原因**：`PLANNOTATOR_REMOTE` 的值不是 `"1"` 或 `"true"`。

**解決**：
```bash
# 正確的值
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_REMOTE=true

# 錯誤的值（不會生效）
export PLANNOTATOR_REMOTE=yes
export PLANNOTATOR_REMOTE=enabled
```

### 坑 5：URL 分享停用後仍顯示選項

**症狀**：設定 `PLANNOTATOR_SHARE=disabled` 後，「Share as URL」仍可見。

**原因**：需要重啟應用程式才能生效。

**解決**：重啟 Claude Code 或 OpenCode。

## 本課小結

本課學習了 Plannotator 的 4 個核心環境變數：

| 環境變數 | 用途 | 預設值 | 適用場景 |
|--- | --- | --- | ---|
| `PLANNOTATOR_REMOTE` | 遠端模式開關 | 未設定（本地模式） | SSH、Devcontainer、WSL |
| `PLANNOTATOR_PORT` | 固定連接埠 | 遠端模式 19432，本地模式隨機 | 需要連接埠轉發或避免連接埠衝突 |
| `PLANNOTATOR_BROWSER` | 自訂瀏覽器 | 系統預設瀏覽器 | 希望使用特定瀏覽器 |
| `PLANNOTATOR_SHARE` | URL 分享開關 | 未設定（啟用） | 需要停用分享功能 |

**核心要點**：
- 遠端模式會自動使用固定連接埠並停用瀏覽器自動開啟
- 顯式設定的環境變數優先順序高於預設行為
- 環境變數修改後需要重啟應用程式才能生效
- 企業環境可能需要停用 URL 分享功能

## 下一課預告

> 下一課我們學習 **[常見問題排查](../../faq/common-problems/)**。
>
> 你會學到：
> - 如何解決連接埠佔用問題
> - 處理瀏覽器未開啟的情況
> - 修復計畫未顯示的錯誤
> - 偵錯技巧和日誌檢視方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 遠端模式偵測 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 16-29 |
| 連接埠取得邏輯 | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 34-49 |
| 瀏覽器開啟邏輯 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts) | 45-74 |
| URL 分享開關（Hook） | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts) | 44 |
| URL 分享開關（OpenCode） | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51 |

**關鍵常數**：
- `DEFAULT_REMOTE_PORT = 19432`：遠端模式預設連接埠

**關鍵函式**：
- `isRemoteSession()`：偵測是否執行在遠端環境（SSH、Devcontainer、WSL）
- `getServerPort()`：取得伺服器連接埠（優先環境變數，其次遠端模式預設，最後隨機）
- `openBrowser(url)`：在指定瀏覽器或系統預設瀏覽器中開啟 URL

</details>
