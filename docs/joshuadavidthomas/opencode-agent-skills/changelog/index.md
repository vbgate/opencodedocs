---
title: "Version History | opencode-agent-skills"
sidebarTitle: "Changelog"
subtitle: "Version History | opencode-agent-skills"
description: "Learn about the version evolution history of the OpenCode Agent Skills plugin. This tutorial covers all major feature updates, bug fixes, architecture improvements, and breaking changes from v0.1.0 to v0.6.4."
tags:
  - "Version Updates"
  - "changelog"
  - "Release History"
order: 1
---

# Version History

This document records all version updates of the OpenCode Agent Skills plugin. Through the version history, you can understand the evolution path of features, fixed issues, and architecture improvements.

::: tip Current Version
The latest stable version is **v0.6.4** (2026-01-20)
:::

## Version Timeline

| Version | Release Date | Type | Main Content |
| ------- | ----------- | ---- | ------------ |
| 0.6.4 | 2026-01-20 | Fix | YAML parsing, Claude v2 support |
| 0.6.3 | 2025-12-16 | Improvement | Optimize skill recommendation prompts |
| 0.6.2 | 2025-12-15 | Fix | Separate skill name from directory name |
| 0.6.1 | 2025-12-13 | Improvement | Avoid recommending already loaded skills |
| 0.6.0 | 2025-12-12 | New Feature | Semantic matching, embedding precomputation |
| 0.5.0 | 2025-12-11 | Improvement | Fuzzy matching suggestions, refactoring |
| 0.4.1 | 2025-12-08 | Improvement | Simplify installation method |
| 0.4.0 | 2025-12-05 | Improvement | Recursive script search |
| 0.3.3 | 2025-12-02 | Fix | Symlink handling |
| 0.3.2 | 2025-11-30 | Fix | Preserve agent mode |
| 0.3.1 | 2025-11-28 | Fix | Model switching issue |
| 0.3.0 | 2025-11-27 | New Feature | File listing functionality |
| 0.2.0 | 2025-11-26 | New Feature | Superpowers mode |
| 0.1.0 | 2025-11-26 | Initial | 4 tools, multi-location discovery |

## Detailed Change Log

### v0.6.4 (2026-01-20)

**Fixes**:
- Fixed YAML frontmatter parsing for skill multi-line descriptions (supporting `|` and `>` block scalar syntax) by replacing custom parser with `yaml` library
- Added support for Claude plugin v2 format, `installed_plugins.json` now uses plugin installation array instead of single object

**Improvements**:
- Claude Code plugin cache discovery now supports new nested directory structure (`cache/<marketplace>/<plugin>/<version>/skills/`)

### v0.6.3 (2025-12-16)

