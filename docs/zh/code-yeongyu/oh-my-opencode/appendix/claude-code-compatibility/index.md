---
title: "兼容性: Claude Code 集成 | oh-my-opencode"
sidebarTitle: "复用 Claude Code 配置"
subtitle: "Claude Code 兼容性：Commands、Skills、Agents、MCPs 和 Hooks 的完整支持"
description: "学习 oh-my-opencode 的 Claude Code 兼容层。掌握配置加载、优先级规则和禁用开关，平滑迁移到 OpenCode。"
tags:
  - "claude-code"
  - "compatibility"
  - "integration"
prerequisite:
  - "start-installation"
order: 170
---

# Claude Code 兼容性：Commands、Skills、Agents、MCPs 和 Hooks 的完整支持

## 学完你能做什么

- 在 OpenCode 中使用 Claude Code 的现有配置和插件
- 理解不同配置来源的优先级规则
- 通过配置开关控制 Claude Code 兼容功能的加载
- 平滑地从 Claude Code 迁移到 OpenCode

## 你现在的困境

如果你是从 Claude Code 迁移到 OpenCode 的用户，你可能已经在 `~/.claude/` 目录下配置了很多自定义 Commands、Skills 和 MCP 服务器。重复配置这些内容很麻烦，你希望能够在 OpenCode 中直接复用这些配置。

Oh My OpenCode 提供了完整的 Claude Code 兼容层，让你无需任何修改即可使用现有的 Claude Code 配置和插件。

## 核心思路

Oh My OpenCode 通过**自动加载机制**兼容 Claude Code 的配置格式。系统会在启动时自动扫描 Claude Code 的标准配置目录，将这些资源转换为 OpenCode 可识别的格式并注册到系统中。

兼容性涵盖以下功能：

| 功能 | 兼容状态 | 说明 |
|--- | --- | ---|
| **Commands** | ✅ 完全支持 | 从 `~/.claude/commands/` 和 `.claude/commands/` 加载斜杠命令 |
| **Skills** | ✅ 完全支持 | 从 `~/.claude/skills/` 和 `.claude/skills/` 加载专业技能 |
| **Agents** | ⚠️ 预留 | 预留接口，当前仅支持内置 Agents |
| **MCPs** | ✅ 完全支持 | 从 `.mcp.json` 和 `~/.claude/.mcp.json` 加载 MCP 服务器配置 |
| **Hooks** | ✅ 完全支持 | 从 `settings.json` 加载自定义生命周期钩子 |
| **Plugins** | ✅ 完全支持 | 从 `installed_plugins.json` 加载 Marketplace 插件 |

---

## 配置加载优先级

Oh My OpenCode 支持从多个位置加载配置，按照固定的优先级顺序合并。**优先级高的配置会覆盖优先级低的配置**。

### Commands 加载优先级

Commands 按以下顺序加载（从高到低）：

1. `.opencode/command/` (项目级，最高优先级)
2. `~/.config/opencode/command/` (用户级)
3. `.claude/commands/` (项目级 Claude Code 兼容)
4. `~/.claude/commands/` (用户级 Claude Code 兼容)

**源码位置**: `src/features/claude-code-command-loader/loader.ts:136-144`

```typescript
// 从 4 个目录加载 Commands，按优先级合并
return {
  ...projectOpencode,   // 1. .opencode/command/
  ...global,             // 2. ~/.config/opencode/command/
  ...project,            // 3. .claude/commands/
  ...user                // 4. ~/.claude/commands/
}
```

**示例**: 如果在 `.opencode/command/refactor.md` 和 `~/.claude/commands/refactor.md` 都有同名命令，则 `.opencode/` 中的命令会生效。

### Skills 加载优先级

Skills 按以下顺序加载（从高到低）：

