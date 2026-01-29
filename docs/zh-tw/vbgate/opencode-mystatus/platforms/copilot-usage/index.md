---
title: "Copilot 額度: Premium Requests 查詢 | opencode-mystatus"
sidebarTitle: "Copilot 額度"
subtitle: "GitHub Copilot 額度查詢：Premium Requests 和模型明細"
description: "學習查詢 GitHub Copilot 的 Premium Requests 使用情況。瞭解訂閱類型限額，查看模型明細，支援 OAuth Token 和 Fine-grained PAT 認證。"
tags:
  - "github-copilot"
  - "quota"
  - "premium-requests"
  - "pat-authentication"
prerequisite:
  - "start-quick-start"
order: 3
---

# GitHub Copilot 額度查詢：Premium Requests 和模型明細

## 學完你能做什麼

- 快速查看 GitHub Copilot 的 Premium Requests 月度使用情況
- 瞭解不同訂閱類型（Free / Pro / Pro+ / Business / Enterprise）的限額差異
- 查看模型使用明細（如 GPT-4、Claude 等的使用次數）
- 識別超額使用次數，預估額外費用
- 解決新 OpenCode 整合的權限問題（OAuth Token 無法查詢配額）

## 你現在的困境

::: info 新 OpenCode 整合的權限問題

OpenCode 的最新 OAuth 整合不再授予存取 `/copilot_internal/*` API 的權限，導致原有的 OAuth Token 方式無法查詢配額。

你可能遇到這樣的錯誤：
```
⚠️ GitHub Copilot 配額查詢暫時無法使用。
OpenCode 的新 OAuth 整合不支援存取配額 API。

解決方案:
1. 建立一個 fine-grained PAT (存取 https://github.com/settings/tokens?type=beta)
2. 在 'Account permissions' 中將 'Plan' 設為 'Read-only'
...
```

這是正常的，本教學會教你如何解決。

:::

## 核心思路

GitHub Copilot 的配額分為以下幾個核心概念：

### Premium Requests（主要配額）

Premium Requests 是 Copilot 的主要配額指標，包含：
- Chat 互動（與 AI 助手對話）
- Code Completion（程式碼補全）
- Copilot Workspace 功能（工作空間協作）

::: tip 什麼是 Premium Requests？

簡單理解：每次 Copilot 幫你"幹活"（生成程式碼、回答問題、分析程式碼）都算一次 Premium Request。這是 Copilot 的主要計費單位。

:::

### 訂閱類型與限額

不同訂閱類型有不同的月度限額：

| 訂閱類型    | 月度限額 | 適用人群               |
|--- | --- | ---|
| Free        | 50 次    | 個人開發者試用         |
| Pro         | 300 次   | 個人開發者正式版       |
| Pro+        | 1,500 次 | 重度個別開發者         |
| Business    | 300 次   | 團隊訂閱（每帳號 300） |
| Enterprise  | 1,000 次 | 企業級訂閱（每帳號 1000）|

### 超額使用

如果你超過了月度限額，Copilot 仍然可以使用，但會產生額外費用。超額使用次數會在輸出中單獨顯示。

## 🎒 開始前的準備

### 前置條件

::: warning 設定檢查

本教學假設你已經：

1. ✅ **安裝了 opencode-mystatus 外掛**
   - 參見 [快速開始](/zh-tw/vbgate/opencode-mystatus/start/quick-start/)

2. ✅ **至少設定以下之一**：
   - OpenCode 中登入了 GitHub Copilot（OAuth Token）
   - 手動建立了 Fine-grained PAT 設定檔（推薦）

:::

### 設定方法（二選一）

#### 方法 1：使用 Fine-grained PAT（推薦）

這是最可靠的方式，不受 OpenCode OAuth 整合變更影響。

1. 存取 https://github.com/settings/tokens?type=beta
2. 點擊 "Generate new token (classic)" 或 "Generate new token (beta)"
3. 在 "Account permissions" 中，將 **Plan** 設為 **Read-only**
4. 產生 Token，格式類似 `github_pat_11A...`
5. 建立設定檔 `~/.config/opencode/copilot-quota-token.json`：

```json
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

**設定檔欄位說明**：
- `token`: 你的 Fine-grained PAT
- `username`: GitHub 使用者名稱（用於 API 呼叫）
- `tier`: 訂閱類型，可選值：`free` / `pro` / `pro+` / `business` / `enterprise`

#### 方法 2：使用 OpenCode OAuth Token

如果你在 OpenCode 中已經登入了 GitHub Copilot，mystatus 會嘗試使用你的 OAuth Token。

::: warning 相容性說明

此方式可能因為 OpenCode OAuth 整合的權限限制而失敗。如果失敗，請使用方法 1（Fine-grained PAT）。

:::

## 跟我做

### 第 1 步：執行查詢指令

在 OpenCode 中執行斜線指令：

```bash
/mystatus
```

**你應該看到**：

如果設定了 Copilot 帳號（使用 Fine-grained PAT 或 OAuth Token），輸出會包含類似以下內容：

```
## GitHub Copilot 帳號額度

