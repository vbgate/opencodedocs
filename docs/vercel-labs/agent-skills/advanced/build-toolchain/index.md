---
title: "Build Toolchain: Validate, Build, CI | Agent Skills"
sidebarTitle: "Build Toolchain"
subtitle: "Build Toolchain: Validate, Build, CI"
description: "Learn Agent Skills build toolchain: validate rules, generate AGENTS.md, integrate CI, extract test cases."
tags:
  - "Build Tools"
  - "CI/CD"
  - "Automation"
  - "Code Validation"
order: 80
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# Build Toolchain Usage

## What You'll Learn

After completing this lesson, you will be able to:

- ✅ Use `pnpm validate` to validate the format and completeness of rule files
- ✅ Use `pnpm build` to generate AGENTS.md and test-cases.json
- ✅ Understand the build process: parse → validate → group → sort → generate
- ✅ Configure GitHub Actions CI for automatic validation and build
- ✅ Extract test cases for LLM automatic evaluation
- ✅ Use `pnpm dev` for rapid development workflow (build + validate)

## Your Current Challenges

If you're maintaining or extending the React rule library, you might have encountered these issues:

- ✗ After modifying rules, you forget to validate the format, causing errors in the generated AGENTS.md
- ✗ There are more and more rule files, making it too time-consuming to manually check each file's completeness
- ✗ You discover a rule is missing code examples only after committing, affecting PR review efficiency
- ✗ You want to automatically validate rules in CI but don't know how to configure GitHub Actions
- ✗ You're unclear about the `build.ts` build process, making it hard to troubleshoot errors when they occur

## When to Use This Approach

Use this when you need to:

- 🔍 **Validate rules**: Ensure all rule files comply with specifications before committing code
- 🏗️ **Generate documentation**: Generate structured AGENTS.md from Markdown rule files
- 🤖 **Extract test cases**: Prepare test data for LLM automatic evaluation
- 🔄 **Integrate CI**: Automate validation and build in GitHub Actions
- 🚀 **Rapid development**: Use `pnpm dev` for rapid iteration and rule validation

## 🎒 Prerequisites

Before starting, please confirm:

::: warning Prerequisite Checklist

- Completed [Agent Skills Getting Started](../../start/getting-started/)
- Installed Agent Skills and are familiar with basic usage
- Understand React rule writing conventions (recommended to first learn [Writing React Best Practices Rules](../rule-authoring/))
- Have basic command-line experience
- Understand basic usage of the pnpm package manager

:::

## Core Concept

**Purpose of the Build Toolchain**:

The Agent Skills rule library is essentially 57 independent Markdown files, but Claude needs a structured AGENTS.md to use them efficiently. The build toolchain is responsible for:

1. **Parse rule files**: Extract fields like title, impact, examples from Markdown
2. **Validate completeness**: Check that each rule has title, explanation, and code examples
3. **Group and sort**: Group by sections, sort alphabetically by title, assign IDs (1.1, 1.2...)
4. **Generate documentation**: Output formatted AGENTS.md and test-cases.json

**Build Process**:

```
rules/*.md (57 files)
    ↓
[parser.ts] Parse Markdown
    ↓
[validate.ts] Validate completeness
    ↓
[build.ts] Group → Sort → Generate AGENTS.md
    ↓
[extract-tests.ts] Extract test cases → test-cases.json
```

**Four Core Commands**:

| Command | Function | Use Case |
|---------|----------|----------|
| `pnpm validate` | Validate format and completeness of all rule files | Pre-commit check, CI validation |
| `pnpm build` | Generate AGENTS.md and test-cases.json | After rule modifications, before release |
| `pnpm dev` | Execute build + validate (development workflow) | Rapid iteration, developing new rules |
| `pnpm extract-tests` | Extract test cases separately (no rebuild) | Only updating test data |

---

## Follow Along: Using the Build Toolchain

### Step 1: Validate Rules (pnpm validate)

