---
title: "部署: 伺服器部署方案 | Antigravity-Manager"
sidebarTitle: "在伺服器上跑起來"
subtitle: "部署: 伺服器部署方案"
description: "學習 Antigravity-Manager 的伺服器部署方法。對比 Docker noVNC 與 Headless Xvfb 兩種方案，完成安裝設定、資料持久化和探活排障，建立可運維的伺服器環境。"
tags:
  - "deployment"
  - "docker"
  - "xvfb"
  - "novnc"
  - "systemd"
  - "backup"
prerequisite:
  - "start-installation"
  - "start-backup-migrate"
  - "advanced-security"
duration: 20
order: 10
---
# 伺服器部署：Docker noVNC vs Headless Xvfb（選型與運維）

你想做 Antigravity Tools 的伺服器部署，把它跑在 NAS/伺服器上，通常不是為了「把 GUI 遠端打開看看」，而是為了把它當成一個長期執行的本機 API 閘道：一直線上、能探活、能升級、能備份、出問題能定位。

這節課只講兩條專案裡已經給出的可落地路徑：Docker（帶 noVNC）和 Headless Xvfb（systemd 管理）。所有指令和預設值都以倉庫裡的部署檔案為準。

::: tip 如果你只想「先跑起來一次」
上手安裝篇已經覆蓋了 Docker 與 Headless Xvfb 的入口指令，你可以先看 **[安裝與升級](/zh-tw/lbjlaq/Antigravity-Manager/start/installation/)**，再回到這節課把「運維閉環」補齊。
:::

## 學完你能做什麼

- 選對部署形態：知道 Docker noVNC 和 Headless Xvfb 各自解決什麼問題
- 跑通一條閉環：部署 -> 同步帳號資料 -> 探活 `/healthz` -> 看日誌 -> 備份
- 把升級做成可控動作：知道 Docker「啟動時自動更新」和 Xvfb `upgrade.sh` 的差異

## 你現在的困境

- 伺服器沒有桌面，但你又離不開 OAuth/授權這類「必須有瀏覽器」的操作
- 你只跑起來一次還不夠，你更想要：斷電重啟後自動恢復、可探活、可備份
- 你擔心把 8045 連接埠暴露出去會有安全風險，但又不知道該從哪裡收口

## 什麼時候用這一招

- NAS/家用伺服器：希望用瀏覽器就能打開 GUI 完成授權（Docker/noVNC 很省心）
- 伺服器長期執行：你更想用 systemd 管理程序、日誌落盤、腳本升級（Headless Xvfb 更像「運維專案」）

## 什麼是「伺服器部署」模式？

**伺服器部署**指的是：你不在本機桌面上執行 Antigravity Tools，而是把它放到一台長期線上的機器上執行，並把反代連接埠（預設 8045）作為對外服務入口。它的核心不是「遠端看介面」，而是建立一套穩定的運維閉環：資料持久化、探活、日誌、升級與備份。

## 核心思路

1. 先選「你最缺的能力」：缺瀏覽器授權就選 Docker/noVNC；缺運維可控性就選 Headless Xvfb。
2. 再把「資料」定下來：帳號/設定都在 `.antigravity_tools/`，要麼用 Docker volume，要麼固定到 `/opt/antigravity/.antigravity_tools/`。
3. 最後做「可運維閉環」：探活用 `/healthz`，故障先看 logs，再決定重啟或升級。

::: warning 前置提醒：先把安全基線定了
如果你會把 8045 暴露到區域網路/公網，先看 **[安全與隱私：auth_mode、allow_lan_access，以及「不要洩漏帳號資訊」的設計](/zh-tw/lbjlaq/Antigravity-Manager/advanced/security/)**。
:::

## 選型速查：Docker vs Headless Xvfb

| 你最在意的點 | 更推薦 | 為什麼 |
|--- | --- | ---|
| 需要瀏覽器做 OAuth/授權 | Docker（noVNC） | 容器內自带 Firefox ESR，可直接在瀏覽器裡操作（見 `deploy/docker/README.md`） |
| 想要 systemd 管理/日誌落盤 | Headless Xvfb | install 腳本會安裝 systemd service，並把日誌 append 到 `logs/app.log`（見 `deploy/headless-xvfb/install.sh`） |
| 想要隔離與資源限制 | Docker | compose 方式天然隔離、也更容易配資源限制（見 `deploy/docker/README.md`） |

## 跟我做

### 第 1 步：先確認「資料目錄」在哪裡

