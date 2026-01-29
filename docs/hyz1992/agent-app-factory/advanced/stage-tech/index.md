---
title: "Design Technical Architecture: Complete Tech Stage Guide | Agent App Factory Tutorial"
sidebarTitle: "Design Technical Architecture"
subtitle: "Design Technical Architecture: Complete Tech Stage Guide"
description: "Learn to design technical architecture for AI App Factory Tech stage, covering tech stack selection, Prisma data models, API design, and database migration strategies."
tags:
  - "technical architecture"
  - "data model"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
order: 110
---

# Design Technical Architecture: Complete Tech Stage Guide

## What You'll Learn

After completing this lesson, you will be able to:

- Understand how Tech Agent designs technical architecture based on PRD
- Master Prisma Schema design methods and constraints
- Learn tech stack selection decision principles
- Design reasonable data models and API design for MVP
- Understand migration strategy between SQLite development environment and PostgreSQL production environment

## Your Current Struggle

The PRD is written, you know what features to build, but you don't know:

- Which tech stack to choose? Node.js or Python?
- How to design data tables? How to define relationships?
- What API endpoints should exist? What standards to follow?
- How to ensure the design enables rapid delivery while supporting future expansion?

The Tech stage is designed to solve these problems—it automatically generates technical architecture and data models based on the PRD.

## When to Use This Approach

The Tech stage is the 4th stage in the pipeline, following the UI stage and preceding the Code stage.

**Typical use cases**:

| Scenario | Description |
|----------|-------------|
| New project launch | Need to design technical solution after PRD confirmation |
| MVP rapid prototype | Need minimum viable technical architecture, avoid over-design |
| Tech stack decision | Unsure which tech combination is most suitable |
| Data model design | Need to define clear entity relationships and fields |

**Not applicable scenarios**:

- Projects with existing clear technical architecture (Tech stage will redesign)
- Only building frontend or backend (Tech stage designs full-stack architecture)
- Need microservice architecture (not recommended for MVP stage)

## 🎒 Prerequisites

::: warning Prerequisites

This lesson assumes you have already:

1. **Completed PRD stage**: `artifacts/prd/prd.md` must exist and pass validation
2. **Understood product requirements**: Clear about core features, user stories, and MVP scope
3. **Familiar with basic concepts**: Understand basic concepts of RESTful API, relational databases, and ORM

:::

**Concepts you should know**:

::: info What is Prisma?

Prisma is a modern ORM (Object-Relational Mapping) tool for working with databases in TypeScript/Node.js.

**Core advantages**:

- **Type safety**: Automatically generates TypeScript types with complete hints during development
- **Migration management**: `prisma migrate dev` automatically manages database changes
- **Developer experience**: Prisma Studio provides visual viewing and editing of data

**Basic workflow**:

```
Define schema.prisma → Run migration → Generate Client → Use in code
```

:::

::: info Why use SQLite for MVP and PostgreSQL for production?

**SQLite (development environment)**:

- Zero configuration, file database (`dev.db`)
- Lightweight and fast, suitable for local development and demos
- Does not support concurrent writes

**PostgreSQL (production environment)**:

- Feature-complete, supports concurrency and complex queries
- Excellent performance, suitable for production deployment
- Prisma migration seamless switch: just modify `DATABASE_URL`

**Migration strategy**: Prisma automatically adapts to the database provider based on `DATABASE_URL`, no manual Schema modification required.

:::

## Core Concept

The core of the Tech stage is **transforming product requirements into technical solutions**, but following the "MVP first" principle.

### Mental Framework

Tech Agent follows this mental framework:

| Principle | Description |
|-----------|-------------|
| **Goal alignment** | Technical solution must serve product core value |
| **Simplicity first** | Choose simple and mature tech stack, rapid delivery |
| **Extensibility** | Reserve extension points in design to support future evolution |
| **Data-driven** | Express entities and relationships through clear data models |

### Tech Stack Decision Tree

**Backend tech stack**:

| Component | Recommended | Alternative | Description |
|-----------|-------------|-------------|-------------|
| **Runtime** | Node.js + TypeScript | Python + FastAPI | Node.js has rich ecosystem, unified frontend and backend |
| **Web Framework** | Express | Fastify | Express is mature and stable, rich middleware |
| **ORM** | Prisma 5.x | TypeORM | Prisma provides type safety and excellent migration management |
| **Database** | SQLite (development) / PostgreSQL (production) | - | SQLite is zero-config, PostgreSQL is production-ready |

