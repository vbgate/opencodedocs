---
title: "偵錯紀錄檔：排除問題與監控執行狀態 | opencode-antigravity-auth"
sidebarTitle: "紀錄檔幫你找問題"
subtitle: "偵錯紀錄檔：排除問題與監控執行狀態"
description: "學習如何啟用偵錯紀錄檔，排除 Antigravity Auth 外掛問題。涵蓋紀錄檔層級、內容解讀、環境變數設定及紀錄檔管理方法。"
tags:
  - "advanced"
  - "debug"
  - "logging"
  - "troubleshooting"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 3
---

# 偵錯紀錄檔：排除問題與監控執行狀態

## 學完你能做什麼

- 啟用偵錯紀錄檔，記錄所有請求和回應的詳細資訊
- 理解不同的紀錄檔層級和適用情境
- 解讀紀錄檔內容，快速定位問題根源
- 使用環境變數暫時啟用偵錯，無需修改設定檔
- 管理紀錄檔案，避免磁碟佔用過大

## 你現在的困境

遇到問題時，你可能會：

- 看到模糊的錯誤提示，不知道具體原因
- 不知道請求是否成功到達 Antigravity API
- 懷疑是帳戶選擇、速率限制或請求轉換出了問題
- 向別人求助時，無法提供有價值的診斷資訊

## 什麼時候用這一招

偵錯紀錄檔適合以下情境：

| 情境 | 是否需要 | 原因 |
| --- | --- | ---|
| 排除 429 速率限制 | ✅ 需要 | 查看具體是哪個帳戶、哪個模型限速 |
| 排除認證失敗 | ✅ 需要 | 檢查令牌重新整理、OAuth 流程 |
| 排除請求轉換問題 | ✅ 需要 | 比對原始請求和轉換後的請求 |
| 排除帳戶選擇策略 | ✅ 需要 | 查看外掛如何選擇帳戶 |
| 監控日常執行狀態 | ✅ 需要 | 統計請求頻率、成功/失敗率 |
| 長期執行 | ⚠️ 謹慎 | 紀錄檔會持續增長，需要管理 |

::: warning 前置檢查
開始本教學前，請確保你已經完成：
- ✅ 安裝了 opencode-antigravity-auth 外掛
- ✅ 成功透過 OAuth 認證
- ✅ 可以使用 Antigravity 模型發起請求

[快速安裝教學](../../start/quick-install/) | [首次請求教學](../../start/first-request/)
:::

## 核心思路

偵錯紀錄檔系統的工作原理：

1. **結構化紀錄檔**：每條紀錄檔都帶時間戳和標籤，便於篩選和分析
2. **分級記錄**：
   - Level 1（basic）：記錄請求/回應元資訊、帳戶選擇、速率限制事件
   - Level 2（verbose）：完整記錄請求/回應 body（最多 50,000 字元）
3. **安全遮蔽**：自動隱藏敏感資訊（如 Authorization header）
4. **獨立檔案**：每次啟動建立新的紀錄檔案，避免混亂

**紀錄檔內容概覽**：

| 紀錄檔類型 | 標籤 | 內容範例 |
| --- | --- | ---|
| 請求追蹤 | `Antigravity Debug ANTIGRAVITY-1` | URL、headers、body 預覽 |
| 回應追蹤 | `Antigravity Debug ANTIGRAVITY-1` | 狀態碼、耗時、回應 body |
| 帳戶上下文 | `[Account]` | 選中帳戶、帳戶索引、模型族 |
| 速率限制 | `[RateLimit]` | 限速詳情、重置時間、重試延遲 |
| 模型識別 | `[ModelFamily]` | URL 解析、模型提取、模型族判斷 |

## 跟我做

### 第 1 步：啟用基本偵錯紀錄檔

**為什麼**
啟用基本偵錯紀錄檔後，外掛會記錄所有請求的元資訊，包括 URL、headers、帳戶選擇、速率限制事件等，幫助你在不洩露敏感資料的情況下排除問題。

**操作**

編輯外掛設定檔：

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/antigravity.json
```

```powershell [Windows]
notepad %APPDATA%\opencode\antigravity.json
```

:::

添加或修改以下設定：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true
}
```

儲存檔案並重啟 OpenCode。

**你應該看到**：

1. OpenCode 啟動後，設定目錄下會產生新的紀錄檔案
2. 紀錄檔案命名格式：`antigravity-debug-YYYY-MM-DDTHH-MM-SS-mmmZ.log`
3. 發起任意請求後，紀錄檔案中會出現新的記錄

