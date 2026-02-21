---
title: "OpenCode Platform Complete Guide: Plugin Installation and Skill Priority System | Superpowers Tutorial"
sidebarTitle: "Using in OpenCode"
subtitle: "OpenCode Platform Integration Guide"
description: "Learn how to install and configure Superpowers plugin in OpenCode, master the three-tier skill priority system (project, personal, Superpowers), deeply understand system prompt transformation mechanism and tool mapping rules, quickly grasp AI coding best practices and improve development efficiency."
tags:
  - "OpenCode"
  - "Plugin Installation"
  - "Skill Priority"
  - "System Prompt Transformation"
prerequisite:
  - "start-quick-start"
order: 70
---

# OpenCode Platform Integration Guide

## What You'll Learn

- Install Superpowers plugin in OpenCode
- Understand the three-tier skill priority system (Project > Personal > Superpowers)
- Use OpenCode native skill tool to discover and load skills
- Verify system prompt transformation works correctly
- Manually install and configure on different operating systems

## Your Current Struggles

OpenCode is a powerful AI coding tool, but lacks systematic workflow guidance:
- You want to follow TDD principles, but AI always jumps directly to writing code
- Debug randomly when encountering bugs, without finding the root cause
- Don't know how to pass context across multiple sessions

Superpowers injects complete workflows and best practices into OpenCode through plugin form.

## When to Use This Approach

- **First time using Superpowers**: Must install plugin first
- **Verify skill loading**: Check if skill priority is correct
- **Custom skill development**: Understand how project skills override Superpowers skills
- **Debug plugin issues**: Check if system prompt transformation works

## Core Approach

Superpowers works in OpenCode through a three-layer mechanism:

| Layer | Component | Role |
| --- | --- | --- |
| **Plugin Layer** | superpowers.js | System prompt transformation hook (transform hook) |
| **Skill Layer** | Symbolic link directory | Skill discovery and loading |
| **Mapping Layer** | Tool mapping directives | Adapt Claude Code skills to OpenCode |

**How System Prompt Transformation Works**:

```mermaid
graph LR
    A[User sends message] --> B[experimental.chat.system.transform hook triggers]
    B --> C[Read using-superpowers skill]
    C --> D[Generate bootstrap content]
    D --> E[Inject into system prompt]
    E --> F[AI automatically gains skill system knowledge]
```

**Skill Priority System**:

OpenCode discovers skills in the following order:

```
1. Project skills (.opencode/skills/)
    ↓ Highest priority
2. Personal skills (~/.config/opencode/skills/)
    ↓ Medium priority
3. Superpowers skills (~/.config/opencode/skills/superpowers/)
    ↓ Base priority
```

This means you can create **project-specific skills** to override skills provided by Superpowers.

## Follow Along: Quick Installation

### Step 1: Let AI Help You Install

**Why**
OpenCode supports installing tasks through natural language description, which is the fastest method.

**Operation**

Run in OpenCode:

```
Clone https://github.com/obra/superpowers to ~/.config/opencode/superpowers, then create directory ~/.config/opencode/plugins, then symlink ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js to ~/.config/opencode/plugins/superpowers.js, then symlink ~/.config/opencode/superpowers/skills to ~/.config/opencode/skills/superpowers, then restart opencode.
```

**You should see**:

```bash
✓ Repository cloned to ~/.config/opencode/superpowers
✓ Directories created
✓ Symlinks created
```

### Step 2: Verify Installation

**Why**
Confirm symbolic links are created correctly, OpenCode can load plugin and skills.

**Operation**

```bash
# Check plugin symbolic link
ls -l ~/.config/opencode/plugins/superpowers.js

# Check skill symbolic link
ls -l ~/.config/opencode/skills/superpowers
```

**You should see**:

```bash
# Plugin symbolic link
~/.config/opencode/plugins/superpowers.js -> ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js

# Skill symbolic link
~/.config/opencode/skills/superpowers -> ~/.config/opencode/superpowers/skills
```

If you see the `->` symbol, the symbolic link was created successfully.

## Follow Along: Manual Installation (macOS/Linux)

### Prerequisites

