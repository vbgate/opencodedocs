---
title: "Built-in Skills: Browser Automation, Git Master, UI Designer | oh-my-opencode"
subtitle: "Built-in Skills: Browser Automation, UI/UX Design, and Git Master"
sidebarTitle: "Built-in Skills"
description: "Learn 4 built-in skills in oh-my-opencode: playwright, frontend-ui-ux, git-master, dev-browser. Master browser automation and UI design."
tags:
  - "skills"
  - "browser-automation"
  - "git"
  - "ui-ux"
prerequisite:
  - "categories-skills"
order: 110
---

# Built-in Skills: Browser Automation, UI/UX Design, and Git Expert

## What You'll Learn

- Use `playwright` or `agent-browser` for browser automation testing and data scraping
- Enable agents to adopt a designer perspective and create beautiful UI/UX interfaces
- Automate Git operations, including atomic commits, history search, and rebase
- Use `dev-browser` for persistent browser automation development

## Your Current Challenges

Have you encountered these situations?
- Want to test frontend pages, but manual clicking is too slow and you don't know how to write Playwright scripts
- After writing code, commit messages are messy and history is disorganized
- Need to design UI interfaces, but don't know where to start, and the resulting interface lacks aesthetics
- Need to automate browser operations, but have to log in and authenticate every time

**Built-in Skills** are your Swiss Army knife—each Skill is an expert in a specific domain, helping you quickly resolve these pain points.

## When to Use This Approach

| Scenario | Recommended Skill | Why |
|--- | --- | ---|
| Frontend UI interfaces need beautiful design | `frontend-ui-ux` | Designer perspective, focuses on typography, color, animation |
| Browser testing, screenshots, data scraping | `playwright` or `agent-browser` | Complete browser automation capabilities |
| Git commits, history search, branch management | `git-master` | Auto-detects commit style, generates atomic commits |
| Multiple browser operations (maintain login state) | `dev-browser` | Persistent page state, supports reuse |

## Core Concepts

**What is a Skill?**

A Skill is a mechanism that injects **specialized knowledge** and **dedicated tools** into an agent. When you use `delegate_task` and specify the `load_skills` parameter, the system will:
1. Load the Skill's `template` as part of the system prompt
2. Inject the Skill's configured MCP server (if any)
3. Restrict the available tool range (if `allowedTools` is specified)

**Built-in vs Custom Skills**

- **Built-in Skills**: Ready to use, pre-configured with prompts and tools
- **Custom Skills**: You can create your own SKILL.md in the `.opencode/skills/` or `~/.claude/skills/` directories

This lesson focuses on 4 built-in Skills that cover the most common development scenarios.

## 🎒 Preparation

Before starting to use built-in Skills, please ensure:
- [ ] Completed the [Categories and Skills](../categories-skills/) lesson
- [ ] Understand the basic usage of the `delegate_task` tool
- [ ] Browser automation Skills require starting the corresponding server first (Playwright MCP or agent-browser)

---

## Skill 1: playwright (Browser Automation)

### Feature Overview

The `playwright` Skill uses the Playwright MCP server to provide complete browser automation capabilities:
- Page navigation and interaction
- Element location and manipulation (clicking, form filling)
- Screenshots and PDF export
- Network request interception and simulation

**Use Cases**: UI verification, E2E testing, webpage screenshots, data scraping

### Follow Along: Verify Website Functionality

**Scenario**: You need to verify that the login functionality is working correctly.

#### Step 1: Trigger playwright Skill

In OpenCode, enter:

```
Use playwright to navigate to https://example.com/login and take a screenshot showing the page state
```

**You should see**: The agent will automatically call Playwright MCP tools, open a browser, and take a screenshot.

#### Step 2: Fill Form and Submit

Continue entering:

```
Use playwright to fill in the username and password fields (user@example.com / password123), then click the login button and take a screenshot showing the result
```

**You should see**: The agent will automatically locate form elements, fill in the data, click the button, and return a result screenshot.

#### Step 3: Verify Redirect

```
Wait for the page to finish loading, then check if the URL redirects to /dashboard
```

