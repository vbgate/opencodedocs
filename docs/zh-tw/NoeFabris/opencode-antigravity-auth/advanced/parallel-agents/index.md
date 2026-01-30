---
title: "PID 偏移：最佳化平行代理帳戶分配 | Antigravity Auth"
sidebarTitle: "多代理不搶號"
subtitle: "平行代理最佳化：PID 偏移與帳戶分配"
description: "學習 PID 偏移如何最佳化 oh-my-opencode 平行代理的帳戶分配。涵蓋設定方法、策略配合、效果驗證及問題排查。"
tags:
  - "advanced"
  - "parallel-agents"
  - "pid-offset"
  - "oh-my-opencode"
  - "load-balancing"
prerequisite:
  - "start-quick-install"
  - "start-first-auth-login"
  - "advanced-multi-account-setup"
order: 5
---

# 平行代理最佳化：PID 偏移與帳戶分配

**PID 偏移**是一種基於處理程序 ID 的帳戶分配最佳化機制，透過 `process.pid % accounts.length` 計算偏移量，讓多個 OpenCode 處理程序或 oh-my-opencode 平行代理優先選擇不同的 Google 帳戶。當多個處理程序同時執行時，每個處理程序根據自己 PID 的餘數自動選擇不同的起始帳戶，有效避免了多個處理程序同時擠在同一帳戶上導致的 429 速率限制錯誤，顯著提升了平行場景下的請求成功率和配額利用率，特別適合需要同時執行多個 Agent 或平行任務的開發者使用。

## 學完你能做什麼

- 理解平行代理場景下的帳戶衝突問題
- 啟用 PID 偏移功能，讓不同處理程序優先選擇不同帳戶
- 配合 round-robin 策略，最大化多帳戶利用率
- 排查平行代理中的速率限制和帳戶選擇問題

## 你現在的困境

使用 oh-my-opencode 或同時執行多個 OpenCode 實例時，你可能會遇到：

- 多個子代理同時使用同一個帳戶，頻繁遇到 429 速率限制
- 即使設定了多個帳戶，並發請求時仍然擠在同一帳戶上
- 不同處理程序啟動時都從第一個帳戶開始，導致帳戶分配不均勻
- 請求失敗後需要等待較長時間才能重試

## 什麼時候用這一招

PID 偏移功能適合以下場景：

| 場景 | 是否需要 PID 偏移 | 原因 |
| --- | --- | ---|
| 單個 OpenCode 實例 | ❌ 不需要 | 單處理程序，不會帳戶衝突 |
| 手動切換多個帳戶 | ❌ 不需要 | 非並發，sticky 策略即可 |
| oh-my-opencode 多 Agent | ✅ 推薦 | 多處理程序並發，需要分散帳戶 |
| 同時執行多個 OpenCode | ✅ 推薦 | 不同處理程序獨立 PID，自動分散 |
| CI/CD 平行任務 | ✅ 推薦 | 每個任務獨立處理程序，避免競爭 |

::: warning 前置檢查
開始本教學前，請確保你已經完成：
- ✅ 設定了至少 2 個 Google 帳戶
- ✅ 理解了帳戶選擇策略的工作原理
- ✅ 使用 oh-my-opencode 或需要平行執行多個 OpenCode 實例

[多帳戶設定教學](../multi-account-setup/) | [帳戶選擇策略教學](../account-selection-strategies/)
:::

## 核心思路

### 什麼是 PID 偏移？

**PID (Process ID)** 是作業系統分配給每個處理程序的唯一識別碼。當多個 OpenCode 處理程序同時執行時，每個處理程序都有不同的 PID。

**PID 偏移**是一種基於處理程序 ID 的帳戶分配最佳化：

```
假設有 3 個帳戶 (index: 0, 1, 2):

處理程序 A (PID=123):
  123 % 3 = 0 → 優先使用帳戶 0

處理程序 B (PID=456):
  456 % 3 = 1 → 優先使用帳戶 1

處理程序 C (PID=789):
  789 % 3 = 2 → 優先使用帳戶 2
```

每個處理程序根據自己 PID 的餘數，優先選擇不同的帳戶，避免一開始就擠在同一帳戶上。

### 為什麼需要 PID 偏移？

沒有 PID 偏移時，所有處理程序啟動時都會從帳戶 0 開始：

```
時間線:
T1: 處理程序 A 啟動 → 使用帳戶 0
T2: 處理程序 B 啟動 → 使用帳戶 0  ← 衝突！
T3: 處理程序 C 啟動 → 使用帳戶 0  ← 衝突！
```

啟用 PID 偏移後：

