---
title: "Execute Scripts: Run Automation | OpenCode Agent Skills"
sidebarTitle: "Execute Scripts"
subtitle: "Execute Scripts: Run Automation"
description: "Learn to use run_skill_script for executing scripts with parameter passing and error handling. Master skill automation, set permissions, understand best practices, and improve efficiency."
tags:
  - "Script Execution"
  - "Automation"
  - "Tool Usage"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 5
---

# Execute Skill Scripts

## What You'll Learn

- Use the `run_skill_script` tool to execute executable scripts under the skill directory
- Pass command-line arguments to scripts
- Understand the working directory context for script execution
- Handle script execution errors and exit codes
- Master script permission setup and security mechanisms

## Your Current Challenge

You want AI to execute an automated script for a skill, like building a project, running tests, or deploying an application. But you're unsure how to invoke the script, or you encounter permission errors, script not found, or other issues during execution.

## When to Use This

- **Automated builds**: Execute the skill's `build.sh` or `build.py` to build the project
- **Run tests**: Trigger the skill's test suite to generate coverage reports
- **Deployment workflows**: Execute deployment scripts to publish the application to production
- **Data processing**: Run scripts to process files and transform data formats
- **Dependency installation**: Execute scripts to install dependencies required by the skill

## Core Concept

The `run_skill_script` tool lets you execute executable scripts within the skill directory's context. The benefits are:

- **Correct execution environment**: Scripts run in the skill directory, accessing the skill's configuration and resources
- **Automated workflows**: Skills can include a set of automation scripts, reducing repetitive operations
- **Permission checking**: Only files with executable permissions are executed, preventing accidental execution of plain text files
- **Error capture**: Capture script exit codes and output for easier debugging

::: info Script Discovery Rules
The plugin recursively searches for executable files in the skill directory (max depth 10 levels):
- **Skipped directories**: Hidden directories (starting with `.`), `node_modules`, `__pycache__`, `.git`, `.venv`, etc.
- **Executable check**: Only files with executable permissions (mode & 0o111) are included in the script list
- **Relative paths**: Script paths are relative to the skill directory, such as `tools/build.sh`
:::

::: tip Check Available Scripts First
Before execution, use `get_available_skills` to view the skill's script list:
```
docker-helper (project)
  Docker containerization and deployment guide [scripts: build.sh, deploy.sh]
```
:::

## Follow Along

### Step 1: Execute a Skill Script

Assume you have a `docker-helper` skill containing a `build.sh` script:

```
User input:
Execute the build.sh script for docker-helper

System response:
Building Docker image...
Successfully built abc123def456
Tagged as myapp:latest
```

**What you should see**: The script's output displayed in the response.

The working directory during script execution is switched to the skill directory, so `build.sh` can correctly access resources like the skill's `Dockerfile`.

### Step 2: Pass Command-Line Arguments

Many scripts support parameters, for example `deploy.sh` might need to specify the environment:

```
User input:
Execute deploy.sh for docker-helper, with parameter production

System response:
Deploying to production environment...
Uploading image to registry...
Deployment successful: https://myapp.example.com
```

You can also pass multiple parameters:

```
User input:
Use deploy.sh for deployment, with parameters staging and --force

System response:
Deploying to staging environment (--force mode)...
Skipping validation...
Deployment successful
```

**What you should see**: The script receives parameters and performs the corresponding operations.

### Step 3: Execute Scripts in Nested Directories

Scripts can be in subdirectories of the skill, such as `tools/setup.sh`:

```
User input:
Execute tools/setup.sh for docker-helper

System response:
Setting up Docker environment...
✓ Docker network created
✓ Volume mounted
✓ Environment configured
```

Relative paths are always relative to the skill directory, regardless of the script's actual depth.

**What you should see**: Scripts in nested directories execute correctly.

### Step 4: Handle Skill Not Found Errors

If you enter an incorrect skill name:

```
User input:
Execute build.sh for docker-asistant

System response:
Skill "docker-asistant" not found. Did you mean "docker-helper"?
```

The plugin will suggest the correct skill name based on fuzzy matching. You can first call `get_available_skills` to view available skills.

**What you should see**: An error message and the suggested correct name.

### Step 5: Handle Script Not Found Errors

If the script is not in the skill's script list:

```
User input:
Execute run.sh for docker-helper

System response:
Script "run.sh" not found in skill "docker-helper". Did you mean "build.sh"?
Available scripts: build.sh, deploy.sh
```

The plugin will list all available scripts to help you select the correct script name.

**What you should see**: An error message and a list of available scripts.

### Step 6: Understand Script Execution Failures

If a script fails to execute (non-zero exit code), the plugin will return error information:

```
User input:
Execute build.sh for docker-helper

System response:
Script failed (exit 1): Dockerfile not found in /path/to/skill
```

Error information includes:
- **Exit code**: `exit 1` indicates the script exited with a non-zero status
- **Error output**: The script's stderr or stdout content
- **Failure reason**: The specific error message from the script

**What you should see**: Detailed error information to help you troubleshoot the issue.

## Checklist ✅

