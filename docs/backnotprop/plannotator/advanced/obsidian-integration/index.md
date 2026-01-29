---
title: "Obsidian: Save Plans | plannotator"
sidebarTitle: "Obsidian"
subtitle: "Obsidian: Auto-save Plans to Vault"
description: "学习配置 Obsidian 集成自动保存计划。一键保存到库，生成标签和元数据。"
tags:
  - "plannotator"
  - "integration"
  - "obsidian"
  - "advanced"
prerequisite:
  - "start-getting-started"
order: 2
---

# Obsidian Integration: Auto-save Plans to Vault

## What You'll Learn

- Automatically save approved or rejected plans to your Obsidian vault
- Understand frontmatter and tag generation mechanisms
- Customize save paths and folders
- Use backlinks to build knowledge graphs

## The Problem

You review AI-generated plans in Plannotator, but after approval, these plans just "disappear." You want to save these valuable plans to Obsidian for future reference and lookup, but manual copy-pasting is tedious and breaks formatting.

## When to Use This

- You use Obsidian as your knowledge management tool
- You want to preserve and review AI-generated implementation plans long-term
- You want to leverage Obsidian's graph view and tag system to organize plans

## Core Concepts

Plannotator's Obsidian integration automatically saves plan content to your Obsidian vault when you approve or reject a plan. The system will:

1. **Detect vaults**: Automatically read all vaults from Obsidian configuration file
2. **Generate frontmatter**: Include creation time, source, and tags
3. **Extract tags**: Automatically extract tags from plan titles and code block languages
4. **Add backlink**: Insert `[[Plannotator Plans]]` link to build knowledge graph

::: info What is Obsidian?
Obsidian is a local-first bi-directional linking note-taking app that supports Markdown format and visualizes note relationships through graph view.
:::

## 🎒 Prerequisites

Ensure Obsidian is installed and configured. Plannotator will automatically detect vaults on your system, but you need at least one vault to use this feature.

## Follow Along

### Step 1: Open Settings Panel

In the Plannotator interface, click the gear icon in the top-right corner to open the settings panel.

You should see a settings dialog with multiple configuration options.

### Step 2: Enable Obsidian Integration

In the settings panel, find the "Obsidian Integration" section and toggle it on.

After enabling, Plannotator will automatically detect Obsidian vaults on your system.

You should see a dropdown menu listing detected vaults (e.g., `My Vault`, `Work Notes`).

### Step 3: Select Vault and Folder

From the dropdown menu, select the vault where you want to save plans. If no vaults are detected, you can:

1. Select the "Custom path..." option
2. Enter the full path to your vault in the text box

Then set the folder name for saving plans in the "Folder" field (default is `plannotator`).

You should see a preview path below showing where plans will be saved.

### Step 4: Approve or Reject Plan

After configuration, review AI-generated plans as usual. When you click "Approve" or "Send Feedback," the plan will be automatically saved to the configured vault.

You should see a new file created in Obsidian, with filename format like `Title - Jan 2, 2026 2-30pm.md`.

### Step 5: View Saved File

Open the saved file in Obsidian, and you'll see the following content:

```markdown
---
created: 2026-01-24T14:30:00.000Z
source: plannotator
tags: [plan, authentication, typescript, sql]
---

[[Plannotator Plans]]

## Implementation Plan: User Authentication

...
```

You should notice the YAML frontmatter at the top of the file, containing creation time, source, and tags.

## Checkpoint ✅

- [ ] Obsidian Integration is enabled in settings panel
- [ ] Vault is selected (or custom path entered)
- [ ] Folder name is set
- [ ] New files appear in Obsidian after approving or rejecting plans
- [ ] Files contain frontmatter and `[[Plannotator Plans]]` backlink

## Frontmatter and Tags Explained

### Frontmatter Structure

Each saved plan includes the following frontmatter fields:

| Field   | Example                           | Description                         |
| ------ | -------------------------------- | ---------------------------- |
| `created` | `2026-01-24T14:30:00.000Z`    | ISO 8601 formatted creation timestamp     |
| `source` | `plannotator`                   | Fixed value, identifies source             |
| `tags` | `[plan, authentication, typescript]` | Automatically extracted tag array |

### Tag Generation Rules

Plannotator uses the following rules to automatically extract tags:

