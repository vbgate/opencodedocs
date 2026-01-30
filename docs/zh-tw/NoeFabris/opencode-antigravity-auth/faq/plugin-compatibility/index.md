---
title: "外掛相容性：解決常見外掛衝突 | Antigravity Auth"
sidebarTitle: "外掛衝突怎麼辦"
subtitle: "解決與其他外掛的相容性問題"
description: "學習如何解決 Antigravity Auth 與 oh-my-opencode、DCP 等外掛的相容性問題。設定正確的外掛順序，停用衝突的認證方式。"
tags:
  - "FAQ"
  - "外掛設定"
  - "oh-my-opencode"
  - "DCP"
  - "OpenCode"
  - "Antigravity"
prerequisite:
  - "start-quick-install"
order: 4
---

# 解決與其他外掛的相容性問題

**外掛相容性**是使用 Antigravity Auth 時常見的問題。不同的外掛可能會相互衝突，導致認證失敗、thinking blocks 遺失或請求格式錯誤。本教學幫你解決與 oh-my-opencode、DCP 等外掛的相容性問題。

## 學完你能做什麼

- 正確設定外掛載入順序，避免 DCP 的問題
- 在 oh-my-opencode 中停用衝突的認證方式
- 辨識並移除不必要的外掛
- 為平行代理場景啟用 PID 偏移

## 常見相容性問題

### 問題 1：與 oh-my-opencode 衝突

**現象**：
- 認證失敗或重複彈出 OAuth 授權視窗
- 模型請求回傳 400 或 401 錯誤
- Agent 模型設定不生效

**原因**：oh-my-opencode 預設啟用了內建的 Google 認證，與 Antigravity Auth 的 OAuth 流程衝突。

::: warning 核心問題
oh-my-opencode 會攔截所有 Google 模型請求，並使用自己的認證方式。這會導致 Antigravity Auth 的 OAuth 權杖無法使用。
:::

**解決方案**：

編輯 `~/.config/opencode/oh-my-opencode.json`，加入以下設定：

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

**設定說明**：

| 設定項目 | 值 | 說明 |
| --- | --- | ---|
| `google_auth` | `false` | 停用 oh-my-opencode 的內建 Google 認證 |
| `agents.<agent-name>.model` | `google/antigravity-*` | 覆寫 Agent 模型為 Antigravity 模型 |

**檢查點 ✅**：

- 儲存設定後重啟 OpenCode
- 測試 Agent 是否使用 Antigravity 模型
- 檢查是否不再彈出 OAuth 授權視窗

---

### 問題 2：與 DCP（@tarquinen/opencode-dcp）衝突

**現象**：
- Claude Thinking 模型回傳錯誤：`thinking must be first block in message`
- 對話歷史中缺少 thinking blocks
- 思考內容無法顯示

**原因**：DCP 建立的 synthetic assistant messages（合成助手訊息）缺少 thinking blocks，這與 Claude API 的要求衝突。

::: info 什麼是 synthetic messages？
Synthetic messages 是由外掛或系統自動產生的訊息，用於修復對話歷史或補全缺少的訊息。DCP 在某些場景下會建立這些訊息，但不會加入 thinking blocks。
:::

**解決方案**：

確保 Antigravity Auth 在 DCP **之前**載入。編輯 `~/.config/opencode/config.json`：

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

**為什麼需要這個順序**：

- Antigravity Auth 會處理和修復 thinking blocks
- DCP 會建立 synthetic messages（可能缺少 thinking blocks）
- 如果 DCP 先載入，Antigravity Auth 無法修復 DCP 建立的訊息

**檢查點 ✅**：

- 檢查 `opencode-antigravity-auth` 是否在 `@tarquinen/opencode-dcp` 之前
- 重啟 OpenCode
- 測試 Thinking 模型是否正常顯示思考內容

---

### 問題 3：平行代理場景下的帳戶分配

**現象**：
- 多個平行代理使用同一個帳戶
- 遇到速率限制時所有代理同時失敗
- 配額利用率低

**原因**：預設情況下，多個平行代理會共用同一個帳戶選擇邏輯，導致它們可能同時使用同一個帳戶。

::: tip 平行代理場景
當你使用 Cursor 的平行功能（如同時執行多個 Agent）時，每個 Agent 會獨立發起模型請求。如果沒有正確的帳戶分配，它們可能會「撞車」。
:::

**解決方案**：

編輯 `~/.config/opencode/antigravity.json`，啟用 PID 偏移：

```json
{
  "pid_offset_enabled": true
}
```

**什麼是 PID 偏移？**

PID（Process ID）偏移讓每個平行代理使用不同的帳戶起始索引：

```
代理 1 (PID 100) → 帳戶 0
代理 2 (PID 101) → 帳戶 1
代理 3 (PID 102) → 帳戶 2
```

這樣即使同時發起請求，也不會使用同一個帳戶。

**前提條件**：
- 需要至少 2 個 Google 帳戶
- 建議啟用 `account_selection_strategy: "round-robin"` 或 `"hybrid"`

**檢查點 ✅**：

