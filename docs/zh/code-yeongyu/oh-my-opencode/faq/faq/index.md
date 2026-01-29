---
title: "常见问题: ultrawork 模式 | oh-my-opencode"
subtitle: "常见问题解答"
sidebarTitle: "遇到问题怎么办"
description: "学习 oh-my-opencode 常见问题的解答。包括 ultrawork 模式、多代理协作、后台任务、Ralph Loop 和配置故障排除。"
tags:
  - "faq"
  - "troubleshooting"
  - "installation"
  - "configuration"
order: 160
---

# 常见问题解答

## 学完你能做什么

读完这篇 FAQ，你将能够：

- 快速找到安装和配置问题的解决方案
- 了解如何正确使用 ultrawork 模式
- 掌握代理调用的最佳实践
- 理解 Claude Code 兼容性的边界和限制
- 避免常见的安全和性能陷阱

---

## 安装与配置

### 如何安装 oh-my-opencode？

**最简单的方式**：让 AI 代理帮你安装。

将以下提示词发给你的 LLM 代理（Claude Code、AmpCode、Cursor 等）：

```
Install and configure oh-my-opencode by following the instructions here:
https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/docs/guide/installation.md
```

**手动安装**：参考 [安装指南](../start/installation/)。

::: tip 为什么推荐让 AI 代理安装？
人类容易在配置 JSONC 格式时出错（如忘记引号、冒号位置错误）。让 AI 代理处理可以避免常见的语法错误。
:::

### 如何卸载 oh-my-opencode？

分三步清理：

**第 1 步**：从 OpenCode 配置中移除插件

编辑 `~/.config/opencode/opencode.json`（或 `opencode.jsonc`），从 `plugin` 数组中删除 `"oh-my-opencode"`。

```bash
# 使用 jq 自动移除
jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
    ~/.config/opencode/opencode.json > /tmp/oc.json && \
    mv /tmp/oc.json ~/.config/opencode/opencode.json
```

**第 2 步**：删除配置文件（可选）

```bash
# 删除用户配置
rm -f ~/.config/opencode/oh-my-opencode.json

# 删除项目配置（如果存在）
rm -f .opencode/oh-my-opencode.json
```

**第 3 步**：验证移除

```bash
opencode --version
# 插件应该不再加载
```

### 配置文件在哪里？

配置文件有两个层级：

| 级别 | 位置 | 用途 | 优先级 |
|------|------|------|--------|
| 项目级 | `.opencode/oh-my-opencode.json` | 项目特定配置 | 低 |
| 用户级 | `~/.config/opencode/oh-my-opencode.json` | 全局默认配置 | 高 |

**合并规则**：用户级配置会覆盖项目级配置。

