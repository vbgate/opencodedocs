---
title: "CI/CD: 非交互式集成 | OpenSkills"
sidebarTitle: "一键搞定 CI/CD"
subtitle: "CI/CD: 非交互式集成 | OpenSkills"
description: "学习 OpenSkills CI/CD 集成，掌握 -y 标志实现非交互式安装和同步。包含 GitHub Actions、Docker 实战示例，自动化技能管理。"
tags:
  - "进阶"
  - "CI/CD"
  - "自动化"
  - "部署"
prerequisite:
  - "start-first-skill"
  - "start-sync-to-agents"
  - "platforms-cli-commands"
order: 6
---

# CI/CD 集成

## 学完你能做什么

- 理解 CI/CD 环境为什么需要非交互式模式
- 掌握 `--yes/-y` 标志在 `install` 和 `sync` 命令中的使用
- 学会在 GitHub Actions、GitLab CI 等 CI 平台集成 OpenSkills
- 了解 Docker 容器中的技能自动化安装流程
- 掌握 CI/CD 环境下的技能更新和同步策略
- 避免 CI/CD 流程中的交互式提示导致的失败

::: info 前置知识

本教程假设你已经了解了 [安装第一个技能](../../start/first-skill/) 和 [同步技能到 AGENTS.md](../../start/sync-to-agents/)，以及基本的 [命令详解](../../platforms/cli-commands/)。

:::

---

## 你现在的困境

你可能在本地环境已经熟练使用 OpenSkills，但在 CI/CD 环境中遇到了问题：

- **交互式提示导致失败**：CI 流程中弹出选择界面，无法继续执行
- **自动化部署时需要安装技能**：每次构建都需要重新安装技能，但无法自动确认
- **多环境配置不同步**：开发环境、测试环境、生产环境的技能配置不一致
- **AGENTS.md 生成不自动化**：每次部署后需要手动运行 sync 命令
- **Docker 镜像构建时缺少技能**：容器启动后需要手动安装技能

其实 OpenSkills 提供了 `--yes/-y` 标志，专门用于非交互式环境，让你在 CI/CD 流程中自动化完成所有操作。

---

## 什么时候用这一招

**CI/CD 集成的适用场景**：

| 场景 | 是否需要非交互式模式 | 示例 |
| ---- | ------------------- | ---- |
| **GitHub Actions** | ✅ 是 | 每次 PR 或 push 时自动安装技能 |
| **GitLab CI** | ✅ 是 | 合并请求时自动同步 AGENTS.md |
| **Docker 构建** | ✅ 是 | 镜像构建时自动安装技能到容器 |
| **Jenkins 流水线** | ✅ 是 | 持续集成时自动更新技能 |
| **开发环境初始化脚本** | ✅ 是 | 新人拉代码后一键配置环境 |
| **生产环境部署** | ✅ 是 | 部署时自动同步最新的技能 |

::: tip 推荐做法

- **本地开发用交互式**：手动操作时可以仔细选择要安装的技能
- **CI/CD 用非交互式**：自动化流程中必须使用 `-y` 标志跳过所有提示
- **环境区分策略**：不同环境使用不同的技能源（如私有仓库）

:::

---

## 核心思路：非交互式模式

OpenSkills 的 `install` 和 `sync` 命令都支持 `--yes/-y` 标志，用于跳过所有交互式提示：

**install 命令的非交互式行为**（源码 `install.ts:424-427`）：

```typescript
// Interactive selection (unless -y flag or single skill)
let skillsToInstall = skillInfos;

if (!options.yes && skillInfos.length > 1) {
  // 进入交互式选择流程
  // ...
}
```

**非交互式模式特点**：

1. **跳过技能选择**：安装所有找到的技能
2. **自动覆盖**：遇到已存在的技能直接覆盖（显示 `Overwriting: <skill-name>`）
3. **跳过冲突确认**：不询问是否覆盖，直接执行
4. **兼容 headless 环境**：在没有 TTY 的 CI 环境中正常工作

