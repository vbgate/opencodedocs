---
title: "快取影響：權衡命中率與節省 | opencode-dcp"
subtitle: "Prompt Caching：DCP 如何權衡快取命中率與 Token 節省"
sidebarTitle: "快取降了就虧？"
description: "理解 DCP 如何影響 Prompt Caching 的快取命中率與 Token 節省。掌握 Anthropic、OpenAI 等提供者的最佳實踐，根據計費模式動態調整策略。"
tags:
  - "advanced"
  - "prompt-caching"
  - "token-optimization"
  - "cost-optimization"
prerequisite:
  - "start-getting-started"
  - "platforms-auto-pruning"
  - "platforms-llm-tools"
order: 3
---

# Prompt 快取影響：權衡快取命中率與 Token 節省

## 學完你能做什麼

- 理解 LLM 提供者的 Prompt Caching 機制如何運作
- 知道 DCP 修剪為什麼會影響快取命中率
- 學會如何權衡快取損失與 Token 節省
- 根據使用的提供者與計費模式，制定最佳策略

## 你現在的困境

你啟用了 DCP 後，注意到快取命中率從 85% 降到了 65%，擔心這是否反而增加了成本？或者你想了解在不同 LLM 提供者（Anthropic、OpenAI、GitHub Copilot）上使用 DCP 是否會有不同的影響？

DCP 的修剪操作會改變訊息內容，這會影響 Prompt Caching。但這個權衡是否值得？讓我們深入分析。

## 什麼時候用這一招

- 長會話中，上下文膨脹變得顯著
- 使用按請求計費的提供者（如 GitHub Copilot、Google Antigravity）
- 想要減少上下文污染，提高模型回應品質
- Token 節省的價值超過快取命中率損失

## 核心思路

**什麼是 Prompt Caching**

**Prompt Caching** 是 LLM 提供者（如 Anthropic、OpenAI）為了最佳化效能與成本而提供的技術。它基於**精確前綴匹配**來快取已處理過的 prompt，相同的 prompt 前綴不會重複計算 Token。

::: info 快取機制範例

假設你有以下對話歷史：

```
[系統提示詞]
[使用者訊息 1]
[AI 回應 1 + 工具呼叫 A]
[使用者訊息 2]
[AI 回應 2 + 工具呼叫 A]  ← 相同的工具呼叫
[使用者訊息 3]
```

如果沒有快取，每次發送到 LLM 都需要重新計算所有 Token。有了快取，第二次發送時，提供者可以複用之前計算的結果，只需計算新的「使用者訊息 3」部分。

:::

**DCP 如何影響快取**

當 DCP 修剪工具輸出時，它會將工具的原始輸出內容替換為一個佔位符文字：`"[Output removed to save context - information superseded or no longer needed]"`

這個操作改變了訊息的精確內容（原本是完整的工具輸出，現在變成了佔位符），從而導致**快取失效**——從該點開始的快取前綴無法再被複用。

**權衡分析**

| 指標 | 無 DCP | 啟用 DCP | 影響 |
| --- | --- | --- | ---|
| **快取命中率** | ~85% | ~65% | ⬇️ 減少 20% |
| **上下文大小** | 持續增長 | 受控修剪 | ⬇️ 顯著減少 |
| **Token 節省** | 0 | 10-40% | ⬆️ 顯著增加 |
| **回應品質** | 可能下降 | 更穩定 | ⬆️ 提升（減少上下文污染） |

::: tip 為什麼快取命中率下降但成本可能更低？

快取命中率的下降並不等於成本增加。原因：

1. **Token 節省通常超過快取損失**：在長會話中，DCP 修剪節省的 Token 數量（10-40%）往往超過快取失效帶來的額外 Token 計算
2. **上下文污染減少**：冗餘內容被移除後，模型可以更專注於當前任務，回應品質更高
3. **快取命中率的絕對值仍很高**：即使降到 65%，仍有近 2/3 的內容可以被快取

測試資料顯示，大多數情況下 DCP 的 Token 節省效果更明顯。
:::

## 不同計費模式的影響

### 按請求計費（GitHub Copilot、Google Antigravity）

**最佳用例**，沒有負面影響。

這些提供者按請求次數收費，而不是按 Token 數量。因此：

