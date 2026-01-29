---
title: "配置文件详解: settings.json 完整参考 | Everything Claude Code"
sidebarTitle: "自定义所有配置"
subtitle: "配置文件详解 settings.json 完整参考"
description: "学习 Everything Claude Code 的完整配置选项。掌握 Hooks 自动化、MCP 服务器和插件配置，快速解决配置冲突。"
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "start-installation"
  - "start-mcp-setup"
order: 190
---

# 配置文件详解：settings.json 完整参考

## 学完你能做什么

- 完全理解 `~/.claude/settings.json` 的所有配置选项
- 自定义 Hooks 自动化工作流
- 配置和管理 MCP 服务器
- 修改插件清单和路径配置
- 解决配置冲突和故障

## 你现在的困境

你已经在使用 Everything Claude Code，但遇到这些问题：
- "为什么某个 Hook 没有触发？"
- "MCP 服务器连接失败，配置哪里不对？"
- "想自定义某个功能，不知道改哪个配置文件？"
- "多个配置文件互相覆盖，怎么优先级？"

本教程会给你一份完整的配置参考手册。

## 核心思路

Claude Code 的配置系统分为三级，优先级从高到低：

1. **项目级配置** (`.claude/settings.json`) - 仅当前项目生效
2. **全局配置** (`~/.claude/settings.json`) - 所有项目生效
3. **插件内置配置** (Everything Claude Code 的默认配置)

::: tip 配置优先级
配置会**合并**而非覆盖。项目级配置会覆盖全局配置中的同名选项，但保留其他选项。
:::

配置文件使用 JSON 格式，遵循 Claude Code Settings Schema：

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

这个 schema 提供了自动补全和验证，建议始终包含。

## 配置文件结构

### 完整配置模板

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",

  "mcpServers": {},

  "hooks": {
    "PreToolUse": [],
    "PostToolUse": [],
    "SessionStart": [],
    "SessionEnd": [],
    "PreCompact": [],
    "Stop": []
  },

  "disabledMcpServers": [],

  "environmentVariables": {}
}
```

::: warning JSON 语法规则
- 所有键名和字符串值必须用**双引号**包裹
- 最后一个键值对后**不要加逗号**
- 注释不是标准 JSON 语法，使用 `"_comments"` 字段代替
:::

## Hooks 配置详解

Hooks 是 Everything Claude Code 的核心自动化机制，定义了在特定事件触发的自动化脚本。

### Hook 类型与触发时机

| Hook 类型 | 触发时机 | 用途 |
|--- | --- | ---|
| `SessionStart` | Claude Code 会话开始时 | 加载上下文、检测包管理器 |
| `SessionEnd` | Claude Code 会话结束时 | 保存会话状态、评估提取模式 |
| `PreToolUse` | 工具调用前 | 验证命令、阻止危险操作 |
| `PostToolUse` | 工具调用后 | 格式化代码、类型检查 |
| `PreCompact` | 上下文压缩前 | 保存状态快照 |
| `Stop` | 每次 AI 响应结束时 | 检查 console.log 等问题 |

### Hook 配置结构

每个 Hook 条目包含以下字段：

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Hook 描述（可选）"
}
```

#### matcher 字段

定义触发条件，支持以下变量：

| 变量 | 含义 | 示例值 |
|--- | --- | ---|
| `tool` | 工具名称 | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Bash 命令内容 | `"npm run dev"` |
| `tool_input.file_path` | Write/Edit 的文件路径 | `"/path/to/file.ts"` |

**匹配操作符**：

```javascript
// 相等
tool == "Bash"

// 正则匹配
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// 逻辑运算
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### hooks 数组

定义执行的动作，支持两种类型：

**Type 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` 插件根目录的变量
- 命令会在项目根目录执行
- 标准 JSON 格式输出会被传递给 Claude Code

**Type 2: prompt**（本配置中未使用）

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### 完整 Hooks 配置示例

Everything Claude Code 提供了 15+ 个预配置 Hooks，以下是完整的配置说明：

#### PreToolUse Hooks

