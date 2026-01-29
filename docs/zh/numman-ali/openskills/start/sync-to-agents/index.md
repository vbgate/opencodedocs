---
title: "技能同步: 生成 AGENTS.md | openskills"
sidebarTitle: "让 AI 知道技能"
subtitle: "技能同步: 生成 AGENTS.md"
description: "学习使用 openskills sync 命令生成 AGENTS.md 文件，让 AI 代理（Claude Code、Cursor）了解已安装的技能。掌握技能选择和同步技巧，优化 AI 上下文使用。"
tags:
  - "入门教程"
  - "技能同步"
  - "AGENTS.md"
prerequisite:
  - "start-first-skill"
order: 5
---

# 同步技能到 AGENTS.md

## 学完你能做什么

- 使用 `openskills sync` 生成 AGENTS.md 文件
- 理解 AI 代理如何通过 AGENTS.md 了解可用技能
- 选择要同步的技能，控制 AI 上下文大小
- 使用自定义输出路径集成到现有文档
- 理解 AGENTS.md 的 XML 格式和使用方法

::: info 前置知识

本教程假设你已经完成了 [第一个技能的安装](../first-skill/)。如果你还没有安装任何技能，请先完成安装步骤。

:::

---

## 你现在的困境

你可能已经安装了一些技能，但是：

- **AI 代理不知道有技能可用**：技能安装了，但 AI 代理（如 Claude Code）根本不知道它们的存在
- **不知道怎么让 AI 知道技能**：听说过 `AGENTS.md`，但不知道它是什么，怎么生成
- **担心技能太多占用上下文**：安装了很多技能，想选择性同步，不想一次性全部告诉 AI

这些问题的根源是：**技能安装和技能可用是两回事**。安装只是把文件放下来，要让 AI 知道，还需要同步到 AGENTS.md。

---

## 什么时候用这一招

**同步技能到 AGENTS.md**适合这些场景：

- 刚安装完技能，需要让 AI 代理知道它们存在
- 添加新技能后，更新 AI 的可用技能列表
- 删除技能后，从 AGENTS.md 中移除
- 想选择性同步技能，控制 AI 的上下文大小
- 多代理环境，需要统一技能列表

::: tip 推荐做法

每次安装、更新或删除技能后，都执行一次 `openskills sync`，保持 AGENTS.md 与实际技能一致。

:::

---

## 🎒 开始前的准备

在开始之前，请确认：

- [ ] 已完成 [至少一个技能的安装](../first-skill/)
- [ ] 已进入你的项目目录
- [ ] 了解技能的安装位置（project 或 global）

::: warning 前置检查

如果还没有安装任何技能，先运行：

```bash
npx openskills install anthropics/skills
```

:::

---

## 核心思路：技能安装 ≠ AI 可用

OpenSkills 的技能管理分为两个阶段：

```
[安装阶段]            [同步阶段]
技能 → .claude/skills/  →  AGENTS.md
   ↓                        ↓
文件存在              AI 代理读取
   ↓                        ↓
本地可用            AI 知道并可以调用
```

**关键点**：

1. **安装阶段**：使用 `openskills install`，技能被复制到 `.claude/skills/` 目录
2. **同步阶段**：使用 `openskills sync`，技能信息写入 `AGENTS.md`
3. **AI 读取**：AI 代理读取 `AGENTS.md`，知道有哪些技能可用
4. **按需加载**：AI 根据任务需要，使用 `openskills read <skill>` 加载具体技能

**为什么需要 AGENTS.md？**

AI 代理（如 Claude Code、Cursor）不会主动扫描文件系统。它们需要一个明确的"技能清单"，告诉它们有哪些工具可以使用。这个清单就是 `AGENTS.md`。

---

## 跟我做

### 第 1 步：进入项目目录

首先，进入你安装了技能的项目目录：

```bash
cd /path/to/your/project
```

**为什么**

`openskills sync` 默认在当前目录查找已安装的技能，并在当前目录生成或更新 `AGENTS.md`。

**你应该看到**：

你的项目目录应该包含 `.claude/skills/` 目录（如果你安装了技能）：

```bash
ls -la
# 输出示例：
drwxr-xr-x  5 user  staff  .claude
drwxr-xr-x  5 user  staff  .claude/skills/
-rw-r--r--  1 user  staff  package.json
```

---

### 第 2 步：同步技能

使用以下命令同步已安装的技能到 AGENTS.md：

```bash
npx openskills sync
```

**为什么**

`sync` 命令会查找所有已安装的技能，生成一个 XML 格式的技能列表，并写入 `AGENTS.md` 文件。

**你应该看到**：

命令会启动一个交互式选择界面：

```
Found 2 skill(s)

? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)  Comprehensive PDF manipulation toolkit...
  ◉ git-workflow                (project)  Git workflow: Best practices for commits...
  ◉ check-branch-first          (global)   Git workflow: Always check current branch...

<Space> 选择  <a> 全选  <i> 反选  <Enter> 确认
```