**You should see**: The agent reports the current URL to confirm the redirect was successful.

### Checkpoint ✅

- [ ] Browser can successfully navigate to the target page
- [ ] Form filling and click operations execute normally
- [ ] Screenshots can clearly display page state

::: tip Configuration Note
By default, the browser automation engine uses `playwright`. If you want to switch to `agent-browser`, configure it in `oh-my-opencode.json`:

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```
:::

---

## Skill 2: frontend-ui-ux (Designer Perspective)

### Feature Overview

The `frontend-ui-ux` Skill transforms the agent into a "designer-turned-developer" role:
- Focuses on **typography, color, animation** and other visual details
- Emphasizes **bold aesthetic directions** (minimalist, maximalist, retro-futuristic, etc.)
- Provides **design principles**: Avoid generic fonts (Inter, Roboto, Arial), create unique color schemes

**Use Cases**: UI component design, interface beautification, visual system construction

### Follow Along: Design a Beautiful Dashboard

**Scenario**: You need to design a data statistics dashboard, but don't have design mockups.

#### Step 1: Enable frontend-ui-ux Skill

```
Use the frontend-ui-ux skill to design a data statistics dashboard page
Requirements: Include 3 data cards (user count, revenue, order count), use modern design style
```

**You should see**: The agent will first perform "design planning," determining purpose, tone, constraints, and differentiators.

#### Step 2: Define Aesthetic Direction

The agent will ask you (or determine internally) the design style. For example:

```
**Aesthetic Direction Selection**:
- Minimalist
- Maximalist
- Retro-futuristic
- Luxury/Refined
```

Answer: **Minimalist**

**You should see**: The agent generates design specifications (fonts, colors, spacing) based on your chosen direction.

#### Step 3: Generate Code

```
Based on the above design specifications, implement this dashboard page using React + Tailwind CSS
```

**You should see**:
- Carefully designed typography and spacing
- Distinct but harmonious color scheme (not the common purple gradient)
- Subtle animation and transition effects

### Checkpoint ✅

- [ ] The page adopts a unique design style, not generic "AI slop"
- [ ] Font selection is distinctive, avoiding Inter/Roboto/Arial
- [ ] Color scheme is cohesive with clear visual hierarchy

::: tip Difference from Regular Agents
A regular agent might write code that is functionally correct but lacks aesthetic appeal. The core value of the `frontend-ui-ux` Skill lies in:
- Emphasizing the design process (planning > coding)
- Providing clear aesthetic guidance
- Warning against anti-patterns (generic design, purple gradients)
:::

---

## Skill 3: git-master (Git Expert)

### Feature Overview

The `git-master` Skill is a Git expert integrated with three specialized capabilities:
1. **Commit Architect**: Atomic commits, dependency order, style detection
2. **Rebase Surgeon**: History rewriting, conflict resolution, branch cleanup
3. **History Archaeologist**: Find when/where specific changes were introduced

**Core Principle**: By default, create **multiple commits**, rejecting the lazy behavior of "one commit containing multiple files."

**Use Cases**: Code commits, history search, branch management, rebase operations

### Follow Along: Smartly Commit Code

**Scenario**: You've modified 5 files and need to commit the code.

#### Step 1: Trigger git-master Skill (Recommended to Use Quick Category)

```
Use delegate_task(category='quick', load_skills=['git-master']) to commit the current code changes
```

**Why use `quick` category?**
- Git operations don't require complex reasoning
- The `claude-haiku-4-5` model is fast enough to process
- Cost savings (Haiku is 10x cheaper than Opus)

**You should see**: The agent executes parallel analysis (Phase 0), including:
- `git status` and `git diff --stat`
- Recent 30 commit logs (for style detection)
- Current branch status

#### Step 2: Style Detection (Phase 1)

The agent will output:

```
STYLE DETECTION RESULT
======================
Analyzed: 30 commits from git log

Language: ENGLISH
  - English commits: 28 (93%)
  
Style: SEMANTIC
  - Semantic (feat:, fix:, etc.): 25 (83%)
  - Plain: 3 (10%)
  
