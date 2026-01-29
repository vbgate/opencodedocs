---
title: "FAQ & Troubleshooting: Quick Solutions | AI App Factory Tutorial"
sidebarTitle: "What to Do When Problems Occur"
subtitle: "FAQ & Troubleshooting"
description: "Learn how to quickly identify and resolve common issues when using AI App Factory. This tutorial covers troubleshooting methods and fix steps for initialization directory issues, AI assistant startup failures, stage failure handling, dependency version conflicts, permission errors, and more, helping you efficiently complete application development."
tags:
  - "Troubleshooting"
  - "FAQ"
  - "Debugging"
prerequisite:
  - "../../start/installation/"
  - "../../start/init-project/"
order: 190
---

# FAQ & Troubleshooting

## What You'll Learn

- Quickly identify and resolve initialization directory issues
- Troubleshoot AI assistant startup failures
- Understand stage failure handling process (retry/rollback/manual intervention)
- Resolve dependency installation and version conflicts
- Handle Agent permission errors
- Use `factory continue` to resume execution across sessions

## The Problem

You might be facing these issues:

- ❌ "Directory not empty" error when running `factory init`
- ❌ AI assistant cannot start, don't know how to configure permissions
- ❌ Pipeline execution suddenly fails at a stage, don't know how to continue
- ❌ Dependency installation errors with severe version conflicts
- ❌ Agent-generated artifacts marked as "unauthorized"
- ❌ Don't understand the checkpoint and retry mechanism

Don't worry, these problems all have clear solutions. This tutorial will help you quickly troubleshoot and fix various failures.

---

## 🎒 Prerequisites

::: warning Requirements

Before starting, ensure you have:

- [ ] Completed [Installation and Configuration](../../start/installation/)
- [ ] Completed [Initialize Factory Project](../../start/init-project/)
- [ ] Understood [7-Stage Pipeline Overview](../../start/pipeline-overview/)
- [ ] Know how to use [Claude Code Integration](../../platforms/claude-code/)

:::

## Core Concepts

AI App Factory's failure handling follows a strict strategy. Understanding this mechanism will prevent you from feeling helpless when issues arise.

### Three Levels of Failure Handling

1. **Automatic Retry**: Each stage allows one retry
2. **Rollback Archive**: Failed artifacts moved to `_failed/`, rolled back to last successful checkpoint
3. **Manual Intervention**: Pauses after two consecutive failures, requiring manual fixes

### Permission Violation Rules

- Agent writes to unauthorized directory → Moved to `_untrusted/`
- Pipeline pauses, waiting for your review
- Adjust permissions or modify Agent behavior as needed

### Permission Boundaries

Each Agent has strict read/write permission scope:

| Agent       | Can Read                      | Can Write                           |
| ----------- | ----------------------------- | ----------------------------------- |
| bootstrap   | None                          | `input/`                            |
| prd         | `input/`                      | `artifacts/prd/`                    |
| ui          | `artifacts/prd/`              | `artifacts/ui/`                     |
| tech        | `artifacts/prd/`              | `artifacts/tech/`, `artifacts/backend/prisma/` |
| code        | `artifacts/ui/`, `artifacts/tech/`, `artifacts/backend/prisma/` | `artifacts/backend/`, `artifacts/client/` |
| validation  | `artifacts/backend/`, `artifacts/client/` | `artifacts/validation/`            |
| preview     | `artifacts/backend/`, `artifacts/client/` | `artifacts/preview/`               |

---

## Initialization Issues

### Issue 1: Directory Not Empty Error

**Symptoms**:

```bash
$ factory init
Error: Directory is not empty or contains conflicting files
```

**Cause**: Current directory contains conflicting files (not `.git`, `README.md`, etc.)

**Solution**:

1. **Verify directory contents**:

```bash
ls -la
```

2. **Clean up conflicting files**:

```bash
# Method 1: Delete conflicting files
rm -rf <conflicting-files>

# Method 2: Move to new directory
mkdir ../my-app && mv . ../my-app/
cd ../my-app
```

3. **Reinitialize**:

```bash
factory init
```

**Allowed files**: `.git`, `.gitignore`, `README.md`, `.vscode/*`, `.idea/*`

### Issue 2: Factory Project Already Exists

**Symptoms**:

```bash
$ factory init
Error: This is already a Factory project
```

