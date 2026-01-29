---
title: "Custom Rules: Project-Specific Standards | Claude Code"
sidebarTitle: "Custom Rules"
subtitle: "Custom Rules: Build Project-Specific Standards"
description: "Learn to create custom Rules files for project-specific coding standards. Covers Rule formats, checklists, security rules, and Git workflow integration."
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "/start/quick-start"
order: 130
---

# Custom Rules: Build Project-Specific Standards

## What You'll Learn

- Create custom Rules files to define project-specific coding standards
- Use checklists to ensure code quality consistency
- Integrate team standards into the Claude Code workflow
- Customize different types of rules based on project requirements

## Your Current Challenges

You might encounter these problems:

- Inconsistent code styles among team members, with the same issues repeatedly pointed out during reviews
- Projects have special security requirements that Claude doesn't understand
- Need to manually check if team standards are followed every time you write code
- Want Claude to automatically remind you of certain project-specific best practices

## When to Use This Approach

- **When initializing new projects** - Define project-specific coding standards and security requirements
- **When collaborating in teams** - Unify code style and quality standards
- **After frequent code review issues** - Solidify common problems into rules
- **When projects have special needs** - Integrate industry standards or tech stack-specific rules

## Core Concepts

Rules are the enforcement layer for project standards, making Claude automatically follow the standards you define.

### How Rules Work

Rules files are located in the `rules/` directory. Claude Code automatically loads all rules at the start of a session. Whenever generating code or performing reviews, Claude checks against these rules.

::: info Difference Between Rules and Skills

- **Rules**: Mandatory checklists that apply to all operations (e.g., security checks, code style)
- **Skills**: Workflow definitions and domain knowledge for specific tasks (e.g., TDD process, architecture design)

Rules are "must-follow" constraints, while Skills are "how-to" guides.
:::

### Rule File Structure

Each Rule file follows a standard format:

```markdown
# Rule Title

## Rule Category
Rule description text...

### Checklist
- [ ] Check item 1
- [ ] Check item 2

### Code Example
Correct/incorrect code comparison...
```

## Follow Along

### Step 1: Understand Built-in Rule Types

Everything Claude Code provides 8 built-in rule sets. First, understand their functions.

**Why**

Understanding built-in rules helps you determine what needs to be customized and avoid reinventing the wheel.

**View Built-in Rules**

Check them in the source code's `rules/` directory:

```bash
ls rules/
```

You'll see these 8 rule files:

| Rule File | Purpose | Applicable Scenarios |
|-----------|---------|---------------------|
| `security.md` | Security checks | API keys, user input, database operations |
| `coding-style.md` | Code style | Function size, file organization, immutability patterns |
| `testing.md` | Testing requirements | Test coverage, TDD workflow, test types |
| `performance.md` | Performance optimization | Model selection, context management, compression strategies |
| `agents.md` | Agent usage | When to use which agent, parallel execution |
| `git-workflow.md` | Git workflow | Commit format, PR process, branch management |
| `patterns.md` | Design patterns | Repository pattern, API response format, skeleton projects |
| `hooks.md` | Hooks system | Hook types, automatic permission acceptance, TodoWrite |

**You should see**:
- Each rule file has a clear title and category
- Rules include checklists and code examples
- Rules apply to specific scenarios and technical requirements

### Step 2: Create Custom Rule Files

Create new rule files in the project's `rules/` directory.

**Why**

Custom rules can solve project-specific problems and make Claude follow team standards.

**Create Rule File**

Assume your project uses Next.js and Tailwind CSS, and you need to define frontend component standards:

```bash
# Create rule file
touch rules/frontend-conventions.md
```

**Edit Rule File**

