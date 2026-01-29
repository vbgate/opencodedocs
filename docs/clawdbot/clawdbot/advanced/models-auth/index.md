---
title: "AI Model and Authentication Configuration: Multi-Provider, Auth Methods, and Troubleshooting | Clawdbot Tutorial"
sidebarTitle: "Models and Authentication"
subtitle: "AI Model and Authentication Configuration"
description: "Learn how to configure AI model providers (Anthropic, OpenAI, OpenRouter, Ollama, etc.) and three authentication methods (API Key, OAuth, Token) for Clawdbot. This tutorial covers auth profile management, multi-account rotation, OAuth token auto-refresh, model aliases, failover, and common troubleshooting, with practical configuration examples and CLI commands to get you started quickly."
tags:
  - "advanced"
  - "configuration"
  - "authentication"
  - "models"
prerequisite:
  - "start-getting-started"
order: 190
---

# AI Model and Authentication Configuration

## What You'll Learn

After completing this lesson, you will be able to:

- Configure multiple AI model providers (Anthropic, OpenAI, OpenRouter, etc.)
- Use three authentication methods (API Key, OAuth, Token)
- Manage multi-account authentication and credential rotation
- Configure model selection and backup models
- Troubleshoot common authentication issues

## Your Current Challenge

Clawdbot supports dozens of model providers, but configuration can be confusing:

- Should I use API Key or OAuth?
- What are the differences between authentication methods for different providers?
- How do I configure multiple accounts?
- How does OAuth token auto-refresh work?

## When to Use This

- When you need to configure AI models after first installation
- When adding new model providers or backup accounts
- When encountering authentication errors or quota limits
- When configuring model switching and backup mechanisms

## 🎒 Prerequisites

::: warning Prerequisites
This tutorial assumes you have completed [Quick Start](../../start/getting-started/), installed, and started the Gateway.
:::

- Ensure Node ≥22 is installed
- Gateway daemon is running
- Have at least one AI model provider's credentials ready (API Key or subscription account)

## Core Concepts

### Separation of Model Configuration and Authentication

In Clawdbot, **model selection** and **authentication credentials** are independent concepts:

- **Model Configuration**: Tells Clawdbot which model to use (e.g., `anthropic/claude-opus-4-5`), stored in `~/.clawdbot/models.json`
- **Authentication Configuration**: Provides credentials to access the model (e.g., API Key or OAuth token), stored in `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`

::: info Why separate?
This design allows you to flexibly switch between multiple providers and accounts without duplicating model parameter configuration.
:::

### Three Authentication Methods

Clawdbot supports three authentication methods for different scenarios:

| Auth Method | Storage Format | Typical Use Case | Supported Providers |
|--- | --- | --- | ---|
| **API Key** | `{ type: "api_key", key: "sk-..." }` | Quick start, testing | Anthropic, OpenAI, OpenRouter, DeepSeek, etc. |
| **OAuth** | `{ type: "oauth", access: "...", refresh: "..." }` | Long-running, auto-refresh | Anthropic (Claude Code CLI), OpenAI (Codex), Qwen Portal |
| **Token** | `{ type: "token", token: "..." }` | Static Bearer token | GitHub Copilot, certain custom proxies |

### Supported Model Providers

Clawdbot has built-in support for the following model providers:

::: details Built-in Providers List
| Provider | Authentication Method | Recommended Model | Notes |
|--- | --- | --- | ---|
| **Anthropic** | API Key / OAuth (Claude Code CLI) | `anthropic/claude-opus-4-5` | Recommend Claude Pro/Max + Opus 4.5 |
| **OpenAI** | API Key / OAuth (Codex) | `openai/gpt-5.2` | Supports standard OpenAI and Codex versions |
| **OpenRouter** | API Key | `openrouter/anthropic/claude-sonnet-4-5` | Aggregates hundreds of models |
| **Ollama** | HTTP Endpoint | `ollama/<model>` | Local models, no API Key needed |
| **DeepSeek** | API Key | `deepseek/deepseek-r1` | China-friendly |
| **Qwen Portal** | OAuth | `qwen-portal/<model>` | Qwen OAuth |
| **Venice** | API Key | `venice/<model>` | Privacy-first |
| **Bedrock** | AWS SDK | `amazon-bedrock/<model>` | AWS-hosted models |
| **Antigravity** | API Key | `google-antigravity/<model>` | Model proxy service |
:::

