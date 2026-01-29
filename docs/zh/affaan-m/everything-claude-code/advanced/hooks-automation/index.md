---
title: "Hooks 自动化: 15+ 钩子解析 | Everything Claude Code"
sidebarTitle: "让 Claude 自动干活"
subtitle: "Hooks 自动化：15+ 个钩子深度解析"
description: "学习 Everything Claude Code 的 15+ 个自动化钩子机制。教程讲解 6 种 Hook 类型、14 个核心功能和 Node.js 脚本实现。"
tags:
  - "advanced"
  - "hooks"
  - "automation"
  - "nodejs"
prerequisite:
  - "start-installation"
  - "platforms-commands-overview"
order: 90
---

# Hooks 自动化：15+ 个钩子深度解析

## 学完你能做什么

- 理解 Claude Code 的 6 种 Hook 类型及其触发机制
- 掌握 14 个内置 Hooks 的功能和配置方法
- 学会使用 Node.js 脚本自定义 Hooks
- 在会话开始/结束时自动保存和加载上下文
- 实现智能压缩建议、代码自动格式化等自动化功能

## 你现在的困境

你希望 Claude Code 能在特定事件时自动执行一些操作，比如：
- 会话开始时自动加载之前的上下文
- 每次编辑代码后自动格式化
- 推送代码前提醒你检查变更
- 在适当时机建议压缩上下文

但这些功能需要你手动触发，或者你需要深入了解 Claude Code 的 Hooks 系统才能实现。本课将帮你掌握这些自动化能力。

## 什么时候用这一招

- 需要在会话间保持上下文和工作状态
- 希望自动执行代码质量检查（格式化、TypeScript 检查）
- 想在特定操作前得到提醒（如 git push 前检查变更）
- 需要优化 Token 使用，在适当时机压缩上下文
- 希望自动提取会话中的可复用模式

## 核心思路

**什么是 Hooks**

**Hooks** 是 Claude Code 提供的自动化机制，可以在特定事件发生时触发自定义脚本。它就像一个「事件监听器」，当满足条件时自动执行预定义的操作。

::: info Hook 的工作原理

```
用户操作 → 触发事件 → Hook 检查 → 执行脚本 → 返回结果
    ↓           ↓            ↓           ↓           ↓
  使用工具   PreToolUse   匹配条件   Node.js 脚本   输出到控制台
```

例如，当你使用 Bash 工具执行 `npm run dev` 时：
1. PreToolUse Hook 检测到命令模式
2. 如果不在 tmux 中，自动阻止并提示
3. 你看到提示后使用正确的方式启动

:::

**6 种 Hook 类型**

Everything Claude Code 使用了 6 种 Hook 类型：

| Hook 类型 | 触发时机 | 使用场景 |
|--- | --- | ---|
| **PreToolUse** | 在任何工具执行前 | 验证命令、阻止操作、提示建议 |
| **PostToolUse** | 在任何工具执行后 | 自动格式化、类型检查、记录日志 |
| **PreCompact** | 在上下文压缩前 | 保存状态、记录压缩事件 |
| **SessionStart** | 在新会话开始时 | 加载上下文、检测包管理器 |
| **SessionEnd** | 在会话结束时 | 保存状态、评估会话、提取模式 |
| **Stop** | 在每次响应结束时 | 检查修改的文件、提醒清理 |

::: tip Hook 的执行顺序

一个完整的会话生命周期中，Hooks 按以下顺序执行：

```
SessionStart → [PreToolUse → PostToolUse]×N → PreCompact → Stop → SessionEnd
```

其中 `[PreToolUse → PostToolUse]` 会在每次使用工具时重复执行。

:::

**Hooks 的匹配规则**

每个 Hook 使用 `matcher` 表达式来决定是否执行。Claude Code 使用 JavaScript 表达式，可以检查：

- 工具类型：`tool == "Bash"`、`tool == "Edit"`
- 命令内容：`tool_input.command matches "npm run dev"`
- 文件路径：`tool_input.file_path matches "\\.ts$"`
- 组合条件：`tool == "Bash" && tool_input.command matches "git push"`

**为什么用 Node.js 脚本**

Everything Claude Code 的所有 Hooks 都使用 Node.js 脚本实现，而不是 Shell 脚本。原因是：