**1. Tmux Dev Server Block**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
    }
  ],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**用途**：强制在 tmux 中运行开发服务器，确保日志可访问。

**匹配命令**：
- `npm run dev`
- `pnpm dev` / `pnpm run dev`
- `yarn dev`
- `bun run dev`

**2. Tmux Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm (install|test)|pnpm (install|test)|yarn (install|test)?|bun (install|test)|cargo build|make|docker|pytest|vitest|playwright)\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"if(!process.env.TMUX){console.error('[Hook] Consider running in tmux for session persistence');console.error('[Hook] tmux new -s dev  |  tmux attach -t dev')}\""
    }
  ],
  "description": "Reminder to use tmux for long-running commands"
}
```

**用途**：提醒使用 tmux 运行长时间命令。

**匹配命令**：
- `npm install`, `npm test`
- `pnpm install`, `pnpm test`
- `cargo build`, `make`, `docker`
- `pytest`, `vitest`, `playwright`

**3. Git Push Reminder**

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
    }
  ],
  "description": "Reminder before git push to review changes"
}
```

**用途**：推送前提醒审查变更。

**4. Block Random MD Files**

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path||'';if(/\\.(md|txt)$/.test(p)&&!/(README|CLAUDE|AGENTS|CONTRIBUTING)\\.md$/.test(p)){console.error('[Hook] BLOCKED: Unnecessary documentation file creation');console.error('[Hook] File: '+p);console.error('[Hook] Use README.md for documentation instead');process.exit(1)}console.log(d)})\""
    }
  ],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**用途**：阻止创建随机的 .md 文件，保持文档集中。

**允许的文件**：
- `README.md`
- `CLAUDE.md`
- `AGENTS.md`
- `CONTRIBUTING.md`

**5. Suggest Compact**

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
    }
  ],
  "description": "Suggest manual compaction at logical intervals"
}
```

**用途**：在逻辑间隔处建议手动压缩上下文。

#### SessionStart Hook

**Load Previous Context**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
    }
  ],
  "description": "Load previous context and detect package manager on new session"
}
```

**用途**：加载上次会话上下文并检测包管理器。

#### PostToolUse Hooks

**1. Log PR URL**

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';const m=out.match(/https:\\/\\/github.com\\/[^/]+\\/[^/]+\\/pull\\/\\d+/);if(m){console.error('[Hook] PR created: '+m[0]);const repo=m[0].replace(/https:\\/\\/github.com\\/([^/]+\\/[^/]+)\\/pull\\/\\d+/,'$1');const pr=m[0].replace(/.*\\/pull\\/(\\d+)/,'$1');console.error('[Hook] To review: gh pr review '+pr+' --repo '+repo)}}console.log(d)})\""
    }
  ],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**用途**：创建 PR 后记录 URL 并提供审查命令。

**2. Auto Format**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
    }
  ],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**用途**：使用 Prettier 自动格式化 JS/TS 文件。

**3. TypeScript Check**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');const path=require('path');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){let dir=path.dirname(p);while(dir!==path.dirname(dir)&&!fs.existsSync(path.join(dir,'tsconfig.json'))){dir=path.dirname(dir)}if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,encoding:'utf8',stdio:['pipe','pipe','pipe']});const lines=r.split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}catch(e){const lines=(e.stdout||'').split('\\n').filter(l=>l.includes(p)).slice(0,10);if(lines.length)console.error(lines.join('\\n'))}}}console.log(d)})\""
    }
  ],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**用途**：编辑 TypeScript 文件后运行类型检查。