::: tip Recommended Combination
For most users, we recommend configuring **Anthropic Opus 4.5** as your primary model and **OpenAI GPT-5.2** as backup. Opus performs better in long-context and security aspects.
:::

## Follow Along

### Step 1: Configure Anthropic (Recommended)

**Why**
Anthropic Claude is Clawdbot's recommended model, especially Opus 4.5, which excels in long-context processing and security.

**Option A: Use Anthropic API Key (Fastest)**

```bash
clawdbot onboard --anthropic-api-key "$ANTHROPIC_API_KEY"
```

**You should see**:
- Gateway reloads configuration
- Default model set to `anthropic/claude-opus-4-5`
- Authentication file `~/.clawdbot/agents/default/agent/auth-profiles.json` created

**Option B: Use OAuth (Recommended for Long-running)**

OAuth is suitable for long-running Gateways, tokens auto-refresh automatically.

1. Generate setup-token (need to run Claude Code CLI on any machine):
```bash
claude setup-token
```

2. Copy the output token

3. Run on the Gateway host:
```bash
clawdbot models auth paste-token --provider anthropic
# Paste the token
```

**You should see**:
- Message "Auth profile added: anthropic:claude-cli"
- Authentication type is `oauth` (not `api_key`)

::: tip OAuth Benefits
OAuth tokens auto-refresh automatically, no manual updates needed. Suitable for continuously running Gateway daemons.
:::

### Step 2: Configure OpenAI as Backup

**Why**
Configuring a backup model allows automatic switching when the primary model (e.g., Anthropic) encounters quota limits or errors.

```bash
clawdbot onboard --openai-api-key "$OPENAI_API_KEY"
```

Or use OpenAI Codex OAuth:

```bash
clawdbot onboard --openai-codex
```

**You should see**:
- New OpenAI provider configuration in `~/.clawdbot/clawdbot.json`
- New `openai:default` or `openai-codex:codex-cli` configuration in authentication file

### Step 3: Configure Model Selection and Backup

**Why**
Configure model selection strategy to define primary model, backup models, and aliases.

Edit `~/.clawdbot/clawdbot.json`:

```yaml
agents:
  defaults:
    model:
      primary: "anthropic/claude-opus-4-5"
      fallbacks:
        - "openai/gpt-5.2"
        - "openai/gpt-5-mini"
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Field explanations**:
- `primary`: Default model to use
- `fallbacks`: Backup models to try in order (auto-switch on failure)
- `alias`: Model alias (e.g., `/model opus` equals `/model anthropic/claude-opus-4-5`)

**You should see**:
- After restarting Gateway, primary model becomes Opus 4.5
- Backup model configuration takes effect

### Step 4: Add OpenRouter (Optional)

**Why**
OpenRouter aggregates hundreds of models, suitable for accessing special or free models.

```bash
clawdbot onboard --auth-choice openrouter-api-key --token "$OPENROUTER_API_KEY"
```

Then configure the model:

```yaml
agents:
  defaults:
    model:
      primary: "openrouter/anthropic/claude-sonnet-4-5"
