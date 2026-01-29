---
title: "Cloudflared: 公網暴露本地 API | Antigravity-Manager"
sidebarTitle: "讓遠端裝置存取本地 API"
subtitle: "Cloudflared 一鍵隧道：把本地 API 安全暴露到公網（並非預設安全）"
description: "學習 Antigravity Tools 的 Cloudflared 一鍵隧道：跑通 Quick/Auth 兩種啟動方式，弄清 URL 何時會顯示、如何複製與測試，並用 proxy.auth_mode + 強 API Key 做最小暴露。附帶安裝位置、常見報錯與排查思路，讓遠端裝置也能穩定呼叫本地閘道。"
tags:
  - "Cloudflared"
  - "內網穿透"
  - "公網存取"
  - "Tunnel"
  - "Antigravity Tools"
prerequisite:
  - "start-proxy-and-first-client"
  - "start-add-account"
order: 7
---
# Cloudflared 一鍵隧道：把本地 API 安全暴露到公網（並非預設安全）

你會用 **Cloudflared 一鍵隧道**把本地的 Antigravity Tools API 閘道暴露到公網（只在你明確開啟時），讓遠端裝置也能呼叫，同時弄清 Quick 和 Auth 兩種模式的行為差異和風險邊界。

## 學完你能做什麼

- 一鍵安裝和啟動 Cloudflared 隧道
- 選擇 Quick 模式（臨時 URL）或 Auth 模式（命名隧道）
- 複製公網 URL 讓遠端裝置存取本地 API
- 理解隧道安全風險並採取最小暴露策略

## 你現在的困境

你在本地跑好了 Antigravity Tools 的 API 閘道，但只有本機或區域網路能存取。想讓遠端伺服器、行動裝置或雲端服務也能呼叫這個閘道，卻沒有公網 IP，也不想折騰複雜的伺服器部署方案。

## 什麼時候用這一招

- 你沒有公網 IP，但需要遠端裝置存取本地 API
- 你在測試/開發階段，想快速暴露服務給外部
- 你不想購買伺服器部署，只想用現有機器

::: warning 安全警告
公網暴露有風險！請務必：
1. 配置強 API Key（`proxy.auth_mode=strict/all_except_health`）
2. 僅在必要時開啟隧道，用完即關
3. 定期檢查 Monitor 日誌，發現異常立即停止
:::

## 🎒 開始前的準備

::: warning 前置條件
- 你已經啟動了本地反代服務（"API Proxy" 頁面的開關已開啟）
- 你已經新增了至少一個可用帳號
:::

## 什麼是 Cloudflared？

**Cloudflared**是 Cloudflare 提供的隧道用戶端，它會在你的機器和 Cloudflare 之間建立一條加密通道，把本地的 HTTP 服務對映成一個可從公網存取的 URL。Antigravity Tools 把安裝、啟動、停止和 URL 複製做成了 UI 操作，方便你快速跑通驗證閉環。

### 支援的平台

專案內建的「自動下載 + 安裝」邏輯只覆蓋下面這些 OS/架構組合（其他平台會報 `Unsupported platform`）。

| 作業系統 | 架構 | 支援狀態 |
|--- | --- | ---|
| macOS | Apple Silicon (arm64) | ✅ |
| macOS | Intel (x86_64) | ✅ |
| Linux | x86_64 | ✅ |
| Linux | ARM64 | ✅ |
| Windows | x86_64 | ✅ |

### 兩種模式對比

| 特性 | Quick 模式 | Auth 模式 |
|--- | --- | ---|
| **URL 類型** | `https://xxx.trycloudflare.com`（從日誌裡提取的臨時 URL） | 應用不一定能自動提取 URL（取決於 cloudflared 日誌）；入口網域以你在 Cloudflare 側配置為準 |
| **需要 Token** | ❌ 不需要 | ✅ 需要（從 Cloudflare 控制台取得） |
| **穩定性** | URL 可能隨程序重啟變化 | 取決於你在 Cloudflare 側怎麼配置（應用僅負責啟動程序） |
| **適合場景** | 臨時測試、快速驗證 | 長期穩定服務、生產環境 |
| **推薦度** | ⭐⭐⭐ 測試用 | ⭐⭐⭐⭐⭐ 生產用 |

