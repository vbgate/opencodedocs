---
title: "v3.0 新特性: Categories 和 Skills 系统 | oh-my-opencode"
sidebarTitle: "让 AI 有 7 类专长"
subtitle: "v3.0 新特性: Categories 和 Skills 系统"
description: "学习 oh-my-opencode v3.0 的 Categories 和 Skills 系统。掌握 7 个任务分类、3 个技能包和动态代理组合能力。"
tags:
  - "v3.0"
  - "categories"
  - "skills"
  - "changelog"
order: 200
---

# v3.0 新特性：Categories 和 Skills 系统全面解析

## 版本概览

oh-my-opencode v3.0 是一个重要的里程碑版本，引入了全新的 **Categories 和 Skills 系统**，彻底改变了 AI 代理的编排方式。本版本旨在让 AI 代理更加专业化、灵活化和可组合化。

**关键改进**：
- 🎯 **Categories 系统**：7 个内置任务分类，自动选择最优模型
- 🛠️ **Skills 系统**：3 个内置专业技能包，注入领域知识
- 🔄 **动态组合**：通过 `delegate_task` 自由组合 Category 和 Skill
- 🚀 **Sisyphus-Junior**：新的委托任务执行器，防止无限循环
- 📝 **灵活配置**：支持自定义 Categories 和 Skills

---

## 核心新特性 1：Categories 系统

### 什么是 Category？

Category 是针对特定领域优化的**代理配置预设**。它回答了一个关键问题：**"这是什么类型的工作？"**

每个 Category 定义了：
- **使用的模型**（model）
- **温度参数**（temperature）
- **提示心态**（prompt mindset）
- **推理能力**（reasoning effort）
- **工具权限**（tools）

### 7 个内置 Categories

| Category | 默认模型 | Temperature | 适用场景 |
|--- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 前端、UI/UX、设计、样式、动画 |
| `ultrabrain` | `openai/gpt-5.2-codex` (xhigh) | 0.1 | 深度逻辑推理、需要大量分析的复杂架构决策 |
| `artistry` | `google/gemini-3-pro` (max) | 0.7 | 高创意/艺术任务、新颖想法 |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 简单任务 - 单文件修改、拼写错误修复、简单修改 |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 不符合其他类别的任务，低工作量 |
| `unspecified-high` | `anthropic/claude-opus-4-5` (max) | 0.1 | 不符合其他类别的任务，高工作量 |
| `writing` | `google/gemini-3-flash` | 0.1 | 文档、散文、技术写作 |

**来源**：`docs/category-skill-guide.md:22-30`

### 如何使用 Categories？

在调用 `delegate_task` 工具时，指定 `category` 参数：

```typescript
// 委托前端任务到 visual-engineering category
delegate_task(
  category="visual-engineering",
  prompt="为仪表盘页面添加响应式图表组件"
)
```

系统会自动：
1. 选择 `visual-engineering` Category
2. 使用 `google/gemini-3-pro` 模型
3. 应用 `temperature: 0.7`（高创造性）
4. 加载该 Category 的提示心态

### Sisyphus-Junior：委托任务执行器

当你使用 Category 时，一个名为 **Sisyphus-Junior** 的特殊代理会执行任务。

**关键特性**：
- ❌ **不能重新委托**任务给其他代理
- 🎯 **专注于分配的任务**
- 🔄 **防止无限委托循环**

**设计目的**：确保代理专注于当前任务，避免任务层层委托导致的复杂性。

---

## 核心新特性 2：Skills 系统

### 什么是 Skill？

Skill 是一种将**专业知识（Context）**和**工具（MCP）**注入到代理中的机制。它回答了另一个关键问题：**"需要什么工具和知识？"**

### 3 个内置 Skills

#### 1. `git-master`

**能力**：
- Git 专家
- 检测提交风格
- 拆分原子提交
- 制定 rebase 策略

**MCP**：无（使用 Git 命令）

**适用场景**：提交、历史搜索、分支管理

#### 2. `playwright`

**能力**：
- 浏览器自动化
- 网页测试
- 截图
- 数据抓取

**MCP**：`@playwright/mcp`（自动执行）

**适用场景**：实现后的 UI 验证、E2E 测试编写

#### 3. `frontend-ui-ux`

**能力**：
- 注入设计师思维模式
- 颜色、排版、动效指南

**适用场景**：超越简单实现的美观 UI 工作

**来源**：`docs/category-skill-guide.md:57-70`

### 如何使用 Skills？

在 `delegate_task` 中添加 `load_skills` 数组：

```typescript
// 委托快速任务并加载 git-master 技能
delegate_task(
  category="quick",
  load_skills=["git-master"],
  prompt="提交当前更改。遵循提交消息风格。"
)
```

系统会自动：
1. 选择 `quick` Category（Claude Haiku，低成本）
2. 加载 `git-master` Skill（注入 Git 专业知识）
3. 启动 Sisyphus-Junior 执行任务

### 自定义 Skills

你可以直接在项目根目录的 `.opencode/skills/` 或用户目录的 `~/.claude/skills/` 中添加自定义 Skills。

**示例：`.opencode/skills/my-skill/SKILL.md`**

```markdown
---
name: my-skill
description: 我的专业自定义技能
mcp:
  my-mcp:
    command: npx
    args: ["-y", "my-mcp-server"]
---

# 我的技能提示词

此内容将被注入到代理的系统提示词中。
...
```

**来源**：`docs/category-skill-guide.md:87-103`

---