```

**You should see**:
- Model reference format is `openrouter/<provider>/<model>`
- Can use `clawdbot models scan` to view available models

### Step 5: Configure Ollama (Local Models)

**Why**
Ollama allows you to run models locally without API Key, suitable for privacy-sensitive scenarios.

Edit `~/.clawdbot/clawdbot.json`:

```yaml
models:
  providers:
    ollama:
      baseUrl: "http://localhost:11434"
      api: "openai-completions"
      models:
        - id: "ollama/llama3.2"
          name: "Llama 3.2"
          api: "openai-completions"
          reasoning: false
          input: ["text"]
          cost:
            input: 0
            output: 0
            cacheRead: 0
            cacheWrite: 0
          contextWindow: 128000
          maxTokens: 4096

agents:
  defaults:
    model:
      primary: "ollama/llama3.2"
```

**You should see**:
- Ollama models require no API Key
- Ensure Ollama service is running on `http://localhost:11434`

### Step 6: Verify Configuration

**Why**
Ensure authentication and model configuration are correct, Gateway can call AI normally.

```bash
clawdbot doctor
```

**You should see**:
- No authentication errors
- Model list includes your configured providers
- Status shows "OK"

Or send a test message:

```bash
clawdbot message send --to +1234567890 --message "Hello from Clawdbot"
```

**You should see**:
- AI responds normally
- No "No credentials found" errors

## Checkpoint ✅

- [ ] Configured at least one model provider (Anthropic or OpenAI)
- [ ] Authentication file `auth-profiles.json` created
- [ ] Model configuration file `models.json` generated
- [ ] Can switch models using `/model <alias>`
- [ ] No authentication errors in Gateway logs
- [ ] Test message successfully received AI response

## Common Pitfalls

### Authentication Mode Mismatch

**Problem**: OAuth configuration doesn't match authentication mode

```yaml
# ❌ Wrong: OAuth credentials but mode is token
anthropic:claude-cli:
  provider: "anthropic"
  mode: "token"  # Should be "oauth"
```

**Fix**:

```yaml
# ✅ Correct
anthropic:claude-cli:
  provider: "anthropic"
  mode: "oauth"
```

::: tip
Clawdbot automatically sets configuration imported from Claude Code CLI to `mode: "oauth"`, no manual modification needed.
:::

### OAuth Token Refresh Failure

**Problem**: Seeing "OAuth token refresh failed for anthropic" error

**Reasons**:
- Claude Code CLI credentials expired on another machine
- OAuth token expired

**Fix**:
```bash
# Regenerate setup-token
claude setup-token

# Paste again
clawdbot models auth paste-token --provider anthropic
```

::: warning token vs oauth
`type: "token"` is a static Bearer token that does not auto-refresh. `type: "oauth"` supports auto-refresh.
:::

### Quota Limits and Failover

**Problem**: Primary model encounters quota limits (429 error)

**Symptoms**:
```
HTTP 429: rate_limit_error
```

**Automatic Handling**:
- Clawdbot automatically tries the next model in `fallbacks`
- If all models fail, returns error

**Configure cooldown period** (optional):

```yaml
auth:
  cooldowns:
    billingBackoffHours: 24  # Disable provider for 24 hours after quota error
    failureWindowHours: 1      # Count failures within 1 hour towards cooldown
```

### Environment Variable Override

**Problem**: Configuration file uses environment variable but not set

```yaml
models:
  providers:
    openai:
      apiKey: "${OPENAI_KEY}"  # Will error if not set
```

**Fix**:
```bash
# Set environment variable
export OPENAI_KEY="sk-..."

# Or add to .zshrc/.bashrc
echo 'export OPENAI_KEY="sk-..."' >> ~/.zshrc
```

## Advanced Configuration

### Multi-Account and Authentication Rotation

**Why**
Configure multiple accounts for the same provider to achieve load balancing and quota management.

**Configure authentication file** (`~/.clawdbot/agents/default/agent/auth-profiles.json`):

