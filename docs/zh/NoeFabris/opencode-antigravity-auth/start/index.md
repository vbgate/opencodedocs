---
title: "快速开始: Antigravity Auth 安装配置 | OpenCode"
sidebarTitle: "10 分钟跑起来"
subtitle: "快速开始: Antigravity Auth 安装配置"
description: "学习 Antigravity Auth 插件的安装和配置方法。在 10 分钟内完成 Google OAuth 认证，发送第一个模型请求，验证 Claude 和 Gemini 模型访问是否成功。"
order: 1
---

# 快速开始

本章节帮助你从零开始使用 Antigravity Auth 插件。你将了解插件的核心价值，完成安装和 OAuth 认证，并发送第一个模型请求验证配置是否成功。

## 学习路径

按以下顺序学习，每一步都建立在前一步的基础上：

### 1. [插件介绍](./what-is-antigravity-auth/)

了解 Antigravity Auth 插件的核心价值、适用场景和风险提示。

- 判断插件是否适合你的使用场景
- 了解支持的 AI 模型（Claude Opus 4.5、Sonnet 4.5、Gemini 3 Pro/Flash）
- 明确使用风险和注意事项

### 2. [快速安装](./quick-install/)

5 分钟快速完成插件安装和首次认证。

- 两种安装方式（AI 辅助 / 手动配置）
- 配置模型定义
- 执行 Google OAuth 认证

### 3. [OAuth 2.0 PKCE 认证](./first-auth-login/)

理解 OAuth 2.0 PKCE 认证流程，完成首次登录。

- 理解 PKCE 认证的安全机制
- 完成首次登录获取 API 访问权限
- 了解令牌刷新的自动化处理

### 4. [第一个请求](./first-request/)

发起第一个模型请求，验证安装成功。

- 发送第一个 Antigravity 模型请求
- 理解 `--model` 和 `--variant` 参数
- 排查常见的模型请求错误

## 前置条件

开始本章节前，请确认：

- ✅ 已安装 OpenCode CLI（`opencode` 命令可用）
- ✅ 有可用的 Google 账户（用于 OAuth 认证）

## 下一步

完成快速开始后，你可以：

- **[了解可用模型](../platforms/available-models/)** — 探索所有支持的模型及其变体配置
- **[配置多账户](../advanced/multi-account-setup/)** — 设置多个 Google 账户实现配额池化
- **[常见认证问题](../faq/common-auth-issues/)** — 遇到问题时查阅故障排除指南
