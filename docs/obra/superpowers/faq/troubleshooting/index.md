---
title: "Superpowers Troubleshooting Guide: Claude Code, OpenCode, and Codex FAQ"
sidebarTitle: "Troubleshooting Guide"
subtitle: "Superpowers Common Issues and Troubleshooting"
description: "Learn how to troubleshoot and resolve common Superpowers issues. This guide covers troubleshooting for Claude Code, OpenCode, and Codex platforms, including plugin loading failures, skills not found, Windows module errors, Bootstrap not appearing, and more, helping you ensure the AI coding agent skill system runs smoothly and improve development efficiency."
tags:
  - "Troubleshooting"
  - "FAQ"
  - "Common Issues"
prerequisite: []
order: 240
---

# Superpowers Common Issues and Troubleshooting

::: info
This guide collects common issues and solutions for Superpowers across three platforms (Claude Code, OpenCode, and Codex). If you encounter issues not covered here, please visit [GitHub Issues](https://github.com/obra/superpowers/issues) to submit feedback.
:::

## Issues You May Be Encountering

- Plugin not working after installation, commands unavailable
- Empty skill list, AI agent unable to invoke workflows
- "Module not found" error on Windows
- Bootstrap prompt not appearing, skill system not initialized
- CLI script cannot execute, permission denied

## OpenCode Platform Common Issues

### Plugin Not Loaded

**Symptoms**: After OpenCode starts, Superpowers skills are unavailable, `/help` command shows no skill-related options.

**Troubleshooting Steps**:

1. **Check if plugin file exists**
   ```bash
   ls ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js
   ```

2. **Check if symbolic link is correct**
   - **macOS/Linux**:
     ```bash
     ls -l ~/.config/opencode/plugins/
     # Should see: superpowers.js -> ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js
     ```
   - **Windows**:
     ```powershell
     dir /AL %USERPROFILE%\.config\opencode\plugins
     # Should see directory link for superpowers.js
     ```

3. **View OpenCode logs**
   ```bash
   opencode run "test" --print-logs --log-level DEBUG
   ```

4. **Look for plugin loading messages in logs**
   - Successful loading will show message like `Plugin loaded: superpowers`
   - If there's an error, specific failure reason will be displayed

**Expected Result**: Plugin loaded successfully, skill list available in logs

---

### Skills Not Found

**Symptoms**: Skill tool prompts that skill doesn't exist, or skill list is empty.

**Troubleshooting Steps**:

1. **Verify skill symbolic link**
   ```bash
   ls -l ~/.config/opencode/skills/superpowers
   # Should point to superpowers/skills/ directory
   ```

2. **Use OpenCode's skill tool to list available skills**
   - If skills loaded correctly, you should see all 14 Superpowers skills
   - Including: brainstorming, writing-plans, test-driven-development, etc.

3. **Check skill file structure**
   ```bash
   ls ~/.config/opencode/skills/superpowers/
   # Should see directories: brainstorming, writing-plans, test-driven-development, etc.
   ```

4. **Verify SKILL.md file for each skill**
   - Each skill directory must contain `SKILL.md` file
   - SKILL.md file must have valid YAML frontmatter

**Expected Result**: Complete skill list, each skill directory has SKILL.md file

---

### Windows: Module Not Found Error

**Symptoms**: When using OpenCode on Windows, error `Cannot find module` or similar.

**Cause**: Git Bash's `ln -sf` command copies files instead of creating symbolic links on Windows, causing plugin to fail loading correctly.

**Solution**:

Use Windows directory junctions instead of symbolic links. Refer to Windows-specific steps in [OpenCode Installation Guide](../../platforms/opencode/), use `mklink /J` command to create directory junctions.

**Expected Result**: Plugin and skill directories correctly linked to Superpowers source directory

---

### Bootstrap Not Appearing

**Symptoms**: Superpowers guidance prompt not showing when OpenCode starts, skill system not initialized.

**Troubleshooting Steps**:

1. **Verify using-superpowers skill exists**
   ```bash
   ls ~/.config/opencode/superpowers/skills/using-superpowers/SKILL.md
   ```

2. **Check if OpenCode version supports transform hook**
   - Superpowers uses `experimental.chat.system.transform` hook
   - Ensure your OpenCode version supports this experimental feature
   - Check [OpenCode Changelog](https://github.com/OpenCode/OpenCode/releases) for latest version

3. **Restart OpenCode**
   - After plugin changes, must fully restart OpenCode for changes to take effect
   - Close OpenCode, then restart

**Expected Result**: Superpowers guidance message appears when OpenCode starts, skill system loaded

---

## Codex Platform Common Issues

### Skills Not Found

**Symptoms**: When using Codex's `skill` tool, prompts that skill doesn't exist, or skill list is empty.

**Troubleshooting Steps**:

1. **Verify installation path**
   ```bash
   ls ~/.codex/superpowers/skills
   # Should see directories: brainstorming, writing-plans, test-driven-development, etc.
   ```

2. **Check if CLI tool works normally**
   ```bash
   ~/.codex/superpowers/.codex/superpowers-codex find-skills
   # Should output skill list in JSON format
   ```

3. **Verify skill files**
   - Each skill directory must contain `SKILL.md` file
   - SKILL.md file must have valid YAML frontmatter

**Expected Result**: Complete skill list output, JSON format contains all skill information

---

### CLI Script Not Executable

**Symptoms**: "Permission denied" error when running Codex CLI script.

**Solution**:

```bash
chmod +x ~/.codex/superpowers/.codex/superpowers-codex
```

**Expected Result**: CLI script executes normally, no more permission errors

---

### Node.js Error

**Symptoms**: Node.js-related errors when running CLI script, or Node version too low prompt.

**Troubleshooting Steps**:

1. **Check Node.js version**
   ```bash
   node --version
   ```

2. **Verify version requirement**
   - Superpowers CLI script requires Node.js v14 or higher
   - Recommend using Node.js v18+ for complete ES module support
   - If version too low, download latest LTS version from [Node.js official site](https://nodejs.org/)

**Expected Result**: Node.js version v18 or higher

---

## Claude Code Platform Common Issues

### Plugin Not Working After Installation

**Symptoms**: After installing Superpowers via `/plugin install`, commands cannot be used.

**Troubleshooting Steps**:

1. **Verify plugin is installed**
   ```bash
   /plugin list
   # Should see superpowers in the list
   ```

2. **Check if commands are registered**
   ```bash
   /help
   # Should see following commands:
   # /superpowers:brainstorm - Interactive design refinement
   # /superpowers:write-plan - Create implementation plan
   # /superpowers:execute-plan - Execute plan in batches
   ```

3. **Reload plugin**
   ```bash
   /plugin reload superpowers
   ```

**Expected Result**: Three Superpowers commands appear in help list

---

### Skills Not Triggered

**Symptoms**: When talking to Claude Code, skill flow doesn't trigger automatically, AI directly starts writing code.

**Possible Causes**:

1. **Skills not loaded correctly**: Check if plugin installed successfully (see "Plugin Not Working After Installation" above)
2. **Conversation context doesn't match**: Some skills only trigger in specific contexts (e.g., `brainstorming` only triggers when "building new features")
3. **Skill priority issue**: If project has custom skills, they might override Superpowers skills

**Solution**:

Manually call skill commands:
```bash
/superpowers:brainstorm  # Start design process
/superpowers:write-plan # Write implementation plan
```

**Expected Result**: AI starts executing corresponding skill process

---

## General Troubleshooting Tips

### Checkpoints ✅

| Issue Type | Check Command | Expected Result |
| ---------- | ------------- | --------------- |
| Plugin loading | `ls -l ~/.config/opencode/plugins/` | Correct symbolic link |
| Skill files | `ls ~/.config/opencode/skills/superpowers/` | 14 skill directories |
| CLI tool | `~/.codex/superpowers/.codex/superpowers-codex find-skills` | JSON format skill list |
| Node version | `node --version` | v18+ |
| Git Bash symbolic link | `ls -l ~/.config/opencode/plugins/` | Directory junction (not file copy) |

### Pitfall Alerts

::: warning Windows Users
- Git Bash's `ln -sf` command will **copy files instead of creating symbolic links**
- Must use `mklink /J` to create directory junctions
- Refer to Windows-specific steps in platform-specific installation guide
:::

::: warning OpenCode Users
- Must **fully restart** OpenCode after plugin changes
- Use `opencode run "test" --print-logs --log-level DEBUG` to view detailed logs
- Ensure OpenCode version supports `experimental.chat.system.transform` hook
:::

::: warning Codex Users
- Ensure CLI script has executable permission
- Low Node.js version will cause ES module support issues
- Recommend v18+ for best compatibility
:::

---

## Lesson Summary

This lesson covered common issues and solutions for Superpowers across three platforms:

- **OpenCode**: Plugin loading, skill discovery, Windows symbolic links, Bootstrap issues
- **Codex**: Skill discovery, CLI permissions, Node.js version
- **Claude Code**: Plugin installation, skill triggering

Key troubleshooting techniques:
- Use `ls -l` to check symbolic links
- View detailed logs with `--print-logs --log-level DEBUG`
- Verify SKILL.md files and frontmatter format
- Windows users pay special attention to using `mklink /J` instead of `ln -sf`

If you encounter issues not covered in this guide, please visit [GitHub Issues](https://github.com/obra/superpowers/issues) to submit feedback.

---

## Next Lesson Preview

> Next lesson we learn **[Best Practices and Pitfall Avoidance](../best-practices/)**.
>
> You will learn:
> - How to maximize Superpowers effectiveness
> - Common usage traps and avoidance methods
> - Best practices for collaborating with AI coding agents
> - Core principles for maintaining code quality

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source locations</strong></summary>

> Updated: 2026-02-01

| Feature | File Path | Line |
| --- | --- | --- |
| OpenCode troubleshooting | [`docs/README.opencode.md`](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md#L282-L308) | 282-308 |
| Codex troubleshooting | [`docs/README.codex.md`](https://github.com/obra/superpowers/blob/main/docs/README.codex.md#L122-L145) | 122-145 |
| GitHub Issues | [`README.md`](https://github.com/obra/superpowers/blob/main/README.md#L158) | 158 |

**Key Constants**:
- Skill count: 14 skills (covering testing, debugging, collaboration, and meta-skill categories)

**Key Files**:
- `docs/README.opencode.md`: Complete OpenCode platform documentation, including troubleshooting section
- `docs/README.codex.md`: Complete Codex platform documentation, including troubleshooting section

**GitHub Issues**:
- https://github.com/obra/superpowers/issues - Submit issues and feedback

</details>
