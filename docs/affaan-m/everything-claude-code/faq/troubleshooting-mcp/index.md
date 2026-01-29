---
title: "MCP Troubleshooting: Fix Connection Issues | Everything Claude Code"
sidebarTitle: "MCP Troubleshooting"
subtitle: "Troubleshooting: MCP Connection Failures"
description: "Learn to troubleshoot MCP server connection issues. Covers 6 common failures: API keys, context window, server types, paths, and npx errors."
tags:
  - "troubleshooting"
  - "mcp"
  - "configuration"
prerequisite:
  - "start-mcp-setup"
order: 160
---

# Troubleshooting: MCP Connection Failures

## Your Current Challenge

After configuring MCP servers, you may encounter these issues:

- ❌ Claude Code prompts "Failed to connect to MCP server"
- ❌ GitHub/Supabase related commands not working
- ❌ Context window suddenly shrinks, tool calls become slow
- ❌ Filesystem MCP cannot access files
- ❌ Too many MCP servers enabled, system lagging

Don't worry, these problems have clear solutions. This lesson helps you systematically troubleshoot MCP connection issues.

---

## Common Issue 1: API Key Not Configured or Invalid

### Symptoms

When you try to use GitHub, Firecrawl, and other MCP servers, Claude Code prompts:

```
Failed to execute tool: Missing GITHUB_PERSONAL_ACCESS_TOKEN
```

Or

```
Failed to connect to MCP server: Authentication failed
```

### Cause

The `YOUR_*_HERE` placeholders in the MCP configuration file were not replaced with actual API keys.

### Solution

**Step 1: Check Configuration File**

Open `~/.claude.json`, find the configuration for the corresponding MCP server:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "YOUR_GITHUB_PAT_HERE"  // ← Check here
      },
      "description": "GitHub operations - PRs, issues, repos"
    }
  }
}
```

**Step 2: Replace Placeholders**

Replace `YOUR_GITHUB_PAT_HERE` with your actual API key:

```json
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxxxxxxxxxxxxxxxxxxx"
  }
}
```

**Step 3: Getting Keys for Common MCP Servers**

| MCP Server | Environment Variable Name      | Get From                                                      |
| ---------- | ------------------------------ | ------------------------------------------------------------- |
| GitHub     | `GITHUB_PERSONAL_ACCESS_TOKEN` | GitHub Settings → Developer Settings → Personal access tokens |
| Firecrawl  | `FIRECRAWL_API_KEY`            | Firecrawl Dashboard → API Keys                                |
| Supabase   | Project reference              | Supabase Dashboard → Settings → API                           |

**You should see**: After restarting Claude Code, related tools can be called normally.

### Pitfall Warning

::: danger Security Note
Do not commit configuration files containing real API keys to Git repositories. Ensure `~/.claude.json` is in `.gitignore`.
:::

---

## Common Issue 2: Context Window Too Small

### Symptoms

- Tool call list suddenly becomes very short
- Claude prompts "Context window exceeded"
- Response speed significantly slows down

### Cause

Too many MCP servers are enabled, causing the context window to be occupied. According to the project README, **200k context window can shrink to 70k due to enabling too many MCPs**.

### Solution

**Step 1: Check Number of Enabled MCPs**

View the `mcpServers` section in `~/.claude.json`, count the number of enabled servers.

**Step 2: Use `disabledMcpServers` to Disable Unnecessary Servers**

Add to project-level configuration (`~/.claude/settings.json` or project `.claude/settings.json`):

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

**Step 3: Follow Best Practices**

Based on recommendations in the README:

- Configure 20-30 MCP servers (defined in configuration file)
- Enable < 10 MCP servers per project
- Keep active tools count < 80

**You should see**: Tool list returns to normal length, response speed improves.

### Pitfall Warning

::: tip Best Practice
Suggest enabling different MCP combinations based on project type. For example:
- Web projects: GitHub, Firecrawl, Memory, Context7
- Data projects: Supabase, ClickHouse, Sequential-thinking
:::

---

## Common Issue 3: Server Type Misconfiguration

### Symptoms

```
Failed to start MCP server: Command not found
```

Or

```
Failed to connect: Invalid server type
```

### Cause

Confusion between `npx` and `http` MCP server types.

### Solution

**Step 1: Confirm Server Type**

Check `mcp-configs/mcp-servers.json`, distinguish between two types:

**npx type** (requires `command` and `args`):
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

**http type** (requires `url`):
```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com"
  }
}
```

**Step 2: Correct Configuration**

| MCP Server      | Correct Type | Correct Configuration                                                   |
| --------------- | ------------ | ----------------------------------------------------------------------- |
| GitHub          | npx          | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-github"]` |
| Vercel          | http         | `type: "http"`, `url: "https://mcp.vercel.com"`                         |
| Cloudflare Docs | http         | `type: "http"`, `url: "https://docs.mcp.cloudflare.com/mcp"`            |
| Memory          | npx          | `command: "npx"`, `args: ["-y", "@modelcontextprotocol/server-memory"]` |

