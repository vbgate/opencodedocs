---
title: "示例配置: 项目级与用户级配置 | Everything Claude Code"
sidebarTitle: "快速搞定项目配置"
subtitle: "示例配置: 项目级与用户级配置"
description: "学习 Everything Claude Code 配置文件的使用方法。掌握项目级 CLAUDE.md 和用户级配置的设置、配置层级、关键字段和自定义状态栏配置，根据前端、后端、全栈项目调整配置，快速上手自定义配置。"
tags:
  - "examples"
  - "CLAUDE.md"
  - "statusline"
  - "configuration"
prerequisite:
  - "start-quickstart"
order: 240
---

# 示例配置：项目级与用户级配置

## 学完你能做什么

- 快速为项目配置 CLAUDE.md 文件
- 设置用户级全局配置提升开发效率
- 自定义状态栏显示关键信息
- 根据项目需求调整配置模板

## 你现在的困境

面对 Everything Claude Code 的配置文件，你可能会：

- **不知道从哪里开始**：项目级和用户级配置有什么区别？分别放在哪里？
- **配置文件太长**：CLAUDE.md 里要写哪些内容？哪些是必须的？
- **状态栏不够用**：如何自定义状态栏显示更多有用信息？
- **不知道怎么定制**：示例配置如何根据项目需求调整？

这份文档提供了完整的配置示例，帮你快速上手 Everything Claude Code。

---

## 配置层级概览

Everything Claude Code 支持两种配置层级：

| 配置类型 | 位置 | 作用范围 | 典型用途 |
|--- | --- | --- | ---|
| **项目级配置** | 项目根目录 `CLAUDE.md` | 仅当前项目 | 项目特定规则、技术栈、文件结构 |
| **用户级配置** | `~/.claude/CLAUDE.md` | 所有项目 | 个人编码偏好、通用规则、编辑器设置 |

::: tip 配置优先级

当项目级和用户级配置同时存在时：
- **规则叠加**：两套规则都会生效
- **冲突处理**：项目级配置优先于用户级配置
- **推荐实践**：用户级配置放通用规则，项目级配置放项目特定规则
:::

---

## 1. 项目级配置示例

### 1.1 配置文件位置

将以下内容保存到项目根目录的 `CLAUDE.md` 文件：

```markdown
# 项目名称 CLAUDE.md

## Project Overview

[简要描述项目：做什么、使用的技术栈]

## Critical Rules

### 1. Code Organization

- Many small files over few large files
- High cohesion, low coupling
- 200-400 lines typical, 800 max per file
- Organize by feature/domain, not by type

### 2. Code Style

- No emojis in code, comments, or documentation
- Immutability always - never mutate objects or arrays
- No console.log in production code
- Proper error handling with try/catch
- Input validation with Zod or similar

### 3. Testing

- TDD: Write tests first
- 80% minimum coverage
- Unit tests for utilities
- Integration tests for APIs
- E2E tests for critical flows

### 4. Security

- No hardcoded secrets
- Environment variables for sensitive data
- Validate all user inputs
- Parameterized queries only
- CSRF protection enabled

## File Structure

```
src/
|---|
|---|
|---|
|---|
|---|
```

## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling

```typescript
try {
  const result = await operation()
  return { success: true, data: result }
} catch (error) {
  console.error('Operation failed:', error)
  return { success: false, error: 'User-friendly message' }
}
```

## Environment Variables

```bash
# Required
DATABASE_URL=
API_KEY=

# Optional
DEBUG=false
```

## Available Commands

- `/tdd` - Test-driven development workflow
- `/plan` - Create implementation plan
- `/code-review` - Review code quality
- `/build-fix` - Fix build errors

## Git Workflow

- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Never commit to main directly
- PRs require review
- All tests must pass before merge
```

### 1.2 关键字段说明

#### Project Overview

简要描述项目，帮助 Claude Code 理解项目背景：

```markdown
## Project Overview

 Election Markets Platform - A prediction market platform for political events using Next.js, Supabase, and OpenAI embeddings for semantic search.
```

