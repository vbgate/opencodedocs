---
title: "Preview 阶段：自动生成部署指南和运行说明 | Agent App Factory 教程"
sidebarTitle: "生成部署指南"
subtitle: "生成部署指南：Preview 阶段完整指南"
description: "学习 AI App Factory Preview 阶段如何为生成的应用自动编写运行指南和部署配置，涵盖本地启动、Docker 容器化、Expo EAS 构建、CI/CD 流水线和演示流程设计。"
tags:
  - "部署指南"
  - "Docker"
  - "CI/CD"
prerequisite:
  - "advanced-stage-validation"
order: 140
---

# 生成部署指南：Preview 阶段完整指南

## 学完你能做什么

完成本课，你将能够：

- 理解 Preview Agent 如何为生成的应用编写运行指南
- 掌握 Docker 部署配置的生成方法
- 了解 Expo EAS 构建配置的作用
- 学会为 MVP 设计简短的演示流程
- 理解 CI/CD 和 Git Hooks 配置的最佳实践

## 你现在的困境

代码已经生成并通过验证，你想快速向团队或客户展示 MVP，但不知道：

- 该写什么样的运行文档？
- 如何让别人快速启动和运行应用？
- 演示时该展示哪些功能？避免哪些坑？
- 生产环境该怎么部署？Docker 还是云平台？
- 怎么建立持续集成和代码质量门禁？

Preview 阶段就是解决这些问题的——它自动生成完整的运行说明和部署配置。

## 什么时候用这一招

Preview 阶段是流水线的第 7 个阶段，也是最后一个阶段，紧接在 Validation 阶段之后。

**典型使用场景**：

| 场景 | 说明 |
| ---- | ---- |
| MVP 演示 | 需要向团队或客户展示应用，需要详细的运行指南 |
| 团队协作 | 新成员加入项目，需要快速上手开发环境 |
| 生产部署 | 准备将应用上线，需要 Docker 配置和 CI/CD 流水线 |
| 移动应用发布 | 需要配置 Expo EAS，准备提交到 App Store 和 Google Play |

**不适用场景**：

- 只看代码不运行（Preview 阶段是必须的）
- 代码未通过 Validation 阶段（先修复问题再执行 Preview）

## 🎒 开始前的准备

::: warning 前置要求

本课假设你已经：

1. **完成 Validation 阶段**：`artifacts/validation/report.md` 必须存在且通过验证
2. **理解应用架构**：清楚后端和前端的技术栈、数据模型和 API 端点
3. **熟悉基础概念**：了解 Docker、CI/CD、Git Hooks 的基本概念

:::

**需要了解的概念**：

::: info 什么是 Docker？

Docker 是一个容器化平台，可以将应用及其依赖打包成一个可移植的容器。

**核心优势**：

- **环境一致性**：开发、测试、生产环境完全一致，避免「在我的机器上能跑」
- **快速部署**：一条命令即可启动整个应用栈
- **资源隔离**：容器之间互不影响，提高安全性

**基本概念**：

```
Dockerfile → 镜像 (Image) → 容器 (Container)
```

:::

::: info 什么是 CI/CD？

CI/CD（持续集成/持续部署）是自动化的软件开发实践。

**CI (Continuous Integration)**：
- 每次提交自动运行测试和检查
- 尽早发现代码问题
- 提高代码质量

**CD (Continuous Deployment)**：
- 自动构建和部署应用
- 快速将新功能推向生产
- 减少手动操作错误

**GitHub Actions** 是 GitHub 提供的 CI/CD 平台，通过配置 `.github/workflows/*.yml` 文件定义自动化流程。

:::

::: info 什么是 Git Hooks？

Git Hooks 是在 Git 操作的特定时间点自动执行的脚本。

**常用 Hooks**：

- **pre-commit**：提交前运行代码检查和格式化
- **commit-msg**：校验提交消息格式
- **pre-push**：推送前运行完整测试

**Husky** 是一个流行的 Git Hooks 管理工具，用于简化 Hooks 的配置和维护。

:::

## 核心思路

Preview 阶段的核心是**为应用准备完整的使用和部署文档**，但遵循「本地优先、透明风险」原则。

### 思维框架

Preview Agent 遵循以下思维框架：

| 原则 | 说明 |
| ---- | ---- |
| **本地优先** | 确保任何具有基本开发环境的人都能在本地启动 |
| **部署就绪** | 提供生产环境部署所需的所有配置文件 |
| **用户故事** | 设计简短的演示流程，展示核心价值 |
| **透明风险** | 主动列出当前版本存在的限制或已知问题 |

