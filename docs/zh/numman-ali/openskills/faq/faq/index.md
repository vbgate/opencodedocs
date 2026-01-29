---
title: "常见问题: 故障排除指南 | opencode"
subtitle: "常见问题: 故障排除指南"
sidebarTitle: "遇到问题怎么办"
description: "学习 OpenSkills 常见问题的解决方案。快速排查安装失败、技能未加载、AGENTS.md 同步等故障，提升技能管理效率。"
tags:
  - "FAQ"
  - "故障排除"
  - "常见问题"
prerequisite:
  - "start-quick-start"
order: 1
---

# 常见问题解答

## 学完你能做什么

本课解答 OpenSkills 使用中的常见问题，帮你：

- ✅ 快速定位和解决安装失败问题
- ✅ 理解 OpenSkills 与 Claude Code 的关系
- ✅ 解决技能未出现在 AGENTS.md 的问题
- ✅ 处理技能更新和删除相关的疑问
- ✅ 在多代理环境中正确配置技能

## 你现在的困境

使用 OpenSkills 时，你可能会遇到：

- "安装总是失败，不知道哪里出错了"
- "AGENTS.md 里看不到刚安装的技能"
- "不知道技能到底装在哪"
- "想用 OpenSkills，但怕和 Claude Code 冲突"

本课帮你快速找到问题的根源和解决方案。

---

## 核心概念类问题

### OpenSkills 和 Claude Code 有什么区别？

**简短回答**：OpenSkills 是"通用安装器"，Claude Code 是"官方代理"。

**详细说明**：

| 对比项 | OpenSkills | Claude Code |
|--- | --- | ---|
| **定位** | 通用技能加载器 | Anthropic 官方 AI 编码代理 |
| **支持范围** | 所有 AI 代理（Cursor、Windsurf、Aider 等） | 仅 Claude Code |
| **技能格式** | 与 Claude Code 完全一致（`SKILL.md`） | 官方规范 |
| **安装方式** | 从 GitHub、本地路径、私有仓库安装 | 从内置 Marketplace 安装 |
| **技能存储** | `.claude/skills/` 或 `.agent/skills/` | `.claude/skills/` |
| **调用方式** | `npx openskills read <name>` | 内置 `Skill()` 工具 |

**核心价值**：OpenSkills 让其他代理也能使用 Anthropic 的技能系统，无需等待每个代理单独实现。

### 为什么是 CLI 而不是 MCP？

**核心原因**：技能是静态文件，MCP 是动态工具，两者解决不同问题。

| 对比维度 | MCP（Model Context Protocol） | OpenSkills（CLI） |
|--- | --- | ---|
| **适用场景** | 动态工具、实时 API 调用 | 静态指令、文档、脚本 |
| **运行要求** | 需要 MCP 服务器 | 无需服务器（纯文件） |
| **代理支持** | 仅支持 MCP 的代理 | 所有能读 `AGENTS.md` 的代理 |
| **复杂度** | 需要服务器部署 | 零配置 |

**关键点**：

- **技能就是文件**：SKILL.md 是静态指令 + 资源（references/、scripts/、assets/），不需要服务器
- **无需代理支持**：任何能执行 shell 命令的代理都能用
- **符合官方设计**：Anthropic 的技能系统本身就是文件系统设计，不是 MCP 设计

**总结**：MCP 和技能系统解决不同问题。OpenSkills 保持技能的轻量级和通用性，不需要让每个代理都支持 MCP。

---

## 安装与配置类问题

### 安装失败怎么办？

**常见错误和解决方案**：

#### 错误 1：克隆失败

```bash
Error: Git clone failed
```

**可能原因**：
- 网络问题（无法访问 GitHub）
- Git 未安装或版本过旧
- 私有仓库未配置 SSH 密钥

**解决方案**：

1. 检查 Git 是否安装：
   ```bash
   git --version
   # 应该显示：git version 2.x.x
   ```

2. 检查网络连接：
   ```bash
   # 测试是否能访问 GitHub
   ping github.com
   ```

3. 私有仓库需配置 SSH：
   ```bash
   # 测试 SSH 连接
   ssh -T git@github.com
   ```

#### 错误 2：路径不存在

```bash
Error: Path does not exist: ./nonexistent-path
```

**解决方案**：
- 确认本地路径正确
- 使用绝对路径或相对路径：
  ```bash
  # 绝对路径
  npx openskills install /Users/dev/my-skills

  # 相对路径
  npx openskills install ./my-skills
  ```

#### 错误 3：找不到 SKILL.md

