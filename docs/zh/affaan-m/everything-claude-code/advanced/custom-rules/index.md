---
title: "自定义 Rules: 构建项目规范 | Everything Claude Code"
subtitle: "自定义 Rules: 构建项目规范"
sidebarTitle: "让 Claude 听你的话"
description: "学习自定义 Rules 文件的创建方法。掌握 Rule 格式、检查清单编写、安全规则定制和 Git 工作流集成，让 Claude 自动遵守团队标准。"
tags:
  - "custom-rules"
  - "project-standards"
  - "code-quality"
prerequisite:
  - "start-quick-start"
order: 130
---

# 自定义 Rules：构建项目专属规范

## 学完你能做什么

- 创建自定义 Rules 文件，定义项目专属的编码规范
- 使用检查清单确保代码质量一致性
- 将团队规范集成到 Claude Code 工作流
- 根据项目需求定制不同类型的规则

## 你现在的困境

你遇到过这些问题吗？

- 团队成员代码风格不一致，review 时反复指出相同问题
- 项目有特殊的安全要求，但 Claude 不了解
- 每次写代码都要手动检查是否遵循了团队规范
- 希望 Claude 能自动提醒某些项目特定的最佳实践

## 什么时候用这一招

- **新项目初始化时** - 定义项目专属的编码规范和安全标准
- **团队协作时** - 统一代码风格和质量标准
- **代码审查频繁发现问题后** - 将常见问题固化为规则
- **项目有特殊需求时** - 集成行业规范或技术栈特定规则

## 核心思路

Rules 是项目规范的强制执行层，让 Claude 自动遵守你定义的标准。

### Rules 的作用机制

Rules 文件位于 `rules/` 目录，Claude Code 会在会话开始时自动加载所有规则。每次生成代码或进行审查时，Claude 会根据这些规则进行检查。

::: info Rules 与 Skills 的区别

- **Rules**：强制性检查清单，适用于所有操作（如安全检查、代码风格）
- **Skills**：工作流定义和领域知识，适用于特定任务（如 TDD 流程、架构设计）

Rules 是"必须遵守"的约束，Skills 是"如何做"的指南。
:::

### Rules 的文件结构

每个 Rule 文件遵循标准格式：

```markdown
# 规则标题

## 规则类别
规则说明文字...

### 检查清单
- [ ] 检查项 1
- [ ] 检查项 2

### 代码示例
正确的/错误的代码对比...
```

## 跟我做

### 第 1 步：了解内置规则类型

Everything Claude Code 提供了 8 套内置规则，先了解它们的功能。

**为什么**

了解内置规则可以帮助你确定需要自定义的内容，避免重复造轮子。

**查看内置规则**

在源码的 `rules/` 目录下查看：

```bash
ls rules/
```

你会看到以下 8 个规则文件：

| 规则文件 | 用途 | 适用场景 |
|--- | --- | ---|
| `security.md` | 安全检查 | 涉及 API 密钥、用户输入、数据库操作 |
| `coding-style.md` | 代码风格 | 函数大小、文件组织、不可变模式 |
| `testing.md` | 测试要求 | 测试覆盖率、TDD 流程、测试类型 |
| `performance.md` | 性能优化 | 模型选择、上下文管理、压缩策略 |
| `agents.md` | Agent 使用 | 何时使用哪个 agent、并行执行 |
| `git-workflow.md` | Git 工作流 | 提交格式、PR 流程、分支管理 |
| `patterns.md` | 设计模式 | Repository 模式、API 响应格式、骨架项目 |
| `hooks.md` | Hooks 系统 | Hook 类型、自动接受权限、TodoWrite |

**你应该看到**：
- 每个规则文件都有清晰的标题和分类
- 规则包含检查清单和代码示例
- 规则适用于特定的场景和技术需求

### 第 2 步：创建自定义规则文件

在项目的 `rules/` 目录下创建新的规则文件。

**为什么**

自定义规则可以解决项目特有的问题，让 Claude 遵守团队规范。

**创建规则文件**

假设你的项目使用 Next.js 和 Tailwind CSS，需要定义前端组件规范：

```bash
# 创建规则文件
touch rules/frontend-conventions.md
```

**编辑规则文件**

打开 `rules/frontend-conventions.md`，添加以下内容：

```markdown
# Frontend Conventions

## Component Design
ALL components must follow these conventions:

### Component Structure
- Export default function component
- Use TypeScript interfaces for props
- Keep components focused (<300 lines)
- Use Tailwind utility classes, not custom CSS

### Naming Conventions
- Component files: PascalCase (UserProfile.tsx)
- Component names: PascalCase
- Props interface: `<ComponentName>Props`
- Utility functions: camelCase

### Code Example

\`\`\`typescript
// CORRECT: Following conventions
interface UserProfileProps {
  name: string
  email: string
  avatar?: string
}

export default function UserProfile({ name, email, avatar }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4 p-4">
      {avatar && <img src={avatar} alt={name} className="w-12 h-12 rounded-full" />}
      <div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  )
}
\`\`\`

\`\`\`typescript
// WRONG: Violating conventions
export const UserProfile = (props: any) => {
  return <div>...</div>  // Missing TypeScript, wrong export
}
\`\`\`

### Checklist
Before marking frontend work complete:
- [ ] Components follow PascalCase naming
- [ ] Props interfaces properly typed with TypeScript
- [ ] Components <300 lines
- [ ] Tailwind utility classes used (no custom CSS)
- [ ] Default export used
- [ ] Component file name matches component name
```

