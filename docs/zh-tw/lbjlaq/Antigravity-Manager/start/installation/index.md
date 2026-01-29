---
title: "安裝: Homebrew 與 Releases 部署 | Antigravity Manager"
sidebarTitle: "5 分鐘裝起來"
subtitle: "安裝與升級：桌面端最佳安裝路徑（brew / releases）"
description: "學習 Antigravity Tools 的 Homebrew 和 Releases 安裝方法。在 5 分鐘內完成部署，處理 macOS quarantine 問題和應用程式已損壞的常見錯誤，並掌握升級流程。"
tags:
  - "安裝"
  - "升級"
  - "Homebrew"
  - "Releases"
  - "Docker"
prerequisite:
  - "start-getting-started"
order: 2
---

# 安裝與升級：桌面端最佳安裝路徑（brew / releases）

如果你想快速把 Antigravity Tools 裝起來並跑通後續課程，這一課只做一件事：把「裝上 + 能開啟 + 知道怎麼升級」講清楚。

## 學完你能做什麼

- 選對安裝路徑：優先 Homebrew，其次 GitHub Releases
- 處理 macOS 常見攔截（quarantine / 「應用程式已損壞」）
- 在特殊環境下安裝：Arch 腳本、Headless Xvfb、Docker
- 知道每種安裝方式的升級入口與自檢方法

## 你現在的困境

- 文件裡安裝方式太多，不知道該選哪一個
- macOS 下載後開啟不了，提示「已損壞/無法開啟」
- 你在 NAS/伺服器上跑，既沒有桌面，也不方便授權

## 什麼時候用這一招

- 第一次安裝 Antigravity Tools
- 換電腦/重裝系統後恢復環境
- 版本升級後遇到系統攔截或啟動異常

::: warning 前置知識
如果你還不確定 Antigravity Tools 解決什麼問題，先看一眼 **[Antigravity Tools 是什麼](/zh-tw/lbjlaq/Antigravity-Manager/start/getting-started/)**，再回來安裝會更順。
:::

## 核心思路

推薦你按「桌面優先、伺服器再說」的順序選擇：

1. 桌面端（macOS/Linux）：用 Homebrew 裝（最快、升級也最省心）
2. 桌面端（全平台）：從 GitHub Releases 下載（適合不想裝 brew 或網路受限）
3. 伺服器/NAS：優先 Docker；其次 Headless Xvfb（更像「在伺服器跑桌面應用程式」）

## 跟我做

### 第 1 步：先選你的安裝方式

**為什麼**
不同安裝方式的「升級/回滾/排障」成本差很大，先選路徑能少走彎路。

**推薦**：

| 場景 | 推薦安裝方式 |
|--- | ---|
| macOS / Linux 桌面 | Homebrew（選項 A） |
| Windows 桌面 | GitHub Releases（選項 B） |
| Arch Linux | 官方腳本（Arch 選項） |
| 遠端伺服器無桌面 | Docker（選項 D）或 Headless Xvfb（選項 C-Headless） |

**你應該看到**：你能明確自己屬於哪一行。

### 第 2 步：用 Homebrew 安裝（macOS / Linux）

**為什麼**
Homebrew 是「自動處理下載與安裝」的路徑，升級也最順手。

```bash
#1) 訂閱本倉庫的 Tap
brew tap lbjlaq/antigravity-manager https://github.com/lbjlaq/Antigravity-Manager

#2) 安裝應用程式
brew install --cask antigravity-tools
```

::: tip macOS 權限提示
README 提到：如果你在 macOS 上遇到權限/隔離相關問題，可以改用：

```bash
brew install --cask --no-quarantine antigravity-tools
```
:::

**你應該看到**：`brew` 輸出安裝成功，並且系統裡出現 Antigravity Tools 應用程式。

### 第 3 步：從 GitHub Releases 手動安裝（macOS / Windows / Linux）

**為什麼**
當你不使用 Homebrew，或希望自己控制安裝包來源時，這條路最直接。

1. 開啟專案 Releases 頁面：`https://github.com/lbjlaq/Antigravity-Manager/releases`
2. 選擇與你系統相符的安裝包：
   - macOS：`.dmg`（Apple Silicon / Intel）
   - Windows：`.msi` 或便攜版 `.zip`
   - Linux：`.deb` 或 `AppImage`
3. 按系統安裝程式提示完成安裝