**Why**
When developing or modifying rules, first ensure all rule files comply with specifications to avoid discovering errors during build.

Navigate to the build tool directory:

```bash
cd packages/react-best-practices-build
```

Run the validation command:

```bash
pnpm validate
```

**What you should see**:

```bash
Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**If there are errors**:

```bash
✗ Validation failed:

  async-parallel.md: Missing or empty title
  bundle-dynamic-imports.md: Missing code examples
  rerender-memo.md: Invalid impact level: SUPER_HIGH
```

**Validation content** (source: `validate.ts`):

- ✅ title is not empty
- ✅ explanation is not empty
- ✅ At least one code example included
- ✅ Contains at least one "Incorrect/bad" or "Correct/good" example
- ✅ impact level is valid (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

### Step 2: Build Documentation (pnpm build)

**Why**
Generate AGENTS.md and test-cases.json for Claude from rule files.

Run the build command:

```bash
pnpm build
```

**What you should see**:

```bash
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules
```

**Generated files**:

1. **AGENTS.md** (located at `skills/react-best-practices/AGENTS.md`)
   - Structured React performance optimization guide
   - Contains 8 sections, 57 rules
   - Sorted by impact level (CRITICAL → HIGH → MEDIUM...)

2. **test-cases.json** (located at `packages/react-best-practices-build/test-cases.json`)
   - Test cases extracted from all rules
   - Contains bad and good examples
   - Used for LLM automatic evaluation

**AGENTS.md structure example**:

```markdown
# React Best Practices

Version 1.0
Vercel Engineering
January 2026

---

## Abstract