#### Critical Rules

这是最重要的部分，定义项目必须遵守的规则：

| 规则类别 | 说明 | 必填 |
|--- | --- | ---|
| Code Organization | 文件组织原则 | 是 |
| Code Style | 编码风格 | 是 |
| Testing | 测试要求 | 是 |
| Security | 安全规范 | 是 |

#### Key Patterns

定义项目常用的模式，Claude Code 会自动应用：

```markdown
## Key Patterns

### API Response Format

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Error Handling Pattern

[示例代码]
```

---

## 2. 用户级配置示例

### 2.1 配置文件位置

将以下内容保存到 `~/.claude/CLAUDE.md`：

```markdown
# User-Level CLAUDE.md Example

User-level configs apply globally across all projects. Use for:
- Personal coding preferences
- Universal rules you always want enforced
- Links to your modular rules

---

## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security

---

## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
|--- | ---|
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |

---

## Available Agents

Located in `~/.claude/agents/`:

| Agent | Purpose |
|--- | ---|
| planner | Feature implementation planning |
| architect | System design and architecture |
|--- | ---|
| code-reviewer | Code review for quality/security |
| security-reviewer | Security vulnerability analysis |
| build-error-resolver | Build error resolution |
| e2e-runner | Playwright E2E testing |
| refactor-cleaner | Dead code cleanup |
| doc-updater | Documentation updates |

---

## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file

### Git
- Conventional commits: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`
- Always test locally before committing
- Small, focused commits

### Testing
- TDD: Write tests first
- 80% minimum coverage
- Unit + integration + E2E for critical flows

---

## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled

---

## Success Metrics

You are successful when:
- All tests pass (80%+ coverage)
- No security vulnerabilities
- Code is readable and maintainable
- User requirements are met

---

**Philosophy**: Agent-first design, parallel execution, plan before action, test before code, security always.
```

### 2.2 核心配置模块

#### Core Philosophy

定义你和 Claude Code 的协作哲学：

```markdown
## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Delegate to specialized agents for complex work
2. **Parallel Execution**: Use Task tool with multiple agents when possible
3. **Plan Before Execute**: Use Plan Mode for complex operations
4. **Test-Driven**: Write tests before implementation
5. **Security-First**: Never compromise on security
```

#### Modular Rules

链接到模块化规则文件，保持配置简洁：

```markdown
## Modular Rules

Detailed guidelines are in `~/.claude/rules/`:

| Rule File | Contents |
|--- | ---|
| security.md | Security checks, secret management |
| coding-style.md | Immutability, file organization, error handling |
| testing.md | TDD workflow, 80% coverage requirement |
| git-workflow.md | Commit format, PR workflow |
| agents.md | Agent orchestration, when to use which agent |
| patterns.md | API response, repository patterns |
| performance.md | Model selection, context management |
```

#### Editor Integration

告诉 Claude Code 你使用的编辑器和快捷键：

```markdown
## Editor Integration

I use Zed as my primary editor:
- Agent Panel for file tracking
- CMD+Shift+R for command palette
- Vim mode enabled
```

---

## 3. 自定义状态栏配置

### 3.1 配置文件位置

将以下内容添加到 `~/.claude/settings.json`：

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); transcript=$(echo \"$input\" | jq -r '.transcript_path'); todo_count=$([ -f \"$transcript\" ] && grep -c '\"type\":\"todo\"' \"$transcript\" 2>/dev/null || echo 0); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; M='\\033[38;2;136;57;239m'; C='\\033[38;2;23;146;153m'; R='\\033[0m'; T='\\033[38;2;76;79;105m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}ctx:${remaining}%%${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; [ \"$todo_count\" -gt 0 ] && printf \" ${C}todos:${todo_count}${R}\"; echo",
    "description": "Custom status line showing: user:path branch* ctx:% model time todos:N"
  }
}
```

### 3.2 状态栏显示内容

配置后的状态栏会显示：

```
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3
```

