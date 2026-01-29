---
title: "Provider 配置: AI 多模型策略 | oh-my-opencode"
sidebarTitle: "连接多个 AI 服务"
subtitle: "Provider 配置: AI 多模型策略"
description: "学习如何配置 oh-my-opencode 的各类 AI Provider，包括 Anthropic、OpenAI、Google 和 GitHub Copilot，以及多模型自动降级机制的工作原理。"
tags:
  - "configuration"
  - "providers"
  - "models"
prerequisite:
  - "start-installation"
order: 40
---

# Provider 配置：Claude、OpenAI、Gemini 与多模型策略

## 学完你能做什么

- 配置 Anthropic Claude、OpenAI、Google Gemini、GitHub Copilot 等多种 AI Provider
- 理解多模型优先级降级机制，让系统自动选择最佳可用模型
- 为不同的 AI 代理和任务类型指定最合适的模型
- 配置 Z.ai Coding Plan 和 OpenCode Zen 等第三方服务
- 使用 doctor 命令诊断模型解析配置

## 你现在的困境

你安装了 oh-my-opencode，但不太清楚：
- 如何添加多个 AI Provider（Claude、OpenAI、Gemini 等）
- 为什么有时候代理使用的模型不是我期望的
- 如何为不同任务配置不同的模型（比如研究任务用便宜的，编程任务用强的）
- 当某个 Provider 不可用时，系统如何自动切换到备用模型
- 模型配置在 `opencode.json` 和 `oh-my-opencode.json` 中如何协同工作

## 什么时候用这一招

- **首次配置**：刚安装完 oh-my-opencode，需要添加或调整 AI Provider
- **添加新订阅**：购买了新的 AI 服务订阅（比如 Gemini Pro），想集成进来
- **优化成本**：想让特定代理使用更便宜或更快的模型
- **故障排查**：发现某个代理没按预期使用模型，需要诊断问题
- **多模型编排**：希望充分利用不同模型的优势，构建智能的开发工作流

## 🎒 开始前的准备

::: warning 前置检查
本教程假设你已经：
- ✅ 完成了 [安装和初始配置](../installation/)
- ✅ 安装了 OpenCode（版本 >= 1.0.150）
- ✅ 了解基本的 JSON/JSONC 配置文件格式
:::

## 核心思路

oh-my-opencode 使用 **多模型编排系统**，根据你的订阅和配置，为不同的 AI 代理和任务类型选择最合适的模型。

**为什么需要多模型？**

不同的模型有不同的优势：
- **Claude Opus 4.5**：擅长复杂的推理和架构设计（成本高，但质量好）
- **GPT-5.2**：擅长代码调试和战略咨询
- **Gemini 3 Pro**：擅长前端和 UI/UX 任务（视觉能力强）
- **GPT-5 Nano**：快速且免费，适合代码搜索和简单探索
- **GLM-4.7**：性价比高，适合研究和文档查找

oh-my-opencode 的智能之处在于：**让每个任务用最合适的模型，而不是所有任务都用同一个模型**。

## 配置文件位置

oh-my-opencode 的配置支持两个层级：

| 位置 | 路径 | 优先级 | 适用场景 |
|--- | --- | --- | ---|
| **项目配置** | `.opencode/oh-my-opencode.json` | 低 | 项目特定配置（随代码库提交） |
| **用户配置** | `~/.config/opencode/oh-my-opencode.json` | 高 | 全局配置（所有项目共享） |

**配置合并规则**：用户配置覆盖项目配置。

