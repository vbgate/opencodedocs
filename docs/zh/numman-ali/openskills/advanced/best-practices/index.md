---
title: "最佳实践: 项目配置与团队协作 | OpenSkills"
sidebarTitle: "5 分钟配置团队技能"
subtitle: "最佳实践: 项目配置与团队协作"
description: "学习 OpenSkills 的最佳实践。掌握项目本地 vs 全局安装、Universal 模式配置、SKILL.md 写作规范和 CI/CD 集成，提升团队协作效率。"
tags:
  - "advanced"
  - "best-practices"
  - "skills"
  - "team"
prerequisite:
  - "start-quick-start"
  - "start-installation"
  - "start-first-skill"
order: 8
---

# 最佳实践

## 学完你能做什么

- 根据项目需求选择合适的技能安装方式（项目本地 vs 全局 vs Universal）
- 编写符合规范的 SKILL.md 文件（命名、描述、指令）
- 使用符号链接进行高效的本地开发
- 管理技能的版本和更新
- 在团队环境中协作使用技能
- 将 OpenSkills 集成到 CI/CD 流程

## 你现在的困境

你已经学会安装和使用技能，但在实际项目中遇到这些问题：

- 技能应该安装在项目目录还是全局？
- 多个 AI 代理之间如何共享技能？
- 技能写了很多遍，但 AI 还是记不住
- 团队成员各自安装技能，版本不一致
- 本地修改技能后，每次重新安装太麻烦

这节课我们汇总 OpenSkills 的最佳实践，帮你解决这些问题。

## 什么时候用这一招

- **项目配置优化**：根据项目类型选择合适的技能安装位置
- **多代理环境**：同时使用 Claude Code、Cursor、Windsurf 等工具
- **技能标准化**：团队统一技能格式和写作规范
- **本地开发**：快速迭代和测试技能
- **团队协作**：共享技能、版本控制、CI/CD 集成

## 🎒 开始前的准备

::: warning 前置检查

在开始前，请确保：

- ✅ 已完成 [快速开始](../../start/quick-start/)
- ✅ 已安装至少一个技能并同步到 AGENTS.md
- ✅ 了解 [SKILL.md 基本格式](../../start/what-is-openskills/)

:::

## 项目配置最佳实践

### 1. 项目本地 vs 全局 vs Universal 安装

选择合适的安装位置是项目配置的第一步。

#### 项目本地安装（默认）

**适用场景**：特定项目的专属技能

```bash
# 安装到 .claude/skills/
npx openskills install anthropics/skills
```

**优势**：

- ✅ 技能随项目版本控制
- ✅ 不同项目使用不同技能版本
- ✅ 无需全局安装，减少依赖

**推荐做法**：

- 项目的专用技能（如特定框架的构建流程）
- 团队内部开发的业务技能
- 依赖项目配置的技能

#### 全局安装

**适用场景**：所有项目通用的技能

```bash
# 安装到 ~/.claude/skills/
npx openskills install anthropics/skills --global
```

**优势**：

- ✅ 所有项目共享同一套技能
- ✅ 无需每个项目重复安装
- ✅ 集中管理更新

**推荐做法**：

- Anthropic 官方技能库（anthropics/skills）
- 通用工具技能（如 PDF 处理、Git 操作）
- 个人常用的技能

#### Universal 模式（多代理环境）

**适用场景**：同时使用多个 AI 代理

```bash
# 安装到 .agent/skills/
npx openskills install anthropics/skills --universal
```

**优先级顺序**（从高到低）：

1. `./.agent/skills/`（项目本地 Universal）
2. `~/.agent/skills/`（全局 Universal）
3. `./.claude/skills/`（项目本地 Claude Code）
4. `~/.claude/skills/`（全局 Claude Code）

**推荐做法**：

- ✅ 使用多个代理（Claude Code + Cursor + Windsurf）时使用
- ✅ 避免与 Claude Code Marketplace 冲突
- ✅ 统一管理所有代理的技能

