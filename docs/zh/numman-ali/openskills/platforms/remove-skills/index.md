---
title: "删除技能: 交互式和脚本化移除技能 | openskills"
sidebarTitle: "安全移除旧技能"
subtitle: "删除技能: 交互式和脚本化移除技能"
description: "学习 OpenSkills 两种技能删除方式：交互式 manage 和脚本化 remove。了解使用场景、位置确认和常见问题排查，安全清理技能库。"
tags:
  - "技能管理"
  - "命令使用"
  - "CLI"
prerequisite:
  - "start-installation"
  - "start-first-skill"
  - "platforms-list-skills"
order: 6
---
# 删除技能

## 学完你能做什么

- 使用 `openskills manage` 交互式删除多个技能
- 使用 `openskills remove` 脚本化删除指定技能
- 理解两种删除方式的使用场景
- 确认删除的是 project 还是 global 位置
- 安全地清理不再需要的技能

## 你现在的困境

随着技能安装的增多，你可能遇到这些问题：

- "有些技能我已经不用了，想删掉几个，但一个个删太麻烦"
- "我想在脚本里自动删除技能， manage 命令需要交互式选择"
- "不确定技能是安装在 project 还是 global，删除前想确认一下"
- "批量删除技能，怕误删还在用的"

OpenSkills 提供了两种删除方式来解决这些问题：**交互式 manage**（适合手动选择多个技能）和**脚本化 remove**（适合精准删除单个技能）。

## 什么时候用这一招

| 场景 | 推荐方式 | 命令 |
|------|---------|------|
| 手动删除多个技能 | 交互式选择 | `openskills manage` |
| 脚本或 CI/CD 自动删除 | 精准指定技能名 | `openskills remove <name>` |
| 只知道技能名，想快速删除 | 直接删除 | `openskills remove <name>` |
| 想看有哪些技能可删除 | 先列表再删除 | `openskills list` → `openskills manage` |

## 核心思路

OpenSkills 的两种删除方式适用于不同场景：

### 交互式删除：`openskills manage`

- **特点**：显示所有已安装技能，让你勾选要删除的
- **适用**：手动管理技能库，一次性删除多个
- **优势**：不会误删，可以提前看到所有选项
- **默认行为**：**不选中任何技能**（避免误删）

### 脚本化删除：`openskills remove <name>`

- **特点**：直接删除指定的技能
- **适用**：脚本、自动化、精准删除
- **优势**：快速、无需交互
- **风险**：技能名写错会报错，不会误删其他技能

### 删除原理

两种方式都是删除**整个技能目录**（包括 SKILL.md、references/、scripts/、assets/ 等所有文件），不留残余。

::: tip 删除不可恢复
删除技能会删除整个技能目录，不可恢复。建议删除前先确认技能是否不再需要，或者重新安装即可。
:::

## 跟我做

### 第 1 步：交互式删除多个技能

**为什么**
当你有多个技能需要删除时，交互式选择更安全直观

执行以下命令：

```bash
npx openskills manage
```

**你应该看到**

首先会看到所有已安装的技能列表（按 project/global 排序）：

```
? Select skills to remove:
❯◯ pdf                         (project)
 ◯ code-analyzer                (project)
 ◯ email-reader                 (global)
 ◯ git-tools                    (global)
```

- **蓝色** `(project)`：项目级技能
- **灰色** `(global)`：全局级技能
- **空格**：勾选/取消勾选
- **回车**：确认删除

假设你勾选了 `pdf` 和 `git-tools`，然后按回车：

**你应该看到**

```
✅ Removed: pdf (project)
✅ Removed: git-tools (global)

✅ Removed 2 skill(s)
```

::: info 默认不选中
manage 命令默认**不选中任何技能**，这是为了防止误删。你需要用空格键手动勾选要删除的技能。
:::

### 第 2 步：脚本化删除单个技能

**为什么**
当你知道技能名，想快速删除时

执行以下命令：

```bash
npx openskills remove pdf
```

**你应该看到**

```
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)
```

如果技能不存在：

```
Error: Skill 'pdf' not found
```

程序会退出并返回错误码 1（适合脚本判断）。

### 第 3 步：确认删除位置

**为什么**
删除前确认技能位置（project vs global），避免误删

删除技能时，命令会显示删除位置：

```bash
# 脚本化删除会显示详细位置
npx openskills remove pdf
✅ Removed: pdf
   From: project (/Users/yourname/project/.claude/skills/pdf)

# 交互式删除也会显示每个技能的位置
npx openskills manage
# 勾选后回车
✅ Removed: pdf (project)
✅ Removed: git-tools (global)
```

**判断规则**：
- 如果路径包含当前项目目录 → `(project)`
- 如果路径包含 home 目录 → `(global)`

### 第 4 步：删除后验证

**为什么**
确认删除成功，避免遗漏

删除技能后，用 list 命令验证：

```bash
npx openskills list
```

**你应该看到**

已删除的技能不再出现在列表中。

## 检查点 ✅

确认以下内容：

