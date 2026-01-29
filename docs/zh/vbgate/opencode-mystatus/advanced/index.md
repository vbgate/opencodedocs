---
title: "高级功能: 多账号与 Copilot 配置 | opencode-mystatus"
sidebarTitle: "高级功能"
subtitle: "高级功能: 多账号与 Copilot 配置"
description: "掌握 opencode-mystatus 高级配置。实现多账号管理、Copilot 认证和语言切换，完成个性化定制设置。"
order: 3
---

# 高级功能

本章节介绍 opencode-mystatus 的高级配置选项，适合需要更多定制化的用户。

## 功能列表

### [Google Cloud 配置](./google-setup/)

配置和管理多个 Google Cloud Antigravity 账号：

- 添加多个 Google Cloud 账号
- 4 个模型（G3 Pro、G3 Image、G3 Flash、Claude）的映射关系
- projectId 和 managedProjectId 的区别
- 解决单账号模型额度不足的问题

### [Copilot 认证配置](./copilot-auth/)

解决 GitHub Copilot 认证问题：

- OAuth Token 和 Fine-grained PAT 的区别
- 解决 OAuth Token 权限不足的问题
- 创建 Fine-grained PAT 并配置订阅类型
- 配置 `copilot-quota-token.json` 文件

### [多语言支持](./i18n-setup/)

了解自动语言检测机制：

- 系统语言自动检测原理
- Intl API 和环境变量回退机制
- 如何切换输出语言（中文/英文）

## 适用场景

| 场景 | 推荐教程 |
|------|---------|
| 使用多个 Google 账号 | [Google Cloud 配置](./google-setup/) |
| Copilot 额度查询失败 | [Copilot 认证配置](./copilot-auth/) |
| 想切换输出语言 | [多语言支持](./i18n-setup/) |

## 前置条件

学习本章节前，建议先完成：

- [快速开始](../start/) - 完成插件安装
- [平台功能](../platforms/) - 了解各平台基础用法

## 下一步

遇到问题？查看 [常见问题](../faq/) 获取帮助。