::: info Quick 模式 URL 的特性
Quick 模式的 URL 每次啟動都可能變化，且是隨機生成的 `*.trycloudflare.com` 子網域。如果你需要固定 URL，必須使用 Auth 模式並在 Cloudflare 控制台綁定網域。
:::

## 跟我做

### 第 1 步：開啟 API Proxy 頁面

**為什麼**
找到 Cloudflared 配置入口。

1. 開啟 Antigravity Tools
2. 點擊左側導覽的 **"API Proxy"**（API 反代）
3. 找到 **"Public Access (Cloudflared)"** 卡片（頁面下方，橙色圖示）

**你應該看到**：一個可展開的卡片，顯示「Cloudflared not installed」（未安裝）或「Installed: xxx」（已安裝）。

### 第 2 步：安裝 Cloudflared

**為什麼**
下載並安裝 Cloudflared 二進位檔案到資料目錄的 `bin` 資料夾。

#### 如果未安裝

1. 點擊 **"Install"**（安裝）按鈕
2. 等待下載完成（根據網路速度，約 10-30 秒）

**你應該看到**：
- 按鈕顯示載入動畫
- 完成後提示「Cloudflared installed successfully」
- 卡片顯示「Installed: cloudflared version 202X.X.X」

#### 如果已安裝

跳過此步，直接進入第 3 步。

::: tip 安裝位置
Cloudflared 二進位檔案會安裝到「資料目錄」的 `bin/` 下（資料目錄名是 `.antigravity_tools`）。

::: code-group

```bash [macOS/Linux]
ls -la "$HOME/.antigravity_tools/bin/"
```

```powershell [Windows]
Get-ChildItem "$HOME\.antigravity_tools\bin\"
```

:::

如果你還不確定資料目錄在哪，先看一遍 **[首次啟動必懂：資料目錄、日誌、託盤與自動啟動](../../start/first-run-data/)**。
:::

### 第 3 步：選擇隧道模式

**為什麼**
根據你的使用場景選擇合適的模式。

1. 在卡片中找到模式選擇區域（兩個大按鈕）
2. 點擊選擇：

| 模式 | 描述 | 何時選擇 |
|--- | --- | ---|
| **Quick Tunnel** | 自動生成臨時 URL（`*.trycloudflare.com`） | 快速測試、臨時存取 |
| **Named Tunnel** | 使用 Cloudflare 帳號和自訂網域 | 生產環境、固定網域需求 |

::: tip 推薦選擇
如果你第一次使用，**先選 Quick 模式**，快速驗證功能是否滿足需求。
:::

### 第 4 步：配置參數

**為什麼**
根據模式填寫必要參數和選項。

#### Quick 模式

1. 連接埠會自動使用你目前的 Proxy 連接埠（預設是 `8045`，以實際配置為準）
2. 勾選 **"Use HTTP/2"**（預設勾選）

#### Auth 模式

1. 填入 **Tunnel Token**（從 Cloudflare 控制台取得）
2. 連接埠同樣使用目前的 Proxy 連接埠（以實際配置為準）
3. 勾選 **"Use HTTP/2"**（預設勾選）

