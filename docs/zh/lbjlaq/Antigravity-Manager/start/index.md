---
title: "快速开始: 从零使用 Antigravity Tools | Antigravity-Manager"
sidebarTitle: "从零跑起来"
subtitle: "快速开始: 从零使用 Antigravity Tools"
description: "学习 Antigravity Tools 的完整上手流程。从安装配置到首次 API 调用，快速掌握本地网关的核心使用方法。"
order: 1
---

# 快速开始

本章节带你从零开始使用 Antigravity Tools，完成从安装到第一次成功调用 API 的完整流程。你会学到核心概念、账号管理、数据备份，以及如何让你的 AI 客户端接入本地网关。

## 本章内容

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">

<a href="./getting-started/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">Antigravity Tools 是什么</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">建立正确心智模型：本地网关、协议兼容、账号池调度的核心概念与使用边界。</p>
</a>

<a href="./installation/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">安装与升级</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">桌面端最佳安装路径（brew / releases），以及常见系统拦截的处理方式。</p>
</a>

<a href="./first-run-data/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">首次启动必懂</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">数据目录、日志、托盘与自动启动，避免误删与不可逆丢失。</p>
</a>

<a href="./add-account/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">添加账号</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">OAuth/Refresh Token 双通道与最佳实践，用最稳的方式建立账号池。</p>
</a>

<a href="./backup-migrate/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">账号备份与迁移</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">导入/导出、V1/DB 热迁移，支持多机复用与服务器部署场景。</p>
</a>

<a href="./proxy-and-first-client/" class="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-brand-500 dark:hover:border-brand-500 transition-colors no-underline">
  <h3 class="text-lg font-semibold mb-2">启动反代并接入客户端</h3>
  <p class="text-sm text-gray-600 dark:text-gray-400">从启动服务到外部客户端成功调用，一次跑通验证闭环。</p>
</a>

</div>

## 学习路径

::: tip 推荐顺序
按照以下顺序学习，可以最快速地上手 Antigravity Tools：
:::

```
1. 概念理解        →  2. 安装软件        →  3. 了解数据目录
   getting-started      installation          first-run-data
        ↓                    ↓                      ↓
4. 添加账号        →  5. 备份账号        →  6. 启动反代
   add-account          backup-migrate        proxy-and-first-client
```

| 步骤 | 课程 | 预计时间 | 你会学到 |
|--- | --- | --- | ---|
| 1 | [概念理解](./getting-started/) | 5 分钟 | 什么是本地网关、为什么需要账号池 |
| 2 | [安装软件](./installation/) | 3 分钟 | brew 安装或手动下载，处理系统拦截 |
| 3 | [了解数据目录](./first-run-data/) | 5 分钟 | 数据存在哪、日志怎么看、托盘操作 |
| 4 | [添加账号](./add-account/) | 10 分钟 | OAuth 授权或手动填写 Refresh Token |
| 5 | [备份账号](./backup-migrate/) | 5 分钟 | 导出账号、跨设备迁移 |
| 6 | [启动反代](./proxy-and-first-client/) | 10 分钟 | 启动服务、配置客户端、验证调用 |

**最小可用路径**：如果你赶时间，可以只完成 1 → 2 → 4 → 6，大约 25 分钟即可开始使用。

## 下一步

完成本章节后，你已经可以正常使用 Antigravity Tools 了。接下来可以根据需要深入学习：

- **[平台与集成](../platforms/)**：了解 OpenAI、Anthropic、Gemini 等不同协议的接入细节
- **[进阶配置](../advanced/)**：模型路由、配额保护、高可用调度等高级功能
- **[常见问题](../faq/)**：遇到 401、429、404 等错误时的排查指南
