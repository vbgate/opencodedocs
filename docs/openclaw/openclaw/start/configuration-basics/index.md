---
title: "Configuration Basics - Understanding openclaw.json Structure | OpenClaw Tutorial"
sidebarTitle: "Configuration Basics"
subtitle: "Configuration Basics - Understanding openclaw.json Structure"
description: "Deep dive into OpenClaw's configuration file structure, environment variable usage, and detailed explanation of key configuration options. Master the core concepts of system configuration."
tags:
  - "Configuration"
  - "Getting Started"
  - "openclaw.json"
order: 40
---

# Configuration Basics - Understanding openclaw.json Structure

## What You'll Learn

After completing this tutorial, you will be able to:
- Understand the complete structure of the `openclaw.json` configuration file
- Use environment variables to override configuration
- Configure Gateway mode and authentication methods
- Manage model providers and session settings

## Core Concepts

OpenClaw uses a JSON-formatted configuration file `openclaw.json`, located in the `.openclaw/` folder in your home directory. The configuration is divided into multiple modules, each responsible for different functional areas.

```
~/.openclaw/
├── openclaw.json          # Main configuration file
├── sessions/              # Session data
├── agents/                # Agent workspace
├── credentials/           # Credential storage
└── skills/                # Skills directory
```

### Configuration File Structure Overview

```typescript
// Configuration type definitions (src/config/types.openclaw.ts)
type OpenClawConfig = {
  meta?: {
    lastTouchedVersion?: string;    // Last modified version
    lastTouchedAt?: string;         // Last modified time
  };
  auth?: AuthConfig;               // Authentication configuration
  env?: EnvConfig;                 // Environment variables
  browser?: BrowserConfig;         // Browser configuration
  gateway?: GatewayConfig;         // Gateway configuration
  agents?: AgentsConfig;           // Agent configuration
  models?: ModelsConfig;           // Model configuration
  channels?: ChannelsConfig;       // Channel configuration
  skills?: SkillsConfig;           // Skills configuration
  cron?: CronConfig;               // Cron configuration
  tools?: ToolsConfig;             // Tools configuration
  session?: SessionConfig;         // Session configuration
  // ... more modules
};
```

## Hands-On Guide

### Step 1: View Current Configuration

**Why**  
Understanding the current configuration state is a prerequisite for modifying it.

```bash
# View complete configuration
openclaw config get

# View specific configuration paths
openclaw config get gateway.mode
openclaw config get agents.defaults.model

# Output in JSON format
openclaw config get --json
```

**Expected Output**  
JSON output of the current configuration, containing all set configuration options.

### Step 2: Set Gateway Mode

**Why**  
Gateway mode determines how the service runs.

```bash
# Set to local mode (recommended for personal use)
openclaw config set gateway.mode local

# Set to remote mode (for server deployment)
openclaw config set gateway.mode remote

# Verify the setting
openclaw config get gateway.mode
```

**Mode Comparison**

| Mode | Use Case | Security | Performance |
| --- | --- | --- | --- |
| `local` | Personal device | High (local access only) | Depends on local resources |
| `remote` | Server deployment | Requires additional security config | Depends on server resources |

### Step 3: Configure Gateway Authentication

**Why**  
Authentication protects your Gateway service from unauthorized access.

```bash
# Enable token authentication (recommended)
openclaw config set gateway.auth.mode token
openclaw config set gateway.auth.token "your-secure-token"

# Or use password authentication
openclaw config set gateway.auth.mode password
openclaw config set gateway.auth.password "your-password"

# View authentication configuration
openclaw config get gateway.auth
```

**Authentication Method Comparison**

| Method | Security | Use Case |
| --- | --- | --- |
| `token` | High | Production, remote access |
| `password` | Medium | Local development, testing |
| `off` | Low | Development testing only |

### Step 4: Configure Model Providers

**Why**  
Configuring model providers is the foundation for using AI features.

```bash
# Configure Anthropic Claude
openclaw config set models.providers.anthropic.apiKey "your-anthropic-key"

# Configure OpenAI
openclaw config set models.providers.openai.apiKey "your-openai-key"

# Configure custom provider (e.g., vLLM)
openclaw config set models.providers.vllm.baseUrl "http://localhost:8000/v1"
openclaw config set models.providers.vllm.apiKey "optional-api-key"
```

