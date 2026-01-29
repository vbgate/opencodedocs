---
title: "全局 vs 项目: 安装位置 | OpenSkills"
sidebarTitle: "全局安装：项目间共享技能"
subtitle: "全局安装 vs 项目本地安装"
description: "学习 OpenSkills 技能的全局安装和项目本地安装区别。掌握 --global 标志的使用，理解搜索优先级规则，根据场景选择合适的安装位置。"
tags:
  - "平台集成"
  - "技能管理"
  - "配置技巧"
prerequisite:
  - "start-first-skill"
  - "platforms-install-sources"
order: 3
---

# 全局安装 vs 项目本地安装

## 学完你能做什么

- 理解 OpenSkills 的两种安装位置（全局 vs 项目本地）的区别
- 根据场景选择合适的安装位置
- 掌握 `--global` 标志的使用方法
- 理解技能的搜索优先级规则
- 避免常见的安装位置配置错误

::: info 前置知识

本教程假设你已经完成了 [安装第一个技能](../../start/first-skill/) 和 [安装来源详解](../install-sources/)，了解基本的技能安装流程。

:::

---

## 你现在的困境

你可能已经学会了如何安装技能，但是：

- **技能装在哪里了？**：执行 `openskills install` 后，不知道技能文件被复制到哪个目录
- **新项目又得重新装？**：切换到另一个项目时，之前安装的技能不见了
- **只想全局用一次的技能怎么办？**：有些技能所有项目都需要，不想每个项目都装
- **多个项目共享技能？**：有些技能是团队通用的，想统一管理

其实 OpenSkills 提供了两种安装位置，让你灵活管理技能。

---

## 什么时候用这一招

**两种安装位置的适用场景**：

| 安装位置 | 适用场景 | 示例 |
|--- | --- | ---|
| **项目本地**（默认） | 项目专用的技能，需要版本控制 | 团队业务规则、项目特定工具 |
| **全局安装**（`--global`） | 所有项目通用的技能，无需版本控制 | 通用代码生成工具、文件格式转换 |

::: tip 推荐做法

- **默认使用项目本地安装**：让技能跟随项目，便于团队协作和版本控制
- **通用工具才用全局安装**：比如 `git-helper`、`docker-generator` 等跨项目工具
- **避免过度全局化**：全局安装的技能会被所有项目共享，可能导致冲突或版本不一致

:::

---

## 核心思路：两种位置，灵活选择

OpenSkills 的技能安装位置由 `--global` 标志控制：

**默认（项目本地安装）**：
- 安装位置：`./.claude/skills/`（项目根目录）
- 适用：单个项目专用的技能
- 优势：技能跟随项目，可以提交到 Git，便于团队协作

**全局安装**：
- 安装位置：`~/.claude/skills/`（用户主目录）
- 适用：所有项目通用的技能
- 优势：所有项目共享，无需重复安装

::: info 重要概念

**项目本地**：技能安装在当前项目的 `.claude/skills/` 目录下，只对当前项目可见。

**全局安装**：技能安装在用户主目录的 `.claude/skills/` 下，对所有项目可见。

:::

---

## 跟我做

### 第 1 步：查看默认安装行为

**为什么**
先了解默认安装方式，理解 OpenSkills 的设计思路。

打开终端，在任意项目中执行：

```bash
# 安装一个测试技能（默认项目本地）
npx openskills install anthropics/skills -y

# 查看技能列表
npx openskills list
```

**你应该看到**：技能列表中每个技能后面有 `(project)` 标签

```
  codebase-reviewer         (project)
    Review code changes for issues...

Summary: 3 project, 0 global (3 total)
```

**解释**：
- 默认情况下，技能安装在 `./.claude/skills/` 目录
- `list` 命令会显示 `(project)` 或 `(global)` 标签
- 默认不使用 `--global` 标志时，技能只对当前项目可见

---

### 第 2 步：查看技能安装位置

**为什么**
确认技能文件的实际存储位置，便于后续管理。

在项目根目录执行：

```bash
# 查看项目本地的技能目录
ls -la .claude/skills/

# 查看技能目录内容
ls -la .claude/skills/codebase-reviewer/
```

**你应该看到**：

```
.claude/skills/
├── codebase-reviewer/
│   ├── SKILL.md
│   └── .openskills.json    # 安装元数据
├── file-writer/
│   ├── SKILL.md
│   └── .openskills.json
└── ...
```

**解释**：
- 每个技能都有自己的目录
- `SKILL.md` 是技能的核心内容
- `.openskills.json` 记录安装来源和元数据（用于更新）

---

### 第 3 步：全局安装技能

**为什么**
了解全局安装的命令和效果。

执行：

```bash
# 全局安装一个技能
npx openskills install anthropics/skills --global -y

# 再次查看技能列表
npx openskills list
```

**你应该看到**：

```
  codebase-reviewer         (project)
    Review code changes for issues...
  file-writer              (global)
    Write files with format...

Summary: 1 project, 2 global (3 total)
```

**解释**：
- 使用 `--global` 标志后，技能安装在 `~/.claude/skills/`
- `list` 命令显示 `(global)` 标签
- 同名的技能会优先使用项目本地的版本（搜索优先级）

---

### 第 4 步：对比两种安装位置

**为什么**
通过实际对比，理解两种安装位置的差异。

执行以下命令：

```bash
# 查看全局安装的技能目录
ls -la ~/.claude/skills/

# 对比项目本地和全局安装的技能
echo "=== Project Skills ==="
ls .claude/skills/

echo "=== Global Skills ==="
ls ~/.claude/skills/
```

