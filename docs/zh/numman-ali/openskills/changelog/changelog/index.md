---
title: "版本日志: 功能更新 | OpenSkills"
sidebarTitle: "看看新功能"
subtitle: "版本日志: 功能更新 | OpenSkills"
description: "查看 OpenSkills 版本变更历史，了解 update 命令、符号链接、私有仓库等新功能，以及路径遍历防护等重要改进和问题修复。"
tags:
  - "changelog"
  - "version history"
order: 1
---

# 更新日志

本页面记录 OpenSkills 的版本变更历史，帮助你了解每个版本的新功能、改进和问题修复。

---

## [1.5.0] - 2026-01-17

### 新增功能

- **`openskills update`** - 从记录的来源刷新已安装技能（默认：全部刷新）
- **源元数据跟踪** - 安装时现在记录来源信息，用于可靠地更新技能

### 改进

- **多技能读取** - `openskills read` 命令现在支持逗号分隔的技能名列表
- **生成使用说明** - 优化了 shell 环境下的 read 命令调用提示
- **README** - 添加了更新指南和人工使用提示

### 问题修复

- **更新体验优化** - 跳过没有源元数据的技能，并列出这些技能提示重新安装

---

## [1.4.0] - 2026-01-17

### 改进

- **README** - 明确项目本地默认安装方式，移除冗余的 sync 提示
- **安装消息** - 安装器现在明确区分项目本地默认安装与 `--global` 选项

---

## [1.3.2] - 2026-01-17

### 改进

- **文档与 AGENTS.md 指引** - 所有命令示例和生成的使用说明统一使用 `npx openskills`

---

## [1.3.1] - 2026-01-17

### 问题修复

- **Windows 安装** - 修复了 Windows 系统上的路径验证问题（"Security error: Installation path outside target directory"）
- **CLI 版本** - `npx openskills --version` 现在正确读取 package.json 中的版本号
- **根目录 SKILL.md** - 修复了 SKILL.md 在仓库根目录的单技能仓库安装问题

---

## [1.3.0] - 2025-12-14

### 新增功能

- **符号链接支持** - 技能现在可以通过符号链接安装到技能目录 ([#3](https://github.com/numman-ali/openskills/issues/3))
  - 支持通过从克隆仓库创建符号链接来实现基于 git 的技能更新
  - 支持本地技能开发工作流
  - 损坏的符号链接会被优雅地跳过

- **可配置输出路径** - sync 命令新增 `--output` / `-o` 选项 ([#5](https://github.com/numman-ali/openskills/issues/5))
  - 可同步到任意 `.md` 文件（如 `.ruler/AGENTS.md`）
  - 如果文件不存在，自动创建文件并添加标题
  - 如果需要，自动创建嵌套目录

- **本地路径安装** - 支持从本地目录安装技能 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - 支持绝对路径（`/path/to/skill`）
  - 支持相对路径（`./skill`、`../skill`）
  - 支持波浪号扩展（`~/my-skills/skill`）

- **私有 git 仓库支持** - 支持从私有仓库安装技能 ([#10](https://github.com/numman-ali/openskills/issues/10))
  - SSH URLs（`git@github.com:org/private-skills.git`）
  - 带认证的 HTTPS URLs
  - 自动使用系统 SSH 密钥

- **全面的测试套件** - 跨 6 个测试文件的 88 个测试
  - 符号链接检测、YAML 解析的单元测试
  - install、sync 命令的集成测试
  - 完整 CLI 工作流的端到端测试

### 改进

- **`--yes` 标志现在跳过所有提示** - 完全非交互模式，适用于 CI/CD ([#6](https://github.com/numman-ali/openskills/issues/6))
  - 覆盖现有技能时不提示
  - 跳过提示时显示 `Overwriting: <skill-name>` 消息
  - 所有命令现在都可以在无头环境中运行

- **CI 工作流重排** - 构建步骤现在在测试之前运行
  - 确保 `dist/cli.js` 存在，用于端到端测试

### 安全性

- **路径遍历防护** - 验证安装路径保持在目标目录内
- **符号链接解引用** - `cpSync` 使用 `dereference: true` 安全地复制符号链接目标
- **非贪婪 YAML 正则** - 防止 frontmatter 解析中潜在的 ReDoS 攻击

---

## [1.2.1] - 2025-10-27

### 问题修复

- README 文档清理 - 移除了重复部分和错误的标志

---

## [1.2.0] - 2025-10-27

### 新增功能

- `--universal` 标志，将技能安装到 `.agent/skills/` 而非 `.claude/skills/`
  - 适用于多代理环境（Claude Code + Cursor/Windsurf/Aider）
  - 避免与 Claude Code 原生市场插件冲突

### 改进

- 项目本地安装现在是默认选项（之前是全局安装）
- 技能默认安装到 `./.claude/skills/`

---

## [1.1.0] - 2025-10-27

### 新增功能

- 全面的单页 README，包含技术深度解析
- 与 Claude Code 的并列对比

### 问题修复

- 位置标签现在根据安装位置正确显示 `project` 或 `global`

---

## [1.0.0] - 2025-10-26

### 新增功能

- 初始发布
- `npx openskills install <source>` - 从 GitHub 仓库安装技能
- `npx openskills sync` - 为 AGENTS.md 生成 `<available_skills>` XML
- `npx openskills list` - 显示已安装的技能
- `npx openskills read <name>` - 为代理加载技能内容
- `npx openskills manage` - 交互式技能删除
- `npx openskills remove <name>` - 删除指定技能
- 所有命令的交互式 TUI 界面
- 支持 Anthropic 的 SKILL.md 格式
- 渐进式披露（按需加载技能）
- 打包资源支持（references/、scripts/、assets/）

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能           | 文件路径                                                                      |
|--- | ---|
| 更新日志原文   | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
