---
title: "Quick Start: Master Plannotator | Plannotator"
subtitle: "Quick Start: Master Plannotator in 5 Minutes"
sidebarTitle: "Quick Start"
description: "Master Plannotator in 5 minutes. Install CLI, configure plugins, and complete your first plan and code review with visual annotations."
tags:
  - "Quick Start"
  - "Getting Started"
  - "Installation"
  - "Claude Code"
  - "OpenCode"
order: 1
---

# Quick Start: Master Plannotator in 5 Minutes

## What You'll Learn

- ✅ Understand Plannotator's core features and use cases
- ✅ Install Plannotator in under 5 minutes
- ✅ Configure Claude Code or OpenCode integration
- ✅ Complete your first plan review and code review

## The Problem

**Plannotator** is an interactive review tool designed for Claude Code and OpenCode that helps you solve these problems:

**Pain Point 1**: AI-generated implementation plans are read in terminals with large text volumes and unclear structure, making review exhausting.

**Pain Point 2**: When providing feedback to AI, you can only use text descriptions like "delete paragraph 3" or "modify this function", which is inefficient.

**Pain Point 3**: During code review, you need to switch between multiple terminals or IDEs, making it hard to stay focused.

**Pain Point 4**: Team members want to participate in reviews but don't know how to share plan content.

**What Plannotator Does for You**:
- Visual UI replaces terminal reading with clear structure
- Select text to add annotations (delete, replace, comment) for precise feedback
- Visual Git diff review with line-level comments
- URL sharing for team collaboration without backend

## When to Use This

**Use Cases**:
- Using Claude Code or OpenCode for AI-assisted development
- Need to review AI-generated implementation plans
- Need to review code changes
- Need to share plans or code review results with team members

**Not Suitable For**:
- Pure manual coding (no AI-generated plans)
- Already have complete code review processes (like GitHub PR)
- Don't need visual review tools

## Core Concepts

### What is Plannotator

**Plannotator** is an interactive review tool designed for AI Coding Agents (Claude Code, OpenCode), primarily providing two features:

1. **Plan Review**: Visually review AI-generated implementation plans, supporting annotations, approval, or rejection
2. **Code Review**: Visually review Git diffs, supporting line-level comments and multiple view modes

### How It Works

```
┌─────────────────┐
│  AI Agent      │
│  (generates)   │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Plannotator   │  ← Local HTTP server
│  (visual UI)   │
└────────┬────────┘
          │
          ▼
┌─────────────────┐
│  Browser       │
│  (user review) │
└─────────────────┘
```

**Core Flow**:
1. AI Agent completes plan or code changes
2. Plannotator starts a local HTTP server and opens browser
3. User views plan/code in browser and adds annotations
4. User approves or rejects, Plannotator returns decision to AI Agent
5. AI Agent continues implementation or modifies based on feedback

### Security

**All data processed locally**, never uploaded to cloud:
- Plan content, code diffs, and annotations are stored on your local machine
- Local HTTP server uses random port (or fixed port)
- URL sharing is implemented by compressing data into URL hash, no backend needed

## 🎒 Prerequisites

**System Requirements**:
- Operating System: macOS / Linux / Windows / WSL
- Runtime: Bun (install script handles this automatically)
- AI Environment: Claude Code 2.1.7+ or OpenCode

**Installation Options**:
- If using Claude Code: Need CLI + plugin
- If using OpenCode: Need plugin configuration
- If only doing code review: Only CLI needed

## Follow Along

### Step 1: Install Plannotator CLI

**macOS / Linux / WSL**:

```bash
curl -fsSL https://plannotator.ai/install.sh | bash
```

**Windows PowerShell**:

```powershell
irm https://plannotator.ai/install.ps1 | iex
```

**Windows CMD**:

```cmd
curl -fsSL https://plannotator.ai/install.cmd -o install.cmd && install.cmd && del install.cmd
```

**What You Should See**: The install script will automatically download Plannotator CLI, add it to your system PATH, and display the version number (e.g., "plannotator v0.6.7 installed to ...").

::: tip What does the install script do?
The install script will:
1. Download the latest version of Plannotator CLI
2. Add to system PATH
3. Clean up any existing old versions
4. Automatically install the `/plannotator-review` command (for code review)
:::

### Step 2: Configure Claude Code (Optional)

If you use Claude Code, you need to install the plugin.

**Run in Claude Code**:

```
/plugin marketplace add backnotprop/plannotator
/plugin install plannotator@plannotator
```

**Important**: After installing the plugin, **you MUST restart Claude Code** for the hooks to take effect.

**What You Should See**: After successful plugin installation, `plannotator` will appear in Claude Code's plugin list.

::: info Manual Configuration (Optional)
If you don't want to use the plugin system, you can manually configure hooks. See [Claude Code Plugin Installation](../installation-claude-code/) section.
:::

### Step 3: Configure OpenCode (Optional)

If you use OpenCode, you need to edit the `opencode.json` file.

**Edit `opencode.json`**:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["@plannotator/opencode@latest"]
}
```

**Restart OpenCode**.

**What You Should See**: After restart, OpenCode will automatically load the plugin and the `submit_plan` tool will be available.

### Step 4: First Plan Review (Claude Code Example)

**Trigger**: Have Claude Code generate an implementation plan and call `ExitPlanMode`.

**Example Dialogue**:

```
User: Help me write an implementation plan for user authentication module

