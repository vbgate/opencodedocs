---
title: "Claude Code 集成：配置权限运行流水线 | AI App Factory 教程"
sidebarTitle: "5 分钟配置 Claude Code"
subtitle: "Claude Code 集成：配置权限运行流水线 | AI App Factory 教程"
description: "学习如何配置 Claude Code 权限，安全运行 AI App Factory 流水线。了解自动生成 settings.local.json 的方法、白名单机制和跨平台权限配置最佳实践，避免使用危险的 --dangerously-skip-permissions 参数。本教程涵盖 Windows/macOS/Linux 路径处理和常见权限错误排查。"
tags:
  - "Claude Code"
  - "权限配置"
  - "AI 助手"
prerequisite:
  - "start-installation"
  - "start-init-project"
order: 50
---

# Claude Code 集成：配置权限运行流水线 | AI App Factory 教程

## 学完你能做什么

- 配置 Claude Code 的安全权限，无需使用 `--dangerously-skip-permissions`
- 理解 Factory 自动生成的权限白名单
- 在 Claude Code 中执行完整的 7 阶段流水线
- 掌握跨平台权限配置（Windows/macOS/Linux）

## 你现在的困境

第一次使用 Factory 时，你可能会遇到：

- **权限被阻止**：Claude Code 提示「没有权限读取文件」
- **使用危险参数**：被迫加上 `--dangerously-skip-permissions` 绕过安全检查
- **手动配置麻烦**：不知道应该允许哪些操作
- **跨平台问题**：Windows 和 Unix 路径权限不一致

其实，Factory 会**自动生成**完整的权限配置，你只需要正确使用即可。

## 什么时候用这一招

当你需要在 Claude Code 中运行 Factory 流水线时：

- 使用 `factory init` 初始化项目后（自动启动）
- 使用 `factory run` 继续流水线时
- 手动启动 Claude Code 时

::: info 为什么推荐 Claude Code？
Claude Code 是 Anthropic 官方的 AI 编程助手，与 Factory 的权限系统深度集成。相比其他 AI 助手，Claude Code 的权限管理更精细、更安全。
:::

## 核心思路

Factory 的权限配置采用**白名单机制**：只明确允许的操作，其他一律禁止。

### 权限白名单的类别

| 类别 | 允许的操作 | 用途 |
| --- | --- | --- |
| **文件操作** | Read/Write/Edit/Glob | 读取和修改项目文件 |
| **Git 操作** | git add/commit/push 等 | 版本控制 |
| **目录操作** | ls/cd/tree/pwd | 浏览目录结构 |
| **构建工具** | npm/yarn/pnpm | 安装依赖、运行脚本 |
| **TypeScript** | tsc/npx tsc | 类型检查 |
| **数据库** | npx prisma | 数据库迁移和管理 |
| **Python** | python/pip | UI 设计系统 |
| **测试** | vitest/jest/test | 运行测试 |
| **Factory CLI** | factory init/run/continue | 流水线命令 |
| **Docker** | docker compose | 容器化部署 |
| **Web 操作** | WebFetch(domain:...) | 获取 API 文档 |
| **Skills** | superpowers/ui-ux-pro-max | 插件技能 |

### 为什么不用 `--dangerously-skip-permissions`？

| 方式 | 安全性 | 推荐 |
| --- | --- | --- |
| `--dangerously-skip-permissions` | ❌ 允许 Claude 任意操作（包括删除文件） | 不推荐 |
| 白名单配置 | ✅ 只允许明确的操作，越权会提示错误 | 推荐 |

白名单配置虽然初始设置复杂，但一次生成后自动复用，更安全。

## 🎒 开始前的准备

在开始前，请确认：

- [x] 已完成 **安装与配置**（[start/installation/](../../start/installation/)）
- [x] 已完成 **初始化 Factory 项目**（[start/init-project/](../../start/init-project/)）
- [x] 已安装 Claude Code：https://claude.ai/code
- [x] 项目目录已初始化（存在 `.factory/` 目录）

::: warning 检查 Claude Code 是否安装
在终端运行以下命令确认：

```bash
claude --version
```

如果提示「command not found」，请先安装 Claude Code。
:::

## 跟我做

### 第 1 步：初始化项目（自动生成权限）

**为什么**：`factory init` 会自动生成 `.claude/settings.local.json`，包含完整的权限白名单。

在项目目录中运行：

```bash
# 创建新目录并进入
mkdir my-factory-project && cd my-factory-project

# 初始化 Factory 项目
factory init
```

**你应该看到**：

```
✓ Factory project initialized!
✓ Claude Code is starting...
  (Please wait for window to open)
```

Claude Code 窗口会自动打开，并显示以下提示：