::: tip 紀錄檔案位置
- **Linux/macOS**: `~/.config/opencode/antigravity-logs/`
- **Windows**: `%APPDATA%\opencode\antigravity-logs\`
:::

### 第 2 步：解讀紀錄檔內容

**為什麼**
了解紀錄檔的格式和內容，才能快速定位問題。

**操作**

發起一個測試請求，然後查看紀錄檔案：

```bash
<!-- macOS/Linux -->
tail -f ~/.config/opencode/antigravity-logs/antigravity-debug-*.log

<!-- Windows PowerShell -->
Get-Content "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" -Wait
```

**你應該看到**：

```log
[2026-01-23T10:30:15.123Z] [Account] Request: Account 1 (1/2) family=claude
[2026-01-23T10:30:15.124Z] [Antigravity Debug ANTIGRAVITY-1] POST https://cloudcode-pa.googleapis.com/...
[2026-01-23T10:30:15.125Z] [Antigravity Debug ANTIGRAVITY-1] Streaming: yes
[2026-01-23T10:30:15.126Z] [Antigravity Debug ANTIGRAVITY-1] Headers: {"user-agent":"opencode-antigravity-auth/1.3.0","authorization":"[redacted]",...}
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Body Preview: {"model":"google/antigravity-claude-sonnet-4-5",...}
[2026-01-23T10:30:18.456Z] [Antigravity Debug ANTIGRAVITY-1] Response 200 OK (3330ms)
[2026-01-23T10:30:18.457Z] [Antigravity Debug ANTIGRAVITY-1] Response Headers: {"content-type":"application/json",...}
```

**紀錄檔解讀**：

1. **時間戳**：`[2026-01-23T10:30:15.123Z]` - ISO 8601 格式，精確到毫秒
2. **帳戶選擇**：`[Account]` - 外掛選擇了帳戶 1，總共 2 個帳戶，模型族為 claude
3. **請求開始**：`Antigravity Debug ANTIGRAVITY-1` - 請求 ID 為 1
4. **請求方法**：`POST https://...` - HTTP 方法和目標 URL
5. **是否串流**：`Streaming: yes/no` - 是否使用 SSE 串流回應
6. **請求頭**：`Headers: {...}` - 自動隱藏 Authorization（顯示 `[redacted]`）
7. **請求體**：`Body Preview: {...}` - 請求內容（最多 12,000 字元，超出部分截斷）
8. **回應狀態**：`Response 200 OK (3330ms)` - HTTP 狀態碼和耗時
9. **回應頭**：`Response Headers: {...}` - 回應 headers

### 第 3 步：啟用詳細紀錄檔（Verbose）

**為什麼**
詳細紀錄檔會記錄完整的請求/回應 body（最多 50,000 字元），適合排除請求轉換、回應解析等深層問題。

**操作**

修改設定為 verbose 層級：

```json
{
  "debug": true,
  "OPENCODE_ANTIGRAVITY_DEBUG": "2"
}
```

或者使用環境變數（推薦，無需修改設定檔）：

::: code-group

```bash [macOS/Linux]
export OPENCODE_ANTIGRAVITY_DEBUG=2
opencode
```

```powershell [Windows]
$env:OPENCODE_ANTIGRAVITY_DEBUG="2"
opencode
```

:::

**你應該看到**：

1. 紀錄檔案中會出現完整的請求/回應 body（不再是截斷的 preview）
2. 對於大型回應，會顯示前 50,000 字元並標記截斷字元數

```log
[2026-01-23T10:30:15.127Z] [Antigravity Debug ANTIGRAVITY-1] Response Body (200): {"id":"msg_...","type":"message","role":"assistant",...}
```

::: warning 磁碟空間警告
詳細紀錄檔會記錄完整的請求/回應內容，可能導致紀錄檔案快速成長。偵錯完成後，務必關閉 verbose 模式。
:::

### 第 4 步：排除速率限制問題

**為什麼**
速率限制（429 錯誤）是最常見的問題之一，紀錄檔可以告訴你具體是哪個帳戶、哪個模型限速，以及需要等待多久。

**操作**

發起多個並行請求觸發速率限制：

```bash
<!-- macOS/Linux -->
for i in {1..10}; do
  opencode run "Test $i" --model=google/antigravity-claude-sonnet-4-5 &
done
wait
```

查看紀錄檔中的速率限制事件：

```bash
grep "RateLimit" ~/.config/opencode/antigravity-logs/antigravity-debug-*.log
```

**你應該看到**：

