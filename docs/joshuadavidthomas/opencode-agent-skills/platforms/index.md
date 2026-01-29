---
title: "Platform Features: Core Functionality | opencode-agent-skills"
sidebarTitle: "Platform Features"
subtitle: "Platform Features: Core Functionality"
description: "Master core functionality for skill discovery, loading, and automation. Learn to query available skills, load them into context, and execute scripts to enhance AI development workflows."
order: 2
---

# Platform Features

This chapter dives deep into OpenCode Agent Skills' core functionality modules, including skill discovery, querying, loading, automatic recommendation, script execution, and file reading. After mastering these features, you'll be able to fully leverage the plugin's skill management capabilities to make AI more efficient in serving your development work.

## Prerequisites

::: warning Before You Begin
Before studying this chapter, ensure you have completed:

- [Install OpenCode Agent Skills](../start/installation/) - Plugin is correctly installed and running
- [Create Your First Skill](../start/creating-your-first-skill/) - Understand the basic skill structure
:::

## What You'll Learn

| Course | Description | Core Tool |
|--- | --- | ---|
| [Skill Discovery Mechanism](./skill-discovery-mechanism/) | Understand where the plugin automatically discovers skills and master priority rules | - |
| [Query and List Available Skills](./listing-available-skills/) | Use the `get_available_skills` tool to find and filter skills | `get_available_skills` |
| [Load Skills into Session Context](./loading-skills-into-context/) | Use the `use_skill` tool to load skills and understand the XML injection mechanism | `use_skill` |
| [Automatic Skill Recommendation](./automatic-skill-matching/) | Understand semantic matching principles to let AI automatically discover related skills | - |
| [Execute Skill Scripts](./executing-skill-scripts/) | Use the `run_skill_script` tool to execute automation scripts | `run_skill_script` |
| [Read Skill Files](./reading-skill-files/) | Use the `read_skill_file` tool to access skill support files | `read_skill_file` |

## Learning Path

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Recommended Learning Order                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Skill Discovery  ──→  2. List Skills  ──→  3. Load Skills         │
│         │                     │                    │                    │
│         │                     │                    │                    │
│         ▼                     ▼                    ▼                    │
│   Where skills come from   Learn to find skills   Master loading        │
│                                                                         │
│                              │                                          │
│                              ▼                                          │
│                                                                         │
│   4. Auto Recommendation  ←──  5. Run Scripts  ←──  6. Read Files       │
│         │                    │                  │                       │
│         ▼                    ▼                  ▼                       │
│   Understand smart match   Run automation    Access support files       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Recommended Learning Order**:

1. **Learn discovery first** - Understand where skills come from and how priority is determined
2. **Then learn querying** - Master the usage of `get_available_skills` tool
3. **Then learn loading** - Understand `use_skill` and XML injection mechanism
4. **Then learn auto-recommendation** - Understand how semantic matching works (optional, more theoretical)
5. **Finally learn scripts and files** - These are advanced features, learn as needed

::: tip Quick Start Path
If you just want to get started quickly, you can learn the first three lessons (discovery → querying → loading), and supplement the others as needed.
:::

## Next Steps

After completing this chapter, you can continue learning:

- [Advanced Features](../advanced/) - Dive deeper into Claude Code compatibility, Superpowers integration, namespace priorities, and other advanced topics
- [FAQ](../faq/) - Check troubleshooting and security documentation when you encounter issues
- [Appendix](../appendix/) - View API reference and best practices
