---
title: "深度配置: 代理与权限 | oh-my-opencode"
sidebarTitle: "控制代理行为"
subtitle: "深度配置: 代理与权限 | oh-my-opencode"
description: "学习 oh-my-opencode 的代理配置、权限设置、模型覆盖和提示词修改方法。通过深度定制打造最适合你的 AI 开发团队，精确控制每个代理的行为和能力。"
tags:
  - "configuration"
  - "agents"
  - "permissions"
  - "customization"
prerequisite:
  - "start-installation"
  - "platforms-provider-setup"
order: 140
---

# 配置深度定制：代理与权限管理

## 学完你能做什么

- 自定义每个代理使用的模型和参数
- 精确控制代理的权限（文件编辑、Bash 执行、Web 请求等）
- 通过 `prompt_append` 为代理添加额外指令
- 创建自定义 Category 实现动态代理组合
- 启用/禁用特定代理、Skill、Hook 和 MCP

## 你现在的困境

**默认配置很好用，但不够贴合你的需求：**
- Oracle 用的 GPT 5.2 太贵，想换个便宜点的模型
- Explore 代理不应该有写文件权限，只让它搜索
- 想让 Librarian 优先搜索官方文档，而不是 GitHub
- 某个 Hook 总是误报，想临时禁用

**你需要的是"深度定制"**——不是"能用就行"，而是"正好够用"。

---

## 🎒 开始前的准备

::: warning 前置要求
本教程假设你已完成 [安装配置](../../start/installation/) 和 [Provider 设置](../../platforms/provider-setup/)。
:::

**你需要知道**：
- 配置文件位置：`~/.config/opencode/oh-my-opencode.json`（用户级）或 `.opencode/oh-my-opencode.json`（项目级）
- 用户级配置优先于项目级配置

---

## 核心思路

**配置优先级**：用户级配置 > 项目级配置 > 默认配置

```
~/.config/opencode/oh-my-opencode.json (最高优先级)
    ↓ 覆盖
.opencode/oh-my-opencode.json (项目级)
    ↓ 覆盖
oh-my-opencode 内置默认值 (最低优先级)
```

**配置文件支持 JSONC**：
- 可以用 `//` 添加注释
- 可以用 `/* */` 添加块注释
- 可以有尾随逗号

---

## 跟我做

### 第 1 步：找到配置文件并启用 Schema 自动补全

**为什么**
启用 JSON Schema 后，编辑器会自动提示所有可用字段和类型，避免写错配置。

**操作**：

```jsonc
{
  // 添加这行以启用自动补全
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",
  
  // 你的配置...
}
```

**你应该看到**：
- 在 VS Code / JetBrains 等编辑器中，输入 `{` 后会自动提示所有可用字段
- 鼠标悬停在字段上会显示说明和类型

---

### 第 2 步：自定义代理模型

**为什么**
不同任务需要不同模型：
- **架构设计**：用最强模型（Claude Opus 4.5）
- **快速探索**：用最快模型（Grok Code）
- **UI 设计**：用视觉模型（Gemini 3 Pro）
- **成本控制**：简单任务用便宜模型

