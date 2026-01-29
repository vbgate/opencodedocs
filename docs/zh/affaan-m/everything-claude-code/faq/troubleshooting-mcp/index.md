---
title: "MCP 连接失败: 排查配置故障 | Everything Claude Code"
sidebarTitle: "解决 MCP 连接问题"
subtitle: "MCP 连接失败: 排查配置故障"
description: "学习 MCP 服务器连接问题的排查方法。解决 6 种常见故障，包括 API 密钥错误、上下文窗口过小、服务器类型配置错误等，提供系统化修复流程。"
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# 常见问题排查：MCP 连接失败

## 你现在的困境

配置完 MCP 服务器后，你可能会遇到这些问题：

- ❌ Claude Code 提示 "Failed to connect to MCP server"
- ❌ GitHub/Supabase 相关命令不工作
- ❌ 上下文窗口突然变小，工具调用变慢
- ❌ Filesystem MCP 无法访问文件
- ❌ 启用的 MCP 服务器太多，系统卡顿

别担心，这些问题都有明确的解决方案。本课帮你系统化排查 MCP 连接问题。

---

## 常见问题 1：API 密钥未配置或无效

### 症状

当你尝试使用 GitHub、Firecrawl 等 MCP 服务器时，Claude Code 提示：

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

或

```
Failed to connect to MCP server: Authentication failed
```

### 原因

MCP 配置文件中的 `YOUR_*_HERE` 占位符未被替换为实际的 API 密钥。

### 解决方案

**第 1 步：检查配置文件**

打开 `~/.claude.json`，找到对应 MCP 服务器的配置：

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← 检查这里
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**第 2 步：替换占位符**

将 `YOUR_GITHUB_PAT_HERE` 替换为你的实际 API 密钥：

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**第 3 步：常见 MCP 服务器的密钥获取**

| MCP 服务器 | 环境变量名                     | 获取位置                                                      |
|--- | --- | ---|
| GitHub     | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl  | `FIRECRAWL_API_KEY`            | Firecrawl Dashboard → API Keys                                |
| Supabase   | 项目引用                       | Supabase Dashboard → Settings → API                           |

**你应该看到**：重启 Claude Code 后，相关工具可以正常调用。

### 踩坑提醒

::: danger 安全提示
不要将包含真实 API 密钥的配置文件提交到 Git 仓库。确保 `~/.claude.json` 在 `.gitignore` 中。
:::

---

## 常见问题 2：上下文窗口过小

### 症状

- 工具调用列表突然变得很短
- Claude 提示 "Context window exceeded"
- 响应速度明显变慢

### 原因

启用了太多 MCP 服务器，导致上下文窗口被占用。根据项目 README，**200k 的上下文窗口会因为启用过多 MCP 而收缩到 70k**。

### 解决方案

**第 1 步：检查已启用的 MCP 数量**

查看 `~/.claude.json` 中的 `mcpServers` 部分，统计启用的服务器数量。

**第 2 步：使用 `disabledMcpServers` 禁用不需要的服务器**

在项目级配置（`~/.claude/settings.json` 或项目 `.claude/settings.json`）中添加：

```json
{
  "disabledMcpServers": [
    "railway",
    "cloudflare-docs",
    "cloudflare-workers-builds",
    "magic",
    "filesystem"
  ]
}
```

**第 3 步：遵循最佳实践**

根据 README 中的建议：

- 配置 20-30 个 MCP 服务器（在配置文件中定义）
- 每个项目启用 < 10 个 MCP 服务器
- 保持活跃工具数 < 80 个

**你应该看到**：工具列表恢复到正常长度，响应速度提升。

### 踩坑提醒

::: tip 经验之谈
建议按项目类型启用不同的 MCP 组合。例如：
- Web 项目：GitHub、Firecrawl、Memory、Context7
- 数据项目：Supabase、ClickHouse、Sequential-thinking
:::

---

## 常见问题 3：服务器类型配置错误

### 症状

```
Failed to start MCP server: Command not found
```

或

```
Failed to connect: Invalid server type
```

### 原因

混淆了 `npx` 和 `http` 两种 MCP 服务器类型。

### 解决方案

**第 1 步：确认服务器类型**

检查 `mcp-configs/mcp-servers.json`，区分两种类型：

**npx 类型**（需要 `command` 和 `args`）：
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    }
  }
}
```

**http 类型**（需要 `url`）：
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**第 2 步：修正配置**

| MCP 服务器      | 正确类型 | 正确配置                                                                |
|--- | --- | ---|
| GitHub          | npx      | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel          | http     | `type: "http"`, `url: "https://mcp.vercel.com"`                         |
| Cloudflare Docs | http     | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"`            |
| Memory          | npx      | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**你应该看到**：重启后 MCP 服务器正常启动。

