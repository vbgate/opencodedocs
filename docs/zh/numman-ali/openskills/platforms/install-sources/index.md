---
title: "安装来源: 多种方式安装技能 | openskills"
sidebarTitle: "三种来源任你选"
subtitle: "安装来源详解"
description: "学习 OpenSkills 技能的三种安装方式。掌握从 GitHub 仓库、本地路径、私有 Git 仓库安装技能的方法，包括 SSH/HTTPS 认证和子路径配置。"
tags:
  - "平台集成"
  - "技能管理"
  - "安装配置"
prerequisite:
  - "start-first-skill"
order: 2
---

# 安装来源详解

## 学完你能做什么

- 使用三种方式安装技能：GitHub 仓库、本地路径、私有 Git 仓库
- 根据场景选择最合适的安装来源
- 理解不同来源的优缺点和注意事项
- 掌握 GitHub shorthand、相对路径、私有仓库 URL 等写法

::: info 前置知识

本教程假设你已经完成了 [安装第一个技能](../../start/first-skill/)，了解基本的安装流程。

:::

---

## 你现在的困境

你可能已经学会了从官方仓库安装技能，但是：

- **只有 GitHub 能用吗？**：想用公司内部的 GitLab 仓库，不知道怎么配置
- **本地开发的技能怎么装？**：正在开发自己的技能，想先在本机测试
- **想直接指定某个技能**：仓库里有很多技能，不想每次都通过交互界面选择
- **私有仓库怎么访问？**：公司技能仓库是私有的，不知道怎么认证

其实 OpenSkills 支持多种安装来源，让我们一个个来看。

---

## 什么时候用这一招

**不同安装来源的适用场景**：

| 安装来源 | 适用场景 | 示例 |
| -------- | -------- | ---- |
| **GitHub 仓库** | 使用开源社区的技能 | `openskills install anthropics/skills` |
| **本地路径** | 开发和测试自己的技能 | `openskills install ./my-skill` |
| **私有 Git 仓库** | 使用公司内部的技能 | `openskills install git@github.com:my-org/private-skills.git` |

::: tip 推荐做法

- **开源技能**：优先从 GitHub 仓库安装，方便更新
- **开发阶段**：从本地路径安装，实时测试修改
- **团队协作**：使用私有 Git 仓库，统一管理内部技能

:::

---

## 核心思路：三种来源，同一机制

虽然安装来源不同，但 OpenSkills 的底层机制是一样的：

```
[识别来源类型] → [获取技能文件] → [复制到 .claude/skills/]
```

**来源识别逻辑**（源码 `install.ts:25-45`）：

```typescript
function isLocalPath(source: string): boolean {
  return (
    source.startsWith('/') ||
    source.startsWith('./') ||
    source.startsWith('../') ||
    source.startsWith('~/')
  );
}

function isGitUrl(source: string): boolean {
  return (
    source.startsWith('git@') ||
    source.startsWith('git://') ||
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.endsWith('.git')
  );
}
```

**判断优先级**：
1. 先检查是否为本地路径（`isLocalPath`）
2. 再检查是否为 Git URL（`isGitUrl`）
3. 最后作为 GitHub shorthand 处理（`owner/repo`）

---

## 跟我做

### 方式一：从 GitHub 仓库安装

**适用场景**：安装开源社区的技能，如 Anthropic 官方仓库、第三方的技能包。

#### 基本用法：安装整个仓库

```bash
npx openskills install owner/repo
```

**示例**：从 Anthropic 官方仓库安装技能

```bash
npx openskills install anthropics/skills
```

**你应该看到**：

```
Installing from: anthropics/skills
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 4 skill(s)

? Select skills to install:
❯ ◉ pdf (24 KB)
  ◯ git-workflow (12 KB)
  ◯ check-branch-first (8 KB)
  ◯ skill-creator (16 KB)
```

#### 进阶用法：指定子路径（直接安装某个技能）

如果仓库中有很多技能，你可以直接指定要安装的技能子路径，跳过交互式选择：

```bash
npx openskills install owner/repo/skill-name
```

**示例**：直接安装 PDF 处理技能

```bash
npx openskills install anthropics/skills/pdf
```

**你应该看到**：

```
Installing from: anthropics/skills/pdf
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned
✅ Installed: pdf
   Location: /path/to/project/.claude/skills/pdf
```

::: tip 推荐做法

当你只需要仓库中的一个技能时，使用子路径格式可以跳过交互式选择，更快捷。

:::

#### GitHub shorthand 规则（源码 `install.ts:131-143`）

| 格式 | 示例 | 转换结果 |
| ---- | ---- | -------- |
| `owner/repo` | `anthropics/skills` | `https://github.com/anthropics/skills` |
| `owner/repo/skill-name` | `my-org/skills/web-scraper` | URL: `https://github.com/my-org/skills` + subpath: `web-scraper` |

