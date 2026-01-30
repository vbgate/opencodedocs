---
title: "可用模型: Claude 與 Gemini 設定指南 | Antigravity Auth"
sidebarTitle: "選對 AI 模型"
subtitle: "了解所有可用的模型及其變體設定"
description: "學習 Antigravity Auth 的模型設定。掌握 Claude Opus 4.5、Sonnet 4.5 和 Gemini 3 Pro/Flash 的 Thinking 變體使用方法。"
tags:
  - "平台"
  - "模型"
  - "Claude"
  - "Gemini"
  - "Thinking"
prerequisite:
  - "start-what-is-antigravity-auth"
  - "start-quick-install"
order: 1
---

# 了解所有可用的模型及其變體設定

## 學完你能做什麼

- 選擇最適合你需求的 Claude 或 Gemini 模型
- 理解 Thinking 模式的不同級別（low/max 或 minimal/low/medium/high）
- 理解 Antigravity 和 Gemini CLI 兩個獨立的配額池
- 使用 `--variant` 參數動態調整思考預算

## 你現在的困境

剛安裝好外掛，面對一長串模型名稱，不知道該選哪個：
- `antigravity-gemini-3-pro` 和 `gemini-3-pro-preview` 有什麼區別？
- `--variant=max` 是什麼意思？不指定會怎樣？
- Claude 的 thinking 模式和 Gemini 的 thinking 模式一樣嗎？

## 核心思路

Antigravity Auth 支援兩大類模型，每個都有獨立的配額池：

1. **Antigravity 配額**：透過 Google Antigravity API 存取，包括 Claude 和 Gemini 3
2. **Gemini CLI 配額**：透過 Gemini CLI API 存取，包括 Gemini 2.5 和 Gemini 3 Preview

::: info Variant 系統
OpenCode 的 variant 系統讓你不用為每個 thinking 級別定義獨立模型，而是在執行時透過 `--variant` 參數指定設定。這樣模型選擇器更簡潔，設定也更靈活。
:::

## Antigravity 配額模型

這些模型透過 `antigravity-` 前綴存取，使用 Antigravity API 的配額池。

### Gemini 3 系列

#### Gemini 3 Pro
| 模型名 | Variants | Thinking 級別 | 說明 |
| --- | --- | --- | --- |
| `antigravity-gemini-3-pro` | low, high | low, high | 平衡品質和速度 |

**Variant 設定範例**：
```bash
# 低思考級別（更快）
opencode run "快速回答" --model=google/antigravity-gemini-3-pro --variant=low

# 高思考級別（更深入）
opencode run "複雜推理" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| 模型名 | Variants | Thinking 級別 | 說明 |
| --- | --- | --- | --- |
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | 極速回應，支援 4 種思考級別 |

**Variant 設定範例**：
```bash
# 最小思考（最快）
opencode run "簡單任務" --model=google/antigravity-gemini-3-flash --variant=minimal

# 平衡思考（預設）
opencode run "常規任務" --model=google/antigravity-gemini-3-flash --variant=medium

# 最大思考（最深入）
opencode run "複雜分析" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro 不支援 minimal/medium
`gemini-3-pro` 只支援 `low` 和 `high` 兩個級別。如果你嘗試使用 `--variant=minimal` 或 `--variant=medium`，API 會回傳錯誤。
:::

### Claude 系列

#### Claude Sonnet 4.5（非 Thinking）
| 模型名 | Variants | Thinking 預算 | 說明 |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5` | — | — | 標準模式，無擴展思考 |

**使用範例**：
```bash
# 標準模式
opencode run "日常對話" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| 模型名 | Variants | Thinking 預算（tokens） | 說明 |
| --- | --- | --- | --- |
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | 平衡模式 |

**Variant 設定範例**：
```bash
# 輕量思考（更快）
opencode run "快速推理" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# 最大思考（最深入）
opencode run "深度分析" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| 模型名 | Variants | Thinking 預算（tokens） | 說明 |
| --- | --- | --- | --- |
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | 最強推理能力 |

**Variant 設定範例**：
```bash
# 輕量思考
opencode run "高品質回答" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# 最大思考（用於最複雜任務）
opencode run "專家級分析" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Claude vs Gemini 思考模式區別
- **Claude** 使用數字化的 thinking budget（tokens），如 8192、32768
- **Gemini 3** 使用字串化的 thinking level（minimal/low/medium/high）
- 兩者都會在回答前展示推理過程，但設定方式不同
:::

## Gemini CLI 配額模型

這些模型沒有 `antigravity-` 前綴，使用 Gemini CLI API 的獨立配額池。它們不支援 thinking 模式。

| 模型名 | 說明 |
| --- | --- |
| `gemini-2.5-flash` | Gemini 2.5 Flash（快速回應） |
| `gemini-2.5-pro` | Gemini 2.5 Pro（平衡品質和速度） |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview（預覽版） |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview（預覽版） |

