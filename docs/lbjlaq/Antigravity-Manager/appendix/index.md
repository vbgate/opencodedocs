---
title: "附录: 技术参考手册 | Antigravity-Manager"
sidebarTitle: "附录"
subtitle: "附录: 技术参考手册"
description: "学习 Antigravity Tools 的技术参考内容。快速查阅 API 端点、数据存储结构和功能边界，解决集成和调试问题。"
order: 5
---

# Appendix

This chapter compiles technical reference materials for Antigravity Tools, including API endpoint quick reference, data storage structure, and experimental feature boundary descriptions. When you need to quickly look up a technical detail, this is your "dictionary."

## In This Chapter

| Document | Description | Use Cases |
|--- | --- | ---|
| **[Endpoint Quick Reference](./endpoints/)** | Overview of external HTTP routes: OpenAI/Anthropic/Gemini/MCP endpoints, auth modes, and Header formats | Integrating new clients, troubleshooting 404/401 |
| **[Data & Models](./storage-models/)** | Account file structure, SQLite stats database table structure, key field definitions | Backup and migration, direct database queries, troubleshooting |
| **[z.ai Integration Boundaries](./zai-boundaries/)** | Checklist of features implemented vs. explicitly not implemented in z.ai | Evaluate z.ai capabilities, avoid misuse |

## Recommended Learning Path

```
Endpoint Quick Reference → Data & Models → z.ai Integration Boundaries
        ↓                    ↓                     ↓
Know which path to call   Know where data is   Know where boundaries are
```

1. **Start with Endpoint Quick Reference**: Understand which APIs are available and how to configure authentication
2. **Then Data & Models**: Understand data storage structure for easy backup, migration, and direct database troubleshooting
3. **Finally z.ai Integration Boundaries**: If you use z.ai, this helps you avoid treating "not implemented" as "available"

::: tip These Documents Are Not Required Reading
The appendix is reference material, not a tutorial. You don't need to read it from beginning to end—just consult it when encountering specific questions.
:::

## Prerequisites

::: warning Recommended First
- [What is Antigravity Tools](../start/getting-started/): Build basic mental model
- [Start Local Reverse Proxy & Connect First Client](../start/proxy-and-first-client/): Complete basic workflow
:::

If you haven't completed the basic workflow, it's recommended to finish the [Getting Started](../start/) chapter first.

## Next Steps

After reading the appendix, you can:

- **[Release Notes](../changelog/release-notes/)**: Understand recent changes, verify before upgrading
- **[FAQ](../faq/invalid-grant/)**: When encountering specific errors, find answers in the FAQ chapter
- **[Advanced Configuration](../advanced/config/)**: Deep dive into hot reload, scheduling strategies, and other advanced features