**Frontend tech stack**:

| Scenario | Recommended | Description |
|----------|-------------|-------------|
| Mobile only | React Native + Expo | Cross-platform, hot reload |
| Mobile + Web | React Native Web | One codebase, multiple platforms |
| Web only | React + Vite | Excellent performance, mature ecosystem |

**State management**:

| Complexity | Recommended | Description |
|------------|-------------|-------------|
| Simple (< 5 global states) | React Context API | Zero dependencies, low learning cost |
| Medium complexity | Zustand | Lightweight, simple API, good performance |
| Complex applications | Redux Toolkit | ⚠️ Not recommended for MVP stage, too complex |

### Data Model Design Principles

**Entity identification**:

1. Extract nouns from user stories in PRD → Candidate entities
2. Distinguish between core entities (required) and auxiliary entities (optional)
3. Each entity must have clear business meaning

**Relationship design**:

| Relationship type | Example | Description |
|-------------------|---------|-------------|
| One-to-many (1:N) | User → Posts | User has multiple posts |
| Many-to-many (M:N) | Posts ↔ Tags | Posts and tags (through intermediate table) |
| One-to-one (1:1) | User → UserProfile | ⚠️ Rarely used, can usually be merged |

**Field principles**:

- **Required fields**: `id`, `createdAt`, `updatedAt`
- **Avoid redundancy**: Fields that can be obtained through calculation or association are not stored
- **Appropriate types**: String, Int, Float, Boolean, DateTime
- **Sensitive field annotation**: Passwords etc. should not be directly stored

### ⚠️ SQLite Compatibility Constraints

When Tech Agent generates Prisma Schema, it must comply with SQLite compatibility requirements:

#### Prohibit Composite Types

SQLite does not support Prisma `type` definitions, must use `String` to store JSON strings.

```prisma
// ❌ Error - SQLite does not support
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ Correct - Use String to store JSON
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### JSON Field Comment Specification

Explain JSON structure in Schema using comments:

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // JSON format: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

Define corresponding interface in TypeScript code:

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Prisma Version Locking

Must use Prisma 5.x, not 7.x (has compatibility issues):

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```

## Tech Agent Workflow

Tech Agent is an AI Agent responsible for designing technical architecture based on PRD. Its workflow is as follows:

### Input Files

Tech Agent can only read the following files:

| File | Description | Location |
|------|-------------|----------|
| `prd.md` | Product requirements document | `artifacts/prd/prd.md` |

### Output Files

Tech Agent must generate the following files:

| File | Description | Location |
|------|-------------|----------|
| `tech.md` | Technical solution and architecture document | `artifacts/tech/tech.md` |
| `schema.prisma` | Data model definition | `artifacts/backend/prisma/schema.prisma` |

### Execution Steps

1. **Read PRD**: Identify core features, data flow, and constraint conditions
2. **Select tech stack**: According to `skills/tech/skill.md`, select language, framework, and database
3. **Design data model**: Define entities, attributes, and relationships, use Prisma schema to express
4. **Write technical documentation**: In `tech.md`, explain selection rationale, extension strategy, and non-goals
5. **Generate output files**: Write design to specified paths, do not modify upstream files

### Exit Criteria

Sisyphus scheduler will verify if Tech Agent meets the following conditions:

- ✅ Tech stack clearly declared (backend, frontend, database)
- ✅ Data model consistent with PRD (all entities come from PRD)
- ✅ No premature optimization or over-design

## Follow Along: Running Tech Stage

### Step 1: Confirm PRD Stage is Complete

**Why**

Tech Agent needs to read `artifacts/prd/prd.md`, if the file does not exist, Tech stage cannot execute.

**Action**

```bash
# Check if PRD file exists
cat artifacts/prd/prd.md
```

**You should see**: Structured PRD document, including target users, feature list, non-goals, etc.

### Step 2: Run Tech Stage

**Why**

Use AI assistant to execute Tech Agent, automatically generate technical architecture and data model.

**Action**

