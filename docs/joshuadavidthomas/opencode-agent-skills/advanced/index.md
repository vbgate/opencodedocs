---
title: "Advanced: Explore Features | opencode-agent-skills"
order: 3
sidebarTitle: "Advanced"
subtitle: "Advanced: Explore Features"
description: "Learn OpenCode Agent Skills advanced capabilities including Claude Code compatibility, Superpowers integration, namespaces, and context recovery."
---

# Advanced Features

This chapter dives deep into OpenCode Agent Skills' advanced capabilities, including Claude Code compatibility, Superpowers workflow integration, namespace priority system, and context compression and recovery mechanism. After mastering these topics, you'll be better equipped to manage a complex skill ecosystem and ensure skills remain available in long conversations.

## Prerequisites

::: warning Before You Begin
Before studying this chapter, ensure you have completed:

- [Install OpenCode Agent Skills](../start/installation/) - Plugin is correctly installed and running
- [Create Your First Skill](../start/creating-your-first-skill/) - Understand the basic skill structure
- [Skill Discovery Mechanism](../platforms/skill-discovery-mechanism/) - Understand where skills are discovered from
- [Load Skills into Session Context](../platforms/loading-skills-into-context/) - Master the usage of `use_skill` tool
:::

## What You'll Learn

<div class="grid-cards">

<a href="./claude-code-compatibility/" class="card">
  <h3>Claude Code Skill Compatibility</h3>
  <p>Learn how the plugin is compatible with Claude Code's skill and plugin system, master tool mapping mechanisms, and reuse the Claude skill ecosystem.</p>
</a>

<a href="./superpowers-integration/" class="card">
  <h3>Superpowers Workflow Integration</h3>
  <p>Configure and use Superpowers mode to get strict software development workflow guidance, improving development efficiency and code quality.</p>
</a>

<a href="./namespaces-and-priority/" class="card">
  <h3>Namespaces and Skill Priority</h3>
  <p>Understand the skill namespace system and discovery priority rules, resolve same-name skill conflicts, and precisely control skill sources.</p>
</a>

<a href="./context-compaction-resilience/" class="card">
  <h3>Context Compression and Recovery</h3>
  <p>Learn how skills remain available in long conversations, and master the trigger timing and execution flow of compression recovery.</p>
</a>

</div>

## Learning Path

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Recommended Learning Order                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Claude Code Compatibility  ──→  2. Superpowers Integration  ──→  3. Namespaces │
│         │                        │                        │             │
│         ▼                        ▼                        ▼             │
│   Reuse Claude skills      Enable workflow guidance   Control skill sources  │
│                                                                         │
│                                  │                                      │
│                                  ▼                                      │
│                                                                         │
│                         4. Context Compression Recovery                 │
│                                  │                                      │
│                                  ▼                                      │
│                         Long conversation skill persistence               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Recommended Learning Order**:

1. **Learn Claude Code compatibility first** - If you have Claude Code skills or want to use skills from the Claude plugin marketplace, this is the first step
2. **Then learn Superpowers integration** - Users who want strict workflow guidance should learn how to enable and configure it
3. **Then learn namespaces** - When you have many skills and encounter same-name conflicts, this knowledge point is critical
4. **Finally learn compression recovery** - Understand how skills remain available in long conversations, more theoretical content

::: tip Learn as Needed
- **Migrating from Claude Code**: Focus on Lesson 1 (compatibility) and Lesson 3 (namespaces)
- **Wanting workflow standardization**: Focus on Lesson 2 (Superpowers)
- **Encountering skill conflicts**: Go directly to Lesson 3 (namespaces)
- **Skills lost in long conversations**: Go directly to Lesson 4 (compression recovery)
:::

## Next Steps

After completing this chapter, you can continue learning:

- [Troubleshooting](../faq/troubleshooting/) - Check troubleshooting guides when you encounter issues
- [Security Considerations](../faq/security-considerations/) - Learn about the plugin's security mechanisms and best practices
- [API Tool Reference](../appendix/api-reference/) - View detailed parameters and return values for all available tools
- [Skill Development Best Practices](../appendix/best-practices/) - Master techniques and specifications for writing high-quality skills

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