**Cause**: Directory already contains `.factory/` or `artifacts/` directories.

**Solution**:

- If this is a new project, clean up first then initialize:

```bash
rm -rf .factory artifacts
factory init
```

- If you want to resume old project, directly run `factory run`

### Issue 3: AI Assistant Startup Failure

**Symptoms**:

```bash
$ factory init
✓ Factory project initialized
Could not find Claude Code installation.
```

**Cause**: Claude Code not installed or not configured correctly.

**Solution**:

1. **Install Claude Code**:

```bash
# macOS
brew install claude

# Linux (download from official website)
# https://claude.ai/code
```

2. **Verify installation**:

```bash
claude --version
```

3. **Manual startup**:

```bash
# In Factory project directory
claude "Please read .factory/pipeline.yaml and .factory/agents/orchestrator.checkpoint.md, start the pipeline"
```

**Manual startup process**: 1. Read `pipeline.yaml` → 2. Read `orchestrator.checkpoint.md` → 3. Wait for AI to execute

---

## Pipeline Execution Issues

### Issue 4: Not a Project Directory Error

**Symptoms**:

```bash
$ factory run
Error: Not a Factory project. Run 'factory init' first.
```

**Cause**: Current directory is not a Factory project (missing `.factory/` directory).

**Solution**:

1. **Verify project structure**:

```bash
ls -la .factory/
```

2. **Switch to correct directory** or **reinitialize**:

```bash
# Switch to project directory
cd /path/to/project

# Or reinitialize
factory init
```

### Issue 5: Pipeline File Not Found

**Symptoms**:

```bash
$ factory run
Error: Pipeline configuration not found
```

**Cause**: `pipeline.yaml` file missing or path incorrect.

**Solution**:

1. **Check if file exists**:

```bash
ls -la .factory/pipeline.yaml
ls -la pipeline.yaml
```

2. **Manual copy** (if file lost):

```bash
cp /path/to/factory/source/hyz1992/agent-app-factory/pipeline.yaml .factory/
```

3. **Reinitialize** (most reliable):

```bash
rm -rf .factory
factory init
```

---

## Stage Failure Handling

### Issue 6: Bootstrap Stage Failure

**Symptoms**:

- `input/idea.md` doesn't exist
- `idea.md` missing key sections (target users, core value, hypotheses)

**Cause**: Insufficient user input, or Agent didn't write file correctly.

**Handling process**:

```
1. Check if input/ directory exists → Create if missing
2. Retry once, instruct Agent to use correct template
3. If still fails, request user to provide more detailed product description
```

**Manual fix**:

1. **Check artifacts directory**:

```bash
ls -la artifacts/_failed/bootstrap/
```

2. **Create input/ directory**:

```bash
mkdir -p input
```

3. **Provide detailed product description**:

Provide AI with clearer, more detailed product ideas, including:
- Who are the target users (specific personas)
- What are the core pain points
- What problem do you want to solve
- Initial feature ideas

### Issue 7: PRD Stage Failure

**Symptoms**:

- PRD contains technical details (violating responsibility boundaries)
- Must Have features > 7 (scope creep)
- Missing non-goals (unclear boundaries)

**Cause**: Agent overreaching or loose scope control.

**Handling process**:

```
1. Verify prd.md doesn't contain technical keywords
2. Verify Must Have features count ≤ 7
3. Verify target users have specific personas
4. Provide specific correction requirements on retry
```

**Common error examples**:

| Error Type | Wrong Example | Correct Example |
|-----------|---------------|-----------------|
| Contains technical details | "Implement with React Native" | "Support iOS and Android platforms" |
| Scope creep | "Includes payment, social, messaging and 10 other features" | "Core features no more than 7" |
| Vague target | "Everyone can use" | "25-35 year old urban professionals" |

**Manual fix**:

1. **Check failed PRD**:

```bash
cat artifacts/_failed/prd/prd.md
```

2. **Correct content**:

- Remove tech stack descriptions
- Simplify feature list to ≤ 7
- Add non-goals list

3. **Manually move to correct location**:

```bash
mv artifacts/_failed/prd/prd.md artifacts/prd/prd.md
```

### Issue 8: UI Stage Failure

**Symptoms**:

- Page count > 8 (scope creep)
- Preview HTML file corrupted
- Uses AI style (Inter font + purple gradient)
- YAML parsing failed

**Cause**: UI scope too large or didn't follow aesthetic guidelines.

**Handling process**:

```
1. Count pages in ui.schema.yaml
2. Try opening preview.web/index.html in browser
3. Verify YAML syntax
4. Check if using prohibited AI style elements
```

**Manual fix**:

1. **Verify YAML syntax**:

```bash
npx js-yaml .factory/artifacts/ui/ui.schema.yaml
```

2. **Open preview in browser**:

```bash
open artifacts/ui/preview.web/index.html  # macOS
xdg-open artifacts/ui/preview.web/index.html  # Linux
```

3. **Simplify page count**: Check `ui.schema.yaml`, ensure page count ≤ 8

### Issue 9: Tech Stage Failure

**Symptoms**:

- Prisma schema syntax errors
- Introduced microservices, caching and other over-designs
- Too many data models (table count > 10)
- Missing API definitions

**Cause**: Architecture over-complexity or database design issues.

**Handling process**:

```
1. Run npx prisma validate to verify schema
2. Check if tech.md contains necessary sections
3. Count data models
4. Check if introduced unnecessary complex technologies
```

**Manual fix**:

1. **Verify Prisma Schema**:

```bash
cd artifacts/backend/
npx prisma validate
```

2. **Simplify architecture**: Check `artifacts/tech/tech.md`, remove unnecessary technologies (microservices, caching, etc.)

3. **Add API definitions**: Ensure `tech.md` includes all required API endpoints

### Issue 10: Code Stage Failure

**Symptoms**:

- Dependency installation failure
- TypeScript compilation errors
- Missing required files
- Test failures
- API cannot start

**Cause**: Dependency version conflicts, type issues, or code logic errors.

**Handling process**:

```
1. Run npm install --dry-run to check dependencies
2. Run npx tsc --noEmit to check types
3. Check directory structure against file checklist
4. Run npm test to verify tests
5. If all pass, try starting service
```

**Common dependency fixes**:

```bash
# Version conflicts
rm -rf node_modules package-lock.json
npm install

# Prisma version mismatch
npm install @prisma/client@latest prisma@latest

# React Native dependency issues
npx expo install --fix
```

**TypeScript error handling**:

```bash
# Check type errors
npx tsc --noEmit

# Re-verify after fixes
npx tsc --noEmit
```

**Directory structure check**:

Ensure following required files/directories exist:

```
artifacts/backend/
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── index.ts
│   ├── lib/
│   └── routes/
└── vitest.config.ts

artifacts/client/
├── package.json
├── tsconfig.json
├── app.json
└── src/
```

### Issue 11: Validation Stage Failure

**Symptoms**:

- Validation report incomplete
- Too many critical issues (error count > 10)
- Security issues (hardcoded keys detected)

**Cause**: Poor Code stage quality or security issues.

**Handling process**:

```
1. Parse report.md to confirm all sections exist
2. Count critical issues
3. If critical issues > 10, recommend rollback to Code stage
4. Check security scan results
```

**Manual fix**:

1. **View validation report**:

```bash
cat artifacts/validation/report.md
```

2. **Fix critical issues**: Fix each item according to the report

3. **Rollback to Code stage** (if too many issues):

```bash
factory run code  # Restart from Code stage
```

### Issue 12: Preview Stage Failure

**Symptoms**:

- README incomplete (missing installation steps)
- Docker build failure
- Deployment configuration missing

**Cause**: Missing content or configuration issues.

**Handling process**:

```
1. Check README.md includes all required sections
2. Try docker build to verify Dockerfile
3. Check if deployment configuration files exist
```

**Manual fix**:

1. **Verify Docker configuration**:

```bash
cd artifacts/preview/
docker build -t my-app .
```

2. **Check deployment files**:

Ensure following files exist:

```
artifacts/preview/
├── README.md
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/ci.yml  # CI/CD config
```

---

## Permission Violation Handling

### Issue 13: Agent Unauthorized Write

**Symptoms**:

```bash
Error: Unauthorized write to <path>
Artifacts moved to: artifacts/_untrusted/<stage-id>/
Pipeline paused. Manual intervention required.
```

**Cause**: Agent wrote to unauthorized directory or file.

**Solution**:

1. **Check unauthorized files**:

```bash
ls -la artifacts/_untrusted/<stage-id>/
```

2. **Review permission matrix**: Confirm that Agent's writable scope

3. **Choose handling approach**:

   - **Option A: Correct Agent behavior** (recommended)

   In AI assistant, explicitly point out the permission issue and request correction.

   - **Option B: Move files to correct location** (caution)

   If you're confident the files should exist, manually move:

   ```bash
   mv artifacts/_untrusted/<stage-id>/<file> artifacts/<target-stage>/
   ```

   - **Option C: Adjust permission matrix** (advanced)

   Modify `.factory/policies/capability.matrix.md`, add write permission for that Agent.

4. **Continue execution**:

```bash
factory continue
```

**Example scenarios**:

- Code Agent tries to modify `artifacts/prd/prd.md` (violating responsibility boundaries)
- UI Agent tries to create `artifacts/backend/` directory (beyond permission scope)
- Tech Agent tries to write to `artifacts/ui/` directory (overreaching)

---

## Cross-Session Execution Issues

### Issue 14: Token Shortage or Context Accumulation

**Symptoms**:

- AI responses slow down
- Too long context causing degraded model performance
- Excessive token consumption

**Cause**: Too much conversation history accumulated in same session.

**Solution: Use `factory continue`**

The `factory continue` command allows you to:

1. **Save current state** to `.factory/state.json`
2. **Launch new Claude Code window**
3. **Continue execution from current stage**

**Execution steps**:

1. **Check current status**:

```bash
factory status
```

Sample output:

```bash
Pipeline Status:
───────────────────────────────────────
Project: my-app
Status: Waiting
Current Stage: tech
Completed: bootstrap, prd, ui
```

2. **Continue in new session**:

```bash
factory continue
```

**Effects**:

- Each stage has clean context
- Avoid token accumulation
- Support interrupt and resume

**Manual start new session** (if `factory continue` fails):

```bash
# Regenerate permission config
claude "Please regenerate .claude/settings.local.json, allow Read/Write/Glob/Bash operations"

# Manual start new session
claude "Please continue pipeline execution, current stage is tech"
```

---

## Environment and Permission Issues

### Issue 15: Node.js Version Too Low

**Symptoms**:

```bash
Error: Node.js version must be >= 16.0.0
```

**Cause**: Node.js version doesn't meet requirements.

**Solution**:

1. **Check version**:

```bash
node --version
```

2. **Upgrade Node.js**:

```bash
# macOS
brew install node@18
brew link --overwrite node@18

# Linux (use nvm)
nvm install 18
nvm use 18

# Windows (download from official website)
# https://nodejs.org/
```

### Issue 16: Claude Code Permission Issues

**Symptoms**:

- AI prompts "no read/write permissions"
- AI cannot access `.factory/` directory

**Cause**: `.claude/settings.local.json` permission configuration incorrect.

**Solution**:

1. **Check permission file**:

```bash
cat .claude/settings.local.json
```

2. **Regenerate permissions**:

```bash
factory continue  # Auto regenerate
```

Or manually run:

```bash
node -e "
const { generateClaudeSettings } = require('./cli/utils/claude-settings');
generateClaudeSettings(process.cwd());
"
```

3. **Correct permission config example**:

```json
{
  "allowedCommands": ["npm", "npx", "node", "git"],
  "allowedPaths": [
    "/absolute/path/to/project/.factory",
    "/absolute/path/to/project/artifacts",
    "/absolute/path/to/project/input",
    "/absolute/path/to/project/node_modules"
  ]
}
```

### Issue 17: Network Issues Causing Dependency Installation Failures

**Symptoms**:

```bash
Error: Network request failed
npm ERR! code ECONNREFUSED
```

**Cause**: Network connection issues or npm registry access failure.

**Solution**:

1. **Check network connection**:

```bash
ping registry.npmjs.org
```

2. **Switch npm registry**:

```bash
# Use Taobao mirror
npm config set registry https://registry.npmmirror.com

# Verify
npm config get registry
```

3. **Reinstall dependencies**:

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Manual Intervention Decision Tree

