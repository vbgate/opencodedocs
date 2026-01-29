---
title: "安装: 插件与手动 | Everything Claude Code"
sidebarTitle: "5 分钟完成安装"
subtitle: "安装: 插件与手动"
description: "学习 Everything Claude Code 的两种安装方式。插件市场一键安装最快，手动安装支持精确配置组件。"
tags:
  - "installation"
  - "plugin"
  - "setup"
prerequisite:
  - "start-quickstart"
order: 20
---

# 安装指南：插件市场 vs 手动安装

## 学完你能做什么

本教程完成后，你将能够：

- 通过插件市场一键安装 Everything Claude Code
- 手动选择需要的组件进行精细化配置
- 正确配置 MCP 服务器和 Hooks
- 验证安装是否成功

## 你现在的困境

想要快速上手 Everything Claude Code，但不知道应该：

- 用插件市场一键安装，还是手动控制每个组件？
- 如何避免配置错误导致功能无法使用？
- 手动安装时需要复制哪些文件到哪些位置？

## 什么时候用这一招

| 场景 | 推荐方式 | 原因 |
|------|----------|------|
| 第一次使用 | 插件市场安装 | 最简单，5 分钟搞定 |
| 想试用特定功能 | 插件市场安装 | 完整体验后再决定 |
| 有特定需求 | 手动安装 | 精确控制每个组件 |
| 已有自定义配置 | 手动安装 | 避免覆盖现有设置 |

## 核心思路

Everything Claude Code 提供两种安装方式：

1. **插件市场安装**（推荐）
   - 适合大多数用户
   - 自动处理所有依赖
   - 一条命令完成安装

2. **手动安装**
   - 适合有特定需求的用户
   - 精确控制安装哪些组件
   - 需要手动配置

无论选择哪种方式，最终都会将配置文件复制到 `~/.claude/` 目录下，让 Claude Code 识别和使用这些组件。

## 🎒 开始前的准备

::: warning 前置条件

开始前请确认：
- [ ] 已安装 Claude Code
- [ ] 有访问 GitHub 的网络连接
- [ ] 了解基本的命令行操作（如果选择手动安装）

:::

---

## 跟我做

### 方式一：插件市场安装（推荐）

这是最简单的方式，适合第一次使用或想要快速体验的用户。

#### 第 1 步：添加插件市场

**为什么**
将 GitHub 仓库注册为 Claude Code 的插件市场，才能安装其中的插件。

在 Claude Code 中输入：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

**你应该看到**：
```
Successfully added marketplace affaan-m/everything-claude-code
```

#### 第 2 步：安装插件

**为什么**
从刚添加的市场中安装 Everything Claude Code 插件。

在 Claude Code 中输入：

```bash
/plugin install everything-claude-code@everything-claude-code
```

**你应该看到**：
```
Successfully installed everything-claude-code@everything-claude-code
```

::: tip 检查点 ✅

验证插件是否已安装：

```bash
/plugin list
```

你应该在输出中看到 `everything-claude-code@everything-claude-code`。

:::

#### 第 3 步（可选）：直接配置 settings.json

**为什么**
如果你想跳过命令行，直接修改配置文件。

打开 `~/.claude/settings.json`，添加以下内容：

```json
{
  "extraKnownMarketplaces": {
    "everything-claude-code": {
      "source": {
        "source": "github",
        "repo": "affaan-m/everything-claude-code"
      }
    }
  },
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**你应该看到**：
- 配置文件更新后，Claude Code 会自动加载插件
- 所有 agents、skills、commands 和 hooks 立即生效

---

### 方式二：手动安装

适合想要精确控制安装哪些组件的用户。

#### 第 1 步：克隆仓库

**为什么**
获取 Everything Claude Code 的所有源文件。

```bash
git clone https://github.com/affaan-m/everything-claude-code.git
cd everything-claude-code
```

**你应该看到**：
```
Cloning into 'everything-claude-code'...
remote: Enumerating objects...
```

#### 第 2 步：复制 agents

**为什么**
将专业化子代理复制到 Claude Code 的 agents 目录。

```bash
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

**你应该看到**：
- `~/.claude/agents/` 目录下新增了 9 个 agent 文件

::: tip 检查点 ✅

验证 agents 是否已复制：

```bash
ls ~/.claude/agents/
```

你应该看到类似：
```
planner.md architect.md tdd-guide.md code-reviewer.md ...
```

:::

#### 第 3 步：复制 rules

**为什么**
将强制性规则复制到 Claude Code 的 rules 目录。

```bash
cp everything-claude-code/rules/*.md ~/.claude/rules/
```

**你应该看到**：
- `~/.claude/rules/` 目录下新增了 8 个规则文件

#### 第 4 步：复制 commands

**为什么**
将斜杠命令复制到 Claude Code 的 commands 目录。

```bash
cp everything-claude-code/commands/*.md ~/.claude/commands/
```

**你应该看到**：
- `~/.claude/commands/` 目录下新增了 14 个命令文件

#### 第 5 步：复制 skills

**为什么**
将工作流定义和领域知识复制到 Claude Code 的 skills 目录。

```bash
cp -r everything-claude-code/skills/* ~/.claude/skills/
```

**你应该看到**：
- `~/.claude/skills/` 目录下新增了 11 个技能目录

#### 第 6 步：配置 hooks

**为什么**
将自动化钩子配置添加到 Claude Code 的 settings.json。

复制 `hooks/hooks.json` 的内容到你的 `~/.claude/settings.json`：

```bash
cat everything-claude-code/hooks/hooks.json
```

将输出内容添加到 `~/.claude/settings.json` 中，格式如下：