```bash
# Use Claude Code to execute tech stage
factory run tech
```

**You should see**:

```
✓ Current stage: tech
✓ Load PRD document: artifacts/prd/prd.md
✓ Start Tech Agent

Tech Agent is designing technical architecture...

[AI assistant will perform the following operations]
1. Analyze PRD, extract entities and features
2. Select tech stack (Node.js + Express + Prisma)
3. Design data model (User, Post and other entities)
4. Define API endpoints
5. Generate tech.md and schema.prisma

Waiting for Agent to complete...
```

### Step 3: View Generated Technical Documentation

**Why**

Check if technical documentation is complete, verify if design is reasonable.

**Action**

```bash
# View technical documentation
cat artifacts/tech/tech.md
```

**You should see**: Complete technical document including the following sections

```markdown
## Tech Stack

**Backend**
- Runtime: Node.js 20+
- Language: TypeScript 5+
- Framework: Express 4.x
- ORM: Prisma 5.x
- Database: SQLite (development) / PostgreSQL (production)

**Frontend**
- Framework: React Native + Expo
- Language: TypeScript
- Navigation: React Navigation 6
- State Management: React Context API
- HTTP Client: Axios

## Architecture Design

**Layered structure**
- Route layer (routes/): Define API endpoints
- Controller layer (controllers/): Handle requests and responses
- Service layer (services/): Business logic
- Data access layer: Prisma ORM

**Data flow**
Client → API Gateway → Controller → Service → Prisma → Database

## API Endpoint Design

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| /api/items | GET | Get list | - | Item[] |
| /api/items/:id | GET | Get details | - | Item |
| /api/items | POST | Create | CreateItemDto | Item |
| /api/items/:id | PUT | Update | UpdateItemDto | Item |
| /api/items/:id | DELETE | Delete | - | { deleted: true } |

## Data Model

### User
- id: Primary key
- email: Email (required)
- name: Name (required)
- createdAt: Creation time
- updatedAt: Update time

**Relationships**:
- posts: One-to-many (user has multiple posts)

## Environment Variables

**Backend (.env)**
- PORT: Service port (default 3000)
- DATABASE_URL: Database connection string
- NODE_ENV: Environment (development/production)
- CORS_ORIGINS: Allowed CORS origins

**Frontend (.env)**
- EXPO_PUBLIC_API_URL: Backend API address

## Future Extension Points

**Short-term (v1.1)**
- Add pagination and filtering
- Implement data export functionality

**Medium-term (v2.0)**
- Migrate to PostgreSQL
- Add user authentication

**Long-term**
- Split into microservices
- Add cache layer (Redis)
```

### Step 4: View Generated Prisma Schema

**Why**

Check if data model matches PRD and follows SQLite compatibility constraints.

**Action**

```bash
# View Prisma Schema
cat artifacts/backend/prisma/schema.prisma
```

