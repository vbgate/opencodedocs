---
title: "系統能力: 語言/主題/API | Antigravity-Manager"
sidebarTitle: "5 分鐘搞定系統設定"
subtitle: "系統能力: 語言/主題/API | Antigravity-Manager"
description: "學習 Antigravity Tools 的語言、主題、系統托盤和 API Server。掌握 i18n fallback、開機自啟、HTTP 介面呼叫和重新啟動生效規則。"
tags:
  - "系統設定"
  - "i18n"
  - "主題"
  - "更新"
  - "系統托盤"
  - "HTTP API"
prerequisite:
  - "/zh-tw/lbjlaq/Antigravity-Manager/start/first-run-data"
  - "/zh-tw/lbjlaq/Antigravity-Manager/advanced/config"
order: 9
---

# 系統能力：多語言/主題/更新/開機自啟/HTTP API Server

你把主題切到 dark，介面卻還是亮色；你明明關了視窗，進程卻還在背景；你想讓外部工具切換目前帳號，但又不想把反向代理暴露到區域網路。

這節課聚焦 Antigravity Tools 的「系統能力」：語言、主題、更新、系統托盤/開機自啟，以及給外部程式呼叫的 HTTP API Server。

## 什麼是系統能力？

**系統能力**指的是 Antigravity Tools 作為桌面應用的「產品化能力」：介面多語言與主題切換、更新檢查與升級、關閉視窗後的系統托盤駐留與開機自啟，以及提供一個僅綁定 `127.0.0.1` 的 HTTP API Server 供外部程式呼叫。

## 學完你能做什麼

- 切換語言/主題，並弄清哪些是「立刻生效」
- 明確「關閉視窗」和「退出程式」的區別，以及系統托盤選單能做什麼
- 知道自動更新檢查的觸發條件、間隔與落盤檔案
- 啟用 HTTP API Server 並用 `curl` 跑通探活與帳號切換

## 🎒 開始前的準備

- 你知道資料目錄在哪裡（見 [首次啟動必懂：資料目錄、日誌、系統托盤與自動啟動](../../start/first-run-data/)）
- 你知道 `gui_config.json` 是設定落盤的單一真相來源（見 [設定全解：AppConfig/ProxyConfig、落盤位置與熱更新語意](../config/)）

## 核心思路

把這幾個能力分成兩類，會更好記：

1. 「設定驅動」的能力：語言、主題會寫進 `gui_config.json`（前端呼叫 `save_config`）。
2. 「獨立落盤」的能力：更新設定與 HTTP API 設定各自有單獨的 JSON 檔案；系統托盤與關閉行為由 Tauri 側控制。

## 跟我做

### 第 1 步：切換語言（立即生效 + 自動持久化）

**為什麼**
語言切換最容易讓人以為「需要重新啟動」。這裡的實作是：UI 立即切換，同時把 `language` 寫回設定。

操作：開啟 `Settings` -> `General`，在語言下拉框裡選擇一個語言。

你會看到兩件事幾乎同時發生：

- UI 立即變成新語言（前端直接呼叫 `i18n.changeLanguage(newLang)`）。
- 設定被持久化（前端呼叫 `updateLanguage(newLang)`，內部會觸發 `save_config`）。

::: info 語言包從哪裡來？
前端用 `i18next` 初始化了多語言資源，並設定 `fallbackLng: "en"`。也就是說：某個 key 缺翻譯時，會回落到英文。
:::

### 第 2 步：切換主題（light/dark/system）

**為什麼**
主題不僅影響 CSS，還會影響 Tauri 視窗背景色、DaisyUI 的 `data-theme` 和 Tailwind 的 `dark` class。

操作：在 `Settings` -> `General` 裡把主題切到 `light` / `dark` / `system`。

你應該看到：

- 主題立即生效（`ThemeManager` 會讀取設定並套用到 `document.documentElement`）。
- 當主題是 `system` 時，系統深淺色變化會即時同步到應用（監聽 `prefers-color-scheme`）。

::: warning Linux 的一個例外
`ThemeManager` 會嘗試呼叫 `getCurrentWindow().setBackgroundColor(...)` 設定視窗背景色，但在 Linux 平台會跳過這一步（原始碼裡有註解說明：透明視窗 + softbuffer 可能導致當機）。
:::

### 第 3 步：開機自啟（以及為什麼會帶 `--minimized`）

**為什麼**
開機自啟不是「設定欄位」，而是系統級註冊項（Tauri autostart 外掛）。

