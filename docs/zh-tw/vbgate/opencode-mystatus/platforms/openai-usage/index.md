---
title: "OpenAI 額度: 查詢限額 | opencode-mystatus"
sidebarTitle: "OpenAI 額度"
subtitle: "OpenAI 額度: 查詢限額"
description: "學習查詢 OpenAI ChatGPT 的 3 小時和 24 小時限額。解讀主視窗、次視窗、進度條和重置時間，掌握 Plus、Team、Pro 訂閱的額度差異，處理 Token 過期問題。"
tags:
  - "OpenAI"
  - "額度查詢"
  - "API 配額"
prerequisite:
  - "start-quick-start"
  - "start-understanding-output"
order: 1
---

# OpenAI 額度查詢：3 小時和 24 小時限額

## 學完你能做什麼

- 使用 `/mystatus` 查詢 OpenAI Plus/Team/Pro 訂閱的額度
- 看懂輸出中的 3 小時和 24 小時限額資訊
- 理解主視窗和次視窗的區別
- 瞭解 Token 過期時的處理方式

## 你現在的困境

OpenAI 的 API 呼叫有限額，超額後會被暫時限制存取。但你不知道：
- 目前還剩多少額度？
- 3 小時和 24 小時視窗哪個在用？
- 什麼時候會重置？
- 為什麼有時候看到兩個視窗的資料？

這些資訊如果不及時掌握，可能影響你用 ChatGPT 寫程式碼或做專案的進度。

## 什麼時候用這一招

當你：
- 需要頻繁使用 OpenAI API 進行開發
- 發現回應變慢或被限流
- 想瞭解團隊帳號的使用情況
- 想知道什麼時候額度會重新整理

## 核心思路

OpenAI 對 API 呼叫有兩種限流視窗：

| 視窗類型 | 時長 | 作用 |
|---------|------|------|
| **主視窗**（primary） | 由 OpenAI 伺服器端返回 | 防止短時間內大量呼叫 |
| **次視窗**（secondary） | 由 OpenAI 伺服器端返回（可能不存在） | 防止長期超額使用 |

mystatus 會並行查詢這兩個視窗，顯示各自的：
- 已使用百分比
- 剩餘額度進度條
- 距離重置的時間

::: info
視窗時長由 OpenAI 伺服器端返回，不同訂閱類型（Plus、Team、Pro）可能不同。
:::

## 跟我做

### 第 1 步：執行查詢指令

在 OpenCode 中輸入 `/mystatus`，系統會自動查詢所有已配置平台的額度。

**你應該看到**：
包含 OpenAI、智證 AI、Z.ai、Copilot、Google Cloud 等平台的額度資訊（取決於你配置了哪些平台）。

### 第 2 步：找到 OpenAI 部分

在輸出中找到 `## OpenAI Account Quota` 部分。

**你應該看到**：
類似這樣的內容：

```
## OpenAI Account Quota

Account:        user@example.com (plus)

3-hour limit
███████████████░░░░░░░░░░ 60% remaining
Resets in: 2h 30m
```

### 第 3 步：解讀主視窗資訊

**主視窗**（primary_window）通常顯示：
- **視窗名稱**：如 `3-hour limit` 或 `24-hour limit`
- **進度條**：直觀顯示剩餘額度的比例
- **剩餘百分比**：如 `60% remaining`
- **重置時間**：如 `Resets in: 2h 30m`

**你應該看到**：
- 視窗名稱顯示時長（3 小時 / 24 小時）
- 進度條越滿代表剩餘越多，越空代表越快用完
- 重置時間是倒數計時，歸零後額度會重新整理

::: warning
如果看到提示 `Limit reached!`，說明目前視窗額度已用完，需要等待重置。
:::

### 第 4 步：查看次視窗（如果有）

如果 OpenAI 返回了次視窗資料，你會看到：

```
24-hour limit
███████████████████████████ 90% remaining
Resets in: 20h 45m
```

**你應該看到**：
- 次視窗顯示另一個時間維度的額度（通常是 24 小時）
- 可能與主視窗不同的剩餘百分比

::: tip
次視窗是獨立的額度池，主視窗用完不影響次視窗，反之亦然。
:::