配置文件支持 JSONC 格式（JSON with Comments），你可以添加注释和尾随逗号：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json",
  // 这是一个注释
  "disabled_agents": [], // 可以有尾随逗号
  "agents": {}
}
```

### 如何禁用某个功能？

在配置文件中使用 `disabled_*` 数组：

```json
{
  "disabled_agents": ["oracle", "librarian"],
  "disabled_skills": ["playwright"],
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "disabled_mcps": ["websearch"]
}
```

**Claude Code 兼容性开关**：

```json
{
  "claude_code": {
    "mcp": false,        // 禁用 Claude Code 的 MCP
    "commands": false,    // 禁用 Claude Code 的 Commands
    "skills": false,      // 禁用 Claude Code 的 Skills
    "hooks": false        // 禁用 settings.json hooks
  }
}
```

---

## 使用相关

### 什么是 ultrawork？

**ultrawork**（或简写 `ulw`）是魔法词——在提示词中包含它，所有功能会自动激活：

- ✅ 并行后台任务
- ✅ 所有专业代理（Sisyphus、Oracle、Librarian、Explore、Prometheus 等）
- ✅ 深度探索模式
- ✅ Todo 强制完成机制

**使用示例**：

```
ultrawork 开发一个 REST API，需要 JWT 认证和用户管理
```

或者更简短：

```
ulw 重构这个模块
```

::: info 原理
`keyword-detector` Hook 会检测到 `ultrawork` 或 `ulw` 关键词，然后设置 `message.variant` 为特殊值，触发所有高级功能。
:::

### 如何调用特定的代理？

**方式 1：使用 @ 符号**

```
Ask @oracle to review this design and propose an architecture
Ask @librarian how this is implemented - why does behavior keep changing?
Ask @explore for policy on this feature
```

**方式 2：使用 delegate_task 工具**

```
delegate_task(agent="oracle", prompt="Review this architecture design")
delegate_task(agent="librarian", prompt="Find implementation examples of JWT auth")
```

**代理权限限制**：

| 代理 | 可写入代码 | 可执行 Bash | 可委托任务 | 说明 |
|------|-----------|------------|-----------|------|
| Sisyphus | ✅ | ✅ | ✅ | 主编排器 |
| Oracle | ❌ | ❌ | ❌ | 只读顾问 |
| Librarian | ❌ | ❌ | ❌ | 只读研究 |
| Explore | ❌ | ❌ | ❌ | 只读搜索 |
| Multimodal Looker | ❌ | ❌ | ❌ | 只读媒体分析 |
| Prometheus | ✅ | ✅ | ✅ | 规划师 |

### 后台任务如何工作？

后台任务让你可以像真实开发团队一样，让多个 AI 代理并行工作：

**启动后台任务**：

```
delegate_task(agent="explore", background=true, prompt="Find auth implementations")
```

**继续工作...**

**系统自动通知完成**（通过 `background-notification` Hook）

**获取结果**：

```
background_output(task_id="bg_abc123")
```

**并发控制**：

```json
{
  "background_task": {
    "defaultConcurrency": 3,
    "providerConcurrency": {
      "anthropic": 2,
      "openai": 3
    },
    "modelConcurrency": {
      "anthropic/claude-opus-4-5": 1,
      "openai/gpt-5.2": 2
    }
  }
}
```

**优先级**：`modelConcurrency` > `providerConcurrency` > `defaultConcurrency`

::: tip 为什么需要并发控制？
避免 API 限流和成本失控。例如，Claude Opus 4.5 成本高，限制其并发数；而 Haiku 成本低，可以并发更多。
:::

### 如何使用 Ralph Loop？

**Ralph Loop** 是自我参考的开发循环——持续工作直到任务完成。

**启动**：

```
/ralph-loop "Build a REST API with authentication"
/ralph-loop "Refactor the payment module" --max-iterations=50
```

**如何判断完成**：代理输出 `<promise>DONE</promise>` 标记。

**取消循环**：

```
/cancel-ralph
```

**配置**：

```json
{
  "ralph_loop": {
    "enabled": true,
    "default_max_iterations": 100
  }
}
```

::: tip 与 ultrawork 的区别
`/ralph-loop` 普通模式，`/ulw-loop` ultrawork 模式（所有高级功能激活）。
:::

### Categories 和 Skills 是什么？

**Categories**（v3.0 新增）：模型抽象层，根据任务类型自动选择最优模型。

**内置 Categories**：

| Category | 默认模型 | Temperature | 用例 |
|----------|-----------|-------------|------|
| visual-engineering | google/gemini-3-pro | 0.7 | 前端、UI/UX、设计 |
| ultrabrain | openai/gpt-5.2-codex | 0.1 | 高智商推理任务 |
| artistry | google/gemini-3-pro | 0.7 | 创意和艺术任务 |
| quick | anthropic/claude-haiku-4-5 | 0.1 | 快速、低成本任务 |
| writing | google/gemini-3-flash | 0.1 | 文档和写作任务 |

**Skills**：专业知识模块，注入特定领域的最佳实践。

**内置 Skills**：

| Skill | 触发条件 | 描述 |
|-------|----------|------|
| playwright | 浏览器相关任务 | Playwright MCP 浏览器自动化 |
| frontend-ui-ux | UI/UX 任务 | 设计师转开发人员，打造精美界面 |
| git-master | Git 操作（commit、rebase、squash） | Git 专家，原子提交、历史搜索 |

**使用示例**：

```
delegate_task(category="visual", skills=["frontend-ui-ux"], prompt="设计这个页面的 UI")
delegate_task(category="quick", skills=["git-master"], prompt="提交这些更改")
```

::: info 优势
Categories 优化成本（用便宜的模型），Skills 确保质量（注入专业知识）。
:::

---

## Claude Code 兼容性

### 能否使用 Claude Code 的配置？

**可以**，oh-my-opencode 提供**完全兼容层**：

**支持的配置类型**：

| 类型 | 加载位置 | 优先级 |
|------|----------|--------|
| Commands | `~/.claude/commands/`, `.claude/commands/` | 低 |
| Skills | `~/.claude/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md` | 中 |
| Agents | `~/.claude/agents/*.md`, `.claude/agents/*.md` | 高 |
| MCPs | `~/.claude/.mcp.json`, `.claude/.mcp.json` | 高 |
| Hooks | `~/.claude/settings.json`, `.claude/settings.json` | 高 |

**配置加载优先级**：

OpenCode 项目的配置 > Claude Code 用户的配置

```json
{
  "claude_code": {
    "plugins_override": {
      "claude-mem@thedotmack": false  // 禁用特定插件
    }
  }
}
```

### 能否使用 Claude Code 订阅？

**技术上可行，但不推荐**。

::: warning Claude OAuth 访问限制
截至 2026 年 1 月，Anthropic 已限制第三方 OAuth 访问，理由是违反 ToS。
:::

**官方声明**（来自 README）：

> 确实存在一些伪造 Claude Code OAuth 请求签名的社区工具。这些工具可能在技术上无法检测，但用户应了解 ToS 影响，我个人不推荐使用它们。
>
> **本项目不负责因使用非官方工具而产生的任何问题，我们没有自定义实现这些 OAuth 系统。**

**推荐方案**：使用你已有的 AI Provider 订阅（Claude、OpenAI、Gemini 等）。

### 数据是否兼容？

**是的**，数据存储格式兼容：

| 数据 | 位置 | 格式 | 兼容性 |
|------|------|------|--------|
| Todos | `~/.claude/todos/` | JSON | ✅ Claude Code 兼容 |
| Transcripts | `~/.claude/transcripts/` | JSONL | ✅ Claude Code 兼容 |

你可以无缝在 Claude Code 和 oh-my-opencode 之间切换。

---

## 安全性与性能

### 是否有安全警告？

**是的**，README 顶部有明确警告：

::: danger 警告：冒充站点
**ohmyopencode.com 与本项目无关。** 我们不运营或背书该网站。
>
> OhMyOpenCode 是**免费和开源的**。不要在声称"官方"的第三方站点下载安装程序或输入付款信息。
>
> 由于冒充站点位于付费墙后，我们**无法验证其分发内容**。将其中的任何下载视为**潜在不安全**。
>
> ✅ 官方下载：https://github.com/code-yeongyu/oh-my-opencode/releases
:::

### 如何优化性能？

**策略 1：使用合适的模型**

- 快速任务 → 使用 `quick` category（Haiku 模型）
- UI 设计 → 使用 `visual` category（Gemini 3 Pro）
- 复杂推理 → 使用 `ultrabrain` category（GPT 5.2）

**策略 2：启用并发控制**

```json
{
  "background_task": {
    "providerConcurrency": {
      "anthropic": 2,  // 限制 Anthropic 并发
      "openai": 5       // 增加 OpenAI 并发
    }
  }
}
```

**策略 3：使用后台任务**

让轻量级模型（如 Haiku）在后台收集信息，主代理（Opus）专注于核心逻辑。

**策略 4：禁用不需要的功能**

```json
{
  "disabled_hooks": ["comment-checker", "auto-update-checker"],
  "claude_code": {
    "hooks": false  // 禁用 Claude Code hooks（如果不用）
  }
}
```

### OpenCode 版本要求？

**推荐**：OpenCode >= 1.0.132

::: warning 旧版本 bug
如果你使用的是 1.0.132 或更旧版本，OpenCode 的一个 bug 可能会破坏配置。
>
> 该修复在 1.0.132 之后合并——使用更新版本。
:::

检查版本：

```bash
opencode --version
```

---

## 故障排除

### 代理不工作？

**检查清单**：

1. ✅ 验证配置文件格式正确（JSONC 语法）
2. ✅ 检查 Provider 配置（API Key 是否有效）
3. ✅ 运行诊断工具：`oh-my-opencode doctor --verbose`
4. ✅ 查看 OpenCode 日志中的错误信息

**常见问题**：

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 代理拒绝任务 | 权限配置错误 | 检查 `agents.permission` 配置 |
| 后台任务超时 | 并发限制过严 | 增加 `providerConcurrency` |
| 思考块错误 | 模型不支持 thinking | 切换到支持 thinking 的模型 |

### 配置文件不生效？

**可能原因**：

1. JSON 语法错误（忘记引号、逗号）
2. 配置文件位置错误
3. 用户配置未覆盖项目配置

**验证步骤**：

```bash
# 检查配置文件是否存在
ls -la ~/.config/opencode/oh-my-opencode.json
ls -la .opencode/oh-my-opencode.json

# 验证 JSON 语法
cat ~/.config/opencode/oh-my-opencode.json | jq .
```

**使用 JSON Schema 验证**：

在配置文件开头添加 `$schema` 字段，编辑器会自动提示错误：

```json
{
  "$schema": "https://raw.githubusercontent.com/code-yeongyu/oh-my-opencode/refs/heads/master/assets/oh-my-opencode.schema.json"
}
```

### 后台任务没有完成？

**检查清单**：

1. ✅ 查看任务状态：`background_output(task_id="...")`
2. ✅ 检查并发限制：是否有可用并发槽
3. ✅ 查看日志：是否有 API 限流错误

**强制取消任务**：

```javascript
background_cancel(task_id="bg_abc123")
```

**任务 TTL**：后台任务会在 30 分钟后自动清理。

---

## 更多资源

### 去哪里寻求帮助？

- **GitHub Issues**：https://github.com/code-yeongyu/oh-my-opencode/issues
- **Discord 社区**：https://discord.gg/PUwSMR9XNk
- **X (Twitter)**：https://x.com/justsisyphus

### 推荐阅读顺序

如果你是新手，建议按以下顺序阅读：

1. [快速安装与配置](../start/installation/)
2. [初识 Sisyphus：主编排器](../start/sisyphus-orchestrator/)
3. [Ultrawork 模式](../start/ultrawork-mode/)
4. [配置诊断与故障排除](../troubleshooting/)

### 贡献代码

欢迎 Pull Request！项目 99% 代码使用 OpenCode 构建。

如果你想改进某个功能或修复 bug，请：

1. Fork 仓库
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

---

## 本课小结

本 FAQ 涵盖了 oh-my-opencode 的常见问题，包括：

- **安装与配置**：如何安装、卸载、配置文件位置、禁用功能
- **使用技巧**：ultrawork 模式、代理调用、后台任务、Ralph Loop、Categories 和 Skills
- **Claude Code 兼容性**：配置加载、订阅使用限制、数据兼容性
- **安全与性能**：安全警告、性能优化策略、版本要求
- **故障排除**：常见问题和解决方案

记住这些关键点：

- 使用 `ultrawork` 或 `ulw` 关键词激活所有功能
- 让轻量级模型在后台收集信息，主代理专注于核心逻辑
- 配置文件支持 JSONC 格式，可以添加注释
- Claude Code 配置可以无缝加载，但 OAuth 访问有限制
- 从官方 GitHub 仓库下载，警惕冒充站点

## 下一课预告

> 如果你在使用过程中遇到具体的配置问题，可以查看 **[配置诊断与故障排除](../troubleshooting/)**。
>
> 你会学到：
> - 如何使用诊断工具检查配置
> - 常见错误代码的含义和解决方法
> - Provider 配置问题的排查技巧
> - 性能问题的定位和优化建议

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Keyword Detector (ultrawork 检测) | [`src/hooks/keyword-detector/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/keyword-detector/) | 全目录 |
| Background Task Manager | [`src/features/background-agent/manager.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/manager.ts) | 1-1377 |
| Concurrency Control | [`src/features/background-agent/concurrency.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/background-agent/concurrency.ts) | 全文件 |
| Ralph Loop | [`src/hooks/ralph-loop/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/ralph-loop/index.ts) | 全文件 |
| Delegate Task (Category & Skill 解析) | [`src/tools/delegate-task/tools.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/tools/delegate-task/tools.ts) | 1-1070 |
| Config Schema | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | 全文件 |
| Claude Code Hooks | [`src/hooks/claude-code-hooks/`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/hooks/claude-code-hooks/) | 全目录 |

**关键常量**：
- `DEFAULT_MAX_ITERATIONS = 100`：Ralph Loop 默认最大迭代次数
- `TASK_TTL_MS = 30 * 60 * 1000`：后台任务 TTL（30 分钟）
- `POLL_INTERVAL_MS = 2000`：后台任务轮询间隔（2 秒）

**关键配置**：
- `disabled_agents`: 禁用的代理列表
- `disabled_skills`: 禁用的技能列表
- `disabled_hooks`: 禁用的钩子列表
- `claude_code`: Claude Code 兼容性配置
- `background_task`: 后台任务并发配置
- `categories`: Category 自定义配置
- `agents`: 代理覆盖配置

</details>
