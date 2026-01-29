---
title: "执行脚本: 技能目录运行 | opencode-agent-skills"
sidebarTitle: "运行自动化脚本"
subtitle: "执行脚本: 技能目录运行"
description: "掌握技能脚本的执行方法。学习在技能目录上下文中运行脚本、传递参数、处理错误和设置权限，利用自动化能力提升工作效率。"
tags:
  - "脚本执行"
  - "自动化"
  - "工具使用"
prerequisite:
  - "start-installation"
  - "platforms-listing-available-skills"
order: 5
---

# 执行技能脚本

## 学完你能做什么

- 使用 `run_skill_script` 工具执行技能目录下的可执行脚本
- 向脚本传递命令行参数
- 理解脚本执行的工作目录上下文
- 处理脚本执行错误和退出码
- 掌握脚本权限设置和安全机制

## 你现在的困境

你想让 AI 执行某个技能的自动化脚本，比如构建项目、运行测试或部署应用。但你不确定如何调用脚本，或者在执行时遇到权限错误、找不到脚本等问题。

## 什么时候用这一招

- **自动化构建**：执行技能的 `build.sh` 或 `build.py` 构建项目
- **运行测试**：触发技能的测试套件生成覆盖率报告
- **部署流程**：执行部署脚本将应用发布到生产环境
- **数据处理**：运行脚本处理文件、转换数据格式
- **依赖安装**：执行脚本安装技能所需的依赖项

## 核心思路

`run_skill_script` 工具让你在技能目录的上下文中执行可执行脚本。这样做的好处是：

- **正确的执行环境**：脚本在技能目录中运行，可以访问技能的配置和资源
- **自动化工作流**：技能可以包含一套自动化脚本，减少重复操作
- **权限检查**：只执行有可执行权限的文件，防止误执行普通文本文件
- **错误捕获**：捕获脚本的退出码和输出，方便调试

::: info 脚本发现规则
插件会在技能目录下递归查找可执行文件（深度最多 10 层）：
- **跳过目录**：隐藏目录（以 `.` 开头）、`node_modules`、`__pycache__`、`.git`、`.venv` 等
- **可执行检查**：只有文件有可执行权限（mode & 0o111）才会被收录到脚本列表
- **相对路径**：脚本路径相对于技能目录，如 `tools/build.sh`
:::

::: tip 先查看可用脚本
执行前，先用 `get_available_skills` 查看技能的脚本列表：
```
docker-helper (project)
  Docker 容器化和部署指南 [scripts: build.sh, deploy.sh]
```
::

## 跟我做

### 第 1 步：执行技能脚本

假设你有一个 `docker-helper` 技能，包含 `build.sh` 脚本：

```
用户输入：
执行 docker-helper 的 build.sh 脚本

系统回复：
Building Docker image...
Successfully built abc123def456
Tagged as myapp:latest
```

**你应该看到**：脚本的输出内容显示在回复中。

脚本执行时的工作目录已切换到技能目录，所以 `build.sh` 可以正确访问技能的 `Dockerfile` 等资源。

### 第 2 步：传递命令行参数

很多脚本支持参数，比如 `deploy.sh` 可能需要指定环境：

```
用户输入：
执行 docker-helper 的 deploy.sh，参数是 production

系统回复：
Deploying to production environment...
Uploading image to registry...
Deployment successful: https://myapp.example.com
```

你也可以传递多个参数：

```
用户输入：
用 deploy.sh 部署，参数是 staging 和 --force

系统回复：
Deploying to staging environment (--force mode)...
Skipping validation...
Deployment successful
```

**你应该看到**：脚本接收参数后执行相应操作。

### 第 3 步：执行嵌套目录中的脚本

脚本可以在技能的子目录中，如 `tools/setup.sh`：

```
用户输入：
执行 docker-helper 的 tools/setup.sh

系统回复：
Setting up Docker environment...
✓ Docker network created
✓ Volume mounted
✓ Environment configured
```

相对路径始终相对于技能目录，不管脚本实际位置多深。

**你应该看到**：嵌套目录中的脚本也能正确执行。

### 第 4 步：处理技能不存在错误

如果你输入了错误的技能名称：

```
用户输入：
执行 docker-asistant 的 build.sh

系统回复：
Skill "docker-asistant" not found. Did you mean "docker-helper"?
```

插件会基于模糊匹配建议正确的技能名称。你可以先调用 `get_available_skills` 查看可用技能。

**你应该看到**：错误提示和建议的正确名称。

### 第 5 步：处理脚本不存在错误

如果脚本不在技能的脚本列表中：

```
用户输入：
执行 docker-helper 的 run.sh

系统回复：
Script "run.sh" not found in skill "docker-helper". Did you mean "build.sh"?
Available scripts: build.sh, deploy.sh
```

插件会列出所有可用脚本，方便你选择正确的脚本名称。

**你应该看到**：错误提示和可用脚本列表。

### 第 6 步：理解脚本执行失败

如果脚本执行失败（退出码非 0），插件会返回错误信息：

```
用户输入：
执行 docker-helper 的 build.sh

系统回复：
Script failed (exit 1): Dockerfile not found in /path/to/skill
```

错误信息包含：
- **退出码**：`exit 1` 表示脚本以非零状态退出
- **错误输出**：脚本的 stderr 或 stdout 内容
- **失败原因**：脚本的具体错误信息

**你应该看到**：详细的错误信息帮助你定位问题。

## 检查点 ✅

- [ ] 你能执行技能目录下的可执行脚本吗？
- [ ] 你能向脚本传递命令行参数吗？
- [ ] 你能理解脚本执行的工作目录上下文吗？
- [ ] 你能识别并处理脚本执行错误吗？
- [ ] 你知道如何检查脚本的权限设置吗？

