---
title: "CLI API: 命令参考 | OpenSkills"
subtitle: "CLI API: 命令参考 | OpenSkills"
sidebarTitle: "命令全搞定"
description: "学习 OpenSkills 的完整命令行 API。查阅所有命令的参数、选项和使用示例，快速掌握命令用法。"
tags:
  - "API"
  - "CLI"
  - "命令参考"
  - "选项说明"
prerequisite: []
order: 1
---

# OpenSkills CLI API 参考

## 学完你能做什么

- 了解所有 OpenSkills 命令的完整用法
- 掌握每个命令的参数和选项
- 知道如何组合使用命令完成任务

## 这是什么

OpenSkills CLI API 参考提供了所有命令的完整文档，包括参数、选项和使用示例。这是当你需要深入了解某个命令时查阅的参考手册。

---

## 概览

OpenSkills CLI 提供以下命令：

```bash
openskills install <source>   # 安装技能
openskills list                # 列出已安装技能
openskills read <name>         # 读取技能内容
openskills sync                # 同步到 AGENTS.md
openskills update [name...]    # 更新技能
openskills manage              # 交互式管理技能
openskills remove <name>       # 删除技能
```

---

## install 命令

安装技能从 GitHub、本地路径或私有 git 仓库。

### 语法

```bash
openskills install <source> [options]
```

### 参数

| 参数       | 类型   | 必填 | 说明                      |
|--- | --- | --- | ---|
| `<source>` | string | Y    | 技能来源（见下方来源格式） |

### 选项

| 选项              | 简写 | 类型 | 默认值 | 说明                                            |
|--- | --- | --- | --- | ---|
| `--global`        | `-g`  | flag | false  | 全局安装到 `~/.claude/skills/`                  |
| `--universal`     | `-u`  | flag | false  | 安装到 `.agent/skills/`（多代理环境）          |
| `--yes`           | `-y`  | flag | false  | 跳过交互式选择，安装所有找到的技能            |

### 来源格式

| 格式                          | 示例                                    | 说明                     |
|--- | --- | ---|
| GitHub shorthand               | `anthropics/skills`                    | 从 GitHub 公开仓库安装   |
| Git URL                       | `https://github.com/owner/repo.git`    | 完整 Git URL             |
| SSH Git URL                   | `git@github.com:owner/repo.git`        | SSH 私有仓库             |
| 本地路径                      | `./my-skill` 或 `~/dev/skills`         | 从本地目录安装           |

### 示例

```bash
# 从 GitHub 安装（交互式选择）
openskills install anthropics/skills

# 从 GitHub 安装（非交互式）
openskills install anthropics/skills -y

# 全局安装
openskills install anthropics/skills --global

# 多代理环境安装
openskills install anthropics/skills --universal

# 从本地路径安装
openskills install ./my-custom-skill

# 从私有仓库安装
openskills install git@github.com:your-org/private-skills.git
```

### 输出

安装成功后会显示：
- 安装的技能列表
- 安装位置（project/global）
- 提示执行 `openskills sync`

---

## list 命令

列出所有已安装的技能。

### 语法

```bash
openskills list
```

### 参数

无。

### 选项

无。

### 示例

```bash
openskills list
```

### 输出

```
已安装的技能：

┌────────────────────┬────────────────────────────────────┬──────────┐
│ 技能名称            │ 描述                                 │ 位置     │
├────────────────────┼────────────────────────────────────┼──────────┤
│ pdf                │ PDF manipulation toolkit             │ project  │
│ git-workflow       │ Git workflow automation              │ global   │
│ skill-creator      │ Guide for creating effective skills  │ project  │
└────────────────────┴────────────────────────────────────┴──────────┘

统计：3 个技能（2 个项目级，1 个全局）
```

### 技能位置说明

- **project**: 安装在 `.claude/skills/` 或 `.agent/skills/`
- **global**: 安装在 `~/.claude/skills/` 或 `~/.agent/skills/`

---

## read 命令

读取技能内容到标准输出（供 AI 代理使用）。

### 语法

```bash
openskills read <skill-names...>
```

### 参数

| 参数             | 类型   | 必填 | 说明                          |
|--- | --- | --- | ---|
| `<skill-names...>` | string | Y    | 技能名称（支持逗号分隔的列表） |

### 选项

无。

### 示例

```bash
# 读取单个技能
openskills read pdf

# 读取多个技能（逗号分隔）
openskills read pdf,git-workflow

# 读取多个技能（空格分隔）
openskills read pdf git-workflow
```

### 输出

```
=== SKILL: pdf ===
Base Directory: /path/to/.claude/skills/pdf
---
# PDF Skill Instructions

When user asks you to work with PDFs, follow these steps:
1. Install dependencies: `pip install pypdf2`
2. Extract text using scripts/extract_text.py
3. Use references/api-docs.md for details

=== END SKILL ===
```

### 用途

此命令主要用于 AI 代理加载技能内容。用户也可以使用它查看技能的详细说明。

---

## sync 命令

将已安装技能同步到 AGENTS.md（或其他文件）。

### 语法

```bash
openskills sync [options]
```

### 参数

无。

### 选项

| 选项                | 简写 | 类型   | 默认值     | 说明                         |
|--- | --- | --- | --- | ---|
| `--output <path>`   | `-o`  | string | `AGENTS.md` | 输出文件路径                |
| `--yes`             | `-y`  | flag   | false      | 跳过交互式选择，同步所有技能 |

### 示例