**4. Console.log Warning**

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{const i=JSON.parse(d);const p=i.tool_input?.file_path;if(p&&fs.existsSync(p)){const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');const matches=[];lines.forEach((l,idx)=>{if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())});if(matches.length){console.error('[Hook] WARNING: console.log found in '+p);matches.slice(0,5).forEach(m=>console.error(m));console.error('[Hook] Remove console.log before committing')}}console.log(d)})\""
    }
  ],
  "description": "Warn about console.log statements after edits"
}
```

**用途**：检测并警告文件中的 console.log 语句。

#### Stop Hook

**Check Console.log in Modified Files**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"const{execSync}=require('child_process');const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{execSync('git rev-parse --git-dir',{stdio:'pipe'})}catch{console.log(d);process.exit(0)}try{const files=execSync('git diff --name-only HEAD',{encoding:'utf8',stdio:['pipe','pipe','pipe']}).split('\\n').filter(f=>/\\.(ts|tsx|js|jsx)$/.test(f)&&fs.existsSync(f));let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}if(hasConsole)console.error('[Hook] Remove console.log statements before committing')}catch(e){}console.log(d)})\""
    }
  ],
  "description": "Check for console.log in modified files after each response"
}
```

**用途**：检查修改过的文件中的 console.log。

#### PreCompact Hook

**Save State Before Compaction**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
    }
  ],
  "description": "Save state before context compaction"
}
```

**用途**：上下文压缩前保存状态。

#### SessionEnd Hooks

**1. Persist Session State**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
    }
  ],
  "description": "Persist session state on end"
}
```

**用途**：持久化会话状态。

**2. Evaluate Session**

```json
{
  "matcher": "*",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
    }
  ],
  "description": "Evaluate session for extractable patterns"
}
```

**用途**：评估会话以提取可复用模式。

### 自定义 Hooks

你可以通过以下方式自定义 Hooks：

#### 方法 1：修改 settings.json

```bash
# 编辑全局配置
vim ~/.claude/settings.json
```

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_pattern\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Your custom hook')\""
          }
        ],
        "description": "Your custom hook"
      }
    ]
  }
}
```

#### 方法 2：项目级配置覆盖

在项目根目录创建 `.claude/settings.json`：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"your_custom_command\"",
        "hooks": [
          {
            "type": "command",
            "command": "node -e \"console.log('Project-specific hook')\""
          }
        ]
      }
    ]
  }
}
```

::: tip 项目级配置的优势
- 不影响全局配置
- 仅在特定项目生效
- 可以提交到版本控制
:::

## MCP 服务器配置详解

MCP（Model Context Protocol）服务器扩展了 Claude Code 的外部服务集成能力。

### MCP 配置结构

```json
{
  "mcpServers": {
    "server_name": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-name"],
      "env": {
        "ENV_VAR": "your_value"
      },
      "description": "Server description"
    },
    "http_server": {
      "type": "http",
      "url": "https://example.com/mcp",
      "description": "HTTP server description"
    }
  }
}
```

### MCP 服务器类型

