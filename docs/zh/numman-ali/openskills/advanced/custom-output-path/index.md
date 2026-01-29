---
title: "自定义输出路径: 灵活管理技能位置 | openskills"
sidebarTitle: "把技能放到任意位置"
subtitle: "自定义输出路径: 灵活管理技能位置 | openskills"
description: "学习 openskills sync -o 命令灵活同步技能到任意位置。支持多工具环境自动创建目录，满足灵活集成需求。"
tags:
  - "进阶功能"
  - "自定义输出"
  - "技能同步"
  - "-o 标志"
prerequisite:
  - "start-sync-to-agents"
order: 2
---

# 自定义输出路径

## 学完你能做什么

- 使用 `-o` 或 `--output` 标志将技能同步到任意位置的 `.md` 文件
- 理解工具如何自动创建不存在的文件和目录
- 为不同工具（Windsurf、Cursor 等）配置不同的 AGENTS.md
- 在多文件环境下管理技能列表
- 跳过默认的 `AGENTS.md`，集成到现有文档系统

::: info 前置知识

本教程假设你已经掌握了 [基础同步技能](../../start/sync-to-agents/) 的使用方法。如果你还没有安装任何技能或同步过 AGENTS.md，请先完成前置课程。

:::

---

## 你现在的困境

你可能已经习惯了 `openskills sync` 默认生成 `AGENTS.md`，但可能会遇到：

- **工具需要特定路径**：某些 AI 工具（如 Windsurf）期望 AGENTS.md 在特定目录（如 `.ruler/`），而不是项目根目录
- **多工具冲突**：同时使用多个编码工具，它们可能期望 AGENTS.md 在不同位置
- **现有文档集成**：已经有了一个技能列表文档，想把 OpenSkills 的技能集成进去，而不是新建文件
- **目录不存在**：想输出到某个嵌套目录（如 `docs/ai-skills.md`），但目录还不存在

这些问题的根源是：**默认输出路径无法满足所有场景**。你需要更灵活的输出控制。

---

## 什么时候用这一招

**自定义输出路径**适合这些场景：

- **多工具环境**：为不同 AI 工具配置独立的 AGENTS.md（如 `.ruler/AGENTS.md` vs `AGENTS.md`）
- **目录结构要求**：工具期望 AGENTS.md 在特定目录（如 Windsurf 的 `.ruler/`）
- **现有文档集成**：将技能列表集成到现有的文档系统，而不是新建 AGENTS.md
- **组织性管理**：按项目或功能分类存放技能列表（如 `docs/ai-skills.md`）
- **CI/CD 环境**：在自动化流程中使用固定路径输出

::: tip 推荐做法

如果你的项目只使用一个 AI 工具，且工具支持项目根目录的 AGENTS.md，使用默认路径即可。只有在需要多文件管理或工具特定路径要求时，才使用自定义输出路径。

:::

---

## 🎒 开始前的准备

在开始之前，请确认：

- [ ] 已完成 [至少一个技能的安装](../../start/first-skill/)
- [ ] 已进入你的项目目录
- [ ] 了解 `openskills sync` 的基本用法

::: warning 前置检查

确认你有已安装的技能：

```bash
npx openskills list
```

如果列表为空，先安装技能：

```bash
npx openskills install anthropics/skills
```

:::

---

## 核心思路：灵活的输出控制

OpenSkills 的同步功能默认输出到 `AGENTS.md`，但你可以使用 `-o` 或 `--output` 标志自定义输出路径。

```
[默认行为]                    [自定义输出]
openskills sync      →      AGENTS.md (项目根目录)
openskills sync -o custom.md →  custom.md (项目根目录)
openskills sync -o .ruler/AGENTS.md →  .ruler/AGENTS.md (嵌套目录)
```

**关键特性**：

1. **任意路径**：可以指定任何 `.md` 文件路径（相对路径或绝对路径）
2. **自动创建文件**：如果文件不存在，工具会自动创建
3. **自动创建目录**：如果文件所在的目录不存在，工具会递归创建
4. **智能标题**：创建文件时，自动添加基于文件名的标题（如 `# AGENTS`）
5. **格式验证**：必须以 `.md` 结尾，否则会报错

