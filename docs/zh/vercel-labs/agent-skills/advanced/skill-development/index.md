---
title: "Agent Skills 自定义技能开发：为 Claude 创建专属 AI 助手 | Agent Skills 教程"
sidebarTitle: "写个技能扩展 Claude"
subtitle: "开发自定义技能"
description: "学习如何为 Claude 开发自定义技能，包括目录结构规范、SKILL.md 格式详解、脚本编写规范和 Zip 打包发布流程。本教程教你创建可扩展的 AI 辅助工具，精准触发技能，优化上下文效率，扩展 Claude 代码能力，封装重复操作，并实现团队标准化流程。"
tags:
  - "技能开发"
  - "Claude"
  - "AI 辅助编程"
  - "自定义扩展"
order: 60
prerequisite:
  - "start-getting-started"
  - "start-installation"
---

# 开发自定义技能

## 学完你能做什么

学完这节课，你将能够：

- ✅ 创建符合规范的技能目录结构
- ✅ 编写完整的 `SKILL.md` 定义文件（包含 Front Matter、How It Works、Usage 等章节）
- ✅ 编写符合规范的 Bash 脚本（错误处理、输出格式、清理机制）
- ✅ 打包技能为 Zip 文件并发布
- ✅ 优化上下文效率，让 Claude 更精准地激活技能

## 你现在的困境

你可能遇到过这些场景：

- ✗ 经常重复某个复杂的操作（如部署到特定平台、分析日志格式），每次都要向 Claude 解释
- ✗ Claude 不知道何时该激活某个功能，导致你重复输入相同的指令
- ✗ 想把团队的最佳实践封装成可复用的工具，但不知道从何下手
- ✗ 写的技能文件经常被 Claude 忽略，不知道是哪里出了问题

## 什么时候用这一招

当你需要：

- 📦 **封装重复操作**：将经常使用的命令序列打包成一键执行
- 🎯 **精准触发**：让 Claude 在特定场景下主动激活技能
- 🏢 **标准化流程**：将团队规范（如代码检查、部署流程）自动化
- 🚀 **扩展能力**：为 Claude 添加它原本不支持的功能

## 🎒 开始前的准备

在开始之前，请确认：

::: warning 前置检查

- 已完成 [Agent Skills 入门](../../start/getting-started/)
- 已安装 Agent Skills 并熟悉基本使用
- 了解基本的命令行操作（Bash 脚本）
- 有一个 GitHub 仓库（用于发布技能）

:::

## 核心思路

**Agent Skills 的工作原理**：

Claude 在启动时只加载技能的**名称和描述**，当检测到相关关键词时，才会读取完整的 `SKILL.md` 内容。这种**按需加载机制**可以最大限度地减少 Token 消耗。

**技能开发三个核心要素**：

1. **目录结构**：符合命名规范的文件夹 layout
2. **SKILL.md**：技能定义文件，告诉 Claude 何时激活、如何使用
3. **脚本**：实际执行的 Bash 代码，负责具体操作

<!-- ![技能激活流程](/images/advanced/skill-activation-flow.svg) -->
> [图片：技能激活流程]

---

## 跟我做：创建第一个技能

### 第 1 步：创建目录结构

**为什么**
正确的目录结构是 Claude 能识别技能的前提。

在 `skills/` 目录下创建新技能：

```bash
cd skills
mkdir my-custom-skill
cd my-custom-skill
mkdir scripts
```

**目录结构应该是**：

```
skills/
  my-custom-skill/
    SKILL.md           # 技能定义文件（必选）
    scripts/
      deploy.sh        # 可执行脚本（必选）
```

**注意**：开发完成后，需要将整个技能目录打包成 `my-custom-skill.zip` 用于发布（详见下文"打包技能"部分）

**你应该看到**：
- `my-custom-skill/` 使用 kebab-case 命名（小写字母和连字符）
- `SKILL.md` 文件名全大写，必须精确匹配
- `scripts/` 目录存放可执行脚本

### 第 2 步：编写 SKILL.md

**为什么**
`SKILL.md` 是技能的核心，定义了技能的触发条件、使用方式和输出格式。

创建 `SKILL.md` 文件：

```markdown
---
name: my-custom-skill
description: Deploy my app to custom platform. Use when user says "deploy", "production", or "custom deploy".
---

# Custom Deployment Skill

Deploy your application to a custom platform with zero-config setup.

## How It Works

1. Detect the framework from `package.json` (Next.js, Vue, Svelte, etc.)
2. Create a tarball of the project (excluding `node_modules` and `.git`)
3. Upload to the deployment API
4. Return preview URL and deployment ID

## Usage

```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh [path]
```

**Arguments:**
- `path` - Directory path or .tgz file to deploy (defaults to current directory)

**Examples:**

Deploy current directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh .
```