**推荐配置文件结构**：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  // 启用 JSON Schema 自动补全

  "agents": {
    // 代理模型覆盖
  },
  "categories": {
    // 类别模型覆盖
  }
}
```

::: tip Schema 自动补全
在 VS Code 等编辑器中，添加 `$schema` 字段后，输入配置时会获得完整的自动补全和类型检查。
:::

## Provider 配置方法

oh-my-opencode 支持 6 种主要 Provider。配置方法因 Provider 而异。

### Anthropic Claude（推荐）

**适用场景**：主编排器 Sisyphus 和大部分核心代理

**配置步骤**：

1. **运行 OpenCode 认证**：
   ```bash
   opencode auth login
   ```

2. **选择 Provider**：
   - `Provider`: 选择 `Anthropic`
   - `Login method`: 选择 `Claude Pro/Max`

3. **完成 OAuth 流程**：
   - 系统会自动打开浏览器
   - 登录你的 Claude 账号
   - 等待认证完成

4. **验证成功**：
   ```bash
   opencode models | grep anthropic
   ```

   你应该看到：
   - `anthropic/claude-opus-4-5`
   - `anthropic/claude-sonnet-4-5`
   - `anthropic/claude-haiku-4-5`

**模型映射**（Sisyphus 默认配置）：

| 代理 | 默认模型 | 用途 |
|--- | --- | ---|
| Sisyphus | `anthropic/claude-opus-4-5` | 主编排器，复杂推理 |
| Prometheus | `anthropic/claude-opus-4-5` | 项目规划 |
| Metis | `anthropic/claude-sonnet-4-5` | 前规划分析 |
| Momus | `anthropic/claude-opus-4-5` | 计划审查 |

### OpenAI（ChatGPT Plus）

**适用场景**：Oracle 代理（架构审查、调试）

**配置步骤**：

1. **运行 OpenCode 认证**：
   ```bash
   opencode auth login
   ```

2. **选择 Provider**：
   - `Provider`: 选择 `OpenAI`
   - `Login method`: 选择 OAuth 或 API Key

3. **完成认证流程**（根据选择的方法）

4. **验证成功**：
   ```bash
   opencode models | grep openai
   ```

**模型映射**（Oracle 默认配置）：

| 代理 | 默认模型 | 用途 |
|--- | --- | ---|
| Oracle | `openai/gpt-5.2` | 架构审查、调试 |

**手动覆盖示例**：

```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2",  // 使用 GPT 进行战略推理
      "temperature": 0.1
    }
  }
}
```

### Google Gemini（推荐）

**适用场景**：Multimodal Looker（媒体分析）、Frontend UI/UX 任务

::: tip 强烈推荐
对于 Gemini 认证，强烈推荐安装 [`opencode-antigravity-auth`](https://github.com/NoeFabris/opencode-antigravity-auth) 插件。它提供：
- 多账号负载均衡（最多 10 个账号）
- Variant 系统支持（`low`/`high` 变体）
- 双额度系统（Antigravity + Gemini CLI）
:::

**配置步骤**：

1. **添加 Antigravity 认证插件**：
   
   编辑 `~/.config/opencode/opencode.json`：
   ```json
   {
     "plugin": [
       "oh-my-opencode",
       "opencode-antigravity-auth@latest"
     ]
   }
   ```

2. **配置 Gemini 模型**（重要）：
   
   Antigravity 插件使用不同的模型名称。需要复制完整的模型配置到 `opencode.json`，小心合并避免破坏现有设置。

   可用模型（Antigravity 额度）：
   - `google/antigravity-gemini-3-pro` — variants: `low`, `high`
   - `google/antigravity-gemini-3-flash` — variants: `minimal`, `low`, `medium`, `high`
   - `google/antigravity-claude-sonnet-4-5` — no variants
   - `google/antigravity-claude-sonnet-4-5-thinking` — variants: `low`, `max`
   - `google/antigravity-claude-opus-4-5-thinking` — variants: `low`, `max`

   可用模型（Gemini CLI 额度）：
   - `google/gemini-2.5-flash`, `google/gemini-2.5-pro`, `google/gemini-3-flash-preview`, `google/gemini-3-pro-preview`

3. **覆盖代理模型**（在 `oh-my-opencode.json` 中）：
   
   ```jsonc
   {
     "agents": {
       "multimodal-looker": {
         "model": "google/antigravity-gemini-3-flash"
       }
     }
   }
   ```

4. **运行认证**：
   ```bash
   opencode auth login
   ```

5. **选择 Provider**：
   - `Provider`: 选择 `Google`
   - `Login method`: 选择 `OAuth with Google (Antigravity)`

6. **完成认证流程**：
   - 系统会自动打开浏览器
   - 完成 Google 登录
   - 可选：添加更多 Google 账号用于负载均衡

**模型映射**（默认配置）：

| 代理 | 默认模型 | 用途 |
|--- | --- | ---|
| Multimodal Looker | `google/antigravity-gemini-3-flash` | PDF、图片分析 |

### GitHub Copilot（备用 Provider）

**适用场景**：当原生 Provider 不可用时的备用选项

::: info 备用 Provider
GitHub Copilot 作为代理 Provider，将请求路由到你订阅的底层模型。
:::

**配置步骤**：

1. **运行 OpenCode 认证**：
   ```bash
   opencode auth login
   ```

2. **选择 Provider**：
   - `Provider`: 选择 `GitHub`
   - `Login method`: 选择 `Authenticate via OAuth`

3. **完成 GitHub OAuth 流程**

4. **验证成功**：
   ```bash
   opencode models | grep github-copilot
   ```

**模型映射**（当 GitHub Copilot 是最佳可用 Provider 时）：

| 代理 | 模型 | 用途 |
|--- | --- | ---|
| Sisyphus | `github-copilot/claude-opus-4.5` | 主编排器 |
| Oracle | `github-copilot/gpt-5.2` | 架构审查 |
| Explore | `opencode/gpt-5-nano` | 快速探索 |
| Librarian | `zai-coding-plan/glm-4.7` (如果 Z.ai 可用) | 文档查找 |

### Z.ai Coding Plan（可选）

**适用场景**：Librarian 代理（多仓库研究、文档查找）

**特点**：
- 提供 GLM-4.7 模型
- 高性价比
- 当启用时，**Librarian 代理总是使用** `zai-coding-plan/glm-4.7`，不管其他可用 Provider

**配置步骤**：

使用交互式安装器：

```bash
bunx oh-my-opencode install
# 当提示: "Do you have a Z.ai Coding Plan subscription?" → 选择 "Yes"
```

**模型映射**（当 Z.ai 是唯一可用 Provider 时）：

| 代理 | 模型 | 用途 |
|--- | --- | ---|
| Sisyphus | `zai-coding-plan/glm-4.7` | 主编排器 |
| Oracle | `zai-coding-plan/glm-4.7` | 架构审查 |
| Explore | `zai-coding-plan/glm-4.7-flash` | 快速探索 |
| Librarian | `zai-coding-plan/glm-4.7` | 文档查找 |

### OpenCode Zen（可选）

**适用场景**：提供 `opencode/` 前缀模型（Claude Opus 4.5、GPT-5.2、GPT-5 Nano、Big Pickle）

**配置步骤**：

```bash
bunx oh-my-opencode install
# 当提示: "Do you have access to OpenCode Zen (opencode/ models)?" → 选择 "Yes"
```

**模型映射**（当 OpenCode Zen 是最佳可用 Provider 时）：

| 代理 | 模型 | 用途 |
|--- | --- | ---|
| Sisyphus | `opencode/claude-opus-4-5` | 主编排器 |
| Oracle | `opencode/gpt-5.2` | 架构审查 |
| Explore | `opencode/gpt-5-nano` | 快速探索 |
| Librarian | `opencode/big-pickle` | 文档查找 |

## 模型解析系统（3 步优先级）

oh-my-opencode 使用 **3 步优先级机制**来决定每个代理和类别使用的模型。这个机制确保系统总能找到可用的模型。

### 步骤 1：用户覆盖

如果用户在 `oh-my-opencode.json` 中明确指定了模型，使用该模型。

**示例**：
```jsonc
{
  "agents": {
    "oracle": {
      "model": "openai/gpt-5.2"  // 用户明确指定
    }
  }
}
```

在这种情况：
- ✅ 直接使用 `openai/gpt-5.2`
- ❌ 跳过 Provider 降级步骤

### 步骤 2：Provider 降级

如果用户没有明确指定模型，系统会按照代理定义的 Provider 优先级链逐个尝试，直到找到可用的模型。

**Sisyphus 的 Provider 优先级链**：

```
anthropic → github-copilot → opencode → antigravity → google
```

**解析流程**：
1. 尝试 `anthropic/claude-opus-4-5`
   - 可用？→ 返回该模型
   - 不可用？→ 继续下一步
2. 尝试 `github-copilot/claude-opus-4-5`
   - 可用？→ 返回该模型
   - 不可用？→ 继续下一步
3. 尝试 `opencode/claude-opus-4-5`
   - ...
4. 尝试 `google/antigravity-claude-opus-4-5-thinking`（如果配置了）
   - ...
5. 返回系统默认模型

**所有代理的 Provider 优先级链**：

| 代理 | 模型（无前缀） | Provider 优先级链 |
|--- | --- | ---|
| **Sisyphus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Oracle** | `gpt-5.2` | openai → anthropic → google → github-copilot → opencode |
| **Librarian** | `big-pickle` | opencode → github-copilot → anthropic |
| **Explore** | `gpt-5-nano` | anthropic → opencode |
| **Multimodal Looker** | `gemini-3-flash` | google → openai → zai-coding-plan → anthropic → opencode |
| **Prometheus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Metis** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Momus** | `claude-opus-4-5` | anthropic → github-copilot → opencode → antigravity → google |
| **Atlas** | `claude-sonnet-4-5` | anthropic → github-copilot → opencode → antigravity → google |

**Category（类别）的 Provider 优先级链**：

| Category | 模型（无前缀） | Provider 优先级链 |
|--- | --- | ---|
|--- | --- | ---|
| **ultrabrain** | `gpt-5.2-codex` | openai → anthropic → google → github-copilot → opencode |
| **artistry** | `gemini-3-pro` | google → openai → anthropic → github-copilot → opencode |
| **quick** | `claude-haiku-4-5` | anthropic → github-copilot → opencode → antigravity → google |
|--- | --- | ---|
|--- | --- | ---|
| **writing** | `gemini-3-flash` | google → openai → anthropic → github-copilot → opencode |

### 步骤 3：系统默认

如果所有 Provider 都不可用，使用 OpenCode 的默认模型（从 `opencode.json` 读取）。

**全局优先级顺序**：

```
用户覆盖 > Provider 降级 > 系统默认
```

## 跟我一起做：配置多个 Provider

### 第 1 步：规划你的订阅

在开始配置前，先整理好你的订阅情况：

```markdown
- [ ] Anthropic Claude (Pro/Max)
- [ ] OpenAI ChatGPT Plus
- [ ] Google Gemini
- [ ] GitHub Copilot
- [ ] Z.ai Coding Plan
- [ ] OpenCode Zen
```

### 第 2 步：使用交互式安装器（推荐）

oh-my-opencode 提供交互式安装器，自动处理大部分配置：

```bash
bunx oh-my-opencode install
```

安装器会询问：
1. **Do you have a Claude Pro/Max Subscription?**
   - `yes, max20` → `--claude=max20`
   - `yes, regular` → `--claude=yes`
   - `no` → `--claude=no`

2. **Do you have an OpenAI/ChatGPT Plus Subscription?**
   - `yes` → `--openai=yes`
   - `no` → `--openai=no`

3. **Will you integrate Gemini models?**
   - `yes` → `--gemini=yes`
   - `no` → `--gemini=no`

4. **Do you have a GitHub Copilot Subscription?**
   - `yes` → `--copilot=yes`
   - `no` → `--copilot=no`

5. **Do you have access to OpenCode Zen (opencode/ models)?**
   - `yes` → `--opencode-zen=yes`
   - `no` → `--opencode-zen=no`

6. **Do you have a Z.ai Coding Plan subscription?**
   - `yes` → `--zai-coding-plan=yes`
   - `no` → `--zai-coding-plan=no`

**非交互模式**（适合脚本化安装）：

```bash
bunx oh-my-opencode install --no-tui \
  --claude=max20 \
  --openai=yes \
  --gemini=yes \
  --copilot=no
