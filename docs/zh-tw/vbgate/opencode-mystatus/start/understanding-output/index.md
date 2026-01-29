---
title: "解讀輸出: 進度條與重置時間 | opencode-mystatus"
sidebarTitle: "解讀輸出"
subtitle: "解讀輸出：進度條、重置時間和多帳號"
description: "學習解讀 opencode-mystatus 輸出格式，理解進度條含義、重置時間計算，掌握 OpenAI、智證 AI、Copilot 等平台的限額週期。"
tags:
  - "output-format"
  - "progress-bar"
  - "reset-time"
  - "multi-account"
prerequisite:
  - "start-quick-start"
order: 3
---

# 解讀輸出：進度條、重置時間和多帳號

## 學完你能做什麼

- 看懂 mystatus 輸出中的每項資訊
- 理解進度條顯示的含義（實心 vs 空心）
- 知道不同平台的限額週期（3 小時、5 小時、月度）
- 識別多個帳號的額度差異

## 你現在的困境

你執行了 `/mystatus`，看到一堆進度條、百分比、倒數計時，但搞不清楚：

- 進度條是滿的好還是空的好？
- "Resets in: 2h 30m" 是什麼意思？
- 為什麼有的平台顯示兩個進度條，有的只顯示一個？
- Google Cloud 怎麼有好幾個帳號？

本課幫你把這些資訊一一拆解。

## 核心思路

mystatus 的輸出有統一格式，但不同平台有差異：

**統一元素**：
- 進度條：`█`（實心）表示剩餘，`░`（空）表示已用
- 百分比：基於已用量計算剩餘百分比
- 重置時間：距離下次額度重新整理的倒數計時

**平台差異**：
| 平台           | 限額週期                    | 特點                    |
|--- | --- | ---|
| OpenAI         | 3 小時 / 24 小時            | 可能顯示兩個視窗        |
| 智證 AI / Z.ai | 5 小時 Token / MCP 月度配額 | 兩種不同的限額類型      |
| GitHub Copilot | 月度                        | 顯示具體數值（229/300） |
| Google Cloud   | 按模型                      | 每個帳號顯示 4 個模型   |

## 輸出結構解析

### 完整輸出範例

```
## OpenAI Account Quota

Account:        user@example.com (team)

3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
█████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m

## Zhipu AI Account Quota

Account:        9c89****AQVM (Coding Plan)

5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

## GitHub Copilot Account Quota

Account:        GitHub Copilot (individual)

Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)

## Google Cloud Account Quota

### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%
```

### 各部分含義

#### 1. 帳號資訊行

```
Account:        user@example.com (team)
```

- **OpenAI / Copilot**：顯示郵件 + 訂閱類型
- **智證 AI / Z.ai**：顯示脫敏後的 API Key + 帳號類型（Coding Plan）
- **Google Cloud**：顯示郵件，多帳號用 `###` 分隔

#### 2. 進度條

```
███████████████████████████ 85% remaining
```

- `█`（實心塊）：**剩餘**的額度
- `░`（空塊）：**已使用**的額度
- **百分比**：剩餘百分比（越大越好）

::: tip 記憶口訣
實心塊越滿，剩餘越多 → 繼續用放心
空塊越滿，用得越多 → 注意省著點
:::

#### 3. 重置時間倒數計時

```
Resets in: 2h 30m
```

表示距離下次額度重新整理還有多長時間。

**重置週期**：
- **OpenAI**：3 小時視窗 / 24 小時視窗
- **智證 AI / Z.ai**：5 小時 Token 限額 / MCP 月度配額
- **GitHub Copilot**：月度（顯示具體日期）
- **Google Cloud**：每個模型有獨立的重置時間

#### 4. 數值明細（部分平台）

智證 AI 和 Copilot 會顯示具體數值：

```
Used: 0.5M / 10.0M              # 智證 AI：已用 / 總量（單位：百萬 Token）
Premium        24% (229/300)     # Copilot：剩餘百分比（已用 / 總配額）
```

## 平台差異詳解

### OpenAI：雙視窗限額

OpenAI 可能顯示兩個進度條：

```
3-hour limit
███████████████████████████ 85% remaining
Resets in: 2h 30m

24-hour limit
█████████░░░░░░░░░░░░░░ 60% remaining
Resets in: 20h 30m
```

- **3-hour limit**：3 小時滑動視窗，適合高頻使用
- **24-hour limit**：24 小時滑動視窗，適合長期規劃

**團隊帳號**（Team）：
- 有主視窗和次視窗兩個限額
- 不同成員共用同一個 Team 限額

**個人帳號**（Plus）：
- 通常只顯示 3 小時視窗

### 智證 AI / Z.ai：兩種限額類型

```
5-hour token limit
███████████████████████████ 95% remaining
Used: 0.5M / 10.0M
Resets in: 4h

MCP limit
███████████████████████████ 100% remaining
Used: 0 / 1000
```

- **5-hour token limit**：5 小時內的 Token 使用限額
- **MCP limit**：Model Context Protocol（模型內容協定）月度配額，用於搜尋功能

::: warning
MCP 配額是月度的，重置時間較長。如果顯示已滿，需要等下個月才能恢復。
:::