**使用範例**：
```bash
# Gemini 2.5 Pro（無 thinking）
opencode run "快速任務" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview（無 thinking）
opencode run "預覽模型測試" --model=google/gemini-3-pro-preview
```

::: info Preview 模型
`gemini-3-*-preview` 模型是 Google 官方預覽版本，可能不穩定或隨時變更。如果你想使用 Thinking 功能，請使用 `antigravity-gemini-3-*` 模型。
:::

## 模型對比總覽

| 特性 | Claude 4.5 | Gemini 3 | Gemini 2.5 |
| --- | --- | --- | --- |
| **Thinking 支援** | ✅（thinkingBudget） | ✅（thinkingLevel） | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **配額池** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **適用情境** | 複雜推理、程式設計 | 通用任務 + 搜尋 | 快速回應、簡單任務 |

## 🎯 如何選擇模型

### 選擇 Claude 還是 Gemini？

- **選 Claude**：你需要更強的邏輯推理能力、更穩定的程式碼生成
- **選 Gemini 3**：你需要 Google Search、更快的回應速度

### 選擇 Thinking 還是標準模式？

- **用 Thinking**：複雜推理、多步驟任務、需要看到推理過程
- **用標準模式**：簡單問答、快速回應、不需要推理展示

### 選擇哪個 Thinking 級別？

| 級別 | Claude (tokens) | Gemini 3 | 適用情境 |
| --- | --- | --- | --- |
| **minimal** | — | Flash 專用 | 極速任務，如翻譯、摘要 |
| **low** | 8192 | Pro/Flash | 平衡品質和速度，適合大多數任務 |
| **medium** | — | Flash 專用 | 中等複雜度任務 |
| **high/max** | 32768 | Pro/Flash | 最複雜任務，如系統設計、深度分析 |

::: tip 推薦設定
- **日常開發**：`antigravity-claude-sonnet-4-5-thinking --variant=low`
- **複雜推理**：`antigravity-claude-opus-4-5-thinking --variant=max`
- **快速問答 + 搜尋**：`antigravity-gemini-3-flash --variant=low` + Google Search 啟用
:::

## 完整設定範例

將以下設定新增到 `~/.config/opencode/opencode.json`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
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
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: details 複製設定
點擊上方程式碼區塊右上角的複製按鈕，然後貼到你的 `~/.config/opencode/opencode.json` 檔案中。
:::

## 檢查點 ✅

完成以下步驟，確認你已經掌握模型選擇：

- [ ] 了解 Antigravity 和 Gemini CLI 兩個獨立的配額池
- [ ] 知道 Claude 使用 thinkingBudget（tokens），Gemini 3 使用 thinkingLevel（字串）
- [ ] 能根據任務複雜度選擇合適的 variant
- [ ] 已將完整設定新增到 `opencode.json`

## 本課小結

Antigravity Auth 提供了豐富的模型選擇和靈活的 variant 設定：

- **Antigravity 配額**：支援 Claude 4.5 和 Gemini 3，具有 Thinking 能力
- **Gemini CLI 配額**：支援 Gemini 2.5 和 Gemini 3 Preview，無 Thinking 能力
- **Variant 系統**：透過 `--variant` 參數動態調整思考級別，無需定義多個模型

選擇模型時，考慮你的任務類型（推理 vs 搜尋）、複雜度（simple vs complex）和回應速度需求。

## 下一課預告

> 下一課我們學習 **[Thinking 模型詳解](../thinking-models/)**。
>
> 你會學到：
> - Claude 和 Gemini Thinking 模式的原理
> - 如何設定自訂 thinking 預算
> - 保留思考區塊的技巧（signature caching）

---

## 附錄：原始碼參考

<details>
<summary><strong>點擊展開查看原始碼位置</strong></summary>

> 更新時間：2026-01-23

| 功能 | 檔案路徑 | 行號 |
| --- | --- | --- |
| 模型解析與 tier 提取 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Thinking tier 預算定義 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Gemini 3 thinking 級別定義 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| 模型別名對應 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Variant 設定解析 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| 型別定義 | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**關鍵常數**：
- `THINKING_TIER_BUDGETS`：Claude 和 Gemini 2.5 的思考預算對應（low/medium/high → tokens）
- `GEMINI_3_THINKING_LEVELS`：Gemini 3 支援的思考級別（minimal/low/medium/high）

**關鍵函式**：
- `resolveModelWithTier(requestedModel)`：解析模型名稱和思考設定
- `resolveModelWithVariant(requestedModel, variantConfig)`：從 variant 設定解析模型
- `budgetToGemini3Level(budget)`：將 token 預算對應到 Gemini 3 級別

</details>