::: tip 什么时候用 Universal 模式？

如果你的 `AGENTS.md` 被 Claude Code 和其他代理共享，使用 `--universal` 避免技能冲突。Universal 模式使用 `.agent/skills/` 目录，与 Claude Code 的 `.claude/skills/` 隔离。

:::

### 2. 优先使用 npx 而不是全局安装

OpenSkills 设计为即用即走，推荐始终使用 `npx`：

```bash
# ✅ 推荐：使用 npx
npx openskills install anthropics/skills
npx openskills sync
npx openskills list

# ❌ 避免：全局安装后直接调用
openskills install anthropics/skills
```

**优势**：

- ✅ 无需全局安装，避免版本冲突
- ✅ 始终使用最新版本（npx 会自动更新）
- ✅ 减少系统依赖

**何时需要全局安装**：

- 在 CI/CD 环境中（为了性能）
- 脚本中频繁调用（减少 npx 启动时间）

```bash
# CI/CD 或脚本中全局安装
npm install -g openskills
openskills install anthropics/skills -y
openskills sync -y
```

## 技能管理最佳实践

### 1. SKILL.md 写作规范

#### 命名规范：使用连字符格式

**规则**：

- ✅ 正确：`pdf-editor`、`api-client`、`git-workflow`
- ❌ 错误：`PDF Editor`（空格）、`pdf_editor`（下划线）、`PdfEditor`（驼峰）

**原因**：连字符格式是 URL 友好的标识符，符合 GitHub 仓库和文件系统命名规范。

#### 描述写作：第三人称，1-2 句话

**规则**：

- ✅ 正确：`Use this skill for comprehensive PDF manipulation.`
- ❌ 错误：`You should use this skill to manipulate PDFs.`（第二人称）

**示例对比**：

| 场景 | ❌ 错误（第二人称） | ✅ 正确（第三人称） |
|--- | --- | ---|
| PDF 技能 | You can use this to extract text from PDFs. | Extract text from PDFs with this skill. |
| Git 技能 | When you need to manage branches, use this. | Manage Git branches with this skill. |
| API 技能 | If you want to call the API, load this skill. | Call external APIs with this skill. |

#### 指令写作：Imperative/Infinitive 形式

**规则**：

- ✅ 正确：`"To accomplish X, execute Y"`
- ✅ 正确：`"Load this skill when Z"`
- ❌ 错误：`"You should do X"`
- ❌ 错误：`"If you need Y"`

**写作口诀**：

1. **动词开头**："Create" → "Use" → "Return"
2. **省略 "You"**：不说 "You should"
3. **明确路径**：引用资源用 `references/` 开头

**示例对比**：

| ❌ 错误写法 | ✅ 正确写法 |
|--- | ---|
| "You should create a file" | "Create a file" |
| "When you want to load this skill" | "Load this skill when" |
| "If you need to see the docs" | "See references/guide.md" |

::: tip 为什么用 Imperative/Infinitive？

这种写作风格让 AI 代理更容易解析和执行指令。Imperative（命令式）和 Infinitive（不定式）形式消除了"你"这个主体，让指令更直接、更明确。

:::

### 2. 文件大小控制

**SKILL.md 文件大小**：

- ✅ **推荐**：5000 词以内
- ⚠️ **警告**：超过 8000 词可能导致上下文超限
- ❌ **禁止**：超过 10000 词

**控制方法**：

将详细文档移到 `references/` 目录：

```markdown
# SKILL.md（核心指令）

## Instructions

To process data:

1. Call the API endpoint
2. See `references/api-docs.md` for detailed response format  # 详细文档
3. Process the result

## Bundled Resources

For detailed API documentation, see:
- `references/api-docs.md`  # 不会加载到上下文，节省 token
- `references/examples.md`
```

**文件大小对比**：

