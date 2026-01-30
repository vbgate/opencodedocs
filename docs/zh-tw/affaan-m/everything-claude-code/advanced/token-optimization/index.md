---
title: "Token 最佳化：Context Window | Everything Claude Code"
sidebarTitle: "Context Window 飽和了怎麼辦"
subtitle: "Token 最佳化：Context Window"
description: "學習 Claude Code Token 最佳化策略。掌握模型選擇、策略性壓縮和 MCP 設定，最大化 Context Window 效率，提升回應品質。"
tags:
  - "token-optimization"
  - "context-management"
  - "performance"
prerequisite:
  - "start-quick-start"
order: 110
---

# Token 最佳化策略：Context Window 管理

## 學完你能做什麼

- 根據任務類型選擇合適的模型，平衡成本和效能
- 使用策略性壓縮在邏輯邊界保留關鍵上下文
- 合理設定 MCP 伺服器，避免過度消耗 Context Window
- 避免 Context Window 飽和，保持回應品質

## 你現在的困境

你遇到過這些問題嗎？

- 對話進行到一半，突然上下文被壓縮，關鍵資訊遺失
- 啟用了太多 MCP 伺服器，Context Window 從 200k 降到 70k
- 大型重構時，模型「忘記」了之前的討論
- 不知道什麼時候該壓縮，什麼時候不該

## 什麼時候用這一招

- **需要處理複雜任務時** - 選擇合適的模型和上下文管理策略
- **Context Window 接近飽和時** - 使用策略性壓縮保留關鍵資訊
- **設定 MCP 伺服器時** - 平衡工具數量和上下文容量
- **長期工作階段時** - 在邏輯邊界壓縮，避免自動壓縮遺失資訊

## 核心思路

Token 最佳化的核心不是「減少使用」，而是**在關鍵時刻保留有價值的資訊**。

### 三大最佳化支柱

1. **模型選擇策略** - 不同任務用不同模型，避免「殺雞用牛刀」
2. **策略性壓縮** - 在邏輯邊界壓縮，而不是任意時刻
3. **MCP 設定管理** - 控制啟用的工具數量，保護 Context Window

### 關鍵概念

::: info 什麼是 Context Window？

Context Window 是 Claude Code 能「記住」的對話歷史長度。目前模型支援約 200k tokens，但會受以下因素影響：

- **啟用的 MCP 伺服器** - 每個 MCP 都消耗系統提示空間
- **載入的 Skills** - 技能定義佔用上下文
- **對話歷史** - 你和 Claude 的對話記錄

當上下文接近飽和，Claude 會自動壓縮歷史，可能遺失關鍵資訊。
:::

::: tip 為什麼手動壓縮更好？

Claude 的自動壓縮在任意時刻觸發，往往在任務中間打斷流程。策略性壓縮讓你在**邏輯邊界**（如完成規劃後、切換任務前）主動壓縮，保留重要上下文。
:::

## 跟我做

### 第 1 步：選擇合適的模型

根據任務複雜度選擇模型，避免浪費成本和上下文。

**為什麼**

不同模型的推理能力和成本差異很大，合理選擇可以節省大量 Token。

**模型選擇指南**

| 模型 | 適用場景 | 成本 | 推理能力 |
| --- | --- | --- | --- |
| **Haiku 4.5** | 輕量級 agent、頻繁呼叫、程式碼產生 | 低（Sonnet 的 1/3） | 90% 的 Sonnet 能力 |
| **Sonnet 4.5** | 主開發工作、複雜編碼任務、orchestration | 中 | 最佳編碼模型 |
| **Opus 4.5** | 架構決策、深度推理、研究分析 | 高 | 最強推理能力 |

**設定方法**

在 `agents/` 目錄的 agent 檔案中設定：

```markdown
---
name: planner
description: 規劃複雜功能的實作步驟
model: opus
---

你是一個高級規劃者...
```

**你應該看到**：
- 高推理任務（如架構設計）使用 Opus，品質更高
- 編碼任務使用 Sonnet，性價比最佳
- 頻繁呼叫的 worker agent 使用 Haiku，節省成本