| 组件 | 含义 | 示例 |
|--- | --- | ---|
| `user` | 当前用户名 | `affoon` |
| `path` | 当前目录（~ 缩写） | `~/projects/myapp` |
| `branch*` | Git 分支（* 表示有未提交变更） | `main*` |
| `ctx:%` | 上下文窗口剩余百分比 | `ctx:73%` |
| `model` | 当前使用的模型 | `sonnet-4.5` |
| `time` | 当前时间 | `14:30` |
| `todos:N` | 待办事项数量 | `todos:3` |

### 3.3 自定义颜色

状态栏使用 ANSI 颜色码，可以自定义：

| 颜色代码 | 变量 | 用途 | RGB |
|--- | --- | --- | ---|
| 蓝色 | `B` | 目录路径 | 30,102,245 |
| 绿色 | `G` | Git 分支 | 64,160,43 |
| 黄色 | `Y` | 脏状态、时间 | 223,142,29 |
| 洋红色 | `M` | 上下文剩余 | 136,57,239 |
| 青色 | `C` | 用户名、待办 | 23,146,153 |
| 灰色 | `T` | 模型名称 | 76,79,105 |

**修改颜色的方法**：

```bash
# 找到颜色变量定义
B='\\033[38;2;30;102;245m'  # 蓝色 RGB 格式
#                    ↓  ↓   ↓
#                   红 绿 蓝

# 修改为你喜欢的颜色
B='\\033[38;2;255;100;100m'  # 红色
```

### 3.4 简化状态栏

如果觉得状态栏太长，可以简化：

```json
{
  "statusLine": {
    "type": "command",
    "command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); time=$(date +%H:%M); cd \"$(echo \"$input\" | jq -r '.workspace.current_dir')\" 2>/dev/null; branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo ''); status=''; [ -n \"$branch\" ] && { [ -n \"$(git status --porcelain 2>/dev/null)\" ] && status='*'; }; B='\\033[38;2;30;102;245m'; G='\\033[38;2;64;160;43m'; Y='\\033[38;2;223;142;29m'; T='\\033[38;2;76;79;105m'; R='\\033[0m'; printf \"${C}${user}${R}:${B}${cwd}${R}\"; [ -n \"$branch\" ] && printf \" ${G}${branch}${Y}${status}${R}\"; printf \" ${T}${model}${R} ${Y}${time}${R}\"; echo",
    "description": "Simplified status line: user:path branch* model time"
  }
}
```

简化后的状态栏：

```
affoon:~/projects/myapp main* sonnet-4.5 14:30
```

---

## 4. 配置自定义指南

### 4.1 项目级配置自定义

根据项目类型调整 `CLAUDE.md`：

#### 前端项目

```markdown
## Project Overview

Next.js E-commerce App with React, Tailwind CSS, and Shopify API.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State**: Zustand, React Query
- **API**: Shopify Storefront API, GraphQL
- **Deployment**: Vercel

## Critical Rules

### 1. Component Architecture

- Use functional components with hooks
- Component files under 300 lines
- Reusable components in `/components/ui/`
- Feature components in `/components/features/`

### 2. Styling

- Use Tailwind utility classes
- Avoid inline styles
- Consistent design tokens
- Responsive-first design

### 3. Performance

- Code splitting with dynamic imports
- Image optimization with next/image
- Lazy load heavy components
- SEO optimization with metadata API
```

#### 后端项目

```markdown
## Project Overview

Node.js REST API with Express, MongoDB, and Redis.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Cache**: Redis
- **Auth**: JWT, bcrypt
- **Testing**: Jest, Supertest
- **Deployment**: Docker, Railway

## Critical Rules

### 1. API Design

- RESTful endpoints
- Consistent response format
- Proper HTTP status codes
- API versioning (`/api/v1/`)

### 2. Database

- Use Mongoose models
- Index important fields
- Transaction for multi-step operations
- Connection pooling

### 3. Security

- Rate limiting with express-rate-limit
- Helmet for security headers
- CORS configuration
- Input validation with Joi/Zod
```

