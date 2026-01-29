---
title: "Continuous Learning: Auto-Extract Patterns | Everything Claude Code"
sidebarTitle: "Continuous Learning"
subtitle: "Continuous Learning Mechanism: Auto-Extract Reusable Patterns"
description: "Learn Everything Claude Code's continuous learning mechanism. Master /learn command to extract patterns and configure Stop hooks for automatic evaluation."
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# Continuous Learning Mechanism: Auto-Extract Reusable Patterns

## What You'll Learn

- Use the `/learn` command to manually extract reusable patterns from sessions
- Configure continuous-learning skill for automatic evaluation at session end
- Set up Stop hooks to automatically trigger pattern extraction
- Save extracted patterns as learned skills and reuse them in future sessions
- Configure extraction thresholds, session length requirements, and other parameters

## Your Current Challenges

When using Claude Code for development, do you encounter these situations:

- Solved a complex problem, but need to start from scratch when encountering similar issues
- Learned debugging techniques for a framework, but forget them after a while
- Discovered project-specific coding conventions but cannot systematically record them
- Found a workaround solution but cannot recall it when similar problems occur

These issues prevent your experience and knowledge from effectively accumulating, requiring you to start from scratch each time.

## When to Use This Approach

Use cases for the continuous learning mechanism:

- **When solving complex problems**: Debugged a bug for hours and need to remember the solution approach
- **When learning new frameworks**: Discovered framework quirks or best practices
- **During mid-project development**: Gradually discovered project-specific conventions and patterns
- **After code reviews**: Learned new security check methods or coding standards
- **When optimizing performance**: Found effective optimization techniques or tool combinations

::: tip Core Value
The continuous learning mechanism makes Claude Code smarter over time. It acts like an experienced mentor, automatically recording useful patterns as you solve problems and providing suggestions in similar future scenarios.
:::

## Core Concept

The continuous learning mechanism consists of three core components:

```
1. /learn command          → Manual extraction: Run anytime to save valuable patterns
2. Continuous Learning Skill → Auto evaluation: Triggered by Stop hook, analyzes session
3. Learned Skills          → Knowledge base: Saves patterns for future auto-loading
```

**How it works**:

- **Manual extraction**: After solving a non-trivial problem, actively use `/learn` to extract patterns
- **Auto evaluation**: At session end, the Stop hook script checks session length and prompts Claude to evaluate
- **Knowledge accumulation**: Extracted patterns are saved as learned skills in the `~/.claude/skills/learned/` directory
- **Future reuse**: Claude Code automatically loads these skills in future sessions

**Why choose Stop hook**:

- **Lightweight**: Only runs once at session end, doesn't affect interactive response speed
- **Complete context**: Can access complete session records, easier to discover valuable patterns
- **Non-blocking**: Doesn't run on every message, doesn't add latency

## 🎒 Prerequisites

Before using the continuous learning mechanism, please confirm:

- ✅ Everything Claude Code plugin installed
- ✅ Understood the `/learn` command from [Core Commands Overview](../../platforms/commands-overview/)
- ✅ Understood the Stop hook concept from [Hooks Automation](../hooks-automation/)

::: warning Prerequisites
This tutorial assumes you are familiar with basic Claude Code operations and hooks concepts. If you haven't completed installation, please read [Quick Start](../../start/quickstart/) first.
:::

## Follow Along: Complete Continuous Learning Workflow

Let's learn the entire process through a practical example. Suppose you were debugging a TypeScript type error and found the solution.

### Step 1: Use /learn to Manually Extract Patterns

**Why**
Manual extraction applies to important problems you just solved, saving immediately to avoid forgetting.

**Action**
Enter in Claude Code:

```
/learn
```

**You should see**
Claude will analyze the current session and ask if extractable patterns were found:

```markdown
I analyzed the current session and found the following extractable patterns:

1. TypeScript type error: Resolved through generic constraints
   - Problem description: Function parameter type inference incorrect
   - Solution method: Add explicit generic constraint `<T extends ...>`
   - Applicable scenarios: Complex type inference, callback functions

Extract these patterns? (yes/no/skip)
```

**Checkpoint ✅**
- Did Claude identify the problem you solved
- Is the extracted pattern description accurate
- Are the applicable scenarios reasonable

**Next**
If the pattern is correct, reply `yes`. If modifications are needed, specify the changes.

---

### Step 2: Save as Learned Skill

**Why**
After saving as a skill file, future sessions can automatically load this knowledge.

**Action**
If confirmed to extract, Claude will create a skill file:

```markdown
Saving pattern to: ~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extracted:** 2026-01-25
**Context:** Resolving complex type inference issues

## Problem
TypeScript function parameter type inference is incorrect, causing type errors.

## Solution
Add explicit generic constraint `<T extends ...>` to clarify type relationships.

## Example
```typescript
// Before
function process(data) { ... }  // Type inference fails

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- Complex type inference scenarios
- Callback function type definitions
- Generic function parameter constraints
```

**You should see**
Claude prompts that the file has been saved:

```markdown
✅ Skill saved to: ~/.claude/skills/learned/typescript-generic-constraints.md

