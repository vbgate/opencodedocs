---
title: "Config Reference: settings.json Guide | Everything Claude Code"
sidebarTitle: "Config Reference"
subtitle: "Configuration File Guide: Complete settings.json Reference"
description: "Learn complete configuration options for Everything Claude Code. Configure Hooks, MCP servers, plugin manifests, and resolve conflicts."
tags:
  - "config"
  - "settings"
  - "json"
  - "hooks"
  - "mcp"
prerequisite:
  - "/start/installation/"
  - "/start/mcp-setup/"
order: 190
---

# Configuration File Guide: Complete settings.json Reference

## What You'll Learn

After completing this tutorial, you will be able to:

- Fully understand all configuration options in `~/.claude/settings.json`
- Customize Hooks automation workflows
- Configure and manage MCP servers
- Modify plugin manifests and path configurations
- Resolve configuration conflicts and troubleshoot issues

## Your Current Challenge

You're already using Everything Claude Code, but you're encountering these problems:

- "Why isn't a specific Hook triggering?"
- "MCP server connection failed, what's wrong with the configuration?"
- "Want to customize a feature, which configuration file should I edit?"
- "Multiple configuration files are overriding each other, what's the priority?"

This tutorial will provide you with a complete configuration reference guide.

## Core Approach

Claude Code's configuration system is divided into three levels, with priority from high to low:

1. **Project-level configuration** (`.claude/settings.json`) - Effective only for the current project
2. **Global configuration** (`~/.claude/settings.json`) - Effective for all projects
3. **Plugin built-in configuration** (Everything Claude Code's default configuration)

::: tip Configuration Priority
Configurations are **merged**, not overwritten. Project-level configurations override global configurations with the same option name, but retain other options.
:::

The configuration file uses JSON format and follows the Claude Code Settings Schema:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json"
}
```

This schema provides auto-completion and validation, and it's recommended to always include it.

## Configuration File Structure

### Complete Configuration Template

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

::: warning JSON Syntax Rules
- All key names and string values must be wrapped in **double quotes**
- **Do not add a comma** after the last key-value pair
- Comments are not standard JSON syntax, use `"_comments"` field instead
:::

## Hooks Configuration Detailed Guide

Hooks are the core automation mechanism of Everything Claude Code, defining automation scripts that trigger on specific events.

### Hook Types and Trigger Timing

| Hook Type | Trigger Timing | Use Case |
|-----------|---------------|----------|
| `SessionStart` | When Claude Code session starts | Load context, detect package manager |
| `SessionEnd` | When Claude Code session ends | Save session state, evaluate extraction patterns |
| `PreToolUse` | Before tool invocation | Validate commands, block dangerous operations |
| `PostToolUse` | After tool invocation | Format code, type checking |
| `PreCompact` | Before context compaction | Save state snapshot |
| `Stop` | At the end of each AI response | Check for console.log and other issues |

### Hook Configuration Structure

Each Hook entry contains the following fields:

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Hook triggered')\""
    }
  ],
  "description": "Hook description (optional)"
}
```

#### matcher Field

Defines trigger conditions, supporting the following variables:

| Variable | Meaning | Example Value |
|----------|---------|---------------|
| `tool` | Tool name | `"Bash"`, `"Write"`, `"Edit"` |
| `tool_input.command` | Bash command content | `"npm run dev"` |
| `tool_input.file_path` | Write/Edit file path | `"/path/to/file.ts"` |

**Matching Operators**:

```javascript
// Equality
tool == "Bash"

// Regex matching
tool_input.command matches "npm run dev"
tool_input.file_path matches "\\\\.ts$"

// Logical operators
tool == "Edit" || tool == "Write"
tool == "Bash" && !(tool_input.command matches "git push")
```

#### hooks Array

Defines actions to execute, supporting two types:

**Type 1: command**

```json
{
  "type": "command",
  "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
}
```