1. **Default tag**: Always includes `plannotator` tag
2. **Project name tag**: Automatically extracted from git repository name or directory name
3. **Title keywords**: Extracts meaningful words from the first H1 heading (excluding common stopwords)
4. **Code language tag**: Extracts from code block language identifiers (e.g., `typescript`, `sql`). Generic configuration languages (like `json`, `yaml`, `markdown`) are automatically filtered.

Stopwords list (not used as tags):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

Tag count limit: Maximum 7 tags, ordered by extraction sequence.

### Filename Format

Filenames use a highly readable format: `Title - Jan 2, 2026 2-30pm.md`

| Part       | Example         | Description                  |
| ---------- | ------------ | --------------------- |
| Title       | `User Authentication` | Extracted from H1, limited to 50 characters |
| Date       | `Jan 2, 2026` | Current date               |
| Time       | `2-30pm`     | Current time (12-hour format)   |

### Backlink Mechanism

Each plan file has a `[[Plannotator Plans]]` link inserted at the bottom. This backlink serves to:

- **Knowledge graph connection**: In Obsidian's graph view, all plans connect to the same node
- **Quick navigation**: Click `[[Plannotator Plans]]` to create an index page that summarizes all saved plans
- **Bi-directional linking**: Use backlinks in the index page to view all plans

## Cross-Platform Support

Plannotator automatically detects Obsidian configuration file locations across different operating systems:

| Operating System | Configuration File Path                                    |
| -------- | ----------------------------------------------- |
| macOS     | `~/Library/Application Support/obsidian/obsidian.json` |
| Windows   | `%APPDATA%\obsidian/obsidian.json`                 |
| Linux     | `~/.config/obsidian/obsidian.json`                 |

If automatic detection fails, you can manually enter the vault path.

## Common Pitfalls

### Problem 1: Vaults Not Detected

**Symptom**: Dropdown menu shows "Detecting..." but no results

**Cause**: Obsidian configuration file doesn't exist or is malformed

**Solution**:
1. Confirm Obsidian is installed and has been opened at least once
2. Check if configuration file exists (refer to paths in table above)
3. Use "Custom path..." to manually enter vault path

### Problem 2: Cannot Find Saved File

**Symptom**: After approving a plan, no new files appear in Obsidian

**Cause**: Vault path is incorrect or Obsidian hasn't refreshed

**Solution**:
1. Check if the preview path in settings panel is correct
2. In Obsidian, click "Reload vault" or press `Cmd+R` (macOS) / `Ctrl+R` (Windows/Linux)
3. Verify the correct vault is selected

### Problem 3: Filename Contains Special Characters

**Symptom**: Underscores or other replacement characters appear in filename

**Cause**: Title contains characters not supported by file system (`< > : " / \ | ? *`)

**Solution**: This is expected behavior. Plannotator automatically replaces these characters to avoid file system errors.

## Summary

Obsidian integration seamlessly connects your plan review workflow with knowledge management:

- ✅ Automatically save approved or rejected plans
- ✅ Intelligently extract tags for easy retrieval
- ✅ Generate frontmatter for consistent metadata format
- ✅ Add backlinks to build knowledge graphs

After configuring once, every review will be automatically archived—no more manual copy-pasting.

## Next Up

> In the next lesson, we'll learn **[Bear Integration](../bear-integration/)**.
>
> You'll learn:
> - How to save plans to Bear note-taking app
> - Differences between Bear integration and Obsidian integration
> - Using x-callback-url to automatically create notes

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature                | File Path                                                                                     | Line Number |
| ------------------- | -------------------------------------------------------------------------------------------- | ----------- |
| Detect Obsidian vaults | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L135-L175) | 135-175 |
| Save plans to Obsidian | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L227) | 180-227 |
| Extract tags             | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74   |
| Generate frontmatter     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L81-L89) | 81-89   |
| Generate filename           | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L111-L127) | 111-127 |
| Obsidian settings storage     | [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L36-L43) | 36-43   |
| Settings UI component      | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L387-L491) | 387-491 |

**Key Functions**:
- `detectObsidianVaults()`: Reads Obsidian configuration file, returns list of available vault paths
- `saveToObsidian(config)`: Saves plan to specified vault, including frontmatter and backlink
- `extractTags(markdown)`: Extracts tags from plan content (title keywords, code languages, project name)
- `generateFrontmatter(tags)`: Generates YAML frontmatter string
- `generateFilename(markdown)`: Generates readable filename

**Business Rules**:
- Maximum 7 tags (L73)
- Filename limited to 50 characters (L102)
- Supports cross-platform config file path detection (L141-149)
- Automatically creates non-existent folders (L208)

</details>
