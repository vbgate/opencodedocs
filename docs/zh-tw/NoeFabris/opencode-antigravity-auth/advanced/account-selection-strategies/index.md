---
title: "帳戶選擇策略: 多帳戶輪替配置 | Antigravity Auth"
sidebarTitle: "選對策略不浪費配額"
subtitle: "帳戶選擇策略：sticky、round-robin、hybrid 最佳實踐"
description: "學習 sticky、round-robin、hybrid 三種帳戶選擇策略。根據帳戶數量選擇最佳配置，優化配額利用率和請求分佈，避免被限速。"
tags:
  - "多帳戶"
  - "負載平衡"
  - "配置"
  - "進階"
prerequisite:
  - "advanced-multi-account-setup"
order: 1
---

# 帳戶選擇策略：sticky、round-robin、hybrid 最佳實踐

## 學完你能做什麼

根據你的 Google 帳戶數量和使用場景，選擇並配置合適的帳戶選擇策略：
- 1 個帳戶 → 用 `sticky` 策略保留 prompt 快取
- 2-3 個帳戶 → 用 `hybrid` 策略智慧分佈請求
- 4+ 個帳戶 → 用 `round-robin` 策略最大化吞吐量

避免"所有帳戶都被限速，但實際配額沒用完"的尷尬。

## 你現在的困境

配置了多個 Google 帳戶，但：
- 不確定該用哪種策略才能最大化配額利用率
- 經常遇到所有帳戶都被限速，但某個帳戶的配額還沒用完
- 並行代理場景下，多個子程序總是用同一個帳戶，導致限速

## 核心思路

### 什麼是帳戶選擇策略

Antigravity Auth 插件支援三種帳戶選擇策略，決定如何在多個 Google 帳戶之間分配模型請求：

| 策略 | 行為 | 適用場景 |
| --- | --- | ---|
| `sticky` | 除非當前帳戶被限速，否則一直用同一個帳戶 | 單帳戶、需要 prompt 快取 |
| `round-robin` | 每次請求輪替到下一個可用帳戶 | 多帳戶、最大化吞吐量 |
| `hybrid`（預設） | 結合健康評分 + Token bucket + LRU 智慧選擇 | 2-3 個帳戶、平衡效能與穩定性 |

::: info 為什麼需要策略？
Google 對每個帳戶都有速率限制。如果只有一個帳戶，頻繁請求很容易被限速。多帳戶可以通過輪替或智慧選擇，分散請求，避免單個帳戶過度消耗配額。
:::

### 三種策略的工作原理

#### 1. Sticky 策略（黏性）

**核心邏輯**：保持當前帳戶，直到它被限速才切換。

**優點**：
- 保留 prompt 快取，相同上下文響應更快
- 帳戶使用模式穩定，不容易觸發風控

**缺點**：
- 多帳戶配額利用不均衡
- 限速恢復前無法使用其他帳戶

**適用場景**：
- 只有一個帳戶
- 重視 prompt 快取（如長期對話）

#### 2. Round-Robin 策略（輪詢）

**核心邏輯**：每次請求輪替到下一個可用帳戶，循環使用。

**優點**：
- 配額利用最均衡
- 最大化並行吞吐量
- 適合高併發場景

**缺點**：
- 不考慮帳戶健康狀況，可能選擇剛從限速恢復的帳戶
- 無法利用 prompt 快取

**適用場景**：
- 4 個或更多帳戶
- 需要最大吞吐量的批次任務
- 並行代理場景（配合 `pid_offset_enabled`）

#### 3. Hybrid 策略（混合，預設）

**核心邏輯**：綜合考慮三個因素，選擇最優帳戶：

**評分公式**：
```
總分 = 健康分 × 2 + Token 分 × 5 + 新鮮度分 × 0.1
```

- **健康分**（0-200）：基於帳戶的成功/失敗歷史
  - 成功請求：+1 分
  - 速率限制：-10 分
  - 其他失敗（認證、網路）：-20 分
  - 初始值：70 分，最低 0 分，最高 100 分
  - 每小時恢復 2 分（即使不使用）

- **Token 分**（0-500）：基於 Token bucket 演算法
  - 每個帳戶最大 50 token，初始 50 token
  - 每分鐘恢復 6 token
  - 每次請求消耗 1 token
  - Token 分 = (當前 token / 50) × 100 × 5

- **新鮮度分**（0-360）：基於距離上次使用的時間
  - 距離上次使用時間越長，分數越高
  - 最多 3600 秒（1 小時）後達到最大值

**優點**：
- 智慧避開健康度低的帳戶
- Token bucket 避免密集請求導致的限速
- LRU（最久未使用優先）讓帳戶有充分休息時間
- 綜合考慮效能與穩定性

