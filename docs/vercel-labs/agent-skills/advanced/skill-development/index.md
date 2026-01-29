---
title: "Developing Custom Skills: Create AI Assistants | Agent Skills"
sidebarTitle: "Skill Development"
subtitle: "Developing Custom Skills"
description: "Learn to develop custom skills for Claude. Master directory structure, SKILL.md format, script writing, and Zip packaging workflows. Create extensible AI assistant tools with precise skill triggering and optimized context efficiency."
tags:
  - "Skill Development"
  - "Claude"
  - "AI Assisted Programming"
  - "Custom Extensions"
order: 60
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Developing Custom Skills

## What You'll Learn

After completing this lesson, you will be able to:

- ✅ Create compliant skill directory structure
- ✅ Write complete `SKILL.md` definition files (including Front Matter, How It Works, Usage, and other sections)
- ✅ Write compliant Bash scripts (error handling, output format, cleanup mechanisms)
- ✅ Package skills as Zip files for publishing
- ✅ Optimize context efficiency for more precise skill activation by Claude

## Your Current Challenges

You may have encountered these scenarios:

- ✗ Frequently repeating complex operations (e.g., deploying to specific platforms, analyzing log formats), needing to explain to Claude every time
- ✗ Claude not knowing when to activate certain features, causing you to input the same instructions repeatedly
- ✗ Wanting to encapsulate team best practices into reusable tools but not knowing where to start
- ✗ Skill files you wrote often being ignored by Claude, unsure what went wrong

## When to Use This Approach

When you need to:

- 📦 **Encapsulate Repetitive Operations**: Package frequently used command sequences for one-click execution
- 🎯 **Precise Triggering**: Have Claude proactively activate skills in specific scenarios
- 🏢 **Standardized Workflows**: Automate team standards (e.g., code checks, deployment workflows)
- 🚀 **Extend Capabilities**: Add features to Claude that it doesn't natively support

## 🎒 Before You Start

Before starting, please confirm:

::: warning Prerequisites

- Completed [Agent Skills Getting Started](../../../../start/getting-started/)
- Installed Agent Skills and familiar with basic usage
- Understood basic command-line operations (Bash scripts)
- Have a GitHub repository (for publishing skills)

:::

## Core Concepts

**How Agent Skills Works**:

Claude only loads a skill's **name and description** at startup. When it detects related keywords, it reads the complete `SKILL.md` content. This **on-demand loading mechanism** minimizes Token consumption to the greatest extent.

**Three Core Elements of Skill Development**:

1. **Directory Structure**: Folder layout conforming to naming conventions
2. **SKILL.md**: Skill definition file that tells Claude when to activate and how to use
3. **Scripts**: Bash code that actually executes, responsible for specific operations

<!-- ![Skill Activation Flow](/images/advanced/skill-activation-flow.svg) -->
> [Image: Skill Activation Flow]

---

## Follow Along: Create Your First Skill

### Step 1: Create Directory Structure

**Why**
Correct directory structure is prerequisite for Claude to recognize the skill.

Create a new skill under the `skills/` directory:

```bash
cd skills
mkdir my-custom-skill
cd my-custom-skill
mkdir scripts
```

**Directory structure should be**:

```
skills/
  my-custom-skill/
    SKILL.md           # Skill definition file (required)
    scripts/
      deploy.sh        # Executable script (required)
```

**Note**: After development, you need to package the entire skill directory into `my-custom-skill.zip` for publishing (see the "Packaging Skills" section below)

**You should see**:
- `my-custom-skill/` uses kebab-case naming (lowercase letters and hyphens)
- `SKILL.md` filename is all uppercase, must match exactly
- `scripts/` directory stores executable scripts

### Step 2: Write SKILL.md

**Why**
`SKILL.md` is the core of the skill, defining trigger conditions, usage methods, and output formats.

Create `SKILL.md` file:

```markdown
---
name: my-custom-skill
description: Deploy my app to custom platform. Use when user says "deploy", "production", or "custom deploy".
---

# Custom Deployment Skill

Deploy your application to a custom platform with zero-config setup.

## How It Works

1. Detect the framework from `package.json` (Next.js, Vue, Svelte, etc.)
2. Create a tarball of the project (excluding `node_modules` and `.git`)
3. Upload to the deployment API
4. Return preview URL and deployment ID

## Usage

```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh [path]
```

**Arguments:**
- `path` - Directory path or .tgz file to deploy (defaults to current directory)

**Examples:**

Deploy current directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh .
```

