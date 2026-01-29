---
title: "设计技术架构：Tech 阶段完整指南 | Agent App Factory 教程"
sidebarTitle: "设计技术架构"
subtitle: "设计技术架构：Tech 阶段完整指南"
description: "学习 AI App Factory Tech 阶段如何根据 PRD 设计最小可行的技术架构和 Prisma 数据模型，包括技术栈选择、数据模型设计、API 定义和数据库迁移策略。"
tags:
  - "技术架构"
  - "数据模型"
  - "Prisma"
prerequisite:
  - "advanced-stage-prd"
order: 110
---

# 设计技术架构：Tech 阶段完整指南

## 学完你能做什么

完成本课，你将能够：

- 理解 Tech Agent 如何根据 PRD 设计技术架构
- 掌握 Prisma Schema 的设计方法和约束
- 了解技术栈选择的决策原则
- 学会为 MVP 制定合理的数据模型和 API 设计
- 理解 SQLite 开发环境和 PostgreSQL 生产环境的迁移策略

## 你现在的困境

PRD 已经写好，你清楚要做什么功能，但不知道：

- 该选什么技术栈？Node.js 还是 Python？
- 数据表该怎么设计？怎么定义关系？
- API 端点该有哪些？遵循什么规范？
- 如何保证设计既能快速交付，又能支持未来扩展？

Tech 阶段就是解决这些问题的——它根据 PRD 自动生成技术架构和数据模型。

## 什么时候用这一招

Tech 阶段是流水线的第 4 个阶段，紧接在 UI 阶段之后，Code 阶段之前。

**典型使用场景**：

| 场景 | 说明 |
| ---- | ---- |
| 新项目启动 | PRD 确认后，需要设计技术方案 |
| MVP 快速原型 | 需要最小可行的技术架构，避免过度设计 |
| 技术栈决策 | 不确定选择什么技术组合最合适 |
| 数据模型设计 | 需要定义清晰的实体关系和字段 |

**不适用场景**：

- 已有明确技术架构的项目（Tech 阶段会重新设计）
- 只做前端/后端之一（Tech 阶段设计全栈架构）
- 需要微服务架构（MVP 阶段不推荐）

## 🎒 开始前的准备

::: warning 前置要求

本课假设你已经：

1. **完成 PRD 阶段**：`artifacts/prd/prd.md` 必须存在且通过验证
2. **理解产品需求**：清楚核心功能、用户故事和 MVP 范围
3. **熟悉基础概念**：了解 RESTful API、关系型数据库、ORM 的基本概念

:::

**需要了解的概念**：

::: info 什么是 Prisma？

Prisma 是一个现代化的 ORM（对象关系映射）工具，用于在 TypeScript/Node.js 中操作数据库。

**核心优势**：

- **类型安全**：自动生成 TypeScript 类型，开发时获得完整提示
- **迁移管理**：`prisma migrate dev` 自动管理数据库变更
- **开发体验**：Prisma Studio 可视化查看和编辑数据

**基本工作流程**：

```
定义 schema.prisma → 运行迁移 → 生成 Client → 代码中使用
```

:::

::: info 为什么 MVP 用 SQLite，生产用 PostgreSQL？

**SQLite（开发环境）**：

- 零配置，文件数据库（`dev.db`）
- 轻量快速，适合本地开发和演示
- 不支持并发写入

**PostgreSQL（生产环境）**：

- 功能完整，支持并发、复杂查询
- 性能优秀，适合生产部署
- Prisma 迁移无缝切换：只需修改 `DATABASE_URL`

**迁移策略**：Prisma 会根据 `DATABASE_URL` 自动适配数据库提供商，无需手动修改 Schema。

:::

## 核心思路

Tech 阶段的核心是**将产品需求转化为技术方案**，但要遵循「MVP 至上」原则。

### 思维框架

Tech Agent 遵循以下思维框架：

| 原则 | 说明 |
| ---- | ---- |
| **目标对应** | 技术方案必须服务于产品核心价值 |
| **简单优先** | 选择简洁成熟的技术栈，快速交付 |
| **可扩展性** | 在设计中预留扩展点，支持未来演进 |
| **数据驱动** | 通过清晰的数据模型表达实体和关系 |

### 技术选型决策树

**后端技术栈**：

| 组件 | 推荐 | 备选 | 说明 |
| ---- | ---- | ---- | ---- |
| **运行时** | Node.js + TypeScript | Python + FastAPI | Node.js 生态丰富，前后端统一 |
| **Web 框架** | Express | Fastify | Express 成熟稳定，中间件丰富 |
| **ORM** | Prisma 5.x | TypeORM | Prisma 类型安全，迁移管理优秀 |
| **数据库** | SQLite（开发）/ PostgreSQL（生产） | - | SQLite 零配置，PostgreSQL 生产就绪 |