| 文件 | 大小限制 | 是否加载到上下文 |
|--- | --- | ---|
| `SKILL.md` | < 5000 词 | ✅ 是 |
| `references/` | 无限制 | ❌ 否（按需加载） |
| `scripts/` | 无限制 | ❌ 否（可执行） |
| `assets/` | 无限制 | ❌ 否（模板文件） |

### 3. 技能查找优先级

OpenSkills 按以下优先级查找技能（从高到低）：

```
1. ./.agent/skills/        # Universal 项目本地
2. ~/.agent/skills/        # Universal 全局
3. ./.claude/skills/      # Claude Code 项目本地
4. ~/.claude/skills/      # Claude Code 全局
```

**去重机制**：

- 同名技能只返回第一个找到的
- 项目本地技能优先于全局技能

**示例场景**：

```
项目 A：
- .claude/skills/pdf        # 项目本地版本 v1.0
- ~/.claude/skills/pdf     # 全局版本 v2.0

# openskills read pdf 会加载 .claude/skills/pdf（v1.0）
```

**建议**：

- 项目的特殊需求技能放在项目本地
- 通用技能放在全局
- 多代理环境使用 Universal 模式

## 本地开发最佳实践

### 1. 使用符号链接进行迭代开发

**问题**：每次修改技能后需要重新安装，开发效率低。

**解决方案**：使用符号链接（symlink）

```bash
# 1. 克隆技能仓库到开发目录
git clone git@github.com:your-org/my-skills.git ~/dev/my-skills

# 2. 创建技能目录
mkdir -p .claude/skills

# 3. 创建符号链接
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill

# 4. 同步到 AGENTS.md
npx openskills sync
```

**优势**：

- ✅ 修改源文件立即生效（无需重新安装）
- ✅ 支持基于 Git 的更新（pull 即可）
- ✅ 多个项目共享同一技能开发版本

**验证符号链接**：

```bash
# 查看符号链接
ls -la .claude/skills/

# 输出示例：
# my-skill -> /Users/yourname/dev/my-skills/my-skill
```

**注意事项**：

- ✅ 符号链接会被 `openskills list` 识别
- ✅ Broken symlinks 会被自动跳过（不崩溃）
- ⚠️ Windows 用户需使用 Git Bash 或 WSL（Windows 原生不支持符号链接）

### 2. 多项目共享技能

**场景**：多个项目需要使用同一套团队技能。

**方法 1：全局安装**

```bash
# 全局安装团队技能仓库
npx openskills install your-org/team-skills --global
```

**方法 2：符号链接到开发目录**

```bash
# 在每个项目中创建符号链接
ln -s ~/dev/team-skills/my-skill .claude/skills/my-skill
```

**方法 3：Git Submodule**

```bash
# 将技能仓库作为子模块
git submodule add git@github.com:your-org/team-skills.git .claude/skills

# 更新子模块
git submodule update --init --recursive
```

**推荐选择**：

| 方法 | 适用场景 | 优势 | 劣势 |
|--- | --- | --- | ---|
| 全局安装 | 所有项目共享统一技能 | 集中管理，更新方便 | 无法按项目定制 |
| 符号链接 | 本地开发和测试 | 修改立即生效 | 需要手动创建链接 |
| Git Submodule | 团队协作，版本控制 | 随项目版本控制 | 子模块管理复杂 |

## 团队协作最佳实践

### 1. 技能版本控制

**最佳实践**：将技能仓库独立版本控制

```bash
# 团队技能仓库结构
team-skills/
├── .git/
├── pdf-editor/
│   └── SKILL.md
├── api-client/
│   └── SKILL.md
└── git-workflow/
    └── SKILL.md
```

**安装方式**：

```bash
# 从团队仓库安装技能
npx openskills install git@github.com:your-org/team-skills.git
```

**更新流程**：

```bash
# 更新所有技能
npx openskills update

# 更新特定技能
npx openskills update pdf-editor,api-client
```

**版本管理建议**：