- ✅ DCP 修剪節省的 Token 不直接影響費用
- ✅ 減少上下文大小可以提高回應速度
- ✅ 快取失效不會增加額外成本

::: info GitHub Copilot 和 Google Antigravity

這兩個平台按請求計費，DCP 是**零成本最佳化**——即使快取命中率下降，也不會增加費用，反而能提升效能。

:::

### 按 Token 計費（Anthropic、OpenAI）

需要權衡快取損失與 Token 節省。

**計算範例**：

假設一個長會話，包含 100 個訊息，總 Token 數為 100K：

| 場景 | 快取命中率 | 快取節省 Token | DCP 修剪節省 Token | 總節省 |
| --- | --- | --- | --- | ---|
| 無 DCP | 85% | 85K × (1-0.85) = 12.75K | 0 | 12.75K |
| 啟用 DCP | 65% | 100K × (1-0.65) = 35K | 20K（估算） | 35K + 20K - 12.75K = **42.25K** |

DCP 修剪後雖然快取命中率下降，但由於上下文減小了 20K Token，實際總節省更多。

::: warning 長會話優勢明顯

在長會話中，DCP 的優勢更明顯：

- **短會話**（< 10 訊息）：快取失效可能占主導，收益有限
- **長會話**（> 30 訊息）：上下文膨脹嚴重，DCP 修剪節省的 Token 遠超快取損失

建議：在長會話中優先啟用 DCP，短會話可以關閉。
:::

## 觀察與驗證

### 第 1 步：觀察快取 Token 使用

**為什麼**
了解快取 Token 在總 Token 中的占比，評估快取的重要性

```bash
# 在 OpenCode 中執行
/dcp context
```

**你應該看到**：類似這樣的 Token 分析

```
╭───────────────────────────────────────────────────────────╮
│                  DCP Context Analysis                     │
╰───────────────────────────────────────────────────────────╯

Session Context Breakdown:
──────────────────────────────────────────────────────────

System         15.2% │████████████████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│  25.1K tokens
User            5.1% │████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒│   8.4K tokens
Assistant       35.8% │██████████████████████████████████████▒▒▒▒▒▒▒│  59.2K tokens
Tools (45)      43.9% │████████████████████████████████████████████████│  72.6K tokens

──────────────────────────────────────────────────────────

Summary:
  Pruned:          12 tools (~15.2K tokens)
  Current context: ~165.3K tokens
  Without DCP:     ~180.5K tokens
```

**關鍵指標解讀**：

| 指標 | 含義 | 如何評估 |
| --- | --- | ---|
| **Pruned** | 已修剪的工具數量與 Token 數 | 越高說明 DCP 節省越多 |
| **Current context** | 當前會話上下文的 Token 總數 | 應該顯著小於 Without DCP |
| **Without DCP** | 如果不啟用 DCP，上下文會有多大 | 用於對比節省效果 |

### 第 2 步：對比啟用/停用 DCP

**為什麼**
透過對比，直觀感受快取與 Token 節省的差異

```bash
# 1. 停用 DCP（在設定中設定 enabled: false）
# 或者臨時關閉：
/dcp sweep 999  # 修剪所有工具，觀察快取效果

# 2. 進行幾次對話

# 3. 查看統計
/dcp stats

# 4. 重新啟用 DCP
# （修改設定或恢復預設值）

# 5. 繼續對話，對比統計
/dcp stats
```

**你應該看到**：

使用 `/dcp context` 觀察關鍵指標的變化：

| 指標 | 停用 DCP | 啟用 DCP | 說明 |
| --- | --- | --- | ---|
| **Pruned** | 0 tools | 5-20 tools | DCP 修剪的工具數量 |
| **Current context** | 較大 | 較小 | DCP 後上下文顯著減小 |
| **Without DCP** | 與 Current 相同 | 大於 Current | 顯示 DCP 的節省潛力 |

::: tip 實際測試建議

在不同的會話類型中測試：

1. **短會話**（5-10 訊息）：觀察快取是否更重要
2. **長會話**（30+ 訊息）：觀察 DCP 的節省是否更明顯
3. **重複讀取**：頻繁讀取相同檔案的場景