When encountering similar type issues in the future, Claude will automatically load this skill.
```

**Checkpoint ✅**
- File successfully created
- File path is in `~/.claude/skills/learned/` directory
- Skill content is accurate

---

### Step 3: Configure Continuous Learning Skill

**Why**
After configuring automatic evaluation, Claude will automatically check for extractable patterns at the end of each session.

**Action**

Create configuration file `~/.claude/skills/continuous-learning/config.json`:

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**Configuration explanation**:

| Field | Description | Recommended value |
|--- | --- | ---|
| `min_session_length` | Minimum session length (user message count) | 10 |
| `extraction_threshold` | Extraction threshold | medium |
| `auto_approve` | Whether to auto-save (recommend false) | false |
| `learned_skills_path` | Learned skills save path | `~/.claude/skills/learned/` |
| `patterns_to_detect` | Pattern types to detect | See above |
| `ignore_patterns` | Pattern types to ignore | See above |

**You should see**
Configuration file created at `~/.claude/skills/continuous-learning/config.json`.

**Checkpoint ✅**
- Configuration file format correct (JSON valid)
- `learned_skills_path` contains `~` symbol (will be replaced with actual home directory)
- `auto_approve` set to `false` (recommended)

---

### Step 4: Set Up Stop Hook for Auto-Trigger

**Why**
Stop hook automatically triggers at the end of every session, no need to manually run `/learn`.

**Action**

Edit `~/.claude/settings.json`, add Stop hook:

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**Script path explanation**:

| Platform | Script Path |
|--- | ---|
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\YourName\.claude\skills\continuous-learning\evaluate-session.cmd` |

**You should see**
Stop hook added to `~/.claude/settings.json`.

**Checkpoint ✅**
- Hooks structure correct (Stop → matcher → hooks)
- Command path points to correct script
- Matcher set to `"*"` (matches all sessions)

---

### Step 5: Verify Stop Hook Works Correctly

**Why**
Only after verifying the configuration is correct can you confidently use the auto-extraction feature.

**Action**
1. Open a new Claude Code session
2. Do some development work (send at least 10 messages)
3. Close the session

**You should see**
Stop hook script outputs logs:

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/yourname/.claude/skills/learned/
```

**Checkpoint ✅**
- Log shows session message count ≥ 10
- Log output learned skills path correct
- No error messages

---

### Step 6: Future Sessions Auto-Load Learned Skills

**Why**
Saved skills automatically load in similar future scenarios to provide context.

**Action**
When encountering similar problems in future sessions, Claude will automatically load relevant learned skills.

**You should see**
Claude prompts that relevant skills have been loaded:

```markdown
I noticed this scenario is similar to the type inference problem solved earlier.

Based on saved skill (typescript-generic-constraints), recommend using explicit generic constraints:

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**Checkpoint ✅**
- Claude referenced saved skill
- Suggested solution is accurate
- Improved problem-solving efficiency

## Checkpoint ✅: Verify Configuration

After completing the above steps, run the following checks to confirm everything is working:

1. **Check configuration file exists**:
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **Check Stop hook configuration**:
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **Check learned skills directory**:
```bash
ls -la ~/.claude/skills/learned/
```

4. **Manually test Stop hook**:
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## Common Pitfalls

### Pitfall 1: Session Too Short Causes No Extraction

**Problem**:
Stop hook script checks session length and skips when below `min_session_length`.

**Cause**:
Default `min_session_length: 10`, short sessions don't trigger evaluation.

**Solution**:
```json
{
  "min_session_length": 5  // Lower threshold
}
```

::: warning Caution
Don't set too low (like < 5), otherwise it will extract many meaningless patterns (like simple syntax error fixes).
:::

---

### Pitfall 2: `auto_approve: true` Causes Auto-Saving of Junk Patterns

**Problem**:
In auto-save mode, Claude may save low-quality patterns.

**Cause**:
`auto_approve: true` skips the manual confirmation step.

**Solution**:
```json
{
  "auto_approve": false  // Always keep false
}
```

**Recommended practice**:
Always manually confirm extracted patterns to ensure quality.

---

### Pitfall 3: Learned Skills Directory Doesn't Exist Causes Save Failure

**Problem**:
Stop hook runs successfully but skill file not created.

**Cause**:
`learned_skills_path` points to a non-existent directory.

**Solution**:
```bash
# Manually create directory
mkdir -p ~/.claude/skills/learned/

# Or use absolute path in config
{
  "learned_skills_path": "/absolute/path/to/learned/"
}
```

---

### Pitfall 4: Stop Hook Script Path Incorrect (Windows)

