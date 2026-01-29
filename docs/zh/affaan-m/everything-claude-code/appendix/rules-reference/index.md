---
title: "Rules: 8 套规则集详解 | everything-claude-code"
sidebarTitle: "8 套规则速查"
subtitle: "Rules: 8 套规则集详解 | everything-claude-code"
description: "学习 everything-claude-code 的 8 套规则集，包括安全、代码风格、测试、Git 工作流、性能优化、Agent 使用、设计模式和 Hooks 系统。"
tags:
  - "rules"
  - "security"
  - "coding-style"
  - "testing"
  - "git-workflow"
  - "performance"
prerequisite:
  - "start-quickstart"
order: 200
---

# Rules 完整参考：8 套规则集详解

## 学完你能做什么

- 快速查找和理解所有 8 套强制性规则集
- 在开发过程中正确应用安全、代码风格、测试等规范
- 知道何时使用哪个 Agent 来帮助遵守规则
- 理解性能优化策略和 Hooks 系统的工作原理

## 你现在的困境

面对项目中的 8 套规则集，你可能会：

- **记不住所有规则**：security、coding-style、testing、git-workflow... 哪些是必须遵守的？
- **不知道如何应用**：规则提到了不可变模式、TDD 流程，但具体怎么操作？
- **不知道找谁帮忙**：遇到安全问题用哪个 Agent？代码审查又该找谁？
- **性能和安全的权衡**：如何在保证代码质量的同时，优化开发效率？

这份参考文档帮你全面了解每套规则的内容、应用场景和对应的 Agent 工具。

---

## Rules 概览

Everything Claude Code 包含 8 套强制性规则集，每套规则都有明确的目标和应用场景：

| 规则集 | 目标 | 优先级 | 对应 Agent |
|--- | --- | --- | ---|
| **Security** | 防止安全漏洞、敏感数据泄露 | P0 | security-reviewer |
| **Coding Style** | 代码可读、不可变模式、小文件 | P0 | code-reviewer |
| **Testing** | 80%+ 测试覆盖率、TDD 流程 | P0 | tdd-guide |
| **Git Workflow** | 规范提交、PR 流程 | P1 | code-reviewer |
| **Agents** | 正确使用子代理 | P1 | N/A |
| **Performance** | Token 优化、上下文管理 | P1 | N/A |
| **Patterns** | 设计模式、架构最佳实践 | P2 | architect |
| **Hooks** | 理解和使用 Hooks | P2 | N/A |

::: info 规则优先级说明

- **P0（关键）**：必须严格遵守，违反会导致安全风险或代码质量严重下降
- **P1（重要）**：应该遵守，影响开发效率和团队协作
- **P2（建议）**：推荐遵守，提升代码架构和可维护性
:::

---

## 1. Security（安全规则）

### 强制性安全检查

在**任何提交之前**，必须完成以下检查：

- [ ] 无硬编码密钥（API keys、密码、tokens）
- [ ] 所有用户输入已验证
- [ ] SQL 注入预防（参数化查询）
- [ ] XSS 预防（HTML 清理）
- [ ] CSRF 保护已启用
- [ ] 认证/授权已验证
- [ ] 所有端点有速率限制
- [ ] 错误信息不泄露敏感数据

### 密钥管理

**❌ 错误做法**：硬编码密钥

```typescript
const apiKey = "sk-proj-xxxxx"
```

**✅ 正确做法**：使用环境变量

```typescript
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

### 安全响应协议

如果发现安全问题：

1. **立即停止**当前工作
2. 使用 **security-reviewer** agent 进行全面分析
3. 在继续之前修复 CRITICAL 问题
4. 轮换任何暴露的密钥
5. 检查整个代码库是否存在类似问题

::: tip 安全 Agent 使用

使用 `/code-review` 命令会自动触发 security-reviewer 检查，确保代码符合安全规范。
:::

---

## 2. Coding Style（代码风格规则）

### 不可变性（CRITICAL）

**始终创建新对象，绝不修改现有对象**：

**❌ 错误做法**：直接修改对象

```javascript
function updateUser(user, name) {
  user.name = name  // MUTATION!
  return user
}
```

**✅ 正确做法**：创建新对象

```javascript
function updateUser(user, name) {
  return {
    ...user,
    name
  }
}
```

### 文件组织

**多小文件 > 少大文件**：

- **高内聚、低耦合**
- **典型 200-400 行，最大 800 行**
- 从大型组件中提取工具函数
- 按功能/领域组织，而非按类型

### 错误处理

**始终全面处理错误**：

```typescript
try {
  const result = await riskyOperation()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  throw new Error('Detailed user-friendly message')
}
```

### 输入验证

**始终验证用户输入**：

```typescript
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  age: z.number().int().min(0).max(150)
})