Deploy specific directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh ./my-app
```

## Output

You'll see:

```
✓ Deployed to https://my-app-abc123.custom-platform.io
✓ Deployment ID: deploy_12345
✓ Claim URL: https://custom-platform.io/claim?code=...
```

JSON format (for machine-readable output):
```json
{
  "previewUrl": "https://my-app-abc123.custom-platform.io",
  "deploymentId": "deploy_12345",
  "claimUrl": "https://custom-platform.io/claim?code=..."
}
```

## Present Results to User

When presenting results to the user, use this format:

```
🎉 Deployment successful!

**Preview URL**: https://my-app-abc123.custom-platform.io

To transfer ownership:
1. Visit the claim URL
2. Sign in to your account
3. Confirm the transfer

**Deployment ID**: deploy_12345
```

## Troubleshooting

**Network Error**
- Check your internet connection
- Verify the deployment API is accessible

**Permission Error**
- Ensure the directory is readable
- Check file permissions on the script

**Framework Not Detected**
- Ensure `package.json` exists in the project root
- Verify the framework is supported
```

**You should see**:
- Front Matter contains `name` and `description` fields
- `description` includes trigger keywords (e.g., "deploy", "production")
- Includes sections like `How It Works`, `Usage`, `Output`, `Present Results to User`, `Troubleshooting`, etc.

### Step 3: Write Bash Script

**Why**
The script is the part that actually executes operations and needs to conform to Claude's input/output conventions.

Create `scripts/deploy.sh`:

```bash
#!/bin/bash
set -e  # Exit immediately on error

# Configuration
DEPLOY_API="${DEPLOY_API:-https://deploy.example.com/api}"

# Parse parameters
INPUT_PATH="${1:-.}"

# Cleanup function
cleanup() {
  if [ -n "$TEMP_TARBALL" ] && [ -f "$TEMP_TARBALL" ]; then
    rm -f "$TEMP_TARBALL" >&2 || true
  fi
}
trap cleanup EXIT

# Detect framework
detect_framework() {
  local path="$1"
  local framework=""

  if [ -f "${path}/package.json" ]; then
    if grep -q '"next"' "${path}/package.json"; then
      framework="nextjs"
    elif grep -q '"vue"' "${path}/package.json"; then
      framework="vue"
    elif grep -q '"@sveltejs/kit"' "${path}/package.json"; then
      framework="sveltekit"
    fi
  fi

  echo "$framework"
}

# Main flow
FRAMEWORK=$(detect_framework "$INPUT_PATH")
echo "Detected framework: ${FRAMEWORK:-unknown}" >&2

# Create tarball
TEMP_TARBALL=$(mktemp -t deploy-XXXXXX.tgz)
echo "Creating tarball..." >&2
tar -czf "$TEMP_TARBALL" \
  --exclude='node_modules' \
  --exclude='.git' \
  -C "$INPUT_PATH" . >&2 || true

# Upload
echo "Uploading..." >&2
RESULT=$(curl -s -X POST "$DEPLOY_API" \
  -F "file=@$TEMP_TARBALL" \
  -F "framework=$FRAMEWORK")

# Check for errors
if echo "$RESULT" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Deployment failed: $ERROR_MSG" >&2
  exit 1
fi

# Output result
echo "$RESULT"
echo "Deployment completed successfully" >&2
```

**You should see**:
- Script uses `#!/bin/bash` shebang
- Uses `set -e` for error handling
- Status messages output to stderr (`>&2`)
- Machine-readable output (JSON) outputs to stdout
- Includes cleanup trap

### Step 4: Set Execution Permissions

```bash
chmod +x scripts/deploy.sh
```

**You should see**:
- Script becomes executable (`ls -l scripts/deploy.sh` shows `-rwxr-xr-x`)

### Step 5: Test Skill

Test the skill in Claude Code:

```bash
# Activate skill
"Activate my-custom-skill"

# Trigger deployment
"Deploy my current directory using my-custom-skill"
```

**You should see**:
- Claude activates the skill
- Executes the `deploy.sh` script
- Outputs deployment result (including previewUrl and deploymentId)

---

## Checkpoint ✅