```log
[2026-01-23T10:30:20.123Z] [RateLimit] 429 on Account 1 family=claude retryAfterMs=60000
[2026-01-23T10:30:20.124Z] [RateLimit] message: Resource has been exhausted
[2026-01-23T10:30:20.125Z] [RateLimit] quotaResetTime: 2026-01-23T10:31:00.000Z
[2026-01-23T10:30:20.126Z] [Account] Request: Account 2 (2/2) family=claude
[2026-01-23T10:30:20.127Z] [RateLimit] snapshot family=claude Account 1=wait 60s | Account 2=ready
```

**紀錄檔解讀**：

1. **限速詳情**：`429 on Account 1 family=claude retryAfterMs=60000`
   - 帳戶 1（claude 模型族）遇到 429 錯誤
   - 需要等待 60,000 毫秒（60 秒）後重試
2. **錯誤訊息**：`message: Resource has been exhausted` - 配額耗盡
3. **重置時間**：`quotaResetTime: 2026-01-23T10:31:00.000Z` - 配額重置的精確時間
4. **帳戶切換**：外掛自動切換到帳戶 2
5. **全域快照**：`snapshot` - 顯示所有帳戶的限速狀態

### 第 5 步：自訂紀錄檔目錄

**為什麼**
預設情況下，紀錄檔案儲存在 `~/.config/opencode/antigravity-logs/` 目錄。如果你希望將紀錄檔儲存到其他位置（例如專案目錄），可以自訂紀錄檔目錄。

**操作**

在設定檔中添加 `log_dir` 設定項：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "debug": true,
  "log_dir": "/path/to/your/custom/logs"
}
```

或者使用環境變數：

```bash
export OPENCODE_ANTIGRAVITY_LOG_DIR="/path/to/your/custom/logs"
opencode
```

**你應該看到**：

1. 紀錄檔案寫入到指定的目錄
2. 如果目錄不存在，外掛會自動建立
3. 紀錄檔案命名格式不變

::: tip 路徑建議
- 開發偵錯：儲存在專案根目錄（`.logs/`）
- 生產環境：儲存在系統紀錄檔目錄（`/var/log/` 或 `~/Library/Logs/`）
- 暫時偵錯：儲存在 `/tmp/` 目錄，方便清理
:::

### 第 6 步：清理和管理紀錄檔案

**為什麼**
長期執行時，紀錄檔案會持續增長，佔用大量磁碟空間。定期清理是必要的。

**操作**

查看紀錄檔目錄大小：

```bash
<!-- macOS/Linux -->
du -sh ~/.config/opencode/antigravity-logs/

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\" | Measure-Object -Property Length -Sum
```

清理舊紀錄檔：

```bash
<!-- macOS/Linux -->
find ~/.config/opencode/antigravity-logs/ -name "antigravity-debug-*.log" -mtime +7 -delete

<!-- Windows PowerShell -->
Get-ChildItem "$env:APPDATA\opencode\antigravity-logs\antigravity-debug-*.log" |
  Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-7) } |
  Remove-Item