Performance optimization guide for React and Next.js applications, ordered by impact.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 [Parallel async operations](#11-parallel-async-operations)
   - 1.2 [Deferring non-critical async operations](#12-deferring-non-critical-async-outputs)

2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 [Dynamic imports for large components](#21-dynamic-imports-for-large-components)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Eliminating request waterfalls is the most impactful performance optimization you can make in React and Next.js applications.

### 1.1 Parallel async operations

**Impact: CRITICAL**

...

**Incorrect:**

```typescript
// Sequential fetching creates waterfalls
const userData = await fetch('/api/user').then(r => r.json())
const postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())
```

**Correct:**

```typescript
// Fetch in parallel
const [userData, postsData] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
])
```
```

**test-cases.json structure example**:

```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "bad",
    "code": "// Sequential fetching creates waterfalls\nconst userData = await fetch('/api/user').then(r => r.json())\nconst postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())",
    "language": "typescript",
    "description": "Incorrect example for Parallel async operations"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "good",
    "code": "// Fetch in parallel\nconst [userData, postsData] = await Promise.all([\n  fetch('/api/user').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json())\n])",
    "language": "typescript",
    "description": "Correct example for Parallel async operations"
  }
]
```

### Step 3: Development Workflow (pnpm dev)

**Why**
When developing new rules or modifying existing ones, you need to rapidly iterate, validate, and build the entire process.

Run the development command:

```bash
pnpm dev
```

**This command will**:

1. Execute `pnpm build-agents` (generate AGENTS.md)
2. Execute `pnpm extract-tests` (generate test-cases.json)
3. Execute `pnpm validate` (validate all rules)

**What you should see**:

```bash
pnpm build-agents && pnpm extract-tests
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules

Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57

Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**Development workflow recommended**:

```bash
# 1. Modify or create rule file
vim skills/react-best-practices/rules/my-new-rule.md

# 2. Run pnpm dev for rapid validation and build
cd packages/react-best-practices-build
pnpm dev

# 3. Check generated AGENTS.md
cat ../skills/react-best-practices/AGENTS.md

# 4. Test whether Claude correctly uses the new rule
# (Activate skill in Claude Code and test)
```

**Upgrade version number** (optional):

```bash
pnpm build --upgrade-version
```

This will automatically:
- Increment the version number in `metadata.json` (e.g., 1.0 → 1.1)
- Update the version field in SKILL.md Front Matter

**What you should see**:

```bash
Upgrading version: 1.0 -> 1.1
✓ Updated metadata.json
✓ Updated SKILL.md
```

### Step 4: Extract Test Cases Separately (pnpm extract-tests)

**Why**
If you only updated the test data extraction logic and don't need to rebuild AGENTS.md, you can run `extract-tests` separately.

```bash
pnpm extract-tests
```

**What you should see**:

```bash
Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57
```

---

## Checkpoint ✅

Now check if you understand the build toolchain:

- [ ] Know what fields `pnpm validate` validates for rules
- [ ] Know what files `pnpm build` generates
- [ ] Know the development workflow of `pnpm dev`
- [ ] Know the purpose of test-cases.json
- [ ] Know how to upgrade version number (`--upgrade-version`)
- [ ] Know the structure of AGENTS.md (sections → rules → examples)

---

## GitHub Actions CI Integration

### Why You Need CI

In team collaboration, CI can:
- ✅ Automatically validate rule file format
- ✅ Automatically build AGENTS.md
- ✅ Prevent committing code that doesn't comply with specifications

### CI Configuration File

GitHub Actions configuration is located at `.github/workflows/react-best-practices-ci.yml`:

```yaml
name: React Best Practices CI

on:
  push:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'
  pull_request:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/react-best-practices-build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.24.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: packages/react-best-practices-build/pnpm-lock.yaml
      - run: pnpm install
      - run: pnpm validate
      - run: pnpm build
```

### CI Trigger Conditions

CI automatically runs under the following conditions:

| Event | Condition |
|------|----------|
| `push` | Commit to `main` branch, and modified `skills/react-best-practices/**` or `packages/react-best-practices-build/**` |
| `pull_request` | Create or update PR to `main` branch, and modified the above paths |

### CI Execution Steps

1. **Checkout code**: `actions/checkout@v4`
2. **Install pnpm**: `pnpm/action-setup@v2` (version 10.24.0)
3. **Install Node.js**: `actions/setup-node@v4` (version 20)
4. **Install dependencies**: `pnpm install` (using pnpm cache to speed up)
5. **Validate rules**: `pnpm validate`
6. **Build documentation**: `pnpm build`

If any step fails, CI will mark it as ❌ and block merging.

---

## Common Pitfalls

### Pitfall 1: Validation Passes but Build Fails

**Symptom**: `pnpm validate` passes, but `pnpm build` reports an error.

**Reason**: Validation only checks rule file format, not _sections.md or metadata.json.

**Solution**：
```bash
# Check if _sections.md exists
ls skills/react-best-practices/rules/_sections.md

# Check if metadata.json exists
ls skills/react-best-practices/metadata.json

# View specific errors in build log
pnpm build 2>&1 | grep -i error
```

### Pitfall 2: Rule IDs Are Not Consecutive

**Symptom**: Rule IDs in generated AGENTS.md skip numbers (e.g., 1.1, 1.3, 1.5).

**Reason**: Rules are sorted alphabetically by title, not by filename.

**Solution**：
```bash
# Build automatically sorts by title and assigns IDs
# If you need custom order, modify rule title
# For example: change to "A. Parallel" (A prefix will sort earlier)
pnpm build
```

### Pitfall 3: test-cases.json Only Has bad Examples

**Symptom**: `pnpm extract-tests` outputs "Bad examples: 0".

**Reason**: Example labels in rule file don't comply with specifications.

**Solution**：
```markdown
# ❌ Error: Non-compliant labels
**Example:**

**Typo:**

# ✅ Correct: Use Incorrect or Correct
**Incorrect:**

**Correct:**

# Or use bad/good labels (also supports wrong, usage, etc.)
**Bad example:**

**Good example:**
```

### Pitfall 4: pnpm Validate Fails in CI

**Symptom**: Local `pnpm validate` passes, but CI fails.

**Reasons**:
- Node.js version mismatch (CI uses v20, local might use a different version)
- pnpm version mismatch (CI uses 10.24.0)
- Differences between Windows and Linux line endings

**Solution**：
```bash
# Check local Node version
node --version  # Should be v20.x

# Check local pnpm version
pnpm --version  # Should be >= 10.24.0

# Unify line endings (convert to LF)
git config core.autocrlf input
git add --renormalize .
git commit -m "Fix line endings"
```

### Pitfall 5: SKILL.md Not Updated After Upgrading Version Number

**Symptom**: After `pnpm build --upgrade-version`, `metadata.json` version changed but `SKILL.md` didn't.

**Reason**: Version format in SKILL.md Front Matter doesn't match.

**Solution**：
```yaml
# Check SKILL.md Front Matter
---
version: "1.0"  # ✅ Must have double quotes
---

# If version number has no quotes, manually add them
---
version: 1.0   # ❌ Error
version: "1.0" # ✅ Correct (with double quotes)
---
```

---

## Lesson Summary

**Key Points**:

1. **Validate**: Check rule format, completeness, impact level
2. **Build**: Parse rules → Group → Sort → Generate AGENTS.md
3. **Test extraction**: Extract bad/good examples from examples
4. **Development workflow**: `validate + build + extract-tests` for rapid iteration
5. **CI integration**: GitHub Actions automatically validates and builds, preventing erroneous code commits

**Development Workflow**:

```
Modify/create rules
    ↓
pnpm dev (validate + build + extract tests)
    ↓
Check AGENTS.md and test-cases.json
    ↓
Commit code → CI runs automatically
    ↓
PR review → Merge to main
```

**Best Practice Mnemonic**:

> Validate before changes, build before commit
> dev command covers all workflow, one step for efficiency
> CI automatically guards, PR review more relaxed
> Version number must upgrade, remember to change metadata

---

## Next Lesson Preview

> In the next lesson, we'll learn **[Troubleshooting Common Issues](../../faq/troubleshooting/)**.
>
> You'll learn:
> - Resolve deployment network errors (Network Egress Error)
> - Handle skills not activated issue
> - Troubleshoot rule validation failures (VALIDATION_ERROR)
> - Fix inaccurate framework detection issues
> - Resolve file permission problems

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Line Numbers |
| -------- | --------- | ------------ |
| package.json script definition | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json) | 6-12 |
| Build entry function | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts) | 131-290 |
| Rule parser | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts) | Full text |
| Rule validation function | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts) | 21-66 |
| Test case extraction | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38 |
| Path configuration | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts) | Full text |
| GitHub Actions CI | [`.github/workflows/react-best-practices-ci.yml`](https://github.com/vercel-labs/agent-skills/blob/main/.github/workflows/react-best-practices-ci.yml) | Full text |
| Rule file template | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Full text |

**Key Constants** (`config.ts`):
- `RULES_DIR`: Rule files directory path
- `METADATA_FILE`: Metadata file (metadata.json) path
- `OUTPUT_FILE`: AGENTS.md output path
- `TEST_CASES_FILE`: Test cases JSON output path

**Key Functions**:
- `build()`: Main build function, parse rules → group → sort → generate documentation
- `validateRule()`: Validate single rule completeness (title, explanation, examples, impact)
- `extractTestCases()`: Extract bad/good test cases from rule examples
- `generateMarkdown()`: Generate AGENTS.md content from Section array

**Validation Rules** (`validate.ts:21-66`):
- title is not empty
- explanation is not empty
- At least one code example included
- Contains at least one "Incorrect/bad" or "Correct/good" example
- impact level is valid

**CI Workflow**:
- Trigger conditions: push/PR to main, and modified `skills/react-best-practices/**` or `packages/react-best-practices-build/**`
- Execution steps: checkout → install pnpm → install Node.js → pnpm install → pnpm validate → pnpm build

</details>
