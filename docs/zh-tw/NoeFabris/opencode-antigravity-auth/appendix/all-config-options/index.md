---
title: "完整設定選項：30+ 參數詳解 | Antigravity Auth"
sidebarTitle: "自訂 30+ 參數"
subtitle: "Antigravity Auth 設定選項完整參考手冊"
description: "學習 Antigravity Auth 外掛程式的 30+ 設定選項。涵蓋通用設定、Session 恢復、帳號選擇策略、速率限制、Token 重新整理等設定項的預設值和最佳實務。"
tags:
  - "設定參考"
  - "進階設定"
  - "完整手冊"
  - "Antigravity"
  - "OpenCode"
prerequisite:
  - "quick-install"
order: 1
---

# Antigravity Auth 設定選項完整參考手冊

## 學完你能做什麼

- 找到並修改 Antigravity Auth 外掛程式的所有設定選項
- 理解每個設定項的作用和適用情境
- 根據使用情境選擇最佳設定組合
- 透過環境變數覆蓋設定檔設定

## 核心思路

Antigravity Auth 外掛程式透過設定檔控制幾乎所有行為：從 Log 等級到帳號選擇策略，從 Session 恢復到 Token 重新整理機制。

::: info 設定檔位置（優先順序由高到低）
1. **專案設定**：`.opencode/antigravity.json`
2. **使用者設定**：
   - Linux/Mac: `~/.config/opencode/antigravity.json`
   - Windows: `%APPDATA%\opencode\antigravity.json`
:::

::: tip 環境變數優先順序
所有設定項都可以透過環境變數覆蓋，環境變數的優先順序**高於**設定檔。
:::

## 設定概覽

| 分類 | 設定項數量 | 核心情境 |
| --- | --- | --- |
| 通用設定 | 3 | Log、除錯模式 |
| 思考區塊 | 1 | 保留思考過程 |
| Session 恢復 | 3 | 錯誤自動恢復 |
| 簽章快取 | 4 | 思考區塊簽章持久化 |
| 空回應重試 | 2 | 處理空回應 |
| 工具 ID 恢復 | 1 | 工具比對 |
| 工具幻覺預防 | 1 | 防止參數錯誤 |
| Token 重新整理 | 3 | 主動重新整理機制 |
| 速率限制 | 5 | 帳號輪換與等待 |
| 健康評分 | 7 | Hybrid 策略評分 |
| Token 桶 | 3 | Hybrid 策略 Token |
| 自動更新 | 1 | 外掛程式自動更新 |
| 網路搜尋 | 2 | Gemini 搜尋 |

---

## 通用設定

### `quiet_mode`

**型別**：`boolean`  
**預設值**：`false`  
**環境變數**：`OPENCODE_ANTIGRAVITY_QUIET=1`

抑制大多數 toast 通知（速率限制、帳號切換等）。恢復通知（Session 恢復成功）始終顯示。

**適用情境**：
- 多帳號高頻使用情境，避免頻繁通知干擾
- 自動化指令碼或背景服務使用

**範例**：
```json
{
  "quiet_mode": true
}
```

### `debug`

**型別**：`boolean`  
**預設值**：`false`  
**環境變數**：`OPENCODE_ANTIGRAVITY_DEBUG=1`

啟用除錯 Log 到檔案。Log 檔案預設儲存在 `~/.config/opencode/antigravity-logs/`。

**適用情境**：
- 排查問題時啟用
- 提交 Bug 報告時提供詳細 Log

::: danger 除錯 Log 可能包含敏感資訊
Log 檔案包含 API 回應、帳號索引等資訊，提交前請脫敏。
:::

### `log_dir`

**型別**：`string`  
**預設值**：OS 特定設定目錄 + `/antigravity-logs`  
**環境變數**：`OPENCODE_ANTIGRAVITY_LOG_DIR=/path/to/logs`

自訂除錯 Log 儲存目錄。