```

### 第 3 步：认证各个 Provider

安装器配置完成后，逐个认证：

```bash
# 认证 Anthropic
opencode auth login
# Provider: Anthropic
# Login method: Claude Pro/Max
# 完成 OAuth 流程

# 认证 OpenAI
opencode auth login
# Provider: OpenAI
# 完成 OAuth 流程

# 认证 Google Gemini（需先安装 antigravity 插件）
opencode auth login
# Provider: Google
# Login method: OAuth with Google (Antigravity)
# 完成 OAuth 流程

# 认证 GitHub Copilot
opencode auth login
# Provider: GitHub
# Login method: Authenticate via OAuth
# 完成 GitHub OAuth
```

### 第 4 步：验证配置

```bash
# 检查 OpenCode 版本
opencode --version
# 应该 >= 1.0.150

# 查看所有可用的模型
opencode models

# 运行 doctor 诊断
bunx oh-my-opencode doctor --verbose
```

**你应该看到**（doctor 输出示例）：

```
✅ OpenCode version: 1.0.150
✅ Plugin loaded: oh-my-opencode

📊 Model Resolution:
┌─────────────────────────────────────────────────────┐
│ Agent           │ Requirement            │ Resolved         │
├─────────────────────────────────────────────────────┤
│ Sisyphus        │ anthropic/claude-opus-4-5  │ anthropic/claude-opus-4-5 │
│ Oracle           │ openai/gpt-5.2              │ openai/gpt-5.2              │
│ Librarian        │ opencode/big-pickle           │ opencode/big-pickle           │
│ Explore          │ anthropic/gpt-5-nano          │ anthropic/gpt-5-nano          │
│ Multimodal Looker│ google/gemini-3-flash          │ google/gemini-3-flash          │
└─────────────────────────────────────────────────────┘

