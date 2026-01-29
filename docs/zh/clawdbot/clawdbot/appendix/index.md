---
title: "附录 | Clawdbot 教程"
sidebarTitle: "配置、部署、开发实战"
subtitle: "附录"
description: "Clawdbot 附录章节：完整配置参考、Gateway WebSocket API 协议、部署选项和开发指南。"
tags: []
order: 340
---

# 附录

本章节提供了 Clawdbot 的高级参考文档和开发资源，包括完整的配置参考、Gateway WebSocket API 协议规范、部署选项和开发指南。

::: info 适用场景
本章节适合需要深入了解 Clawdbot 内部机制、进行高级配置、部署或参与开发的用户。如果你刚开始使用，建议先完成 [快速开始](../../start/getting-started/) 章节。
:::

## 子页面导航

### [完整配置参考](./config-reference/)
**详细配置文件参考** - 涵盖所有配置项、默认值和示例。查找 Gateway、Agent、渠道、工具等模块的完整配置说明。

### [Gateway WebSocket API 协议](./api-protocol/)
**协议规范文档** - Gateway WebSocket 协议的完整规范，包括端点定义、消息格式、认证方式和事件订阅机制。适合需要自定义客户端或集成 Gateway 的开发者。

### [部署选项](./deployment/)
**部署方式指南** - 不同平台的部署方式：本地安装、Docker、VPS、Fly.io、Nix 等。了解如何在各种环境中运行 Clawdbot。

### [开发指南](./development/)
**开发者文档** - 从源码构建、插件开发、测试和贡献流程。学习如何参与 Clawdbot 项目开发，或编写自定义插件。

## 学习路径建议

根据你的需求，选择适合的学习路径：

### 配置与运维人员
1. 先阅读 [完整配置参考](./config-reference/) - 了解所有可配置项
2. 参考 [部署选项](./deployment/) - 选择合适的部署方案
3. 根据需要查阅 Gateway WebSocket API 文档进行集成

### 应用开发者
1. 阅读 [Gateway WebSocket API 协议](./api-protocol/) - 理解协议机制
2. 查看 [完整配置参考](./config-reference/) - 了解如何配置相关功能
3. 参考协议示例构建客户端

### 插件/功能开发者
1. 阅读 [开发指南](./development/) - 了解开发环境和构建流程
2. 深入 [Gateway WebSocket API 协议](./api-protocol/) - 理解 Gateway 架构
3. 参考 [完整配置参考](./config-reference/) - 了解配置系统

## 前置条件

::: warning 前置知识
在深入本章节之前，建议你已完成以下内容：
- ✅ 完成了 [快速开始](../../start/getting-started/)
- ✅ 配置了至少一个渠道（如 [WhatsApp](../../platforms/whatsapp/) 或 [Telegram](../../platforms/telegram/)）
- ✅ 了解了基础的 AI 模型配置（参见 [AI 模型与认证](../../advanced/models-auth/)）
- ✅ 对 JSON 配置文件和 TypeScript 有基本了解
:::

## 下一步指引

完成本章节学习后，你可以：

- **进行高级配置** - 参考 [完整配置参考](./config-reference/) 定制你的 Clawdbot
- **部署到生产环境** - 按照 [部署选项](./deployment/) 选择适合的部署方案
- **开发自定义功能** - 参考 [开发指南](./development/) 编写插件或贡献代码
- **深入学习其他功能** - 探索 [进阶功能](../../advanced/) 章节，如会话管理、工具系统等

::: tip 寻找帮助
如果你在使用过程中遇到问题，可以查阅 [故障排除](../../faq/troubleshooting/) 获取常见问题的解决方案。
:::
