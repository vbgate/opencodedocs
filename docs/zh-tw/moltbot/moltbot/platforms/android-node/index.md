---
title: "Android 節點：裝置本機操作設定 | Clawdbot 教學"
sidebarTitle: "讓 AI 控制你的手機"
subtitle: "Android 節點：裝置本機操作設定 | Clawdbot 教學"
description: "學習如何設定 Android 節點以執行裝置本機操作（Camera、Canvas、Screen）。本教學介紹 Android 節點的連接流程、配對機制和可用指令。"
tags:
  - "Android"
  - "節點"
  - "Camera"
  - "Canvas"
prerequisite:
  - "start-getting-started"
  - "start-gateway-startup"
order: 180
---

# Android 節點：裝置本機操作設定

## 學完你能做什麼

- 將 Android 裝置連接到 Gateway，作為節點執行裝置本機操作
- 透過 AI 助手控制 Android 裝置的相機拍照和錄影
- 使用 Canvas 視覺化介面在 Android 上顯示即時內容
- 管理螢幕錄製、位置取得和簡訊傳送功能

## 你現在的困境

你想讓 AI 助手能夠存取你的 Android 裝置——拍照、錄製影片、顯示 Canvas 介面——但不知道如何安全地將裝置連接到 Gateway。

直接安裝 Android 應用程式可能無法發現 Gateway，或者設定後無法配對成功。你需要一個清晰的連接流程。

## 什麼時候用這一招

- **需要裝置本機操作**：你想透過 AI 助手讓 Android 裝置執行本機操作（拍照、錄影、螢幕錄製）
- **跨網路存取**：Android 裝置和 Gateway 在不同網路，需要透過 Tailscale 連接
- **Canvas 視覺化**：需要在 Android 上顯示 AI 產生的即時 HTML/CSS/JS 介面

## 🎒 開始前的準備

::: warning 前置要求

在開始之前，請確保：

- ✅ **Gateway 已安裝並執行**：在 macOS、Linux 或 Windows (WSL2) 上執行 Gateway
- ✅ **Android 裝置可用**：Android 8.0+ 裝置或模擬器
- ✅ **網路連接正常**：Android 裝置可以存取 Gateway 的 WebSocket 連接埠（預設 18789）
- ✅ **CLI 可用**：在 Gateway 主機上可以使用 `clawdbot` 指令

:::

## 核心思路

**Android 節點**是一個 companion app（伴侶應用程式），它透過 WebSocket 連接到 Gateway，並暴露裝置本機操作的能力給 AI 助手使用。

### 架構概覽

```
Android 裝置（節點應用程式）
        ↓
    WebSocket 連接
        ↓
    Gateway（控制平面）
        ↓
    AI 助手 + 工具呼叫
```

**關鍵點**：
- Android **不託管** Gateway，只作為節點連接到已執行的 Gateway
- 所有指令透過 Gateway 的 `node.invoke` 方法路由到 Android 節點
- 節點需要配對（pairing）才能獲得存取權限

### 支援的功能

Android 節點支援以下裝置本機操作：

| 功能 | 指令 | 說明 |
|--- | --- | ---|
| **Canvas** | `canvas.*` | 顯示即時視覺化介面（A2UI） |
| **Camera** | `camera.*` | 拍照（JPG）和錄影（MP4） |
| **Screen** | `screen.*` | 螢幕錄製 |
| **Location** | `location.*` | 取得 GPS 位置 |
| **SMS** | `sms.*` | 傳送簡訊 |

::: tip 前台限制

所有裝置本機操作（Canvas、Camera、Screen）都需要 Android 應用程式處於**前台執行狀態**。背景呼叫會傳回 `NODE_BACKGROUND_UNAVAILABLE` 錯誤。

:::

## 跟我做

### 第 1 步：啟動 Gateway

**為什麼**
Android 節點需要連接到一個執行中的 Gateway 才能運作。Gateway 提供 WebSocket 控制平面和配對服務。

