---
title: "附录: 技术参考资料 | Antigravity Auth"
sidebarTitle: "彻底搞懂插件原理"
subtitle: "附录: 架构、API 与配置技术参考"
description: "了解 Antigravity Auth 插件的技术参考资料，包括架构设计、API 规范、存储格式和完整配置选项，深入理解插件内部机制。"
order: 5
---

# 附录

本章节提供 Antigravity Auth 插件的技术参考资料，包括架构设计、API 规范、存储格式和完整配置手册，帮助你深入理解插件内部机制。

## 学习路径

### 1. [架构概览](./architecture-overview/)

了解插件的模块结构和请求处理流程。

- 模块分层设计和职责划分
- 请求从 OpenCode 到 Antigravity API 的完整链路
- 多账户负载均衡和会话恢复机制

### 2. [API 规范](./api-spec/)

深入了解 Antigravity API 的技术细节。

- 统一网关接口和端点配置
- 请求/响应格式和 JSON Schema 限制
- Thinking 模型配置和函数调用规则

### 3. [存储格式](./storage-schema/)

了解账户存储文件的结构和版本管理。

- 存储文件位置和各字段含义
- v1/v2/v3 版本演进和自动迁移
- 跨机器迁移账户配置的方法

### 4. [完整配置选项](./all-config-options/)

所有配置选项的完整参考手册。

- 30+ 配置项的默认值和适用场景
- 环境变量覆盖配置的方法
- 不同使用场景的最佳配置组合

## 前置条件

::: warning 建议先完成
本章节内容偏向技术深度，建议先完成以下学习：

- [快速安装](../start/quick-install/) - 完成插件安装和首次认证
- [配置指南](../advanced/configuration-guide/) - 了解常用配置方法
:::

## 下一步

完成附录学习后，你可以：

- 查看 [常见问题](../faq/) 解决使用中遇到的问题
- 关注 [更新日志](../changelog/version-history/) 了解版本变更
- 参与插件开发，贡献代码或文档
