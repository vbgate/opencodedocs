---
title: "OpenCode 平台完全指南：插件安装与技能优先级系统 | Superpowers 教程"
sidebarTitle: "在 OpenCode 中使用"
subtitle: "OpenCode 平台集成指南"
description: "学习如何在 OpenCode 中安装和配置 Superpowers 插件，掌握三级技能优先级系统（项目、个人、Superpowers），深入理解系统提示转换机制和工具映射规则，快速掌握 AI 编码最佳实践并提升开发效率。"
tags:
  - "OpenCode"
  - "插件安装"
  - "技能优先级"
  - "系统提示转换"
prerequisite:
  - "start-quick-start"
order: 70
---

# OpenCode 平台集成指南

## 学完你能做什么

- 在 OpenCode 中安装 Superpowers 插件
- 理解三级技能优先级系统（项目 > 个人 > Superpowers）
- 使用 OpenCode 原生 skill tool 发现和加载技能
- 验证系统提示转换是否正常工作
- 在不同操作系统上手动安装和配置

## 你现在的困境

OpenCode 是强大的 AI 编码工具，但缺乏系统化的工作流指导：
- 你想遵循 TDD 原则，但 AI 总是直接跳到写代码
- 遇到 bug 时随意调试，找不到根本原因
- 不知道如何在多个会话间传递上下文

Superpowers 通过插件形式，在 OpenCode 中注入完整的工作流和最佳实践。

## 什么时候用这一招

- **首次使用 Superpowers**：必须先安装插件
- **验证技能加载**：检查技能优先级是否正确
- **自定义技能开发**：理解项目技能如何覆盖 Superpowers 技能
- **调试插件问题**：检查系统提示转换是否工作

## 核心思路

Superpowers 在 OpenCode 中通过三层机制工作：

| 层级 | 组件 | 作用 |
| --- | --- | --- |
| **插件层** | superpowers.js | 系统提示转换钩子（transform hook） |
| **技能层** | 符号链接目录 | 技能发现和加载 |
| **映射层** | 工具映射指令 | Claude Code 技能适配 OpenCode |

**系统提示转换工作原理**：

```mermaid
graph LR
    A[用户发送消息] --> B[experimental.chat.system.transform 钩子触发]
    B --> C[读取 using-superpowers 技能]
    C --> D[生成 bootstrap 内容]
    D --> E[注入到 system prompt]
    E --> F[AI 自动获得技能系统知识]
```

**技能优先级系统**：

OpenCode 按以下顺序发现技能：

```
1. 项目技能（.opencode/skills/）
   ↓ 最高优先级
2. 个人技能（~/.config/opencode/skills/）
   ↓ 中等优先级
3. Superpowers 技能（~/.config/opencode/skills/superpowers/）
   ↓ 基础优先级
```

这意味着你可以创建**项目特定技能**来覆盖 Superpowers 提供的技能。

## 跟我做：快速安装

### 第 1 步：让 AI 帮你安装

**为什么**
OpenCode 支持通过自然语言描述安装任务，这是最快的方式。

**操作**

在 OpenCode 中运行：

```
Clone https://github.com/obra/superpowers to ~/.config/opencode/superpowers, then create directory ~/.config/opencode/plugins, then symlink ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js to ~/.config/opencode/plugins/superpowers.js, then symlink ~/.config/opencode/superpowers/skills to ~/.config/opencode/skills/superpowers, then restart opencode.
```

**你应该看到**：

```bash
✓ Repository cloned to ~/.config/opencode/superpowers
✓ Directories created
✓ Symlinks created
```

### 第 2 步：验证安装

**为什么**
确认符号链接正确创建，OpenCode 能加载插件和技能。

**操作**

```bash
# 检查插件符号链接
ls -l ~/.config/opencode/plugins/superpowers.js

# 检查技能符号链接
ls -l ~/.config/opencode/skills/superpowers
```

**你应该看到**：

```bash
# 插件符号链接
~/.config/opencode/plugins/superpowers.js -> ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js

# 技能符号链接
~/.config/opencode/skills/superpowers -> ~/.config/opencode/superpowers/skills
```

如果看到 `->` 符号，说明符号链接创建成功。

## 跟我做：手动安装（macOS/Linux）

### 前置条件

- [x] OpenCode.ai 已安装
- [x] Git 已安装

### 第 1 步：克隆或更新仓库

**为什么**
获取 Superpowers 最新代码。

**操作**

