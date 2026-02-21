---
title: "Skill System: Extending Agent Capabilities | OpenClaw Tutorial"
sidebarTitle: "Skill System"
subtitle: "Skill System - Extending Agent Capabilities"
description: "Deep dive into the OpenClaw skill system architecture. Learn how to install built-in skills, create custom skills, and extend the boundaries of your AI assistant's capabilities."
tags:
  - "skills"
  - "extensions"
  - "custom"
order: 120
---

# Skill System - Extending Agent Capabilities

::: info What You'll Learn
After completing this tutorial, you will be able to:
- Understand the skill system architecture and how it works
- Install and manage built-in skills
- Create custom skills
- Configure skill permissions and environments
:::

## Core Concepts

**Skills** are the core mechanism for extending an AI assistant's capabilities in OpenClaw. Through skills, AI can invoke external tools, access specific data, and perform domain-specific tasks.

```
┌─────────────────────────────────────────────────────────────┐
│                   Skill System Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │               Agent (Pi)                            │  │
│   │  ┌──────────────┐  ┌──────────────┐                │  │
│   │  │ System Skills│  │ User Skills  │                │  │
│   │  │ - File Ops   │  │ - Database   │                │  │
│   │  │ - Code Exec  │  │ - API Calls  │                │  │
│   │  │ - Browser    │  │ - Custom Tools│               │  │
│   │  └──────┬───────┘  └──────┬───────┘                │  │
│   │         │                 │                        │  │
│   │         └────────┬────────┘                        │  │
│   │                  │                                 │  │
│   │                  ▼                                 │  │
│   │         ┌─────────────────┐                       │  │
│   │         │  Skill Registry │                       │  │
│   │         │  - Metadata Mgmt│                       │  │
│   │         │  - Permission Ctrl                       │  │
│   │         └────────┬────────┘                       │  │
│   └──────────────────┼────────────────────────────────┘  │
│                      │                                    │
│                      ▼                                    │
│   ┌───────────────────────────────────────────────────┐  │
│   │               Skill Execution Environment         │  │
│   │  ┌──────────┐  ┌──────────┐  ┌──────────┐        │  │
│   │  │ Node.js  │  │ Python   │  │ Docker   │        │  │
│   │  │ Runtime  │  │ Runtime  │  │ Sandbox  │        │  │
│   │  └──────────┘  └──────────┘  └──────────┘        │  │
│   └───────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Skill Types

| Type | Description | Examples |
| --- | --- | --- |
| **Built-in** | OpenClaw core built-in | File operations, Code execution |
| **Bundled** | Distributed with OpenClaw | Databases, API tools |
| **Custom** | User-developed | Business-specific tools |
| **Remote** | Provided over network | Third-party services |

## Hands-on Guide

### Step 1: List Available Skills

**Why**  
Understand what skills are available in the system.

```bash
# List all skills
openclaw skills list

# List enabled skills only
openclaw skills list --enabled

# View skill details
openclaw skills info filesystem
```

**You should see**

```
┌─────────────────────────────────────────────────────────────┐
│  Available Skills                                           │
├─────────────────────────────────────────────────────────────┤
│  ✅ filesystem     File system operations (built-in)       │
│  ✅ code-execution Code execution (built-in)               │
│  ✅ browser        Browser control (built-in)              │
│  🔧 postgres       PostgreSQL connection (bundled)         │
│  🔧 mysql          MySQL connection (bundled)              │
│  🔧 redis          Redis operations (bundled)              │
│  📦 my-custom      Custom skill (custom)                   │
└─────────────────────────────────────────────────────────────┘
```

### Step 2: Enable Skills

**Why**  
Skills must be explicitly enabled before they can be used in conversations.

```bash
# Enable a skill
openclaw skills enable postgres

# Disable a skill
openclaw skills disable redis

# Enable multiple skills
openclaw skills enable postgres mysql redis
```

**Skill Configuration** (`src/config/types.skills.ts`)

```typescript
type SkillsConfig = {
  allowBundled?: string[];       // Whitelist of allowed bundled skills
  load?: SkillsLoadConfig;       // Load configuration
  install?: SkillsInstallConfig; // Install configuration
  entries?: Record<string, SkillConfig>;  // Skill configurations
};

