---
title: "Best Practices: Agent Skills | Agent Skills Tutorial"
sidebarTitle: "Best Practices"
subtitle: "Best Practices"
description: "Learn how to efficiently use Agent Skills, including trigger keyword selection tips, context management best practices, multi-skill collaboration scenarios, and performance optimization recommendations. This tutorial teaches you how to precisely trigger skills, reduce token consumption, improve AI response speed, avoid skill conflicts, and master optimization methods for common usage patterns."
tags:
  - "Best Practices"
  - "Performance Optimization"
  - "Efficiency Improvement"
  - "AI Usage Tips"
order: 100
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# Using Best Practices

## What You'll Learn

After completing this lesson, you will be able to:

- ✅ Select precise trigger keywords to activate skills at the right moment
- ✅ Optimize context management to reduce token consumption and improve response speed
- ✅ Handle multi-skill collaboration scenarios to avoid conflicts and confusion
- ✅ Master common usage patterns to boost work efficiency

## Your Current Challenges

You may have encountered these scenarios:

- ✗ You input "help me deploy," but the AI doesn't activate the Vercel Deploy skill
- ✗ The same task triggers multiple skills, and the AI doesn't know which one to use
- ✗ Skills consume too much context, causing the AI to "forget" your requirements
- ✗ You have to re-explain tasks every time, unsure how to make the AI remember your preferences

## When to Use This

When using Agent Skills and you encounter:

- 🎯 **Inaccurate triggering**: Skills are not activated or the wrong one is activated
- 💾 **Context pressure**: Skills consume too many tokens, affecting other conversations
- 🔄 **Skill conflicts**: Multiple skills are activated simultaneously, causing confusion in AI execution
- ⚡ **Performance degradation**: AI responses become slow, requiring usage optimization

## Core Concepts

**Agent Skills Design Philosophy**:

Agent Skills use an **on-demand loading mechanism**—Claude only loads skill names and descriptions (~1-2 lines) at startup. When relevant keywords are detected, it reads the complete `SKILL.md` content. This design minimizes context consumption while maintaining precise skill activation.

**Three Key Dimensions of Usage Efficiency**:

1. **Trigger Precision**: Choose appropriate trigger keywords to activate skills at the right moment
2. **Context Efficiency**: Control skill content length to avoid consuming too many tokens
3. **Collaboration Clarity**: Clearly define skill boundaries to avoid multi-skill conflicts

---

## Best Practice 1: Precise Selection of Trigger Keywords

### What Are Trigger Keywords?

Trigger keywords are defined in the `description` field of `SKILL.md`, telling the AI when it should activate this skill.

**Key Principle**: Descriptions should be specific; triggers should be explicit

### How to Write Effective Descriptions?

#### ❌ Wrong Example: Description Too Vague

```yaml
---
name: my-deploy-tool
description: A deployment tool for applications  # Too vague, won't trigger
---
```

**Problems**:
- No clear usage scenarios
- Doesn't include keywords users might say
- AI cannot determine when to activate

#### ✅ Correct Example: Specific Description with Trigger Words

```yaml
---
name: vercel-deploy
description: Deploy applications and websites to Vercel. Use this skill when the user requests deployment actions such as "Deploy my app", "Deploy this to production", "Create a preview deployment", "Deploy and give me the link", or "Push this live". No authentication required.
---
```

**Advantages**:
- Clear usage scenario (Deploy applications)
- Lists specific trigger phrases ("Deploy my app", "Deploy this to production")
- Explains unique value (No authentication required)

### Trigger Keyword Selection Guide

| Writing Scenario | Recommended Keywords | Avoid Using |
|-----------------|---------------------|-------------|
| **Deployment Operations** | "deploy", "production", "push", "publish" | "send", "move" |
| **Code Review** | "review", "check", "audit", "optimize" | "look at", "see" |
| **Design Check** | "accessibility", "a11y", "UX check", "design audit" | "design", "style" |
| **Performance Optimization** | "optimize", "performance", "improve speed" | "faster", "better" |

### Common Pitfalls: Frequent Mistakes

::: warning Avoid These Mistakes

❌ **Using only generic words**
```yaml
description: A tool for code review  # "code review" is too generic
```

✅ **Specific scenario + keywords**
```yaml
description: Review React components for performance issues. Use when user says "review performance", "check optimization", or "find bottlenecks".
```

❌ **Too few keywords**
```yaml
description: Deploy to Vercel  # Only one scenario
```

✅ **Cover multiple expressions**
```yaml
description: Deploy to Vercel. Use when user says "deploy", "push live", "create preview", or "publish".
```

---

## Best Practice 2: Context Management Techniques

### Why Is Context Management Important?

Tokens are a limited resource. If the `SKILL.md` file is too long, it will occupy a lot of context, causing the AI to "forget" your requirements or slowing down responses.

### Core Principle: Keep SKILL.md Short

::: tip Golden Rule

**Keep SKILL.md files under 500 lines**

:::

According to official documentation, the following strategies can minimize context usage:

| Strategy | Description | Effect |
|----------|-------------|--------|
| **Keep SKILL.md concise** | Put detailed reference materials in separate files | Reduces initial load |
| **Write specific descriptions** | Helps AI precisely determine when to activate | Avoids false triggers |
| **Progressive disclosure** | Read support files only when needed | Controls actual token consumption |
| **Prioritize script execution** | Script execution doesn't consume context, only outputs do | Significantly reduces token usage |
| **Single-layer file references** | Link directly from SKILL.md to support files | Avoids multi-level nesting |

### How to Implement Progressive Disclosure?

**Scenario**: Your skill needs detailed references like API documentation and configuration examples.

#### ❌ Wrong Approach: Put Everything in SKILL.md

```markdown
---
name: my-api-skill
---

# API Skill

## API Reference

(Here's 2000 lines of API documentation)


## Configuration Examples

(Another 500 lines of examples)


## Usage Guide

(200 lines of usage instructions)
```

**Problems**:
- File exceeds 500 lines
- Loads all content every time activated
- Most content might never be used

#### ✅ Correct Approach: Separate to Support Files

```markdown
---
name: my-api-skill
description: Integrate with My API. Use when user says "call API", "send request", or "fetch data".
---

# API Skill

Quick start guide for My API integration.

## Quick Setup

1. Get API key from https://api.example.com/keys
2. Add to environment: `export MY_API_KEY="your-key"`
3. Run: `bash scripts/api-client.sh`

## Common Operations

### Fetch user data
```bash
bash scripts/api-client.sh get /users/123
```

### Create new resource
```bash
bash scripts/api-client.sh post /users '{"name":"John"}'
```

## Reference Documentation

For complete API reference, see:
- [API Endpoints](references/api-endpoints.md)
- [Configuration Examples](references/config-examples.md)
- [Error Handling](references/errors.md)
```

**Advantages**:
- `SKILL.md` is only 30 lines
- AI reads detailed documentation only when needed
- Most token consumption is in script output, not document loading

### Practical Example: Vercel Deploy vs React Best Practices

| Skill | SKILL.md Lines | Loaded Content | Optimization Strategy |
|-------|----------------|----------------|----------------------|
| Vercel Deploy | ~60 lines | Concise usage + output format | Scripts handle complex logic |
| React Best Practices | ~300 lines | Rule index + categorization | Detailed rules in AGENTS.md |
| Web Design Guidelines | ~50 lines | Audit process | Dynamically pull rules from GitHub |

**Key Insight**: Don't stuff everything into `SKILL.md`; make it an "entry guide," not a "complete manual."

---

## Best Practice 3: Multi-Skill Collaboration Scenarios

### Scenario 1: Skill A and Skill B Have Overlapping Trigger Conditions

**Problem**: You say "review my code," and both React Best Practices and Web Design Guidelines are triggered.

#### ✅ Solution: Clearly Differentiate Trigger Words

```yaml
# React Best Practices
name: react-performance
description: Review React components for performance issues. Use when user says "review performance", "optimize React", "check bottlenecks".

# Web Design Guidelines
name: web-design-audit
description: Audit UI for accessibility and UX issues. Use when user says "check accessibility", "review UX", "audit interface".
```

**Result**:
- "review performance" → Only triggers React skill
- "check accessibility" → Only triggers Web skill
- "review my code" → Neither triggers, AI decides

### Scenario 2: Need to Use Multiple Skills Simultaneously

**Best Practice**: Clearly tell the AI which skills you need

**Recommended Conversation Format**:
```
I need to complete two tasks:
1. Deploy to Vercel (using vercel-deploy skill)
2. Check React performance issues (using react-best-practices skill)
```

**Reasons**:
- Clear skill boundaries, avoiding AI confusion
- Makes AI execute sequentially, avoiding resource conflicts
- Improves execution efficiency

### Scenario 3: Skill Chained Calls (One Skill's Output is Another's Input)

**Example**: Optimize performance before deployment

```bash
# Step 1: Optimize code using React Best Practices
"Review src/components/Header.tsx for performance issues using react-best-practices skill"

# Step 2: Deploy using Vercel Deploy
"Deploy the optimized code to Vercel"
```

**Best Practice**:
- Clarify step sequence
- Confirm completion between steps
- Avoid parallel processing of tasks with dependencies

---

## Best Practice 4: Performance Optimization Recommendations

### 1. Streamline Conversation Context

**Problem**: After a long conversation, context becomes lengthy and responses slow down.

#### ✅ Solution: Start a New Conversation or Use "Clear Context"

```bash
# Claude Code
/clear  # Clear context, keep skills
```

### 2. Avoid Repeated Skill Loading

**Problem**: The same task triggers a skill multiple times, wasting tokens.

#### ❌ Wrong Approach

```
User: Deploy my app
AI: (loads vercel-deploy, executes)
User: Deploy to production
AI: (loads vercel-deploy again, executes)
```

#### ✅ Correct Approach

```
User: Deploy to production
AI: (loads vercel-deploy, executes once)
```

