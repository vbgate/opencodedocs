---
title: "安装: 快速部署 | OpenSkills"
sidebarTitle: "5 分钟跑起来"
subtitle: "安装: 快速部署 | OpenSkills"
description: "学习 OpenSkills 的安装方法。在 5 分钟内完成环境配置，支持 npx 和全局安装两种方式，涵盖环境验证和问题排查。"
tags:
  - "安装"
  - "环境配置"
  - "Node.js"
  - "Git"
prerequisite:
  - "终端基础操作"
duration: 3
order: 3
---

# 安装OpenSkills工具

## 学完你能做什么

完成本课后，你将能够：

- 检查并配置 Node.js 和 Git 环境
- 使用 `npx` 或全局安装的方式使用 OpenSkills
- 验证 OpenSkills 是否正确安装并可用
- 解决常见的安装问题（版本不匹配、网络问题等）

## 你现在的困境

你可能遇到了这些问题：

- **不确定环境要求**：不知道需要什么版本的 Node.js 和 Git
- **不知道如何安装**：OpenSkills 是 npm 包，但不清楚是用 npx 还是全局安装
- **安装失败**：遇到版本不兼容或网络问题
- **权限问题**：在全局安装时遇到 EACCES 错误

本课帮你一步步解决这些问题。

## 什么时候用这一招

当你需要：

- 首次使用 OpenSkills
- 更新到新版本
- 在新机器上配置开发环境
- 排查安装相关问题

## 🎒 开始前的准备

::: tip 系统要求

OpenSkills 对系统有最低要求，不满足这些要求会导致安装失败或运行异常。

:::

::: warning 前置检查

在开始之前，请确认你已安装以下软件：

1. **Node.js 20.6 或更高版本**
2. **Git**（用于从仓库克隆技能）

:::

## 核心思路

OpenSkills 是一个 Node.js CLI 工具，有两种使用方式：

| 方式 | 命令 | 优点 | 缺点 | 适用场景 |
|--- | --- | --- | --- | ---|
| **npx** | `npx openskills` | 无需安装，自动使用最新版本 | 每次运行需要下载（有缓存） | 偶尔使用、测试新版本 |
| **全局安装** | `openskills` | 命令更短，响应更快 | 需要手动更新 | 频繁使用、固定版本 |

**推荐使用 npx**，除非你非常频繁地使用 OpenSkills。

---

## 跟我做

### 第 1 步：检查 Node.js 版本

首先，检查系统是否安装了 Node.js 以及版本是否满足要求：

```bash
node --version
```

**为什么**

OpenSkills 需要 Node.js 20.6 或更高版本，低于此版本会导致运行时错误。

**你应该看到**：

```bash
v20.6.0
```

或者更高版本（如 `v22.0.0`）。

::: danger 版本过低

如果看到 `v18.x.x` 或更低版本（如 `v16.x.x`），你需要升级 Node.js。

:::

**如果版本过低**：

推荐使用 [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) 安装和管理 Node.js：

::: code-group

```bash [macOS/Linux]
# 安装 nvm（如果未安装）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# 重新加载终端配置
source ~/.bashrc  # 或 source ~/.zshrc

# 安装 Node.js 20 LTS
nvm install 20
nvm use 20

# 验证版本
node --version
```

```powershell [Windows]
# 下载并安装 nvm-windows
# 访问：https://github.com/coreybutler/nvm-windows/releases

# 安装后，在 PowerShell 中运行：
nvm install 20
nvm use 20

# 验证版本
node --version
```

:::

**你应该看到**（升级后）：

```bash
v20.6.0
```

---

### 第 2 步：检查 Git 安装

OpenSkills 需要使用 Git 来克隆技能仓库：

```bash
git --version
```

**为什么**

从 GitHub 安装技能时，OpenSkills 会使用 `git clone` 命令下载仓库。

**你应该看到**：

```bash
git version 2.40.0
```

（版本号可能不同，只要有输出即可）

::: danger Git 未安装

如果看到 `command not found: git` 或类似错误，你需要安装 Git。

:::

**如果 Git 未安装**：

::: code-group

```bash [macOS]
# macOS 通常已预装 Git，如果没有，使用 Homebrew：
brew install git
```

```powershell [Windows]
# 下载并安装 Git for Windows
# 访问：https://git-scm.com/download/win
```

```bash [Linux (Ubuntu/Debian)]
sudo apt update
sudo apt install git
```

```bash [Linux (CentOS/RHEL)]
sudo yum install git
```

:::

安装完成后，重新运行 `git --version` 验证。

---

### 第 3 步：验证环境

现在验证 Node.js 和 Git 是否都可用：

```bash
node --version && git --version
```

**你应该看到**：

```bash
v20.6.0
git version 2.40.0
```

如果两个命令都成功输出，说明环境配置正确。

---

### 第 4 步：使用 npx 方式（推荐）

OpenSkills 推荐使用 `npx` 直接运行，无需额外安装：

```bash
npx openskills --version
```

**为什么**

`npx` 会自动下载并运行最新版本的 OpenSkills，无需手动安装或更新。第一次运行时会下载包到本地缓存，后续运行会使用缓存，速度很快。

**你应该看到**：

```bash
1.5.0
```

（版本号可能不同）

::: tip npx 的工作原理

