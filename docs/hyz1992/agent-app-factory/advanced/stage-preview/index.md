---
title: "Preview Stage: Auto-Generate Deployment Guide and Running Instructions"
sidebarTitle: "Generate Deployment Guide"
subtitle: "Generate Deployment Guide: Complete Preview Stage Guide"
description: "Learn how the AI App Factory Preview stage automatically writes running guides and deployment configurations for generated applications, covering local startup, Docker containerization, Expo EAS builds, CI/CD pipelines, and demo workflow design."
tags:
  - "Deployment Guide"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# Generate Deployment Guide: Complete Preview Stage Guide

## What You'll Learn

After completing this lesson, you will be able to:

- Understand how the Preview Agent writes running guides for generated applications
- Master Docker deployment configuration generation methods
- Understand the role of Expo EAS build configuration
- Learn to design concise demo workflows for MVPs
- Understand CI/CD and Git Hooks configuration best practices

## The Problem

Code has been generated and validated, and you want to quickly showcase the MVP to your team or clients, but you don't know:

- What kind of running documentation should be written?
- How to help others quickly start and run the application?
- Which features to demonstrate? What pitfalls to avoid?
- How to deploy in production? Docker or cloud platform?
- How to set up continuous integration and code quality gates?

The Preview stage solves these problems—it automatically generates complete running instructions and deployment configurations.

## When to Use This

The Preview stage is the 7th and final stage of the pipeline, following immediately after the Validation stage.

**Typical Use Cases**:

| Scenario | Description |
| ---- | ---- |
| MVP Demo | Need to showcase the application to team or clients, requiring detailed running guides |
| Team Collaboration | New members joining the project need to quickly set up development environment |
| Production Deployment | Preparing to deploy the application to production, requiring Docker configuration and CI/CD pipeline |
| Mobile App Release | Need to configure Expo EAS, preparing to submit to App Store and Google Play |

**Not Suitable Cases**:

- Only viewing code without running (Preview stage is required)
- Code not yet passed Validation stage (Fix issues before executing Preview)

## 🎒 Prerequisites

::: warning Requirements

This lesson assumes you have already:

1. **Completed Validation stage**: `artifacts/validation/report.md` must exist and pass validation
2. **Understood application architecture**: Clear about backend and frontend tech stacks, data models, and API endpoints
3. **Familiar with basic concepts**: Understanding basic concepts of Docker, CI/CD, and Git Hooks

:::

**Concepts to Know**:

::: info What is Docker?

Docker is a containerization platform that packages applications and their dependencies into portable containers.

**Core Advantages**:

- **Environment consistency**: Development, testing, and production environments are completely identical, avoiding "works on my machine"
- **Fast deployment**: Start the entire application stack with a single command
- **Resource isolation**: Containers don't interfere with each other, improving security

**Basic Concepts**:

```
Dockerfile → Image → Container
```

:::

::: info What is CI/CD?

CI/CD (Continuous Integration/Continuous Deployment) is an automated software development practice.

**CI (Continuous Integration)**:
- Automatically run tests and checks on every commit
- Detect code issues early
- Improve code quality

**CD (Continuous Deployment)**:
- Automatically build and deploy applications
- Quickly push new features to production
- Reduce manual operation errors

**GitHub Actions** is GitHub's CI/CD platform, defining automation workflows through `.github/workflows/*.yml` configuration files.

:::

::: info What are Git Hooks?

Git Hooks are scripts that execute automatically at specific points during Git operations.

**Common Hooks**:

- **pre-commit**: Run code checks and formatting before committing
- **commit-msg**: Validate commit message format
- **pre-push**: Run full tests before pushing

**Husky** is a popular Git Hooks management tool that simplifies Hooks configuration and maintenance.

:::

## Core Concepts

The core of the Preview stage is **preparing complete usage and deployment documentation for the application**, following the "local-first, transparent risks" principle.

### Mental Framework

The Preview Agent follows this mental framework:

| Principle | Description |
| ---- | ---- |
| **Local-first** | Ensure anyone with a basic development environment can start locally |
| **Deployment-ready** | Provide all configuration files needed for production deployment |
| **User stories** | Design concise demo workflows that showcase core value |
| **Transparent risks** | Proactively list limitations or known issues in the current version |