```bash
Error: No valid SKILL.md found
```

**解决方案**：

1. 检查技能目录结构：
   ```bash
   ls -la ./my-skill
   # 必须包含 SKILL.md
   ```

2. 确认 SKILL.md 有有效的 YAML frontmatter：
   ```markdown
   ---
   name: my-skill
   description: Skill description
   ---

   # Skill content
   ```

### 技能安装在哪个目录？

**默认安装位置**（项目本地）：
```bash
.claude/skills/
```

**全局安装位置**（使用 `--global`）：
```bash
~/.claude/skills/
```

**Universal 模式**（使用 `--universal`）：
```bash
.agent/skills/
```

**技能查找优先级**（从高到低）：
1. `./.agent/skills/` （项目本地，Universal）
2. `~/.agent/skills/` （全局，Universal）
3. `./.claude/skills/` （项目本地，默认）
4. `~/.claude/skills/` （全局，默认）

**查看已安装技能位置**：
```bash
npx openskills list
# 输出显示 [project] 或 [global] 标签
```

### 如何与 Claude Code Marketplace 共存？

**问题**：既想用 Claude Code，又想用 OpenSkills，如何避免冲突？

**解决方案**：使用 Universal 模式

```bash
# 安装到 .agent/skills/ 而不是 .claude/skills/
npx openskills install anthropics/skills --universal
```

**为什么有效**：

| 目录 | 谁用 | 说明 |
|--- | --- | ---|
| `.claude/skills/` | Claude Code | Claude Code Marketplace 使用 |
| `.agent/skills/` | OpenSkills | 其他代理（Cursor、Windsurf）使用 |

**冲突警告**：

从官方仓库安装时，OpenSkills 会提示：
```
⚠️  Warning: These skills are also available in Claude Code Marketplace.
   Installing to .claude/skills/ may cause conflicts.
   Use --universal to install to .agent/skills/ instead.
```

---

## 使用类问题

### 技能没有出现在 AGENTS.md 中？

**症状**：安装技能后，AGENTS.md 中没有该技能。

**排查步骤**：

#### 1. 确认已同步

安装技能后，需要执行 `sync` 命令：

```bash
npx openskills install anthropics/skills
# 选择技能...

# 必须执行 sync！
npx openskills sync
```

#### 2. 检查 AGENTS.md 位置

```bash
# 默认 AGENTS.md 在项目根目录
cat AGENTS.md
```

如果使用自定义输出路径，确认路径正确：
```bash
npx openskills sync -o custom-path/AGENTS.md
```

#### 3. 检查技能是否被选中

`sync` 命令是交互式的，需要确认你选择了要同步的技能：

```bash
npx openskills sync

? Select skills to sync:
  ◉ pdf                  [已选中]
  ◯ check-branch-first   [未选中]
```

#### 4. 查看 AGENTS.md 内容

确认 XML 标签正确：

```xml
<available_skills>

<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit...</description>
<location>project</location>
</skill>

</available_skills>
```

### 如何更新技能？

**更新所有技能**：
```bash
npx openskills update
```

**更新指定技能**（逗号分隔）：
```bash
npx openskills update pdf,git-workflow
```

**常见问题**：

#### 技能未被更新

**症状**：运行 `update` 后提示 "skipped"

**原因**：技能安装时未记录源信息（旧版本行为）

**解决方案**：
```bash
# 重新安装以记录源
npx openskills install anthropics/skills
```

#### 本地技能无法更新

**症状**：从本地路径安装的技能，update 时报错

**原因**：本地路径技能需要手动更新

**解决方案**：
```bash
# 重新从本地路径安装
npx openskills install ./my-skill
```

### 如何删除技能？

**方法 1：交互式删除**

```bash
npx openskills manage
```

选择要删除的技能，按空格选中，回车确认。

**方法 2：直接删除**

```bash
npx openskills remove <skill-name>
```

**删除后**：记得运行 `sync` 更新 AGENTS.md：
```bash
npx openskills sync
```

**常见问题**：

#### 误删技能

**恢复方法**：
```bash
# 从源重新安装
npx openskills install anthropics/skills
# 选择被误删的技能
```

#### 删除后 AGENTS.md 中仍显示

**解决方案**：重新同步
```bash
npx openskills sync
```

---

## 进阶类问题

### 技能在多项目中如何共享？

**场景**：多个项目都需要用同一套技能，不想重复安装。

**解决方案 1：全局安装**