1. `.opencode/skills/*/SKILL.md` (项目级，最高优先级)
2. `~/.config/opencode/skills/*/SKILL.md` (用户级)
3. `.claude/skills/*/SKILL.md` (项目级 Claude Code 兼容)
4. `~/.claude/skills/*/SKILL.md` (用户级 Claude Code 兼容)

**源码位置**: `src/features/opencode-skill-loader/loader.ts:206-215`

**示例**: 项目级的 Skills 会覆盖用户级的 Skills，确保每个项目的特定需求优先。

### MCPs 加载优先级

MCP 配置按以下顺序加载（从高到低）：

1. `.claude/.mcp.json` (项目级，最高优先级)
2. `.mcp.json` (项目级)
3. `~/.claude/.mcp.json` (用户级)

**源码位置**: `src/features/claude-code-mcp-loader/loader.ts:18-27`

**特性**: MCP 配置支持环境变量扩展（如 `${OPENAI_API_KEY}`），通过 `env-expander.ts` 自动解析。

**源码位置**: `src/features/claude-code-mcp-loader/env-expander.ts`

### Hooks 加载优先级

Hooks 从 `settings.json` 的 `hooks` 字段加载，支持以下路径（按优先级）：

1. `.claude/settings.local.json` (本地配置，最高优先级)
2. `.claude/settings.json` (项目级)
3. `~/.claude/settings.json` (用户级)

**源码位置**: `src/hooks/claude-code-hooks/config.ts:46-59`

**特性**: 多个配置文件中的 Hooks 会自动合并，而不是相互覆盖。

---

## 配置禁用开关

如果你不想加载 Claude Code 的某些配置，可以通过 `oh-my-opencode.json` 中的 `claude_code` 字段进行细粒度控制。

### 完全禁用兼容性

```jsonc
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/master/assets/oh-my-opencode.schema.json",

  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "agents": false,
    "hooks": false,
    "plugins": false
  }
}
```

### 部分禁用

你也可以只禁用特定功能：

```jsonc
{
  "claude_code": {
    "mcp": false,         // 禁用 .mcp.json 文件（但保留内置 MCPs）
    "commands": false,     // 禁用 ~/.claude/commands/ 和 .claude/commands/
    "skills": false,       // 禁用 ~/.claude/skills/ 和 .claude/skills/
    "agents": false,       // 禁用 ~/.claude/agents/（保留内置 Agents）
    "hooks": false,        // 禁用 settings.json hooks
    "plugins": false       // 禁用 Claude Code Marketplace 插件
  }
}
```

**开关说明**:

| 开关 | 禁用的内容 | 保留的内容 |
|--- | --- | ---|
| `mcp` | `.mcp.json` 文件 | 内置 MCPs（websearch、context7、grep_app） |
| `commands` | `~/.claude/commands/`、`.claude/commands/` | OpenCode 原生 Commands |
| `skills` | `~/.claude/skills/`、`.claude/skills/` | OpenCode 原生 Skills |
| `agents` | `~/.claude/agents/` | 内置 Agents（Sisyphus、Oracle、Librarian 等） |
| `hooks` | `settings.json` hooks | Oh My OpenCode 内置 Hooks |
| `plugins` | Claude Code Marketplace 插件 | 内置插件功能 |

### 禁用特定插件

使用 `plugins_override` 禁用特定的 Claude Code Marketplace 插件：

```jsonc
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // 禁用 claude-mem 插件
    }
  }
}
```

**源码位置**: `src/config/schema.ts:143`

---

## 数据存储兼容性

Oh My OpenCode 兼容 Claude Code 的数据存储格式，确保会话和任务数据的持久化和迁移。

### Todos 存储

- **位置**: `~/.claude/todos/`
- **格式**: Claude Code 兼容的 JSON 格式
- **用途**: 存储任务清单和待办事项

**源码位置**: `src/features/claude-code-session-state/index.ts`

### Transcripts 存储

- **位置**: `~/.claude/transcripts/`
- **格式**: JSONL（每行一个 JSON 对象）
- **用途**: 存储会话历史和消息记录

