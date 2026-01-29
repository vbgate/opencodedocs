---
title: "FAQ: Common Questions | oh-my-opencode"
sidebarTitle: "FAQ"
subtitle: "FAQ: Common Questions | oh-my-opencode"
description: "Find answers to oh-my-opencode questions. Includes installation, ultrawork usage, agent delegation, background tasks, and security warnings."
tags:
  - "faq"
  - "troubleshooting"
  - "installation"
  - "configuration"
order: 160
---

# Frequently Asked Questions

## What You'll Learn

After reading this FAQ, you'll be able to:

- Quickly find solutions to installation and configuration issues
- Understand how to use ultrawork mode correctly
- Master best practices for agent delegation
- Understand Claude Code compatibility boundaries and limitations
- Avoid common security and performance pitfalls

---

## Installation & Configuration

### How do I install oh-my-opencode?

**Easiest way**: Let the AI agent install it for you.

Send the following prompt to your LLM agent (Claude Code, AmpCode, Cursor, etc.):

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**Manual installation**: Refer to the [Installation Guide](../start/installation/).

::: tip Why recommend letting AI agents install?
Humans are prone to errors when configuring JSONC format (like forgetting quotes or incorrect colon placement). Letting AI agents handle it avoids common syntax errors.
:::

### How do I uninstall oh-my-opencode?

Clean up in three steps:

**Step 1**: Remove the plugin from OpenCode configuration

Edit `~/.config/opencode/opencode.json` (or `opencode.jsonc`), delete `"oh-my-opencode"` from the `plugin` array.

```bash
# Use jq to automatically remove
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**Step 2**: Delete configuration files (optional)

```bash
# Delete user configuration
rm -f ~/.config/opencode/oh-my-opencode.json

# Delete project configuration (if exists)
rm -f .opencode/oh-my-opencode.json
```

**Step 3**: Verify removal

```bash
opencode --version
# The plugin should no longer load
```

### Where are the configuration files?

Configuration files have two levels:

| Level | Location | Purpose | Priority |
|-------|----------|---------|----------|
| Project | `.opencode/oh-my-opencode.json` | Project-specific configuration | Low |
| User | `~/.config/opencode/oh-my-opencode.json` | Global default configuration | High |

**Merge rule**: User-level configuration overrides project-level configuration.

Configuration files support JSONC format (JSON with Comments), you can add comments and trailing commas:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // This is a comment
  "disabled_agents": [], // Can have trailing commas
  "agents": {}
}
```

### How do I disable a specific feature?

Use `disabled_*` arrays in the configuration file:

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Claude Code compatibility switches**:

```json
{
  "claude_code": {
    "mcp": false,        // Disable Claude Code MCP
    "commands": false,    // Disable Claude Code Commands
    "skills": false,      // Disable Claude Code Skills
    "hooks": false        // Disable settings.json hooks
  }
}
```

---

## Usage

### What is ultrawork?

**ultrawork** (or abbreviated `ulw`) is the magic word—include it in your prompt and all features automatically activate:

- ✅ Parallel background tasks
- ✅ All professional agents (Sisyphus, Oracle, Librarian, Explore, Prometheus, etc.)
- ✅ Deep exploration mode
- ✅ Todo forced completion mechanism

**Usage examples**:

```
ultrawork 开发一个 REST API，需要 JWT 认证和用户管理
```

Or more concise:

```
ulw 重构这个模块
```

::: info How it works
The `keyword-detector` Hook detects `ultrawork` or `ulw` keywords, then sets `message.variant` to a special value, triggering all advanced features.
:::

### How do I call a specific agent?

**Method 1: Using @ symbol**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**Method 2: Using delegate_task tool**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**Agent permission limits**:

| Agent | Can Write Code | Can Execute Bash | Can Delegate Tasks | Description |
|-------|---------------|------------------|--------------------|-------------|
| Sisyphus | ✅ | ✅ | ✅ | Main orchestrator |
| Oracle | ❌ | ❌ | ❌ | Read-only advisor |
| Librarian | ❌ | ❌ | ❌ | Read-only research |
| Explore | ❌ | ❌ | ❌ | Read-only search |
| Multimodal Looker | ❌ | ❌ | ❌ | Read-only media analysis |
| Prometheus | ✅ | ✅ | ✅ | Planner |

### How do background tasks work?

Background tasks let you work like a real development team, with multiple AI agents working in parallel:

**Start a background task**:

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**Continue working...**

**System automatically notifies completion** (via `background-notification` Hook)

**Get results**:

```
background_output(task_id="bg_abc123")
```

