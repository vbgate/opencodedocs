---
title: "啟動 Gateway：守護程式與執行模式 | Clawdbot 教程"
sidebarTitle: "Gateway 隨時上線"
subtitle: "啟動 Gateway：守護程式與執行模式"
description: "學習如何啟動 Clawdbot Gateway 守護程式，了解開發模式和生產模式的區別，掌握常用的啟動命令和參數設定。"
tags:
  - "gateway"
  - "daemon"
  - "startup"
prerequisite:
  - "start-onboarding-wizard"
order: 30
---

# 啟動 Gateway：守護程式與執行模式

## 學完你能做什麼

- 使用命令列啟動 Gateway 前台程序
- 設定 Gateway 為後台守護程式（macOS LaunchAgent / Linux systemd / Windows Scheduled Task）
- 理解不同綁定模式（loopback / LAN / Tailnet）和驗證方式
- 在開發模式和生產模式之間切換
- 使用 `--force` 強制釋放被占用的連接埠

## 你現在的困境

你已經完成了精靈設定，Gateway 的基礎設定已經就緒。但是：

- 每次想用 Gateway 都得手動在終端機執行命令？
- 關閉終端機視窗後 Gateway 就停止了，AI 助手也跟著「下線」？
- 想在區域網路或 Tailscale 網路中存取 Gateway，不知道怎麼設定？
- Gateway 啟動失敗，但不知道是設定問題還是連接埠被占用？

## 什麼時候用這一招

**推薦啟動方式**：

| 場景                  | 使用命令                               | 說明                                   |
|--- | --- | ---|
| 日常使用                | `clawdbot gateway install` + `clawdbot gateway start` | 作為後台服務自動啟動                  |
| 開發除錯                | `clawdbot gateway --dev`                     | 建立開發設定，自動重載                  |
| 臨時測試                | `clawdbot gateway`                           | 前台執行，記錄檔直接輸出到終端機            |
| 連接埠衝突                | `clawdbot gateway --force`                   | 強制釋放連接埠後啟動                    |
| 區域網路存取              | `clawdbot gateway --bind lan`                 | 允許區域網路裝置連接                   |
| Tailscale 遠端存取         | `clawdbot gateway --tailscale serve`          | 透過 Tailscale 網路暴露 Gateway          |

## 🎒 開始前的準備

::: warning 前置檢查

在啟動 Gateway 前，請確保：

1. ✅ 已完成精靈設定（`clawdbot onboard`）或手動設定了 `gateway.mode=local`
2. ✅ AI 模型已設定（Anthropic / OpenAI / OpenRouter 等）
3. ✅ 如需存取外部網路（LAN / Tailnet），已設定驗證方式
4. ✅ 了解你的使用場景（本地開發 vs 生產執行）

:::

## 核心思路

**Gateway 是什麼？**

Gateway 是 Clawdbot 的 WebSocket 控制平面，它負責：

- **工作階段管理**：維護所有 AI 對話工作階段狀態
- **頻道連接**：連接 WhatsApp、Telegram、Slack 等 12+ 種訊息頻道
- **工具呼叫**：協調瀏覽器自動化、檔案操作、定時任務等工具執行
- **節點管理**：管理 macOS / iOS / Android 裝置節點
- **事件分發**：推播 AI 思考進度、工具呼叫結果等即時事件

**為什麼需要守護程式？**

作為後台服務執行的 Gateway 有這些優勢：

- **持續上線**：即使關閉終端機，AI 助手依然可用
- **自動啟動**：系統重新啟動後自動恢復服務（macOS LaunchAgent / Linux systemd）
- **統一管理**：透過 `start` / `stop` / `restart` 命令控制生命週期
- **記錄檔集中**：系統級記錄檔收集，便於排查問題

## 跟我做

### 第 1 步：啟動 Gateway（前台模式）

**為什麼**

前台模式適合開發測試，記錄檔直接輸出到終端機，方便即時查看 Gateway 狀態。

```bash
# 使用預設設定啟動（監聽 127.0.0.1:18789）
clawdbot gateway

# 指定連接埠啟動
clawdbot gateway --port 19001

# 開啟詳細記錄
clawdbot gateway --verbose
```

**你應該看到**：

```bash
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
✓ log file: /Users/you/.clawdbot/logs/gateway.log
```

