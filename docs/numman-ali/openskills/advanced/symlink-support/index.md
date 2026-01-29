---
title: "Symlink Support: Git-Based Skill Updates | OpenSkills"
sidebarTitle: "Symlink Support"
subtitle: "Symlink Support: Git-Based Skill Updates"
description: "Learn how to use symbolic links for git-based skill updates and local development. Master ln -s command, multi-project sharing, and broken symlink handling."
tags:
  - "Advanced"
  - "Symlink"
  - "Local Development"
  - "Skill Management"
prerequisite:
  - "platforms-install-sources"
  - "start-first-skill"
order: 3
---

# Symlink Support

## What You'll Learn

- Understand the core value and use cases of symbolic links
- Master creating symbolic links with `ln -s` command
- Learn how OpenSkills automatically handles symbolic links
- Implement git-based automatic skill updates
- Efficiently perform local skill development
- Handle broken symbolic links

::: info Prerequisites

This tutorial assumes you have completed [Skill Installation Sources](../../platforms/install-sources/) and [Install Your First Skill](../../start/first-skill/), and understand the basic skill installation process.

:::

---

## Your Current Challenges

You may have already learned how to install and update skills, but when using **symbolic links**, you face these problems:

- **Local development updates are tedious**: After modifying a skill, you need to reinstall or manually copy files
- **Multi-project skill sharing is difficult**: Same skill used across multiple projects requires synchronization each time
- **Version management is chaotic**: Skill files scattered across different projects make unified git management difficult
- **Update process is cumbersome**: Updating skills from git repository requires reinstalling the entire repository

Actually, OpenSkills supports symbolic links, allowing you to implement git-based automatic skill updates and efficient local development workflows through symlinks.

---

## When to Use This Approach

**Appropriate scenarios for symbolic links**:

| Scenario | Symlink Needed? | Example |
|--- | --- | ---|
| **Local skill development** | ✅ Yes | Developing custom skills with frequent modifications and testing |
| **Multi-project skill sharing** | ✅ Yes | Team sharing skill repository used across multiple projects |
| **Git-based automatic updates** | ✅ Yes | After skill repository updates, all projects automatically get the latest version |
| **One-time installation, permanent use** | ❌ No | Just install without modifications, use `install` directly |
| **Testing third-party skills** | ❌ No | Temporary skill testing, symbolic links not needed |

::: tip Recommended Practice

- **Use symlinks for local development**: When developing your own skills, use symlinks to avoid redundant copying
- **Use git + symlinks for team sharing**: Place team skill repository in git, share across projects via symlinks
- **Use regular installation for production**: For stable deployment, use regular `install` to avoid dependency on external directories

:::

---

## Core Concept: Link Instead of Copy

**Traditional installation method**:

```
┌─────────────────┐
│  Git repository  │
│  ~/dev/skills/  │
│  └── my-skill/  │
└────────┬────────┘
         │ Copy
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/  │
│     └── Complete copy │
└─────────────────┘
```

**Problem**: After git repository updates, skills in `.claude/skills/` are not automatically updated.

**Symbolic link method**:

```
┌─────────────────┐
│  Git repository  │
│  ~/dev/skills/  │
│  └── my-skill/  │ ← Real files here
└────────┬────────┘
         │ Symbolic link (ln -s)
         ▼
┌─────────────────┐
│ .claude/skills/ │
│  └── my-skill/  │ → Points to ~/dev/skills/my-skill
└─────────────────┘
```

**Advantage**: After git repository updates, the content pointed to by the symbolic link automatically updates without reinstallation.

::: info Important Concept

**Symbolic Link (Symlink)**: A special file type that points to another file or directory. OpenSkills automatically recognizes symbolic links when searching for skills and follows them to the actual content. Broken symbolic links (pointing to non-existent targets) are automatically skipped without causing crashes.

:::

**Source code implementation** (`src/utils/skills.ts:10-25`):

```typescript
function isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean {
  if (entry.isDirectory()) {
    return true;
  }
  if (entry.isSymbolicLink()) {
    try {
      const fullPath = join(parentDir, entry.name);
      const stats = statSync(fullPath); // statSync follows symlinks
      return stats.isDirectory();
    } catch {
      // Broken symlink or permission error
      return false;
    }
  }
  return false;
}
```

**Key points**:
- `entry.isSymbolicLink()` detects symbolic links
- `statSync()` automatically follows symbolic links to the target
- `try/catch` catches broken symbolic links, returns `false` to skip

---

## Follow Along

### Step 1: Create Skill Repository

**Why**
First create a git repository to store skills, simulating team sharing scenarios.

Open terminal and execute:

```bash
# Create skill repository directory
mkdir -p ~/dev/my-skills
cd ~/dev/my-skills

# Initialize git repository
git init

# Create a sample skill
mkdir -p my-first-skill
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
EOF

# Commit to git
git add .
git commit -m "Initial commit: Add my-first-skill"
```

