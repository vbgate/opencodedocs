---
title: "Getting Started: Installation & Setup | OpenSkills"
sidebarTitle: "Getting Started"
subtitle: "Getting Started: Installation & Setup"
order: 1
description: "Learn how to install and configure OpenSkills for AI coding agents. Complete the setup in 10-15 minutes, from tool installation to skill synchronization."
---

# Getting Started

This section helps you get started with OpenSkills. From installing the tool to enabling AI agents to use skills, it takes just 10-15 minutes.

## Learning Path

We recommend following this order:

### 1. [Quick Start](./quick-start/)

Complete tool installation, skill installation, and sync in under 5 minutes, and experience the core value of OpenSkills.

- Install OpenSkills tool
- Install skills from the official Anthropic repository
- Sync skills to AGENTS.md
- Verify that AI agents can use skills

### 2. [What is OpenSkills?](./what-is-openskills/)

Understand the core concepts and working principles of OpenSkills.

- The relationship between OpenSkills and Claude Code
- Unified skill format, progressive loading, multi-agent support
- When to use OpenSkills instead of the built-in skill system

### 3. [Installation Guide](./installation/)

Detailed installation steps and environment configuration.

- Node.js and Git environment check
- npx temporary usage vs global installation
- Troubleshooting common installation issues

### 4. [Install Your First Skill](./first-skill/)

Install skills from the official Anthropic repository and experience interactive selection.

- Use the `openskills install` command
- Interactively select the skills you need
- Understand the skill directory structure (.claude/skills/)

### 5. [Sync Skills to AGENTS.md](./sync-to-agents/)

Generate the AGENTS.md file to let AI agents know about available skills.

- Use the `openskills sync` command
- Understand the XML format of AGENTS.md
- Select skills to sync to control context size

### 6. [Reading Skills](./read-skills/)

Understand how AI agents load skill content.

- Use the `openskills read` command
- The 4-level priority order for skill lookup
- Read multiple skills at once

## Prerequisites

Before you start, please confirm:

- You have installed [Node.js](https://nodejs.org/) 20.6.0 or higher
- You have installed [Git](https://git-scm.com/) (for installing skills from GitHub)
- You have installed at least one AI coding agent (Claude Code, Cursor, Windsurf, Aider, etc.)

::: tip Quick Environment Check
```bash
node -v  # Should show v20.6.0 or higher
git -v   # Should show git version x.x.x
```
:::

## Next Steps

After completing this section, you can continue learning:

- [Command Reference](../platforms/cli-commands/): Learn more about all commands and parameters
- [Installation Sources](../platforms/install-sources/): Learn how to install skills from GitHub, local paths, and private repositories
- [Create Custom Skills](../advanced/create-skills/): Build your own skills
