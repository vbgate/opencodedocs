---
title: "Advanced: Pipeline and Internal Mechanics | AI App Factory Tutorial"
sidebarTitle: "Advanced: Pipeline"
subtitle: "Advanced: Pipeline and Internal Mechanics"
description: "Deep dive into AI App Factory's 7-stage pipeline, Sisyphus scheduler, permission security mechanisms, and failure handling strategies. Master context optimization and advanced configuration techniques."
tags:
  - "Pipeline"
  - "Scheduler"
  - "Security"
  - "Failure Handling"
prerequisite:
  - "start-pipeline-overview"
order: 80
---

# Advanced: Pipeline and Internal Mechanics

This chapter provides an in-depth explanation of AI App Factory's core mechanisms and advanced features, including the detailed working principles of the 7-stage pipeline, Sisyphus scheduler scheduling strategies, permission and security mechanisms, failure handling strategies, and how to optimize context to save token costs.

::: warning Prerequisites
Before studying this chapter, please ensure you have completed:
- [Quick Start](../../start/getting-started/) and [Installation & Configuration](../../start/installation/)
- [7-Stage Pipeline Overview](../../start/pipeline-overview/)
- [Platform Integration](../../platforms/claude-code/) configuration
:::

## Chapter Contents

This chapter covers the following topics:

### 7-Stage Pipeline Deep Dive

- **[Stage 1: Bootstrap - Structure Product Idea](stage-bootstrap/)**
  - Learn how to transform vague product ideas into structured documentation
  - Understand the input and output formats of the Bootstrap Agent

- **[Stage 2: PRD - Generate Product Requirements Document](stage-prd/)**
  - Generate MVP-level PRD, including user stories, feature lists, and non-goals
  - Master requirement decomposition and prioritization techniques

- **[Stage 3: UI - Design Interface and Prototype](stage-ui/)**
  - Use ui-ux-pro-max skill to design UI structure and previewable prototypes
  - Understand interface design workflow and best practices

- **[Stage 4: Tech - Design Technical Architecture](stage-tech/)**
  - Design minimal viable technical architecture and Prisma data models
  - Master technology selection and architecture design principles

- **[Stage 5: Code - Generate Runnable Code](stage-code/)**
  - Generate frontend and backend code, tests, and configurations based on UI Schema and Tech design
  - Understand code generation workflow and template system

- **[Stage 6: Validation - Validate Code Quality](stage-validation/)**
  - Validate dependency installation, type checking, Prisma schema, and code quality
  - Master automated quality checking workflow

- **[Stage 7: Preview - Generate Deployment Guide](stage-preview/)**
  - Generate complete running instructions and deployment configurations
  - Learn CI/CD integration and Git Hooks configuration

### Internal Mechanisms

- **[Sisyphus Scheduler Deep Dive](orchestrator/)**
  - Understand how the scheduler coordinates the pipeline, manages state, and executes permission checks
  - Master scheduling strategies and state machine principles

- **[Context Optimization: Per-Session Execution](context-optimization/)**
  - Learn how to use the `factory continue` command to save tokens
  - Master best practices for creating a new session at each stage

- **[Permissions and Security Mechanisms](security-permissions/)**
  - Understand capability boundary matrix, privilege escalation handling, and security check mechanisms
  - Master security configuration and permission management

- **[Failure Handling and Rollback](failure-handling/)**
  - Learn failure detection, retry mechanisms, rollback strategies, and manual intervention workflows
  - Master troubleshooting and recovery techniques

## Learning Path Recommendations

### Recommended Learning Order

1. **Complete the 7-Stage Pipeline First** (in order)
   - Bootstrap → PRD → UI → Tech → Code → Validation → Preview
   - Each stage has clear inputs and outputs; learning in order builds a complete understanding

2. **Then Learn the Scheduler and Context Optimization**
   - Understand how Sisyphus coordinates these 7 stages
   - Learn how to optimize context to save token costs

3. **Finally Learn Security and Failure Handling**
   - Master permission boundaries and security mechanisms
   - Understand failure scenarios and response strategies

### Focus Areas for Different Roles

| Role | Focus Chapters |
| ---- | ------------ |
| **Developer** | Code, Validation, Tech, Orchestrator |
| **Product Manager** | Bootstrap, PRD, UI, Preview |
| **Tech Lead** | Tech, Code, Security, Failure Handling |
| **DevOps Engineer** | Validation, Preview, Context Optimization |

## Next Steps

After completing this chapter, you can continue learning:

- **[FAQ & Troubleshooting](../../faq/troubleshooting/)** - Resolve issues in actual use
- **[Best Practices](../../faq/best-practices/)** - Master tips for efficient Factory usage
- **[CLI Command Reference](../../appendix/cli-commands/)** - View complete command list
- **[Code Standards](../../appendix/code-standards/)** - Understand standards for generated code

---

💡 **Tip**: If you encounter issues during use, please first check the [FAQ & Troubleshooting](../../faq/troubleshooting/) chapter.