- 使用 Git Tag 标记稳定版本：`v1.0.0`、`v1.1.0`
- 在 AGENTS.md 中记录技能版本：`<skill name="pdf-editor" version="1.0.0">`
- CI/CD 中固定使用稳定版本

### 2. 技能命名规范

**团队统一命名规范**：

| 技能类型 | 命名模式 | 示例 |
|--- | --- | ---|
| 通用工具 | `<tool-name>` | `pdf`、`git`、`docker` |
| 框架相关 | `<framework>-<purpose>` | `react-component`、`django-model` |
| 工作流程 | `<workflow>` | `ci-cd`、`code-review` |
| 团队专属 | `<team>-<purpose>` | `team-api`、`company-deploy` |

**示例**：

```bash
# ✅ 统一命名
team-skills/
├── pdf/                     # PDF 处理
├── git-workflow/           # Git 工作流程
├── react-component/        # React 组件生成
└── team-api/             # 团队 API 客户端
```

### 3. 技能文档规范

**团队统一文档结构**：

```markdown
---
name: <skill-name>
description: <1-2 句话，第三人称>
author: <团队/作者>
version: <版本号>
---

# <技能标题>

## When to Use

Load this skill when:
- 场景 1
- 场景 2

## Instructions

To accomplish task:

1. 步骤 1
2. 步骤 2

## Bundled Resources

For detailed information:
- `references/api-docs.md`
- `scripts/helper.py`
```

**必检清单**：

- [ ] `name` 使用连字符格式
- [ ] `description` 是 1-2 句话，第三人称
- [ ] 指令使用 imperative/infinitive 形式
- [ ] 包含 `author` 和 `version` 字段（团队规范）
- [ ] 详细的 `When to Use` 说明

## CI/CD 集成最佳实践

### 1. 非交互式安装和同步

**场景**：在 CI/CD 环境中自动化技能管理

**使用 `-y` 标志跳过交互式提示**：

```bash
# CI/CD 脚本示例
#!/bin/bash

# 安装技能（非交互式）
npx openskills install anthropics/skills -y
npx openskills install git@github.com:your-org/team-skills.git -y

# 同步到 AGENTS.md（非交互式）
npx openskills sync -y
```

**GitHub Actions 示例**：

```yaml
name: Setup Skills

on: [push]

jobs:
  setup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install OpenSkills
        run: npx openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Verify Skills
        run: npx openskills list
```

### 2. 技能更新自动化

**定时更新技能**：

```yaml
# .github/workflows/update-skills.yml
name: Update Skills

on:
  schedule:
    - cron: '0 0 * * 0'  # 每周日更新
  workflow_dispatch:

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Update Skills
        run: npx openskills update -y

      - name: Sync to AGENTS.md
        run: npx openskills sync -y

      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add AGENTS.md
          git diff --staged --quiet || git commit -m "Update skills"
          git push
```

### 3. 自定义输出路径

**场景**：将技能同步到自定义文件（如 `.ruler/AGENTS.md`）

```bash
# 同步到自定义文件
npx openskills sync -o .ruler/AGENTS.md -y
```

**CI/CD 示例**：

```yaml
# 为不同 AI 代理生成不同的 AGENTS.md
- name: Sync for Claude Code
  run: npx openskills sync -o AGENTS.md -y

- name: Sync for Cursor
  run: npx openskills sync -o .cursor/AGENTS.md -y

- name: Sync for Windsurf
  run: npx openskills sync -o .windsurf/AGENTS.md -y
```

## 常见问题与解决方案

### 问题 1：技能找不到

**症状**：

```bash
npx openskills read my-skill
# Error: Skill not found: my-skill
```

**排查步骤**：

1. 检查技能是否已安装：
   ```bash
   npx openskills list
   ```

2. 检查技能名称是否正确（区分大小写）：
   ```bash
   # ❌ 错误
   npx openskills read My-Skill

   # ✅ 正确
   npx openskills read my-skill
   ```

3. 检查技能是否在优先级更高的目录中被覆盖：
   ```bash
   # 查看技能位置
   ls -la .claude/skills/my-skill
   ls -la ~/.claude/skills/my-skill
   ```

