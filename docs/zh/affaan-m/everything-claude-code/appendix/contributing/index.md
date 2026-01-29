---
title: "贡献指南: 提交配置 | Everything Claude Code"
sidebarTitle: "提交你的第一个配置"
subtitle: "贡献指南: 提交配置"
description: "学习向 Everything Claude Code 提交配置的规范流程。掌握 Fork 项目、创建分支、遵循格式、本地测试和提交 PR 的步骤，成为贡献者。"
tags:
  - "contributing"
  - "agents"
  - "skills"
  - "commands"
  - "hooks"
  - "rules"
  - "mcp"
  - "github"
prerequisite:
  - "start-installation"
  - "start-quickstart"
order: 230
---

# 贡献指南：如何向项目贡献配置、agent 和 skill

## 学完你能做什么

- 理解项目的贡献流程和规范
- 正确提交 Agents、Skills、Commands、Hooks、Rules 和 MCP 配置
- 遵循代码风格和命名规范
- 避免常见的贡献错误
- 通过 Pull Request 高效地与社区协作

## 你现在的困境

你想为 Everything Claude Code 做贡献，但遇到这些问题：
- "不知道贡献什么内容才有价值"
- "不知道怎么开始第一个 PR"
- "不清楚文件格式和命名规范"
- "担心提交的内容不满足要求"

本教程会给你一份完整的贡献指南，从理念到实操。

## 核心思路

Everything Claude Code 是一个**社区资源**，不是一个人的项目。这个仓库的价值在于：

1. **实战验证** - 所有配置都经过 10+ 个月的生产环境使用
2. **模块化设计** - 每个 Agent、Skill、Command 都是独立可复用的组件
3. **质量优先** - 代码审查和安全审计确保贡献质量
4. **开放协作** - MIT 许可，鼓励贡献和定制

::: tip 为什么贡献有价值
- **知识分享**：你的经验可以帮助其他开发者
- **影响力**：被数百/数千人使用的配置
- **技能提升**：学习项目结构和社区协作
- **网络建设**：与 Anthropic 和 Claude Code 社区连接
:::

## 我们在寻找什么

### Agents

专业化子代理，处理特定领域的复杂任务：

| 类型 | 示例 |
|-----|------|
| 语言专家 | Python, Go, Rust 代码审查 |
| 框架专家 | Django, Rails, Laravel, Spring |
| DevOps 专家 | Kubernetes, Terraform, CI/CD |
| 领域专家 | ML pipelines, data engineering, mobile |

### Skills

工作流定义和领域知识库：

| 类型 | 示例 |
|-----|------|
| 语言最佳实践 | Python, Go, Rust 编码规范 |
| 框架模式 | Django, Rails, Laravel 架构模式 |
| 测试策略 | 单元测试、集成测试、E2E 测试 |
| 架构指南 | 微服务、事件驱动、CQRS |
| 领域知识 | ML、数据分析、移动开发 |

### Commands

斜杠命令，提供快速工作流入口：

| 类型 | 示例 |
|-----|------|
| 部署命令 | 部署到 Vercel, Railway, AWS |
| 测试命令 | 运行单元测试、E2E 测试、覆盖率分析 |
| 文档命令 | 生成 API 文档、更新 README |
| 代码生成命令 | 生成类型、生成 CRUD 模板 |

### Hooks

自动化钩子，在特定事件时触发：

| 类型 | 示例 |
|-----|------|
| Linting/formatting | 代码格式化、lint 检查 |
| 安全检查 | 敏感数据检测、漏洞扫描 |
| 验证钩子 | Git commit 验证、PR 检查 |
| 通知钩子 | Slack/Email 通知 |

### Rules

强制性规则，确保代码质量和安全标准：

| 类型 | 示例 |
|-----|------|
| 安全规则 | 禁止硬编码密钥、OWASP 检查 |
| 代码风格 | 不可变模式、文件大小限制 |
| 测试要求 | 80%+ 覆盖率、TDD 流程 |
| 命名规范 | 变量命名、文件命名 |

### MCP Configurations

MCP 服务器配置，扩展外部服务集成：

| 类型 | 示例 |
|-----|------|
| 数据库集成 | PostgreSQL, MongoDB, ClickHouse |
| 云提供商 | AWS, GCP, Azure |
| 监控工具 | Datadog, New Relic, Sentry |
| 通信工具 | Slack, Discord, Email |

## 如何贡献

### 第 1 步：Fork 项目

**为什么**：你需要自己的副本来进行修改，不影响原仓库。