**warnIfConflict 函数的行为**（源码 `install.ts:524-527`）：

```typescript
if (skipPrompt) {
  // Auto-overwrite in non-interactive mode
  console.log(chalk.dim(`Overwriting: ${skillName}`));
  return true;
}
```

::: important 重要概念

**非交互式模式**：使用 `--yes/-y` 标志跳过所有交互式提示，让命令在 CI/CD、脚本、无 TTY 环境中自动执行，不依赖用户输入。

:::

---

## 跟我做

### 第 1 步：体验非交互式安装

**为什么**
先在本地体验非交互式模式的行为，理解它与交互式的区别。

打开终端，执行：

```bash
# 非交互式安装（安装所有找到的技能）
npx openskills install anthropics/skills --yes

# 或使用简写
npx openskills install anthropics/skills -y
```

**你应该看到**：

```
Cloning into '/tmp/openskills-temp-...'...
...
Found 3 skill(s)

Overwriting: codebase-reviewer
Overwriting: file-writer
Overwriting: git-helper

✅ Installed 3 skill(s)

Next: Run 'openskills sync' to generate AGENTS.md
```

**解释**：
- 使用 `-y` 标志后，跳过了技能选择界面
- 所有找到的技能都被自动安装
- 如果技能已存在，显示 `Overwriting: <skill-name>` 并直接覆盖
- 不会弹出任何确认对话框

---

### 第 2 步：对比交互式与非交互式

**为什么**
通过对比，更清楚地理解两种模式的区别和适用场景。

执行以下命令，对比两种模式：

```bash
# 清空现有技能（用于测试）
rm -rf .claude/skills

# 交互式安装（会弹出选择界面）
echo "=== 交互式安装 ==="
npx openskills install anthropics/skills

# 清空现有技能
rm -rf .claude/skills

# 非交互式安装（自动安装所有技能）
echo "=== 非交互式安装 ==="
npx openskills install anthropics/skills -y
```

**你应该看到**：

**交互式模式**：
- 显示技能列表，让你用空格勾选
- 需要按回车确认
- 可以选择性地安装部分技能

**非交互式模式**：
- 直接显示安装过程
- 自动安装所有技能
- 不需要任何用户输入

**对比表格**：

| 特性 | 交互式模式（默认） | 非交互式模式（-y） |
| ---- | ----------------- | ------------------ |
| **技能选择** | 弹出选择界面，手动勾选 | 自动安装所有找到的技能 |
| **覆盖确认** | 询问是否覆盖已存在的技能 | 自动覆盖，显示提示信息 |
| **TTY 要求** | 需要交互式终端 | 不需要，可在 CI 环境运行 |
| **适用场景** | 本地开发、手动操作 | CI/CD、脚本、自动化流程 |
| **输入要求** | 需要用户输入 | 零输入，自动执行 |

---

### 第 3 步：非交互式同步 AGENTS.md

**为什么**
学会在自动化流程中生成 AGENTS.md，让 AI 代理始终使用最新的技能列表。

执行：

```bash
# 非交互式同步（同步所有技能到 AGENTS.md）
npx openskills sync -y

# 查看生成的 AGENTS.md
cat AGENTS.md | head -20
```

**你应该看到**：

```
✅ Synced 3 skill(s) to AGENTS.md
```

AGENTS.md 内容：

```xml
<skills_system>
This project uses the OpenSkills system for AI agent extensibility.

Usage:
- Ask the AI agent to load specific skills using: "Use the <skill-name> skill"
- The agent will read the skill definition from .claude/skills/<skill-name>/SKILL.md
- Skills provide specialized capabilities like code review, file writing, etc.
</skills_system>

<available_skills>
  <skill name="codebase-reviewer">
    <description>Review code changes for issues...</description>
  </skill>
  <skill name="file-writer">
    <description>Write files with format...</description>
  </skill>
  <skill name="git-helper">
    <description>Git operations and utilities...</description>
  </skill>
</available_skills>
```

