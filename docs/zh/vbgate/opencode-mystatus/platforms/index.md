---
title: "平台功能: 多平台额度查询支持 | opencode-mystatus"
sidebarTitle: "平台功能"
subtitle: "平台功能: 多平台额度查询支持"
description: "学习 opencode-mystatus 支持的 4 个主流 AI 平台额度查询方法。涵盖 OpenAI、智谱 AI、GitHub Copilot 和 Google Cloud 平台，详细说明各平台的限额计算方式和特点。"
order: 2
---

# 平台功能

本章节详细介绍 opencode-mystatus 支持的各个 AI 平台的额度查询功能。

## 支持的平台

opencode-mystatus 支持以下 4 个主流 AI 平台：

| 平台 | 限额类型 | 特点 |
|------|---------|------|
| OpenAI | 3 小时 / 24 小时滑动窗口 | 支持 Plus、Team、Pro 订阅 |
| 智谱 AI | 5 小时 Token / MCP 月度配额 | 支持 Coding Plan |
| GitHub Copilot | 月度配额 | 显示 Premium Requests 使用量 |
| Google Cloud | 按模型独立计算 | 支持多账号、4 个模型 |

## 平台详解

### [OpenAI 额度](./openai-usage/)

深入了解 OpenAI 的额度查询机制：

- 3 小时和 24 小时滑动窗口的区别
- Team 账号的额度共享机制
- JWT Token 解析获取账号信息

### [智谱 AI 额度](./zhipu-usage/)

了解智谱 AI 和 Z.ai 的额度查询：

- 5 小时 Token 限额的计算方式
- MCP 月度配额的用途
- API Key 脱敏显示

### [GitHub Copilot 额度](./copilot-usage/)

掌握 GitHub Copilot 的额度管理：

- Premium Requests 的含义
- 不同订阅类型的配额差异
- 月度重置时间计算

### [Google Cloud 额度](./google-usage/)

学习 Google Cloud 多账号额度查询：

- 4 个模型（G3 Pro、G3 Image、G3 Flash、Claude）的区别
- 多账号管理和切换
- 认证文件读取机制

## 选择指南

根据你使用的平台，选择对应的教程：

- **只用 OpenAI**：直接看 [OpenAI 额度](./openai-usage/)
- **只用智谱 AI**：直接看 [智谱 AI 额度](./zhipu-usage/)
- **多平台用户**：建议按顺序阅读所有平台教程
- **Google Cloud 用户**：需要先安装 [opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) 插件

## 下一步

完成本章节后，可以继续学习 [高级功能](../advanced/)，了解更多配置选项。
