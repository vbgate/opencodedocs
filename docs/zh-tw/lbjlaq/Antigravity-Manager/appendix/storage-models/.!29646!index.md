---
title: "儲存模型：資料結構 | Antigravity Tools"
sidebarTitle: "資料都在哪"
subtitle: "資料與模型：帳號檔案、SQLite 統計庫與關鍵欄位口徑"
description: "學習 Antigravity Tools 的資料儲存結構。掌握 accounts.json、帳號檔案、token_stats.db/proxy_logs.db 的位置與欄位含義。"
tags:
  - "附錄"
  - "資料模型"
  - "儲存結構"
  - "備份"
prerequisite:
  - "start-backup-migrate"
order: 2
---

# 資料與模型：帳號檔案、SQLite 統計庫與關鍵欄位口徑

## 學完你能做什麼

- 快速定位帳號資料、統計庫、設定檔、日誌目錄的儲存位置
- 理解帳號檔案的 JSON 結構與關鍵欄位含義
- 透過 SQLite 直接查詢代理請求日誌和 Token 消耗統計
- 在備份、遷移、故障排查時知道該看哪些檔案

## 你現在的困境

當你需要：
- **遷移帳號到新機器**：不知道該複製哪些檔案
- **排查帳號異常**：帳號檔案裡有哪些欄位可以判斷帳號狀態
- **匯出 Token 消耗**：想直接從資料庫查詢，不知道表結構
- **清理歷史資料**：擔心刪錯檔案導致資料遺失

本附錄會幫你建立完整的資料模型認知。

---

## 資料目錄結構

Antigravity Tools 的核心資料預設儲存在「使用者主目錄」下的 `.antigravity_tools` 目錄裡（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`）。

::: warning 先說清楚安全邊界
這個目錄裡會包含 `refresh_token`/`access_token` 等敏感資訊（來源：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:20-27`）。備份/複製/共享前，先確認你的目標環境是可信的。
:::

### 我應該去哪裡找這個目錄？

::: code-group

```bash [macOS/Linux]
## 進入資料目錄
cd ~/.antigravity_tools

## 或者在 Finder 開啟（macOS）
open ~/.antigravity_tools
```

```powershell [Windows]
## 進入資料目錄
Set-Location "$env:USERPROFILE\.antigravity_tools"

## 或者在檔案總管開啟
explorer "$env:USERPROFILE\.antigravity_tools"
```

:::

### 目錄樹概覽

```
~/.antigravity_tools/
├── accounts.json          # 帳號索引（版本 2.0）
├── accounts/              # 帳號目錄
│   └── <account_id>.json  # 每個帳號一個檔案
├── gui_config.json        # 應用程式設定（GUI 寫入）
├── token_stats.db         # Token 統計庫（SQLite）
├── proxy_logs.db          # Proxy 監控日誌庫（SQLite）
├── logs/                  # 應用程式日誌目錄
│   └── app.log*           # 按天滾動（檔名隨日期變化）
├── bin/                   # 外部工具（如 cloudflared）
│   └── cloudflared(.exe)
└── device_original.json   # 裝置指紋基線（可選）
```

**資料目錄路徑規則**：取 `dirs::home_dir()`，拼上 `.antigravity_tools`（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:16-33`）。

::: tip 備份建議
定期備份 `accounts/` 目錄、`accounts.json`、`token_stats.db` 和 `proxy_logs.db` 即可儲存所有核心資料。
:::

---

## 帳號資料模型

### accounts.json（帳號索引）

帳號索引檔案記錄了所有帳號的摘要資訊和目前選中的帳號。

**位置**：`~/.antigravity_tools/accounts.json`

**Schema**（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:76-92`）：

```json
{
  "version": "2.0",                  // 索引版本
  "accounts": [                       // 帳號摘要清單
    {
      "id": "uuid-v4",              // 帳號唯一 ID
      "email": "user@gmail.com",     // 帳號信箱
      "name": "Display Name",        // 顯示名稱（可選）
      "created_at": 1704067200,      // 建立時間（Unix 時間戳）
      "last_used": 1704067200       // 最後使用時間（Unix 時間戳）
    }
  ],
  "current_account_id": "uuid-v4"    // 目前選中的帳號 ID
}
```

### 帳號檔案（{account_id}.json）

每個帳號的完整資料以 JSON 格式獨立儲存在 `accounts/` 目錄下。

**位置**：`~/.antigravity_tools/accounts/{account_id}.json`

**Schema**（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/account.rs:6-42`；前端型別：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:1-55`）：