`npx` (Node Package eXecute) 是 npm 5.2.0+ 自带的工具：
- 首次运行：从 npm 下载包到临时目录
- 后续运行：使用缓存（默认 24 小时过期）
- 更新：缓存过期后会自动下载最新版本

:::

**测试安装命令**：

```bash
npx openskills list
```

**你应该看到**：

```bash
Installed Skills:

No skills installed. Run: npx openskills install <source>
```

或者已安装技能的列表。

---

### 第 5 步：（可选）全局安装

如果你频繁使用 OpenSkills，可以选择全局安装：

```bash
npm install -g openskills
```

**为什么**

全局安装后，可以直接使用 `openskills` 命令，不需要每次都输入 `npx`，响应更快。

**你应该看到**：

```bash
added 4 packages in 3s
```

（输出可能不同）

::: warning 权限问题

如果在全局安装时遇到 `EACCES` 错误，说明没有权限写入全局目录。

**解决方法**：

```bash
# 方法 1：使用 sudo（macOS/Linux）
sudo npm install -g openskills

# 方法 2：修复 npm 权限（推荐）
# 查看全局安装目录
npm config get prefix

# 设置正确的权限（替换 /usr/local 为实际路径）
sudo chown -R $(whoami) /usr/local/lib/node_modules
sudo chown -R $(whoami) /usr/local/bin
```

:::

**验证全局安装**：

```bash
openskills --version
```

**你应该看到**：

```bash
1.5.0
```

::: tip 更新全局安装

如果要更新全局安装的 OpenSkills：

```bash
npm update -g openskills
```

:::

---

## 检查点 ✅

完成上述步骤后，你应该确认：

- [ ] Node.js 版本是 20.6 或更高（`node --version`）
- [ ] Git 已安装（`git --version`）
- [ ] `npx openskills --version` 或 `openskills --version` 能正确输出版本号
- [ ] `npx openskills list` 或 `openskills list` 能正常运行

如果所有检查都通过，恭喜你！OpenSkills 已成功安装。

---

## 踩坑提醒

### 问题 1：Node.js 版本过低

**错误信息**：

```bash
Error: The module was compiled against a different Node.js version
```

**原因**：Node.js 版本低于 20.6

**解决方法**：

使用 nvm 安装 Node.js 20 或更高版本：

```bash
nvm install 20
nvm use 20
```

---

### 问题 2：npx 命令找不到

**错误信息**：

```bash
command not found: npx
```

**原因**：npm 版本过低（npx 需要 npm 5.2.0+）

**解决方法**：

```bash
# 更新 npm
npm install -g npm@latest

# 验证版本
npx --version
```

---

### 问题 3：网络超时或下载失败

**错误信息**：

```bash
Error: network timeout
```

**原因**：npm 仓库访问受限

**解决方法**：

```bash
# 使用 npm 镜像源（如淘宝镜像）
npm config set registry https://registry.npmmirror.com

# 重新尝试
npx openskills --version
```

恢复默认源：

```bash
npm config set registry https://registry.npmjs.org
```

---

### 问题 4：全局安装权限错误

**错误信息**：

```bash
Error: EACCES: permission denied
```

**原因**：没有权限写入全局安装目录

**解决方法**：

参考"第 5 步"中的权限修复方法，或使用 `sudo`（不推荐）。

---

### 问题 5：Git 克隆失败

**错误信息**：

```bash
Error: git clone failed
```

**原因**：SSH 密钥未配置或网络问题

**解决方法**：

```bash
# 测试 Git 连接
git ls-remote https://github.com/numman-ali/openskills.git

# 如果失败，检查网络或配置代理
git config --global http.proxy http://proxy.example.com:8080
```

---

## 本课小结

本课我们学习了：

1. **环境要求**：Node.js 20.6+ 和 Git
2. **推荐使用方式**：`npx openskills`（无需安装）
3. **可选全局安装**：`npm install -g openskills`（频繁使用时）
4. **环境验证**：检查版本号和命令可用性
5. **常见问题**：版本不匹配、权限问题、网络问题

现在你已经完成了 OpenSkills 的安装，下一课我们将学习如何安装第一个技能。

---

## 下一课预告

> 下一课我们学习 **[安装第一个技能](../first-skill/)**
>
> 你会学到：
> - 如何从 Anthropic 官方仓库安装技能
> - 交互式选择技能的技巧
> - 技能的目录结构
> - 验证技能是否正确安装

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

### 核心配置

| 配置项         | 文件路径                                                                                       | 行号      |
|--- | --- | ---|
| Node.js 版本要求 | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 45-47     |
| 包信息         | [`package.json`](https://github.com/numman-ali/openskills/blob/main/package.json) | 1-9       |
| CLI 入口       | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts)             | 39-80     |

### 关键常量

- **Node.js 要求**：`>=20.6.0` (package.json:46)
- **包名**：`openskills` (package.json:2)
- **版本**：`1.5.0` (package.json:3)
- **CLI 命令**：`openskills` (package.json:8)

### 依赖说明

**运行时依赖** (package.json:48-53)：
- `@inquirer/prompts`: 交互式选择
- `chalk`: 终端彩色输出
- `commander`: CLI 参数解析
- `ora`: 加载动画

**开发依赖** (package.json:54-59)：
- `typescript`: TypeScript 编译
- `vitest`: 单元测试
- `tsup`: 打包工具

</details>
