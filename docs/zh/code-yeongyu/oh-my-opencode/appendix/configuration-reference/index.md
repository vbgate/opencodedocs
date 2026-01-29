---
title: "配置参考: 完整配置选项 | oh-my-opencode"
sidebarTitle: "配置全攻略"
subtitle: "配置参考: 完整配置选项"
description: "学习 oh-my-opencode 的完整配置选项和字段定义。涵盖代理、Categories、Hooks、后台任务等所有配置，帮助深度定制 OpenCode 开发环境，优化 AI 编码工作流。"
tags:
  - "configuration"
  - "reference"
  - "schema"
prerequisite: []
order: 180
---

# 配置参考：完整的配置文件 Schema 说明

本页提供 oh-my-opencode 配置文件的完整字段定义和说明。

::: info 配置文件位置
- 项目级：`.opencode/oh-my-opencode.json`
- 用户级（macOS/Linux）：`~/.config/opencode/oh-my-opencode.json`
- 用户级（Windows）：`%APPDATA%\opencode\oh-my-opencode.json`

项目级配置优先于用户级配置。
:::

::: tip 启用自动补全
在配置文件顶部添加 `$schema` 字段可获得 IDE 自动补全：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json"
}
```
:::

## 根级字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `$schema` | string | 否 | - | JSON Schema 链接，用于自动补全 |
| `disabled_mcps` | string[] | 否 | [] | 禁用的 MCP 列表 |
| `disabled_agents` | string[] | 否 | [] | 禁用的代理列表 |
| `disabled_skills` | string[] | 否 | [] | 禁用的技能列表 |
| `disabled_hooks` | string[] | 否 | [] | 禁用的钩子列表 |
| `disabled_commands` | string[] | 否 | [] | 禁用的命令列表 |
| `agents` | object | 否 | - | 代理覆盖配置 |
| `categories` | object | 否 | - | Category 自定义配置 |
| `claude_code` | object | 否 | - | Claude Code 兼容性配置 |
| `sisyphus_agent` | object | 否 | - | Sisyphus 代理配置 |
| `comment_checker` | object | 否 | - | 注释检查器配置 |
| `experimental` | object | 否 | - | 实验性功能配置 |
| `auto_update` | boolean | 否 | true | 自动更新检查 |
| `skills` | object\|array | 否 | - | Skills 配置 |
| `ralph_loop` | object | 否 | - | Ralph Loop 配置 |
| `background_task` | object | 否 | - | 后台任务并发配置 |
| `notification` | object | 否 | - | 通知配置 |
| `git_master` | object | 否 | - | Git Master 技能配置 |
| `browser_automation_engine` | object | 否 | - | 浏览器自动化引擎配置 |
| `tmux` | object | 否 | - | Tmux 会话管理配置 |

## agents - 代理配置

覆盖内置代理的设置。每个代理支持以下字段：

### 通用代理字段

| 字段 | 类型 | 必填 | 描述 |
|--- | --- | --- | ---|
| `model` | string | 否 | 覆盖代理使用的模型（已弃用，推荐使用 category） |
| `variant` | string | 否 | 模型变体 |
| `category` | string | 否 | 从 Category 继承模型和配置 |
| `skills` | string[] | 否 | 注入到代理提示中的技能列表 |
| `temperature` | number | 否 | 0-2，控制随机性 |
| `top_p` | number | 否 | 0-1，核采样参数 |
| `prompt` | string | 否 | 完全覆盖默认系统提示 |
| `prompt_append` | string | 否 | 追加到默认提示后面 |
| `tools` | object | 否 | 工具权限覆盖（`{toolName: boolean}`） |
| `disable` | boolean | 否 | 禁用该代理 |
| `description` | string | 否 | 代理描述 |
| `mode` | enum | 否 | `subagent` / `primary` / `all` |
| `color` | string | 否 | Hex 颜色（如 `#FF0000`） |
| `permission` | object | 否 | 代理权限限制 |

### permission - 代理权限

