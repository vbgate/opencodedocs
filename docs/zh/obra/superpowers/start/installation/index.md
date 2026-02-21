---
title: "安装指南：Claude Code / OpenCode / Codex | Superpowers 教程"
sidebarTitle: "安装指南"
subtitle: "安装指南：Claude Code / OpenCode / Codex"
description: "学习如何在不同 AI 编码平台安装 Superpowers 技能库。本教程详细涵盖 Claude Code 插件市场一键安装、OpenCode 手动配置符号链接、Codex CLI 集成三大平台的完整安装步骤、验证方法和故障排查，助你快速开启 TDD、系统化调试等最佳实践开发工作流。"
tags:
  - "安装"
  - "配置"
  - "Claude Code"
  - "OpenCode"
  - "Codex"
prerequisite:
  - "start-superpowers-intro"
  - "start-quick-start"
order: 30
---

# 安装指南：Claude Code / OpenCode / Codex

## 学完你能做什么

- 根据你使用的 AI 编码平台，选择正确的安装方式
- 完成安装后验证 Superpowers 是否正常工作
- 遇到问题时知道如何检查和修复

## 你现在的困境

Superpowers 支持三个主流平台，但每个平台的安装方式都不一样。你可能：
- 不知道自己用的是哪个平台
- 按照错误的安装步骤折腾半天
- 安装完不知道怎么验证是否成功

**好消息**：本文会逐个平台讲清楚，跟着做就行。

## 什么时候用这一招

这是你使用 Superpowers 的第一步。无论你是：
- 第一次接触 Superpowers
- 切换到新平台
- 升级到最新版本

都需要重新配置。

## 🎒 开始前的准备

在开始之前，先确认你的平台：

| 平台 | 特征 | 如何判断 |
| ---- | ---- | -------- |
| **Claude Code** | 有斜杠命令如 `/plugin` | 对话中有 `/help` 命令可用 |
| **OpenCode** | 有 `skill` 工具 | 可以让 AI 使用 `skill tool` |
| **Codex** | 命令行工具 | 通过终端命令与 AI 交互 |

::: warning 前置知识
- 熟悉基本的终端命令（`git clone`, `mkdir`, `ls` 等）
- 知道如何运行你使用的 AI 编码平台
:::

---

## Claude Code 安装

Claude Code 有内置的插件市场，安装最简单。

### 第 1 步：注册插件市场

告诉 Claude Code：

```bash
/plugin marketplace add obra/superpowers-marketplace
```

**你应该看到**：市场添加成功的提示。

### 第 2 步：安装插件

```bash
/plugin install superpowers@superpowers-marketplace
```

**你应该看到**：插件安装完成的确认信息。

### 第 3 步：验证安装

```bash
/help
```

**你应该看到**以下命令出现在帮助列表中：

```bash
/superpowers:brainstorm   # Interactive design refinement
/superpowers:write-plan   # Create implementation plan
/superpowers:execute-plan # Execute plan in batches
```

如果看到这些命令，说明安装成功！

---

## OpenCode 安装

OpenCode 需要手动克隆仓库并创建符号链接。

### 第 1 步：克隆 Superpowers

```bash
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
```

**你应该看到**：Git 克隆完成的输出，显示下载了多少文件。

### 第 2 步：注册插件

创建符号链接让 OpenCode 发现插件：

```bash
mkdir -p ~/.config/opencode/plugins
rm -f ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js ~/.config/opencode/plugins/superpowers.js
```

### 第 3 步：链接技能库

创建符号链接让 OpenCode 的 skill 工具能发现 Superpowers 技能：

```bash
mkdir -p ~/.config/opencode/skills
rm -rf ~/.config/opencode/skills/superpowers
ln -s ~/.config/opencode/superpowers/skills ~/.config/opencode/skills/superpowers
```

### 第 4 步：重启 OpenCode

**重要**：必须重启才能让插件生效。

### 第 5 步：验证安装

检查符号链接是否正确：

```bash
ls -l ~/.config/opencode/plugins/superpowers.js
ls -l ~/.config/opencode/skills/superpowers
```

**你应该看到**：两个符号链接都指向 `~/.config/opencode/superpowers/` 目录。

然后问 OpenCode：

```
do you have superpowers?
```