**適用情境**：
- 需要將 Log 儲存到特定位置（如網路共用目錄）
- Log 輪替和歸檔指令碼

---

## 思考區塊設定

### `keep_thinking`

**型別**：`boolean`  
**預設值**：`false`  
**環境變數**：`OPENCODE_ANTIGRAVITY_KEEP_THINKING=1`

::: warning 實驗性功能
保留 Claude 模型的思考區塊（透過簽章快取）。

**行為說明**：
- `false`（預設）：剝離思考區塊，避免簽章錯誤，可靠性優先
- `true`：保留完整上下文（包括思考區塊），但可能遇到簽章錯誤

**適用情境**：
- 需要查看模型的完整推理過程
- 對話中頻繁使用思考內容

**不建議情境**：
- 正式環境（可靠性優先）
- 多輪對話（容易觸發簽章衝突）

::: tip 搭配 `signature_cache` 使用
啟用 `keep_thinking` 時，建議同時設定 `signature_cache` 提升簽章命中率。
:::

---

## Session 恢復

### `session_recovery`

**型別**：`boolean`  
**預設值**：`true`

從 `tool_result_missing` 錯誤自動恢復 Session。啟用後，遇到可恢復錯誤時會顯示 toast 通知。

**恢復的錯誤型別**：
- `tool_result_missing`：工具結果缺失（ESC 中斷、逾時、當機）
- `Expected thinking but found text`：思考區塊順序錯誤

**適用情境**：
- 所有使用工具的情境（預設建議啟用）
- 長時間對話或工具執行頻繁

### `auto_resume`

**型別**：`boolean`  
**預設值**：`false`

自動傳送 "continue" 提示恢復 Session。僅在 `session_recovery` 啟用時生效。

**行為說明**：
- `false`：僅顯示 toast 通知，使用者需要手動傳送 "continue"
- `true`：自動傳送 "continue" 繼續 Session

**適用情境**：
- 自動化指令碼或無人值守情境
- 希望完全自動化恢復流程

**不建議情境**：
- 需要人工確認恢復結果
- 工具執行中斷後需要檢查狀態再繼續

### `resume_text`

**型別**：`string`  
**預設值**：`"continue"`

自動恢復時傳送的自訂文字。僅在 `auto_resume` 啟用時使用。

**適用情境**：
- 多語言環境（如改為「繼續」、「請繼續」）
- 需要額外提示詞的情境

**範例**：
```json
{
  "auto_resume": true,
  "resume_text": "請繼續完成之前的任務"
}
```

---

## 簽章快取

> 僅在 `keep_thinking` 啟用時生效

### `signature_cache.enabled`

**型別**：`boolean`  
**預設值**：`true`

啟用磁碟快取思考區塊簽章。

**作用**：快取簽章可以避免多輪對話中重複簽章導致的錯誤。

### `signature_cache.memory_ttl_seconds`

**型別**：`number`（範圍：60-86400）  
**預設值**：`3600`（1 小時）

記憶體快取的過期時間（秒）。

### `signature_cache.disk_ttl_seconds`

**型別**：`number`（範圍：3600-604800）  
**預設值**：`172800`（48 小時）

磁碟快取的過期時間（秒）。

### `signature_cache.write_interval_seconds`

**型別**：`number`（範圍：10-600）  
**預設值**：`60`

背景寫入磁碟的間隔時間（秒）。

**範例**：
```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  }
}
```

---

## 空回應重試

當 Antigravity 傳回空回應（無 candidates/choices）時自動重試。

### `empty_response_max_attempts`

**型別**：`number`（範圍：1-10）  
**預設值**：`4`

最大重試次數。

### `empty_response_retry_delay_ms`

**型別**：`number`（範圍：500-10000）  
**預設值**：`2000`（2 秒）

每次重試之間的延遲（毫秒）。

**適用情境**：
- 網路不穩定環境（增加重試次數）
- 需要快速失敗（減少重試次數和延遲）

