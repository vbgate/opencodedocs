---
title: "Agent 故障排查: 诊断与修复 | Everything Claude Code"
sidebarTitle: "Agent 挂了怎么办"
subtitle: "Agent 故障排查: 诊断与修复"
description: "学习 Everything Claude Code Agent 调用失败的排查方法。涵盖 Agent 未加载、配置错误、工具权限不足、调用超时等常见故障的诊断与解决，帮助你掌握系统化调试技巧。"
tags:
  - "agents"
  - "troubleshooting"
  - "faq"
prerequisite:
  - "platforms-agents-overview"
order: 170
---

# Agent 调用失败排查

## 你遇到的问题

使用 Agent 时遇到困难？你可能会遇到以下情况：

- 输入 `/plan` 或其他命令，Agent 没有被调用
- 看到错误消息："Agent not found"
- Agent 执行超时或卡住
- Agent 输出不符合预期
- Agent 没有按照规则工作

别担心，这些问题通常都有明确的解决方法。本课帮你系统地排查和修复 Agent 相关问题。

## 🎒 开始前的准备

::: warning 前置检查
确保你已经：
1. ✅ 完成了 Everything Claude Code 的[安装](../../start/installation/)
2. ✅ 了解 [Agents 概念](../../platforms/agents-overview/)和 9 个专业化子代理
3. ✅ 尝试调用过 Agent（如 `/plan`、`/tdd`、`/code-review`）
:::

---

## 常见问题 1：Agent 完全不被调用

### 症状
输入 `/plan` 或其他命令，但 Agent 没有被触发，只是普通聊天。

### 可能原因

#### 原因 A：Agent 文件路径错误

**问题**：Agent 文件没有放在正确的位置，Claude Code 找不到。

**解决方案**：

检查 Agent 文件的位置是否正确：

```bash
# 应该在以下位置之一：
~/.claude/agents/              # 用户级配置（全局）
.claude/agents/                 # 项目级配置
```

**检查方法**：

```bash
# 查看用户级配置
ls -la ~/.claude/agents/

# 查看项目级配置
ls -la .claude/agents/
```

**应该看到 9 个 Agent 文件**：
- `planner.md`
- `architect.md`
- `tdd-guide.md`
- `code-reviewer.md`
- `security-reviewer.md`
- `build-error-resolver.md`
- `e2e-runner.md`
- `refactor-cleaner.md`
- `doc-updater.md`

**如果文件不存在**，从 Everything Claude Code 插件目录复制：

```bash
# 假设插件安装在 ~/.claude-plugins/
cp ~/.claude-plugins/everything-claude-code/agents/*.md ~/.claude/agents/

# 或者从克隆的仓库复制
cp everything-claude-code/agents/*.md ~/.claude/agents/
```

#### 原因 B：Command 文件缺失或路径错误

**问题**：Command 文件（如 `/plan` 对应的 `plan.md`）不存在或路径错误。

**解决方案**：

检查 Command 文件的位置：

```bash
# Commands 应该在以下位置之一：
~/.claude/commands/             # 用户级配置（全局）
.claude/commands/                # 项目级配置
```

**检查方法**：

```bash
# 查看用户级配置
ls -la ~/.claude/commands/

# 查看项目级配置
ls -la .claude/commands/
```

**应该看到 14 个 Command 文件**：
- `plan.md` → 调用 `planner` agent
- `tdd.md` → 调用 `tdd-guide` agent
- `code-review.md` → 调用 `code-reviewer` agent
- `build-fix.md` → 调用 `build-error-resolver` agent
- `e2e.md` → 调用 `e2e-runner` agent
- 等等...

**如果文件不存在**，复制 Command 文件：

```bash
cp ~/.claude-plugins/everything-claude-code/commands/*.md ~/.claude/commands/
```

#### 原因 C：插件未正确加载

**问题**：通过插件市场安装，但插件未被正确加载。

**解决方案**：

