---
title: "MCP 配置: 扩展外部服务 | Everything Claude Code"
sidebarTitle: "连接外部服务"
subtitle: "MCP 服务器配置: 扩展 Claude Code 的外部服务集成能力"
description: "学习 MCP 配置方法。从 15 个预配置服务器中选择适合项目的、配置 API 密钥和环境变量，优化上下文窗口使用。"
tags:
  - "mcp"
  - "configuration"
  - "integration"
prerequisite:
  - "start-installation"
order: 40
---
# MCP 服务器配置：扩展 Claude Code 的外部服务集成能力

## 学完你能做什么

- 理解 MCP 是什么，以及它如何扩展 Claude Code 的能力
- 从 15 个预配置 MCP 服务器中选择适合你项目的服务
- 正确配置 API 密钥和环境变量
- 优化 MCP 使用，避免上下文窗口被占用

## 你现在的困境

Claude Code 默认只有文件操作和命令执行能力，但你可能需要：

- 查询 GitHub PR 和 Issues
- 抓取网页内容
- 操作 Supabase 数据库
- 查询实时文档
- 跨会话持久化记忆

如果手动处理这些任务，需要频繁切换工具、复制粘贴，效率低下。MCP（Model Context Protocol）服务器可以帮你自动完成这些外部服务集成。

## 什么时候用这一招

**适合使用 MCP 服务器的情况**：
- 项目涉及 GitHub、Vercel、Supabase 等第三方服务
- 需要查询实时文档（如 Cloudflare、ClickHouse）
- 需要跨会话保持状态或记忆
- 需要网页抓取或 UI 组件生成

**不需要 MCP 的情况**：
- 只涉及本地文件操作
- 纯前端开发，无外部服务集成
- 简单的 CRUD 应用，数据库操作少

## 🎒 开始前的准备

在开始配置前，请确认：

::: warning 前置检查

- ✅ 已完成 [插件安装](../installation/)
- ✅ 熟悉基本的 JSON 配置语法
- ✅ 有需要集成服务的 API 密钥（GitHub PAT、Firecrawl API Key 等）
- ✅ 了解 `~/.claude.json` 配置文件位置

:::

## 核心思路

### 什么是 MCP

**MCP（Model Context Protocol）** 是 Claude Code 用来连接外部服务的协议。它让 AI 可以访问 GitHub、数据库、文档查询等外部资源，就像扩展能力一样。

**工作原理**：

```
Claude Code ←→ MCP Server ←→ External Service
   (本地)         (中间件)          (GitHub/Supabase/...)
```

### MCP 配置结构

每个 MCP 服务器配置包含：

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",          // 启动命令
      "args": ["-y", "package"],  // 命令参数
      "env": {                   // 环境变量
        "API_KEY": "YOUR_KEY"
      },
      "description": "功能描述"   // 说明
    }
  }
}
```

**类型**：
- **npx 类型**：使用 npm 包运行（如 GitHub、Firecrawl）
- **http 类型**：连接到 HTTP 端点（如 Vercel、Cloudflare）

### 上下文窗口管理（重要！）

::: warning 上下文警告

每个启用的 MCP 服务器都会占用上下文窗口。启用太多会导致 200K 上下文缩小到 70K。

**黄金法则**：
- 配置 20-30 个 MCP 服务器（全部可用）
- 每个项目启用 < 10 个
- 活跃工具总数 < 80

使用 `disabledMcpServers` 在项目配置中禁用不需要的 MCP。

:::

## 跟我做

### 第 1 步：查看可用的 MCP 服务器

Everything Claude Code 提供了 **15 个预配置 MCP 服务器**：

| MCP 服务器 | 类型 | 需要密钥 | 用途 |
|--- | --- | --- | ---|
| **github** | npx | ✅ GitHub PAT | PR、Issues、Repos 操作 |
| **firecrawl** | npx | ✅ API Key | 网页抓取和爬取 |
| **supabase** | npx | ✅ Project Ref | 数据库操作 |
| **memory** | npx | ❌ | 跨会话持久化记忆 |
| **sequential-thinking** | npx | ❌ | 链式推理增强 |
| **vercel** | http | ❌ | 部署和项目管理 |
| **railway** | npx | ❌ | Railway 部署 |
| **cloudflare-docs** | http | ❌ | 文档搜索 |
| **cloudflare-workers-builds** | http | ❌ | Workers 构建 |
| **cloudflare-workers-bindings** | http | ❌ | Workers 绑定 |
| **cloudflare-observability** | http | ❌ | 日志和监控 |
| **clickhouse** | http | ❌ | 分析查询 |
| **context7** | npx | ❌ | 实时文档查找 |
| **magic** | npx | ❌ | UI 组件生成 |
| **filesystem** | npx | ❌（需路径） | 文件系统操作 |

**你应该看到**：15 个 MCP 服务器的完整列表，涵盖 GitHub、部署、数据库、文档查询等常用场景。

---

### 第 2 步：复制 MCP 配置到 Claude Code

从源码目录复制配置：

```bash
# 复制 MCP 配置模板
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**为什么**：备份原始配置，方便后续参考和对比。

