---
title: "Quick Start: From Idea to App"
sidebarTitle: "Get Running in 5 Minutes"
subtitle: "Quick Start: From Idea to App"
description: "Learn how AI App Factory transforms product ideas into runnable MVP apps through a 7-stage pipeline. This tutorial covers core value, prerequisites, project initialization, pipeline startup, and running the code—helping you get started with AI-powered app generation in just 5 minutes. End-to-end automation, checkpoint mechanism, and production-ready output including frontend and backend code, tests, documentation, and CI/CD configuration."
tags:
  - "Quick Start"
  - "MVP"
  - "AI Generation"
prerequisite: []
order: 10
---

# Quick Start: From Idea to App

## What You'll Learn

After completing this lesson, you will be able to:

- Understand how AI App Factory helps you quickly transform ideas into runnable applications
- Complete initialization of your first Factory project
- Launch the pipeline and follow the 7 stages to generate your first MVP app

## Your Current Struggle

**"Have a product idea but don't know where to start"**

Have you ever encountered this situation:
- Have a product idea but don't know how to break it down into actionable requirements
- Frontend, backend, database, testing, deployment... each task takes time
- Want to quickly validate an idea, but setting up the development environment takes several days
- Realize after writing code that the requirement understanding was wrong, so you have to start over

AI App Factory exists to solve these problems.

## When to Use This Approach

AI App Factory is suitable for these scenarios:

- ✅ **Quickly validate product ideas**: Want to test if this idea is feasible
- ✅ **Startup project 0-1 stage**: Need to quickly deliver a demonstrable prototype
- ✅ **Internal tools and management systems**: No complex permissions needed, simple and practical
- ✅ **Learn full-stack development best practices**: See how AI generates production-level code

Not suitable for these scenarios:

- ❌ **Complex enterprise systems**: Multi-tenant, permission systems, high concurrency
- ❌ **Projects requiring highly customized UI**: Projects with unique design systems
- ❌ **Systems with extreme real-time requirements**: Games, video calls, etc.

## 🎯 Core Concept

AI App Factory is a checkpoint-based intelligent application generation system that, through a multi-agent collaborative pipeline, automatically transforms your product idea into a complete runnable application including frontend and backend code, tests, and documentation.

**Three Core Values**:

### 1. End-to-End Automation

From idea to code, fully automated:
- Input: A single-sentence description of your product idea
- Output: Complete frontend and backend application (Express + Prisma + React Native)
- Intermediate process: Automatically complete requirements analysis, UI design, technical architecture, and code generation

### 2. Checkpoint Mechanism

Pause after completing each stage and wait for your confirmation:
- ✅ Prevents error accumulation, ensuring each step meets expectations
- ✅ You can adjust direction at any time, avoiding discovering too late that you've gone off track
- ✅ Automatically rollback on failure, avoiding wasting time on incorrect code

### 3. Production Ready

Generates not toy code, but production-ready applications that can go live directly:
- ✅ Complete frontend and backend code
- ✅ Unit tests and integration tests (>60% coverage)
- ✅ API documentation (Swagger/OpenAPI)
- ✅ Database seed data
- ✅ Docker deployment configuration
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Error handling and log monitoring
- ✅ Performance optimization and security checks

**7-Stage Pipeline**:

```
Bootstrap → PRD → UI → Tech → Code → Validation → Preview
    ↓          ↓    ↓     ↓      ↓         ↓          ↓
Structured Product   UI  Technical  Code   Validation  Deployment
   Idea    Requirements Design Architecture Generation Quality     Guide
```

## 🎒 Preparation Before Starting

### Essential Tools

**1. Node.js >= 16.0.0**

```bash
# Check Node.js version
node --version
```