### 3. Use Scripts Instead of Inline Code

**Comparison**: Which consumes fewer tokens for the same task?

| Approach | Token Consumption | Recommended Scenario |
|----------|------------------|---------------------|
| **Inline code** (logic in SKILL.md) | High (loads every trigger) | Simple tasks (<10 lines) |
| **Bash scripts** | Low (loads script path only, not content) | Complex tasks (>10 lines) |

**Example**:

```markdown
## ❌ Inline Code (Not Recommended)

```bash
# This code loads into context every time activated
tar -czf package.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='dist' \
  && curl -X POST $API_URL \
  -F "file=@package.tar.gz"
```

## ✅ Scripts (Recommended)

```bash
bash scripts/deploy.sh
```

(Script content is in file, not loaded into context)
```

### 4. Monitor Token Usage

**Useful Claude Code Commands**:

```bash
# View current token usage
/token

# View skill loading status
/skills
```

---

## Common Usage Patterns and Examples

### Pattern 1: Rapid Iteration Workflow

```bash
# 1. Write code
vim src/App.tsx

# 2. Immediately review performance
"Review this for performance issues"

# 3. Modify code based on suggestions
(modify)

# 4. Review again
"Review again"

# 5. Deploy
"Deploy to production"
```

**Key Points**:
- Use concise commands; AI already knows context
- Repeating commands quickly activates the same skill

### Pattern 2: New Project Launch Checklist

```bash
# Create Next.js project
npx create-next-app@latest my-app

# Install Agent Skills
npx add-skill vercel-labs/agent-skills

# Initial audit
"Check accessibility for all UI files"
"Review performance for all components"

# Deploy test
"Deploy to production"
```

### Pattern 3: Team Collaboration Template

```bash
# Clone team project
git clone team-project
cd team-project

1. "Review performance for all new changes"
2. "Check accessibility of modified files"
3. "Deploy to staging"
```

**Team Standard**: Define unified trigger keywords so all members use the same efficiency patterns.

---

## Common Pitfalls: Frequent Mistakes

### Pitfall 1: Skill Activated but No Effect

**Symptom**: You say "Deploy my app," AI says "will use vercel-deploy skill," but nothing happens.

**Causes**:
- Wrong skill script path
- Script doesn't have execution permission
- File not in correct location

**Solution**:
```bash
# Check skill directory
ls -la ~/.claude/skills/vercel-deploy/

# Check script permissions
chmod +x ~/.claude/skills/vercel-deploy/scripts/deploy.sh

# Manually test script
bash ~/.claude/skills/vercel-deploy/scripts/deploy.sh .
```

### Pitfall 2: Wrong Skill Triggered

**Symptom**: Say "check code," triggers Web Design instead of React Best Practices.

**Cause**: Conflict in skill description keywords.

**Solution**: Modify trigger words to be more specific:
```yaml
# ❌ Before
description: "Check code for issues"

# ✅ After
description: "Review React code for accessibility and UX"
```

### Pitfall 3: AI "Forgets" the Skill

**Symptom**: Works in first round of dialogue, doesn't work in second.

**Cause**: Context too long, skill information pushed out.

**Solution**:
```bash
/clear  # Clear context, keep skills
```

---

## Lesson Summary

**Key Takeaways**:

1. **Trigger Keywords**: Descriptions should be specific and include multiple expressions users might say
2. **Context Management**: Keep SKILL.md < 500 lines, use progressive disclosure, prioritize scripts
3. **Multi-Skill Collaboration**: Clearly differentiate trigger words to separate skills, explicitly specify order for multi-task processing
4. **Performance Optimization**: Streamline conversation context, avoid repeated loading, monitor token usage

**Best Practices Mantra**:

> Descriptions should be specific, triggers should be explicit
> Keep files concise, let scripts occupy space
> Define clear boundaries for multiple skills, state task sequence clearly
> Streamline context, clean regularly to avoid lag

---

## Next Lesson Preview

> In the next lesson, we'll dive deep into **[Agent Skills Technical Architecture and Implementation Details](../../appendix/architecture/)**.
>
> You'll learn:
> - Build process details (parse → validate → group → sort → generate)
> - How the rule parser works
> - Type system and data model
> - Test case extraction mechanism
> - Deployment script framework detection algorithm

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand and view source code locations</strong></summary>

> Last updated: 2026-01-25

| Function | File Path | Line Numbers |
|----------|-----------|--------------|
| Context management best practices | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78) | 70-78 |
| Skill triggering examples | [`README.md:88-102`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L88-L102) | 88-102 |
| React skill trigger words | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/SKILL.md) | 1-30 |
| Vercel Deploy trigger words | [`SKILL.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/claude.ai/vercel-deploy-claimable/SKILL.md) | 1-30 |

**Key Principles**:
- Keep SKILL.md under 500 lines: Keep skill files concise
- Write specific descriptions: Write specific descriptions to help AI judge
- Use progressive disclosure: Progressive disclosure of detailed content
- Prefer scripts over inline code: Prioritize script execution to reduce token consumption

</details>