#### 类型 1: npx

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"
    },
    "description": "GitHub operations - PRs, issues, repos"
  }
}
```

**字段说明**：
- `command`: 执行命令，通常为 `npx`
- `args`: 参数数组，`-y` 自动确认安装
- `env`: 环境变量对象
- `description`: 描述文本

#### 类型 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**字段说明**：
- `type`: 必须为 `"http"`
- `url`: 服务器 URL
- `description`: 描述文本

### Everything Claude Code 预配置 MCP 服务器

以下是所有预配置的 MCP 服务器列表：

| 服务器名 | 类型 | 描述 | 需要配置 |
|--- | --- | --- | ---|
| `github` | npx | GitHub 操作（PR、Issues、Repos） | GitHub PAT |
| `firecrawl` | npx | Web 抓取和爬取 | Firecrawl API Key |
| `supabase` | npx | Supabase 数据库操作 | Project Ref |
| `memory` | npx | 跨会话持久化内存 | 无 |
| `sequential-thinking` | npx | 链式推理 | 无 |
| `vercel` | http | Vercel 部署和项目管理 | 无 |
| `railway` | npx | Railway 部署 | 无 |
| `cloudflare-docs` | http | Cloudflare 文档搜索 | 无 |
| `cloudflare-workers-builds` | http | Cloudflare Workers 构建 | 无 |
| `cloudflare-workers-bindings` | http | Cloudflare Workers 绑定 | 无 |
| `cloudflare-observability` | http | Cloudflare 日志和监控 | 无 |
| `clickhouse` | http | ClickHouse 分析查询 | 无 |
| `context7` | npx | 实时文档查找 | 无 |
| `magic` | npx | Magic UI 组件 | 无 |
| `filesystem` | npx | 文件系统操作 | 路径配置 |

### 添加 MCP 服务器

#### 从预配置添加

1. 复制 `mcp-configs/mcp-servers.json` 中的服务器配置
2. 粘贴到你的 `~/.claude/settings.json`

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxx"
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

3. 替换 `YOUR_*_HERE` 占位符为实际值

#### 添加自定义 MCP 服务器

```json
{
  "mcpServers": {
    "my_custom_server": {
      "command": "npx",
      "args": ["-y", "@your-org/your-server"],
      "env": {
        "API_KEY": "your_api_key"
      },
      "description": "Custom MCP server"
    }
  }
}
```

### 禁用 MCP 服务器

使用 `disabledMcpServers` 数组禁用特定服务器：

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning 上下文窗口警告
启用太多 MCP 服务器会占用大量上下文窗口。建议启用 **< 10 个** MCP 服务器。
:::

## 插件配置详解

### plugin.json 结构

`.claude-plugin/plugin.json` 是插件清单文件，定义了插件元数据和组件路径。

```json
{
  "name": "everything-claude-code",
  "description": "Complete collection of battle-tested Claude Code configs",
  "author": {
    "name": "Affaan Mustafa",
    "url": "https://x.com/affaanmustafa"
  },
  "homepage": "https://github.com/affaan-m/everything-claude-code",
  "repository": "https://github.com/affaan-m/everything-claude-code",
  "license": "MIT",
  "keywords": [
    "claude-code",
    "agents",
    "skills",
    "hooks",
    "commands",
    "rules",
    "tdd",
    "code-review",
    "security",
    "workflow",
    "automation",
    "best-practices"
  ],
  "commands": "./commands",
  "skills": "./skills"
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|--- | --- | --- | ---|
| `name` | string | Y | 插件名称 |
| `description` | string | Y | 插件描述 |
| `author.name` | string | Y | 作者姓名 |
| `author.url` | string | N | 作者主页 URL |
| `homepage` | string | N | 插件主页 |
| `repository` | string | N | 仓库 URL |
| `license` | string | N | 许可证 |
| `keywords` | string[] | N | 关键词数组 |
| `commands` | string | Y | 命令目录路径 |
| `skills` | string | Y | 技能目录路径 |

### 修改插件路径

如果你需要自定义组件路径，修改 `plugin.json`：

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## 其他配置文件

### package-manager.json

包管理器配置，支持项目级和全局级：

```json
{
  "packageManager": "pnpm"
}
```

**位置**：
- 全局：`~/.claude/package-manager.json`
- 项目：`.claude/package-manager.json`

### marketplace.json

插件市场清单，用于 `/plugin marketplace add` 命令：

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

状态栏配置示例：

```json
{
  "items": [
    {
      "type": "text",
      "text": "Everything Claude Code"
    }
  ]
}
```

## 配置文件合并与优先级

### 合并策略

配置文件按以下顺序合并（后优先）：

1. 插件内置配置
2. 全局配置 (`~/.claude/settings.json`)
3. 项目配置 (`.claude/settings.json`)

**示例**：

```json
// 插件内置
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// 全局配置
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// 项目配置
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// 最终合并结果（项目配置优先）
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C 覆盖了 A 和 B
  }
}
```

::: warning 注意事项
- **同名数组会被完全覆盖**，不是追加
- 建议在项目配置中只定义需要覆盖的部分
- 查看完整配置使用 `/debug config` 命令
:::

### 环境变量配置

在 `settings.json` 中定义环境变量：

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip 安全提醒
- 环境变量会暴露在配置文件中
- 不要在配置文件中存储敏感信息
- 使用系统环境变量或 `.env` 文件管理密钥
:::

## 常见配置问题排查

### 问题 1: Hook 不触发

**可能原因**：
1. Matcher 表达式错误
2. Hook 配置格式错误
3. 配置文件未正确保存

**排查步骤**：

```bash
# 检查配置语法
cat ~/.claude/settings.json | python -m json.tool

# 验证 Hook 是否加载
# 在 Claude Code 中执行
/debug config
```

**常见修复**：

```json
// ❌ 错误：单引号
{
  "matcher": "tool == 'Bash'"
}

// ✅ 正确：双引号
{
  "matcher": "tool == \"Bash\""
}
```

### 问题 2: MCP 服务器连接失败

**可能原因**：
1. 环境变量未配置
2. 网络问题
3. 服务器 URL 错误

**排查步骤**：

```bash
# 测试 MCP 服务器
npx @modelcontextprotocol/server-github --help

# 检查环境变量
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**常见修复**：

```json
// ❌ 错误：环境变量名错误
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // 应该是 GITHUB_PERSONAL_ACCESS_TOKEN
  }
}

