---
title: "Contributing: Submit Agents & Skills | Everything Claude Code"
sidebarTitle: "Contributing"
subtitle: "Contributing Guide: How to Contribute Configurations, Agents, and Skills to the Project"
description: "Learn to contribute Agents, Skills, Commands, and Hooks to Everything Claude Code. Master the workflow: Fork, branch, format, test, and submit quality PRs."
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "/affaan-m/everything-claude-code/start/installation"
  - "/affaan-m/everything-claude-code/start/quickstart"
order: 230
---

# Contributing Guide: How to Contribute Configurations, Agents, and Skills to the Project

## What You'll Learn

- Understand the project's contribution workflow and standards
- Correctly submit Agents, Skills, Commands, Hooks, Rules, and MCP configurations
- Follow code style and naming conventions
- Avoid common contribution mistakes
- Collaborate efficiently with the community through Pull Requests

## Your Current Challenges

You want to contribute to Everything Claude Code, but encounter these problems:
- "Don't know what content to contribute that has value"
- "Don't know how to start your first PR"
- "Unclear about file formats and naming conventions"
- "Worried that submitted content won't meet requirements"

This tutorial provides a complete contribution guide, from philosophy to practice.

## Core Philosophy

Everything Claude Code is a **community resource**, not a single person's project. The value of this repository lies in:

1. **Battle-Tested** - All configurations have been used in production for 10+ months
2. **Modular Design** - Each Agent, Skill, and Command is an independent, reusable component
3. **Quality First** - Code review and security audits ensure contribution quality
4. **Open Collaboration** - MIT license, encouraging contribution and customization

::: tip Why Contributing is Valuable
- **Knowledge Sharing**: Your experience can help other developers
- **Impact**: Configurations used by hundreds or thousands of people
- **Skill Growth**: Learn project structure and community collaboration
- **Network Building**: Connect with Anthropic and Claude Code communities
:::

## What We're Looking For

### Agents

Specialized sub-agents that handle complex tasks in specific domains:

| Type | Examples |
|--- | ---|
| Language Experts | Python, Go, Rust code review |
| Framework Experts | Django, Rails, Laravel, Spring |
| DevOps Experts | Kubernetes, Terraform, CI/CD |
| Domain Experts | ML pipelines, data engineering, mobile |

### Skills

Workflow definitions and domain knowledge bases:

| Type | Examples |
|--- | ---|
| Language Best Practices | Python, Go, Rust coding standards |
| Framework Patterns | Django, Rails, Laravel architecture patterns |
| Testing Strategies | Unit testing, integration testing, E2E testing |
| Architecture Guides | Microservices, event-driven, CQRS |
| Domain Knowledge | ML, data analysis, mobile development |

### Commands

Slash commands that provide quick workflow entry points:

| Type | Examples |
|--- | ---|
| Deployment Commands | Deploy to Vercel, Railway, AWS |
| Testing Commands | Run unit tests, E2E tests, coverage analysis |
| Documentation Commands | Generate API docs, update README |
| Code Generation Commands | Generate types, generate CRUD templates |

### Hooks

Automation hooks that trigger on specific events:

| Type | Examples |
|--- | ---|
| Linting/Formatting | Code formatting, lint checks |
| Security Checks | Sensitive data detection, vulnerability scanning |
| Validation Hooks | Git commit validation, PR checks |
| Notification Hooks | Slack/Email notifications |

### Rules

Mandatory rules that ensure code quality and security standards:

| Type | Examples |
|--- | ---|
| Security Rules | No hardcoded keys, OWASP checks |
| Code Style | Immutability patterns, file size limits |
| Testing Requirements | 80%+ coverage, TDD workflow |
| Naming Conventions | Variable naming, file naming |

### MCP Configurations

MCP server configurations that extend external service integrations:

| Type | Examples |
|--- | ---|
| Database Integrations | PostgreSQL, MongoDB, ClickHouse |
| Cloud Providers | AWS, GCP, Azure |
| Monitoring Tools | Datadog, New Relic, Sentry |
| Communication Tools | Slack, Discord, Email |

## How to Contribute

### Step 1: Fork the Project

**Why**: You need your own copy to make changes without affecting the original repository.

```bash
# 1. Visit https://github.com/affaan-m/everything-claude-code
# 2. Click the "Fork" button in the top right
# 3. Clone your fork
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. Add upstream repository (for easier synchronization later)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**You should see**: A local `everything-claude-code` directory containing complete project files.

### Step 2: Create a Feature Branch

**Why**: Branches isolate your changes, making them easier to manage and merge.

```bash
# Create a descriptive branch name
git checkout -b add-python-reviewer

# Or use more specific naming
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**Branch Naming Conventions**:
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Step 3: Add Your Contribution

