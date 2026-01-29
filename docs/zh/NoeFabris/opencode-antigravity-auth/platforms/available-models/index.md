---
title: "可用模型: Claude 与 Gemini 配置指南 | Antigravity Auth"
sidebarTitle: "选对 AI 模型"
subtitle: "了解所有可用的模型及其变体配置"
description: "学习 Antigravity Auth 的模型配置。掌握 Claude Opus 4.5、Sonnet 4.5 和 Gemini 3 Pro/Flash 的 Thinking 变体使用方法。"
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

# 了解所有可用的模型及其变体配置

## 学完你能做什么

- 选择最适合你需求的 Claude 或 Gemini 模型
- 理解 Thinking 模式的不同级别（low/max 或 minimal/low/medium/high）
- 理解 Antigravity 和 Gemini CLI 两个独立的配额池
- 使用 `--variant` 参数动态调整思考预算

## 你现在的困境

刚安装好插件，面对一长串模型名称，不知道该选哪个：
- `antigravity-gemini-3-pro` 和 `gemini-3-pro-preview` 有什么区别？
- `--variant=max` 是什么意思？不指定会怎样？
- Claude 的 thinking 模式和 Gemini 的 thinking 模式一样吗？

## 核心思路

Antigravity Auth 支持两大类模型，每个都有独立的配额池：

1. **Antigravity 配额**：通过 Google Antigravity API 访问，包括 Claude 和 Gemini 3
2. **Gemini CLI 配额**：通过 Gemini CLI API 访问，包括 Gemini 2.5 和 Gemini 3 Preview

::: info Variant 系统
OpenCode 的 variant 系统让你不用为每个 thinking 级别定义独立模型，而是在运行时通过 `--variant` 参数指定配置。这样模型选择器更简洁，配置也更灵活。
:::

## Antigravity 配额模型

这些模型通过 `antigravity-` 前缀访问，使用 Antigravity API 的配额池。

### Gemini 3 系列

#### Gemini 3 Pro
| 模型名 | Variants | Thinking 级别 | 说明 |
|--- | --- | --- | ---|
| `antigravity-gemini-3-pro` | low, high | low, high | 平衡质量和速度 |

**Variant 配置示例**：
```bash
# 低思考级别（更快）
opencode run "快速回答" --model=google/antigravity-gemini-3-pro --variant=low

# 高思考级别（更深入）
opencode run "复杂推理" --model=google/antigravity-gemini-3-pro --variant=high
```

#### Gemini 3 Flash
| 模型名 | Variants | Thinking 级别 | 说明 |
|--- | --- | --- | ---|
| `antigravity-gemini-3-flash` | minimal, low, medium, high | minimal, low, medium, high | 极速响应，支持 4 种思考级别 |

**Variant 配置示例**：
```bash
# 最小思考（最快）
opencode run "简单任务" --model=google/antigravity-gemini-3-flash --variant=minimal

# 平衡思考（默认）
opencode run "常规任务" --model=google/antigravity-gemini-3-flash --variant=medium

# 最大思考（最深入）
opencode run "复杂分析" --model=google/antigravity-gemini-3-flash --variant=high
```

::: warning Gemini 3 Pro 不支持 minimal/medium
`gemini-3-pro` 只支持 `low` 和 `high` 两个级别。如果你尝试使用 `--variant=minimal` 或 `--variant=medium`，API 会返回错误。
:::

### Claude 系列

#### Claude Sonnet 4.5（非 Thinking）
| 模型名 | Variants | Thinking 预算 | 说明 |
|--- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5` | — | — | 标准模式，无扩展思考 |

**使用示例**：
```bash
# 标准模式
opencode run "日常对话" --model=google/antigravity-claude-sonnet-4-5
```

#### Claude Sonnet 4.5 Thinking
| 模型名 | Variants | Thinking 预算（tokens） | 说明 |
|--- | --- | --- | ---|
| `antigravity-claude-sonnet-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | 平衡模式 |

**Variant 配置示例**：
```bash
# 轻量思考（更快）
opencode run "快速推理" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=low

# 最大思考（最深入）
opencode run "深度分析" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

#### Claude Opus 4.5 Thinking
| 模型名 | Variants | Thinking 预算（tokens） | 说明 |
|--- | --- | --- | ---|
| `antigravity-claude-opus-4-5-thinking` | low, max | 8192 (low) / 32768 (max) | 最强推理能力 |

**Variant 配置示例**：
```bash
# 轻量思考
opencode run "高质量回答" --model=google/antigravity-claude-opus-4-5-thinking --variant=low

# 最大思考（用于最复杂任务）
opencode run "专家级分析" --model=google/antigravity-claude-opus-4-5-thinking --variant=max
```

::: tip Claude vs Gemini 思考模式区别
- **Claude** 使用数字化的 thinking budget（tokens），如 8192、32768
- **Gemini 3** 使用字符串化的 thinking level（minimal/low/medium/high）
- 两者都会在回答前展示推理过程，但配置方式不同
:::

## Gemini CLI 配额模型

这些模型没有 `antigravity-` 前缀，使用 Gemini CLI API 的独立配额池。它们不支持 thinking 模式。

| 模型名 | 说明 |
|--- | ---|
| `gemini-2.5-flash` | Gemini 2.5 Flash（快速响应） |
| `gemini-2.5-pro` | Gemini 2.5 Pro（平衡质量和速度） |
| `gemini-3-flash-preview` | Gemini 3 Flash Preview（预览版） |
| `gemini-3-pro-preview` | Gemini 3 Pro Preview（预览版） |

**使用示例**：
```bash
# Gemini 2.5 Pro（无 thinking）
opencode run "快速任务" --model=google/gemini-2.5-pro

