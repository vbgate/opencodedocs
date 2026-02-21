---
title: "Claude Code 平台完整教程：安装 Superpowers 插件与钩子系统详解 | Superpowers 教程"
sidebarTitle: "在 Claude Code 中使用"
subtitle: "Claude Code 平台集成指南"
description: "学习如何在 Claude Code 中安装和配置 Superpowers 插件，理解 SessionStart 钩子的自动注入机制、斜杠命令的使用方法，以及技能系统的工作原理。"
tags:
  - "Claude Code"
  - "插件安装"
  - "技能系统"
prerequisite:
  - "start-quick-start"
order: 60
---

# Claude Code 平台集成指南

## 学完你能做什么

- 在 Claude Code 中安装 Superpowers 插件
- 理解钩子系统如何自动注入技能上下文
- 使用斜杠命令快速调用核心技能
- 验证安装是否成功

## 你现在的困境

Claude Code 虽然强大，但缺乏系统化的工作流指导：
- 你想让 AI 代理遵循 TDD，但总忍不住先写代码
- 遇到 bug 时调试随意，找不到根本原因
- 需要在多个会话间传递上下文，但不知道怎么做

Superpowers 通过插件形式，在 Claude Code 中注入完整的工作流和最佳实践。

## 什么时候用这一招

- **首次使用 Superpowers**：必须先安装插件
- **验证技能加载**：检查钩子是否正常工作
- **快速启动工作流**：使用斜杠命令直接调用技能

## 核心思路

Superpowers 在 Claude Code 中通过三层机制工作：

| 层级 | 组件 | 作用 |
| --- | --- | --- |
| **钩子层** | SessionStart Hook | 会话启动时自动注入技能上下文 |
| **命令层** | Slash Commands | 提供快捷方式调用核心技能 |
| **技能层** | Skills Directory | 存储所有技能定义和流程 |

**钩子工作原理**：

```mermaid
graph LR
    A[会话启动] --> B[SessionStart Hook 触发]
    B --> C[执行 session-start.sh 脚本]
    C --> D[读取 using-superpowers 技能]
    D --> E[注入到 Claude 上下文]
    E --> F[Claude 自动获得技能系统知识]
```

**关键优势**：
- **零手动操作**：钩子自动注入，不需要你手动调用技能
- **始终启用**：每次会话启动都会注入，确保 AI 始终了解最佳实践
- **可扩展**：插件机制支持添加更多命令和钩子

## 跟我做：安装和验证

### 第 1 步：注册插件市场

**为什么**
Claude Code 使用插件市场机制分发插件，需要先注册 superpowers 的市场源。

**操作**

在 Claude Code 中运行：

```bash
/plugin marketplace add obra/superpowers-marketplace
```

**你应该看到**：
```
✓ Marketplace added successfully
```

### 第 2 步：安装 Superpowers 插件

**为什么**
从市场安装插件后，才能使用 Superpowers 的所有技能和命令。

**操作**

```bash
/plugin install superpowers@superpowers-marketplace
```

**你应该看到**：
```
✓ Plugin 'superpowers' installed successfully
```

### 第 3 步：验证安装

**为什么**
确认命令和钩子都正确加载。

**操作**

运行帮助命令：

```bash
/help
```

**你应该看到**以下 Superpowers 命令：

```bash
# Should see:
# /superpowers:brainstorm - Interactive design refinement
# /superpowers:write-plan - Create implementation plan
# /superpowers:execute-plan - Execute plan in batches
```

### 第 4 步：验证钩子工作

**为什么**
SessionStart 钩子会在新会话启动时自动执行，注入技能上下文。

**操作**

```bash
# 启动新会话或使用 /clear
/clear
```

**你应该看到**：
在 Claude 的第一个回复中，会看到类似这样的提示：

```
<EXTREMELY_IMPORTANT>
You have superpowers.

**Below is the full content of your 'superpowers:using-superpowers' skill...**
</EXTREMELY_IMPORTANT>
```

这说明钩子成功注入了技能上下文。

## 检查点 ✅

| 检查项 | 预期结果 | 命令 |
| --- | --- | --- |
| 市场已注册 | `/help` 中能看到 superpowers-marketplace | `/plugin marketplace list` |
| 插件已安装 | `/help` 中能看到 superpowers 插件 | `/plugin list` |
| 命令可用 | `/help` 中能看到 3 个 Superpowers 命令 | `/help` |
| 钩子生效 | 新会话中能看到技能上下文注入 | `/clear` 后观察 |

## 踩坑提醒

### 常见错误 1：命令不出现

**症状**：运行 `/help` 后看不到 Superpowers 命令

**原因**：插件未正确安装或市场未注册

**解决**：
```bash
# 检查市场是否注册
/plugin marketplace list

# 如果没有 obra/superpowers-marketplace，重新注册
/plugin marketplace add obra/superpowers-marketplace

# 重新安装插件
/plugin uninstall superpowers
/plugin install superpowers@superpowers-marketplace
```

### 常见错误 2：钩子不触发

**症状**：新会话中没有看到技能上下文注入

**原因**：钩子脚本权限问题或路径错误

**解决**：
```bash
# 检查插件目录
ls -la ~/.claude/plugins/superpowers/

# 检查钩子脚本权限
chmod +x ~/.claude/plugins/superpowers/hooks/session-start.sh

# 查看钩子配置
cat ~/.claude/plugins/superpowers/hooks/hooks.json
```