**You should see**: Schema conforming to Prisma 5.x syntax, including complete entity definitions and relationships

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // development environment
  url      = "file:./dev.db"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User     @relation(fields: [authorId], references: [id])
}
```

### Step 5: Validate Exit Criteria

**Why**

Sisyphus will verify if Tech Agent meets exit criteria, if not met, it will require re-execution.

**Checklist**

| Check item | Description | Pass/Fail |
|------------|-------------|-----------|
| Tech stack clearly declared | Backend, frontend, database are clearly defined | [ ] |
| Data model consistent with PRD | All entities come from PRD, no extra fields | [ ] |
| No premature optimization or over-design | Conforms to MVP scope, no unverified features | [ ] |

**If failed**:

```bash
# Re-run Tech stage
factory run tech
```

## Checkpoint ✅

**Confirm you have completed**:

- [ ] Tech stage executed successfully
- [ ] `artifacts/tech/tech.md` file exists with complete content
- [ ] `artifacts/backend/prisma/schema.prisma` file exists with correct syntax
- [ ] Tech stack selection is reasonable (Node.js + Express + Prisma)
- [ ] Data model matches PRD, no extra fields
- [ ] Schema follows SQLite compatibility constraints (no Composite Types)

## Pitfall Alerts

### ⚠️ Trap 1: Over-design

**Problem**: Introducing microservices, complex caching, or advanced features in MVP stage.

**Symptom**: `tech.md` contains "microservice architecture", "Redis cache", "message queue", etc.

**Solution**: Tech Agent has a `NEVER` list that explicitly prohibits over-design. If you see these contents, re-run.

```markdown
## Don't Do (NEVER)
* **NEVER** over-design, such as introducing microservices, complex message queues, or high-performance caching in MVP stage
* **NEVER** write redundant code for uncertain scenarios
```

### ⚠️ Trap 2: SQLite Compatibility Error

**Problem**: Prisma Schema uses features not supported by SQLite.

**Symptom**: Validation stage reports error, or `npx prisma generate` fails.

**Common errors**:

```prisma
// ❌ Error - SQLite does not support Composite Types
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ Error - Using 7.x version
{
  "prisma": "^7.0.0"
}
```

**Solution**: Check Schema, ensure using String to store JSON, lock Prisma version to 5.x.

### ⚠️ Trap 3: Data Model Exceeds MVP Scope

**Problem**: Schema contains entities or fields not defined in PRD.

**Symptom**: Number of entities in `tech.md` is significantly more than core entities in PRD.

**Solution**: Tech Agent constraint "Data model should cover all entities and relationships required by MVP features, do not add unverified fields in advance". If extra fields are found, delete or mark as "Future extension points".

### ⚠️ Trap 4: Relationship Design Error

**Problem**: Relationship definition does not match actual business logic.

**Symptom**: One-to-many written as many-to-many, or missing necessary relationships.

**Example error**:

```prisma
// ❌ Error - User and Post should be one-to-many, not one-to-one
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // one-to-one relationship
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // should use @relation
}
```

**Correct approach**:

```prisma
// ✅ Correct - One-to-many relationship
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int  @id @default(autoincrement())
  authorId Int
  author   User @relation(fields: [authorId], references: [id])
}
```

## Lesson Summary

The Tech stage is the bridge connecting "product requirements" and "code implementation" in the pipeline. It automatically designs based on PRD:

- **Tech stack**: Node.js + Express + Prisma (backend), React Native + Expo (frontend)
- **Data model**: Prisma Schema conforming to SQLite compatibility requirements
- **Architecture design**: Layered structure (route → controller → service → data)
- **API definition**: RESTful endpoints and data flow

**Key principles**:

1. **MVP first**: Only design core necessary features, avoid over-design
2. **Simplicity first**: Choose mature and stable tech stack
3. **Data-driven**: Express entities and relationships through clear data models
4. **Extensibility**: Mark future extension points in documentation, but do not implement in advance

After completing the Tech stage, you will have:

- ✅ Complete technical solution document (`tech.md`)
- ✅ Data model conforming to Prisma 5.x specification (`schema.prisma`)
- ✅ Clear API design and environment configuration

## Next Lesson Preview

> In the next lesson, we'll learn **[Code Stage: Generate Runnable Code](../stage-code/)**.
>
> You'll learn:
> - How Code Agent generates frontend and backend code based on UI Schema and Tech design
> - What features the generated application includes (testing, documentation, CI/CD)
> - How to verify generated code quality
> - Special requirements and output specifications for Code Agent

---

## Appendix: Source Code Reference

<details>
<summary><strong>Click to expand source code locations</strong></summary>

> Last updated: 2026-01-29

| Feature | File Path | Line Range |
|---------|-----------|------------|
| Tech Agent definition | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Tech Skill guide | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Pipeline configuration | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| SQLite compatibility constraints | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**Key constraints**:
- **Prohibit Composite Types**: SQLite does not support them, must use String to store JSON
- **Prisma version locking**: Must use 5.x, not 7.x
- **MVP scope**: Data model should cover all entities required by MVP features, do not add unverified fields in advance

**Tech stack decision principles**:
- Prioritize languages and frameworks with active communities and complete documentation
- Choose lightweight database (SQLite) in MVP stage, can migrate to PostgreSQL later
- System layering follows route layer → business logic layer → data access layer

**Don't Do (NEVER)**:
- NEVER over-design, such as introducing microservices, complex message queues, or high-performance caching in MVP stage
- NEVER choose unpopular or poorly maintained technologies
- NEVER add unverified fields or relationships in data model
- NEVER include specific code implementation in technical documentation

</details>
