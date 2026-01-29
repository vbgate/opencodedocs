---
title: "Quick Install: Configure Plugin | opencode-antigravity-auth"
sidebarTitle: "Quick Install"
subtitle: "Quick Install: Configure Plugin | opencode-antigravity-auth"
description: "Learn opencode-antigravity-auth plugin installation in 5 minutes. Configure Claude and Gemini 3 models with AI-assisted or manual setup, including Google OAuth authentication."
tags:
  - "Quick Start"
  - "Installation Guide"
  - "OAuth"
  - "Plugin Configuration"
prerequisite:
  - "start-what-is-antigravity-auth"
order: 2
---

# Antigravity Auth Quick Install: Configure Plugin in 5 Minutes

Antigravity Auth Quick Install lets you complete OpenCode plugin configuration in 5 minutes and start using Claude and Gemini 3 advanced models. This tutorial provides two installation methods (AI-assisted/manual), covering plugin installation, OAuth authentication, model definitions, and verification steps, ensuring you can get started quickly.

## What You'll Learn

- ✅ Complete Antigravity Auth plugin installation in 5 minutes
- ✅ Configure access to Claude and Gemini 3 models
- ✅ Perform Google OAuth authentication and verify successful installation

## Your Current Challenge

You want to try the powerful features of Antigravity Auth (Claude Opus 4.5, Sonnet 4.5, Gemini 3 Pro/Flash), but don't know how to install the plugin or configure models, worried that one wrong step will leave you stuck.

## When to Use This

- When using Antigravity Auth plugin for the first time
- When installing OpenCode on a new machine
- When you need to reconfigure the plugin

## 🎒 Prerequisites

::: warning Prerequisites Check

Before starting, please confirm:
- [ ] OpenCode CLI is installed (`opencode` command is available)
- [ ] You have an available Google account (for OAuth authentication)
- [ ] You understand Antigravity Auth basic concepts (read [What is Antigravity Auth?](/NoeFabris/opencode-antigravity-auth/start/what-is-antigravity-auth/))

:::

## Core Approach

The Antigravity Auth installation process consists of 4 steps:

1. **Install Plugin** → Enable the plugin in OpenCode configuration
2. **OAuth Authentication** → Log in with your Google account
3. **Configure Models** → Add Claude/Gemini model definitions
4. **Verify Installation** → Send a first request to test

**Important Note**: The configuration file path is `~/.config/opencode/opencode.json` on all systems (on Windows, `~` automatically resolves to the user directory, such as `C:\Users\YourName`).

## Follow Along

### Step 1: Choose Installation Method

Antigravity Auth provides two installation methods. Choose either one.

::: tip Recommended Method

If you use an LLM Agent (such as Claude Code, Cursor, or OpenCode), **AI-assisted installation is recommended** for a faster and smoother experience.

:::

**Method 1: AI-Assisted Installation (Recommended)**

Simply copy the following prompt and paste it to any LLM Agent:

```
Install opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

**The AI will automatically**:
- Edit `~/.config/opencode/opencode.json`
- Add plugin configuration
- Add complete model definitions
- Execute `opencode auth login` for authentication

**You should see**: The AI outputs "plugin installed successfully" or a similar message.

**Method 2: Manual Installation**

If you prefer manual control, follow these steps:

**Step 1.1: Add Plugin to Configuration File**

Edit `~/.config/opencode/opencode.json` (create the file if it doesn't exist):

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> **Beta Version**: If you want to experience the latest features, use `opencode-antigravity-auth@beta` instead of `@latest`.

**You should see**: The configuration file contains a `plugin` field with an array value.

---

### Step 2: Perform Google OAuth Authentication

Run in your terminal:

```bash
opencode auth login
```

**The system will automatically**:
1. Start a local OAuth server (listening on `localhost:51121`)
2. Open a browser and navigate to the Google authorization page
3. Receive the OAuth callback and exchange tokens
4. Automatically retrieve the Google Cloud project ID

**You need to**:
1. Click "Allow" in the browser to authorize access
2. If you're in WSL or Docker environment, you may need to manually copy the callback URL

**You should see**:

```
✅ Authentication successful
✅ Account added: your-email@gmail.com
✅ Project ID resolved: cloud-project-id-xxx
```

::: tip Multi-Account Support

Need to add more accounts to increase quota? Run `opencode auth login` again. The plugin supports up to 10 accounts and automatically rotates load balancing.

:::

---

### Step 3: Configure Model Definitions

Copy the following complete configuration and append it to `~/.config/opencode/opencode.json` (be careful not to overwrite the existing `plugin` field):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-5": {
          "name": "Claude Sonnet 4.5 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-sonnet-4-5-thinking": {
          "name": "Claude Sonnet 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-opus-4-5-thinking": {
          "name": "Claude Opus 4.5 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-flash-preview": {
          "name": "Gemini 3 Flash Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-3-pro-preview": {
          "name": "Gemini 3 Pro Preview (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

::: info Model Classification

- **Antigravity Quota** (Claude + Gemini 3): `antigravity-gemini-*`, `antigravity-claude-*`
- **Gemini CLI Quota** (Separate): `gemini-2.5-*`, `gemini-3-*-preview`

For more model configuration details, refer to [Complete List of Available Models](/NoeFabris/opencode-antigravity-auth/platforms/available-models/).

:::

**You should see**: The configuration file contains the complete `provider.google.models` definition, and the JSON format is valid (no syntax errors).

---

### Step 4: Verify Installation

Run the following command to test if the plugin is working correctly:

```bash
opencode run "Hello" --model=google/antigravity-claude-sonnet-4-5-thinking --variant=max
```

**You should see**:

```
Currently using: google/antigravity-claude-sonnet-4-5-thinking (max)
...

