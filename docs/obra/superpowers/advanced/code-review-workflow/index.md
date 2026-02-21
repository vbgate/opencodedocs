---
title: "Code Review Workflow: Build Early Review Habits and Master Best Practices for Requesting and Receiving Code Reviews | Superpowers Tutorial"
sidebarTitle: "Build Review Habits"
subtitle: "Code Review Workflow: Build Effective Review Habits"
description: "Learn how to use Superpowers code review workflow to proactively request reviews and handle feedback at every development stage. Covers requesting reviews, prioritizing feedback, technically validating feedback, and avoiding performative agreement—helping you build early, frequent review habits to maintain code quality baseline and reduce rework costs."
tags:
  - "Advanced"
  - "Code Review"
  - "Workflow"
prerequisite:
  - "start-using-skills"
  - "advanced-subagent-development"
order: 160
---

# Code Review Workflow: Build Effective Review Habits

## What You'll Learn

By the end of this chapter, you will:
- Proactively request code reviews at every development stage
- Handle review feedback correctly by distinguishing Critical, Important, and Minor priorities
- Perform technical validation when receiving feedback to avoid performative agreement
- Build early and frequent review habits

## Your Current Struggles

AI agents often encounter these problems during development:
- Moving to the next step immediately after completing tasks, without a review stage
- Blindly implementing feedback without verifying technical correctness
- Reviews becoming formalities that fail to discover real issues
- Skipping reviews because "the code is simple"

These problems lead to:
- Small issues accumulating into big problems
- Low-quality code entering the main branch
- Continuous accumulation of technical debt
- High maintenance costs later

## Core Concept

**Review early, review often** — early and frequent reviews.

Code review is not a "formality" after development is complete, but a core part of the development process. Through continuous reviews, you can:
- Discover issues before they become complex
- Maintain code quality baseline
- Learn better coding practices
- Reduce late-stage rework

## When to Use This Approach

**Must review**:
- After completing each subagent task
- After completing major features
- Before merging into the main branch

**Recommended to review**:
- When stuck (need fresh perspective)
- Before refactoring (establish baseline)
- After fixing complex bugs

::: warning Never Skip Reviews
Even if the code appears simple, never skip reviews. "Simple" code often hides bugs or design issues that are hard to discover.
:::

## 🎒 Prerequisites

Ensure you have:
1. Completed the [Subagent-Driven Development](../subagent-development/) tutorial
2. Familiarity with basic Git operations (getting SHA, viewing commits)
3. Completed at least one development task on the current branch

## Follow Along: Request Code Review

### Step 1: Get Commit Range

**Why**
You need to tell the reviewer which commit to start from and which to end with.

```bash
# Get the SHA of the previous commit
BASE_SHA=$(git rev-parse HEAD~1)

# Or compare with origin/main
BASE_SHA=$(git rev-parse origin/main)

# Get the SHA of the current commit
HEAD_SHA=$(git rev-parse HEAD)
```

**You should see**:
- `BASE_SHA` variable contains the full SHA of the starting commit
- `HEAD_SHA` variable contains the full SHA of the ending commit

### Step 2: Call the code-reviewer Subagent

**Why**
The code-reviewer is a specialized review agent that systematically checks code quality, architecture, and test coverage.

```bash
# Use the Task tool to call the code-reviewer subagent
@code-reviewer

# Fill in the placeholders in the template:
- WHAT_WAS_IMPLEMENTED: What functionality was just implemented
- PLAN_OR_REQUIREMENTS: What should be implemented (reference plan document or requirements)
- BASE_SHA: Starting commit SHA
- HEAD_SHA: Ending commit SHA
- DESCRIPTION: Brief description of changes
```

::: info code-reviewer Subagent
The code-reviewer subagent is defined in `agents/code-reviewer.md`. It reviews code from the following dimensions:
1. Plan consistency
2. Code quality
3. Architecture design
4. Documentation standards
5. Security and performance
:::

**You should see**:
- Subagent returns a structured review report
- Report contains: Strengths, Issues, Assessment

### Step 3: Handle Review Feedback

**Why**
Feedback grading helps you determine priorities and allocate fix time appropriately.

| Priority | Meaning | How to Handle |
| -------- | ------ | ------------- |
| Critical | Must fix | Fix immediately, otherwise cannot continue |
| Important | Should fix | Fix before proceeding to the next step |
| Minor | Suggested optimization | Record for later handling |

```bash
# Example: handling feedback

# 1. Fix Critical issues
echo "Fixing Critical issue: missing error handling"

# 2. Fix Important issues
echo "Fixing Important issue: add progress indicators"

# 3. Record Minor issues
echo "Minor issue: magic number (100) - defer to later"

# 4. If reviewer is mistaken, push back with technical reasoning
echo "Reviewer suggested removing legacy code, but we need it for backward compat. Keeping with note."
```