```bash
clawdbot gateway --port 18789 --verbose
```

**你應該看到**：
```
listening on ws://0.0.0.0:18789
bonjour: advertising _clawdbot-gw._tcp on local...
```

::: tip Tailscale 模式（推薦）

如果 Gateway 和 Android 裝置在不同網路但透過 Tailscale 連接，將 Gateway 綁定到 tailnet IP：

```json5
// ~/.clawdbot/clawdbot.json
{
  gateway: {
    bind: "tailnet"
  }
}
```

重新啟動 Gateway 後，Android 節點可以透過 Wide-Area Bonjour 發現。

:::

### 第 2 步：驗證發現（可選）

**為什麼**
確認 Gateway 的 Bonjour/mDNS 服務正常運作，方便 Android 應用程式發現。

在 Gateway 主機上執行：

```bash
dns-sd -B _clawdbot-gw._tcp local.
```

**你應該看到**：
```
Timestamp     A/R    IF  N/T   Target              Port
==========   ===   ===  ========               ====
12:34:56.123 Addr   10  _clawdbot-gw._tcp. 18789
```

如果看到類似輸出，表示 Gateway 正在廣告發現服務。

::: details 偵錯 Bonjour 問題

如果發現失敗，可能的原因：

- **mDNS 被封鎖**：某些 Wi-Fi 網路停用 mDNS
- **防火牆**：封鎖 UDP 連接埠 5353
- **網路隔離**：裝置在不同 VLAN 或子網路

解決方案：使用 Tailscale + Wide-Area Bonjour，或手動設定 Gateway 位址。

:::

### 第 3 步：從 Android 連接

**為什麼**
Android 應用程式透過 mDNS/NSD 發現 Gateway，建立 WebSocket 連接。

在 Android 應用程式中：

1. 開啟 **設定**（Settings）
2. 在 **Discovered Gateways** 中選擇你的 Gateway
3. 點擊 **Connect**

**如果 mDNS 被封鎖**：
- 進入 **Advanced → Manual Gateway**
- 輸入 Gateway 的 **主機名稱和連接埠**（如 `192.168.1.100:18789`）
- 點擊 **Connect (Manual)**

::: tip 自動重新連接

首次成功配對後，Android 應用程式會在啟動時自動重新連接：
- 如果啟用了手動端點，使用手動端點
- 否則，使用上次發現的 Gateway（盡力而為）

:::

**檢查點 ✅**
- Android 應用程式顯示 "Connected" 狀態
- 應用程式顯示 Gateway 的顯示名稱
- 應用程式顯示配對狀態（Pending 或 Paired）

### 第 4 步：批准配對（CLI）

**為什麼**
Gateway 需要你批准節點的配對請求，才能授予存取權限。

在 Gateway 主機上：

```bash
# 查看待處理的配對請求
clawdbot nodes pending

# 批准配對
clawdbot nodes approve <requestId>
```

::: details 配對流程

Gateway-owned pairing 工作流程：

1. Android 節點連接 Gateway，請求配對
2. Gateway 儲存 **pending request** 並發出 `node.pair.requested` 事件
3. 你透過 CLI 批准或拒絕請求
4. 批准後，Gateway 頒發新的 **auth token**
5. Android 節點使用 token 重新連接，變為 "paired" 狀態

Pending 請求在 **5 分鐘**後自動過期。

:::

**你應該看到**：
```
✓ Node approved: android-node-abc123
Token issued: eyJhbGc...
```

Android 應用程式會自動重新連接並顯示 "Paired" 狀態。

### 第 5 步：驗證節點已連接

**為什麼**
確認 Android 節點成功配對並連接到 Gateway。

透過 CLI 驗證：

```bash
clawdbot nodes status
```

**你應該看到**：
```
Known: 1 · Paired: 1 · Connected: 1

┌──────────────────────────────────────────────┐
│ Name: My Samsung Tab                     │
│ Device: Android                          │
│ Model: Samsung SM-X926B                 │
│ IP: 192.168.0.99                      │
│ Status: paired, connected                 │
│ Caps: camera, canvas, screen, location, sms │
└──────────────────────────────────────────────┘
```