```
Stage Failed
    │
    ▼
Is it first failure?
    ├─ Yes → Auto retry
    │         │
    │         ▼
    │     Retry success? → Yes → Continue
    │            │
    │            No → Second failure
    │
    └─ No → Analyze failure cause
              │
              ▼
          Is input issue?
              ├─ Yes → Modify input file
              │         └─ Rollback to upstream Stage
              │
              └─ No → Request manual intervention
```

**Decision points**:

- **First failure**: Allow automatic retry, observe if error disappears
- **Second failure**: Stop automatic handling, need manual review
- **Input issue**: Modify `input/idea.md` or upstream artifacts
- **Technical issue**: Check dependencies, configuration, or code logic
- **Permission issue**: Review permission matrix or Agent behavior

---

## Common Pitfalls

### ❌ Common Mistakes

1. **Directly modifying upstream artifacts**

   Wrong: Modifying `input/idea.md` during PRD stage
   
   Right: Rollback to Bootstrap stage

2. **Ignoring checkpoint confirmations**

   Wrong: Quickly skipping all checkpoints
   
   Right: Carefully check if each stage's artifacts meet expectations

3. **Manually deleting failed artifacts**

   Wrong: Deleting `_failed/` directory
   
   Right: Keep failed artifacts for comparative analysis

4. **Not regenerating permissions after modifications**

   Wrong: Not updating `.claude/settings.local.json` after modifying project structure
   
   Right: Run `factory continue` to auto update permissions

### ✅ Best Practices

1. **Fail fast**: Discover issues early, avoid wasting time in later stages

2. **Detailed logs**: Keep complete error logs for troubleshooting

3. **Atomic operations**: Each stage's output should be atomic for easy rollback

4. **Preserve evidence**: Archive failed artifacts before retry for comparative analysis

5. **Progressive retry**: Provide more specific guidance on retry, not just simple repetition

---

## Summary

This course covered various common issues during AI App Factory usage:

| Category | Issue Count | Core Solution |
|----------|------------|----------------|
| Initialization | 3 | Clean directory, install AI assistant, manual startup |
| Pipeline execution | 2 | Confirm project structure, check config files |
| Stage failures | 7 | Retry, rollback, re-execute after fixes |
| Permission handling | 1 | Review permission matrix, move files or adjust permissions |
| Cross-session execution | 1 | Use `factory continue` to start new session |
| Environment permissions | 3 | Upgrade Node.js, regenerate permissions, switch npm registry |

**Key takeaways**:

- Each stage allows **one automatic retry**
- After two consecutive failures, **manual intervention required**
- Failed artifacts automatically archived to `_failed/`
- Unauthorized files moved to `_untrusted/`
- Use `factory continue` to save tokens

**Remember**:

Don't panic when encountering problems. First check error logs, then check corresponding artifacts directories, and reference this course's solutions for step-by-step troubleshooting. Most issues can be resolved through retry, rollback, or fixing input files.

## Next Up

> In the next lesson, we'll learn **[Best Practices](../best-practices/)**.
>
> You will learn:
> - How to provide clear product descriptions
> - How to leverage the checkpoint mechanism
> - How to control project scope
> - How to progressively iterate and optimize

**Related reading**:

- [Failure Handling and Rollback](../../advanced/failure-handling/) - Deep dive into failure handling strategies
- [Permissions and Security Mechanism](../../advanced/security-permissions/) - Understand capability boundary matrix
- [Context Optimization](../../advanced/context-optimization/) - Tips for saving tokens

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Function | File Path | Lines |
|----------|-----------|-------|
| Initialization directory check | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 32-53 |
| AI assistant startup | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| Failure strategy definition | [`policies/failure.policy.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/failure.policy.md) | 1-276 |
| Error code specification | [`policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |
| Capability boundary matrix | [`policies/capability.matrix.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/capability.matrix.md) | 1-23 |
| Pipeline configuration | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | Full file |
| Scheduler core | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | 1-301 |
| Continue command | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | 1-144 |

**Key constants**:
- Allowed Must Have feature count: ≤ 7
- Allowed UI page count: ≤ 8
- Allowed data model count: ≤ 10
- Retry count: Each stage allows one retry

**Key functions**:
- `isFactoryProject(dir)` - Check if it's a Factory project
- `isDirectorySafeToInit(dir)` - Check if directory is safe to initialize
- `generateClaudeSettings(projectDir)` - Generate Claude Code permission configuration
- `factory continue` - Continue pipeline execution in new session

</details>