---

## 工具 ID 恢復

### `tool_id_recovery`

**型別**：`boolean`  
**預設值**：`true`

啟用工具 ID 孤立恢復。當工具回應的 ID 不符合（由於上下文壓縮）時，嘗試透過函式名稱比對或建立預留位置。

**作用**：提升多輪對話中工具呼叫的可靠性。

**適用情境**：
- 長對話情境（建議啟用）
- 頻繁使用工具的情境

---

## 工具幻覺預防

### `claude_tool_hardening`

**型別**：`boolean`  
**預設值**：`true`

為 Claude 模型啟用工具幻覺預防。啟用後，自動注入：
- 參數簽章到工具描述
- 嚴格的工具使用規則系統指令

**作用**：防止 Claude 使用訓練資料中的參數名稱而非實際 schema 中的參數名稱。

**適用情境**：
- 使用 MCP 外掛程式或自訂工具（建議啟用）
- 工具 schema 較複雜

**不建議情境**：
- 確認工具呼叫完全符合 schema（可以關閉以減少額外提示）

---

## 主動 Token 重新整理

### `proactive_token_refresh`

**型別**：`boolean`  
**預設值**：`true`

啟用主動背景 Token 重新整理。啟用後，Token 會在過期前自動重新整理，確保請求不會因重新整理 Token 而阻塞。

**作用**：避免請求等待 Token 重新整理的延遲。

### `proactive_refresh_buffer_seconds`

**型別**：`number`（範圍：60-7200）  
**預設值**：`1800`（30 分鐘）

Token 過期前多久觸發主動重新整理（秒）。

### `proactive_refresh_check_interval_seconds`

**型別**：`number`（範圍：30-1800）  
**預設值**：`300`（5 分鐘）

主動重新整理檢查的間隔時間（秒）。

**適用情境**：
- 高頻請求情境（建議啟用主動重新整理）
- 希望減少重新整理失敗風險（增加 buffer 時間）

---

## 速率限制與帳號選擇

### `max_rate_limit_wait_seconds`

**型別**：`number`（範圍：0-3600）  
**預設值**：`300`（5 分鐘）

所有帳號都限速時的最大等待時間（秒）。如果所有帳號的最小等待時間超過此閾值，外掛程式會快速失敗而非掛起。

**設定為 0**：停用逾時，無限期等待。

**適用情境**：
- 需要快速失敗的情境（減少等待時間）
- 可接受長時間等待的情境（增加等待時間）

### `quota_fallback`

**型別**：`boolean`  
**預設值**：`false`

為 Gemini 模型啟用配額回退。當首選配額池（Gemini CLI 或 Antigravity）耗盡時，嘗試同一帳號的備用配額池。

**適用情境**：
- Gemini 模型高頻使用（建議啟用）
- 希望最大化每個帳號的配額利用率

::: tip 僅在未明確指定配額後綴時生效
如果模型名稱明確包含 `:antigravity` 或 `:gemini-cli`，將始終使用指定配額池，不會回退。
:::

### `account_selection_strategy`

**型別**：`string`（列舉：`sticky`、`round-robin`、`hybrid`）  
**預設值**：`"hybrid"`  
**環境變數**：`OPENCODE_ANTIGRAVITY_ACCOUNT_SELECTION_STRATEGY`

帳號選擇策略。

| 策略 | 說明 | 適用情境 |
| --- | --- | --- |
| `sticky` | 使用同一帳號直到限速，保留提示快取 | 單 Session、快取敏感情境 |
| `round-robin` | 每次請求輪換到下一個帳號，最大化吞吐量 | 多帳號高吞吐情境 |
| `hybrid` | 基於健康評分 + Token 桶 + LRU 的確定性選擇 | 通用建議，平衡效能與可靠性 |

::: info 詳細說明
詳見 [帳號選擇策略](/zh-tw/NoeFabris/opencode-antigravity-auth/advanced/account-selection-strategies/) 章節。
:::