检查 `~/.claude/settings.json` 中的插件配置：

```bash
# 查看插件配置
cat ~/.claude/settings.json | jq '.enabledPlugins'
```

**应该看到**：

```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**如果未启用**，手动添加：

```bash
# 编辑 settings.json
nano ~/.claude/settings.json

# 添加或修改 enabledPlugins 字段
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

**重启 Claude Code 使配置生效**。

---

## 常见问题 2：Agent 调用报错 "Agent not found"

### 症状
输入命令后，看到错误消息："Agent not found" 或 "Could not find agent: xxx"。

### 可能原因

#### 原因 A：Command 文件中的 Agent 名称不匹配

**问题**：Command 文件中的 `invokes` 字段与 Agent 文件名不匹配。

**解决方案**：

检查 Command 文件中的 `invokes` 字段：

```bash
# 查看某个 Command 文件
cat ~/.claude/commands/plan.md | grep -A 5 "invokes"
```

**Command 文件结构**（以 `plan.md` 为例）：

```markdown
---
description: Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.
---

# Plan Command

This command invokes **planner** agent...
```

**验证 Agent 文件是否存在**：

Command 文件中提到的 agent 名称（如 `planner`）必须对应一个文件：`planner.md`

```bash
# 验证 Agent 文件存在
ls -la ~/.claude/agents/planner.md

# 如果不存在，检查是否有类似名称的文件
ls -la ~/.claude/agents/ | grep -i plan
```

**常见不匹配示例**：

| Command invokes | 实际 Agent 文件名 | 问题 |
|----------------|-------------------|------|
| `planner` | `planner.md` | ✅ 正确 |
| `planner` | `Planner.md` | ❌ 大小写不匹配（Unix 系统区分大小写） |
| `planner` | `planner.md.backup` | ❌ 文件扩展名错误 |
| `tdd-guide` | `tdd_guide.md` | ❌ 连字符 vs 下划线 |

#### 原因 B：Agent 文件名错误

**问题**：Agent 文件名与预期不符。

**解决方案**：

检查所有 Agent 文件名：

```bash
# 列出所有 Agent 文件
ls -la ~/.claude/agents/

# 预期的 9 个 Agent 文件
# planner.md
# architect.md
# tdd-guide.md
# code-reviewer.md
# security-reviewer.md
# build-error-resolver.md
# e2e-runner.md
# refactor-cleaner.md
# doc-updater.md
```

**如果文件名不正确**，重命名文件：

```bash
# 示例：修复文件名
cd ~/.claude/agents/
mv Planner.md planner.md
mv tdd_guide.md tdd-guide.md
```

---

## 常见问题 3：Agent Front Matter 格式错误

### 症状
Agent 被调用，但看到错误消息："Invalid agent metadata" 或类似格式错误。

### 可能原因

#### 原因 A：缺少必需字段

**问题**：Agent Front Matter 缺少必需字段（`name`、`description`、`tools`）。

**解决方案**：

检查 Agent Front Matter 格式：

```bash
# 查看某个 Agent 文件的头部
head -20 ~/.claude/agents/planner.md
```

**正确的 Front Matter 格式**：

```markdown
---
name: planner
description: Expert planning specialist for complex features and refactoring. Use PROACTIVELY when users request feature implementation, architectural changes, or complex refactoring. Automatically activated for planning tasks.
tools: Read, Grep, Glob
model: opus
---
```

**必需字段**：
- `name`：Agent 名称（必须与文件名匹配，不含扩展名）
- `description`：Agent 描述（用于理解 Agent 的职责）
- `tools`：允许使用的工具列表（逗号分隔）

**可选字段**：
- `model`：首选模型（`opus` 或 `sonnet`）

#### 原因 B：Tools 字段错误

**问题**：`tools` 字段使用了错误的工具名称或格式。

**解决方案**：

检查 `tools` 字段：

```bash
# 提取 tools 字段
grep "^tools:" ~/.claude/agents/*.md
```