### Output File Structure

The Preview Agent generates two types of files:

**Required Files** (every project needs them):

| File | Description | Location |
| ---- | ---- | ---- |
| `README.md` | Main running documentation | `artifacts/preview/README.md` |
| `Dockerfile` | Backend Docker configuration | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Development environment Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Production environment variable template | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS build configuration | `artifacts/client/eas.json` |

**Recommended Files** (needed for production):

| File | Description | Location |
| ---- | ---- | ---- |
| `DEPLOYMENT.md` | Detailed deployment guide | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | Production environment Docker Compose | Project root |

### README Document Structure

`artifacts/preview/README.md` must include the following sections:

```markdown
# [Project Name]

## Quick Start

### Requirements
- Node.js >= 18
- npm >= 9
- [Other dependencies]

### Backend Startup
[Install dependencies, configure environment, initialize database, start service]

### Frontend Startup
[Install dependencies, configure environment, start development server]

### Verify Installation
[Test commands, health checks]

---

## Demo Workflow

### Preparation
### Demo Steps
### Demo Notes

---

## Known Issues and Limitations

### Feature Limitations
### Technical Debt
### Operations to Avoid During Demo

---

## FAQ
```

## Preview Agent Workflow

The Preview Agent is an AI Agent responsible for writing running guides and deployment configurations for generated applications. Its workflow is as follows:

### Input Files

The Preview Agent can only read the following files:

| File | Description | Location |
| ---- | ---- | ---- |
| Backend code | Validated backend application | `artifacts/backend/` |
| Frontend code | Validated frontend application | `artifacts/client/` |

### Output Files

The Preview Agent must generate the following files:

| File | Description | Location |
| ---- | ---- | ---- |
| `README.md` | Main running documentation | `artifacts/preview/README.md` |
| `Dockerfile` | Backend Docker configuration | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | Development environment Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | Production environment variable template | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS build configuration | `artifacts/client/eas.json` |

### Execution Steps

1. **Browse code**: Analyze backend and frontend directories to determine dependency installation and startup commands
2. **Write README**: Follow the guidance in `skills/preview/skill.md` to write clear installation and running guides
3. **Generate Docker configuration**: Create Dockerfile and docker-compose.yml
4. **Configure EAS**: Generate Expo EAS build configuration (mobile apps)
5. **Prepare demo workflow**: Design concise demo scenario descriptions
6. **List known issues**: Proactively list defects or limitations in the current version

## Follow Along: Run Preview Stage

### Step 1: Confirm Validation Stage is Complete

**Why**

The Preview Agent needs to read `artifacts/backend/` and `artifacts/client/`. If code hasn't passed validation, documentation generated by the Preview stage may be inaccurate.

**Action**

```bash
# Check validation report
cat artifacts/validation/report.md
```

**You should see**: The validation report shows that all checks for backend and frontend have passed.

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```

### Step 2: Run Preview Stage

**Why**

Use the AI assistant to execute the Preview Agent, automatically generating running guides and deployment configurations.

**Action**

```bash
# Use Claude Code to execute preview stage
factory run preview
```

**You should see**:

```
✓ Current stage: preview
✓ Loading backend code: artifacts/backend/
✓ Loading frontend code: artifacts/client/
✓ Starting Preview Agent

Preview Agent is generating running guides and deployment configurations...

[AI assistant will execute the following operations]
1. Analyze backend and frontend project structure
2. Generate README.md (installation, running, demo workflow)
3. Create Dockerfile and docker-compose.yml
4. Configure Expo EAS build files
5. Prepare production environment variable templates
6. List known issues and limitations

Waiting for Agent to complete...
```

### Step 3: View Generated README

**Why**

Check if the README is complete, verify if installation steps and running commands are clear.

**Action**

```bash
# View running guide
cat artifacts/preview/README.md
```

**You should see**: A complete running guide with the following sections

```markdown
# AI Restaurant Recommendation Assistant

## Quick Start

### Requirements

- Node.js >= 18
- npm >= 9
- Docker (optional, for containerized deployment)

### Backend Startup