**You should see**:
- Critical and Important issues are fixed
- Minor issues are recorded
- Pushback reasons with technical support (if any)

### Checklist ✅

- [ ] Retrieved `BASE_SHA` and `HEAD_SHA`
- [ ] Called code-reviewer subagent
- [ ] Fixed all Critical issues
- [ ] Fixed or planned to fix Important issues
- [ ] Minor issues are recorded

## Technical Principles for Receiving Feedback

**Core Principle**: Verify before implementing, ask before assuming.

### Response Pattern

```
When receiving code review feedback:

1. READ: Read the feedback completely, do not react immediately
2. UNDERSTAND: Restate the requirement in your own words (or ask questions)
3. VERIFY: Verify against actual codebase situation
4. EVALUATE: Is it technically suitable for the current codebase?
5. RESPOND: Technical confirmation or pushback reasoning
6. IMPLEMENT: Implement item by item, test each item
```

### Prohibited Response Methods

| ❌ Prohibited | ✅ Correct |
| ------------ | --------- |
| "You're absolutely right!" (violates CLAUDE.md) | "Checking codebase..." |
| "Great point!" / "Excellent feedback!" (performative) | "I understand this to mean..." |
| "Let me implement that now" (before verification) | "Before implementing, let me verify..." |

### Handling Unclear Feedback

::: warning When Encountering Unclear Feedback
If any item in the review feedback is unclear, **STOP**, do not implement anything, request clarification first.

Why: Feedback items may be related to each other. Partial understanding = wrong implementation.
:::

**Example**:

```
Your partner says: "Fix items 1-6"
You understand 1, 2, 3, 6, but not clear on 4, 5.

❌ Wrong: Implement 1, 2, 3, 6 now, ask about 4, 5 later
✅ Correct: "I understand items 1, 2, 3, 6. Need to clarify 4 and 5 before continuing."
```

### Handling Feedback from External Reviewers

Suggestions from external reviewers require additional verification:

```
Check before implementing:
1. Is it technically correct?
2. Does it break existing functionality?
3. Do you understand the reason for the current implementation?
4. Is it applicable across all platforms/versions?
5. Does the reviewer understand the full context?

If suggestion seems wrong:
→ Push back with technical reasoning

If cannot easily verify:
→ State: "Without [X], I cannot verify. Should I [investigate/ask/continue]?"

If conflicts with previous decisions from your partner:
→ Stop, discuss with your partner first
```

### YAGNI Check

When a reviewer suggests "properly implementing" a feature:

```bash
# Check if there is actual usage in the codebase
grep -r "functionName" .

# If not used
echo "This endpoint is not called. Remove it (YAGNI)?"

# If used
echo "Okay, properly implement this feature."
```

**Your partner's rule**: "Both you and the reviewer report to me. If we don't need this feature, don't add it."

### Implementation Order

When handling multi-item feedback:

1. **First** clarify any unclear items
2. **Then** implement in the following order:
   - Blocking issues (breaking changes, security)
   - Simple fixes (typos, imports)
   - Complex fixes (refactoring, logic)
3. Test each fix item by item
4. Verify no regressions

### When to Push Back

**Pushback scenarios**:
- Suggestion breaks existing functionality
- Reviewer lacks full context
- Violates YAGNI (unused features)
- Technically incorrect for current tech stack
- Legacy/compatibility reasons exist
- Conflicts with your partner's architecture decisions

**How to push back**:
- Use technical reasoning, not defensive attitude
- Ask specific questions
- Cite working tests/code
- If involves architecture issues, involve your partner

**Signal**: If you feel uncomfortable pushing back publicly, say: "Strange things are afoot at the Circle K"

### Confirming Correct Feedback

When feedback is correct:

| ✅ Correct | ❌ Wrong |
| ---------- | ------- |
| "Fixed. [Brief description of changes]" | "You're absolutely right!" |
| "Good catch - [specific issue]. Fixed at [location]." | "Great point!" |
| [Direct fix and show in code] | "Thanks for catching that!" |
| | "Thanks for [anything]" |
| | Any expression of thanks |

**Why not thank**: Actions speak louder than words. Just fix it directly. The code itself shows you heard the feedback.

**If you find yourself wanting to write "Thanks"**: Delete it. Rewrite as a fix description.

### Gracefully Correcting Your Pushback

If you pushed back but it turns out wrong:

| ✅ Correct | ❌ Wrong |
| ---------- | ------- |
| "You're right—I checked [X] and it does [Y]. Implementing." | Long apology |
| "Verified this, you're correct. My initial understanding was wrong because [reason]. Fixing." | Defending why you pushed back |
| | Over-explaining |

State the correction truthfully and continue.

### GitHub Thread Replies

When replying to inline review comments on GitHub, reply in the comment thread (`gh api repos/{owner}/{repo}/pulls/{pr}/comments/{id}/replies`), not as a top-level PR comment.

### Common Mistakes

| Mistake | Correction |
| ------- | ---------- |
| Performative agreement | State requirements or take direct action |
| Blind implementation | Verify against codebase first |
| Batch without testing | Implement item by item, test each item |
| Assuming reviewer is correct | Check if it breaks anything |
| Avoiding pushback | Technical correctness > comfort |
| Partial implementation | Clarify all items first |
| Cannot verify but proceed | State limitations, ask for direction |

### Real Examples

**Performative Agreement (bad)**:
```
Reviewer: "Remove legacy code"
❌ "You're absolutely right! Let me remove that..."
```

**Technical Verification (good)**:
```
Reviewer: "Remove legacy code"
✅ "Checking... build target is 10.15+, this API needs 13+. Need legacy for backward compat. Current impl has wrong bundle ID - fix it or drop pre-13 support?"
```

**YAGNI (good)**:
```
Reviewer: "Implement proper metrics tracking with database, date filters, CSV export"
✅ "Grepped codebase - nothing calls this endpoint. Remove it (YAGNI)? Or is there usage I'm missing?"
```

**Unclear Items (good)**:
```
Your partner: "Fix items 1-6"
You understand 1, 2, 3, 6, not clear on 4, 5.
✅ "Understand 1,2,3,6. Need clarification on 4 and 5 before implementing."
```

## Bottom Line

**External feedback = suggestions to evaluate, not commands to follow.**

Verify. Ask. Then implement.

No performative agreement. Always be technically rigorous.

## Integration with Other Workflows

### Subagent-Driven Development

- **Review after each task**
- Discover issues before they compound
- Fix before moving to the next task

### Execute Plan

- **Review after each batch of tasks (3 tasks)**
- Get feedback, apply feedback, continue

### Ad Hoc Development

- Review before merging
- Review when stuck

## Pitfalls to Avoid

| Mistake | Consequence | Prevention |
| ------- | ---------- | ---------- |
| Skipping review because "code is simple" | Hidden bugs enter main branch | Review even 10-line code |
| Blindly implementing review suggestions | Introducing new problems or breaking existing functionality | Verify against codebase before implementing |
| Fixing item by item without testing | Regression bugs | Test immediately after each fix |
| Performative agreement on wrong suggestions | Low-quality code accumulates | Technical correctness > social comfort |
| Implementing with partial understanding | Wrong implementation | Request clarification on unclear items first |

## Chapter Summary

The core of the code review workflow is:
- **Review early, review often** — early and frequent reviews
- **Technical verification first** — Verify before implementing
- **Prioritized feedback handling** — Critical/Important/Minor
- **No performative agreement** — Technical correctness > social comfort

By building effective review habits, you can:
- Discover issues before they become complex
- Maintain code quality baseline
- Learn better coding practices
- Reduce late-stage rework costs

## Next Lesson Preview

> In the next lesson, we'll learn **[Git Worktree Isolation](../git-worktrees/)**.
>
> You'll learn:
> - Use Git worktrees to create isolated development environments
> - Work on multiple features simultaneously without interference
> - Keep the main branch clean and stable

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-02-01

| Feature | File Path | Lines |
| ------- | --------- | ----- |
| Requesting code review skill | [`skills/requesting-code-review/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/requesting-code-review/SKILL.md) | 1-106 |
| Receiving code review skill | [`skills/receiving-code-review/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/receiving-code-review/SKILL.md) | 1-214 |
| code-reviewer agent definition | [`agents/code-reviewer.md`](https://github.com/obra/superpowers/blob/main/agents/code-reviewer.md) | 1-49 |

**Key Principles**:
- **Review early, review often**: Early and frequent reviews (`requesting-code-review/SKILL.md:10`)
- **Verify before implementing**: Verify before implementation (`receiving-code-review/SKILL.md:12`)
- **Technical correctness > social comfort**: Technical correctness > social comfort (`receiving-code-review/SKILL.md:12`)

**Feedback Grading** (`agents/code-reviewer.md:37`):
- Critical (must fix)
- Important (should fix)
- Suggestions (recommended optimization)

**Prohibited Responses** (`receiving-code-review/SKILL.md:29-32`):
- "You're absolutely right!"
- "Great point!"
- "Let me implement that now"

</details>