### 第 5 步：查看訂閱類型

在 `Account` 行可以看到訂閱類型：

```
Account:        user@example.com (plus)
                                   ^^^^^
                                   訂閱類型
```

**常見的訂閱類型**：
- `plus`：個人 Plus 訂閱
- `team`：團隊/組織訂閱
- `pro`：Pro 訂閱

**你應該看到**：
- 你的帳號類型顯示在郵件後的括號裡
- 不同類型的限額可能不同

## 檢查點 ✅

驗證一下你理解了：

| 場景 | 你應該看到 |
|------|----------|
| 主視窗剩餘 60% | 進度條大約 60% 滿，顯示 `60% remaining` |
| 2.5 小時後重置 | 顯示 `Resets in: 2h 30m` |
| 達到限額 | 顯示 `Limit reached!` |
| 有次視窗 | 主視窗和次視窗各有一行資料 |

## 踩坑提醒

### ❌ 錯誤操作：Token 過期後不重新整理

**錯誤現象**：看到提示 `⚠️ OAuth 授權已過期`（中文）或 `⚠️ OAuth token expired`（英文）

**原因**：OAuth Token 已過期（由伺服器端控制的具體時長），過期後無法查詢額度。

**正確做法**：
1. 在 OpenCode 中重新登入 OpenAI
2. Token 會自動重新整理
3. 再次執行 `/mystatus` 查詢

### ❌ 錯誤操作：混淆主視窗和次視窗

**錯誤現象**：以為只有一個視窗額度，結果主視窗用完次視窗還在用

**原因**：兩個視窗是獨立的額度池。

**正確做法**：
- 關注兩個視窗各自的重置時間
- 主視窗重置快，次視窗重置慢
- 合理分配使用，避免某個視窗長期超額

### ❌ 錯誤操作：忽略團隊帳號 ID

**錯誤現象**：Team 訂閱顯示的不是自己的使用情況

**原因**：Team 訂閱需要傳遞團隊帳號 ID，否則可能查詢的是預設帳號。

**正確做法**：
- 確保在 OpenCode 中登入了正確的團隊帳號
- Token 中會自動包含 `chatgpt_account_id`

## 本課小結

mystatus 透過呼叫 OpenAI 官方式 API 查詢額度：
- 支援 OAuth 認證（Plus/Team/Pro）
- 顯示主視窗和次視窗（如果存在）
- 進度條可視化剩餘額度
- 倒數計時顯示重置時間
- 自動偵測 Token 過期

## 下一課預告

> 下一課我們學習 **[智證 AI 和 Z.ai 額度查詢](../zhipu-usage/)**。
>
> 你會學到：
> - 5 小時 Token 限額是什麼
> - MCP 月度配額怎麼查看
> - 使用率超過 80% 時的警告提示

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能                    | 檔案路徑                                                                                      | 行號    |
| ----------------------- | --------------------------------------------------------------------------------------------- | ------- |
| OpenAI 額度查詢入口   | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L207-L236) | 207-236 |
| OpenAI API 呼叫       | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L132-L155) | 132-155 |
| 格式化輸出             | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194) | 164-194 |
| JWT Token 解析         | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L64-L73)   | 64-73   |
| 提取使用者郵件       | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L78-L81)   | 78-81   |
| Token 過期檢查         | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L216-L221) | 216-221 |
| OpenAIAuthData 類型定義 | [`plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts#L28-L33)       | 28-33   |

**常數**：
- `OPENAI_USAGE_URL = "https://chatgpt.com/backend-api/wham/usage"`：OpenAI 官方額度查詢 API

**關鍵函數**：
- `queryOpenAIUsage(authData)`：查詢 OpenAI 額度的主函數
- `fetchOpenAIUsage(accessToken)`：呼叫 OpenAI API
- `formatOpenAIUsage(data, email)`：格式化輸出
- `parseJwt(token)`：解析 JWT Token（非標準函式庫實作）
- `getEmailFromJwt(token)`：從 Token 提取使用者郵件
- `getAccountIdFromJwt(token)`：從 Token 提取團隊帳號 ID

</details>