**缺點**：
- 演算法較複雜，不如 round-robin 直觀
- 2 個帳戶時效果不明顯

**適用場景**：
- 2-3 個帳戶（預設策略）
- 需要平衡配額利用率和穩定性

### 策略選擇速查表

根據 README 和 CONFIGURATION.md 的推薦：

| 你的設置 | 推薦策略 | 原因 |
|--- | --- | ---|
| **1 個帳戶** | `sticky` | 無需輪替，保留 prompt 快取 |
| **2-3 個帳戶** | `hybrid`（預設） | 智慧輪替，避免過度限速 |
| **4+ 個帳戶** | `round-robin` | 最大化吞吐量，配額利用最均衡 |
| **並行代理** | `round-robin` + `pid_offset_enabled: true` | 不同程序使用不同帳戶 |

## 🎒 開始前的準備

::: warning 前置檢查
確保你已完成：
- [x] 多帳戶設置（至少 2 個 Google 帳戶）
- [x] 理解 [雙配額系統](/zh-tw/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)
:::

## 跟我做

### 第 1 步：檢查當前配置

**為什麼**
先了解當前的配置狀態，避免重複修改。

**操作**

檢查你的插件配置文件：

```bash
cat ~/.config/opencode/antigravity.json
```

**你應該看到**：
```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json"
}
```

如果檔案不存在，插件使用預設配置（`account_selection_strategy` = `"hybrid"`）。

### 第 2 步：根據帳戶數量配置策略

**為什麼**
不同帳戶數量適合不同策略，選擇錯誤的策略可能導致配額浪費或頻繁限速。

::: code-group

```bash [1 個帳戶 - Sticky 策略]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "sticky"
}
EOF
```

```bash [2-3 個帳戶 - Hybrid 策略（預設）]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "hybrid"
}
EOF
```

```bash [4+ 個帳戶 - Round-Robin 策略]
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin"
}
EOF
```

:::

**你應該看到**：配置文件已更新為對應的策略。

### 第 3 步：啟用 PID 偏移（並行代理場景）

**為什麼**
如果你使用 oh-my-opencode 等插件生成並行代理，多個子程序可能同時發起請求。預設情況下，它們會從同一個起始帳戶開始選擇，導致帳戶競爭和限速。

**操作**

修改配置，添加 PID 偏移：

```bash
cat > ~/.config/opencode/antigravity.json << 'EOF'
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "account_selection_strategy": "round-robin",
  "pid_offset_enabled": true
}
EOF
```

**你應該看到**：`pid_offset_enabled` 設置為 `true`。

**工作原理**：
- 每個程序根據其 PID（程序 ID）計算偏移量
- 偏移量 = `PID % 帳戶數`
- 不同程序會優先使用不同的起始帳戶
- 範例：3 個帳戶，PID 100、101、102 的程序分別使用帳戶 1、2、0

### 第 4 步：驗證策略生效

**為什麼**
確認配置正確，策略按預期工作。

**操作**

發起多個併發請求，觀察帳戶切換：

```bash
# 開啟偵錯日誌
export OPENCODE_ANTIGRAVITY_DEBUG=1

# 發起 5 個請求
for i in {1..5}; do
  opencode run "Test $i" --model=google/antigravity-gemini-3-pro &
done
wait
```

**你應該看到**：
- 日誌中顯示不同請求使用不同帳戶
- `account-switch` 事件記錄帳戶切換

範例日誌（round-robin 策略）：
```
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
[DEBUG] Selected account: user3@gmail.com (index: 2) - reason: rotation
[DEBUG] Selected account: user1@gmail.com (index: 0) - reason: rotation
[DEBUG] Selected account: user2@gmail.com (index: 1) - reason: rotation
```

### 第 5 步：監控帳戶健康狀態（Hybrid 策略）

**為什麼**
Hybrid 策略基於健康評分選擇帳戶，了解健康狀態有助於判斷配置是否合理。

**操作**

查看偵錯日誌中的健康評分：

```bash
export OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "Hello" --model=google/antigravity-gemini-3-pro
```

**你應該看到**：
```
[VERBOSE] Health scores: {
  "0": { "score": 85, "consecutiveFailures": 0 },
  "1": { "score": 60, "consecutiveFailures": 2 },
  "2": { "score": 70, "consecutiveFailures": 0 }
}
[DEBUG] Selected account: user1@gmail.com (index: 0) - hybrid score: 270.2
```

**解讀**：
- 帳戶 0：健康分 85（優秀）
- 帳戶 1：健康分 60（可用，但有 2 次連續失敗）
- 帳戶 2：健康分 70（良好）
- 最終選擇帳戶 0，綜合評分 270.2