// ✅ 正确
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### 问题 3: 配置冲突

**症状**：某些配置项不生效

**原因**：项目级配置覆盖了全局配置

**解决方案**：

```bash
# 查看项目配置
cat .claude/settings.json

# 查看全局配置
cat ~/.claude/settings.json

# 删除项目配置（如果不需要）
rm .claude/settings.json
```

### 问题 4: JSON 格式错误

**症状**：Claude Code 无法读取配置

**排查工具**：

```bash
# 使用 jq 验证
cat ~/.claude/settings.json | jq '.'

# 使用 Python 验证
cat ~/.claude/settings.json | python -m json.tool

# 使用在线工具
# https://jsonlint.com/
```

**常见错误**：

```json
// ❌ 错误：末尾逗号
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ 错误：单引号
{
  "description": 'Hooks configuration'
}

// ❌ 错误：注释
{
  "hooks": {
    // This is a comment
  }
}

// ✅ 正确
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## 本课小结

本课系统讲解了 Everything Claude Code 的完整配置体系：

**核心概念**：
- 配置分为三级：项目级、全局级、插件级
- 配置优先级：项目 > 全局 > 插件
- JSON 格式严格，注意双引号和语法

**Hooks 配置**：
- 6 种 Hook 类型，15+ 个预配置 Hook
- Matcher 表达式定义触发条件
- 支持自定义 Hook 和项目级覆盖

**MCP 服务器**：
- 两种类型：npx 和 http
- 15+ 个预配置服务器
- 支持禁用和自定义

**插件配置**：
- plugin.json 定义插件元数据
- 支持自定义组件路径
- marketplace.json 用于插件市场

**其他配置**：
- package-manager.json：包管理器配置
- statusline.json：状态栏配置
- environmentVariables：环境变量定义

**常见问题**：
- Hook 不触发 → 检查 matcher 和 JSON 格式
- MCP 连接失败 → 检查环境变量和网络
- 配置冲突 → 查看项目级和全局级配置
- JSON 格式错误 → 使用 jq 或在线工具验证

## 下一课预告

> 下一课我们学习 **[Rules 完整参考：8 套规则集详解](../rules-reference/)**。
>
> 你会学到：
> - Security 规则：防止敏感数据泄露
> - Coding Style 规则：代码风格和最佳实践
> - Testing 规则：测试覆盖率和 TDD 要求
> - Git Workflow 规则：提交规范和 PR 流程
> - 如何自定义规则集适应项目需求

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能          | 文件路径                                                                                         | 行号  |
|--- | --- | ---|
| Hooks 配置    | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json)                 | 1-158 |
| 插件清单      | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28  |
| MCP 服务器配置 | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92  |
| 插件市场清单  | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | -     |

**关键 Hook 脚本**：
- `session-start.js`：会话开始时加载上下文
- `session-end.js`：会话结束时保存状态
- `suggest-compact.js`：建议手动压缩上下文
- `pre-compact.js`：压缩前保存状态
- `evaluate-session.js`：评估会话提取模式

**关键环境变量**：
- `CLAUDE_PLUGIN_ROOT`：插件根目录
- `GITHUB_PERSONAL_ACCESS_TOKEN`：GitHub API 认证
- `FIRECRAWL_API_KEY`：Firecrawl API 认证

</details>