```bash
# 1. 访问 https://github.com/affaan-m/everything-claude-code
# 2. 点击右上角 "Fork" 按钮
# 3. Clone 你的 fork
git clone https://github.com/YOUR_USERNAME/everything-claude-code.git
cd everything-claude-code

# 4. 添加上游仓库（方便后续同步）
git remote add upstream https://github.com/affaan-m/everything-claude-code.git
```

**你应该看到**：本地 `everything-claude-code` 目录，包含完整的项目文件。

### 第 2 步：创建功能分支

**为什么**：分支隔离你的修改，方便管理和合并。

```bash
# 创建描述性分支名
git checkout -b add-python-reviewer

# 或者使用更具体的命名
git checkout -b feature/django-pattern-skill
git checkout -b fix/hook-tmux-reminder
```

**分支命名规范**：
- `feature/` - 新功能
- `fix/` - Bug 修复
- `docs/` - 文档更新
- `refactor/` - 代码重构

### 第 3 步：添加你的贡献

**为什么**：将文件放在正确的目录，确保 Claude Code 能正确加载。

```bash
# 根据贡献类型选择目录
agents/           # 新的 Agent
skills/           # 新的 Skill（可以是单个 .md 或目录）
commands/         # 新的斜杠命令
rules/            # 新的规则文件
hooks/            # Hook 配置（修改 hooks/hooks.json）
mcp-configs/      # MCP 服务器配置（修改 mcp-configs/mcp-servers.json）
```

::: tip 目录结构
- **单个文件**：直接放在目录下，如 `agents/python-reviewer.md`
- **复杂组件**：创建子目录，如 `skills/coding-standards/`（包含多个文件）
:::

### 第 4 步：遵循格式规范

#### Agent 格式

**为什么**：Front Matter 定义了 Agent 的元数据，Claude Code 依赖这些信息加载 Agent。

```markdown
---
name: python-reviewer
description: Reviews Python code for PEP 8 compliance, type hints, and best practices
tools: Read, Grep, Glob, Bash, Write, Edit
model: sonnet
---

You are a senior Python code reviewer...

Your review should cover:
- PEP 8 style compliance
- Type hints usage
- Docstring completeness
- Security best practices
- Performance optimizations
```

**必填字段**：
- `name`: Agent 标识符（小写连字符）
- `description`: 功能描述
- `tools`: 允许使用的工具列表（逗号分隔）
- `model`: 首选模型（`opus` 或 `sonnet`）

#### Skill 格式

**为什么**：清晰的 Skill 定义更容易被复用和理解。

```markdown
# Python Best Practices

## When to Use

Use this skill when:
- Writing new Python code
- Reviewing Python code
- Refactoring Python modules

## How It Works

Follow these principles:

1. **Type Hints**: Always include type hints for function parameters and return values
2. **Docstrings**: Use Google style docstrings for all public functions
3. **PEP 8**: Follow PEP 8 style guide
4. **Immutability**: Prefer immutable data structures

## Examples

### Good
```python
def process_user_data(user_id: str) -> dict:
    """Process user data and return result.

    Args:
        user_id: The user ID to process

    Returns:
        A dictionary with processed data
    """
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```

### Bad
```python
def process_user_data(user_id):
    user_data = fetch_user(user_id)
    return transform_data(user_data)
```
```

**推荐章节**：
- `When to Use`: 使用场景
- `How It Works`: 工作原理
- `Examples`: 示例（Good vs Bad）
- `References`: 相关资源（可选）

#### Command 格式

**为什么**：清晰的命令描述帮助用户理解功能。

Front Matter（必填）：

```markdown
---
description: Run Python tests with coverage report
---
```

正文内容（可选）：

```markdown
# Test

Run tests for the current project:

Coverage requirements:
- Minimum 80% line coverage
- 100% coverage for critical paths
```

命令示例（可选）：

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_user.py
```

**必填字段**：
- `description`: 简短的功能描述

#### Hook 格式

**为什么**：Hook 需要明确的匹配规则和执行动作。

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(py)$\"",
  "hooks": [
    {
      "type": "command",
      "command": "node -e \"console.log('Python file edited')\""
    }
  ],
  "description": "Triggered when Python files are edited"
}
```

**必填字段**：
- `matcher`: 触发条件表达式
- `hooks`: 执行的动作数组
- `description`: Hook 功能描述

### 第 5 步：测试你的贡献

**为什么**：确保配置在实际使用中能正常工作。

::: warning 重要
在提交 PR 前，**务必**在你的本地环境测试配置。
:::

**测试步骤**：

```bash
# 1. 复制到你的 Claude Code 配置
cp agents/python-reviewer.md ~/.claude/agents/
cp skills/python-patterns/* ~/.claude/skills/

# 2. 在 Claude Code 中测试
# 启动 Claude Code 并使用新配置

# 3. 验证功能
# - Agent 能否被正确调用？
# - Command 能否正确执行？
# - Hook 能否在正确时机触发？
```

