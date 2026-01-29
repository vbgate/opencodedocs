---
title: "FAQ: 常见问题与故障排查 | plannotator"
sidebarTitle: "FAQ"
subtitle: "FAQ: 常见问题与故障排查"
description: "学习如何排查和解决 Plannotator 常见问题。涵盖端口冲突、浏览器异常、集成失败等场景的调试技巧和解决方案。"
order: 4
---

# FAQ

This chapter helps you solve various problems encountered while using Plannotator. Whether it's port conflicts, browser not opening, or integration failures, there are corresponding solutions and debugging techniques here.

## Chapter Contents

<div class="grid-cards">

<a href="./common-problems/" class="card">
  <h3>🔧 Common Problems</h3>
  <p>Solve common problems encountered during use, including port conflicts, browser not opening, plans not displaying, Git errors, image upload failures, Obsidian/Bear integration issues, etc.</p>
</a>

<a href="./troubleshooting/" class="card">
  <h3>🔍 Troubleshooting</h3>
  <p>Master basic troubleshooting methods, including log viewing, error handling, and debugging techniques. Learn to quickly identify the source of problems through log output.</p>
</a>

</div>

## Learning Path

```
Common Problems → Troubleshooting
      ↓            ↓
  Quick Fix    Deep Debug
```

**Recommended Sequence**:

1. **First check Common Problems**: Most problems can find ready-made solutions here
2. **Then learn Troubleshooting**: If common problems don't cover your issue, learn how to troubleshoot through logs and debugging techniques

::: tip Suggestions when encountering problems
First search for keywords in "Common Problems" (such as "port", "browser", "Obsidian") to find corresponding solutions. If the problem is complex or not in the list, refer to "Troubleshooting" to learn debugging methods.
:::

## Prerequisites

Before studying this chapter, it's recommended that you have completed:

- ✅ [Quick Start](../start/getting-started/) - Understand basic concepts of Plannotator
- ✅ Installed Claude Code or OpenCode plugin (choose one):
  - [Install Claude Code Plugin](../start/installation-claude-code/)
  - [Install OpenCode Plugin](../start/installation-opencode/)

## Next Steps

After completing this chapter, you can continue learning:

- [API Reference](../appendix/api-reference/) - Understand all API endpoints and request/response formats
- [Data Models](../appendix/data-models/) - Understand data structures used by Plannotator
- [Environment Variables](../advanced/environment-variables/) - Deep dive into all available environment variables

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
  transition: all 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}

.dark .grid-cards .card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
</style>