- `${CLAUDE_PLUGIN_ROOT}` is a variable for the plugin root directory
- Commands execute in the project root directory
- Standard JSON format output will be passed to Claude Code

**Type 2: prompt** (not used in this configuration)

```json
{
  "type": "prompt",
  "prompt": "Review the code before committing"
}
```

### Complete Hooks Configuration Examples

Everything Claude Code provides 15+ pre-configured Hooks. Here is the complete configuration description:

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

**Purpose**: Force development servers to run in tmux, ensuring log accessibility.

**Matched commands**:
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

**Purpose**: Remind to use tmux for running long-duration commands.

**Matched commands**:
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

**Purpose**: Remind to review changes before pushing.

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

**Purpose**: Block creation of random .md files, keeping documentation consolidated.

**Allowed files**:
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

**Purpose**: Suggest manual context compaction at logical intervals.

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

**Purpose**: Load previous session context and detect package manager.

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

**Purpose**: Log URL and provide review command after creating a PR.

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

**Purpose**: Auto-format JS/TS files using Prettier.

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

**Purpose**: Run type checking after editing TypeScript files.

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

**Purpose**: Detect and warn about console.log statements in files.

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

**Purpose**: Check for console.log in modified files.

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

**Purpose**: Save state before context compaction.

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

**Purpose**: Persist session state.

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

**Purpose**: Evaluate session to extract reusable patterns.

### Customizing Hooks

You can customize Hooks in the following ways:

#### Method 1: Edit settings.json

```bash
# Edit global configuration
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

#### Method 2: Project-level Configuration Override

Create `.claude/settings.json` in the project root:

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

::: tip Advantages of Project-level Configuration
- Doesn't affect global configuration
- Only effective in specific projects
- Can be committed to version control
:::

## MCP Server Configuration Detailed Guide

MCP (Model Context Protocol) servers extend Claude Code's external service integration capabilities.

### MCP Configuration Structure

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

### MCP Server Types

#### Type 1: npx

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

**Field descriptions**:
- `command`: Execution command, usually `npx`
- `args`: Parameter array, `-y` auto-confirms installation
- `env`: Environment variables object
- `description`: Description text

#### Type 2: http

```json
{
  "vercel": {
    "type": "http",
    "url": "https://mcp.vercel.com",
    "description": "Vercel deployments and projects"
  }
}
```

**Field descriptions**:
- `type`: Must be `"http"`
- `url`: Server URL
- `description`: Description text

### Everything Claude Code Pre-configured MCP Servers

Here is the list of all pre-configured MCP servers:

| Server Name | Type | Description | Configuration Required |
|-------------|------|-------------|------------------------|
| `github` | npx | GitHub operations (PRs, Issues, Repos) | GitHub PAT |
| `firecrawl` | npx | Web scraping and crawling | Firecrawl API Key |
| `supabase` | npx | Supabase database operations | Project Ref |
| `memory` | npx | Cross-session persistent memory | None |
| `sequential-thinking` | npx | Chain-of-thought reasoning | None |
| `vercel` | http | Vercel deployments and projects | None |
| `railway` | npx | Railway deployments | None |
| `cloudflare-docs` | http | Cloudflare documentation search | None |
| `cloudflare-workers-builds` | http | Cloudflare Workers builds | None |
| `cloudflare-workers-bindings` | http | Cloudflare Workers bindings | None |
| `cloudflare-observability` | http | Cloudflare logs and monitoring | None |
| `clickhouse` | http | ClickHouse analytics queries | None |
| `context7` | npx | Real-time documentation lookup | None |
| `magic` | npx | Magic UI components | None |
| `filesystem` | npx | File system operations | Path configuration |

### Adding MCP Servers

#### Add from Pre-configured

1. Copy server configuration from `mcp-configs/mcp-servers.json`
2. Paste to your `~/.claude/settings.json`

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

3. Replace `YOUR_*_HERE` placeholders with actual values

#### Add Custom MCP Server

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

### Disabling MCP Servers

Use the `disabledMcpServers` array to disable specific servers:

```json
{
  "mcpServers": {
    "github": { /* ... */ },
    "firecrawl": { /* ... */ }
  },
  "disabledMcpServers": ["github", "firecrawl"]
}
```

::: warning Context Window Warning
Enabling too many MCP servers consumes significant context window space. It's recommended to enable **fewer than 10** MCP servers.
:::

## Plugin Configuration Detailed Guide

### plugin.json Structure

`.claude-plugin/plugin.json` is the plugin manifest file, defining plugin metadata and component paths.

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

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Y | Plugin name |
| `description` | string | Y | Plugin description |
| `author.name` | string | Y | Author name |
| `author.url` | string | N | Author homepage URL |
| `homepage` | string | N | Plugin homepage |
| `repository` | string | N | Repository URL |
| `license` | string | N | License |
| `keywords` | string[] | N | Keyword array |
| `commands` | string | Y | Commands directory path |
| `skills` | string | Y | Skills directory path |

### Modifying Plugin Paths

If you need to customize component paths, modify `plugin.json`:

```json
{
  "name": "my-custom-claude-config",
  "commands": "./custom-commands",
  "skills": "./custom-skills"
}
```

## Other Configuration Files

### package-manager.json

Package manager configuration, supports project-level and global-level:

```json
{
  "packageManager": "pnpm"
}
```

**Locations**:
- Global: `~/.claude/package-manager.json`
- Project: `.claude/package-manager.json`

### marketplace.json

Plugin marketplace manifest, used for `/plugin marketplace add` command:

```json
{
  "name": "everything-claude-code",
  "displayName": "Everything Claude Code",
  "description": "Complete collection of Claude Code configs",
  "url": "https://github.com/affaan-m/everything-claude-code"
}
```

### statusline.json

Status bar configuration example:

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

## Configuration File Merging and Priority

### Merging Strategy

Configuration files are merged in the following order (later ones have higher priority):

1. Plugin built-in configuration
2. Global configuration (`~/.claude/settings.json`)
3. Project configuration (`.claude/settings.json`)

**Example**:

```json
// Plugin built-in
{
  "hooks": {
    "PreToolUse": [/* Hook A */]
  }
}