```
请阅读.factory/pipeline.yaml和.factory/agents/orchestrator.checkpoint.md，
启动流水线，帮我将产品想法碎片转化为可运行的应用，
接下来我将会输入想法碎片。注意：Agent引用的skills/和policies/
文件需要先查找.factory/目录，再查找根目录。
```

**发生了什么**：

1. 创建 `.factory/` 目录，包含流水线配置
2. 生成 `.claude/settings.local.json`（权限白名单）
3. 自动启动 Claude Code，并传入启动提示

### 第 2 步：验证权限配置

**为什么**：确认权限文件已正确生成，避免运行时遇到权限问题。

检查生成的权限文件：

```bash
# 查看权限文件内容
cat .claude/settings.local.json
```

**你应该看到**（部分内容）：

```json
{
  "permissions": {
    "allow": [
      "Read(/path/to/project/**)",
      "Write(/path/to/project/**)",
      "Glob(/path/to/project/**)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(npm install:*)",
      "Bash(npx prisma generate:*)",
      "Skill(superpowers:brainstorming)",
      "Skill(ui-ux-pro-max)",
      "WebFetch(domain:github.com)",
      "WebFetch(domain:npmjs.org)"
    ]
  },
  "features": {
    "autoSave": true,
    "telemetry": false
  }
}
```

::: tip 路径说明
权限中的路径会根据你的操作系统自动调整：

- **Windows**：`Read(//c/Users/...)`（盘符小写和大写都支持）
- **macOS/Linux**：`Read(/Users/...)`（绝对路径）
:::

### 第 3 步：在 Claude Code 中启动流水线

**为什么**：Claude Code 已配置好权限，可以直接读取 Agent 定义和 Skill 文件。

在已打开的 Claude Code 窗口中，输入你的产品想法：

```
我想做一个移动端记账应用，帮助年轻人快速记录日常支出，
避免月底超支。主要功能是记录金额、选择分类（饮食、交通、娱乐、其他），
查看本月总支出。
```

**你应该看到**：

Claude Code 会执行以下步骤（自动完成）：

1. 读取 `.factory/pipeline.yaml`
2. 读取 `.factory/agents/orchestrator.checkpoint.md`
3. 开始 **Bootstrap 阶段**，将你的想法结构化为 `input/idea.md`
4. 完成后暂停，等待你确认

**检查点 ✅**：确认 Bootstrap 阶段已完成

```bash
# 查看生成的结构化想法
cat input/idea.md
```

### 第 4 步：继续流水线

**为什么**：每个阶段完成后，需要手动确认，避免错误累积。

在 Claude Code 中回复：

```
继续
```

Claude Code 会自动进入下一个阶段（PRD），并重复「执行→暂停→确认」的流程，直到完成所有 7 个阶段。

::: tip 使用 `factory run` 重新启动
如果 Claude Code 窗口关闭了，你可以在终端运行：

```bash
factory run
```

这会重新显示 Claude Code 的执行指令。
:::

### 第 5 步：跨平台权限处理（Windows 用户）

**为什么**：Windows 路径权限需要特殊处理，确保 Claude Code 能正确访问项目文件。

如果你使用的是 Windows，`factory init` 会自动生成支持盘符的权限：

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Read(//C/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)",
      "Write(//C/Users/yourname/project/**)"
    ]
  }
}
```

**检查点 ✅**：Windows 用户验证权限

```powershell
# PowerShell
Get-Content .claude\settings.local.json | Select-String -Pattern "Read|Write"
```

如果看到 `//c/` 和 `//C/` 两种路径格式，说明已正确配置。

## 检查点 ✅

完成上述步骤后，你应该能够：

- [x] 找到 `.claude/settings.local.json` 文件
- [x] 看到完整的权限白名单（包含 Read/Write/Bash/Skill/WebFetch）
- [x] 在 Claude Code 中成功启动 Bootstrap 阶段
- [x] 查看 `input/idea.md` 确认想法已结构化
- [x] 继续执行流水线到下一个阶段

如果遇到权限错误，请查看下方的「踩坑提醒」。

## 踩坑提醒

### 问题 1：权限被阻止

**错误提示**：
```
Permission denied: Read(path/to/file)
```

**原因**：
- 权限文件生成失败或路径不正确
- Claude Code 使用了旧的权限缓存

**解决方案**：

1. 检查权限文件是否存在：

```bash
ls -la .claude/settings.local.json
```

2. 重新生成权限：

```bash
# 删除旧的权限文件
rm .claude/settings.local.json

# 重新初始化（会重新生成）
factory init --force
```

3. 重启 Claude Code，清除缓存。

