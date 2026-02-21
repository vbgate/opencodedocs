---
title: "故障排查 - 常见问题与解决方案 | OpenClaw 教程"
sidebarTitle: "故障排查"
subtitle: "故障排查 - 常见问题与解决方案"
description: "学习 OpenClaw 常见问题的诊断和修复方法，掌握 doctor 命令的使用，了解日志分析和调试技巧。"
tags:
  - "故障排查"
  - "FAQ"
  - "调试"
order: 150
---

# 故障排查 - 常见问题与解决方案

## 学完你能做什么

完成本课程后，你将能够：
- 使用 doctor 命令诊断和修复问题
- 分析日志定位故障原因
- 处理常见配置错误
- 掌握调试技巧和工具

## 核心思路

故障排查是系统管理的关键技能。OpenClaw 提供了多种诊断工具和方法帮助你快速定位和解决问题。

```
┌─────────────────────────────────────────────────────────────┐
│                  故障排查流程                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   发现问题                                                   │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  1. 运行 doctor 诊断                                  │  │
│   │     openclaw doctor                                  │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  2. 检查状态                                          │  │
│   │     openclaw status                                  │  │
│   │     openclaw channels status                         │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  3. 查看日志                                          │  │
│   │     openclaw logs                                    │  │
│   │     openclaw logs --follow                           │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  4. 针对性排查                                        │  │
│   │     - 配置问题 → config validate                     │  │
│   │     - 网络问题 → ping/curl 测试                      │  │
│   │     - 权限问题 → ls -la / check permissions          │  │
│   └─────────────────────────────────────────────────────┘  │
│       │                                                     │
│       ▼                                                     │
│   解决问题 / 寻求帮助                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 诊断工具

### doctor 命令

`openclaw doctor` 是一个全面的诊断工具，可以检测并自动修复许多常见问题。

```bash
# 运行完整诊断
openclaw doctor

# 非交互模式
openclaw doctor --non-interactive

# 生成诊断报告
openclaw doctor --report > diagnosis.txt
```

### 状态检查命令

```bash
# 检查 Gateway 状态
openclaw status

# 检查频道状态
openclaw channels status

# 检查配置
openclaw config validate

# 检查模型连接
openclaw models test
```

### 日志查看

```bash
# 查看 Gateway 日志
openclaw logs gateway

# 实时跟踪日志
openclaw logs --follow

# 查看特定频道日志
openclaw logs --channel whatsapp

# 查看最近 100 行
openclaw logs --lines 100
```

## 常见问题解决

### 1. Gateway 无法启动

**症状**
```
Error: Gateway failed to start
Port 18789 is already in use
```

**排查步骤**

```bash
# 检查端口占用
lsof -i :18789
ss -tlnp | grep 18789

# 终止占用进程
kill -9 $(lsof -t -i:18789)

# 或使用不同端口
openclaw gateway run --port 18790
```

**可能原因和解决**

| 原因 | 症状 | 解决 |
|------|------|------|
| 端口被占用 | `Port already in use` | 终止占用进程或更换端口 |
| 配置错误 | `Invalid config` | 运行 `openclaw doctor` 修复 |
| 权限不足 | `Permission denied` | 检查文件权限，尝试 sudo |
| 依赖缺失 | `Module not found` | 重新安装 `npm install -g openclaw` |

### 2. AI 无响应

**症状**  
发送消息后 AI 没有回复。

**排查步骤**

```bash
# 1. 检查 Gateway 是否运行
openclaw status

# 2. 检查模型配置
openclaw models list
openclaw models test anthropic/claude-3-5-sonnet

# 3. 检查 API Key
openclaw config get models.providers.anthropic.apiKey

# 4. 查看详细日志
openclaw logs --follow
```

**常见原因**

| 原因 | 检查方法 | 解决 |
|------|----------|------|
| Gateway 未启动 | `openclaw status` | 启动 Gateway |
| API Key 无效 | 检查日志错误 | 更新 API Key |
| 模型不可用 | `openclaw models test` | 检查模型 ID 或切换到备用模型 |
| 网络问题 | `curl api.anthropic.com` | 检查网络连接 |

### 3. 频道连接失败

**症状**  
WhatsApp/Telegram 等频道显示未连接。

**WhatsApp 特定问题**

```bash
# 检查 WhatsApp 状态
openclaw channels status whatsapp

# 重新配对
openclaw whatsapp logout
openclaw whatsapp login

# 检查 Baileys 存储
ls -la ~/.openclaw/whatsapp/
```

**Telegram 特定问题**

```bash
# 验证 Bot Token
curl https://api.telegram.org/bot<TOKEN>/getMe

# 检查 WebHook 状态
curl https://api.telegram.org/bot<TOKEN>/getWebhookInfo

# 重置 WebHook
curl -F "url=" https://api.telegram.org/bot<TOKEN>/setWebhook
```

### 4. 配置错误

**症状**  
`Invalid config at ~/.openclaw/openclaw.json`

**修复方法**

```bash
# 自动修复配置
openclaw doctor

# 或者重置配置
mv ~/.openclaw/openclaw.json ~/.openclaw/openclaw.json.bak
openclaw setup

