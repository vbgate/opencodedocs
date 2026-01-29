---
title: "故障排除: 排查常见问题 | Plannotator"
sidebarTitle: "快速排查问题"
subtitle: "故障排除: 排查常见问题"
description: "学习 Plannotator 故障排查方法，包括日志查看、端口占用、Hook event 调试、浏览器问题、Git 仓库状态和集成错误处理。"
tags:
  - "故障排查"
  - "调试"
  - "常见错误"
  - "日志查看"
prerequisite:
  - "start-getting-started"
order: 2
---

# Plannotator 故障排查

## 学完你能做什么

遇到问题时，你将能够：

- 快速定位问题来源（端口占用、Hook event 解析、Git 配置等）
- 通过日志输出诊断错误
- 针对不同错误类型采取正确的解决方法
- 在远程/Devcontainer 模式下调试连接问题

## 你现在的困境

Plannotator 突然不工作了，浏览器没有打开，或者 Hook 输出了错误信息。你不知道如何查看日志，也不确定是哪个环节出了问题。你可能尝试过重启，但问题依然存在。

## 什么时候用这一招

以下情况需要故障排查：

- 浏览器没有自动打开
- Hook 输出错误信息
- 端口占用导致无法启动
- 计划或代码评审页面显示异常
- Obsidian/Bear 集成失败
- Git diff 显示为空

---

## 核心思路

Plannotator 的问题通常分为三类：

1. **环境问题**：端口占用、环境变量配置错误、浏览器路径问题
2. **数据问题**：Hook event 解析失败、计划内容为空、Git 仓库状态异常
3. **集成问题**：Obsidian/Bear 保存失败、远程模式连接问题

调试的核心是**查看日志输出**。Plannotator 使用 `console.error` 输出错误到 stderr，用 `console.log` 输出正常信息到 stdout。区分这两者能帮你快速定位问题类型。

---

## 🎒 开始前的准备

- ✅ 已安装 Plannotator（Claude Code 或 OpenCode 插件）
- ✅ 了解基本的命令行操作
- ✅ 熟悉你的项目目录和 Git 仓库状态

---

## 跟我做

### 第 1 步：检查日志输出

**为什么**

Plannotator 的所有错误都会输出到 stderr。查看日志是诊断问题的第一步。

**操作方法**

#### 在 Claude Code 中

当 Hook 触发 Plannotator 时，错误信息会显示在 Claude Code 的终端输出中：

```bash
# 你可能看到的错误示例
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

#### 在 OpenCode 中

OpenCode 会捕获 CLI 的 stderr 并显示在界面中：

```
[stderr] Failed to parse hook event from stdin
[stderr] No plan content in hook event
```

**你应该看到**：

- 如果没有错误，stderr 应该为空或仅有预期的提示信息
- 如果有错误，会包含错误类型（如 EADDRINUSE）、错误消息和堆栈信息（如果有）

---

### 第 2 步：处理端口占用问题

**为什么**

Plannotator 默认在随机端口启动服务器。如果固定端口被占用，服务器会尝试重试 5 次（每次延迟 500ms），失败后报错。

**错误信息**：

```
Error: Port 54321 in use after 5 retries (set PLANNOTATOR_PORT to use different port)
```

**解决方案**

#### 方案 A：让 Plannotator 自动选择端口（推荐）

不要设置 `PLANNOTATOR_PORT` 环境变量，Plannotator 会自动选择可用端口。

#### 方案 B：使用固定端口并解决占用

如果必须使用固定端口（如远程模式），需要解决端口占用：

```bash
# macOS/Linux
lsof -ti:54321 | xargs kill -9

# Windows PowerShell
Get-NetTCPConnection -LocalPort 54321 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

然后重新设置端口：

```bash
# macOS/Linux/WSL
export PLANNOTATOR_PORT=54322

# Windows PowerShell
$env:PLANNOTATOR_PORT = "54322"
```

**检查点 ✅**：

- 再次触发 Plannotator，浏览器应该能正常打开
- 如果仍然报错，尝试换一个端口号

---

### 第 3 步：调试 Hook event 解析失败

**为什么**

Hook event 是从 stdin 读取的 JSON 数据。如果解析失败，Plannotator 无法继续。

**错误信息**：

```
Failed to parse hook event from stdin
No plan content in hook event
```

**可能原因**：

1. Hook event 不是有效的 JSON
2. Hook event 缺少 `tool_input.plan` 字段
3. Hook 版本不兼容

**调试方法**

#### 查看 Hook event 内容

在 Hook server 启动前，打印 stdin 内容：

