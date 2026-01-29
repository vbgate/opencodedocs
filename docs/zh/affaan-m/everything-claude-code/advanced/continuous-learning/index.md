---
title: "持续学习: 自动提取模式 | Everything Claude Code"
sidebarTitle: "让 Claude Code 越用越聪明"
subtitle: "持续学习: 自动提取可复用模式"
description: "学习 Everything Claude Code 的持续学习机制。通过 /learn 提取模式、配置自动评估、设置 Stop hook，让 Claude Code 不断积累经验，提升开发效率。"
tags:
  - "continuous-learning"
  - "knowledge-extraction"
  - "automation"
prerequisite:
  - "start-quick-start"
  - "platforms-commands-overview"
order: 100
---

# 持续学习机制：自动提取可复用模式

## 学完你能做什么

- 使用 `/learn` 命令手动提取会话中的可复用模式
- 配置 continuous-learning skill 在会话结束时自动评估
- 设置 Stop hook 自动触发模式提取
- 保存提取的模式为 learned skills，在未来的会话中复用
- 配置提取阈值、会话长度要求等参数

## 你现在的困境

在使用 Claude Code 开发时，你是否遇到过这些情况：

- 解决了一个复杂问题，下次遇到类似问题又要重新摸索
- 学会了某个框架的调试技巧，过段时间就忘了
- 发现了项目的特定编码规范，但无法系统地记录下来
- 找到了一个 workaround 方案，但下次遇到类似问题又想不起来

这些问题导致你的经验和知识无法有效积累，每次都要从头开始。

## 什么时候用这一招

使用持续学习机制的场景：

- **解决复杂问题时**：调试了半天的 bug，需要记住解决思路
- **学习新框架时**：发现了框架的 quirks 或最佳实践
- **项目开发中期**：逐步发现了项目特定的约定和模式
- **代码审查后**：学到了新的安全检查方法或编码规范
- **性能优化时**：找到了有效的优化技巧或工具组合

::: tip 核心价值
持续学习机制让 Claude Code 越用越聪明。它像一个经验丰富的导师，在你解决问题的过程中自动记录有用的模式，在未来的类似情境中提供建议。
:::

## 核心思路

持续学习机制由三个核心组件组成：

```
1. /learn 命令     → 手动提取：随时运行，保存当前有价值的模式
2. Continuous Learning Skill → 自动评估：Stop hook 触发，分析会话
3. Learned Skills   → 知识库：保存模式，未来自动加载
```

**工作原理**：

- **手动提取**：你在解决非平凡问题后，主动使用 `/learn` 提取模式
- **自动评估**：会话结束时，Stop hook 脚本检查会话长度，提示 Claude 评估
- **知识沉淀**：提取的模式保存为 learned skills，在 `~/.claude/skills/learned/` 目录
- **未来复用**：Claude Code 在未来的会话中自动加载这些 skills

**为什么选择 Stop hook**：

- **轻量级**：只在会话结束时运行一次，不影响交互响应速度
- **完整上下文**：可以访问完整的会话记录，更容易发现有价值的模式
- **非阻塞**：不会在每次发送消息时都运行，不会增加延迟

## 🎒 开始前的准备

在使用持续学习机制之前，请确认：

- ✅ 已安装 Everything Claude Code 插件
- ✅ 了解了 [核心 Commands 详解](../../platforms/commands-overview/) 中的 `/learn` 命令
- ✅ 理解了 [Hooks 自动化](../hooks-automation/) 中的 Stop hook 概念

::: warning 前置条件
本教程假设你已熟悉 Claude Code 的基本操作和 hooks 概念。如果还没完成安装，请先阅读[快速开始](../../start/quickstart/)。
:::

## 跟我做：完整的持续学习流程

让我们通过一个实际例子来学习整个流程。假设你在调试一个 TypeScript 类型错误，最终找到了解决方案。

### 第 1 步：使用 /learn 手动提取模式

**为什么**
手动提取适用于刚解决的重要问题，立即保存避免遗忘。

**操作**
在 Claude Code 中输入：

```
/learn
```

**你应该看到**
Claude 会分析当前会话，并询问是否发现可提取的模式：

```markdown
我分析了当前会话，发现了以下可提取的模式：

1. TypeScript 类型错误：通过泛型约束解决
   - 问题描述：函数参数类型推断不正确
   - 解决方法：添加显式泛型约束 `<T extends ...>`
   - 适用场景：复杂类型推断、回调函数

是否提取这些模式？(yes/no/skip)
```