```bash
# 全局安装一次
npx openskills install anthropics/skills --global

# 所有项目都能使用
cd project-a
npx openskills read pdf

cd project-b
npx openskills read pdf
```

**优点**：
- 一次安装，处处可用
- 减少磁盘占用

**缺点**：
- 技能不在项目中，版本控制不包含

**解决方案 2：符号链接**

```bash
# 1. 全局安装技能
npx openskills install anthropics/skills --global

# 2. 在项目中创建符号链接
cd project-a
ln -s ~/.claude/skills/pdf .claude/skills/pdf

# 3. sync 时会识别为 [project] 位置
npx openskills sync
```

**优点**：
- 技能在项目中（`[project]` 标签）
- 版本控制可以包含符号链接
- 一次安装，多处使用

**缺点**：
- 符号链接在某些系统上需要权限

**解决方案 3：Git Submodule**

```bash
# 在项目中添加技能仓库为 submodule
cd project-a
git submodule add https://github.com/anthropics/skills.git .claude/skills-repo

# 安装 submodule 中的技能
npx openskills install .claude/skills-repo/pdf
```

**优点**：
- 完全版本控制
- 可指定技能版本

**缺点**：
- 配置较复杂

### 符号链接无法访问？

**症状**：

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**按系统解决方案**：

#### macOS

1. 打开"系统偏好设置"
2. 进入"安全性与隐私"
3. 在"完全磁盘访问权限"中，允许你的终端应用

#### Windows

Windows 原生不支持符号链接，推荐：
- **使用 Git Bash**：自带符号链接支持
- **使用 WSL**：Linux 子系统支持符号链接
- **启用开发者模式**：设置 → 更新和安全 → 开发者模式

```bash
# Git Bash 中创建符号链接
ln -s /c/dev/my-skills/my-skill .claude/skills/my-skill
```

#### Linux

检查文件系统权限：

```bash
# 检查目录权限
ls -la .claude/

# 添加写入权限
chmod +w .claude/
```

### 技能找不到？

**症状**：

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**排查步骤**：

#### 1. 确认技能已安装

```bash
npx openskills list
```

#### 2. 检查技能名称大小写

```bash
# ❌ 错误（大写）
npx openskills read My-Skill

# ✅ 正确（小写）
npx openskills read my-skill
```

#### 3. 检查技能被更高优先级的技能覆盖

```bash
# 查看所有技能位置
ls -la .claude/skills/my-skill
ls -la ~/.claude/skills/my-skill
ls -la .agent/skills/my-skill
ls -la ~/.agent/skills/my-skill
```

**技能查找规则**：优先级最高的位置会覆盖其他位置的同名技能。

---

## 本课小结

OpenSkills 常见问题核心要点：

### 核心概念

- ✅ OpenSkills 是通用安装器，Claude Code 是官方代理
- ✅ CLI 比 MCP 更适合技能系统（静态文件）

### 安装配置

- ✅ 技能默认安装到 `.claude/skills/`
- ✅ 使用 `--universal` 避免与 Claude Code 冲突
- ✅ 安装失败通常是网络、Git、路径问题

### 使用技巧

- ✅ 安装后必须 `sync` 才会出现在 AGENTS.md
- ✅ `update` 命令只更新有源信息的技能
- ✅ 删除技能后记得 `sync`

### 进阶场景

- ✅ 多项目共享技能：全局安装、符号链接、Git Submodule
- ✅ 符号链接问题：按系统配置权限
- ✅ 技能找不到：检查名称、查看优先级

## 下一课预告

> 下一课我们学习 **[故障排除](../troubleshooting/)**。
>
> 你会学到：
> - 常见错误的快速诊断和解决方法
> - 路径错误、克隆失败、SKILL.md 无效等问题的处理
> - 权限问题和符号链接故障的排查技巧

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                                   | 行号    |
|--- | --- | ---|
| 安装命令    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts)              | 1-424   |
| 同步命令    | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts)                  | 1-99    |
| 更新命令    | [`src/commands/update.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/update.ts)              | 1-113   |
| 删除命令    | [`src/commands/remove.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/remove.ts)              | 1-30    |
| 技能查找    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts)                    | 1-50    |
| 目录优先级  | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts)                      | 14-25   |
| AGENTS.md 生成 | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts)            | 23-93   |

**关键函数**：
- `findAllSkills()`：查找所有技能（按优先级排序）
- `findSkill(name)`：查找指定技能
- `generateSkillsXml()`：生成 AGENTS.md XML 格式
- `updateSkillFromDir()`：从目录更新技能

</details>