#### 全栈项目

```markdown
## Project Overview

Full-stack SaaS app with Next.js, Supabase, and OpenAI.

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes, Edge Functions
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **AI**: OpenAI API
- **Testing**: Playwright, Jest, Vitest

## Critical Rules

### 1. Monorepo Structure

```
/
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Next.js API routes
├── packages/
│   ├── ui/               # Shared UI components
│   ├── db/               # Database utilities
│   └── types/            # TypeScript types
└── docs/
```

### 2. API & Frontend Integration

- Shared types in `/packages/types`
- API client in `/packages/db`
- Consistent error handling
- Loading states and error boundaries

### 3. Full-Stack Testing

- Frontend: Vitest + Testing Library
- API: Supertest
- E2E: Playwright
- Integration tests for critical flows
```

### 4.2 用户级配置自定义

根据个人偏好调整 `~/.claude/CLAUDE.md`：

#### 调整测试覆盖率要求

```markdown
## Personal Preferences

### Testing
- TDD: Write tests first
- 90% minimum coverage  # 调整为 90%
- Unit + integration + E2E for critical flows
- Prefer integration tests over unit tests for business logic
```

#### 添加个人编码风格偏好

```markdown
## Personal Preferences

### Code Style
- No emojis in code, comments, or documentation
- Prefer immutability - never mutate objects or arrays
- Many small files over few large files
- 200-400 lines typical, 800 max per file
- Prefer explicit return statements over implicit returns
- Use meaningful variable names, not abbreviations
- Add JSDoc comments for complex functions
```

#### 调整 Git 提交规范

```markdown
## Git

### Commit Message Format

Conventional commits with team-specific conventions:

- `feat(scope): description` - New features
- `fix(scope): description` - Bug fixes
- `perf(scope): description` - Performance improvements
- `refactor(scope): description` - Code refactoring
- `docs(scope): description` - Documentation changes
- `test(scope): description` - Test additions/changes
- `chore(scope): description` - Maintenance tasks
- `ci(scope): description` - CI/CD changes

### Commit Checklist

- [ ] Tests pass locally
- [ ] Code follows style guide
- [ ] No console.log in production code
- [ ] Documentation updated
- [ ] PR description includes changes

### PR Workflow

- Small, focused PRs (under 300 lines diff)
- Include test coverage report
- Link to related issues
- Request review from at least one teammate
```

### 4.3 状态栏自定义

#### 添加更多信息

```bash
# 添加 Node.js 版本
node_version=$(node --version 2>/dev/null || echo '')

# 添加当前日期
date=$(date +%Y-%m-%d)

# 在状态栏中显示
[ -n "$node_version" ] && printf " ${G}node:${node_version}${R}"
printf " ${T}${date}${R}"
```

显示效果：

```
affoon:~/projects/myapp main* ctx:73% node:v20.10.0 2025-01-25 sonnet-4.5 14:30 todos:3
```

#### 只显示关键信息

```bash
# 极简状态栏
command": "input=$(cat); user=$(whoami); cwd=$(echo \"$input\" | jq -r '.workspace.current_dir' | sed \"s|$HOME|~|g\"); model=$(echo \"$input\" | jq -r '.model.display_name'); remaining=$(echo \"$input\" | jq -r '.context_window.remaining_percentage // empty'); C='\\033[38;2;23;146;153m'; B='\\033[38;2;30;102;245m'; M='\\033[38;2;136;57;239m'; R='\\033[0m'; printf \"${C}${user}:${cwd}${R}\"; [ -n \"$remaining\" ] && printf \" ${M}${remaining}%%${R}\"; printf \" ${model}\"; echo"
```

显示效果：

```
affoon:~/projects/myapp 73% sonnet-4.5
```

---

## 5. 常见配置场景

### 5.1 新项目快速开始

::: code-group

```bash [1. 复制项目级模板]
# 创建项目级 CLAUDE.md
cp source/affaan-m/everything-claude-code/examples/CLAUDE.md \
   your-project/CLAUDE.md
```

