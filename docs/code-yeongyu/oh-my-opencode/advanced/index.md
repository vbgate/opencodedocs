---
title: "Advanced: AI Workflows | oh-my-opencode"
sidebarTitle: "Work Like a Team"
subtitle: "Advanced: AI Workflows"
description: "Master advanced AI workflow orchestration in oh-my-opencode. Learn agent teams, parallel tasks, Categories/Skills system, lifecycle hooks, and deep customization to build efficient AI-powered development systems."
order: 60
---

# Advanced

This chapter dives deep into the advanced features of oh-my-opencode: professional AI agent teams, parallel background tasks, Categories and Skills system, lifecycle hooks, and more. Mastering these capabilities will enable you to orchestrate AI workflows like managing a real team, achieving a more efficient development experience.

## Chapter Content

<div class="grid-cards">

### [AI Agent Teams: 10 Experts Overview](./ai-agents-overview/)

Comprehensive introduction to the functionality, use cases, and calling methods of 10 built-in agents. Learn to select the right agent based on task type, enabling efficient team collaboration, parallel task execution, and deep code analysis.

### [Prometheus Planning: Interview-Based Requirements Gathering](./prometheus-planning/)

Clarify requirements and generate work plans through interview mode. Prometheus will continue asking questions until requirements are clear, and automatically consults Oracle, Metis, and Momus to verify plan quality.

### [Background Parallel Tasks: Work Like a Team](./background-tasks/)

In-depth explanation of the background agent management system usage. Learn concurrency control, task polling, and result retrieval, enabling multiple AI agents to handle different tasks simultaneously, dramatically improving work efficiency.

### [LSP and AST-Grep: Code Refactoring Tools](./lsp-ast-tools/)

Introduction to the usage of LSP tools and AST-Grep tools. Demonstrate how to implement IDE-level code analysis and operations, including symbol navigation, reference lookup, and structured code search.

### [Categories and Skills: Dynamic Agent Composition](./categories-skills/)

Learn to use the Categories and Skills system to create specialized sub-agents. Implement flexible agent composition, dynamically assigning models, tools, and skills based on task requirements.

### [Built-in Skills: Browser Automation and Git Expert](./builtin-skills/)

Detailed introduction to the use cases and best practices of three built-in Skills (playwright, frontend-ui-ux, git-master). Quickly access professional capabilities like browser automation, frontend UI design, and Git operations.

### [Lifecycle Hooks: Automated Context and Quality Control](./lifecycle-hooks/)

Introduction to the usage of 32 lifecycle hooks. Understand how to automate context injection, error recovery, and quality control, building a complete AI workflow automation system.

### [Slash Commands: Preset Workflows](./slash-commands/)

Introduction to the usage of 6 built-in slash commands. Including /ralph-loop (quick fix loop), /refactor (code refactoring), /start-work (start project execution), and other common workflows.

### [Configuration Deep Customization: Agent and Permission Management](./advanced-configuration/)

Teach users deep customization of agent configuration, permission settings, model overrides, and prompt modifications. Master complete configuration capabilities, creating AI workflows that align with team standards.

</div>

## Learning Path

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│  Step 1                  Step 2                     Step 3                          Step 4                  │
│  Understand AI Agents  →   Master Planning     →   Learn Dynamic Agent     →   Deep Customization      │
│  (Basic Concepts)          & Parallel Tasks         Composition                 & Automation             │
│                                                      (Advanced Usage)          (Expert Level)           │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Recommended Sequence**:

1. **Start with AI Agent Teams**: Understand the responsibilities and use cases of 10 agents—this is the cornerstone for understanding the entire system.
2. **Then Learn Planning and Parallel Tasks**: Master Prometheus planning and the background task system—this is the core of efficient collaboration.
3. **Next Learn Dynamic Agent Composition**: Learn Categories and Skills to achieve flexible agent specialization.
4. **Finally Learn Deep Customization**: Master lifecycle hooks, slash commands, and configuration customization to build complete workflows.

**Advanced Routes**:
- If your goal is **quick start**: Focus on "AI Agent Teams" and "Slash Commands"
- If your goal is **team collaboration**: Deep dive into "Prometheus Planning" and "Background Parallel Tasks"
- If your goal is **workflow automation**: Learn "Lifecycle Hooks" and "Configuration Deep Customization"

## Prerequisites

::: warning Before You Begin
This chapter assumes you have completed:

- ✅ [Quick Installation and Configuration](../start/installation/): Installed oh-my-opencode and configured at least one Provider
- ✅ [First Look at Sisyphus: Main Orchestrator](../start/sisyphus-orchestrator/): Understood basic agent calling and delegation mechanisms
- ✅ [Provider Configuration: Claude, OpenAI, Gemini](../platforms/provider-setup/): Configured at least one AI Provider
:::

## Next Steps

After completing this chapter, we recommend continuing with:

- **[Configuration Diagnostics and Troubleshooting](../faq/troubleshooting/)**: Quickly locate and resolve issues when they arise.
- **[Configuration Reference](../appendix/configuration-reference/)**: View the complete configuration file schema and understand all configuration options.
- **[Claude Code Compatibility](../appendix/claude-code-compatibility/)**: Learn how to migrate existing Claude Code workflows to oh-my-opencode.
