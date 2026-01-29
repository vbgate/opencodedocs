---
title: "Bear Integration: Auto-save Plans | Plannotator"
sidebarTitle: "Bear Integration"
subtitle: "Bear Integration: Auto-save Approved Plans"
description: "Learn to configure Bear integration to auto-save approved plans via x-callback-url. Covers enabling integration, tag generation, and save verification."
tags:
  - "integration"
  - "Bear"
  - "note-taking app"
  - "knowledge management"
prerequisite:
  - "installation-claude-code"
  - "platforms-plan-review-basics"
order: 3
---

# Bear Integration: Auto-save Approved Plans

## What You'll Learn

After enabling Bear integration, each time you approve a plan, Plannotator automatically saves it to your Bear notes, including:
- Auto-generated title (extracted from the plan)
- Smart tags (project name, keywords, programming languages)
- Complete plan content

This way you can manage all approved plans in one place, making it easy to reference later and build your knowledge base.

## Your Current Struggle

You may have encountered these situations:
- AI generates great plans, but you want to save them for future reference
- Manually copying and pasting plans into Bear is tedious
- Plans from different projects get mixed together without proper tagging

With Bear integration, these problems are automatically solved.

## When to Use This

- You use Bear as your primary note-taking app
- You need to archive approved plans as a knowledge base
- You want to quickly retrieve historical plans through tags

::: info About Bear
Bear is a Markdown note-taking app for macOS that supports tags, encryption, sync, and more. If you haven't installed it yet, visit [bear.app](https://bear.app/) to learn more.
:::

## 🎒 Prerequisites

- Plannotator installed (see [Installation Tutorial](../../start/installation-claude-code/))
- Bear installed and working properly
- Familiarity with basic plan review workflow (see [Plan Review Basics](../../platforms/plan-review-basics/))

## Core Concept

The core of Bear integration is the **x-callback-url** protocol:

1. Enable Bear integration in Plannotator UI (stored in browser localStorage)
2. When approving a plan, Plannotator sends a `bear://x-callback-url/create` URL
3. The system uses the `open` command to automatically launch Bear and create a note
4. Plan content, title, and tags are automatically filled in

**Key features**:
- No need to configure vault path (unlike Obsidian which requires specifying a vault)
- Smart tag generation (up to 7 tags)
- Auto-save when approving plans

::: tip Difference from Obsidian
Bear integration is simpler—you don't need to configure a vault path, just a single toggle. However, Obsidian allows specifying save folders and more customization.
:::

## Follow Along

### Step 1: Open Plannotator Settings

After the AI Agent generates a plan and opens the Plannotator UI, click the ⚙️ **Settings** button in the top-right corner.

**You should see**: Settings panel opens with multiple configuration options

### Step 2: Enable Bear Integration

In the settings panel, find the **Bear Notes** section and click the toggle button.

**Why**
The toggle will change from gray (disabled) to blue (enabled), and be stored in the browser's localStorage.

**You should see**:
- Bear Notes toggle turns blue
- Description text: "Auto-save approved plans to Bear"

### Step 3: Approve a Plan

After completing plan review, click the **Approve** button at the bottom.

**Why**
Plannotator reads the Bear settings. If enabled, it calls Bear's x-callback-url when approving.

**You should see**:
- Bear app automatically opens
- New note window pops up
- Title and content are already filled
- Tags are auto-generated (starting with `#`)

### Step 4: Check the Saved Note