**你應該看到**：安裝完成後，能在系統應用程式列表裡找到 Antigravity Tools 並啟動。

### 第 4 步：macOS 「應用程式已損壞，無法開啟」的處理

**為什麼**
README 明確給了這個場景的修復方式；如果你遇到同樣提示，直接照做就行。

```bash
sudo xattr -rd com.apple.quarantine "/Applications/Antigravity Tools.app"
```

**你應該看到**：再次啟動應用程式時，不再出現「已損壞/無法開啟」的攔截提示。

### 第 5 步：升級（按你的安裝方式選擇）

**為什麼**
升級時最容易踩坑的是「裝法變了」，導致你不知道該去哪裡更新。

::: code-group

```bash [Homebrew]
#升級前先更新 tap 資訊
brew update

#升級cask
brew upgrade --cask antigravity-tools
```

```text [Releases]
重新下載最新版本的安裝包（.dmg/.msi/.deb/AppImage），按系統提示覆蓋安裝即可。
```

```bash [Headless Xvfb]
cd /opt/antigravity
sudo ./upgrade.sh
```

```bash [Docker]
cd deploy/docker

#README 說明容器啟動時會嘗試拉取最新 release；最簡單的升級方式是重啟容器
docker compose restart
```

:::

**你應該看到**：升級完成後應用程式仍能正常啟動；如果你使用 Docker/Headless，也能繼續存取探活端點。

## 其他安裝方式（特定場景）

### Arch Linux：官方一鍵安裝腳本

README 提供了 Arch 腳本入口：

```bash
curl -sSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/arch/install.sh | bash
```

::: details 這個腳本做了什麼？
它會透過 GitHub API 取得最新 release，下載 `.deb` 資產計算 SHA256，再生成 PKGBUILD 並用 `makepkg -si` 安裝。
:::

### 遠端伺服器：Headless Xvfb

如果你需要在無介面的 Linux 伺服器上跑 GUI 應用程式，專案提供了 Xvfb 部署：

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

安裝完成後，文件給出的常用自檢指令包括：

```bash
systemctl status antigravity
tail -f /opt/antigravity/logs/app.log
curl localhost:8045/healthz
```

### NAS/伺服器：Docker（帶瀏覽器 VNC）

Docker 部署會在瀏覽器裡提供 noVNC（方便 OAuth/授權類操作），同時對應代理連接埠：

```bash
cd deploy/docker
docker compose up -d
```

你應該能存取：`http://localhost:6080/vnc_lite.html`。

## 踩坑提醒

- brew 安裝失敗：先確認你已安裝 Homebrew，再重試 README 中的 `brew tap` / `brew install --cask`
- macOS 無法開啟：優先嘗試 `--no-quarantine`；已安裝則用 `xattr` 清理 quarantine
- 伺服器部署的局限：Headless Xvfb 本質是「用虛擬顯示器跑桌面程式」，資源佔用會高於純後端服務

## 本課小結

- 桌面端最推薦：Homebrew（安裝與升級都省心）
- 不用 brew：直接用 GitHub Releases
- 伺服器/NAS：優先 Docker；需要 systemd 管理則用 Headless Xvfb

## 下一課預告

下一課我們把「能開啟」往前推進一步：弄清楚 **[資料目錄、日誌、系統匣與自動啟動](/zh-tw/lbjlaq/Antigravity-Manager/start/first-run-data/)**，這樣你遇到問題才知道從哪裡排。

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-23

| 主題 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Homebrew 安裝（tap + cask） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L112-L127) | 112-127 |
| Releases 手動下載（各平台安裝包） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L128-L133) | 128-133 |
| Arch 一鍵安裝腳本入口 | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L134-L140) | 134-140 |
| Arch 安裝腳本實作（GitHub API + makepkg） | [`deploy/arch/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/arch/install.sh#L1-L56) | 1-56 |
| Headless Xvfb 安裝入口（curl | sudo bash） | [`README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/README.md#L141-L149) | 141-149 |
| Headless Xvfb 部署/升級/運維指令 | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L1-L99) | 1-99 |
| Headless Xvfb install.sh（systemd + 8045 預設配置） | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L1-L99) | 1-99 |
|--- | --- | ---|
| Docker 部署說明（noVNC 6080 / 代理 8045） | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L1-L35) | 1-35 |
| Docker 連接埠/資料卷配置（8045 + antigravity_data） | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L25) | 1-25 |
|--- | --- | ---|

</details>