Open `rules/frontend-conventions.md` and add the following content:

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**You should see**:
- Rule file uses standard Markdown format
- Clear headings and categories (##)
- Code example comparisons (CORRECT vs WRONG)
- Checklist (checkboxes)
- Rule descriptions are concise and clear

### Step 3: Define Security-Related Custom Rules

If your project has special security requirements, create dedicated security rules.

**Why**

The built-in `security.md` includes general security checks, but your project might have specific security needs.

**Create Project Security Rules**

Create `rules/project-security.md`:

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**You should see**:
- Rules target project-specific tech stack (JWT, Zod)
- Code examples show correct and incorrect implementations
- Checklist covers all security check items

### Step 4: Define Project-Specific Git Workflow Rules

If the team has special Git commit standards, you can extend `git-workflow.md` or create custom rules.

**Why**

The built-in `git-workflow.md` includes basic commit formats, but teams might have additional requirements.

**Create Git Rules**

Create `rules/team-git-workflow.md`:

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: <type>(<scope>): <description>

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist
Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**You should see**:
- Git commit format includes team-customized types (`team`)
- Commit scope is required
- PR has clear checklists
- Rules apply to team collaboration workflow

### Step 5: Verify Rules Loading

After creating rules, verify that Claude Code loads them correctly.

**Why**

Ensure rule file formats are correct and Claude can read and apply rules.

**Verification Method**

1. Start a new Claude Code session
2. Ask Claude to check loaded rules:
   ```
   Which Rules files are loaded?
   ```

3. Test if rules take effect:
   ```
   Create a React component following the frontend-conventions rules
   ```

**You should see**:
- Claude lists all loaded rules (including custom rules)
- Generated code follows the standards you defined
- If rules are violated, Claude prompts for corrections

### Step 6: Integrate into Code Review Process

Automatically apply custom rules during code reviews.

**Why**

Automatically apply rules during code reviews to ensure all code meets standards.

**Configure code-reviewer to Reference Rules**

Ensure `agents/code-reviewer.md` references relevant rules:

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**You should see**:
- code-reviewer agent checks all relevant rules during reviews
- Reports categorized by severity
- Project-specific standards are included in the review process

## Checklist ✅

- [ ] Created at least one custom rule file
- [ ] Rule files follow standard format (title, category, code examples, checklist)
- [ ] Rules include correct/incorrect code comparison examples
- [ ] Rule files are located in `rules/` directory
- [ ] Verified Claude Code loads rules correctly
- [ ] code-reviewer agent references custom rules

## Common Pitfalls

### ❌ Common Error 1: Non-standard Rule File Naming

**Problem**: Rule file names contain spaces or special characters, causing Claude to fail loading.

**Fix**:
- ✅ Correct: `frontend-conventions.md`, `project-security.md`
- ❌ Incorrect: `Frontend Conventions.md`, `project-security(v2).md`

Use lowercase letters and hyphens. Avoid spaces and parentheses.

### ❌ Common Error 2: Rules Too Broad

**Problem**: Rule descriptions are vague, making it impossible to clearly determine compliance.

**Fix**: Provide specific checklists and code examples:

```markdown
❌ Vague rule: Components should be concise and readable

✅ Specific rule:
- Components must be <300 lines
- Functions must be <50 lines
- No more than 4 levels of nesting
```

### ❌ Common Error 3: Missing Code Examples

**Problem**: Only text descriptions, no correct/incorrect implementation examples.

**Fix**: Always include code example comparisons:

```markdown
CORRECT: Following conventions
function example() { ... }

WRONG: Violating conventions
function example() { ... }
```

### ❌ Common Error 4: Incomplete Checklist

**Problem**: Checklist misses key check items, preventing comprehensive rule enforcement.

**Fix**: Cover all aspects described in the rules:

```markdown
Checklist:
- [ ] Check item 1
- [ ] Check item 2
- [ ] ... (cover all rule points)
```

## Summary

Custom Rules are key to project standardization:

1. **Understand built-in rules** - 8 standard rules cover common scenarios
2. **Create rule files** - Use standard Markdown format
3. **Define project standards** - Customize based on tech stack and team needs
4. **Verify loading** - Ensure Claude reads rules correctly
5. **Integrate review process** - Let code-reviewer automatically check rules

Through custom Rules, you can make Claude automatically follow project standards, reduce code review workload, and improve code quality consistency.

## Coming Up Next

> In the next lesson, we'll learn **[Dynamic Context Injection: Using Contexts](../dynamic-contexts/)**.
>
> You'll learn:
> - Definition and purpose of Contexts
> - How to create custom Contexts
> - Switching Contexts in different work modes
> - Differences between Contexts and Rules

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-25

| Feature | File Path | Lines |
| -------------- | ------------------------------------------------------------------------------------------ | ------- |
| Security Rules | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Code Style Rules | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Testing Rules | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Performance Rules | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Agent Rules | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Git Workflow Rules | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Pattern Rules | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks Rules | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |
| Code Reviewer | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200 |

**Key Constants**:
- `MIN_TEST_COVERAGE = 80`: Minimum test coverage requirement
- `MAX_FILE_SIZE = 800`: Maximum file line limit
- `MAX_FUNCTION_SIZE = 50`: Maximum function line limit
- `MAX_NESTING_LEVEL = 4`: Maximum nesting level

**Key Rules**:
- **Immutability (CRITICAL)**: Prohibit direct object modification, use spread operator
- **Secret Management**: Prohibit hardcoded secrets, use environment variables
- **TDD Workflow**: Require writing tests first, then implementing, then refactoring
- **Model Selection**: Choose Haiku/Sonnet/Opus based on task complexity

</details>