type SkillConfig = {
  enabled?: boolean;             // Whether enabled
  apiKey?: string;               // API Key
  env?: Record<string, string>;  // Environment variables
  config?: Record<string, unknown>;  // Custom configuration
};
```

### Step 3: Configure Skills

**Why**  
Each skill may require specific configuration (connection strings, API Keys, etc.).

```bash
# Configure PostgreSQL skill
openclaw config set skills.entries.postgres.enabled true
openclaw config set skills.entries.postgres.config.connectionString "postgresql://user:pass@localhost/db"

# Configure API skill
openclaw config set skills.entries.weather.enabled true
openclaw config set skills.entries.weather.apiKey "your-weather-api-key"
```

**Configuration File Example**

```json
{
  "skills": {
    "allowBundled": ["postgres", "mysql", "redis"],
    "entries": {
      "postgres": {
        "enabled": true,
        "config": {
          "connectionString": "postgresql://user:pass@localhost:5432/mydb",
          "maxConnections": 10
        }
      },
      "weather": {
        "enabled": true,
        "apiKey": "${WEATHER_API_KEY}",
        "config": {
          "units": "metric",
          "language": "en"
        }
      }
    }
  }
}
```

### Step 4: Configure Skill Installation Preferences

**Why**  
Skills may depend on external tools; you need to specify installation methods.

```bash
# Configure to prefer Homebrew
openclaw config set skills.install.preferBrew true

# Configure Node package manager
openclaw config set skills.install.nodeManager pnpm

# Options: npm, yarn, bun
```

**Installation Configuration** (`src/agents/skills.ts`)

```typescript
export function resolveSkillsInstallPreferences(config?: OpenClawConfig): SkillsInstallPreferences {
  const raw = config?.skills?.install;
  const preferBrew = raw?.preferBrew ?? true;
  const managerRaw = typeof raw?.nodeManager === "string" ? raw.nodeManager.trim() : "";
  const manager = managerRaw.toLowerCase();
  const nodeManager: SkillsInstallPreferences["nodeManager"] =
    manager === "pnpm" || manager === "yarn" || manager === "bun" || manager === "npm"
      ? manager
      : "npm";
  return { preferBrew, nodeManager };
}
```

### Step 5: Create Custom Skills

**Why**  
Develop tools for specific business requirements.

**Skill Directory Structure**

```
skills/my-skill/
├── SKILL.md          # Skill description file
├── package.json      # Node.js project configuration
├── src/
│   └── index.ts      # Skill entry point
└── README.md         # Usage instructions
```

**SKILL.md Example**

```markdown
# My Custom Skill

## Description
Custom skill example, providing business-specific tools.

## Tools

### get_customer_info
Get customer information

**Input:**
- customerId: string - Customer ID

**Output:**
- name: string - Customer name
- email: string - Customer email
- orders: array - Order list

## Configuration
- apiEndpoint: string - API endpoint
- apiKey: string - API key
```

**Skill Code Example** (`src/index.ts`)

```typescript
import { defineSkill } from 'openclaw/skill-sdk';

export default defineSkill({
  name: 'my-custom',
  version: '1.0.0',
  
  // Configuration Schema
  configSchema: {
    apiEndpoint: { type: 'string', required: true },
    apiKey: { type: 'string', required: true },
    timeout: { type: 'number', default: 5000 }
  },
  
  // Define tools
  tools: [
    {
      name: 'get_customer_info',
      description: 'Get customer information',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: 'Customer ID' }
        },
        required: ['customerId']
      },
      async handler({ customerId }, { config }) {
        const response = await fetch(`${config.apiEndpoint}/customers/${customerId}`, {
          headers: { 'Authorization': `Bearer ${config.apiKey}` }
        });
        return response.json();
      }
    },
    {
      name: 'create_order',
      description: 'Create order',
      inputSchema: {
        type: 'object',
        properties: {
          customerId: { type: 'string' },
          items: { type: 'array', items: { type: 'object' } }
        },
        required: ['customerId', 'items']
      },
      async handler({ customerId, items }, { config }) {
        // Implement create order logic
      }
    }
  ]
});
```

### Step 6: Install Custom Skills

**Why**  
Register custom skills into OpenClaw.

```bash
# Install from local directory
openclaw skills install ./skills/my-skill