---

### 第 3 步：选择需要的 MCP 服务器

根据你的项目需求，选择需要的 MCP 服务器。

**示例场景**：

| 项目类型 | 推荐启用的 MCP |
|--- | ---|
| **全栈应用**（GitHub + Supabase + Vercel） | github, supabase, vercel, memory, context7 |
| **前端项目**（Vercel + 文档查询） | vercel, cloudflare-docs, context7, magic |
| **数据项目**（ClickHouse + 分析） | clickhouse, sequential-thinking, memory |
| **通用开发** | github, filesystem, memory, context7 |

**你应该看到**：清晰的项目类型与 MCP 服务器对应关系。

---

### 第 4 步：编辑 `~/.claude.json` 配置文件

打开你的 Claude Code 配置文件：

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

在 `~/.claude.json` 中添加 `mcpServers` 部分：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
      },
      "description": "GitHub operations - PRs, issues, repos"
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "description": "Persistent memory across sessions"
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"],
      "description": "Live documentation lookup"
    }
  }
}
```

**为什么**：这是核心配置，告诉 Claude Code 启动哪些 MCP 服务器。

**你应该看到**：`mcpServers` 对象包含你选择的 MCP 服务器配置。

---

### 第 5 步：替换 API 密钥占位符

对于需要 API 密钥的 MCP 服务器，替换 `YOUR_*_HERE` 占位符：

**GitHub MCP 示例**：

1. 生成 GitHub Personal Access Token：
   - 访问 https://github.com/settings/tokens
   - 创建新 Token，勾选 `repo` 权限

2. 替换配置中的占位符：

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // 替换为实际 Token
  }
}
```

**其他需要密钥的 MCP**：

| MCP | 密钥名称 | 获取地址 |
|--- | --- | ---|
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**为什么**：没有实际密钥，MCP 服务器无法连接外部服务。

**你应该看到**：所有 `YOUR_*_HERE` 占位符被替换为实际密钥。

---

### 第 6 步：配置项目级 MCP 禁用（推荐）

为了避免所有项目都启用所有 MCP，在项目根目录创建 `.claude/config.json`：

```json
{
  "disabledMcpServers": [
    "supabase",      // 禁用不需要的 MCP
    "railway",
    "firecrawl"
  ]
}
```

**为什么**：这样可以在项目级别灵活控制哪些 MCP 生效，避免上下文窗口被占用。

**你应该看到**：`.claude/config.json` 文件包含 `disabledMcpServers` 数组。

---

### 第 7 步：重启 Claude Code

重启 Claude Code 使配置生效：

```bash
# 停止 Claude Code（如果正在运行）
# 然后重新启动
claude
```

**为什么**：MCP 配置在启动时加载，需要重启才能生效。

