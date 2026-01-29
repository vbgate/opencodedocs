---
title: "Claude Code: 安裝與設定 | Plannotator"
sidebarTitle: "3 分鐘裝好"
subtitle: "Claude Code: 安裝與設定"
description: "學習在 Claude Code 中安裝 Plannotator 外掛的方法。3 分鐘完成設定，支援外掛系統和手動 Hook 兩種方式，適用於 macOS、Linux 和 Windows 系統，涵蓋遠端和 Devcontainer 環境設定。"
tags:
  - "installation"
  - "claude-code"
  - "getting-started"
prerequisite:
  - "start-getting-started"
order: 2
---

# 安裝 Claude Code 外掛

## 學完你能做什麼

- 在 Claude Code 中啟用 Plannotator 計畫審查功能
- 選擇適合你的安裝方式（外掛系統或手動 Hook）
- 驗證安裝是否成功
- 在遠端/Devcontainer 環境中正確設定 Plannotator

## 你現在的困境

使用 Claude Code 時，AI 產生的計畫只能在終端機中閱讀，難以進行精確的審查和回饋。你想：
- 在瀏覽器中視覺化檢視 AI 計畫
- 對計畫進行刪除、替換、插入等精確註解
- 一次性給 AI 清晰的修改指令

## 什麼時候用這一招

適合以下情境：
- 你首次使用 Claude Code + Plannotator
- 你需要重新安裝或升級 Plannotator
- 你想在遠端環境（SSH、Devcontainer、WSL）中使用

## 核心思路

Plannotator 的安裝分為兩部分：
1. **安裝 CLI 指令**：這是核心執行環境，負責啟動本機伺服器和瀏覽器
2. **設定 Claude Code**：透過外掛系統或手動 Hook，讓 Claude Code 在完成計畫時自動呼叫 Plannotator

安裝完成後，當 Claude Code 呼叫 `ExitPlanMode` 時，會自動觸發 Plannotator，在瀏覽器中開啟計畫審查介面。

## 🎒 開始前的準備

::: warning 前置檢查

- [ ] 已安裝 Claude Code 2.1.7 或更高版本（需要支援 Permission Request Hooks）
- [ ] 有權限在終端機中執行指令（Linux/macOS 需要 sudo 或安裝到 home 目錄）

:::

## 跟我做

### 第 1 步：安裝 Plannotator CLI 指令

首先，安裝 Plannotator 的命令列工具。

::: code-group

```bash [macOS / Linux / WSL]
curl -fsSL https://plannotator.ai/install.sh | bash
```

```powershell [Windows PowerShell]
irm https://plannotator.ai/install.ps1 | iex
```

```cmd [Windows CMD]
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

:::

**你應該看到**：終端機顯示安裝進度，完成後提示 `plannotator {版本號} installed to {安裝路徑}/plannotator`

**檢查點 ✅**：執行以下指令驗證安裝：

::: code-group

```bash [macOS / Linux]
which plannotator
```

```powershell [Windows PowerShell]
Get-Command plannotator
```

```cmd [Windows CMD]
where plannotator
```

:::

你應該看到 Plannotator 指令的安裝路徑，例如 `/usr/local/bin/plannotator` 或 `$HOME/.local/bin/plannotator`。

### 第 2 步：在 Claude Code 中安裝外掛

開啟 Claude Code，執行以下指令：

```bash
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**你應該看到**：外掛安裝成功的提示訊息。

::: danger 重要：必須重新啟動 Claude Code

安裝外掛後，**必須重新啟動 Claude Code**，否則 Hooks 不會生效。

:::

### 第 3 步：驗證安裝

重新啟動後，在 Claude Code 中執行以下指令測試程式碼審查功能：

```bash
/plannotator-review
```

**你應該看到**：
- 瀏覽器自動開啟 Plannotator 的程式碼審查介面
- 終端機顯示 "Opening code review..." 並等待你的審查回饋

如果看到以上輸出，恭喜你，安裝成功！

::: tip 說明
計畫審查功能會在 Claude Code 呼叫 `ExitPlanMode` 時自動觸發，無需手動執行測試指令。你可以在實際使用計畫模式時測試該功能。
:::

### 第 4 步：（選用）手動 Hook 安裝

如果你不想使用外掛系統，或者需要在 CI/CD 環境中使用，可以手動設定 Hook。

編輯 `~/.claude/settings.json` 檔案（如果檔案不存在則建立），新增以下內容：