# Install from Git repository
openclaw skills install https://github.com/user/my-skill.git

# Install from npm package
openclaw skills install my-openclaw-skill

# Enable newly installed skill
openclaw skills enable my-custom
```

### Step 7: Configure Skill Whitelist

**Why**  
Limit available bundled skills to control security and scope.

```bash
# Only allow specific bundled skills
openclaw config set skills.allowBundled "["filesystem","code-execution","browser"]"
```

::: warning Security Recommendations
- Use whitelist in production to limit skills
- Enable sensitive skills (like code execution) with caution
- Review custom skill code before installation
:::

## Checkpoint ✅

Verify skill configuration:

```bash
# Check skill status
openclaw skills status

# Expected output
┌─────────────────────────────────────────────────────────────┐
│  Skills Status                                              │
├─────────────────────────────────────────────────────────────┤
│  ✅ filesystem      enabled (built-in)                     │
│  ✅ code-execution  enabled (built-in)                     │
│  ✅ browser         enabled (built-in)                     │
│  ✅ postgres        enabled (bundled)                      │
│  🔧 mysql           disabled (bundled)                     │
│  ✅ my-custom       enabled (custom)                       │
└─────────────────────────────────────────────────────────────┘

# Test a skill
openclaw skills test postgres
```

## Troubleshooting Guide

::: warning Common Issues
1. **Skill not enabled**  
   Symptom: `Skill not found`  
   Solution: Run `openclaw skills enable <skill-name>`

2. **Configuration error**  
   Symptom: `Config validation failed`  
   Solution: Check configuration requirements in SKILL.md, ensure all required fields are set

3. **Dependencies not installed**  
   Symptom: `Command not found`  
   Solution: Skills auto-install dependencies, or manually run `openclaw skills install <skill>`

4. **Insufficient permissions**  
   Symptom: `Permission denied`  
   Solution: Check permission settings in skill configuration, ensure whitelist includes this skill

5. **Invalid API Key**  
   Symptom: `Authentication failed`  
   Solution: Check skill's API Key configuration, ensure correct credentials are used
:::

## Skill Development Best Practices

### 1. Clear Descriptions

Provide in SKILL.md:
- Clear skill description
- Input/output definitions for each tool
- Configuration item descriptions
- Usage examples

### 2. Error Handling

```typescript
async handler(params, context) {
  try {
    // Business logic
  } catch (error) {
    return {
      error: true,
      message: error.message,
      suggestion: 'Please check network connection or API configuration'
    };
  }
}
```

### 3. Input Validation

```typescript
inputSchema: {
  type: 'object',
  properties: {
    email: { 
      type: 'string', 
      pattern: '^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$',
      description: 'Valid email address'
    }
  }
}
```

### 4. Sensitive Information Handling

- Store API Keys in environment variables
- Don't print sensitive info in logs
- Support variable substitution in config files `${ENV_VAR}`

## Lesson Summary

In this tutorial, you learned:

- ✅ Skill system architecture and how it works
- ✅ Viewing and enabling built-in skills
- ✅ Configuring skill parameters and environments
- ✅ Creating custom skills
- ✅ Installing local and remote skills
- ✅ Configuring skill whitelist
- ✅ Skill development best practices

## Next Steps

> Next up, we'll cover **[Cron Automation](../cron-automation/)**.
>
> You'll learn:
> - Cron job configuration
> - Timed Agent triggers
> - Automated workflow design

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Skill System Core | [`src/agents/skills.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/skills.ts) | 1-47 |
| Skill Workspace Management | [`src/agents/skills/workspace.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/skills/workspace.ts) | - |
| Skill Configuration Types | [`src/config/types.skills.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.skills.ts) | 1-32 |
| Skill Refresh | [`src/agents/skills/refresh.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/skills/refresh.ts) | - |
| Built-in Skills Directory | [`skills/`](https://github.com/openclaw/openclaw/blob/main/skills/) | - |
| Remote Skills | [`src/infra/skills-remote.ts`](https://github.com/openclaw/openclaw/blob/main/src/infra/skills-remote.ts) | - |

**Skill SDK Exports**:
- `defineSkill()`: Define skill
- `SkillConfig`: Skill configuration type
- `SkillTool`: Tool definition type

</details>