**前端技术栈**：

| 场景 | 推荐 | 说明 |
| ---- | ---- | ---- |
| 仅移动端 | React Native + Expo | 跨平台，热更新 |
| 移动端 + Web | React Native Web | 一套代码多端运行 |
| 仅 Web | React + Vite | 性能优秀，生态成熟 |

**状态管理**：

| 复杂度 | 推荐 | 说明 |
| ---- | ---- | ---- |
| 简单（< 5 个全局状态） | React Context API | 零依赖，学习成本低 |
| 中等复杂度 | Zustand | 轻量、API 简洁、性能好 |
| 复杂应用 | Redux Toolkit | ⚠️ MVP 阶段不推荐，过于复杂 |

### 数据模型设计原则

**实体识别**：

1. 从 PRD 的用户故事中提取名词 → 候选实体
2. 区分核心实体（必须）和辅助实体（可选）
3. 每个实体必须有明确的业务含义

**关系设计**：

| 关系类型 | 示例 | 说明 |
| ---- | ---- | ---- |
| 一对多（1:N） | User → Posts | 用户有多篇文章 |
| 多对多（M:N） | Posts ↔ Tags | 文章和标签（通过中间表） |
| 一对一（1:1） | User → UserProfile | ⚠️ 少用，通常可合并 |

**字段原则**：

- **必须字段**：`id`, `createdAt`, `updatedAt`
- **避免冗余**：可通过计算或关联获取的字段不存储
- **合适类型**：String, Int, Float, Boolean, DateTime
- **敏感字段标注**：密码等不应直接存储

### ⚠️ SQLite 兼容性约束

Tech Agent 生成 Prisma Schema 时必须遵守 SQLite 兼容性要求：

#### 禁止使用 Composite Types

SQLite 不支持 Prisma 的 `type` 定义，必须用 `String` 存储 JSON 字符串。

```prisma
// ❌ 错误 - SQLite 不支持
type UserProfile {
  identity String
  ageRange String
}

model User {
  id      Int        @id @default(autoincrement())
  profile UserProfile
}

// ✅ 正确 - 使用 String 存储 JSON
model User {
  id      Int    @id @default(autoincrement())
  profile String // JSON: {"identity":"student","ageRange":"18-25"}
}
```

#### JSON 字段注释规范

在 Schema 中用注释说明 JSON 结构：

```prisma
model User {
  id      Int    @id @default(autoincrement())
  // JSON 格式: {"identity":"student","ageRange":"18-25"}
  profile String
}
```

在 TypeScript 代码中定义对应接口：

```typescript
// src/types/index.ts
export interface UserProfile {
  identity: string;
  ageRange: string;
}
```

#### Prisma 版本锁定

必须使用 Prisma 5.x，不使用 7.x（有兼容性问题）：

```json
{
  "dependencies": {
    "@prisma/client": "5.22.0",
    "prisma": "5.22.0"
  }
}
```

## Tech Agent 的工作流程

Tech Agent 是一个 AI Agent，负责根据 PRD 设计技术架构。它的工作流程如下：

### 输入文件

Tech Agent 只能读取以下文件：

| 文件 | 说明 | 位置 |
| ---- | ---- | ---- |
| `prd.md` | 产品需求文档 | `artifacts/prd/prd.md` |

### 输出文件

Tech Agent 必须生成以下文件：

| 文件 | 说明 | 位置 |
| ---- | ---- | ---- |
| `tech.md` | 技术方案和架构文档 | `artifacts/tech/tech.md` |
| `schema.prisma` | 数据模型定义 | `artifacts/backend/prisma/schema.prisma` |

### 执行步骤

1. **阅读 PRD**：识别核心功能、数据流和约束条件
2. **选择技术栈**：根据 `skills/tech/skill.md`，选择语言、框架和数据库
3. **设计数据模型**：定义实体、属性和关系，使用 Prisma schema 表达
4. **编写技术文档**：在 `tech.md` 中解释选择理由、扩展策略和非目标
5. **生成输出文件**：将设计写入指定路径，不得修改上游文件

### 退出条件

Sisyphus 调度器会验证 Tech Agent 是否满足以下条件：

- ✅ 技术栈明确声明（后端、前端、数据库）
- ✅ 数据模型与 PRD 一致（所有实体来自 PRD）
- ✅ 未进行过早优化或过度设计

## 跟我做：运行 Tech 阶段

### 第 1 步：确认 PRD 阶段已完成

**为什么**

Tech Agent 需要读取 `artifacts/prd/prd.md`，如果文件不存在，Tech 阶段无法执行。

**操作**

```bash
# 检查 PRD 文件是否存在
cat artifacts/prd/prd.md
```

**你应该看到**：结构化的 PRD 文档，包含目标用户、功能列表、非目标等内容。