**You should see**: After restart, MCP servers start normally.

---

## Common Issue 4: Filesystem MCP Path Misconfiguration

### Symptoms

- Filesystem tools cannot access any files
- Prompts "Path not accessible" or "Permission denied"

### Cause

The path parameter for Filesystem MCP was not replaced with actual project path.

### Solution

**Step 1: Check Configuration**

```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/your/projects"],
    "description": "Filesystem operations (set your path)"
  }
}
```

**Step 2: Replace with Actual Path**

Replace path according to your operating system:

**macOS/Linux**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "/Users/yourname/projects"]
}
```

**Windows**:
```json
{
  "args": ["-y", "@modelcontextprotocol/server-filesystem", "C:\\Users\\yourname\\projects"]
}
```

**Step 3: Verify Permissions**

Ensure you have read/write permissions for the configured path.

**You should see**: Filesystem tools can normally access and operate files under the specified path.

### Pitfall Warning

::: warning Important Notes
- Do not use `~` symbol, must use full path
- Backslashes in Windows paths need to be escaped as `\\`
- Ensure no trailing separators at the end of the path
:::

---

## Common Issue 5: Supabase Project Reference Not Configured

### Symptoms

Supabase MCP connection fails, prompting "Missing project reference".

### Cause

The `--project-ref` parameter for Supabase MCP is not configured.

### Solution

**Step 1: Get Project Reference**

In Supabase Dashboard:
1. Go to project settings
2. Find "Project Reference" or "API" section
3. Copy project ID (format similar to `xxxxxxxxxxxxxxxx`)

**Step 2: Update Configuration**

```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server-supabase@latest", "--project-ref=your-project-ref-here"],
    "description": "Supabase database operations"
  }
}
```

**You should see**: Supabase tools can normally query the database.

---

## Common Issue 6: npx Command Not Found

### Symptoms

```
Failed to start MCP server: npx: command not found
```

### Cause

Node.js is not installed on the system, or npx is not in PATH.

### Solution

**Step 1: Check Node.js Version**

```bash
node --version
```

**Step 2: Install Node.js (if missing)**

Visit [nodejs.org](https://nodejs.org/) to download and install the latest LTS version.

**Step 3: Verify npx**

```bash
npx --version
```

**You should see**: npx version number displays normally.

---

## Troubleshooting Flow

When encountering MCP issues, troubleshoot in the following order:

```
1. Check if API key is configured
   ↓ (configured)
2. Check if enabled MCP count < 10
   ↓ (count normal)
3. Check server type (npx vs http)
   ↓ (type correct)
4. Check path parameters (Filesystem, Supabase)
   ↓ (path correct)
5. Check if Node.js and npx are available
   ↓ (available)
Problem solved!
```

---

## Lesson Summary

Most MCP connection issues are configuration-related, remember these key points:

- ✅ **API keys**: Replace all `YOUR_*_HERE` placeholders
- ✅ **Context management**: Enable < 10 MCPs, use `disabledMcpServers` to disable unnecessary ones
- ✅ **Server types**: Distinguish between npx and http types
- ✅ **Path configuration**: Filesystem and Supabase need specific path/reference configuration
- ✅ **Environment dependencies**: Ensure Node.js and npx are available

If the problem persists, check for conflicts between `~/.claude/settings.json` and project-level configuration.

---



## Coming Up Next

> In the next lesson, we'll learn **[Agent Call Troubleshooting](../troubleshooting-agents/)**.
>
> You'll learn:
> - Troubleshooting methods for Agent not loading and configuration errors
> - Resolution strategies for insufficient tool permissions
> - Diagnosis of Agent execution timeout and output not meeting expectations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Feature                | File Path                                                                                                                   | Lines |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----- |
| MCP configuration file | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-91  |
| Context window warning | [`README.md`](https://github.com/affaan-m/everything-claude-code/blob/main/README.md)                                       | 67-75 |

**Key configurations**:
- `mcpServers.mcpServers.*.command`: Startup command for npx type servers
- `mcpServers.mcpServers.*.args`: Startup arguments
- `mcpServers.mcpServers.*.env`: Environment variables (API keys)
- `mcpServers.mcpServers.*.type`: Server type ("npx" or "http")
- `mcpServers.mcpServers.*.url`: URL for http type servers

**Important comments**:
- `mcpServers._comments.env_vars`: Replace `YOUR_*_HERE` placeholders
- `mcpServers._comments.disabling`: Use `disabledMcpServers` to disable servers
- `mcpServers._comments.context_warning`: Enable < 10 MCPs to preserve context window

</details>