::: info 如何取得 Tunnel Token？
1. 登入 [Cloudflare Zero Trust 控制台](https://dash.cloudflare.com/sign-up-to-cloudflare-zero-trust)
2. 進入 **"Networks"** → **"Tunnels"**
3. 點擊 **"Create a tunnel"** → **"Remote browser"** 或 **"Cloudflared"**
4. 複製生成的 Token（類似 `eyJhIjoiNj...` 長字串）
:::

#### HTTP/2 選項說明

`Use HTTP/2` 會讓 cloudflared 以 `--protocol http2` 啟動。專案內的文案把它描述為「更相容（推薦中國大陸使用者）」，並且預設開啟。

::: tip 推薦勾選
**HTTP/2 選項推薦預設勾選**，尤其是在國內網路環境下。
:::

### 第 5 步：啟動隧道

**為什麼**
建立本地到 Cloudflare 的加密隧道。

1. 點擊卡片右上角的開關（或展開後的 **"Start Tunnel"** 按鈕）
2. 等待隧道啟動（約 5-10 秒）

**你應該看到**：
- 卡片標題右側顯示綠色圓點
- 提示 **"Tunnel Running"**
- 顯示公網 URL（類似 `https://random-name.trycloudflare.com`）
- 右側有複製按鈕：按鈕上只展示 URL 的前 20 個字元，但點擊會複製完整 URL

::: warning Auth 模式可能看不到 URL
目前應用只會從 cloudflared 的日誌裡提取 `*.trycloudflare.com` 這類 URL 來展示。Auth 模式通常不會輸出這類網域，所以你可能只能看到「Running」，但看不到 URL。此時入口網域以你在 Cloudflare 側配置為準。
:::

### 第 6 步：測試公網存取

**為什麼**
驗證隧道是否正常運作。

#### 健康檢查

::: code-group

```bash [macOS/Linux]
#替換為你的實際隧道 URL
curl -s "https://your-url.trycloudflare.com/healthz"
```

```powershell [Windows]
Invoke-RestMethod "https://your-url.trycloudflare.com/healthz"
```

:::

**你應該看到**：`{"status":"ok"}`

#### 模型列表查詢

::: code-group

```bash [macOS/Linux]
#如果你啟用了鑑權，把 <proxy_api_key> 換成你的 key
curl -s \
  -H "Authorization: Bearer <proxy_api_key>" \
  "https://your-url.trycloudflare.com/v1/models"
```

```powershell [Windows]
Invoke-RestMethod \
  -Headers @{ Authorization = "Bearer <proxy_api_key>" } \
  "https://your-url.trycloudflare.com/v1/models"
```

:::

**你應該看到**：返回模型列表 JSON。

::: tip 注意 HTTPS
隧道 URL 是 HTTPS 協議，無需額外憑證配置。
:::

#### 使用 OpenAI SDK 呼叫（範例）

```python
import openai

#使用公網 URL
client = openai.OpenAI(
    api_key="your-proxy-api-key",  # 如果開啟了鑑權
    base_url="https://your-url.trycloudflare.com/v1"
)

#modelId 以 /v1/models 的實際返回為準

response = client.chat.completions.create(
    model="<modelId>",
    messages=[{"role": "user", "content": "你好"}]
)

print(response.choices[0].message.content)
```

::: warning 鑑權提醒
如果你在 "API Proxy" 頁面開啟了鑑權（`proxy.auth_mode=strict/all_except_health`），請求必須攜帶 API Key：
- Header: `Authorization: Bearer your-api-key`
- 或: `x-api-key: your-api-key`
:::

### 第 7 步：停止隧道

**為什麼**
用完即關，減少安全暴露時間。

1. 點擊卡片右上角的開關（或展開後的 **"Stop Tunnel"** 按鈕）
2. 等待停止完成（約 2 秒）

**你應該看到**：
- 綠色圓點消失
- 提示 **"Tunnel Stopped"**
- 公網 URL 消失

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [ ] 安裝 Cloudflared 二進位檔案
- [ ] 在 Quick 和 Auth 模式間切換
- [ ] 啟動隧道並取得公網 URL
- [ ] 透過公網 URL 呼叫本地 API
- [ ] 停止隧道

## 踩坑提醒

### 問題 1：安裝失敗（下載逾時）

**症狀**：點擊 "Install" 後長時間無回應或提示下載失敗。

**原因**：網路問題（尤其是國內存取 GitHub Releases）。

**解決**：
1. 檢查網路連線
2. 使用 VPN 或代理
3. 手動下載：[Cloudflared Releases](https://github.com/cloudflare/cloudflared/releases)，選擇對應平台版本，手動放到資料目錄的 `bin` 資料夾，並賦予執行權限（macOS/Linux）。

### 問題 2：啟動隧道失敗

**症狀**：點擊啟動後，URL 沒有顯示或提示錯誤。

**原因**：
- Auth 模式下 Token 無效
- 本地反代服務未啟動
- 連接埠被佔用

**解決**：
1. Auth 模式：檢查 Token 是否正確，是否已過期
2. 檢查 "API Proxy" 頁面的反代開關是否開啟
3. 檢查連接埠 `8045` 是否被其他程式佔用

### 問題 3：公網 URL 無法存取

**症狀**：curl 或 SDK 呼叫公網 URL 逾時。

**原因**：
- 隧道程序意外退出
- Cloudflare 網路問題
- 本地防火牆攔截

**解決**：
1. 檢查卡片是否顯示 "Tunnel Running"
2. 查看卡片是否有錯誤提示（紅色文字）
3. 檢查本地防火牆設定
4. 嘗試重新啟動隧道

### 問題 4：鑑權失敗（401）

**症狀**：請求返回 401 錯誤。

**原因**：代理開啟了鑑權，但請求未攜帶 API Key。

**解決**：
1. 檢查 "API Proxy" 頁面的鑑權模式
2. 在請求中新增正確的 Header：
    ```bash
    curl -H "Authorization: Bearer your-api-key" \
          https://your-url.trycloudflare.com/v1/models
    ```

## 本課小結

Cloudflared 隧道是快速暴露本地服務的利器。透過本課，你學會了：

- **一鍵安裝**：UI 內自動下載和安裝 Cloudflared
- **兩種模式**：Quick（臨時）和 Auth（命名）的選擇
- **公網存取**：複製 HTTPS URL，遠端裝置可直接呼叫
- **安全意識**：開啟鑑權、用完即關、定期檢查日誌

記住：**隧道是雙面刃**，用好了方便，用錯了有風險。始終遵循最小暴露原則。

## 下一課預告

下一課我們學習 **[配置全解：AppConfig/ProxyConfig、落盤位置與熱更新語義](/zh-tw/lbjlaq/Antigravity-Manager/advanced/config/)**。

你會學到：
- AppConfig 和 ProxyConfig 的完整欄位
- 配置檔案的落盤位置
- 哪些配置需要重啟，哪些可以熱更新

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 資料目錄名（`.antigravity_tools`） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| 配置結構與預設值（`CloudflaredConfig`、`TunnelMode`） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L16-L59) | 16-59 |
| 自動下載 URL 規則（支援的 OS/架構） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L70-L88) | 70-88 |
| 安裝邏輯（下載/寫入/解壓/權限） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L147-L211) | 147-211 |
|--- | --- | ---|
| URL 提取規則（僅辨識 `*.trycloudflare.com`） | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L390-L413) | 390-413 |
| Tauri 指令介面（check/install/start/stop/get_status） | [`src-tauri/src/commands/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/cloudflared.rs#L6-L118) | 6-118 |
| UI 卡片（模式/Token/HTTP2/URL 展示與複製） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L1597-L1753) | 1597-1753 |
| 啟動前必須 Proxy Running（toast + return） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L256-L306) | 256-306 |

**關鍵常數**：
- `DATA_DIR = ".antigravity_tools"`：資料目錄名（原始碼：`src-tauri/src/modules/account.rs`）

**關鍵函數**：
- `get_download_url()`：拼出 GitHub Releases 的下載位址（原始碼：`src-tauri/src/modules/cloudflared.rs`）
- `extract_tunnel_url()`：從日誌中提取 Quick 模式 URL（原始碼：`src-tauri/src/modules/cloudflared.rs`）

</details>