```json
{
  "hooks": {
    "PermissionRequest": [
      {
        "matcher": "ExitPlanMode",
        "hooks": [
          {
            "type": "command",
            "command": "plannotator",
            "timeout": 1800
          }
        ]
      }
    ]
  }
}
```

**欄位說明**：
- `matcher: "ExitPlanMode"` - 當 Claude Code 呼叫 ExitPlanMode 時觸發
- `command: "plannotator"` - 執行安裝的 Plannotator CLI 指令
- `timeout: 1800` - 逾時時間（30 分鐘），給你足夠的時間審查計畫

**檢查點 ✅**：儲存檔案後，重新啟動 Claude Code，然後執行 `/plannotator-review` 測試。

### 第 5 步：（選用）遠端/Devcontainer 設定

如果你在 SSH、Devcontainer 或 WSL 等遠端環境中使用 Claude Code，需要設定環境變數以固定連接埠並停用自動開啟瀏覽器。

在遠端環境中執行：

```bash
export PLANNOTATOR_REMOTE=1
export PLANNOTATOR_PORT=9999  # 選擇一個你將透過連接埠轉發存取的連接埠
```

**這些變數會**：
- 使用固定連接埠（而非隨機連接埠），方便設定連接埠轉發
- 略過自動開啟瀏覽器（因為瀏覽器在你的本機上）
- 在終端機列印 URL，你可以複製到本機瀏覽器開啟

::: tip 連接埠轉發

**VS Code Devcontainer**：連接埠通常會自動轉發，檢查 VS Code 的「Ports」分頁確認。

**SSH 連接埠轉發**：編輯 `~/.ssh/config`，新增：

```bash
Host your-server
    LocalForward 9999 localhost:9999
```

:::

## 踩坑提醒

### 問題 1：安裝後 `/plannotator-review` 指令無回應

**原因**：忘記重新啟動 Claude Code，Hooks 未生效。

**解決**：完全退出 Claude Code 並重新開啟。

### 問題 2：安裝腳本執行失敗

**原因**：網路問題或權限不足。

**解決**：
- 檢查網路連線，確保能存取 `https://plannotator.ai`
- 如果遇到權��問題，嘗試手動下載安裝腳本並執行

### 問題 3：遠端環境中瀏覽器無法開啟

**原因**：遠端環境沒有圖形介面，瀏覽器無法啟動。

**解決**：設定 `PLANNOTATOR_REMOTE=1` 環境變數，並設定連接埠轉發。

### 問題 4：連接埠被佔用

**原因**：固定連接埠 `9999` 已被其他程式佔用。

**解決**：選擇另一個可用連接埠，例如 `8888` 或 `19432`。

## 本課小結

- ✅ 安裝了 Plannotator CLI 指令
- ✅ 透過外掛系統或手動 Hook 設定了 Claude Code
- ✅ 驗證了安裝是否成功
- ✅ （選用）設定了遠端/Devcontainer 環境

## 下一課預告

> 下一課我們學習 **[安裝 OpenCode 外掛](../installation-opencode/)**。
>
> 如果你在使用 OpenCode 而非 Claude Code，下一課會教你在 OpenCode 中完成類似的設定。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-24

| 功能              | 檔案路徑                                                                                                | 行號    |
| ----------------- | ------------------------------------------------------------------------------------------------------- | ------- |
| 安裝腳本入口      | [`README.md`](https://github.com/backnotprop/plannotator/blob/main/README.md#L35-L60)                     | 35-60   |
| Hook 設定說明     | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L30-L39)   | 30-39   |
| 手動 Hook 範例    | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L42-L62)   | 42-62   |
| 環境變數設定      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L73-L79)   | 73-79   |
| 遠端模式設定      | [`apps/hook/README.md`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/README.md#L81-L94)   | 81-94   |

**關鍵常數**：
- `PLANNOTATOR_REMOTE = "1"`：啟用遠端模式，使用固定連接埠
- `PLANNOTATOR_PORT = 9999`：遠端模式使用的固定連接埠（預設 19432）
- `timeout: 1800`：Hook 逾時時間（30 分鐘）

**關鍵環境變數**：
- `PLANNOTATOR_REMOTE`：遠端模式標誌
- `PLANNOTATOR_PORT`：固定連接埠號
- `PLANNOTATOR_BROWSER`：自訂瀏覽器路徑

</details>