**你应该看到**：
- 规则文件使用标准 Markdown 格式
- 清晰的标题和分类（##）
- 代码示例对比（CORRECT vs WRONG）
- 检查清单（checkbox）
- 规则描述简洁明了

### 第 3 步：定义安全相关的自定义规则

如果你的项目有特殊的安全要求，创建专门的安全规则。

**为什么**

内置的 `security.md` 包含通用安全检查，但项目可能有特定的安全需求。

**创建项目安全规则**

创建 `rules/project-security.md`：

```markdown
# Project Security Requirements

## API Authentication
ALL API calls must include authentication:

### JWT Token Management
- Store JWT in httpOnly cookies (not localStorage)
- Validate token expiration on each request
- Refresh tokens automatically before expiration
- Include CSRF protection headers

// CORRECT: JWT in httpOnly cookie
const response = await fetch('/api/users', {
  credentials: 'include',
  headers: {
    'X-CSRF-Token': getCsrfToken()
  }
})

// WRONG: JWT in localStorage (vulnerable to XSS)
const token = localStorage.getItem('jwt')
const response = await fetch('/api/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

## Data Validation
ALL user inputs must be validated server-side:

import { z } from 'zod'
const CreateUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  age: z.number().int().min(18, 'Must be 18 or older')
})
const validatedData = CreateUserSchema.parse(req.body)

## Checklist
Before marking security work complete:
- [ ] API calls use httpOnly cookies for JWT
- [ ] CSRF protection enabled
- [ ] All user inputs validated server-side
- [ ] Sensitive data never logged
- [ ] Rate limiting configured on all endpoints
- [ ] Error messages don't leak sensitive information
```

**你应该看到**：
- 规则针对项目特定的技术栈（JWT、Zod）
- 代码示例展示正确和错误的实现
- 检查清单覆盖所有安全检查项

### 第 4 步：定义项目特定的 Git 工作流规则

如果团队有特殊的 Git 提交规范，可以扩展 `git-workflow.md` 或创建自定义规则。

**为什么**

内置的 `git-workflow.md` 包含基本的提交格式，但团队可能有额外的要求。

**创建 Git 规则**

创建 `rules/team-git-workflow.md`：

```markdown
# Team Git Workflow

## Commit Message Format
Follow Conventional Commits with team-specific conventions:

### Commit Types
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no behavior change)
- `perf`: Performance improvement
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Maintenance tasks
- `team` (custom): Team-specific changes (onboarding, meetings)

### Commit Scope (REQUIRED)
Must include scope in brackets after type:

Format: 

Examples:
- feat(auth): add OAuth2 login
- fix(api): handle 404 errors
- docs(readme): update installation guide
- team(onboarding): add Claude Code setup guide

### Commit Body (Required for breaking changes)

feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses

## Pull Request Requirements

### PR Checklist
Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist
Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated
```


Examples:
feat(auth): add OAuth2 login
fix(api): handle 404 errors
docs(readme): update installation guide
team(onboarding): add Claude Code setup guide
```

### Commit Body (Required for breaking changes)

```
feat(api): add rate limiting

BREAKING CHANGE: API now requires authentication for all endpoints

- Rate limit: 100 requests per minute per IP
- Retry-After header included in 429 responses
```

## Pull Request Requirements

### PR Checklist

Before requesting review:
- [ ] Title follows conventional commits format
- [ ] Description includes test plan
- [ ] All tests passing
- [ ] Code coverage maintained or improved
- [ ] Breaking changes documented
- [ ] Related issues linked

### PR Review Checklist

Before approving:
- [ ] Code follows project coding standards
- [ ] Security checks passed
- [ ] Test coverage >= 80%
- [ ] No TODOs or FIXMEs in production code
- [ ] Documentation updated

## Checklist

Before marking Git work complete:
- [ ] Commit message includes type and scope
- [ ] Breaking changes documented in commit body
- [ ] PR title follows conventional commits format
- [ ] Test plan included in PR description
- [ ] Related issues linked to PR
```

**你应该看到**：
- Git 提交格式包含团队自定义的类型（`team`）
- 强制要求 commit scope
- PR 有明确的检查清单
- 规则适用于团队协作流程

### 第 5 步：验证 Rules 加载

创建规则后，验证 Claude Code 是否正确加载。

**为什么**

确保规则文件格式正确，Claude 能够读取和应用规则。

**验证方法**

1. 启动新的 Claude Code 会话
2. 让 Claude 检查已加载的规则：
   ```
   哪些 Rules 文件已加载？
   ```

3. 测试规则是否生效：
   ```
   创建一个 React 组件，遵循 frontend-conventions 规则
   ```

