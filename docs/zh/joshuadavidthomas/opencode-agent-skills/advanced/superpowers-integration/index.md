---
title: "Superpowers 集成: 配置工作流 | opencode-agent-skills"
subtitle: "Superpowers 集成: 配置工作流 | opencode-agent-skills"
sidebarTitle: "启用 Superpowers"
description: "学习 Superpowers 模式的安装和配置方法。通过环境变量启用工作流指导，掌握工具映射和命名空间优先级规则。"
tags:
  - "进阶配置"
  - "工作流"
  - "Superpowers"
prerequisite:
  - "start-installation"
order: 2
---

# Superpowers 工作流集成

## 学完你能做什么

- 了解 Superpowers 工作流的价值和适用场景
- 正确安装和配置 Superpowers 模式
- 理解工具映射和技能命名空间系统
- 掌握压缩恢复时 Superpowers 的自动注入机制

## 你现在的困境

你可能在考虑这些问题：

- **工作流不够规范**：团队成员的开发习惯不统一，代码质量参差不齐
- **缺少严格流程**：虽然有技能库，但 AI 助手没有明确的流程指导
- **工具调用混乱**：Superpowers 定义的工具与 OpenCode 的原生工具名称不同，导致调用失败
- **迁移成本高**：已经在使用 Superpowers，担心切换到 OpenCode 后需要重新配置

这些问题都会影响开发效率和代码质量。

## 核心思路

::: info 什么是 Superpowers？
Superpowers 是一个完整的软件开发工作流框架，通过组合式技能提供严格的工作流程指导。它定义了规范的开发步骤、工具调用方式和命名空间系统。
:::

**OpenCode Agent Skills 提供了无缝的 Superpowers 集成**，通过环境变量启用后，会自动注入完整的工作流指导，包括：

1. **using-superpowers 技能内容**：Superpowers 核心工作流指令
2. **工具映射**：将 Superpowers 定义的工具名映射到 OpenCode 原生工具
3. **技能命名空间**：明确技能的优先级和引用方式

## 🎒 开始前的准备

在开始之前，请确保：

::: warning 前置检查
- ✅ 已安装 [opencode-agent-skills 插件](../../start/installation/)
- ✅ 熟悉基本的技能发现机制
:::

## 跟我做

### 第 1 步：安装 Superpowers

**为什么**
需要先安装 Superpowers 项目，本插件才能发现 `using-superpowers` 技能。

**操作方式**

根据你的需求，选择以下任一方式安装 Superpowers：

::: code-group

```bash [作为 Claude Code 插件]
// 按照 Superpowers 官方文档安装
// https://github.com/obra/superpowers
// 技能会自动位于 ~/.claude/plugins/...
```

```bash [作为 OpenCode 技能]
// 手动安装为 OpenCode 技能
mkdir -p ~/.config/opencode/skills
git clone https://github.com/obra/superpowers ~/.config/opencode/skills/superpowers
// 技能会位于 .opencode/skills/superpowers/ (项目级) 或 ~/.config/opencode/skills/superpowers/ (用户级)
```

:::

**你应该看到**：
- 安装后，Superpowers 的技能目录包含 `using-superpowers/SKILL.md` 文件

### 第 2 步：启用 Superpowers 模式

**为什么**
通过环境变量告诉插件启用 Superpowers 模式，插件会在会话初始化时自动注入相关内容。

**操作方式**

临时启用（仅当前终端会话）：

```bash
export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true
opencode
```

永久启用（添加到 Shell 配置文件）：

::: code-group

```bash [Bash (~/.bashrc 或 ~/.bash_profile)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.bashrc
source ~/.bashrc
```

```zsh [Zsh (~/.zshrc)]
echo 'export OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true' >> ~/.zshrc
source ~/.zshrc
```

```powershell [PowerShell (~/.config/powershell/Microsoft.PowerShell_profile.ps1)]
[System.Environment]::SetEnvironmentVariable('OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE', 'true', 'User')
```

:::

**你应该看到**：
- 输入 `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` 显示 `true`

### 第 3 步：验证自动注入

**为什么**
确认插件正确识别 Superpowers 技能，并在新会话开始时自动注入内容。

**操作方式**

1. 重启 OpenCode
2. 创建一个新会话
3. 在新会话中输入任何消息（如 "你好"）
4. 查看会话上下文（如果 OpenCode 支持）

**你应该看到**：
- 插件在后台自动注入了以下内容（格式化为 XML）：

```xml
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - do not call use_skill for it again. Use use_skill only for OTHER skills.**

[using-superpowers 技能的实际内容...]

**Tool Mapping for OpenCode:**
- `TodoWrite` → `todowrite`
- `Task` tool with subagents → Use `task` tool with `subagent_type`
- `Skill` tool → `use_skill`
- `Read`, `Write`, `Edit`, `Bash`, `Glob`, `Grep`, `WebFetch` → Use native lowercase OpenCode tools

**Skill namespace priority:**
1. Project: `project:skill-name`
2. Claude project: `claude-project:skill-name`
3. User: `skill-name`
4. Claude user: `claude-user:skill-name`
5. Marketplace: `claude-plugins:skill-name`

The first discovered match wins.
</EXTREMELY_IMPORTANT>
```

## 检查点 ✅

完成上述步骤后，验证以下内容：