// Global configuration
{
  "hooks": {
    "PreToolUse": [/* Hook B */]
  }
}

// Project configuration
{
  "hooks": {
    "PreToolUse": [/* Hook C */]
  }
}

// Final merged result (project configuration takes priority)
{
  "hooks": {
    "PreToolUse": [/* Hook C */]  // Hook C overrides A and B
  }
}
```

::: warning Important Notes
- **Same-name arrays are completely overwritten**, not appended
- It's recommended to only define the parts that need to be overridden in project configuration
- Use `/debug config` command to view the complete configuration
:::

### Environment Variables Configuration

Define environment variables in `settings.json`:

```json
{
  "environmentVariables": {
    "CLAUDE_PACKAGE_MANAGER": "pnpm",
    "NODE_ENV": "development"
  }
}
```

::: tip Security Reminder
- Environment variables are exposed in configuration files
- Do not store sensitive information in configuration files
- Use system environment variables or `.env` files to manage keys
:::

## Common Configuration Issues Troubleshooting

### Issue 1: Hook Not Triggering

**Possible causes**:
1. Matcher expression error
2. Hook configuration format error
3. Configuration file not properly saved

**Troubleshooting steps**:

```bash
# Check configuration syntax
cat ~/.claude/settings.json | python -m json.tool

# Verify if Hook is loaded
# Execute in Claude Code
/debug config
```

**Common fixes**:

```json
// ❌ Wrong: Single quotes
{
  "matcher": "tool == 'Bash'"
}

// ✅ Correct: Double quotes
{
  "matcher": "tool == \"Bash\""
}
```

### Issue 2: MCP Server Connection Failed

**Possible causes**:
1. Environment variable not configured
2. Network issues
3. Server URL error

**Troubleshooting steps**:

```bash
# Test MCP server
npx @modelcontextprotocol/server-github --help