- 確認已設定多個帳戶（執行 `opencode auth list`）
- 啟用 `pid_offset_enabled: true`
- 測試平行代理是否使用不同帳戶（檢視偵錯日誌）

---

### 問題 4：不需要的外掛

**現象**：
- 認證衝突或重複認證
- 外掛載入失敗或警告訊息
- 設定混亂，不知道哪些外掛在生效

**原因**：安裝了功能重疊的外掛。

::: tip 冗餘外掛檢查
定期檢查 `config.json` 中的 plugin 列表，移除不需要的外掛可以避免衝突和效能問題。
:::

**不需要的外掛**：

| 外掛類型 | 範例 | 原因 |
| --- | --- | ---|
| **gemini-auth 外掛** | `opencode-gemini-auth`、`@username/gemini-auth` | Antigravity Auth 已處理所有 Google OAuth |
| **Claude 認證外掛** | `opencode-claude-auth` | Antigravity Auth 不使用 Claude 認證 |

**解決方案**：

從 `~/.config/opencode/config.json` 中移除這些外掛：

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest"
    // 移除這些：
    // "opencode-gemini-auth@latest",
    // "@username/gemini-auth@latest"
  ]
}
```

**檢查點 ✅**：

- 檢視 `~/.config/opencode/config.json` 中的 plugin 列表
- 移除所有 gemini-auth 相關外掛
- 重啟 OpenCode，確認沒有認證衝突

---

## 常見錯誤排查

### 錯誤 1：`thinking must be first block in message`

**可能原因**：
- DCP 在 Antigravity Auth 之前載入
- oh-my-opencode 的 session recovery 與 Antigravity Auth 衝突

**排查步驟**：

1. 檢查外掛載入順序：
   ```bash
   grep -A 10 '"plugin"' ~/.config/opencode/config.json
   ```

2. 確保 Antigravity Auth 在 DCP 之前

3. 如果問題仍然存在，嘗試停用 oh-my-opencode 的 session recovery（如果存在）

### 錯誤 2：`invalid_grant` 或認證失敗

**可能原因**：
- oh-my-opencode 的 `google_auth` 未停用
- 多個認證外掛同時嘗試處理請求

**排查步驟**：

1. 檢查 oh-my-opencode 設定：
   ```bash
   cat ~/.config/opencode/oh-my-opencode.json | grep google_auth
   ```

2. 確保值為 `false`

3. 移除其他 gemini-auth 外掛

### 錯誤 3：平行代理都使用同一個帳戶

**可能原因**：
- `pid_offset_enabled` 未啟用
- 帳戶數量少於代理數量

**排查步驟**：

1. 檢查 Antigravity 設定：
   ```bash
   cat ~/.config/opencode/antigravity.json | grep pid_offset
   ```

2. 確保值為 `true`

3. 檢查帳戶數量：
   ```bash
   opencode auth list
   ```

4. 如果帳戶少於代理數量，建議加入更多帳戶

---

## 設定範例

### 完整的設定範例（包含 oh-my-opencode）

```json
// ~/.config/opencode/config.json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest",
    "oh-my-opencode@latest"
  ]
}
```

```json
// ~/.config/opencode/antigravity.json
{
  "pid_offset_enabled": true,
  "account_selection_strategy": "hybrid"
}
```

```json
// ~/.config/opencode/oh-my-opencode.json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" },
    "multimodal-looker": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

---

## 本課小結

外掛相容性問題通常源於認證衝突、外掛載入順序或功能重疊。透過正確設定：

- ✅ 停用 oh-my-opencode 的內建 Google 認證（`google_auth: false`）
- ✅ 確保 Antigravity Auth 在 DCP 之前載入
- ✅ 為平行代理啟用 PID 偏移（`pid_offset_enabled: true`）
- ✅ 移除冗餘的 gemini-auth 外掛

這些設定可以避免大多數相容性問題，讓你的 OpenCode 環境穩定執行。

## 下一課預告

> 下一課我們學習 **[遷移指南](../migration-guide/)**。
>
> 你會學到：
> - 在不同機器間遷移帳戶設定
> - 處理版本升級時的設定變更
> - 備份和恢復帳戶資料

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| Thinking blocks 處理 | [`src/plugin/request-helpers.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request-helpers.ts#L898-L930) | 898-930 |
| 思考區塊簽名快取 | [`src/plugin/cache/signature-cache.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/cache/signature-cache.ts) | 全檔案 |
| PID 偏移設定 | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts#L69-L72) | 69-72 |
| Session recovery（基於 oh-my-opencode） | [`src/plugin/recovery/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/recovery/index.ts) | 全檔案 |

**關鍵設定**：
- `pid_offset_enabled: true`：啟用處理程序 ID 偏移，為平行代理分配不同帳戶
- `account_selection_strategy: "hybrid"`：智慧混合帳戶選擇策略

**關鍵函數**：
- `deepFilterThinkingBlocks()`：移除所有 thinking blocks（request-helpers.ts:898）
- `filterThinkingBlocksWithSignatureCache()`：根據簽名快取過濾 thinking blocks（request-helpers.ts:1183）

</details>