- [x] OpenCode.ai installed
- [x] Git installed

### Step 1: Clone or Update Repository

**Why**
Get Superpowers latest code.

**Operation**

```bash
# Update if already exists, otherwise clone
if [ -d ~/.config/opencode/superpowers ]; then
  cd ~/.config/opencode/superpowers && git pull
else
  git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
fi
```

**You should see**:

```bash
Cloning into '~/.config/opencode/superpowers'...
remote: Enumerating objects: 1234, done.
...
```

### Step 2: Create Directories

**Why**
OpenCode needs specific directory structure to discover plugins and skills.

**Operation**

```bash
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills
```

### Step 3: Clean Up Old Links

**Why**
Avoid symbolic link conflicts causing installation failure.

**Operation**

```bash
# Delete old plugin link (if exists)
rm -f ~/.config/opencode/plugins/superpowers.js

# Delete old skill link (if exists)
rm -rf ~/.config/opencode/skills/superpowers
```

### Step 4: Create Symbolic Links

**Why**
Link Superpowers plugin and skill directories to OpenCode discovery paths.

**Operation**

```bash
# Create plugin symbolic link
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js \
   ~/.config/opencode/plugins/superpowers.js

# Create skill symbolic link
ln -s ~/.config/opencode/superpowers/skills \
   ~/.config/opencode/skills/superpowers
```

**You should see**: No output (on success), if error indicates path issue.

### Step 5: Restart OpenCode

**Why**
OpenCode needs to restart to load new plugin.

**Operation**

```bash
# Close and restart OpenCode
```

## Follow Along: Manual Installation (Windows)

### Prerequisites

- [x] OpenCode.ai installed
- [x] Git installed
- [x] Developer mode enabled or administrator privileges

**Enable Developer Mode**:

| Windows Version | Path |
| --- | --- |
| Windows 10 | Settings → Update & Security → For developers |
| Windows 11 | Settings → System → For developers |

::: code-group

```powershell [PowerShell]
# Step 1: Clone repository
git clone https://github.com/obra/superpowers.git "$env:USERPROFILE\.config\opencode\superpowers"

# Step 2: Create directories
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\plugins"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills"

# Step 3: Clean up old links
Remove-Item "$env:USERPROFILE\.config\opencode\plugins\superpowers.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.config\opencode\skills\superpowers" -Force -ErrorAction SilentlyContinue

# Step 4: Create plugin symbolic link (requires developer mode or administrator)
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.config\opencode\plugins\superpowers.js" -Target "$env:USERPROFILE\.config\opencode\superpowers\.opencode\plugins\superpowers.js"

# Step 5: Create skill directory junction (no special permissions required)
New-Item -ItemType Junction -Path "$env:USERPROFILE\.config\opencode\skills\superpowers" -Target "$env:USERPROFILE\.config\opencode\superpowers\skills"

# Step 6: Restart OpenCode
```

```cmd [Command Prompt]
:: Step 1: Clone repository
git clone https://github.com/obra/superpowers.git "%USERPROFILE%\.config\opencode\superpowers"

:: Step 2: Create directories
mkdir "%USERPROFILE%\.config\opencode\plugins" 2>nul
mkdir "%USERPROFILE%\.config\opencode\skills" 2>nul

:: Step 3: Clean up old links
del "%USERPROFILE%\.config\opencode\plugins\superpowers.js" 2>nul
rmdir "%USERPROFILE%\.config\opencode\skills\superpowers" 2>nul

:: Step 4: Create plugin symbolic link (requires developer mode or administrator)
mklink "%USERPROFILE%\.config\opencode\plugins\superpowers.js" "%USERPROFILE%\.config\opencode\superpowers\.opencode\plugins\superpowers.js"

:: Step 5: Create skill directory junction (no special permissions required)
mklink /J "%USERPROFILE%\.config\opencode\skills\superpowers" "%USERPROFILE%\.config\opencode\superpowers\skills"

:: Step 6: Restart OpenCode
```

```bash [Git Bash]
::: warning Attention
Git Bash's `ln` command copies files instead of creating symbolic links. Must use `cmd //c mklink`.