### 常见错误 3：旧版技能目录冲突

**症状**：看到警告消息提示旧版技能目录

**原因**：旧版本的 Superpowers 使用 `~/.config/superpowers/skills` 存储技能

**解决**：
```bash
# 查看警告消息中的具体路径
# 备份旧技能（如果有自定义技能）
cp -r ~/.config/superpowers/skills ~/backup-custom-skills

# 删除旧目录
rm -rf ~/.config/superpowers/skills
```

## 深入了解：核心机制

### 钩子系统

**SessionStart 钩子**在以下情况触发：
- 启动新会话
- 恢复会话（`/resume`）
- 清除会话（`/clear`）
- 压缩会话（`/compact`）

**钩子配置**（`hooks/hooks.json`）：

```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "startup|resume|clear|compact",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PLUGIN_ROOT}/hooks/session-start.sh"
          }
        ]
      }
    ]
  }
}
```

`matcher` 字段使用正则表达式匹配会话事件。

**钩子脚本**（`hooks/session-start.sh`）功能：
1. 读取 `using-superpowers` 技能内容
2. 检测并警告旧版技能目录
3. 将内容包装为 JSON 格式输出
4. 注入到 Claude 的上下文中

### 命令系统

Superpowers 提供三个核心命令：

| 命令 | 描述 | 调用的技能 |
| --- | --- | --- |
| `/superpowers:brainstorm` | 交互式设计完善 | `brainstorming` |
| `/superpowers:write-plan` | 创建详细实施计划 | `writing-plans` |
| `/superpowers:execute-plan` | 批量执行计划 | `executing-plans` |

**命令定义**示例（`commands/brainstorm.md`）：

```yaml
---
description: "You MUST use this before any creative work..."
disable-model-invocation: true
---

Invoke the superpowers:brainstorming skill and follow it exactly as presented to you
```

`disable-model-invocation: true` 表示命令不会调用模型，而是直接调用技能。

### 技能发现

Claude Code 使用内置的 **Skill tool** 加载技能文件：

1. 插件安装后，技能存储在插件目录的 `skills/` 子目录（即 `~/.claude/plugins/superpowers/skills/`）
2. 钩子脚本从 `${PLUGIN_ROOT}/skills/` 读取 `using-superpowers` 技能并注入到上下文
3. 其他技能通过 `Skill` 工具按需加载，Claude 会自动查找并加载 `SKILL.md` 文件

**技能文件结构**：

```markdown
---
name: brainstorming
description: "Interactive design refinement workflow..."
version: "4.1.1"
---

# Brainstorming

[技能内容和流程图...]
```

::: tip 技能目录说明
`~/.claude/skills/` 是 Claude Code 的**个人技能目录**，用于存储用户自定义技能。Superpowers 插件的技能存储在插件内部，不会复制到此目录。
:::

## 本课小结

Claude Code 平台通过插件机制提供了 Superpowers 的完整集成：

- **安装简单**：通过插件市场一键安装
- **自动化高**：钩子系统自动注入技能上下文
- **命令便捷**：斜杠命令快速调用核心技能
- **可扩展强**：插件架构支持自定义扩展

安装完成后，Claude Code 会自动在每次会话启动时注入 Superpowers 的知识，确保 AI 始终遵循最佳实践。

## 下一课预告

> 下一课我们学习 **[OpenCode 平台集成](../opencode/)**。
>
> 你会学到：
> - OpenCode 平台的插件安装方法
> - 技能优先级系统（项目 > 个人 > Superpowers）
> - 系统提示转换机制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-01

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 插件配置 | [`.claude-plugin/plugin.json`](https://github.com/obra/superpowers/blob/main/.claude-plugin/plugin.json) | 全文 |
| 钩子配置 | [`hooks/hooks.json`](https://github.com/obra/superpowers/blob/main/hooks/hooks.json) | 全文 |
| 会话启动钩子 | [`hooks/session-start.sh`](https://github.com/obra/superpowers/blob/main/hooks/session-start.sh) | 全文 |
| brainstorm 命令 | [`commands/brainstorm.md`](https://github.com/obra/superpowers/blob/main/commands/brainstorm.md) | 全文 |
| write-plan 命令 | [`commands/write-plan.md`](https://github.com/obra/superpowers/blob/main/commands/write-plan.md) | 全文 |
| execute-plan 命令 | [`commands/execute-plan.md`](https://github.com/obra/superpowers/blob/main/commands/execute-plan.md) | 全文 |
| 入口技能 | [`skills/using-superpowers/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md) | 全文 |
| 安装文档 | [`README.md`](https://github.com/obra/superpowers/blob/main/README.md) | 31-58 |

**关键配置**：

- **插件名称**：`superpowers`
- **版本**：`4.1.1`
- **钩子事件**：`SessionStart`
- **钩子匹配器**：`startup|resume|clear|compact`
- **技能注入路径**：`${CLAUDE_PLUGIN_ROOT}/skills/using-superpowers/SKILL.md`

**关键命令**：

- **注册市场**：`/plugin marketplace add obra/superpowers-marketplace`
- **安装插件**：`/plugin install superpowers@superpowers-marketplace`
- **验证命令**：`/help`

</details>
