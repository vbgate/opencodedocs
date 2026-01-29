---
title: "Troubleshooting: Common Issues & Fixes | Agent Skills"
sidebarTitle: "Troubleshooting"
subtitle: "Troubleshooting: Common Issues & Fixes"
description: "Learn to solve Agent Skills network errors, skill activation issues, and rule validation failures. Master quick diagnosis methods and fix steps."
tags:
  - "FAQ"
  - "Troubleshooting"
  - "Debugging"
  - "Network Configuration"
order: 90
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Troubleshooting

## What You'll Learn

- Quickly diagnose and resolve deployment network errors
- Fix skill activation issues
- Handle rule validation failure errors
- Identify causes of inaccurate framework detection

## Deployment Issues

### Network Egress Error

**Problem**: Network error occurs when deploying to Vercel, indicating inability to access external networks.

**Cause**: In the claude.ai environment, network access is restricted by default. The `vercel-deploy-claimable` skill needs access to `*.vercel.com` domains to upload files.

**Solution**:

::: tip Configure Network Permissions in claude.ai

1. Visit [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities)
2. Add `*.vercel.com` to "Allowed Domains"
3. Save settings and redeploy

:::

**Verification**:

```bash
# Test network connection (without executing deployment)
curl -I https://claude-skills-deploy.vercel.com/api/deploy
```

**You should see**:
```bash
HTTP/2 200
```

### Deployment Failed: Unable to Extract Preview URL

**Problem**: Deployment script completes but prompts "Error: Could not extract preview URL from response".

**Cause**: Deployment API returned an error response (containing `"error"` field), but the script checked for URL extraction failure first.

According to source code [`deploy.sh:224-229`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L224-L229):

```bash
# Check for error in response
if echo "$RESPONSE" | grep -q '"error"'; then
    ERROR_MSG=$(echo "$RESPONSE" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
    echo "Error: $ERROR_MSG" >&2
    exit 1
fi
```

**Solution**:

1. View complete error response:
```bash
# Re-execute deployment in project root, note error messages
bash skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh .
```

2. Common error types:

| Error Message | Possible Cause | Solution |
|--- | --- | ---|
| "File too large" | Project size exceeds limit | Exclude unnecessary files (e.g., `*.log`, `*.test.ts`) |
| "Invalid framework" | Framework recognition failed | Add `package.json` or manually specify framework |
| "Network timeout" | Network timeout | Check network connection, retry deployment |

**Preventive measures**:

Deployment script automatically excludes `node_modules` and `.git` (see source code [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210)), but you can further optimize:

```bash
# Modify deploy.sh, add more exclusions
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='coverage' \
  --exclude='.next' \
  .
```

### Inaccurate Framework Detection

**Problem**: Detected framework during deployment doesn't match actual framework, or returns `null`.

**Cause**: Framework detection relies on dependency list in `package.json`. Detection may fail if dependencies are missing or project type is special.

According to source code [`deploy.sh:12-156`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L12-L156), detection logic:

1. Read `package.json`
2. Check for specific dependency package names
3. Match by priority order (Blitz → Next.js → Gatsby → ...)

**Solution**:

| Scenario | Solution |
|--- | ---|
| `package.json` exists but detection fails | Check if dependencies are in `dependencies` or `devDependencies` |
| Pure static HTML project | Ensure root directory has `index.html`, script will automatically rename single HTML files (see source code [`deploy.sh:198-205`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L198-L205)) |
| Framework not in supported list | Deploy directly (framework is null), Vercel will auto-detect |

**Manual framework detection check**:

```bash
# Simulate framework detection (requires bash environment)
grep -E '"(next|gatsby|vite|astro)"' package.json
```

## Skill Activation Issues

### Skill Not Activated

**Problem**: Using relevant prompts in Claude (e.g., "Deploy my app"), but skill is not activated.

**Cause**: Skill activation relies on keyword matching in prompts. If keywords are unclear or skill is not loaded correctly, AI cannot identify which skill to use.

**Solution**:

::: warning Checklist

1. **Verify skill is installed**:
   ```bash
   # Claude Desktop users
   ls ~/.claude/skills/ | grep agent-skills

   # claude.ai users
   Check if project knowledge base includes agent-skills
   ```