```bash
# 如果已存在则更新，否则克隆
if [ -d ~/.config/opencode/superpowers ]; then
  cd ~/.config/opencode/superpowers && git pull
else
  git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
fi
```

**你应该看到**：

```bash
Cloning into '~/.config/opencode/superpowers'...
remote: Enumerating objects: 1234, done.
...
```

### 第 2 步：创建目录

**为什么**
OpenCode 需要特定的目录结构来发现插件和技能。

**操作**

```bash
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills
```

### 第 3 步：清理旧链接

**为什么**
避免符号链接冲突导致安装失败。

**操作**

```bash
# 删除旧的插件链接（如果存在）
rm -f ~/.config/opencode/plugins/superpowers.js

# 删除旧的技能链接（如果存在）
rm -rf ~/.config/opencode/skills/superpowers
```

### 第 4 步：创建符号链接

**为什么**
将 Superpowers 的插件和技能目录链接到 OpenCode 的发现路径。

**操作**

```bash
# 创建插件符号链接
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js \
   ~/.config/opencode/plugins/superpowers.js

# 创建技能符号链接
ln -s ~/.config/opencode/superpowers/skills \
   ~/.config/opencode/skills/superpowers
```

**你应该看到**：没有输出（成功时），如果报错说明路径问题。

### 第 5 步：重启 OpenCode

**为什么**
OpenCode 需要重启才能加载新插件。

**操作**

```bash
# 关闭并重新启动 OpenCode
```

## 跟我做：手动安装（Windows）

### 前置条件

- [x] OpenCode.ai 已安装
- [x] Git 已安装
- [x] 开发者模式已启用 或有管理员权限

**启用开发者模式**：

| Windows 版本 | 路径 |
| --- | --- |
| Windows 10 | 设置 → 更新和安全 → 针对开发人员 |
| Windows 11 | 设置 → 系统 → 针对开发人员 |

::: code-group

```powershell [PowerShell]
# 第 1 步：克隆仓库
git clone https://github.com/obra/superpowers.git "$env:USERPROFILE\.config\opencode\superpowers"

# 第 2 步：创建目录
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\plugins"
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.config\opencode\skills"

# 第 3 步：清理旧链接
Remove-Item "$env:USERPROFILE\.config\opencode\plugins\superpowers.js" -Force -ErrorAction SilentlyContinue
Remove-Item "$env:USERPROFILE\.config\opencode\skills\superpowers" -Force -ErrorAction SilentlyContinue

# 第 4 步：创建插件符号链接（需要开发者模式或管理员）
New-Item -ItemType SymbolicLink -Path "$env:USERPROFILE\.config\opencode\plugins\superpowers.js" -Target "$env:USERPROFILE\.config\opencode\superpowers\.opencode\plugins\superpowers.js"

# 第 5 步：创建技能目录连接（无需特殊权限）
New-Item -ItemType Junction -Path "$env:USERPROFILE\.config\opencode\skills\superpowers" -Target "$env:USERPROFILE\.config\opencode\superpowers\skills"

# 第 6 步：重启 OpenCode
```

```cmd [Command Prompt]
:: 第 1 步：克隆仓库
git clone https://github.com/obra/superpowers.git "%USERPROFILE%\.config\opencode\superpowers"

:: 第 2 步：创建目录
mkdir "%USERPROFILE%\.config\opencode\plugins" 2>nul
mkdir "%USERPROFILE%\.config\opencode\skills" 2>nul

:: 第 3 步：清理旧链接
del "%USERPROFILE%\.config\opencode\plugins\superpowers.js" 2>nul
rmdir "%USERPROFILE%\.config\opencode\skills\superpowers" 2>nul

:: 第 4 步：创建插件符号链接（需要开发者模式或管理员）
mklink "%USERPROFILE%\.config\opencode\plugins\superpowers.js" "%USERPROFILE%\.config\opencode\superpowers\.opencode\plugins\superpowers.js"

:: 第 5 步：创建技能目录连接（无需特殊权限）
mklink /J "%USERPROFILE%\.config\opencode\skills\superpowers" "%USERPROFILE%\.config\opencode\superpowers\skills"

:: 第 6 步：重启 OpenCode
```

```bash [Git Bash]
::: warning 注意事项
Git Bash 的 `ln` 命令会复制文件而不是创建符号链接。必须使用 `cmd //c mklink`。

# 第 1 步：克隆仓库
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers

# 第 2 步：创建目录
mkdir -p ~/.config/opencode/plugins ~/.config/opencode/skills