| 字段 | 类型 | 必填 | 值 | 描述 |
|--- | --- | --- | --- | ---|
| `edit` | string | 否 | `ask`/`allow`/`deny` | 文件编辑权限 |
| `bash` | string/object | 否 | `ask`/`allow`/`deny` 或 per-command | Bash 执行权限 |
| `webfetch` | string | 否 | `ask`/`allow`/`deny` | Web 请求权限 |
| `doom_loop` | string | 否 | `ask`/`allow`/`deny` | 无限循环检测覆盖权限 |
| `external_directory` | string | 否 | `ask`/`allow`/`deny` | 访问外部目录权限 |

### 可配置的代理列表

| 代理名 | 说明 |
|--- | ---|
| `sisyphus` | 主编排器代理 |
| `prometheus` | 战略规划师代理 |
| `oracle` | 战略顾问代理 |
| `librarian` | 多仓库研究专家代理 |
| `explore` | 快速代码库探索专家代理 |
| `multimodal-looker` | 媒体分析专家代理 |
| `metis` | 前规划分析代理 |
| `momus` | 规划审查者代理 |
| `atlas` | 主编排器代理 |
| `sisyphus-junior` | 类别生成的任务执行器代理 |

### 配置示例

```jsonc
{
  "agents": {
    "sisyphus": {
      "model": "anthropic/claude-opus-4-5",
      "temperature": 0.1,
      "skills": ["git-master"]
    },
    "oracle": {
      "model": "openai/gpt-5.2",
      "permission": {
        "edit": "deny",
        "bash": "ask"
      }
    },
    "multimodal-looker": {
      "disable": true
    }
  }
}
```

## categories - Category 配置

定义 Categories（模型抽象），用于动态代理组合。

### Category 字段

| 字段 | 类型 | 必填 | 描述 |
|--- | --- | --- | ---|
| `description` | string | 否 | Category 的目的描述（显示在 delegate_task 提示中） |
| `model` | string | 否 | 覆盖 Category 使用的模型 |
| `variant` | string | 否 | 模型变体 |
| `temperature` | number | 否 | 0-2，温度 |
| `top_p` | number | 否 | 0-1，核采样 |
| `maxTokens` | number | 否 | 最大 Token 数 |
| `thinking` | object | 否 | Thinking 配置 `{type, budgetTokens}` |
| `reasoningEffort` | enum | 否 | `low` / `medium` / `high` / `xhigh` |
| `textVerbosity` | enum | 否 | `low` / `medium` / `high` |
| `tools` | object | 否 | 工具权限 |
| `prompt_append` | string | 否 | 追加提示 |
| `is_unstable_agent` | boolean | 否 | 标记为不稳定代理（强制后台模式） |

### thinking 配置

| 字段 | 类型 | 必填 | 值 | 描述 |
|--- | --- | --- | --- | ---|
| `type` | string | 是 | `enabled`/`disabled` | 是否启用 Thinking |
| `budgetTokens` | number | 否 | - | Thinking budget token 数 |

### 内置 Categories

| Category | 默认模型 | Temperature | 描述 |
|--- | --- | --- | ---|
| `visual-engineering` | `google/gemini-3-pro` | 0.7 | 前端、UI/UX、设计任务 |
| `ultrabrain` | `openai/gpt-5.2-codex` | 0.1 | 高智商推理任务 |
| `artistry` | `google/gemini-3-pro` | 0.7 | 创意和艺术任务 |
| `quick` | `anthropic/claude-haiku-4-5` | 0.1 | 快速、低成本任务 |
| `unspecified-low` | `anthropic/claude-sonnet-4-5` | 0.1 | 未指定类型的中等任务 |
| `unspecified-high` | `anthropic/claude-opus-4-5` | 0.1 | 未指定类型的高质量任务 |
| `writing` | `google/gemini-3-flash` | 0.1 | 文档和写作任务 |

### 配置示例

```jsonc
{
  "categories": {
    "visual-engineering": {
      "model": "google/gemini-3-pro",
      "temperature": 0.7,
      "prompt_append": "Use shadcn/ui components and Tailwind CSS."
    },
    "data-science": {
      "model": "anthropic/claude-sonnet-4-5",
      "temperature": 0.2,
      "description": "Data analysis and ML tasks"
    }
  }
}
```

