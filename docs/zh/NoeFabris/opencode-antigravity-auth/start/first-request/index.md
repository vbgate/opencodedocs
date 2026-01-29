---
title: "第一个请求: 验证 Antigravity 安装 | opencode-antigravity-auth"
sidebarTitle: "发送第一条请求"
description: "学习发送第一个 Antigravity 模型请求，验证 OAuth 认证和配置是否正确。掌握模型选择、variant 参数使用和常见错误排查方法。"
subtitle: "第一个请求：验证安装成功"
tags:
  - "安装验证"
  - "模型请求"
  - "快速开始"
prerequisite:
  - "start-quick-install"
order: 4
---

# 第一个请求：验证安装成功

## 学完你能做什么

- 发送第一个 Antigravity 模型请求
- 理解 `--model` 和 `--variant` 参数的作用
- 根据需求选择合适的模型和思考配置
- 排查常见的模型请求错误

## 你现在的困境

刚安装完插件，完成了 OAuth 认证，配置了模型定义，但现在不确定：
- 插件真的能正常工作吗？
- 应该用什么模型开始测试？
- `--variant` 参数怎么用？
- 如果请求失败了，怎么知道是哪一步出了问题？

## 什么时候用这一招

在以下场景使用本课的验证方法：
- **首次安装后** — 确认认证、配置、模型都能正常工作
- **添加新账户后** — 验证新账户是否可用
- **更换模型配置后** — 确认新模型配置正确
- **遇到问题前** — 建立基准，方便后续对比

## 🎒 开始前的准备

::: warning 前置检查

在继续之前，请确认：

- ✅ 已完成 [快速安装](/zh/NoeFabris/opencode-antigravity-auth/start/quick-install/)
- ✅ 已运行 `opencode auth login` 完成 OAuth 认证
- ✅ `~/.config/opencode/opencode.json` 中已添加模型定义
- ✅ OpenCode 终端或 CLI 可用

:::

## 核心思路

### 为什么需要先验证

插件涉及多个组件的协作：
1. **OAuth 认证** — 获取访问令牌
2. **账户管理** — 选择可用账户
3. **请求转换** — 将 OpenCode 格式转换为 Antigravity 格式
4. **流式响应** — 处理 SSE 响应并转换回 OpenCode 格式

发送第一个请求可以验证整个链路是否畅通。如果成功，说明所有组件都正常工作；如果失败，可以根据错误信息定位问题。

### Model 和 Variant 的关系

在 Antigravity 插件中，**模型和 variant 是两个独立的概念**：

| 概念 | 作用 | 示例 |
|------|------|------|
| **Model（模型）** | 选择具体的 AI 模型 | `antigravity-claude-sonnet-4-5-thinking` |
| **Variant（变体）** | 配置模型的思考预算或模式 | `low`（轻量思考）、`max`（最大思考） |

::: info 思考预算是什么？

思考预算（thinking budget）是指模型在生成回答前可以用于"思考"的 token 数量。更高的预算意味着模型有更多时间进行推理，但也会增加响应时间和成本。

- **Claude Thinking 模型**：用 `thinkingConfig.thinkingBudget` 配置（单位：token）
- **Gemini 3 模型**：用 `thinkingLevel` 配置（字符串级别：minimal/low/medium/high）

:::

### 推荐的入门组合

不同需求的推荐模型和 variant 组合：

| 需求 | 模型 | Variant | 特点 |
|------|------|---------|------|
| **快速测试** | `antigravity-gemini-3-flash` | `minimal` | 响应最快，适合验证 |
| **日常开发** | `antigravity-claude-sonnet-4-5-thinking` | `low` | 平衡速度和质量 |
| **复杂推理** | `antigravity-claude-opus-4-5-thinking` | `max` | 最强推理能力 |
| **视觉任务** | `antigravity-gemini-3-pro` | `high` | 多模态支持（图片/PDF） |

## 跟我做

### 第 1 步：发送最简单的测试请求

先用最简单的命令测试基本连接是否正常。

**为什么**
这个请求不使用 thinking 功能，返回极快，适合快速验证认证和账户状态。

**执行命令**

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5
```

**你应该看到**

```
Hello! I'm Claude Sonnet 4.5, an AI assistant...
```

::: tip 成功标志

如果看到了 AI 的回复，说明：
- ✅ OAuth 认证成功
- ✅ 账户有访问权限
- ✅ 请求转换正常工作
- ✅ 流式响应正确解析

:::

### 第 2 步：使用 Thinking 模型和 Variant

现在测试完整的思考流程，包括 variant 参数。

**为什么**
Thinking 模型需要额外的请求转换逻辑，这是插件的核心功能之一。

**执行命令**

```bash
opencode run "解释什么是闭包，用简单的比喻" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**你应该看到**

1. **流式思考输出**：你会看到模型先输出思考过程（带 `<thinking>` 标记）
2. **思考过程**：模型会详细分析如何组织回答
3. **最终回答**：思考完成后输出最终内容

