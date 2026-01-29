---
title: "Appendix: Technical Details | opencode-md-table-formatter"
sidebarTitle: "Appendix"
subtitle: "Appendix: Technical Details and Limitations"
description: "Learn opencode-md-table-formatter's technical details. Understand plugin boundaries, caching mechanisms, and performance optimization strategies."
tags:
  - "Appendix"
  - "Known Limitations"
  - "Technical Details"
prerequisite:
  - "start-features"
order: 4
---

# Appendix: Technical Details and Limitations

This chapter contains reference documentation and technical details to help you deeply understand the plugin's design philosophy, boundary limitations, and performance optimization strategies.

::: info What You'll Learn
- Understand the plugin's known limitations and applicable scenarios
- Master caching mechanisms and performance optimization strategies
- Understand the plugin's technical boundaries and design tradeoffs
:::

## Chapter Contents

### 📚 [Known Limitations: Where Are the Boundaries](./limitations/)

Learn about features and technical limitations not supported by the plugin to avoid using it in unsupported scenarios. Includes:
- No support for HTML tables, multi-line cells, or tables without separator rows
- No support for merged cells or configuration options
- Performance not verified for extremely large tables

**Target audience**: Users who want to know what the plugin can and cannot do

### 🔧 [Technical Details: Caching Mechanisms and Performance Optimization](./tech-details/)

Deep dive into the plugin's internal implementation, including caching mechanisms, performance optimization strategies, and code structure. Includes:
- widthCache data structure and cache lookup process
- Automatic cleanup mechanism and cache thresholds
- Performance optimization effectiveness analysis

**Target audience**: Developers interested in plugin implementation principles

## Recommended Learning Path

The two subsections in this chapter are relatively independent and can be read on demand:

1. **Quick start users**: Recommended to read "Known Limitations" first to understand plugin boundaries, then stop
2. **In-depth learners**: Read in order → "Known Limitations" → "Technical Details"
3. **Developers**: Recommended to read completely to help understand plugin design and future extensions

## Prerequisites

::: warning Preparation Before Learning

Before starting this chapter, it's recommended that you have completed:
- [ ] [Feature Overview: Automatic Formatting Magic](../../start/features/) - Understand the plugin's core features

This will help you better understand the technical details and limitations in this chapter.
:::

## Next Steps

After completing this chapter, you can continue learning:

- [Changelog: Version History and Change Log](../../changelog/release-notes/) - Track plugin version evolution and new features

Or return to the previous chapter:
- [FAQ: What to Do If Tables Are Not Formatted](../../faq/troubleshooting/) - Quickly locate and resolve common issues
