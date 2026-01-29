---
title: "版本历史: 功能演进 | opencode-agent-skills"
sidebarTitle: "新版本干了啥"
subtitle: "版本历史"
description: "学习 OpenCode Agent Skills 插件的版本演进历史。本教程整理了从 v0.1.0 到 v0.6.4 的所有主要功能更新、Bug 修复、架构改进和重大变更说明。"
tags:
  - "版本更新"
  - "changelog"
  - "发布历史"
order: 3
---

# 版本历史

本文档记录了 OpenCode Agent Skills 插件的所有版本更新。通过版本历史，你可以了解功能的演进路径、修复的问题以及架构改进。

::: tip 当前版本
最新稳定版本是 **v0.6.4** (2026-01-20)
:::

## 版本时间线

| 版本   | 发布日期   | 类型   | 主要内容 |
|--- | --- | --- | ---|
| 0.6.4 | 2026-01-20 | 修复   | YAML 解析、Claude v2 支持 |
| 0.6.3 | 2025-12-16 | 改进   | 优化技能推荐提示 |
| 0.6.2 | 2025-12-15 | 修复   | 技能名称与目录名分离 |
| 0.6.1 | 2025-12-13 | 改进   | 避免重复推荐已加载技能 |
| 0.6.0 | 2025-12-12 | 新功能 | 语义匹配、embedding 预计算 |
| 0.5.0 | 2025-12-11 | 改进   | 模糊匹配建议、重构 |
| 0.4.1 | 2025-12-08 | 改进   | 简化安装方式 |
| 0.4.0 | 2025-12-05 | 改进   | 脚本递归搜索 |
| 0.3.3 | 2025-12-02 | 修复   | 符号链接处理 |
| 0.3.2 | 2025-11-30 | 修复   | 保留代理模式 |
| 0.3.1 | 2025-11-28 | 修复   | 模型切换问题 |
| 0.3.0 | 2025-11-27 | 新功能 | 文件列表功能 |
| 0.2.0 | 2025-11-26 | 新功能 | Superpowers 模式 |
| 0.1.0 | 2025-11-26 | 初始   | 4 个工具、多位置发现 |

## 详细变更记录

### v0.6.4 (2026-01-20)

**修复**：
- 修复了技能多行描述的 YAML frontmatter 解析（支持 `|` 和 `>` 块标量语法），通过用 `yaml` 库替换自定义解析器
- 新增对 Claude 插件 v2 格式的支持，`installed_plugins.json` 现在使用插件安装数组而非单个对象

**改进**：
- Claude Code 插件缓存发现现在支持新的嵌套目录结构（`cache/<marketplace>/<plugin>/<version>/skills/`）

### v0.6.3 (2025-12-16)

**改进**：
- 优化了技能评估提示，防止模型向用户发送"无需技能"类消息（用户看不到隐藏的评估提示）

### v0.6.2 (2025-12-15)

**修复**：
- 技能验证现在允许目录名与 SKILL.md frontmatter 中的 `name` 不同。frontmatter 中的 `name` 是标准标识符，目录名仅用于组织。这符合 Anthropic Agent Skills 规范。

### v0.6.1 (2025-12-13)

**改进**：
- 动态技能推荐现在会跟踪每个会话已加载的技能，避免重复推荐已加载技能，减少冗余提示和上下文使用

### v0.6.0 (2025-12-12)