**允许的工具名称**（区分大小写）：
- `Read`
- `Write`
- `Edit`
- `Bash`
- `Grep`
- `Glob`

**常见错误**：

| 错误写法 | 正确写法 | 问题 |
|---------|---------|------|
| `tools: read, grep, glob` | `tools: Read, Grep, Glob` | ❌ 大小写错误 |
| `tools: Read, Grep, Glob,` | `tools: Read, Grep, Glob` | ❌ 尾部逗号（YAML 语法错误） |
| `tools: "Read, Grep, Glob"` | `tools: Read, Grep, Glob` | ❌ 不需要引号包裹 |
| `tools: Read Grep Glob` | `tools: Read, Grep, Glob` | ❌ 缺少逗号分隔 |

#### 原因 C：YAML 语法错误

**问题**：Front Matter YAML 格式错误（如缩进、引号、特殊字符）。

**解决方案**：

验证 YAML 格式：

```bash
# 使用 Python 验证 YAML
python3 -c "import yaml; yaml.safe_load(open('~/.claude/agents/planner.md'))"

# 或使用 yamllint（需要安装）
pip install yamllint
yamllint ~/.claude/agents/*.md
```

**常见 YAML 错误**：
- 缩进不一致（YAML 对缩进敏感）
- 冒号后缺少空格：`name:planner` → `name: planner`
- 字符串中包含未转义的特殊字符（如冒号、井号）
- 使用了 Tab 缩进（YAML 只接受空格）

---

## 常见问题 4：Agent 执行超时或卡住

### 症状
Agent 开始执行，但长时间无响应或卡住。

### 可能原因

#### 原因 A：任务复杂度过高

**问题**：请求的任务过于复杂，超出 Agent 的处理能力。

**解决方案**：

**将任务拆分为更小的步骤**：

```
❌ 错误：一次性要求 Agent 处理整个项目
"帮我重构整个用户认证系统，包括所有测试和文档"

✅ 正确：分步骤执行
第 1 步：/plan 重构用户认证系统
第 2 步：/tdd 实现第一步（登录 API）
第 3 步：/tdd 实现第二步（注册 API）
...
```

**使用 `/plan` 命令先规划**：

```
用户：/plan 我需要重构用户认证系统

Agent (planner):
# Implementation Plan: Refactor User Authentication System

## Phase 1: Audit Current Implementation
- Review existing auth code
- Identify security issues
- List dependencies

## Phase 2: Design New System
- Define authentication flow
- Choose auth method (JWT, OAuth, etc.)
- Design API endpoints

## Phase 3: Implement Core Features
[详细步骤...]

**WAITING FOR CONFIRMATION**: Proceed with this plan? (yes/no/modify)
```

#### 原因 B：模型选择不当

**问题**：任务复杂度高，但使用了较弱的模型（如 `sonnet` 而非 `opus`）。

**解决方案**：

检查 Agent 的 `model` 字段：

```bash
# 查看所有 Agent 使用的模型
grep "^model:" ~/.claude/agents/*.md
```

**推荐配置**：
- **推理密集型任务**（如 `planner`、`architect`）：使用 `opus`
- **代码生成/修改**（如 `tdd-guide`、`code-reviewer`）：使用 `opus`
- **简单任务**（如 `refactor-cleaner`）：可以使用 `sonnet`

**修改模型配置**：

编辑 Agent 文件：

```markdown
---
name: my-custom-agent
description: Custom agent for...
tools: Read, Write, Edit, Bash, Grep
model: opus  # 使用 opus 提升复杂任务性能
---
```

#### 原因 C：文件读取过多

**问题**：Agent 读取了大量文件，超出 Token 限制。

**解决方案**：

**限制 Agent 读取的文件范围**：

```
❌ 错误：让 Agent 读取整个项目
"阅读项目中所有文件，然后分析架构"

✅ 正确：指定相关文件
"阅读 src/auth/ 目录下的文件，分析认证系统架构"
```