**操作**：

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "agents": {
    // Oracle：战略顾问，用 GPT 5.2
    "oracle": {
      "model": "openai/gpt-5.2",
      "temperature": 0.1  // 低温度，更确定性
    },

    // Explore：快速探索，用免费模型
    "explore": {
      "model": "opencode/gpt-5-nano",  // 免费
      "temperature": 0.3
    },

    // Librarian：文档搜索，用大上下文模型
    "librarian": {
      "model": "anthropic/claude-sonnet-4-5"
    },

    // Multimodal Looker：媒体分析，用 Gemini
    "multimodal-looker": {
      "model": "google/gemini-3-flash"
    }
  }
}
```

**你应该看到**：
- 各代理使用不同的模型，根据任务特点优化
- 保存配置后，下次调用对应代理时会使用新模型

---

### 第 3 步：配置代理权限

**为什么**
某些代理**不应该**有全部权限：
- Oracle（战略顾问）：只读，不需要写文件
- Librarian（研究专家）：只读，不需要执行 Bash
- Explore（探索）：只读，不需要 Web 请求

**操作**：

```jsonc
{
  "agents": {
    "explore": {
      // 禁止写文件和执行 Bash，只允许 Web 搜索
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"
      }
    },

    "librarian": {
      // 只读权限
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // 需要搜索文档
      }
    },

    "oracle": {
      // 只读权限
      "permission": {
        "edit": "deny",
        "bash": "deny",
        "webfetch": "allow"  // 需要查资料
      }
    },

    // Sisyphus：主编排器，可以执行所有操作
    "sisyphus": {
      "permission": {
        "edit": "allow",
        "bash": "allow",
        "webfetch": "allow"
      }
    }
  }
}
```

**权限说明**：

| 权限           | 值            | 说明                                               |
| -------------- | ------------- | -------------------------------------------------- |
| `edit`         | `ask/allow/deny` | 文件编辑权限                                    |
| `bash`         | `ask/allow/deny` 或对象 | Bash 执行权限（可细化到具体命令）             |
| `webfetch`     | `ask/allow/deny` | Web 请求权限                                  |
| `doom_loop`    | `ask/allow/deny` | 允许代理覆盖无限循环检测                   |
| `external_directory` | `ask/allow/deny` | 访问项目外目录权限                         |

**细化 Bash 权限**：

```jsonc
{
  "agents": {
    "explore": {
      "permission": {
        "bash": {
          "git": "allow",      // 允许执行 git 命令
          "grep": "allow",     // 允许执行 grep
          "rm": "deny",       // 禁止删除文件
          "mv": "deny"        // 禁止移动文件
        }
      }
    }
  }
}
```

**你应该看到**：
- 配置权限后，代理尝试执行被禁用的操作时会自动拒绝
- 在 OpenCode 中会看到权限被拒绝的提示

---

### 第 4 步：使用 prompt_append 添加额外指令

**为什么**
默认系统提示已经很好，但你可能有**特殊需求**：
- 让 Librarian 优先搜索特定文档
- 让 Oracle 遵循特定架构模式
- 让 Explore 使用特定搜索关键词

**操作**：

```jsonc
{
  "agents": {
    "librarian": {
      // 追加到默认系统提示后面，不会覆盖
      "prompt_append": "Always use elisp-dev-mcp for Emacs Lisp documentation lookups. " +
                      "When searching for docs, prioritize official documentation over blog posts."
    },

    "oracle": {
      "prompt_append": "Follow SOLID principles and Clean Architecture patterns. " +
                    "Always suggest TypeScript types for all function signatures."
    },

    "explore": {
      "prompt_append": "When searching code, prioritize recent commits and actively maintained files. " +
                    "Ignore test files unless explicitly asked."
    }
  }
}
```

**你应该看到**：
- 代理的行为发生变化，但仍然保持原有能力
- 比如让 Oracle 询问时总是建议 TypeScript 类型

---

### 第 5 步：自定义 Category 配置

**为什么**
Category 是 v3.0 的新特性，实现**动态代理组合**：
- 为特定任务类型预设模型和参数
- 通过 `delegate_task(category="...")` 快速调用
- 比"手动选模型+写提示词"更高效

**操作**：

```jsonc
{
  "categories": {
    // 自定义：数据科学任务
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "prompt_append": "Focus on data analysis, ML pipelines, and statistical methods. " +
                     "Use pandas/numpy for Python and dplyr/tidyr for R."
    },

    // 覆盖默认：UI 任务使用自定义提示
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "prompt_append": "Use shadcn/ui components and Tailwind CSS. " +
                     "Ensure responsive design and accessibility."
    },

    // 覆盖默认：快速任务
    "quick": {
      "model": "anthropic/claude-haiku-4-5",
      "temperature": 0.1,
      "prompt_append": "Be concise. Focus on simple fixes and quick searches."
    }
  }
}
```

**Category 配置字段**：

| 字段              | 说明                         | 示例                              |
| ----------------- | ---------------------------- | --------------------------------- |
| `model`           | 使用的模型                   | `"anthropic/claude-sonnet-4-5"`    |
| `temperature`     | 温度（0-2）                 | `0.2` (确定性) / `0.8` (创造性)    |
| `top_p`           | 核采样（0-1）               | `0.9`                              |
| `maxTokens`       | 最大 Token 数               | `4000`                             |
| `thinking`        | Thinking 配置               | `{"type": "enabled", "budgetTokens": 16000}` |
| `prompt_append`    | 追加提示                   | `"Use X for Y"`                    |
| `tools`           | 工具权限                   | `{"bash": false}`                    |
| `is_unstable_agent` | 标记为不稳定（强制后台模式） | `true`                              |

**使用 Category**：

```
// 在 OpenCode 中
delegate_task(category="data-science", prompt="分析这个数据集并生成可视化")
delegate_task(category="visual-engineering", prompt="创建响应式仪表盘组件")
delegate_task(category="quick", prompt="搜索这个函数的定义")
```

**你应该看到**：
- 不同类型的任务自动使用最适合的模型和配置
- 无需每次手动指定模型和参数

---

### 第 6 步：禁用特定功能

**为什么**
某些功能可能不适合你的工作流：
- `comment-checker`：你的项目允许详细注释
- `agent-usage-reminder`：你知道什么时候用什么代理
- 某个 MCP：你不需要

**操作**：

```jsonc
{
  // 禁用特定 Hooks
  "disabled_hooks": [
    "comment-checker",           // 不检查注释
    "agent-usage-reminder",       // 不提示代理使用建议
    "startup-toast"               // 不显示启动通知
  ],

  // 禁用特定 Skills
  "disabled_skills": [
    "playwright",                // 不使用 Playwright
    "frontend-ui-ux"            // 不使用内置前端 Skill
  ],

  // 禁用特定 MCPs
  "disabled_mcps": [
    "websearch",                // 不使用 Exa 搜索
    "context7",                // 不使用 Context7
    "grep_app"                 // 不使用 grep.app
  ],

  // 禁用特定代理
  "disabled_agents": [
    "multimodal-looker",        // 不使用多模态 Looker
    "metis"                   // 不使用 Metis 前规划分析
  ]
}
```

**可用 Hooks 列表**（部分）：

| Hook 名称                | 功能                           |
| ----------------------- | ------------------------------ |
| `todo-continuation-enforcer` | 强制完成 TODO 列表              |
| `comment-checker`          | 检测冗余注释                  |
| `tool-output-truncator`     | 截断工具输出以节省上下文        |
| `keyword-detector`         | 检测 ultrawork 等关键词          |
| `agent-usage-reminder`     | 提示应该使用哪个代理           |
| `session-notification`      | 会话结束通知                  |
| `background-notification`    | 后台任务完成通知              |

**你应该看到**：
- 被禁用的功能不再执行
- 重新启用后恢复功能

---

### 第 7 步：配置后台任务并发控制

**为什么**
并行后台任务需要**控制并发数**：
- 避免 API 限流
- 控制成本（昂贵模型不能太多并发）
- 遵守 Provider 配额

**操作**：

```jsonc
{
  "background_task": {
    // 默认最大并发数
    "defaultConcurrency": 5,

    // Provider 级并发限制
    "providerConcurrency": {
      "anthropic": 3,      // Anthropic API 最多 3 个并发
      "openai": 5,         // OpenAI API 最多 5 个并发
      "google": 10          // Gemini API 最多 10 个并发
    },

    // Model 级并发限制（优先级最高）
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,     // Opus 太贵，限制 2 个并发
      "google/gemini-3-flash": 10,          // Flash 很便宜，允许 10 个并发
      "anthropic/claude-haiku-4-5": 15      // Haiku 更便宜，允许 15 个并发
    }
  }
}
```

**优先级顺序**：
```
modelConcurrency > providerConcurrency > defaultConcurrency
```

**你应该看到**：
- 超过并发限制的后台任务会排队等待
- 昂贵模型的并发被限制，节省成本

---

### 第 8 步：启用实验性功能

**为什么**
实验性功能提供**额外能力**，但可能有不稳定：
- `aggressive_truncation`：更激进的上下文截断
- `auto_resume`：自动从崩溃恢复
- `truncate_all_tool_outputs`：截断所有工具输出

::: danger 警告
实验性功能可能在未来版本中被移除或行为改变。启用前请充分测试。
:::

**操作**：

```jsonc
{
  "experimental": {
    // 启用更激进的工具输出截断
    "aggressive_truncation": true,

    // 自动从 thinking block 错误恢复
    "auto_resume": true,

    // 截断所有工具输出（不只是 Grep/Glob/LSP/AST-Grep）
    "truncate_all_tool_outputs": false
  }
}
```

**你应该看到**：
- 激进模式下，工具输出被更严格地截断以节省上下文
- 启用 `auto_resume` 后，代理遇到错误会自动恢复继续工作

---

## 检查点 ✅

**验证配置是否生效**：

```bash
# 运行诊断命令
bunx oh-my-opencode doctor --verbose
```

**你应该看到**：
- 每个代理的模型解析结果
- 你的配置覆盖是否生效
- 禁用的功能是否被正确识别

---

## 踩坑提醒

### 1. 配置文件格式错误

**问题**：
- JSON 语法错误（少逗号、多逗号）
- 字段名拼写错误（`temperature` 写成 `temparature`）

**解决**：
```bash
# 验证 JSON 格式
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

