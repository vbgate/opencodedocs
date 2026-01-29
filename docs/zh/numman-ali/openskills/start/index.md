---
title: "快速开始: 快速上手使用 OpenSkills | OpenSkills"
sidebarTitle: "15 分钟上手"
subtitle: "快速开始: 快速上手使用 OpenSkills | OpenSkills"
description: "学习 OpenSkills 快速入门方法。15 分钟内完成工具和技能安装，使 AI 代理能够使用新技能并理解其工作原理。"
order: 1
---

# 快速开始

本章节帮助你快速上手 OpenSkills，从安装工具到让 AI 代理使用技能，只需 10-15 分钟。

## 学习路径

建议按以下顺序学习：

### 1. [快速开始](./quick-start/)

5 分钟内完成工具安装、技能安装和同步，体验 OpenSkills 的核心价值。

- 安装 OpenSkills 工具
- 从 Anthropic 官方仓库安装技能
- 同步技能到 AGENTS.md
- 验证 AI 代理可以使用技能

### 2. [什么是 OpenSkills？](./what-is-openskills/)

理解 OpenSkills 的核心概念和工作原理。

- OpenSkills 与 Claude Code 的关系
- 统一技能格式、渐进式加载、多代理支持
- 何时使用 OpenSkills 而不是内置技能系统

### 3. [安装指南](./installation/)

详细的安装步骤和环境配置。

- Node.js 和 Git 环境检查
- npx 临时使用 vs 全局安装
- 常见安装问题排查

### 4. [安装第一个技能](./first-skill/)

从 Anthropic 官方仓库安装技能，体验交互式选择。

- 使用 `openskills install` 命令
- 交互式选择需要的技能
- 理解技能目录结构（.claude/skills/）

### 5. [同步技能到 AGENTS.md](./sync-to-agents/)

生成 AGENTS.md 文件，让 AI 代理知道可用技能。

- 使用 `openskills sync` 命令
- 理解 AGENTS.md 的 XML 格式
- 选择要同步的技能，控制上下文大小

### 6. [使用技能](./read-skills/)

了解 AI 代理如何加载技能内容。

- 使用 `openskills read` 命令
- 技能查找的 4 级优先级顺序
- 一次读取多个技能

## 前置条件

开始学习前，请确认：

- 已安装 [Node.js](https://nodejs.org/) 20.6.0 或更高版本
- 已安装 [Git](https://git-scm.com/)（用于从 GitHub 安装技能）
- 已安装至少一个 AI 编码代理（Claude Code、Cursor、Windsurf、Aider 等）

::: tip 快速检查环境
```bash
node -v  # 应显示 v20.6.0 或更高
git -v   # 应显示 git version x.x.x
```
:::

## 下一步

完成本章节后，可以继续学习：

- [命令详解](../platforms/cli-commands/)：深入了解所有命令和参数
- [安装来源详解](../platforms/install-sources/)：学习从 GitHub、本地路径、私有仓库安装技能
- [创建自定义技能](../advanced/create-skills/)：打造属于你自己的技能