**你应该看到**：
- Claude 列出所有已加载的 rules（包括自定义规则）
- 生成的代码遵循你定义的规范
- 如果违反规则，Claude 会提示修正

### 第 6 步：集成到 Code Review 流程

让自定义规则在代码审查时自动检查。

**为什么**

代码审查时自动应用规则，确保所有代码都符合标准。

**配置 code-reviewer 引用规则**

确保 `agents/code-reviewer.md` 引用相关规则：

```markdown
---
name: code-reviewer
description: Review code for quality, security, and adherence to standards
---

When reviewing code, check these rules:

1. **Security checks** (rules/security.md)
   - No hardcoded secrets
   - All inputs validated
   - SQL injection prevention
   - XSS prevention

2. **Coding style** (rules/coding-style.md)
   - Immutability
   - File organization
   - Error handling
   - Input validation

3. **Project-specific rules**
   - Frontend conventions (rules/frontend-conventions.md)
   - Project security (rules/project-security.md)
   - Team Git workflow (rules/team-git-workflow.md)

Report findings in this format:
- CRITICAL: Must fix before merge
- HIGH: Should fix before merge
- MEDIUM: Consider fixing
- LOW: Nice to have
```

**你应该看到**：
- code-reviewer agent 在审查时检查所有相关规则
- 报告按照严重程度分类
- 项目特定的规范被纳入审查流程

## 检查点 ✅

- [ ] 已创建至少一个自定义规则文件
- [ ] 规则文件遵循标准格式（标题、分类、代码示例、检查清单）
- [ ] 规则包含正确/错误的代码对比示例
- [ ] 规则文件位于 `rules/` 目录
- [ ] 验证 Claude Code 正确加载规则
- [ ] code-reviewer agent 引用自定义规则

## 踩坑提醒

### ❌ 常见错误 1：规则文件命名不规范

**问题**：规则文件名包含空格或特殊字符，导致 Claude 无法加载。

**修正**：
- ✅ 正确：`frontend-conventions.md`、`project-security.md`
- ❌ 错误：`Frontend Conventions.md`、`project-security(v2).md`

使用小写字母和连字符，避免空格和括号。

### ❌ 常见错误 2：规则过于宽泛

**问题**：规则描述模糊，无法明确判断是否合规。

**修正**：提供具体的检查清单和代码示例：

```markdown
❌ 模糊的规则：组件应该简洁易读

✅ 具体的规则：
- 组件必须 <300 行
- 函数必须 <50 行
- 禁止超过 4 层的嵌套
```

### ❌ 常见错误 3：缺少代码示例

**问题**：只有文字描述，没有展示正确和错误的实现。

**修正**：总是包含代码示例对比：

```markdown
CORRECT: 遵循规范
function example() { ... }

WRONG: 违反规范
function example() { ... }
```

### ❌ 常见错误 4：检查清单不完整

**问题**：检查清单遗漏关键检查项，导致规则无法全面执行。

**修正**：覆盖规则描述的所有方面：

```markdown
检查清单：
- [ ] 检查项 1
- [ ] 检查项 2
- [ ] ... (覆盖所有规则要点)
```

## 本课小结

自定义 Rules 是项目规范化的关键：

1. **了解内置规则** - 8 套标准规则覆盖常见场景
2. **创建规则文件** - 使用标准 Markdown 格式
3. **定义项目规范** - 针对技术栈和团队需求定制
4. **验证加载** - 确保 Claude 正确读取规则
5. **集成审查流程** - 让 code-reviewer 自动检查规则

通过自定义 Rules，你可以让 Claude 自动遵守项目规范，减少代码审查的工作量，提升代码质量一致性。

## 下一课预告

> 下一课我们学习 **[动态上下文注入：Contexts 的使用](../dynamic-contexts/)**。
>
> 你会学到：
> - Contexts 的定义和用途
> - 如何创建自定义 Contexts
> - 在不同工作模式下切换 Contexts
> - Contexts 与 Rules 的区别

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能           | 文件路径                                                                                   | 行号    |
|--- | --- | ---|
| 安全规则       | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37    |
| 代码风格规则   | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71    |
| 测试规则       | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31    |
| 性能优化规则   | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48    |
| Agent 使用规则 | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50    |
| Git 工作流规则 | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46    |
| 设计模式规则   | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56    |
| Hooks 系统规则 | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47    |
| Code Reviewer  | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-200   |

**关键常量**：
- `MIN_TEST_COVERAGE = 80`：最低测试覆盖率要求
- `MAX_FILE_SIZE = 800`：最大文件行数限制
- `MAX_FUNCTION_SIZE = 50`：最大函数行数限制
- `MAX_NESTING_LEVEL = 4`：最大嵌套层级

**关键规则**：
- **Immutability (CRITICAL)**：禁止直接修改对象，使用 spread 运算符
- **Secret Management**：禁止硬编码密钥，使用环境变量
- **TDD Workflow**：要求先写测试，实现，再重构
- **Model Selection**：根据任务复杂度选择 Haiku/Sonnet/Opus

</details>