Claude: Sure, here's the implementation plan:
1. Create user model
2. Implement registration API
3. Implement login API
...
(calls ExitPlanMode)
```

**What You Should See**:
1. Browser automatically opens Plannotator UI
2. Shows AI-generated plan content
3. You can select plan text and add annotations (delete, replace, comment)
4. Bottom has "Approve" and "Request Changes" buttons

**Actions**:
1. Review the plan in browser
2. If plan is fine, click **Approve** → AI continues implementation
3. If changes are needed, select text to modify, click **Delete**, **Replace**, or **Comment** → click **Request Changes**

**What You Should See**: After clicking, browser will automatically close and Claude Code will receive your decision and continue execution.

### Step 5: First Code Review

**Run in project directory**:

```bash
/plannotator-review
```

**What You Should See**:
1. Browser opens code review page
2. Shows Git diff (default is uncommitted changes)
3. Left side is file tree, right side is diff viewer
4. Click line numbers to select code range and add annotations

**Actions**:
1. Browse code changes in diff viewer
2. Click line numbers to select code to review
3. Add annotations in right panel (comment/suggestion/concern)
4. Click **Send Feedback** to send to agent, or click **LGTM** to approve

**What You Should See**: After clicking Send Feedback, browser will close and formatted feedback content will be output in terminal, agent will process it automatically.

## Checkpoint ✅

After completing the above steps, you should be able to:

- [ ] Install script shows "plannotator vX.X.X installed to ..."
- [ ] Trigger plan review in Claude Code, browser automatically opens UI
- [ ] Select plan text in UI and add annotations
- [ ] Click Approve or Request Changes, see browser close
- [ ] Run `/plannotator-review`, see code review interface
- [ ] Add line-level annotations in code review, click Send Feedback

**If any step fails**, see:
- [Claude Code Installation Guide](../installation-claude-code/)
- [OpenCode Installation Guide](../installation-opencode/)
- [Common Problems](../../faq/common-problems/)

## Common Pitfalls

**Common Error 1**: After installation, running `plannotator` shows "command not found"

**Cause**: PATH environment variable not updated, or need to restart terminal.

**Solution**:
- macOS/Linux: Run `source ~/.zshrc` or `source ~/.bashrc`, or restart terminal
- Windows: Restart PowerShell or CMD

**Common Error 2**: After installing Claude Code plugin, plan review doesn't trigger

**Cause**: Didn't restart Claude Code, hooks not生效.

**Solution**: Fully quit Claude Code (not just closing window), then reopen.

**Common Error 3**: Browser doesn't automatically open

**Cause**: Might be remote mode (like devcontainer, SSH), or port is occupied.

**Solution**:
- Check if `PLANNOTATOR_REMOTE=1` environment variable is set
- Check URL output in terminal and manually open in browser
- See [Remote/Devcontainer Mode](../../advanced/remote-mode/) for details

**Common Error 4**: Code review shows "No changes"

**Cause**: No uncommitted git changes currently.

**Solution**:
- Run `git status` first to confirm there are changes
- Or run `git add` to stage some files
- Or switch to other diff types (like last commit)

## Summary

Plannotator is a locally running review tool that improves plan review and code review efficiency through visual UI:

**Core Features**:
- **Plan Review**: Visually review AI-generated plans with precise annotations
- **Code Review**: Visually review Git diffs with line-level comments
- **URL Sharing**: Share review content without backend
- **Third-party Integration**: Automatically save approved plans to Obsidian/Bear

**Core Advantages**:
- Local execution, data security
- Visual UI, improved efficiency
- Precise feedback, reduced communication costs
- Team collaboration, no account system needed

## Next Up

> In the next lesson, we'll learn **[Claude Code Plugin Installation](../installation-claude-code/)**.
>
> You'll learn:
> - Detailed Claude Code plugin installation steps
> - Manual hook configuration methods
> - How to verify installation success
> - Common installation problem solutions

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature              | File Path                                                                                              | Line Number |
|--- | --- | ---|
| CLI entry (plan review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L1-L50)         | 1-50        |
| CLI entry (code review) | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L46-L84)         | 46-84       |
| Plan review server     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L1-L200)            | 1-200       |
| Code review server     | [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts#L1-L150)            | 1-150       |
| Git tools         | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L1-L100)                | 1-100       |
| Plan review UI       | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200)          | 1-200       |
| Code review UI       | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L1-L200) | 1-200       |

**Key Constants**:
- `MAX_RETRIES = 5`: Port retry count (`packages/server/index.ts:80`)
- `RETRY_DELAY_MS = 500`: Port retry delay (`packages/server/index.ts:80`)

**Key Functions**:
- `startPlannotatorServer()`: Start plan review server (`packages/server/index.ts`)
- `startReviewServer()`: Start code review server (`packages/server/review.ts`)
- `runGitDiff()`: Run git diff command (`packages/server/git.ts`)

**Environment Variables**:
- `PLANNOTATOR_REMOTE`: Remote mode flag (`apps/hook/server/index.ts:17`)
- `PLANNOTATOR_PORT`: Fixed port (`apps/hook/server/index.ts:18`)
- `PLANNOTATOR_BROWSER`: Custom browser (`apps/hook/README.md:79`)
- `PLANNOTATOR_SHARE`: URL sharing toggle (`apps/hook/server/index.ts:44`)

</details>
