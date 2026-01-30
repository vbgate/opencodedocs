---
title: "效能最佳化：模型與上下文 | Everything Claude Code"
sidebarTitle: "回應快 10 倍的秘訣"
subtitle: "效能最佳化：提升回應速度"
description: "學習 Everything Claude Code 的效能最佳化策略。掌握模型選擇、上下文視窗管理、MCP 設定和策略性壓縮，提升回應速度和開發效率。"
tags:
  - "performance"
  - "optimization"
  - "token-usage"
prerequisite:
  - "start-quick-start"
order: 180
---

# 效能最佳化：提升回應速度

## 學完你能做什麼

- 根據任務複雜度選擇合適的模型，平衡成本和效能
- 有效管理上下文視窗，避免達到限制
- 合理設定 MCP 伺服器，最大化可用上下文
- 使用策略性壓縮保持對話邏輯連貫

## 你現在的困境

Claude Code 回應變慢？上下文視窗很快滿了？不知道什麼時候用 Haiku、Sonnet 還是 Opus？這些問題都會嚴重影響開發效率。

## 核心思路

效能最佳化的核心是**在合適的時候用合適的工具**。選擇模型、管理上下文、設定 MCP，都是在做一個權衡：速度 vs 智慧度，成本 vs 品質。

::: info 關鍵概念

**上下文視窗**是 Claude 能「記住」的對話歷史長度。目前模型支援約 200k tokens，但會受 MCP 伺服器數量、工具呼叫次數等因素影響。

:::

## 常見效能問題

### 問題 1：回應速度慢

**症狀**：簡單任務也要等很久

**可能原因**：
- 用 Opus 處理簡單任務
- 上下文過長，需要處理大量歷史資訊
- 啟用了太多 MCP 伺服器

**解決方案**：
- 用 Haiku 處理輕量任務
- 定期壓縮上下文
- 減少啟用的 MCP 數量

### 問題 2：上下文視窗很快滿了

**症狀**：開發一會兒就需要壓縮或重啟工作階段

**可能原因**：
- 啟用了太多 MCP 伺服器（每個 MCP 都會佔用上下文）
- 沒有及時壓縮對話歷史
- 使用了複雜的工具呼叫鏈

**解決方案**：
- 按需啟用 MCP，用 `disabledMcpServers` 停用不用的
- 使用策略性壓縮，在任務邊界手動壓縮
- 避免不必要的檔案讀取和搜尋

### 問題 3：Token 消耗快

**症狀**：配額用得很快，成本高

**可能原因**：
- 總是用 Opus 處理任務
- 重複讀取大量檔案
- 沒有合理使用壓縮

**解決方案**：
- 根據任務複雜度選擇模型
- 使用 `/compact` 主動壓縮
- 使用 strategic-compact hooks 智慧提醒

## 模型選擇策略

根據任務複雜度選擇合適的模型，可以大幅提升效能和降低成本。

### Haiku 4.5（90% Sonnet 能力，3x 成本節省）

**適用情境**：
- 輕量級 Agent，頻繁呼叫
- 結對程式設計和程式碼生成
- 多 Agent 系統中的 Worker agents

**範例**：
```markdown
簡單程式碼修改、格式化、生成註釋
使用 Haiku
```

### Sonnet 4.5（最佳編碼模型）

**適用情境**：
- 主要開發工作
- 協調多 Agent 工作流程
- 複雜編碼任務

**範例**：
```markdown
實現新功能、重構、修復複雜 bug
使用 Sonnet
```

### Opus 4.5（最強推理能力）

**適用情境**：
- 複雜架構決策
- 需要最大推理深度的任務
- 研究和分析任務

**範例**：
```markdown
系統設計、安全稽核、複雜問題排查
使用 Opus
```

::: tip 模型選擇提示

在 agent 設定中透過 `model` 欄位指定：
```markdown
---
name: my-agent
model: haiku  # 或 sonnet, opus
---

```

:::

## 上下文視窗管理

避免在上下文視窗使用過多會影響效能，甚至導致任務失敗。

### 避免使用上下文視窗後 20% 的任務

對於這些任務，建議先壓縮上下文：
- 大規模重構
- 跨多個檔案的功能實現
- 複雜交互的偵錯

### 上下文敏感度較低的工作

這些任務對上下文要求不高，可以在接近上限時繼續：
- 單一檔案編輯
- 獨立工具建立
- 文件更新
- 簡單 bug 修復

::: warning 重要提醒

上下文視窗受以下因素影響：
- 啟用的 MCP 伺服器數量
- 工具呼叫次數
- 歷史對話長度
- 目前工作階段的檔案操作

:::

## MCP 設定最佳化

MCP 伺服器是擴展 Claude Code 能力的重要方式，但每個 MCP 都會佔用上下文。

### 基本原則

根據 README 的建議：

```json
{
  "mcpServers": {
    "mcp-server-1": { ... },
    "mcp-server-2": { ... }
    // ... 更多設定
  },
  "disabledMcpServers": [
    "mcp-server-3",
    "mcp-server-4"
    // 停用不用的 MCP
  ]
}
```

**最佳實踐**：
- 可以設定 20-30 個 MCP 伺服器
- 每個專案啟用不超過 10 個
- 保持活躍工具數量在 80 個以下

### 按需啟用 MCP

根據專案類型選擇相關 MCP：

| 專案類型 | 推薦啟用 | 可選 |
| --- | --- | --- |
| 前端專案 | Vercel, Magic | Filesystem, GitHub |
| 後端專案 | Supabase, ClickHouse | GitHub, Railway |
| 全棧專案 | 全部 | - |
| 工具庫 | GitHub | Filesystem |

