---
title: "配置指南：完整配置選項詳解 | Antigravity Auth"
sidebarTitle: "配置全搞定"
subtitle: "配置選項完整指南"
description: "掌握 Antigravity Auth 外掛的完整配置選項。詳解配置檔案位置、模型行為、帳戶輪換策略和應用行為設定，提供單帳戶、多帳戶和並行代理場景的推薦配置方案。"
tags:
  - "配置"
  - "高級配置"
  - "多帳戶"
  - "帳戶輪換"
prerequisite:
  - "start-quick-install"
  - "advanced-multi-account-setup"
order: 2
---

# 配置選項完整指南

## 學完你能做什麼

- ✅ 在正確的位置建立配置檔案
- ✅ 根據使用場景選擇合適的配置方案
- ✅ 理解所有配置選項的作用和預設值
- ✅ 使用環境變數臨時覆蓋配置
- ✅ 調整模型行為、帳戶輪換和外掛行為

## 你現在的困境

配置選項太多，不知道從哪裡開始？預設配置能用，但想進一步最佳化？多帳戶場景下不清楚應該用哪種輪換策略？

## 核心思路

配置檔案就像給外掛寫「使用說明書」——你告訴它怎麼工作，它就按你的方式執行。Antigravity Auth 外掛提供了豐富的配置選項，但大多數使用者只需要配置幾個核心選項。

### 配置檔案優先順序

配置項的優先順序從高到低：

1. **環境變數**（臨時覆蓋）
2. **專案級配置** `.opencode/antigravity.json`（當前專案）
3. **使用者級配置** `~/.config/opencode/antigravity.json`（全域）

::: info
環境變數優先順序最高，適合臨時測試。配置檔案適合持久化設定。
:::

### 配置檔案位置

根據作業系統，使用者級配置檔案位置不同：

| 系統 | 路徑 |
| --- | --- |
| Linux/macOS | `~/.config/opencode/antigravity.json` |
| Windows | `%APPDATA%\opencode\antigravity.json` |

專案級配置檔案始終在專案根目錄的 `.opencode/antigravity.json`。

### 配置選項分類

配置選項分為四大類：

1. **模型行為**：思考區塊、工作階段恢復、Google Search
2. **帳戶輪換**：多帳戶管理、選擇策略、PID 偏移
3. **應用行為**：除錯日誌、自動更新、通知靜默
4. **進階設定**：錯誤恢復、權杖管理、健康評分

---

## 🎒 開始前的準備

- [x] 已完成外掛安裝（參考[快速安裝](../../start/quick-install/)）
- [x] 已配置至少一個 Google 帳戶
- [x] 了解 JSON 基本語法

---

## 跟我做

### 第 1 步：建立配置檔案

**為什麼**：配置檔案讓外掛按你的需求工作

根據作業系統選擇對應路徑建立配置檔案：

::: code-group

```bash [macOS/Linux]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
EOF
```

```powershell [Windows]
## 使用 PowerShell
$env:APPDATA\opencode\antigravity.json = @{
  '$schema' = "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
} | ConvertTo-Json -Depth 10

Set-Content -Path "$env:APPDATA\opencode\antigravity.json" -Value $json
```

:::

**你應該看到**：檔案建立成功，內容只有 `$schema` 欄位。

::: tip
新增 `$schema` 欄位後，VS Code 會自動提供智慧提示和類型檢查。
:::

### 第 2 步：配置基礎選項

**為什麼**：根據你的使用場景最佳化外掛行為

根據你的配置選擇以下方案之一：

**場景 A：單帳戶 + 需要 Google Search**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**場景 B：2-3 個帳戶 + 智慧輪換**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**場景 C：多帳戶 + 並行代理**

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**你應該看到**：配置檔案儲存成功，OpenCode 自動重新載入外掛配置。

### 第 3 步：驗證配置

**為什麼**：確認配置生效

在 OpenCode 中發起一個模型請求，觀察：

1. 單帳戶使用 `sticky` 策略：所有請求使用同一帳戶
2. 多帳戶使用 `hybrid` 策略：請求會智慧分配到不同帳戶
3. Gemini 模型啟用 `web_search`：模型在需要時會搜尋網路

**你應該看到**：外掛行為符合你的配置預期。

---

## 配置選項詳解

### 模型行為

這些選項影響模型的思考和回應方式。

#### keep_thinking

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | - | 保留 Claude 思考區塊，跨輪次保持連貫性 |
| `false` | ✓ | 剝離思考區塊，更穩定，上下文更小 |