Now check if your skill complies with conventions:

- [ ] Directory name uses kebab-case (e.g., `my-custom-skill`)
- [ ] `SKILL.md` filename is all uppercase, correct
- [ ] Front Matter contains `name` and `description` fields
- [ ] `description` includes trigger keywords
- [ ] Script uses `#!/bin/bash` shebang
- [ ] Script uses `set -e` for error handling
- [ ] Status messages output to stderr (`>&2`)
- [ ] JSON outputs to stdout
- [ ] Script includes cleanup trap

---

## Common Pitfalls

### Pitfall 1: Skill Not Activated

**Symptom**: You say "Deploy my app", but Claude doesn't activate the skill.

**Cause**: `description` doesn't include trigger keywords.

**Solution**:
```markdown
# ❌ Wrong
description: A tool for deploying applications

# ✅ Correct
description: Deploy my app to production. Use when user says "deploy", "production", or "push to live".
```

### Pitfall 2: Script Output Confusion

**Symptom**: Claude cannot parse JSON output.

**Cause**: Status messages and JSON output mixed together.

**Solution**:
```bash
# ❌ Wrong: All output to stdout
echo "Creating tarball..."
echo '{"previewUrl": "..."}'

# ✅ Correct: Status messages use stderr
echo "Creating tarball..." >&2
echo '{"previewUrl": "..."}'
```

### Pitfall 3: Temporary Files Not Cleaned

**Symptom**: Disk space gradually fills up.

**Cause**: Script doesn't clean up temporary files when exiting.

**Solution**:
```bash
# ✅ Correct: Use cleanup trap
cleanup() {
  rm -f "$TEMP_TARBALL" >&2 || true
}
trap cleanup EXIT
```

### Pitfall 4: SKILL.md Too Long

**Symptom**: Skill consumes too much context, affecting performance.

**Cause**: `SKILL.md` exceeds 500 lines.

**Solution**:
- Put detailed reference documentation in separate files
- Use Progressive Disclosure
- Prioritize scripts over inline code

---

## Lesson Summary

**Core Points**:

1. **Directory Structure**: Uses kebab-case, includes `SKILL.md` and `scripts/` directory
2. **SKILL.md Format**: Front Matter + How It Works + Usage + Output + Present Results to User + Troubleshooting
3. **Script Conventions**: `#!/bin/bash`, `set -e`, stderr for status messages, stdout for JSON, cleanup trap
4. **Context Efficiency**: Keep `SKILL.md` < 500 lines, use progressive disclosure, prioritize scripts
5. **Package and Publish**: Use `zip -r` command to package as `{skill-name}.zip`

**Best Practices Mnemonic**:

> Descriptions be specific, triggers clear
> Use stderr for status, stdout for JSON
> Remember to trap, clean temp files
> Don't make files too long, scripts take space

---

## Next Lesson Preview

> In the next lesson, we learn **[Writing React Best Practices Rules](../rule-authoring/)**.
>
> You will learn:
> - How to write compliant rule files
> - Use `_template.md` template to generate rules
> - Define impact levels and tags
> - Write Incorrect/Correct code example comparisons
> - Add references and validate rules

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-25

| Feature                           | File Path                                                                                      | Line Numbers |
|--- | --- | ---|
| Skill Development Conventions     | [`AGENTS.md:9-69`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L9-L69)     | 9-69         |
| Directory Structure Definition    | [`AGENTS.md:11-20`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20)   | 11-20        |
| Naming Conventions                | [`AGENTS.md:22-27`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L22-L27)   | 22-27        |
| SKILL.md Format                   | [`AGENTS.md:29-68`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68)   | 29-68        |
| Context Efficiency Best Practices | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78)   | 70-78        |
| Script Requirements               | [`AGENTS.md:80-87`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L80-L87)   | 80-87        |
| Zip Packaging                     | [`AGENTS.md:89-96`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L89-L96)   | 89-96        |
| User Installation Methods         | [`AGENTS.md:98-110`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110       |

**Key Constants**:
- `SKILL.md` filename: Must be all uppercase, exact match
- `/mnt/skills/user/{skill-name}/scripts/{script}.sh`: Script path format

**Key Functions**:
- Script cleanup function `cleanup()`: For deleting temporary files
- Framework detection function `detect_framework()`: Infers framework type from package.json

</details>