Claude: Hello! I'm Claude Sonnet 4.5 Thinking.
```

::: tip Checkpoint ✅

If you see the AI responding normally, congratulations! The Antigravity Auth plugin has been successfully installed and configured.

:::

---

## Common Pitfalls

### Issue 1: OAuth Authentication Failure

**Symptoms**: After running `opencode auth login`, an error message appears, such as `invalid_grant` or the authorization page cannot be opened.

**Causes**: Google account password changed, security events, or incomplete callback URL.

**Solutions**:
1. Check if the browser correctly opens the Google authorization page
2. If in WSL/Docker environment, manually copy the callback URL displayed in the terminal to the browser
3. Delete `~/.config/opencode/antigravity-accounts.json` and re-authenticate

### Issue 2: Model Not Found (400 Error)

**Symptoms**: When running a request, `400 Unknown name 'xxx'` is returned.

**Causes**: Model name spelling error or configuration file format issue.

**Solutions**:
1. Check if the `--model` parameter matches the key in the configuration file exactly (case-sensitive)
2. Verify that `opencode.json` is valid JSON (use `cat ~/.config/opencode/opencode.json | jq` to check)
3. Confirm that the corresponding model definition exists under the `provider.google.models` field

### Issue 3: Incorrect Configuration File Path

**Symptoms**: Prompt "configuration file does not exist" or modifications have no effect.

**Causes**: Using the wrong path on different systems.

**Solutions**: Use `~/.config/opencode/opencode.json` on all systems, including Windows (where `~` automatically resolves to the user directory).

| System | Correct Path | Incorrect Path |
|--- | --- | ---|
| macOS/Linux | `~/.config/opencode/opencode.json` | `/usr/local/etc/...` |
| Windows | `C:\Users\YourName\.config\opencode\opencode.json` | `%APPDATA%\opencode\...` |

## Summary

In this lesson, we completed:
1. ✅ Two installation methods (AI-assisted / manual configuration)
2. ✅ Google OAuth authentication process
3. ✅ Complete model configuration (Claude + Gemini 3)
4. ✅ Installation verification and common issue troubleshooting

**Key Takeaways**:
- Unified configuration file path: `~/.config/opencode/opencode.json`
- OAuth authentication automatically retrieves Project ID, no manual configuration needed
- Supports multiple accounts to increase quota limits
- Use the `variant` parameter to control thinking depth for Thinking models

## Next Lesson Preview

> In the next lesson, we'll learn **[First Authentication: Deep Dive into OAuth 2.0 PKCE Flow](/NoeFabris/opencode-antigravity-auth/start/first-auth-login/)**.
>
> You'll learn:
> - How OAuth 2.0 PKCE works
> - Token refresh mechanism
> - Project ID automatic resolution process
> - Account storage format

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-23

| Feature | File Path | Lines |
|--- | --- | ---|
| OAuth Authorization URL Generation | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L91-L113) | 91-113  |
| PKCE Key Pair Generation | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L1-L2)   | 1-2     |
| Token Exchange | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L201-L270) | 201-270 |
| Project ID Automatic Retrieval | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L131-L196) | 131-196 |
| User Info Retrieval | [`src/antigravity/oauth.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/antigravity/oauth.ts#L231-L242) | 231-242 |

**Key Constants**:
- `ANTIGRAVITY_CLIENT_ID`: OAuth client ID (used for Google authentication)
- `ANTIGRAVITY_REDIRECT_URI`: OAuth callback address (fixed to `http://localhost:51121/oauth-callback`)
- `ANTIGRAVITY_SCOPES`: List of OAuth permission scopes

**Key Functions**:
- `authorizeAntigravity()`: Build OAuth authorization URL, including PKCE challenge
- `exchangeAntigravity()`: Exchange authorization code for access token and refresh token
- `fetchProjectID()`: Automatically resolve Google Cloud project ID
- `encodeState()` / `decodeState()`: Encode/decode OAuth state parameters (including PKCE verifier)

</details>