### 输出文件结构

Preview Agent 会生成两类文件：

**必须文件**（每个项目都需要）：

| 文件 | 说明 | 位置 |
| ---- | ---- | ---- |
| `README.md` | 主运行说明文档 | `artifacts/preview/README.md` |
| `Dockerfile` | 后端 Docker 配置 | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | 开发环境 Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | 生产环境变量模板 | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS 构建配置 | `artifacts/client/eas.json` |

**推荐文件**（生产环境需要）：

| 文件 | 说明 | 位置 |
| ---- | ---- | ---- |
| `DEPLOYMENT.md` | 详细部署指南 | `artifacts/preview/DEPLOYMENT.md` |
| `docker-compose.production.yml` | 生产环境 Docker Compose | 项目根目录 |

### README 文档结构

`artifacts/preview/README.md` 必须包含以下章节：

```markdown
# [项目名称]

## 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9
- [其他依赖]

### 后端启动
[安装依赖、配置环境、初始化数据库、启动服务]

### 前端启动
[安装依赖、配置环境、启动开发服务器]

### 验证安装
[测试命令、健康检查]

---

## 演示流程

### 准备工作
### 演示步骤
### 演示注意事项

---

## 已知问题与限制

### 功能限制
### 技术债务
### 演示时需避免的操作

---

## 常见问题
```

## Preview Agent 的工作流程

Preview Agent 是一个 AI Agent，负责为生成的应用编写运行指南和部署配置。它的工作流程如下：

### 输入文件

Preview Agent 只能读取以下文件：

| 文件 | 说明 | 位置 |
| ---- | ---- | ---- |
| 后端代码 | 已验证的后端应用 | `artifacts/backend/` |
| 前端代码 | 已验证的前端应用 | `artifacts/client/` |

### 输出文件

Preview Agent 必须生成以下文件：

| 文件 | 说明 | 位置 |
| ---- | ---- | ---- |
| `README.md` | 主运行说明文档 | `artifacts/preview/README.md` |
| `Dockerfile` | 后端 Docker 配置 | `artifacts/backend/Dockerfile` |
| `docker-compose.yml` | 开发环境 Docker Compose | `artifacts/backend/docker-compose.yml` |
| `.env.production.example` | 生产环境变量模板 | `artifacts/backend/.env.production.example` |
| `eas.json` | Expo EAS 构建配置 | `artifacts/client/eas.json` |

### 执行步骤

1. **浏览代码**：分析后端和前端目录，确定安装依赖和启动命令
2. **编写 README**：按照 `skills/preview/skill.md` 的指导，编写清晰的安装与运行指南
3. **生成 Docker 配置**：创建 Dockerfile 和 docker-compose.yml
4. **配置 EAS**：生成 Expo EAS 构建配置（移动应用）
5. **准备演示流程**：设计简短的演示场景说明
6. **列出已知问题**：主动列出当前版本存在的缺陷或限制

## 跟我做：运行 Preview 阶段

### 第 1 步：确认 Validation 阶段已完成

**为什么**

Preview Agent 需要读取 `artifacts/backend/` 和 `artifacts/client/`，如果代码未通过验证，Preview 阶段生成的文档可能不准确。

**操作**

```bash
# 检查验证报告
cat artifacts/validation/report.md
```

**你应该看到**：验证报告显示后端和前端的所有检查都通过。

```
✅ Backend Dependencies: OK
✅ Backend Type Check: OK
✅ Prisma Schema: OK
✅ Frontend Dependencies: OK
✅ Frontend Type Check: OK
```

### 第 2 步：运行 Preview 阶段

**为什么**

使用 AI 助手执行 Preview Agent，自动生成运行指南和部署配置。

**操作**

```bash
# 使用 Claude Code 执行 preview 阶段
factory run preview
```

**你应该看到**：

```
✓ 当前阶段: preview
✓ 加载后端代码: artifacts/backend/
✓ 加载前端代码: artifacts/client/
✓ 启动 Preview Agent

Preview Agent 正在生成运行指南和部署配置...

[AI 助手会执行以下操作]
1. 分析后端和前端的项目结构
2. 生成 README.md（安装、运行、演示流程）
3. 创建 Dockerfile 和 docker-compose.yml
4. 配置 Expo EAS 构建文件
5. 准备生产环境变量模板
6. 列出已知问题和限制

等待 Agent 完成...
```

### 第 3 步：查看生成的 README

**为什么**

检查 README 是否完整，验证安装步骤和运行命令是否清晰。