### `pid_offset_enabled`

**型別**：`boolean`  
**預設值**：`false`  
**環境變數**：`OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1`

啟用基於 PID 的帳號偏移。啟用後，不同 Session（PIDs）會優先選擇不同的起始帳號，有助於在執行多個平行代理時分配負載。

**行為說明**：
- `false`（預設）：所有 Session 從同一帳號索引開始，保留 Anthropic 提示快取（建議單 Session 使用）
- `true`：根據 PID 偏移起始帳號，分散負載（建議多 Session 平行使用）

**適用情境**：
- 執行多個平行 OpenCode Session
- 使用子代理或平行任務

### `switch_on_first_rate_limit`

**型別**：`boolean`  
**預設值**：`true`

在首次限速時立即切換帳號（1 秒延遲後）。停用後，會先重試同一帳號，第二次限速時才切換。

**適用情境**：
- 希望快速切換帳號（建議啟用）
- 希望最大化單帳號配額（停用）

---

## 健康評分（Hybrid 策略）

> 僅在 `account_selection_strategy` 為 `hybrid` 時生效

### `health_score.initial`

**型別**：`number`（範圍：0-100）  
**預設值**：`70`

帳號的初始健康評分。

### `health_score.success_reward`

**型別**：`number`（範圍：0-10）  
**預設值**：`1`

每次成功請求增加的健康評分。

### `health_score.rate_limit_penalty`

**型別**：`number`（範圍：-50-0）  
**預設值**：`-10`

每次限速扣除的健康評分。

### `health_score.failure_penalty`

**型別**：`number`（範圍：-100-0）  
**預設值**：`-20`

每次失敗扣除的健康評分。

### `health_score.recovery_rate_per_hour`

**型別**：`number`（範圍：0-20）  
**預設值**：`2`

每小時恢復的健康評分。

### `health_score.min_usable`

**型別**：`number`（範圍：0-100）  
**預設值**：`50`

帳號可用的最低健康評分閾值。

### `health_score.max_score`

**型別**：`number`（範圍：50-100）  
**預設值**：`100`

健康評分上限。

**適用情境**：
- 預設設定適用於大多數情境
- 高頻限速環境可以降低 `rate_limit_penalty` 或增加 `recovery_rate_per_hour`
- 需要更快切換帳號可以降低 `min_usable`

**範例**：
```json
{
  "account_selection_strategy": "hybrid",
  "health_score": {
    "initial": 80,
    "success_reward": 2,
    "rate_limit_penalty": -5,
    "failure_penalty": -15,
    "recovery_rate_per_hour": 5,
    "min_usable": 40,
    "max_score": 100
  }
}
```

---

## Token 桶（Hybrid 策略）

> 僅在 `account_selection_strategy` 為 `hybrid` 時生效

### `token_bucket.max_tokens`

**型別**：`number`（範圍：1-1000）  
**預設值**：`50`

Token 桶的最大容量。

### `token_bucket.regeneration_rate_per_minute`

**型別**：`number`（範圍：0.1-60）  
**預設值**：`6`

每分鐘產生的 Token 數。

### `token_bucket.initial_tokens`

**型別**：`number`（範圍：1-1000）  
**預設值**：`50`

帳號初始 Token 數。

**適用情境**：
- 高頻請求情境可以增加 `max_tokens` 和 `regeneration_rate_per_minute`
- 希望更快輪換帳號可以降低 `initial_tokens`

---

## 自動更新

### `auto_update`

**型別**：`boolean`  
**預設值**：`true`

啟用外掛程式自動更新。

**適用情境**：
- 希望自動取得最新功能（建議啟用）
- 需要固定版本（停用）

---

## 網路搜尋（Gemini Grounding）

### `web_search.default_mode`

**型別**：`string`（列舉：`auto`、`off`）  
**預設值**：`"off"`

網路搜尋的預設模式（未透過 variant 指定時）。