### 2. 权限配置过于严格

**问题**：
- 某些代理被完全禁用（`edit: "deny"`, `bash: "deny"`）
- 导致代理无法完成正常工作

**解决**：
- 只读代理（Oracle、Librarian）可以禁用 `edit` 和 `bash`
- 主编排器（Sisyphus）需要完整权限

### 3. Category 配置不生效

**问题**：
- Category 名称拼写错误（`visual-engineering` 写成 `visual-engineering`）
- `delegate_task` 没有指定 `category` 参数

**解决**：
- 检查 `delegate_task(category="...")` 中的名称是否与配置一致
- 使用 `doctor --verbose` 验证 Category 解析结果

### 4. 并发限制太低

**问题**：
- `modelConcurrency` 设置太低（如 `1`）
- 后台任务几乎串行执行，失去并行优势

**解决**：
- 根据预算和 API 配额合理设置
- 昂贵模型（Opus）限制为 2-3，便宜模型（Haiku）可以 10+

---

## 本课小结

**配置深度定制 = 精确控制**：

| 配置项           | 用途                          | 常见场景                         |
| ---------------- | ----------------------------- | -------------------------------- |
| `agents.model`    | 覆盖代理模型                  | 成本优化、任务适配             |
| `agents.permission` | 控制代理权限                | 安全隔离、只读模式           |
| `agents.prompt_append` | 追加额外指令                | 遵循架构规范、优化搜索策略 |
| `categories`      | 动态代理组合                  | 快速调用特定类型任务           |
| `background_task` | 并发控制                     | 成本控制、API 配额           |
| `disabled_*`      | 禁用特定功能                 | 移除不常用功能               |