::: tip 檢查點

- 看到 `listening on ws://...` 表示啟動成功
- 記下顯示的 PID（程序 ID），用於後續除錯
- 連接埠預設是 18789，可透過 `--port` 修改

:::

### 第 2 步：設定綁定模式

**為什麼**

預設情況下 Gateway 只監聽本地回環位址（`127.0.0.1`），這表示只有本機可以連接。如果你想在區域網路或 Tailscale 網路中存取，需要調整綁定模式。

```bash
# 僅本地回環（預設，最安全）
clawdbot gateway --bind loopback

# 區域網路存取（需要驗證）
clawdbot gateway --bind lan --token "your-token"

# Tailscale 網路存取
clawdbot gateway --bind tailnet --token "your-token"

# 自動偵測（本地 + LAN）
clawdbot gateway --bind auto
```

**你應該看到**：

```bash
# loopback 模式
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# lan 模式
✓ listening on ws://192.168.1.100:18789 (PID 12345)
✓ listening on ws://10.0.0.5:18789
```

::: warning 安全提示

⚠️ **綁定到非 loopback 位址必須設定驗證！**

- `--bind lan` / `--bind tailnet` 時必須傳遞 `--token` 或 `--password`
- 否則 Gateway 會拒絕啟動，報錯：`Refusing to bind gateway to lan without auth`
- 驗證權杖透過 `gateway.auth.token` 設定或 `--token` 參數傳入

:::

### 第 3 步：安裝為守護程式（macOS / Linux / Windows）

**為什麼**

守護程式讓 Gateway 在後台執行，即使關閉終端機視窗也不受影響。系統重新啟動後自動啟動，保持 AI 助手始終上線。

```bash
# 安裝為系統服務（macOS LaunchAgent / Linux systemd / Windows Scheduled Task）
clawdbot gateway install

# 啟動服務
clawdbot gateway start

# 查看服務狀態
clawdbot gateway status

# 重新啟動服務
clawdbot gateway restart

# 停止服務
clawdbot gateway stop
```

**你應該看到**：

```bash
# macOS
✓ LaunchAgent loaded
✓ service runtime: active

# Linux
✓ systemd service enabled
✓ service runtime: active

# Windows
✓ Scheduled Task registered
✓ service runtime: running
```

::: tip 檢查點

- 執行 `clawdbot gateway status` 確認服務狀態為 `active` / `running`
- 如果服務顯示 `loaded` 但 `runtime: inactive`，執行 `clawdbot gateway start`
- 守護程式記錄檔寫入 `~/.clawdbot/logs/gateway.log`

:::

### 第 4 步：處理連接埠衝突（--force）

**為什麼**

預設連接埠 18789 可能被其他程序占用（如之前的 Gateway 實例）。使用 `--force` 可以自動釋放連接埠。

```bash
# 強制釋放連接埠並啟動 Gateway
clawdbot gateway --force
```

**你應該看到**：

```bash
✓ force: killed pid 9876 (node) on port 18789
✓ force: waited 1200ms for port 18789 to free
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: info 工作原理

`--force` 按順序執行以下操作：

1. 嘗試 SIGTERM 優雅終止程序（等待 700ms）
2. 如果未終止，使用 SIGKILL 強制終止
3. 等待連接埠釋放（最多 2 秒）
4. 啟動新的 Gateway 程序

:::

### 第 5 步：開發模式（--dev）

**為什麼**

開發模式使用獨立的設定檔和目錄，避免污染生產環境。支援 TypeScript 熱重載，修改程式碼後自動重新啟動 Gateway。

```bash
# 啟動開發模式（建立 dev profile + workspace）
clawdbot gateway --dev

# 重置開發設定（清除憑證 + 工作階段 + 工作區）
clawdbot gateway --dev --reset
```

**你應該看到**：

```bash
✓ dev config created at ~/.clawdbot-dev/clawdbot.json
✓ dev workspace initialized at ~/clawd-dev
✓ agent model: anthropic/claude-opus-4-5
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip 開發模式特點

- 設定檔：`~/.clawdbot-dev/clawdbot.json`（獨立於生產設定）
- 工作區目錄：`~/clawd-dev`
- 跳過 `BOOT.md` 腳本執行
- 預設綁定 loopback，無需驗證

:::