**源码位置**: `src/features/claude-code-session-state/index.ts`

**优势**: 与 Claude Code 共享相同的数据目录，可以直接迁移会话历史。

---

## Claude Code Hooks 集成

Claude Code 的 `settings.json` 中的 `hooks` 字段定义了在特定事件点执行的自定义脚本。Oh My OpenCode 完全支持这些 Hooks。

### Hook 事件类型

| 事件 | 触发时机 | 可执行的操作 |
|--- | --- | ---|
| **PreToolUse** | 工具执行前 | 阻止工具调用、修改输入参数、注入上下文 |
| **PostToolUse** | 工具执行后 | 添加警告、修改输出、注入消息 |
| **UserPromptSubmit** | 用户提交提示词时 | 阻止提示词、注入消息、转换提示词 |
| **Stop** | 会话进入空闲时 | 注入后续提示词、执行自动化任务 |

**源码位置**: `src/hooks/claude-code-hooks/index.ts`

### Hook 配置示例

以下是一个典型的 Claude Code Hooks 配置：

```jsonc
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Write|Edit",
        "hooks": [
          {
            "type": "command",
            "command": "eslint --fix $FILE"
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "matcher": "*",
        "hooks": [
          {
            "type": "inject",
            "content": "Remember to follow the project's coding standards."
          }
        ]
      }
    ]
  }
}
```

**字段说明**:

- **matcher**: 工具名称匹配模式（支持通配符 `*`）
- **type**: Hook 类型（`command`、`inject` 等）
- **command**: 要执行的 shell 命令（支持变量如 `$FILE`）
- **content**: 要注入的消息内容

### Hook 执行机制

Oh My OpenCode 通过 `claude-code-hooks` Hook 自动执行这些自定义 Hooks。该 Hook 在所有事件点都会检查并加载 Claude Code 的配置。

**源码位置**: `src/hooks/claude-code-hooks/index.ts:36-401`

**执行流程**:

1. 加载 Claude Code 的 `settings.json`
2. 解析 `hooks` 字段并匹配当前事件
3. 按顺序执行匹配的 Hooks
4. 根据返回结果修改代理行为（阻止、注入、警告等）

**示例**: 如果 PreToolUse Hook 返回 `deny`，则工具调用会被阻止，代理会收到错误提示。

---

## 常见使用场景

### 场景 1: 迁移 Claude Code 配置

如果你已经在 Claude Code 中配置了 Commands 和 Skills，可以直接在 OpenCode 中使用：

**步骤**:

1. 确保 `~/.claude/` 目录存在并包含你的配置
2. 启动 OpenCode，Oh My OpenCode 会自动加载这些配置
3. 在聊天中输入 `/` 查看已加载的 Commands
4. 使用 Commands 或调用 Skills

**验证**: 在 Oh My OpenCode 的启动日志中查看加载的配置数量。

### 场景 2: 项目级配置覆盖

你希望为特定项目使用不同的 Skills，而不影响其他项目：

**步骤**:

1. 在项目根目录创建 `.claude/skills/` 目录
2. 添加项目特定的 Skill（如 `./.claude/skills/my-skill/SKILL.md`）
3. 重新启动 OpenCode
4. 项目级 Skill 会自动覆盖用户级 Skill

**优势**: 每个项目可以有独立的配置，互不干扰。

### 场景 3: 禁用 Claude Code 兼容性

你只想使用 OpenCode 原生配置，不想加载 Claude Code 的旧配置：

**步骤**:

1. 编辑 `oh-my-opencode.json`
2. 添加以下配置：

```jsonc
{
  "claude_code": {
    "mcp": false,
    "commands": false,
    "skills": false,
    "hooks": false,
    "plugins": false
  }
}
```

3. 重新启动 OpenCode

**结果**: 系统将忽略所有 Claude Code 配置，仅使用 OpenCode 原生配置。

---

## 踩坑提醒