```json
{
  "hooks": [
    {
      "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\.(ts|tsx|js|jsx)$\"",
      "hooks": [
        {
          "type": "command",
          "command": "#!/bin/bash\ngrep -n 'console\\.log' \"$file_path\" && echo '[Hook] Remove console.log' >&2"
        }
      ]
    }
  ]
}
```

**你应该看到**：
- 编辑 TypeScript/JavaScript 文件时，如果有 `console.log` 会出现警告

::: warning 重要提醒

确保 `hooks` 数组不会覆盖 `~/.claude/settings.json` 中已有的配置。如果有现有 hooks，需要合并。

:::

#### 第 7 步：配置 MCP 服务器

**为什么**
扩展 Claude Code 的外部服务集成能力。

从 `mcp-configs/mcp-servers.json` 中选择你需要的 MCP 服务器，添加到 `~/.claude.json`：

```bash
cat everything-claude-code/mcp-configs/mcp-servers.json
```

将需要的配置复制到 `~/.claude.json` 中，例如：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "YOUR_GITHUB_TOKEN_HERE"
      }
    }
  }
}
```

::: danger 重要：替换占位符

必须将 `YOUR_*_HERE` 占位符替换为你的实际 API Key，否则 MCP 服务器无法工作。

:::

::: tip MCP 使用建议

**不要启用所有 MCP！** 太多的 MCP 会占用大量上下文窗口。

- 建议配置 20-30 个 MCP 服务器
- 每个项目保持 10 个以下启用
- 保持 80 个以下的工具活跃

使用 `disabledMcpServers` 在项目配置中禁用不需要的 MCP：

```json
{
  "disabledMcpServers": ["firecrawl", "supabase"]
}
```

:::

---

## 检查点 ✅

### 验证插件市场安装

```bash
/plugin list
```

你应该看到 `everything-claude-code@everything-claude-code` 已启用。

### 验证手动安装

```bash
# 检查 agents
ls ~/.claude/agents/ | head -5

# 检查 rules
ls ~/.claude/rules/ | head -5

# 检查 commands
ls ~/.claude/commands/ | head -5

# 检查 skills
ls ~/.claude/skills/ | head -5
```

你应该看到：
- agents 目录下有 `planner.md`、`tdd-guide.md` 等
- rules 目录下有 `security.md`、`coding-style.md` 等
- commands 目录下有 `tdd.md`、`plan.md` 等
- skills 目录下有 `coding-standards`、`backend-patterns` 等

### 验证功能是否可用

在 Claude Code 中输入：

```bash
/tdd
```

你应该看到 TDD Guide agent 开始工作。

---

## 踩坑提醒

### 常见错误 1：插件安装后不生效

**症状**：安装插件后，命令无法使用。

**原因**：插件未正确加载。

**解决方案**：
```bash
# 检查插件列表
/plugin list

# 如果未启用，手动启用
/plugin enable everything-claude-code@everything-claude-code
```

### 常见错误 2：MCP 服务器连接失败

**症状**：MCP 功能无法使用，报错连接失败。

**原因**：API Key 未替换或格式错误。

**解决方案**：
- 检查 `~/.claude.json` 中所有 `YOUR_*_HERE` 占位符是否已替换
- 验证 API Key 是否有效
- 确认 MCP 服务器命令路径正确

### 常见错误 3：hooks 不触发

**症状**：编辑文件时没有看到 hooks 提示。

**原因**：`~/.claude/settings.json` 中 hooks 配置格式错误。

**解决方案**：
- 检查 `hooks` 数组格式是否正确
- 确保 `matcher` 表达式语法正确
- 验证 hook 命令路径是否可执行

### 常见错误 4：文件权限问题（手动安装）

**症状**：复制文件时报错 "Permission denied"。

**原因**：`~/.claude/` 目录权限不足。

**解决方案**：
```bash
# 确保 .claude 目录存在且有权限
mkdir -p ~/.claude/{agents,rules,commands,skills}

# 使用 sudo（仅必要时）
sudo cp -r everything-claude-code/agents/*.md ~/.claude/agents/
```

---

## 本课小结

**两种安装方式对比**：

| 特性 | 插件市场安装 | 手动安装 |
|------|------------|---------|
| 速度 | ⚡ 快 | 🐌 慢 |
| 难度 | 🟢 简单 | 🟡 中等 |
| 灵活性 | 🔒 固定 | 🔓 自定义 |
| 推荐场景 | 初学者、快速体验 | 高级用户、特定需求 |

**核心要点**：
- 插件市场安装是最简单的方式，一条命令搞定
- 手动安装适合需要精确控制组件的用户
- MCP 配置时记得替换占位符，不要启用太多
- 验证安装时检查目录结构和命令可用性

---

## 下一课预告

> 下一课我们学习 **[包管理器配置：自动化检测与自定义](../package-manager-setup/)**。
>
> 你会学到：
> - Everything Claude Code 如何自动检测包管理器
> - 6 种检测优先级的工作机制
> - 如何自定义项目级和用户级包管理器配置
> - 使用 `/setup-pm` 命令快速配置

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| 插件元数据 | [`source/affaan-m/everything-claude-code/.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28    |
| 市场清单   | [`source/affaan-m/everything-claude-code/.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | 1-45    |
| 安装指南   | [`source/affaan-m/everything-claude-code/README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 175-242  |
| Hooks 配置  | [`source/affaan-m/everything-claude-code/hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-146   |
| MCP 配置   | [`source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-95    |

**关键配置**：
- 插件名称：`everything-claude-code`
- 仓库：`affaan-m/everything-claude-code`
- 许可证：MIT
- 支持 9 个 agents、14 个 commands、8 套 rules、11 个 skills

**安装方式**：
1. 插件市场安装：`/plugin marketplace add` + `/plugin install`
2. 手动安装：复制 agents、rules、commands、skills 到 `~/.claude/`

</details>