**Concurrency control**:

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**Priority**: `modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip Why need concurrency control?
Avoid API rate limits and runaway costs. For example, Claude Opus 4.5 is expensive, limit its concurrency; while Haiku is cheap, allow more concurrency.
:::

### How do I use Ralph Loop?

**Ralph Loop** is a self-referential development loop—working continuously until the task is complete.

**Start**:

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**How to determine completion**: The agent outputs the `<promise>DONE</promise>` marker.

**Cancel loop**:

```
/cancel-ralph
```

**Configuration**:

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip Difference from ultrawork
`/ralph-loop` is normal mode, `/ulw-loop` is ultrawork mode (all advanced features activated).
:::
### What are Categories and Skills?

**Categories** (added in v3.0): Model abstraction layer, automatically selecting the optimal model based on task type.

**Built-in Categories**:

| Category | Default Model | Temperature | Use Cases |
|----------|---------------|-------------|----------|
| visual-engineering | google/gemini-3-pro | 0.7 | Frontend, UI/UX, design |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | High-IQ reasoning tasks |
| artistry | google/gemini-3-pro | 0.7 | Creative and artistic tasks |
| quick | anthropic/claude-haiku-4-5 | 0.1 | Fast, low-cost tasks |
| writing | google/gemini-3-flash | 0.1 | Documentation and writing tasks |

**Skills**: Knowledge modules that inject best practices for specific domains.

**Built-in Skills**:

| Skill | Trigger Condition | Description |
|-------|-------------------|-------------|
| playwright | Browser-related tasks | Playwright MCP browser automation |
| frontend-ui-ux | UI/UX tasks | Designer-turned-developer, crafting beautiful interfaces |
| git-master | Git operations (commit, rebase, squash) | Git expert, atomic commits, history search |

**Usage examples**:

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="设计这个页面的 UI")
delegate_task(category="quick", skills=["git-master"], prompt="提交这些更改")
```

::: info Advantage
Categories optimize costs (use cheaper models), Skills ensure quality (inject expertise).
:::

---

## Claude Code Compatibility

### Can I use Claude Code configuration?

**Yes**, oh-my-opencode provides a **full compatibility layer**:

**Supported configuration types**:

| Type | Load Location | Priority |
|------|--------------|----------|
| Commands | `~/.claude/commands/`, `.claude/commands/` | Low |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | Medium |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | High |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | High |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | High |

**Configuration loading priority**:

OpenCode project configuration > Claude Code user configuration

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // Disable specific plugin
    }
  }
}
```

### Can I use Claude Code subscription?

**Technically feasible, but not recommended**.

::: warning Claude OAuth access restriction
As of January 2026, Anthropic has restricted third-party OAuth access, citing ToS violations.
:::

**Official statement** (from README):

> There are indeed community tools that forge Claude Code OAuth request signatures. These tools may be technically undetectable, but users should be aware of ToS implications, and I personally do not recommend using them.
>
> **This project is not responsible for any issues caused by using unofficial tools, and we have no custom OAuth system implementation.**

**Recommended approach**: Use your existing AI Provider subscriptions (Claude, OpenAI, Gemini, etc.).

### Is data compatible?

**Yes**, data storage format is compatible:

| Data | Location | Format | Compatibility |
|------|----------|--------|---------------|
| Todos | `~/.claude/todos/` | JSON | ✅ Claude Code compatible |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Claude Code compatible |

You can seamlessly switch between Claude Code and oh-my-opencode.

---

## Security & Performance

### Are there security warnings?

**Yes**, there are clear warnings at the top of the README:

::: danger Warning: Impersonation Site
**ohmyopencode.com is not affiliated with this project.** We do not operate or endorse this website.
>
> OhMyOpenCode is **free and open source**. Do not download installers or enter payment information on third-party sites claiming to be "official".
>
> Since the impersonation site is behind a paywall, we **cannot verify its distributed content**. Treat any downloads from it as **potentially unsafe**.
>
> ✅ Official download: https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### How do I optimize performance?

**Strategy 1: Use appropriate models**

- Quick tasks → Use `quick` category (Haiku model)
- UI design → Use `visual` category (Gemini 3 Pro)
- Complex reasoning → Use `ultrabrain` category (GPT 5.2)

**Strategy 2: Enable concurrency control**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // Limit Anthropic concurrency
      "openai": 5       // Increase OpenAI concurrency
    }
  }
}
```

**Strategy 3: Use background tasks**

Let lightweight models (like Haiku) collect information in the background, while the main agent (Opus) focuses on core logic.

