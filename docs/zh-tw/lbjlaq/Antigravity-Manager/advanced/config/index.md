---
title: "配置：熱更新與遷移 | Antigravity-Manager"
subtitle: "配置：熱更新與遷移 | Antigravity-Manager"
sidebarTitle: "配置不生效怎麼辦"
description: "學習配置系統的落盤、熱更新與遷移機制。掌握欄位預設值與鑑權驗證方法，避免常見陷阱。"
tags:
  - "配置"
  - "gui_config.json"
  - "AppConfig"
  - "ProxyConfig"
  - "熱更新"
prerequisite:
  - "start-first-run-data"
  - "start-proxy-and-first-client"
order: 1
---
# 配置全解：AppConfig/ProxyConfig、落盤位置與熱更新語義

你改了 `auth_mode` 但客戶端還是 401；你開了 `allow_lan_access`，同網段設備卻連不上；你想把配置遷到新機器，卻不知道該拷哪些檔案。

這節課把 Antigravity Tools 的配置系統一次講透：配置存在哪、預設值是什麼、哪些能熱更新、哪些必須重啟反代。

## 什麼是 AppConfig/ProxyConfig？

**AppConfig/ProxyConfig**是 Antigravity Tools 的配置資料模型：AppConfig 管桌面端的通用設定（語言、主題、預熱、配額保護等），ProxyConfig 管本地反代服務的運行參數（連接埠、鑑權、模型對應、上游代理等）。它們最終都序列化到同一個 `gui_config.json` 檔案，反代啟動時讀取其中的 ProxyConfig。

## 學完你能做什麼

- 找到配置檔案 `gui_config.json` 的真實落盤位置，並能做備份/遷移
- 讀懂 AppConfig/ProxyConfig 的核心欄位與預設值（以源碼為準）
- 明確哪些配置儲存後會熱更新，哪些必須重啟反代才能生效
- 看懂一次「配置遷移」（舊欄位被自動合併/刪除）的發生條件

## 你現在的困境

- 改了配置卻「不生效」，你不知道是沒儲存、沒熱更新，還是需要重啟
- 你只想把「反代配置」帶到新機器，但又擔心把帳號資料一起帶出去
- 升級後出現舊欄位，你擔心配置檔案格式「壞了」

## 什麼時候用這一招

- 你準備把反代從「僅本機」切到「區域網路可存取」
- 你要改鑑權策略（`auth_mode`/`api_key`），並想立刻驗證生效
- 你要批量維護模型對應/上游代理/z.ai 配置

## 🎒 開始前的準備

- 你已經知道資料目錄是什麼（見 [首次啟動必懂：資料目錄、日誌、託盤與自動啟動](../../start/first-run-data/)）
- 你能啟動一次反代服務（見 [啟動本地反代並接入第一個客戶端](../../start/proxy-and-first-client/)）

::: warning 先說個邊界
本課會教你讀/備份/遷移 `gui_config.json`，但不建議你把它當成「長期手寫維護的配置檔案」。因為後端儲存配置時會按 Rust 的 `AppConfig` 結構重新序列化，手動塞進去的未知欄位，很可能在下一次儲存時被自動丟掉。
:::

## 核心思路

配置這件事，先記住三句話：

1. AppConfig 是持久化配置的根物件，落在 `gui_config.json`。
2. ProxyConfig 是 `AppConfig.proxy` 的子物件，反代啟動/熱更新都圍繞它。
3. 熱更新是「只更新記憶體狀態」：能熱更的不代表能改監聽連接埠/監聽位址。

## 跟我做

### 第 1 步：定位 `gui_config.json`（配置的單一真相源）

**為什麼**
你後面所有的「備份/遷移/排障」，都要以這個檔案為準。

後端的資料目錄是你的 Home 目錄下的 `.antigravity_tools`（不存在會自動建立），配置檔案名稱固定為 `gui_config.json`。

::: code-group

```bash [macOS/Linux]
CONFIG_FILE="$HOME/.antigravity_tools/gui_config.json"
echo "$CONFIG_FILE"
ls -la "$CONFIG_FILE" || true
```

```powershell [Windows]
$configFile = Join-Path $HOME ".antigravity_tools\gui_config.json"
$configFile
Get-ChildItem -Force $configFile -ErrorAction SilentlyContinue
```

:::

**你應該看到**：
- 如果你還沒啟動過反代，這個檔案可能不存在（後端會直接用預設配置）。
- 啟動反代服務或儲存設定時，它會被自動建立並寫入 JSON。

### 第 2 步：先備份一份（防手滑 + 方便回滾）

**為什麼**
配置裡可能包含 `proxy.api_key`、z.ai 的 `api_key` 等敏感欄位。你想遷移/比對時，備份比「記憶」可靠。

::: code-group

```bash [macOS/Linux]
mkdir -p "$HOME/antigravity-config-backup"
cp "$HOME/.antigravity_tools/gui_config.json" "$HOME/antigravity-config-backup/gui_config.$(date +%Y%m%d%H%M%S).json"
```

