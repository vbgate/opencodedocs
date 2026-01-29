---
title: "Advanced Features: Multi-Agent & Skill Development | OpenSkills"
sidebarTitle: "Advanced Features"
subtitle: "Advanced Features: Multi-Agent & Skill Development"
description: "Learn advanced OpenSkills features: multi-agent configuration, skill authoring, CI/CD integration, and security mechanisms for complex scenarios."
order: 3
---

# Advanced Features

This section covers advanced OpenSkills usage, including multi-agent environment configuration, custom output, symbolic link development, skill authoring, CI/CD integration, and security mechanisms. After mastering these topics, you can efficiently manage skills in complex scenarios and create your own exclusive skill library.

::: warning Prerequisites
Before studying this section, please ensure you have completed:
- [Quick Start](../start/quick-start/): Understand basic installation and usage workflow
- [Install Your First Skill](../start/first-skill/): Master skill installation methods
- [Sync Skills to AGENTS.md](../start/sync-to-agents/): Understand the skill synchronization mechanism
:::

## This Section

### Multi-Agent and Output Configuration

| Tutorial | Description |
|----------|-------------|
| [Universal Mode](./universal-mode/) | Use the `--universal` flag to unify skill management in multi-agent environments, avoiding conflicts between Claude Code, Cursor, Windsurf, and other tools |
| [Custom Output Path](./custom-output-path/) | Use the `-o/--output` flag to sync skills to any `.md` file, configuring independent skill lists for different tools |

### Skill Development

| Tutorial | Description |
|----------|-------------|
| [Symbolic Link Support](./symlink-support/) | Implement git-based skill updates and local development workflows through symbolic links, sharing skills across multiple projects |
| [Create Custom Skills](./create-skills/) | Create SKILL.md skill files from scratch, mastering YAML frontmatter and directory structure specifications |
| [Skill Structure Explained](./skill-structure/) | Deep dive into the complete field specifications of SKILL.md, and the design and performance optimization of references/scripts/assets/ resources |

### Automation and Security

| Tutorial | Description |
|----------|-------------|
| [CI/CD Integration](./ci-integration/) | Use the `-y/--yes` flag to implement non-interactive skill installation in GitHub Actions, GitLab CI, and other environments |
| [Security](./security/) | Learn about the three-layer protection mechanism including path traversal prevention, symbolic link security handling, and YAML parsing security |

### Comprehensive Guides

| Tutorial | Description |
|----------|-------------|
| [Best Practices](./best-practices/) | Experience summary on project configuration, skill management, and team collaboration to help you use OpenSkills efficiently |

## Recommended Learning Paths

Choose the appropriate learning path based on your use case:

### Path A: Multi-Agent Users

If you use multiple AI coding tools simultaneously (Claude Code + Cursor + Windsurf, etc.):

```
Universal Mode → Custom Output Path → Best Practices
```

### Path B: Skill Authors

If you want to create your own skills and share them with your team:

```
Create Custom Skills → Skill Structure Explained → Symbolic Link Support → Best Practices
```

### Path C: DevOps/Automation

If you need to integrate OpenSkills into CI/CD workflows:

```
CI/CD Integration → Security → Best Practices
```

### Path D: Complete Learning

If you want to master all advanced features comprehensively, study in the following order:

1. [Universal Mode](./universal-mode/) - Multi-agent environment fundamentals
2. [Custom Output Path](./custom-output-path/) - Flexible output configuration
3. [Symbolic Link Support](./symlink-support/) - Efficient development workflow
4. [Create Custom Skills](./create-skills/) - Skill authoring introduction
5. [Skill Structure Explained](./skill-structure/) - Deep dive into skill format
6. [CI/CD Integration](./ci-integration/) - Automated deployment
7. [Security](./security/) - Security mechanism explained
8. [Best Practices](./best-practices/) - Experience summary

## Next Steps

After completing this section, you can:

- Consult [FAQ](../faq/faq/) to solve problems encountered during use
- Reference [CLI API Reference](../appendix/cli-api/) for the complete command line interface
- Read [AGENTS.md Format Specification](../appendix/agents-md-format/) to deeply understand the generated file format
- View [Changelog](../changelog/changelog/) to learn about the latest features and changes
