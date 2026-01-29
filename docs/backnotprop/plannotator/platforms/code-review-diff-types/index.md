---
title: "Diff Views: Switch Types | plannotator"
sidebarTitle: "Diff Views"
subtitle: "Switching Diff Views"
description: "Learn how to switch diff types in Plannotator code review. Switch between uncommitted, staged, last commit, and branch views from the dropdown menu."
tags:
  - "code-review"
  - "git"
  - "diff"
  - "tutorial"
prerequisite:
  - "code-review-basics"
order: 6
---

# Switching Diff Views

## What You'll Learn

During code review, you'll be able to:
- Use the dropdown menu to quickly switch between 5 diff views
- Understand the code change scope displayed by each view
- Choose the appropriate diff type based on review needs
- Avoid missing important changes due to selecting the wrong view

## Your Current Struggles

**Reviewing only working directory, missing staged files**:

You run the `/plannotator-review` command, see some code changes, and add a few comments. But after committing, you discover that the review missed files that were already `git add`ed to the staging area—these files never appeared in the diff.

**Want to see overall differences between current branch and main branch**:

You've been developing on a feature branch for a few weeks and want to see all the changes made so far, but the default "Uncommitted changes" view only shows modifications from the past few days.

**Want to compare differences between two specific commits**:

You want to confirm whether a bug fix is correct and need to compare the code before and after the fix, but you don't know how to make Plannotator display the diff of historical commits.

## When to Use This Technique

- **Comprehensive review**: Review both working directory and staging area changes simultaneously
- **Before branch merge**: Check all changes in current branch relative to main/master
- **Rollback review**: Confirm what files were modified in the last commit
- **Multi-person collaboration**: Check code staged but not yet committed by colleagues

## Core Concepts

Git diff has many variants, each displaying different code scopes. Plannotator consolidates these variants into a single dropdown menu, so you don't need to remember complex git commands.

::: info Git Diff Types Quick Reference

| diff type | scope | typical use case |
|--- | --- | ---|
| Uncommitted changes | working directory + staging area | Review all changes in current development |
| Staged changes | staging area only | Review content before committing |
| Unstaged changes | working directory only | Review changes not yet `git add`ed |
| Last commit | most recent commit | Rollback or review just-made commit |
| vs main | current branch vs default branch | Comprehensive check before branch merge |

:::

Dropdown menu options dynamically change based on your Git status:
- If you're not on the default branch, the "vs main" option appears
- If there are no staged files, the Staged view displays "No staged changes"

## Follow Along

### Step 1: Start Code Review

**Why**

You need to first open Plannotator's code review interface.

**Action**

Run in terminal:

```bash
/plannotator-review
```

**You should see**

Browser opens code review page. Above the file tree on the left, there's a dropdown menu showing the current diff type (usually "Uncommitted changes").

### Step 2: Switch to Staged View

**Why**

View files that have been `git add`ed but not yet committed.

**Action**

1. Click the dropdown menu above the file tree on the left
2. Select "Staged changes"

**You should see**

- If there are staged files, the file tree displays these files
- If there are no staged files, the main area displays: "No staged changes. Stage some files with git add."

### Step 3: Switch to Last Commit View

**Why**

Review the code just committed to confirm there are no issues.

**Action**

1. Open the dropdown menu again
2. Select "Last commit"

**You should see**

- Displays all files modified in the most recent commit
- Diff content shows differences between `HEAD~1..HEAD`

### Step 4: Switch to vs main View (if available)

**Why**

View all changes in the current branch relative to the default branch.

**Action**

1. Check if the dropdown menu has "vs main" or "vs master" option
2. If present, select it

**You should see**

- File tree displays all files with differences between current branch and default branch
- Diff content shows complete changes of `main..HEAD`

::: tip Check Current Branch

If you can't see the "vs main" option, it means you're on the default branch. You can check the current branch with this command:

```bash
git rev-parse --abbrev-ref HEAD
```

Switch to a feature branch and try again:

```bash
git checkout feature-branch
```

:::

## Checklist ✅

Confirm you've mastered:

- [ ] Can find and open the diff type dropdown menu
- [ ] Understand the differences between "Uncommitted", "Staged", and "Last commit"
- [ ] Can identify when the "vs main" option appears
- [ ] Know which diff type to use in which scenario

## Common Pitfalls

### Pitfall 1: Only reviewing Uncommitted, missing Staged files

**Symptom**

After committing, you discover that some staged files were missed in the review.

**Cause**

The Uncommitted view displays all changes in working directory and staging area (`git diff HEAD`), so staged files are included.

**Solution**

Before review, switch to Staged view to check once, or use Uncommitted view (which includes staging area).

### Pitfall 2: Didn't compare to main before branch merge

**Symptom**

After merging to main, you discover that unrelated modifications were introduced.

**Cause**

Only reviewed commits from the past few days, didn't compare the entire branch's differences relative to main.

**Solution**

Use "vs main" view for a comprehensive check before merging.

### Pitfall 3: Think switching views loses comments

**Symptom**

Afraid to switch diff types, worrying that previously added comments will disappear.

**Cause**

Misunderstood the switching mechanism.

**Actual Behavior**

When switching diff types, Plannotator retains previous comments—they may still be applicable, or you can manually delete irrelevant comments.

## Lesson Summary

The 5 diff types supported by Plannotator:

| type | Git command | scenario |
|--- | --- | ---|
| Uncommitted | `git diff HEAD` | Review all changes in current development |
| Staged | `git diff --staged` | Review staging area before committing |
| Unstaged | `git diff` | Review working directory modifications |
| Last commit | `git diff HEAD~1..HEAD` | Rollback or review most recent commit |
| vs main | `git diff main..HEAD` | Comprehensive check before branch merge |

Switching views doesn't lose comments—you can view the same or new comments from different perspectives.

## Next Up

> In the next lesson, we'll learn **[URL Sharing](../../advanced/url-sharing/)**.
>
> You'll learn:
> - How to compress review content into a URL to share with colleagues
> - How the recipient opens a shared review link
> - Limitations and considerations in share mode

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-24

| Feature | File Path | Line Numbers |
|--- | --- | ---|
| Diff type definitions | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L10-L15) | 10-15 |
| Git context retrieval | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L79-L96) | 79-96 |
| Run Git Diff | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L101-L147) | 101-147 |
| Diff switch handling | [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx#L300-L331) | 300-331 |
| Diff options rendering in file tree | [`packages/review-editor/components/FileTree.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/components/FileTree.tsx) | - |

**Key Types**:

- `DiffType`: `'uncommitted' | 'staged' | 'unstaged' | 'last-commit' | 'branch'`

**Key Functions**:

- `getGitContext()`: Get current branch, default branch, and available diff options
- `runGitDiff(diffType, defaultBranch)`: Execute corresponding git command based on diff type

**Key APIs**:

- `POST /api/diff/switch`: Switch diff type, return new diff data

</details>