操作：在 `Settings` -> `General` 裡，把「開機自動啟動」設為啟用/禁用。

你應該看到：

- 切換時會直接呼叫後端 `toggle_auto_launch(enable)`。
- 頁面初始化時會呼叫 `is_auto_launch_enabled()`，顯示真實狀態（不靠本機快取）。

補充：應用初始化 autostart 外掛時傳入了 `--minimized` 參數，所以「隨開機啟動」通常會以最小化/背景形態啟動（具體表現取決於前端如何處理該參數）。

### 第 4 步：弄清「關閉視窗」和「退出程式」

**為什麼**
很多桌面應用是「關閉即退出」，但 Antigravity Tools 的預設行為是「關閉即隱藏到系統托盤」。

你應該知道：

- 點擊視窗的關閉按鈕後，Tauri 會攔截關閉事件並 `hide()`，而不是退出進程。
- 系統托盤選單裡有 `Show`/`Quit`：想徹底退出，應該用 `Quit`。
- 系統托盤顯示文案會跟隨 `config.language`（系統托盤建立時會讀取設定語言並取翻譯文字；設定更新後會監聽 `config://updated` 事件重新整理系統托盤選單）。

### 第 5 步：更新檢查（自動觸發 + 手動檢查）

**為什麼**
更新這塊同時用了兩套東西：

- 自訂的「版本檢查」邏輯：拉 GitHub Releases 最新版本，判斷是否有更新。
- Tauri Updater：負責下載並安裝，然後 `relaunch()`。

你可以這麼用：

1. 自動檢查：應用啟動後會呼叫 `should_check_updates`，若需要檢查則彈出 `UpdateNotification`，並立刻更新 `last_check_time`。
2. 手動檢查：在 `Settings` 頁面點「檢查更新」（呼叫 `check_for_updates`，並在 UI 展示結果）。

::: tip 更新間隔從哪來？
後端把更新設定落盤到資料目錄下的 `update_settings.json`，預設 `auto_check=true`、`check_interval_hours=24`。
:::

### 第 6 步：啟用 HTTP API Server（只綁定本機）

**為什麼**
如果你想让外部程式（比如 VS Code 外掛）「切換帳號/重新整理配額/讀取日誌」，HTTP API Server 比反向代理連接埠更合適：它固定綁定 `127.0.0.1`，只對本機開放。

操作：在 `Settings` -> `Advanced` 的 「HTTP API」區域裡：

1. 開啟啟用開關。
2. 設定連接埠並點儲存。

你應該看到：UI 會提示「需要重新啟動」（因為後端只在啟動時讀取 `http_api_settings.json` 並啟動服務）。

### 第 7 步：用 curl 驗證 HTTP API（探活/帳號/切換/日誌）

**為什麼**
你需要一個可重複的驗證閉環：能打通 `health`、能列出帳號、能觸發切換/重新整理並理解它們是非同步任務。

預設連接埠是 `19527`。如果你改過連接埠，把下面的 `19527` 換成你的實際值。

::: code-group

```bash [macOS/Linux]
 # 探活
curl -sS "http://127.0.0.1:19527/health" && echo

 # 列出帳號（含 quota 摘要）
curl -sS "http://127.0.0.1:19527/accounts" | head -n 5

 # 獲取目前帳號
curl -sS "http://127.0.0.1:19527/accounts/current" | head -n 5

 # 觸發切換帳號（注意：返回 202，背景非同步執行）
curl -sS -i \
  -H 'Content-Type: application/json' \
  -d '{"account_id":"<account_id>"}' \
  "http://127.0.0.1:19527/accounts/switch"

 # 觸發重新整理所有配額（同樣是 202，非同步執行）
curl -sS -i -X POST "http://127.0.0.1:19527/accounts/refresh"

 # 讀取代理日誌（limit/offset/filter/errors_only）
curl -sS "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | head -n 5
```