## 踩坑提醒

### 陷阱 1：脚本没有可执行权限

如果你创建了新脚本但忘记设置可执行权限，它不会出现在脚本列表中。

**错误表现**：
```
Available scripts: build.sh  # 你的新脚本 new-script.sh 不在列表中
```

**原因**：文件没有可执行权限（mode & 0o111 为 false）。

**解决**：在终端中设置可执行权限：
```bash
chmod +x .opencode/skills/my-skill/new-script.sh
```

**验证**：重新调用 `get_available_skills` 查看脚本列表。

### 陷阱 2：脚本路径错误

脚本路径必须是相对于技能目录的相对路径，不能使用绝对路径或父目录引用。

**错误示例**：

```bash
# ❌ 错误：使用绝对路径
执行 docker-helper 的 /path/to/skill/build.sh

# ❌ 错误：尝试访问父目录（虽然会通过安全检查，但路径不正确）
执行 docker-helper 的 ../build.sh
```

**正确示例**：

```bash
# ✅ 正确：使用相对路径
执行 docker-helper 的 build.sh
执行 docker-helper 的 tools/deploy.sh
```

**原因**：插件会验证路径安全性，防止目录穿越攻击，同时相对路径是基于技能目录的。

### 陷阱 3：脚本依赖工作目录

如果脚本假设当前目录是项目根目录而不是技能目录，可能会执行失败。

**错误示例**：
```bash
# skill 目录下的 build.sh
#!/bin/bash
# ❌ 错误：假设当前目录是项目根目录
docker build -t myapp .
```

**问题**：执行时，当前目录是技能目录（`.opencode/skills/docker-helper`），而不是项目根目录。

**解决**：脚本应使用绝对路径或动态定位项目根目录：
```bash
# ✅ 正确：使用相对路径定位项目根目录
docker build -t myapp ../../..

# 或者：使用环境变量或配置文件
PROJECT_ROOT="${SKILL_DIR}/../../.."
docker build -t myapp "$PROJECT_ROOT"
```

**说明**：技能目录下可能没有项目的 `Dockerfile`，需要脚本自己定位资源文件。

### 陷阱 4：脚本输出过长

如果脚本输出大量日志信息（比如 npm install 的下载进度），可能会让回复变得很长。

**表现**：

```bash
系统回复：
npm WARN deprecated package...
npm notice created a lockfile...
added 500 packages in 2m
# 可能有数百行输出
```

**建议**：脚本应该精简输出，只显示关键信息：

```bash
#!/bin/bash
echo "Installing dependencies..."
npm install --silent
echo "✓ Dependencies installed (500 packages)"
```

## 本课小结

`run_skill_script` 工具让你在技能目录的上下文中执行可执行脚本，支持：

- **参数传递**：通过 `arguments` 数组传递命令行参数
- **工作目录切换**：脚本执行时 CWD 切换到技能目录
- **错误处理**：捕获退出码和错误输出，方便调试
- **权限检查**：只执行有可执行权限的文件
- **路径安全**：验证脚本路径，防止目录穿越

脚本发现的规则：
- 递归扫描技能目录，最大深度 10 层
- 跳过隐藏目录和常见依赖目录
- 只包含有可执行权限的文件
- 路径为相对于技能目录的相对路径

**最佳实践**：
- 脚本输出要精简，只显示关键信息
- 脚本不应假设当前目录是项目根目录
- 使用 `chmod +x` 设置新脚本的可执行权限
- 先用 `get_available_skills` 查看可用脚本

## 下一课预告

> 下一课我们学习 **[读取技能文件](../reading-skill-files/)**。
>
> 你会学到：
> - 使用 read_skill_file 工具访问技能的文档和配置
> - 理解路径安全检查机制，防止目录穿越攻击
> - 掌握文件读取和 XML 内容注入的格式
> - 学会在技能中组织支持文件（文档、示例、配置等）

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                    | 行号    |
| ----------- | ------------------------------------------------------------------------------------------- | ------- |
| RunSkillScript 工具定义 | [`src/tools.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/tools.ts#L137-L198) | 137-198 |
| findScripts 函数 | [`src/skills.ts`](https://github.com/joshuadavidthomas/opencode-agent-skills/blob/main/src/skills.ts#L59-L99) | 59-99   |

**关键类型**：
- `Script = { relativePath: string; absolutePath: string }`：脚本元数据，包含相对路径和绝对路径

**关键常量**：
- 最大递归深度：`10`（`skills.ts:64`）- 脚本搜索深度限制
- 跳过目录列表：`['node_modules', '__pycache__', '.git', '.venv', 'venv', '.tox', '.nox']`（`skills.ts:61`）
- 可执行权限掩码：`0o111`（`skills.ts:86`）- 检查文件是否可执行

**关键函数**：
- `RunSkillScript(skill: string, script: string, arguments?: string[])`：执行技能脚本，支持参数传递和工作目录切换
- `findScripts(skillPath: string)`：递归查找技能目录下的可执行文件，按相对路径排序返回

**业务规则**：
- 脚本执行时切换工作目录到技能目录（`tools.ts:180`）：`$.cwd(skill.path)`
- 只执行在技能的 scripts 列表中的脚本（`tools.ts:165-177`）
- 脚本不存在时返回可用脚本列表，支持模糊匹配建议（`tools.ts:168-176`）
- 执行失败时返回退出码和错误输出（`tools.ts:184-195`）
- 跳过隐藏目录（以 `.` 开头）和常见依赖目录（`skills.ts:70-71`）

</details>
