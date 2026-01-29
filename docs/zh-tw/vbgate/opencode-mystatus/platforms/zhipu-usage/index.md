---
title: "智證 AI: Token 與 MCP 配額查詢 | opencode-mystatus"
sidebarTitle: "智證 AI 額度"
subtitle: "智證 AI 和 Z.ai 額度查詢：5 小時 Token 限額和 MCP 月度配額"
description: "學習使用 opencode-mystatus 查詢智證 AI 和 Z.ai 的 Token 限額、MCP 月度配額。掌握進度條解讀和重置時間計算，有效管理額度。"
tags:
  - "智證 AI"
  - "Z.ai"
  - "額度查詢"
  - "Token 限額"
  - "MCP 配額"
prerequisite:
  - "start-quick-start"
order: 2
---

# 智證 AI 和 Z.ai 額度查詢：5 小時 Token 限額和 MCP 月度配額

## 學完你能做什麼

- 查看**智證 AI** 和 **Z.ai** 的 5 小時 Token 限額使用情況
- 理解 **MCP 月度配額**的含義和重置規則
- 看懂額度輸出中的**進度條、已用量、總量**等資訊
- 知道何時會觸發**使用率警告**

## 你現在的困境

你使用智證 AI 或 Z.ai 開發應用，但經常遇到這些問題：

- 不知道**5 小時 Token 限額**還有多少剩餘
- 超過限額後請求失敗，影響開發進度
- 不清楚 **MCP 月度配額**的具體含義
- 需要登入兩個平台分別查看額度，很麻煩

## 什麼時候用這一招

當你：

- 使用智證 AI / Z.ai 的 API 開發應用
- 需要監控 Token 使用量，避免超額
- 想瞭解 MCP 搜尋功能的月度配額
- 同時使用智證 AI 和 Z.ai，想統一管理額度

## 核心思路

**智證 AI**和**Z.ai**的額度系統分為兩種類型：

| 額度類型 | 含義 | 重置週期 |
|--- | --- | ---|
| **5 小時 Token 限額** | API 請求的 Token 使用量限制 | 5 小時自動重置 |
| **MCP 月度配額** | MCP（Model Context Protocol）搜尋次數的月度限制 | 每月重置 |

外掛呼叫官方 API 即時查詢這些資料，並用**進度條**和**百分比**直觀展示剩餘額度。

::: info 什麼是 MCP？

**MCP**（Model Context Protocol）是智證 AI 提供的模型內容協定，允許 AI 模型搜尋和引用外部資源。MCP 月度配額限制了每月可進行的搜尋次數。

:::

## 跟我做

### 第 1 步：配置智證 AI / Z.ai 帳號

**為什麼**
外掛需要 API Key 才能查詢你的額度。智證 AI 和 Z.ai 使用**API Key 認證方式**。

**操作**

1. 開啟 `~/.local/share/opencode/auth.json` 檔案

2. 新增智證 AI 或 Z.ai 的 API Key 配置：

```json
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的智證 AI API Key"
  },
  "zai-coding-plan": {
    "type": "api",
    "key": "你的 Z.ai API Key"
  }
}
```

**你應該看到**：
- 配置檔中包含 `zhipuai-coding-plan` 或 `zai-coding-plan` 欄位
- 每個欄位都有 `type: "api"` 和 `key` 欄位

### 第 2 步：查詢額度

**為什麼**
呼叫官方 API 取得即時的額度使用情況。

**操作**

在 OpenCode 中執行斜線指令：

```bash
/mystatus
```

或用自然語言提問：

```bash
查看我的智證 AI 額度
```

**你應該看到**類似這樣的輸出：

```
## 智證 AI 帳號額度

Account:        9c89****AQVM (Coding Plan)

5 小時 Token 限額
███████████████████████████ 剩餘 95%
已用: 0.5M / 10.0M
重置: 4小時後

MCP 月度配額
██████████████████░░░░░░░ 剩餘 60%
已用: 200 / 500

## Z.ai 帳號額度

Account:        9c89****AQVM (Z.ai)

5 小時 Token 限額
███████████████████████████ 剩餘 95%
已用: 0.5M / 10.0M
重置: 4小時後
```

### 第 3 步：解讀輸出

**為什麼**
理解每行輸出的含義，才能有效管理額度。

**操作**

對照以下說明查看你的輸出：