- [ ] 执行 `openskills manage` 能看到所有技能列表
- [ ] 能用空格键勾选/取消勾选技能
- [ ] 默认不选中任何技能（防止误删）
- [ ] 执行 `openskills remove <name>` 能删除指定技能
- [ ] 删除时会显示是 project 还是 global 位置
- [ ] 删除后用 `openskills list` 验证技能已消失

## 踩坑提醒

### 常见问题 1：误删了还在用的技能

**现象**：删除后才发现技能还在用

**解决方法**：

重新安装即可：

```bash
# 如果是从 GitHub 安装的
npx openskills install anthropics/skills

# 如果是从本地路径安装的
npx openskills install ./path/to/skill
```

OpenSkills 会记录安装来源（在 `.openskills.json` 文件中），重新安装时不会丢失原始路径信息。

### 常见问题 2：manage 命令显示 "No skills installed"

**现象**：执行 `openskills manage` 提示没有安装技能

**原因**：当前目录下确实没有技能

**排查步骤**：

1. 检查是否在正确的项目目录下
2. 确认是否安装了全局技能（`openskills list --global`）
3. 切换到安装技能的目录再试

```bash
# 切换到项目目录
cd /path/to/your/project

# 再次尝试
npx openskills manage
```

### 常见问题 3：remove 命令报错 "Skill not found"

**现象**：执行 `openskills remove <name>` 提示技能不存在

**原因**：技能名拼写错误，或者技能已删除

**排查步骤**：

1. 先用 list 命令查看正确的技能名：

```bash
npx openskills list
```

2. 检查技能名拼写（注意大小写和连字符）

3. 确认技能是 project 还是 global（在不同目录下查找）

```bash
# 查看项目技能
ls -la .claude/skills/

# 查看全局技能
ls -la ~/.claude/skills/
```

### 常见问题 4：删除后技能还在 AGENTS.md 中

**现象**：删除技能后，AGENTS.md 中还有这个技能的引用

**原因**：删除技能不会自动更新 AGENTS.md

**解决方法**：

重新执行 sync 命令：

```bash
npx openskills sync
```

sync 会重新扫描已安装技能并更新 AGENTS.md，删除的技能会自动从列表中移除。

## 本课小结

OpenSkills 提供两种技能删除方式：

### 交互式删除：`openskills manage`

- 🎯 **适用场景**：手动管理技能库，删除多个技能
- ✅ **优势**：直观、不误删、可预览
- ⚠️ **注意**：默认不选中任何技能，需要手动勾选

### 脚本化删除：`openskills remove <name>`

- 🎯 **适用场景**：脚本、自动化、精准删除
- ✅ **优势**：快速、无需交互
- ⚠️ **注意**：技能名写错会报错

**核心要点**：

1. 两种方式都是删除整个技能目录（不可恢复）
2. 删除时会显示是 project 还是 global 位置
3. 删除后用 `openskills list` 验证
4. 记得重新执行 `openskills sync` 更新 AGENTS.md

## 下一课预告

> 下一课我们学习 **[Universal 模式：多代理环境](../../advanced/universal-mode/)**。
>
> 你会学到：
> - 如何使用 `--universal` 标志避免与 Claude Code 冲突
> - 多代理环境下统一技能管理
> - `.agent/skills` 目录的作用

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                           | 行号    |
| ----------- | -------------------------------------------------------------------------------------------------- | ------- |
| manage 命令实现 | [`src/commands/manage.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/manage.ts) | 10-62   |
| remove 命令实现 | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts) | 8-21    |
| 查找所有技能 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 30-64   |
| 查找指定技能 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 66-90   |

**关键函数**：
- `manageSkills()`：交互式删除技能，使用 inquirer checkbox 让用户选择
- `removeSkill(skillName)`：脚本化删除指定技能，找不到时报错退出
- `findAllSkills()`：遍历 4 个搜索目录，收集所有技能
- `findSkill(skillName)`：查找指定技能，返回 Skill 对象

**关键常量**：
- 无（所有路径和配置都是动态计算的）

**核心逻辑**：

1. **manage 命令**（src/commands/manage.ts）：
   - 调用 `findAllSkills()` 获取所有技能（第 11 行）
   - 按 project/global 排序（第 20-25 行）
   - 使用 inquirer `checkbox` 让用户选择（第 33-37 行）
   - 默认 `checked: false`，不选中任何技能（第 30 行）
   - 遍历选中的技能，调用 `rmSync` 删除（第 45-52 行）

2. **remove 命令**（src/commands/remove.ts）：
   - 调用 `findSkill(skillName)` 查找技能（第 9 行）
   - 如果找不到，输出错误并 `process.exit(1)`（第 12-14 行）
   - 调用 `rmSync` 删除整个技能目录（第 16 行）
   - 通过 `homedir()` 判断是 project 还是 global（第 18 行）

3. **删除操作**：
   - 使用 `rmSync(baseDir, { recursive: true, force: true })` 删除整个技能目录
   - `recursive: true`：递归删除所有子文件和子目录
   - `force: true`：忽略文件不存在错误

</details>