```json
{
  "version": 1,
  "profiles": {
    "anthropic:me@example.com": {
      "type": "oauth",
      "provider": "anthropic",
      "email": "me@example.com"
    },
    "anthropic:work": {
      "type": "api_key",
      "provider": "anthropic",
      "key": "sk-ant-work..."
    },
    "openai:personal": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-1..."
    },
    "openai:work": {
      "type": "api_key",
      "provider": "openai",
      "key": "sk-openai-2..."
    }
  },
  "order": {
    "anthropic": ["anthropic:me@example.com", "anthropic:work"],
    "openai": ["openai:personal", "openai:work"]
  }
}
```

**`order` field**:
- Defines authentication rotation order
- Clawdbot tries each account in order
- Failed accounts are automatically skipped

**CLI commands to manage order**:

```bash
# View current order
clawdbot models auth order get --provider anthropic

# Set order
clawdbot models auth order set --provider anthropic anthropic:me@example.com anthropic:work

# Clear order (use default rotation)
clawdbot models auth order clear --provider anthropic
```

### Session-Specific Authentication

**Why**
Lock authentication configuration for specific sessions or sub-agents.

**Use `/model <alias>@<profileId>` syntax**:

```bash
# Lock to use specific account for current session
/model opus@anthropic:work

# Specify authentication when creating sub-agent
clawdbot sessions spawn --model "opus@anthropic:work" --workspace "~/clawd-work"
```

**Lock in configuration file** (`~/.clawdbot/clawdbot.json`):

```yaml
auth:
  order:
    # Lock anthropic order for main agent
    main: ["anthropic:me@example.com", "anthropic:work"]
```

### OAuth Token Auto-Refresh

Clawdbot supports auto-refresh for the following OAuth providers:

| Provider | OAuth Flow | Refresh Mechanism |
|--- | --- | ---|
| **Anthropic** (Claude Code CLI) | Standard authorization code | pi-mono RPC refresh |
| **OpenAI** (Codex) | Standard authorization code | pi-mono RPC refresh |
| **Qwen Portal** | Custom OAuth | `refreshQwenPortalCredentials` |
| **Chutes** | Custom OAuth | `refreshChutesTokens` |

**Auto-refresh logic**:

1. Check token expiration time (`expires` field)
2. If not expired, use directly
3. If expired, use `refresh` token to request new `access` token
4. Update stored credentials

::: tip Claude Code CLI Sync
If using Anthropic OAuth (`anthropic:claude-cli`), Clawdbot syncs back to Claude Code CLI storage when refreshing tokens, ensuring both sides stay in sync.
:::

### Model Aliases and Shortcuts

**Why**
Model aliases let you quickly switch models without remembering full IDs.

**Predefined aliases** (recommended configuration):

```yaml
agents:
  defaults:
    models:
      "anthropic/claude-opus-4-5":
        alias: "opus"
      "anthropic/claude-sonnet-4-5":
        alias: "sonnet"
      "anthropic/claude-haiku-4-5":
        alias: "haiku"
      "openai/gpt-5.2":
        alias: "gpt"
      "openai/gpt-5-mini":
        alias: "gpt-mini"
```

**Usage**:

```bash
# Quick switch to Opus
/model opus

# Equivalent to
/model anthropic/claude-opus-4-5

# Use specific authentication
/model opus@anthropic:work
```

::: tip Alias vs Authentication Separation
Aliases are just shortcuts for model IDs, they don't affect authentication selection. To specify authentication, use `@<profileId>` syntax.
:::

### Configure Implicit Providers

Some providers don't need explicit configuration, Clawdbot auto-detects:

| Provider | Detection Method | Configuration File |
|--- | --- | ---|
| **GitHub Copilot** | `~/.copilot/credentials.json` | No configuration needed |
| **AWS Bedrock** | Environment variables or AWS SDK credentials | `~/.aws/credentials` |
| **Codex CLI** | `~/.codex/auth.json` | No configuration needed |

::: tip Implicit Configuration Priority
Implicit configurations are automatically merged into `models.json`, but explicit configurations can override them.
:::