# Step 1: Clone repository
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers

# Step 2: Create directories
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills

# Step 3: Clean up old links
rm -f ~/.config/opencode/plugins/superpowers.js 2>/dev/null
rm -rf ~/.config/opencode/skills/superpowers 2>/dev/null

# Step 4: Create plugin symbolic link (requires developer mode or administrator)
cmd //c "mklink \"$(cygpath -w ~/.config/opencode/plugins/superpowers.js)\" \"$(cygpath -w ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js)\""

# Step 5: Create skill directory junction (no special permissions required)
cmd //c "mklink /J \"$(cygpath -w ~/.config/opencode/skills/superpowers)\" \"$(cygpath -w ~/.config/opencode/superpowers/skills)\""

# Step 6: Restart OpenCode
```

:::

### Verify Windows Installation

**PowerShell verification**:

```powershell
# View symbolic links
Get-ChildItem "$env:USERPROFILE\.config\opencode\plugins" | Where-Object { $_.LinkType }
Get-ChildItem "$env:USERPROFILE\.config\opencode\skills" | Where-Object { $_.LinkType }
```

**Command Prompt verification**:

```cmd
dir /AL "%USERPROFILE%\.config\opencode\plugins"
dir /AL "%USERPROFILE%\.config\opencode\skills"
```

**You should see**: Output contains `<SYMLINK>` or `<JUNCTION>` markers.

## Checkpoint ✅

| Check Item | Expected Result | Command |
| --- | --- | --- |
| Plugin link exists | Symbolic link points to superpowers.js | `ls -l ~/.config/opencode/plugins/` |
| Skill link exists | Symbolic link points to skills/ | `ls -l ~/.config/opencode/skills/` |
| Skills discoverable | Can list superpowers skills | OpenCode skill tool |
| System prompt injection | New session shows skill context | Test conversation |

## Common Pitfalls

### Common Error 1: Windows Insufficient Permissions

**Symptom**:

```
You do not have sufficient privilege to perform this operation.
```

**Cause**: Creating symbolic links requires developer mode or administrator privileges.

**Solution**:

1. Enable developer mode (Settings → For developers)
2. Or run terminal as administrator

### Common Error 2: File Already Exists

**Symptom**:

```
Cannot create a file when that file already exists.
```

**Cause**: Old links not cleaned up.

**Solution**:

Run cleanup command first (Step 3), then retry creation.

### Common Error 3: Git Bash Copies Instead of Creating Symbolic Links

**Symptom**:

```bash
ls -l ~/.config/opencode/plugins/
# Shows regular file, not symbolic link
```

**Cause**: Git Bash's `ln` command copies files by default on Windows.

**Solution**:

Use `cmd //c mklink` instead of `ln` (see Git Bash installation steps).

### Common Error 4: Skills Not Discovered

**Symptom**: OpenCode cannot list Superpowers skills.

**Cause**: Skill symbolic link incorrect or directory structure has issues.

**Solution**:

```bash
# Check symbolic link
ls -l ~/.config/opencode/skills/superpowers

# Should point to:
# ~/.config/opencode/superpowers/skills

# Check if skill files exist
ls ~/.config/opencode/superpowers/skills/brainstorming/SKILL.md
```

## Deep Dive: Skill Discovery and Priority

### Skill Discovery Mechanism

OpenCode's **native skill tool** automatically discovers skills from three locations:

```
.opencode/skills/           ← Project skills (highest priority)
    ↓
~/.config/opencode/skills/  ← Personal skills (medium priority)
    ↓
~/.config/opencode/skills/superpowers/  ← Superpowers skills (base priority)
```

**Role of Symbolic Links**:

```bash
# Superpowers skills directory
~/.config/opencode/superpowers/skills/
    ↓ via symbolic link
~/.config/opencode/skills/superpowers/
    ↓ OpenCode native skill tool discovers
```

### Skill Priority in Practice

**Scenario 1: Override TDD Workflow**

If you want to modify TDD workflow in a specific project, create project skill:

```bash
mkdir -p .opencode/skills/my-tdd
```