### 问题 2：符号链接无法访问

**症状**：

```bash
ln -s ~/dev/my-skills/my-skill .claude/skills/my-skill
# ln: failed to create symbolic link: Operation not permitted
```

**解决方案**：

- **macOS**：在系统偏好设置中允许符号链接
- **Windows**：使用 Git Bash 或 WSL（Windows 原生不支持符号链接）
- **Linux**：检查文件系统权限

### 问题 3：技能更新后未生效

**症状**：

```bash
npx openskills update
# ✅ Skills updated successfully

npx openskills read my-skill
# 内容仍然是旧版本
```

**原因**：AI 代理缓存了旧的技能内容。

**解决方案**：

1. 重新同步 AGENTS.md：
   ```bash
   npx openskills sync
   ```

2. 检查技能文件的时间戳：
   ```bash
   ls -la .claude/skills/my-skill/SKILL.md
   ```

3. 如果使用符号链接，重新加载技能：
   ```bash
   npx openskills read my-skill
   ```

## 本课小结

OpenSkills 最佳实践核心要点：

### 项目配置

- ✅ 项目本地安装：特定项目的专属技能
- ✅ 全局安装：所有项目通用的技能
- ✅ Universal 模式：多代理环境共享技能
- ✅ 优先使用 `npx` 而不是全局安装

### 技能管理

- ✅ SKILL.md 写作规范：连字符命名、第三人称描述、imperative 指令
- ✅ 文件大小控制：SKILL.md < 5000 词，详细文档放 `references/`
- ✅ 技能查找优先级：理解 4 个目录的优先级和去重机制

### 本地开发

- ✅ 使用符号链接进行迭代开发
- ✅ 多项目共享技能：全局安装、符号链接、Git Submodule

### 团队协作

- ✅ 技能版本控制：独立仓库、Git Tag
- ✅ 统一命名规范：工具、框架、工作流程
- ✅ 统一文档规范：author、version、When to Use

### CI/CD 集成

- ✅ 非交互式安装和同步：`-y` 标志
- ✅ 自动化更新：定时任务、workflow_dispatch
- ✅ 自定义输出路径：`-o` 标志

## 下一课预告

> 下一课我们学习 **[常见问题解答](../faq/faq/)**。
>
> 你会学到：
> - OpenSkills 常见问题的快速解答
> - 安装失败、技能未加载等问题的排查方法
> - 与 Claude Code 共存的配置技巧

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 技能查找优先级 | [`src/utils/dirs.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/dirs.ts) | 14-25 |
| 技能去重机制 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 42-43, 57 |
| 符号链接处理 | [`src/utils/skills.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/skills.ts) | 10-25 |
| YAML 字段提取 | [`src/utils/yaml.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/yaml.ts) | 4-7 |
| 路径遍历防护 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 71-78 |
| 非交互式安装 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts) | 424 |
| 自定义输出路径 | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts) | 19-36 |

**关键常量**：
- 4 个技能查找目录：`./.agent/skills/`、`~/.agent/skills/`、`./.claude/skills/`、`~/.claude/skills/`

**关键函数**：
- `getSearchDirs(): string[]` - 返回按优先级排序的技能查找目录
- `isDirectoryOrSymlinkToDirectory(entry: Dirent, parentDir: string): boolean` - 检查目录或符号链接指向目录
- `extractYamlField(content: string, field: string): string` - 提取 YAML 字段值（非贪婪匹配）
- `isPathInside(path: string, targetDir: string): boolean` - 验证路径是否在目标目录内（防止路径遍历）

**示例技能文件**：
- [`examples/my-first-skill/SKILL.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/SKILL.md) - 最小结构示例
- [`examples/my-first-skill/references/skill-format.md`](https://github.com/numman-ali/openskills/blob/main/examples/my-first-skill/references/skill-format.md) - 格式规范参考

</details>