**操作**

```bash
# 查看运行指南
cat artifacts/preview/README.md
```

**你应该看到**：包含以下章节的完整运行指南

```markdown
# AI 推荐餐厅助手

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9
- Docker（可选，用于容器化部署）

### 后端启动

```bash
# 进入后端目录
cd artifacts/backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入必要配置

# 初始化数据库
npx prisma migrate dev

# (可选) 填充种子数据
npm run db:seed

# 启动开发服务器
npm run dev
```

后端运行在: http://localhost:3000
健康检查: http://localhost:3000/health
API 文档: http://localhost:3000/api-docs

### 前端启动

```bash
# 进入前端目录
cd artifacts/client

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 API_URL 指向后端地址

# 启动开发服务器
npm start
```

- iOS 模拟器: 按 `i`
- Android 模拟器: 按 `a`
- Web 浏览器: 按 `w`

### 验证安装

运行以下命令验证安装是否成功：

```bash
# 后端测试
cd artifacts/backend && npm test

# 前端测试
cd artifacts/client && npm test

# API 健康检查
curl http://localhost:3000/health
```

---

## 演示流程

### 准备工作

1. 确保后端和前端都已启动
2. 清空或重置演示数据（可选）

### 演示步骤

1. **场景介绍** (30秒)
   - 介绍目标用户：想尝试新餐厅的用户
   - 介绍核心问题：选择困难，不知道吃什么

2. **功能演示** (3-5分钟)
   - 步骤 1: 用户输入偏好（菜系、口味、预算）
   - 步骤 2: AI 基于偏好推荐餐厅
   - 步骤 3: 用户查看推荐结果并选择

3. **技术亮点** (可选, 1分钟)
   - 实时 AI 推荐（调用 OpenAI API）
   - 移动端响应式设计
   - 本地数据库持久化

### 演示注意事项

- 确保网络连接正常（AI 推荐需要调用 API）
- 避免输入过长或模糊的偏好（可能导致推荐不准确）
- 演示时不要修改数据库（可能影响演示效果）

---

## 已知问题与限制

### 功能限制

- [ ] 暂不支持用户注册和登录
- [ ] 暂不支持收藏和历史记录
- [ ] AI 推荐仅支持文本输入，暂不支持语音或图片

### 技术债务

- [ ] 前端错误处理不够完善
- [ ] 后端日志记录需要优化
- [ ] 数据库索引未优化（小数据量无影响）

### 演示时需避免的操作

- 尝试注册或登录账号 - 可能导致演示中断
- 输入特殊字符或超长文本 - 可能触发错误
- 快速连续请求 - 可能触发 API 限流

---

## 常见问题

### Q: 端口被占用怎么办?

A: 修改 `.env` 中的 `PORT` 变量，或先终止占用端口的进程。

### Q: 数据库连接失败怎么办?

A: 检查 `.env` 中的 `DATABASE_URL` 配置是否正确，确保数据库已启动。

### Q: AI 推荐不响应怎么办?

A: 检查 `.env` 中的 `OPENAI_API_KEY` 是否有效，网络连接是否正常。
```

### 第 4 步：查看生成的 Docker 配置

**为什么**

检查 Docker 配置是否正确，确保可以顺利构建和运行容器。

**操作**

```bash
# 查看 Dockerfile
cat artifacts/backend/Dockerfile

# 查看 docker-compose.yml
cat artifacts/backend/docker-compose.yml
```

**你应该看到**：符合 Docker 最佳实践的配置文件

**Dockerfile 示例**：

```dockerfile
# 基础镜像
FROM node:20-alpine AS builder

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
COPY prisma ./prisma/

# 安装依赖
RUN npm ci --only=production

# 生成 Prisma Client
RUN npx prisma generate

# 复制源码
COPY . .

# 构建
RUN npm run build

# 生产镜像
FROM node:20-alpine AS production

WORKDIR /app

# 安装生产依赖
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# 启动命令
CMD ["npm", "start"]
```

**docker-compose.yml 示例**：

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

### 第 5 步：查看 EAS 配置

**为什么**

检查 Expo EAS 配置是否正确，确保可以顺利构建和发布移动应用。

**操作**

```bash
# 查看 EAS 配置
cat artifacts/client/eas.json
```

**你应该看到**：包含 development、preview、production 三个环境的配置

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

### 第 6 步：验证退出条件

**为什么**

Sisyphus 会验证 Preview Agent 是否满足退出条件，不满足则要求重新执行。

**检查清单**