**使用 Glob 模式精确匹配**：

```
用户：请帮我优化性能

Agent 应该：
# 使用 Glob 找到性能关键文件
Glob pattern="**/*.{ts,tsx}" path="src/api"

# 而不是
Glob pattern="**/*" path="."  # 读取所有文件
```

---

## 常见问题 5：Agent 输出不符合预期

### 症状
Agent 被调用并执行，但输出不符合预期或质量不高。

### 可能原因

#### 原因 A：任务描述不清晰

**问题**：用户的请求模糊，Agent 无法准确理解需求。

**解决方案**：

**提供清晰、具体的任务描述**：

```
❌ 错误：模糊的请求
"帮我优化代码"

✅ 正确：具体的请求
"帮我优化 src/api/markets.ts 中的 searchMarkets 函数，
提升查询性能，目标是将响应时间从 500ms 降低到 100ms 以下"
```

**包含以下信息**：
- 具体的文件或函数名
- 明确的目标（性能、安全性、可读性等）
- 限制条件（不能破坏现有功能、必须保持兼容性等）

#### 原因 B：缺少上下文

**问题**：Agent 缺少必要的上下文信息，无法做出正确决策。

**解决方案**：

**主动提供背景信息**：

```
用户：请帮我修复测试失败

❌ 错误：没有上下文
"npm test 报错了，帮我修一下"

✅ 正确：提供完整上下文
"运行 npm test 时，searchMarkets 测试失败了。
错误信息是：Expected 5 but received 0。
我刚才修改了 vectorSearch 函数，可能与此相关。
请帮我定位问题并修复。"
```

**使用 Skills 提供领域知识**：

如果项目有特定的技能库（`~/.claude/skills/`），Agent 会自动加载相关知识。

#### 原因 C：Agent 专业领域不匹配

**问题**：使用了不合适的 Agent 处理任务。

**解决方案**：

**根据任务类型选择正确的 Agent**：

| 任务类型 | 推荐使用 | Command |
|---------|---------|---------|
| 实现新功能 | `tdd-guide` | `/tdd` |
| 复杂功能规划 | `planner` | `/plan` |
| 代码审查 | `code-reviewer` | `/code-review` |
| 安全审计 | `security-reviewer` | 手动调用 |
| 修复构建错误 | `build-error-resolver` | `/build-fix` |
| E2E 测试 | `e2e-runner` | `/e2e` |
| 清理死代码 | `refactor-cleaner` | `/refactor-clean` |
| 更新文档 | `doc-updater` | `/update-docs` |
| 系统架构设计 | `architect` | 手动调用 |

**查看 [Agent 概览](../../platforms/agents-overview/) 了解每个 Agent 的职责**。

---

## 常见问题 6：Agent 工具权限不足

### 症状
Agent 尝试使用某个工具时被拒绝，看到错误："Tool not available: xxx"。

### 可能原因

#### 原因 A：Tools 字段缺少该工具

**问题**：Agent 的 Front Matter 中的 `tools` 字段没有包含需要的工具。

**解决方案**：

检查 Agent 的 `tools` 字段：

```bash
# 查看 Agent 允许使用的工具
grep -A 1 "^tools:" ~/.claude/agents/planner.md
```

**如果缺少工具**，添加到 `tools` 字段：

```markdown
---
name: my-custom-agent
description: Agent that needs to write code
tools: Read, Write, Edit, Grep, Glob  # 确保包含 Write 和 Edit
model: opus
---
```

**工具使用场景**：
- `Read`：读取文件内容（几乎所有 Agent 都需要）
- `Write`：创建新文件
- `Edit`：编辑现有文件
- `Bash`：执行命令（如运行测试、构建）
- `Grep`：搜索文件内容
- `Glob`：查找文件路径

#### 原因 B：工具名称拼写错误

**问题**：`tools` 字段中使用了错误的工具名称。

