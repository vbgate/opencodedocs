---
title: "命令详解: OpenSkills CLI 参考 | openskills"
sidebarTitle: "7 个命令全掌握"
subtitle: "命令详解: OpenSkills CLI 参考"
description: "学习 OpenSkills 的 7 个命令及参数使用。掌握 install、list、read、update、sync、manage、remove 的完整参考，提升 CLI 工具效率。"
tags:
  - "CLI"
  - "命令参考"
  - "速查表"
prerequisite:
  - "start-installation"
  - "start-first-skill"
order: 1
---
# 命令详解：OpenSkills 完整命令速查表

## 学完你能做什么

- 熟练使用所有 7 个 OpenSkills 命令
- 理解全局选项的作用和适用场景
- 快速查找命令参数和标志的含义
- 在脚本中使用非交互式命令

## 命令总览

OpenSkills 提供以下 7 个命令：

| 命令 | 用途 | 使用场景 |
|------|------|----------|
| `install` | 安装技能 | 从 GitHub、本地路径或私有仓库安装新技能 |
| `list` | 列出技能 | 查看所有已安装的技能及位置 |
| `read` | 读取技能 | 让 AI 代理加载技能内容（通常由代理自动调用） |
| `update` | 更新技能 | 从源仓库刷新已安装的技能 |
| `sync` | 同步 | 将技能列表写入 AGENTS.md |
| `manage` | 管理 | 交互式删除技能 |
| `remove` | 删除 | 删除指定技能（脚本化方式） |

::: info 小贴士
使用 `npx openskills --help` 可以查看所有命令的简要说明。
:::

## 全局选项

某些命令支持以下全局选项：

| 选项 | 简写 | 作用 | 适用命令 |
|------|------|------|----------|
| `--global` | `-g` | 安装到全局目录 `~/.claude/skills/` | `install` |
| `--universal` | `-u` | 安装到通用目录 `.agent/skills/`（多代理环境） | `install` |
| `--yes` | `-y` | 跳过交互式提示，使用默认行为 | `install`, `sync` |
| `--output <path>` | `-o <path>` | 指定输出文件路径 | `sync` |

## 命令详解

### install - 安装技能

从 GitHub 仓库、本地路径或私有 git 仓库安装技能。

```bash
openskills install <source> [options]
```

**参数**：

| 参数 | 必填 | 说明 |
|------|------|------|
| `<source>` | ✅ | 技能来源（GitHub shorthand、git URL 或本地路径） |

**选项**：

| 选项 | 简写 | 默认值 | 说明 |
|------|------|--------|------|
| `--global` | `-g` | `false` | 安装到全局目录 `~/.claude/skills/` |
| `--universal` | `-u` | `false` | 安装到通用目录 `.agent/skills/` |
| `--yes` | `-y` | `false` | 跳过交互式选择，安装所有找到的技能 |

**source 参数示例**：

```bash
# GitHub shorthand（推荐）
openskills install anthropics/skills

# 指定分支
openskills install owner/repo@branch

# 私有仓库
openskills install git@github.com:owner/repo.git

# 本地路径
openskills install ./path/to/skill

# Git URL
openskills install https://github.com/owner/repo.git
```

**行为说明**：

- 安装时会列出所有找到的技能供选择
- 使用 `--yes` 可跳过选择，安装所有技能
- 安装位置优先级：`--universal` → `--global` → 默认项目目录
- 安装后会在技能目录创建 `.openskills.json` 元数据文件

---

### list - 列出技能

列出所有已安装的技能。

```bash
openskills list
```

**选项**：无

**输出格式**：

```
Available Skills:

skill-name           [description]            (project/global)
```

**行为说明**：

- 按位置排序：项目技能在前，全局技能在后
- 同一位置内按字母顺序排序
- 显示技能名称、描述和位置标签

---

### read - 读取技能

读取一个或多个技能的内容到标准输出。这个命令主要用于 AI 代理按需加载技能。

```bash
openskills read <skill-names...>
```

**参数**：

| 参数 | 必填 | 说明 |
|------|------|------|
| `<skill-names...>` | ✅ | 技能名称列表（支持多个，空格或逗号分隔） |

**选项**：无

**示例**：

```bash
# 读取单个技能
openskills read pdf

# 读取多个技能
openskills read pdf git

# 逗号分隔（也支持）
openskills read "pdf,git,excel"
```

**输出格式**：

```
Skill: pdf
Base Directory: /path/to/.claude/skills/pdf

---SKILL.md 内容---

[SKILL.END]
```

**行为说明**：

- 按 4 个目录优先级查找技能
- 输出技能名称、基础目录路径和完整的 SKILL.md 内容
- 未找到的技能会显示错误信息

---

### update - 更新技能

从记录的源刷新已安装的技能。如果不指定技能名称，则更新所有已安装的技能。

```bash
openskills update [skill-names...]
```

**参数**：