```json
{
  "id": "uuid-v4",
  "email": "user@gmail.com",
  "name": "Display Name",

  "token": {                        // OAuth Token 資料
    "access_token": "ya29...",      // 目前存取權杖
    "refresh_token": "1//...",      // 重新整理權杖（最重要）
    "expires_in": 3600,            // 過期時間（秒）
    "expiry_timestamp": 1704070800, // 過期時間戳
    "token_type": "Bearer",
    "email": "user@gmail.com",
    "project_id": "my-gcp-project", // 可選：Google Cloud 專案 ID
    "session_id": "..."            // 可選：Antigravity sessionId
  },

  "device_profile": {               // 裝置指紋（可選）
    "machine_id": "...",
    "mac_machine_id": "...",
    "dev_device_id": "...",
    "sqm_id": "..."
  },

  "device_history": [               // 裝置指紋歷史版本
    {
      "id": "version-id",
      "created_at": 1704067200,
      "label": "Saved from device X",
      "profile": { ... },
      "is_current": false
    }
  ],

  "quota": {                        // 配額資料（可選）
    "models": [
      {
        "name": "gemini-2.0-flash-exp",
        "percentage": 85,           // 剩餘配額百分比
        "reset_time": "2024-01-02T00:00:00Z"
      }
    ],
    "last_updated": 1704067200,
    "is_forbidden": false,
    "subscription_tier": "PRO"      // 訂閱類型：FREE/PRO/ULTRA
  },

  "disabled": false,                // 帳號是否徹底停用
  "disabled_reason": null,          // 停用原因（如 invalid_grant）
  "disabled_at": null,             // 停用時間戳

  "proxy_disabled": false,         // 是否停用代理功能
  "proxy_disabled_reason": null,   // 代理停用原因
  "proxy_disabled_at": null,       // 代理停用時間戳

  "protected_models": [             // 受配額保護的模型清單
    "gemini-2.5-pro-exp"
  ],

  "created_at": 1704067200,
  "last_used": 1704067200
}
```

### 關鍵欄位說明

| 欄位 | 型別 | 業務含義 | 觸發條件 |
|--- | --- | --- | ---|
| `disabled` | bool | 帳號被徹底停用（如 refresh_token 失效） | `invalid_grant` 時自動設為 `true` |
| `proxy_disabled` | bool | 僅停用代理功能，不影響 GUI 使用 | 手動停用或配額保護觸發 |
| `protected_models` | string[] | 模型級配額保護的「受限模型清單」 | 由配額保護邏輯更新 |
| `quota.models[].percentage` | number | 剩餘配額百分比（0-100） | 每次重新整理配額時更新 |
| `token.refresh_token` | string | 用於取得 access_token 的憑證 | OAuth 授權時取得，長期有效 |

**重要規則 1：invalid_grant 會觸發停用**（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:869-889`；寫入：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:942-969`）：

- 當 token 重新整理失敗且錯誤包含 `invalid_grant` 時，TokenManager 會把帳號檔案寫入 `disabled=true` / `disabled_at` / `disabled_reason`，並把帳號從 token 池移除。

**重要規則 2：protected_models 的語意**（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/token_manager.rs:227-250`；配額保護寫入：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`）：

- `protected_models` 裡存的是「標準化後的模型 ID」，用來做模型級的配額保護與調度跳過。

---

## Token 統計資料庫

Token 統計庫記錄了每次代理請求的 Token 消耗，用於成本監控與趨勢分析。

**位置**：`~/.antigravity_tools/token_stats.db`

**資料庫引擎**：SQLite + WAL 模式（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:63-76`）

### 表結構

#### token_usage（原始使用記錄）

| 欄位 | 型別 | 說明 |
|--- | --- | ---|
| id | INTEGER PRIMARY KEY AUTOINCREMENT | 自增主鍵 |
| timestamp | INTEGER | 請求時間戳 |
| account_email | TEXT | 帳號信箱 |
| model | TEXT | 模型名稱 |
| input_tokens | INTEGER | 輸入 Token 數 |
| output_tokens | INTEGER | 輸出 Token 數 |
| total_tokens | INTEGER | 總 Token 數 |

**建表語句**（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:83-94`）：

```sql
CREATE TABLE IF NOT EXISTS token_usage (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp INTEGER NOT NULL,
    account_email TEXT NOT NULL,
    model TEXT NOT NULL,
    input_tokens INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0
);
```

#### token_stats_hourly（小時聚合表）

每小時聚合一次 Token 使用量，用於快速查詢趨勢資料。