Create `.opencode/skills/my-tdd/SKILL.md`:

```markdown
---
name: my-tdd
description: Use when doing TDD in this project
---

# My Custom TDD Workflow

[Your custom TDD workflow...]
```

OpenCode will prioritize your `my-tdd` skill over Superpowers' `test-driven-development`.

**Scenario 2: Add Project-Specific Skills**

```bash
mkdir -p .opencode/skills/project-debugging
```

Create `.opencode/skills/project-debugging/SKILL.md`:

```markdown
---
name: project-debugging
description: Use when debugging issues in this specific project
---

# Project-Specific Debugging

[Project-specific debugging steps...]
```

### Using OpenCode Native Skill Tool

**List all skills**:

```
use skill tool to list all skills
```

**Load specific skill**:

```
use skill tool to load superpowers/brainstorming
```

**AI should see**:

```
✓ Loaded skill: superpowers/brainstorming
```

## Deep Dive: System Prompt Transformation

### How Transform Hook Works

Superpowers plugin uses `experimental.chat.system.transform` hook:

**Plugin file location**:

```bash
~/.config/opencode/superpowers/.opencode/plugins/superpowers.js
```

**Hook trigger timing**:

Each time user sends a message, the hook will:
1. Read `using-superpowers` skill content
2. Generate bootstrap message
3. Inject into system prompt

**Bootstrap content structure**:

```
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use skill tool to load "using-superpowers" again - that would be redundant.**

[using-superpowers skill content]

**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- `TodoWrite` → `update_plan`
- `Task` tool with subagents → Use OpenCode's subagent system (@mention)
- `Skill` tool → OpenCode's native `skill` tool
- `Read`, `Write`, `Edit`, `Bash` → Your native tools

**Skills location:**
Superpowers skills are in `~/.config/opencode/skills/superpowers/`
Use OpenCode's native `skill` tool to list and load skills.
</EXTREMELY_IMPORTANT>
```

### Tool Mapping Rules

Superpowers skills were originally written for Claude Code, need adaptation to OpenCode:

| Claude Code Tool | OpenCode Equivalent | Description |
| --- | --- | --- |
| `TodoWrite` | `update_plan` | Update plan tasks |
| `Task` (subagents) | `@mention` | OpenCode's subagent system |
| `Skill` | Native `skill` | OpenCode native skill tool |
| `Read`/`Write`/`Edit`/`Bash` | Native tools | OpenCode native file/terminal tools |

**Why important**:

Skill files may reference these tools, plugin automatically provides mapping directives, ensuring AI knows how to use OpenCode equivalent tools.

## Deep Dive: Plugin Architecture

### Plugin File Structure

```
~/.config/opencode/superpowers/
├── .opencode/
│   └── plugins/
│       └── superpowers.js    ← Plugin main file
└── skills/                  ← Skills directory
    ├── using-superpowers/
    ├── brainstorming/
    ├── writing-plans/
    └── ...
```

### Plugin Core Functions

**superpowers.js plugin provides**:

1. **Frontmatter parsing**: Extract YAML metadata from skill files
2. **Bootstrap generation**: Read `using-superpowers` skill and generate context
3. **Transform Hook**: Inject bootstrap into system prompt
4. **Tool mapping directives**: Adapt Claude Code skills to OpenCode

**Key code snippet** (simplified):

```javascript
export const SuperpowersPlugin = async ({ client, directory }) => {
  // Read using-superpowers skill
  const skillPath = path.join(superpowersSkillsDir, 'using-superpowers', 'SKILL.md');
  const content = fs.readFileSync(skillPath, 'utf8');

  // Generate bootstrap content
  const bootstrap = `
    <EXTREMELY_IMPORTANT>
    You have superpowers.
    ${content}
    ${toolMapping}
    </EXTREMELY_IMPORTANT>
  `;

  // Register transform hook
  return {
    'experimental.chat.system.transform': async (_input, output) => {
      (output.system ||= []).push(bootstrap);
    }
  };
};
```

## Deep Dive: Personal Skills and Project Skills

### Creating Personal Skills

**Location**: `~/.config/opencode/skills/`