| 检查项 | 说明 | 通过/失败 |
| ---- | ---- | ---- |
| README 包含安装步骤 | 清晰列出后端和前端所需的依赖安装命令 | [ ] |
| README 包含运行命令 | 分别提供启动后端和前端的命令 | [ ] |
| README 列出访问地址和演示流程 | 说明演示时需要访问的地址和端口 | [ ] |
| Docker 配置可正常构建 | Dockerfile 和 docker-compose.yml 无语法错误 | [ ] |
| 生产环境变量模板完整 | .env.production.example 包含所有必需配置 | [ ] |

**如果失败**：

```bash
# 重新运行 Preview 阶段
factory run preview
```

## 检查点 ✅

**确认你已完成**：

- [ ] Preview 阶段成功执行
- [ ] `artifacts/preview/README.md` 文件存在且内容完整
- [ ] `artifacts/backend/Dockerfile` 文件存在且可构建
- [ ] `artifacts/backend/docker-compose.yml` 文件存在
- [ ] `artifacts/backend/.env.production.example` 文件存在
- [ ] `artifacts/client/eas.json` 文件存在（移动应用）
- [ ] README 包含清晰的安装步骤和运行命令
- [ ] README 包含演示流程和已知问题

## 踩坑提醒

### ⚠️ 陷阱 1：忽略依赖安装步骤

**问题**：README 中只写「启动服务」，没有说明如何安装依赖。

**症状**：新成员按照 README 操作，运行 `npm run dev` 时报错「找不到模块」。

**解决**：Preview Agent 约束「README 必须包含安装步骤」，确保每步都有明确的命令。

**正确示例**：

```bash
# ❌ 错误 - 缺少安装步骤
npm run dev

# ✅ 正确 - 包含完整步骤
npm install
npm run dev
```

### ⚠️ 陷阱 2：Docker 配置使用 latest 标签

**问题**：Dockerfile 中使用 `FROM node:latest` 或 `FROM node:alpine`。

**症状**：每次构建可能使用不同版本的 Node.js，导致环境不一致。

**解决**：Preview Agent 约束「NEVER 使用 latest 作为 Docker 镜像标签，应使用具体版本号」。

**正确示例**：

```dockerfile
# ❌ 错误 - 使用 latest
FROM node:latest

# ❌ 错误 - 未指定具体版本
FROM node:alpine

# ✅ 正确 - 使用具体版本
FROM node:20-alpine
```

### ⚠️ 陷阱 3：环境变量硬编码

**问题**：在 Docker 配置或 EAS 配置中硬编码敏感信息（密码、API Key 等）。

**症状**：敏感信息泄露到代码仓库，存在安全风险。

**解决**：Preview Agent 约束「NEVER 在部署配置中硬编码敏感信息」，使用环境变量模板。

**正确示例**：

```yaml
# ❌ 错误 - 硬编码数据库密码
DATABASE_URL=postgresql://user:password123@host:5432/database

# ✅ 正确 - 使用环境变量
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:5432/${DB_NAME}
```

### ⚠️ 陷阱 4：已知问题隐藏不列

**问题**：README 中没有列出已知问题和限制，夸大产品能力。

**症状**：演示时出现意外，导致尴尬和信任度下降。

**解决**：Preview Agent 约束「NEVER 夸大功能或隐藏缺陷」，主动列出当前版本存在的问题。

**正确示例**：

```markdown
## 已知问题与限制

### 功能限制
- [ ] 暂不支持用户注册和登录
- [ ] AI 推荐可能不准确（取决于 OpenAI API 返回结果）
```

### ⚠️ 陷阱 5：演示流程过于复杂

**问题**：演示流程包含 10+ 个步骤，需要 10 分钟以上。

**症状**：演示者记不住步骤，观众失去耐心。

**解决**：Preview Agent 约束「演示流程应控制在 3-5 分钟，步骤不超过 5 个」。

**正确示例**：

```markdown
### 演示步骤

1. **场景介绍** (30秒)
   - 介绍目标用户和核心问题

2. **功能演示** (3-5分钟)
   - 步骤 1: 用户输入偏好
   - 步骤 2: AI 基于偏好推荐
   - 步骤 3: 用户查看结果

3. **技术亮点** (可选, 1分钟)
   - 实时 AI 推荐
   - 移动端响应式设计
```

## CI/CD 配置模板

Preview Agent 可以参考 `templates/cicd-github-actions.md` 生成 CI/CD 配置，包括：

### 后端 CI 流水线

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

### 前端 CI 流水线

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

## Git Hooks 配置模板

