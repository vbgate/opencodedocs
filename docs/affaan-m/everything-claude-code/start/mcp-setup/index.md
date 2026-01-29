---
title: "MCP Setup: Service Integration | Everything Claude Code"
sidebarTitle: "MCP Setup"
subtitle: "MCP Server Configuration: Extend Claude Code's External Service Integration Capabilities"
description: "Learn to configure MCP servers for external service integration. Covers server selection, API key setup, and context window optimization."
tags:
  - "mcp"
  - "configuration"
  - "integration"
prerequisite:
  - "start-installation"
order: 40
---
# MCP Server Configuration: Extend Claude Code's External Service Integration Capabilities

## What You'll Learn

- Understand what MCP is and how it extends Claude Code's capabilities
- Choose the right services from 15 pre-configured MCP servers for your project
- Properly configure API keys and environment variables
- Optimize MCP usage to avoid context window occupation

## Your Current Challenge

Claude Code has only file operations and command execution capabilities by default, but you may need to:

- Query GitHub PRs and Issues
- Scrape web page content
- Operate Supabase databases
- Query real-time documentation
- Maintain persistent memory across sessions

Handling these tasks manually requires frequent tool switching, copying and pasting, resulting in low efficiency. MCP (Model Context Protocol) servers can help you automatically complete these external service integrations.

## When to Use This Approach

**Suitable for MCP servers**:
- Projects involving third-party services like GitHub, Vercel, Supabase
- Need to query real-time documentation (e.g., Cloudflare, ClickHouse)
- Need to maintain state or memory across sessions
- Need web scraping or UI component generation

**MCP not needed**:
- Only local file operations involved
- Pure frontend development without external service integration
- Simple CRUD applications with minimal database operations

## 🎒 Preparation

Before starting configuration, please confirm:

::: warning Prerequisites

- ✅ Completed [Plugin Installation](../installation/)
- ✅ Familiar with basic JSON configuration syntax
- ✅ Have API keys for services to integrate (GitHub PAT, Firecrawl API Key, etc.)
- ✅ Understand the `~/.claude.json` configuration file location

:::

## Core Concepts

### What is MCP

**MCP (Model Context Protocol)** is the protocol Claude Code uses to connect to external services. It enables AI to access external resources like GitHub, databases, documentation queries, similar to extensions.

**How it works**:

```
Claude Code ←→ MCP Server ←→ External Service
   (local)        (middleware)       (GitHub/Supabase/...)
```

### MCP Configuration Structure

Each MCP server configuration contains:

```json
{
  "mcpServers": {
    "server-name": {
      "command": "npx",          // Startup command
      "args": ["-y", "package"],  // Command arguments
      "env": {                   // Environment variables
        "API_KEY": "YOUR_KEY"
      },
      "description": "Function description"   // Description
    }
  }
}
```

**Types**:
- **npx type**: Run using npm packages (e.g., GitHub, Firecrawl)
- **http type**: Connect to HTTP endpoints (e.g., Vercel, Cloudflare)

### Context Window Management (Critical!)

::: warning Context Warning

Each enabled MCP server occupies the context window. Enabling too many reduces the 200K context to 70K.

**Golden Rules**:
- Configure 20-30 MCP servers (all available)
- Enable < 10 per project
- Total active tools < 80

Use `disabledMcpServers` in project configuration to disable unnecessary MCPs.

:::

## Follow Along

### Step 1: View Available MCP Servers

Everything Claude Code provides **15 pre-configured MCP servers**:

| MCP Server | Type | Needs Key | Purpose |
|-----------|------|----------|---------|
| **github** | npx | ✅ GitHub PAT | PR, Issues, Repos operations |
| **firecrawl** | npx | ✅ API Key | Web scraping and crawling |
| **supabase** | npx | ✅ Project Ref | Database operations |
| **memory** | npx | ❌ | Persistent memory across sessions |
| **sequential-thinking** | npx | ❌ | Chain-of-thought reasoning enhancement |
| **vercel** | http | ❌ | Deployment and project management |
| **railway** | npx | ❌ | Railway deployment |
| **cloudflare-docs** | http | ❌ | Documentation search |
| **cloudflare-workers-builds** | http | ❌ | Workers builds |
| **cloudflare-workers-bindings** | http | ❌ | Workers bindings |
| **cloudflare-observability** | http | ❌ | Logs and monitoring |
| **clickhouse** | http | ❌ | Analytics queries |
| **context7** | npx | ❌ | Live documentation lookup |
| **magic** | npx | ❌ | UI component generation |
| **filesystem** | npx | ❌ (requires path) | Filesystem operations |

**You should see**: Complete list of 15 MCP servers covering common scenarios like GitHub, deployment, databases, documentation queries, etc.

---

### Step 2: Copy MCP Configuration to Claude Code

Copy configuration from source directory:

```bash
# Copy MCP configuration template
cp source/affaan-m/everything-claude-code/mcp-configs/mcp-servers.json ~/.claude/mcp-servers-backup.json
```

**Why**: Back up the original configuration for easy reference and comparison later.

---

### Step 3: Select Required MCP Servers

Select MCP servers according to your project needs.

**Example scenarios**:

| Project Type | Recommended MCPs |
|-------------|-----------------|
| **Full-stack app** (GitHub + Supabase + Vercel) | github, supabase, vercel, memory, context7 |
| **Frontend project** (Vercel + documentation queries) | vercel, cloudflare-docs, context7, magic |
| **Data project** (ClickHouse + analytics) | clickhouse, sequential-thinking, memory |
| **General development** | github, filesystem, memory, context7 |

**You should see**: Clear correspondence between project types and MCP servers.

---

### Step 4: Edit `~/.claude.json` Configuration File

Open your Claude Code configuration file:

