---
title: "AGENTS.md 格式: 技能规范 | openskills"
sidebarTitle: "让 AI 认识你的技能"
subtitle: "AGENTS.md 格式规范"
description: "学习 AGENTS.md 文件的 XML 标签结构和技能列表定义。了解字段含义、生成机制和最佳实践，掌握技能系统工作原理。"
tags:
  - "appendix"
  - "reference"
  - "format"
prerequisite:
  - "sync-to-agents"
order: 2
---

# AGENTS.md 格式规范

**AGENTS.md** 是 OpenSkills 生成的技能描述文件，告诉 AI 代理（如 Claude Code、Cursor、Windsurf 等）有哪些技能可用，以及如何调用这些技能。

## 学完你能做什么

- 读懂 AGENTS.md 的 XML 结构和各个标签的含义
- 理解技能列表的字段定义和使用限制
- 知道如何手动编辑 AGENTS.md（不推荐，但有时需要）
- 了解 OpenSkills 如何生成和更新这个文件

## 完整格式示例

下面是一个完整的 AGENTS.md 文件示例：

```xml
# AGENTS

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
- For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>open-source-maintainer</name>
<description>End-to-end GitHub repository maintenance for open-source projects. Use when asked to triage issues, review PRs, analyze contributor activity, generate maintenance reports, or maintain a repository.</description>
<location>project</location>
</skill>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables, creating new PDFs, merging/splitting documents, and handling forms.</description>
<location>global</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
```

## 标签结构详解

### 外层容器：`<skills_system>`

```xml
<skills_system priority="1">
  <!-- 技能内容 -->
</skills_system>
```

- **priority**：优先级标记（固定为 `"1"`），告诉 AI 代理这个技能系统的重要程度

::: tip 说明
`priority` 属性目前保留为未来扩展使用，所有 AGENTS.md 都使用固定值 `"1"`。
:::

### 使用说明：`<usage>`

`<usage>` 标签包含 AI 代理应该如何使用技能的指导：

```xml
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: `npx openskills read <skill-name>`
  - For multiple: `npx openskills read skill-one,skill-two`
- The skill content will load with detailed instructions on how to complete task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>
```

**关键要点**：
- **触发条件**：检查用户任务是否可以用技能更高效完成
- **调用方式**：使用 `npx openskills read <skill-name>` 命令
- **批量调用**：支持逗号分隔的多个技能名
- **基础目录**：输出包含 `base_dir` 字段，用于解析技能中的引用文件（如 `references/`、`scripts/`、`assets/`）
- **使用限制**：
  - 只使用 `<available_skills>` 中列出的技能
  - 不要重复加载已经在上下文中的技能
  - 每次技能调用是无状态的

### 技能列表：`<available_skills>`

`<available_skills>` 包含所有可用技能的列表，每个技能用 `<skill>` 标签定义：

```xml
<available_skills>

<skill>
<name>skill-name</name>
<description>技能描述...</description>
<location>project</location>
</skill>

<skill>
<name>another-skill</name>
<description>另一个技能描述...</description>
<location>global</location>
</skill>

</available_skills>
```

#### `<skill>` 标签字段

每个 `<skill>` 包含以下必需字段：

| 字段        | 类型     | 可选值        | 说明                                         |
|--- | --- | --- | ---|
| `<name>`    | string   | -             | 技能名称（与 SKILL.md 文件名或 YAML 中的 `name` 一致） |
| `<description>` | string | -             | 技能描述（来自 SKILL.md 的 YAML frontmatter）        |
| `<location>` | string   | `project` \| `global` | 技能安装位置标记（用于 AI 代理理解技能来源）         |

**字段说明**：

- **`<name>`**：技能的唯一标识符，AI 代理通过这个名字调用技能
- **`<description>`**：详细说明技能的功能和使用场景，帮助 AI 判断是否需要使用这个技能
- **`<location>`**：
  - `project`：安装在项目本地（`.claude/skills/` 或 `.agent/skills/`）
  - `global`：安装在全局目录（`~/.claude/skills/`）

::: info 为什么需要 location 标记？
`<location>` 标记帮助 AI 代理理解技能的可见范围：
- `project` 技能只在当前项目可用
- `global` 技能在所有项目中都可用
这影响 AI 代理的技能选择策略。
:::

## 标记方式

AGENTS.md 支持两种标记方式，OpenSkills 会自动识别：

### 方式 1：XML 标记（推荐）

```xml
<skills_system priority="1">
  <!-- 技能内容 -->
</skills_system>
```

这是默认方式，使用标准 XML 标签标记技能系统的开始和结束。

### 方式 2：HTML 注释标记（兼容模式）

```xml
<!-- SKILLS_TABLE_START -->

## Available Skills

<usage>
  <!-- 使用说明 -->
</usage>

<available_skills>
  <!-- 技能列表 -->
</available_skills>

<!-- SKILLS_TABLE_END -->
```