**操作指南**：

```
┌─────────────────────────────────────────────────────────────┐
│  操作说明                                                    │
│                                                             │
│  第 1 步         第 2 步          第 3 步                   │
│  移动光标   →   按 Space 选中   →   按 Enter 确认           │
│                                                             │
│  ○ 未选中           ◉ 已选中                                │
│                                                             │
│  (project)         项目技能，蓝色高亮                        │
│  (global)          全局技能，灰色显示                          │
└─────────────────────────────────────────────────────────────┘

你应该看到：
- 光标可以上下移动
- 按空格键切换选中状态（○ ↔ ◉）
- 项目技能显示为蓝色，全局技能显示为灰色
- 按 Enter 确认同步
```

::: tip 智能预选

如果是第一次同步，工具会默认选中所有**项目技能**。如果是更新已存在的 AGENTS.md，工具会预选**文件中已启用的技能**。

:::

---

### 第 3 步：选择技能

在交互式界面中，选择你想让 AI 代理知道的技能。

**示例**：

假设你想同步所有已安装的技能：

```
? Select skills to sync to AGENTS.md:
❯ ◉ pdf                        (project)
  ◉ git-workflow                (project)
  ◯ check-branch-first          (global)   ← 不选这个全局技能
```

操作：
1. **移动光标**：使用上下方向键移动
2. **选中/取消选中**：按 **空格键** 切换选中状态（`○` ↔ `◉`）
3. **确认同步**：按 **回车键** 开始同步

**你应该看到**：

```
✅ Synced 2 skill(s) to AGENTS.md
```

::: tip 选择策略

- **项目技能**：当前项目专用的技能，建议同步
- **全局技能**：通用的技能（如编码规范），按需同步
- **避免过多**：技能太多会占用 AI 上下文，建议只同步常用技能

:::

---

### 第 4 步：查看 AGENTS.md

同步完成后，查看生成的 AGENTS.md 文件：

```bash
cat AGENTS.md
```

**你应该看到**：

```markdown
# AGENTS.md

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of available skills below can help complete the task more effectively.

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
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms...</description>
<location>project</location>
</skill>

<skill>
<name>git-workflow</name>
<description>Git workflow: Best practices for commits, branches, and PRs, ensuring clean history and effective collaboration.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

**关键元素说明**：

| 元素 | 作用 |
| ---- | ---- |
| `<skills_system>` | XML 标签，告诉 AI 这是一个技能系统定义 |
| `<usage>` | 使用说明，告诉 AI 如何调用技能 |
| `<available_skills>` | 可用技能列表 |
| `<skill>` | 单个技能的定义 |
| `<name>` | 技能名称 |
| `<description>` | 技能描述 |
| `<location>` | 技能位置 |

::: info 为什么用 XML 格式？

XML 格式是 AI 代理（特别是 Claude Code）的标准格式，便于解析和理解。工具也支持 HTML 注释格式作为备选方案。

:::

---

### 第 5 步：验证 AI 读取

现在，让 AI 代理读取 AGENTS.md，看看它是否知道有哪些技能可用。

**示例对话**：

```
用户：
我想从 PDF 文件中提取表格数据

AI 代理：
我可以使用 `pdf` 技能来帮助你提取表格数据。让我先读取这个技能的详细内容。

AI 执行：
npx openskills read pdf

输出：
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[PDF 技能的详细内容...]