### GitHub Copilot：月度配額

```
Premium        ████░░░░░░░░░░░░░░░ 24% (229/300)

Quota resets: 19d 0h (2026-02-01)
```

- **Premium Requests**：Copilot 高級功能使用量
- 顯示具體數值（已用 / 總配額）
- 月度重置，顯示具體日期

**訂閱類型差異**：
| 訂閱類型   | 月度配額 | 說明                   |
|--- | --- | ---|
| Free       | N/A      | 無限額限制，但功能受限 |
| Pro        | 300      | 標準個人版             |
| Pro+       | 更高     | 升級版                 |
| Business   | 更高     | 企業版                 |
| Enterprise | 無限     | 企業版                 |

### Google Cloud：多帳號 + 多模型

```
### user@gmail.com

G3 Pro     4h 59m     ████████████████████ 100%
G3 Image   4h 59m     ████████████████████ 100%
G3 Flash   4h 59m     ████████████████████ 100%
Claude     2d 9h      ░░░░░░░░░░░░░░░░░░░░ 0%

### work@gmail.com

G3 Pro     4h 59m     ████████████░░░░░░░░░ 50%
G3 Image   4h 59m     ██████████░░░░░░░░░░ 50%
```

**格式**：`模型名 | 重置時間 | 進度條 + 百分比`

**4 個模型說明**：
| 模型名   | 對應 API Key                                   | 用途        |
|--- | --- | ---|
| G3 Pro   | `gemini-3-pro-high` / `gemini-3-pro-low`       | 高級推理    |
| G3 Image | `gemini-3-pro-image`                           | 影像生成    |
| G3 Flash | `gemini-3-flash`                               | 快速生成    |
| Claude   | `claude-opus-4-5-thinking` / `claude-opus-4-5` | Claude 模型 |

**多帳號顯示**：
- 每個 Google 帳號用 `###` 分隔
- 每個帳號顯示自己的 4 個模型額度
- 可以比較不同帳號的額度使用情況

## 踩坑提醒

### 常見誤解

| 誤解                      | 事實                                   |
|--- | ---|
| 進度條全是實心 = 沒有用過 | 實心塊多 = **剩餘多**，可以放心用      |
| 重置時間短 = 額度快沒了   | 重置時間短 = 快重置了，可以續用        |
| 百分比 100% = 已用完      | 百分比 100% = **全部剩餘**             |
| 智證 AI 只顯示一個限額    | 實際有 TOKENS_LIMIT 和 TIME_LIMIT 兩種 |

### 限額滿了怎麼辦？

如果進度條全是空塊（0% remaining）：

1. **短期限額**（如 3 小時、5 小時）：等重置時間倒數計時結束
2. **月度限額**（如 Copilot、MCP）：等下個月初
3. **多帳號**：切換到其他帳號（Google Cloud 支援多帳號）

::: info
mystatus 是**唯讀工具**，不會消耗你的額度，也不會觸發任何 API 呼叫。
:::

## 本課小結

- **進度條**：實心 `█` = 剩餘，空 `░` = 已用
- **重置時間**：距離下次額度重新整理的倒數計時
- **平台差異**：不同平台有不同限額週期（3h/5h/月度）
- **多帳號**：Google Cloud 顯示多個帳號，方便額度管理

## 下一課預告

> 下一課我們學習 **[OpenAI 額度查詢](../../platforms/openai-usage/)**。
>
> 你會學到：
> - OpenAI 的 3 小時和 24 小時限額的區別
> - 團隊帳號的額度共用機制
> - 如何解析 JWT Token 取得帳號資訊

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能                    | 檔案路徑                                                                                                         | 行號    |
|--- | --- | ---|
| 進度條生成              | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L40-L53)       | 40-53   |
| 時間格式化              | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L18-L29)       | 18-29   |
| 剩餘百分比計算          | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L63-L65)       | 63-65   |
| Token 數量格式化        | [`plugin/lib/utils.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/utils.ts#L70-L72)       | 70-72   |
| OpenAI 輸出格式化       | [`plugin/lib/openai.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/openai.ts#L164-L194)   | 164-194 |
| 智證 AI 輸出格式化      | [`plugin/lib/zhipu.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/zhipu.ts#L115-L177)     | 115-177 |
| Copilot 輸出格式化      | [`plugin/lib/copilot.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/copilot.ts#L395-L447) | 395-447 |
| Google Cloud 輸出格式化 | [`plugin/lib/google.ts`](https://github.com/vbgate/opencode-mystatus/blob/main/plugin/lib/google.ts#L265-L294)   | 265-294 |

**關鍵函數**：
- `createProgressBar(percent, width)`：生成進度條，實心塊表示剩餘
- `formatDuration(seconds)`：將秒數轉換為人類可讀的時間格式（如 "2h 30m"）
- `calcRemainPercent(usedPercent)`：計算剩餘百分比（100 - 已用百分比）
- `formatTokens(tokens)`：將 Token 數量格式化為百萬單位（如 "0.5M"）

**關鍵常數**：
- 進度條預設寬度：30 個字元（Google Cloud 模型使用 20 個字元）
- 進度條字元：`█`（實心）、`░`（空）

</details>
