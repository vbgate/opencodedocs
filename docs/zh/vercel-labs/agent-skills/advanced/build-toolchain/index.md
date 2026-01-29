---
title: "Agent Skills 构建工具链：验证、构建和 CI 集成 | Agent Skills 教程"
sidebarTitle: "验证规则并自动构建"
subtitle: "构建工具链使用"
description: "学习使用 Agent Skills 构建工具链，包括 pnpm validate 验证规则完整性、pnpm build 生成 AGENTS.md 和 test-cases.json、pnpm dev 开发流程、GitHub Actions CI 集成配置，以及测试用例提取和 LLM 自动评估。本教程教你管理规则库、自动化验证流程、集成持续集成、提取测试用例、维护构建系统，并确保规则质量。"
tags:
  - "构建工具"
  - "CI/CD"
  - "自动化"
  - "代码验证"
order: 80
prerequisite:
  - "start-getting-started"
  - "start-installation"
  - "advanced-rule-authoring"
---

# 构建工具链使用

## 学完你能做什么

学完这节课，你将能够：

- ✅ 使用 `pnpm validate` 验证规则文件的格式和完整性
- ✅ 使用 `pnpm build` 生成 AGENTS.md 和 test-cases.json
- ✅ 理解构建流程：parse → validate → group → sort → generate
- ✅ 配置 GitHub Actions CI 自动验证和构建
- ✅ 提取测试用例用于 LLM 自动评估
- ✅ 使用 `pnpm dev` 快速开发流程（build + validate）

## 你现在的困境

如果你在维护或扩展 React 规则库，可能遇到过这些问题：

- ✗ 修改规则后，忘记验证格式，导致生成的 AGENTS.md 有错误
- ✗ 规则文件越来越多，手动检查每个文件的完整性太耗时
- ✗ 提交代码后才发现某个规则缺少代码示例，影响 PR 审核效率
- ✗ 想要在 CI 中自动验证规则，但不知道如何配置 GitHub Actions
- ✗ 不清楚 `build.ts` 的构建流程，遇到错误时不知道从哪里排查

## 什么时候用这一招

当你需要：

- 🔍 **验证规则**：在提交代码前确保所有规则文件符合规范
- 🏗️ **生成文档**：从 Markdown 规则文件生成结构化的 AGENTS.md
- 🤖 **提取测试用例**：为 LLM 自动评估准备测试数据
- 🔄 **集成 CI**：在 GitHub Actions 中自动化验证和构建
- 🚀 **快速开发**：使用 `pnpm dev` 快速迭代和验证规则

## 🎒 开始前的准备

在开始之前，请确认：

::: warning 前置检查

- 已完成 [Agent Skills 入门](../../start/getting-started/)
- 已安装 Agent Skills 并熟悉基本使用
- 了解 React 规则编写规范（建议先学 [编写 React 最佳实践规则](../rule-authoring/)）
- 有基础的命令行操作经验
- 了解 pnpm 包管理器的基本用法

:::

## 核心思路

**构建工具链的作用**：

Agent Skills 的规则库本质上是 57 个独立 Markdown 文件，但 Claude 需要一个结构化的 AGENTS.md 才能高效使用。构建工具链负责：

1. **解析规则文件**：从 Markdown 中提取 title、impact、examples 等字段
2. **验证完整性**：检查每个规则是否有 title、explanation 和代码示例
3. **分组和排序**：按章节分组，按标题字母排序，分配 ID（1.1, 1.2...）
4. **生成文档**：输出格式化的 AGENTS.md 和 test-cases.json

**构建流程**：

```
rules/*.md (57 个文件)
    ↓
[parser.ts] 解析 Markdown
    ↓
[validate.ts] 验证完整性
    ↓
[build.ts] 分组 → 排序 → 生成 AGENTS.md
    ↓
[extract-tests.ts] 提取测试用例 → test-cases.json
```

**四个核心命令**：

| 命令                 | 功能                              | 适用场景             |
| -------------------- | --------------------------------- | -------------------- |
| `pnpm validate`      | 验证所有规则文件的格式和完整性    | 提交前检查、CI 验证  |
| `pnpm build`         | 生成 AGENTS.md 和 test-cases.json | 规则修改后、发布前   |
| `pnpm dev`           | 执行 build + validate（开发流程） | 快速迭代、开发新规则 |
| `pnpm extract-tests` | 单独提取测试用例（不重新构建）    | 只更新测试数据时     |

---

## 跟我做：使用构建工具链

### 第 1 步：验证规则（pnpm validate）

**为什么**
在开发或修改规则时，首先确保所有规则文件符合规范，避免构建时才发现错误。

进入构建工具目录：

```bash
cd packages/react-best-practices-build
```

运行验证命令：