### 第 6 步：Tailscale 整合

**為什麼**

Tailscale 讓你透過安全私網存取遠端 Gateway，無需公網 IP 或連接埠轉送。

```bash
# Tailscale Serve 模式（推薦）
clawdbot gateway --tailscale serve

# Tailscale Funnel 模式（需要額外驗證）
clawdbot gateway --tailscale funnel --auth password
```

**你應該看到**：

```bash
# serve 模式
✓ Tailscale identity detected
✓ advertising gateway via Tailscale Serve
✓ MagicDNS: https://your-tailnet.ts.net
✓ listening on ws://127.0.0.1:18789 (PID 12345)

# funnel 模式
✓ Tailscale Funnel enabled
✓ Funnel URL: https://your-tailnet.ts.net:18789
✓ listening on ws://127.0.0.1:18789 (PID 12345)
```

::: tip 設定驗證

Tailscale 整合支援兩種驗證方式：

1. **Identity Headers**（推薦）：設定 `gateway.auth.allowTailscale=true`，Tailscale 身份自動滿足驗證
2. **Token / Password**：傳統驗證方式，需要手動傳遞 `--token` 或 `--password`

:::

### 第 7 步：驗證 Gateway 狀態

**為什麼**

確認 Gateway 正常執行且 RPC 協定可存取。

```bash
# 查看完整狀態（服務 + RPC 偵測）
clawdbot gateway status

# 跳過 RPC 偵測（僅服務狀態）
clawdbot gateway status --no-probe

# 健康檢查
clawdbot gateway health

# 偵測所有可達的 Gateway
clawdbot gateway probe
```

**你應該看到**：

```bash
# status 命令輸出
Gateway service status
┌──────────────────────────────────────┐
│ Service: LaunchAgent (loaded)      │
│ Runtime: running (PID 12345)       │
│ Port: 18789                       │
│ Last gateway error: none            │
└──────────────────────────────────────┘

RPC probe
┌──────────────────────────────────────┐
│ Target: ws://127.0.0.1:18789 │
│ Status: ✓ connected                │
│ Latency: 12ms                    │
└──────────────────────────────────────┘

# health 命令輸出
✓ Gateway is healthy
✓ WebSocket connection: OK
✓ RPC methods: available
```

::: tip 故障排除

如果 `status` 顯示 `Runtime: running` 但 `RPC probe: failed`：

1. 檢查連接埠是否正確：`clawdbot gateway status`
2. 檢查驗證設定：是否綁定到 LAN / Tailnet 但未提供驗證？
3. 查看記錄檔：`cat ~/.clawdbot/logs/gateway.log`
4. 執行 `clawdbot doctor` 取得詳細診斷

:::

## 踩坑提醒

### ❌ 錯誤：Gateway 拒絕啟動

**錯誤訊息**：
```
Gateway start blocked: set gateway.mode=local (current: unset) or pass --allow-unconfigured.
```

**原因**：`gateway.mode` 未設定為 `local`

**解決方法**：

```bash
# 方法 1：執行精靈設定
clawdbot onboard

# 方法 2：手動修改設定檔
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "mode": "local"
  }
}

# 方法 3：暫時跳過檢查（不推薦）
clawdbot gateway --allow-unconfigured
```

### ❌ 錯誤：綁定到 LAN 但無驗證

**錯誤訊息**：
```
Refusing to bind gateway to lan without auth.
Set gateway.auth.token/password (or CLAWDBOT_GATEWAY_TOKEN/CLAWDBOT_GATEWAY_PASSWORD) or pass --token/--password.
```

**原因**：非 loopback 綁定必須設定驗證（安全限制）

**解決方法**：

```bash
# 透過設定檔設定驗證
# ~/.clawdbot/clawdbot.json
{
  "gateway": {
    "auth": {
      "mode": "token",
      "token": "your-secure-token"
    }
  }
}

# 或透過命令列傳遞
clawdbot gateway --bind lan --token "your-secure-token"
```

### ❌ 錯誤：連接埠已被占用

**錯誤訊息**：
```
Error: listen EADDRINUSE: address already in use :::18789
```

**原因**：另一個 Gateway 實例或其他程序占用了連接埠

**解決方法**：