| 优势 | Shell 脚本 | Node.js 脚本 |
|--- | --- | ---|
| **跨平台** | ❌ 需要 Windows/macOS/Linux 分支 | ✅ 自动跨平台 |
| **JSON 处理** | ❌ 需要额外工具（jq） | ✅ 原生支持 |
| **文件操作** | ⚠️ 命令复杂 | ✅ fs API 简洁 |
| **错误处理** | ❌ 需要手动实现 | ✅ try/catch 原生支持 |

## 跟我做

### 第 1 步：查看当前 Hooks 配置

**为什么**
了解现有的 Hooks 配置，知道哪些自动化功能已经启用

```bash
## 查看 hooks.json 配置
cat source/affaan-m/everything-claude-code/hooks/hooks.json
```

**你应该看到**：JSON 配置文件，包含 6 种 Hook 类型的定义

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [...],
    "PostToolUse": [...],
    "PreCompact": [...],
    "SessionStart": [...],
    "Stop": [...],
    "SessionEnd": [...]
  }
}
```

### 第 2 步：理解 PreToolUse Hooks

**为什么**
PreToolUse 是最常用的 Hook 类型，可以阻止操作或提供提示

让我们看看 Everything Claude Code 中的 5 个 PreToolUse Hooks：

#### 1. Tmux Dev Server Block

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"(npm run dev|pnpm( run)? dev|yarn dev|bun run dev)\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] BLOCKED: Dev server must run in tmux for log access');console.error('[Hook] Use: tmux new-session -d -s dev \\\"npm run dev\\\"');console.error('[Hook] Then: tmux attach -t dev');process.exit(1)\""
  }],
  "description": "Block dev servers outside tmux - ensures you can access logs"
}
```

**功能**：阻止在 tmux 外启动 dev server

**为什么需要**：在 tmux 中运行 dev server 可以分离会话，即使关闭 Claude Code 也能继续查看日志

#### 2. Git Push Reminder

```json
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"git push\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"console.error('[Hook] Review changes before push...');console.error('[Hook] Continuing with push (remove this hook to add interactive review)')\""
  }],
  "description": "Reminder before git push to review changes"
}
```

**功能**：在 `git push` 前提醒你检查变更

**为什么需要**：避免误提交未审查的代码

#### 3. Block Random MD Files

```json
{
  "matcher": "tool == \"Write\" && tool_input.file_path matches \"\\\\.(md|txt)$\" && !(tool_input.file_path matches \"README\\\\.md|CLAUDE\\\\.md|AGENTS\\\\.md|CONTRIBUTING\\\\.md\")",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{...process.exit(1)}console.log(d)})\""
  }],
  "description": "Block creation of random .md files - keeps docs consolidated"
}
```

**功能**：阻止创建非文档类的 .md 文件

**为什么需要**：避免文档分散，保持项目整洁

#### 4. Suggest Compact

```json
{
  "matcher": "tool == \"Edit\" || tool == \"Write\"",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/suggest-compact.js\""
  }],
  "description": "Suggest manual compaction at logical intervals"
}
```

**功能**：在编辑或写入文件时，建议进行上下文压缩

**为什么需要**：在适当时机手动压缩，保持上下文精简

### 第 3 步：理解 PostToolUse Hooks

**为什么**
PostToolUse 在操作完成后自动执行，适合自动化质量检查

Everything Claude Code 有 4 个 PostToolUse Hooks：

#### 1. Auto Format

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...try{execSync('npx prettier --write \"'+p+'\"',{stdio:['pipe','pipe','pipe']})}catch(e){}}console.log(d)})\""
  }],
  "description": "Auto-format JS/TS files with Prettier after edits"
}
```

**功能**：编辑 .js/.ts/.jsx/.tsx 文件后自动运行 Prettier 格式化

**为什么需要**：保持代码风格一致

#### 2. TypeScript Check

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...if(fs.existsSync(path.join(dir,'tsconfig.json'))){try{const r=execSync('npx tsc --noEmit --pretty false 2>&1',{cwd:dir,...});...}catch(e){...}}console.log(d)})\""
  }],
  "description": "TypeScript check after editing .ts/.tsx files"
}
```

**功能**：编辑 .ts/.tsx 文件后自动运行 TypeScript 类型检查

**为什么需要**：及早发现类型错误

#### 3. Console.log Warning

```json
{
  "matcher": "tool == \"Edit\" && tool_input.file_path matches \"\\\\.(ts|tsx|js|jsx)$\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const fs=require('fs');...const c=fs.readFileSync(p,'utf8');const lines=c.split('\\n');...if(/console\\.log/.test(l))matches.push((idx+1)+': '+l.trim())...console.log(d)})\""
  }],
  "description": "Warn about console.log statements after edits"
}
```