In Bear, check the newly created note to confirm:
- Title is correct (from the plan's H1)
- Content is complete (includes full plan text)
- Tags are reasonable (project name, keywords, programming language)

**You should see**:
A note structure similar to this:

```markdown
## User Authentication

[Full plan content...]

#plannotator #myproject #authentication #typescript #api
```

## Checkpoint ✅

- [ ] Bear Notes toggle is enabled in Settings
- [ ] Bear automatically opens after approving a plan
- [ ] Note title matches the plan's H1
- [ ] Note contains complete plan content
- [ ] Tags include `#plannotator` and project name
## Common Pitfalls

### Bear doesn't automatically open

**Cause**: System `open` command failed, possibly because:
- Bear is not installed or not downloaded from App Store
- Bear's URL scheme is hijacked by another app

**Solution**:
1. Confirm Bear is properly installed
2. Test manually in terminal: `open "bear://x-callback-url/create?title=test"`

### Tags don't meet expectations

**Cause**: Tags are auto-generated with the following rules:
- Required: `#plannotator`
- Required: Project name (extracted from git repo name or directory name)
- Optional: Extract up to 3 keywords from H1 title (excluding stop words)
- Optional: Extract programming language tags from code blocks (excluding json/yaml/markdown)
- Maximum 7 tags

**Solution**:
- When tags don't meet expectations, you can manually edit in Bear
- If project name is incorrect, check git repository configuration or directory name

### Approved but not saved

**Cause**:
- Bear toggle not enabled (check Settings)
- Network error or Bear response timeout
- Plan content is empty

**Solution**:
1. Confirm toggle is blue (enabled state) in Settings
2. Check terminal for error logs (`[Bear] Save failed:`)
3. Re-approve the plan

## Tag Generation Mechanism Explained

Plannotator intelligently generates tags so you can quickly retrieve plans in Bear. Here are the tag generation rules:

| Tag Source | Example | Priority |
|--- | --- | ---|
| Fixed tag | `#plannotator` | Required |
| Project name | `#myproject`, `#plannotator` | Required |
| H1 keywords | `#authentication`, `#api` | Optional (up to 3) |
| Programming language | `#typescript`, `#python` | Optional |

**Stop words list** (won't be used as tags):
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

**Programming language exclusions** (won't be used as tags):
- `json`, `yaml`, `yml`, `text`, `txt`, `markdown`, `md`

::: details Example: Tag Generation Process
Assume the plan title is "Implementation Plan: User Authentication System in TypeScript", and code blocks contain Python and JSON:

1. **Fixed tag**: `#plannotator`
2. **Project name**: `#myproject` (assuming git repo name)
3. **H1 keywords**:
   - `implementation` → excluded (stop word)
   - `plan` → excluded (stop word)
   - `user` → keep → `#user`
   - `authentication` → keep → `#authentication`
   - `system` → keep → `#system`
   - `typescript` → keep → `#typescript`
4. **Programming languages**:
   - `python` → keep → `#python`
   - `json` → excluded (exclusion list)

Final tags: `#plannotator #myproject #user #authentication #system #typescript #python` (7 tags, reached limit)
:::
## Comparison with Obsidian Integration

| Feature | Bear Integration | Obsidian Integration |
|--- | --- | ---|
| Configuration complexity | Simple (toggle only) | Medium (need to select vault and folder) |
| Storage | Inside Bear app | Specified vault path |
| Filename | Auto-managed by Bear | `Title - Mon D, YYYY H-MMam.md` |
| Frontmatter | None (Bear doesn't support) | Yes (created, source, tags) |
| Cross-platform | macOS only | macOS/Windows/Linux |
| x-callback-url | ✅ Uses | ❌ Directly writes files |

::: tip How to Choose
- If you only use macOS and like Bear: Bear integration is simpler
- If you need cross-platform or custom storage paths: Obsidian integration is more flexible
- If you want to use both: You can enable both simultaneously (approved plans will save to both places)
:::

## Summary

- Bear integration works via x-callback-url protocol with simple configuration
- Just enable the toggle in Settings, no need to specify paths
- Auto-saves to Bear when approving plans
- Tags are intelligently generated including project name, keywords, and programming languages (up to 7)
- Compared to Obsidian integration, Bear is simpler but has fewer features

## Next Steps

> Next, we'll learn **[Remote/Devcontainer Mode](../remote-mode/)**.
>
> You'll learn:
> - How to use Plannotator in remote environments (SSH, devcontainer, WSL)
> - Configure fixed ports and port forwarding
> - Open browser to view review pages in remote environments

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Feature        | File Path                                                                                    | Lines   |
|--- | --- | ---|
| Bear config interface | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L18-L20) | 18-20   |
| Save to Bear  | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L257) | 234-257 |
| Tag extraction | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74   |
| Title extraction | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L94-L105) | 94-105  |
| Bear settings interface | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L15-L17) | 15-17   |
| Read Bear settings | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L22-L26) | 22-26   |
| Save Bear settings | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L31-L33) | 31-33   |
| UI settings component | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L496-L518) | 496-518 |
| Call Bear on approve | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L512-L514) | 512-514 |
| Server handle Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L250-L257) | 250-257 |

**Key functions**:
- `saveToBear(config: BearConfig)`: Save plan to Bear via x-callback-url
- `extractTags(markdown: string)`: Intelligently extract tags from plan content (up to 7)
- `extractTitle(markdown: string)`: Extract note title from plan's H1 heading
- `getBearSettings()`: Read Bear integration settings from localStorage
- `saveBearSettings(settings)`: Save Bear integration settings to localStorage

**Key constants**:
- `STORAGE_KEY_ENABLED = 'plannotator-bear-enabled'`: localStorage key name for Bear settings

**Bear URL format**:
```typescript
bear://x-callback-url/create?title={title}&text={content}&open_note=no
```

</details>