| 参数 | 必填 | 说明 |
|------|------|------|
| `[skill-names...]` | ❌ | 要更新的技能名称列表（默认全部） |

**选项**：无

**示例**：

```bash
# 更新所有技能
openskills update

# 更新指定技能
openskills update pdf git

# 逗号分隔（也支持）
openskills update "pdf,git,excel"
```

**行为说明**：

- 只更新有元数据的技能（即通过 install 安装的技能）
- 跳过无元数据的技能并提示
- 更新成功后更新安装时间戳
- 从 git 仓库更新时使用浅克隆（`--depth 1`）

---

### sync - 同步到 AGENTS.md

将已安装的技能同步到 AGENTS.md（或其他自定义文件），生成 AI 代理可用的技能列表。

```bash
openskills sync [options]
```

**选项**：

| 选项 | 简写 | 默认值 | 说明 |
|------|------|--------|------|
| `--output <path>` | `-o <path>` | `AGENTS.md` | 输出文件路径 |
| `--yes` | `-y` | `false` | 跳过交互式选择，同步所有技能 |

**示例**：

```bash
# 同步到默认文件
openskills sync

# 同步到自定义文件
openskills sync -o .ruler/AGENTS.md

# 跳过交互式选择
openskills sync -y
```

**行为说明**：

- 解析现有文件并预选已启用的技能
- 首次同步默认选中项目技能
- 生成 Claude Code 兼容的 XML 格式
- 支持在现有文件中替换或追加技能部分

---

### manage - 管理技能

交互式删除已安装的技能。提供友好的删除界面。

```bash
openskills manage
```

**选项**：无

**行为说明**：

- 显示所有已安装的技能供选择
- 默认不选中任何技能
- 选择后立即删除，无需二次确认

---

### remove - 删除技能

删除指定的已安装技能（脚本化方式）。如果在脚本中使用，比 `manage` 更方便。

```bash
openskills remove <skill-name>
```

**参数**：

| 参数 | 必填 | 说明 |
|------|------|------|
| `<skill-name>` | ✅ | 要删除的技能名称 |

**选项**：无

**示例**：

```bash
openskills remove pdf

# 也可以使用别名
openskills rm pdf
```

**行为说明**：

- 删除整个技能目录（包括所有文件和子目录）
- 显示删除位置和来源
- 未找到技能时显示错误并退出

## 快捷操作速查表

| 任务 | 命令 |
|------|------|
| 查看所有已安装技能 | `openskills list` |
| 安装官方技能 | `openskills install anthropics/skills` |
| 从本地路径安装 | `openskills install ./my-skill` |
| 全局安装技能 | `openskills install owner/skill --global` |
| 更新所有技能 | `openskills update` |
| 更新特定技能 | `openskills update pdf git` |
| 交互式删除技能 | `openskills manage` |
| 删除指定技能 | `openskills remove pdf` |
| 同步到 AGENTS.md | `openskills sync` |
| 自定义输出路径 | `openskills sync -o custom.md` |

## 踩坑提醒

### 1. 命令找不到

**问题**：执行命令时提示 "command not found"

**原因**：
- Node.js 未安装或版本过低（需要 20.6+）
- 未使用 `npx` 或未全局安装

**解决**：
```bash
# 使用 npx（推荐）
npx openskills list

# 或全局安装
npm install -g openskills
```

### 2. 技能未找到

**问题**：`openskills read skill-name` 提示 "Skill not found"

**原因**：
- 技能未安装
- 技能名称拼写错误
- 技能安装位置不在搜索路径中

**解决**：
```bash
# 检查已安装技能
openskills list

# 查看技能目录
ls -la .claude/skills/
ls -la ~/.claude/skills/
```

### 3. 更新失败

**问题**：`openskills update` 提示 "No metadata found"

**原因**：
- 技能未通过 `install` 命令安装
- 元数据文件 `.openskills.json` 被删除

**解决**：重新安装技能
```bash
openskills install <original-source>
```

## 本课小结

OpenSkills 提供了完整的命令行接口，涵盖技能的安装、列表、读取、更新、同步和管理。掌握这些命令是高效使用 OpenSkills 的基础：

- `install` - 安装新技能（支持 GitHub、本地、私有仓库）
- `list` - 查看已安装技能
- `read` - 读取技能内容（AI 代理使用）
- `update` - 更新已安装技能
- `sync` - 同步到 AGENTS.md
- `manage` - 交互式删除技能
- `remove` - 删除指定技能

记住全局选项的作用：
- `--global` / `--universal` - 控制安装位置
- `--yes` - 跳过交互式提示（适合 CI/CD）
- `--output` - 自定义输出文件路径

## 下一课预告

> 下一课我们学习 **[安装来源详解](../install-sources/)**。
>
> 你会学到：
> - 三种安装方式的详细用法
> - 每种方式的适用场景
> - 私有仓库的配置方法