這能幫助你根據實際使用習慣做出最佳選擇。
:::

### 第 3 步：理解上下文污染的影響

**為什麼**
DCP 修剪不僅能節省 Token，還能減少上下文污染，提高回應品質

::: info 什麼是上下文污染？

**上下文污染**是指過多的冗餘、無關或過時的資訊充斥在對話歷史中，導致：

- 模型注意力分散，難以聚焦當前任務
- 可能引用舊的資料（如已修改的檔案內容）
- 回應品質下降，需要更多 Token 來「理解」上下文

DCP 透過移除已完成的工具輸出、重複的讀取操作等，減少了這種污染。
:::

**實際效果對比**：

| 場景 | 無 DCP | 啟用 DCP |
| --- | --- | ---|
| 讀取同一檔案 3 次 | 保留 3 次完整輸出（冗餘） | 只保留最新一次 |
| 寫入檔案後重新讀取 | 舊寫操作 + 新讀取 | 只保留新讀取 |
| 錯誤工具輸出 | 保留完整的錯誤輸入 | 只保留錯誤訊息 |

減少上下文污染後，模型可以更準確地理解當前狀態，減少「胡說八道」或引用過時資料的情況。

## 最佳實踐建議

### 根據提供者選擇策略

| 提供者 | 計費模式 | 建議 | 原因 |
| --- | --- | --- | ---|
| **GitHub Copilot** | 按請求 | ✅ 始終啟用 | 零成本最佳化，只提升效能 |
| **Google Antigravity** | 按請求 | ✅ 始終啟用 | 同上 |
| **Anthropic** | 按 Token | ✅ 長會話啟用<br>⚠️ 短會話可選 | 權衡快取與節省 |
| **OpenAI** | 按 Token | ✅ 長會話啟用<br>⚠️ 短會話可選 | 同上 |

### 根據會話類型調整設定

```jsonc
// ~/.config/opencode/dcp.jsonc 或專案設定

{
  // 長會話（> 30 訊息）：啟用所有策略
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": true },  // 推薦啟用
    "purgeErrors": { "enabled": true }
  },

  // 短會話（< 10 訊息）：只啟用去重
  "strategies": {
    "deduplication": { "enabled": true },
    "supersedeWrites": { "enabled": false },
    "purgeErrors": { "enabled": false }
  }
}
```

**策略說明**：

- **deduplication（去重）**：影響小，推薦始終啟用
- **supersedeWrites（覆蓋寫入）**：影響中等，長會話推薦
- **purgeErrors（清除錯誤）**：影響小，推薦啟用

### 動態調整策略

使用 `/dcp context` 觀察 Token 構成與修剪效果：

```bash
# 如果 Pruned 值很高，說明 DCP 正在積極節省 Token
# 可以對比 Current context 和 Without DCP 來評估節省效果

/dcp context
```

## 檢查點 ✅

確認你理解了以下要點：

- [ ] Prompt Caching 基於精確前綴匹配，訊息內容變化會失效快取
- [ ] DCP 修剪會改變訊息內容，導致快取命中率下降（約 20%）
- [ ] 在長會話中，Token 節省通常超過快取損失
- [ ] GitHub Copilot 和 Google Antigravity 按請求計費，DCP 是零成本最佳化
- [ ] Anthropic 和 OpenAI 按 Token 計費，需要權衡快取與節省
- [ ] 使用 `/dcp context` 觀察 Token 構成與修剪效果
- [ ] 根據會話長度動態調整策略設定

## 踩坑提醒

### ❌ 誤以為快取命中率下降等於成本增加

**問題**：看到快取命中率從 85% 降到 65%，以為成本會增加

**原因**：只關注了快取命中率，忽略了 Token 節省與上下文減小的效果

**解決**：使用 `/dcp context` 查看實際資料，重點關注：
1. DCP 修剪節省的 Token（`Pruned`）
2. 當前上下文大小（`Current context`）
3. 不修剪時的理論大小（`Without DCP`）

透過對比 `Without DCP` 和 `Current context`，你可以看到 DCP 實際節省的 Token 數量。

### ❌ 在短會話中過度激進修剪

**問題**：5-10 個訊息的短會話，啟用了所有策略，快取失效明顯