## 檢查點 ✅

::: tip 如何驗證配置生效？
1. 查看配置文件確認 `account_selection_strategy` 值
2. 發起多個請求，觀察日誌中的帳戶切換行為
3. Hybrid 策略：健康評分低的帳戶被選擇頻率應更低
4. Round-robin 策略：帳戶應循環使用，無明顯偏好
:::

## 踩坑提醒

### ❌ 帳戶數量與策略不匹配

**錯誤行為**：
- 只有 2 個帳戶卻使用 round-robin，導致頻繁切換
- 有 5 個帳戶卻用 sticky，配額利用不均衡

**正確做法**：按照速查表選擇策略。

### ❌ 並行代理未啟用 PID 偏移

**錯誤行為**：
- 多個並行代理同時使用同一個帳戶
- 導致帳戶被快速限速

**正確做法**：設置 `pid_offset_enabled: true`。

### ❌ 忽略健康評分（Hybrid 策略）

**錯誤行為**：
- 某個帳戶頻繁限速，但仍被高頻使用
- 沒有利用健康評分避開問題帳戶

**正確做法**：定期檢查偵錯日誌中的健康評分，如有異常（如某帳戶連續失敗次數 > 5），考慮移除該帳戶或切換策略。

### ❌ 混用雙配額池和單配額策略

**錯誤行為**：
- Gemini 模型使用 `:antigravity` 後綴強制使用 Antigravity 配額池
- 同時配置了 `quota_fallback: false`
- 導致某個配額池用完後，無法 fallback 到另一個池

**正確做法**：理解 [雙配額系統](/zh-tw/NoeFabris/opencode-antigravity-auth/platforms/dual-quota-system/)，根據需求配置 `quota_fallback`。

## 本課小結

| 策略 | 核心特點 | 適用場景 |
|--- | --- | ---|
| `sticky` | 保持帳戶直到限速 | 1 個帳戶、需要 prompt 快取 |
| `round-robin` | 循環輪替帳戶 | 4+ 個帳戶、最大化吞吐量 |
| `hybrid` | 健康 + Token + LRU 智慧選擇 | 2-3 個帳戶、平衡效能與穩定性 |

**關鍵配置**：
- `account_selection_strategy`：設置策略（`sticky` / `round-robin` / `hybrid`）
- `pid_offset_enabled`：並行代理場景啟用（`true`）
- `quota_fallback`：Gemini 雙配額池 fallback（`true` / `false`）

**驗證方法**：
- 開啟偵錯日誌：`OPENCODE_ANTIGRAVITY_DEBUG=1`
- 查看帳戶切換日誌和健康評分
- 觀察不同請求使用的帳戶索引

## 下一課預告

> 下一課我們學習 **[速率限制處理](/zh-tw/NoeFabris/opencode-antigravity-auth/advanced/rate-limit-handling/)**。
>
> 你會學到：
> - 如何理解不同類型的 429 錯誤（配額耗盡、速率限制、容量耗盡）
> - 自動重試和退避演算法的工作原理
> - 何時切換帳戶，何時等待重置

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 帳戶選擇策略入口 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L340-L412) | 340-412 |
| Sticky 策略實作 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L395-L411) | 395-411 |
|--- | --- | ---|
| Hybrid 策略實作 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L358-L383) | 358-383 |
| 健康評分系統 | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L14-L163) | 14-163 |
| Token bucket 系統 | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L290-L402) | 290-402 |
| LRU 選擇演算法 | [`src/plugin/rotation.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/rotation.ts#L215-L288) | 215-288 |
| PID 偏移邏輯 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts#L387-L393) | 387-393 |
| 配置 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 見檔案 |

**關鍵常數**：
- `DEFAULT_HEALTH_SCORE_CONFIG.initial = 70`：新帳戶初始健康分
- `DEFAULT_HEALTH_SCORE_CONFIG.minUsable = 50`：帳戶最小可用健康分
- `DEFAULT_TOKEN_BUCKET_CONFIG.maxTokens = 50`：每個帳戶最大 token 數
- `DEFAULT_TOKEN_BUCKET_CONFIG.regenerationRatePerMinute = 6`：每分鐘恢復 token 數

**關鍵函式**：
- `getCurrentOrNextForFamily()`：根據策略選擇帳戶
- `selectHybridAccount()`：Hybrid 策略評分選擇演算法
- `getScore()`：獲取帳戶健康分（含時間恢復）
- `hasTokens()` / `consume()`：Token bucket 檢查和消費
- `sortByLruWithHealth()`：LRU + 健康分排序

</details>
