---
title: "Agent Troubleshooting Guide | Everything Claude Code"
sidebarTitle: "Troubleshooting Agents"
subtitle: "Agent Invocation Failures: Diagnosis and Fixes"
description: "Learn to troubleshoot agent invocation failures in Everything Claude Code. Covers diagnosing issues like agents not loading, configuration errors, and timeouts."
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Agent Invocation Failures: Troubleshooting Guide

## Your Current Problem

Having trouble with Agents? You might encounter:

- Typing `/plan` or other commands, but Agents aren't invoked
- Seeing error messages: "Agent not found"
- Agent execution times out or gets stuck
- Agent output doesn't meet expectations
- Agent doesn't follow the rules

Don't worry—these issues usually have clear solutions. This lesson helps you systematically diagnose and fix Agent-related problems.

## 🎒 Prerequisites

::: warning Before You Start
Ensure you have:
1. ✅ Completed Everything Claude Code [installation](../../start/installation/)
2. ✅ Understood [Agent concepts](../../platforms/agents-overview/) and the 9 specialized sub-agents
3. ✅ Tried invoking agents (such as `/plan`, `/tdd`, `/code-review`)
:::

---

## Common Issue 1: Agents Not Invoked At All

### Symptoms
You type `/plan` or other commands, but Agents aren't triggered—just normal chat.

### Possible Causes

#### Cause A: Incorrect Agent File Path

**Problem**: Agent files aren't in the correct location, so Claude Code can't find them.

**Solution**:

Check if Agent files are in the correct location:

```bash
# Should be in one of these locations:
~/.claude/agents/              # User-level configuration (global)
.claude/agents/                 # Project-level configuration
```

**Verification method**:

```bash
# Check user-level configuration
ls -la ~/.claude/agents/

# Check project-level configuration
ls -la .claude/agents/
```

**You should see 9 Agent files**:
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**If files don't exist**, copy from the Everything Claude Code plugin directory:

```bash
# Assuming plugin is installed in ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# Or copy from cloned repository
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### Cause B: Command Files Missing or Incorrect Path

**Problem**: Command files (such as `plan.md` corresponding to `/plan`) don't exist or have the wrong path.

**Solution**:

Check Command file locations:

```bash
# Commands should be in one of these locations:
~/.claude/commands/             # User-level configuration (global)
.claude/commands/                # Project-level configuration
```

**Verification method**:

```bash
# Check user-level configuration
ls -la ~/.claude/commands/

# Check project-level configuration
ls -la .claude/commands/
```

**You should see 14 Command files**:
- `plan.md` → invokes `planner` agent
- `tdd.md` → invokes `tdd-guide` agent
- `code-review.md` → invokes `code-reviewer` agent
- `build-fix.md` → invokes `build-error-resolver` agent
- `e2e.md` → invokes `e2e-runner` agent
- etc...

**If files don't exist**, copy Command files:

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### Cause C: Plugin Not Properly Loaded

**Problem**: Installed through plugin marketplace, but the plugin wasn't properly loaded.

**Solution**:

Check plugin configuration in `~/.claude/settings.json`:

```bash
# View plugin configuration
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**You should see**:

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**If not enabled**, add manually:

```bash
# Edit settings.json
nano ~/.claude/settings.json

# Add or modify enabledPlugins field
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**Restart Claude Code for configuration to take effect**.

---

## Common Issue 2: Agent Invocation Error "Agent not found"

### Symptoms
After typing commands, you see error messages: "Agent not found" or "Could not find agent: xxx".

### Possible Causes

#### Cause A: Agent Name Mismatch in Command File

**Problem**: The `invokes` field in the Command file doesn't match the Agent filename.

**Solution**:

Check the `invokes` field in the Command file:

```bash
# View a specific Command file
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Command file structure** (taking `plan.md` as an example):

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**Verify Agent file exists**:

The agent name mentioned in the Command file (such as `planner`) must correspond to a file: `planner.md`

```bash
# Verify Agent file exists
ls -la ~/.claude/agents/planner.md

# If it doesn't exist, check for files with similar names
ls -la ~/.claude/agents/ | grep -i plan
```

**Common mismatch examples**:

| Command invokes | Actual Agent filename | Issue |
|----------------|----------------------|-------|
| `planner` | `planner.md` | ✅ Correct |
| `planner` | `Planner.md` | ❌ Case mismatch (Unix systems are case-sensitive) |
| `planner` | `planner.md.backup` | ❌ Incorrect file extension |
| `tdd-guide` | `tdd_guide.md` | ❌ Hyphen vs underscore |

#### Cause B: Incorrect Agent Filename

**Problem**: Agent filename doesn't match expectations.

**Solution**:

Check all Agent filenames:

```bash
# List all Agent files
ls -la ~/.claude/agents/

# Expected 9 Agent files
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**If filename is incorrect**, rename the file:

```bash
# Example: Fix filename
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## Common Issue 3: Agent Front Matter Format Errors

### Symptoms
Agent is invoked, but you see error messages: "Invalid agent metadata" or similar format errors.

### Possible Causes

#### Cause A: Missing Required Fields

**Problem**: Agent Front Matter is missing required fields (`name`, `description`, `tools`).

**Solution**:

Check Agent Front Matter format:

```bash
# View header of a specific Agent file
head -20 ~/.claude/agents/planner.md
```

**Correct Front Matter format**:

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**Required fields**:
- `name`: Agent name (must match filename, without extension)
- `description`: Agent description (used to understand the agent's responsibilities)
- `tools`: List of allowed tools (comma-separated)

**Optional fields**:
- `model`: Preferred model (`opus` or `sonnet`)

#### Cause B: Incorrect Tools Field

**Problem**: The `tools` field uses incorrect tool names or format.

**Solution**:

Check the `tools` field:

```bash
# Extract tools field
grep "^tools:" ~/.claude/agents/*.md
```

**Allowed tool names** (case-sensitive):
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**Common errors**:

| Incorrect | Correct | Issue |
|-----------|---------|-------|
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ Case error |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ Trailing comma (YAML syntax error) |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ Quotes not needed |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ Missing comma separation |

#### Cause C: YAML Syntax Errors

**Problem**: Front Matter YAML format errors (such as indentation, quotes, special characters).

**Solution**:

Validate YAML format:

```bash
# Validate YAML using Python
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# Or use yamllint (requires installation)
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**Common YAML errors**:
- Inconsistent indentation (YAML is indentation-sensitive)
- Missing space after colon: `name:planner` → `name: planner`
- Unescaped special characters in strings (such as colons, hash signs)
- Using Tab indentation (YAML only accepts spaces)

---

## Common Issue 4: Agent Execution Timeout or Stuck

### Symptoms
Agent starts executing, but doesn't respond for a long time or gets stuck.

### Possible Causes

#### Cause A: Excessive Task Complexity

**Problem**: The requested task is too complex, exceeding the Agent's processing capability.

**Solution**:

**Break down tasks into smaller steps**:

```
❌ Incorrect: Asking Agent to handle entire project at once
"Help me refactor the entire user authentication system, including all tests and documentation"

✅ Correct: Execute step by step
Step 1: /plan refactor user authentication system
Step 2: /tdd implement first step (login API)
Step 3: /tdd implement second step (registration API)
...
```

**Use `/plan` command to plan first**:

```
User: /plan I need to refactor user authentication system

Agent (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[detailed steps...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### Cause B: Improper Model Selection

**Problem**: Task complexity is high, but a weaker model is used (such as `sonnet` instead of `opus`).

**Solution**:

Check the Agent's `model` field:

```bash
# View models used by all Agents
grep "^model:" ~/.claude/agents/*.md
```

**Recommended configuration**:
- **Reasoning-intensive tasks** (such as `planner`, `architect`): Use `opus`
- **Code generation/modification** (such as `tdd-guide`, `code-reviewer`): Use `opus`
- **Simple tasks** (such as `refactor-cleaner`): Can use `sonnet`

**Modify model configuration**:

Edit Agent file:

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # Use opus for better performance on complex tasks
---
```

#### Cause C: Excessive File Reading

**Problem**: Agent reads many files, exceeding Token limits.

**Solution**:

**Limit the scope of files Agent reads**:

```
❌ Incorrect: Let Agent read entire project
"Read all files in the project, then analyze architecture"

✅ Correct: Specify relevant files
"Read files in src/auth/ directory, analyze authentication system architecture"
```

**Use Glob patterns for precise matching**:

```
User: Please help me optimize performance

Agent should:
# Use Glob to find performance-critical files
Glob pattern="**/*.{ts,tsx}" path="src/api"

# Instead of
Glob pattern="**/*" path="."  # Read all files
```

---

## Common Issue 5: Agent Output Doesn't Meet Expectations

### Symptoms
Agent is invoked and executes, but output doesn't meet expectations or quality is low.

### Possible Causes

#### Cause A: Unclear Task Description

**Problem**: User's request is vague, and Agent can't accurately understand requirements.

**Solution**:

**Provide clear, specific task descriptions**:

```
❌ Incorrect: Vague request
"Help me optimize code"

✅ Correct: Specific request
"Help me optimize the searchMarkets function in src/api/markets.ts,
improve query performance, goal is to reduce response time from 500ms to under 100ms"
```

**Include the following information**:
- Specific file or function names
- Clear goals (performance, security, readability, etc.)
- Constraints (can't break existing functionality, must maintain compatibility, etc.)

#### Cause B: Missing Context

**Problem**: Agent lacks necessary context information and can't make correct decisions.

**Solution**:

**Proactively provide background information**:

```
User: Please help me fix test failure

❌ Incorrect: No context
"npm test reported errors, help me fix it"

✅ Correct: Provide complete context
"When running npm test, searchMarkets test failed.
Error message: Expected 5 but received 0.
I just modified the vectorSearch function, might be related.
Please help me locate and fix the issue."
```

**Use Skills to provide domain knowledge**:

If the project has specific skill libraries (`~/.claude/skills/`), Agents will automatically load relevant knowledge.

#### Cause C: Agent Specialization Mismatch

**Problem**: Using an inappropriate Agent to handle the task.

**Solution**:

**Choose the correct Agent based on task type**:

| Task Type | Recommended | Command |
|-----------|-------------|---------|
| Implement new features | `tdd-guide` | `/tdd` |
| Plan complex features | `planner` | `/plan` |
| Code review | `code-reviewer` | `/code-review` |
| Security audit | `security-reviewer` | Manual invocation |
| Fix build errors | `build-error-resolver` | `/build-fix` |
| E2E testing | `e2e-runner` | `/e2e` |
| Clean up dead code | `refactor-cleaner` | `/refactor-clean` |
| Update documentation | `doc-updater` | `/update-docs` |
| System architecture design | `architect` | Manual invocation |

**See [Agent Overview](../../platforms/agents-overview/) to understand each Agent's responsibilities**.

---

## Common Issue 6: Agent Tool Permissions Insufficient

### Symptoms
Agent is denied when trying to use a tool, seeing error: "Tool not available: xxx".

### Possible Causes

#### Cause A: Tools Field Missing That Tool

**Problem**: The `tools` field in Agent Front Matter doesn't include the needed tool.

**Solution**:

Check the Agent's `tools` field:

```bash
# View tools Agent is allowed to use
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**If tool is missing**, add to `tools` field:

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # Ensure Write and Edit are included
model: opus
---
```

**Tool usage scenarios**:
- `Read`: Read file content (almost all Agents need this)
- `Write`: Create new files
- `Edit`: Edit existing files
- `Bash`: Execute commands (such as running tests, builds)
- `Grep`: Search file content
- `Glob`: Find file paths

#### Cause B: Incorrect Tool Name Spelling

**Problem**: Incorrect tool name used in `tools` field.

**Solution**:

**Verify tool name spelling** (case-sensitive):

| ✅ Correct | ❌ Incorrect |
|------------|-------------|
| `Read` | `read`, `READ` |
| `Write` | `write`, `WRITE` |
| `Edit` | `edit`, `EDIT` |
| `Bash` | `bash`, `BASH` |
| `Grep` | `grep`, `GREP` |
| `Glob` | `glob`, `GLOB` |

---

## Common Issue 7: Proactive Agent Not Automatically Triggered

### Symptoms
Some Agents should trigger automatically (such as `code-reviewer` being called after code changes), but they don't.

### Possible Causes

#### Cause A: Trigger Conditions Not Met

**Problem**: Agent description is marked with `Use PROACTIVELY`, but trigger conditions aren't met.

**Solution**:

Check the Agent's `description` field:

```bash
# View Agent description
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**Example (code-reviewer)**:

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Proactive trigger conditions**:
- User explicitly requests code review
- Just completed code writing/modification
- Before preparing to commit code

**Manual trigger**:

If automatic trigger doesn't work, you can manually invoke:

```
User: Please help me review the code just now

Or use Command:
User: /code-review
```

---

## Diagnostic Tools and Tips

### Check Agent Loading Status

Verify that Claude Code has loaded all Agents correctly:

```bash
# View Claude Code logs (if available)
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### Manually Test Agents

Manually test Agent invocation in Claude Code:

```
User: Please call planner agent to help me plan a new feature

# Observe if Agent is correctly invoked
# Check if output meets expectations
```

### Validate Front Matter Format

Validate Front Matter for all Agents using Python:

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extract front matter (between ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Check required fields
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

Save as `validate-agents.sh`, then run:

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## Checkpoint ✅

Go through the checklist one by one:

- [ ] Agent files are in correct location (`~/.claude/agents/` or `.claude/agents/`)
- [ ] Command files are in correct location (`~/.claude/commands/` or `.claude/commands/`)
- [ ] Agent Front Matter format is correct (includes name, description, tools)
- [ ] Tools field uses correct tool names (case-sensitive)
- [ ] Command's `invokes` field matches Agent filename
- [ ] Plugin is correctly enabled in `~/.claude/settings.json`
- [ ] Task descriptions are clear and specific
- [ ] Appropriate Agent is selected for the task

---

## When to Seek Help

If none of the above methods solve the problem:

1. **Collect diagnostic information**:
    ```bash
    # Output the following information
    echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
    echo "Agent files:"
    ls -la ~/.claude/agents/
    echo "Command files:"
    ls -la ~/.claude/commands/
    echo "Plugin config:"
    cat ~/.claude/settings.json | jq '.enabledPlugins'
    ```

2. **Check GitHub Issues**:
    - Visit [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
    - Search for similar issues

3. **Submit an Issue**:
    - Include complete error messages
    - Provide operating system and version information
    - Attach relevant Agent and Command file contents

---

## Lesson Summary

Agent invocation failures usually fall into these categories:

| Issue Type | Common Causes | Quick Troubleshooting |
|------------|---------------|----------------------|
| **Not invoked at all** | Agent/Command file path errors, plugin not loaded | Check file locations, verify plugin configuration |
| **Agent not found** | Name mismatch (Command invokes vs filename) | Verify filename and invokes field |
| **Format errors** | Front Matter missing fields, YAML syntax errors | Check required fields, validate YAML format |
| **Execution timeout** | High task complexity, improper model selection | Break down tasks, use opus model |
| **Output doesn't meet expectations** | Unclear task description, missing context, Agent mismatch | Provide specific tasks, choose correct Agent |
| **Insufficient tool permissions** | Tools field missing tools, spelling errors | Check tools field, verify tool names |

Remember: Most issues can be resolved by checking file paths, validating Front Matter format, and choosing the correct Agent.

---

## Coming Up Next

> In the next lesson, we'll learn about **[Performance Optimization Tips](../performance-tips/)**.
>
> You'll learn:
> - How to optimize Token usage
> - Improve Claude Code response speed
> - Context window management strategies

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature             | File Path                                                                                    | Lines   |
| ------------------- | ------------------------------------------------------------------------------------------- | ------- |
| Plugin manifest config | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28    |
| Planner Agent       | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120   |
| TDD Guide Agent     | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281   |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281   |
| Plan Command        | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114   |
| TDD Command         | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281   |
| Agent usage rules   | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50    |

**Front Matter required fields** (all Agent files):
- `name`: Agent identifier (must match filename, without `.md` extension)
- `description`: Agent functionality description (includes trigger condition information)
- `tools`: List of allowed tools (comma-separated: `Read, Grep, Glob`)
- `model`: Preferred model (`opus` or `sonnet`, optional)

**Allowed tool names** (case-sensitive):
- `Read`: Read file content
- `Write`: Create new files
- `Edit`: Edit existing files
- `Bash`: Execute commands
- `Grep`: Search file content
- `Glob`: Find file paths

**Key configuration paths**:
- User-level Agents: `~/.claude/agents/`
- User-level Commands: `~/.claude/commands/`
- User-level Settings: `~/.claude/settings.json`
- Project-level Agents: `.claude/agents/`
- Project-level Commands: `.claude/commands/`

**Plugin loading configuration** (`~/.claude/settings.json`):
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