::: tip 如何切換 MCP

在專案設定（`~/.claude/settings.json`）中使用 `disabledMcpServers`：
```json
{
  "disabledMcpServers": ["cloudflare-observability", "clickhouse-io"]
}
```

:::

## 策略性壓縮

自動壓縮會在任意時刻觸發，可能打斷任務邏輯。策略性壓縮在任務邊界手動執行，保持邏輯連貫。

### 為什麼需要策略性壓縮

**自動壓縮的問題**：
- 往往在任務中途觸發，遺失重要上下文
- 不了解任務邏輯邊界
- 可能打斷複雜的多步驟操作

**策略性壓縮的優勢**：
- 在任務邊界壓縮，保留關鍵資訊
- 邏輯更清晰
- 避免中斷重要流程

### 最佳壓縮時機

1. **探索完成後，執行前** - 壓縮研究上下文，保留實現計劃
2. **完成一個里程碑後** - 為下一階段重新開始
3. **任務切換前** - 清除探索上下文，準備新任務

### Strategic Compact Hook

本擴充功能包含 `strategic-compact` skill，自動提醒你何時應該壓縮。

**Hook 工作原理**：
- 追蹤工具呼叫次數
- 達到閾值時提醒（預設 50 次呼叫）
- 之後每 25 次呼叫提醒一次

**設定閾值**：
```bash
# 設定環境變數
export COMPACT_THRESHOLD=40
```

**Hook 設定**（已包含在 `hooks/hooks.json` 中）：
```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }]
}
```

### 使用技巧

1. **規劃後壓縮** - 計劃確定後，壓縮重新開始
2. **偵錯後壓縮** - 清除錯誤解決上下文，繼續下一步
3. **實現中不要壓縮** - 保留相關變更的上下文
4. **關注提醒** - Hook 告訴你「什麼時候」，你決定「是否壓縮」

::: tip 查看目前狀態

使用 `/checkpoint` 命令可以儲存目前狀態，再壓縮工作階段。

:::

## 效能檢查清單

在日常使用中，定期檢查以下項目：

### 模型使用
- [ ] 簡單任務用 Haiku 而不是 Sonnet/Opus
- [ ] 複雜推理用 Opus 而不是 Sonnet
- [ ] Agent 設定中指定了合適的 model

### 上下文管理
- [ ] 啟用的 MCP 不超過 10 個
- [ ] 定期使用 `/compact` 壓縮
- [ ] 在任務邊界而不是任務中途壓縮

### MCP 設定
- [ ] 專案只啟用需要的 MCP
- [ ] 用 `disabledMcpServers` 管理不用的 MCP
- [ ] 定期檢查活躍工具數量（建議 < 80）

## 常見問題

### Q: 什麼時候用 Haiku、Sonnet 還是 Opus？

**A**: 根據任務複雜度：
- **Haiku**: 輕量任務、頻繁呼叫（如程式碼格式化、註釋生成）
- **Sonnet**: 主要開發工作、協調 Agent（如功能實現、重構）
- **Opus**: 複雜推理、架構決策（如系統設計、安全稽核）

### Q: 上下文視窗滿了怎麼辦？

**A**: 立即使用 `/compact` 壓縮工作階段。如果啟用了 strategic-compact hook，它會在合適的時候提醒你。壓縮前可以用 `/checkpoint` 儲存重要狀態。

### Q: 如何知道啟用了多少個 MCP？

**A**: 查看 `~/.claude/settings.json` 中的 `mcpServers` 和 `disabledMcpServers` 設定。活躍的 MCP 數量 = 總數 - `disabledMcpServers` 中的數量。

### Q: 為什麼我的回應特別慢？

**A**: 檢查以下幾點：
1. 是否用了 Opus 處理簡單任務？
2. 上下文視窗是否快滿了？
3. 啟用了太多 MCP 伺服器？
4. 是否在執行大規模檔案操作？

## 本課小結

效能最佳化的核心是「在合適的時候用合適的工具」：

- **模型選擇**：根據任務複雜度選擇 Haiku/Sonnet/Opus
- **上下文管理**：避免視窗後 20%，及時壓縮
- **MCP 設定**：按需啟用，不超過 10 個
- **策略性壓縮**：在任務邊界手動壓縮，保持邏輯連貫

## 相關課程

- [Token 最佳化策略](../../advanced/token-optimization/) - 深入學習上下文視窗管理
- [Hooks 自動化](../../advanced/hooks-automation/) - 了解 strategic-compact hook 的設定
- [MCP 伺服器設定](../../start/mcp-setup/) - 學習如何設定 MCP 伺服器

---

## 附錄：源碼參考

<details>
<summary><strong>點擊展開查看源碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 效能最佳化規則 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| 策略性壓縮 Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| Hooks 設定 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Strategic Compact Hook | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json#L46-L54) | 46-54 |
| Suggest Compact 指令碼 | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | - |
| MCP 設定範例 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | - |

**關鍵規則**：
- **模型選擇**：Haiku（輕量任務）、Sonnet（主要開發）、Opus（複雜推理）
- **上下文視窗**：避免使用後 20%，及時壓縮
- **MCP 設定**：每專案啟用不超過 10 個，活躍工具 < 80 個
- **策略性壓縮**：在任務邊界手動壓縮，避免自動壓縮中斷

**關鍵環境變數**：
- `COMPACT_THRESHOLD`：工具呼叫次數閾值（預設：50）

</details>