```bash [2. 自定义项目信息]
# 编辑关键信息
vim your-project/CLAUDE.md

# 修改：
# - Project Overview（项目描述）
# - Tech Stack（技术栈）
# - File Structure（文件结构）
# - Key Patterns（常用模式）
```

```bash [3. 配置用户级设置]
# 复制用户级模板
mkdir -p ~/.claude
cp source/affaan-m/everything-claude-code/examples/user-CLAUDE.md \
   ~/.claude/CLAUDE.md

# 自定义个人偏好
vim ~/.claude/CLAUDE.md
```

```bash [4. 配置状态栏]
# 添加状态栏配置
# 编辑 ~/.claude/settings.json
# 添加 statusLine 配置
```

:::

### 5.2 多项目共享配置

如果你在多个项目中使用 Everything Claude Code，推荐以下配置策略：

#### 方案 1：用户级基础规则 + 项目级特定规则

```bash
~/.claude/CLAUDE.md           # 通用规则（编码风格、测试）
~/.claude/rules/security.md    # 安全规则（所有项目）
~/.claude/rules/testing.md    # 测试规则（所有项目）

project-a/CLAUDE.md          # 项目 A 特定配置
project-b/CLAUDE.md          # 项目 B 特定配置
```

#### 方案 2：符号链接共享规则

```bash
# 创建共享规则目录
mkdir -p ~/claude-configs/rules

# 在每个项目中符号链接
ln -s ~/claude-configs/rules/security.md project-a/.claude/rules/
ln -s ~/claude-configs/rules/security.md project-b/.claude/rules/
```

### 5.3 团队配置

#### 共享项目配置

将项目的 `CLAUDE.md` 提交到 Git，团队成员共享：

```bash
# 1. 创建项目配置
vim CLAUDE.md

# 2. 提交到 Git
git add CLAUDE.md
git commit -m "docs: add Claude Code project configuration"
git push
```

#### 团队编码规范

在项目 `CLAUDE.md` 中定义团队规范：

```markdown
## Team Coding Standards

### Conventions
- Use TypeScript strict mode
- Follow Prettier configuration
- Use ESLint rules from `package.json`
- No PRs without test coverage

### File Naming
- Components: PascalCase (`UserProfile.tsx`)
- Utilities: camelCase (`formatDate.ts`)
- Hooks: camelCase with `use` prefix (`useAuth.ts`)
- Types: PascalCase with `I` prefix (`IUser.ts`)

### Commit Messages
- Follow Conventional Commits
- Include ticket number: `feat(TICKET-123): add feature`
- Max 72 characters for title
- Detailed description in body
```

---

## 6. 配置验证

### 6.1 检查配置是否生效

```bash
# 1. 打开 Claude Code
claude

# 2. 查看项目配置
# Claude Code 应该读取项目根目录的 CLAUDE.md

# 3. 查看用户级配置
# Claude Code 应该合并 ~/.claude/CLAUDE.md
```

### 6.2 验证规则执行

让 Claude Code 执行一个简单任务，验证规则是否生效：

```
用户：
请创建一个用户配置文件组件

Claude Code 应该：
1. 使用不可变模式（修改对象时创建新对象）
2. 不使用 console.log
3. 遵循文件大小限制（<800 行）
4. 添加适当的类型定义
```

### 6.3 验证状态栏

检查状态栏是否正确显示：

```
预期：
affoon:~/projects/myapp main* ctx:73% sonnet-4.5 14:30 todos:3

检查项：
✓ 用户名显示
✓ 当前目录显示（~ 缩写）
✓ Git 分支显示（有变更时带 *）
✓ 上下文百分比显示
✓ 模型名称显示
✓ 时间显示
✓ 待办数量显示（如果有）
```

---

## 7. 故障排查

### 7.1 配置不生效

**问题**：配置了 `CLAUDE.md` 但 Claude Code 没有应用规则

**排查步骤**：