**解释**：
- `-y` 标志跳过了技能选择界面
- 所有已安装的技能都同步到 AGENTS.md
- 不会弹出任何确认对话框

---

### 第 4 步：GitHub Actions 集成

**为什么**
在实际 CI/CD 流程中集成 OpenSkills，实现自动化技能管理。

在项目中创建 `.github/workflows/setup-skills.yml` 文件：

```yaml
name: Setup Skills

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills (non-interactive)
        run: openskills install anthropics/skills -y

      - name: Sync to AGENTS.md
        run: openskills sync -y

      - name: Verify AGENTS.md
        run: |
          echo "=== AGENTS.md generated ==="
          cat AGENTS.md

      - name: Upload AGENTS.md as artifact
        uses: actions/upload-artifact@v4
        with:
          name: agents-md
          path: AGENTS.md
```

提交并推送到 GitHub：

```bash
git add .github/workflows/setup-skills.yml
git commit -m "Add GitHub Actions workflow for OpenSkills"
git push
```

**你应该看到**：GitHub Actions 自动运行，成功安装技能并生成 AGENTS.md。

**解释**：
- 每次 push 或 PR 时自动触发
- 使用 `openskills install anthropics/skills -y` 非交互式安装技能
- 使用 `openskills sync -y` 非交互式同步 AGENTS.md
- 将 AGENTS.md 作为 artifact 保存，便于调试

---

### 第 5 步：使用私有仓库

**为什么**
在企业环境中，技能通常托管在私有仓库，需要在 CI/CD 中通过 SSH 访问。

在 GitHub Actions 中配置 SSH：

```yaml
name: Setup Skills from Private Repo

on:
  push:
    branches: [main]

jobs:
  setup-skills:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH key
        env:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: Install OpenSkills
        run: npm install -g openskills

      - name: Install skills from private repo
        run: openskills install git@github.com:your-org/private-skills.git -y

      - name: Sync to AGENTS.md
        run: openskills sync -y
```

在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 中添加 `SSH_PRIVATE_KEY`。

**你应该看到**：GitHub Actions 成功从私有仓库安装技能。

**解释**：
- 使用 Secrets 存储私钥，避免泄露
- 配置 SSH 访问私有仓库
- `openskills install git@github.com:your-org/private-skills.git -y` 支持从私有仓库安装

---

### 第 6 步：Docker 场景集成

**为什么**
在 Docker 镜像构建时自动安装技能，确保容器启动后立即可用。

创建 `Dockerfile`：

```dockerfile
FROM node:20-alpine

WORKDIR /app

# 安装 OpenSkills
RUN npm install -g openskills

# 安装技能（非交互式）
RUN openskills install anthropics/skills -y

# 同步 AGENTS.md
RUN openskills sync -y

# 复制应用代码
COPY . .

# 其他构建步骤...
RUN npm install
RUN npm run build

# 启动命令
CMD ["node", "dist/index.js"]
```

构建并运行：

```bash
# 构建 Docker 镜像
docker build -t myapp:latest .

# 运行容器
docker run -it --rm myapp:latest sh

# 在容器中验证技能已安装
ls -la .claude/skills/
cat AGENTS.md
```

**你应该看到**：容器中已经安装好了技能并生成了 AGENTS.md。

**解释**：
- 在 Docker 镜像构建阶段安装技能
- 使用 `RUN openskills install ... -y` 非交互式安装
- 容器启动后无需手动安装技能
- 适合微服务、Serverless 等场景

---

### 第 7 步：环境变量配置

**为什么**
通过环境变量灵活配置技能源，不同环境使用不同的技能仓库。

创建 `.env.ci` 文件：

```bash
# CI/CD 环境配置
SKILLS_SOURCE=anthropics/skills
SKILLS_INSTALL_FLAGS=-y
SYNC_FLAGS=-y
```

在 CI/CD 脚本中使用：