| 輸出欄位 | 含義 | 範例 |
|--- | --- | ---|
| **Account** | 脫敏後的 API Key 和帳號類型 | `9c89****AQVM (Coding Plan)` |
| **5 小時 Token 限額** | 目前 5 小時週期內的 Token 使用情況 | 進度條 + 百分比 |
| **已用: X / Y** | 已使用 Token / 總配額 | `0.5M / 10.0M` |
| **重置: X小時後** | 下次重置的倒數計時 | `4小時後` |
| **MCP 月度配額** | 當月 MCP 搜尋次數的使用情況 | 進度條 + 百分比 |
| **已用: X / Y** | 已用次數 / 總配額 | `200 / 500` |

**你應該看到**：
- 5 小時 Token 限額部分有**重置時間倒數計時**
- MCP 月度配額部分**沒有重置時間**（因為它是月度重置）
- 如果使用率超過 80%，底部會顯示**警告提示**

## 檢查點 ✅

確認你理解了以下內容：

- [ ] 5 小時 Token 限額有重置時間倒數計時
- [ ] MCP 月度配額是每月重置，不顯示倒數計時
- [ ] 使用率超過 80% 會觸發警告
- [ ] API Key 已脫敏顯示（只顯示前 4 位和後 4 位）

## 踩坑提醒

### ❌ 常見錯誤 1：配置檔中缺少 `type` 欄位

**錯誤現象**：查詢時提示"未找到任何已配置的帳號"

**原因**：`auth.json` 中缺少 `type: "api"` 欄位

**修正**：

```json
// ❌ 錯誤
{
  "zhipuai-coding-plan": {
    "key": "你的 API Key"
  }
}

// ✅ 正確
{
  "zhipuai-coding-plan": {
    "type": "api",
    "key": "你的 API Key"
  }
}
```

### ❌ 常見錯誤 2：API Key 過期或無效

**錯誤現象**：顯示 "API 請求失敗" 或 "鑑權失敗"

**原因**：API Key 已過期或被撤銷

**修正**：
- 登入智證 AI / Z.ai 控制台
- 重新生成 API Key
- 更新 `auth.json` 中的 `key` 欄位

### ❌ 常見錯誤 3：混淆兩種額度類型

**錯誤現象**：以為 Token 限額和 MCP 配額是同一個東西

**修正**：
- **Token 限額**：API 呼叫的 Token 使用量，5 小時重置
- **MCP 配額**：MCP 搜尋次數，每月重置
- 這是**兩個獨立的限額**，互不影響

## 本課小結

本課學習了如何使用 opencode-mystatus 查詢智證 AI 和 Z.ai 的額度：

**核心概念**：
- 5 小時 Token 限額：API 呼叫限制，有重置倒數計時
- MCP 月度配額：MCP 搜尋次數，每月重置

**操作步驟**：
1. 配置 `auth.json` 中的 `zhipuai-coding-plan` 或 `zai-coding-plan`
2. 執行 `/mystatus` 查詢額度
3. 解讀輸出中的進度條、已用量、重置時間

**關鍵點**：
- 使用率超過 80% 會觸發警告
- API Key 自動脫敏顯示
- Token 限額和 MCP 配額是兩個獨立的限額

## 下一課預告

> 下一課我們學習 **[GitHub Copilot 額度查詢](../copilot-usage/)**。
>
> 你會學到：
> - 如何查看 Premium Requests 使用情況
> - 不同訂閱類型的月度配額差異
> - 模型使用明細的解讀方法

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
|--- | --- | ---|
| 查詢智證 AI 額度 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 213-217 |
| 查詢 Z.ai 額度 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 224-228 |
| 格式化輸出 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 115-177 |
| API 端點配置 | [`source/vbgate/opencode-mystatus/plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts) | 62-76 |
| ZhipuAuthData 類型定義 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 38-41 |
| 高使用率警告閾值 | [`source/vbgate/opencode-mystatus/plugin/lib/types.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/types.ts) | 110-111 |

**關鍵常數**：
- `HIGH_USAGE_THRESHOLD = 80`：使用率超過 80% 時顯示警告（`types.ts:111`）

**關鍵函數**：
- `queryZhipuUsage(authData)`: 查詢智證 AI 帳號額度（`zhipu.ts:213-217`）
- `queryZaiUsage(authData)`: 查詢 Z.ai 帳號額度（`zhipu.ts:224-228`）
- `formatZhipuUsage(data, apiKey, accountLabel)`: 格式化額度輸出（`zhipu.ts:115-177`）
- `fetchUsage(apiKey, config)`: 呼叫官方 API 取得額度資料（`zhipu.ts:81-106`）

**API 端點**：
- 智證 AI: `https://bigmodel.cn/api/monitor/usage/quota/limit`（`zhipu.ts:63`）
- Z.ai: `https://api.z.ai/api/monitor/usage/quota/limit`（`zhipu.ts:64`）

</details>