Reference examples from repo:
  1. "feat: add user authentication"
  2. "fix: resolve database connection issue"
  3. "refactor: extract validation logic"

All commits will follow: ENGLISH + SEMANTIC
```

**You should see**: The agent explicitly tells you the commit style and language it will use.

#### Step 3: Plan Atomic Commits (Phase 3)

The agent will analyze file changes and output:

```
COMMIT PLAN
===========
Files changed: 5
Minimum commits required: ceil(5/3) = 2
Planned commits: 3
Status: 3 >= 2 (PASS)

COMMIT 1: feat: add authentication service
  - src/services/auth.ts
  - src/types/auth.ts
  Justification: service implementation + its type definitions

COMMIT 2: feat: implement login page
  - src/pages/login.tsx
  - src/components/login-form.tsx
  Justification: page and its components

COMMIT 3: feat: add API endpoint
  - src/api/auth.ts
  - tests/auth.test.ts
  Justification: API endpoint + its test

Execution order: Commit 1 -> Commit 2 -> Commit 3
```

**You should see**: The agent explicitly splits commits and explains why these files must be together.

#### Step 4: Execute Commits (Phase 5)

The agent will automatically execute:
```bash
git add src/services/auth.ts src/types/auth.ts
git commit -m "feat: add authentication service"

git add src/pages/login.tsx src/components/login-form.tsx
git commit -m "feat: implement login page"

git add src/api/auth.ts tests/auth.test.ts
git commit -m "feat: add API endpoint"
```

**You should see**:
- 3 independent commits, each with a clear semantic message
- Clean working directory (no uncommitted files in `git status`)

### Checkpoint ✅

- [ ] The agent performed style detection and explicitly informed you
- [ ] Commit count satisfies the "minimum commits" rule (file count / 3, rounded up)
- [ ] Each commit message matches the detected style (semantic, plain description, etc.)
- [ ] Test files are in the same commit as implementation files

::: tip History Search Feature
`git-master` also supports powerful history search:

- "when was X added" → `git log -S` (pickaxe search)
- "who wrote this line" → `git blame`
- "when did bug start" → `git bisect`
- "find commits changing X pattern" → `git log -G` (regex search)

Example: `Use git-master to find which commit added the 'calculate_discount' function`
:::

::: warning Anti-Pattern: Single Large Commit
The forced rule for `git-master` is:

| File Count | Minimum Commits |
|--- | ---|
| 3+ files | 2+ commits |
| 5+ files | 3+ commits |
| 10+ files | 5+ commits |

If the agent attempts to commit multiple files in one commit, it will automatically fail and replan.
:::

---

## Skill 4: dev-browser (Developer Browser)

### Feature Overview

The `dev-browser` Skill provides persistent browser automation capabilities:
- **Page state persistence**: Maintains login state between multiple script executions
- **ARIA Snapshot**: Automatically discovers page elements, returns tree structure with references (`@e1`, `@e2`)
- **Dual mode support**:
  - **Standalone mode**: Launches a new Chromium browser
  - **Extension mode**: Connects to your existing Chrome browser

**Use Cases**: Multiple browser operations (maintaining login state), complex workflow automation

### Follow Along: Write Post-Login Scripts

**Scenario**: You need to automate a series of operations after login and maintain session state.

#### Step 1: Start dev-browser Server

**macOS/Linux**:
```bash
cd skills/dev-browser && ./server.sh &
```

**Windows (PowerShell)**:
```powershell
cd skills/dev-browser
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

**You should see**: Console outputs `Ready` message.

#### Step 2: Write Login Script

In OpenCode, enter:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**You should see**: Browser opens the login page and outputs the page title and URL.

#### Step 3: Add Form Filling Operations

Modify the script:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

// Get ARIA snapshot
const snapshot = await client.getAISnapshot("login");
console.log(snapshot);

// Select and fill form (based on ref in snapshot)
await client.fill("input[name='username']", "user@example.com");
await client.fill("input[name='password']", "password123");
await client.click("button[type='submit']");

await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url(),
  loggedIn: page.url().includes("/dashboard")
});

