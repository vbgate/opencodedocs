---
title: "Advanced Features"
subtitle: "Advanced Features: Deep Dive into Markdown Table Formatting Technical Details"
sidebarTitle: "Advanced Features"
order: 2
description: "Deep dive into the core technology of Markdown table formatting, including OpenCode concealment mode principles, table specifications, and alignment details. Master the plugin's working principles comprehensively."
prerequisite:
  - "start-getting-started"
  - "start-features"
tags:
  - "Advanced"
  - "Principles"
  - "Specifications"
---

# Advanced Features: Deep Dive into Markdown Table Formatting Technical Details

## Chapter Overview

This chapter explores the technical details of Markdown table formatting in depth, including how OpenCode concealment mode works, the structural specifications for valid tables, and detailed explanations of alignment methods. By learning this content, you will fully understand how the plugin processes table formatting and how to avoid common errors.

## Learning Path

It is recommended to study the content of this chapter in the following order:

::: info Learning Path
1. **Concealment Mode Principles** → Understand why OpenCode's concealment mode requires special handling
2. **Table Specifications** → Master which types of tables can be correctly formatted
3. **Alignment Details** → Learn how to control table alignment and aesthetics
:::

## Prerequisites

Before starting this chapter, make sure you have:

- [x] Completed [Get Started in One Minute](../start/getting-started/), successfully installed and configured the plugin
- [x] Read [Feature Overview](../start/features/), understood the basic features of the plugin

::: warning Important Note
If you haven't completed the basic learning yet, it's recommended to start with the [Getting Started Guide](../start/getting-started/).
:::

## Course Navigation

### [Concealment Mode Principles](./concealment-mode/)

Understand how OpenCode's concealment mode works and how the plugin correctly calculates display width. You will learn:
- What concealment mode is and why it requires special handling
- How the Markdown symbol stripping algorithm works
- The role of `Bun.stringWidth()` in width calculation

**Estimated time**: 8 minutes | **Difficulty**: Intermediate | **Prerequisite**: Feature Overview

---

### [Table Specifications](./table-spec/)

Master the structural requirements for valid Markdown tables to avoid "invalid table" errors. You will learn:
- What table structures are valid
- The purpose and format requirements of separator rows
- The principle of column count consistency checking
- How to quickly identify table structure issues

**Estimated time**: 6 minutes | **Difficulty**: Beginner | **Prerequisite**: Concealment Mode Principles

---

### [Alignment Details](./alignment/)

Master the syntax and effects of the three alignment methods to make tables more beautiful. You will learn:
- Syntax for left-aligned, center-aligned, and right-aligned
- How to specify alignment in the separator row
- Cell content padding algorithm
- The relationship between alignment and display width

**Estimated time**: 10 minutes | **Difficulty**: Intermediate | **Prerequisite**: Table Specifications

---

## Chapter Summary

After completing this chapter, you will:

- ✅ Understand the working principles of OpenCode concealment mode
- ✅ Master the structural requirements for valid tables
- ✅ Be able to identify and fix invalid tables
- ✅ Proficiently use the three alignment methods
- ✅ Understand the internal technical implementation details of the plugin

## Next Steps

After completing this chapter, you can:

1. **Solve Practical Problems** → Learn [Common Issues](../../faq/troubleshooting/) to quickly locate and resolve problems
2. **Understand Technical Boundaries** → Read [Known Limitations](../../appendix/limitations/) to understand the applicable scenarios of the plugin
3. **Deep Dive into Implementation** → Check [Technical Details](../../appendix/tech-details/) to learn about caching mechanisms and performance optimization

---

::: tip Practical Advice
If you want to quickly solve table formatting issues, you can start by reading the [Table Specifications](./table-spec/) section of this chapter, which contains the most common invalid table cases.
:::