```bash
# 同步到默认 AGENTS.md（交互式）
openskills sync

# 同步到自定义路径
openskills sync -o .ruler/AGENTS.md

# 非交互式同步（CI/CD）
openskills sync -y

# 非交互式同步到自定义路径
openskills sync -y -o .ruler/AGENTS.md
```

### 输出

同步完成后会在指定文件中生成以下内容：

```xml
<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively.

How to use skills:
- Invoke: `npx openskills read <skill-name>` (run in your shell)
- The skill content will load with detailed instructions
- Base directory provided in output for resolving bundled resources

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

---

## update 命令

从源刷新已安装技能。

### 语法

```bash
openskills update [skill-names...]
```

### 参数

| 参数             | 类型   | 必填 | 说明                          |
|--- | --- | --- | ---|
| `[skill-names...]` | string | N    | 技能名称（逗号分隔），默认全部 |

### 选项

无。

### 示例

```bash
# 更新所有已安装技能
openskills update

# 更新指定技能
openskills update pdf,git-workflow

# 更新单个技能
openskills update pdf
```

### 输出

```
Updating skills...

✓ Updated pdf (project)
✓ Updated git-workflow (project)
⚠ Skipped old-skill (no metadata)

Summary:
- Updated: 2
- Skipped: 1
```

### 更新规则

- 仅更新有元数据记录的技能
- 本地路径技能：直接从源路径复制
- Git 仓库技能：重新克隆并复制
- 无元数据的技能：跳过并提示重新安装

---

## manage 命令

交互式管理（删除）已安装技能。

### 语法

```bash
openskills manage
```

### 参数

无。

### 选项

无。

### 示例

```bash
openskills manage
```

### 交互式界面

```
选择要删除的技能：

[ ] pdf - PDF manipulation toolkit
[ ] git-workflow - Git workflow automation
[*] skill-creator - Guide for creating effective skills

操作：[↑/↓] 选择 [空格] 切换 [Enter] 确认 [Esc] 取消
```

### 输出

```
已删除 1 个技能：
- skill-creator (project)
```

---

## remove 命令

删除指定的已安装技能（脚本化方式）。

### 语法

```bash
openskills remove <skill-name>
```

### 别名

`rm`

### 参数

| 参数           | 类型   | 必填 | 说明     |
|--- | --- | --- | ---|
| `<skill-name>` | string | Y    | 技能名称 |

### 选项

无。

### 示例

```bash
# 删除技能
openskills remove pdf

# 使用别名
openskills rm pdf
```

### 输出

```
已删除技能：pdf (project)
位置：/path/to/.claude/skills/pdf
来源：anthropics/skills
```

---

## 全局选项

以下选项适用于所有命令：

| 选项            | 简写 | 类型 | 默认值 | 说明            |
|--- | --- | --- | --- | ---|
| `--version`     | `-V`  | flag | -      | 显示版本号      |
| `--help`        | `-h`  | flag | -      | 显示帮助信息    |

### 示例

```bash
# 显示版本
openskills --version

# 显示全局帮助
openskills --help

# 显示特定命令帮助
openskills install --help
```

---

## 技能查找优先级

当存在多个安装位置时，技能按以下优先级查找（从高到低）：

1. `./.agent/skills/` - 项目级 universal
2. `~/.agent/skills/` - 全局级 universal
3. `./.claude/skills/` - 项目级
4. `~/.claude/skills/` - 全局级

**重要**：只会返回找到的第一个匹配技能（优先级最高的）。

---

## 退出码

| 退出码 | 说明                        |
|--- | ---|
| 0      | 成功                        |
| 1      | 错误（参数错误、命令失败等） |

---

## 环境变量

当前版本不支持环境变量配置。

---

## 配置文件

OpenSkills 使用以下配置文件：

- **技能元数据**：`.claude/skills/<skill-name>/.openskills.json`
  - 记录安装来源、时间戳等
  - 用于 `update` 命令刷新技能

### 元数据示例

```json
{
  "name": "pdf",
  "source": "anthropics/skills",
  "sourceType": "github",
  "repoUrl": "https://github.com/anthropics/skills.git",
  "subpath": "pdf",
  "installedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## 下一课预告

> 下一课我们学习 **[AGENTS.md 格式规范](../agents-md-format/)**。
>
> 你会学到：
> - AGENTS.md 的 XML 标签结构和各个标签的含义
> - 技能列表的字段定义和使用限制
> - OpenSkills 如何生成和更新 AGENTS.md
> - 标记方式（XML 标记和 HTML 注释标记）

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 命令         | 文件路径                                                                           | 行号   |
|--- | --- | ---|
| CLI 入口     | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)         | 13-80  |
| install 命令 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 1-562  |
| list 命令    | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts)    | 1-50   |
| read 命令    | [`src/commands/read.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/read.ts)    | 1-50   |
| sync 命令    | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)    | 1-101  |
| update 命令  | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts) | 1-173  |
| manage 命令  | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 1-50   |
| remove 命令  | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 1-30   |
| 类型定义     | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts)        | 1-25   |

**关键常量**：
- 无全局常量

**关键类型**：
- `Skill`: 技能信息接口（name, description, location, path）
- `SkillLocation`: 技能位置接口（path, baseDir, source）
- `InstallOptions`: 安装选项接口（global, universal, yes）

**关键函数**：
- `program.command()`: 定义命令（commander.js）
- `program.option()`: 定义选项（commander.js）
- `program.action()`: 定义命令处理函数（commander.js）

</details>