```bash
# Navigate to backend directory
cd artifacts/backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env to fill in necessary configurations

# Initialize database
npx prisma migrate dev

# (Optional) Seed database
npm run db:seed

# Start development server
npm run dev
```

Backend running at: http://localhost:3000
Health check: http://localhost:3000/health
API documentation: http://localhost:3000/api-docs

### Frontend Startup

```bash
# Navigate to frontend directory
cd artifacts/client

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit API_URL to point to backend address

# Start development server
npm start
```

- iOS simulator: Press `i`
- Android emulator: Press `a`
- Web browser: Press `w`

### Verify Installation

Run the following commands to verify successful installation:

```bash
# Backend tests
cd artifacts/backend && npm test

# Frontend tests
cd artifacts/client && npm test

# API health check
curl http://localhost:3000/health
```

---

## Demo Workflow

### Preparation

1. Ensure both backend and frontend are started
2. Clear or reset demo data (optional)

### Demo Steps

1. **Scenario Introduction** (30 seconds)
   - Introduce target users: Users who want to try new restaurants
   - Introduce core problem: Decision paralysis, don't know what to eat

2. **Feature Demo** (3-5 minutes)
   - Step 1: User inputs preferences (cuisine, taste, budget)
   - Step 2: AI recommends restaurants based on preferences
   - Step 3: User views recommendations and makes selection

3. **Technical Highlights** (optional, 1 minute)
   - Real-time AI recommendations (calling OpenAI API)
   - Mobile responsive design
   - Local database persistence

### Demo Notes

- Ensure network connection is working (AI recommendations need to call API)
- Avoid inputting overly long or vague preferences (may cause inaccurate recommendations)
- Don't modify the database during demo (may affect demo experience)

---

## Known Issues and Limitations

### Feature Limitations

- [ ] User registration and login not yet supported
- [ ] Favorites and history not yet supported
- [ ] AI recommendations only support text input, voice or images not yet supported

### Technical Debt

- [ ] Frontend error handling needs improvement
- [ ] Backend logging needs optimization
- [ ] Database indexes not optimized (no impact for small data volumes)

### Operations to Avoid During Demo

- Attempting to register or login accounts - May interrupt demo
- Inputting special characters or overly long text - May trigger errors
- Rapid consecutive requests - May trigger API rate limiting

---

## FAQ

### Q: What if the port is already in use?

A: Modify the `PORT` variable in `.env`, or terminate the process occupying the port first.

### Q: What if database connection fails?

A: Check if the `DATABASE_URL` in `.env` is configured correctly, and ensure the database is started.

### Q: What if AI recommendations don't respond?

A: Check if the `OPENAI_API_KEY` in `.env` is valid, and if network connection is working.
```

### Step 4: View Generated Docker Configuration

**Why**

Check if Docker configuration is correct, ensure it can be built and run successfully.

**Action**

```bash
# View Dockerfile
cat artifacts/backend/Dockerfile

# View docker-compose.yml
cat artifacts/backend/docker-compose.yml
```

**You should see**: Configuration files that follow Docker best practices

**Dockerfile Example**:

```dockerfile
# Base image
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY . .

# Build
RUN npm run build

# Production image
FROM node:20-alpine AS production

WORKDIR /app

# Install production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# Start command
CMD ["npm", "start"]
```

**docker-compose.yml Example**:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=file:./dev.db
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 3s
      retries: 3
```

### Step 5: View EAS Configuration

**Why**

Check if Expo EAS configuration is correct, ensure it can be built and released successfully.

**Action**

```bash
# View EAS configuration
cat artifacts/client/eas.json
```

**You should see**: Configuration for three environments: development, preview, and production

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "http://localhost:3000"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api-staging.your-domain.com"
      }
    },
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://api.your-domain.com"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Step 6: Verify Exit Conditions

**Why**

Sisyphus will verify if the Preview Agent meets exit conditions. If not met, it will request re-execution.

**Checklist**

| Check Item | Description | Pass/Fail |
| ---- | ---- | ---- |
| README includes installation steps | Clearly lists dependency installation commands for backend and frontend | [ ] |
| README includes running commands | Separately provides commands to start backend and frontend | [ ] |
| README lists access addresses and demo workflow | Explains addresses and ports to access during demo | [ ] |
| Docker configuration can build successfully | Dockerfile and docker-compose.yml have no syntax errors | [ ] |
| Production environment variable template is complete | .env.production.example includes all required configurations | [ ] |