## claude_code - Claude Code 兼容配置

控制 Claude Code 兼容性层的各个功能。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `mcp` | boolean | 否 | - | 是否加载 `.mcp.json` 文件 |
| `commands` | boolean | 否 | - | 是否加载 Commands |
| `skills` | boolean | 否 | - | 是否加载 Skills |
| `agents` | boolean | 否 | - | 是否加载 Agents（预留） |
| `hooks` | boolean | 否 | - | 是否加载 settings.json hooks |
| `plugins` | boolean | 否 | - | 是否加载 Marketplace 插件 |
| `plugins_override` | object | 否 | - | 禁用特定插件（`{pluginName: boolean}`） |

### 配置示例

```jsonc
{
  "claude_code": {
    "mcp": true,
    "commands": true,
    "skills": true,
    "hooks": false,
    "plugins": true,
    "plugins_override": {
      "some-plugin": false
    }
  }
}
```

## sisyphus_agent - Sisyphus 代理配置

控制 Sisyphus 编排系统的行为。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `disabled` | boolean | 否 | false | 禁用 Sisyphus 编排系统 |
| `default_builder_enabled` | boolean | 否 | false | 启用 OpenCode-Builder 代理 |
| `planner_enabled` | boolean | 否 | true | 启用 Prometheus（Planner）代理 |
| `replace_plan` | boolean | 否 | true | 将默认 plan 代理降级为 subagent |

### 配置示例

```jsonc
{
  "sisyphus_agent": {
    "disabled": false,
    "default_builder_enabled": false,
    "planner_enabled": true,
    "replace_plan": true
  }
}
```

## background_task - 后台任务配置

控制后台代理管理系统的并发行为。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `defaultConcurrency` | number | 否 | - | 默认最大并发数 |
| `providerConcurrency` | object | 否 | - | Provider 级并发限制（`{providerName: number}`） |
| `modelConcurrency` | object | 否 | - | Model 级并发限制（`{modelName: number}`） |
| `staleTimeoutMs` | number | 否 | 180000 | 超时时间（毫秒），最小 60000 |

### 优先级顺序

