---
title: "安装与配置 | Agent App Factory 教程"
sidebarTitle: "5 分钟完成安装"
subtitle: "安装与配置 | Agent App Factory 教程"
description: "学习如何安装 Agent App Factory CLI 工具，配置 Claude Code 或 OpenCode，以及安装必需的插件。本教程涵盖 Node.js 环境要求、AI 助手设置和插件安装步骤。"
tags:
  - "安装"
  - "配置"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 20
---

# 安装与配置

## 学完你能做什么

✅ 安装 Agent App Factory CLI 工具并验证安装
✅ 配置 Claude Code 或 OpenCode 作为 AI 执行引擎
✅ 安装运行流水线所需的必需插件
✅ 完成项目初始化并启动第一个 Factory 项目

## 你现在的困境

想用 AI App Factory 把想法变成应用，但不知道该装什么工具、配什么环境。装好了又怕漏掉必需的插件，流水线跑到一半报错。

## 什么时候用这一招

当你第一次使用 AI App Factory，或者在新机器上重新搭建开发环境时，先完成安装配置，再开始生成应用。

## 🎒 开始前的准备

::: warning 前置要求

在开始安装前，请确保：

- **Node.js 版本 >= 16.0.0** - 这是 CLI 工具的最低要求
- **npm 或 yarn** - 用于全局安装包
- **一个 AI 助手** - Claude Code 或 OpenCode（推荐 Claude Code）

:::

**检查 Node.js 版本**：

```bash
node --version
```