**解决方案**：

**验证工具名称拼写**（区分大小写）：

| ✅ 正确 | ❌ 错误 |
|---------|---------|
| `Read` | `read`、`READ` |
| `Write` | `write`、`WRITE` |
| `Edit` | `edit`、`EDIT` |
| `Bash` | `bash`、`BASH` |
| `Grep` | `grep`、`GREP` |
| `Glob` | `glob`、`GLOB` |

---

## 常见问题 7：Proactive Agent 未自动触发

### 症状
某些 Agent 应该自动触发（如代码修改后自动调用 `code-reviewer`），但没有。

### 可能原因

#### 原因 A：触发条件不满足

**问题**：Agent 的描述中标记了 `Use PROACTIVELY`，但触发条件未满足。

**解决方案**：

检查 Agent 的 `description` 字段：

```bash
# 查看 Agent 描述
grep "^description:" ~/.claude/agents/code-reviewer.md
```

**示例（code-reviewer）**：

```markdown
description: Reviews code for quality, security, and maintainability. Use PROACTIVELY when users write or modify code.
```

**Proactive 触发条件**：
- 用户明确请求代码审查
- 刚完成代码编写/修改
- 准备提交代码前

**手动触发**：

如果自动触发不工作，可以手动调用：

```
用户：请帮我审查刚才的代码

或者使用 Command：
用户：/code-review
```

---

## 诊断工具和技巧

### 检查 Agent 加载状态

查看 Claude Code 是否正确加载了所有 Agent：

```bash
# 查看 Claude Code 日志（如果可用）
# macOS/Linux
tail -f ~/Library/Logs/claude-code/claude-code.log | grep -i agent

# Windows
Get-Content "$env:APPDATA\claude-code\logs\claude-code.log" -Wait | Select-String "agent"
```

### 手动测试 Agent

在 Claude Code 中手动测试 Agent 调用：

```
用户：请调用 planner agent 帮我规划一个新功能

# 观察 Agent 是否被正确调用
# 查看输出是否符合预期
```

### 验证 Front Matter 格式

使用 Python 验证所有 Agent 的 Front Matter：

```bash
#!/bin/bash

for file in ~/.claude/agents/*.md; do
    echo "Validating $file..."
    python3 << EOF
import yaml
import sys

try:
    with open('$file', 'r') as f:
        content = f.read()
        # Extract front matter (between ---)
        start = content.find('---')
        end = content.find('---', start + 3)
        if start == -1 or end == -1:
            print("Error: No front matter found")
            sys.exit(1)
        
        front_matter = content[start + 3:end].strip()
        metadata = yaml.safe_load(front_matter)
        
        # Check required fields
        required = ['name', 'description', 'tools']
        for field in required:
            if field not in metadata:
                print(f"Error: Missing required field '{field}'")
                sys.exit(1)
        
        print("✅ Valid")
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF
done
```

保存为 `validate-agents.sh`，运行：

```bash
chmod +x validate-agents.sh
./validate-agents.sh
```

---

## 检查点 ✅

按以下清单逐一检查：

- [ ] Agent 文件在正确位置（`~/.claude/agents/` 或 `.claude/agents/`）
- [ ] Command 文件在正确位置（`~/.claude/commands/` 或 `.claude/commands/`）
- [ ] Agent Front Matter 格式正确（包含 name、description、tools）
- [ ] Tools 字段使用正确的工具名称（区分大小写）
- [ ] Command 的 `invokes` 字段与 Agent 文件名匹配
- [ ] 插件在 `~/.claude/settings.json` 中正确启用
- [ ] 任务描述清晰、具体
- [ ] 选择了合适的 Agent 处理任务

---

## 何时需要帮助

如果以上方法都无法解决问题：