### 第 2 步：运行 Tech 阶段

**为什么**

使用 AI 助手执行 Tech Agent，自动生成技术架构和数据模型。

**操作**

```bash
# 使用 Claude Code 执行 tech 阶段
factory run tech
```

**你应该看到**：

```
✓ 当前阶段: tech
✓ 加载 PRD 文档: artifacts/prd/prd.md
✓ 启动 Tech Agent

Tech Agent 正在设计技术架构...

[AI 助手会执行以下操作]
1. 分析 PRD，提取实体和功能
2. 选择技术栈（Node.js + Express + Prisma）
3. 设计数据模型（User, Post 等实体）
4. 定义 API 端点
5. 生成 tech.md 和 schema.prisma

等待 Agent 完成...
```

### 第 3 步：查看生成的技术文档

**为什么**

检查技术文档是否完整，验证设计是否合理。

**操作**

```bash
# 查看技术文档
cat artifacts/tech/tech.md
```

**你应该看到**：包含以下章节的完整技术文档

```markdown
## 技术栈

**后端**
- 运行时: Node.js 20+
- 语言: TypeScript 5+
- 框架: Express 4.x
- ORM: Prisma 5.x
- 数据库: SQLite (开发) / PostgreSQL (生产)

**前端**
- 框架: React Native + Expo
- 语言: TypeScript
- 导航: React Navigation 6
- 状态管理: React Context API
- HTTP 客户端: Axios

## 架构设计

**分层结构**
- 路由层 (routes/): 定义 API 端点
- 控制器层 (controllers/): 处理请求和响应
- 服务层 (services/): 业务逻辑
- 数据访问层: Prisma ORM

**数据流**
Client → API Gateway → Controller → Service → Prisma → Database

## API 端点设计

| 端点 | 方法 | 描述 | 请求体 | 响应 |
|------|------|------|--------|------|
| /api/items | GET | 获取列表 | - | Item[] |
| /api/items/:id | GET | 获取详情 | - | Item |
| /api/items | POST | 创建 | CreateItemDto | Item |
| /api/items/:id | PUT | 更新 | UpdateItemDto | Item |
| /api/items/:id | DELETE | 删除 | - | { deleted: true } |

## 数据模型

### User
- id: 主键
- email: 邮箱（必填）
- name: 名称（必填）
- createdAt: 创建时间
- updatedAt: 更新时间

**关系**:
- posts: 一对多（用户有多篇文章）

## 环境变量

**后端 (.env)**
- PORT: 服务端口 (默认 3000)
- DATABASE_URL: 数据库连接字符串
- NODE_ENV: 环境 (development/production)
- CORS_ORIGINS: 允许的跨域来源

**前端 (.env)**
- EXPO_PUBLIC_API_URL: 后端 API 地址

## 未来扩展点

**短期 (v1.1)**
- 添加分页和筛选
- 实现数据导出功能

**中期 (v2.0)**
- 迁移到 PostgreSQL
- 添加用户认证

**长期**
- 拆分为微服务
- 添加缓存层 (Redis)
```

### 第 4 步：查看生成的 Prisma Schema

**为什么**

检查数据模型是否符合 PRD，是否遵循 SQLite 兼容性约束。

**操作**

```bash
# 查看 Prisma Schema
cat artifacts/backend/prisma/schema.prisma
```

**你应该看到**：符合 Prisma 5.x 语法的 Schema，包含完整的实体定义和关系

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite" // 开发环境
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

### 第 5 步：验证退出条件

**为什么**

Sisyphus 会验证 Tech Agent 是否满足退出条件，不满足则要求重新执行。

**检查清单**

| 检查项 | 说明 | 通过/失败 |
| ---- | ---- | ---- |
| 技术栈明确声明 | 后端、前端、数据库都清晰定义 | [ ] |
| 数据模型与 PRD 一致 | 所有实体来自 PRD，无额外字段 | [ ] |
| 未进行过早优化或过度设计 | 符合 MVP 范围，无未验证的功能 | [ ] |

**如果失败**：

```bash
# 重新运行 Tech 阶段
factory run tech
```

## 检查点 ✅

**确认你已完成**：

- [ ] Tech 阶段成功执行
- [ ] `artifacts/tech/tech.md` 文件存在且内容完整
- [ ] `artifacts/backend/prisma/schema.prisma` 文件存在且语法正确
- [ ] 技术栈选择合理（Node.js + Express + Prisma）
- [ ] 数据模型与 PRD 一致，无额外字段
- [ ] Schema 遵循 SQLite 兼容性约束（无 Composite Types）

## 踩坑提醒

### ⚠️ 陷阱 1：过度设计

**问题**：在 MVP 阶段引入微服务、复杂缓存或高级功能。

