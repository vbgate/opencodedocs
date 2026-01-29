---
title: "Thinking 模型配置 | opencode-antigravity-auth"
sidebarTitle: "让 AI 深度思考"
subtitle: "Thinking 模型：Claude 与 Gemini 3 的思考能力"
description: "学习配置 Claude 与 Gemini 3 Thinking 模型。掌握 thinking budget、thinking level 和 variant 配置方法。"
tags:
  - "Thinking 模型"
  - "Claude Opus 4.5"
  - "Claude Sonnet 4.5"
  - "Gemini 3 Pro"
  - "Gemini 3 Flash"
  - "variant 配置"
prerequisite:
  - "start-quick-install"
  - "start-first-request"
order: 4
---

# Thinking 模型：Claude 与 Gemini 3 的思考能力

## 学完你能做什么

- 配置 Claude Opus 4.5、Sonnet 4.5 Thinking 模型的 thinking budget
- 使用 Gemini 3 Pro/Flash 的 thinking level（minimal/low/medium/high）
- 通过 OpenCode variant 系统灵活调整思考强度
- 理解 interleaved thinking（工具调用时的思考机制）
- 掌握思考块保留策略（keep_thinking 配置）

## 你现在的困境

你想让 AI 模型在复杂任务上表现更好——比如多步推理、代码调试或架构设计。但你知道：

- 普通模型回答太快，思考不够深入
- Claude 官方限制 thinking 功能，难以访问
- Gemini 3 的 thinking level 配置不清晰
- 不清楚 how much thinking is enough（budget 应该设多少）
- 阅读思考块内容时遇到签名错误

## 什么时候用这一招

**适用场景**：
- 需要多步推理的复杂问题（算法设计、系统架构）
- 需要仔细思考的代码审查或调试
- 需要深度分析的长文档或代码库
- 工具调用密集的任务（需要 interleaved thinking）

**不适用场景**：
- 简单问答（浪费 thinking quota）
- 快速原型验证（速度优先）
- 事实查询（不需要推理）

## 🎒 开始前的准备

::: warning 前置检查

 1. **已完成插件安装和认证**：参考 [快速安装](../../start/quick-install/) 和 [首次认证](../../start/first-auth-login/)
 2. **了解基本模型使用**：参考 [首次请求](../../start/first-request/)
3. **有可用的 Thinking 模型**：确保你的账户有权限访问 Claude Opus 4.5/Sonnet 4.5 Thinking 或 Gemini 3 Pro/Flash

:::

---

## 核心思路

### 什么是 Thinking 模型

**Thinking 模型**会在生成最终答案前，先进行内部推理（thinking blocks）。这些思考内容：

- **不被计费**：Thinking tokens 不计入常规输出配额（具体计费规则以 Antigravity 官方为准）
- **提升推理质量**：更多思考 → 更准确、更有逻辑的回答
- **消耗时间**：Thinking 增加响应延迟，但换来更好的结果

**关键区别**：

| 普通模型 | Thinking 模型 |
| --------- | ------------- |
| 直接生成答案 | 先思考 → 再生成答案 |
| 快速但可能浅薄 | 慢速但更深入 |
| 适合简单任务 | 适合复杂任务 |

### 两种 Thinking 实现

Antigravity Auth 插件支持两种 Thinking 实现：

#### Claude Thinking（Opus 4.5、Sonnet 4.5）

- **Token-based budget**：用数字控制思考量（如 8192、32768）
- **Interleaved thinking**：可以在工具调用前后思考
- **Snake_case keys**：使用 `include_thoughts`、`thinking_budget`

#### Gemini 3 Thinking（Pro、Flash）

- **Level-based**：用字符串控制思考强度（minimal/low/medium/high）
- **CamelCase keys**：使用 `includeThoughts`、`thinkingLevel`
- **模型差异**：Flash 支持 all 4 levels，Pro 只支持 low/high

---

## 跟我做

### 第 1 步：通过 Variant 配置 Thinking 模型

OpenCode 的 variant 系统让你在模型选择器中直接选择 thinking 强度，而无需记忆复杂的模型名。

#### 检查现有配置

查看你的模型配置文件（通常在 `.opencode/models.json` 或系统配置目录）：

```bash
## 查看模型配置
cat ~/.opencode/models.json
```

#### 配置 Claude Thinking 模型

找到 `antigravity-claude-sonnet-4-5-thinking` 或 `antigravity-claude-opus-4-5-thinking`，添加 variants：

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

**配置说明**：
- `low`：8192 tokens - 轻量思考，适合中等复杂度任务
- `medium`：16384 tokens - 平衡思考与速度
- `max`：32768 tokens - 最大思考，适合最复杂任务

#### 配置 Gemini 3 Thinking 模型

**Gemini 3 Pro**（只支持 low/high）：

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

**Gemini 3 Flash**（支持 all 4 levels）：

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

**配置说明**：
- `minimal`：最低思考，最快响应（仅 Flash）
- `low`：轻量思考
- `medium`：平衡思考（仅 Flash）
- `high`：最大思考（最慢但最深入）

