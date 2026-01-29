---
title: "常见问题: OAuth 认证与模型排查 | Antigravity Auth"
sidebarTitle: "认证失败怎么办"
subtitle: "常见问题: OAuth 认证与模型排查"
description: "了解 Antigravity Auth 插件的常见问题与解决方案。涵盖 OAuth 认证失败排查、模型未找到错误处理、插件兼容性配置等实用指南，帮助你快速定位并解决使用中遇到的各类问题。"
order: 4
---

# 常见问题

本章节收录了使用 Antigravity Auth 插件时最常遇到的问题和解决方案。无论是 OAuth 认证失败、模型请求报错，还是插件兼容性问题，这里都有对应的排查指南。

## 前置条件

::: warning 开始前请确保
- ✅ 已完成 [快速安装](../start/quick-install/) 并成功添加账户
- ✅ 已完成 [首次认证](../start/first-auth-login/) 并理解 OAuth 流程
:::

## 学习路径

根据你遇到的问题类型，选择对应的排查指南：

### 1. [OAuth 认证失败排查](./common-auth-issues/)

解决 OAuth 认证、令牌刷新和账户相关常见问题。

- 浏览器授权成功但终端提示「授权失败」
- 突然报错「Permission Denied」或「invalid_grant」
- Safari 浏览器 OAuth 回调失败
- WSL2/Docker 环境下无法完成认证

### 2. [迁移账户](./migration-guide/)

在不同机器间迁移账户，处理版本升级。

- 将账户从旧电脑迁移到新电脑
- 理解存储格式的版本变化（v1/v2/v3）
- 解决迁移后的 invalid_grant 错误

### 3. [模型未找到排查](./model-not-found/)

解决模型未找到、400 错误等模型相关问题。

- `Model not found` 错误排查
- `Invalid JSON payload received. Unknown name "parameters"` 400 错误
- MCP 服务器调用报错

### 4. [插件兼容性](./plugin-compatibility/)

解决与 oh-my-opencode、DCP 等插件的兼容性问题。

- 正确配置插件加载顺序
- 在 oh-my-opencode 中禁用冲突的认证方式
- 为并行代理场景启用 PID 偏移

### 5. [ToS 警告](./tos-warning/)

理解使用风险，避免账户被封禁。

- 了解 Google 服务条款限制
- 识别高风险场景（新账户、密集请求）
- 掌握避免账户封禁的最佳实践

## 快速定位问题

| 错误现象 | 推荐阅读 |
| -------- | -------- |
| 认证失败、授权超时 | [OAuth 认证失败排查](./common-auth-issues/) |
| invalid_grant、Permission Denied | [OAuth 认证失败排查](./common-auth-issues/) |
| Model not found、400 错误 | [模型未找到排查](./model-not-found/) |
| 与其他插件冲突 | [插件兼容性](./plugin-compatibility/) |
| 换新电脑、版本升级 | [迁移账户](./migration-guide/) |
| 担心账户安全 | [ToS 警告](./tos-warning/) |

## 下一步

解决问题后，你可以：

- 📖 阅读 [高级功能](../advanced/) 深入掌握多账户、会话恢复等特性
- 📚 查阅 [附录](../appendix/) 了解架构设计和完整配置参考
- 🔄 关注 [更新日志](../changelog/) 获取最新功能和变更
