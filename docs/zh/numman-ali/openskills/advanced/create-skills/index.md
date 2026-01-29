---
title: "创建技能: 编写 SKILL.md | openskills"
sidebarTitle: "写一个技能"
subtitle: "创建技能: 编写 SKILL.md"
description: "学习从零创建自定义技能，掌握 SKILL.md 格式和 YAML frontmatter 规范。通过完整示例和符号链接开发流程，快速上手技能创作，确保符合 Anthropic 标准。"
tags:
  - "advanced"
  - "skills"
  - "authoring"
  - "SKILL.md"
prerequisite:
  - "start-quick-start"
  - "start-first-skill"
order: 4
---

# 创建自定义技能

## 学完你能做什么

- 从零创建一个完整的 SKILL.md 技能文件
- 编写符合 Anthropic 标准的 YAML frontmatter
- 设计合理的技能目录结构（references/、scripts/、assets/）
- 使用符号链接进行本地开发和迭代
- 通过 `openskills` 命令安装和验证自定义技能

## 你现在的困境

你想让 AI 代理帮你解决特定问题，但现有技能库中没有合适的方案。你尝试在对话中反复描述需求，但 AI 总是记不住或执行不完整。你需要一种方式来**封装专业知识**，让 AI 代理能够稳定、可靠地复用。

## 什么时候用这一招

- **封装工作流程**：将重复性的操作步骤写成技能，让 AI 一次执行到位
- **团队知识沉淀**：把团队内部的规范、API 文档、脚本打包成技能，共享给所有成员
- **工具集成**：为特定工具（如 PDF 处理、数据清洗、部署流程）创建专用技能
- **本地开发**：在开发中实时修改和测试技能，无需反复安装

## 🎒 开始前的准备

::: warning 前置检查

在开始前，请确保：

- ✅ 已安装 [OpenSkills](/start/installation/)
- ✅ 已安装并同步过至少一个技能（了解基本流程）
- ✅ 熟悉 Markdown 基础语法

:::

## 核心思路

### 什么是 SKILL.md？

**SKILL.md** 是 Anthropic 技能系统的标准格式，用 YAML frontmatter 描述技能元数据，用 Markdown 正文提供执行指令。它有三个核心优势：

1. **统一的格式** - 所有代理（Claude Code、Cursor、Windsurf 等）使用相同的技能描述
2. **渐进式加载** - 只在需要时加载完整内容，保持 AI 上下文精简
3. **可打包资源** - 支持 references/、scripts/、assets/ 三类附加资源

### 最小 vs 完整结构

**最小结构**（适合简单技能）：
```
my-skill/
└── SKILL.md          # 只有一个文件
```

**完整结构**（适合复杂技能）：
```
my-skill/
├── SKILL.md          # 核心指令（< 5000 词）
├── references/       # 详细文档（按需加载）
│   └── api-docs.md
├── scripts/          # 可执行脚本
│   └── helper.py
└── assets/           # 模板和输出文件
    └── template.json
```

::: info 什么时候用完整结构？

