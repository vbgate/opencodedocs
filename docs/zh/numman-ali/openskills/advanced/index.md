---
title: "高级功能: 多代理与技能开发 | OpenSkills"
sidebarTitle: "多账号与自定义技能"
subtitle: "高级功能: 多代理与技能开发"
description: "学习 OpenSkills 的高级特性，包括多代理环境配置、自定义技能开发、CI/CD 集成和安全机制，高效管理复杂场景。"
order: 3
---

# 高级功能

本章节涵盖 OpenSkills 的进阶用法，包括多代理环境配置、自定义输出、符号链接开发、技能创作、CI/CD 集成和安全机制。掌握这些内容后，你可以在复杂场景下高效管理技能，并创建自己的专属技能库。

::: warning 前置条件
学习本章节前，请确保你已完成：
- [快速开始](../start/quick-start/)：了解基本安装和使用流程
- [安装第一个技能](../start/first-skill/)：掌握技能安装方法
- [同步技能到 AGENTS.md](../start/sync-to-agents/)：理解技能同步机制
:::

## 本章内容

### 多代理与输出配置

| 教程 | 说明 |
|------|------|
| [Universal 模式](./universal-mode/) | 使用 `--universal` 标志在多代理环境中统一管理技能，避免 Claude Code、Cursor、Windsurf 等工具之间的冲突 |
| [自定义输出路径](./custom-output-path/) | 使用 `-o/--output` 标志将技能同步到任意 `.md` 文件，为不同工具配置独立的技能列表 |

### 技能开发

| 教程 | 说明 |
|------|------|
| [符号链接支持](./symlink-support/) | 通过符号链接实现基于 git 的技能更新和本地开发工作流，多项目共享技能 |
| [创建自定义技能](./create-skills/) | 从零开始创建 SKILL.md 技能文件，掌握 YAML frontmatter 和目录结构规范 |
| [技能结构详解](./skill-structure/) | 深入理解 SKILL.md 完整字段规范、references/scripts/assets/ 资源设计和性能优化 |

### 自动化与安全

| 教程 | 说明 |
|------|------|
| [CI/CD 集成](./ci-integration/) | 使用 `-y/--yes` 标志在 GitHub Actions、GitLab CI 等环境中实现非交互式技能安装 |
| [安全性说明](./security/) | 了解路径遍历防护、符号链接安全处理、YAML 解析安全等三层防护机制 |

### 综合指南

| 教程 | 说明 |
|------|------|
| [最佳实践](./best-practices/) | 项目配置、技能管理、团队协作的经验总结，帮助你高效使用 OpenSkills |

## 学习路径建议

根据你的使用场景，选择合适的学习路径：

### 路径 A：多代理用户

如果你同时使用多个 AI 编码工具（Claude Code + Cursor + Windsurf 等）：

```
Universal 模式 → 自定义输出路径 → 最佳实践
```

### 路径 B：技能创作者

如果你想创建自己的技能并分享给团队：

```
创建自定义技能 → 技能结构详解 → 符号链接支持 → 最佳实践
```

### 路径 C：DevOps/自动化

如果你需要在 CI/CD 流程中集成 OpenSkills：

```
CI/CD 集成 → 安全性说明 → 最佳实践
```

### 路径 D：完整学习

如果你想全面掌握所有高级功能，按以下顺序学习：

1. [Universal 模式](./universal-mode/) - 多代理环境基础
2. [自定义输出路径](./custom-output-path/) - 灵活的输出配置
3. [符号链接支持](./symlink-support/) - 高效的开发工作流
4. [创建自定义技能](./create-skills/) - 技能创作入门
5. [技能结构详解](./skill-structure/) - 深入理解技能格式
6. [CI/CD 集成](./ci-integration/) - 自动化部署
7. [安全性说明](./security/) - 安全机制详解
8. [最佳实践](./best-practices/) - 经验总结

## 下一步

完成本章节后，你可以：

- 查阅 [常见问题](../faq/faq/) 解决使用中遇到的问题
- 参考 [CLI API 参考](../appendix/cli-api/) 了解完整的命令行接口
- 阅读 [AGENTS.md 格式规范](../appendix/agents-md-format/) 深入理解生成的文件格式
- 查看 [更新日志](../changelog/changelog/) 了解最新功能和变更