# 第 3 步：清理旧链接
rm -f ~/.config/opencode/plugins/superpowers.js 2>/dev/null
rm -rf ~/.config/opencode/skills/superpowers 2>/dev/null

# 第 4 步：创建插件符号链接（需要开发者模式或管理员）
cmd //c "mklink \"$(cygpath -w ~/.config/opencode/plugins/superpowers.js)\" \"$(cygpath -w ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js)\""

# 第 5 步：创建技能目录连接（无需特殊权限）
cmd //c "mklink /J \"$(cygpath -w ~/.config/opencode/skills/superpowers)\" \"$(cygpath -w ~/.config/opencode/superpowers/skills)\""

# 第 6 步：重启 OpenCode
```

:::

### 验证 Windows 安装

**PowerShell 验证**：

```powershell
# 查看符号链接
Get-ChildItem "$env:USERPROFILE\.config\opencode\plugins" | Where-Object { $_.LinkType }
Get-ChildItem "$env:USERPROFILE\.config\opencode\skills" | Where-Object { $_.LinkType }
```

**Command Prompt 验证**：

```cmd
dir /AL "%USERPROFILE%\.config\opencode\plugins"
dir /AL "%USERPROFILE%\.config\opencode\skills"
```

**你应该看到**：输出中包含 `<SYMLINK>` 或 `<JUNCTION>` 标记。

## 检查点 ✅

| 检查项 | 预期结果 | 命令 |
| --- | --- | --- |
| 插件链接存在 | 符号链接指向 superpowers.js | `ls -l ~/.config/opencode/plugins/` |
| 技能链接存在 | 符号链接指向 skills/ | `ls -l ~/.config/opencode/skills/` |
| 技能可发现 | 能列出 superpowers 技能 | OpenCode skill tool |
| 系统提示注入 | 新会话看到技能上下文 | 测试对话 |

## 踩坑提醒

### 常见错误 1：Windows 权限不足

**症状**：

```
You do not have sufficient privilege to perform this operation.
```

**原因**：创建符号链接需要开发者模式或管理员权限。

**解决**：

1. 启用开发者模式（设置 → 针对/为开发人员）
2. 或以管理员身份运行终端

### 常见错误 2：文件已存在

**症状**：

```
Cannot create a file when that file already exists.
```

**原因**：旧链接未清理。

**解决**：

先运行清理命令（第 3 步），然后重试创建。

### 常见错误 3：Git Bash 复制而非创建符号链接

**症状**：

```bash
ls -l ~/.config/opencode/plugins/
# 显示普通文件，不是符号链接
```

**原因**：Git Bash 的 `ln` 命令在 Windows 上默认复制文件。

**解决**：

使用 `cmd //c mklink` 替代 `ln`（见 Git Bash 安装步骤）。

### 常见错误 4：技能未被发现

**症状**：OpenCode 无法列出 Superpowers 技能。

**原因**：技能符号链接不正确或目录结构有问题。

**解决**：

```bash
# 检查符号链接
ls -l ~/.config/opencode/skills/superpowers

# 应该指向：
# ~/.config/opencode/superpowers/skills

# 检查技能文件是否存在
ls ~/.config/opencode/superpowers/skills/brainstorming/SKILL.md
```

## 深入了解：技能发现与优先级

### 技能发现机制

OpenCode 的**原生 skill tool** 从三个位置自动发现技能：

```
.opencode/skills/           ← 项目技能（最高优先级）
   ↓
~/.config/opencode/skills/  ← 个人技能（中等优先级）
   ↓
~/.config/opencode/skills/superpowers/  ← Superpowers 技能（基础优先级）
```

**符号链接的作用**：

```bash
# Superpowers 技能目录
~/.config/opencode/superpowers/skills/
   ↓ 通过符号链接
~/.config/opencode/skills/superpowers/
   ↓ OpenCode 原生 skill tool 发现
```

### 技能优先级实战

**场景 1：覆盖 TDD 流程**

如果你想在特定项目中修改 TDD 流程，创建项目技能：

```bash
mkdir -p .opencode/skills/my-tdd
```

创建 `.opencode/skills/my-tdd/SKILL.md`：

```markdown
---
name: my-tdd
description: Use when doing TDD in this project
---

# My Custom TDD Workflow

[你的自定义 TDD 流程...]
```

OpenCode 会优先使用你的 `my-tdd` 技能，而不是 Superpowers 的 `test-driven-development`。

