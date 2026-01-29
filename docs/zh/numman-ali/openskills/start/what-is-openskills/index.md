---
title: "核心概念: 统一技能生态 | OpenSkills"
sidebarTitle: "让 AI 工具共享技能"
subtitle: "核心概念: 统一技能生态 | OpenSkills"
description: "学习 OpenSkills 的核心概念和工作原理。作为统一技能加载器，支持多代理共享技能，实现渐进式加载。"
tags:
  - "概念介绍"
  - "核心概念"
prerequisite: []
order: 2
---

# 什么是 OpenSkills？

## 学完你能做什么

- 理解 OpenSkills 的核心价值和工作原理
- 知道 OpenSkills 和 Claude Code 的关系
- 判断何时使用 OpenSkills 而不是内置技能系统
- 了解如何让多个 AI 编码代理共享技能生态

::: info 前置知识
本教程假设你了解基本的 AI 编码工具（如 Claude Code、Cursor 等），但不要求你有任何 OpenSkills 使用经验。
:::

---

## 你现在的困境

你可能遇到这些场景：

- **在 Claude Code 用顺手的技能，换了 AI 工具就没了**：比如 Claude Code 里的 PDF 处理技能，到了 Cursor 就用不了
- **不同工具重复安装技能**：每个 AI 工具都要单独配置技能，管理成本高
- **想用私有技能，但官方 Marketplace 不支持**：公司内部或自己开发的技能，无法方便地分享给团队

这些问题本质上都是：**技能格式不统一，无法跨工具共享**。

---

## 核心思路：统一技能格式

OpenSkills 的核心思想很简单：**把 Claude Code 的技能系统变成通用的技能加载器**。

### 它是什么

**OpenSkills** 是 Anthropic 技能系统的通用加载器，让任何 AI 编码代理（Claude Code、Cursor、Windsurf、Aider 等）都能使用标准的 SKILL.md 格式技能。

简单说：**一个安装器，服务所有 AI 编码工具**。

### 它解决了什么问题

| 问题 | 解决方案 |
|------|----------|
| 技能格式不统一 | 使用 Claude Code 的标准 SKILL.md 格式 |
| 技能无法跨工具共享 | 生成统一的 AGENTS.md，所有工具都能读取 |
| 技能管理分散 | 统一的安装、更新、删除命令 |
| 私有技能难分享 | 支持从本地路径和私有 git 仓库安装 |

---

## 核心价值

OpenSkills 提供以下核心价值：

### 1. 统一标准

所有代理使用相同的技能格式和 AGENTS.md 描述，无需学习新格式。

- **与 Claude Code 完全兼容**：相同的提示格式、相同的 Marketplace、相同的文件夹结构
- **标准化的 SKILL.md**：技能定义清晰，易于开发和维护

### 2. 渐进式加载

按需加载技能，保持 AI 上下文精简。

- 不需要一次性加载所有技能
- AI 代理根据任务需求动态加载相关技能
- 避免上下文爆炸，提升响应质量

### 3. 多代理支持

一套技能服务多个代理，无需重复安装。

- Claude Code、Cursor、Windsurf、Aider 共享同一套技能
- 统一的技能管理界面
- 减少配置和维护成本

### 4. 开源友好

支持本地路径和私有 git 仓库，适合团队协作。

- 从本地文件系统安装技能（开发中）
- 从私有 git 仓库安装（公司内部共享）
- 技能可以和项目一起版本管理

### 5. 本地运行

无数据上传，隐私安全。

- 所有技能文件存储在本地
- 不依赖云服务，无数据泄露风险
- 适合敏感项目和企业环境

---

## 工作原理

OpenSkills 的工作流程很简单，分为三步：

### 第一步：安装技能

从 GitHub、本地路径或私有 git 仓库安装技能到你的项目。

```bash
# 从 Anthropic 官方仓库安装
openskills install anthropics/skills

# 从本地路径安装
openskills install ./my-skills
```

技能会被安装到项目的 `.claude/skills/` 目录（默认），或 `.agent/skills/` 目录（使用 `--universal` 时）。

### 第二步：同步到 AGENTS.md

将已安装技能同步到 AGENTS.md 文件，生成 AI 代理可读取的技能列表。

```bash
openskills sync
```

AGENTS.md 会包含类似这样的 XML：