If not installed or version is too low, download and install from [nodejs.org](https://nodejs.org/).

**2. AI Programming Assistant (Required)** ⚠️ Important

The Agent definitions and Skill files of AI App Factory are AI instructions in Markdown format and must be interpreted and executed through an AI assistant. These pipelines cannot be run manually by humans.

Recommended tools:

- **Claude Code** (https://claude.ai/code) - Recommended ⭐
- **OpenCode** or other AI assistants that support Agent mode

::: warning Why Must You Use an AI Assistant?
The core of this project is an AI Agent system. Each stage requires an AI assistant to:
- Read `.agent.md` files to understand their tasks
- Load corresponding Skill files to acquire knowledge
- Strictly follow instructions to generate code and documentation

Humans cannot replace this process, just as you cannot run Python code with Notepad.
:::

**3. Globally Install CLI Tool**

```bash
npm install -g agent-app-factory
```

Verify installation:

```bash
factory --version
```

You should see the version number output.

### Prepare Product Idea

Spend 5 minutes writing down your product idea. The more detailed the description, the more the generated application will meet your expectations.

**Example of a good description**:

> ✅ An app that helps fitness beginners record their workouts, supporting recording exercise types (running, swimming, gym), duration, calories burned, and viewing this week's training statistics. No multi-user collaboration needed, no data analysis, focused on personal recording.

**Example of a poor description**:

> ❌ Make a fitness app.

## Follow Along

### Step 1: Create Project Directory

Create an empty directory anywhere:

```bash
mkdir my-first-app && cd my-first-app
```

### Step 2: Initialize Factory Project

Run the initialization command:

```bash
factory init
```

**Why**
This creates the `.factory/` directory and copies all necessary Agent, Skill, and Policy files, making the current directory a Factory project.

**You should see**:

```
✓ Created .factory/ directory
✓ Copied agents/, skills/, policies/, pipeline.yaml
✓ Generated config files: config.yaml, state.json
✓ Generated Claude Code permissions config: .claude/settings.local.json
✓ Attempted to install required plugins (superpowers, ui-ux-pro-max)
```

If you see error messages, please check:
- Is the directory empty (or contains only config files)
- Is Node.js version >= 16.0.0
- Is agent-app-factory installed globally

::: tip Directory Structure
After initialization, your directory structure should be:

```
my-first-app/
├── .factory/
│   ├── agents/              # Agent definition files
│   ├── skills/              # Reusable knowledge modules
│   ├── policies/            # Policies and specifications
│   ├── pipeline.yaml         # Pipeline definition
│   ├── config.yaml          # Project configuration
│   └── state.json           # Pipeline state
└── .claude/
    └── settings.local.json  # Claude Code permissions config
```
:::

### Step 3: Launch Pipeline

In an AI assistant (Claude Code recommended), execute the following instruction:

```
Please read pipeline.yaml and agents/orchestrator.checkpoint.md,
start the pipeline, and help me transform this product idea into a runnable app:

[Paste your product idea here]
```

**Why**
This instructs the Sisyphus scheduler to start the pipeline, beginning with the Bootstrap stage, and transforming your idea into code step by step.

**You should see**:

The AI assistant will:
1. Read pipeline.yaml and orchestrator.checkpoint.md
2. Display current state (idle → running)
3. Start Bootstrap Agent and begin structuring your product idea

### Step 4: Follow the 7 Stages

The system will execute the following 7 stages, **pausing after each stage and requiring your confirmation**:

#### Stage 1: Bootstrap - Structure Product Idea

**Input**: Your product description
**Output**: `input/idea.md` (structured product document)

**Confirm content**:
- Problem definition: What problem does it solve?
- Target users: Who encounters this problem?
- Core value: Why is this product needed?
- Key assumptions: What are your assumptions?

**You should see**:

The AI assistant will ask:

```
✓ Completed Bootstrap stage
Generated document: input/idea.md

Please confirm:
1. Continue to next stage
2. Retry current stage (provide modification suggestions)
3. Pause pipeline
```

Carefully read `input/idea.md`. If anything doesn't match, choose "Retry" and provide modification suggestions.

#### Stage 2: PRD - Generate Product Requirements Document

**Input**: `input/idea.md`
**Output**: `artifacts/prd/prd.md`

**Confirm content**:
- User stories: How will users use this product?
- Feature list: What core features need to be implemented?
- Non-goals: Explicitly state what not to do (prevent scope creep)

#### Stage 3: UI - Design UI Structure and Prototype

**Input**: `artifacts/prd/prd.md`
**Output**: `artifacts/ui/ui.schema.yaml` + Previewable HTML prototype

**Confirm content**:
- Page structure: What pages are there?
- Interaction flow: How does the user operate?
- Visual design: Color scheme, fonts, layout

**Feature**: Integrated ui-ux-pro-max design system (67 styles, 96 color palettes, 100 industry rules)

#### Stage 4: Tech - Design Technical Architecture

**Input**: `artifacts/prd/prd.md`
**Output**: `artifacts/tech/tech.md` + `artifacts/backend/prisma/schema.prisma`

**Confirm content**:
- Tech stack: What technologies to use?
- Data model: What tables are there? What are the fields?
- API design: What API endpoints are there?

#### Stage 5: Code - Generate Complete Code

**Input**: UI Schema + Tech Design + Prisma Schema
**Output**: `artifacts/backend/` + `artifacts/client/`

**Confirm content**:
- Backend code: Express + Prisma + TypeScript
- Frontend code: React Native + TypeScript
- Tests: Vitest (backend) + Jest (frontend)
- Configuration files: package.json, tsconfig.json, etc.

#### Stage 6: Validation - Validate Code Quality

**Input**: Generated code
**Output**: `artifacts/validation/report.md`

**Confirm content**:
- Dependency installation: Did npm install succeed?
- Type checking: Did TypeScript compilation pass?
- Prisma validation: Is the database schema correct?

#### Stage 7: Preview - Generate Deployment Guide

**Input**: Complete code
**Output**: `artifacts/preview/README.md` + `GETTING_STARTED.md`

**Confirm content**:
- Local run instructions: How to start frontend and backend locally?
- Docker deployment: How to deploy using Docker?
- CI/CD configuration: How to configure GitHub Actions?

### Checkpoint ✅

After completing all 7 stages, you should see:

```
✓ Completed all pipeline stages
Final artifacts:
- artifacts/prd/prd.md (Product Requirements Document)
- artifacts/ui/ui.schema.yaml (UI Design)
- artifacts/tech/tech.md (Technical Architecture)
- artifacts/backend/ (Backend code)
- artifacts/client/ (Frontend code)
- artifacts/validation/report.md (Validation Report)
- artifacts/preview/GETTING_STARTED.md (Run Guide)

Next step: Check artifacts/preview/GETTING_STARTED.md to start running the app
```

Congratulations! Your first AI-generated app is complete.

### Step 5: Run the Generated Application

Follow the generated guide to run the application:

```bash
# Backend
cd artifacts/backend
npm install
npm run dev

# Open a new terminal window, run frontend
cd artifacts/client
npm install
npm run web  # Web version
# or
npm run ios      # iOS simulator
# or
npm run android  # Android simulator
```

**You should see**:
- Backend starts on `http://localhost:3000`
- Frontend starts on `http://localhost:8081` (Web version) or opens in simulator

## Pitfall Alerts

### ❌ Error 1: Directory Not Empty

**Error message**:

```
✗ Directory not empty, please clean up and retry
```

**Cause**: Directory already has files during initialization

**Solution**:

```bash
# Method 1: Clean directory (keep only hidden config files)
ls -a    # View all files
rm -rf !(.*)

# Method 2: Create new directory
mkdir new-app && cd new-app
factory init
```

### ❌ Error 2: AI Assistant Cannot Understand Instructions

**Error symptom**: AI assistant reports error "Unable to find Agent definition"

**Cause**: Not running in Factory project directory

**Solution**:

```bash
# Ensure you're in the project root directory containing .factory/
ls -la  # Should be able to see .factory/
pwd     # Confirm current directory
```

### ❌ Error 3: Claude CLI Not Installed

**Error message**:

```
✗ Claude CLI not installed, please visit https://claude.ai/code to download
```

**Solution**:

Download and install Claude Code CLI from https://claude.ai/code.

## Lesson Summary

In this lesson you learned:

- **Core value of AI App Factory**: End-to-end automation + checkpoint mechanism + production ready
- **7-stage pipeline**: Bootstrap → PRD → UI → Tech → Code → Validation → Preview
- **How to initialize a project**: `factory init` command
- **How to start the pipeline**: Execute instructions in an AI assistant
- **How to follow the pipeline**: Confirm after each stage, ensuring output meets expectations

**Key points**:
- Must be used with an AI assistant (Claude Code recommended)
- Provide clear, detailed product descriptions
- Carefully confirm at each checkpoint to avoid error accumulation
- Generated code is production-level and can be used directly

## Next Lesson Preview

> In the next lesson, we'll learn **[Installation and Configuration](../installation/)**.
>
> You'll learn:
> - How to globally install Agent Factory CLI
> - How to configure AI assistant (Claude Code / OpenCode)
> - How to install required plugins (superpowers, ui-ux-pro-max)

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Feature           | File Path                                                                                      | Line Range |
| ----------------- | --------------------------------------------------------------------------------------------- | ---------- |
| CLI entry point   | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123      |
| init command impl | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | -          |
| run command impl  | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js)    | -          |
| continue command impl | [`cli/commands/continue.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/continue.js) | -          |
| Pipeline definition | [`pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml)              | -          |
| Scheduler definition | [`agents/orchestrator.checkpoint.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/orchestrator.checkpoint.md) | -          |

**Key configurations**:
- `pipeline.yaml`: Defines the 7-stage pipeline sequence and input/output for each stage
- `.factory/state.json`: Maintains pipeline runtime state (idle/running/waiting_for_confirmation/paused/failed)

**Core flow**:
- `factory init` → Create `.factory/` directory, copy Agent, Skill, Policy files
- `factory run` → Read `state.json`, detect AI assistant type, generate assistant instructions
- `factory continue` → Regenerate Claude Code permissions config, start new session to continue execution

</details>
