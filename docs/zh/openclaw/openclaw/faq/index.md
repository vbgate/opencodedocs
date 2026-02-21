---
title: "常见问题 | OpenClaw"
sidebarTitle: "常见问题"
subtitle: "常见问题"
description: "OpenClaw 故障排查、安全指南和 CLI 命令参考，解决常见问题，保护你的 AI 助手安全。"
order: 150
---

# 常见问题

本章节提供故障排查指南、安全最佳实践和完整的 CLI 命令参考。

## 内容概览

### 故障排查
诊断和解决 OpenClaw 使用中的常见问题，包括：
- Gateway 启动问题
- 频道连接失败
- 模型调用错误
- 配置验证

### 安全指南
保护你的 AI 助手和数据安全：
- 认证和授权配置
- DM 配对机制
- 沙箱执行
- 访问控制

### 命令参考
完整的 CLI 命令手册，快速查找命令用法。

## 子页面导航

| 页面 | 内容 | 类型 |
|------|------|------|
| [故障排查](./troubleshooting/) | 问题诊断与修复 | 指南 |
| [安全指南](./security-guide/) | 安全最佳实践 | 指南 |
| [CLI 命令参考](./commands-reference/) | 完整命令手册 | 参考 |

## 快速帮助

### 遇到问题？

1. **先运行诊断**
   ```bash
   openclaw doctor
   ```

2. **查看状态**
   ```bash
   openclaw status
   ```

3. **检查日志**
   ```bash
   openclaw logs --follow
   ```

### 常用命令速查

| 命令 | 用途 |
|------|------|
| `openclaw doctor` | 运行系统诊断 |
| `openclaw status` | 查看系统状态 |
| `openclaw logs` | 查看日志 |
| `openclaw config validate` | 验证配置 |
| `openclaw --help` | 查看帮助 |

---

*遇到问题？先查看 [故障排查](./troubleshooting/) 章节！*