2. **Use clear keywords**:
   - ✅ Available: `Deploy my app to Vercel`
   - ✅ Available: `Review this React component for performance`
   - ✅ Available: `Check accessibility of my site`
   - ❌ Not available: `帮我部署` (missing keywords)

3. **Reload skills**:
   - Claude Desktop: Exit and restart
   - claude.ai: Refresh page or re-add skill to project

:::

**Check skill description**:

Each skill's `SKILL.md` file starts with a description, explaining trigger keywords. For example:

- `vercel-deploy`: Keywords include "Deploy", "deploy", "production"
- `react-best-practices`: Keywords include "React", "component", "performance"

### Web Design Guidelines Cannot Pull Rules

**Problem**: When using `web-design-guidelines` skill, prompted that rules cannot be pulled from GitHub.

**Cause**: This skill needs to access GitHub repository to get latest rules, but claude.ai restricts network access by default.

**Solution**:

1. Add at [https://claude.ai/settings/capabilities](https://claude.ai/settings/capabilities):
   - `raw.githubusercontent.com`
   - `github.com`

2. Verify network access:
```bash
# Test if rules source is accessible
curl -I https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

**Workaround**: If network is restricted, manually download rules file and place locally, modify skill definition to point to local path.

## Rule Validation Issues

### VALIDATION_ERROR

**Problem**: Error occurs when running `pnpm validate`, indicating rule validation failed.

**Cause**: Rule file format does not meet specifications, missing required fields or example code.

According to source code [`validate.ts:21-66`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66), validation rules include:

1. **title non-empty**: Rule must have a title
2. **explanation non-empty**: Rule must have an explanation
3. **examples non-empty**: Must contain at least one code example
4. **impact level valid**: Must be one of `CRITICAL`/`HIGH`/`MEDIUM-HIGH`/`MEDIUM`/`LOW-MEDIUM`/`LOW`
5. **Example code complete**: Must contain at least "Incorrect/Correct" comparison

**Solution**:

::: tip Validation Error Examples and Fixes

| Error Message | Cause | Fix |
|--- | --- | ---|
| `Missing or empty title` | frontmatter missing `title` | Add at top of rule file:<br>`---`<br>`title: "Rule Title"`<br>`---` |
| `Missing or empty explanation` | Missing rule explanation | Add `explanation` field in frontmatter |
| `Missing examples` | No code examples | Add `**Incorrect:**` and `**Correct:**` code blocks |
| `Invalid impact level` | impact value is incorrect | Check if `impact` in frontmatter is a valid enum value |
| `Missing bad/incorrect or good/correct examples` | Example label mismatch | Ensure example labels contain "Incorrect" or "Correct" |

:::

**Complete example**:

```markdown
---
title: "My Rule"
impact: "CRITICAL"
explanation: "Rule explanation text"
---

## My Rule

**Incorrect:**
\`\`\`typescript
// Incorrect example
\`\`\`

**Correct:**
\`\`\`typescript
// Correct example
\`\`\`
```

**Run validation**:

```bash
cd packages/react-best-practices-build
pnpm validate
```

**You should see**:
```
Validating rule files...
Rules directory: ../../skills/react-best-practices/rules
✓ All 57 rule files are valid
```

### Rule File Parsing Failed

**Problem**: Validation prompts `Failed to parse: ...`, usually due to Markdown format errors.

**Cause**: frontmatter YAML format error, irregular heading hierarchy, or code block syntax errors.

**Solution**:

1. **Check frontmatter**:
   - Use three hyphens `---` to wrap
   - Colon must be followed by a space
   - String values should use double quotes

2. **Check heading hierarchy**:
   - Rule title uses `##` (H2)
   - Example labels use `**Incorrect:**` and `**Correct:**`

3. **Check code blocks**:
   - Use three backticks \`\`\` to wrap code
   - Specify language type (e.g., `typescript`)

**Common error examples**:

```markdown
# ❌ Wrong: missing space after frontmatter colon
---
title:"my rule"
---

# ✅ Correct
---
title: "my rule"
---

# ❌ Wrong: example label missing colon
**Incorrect**
\`\`\`typescript
code
\`\`\`

# ✅ Correct
**Incorrect:**
\`\`\`typescript
code
\`\`\`
```

## File Permission Issues

### Cannot Write to ~/.claude/skills/

**Problem**: Permission error occurs when executing installation command.

**Cause**: `~/.claude` directory doesn't exist or current user doesn't have write permission.

**Solution**:

```bash
# Manually create directory
mkdir -p ~/.claude/skills

# Copy skill packages
cp -r agent-skills/* ~/.claude/skills/

# Verify permissions
ls -la ~/.claude/skills/
```

**You should see**:
```
drwxr-xr-x  user group  size  date  react-best-practices/
drwxr-xr-x  user group  size  date  web-design-guidelines/
drwxr-xr-x  user group  size  date  vercel-deploy-claimable/
```

### Windows User Path Issues

**Problem**: Path format errors when executing deployment script on Windows.

**Cause**: Windows uses backslash `\` as path separator, while Bash scripts expect forward slash `/`.

**Solution**:

::: code-group

```bash [Git Bash / WSL]
# Convert path format
INPUT_PATH=$(pwd | sed 's/\\/\//g')
bash deploy.sh "$INPUT_PATH"
```

```powershell [PowerShell]
# Use PowerShell to convert path
$INPUT_PATH = $PWD.Path -replace '\\', '/'
bash deploy.sh "$INPUT_PATH"
```

:::

**Best practice**: Use Git Bash or WSL to execute deployment scripts on Windows.

## Performance Issues

### Slow Build Speed

**Problem**: Running `pnpm build` is slow, especially with many rules.

**Cause**: Build tool parses rule files one by one (see [`build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)), without parallel processing.