# Gemini 3 Pro Preview（无 thinking）
opencode run "预览模型测试" --model=google/gemini-3-pro-preview
```

::: info Preview 模型
`gemini-3-*-preview` 模型是 Google 官方预览版本，可能不稳定或随时变更。如果你想使用 Thinking 功能，请使用 `antigravity-gemini-3-*` 模型。
:::

## 模型对比总览

| 特性 | Claude 4.5 | Gemini 3 | Gemini 2.5 |
|--- | --- | --- | ---|
| **Thinking 支持** | ✅（thinkingBudget） | ✅（thinkingLevel） | ❌ |
| **Google Search** | ❌ | ✅ | ✅ |
| **配额池** | Antigravity | Antigravity + Gemini CLI | Gemini CLI |
| **适用场景** | 复杂推理、编程 | 通用任务 + 搜索 | 快速响应、简单任务 |

## 🎯 如何选择模型

### 选择 Claude 还是 Gemini？

- **选 Claude**：你需要更强的逻辑推理能力、更稳定的代码生成
- **选 Gemini 3**：你需要 Google Search、更快的响应速度

### 选择 Thinking 还是标准模式？

- **用 Thinking**：复杂推理、多步骤任务、需要看到推理过程
- **用标准模式**：简单问答、快速响应、不需要推理展示

### 选择哪个 Thinking 级别？

| 级别 | Claude (tokens) | Gemini 3 | 适用场景 |
|--- | --- | --- | ---|
| **minimal** | — | Flash 专用 | 极速任务，如翻译、摘要 |
| **low** | 8192 | Pro/Flash | 平衡质量和速度，适合大多数任务 |
| **medium** | — | Flash 专用 | 中等复杂度任务 |
| **high/max** | 32768 | Pro/Flash | 最复杂任务，如系统设计、深度分析 |

::: tip 推荐配置
- **日常开发**：`antigravity-claude-sonnet-4-5-thinking --variant=low`
- **复杂推理**：`antigravity-claude-opus-4-5-thinking --variant=max`
- **快速问答 + 搜索**：`antigravity-gemini-3-flash --variant=low` + Google Search 启用
:::

## 完整配置示例

将以下配置添加到 `~/.config/opencode/opencode.json`：

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

::: details 复制配置
点击上方代码块右上角的复制按钮，然后粘贴到你的 `~/.config/opencode/opencode.json` 文件中。
:::

## 检查点 ✅

完成以下步骤，确认你已经掌握模型选择：

- [ ] 了解 Antigravity 和 Gemini CLI 两个独立的配额池
- [ ] 知道 Claude 使用 thinkingBudget（tokens），Gemini 3 使用 thinkingLevel（字符串）
- [ ] 能根据任务复杂度选择合适的 variant
- [ ] 已将完整配置添加到 `opencode.json`

## 本课小结

Antigravity Auth 提供了丰富的模型选择和灵活的 variant 配置：

- **Antigravity 配额**：支持 Claude 4.5 和 Gemini 3，具有 Thinking 能力
- **Gemini CLI 配额**：支持 Gemini 2.5 和 Gemini 3 Preview，无 Thinking 能力
- **Variant 系统**：通过 `--variant` 参数动态调整思考级别，无需定义多个模型

选择模型时，考虑你的任务类型（推理 vs 搜索）、复杂度（simple vs complex）和响应速度需求。

## 下一课预告

> 下一课我们学习 **[Thinking 模型详解](../thinking-models/)**。
>
> 你会学到：
> - Claude 和 Gemini Thinking 模式的原理
> - 如何配置自定义 thinking 预算
> - 保留思考块的技巧（signature caching）

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 模型解析与 tier 提取 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 177-282 |
| Thinking tier 预算定义 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 14-19 |
| Gemini 3 thinking 级别定义 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 26 |
| 模型别名映射 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 36-57 |
| Variant 配置解析 | [`src/plugin/transform/model-resolver.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/model-resolver.ts) | 374-422 |
| 类型定义 | [`src/plugin/transform/types.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/types.ts) | 1-115 |

**关键常量**：
- `THINKING_TIER_BUDGETS`：Claude 和 Gemini 2.5 的思考预算映射（low/medium/high → tokens）
- `GEMINI_3_THINKING_LEVELS`：Gemini 3 支持的思考级别（minimal/low/medium/high）

**关键函数**：
- `resolveModelWithTier(requestedModel)`：解析模型名称和思考配置
- `resolveModelWithVariant(requestedModel, variantConfig)`：从 variant 配置解析模型
- `budgetToGemini3Level(budget)`：将 token 预算映射到 Gemini 3 级别

</details>