```powershell [Windows]
$backupDir = Join-Path $HOME "antigravity-config-backup"
New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
$ts = Get-Date -Format "yyyyMMddHHmmss"
Copy-Item (Join-Path $HOME ".antigravity_tools\gui_config.json") (Join-Path $backupDir "gui_config.$ts.json")
```

:::

**你應該看到**：備份目錄裡出現了一個帶時間戳記的 JSON 檔案。

### 第 3 步：搞清預設值（別憑感覺猜）

**為什麼**
很多「怎麼都配不對」的問題，其實是你對預設值的預期不對。

下面這些預設值來自後端 `AppConfig::new()` 和 `ProxyConfig::default()`：

| 配置塊 | 欄位 | 預設值（源碼） | 你需要記住的點 |
| --- | --- | --- | --- |
| AppConfig | `language` | `"zh"` | 預設中文 |
| AppConfig | `theme` | `"system"` | 跟隨系統 |
| AppConfig | `auto_refresh` | `true` | 預設會自動重新整理配額 |
| AppConfig | `refresh_interval` | `15` | 單位：分鐘 |
| ProxyConfig | `enabled` | `false` | 預設不啟動反代 |
| ProxyConfig | `allow_lan_access` | `false` | 預設只綁定本機（隱私優先） |
| ProxyConfig | `auth_mode` | `"off"` | 預設不鑑權（僅本機場景） |
| ProxyConfig | `port` | `"8045"` | 這是你最常改的欄位 |
| ProxyConfig | `api_key` | `"sk-<uuid>"` | 預設會生成隨機 key |
| ProxyConfig | `request_timeout` | `"120"` | 單位：秒（注意：反代內部目前不一定用到它） |
| ProxyConfig | `enable_logging` | `true` | 預設開啟監控/統計依賴的日誌採集 |
| StickySessionConfig | `mode` | `"Balance"` | 調度策略預設平衡 |
| StickySessionConfig | `max_wait_seconds` | `"60"` | 僅 CacheFirst 模式才有意義 |

::: tip 想看完整欄位怎麼辦？
你可以直接打開 `gui_config.json` 對照源碼：`src-tauri/src/models/config.rs`（AppConfig）和 `src-tauri/src/proxy/config.rs`（ProxyConfig）。本課末尾的「源碼參考」給了可點擊的行號連結。
:::

### 第 4 步：改一個「確定會熱更新」的配置並立刻驗證（以鑑權為例）

**為什麼**
你需要一個「改了立刻能驗證」的閉環，避免在 UI 裡盲改。

當反代正在運行時，後端 `save_config` 會把這些內容熱更新到記憶體：

- `proxy.custom_mapping`
- `proxy.upstream_proxy`
- `proxy.auth_mode` / `proxy.api_key`（安全策略）
- `proxy.zai`
- `proxy.experimental`

這裡我們用 `auth_mode` 做例子：

1. 打開 `API Proxy` 頁面，確保反代服務處於 Running。
2. 把 `auth_mode` 設為 `all_except_health`，並確認你知道當前 `api_key`。
3. 用下面的請求驗證「健康檢查放行、其他介面攔截」。

::: code-group

```bash [macOS/Linux]
#不帶 key 請求 /healthz：應成功
curl -sS "http://127.0.0.1:8045/healthz" && echo

#不帶 key 請求 /v1/models：應 401
curl -sS -i "http://127.0.0.1:8045/v1/models"

#帶 key 再請求 /v1/models：應成功
curl -sS -H "Authorization: Bearer <proxy.api_key>" "http://127.0.0.1:8045/v1/models"
```

```powershell [Windows]
#不帶 key 請求 /healthz：應成功
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/healthz" | Select-Object -ExpandProperty StatusCode

#不帶 key 請求 /v1/models：應 401
try { Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" } catch { $_.Exception.Response.StatusCode.value__ }

#帶 key 再請求 /v1/models：應成功
$headers = @{ Authorization = "Bearer <proxy.api_key>" }
(Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8045/v1/models" -Headers $headers).StatusCode
```

:::

**你應該看到**：`/healthz` 返回 200；`/v1/models` 在不帶 key 時返回 401，帶 key 時成功。

### 第 5 步：改一個「必須重啟反代」的配置（連接埠 / 監聽位址）

**為什麼**
很多配置是「儲存了但不生效」，根因不是 bug，而是它決定了 TCP Listener 怎麼綁定。

在啟動反代時，後端會用 `allow_lan_access` 計算監聽位址（`127.0.0.1` 或 `0.0.0.0`），並用 `port` 綁定連接埠；這一步只發生在 `start_proxy_service`。

操作建議：

1. 在 `API Proxy` 頁面把 `port` 改成一個新值（比如 `8050`），儲存。
2. 停止反代服務，然後重新啟動。
3. 用新連接埠驗證 `/healthz`。

