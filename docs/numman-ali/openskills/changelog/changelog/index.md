---
title: "Changelog: Version History and Updates | OpenSkills"
sidebarTitle: "Changelog"
subtitle: "Changelog: Version History and Updates"
description: "View OpenSkills version history and release notes. Track new features like update command, symlink support, private repo access, and bug fixes across all releases."
tags:
  - "changelog"
  - "version history"
order: 1
---

# Changelog

This page records OpenSkills version history, helping you understand new features, improvements, and bug fixes in each version.

---

## [1.5.0] - 2026-01-17

### New Features

- **`openskills update`** - Refresh installed skills from recorded sources (default: refresh all)
- **Source metadata tracking** - Installation now records source information for reliable skill updates

### Improvements

- **Multi-skill reading** - The `openskills read` command now supports comma-separated skill name lists
- **Usage instructions** - Improved shell environment prompt messages for the read command
- **README** - Added update guide and manual usage instructions

### Bug Fixes

- **Update experience optimization** - Skip skills without source metadata and list these skills to prompt reinstallation

---

## [1.4.0] - 2026-01-17

### Improvements

- **README** - Clarified project-local default installation method, removed redundant sync prompts
- **Installation messages** - Installer now clearly distinguishes between project-local default installation and the `--global` option

---

## [1.3.2] - 2026-01-17

### Improvements

- **Documentation and AGENTS.md guidance** - All command examples and generated usage instructions now consistently use `npx openskills`

---

## [1.3.1] - 2026-01-17

### Bug Fixes

- **Windows installation** - Fixed path validation issues on Windows systems ("Security error: Installation path outside target directory")
- **CLI version** - `npx openskills --version` now correctly reads the version number from package.json
- **Root directory SKILL.md** - Fixed installation issues for single-skill repositories where SKILL.md is in the repository root

---

## [1.3.0] - 2025-12-14

### New Features

- **Symlink support** - Skills can now be installed via symlinks to the skills directory ([#3](https://github.com/numman-ali/openskills/issues/3))
  - Supports git-based skill updates through symlinks created from cloned repositories
  - Supports local skill development workflows
  - Broken symlinks are gracefully skipped

- **Configurable output path** - sync command now supports `--output` / `-o` option ([#5](https://github.com/numman-ali/openskills/issues/5))
  - Can sync to any `.md` file (e.g., `.ruler/AGENTS.md`)
  - Automatically creates file and adds title if file doesn't exist
  - Automatically creates nested directories if needed

- **Local path installation** - Supports installing skills from local directories ([#10](https://github.com/numman-ali/openskills/issues/10))
  - Supports absolute paths (`/path/to/skill`)
  - Supports relative paths (`./skill`, `../skill`)
  - Supports tilde expansion (`~/my-skills/skill`)

- **Private git repository support** - Supports installing skills from private repositories ([#10](https://github.com/numman-ali/openskills/issues/10))
  - SSH URLs (`git@github.com:org/private-skills.git`)
  - HTTPS URLs with authentication
  - Automatically uses system SSH keys

- **Comprehensive test suite** - 88 tests across 6 test files
  - Unit tests for symlink detection, YAML parsing
  - Integration tests for install, sync commands
  - End-to-end tests for complete CLI workflows

### Improvements

- **`--yes` flag now skips all prompts** - Fully non-interactive mode, suitable for CI/CD ([#6](https://github.com/numman-ali/openskills/issues/6))
  - No prompt when overwriting existing skills
  - Displays `Overwriting: <skill-name>` message when skipping prompts
  - All commands can now run in headless environments

- **CI workflow reordering** - Build steps now run before tests
  - Ensures `dist/cli.js` exists for end-to-end testing

### Security

- **Path traversal protection** - Validates that installation paths stay within target directory
- **Symlink dereferencing** - `cpSync` uses `dereference: true` to safely copy symlink targets
- **Non-greedy YAML regex** - Prevents potential ReDoS attacks in frontmatter parsing

---

## [1.2.1] - 2025-10-27

### Bug Fixes

- README documentation cleanup - Removed duplicate sections and incorrect flags

---

## [1.2.0] - 2025-10-27

### New Features

- `--universal` flag, installs skills to `.agent/skills/` instead of `.claude/skills/`
  - Suitable for multi-agent environments (Claude Code + Cursor/Windsurf/Aider)
  - Avoids conflicts with Claude Code native marketplace plugins

### Improvements

- Project-local installation is now the default option (previously global installation)
- Skills install to `./.claude/skills/` by default

---

## [1.1.0] - 2025-10-27

### New Features

- Comprehensive single-page README with technical deep dive
- Side-by-side comparison with Claude Code

### Bug Fixes

- Location badges now correctly display `project` or `global` based on installation location

---

## [1.0.0] - 2025-10-26

### New Features

- Initial release
- `npx openskills install <source>` - Install skills from GitHub repositories
- `npx openskills sync` - Generate `<available_skills>` XML for AGENTS.md
- `npx openskills list` - Display installed skills
- `npx openskills read <name>` - Load skill content for agents
- `npx openskills manage` - Interactive skill deletion
- `npx openskills remove <name>` - Remove specific skills
- Interactive TUI interface for all commands
- Supports Anthropic's SKILL.md format
- Progressive disclosure (load skills on-demand)
- Bundled resources support (references/, scripts/, assets/)

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature        | File Path                                                                      |
| -------------- | ----------------------------------------------------------------------------- |
| Changelog original | [`CHANGELOG.md`](https://github.com/numman-ali/openskills/blob/main/CHANGELOG.md) |

</details>