**Problem**:
Stop hook doesn't trigger on Windows.

**Cause**:
Configuration file uses Unix-style paths (`~/.claude/...`), but Windows actual path is different.

**Solution**:
```json
{
  "command": "C:\\Users\\YourName\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**Recommended practice**:
Use Node.js scripts (cross-platform) instead of Shell scripts.

---

### Pitfall 5: Extracted Patterns Too Generic, Poor Reusability

**Problem**:
Extracted pattern description too generic (like "fix type error"), lacking specific context.

**Cause**:
Insufficient context information included during extraction (error message, code examples, applicable scenarios).

**Solution**:
Provide more detailed context when using `/learn`:

```
/learn I solved a TypeScript type error: Property 'xxx' does not exist on type 'yyy'. Temporarily used type assertion as to fix, but better method is using generic constraints.
```

**Checklist**:
- [ ] Problem description specific (includes error message)
- [ ] Solution method detailed (includes code example)
- [ ] Applicable scenarios clear (when to use this pattern)
- [ ] Naming specific (like "typescript-generic-constraints" not "type-fix")

---

### Pitfall 6: Too Many Learned Skills, Hard to Manage

**Problem**:
Over time, the `learned/` directory accumulates many skills, hard to find and manage.

**Cause**:
No regular cleanup of low-quality or outdated skills.

**Solution**:

1. **Regular review**: Check learned skills monthly
```bash
# List all skills
ls -la ~/.claude/skills/learned/

# View skill content
cat ~/.claude/skills/learned/pattern-name.md
```

2. **Mark low-quality skills**: Add `deprecated-` prefix to filename
```bash
mv ~/.claude/skills/learned/old-pattern.md \
   ~/.claude/skills/learned/deprecated-old-pattern.md
```

3. **Organize by category**: Use subdirectories for classification
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**Recommended practice**:
Clean up quarterly to keep learned skills concise and effective.

---

## Summary

The continuous learning mechanism works through three core components:

1. **`/learn` command**: Manually extract reusable patterns from sessions
2. **Continuous Learning Skill**: Configure auto-evaluation parameters (session length, extraction threshold)
3. **Stop Hook**: Automatically trigger evaluation at session end

**Key Points**:

- ✅ Manual extraction applies to important problems just solved
- ✅ Auto-evaluation triggers at session end via Stop hook
- ✅ Extracted patterns saved as learned skills in `~/.claude/skills/learned/` directory
- ✅ Configure `min_session_length` to control minimum session length (recommend 10)
- ✅ Always keep `auto_approve: false`, manually confirm extraction quality
- ✅ Regularly clean up low-quality or outdated learned skills

**Best Practices**:

- Immediately use `/learn` to extract patterns after solving non-trivial problems
- Provide detailed context (problem description, solution, code examples, applicable scenarios)
- Use specific skill naming (like "typescript-generic-constraints" not "type-fix")
- Regularly review and clean up learned skills to keep knowledge base concise

## Coming Up Next

> In the next lesson, we'll learn **[Token Optimization Strategy](../token-optimization/)**.
>
> You'll learn:
> - How to optimize Token usage to maximize context window efficiency
> - Configuration and usage of strategic-compact skill
> - Automation of PreCompact and PostToolUse hooks
> - Choosing the right model (opus vs sonnet) to balance cost and quality

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
|--- | --- | ---|
| /learn command definition | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md) | 1-71 |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81 |
| Stop Hook script | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| Checkpoint command | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75 |

**Key Constants**:
- `min_session_length = 10`: Default minimum session length (user message count)
- `CLAUDE_TRANSCRIPT_PATH`: Environment variable, session record path
- `learned_skills_path`: Learned skills save path, default `~/.claude/skills/learned/`

**Key Functions**:
- `main()`: evaluate-session.js main function, reads config, checks session length, outputs logs
- `getLearnedSkillsDir()`: Gets learned skills directory path (handles `~` expansion)
- `countInFile()`: Counts occurrence of matched patterns in file

**Configuration Items**:
| Config Item | Type | Default | Description |
|--- | --- | --- | ---|
| `min_session_length` | number | 10 | Minimum session length (user message count) |
| `extraction_threshold` | string | "medium" | Extraction threshold |
| `auto_approve` | boolean | false | Whether to auto-save (recommend false) |
| `learned_skills_path` | string | "~/.claude/skills/learned/" | Learned skills save path |
| `patterns_to_detect` | array | See source code | Pattern types to detect |
| `ignore_patterns` | array | See source code | Pattern types to ignore |

**Pattern Types**:
- `error_resolution`: Error resolution patterns
- `user_corrections`: User correction patterns
- `workarounds`: Workaround solutions
- `debugging_techniques`: Debugging techniques
- `project_specific`: Project-specific patterns

**Hook Types**:
- Stop: Runs at session end (evaluate-session.js)

</details>