**场景 2：添加项目特定技能**

```bash
mkdir -p .opencode/skills/project-debugging
```

创建 `.opencode/skills/project-debugging/SKILL.md`：

```markdown
---
name: project-debugging
description: Use when debugging issues in this specific project
---

# Project-Specific Debugging

[项目特定的调试步骤...]
```

### 使用 OpenCode 原生 skill tool

**列出所有技能**：

```
use skill tool to list all skills
```

**加载特定技能**：

```
use skill tool to load superpowers/brainstorming
```

**AI 应该看到**：

```
✓ Loaded skill: superpowers/brainstorming
```

## 深入了解：系统提示转换

### Transform Hook 工作原理

Superpowers 插件使用 `experimental.chat.system.transform` 钩子：

**插件文件位置**：

```bash
~/.config/opencode/superpowers/.opencode/plugins/superpowers.js
```

**Hook 触发时机**：

每次用户发送消息时，钩子会：
1. 读取 `using-superpowers` 技能内容
2. 生成 bootstrap 消息
3. 注入到 system prompt

**Bootstrap 内容结构**：

```
<EXTREMELY_IMPORTANT>
You have superpowers.

**IMPORTANT: The using-superpowers skill content is included below. It is ALREADY LOADED - you are currently following it. Do NOT use skill tool to load "using-superpowers" again - that would be redundant.**

[using-superpowers 技能内容]

**Tool Mapping for OpenCode:**
When skills reference tools you don't have, substitute OpenCode equivalents:
- `TodoWrite` → `update_plan`
- `Task` tool with subagents → Use OpenCode's subagent system (@mention)
- `Skill` tool → OpenCode's native `skill` tool
- `Read`, `Write`, `Edit`, `Bash` → Your native tools

**Skills location:**
Superpowers skills are in `~/.config/opencode/skills/superpowers/`
Use OpenCode's native `skill` tool to list and load skills.
</EXTREMELY_IMPORTANT>
```

### 工具映射规则

Superpowers 技能最初为 Claude Code 编写，需要适配 OpenCode：

| Claude Code 工具 | OpenCode 等效 | 说明 |
| --- | --- | --- |
| `TodoWrite` | `update_plan` | 更新计划任务 |
| `Task`（子代理） | `@mention` | OpenCode 的子代理系统 |
| `Skill` | 原生 `skill` | OpenCode 原生技能工具 |
| `Read`/`Write`/`Edit`/`Bash` | 原生工具 | OpenCode 原生文件/终端工具 |

**为什么重要**：

技能文件中可能引用这些工具，插件会自动提供映射指令，确保 AI 知道如何使用 OpenCode 的等效工具。

## 深入了解：插件架构

### 插件文件结构

```
~/.config/opencode/superpowers/
├── .opencode/
│   └── plugins/
│       └── superpowers.js    ← 插件主文件
└── skills/                  ← 技能目录
    ├── using-superpowers/
    ├── brainstorming/
    ├── writing-plans/
    └── ...
```

### 插件核心功能

**superpowers.js 插件提供**：

1. **Frontmatter 解析**：提取技能文件的 YAML 元数据
2. **Bootstrap 生成**：读取 `using-superpowers` 技能并生成上下文
3. **Transform Hook**：将 bootstrap 注入到 system prompt
4. **工具映射指令**：适配 Claude Code 技能到 OpenCode

**关键代码片段**（简化版）：

```javascript
export const SuperpowersPlugin = async ({ client, directory }) => {
  // 读取 using-superpowers 技能
  const skillPath = path.join(superpowersSkillsDir, 'using-superpowers', 'SKILL.md');
  const content = fs.readFileSync(skillPath, 'utf8');

  // 生成 bootstrap 内容
  const bootstrap = `
    <EXTREMELY_IMPORTANT>
    You have superpowers.
    ${content}
    ${toolMapping}
    </EXTREMELY_IMPORTANT>
  `;

  // 注册 transform hook
  return {
    'experimental.chat.system.transform': async (_input, output) => {
      (output.system ||= []).push(bootstrap);
    }
  };
};
```

## 深入了解：个人技能与项目技能

### 创建个人技能

**位置**：`~/.config/opencode/skills/`

**用途**：适用于所有项目的个人技能。

**示例**：

```bash
mkdir -p ~/.config/opencode/skills/my-skills
```

创建 `~/.config/opencode/skills/my-skills/SKILL.md`：