**你应该看到**：Claude Code 启动后，MCP 服务器自动加载。

## 检查点 ✅

验证 MCP 配置是否成功：

1. **检查 MCP 加载状态**：

在 Claude Code 中输入：

```bash
/tool list
```

**预期结果**：看到已加载的 MCP 服务器和工具列表。

2. **测试 MCP 功能**：

如果你启用了 GitHub MCP，测试查询：

```bash
# 查询 GitHub Issues
@mcp list issues
```

**预期结果**：返回你仓库的 Issues 列表。

3. **检查上下文窗口**：

查看 `~/.claude.json` 中的工具数量：

```bash
jq '.mcpServers | length' ~/.claude.json
```

**预期结果**：启用的 MCP 服务器数量 < 10。

::: tip 调试技巧

如果 MCP 没有加载成功，检查 Claude Code 的日志文件：
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## 踩坑提醒

### 坑 1：启用太多 MCP 导致上下文不足

**症状**：对话开始时上下文窗口只有 70K 而非 200K。

**原因**：每个 MCP 启用的工具都会占用上下文窗口。

**解决**：
1. 检查启用的 MCP 数量（`~/.claude.json`）
2. 使用项目级 `disabledMcpServers` 禁用不需要的 MCP
3. 保持活跃工具总数 < 80

---

### 坑 2：API 密钥未正确配置

**症状**：调用 MCP 功能时提示权限错误或连接失败。

**原因**：`YOUR_*_HERE` 占位符未被替换。

**解决**：
1. 检查 `~/.claude.json` 中的 `env` 字段
2. 确认所有占位符都被替换为实际密钥
3. 验证密钥是否有足够权限（如 GitHub Token 需要 `repo` 权限）

---

### 坑 3：Filesystem MCP 路径错误

**症状**：Filesystem MCP 无法访问指定目录。

**原因**：`args` 中的路径未替换为实际路径。

**解决**：
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"],  // 替换为你的项目路径
    "description": "Filesystem operations"
  }
}
```

---

### 坑 4：项目级配置未生效

**症状**：项目根目录的 `disabledMcpServers` 没有禁用 MCP。

**原因**：`.claude/config.json` 路径或格式错误。

**解决**：
1. 确认文件在项目根目录：`.claude/config.json`
2. 检查 JSON 格式是否正确（使用 `jq .` 验证）
3. 确认 `disabledMcpServers` 是字符串数组

## 本课小结

本课学习了 MCP 服务器的配置方法：

**关键点**：
- MCP 扩展 Claude Code 的外部服务集成能力
- 从 15 个预配置 MCP 中选择适合的（推荐 < 10 个）
- 替换 `YOUR_*_HERE` 占位符为实际 API 密钥
- 使用项目级 `disabledMcpServers` 控制启用数量
- 保持活跃工具总数 < 80，避免上下文窗口被占用

**下一步**：你已经配置好 MCP 服务器，下一课学习如何使用核心 Commands。

## 下一课预告

> 下一课我们学习 **[核心 Commands 详解](../../platforms/commands-overview/)**。
>
> 你会学到：
> - 14 个斜杠命令的功能和使用场景
> - `/plan` 命令如何创建实现计划
> - `/tdd` 命令如何执行测试驱动开发
> - 如何通过命令快速触发复杂工作流

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| MCP 配置模板 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| README 重要提示 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |
|--- | --- | ---|

**关键配置**：
- 15 个 MCP 服务器（GitHub、Firecrawl、Supabase、Memory、Sequential-thinking、Vercel、Railway、Cloudflare 系列、ClickHouse、Context7、Magic、Filesystem）
- 支持两种类型：npx（命令行）和 http（端点连接）
- 使用 `disabledMcpServers` 项目级配置控制启用数量

**关键规则**：
- 配置 20-30 个 MCP 服务器
- 每个项目启用 < 10 个
- 活跃工具总数 < 80
- 上下文窗口从 200K 缩小到 70K 的风险

</details>
