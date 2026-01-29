---
title: "安全隱私: 本地唯讀與 API 脫敏 | opencode-mystatus"
subtitle: "安全與隱私：本地檔案存取、API 脫敏、官方介面"
sidebarTitle: "安全隱私"
description: "瞭解 opencode-mystatus 外掛的安全機制：唯讀本地檔案、API Key 自動自動脫敏、僅呼叫官方介面、無資料儲存上傳和隱私保護。"
tags:
  - "安全"
  - "隱私"
  - "FAQ"
prerequisite: []
order: 2
---

# 安全與隱私：本地檔案存取、API 脫敏、官方介面

## 你現在的困境

使用第三方工具時，你最擔心的是什麼？

- "它會讀取我的 API Key 嗎？"
- "我的認證資訊會被上傳到伺服器嗎？"
- "會不會有資料洩漏的風險？"
- "它修改了我的設定檔怎麼辦？"

這些問題都很合理，尤其是在處理敏感的 AI 平台認證資訊時。本教學將詳細解釋 opencode-mystatus 外掛如何透過設計保護你的資料和隱私。

::: info 本地優先原則
opencode-mystatus 遵循「唯讀本地檔案 + 官方 API 直接查詢」的原則，所有敏感操作都在你的機器上完成，不經過任何第三方伺服器。
:::

## 核心思路

外掛的安全設計圍繞三個核心原則：

1. **唯讀原則**：只讀取本地認證檔，不寫入或修改任何內容
2. **官方介面**：僅呼叫各平台的官方 API，不使用第三方服務
3. **資料脫敏**：顯示輸出時自動隱藏敏感資訊（如 API Key）

這三個原則層層疊加，確保你的資料從讀取到展示的整個流程都是安全的。

---

## 本地檔案存取（唯讀）

### 外掛讀取哪些檔案

外掛只讀取兩個本地設定檔，並且都是**唯讀模式**：

| 檔案路徑 | 用途 | 原始碼位置 |
|--- | --- | ---|
| `~/.local/share/opencode/auth.json` | OpenCode 官方認證儲存 | `mystatus.ts:35` |
| `~/.config/opencode/antigravity-accounts.json` | Antigravity 外掛帳號儲存 | `google.ts`（讀取邏輯） |

::: tip 不修改檔案
原始碼中只使用了 `readFile` 函數讀取檔案，沒有任何 `writeFile` 或其他修改操作。這意味著外掛不會意外覆蓋你的設定。
:::

### 原始碼證據

```typescript
// mystatus.ts 第 38-40 行
const content = await readFile(authPath, "utf-8");
authData = JSON.parse(content);
```

這裡使用 Node.js 的 `fs/promises.readFile`，這是一個**唯讀操作**。如果檔案不存在或格式錯誤，外掛會返回友好的錯誤提示，而不是建立或修改檔案。

---

## API Key 自動脫敏

### 什麼是脫敏

脫敏（Masking）是指在顯示敏感資訊時，只顯示部分字元，隱藏關鍵部分。

例如，你的智證 AI API Key 可能是：
```
sk-9c89abc1234567890abcdefAQVM
```

脫敏後顯示為：
```
sk-9c8****fAQVM
```

### 脫敏規則

外掛使用 `maskString` 函數處理所有敏感資訊：

```typescript
// utils.ts 第 130-135 行
export function maskString(str: string, showChars: number = 4): string {
  if (str.length <= showChars * 2) {
    return str;
  }
  return `${str.slice(0, showChars)}****${str.slice(-showChars)}`;
}
```

**規則說明**：
- 預設顯示前 4 位和後 4 位
- 中間部分用 `****` 替代
- 如果字串太短（≤ 8 位），則原樣返回

### 實際使用範例

在智證 AI 額度查詢中，脫敏後的 API Key 會出現在輸出中：

```typescript
// zhipu.ts 第 124 行
const maskedKey = maskString(apiKey);
lines.push(`${t.account}        ${maskedKey} (${accountLabel})`);
```

輸出效果：
```
Account:        9c89****AQVM (Coding Plan)
```

::: tip 脫敏的作用
即使你分享查詢結果截圖給他人，也不會洩漏你的真實 API Key。只有顯示的「前後 4 位」是可見的，中間的關鍵部分已被隱藏。
:::

---

## 官方介面呼叫

### 外掛呼叫哪些 API

外掛僅呼叫各平台的**官方 API**，不經過任何第三方伺服器：