**为什么需要这个功能？**

不同的 AI 工具可能有不同的期望路径：

| 工具        | 期望路径           | 默认路径是否可用 |
| ---------- | ------------------ | --------------- |
| Claude Code | `AGENTS.md`        | ✅ 可用          |
| Cursor     | `AGENTS.md`        | ✅ 可用          |
| Windsurf   | `.ruler/AGENTS.md` | ❌ 不可用       |
| Aider      | `.aider/agents.md` | ❌ 不可用       |

使用 `-o` 标志，你可以为每个工具配置正确的路径。

---

## 跟我做

### 第 1 步：基础用法 - 输出到当前目录

首先，尝试将技能同步到当前目录的自定义文件：

```bash
npx openskills sync -o my-skills.md
```

**为什么**

使用 `-o my-skills.md` 告诉工具输出到 `my-skills.md` 而不是默认的 `AGENTS.md`。

**你应该看到**：

如果 `my-skills.md` 不存在，工具会创建它：

```
Created my-skills.md
```

然后启动交互式选择界面：

```
Found 2 skill(s)

? Select skills to sync to my-skills.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...

<Space> 选择  <a> 全选  <i> 反选  <Enter> 确认
```

选择技能后，你会看到：

```
✅ Synced 2 skill(s) to my-skills.md
```

::: tip 检查生成的文件

查看生成的文件：

```bash
cat my-skills.md
```

你会看到：

```markdown
<!-- 文件标题：# my-skills -->

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help...
</usage>

<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

注意第一行是 `# my-skills`，这是工具根据文件名自动生成的标题。

:::

---

### 第 2 步：输出到嵌套目录

现在，尝试将技能同步到不存在的嵌套目录：

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**为什么**

某些工具（如 Windsurf）期望 AGENTS.md 在 `.ruler/` 目录。如果目录不存在，工具会自动创建。

**你应该看到**：

如果 `.ruler/` 目录不存在，工具会创建目录和文件：

```
Created .ruler/AGENTS.md
```

然后启动交互式选择界面（与上一步相同）。

**操作指南**：

```
┌─────────────────────────────────────────────────────────────┐
│  目录自动创建说明                                            │
│                                                             │
│  输入命令：openskills sync -o .ruler/AGENTS.md              │
│                                                             │
│  工具执行：                                                  │
│  1. 检查 .ruler 目录是否存在  →  不存在                      │
│  2. 递归创建 .ruler 目录   →  mkdir .ruler                  │
│  3. 创建 .ruler/AGENTS.md  →  写入 # AGENTS 标题            │
│  4. 同步技能内容           →  写入 XML 格式的技能列表        │
│                                                             │
│  结果：.ruler/AGENTS.md 文件已生成，技能已同步              │
└─────────────────────────────────────────────────────────────┘
```

::: tip 递归创建

工具会递归创建所有不存在的父目录。例如：

- `docs/ai/skills.md` - 如果 `docs` 和 `docs/ai` 都不存在，都会被创建
- `.config/agents.md` - 会创建隐藏目录 `.config`

:::

---

### 第 3 步：多文件管理 - 为不同工具配置

假设你同时使用 Windsurf 和 Cursor，需要为它们配置不同的 AGENTS.md：

```bash
<!-- 为 Windsurf 配置（期望 .ruler/AGENTS.md） -->
npx openskills sync -o .ruler/AGENTS.md

<!-- 为 Cursor 配置（使用项目根目录的 AGENTS.md） -->
npx openskills sync
```

**为什么**

不同工具可能期望 AGENTS.md 在不同位置。使用 `-o` 可以为每个工具配置正确的路径，避免冲突。

**你应该看到**：

两个文件分别生成：

```bash
<!-- 查看 Windsurf 的 AGENTS.md -->
cat .ruler/AGENTS.md

<!-- 查看 Cursor 的 AGENTS.md -->
cat AGENTS.md
```

::: tip 文件独立性

每个 `.md` 文件都是独立的，包含自己的技能列表。你可以在不同文件中选择不同的技能：