**為什麼**
部署成功但「沒有帳號/設定」，本質上就是資料目錄沒帶過去或沒持久化。

- Docker 方案會把資料掛載到容器內的 `/home/antigravity/.antigravity_tools`（compose volume）
- Headless Xvfb 方案會把資料放在 `/opt/antigravity/.antigravity_tools`（並透過 `HOME=$(pwd)` 固定寫入位置）

**你應該看到**
- Docker：`docker volume ls` 能看到 `antigravity_data`
- Xvfb：`/opt/antigravity/.antigravity_tools/` 存在，並包含 `accounts/`、`gui_config.json`

### 第 2 步：Docker/noVNC 跑起來（適合需要瀏覽器授權）

**為什麼**
Docker 方案把「虛擬顯示器 + 視窗管理器 + noVNC + 應用 + 瀏覽器」打包進一個容器，省去了你在伺服器上裝一堆圖形依賴。

在伺服器上執行：

```bash
cd deploy/docker
docker compose up -d
```

開啟 noVNC：

```text
http://<server-ip>:6080/vnc_lite.html
```

**你應該看到**
- `docker compose ps` 顯示容器在執行
- 瀏覽器能開啟 noVNC 頁面

::: tip 關於 noVNC 連接埠（推薦保持預設）
`deploy/docker/README.md` 提到可以用 `NOVNC_PORT` 自訂連接埠，但當前實作中 `start.sh` 啟動 `websockify` 時監聽的是寫死的 6080 連接埠。要修改連接埠需要同時調整 docker-compose 的連接埠映射和 start.sh 的監聽連接埠。

為了避免設定不一致，推薦直接使用預設 6080。
:::

### 第 3 步：Docker 的持久化、探活與備份

**為什麼**
容器的可用性靠兩件事：程序健康（是否還在跑）和資料持久化（重啟後帳號還在）。

1) 確認持久化 volume 已掛載：

```bash
cd deploy/docker
docker compose ps
```

2) 備份 volume（專案 README 給了 tar 備份方式）：

```bash
docker run --rm -v antigravity_data:/data -v $(pwd):/backup alpine \
  tar czf /backup/antigravity-backup.tar.gz /data
```

3) 容器健康檢查（Dockerfile 有 HEALTHCHECK）：

```bash
docker inspect --format '{{json .State.Health}}' antigravity-manager | jq
```

**你應該看到**
- `.State.Health.Status` 為 `healthy`
- 當前目錄生成 `antigravity-backup.tar.gz`

### 第 4 步：Headless Xvfb 一鍵安裝（適合想要 systemd 運維）

**為什麼**
Headless Xvfb 不是「純後端模式」，而是用虛擬顯示器把 GUI 程式跑在伺服器上；但它換來了更熟悉的運維方式：systemd、固定目錄、日誌落盤。

在伺服器上執行（專案提供的一鍵腳本）：

```bash
curl -fsSL https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/install.sh | sudo bash
```

**你應該看到**
- 目錄 `/opt/antigravity/` 存在
- `systemctl status antigravity` 顯示服務 running

::: tip 更穩的做法：先審查腳本
`curl -O .../install.sh` 下載後先看一遍，再 `sudo bash install.sh`。
:::

### 第 5 步：把本機帳號同步到伺服器（Xvfb 方案必做）

**為什麼**
Xvfb 安裝只是把程式跑起來。要讓反代真的能用，你需要把本機已有的帳號/設定同步到伺服器的資料目錄。

專案提供了 `sync.sh`，會自動在你的機器上按優先級搜尋資料目錄（如 `~/.antigravity_tools`、`~/Library/Application Support/Antigravity Tools`），然後 rsync 到伺服器：

```bash
curl -O https://raw.githubusercontent.com/lbjlaq/Antigravity-Manager/main/deploy/headless-xvfb/sync.sh
chmod +x sync.sh

./sync.sh root@your-server /opt/antigravity
```

**你應該看到**
- 終端輸出類似：`同步: <local> -> root@your-server:/opt/antigravity/.antigravity_tools/`
- 遠端服務被嘗試重啟（腳本會呼叫 `systemctl restart antigravity`）

### 第 6 步：探活與排障（兩種方案通用）

**為什麼**
部署後的第一件事不是「先接客戶端」，而是先建立一個能快速判斷健康狀況的入口。

1) 探活（反代服務提供 `/healthz`）：

```bash
curl -i http://127.0.0.1:8045/healthz
```

2) 看日誌：

```bash
## Docker
cd deploy/docker
docker compose logs -f

## Headless Xvfb
tail -f /opt/antigravity/logs/app.log
```