**Purpose**: Personal skills applicable to all projects.

**Example**:

```bash
mkdir -p ~/.config/opencode/skills/my-skills
```

Create `~/.config/opencode/skills/my-skills/SKILL.md`:

```markdown
---
name: my-skills
description: Use when [condition] - [function description]
---

# My Personal Skill

[Skill content...]
```

### Creating Project Skills

**Location**: `.opencode/skills/`

**Purpose**: Skills applicable only to current project.

**Example**:

```bash
# In your OpenCode project
mkdir -p .opencode/skills/project-specific
```

Create `.opencode/skills/project-specific/SKILL.md`:

```markdown
---
name: project-specific
description: Use when working on [project name]
---

# Project-Specific Workflow

[Project-specific workflow...]
```

### Priority Practical Test

**Test method**:

1. Create project skill with same name
2. Use OpenCode's skill tool to list skills
3. Observe which skill is loaded

**Expected result**:

OpenCode should load project skill (higher priority), not Superpowers skill.

## Update Superpowers

**Why update**: Superpowers continuously updates, fixes bugs, adds new skills.

**Operation**:

```bash
cd ~/.config/opencode/superpowers
git pull
```

**Restart OpenCode**: Make updates take effect.

**Verify update**:

```bash
# View latest version
cd ~/.config/opencode/superpowers
git log -1
```

## Chapter Summary

OpenCode platform provides complete integration of Superpowers through plugin mechanism:

- **Diverse installation methods**: AI-assisted installation, manual installation (supports multiple platforms)
- **Clear skill priority**: Project > Personal > Superpowers
- **Automatic system prompt injection**: Transform hook ensures skill context in every conversation
- **Intelligent tool mapping**: Automatically adapt Claude Code skills to OpenCode
- **High extensibility**: Support creating personal skills and project skills

After installation, OpenCode automatically injects Superpowers knowledge in every conversation, ensuring AI always follows best practices.

## Next Lesson Preview

> In the next lesson, we'll learn **[Codex Platform Integration](../codex/)**.
>
> You'll learn:
> - How to use Codex CLI tool
> - Skill management and bootstrap commands
> - Node.js script integration

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-01

| Feature | File Path | Line Numbers |
| --- | --- | --- |
| Plugin main file | [`.opencode/plugins/superpowers.js`](https://github.com/obra/superpowers/blob/main/.opencode/plugins/superpowers.js) | Full file |
| Installation documentation | [`docs/README.opencode.md`](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md) | 1-331 |
| Entry skill | [`skills/using-superpowers/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md) | 1-88 |

**Key Configuration**:

- **Hook type**: `experimental.chat.system.transform`
- **Skills directory**: `~/.config/opencode/skills/superpowers/`
- **Plugin directory**: `~/.config/opencode/plugins/`
- **Bootstrap skill**: `using-superpowers`

**Key Installation Paths**:

| Operating System | Plugin Path | Skill Path |
| --- | --- | --- |
| macOS/Linux | `~/.config/opencode/plugins/superpowers.js` | `~/.config/opencode/skills/superpowers` |
| Windows | `%USERPROFILE%\.config\opencode\plugins\superpowers.js` | `%USERPROFILE%\.config\opencode\skills\superpowers` |

**Key Commands**:

```bash
# Quick installation (AI-assisted)
Clone https://github.com/obra/superpowers to ~/.config/opencode/superpowers...

# Manual installation (macOS/Linux)
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js \
   ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/skills \
   ~/.config/opencode/skills/superpowers

# Update
cd ~/.config/opencode/superpowers && git pull

# Verify
ls -l ~/.config/opencode/plugins/superpowers.js
ls -l ~/.config/opencode/skills/superpowers
```

**Skill Priority**:

1. Project skills: `.opencode/skills/` (highest)
2. Personal skills: `~/.config/opencode/skills/` (medium)
3. Superpowers skills: `~/.config/opencode/skills/superpowers/` (base)

**Tool Mapping**:

- `TodoWrite` → `update_plan`
- `Task` (subagents) → `@mention`
- `Skill` → Native `skill` tool
- File/terminal tools → Native tools

</details>