```bash
# 方法 1：強制釋放連接埠
clawdbot gateway --force

# 方法 2：使用不同連接埠
clawdbot gateway --port 19001

# 方法 3：手動查找並終止程序
lsof -ti:18789 | xargs kill -9  # macOS / Linux
netstat -ano | findstr :18789               # Windows
```

### ❌ 錯誤：dev 模式 reset 需要 --dev

**錯誤訊息**：
```
Use --reset with --dev.
```

**原因**：`--reset` 只能在開發模式使用，避免誤刪生產資料

**解決方法**：

```bash
# 正確的重置開發環境命令
clawdbot gateway --dev --reset
```

### ❌ 錯誤：服務已安裝但仍使用前台模式

**現象**：執行 `clawdbot gateway` 時提示"Gateway already running locally"

**原因**：守護程式已經在後台執行

**解決方法**：

```bash
# 停止後台服務
clawdbot gateway stop

# 或重新啟動服務
clawdbot gateway restart

# 然後再啟動前台（如需除錯）
clawdbot gateway --port 19001  # 使用不同連接埠
```

## 本課小結

本課學習了：

✅ **啟動方式**：前台模式 vs 守護程式
✅ **綁定模式**：loopback / LAN / Tailnet / Auto
✅ **驗證方式**：Token / Password / Tailscale Identity
✅ **開發模式**：獨立設定、熱重載、--reset 重置
✅ **故障排除**：`status` / `health` / `probe` 命令
✅ **服務管理**：`install` / `start` / `stop` / `restart` / `uninstall`

**關鍵命令速查**：

| 場景                   | 命令                                        |
|--- | ---|
| 日常使用（服務）       | `clawdbot gateway install && clawdbot gateway start` |
| 開發除錯              | `clawdbot gateway --dev`                     |
| 臨時測試              | `clawdbot gateway`                           |
| 強制釋放連接埠          | `clawdbot gateway --force`                   |
| 區域網路存取           | `clawdbot gateway --bind lan --token "xxx"`   |
| Tailscale 遠端       | `clawdbot gateway --tailscale serve`          |
| 查看狀態              | `clawdbot gateway status`                     |
| 健康檢查              | `clawdbot gateway health`                     |

## 下一課預告

> 下一課我們學習 **[發送第一則訊息](../first-message/)**。
>
> 你會學到：
> - 透過 WebChat 發送第一則訊息
> - 透過已設定頻道（WhatsApp/Telegram 等）與 AI 助手對話
> - 理解訊息路由和回應流程

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能                        | 檔案路徑                                                                                   | 行號     |
|--- | --- | ---|
| Gateway 啟動入口            | [`src/cli/gateway-cli/run.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/run.ts) | 55-310   |
| 守護程式服務抽象         | [`src/daemon/service.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/service.ts) | 66-155    |
| 啟動側邊欄服務           | [`src/gateway/server-startup.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup.ts) | 26-160    |
| Gateway 伺服器實作         | [`src/gateway/server.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server.ts) | 1-500     |
| 程式參數解析             | [`src/daemon/program-args.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/daemon/program-args.ts) | 1-250     |
| 啟動記錄檔輸出              | [`src/gateway/server-startup-log.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/gateway/server-startup-log.ts) | 7-40      |
| 開發模式設定             | [`src/cli/gateway-cli/dev.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/gateway-cli/dev.ts) | 1-100     |
| 連接埠釋放邏輯             | [`src/cli/ports.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/cli/ports.ts) | 1-80      |

**關鍵常數**：
- 預設連接埠：`18789`（來源：`src/gateway/server.ts`）
- 預設綁定：`loopback`（來源：`src/cli/gateway-cli/run.ts:175`）
- 開發模式設定路徑：`~/.clawdbot-dev/`（來源：`src/cli/gateway-cli/dev.ts`）

**關鍵函式**：
- `runGatewayCommand()`：Gateway CLI 主入口，處理命令列參數和啟動邏輯
- `startGatewayServer()`：啟動 WebSocket 伺服器，監聽指定連接埠
- `forceFreePortAndWait()`：強制釋放連接埠並等待
- `resolveGatewayService()`：根據平台回傳對應的守護程式實作（macOS LaunchAgent / Linux systemd / Windows Scheduled Task）
- `logGatewayStartup()`：輸出 Gateway 啟動資訊（模型、監聽位址、記錄檔）

</details>
