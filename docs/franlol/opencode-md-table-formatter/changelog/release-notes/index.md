---
title: "Changelog: Version History | opencode-md-table-formatter"
sidebarTitle: "Changelog"
subtitle: "Changelog: Version History | opencode-md-table-formatter"
description: "Track the version evolution of opencode-md-table-formatter. Learn about new features, fixes, and technical details in each release."
tags:
  - "changelog"
  - "version-history"
  - "release-notes"
prerequisite: []
order: 90
---

# Changelog: Version History and Release Notes

::: info What You'll Learn
- Track the plugin's version evolution
- Understand new features and fixes in each version
- Master known limitations and technical details
- Learn about potential future enhancements
:::

---

## [0.1.0] - 2025-01-07

### New Features

This is the **initial release** of opencode-md-table-formatter, including the following core features:

- **Automatic Table Formatting**: Automatically format AI-generated Markdown tables via the `experimental.text.complete` hook
- **Concealment Mode Support**: Correctly handle hidden Markdown symbols (like `**`, `*`) when calculating widths
- **Nested Markdown Processing**: Support Markdown syntax at any nesting depth using multi-pass stripping algorithm
- **Code Block Protection**: Markdown symbols within inline code (`` `code` ``) remain in literal form and don't participate in width calculation
- **Alignment Support**: Support left alignment (`---` or `:---`), center alignment (`:---:`), right alignment (`---:`)
- **Width Caching Optimization**: Cache string display width calculation results to improve performance
- **Invalid Table Validation**: Automatically validate table structure, invalid tables will have error comments added
- **Multi-character Support**: Support Emoji, Unicode characters, empty cells, and overly long content
- **Silent Error Handling**: Formatting failures won't interrupt the OpenCode workflow

### Technical Details

This version includes approximately **230 lines of production-ready TypeScript code**:

- **12 Functions**: Clear responsibilities, well-separated
- **Type Safety**: Proper use of the `Hooks` interface
- **Smart Cache Cleanup**: Triggered when operation count exceeds 100 or cache entries exceed 1000
- **Multi-pass Regex Processing**: Support Markdown symbol stripping at arbitrary nesting depths

::: tip Cache Mechanism
The cache is designed to optimize width calculations for repeated content. For example, when the same cell text appears multiple times in a table, the width is calculated only once, and subsequent reads retrieve it directly from the cache.
:::

### Known Limitations

This version does not support the following scenarios:

- **HTML Tables**: Only supports Markdown pipe tables
- **Multi-line Cells**: Cells containing `<br>` tags are not supported
- **Tables Without Separator Rows**: Tables must include a separator row (`|---|`) to be formatted
- **Dependency Requirements**: Requires `@opencode-ai/plugin` >= 0.13.7 (uses the undocumented `experimental.text.complete` hook)

::: info Version Requirements
The plugin requires OpenCode >= 1.0.137 and `@opencode-ai/plugin` >= 0.13.7 to work properly.
:::

---

## Future Plans

The following features are planned for future versions:

- **Configuration Options**: Support custom minimum/maximum column widths, disable specific features
- **Headerless Table Support**: Format tables without header rows
- **Performance Optimization**: Performance analysis and optimization for very large tables (100+ rows)
- **More Alignment Options**: Extend alignment syntax and functionality

::: tip Contribute
If you have feature suggestions or want to contribute code, feel free to share your ideas in [GitHub Issues](https://github.com/franlol/opencode-md-table-formatter/issues).
:::

---

## Changelog Format Explanation

This project's changelog follows the [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) format, and version numbers follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

**Version Format**: `MAJOR.MINOR.PATCH`

- **MAJOR**: Incompatible API changes
- **MINOR**: Backwards-compatible new features
- **PATCH**: Backwards-compatible bug fixes

**Change Types**:

- **Added**: New features
- **Changed**: Changes to existing features
- **Deprecated**: Features to be removed
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security-related fixes

---

## Recommended Reading Order

If you're a new user, we recommend learning in the following order:

1. [Quick Start: Installation and Configuration](../../start/getting-started/) — Get started quickly
2. [Features Overview: The Magic of Automatic Formatting](../../start/features/) — Understand core features
3. [FAQ: What to Do When Tables Aren't Formatted](../../faq/troubleshooting/) — Troubleshooting
4. [Known Limitations: Where Are the Plugin's Boundaries](../../appendix/limitations/) — Understand limitations