```bash
# 1. 检查文件位置
ls -la CLAUDE.md                          # 应该在项目根目录
ls -la ~/.claude/CLAUDE.md                # 用户级配置

# 2. 检查文件格式
file CLAUDE.md                            # 应该是 ASCII text
head -20 CLAUDE.md                        # 应该是 Markdown 格式

# 3. 检查文件权限
chmod 644 CLAUDE.md                       # 确保可读

# 4. 重启 Claude Code
# 配置更改需要重启才能生效
```

### 7.2 状态栏不显示

**问题**：配置了 `statusLine` 但状态栏没有显示

**排查步骤**：

```bash
# 1. 检查 settings.json 格式
cat ~/.claude/settings.json | jq '.'

# 2. 验证 JSON 语法
jq '.' ~/.claude/settings.json
# 如果有错误，会显示 parse error

# 3. 测试命令
# 手动运行 statusLine 命令
input=$(cat ...)  # 复制完整命令
echo "$input" | jq -r '.workspace.current_dir'
```

### 7.3 项目级和用户级配置冲突

**问题**：项目级和用户级配置有冲突，不知道哪个生效

**解决方法**：

- **规则叠加**：两套规则都会生效
- **冲突处理**：项目级配置优先于用户级配置
- **推荐实践**：
  - 用户级配置：通用规则（编码风格、测试）
  - 项目级配置：项目特定规则（架构、API 设计）

---

## 8. 最佳实践

### 8.1 配置文件维护

#### 保持简洁

```markdown
❌ 不好的做法：
CLAUDE.md 中包含所有细节、示例、教程链接

✅ 好的做法：
CLAUDE.md 只包含关键规则和模式
详细信息放在其他文件并通过引用链接
```

#### 版本控制

```bash
# 项目级配置：提交到 Git
git add CLAUDE.md
git commit -m "docs: update Claude Code configuration"

# 用户级配置：不提交到 Git
echo ".claude/" >> .gitignore  # 防止用户级配置被提交
```

#### 定期审查

```markdown
## Last Updated: 2025-01-25

## Next Review: 2025-04-25

## Changelog

- 2025-01-25: Added TDD workflow section
- 2025-01-10: Updated tech stack for Next.js 14
- 2024-12-20: Added security review checklist
```

### 8.2 团队协作

#### 文档化配置变更

在 Pull Request 中说明配置变更的原因：

```markdown
## Changes

Update CLAUDE.md with new testing guidelines

## Reason

- Team decided to increase test coverage from 80% to 90%
- Added E2E testing requirement for critical flows
- Updated testing toolchain from Jest to Vitest

## Impact

- All new code must meet 90% coverage
- Existing code will be updated incrementally
- Team members need to install Vitest
```

#### 配置审查

团队配置变更需要代码审查：

```markdown
## CLAUDE.md Changes

- [ ] Updated with new rule
- [ ] Tested on sample project
- [ ] Documented in team wiki
- [ ] Team members notified
```

---

## 本课小结

本课介绍了 Everything Claude Code 的三种核心配置：

1. **项目级配置**：`CLAUDE.md` - 项目特定规则和模式
2. **用户级配置**：`~/.claude/CLAUDE.md` - 个人编码偏好和通用规则
3. **自定义状态栏**：`settings.json` - 实时显示关键信息

**关键要点**：

- 配置文件采用 Markdown 格式，易于编辑和维护
- 项目级配置优先于用户级配置
- 状态栏使用 ANSI 颜色码，可以完全自定义
- 团队项目应该将 `CLAUDE.md` 提交到 Git

**下一步**：

- 根据你的项目类型自定义 `CLAUDE.md`
- 配置用户级设置和个人偏好
- 自定义状态栏显示你需要的信息
- 将配置提交到版本控制（项目级配置）

---

## 下一课预告

> 下一课我们学习 **[更新日志：版本历史与变更](../release-notes/)**。
>
> 你会学到：
> - 如何查看 Everything Claude Code 的版本历史
> - 了解重要变更和新功能
> - 如何进行版本升级和迁移