**You should see**: Successfully created git repository and committed skill.

**Explanation**:
- Skills stored in `~/dev/my-skills/` directory
- Use git version management for team collaboration
- This directory is the "real location" of skills

---

### Step 2: Create Symbolic Link

**Why**
Learn how to use `ln -s` command to create symbolic links.

Continue in project directory:

```bash
# Return to project root directory
cd ~/my-project

# Create skills directory
mkdir -p .claude/skills

# Create symbolic link
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# View symbolic link
ls -la .claude/skills/
```

**You should see**:

```
.claude/skills/
└── my-first-skill -> /Users/yourname/dev/my-skills/my-first-skill
```

**Explanation**:
- `ln -s` creates symbolic link
- `->` shows the actual path being pointed to
- The symbolic link itself is just a "pointer", doesn't occupy actual space

---

### Step 3: Verify Symbolic Link Works

**Why**
Confirm OpenSkills can correctly recognize and read symbolic link skills.

Execute:

```bash
# List skills
npx openskills list

# Read skill content
npx openskills read my-first-skill
```

**You should see**:

```
  my-first-skill           (project)
    A sample skill for demonstrating symlink support

Summary: 1 project, 0 global (1 total)
```

Read skill output:

```markdown
---
name: my-first-skill
description: A sample skill for demonstrating symlink support
---

# My First Skill

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
```

**Explanation**:
- OpenSkills automatically recognizes symbolic links
- Symbolic link skills show `(project)` tag
- Read content comes from original files pointed to by symbolic link

---

### Step 4: Git-Based Automatic Updates

**Why**
Experience the biggest advantage of symbolic links: after git repository updates, skills automatically synchronize.

Modify skill in skill repository:

```bash
# Enter skill repository
cd ~/dev/my-skills

# Modify skill content
cat > my-first-skill/SKILL.md << 'EOF'
---
name: my-first-skill
description: Updated version with new features
---

# My First Skill (Updated)

When user asks for help with this skill, follow these steps:
1. Check the symlink is working
2. Print "Symlink support is working!"
3. NEW: This feature was updated via git!
EOF

# Commit update
git add .
git commit -m "Update skill: Add new feature"
```

Now verify update in project directory:

```bash
# Return to project directory
cd ~/my-project

# Read skill (no need to reinstall)
npx openskills read my-first-skill
```

**You should see**: Skill content automatically updated, includes new feature description.

**Explanation**:
- After file pointed to by symbolic link updates, OpenSkills automatically reads latest content
- No need to re-execute `openskills install`
- Achieves "update once, effective everywhere"

---

### Step 5: Multi-Project Skill Sharing

**Why**
Experience advantages of symbolic links in multi-project scenarios, avoid redundant skill installation.

Create second project:

```bash
# Create second project
mkdir ~/my-second-project
cd ~/my-second-project

# Create skills directory and symbolic link
mkdir -p .claude/skills
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Verify skill available
npx openskills list
```

**You should see**:

```
  my-first-skill           (project)
    Updated version with new features

Summary: 1 project, 0 global (1 total)
```

**Explanation**:
- Multiple projects can create symbolic links pointing to the same skill
- After skill repository updates, all projects automatically get latest version
- Avoids redundant skill installation and updates

---

### Step 6: Handle Broken Symbolic Links

**Why**
Learn how OpenSkills gracefully handles broken symbolic links.

Simulate broken symbolic link:

```bash
# Delete skill repository
rm -rf ~/dev/my-skills

# Try to list skills
npx openskills list
```

**You should see**: Broken symbolic link automatically skipped, no error.

```
Summary: 0 project, 0 global (0 total)
```

**Explanation**:
- `try/catch` in source code catches broken symbolic links
- OpenSkills skips broken links, continues searching other skills
- Won't cause `openskills` command to crash

---

## Checkpoint ✅

Complete the following checks to confirm you've mastered this lesson:

- [ ] Understand core value of symbolic links
- [ ] Master usage of `ln -s` command
- [ ] Understand difference between symbolic links and copying files
- [ ] Able to create git-based skill repository
- [ ] Able to implement automatic skill updates
- [ ] Know how to share skills across multiple projects
- [ ] Understand handling mechanism for broken symbolic links

---

## Common Pitfalls

### Common Error 1: Incorrect Symbolic Link Path

**Error scenario**: Using relative path to create symbolic link, link breaks after moving project.

```bash
# ❌ Error: Using relative path
cd ~/my-project
ln -s ../dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Link breaks after moving project
mv ~/my-project ~/new-location/project
npx openskills list  # ❌ Can't find skill
```

**Problem**:
- Relative path depends on current working directory
- Relative path becomes invalid after moving project
- Symbolic link points to wrong location