Deploy specific directory:
```bash
bash /mnt/skills/user/my-custom-skill/scripts/deploy.sh ./my-app
```

## Output

You'll see:

```
✓ Deployed to https://my-app-abc123.custom-platform.io
✓ Deployment ID: deploy_12345
✓ Claim URL: https://custom-platform.io/claim?code=...
```

JSON format (for machine-readable output):
```json
{
  "previewUrl": "https://my-app-abc123.custom-platform.io",
  "deploymentId": "deploy_12345",
  "claimUrl": "https://custom-platform.io/claim?code=..."
}
```

## Present Results to User

When presenting results to the user, use this format:

```
🎉 Deployment successful!

**Preview URL**: https://my-app-abc123.custom-platform.io

To transfer ownership:
1. Visit the claim URL
2. Sign in to your account
3. Confirm the transfer

**Deployment ID**: deploy_12345
```

## Troubleshooting

**Network Error**
- Check your internet connection
- Verify the deployment API is accessible

**Permission Error**
- Ensure the directory is readable
- Check file permissions on the script

**Framework Not Detected**
- Ensure `package.json` exists in the project root
- Verify the framework is supported
```

**你应该看到**：
- Front Matter 包含 `name` 和 `description` 字段
- `description` 包含触发关键词（如 "deploy", "production"）
- 包含 `How It Works`、`Usage`、`Output`、`Present Results to User`、`Troubleshooting` 等章节

### 第 3 步：编写 Bash 脚本

**为什么**
脚本是实际执行操作的部分，需要符合 Claude 的输入输出规范。

创建 `scripts/deploy.sh`：

```bash
#!/bin/bash
set -e  # 遇到错误立即退出

# 配置
DEPLOY_API="${DEPLOY_API:-https://deploy.example.com/api}"

# 解析参数
INPUT_PATH="${1:-.}"

# 清理函数
cleanup() {
  if [ -n "$TEMP_TARBALL" ] && [ -f "$TEMP_TARBALL" ]; then
    rm -f "$TEMP_TARBALL" >&2 || true
  fi
}
trap cleanup EXIT

# 检测框架
detect_framework() {
  local path="$1"
  local framework=""

  if [ -f "${path}/package.json" ]; then
    if grep -q '"next"' "${path}/package.json"; then
      framework="nextjs"
    elif grep -q '"vue"' "${path}/package.json"; then
      framework="vue"
    elif grep -q '"@sveltejs/kit"' "${path}/package.json"; then
      framework="sveltekit"
    fi
  fi

  echo "$framework"
}

# 主流程
FRAMEWORK=$(detect_framework "$INPUT_PATH")
echo "Detected framework: ${FRAMEWORK:-unknown}" >&2

# 创建 tarball
TEMP_TARBALL=$(mktemp -t deploy-XXXXXX.tgz)
echo "Creating tarball..." >&2
tar -czf "$TEMP_TARBALL" \
  --exclude='node_modules' \
  --exclude='.git' \
  -C "$INPUT_PATH" . >&2 || true

# 上传
echo "Uploading..." >&2
RESULT=$(curl -s -X POST "$DEPLOY_API" \
  -F "file=@$TEMP_TARBALL" \
  -F "framework=$FRAMEWORK")