**Why**: Place files in the correct directories to ensure Claude Code can load them properly.

```bash
# Choose directory based on contribution type
agents/           # New Agent
skills/           # New Skill (can be a single .md or a directory)
commands/         # New slash command
rules/            # New rule file
hooks/            # Hook configuration (modify hooks/hooks.json)
mcp-configs/      # MCP server configuration (modify mcp-configs/mcp-servers.json)
```

::: tip Directory Structure
- **Single File**: Place directly in the directory, e.g., `agents/python-reviewer.md`
- **Complex Component**: Create a subdirectory, e.g., `skills/coding-standards/` (contains multiple files)
:::

### Step 4: Follow Format Standards

#### Agent Format

**Why**: Front Matter defines Agent metadata, which Claude Code relies on to load Agents.

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**Required Fields**:
- `name`: Agent identifier (lowercase with hyphens)
- `description`: Functional description
- `tools`: List of allowed tools (comma-separated)
- `model`: Preferred model (`opus` or `sonnet`)

#### Skill Format

**Why**: Clear Skill definitions make them easier to reuse and understand.

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**Recommended Sections**:
- `When to Use`: Usage scenarios
- `How It Works`: How it works
- `Examples`: Examples (Good vs Bad)
- `References`: Related resources (optional)

#### Command Format

**Why**: Clear command descriptions help users understand functionality.

Front Matter (required):

```markdown
---
description: Run Python tests with coverage report
---
```

Body Content (optional):

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

Command Examples (optional):

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**Required Fields**:
- `description`: Brief functional description

#### Hook Format

**Why**: Hooks need clear matching rules and execution actions.

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**Required Fields**:
- `matcher`: Trigger condition expression
- `hooks`: Array of actions to execute
- `description`: Hook functionality description

### Step 5: Test Your Contribution

**Why**: Ensure configuration works correctly in actual usage.

::: warning Important
Before submitting a PR, **must** test your configuration in your local environment.
:::

**Testing Steps**:

```bash
# 1. Copy to your Claude Code configuration
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. Test in Claude Code
# Start Claude Code and use the new configuration

# 3. Verify functionality
# - Can the Agent be called correctly?
# - Can the Command execute correctly?
# - Can the Hook trigger at the right time?
```

**You should see**: Configuration works properly in Claude Code, with no errors or anomalies.

### Step 6: Submit a PR

**Why**: Pull Requests are the standard way to collaborate with the community.

```bash
# Add all changes
git add .

# Commit (use clear commit messages)
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# Push to your fork
git push origin add-python-reviewer
```

**Then create a PR on GitHub**:

1. Visit your fork repository
2. Click "Compare & pull request"
3. Fill in the PR template:

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**You should see**: PR created successfully, waiting for maintainer review.

## Guidelines

### Do (Should Do)

✅ **Keep configurations focused and modular**
- Each Agent/Skill does one thing
- Avoid mixing functionalities

✅ **Include clear descriptions**
- Accurate Front Matter descriptions
- Helpful code comments

✅ **Test before submitting**
- Verify configuration locally
- Ensure no errors

✅ **Follow existing patterns**
- Reference format of existing files
- Keep code style consistent

✅ **Document dependencies**
- List external dependencies
- Explain installation requirements

### Don't (Shouldn't Do)

❌ **Include sensitive data**
- API keys, tokens
- Hardcoded paths
- Personal credentials

❌ **Add overly complex or niche configurations**
- Prioritize versatility
- Avoid over-engineering

❌ **Submit untested configurations**
- Testing is mandatory
- Provide testing steps

❌ **Create duplicate functionality**
- Search for existing configurations
- Avoid reinventing the wheel

❌ **Add configurations that depend on specific paid services**
- Provide free alternatives
- Or use open source tools

## File Naming Conventions

**Why**: Unified naming conventions make the project easier to maintain.

### Naming Rules

| Rule | Example |
|--- | ---|
| Use lowercase | `python-reviewer.md` |
| Use hyphens as separators | `tdd-workflow.md` |
| Descriptive naming | `django-pattern-skill.md` |
| Avoid vague names | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### Matching Principle

Filenames should be consistent with Agent/Skill/Command names:

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip Naming Tips
- Use industry terminology (e.g., "PEP 8", "TDD", "REST")
- Avoid abbreviations (unless standard abbreviations)
- Keep it concise but descriptive
:::

## Contribution Checklist

Before submitting a PR, ensure the following conditions are met:

### Code Quality
- [ ] Follow existing code style
- [ ] Include necessary Front Matter
- [ ] Have clear descriptions and documentation
- [ ] Test locally

### File Standards
- [ ] Filename follows naming conventions
- [ ] Files are in the correct directory
- [ ] JSON format is correct (if applicable)
- [ ] No sensitive data

