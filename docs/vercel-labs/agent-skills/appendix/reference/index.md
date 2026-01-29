---
title: "API Reference: Commands | Agent Skills"
sidebarTitle: "API Reference"
subtitle: "API Reference: Commands"
description: "View Agent Skills API reference including commands, type definitions, and build toolchain configurations."
tags:
  - "Reference"
  - "API"
  - "Command Line"
  - "Type Definitions"
order: 120
prerequisite: []
---

# API and Commands Reference

This page provides a complete API and commands reference for Agent Skills, including build toolchain commands, TypeScript type definitions, SKILL.md template format, and impact level enum values.

## TypeScript Type Definitions

### ImpactLevel

Impact levels identify the performance impact of rules, with 6 levels:

| Value | Description | Use Cases |
| --- | --- | --- |
| `CRITICAL` | Critical bottleneck | Must fix, severely impacts user experience (e.g., waterfall requests, unoptimized bundle size) |
| `HIGH` | Significant improvement | Major performance gains (e.g., server-side caching, duplicate props elimination) |
| `MEDIUM-HIGH` | Medium-high priority | Noticeable performance gains (e.g., data fetching optimization) |
| `MEDIUM` | Medium improvement | Measurable performance gains (e.g., Memo optimization, reduced Re-render) |
| `LOW-MEDIUM` | Low-medium priority | Minor performance gains (e.g., rendering optimization) |
| `LOW` | Incremental improvement | Micro-optimizations (e.g., code style, advanced patterns) |

**Source location**: `types.ts:5`

### CodeExample

Structure of code examples in rules:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | string | ✅ | Example label (e.g., "Incorrect", "Correct") |
| `description` | string | ❌ | Label description (optional) |
| `code` | string | ✅ | Code content |
| `language` | string | ❌ | Code language (default 'typescript') |
| `additionalText` | string | ❌ | Supplementary notes (optional) |

**Source location**: `types.ts:7-13`

### Rule

Complete structure of a single performance optimization rule:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | string | ✅ | Rule ID (auto-generated, e.g., "1.1", "2.3") |
| `title` | string | ✅ | Rule title |
| `section` | number | ✅ | Associated section (1-8) |
| `subsection` | number | ❌ | Subsection number (auto-generated) |
| `impact` | ImpactLevel | ✅ | Impact level |
| `impactDescription` | string | ❌ | Impact description (e.g., "2-10× improvement") |
| `explanation` | string | ✅ | Rule explanation |
| `examples` | CodeExample[] | ✅ | Array of code examples (minimum 1) |
| `references` | string[] | ❌ | Reference links |
| `tags` | string[] | ❌ | Tags (for search) |

**Source location**: `types.ts:15-26`

### Section

Rule section structure:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `number` | number | ✅ | Section number (1-8) |
| `title` | string | ✅ | Section title |
| `impact` | ImpactLevel | ✅ | Overall impact level |
| `impactDescription` | string | ❌ | Impact description |
| `introduction` | string | ❌ | Section introduction |
| `rules` | Rule[] | ✅ | Array of included rules |

**Source location**: `types.ts:28-35`

### GuidelinesDocument

Complete guideline document structure:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `version` | string | ✅ | Version number |
| `organization` | string | ✅ | Organization name |
| `date` | string | ✅ | Date |
| `abstract` | string | ✅ | Abstract |
| `sections` | Section[] | ✅ | Array of sections |
| `references` | string[] | ❌ | References |

**Source location**: `types.ts:37-44`

### TestCase

Test case structure extracted from rules:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `ruleId` | string | ✅ | Rule ID |
| `ruleTitle` | string | ✅ | Rule title |
| `type` | 'bad' \| 'good' | ✅ | Test case type |
| `code` | string | ✅ | Code content |
| `language` | string | ✅ | Code language |
| `description` | string | ❌ | Description |

**Source location**: `types.ts:46-53`

## Build Toolchain Commands

### pnpm build

Build rule documentation and extract test cases.

**Command**:
```bash
pnpm build
```

**Functionality**:
1. Parse all rule files (`rules/*.md`)
2. Group and sort by section
3. Generate `AGENTS.md` complete guide
4. Extract test cases to `test-cases.json`

**Output**:
```bash
Processed 57 rules
Generated AGENTS.md
Extracted 114 test cases
```

**Source location**: `build.ts`

### pnpm build --upgrade-version

Build and automatically upgrade version number.

**Command**:
```bash
pnpm build --upgrade-version
```

**Functionality**:
1. Execute all operations of `pnpm build`
2. Automatically increment version number in `metadata.json`
   - Format: `0.1.0` → `0.1.1`
   - Increment the last digit

**Source location**: `build.ts:19-24, 255-273`

### pnpm validate

Validate all rule files for format and completeness.

**Command**:
```bash
pnpm validate
```

**Checks**:
- ✅ Rule title is not empty
- ✅ Rule explanation is not empty
- ✅ Contains at least one code example
- ✅ Includes Bad/Incorrect and Good/Correct examples
- ✅ Impact level is valid (CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW)

**Success output**:
```bash
✓ All 57 rules are valid
```

**Failure output**:
```bash
✗ Validation failed

✖ [async-parallel.md]: Missing or empty title
   rules/async-parallel.md:2

2 errors found
```

**Source location**: `validate.ts`

### pnpm extract-tests

Extract test cases from rules.

**Command**:
```bash
pnpm extract-tests
```