- `.ruler/AGENTS.md` - 为 Windsurf 选择的技能
- `AGENTS.md` - 为 Cursor 选择的技能
- `docs/ai-skills.md` - 文档中的技能列表

:::

---

### 第 4 步：非交互式同步到自定义文件

在 CI/CD 环境中，你可能需要跳过交互式选择，直接同步所有技能到自定义文件：

```bash
npx openskills sync -o .ruler/AGENTS.md -y
```

**为什么**

`-y` 标志跳过交互式选择，同步所有已安装技能。结合 `-o` 标志，可以在自动化流程中输出到自定义路径。

**你应该看到**：

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: info CI/CD 使用场景

在 CI/CD 脚本中使用：

```bash
#!/bin/bash
<!-- 安装技能 -->
npx openskills install anthropics/skills -y

<!-- 同步到自定义文件（非交互式） -->
npx openskills sync -o .ruler/AGENTS.md -y
```

:::

---

### 第 5 步：验证输出文件

最后，验证输出文件是否正确生成：

```bash
<!-- 查看文件内容 -->
cat .ruler/AGENTS.md

<!-- 检查文件是否存在 -->
ls -l .ruler/AGENTS.md

<!-- 确认技能数量 -->
grep -c "<name>" .ruler/AGENTS.md
```

**你应该看到**：

1. 文件包含正确的标题（如 `# AGENTS`）
2. 文件包含 `<skills_system>` XML 标签
3. 文件包含 `<available_skills>` 技能列表
4. 每个 `<skill>` 包含 `<name>`, `<description>`, `<location>`

::: tip 检查输出路径

如果你不确定当前工作目录，可以使用：

```bash
<!-- 查看当前目录 -->
pwd

<!-- 查看相对路径会解析到哪里 -->
realpath .ruler/AGENTS.md
```

:::

---

## 检查点 ✅

完成上述步骤后，请确认：

- [ ] 成功使用 `-o` 标志输出到自定义文件
- [ ] 工具自动创建了不存在的文件
- [ ] 工具自动创建了不存在的嵌套目录
- [ ] 生成的文件包含正确的标题（基于文件名）
- [ ] 生成的文件包含 `<skills_system>` XML 标签
- [ ] 生成的文件包含完整的技能列表
- [ ] 可以为不同工具配置不同的输出路径
- [ ] 可以在 CI/CD 环境中使用 `-y` 和 `-o` 组合

如果以上检查项都通过，恭喜你！你已经掌握了自定义输出路径的使用方法，可以灵活地将技能同步到任意位置。

---

## 踩坑提醒

### 问题 1：输出文件不是 markdown

**现象**：

```
Error: Output file must be a markdown file (.md)
```

**原因**：

使用 `-o` 标志时，指定的文件扩展名不是 `.md`。工具强制要求输出到 markdown 文件，以确保 AI 工具能正确解析。

**解决方法**：

确保输出文件以 `.md` 结尾：

```bash
<!-- ❌ 错误 -->
npx openskills sync -o skills.txt

<!-- ✅ 正确 -->
npx openskills sync -o skills.md
```

---

### 问题 2：目录创建权限错误

**现象**：

```
Error: EACCES: permission denied, mkdir '.ruler'
```

**原因**：

尝试创建目录时，当前用户没有父目录的写入权限。

**解决方法**：

1. 检查父目录权限：

```bash
ls -ld .
```

2. 如果权限不足，联系管理员或使用有权限的目录：

```bash
<!-- 使用项目目录 -->
cd ~/projects/my-project
npx openskills sync -o .ruler/AGENTS.md
```

---

### 问题 3：输出路径过长

**现象**：

文件路径很长，导致命令难以阅读和维护：

```bash
npx openskills sync -o docs/ai/skills/v2/internal/agents.md
```

**原因**：

嵌套目录过深，导致路径难以管理。

**解决方法**：

1. 使用相对路径（从项目根目录开始）
2. 简化目录结构
3. 考虑使用符号链接（参见 [符号链接支持](../symlink-support/)）

```bash
<!-- 推荐做法：扁平化目录结构 -->
npx openskills sync -o docs/agents.md
```

---