**症状**：`tech.md` 中包含「微服务架构」「Redis 缓存」「消息队列」等。

**解决**：Tech Agent 有 `NEVER` 列表，明确禁止过度设计。如果看到这些内容，重新运行。

```markdown
## 不要做 (NEVER)
* **NEVER** 过度设计，如在 MVP 阶段引入微服务、复杂消息队列或高性能缓存
* **NEVER** 为尚未确定的场景编写冗余代码
```

### ⚠️ 陷阱 2：SQLite 兼容性错误

**问题**：Prisma Schema 使用了 SQLite 不支持的特性。

**症状**：Validation 阶段报错，或 `npx prisma generate` 失败。

**常见错误**：

```prisma
// ❌ 错误 - SQLite 不支持 Composite Types
type UserProfile {
  identity String
  ageRange String
}

model User {
  profile UserProfile
}

// ❌ 错误 - 使用了 7.x 版本
{
  "prisma": "^7.0.0"
}
```

**解决**：检查 Schema，确保使用 String 存储 JSON，锁定 Prisma 版本为 5.x。

### ⚠️ 陷阱 3：数据模型超出 MVP 范围

**问题**：Schema 包含 PRD 中未定义的实体或字段。

**症状**：`tech.md` 中的实体数量明显多于 PRD 中的核心实体。

**解决**：Tech Agent 约束「数据模型应覆盖所有 MVP 功能所需的实体及关系，不得提前加入未验证的字段」。如果发现额外字段，删除或标记为「未来扩展点」。

### ⚠️ 陷阱 4：关系设计错误

**问题**：关系定义不符合实际业务逻辑。

**症状**：一对多写成了多对多，或缺少必要的关系。

**示例错误**：

```prisma
// ❌ 错误 - 用户和文章应该是一对多，不是一对一
model User {
  id   Int    @id @default(autoincrement())
  post Post?  // 一对一关系
}

model Post {
  id      Int    @id @default(autoincrement())
  author  User?  // 应该使用 @relation
}
```

**正确写法**：

```prisma
// ✅ 正确 - 一对多关系
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

## 本课小结

Tech 阶段是流水线中连接「产品需求」和「代码实现」的桥梁。它根据 PRD 自动设计：

- **技术栈**：Node.js + Express + Prisma（后端），React Native + Expo（前端）
- **数据模型**：符合 SQLite 兼容性要求的 Prisma Schema
- **架构设计**：分层结构（路由 → 控制器 → 服务 → 数据）
- **API 定义**：RESTful 端点和数据流

**关键原则**：

1. **MVP 至上**：只设计核心必需功能，避免过度设计
2. **简单优先**：选择成熟稳定的技术栈
3. **数据驱动**：通过清晰的数据模型表达实体和关系
4. **可扩展性**：在文档中标注未来扩展点，但不提前实现

完成 Tech 阶段后，你将获得：

- ✅ 完整的技术方案文档（`tech.md`）
- ✅ 符合 Prisma 5.x 规范的数据模型（`schema.prisma`）
- ✅ 清晰的 API 设计和环境配置

## 下一课预告

> 下一课我们学习 **[Code 阶段：生成可运行代码](../stage-code/)**。
>
> 你会学到：
> - Code Agent 如何根据 UI Schema 和 Tech 设计生成前后端代码
> - 生成的应用包含哪些功能（测试、文档、CI/CD）
> - 如何验证生成的代码质量
> - Code Agent 的特殊要求和输出规范

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能 | 文件路径 | 行号 |
| ---- | ---- | ---- |
| Tech Agent 定义 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 1-63 |
| Tech 技能指南 | [`source/hyz1992/agent-app-factory/skills/tech/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/tech/skill.md) | 1-942 |
| Pipeline 配置 | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 49-62 |
| SQLite 兼容性约束 | [`source/hyz1992/agent-app-factory/agents/tech.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/tech.agent.md) | 28-56 |

**关键约束**：
- **禁止使用 Composite Types**：SQLite 不支持，必须用 String 存储 JSON
- **Prisma 版本锁定**：必须使用 5.x，不使用 7.x
- **MVP 范围**：数据模型应覆盖所有 MVP 功能所需的实体，不得提前加入未验证的字段

**技术栈决策原则**：
- 优先选用社区活跃、文档齐全的语言和框架
- 在 MVP 阶段选择轻量数据库（SQLite），后期可迁移至 PostgreSQL
- 系统分层遵循路由层→业务逻辑层→数据访问层

**不要做 (NEVER)**：
- NEVER 过度设计，如在 MVP 阶段引入微服务、复杂消息队列或高性能缓存
- NEVER 选择冷门或维护不佳的技术
- NEVER 在数据模型中添加未通过产品验证的字段或关系
- NEVER 在技术文档中包含具体代码实现

</details>