1. **收集诊断信息**：
   ```bash
   # 输出以下信息
   echo "Claude Code version: $(claude-code --version 2>/dev/null || echo 'N/A')"
   echo "Agent files:"
   ls -la ~/.claude/agents/
   echo "Command files:"
   ls -la ~/.claude/commands/
   echo "Plugin config:"
   cat ~/.claude/settings.json | jq '.enabledPlugins'
   ```

2. **查看 GitHub Issues**：
   - 访问 [Everything Claude Code Issues](https://github.com/affaan-m/everything-claude-code/issues)
   - 搜索相似问题

3. **提交 Issue**：
   - 包含完整的错误消息
   - 提供操作系统和版本信息
   - 附上相关 Agent 和 Command 文件内容

---

## 本课小结

Agent 调用失败通常有以下几类原因：

| 问题类型 | 常见原因 | 快速排查 |
|---------|---------|---------|
| **完全不被调用** | Agent/Command 文件路径错误、插件未加载 | 检查文件位置、验证插件配置 |
| **Agent not found** | 名称不匹配（Command invokes vs 文件名） | 验证文件名和 invokes 字段 |
| **格式错误** | Front Matter 缺少字段、YAML 语法错误 | 检查必需字段、验证 YAML 格式 |
| **执行超时** | 任务复杂度高、模型选择不当 | 拆分任务、使用 opus 模型 |
| **输出不符合预期** | 任务描述不清晰、缺少上下文、Agent 不匹配 | 提供具体任务、选择正确的 Agent |
| **工具权限不足** | Tools 字段缺少工具、名称拼写错误 | 检查 tools 字段、验证工具名称 |

记住：大多数问题都可以通过检查文件路径、验证 Front Matter 格式、选择正确的 Agent 来解决。

---

## 下一课预告

> 下一课我们学习 **[性能优化技巧](../performance-tips/)**。
>
> 你会学到：
> - 如何优化 Token 使用
> - 提升 Claude Code 响应速度
> - 上下文窗口管理策略

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能             | 文件路径                                                                                    | 行号    |
| ---------------- | ------------------------------------------------------------------------------------------- | ------- |
| 插件清单配置     | [`.claude-plugin/plugin.json`](https://github.com/affaan-m/everything-claude-code/blob/main/.claude-plugin/plugin.json) | 1-28    |
| Planner Agent    | [`agents/planner.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/planner.md) | 1-120   |
| TDD Guide Agent  | [`agents/tdd-guide.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/tdd-guide.md) | 1-281   |
| Code Reviewer Agent | [`agents/code-reviewer.md`](https://github.com/affaan-m/everything-claude-code/blob/main/agents/code-reviewer.md) | 1-281   |
| Plan Command     | [`commands/plan.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/plan.md) | 1-114   |
| TDD Command      | [`commands/tdd.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/tdd.md) | 1-281   |
| Agent 使用规则    | [`rules/agents.md`](https://github.com/affaan-m/everything-claude-code/blob/main/rules/agents.md) | 1-50    |

**Front Matter 必需字段**（所有 Agent 文件）：
- `name`：Agent 标识符（必须与文件名匹配，不含 `.md` 扩展名）
- `description`：Agent 功能描述（包含触发条件说明）
- `tools`：允许使用的工具列表（逗号分隔：`Read, Grep, Glob`）
- `model`：首选模型（`opus` 或 `sonnet`，可选）

**允许的工具名称**（区分大小写）：
- `Read`：读取文件内容
- `Write`：创建新文件
- `Edit`：编辑现有文件
- `Bash`：执行命令
- `Grep`：搜索文件内容
- `Glob`：查找文件路径

**关键配置路径**：
- 用户级 Agents：`~/.claude/agents/`
- 用户级 Commands：`~/.claude/commands/`
- 用户级 Settings：`~/.claude/settings.json`
- 项目级 Agents：`.claude/agents/`
- 项目级 Commands：`.claude/commands/`

**插件加载配置**（`~/.claude/settings.json`）：
```json
{
  "enabledPlugins": {
    "everything-claude-code@everything-claude-code": true
  }
}
```

</details>