```bash
# 暂时修改 hook/server/index.ts
# 在第 91 行后添加：
console.error("[DEBUG] Hook event:", eventJson);
```

**你应该看到**：

```json
{
  "tool_input": {
    "plan": "# Implementation Plan\n\n## Task 1\n..."
  },
  "permission_mode": "default"
}
```

**解决方案**：

- 如果 `tool_input.plan` 为空或缺失，检查 AI Agent 是否正确生成了计划
- 如果 JSON 格式错误，检查 Hook 配置是否正确
- 如果 Hook 版本不兼容，更新 Plannotator 到最新版本

---

### 第 4 步：解决浏览器未打开问题

**为什么**

Plannotator 使用 `openBrowser` 函数自动打开浏览器。如果失败，可能是跨平台兼容性问题或浏览器路径错误。

**可能原因**：

1. 系统默认浏览器未设置
2. 自定义浏览器路径无效
3. WSL 环境下的特殊处理问题
4. 远程模式下不会自动打开浏览器（这是正常的）

**调试方法**

#### 检查是否在远程模式

```bash
# 查看环境变量
echo $PLANNOTATOR_REMOTE

# Windows PowerShell
echo $env:PLANNOTATOR_REMOTE
```

如果输出为 `1` 或 `true`，说明是远程模式，浏览器不会自动打开，这是预期行为。

#### 手动测试浏览器打开

```bash
# macOS
open "http://localhost:54321"

# Linux
xdg-open "http://localhost:54321"

# Windows
start http://localhost:54321
```

**你应该看到**：

- 如果手动打开成功，说明 Plannotator 服务器正常运行，问题出在自动打开逻辑
- 如果手动打开失败，检查 URL 是否正确（端口可能不同）

**解决方案**：

#### 方案 A：设置自定义浏览器（macOS）

```bash
export PLANNOTATOR_BROWSER="Google Chrome"

# 或使用完整路径
export PLANNOTATOR_BROWSER="/Applications/Google Chrome.app"
```

#### 方案 B：设置自定义浏览器（Linux）

```bash
export PLANNOTATOR_BROWSER="/usr/bin/firefox"
```

#### 方案 C：远程模式手动打开（Devcontainer/SSH）

```bash
# Plannotator 会输出 URL 和端口信息
# 复制 URL，在本地浏览器中打开
# 或使用端口转发：
ssh -L 19432:localhost:19432 user@remote
```

---

### 第 5 步：检查 Git 仓库状态（代码评审）

**为什么**

代码评审功能依赖 Git 命令。如果 Git 仓库状态异常（如没有提交、Detached HEAD），会导致 diff 显示为空或错误。

**错误信息**：

```
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**调试方法**

#### 检查 Git 仓库

```bash
# 检查是否在 Git 仓库中
git status

# 检查当前分支
git branch

# 检查是否有提交
git log --oneline -1
```

**你应该看到**：

- 如果输出 `fatal: not a git repository`，说明当前目录不是 Git 仓库
- 如果输出 `HEAD detached at <commit>`，说明处于 Detached HEAD 状态
- 如果输出 `fatal: your current branch 'main' has no commits yet`，说明还没有任何提交

**解决方案**：

#### 问题 A：不在 Git 仓库中

```bash
# 初始化 Git 仓库
git init
git add .
git commit -m "Initial commit"
```

#### 问题 B：Detached HEAD 状态

```bash
# 切换到一个分支
git checkout main
# 或创建新分支
git checkout -b feature-branch
```

#### 问题 C：没有提交

```bash
# 至少需要一个提交才能查看 diff
git add .
git commit -m "Initial commit"
```

#### 问题 D：空 diff（没有更改）

```bash
# 创建一些更改
echo "test" >> test.txt
git add test.txt