### 问题 4：忘记使用 -o 标志

**现象**：

期望输出到自定义文件，但工具仍然输出到默认的 `AGENTS.md`。

**原因**：

忘记使用 `-o` 标志，或拼写错误。

**解决方法**：

1. 检查命令是否包含 `-o` 或 `--output`：

```bash
<!-- ❌ 错误：忘记 -o 标志 -->
npx openskills sync

<!-- ✅ 正确：使用 -o 标志 -->
npx openskills sync -o .ruler/AGENTS.md
```

2. 使用 `--output` 完整形式（更清晰）：

```bash
npx openskills sync --output .ruler/AGENTS.md
```

---

### 问题 5：文件名包含特殊字符

**现象**：

文件名包含空格或特殊字符，导致路径解析错误：

```bash
npx openskills sync -o "my skills.md"
```

**原因**：

某些 shell 对特殊字符的处理方式不同，可能导致路径错误。

**解决方法**：

1. 避免使用空格和特殊字符
2. 如果必须使用，用引号包裹：

```bash
<!-- 不推荐 -->
npx openskills sync -o "my skills.md"

<!-- 推荐 -->
npx openskills sync -o my-skills.md
```

---

## 本课小结

通过本课，你学会了：

- **使用 `-o` 或 `--output` 标志** 将技能同步到自定义的 `.md` 文件
- **自动创建文件和目录** 的机制，无需手动准备目录结构
- **为不同工具配置不同的 AGENTS.md**，避免多工具冲突
- **多文件管理技巧**，按工具或功能分类存放技能列表
- **CI/CD 环境使用** `-y` 和 `-o` 组合实现自动化同步

**核心命令**：

| 命令 | 作用 |
| ---- | ---- |
| `npx openskills sync -o custom.md` | 同步到项目根目录的 `custom.md` |
| `npx openskills sync -o .ruler/AGENTS.md` | 同步到 `.ruler/AGENTS.md`（自动创建目录） |
| `npx openskills sync -o path/to/file.md` | 同步到任意路径（自动创建嵌套目录） |
| `npx openskills sync -o custom.md -y` | 非交互式同步到自定义文件 |

**关键要点**：

- 输出文件必须以 `.md` 结尾
- 工具会自动创建不存在的文件和目录
- 创建文件时，自动添加基于文件名的标题
- 每个 `.md` 文件都是独立的，包含自己的技能列表
- 适用于多工具环境、目录结构要求、现有文档集成等场景

---

## 下一课预告

> 下一课我们学习 **[符号链接支持](../symlink-support/)**。
>
> 你会学到：
> - 如何使用符号链接实现基于 git 的技能更新
> - 符号链接的优势和使用场景
> - 如何管理本地开发中的技能
> - 符号链接的检测和处理机制

自定义输出路径让你可以灵活地控制技能列表的位置，而符号链接则提供了一种更高级的技能管理方式，特别适合本地开发场景。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| ---- | --------- | ---- |
| sync 命令入口 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| CLI 选项定义 | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L66) | 66 |
| 输出路径获取 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19) | 19 |
| 输出文件验证 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L22-L26) | 22-26 |
| 创建不存在的文件 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| 递归创建目录 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L31-L32) | 31-32 |
| 自动生成标题 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L34) | 34 |
| 交互式提示使用输出文件名 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L70) | 70 |

**关键函数**：
- `syncAgentsMd(options: SyncOptions)` - 同步技能到指定输出文件
- `options.output` - 自定义输出路径（可选，默认 'AGENTS.md'）

**关键常量**：
- `'AGENTS.md'` - 默认输出文件名
- `'.md'` - 强制要求的文件扩展名

**重要逻辑**：
- 输出文件必须以 `.md` 结尾，否则报错并退出（sync.ts:23-26）
- 如果文件不存在，自动创建父目录（递归）和文件（sync.ts:28-36）
- 创建文件时，写入基于文件名的标题：`# ${outputName.replace('.md', '')}`（sync.ts:34）
- 在交互式提示中显示输出文件名（sync.ts:70）
- 同步成功消息中显示输出文件名（sync.ts:105, 107）

</details>