```bash
pnpm validate
```

**你应该看到**：

```bash
Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**如果有错误**：

```bash
✗ Validation failed:

  async-parallel.md: Missing or empty title
  bundle-dynamic-imports.md: Missing code examples
  rerender-memo.md: Invalid impact level: SUPER_HIGH
```

**验证的内容**（源码：`validate.ts`）：

- ✅ title 非空
- ✅ explanation 非空
- ✅ 至少包含一个代码示例
- ✅ 包含至少一个 "Incorrect/bad" 或 "Correct/good" 示例
- ✅ impact 级别合法（CRITICAL/HIGH/MEDIUM-HIGH/MEDIUM/LOW-MEDIUM/LOW）

### 第 2 步：构建文档（pnpm build）

**为什么**
从规则文件生成 Claude 使用的 AGENTS.md 和 test-cases.json。

运行构建命令：

```bash
pnpm build
```

**你应该看到**：

```bash
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules
```

**生成的文件**：

1. **AGENTS.md**（位于 `skills/react-best-practices/AGENTS.md`）
   - 结构化的 React 性能优化指南
   - 包含 8 个章节，57 条规则
   - 按 impact 级别排序（CRITICAL → HIGH → MEDIUM...）

2. **test-cases.json**（位于 `packages/react-best-practices-build/test-cases.json`）
   - 从所有规则提取的测试用例
   - 包含 bad 和 good 示例
   - 用于 LLM 自动评估

**AGENTS.md 结构示例**：

```markdown
# React Best Practices

Version 1.0
Vercel Engineering
January 2026

---

## Abstract

Performance optimization guide for React and Next.js applications, ordered by impact.

---

## Table of Contents