---

## 常见问题 4：Filesystem MCP 路径配置错误

### 症状

- Filesystem 工具无法访问任何文件
- 提示 "Path not accessible" 或 "Permission denied"

### 原因

Filesystem MCP 的路径参数未替换为实际的项目路径。

### 解决方案

**第 1 步：检查配置**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**第 2 步：替换为实际路径**

根据你的操作系统替换路径：

**macOS/Linux**：
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**：
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**第 3 步：验证权限**

确保配置的路径你有读写权限。

**你应该看到**：Filesystem 工具可以正常访问和操作指定路径下的文件。

### 踩坑提醒

::: warning 注意事项
- 不要使用 `~` 符号，必须使用完整路径
- Windows 路径中的反斜杠需要转义为 `\\`
- 确保路径末尾没有多余的分隔符
:::

---

## 常见问题 5：Supabase 项目引用未配置

### 症状

Supabase MCP 连接失败，提示 "Missing project reference"。

### 原因

Supabase MCP 的 `--project-ref` 参数未配置。

### 解决方案

**第 1 步：获取项目引用**

在 Supabase Dashboard 中：
1. 进入项目设置
2. 找到 "Project Reference" 或 "API" 部分
3. 复制项目 ID（格式类似 `xxxxxxxxxxxxxxxx`）

**第 2 步：更新配置**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**你应该看到**：Supabase 工具可以正常查询数据库。

---

## 常见问题 6：npx 命令未找到

### 症状

```
Failed to start MCP server: npx: command not found
```

### 原因

系统未安装 Node.js 或 npx 不在 PATH 中。

### 解决方案

**第 1 步：检查 Node.js 版本**

```bash
node --version
```

**第 2 步：安装 Node.js（如果缺失）**

访问 [nodejs.org](https://nodejs.org/) 下载并安装最新的 LTS 版本。

**第 3 步：验证 npx**

```bash
npx --version
```

**你应该看到**：npx 版本号正常显示。

---

## 排查流程图

遇到 MCP 问题时，按以下顺序排查：

```
1. 检查 API 密钥是否配置
   ↓ (已配置)
2. 检查启用的 MCP 数量是否 < 10
   ↓ (数量正常)
3. 检查服务器类型（npx vs http）
   ↓ (类型正确)
4. 检查路径参数（Filesystem、Supabase）
   ↓ (路径正确)
5. 检查 Node.js 和 npx 是否可用
   ↓ (可用)
问题解决！
```

---

## 本课小结

MCP 连接问题大多与配置相关，记住以下要点：

- ✅ **API 密钥**：替换所有 `YOUR_*_HERE` 占位符
- ✅ **上下文管理**：启用 < 10 个 MCP，使用 `disabledMcpServers` 禁用不需要的
- ✅ **服务器类型**：区分 npx 和 http 类型
- ✅ **路径配置**：Filesystem 和 Supabase 需要配置具体路径/引用
- ✅ **环境依赖**：确保 Node.js 和 npx 可用

如果问题仍未解决，检查 `~/.claude/settings.json` 和项目级配置是否有冲突。

---



## 下一课预告

> 下一课我们学习 **[Agent 调用失败排查](../troubleshooting-agents/)**。
>
> 你会学到：
> - Agent 未加载和配置错误的排查方法
> - 工具权限不足的解决策略
> - Agent 执行超时和输出不符合预期的诊断

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能           | 文件路径                                                                                                                    | 行号  |
|--- | --- | ---|
| MCP 配置文件   | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91  |
| 上下文窗口警告 | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                                       | 67-75 |

**关键配置**：
- `mcpServers.mcpServers.*.command`：npx 类型服务器的启动命令
- `mcpServers.mcpServers.*.args`：启动参数
- `mcpServers.mcpServers.*.env`：环境变量（API 密钥）
- `mcpServers.mcpServers.*.type`：服务器类型（"npx" 或 "http"）
- `mcpServers.mcpServers.*.url`：http 类型服务器的 URL

**重要注释**：
- `mcpServers._comments.env_vars`：替换 `YOUR_*_HERE` 占位符
- `mcpServers._comments.disabling`：使用 `disabledMcpServers` 禁用服务器
- `mcpServers._comments.context_warning`：启用 < 10 个 MCP 保留上下文窗口

</details>