如果版本低于 16.0.0，请从 [Node.js 官网](https://nodejs.org) 下载并安装最新 LTS 版本。

## 核心思路

AI App Factory 的安装包含 3 个关键部分：

1. **CLI 工具** - 提供命令行接口，管理项目状态
2. **AI 助手** - 执行流水线的"大脑"，解读 Agent 指令
3. **必需插件** - 增强 AI 能力的扩展包（Bootstrap 头脑风暴、UI 设计系统）

安装流程：安装 CLI → 配置 AI 助手 → 初始化项目（自动安装插件）

## 跟我做

### 第 1 步：安装 CLI 工具

全局安装 Agent App Factory CLI，这样你就可以在任何目录使用 `factory` 命令。

```bash
npm install -g agent-app-factory
```

**你应该看到**：安装成功的输出

```
added 1 package in Xs
```

**验证安装**：

```bash
factory --version
```

**你应该看到**：版本号输出

```
1.0.0
```

如果看不到版本号，检查是否安装成功：

```bash
which factory  # macOS/Linux
where factory  # Windows
```

::: tip 安装失败？

如果遇到权限问题（macOS/Linux），尝试：

```bash
sudo npm install -g agent-app-factory
```

或者使用 npx 而不全局安装（不推荐，每次使用需要下载）：

```bash
npx agent-app-factory init
```

:::

### 第 2 步：安装 AI 助手

AI App Factory 必须配合 AI 助手使用，因为 Agent 定义和 Skill 文件是 Markdown 格式的 AI 指令，需要 AI 来解读和执行。

#### 方案 A：Claude Code（推荐）

Claude Code 是 Anthropic 官方的 AI 编程助手，与 AI App Factory 深度集成。

**安装方式**：

1. 访问 [Claude Code 官网](https://claude.ai/code)
2. 下载并安装对应平台的应用程序
3. 完成安装后，验证命令是否可用：

```bash
claude --version
```

**你应该看到**：版本号输出

```
Claude Code 1.x.x
```

#### 方案 B：OpenCode

OpenCode 是另一个支持 Agent 模式的 AI 编程助手。

**安装方式**：

1. 访问 [OpenCode 官网](https://opencode.sh)
2. 下载并安装对应平台的应用程序
3. 如果没有命令行工具，手动下载安装到：

- **Windows**: `%LOCALAPPDATA%\Programs\OpenCode\`
- **macOS**: `/Applications/OpenCode.app/`
- **Linux**: `/usr/bin/opencode` 或 `/usr/local/bin/opencode`

::: info 为什么推荐 Claude Code？

- 官方支持，与 AI App Factory 的权限系统集成最好
- 插件安装自动化，`factory init` 会自动配置必需的插件
- 更好的上下文管理，节省 Token

:::

### 第 3 步：初始化第一个 Factory 项目

现在你有了一个干净的工厂，让我们初始化第一个项目。

**创建项目目录**：

```bash
mkdir my-first-app && cd my-first-app
```

**初始化 Factory 项目**：

```bash
factory init
```

**你应该看到**：

```
Agent Factory - Project Initialization

✓ Factory project initialized!

Project structure created:
  .factory/
    agents/
    skills/
    policies/
    templates/
    pipeline.yaml
    config.yaml
    state.json

✓ Plugins installed!

Starting Claude Code...
✓ Claude Code is starting...
  (Please wait for window to open)
```

**检查点 ✅**：确认以下文件已创建

```bash
ls -la .factory/
```

**你应该看到**：

```
agents/
skills/
policies/
templates/
pipeline.yaml
config.yaml
state.json
```

同时，Claude Code 窗口应该会自动打开。

::: tip 目录必须为空

`factory init` 只能在空目录或只包含 `.git`、`README.md` 等配置文件的目录运行。

如果目录中有其他文件，会看到错误：

```
Cannot initialize: directory is not empty.
Factory init requires an empty directory or one with only git/config files.
```

:::

### 第 4 步：自动安装的插件

`factory init` 会尝试自动安装两个必需的插件：

1. **superpowers** - Bootstrap 阶段的头脑风暴技能
2. **ui-ux-pro-max-skill** - UI 阶段的设计系统（67 种样式、96 种调色板、100 条行业规则）

如果自动安装失败，你会看到警告：

```
Note: superpowers plugin installation failed
The bootstrap stage may prompt you to install it manually
```

::: warning 插件安装失败怎么办？

如果在初始化时插件安装失败，后续可以在 Claude Code 中手动安装：

1. 在 Claude Code 中输入：
   ```
   /install superpowers
   /install ui-ux-pro-max-skill
   ```

2. 或者访问插件市场手动安装

:::

### 第 5 步：验证 AI 助手权限

`factory init` 会自动生成 `.claude/settings.local.json` 文件，配置必要的权限。

**检查权限配置**：

```bash
cat .claude/settings.local.json
```

**你应该看到**（简化版）：

```json
{
  "allowedCommands": [
    "read",
    "write",
    "glob",
    "bash"
  ],
  "allowedPaths": [
    ".factory/**",
    "input/**",
    "artifacts/**"
  ]
}
```

这些权限确保 AI 助手可以：
- 读取 Agent 定义和 Skill 文件
- 写入产物到 `artifacts/` 目录
- 执行必要的脚本和测试

::: danger 不要使用 --dangerously-skip-permissions

AI App Factory 生成的权限配置已经足够安全，不要在 Claude Code 中使用 `--dangerously-skip-permissions`，这会降低安全性并可能导致越权操作。

:::

## 踩坑提醒

### ❌ Node.js 版本过低

**错误**：`npm install -g agent-app-factory` 安装失败或运行时报错

**原因**：Node.js 版本低于 16.0.0

**解决**：升级 Node.js 到最新 LTS 版本

```bash
# 使用 nvm 升级（推荐）
nvm install --lts
nvm use --lts
```

### ❌ Claude Code 未正确安装

**错误**：`factory init` 执行后提示 "Claude CLI not found"

**原因**：Claude Code 没有正确添加到 PATH

**解决**：重新安装 Claude Code，或者手动将可执行文件路径添加到环境变量

- **Windows**: 添加 Claude Code 安装目录到 PATH
- **macOS/Linux**: 检查 `/usr/local/bin/` 中是否有 `claude` 可执行文件

### ❌ 目录非空

**错误**：`factory init` 提示 "directory is not empty"

**原因**：目录中已有其他文件（除 `.git`、`README.md` 等配置文件外）

**解决**：在新空目录中初始化，或者清理现有目录

```bash
# 清理目录中的非配置文件
rm -rf * !(.git) !(README.md)
```

### ❌ 插件安装失败

**错误**：`factory init` 显示插件安装失败的警告

**原因**：网络问题或 Claude Code 插件市场暂时不可用

**解决**：手动在 Claude Code 中安装插件，或者在后续流水线执行时按提示安装

```
/install superpowers
/install ui-ux-pro-max-skill
```

## 本课小结

本课完成了 AI App Factory 的完整安装配置：

1. ✅ **CLI 工具** - 通过 `npm install -g agent-app-factory` 全局安装
2. ✅ **AI 助手** - Claude Code 或 OpenCode，推荐 Claude Code
3. ✅ **项目初始化** - `factory init` 创建 `.factory/` 目录并自动配置
4. ✅ **必需插件** - superpowers 和 ui-ux-pro-max-skill（自动或手动安装）
5. ✅ **权限配置** - 自动生成 Claude Code 权限文件

现在你有了一个可以运行的 Factory 项目，Claude Code 窗口已经打开，准备执行流水线。

## 下一课预告

> 下一课我们学习 **[初始化 Factory 项目](../init-project/)**。
>
> 你会学到：
> - 了解 `factory init` 生成的目录结构
> - 理解 `.factory/` 目录中每个文件的用途
> - 掌握如何修改项目配置
> - 学习如何查看项目状态

准备好开始生成你的第一个应用了吗？继续吧！

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-29

| 功能           | 文件路径                                                                                           | 行号    |
| -------------- | -------------------------------------------------------------------------------------------------- | ------- |
| CLI 入口       | [`cli/bin/factory.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/bin/factory.js)         | 1-123   |
| 初始化命令     | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js)     | 1-457   |
| Node.js 要求   | [`package.json`](https://github.com/hyz1992/agent-app-factory/blob/main/package.json)                    | 41      |
| Claude Code 启动 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L119-L147) | 119-147 |
| OpenCode 启动 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L152-L215) | 152-215 |
| 插件安装检查 | [`cli/commands/init.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/commands/init.js#L360-L392) | 360-392 |
| 权限配置生成   | [`cli/utils/claude-settings.js`](https://github.com/hyz1992/agent-app-factory/blob/main/cli/utils/claude-settings.js) | 1-275   |

**关键常量**：
- `NODE_VERSION_MIN = "16.0.0"`：最低 Node.js 版本要求（package.json:41）

**关键函数**：
- `getFactoryRoot()`：获取 Factory 安装根目录（factory.js:22-52）
- `init()`：初始化 Factory 项目（init.js:220-456）
- `launchClaudeCode()`：启动 Claude Code（init.js:119-147）
- `launchOpenCode()`：启动 OpenCode（init.js:152-215）
- `generateClaudeSettings()`：生成 Claude Code 权限配置

</details>