## 核心新特性 3：动态组合能力

### 组合策略：创建专业代理

通过组合不同的 Categories 和 Skills，你可以创建强大的专业代理。

#### 🎨 设计师（UI 实现）

- **Category**: `visual-engineering`
- **load_skills**: `["frontend-ui-ux", "playwright"]`
- **效果**：实现美观的 UI 并直接在浏览器中验证渲染结果

#### 🏗️ 架构师（设计审查）

- **Category**: `ultrabrain`
- **load_skills**: `[]`（纯推理）
- **效果**：利用 GPT-5.2 的逻辑推理能力进行深入的系统架构分析

#### ⚡ 维护者（快速修复）

- **Category**: `quick`
- **load_skills**: `["git-master"]`
- **效果**：使用成本效益高的模型快速修复代码并生成干净的提交

**来源**：`docs/category-skill-guide.md:111-124`

### delegate_task 提示词指南

委托任务时，**清晰且具体**的提示词至关重要。包含以下 7 个元素：

1. **TASK**：需要做什么？（单一目标）
2. **EXPECTED OUTCOME**：交付物是什么？
3. **REQUIRED SKILLS**：应该通过 `load_skills` 加载哪些技能？
4. **REQUIRED TOOLS**：必须使用哪些工具？（白名单）
5. **MUST DO**：必须做什么（约束）
6. **MUST NOT DO**：绝不能做什么
7. **CONTEXT**：文件路径、现有模式、参考材料

**❌ 坏示例**：
> "修复这个"

**✅ 好示例**：
> **TASK**：修复 `LoginButton.tsx` 中的移动端布局破坏问题
> **CONTEXT**：`src/components/LoginButton.tsx`，使用 Tailwind CSS
> **MUST DO**：在 `md:` 断点处更改 flex-direction
> **MUST NOT DO**：修改现有桌面布局
> **EXPECTED**：按钮在移动端垂直对齐

**来源**：`docs/category-skill-guide.md:130-148`

---

## 配置指南

### Category 配置 Schema

你可以在 `oh-my-opencode.json` 中微调 Categories。

| 字段 | 类型 | 描述 |
|--- | --- | ---|
| `description` | string | Category 目的的可读描述。显示在 delegate_task 提示中。 |
| `model` | string | 使用的 AI 模型 ID（如 `anthropic/claude-opus-4-5`） |
| `variant` | string | 模型变体（如 `max`、`xhigh`） |
| `temperature` | number | 创造性级别（0.0 ~ 2.0）。越低越确定。 |
| `top_p` | number | 核采样参数（0.0 ~ 1.0） |
| `prompt_append` | string | 选择此 Category 时追加到系统提示词的内容 |
| `thinking` | object | Thinking 模型配置（`{ type: "enabled", budgetTokens: 16000 }`） |
| `reasoningEffort` | string | 推理努力级别（`low`、`medium`、`high`） |
| `textVerbosity` | string | 文本详细程度（`low`、`medium`、`high`） |
| `tools` | object | 工具使用控制（使用 `{ "tool_name": false }` 禁用） |
| `maxTokens` | number | 最大响应 token 数 |
| `is_unstable_agent` | boolean | 标记代理为不稳定 - 强制后台模式以进行监控 |

**来源**：`docs/category-skill-guide.md:159-172`

### 配置示例

```jsonc
{
  "categories": {
    // 1. 定义新的自定义 category
    "korean-writer": {
      "model": "google/gemini-3-flash",
      "temperature": 0.5,
      "prompt_append": "You are a Korean technical writer. Maintain a friendly and clear tone."
    },

    // 2. 覆盖现有 category（更改模型）
    "visual-engineering": {
      "model": "openai/gpt-5.2",
      "temperature": 0.8
    },

    // 3. 配置 thinking 模型并限制工具
    "deep-reasoning": {
      "model": "anthropic/claude-opus-4-5",
      "thinking": {
        "type": "enabled",
        "budgetTokens": 32000
      },
      "tools": {
        "websearch_web_search_exa": false // 禁用网络搜索
      }
    }
  },

  // 禁用 skills
  "disabled_skills": ["playwright"]
}
```

**来源**：`docs/category-skill-guide.md:175-206`

---

## 其他重要改进

除了 Categories 和 Skills 系统，v3.0 还包含以下重要改进：

### 稳定性提升
- ✅ 版本标记为稳定（3.0.1）
- ✅ 优化了代理委托机制
- ✅ 改进了错误恢复能力

### 性能优化
- ✅ 减少了不必要的上下文注入
- ✅ 优化了后台任务轮询机制
- ✅ 提升了多模型编排效率

### Claude Code 兼容性
- ✅ 完整兼容 Claude Code 的配置格式
- ✅ 支持加载 Claude Code 的 Skills、Commands、MCPs
- ✅ 自动发现和配置

**来源**：`README.md:18-20`, `README.md:292-304`

---

## 下一步

v3.0 的 Categories 和 Skills 系统为 oh-my-opencode 奠定了灵活扩展的基础。如果你想要深入了解如何使用这些新特性，可以参考以下章节：

- [Categories 和 Skills：动态代理组合](../../advanced/categories-skills/) - 详细使用指南
- [内置 Skills：浏览器自动化与 Git 专家](../../advanced/builtin-skills/) - Skills 深度解析
- [配置深度定制：代理与权限管理](../../advanced/advanced-configuration/) - 自定义配置指南

开始探索这些新特性，让 AI 代理更加专业化、高效化！