const validated = schema.parse(input)
```

### 代码质量检查清单

在标记工作完成前，必须确认：

- [ ] 代码可读且命名清晰
- [ ] 函数小（< 50 行）
- [ ] 文件专注（< 800 行）
- [ ] 无深层嵌套（> 4 层）
- [ ] 正确的错误处理
- [ ] 无 console.log 语句
- [ ] 无硬编码值
- [ ] 无直接修改（使用不可变模式）

---

## 3. Testing（测试规则）

### 最低测试覆盖率：80%

**必须包含所有测试类型**：

1. **单元测试** - 独立函数、工具函数、组件
2. **集成测试** - API 端点、数据库操作
3. **E2E 测试** - 关键用户流程（Playwright）

### 测试驱动开发（TDD）

**强制工作流程**：

1. 先写测试（RED）
2. 运行测试 - 应该失败
3. 编写最小实现（GREEN）
4. 运行测试 - 应该通过
5. 重构（IMPROVE）
6. 验证覆盖率（80%+）

### 测试故障排查

1. 使用 **tdd-guide** agent
2. 检查测试隔离性
3. 验证 mocks 是否正确
4. 修复实现，而非测试（除非测试本身错误）

### Agent 支持

- **tdd-guide** - 主动用于新功能，强制先写测试
- **e2e-runner** - Playwright E2E 测试专家

::: tip 使用 TDD 命令

使用 `/tdd` 命令会自动调用 tdd-guide agent，引导你完成完整的 TDD 流程。
:::

---

## 4. Git Workflow（Git 工作流规则）

### 提交信息格式

```
<type>: <description>