```xml
<available_skills>
<skill>
<name>pdf</name>
<description>Comprehensive PDF manipulation toolkit for extracting text and tables...</description>
<location>project</location>
</skill>
</available_skills>
```

### 第三步：AI 代理加载技能

当 AI 代理需要使用技能时，通过以下命令加载技能内容：

```bash
openskills read <skill-name>
```

AI 代理会将技能内容动态加载到上下文中，执行任务。

---

## 与 Claude Code 的关系

OpenSkills 和 Claude Code 是互补关系，不是替代关系。

### 格式完全兼容

| Aspect | Claude Code | OpenSkills |
|--------|-------------|------------|
| **提示格式** | `<available_skills>` XML | 相同的 XML |
| **技能存储** | `.claude/skills/` | `.claude/skills/` (默认) |
| **技能调用** | `Skill("name")` tool | `npx openskills read <name>` |
| **Marketplace** | Anthropic marketplace | GitHub (anthropics/skills) |
| **渐进式加载** | ✅ | ✅ |

### 使用场景对比

| 场景 | 推荐工具 | 原因 |
|------|----------|------|
| 只用 Claude Code | Claude Code 内置 | 无需额外安装，官方支持 |
| 多个 AI 工具混用 | OpenSkills | 统一管理，避免重复 |
| 需要私有技能 | OpenSkills | 支持本地和私有仓库 |
| 团队协作 | OpenSkills | 技能可版本管理，易于分享 |

---

## 安装位置说明

OpenSkills 支持三种安装位置：

| 安装位置 | 命令 | 适用场景 |
|----------|------|----------|
| **项目本地** | 默认 | 单个项目使用，技能随项目版本管理 |
| **全局安装** | `--global` | 所有项目共享常用技能 |
| **Universal 模式** | `--universal` | 多代理环境，避免与 Claude Code 冲突 |

::: tip 什么时候用 Universal 模式？
如果你同时使用 Claude Code 和其他 AI 编码代理（如 Cursor、Windsurf），使用 `--universal` 安装到 `.agent/skills/`，可以让多个代理共享同一套技能，避免冲突。
:::

---

## 技能生态系统

OpenSkills 使用与 Claude Code 相同的技能生态系统：

### 官方技能库

Anthropic 官方维护的技能仓库：[anthropics/skills](https://github.com/anthropics/skills)

包含常用技能：
- PDF 处理
- 图片生成
- 数据分析
- 等等...

### 社区技能

任何 GitHub 仓库都可以作为技能来源，只需包含 SKILL.md 文件即可。

### 自定义技能

你可以创建自己的技能，使用标准格式，并与团队共享。

---

## 本课小结

OpenSkills 的核心思想是：

1. **统一标准**：使用 Claude Code 的 SKILL.md 格式
2. **多代理支持**：让所有 AI 编码工具共享技能生态
3. **渐进式加载**：按需加载，保持上下文精简
4. **本地运行**：无数据上传，隐私安全
5. **开源友好**：支持本地和私有仓库

通过 OpenSkills，你可以：
- 在不同 AI 工具间无缝切换
- 统一管理所有技能
- 使用和分享私有技能
- 提升开发效率

---

## 下一课预告

> 下一课我们学习 **[安装OpenSkills工具](../installation/)**
>
> 你会学到：
> - 如何检查 Node.js 和 Git 环境
> - 使用 npx 或全局安装 OpenSkills
> - 验证安装是否成功
> - 解决常见的安装问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| 核心类型定义 | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L24) | 1-24 |
| 技能接口（Skill） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L1-L6) | 1-6 |
| 技能位置接口（SkillLocation） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L8-L12) | 8-12 |
| 安装选项接口（InstallOptions） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L14-L18) | 14-18 |
| 技能元数据接口（SkillMetadata） | [`src/types.ts`](https://github.com/numman-ali/openskills/blob/main/src/types.ts#L20-L24) | 20-24 |

**关键接口**：
- `Skill`：已安装的技能信息（name, description, location, path）
- `SkillLocation`：技能查找位置信息（path, baseDir, source）
- `InstallOptions`：安装命令选项（global, universal, yes）
- `SkillMetadata`：技能元数据（name, description, context）

**核心概念来源**：
- README.md:22-86 - "What Is OpenSkills?" 章节

</details>