**你应该看到**：OpenCode 确认它有 superpowers 技能。

### macOS / Linux 一键脚本

如果你在 macOS 或 Linux 上，可以用这个脚本自动安装或更新：

```bash
# 1. 安装或更新 Superpowers
if [ -d ~/.config/opencode/superpowers ]; then
  cd ~/.config/opencode/superpowers && git pull
else
  git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
fi

# 2. 创建目录
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills

# 3. 删除旧的符号链接或目录
rm -f ~/.config/opencode/plugins/superpowers.js
rm -rf ~/.config/opencode/skills/superpowers

# 4. 创建符号链接
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/skills ~/.config/opencode/skills/superpowers

# 5. 重启 OpenCode
```

---

## Codex 安装

Codex 需要手动克隆仓库并更新配置文件。

### 第 1 步：克隆 Superpowers

```bash
git clone https://github.com/obra/superpowers.git ~/.codex/superpowers
```

**你应该看到**：Git 克隆完成的输出。

### 第 2 步：创建个人技能目录

```bash
mkdir -p ~/.codex/skills
```

### 第 3 步：更新 AGENTS.md

编辑 `~/.codex/AGENTS.md` 文件，添加以下内容：

```markdown
## Superpowers System

<EXTREMELY_IMPORTANT>
You have superpowers. Superpowers teach you new skills and capabilities. RIGHT NOW run: `~/.codex/superpowers/.codex/superpowers-codex bootstrap` and follow the instructions it returns.
</EXTREMELY_IMPORTANT>
```

### 第 4 步：验证安装

```bash
~/.codex/superpowers/.codex/superpowers-codex bootstrap
```

**你应该看到**：技能列表和 bootstrap 指令。如果显示了可用技能，说明安装成功！

---

## 踩坑提醒

### 符号链接失效（OpenCode）

如果 OpenCode 提示找不到插件或技能：

1. 检查插件符号链接：`ls -l ~/.config/opencode/plugins/superpowers.js`
2. 检查源文件是否存在：`ls ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js`
3. 检查 OpenCode 日志是否有错误信息

### 技能不显示（OpenCode）

如果 OpenCode 的 `skill` 工具列不出 Superpowers 技能：

1. 检查技能符号链接：`ls -l ~/.config/opencode/skills/superpowers`
2. 确认它指向正确的位置：`~/.config/opencode/superpowers/skills`
3. 使用 `skill` 工具列出已发现的技能，看看有什么问题

### 插件命令不显示（Claude Code）

如果 `/help` 中看不到 Superpowers 命令：

1. 确认插件市场已添加：尝试 `/plugin marketplace list`
2. 重新安装插件：`/plugin uninstall superpowers@superpowers-marketplace` 然后再安装
3. 重启 Claude Code

### Bootstrap 失败（Codex）

如果 `superpowers-codex bootstrap` 报错：

1. 确认脚本有执行权限：`chmod +x ~/.codex/superpowers/.codex/superpowers-codex`
2. 检查 Node.js 是否安装：`node --version`
3. 检查 Git 仓库是否正确克隆：`ls -la ~/.codex/superpowers`
4. 查看 `.codex/AGENTS.md` 是否正确更新

---

## 更新到最新版本

### Claude Code

使用插件系统内置的更新命令：

```bash
/plugin update superpowers
```

### OpenCode 和 Codex

手动安装的平台通过 git pull 更新：

#### OpenCode

```bash
cd ~/.config/opencode/superpowers
git pull
```

#### Codex

```bash
cd ~/.codex/superpowers
git pull
```

---

## 本课小结

| 平台 | 安装方式 | 核心步骤 |
| ---- | -------- | -------- |
| **Claude Code** | 插件市场 | 注册市场 → 安装插件 |
| **OpenCode** | 手动安装 | 克隆 → 链接插件 → 链接技能 → 重启 |
| **Codex** | 手动安装 | 克隆 → 更新 AGENTS.md → 运行 bootstrap |

**记住**：安装完成后一定要验证，确保技能可用。

---

## 下一课预告

> 下一课我们学习 **[验证安装](../verification/)**。
>
> 你会学到：
> - 如何检查技能是否正确加载
> - 如何测试基本技能调用
> - 常见安装错误的排查方法