**你應該看到**
- `/healthz` 回傳 200（具體回應體以實際為準）
- 日誌裡能看到反代服務啟動資訊

### 第 7 步：升級策略（不要把「自動更新」當成唯一方案）

**為什麼**
升級是最容易「把系統升級到不可用」的動作。你需要知道每種方案的升級到底做了什麼。

- Docker：容器啟動時會嘗試透過 GitHub API 拉取最新 `.deb` 並安裝（如果限流或網路異常，會繼續用快取版本）。
- Headless Xvfb：用 `upgrade.sh` 拉取最新 AppImage，並在重啟失敗時回滾到備份。

Headless Xvfb 升級指令（專案 README）：

```bash
cd /opt/antigravity
sudo ./upgrade.sh
```

**你應該看到**
- 輸出類似：`升級: v<current> -> v<latest>`
- 升級後服務仍是 active（腳本會 `systemctl restart antigravity` 並檢查狀態）

## 踩坑提醒

| 場景 | 常見錯誤（❌） | 推薦做法（✓） |
|--- | --- | ---|
| 帳號/設定遺失 | ❌ 只關心「程式跑起來」 | ✓ 先確認 `.antigravity_tools/` 是持久化的（volume 或 `/opt/antigravity`） |
| noVNC 連接埠改不生效 | ❌ 只改 `NOVNC_PORT` | ✓ 保持預設 6080；要改就同時核對 `start.sh` 裡 `websockify` 連接埠 |
| 把 8045 暴露到公網 | ❌ 不設 `api_key`/不看 auth_mode | ✓ 先按 **[安全與隱私](/zh-tw/lbjlaq/Antigravity-Manager/advanced/security/)** 做基線，再考慮隧道/反代 |

## 本課小結

- Docker/noVNC 解決「伺服器沒瀏覽器/沒桌面但要授權」的問題，適合 NAS 場景
- Headless Xvfb 更像標準運維：固定目錄、systemd 管理、腳本升級/回滾
- 無論哪種方案，把閉環先做對：資料 -> 探活 -> 日誌 -> 備份 -> 升級

## 推薦繼續看

- 你要把服務暴露到區域網路/公網：**[安全與隱私：auth_mode、allow_lan_access](/zh-tw/lbjlaq/Antigravity-Manager/advanced/security/)**
- 部署後遇到 401：**[401/鑑權失敗：auth_mode、Header 相容與客戶端設定清單](/zh-tw/lbjlaq/Antigravity-Manager/faq/auth-401/)**
- 你想用隧道暴露服務：**[Cloudflared 一鍵隧道](/zh-tw/lbjlaq/Antigravity-Manager/platforms/cloudflared/)**

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| Docker 部署入口與 noVNC URL | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L5-L13) | 5-13 |
| Docker 部署環境變數說明（VNC_PASSWORD/RESOLUTION/NOVNC_PORT） | [`deploy/docker/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/README.md#L32-L39) | 32-39 |
| Docker compose 連接埠映射與資料卷（antigravity_data） | [`deploy/docker/docker-compose.yml`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/docker-compose.yml#L1-L21) | 1-21 |
| Docker 啟動腳本：自動更新版本（GitHub rate limit） | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L27-L58) | 27-58 |
| Docker 啟動腳本：啟動 Xtigervnc/Openbox/noVNC/應用 | [`deploy/docker/start.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/start.sh#L60-L78) | 60-78 |
| Docker 健康檢查：確認 Xtigervnc/websockify/antigravity_tools 程序存在 | [`deploy/docker/Dockerfile`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/docker/Dockerfile#L60-L79) | 60-79 |
| Headless Xvfb：目錄結構與運維指令（systemctl/healthz） | [`deploy/headless-xvfb/README.md`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/README.md#L19-L78) | 19-78 |
| Headless Xvfb：install.sh 安裝依賴與初始化 gui_config.json（預設 8045） | [`deploy/headless-xvfb/install.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/install.sh#L16-L67) | 16-67 |
| Headless Xvfb：sync.sh 自動發現本機資料目錄並 rsync 到伺服器 | [`deploy/headless-xvfb/sync.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/sync.sh#L8-L32) | 8-32 |
| Headless Xvfb：upgrade.sh 下載新版本並在失敗時回滾 | [`deploy/headless-xvfb/upgrade.sh`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/deploy/headless-xvfb/upgrade.sh#L11-L51) | 11-51 |
| 反代服務探活端點 `/healthz` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L120-L194) | 120-194 |

</details>