**你应该看到**：配置在 Claude Code 中正常工作，无错误或异常。

### 第 6 步：提交 PR

**为什么**：Pull Request 是社区协作的标准方式。

```bash
# 添加所有更改
git add .

# 提交（使用清晰的提交信息）
git commit -m "Add Python code reviewer agent

- Implements PEP 8 compliance checks
- Adds type hints validation
- Includes security best practices
- Tested on real Python projects"

# 推送到你的 fork
git push origin add-python-reviewer
```

**然后在 GitHub 上创建 PR**：

1. 访问你的 fork 仓库
2. 点击 "Compare & pull request"
3. 填写 PR 模板：

```markdown
## What you added
- [ ] Description of what you added

## Why it's useful
- [ ] Why this contribution is valuable

## How you tested it
- [ ] Testing steps you performed

## Related issues
- [ ] Link to any related issues
```

**你应该看到**：PR 创建成功，等待维护者审核。

## 指导原则

### Do（应该做）

✅ **保持配置专注和模块化**
- 每个 Agent/Skill 只做一件事
- 避免功能混杂

✅ **包含清晰的描述**
- Front Matter 描述准确
- 代码注释有帮助

✅ **提交前测试**
- 在本地验证配置
- 确保没有错误

✅ **遵循现有模式**
- 参考现有文件的格式
- 保持代码风格一致

✅ **文档化依赖关系**
- 列出外部依赖
- 说明安装要求

### Don't（不应该做）

❌ **包含敏感数据**
- API keys, tokens
- 硬编码路径
- 个人凭据

❌ **添加过于复杂或小众的配置**
- 通用性优先
- 避免过度设计

❌ **提交未经测试的配置**
- 测试是必须的
- 提供 testing steps

❌ **创建重复功能**
- 搜索现有配置
- 避免重复造轮子

❌ **添加依赖特定付费服务的配置**
- 提供免费替代方案
- 或使用开源工具

## 文件命名规范

**为什么**：统一的命名规范使项目更易维护。

### 命名规则

| 规则 | 示例 |
|-----|------|
| 使用小写 | `python-reviewer.md` |
| 使用连字符分隔 | `tdd-workflow.md` |
| 描述性命名 | `django-pattern-skill.md` |
| 避免模糊名称 | ❌ `workflow.md` → ✅ `tdd-workflow.md` |

### 匹配原则

文件名应该与 Agent/Skill/Command 名称保持一致：

```bash
# Agent
agents/python-reviewer.md          # name: python-reviewer

# Skill
skills/django-patterns/SKILL.md    # # Django Patterns

# Command
commands/test.md                   # # Test
```

::: tip 命名技巧
- 使用行业术语（如 "PEP 8", "TDD", "REST"）
- 避免缩写（除非是标准缩写）
- 保持简洁但描述性
:::

## 贡献流程检查清单

在提交 PR 前，确保满足以下条件：

### 代码质量
- [ ] 遵循现有代码风格
- [ ] 包含必要的 Front Matter
- [ ] 有清晰的描述和文档
- [ ] 在本地测试通过

### 文件规范
- [ ] 文件名符合命名规范
- [ ] 文件放在正确的目录
- [ ] JSON 格式正确（如有）
- [ ] 无敏感数据

### PR 质量
- [ ] PR 标题清晰描述改动
- [ ] PR 描述包含 "What", "Why", "How"
- [ ] 链接相关 issue（如有）
- [ ] 提供 testing steps

### 社区规范
- [ ] 确保没有重复功能
- [ ] 提供替代方案（如涉及付费服务）
- [ ] 响应 review 意见
- [ ] 保持友好和建设性的讨论

## 常见问题

### Q: 如何知道贡献什么有价值？

**A**: 从你自己的需求开始：
- 你最近遇到过什么问题？
- 你使用了什么解决方案？
- 这个方案是否可以复用？

也可以查看项目 Issues：
- 未解决的 feature requests
- Enhancement suggestions
- Bug reports

### Q: 贡献会被拒绝吗？

**A**: 可能，但这是正常的。常见原因：
- 功能已存在
- 配置不符合规范
- 缺少测试
- 安全或隐私问题

维护者会提供详细的反馈，你可以根据反馈修改后重新提交。

### Q: 如何跟进 PR 状态？

**A**: 
1. 在 GitHub PR 页面查看状态
2. 关注 review comments
3. 响应维护者的反馈
4. 根据需要更新 PR

