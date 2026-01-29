---
title: "故障排除: 问题诊断 | oh-my-opencode"
sidebarTitle: "遇到问题怎么办"
subtitle: "故障排除: 问题诊断 | oh-my-opencode"
description: "学习 oh-my-opencode 的故障排除方法。通过 Doctor 命令进行 17+ 项配置诊断，快速定位和解决安装、认证、依赖等问题。"
order: 150
---

# 常见问题与故障排除

本章节帮助你解决使用 oh-my-opencode 过程中遇到的常见问题，从配置诊断到使用技巧，再到安全建议，让你能够快速定位问题并找到解决方案。

## 学习路径

按照以下顺序学习，循序渐进掌握问题排查和最佳实践：

### 1. [配置诊断与故障排除](./troubleshooting/)

学习使用 Doctor 命令快速诊断和解决配置问题。
- 运行 Doctor 命令进行完整健康检查
- 解读 17+ 项检查结果（安装、配置、认证、依赖、工具、更新）
- 定位和修复常见配置问题
- 使用详细模式和 JSON 输出进行高级诊断

### 2. [常见问题解答](./faq/)

查找和解决使用过程中的常见问题。
- 安装与配置问题的快速解答
- 使用技巧和最佳实践（ultrawork、代理调用、后台任务）
- Claude Code 兼容性说明
- 安全警告和性能优化建议
- 贡献和帮助资源

## 前置条件

开始学习本章节前，请确保：
- 已完成 [快速安装与配置](../start/installation/)
- 熟悉 oh-my-opencode 的基础配置文件结构
- 遇到了具体的问题或想了解最佳实践

::: tip 推荐阅读时机
建议在完成基础安装后，先通读一遍常见问题解答（FAQ），了解常见陷阱和最佳实践，遇到具体问题时再使用故障排除工具进行诊断。
:::

## 快速排查指南

如果你遇到了紧急问题，可以按以下步骤快速排查：

```bash
# 第 1 步：运行完整诊断
bunx oh-my-opencode doctor

# 第 2 步：查看详细错误信息
bunx oh-my-opencode doctor --verbose

# 第 3 步：检查特定类别（如认证）
bunx oh-my-opencode doctor --category authentication

# 第 4 步：如果还是无法解决，查看常见问题解答
# 或到 GitHub Issues 寻求帮助
```

## 下一步

完成本章节后，你可以继续学习：
- **[Claude Code 兼容性](../appendix/claude-code-compatibility/)** - 了解与 Claude Code 的完整兼容性支持
- **[配置参考](../appendix/configuration-reference/)** - 查看完整的配置文件 Schema 和字段说明
- **[内置 MCP 服务器](../appendix/builtin-mcps/)** - 学习如何使用内置的 MCP 服务器
