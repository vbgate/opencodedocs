---
title: "插件介绍: 功能与风险 | Antigravity Auth"
sidebarTitle: "这个插件适合你吗"
subtitle: "了解 Antigravity Auth 插件的核心价值"
description: "学习 Antigravity Auth 插件的核心价值和风险提示。通过 Google OAuth 访问 Claude 和 Gemini 3 模型，支持多账户负载均衡。"
tags:
  - "入门"
  - "插件介绍"
  - "OpenCode"
  - "Antigravity"
order: 1
---

# 了解 Antigravity Auth 插件的核心价值

**Antigravity Auth** 是一个 OpenCode 插件，通过 Google OAuth 认证访问 Antigravity API。它让你用熟悉的 Google 账号就能调用 Claude Opus 4.5、Sonnet 4.5 和 Gemini 3 Pro/Flash 等高级模型，无需管理 API 密钥。插件还提供多账户负载均衡、双配额池和自动会话恢复等功能，适合需要高级模型和自动管理的用户。

## 学完你能做什么

- 判断这个插件是否适合你的使用场景
- 了解插件支持哪些 AI 模型和核心功能
- 明确使用此插件的风险和注意事项
- 决定是否继续安装和配置

## 你现在的困境

想要使用最先进的 AI 模型（如 Claude Opus 4.5、Gemini 3 Pro），但官方访问受限。寻找可靠的方式获取这些模型，同时希望：

- 不需要手动管理多个 API 密钥
- 遇到速率限制时能自动切换账户
- 对话中断后能自动恢复，不丢失上下文

## 核心思路

**Antigravity Auth** 是一个 OpenCode 插件，通过 **Google OAuth 认证** 访问 Google Antigravity API，让你用自己熟悉的 Google 账号就能调用高级 AI 模型。

它不是代理所有请求，而是**拦截并转换**你的模型调用请求，将其转发到 Antigravity API，再把响应转换回 OpenCode 可以识别的格式。

## 主要功能

### 支持的模型

| 模型系列 | 可用模型 | 特点 |
|---------|---------|------|
| **Claude** | Opus 4.5、Sonnet 4.5 | 支持扩展思考模式 |
| **Gemini 3** | Pro、Flash | Google Search 集成、扩展思考 |

::: info 思考模式（Thinking）
Thinking 模型会在生成回答前先进行"深度思考"，展示推理过程。你可以配置思考预算，平衡质量和响应速度。
:::

### 多账户负载均衡

- **最多支持 10 个 Google 账户**
- 遇到速率限制（429 错误）时自动切换到下一个账户
- 三种账户选择策略：sticky（固定）、round-robin（轮换）、hybrid（智能混合）

### 双配额系统

插件同时访问**两个独立的配额池**：

1. **Antigravity 配额**：来自 Google Antigravity API
2. **Gemini CLI 配额**：来自 Google Gemini CLI

当一个池限速时，插件会自动尝试另一个池，最大化配额利用率。

### 自动会话恢复

- 检测工具调用失败（如按 ESC 中断）
- 自动注入 synthetic tool_result，避免对话崩溃
- 支持自动发送 "continue" 继续对话

### Google Search 集成

为 Gemini 模型启用网页搜索，提升事实准确性：

- **Auto 模式**：模型根据需要决定是否搜索
- **Always-on 模式**：每次都搜索

## 什么时候用这个插件

::: tip 适合以下场景
- 你有多个 Google 账号，希望提高总体配额
- 需要使用 Claude 或 Gemini 3 的 Thinking 模型
- 想要为 Gemini 模型启用 Google Search
- 不想手动管理 API 密钥，更习惯 OAuth 认证
- 经常遇到速率限制，希望自动切换账户
:::

::: warning 不适合以下场景
- 你需要使用 Google 官方未公开的模型
- 你对 Google ToS 风险非常敏感（见下方风险提示）
- 你只需要基础的 Gemini 1.5 或 Claude 3 模型（官方接口更稳定）
- 你在 WSL、Docker 等环境中打开浏览器困难
:::

## ⚠️ 重要风险提示

使用此插件**可能违反 Google 的服务条款**。少量用户报告他们的 Google 账号被**封禁**或**影子封禁**（限制访问但不明确通知）。

### 高风险场景

- 🚨 **全新的 Google 账号**：被封禁概率极高
- 🚨 **新开通 Pro/Ultra 订阅的账号**：容易被标记并封禁

### 使用前请确认

- 这是一个**非官方工具**，Google 未认可
- 你的账号可能被暂停或永久封禁
- 你承担使用此插件的所有风险

### 建议

- 使用**成熟的 Google 账号**，而非为此插件创建新账号
- 避免使用与关键服务绑定的重要账号
- 如果账号被封禁，无法通过此插件申诉

::: danger 账号安全
所有 OAuth 令牌都存储在本地 `~/.config/opencode/antigravity-accounts.json`，不会上传到任何服务器。但请确保你的电脑安全，防止令牌泄露。
:::

## 本课小结

Antigravity Auth 是一个强大的 OpenCode 插件，让你通过 Google OAuth 访问 Claude 和 Gemini 3 高级模型。它提供多账户负载均衡、双配额池、自动会话恢复等功能，适合需要高级模型和自动管理的用户。

但请务必注意：**使用此插件有封号风险**。请使用非关键的 Google 账号，并了解相关风险后再继续安装。

## 下一课预告

> 下一课我们学习 **[快速安装](../quick-install/)**。
>
> 你会学到：
> - 5 分钟完成插件安装
> - 添加第一个 Google 账户
> - 验证安装成功
