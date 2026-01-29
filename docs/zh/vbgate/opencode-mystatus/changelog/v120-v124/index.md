---
title: "版本更新: v1.2.0-1.2.4 | opencode-mystatus"
sidebarTitle: "版本更新"
subtitle: "版本更新: v1.2.0-1.2.4 | opencode-mystatus"
description: "了解 opencode-mystatus v1.2.0-v1.2.4 版本更新。新增 GitHub Copilot 支持，改进文档和安装说明，修复 lint 错误。"
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4：新增 Copilot 支持和文档改进

## 版本概述

本次更新（v1.2.0 - v1.2.4）为 opencode-mystatus 带来了重要功能增强，最显著的是**新增了对 GitHub Copilot 的额度查询支持**。同时改进了安装文档，修复了代码中的 lint 错误。

**主要变化**：
- ✅ 新增 GitHub Copilot Premium Requests 查询
- ✅ 集成 GitHub 内部 API
- ✅ 更新中英文文档
- ✅ 改进安装说明，移除版本限制
- ✅ 修复代码 lint 错误

---

## [1.2.2] - 2026-01-14

### 文档改进

- **更新安装说明**：在 `README.md` 和 `README.zh-CN.md` 中移除了版本限制
- **自动更新支持**：现在用户可以自动接收最新版本，无需手动修改版本号

**影响**：用户安装或升级插件时，无需再指定具体版本，可以通过 `@latest` 标签获取最新版本。

---

## [1.2.1] - 2026-01-14

### Bug 修复

- **修复 lint 错误**：移除了 `copilot.ts` 中未使用的 `maskString` 导入

**影响**：代码质量提升，通过 ESLint 检查，无功能性变化。

---

## [1.2.0] - 2026-01-14

### 新增功能

#### GitHub Copilot 支持

这是本次更新的核心功能：

- **新增 Copilot 额度查询**：支持查询 GitHub Copilot Premium Requests 的使用情况
- **集成 GitHub 内部 API**：新增 `copilot.ts` 模块，通过 GitHub API 获取额度数据
- **更新文档**：在 `README.md` 和 `README.zh-CN.md` 中添加了 Copilot 相关文档

**支持的认证方式**：
1. **Fine-grained PAT**（推荐）：用户创建的 Fine-grained Personal Access Token
2. **OAuth Token**：OpenCode OAuth Token（需有 Copilot 权限）

**查询内容**：
- Premium Requests 总量与已用量
- 各模型的使用明细
- 订阅类型识别（free、pro、pro+、business、enterprise）

**使用示例**：

```bash
# 执行 mystatus 命令
/mystatus

# 你会看到输出中包含 GitHub Copilot 部分
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  模型使用明细:
    gpt-4o: 150 Requests
    claude-3.5-sonnet: 75 Requests

  计费周期: 2026-01
```

---

## 升级指南

### 自动升级（推荐）

由于 v1.2.2 更新了安装说明，移除了版本限制，你现在可以：

```bash
# 使用最新标签安装
opencode plugin install vbgate/opencode-mystatus@latest
```

### 手动升级

如果你已经安装了旧版本，可以直接更新：

```bash
# 卸载旧版本
opencode plugin uninstall vbgate/opencode-mystatus

# 安装新版本
opencode plugin install vbgate/opencode-mystatus@latest
```

### 配置 Copilot

升级后，你可以配置 GitHub Copilot 额度查询：

#### 方法 1：使用 Fine-grained PAT（推荐）

1. 在 GitHub 上创建 Fine-grained Personal Access Token
2. 创建配置文件 `~/.config/opencode/copilot-quota-token.json`：

```json
{
  "token": "ghp_your_fine_grained_pat_here",
  "username": "your-github-username",
  "tier": "pro"
}
```

3. 执行 `/mystatus` 查询额度

#### 方法 2：使用 OpenCode OAuth Token

确保你的 OpenCode OAuth Token 有 Copilot 权限，直接执行 `/mystatus` 即可。

::: tip 提示
关于 Copilot 认证的详细配置，请参阅 [Copilot 认证配置](/zh/vbgate/opencode-mystatus/advanced/copilot-auth/) 教程。
:::

---

## 已知问题

### Copilot 权限问题

如果你的 OpenCode OAuth Token 没有 Copilot 权限，查询时会显示提示信息。解决方法：

1. 使用 Fine-grained PAT（推荐）
2. 重新授权 OpenCode，确保勾选 Copilot 权限

详细解决方案请参阅 [Copilot 认证配置](/zh/vbgate/opencode-mystatus/advanced/copilot-auth/) 教程。

---

## 后续计划

未来版本可能包含以下改进：

- [ ] 支持更多 GitHub Copilot 订阅类型
- [ ] 优化 Copilot 额度显示格式
- [ ] 增加额度预警功能
- [ ] 支持更多 AI 平台

---

## 相关文档

- [Copilot 额度查询](/zh/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Copilot 认证配置](/zh/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [常见问题排查](/zh/vbgate/opencode-mystatus/faq/troubleshooting/)

---

## 完整变更日志

查看所有版本的变更，请访问 [GitHub Releases](https://github.com/vbgate/opencode-mystatus/releases)。