---

### 方式二：从本地路径安装

**适用场景**：正在开发自己的技能，想在本机测试后再发布到 GitHub。

#### 使用绝对路径

```bash
npx openskills install /absolute/path/to/skill
```

**示例**：从主目录的技能目录安装

```bash
npx openskills install ~/dev/my-skills/pdf-processor
```

#### 使用相对路径

```bash
npx openskills install ./local-skills/my-skill
```

**示例**：从项目目录下的 `local-skills/` 子目录安装

```bash
npx openskills install ./local-skills/web-scraper
```

**你应该看到**：

```
Installing from: ./local-skills/web-scraper
Location: project (.claude/skills)
✅ Installed: web-scraper
   Location: /path/to/project/.claude/skills/web-scraper
```

::: warning 注意事项

本地路径安装会复制技能文件到 `.claude/skills/`，后续对源文件的修改不会自动同步。如需更新，需重新安装。

:::

#### 安装包含多个技能的本地目录

如果你的本地目录结构是这样的：

```
local-skills/
├── pdf-processor/SKILL.md
├── web-scraper/SKILL.md
└── git-helper/SKILL.md
```

你可以直接安装整个目录：

```bash
npx openskills install ./local-skills
```

这会启动交互式选择界面，让你选择要安装的技能。

#### 本地路径支持的格式（源码 `install.ts:25-32`）

| 格式 | 说明 | 示例 |
| ---- | ---- | ---- |
| `/absolute/path` | 绝对路径 | `/home/user/skills/my-skill` |
| `./relative/path` | 当前目录的相对路径 | `./local-skills/my-skill` |
| `../relative/path` | 父目录的相对路径 | `../shared-skills/common` |
| `~/path` | 主目录的相对路径 | `~/dev/my-skills` |

::: tip 开发技巧

使用 `~` 简写可以快速引用主目录下的技能，适合个人开发环境。

:::

---

### 方式三：从私有 Git 仓库安装

**适用场景**：使用公司内部的 GitLab/Bitbucket 仓库，或私有 GitHub 仓库。

#### SSH 方式（推荐）

```bash
npx openskills install git@github.com:owner/private-skills.git
```

**示例**：从 GitHub 私有仓库安装

```bash
npx openskills install git@github.com:my-org/internal-skills.git
```

**你应该看到**：

```
Installing from: git@github.com:my-org/internal-skills.git
Location: project (.claude/skills)

Cloning repository...
✓ Repository cloned

Found 3 skill(s)
? Select skills to install:
```

::: tip 认证配置

SSH 方式要求你已经配置了 SSH 密钥。如果克隆失败，请检查：

```bash
# 测试 SSH 连接
ssh -T git@github.com

# 如果提示 "Hi username! You've successfully authenticated..."，说明配置正确
```

:::

#### HTTPS 方式（需要凭证）

```bash
npx openskills install https://github.com/owner/private-skills.git
```

::: warning HTTPS 认证

HTTPS 方式克隆私有仓库时，Git 会提示输入用户名和密码（或 Personal Access Token）。如果你使用的是双因素认证，需要使用 Personal Access Token 而非账户密码。

:::

#### 其他 Git 托管平台

**GitLab（SSH）**：

```bash
npx openskills install git@gitlab.com:owner/skills.git
```

**GitLab（HTTPS）**：

```bash
npx openskills install https://gitlab.com/owner/skills.git
```

**Bitbucket（SSH）**：

```bash
npx openskills install git@bitbucket.org:owner/skills.git
```

**Bitbucket（HTTPS）**：

```bash
npx openskills install https://bitbucket.org/owner/skills.git
```

::: tip 推荐做法

团队内部技能建议使用私有 Git 仓库，这样：
- 所有成员可以从同一个源安装
- 更新技能时只需 `openskills update`
- 便于版本管理和权限控制

:::

#### Git URL 识别规则（源码 `install.ts:37-45`）

| 前缀/后缀 | 说明 | 示例 |
| --------- | ---- | ---- |
| `git@` | SSH 协议 | `git@github.com:owner/repo.git` |
| `git://` | Git 协议 | `git://github.com/owner/repo.git` |
| `http://` | HTTP 协议 | `http://github.com/owner/repo.git` |
| `https://` | HTTPS 协议 | `https://github.com/owner/repo.git` |
| `.git` 后缀 | Git 仓库（任何协议） | `owner/repo.git` |

---

## 检查点 ✅

完成本课后，请确认：

