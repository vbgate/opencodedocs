---
title: "进阶配置: 高级功能详解 | Antigravity-Manager"
order: 300
sidebarTitle: "把系统升级到生产级"
subtitle: "进阶配置: 高级功能详解"
description: "学习 Antigravity-Manager 的进阶配置方法。掌握账号调度、模型路由、配额治理和监控统计等高级功能。"
---

# 进阶配置

本章节深入讲解 Antigravity Tools 的高级功能：配置管理、安全策略、账号调度、模型路由、配额治理、监控统计，以及服务器部署方案。掌握这些内容后，你可以把 Antigravity Tools 从"能用"升级到"好用、稳定、可运维"。

## 本章包含

| 教程 | 说明 |
|-----|------|
| [配置全解](./config/) | AppConfig/ProxyConfig 的完整字段、落盘位置与热更新语义 |
| [安全与隐私](./security/) | `auth_mode`、`allow_lan_access` 与安全基线设计 |
| [高可用调度](./scheduling/) | 轮换、固定账号、粘性会话与失败重试机制 |
| [模型路由](./model-router/) | 自定义映射、通配符优先级与预设策略 |
| [配额治理](./quota/) | Quota Protection + Smart Warmup 的组合打法 |
| [Proxy Monitor](./monitoring/) | 请求日志、筛选、详情还原与导出 |
| [Token Stats](./token-stats/) | 成本视角的统计口径与图表解读 |
| [长会话稳定性](./context-compression/) | 上下文压缩、签名缓存与工具结果压缩 |
| [系统能力](./system/) | 多语言/主题/更新/开机自启/HTTP API Server |
| [服务器部署](./deployment/) | Docker noVNC vs Headless Xvfb 选型与运维 |

## 学习路径建议

::: tip 推荐顺序
本章内容较多，建议按以下模块分批学习：
:::

**第一阶段：配置与安全（必学）**

```
配置全解 → 安全与隐私
config      security
```

先了解配置体系（哪些需要重启、哪些热更新），再学安全设置（尤其是暴露到局域网/公网时）。

**第二阶段：调度与路由（推荐）**

```
高可用调度 → 模型路由
scheduling    model-router
```

学会用最小账号数获得最大稳定性，再用模型路由屏蔽上游变化。

**第三阶段：配额与监控（按需）**

```
配额治理 → Proxy Monitor → Token Stats
quota        monitoring      token-stats
```

防止配额无感耗尽，把调用黑盒变成可观测系统，量化成本优化。

**第四阶段：稳定性与部署（进阶）**

```
长会话稳定性 → 系统能力 → 服务器部署
context-compression  system    deployment
```

解决长会话的隐性问题，让客户端更像产品，最后学服务器部署。

**快速选择**：

| 你的场景 | 推荐先看 |
|---------|---------|
| 多账号轮换不稳定 | [高可用调度](./scheduling/) |
| 想固定某个模型名 | [模型路由](./model-router/) |
| 配额总是用完 | [配额治理](./quota/) |
| 想看请求日志 | [Proxy Monitor](./monitoring/) |
| 想统计 Token 消耗 | [Token Stats](./token-stats/) |
| 长对话经常出错 | [长会话稳定性](./context-compression/) |
| 要暴露到局域网 | [安全与隐私](./security/) |
| 要部署到服务器 | [服务器部署](./deployment/) |

## 前置条件

::: warning 开始前请确认
- 已完成 [快速开始](../start/) 章节（至少完成安装、添加账号、启动反代）
- 已完成 [平台与集成](../platforms/) 中至少一个协议的接入（如 OpenAI 或 Anthropic）
- 本地反代已能正常响应请求
:::

## 下一步

学完本章节后，你可以继续学习：

- [常见问题](../faq/)：遇到 401/404/429/流式中断等问题时的排查指南
- [附录](../appendix/)：端点速查表、数据模型、z.ai 能力边界等参考资料