**记住**：
- 用户级配置（`~/.config/opencode/oh-my-opencode.json`）优先于项目级
- 使用 JSONC 让配置更易读
- 运行 `oh-my-opencode doctor --verbose` 验证配置

---

## 下一课预告

> 下一课我们学习 **[配置诊断与故障排除](../../faq/troubleshooting/)**。
>
> 你会学到：
> - 使用 doctor 命令进行健康检查
> - 诊断 OpenCode 版本、插件注册、Provider 配置等问题
> - 理解模型解析机制和 Categories 配置
> - 使用 JSON 输出进行自动化诊断

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能                | 文件路径                                                                 | 行号    |
| ------------------- | -------------------------------------------------------------------------- | ------- |
| 配置 Schema 定义    | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 1-378   |
| AgentOverrideConfig | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 98-119   |
| CategoryConfig      | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 154-172  |
| AgentPermissionSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 11-17    |
| OhMyOpenCodeConfigSchema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 329-350  |
| 配置文档          | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/docs/configurations.md) | 1-595   |

**关键常量**：
- `PermissionValue = z.enum(["ask", "allow", "deny"])`：权限值枚举

**关键类型**：
- `AgentOverrideConfig`：代理覆盖配置（模型、温度、提示词等）
- `CategoryConfig`：Category 配置（模型、温度、提示词等）
- `AgentPermissionSchema`：代理权限配置（edit、bash、webfetch等）
- `BackgroundTaskConfig`：后台任务并发配置

**内置代理枚举**（`BuiltinAgentNameSchema`）：
- `sisyphus`, `prometheus`, `oracle`, `librarian`, `explore`, `multimodal-looker`, `metis`, `momus`, `atlas`

**内置 Skill 枚举**（`BuiltinSkillNameSchema`）：
- `playwright`, `agent-browser`, `frontend-ui-ux`, `git-master`

**内置 Category 枚举**（`BuiltinCategoryNameSchema`）：
- `visual-engineering`, `ultrabrain`, `artistry`, `quick`, `unspecified-low`, `unspecified-high`, `writing`

</details>