**Solution**:

1. **Skip unnecessary steps**:
```bash
# Build only, no validation
pnpm build

# Validate only, no build
pnpm validate
```

2. **Clear cache**:
```bash
rm -rf node_modules/.cache
pnpm build
```

3. **Hardware optimization**:
   - Use SSD storage
   - Ensure Node.js version >= 20

### Slow Deployment Upload

**Problem**: Uploading tarball to Vercel is very slow.

**Cause**: Large project size or insufficient network bandwidth.

**Solution**:

1. **Reduce project size**:
```bash
# Check tarball size
ls -lh .tgz

# If over 50MB, consider optimization
```

2. **Optimize exclusion rules**:

Modify [`deploy.sh:210`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh#L210), add exclusions:

```bash
tar -czf "$TARBALL" -C "$PROJECT_PATH" \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='*.log' \
  --exclude='.vscode' \
  --exclude='dist' \
  --exclude='build' \
  .
```

## Lesson Summary

Common issues with Agent Skills mainly fall into:

1. **Network permissions**: Configure allowed domains in claude.ai
2. **Skill activation**: Use clear keywords to trigger skills
3. **Rule validation**: Follow `_template.md` template to ensure correct format
4. **Framework detection**: Ensure `package.json` contains correct dependencies

When encountering problems, prioritize checking error messages and error handling logic in source code (such as `validate.ts` and `deploy.sh`).

## Getting Help

If above methods cannot solve the problem:

1. **View source code**:
   - Deployment script: [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh)
   - Validation script: [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)
   - Skill definition: [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)

2. **GitHub Issues**: Submit issues at [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills/issues)

3. **Community discussion**: Seek help on related tech forums (e.g., Twitter, Discord)

## Next Lesson Preview

> In the next lesson, we'll learn **[Best Practices](../best-practices/)**.
>
> You'll learn:
> - How to choose keywords for efficient skill triggering
> - Context management techniques
> - Multi-skill collaboration scenarios
> - Performance optimization recommendations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature        | File Path                                                                                      | Line #  |
|--- | --- | ---|
| Network error handling | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md#L100-L113) | 100-113 |
| Rule validation logic | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66   |
| Framework detection logic | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 12-156  |
| Deployment error handling | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 224-239 |
| Static HTML handling | [`skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/scripts/deploy.sh) | 192-205  |

**Key constants**:
- `DEPLOY_ENDPOINT = "https://claude-skills-deploy.vercel.com/api/deploy"`: Deployment API endpoint

**Key functions**:
- `detect_framework()`: Detect framework type from package.json
- `validateRule()`: Validate rule file format integrity
- `cleanup()`: Clean up temporary files

**Error codes**:
- `VALIDATION_ERROR`: Rule validation failed
- `INPUT_INVALID`: Deployment input invalid (not directory or .tgz)
- `API_ERROR`: Deployment API returned error

</details>
