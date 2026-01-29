---
title: "Platform Features: CLI Commands & Skills | OpenSkills"
sidebarTitle: "Platform Features"
subtitle: "Platform Features: CLI Commands & Skill Management"
description: "Learn OpenSkills CLI commands and skill management. Master installation sources, global vs project modes, listing, updating, and removing skills."
order: 2
---

# Platform Features

This section provides an in-depth explanation of the OpenSkills CLI's core commands and skill management features, helping you progress from "using" to "mastering" the tool.

## Prerequisites

::: warning Before You Begin
Before studying this section, please ensure you have completed the [Getting Started](../start/) section, especially:
- [Install OpenSkills](../start/installation/): Successfully installed OpenSkills CLI
- [Install Your First Skill](../start/first-skill/): Understand the basic skill installation process
:::

## This Section

This section covers 6 topics covering all core features of OpenSkills:

### [Command Reference](./cli-commands/)

Complete introduction to all 7 commands, parameters, and flags, with a command quick reference table. Suitable for users who need to quickly look up command usage.

### [Installation Sources](./install-sources/)

Detailed explanation of three installation sources: GitHub repositories, local paths, and private Git repositories. Use cases, command formats, and considerations for each method.

### [Global Installation vs Project-Local Installation](./global-vs-project/)

Explains the difference between `--global` and default (project-local) installation, helping you choose the appropriate installation location and understand skill search priority rules.

### [List Installed Skills](./list-skills/)

Teaches you how to use the `list` command to view installed skills and understand the meaning of `(project)` and `(global)` location tags.

### [Update Skills](./update-skills/)

Guides you through using the `update` command to refresh installed skills, supporting both full updates and specific skill updates to keep skills synchronized with the source repository.

### [Remove Skills](./remove-skills/)

Introduces two removal methods: the interactive `manage` command and the scripted `remove` command, helping you efficiently manage your skill library.

## Learning Paths

Choose the appropriate learning path based on your needs:

### Path A: Systematic Learning (Recommended for Beginners)

Study all content in order to build a complete knowledge system:

```
Command Reference → Installation Sources → Global vs Project → List Skills → Update Skills → Remove Skills
```

### Path B: Look Up as Needed

Jump directly based on your current task:

| What You Want to Do | Read This |
|-------------------|----------|
| Find usage for a specific command | [Command Reference](./cli-commands/) |
| Install skills from a private repository | [Installation Sources](./install-sources/) |
| Decide whether to install globally or locally | [Global vs Project](./global-vs-project/) |
| View installed skills | [List Installed Skills](./list-skills/) |
| Update skills to the latest version | [Update Skills](./update-skills/) |
| Clean up unused skills | [Remove Skills](./remove-skills/) |

## Next Steps

After completing this section, you have mastered the daily use of OpenSkills. You can continue to:

- **[Advanced Features](../advanced/)**: Learn about Universal mode, custom output paths, symbolic links, creating custom skills, and other advanced features
- **[FAQ](../faq/)**: Consult the FAQ and troubleshooting guide when you encounter problems
