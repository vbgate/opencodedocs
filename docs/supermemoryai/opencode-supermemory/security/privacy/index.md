---
title: "隐私: 数据安全防护 | opencode-supermemory"
sidebarTitle: "隐私安全"
subtitle: "隐私: 数据安全防护 | opencode-supermemory"
description: "掌握 opencode-supermemory 的隐私安全机制。学习使用 private 标签脱敏敏感数据，安全配置 API Key，理解数据上传和本地存储流程。"
tags:
  - "Privacy"
  - "Security"
  - "Configuration"
prerequisite:
  - "start-getting-started"
order: 999
---

# Privacy and Data Security: Protecting Your Sensitive Information

## What You'll Learn

*   **Understand Data Flow**: Know exactly what data is uploaded to the cloud and what stays local.
*   **Master Data Redaction**: Learn to use the `<private>` tag to prevent sensitive information (like passwords and keys) from being uploaded.
*   **Secure Key Management**: Learn the safest way to configure your `SUPERMEMORY_API_KEY`.

## Core Concepts

When using opencode-supermemory, understanding the data flow is crucial:

1.  **Cloud Storage**: Your Memories are stored in Supermemory's cloud database, not in local files. This means you need an internet connection to access them.
2.  **Local Redaction**: To protect privacy, the plugin redacts data locally **before** sending it to the cloud.
3.  **Explicit Control**: The plugin does not automatically scan all file uploads. Content is processed only when the Agent explicitly calls the `add` tool or triggers compression.

### Redaction Mechanism

The plugin includes a built-in filter specifically designed to recognize `<private>` tags.

*   **Input**: `The database password here is <private>123456</private>`
*   **Process**: The plugin detects the tag and replaces its content with `[REDACTED]`.
*   **Upload**: `The database password here is [REDACTED]`

::: info Note
This process happens internally within the plugin code and is completed before any data leaves your computer.
:::

## Step-by-Step Guide

### Step 1: Securely Configure API Key

While you can write the API Key directly into the configuration file, to prevent accidental leakage (e.g., sharing the config file by mistake), we recommend understanding the priority logic.

**Priority Rules**:
1.  **Configuration File** (`~/.config/opencode/supermemory.jsonc`): Highest priority.
2.  **Environment Variable** (`SUPERMEMORY_API_KEY`): Used if not set in the configuration file.

**Recommended Practice**:
If you need flexibility or are running in a CI/CD environment, use environment variables. If you are an individual developer, configuring it in the user directory's JSONC file is also safe (as it is not in your project's Git repository).

### Step 2: Using the `<private>` Tag

When you ask the Agent to remember content containing sensitive information via natural language, you can wrap the sensitive parts with the `<private>` tag.

**Demo**:

Tell the Agent:
> Please remember, the production database IP is 192.168.1.10, but the root password is `<private>SuperSecretPwd!</private>`, do not leak the password.

**What You Should See**:
The Agent will call the `supermemory` tool to save the memory. Although the Agent's response might contain the password (because it's in the context), the **actual memory saved to the Supermemory cloud** has been redacted.

### Step 3: Verify Redaction Results

We can verify that the password was not stored by searching for it.

**Action**:
Ask the Agent to search for the memory just saved:
> Search for the production database password.

**Expected Result**:
The content retrieved by the Agent from Supermemory should be:
`The production database IP is 192.168.1.10, but the root password is [REDACTED]...`

If the Agent tells you "The password is [REDACTED]", it means the redaction mechanism is working correctly.

## Common Misconceptions

::: warning Myth 1: All code is uploaded
**Fact**: The plugin does **not** automatically upload your entire codebase. It only uploads specific snippets when you run `/supermemory-init` for an initial scan, or when the Agent explicitly decides to "remember" a specific piece of code logic.
:::

::: warning Myth 2: .env files are automatically loaded
**Fact**: The plugin reads the `SUPERMEMORY_API_KEY` from the process environment. If you place a `.env` file in the project root, the plugin will **not** automatically read it unless your terminal or the OpenCode main program has loaded it.
:::

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-23

| Feature | File Path | Line Number |
|--- | --- | ---|
| Privacy Redaction Logic | [`src/services/privacy.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/privacy.ts#L1-L13) | 1-13 |
| API Key Loading | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L90) | 90 |
| Plugin Call Redaction | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L282) | 282 |

**Key Functions**:
- `stripPrivateContent(content)`: Performs regex replacement to turn `<private>` content into `[REDACTED]`.
- `loadConfig()`: Loads the local configuration file, with higher priority than environment variables.

</details>

## What's Next

> Congratulations on completing the core course of opencode-supermemory!
>
> Next, you can:
> - Review [Advanced Configuration](/supermemoryai/opencode-supermemory/advanced/configuration/) to learn more about customization options.
