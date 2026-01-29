---
title: "更新日志: 版本历史 | everything-claude-code"
sidebarTitle: "看看最近更新了什么"
subtitle: "更新日志: 版本历史"
description: "了解 everything-claude-code 的版本历史和重要变更。追踪新功能、安全修复和文档更新，决定是否需要升级。"
tags:
  - "changelog"
  - "updates"
prerequisite: []
order: 250
---

# 更新日志：版本历史与变更

## 学完你能做什么

- 了解每个版本的重要变更
- 追踪新功能和修复
- 决定是否需要升级

## 版本历史

### 2026-01-24 - 安全修复和文档修复

**修复内容**：
- 🔒 **安全修复**：防止 `commandExists()` 中的命令注入漏洞
  - 使用 `spawnSync` 替代 `execSync`
  - 验证输入仅允许字母数字、连字符、下划线、点
- 📝 **文档修复**：添加 `runCommand()` 的安全文档警告
- 🐛 **XSS 扫描器误报修复**：替换 `<script>` 和 `<binary>` 为 `[script-name]` 和 `[binary-name]`
- 📚 **文档修复**：修正 `doc-updater.md` 中的 `npx ts-morph` 为正确的 `npx tsx scripts/codemaps/generate.ts`

**影响**：#42, #43, #51

---

### 2026-01-22 - 跨平台支持和插件化

**新功能**：
- 🌐 **跨平台支持**：所有 hooks 和脚本重写为 Node.js，支持 Windows、macOS 和 Linux
- 📦 **插件打包**：作为 Claude Code 插件分发，支持插件市场安装
- 🎯 **包管理器自动检测**：支持 6 种检测优先级
  - 环境变量 `CLAUDE_PACKAGE_MANAGER`
  - 项目配置 `.claude/package-manager.json`
  - `package.json` 的 `packageManager` 字段
  - Lock 文件检测（package-lock.json, yarn.lock, pnpm-lock.yaml, bun.lockb）
  - 全局配置 `~/.claude/package-manager.json`
  - 降级到第一个可用的包管理器

**修复内容**：
- 🔄 **Hook 加载**：自动按约定加载 hooks，移除 `plugin.json` 中的 hooks 声明
- 📌 **Hook 路径**：使用 `${CLAUDE_PLUGIN_ROOT}` 和相对路径
- 🎨 **UI 改进**：添加 star 历史图表和 badge bar
- 📖 **Hook 组织**：将 session-end hooks 从 Stop 移至 SessionEnd

---

### 2026-01-20 - 功能增强

**新功能**：
- 💾 **Memory Persistence Hooks**：跨会话自动保存和加载上下文
- 🧠 **Strategic Compact Hook**：智能上下文压缩建议
- 📚 **Continuous Learning Skill**：从会话中自动提取可复用模式
- 🎯 **Strategic Compact Skill**：Token 优化策略

---

### 2026-01-17 - 初始发布

**初始功能**：
- ✨ 完整的 Claude Code 配置集合
- 🤖 9 个专业化 agents
- ⚡ 14 个斜杠命令
- 📋 8 套规则集
- 🔄 自动化 hooks
- 🎨 11 个技能库
- 🌐 15+ 个 MCP 服务器预配置
- 📖 完整的 README 文档

---

## 版本命名说明

本项目不使用传统的语义化版本号，而是采用**日期版本**格式（`YYYY-MM-DD`）。

### 版本类型

| 类型 | 说明 | 示例 |
|--- | --- | ---|
| **新功能** | 添加新功能或重大改进 | `feat: add new agent` |
| **修复** | 修复 bug 或问题 | `fix: resolve hook loading issue` |
| **文档** | 文档更新 | `docs: update README` |
| **样式** | 格式化或代码风格 | `style: fix indentation` |
| **重构** | 代码重构 | `refactor: simplify hook logic` |
| **性能** | 性能优化 | `perf: improve context loading` |
| **测试** | 测试相关 | `test: add unit tests` |
| **构建** | 构建系统或依赖 | `build: update package.json` |
| **撤销** | 撤销之前的提交 | `revert: remove version field` |

---

## 如何获取更新

### 插件市场更新

如果你通过插件市场安装了 Everything Claude Code：

1. 打开 Claude Code
2. 运行 `/plugin update everything-claude-code`
3. 等待更新完成

### 手动更新

如果你手动克隆了仓库：

```bash
cd ~/.claude/plugins/everything-claude-code
git pull origin main
```

### 从市场安装

首次安装：

```bash
/plugin marketplace add affaan-m/everything-claude-code
```

---

## 变更影响分析

### 安全修复（必须升级）

- **2026-01-24**：命令注入漏洞修复，强烈建议升级

### 功能增强（可选升级）

- **2026-01-22**：跨平台支持，Windows 用户必须升级
- **2026-01-20**：新功能增强，按需升级

### 文档更新（无需升级）

- 文档更新不影响功能，可手动查看 README

---

## 已知问题

### 当前版本（2026-01-24）

- 无已知严重问题

### 之前版本

- 2026-01-22 之前：Hooks 加载需要手动配置（已在 2026-01-22 修复）
- 2026-01-20 之前：不支持 Windows（已在 2026-01-22 修复）

---

## 贡献与反馈

### 报告问题

如果你发现了 bug 或有功能建议，请：

1. 在 [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues) 搜索是否已有类似问题
2. 如果没有，创建新 Issue，并提供：
   - 版本信息
   - 操作系统
   - 重现步骤
   - 预期行为 vs 实际行为

### 提交 PR

欢迎贡献！请查看 [CONTRIBUTING.md](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md) 了解详情。

---

## 本课小结

- Everything Claude Code 使用日期版本号（`YYYY-MM-DD`）
- 安全修复（如 2026-01-24）必须升级
- 功能增强可按需升级
- 插件市场用户使用 `/plugin update` 更新
- 手动安装用户使用 `git pull` 更新
- 报告问题和提交 PR 请遵循项目指南

## 下一课预告

> 下一课我们学习 **[配置文件详解](../../appendix/config-reference/)**。
>
> 你会学到：
> - `settings.json` 的完整字段说明
> - Hooks 配置的高级选项
> - MCP 服务器配置详解
> - 自定义配置的最佳实践