| 平台 | API 端點 | 用途 |
|--- | --- | ---|
| OpenAI | `https://chatgpt.com/backend-api/wham/usage` | 額度查詢 |
| 智證 AI | `https://bigmodel.cn/api/monitor/usage/quota/limit` | Token 限額查詢 |
| Z.ai | `https://api.z.ai/api/monitor/usage/quota/limit` | Token 限額查詢 |
| GitHub Copilot | `https://api.github.com/copilot_internal/user` | 額度查詢 |
| GitHub Copilot | `https://api.github.com/users/{username}/settings/billing/premium_request/usage` | 公開 API 查詢 |
| Google Cloud | `https://oauth2.googleapis.com/token` | OAuth Token 重新整理 |
| Google Cloud | `https://cloudcode-pa.googleapis.com/v1internal:fetchAvailableModels` | 模型額度查詢 |

::: info 官方 API 的安全性
這些 API 端點都是各平台的官方介面，使用 HTTPS 加密傳輸。外掛只是作為「客戶端」發送請求，不儲存或轉發任何資料。
:::

### 請求逾時保護

為了防止網路請求卡住，外掛設定了 10 秒逾時：

```typescript
// types.ts 第 114 行
export const REQUEST_TIMEOUT_MS = 10000;

// utils.ts 第 84-106 行
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = REQUEST_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(t.timeoutError(Math.round(timeoutMs / 1000)));
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**逾時機制的作用**：
- 防止網路故障導致外掛無限等待
- 保護你的系統資源不被佔用
- 10 秒逾時後自動取消請求，返回錯誤訊息

---

## 隱私保護總結

### 外掛不會做的事情

| 操作 | 外掛行為 |
|--- | ---|
| 儲存資料 | ❌ 不儲存任何使用者資料 |
| 上傳資料 | ❌ 不上傳任何資料到第三方伺服器 |
| 快取結果 | ❌ 不快取查詢結果 |
| 修改檔案 | ❌ 不修改任何本地設定檔 |
| 記錄日誌 | ❌ 不記錄任何使用日誌 |

### 外掛會做的事情

| 操作 | 外掛行為 |
|--- | ---|
| 讀取檔案 | ✅ 唯讀本地認證檔 |
| 呼叫 API | ✅ 僅呼叫官方 API 端點 |
| 脫敏顯示 | ✅ 自動隱藏 API Key 等敏感資訊 |
| 開源審查 | ✅ 原始碼完全開源，可自行審計 |

### 原始碼可審計

外掛的所有程式碼都是開源的，你可以：
- 查看 GitHub 原始碼儲存庫
- 檢查每個 API 呼叫的端點
- 驗證是否有資料儲存邏輯
- 確認脫敏函數的實作方式

---

## 常見疑問解答

::: details 外掛會竊取我的 API Key 嗎？
不會。外掛只使用 API Key 向官方 API 發送請求，不會儲存或轉發到任何第三方伺服器。所有程式碼都是開源的，你可以審查。
:::

::: details 為什麼顯示脫敏後的 API Key？
這是為了保護你的隱私。即使你分享查詢結果截圖，也不會洩漏完整的 API Key。脫敏後只顯示前 4 位和後 4 位，中間部分已被隱藏。
:::

::: details 外掛會修改我的設定檔嗎？
不會。外掛只使用 `readFile` 讀取檔案，不執行任何寫入操作。如果你的設定檔格式錯誤，外掛會返回錯誤提示，而不會嘗試修復或覆蓋。
:::

::: details 查詢結果會快取在外掛中嗎？
不會。外掛每次呼叫時都即時讀取檔案並查詢 API，不快取任何結果。查詢完成後立即捨棄所有資料。
:::

::: details 外掛會收集使用資料嗎？
不會。外掛沒有任何埋點或資料收集功能，不會追蹤你的使用行為。
:::

---

## 本課小結

- **唯讀原則**：外掛只讀取本地認證檔，不修改任何內容
- **API 脫敏**：顯示輸出時自動隱藏 API Key 的關鍵部分
- **官方介面**：僅呼叫各平台的官方 API，不使用第三方服務
- **開源透明**：所有程式碼都是開源的，可以自行審查安全機制

## 下一課預告

> 下一課我們學習 **[資料模型：認證檔案結構和 API 回應格式](/zh-tw/vbgate/opencode-mystatus/appendix/data-models/)**
>
> 你會學到：
> - AuthData 的完整結構定義
> - 各平台認證資料的欄位含義
> - API 回應的資料格式

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 認證檔案讀取 | [`plugin/mystatus.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/mystatus.ts#L38-L40) | 38-40 |
| API 脫敏函數 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L130-L135) | 130-135 |
| 請求逾時設定 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L114) | 114 |
| 請求逾時實作 | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L84-L106) | 84-106 |
| 智證 AI 脫敏範例 | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L124) | 124 |

**關鍵函數**：
- `maskString(str, showChars = 4)`：脫敏顯示敏感字串，顯示前後各 `showChars` 位，中間用 `****` 替代

**關鍵常數**：
- `REQUEST_TIMEOUT_MS = 10000`：API 請求逾時時間（10 秒）

</details>