::: code-group

```bash [macOS/Linux]
vim ~/.claude.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.claude.json
```

:::

Add `mcpServers` section in `~/.claude.json`:

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

**Why**: This is the core configuration that tells Claude Code which MCP servers to start.

**You should see**: `mcpServers` object containing configurations for your selected MCP servers.

---

### Step 5: Replace API Key Placeholders

For MCP servers requiring API keys, replace `YOUR_*_HERE` placeholders:

**GitHub MCP example**:

1. Generate GitHub Personal Access Token:
   - Visit https://github.com/settings/tokens
   - Create a new Token and check `repo` permissions

2. Replace placeholder in configuration:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"  // Replace with actual token
  }
}
```

**Other MCPs requiring keys**:

| MCP | Key Name | Get From |
|-----|----------|----------|
| **firecrawl** | FIRECRAWL_API_KEY | https://www.firecrawl.dev/ |
| **supabase** | --project-ref | https://supabase.com/dashboard |

**Why**: Without actual keys, MCP servers cannot connect to external services.

**You should see**: All `YOUR_*_HERE` placeholders replaced with actual keys.

---

### Step 6: Configure Project-Level MCP Disable (Recommended)

To avoid enabling all MCPs for all projects, create `.claude/config.json` in the project root:

```json
{
  "disabledMcpServers": [
    "supabase",      // Disable unnecessary MCPs
    "railway",
    "firecrawl"
  ]
}
```

**Why**: This allows flexible control of which MCPs take effect at the project level, avoiding context window occupation.

**You should see**: `.claude/config.json` file containing `disabledMcpServers` array.

---

### Step 7: Restart Claude Code

Restart Claude Code to make configuration take effect:

```bash
# Stop Claude Code (if running)
# Then restart
claude
```

**Why**: MCP configuration is loaded at startup and requires a restart to take effect.

**You should see**: After Claude Code starts, MCP servers are automatically loaded.

## Checkpoint ✅

Verify MCP configuration is successful:

1. **Check MCP loading status**:

   Enter in Claude Code:

```bash
/tool list
```

**Expected result**: See list of loaded MCP servers and tools.

2. **Test MCP functionality**:

   If you enabled GitHub MCP, test query:

```bash
# Query GitHub Issues
@mcp list issues
```

**Expected result**: Returns list of Issues from your repository.

3. **Check context window**:

   View tool count in `~/.claude.json`:

```bash
jq '.mcpServers | length' ~/.claude.json
```

**Expected result**: Number of enabled MCP servers < 10.

::: tip Debugging Tips

If MCP didn't load successfully, check Claude Code log files:
- macOS/Linux: `~/.claude/logs/`
- Windows: `%USERPROFILE%\.claude\logs\`

:::

## Common Pitfalls

### Pitfall 1: Too Many MCPs Enabled Causing Insufficient Context

**Symptom**: Context window only 70K at conversation start instead of 200K.

**Cause**: Every MCP's enabled tools occupy the context window.

**Solution**:
1. Check number of enabled MCPs (`~/.claude.json`)
2. Use project-level `disabledMcpServers` to disable unnecessary MCPs
3. Keep total active tools < 80

---

### Pitfall 2: API Keys Not Properly Configured

**Symptom**: Permission errors or connection failures when calling MCP functions.

**Cause**: `YOUR_*_HERE` placeholders not replaced.

**Solution**:
1. Check `env` field in `~/.claude.json`
2. Confirm all placeholders are replaced with actual keys
3. Verify keys have sufficient permissions (e.g., GitHub Token needs `repo` permissions)

---

### Pitfall 3: Filesystem MCP Path Error

**Symptom**: Filesystem MCP cannot access specified directory.

**Cause**: Path in `args` not replaced with actual path.

**Solution**:
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"],  // Replace with your project path
    "description": "Filesystem operations"
  }
}
```

---

### Pitfall 4: Project-Level Configuration Not Taking Effect

**Symptom**: `disabledMcpServers` in project root doesn't disable MCPs.

**Cause**: `.claude/config.json` path or format error.

**Solution**:
1. Confirm file is in project root: `.claude/config.json`
2. Check if JSON format is correct (validate with `jq .`)
3. Confirm `disabledMcpServers` is a string array

## Lesson Summary

This lesson covered MCP server configuration:

**Key points**:
- MCP extends Claude Code's external service integration capabilities
- Choose suitable servers from 15 pre-configured MCPs (recommend < 10)
- Replace `YOUR_*_HERE` placeholders with actual API keys
- Use project-level `disabledMcpServers` to control enabled count
- Keep total active tools < 80 to avoid context window occupation

**Next steps**: You've configured MCP servers. Next lesson, learn how to use core Commands.

## Coming Up Next

> In the next lesson, we'll learn **[Core Commands Explained](../../platforms/commands-overview/)**.
>
> You'll learn:
> - Features and usage scenarios for 14 slash commands
> - How `/plan` command creates implementation plans
> - How `/tdd` command executes test-driven development
> - How to quickly trigger complex workflows through commands

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Feature | File Path | Lines |
|---------|-----------|-------|
| MCP configuration template | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| README important notes | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 348-369 |
| Installation guide - MCP configuration | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md) | 236-240 |

**Key configurations**:
- 15 MCP servers (GitHub, Firecrawl, Supabase, Memory, Sequential-thinking, Vercel, Railway, Cloudflare series, ClickHouse, Context7, Magic, Filesystem)
- Supports two types: npx (command line) and http (endpoint connection)
- Use `disabledMcpServers` project-level configuration to control enabled count

**Key rules**:
- Configure 20-30 MCP servers
- Enable < 10 per project
- Total active tools < 80
- Risk of context window shrinking from 200K to 70K

</details>