```bash
#!/bin/bash
# .github/scripts/setup-skills.sh

set -e

# 加载环境变量
if [ -f .env.ci ]; then
  export $(cat .env.ci | grep -v '^#' | xargs)
fi

echo "Installing skills from: $SKILLS_SOURCE"
npx openskills install $SKILLS_SOURCE $SKILLS_INSTALL_FLAGS

echo "Syncing to AGENTS.md"
npx openskills sync $SYNC_FLAGS

echo "✅ Skills setup completed"
```

在 GitHub Actions 中调用：

```yaml
- name: Setup skills
  run: .github/scripts/setup-skills.sh
```

**你应该看到**：脚本根据环境变量自动配置技能源和标志。

**解释**：
- 通过环境变量灵活配置技能源
- 不同环境（开发、测试、生产）可以使用不同的 `.env` 文件
- 保持 CI/CD 配置的可维护性

---

## 检查点 ✅

完成以下检查，确认你掌握了本课内容：

- [ ] 理解非交互式模式的用途和特点
- [ ] 能够使用 `-y` 标志进行非交互式安装
- [ ] 能够使用 `-y` 标志进行非交互式同步
- [ ] 理解交互式与非交互式的区别
- [ ] 能够在 GitHub Actions 中集成 OpenSkills
- [ ] 能够在 Docker 镜像构建时安装技能
- [ ] 知道如何在 CI/CD 中处理私有仓库
- [ ] 理解环境变量配置的最佳实践

---

## 踩坑提醒

### 常见错误 1：忘记添加 -y 标志

**错误场景**：在 GitHub Actions 中忘记使用 `-y` 标志

```yaml
# ❌ 错误：忘记 -y 标志
- name: Install skills
  run: openskills install anthropics/skills
```

**问题**：
- CI 环境没有交互式终端（TTY）
- 命令会等待用户输入，导致 workflow 超时失败
- 错误信息可能不明显

**正确做法**：

```yaml
# ✅ 正确：使用 -y 标志
- name: Install skills
  run: openskills install anthropics/skills -y
```

---

### 常见错误 2：技能覆盖导致配置丢失

**错误场景**：CI/CD 每次都覆盖技能，导致本地配置丢失

```bash
# CI/CD 中安装技能到全局目录
openskills install anthropics/skills --global -y

# 本地用户安装到项目目录，被全局覆盖
```

**问题**：
- 全局安装的技能优先级低于项目本地
- CI/CD 和本地安装位置不一致，导致混乱
- 可能覆盖了本地用户精心配置的技能

**正确做法**：

```bash
# 方案 1：CI/CD 和本地都使用项目安装
openskills install anthropics/skills -y

# 方案 2：使用 Universal 模式避免冲突
openskills install anthropics/skills --universal -y

# 方案 3：CI/CD 使用专用目录（通过自定义输出路径）
openskills install anthropics/skills -y
openskills sync -o .agents-md/AGENTS.md -y
```

---

### 常见错误 3：Git 访问权限不足

**错误场景**：从私有仓库安装技能时，未配置 SSH 密钥

```yaml
# ❌ 错误：未配置 SSH 密钥
- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

**问题**：
- CI 环境无法访问私有仓库
- 错误信息：`Permission denied (publickey)`
- 克隆失败，workflow 失败

**正确做法**：

```yaml
# ✅ 正确：配置 SSH 密钥
- name: Setup SSH key
  env:
    SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
  run: |
    mkdir -p ~/.ssh
    echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
    chmod 600 ~/.ssh/id_rsa
    ssh-keyscan github.com >> ~/.ssh/known_hosts

- name: Install from private repo
  run: openskills install git@github.com:your-org/private-skills.git -y
```

---

### 常见错误 4：Docker 镜像过大

**错误场景**：Dockerfile 中安装技能导致镜像体积过大

```dockerfile
# ❌ 错误：每次都重新克隆和安装
RUN openskills install anthropics/skills -y
```

**问题**：
- 每次构建都从 GitHub 克隆仓库
- 增加构建时间和镜像体积
- 网络问题可能导致失败

**正确做法**：

```dockerfile
# ✅ 正确：使用多阶段构建和缓存
FROM node:20-alpine AS skills-builder