```powershell [Windows]
 # 探活
Invoke-RestMethod "http://127.0.0.1:19527/health"

 # 列出帳號
Invoke-RestMethod "http://127.0.0.1:19527/accounts" | ConvertTo-Json -Depth 5

 # 獲取目前帳號
Invoke-RestMethod "http://127.0.0.1:19527/accounts/current" | ConvertTo-Json -Depth 5

 # 觸發切換帳號（返回 202）
$body = @{ account_id = "<account_id>" } | ConvertTo-Json
Invoke-WebRequest -Method Post -ContentType "application/json" -Body $body "http://127.0.0.1:19527/accounts/switch" | Select-Object -ExpandProperty StatusCode

 # 觸發重新整理所有配額（返回 202）
Invoke-WebRequest -Method Post "http://127.0.0.1:19527/accounts/refresh" | Select-Object -ExpandProperty StatusCode

 # 讀取代理日誌
Invoke-RestMethod "http://127.0.0.1:19527/logs?limit=50&offset=0&filter=&errors_only=false" | ConvertTo-Json -Depth 5
```

:::

**你應該看到**：

- `/health` 返回 `{"status":"ok","version":"..."}` 風格的 JSON。
- `/accounts/switch` 返回 202（Accepted），並提示「task started」。真正的切換在背景執行。

## 檢查點 ✅

- 你能解釋：語言/主題為什麼「改了立刻生效」，而 HTTP API 連接埠需要重新啟動
- 你能解釋：關視窗為什麼不會退出，以及從哪裡真正退出
- 你能用 `curl` 打通 `/health` 和 `/accounts`，並理解 `/accounts/switch` 是非同步

## 踩坑提醒

1. HTTP API Server 固定綁定 `127.0.0.1`，它和 `proxy.allow_lan_access` 是兩回事。
2. 更新檢查的「是否檢查」邏輯在 App 啟動時就決定了；一旦觸發，會先更新 `last_check_time`，即便後續檢查失敗也不會在短時間內重複彈窗。
3. 「關視窗不退出」是設計如此：要釋放進程資源，用系統托盤的 `Quit`。

## 本課小結

- 語言：UI 立即切換 + 寫回設定（`i18n.changeLanguage` + `save_config`）
- 主題：由 `ThemeManager` 統一落地到 `data-theme`、`dark` class 和視窗背景色（Linux 有例外）
- 更新：啟動時按 `update_settings.json` 決定是否彈窗，安裝由 Tauri Updater 負責
- HTTP API：預設啟用、只本機可存取，設定落盤 `http_api_settings.json`，改連接埠需重新啟動

## 下一課預告

> 下一課會進入 **伺服器部署：Docker noVNC vs Headless Xvfb（advanced-deployment）**，把桌面端搬到 NAS/伺服器上跑。

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 主題 | 檔案路徑 | 行號 |
|--- | --- | ---|
| i18n 初始化與 fallback | [`src/i18n.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/i18n.ts#L1-L67) | 1-67 |
| Settings：語言/主題/開機自啟/更新設定/HTTP API 設定 | [`src/pages/Settings.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/pages/Settings.tsx#L16-L730) | 16-730 |
| App：同步語言 + 啟動時觸發更新檢查 | [`src/App.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/App.tsx#L52-L124) | 52-124 |
| ThemeManager：套用主題、監聽 system theme、寫入 localStorage | [`src/components/common/ThemeManager.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/common/ThemeManager.tsx#L1-L82) | 1-82 |
| UpdateNotification：檢查更新、自動下載安裝並 relaunch | [`src/components/UpdateNotification.tsx`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/components/UpdateNotification.tsx#L1-L217) | 1-217 |
| 更新檢查：GitHub Releases + check interval | [`src-tauri/src/modules/update_checker.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/update_checker.rs#L1-L187) | 1-187 |
| 系統托盤：按語言產生選單 + 監聽 `config://updated` 重新整理 | [`src-tauri/src/modules/tray.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/tray.rs#L1-L255) | 1-255 |
| 設定儲存：發出 `config://updated` + 熱更新執行中的反向代理 | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L296-L334) | 296-334 |
| 開機自啟命令：toggle/is_enabled（Windows disable 相容） | [`src-tauri/src/commands/autostart.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/autostart.rs#L1-L39) | 1-39 |
| Tauri：初始化 autostart/updater + 關閉視窗轉 hide + 啟動 HTTP API | [`src-tauri/src/lib.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/lib.rs#L50-L160) | 50-160 |
| HTTP API：設定落盤 + 路由（health/accounts/switch/refresh/logs）+ 只綁定 127.0.0.1 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L1-L95) | 1-95 |
| HTTP API：Server bind 與路由註冊 | [`src-tauri/src/modules/http_api.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/http_api.rs#L51-L94) | 51-94 |
| HTTP API 設定命令：get/save | [`src-tauri/src/commands/mod.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/commands/mod.rs#L773-L789) | 773-789 |

</details>