### 第 2 步：啟用策略性壓縮 Hook

設定 Hook 在邏輯邊界提醒你壓縮上下文。

**為什麼**

自動壓縮在任意時刻觸發，可能遺失關鍵資訊。策略性壓縮讓你決定壓縮時機。

**設定步驟**

確保 `hooks/hooks.json` 中有 PreToolUse 和 PreCompact 設定：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Edit\" || tool == \"Write\"",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
          }
        ],
        "description": "Suggest manual compaction at logical intervals"
      }
    ],
    "PreCompact": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
          }
        ],
        "description": "Save state before context compaction"
      }
    ]
  }
}
```

**自訂閾值**

設定環境變數 `COMPACT_THRESHOLD` 控制建議頻率（預設 50 次工具呼叫）：

```json
// 在 ~/.claude/settings.json 中新增
{
  "env": {
    "COMPACT_THRESHOLD": "50"  // 50 次工具呼叫後首次建議
  }
}
```

**你應該看到**：
- 每次編輯或寫入檔案後，Hook 統計工具呼叫次數
- 達到閾值（預設 50 次）後，看到提示：
  ```
  [StrategicCompact] 50 tool calls reached - consider /compact if transitioning phases
  ```
- 之後每 25 次工具呼叫，看到提示：
  ```
  [StrategicCompact] 75 tool calls - good checkpoint for /compact if context is stale
  ```

### 第 3 步：在邏輯邊界壓縮

根據 Hook 的提示，在合適的時機手動壓縮。

**為什麼**

在任務切換或完成里程碑後壓縮，可以保留關鍵上下文，清除冗餘資訊。

**壓縮時機指南**

✅ **推薦壓縮的時機**：
- 完成規劃後，開始實作前
- 完成一個功能里程碑，開始下一個
- 除錯完成後，繼續開發前
- 切換到不同的任務類型時

❌ **避免壓縮的時機**：
- 實作功能的過程中
- 除錯問題中間
- 多個相關檔案修改中

**操作步驟**

當看到 Hook 提示後：

1. 評估目前任務階段
2. 如果適合壓縮，執行：
   ```bash
   /compact
   ```
3. 等待 Claude 總結上下文
4. 驗證關鍵資訊已保留

**你應該看到**：
- 壓縮後，Context Window 釋放大量空間
- 關鍵資訊（如實作計畫、已完成的功能）被保留
- 新的互動從精簡的上下文開始

### 第 4 步：最佳化 MCP 設定

控制啟用的 MCP 伺服器數量，保護 Context Window。

**為什麼**

每個 MCP 伺服器都消耗系統提示空間。啟用太多會大幅壓縮 Context Window。

**設定原則**

根據 README 中的經驗：

```json
{
  "mcpServers": {
    // 可以設定 20-30 個 MCP...
    "github": { ... },
    "supabase": { ... },
    // ...更多設定
  },
  "disabledMcpServers": [
    "firecrawl",       // 停用不常用的 MCP
    "clickhouse",
    // ...根據專案需求停用
  ]
}
```

**最佳實務**：

- **設定所有 MCP**（20-30 個），在專案中靈活切換
- **啟用 < 10 個 MCP**，保持活躍工具 < 80 個
- **根據專案選擇**：開發後端時啟用資料庫相關，前端時啟用建置相關

**驗證方法**

檢查工具數量：

```bash
// Claude Code 會顯示目前啟用的工具
/tool list
```

**你應該看到**：
- 工具總數 < 80 個
- Context Window 保持在 180k+（避免降到 70k 以下）
- 根據專案需求動態調整啟用清單

### 第 5 步：配合 Memory Persistence

使用 Hooks 讓關鍵狀態在壓縮後保留。

**為什麼**

策略性壓縮會遺失上下文，但關鍵狀態（如實作計畫、checkpoint）需要保留。

**設定 Hooks**

確保以下 Hook 已啟用：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
          }
        ],
        "description": "Load previous context and detect package manager on new session"
      }
    ],
    "SessionEnd": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
          }
        ],
        "description": "Persist session state on end"
      }
    ]
  }
}
```