**你应该看到**：

```
=== Project Skills ===
codebase-reviewer
file-writer

=== Global Skills ===
codebase-reviewer
file-writer
test-generator
```

**解释**：
- 项目本地技能：`./.claude/skills/`
- 全局技能：`~/.claude/skills/`
- 两个目录可以包含同名技能，但项目本地的优先级更高

---

### 第 5 步：验证搜索优先级

**为什么**
理解 OpenSkills 如何在多个位置查找技能。

执行：

```bash
# 在两个位置安装同名技能
npx openskills install anthropics/skills -y  # 项目本地
npx openskills install anthropics/skills --global -y  # 全局

# 读取技能（会优先使用项目本地版本）
npx openskills read codebase-reviewer | head -5
```

**你应该看到**：输出的是项目本地版本的技能内容。

**搜索优先级规则**（源码 `dirs.ts:18-24`）：

```typescript
export function getSearchDirs(): string[] {
  return [
    join(process.cwd(), '.claude/skills'),   // 1. 项目本地（最高优先级）
    join(homedir(), '.claude/skills'),       // 2. 全局
  ];
}
```

**解释**：
- 项目本地的技能优先级高于全局
- 当同名技能同时存在时，优先使用项目本地版本
- 这样可以实现"项目覆盖全局"的灵活配置

---

## 检查点 ✅

完成以下检查，确认你掌握了本课内容：

- [ ] 能够区分项目本地安装和全局安装
- [ ] 知道 `--global` 标志的作用
- [ ] 理解技能的搜索优先级规则
- [ ] 能够根据场景选择合适的安装位置
- [ ] 知道如何查看已安装技能的位置标签

---

## 踩坑提醒

### 常见错误 1：误用全局安装

**错误场景**：把项目专用技能全局安装

```bash
**错误场景**：把项目专用技能全局安装

```bash
# ❌ 错误：团队业务规则不应该全局安装
npx openskills install my-company/rules --global
```

**问题**：
- 团队其他成员无法获取该技能
- 技能不会被版本控制
- 可能与其他项目的技能冲突

**正确做法**：

```bash
# ✅ 正确：项目专用技能使用默认安装（项目本地）
npx openskills install my-company/rules
```

---

### 常见错误 2：忘记 `--global` 标志

**错误场景**：想让所有项目共享技能，但忘记加 `--global`

```bash
# ❌ 错误：默认安装到项目本地，其他项目无法使用
npx openskills install universal-tool
```

**问题**：
- 技能只安装在当前项目的 `./.claude/skills/`
- 切换到其他项目后，需要重新安装

**正确做法**：

```bash
# ✅ 正确：通用工具使用全局安装
npx openskills install universal-tool --global
```

---

### 常见错误 3：同名技能冲突

**错误场景**：项目本地和全局安装了同名技能，但期望使用全局版本

```bash
# 项目本地和全局都有 codebase-reviewer
# 但想用全局版本（新的）
npx openskills install codebase-reviewer --global  # 安装新版
npx openskills read codebase-reviewer  # ❌ 还是读到旧版
```

**问题**：
- 项目本地版本的优先级更高
- 即使全局安装了新版本，仍然读取项目本地旧版本

**正确做法**：

```bash
# 方案 1：删除项目本地版本
npx openskills remove codebase-reviewer  # 删除项目本地
npx openskills read codebase-reviewer  # ✅ 现在读取全局版本

# 方案 2：在项目本地更新
npx openskills update codebase-reviewer  # 更新项目本地版本
```

---

## 本课小结

**核心要点**：

1. **默认安装到项目本地**：技能安装在 `./.claude/skills/`，只对当前项目可见
2. **全局安装使用 `--global`**：技能安装在 `~/.claude/skills/`，所有项目共享
3. **搜索优先级**：项目本地 > 全局
4. **推荐原则**：项目专用用本地，通用工具用全局

**决策流程**：

```
[需要安装技能] → [是否项目专用？]
                      ↓ 是
              [项目本地安装（默认）]
                      ↓ 否
              [是否需要版本控制？]
                      ↓ 是
              [项目本地安装（可提交 Git）]
                      ↓ 否
              [全局安装（--global）]
```

**记忆口诀**：

- **项目本地**：技能跟着项目走，团队协作不用愁
- **全局安装**：通用工具放全局，所有项目都能用

---

## 下一课预告

> 下一课我们学习 **[列出已安装技能](../list-skills/)**。
>
> 你会学到：
> - 如何查看所有已安装技能
> - 理解技能位置标签的含义
> - 如何统计项目技能和全局技能的数量
> - 如何根据位置筛选技能

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                          | 行号    |
|--- | --- | ---|
| 安装位置判断 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L84-L92) | 84-92   |
| 目录路径工具 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts#L7-L25)     | 7-25    |
| 技能列表显示 | [`src/commands/list.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/list.ts#L20-L43)   | 20-43   |

**关键常量**：
- `.claude/skills`：默认技能目录（Claude Code 兼容）
- `.agent/skills`：通用技能目录（多代理环境）

**关键函数**：
- `getSkillsDir(projectLocal, universal)`：根据标志返回技能目录路径
- `getSearchDirs()`：返回技能搜索目录列表（按优先级排序）
- `listSkills()`：列出所有已安装技能，显示位置标签

**业务规则**：
- 默认安装到项目本地（`!options.global`）
- 技能搜索优先级：项目本地 > 全局
- `list` 命令显示 `(project)` 和 `(global)` 标签

</details>