::: details 看个完整的响应示例

```
<thinking>
用户问的是什么是闭包，需要用简单的比喻来解释。

闭包的概念：
1. 函数可以访问其外部作用域的变量
2. 即使外部函数已经执行完毕
3. 这个能力就像"背包"一样

比喻思路：
- 可以用"背包"比喻
- 函数返回时带上了一些变量
- 就像出门时包里装了家里的东西
</thinking>

闭包就像是函数的一个"背包"。

当函数被创建时，它会"打包"自己能访问的外部变量，就像出门前把家里需要的东西装进背包。即使函数离开了创建它的地方（外部函数执行完毕），它依然可以通过这个"背包"访问那些变量。

举个例子：
```javascript
function createCounter() {
  let count = 0;  // 这个变量被装进"背包"
  return function() {
    count++;  // 还能访问背包里的变量
    return count;
  };
}
```
```

:::

**检查点 ✅**

- [ ] 看到了 `<thinking>` 块（如果配置了 `keep_thinking: true`）
- [ ] 回答内容合理且有逻辑
- [ ] 响应时间在可接受范围内（通常 2-10 秒）

### 第 3 步：测试 Gemini 3 模型

测试 Gemini 3 Pro 的不同思考级别。

**为什么**
Gemini 3 使用字符串级别的 `thinkingLevel`，验证对不同模型家族的支持。

**执行命令**

```bash
# 测试 Gemini 3 Flash（快速响应）
opencode run "写一个冒泡排序" --model=google/antigravity-gemini-3-flash --variant=low

# 测试 Gemini 3 Pro（深度思考）
opencode run "分析冒泡排序的时间复杂度" --model=google/antigravity-gemini-3-pro --variant=high
```

**你应该看到**

- Flash 模型响应更快（适合简单任务）
- Pro 模型思考更深入（适合复杂分析）
- 两个模型都正常工作

### 第 4 步：测试多模态能力（可选）

如果你的模型配置支持图片输入，可以测试多模态功能。

**为什么**
Antigravity 支持图片/PDF 输入，这是很多场景需要的功能。

**准备一张测试图片**：任意图片文件（如 `test.png`）

**执行命令**

```bash
opencode run "描述这张图片的内容" --model=google/antigravity-gemini-3-pro --image=test.png
```

**你应该看到**

- 模型准确描述了图片内容
- 响应包含视觉分析结果

## 检查点 ✅

完成上述测试后，确认以下清单：

| 检查项 | 预期结果 | 状态 |
|--------|----------|------|
| **基础连接** | 第 1 步的简单请求成功 | ☐ |
| **Thinking 模型** | 第 2 步看到思考过程 | ☐ |
| **Gemini 3 模型** | 第 3 步两个模型都正常 | ☐ |
| **Variant 参数** | 不同 variant 产生不同结果 | ☐ |
| **流式输出** | 响应实时显示，无中断 | ☐ |

::: tip 全部通过？

如果所有检查项都通过，恭喜你！插件已完全配置好，可以开始正式使用。

下一步可以：
- [探索可用模型](/zh/NoeFabris/opencode-antigravity-auth/platforms/available-models/)
- [配置多账户负载均衡](/zh/NoeFabris/opencode-antigravity-auth/advanced/multi-account-setup/)
- [启用 Google Search](/zh/NoeFabris/opencode-antigravity-auth/platforms/google-search-grounding/)

:::

## 踩坑提醒

### 错误 1：`Model not found`

**错误信息**
```
Error: Model 'antigravity-claude-sonnet-4-5' not found
```

**原因**
模型定义没有正确添加到 `opencode.json` 的 `provider.google.models` 中。

**解决方法**

检查配置文件：

```bash
cat ~/.config/opencode/opencode.json | grep -A 10 "models"
```

确认模型定义格式正确：

```json
{
  "provider": {
    "google": {
      "models": {
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: warning 注意拼写

模型名必须与配置文件中的 key 完全一致（区分大小写）：

- ❌ 错误：`--model=google/claude-sonnet-4-5`
- ✅ 正确：`--model=google/antigravity-claude-sonnet-4-5`

:::

### 错误 2：`403 Permission Denied`

**错误信息**
```
403 Permission denied on resource '//cloudaicompanion.googleapis.com/...'
```

**原因**
1. OAuth 认证未完成
2. 账户没有访问权限
3. Project ID 配置问题（针对 Gemini CLI 模型）

**解决方法**

1. **检查认证状态**：
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   应该看到至少一个账户记录。

2. **如果账户为空或认证失败**：
   ```bash
   rm ~/.config/opencode/antigravity-accounts.json
   opencode auth login
   ```

3. **如果是 Gemini CLI 模型报错**：
   需要手动配置 Project ID（详见 [FAQ - 403 Permission Denied](/zh/NoeFabris/opencode-antigravity-auth/faq/common-auth-issues/)）

### 错误 3：`Invalid variant 'max'`

**错误信息**
```
Error: Invalid variant 'max' for model 'antigravity-gemini-3-pro'
```

**原因**
不同模型支持的 variant 配置格式不同。

**解决方法**

检查模型配置中的 variant 定义：

| 模型类型 | Variant 格式 | 示例值 |
|----------|-------------|--------|
| **Claude Thinking** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 32768 } }` |
| **Gemini 3** | `thinkingLevel` | `{ "thinkingLevel": "high" }` |
| **Gemini 2.5** | `thinkingConfig.thinkingBudget` | `{ "thinkingConfig": { "thinkingBudget": 8192 } }` |