✅ All models resolved successfully
```

### 第 5 步：自定义代理模型（可选）

如果你想为特定代理指定不同的模型：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle 使用 GPT 进行架构审查
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1
    },

    // Librarian 使用更便宜的模型进行研究
    "librarian": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // Multimodal Looker 使用 Antigravity Gemini
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash",
      "variant": "high"
    }
  }
}
```

### 第 6 步：自定义 Category 模型（可选）

为不同类型的任务指定模型：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "categories": {
    // 快速任务使用廉价模型
    "quick": {
      "model": "opencode/gpt-5-nano",
      "temperature": 0.1
    },

    // 前端任务使用 Gemini
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },

    // 高智商推理任务使用 GPT Codex
    "ultrabrain": {
      "model": "openai/gpt-5.2-codex",
      "temperature": 0.1
    }
  }
}
```

**使用 Category**：

```markdown
// 在对话中使用 delegate_task
delegate_task(category="visual", prompt="Create a responsive dashboard component")
delegate_task(category="quick", skills=["git-master"], prompt="Commit these changes")
```

## 检查点 ✅

- [ ] `opencode --version` 显示版本 >= 1.0.150
- [ ] `opencode models` 列出了你配置的所有 Provider 的模型
- [ ] `bunx oh-my-opencode doctor --verbose` 显示所有代理的模型都已正确解析
- [ ] 可以在 `opencode.json` 中看到 `"oh-my-opencode"` 在 `plugin` 数组中
- [ ] 尝试使用一个代理（比如 Sisyphus），确认模型工作正常

## 踩坑提醒

### ❌ 陷阱 1：忘记认证 Provider

**症状**：配置了 Provider，但模型解析失败。

**原因**：安装器配置了模型，但没有完成认证。

**解决**：
```bash
opencode auth login
# 选择对应的 Provider 并完成认证
```

### ❌ 陷阱 2：Antigravity 模型名称错误

**症状**：配置了 Gemini，但代理不使用。

**原因**：Antigravity 插件使用不同的模型名称（`google/antigravity-gemini-3-pro` 而不是 `google/gemini-3-pro`）。

**解决**：
```jsonc
{
  "agents": {
    "multimodal-looker": {
      "model": "google/antigravity-gemini-3-flash"  // 正确
      // model: "google/gemini-3-flash"  // ❌ 错误
    }
  }
}
```

### ❌ 陷阱 3：配置文件位置错误

**症状**：修改了配置，但系统没有生效。

**原因**：修改了错误的配置文件（用户配置 vs 项目配置）。

**解决**：
```bash
# 用户配置（全局，优先级高）
~/.config/opencode/oh-my-opencode.json

