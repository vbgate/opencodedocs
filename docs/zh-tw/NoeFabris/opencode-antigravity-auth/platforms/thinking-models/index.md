---
title: "Thinking 模型設定 | opencode-antigravity-auth"
sidebarTitle: "讓 AI 深度思考"
subtitle: "Thinking 模型：Claude 與 Gemini 3 的思考能力"
description: "學習設定 Claude 與 Gemini 3 Thinking 模型。掌握 thinking budget、thinking level 和 variant 設定方法。"
tags:
  - "Thinking 模型"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "variant 設定"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 4
---

# Thinking 模型：Claude 與 Gemini 3 的思考能力

## 學完你能做什麼

- 設定 Claude Opus 4.5、Sonnet 4.5 Thinking 模型的 thinking budget
- 使用 Gemini 3 Pro/Flash 的 thinking level（minimal/low/medium/high）
- 透過 OpenCode variant 系統靈活調整思考強度
- 理解 interleaved thinking（工具呼叫時的思考機制）
- 掌握思考區塊保留策略（keep_thinking 設定）

## 你現在的困境

你想讓 AI 模型在複雜任務上表現更好——比如多步推理、程式碼除錯或架構設計。但你知道：

- 普通模型回答太快，思考不夠深入
- Claude 官方限制 thinking 功能，難以存取
- Gemini 3 的 thinking level 設定不清晰
- 不清楚 how much thinking is enough（budget 應該設多少）
- 閱讀思考區塊內容時遇到簽名錯誤

## 什麼時候用這一招

**適用場景**：
- 需要多步推理的複雜問題（演算法設計、系統架構）
- 需要仔細思考的程式碼審查或除錯
- 需要深度分析的長文件或程式碼庫
- 工具呼叫密集的任務（需要 interleaved thinking）

**不適用場景**：
- 簡單問答（浪費 thinking quota）
- 快速原型驗證（速度優先）
- 事實查詢（不需要推理）

## 🎒 開始前的準備

::: warning 前置檢查

 1. **已完成外掛安裝和認證**：參考 [快速安裝](../../start/quick-install/) 和 [首次認證](../../start/first-auth-login/)
 2. **了解基本模型使用**：參考 [首次請求](../../start/first-request/)
3. **有可用的 Thinking 模型**：確保你的帳戶有權限存取 Claude Opus 4.5/Sonnet 4.5 Thinking 或 Gemini 3 Pro/Flash

:::

---

## 核心思路

### 什麼是 Thinking 模型

**Thinking 模型**會在產生最終答案前，先進行內部推理（thinking blocks）。這些思考內容：

- **不被計費**：Thinking tokens 不計入常規輸出配額（具體計費規則以 Antigravity 官方為準）
- **提升推理品質**：更多思考 → 更準確、更有邏輯的回答
- **消耗時間**：Thinking 增加回應延遲，但換來更好的結果

**關鍵區別**：

| 普通模型 | Thinking 模型 |
| --- | --- |
| 直接產生答案 | 先思考 → 再產生答案 |
| 快速但可能淺薄 | 慢速但更深入 |
| 適合簡單任務 | 適合複雜任務 |

### 兩種 Thinking 實現

Antigravity Auth 外掛支援兩種 Thinking 實現：

#### Claude Thinking（Opus 4.5、Sonnet 4.5）

- **Token-based budget**：用數字控制思考量（如 8192、32768）
- **Interleaved thinking**：可以在工具呼叫前後思考
- **Snake_case keys**：使用 `include_thoughts`、`thinking_budget`

#### Gemini 3 Thinking（Pro、Flash）

- **Level-based**：用字串控制思考強度（minimal/low/medium/high）
- **CamelCase keys**：使用 `includeThoughts`、`thinkingLevel`
- **模型差異**：Flash 支援 all 4 levels，Pro 只支援 low/high

---

## 跟我做

### 第 1 步：透過 Variant 設定 Thinking 模型

OpenCode 的 variant 系統讓你在模型選擇器中直接選擇 thinking 強度，而無需記憶複雜的模型名。

#### 檢查現有設定

檢視你的模型設定檔案（通常在 `.opencode/models.json` 或系統設定目錄）：

```bash
## 檢視模型設定
cat ~/.opencode/models.json
```

#### 設定 Claude Thinking 模型