```markdown
---
name: my-skills
description: Use when [条件] - [功能描述]
---

# My Personal Skill

[技能内容...]
```

### 创建项目技能

**位置**：`.opencode/skills/`

**用途**：仅适用于当前项目的技能。

**示例**：

```bash
# 在你的 OpenCode 项目中
mkdir -p .opencode/skills/project-specific
```

创建 `.opencode/skills/project-specific/SKILL.md`：

```markdown
---
name: project-specific
description: Use when working on [项目名称]
---

# Project-Specific Workflow

[项目特定工作流...]
```

### 优先级实战测试

**测试方法**：

1. 创建同名项目技能
2. 使用 OpenCode 的 skill tool 列出技能
3. 观察哪个技能被加载

**预期结果**：

OpenCode 应该加载项目技能（更高优先级），而不是 Superpowers 技能。

## 更新 Superpowers

**为什么更新**：Superpowers 持续更新，修复 bug、添加新技能。

**操作**：

```bash
cd ~/.config/opencode/superpowers
git pull
```

**重启 OpenCode**：让更新生效。

**验证更新**：

```bash
# 查看最新版本
cd ~/.config/opencode/superpowers
git log -1
```

## 本课小结

OpenCode 平台通过插件机制提供了 Superpowers 的完整集成：

- **安装方式多样**：AI 辅助安装、手动安装（支持多平台）
- **技能优先级清晰**：项目 > 个人 > Superpowers
- **系统提示自动注入**：transform hook 确保每次对话都有技能上下文
- **工具映射智能**：自动适配 Claude Code 技能到 OpenCode
- **可扩展性强**：支持创建个人技能和项目技能

安装完成后，OpenCode 会自动在每次对话中注入 Superpowers 的知识，确保 AI 始终遵循最佳实践。

## 下一课预告

> 下一课我们学习 **[Codex 平台集成](../codex/)**。
>
> 你会学到：
> - Codex CLI 工具的使用方法
> - 技能管理和 bootstrap 命令
> - Node.js 脚本集成方式

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-01

| 功能 | 文件路径 | 行号 |
| --- | --- | --- |
| 插件主文件 | [`.opencode/plugins/superpowers.js`](https://github.com/obra/superpowers/blob/main/.opencode/plugins/superpowers.js) | 全文 |
| 安装文档 | [`docs/README.opencode.md`](https://github.com/obra/superpowers/blob/main/docs/README.opencode.md) | 1-331 |
| 入口技能 | [`skills/using-superpowers/SKILL.md`](https://github.com/obra/superpowers/blob/main/skills/using-superpowers/SKILL.md) | 1-88 |

**关键配置**：

- **Hook 类型**：`experimental.chat.system.transform`
- **技能目录**：`~/.config/opencode/skills/superpowers/`
- **插件目录**：`~/.config/opencode/plugins/`
- **Bootstrap 技能**：`using-superpowers`

**关键安装路径**：

| 操作系统 | 插件路径 | 技能路径 |
| --- | --- | --- |
| macOS/Linux | `~/.config/opencode/plugins/superpowers.js` | `~/.config/opencode/skills/superpowers` |
| Windows | `%USERPROFILE%\.config\opencode\plugins\superpowers.js` | `%USERPROFILE%\.config\opencode\skills\superpowers` |

**关键命令**：

```bash
# 快速安装（AI 辅助）
Clone https://github.com/obra/superpowers to ~/.config/opencode/superpowers...

# 手动安装（macOS/Linux）
git clone https://github.com/obra/superpowers.git ~/.config/opencode/superpowers
ln -s ~/.config/opencode/superpowers/.opencode/plugins/superpowers.js \
   ~/.config/opencode/plugins/superpowers.js
ln -s ~/.config/opencode/superpowers/skills \
   ~/.config/opencode/skills/superpowers

# 更新
cd ~/.config/opencode/superpowers && git pull

# 验证
ls -l ~/.config/opencode/plugins/superpowers.js
ls -l ~/.config/opencode/skills/superpowers
```

**技能优先级**：

1. 项目技能：`.opencode/skills/`（最高）
2. 个人技能：`~/.config/opencode/skills/`（中等）
3. Superpowers 技能：`~/.config/opencode/skills/superpowers/`（基础）

**工具映射**：

- `TodoWrite` → `update_plan`
- `Task`（子代理）→ `@mention`
- `Skill` → 原生 `skill` tool
- 文件/终端工具 → 原生工具

</details>