**Configuration File Example**

```json
{
  "models": {
    "providers": {
      "anthropic": {
        "baseUrl": "https://api.anthropic.com",
        "apiKey": "sk-ant-...",
        "models": [
          {
            "id": "claude-3-5-sonnet-20241022",
            "name": "Claude 3.5 Sonnet",
            "api": "anthropic-messages",
            "reasoning": true,
            "input": ["text", "image"],
            "cost": {
              "input": 3.0,
              "output": 15.0,
              "cacheRead": 0.3,
              "cacheWrite": 3.75
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  }
}
```

### Step 5: Use Environment Variables

**Why**  
Sensitive information (like API keys) should not be written directly in configuration files.

```bash
# Set environment variables
export ANTHROPIC_API_KEY="sk-ant-..."
export OPENAI_API_KEY="sk-..."

# Reference environment variables in configuration
# ~/.openclaw/openclaw.json
{
  "models": {
    "providers": {
      "anthropic": {
        "apiKey": "${ANTHROPIC_API_KEY}"
      }
    }
  }
}
```

**Environment Variable Configuration Options** (config.types.openclaw.ts)

```typescript
env?: {
  shellEnv?: {
    enabled?: boolean;     // Import environment variables from login shell
    timeoutMs?: number;    // Timeout (default 15000ms)
  };
  vars?: Record<string, string>;  // Inline environment variables
  [key: string]: string | Record<string, string> | { enabled?: boolean; timeoutMs?: number } | undefined;
};
```

### Step 6: Configure Session Management

**Why**  
Session configuration affects conversation history storage and context length.

```bash
# Set default context length
openclaw config set agents.defaults.contextTokens 128000

# Enable session persistence
openclaw config set session.persist true

# Configure session storage path
openclaw config set session.store "~/.openclaw/sessions"
```

## Checkpoint ✅

Run diagnostic commands to check your configuration:

```bash
# Run configuration diagnostics
openclaw doctor

# Validate configuration
openclaw config validate
```

**Expected Output**  
Configuration validation passed message. If there are issues, fix suggestions will be displayed.

## Pitfall Warnings

::: warning Common Configuration Errors
1. **JSON Syntax Errors**  
   Symptom: `Invalid JSON in config file`  
   Fix: Use `openclaw doctor` to repair, or use `openclaw config set` to avoid manual editing

2. **Environment Variables Not Taking Effect**  
   Symptom: API Key shows empty  
   Fix: Ensure environment variables are set before starting Gateway, use `echo $VAR_NAME` to verify

3. **Gateway Mode Conflicts**  
   Symptom: Unable to start Gateway  
   Fix: Ensure `gateway.mode` is set to `local` or `remote`, cannot be left empty

4. **Configuration Path Errors**  
   Symptom: `Config file not found`  
   Fix: Run `openclaw setup` to initialize configuration directory
:::

## Lesson Summary

In this lesson, you learned:

- ✅ The complete structure of the `openclaw.json` configuration file
- ✅ Setting Gateway run mode
- ✅ Configuring authentication methods to protect services
- ✅ Configuring model providers and API keys
- ✅ Using environment variables to manage sensitive information
- ✅ Session management and context configuration

## Next Lesson Preview

> In the next lesson, we'll learn about **[Channels Overview](../../platforms/channels-overview/)**.
>
> You'll learn:
> - 12+ messaging channels supported by OpenClaw
> - Characteristics and use cases of each channel
> - How to choose the right messaging channel

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-14

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Main configuration type definition | [`src/config/types.openclaw.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.openclaw.ts) | 28-130 |
| Gateway configuration type | [`src/config/types.gateway.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.gateway.ts) | - |
| Agent configuration type | [`src/config/types.agents.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.agents.ts) | - |
| Configuration loading logic | [`src/config/config.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/config.ts) | - |
| Model configuration type | [`src/config/types.models.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.models.ts) | 1-60 |
| Channel configuration type | [`src/config/types.channels.ts`](https://github.com/openclaw/openclaw/blob/main/src/config/types.channels.ts) | 1-55 |

**Key Constants**:
- `CONFIG_PATH`: Configuration file path `~/.openclaw/openclaw.json`
- Default Gateway port: `18789`

</details>