# Check environment variables
echo $GITHUB_PERSONAL_ACCESS_TOKEN
```

**Common fixes**:

```json
// ❌ Wrong: Incorrect environment variable name
{
  "env": {
    "GITHUB_TOKEN": "ghp_xxx"  // Should be GITHUB_PERSONAL_ACCESS_TOKEN
  }
}

// ✅ Correct
{
  "env": {
    "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_xxx"
  }
}
```

### Issue 3: Configuration Conflicts

**Symptom**: Some configuration items don't take effect

**Cause**: Project-level configuration overrides global configuration

**Solution**:

```bash
# View project configuration
cat .claude/settings.json

# View global configuration
cat ~/.claude/settings.json

# Delete project configuration (if not needed)
rm .claude/settings.json
```

### Issue 4: JSON Format Error

**Symptom**: Claude Code cannot read configuration

**Troubleshooting tools**:

```bash
# Validate using jq
cat ~/.claude/settings.json | jq '.'

# Validate using Python
cat ~/.claude/settings.json | python -m json.tool

# Use online tool
# https://jsonlint.com/
```

**Common errors**:

```json
// ❌ Wrong: Trailing comma
{
  "hooks": {
    "PreToolUse": []
  },
}

// ❌ Wrong: Single quotes
{
  "description": 'Hooks configuration'
}

// ❌ Wrong: Comments
{
  "hooks": {
    // This is a comment
  }
}

// ✅ Correct
{
  "hooks": {
    "PreToolUse": []
  }
}
```

## Lesson Summary

This tutorial systematically explained the complete configuration system of Everything Claude Code:

**Core Concepts**:
- Configuration is divided into three levels: project-level, global-level, and plugin-level
- Configuration priority: Project > Global > Plugin
- JSON format is strict; pay attention to double quotes and syntax

**Hooks Configuration**:
- 6 Hook types, 15+ pre-configured Hooks
- Matcher expressions define trigger conditions
- Supports custom Hooks and project-level overrides

**MCP Servers**:
- Two types: npx and http
- 15+ pre-configured servers
- Supports disabling and customization

**Plugin Configuration**:
- plugin.json defines plugin metadata
- Supports custom component paths
- marketplace.json is used for plugin marketplace

**Other Configurations**:
- package-manager.json: Package manager configuration
- statusline.json: Status bar configuration
- environmentVariables: Environment variable definitions

**Common Issues**:
- Hook not triggering → Check matcher and JSON format
- MCP connection failed → Check environment variables and network
- Configuration conflicts → View project-level and global-level configurations
- JSON format error → Use jq or online tools to validate

## Next Lesson Preview

> In the next lesson, we'll learn **[Rules Complete Reference: 8 Rule Sets Detailed Guide](../rules-reference/)**.
>
> You'll learn:
> - Security rules: Prevent sensitive data leakage
> - Coding Style rules: Code style and best practices
> - Testing rules: Test coverage and TDD requirements
> - Git Workflow rules: Commit standards and PR processes
> - How to customize rule sets to fit project needs

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|---------|-----------|-------|
| Hooks Configuration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| Plugin Manifest | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28 |
| MCP Server Configuration | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92 |
| Plugin Marketplace Manifest | [`.claude-plugin/marketplace.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/marketplace.json) | - |

**Key Hook Scripts**:
- `session-start.js`: Load context on session start
- `session-end.js`: Save state on session end
- `suggest-compact.js`: Suggest manual context compaction
- `pre-compact.js`: Save state before compaction
- `evaluate-session.js`: Evaluate session to extract patterns

**Key Environment Variables**:
- `CLAUDE_PLUGIN_ROOT`: Plugin root directory
- `GITHUB_PERSONAL_ACCESS_TOKEN`: GitHub API authentication
- `FIRECRAWL_API_KEY`: Firecrawl API authentication

</details>