或者透過 Gateway API：

```bash
clawdbot gateway call node.list --params '{}'
```

### 第 6 步：測試 Camera 功能

**為什麼**
驗證 Android 節點的 Camera 指令正常運作，權限已授予。

透過 CLI 測試拍照：

```bash
# 拍照（預設前置相機）
clawdbot nodes camera snap --node "android-node"

# 指定後置相機
clawdbot nodes camera snap --node "android-node" --facing back

# 錄製影片（3 秒）
clawdbot nodes camera clip --node "android-node" --duration 3000
```

**你應該看到**：
```
MEDIA: /tmp/clawdbot-camera-snap-123456.jpg
```

::: tip Camera 權限

Android 節點需要以下執行時權限：

- **CAMERA**：用於 `camera.snap` 和 `camera.clip`
- **RECORD_AUDIO**：用於 `camera.clip`（當 `includeAudio=true`）

首次呼叫 Camera 指令時，應用程式會提示授予權限。如果拒絕，指令會傳回 `CAMERA_PERMISSION_REQUIRED` 或 `AUDIO_PERMISSION_REQUIRED` 錯誤。

:::

### 第 7 步：測試 Canvas 功能

**為什麼**
驗證 Canvas 視覺化介面可以在 Android 裝置上顯示。

::: info Canvas Host

Canvas 需要一個 HTTP 伺服器來提供 HTML/CSS/JS 內容。Gateway 預設在連接埠 18793 上執行 Canvas Host。

:::

在 Gateway 主機上建立 Canvas 檔案：

```bash
mkdir -p ~/clawd/canvas
echo '<h1>Hello from AI!</h1>' > ~/clawd/canvas/index.html
```

在 Android 應用程式中導覽到 Canvas：

```bash
clawdbot nodes invoke --node "android-node" \
  --command canvas.navigate \
  --params '{"url":"http://<gateway-hostname>.local:18793/__clawdbot__/canvas/"}'
```

**你應該看到**：
Android 應用程式中顯示 "Hello from AI!" 頁面。

::: tip Tailscale 環境

如果 Android 裝置和 Gateway 都在 Tailscale 網路中，使用 MagicDNS 名稱或 tailnet IP 取代 `.local`：

```json
{"url":"http://<gateway-magicdns>:18793/__clawdbot__/canvas/"}
```

:::

### 第 8 步：測試 Screen 和 Location 功能

**為什麼**
驗證螢幕錄製和位置取得功能正常。

螢幕錄製：

```bash
# 錄製 10 秒螢幕
clawdbot nodes screen record --node "android-node" --duration 10s --fps 15
```

**你應該看到**：
```
MEDIA: /tmp/clawdbot-screen-record-123456.mp4
```

位置取得：

```bash
clawdbot nodes invoke --node "android-node" --command location.get
```

**你應該看到**：
```json
{
  "latitude": 37.7749,
  "longitude": -122.4194,
  "accuracy": 10,
  "timestamp": 1706345678000
}
```

::: warning 權限要求

螢幕錄製需要 Android **RECORD_AUDIO** 權限（如果啟用音訊）和前台存取。位置取得需要 **LOCATION** 權限。

首次呼叫時，應用程式會提示授予權限。

:::

## 踩坑提醒

### 問題 1：無法發現 Gateway

**症狀**：Android 應用程式中看不到 Gateway

**可能原因**：
- Gateway 未啟動或綁定到 loopback
- mDNS 在網路中被封鎖
- 防火牆封鎖 UDP 5353 連接埠

**解決方案**：
1. 檢查 Gateway 是否執行：`clawdbot nodes status`
2. 使用手動 Gateway 位址：在 Android 應用程式中輸入 Gateway IP 和連接埠
3. 設定 Tailscale + Wide-Area Bonjour（推薦）