**原因**：短會話中上下文膨脹不嚴重，激進修剪的收益小

**解決**：
- 短會話只啟用 `deduplication` 和 `purgeErrors`
- 關閉 `supersedeWrites` 策略
- 或者完全停用 DCP（`enabled: false`）

### ❌ 忽略不同提供者的計費差異

**問題**：在 GitHub Copilot 上擔心快取失效增加成本

**原因**：沒有注意到 Copilot 是按請求計費，快取失效不增加費用

**解決**：
- Copilot 和 Antigravity：始終啟用 DCP
- Anthropic 和 OpenAI：根據會話長度調整策略

### ❌ 沒有觀察實際資料就做決策

**問題**：憑感覺判斷是否應該啟用 DCP

**原因**：沒有使用 `/dcp context` 和 `/dcp stats` 觀察實際效果

**解決**：
- 在不同會話中收集資料
- 對比啟用/停用 DCP 的差異
- 根據自己的使用習慣做出選擇

## 本課小結

**Prompt Caching 的核心機制**：

- LLM 提供者基於**精確前綴匹配**快取 prompt
- DCP 修剪改變訊息內容，導致快取失效
- 快取命中率下降（約 20%），但 Token 節省更顯著

**權衡決策矩陣**：

| 場景 | 推薦設定 | 原因 |
| --- | --- | ---|
| GitHub Copilot/Google Antigravity | ✅ 始終啟用 | 按請求計費，零成本最佳化 |
| Anthropic/OpenAI 長會話 | ✅ 啟用所有策略 | Token 節省 > 快取損失 |
| Anthropic/OpenAI 短會話 | ⚠️ 只啟用去重+清除錯誤 | 快取更重要 |

**關鍵要點**：

1. **快取命中率的下降不等於成本增加**：需要看總 Token 節省
2. **不同提供者的計費模式影響策略**：按請求 vs 按 Token
3. **根據會話長度動態調整**：長會話受益更多
4. **使用工具觀察資料**：`/dcp context` 和 `/dcp stats`

**最佳實踐總結**：

```
1. 確認你使用的提供者與計費模式
2. 根據會話長度調整策略設定
3. 定期使用 /dcp context 觀察效果
4. 在長會話中優先考慮 Token 節省
5. 在短會話中優先考慮快取命中率
```

## 下一課預告

> 下一課我們學習 **[子代理處理](/zh-tw/Opencode-DCP/opencode-dynamic-context-pruning/advanced/subagent-handling/)**。
>
> 你會學到：
> - DCP 如何檢測子代理會話
> - 為什麼子代理不參與修剪
> - 子代理中的修剪結果如何傳遞給主代理

---

## 附錄：原始碼參考

<details>
<summary><strong>點選展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| Prompt Caching 說明 | [`README.md`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/README.md) | 46-52 |
| Token 計算（含快取） | [`lib/messages/utils.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/utils.ts) | 66-78 |
| 上下文分析命令 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 68-174 |
| 快取 Token 計算 | [`lib/commands/context.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/commands/context.ts) | 106-107 |
| 日誌記錄快取 Token | [`lib/logger.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/logger.ts) | 141 |
| 修剪佔位符定義 | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 6-7 |
| 工具輸出修剪 | [`lib/messages/prune.ts`](https://github.com/Opencode-DCP/opencode-dynamic-context-pruning/blob/main/lib/messages/prune.ts) | 22-46 |

**關鍵常數**：
- 無

**關鍵函式**：
- `calculateTokens(messages, tokenizer)`：計算訊息 Token 數，包含 cache.read 和 cache.write
- `buildSessionContext(messages)`：構建會話上下文分析，區分 System/User/Assistant/Tools
- `formatContextAnalysis(analysis)`：格式化上下文分析輸出

**關鍵型別**：
- `TokenCounts`：Token 計數結構，包含 input/output/reasoning/cache

**快取機制說明**（來自 README）：
- Anthropic 和 OpenAI 基於精確前綴匹配快取 prompt
- DCP 修剪改變訊息內容，導致快取失效
- 啟用 DCP 時快取命中率約 65%，不啟用時約 85%
- 最佳用例：按請求計費的提供者（GitHub Copilot、Google Antigravity）無負面影響

</details>