`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

### 配置示例

```jsonc
{
  "background_task": {
    "defaultConcurrency": 5,
    "providerConcurrency": {
      "anthropic": 3,
      "openai": 5,
      "google": 10
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 2,
      "google/gemini-3-flash": 10
    },
    "staleTimeoutMs": 180000
  }
}
```

## git_master - Git Master 技能配置

控制 Git Master 技能的行为。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `commit_footer` | boolean | 否 | true | 在提交消息中添加 "Ultraworked with Sisyphus" footer |
| `include_co_authored_by` | boolean | 否 | true | 在提交消息中添加 "Co-authored-by: Sisyphus" trailer |

### 配置示例

```jsonc
{
  "git_master": {
    "commit_footer": true,
    "include_co_authored_by": true
  }
}
```

## browser_automation_engine - 浏览器自动化配置

选择浏览器自动化提供程序。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `provider` | enum | 否 | `playwright` | 浏览器自动化提供程序 |

### provider 可选值

| 值 | 描述 | 安装要求 |
|--- | --- | ---|
| `playwright` | 使用 Playwright MCP 服务器 | 自动安装 |
|--- | --- | ---|

### 配置示例

```jsonc
{
  "browser_automation_engine": {
    "provider": "playwright"
  }
}
```

## tmux - Tmux 会话配置

控制 Tmux 会话管理行为。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 否 | false | 是否启用 Tmux 会话管理 |
| `layout` | enum | 否 | `main-vertical` | Tmux 布局 |
| `main_pane_size` | number | 否 | 60 | 主窗格大小（20-80） |
| `main_pane_min_width` | number | 否 | 120 | 主窗格最小宽度 |
| `agent_pane_min_width` | number | 否 | 40 | 代理窗格最小宽度 |

### layout 可选值

| 值 | 描述 |
|--- | ---|
| `main-horizontal` | 主窗格在顶部，代理窗格在底部堆叠 |
| `main-vertical` | 主窗格在左侧，代理窗格在右侧堆叠（默认） |
| `tiled` | 所有窗格相同大小的网格 |
| `even-horizontal` | 所有窗格水平排列 |
| `even-vertical` | 所有窗格垂直堆叠 |

### 配置示例

```jsonc
{
  "tmux": {
    "enabled": false,
    "layout": "main-vertical",
    "main_pane_size": 60,
    "main_pane_min_width": 120,
    "agent_pane_min_width": 40
  }
}
```

## ralph_loop - Ralph Loop 配置

控制 Ralph Loop 循环工作流的行为。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 否 | false | 是否启用 Ralph Loop 功能 |
| `default_max_iterations` | number | 否 | 100 | 默认最大迭代次数（1-1000） |
| `state_dir` | string | 否 | - | 自定义状态文件目录（相对于项目根目录） |

### 配置示例

```jsonc
{
  "ralph_loop": {
    "enabled": false,
    "default_max_iterations": 100,
    "state_dir": ".opencode/"
  }
}
```

## notification - 通知配置

控制系统通知行为。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `force_enable` | boolean | 否 | false | 强制启用 session-notification，即使检测到外部通知插件 |

### 配置示例

```jsonc
{
  "notification": {
    "force_enable": false
  }
}
```

## comment_checker - 注释检查器配置

控制注释检查器行为。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `custom_prompt` | string | 否 | - | 自定义提示，替换默认警告消息。使用 `{{comments}}` 占位符表示检测到的注释 XML |

### 配置示例

```jsonc
{
  "comment_checker": {
    "custom_prompt": "Please review these redundant comments: {{comments}}"
  }
}
```

## experimental - 实验性功能配置

控制实验性功能的启用。

### 字段

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `aggressive_truncation` | boolean | 否 | - | 启用更激进的截断行为 |
| `auto_resume` | boolean | 否 | - | 启用自动恢复（从思考块错误或思考禁用违规中恢复） |
| `truncate_all_tool_outputs` | boolean | 否 | false | 截断所有工具输出，而不仅仅是白名单工具 |
| `dynamic_context_pruning` | object | 否 | - | 动态上下文修剪配置 |

### dynamic_context_pruning 配置

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 否 | false | 启用动态上下文修剪 |
| `notification` | enum | 否 | `detailed` | 通知级别：`off` / `minimal` / `detailed` |
| `turn_protection` | object | 否 | - | Turn 保护配置 |
| `protected_tools` | string[] | 否 | - | 永不修剪的工具列表 |
| `strategies` | object | 否 | - | 修剪策略配置 |

### turn_protection 配置

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 否 | true | 启用 turn 保护 |
| `turns` | number | 否 | 3 | 保护最近 N 轮的工具输出（1-10） |

### strategies 配置

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `deduplication` | object | 否 | - | 去重策略配置 |
| `supersede_writes` | object | 否 | - | 写入覆盖策略配置 |
| `purge_errors` | object | 否 | - | 错误清理策略配置 |

### deduplication 配置

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 否 | true | 移除重复的工具调用（相同工具 + 相同参数） |

### supersede_writes 配置

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 否 | true | 在后续读取时修剪写入输入 |
| `aggressive` | boolean | 否 | false | 激进模式：如果 ANY 后续读取则修剪 ANY 写入 |

### purge_errors 配置

| 字段 | 类型 | 必填 | 默认值 | 描述 |
|--- | --- | --- | --- | ---|
| `enabled` | boolean | 否 | true | 在 N 轮后修剪错误的工具输入 |
| `turns` | number | 否 | 5 | 修剪错误工具输入的轮数（1-20） |

### 配置示例

```jsonc
{
  "experimental": {
    "aggressive_truncation": true,
    "auto_resume": true,
    "truncate_all_tool_outputs": false,
    "dynamic_context_pruning": {
      "enabled": false,
      "notification": "detailed",
      "turn_protection": {
        "enabled": true,
        "turns": 3
      },
      "protected_tools": [
        "task",
        "todowrite",
        "todoread",
        "lsp_rename",
        "session_read",
        "session_write",
        "session_search"
      ],
      "strategies": {
        "deduplication": {
          "enabled": true
        },
        "supersede_writes": {
          "enabled": true,
          "aggressive": false
        },
        "purge_errors": {
          "enabled": true,
          "turns": 5
        }
      }
    }
  }
}
```

## skills - Skills 配置

配置 Skills（专业技能）的加载和行为。

### 配置格式

Skills 支持两种格式：

**格式 1：简单数组**

```jsonc
{
  "skills": ["skill1", "skill2", "skill3"]
}
```

**格式 2：对象配置**

```jsonc
{
  "skills": {
    "sources": [
      "path/to/skills",
      {
        "path": "another/path",
        "recursive": true,
        "glob": "*.md"
      }
    ],
    "enable": ["skill1", "skill2"],
    "disable": ["skill3"]
  }
}
```

### Skill 定义字段

| 字段 | 类型 | 必填 | 描述 |
|--- | --- | --- | ---|
| `description` | string | 否 | Skill 描述 |
| `template` | string | 否 | Skill 模板 |
| `from` | string | 否 | 来源 |
| `model` | string | 否 | 使用的模型 |
| `agent` | string | 否 | 使用的代理 |
| `subtask` | boolean | 否 | 是否为子任务 |
| `argument-hint` | string | 否 | 参数提示 |
| `license` | string | 否 | 许可证 |
| `compatibility` | string | 否 | 兼容性 |
| `metadata` | object | 否 | 元数据 |
| `allowed-tools` | string[] | 否 | 允许的工具列表 |
| `disable` | boolean | 否 | 禁用该 Skill |

### 内置 Skills

| Skill | 描述 |
|--- | ---|
| `playwright` | 浏览器自动化（默认） |
| `agent-browser` | 浏览器自动化（Vercel CLI） |
| `frontend-ui-ux` | 前端 UI/UX 设计 |
| `git-master` | Git 专家 |

## 禁用列表

以下字段用于禁用特定功能模块。

### disabled_mcps - 禁用的 MCP 列表

```jsonc
{
  "disabled_mcps": ["websearch", "context7", "grep_app"]
}
```

### disabled_agents - 禁用的代理列表

```jsonc
{
  "disabled_agents": ["oracle", "multimodal-looker"]
}
```

### disabled_skills - 禁用的技能列表

```jsonc
{
  "disabled_skills": ["playwright"]
}
```

### disabled_hooks - 禁用的钩子列表

```jsonc
{
  "disabled_hooks": ["comment-checker", "agent-usage-reminder"]
}
```

### disabled_commands - 禁用的命令列表

```jsonc
{
  "disabled_commands": ["init-deep", "start-work"]
}
```

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 配置 Schema 定义 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/src/config/schema.ts) | 1-378 |
| JSON Schema | [`assets/oh-my-opencode.schema.json`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/assets/oh-my-opencode.schema.json) | 1-51200 |
| 配置文档 | [`docs/configurations.md`](https://github.com/code-yeongyu/oh-my-opencode/blob/master/docs/configurations.md) | 1-595 |

**关键类型**：
- `OhMyOpenCodeConfig`：主配置类型
- `AgentOverrideConfig`：代理覆盖配置类型
- `CategoryConfig`：Category 配置类型
- `BackgroundTaskConfig`：后台任务配置类型
- `PermissionValue`：权限值类型（`ask`/`allow`/`deny`）

**关键枚举**：
- `BuiltinAgentNameSchema`：内置代理名称枚举
- `BuiltinSkillNameSchema`：内置技能名称枚举
- `BuiltinCategoryNameSchema`：内置 Category 名称枚举
- `HookNameSchema`：钩子名称枚举
- `BrowserAutomationProviderSchema`：浏览器自动化提供程序枚举

---

## 下一课预告

> 下一课我们学习 **[内置 MCP 服务器](../builtin-mcps/)**。
>
> 你会学到：
> - 3 个内置 MCP 服务器的功能和使用方法
> - Exa Websearch、Context7、grep.app 的配置和最佳实践
> - 如何使用 MCP 搜索文档和代码

</details>