### 問題 2：配對後連接失敗

**症狀**：顯示 "Paired" 但無法連接

**可能原因**：
- Token 過期（每次配對後 token 會旋轉）
- Gateway 重新啟動但節點未重新連接
- 網路變化

**解決方案**：
1. 在 Android 應用程式中手動點擊 "Reconnect"
2. 檢查 Gateway 日誌：`bonjour: client disconnected ...`
3. 重新配對：刪除節點並重新批准

### 問題 3：Camera 指令傳回權限錯誤

**症狀**：`camera.snap` 傳回 `CAMERA_PERMISSION_REQUIRED`

**可能原因**：
- 使用者拒絕了權限
- 權限被系統原則停用

**解決方案**：
1. 在 Android 設定中尋找 "Clawdbot" 應用程式
2. 進入 "Permissions"
3. 授予 Camera 和 Microphone 權限
4. 重試 Camera 指令

### 問題 4：背景呼叫失敗

**症狀**：背景呼叫傳回 `NODE_BACKGROUND_UNAVAILABLE`

**原因**：Android 節點僅允許前台呼叫裝置本機指令

**解決方案**：
1. 確保應用程式在前台執行（開啟應用程式）
2. 檢查應用程式是否被系統最佳化（電池最佳化）
3. 關閉 "省電模式" 對應用程式的限制

## 本課小結

本課介紹了如何設定 Android 節點以執行裝置本機操作：

- **連接流程**：透過 mDNS/NSD 或手動設定連接 Android 節點到 Gateway
- **配對機制**：使用 Gateway-owned pairing 批准節點存取權限
- **可用功能**：Camera、Canvas、Screen、Location、SMS
- **CLI 工具**：使用 `clawdbot nodes` 指令管理節點和呼叫功能
- **權限要求**：Android 應用程式需要 Camera、Audio、Location 等執行時權限

**關鍵點**：
- Android 節點是 companion app，不託管 Gateway
- 所有裝置本機操作需要應用程式在前台執行
- 配對請求在 5 分鐘後自動過期
- 支援 Tailscale 網路的 Wide-Area Bonjour 發現

## 下一課預告

> 下一課我們學習 **[Canvas 視覺化介面與 A2UI](../../advanced/canvas/)**。
>
> 你會學到：
> - Canvas A2UI 推送機制
> - 如何在 Canvas 上顯示即時內容
> - Canvas 指令完整列表

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-27

| 功能        | 檔案路徑                                                                                    | 行號    |
|--- | --- | ---|
| 節點指令策略 | [`src/gateway/node-command-policy.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/node-command-policy.ts) | 1-112   |
| 節點通訊協定 Schema | [`src/gateway/protocol/schema/nodes.ts`](https://github.com/moltbot/moltbot/blob/main/src/gateway/protocol/schema/nodes.ts) | 1-103   |
| Android 文件  | [`docs/platforms/android.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/android.md) | 1-142   |
| 節點 CLI  | [`docs/cli/nodes.md`](https://github.com/moltbot/moltbot/blob/main/docs/cli/nodes.md) | 1-69    |

**關鍵常數**：
- `PLATFORM_DEFAULTS`：定義各平台支援的指令列表（`node-command-policy.ts:32-58`）
- Android 支援的指令：Canvas、Camera、Screen、Location、SMS（`node-command-policy.ts:34-40`）

**關鍵函數**：
- `resolveNodeCommandAllowlist()`：根據平台解析允許的指令列表（`node-command-policy.ts:77-91`）
- `normalizePlatformId()`：規範化平台 ID（`node-command-policy.ts:60-75`）

**Android 節點特點**：
- 客戶端 ID：`clawdbot-android`（`gateway/protocol/client-info.ts:9`）
- 裝置系列偵測：透過 `deviceFamily` 欄位識別 Android（`node-command-policy.ts:70`）
- 預設啟用 Canvas 和 Camera 功能（`docs/platforms/android.md`）

</details>
