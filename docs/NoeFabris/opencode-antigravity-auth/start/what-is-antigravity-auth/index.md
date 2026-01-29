---
title: "Antigravity Auth: Access Claude & Gemini 3 | opencode-antigravity-auth"
sidebarTitle: "Overview"
subtitle: "Understand the Core Value of Antigravity Auth Plugin"
description: "Learn the core value and risks of the Antigravity Auth plugin. Access Claude and Gemini 3 models via Google OAuth with multi-account load balancing."
tags:
  - "Getting Started"
  - "Plugin Overview"
  - "OpenCode"
  - "Antigravity"
order: 1
---

# Understand the Core Value of Antigravity Auth Plugin

**Antigravity Auth** is an OpenCode plugin that accesses the Antigravity API through Google OAuth authentication. It lets you use your familiar Google account to call advanced models like Claude Opus 4.5, Sonnet 4.5, and Gemini 3 Pro/Flash without managing API keys. The plugin also provides features like multi-account load balancing, dual quota pools, and automatic session recovery, making it ideal for users who need advanced models and automated management.

## What You'll Learn

- Determine if this plugin fits your use case
- Understand which AI models and core features are supported
- Clarify the risks and precautions of using this plugin
- Decide whether to proceed with installation and configuration

## Your Current Challenge

You want to use the most advanced AI models (such as Claude Opus 4.5, Gemini 3 Pro), but official access is restricted. You're looking for a reliable way to access these models while hoping to:

- Avoid manually managing multiple API keys
- Automatically switch accounts when encountering rate limits
- Automatically recover after interruptions without losing context

## Core Concept

**Antigravity Auth** is an OpenCode plugin that accesses the Google Antigravity API through **Google OAuth authentication**, allowing you to call advanced AI models using your familiar Google account.

It doesn't proxy all requests but **intercepts and transforms** your model call requests, forwards them to the Antigravity API, then converts the response back to a format that OpenCode can recognize.

## Key Features

### Supported Models

| Model Series | Available Models | Features |
|--- | --- | ---|
| **Claude** | Opus 4.5, Sonnet 4.5 | Supports extended thinking mode |
| **Gemini 3** | Pro, Flash | Google Search integration, extended thinking |

::: info Thinking Mode
Thinking models perform "deep thinking" before generating responses, showing their reasoning process. You can configure thinking budget to balance quality and response speed.
:::
### Multi-Account Load Balancing

- **Supports up to 10 Google accounts**
- Automatically switches to the next account when encountering rate limits (429 errors)
- Three account selection strategies: sticky, round-robin, hybrid (smart mixing)

### Dual Quota System

The plugin simultaneously accesses **two independent quota pools**:

1. **Antigravity quota**: From Google Antigravity API
2. **Gemini CLI quota**: From Google Gemini CLI

When one pool is rate-limited, the plugin automatically tries the other pool, maximizing quota utilization.

### Automatic Session Recovery

- Detects tool call failures (such as interruptions by pressing ESC)
- Automatically injects synthetic tool_result to prevent conversation crashes
- Supports automatically sending "continue" to resume conversations

### Google Search Integration

Enables web search for Gemini models to improve factual accuracy:

- **Auto mode**: The model decides whether to search based on need
- **Always-on mode**: Search is performed every time

## When to Use This Plugin

::: tip Ideal for These Scenarios
- You have multiple Google accounts and want to increase overall quota
- You need to use Claude or Gemini 3's Thinking models
- You want to enable Google Search for Gemini models
- You prefer OAuth authentication over managing API keys manually
- You frequently encounter rate limits and want automatic account switching
:::

::: warning Not Suitable for These Scenarios
- You need to use models not officially announced by Google
- You're highly sensitive to Google ToS risks (see risk warnings below)
- You only need basic Gemini 1.5 or Claude 3 models (official APIs are more stable)
- You have difficulty opening browsers in WSL, Docker, or similar environments
:::

## ⚠️ Important Risk Warnings

Using this plugin **may violate Google's Terms of Service**. Some users have reported their Google accounts being **banned** or **shadow-banned** (restricted access without explicit notification).

### High-Risk Scenarios

- 🚨 **Brand new Google accounts**: Extremely high probability of being banned
- 🚨 **Accounts with newly activated Pro/Ultra subscriptions**: Easily flagged and banned

### Confirm Before Use

- This is an **unofficial tool**, not endorsed by Google
- Your account may be suspended or permanently banned
- You assume all risks associated with using this plugin

### Recommendations

- Use **established Google accounts**, not newly created accounts for this plugin
- Avoid using important accounts linked to critical services
- If your account is banned, you cannot appeal through this plugin

::: danger Account Security
All OAuth tokens are stored locally in `~/.config/opencode/antigravity-accounts.json` and are not uploaded to any server. However, please ensure your computer is secure to prevent token leakage.
:::

## Lesson Summary

Antigravity Auth is a powerful OpenCode plugin that lets you access advanced Claude and Gemini 3 models through Google OAuth. It provides features like multi-account load balancing, dual quota pools, and automatic session recovery, making it ideal for users who need advanced models and automated management.

But please note: **Using this plugin carries the risk of account bans**. Please use non-critical Google accounts and understand the related risks before proceeding with installation.

## Coming Up Next

> In the next lesson, we'll learn **[Quick Install](../quick-install/)**.
>
> You'll learn:
> - Complete plugin installation in 5 minutes
> - Add your first Google account
> - Verify successful installation