**Correct approach**:

```bash
# ✅ Correct: Use absolute path
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Still works after moving project
mv ~/my-project ~/new-location/project
npx openskills list  # ✅ Still can find skill
```

---

### Common Error 2: Confusing Hard Links and Symbolic Links

**Error scenario**: Using hard links instead of symbolic links.

```bash
# ❌ Error: Using hard link (no -s parameter)
ln ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Hard link is another entry to the file, not a pointer
# Can't achieve "update once, effective everywhere"
```

**Problem**:
- Hard link is another entry name for the file
- Modifying any hard link, other hard links also update
- But after deleting source file, hard link still exists, causing confusion
- Cannot work across file systems

**Correct approach**:

```bash
# ✅ Correct: Use symbolic link (with -s parameter)
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# Symbolic link is a pointer
# After deleting source file, symbolic link becomes invalid (OpenSkills will skip)
```

---

### Common Error 3: Symbolic Link Points to Wrong Location

**Error scenario**: Symbolic link points to parent directory of skill, not the skill directory itself.

```bash
# ❌ Error: Pointing to parent directory
ln -s ~/dev/my-skills .claude/skills/my-skills-link

# OpenSkills will look for SKILL.md under .claude/skills/my-skills-link/
# But actual SKILL.md is at ~/dev/my-skills/my-first-skill/SKILL.md
```

**Problem**:
- OpenSkills looks for `<link>/SKILL.md`
- But actual skill is at `<link>/my-first-skill/SKILL.md`
- Results in unable to find skill file

**Correct approach**:

```bash
# ✅ Correct: Point directly to skill directory
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# OpenSkills will look for .claude/skills/my-first-skill/SKILL.md
# Directory pointed to by symbolic link contains SKILL.md
```

---

### Common Error 4: Forgot to Sync AGENTS.md

**Error scenario**: Forgot to sync AGENTS.md after creating symbolic link.

```bash
# Create symbolic link
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ❌ Error: Forgot to sync AGENTS.md
# AI agent doesn't know new skill is available
```

**Problem**:
- Symbolic link created, but AGENTS.md not updated
- AI agent doesn't know about new skill
- Cannot call new skill

**Correct approach**:

```bash
# Create symbolic link
ln -s ~/dev/my-skills/my-first-skill .claude/skills/my-first-skill

# ✅ Correct: Sync AGENTS.md
npx openskills sync

# Now AI agent can see new skill
```

---

## Lesson Summary

**Key points**:

1. **Symbolic link is a pointer**: Created with `ln -s`, points to real file or directory
2. **Automatically follows links**: OpenSkills uses `statSync()` to automatically follow symbolic links
3. **Broken links automatically skipped**: `try/catch` catches exceptions, avoids crashes
4. **Git-based automatic updates**: After git repository updates, skills automatically synchronize
5. **Multi-project sharing**: Multiple projects can create symbolic links pointing to same skill

**Decision flow**:

```
[Need to use skill] → [Need frequent modifications?]
                        ↓ Yes
                [Use symbolic link (local development)]
                        ↓ No
                [Multiple projects sharing?]
                        ↓ Yes
                [Use git + symbolic link]
                        ↓ No
                [Use regular install]
```

**Memory rhyme**:

- **Local dev use symlink**: Frequent modifications, avoid redundant copying
- **Team share git link**: Update once, effective everywhere
- **Absolute path ensures stability**: Avoid relative path failure
- **Broken links auto skipped**: OpenSkills handles automatically

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Create Custom Skills](../create-skills/)**.
>
> You'll learn:
> - How to create your own skills from scratch
> - Understand SKILL.md format and YAML frontmatter
> - How to organize skill directory structure (references/, scripts/, assets/)
> - How to write high-quality skill documentation

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function            | File Path                                                                                              | Line Numbers |
|--- | --- | ---|
| Symbolic link detection    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L10-L25)      | 10-25   |
| Skill search        | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L30-L64)      | 30-64   |
| Single skill search    | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts#L69-L84)      | 69-84   |

**Key Functions**:

- `isDirectoryOrSymlinkToDirectory(entry, parentDir)`: Determine if directory entry is real directory or symbolic link pointing to directory
  - Use `entry.isSymbolicLink()` to detect symbolic links
  - Use `statSync()` to automatically follow symbolic links to target
  - `try/catch` catches broken symbolic links, returns `false`

- `findAllSkills()`: Find all installed skills
  - Traverse 4 search directories
  - Call `isDirectoryOrSymlinkToDirectory` to recognize symbolic links
  - Automatically skip broken symbolic links

**Business Rules**:

- Symbolic links are automatically recognized as skill directories
- Broken symbolic links are gracefully skipped without causing crashes
- Symbolic links and real directories have same search priority

</details>