**工作流程**：

1. 完成任務後，使用 `/checkpoint` 儲存狀態
2. 壓縮上下文前，PreCompact Hook 自動儲存
3. 新工作階段開始時，SessionStart Hook 自動載入
4. 關鍵資訊（計畫、狀態）持久化，不受壓縮影響

**你應該看到**：
- 壓縮後，重要狀態仍然可用
- 新工作階段自動恢復之前的上下文
- 關鍵決策和實作計畫不會遺失

## 檢查點 ✅

- [ ] 已設定 `strategic-compact` Hook
- [ ] 根據任務選擇合適的模型（Haiku/Sonnet/Opus）
- [ ] 啟用的 MCP < 10 個，工具總數 < 80
- [ ] 在邏輯邊界（完成規劃/里程碑）壓縮
- [ ] Memory Persistence Hooks 已啟用，關鍵狀態可保留

## 踩坑提醒

### ❌ 常見錯誤 1：所有任務都用 Opus

**問題**：Opus 雖然最強，但成本是 Sonnet 的 10 倍，Haiku 的 30 倍。

**修正**：根據任務類型選擇模型：
- 頻繁呼叫的 agent（如程式碼審查、格式化）用 Haiku
- 主開發工作用 Sonnet
- 架構決策、深度推理用 Opus

### ❌ 常見錯誤 2：忽略 Hook 壓縮提示

**問題**：看到 `[StrategicCompact]` 提示後繼續工作，上下文最終被自動壓縮，遺失關鍵資訊。

**修正**：評估任務階段，在合適時機回應提示執行 `/compact`。

### ❌ 常見錯誤 3：啟用所有 MCP 伺服器

**問題**：設定了 20+ 個 MCP 並全部啟用，Context Window 從 200k 降到 70k。

**修正**：使用 `disabledMcpServers` 停用不常用的 MCP，保持 < 10 個活躍 MCP。

### ❌ 常見錯誤 4：在實作過程中壓縮

**問題**：壓縮了正在實作功能的上下文，模型「忘記」了之前的討論。

**修正**：只在邏輯邊界（完成規劃、切換任務、里程碑完成）壓縮。

## 本課小結

Token 最佳化的核心是**在關鍵時刻保留有價值的資訊**：

1. **模型選擇** - Haiku/Sonnet/Opus 各有適用場景，合理選擇節省成本
2. **策略性壓縮** - 在邏輯邊界手動壓縮，避免自動壓縮遺失資訊
3. **MCP 管理** - 控制啟用數量，保護 Context Window
4. **Memory Persistence** - 讓關鍵狀態在壓縮後仍然可用

遵循這些策略，你可以最大化 Claude Code 的上下文效率，避免上下文飽和導致的品質下降。

## 下一課預告

> 下一課我們學習 **[驗證迴圈：Checkpoint 與 Evals](../verification-loop/)**。
>
> 你會學到：
> - 如何使用 Checkpoint 儲存和恢復工作狀態
> - 持續驗證的 Eval Harness 方法
> - Grader 類型和 Pass@K 指標
> - 驗證迴圈在 TDD 中的應用

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-25

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 策略性壓縮 Skill | [`skills/strategic-compact/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/strategic-compact/SKILL.md) | 1-64 |
| 壓縮建議 Hook | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| 壓縮前儲存 Hook | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| 效能最佳化規則 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Hooks 設定 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Context Window 說明 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 349-359 |

**關鍵常數**：
- `COMPACT_THRESHOLD = 50`：工具呼叫閾值（預設值）
- `MCP_LIMIT = 10`：建議啟用的 MCP 數量上限
- `TOOL_LIMIT = 80`：建議的工具總數上限

**關鍵函式**：
- `suggest-compact.js:main()`：統計工具呼叫次數並建議壓縮
- `pre-compact.js:main()`：在壓縮前儲存工作階段狀態

</details>