::: warning 注意
啟用 `keep_thinking` 可能導致模型穩定性下降和簽章錯誤。推薦保持 `false`。
:::

#### session_recovery

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | ✓ | 自動恢復工具呼叫中斷的工作階段 |
| `false` | - | 遇到錯誤時不自動恢復 |

#### auto_resume

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | - | 恢復後自動傳送 "continue" |
| `false` | ✓ | 恢復後只顯示提示，手動繼續 |

#### resume_text

自訂恢復時傳送的文字。預設為 `"continue"`，你可以改為任何文字。

#### web_search

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `default_mode` | `"off"` | `"auto"` 或 `"off"` |
| `grounding_threshold` | `0.3` | 搜尋閾值（0=總是搜尋，1=從不搜尋） |

::: info
`grounding_threshold` 僅在 `default_mode: "auto"` 時生效。值越大，模型搜尋越保守。
:::

---

### 帳戶輪換

這些選項管理多帳戶的請求分配。

#### account_selection_strategy

| 策略 | 預設值 | 適用場景 |
| --- | --- | --- |
| `sticky` | - | 單帳戶，保留 prompt cache |
| `round-robin` | - | 4+ 帳戶，最大化吞吐量 |
| `hybrid` | ✓ | 2-3 帳戶，智慧輪換 |

::: tip
不同帳戶數的推薦策略：
- 1 個帳戶 → `sticky`
- 2-3 個帳戶 → `hybrid`
- 4+ 個帳戶 → `round-robin`
- 並行代理 → `round-robin` + `pid_offset_enabled: true`
:::

#### switch_on_first_rate_limit

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | ✓ | 第一次遇到 429 立即切換帳戶 |
| `false` | - | 先重試當前帳戶，第二次 429 才切換 |

#### pid_offset_enabled

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | - | 不同工作階段（PID）使用不同起始帳戶 |
| `false` | ✓ | 所有工作階段從同一帳戶開始 |

::: tip
單工作階段使用保持 `false`，保留 Anthropic prompt cache。多工作階段並行建議啟用 `true`。
:::

#### quota_fallback

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | - | Gemini 模型配額池 fallback |
| `false` | ✓ | 不啟用 fallback |

::: info
僅適用於 Gemini 模型。當主配額池耗盡時，嘗試同一帳戶的備用配額池。
:::

---

### 應用行為

這些選項控制外掛本身的行為。

#### quiet_mode

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | - | 靜默大多數 toast 通知（恢復通知除外） |
| `false` | ✓ | 顯示所有通知 |

#### debug

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | - | 啟用除錯日誌 |
| `false` | ✓ | 不記錄除錯日誌 |

::: tip
臨時啟用除錯日誌無需修改配置檔案，使用環境變數：
```bash
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode   # 基礎日誌
OPENCODE_ANTIGRAVITY_DEBUG=2 opencode   # 詳細日誌
```
:::

#### log_dir

自訂除錯日誌目錄。預設為 `~/.config/opencode/antigravity-logs/`。

#### auto_update

| 值 | 預設值 | 說明 |
| --- | --- | --- |
| `true` | ✓ | 自動檢查並更新外掛 |
| `false` | - | 不自動更新 |

---

### 進階設定

這些選項用於邊緣場景，大多數使用者不需要修改。

<details>
<summary><strong>展開檢視進階設定</strong></summary>

#### 錯誤恢復

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `empty_response_max_attempts` | `4` | 空回應重試次數 |
| `empty_response_retry_delay_ms` | `2000` | 重試間隔（毫秒） |
| `tool_id_recovery` | `true` | 修復工具 ID 不匹配 |
| `claude_tool_hardening` | `true` | 防止工具參數幻覺 |
| `max_rate_limit_wait_seconds` | `300` | 限速最大等待時間（0=無限） |

#### 權杖管理

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `proactive_token_refresh` | `true` | 過期前主動重新整理權杖 |
| `proactive_refresh_buffer_seconds` | `1800` | 提前 30 分鐘重新整理 |
| `proactive_refresh_check_interval_seconds` | `300` | 重新整理檢查間隔（秒） |

#### 簽章快取（`keep_thinking: true` 時生效）

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `signature_cache.enabled` | `true` | 啟用磁碟快取 |
| `signature_cache.memory_ttl_seconds` | `3600` | 記憶體快取 TTL（1 小時） |
| `signature_cache.disk_ttl_seconds` | `172800` | 磁碟快取 TTL（48 小時） |
| `signature_cache.write_interval_seconds` | `60` | 背景寫入間隔（秒） |