**检查点 ✅**
- Claude 是否识别到了你解决的问题
- 提取的模式描述是否准确
- 适用场景是否合理

**下一步**
如果模式正确，回复 `yes`。需要修改就说明具体变更。

---

### 第 2 步：保存为 learned skill

**为什么**
保存为 skill 文件后，未来的会话可以自动加载这些知识。

**操作**
如果确认提取，Claude 会创建 skill 文件：

```markdown
将保存模式到：~/.claude/skills/learned/typescript-generic-constraints.md

# TypeScript Generic Constraints

**Extracted:** 2026-01-25
**Context:** 解决复杂类型推断问题

## Problem
TypeScript 函数参数类型推断不正确，导致类型错误。

## Solution
添加显式泛型约束 `<T extends ...>` 明确类型关系。

## Example
```typescript
// Before
function process(data) { ... }  // 类型推断失败

// After
function process<T extends Record<string, unknown>>(data: T) { ... }
```

## When to Use
- 复杂类型推断场景
- 回调函数类型定义
- 泛型函数参数约束
```

**你应该看到**
Claude 提示文件已保存：

```markdown
✅ Skill 已保存到：~/.claude/skills/learned/typescript-generic-constraints.md

未来遇到类似类型问题时，Claude 会自动加载这个技能。
```

**检查点 ✅**
- 文件是否成功创建
- 文件路径是否在 `~/.claude/skills/learned/` 目录
- skill 内容是否准确

---

### 第 3 步：配置 Continuous Learning Skill

**为什么**
配置自动评估后，Claude 会在每次会话结束时自动检查是否有可提取的模式。

**操作**

创建配置文件 `~/.claude/skills/continuous-learning/config.json`：

```json
{
  "min_session_length": 10,
  "extraction_threshold": "medium",
  "auto_approve": false,
  "learned_skills_path": "~/.claude/skills/learned/",
  "patterns_to_detect": [
    "error_resolution",
    "user_corrections",
    "workarounds",
    "debugging_techniques",
    "project_specific"
  ],
  "ignore_patterns": [
    "simple_typos",
    "one_time_fixes",
    "external_api_issues"
  ]
}
```

**配置说明**：

| 字段 | 说明 | 推荐值 |
|--- | --- | ---|
| `min_session_length` | 最小会话长度（用户消息数） | 10 |
| `extraction_threshold` | 提取阈值 | medium |
| `auto_approve` | 是否自动保存（推荐 false） | false |
| `learned_skills_path` | learned skills 保存路径 | `~/.claude/skills/learned/` |
| `patterns_to_detect` | 要检测的模式类型 | 见上文 |
| `ignore_patterns` | 忽略的模式类型 | 见上文 |

**你应该看到**
配置文件已创建在 `~/.claude/skills/continuous-learning/config.json`。

**检查点 ✅**
- 配置文件格式正确（JSON 有效）
- `learned_skills_path` 包含 `~` 符号（会被替换为实际 home 目录）
- `auto_approve` 设置为 `false`（推荐）

---

### 第 4 步：设置 Stop Hook 自动触发

**为什么**
Stop hook 会在每次会话结束时自动触发，无需手动运行 `/learn`。

**操作**

编辑 `~/.claude/settings.json`，添加 Stop hook：

```json
{
  "hooks": {
    "Stop": [{
      "matcher": "*",
      "hooks": [{
        "type": "command",
        "command": "~/.claude/skills/continuous-learning/evaluate-session.sh"
      }]
    }]
  }
}
```

**脚本路径说明**：

| 平台 | 脚本路径 |
|--- | ---|
| macOS/Linux | `~/.claude/skills/continuous-learning/evaluate-session.sh` |
| Windows | `C:\Users\YourName\.claude\skills\continuous-learning\evaluate-session.cmd` |

**你应该看到**
Stop hook 已添加到 `~/.claude/settings.json`。

**检查点 ✅**
- hooks 结构正确（Stop → matcher → hooks）
- command 路径指向正确的脚本
- matcher 设置为 `"*"`（匹配所有会话）

---

### 第 5 步：验证 Stop Hook 工作正常

**为什么**
验证配置正确后，才能放心使用自动提取功能。

**操作**
1. 打开一个新的 Claude Code 会话
2. 进行一些开发工作（至少发送 10 条消息）
3. 关闭会话