AI：
好的，我已经加载了 PDF 技能。现在我可以帮你提取表格数据了...
```

**你应该看到**：

- AI 代理识别出可以使用 `pdf` 技能
- AI 自动执行 `npx openskills read pdf` 加载技能内容
- AI 根据技能的指令执行任务

---

### 第 6 步（可选）：自定义输出路径

如果你想把技能同步到其他文件（如 `.ruler/AGENTS.md`），使用 `-o` 或 `--output` 选项：

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**为什么**

某些工具（如 Windsurf）可能期望 AGENTS.md 在特定目录。使用 `-o` 可以灵活地自定义输出路径。

**你应该看到**：

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip 非交互式同步

在 CI/CD 环境中，可以使用 `-y` 或 `--yes` 标志跳过交互式选择，同步所有技能：

```bash
npx openskills sync -y
```

:::

---

## 检查点 ✅

完成上述步骤后，请确认：

- [ ] 命令行显示了交互式选择界面
- [ ] 成功选中了至少一个技能（前面是 `◉`）
- [ ] 同步成功，显示了 `✅ Synced X skill(s) to AGENTS.md` 消息
- [ ] `AGENTS.md` 文件已创建或更新
- [ ] 文件中包含 `<skills_system>` XML 标签
- [ ] 文件中包含 `<available_skills>` 技能列表
- [ ] 每个 `<skill>` 包含 `<name>`, `<description>`, `<location>`

如果以上检查项都通过，恭喜你！技能已成功同步到 AGENTS.md，AI 代理现在可以知道并使用这些技能了。

---

## 踩坑提醒

### 问题 1：没有找到技能

**现象**：

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**原因**：

- 当前目录或全局目录都没有安装技能

**解决方法**：

1. 检查是否有技能安装：

```bash
npx openskills list
```

2. 如果没有，先安装技能：

```bash
npx openskills install anthropics/skills
```

---

### 问题 2：AGENTS.md 没有更新

**现象**：

运行 `openskills sync` 后，AGENTS.md 内容没有变化。

**原因**：

- 使用了 `-y` 标志，但技能列表与之前相同
- AGENTS.md 已存在，但同步的是相同技能

**解决方法**：

1. 检查是否使用了 `-y` 标志

```bash
# 去掉 -y，进入交互模式重新选择
npx openskills sync
```

2. 检查当前目录是否正确

```bash
# 确认在安装技能的项目目录
pwd
ls .claude/skills/
```

---

### 问题 3：AI 代理不知道技能

**现象**：

AGENTS.md 已生成，但 AI 代理仍然不知道有技能可用。

**原因**：

- AI 代理没有读取 AGENTS.md
- AGENTS.md 格式不正确
- AI 代理不支持技能系统

**解决方法**：

1. 确认 AGENTS.md 在项目根目录
2. 检查 AGENTS.md 格式是否正确（包含 `<skills_system>` 标签）
3. 检查 AI 代理是否支持 AGENTS.md（如 Claude Code 支持，其他工具可能需要配置）

---

### 问题 4：输出文件不是 markdown

**现象**：

```
Error: Output file must be a markdown file (.md)
```

**原因**：

- 使用了 `-o` 选项，但指定的文件不是 `.md` 扩展名

**解决方法**：

1. 确保输出文件以 `.md` 结尾

```bash
# ❌ 错误
npx openskills sync -o skills.txt

# ✅ 正确
npx openskills sync -o skills.md
```

---

### 问题 5：取消所有选择

**现象**：

在交互式界面中，取消选中所有技能后，AGENTS.md 中的技能部分被删除。

**原因**：

这是正常行为。如果取消所有技能，工具会移除 AGENTS.md 中的技能部分。

**解决方法**：

如果这是误操作，重新运行 `openskills sync`，选择要同步的技能。

---

## 本课小结

通过本课，你学会了：

- **使用 `openskills sync`** 生成 AGENTS.md 文件
- **理解技能同步的流程**：安装 → 同步 → AI 读取 → 按需加载
- **交互式选择技能**，控制 AI 上下文大小
- **自定义输出路径**，集成到现有文档系统
- **理解 AGENTS.md 格式**，包含 `<skills_system>` XML 标签和技能列表

**核心命令**：

| 命令 | 作用 |
| ---- | ---- |
| `npx openskills sync` | 交互式同步技能到 AGENTS.md |
| `npx openskills sync -y` | 非交互式同步所有技能 |
| `npx openskills sync -o custom.md` | 同步到自定义文件 |
| `cat AGENTS.md` | 查看生成的 AGENTS.md 内容 |

**AGENTS.md 格式要点**：

- 使用 `<skills_system>` XML 标签包裹
- 包含 `<usage>` 使用说明
- 包含 `<available_skills>` 技能列表
- 每个 `<skill>` 包含 `<name>`, `<description>`, `<location>`

---

## 下一课预告

> 下一课我们学习 **[使用技能](../read-skills/)**。
>
> 你会学到：
> - AI 代理如何使用 `openskills read` 命令加载技能
> - 技能的完整加载流程
> - 如何读取多个技能
> - 技能内容的结构和组成

同步技能只是让 AI 知道有哪些工具可用，真正使用时，AI 会通过 `openskills read` 命令加载具体的技能内容。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| ---- | --------- | ---- |
| sync 命令入口 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| 输出文件验证 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| 创建不存在的文件 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| 交互式选择界面 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| 解析现有 AGENTS.md | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| 生成技能 XML | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| 替换技能部分 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| 删除技能部分 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**关键函数**：
- `syncAgentsMd()` - 同步技能到 AGENTS.md 文件
- `parseCurrentSkills()` - 解析现有 AGENTS.md 中的技能名
- `generateSkillsXml()` - 生成 XML 格式的技能列表
- `replaceSkillsSection()` - 替换或添加技能部分到文件
- `removeSkillsSection()` - 从文件中移除技能部分

**关键常量**：
- `AGENTS.md` - 默认输出文件名
- `<skills_system>` - XML 标签，用于标记技能系统定义
- `<available_skills>` - XML 标签，用于标记可用技能列表

**重要逻辑**：
- 默认预选文件中已存在的技能（增量更新）
- 首次同步默认选中所有项目技能
- 支持两种标记格式：XML 标签和 HTML 注释
- 取消所有选择时删除技能部分，而非保留空列表

</details>