**Functionality**:
1. Read all rule files
2. Extract `Bad/Incorrect` and `Good/Correct` examples
3. Generate `test-cases.json` file

**Output**:
```bash
Extracted 114 test cases (57 bad, 57 good)
```

**Source location**: `extract-tests.ts`

### pnpm dev

Development workflow (build + validate).

**Command**:
```bash
pnpm dev
```

**Functionality**:
1. Execute `pnpm build`
2. Execute `pnpm validate`
3. Ensure rule format is correct during development

**Use cases**:
- Validate after writing new rules
- Check completeness after modifying rules

**Source location**: `package.json:12`

## SKILL.md Template

### Claude.ai Skill Definition Template

Each Claude.ai Skill must include a `SKILL.md` file:

```markdown
---
name: {skill-name}
description: {One sentence describing when to use this skill. Include trigger phrases like "Deploy my app", "Check logs", etc.}
---

# {Skill Title}

{Brief description of what the skill does.}

## How It Works

{Numbered list explaining the skill's workflow}

## Usage

```bash
bash /mnt/skills/user/{skill-name}/scripts/{script}.sh [args]
```

**Arguments:**
- `arg1` - Description (defaults to X)

**Examples:**
{Show 2-3 common usage patterns}

## Output

{Show example output users will see}

## Present Results to User

{Template for how Claude should format results when presenting to users}

## Troubleshooting

{Common issues and solutions, especially network/permissions errors}
```

**Source location**: `AGENTS.md:29-69`

### Required Fields

| Field | Description | Example |
| --- | --- | --- |
| `name` | Skill name (directory name) | `vercel-deploy` |
| `description` | One-sentence description with trigger phrases | `Deploy applications to Vercel when user requests "Deploy my app"` |
| `title` | Skill title | `Vercel Deploy` |
| `How It Works` | Workflow explanation | Numbered list, explaining 4-6 steps |
| `Usage` | Usage method | Includes command line examples and parameter descriptions |
| `Output` | Output example | Shows the output results users will see |
| `Present Results to User` | Result formatting template | Standard format for Claude to present results |

**Source location**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md`

## Impact Level Mapping Rules

### Rule Filename Prefix → Section → Level

| File Prefix | Section Number | Section Title | Default Level |
| --- | --- | --- | --- |
| `async-` | 1 | Eliminate Waterfalls | CRITICAL |
| `bundle-` | 2 | Bundle Optimization | CRITICAL |
| `server-` | 3 | Server Performance | HIGH |
| `client-` | 4 | Client Data Fetching | MEDIUM-HIGH |
| `rerender-` | 5 | Re-render Optimization | MEDIUM |
| `rendering-` | 6 | Rendering Performance | MEDIUM |
| `js-` | 7 | JavaScript Performance | LOW-MEDIUM |
| `advanced-` | 8 | Advanced Patterns | LOW |

### Sample Files

| Filename | Auto-inferred Section | Auto-inferred Level |
| --- | --- | --- |
| `async-parallel.md` | 1 (Eliminate Waterfalls) | CRITICAL |
| `bundle-dynamic-imports.md` | 2 (Bundle Optimization) | CRITICAL |
| `server-cache-react.md` | 3 (Server Performance) | HIGH |
| `rerender-memo.md` | 5 (Re-render Optimization) | MEDIUM |

**Source location**: `parser.ts:201-210`

## Deployment Commands Reference

### bash deploy.sh [path]

Vercel deployment script command.

**Command**:
```bash
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh [path]
```

**Parameters**:
- `path` - Deployment directory or `.tgz` file (default: current directory)

**Examples**:
```bash
# Deploy current directory
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh

# Deploy specific project
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project

# Deploy existing tarball
bash /mnt/skills/user/vercel-deploy/scripts/deploy.sh /path/to/project.tgz
```

**Output format**:
- **Human-readable** (stderr): Preview URL and ownership transfer link
- **JSON** (stdout): Structured data (includes deploymentId, projectId)

**Source location**: `skills/claude.ai/vercel-deploy-claimable/SKILL.md:20-65`

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
| ----------- | --------------------------------------------------------------------------------------------- | ----- |
| ImpactLevel type | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L5) | 5     |
| CodeExample interface | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L7-L13) | 7-13  |
| Rule interface    | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L15-L26) | 15-26 |
| Section interface | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L28-L35) | 28-35 |
| GuidelinesDocument interface | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L37-L44) | 37-44 |
| TestCase interface | [`packages/react-best-practices-build/src/types.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/types.ts#L46-L53) | 46-53 |
| build.ts CLI arguments | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L12-L14) | 12-14 |
| Build script version upgrade logic | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts#L19-L24) | 19-24 |
| validate.ts validation logic | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts#L21-L66) | 21-66 |
| Rule template file  | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md) | Full file  |
| SKILL.md template format | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L31-L69) | 31-69 |
| Vercel Deploy SKILL | [`skills/claude.ai/vercel-deploy-claimable/SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | Full file  |
| File prefix mapping  | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts#L201-L210) | 201-210 |

**Key Constants**:
- `ImpactLevel` enum: `'CRITICAL' | 'HIGH' | 'MEDIUM-HIGH' | 'MEDIUM' | 'LOW-MEDIUM' | 'LOW'`

**Key Functions**:
- `incrementVersion(version: string)`: Increment version number (build.ts)
- `generateMarkdown(sections, metadata)`: Generate AGENTS.md (build.ts)
- `validateRule(rule, file)`: Validate rule completeness (validate.ts)

</details>