这种格式去掉了外层的 `<skills_system>` 容器，只用 HTML 注释标记技能区域的开始和结束。

::: tip OpenSkills 的处理逻辑
`replaceSkillsSection()` 函数（`src/utils/agents-md.ts:67-93`）会按以下优先级查找标记：
1. 先查找 `<skills_system>` XML 标记
2. 如果没找到，查找 `<!-- SKILLS_TABLE_START -->` HTML 注释
3. 如果都没找到，将内容追加到文件末尾
:::

## OpenSkills 如何生成 AGENTS.md

当执行 `openskills sync` 时，OpenSkills 会：

1. **查找所有已安装技能**（`findAllSkills()`）
2. **交互式选择技能**（除非使用 `-y` 标志）
3. **生成 XML 内容**（`generateSkillsXml()`）
   - 构建 `<usage>` 使用说明
   - 为每个技能生成 `<skill>` 标签
4. **替换文件中的技能部分**（`replaceSkillsSection()`）
   - 查找现有标记（XML 或 HTML 注释）
   - 替换标记之间的内容
   - 如果没有标记，追加到文件末尾

### 源码位置

| 功能            | 文件路径                                                                      | 行号    |
|--- | --- | ---|
| 生成 XML        | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62   |
| 替换技能部分    | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93   |
| 解析现有技能    | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18)  | 6-18    |

## 手动编辑注意事项

::: warning 不推荐手动编辑
虽然可以手动编辑 AGENTS.md，但建议：
1. 使用 `openskills sync` 命令生成和更新
2. 手动编辑的内容会在下次 `sync` 时被覆盖
3. 如果需要自定义技能列表，使用交互式选择（不带 `-y` 标志）
:::

如果确实需要手动编辑，请注意：

1. **保持 XML 语法正确**：确保所有标签都正确闭合
2. **不要修改标记**：保留 `<skills_system>` 或 `<!-- SKILLS_TABLE_START -->` 等标记
3. **字段完整**：每个 `<skill>` 必须包含 `<name>`、`<description>`、`<location>` 三个字段
4. **无重复技能**：不要重复添加同名的技能

## 常见问题

### Q1：为什么 AGENTS.md 有时没有 `<skills_system>` 标签？

**A**：这是兼容模式。如果你的文件使用 HTML 注释标记（`<!-- SKILLS_TABLE_START -->`），OpenSkills 也会识别。下次 `sync` 时会自动转换为 XML 标记。

### Q2：如何删除所有技能？

**A**：执行 `openskills sync` 并在交互式界面中取消选择所有技能，或者运行：

```bash
openskills sync -y --output /dev/null
```

这会清空 AGENTS.md 中的技能部分（但保留标记）。

### Q3：location 字段对 AI 代理有实际影响吗？

**A**：这取决于具体的 AI 代理实现。一般来说：
- `location="project"` 表示技能只在当前项目上下文中有意义
- `location="global"` 表示技能是通用工具，可以在任何项目使用

AI 代理可能会根据这个标记调整技能加载策略，但大多数代理（如 Claude Code）会忽略这个字段，直接调用 `openskills read`。

### Q4：技能描述应该写多长？

**A**：技能描述应该：
- **简洁但完整**：说明技能的核心功能和主要使用场景
- **避免太短**：单行描述很难让 AI 理解何时使用
- **避免太长**：过长的描述会浪费上下文，AI 不会仔细阅读

建议长度：**50-150 词**。

## 最佳实践

1. **使用 sync 命令**：始终用 `openskills sync` 生成 AGENTS.md，而不是手动编辑
2. **定期更新**：安装或更新技能后，记得运行 `openskills sync`
3. **选择合适的技能**：不是所有已安装的技能都需要放在 AGENTS.md 中，根据项目需求选择
4. **检查格式**：如果 AI 代理无法识别技能，检查 AGENTS.md 的 XML 标签是否正确

## 下一课预告

> 下一课我们学习 **[文件结构](../file-structure/)**。
>
> 你会学到：
> - OpenSkills 生成的目录和文件结构
> - 各个文件的作用和位置
> - 如何理解和管理技能目录

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能           | 文件路径                                                                                     | 行号    |
|--- | --- | ---|
| 生成技能 XML   | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62   |
| 替换技能部分   | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93   |
| 解析现有技能   | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18)  | 6-18    |
| Skill 类型定义 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6)           | 1-6     |

**关键常量**：
- `priority="1"`：技能系统优先级标记（固定值）

**关键函数**：
- `generateSkillsXml(skills: Skill[])`：生成 XML 格式的技能列表
- `replaceSkillsSection(content: string, newSection: string)`：替换或追加技能部分
- `parseCurrentSkills(content: string)`：从 AGENTS.md 中解析已启用的技能名

</details>