**建表語句**（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:111-123`）：

```sql
CREATE TABLE IF NOT EXISTS token_stats_hourly (
    hour_bucket TEXT NOT NULL,           -- 時間桶（格式：YYYY-MM-DD HH:00）
    account_email TEXT NOT NULL,
    total_input_tokens INTEGER NOT NULL DEFAULT 0,
    total_output_tokens INTEGER NOT NULL DEFAULT 0,
    total_tokens INTEGER NOT NULL DEFAULT 0,
    request_count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (hour_bucket, account_email)
);
```

### 索引

為了提升查詢效能，資料庫建立了以下索引（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:97-108`）：

```sql
-- 按時間降序索引
CREATE INDEX IF NOT EXISTS idx_token_timestamp
ON token_usage (timestamp DESC);

-- 按帳號索引
CREATE INDEX IF NOT EXISTS idx_token_account
ON token_usage (account_email);
```

### 常用查詢範例

#### 查詢最近 24 小時的 Token 消耗

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT account_email, SUM(total_tokens) as tokens
   FROM token_stats_hourly
   WHERE hour_bucket >= strftime('%Y-%m-%d %H:00', 'now', '-24 hours')
   GROUP BY account_email
   ORDER BY tokens DESC;"
```

#### 按模型統計消耗

```bash
sqlite3 ~/.antigravity_tools/token_stats.db \
  "SELECT model,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(total_tokens) as total_tokens,
          COUNT(*) as request_count
   FROM token_usage
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY model
   ORDER BY total_tokens DESC;"
```

::: info 時間欄位的口徑
`token_usage.timestamp` 是 `chrono::Utc::now().timestamp()` 寫入的 Unix 時間戳（秒），`token_stats_hourly.hour_bucket` 也是按 UTC 生成的字串（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/token_stats.rs:136-156`）。
:::

---

## Proxy 監控日誌資料庫

Proxy 日誌庫記錄了每次代理請求的詳細資訊，用於故障排查與請求稽核。

**位置**：`~/.antigravity_tools/proxy_logs.db`

**資料庫引擎**：SQLite + WAL 模式（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:10-24`）

### 表結構：request_logs

| 欄位 | 型別 | 說明 |
|--- | --- | ---|
| id | TEXT PRIMARY KEY | 請求唯一 ID（UUID） |
| timestamp | INTEGER | 請求時間戳 |
| method | TEXT | HTTP 方法（GET/POST） |
| url | TEXT | 請求 URL |
| status | INTEGER | HTTP 狀態碼 |
| duration | INTEGER | 請求耗時（毫秒） |
| model | TEXT | 客戶端請求的模型名稱 |
| mapped_model | TEXT | 實際路由後使用的模型名稱 |
| account_email | TEXT | 使用的帳號信箱 |
| error | TEXT | 錯誤資訊（如有） |
| request_body | TEXT | 請求本體（可選，佔用空間大） |
| response_body | TEXT | 回應本體（可選，佔用空間大） |
| input_tokens | INTEGER | 輸入 Token 數 |
| output_tokens | INTEGER | 輸出 Token 數 |
| protocol | TEXT | 通訊協定型別（openai/anthropic/gemini） |

**建表語句**（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:30-51`）：

```sql
CREATE TABLE IF NOT EXISTS request_logs (
    id TEXT PRIMARY KEY,
    timestamp INTEGER,
    method TEXT,
    url TEXT,
    status INTEGER,
    duration INTEGER,
    model TEXT,
    error TEXT
);

-- 相容性：透過 ALTER TABLE 逐步新增欄位
ALTER TABLE request_logs ADD COLUMN request_body TEXT;
ALTER TABLE request_logs ADD COLUMN response_body TEXT;
ALTER TABLE request_logs ADD COLUMN input_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN output_tokens INTEGER;
ALTER TABLE request_logs ADD COLUMN account_email TEXT;
ALTER TABLE request_logs ADD COLUMN mapped_model TEXT;
ALTER TABLE request_logs ADD COLUMN protocol TEXT;
```

### 索引

```sql
-- 按時間降序索引
CREATE INDEX IF NOT EXISTS idx_timestamp
ON request_logs (timestamp DESC);

-- 按狀態碼索引
CREATE INDEX IF NOT EXISTS idx_status
ON request_logs (status);
```

### 自動清理

系統啟動 ProxyMonitor 時，會自動清理 30 天前的日誌，並對資料庫做 `VACUUM`（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`；實作：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/proxy_db.rs:194-209`）。

### 常用查詢範例