**你应该看到**：在 OpenCode 的模型选择器中，选择 Thinking 模型后可以看到 variant 下拉菜单。

### 第 2 步：使用 Thinking 模型发起请求

配置完成后，你可以通过 OpenCode 选择模型和 variant：

```bash
## 使用 Claude Sonnet 4.5 Thinking (max)
opencode run "帮我设计一个分布式缓存系统的架构" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max

## 使用 Gemini 3 Pro (high)
opencode run "分析这段代码的性能瓶颈" \
  --model=google/antigravity-gemini-3-pro \
  --variant=high

## 使用 Gemini 3 Flash (minimal - 最快)
opencode run "快速总结这个文件的内容" \
  --model=google/antigravity-gemini-3-flash \
  --variant=minimal
```

**你应该看到**：模型会先输出 thinking blocks（思考内容），然后生成最终答案。

### 第 3 步：理解 Interleaved Thinking

Interleaved thinking 是 Claude 模型的特殊能力——它可以在工具调用的前后进行思考。

**场景示例**：让 AI 使用工具（如文件操作、数据库查询）完成任务时：

```
Thinking: 我需要先读取配置文件，然后根据内容决定下一步...

[调用工具: read_file("config.json")]

Tool Result: { "port": 8080, "mode": "production" }

Thinking: 端口是 8080，生产模式。我需要验证配置是否正确...

[调用工具: validate_config({ "port": 8080, "mode": "production" })]

Tool Result: { "valid": true }

Thinking: 配置有效。现在我可以启动服务了。

[生成最终答案]
```

**为什么重要**：
- 工具调用前后都有思考 → 更智能的决策
- 适应工具返回结果 → 动态调整策略
- 避免盲目执行 → 减少错误操作

::: tip 插件自动处理

你不需要手动配置 interleaved thinking。Antigravity Auth 插件会自动检测 Claude Thinking 模型并注入系统指令：
- "Interleaved thinking is enabled. You may think between tool calls and after receiving tool results before deciding on next action or final answer."

:::

### 第 4 步：控制思考块保留策略

默认情况下，插件会**剥离思考块**以提高可靠性（避免签名错误）。如果你想阅读思考内容，需要配置 `keep_thinking`。

#### 为什么默认剥离？

**签名错误问题**：
- Thinking blocks 在多轮对话中需要签名匹配
- 如果保留所有思考块，可能导致签名冲突
- 剥离思考块是更稳定的方案（但失去思考内容）

#### 启用思考块保留

创建或编辑配置文件：

**Linux/macOS**：`~/.config/opencode/antigravity.json`

**Windows**：`%APPDATA%\opencode\antigravity.json`

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "keep_thinking": true
}
```

或使用环境变量：

```bash
export OPENCODE_ANTIGRAVITY_KEEP_THINKING=1
```

**你应该看到**：
- `keep_thinking: false`（默认）：只看到最终答案，思考块被隐藏
- `keep_thinking: true`：看到完整思考过程（可能在某些多轮对话中遇到签名错误）

::: warning 推荐做法

- **生产环境**：使用默认 `keep_thinking: false`，确保稳定性
- **调试/学习**：临时启用 `keep_thinking: true`，观察思考过程
- **如果遇到签名错误**：关闭 `keep_thinking`，插件会自动恢复

:::

### 第 5 步：检查 Max Output Tokens

Claude Thinking 模型需要更大的输出令牌限制（maxOutputTokens），否则思考 budget 可能无法完全使用。

**插件自动处理**：
- 如果你设置了 thinking budget，插件会自动调整 `maxOutputTokens` 到 64,000
- 源码位置：`src/plugin/transform/claude.ts:78-90`

**手动配置（可选）**：

如果你手动设置 `maxOutputTokens`，确保它大于 thinking budget：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "variants": {
      "max": {
        "thinkingConfig": { "thinkingBudget": 32768 },
        "maxOutputTokens": 64000  // 必须 >= thinkingBudget
      }
    }
  }
}
```

**你应该看到**：
- 如果 `maxOutputTokens` 过小，插件会自动调整为 64,000
- 调试日志中会显示 "Adjusted maxOutputTokens for thinking model"

---

## 检查点 ✅

验证你的配置是否正确：

### 1. 验证 Variant 可见性

在 OpenCode 中：

1. 打开模型选择器
2. 选择 `Claude Sonnet 4.5 Thinking`
3. 检查是否有 variant 下拉菜单（low/medium/max）

**预期结果**：能看到 3 个 variant 选项。

### 2. 验证 Thinking 内容输出

```bash
opencode run "思考 3 步：1+1=？为什么？" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=max
```

**预期结果**：
- 如果 `keep_thinking: true`：看到详细思考过程
- 如果 `keep_thinking: false`（默认）：直接看到答案 "2"

### 3. 验证 Interleaved Thinking（需要工具调用）