**你应该看到**
Stop hook 脚本输出日志：

```
[ContinuousLearning] Session has 12 messages - evaluate for extractable patterns
[ContinuousLearning] Save learned skills to: /Users/yourname/.claude/skills/learned/
```

**检查点 ✅**
- 日志显示会话消息数 ≥ 10
- 日志输出 learned skills 路径正确
- 没有错误信息

---

### 第 6 步：未来会话自动加载 learned skills

**为什么**
saved skills 会在未来的类似场景中自动加载，提供上下文。

**操作**
在未来的会话中遇到类似问题时，Claude 会自动加载相关 learned skills。

**你应该看到**
Claude 提示已加载相关 skills：

```markdown
我注意到这个场景与之前解决的类型推断问题类似。

根据 saved skill (typescript-generic-constraints)，推荐使用显式泛型约束：

```typescript
function process<T extends Record<string, unknown>>(data: T) { ... }
```
```

**检查点 ✅**
- Claude 引用了 saved skill
- 建议的解决方案准确
- 提升了问题解决效率

## 检查点 ✅：验证配置

完成以上步骤后，运行以下检查确认一切正常：

1. **检查配置文件存在**：
```bash
ls -la ~/.claude/skills/continuous-learning/config.json
```

2. **检查 Stop hook 配置**：
```bash
cat ~/.claude/settings.json | grep -A 10 "Stop"
```

3. **检查 learned skills 目录**：
```bash
ls -la ~/.claude/skills/learned/
```

4. **手动测试 Stop hook**：
```bash
node ~/.claude/skills/continuous-learning/scripts/hooks/evaluate-session.js
```

## 踩坑提醒

### 坑 1：会话太短导致不触发提取

**问题**：
Stop hook 脚本检查会话长度，低于 `min_session_length` 时跳过。

**原因**：
默认 `min_session_length: 10`，短会话不会触发评估。

**解决方法**：
```json
{
  "min_session_length": 5  // 降低阈值
}
```

::: warning 注意
不要设置太低（如 < 5），否则会提取大量无意义的模式（如简单的语法错误修复）。
:::

---

### 坑 2：`auto_approve: true` 导致自动保存垃圾模式

**问题**：
自动保存模式下，Claude 可能保存低质量的 patterns。

**原因**：
`auto_approve: true` 会跳过人工确认环节。

**解决方法**：
```json
{
  "auto_approve": false  // 始终保持 false
}
```

**推荐做法**：
始终手动确认提取的模式，保证质量。

---

### 坑 3：learned skills 目录不存在导致保存失败

**问题**：
Stop hook 运行成功，但 skill 文件没有创建。

**原因**：
`learned_skills_path` 指向的目录不存在。

**解决方法**：
```bash
# 手动创建目录
mkdir -p ~/.claude/skills/learned/

# 或者在配置中使用绝对路径
{
  "learned_skills_path": "/absolute/path/to/learned/"
}
```

---

### 坑 4：Stop hook 脚本路径错误（Windows）

**问题**：
Windows 上 Stop hook 不触发。

**原因**：
配置文件使用了 Unix 风格的路径（`~/.claude/...`），但 Windows 实际路径不同。

**解决方法**：
```json
{
  "command": "C:\\Users\\YourName\\.claude\\skills\\continuous-learning\\evaluate-session.cmd"
}
```

**推荐做法**：
使用 Node.js 脚本（跨平台），而不是 Shell 脚本。

---

### 坑 5：提取的模式太泛化，复用性差

**问题**：
提取的模式描述太泛（如"修复类型错误"），缺乏具体上下文。

**原因**：
提取时没有包含足够的上下文信息（错误信息、代码示例、适用场景）。

**解决方法**：
在 `/learn` 时提供更详细的上下文：

```
/learn 我解决了一个 TypeScript 类型错误：Property 'xxx' does not exist on type 'yyy'。通过使用类型断言 as 临时解决，但更好的方法是使用泛型约束。
```

**检查清单**：
- [ ] 问题描述具体（包含错误信息）
- [ ] 解决方法详细（包含代码示例）
- [ ] 适用场景明确（何时使用此模式）
- [ ] 命名具体（如"typescript-generic-constraints"而非"type-fix"）

---

### 坑 6：learned skills 数量过多，难以管理

**问题**：
随着时间推移，`learned/` 目录积累了大量 skills，难以查找和管理。

