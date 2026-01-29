---
title: "OpenCode: 外掛安裝 | Plannotator"
sidebarTitle: "裝上就能用"
subtitle: "安裝 OpenCode 外掛"
description: "學習在 OpenCode 中安裝 Plannotator 外掛。透過設定 openable.json 新增外掛，執行安裝腳本取得斜線指令，設定環境變數適配遠端模式，驗證外掛是否正常運作。"
tags:
  - "安裝"
  - "設定"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 3
---

# 安裝 OpenCode 外掛

## 學完你能做什麼

- 在 OpenCode 中安裝 Plannotator 外掛
- 設定 `submit_plan` tool 和 `/plannotator-review` 指令
- 設定環境變數（遠端模式、連接埠、瀏覽器等）
- 驗證外掛安裝是否成功

## 你現在的困境

在 OpenCode 中使用 AI Agent 時，計畫審查需要在終端機閱讀純文字計畫，難以精確回饋。你想要一個視覺化介面來標註計畫、新增註解，並自動將回饋結構化地傳送回 Agent。

## 什麼時候用這一招

**開始使用 Plannotator 前必做**：如果你在 OpenCode 環境中開發，且希望獲得互動式計畫審查體驗。

## 🎒 開始前的準備

- [ ] 已安裝 [OpenCode](https://opencode.ai/)
- [ ] 瞭解基本的 `opencode.json` 設定（OpenCode 外掛系統）

::: warning 前置知識
如果你還不瞭解 OpenCode 的基本操作，建議先閱讀 [OpenCode 官方文件](https://opencode.ai/docs)。
:::

## 核心思路

Plannotator 為 OpenCode 提供兩個核心功能：

1. **`submit_plan` tool** - 當 Agent 完成計畫後呼叫，開啟瀏覽器進行互動式審查
2. **`/plannotator-review` 指令** - 手動觸發 Git diff 程式碼審查

安裝過程分兩步：
1. 在 `opencode.json` 中新增外掛設定（啟用 `submit_plan` tool）
2. 執行安裝腳本（取得 `/plannotator-review` 指令）

## 跟我做

### 第 1 步：透過 opencode.json 安裝外掛

找到你的 OpenCode 設定檔（通常位於專案根目錄或使用者設定目錄），在 `plugin` 陣列中新增 Plannotator：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**為什麼**
`opencode.json` 是 OpenCode 的外掛設定檔，新增外掛名稱後，OpenCode 會自動從 npm 倉庫下載並載入外掛。

你應該看到：OpenCode 啟動時會顯示「Loading plugin: @plannotator/opencode...」的訊息。

---

### 第 2 步：重新啟動 OpenCode

**為什麼**
外掛設定修改後需要重新啟動才能生效。

你應該看到：OpenCode 重新載入所有外掛。

---

### 第 3 步：執行安裝腳本取得斜線指令

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

:::

**為什麼**
這個腳本會：
1. 下載 `plannotator` CLI 工具到你的系統
2. 將 `/plannotator-review` 斜線指令安裝到 OpenCode
3. 清理任何快取的外掛版本

你應該看到：安裝成功提示，類似「Plannotator installed successfully!」

---

### 第 4 步：驗證安裝

在 OpenCode 中檢查外掛是否正常運作：

**檢查 `submit_plan` tool 是否可用**：
- 在對話中詢問 Agent「請使用 submit_plan 提交計畫」
- 如果外掛正常，Agent 應該能看到並呼叫這個 tool

**檢查 `/plannotator-review` 指令是否可用**：
- 在輸入框中輸入 `/plannotator-review`
- 如果外掛正常，應該能看到指令建議

你應該看到：兩個功能都能正常使用，沒有錯誤提示。

---

### 第 5 步：設定環境變數（選用）

Plannotator 支援以下環境變數，根據你的需求設定：

::: details 環境變數說明

| 環境變數 | 用途 | 預設值 | 範例 |
|--- | --- | --- | ---|
| `PLANNOTATOR_REMOTE` | 啟用遠端模式（devcontainer/SSH） | 未設定 | `export PLANNOTATOR_REMOTE=1` |
| `PLANNOTATOR_PORT` | 固定連接埠（遠端模式必須） | 本機隨機，遠端 19432 | `export PLANNOTATOR_PORT=9999` |
| `PLANNOTATOR_BROWSER` | 自訂瀏覽器路徑 | 系統預設 | `export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"` |
| `PLANNOTATOR_SHARE` | 停用 URL 分享 | 啟用 | `export PLANNOTATOR_SHARE=disabled` |

:::

**遠端模式設定範例**（devcontainer/SSH）：

在 `.devcontainer/devcontainer.json` 中：

```json
{
  "containerEnv": {
    "PLANNOTATOR_REMOTE": "1",
    "PLANNOTATOR_PORT": "9999"
  },
  "forwardPorts": [9999]
}
```

**為什麼**
- 遠端模式：在容器或遠端機器中執行 OpenCode 時，使用固定連接埠並自動開啟瀏覽器
- 連接埠轉發：讓主機能存取容器內的服務

你應該看到：當 Agent 呼叫 `submit_plan` 時，主控台會顯示伺服器 URL（而非自動開啟瀏覽器），例如：
```
Plannotator server running at http://localhost:9999
```

---

### 第 6 步：重新啟動 OpenCode（如修改了環境變數）

如果你在第 5 步設定了環境變數，需要再次重新啟動 OpenCode 讓設定生效。

---

## 檢查點 ✅

安裝完成後，確認以下幾點：

- [ ] `opencode.json` 中已新增 `@plannotator/opencode@latest`
- [ ] OpenCode 重新啟動後沒有外掛載入錯誤
- [ ] 輸入 `/plannotator-review` 能看到指令建議
- [ ] （選用）環境變數設定正確

## 踩坑提醒

### 常見錯誤 1：外掛載入失敗

**症狀**：OpenCode 啟動時提示「Failed to load plugin @plannotator/opencode」

**可能原因**：
- 網路問題導致無法從 npm 下載
- npm 快取損壞

**解決方法**：
1. 檢查網路連線
2. 執行安裝腳本（它會清理外掛快取）
3. 手動清理 npm 快取：`npm cache clean --force`

---

### 常見錯誤 2：斜線指令不可用

**症狀**：輸入 `/plannotator-review` 沒有指令建議

**可能原因**：安裝腳本未成功執行

**解決方法**：重新執行安裝腳本（步驟 3）

---

### 常見錯誤 3：遠端模式下無法開啟瀏覽器

**症狀**：在 devcontainer 中呼叫 `submit_plan` 時瀏覽器未開啟

**可能原因**：
- 未設定 `PLANNOTATOR_REMOTE=1`
- 未設定連接埠轉發

**解決方法**：
1. 確認 `PLANNOTATOR_REMOTE=1` 已設定
2. 檢查 `.devcontainer/devcontainer.json` 中 `forwardPorts` 包含你設定的連接埠
3. 手動存取顯示的 URL：`http://localhost:9999`

---

### 常見錯誤 4：連接埠佔用

**症狀**：伺服器啟動失敗，提示「Port already in use」

**可能原因**：之前的伺服器未正確關閉

**解決方法**：
1. 修改 `PLANNOTATOR_PORT` 為其他連接埠
2. 或手動關閉佔用連接埠的程序（macOS/Linux: `lsof -ti:9999 | xargs kill`）

---

## 本課小結

本課介紹了如何在 OpenCode 中安裝和設定 Plannotator 外掛：

1. **透過 `opencode.json` 新增外掛** - 啟用 `submit_plan` tool
2. **執行安裝腳本** - 取得 `/plannotator-review` 斜線指令
3. **設定環境變數** - 適配遠端模式和自訂需求
4. **驗證安裝** - 確認外掛正常運作

安裝完成後，你可以：
- 讓 Agent 使用 `submit_plan` 提交計畫進行互動式審查
- 使用 `/plannotator-review` 手動審查 Git diff

## 下一課預告

> 下一課我們學習 **[計畫審查基礎](../../platforms/plan-review-basics/)**。
>
> 你會學到：
> - 如何檢視 AI 產生的計畫
> - 新增不同類型的註解（刪除、取代、插入、評論）
> - 批准或拒絕計畫

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能                    | 檔案路徑                                                                                      | 行號       |
|--- | --- | ---|
| 外掛入口定義               | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 34-280     |
| `submit_plan` tool 定義 | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 209-252    |
|--- | --- | ---|
| 外掛設定（opencode.json）注入 | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 55-63      |
| 環境變數讀取               | [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts) | 37-51      |
| 計畫審查伺服器啟動            | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts) | 全文        |
| 程式碼審查伺服器啟動            | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts) | 全文        |
| 遠端模式偵測               | [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts) | 全文        |

**關鍵常數**：
- `PLANNOTATOR_REMOTE`: 遠端模式標誌（設定為「1」或「true」啟用）
- `PLANNOTATOR_PORT`: 固定連接埠號（本機預設隨機，遠端預設 19432）

**關鍵函式**：
- `startPlannotatorServer()`: 啟動計畫審查伺服器
- `startReviewServer()`: 啟動程式碼審查伺服器
- `getSharingEnabled()`: 取得 URL 分享開關狀態（從 OpenCode 設定或環境變數）

</details>