# 项目配置（本地，优先级低）
.opencode/oh-my-opencode.json

# 验证哪个文件在被使用
bunx oh-my-opencode doctor --verbose
```

### ❌ 陷阱 4：Provider 优先级链被打断

**症状**：某个代理总是使用错误的模型。

**原因**：用户覆盖（Step 1）会完全跳过 Provider 降级（Step 2）。

**解决**：如果你想利用自动降级，不要在 `oh-my-opencode.json` 中硬编码模型，而是让系统根据优先级链自动选择。

**示例**：
```jsonc
{
  "agents": {
    "oracle": {
      // ❌ 硬编码：永远用 GPT，即使 Anthropic 可用
      "model": "openai/gpt-5.2"
    }
  }
}
```

如果想利用降级，删除 `model` 字段，让系统自动选择：
```jsonc
{
  "agents": {
    "oracle": {
      // ✅ 自动：anthropic → google → github-copilot → opencode
      "temperature": 0.1
    }
  }
}
```

### ❌ 陷阱 5：Z.ai 永远占用 Librarian

**症状**：即使配置了其他 Provider，Librarian 还是使用 GLM-4.7。

**原因**：当 Z.ai 启用时，Librarian 被硬编码为使用 `zai-coding-plan/glm-4.7`。

**解决**：如果不需要这个行为，禁用 Z.ai：
```bash
bunx oh-my-opencode install --no-tui --zai-coding-plan=no
```

或手动覆盖：
```jsonc
{
  "agents": {
    "librarian": {
      "model": "opencode/big-pickle"  // 覆盖 Z.ai 的硬编码
    }
  }
}
```

## 本课小结

- oh-my-opencode 支持 6 种主要 Provider：Anthropic、OpenAI、Google、GitHub Copilot、Z.ai、OpenCode Zen
- 使用交互式安装器 `bunx oh-my-opencode install` 可以快速配置多个 Provider
- 模型解析系统通过 3 步优先级（用户覆盖 → Provider 降级 → 系统默认）动态选择模型
- 每个代理和 Category 都有自己的 Provider 优先级链，确保总能找到可用模型
- 使用 `doctor --verbose` 命令可以诊断模型解析配置
- 自定义代理和 Category 模型时，需要小心不要打破自动降级机制

## 下一课预告

> 下一课我们学习 **[多模型策略：自动降级与优先级](../model-resolution/)**。
>
> 你会学到：
> - 模型解析系统的完整工作流程
> - 如何为不同任务设计最优的模型组合
> - 后台任务中的并发控制策略
> - 如何诊断模型解析问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 配置 Schema 定义 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378 |
| 安装指南（Provider 配置） | [`docs/guide/installation.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/guide/installation.md) | 1-299 |
| 配置参考（模型解析） | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 391-512 |
| 代理覆盖配置 Schema | [`src/config/schema.ts:AgentOverrideConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L98-L119) | 98-119 |
| Category 配置 Schema | [`src/config/schema.ts:CategoryConfigSchema`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts#L154-L172) | 154-172 |
| Provider 优先级链文档 | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md#L445-L473) | 445-473 |

**关键常量**：
- 无：Provider 优先级链在配置文档中硬编码，非代码常量

**关键函数**：
- 无：模型解析逻辑由 OpenCode 核心处理，oh-my-opencode 提供配置和优先级定义

</details>
