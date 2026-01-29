---
title: "安装: Agent Skills 插件 | opencode-agent-skills"
sidebarTitle: "5 分钟装好插件"
subtitle: "安装: Agent Skills 插件 | opencode-agent-skills"
description: "学习 opencode-agent-skills 的三种安装方式。包括基本安装、固定版本安装和本地开发安装，适用于不同使用场景。"
tags:
  - "安装"
  - "插件"
  - "快速开始"
prerequisite: []
order: 2
---

# 安装 OpenCode Agent Skills

## 学完你能做什么

- 用三种方式为 OpenCode 安装 Agent Skills 插件
- 验证插件是否正确安装
- 理解固定版本和最新版本的区别

## 你现在的困境

你想让 AI Agent 学会复用技能，但不知道如何在 OpenCode 中启用这个功能。OpenCode 的插件系统看起来有点复杂，你担心配置错误。

## 什么时候用这一招

**你需要 AI Agent 具备以下能力时**：
- 在不同项目间复用技能（比如代码规范、测试模板）
- 加载 Claude Code 的技能库
- 让 AI 遵循特定工作流程

## 🎒 开始前的准备

::: warning 前置检查

开始前，请确认：

- 已安装 [OpenCode](https://opencode.ai/) v1.0.110 或更高版本
- 能够访问 `~/.config/opencode/opencode.json` 配置文件（OpenCode 的配置文件）

:::

## 核心思路

OpenCode Agent Skills 是一个插件，它通过 npm 发布，安装方式很简单：在配置文件中声明插件名，OpenCode 会在启动时自动下载并加载。

**三种安装方式的适用场景**：

| 方式 | 适用场景 | 优缺点 |
|--- | --- | ---|
| **基本安装** | 每次启动都使用最新版本 | ✅ 方便自动更新<br>❌ 可能遇到破坏性更新 |
| **固定版本** | 需要稳定的生产环境 | ✅ 版本可控<br>❌ 需要手动升级 |
| **本地开发** | 自定义插件或贡献代码 | ✅ 灵活修改<br>❌ 需要手动管理依赖 |

---

## 跟我做

### 方式一：基本安装（推荐）

这是最简单的方式，每次 OpenCode 启动时都会检查并下载最新版本。

**为什么**
适合大多数用户，保证你总是使用最新功能和 bug 修复。

**步骤**

1. 打开 OpenCode 配置文件

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json

# Windows (使用记事本)
notepad %APPDATA%\opencode\opencode.json
```

2. 在配置文件中添加插件名

```json
{
  "plugin": ["opencode-agent-skills"]
}
```

如果文件中已有其他插件，在 `plugin` 数组中添加即可：

```json
{
  "plugin": ["other-plugin", "opencode-agent-skills"]
}
```

3. 保存文件并重启 OpenCode

**你应该看到**：
- OpenCode 重新启动，在启动日志中看到插件加载成功
- 在 AI 对话中可以使用 `get_available_skills` 等工具

### 方式二：固定版本安装（适合生产环境）

如果你希望锁定插件版本，避免自动更新带来的意外，使用这种方式。

**为什么**
生产环境通常需要版本控制，固定版本可以确保团队使用相同的插件版本。

**步骤**

1. 打开 OpenCode 配置文件

```bash
# macOS/Linux
nano ~/.config/opencode/opencode.json
```

2. 在配置文件中添加带版本号的插件名

```json
{
  "plugin": ["opencode-agent-skills@0.6.4"]
}
```

3. 保存文件并重启 OpenCode

**你应该看到**：
- OpenCode 使用固定版本 v0.6.4 启动
- 插件缓存到本地，无需每次下载

::: tip 版本管理

固定版本的插件会缓存到 OpenCode 本地，升级版本时需要手动修改版本号并重启。查看 [最新版本](https://www.npmjs.com/package/opencode-agent-skills) 更新。

:::

### 方式三：本地开发安装（面向贡献者）

如果你想自定义插件或参与开发，使用这种方式。

**为什么**
开发过程中可以立即看到代码修改效果，无需等待 npm 发布。

**步骤**

1. 克隆仓库到 OpenCode 配置目录

```bash
git clone https://github.com/joshuadavidthomas/opencode-agent-skills ~/.config/opencode/opencode-agent-skills
```

2. 进入项目目录并安装依赖

```bash
cd ~/.config/opencode/opencode-agent-skills
bun install
```

::: info 为什么用 Bun

项目使用 Bun 作为运行时和包管理器，根据 package.json 的 `engines` 字段，要求 Bun >= 1.0.0。

:::

3. 创建插件符号链接

```bash
mkdir -p ~/.config/opencode/plugin
ln -sf ~/.config/opencode/opencode-agent-skills/src/plugin.ts ~/.config/opencode/plugin/skills.ts
```

**你应该看到**：
- `~/.config/opencode/plugin/skills.ts` 指向你的本地插件代码
- 修改代码后重启 OpenCode 即可生效

---

## 检查点 ✅

完成安装后，用以下方式验证：

**方法 1：查看工具列表**

在 OpenCode 中询问 AI：

```
请列出所有可用的工具，看看有没有技能相关的工具？
```

你应该看到包含以下工具：
- `use_skill` - 加载技能
- `read_skill_file` - 读取技能文件
- `run_skill_script` - 执行技能脚本
- `get_available_skills` - 获取可用技能列表

**方法 2：调用工具**

```
请调用 get_available_skills 查看当前有哪些技能可用？
```

你应该看到技能列表（可能为空，但工具调用成功）。

**方法 3：查看启动日志**

检查 OpenCode 的启动日志，应该有类似：

```
[plugin] Loaded plugin: opencode-agent-skills
```

---

## 踩坑提醒

### 问题 1：OpenCode 启动后工具未出现

**可能原因**：
- 配置文件 JSON 格式错误（缺少逗号、引号等）
- OpenCode 版本过低（需要 >= v1.0.110）
- 插件名称拼写错误

**解决方法**：
1. 用 JSON 验证工具检查配置文件语法
2. 运行 `opencode --version` 确认版本
3. 确认插件名是 `opencode-agent-skills`（注意连字符）

### 问题 2：固定版本升级后没生效

**原因**：固定版本插件会缓存到本地，更新版本号后需要清除缓存。

**解决方法**：
1. 修改配置文件中的版本号
2. 重启 OpenCode
3. 如果仍然没生效，清除 OpenCode 插件缓存（位置取决于你的系统）

### 问题 3：本地开发安装后修改不生效

**原因**：符号链接错误或 Bun 依赖未安装。

**解决方法**：
1. 检查符号链接是否正确：
   ```bash
   ls -la ~/.config/opencode/plugin/skills.ts
   ```
   应该指向 `~/.config/opencode/opencode-agent-skills/src/plugin.ts`

2. 确认依赖已安装：
   ```bash
   cd ~/.config/opencode/opencode-agent-skills
   bun install
   ```

---

## 本课小结

本课学习了三种安装方式：

- **基本安装**：在配置文件中添加 `opencode-agent-skills`，适合大多数人
- **固定版本安装**：添加 `opencode-agent-skills@版本号`，适合生产环境
- **本地开发安装**：克隆仓库并创建符号链接，适合开发者

安装后可以通过工具列表、工具调用或启动日志验证。

---

## 下一课预告

> 下一课我们学习 **[创建你的第一个技能](../creating-your-first-skill/)**。
>
> 你会学到：
> - 技能目录结构
> - SKILL.md 的 YAML frontmatter 格式
> - 如何编写技能内容

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| 插件入口定义 | [`package.json:18`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L18)         | 18      |
| 插件主文件 | [`src/plugin.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/plugin.ts)         | 全文件  |
| 依赖配置    | [`package.json:27-32`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L27-L32) | 27-32   |
| 版本要求    | [`package.json:39-41`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/package.json#L39-L41) | 39-41   |

**关键配置**：
- `main: "src/plugin.ts"`：插件入口文件
- `engines.bun: ">=1.0.0"`：运行时版本要求

**关键依赖**：
- `@opencode-ai/plugin ^1.0.115`：OpenCode 插件 SDK
- `@huggingface/transformers ^3.8.1`：语义匹配模型
- `zod ^4.1.13`：Schema 验证
- `yaml ^2.8.2`：YAML 解析

</details>
