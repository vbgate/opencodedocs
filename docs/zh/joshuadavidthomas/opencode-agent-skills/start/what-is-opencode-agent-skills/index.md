---
title: "介绍: OpenCode Agent Skills | opencode-agent-skills"
sidebarTitle: "让 AI 懂你的技能"
subtitle: "介绍: OpenCode Agent Skills"
description: "学习 OpenCode Agent Skills 的核心价值与主要功能。掌握动态技能发现、上下文注入、压缩恢复等特性，支持 Claude Code 兼容和自动推荐。"
tags:
  - "入门指南"
  - "插件介绍"
prerequisite: []
order: 1
---

# 什么是 OpenCode Agent Skills？

## 学完你能做什么

- 了解 OpenCode Agent Skills 插件的核心价值
- 掌握插件提供的主要功能特性
- 理解技能如何自动发现和加载
- 区分本插件与其他技能管理方案的区别

## 你现在的困境

你可能遇到过这些情况：

- **技能分散管理困难**：技能散落在项目、用户目录、插件缓存等多个位置，找不到合适的技能
- **会话越长越麻烦**：长时间会话后，之前加载的技能因上下文压缩而失效
- **兼容性焦虑**：担心从 Claude Code 迁移后，现有的技能和插件无法使用
- **需要重复配置**：每个项目都要重新配置技能，缺乏统一的技能管理机制

这些问题都在影响你使用 AI 助手的效率。

## 核心思路

**OpenCode Agent Skills** 是一个为 OpenCode 提供动态技能发现和管理能力的插件系统。

::: info 什么是技能？
技能（Skill）是包含 AI 工作流程指导的可复用模块。它通常是一个目录，包含 `SKILL.md` 文件（描述技能的功能和使用方法），以及可能的辅助文件（文档、脚本等）。
:::

**核心价值**：通过标准化技能格式（SKILL.md），实现跨项目、跨会话的技能复用。

### 技术架构

插件基于 TypeScript + Bun + Zod 开发，提供 4 个核心工具：

| 工具 | 功能 |
|------|------|
| `use_skill` | 将技能的 SKILL.md 内容注入到会话上下文 |
| `read_skill_file` | 读取技能目录下的支持文件（文档、配置等） |
| `run_skill_script` | 在技能目录上下文中执行可执行脚本 |
| `get_available_skills` | 获取当前可用的技能列表 |

## 主要功能特性

### 1. 动态技能发现

插件会从多个位置自动发现技能，按优先级排序：

```
1. .opencode/skills/              (项目级 - OpenCode)
2. .claude/skills/                (项目级 - Claude Code)
3. ~/.config/opencode/skills/     (用户级 - OpenCode)
4. ~/.claude/skills/              (用户级 - Claude Code)
5. ~/.claude/plugins/cache/        (插件缓存)
6. ~/.claude/plugins/marketplaces/ (已安装插件)
```

**规则**：第一个匹配的技能生效，后续同名技能被忽略。

> 为什么这样设计？
>
> 项目级技能优先于用户级技能，这样你可以在项目中定制特定行为，而不会影响全局配置。

### 2. 上下文注入

当你调用 `use_skill` 时，技能内容以 XML 格式注入到会话上下文：

- `noReply: true` - AI 不会对注入的消息做出响应
- `synthetic: true` - 标记为系统生成的消息（不在 UI 显示，不计入用户输入）

这意味着技能内容会持久存在于会话上下文中，即使会话增长并发生上下文压缩，技能仍然可用。

### 3. 压缩恢复机制

当 OpenCode 执行上下文压缩时（长时间会话常见操作），插件会监听 `session.compacted` 事件，自动重新注入可用技能列表。

这确保了 AI 在长时间会话中始终知道有哪些技能可用，不会因为压缩而丢失技能访问能力。

### 4. Claude Code 兼容

插件完全兼容 Claude Code 的技能和插件系统，支持：

- Claude Code 技能（`.claude/skills/<skill-name>/SKILL.md`）
- Claude 插件缓存（`~/.claude/plugins/cache/...`）
- Claude 插件市场（`~/.claude/plugins/marketplaces/...`）

这意味着如果你之前使用 Claude Code，迁移到 OpenCode 后仍然可以使用现有的技能和插件。

### 5. 自动技能推荐

插件会监控你的消息，使用语义相似度检测是否与某个可用技能相关：

- 计算消息的 embedding 向量
- 与所有技能的描述计算余弦相似度
- 当相似度超过阈值时，注入评估提示建议 AI 加载相关技能

这个过程完全自动，你不需要记住技能名称或显式请求。

### 6. Superpowers 集成（可选）

插件支持 Superpowers 工作流，通过环境变量启用：

```bash
OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true opencode
```

启用后，插件会自动检测 `using-superpowers` 技能，并在会话初始化时注入完整的工作流指导。

## 与其他方案对比

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| **opencode-agent-skills** | 动态发现、压缩恢复、自动推荐 | 需要统一管理和自动推荐的场景 |
| **opencode-skills** | 自动注册为 `skills_{{name}}` 工具 | 需要独立工具调用的场景 |
| **superpowers** | 完整软件开发工作流 | 需要严格流程规范的项目 |
| **skillz** | MCP 服务器模式 | 需要跨工具使用技能的场景 |

选择本插件的理由：

- ✅ **零配置**：自动发现和管理技能
- ✅ **智能推荐**：基于语义匹配自动推荐相关技能
- ✅ **压缩恢复**：长时间会话稳定可靠
- ✅ **兼容性**：无缝迁移 Claude Code 技能

## 本课小结

OpenCode Agent Skills 插件通过动态发现、上下文注入、压缩恢复等核心机制，为 OpenCode 提供了完整的技能管理能力。它的核心价值在于：

- **自动化**：减少手动配置和记忆技能名称的负担
- **稳定性**：长时间会话中技能始终可用
- **兼容性**：与现有 Claude Code 生态无缝集成

## 下一课预告

> 下一课我们学习 **[安装 OpenCode Agent Skills](../installation/)**。
>
> 你会学到：
> - 如何在 OpenCode 配置中添加插件
> - 如何验证插件是否正确安装
> - 本地开发模式的设置方法

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|------|---------|------|
| 插件入口和功能概述 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L1-L12) | 1-12 |
| 核心功能特性列表 | [`README.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/README.md#L5-L11) | 5-11 |
| 技能发现优先级 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L241-L246) | 241-246 |
| 合成消息注入 | [`src/utils.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/utils.ts#L147-L162) | 147-162 |
| 压缩恢复机制 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts#L144-L151) | 144-151 |
| 语义匹配模块 | [`src/embeddings.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/embeddings.ts#L108-L135) | 108-135 |

**关键常量**：
- `EMBEDDING_MODEL = "Xenova/all-MiniLM-L6-v2"`：使用的 embedding 模型
- `SIMILARITY_THRESHOLD = 0.35`：语义相似度阈值
- `TOP_K = 5`：自动推荐返回的技能数量上限

**关键函数**：
- `discoverAllSkills()`：从多个位置发现技能
- `use_skill()`：将技能内容注入到会话上下文
- `matchSkills()`：基于语义相似度匹配相关技能
- `injectSyntheticContent()`：注入合成消息到会话

</details>