#### 健康評分（`hybrid` 策略使用）

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `health_score.initial` | `70` | 初始健康分 |
| `health_score.success_reward` | `1` | 成功獎勵分數 |
| `health_score.rate_limit_penalty` | `-10` | 限速懲罰分數 |
| `health_score.failure_penalty` | `-20` | 失敗懲罰分數 |
| `health_score.recovery_rate_per_hour` | `2` | 每小時恢復分數 |
| `health_score.min_usable` | `50` | 可用帳戶最低分數 |
| `health_score.max_score` | `100` | 健康分上限 |

#### Token Bucket（`hybrid` 策略使用）

| 選項 | 預設值 | 說明 |
| --- | --- | --- |
| `token_bucket.max_tokens` | `50` | 桶最大容量 |
| `token_bucket.regeneration_rate_per_minute` | `6` | 每分鐘恢復速度 |
| `token_bucket.initial_tokens` | `50` | 初始權杖數 |

</details>

---

## 推薦配置方案

### 單帳戶配置

適合：只有一個 Google 帳戶的使用者

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**配置說明**：
- `sticky`：不輪換，保留 Anthropic prompt cache
- `web_search: auto`：Gemini 可根據需要搜尋

### 2-3 帳戶配置

適合：小團隊或需要一定彈性的使用者

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid",
  "web_search": {
    "default_mode": "auto"
  }
}
```

**配置說明**：
- `hybrid`：智慧輪換，健康評分選擇最佳帳戶
- `web_search: auto`：Gemini 可根據需要搜尋

### 多帳戶 + 並行代理配置

適合：執行多個並行代理的使用者

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "switch_on_first_rate_limit": true,
  "pid_offset_enabled": true,
  "web_search": {
    "default_mode": "auto"
  }
}
```

**配置說明**：
- `round-robin`：每次請求輪換帳戶
- `switch_on_first_rate_limit: true`：第一次 429 立即切換
- `pid_offset_enabled: true`：不同工作階段使用不同起始帳戶
- `web_search: auto`：Gemini 可根據需要搜尋

---

## 踩坑提醒

### ❌ 錯誤：修改配置後沒有生效

**原因**：OpenCode 可能沒有重新載入配置檔案。

**解決方法**：重新啟動 OpenCode 或檢查 JSON 語法是否正確。

### ❌ 錯誤：配置檔案 JSON 格式錯誤

**原因**：JSON 語法錯誤（缺少逗號、多餘的逗號、註解等）。

**解決方法**：使用 JSON 驗證工具檢查，或新增 `$schema` 欄位啟用 IDE 智慧提示。

### ❌ 錯誤：環境變數沒有生效

**原因**：環境變數名拼寫錯誤或沒有重新啟動 OpenCode。

**解決方法**：確認變數名為 `OPENCODE_ANTIGRAVITY_*`（全大寫，前綴正確），重新啟動 OpenCode。

### ❌ 錯誤：啟用 `keep_thinking: true` 後頻繁出錯

**原因**：思考區塊簽章不匹配。

**解決方法**：保持 `keep_thinking: false`（預設值），或調整 `signature_cache` 配置。

---

## 本課小結

配置檔案位置優先順序：環境變數 > 專案級 > 使用者級。

核心配置項：
- 模型行為：`keep_thinking`、`session_recovery`、`web_search`
- 帳戶輪換：`account_selection_strategy`、`pid_offset_enabled`
- 應用行為：`debug`、`quiet_mode`、`auto_update`

不同場景推薦配置：
- 單帳戶：`sticky`
- 2-3 帳戶：`hybrid`
- 4+ 帳戶：`round-robin`
- 並行代理：`round-robin` + `pid_offset_enabled: true`

---

## 下一課預告

> 下一課我們學習 **[除錯日誌](../debug-logging/)**。
>
> 你會學到：
> - 如何啟用除錯日誌
> - 如何解讀日誌內容
> - 如何排查常見問題

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 配置 Schema 定義 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 12-323 |
| 預設配置值 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 325-373 |
| 配置載入邏輯 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts) | 1-100 |

**關鍵常數**：
- `DEFAULT_CONFIG`: 所有配置項的預設值

**關鍵類型**：
- `AntigravityConfig`: 配置物件類型
- `AccountSelectionStrategy`: 帳戶選擇策略類型
- `SignatureCacheConfig`: 簽章快取配置類型

</details>