### ⚠️ 配置冲突

**问题**: 如果在多个位置有同名配置（如同一个 Command 名字出现在 `.opencode/command/` 和 `~/.claude/commands/`），会导致不确定的行为。

**解决**: 理解加载优先级，将优先级最高的配置放在最高优先级的目录中。

### ⚠️ MCP 配置格式差异

**问题**: Claude Code 的 MCP 配置格式与 OpenCode略有不同，直接复制可能不工作。

**解决**: Oh My OpenCode 会自动转换格式，但建议参考官方文档确保配置正确。

**源码位置**: `src/features/claude-code-mcp-loader/transformer.ts`

### ⚠️ Hooks 性能影响

**问题**: 过多的 Hooks 或复杂的 Hook 脚本可能导致性能下降。

**解决**: 限制 Hooks 数量，只保留必要的 Hooks。可以通过 `disabled_hooks` 禁用特定 Hooks。

---

## 本课小结

Oh My OpenCode 提供了完整的 Claude Code 兼容层，让你可以无缝迁移和复用现有配置：

- **配置加载优先级**: 按项目级 > 用户级 > Claude Code 兼容的顺序加载配置
- **兼容性开关**: 通过 `claude_code` 字段精确控制加载哪些功能
- **数据存储兼容**: 共享 `~/.claude/` 目录，支持会话和任务数据迁移
- **Hooks 集成**: 完全支持 Claude Code 的生命周期钩子系统

如果你是从 Claude Code 迁移的用户，这层兼容性可以让你零配置开始使用 OpenCode。

---

## 下一课预告

> 下一课我们学习 **[配置参考](../configuration-reference/)**。
>
> 你会学到：
> - 完整的 `oh-my-opencode.json` 配置字段说明
> - 每个字段的类型、默认值和约束条件
> - 常用配置模式和最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Claude Code Hooks 主入口 | [`src/hooks/claude-code-hooks/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/index.ts) | 1-402 |
| Hooks 配置加载 | [`src/hooks/claude-code-hooks/config.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/config.ts) | 1-104 |
| MCP 配置加载器 | [`src/features/claude-code-mcp-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/loader.ts) | 1-120 |
| Commands 加载器 | [`src/features/claude-code-command-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-command-loader/loader.ts) | 1-145 |
| Skills 加载器 | [`src/features/opencode-skill-loader/loader.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/opencode-skill-loader/loader.ts) | 1-262 |
| Plugins 加载器 | [`src/features/claude-code-plugin-loader/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-plugin-loader/index.ts) | 全文 |
| 数据存储兼容性 | [`src/features/claude-code-session-state/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-session-state/index.ts) | 全文 |
| MCP 配置转换器 | [`src/features/claude-code-mcp-loader/transformer.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/transformer.ts) | 全文 |
| 环境变量扩展 | [`src/features/claude-code-mcp-loader/env-expander.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/claude-code-mcp-loader/env-expander.ts) | 全文 |

**关键函数**：

- `createClaudeCodeHooksHook()`: 创建 Claude Code Hooks 集成 Hook，处理所有事件（PreToolUse、PostToolUse、UserPromptSubmit、Stop）
- `loadClaudeHooksConfig()`: 加载 Claude Code 的 `settings.json` 配置
- `loadMcpConfigs()`: 加载 MCP 服务器配置，支持环境变量扩展
- `loadAllCommands()`: 从 4 个目录加载 Commands，按优先级合并
- `discoverSkills()`: 从 4 个目录加载 Skills，支持 Claude Code 兼容路径
- `getClaudeConfigDir()`: 获取 Claude Code 配置目录路径（平台相关）

**关键常量**：

- 配置加载优先级：`.opencode/` > `~/.config/opencode/` > `.claude/` > `~/.claude/`
- Hook 事件类型：`PreToolUse`、`PostToolUse`、`UserPromptSubmit`、`Stop`、`PreCompact`

</details>