```
時間線:
T1: 處理程序 A 啟動 → PID 偏移 → 使用帳戶 0
T2: 處理程序 B 啟動 → PID 偏移 → 使用帳戶 1  ← 分散！
T3: 處理程序 C 啟動 → PID 偏移 → 使用帳戶 2  ← 分散！
```

### 與帳戶選擇策略的配合

PID 偏移只在 sticky 策略的 fallback 階段生效（round-robin 和 hybrid 策略有自己的分配邏輯）：

| 策略 | PID 偏移是否生效 | 推薦場景 |
| --- | --- | ---|
| `sticky` | ✅ 生效 | 單處理程序 + prompt cache 優先 |
| `round-robin` | ❌ 不生效 | 多處理程序 / 平行代理，最大吞吐 |
| `hybrid` | ❌ 不生效 | 智慧分配，健康評分優先 |

**為什麼 round-robin 不需要 PID 偏移？**

round-robin 策略本身就會輪換帳戶：

```typescript
// 每次請求都切換到下一個帳戶
this.cursor++;
const account = available[this.cursor % available.length];
```

多個處理程序會自然地分散在不同帳戶上，不需要額外的 PID 偏移。

::: tip 最佳實踐
對於平行代理場景，推薦設定：

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false  // round-robin 不需要
}
```

如果必須使用 sticky 或 hybrid 策略，再啟用 PID 偏移。
:::

## 跟我做

### 第 1 步：確認多帳戶設定

**為什麼**
PID 偏移至少需要 2 個帳戶才能發揮作用。如果只有 1 個帳戶，無論 PID 餘數是什麼，都只能使用這個帳戶。

**操作**

檢查當前帳戶數量：

```bash
opencode auth list
```

你應該看到至少 2 個帳戶：

```
2 account(s) saved:
  1. user1@gmail.com
  2. user2@gmail.com
```

如果只有 1 個帳戶，先新增更多帳戶：

```bash
opencode auth login
```

按照提示選擇 `(a)dd new account(s)`。

**你應該看到**: 帳戶列表顯示 2 個或更多帳戶。

### 第 2 步：設定 PID 偏移

**為什麼**
透過設定檔啟用 PID 偏移功能，讓外掛在帳戶選擇時考慮處理程序 ID。

**操作**

開啟 OpenCode 設定檔：

- **macOS/Linux**: `~/.config/opencode/antigravity.json`
- **Windows**: `%APPDATA%\opencode\antigravity.json`

新增或修改以下設定：

```json
{
  "pid_offset_enabled": true
}
```

完整設定範例（配合 sticky 策略）：

```json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "sticky"
}
```

**環境變數方式**（可選）：

```bash
export OPENCODE_ANTIGRAVITY_PID_OFFSET_ENABLED=1
```

**你應該看到**: 設定檔中 `pid_offset_enabled` 設定為 `true`。

### 第 3 步：驗證 PID 偏移效果

**為什麼**
透過實際執行多個處理程序，驗證 PID 偏移是否生效，不同處理程序是否優先使用不同帳戶。

**操作**

開啟兩個終端機視窗，分別執行 OpenCode：

**終端機 1**：
```bash
opencode chat
# 發送一個請求，記錄使用的帳戶（查看日誌或 toast）
```

**終端機 2**：
```bash
opencode chat
# 發送一個請求，記錄使用的帳戶
```

觀察帳戶選擇行為：

- ✅ **期望**: 兩個終端機優先使用不同的帳戶
- ❌ **問題**: 兩個終端機都使用同一個帳戶

如果問題持續，檢查：

1. 設定是否正確載入
2. 帳戶選擇策略是否為 `sticky`（round-robin 不需要 PID 偏移）
3. 是否只有 1 個帳戶

啟用除錯日誌查看詳細帳戶選擇過程：

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=1
opencode chat
```

日誌中會顯示：

```
[accounts] Applying PID offset: 1 (process.pid % accounts.length)
[accounts] Starting account index for 'claude': 1
```

**你應該看到**: 不同終端機優先使用不同的帳戶，或日誌中顯示 PID 偏移已應用。

### 第 4 步：（可選）配合 round-robin 策略

**為什麼**
round-robin 策略本身會輪換帳戶，不需要 PID 偏移。但對於高頻並行的平行代理，round-robin 是更好的選擇。

**操作**

修改設定檔：

```json
{
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": false
}
```

啟動多個 oh-my-opencode Agent，觀察請求分布：

```
Agent 1 → 帳戶 0 → 帳戶 1 → 帳戶 2 → 帳戶 0 ...
Agent 2 → 帳戶 1 → 帳戶 2 → 帳戶 0 → 帳戶 1 ...
```

每個 Agent 都獨立輪換，充分利用所有帳戶的配額。