**原因**：
没有定期清理低质量或过时的 skills。

**解决方法**：

1. **定期审查**：每月检查一次 learned skills
```bash
# 列出所有 skills
ls -la ~/.claude/skills/learned/

# 查看 skill 内容
cat ~/.claude/skills/learned/pattern-name.md
```

2. **标记低质量 skills**：在文件名前添加 `deprecated-` 前缀
```bash
mv ~/.claude/skills/learned/old-pattern.md \
   ~/.claude/skills/learned/deprecated-old-pattern.md
```

3. **分类管理**：使用子目录分类
```bash
mkdir -p ~/.claude/skills/learned/{types,debugging,testing}
mv ~/.claude/skills/learned/*types*.md ~/.claude/skills/learned/types/
```

**推荐做法**：
每季度清理一次，保持 learned skills 精简有效。

---

## 本课小结

持续学习机制通过三个核心组件工作：

1. **`/learn` 命令**：手动提取会话中的可复用模式
2. **Continuous Learning Skill**：配置自动评估参数（会话长度、提取阈值）
3. **Stop Hook**：在会话结束时自动触发评估

**关键点**：

- ✅ 手动提取适用于刚解决的重要问题
- ✅ 自动评估通过 Stop hook 在会话结束时触发
- ✅ 提取的模式保存为 learned skills，在 `~/.claude/skills/learned/` 目录
- ✅ 配置 `min_session_length` 控制最小会话长度（推荐 10）
- ✅ 始终保持 `auto_approve: false`，手动确认提取的质量
- ✅ 定期清理低质量或过时的 learned skills

**最佳实践**：

- 解决非平凡问题后，立即使用 `/learn` 提取模式
- 提供详细的上下文（问题描述、解决方案、代码示例、适用场景）
- 使用具体的 skill 命名（如"typescript-generic-constraints"而非"type-fix"）
- 定期审查和清理 learned skills，保持知识库精简

## 下一课预告

> 下一课我们学习 **[Token 优化策略](../token-optimization/)**。
>
> 你会学到：
> - 如何优化 Token 使用，最大化上下文窗口效率
> - strategic-compact skill 的配置和使用
> - PreCompact 和 PostToolUse hooks 的自动化
> - 选择合适的模型（opus vs sonnet）平衡成本和质量

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能                  | 文件路径                                                                                                  | 行号     |
|--- | --- | ---|
| /learn 命令定义       | [`commands/learn.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/learn.md)         | 1-71     |
| Continuous Learning Skill | [`skills/continuous-learning/SKILL.md`](https://github.com/affaan-m/everything-claude-code/blob/main/skills/continuous-learning/SKILL.md) | 1-81     |
| Stop Hook 脚本        | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79     |
| Checkpoint 命令        | [`commands/checkpoint.md`](https://github.com/affaan-m/everything-claude-code/blob/main/commands/checkpoint.md) | 1-75     |

**关键常量**：
- `min_session_length = 10`：默认最小会话长度（用户消息数）
- `CLAUDE_TRANSCRIPT_PATH`：环境变量，会话记录路径
- `learned_skills_path`：learned skills 保存路径，默认 `~/.claude/skills/learned/`

**关键函数**：
- `main()`：evaluate-session.js 主函数，读取配置、检查会话长度、输出日志
- `getLearnedSkillsDir()`：获取 learned skills 目录路径（处理 `~` 展开）
- `countInFile()`：统计文件中匹配模式的出现次数

**配置项**：
| 配置项                | 类型    | 默认值                      | 说明                               |
|--- | --- | --- | ---|
| `min_session_length`  | number  | 10                          | 最小会话长度（用户消息数）          |
| `extraction_threshold` | string  | "medium"                    | 提取阈值                           |
| `auto_approve`        | boolean | false                       | 是否自动保存（推荐 false）          |
| `learned_skills_path`  | string  | "~/.claude/skills/learned/" | learned skills 保存路径             |
| `patterns_to_detect`   | array   | 见源码                       | 要检测的模式类型                   |
| `ignore_patterns`      | array   | 见源码                       | 忽略的模式类型                     |

**模式类型**：
- `error_resolution`：错误解决模式
- `user_corrections`：用户纠正模式
- `workarounds`：workaround 方案
- `debugging_techniques`：调试技巧
- `project_specific`：项目特定模式

**Hook 类型**：
- Stop：在会话结束时运行（evaluate-session.js）

</details>
