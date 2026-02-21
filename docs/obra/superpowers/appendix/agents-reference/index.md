---
title: "Superpowers Agent Reference: Complete Guide to code-reviewer Triggers and Six Review Dimensions"
sidebarTitle: "Agent Reference"
subtitle: "Agent Reference"
description: "Learn the complete reference for Superpowers agent system. This guide details code-reviewer agent triggers, six review dimensions (plan alignment analysis, code quality assessment, architecture design review, documentation and standards check, issue identification recommendations, communication protocol) and best practices. Master how to efficiently use code review agent to improve project quality and development efficiency, ensuring code complies with design specifications and best practices."
tags:
  - "Reference"
  - "Agents"
  - "Code Review"
prerequisite:
  - "start-using-skills"
order: 280
---

# Agent Reference

Superpowers provides specialized AI capabilities for specific tasks through the agent system. Each agent has clear trigger conditions, review standards, and workflows.

## Overview

Differences between agents and skills:

| Feature | Skills | Agents |
| --- | --- | --- |
| Definition | Markdown file (SKILL.md) | Agent definition file (.md) |
| Invocation | Loaded via Skill tool | Via @mention or skill call |
| Use Case | General workflows and best practices | Specialized execution for specific tasks |
| Count | 14 | 1 (code-reviewer) |

## code-reviewer Agent

### Basic Information

| Item | Content |
| --- | --- |
| **Name** | code-reviewer |
| **Type** | Senior Code Reviewer |
| **Domain** | Code review, architecture review, quality assurance |
| **Model** | inherit (inherits current session model) |
| **Definition File** | `agents/code-reviewer.md` |

### Trigger Conditions

The code-reviewer agent should be invoked when any of the following conditions are met:

1. **Major project step completed**: Logic code blocks are written and need verification against the original plan
2. **Feature implementation completed**: Important feature implementation is finished and needs review against architecture or planning documents
3. **Plan step completed**: A numbered step in the planning document has been completed

::: info Example Scenarios

**Scenario 1**: User completes a major system module
```
User input:
"I've finished implementing the user authentication system as outlined in step 3 of our plan"

AI response:
"Great work! Now let me use the code-reviewer agent to review the implementation against our plan and coding standards"
```

**Scenario 2**: User completes a feature module
```
User input:
"The API endpoints for the task management system are now complete - that covers step 2 from our architecture document"

AI response:
"Excellent! Let me have the code-reviewer agent examine this implementation to ensure it aligns with our plan and follows best practices"
```

:::

### Review Dimensions

The code-reviewer agent reviews from the following six dimensions:

#### 1. Plan Alignment Analysis

- ✅ Compare implementation against original planning document or step descriptions
- ✅ Identify implementation approaches, architectures, or requirements that deviate from the plan
- ✅ Evaluate whether deviations are reasonable improvements or harmful deviations
- ✅ Verify all planned features are implemented

#### 2. Code Quality Assessment

- ✅ Review code for adherence to established patterns and conventions
- ✅ Check error handling, type safety, and defensive programming
- ✅ Evaluate code organization, naming conventions, and maintainability
- ✅ Assess test coverage and test implementation quality
- ✅ Identify potential security vulnerabilities or performance issues

#### 3. Architecture and Design Review

- ✅ Ensure implementation follows SOLID principles and established architecture patterns
- ✅ Check for separation of concerns and loose coupling
- ✅ Verify integration with existing systems
- ✅ Evaluate scalability and extensibility considerations

#### 4. Documentation and Standards

- ✅ Verify code includes appropriate comments and documentation
- ✅ Check that file headers, function documentation, and inline comments exist and are accurate
- ✅ Ensure project-specific coding standards and conventions are followed

#### 5. Issue Identification and Recommendations

- ✅ Clearly categorize issues as: Critical (must fix), Important (should fix), or Suggestions (recommend improvements)
- ✅ Provide specific examples and actionable suggestions for each issue
- ✅ When identifying plan deviations, explain whether they are harmful or beneficial
- ✅ Propose specific improvement suggestions, with code examples when helpful

#### 6. Communication Protocol

- ✅ If significant deviations from the plan are found, require the coding agent to review and confirm changes
- ✅ If issues with the original plan itself are found, suggest updating the plan
- ✅ Provide clear fix guidance for implementation issues
- ✅ Always acknowledge what was done well before highlighting issues

### Output Format Requirements

The code-reviewer agent output should:

1. **Structured**: Clearly organized by issue category
2. **Actionable**: Each issue has specific suggestions and examples
3. **Constructive**: Points out problems while also acknowledging strengths
4. **Concise**: Comprehensive but not verbose
5. **Helpful**: Helps improve current implementation and future development practices

### Best Practices

::: tip Usage Recommendations

1. **Invoke promptly**: Call immediately after completing major steps to prevent issues from accumulating
2. **Provide specific feedback**: Avoid vague evaluations; provide code line numbers and examples
3. **Balance feedback**: Both point out problems and acknowledge strengths
4. **Actionable suggestions**: Every suggestion should be directly convertible to action
5. **Respect the plan**: When deviating from the plan, explain reasons and impact

:::

## Future Extensions

Currently Superpowers only includes the code-reviewer agent. Potential agent types that may be added in the future:

| Agent Type | Potential Use |
| --- | --- |
| test-writer | Agent specialized in generating test cases |
| debugger | Agent focused on systematic debugging |
| security-auditor | Dedicated security audit agent |
| performance-optimizer | Performance optimization specialist agent |
| documentation-writer | Agent for documentation generation and maintenance |

## Related Skills

The agent system works in conjunction with the following skills:

| Skill Name | Relationship with Agents |
| --- | --- |
| requesting-code-review | Invokes code-reviewer agent |
| receiving-code-review | Receives agent review feedback |
| subagent-driven-development | Uses agents in subagent development |

## Appendix: Agent Definition File Structure

Agent definition files use YAML frontmatter to configure basic properties:

```yaml
---
name: <agent name>
description: |
  Detailed description of the agent, including trigger conditions and usage examples
model: inherit | <model name>
---

[Detailed role definition and workflow for the agent]
```

**Field Descriptions**:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| name | string | Y | Agent unique identifier (kebab-case) |
| description | string | Y | Description of agent purpose and trigger conditions |
| model | string | N | Model to use, inherit means inheriting current session model |

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Updated: 2026-02-01

| Feature | File Path | Line Number |
| --- | --- | --- |
| code-reviewer agent definition | [`agents/code-reviewer.md`](https://github.com/obra/superpowers/blob/main/agents/code-reviewer.md) | 1-49 |

**Key Configuration**:
- `name: code-reviewer`: Agent unique identifier
- `model: inherit`: Inherits current session model
- `description`: Includes trigger conditions and usage examples

**Review Dimensions**:
- Plan Alignment Analysis
- Code Quality Assessment
- Architecture and Design Review
- Documentation and Standards
- Issue Identification and Recommendations
- Communication Protocol

</details>