**新增**：
- **语义技能匹配**：在初始技能列表注入后，后续消息会使用本地 embedding 与技能描述进行匹配
- 新增 `@huggingface/transformers` 依赖用于本地 embedding 生成（量化版 all-MiniLM-L6-v2）
- 当消息匹配可用技能时，注入 3 步评估提示（EVALUATE → DECIDE → ACTIVATE），鼓励加载技能（灵感来自 [@spences10](https://github.com/spences10) 的[博客文章](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably)）
- 磁盘缓存 embedding 以实现低延迟匹配（~/.cache/opencode-agent-skills/）
- 在 `session.deleted` 事件上清理会话

### v0.5.0 (2025-12-11)

**新增**：
- 在所有工具（`use_skill`、`read_skill_file`、`run_skill_script`、`get_available_skills`）中添加"你是否指..."模糊匹配建议

**改进**：
- **破坏性变更**：将 `find_skills` 工具重命名为 `get_available_skills`，意图更明确
- **内部**：将代码库重组为独立模块（`claude.ts`、`skills.ts`、`tools.ts`、`utils.ts`、`superpowers.ts`），提高可维护性
- **内部**：通过删除 AI 生成的注释和不必要的代码，提高代码质量

### v0.4.1 (2025-12-08)

**改进**：
- 安装方式现在通过 OpenCode config 使用 npm 包，而非 git clone + 符号链接

**移除**：
- 移除了 `INSTALL.md`（简化安装后不再需要）

### v0.4.0 (2025-12-05)

**改进**：
- 脚本发现现在递归搜索整个技能目录（最大深度 10），而非仅根目录和 `scripts/` 子目录
- 脚本现在通过相对路径（如 `tools/build.sh`）而非基本名称识别
- 在 `read_skill_file`、`run_skill_script` 和 `use_skill` 工具中将 `skill_name` 参数重命名为 `skill`
- 在 `run_skill_script` 工具中将 `script_name` 参数重命名为 `script`

### v0.3.3 (2025-12-02)

**修复**：
- 通过使用 `fs.stat` 修复了文件和目录检测以正确处理符号链接

### v0.3.2 (2025-11-30)

**修复**：
- 在会话开始时注入合成消息时保留代理模式

### v0.3.1 (2025-11-28)

**修复**：
- 通过在 `noReply` 操作中显式传递当前模型，修复了使用技能工具时的意外模型切换（针对 opencode issue #4475 的临时方案）

### v0.3.0 (2025-11-27)

**新增**：
- 在 `use_skill` 输出中添加文件列表

### v0.2.0 (2025-11-26)

**新增**：
- 新增 Superpowers 模式支持
- 新增发布证明

### v0.1.0 (2025-11-26)

**新增**：
- 新增 `use_skill` 工具，将技能内容加载到上下文
- 新增 `read_skill_file` 工具，读取技能目录中的支持文件
- 新增 `run_skill_script` 工具，从技能目录执行脚本
- 新增 `find_skills` 工具，搜索并列出可用技能
- 新增多位置技能发现（项目级、用户级和 Claude 兼容位置）
- 新增符合 Anthropic Agent Skills Spec v1.0 的 frontmatter 验证
- 新增会话开始和上下文压缩后的自动技能列表注入

**新贡献者**：
- Josh Thomas <josh@joshthomas.dev> (维护者)

## 功能演进概览

| 功能           | 引入版本 | 演进路径 |
|--- | --- | ---|
| 4 个基础工具   | v0.1.0   | v0.5.0 添加模糊匹配 |
| 多位置技能发现 | v0.1.0   | v0.4.1 简化安装、v0.6.4 支持 Claude v2 |
| 上下文自动注入 | v0.1.0   | v0.3.0 添加文件列表、v0.6.1 避免重复推荐 |
| Superpowers 模式 | v0.2.0   | 持续稳定 |
| 脚本递归搜索   | v0.4.0   | v0.3.3 修复符号链接 |
| 语义匹配推荐   | v0.6.0   | v0.6.1 避免重复、v0.6.3 优化提示 |
| 模糊匹配建议   | v0.5.0   | 持续稳定 |

## 重大变更说明

### v0.6.0：语义匹配功能

引入了基于本地 embedding 的语义匹配能力，让 AI 能够根据用户消息内容自动推荐相关技能，无需用户手动记忆技能名称。

- **技术细节**：使用 HuggingFace 的 `all-MiniLM-L6-v2` 模型（q8 量化）
- **缓存机制**：embedding 结果缓存到 `~/.cache/opencode-agent-skills/`，提升后续匹配速度
- **匹配流程**：用户消息 → embedding → 与技能描述计算余弦相似度 → Top 5 推荐（阈值 0.35）

### v0.5.0：重构与工具重命名

代码架构重构为模块化设计，工具命名更加清晰：

- `find_skills` → `get_available_skills`
- `skill_name` → `skill`
- `script_name` → `script`

### v0.4.0：脚本发现机制升级

脚本发现从"仅根目录 + scripts/"升级为"递归搜索整个技能目录"（最大深度 10），支持更灵活的脚本组织方式。

### v0.2.0：Superpowers 集成

新增对 Superpowers 工作流模式的支持，需要安装 `using-superpowers` 技能并设置环境变量 `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| 当前版本号  | [`package.json`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L3-L3)         | 3       |
| 版本历史    | [`CHANGELOG.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/CHANGELOG.md#L19-L152) | 19-152  |

**关键版本信息**：
- `v0.6.4`：当前版本 (2026-01-20)
- `v0.6.0`：语义匹配引入 (2025-12-12)
- `v0.5.0`：重构版本 (2025-12-11)
- `v0.1.0`：初始版本 (2025-11-26)

</details>