```

**你應該看到**：

1. 紀錄檔目錄的大小減少
2. 只保留最近 7 天的紀錄檔案

::: tip 自動化清理
可以將清理指令碼添加到 cron（Linux/macOS）或工作排程器（Windows），定期執行清理。
:::

## 檢查點 ✅

完成上述步驟後，你應該能夠：

- [ ] 透過設定檔啟用偵錯紀錄檔
- [ ] 使用環境變數暫時啟用偵錯
- [ ] 解讀紀錄檔內容，找到請求/回應詳情
- [ ] 理解不同紀錄檔層級的作用
- [ ] 自訂紀錄檔目錄
- [ ] 管理和清理紀錄檔案

## 踩坑提醒

### 紀錄檔案持續增長

**症狀**：磁碟空間被紀錄檔案佔用

**原因**：長期啟用偵錯紀錄檔，尤其是 verbose 模式

**解決方案**：

1. 偵錯完成後，立即關閉 `debug: false`
2. 設定定期清理指令碼（如第 6 步）
3. 監控紀錄檔目錄大小，設定閾值告警

### 找不到紀錄檔案

**症狀**：啟用了 `debug: true`，但紀錄檔目錄為空

**原因**：
- 設定檔路徑錯誤
- 權限問題（無法寫入紀錄檔目錄）
- 環境變數覆蓋了設定

**解決方案**：

1. 確認設定檔路徑正確：
   ```bash
   # 查找設定檔
   find ~/.config/opencode/ -name "antigravity.json" 2>/dev/null
   ```
2. 檢查環境變數是否覆蓋了設定：
   ```bash
   echo $OPENCODE_ANTIGRAVITY_DEBUG
   ```
3. 檢查紀錄檔目錄權限：
   ```bash
   ls -la ~/.config/opencode/antigravity-logs/
   ```

### 紀錄檔內容不完整

**症狀**：紀錄檔中看不到請求/回應 body

**原因**：預設使用 basic 層級（Level 1），只記錄 body preview（最多 12,000 字元）

**解決方案**：

1. 啟用 verbose 層級（Level 2）：
   ```json
   {
     "OPENCODE_ANTIGRAVITY_DEBUG": "2"
   }
   ```
2. 或者使用環境變數：
   ```bash
   export OPENCODE_ANTIGRAVITY_DEBUG=2
   ```

### 敏感資訊洩露

**症狀**：擔心紀錄檔中包含敏感資料（如 Authorization token）

**原因**：外掛會自動遮蔽 `Authorization` header，但其他 headers 可能包含敏感資訊

**解決方案**：

1. 外掛已自動遮蔽 `Authorization` header（顯示 `[redacted]`）
2. 分享紀錄檔時，檢查是否有其他敏感 headers（如 `Cookie`、`Set-Cookie`）
3. 如果發現敏感資訊，手動刪除後再分享

### 紀錄檔案無法開啟

**症狀**：紀錄檔案被其他程序佔用，無法查看

**原因**：OpenCode 正在寫入紀錄檔案

**解決方案**：

1. 使用 `tail -f` 指令查看即時紀錄檔（不會鎖檔案）
2. 如果需要編輯，先關閉 OpenCode
3. 使用 `cat` 指令查看內容（不會鎖檔案）

## 本課小結

- 偵錯紀錄檔是排除問題的利器，可以記錄請求/回應詳情、帳戶選擇、速率限制事件
- 有兩個紀錄檔層級：basic（Level 1）和 verbose（Level 2）
- 環境變數可以暫時啟用偵錯，無需修改設定檔
- 外掛會自動遮蔽敏感資訊（如 Authorization header）
- 長期執行時需要定期清理紀錄檔案

## 下一課預告

> 下一課我們學習 **[速率限制處理](../rate-limit-handling/)**。
>
> 你會學到：
> - 速率限制的偵測機制和重試策略
> - 指數退避演算法的工作原理
> - 如何設定最大等待時間和重試次數
> - 多帳戶情境下的速率限制處理

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能        | 檔案路徑                                                                                    | 行號    |
| --- | --- | ---|
| Debug 模組 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 全文   |
| 偵錯初始化 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L98-L118) | 98-118 |
| 請求追蹤 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L189-L212) | 189-212 |
| 回應記錄 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L217-L250) | 217-250 |
| Header 遮蔽 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L255-L270) | 255-270 |
| 速率限制紀錄檔 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts#L354-L396) | 354-396 |
| 設定 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L64-L72) | 64-72 |

**關鍵常數**：

| 常數名 | 值 | 說明 |
| --- | --- | ---|
| `MAX_BODY_PREVIEW_CHARS` | 12000 | Basic 層級的 body 預覽長度 |
| `MAX_BODY_VERBOSE_CHARS` | 50000 | Verbose 層級的 body 預覽長度 |
| `DEBUG_MESSAGE_PREFIX` | `"[opencode-antigravity-auth debug]"` | 偵錯紀錄檔前綴 |

**關鍵函式**：

- `initializeDebug(config)`：初始化偵錯狀態，讀取設定和環境變數
- `parseDebugLevel(flag)`：解析偵錯層級字串（"0"/"1"/"2"/"true"/"verbose"）
- `getLogsDir(customLogDir?)`：取得紀錄檔目錄，支援自訂路徑
- `createLogFilePath(customLogDir?)`：產生帶時間戳的紀錄檔案路徑
- `startAntigravityDebugRequest(meta)`：開始請求追蹤，記錄請求元資訊
- `logAntigravityDebugResponse(context, response, meta)`：記錄回應詳情
- `logAccountContext(label, info)`：記錄帳戶選擇上下文
- `logRateLimitEvent(...)`：記錄速率限制事件
- `maskHeaders(headers)`：遮蔽敏感 headers（Authorization）

**設定項**（來自 schema.ts）：

| 設定項 | 型別 | 預設值 | 說明 |
| --- | --- | --- | ---|
| `debug` | boolean | `false` | 啟用偵錯紀錄檔 |
| `log_dir` | string? | undefined | 自訂紀錄檔目錄 |

**環境變數**：

| 環境變數 | 值 | 說明 |
| --- | --- | ---|
| `OPENCODE_ANTIGRAVITY_DEBUG` | "0"/"1"/"2"/"true"/"verbose" | 覆蓋 debug 設定，控制紀錄檔層級 |
| `OPENCODE_ANTIGRAVITY_LOG_DIR` | string | 覆蓋 log_dir 設定，指定紀錄檔目錄 |

</details>
