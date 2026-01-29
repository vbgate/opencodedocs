---
title: "版本更新: 初始发布和命令修复 | opencode-mystatus"
sidebarTitle: "v1.0-v1.0.1"
subtitle: "版本更新: 初始发布和命令修复 | opencode-mystatus"
description: "了解 opencode-mystatus v1.0.0 的初始功能，包括多平台额度查询、可视化进度条和多语言支持，以及 v1.0.1 的斜杠命令修复。"
tags:
  - "版本"
  - "更新日志"
  - "v1.0.0"
  - "v1.0.1"
order: 2
---

# v1.0.0 - v1.0.1：初始版本发布和斜杠命令修复

## 版本概述

**v1.0.0**（2026-01-11）是 opencode-mystatus 的初始版本，带来了多平台额度查询的核心功能。

**v1.0.1**（2026-01-11）立即跟进，修复了斜杠命令支持的关键问题。

---

## v1.0.1 - 斜杠命令修复

### 修复问题

**包含 `command/` 目录到 npm 包**

- **问题描述**：v1.0.0 发布后，发现斜杠命令 `/mystatus` 无法正常工作
- **原因分析**：npm 打包时遗漏了 `command/` 目录，导致 OpenCode 无法识别斜杠命令
- **修复方案**：更新 `package.json` 的 `files` 字段，确保 `command/` 目录被包含在发布包中
- **影响范围**：仅影响通过 npm 安装的用户，手动安装不受影响

### 升级建议

如果你已经安装了 v1.0.0，建议立即升级到 v1.0.1 以获得完整的斜杠命令支持：

```bash
## 升级到最新版本
npm update @vbgate/opencode-mystatus
```

---

## v1.0.0 - 初始版本发布

### 新增功能

**1. 多平台额度查询**

支持一键查询以下平台的额度使用情况：

| 平台 | 支持的订阅类型 | 额度类型 |
| ---- | -------------- | -------- |
| OpenAI | Plus/Team/Pro | 3 小时限额、24 小时限额 |
| 智谱 AI | Coding Plan | 5 小时 Token 限额、MCP 月度配额 |
| Google Cloud | Antigravity | G3 Pro、G3 Image、G3 Flash、Claude |

**2. 可视化进度条**

直观展示额度使用情况：

```
OpenAI (user@example.com)
━━━━━━━━━━━━━━━━━━━━ 75%
已用 750 / 1000 次请求
```

**3. 多语言支持**

- 中文（简体）
- 英文

语言自动检测，无需手动切换。

**4. API Key 安全脱敏**

所有敏感信息（API Key、OAuth Token）自动脱敏显示：

```
智谱 AI (zhipuai-coding-plan)
API Key: sk-a1b2****xyz
```

---

## 使用方式

### 斜杠命令（推荐）

在 OpenCode 中输入：

```
/mystatus
```

### 自然语言

你也可以用自然语言询问：

```
查看我的所有 AI 平台额度
```

---

## 升级指南

### 从 v1.0.0 升级到 v1.0.1

```bash
npm update @vbgate/opencode-mystatus
```

升级后，重启 OpenCode 即可使用斜杠命令 `/mystatus`。

### 首次安装

```bash
npm install -g @vbgate/opencode-mystatus
```

安装完成后，在 OpenCode 中输入 `/mystatus` 即可查询所有平台的额度。

---

## 已知限制

- v1.0.0 不支持 GitHub Copilot（v1.2.0 新增）
- v1.0.0 不支持 Z.ai（v1.1.0 新增）

如需使用这些功能，请升级到最新版本。

---

## 下一步

查看 [v1.2.0 - v1.2.4 更新日志](../v120-v124/) 了解 GitHub Copilot 支持等新功能。