**Improvements**:
- Optimized skill evaluation prompts to prevent models from sending "no skill needed" messages to users (users don't see hidden evaluation prompts)

### v0.6.2 (2025-12-15)

**Fixes**:
- Skill validation now allows directory names to differ from the `name` in SKILL.md frontmatter. The `name` in frontmatter is the canonical identifier, while directory names are only for organization. This aligns with the Anthropic Agent Skills specification.

### v0.6.1 (2025-12-13)

**Improvements**:
- Dynamic skill recommendations now track loaded skills per session to avoid recommending already loaded skills, reducing redundant prompts and context usage

### v0.6.0 (2025-12-12)

**Additions**:
- **Semantic Skill Matching**: After initial skill list injection, subsequent messages use local embeddings to match with skill descriptions
- Added `@huggingface/transformers` dependency for local embedding generation (quantized all-MiniLM-L6-v2)
- When messages match available skills, inject 3-step evaluation prompt (EVALUATE → DECIDE → ACTIVATE) to encourage skill loading (inspired by [@spences10](https://github.com/spences10)'s [blog post](https://scottspence.com/posts/how-to-make-claude-code-skills-activate-reliably))
- Cache embeddings on disk for low-latency matching (~/.cache/opencode-agent-skills/)
- Clean up sessions on `session.deleted` event

### v0.5.0 (2025-12-11)

**Additions**:
- Added "Did you mean..." fuzzy matching suggestions in all tools (`use_skill`, `read_skill_file`, `run_skill_script`, `get_available_skills`)

**Improvements**:
- **Breaking Change**: Renamed `find_skills` tool to `get_available_skills` for clearer intent
- **Internal**: Reorganized codebase into separate modules (`claude.ts`, `skills.ts`, `tools.ts`, `utils.ts`, `superpowers.ts`) for improved maintainability
- **Internal**: Improved code quality by removing AI-generated comments and unnecessary code

### v0.4.1 (2025-12-08)

**Improvements**:
- Installation method now uses npm package via OpenCode config instead of git clone + symlink

**Removals**:
- Removed `INSTALL.md` (no longer needed after simplification)

### v0.4.0 (2025-12-05)

**Improvements**:
- Script discovery now recursively searches the entire skill directory (max depth 10) instead of only root directory and `scripts/` subdirectory
- Scripts are now identified by relative paths (e.g., `tools/build.sh`) instead of base names
- Renamed `skill_name` parameter to `skill` in `read_skill_file`, `run_skill_script`, and `use_skill` tools
- Renamed `script_name` parameter to `script` in `run_skill_script` tool

### v0.3.3 (2025-12-02)

**Fixes**:
- Fixed file and directory detection by using `fs.stat` to correctly handle symbolic links

### v0.3.2 (2025-11-30)

**Fixes**:
- Preserved agent mode when injecting synthetic messages at session start

### v0.3.1 (2025-11-28)

**Fixes**:
- Fixed unintended model switching when using skill tools by explicitly passing current model in `noReply` operation (temporary workaround for opencode issue #4475)

### v0.3.0 (2025-11-27)

**Additions**:
- Added file list in `use_skill` output

### v0.2.0 (2025-11-26)

**Additions**:
- Added Superpowers mode support
- Added release proof

### v0.1.0 (2025-11-26)

**Additions**:
- Added `use_skill` tool to load skill content into context
- Added `read_skill_file` tool to read supporting files in skill directory
- Added `run_skill_script` tool to execute scripts from skill directory
- Added `find_skills` tool to search and list available skills
- Added multi-location skill discovery (project-level, user-level, and Claude-compatible locations)
- Added frontmatter validation compliant with Anthropic Agent Skills Spec v1.0
- Added automatic skill list injection at session start and after context compression

**New Contributors**:
- Josh Thomas <josh@joshthomas.dev> (Maintainer)

## Feature Evolution Overview

| Feature | Introduced Version | Evolution Path |
| ------- | ----------------- | -------------- |
| 4 Basic Tools | v0.1.0 | v0.5.0 added fuzzy matching |
| Multi-location Skill Discovery | v0.1.0 | v0.4.1 simplified installation, v0.6.4 added Claude v2 support |
| Auto Context Injection | v0.1.0 | v0.3.0 added file list, v0.6.1 avoided duplicate recommendations |
| Superpowers Mode | v0.2.0 | Continuously stable |
| Recursive Script Search | v0.4.0 | v0.3.3 fixed symlinks |
| Semantic Matching Recommendation | v0.6.0 | v0.6.1 avoided duplicates, v0.6.3 optimized prompts |
| Fuzzy Matching Suggestions | v0.5.0 | Continuously stable |

## Breaking Changes

### v0.6.0: Semantic Matching Feature

Introduced local embedding-based semantic matching capability, allowing AI to automatically recommend relevant skills based on user message content without users needing to memorize skill names.

- **Technical Details**: Using HuggingFace's `all-MiniLM-L6-v2` model (q8 quantized)
- **Caching Mechanism**: Embedding results cached to `~/.cache/opencode-agent-skills/`, improving subsequent matching speed
- **Matching Process**: User message → embedding → calculate cosine similarity with skill descriptions → Top 5 recommendations (threshold 0.35)

### v0.5.0: Refactoring and Tool Renaming

Code architecture refactored to modular design with clearer tool naming:

- `find_skills` → `get_available_skills`
- `skill_name` → `skill`
- `script_name` → `script`

### v0.4.0: Script Discovery Mechanism Upgrade

Script discovery upgraded from "root directory + scripts/ only" to "recursive search of entire skill directory" (max depth 10), supporting more flexible script organization.

### v0.2.0: Superpowers Integration

Added support for Superpowers workflow mode, requiring installation of `using-superpowers` skill and setting environment variable `OPENCODE_AGENT_SKILLS_SUPERPOWERS_MODE=true`.

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line |
| ------- | --------- | ---- |
| Current Version | [`package.json`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L3-L3) | 3 |
| Version History | [`CHANGELOG.md`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/CHANGELOG.md#L19-L152) | 19-152 |

**Key Version Information**:
- `v0.6.4`: Current version (2026-01-20)
- `v0.6.0`: Semantic matching introduced (2025-12-12)
- `v0.5.0`: Refactoring version (2025-12-11)
- `v0.1.0`: Initial version (2025-11-26)

</details>