# 检查错误
if echo "$RESULT" | grep -q '"error"'; then
  ERROR_MSG=$(echo "$RESULT" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
  echo "Deployment failed: $ERROR_MSG" >&2
  exit 1
fi

# 输出结果
echo "$RESULT"
echo "Deployment completed successfully" >&2
```

**你应该看到**：
- 脚本使用了 `#!/bin/bash` shebang
- 使用了 `set -e` 进行错误处理
- 状态消息输出到 stderr（`>&2`）
- 机器可读输出（JSON）输出到 stdout
- 包含清理 trap

### 第 4 步：设置执行权限

```bash
chmod +x scripts/deploy.sh
```

**你应该看到**：
- 脚本变成了可执行文件（`ls -l scripts/deploy.sh` 显示 `-rwxr-xr-x`）

### 第 5 步：测试技能

在 Claude Code 中测试技能：

```bash
# 激活技能
"Activate my-custom-skill"

# 触发部署
"Deploy my current directory using my-custom-skill"
```

**你应该看到**：
- Claude 激活了技能
- 执行了 `deploy.sh` 脚本
- 输出了部署结果（包含 previewUrl 和 deploymentId）

---

## 检查点 ✅

现在检查你的技能是否符合规范：

- [ ] 目录名使用 kebab-case（如 `my-custom-skill`）
- [ ] `SKILL.md` 文件名全大写，无误
- [ ] Front Matter 包含 `name` 和 `description` 字段
- [ ] `description` 包含触发关键词
- [ ] 脚本使用 `#!/bin/bash` shebang
- [ ] 脚本使用 `set -e` 进行错误处理
- [ ] 状态消息输出到 stderr（`>&2`）
- [ ] JSON 输出到 stdout
- [ ] 脚本包含清理 trap

---

## 踩坑提醒

### 坑 1：技能不被激活

**症状**：你说 "Deploy my app"，但 Claude 没有激活技能。

**原因**：`description` 中没有包含触发关键词。

**解决**：
```markdown
# ❌ 错误
description: A tool for deploying applications

# ✅ 正确
description: Deploy my app to production. Use when user says "deploy", "production", or "push to live".
```

### 坑 2：脚本输出混乱

**症状**：Claude 无法解析 JSON 输出。

**原因**：状态消息和 JSON 输出混在一起.

**解决**：
```bash
# ❌ 错误：都输出到 stdout
echo "Creating tarball..."
echo '{"previewUrl": "..."}'

# ✅ 正确：状态消息用 stderr
echo "Creating tarball..." >&2
echo '{"previewUrl": "..."}'
```

### 坑 3：临时文件未清理

**症状**：磁盘空间逐渐被占满。

**原因**：脚本退出时没有清理临时文件。

**解决**：
```bash
# ✅ 正确：使用 cleanup trap
cleanup() {
  rm -f "$TEMP_TARBALL" >&2 || true
}
trap cleanup EXIT
```

### 坑 4：SKILL.md 太长

**症状**：技能占用太多上下文，影响性能。

**原因**：`SKILL.md` 超过了 500 行。

**解决**：
- 将详细参考文档放到单独文件
- 使用渐进式披露（Progressive Disclosure）
- 优先使用脚本而非内联代码

---

## 本课小结

**核心要点**：

1. **目录结构**：使用 kebab-case，包含 `SKILL.md` 和 `scripts/` 目录
2. **SKILL.md 格式**：Front Matter + How It Works + Usage + Output + Present Results to User + Troubleshooting
3. **脚本规范**：`#!/bin/bash`、`set -e`、stderr 输出状态、stdout 输出 JSON、清理 trap
4. **上下文效率**：保持 `SKILL.md` < 500行、使用渐进式披露、优先脚本
5. **打包发布**：使用 `zip -r` 命令打包成 `{skill-name}.zip`

**最佳实践口诀**：

> 描述要具体，触发要明确
> 状态用 stderr，JSON 用 stdout
> 记得加 trap，临时文件清
> 文件别太长，脚本占空间

---

## 下一课预告

> 下一课我们学习 **[编写 React 最佳实践规则](../rule-authoring/)**。
>
> 你将学到：
> - 如何编写符合规范的规则文件
> - 使用 `_template.md` 模板生成规则
> - 定义 impact 级别和 tags
> - 编写 Incorrect/Correct 代码示例对比
> - 添加参考文献和验证规则

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能               | 文件路径                                                                                       | 行号   |
| ------------------ | ---------------------------------------------------------------------------------------------- | ------ |
| 技能开发规范       | [`AGENTS.md:9-69`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L9-L69)     | 9-69   |
| 目录结构定义       | [`AGENTS.md:11-20`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20)   | 11-20  |
| 命名约定           | [`AGENTS.md:22-27`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L22-L27)   | 22-27  |
| SKILL.md 格式      | [`AGENTS.md:29-68`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68)   | 29-68  |
| 上下文效率最佳实践 | [`AGENTS.md:70-78`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L70-L78)   | 70-78  |
| 脚本要求           | [`AGENTS.md:80-87`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L80-L87)   | 80-87  |
| Zip 打包           | [`AGENTS.md:89-96`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L89-L96)   | 89-96  |
| 用户安装方法       | [`AGENTS.md:98-110`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110) | 98-110 |

**关键常量**：
- `SKILL.md` 文件名：必须全大写，精确匹配
- `/mnt/skills/user/{skill-name}/scripts/{script}.sh`：脚本路径格式

**关键函数**：
- 脚本清理函数 `cleanup()`：用于删除临时文件
- 框架检测函数 `detect_framework()`：从 package.json 推断框架类型

</details>
