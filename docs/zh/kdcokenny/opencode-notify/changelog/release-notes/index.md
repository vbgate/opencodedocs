---
title: "opencode-notify 更新日志：版本历史与功能变更记录"
sidebarTitle: "了解新功能"
subtitle: "更新日志"
description: "查看 opencode-notify 插件的版本历史和重要变更记录。了解每个版本的功能更新、问题修复和配置改进。"
tags:
  - "更新日志"
  - "版本历史"
order: 150
---

# 更新日志

## 版本说明

本插件通过 OCX 发布，没有传统版本号。以下按时间倒序记录重要变更。

---

## 2026-01-23

**变更类型**: 同步更新

- 保持与 kdcokenny/ocx 主仓库同步

---

## 2026-01-22

**变更类型**: 同步更新

- 保持与 kdcokenny/ocx 主仓库同步

---

## 2026-01-13

**变更类型**: 同步更新

- 保持与 kdcokenny/ocx 主仓库同步

---

## 2026-01-12

**变更类型**: 同步更新

- 保持与 kdcokenny/ocx 主仓库同步

---

## 2026-01-08

**变更类型**: 同步更新

- 保持与 kdcokenny/ocx 主仓库同步

---

## 2026-01-07

**变更类型**: 同步更新

- 更新自 ocx@30a9af5
- 跳过 CI 构建

---

## 2026-01-01

### 修复：Cargo 风格命名空间语法

**变更内容**：
- 更新命名空间语法：`ocx add kdco-notify` → `ocx add kdco/notify`
- 更新命名空间语法：`ocx add kdco-workspace` → `ocx add kdco/workspace`
- 重命名源文件：`kdco-notify.ts` → `notify.ts`

**影响**：
- 安装命令从 `ocx add kdco-notify` 改为 `ocx add kdco/notify`
- 源码文件结构更清晰，符合 Cargo 命名风格

---

### 优化：README 文档

**变更内容**：
- 优化 README 文档，增加价值主张说明
- 新增 FAQ 章节，回答常见问题
- 改进"智能通知"相关说明文案
- 简化安装步骤说明

**新增内容**：
- 价值主张表格（事件、是否通知、音效、原因）
- 常见问题：是否增加上下文、是否会收到垃圾通知、如何临时禁用

---

## 2025-12-31

### 文档：简化 README

**变更内容**：
- 移除无效的图标和深色模式引用
- 简化 README 文档，聚焦核心功能说明

### 移除：图标支持

**变更内容**：
- 移除 OpenCode 图标支持（跨平台深色模式检测）
- 简化通知流程，移除不稳定的图标功能
- 清理 `src/plugin/assets/` 目录

**移除文件**：
- `src/plugin/assets/opencode-icon-dark.png`
- `src/plugin/assets/opencode-icon-light.png`

**影响**：
- 通知不再显示自定义图标
- 通知流程更稳定，减少平台兼容性问题

### 新增：OpenCode 图标（已移除）

**变更内容**：
- 添加 OpenCode 图标支持
- 实现跨平台深色模式检测

::: info
此功能在后续版本中已移除，见 2025-12-31"移除：图标支持"。
:::

### 新增：终端检测与焦点感知

**变更内容**：
- 新增终端自动检测功能（支持 37+ 终端）
- 新增焦点检测功能（仅 macOS）
- 新增点击聚焦功能（仅 macOS）

**新增功能**：
- 自动识别终端模拟器
- 终端聚焦时抑制通知
- 点击通知聚焦终端窗口（macOS）

**技术细节**：
- 使用 `detect-terminal` 库检测终端类型
- 通过 macOS osascript 获取前台应用
- 使用 node-notifier 的 activate 选项实现点击聚焦

### 新增：初始版本

**变更内容**：
- 初始提交：kdco-notify 插件
- 基础原生通知功能
- 基础配置系统

**核心功能**：
- session.idle 事件通知（任务完成）
- session.error 事件通知（错误）
- permission.updated 事件通知（权限请求）
- node-notifier 集成（跨平台原生通知）

**初始文件**：
- `LICENSE` - MIT 许可证
- `README.md` - 项目文档
- `registry.json` - OCX 注册配置
- `src/plugin/kdco-notify.ts` - 主插件代码

---

## 相关资源

- **GitHub 仓库**: https://github.com/kdcokenny/ocx/tree/main/registry/src/kdco/notify
- **提交历史**: https://github.com/kdcokenny/ocx/commits/main/registry/src/kdco/notify
- **OCX 文档**: https://github.com/kdcokenny/ocx

---

## 版本策略

本插件作为 OCX 生态系统的一部分，采用以下版本策略：

- **无版本号**: 通过 Git 提交历史追踪变更
- **持续交付**: 随 OCX 主仓库同步更新
- **向后兼容**: 保持配置格式和 API 的向后兼容性

如有破坏性变更，将在更新日志中明确标注。

---

**最后更新**: 2026-01-27