# 手动验证配置
openclaw config validate
```

**常见配置错误**

| 错误类型 | 示例 | 修复 |
|----------|------|------|
| JSON 语法错误 | 缺少逗号/引号 | 使用 doctor 自动修复 |
| 无效值 | `"enabled": "yes"` | 改为 `"enabled": true` |
| 路径错误 | `~` 未展开 | 使用绝对路径或 `${HOME}` |
| 类型错误 | `port: "18789"` | 改为 `port: 18789` |

### 5. 性能问题

**症状**  
响应慢、CPU/内存占用高。

**诊断命令**

```bash
# 查看资源使用
top -p $(pgrep -d',' openclaw)
htop

# 查看 Gateway 统计
openclaw status --stats

# 检查活跃会话
openclaw sessions list

# 清理旧会话
openclaw sessions prune --older-than 7d
```

**优化建议**

| 问题 | 优化方法 |
|------|----------|
| 内存占用高 | 减少 `maxConcurrentRuns`，清理旧会话 |
| 响应慢 | 使用更快的模型，启用缓存 |
| CPU 占用高 | 限制并发，使用 headless 浏览器 |
| 磁盘占用高 | 配置日志轮转，清理媒体文件 |

## 使用 doctor 自动修复

### doctor 诊断模块

`src/commands/doctor.ts` 实现了全面的诊断：

| 模块 | 功能 | 自动修复 |
|------|------|----------|
| 配置检查 | 验证 openclaw.json | ✅ |
| 认证检查 | 验证 API Key 和 Token | ✅ |
| 遗留状态迁移 | 迁移旧版本数据 | ✅ |
| 沙箱检查 | 验证 Docker 沙箱 | ✅ |
| Gateway 服务 | 检查服务配置 | ✅ |
| 平台特定 | macOS LaunchAgent 等 | ✅ |

### 运行诊断示例

```bash
$ openclaw doctor

✔ OpenClaw doctor
│
├─ Gateway
│  ├─ ✅ Config valid
│  ├─ ⚠️  Token auth recommended
│  └─ ✅ Service configured
│
├─ Channels
│  ├─ ✅ WhatsApp connected
│  ├─ ✅ Telegram connected
│  └─ ⚠️  Discord not configured
│
├─ Models
│  ├─ ✅ Anthropic API reachable
│  └─ ✅ Default model available
│
└─ Fixes Applied
   └─ Generated gateway token automatically
```

## 日志分析技巧

### 日志级别

```bash
# 设置日志级别
export OPENCLAW_LOG_LEVEL=debug

# 可用级别: error, warn, info, debug, trace
```

### 常见日志模式

```
# 连接成功
[INFO] gateway: server started on port 18789

# 认证失败
[WARN] auth: invalid token from 192.168.1.100

# 模型调用
[DEBUG] agent: calling model anthropic/claude-3-5-sonnet
[INFO] agent: response received in 2345ms

# 错误
[ERROR] channels.whatsapp: connection lost, reconnecting...
```

### 日志过滤

```bash
# 只看错误
openclaw logs | grep ERROR

# 跟踪特定频道
openclaw logs --channel whatsapp --follow

# 按时间范围
openclaw logs --since "2024-02-14 09:00" --until "2024-02-14 10:00"
```

## 获取帮助

### 命令帮助

```bash
# 查看命令帮助
openclaw --help
openclaw doctor --help
openclaw config --help

# 查看子命令帮助
openclaw channels --help
```

### 社区支持

- **GitHub Issues**: https://github.com/openclaw/openclaw/issues
- **Discord 社区**: https://discord.gg/openclaw
- **文档网站**: https://docs.openclaw.ai

### 报告问题

报告问题时请包含：

1. OpenClaw 版本: `openclaw --version`
2. 操作系统和版本
3. 问题复现步骤
4. 相关日志片段
5. 已尝试的解决方法

## 本课小结

在本课程中，你学习了：

- ✅ 系统化的故障排查流程
- ✅ 使用 doctor 命令自动诊断和修复
- ✅ 常见问题的诊断和解决方法
- ✅ 日志分析技巧
- ✅ 性能问题的优化方法
- ✅ 获取帮助的渠道

## 下一课预告

> 下一课我们学习 **[安全指南](../security-guide/)**。
>
> 你会学到：
> - 安全模型和最佳实践
> - DM 配对机制
> - 沙箱执行和访问控制

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Doctor 主命令 | [`src/commands/doctor.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor.ts) | 65-300 |
| Doctor 认证模块 | [`src/commands/doctor-auth.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-auth.ts) | - |
| Doctor 配置流程 | [`src/commands/doctor-config-flow.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-config-flow.ts) | - |
| Doctor 沙箱模块 | [`src/commands/doctor-sandbox.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-sandbox.ts) | - |
| 状态命令 | [`src/commands/status.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/status.ts) | - |
| Gateway 健康检查 | [`src/commands/doctor-gateway-health.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/doctor-gateway-health.ts) | - |

**诊断类型**：
- 配置验证
- 认证健康
- 遗留状态迁移
- 沙箱完整性
- 服务配置
- 平台特定检查

</details>