### 问题 2：`--dangerously-skip-permissions` 警告

**错误提示**：
```
Using --dangerously-skip-permissions is not recommended.
```

**原因**：
- 未找到 `.claude/settings.local.json`
- 权限文件格式错误

**解决方案**：

检查权限文件格式（JSON 语法）：

```bash
# 验证 JSON 格式
python -m json.tool .claude/settings.local.json
```

如果提示语法错误，删除文件后重新运行 `factory init`。

### 问题 3：Windows 路径权限不生效

**错误提示**：
```
Permission denied: Read(C:\Users\yourname\project\file.js)
```

**原因**：
- 权限配置中缺少盘符路径
- 路径格式不正确（Windows 需要使用 `//c/` 格式）

**解决方案**：

手动编辑 `.claude\settings.local.json`，添加盘符路径：

```json
{
  "permissions": {
    "allow": [
      "Read(//c/Users/yourname/project/**)",
      "Write(//c/Users/yourname/project/**)"
    ]
  }
}
```

注意盘符大小写都要支持（`//c/` 和 `//C/`）。

### 问题 4：Skills 权限被阻止

**错误提示**：
```
Permission denied: Skill(superpowers:brainstorming)
```

**原因**：
- 未安装必需的 Claude Code 插件（superpowers、ui-ux-pro-max）
- 插件版本不兼容

**解决方案**：

1. 添加插件市场：

```bash
# 添加 superpowers 插件市场
claude plugin marketplace add obra/superpowers-marketplace
```

2. 安装 superpowers 插件：

```bash
claude plugin install superpowers@superpowers-marketplace
```

3. 添加 ui-ux-pro-max 插件市场：

```bash
claude plugin marketplace add nextlevelbuilder/ui-ux-pro-max-skill
```

4. 安装 ui-ux-pro-max 插件：

```bash
claude plugin install ui-ux-pro-max@ui-ux-pro-max-skill
```

5. 重新运行流水线。

::: info Factory 会自动尝试安装插件
`factory init` 命令会自动尝试安装这些插件。如果失败，请手动安装。
:::

## 本课小结

- **权限白名单**比 `--dangerously-skip-permissions` 更安全
- **`factory init`** 会自动生成 `.claude/settings.local.json`
- 权限配置包含 **文件操作、Git、构建工具、数据库、Web 操作** 等类别
- **跨平台支持**：Windows 使用 `//c/` 路径，Unix 使用绝对路径
- **手动安装插件**：如果自动安装失败，需要在 Claude Code 中手动安装 superpowers 和 ui-ux-pro-max

## 下一课预告

> 下一课我们学习 **[OpenCode 与其他 AI 助手](../other-ai-assistants/)**。
>
> 你会学到：
> - 如何在 OpenCode 中运行 Factory 流水线
> - Cursor、GitHub Copilot 等其他 AI 助手的集成方法
> - 不同助手的权限配置差异

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 权限配置生成 | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-292 |
| 自动启动 Claude Code | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js) | 119-147 |
| AI 助手检测 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 105-124 |
| Claude Code 指令生成 | [`cli/commands/run.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/run.js) | 138-156 |
| 跨平台路径处理 | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 14-67 |

**关键函数**：
- `generatePermissions(projectDir)`：生成完整的权限白名单，包含 Read/Write/Bash/Skill/WebFetch 等操作
- `generateClaudeSettings(projectDir)`：生成并写入 `.claude/settings.local.json` 文件
- `launchClaudeCode(projectDir)`：启动 Claude Code 窗口并传入启动提示
- `detectAIAssistant()`：检测当前运行的 AI 助手类型（Claude Code/Cursor/OpenCode）

**关键常量**：
- Windows 路径模式：`Read(//c/**)`、`Write(//c/**)`（支持盘符小写和大写）
- Unix 路径模式：`Read(/path/to/project/**)`、`Write(/path/to/project/**)`
- Skills 权限：`'Skill(superpowers:brainstorming)'`、`'Skill(ui-ux-pro-max)'`

**权限白名单类别**：
- **文件操作**：Read/Write/Glob（支持通配符）
- **Git 操作**：git add/commit/push/pull 等（完整 Git 命令集）
- **构建工具**：npm/yarn/pnpm install/build/test/dev
- **TypeScript**：tsc/npx tsc/npx type-check
- **数据库**：npx prisma validate/generate/migrate/push
- **Python**：python/pip install（用于 ui-ux-pro-max）
- **测试**：vitest/jest/test
- **Factory CLI**：factory init/run/continue/status/reset
- **Docker**：docker compose/ps/build/run
- **Web 操作**：WebFetch(domain:github.com) 等（指定域名白名单）

</details>