- [ ] 知道如何从 GitHub 仓库安装技能（`owner/repo` 格式）
- [ ] 知道如何直接安装仓库中的某个技能（`owner/repo/skill-name`）
- [ ] 知道如何使用本地路径安装技能（`./`、`~/` 等）
- [ ] 知道如何从私有 Git 仓库安装技能（SSH/HTTPS）
- [ ] 理解不同安装来源的适用场景

---

## 踩坑提醒

### 问题 1：本地路径不存在

**现象**：

```
Error: Path does not exist: ./local-skills/my-skill
```

**原因**：
- 路径拼写错误
- 相对路径计算错误

**解决方法**：
1. 检查路径是否存在：`ls ./local-skills/my-skill`
2. 使用绝对路径避免相对路径混淆

---

### 问题 2：私有仓库克隆失败

**现象**：

```
✗ Failed to clone repository
fatal: repository 'git@github.com:owner/private-skills.git' does not appear to be a git repository
```

**原因**：
- SSH 密钥未配置
- 没有仓库访问权限
- 仓库地址错误

**解决方法**：
1. 测试 SSH 连接：`ssh -T git@github.com`
2. 确认你有仓库的访问权限
3. 检查仓库地址是否正确

::: tip 提示

对于私有仓库，工具会显示以下提示（源码 `install.ts:167`）：

```
Tip: For private repos, ensure git SSH keys or credentials are configured
```

:::

---

### 问题 3：子路径中找不到 SKILL.md

**现象**：

```
Error: SKILL.md not found at skills/my-skill
```

**原因**：
- 子路径错误
- 仓库中的目录结构与你预期不同

**解决方法**：
1. 先不带子路径安装整个仓库：`npx openskills install owner/repo`
2. 通过交互式界面查看可用的技能
3. 使用正确的子路径重新安装

---

### 问题 4：GitHub shorthand 识别错误

**现象**：

```
Error: Invalid source format
Expected: owner/repo, owner/repo/skill-name, git URL, or local path
```

**原因**：
- 格式不符合任何一种规则
- 拼写错误（如 `owner / repo` 中间有空格）

**解决方法**：
- 检查格式是否正确（无空格、斜杠数量正确）
- 使用完整的 Git URL 而非 shorthand

---

## 本课小结

通过本课，你学会了：

- **三种安装来源**：GitHub 仓库、本地路径、私有 Git 仓库
- **GitHub shorthand**：`owner/repo` 和 `owner/repo/skill-name` 两种格式
- **本地路径格式**：绝对路径、相对路径、主目录简写
- **私有仓库安装**：SSH 和 HTTPS 两种方式，不同平台的写法
- **来源识别逻辑**：工具如何判断你提供的安装来源类型

**核心命令速查**：

| 命令 | 作用 |
| ---- | ---- |
| `npx openskills install owner/repo` | 从 GitHub 仓库安装（交互式选择） |
| `npx openskills install owner/repo/skill-name` | 直接安装仓库中的某个技能 |
| `npx openskills install ./local-skills/skill` | 从本地路径安装 |
| `npx openskills install ~/dev/my-skills` | 从主目录安装 |
| `npx openskills install git@github.com:owner/private-skills.git` | 从私有 Git 仓库安装 |

---

## 下一课预告

> 下一课我们学习 **[全局安装 vs 项目本地安装](../global-vs-project/)**。
>
> 你会学到：
> - `--global` 标志的作用和安装位置
> - 全局安装和项目本地安装的区别
> - 根据场景选择合适的安装位置
> - 多项目共享技能的最佳实践

安装来源只是技能管理的一部分，接下来需要理解技能的安装位置对项目的影响。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能 | 文件路径 | 行号 |
| ---- | --------- | ---- |
| 安装命令入口 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L83-L184) | 83-184 |
| 本地路径判断 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L25-L32) | 25-32 |
| Git URL 判断 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L37-L45) | 37-45 |
| GitHub shorthand 解析 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L131-L143) | 131-143 |
| 本地路径安装 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L199-L226) | 199-226 |
| Git 仓库克隆 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L155-L169) | 155-169 |
| 私有仓库错误提示 | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L167) | 167 |

**关键函数**：
- `isLocalPath(source)` - 判断是否为本地路径（第 25-32 行）
- `isGitUrl(source)` - 判断是否为 Git URL（第 37-45 行）
- `installFromLocal()` - 从本地路径安装技能（第 199-226 行）
- `installSpecificSkill()` - 安装指定子路径的技能（第 272-316 行）
- `getRepoName()` - 从 Git URL 提取仓库名（第 50-56 行）

**关键逻辑**：
1. 来源类型判断优先级：本地路径 → Git URL → GitHub shorthand（第 111-143 行）
2. GitHub shorthand 支持两种格式：`owner/repo` 和 `owner/repo/skill-name`（第 132-142 行）
3. 私有仓库克隆失败时提示配置 SSH 密钥或凭证（第 167 行）

</details>