#### 查詢最近的失敗請求

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT timestamp, method, url, status, error
   FROM request_logs
   WHERE status >= 400 OR status < 200
   ORDER BY timestamp DESC
   LIMIT 10;"
```

#### 統計每個帳號的請求成功率

```bash
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT account_email,
          COUNT(*) as total,
          SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) as success,
          ROUND(100.0 * SUM(CASE WHEN status >= 200 AND status < 400 THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
   FROM request_logs
   WHERE timestamp >= strftime('%s', 'now', '-7 days')
   GROUP BY account_email
   ORDER BY total DESC;"
```

---

## 設定檔

### gui_config.json

儲存應用程式的設定資訊，包括代理設定、模型映射、鑑權模式等。

**位置**：`~/.antigravity_tools/gui_config.json`（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/config.rs:7-13`）

這個檔案的結構以 `AppConfig` 為準（來源：`source/lbjlaq/Antigravity-Manager/src/types/config.ts:76-95`）。

::: tip 你需要「只為備份/遷移」時
最省心的做法是：關掉應用程式後直接打包整個 `~/.antigravity_tools/`。設定熱更新/重啟語意屬於「執行期行為」，建議看進階課 **[設定全解](../../advanced/config/)**。
:::

---

## 日誌檔案

### 應用程式日誌

**位置**：`~/.antigravity_tools/logs/`（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:17-25`）

日誌使用按天滾動檔案，基礎檔名是 `app.log`（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/logger.rs:41-45`）。

**日誌等級**：INFO/WARN/ERROR

**用途**：記錄應用程式執行時的關鍵事件、錯誤資訊和除錯資訊，用於故障排查。

---

## 資料遷移與備份

### 備份核心資料

::: code-group

```bash [macOS/Linux]
## 備份整個資料目錄（最穩）
tar -czf antigravity-backup-$(date +%Y%m%d).tar.gz ~/.antigravity_tools
```

```powershell [Windows]
## 備份整個資料目錄（最穩）
$backupDate = Get-Date -Format "yyyyMMdd"
$dataDir = "$env:USERPROFILE\.antigravity_tools"
Compress-Archive -Path $dataDir -DestinationPath "antigravity-backup-$backupDate.zip"
```

:::

### 遷移到新機器

1. 關閉 Antigravity Tools（避免寫入中途被複製走）
2. 複製來源機器的 `.antigravity_tools` 到目標機器的使用者主目錄下
3. 啟動 Antigravity Tools

::: tip 跨平台遷移
如果從 Windows 遷移到 macOS/Linux（或反之），只需複製整個 `.antigravity_tools` 目錄即可，資料格式跨平台相容。
:::

### 清理歷史資料

::: info 先說結論
- `proxy_logs.db`：有自動清理 30 天（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/proxy/monitor.rs:41-60`）。
- `token_stats.db`：啟動時會初始化表結構（來源：`source/lbjlaq/Antigravity-Manager/src-tauri/src/lib.rs:53-56`），但原始碼裡沒有看到「按天自動清理歷史記錄」的邏輯。
:::

::: danger 只在你確認不需要歷史資料時做
清空統計/日誌會讓你失去歷史排障與成本分析資料。動手前先備份整個 `.antigravity_tools`。
:::

如果你只是想「清空歷史並重新開始」，最穩的方式是關掉應用程式後直接刪掉 DB 檔案（下次啟動會重建表結構）。

::: code-group

```bash [macOS/Linux]
## 清空 Token 統計（會遺失歷史）
rm -f ~/.antigravity_tools/token_stats.db

## 清空 Proxy 監控日誌（會遺失歷史）
rm -f ~/.antigravity_tools/proxy_logs.db
```

```powershell [Windows]
## 清空 Token 統計（會遺失歷史）
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\token_stats.db" -ErrorAction SilentlyContinue

## 清空 Proxy 監控日誌（會遺失歷史）
Remove-Item -Force "$env:USERPROFILE\.antigravity_tools\proxy_logs.db" -ErrorAction SilentlyContinue
```

:::

---

## 常見欄位口徑說明

### Unix 時間戳

所有時間相關欄位（如 `created_at`、`last_used`、`timestamp`）使用 Unix 時間戳（秒級精度）。

**轉換為可讀時間**：

```bash
## macOS/Linux
date -r 1704067200
date -d @1704067200  # GNU date

## SQLite 查詢（範例：把 request_logs.timestamp 轉成人類可讀時間）
sqlite3 ~/.antigravity_tools/proxy_logs.db \
  "SELECT datetime(timestamp, 'unixepoch', 'localtime') FROM request_logs LIMIT 1;"
```

### 配額百分比

`quota.models[].percentage` 表示剩餘配額百分比（0-100）（來源：`source/lbjlaq/Antigravity-Manager/src/types/account.ts:36-40`；後端模型：`source/lbjlaq/Antigravity-Manager/src-tauri/src/models/quota.rs:3-9`）。

是否觸發「配額保護」，由 `quota_protection.enabled/threshold_percentage/monitored_models` 決定（來源：`source/lbjlaq/Antigravity-Manager/src/types/config.ts:59-63`；寫入 `protected_models`：`source/lbjlaq/Antigravity-Manager/src-tauri/src/modules/account.rs:607-666`）。

---

## 本課小結

- Antigravity Tools 的資料目錄在使用者主目錄下的 `.antigravity_tools`
- 帳號資料：`accounts.json`（索引）+ `accounts/<account_id>.json`（單帳號完整資料）
- 統計資料：`token_stats.db`（Token 統計）+ `proxy_logs.db`（Proxy 監控日誌）
- 設定與維運：`gui_config.json`、`logs/`、`bin/cloudflared*`、`device_original.json`
- 備份/遷移最穩的方式是「關閉應用程式後整體打包 `.antigravity_tools`」

---

## 下一課預告

> 下一課我們學習 **[z.ai 整合能力邊界](../zai-boundaries/)**。
>
> 你會學到：
> - z.ai 整合的已實作功能清單
> - 明確未實作的功能與使用限制
> - Vision MCP 的實驗性實作說明

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 資料目錄（.antigravity_tools） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L16-L33) | 16-33 |
| 帳號目錄（accounts/） | [`src-tauri/src/modules/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/account.rs#L35-L46) | 35-46 |
| accounts.json 結構 | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L76-L92) | 76-92 |
| Account 結構（後端） | [`src-tauri/src/models/account.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/account.rs#L6-L42) | 6-42 |
| Account 結構（前端） | [`src/types/account.ts`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src/types/account.ts#L1-L55) | 1-55 |
| TokenData/QuotaData 結構 | [`src-tauri/src/models/token.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/token.rs#L3-L16) | 3-16 |
| TokenData/QuotaData 結構 | [`src-tauri/src/models/quota.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/models/quota.rs#L3-L21) | 3-21 |
| Token 統計庫初始化（schema） | [`src-tauri/src/modules/token_stats.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/token_stats.rs#L58-L159) | 58-159 |
| Proxy 日誌庫初始化（schema） | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L5-L65) | 5-65 |
| Proxy 日誌自動清理（30天） | [`src-tauri/src/proxy/monitor.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/proxy/monitor.rs#L41-L60) | 41-60 |
| Proxy 日誌自動清理實作 | [`src-tauri/src/modules/proxy_db.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/proxy_db.rs#L194-L209) | 194-209 |
| gui_config.json 讀寫 | [`src-tauri/src/modules/config.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/config.rs#L7-L88) | 7-88 |
| logs/ 目錄與 app.log | [`src-tauri/src/modules/logger.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/logger.rs#L17-L45) | 17-45 |
| bin/cloudflared 路徑 | [`src-tauri/src/modules/cloudflared.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/cloudflared.rs#L92-L101) | 92-101 |
| device_original.json | [`src-tauri/src/modules/device.rs`](https://github.com/lbjlaq/Antigravity-Manager/blob/main/src-tauri/src/modules/device.rs#L11-L13) | 11-13 |
|--- | --- | ---|

**關鍵常數**：
- `DATA_DIR = ".antigravity_tools"`：資料目錄名稱（`src-tauri/src/modules/account.rs:16-18`）
- `ACCOUNTS_INDEX = "accounts.json"`：帳號索引檔名（`src-tauri/src/modules/account.rs:16-18`）
- `CONFIG_FILE = "gui_config.json"`：設定檔名（`src-tauri/src/modules/config.rs:7`）

**關鍵函數**：
- `get_data_dir()`：取得資料目錄路徑（`src-tauri/src/modules/account.rs`）
- `record_usage()`：寫入 `token_usage`/`token_stats_hourly`（`src-tauri/src/modules/token_stats.rs`）
- `save_log()`：寫入 `request_logs`（`src-tauri/src/modules/proxy_db.rs`）
- `cleanup_old_logs(days)`：刪除舊 `request_logs` 並 `VACUUM`（`src-tauri/src/modules/proxy_db.rs`）

</details>