await client.disconnect();
EOF
```

**You should see**:
- Output ARIA Snapshot (showing page elements and references)
- Form is automatically filled and submitted
- Page redirects to dashboard (verifying successful login)

#### Step 4: Reuse Login State

Now write a second script to operate on pages that require login:

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();

// Reuse the previously created "login" page (session is saved)
const page = await client.page("login");

// Directly access pages that require login
await page.goto("https://example.com/settings");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**You should see**: Page directly navigates to the settings page without requiring re-login (because session state is saved).

### Checkpoint ✅

- [ ] dev-browser server successfully starts and displays `Ready`
- [ ] ARIA Snapshot can correctly discover page elements
- [ ] Post-login session state can be reused across scripts
- [ ] No need to re-login between multiple script executions

::: tip Difference Between playwright and dev-browser

| Feature | playwright | dev-browser |
|--- | --- | ---|
| **Session Persistence** | ❌ New session each time | ✅ Saved across scripts |
| **ARIA Snapshot** | ❌ Uses Playwright API | ✅ Auto-generates references |
| **Extension Mode** | ❌ Not supported | ✅ Connects to user browser |
| **Use Cases** | Single operation, testing | Multiple operations, complex workflows |
:::

---

## Best Practices

### 1. Choose the Appropriate Skill

Select Skills based on task type:

| Task Type | Recommended Combination |
|--- | ---|
| Quick Git commits | `delegate_task(category='quick', load_skills=['git-master'])` |
| UI interface design | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| Browser verification | `delegate_task(category='quick', load_skills=['playwright'])` |
| Complex browser workflows | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. Combine Multiple Skills

You can load multiple Skills simultaneously:

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="Test login functionality, then commit code after completion"
)
```

### 3. Avoid Common Errors

::: warning Warning

- ❌ **Wrong**: Manually specify commit messages when using `git-master`
  - ✅ **Correct**: Let `git-master` automatically detect and generate commit messages matching project style

- ❌ **Wrong**: Request "just make it normal" when using `frontend-ui-ux`
  - ✅ **Correct**: Let the agent fully leverage designer capabilities and create unique designs

- ❌ **Wrong**: Use TypeScript type annotations in `dev-browser` scripts
  - ✅ **Correct**: Use pure JavaScript in `page.evaluate()` (browsers don't recognize TS syntax)
:::

---

## Lesson Summary

This lesson introduced 4 built-in Skills:

| Skill | Core Value | Typical Scenarios |
|--- | --- | ---|
| **playwright** | Complete browser automation | UI testing, screenshots, web scraping |
| **frontend-ui-ux** | Designer perspective, aesthetics first | UI component design, interface beautification |
| **git-master** | Automated Git operations, atomic commits | Code commits, history search |
| **dev-browser** | Persistent sessions, complex workflows | Multiple browser operations |

**Key Points**:
1. **Skill = Specialized Knowledge + Tools**: Inject best practices from specific domains into agents
2. **Combine Usage**: `delegate_task(category=..., load_skills=[...])` achieves precise matching
3. **Cost Optimization**: Use `quick` category for simple tasks, avoid expensive models
4. **Anti-Pattern Warnings**: Each Skill has clear guidance on "what not to do"

---

## Next Lesson Preview

> Next, we'll learn **[Lifecycle Hooks](../lifecycle-hooks/)**.
>
> You'll learn:
> - The role and execution order of 32 lifecycle hooks
> - How to automate context injection and error recovery
> - Common hook configuration methods (todo-continuation-enforcer, keyword-detector, etc.)

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last Updated: 2026-01-26

| Feature | File Path | Line Number |
|--- | --- | ---|
| playwright Skill definition | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
|--- | --- | ---|
| createBuiltinSkills function | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| BuiltinSkill type definition | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
|--- | --- | ---|
| Browser engine configuration | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**Key Configurations**:
- `browser_automation_engine.provider`: Browser automation engine (default `playwright`, optional `agent-browser`)
- `disabled_skills`: List of disabled Skills

**Key Functions**:
- `createBuiltinSkills(options)`: Returns the corresponding Skills array based on browser engine configuration

</details>