**If Failed**:

```bash
# Re-run Preview stage
factory run preview
```

## Checkpoint ✅

**Confirm you have completed**:

- [ ] Preview stage executed successfully
- [ ] `artifacts/preview/README.md` file exists with complete content
- [ ] `artifacts/backend/Dockerfile` file exists and can be built
- [ ] `artifacts/backend/docker-compose.yml` file exists
- [ ] `artifacts/backend/.env.production.example` file exists
- [ ] `artifacts/client/eas.json` file exists (mobile apps)
- [ ] README includes clear installation steps and running commands
- [ ] README includes demo workflow and known issues

## Common Pitfalls

### ⚠️ Pitfall 1: Ignoring Dependency Installation Steps

**Problem**: README only says "start service" without explaining how to install dependencies.

**Symptoms**: New members follow README and get "module not found" error when running `npm run dev`.

**Solution**: Preview Agent constraint "README must include installation steps", ensuring each step has clear commands.

**Correct Example**:

```bash
# ❌ Wrong - Missing installation steps
npm run dev

# ✅ Correct - Includes complete steps
npm install
npm run dev
```

### ⚠️ Pitfall 2: Docker Configuration Uses latest Tag

**Problem**: Dockerfile uses `FROM node:latest` or `FROM node:alpine`.

**Symptoms**: Each build may use a different Node.js version, leading to environment inconsistency.

**Solution**: Preview Agent constraint "NEVER use latest as Docker image tag, use specific version numbers".

**Correct Example**:

```dockerfile
# ❌ Wrong - Using latest
FROM node:latest

# ❌ Wrong - Not specifying specific version
FROM node:alpine

# ✅ Correct - Using specific version
FROM node:20-alpine
```

### ⚠️ Pitfall 3: Hardcoding Environment Variables

**Problem**: Hardcoding sensitive information (passwords, API Keys, etc.) in Docker or EAS configuration.

**Symptoms**: Sensitive information leaks to code repository, posing security risks.

**Solution**: Preview Agent constraint "NEVER hardcode sensitive information in deployment configurations", use environment variable templates.

**Correct Example**:

```yaml
# ❌ Wrong - Hardcoding database password
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ Correct - Using environment variables
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ Pitfall 4: Hiding Known Issues

**Problem**: README doesn't list known issues and limitations, exaggerating product capabilities.

**Symptoms**: Unexpected issues during demo, leading to embarrassment and loss of trust.

**Solution**: Preview Agent constraint "NEVER exaggerate features or hide defects", proactively list issues in the current version.

**Correct Example**:

```markdown
## Known Issues and Limitations

### Feature Limitations
- [ ] User registration and login not yet supported
- [ ] AI recommendations may be inaccurate (depends on OpenAI API response)
```

### ⚠️ Pitfall 5: Demo Workflow Too Complex

**Problem**: Demo workflow includes 10+ steps, requiring over 10 minutes.

**Symptoms**: Demonstrator can't remember steps, audience loses patience.

**Solution**: Preview Agent constraint "Demo workflow should be limited to 3-5 minutes, no more than 5 steps".

**Correct Example**:

```markdown
### Demo Steps

1. **Scenario Introduction** (30 seconds)
   - Introduce target users and core problem

2. **Feature Demo** (3-5 minutes)
   - Step 1: User inputs preferences
   - Step 2: AI recommends based on preferences
   - Step 3: User views results

3. **Technical Highlights** (optional, 1 minute)
   - Real-time AI recommendations
   - Mobile responsive design
```

## CI/CD Configuration Templates

The Preview Agent can reference `templates/cicd-github-actions.md` to generate CI/CD configuration, including:

### Backend CI Pipeline

```yaml
name: Backend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'backend/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: backend
        run: npm ci

      - name: Run linter
        working-directory: backend
        run: npm run lint

      - name: Run type check
        working-directory: backend
        run: npx tsc --noEmit

      - name: Validate Prisma schema
        working-directory: backend
        run: npx prisma validate

      - name: Generate Prisma Client
        working-directory: backend
        run: npx prisma generate

      - name: Run tests
        working-directory: backend
        run: npm test