找到 `antigravity-claude-sonnet-4-5-thinking` 或 `antigravity-claude-opus-4-5-thinking`，新增 variants：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "limit": { "context": 200000, "output": 64000 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "medium": { "thinkingConfig": { "thinkingBudget": 16384 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  }
}
```

**設定說明**：
- `low`：8192 tokens - 輕量思考，適合中等複雜度任務
- `medium`：16384 tokens - 平衡思考與速度
- `max`：32768 tokens - 最大思考，適合最複雜任務

#### 設定 Gemini 3 Thinking 模型

**Gemini 3 Pro**（只支援 low/high）：

```json
{
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro (Antigravity)",
    "limit": { "context": 1048576, "output": 65535 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**Gemini 3 Flash**（支援 all 4 levels）：

```json
{
  "antigravity-gemini-3-flash": {
    "name": "Gemini 3 Flash (Antigravity)",
    "limit": { "context": 1048576, "output": 65536 },
    "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
    "variants": {
      "minimal": { "thinkingLevel": "minimal" },
      "low": { "thinkingLevel": "low" },
      "medium": { "thinkingLevel": "medium" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

**設定說明**：
- `minimal`：最低思考，最快回應（僅 Flash）
- `low`：輕量思考
- `medium`：平衡思考（僅 Flash）
- `high`：最大思考（最慢但最深入）

**你應該看到**：在 OpenCode 的模型選擇器中，選擇 Thinking 模型後可以看到 variant 下拉選單。

### 第 2 步：使用 Thinking 模型發起請求

設定完成後，你可以透過 OpenCode 選擇模型和 variant：

```bash
## 使用 Claude Sonnet 4.5 Thinking (max)
opencode run "幫我設計一個分散式快取系統的架構" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## 使用 Gemini 3 Pro (high)
opencode run "分析這段程式碼的效能瓶頸" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## 使用 Gemini 3 Flash (minimal - 最快)
opencode run "快速總結這個檔案的內容" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**你應該看到**：模型會先輸出 thinking blocks（思考內容），然後產生最終答案。

### 第 3 步：理解 Interleaved Thinking

Interleaved thinking 是 Claude 模型的特殊能力——它可以在工具呼叫的前後進行思考。

**場景範例**：讓 AI 使用工具（如檔案操作、資料庫查詢）完成任務時：

```
Thinking: 我需要先讀取設定檔，然後根據內容決定下一步...

[呼叫工具: read_file("config.json")]

Tool Result: { "port": 8080, "mode": "production" }

Thinking: 連接埠是 8080，生產模式。我需要驗證設定是否正確...

[呼叫工具: validate_config({ "port": 8080, "mode": "production" })]

Tool Result: { "valid": true }

Thinking: 設定有效。現在我可以啟動服務了。

[產生最終答案]
```

**為什麼重要**：
- 工具呼叫前後都有思考 → 更智慧的決策
- 適應工具回傳結果 → 動態調整策略
- 避免盲目執行 → 減少錯誤操作

::: tip 外掛自動處理

你不需要手動設定 interleaved thinking。Antigravity Auth 外掛會自動偵測 Claude Thinking 模型並注入系統指令：
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### 第 4 步：控制思考區塊保留策略

預設情況下，外掛會**剝離思考區塊**以提高可靠性（避免簽名錯誤）。如果你想閱讀思考內容，需要設定 `keep_thinking`。

#### 為什麼預設剝離？

**簽名錯誤問題**：
- Thinking blocks 在多輪對話中需要簽名匹配
- 如果保留所有思考區塊，可能導致簽名衝突
- 剝離思考區塊是更穩定的方案（但失去思考內容）

#### 啟用思考區塊保留

建立或編輯設定檔案：

**Linux/macOS**：`~/.config/opencode/antigravity.json`

**Windows**：`%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

或使用環境變數：

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**你應該看到**：
- `keep_thinking: false`（預設）：只看到最終答案，思考區塊被隱藏
- `keep_thinking: true`：看到完整思考過程（可能在某些多輪對話中遇到簽名錯誤）

::: warning 推薦做法

- **生產環境**：使用預設 `keep_thinking: false`，確保穩定性
- **除錯/學習**：暫時啟用 `keep_thinking: true`，觀察思考過程
- **如果遇到簽名錯誤**：關閉 `keep_thinking`，外掛會自動恢復

:::

### 第 5 步：檢查 Max Output Tokens

Claude Thinking 模型需要更大的輸出令牌限制（maxOutputTokens），否則思考 budget 可能無法完全使用。

**外掛自動處理**：
- 如果你設定了 thinking budget，外掛會自動調整 `maxOutputTokens` 到 64,000
- 原始碼位置：`src/plugin/transform/claude.ts:78-90`

**手動設定（選用）**：

如果你手動設定 `maxOutputTokens`，確保它大於 thinking budget：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // 必須 >= thinkingBudget
      }
    }
  }
}
```

**你應該看到**：
- 如果 `maxOutputTokens` 過小，外掛會自動調整為 64,000
- 除錯日誌中會顯示 "Adjusted maxOutputTokens for thinking model"

---

## 檢查點 ✅

驗證你的設定是否正確：

### 1. 驗證 Variant 可見性

在 OpenCode 中：

1. 開啟模型選擇器
2. 選擇 `Claude Sonnet 4.5 Thinking`
3. 檢查是否有 variant 下拉選單（low/medium/max）

**預期結果**：能看到 3 個 variant 選項。

### 2. 驗證 Thinking 內容輸出

```bash
opencode run "思考 3 步：1+1=？為什麼？" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**預期結果**：
- 如果 `keep_thinking: true`：看到詳細思考過程
- 如果 `keep_thinking: false`（預設）：直接看到答案 "2"

### 3. 驗證 Interleaved Thinking（需要工具呼叫）

```bash
## 使用需要工具呼叫的任務
opencode run "讀取目前目錄的檔案列表，然後總結檔案類型" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**預期結果**：
- 在工具呼叫前後看到思考內容
- AI 會根據工具回傳結果調整策略

---

## 踩坑提醒

### ❌ 錯誤 1：Thinking Budget 超出 Max Output Tokens

**問題**：設定 `thinkingBudget: 32768`，但 `maxOutputTokens: 20000`

**錯誤資訊**：
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**解決方法**：
- 讓外掛自動處理（推薦）
- 或手動設定 `maxOutputTokens >= thinkingBudget`

### ❌ 錯誤 2：Gemini 3 Pro 使用 unsupported level

**問題**：Gemini 3 Pro 只支援 low/high，但你嘗試使用 `minimal`

**錯誤資訊**：
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**解決方法**：只使用 Pro 支援的 levels（low/high）

### ❌ 錯誤 3：多輪對話簽名錯誤（keep_thinking: true）

**問題**：啟用 `keep_thinking: true` 後，多輪對話遇到錯誤

**錯誤資訊**：
```
Signature mismatch in thinking blocks
```

**解決方法**：
- 暫時關閉 `keep_thinking`：`export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- 或重新開始會話

### ❌ 錯誤 4：Variant 不顯示

**問題**：設定了 variants，但在 OpenCode 模型選擇器中看不到

**可能原因**：
- 設定檔案路徑錯誤
- JSON 語法錯誤（缺少逗號、引號）
- 模型 ID 不匹配

**解決方法**：
1. 檢查設定檔案路徑：`~/.opencode/models.json` 或 `~/.config/opencode/models.json`
2. 驗證 JSON 語法：`cat ~/.opencode/models.json | python -m json.tool`
3. 檢查模型 ID 是否與外掛回傳的一致

---

## 本課小結

Thinking 模型透過在產生答案前進行內部推理，提升複雜任務的回答品質：

| 功能 | Claude Thinking | Gemini 3 Thinking |
| --- | --- | ---|
| **設定方式** | `thinkingBudget`（數字） | `thinkingLevel`（字串） |
| **Levels** | 自訂 budget | minimal/low/medium/high |
| **Keys** | snake_case（`include_thoughts`） | camelCase（`includeThoughts`） |
| **Interleaved** | ✅ 支援 | ❌ 不支援 |
| **Max Output** | 自動調整到 64,000 | 使用預設值 |

**關鍵設定**：
- **Variant 系統**：透過 `thinkingConfig.thinkingBudget`（Claude）或 `thinkingLevel`（Gemini 3）設定
- **keep_thinking**：預設 false（穩定），true（可讀思考內容）
- **Interleaved thinking**：自動啟用，無需手動設定

---

## 下一課預告

> 下一課我們學習 **[Google Search Grounding](../google-search-grounding/)**。
>
> 你會學到：
> - 為 Gemini 模型啟用 Google Search 檢索
> - 設定動態檢索閾值
> - 提升事實準確性，減少幻覺

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開檢視原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | ---|
| Claude Thinking 設定建構 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Gemini 3 Thinking 設定建構 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Gemini 2.5 Thinking 設定建構 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Claude Thinking 模型偵測 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Gemini 3 模型偵測 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Interleaved Thinking Hint 注入 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
| Max Output Tokens 自動調整 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 78-90 |
| keep_thinking 設定 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Claude Thinking 應用轉換 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Gemini Thinking 應用轉換 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**關鍵常數**：
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000`：Claude Thinking 模型的最大輸出令牌數
- `CLAUDE_INTERLEAVED_THINKING_HINT`：注入到系統指令的 interleaved thinking 提示

**關鍵函式**：
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)`：建構 Claude Thinking 設定（snake_case keys）
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)`：建構 Gemini 3 Thinking 設定（level string）
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)`：建構 Gemini 2.5 Thinking 設定（numeric budget）
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)`：確保 maxOutputTokens 足夠大
- `appendClaudeThinkingHint(payload, hint)`：注入 interleaved thinking hint
- `isClaudeThinkingModel(model)`：偵測是否為 Claude Thinking 模型
- `isGemini3Model(model)`：偵測是否為 Gemini 3 模型

</details>