::: code-group

```bash [macOS/Linux]
curl -sS "http://127.0.0.1:8050/healthz" && echo
```

```powershell [Windows]
Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8050/healthz" | Select-Object -ExpandProperty StatusCode
```

:::

**你應該看到**：新連接埠可存取；舊連接埠連接失敗或返回空。

::: warning 關於 `allow_lan_access`
源碼裡 `allow_lan_access` 同時影響兩件事：

1. **監聽位址**：決定綁定 `127.0.0.1` 還是 `0.0.0.0`（需要重啟反代才能重新 bind）。
2. **auto 鑑權策略**：當 `auth_mode=auto` 時，區域網路場景會自動轉成 `all_except_health`（這部分能熱更新）。
:::

### 第 6 步：看懂一次「配置遷移」（舊欄位會被自動清理）

**為什麼**
你升級後可能會在 `gui_config.json` 裡看到老欄位，擔心「壞了」。實際上，後端載入配置時會做一次遷移：把 `anthropic_mapping/openai_mapping` 合併到 `custom_mapping`，並刪除舊欄位，然後自動儲存一次。

你可以用這個規律自檢：

- 如果你在檔案裡看見 `proxy.anthropic_mapping` 或 `proxy.openai_mapping`，下次啟動/載入配置後，它們會被移除。
- 合併時會跳過以 `-series` 結尾的 key（這些現在交給 preset/builtin 邏輯處理）。

**你應該看到**：遷移發生後，`gui_config.json` 裡只留下 `proxy.custom_mapping`。

## 檢查點 ✅

- 你能在本機找到 `$HOME/.antigravity_tools/gui_config.json`
- 你能說清：`auth_mode/api_key/custom_mapping` 這類配置為什麼能熱更新
- 你能說清：`port/allow_lan_access` 這類配置為什麼必須重啟反代

## 踩坑提醒

1. `save_config` 的熱更新只覆蓋少數欄位：它不會幫你重啟 listener，也不會把 `scheduling` 之類的配置推給 TokenManager。
2. `request_timeout` 在反代內部當前實作裡並沒有真正生效：AxumServer 的 `start` 參數裡是 `_request_timeout`，而狀態裡把逾時寫死成了 `300` 秒。
3. 手動往 `gui_config.json` 裡塞「自訂欄位」不可靠：後端儲存時會把它重新序列化成 `AppConfig`，未知欄位會被丟棄。

## 本課小結

- 配置落盤只有一個入口：`$HOME/.antigravity_tools/gui_config.json`
- ProxyConfig 的「能熱更新」不等於「能改連接埠/改監聽位址」；涉及 bind 的都要重啟反代
- 看到舊映射欄位別慌：載入配置時會自動遷移到 `custom_mapping` 並清理舊欄位

## 下一課預告

> 下一課我們學習 **[安全與隱私：auth_mode、allow_lan_access、以及「不要洩漏帳號資訊」的設計](../security/)**。
>
> 你會學到：
> - 什麼時候必須開鑑權（以及為什麼 `auto` 在 LAN 場景會更嚴格）
> - 把本地反代暴露到區域網路/公網時的最小暴露策略
> - 哪些資料會被發送到上游，哪些只保存在本機

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-24

| 主題 | 檔案路徑 | 行號 |
| --- | --- | --- |
| AppConfig 預設值（`AppConfig::new()`） | [`src-tauri/src/models/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/config.rs#L4-L158) | 4-158 |
| ProxyConfig 預設值（連接埠/鑑權/監聽位址） | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L74-L292) | 74-292 |
| StickySessionConfig 預設值（調度） | [`src-tauri/src/proxy/sticky_config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/sticky_config.rs#L3-L36) | 3-36 |
| 配置落盤檔案名 + 遷移邏輯（`gui_config.json`） | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| 資料目錄（`$HOME/.antigravity_tools`） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| `save_config`：儲存配置 + 熱更新哪些欄位 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| AxumServer：`update_mapping/update_proxy/update_security/...` | [`src-tauri/src/proxy/server.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/server.rs#L45-L117) | 45-117 |
| `allow_lan_access` 的監聽位址選擇 | [`src-tauri/src/proxy/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/config.rs#L81-L92) | 81-92 |
| Proxy 啟動時 bind 位址與連接埠（必須重啟才會變） | [`src-tauri/src/commands/proxy.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/proxy.rs#L42-L134) | 42-134 |
| `auth_mode=auto` 的實際規則 | [`src-tauri/src/proxy/security.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/security.rs#L3-L31) | 3-31 |
| 前端儲存調度配置（只儲存，不會推送到後端運行時） | [`src/pages/ApiProxy.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/ApiProxy.tsx#L476-L501) | 476-501 |
| Monitor 頁面動態開啟/關閉日誌採集 | [`src/components/proxy/ProxyMonitor.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/proxy/ProxyMonitor.tsx#L174-L263) | 174-263 |

</details>