**功能**：编辑文件后检查是否有 console.log 语句

**为什么需要**：避免提交调试代码

#### 4. Log PR URL

```json
{
  "matcher": "tool == \"Bash\"",
  "hooks": [{
    "type": "command",
    "command": "node -e \"...const cmd=i.tool_input?.command||'';if(/gh pr create/.test(cmd)){const out=i.tool_output?.output||'';...console.error('[Hook] PR created: '+m[0])...}console.log(d)})\""
  }],
  "description": "Log PR URL and provide review command after PR creation"
}
```

**功能**：创建 PR 后自动输出 PR URL 和审查命令

**为什么需要**：方便快速访问新创建的 PR

### 第 4 步：理解会话生命周期 Hooks

**为什么**
SessionStart 和 SessionEnd Hook 用于会话间的上下文持久化

#### SessionStart Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-start.js\""
  }],
  "description": "Load previous context and detect package manager on new session"
}
```

**功能**：
- 检查最近 7 天的会话文件
- 检查已学习的 skills
- 检测包管理器
- 输出可加载的上下文信息

**脚本逻辑**（`session-start.js`）：

```javascript
// 检查最近 7 天的会话文件
const recentSessions = findFiles(sessionsDir, '*.tmp', { maxAge: 7 });

// 检查已学习的 skills
const learnedSkills = findFiles(learnedDir, '*.md');

// 检测包管理器
const pm = getPackageManager();

// 如果使用默认值，提示选择
if (pm.source === 'fallback' || pm.source === 'default') {
  log('[SessionStart] No package manager preference found.');
  log(getSelectionPrompt());
}
```

#### SessionEnd Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/session-end.js\""
  }],
  "description": "Persist session state on end"
}
```

**功能**：
- 创建或更新会话文件
- 记录会话的开始和结束时间
- 生成会话模板（Completed、In Progress、Notes）

**会话文件模板**（`session-end.js`）：

```
# Session: 2026-01-25
**Date:** 2026-01-25
**Started:** 10:30
**Last Updated:** 14:20

---

## Current State

[Session context goes here]

### Completed
- [ ]

### In Progress
- [ ]

### Notes for Next Session
-

### Context to Load
[relevant files]
```

模板中的 `[Session context goes here]` 和 `[relevant files]` 是占位符，需要你手动填写实际的会话内容和相关文件。

### 第 5 步：理解压缩相关 Hooks

**为什么**
PreCompact 和 Stop Hook 用于上下文管理和压缩决策

#### PreCompact Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/pre-compact.js\""
  }],
  "description": "Save state before context compaction"
}
```

**功能**：
- 记录压缩事件到日志
- 在活动会话文件中标记压缩发生的时间

**脚本逻辑**（`pre-compact.js`）：

```javascript
// 记录压缩事件
appendFile(compactionLog, `[${timestamp}] Context compaction triggered\n`);

// 在会话文件中标记
appendFile(activeSession, `\n---\n**[Compaction occurred at ${timeStr}]** - Context was summarized\n`);
```

#### Stop Hook

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node -e \"const{execSync}=require('child_process');...const files=execSync('git diff --name-only HEAD'...).split('\\n')...let hasConsole=false;for(const f of files){if(fs.readFileSync(f,'utf8').includes('console.log')){console.error('[Hook] WARNING: console.log found in '+f);hasConsole=true}}...console.log(d)})\""
  }],
  "description": "Check for console.log in modified files after each response"
}
```

**功能**：检查所有修改的文件中是否有 console.log

**为什么需要**：作为最后一道防线，避免提交调试代码

### 第 6 步：理解持续学习 Hook

**为什么**
Evaluate Session Hook 用于从会话中提取可复用模式

```json
{
  "matcher": "*",
  "hooks": [{
    "type": "command",
    "command": "node \"${CLAUDE_PLUGIN_ROOT}/scripts/hooks/evaluate-session.js\""
  }],
  "description": "Evaluate session for extractable patterns"
}
```

**功能**：
- 读取会话记录（transcript）
- 统计用户消息数量
- 如果会话长度足够（默认 > 10 条消息），提示评估可提取的模式

**脚本逻辑**（`evaluate-session.js`）：