| 检查项 | 预期结果 |
|--- | ---|
| 环境变量设置正确 | `echo $OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE` 输出 `true` |
| Superpowers 技能可发现 | 调用 `get_available_skills()` 能看到 `using-superpowers` |
| 新会话自动注入 | 创建新会话后，AI 知道自己有 superpowers |

## 踩坑提醒

### ❌ 错误 1：技能未被发现

**现象**：启用了环境变量，但插件没有注入 Superpowers 内容。

**原因**：Superpowers 安装位置不在技能发现路径中。

**解决方案**：
- 确认 Superpowers 安装在以下任一位置：
  - `.claude/plugins/...` （Claude Code 插件缓存）
  - `.opencode/skills/...` （OpenCode 技能目录）
  - `~/.config/opencode/skills/...` （OpenCode 用户技能）
  - `~/.claude/skills/...` （Claude 用户技能）
- 运行 `get_available_skills()` 验证 `using-superpowers` 是否在列表中

### ❌ 错误 2：工具调用失败

**现象**：AI 尝试调用 `TodoWrite` 或 `Skill` 工具，提示工具不存在。

**原因**：AI 没有应用工具映射，仍在使用 Superpowers 定义的名称。

**解决方案**：
- 插件会自动注入工具映射，确保 `<EXTREMELY_IMPORTANT>` 标签被正确注入
- 如果问题持续，检查会话是否在启用环境变量后创建

### ❌ 错误 3：压缩后 Superpowers 消失

**现象**：长时间会话后，AI 不再遵循 Superpowers 工作流。

**原因**：上下文压缩导致之前的注入内容被清理。

**解决方案**：
- 插件会在 `session.compacted` 事件后自动重新注入 Superpowers 内容
- 如果问题持续，检查插件是否正常监听事件

## 工具映射详解

插件会自动注入以下工具映射，帮助 AI 正确调用 OpenCode 工具：

| Superpowers 工具 | OpenCode 工具 | 说明 |
|--- | --- | ---|
| `TodoWrite` | `todowrite` | Todo 写入工具 |
| `Task` (带 subagents) | `task` + `subagent_type` | 子代理调用 |
| `Skill` | `use_skill` | 加载技能 |
| `Read` / `Write` / `Edit` | 原生小写工具 | 文件操作 |
| `Bash` / `Glob` / `Grep` / `WebFetch` | 原生小写工具 | 系统操作 |

::: tip 为什么需要工具映射？
Superpowers 原生设计基于 Claude Code，工具名称与 OpenCode 不一致。通过自动映射，AI 可以无缝使用 OpenCode 的原生工具，无需手动转换。
:::

## 技能命名空间优先级

当多个来源存在同名技能时，插件按以下优先级选择：

```
1. project:skill-name         (项目级 OpenCode 技能)
2. claude-project:skill-name  (项目级 Claude 技能)
3. skill-name                (用户级 OpenCode 技能)
4. claude-user:skill-name    (用户级 Claude 技能)
5. claude-plugins:skill-name (插件市场技能)
```

::: info 命名空间引用
你可以显式指定命名空间：`use_skill("project:my-skill")`  
或者让插件自动匹配：`use_skill("my-skill")`
:::

**第一个发现的匹配生效**，后续同名技能被忽略。这允许项目级技能覆盖用户级技能。

## 压缩恢复机制

长时间会话中，OpenCode 会执行上下文压缩以节省 token。插件通过以下机制确保 Superpowers 持续可用：

1. **监听事件**：插件监听 `session.compacted` 事件
2. **重新注入**：压缩完成后，自动重新注入 Superpowers 内容
3. **无感切换**：AI 的工作流指导始终存在，不会因压缩而中断

## 本课小结

Superpowers 集成提供了严格的工作流指导，核心要点：

- **安装 Superpowers**：选择 Claude Code 插件或 OpenCode 技能任一方式
- **启用环境变量**：设置 `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`
- **自动注入**：插件在会话初始化和压缩后自动注入内容
- **工具映射**：自动将 Superpowers 工具名映射到 OpenCode 原生工具
- **命名空间优先级**：项目级技能优先于用户级技能

## 下一课预告

> 下一课我们学习 **[命名空间与技能优先级](../namespaces-and-priority/)**。
>
> 你会学到：
> - 理解技能的命名空间系统和发现优先级规则
> - 掌握如何使用命名空间明确指定技能来源
> - 了解同名技能的覆盖和冲突处理机制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Superpowers 集成模块 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L1-L59) | 1-59 |
| 工具映射定义 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L12-L16) | 12-16 |
| 技能命名空间定义 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L18-L25) | 18-25 |
| Superpowers 内容注入函数 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L31-L58) | 31-58 |
| 环境变量检查 | [`src/superpowers.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/superpowers.ts#L37) | 37 |
| 会话初始化注入调用 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L101) | 101 |
| 压缩后重新注入 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L148) | 148 |

**关键常量**：
- `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE`：环境变量，设置为 `'true'` 启用 Superpowers 模式

**关键函数**：
- `maybeInjectSuperpowersBootstrap()`：检查环境变量和技能存在性，注入 Superpowers 内容
- `discoverAllSkills()`：发现所有可用技能（用于查找 `using-superpowers`）
- `injectSyntheticContent()`：将内容以 synthetic 消息形式注入会话

</details>