### PR Quality
- [ ] PR title clearly describes changes
- [ ] PR description includes "What", "Why", "How"
- [ ] Link related issues (if any)
- [ ] Provide testing steps

### Community Standards
- [ ] Ensure no duplicate functionality
- [ ] Provide alternatives (if involving paid services)
- [ ] Respond to review comments
- [ ] Maintain friendly and constructive discussion

## Frequently Asked Questions

### Q: How do I know what contributions have value?

**A**: Start from your own needs:
- What problems have you encountered recently?
- What solutions did you use?
- Can this solution be reused?

You can also check project Issues:
- Unresolved feature requests
- Enhancement suggestions
- Bug reports

### Q: Can contributions be rejected?

**A**: Possibly, but this is normal. Common reasons:
- Feature already exists
- Configuration doesn't meet standards
- Missing tests
- Security or privacy concerns

Maintainers will provide detailed feedback, and you can modify and resubmit based on the feedback.

### Q: How to track PR status?

**A**: 
1. Check status on GitHub PR page
2. Follow review comments
3. Respond to maintainer feedback
4. Update PR as needed

### Q: Can I contribute bug fixes?

**A**: Absolutely! Bug fixes are one of the most valuable contributions:
1. Search or create a new issue in Issues
2. Fork the project and fix the bug
3. Add tests (if needed)
4. Submit PR, referencing the issue in the description

### Q: How to keep fork in sync with upstream?

**A**:

```bash
# 1. Add upstream repository (if not already added)
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. Fetch upstream updates
git fetch upstream

# 3. Merge upstream updates to your main branch
git checkout main
git merge upstream/main

# 4. Push updates to your fork
git push origin main

# 5. Rebase your feature branch on the latest main
git checkout your-feature-branch
git rebase main
```

## Contact

If you have any questions or need help:

- **Open an Issue**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: Contact via GitHub

::: tip Asking Questions
- Search existing Issues and Discussions first
- Provide clear context and reproduction steps
- Stay polite and constructive
:::

## Lesson Summary

This lesson systematically covered the contribution workflow and standards for Everything Claude Code:

**Core Philosophy**:
- Community resource, built together
- Battle-tested, quality first
- Modular design, easy to reuse
- Open collaboration, knowledge sharing

**Contribution Types**:
- **Agents**: Specialized sub-agents (languages, frameworks, DevOps, domain experts)
- **Skills**: Workflow definitions and domain knowledge bases
- **Commands**: Slash commands (deployment, testing, documentation, code generation)
- **Hooks**: Automation hooks (linting, security checks, validation, notifications)
- **Rules**: Mandatory rules (security, code style, testing, naming)
- **MCP Configurations**: MCP server configurations (databases, cloud, monitoring, communication)

**Contribution Workflow**:
1. Fork project
2. Create feature branch
3. Add contribution content
4. Follow format standards
5. Local testing
6. Submit PR

**Format Standards**:
- Agent: Front Matter + Description + Instructions
- Skill: When to Use + How It Works + Examples
- Command: Description + Usage examples
- Hook: Matcher + Hooks + Description

**Guidelines**:
- **Do**: Focused, clear, tested, follow patterns, documented
- **Don't**: Sensitive data, complex niche, untested, duplicates, paid dependencies

**File Naming**:
- Lowercase + hyphens
- Descriptive naming
- Consistent with Agent/Skill/Command names

**Checklist**:
- Code quality, file standards, PR quality, community standards

## Next Lesson Preview

> In the next lesson, we'll learn **[Example Configurations: Project-Level and User-Level Configurations](../examples/)**.
>
> You'll learn:
> > - Best practices for project-level configurations
> > - Personalized user-level configuration settings
> > - How to customize configurations for specific projects
> > - Real-world project configuration examples

---

## Appendix: Source Code References

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-25

| Feature          | File Path                                                                                     | Lines |
|--- | --- | ---|
| Contribution Guide | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md)           | 1-192 |
| Agent Example    | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | -     |
| Skill Example    | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | -     |
| Command Example  | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)           | -     |
| Hook Configuration | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json)     | 1-158 |
| Rule Example     | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | -     |
| MCP Configuration Example  | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92  |
| Example Configuration | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | -     |

**Key Front Matter Fields**:
- `name`: Agent/Skill/Command identifier
- `description`: Functional description
- `tools`: Allowed tools (Agent)
- `model`: Preferred model (Agent, optional)

**Key Directory Structure**:
- `agents/`: 9 specialized sub-agents
- `skills/`: 11 workflow definitions
- `commands/`: 14 slash commands
- `rules/`: 8 rule sets
- `hooks/`: Automation hook configurations
- `mcp-configs/`: MCP server configurations
- `examples/`: Example configuration files

**Contribution-Related Links**:
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
