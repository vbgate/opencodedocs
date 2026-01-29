---
title: "附录: 技术参考 | opencode-antigravity-auth"
sidebarTitle: "附录"
subtitle: "附录: 技术参考"
description: "学习 opencode-antigravity-auth 插件的技术参考。包含架构设计、API 规范、存储格式和完整配置文档，深入理解插件内部机制。"
order: 5
---

# Appendix

This section provides technical reference materials for the Antigravity Auth plugin, including architecture design, API specifications, storage formats, and complete configuration documentation, helping you gain a deep understanding of the plugin's internal mechanisms.

## Learning Path

### 1. [Architecture Overview](./architecture-overview/)

Understand the plugin's module structure and request processing flow.

- Modular layer design and responsibility division
- Complete request path from OpenCode to Antigravity API
- Multi-account load balancing and session recovery mechanisms

### 2. [API Specification](./api-spec/)

Gain in-depth understanding of Antigravity API technical details.

- Unified gateway interface and endpoint configuration
- Request/response format and JSON Schema limitations
- Thinking model configuration and function calling rules

### 3. [Storage Format](./storage-schema/)

Understand the structure and version management of account storage files.

- Storage file locations and field meanings
- v1/v2/v3 version evolution and automatic migration
- Methods for migrating account configurations across machines

### 4. [Complete Configuration Options](./all-config-options/)

Complete reference manual for all configuration options.

- Default values and applicable scenarios for 30+ configuration items
- Methods for overriding configuration with environment variables
- Best configuration combinations for different usage scenarios

## Prerequisites

::: warning Recommended to Complete First
The content in this section tends to be technical in depth. It's recommended to complete the following learning first:

- [Quick Installation](../start/quick-install/) - Complete plugin installation and initial authentication
- [Configuration Guide](../advanced/configuration-guide/) - Understand common configuration methods
:::

## Next Steps

After completing the appendix learning, you can:

- Check [Frequently Asked Questions](../faq/) to resolve issues encountered during usage
- Follow [Changelog](../changelog/version-history/) to learn about version changes
- Contribute to plugin development, code, or documentation