- [ ] Can you execute executable scripts under the skill directory?
- [ ] Can you pass command-line arguments to scripts?
- [ ] Can you understand the working directory context for script execution?
- [ ] Can you identify and handle script execution errors?
- [ ] Do you know how to check script permission settings?

## Common Pitfalls

### Pitfall 1: Script Lacks Executable Permissions

If you create a new script but forget to set executable permissions, it won't appear in the script list.

**Symptoms**:
```
Available scripts: build.sh  # Your new script new-script.sh is not in the list
```

**Cause**: The file lacks executable permissions (mode & 0o111 is false).

**Solution**: Set executable permissions in the terminal:
```bash
chmod +x .opencode/skills/my-skill/new-script.sh
```

**Verification**: Re-call `get_available_skills` to view the script list.

### Pitfall 2: Incorrect Script Path

Script paths must be relative to the skill directory; absolute paths or parent directory references are not allowed.

**Incorrect examples**:

```bash
# ❌ Error: Using absolute path
Execute /path/to/skill/build.sh for docker-helper

# ❌ Error: Attempting to access parent directory (although it passes security check, the path is incorrect)
Execute ../build.sh for docker-helper
```

**Correct examples**:

```bash
# ✅ Correct: Use relative paths
Execute build.sh for docker-helper
Execute tools/deploy.sh for docker-helper
```

**Cause**: The plugin validates path security to prevent directory traversal attacks, and relative paths are based on the skill directory.

### Pitfall 3: Script Depends on Working Directory

If the script assumes the current directory is the project root rather than the skill directory, it may fail.

**Incorrect example**:
```bash
# build.sh in skill directory
#!/bin/bash
# ❌ Error: Assumes current directory is project root
docker build -t myapp .
```

**Problem**: When executing, the current directory is the skill directory (`.opencode/skills/docker-helper`), not the project root.

**Solution**: Scripts should use absolute paths or dynamically locate the project root:
```bash
# ✅ Correct: Use relative paths to locate project root
docker build -t myapp ../../..

# Or: Use environment variables or configuration files
PROJECT_ROOT="${SKILL_DIR}/../../.."
docker build -t myapp "$PROJECT_ROOT"
```

**Note**: The skill directory might not contain the project's `Dockerfile`, so scripts need to locate resource files themselves.

### Pitfall 4: Excessive Script Output

If a script outputs a lot of log information (like npm install download progress), it can make the response very long.

**Symptoms**:

```bash
System response:
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# Possibly hundreds of lines of output
```

**Recommendation**: Scripts should minimize output and only show key information:

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed (500 packages)"
```

## Lesson Summary

The `run_skill_script` tool lets you execute executable scripts within the skill directory's context, supporting:

- **Parameter passing**: Pass command-line arguments through the `arguments` array
- **Working directory switching**: CWD switches to the skill directory during script execution
- **Error handling**: Capture exit codes and error output for easier debugging
- **Permission checking**: Only execute files with executable permissions
- **Path security**: Validate script paths to prevent directory traversal

Script discovery rules:
- Recursively scan the skill directory, max depth 10 levels
- Skip hidden directories and common dependency directories
- Only include files with executable permissions
- Paths are relative to the skill directory

**Best practices**:
- Keep script output concise and only show key information
- Scripts should not assume the current directory is the project root
- Use `chmod +x` to set executable permissions for new scripts
- First use `get_available_skills` to view available scripts

## Preview of Next Lesson

> In the next lesson, we'll learn **[Reading Skill Files](../reading-skill-files/)**.
>
> You'll learn:
> - Use the read_skill_file tool to access skill documentation and configuration
> - Understand path security checks to prevent directory traversal attacks
> - Master file reading and XML content injection formats
> - Learn how to organize support files in skills (documentation, examples, configuration, etc.)

---

## Appendix: Source Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-24

| Function        | File Path                                                                                    | Line Range |
|--- | --- | ---|
| RunSkillScript tool definition | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| findScripts function | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**Key Types**:
- `Script = { relativePath: string; absolutePath: string }`: Script metadata containing relative and absolute paths

**Key Constants**:
- Max recursion depth: `10` (`skills.ts:64`) - Script search depth limit
- Skipped directories list: `['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']` (`skills.ts:61`)
- Executable permission mask: `0o111` (`skills.ts:86`) - Check if file is executable

**Key Functions**:
- `RunSkillScript(skill: string, script: string, arguments?: string[])`: Execute skill script, supporting parameter passing and working directory switching
- `findScripts(skillPath: string)`: Recursively find executable files in the skill directory, returned sorted by relative path

**Business Rules**:
- Working directory switches to skill directory during script execution (`tools.ts:180`): `$.cwd(skill.path)`
- Only execute scripts in the skill's scripts list (`tools.ts:165-177`)
- When script doesn't exist, return available script list and support fuzzy match suggestions (`tools.ts:168-176`)
- Return exit code and error output on execution failure (`tools.ts:184-195`)
- Skip hidden directories (starting with `.`) and common dependency directories (`skills.ts:70-71`)

</details>
