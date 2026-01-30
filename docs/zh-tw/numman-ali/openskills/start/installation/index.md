---
title: "安裝: 快速部署 | OpenSkills"
sidebarTitle: "5 分鐘跑起來"
subtitle: "安裝: 快速部署 | OpenSkills"
description: "學習 OpenSkills 的安裝方法。在 5 分鐘內完成環境設定，支援 npx 和全域安裝兩種方式，涵蓋環境驗證和問題排查。"
tags:
- "安裝"
- "環境設定"
- "Node.js"
- "Git"
prerequisite:
- "終端機基礎操作"
duration: 3
order: 3
---

# 安裝 OpenSkills 工具

## 學完你能做什麼

完成本課後，你將能夠：

- 檢查並設定 Node.js 和 Git 環境
- 使用 `npx` 或全域安裝的方式使用 OpenSkills
- 驗證 OpenSkills 是否正確安裝並可用
- 解決常見的安裝問題（版本不匹配、網路問題等）

## 你現在的困境

你可能遇到了這些問題：

- **不確定環境要求**：不知道需要什麼版本的 Node.js 和 Git
- **不知道如何安裝**：OpenSkills 是 npm 套件，但不清楚是用 npx 還是全域安裝
- **安裝失敗**：遇到版本不相容或網路問題
- **權限問題**：在全域安裝時遇到 EACCES 錯誤

本課幫你一步步解決這些問題。

## 什麼時候用這一招

當你需要：

- 首次使用 OpenSkills
- 更新到新版本
- 在新機器上設定開發環境
- 排查安裝相關問題

## 🎒 開始前的準備

::: tip 系統要求

OpenSkills 對系統有最低要求，不滿足這些要求會導致安裝失敗或執行異常。

:::

::: warning 前置檢查

在開始之前，請確認你已安裝以下軟體：

1. **Node.js 20.6 或更高版本**
2. **Git**（用於從儲存庫複製技能）

:::

## 核心思路

OpenSkills 是一個 Node.js CLI 工具，有兩種使用方式：

| 方式 | 指令 | 優點 | 缺點 | 適用場景 |
| --- | --- | --- | --- | --- |
| **npx** | `npx openskills` | 無需安裝，自動使用最新版本 | 每次執行需要下載（有快取） | 偶爾使用、測試新版本 |
| **全域安裝** | `openskills` | 指令更短，回應更快 | 需要手動更新 | 頻繁使用、固定版本 |

**推薦使用 npx**，除非你非常頻繁地使用 OpenSkills。

---

## 跟我做

### 第 1 步：檢查 Node.js 版本

首先，檢查系統是否安裝了 Node.js 以及版本是否滿足要求：

```bash
node --version
```

**為什麼**

OpenSkills 需要 Node.js 20.6 或更高版本，低於此版本會導致執行時錯誤。

**你應該看到**：

```bash
v20.6.0
```

或者更高版本（如 `v22.0.0`）。

::: danger 版本過低

如果看到 `v18.x.x` 或更低版本（如 `v16.x.x`），你需要升級 Node.js。

:::

**如果版本過低**：

推薦使用 [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) 安裝和管理 Node.js：

::: code-group

```bash [macOS/Linux]
# 安裝 nvm（如果未安裝）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新載入終端機設定
source ~/.bashrc # 或 source ~/.zshrc

# 安裝 Node.js 20 LTS
nvm install 20
nvm use 20

# 驗證版本
node --version
```

```powershell [Windows]
# 下載並安裝 nvm-windows
# 訪問：https://github.com/coreybutler/nvm-windows/releases

# 安裝後，在 PowerShell 中執行：
nvm install 20
nvm use 20

# 驗證版本
node --version
```

:::

**你應該看到**（升級後）：

```bash
v20.6.0
```

---

### 第 2 步：檢查 Git 安裝

OpenSkills 需要使用 Git 來複製技能儲存庫：

```bash
git --version
```

**為什麼**

從 GitHub 安裝技能時，OpenSkills 會使用 `git clone` 指令下載儲存庫。

**你應該看到**：

```bash
git version 2.40.0
```

（版本號可能不同，只要有輸出即可）

::: danger Git 未安裝

如果看到 `command not found: git` 或類似錯誤，你需要安裝 Git。

:::

**如果 Git 未安裝**：

::: code-group

```bash [macOS]
# macOS 通常已預裝 Git，如果沒有，使用 Homebrew：
brew install git
```