| 模式 | 說明 |
| --- | --- |
| `auto` | 模型決定何時搜尋（動態檢索） |
| `off` | 預設停用搜尋 |

### `web_search.grounding_threshold`

**型別**：`number`（範圍：0-1）  
**預設值**：`0.3`

動態檢索閾值（0.0 到 1.0）。值越高，模型搜尋頻率越低（需要更高信心度才會觸發搜尋）。僅在 `auto` 模式下生效。

**適用情境**：
- 減少不必要搜尋（提高閾值，如 0.5）
- 鼓勵模型多搜尋（降低閾值，如 0.2）

**範例**：
```json
{
  "web_search": {
    "default_mode": "auto",
    "grounding_threshold": 0.4
  }
}
```

---

## 設定範例

### 單帳號基礎設定

```json
{
  "quiet_mode": false,
  "debug": false,
  "keep_thinking": false,
  "session_recovery": true,
  "auto_resume": false,
  "account_selection_strategy": "sticky"
}
```

### 多帳號高效能設定

```json
{
  "quiet_mode": true,
  "debug": false,
  "session_recovery": true,
  "auto_resume": true,
  "account_selection_strategy": "hybrid",
  "quota_fallback": true,
  "switch_on_first_rate_limit": true,
  "max_rate_limit_wait_seconds": 120,
  "health_score": {
    "initial": 70,
    "min_usable": 40
  },
  "token_bucket": {
    "max_tokens": 100,
    "regeneration_rate_per_minute": 10
  }
}
```

### 除錯與診斷設定

```json
{
  "debug": true,
  "log_dir": "/tmp/antigravity-logs",
  "quiet_mode": false,
  "session_recovery": true,
  "auto_resume": true,
  "tool_id_recovery": true
}
```

### 保留思考區塊設定

```json
{
  "keep_thinking": true,
  "signature_cache": {
    "enabled": true,
    "memory_ttl_seconds": 7200,
    "disk_ttl_seconds": 259200,
    "write_interval_seconds": 120
  },
  "session_recovery": true
}
```

---

## 常見問題

### Q: 如何臨時停用某個設定？

**A**: 使用環境變數覆蓋，無需修改設定檔。

```bash
# 臨時啟用除錯模式
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode

# 臨時啟用安靜模式
OPENCODE_ANTIGRAVITY_QUIET=1 opencode
```

### Q: 設定檔修改後需要重新啟動 OpenCode 嗎？

**A**: 是的，設定檔在 OpenCode 啟動時載入，修改後需要重新啟動。

### Q: 如何驗證設定是否生效？

**A**: 啟用 `debug` 模式，檢查 Log 檔案中的設定載入資訊。

```json
{
  "debug": true
}
```

Log 中會顯示載入的設定：
```
[config] Loaded configuration: {...}
```

### Q: 哪些設定項最常需要調整？

**A**:
- `account_selection_strategy`：多帳號情境選擇合適的策略
- `quiet_mode`：減少通知干擾
- `session_recovery` / `auto_resume`：控制 Session 恢復行為
- `debug`：排查問題時啟用

### Q: 設定檔有 JSON Schema 校驗嗎？

**A**: 是的，在設定檔中新增 `$schema` 欄位可以啟用 IDE 自動完成和校驗：

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  ...
}
```

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 設定 Schema 定義 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 1-373 |
| JSON Schema | [`assets/antigravity.schema.json`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/assets/antigravity.schema.json) | 1-157 |
| 設定載入 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | - |

**關鍵常數**：
- `DEFAULT_CONFIG`：預設設定物件（`schema.ts:328-372`）

**關鍵型別**：
- `AntigravityConfig`：主設定型別（`schema.ts:322`）
- `SignatureCacheConfig`：簽章快取設定型別（`schema.ts:323`）
- `AccountSelectionStrategy`：帳號選擇策略型別（`schema.ts:22`）

</details>