Preview Agent 可以参考 `templates/git-hooks-husky.md` 生成 Git Hooks 配置，包括：

### pre-commit Hook

在提交前运行代码检查和格式化。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# 运行 lint-staged
npx lint-staged

# 检查 TypeScript 类型
echo "📝 Type checking..."
npm run type-check

echo "✅ Pre-commit checks passed!"
```

### commit-msg Hook

校验提交消息格式。

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "📋 Validating commit message..."

npx --no -- commitlint --edit "$1"

echo "✅ Commit message is valid!"
```

## 本课小结

Preview 阶段是流水线的最后一环，负责为生成的应用准备完整的使用和部署文档。它自动生成：

- **运行指南**：清晰的安装步骤、启动命令和演示流程
- **Docker 配置**：Dockerfile 和 docker-compose.yml，支持容器化部署
- **EAS 配置**：Expo EAS 构建配置，支持移动应用发布
- **CI/CD 配置**：GitHub Actions 流水线，支持持续集成和部署
- **Git Hooks**：Husky 配置，支持提交前检查

**关键原则**：

1. **本地优先**：确保任何具有基本开发环境的人都能在本地启动
2. **部署就绪**：提供生产环境部署所需的所有配置文件
3. **用户故事**：设计简短的演示流程，展示核心价值
4. **透明风险**：主动列出当前版本存在的限制或已知问题

完成 Preview 阶段后，你将获得：

- ✅ 完整的运行指南（`README.md`）
- ✅ Docker 容器化配置（`Dockerfile`, `docker-compose.yml`）
- ✅ 生产环境变量模板（`.env.production.example`）
- ✅ Expo EAS 构建配置（`eas.json`）
- ✅ 可选的详细部署指南（`DEPLOYMENT.md`）

## 下一课预告

> 恭喜你！你已经完成了 AI App Factory 的所有 7 个阶段。
>
> 如果你想深入了解流水线的协调机制，可以学习 **[Sisyphus 调度器详解](../orchestrator/)**。
>
> 你会学到：
> - 调度器如何协调流水线执行
> - 权限检查和越权处理机制
> - 失败处理和回滚策略
> - 上下文优化和 Token 节省技巧

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能 | 文件路径 | 行号 |
| ---- | ---- | ---- |
| Preview Agent 定义 | [`source/hyz1992/agent-app-factory/agents/preview.agent.md`](https://github.com/hyz1992/agent-app-factory/blob/main/agents/preview.agent.md) | 1-33 |
| Preview 技能指南 | [`source/hyz1992/agent-app-factory/skills/preview/skill.md`](https://github.com/hyz1992/agent-app-factory/blob/main/skills/preview/skill.md) | 1-583 |
| Pipeline 配置 | [`source/hyz1992/agent-app-factory/pipeline.yaml`](https://github.com/hyz1992/agent-app-factory/blob/main/pipeline.yaml) | 98-111 |
| CI/CD 配置模板 | [`source/hyz1992/agent-app-factory/templates/cicd-github-actions.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/cicd-github-actions.md) | 1-617 |
| Git Hooks 配置模板 | [`source/hyz1992/agent-app-factory/templates/git-hooks-husky.md`](https://github.com/hyz1992/agent-app-factory/blob/main/templates/git-hooks-husky.md) | 1-530 |

**关键约束**：
- **本地优先**：确保任何具有基本开发环境的人都能在本地启动
- **部署就绪**：提供生产环境部署所需的所有配置文件
- **透明风险**：主动列出当前版本存在的限制或已知问题

**必须生成的文件**：
- `artifacts/preview/README.md` - 主运行说明文档
- `artifacts/backend/Dockerfile` - 后端 Docker 配置
- `artifacts/backend/docker-compose.yml` - 开发环境 Docker Compose
- `artifacts/backend/.env.production.example` - 生产环境变量模板
- `artifacts/client/eas.json` - Expo EAS 构建配置

**不要做 (NEVER)**：
- NEVER 忽略依赖安装或配置步骤，否则运行或部署很可能失败
- NEVER 提供与应用无关的额外说明或营销语言
- NEVER 夸大产品能力，隐瞒缺陷或限制
- NEVER 在部署配置中硬编码敏感信息（密码、API Key 等）
- NEVER 忽略健康检查配置，这对生产环境监控至关重要
- NEVER 跳过数据库迁移说明，这是上线的关键步骤
- NEVER 使用 `latest` 作为 Docker 镜像标签，应使用具体版本号
- NEVER 在生产环境使用 SQLite（应迁移到 PostgreSQL）

</details>