```powershell [Windows]
# 下載並安裝 Git for Windows
# 訪問：https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

安裝完成後，重新執行 `git --version` 驗證。

---

### 第 3 步：驗證環境

現在驗證 Node.js 和 Git 是否都可用：

```bash
node --version && git --version
```

**你應該看到**：

```bash
v20.6.0
git version 2.40.0
```

如果兩個指令都成功輸出，說明環境設定正確。

---

### 第 4 步：使用 npx 方式（推薦）

OpenSkills 推薦使用 `npx` 直接執行，無需額外安裝：

```bash
npx openskills --version
```

**為什麼**

`npx` 會自動下載並執行最新版本的 OpenSkills，無需手動安裝或更新。第一次執行時會下載套件到本地快取，後續執行會使用快取，速度很快。

**你應該看到**：

```bash
1.5.0
```

（版本號可能不同）

::: tip npx 的工作原理

`npx` (Node Package eXecute) 是 npm 5.2.0+ 自帶的工具：
- 首次執行：從 npm 下載套件到暫存目錄
- 後續執行：使用快取（預設 24 小時過期）
- 更新：快取過期後會自動下載最新版本

:::

**測試安裝指令**：

```bash
npx openskills list
```

**你應該看到**：

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

或者已安裝技能的列表。

---

### 第 5 步：（可選）全域安裝

如果你頻繁使用 OpenSkills，可以選擇全域安裝：

```bash
npm install -g openskills
```

**為什麼**

全域安裝後，可以直接使用 `openskills` 指令，不需要每次都輸入 `npx`，回應更快。

**你應該看到**：

```bash
added 4 packages in 3s
```

（輸出可能不同）

::: warning 權限問題

如果在全域安裝時遇到 `EACCES` 錯誤，說明沒有權限寫入全域目錄。

**解決方法**：

```bash
# 方法 1：使用 sudo（macOS/Linux）
sudo npm install -g openskills

# 方法 2：修復 npm 權限（推薦）
# 查看全域安裝目錄
npm config get prefix

# 設定正確的權限（替換 /usr/local 為實際路徑）
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**驗證全域安裝**：

```bash
openskills --version
```

**你應該看到**：

```bash
1.5.0
```

::: tip 更新全域安裝

如果要更新全域安裝的 OpenSkills：

```bash
npm update -g openskills
```

:::

---

## 檢查點 ✅

完成上述步驟後，你應該確認：

- [ ] Node.js 版本是 20.6 或更高（`node --version`）
- [ ] Git 已安裝（`git --version`）
- [ ] `npx openskills --version` 或 `openskills --version` 能正確輸出版本號
- [ ] `npx openskills list` 或 `openskills list` 能正常執行

如果所有檢查都通過，恭喜你！OpenSkills 已成功安裝。

---

## 踩坑提醒

### 問題 1：Node.js 版本過低

**錯誤資訊**：

```bash
Error: The module was compiled against a different Node.js version
```

**原因**：Node.js 版本低於 20.6

**解決方法**：

使用 nvm 安裝 Node.js 20 或更高版本：

```bash
nvm install 20
nvm use 20
```

---

### 問題 2：npx 指令找不到

**錯誤資訊**：

```bash
command not found: npx
```

**原因**：npm 版本過低（npx 需要 npm 5.2.0+）

**解決方法**：

```bash
# 更新 npm
npm install -g npm@latest

# 驗證版本
npx --version
```

---

### 問題 3：網路超時或下載失敗

**錯誤資訊**：

```bash
Error: network timeout
```

**原因**：npm 儲存庫訪問受限

**解決方法**：

```bash
# 使用 npm 鏡像源（如淘寶鏡像）
npm config set registry https://registry.npmmirror.com

# 重新嘗試
npx openskills --version
```

恢復預設源：

```bash
npm config set registry https://registry.npmjs.org
```

---

### 問題 4：全域安裝權限錯誤

**錯誤資訊**：

```bash
Error: EACCES: permission denied
```

**原因**：沒有權限寫入全域安裝目錄

**解決方法**：

參考「第 5 步」中的權限修復方法，或使用 `sudo`（不推薦）。

---

### 問題 5：Git 複製失敗

**錯誤資訊**：

```bash
Error: git clone failed
```

**原因**：SSH 金鑰未設定或網路問題

**解決方法**：

```bash
# 測試 Git 連線
git ls-remote https://github.com/numman-ali/openskills.git

# 如果失敗，檢查網路或設定代理
git config --global http.proxy http://proxy.example.com:8080
```

---

## 本課小結

本課我們學習了：

1. **環境要求**：Node.js 20.6+ 和 Git
2. **推薦使用方式**：`npx openskills`（無需安裝）
3. **可選全域安裝**：`npm install -g openskills`（頻繁使用時）
4. **環境驗證**：檢查版本號和指令可用性
5. **常見問題**：版本不匹配、權限問題、網路問題

現在你已經完成了 OpenSkills 的安裝，下一課我們將學習如何安裝第一個技能。

---

## 下一課預告

> 下一課我們學習 **[安裝第一個技能](../first-skill/)**
>
> 你會學到：
> - 如何從 Anthropic 官方儲存庫安裝技能
> - 互動式選擇技能的技巧
> - 技能的目錄結構
> - 驗證技能是否正確安裝

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-24

### 核心設定

| 設定項 | 檔案路徑 | 行號 |
| --- | --- | --- |
| Node.js 版本要求 | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47 |
| 套件資訊 | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9 |
| CLI 入口 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts) | 39-80 |

### 關鍵常數

- **Node.js 要求**：`>=20.6.0` (package.json:46)
- **套件名稱**：`openskills` (package.json:2)
- **版本**：`1.5.0` (package.json:3)
- **CLI 指令**：`openskills` (package.json:8)

### 相依性說明

**執行時相依性** (package.json:48-53)：
- `@inquirer/prompts`: 互動式選擇
- `chalk`: 終端機彩色輸出
- `commander`: CLI 參數解析
- `ora`: 載入動畫

**開發相依性** (package.json:54-59)：
- `typescript`: TypeScript 編譯
- `vitest`: 單元測試
- `tsup`: 打包工具

</details>