# 再次运行 /plannotator-review
```

**检查点 ✅**：

- 再次运行 `/plannotator-review`，diff 应该正常显示
- 如果仍然为空，检查是否有未暂存或未提交的更改

---

### 第 6 步：调试 Obsidian/Bear 集成失败

**为什么**

Obsidian/Bear 集成失败不会阻止计划批准，但会导致保存失败。错误会输出到 stderr。

**错误信息**：

```
[Obsidian] Save failed: Vault not found
[Bear] Save failed: Failed to open Bear
```

**调试方法**

#### 检查 Obsidian 配置

**macOS**：
```bash
cat ~/Library/Application\ Support/obsidian/obsidian.json
```

**Windows**：
```powershell
cat $env:APPDATA\obsidian\obsidian.json
```

**你应该看到**：

```json
{
  "vaults": {
    "/path/to/vault": {
      "path": "/path/to/vault",
      "ts": 1234567890
    }
  }
}
```

#### 检查 Bear 可用性（macOS）

```bash
# 测试 Bear URL scheme
open "bear://x-callback-url/create?title=Test&text=Hello"
```

**你应该看到**：

- Bear 应用打开并创建新笔记
- 如果没有任何反应，说明 Bear 未正确安装

**解决方案**：

#### Obsidian 保存失败

- 确保 Obsidian 正在运行
- 检查 vault 路径是否正确
- 尝试手动在 Obsidian 中创建笔记，验证权限

#### Bear 保存失败

- 确保 Bear 已正确安装
- 测试 `bear://x-callback-url` 是否可用
- 检查 Bear 设置中是否启用了 x-callback-url

---

### 第 7 步：查看详细错误日志（调试模式）

**为什么**

有时错误信息不够详细，需要查看完整的堆栈跟踪和上下文。

**操作方法**

#### 启用 Bun 调试模式

```bash
export DEBUG="*"
plannotator review

# Windows PowerShell
$env:DEBUG = "*"
plannotator review
```

#### 查看 Plannotator 服务器日志

服务器内部的错误会通过 `console.error` 输出。关键日志位置：

- `packages/server/index.ts:260` - 集成错误日志
- `packages/server/git.ts:141` - Git diff 错误日志
- `apps/hook/server/index.ts:100-106` - Hook event 解析错误

**你应该看到**：

```bash
# 成功保存到 Obsidian
[Obsidian] Saved plan to: /path/to/vault/Plan - 2026-01-24.md

# 保存失败
[Obsidian] Save failed: Cannot write to directory
[Bear] Save failed: Failed to open Bear

# Git diff 错误
Git diff error for uncommitted: Error: Command failed: git diff HEAD
```

**检查点 ✅**：

- 错误日志包含足够的信息来定位问题
- 根据错误类型采取对应的解决方案

---

## 踩坑提醒

### ❌ 忽略 stderr 输出

**错误做法**：

```bash
# 只关注 stdout，忽略 stderr
plannotator review 2>/dev/null
```

**正确做法**：

```bash
# 同时查看 stdout 和 stderr
plannotator review
# 或分离日志
plannotator review 2>error.log
```

### ❌ 盲目重启服务器

**错误做法**：

- 遇到问题就重启，不查看错误原因

**正确做法**：

- 先查看错误日志，确定问题类型
- 根据错误类型采取对应的解决方案
- 重启只是最后的手段

### ❌ 在远程模式下期待浏览器自动打开

**错误做法**：

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# 期待浏览器自动打开（不会发生）
```

**正确做法**：

```bash
export PLANNOTATOR_REMOTE=1
plannotator review
# 记录输出的 URL，手动在浏览器中打开
# 或使用端口转发
```

---

## 本课小结

- Plannotator 使用 `console.error` 输出错误到 stderr，`console.log` 输出正常信息到 stdout
- 常见问题包括：端口占用、Hook event 解析失败、浏览器未打开、Git 仓库状态异常、集成失败
- 调试的核心是：查看日志 → 定位问题类型 → 采取对应解决方案
- 远程模式下不会自动打开浏览器，需要手动打开 URL 或配置端口转发

---

## 下一课预告

> 下一课我们学习 **[常见问题](../common-problems/)**。
>
> 你会学到：
> - 如何解决安装和配置问题
> - 常见的使用误区和注意事项
> - 性能优化建议

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 端口重试机制 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L79-L80) | 79-80 |
| EADDRINUSE 错误处理 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L320-L334) | 320-334 |
| Hook event 解析 | [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L91-L107) | 91-107 |
| 浏览器打开 | [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts#L45-L74) | 45-74 |
| Git diff 错误处理 | [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts#L139-L144) | 139-144 |
| Obsidian 保存日志 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L242-L246) | 242-246 |
| Bear 保存日志 | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L252-L256) | 252-256 |

**关键常量**：
- `MAX_RETRIES = 5`：端口重试最大次数
- `RETRY_DELAY_MS = 500`：端口重试延迟（毫秒）

**关键函数**：
- `startPlannotatorServer()`：启动计划评审服务器
- `startReviewServer()`：启动代码评审服务器
- `openBrowser()`：跨平台浏览器打开
- `runGitDiff()`：执行 Git diff 命令
- `saveToObsidian()`：保存计划到 Obsidian
- `saveToBear()`：保存计划到 Bear

</details>