```javascript
// 读取配置
const config = JSON.parse(readFile(configFile));
const minSessionLength = config.min_session_length || 10;

// 统计用户消息
const messageCount = countInFile(transcriptPath, /"type":"user"/g);

// 跳过短会话
if (messageCount < minSessionLength) {
  log(`[ContinuousLearning] Session too short (${messageCount} messages), skipping`);
  process.exit(0);
}

// 提示评估
log(`[ContinuousLearning] Session has ${messageCount} messages - evaluate for extractable patterns`);
log(`[ContinuousLearning] Save learned skills to: ${learnedSkillsPath}`);
```

### 第 7 步：自定义 Hook

**为什么**
根据项目需求，创建自己的自动化规则

**示例：阻止在生产环境运行危险命令**

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "tool == \"Bash\" && tool_input.command matches \"(rm -rf /|docker rm.*--force|DROP DATABASE)\"",
        "hooks": [{
          "type": "command",
          "command": "node -e \"console.error('[Hook] BLOCKED: Dangerous command detected');console.error('[Hook] Command: '+process.argv[2]);process.exit(1)\""
        }],
        "description": "Block dangerous commands"
      }
    ]
  }
}
```

**配置步骤**：

1. 创建自定义 Hook 脚本：
   ```bash
   # 创建 scripts/hooks/custom-hook.js
   vi scripts/hooks/custom-hook.js
   ```

2. 编辑 `~/.claude/settings.json`：
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "tool == \"Bash\" && tool_input.command matches \"your pattern\"",
           "hooks": [{
             "type": "command",
             "command": "node /path/to/your/script.js"
           }],
           "description": "Your custom hook"
         }
       ]
     }
   }
   ```

3. 重新启动 Claude Code

**你应该看到**：Hook 触发时的输出信息

## 检查点 ✅

确认你理解了以下要点：

- [ ] Hook 是事件驱动的自动化机制
- [ ] Claude Code 有 6 种 Hook 类型
- [ ] PreToolUse 在工具执行前触发，可以阻止操作
- [ ] PostToolUse 在工具执行后触发，适合自动化检查
- [ ] SessionStart/SessionEnd 用于会话间上下文持久化
- [ ] Everything Claude Code 使用 Node.js 脚本实现跨平台兼容
- [ ] 可以通过修改 `~/.claude/settings.json` 自定义 Hooks

## 踩坑提醒

### ❌ Hook 脚本中的错误导致会话卡死

**问题**：Hook 脚本抛出异常后没有正确退出，导致 Claude Code 等待超时

**原因**：Node.js 脚本中的错误没有被正确捕获

**解决**：
```javascript
// 错误示例
main();  // 如果抛出异常，会导致问题

// 正确示例
main().catch(err => {
  console.error('[Hook] Error:', err.message);
  process.exit(0);  // 即使出错也正常退出
});
```

### ❌ 使用 Shell 脚本导致跨平台问题

**问题**：在 Windows 上运行时，Shell 脚本失败

**原因**：Shell 命令在不同操作系统上不兼容

**解决**：使用 Node.js 脚本代替 Shell 脚本

| 功能 | Shell 脚本 | Node.js 脚本 |
|--- | --- | ---|
| 文件读取 | `cat file.txt` | `fs.readFileSync('file.txt')` |
| 目录检查 | `[ -d dir ]` | `fs.existsSync(dir)` |
| 环境变量 | `$VAR` | `process.env.VAR` |

### ❌ Hook 输出过多导致上下文膨胀

**问题**：每次操作都输出大量调试信息，导致上下文快速膨胀

**原因**：Hook 脚本使用了过多的 console.log

**解决**：
- 只输出必要的信息
- 使用 `console.error` 输出重要提示（会被 Claude Code 高亮显示）
- 使用条件输出，只在需要时打印

```javascript
// 错误示例
console.log('[Hook] Starting...');
console.log('[Hook] File:', filePath);
console.log('[Hook] Size:', size);
console.log('[Hook] Done');  // 输出过多

// 正确示例
if (someCondition) {
  console.error('[Hook] Warning: File is too large');
}
```

### ❌ PreToolUse Hook 阻止了必要的操作

**问题**：Hook 的匹配规则过于宽泛，误阻止了正常操作

**原因**：matcher 表达式没有精确匹配场景

**解决**：
- 测试 matcher 表达式的准确性
- 添加更多条件限制触发范围
- 提供明确的错误信息和解决建议