### Q: 可以贡献 Bug 修复吗？

**A**: 当然可以！Bug 修复是最有价值的贡献之一：
1. 在 Issues 中搜索或创建新 issue
2. Fork 项目并修复 Bug
3. 添加测试（如果需要）
4. 提交 PR，在描述中引用 issue

### Q: 如何保持 fork 与上游同步？

**A**:

```bash
# 1. 添加上游仓库（如果还没有）
git remote add upstream https://github.com/affaan-m/everything-claude-code.git

# 2. 获取上游更新
git fetch upstream

# 3. 合并上游更新到你的 main 分支
git checkout main
git merge upstream/main

# 4. 将更新推送到你的 fork
git push origin main

# 5. 重新基于最新的 main 分支
git checkout your-feature-branch
git rebase main
```

## 联系方式

如果你有任何问题或需要帮助：

- **Open an Issue**: [GitHub Issues](https://github.com/affaan-m/everything-claude-code/issues)
- **Twitter**: [@affaanmustafa](https://x.com/affaanmustafa)
- **Email**: 通过 GitHub 联系

::: tip 提问建议
- 先搜索现有 Issues 和 Discussions
- 提供清晰的上下文和复现步骤
- 保持礼貌和建设性
:::

## 本课小结

本课系统讲解了 Everything Claude Code 的贡献流程和规范：

**核心理念**：
- 社区资源，共同建设
- 实战验证，质量优先
- 模块化设计，易于复用
- 开放协作，知识分享

**贡献类型**：
- **Agents**: 专业化子代理（语言、框架、DevOps、领域专家）
- **Skills**: 工作流定义和领域知识库
- **Commands**: 斜杠命令（部署、测试、文档、代码生成）
- **Hooks**: 自动化钩子（linting、安全检查、验证、通知）
- **Rules**: 强制性规则（安全、代码风格、测试、命名）
- **MCP Configurations**: MCP 服务器配置（数据库、云、监控、通信）

**贡献流程**：
1. Fork 项目
2. 创建功能分支
3. 添加贡献内容
4. 遵循格式规范
5. 本地测试
6. 提交 PR

**格式规范**：
- Agent: Front Matter + 描述 + 指令
- Skill: When to Use + How It Works + Examples
- Command: Description + 使用示例
- Hook: Matcher + Hooks + Description

**指导原则**：
- **Do**: 专注、清晰、测试、遵循模式、文档化
- **Don't**: 敏感数据、复杂小众、未测试、重复、付费依赖

**文件命名**：
- 小写 + 连字符
- 描述性命名
- 与 Agent/Skill/Command 名称一致

**检查清单**：
- 代码质量、文件规范、PR 质量、社区规范

## 下一课预告

> 下一课我们学习 **[示例配置：项目级与用户级配置](../examples/)**。
>
> 你会学到：
> - 项目级配置的最佳实践
> - 用户级配置的个性化设置
> - 如何自定义配置适应特定项目
> - 实际项目的配置示例

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能          | 文件路径                                                                                     | 行号  |
| ------------- | -------------------------------------------------------------------------------------------- | ----- |
| 贡献指南      | [`CONTRIBUTING.md`](https://github.com/affaan-m/everything-claude-code/blob/main/CONTRIBUTING.md)           | 1-192 |
| Agent 示例    | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | -     |
| Skill 示例    | [`skills/coding-standards/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/coding-standards/SKILL.md) | -     |
| Command 示例  | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md)           | -     |
| Hook 配置     | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json)     | 1-158 |
| Rule 示例     | [`rules/coding-style.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/coding-style.md) | -     |
| MCP 配置示例  | [`mcp-configs/mcp-servers.json`](https://github.com/affaan-m/everything-claude-code/blob/main/mcp-configs/mcp-servers.json) | 1-92  |
| 示例配置      | [`examples/CLAUDE.md`](https://github.com/affaan-m/everything-claude-code/blob/main/examples/CLAUDE.md) | -     |

**关键 Front Matter 字段**：
- `name`: Agent/Skill/Command 标识符
- `description`: 功能描述
- `tools`: 允许使用的工具（Agent）
- `model`: 首选模型（Agent，可选）

**关键目录结构**：
- `agents/`: 9 个专业化子代理
- `skills/`: 11 个工作流定义
- `commands/`: 14 个斜杠命令
- `rules/`: 8 套规则集
- `hooks/`: 自动化钩子配置
- `mcp-configs/`: MCP 服务器配置
- `examples/`: 示例配置文件

**贡献相关链接**：
- GitHub Issues: https://github.com/affaan-m/everything-claude-code/issues
- Twitter: https://x.com/affaanmustafa

</details>