- **references/**：当 API 文档、数据库 schema、详细指南超过 5000 词时
- **scripts/**：当需要执行确定性的、可重复的任务时（如数据转换、格式化）
- **assets/**：当需要输出模板、图片、样板代码时

:::

## 跟我做

### 第 1 步：创建技能目录

**为什么**：创建独立目录来组织技能文件

```bash
mkdir my-skill
cd my-skill
```

**你应该看到**：当前目录为空

---

### 第 2 步：编写 SKILL.md 核心结构

**为什么**：SKILL.md 必须以 YAML frontmatter 开头，定义技能元数据

创建 `SKILL.md` 文件：

```markdown
---
name: my-skill                    # 必需：连字符格式的标识符
description: When to use this skill.  # 必需：1-2 句话，第三人称
---

# 技能标题

技能的详细说明。
```

**验证点**：

- ✅ 第一行是 `---`
- ✅ 包含 `name` 字段（连字符格式，如 `pdf-editor`、`api-client`）
- ✅ 包含 `description` 字段（1-2 句话，用第三人称）
- ✅ 结束 YAML 后再次使用 `---`

::: danger 常见错误

| 错误示例 | 修正方法 |
|--- | ---|
| `name: My Skill`（空格） | 改为 `name: my-skill`（连字符） |
| `description: You should use this for...`（第二人称） | 改为 `description: Use this skill for...`（第三人称） |
|--- | ---|
| `description` 太长（超过 100 词） | 精简为 1-2 句话的概述 |

:::

---

### 第 3 步：编写指令内容

**为什么**：指令告诉 AI 代理如何执行任务，必须使用 imperative/infinitive 形式

继续编辑 `SKILL.md`：

```markdown
---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill

## When to Use

Load this skill when:
- Demonstrating instruction writing patterns
- Understanding imperative/infinitive form
- Learning SKILL.md format

## Instructions

To execute this skill:

1. Read the user's input
2. Process the data
3. Return the result

For detailed information, see references/guide.md
```

**写作规范**：

| ✅ 正确写法（imperative/infinitive） | ❌ 错误写法（second person） |
|--- | ---|
| "To accomplish X, execute Y"        | "You should do X"          |
| "Load this skill when Z"            | "If you need Y"            |
| "See references/guide.md"           | "When you want Z"           |

::: tip 口诀

**指令写作三原则**：
1. **动词开头**："Create" → "Use" → "Return"
2. **省略 "You"**：不说 "You should"
3. **明确路径**：引用资源用 `references/` 开头

:::

---

### 第 4 步：添加 Bundled Resources（可选）

**为什么**：当技能需要大量详细文档或可执行脚本时，使用 bundled resources 保持 SKILL.md 简洁

#### 4.1 添加 references/

```bash
mkdir references
```

创建 `references/api-docs.md`：

```markdown
# API Documentation

## Overview

This section provides detailed API information...

## Endpoints

### GET /api/data

Returns processed data.

Response:
```json
{
  "status": "success",
  "data": [...]
}
```
```

在 `SKILL.md` 中引用：

```markdown
## Instructions

To fetch data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format
3. Process the result
```

#### 4.2 添加 scripts/

```bash
mkdir scripts
```

创建 `scripts/process.py`：

```python
#!/usr/bin/env python3
import sys

def main():
    # Processing logic
    print("Processing complete")

if __name__ == "__main__":
    main()
```

在 `SKILL.md` 中引用：

```markdown
## Instructions

To process data:

1. Execute the script:
   ```bash
   python scripts/process.py
   ```
2. Review the output
```

::: info scripts/ 的优势

- **不加载到上下文**：节省 token，适合大文件
- **可独立执行**：AI 代理可以直接调用，无需先加载内容
- **适合确定性任务**：数据转换、格式化、生成等

:::

#### 4.3 添加 assets/

```bash
mkdir assets
```

添加模板文件 `assets/template.json`：

```json
{
  "title": "{{ title }}",
  "content": "{{ content }}"
}
```

在 `SKILL.md` 中引用：

```markdown
## Instructions

To generate output:

1. Load the template: `assets/template.json`
2. Replace placeholders with actual data
3. Write to output file
```

---

### 第 5 步：验证 SKILL.md 格式

**为什么**：在安装前验证格式，避免安装时报错

```bash
npx openskills install ./my-skill
```

**你应该看到**：

```
✔ Found skill: my-skill
  Description: Use this skill to demonstrate how to write proper instructions.
  Size: 1.2 KB

? Select skills to install: (Use arrow keys)
❯ ☑ my-skill
```

选择技能并按回车，应该看到：

```
✔ Installing my-skill...
✔ Skill installed successfully to .claude/skills/my-skill

Next steps:
  Run: npx openskills sync
  Then: Ask your AI agent to use the skill
```

::: tip 验证清单

在安装前，检查以下项目：

- [ ] SKILL.md 以 `---` 开头
- [ ] 包含 `name` 和 `description` 字段
- [ ] `name` 使用连字符格式（`my-skill` 而非 `my_skill`）
- [ ] `description` 是 1-2 句话的概述
- [ ] 指令使用 imperative/infinitive 形式
- [ ] 所有 `references/`、`scripts/`、`assets/` 引用路径正确

:::

---

### 第 6 步：同步到 AGENTS.md

**为什么**：让 AI 代理知道有这个技能可用

```bash
npx openskills sync
```

**你应该看到**：

```
✔ Found 1 skill:
  ☑ my-skill

✔ Syncing to AGENTS.md...
✔ Updated AGENTS.md successfully
```

检查生成的 `AGENTS.md`：

```markdown
<!-- SKILLS_SYSTEM_START -->
...
<available_skills>
  <skill name="my-skill">Use this skill to demonstrate how to write proper instructions.</skill>
</available_skills>
...
<!-- SKILLS_SYSTEM_END -->
```

---

### 第 7 步：测试技能加载

**为什么**：验证技能能够正确加载到 AI 上下文

```bash
npx openskills read my-skill
```

**你应该看到**：

```
Loading skill: my-skill
Base directory: /path/to/project/.claude/skills/my-skill

---
name: my-skill
description: Use this skill to demonstrate how to write proper instructions.
---

# My Skill
... (完整 SKILL.md 内容)
```

## 检查点 ✅

完成以上步骤后，你应该：

- ✅ 创建了一个包含 SKILL.md 的技能目录
- ✅ SKILL.md 包含正确的 YAML frontmatter 和 Markdown 内容
- ✅ 技能成功安装到 `.claude/skills/`
- ✅ 技能已同步到 AGENTS.md
- ✅ 使用 `openskills read` 能够加载技能内容

## 踩坑提醒

### 问题 1：安装时报 "Invalid SKILL.md (missing YAML frontmatter)"

**原因**：SKILL.md 没有以 `---` 开头

**解决方法**：检查文件第一行是否是 `---`，不是 `# My Skill` 或其他内容

---

### 问题 2：AI 代理无法识别技能

**原因**：未执行 `openskills sync` 或 AGENTS.md 未更新

**解决方法**：运行 `npx openskills sync` 并检查 AGENTS.md 中是否包含技能条目

---

### 问题 3：资源路径解析错误

**原因**：在 SKILL.md 中使用了绝对路径或错误的相对路径

**解决方法**：
- ✅ 正确：`references/api-docs.md`（相对路径）
- ❌ 错误：`/path/to/skill/references/api-docs.md`（绝对路径）
- ❌ 错误：`../other-skill/references/api-docs.md`（跨技能引用）

---

### 问题 4：SKILL.md 过长导致 token 超限

**原因**：SKILL.md 超过 5000 词或包含大量详细文档

**解决方法**：将详细内容移到 `references/` 目录，在 SKILL.md 中引用

## 本课小结

创建自定义技能的核心步骤：

1. **创建目录结构**：最小结构（只有 SKILL.md）或完整结构（包含 references/、scripts/、assets/）
2. **编写 YAML frontmatter**：必需字段 `name`（连字符格式）和 `description`（1-2 句话）
3. **编写指令内容**：使用 imperative/infinitive 形式，避免 second person
4. **添加资源**（可选）：references/、scripts/、assets/
5. **验证格式**：使用 `openskills install ./my-skill` 验证
6. **同步到 AGENTS.md**：运行 `openskills sync` 让 AI 代理知道
7. **测试加载**：使用 `openskills read my-skill` 验证加载

## 下一课预告

> 下一课我们学习 **[技能结构详解](../skill-structure/)**。
>
> 你会学到：
> - SKILL.md 的完整字段说明
> - references/、scripts/、assets/ 的最佳实践
> - 如何优化技能的可读性和可维护性

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能           | 文件路径                                                                 | 行号    |
|--- | --- | ---|
| YAML frontmatter 验证 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 12-14   |
| YAML 字段提取  | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7     |
| 安装时验证格式  | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 242, 291, 340 |
| 技能名称提取    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 344-345 |

**示例技能文件**：
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 最小结构示例
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 格式规范参考

**关键函数**：
- `hasValidFrontmatter(content: string): boolean` - 验证 SKILL.md 是否以 `---` 开头
- `extractYamlField(content: string, field: string): string` - 提取 YAML 字段值（非贪婪匹配）

</details>