```

### Frontend CI Pipeline

```yaml
name: Frontend CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'client/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'client/**'

jobs:
  test:
    name: Test & Lint
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20.x
          cache: 'npm'
          cache-dependency-path: client/package-lock.json

      - name: Install dependencies
        working-directory: client
        run: npm ci

      - name: Run linter
        working-directory: client
        run: npm run lint

      - name: Run type check
        working-directory: client
        run: npx tsc --noEmit

      - name: Run tests
        working-directory: client
        run: npm test -- --coverage
```

## Git Hooks Configuration Templates

The Preview Agent can reference `templates/git-hooks-husky.md` to generate Git Hooks configuration, including:

### pre-commit Hook

Run code checks and formatting before committing.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# Run lint-staged
npx lint-staged

# Check TypeScript types
echo "📝 Type checking..."
npm run type-check

echo "✅ Pre-commit checks passed!"
```

### commit-msg Hook

Validate commit message format.

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Validating commit message..."

npx --no -- commitlint --edit "$1"

echo "✅ Commit message is valid!"
```

## Summary

The Preview stage is the final link in the pipeline, responsible for preparing complete usage and deployment documentation for generated applications. It automatically generates:

- **Running guides**: Clear installation steps, startup commands, and demo workflows
- **Docker configuration**: Dockerfile and docker-compose.yml, supporting containerized deployment
- **EAS configuration**: Expo EAS build configuration, supporting mobile app releases
- **CI/CD configuration**: GitHub Actions pipelines, supporting continuous integration and deployment
- **Git Hooks**: Husky configuration, supporting pre-commit checks

**Key Principles**:

1. **Local-first**: Ensure anyone with a basic development environment can start locally
2. **Deployment-ready**: Provide all configuration files needed for production deployment
3. **User stories**: Design concise demo workflows that showcase core value
4. **Transparent risks**: Proactively list limitations or known issues in the current version

After completing the Preview stage, you will have:

- ✅ Complete running guide (`README.md`)
- ✅ Docker containerization configuration (`Dockerfile`, `docker-compose.yml`)
- ✅ Production environment variable template (`.env.production.example`)
- ✅ Expo EAS build configuration (`eas.json`)
- ✅ Optional detailed deployment guide (`DEPLOYMENT.md`)

## Next Up

> Congratulations! You have completed all 7 stages of AI App Factory.
>
> If you want to learn more about pipeline coordination mechanisms, you can study **[Sisyphus Scheduler Deep Dive](../orchestrator/)**.
>
> You will learn:
> - How the scheduler coordinates pipeline execution
> - Permission checking and escalation handling mechanisms
> - Failure handling and rollback strategies
> - Context optimization and token-saving techniques

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Function | File Path | Lines |
| ---- | ---- | ---- |
| Preview Agent Definition | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| Preview Skill Guide | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| Pipeline Configuration | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| CI/CD Configuration Template | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Git Hooks Configuration Template | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**Key Constraints**:
- **Local-first**: Ensure anyone with a basic development environment can start locally
- **Deployment-ready**: Provide all configuration files needed for production deployment
- **Transparent risks**: Proactively list limitations or known issues in the current version

**Required Generated Files**:
- `artifacts/preview/README.md` - Main running documentation
- `artifacts/backend/Dockerfile` - Backend Docker configuration
- `artifacts/backend/docker-compose.yml` - Development environment Docker Compose
- `artifacts/backend/.env.production.example` - Production environment variable template
- `artifacts/client/eas.json` - Expo EAS build configuration

**Don't Do (NEVER)**:
- NEVER ignore dependency installation or configuration steps, otherwise running or deployment is likely to fail
- NEVER provide extra instructions unrelated to the application or marketing language
- NEVER exaggerate product capabilities or hide defects or limitations
- NEVER hardcode sensitive information in deployment configurations (passwords, API Keys, etc.)
- NEVER ignore health check configuration, which is critical for production monitoring
- NEVER skip database migration instructions, which is a key step for going live
- NEVER use `latest` as Docker image tag, use specific version numbers
- NEVER use SQLite in production (should migrate to PostgreSQL)

</details>