## FAQ

### OAuth vs API Key: What's the Difference?

**OAuth**:
- Suitable for long-running Gateways
- Token auto-refreshes automatically
- Requires subscription account (Claude Pro/Max, OpenAI Codex)

**API Key**:
- Suitable for quick start and testing
- Does not auto-refresh
- Can be used for free-tier accounts

::: info Recommended Choice
- Long-running → Use OAuth (Anthropic, OpenAI)
- Quick testing → Use API Key
- Privacy-sensitive → Use local models (Ollama)
:::

### How to View Current Authentication Configuration?

```bash
# View authentication file
cat ~/.clawdbot/agents/default/agent/auth-profiles.json

# View model configuration
cat ~/.clawdbot/models.json

# View main configuration file
cat ~/.clawdbot/clawdbot.json
```

Or use CLI:

```bash
# List models
clawdbot models list

# View authentication order
clawdbot models auth order get --provider anthropic
```

### How to Remove a Specific Authentication?

```bash
# Edit authentication file, delete corresponding profile
nano ~/.clawdbot/agents/default/agent/auth-profiles.json

# Or use CLI (manual operation)
clawdbot doctor  # View problematic configurations
```

::: warning Confirm Before Deletion
Deleting authentication configuration will cause models using that provider to stop working. Ensure you have backup configurations.
:::

### How to Recover After Quota Limits?

**Automatic Recovery**:
- Clawdbot automatically retries after cooldown period
- Check logs to see retry time

**Manual Recovery**:
```bash
# Clear cooldown state
clawdbot models auth clear-cooldown --provider anthropic --profile-id anthropic:me@example.com

# Or restart Gateway
clawdbot gateway restart
```

## Summary

- Clawdbot supports three authentication methods: API Key, OAuth, Token
- Model configuration and authentication are separated, stored in different files
- Recommended to configure Anthropic Opus 4.5 as primary model, OpenAI GPT-5.2 as backup
- OAuth supports auto-refresh, suitable for long-running
- Can configure multi-account and authentication rotation for load balancing
- Use model aliases to quickly switch models

## Next Up

> In the next lesson, we'll learn about **[Session Management and Multi-Agent](../session-management/)**.
>
> You'll learn:
> - Session models and session isolation
> - Sub-agent collaboration
> - Context compression
> - Multi-agent routing configuration

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-27

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Authentication credential type definitions | [`src/agents/auth-profiles/types.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/types.ts) | 1-74 |
| OAuth token parsing and refresh | [`src/agents/auth-profiles/oauth.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/oauth.ts) | 1-220 |
| Authentication profile management | [`src/agents/auth-profiles/profiles.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/auth-profiles/profiles.ts) | 1-85 |
| Model configuration types | [`src/config/types.models.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/types.models.ts) | 1-60 |
| Model configuration generation | [`src/agents/models-config.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/agents/models-config.ts) | 1-139 |
| Zod Schema configuration | [`src/config/zod-schema.core.ts`](https://github.com/clawdbot/clawdbot/blob/main/src/config/zod-schema.core.ts) | 1-300+ |

**Key Types**:
- `AuthProfileCredential`: Authentication credential union type (`ApiKeyCredential | TokenCredential | OAuthCredential`)
- `ModelProviderConfig`: Model provider configuration structure
- `ModelDefinitionConfig`: Model definition structure

**Key Functions**:
- `resolveApiKeyForProfile()`: Resolve authentication credentials and return API Key
- `refreshOAuthTokenWithLock()`: OAuth token refresh with lock
- `ensureClawdbotModelsJson()`: Generate and merge model configurations

**Configuration File Locations**:
- `~/.clawdbot/clawdbot.json`: Main configuration file
- `~/.clawdbot/agents/<agentId>/agent/auth-profiles.json`: Authentication credentials
- `~/.clawdbot/models.json`: Generated model configuration

</details>