1. [Eliminating Waterfalls](#1-eliminating-waterfalls) — **CRITICAL**
   - 1.1 [Parallel async operations](#11-parallel-async-operations)
   - 1.2 [Deferring non-critical async operations](#12-deferring-non-critical-async-outputs)

2. [Bundle Size Optimization](#2-bundle-size-optimization) — **CRITICAL**
   - 2.1 [Dynamic imports for large components](#21-dynamic-imports-for-large-components)

---

## 1. Eliminating Waterfalls

**Impact: CRITICAL**

Eliminating request waterfalls is the most impactful performance optimization you can make in React and Next.js applications.

### 1.1 Parallel async operations

**Impact: CRITICAL**

...

**Incorrect:**

```typescript
// Sequential fetching creates waterfalls
const userData = await fetch('/api/user').then(r => r.json())
const postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())
```

**Correct:**

```typescript
// Fetch in parallel
const [userData, postsData] = await Promise.all([
  fetch('/api/user').then(r => r.json()),
  fetch('/api/posts').then(r => r.json())
])
```
```

**test-cases.json 结构示例**：

```json
[
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "bad",
    "code": "// Sequential fetching creates waterfalls\nconst userData = await fetch('/api/user').then(r => r.json())\nconst postsData = await fetch(`/api/user/${userData.id}/posts`).then(r => r.json())",
    "language": "typescript",
    "description": "Incorrect example for Parallel async operations"
  },
  {
    "ruleId": "1.1",
    "ruleTitle": "Parallel async operations",
    "type": "good",
    "code": "// Fetch in parallel\nconst [userData, postsData] = await Promise.all([\n  fetch('/api/user').then(r => r.json()),\n  fetch('/api/posts').then(r => r.json())\n])",
    "language": "typescript",
    "description": "Correct example for Parallel async operations"
  }
]
```

### 第 3 步：开发流程（pnpm dev）

**为什么**
开发新规则或修改现有规则时，需要快速迭代、验证并构建整个流程。

运行开发命令：

```bash
pnpm dev
```

**这个命令会**：

1. 执行 `pnpm build-agents`（生成 AGENTS.md）
2. 执行 `pnpm extract-tests`（生成 test-cases.json）
3. 执行 `pnpm validate`（验证所有规则）

**你应该看到**：

```bash
pnpm build-agents && pnpm extract-tests
Building AGENTS.md from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices/AGENTS.md
✓ Built AGENTS.md with 8 sections and 57 rules

Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57

Validating rule files...
Rules directory: /path/to/skills/react-best-practices/rules
✓ All 57 rule files are valid
```

**开发流程建议**：

```bash
# 1. 修改或创建规则文件
vim skills/react-best-practices/rules/my-new-rule.md

# 2. 运行 pnpm dev 快速验证和构建
cd packages/react-best-practices-build
pnpm dev

# 3. 检查生成的 AGENTS.md
cat ../skills/react-best-practices/AGENTS.md

# 4. 测试 Claude 是否正确使用新规则
# （在 Claude Code 中激活技能并测试）
```

**升级版本号**（可选）：

```bash
pnpm build --upgrade-version
```

这会自动：
- 递增 `metadata.json` 中的版本号（如 1.0 → 1.1）
- 更新 `SKILL.md` Front Matter 中的 version 字段

**你应该看到**：

```bash
Upgrading version: 1.0 -> 1.1
✓ Updated metadata.json
✓ Updated SKILL.md
```

### 第 4 步：单独提取测试用例（pnpm extract-tests）

**为什么**
如果你只更新了测试数据的提取逻辑，而不需要重新构建 AGENTS.md，可以单独运行 `extract-tests`。

```bash
pnpm extract-tests
```

**你应该看到**：

```bash
Extracting test cases from rules...
Rules directory: /path/to/skills/react-best-practices/rules
Output file: /path/to/skills/react-best-practices-build/test-cases.json
✓ Extracted 114 test cases to /path/to/skills/react-best-practices-build/test-cases.json
  - Bad examples: 57
  - Good examples: 57
```

---

## 检查点 ✅

现在检查你是否理解了构建工具链：

- [ ] 知道 `pnpm validate` 会验证规则的哪些字段
- [ ] 知道 `pnpm build` 会生成哪些文件
- [ ] 知道 `pnpm dev` 的开发流程
- [ ] 知道 test-cases.json 的用途
- [ ] 知道如何升级版本号（`--upgrade-version`）
- [ ] 知道 AGENTS.md 的结构（章节 → 规则 → 示例）

---

## GitHub Actions CI 集成

### 为什么需要 CI

在团队协作中，CI 可以：
- ✅ 自动验证规则文件格式
- ✅ 自动构建 AGENTS.md
- ✅ 防止提交不符合规范的代码

### CI 配置文件

GitHub Actions 配置位于 `.github/workflows/react-best-practices-ci.yml`：

```yaml
name: React Best Practices CI

on:
  push:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'
  pull_request:
    branches: [main]
    paths:
      - 'skills/react-best-practices/**'
      - 'packages/react-best-practices-build/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: packages/react-best-practices-build
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10.24.0
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
          cache-dependency-path: packages/react-best-practices-build/pnpm-lock.yaml
      - run: pnpm install
      - run: pnpm validate
      - run: pnpm build
```

### CI 触发条件

CI 会在以下情况自动运行：

| 事件           | 条件                                                                                                      |
| -------------- | --------------------------------------------------------------------------------------------------------- |
| `push`         | 提交到 `main` 分支，且修改了 `skills/react-best-practices/**` 或 `packages/react-best-practices-build/**` |
| `pull_request` | 创建或更新 PR 到 `main` 分支，且修改了上述路径                                                            |

### CI 执行步骤

1. **检出代码**：`actions/checkout@v4`
2. **安装 pnpm**：`pnpm/action-setup@v2` (version 10.24.0)
3. **安装 Node.js**：`actions/setup-node@v4` (version 20)
4. **安装依赖**：`pnpm install`（使用 pnpm 缓存加速）
5. **验证规则**：`pnpm validate`
6. **构建文档**：`pnpm build`

如果任何步骤失败，CI 会标记为 ❌ 并阻止合并。

---

## 踩坑提醒

### 坑 1：验证通过但构建失败

**症状**：`pnpm validate` 通过，但 `pnpm build` 报错。

**原因**：验证只检查规则文件格式，不检查 _sections.md 或 metadata.json。

**解决**：
```bash
# 检查 _sections.md 是否存在
ls skills/react-best-practices/rules/_sections.md

# 检查 metadata.json 是否存在
ls skills/react-best-practices/metadata.json

# 查看构建日志中的具体错误
pnpm build 2>&1 | grep -i error
```

### 坑 2：规则 ID 不连续

**症状**：生成的 AGENTS.md 中规则 ID 跳号（如 1.1, 1.3, 1.5）。

**原因**：规则按标题字母排序，不是按文件名排序。

**解决**：
```bash
# 构建会自动按标题排序并分配 ID
# 如果需要自定义顺序，修改规则的 title
# 例如：改为 "A. Parallel"（A 开头会排前面）
pnpm build
```

### 坑 3：test-cases.json 只有 bad 示例

**症状**：`pnpm extract-tests` 输出 "Bad examples: 0"。

**原因**：规则文件中的示例标签不符合规范。

**解决**：
```markdown
# ❌ 错误：标签不规范
**Example:**

**Typo:**

# ✅ 正确：使用 Incorrect 或 Correct
**Incorrect:**

**Correct:**

# 或使用 bad/good 标签（也支持 wrong、usage 等）
**Bad example:**

**Good example:**
```

### 坑 4：CI 中 pnpm validate 失败

**症状**：本地 `pnpm validate` 通过，但 CI 失败。

**原因**：
- Node.js 版本不匹配（CI 用 v20，本地可能用了其他版本）
- pnpm 版本不匹配（CI 用 10.24.0）
- Windows 和 Linux 行尾符差异

**解决**：
```bash
# 检查本地 Node 版本
node --version  # 应该是 v20.x

# 检查本地 pnpm 版本
pnpm --version  # 应该 >= 10.24.0

# 统一行尾符（转换为 LF）
git config core.autocrlf input
git add --renormalize .
git commit -m "Fix line endings"
```

### 坑 5：升级版本号后 SKILL.md 未更新

**症状**：`pnpm build --upgrade-version` 后，`metadata.json` 版本号变了，但 `SKILL.md` 没变。

**原因**：SKILL.md Front Matter 中的 version 格式不匹配。

**解决**：
```yaml
# 检查 SKILL.md Front Matter
---
version: "1.0"  # ✅ 必须有双引号
---

# 如果版本号没有引号，手动添加
---
version: 1.0   # ❌ 错误
version: "1.0" # ✅ 正确（加双引号）
---
```

---

## 本课小结

**核心要点**：

1. **验证（validate）**：检查规则格式、完整性、impact 级别
2. **构建（build）**：解析规则 → 分组 → 排序 → 生成 AGENTS.md
3. **测试提取（extract-tests）**：从 examples 提取 bad/good 示例
4. **开发流程（dev）**：`validate + build + extract-tests` 快速迭代
5. **CI 集成**：GitHub Actions 自动验证和构建，防止提交错误代码

**开发工作流**：

```
修改/创建规则
    ↓
pnpm dev（验证 + 构建 + 提取测试）
    ↓
检查 AGENTS.md 和 test-cases.json
    ↓
提交代码 → CI 自动运行
    ↓
PR 审查 → 合并到 main
```

**最佳实践口诀**：

> 修改先验证，构建再提交
> dev 命令全流程，一步到位效率高
> CI 自动把关，PR 审查更轻松
> 版本号要升级，metadata 记得改

---

## 下一课预告

> 下一课我们学习 **[常见问题排查](../../faq/troubleshooting/)**。
>
> 你将学到：
> - 解决部署网络错误（Network Egress Error）
> - 处理技能未激活问题
> - 排查规则验证失败（VALIDATION_ERROR）
> - 修复框架检测不准确问题
> - 解决文件权限问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能                  | 文件路径                                                                                                                                                                     | 行号    |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| package.json 脚本定义 | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json)                 | 6-12    |
| 构建入口函数          | [`packages/react-best-practices-build/src/build.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/build.ts)                 | 131-290 |
| 规则解析器            | [`packages/react-best-practices-build/src/parser.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/parser.ts)               | 全文    |
| 规则验证函数          | [`packages/react-best-practices-build/src/validate.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/validate.ts)           | 21-66   |
| 测试用例提取          | [`packages/react-best-practices-build/src/extract-tests.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/extract-tests.ts) | 15-38   |
| 路径配置              | [`packages/react-best-practices-build/src/config.ts`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/src/config.ts)               | 全文    |
| GitHub Actions CI     | [`.github/workflows/react-best-practices-ci.yml`](https://github.com/vercel-labs/agent-skills/blob/main/.github/workflows/react-best-practices-ci.yml)                       | 全文    |
| 规则文件模板          | [`skills/react-best-practices/rules/_template.md`](https://github.com/vercel-labs/agent-skills/blob/main/skills/react-best-practices/rules/_template.md)                     | 全文    |

**关键常量** (`config.ts`)：
- `RULES_DIR`: 规则文件目录路径
- `METADATA_FILE`: 元数据文件（metadata.json）路径
- `OUTPUT_FILE`: AGENTS.md 输出路径
- `TEST_CASES_FILE`: 测试用例 JSON 输出路径

**关键函数**：
- `build()`: 主构建函数，解析规则 → 分组 → 排序 → 生成文档
- `validateRule()`: 验证单个规则的完整性（title、explanation、examples、impact）
- `extractTestCases()`: 从规则的 examples 提取 bad/good 测试用例
- `generateMarkdown()`: 从 Section 数组生成 AGENTS.md 内容

**验证规则** (`validate.ts:21-66`)：
- title 非空
- explanation 非空
- 至少包含一个代码示例
- 包含至少一个 "Incorrect/bad" 或 "Correct/good" 示例
- impact 级别合法

**CI 工作流**：
- 触发条件：push/PR 到 main，且修改了 `skills/react-best-practices/**` 或 `packages/react-best-practices-build/**`
- 执行步骤：checkout → 安装 pnpm → 安装 Node.js → pnpm install → pnpm validate → pnpm build

</details>