**Strategy 4: Disable unneeded features**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // Disable Claude Code hooks (if not used)
  }
}
```

### OpenCode version requirements?

**Recommended**: OpenCode >= 1.0.132

::: warning Old version bug
If you're using version 1.0.132 or earlier, an OpenCode bug may corrupt your configuration.
>
> This fix was merged after 1.0.132—use a newer version.
:::

Check version:

```bash
opencode --version
```

---

## Troubleshooting

### Agents not working?

**Checklist**:

1. ✅ Verify configuration file format is correct (JSONC syntax)
2. ✅ Check Provider configuration (is API Key valid?)
3. ✅ Run diagnostic tool: `oh-my-opencode doctor --verbose`
4. ✅ Check error messages in OpenCode logs

**Common issues**:

| Issue | Cause | Solution |
|-------|-------|----------|
| Agent refuses task | Incorrect permission configuration | Check `agents.permission` configuration |
| Background task timeout | Concurrency limit too strict | Increase `providerConcurrency` |
| Thinking block error | Model doesn't support thinking | Switch to a model that supports thinking |

### Configuration file not taking effect?

**Possible causes**:

1. JSON syntax error (forgot quotes, commas)
2. Configuration file location incorrect
3. User configuration not overriding project configuration

**Verification steps**:

```bash
# Check if configuration file exists
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# Verify JSON syntax
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**Use JSON Schema validation**:

Add `$schema` field at the beginning of the configuration file, editor will automatically show errors:

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### Background task not completing?

**Checklist**:

1. ✅ Check task status: `background_output(task_id="...")`
2. ✅ Check concurrency limits: Are there available concurrency slots?
3. ✅ Check logs: Are there API rate limit errors?

**Force cancel task**:

```javascript
background_cancel(task_id="bg_abc123")
```

**Task TTL**: Background tasks are automatically cleaned up after 30 minutes.

---

## More Resources

### Where to get help?

- **GitHub Issues**: https://github.com/code-yeongyu/oh-my-opencode/issues
- **Discord Community**: https://discord.gg/PUwSMR9XNk
- **X (Twitter)**: https://x.com/justsisyphus

### Recommended reading order

If you're new, it's recommended to read in this order:

1. [Quick Installation and Configuration](../start/installation/)
2. [Meet Sisyphus: The Main Orchestrator](../start/sisyphus-orchestrator/)
3. [Ultrawork Mode](../start/ultrawork-mode/)
4. [Configuration Diagnostics and Troubleshooting](../troubleshooting/)

### Contributing code

Pull requests are welcome! 99% of the project code is built with OpenCode.

If you want to improve a feature or fix a bug, please:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

---

## Lesson Summary

This FAQ covers common questions about oh-my-opencode, including:

- **Installation & Configuration**: How to install, uninstall, configuration file locations, disabling features
- **Usage Tips**: ultrawork mode, agent delegation, background tasks, Ralph Loop, Categories and Skills
- **Claude Code Compatibility**: Configuration loading, subscription usage limits, data compatibility
- **Security & Performance**: Security warnings, performance optimization strategies, version requirements
- **Troubleshooting**: Common issues and solutions

Remember these key points:

- Use `ultrawork` or `ulw` keywords to activate all features
- Let lightweight models collect information in the background, while the main agent focuses on core logic
- Configuration files support JSONC format, can add comments
- Claude Code configurations load seamlessly, but OAuth access has limitations
- Download from the official GitHub repository, beware of impersonation sites

## Next Lesson Preview

> If you encounter specific configuration issues during use, you can check **[Configuration Diagnostics and Troubleshooting](../troubleshooting/)**.
>
> You'll learn:
> - How to use diagnostic tools to check configuration
> - Common error code meanings and solutions
> - Provider configuration troubleshooting tips
> - Performance problem diagnosis and optimization recommendations

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-01-26

| Feature | File Path | Lines |
|--------|-----------|-------|
| Keyword Detector (ultrawork detection) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | Entire directory |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | Entire file |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | Entire file |
| Delegate Task (Category & Skill parsing) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | Entire file |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | Entire directory |

**Key constants**:
- `DEFAULT_MAX_ITERATIONS = 100`: Ralph Loop default maximum iterations
- `TASK_TTL_MS = 30 * 60 * 1000`: Background task TTL (30 minutes)
- `POLL_INTERVAL_MS = 2000`: Background task polling interval (2 seconds)

**Key configuration**:
- `disabled_agents`: List of disabled agents
- `disabled_skills`: List of disabled skills
- `disabled_hooks`: List of disabled hooks
- `claude_code`: Claude Code compatibility configuration
- `background_task`: Background task concurrency configuration
- `categories`: Category custom configuration
- `agents`: Agent override configuration

</details>
