---
title: "常见问题: 故障诊断 | oh-my-opencode"
sidebarTitle: "常见问题"
subtitle: "常见问题: 故障诊断 | oh-my-opencode"
description: "学习 oh-my-opencode 常见问题的诊断和解决方法。掌握配置诊断、安装问题排查、使用技巧和安全建议。"
order: 150
---

# FAQ and Troubleshooting

This chapter helps you resolve common issues encountered while using oh-my-opencode, from configuration diagnostics to usage tips and security recommendations, enabling you to quickly locate problems and find solutions.

## Learning Path

Follow this sequence to progressively master problem troubleshooting and best practices:

### 1. [Configuration Diagnostics and Troubleshooting](./troubleshooting/)

Learn to use the Doctor command to quickly diagnose and resolve configuration issues.
- Run the Doctor command for a complete health check
- Interpret 17+ check results (installation, configuration, authentication, dependencies, tools, updates)
- Locate and fix common configuration problems
- Use verbose mode and JSON output for advanced diagnostics

### 2. [Frequently Asked Questions](./faq/)

Find and resolve common problems during usage.
- Quick answers for installation and configuration issues
- Usage tips and best practices (ultrawork, proxy calls, background tasks)
- Claude Code compatibility notes
- Security warnings and performance optimization recommendations
- Contribution and help resources

## Prerequisites

Before starting this chapter, ensure:
- You have completed [Quick Installation and Configuration](../start/installation/)
- You are familiar with the basic oh-my-opencode configuration file structure
- You have encountered a specific problem or want to understand best practices

::: tip Recommended Reading Time
After completing the basic installation, we recommend reading through the FAQ first to understand common pitfalls and best practices. When you encounter specific issues, use the troubleshooting tools for diagnosis.
:::

## Quick Troubleshooting Guide

If you encounter an urgent problem, follow these steps for quick troubleshooting:

```bash
# Step 1: Run a complete diagnosis
bunx oh-my-opencode doctor

# Step 2: View detailed error information
bunx oh-my-opencode doctor --verbose

# Step 3: Check a specific category (e.g., authentication)
bunx oh-my-opencode doctor --category authentication

# Step 4: If still unresolved, check the FAQ
# or seek help on GitHub Issues
```

## Next Steps

After completing this chapter, you can continue learning:
- **[Claude Code Compatibility](../appendix/claude-code-compatibility/)** - Learn about complete compatibility support with Claude Code
- **[Configuration Reference](../appendix/configuration-reference/)** - View the complete configuration file Schema and field descriptions
- **[Built-in MCP Servers](../appendix/builtin-mcps/)** - Learn how to use built-in MCP servers