```json
// 错误示例：匹配所有 npm 命令
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm\""
}

// 正确示例：只匹配 dev 命令
{
  "matcher": "tool == \"Bash\" && tool_input.command matches \"npm run dev\""
}
```

## 本课小结

**6 种 Hook 类型总结**：

| Hook 类型 | 触发时机 | 典型用途 | Everything Claude Code 数量 |
|--- | --- | --- | ---|
| PreToolUse | 工具执行前 | 验证、阻止、提示 | 5 个 |
| PostToolUse | 工具执行后 | 格式化、检查、记录 | 4 个 |
| PreCompact | 上下文压缩前 | 保存状态 | 1 个 |
| SessionStart | 新会话开始 | 加载上下文、检测 PM | 1 个 |
| SessionEnd | 会话结束 | 保存状态、评估会话 | 2 个 |
| Stop | 响应结束 | 检查修改 | 1 个 |

**核心要点**：

1. **Hook 是事件驱动**：在特定事件时自动执行
2. **Matcher 决定触发**：使用 JavaScript 表达式匹配条件
3. **Node.js 脚本实现**：跨平台兼容，避免 Shell 脚本
4. **错误处理重要**：脚本出错也要正常退出
5. **输出要精简**：避免过多日志导致上下文膨胀
6. **配置在 settings.json**：通过修改 `~/.claude/settings.json` 添加自定义 Hook

**最佳实践**：

```
1. 使用 PreToolUse 验证危险操作
2. 使用 PostToolUse 自动化质量检查
3. 使用 SessionStart/End 持久化上下文
4. 自定义 Hook 时先测试 matcher 表达式
5. 脚本中使用 try/catch 和 process.exit(0)
6. 只输出必要信息，避免上下文膨胀
```

## 下一课预告

> 下一课我们学习 **[持续学习机制](../continuous-learning/)**。
>
> 你会学到：
> - Continuous Learning 如何自动提取可复用模式
> - 使用 `/learn` 命令手动提取模式
> - 配置会话评估的最小长度
> - 管理 learned skills 目录

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Hooks 主配置 | [`hooks/hooks.json`](https://github.com/affaan-m/everything-claude-code/blob/main/hooks/hooks.json) | 1-158 |
| SessionStart 脚本 | [`scripts/hooks/session-start.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-start.js) | 1-62 |
| SessionEnd 脚本 | [`scripts/hooks/session-end.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/session-end.js) | 1-83 |
| PreCompact 脚本 | [`scripts/hooks/pre-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/pre-compact.js) | 1-49 |
| Suggest Compact 脚本 | [`scripts/hooks/suggest-compact.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/suggest-compact.js) | 1-61 |
| Evaluate Session 脚本 | [`scripts/hooks/evaluate-session.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/hooks/evaluate-session.js) | 1-79 |
| 工具库 | [`scripts/lib/utils.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/utils.js) | 1-150 |
| 包管理器检测 | [`scripts/lib/package-manager.js`](https://github.com/affaan-m/everything-claude-code/blob/main/scripts/lib/package-manager.js) | 1-100 |

**关键常量**：
- 无（配置动态加载）

**关键函数**：
- `getSessionsDir()`：获取会话目录路径
- `getLearnedSkillsDir()`：获取 learned skills 目录路径
- `findFiles(dir, pattern, options)`：查找文件，支持按时间过滤
- `ensureDir(path)`：确保目录存在，不存在则创建
- `getPackageManager()`：检测包管理器（支持 6 种优先级）
- `log(message)`：输出 Hook 日志信息

**关键配置**：
- `min_session_length`：会话评估的最小消息数（默认 10）
- `COMPACT_THRESHOLD`：建议压缩的工具调用阈值（默认 50）
- `CLAUDE_PLUGIN_ROOT`：插件根目录环境变量

**14 个核心 Hooks**：
1. Tmux Dev Server Block (PreToolUse)
2. Tmux Reminder (PreToolUse)
3. Git Push Reminder (PreToolUse)
4. Block Random MD Files (PreToolUse)
5. Suggest Compact (PreToolUse)
6. Save Before Compact (PreCompact)
7. Session Start Load (SessionStart)
8. Log PR URL (PostToolUse)
9. Auto Format (PostToolUse)
10. TypeScript Check (PostToolUse)
11. Console.log Warning (PostToolUse)
12. Check Console.log (Stop)
13. Session End Save (SessionEnd)
14. Evaluate Session (SessionEnd)

</details>