**正确配置示例**：

```json
{
  "antigravity-claude-sonnet-4-5-thinking": {
    "name": "Claude Sonnet 4.5 Thinking",
    "variants": {
      "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
      "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
    }
  },
  "antigravity-gemini-3-pro": {
    "name": "Gemini 3 Pro",
    "variants": {
      "low": { "thinkingLevel": "low" },
      "high": { "thinkingLevel": "high" }
    }
  }
}
```

### 错误 4：请求超时或无响应

**症状**
命令执行后长时间无输出，或最终超时。

**可能原因**
1. 网络连接问题
2. 服务器响应缓慢
3. 所有账户都处于速率限制状态

**解决方法**

1. **检查网络连接**：
   ```bash
   ping cloudaicompanion.googleapis.com
   ```

2. **查看调试日志**：
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=1 opencode run "test" --model=google/antigravity-claude-sonnet-4-5
   ```

3. **检查账户状态**：
   ```bash
   cat ~/.config/opencode/antigravity-accounts.json
   ```

   如果看到所有账户都有 `rateLimit` 时间戳，说明都被限速了，需要等待重置。

### 错误 5：SSE 流式输出中断

**症状**
响应中途停止，或只看到部分内容。

**可能原因**
1. 网络不稳定
2. 账户令牌在请求过程中过期
3. 服务器错误

**解决方法**

1. **启用调试日志查看详细信息**：
   ```bash
   OPENCODE_ANTIGRAVITY_DEBUG=2 opencode run "test"
   ```

2. **检查日志文件**：
   ```bash
   tail -f ~/.config/opencode/antigravity-logs/latest.log
   ```

3. **如果频繁中断**：
   - 尝试切换到更稳定的网络环境
   - 使用非 Thinking 模型减少请求时间
   - 检查账户是否接近配额限制

## 本课小结

发送第一个请求是验证安装成功的关键步骤。通过本课，你学会了：

- **基本请求**：使用 `opencode run --model` 发送请求
- **Variant 使用**：通过 `--variant` 配置思考预算
- **模型选择**：根据需求选择 Claude 或 Gemini 模型
- **问题排查**：根据错误信息定位和解决问题

::: tip 建议的实践

在日常开发中：

1. **先用简单测试**：每次配置变更后，先发一个简单请求验证
2. **逐步增加复杂度**：从无 thinking → low thinking → max thinking
3. **记录基线响应**：记住正常情况下的响应时间，方便对比
4. **善用调试日志**：遇到问题时，开启 `OPENCODE_ANTIGRAVITY_DEBUG=2`

---

## 下一课预告

> 下一课我们学习 **[可用模型全览](/zh/NoeFabris/opencode-antigravity-auth/platforms/available-models/)**。
>
> 你会学到：
> - 所有可用模型的完整列表和特点
> - Claude 和 Gemini 模型的选择指南
> - 上下文限制和输出限制对比
> - Thinking 模型的最佳使用场景

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 请求转换入口 | [`src/plugin/request.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/request.ts) | 1-100 |
| 账户选择与令牌管理 | [`src/plugin/accounts.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/accounts.ts) | 1-50 |
| Claude 模型转换 | [`src/plugin/transform/claude.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/claude.ts) | 全文 |
| Gemini 模型转换 | [`src/plugin/transform/gemini.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/transform/gemini.ts) | 全文 |
| 流式响应处理 | [`src/plugin/core/streaming/index.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/core/streaming/index.ts) | 全文 |
| 调试日志系统 | [`src/plugin/debug.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/debug.ts) | 全文 |

**关键函数**：
- `prepareAntigravityRequest()`：将 OpenCode 请求转换为 Antigravity 格式（`request.ts`）
- `createStreamingTransformer()`：创建流式响应转换器（`core/streaming/`）
- `resolveModelWithVariant()`：解析模型和 variant 配置（`transform/model-resolver.ts`）
- `getCurrentOrNextForFamily()`：选择账户进行请求（`accounts.ts`）

**配置示例**：
- 模型配置格式：[`README.md#models`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/README.md#L110)
- Variant 详细说明：[`docs/MODEL-VARIANTS.md`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/docs/MODEL-VARIANTS.md)

</details>