**你應該看到**: 請求均勻分布在所有帳戶上，每個 Agent 都獨立輪換。

## 檢查點 ✅

完成以上步驟後，你應該能夠：

- [ ] 成功設定至少 2 個 Google 帳戶
- [ ] 在 `antigravity.json` 中啟用 `pid_offset_enabled`
- [ ] 執行多個 OpenCode 實例時，不同處理程序優先使用不同帳戶
- [ ] 理解 round-robin 不需要 PID 偏移的原因
- [ ] 使用除錯日誌查看帳戶選擇過程

## 踩坑提醒

### 問題 1：啟用後沒有效果

**症狀**：設定了 `pid_offset_enabled: true`，但多個處理程序仍然使用同一個帳戶。

**原因**：可能是帳戶選擇策略為 `round-robin` 或 `hybrid`，這兩種策略不使用 PID 偏移。

**解決**：切換到 `sticky` 策略，或理解目前策略不需要 PID 偏移。

```json
{
  "account_selection_strategy": "sticky",  // 改為 sticky
  "pid_offset_enabled": true
}
```

### 問題 2：只有 1 個帳戶

**症狀**：啟用 PID 偏移後，所有處理程序仍然使用帳戶 0。

**原因**：PID 偏移透過 `process.pid % accounts.length` 計算，只有 1 個帳戶時，餘數永遠是 0。

**解決**：新增更多帳戶：

```bash
opencode auth login
# 選擇 (a)dd new account(s)
```

### 問題 3：Prompt cache 失效

**症狀**：啟用 PID 偏移後，發現 Anthropic 的 prompt cache 不再生效。

**原因**：PID 偏移可能導致不同處理程序或會話使用不同帳戶，而 prompt cache 是按帳戶共享的。切換帳戶後，需要重新發送提示詞。

**解決**：這是預期行為。如果 prompt cache 優先級更高，停用 PID 偏移，使用 sticky 策略：

```json
{
  "pid_offset_enabled": false,
  "account_selection_strategy": "sticky"
}
```

### 問題 4：oh-my-opencode 多 Agent 衝突

**症狀**：即使設定了多帳戶，oh-my-opencode 的多個 Agent 仍然頻繁遇到 429 錯誤。

**原因**：oh-my-opencode 可能按順序啟動 Agent，短時間內多個 Agent 同時請求同一帳戶。

**解決**：

1. 使用 `round-robin` 策略（推薦）：

```json
{
  "account_selection_strategy": "round-robin"
}
```

2. 或增加帳戶數量，確保每個 Agent 都有獨立帳戶：

```bash
# 如果有 3 個 Agent，建議至少 5 個帳戶
opencode auth login
```

## 本課小結

PID 偏移功能透過處理程序 ID (PID) 來最佳化多處理程序場景下的帳戶分配：

- **原理**：`process.pid % accounts.length` 計算偏移量
- **作用**：讓不同處理程序優先選擇不同帳戶，避免衝突
- **限制**：只在 sticky 策略下生效，round-robin 和 hybrid 不需要
- **最佳實踐**：平行代理場景推薦 round-robin 策略，無需 PID 偏移

設定多帳戶後，根據你的使用場景選擇合適的策略：

| 場景 | 推薦策略 | PID 偏移 |
| --- | --- | ---|
| 單處理程序，prompt cache 優先 | sticky | 否 |
| 多處理程序 / 平行代理 | round-robin | 否 |
| hybrid 策略 + 分散啟動 | hybrid | 可選 |

## 下一課預告

> 下一課我們學習 **[設定選項完整指南](../configuration-guide/)**。
>
> 你會學到：
> - 設定檔的位置和優先級
> - 模型行為、帳戶輪替和應用行為的設定選項
> - 不同場景下的推薦設定方案
> - 進階設定調校方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| PID 偏移實作 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L388-L393) | 388-393 |
| 設定 Schema 定義 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L244-L255) | 244-255 |
| 環境變數支援 | [`src/plugin/config/loader.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/loader.ts#L163-L168) | 163-168 |
| 設定傳入位置 | [`src/plugin.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin.ts#L902) | 902 |
| 使用文件 | [`docs/MULTI-ACCOUNT.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MULTI-ACCOUNT.md#L111-L125) | 111-125 |
| 設定指南 | [`docs/CONFIGURATION.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/CONFIGURATION.md#L69) | 69 |

**關鍵函式**：
- `getCurrentOrNextForFamily()`: 帳戶選擇主函式，內部處理 PID 偏移邏輯
- `process.pid % this.accounts.length`: 計算偏移量的核心公式

**關鍵常數**：
- `sessionOffsetApplied[family]`: 每個模型族的偏移應用標記（每會話只應用一次）

</details>