<optional body>
```

**类型**：feat、fix、refactor、docs、test、chore、perf、ci

::: info 提交信息

提交信息中的 attribution 已通过 `~/.claude/settings.json` 全局禁用。
:::

### Pull Request 工作流

创建 PR 时：

1. 分析完整提交历史（不仅仅是最新提交）
2. 使用 `git diff [base-branch]...HEAD` 查看所有变更
3. 起草全面的 PR 摘要
4. 包含测试计划和 TODOs
5. 如果是新分支，使用 `-u` 标志推送

### 功能实现工作流

#### 1. 计划优先

- 使用 **planner** agent 创建实现计划
- 识别依赖和风险
- 分解为多个阶段

#### 2. TDD 方法

- 使用 **tdd-guide** agent
- 先写测试（RED）
- 实现以通过测试（GREEN）
- 重构（IMPROVE）
- 验证 80%+ 覆盖率

#### 3. 代码审查

- 编写代码后立即使用 **code-reviewer** agent
- 修复 CRITICAL 和 HIGH 问题
- 尽可能修复 MEDIUM 问题

#### 4. 提交和推送

- 详细的提交信息
- 遵循 conventional commits 格式

---

## 5. Agents（Agent 规则）

### 可用 Agents

位于 `~/.claude/agents/`：

| Agent | 用途 | 何时使用 |
|--- | --- | --- | ---|
| planner | 实现规划 | 复杂功能、重构 |
| architect | 系统设计 | 架构决策 |
| tdd-guide | 测试驱动开发 | 新功能、Bug 修复 |
| code-reviewer | 代码审查 | 编写代码后 |
| security-reviewer | 安全分析 | 提交前 |
| build-error-resolver | 修复构建错误 | 构建失败时 |
| e2e-runner | E2E 测试 | 关键用户流程 |
| refactor-cleaner | 死代码清理 | 代码维护 |
| doc-updater | 文档更新 | 更新文档 |

### 立即使用 Agent

**无需用户提示**：

1. 复杂功能请求 - 使用 **planner** agent
2. 代码刚编写/修改 - 使用 **code-reviewer** agent
3. Bug 修复或新功能 - 使用 **tdd-guide** agent
4. 架构决策 - 使用 **architect** agent

### 并行任务执行

**始终对独立操作使用并行任务执行**：

| 方式 | 说明 |
|--- | ---|
| ✅ 好：并行执行 | 启动 3 个 agents 并行：Agent 1 (auth.ts 安全分析)、Agent 2 (缓存系统性能审查)、Agent 3 (utils.ts 类型检查) |
| ❌ 坏：顺序执行 | 先执行 agent 1，然后 agent 2，然后 agent 3 |

### 多视角分析

对于复杂问题，使用分角色子代理：

- 事实审查者
- 高级工程师
- 安全专家
- 一致性审查者
- 冗余检查者

---

## 6. Performance（性能优化规则）

### 模型选择策略

**Haiku 4.5**（90% 的 Sonnet 能力，3 倍成本节省）：

- 轻量级 agent，频繁调用
- 结对编程和代码生成
- 多代理系统中的 worker agents

**Sonnet 4.5**（最佳编码模型）：

- 主要开发工作
- 协调多代理工作流
- 复杂编码任务

**Opus 4.5**（最深层推理）：

- 复杂架构决策
- 最大推理需求
- 研究和分析任务

### 上下文窗口管理

**避免使用最后 20% 的上下文窗口**：

- 大规模重构
- 跨多个文件的功能实现
- 复杂交互的调试

**低上下文敏感度任务**：

- 单文件编辑
- 独立工具创建
- 文档更新
- 简单 Bug 修复

### Ultrathink + Plan Mode

对于需要深度推理的复杂任务：

1. 使用 `ultrathink` 进行增强思考
2. 启用 **Plan Mode** 获取结构化方法
3. "重启引擎"进行多轮批评
4. 使用分角色子代理进行多样化分析

### 构建故障排查

如果构建失败：

1. 使用 **build-error-resolver** agent
2. 分析错误信息
3. 逐步修复
4. 每次修复后验证

---

## 7. Patterns（常见模式规则）

### API 响应格式

```typescript
interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}
```

### 自定义 Hooks 模式

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Repository 模式

```typescript
interface Repository<T> {
  findAll(filters?: Filters): Promise<T[]>
  findById(id: string): Promise<T | null>
  create(data: CreateDto): Promise<T>
  update(id: string, data: UpdateDto): Promise<T>
  delete(id: string): Promise<void>
}
```

### 骨架项目

实现新功能时：

1. 搜索经过实战验证的骨架项目
2. 使用并行 agents 评估选项：
   - 安全评估
   - 可扩展性分析
   - 相关性评分
   - 实现规划
3. 克隆最佳匹配作为基础
4. 在已验证的结构中迭代

---

## 8. Hooks（Hooks 系统规则）

### Hook 类型

- **PreToolUse**：工具执行前（验证、参数修改）
- **PostToolUse**：工具执行后（自动格式化、检查）
- **Stop**：会话结束时（最终验证）

### 当前 Hooks（在 ~/.claude/settings.json）

#### PreToolUse

- **tmux 提醒**：建议长时间运行命令使用 tmux（npm、pnpm、yarn、cargo 等）
- **git push 审查**：推送前在 Zed 中打开审查
- **文档阻止器**：阻止创建不必要的 .md/.txt 文件

#### PostToolUse

- **PR 创建**：记录 PR URL 和 GitHub Actions 状态
- **Prettier**：编辑后自动格式化 JS/TS 文件
- **TypeScript 检查**：编辑 .ts/.tsx 文件后运行 tsc
- **console.log 警告**：警告编辑文件中的 console.log

#### Stop

- **console.log 审计**：会话结束前检查所有修改文件中的 console.log

### 自动接受权限

**谨慎使用**：

- 对受信任、明确定义的计划启用
- 探索性工作时禁用
- 永远不要使用 dangerously-skip-permissions 标志
- 改为在 `~/.claude.json` 中配置 `allowedTools`

### TodoWrite 最佳实践

使用 TodoWrite 工具来：

- 跟踪多步骤任务的进度
- 验证对指令的理解
- 启用实时引导
- 显示细粒度实现步骤

Todo 列表揭示：

- 顺序错误的步骤
- 缺失项目
- 额外不必要的项目
- 错误的粒度
- 误解的需求

---

## 下一课预告

> 下一课我们学习 **[Skills 完整参考](../skills-reference/)**。
>
> 你会学到：
> - 11 个技能库的完整参考
> - 编码标准、后端/前端模式、持续学习等技能
> - 如何为不同任务选择合适的技能

---

## 本课小结

Everything Claude Code 的 8 套规则集为开发过程提供了全面的指导：

1. **Security** - 防止安全漏洞和敏感数据泄露
2. **Coding Style** - 确保代码可读、不可变、小文件
3. **Testing** - 强制 80%+ 覆盖率和 TDD 流程
4. **Git Workflow** - 规范提交和 PR 流程
5. **Agents** - 指导正确使用 9 个专业化子代理
6. **Performance** - 优化 Token 使用和上下文管理
7. **Patterns** - 提供常见设计模式和最佳实践
8. **Hooks** - 解释自动化钩子系统的工作原理

记住，这些规则不是束缚，而是帮助你编写高质量、安全、可维护代码的指导。使用对应的 Agents（如 code-reviewer、security-reviewer）可以帮助你自动遵守这些规则。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Security 规则 | [`rules/security.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/security.md) | 1-37 |
| Coding Style 规则 | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | 1-71 |
| Testing 规则 | [`rules/testing.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/testing.md) | 1-31 |
| Git Workflow 规则 | [`rules/git-workflow.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/git-workflow.md) | 1-46 |
| Agents 规则 | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50 |
| Performance 规则 | [`rules/performance.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/performance.md) | 1-48 |
| Patterns 规则 | [`rules/patterns.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/patterns.md) | 1-56 |
| Hooks 规则 | [`rules/hooks.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/hooks.md) | 1-47 |

**关键规则**：
- **Security**: No hardcoded secrets, OWASP Top 10 检查
- **Coding Style**: 不可变模式、文件 < 800 行、函数 < 50 行
- **Testing**: 80%+ 测试覆盖率、TDD 流程强制
- **Performance**: 模型选择策略、上下文窗口管理

**相关 Agents**：
- **security-reviewer**: 安全漏洞检测
- **code-reviewer**: 代码质量和风格审查
- **tdd-guide**: TDD 流程指导
- **planner**: 实现计划

</details>