RUN npm install -g openskills
RUN openskills install anthropics/skills -y
RUN openskills sync -y

# 主镜像
FROM node:20-alpine

WORKDIR /app

# 复制已安装的技能
COPY --from=skills-builder ~/.claude /root/.claude
COPY --from=skills-builder /app/AGENTS.md /app/

# 复制应用代码
COPY . .

# 其他构建步骤...
```

---

### 常见错误 5：忘记更新技能

**错误场景**：CI/CD 每次都安装旧版本的技能

```yaml
# ❌ 错误：只安装，不更新
- name: Install skills
  run: openskills install anthropics/skills -y
```

**问题**：
- 技能仓库可能已经更新
- CI/CD 安装的技能版本不是最新的
- 可能导致功能缺失或 bug

**正确做法**：

```yaml
# ✅ 正确：先更新再同步
- name: Update skills
  run: openskills update -y

- name: Sync to AGENTS.md
  run: openskills sync -y

# 或在 install 时使用更新策略
- name: Install or update skills
  run: |
    openskills install anthropics/skills -y || openskills update -y
```

---

## 本课小结

**核心要点**：

1. **非交互式模式适用于 CI/CD**：使用 `-y` 标志跳过所有交互式提示
2. **install 命令的 -y 标志**：自动安装所有找到的技能，覆盖已存在的技能
3. **sync 命令的 -y 标志**：自动同步所有技能到 AGENTS.md
4. **GitHub Actions 集成**：在 workflow 中使用非交互式命令自动化技能管理
5. **Docker 场景**：在镜像构建阶段安装技能，确保容器启动后立即可用
6. **私有仓库访问**：通过 SSH 密钥配置访问私有技能仓库
7. **环境变量配置**：通过环境变量灵活配置技能源和安装参数

**决策流程**：

```
[需要在 CI/CD 中使用 OpenSkills] → [安装技能]
                                    ↓
                            [使用 -y 标志跳过交互]
                                    ↓
                            [生成 AGENTS.md]
                                    ↓
                            [使用 -y 标志跳过交互]
                                    ↓
                            [验证技能已正确安装]
```

**记忆口诀**：

- **CI/CD 记得加 -y**：非交互式是关键
- **GitHub Actions 用 SSH**：私有仓库要配密钥
- **Docker 构建早安装**：镜像体积要注意
- **环境变量配置好**：不同环境要区分

---

## 下一课预告

> 下一课我们学习 **[安全性说明](../security/)**。
>
> 你会学到：
> - OpenSkills 的安全特性和防护机制
> - 路径遍历防护的工作原理
> - 符号链接的安全处理方式
> - YAML 解析的安全措施
> - 权限管理最佳实践

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能              | 文件路径                                                                                                    | 行号    |
| ----------------- | ----------------------------------------------------------------------------------------------------------- | ------- |
| 非交互式安装      | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L424-L455) | 424-455 |
| 冲突检测与覆盖    | [`src/commands/install.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/install.ts#L521-L550) | 521-550 |
| 非交互式同步      | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93)   | 46-93   |
| 命令行参数定义    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L49)                          | 49      |
| 命令行参数定义    | [`src/cli.ts`](https://github.com/numman-ali/openskills/blob/main/src/cli.ts#L65)                          | 65      |

**关键常量**：
- `-y, --yes`：跳过交互式选择的命令行标志

**关键函数**：
- `warnIfConflict(skillName, targetPath, isProject, skipPrompt)`：检测技能冲突并决定是否覆盖
- `installFromRepo()`：从仓库安装技能（支持非交互式模式）
- `syncAgentsMd()`：同步技能到 AGENTS.md（支持非交互式模式）

**业务规则**：
- 使用 `-y` 标志时，跳过所有交互式提示
- 技能已存在时，非交互式模式自动覆盖（显示 `Overwriting: <skill-name>`）
- 非交互式模式在 headless 环境（无 TTY）中正常工作
- `install` 和 `sync` 命令都支持 `-y` 标志

</details>