Account:        GitHub Copilot (pro)

Premium Requests [████████░░░░░░░░░░░] 40% (180/300)

模型使用明細:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests

Period: 2026-01
```

### 第 2 步：解讀輸出結果

輸出包含以下關鍵資訊：

#### 1. 帳號資訊

```
Account:        GitHub Copilot (pro)
```

顯示你的 Copilot 訂閱類型（pro / free / business 等）。

#### 2. Premium Requests 配額

```
Premium Requests [████████░░░░░░░░░░░] 40% (180/300)
```

- **進度條**：直觀顯示剩餘比例
- **百分比**：剩餘 40%
- **已用/總量**：已用 180 次，總量 300 次

::: tip 進度條說明

綠色/黃色填入表示已用量，空心表示剩餘量。填入越多，說明使用量越大。

:::

#### 3. 模型使用明細（僅 Public API）

```
模型使用明細:
  gpt-4: 120 requests
  claude-3-5-sonnet: 60 requests
```

顯示各模型的使用次數，按使用量降序排列（最多顯示前 5 個）。

::: info 為什麼我的輸出沒有模型明細？

模型明細僅在 Public API（Fine-grained PAT）方式下顯示。如果你使用 OAuth Token（Internal API），不會顯示模型明細。

:::

#### 4. 超額使用（如有）

如果你超過了月度限額，會顯示：

```
超額使用: 25 次請求
```

超額使用會產生額外費用，具體費率請參考 GitHub Copilot 定價。

#### 5. 重置時間（僅 Internal API）

```
配額重置: 12d 5h (2026-02-01)
```

顯示距離配額重置的倒數計時。

### 第 3 步：檢查常見情況

#### 情況 1：看到 "⚠️ 配額查詢暫時無法使用"

這是正常情況，說明 OpenCode 的 OAuth Token 沒有存取配額 API 的權限。

**解決方案**：按照「方法 1：使用 Fine-grained PAT」設定 PAT。

#### 情況 2：進度條全空或接近滿

- **全空** `░░░░░░░░░░░░░░░░░░░`：已用完配額，會顯示超額使用次數
- **接近滿** `██████████████████`：即將用完，注意控制使用頻率

#### 情況 3：顯示 "Unlimited"

某些 Enterprise 訂閱可能顯示 "Unlimited"，表示不限量。

### 第 4 步：處理錯誤（如果查詢失敗）

如果看到以下錯誤：

```
GitHub Copilot API 請求失敗 (403): Resource not accessible by integration
```

**原因**：OAuth Token 沒有足夠的權限存取 Copilot API。

**解決方案**：使用 Fine-grained PAT 方式（見方法 1）。

---

## 檢查點 ✅

完成以上步驟後，你應該能夠：

- [ ] 在 `/mystatus` 輸出中看到 GitHub Copilot 額度資訊
- [ ] 讀懂 Premium Requests 的進度條和百分比
- [ ] 瞭解自己的訂閱類型和月度限額
- [ ] 知道如何查看模型使用明細（如果使用 Fine-grained PAT）
- [ ] 明白超額使用意味著什麼

## 踩坑提醒

### 坑 1：OAuth Token 無法查詢配額（最常見）

::: danger 常見錯誤

```
⚠️ GitHub Copilot 配額查詢暫時無法使用。
OpenCode 的新 OAuth 整合不支援存取配額 API。
```

**原因**：OpenCode 的 OAuth 整合沒有授予 `/copilot_internal/*` API 的存取權限。

**解決**：使用 Fine-grained PAT 方式，見「方法 1：使用 Fine-grained PAT」。

:::

### 坑 2：設定檔格式錯誤

如果設定檔 `~/.config/opencode/copilot-quota-token.json` 格式錯誤，查詢會失敗。

**錯誤範例**：

```json
// ❌ 錯誤：缺少 username 欄位
{
  "token": "github_pat_11A...",
  "tier": "pro"
}
```

**正確範例**：

```json
// ✅ 正確：包含所有必需欄位
{
  "token": "github_pat_11A...",
  "username": "your-username",
  "tier": "pro"
}
```

### 坑 3：訂閱類型填錯

如果你填寫的 `tier` 與實際訂閱不符，限額計算會錯誤。

| 你的實際訂閱 | tier 欄位應填           | 錯誤填寫範例 |
|--- | --- | ---|
| Free         | `free`                  | `pro` ❌     |
| Pro          | `pro`                   | `free` ❌    |
| Pro+         | `pro+`                  | `pro` ❌     |
| Business     | `business`              | `enterprise` ❌ |
| Enterprise   | `enterprise`            | `business` ❌ |

**如何查看你的實際訂閱類型**：
- 存取 https://github.com/settings/billing
- 查看 "GitHub Copilot" 部分

### 坑 4：Token 權限不足

如果你使用的是 Classic Token（非 Fine-grained），沒有 "Plan" 讀取權限，會返回 403 錯誤。

**解決**：
1. 確保使用 Fine-grained Token（在 beta 版本頁面產生）
2. 確保授予了 "Account permissions → Plan → Read-only"

### 坑 5：模型明細不顯示

::: tip 正常現象

如果你使用 OAuth Token（Internal API）方式，不會顯示模型使用明細。

這是因為 Internal API 不返回模型層級的使用統計。如果需要模型明細，請使用 Fine-grained PAT 方式。

:::

## 本課小結

本課程講解了如何使用 opencode-mystatus 查詢 GitHub Copilot 的配額：

**關鍵要點**：

1. **Premium Requests** 是 Copilot 的主要配額指標，包含 Chat、Completion、Workspace 等功能
2. **訂閱類型**決定了月度限額：Free 50 次、Pro 300 次、Pro+ 1,500 次、Business 300 次、Enterprise 1,000 次
3. **超額使用**會產生額外費用，會在輸出中單獨顯示
4. **Fine-grained PAT** 是推薦的認證方式，不受 OpenCode OAuth 整合變更影響
5. **OAuth Token** 方式可能因為權限限制而失敗，需要使用 PAT 作為替代方案

**輸出解讀**：
- 進度條：直觀顯示剩餘比例
- 百分比：具體剩餘量
- 已用/總量：詳細使用情況
- 模型明細（可選）：各模型的使用次數
- 重置時間（可選）：距離下次重置的倒數計時

## 下一課預告

> 下一課我們學習 **[Copilot 認證設定](../../advanced/copilot-auth/)**。
>
> 你會學到：
> - OAuth Token 和 Fine-grained PAT 的詳細對比
> - 如何產生 Fine-grained PAT（完整步驟）
> - 如何解決權限問題的多種方案
> - 不同場景下的最佳實踐

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能             | 檔案路徑                                                                                      | 行號    |
|--- | --- | ---|
| Copilot 配額查詢 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 481-524 |
|--- | --- | ---|
| Public Billing API 查詢 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 157-177 |
| Internal API 查詢 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 242-304 |
| Token 交換邏輯   | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 183-208 |
| Internal API 格式化 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 354-393 |
| Public API 格式化 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 410-468 |
| Copilot 訂閱類型定義 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 57-58  |
| CopilotQuotaConfig 類型定義 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 66-73  |
| CopilotAuthData 類型定義 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 46-51  |
| Copilot 訂閱限額常量 | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts) | 397-403 |

**關鍵常量**：

- `COPILOT_PLAN_LIMITS`：各訂閱類型的月度限額（第 397-403 行）
  - `free: 50`
  - `pro: 300`
  - `pro+: 1500`
  - `business: 300`
  - `enterprise: 1000`

- `COPILOT_QUOTA_CONFIG_PATH`：Fine-grained PAT 設定檔路徑（第 93-98 行）
  - `~/.config/opencode/copilot-quota-token.json`

**關鍵函數**：

- `queryCopilotUsage()`：主查詢函數，支援兩種認證策略（第 481-524 行）
- `fetchPublicBillingUsage()`：使用 Fine-grained PAT 查詢 Public Billing API（第 157-177 行）
- `fetchCopilotUsage()`：使用 OAuth Token 查詢 Internal API（第 242-304 行）
- `exchangeForCopilotToken()`：OAuth Token 交換邏輯（第 183-208 行）
- `formatPublicBillingUsage()`：Public API 回應格式化，包含模型明細（第 410-468 行）
- `formatCopilotUsage()`：Internal API 回應格式化（第 354-393 行）

**認證策略**：

1. **策略 1（優先）**：使用 Fine-grained PAT + Public Billing API
   - 優點：穩定，不受 OpenCode OAuth 整合變更影響
   - 缺點：需要使用者手動設定 PAT

2. **策略 2（降級）**：使用 OAuth Token + Internal API
   - 優點：無需額外設定
   - 缺點：可能因權限限制而失敗（目前 OpenCode 整合不支援）

**API 端點**：

- Public Billing API：`https://api.github.com/users/{username}/settings/billing/premium_request/usage`
- Internal Quota API：`https://api.github.com/copilot_internal/user`
- Token Exchange API：`https://api.github.com/copilot_internal/v2/token`

</details>