```bash
## 使用需要工具调用的任务
opencode run "读取当前目录的文件列表，然后总结文件类型" \
  --model=google/antigravity-claude-sonnet-4-5-thinking \
  --variant=medium
```

**预期结果**：
- 在工具调用前后看到思考内容
- AI 会根据工具返回结果调整策略

---

## 踩坑提醒

### ❌ 错误 1：Thinking Budget 超出 Max Output Tokens

**问题**：设置 `thinkingBudget: 32768`，但 `maxOutputTokens: 20000`

**错误信息**：
```
Invalid argument: max_output_tokens must be greater than or equal to thinking_budget
```

**解决方法**：
- 让插件自动处理（推荐）
- 或手动设置 `maxOutputTokens >= thinkingBudget`

### ❌ 错误 2：Gemini 3 Pro 使用 unsupported level

**问题**：Gemini 3 Pro 只支持 low/high，但你尝试使用 `minimal`

**错误信息**：
```
Invalid argument: thinking_level "minimal" not supported for gemini-3-pro
```

**解决方法**：只使用 Pro 支持的 levels（low/high）

### ❌ 错误 3：多轮对话签名错误（keep_thinking: true）

**问题**：启用 `keep_thinking: true` 后，多轮对话遇到错误

**错误信息**：
```
Signature mismatch in thinking blocks
```

**解决方法**：
- 临时关闭 `keep_thinking`：`export OPENCODE_ANTIGRAVITY_KEEP_THINKING=0`
- 或重新开始会话

### ❌ 错误 4：Variant 不显示

**问题**：配置了 variants，但在 OpenCode 模型选择器中看不到

**可能原因**：
- 配置文件路径错误
- JSON 语法错误（缺少逗号、引号）
- 模型 ID 不匹配

**解决方法**：
1. 检查配置文件路径：`~/.opencode/models.json` 或 `~/.config/opencode/models.json`
2. 验证 JSON 语法：`cat ~/.opencode/models.json | python -m json.tool`
3. 检查模型 ID 是否与插件返回的一致

---

## 本课小结

Thinking 模型通过在生成答案前进行内部推理，提升复杂任务的回答质量：

| 功能 | Claude Thinking | Gemini 3 Thinking |
|------|---------------|-----------------|
| **配置方式** | `thinkingBudget`（数字） | `thinkingLevel`（字符串） |
| **Levels** | 自定义 budget | minimal/low/medium/high |
| **Keys** | snake_case（`include_thoughts`） | camelCase（`includeThoughts`） |
| **Interleaved** | ✅ 支持 | ❌ 不支持 |
| **Max Output** | 自动调整到 64,000 | 使用默认值 |

**关键配置**：
- **Variant 系统**：通过 `thinkingConfig.thinkingBudget`（Claude）或 `thinkingLevel`（Gemini 3）配置
- **keep_thinking**：默认 false（稳定），true（可读思考内容）
- **Interleaved thinking**：自动启用，无需手动配置

---

## 下一课预告

> 下一课我们学习 **[Google Search Grounding](../google-search-grounding/)**。
>
> 你会学到：
> - 为 Gemini 模型启用 Google Search 检索
> - 配置动态检索阈值
> - 提升事实准确性，减少幻觉

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|------|---------|------|
| Claude Thinking 配置构建 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 62-72 |
| Gemini 3 Thinking 配置构建 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 163-171 |
| Gemini 2.5 Thinking 配置构建 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 176-184 |
| Claude Thinking 模型检测 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 34-37 |
| Gemini 3 模型检测 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 137-139 |
| Interleaved Thinking Hint 注入 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 96-138 |
| Max Output Tokens 自动调整 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 78-90 |
| keep_thinking 配置 Schema | [`src/plugin/config/schema.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/config/schema.ts) | 78-87 |
| Claude Thinking 应用转换 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 324-366 |
| Gemini Thinking 应用转换 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 372-434 |

**关键常量**：
- `CLAUDE_THINKING_MAX_OUTPUT_TOKENS = 64_000`：Claude Thinking 模型的最大输出令牌数
- `CLAUDE_INTERLEAVED_THINKING_HINT`：注入到系统指令的 interleaved thinking 提示

**关键函数**：
- `buildClaudeThinkingConfig(includeThoughts, thinkingBudget)`：构建 Claude Thinking 配置（snake_case keys）
- `buildGemini3ThinkingConfig(includeThoughts, thinkingLevel)`：构建 Gemini 3 Thinking 配置（level string）
- `buildGemini25ThinkingConfig(includeThoughts, thinkingBudget)`：构建 Gemini 2.5 Thinking 配置（numeric budget）
- `ensureClaudeMaxOutputTokens(generationConfig, thinkingBudget)`：确保 maxOutputTokens 足够大
- `appendClaudeThinkingHint(payload, hint)`：注入 interleaved thinking hint
- `isClaudeThinkingModel(model)`：检测是否为 Claude Thinking 模型
- `isGemini3Model(model)`：检测是否为 Gemini 3 模型

</details>
