---
title: "内置 Skills: 浏览器自动化与 Git | oh-my-opencode"
sidebarTitle: "4 个瑞士军刀技能"
subtitle: "内置 Skills：浏览器自动化、UI/UX 设计与 Git 专家"
description: "学习 oh-my-opencode 的 4 个内置 Skills：playwright、frontend-ui-ux、git-master、dev-browser。掌握浏览器自动化、UI 设计和 Git 操作。"
tags:
  - "skills"
  - "browser-automation"
  - "git"
  - "ui-ux"
prerequisite:
  - "categories-skills"
order: 110
---

# 内置 Skills：浏览器自动化、UI/UX 设计与 Git 专家

## 学完你能做什么

通过本课，你将学会：
- 使用 `playwright` 或 `agent-browser` 进行浏览器自动化测试和数据抓取
- 让代理采用设计师视角，打造精美 UI/UX 界面
- 自动化 Git 操作，包括原子提交、历史搜索和 rebase
- 使用 `dev-browser` 进行持久化的浏览器自动化开发

## 你现在的困境

你是否遇到过这些情况：
- 想测试前端页面，但手动点击太慢，又不会写 Playwright 脚本
- 写完代码后，提交信息乱七八糟，历史一团糟
- 需要设计 UI 界面，但不知道从何入手，做出来的界面缺乏美感
- 需要自动化浏览器操作，但每次都要重新登录认证

**内置 Skills** 就是为你准备的瑞士军刀——每个 Skill 都是特定领域的专家，帮你快速解决这些痛点。

## 什么时候用这一招

| 场景 | 推荐的 Skill | 为什么 |
|--------|--------------|--------|
| 前端 UI 界面需要美观的设计 | `frontend-ui-ux` | 设计师视角，关注排版、色彩、动效 |
| 浏览器测试、截图、爬取数据 | `playwright` 或 `agent-browser` | 完整的浏览器自动化能力 |
| Git 提交、历史搜索、分支管理 | `git-master` | 自动检测提交风格，生成原子提交 |
| 需要多次浏览器操作（保持登录状态） | `dev-browser` | 持久化页面状态，支持复用 |

## 核心思路

**Skill 是什么？**

Skill 是一种机制，向代理注入**专业知识**和**专用工具**。当你使用 `delegate_task` 并指定 `load_skills` 参数时，系统会：
1. 加载 Skill 的 `template` 作为系统提示的一部分
2. 注入 Skill 配置的 MCP 服务器（如果有）
3. 限制可用的工具范围（如果有 `allowedTools`）

**内置 vs 自定义 Skills**

- **内置 Skills**：开箱即用，预配置好提示词和工具
- **自定义 Skills**：你可以在 `.opencode/skills/` 或 `~/.claude/skills/` 目录下创建自己的 SKILL.md

本课重点介绍 4 个内置 Skills，它们覆盖了最常见的开发场景。

## 🎒 开始前的准备

在开始使用内置 Skills 前，请确保：
- [ ] 已完成 [Categories 和 Skills](../categories-skills/) 课程的学习
- [ ] 了解 `delegate_task` 工具的基本用法
- [ ] 浏览器自动化 Skill 需要先启动对应的服务器（Playwright MCP 或 agent-browser）

---

## Skill 1：playwright（浏览器自动化）

### 功能概述

`playwright` Skill 使用 Playwright MCP 服务器，提供完整的浏览器自动化能力：
- 页面导航和交互
- 元素定位和操作（点击、填写表单）
- 截图和 PDF 导出
- 网络请求拦截和模拟

**适用场景**：UI 验证、E2E 测试、网页截图、数据抓取

### 跟我做：验证网站功能

**场景**：你需要验证登录功能是否正常工作。

#### 第 1 步：触发 playwright Skill

在 OpenCode 中输入：

```
使用 playwright 导航到 https://example.com/login，截图显示页面状态
```

**你应该看到**：代理会自动调用 Playwright MCP 工具，打开浏览器并截图。

#### 第 2 步：填写表单并提交

继续输入：

```
使用 playwright 填写用户名和密码字段（user@example.com / password123），然后点击登录按钮，截图显示结果
```

**你应该看到**：代理会自动定位表单元素，填写数据，点击按钮，并返回结果截图。

#### 第 3 步：验证跳转

```
等待页面加载完成后，检查 URL 是否跳转到 /dashboard
```

**你应该看到**：代理报告当前 URL 确认跳转成功。

### 检查点 ✅

- [ ] 浏览器能够成功导航到目标页面
- [ ] 表单填写和点击操作正常执行
- [ ] 截图能够清晰显示页面状态

::: tip 配置说明
默认情况下，浏览器自动化引擎使用 `playwright`。如果你想切换到 `agent-browser`，在 `oh-my-opencode.json` 中配置：

```json
{
  "browser_automation_engine": {
    "provider": "agent-browser"
  }
}
```
:::

---

## Skill 2：frontend-ui-ux（设计师视角）

### 功能概述

`frontend-ui-ux` Skill 将代理转变为"设计师转开发者"的角色：
- 关注**排版、色彩、动效**等视觉细节
- 强调**大胆的美学方向**（极简、极繁、复古未来主义等）
- 提供**设计原则**：避免通用字体（Inter、Roboto、Arial），创建独特配色方案

**适用场景**：UI 组件设计、界面美化、视觉系统搭建

### 跟我做：设计精美的仪表盘

**场景**：你需要设计一个数据统计仪表盘，但没有设计稿。

#### 第 1 步：启用 frontend-ui-ux Skill

```
使用 frontend-ui-ux 技能，设计一个数据统计仪表盘页面
要求：包含 3 个数据卡片（用户数、收入、订单数），使用现代设计风格
```

**你应该看到**：代理会先进行"设计规划"，确定目的、基调、约束和差异化点。

#### 第 2 步：明确美学方向

代理会问你（或在内部确定）设计风格。例如：

```
**美学方向选择**：
- 极简主义（Minimalist）
- 极繁主义（Maximalist）
- 复古未来主义（Retro-futuristic）
- 精致奢华（Luxury/Refined）
```

回答：**极简主义**

**你应该看到**：代理根据你选择的方向，生成设计规范（字体、色彩、间距）。

#### 第 3 步：生成代码

```
基于上面的设计规范，使用 React + Tailwind CSS 实现这个仪表盘页面
```

**你应该看到**：
- 精心设计的排版和间距
- 鲜明但和谐的配色（不是常见的紫色渐变）
- 微妙的动效和过渡效果

### 检查点 ✅

- [ ] 页面采用了独特的设计风格，不是通用的"AI slop"
- [ ] 字体选择有特色，避免使用 Inter/Roboto/Arial
- [ ] 配色方案 cohesive，有清晰的视觉层级

::: tip 与普通代理的区别
普通代理可能写出的代码功能正确，但界面缺乏美感。`frontend-ui-ux` Skill 的核心价值在于：
- 强调设计过程（规划 > 编码）
- 提供明确的美学指导
- 警告反模式（通用设计、紫色渐变）
:::

---

## Skill 3：git-master（Git 专家）

### 功能概述

`git-master` Skill 是一个集成了三种专业能力的 Git 专家：
1. **提交架构师**：原子提交、依赖顺序、风格检测
2. **Rebase 外科医生**：历史重写、冲突解决、分支清理
3. **历史考古学家**：查找何时/何地引入了特定更改

**核心原则**：默认创建**多个提交**，拒绝"一个提交包含多个文件"的懒惰行为。

**适用场景**：代码提交、历史搜索、分支管理、rebase 操作

### 跟我做：智能提交代码

**场景**：你修改了 5 个文件，需要提交代码。

#### 第 1 步：触发 git-master Skill（推荐使用 quick category）

```
使用 delegate_task(category='quick', load_skills=['git-master']) 提交当前的代码更改
```

**为什么使用 `quick` category？**
- Git 操作不需要复杂推理
- `claude-haiku-4-5` 模型足够快速处理
- 节省成本（Haiku 比 Opus 便宜 10 倍）

**你应该看到**：代理执行并行分析（Phase 0），包括：
- `git status` 和 `git diff --stat`
- 最近 30 条提交日志（用于风格检测）
- 当前分支状态

#### 第 2 步：风格检测（Phase 1）

代理会输出：

```
STYLE DETECTION RESULT
======================
Analyzed: 30 commits from git log

Language: ENGLISH
  - English commits: 28 (93%)
  
Style: SEMANTIC
  - Semantic (feat:, fix:, etc.): 25 (83%)
  - Plain: 3 (10%)
  
Reference examples from repo:
  1. "feat: add user authentication"
  2. "fix: resolve database connection issue"
  3. "refactor: extract validation logic"

All commits will follow: ENGLISH + SEMANTIC
```

**你应该看到**：代理明确告诉你将使用的提交风格和语言。

#### 第 3 步：规划原子提交（Phase 3）

代理会分析文件变化，并输出：

```
COMMIT PLAN
===========
Files changed: 5
Minimum commits required: ceil(5/3) = 2
Planned commits: 3
Status: 3 >= 2 (PASS)

COMMIT 1: feat: add authentication service
  - src/services/auth.ts
  - src/types/auth.ts
  Justification: service implementation + its type definitions

COMMIT 2: feat: implement login page
  - src/pages/login.tsx
  - src/components/login-form.tsx
  Justification: page and its components

COMMIT 3: feat: add API endpoint
  - src/api/auth.ts
  - tests/auth.test.ts
  Justification: API endpoint + its test

Execution order: Commit 1 -> Commit 2 -> Commit 3
```

**你应该看到**：代理明确拆分提交，并解释为什么这些文件必须在一起。

#### 第 4 步：执行提交（Phase 5）

代理会自动执行：
```bash
git add src/services/auth.ts src/types/auth.ts
git commit -m "feat: add authentication service"

git add src/pages/login.tsx src/components/login-form.tsx
git commit -m "feat: implement login page"

git add src/api/auth.ts tests/auth.test.ts
git commit -m "feat: add API endpoint"
```

**你应该看到**：
- 3 个独立的提交，每个都有明确的语义化消息
- 工作目录干净（`git status` 无未提交文件）

### 检查点 ✅

- [ ] 代理进行了风格检测，并明确告知
- [ ] 提交数量满足"最小提交数"规则（文件数 / 3，向上取整）
- [ ] 每个提交消息符合检测到的风格（语义化、普通描述等）
- [ ] 测试文件与实现文件在同一提交中

::: tip 历史搜索功能
`git-master` 还支持强大的历史搜索：

- "when was X added" → `git log -S`（pickaxe 搜索）
- "who wrote this line" → `git blame`
- "when did bug start" → `git bisect`
- "find commits changing X pattern" → `git log -G`（regex 搜索）

示例：`使用 git-master 查找 'calculate_discount' 函数是在哪个提交中添加的`
:::

::: warning 反模式：单个大提交
`git-master` 的强制规则是：

| 文件数量 | 最少提交数 |
|---------|-----------|
| 3+ 文件 | 2+ 提交 |
| 5+ 文件 | 3+ 提交 |
| 10+ 文件 | 5+ 提交 |

如果代理尝试 1 次提交多个文件，会自动失败并重新规划。
:::

---

## Skill 4：dev-browser（开发者浏览器）

### 功能概述

`dev-browser` Skill 提供持久化的浏览器自动化能力：
- **页面状态持久化**：多次脚本执行之间保持登录状态
- **ARIA Snapshot**：自动发现页面元素，返回带引用（`@e1`, `@e2`）的树结构
- **双模式支持**：
  - **Standalone 模式**：启动新的 Chromium 浏览器
  - **Extension 模式**：连接到用户的现有 Chrome 浏览器

**适用场景**：需要多次浏览器操作（保持登录状态）、复杂的工作流自动化

### 跟我做：编写登录后操作的脚本

**场景**：你需要自动化登录后的一系列操作，并保持会话状态。

#### 第 1 步：启动 dev-browser 服务器

**macOS/Linux**：
```bash
cd skills/dev-browser && ./server.sh &
```

**Windows (PowerShell)**：
```powershell
cd skills/dev-browser
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "server.js"
```

**你应该看到**：控制台输出 `Ready` 消息。

#### 第 2 步：编写登录脚本

在 OpenCode 中输入：

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**你应该看到**：浏览器打开登录页面，并输出页面标题和 URL。

#### 第 3 步：添加表单填写操作

修改脚本：

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();
const page = await client.page("login", { viewport: { width: 1920, height: 1080 } });

await page.goto("https://example.com/login");
await waitForPageLoad(page);

// 获取 ARIA snapshot
const snapshot = await client.getAISnapshot("login");
console.log(snapshot);

// 选择并填写表单（根据 snapshot 中的 ref）
await client.fill("input[name='username']", "user@example.com");
await client.fill("input[name='password']", "password123");
await client.click("button[type='submit']");

await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url(),
  loggedIn: page.url().includes("/dashboard")
});

await client.disconnect();
EOF
```

**你应该看到**：
- 输出 ARIA Snapshot（显示页面元素和引用）
- 表单自动填写并提交
- 页面跳转到 dashboard（验证登录成功）

#### 第 4 步：复用登录状态

现在编写第二个脚本，操作需要登录的页面：

```bash
cd skills/dev-browser && npx tsx <<'EOF'
import { connect, waitForPageLoad } from "@/client.js";

const client = await connect();

// 复用之前创建的 "login" 页面（会话已保存）
const page = await client.page("login");

// 直接访问需要登录的页面
await page.goto("https://example.com/settings");
await waitForPageLoad(page);

console.log({
  title: await page.title(),
  url: page.url()
});

await client.disconnect();
EOF
```

**你应该看到**：页面直接跳转到设置页面，无需重新登录（因为会话状态已保存）。

### 检查点 ✅

- [ ] dev-browser 服务器成功启动并显示 `Ready`
- [ ] ARIA Snapshot 能够正确发现页面元素
- [ ] 登录后的会话状态能够跨脚本复用
- [ ] 多次脚本执行之间无需重新登录

::: tip playwright vs dev-browser 的区别

| 特性 | playwright | dev-browser |
|------|-----------|-------------|
| **会话持久化** | ❌ 每次新会话 | ✅ 跨脚本保存 |
| **ARIA Snapshot** | ❌ 使用 Playwright API | ✅ 自动生成引用 |
| **Extension 模式** | ❌ 不支持 | ✅ 连接用户浏览器 |
| **适用场景** | 单次操作、测试 | 多次操作、复杂工作流 |
:::

---

## 最佳实践

### 1. 选择合适的 Skill

根据任务类型选择 Skill：

| 任务类型 | 推荐组合 |
|---------|-----------|
| 快速 Git 提交 | `delegate_task(category='quick', load_skills=['git-master'])` |
| UI 界面设计 | `delegate_task(category='visual-engineering', load_skills=['frontend-ui-ux'])` |
| 浏览器验证 | `delegate_task(category='quick', load_skills=['playwright'])` |
| 复杂浏览器工作流 | `delegate_task(category='quick', load_skills=['dev-browser'])` |

### 2. 组合多个 Skills

你可以同时加载多个 Skills：

```typescript
delegate_task(
  category="quick",
  load_skills=["git-master", "playwright"],
  prompt="测试登录功能，完成后提交代码"
)
```

### 3. 避免常见错误

::: warning 警告

- ❌ **错误**：使用 `git-master` 时手动指定提交消息
  - ✅ **正确**：让 `git-master` 自动检测并生成符合项目风格的提交消息

- ❌ **错误**：使用 `frontend-ui-ux` 时要求"普通就好"
  - ✅ **正确**：让代理充分发挥设计师能力，创造独特设计

- ❌ **错误**：在 `dev-browser` 脚本中使用 TypeScript 类型注解
  - ✅ **正确**：`page.evaluate()` 中使用纯 JavaScript（浏览器不识别 TS 语法）
:::

---

## 本课小结

本课介绍了 4 个内置 Skills：

| Skill | 核心价值 | 典型场景 |
|-------|-----------|---------|
| **playwright** | 完整的浏览器自动化 | UI 测试、截图、爬虫 |
| **frontend-ui-ux** | 设计师视角，美观优先 | UI 组件设计、界面美化 |
| **git-master** | 自动化 Git 操作，原子提交 | 代码提交、历史搜索 |
| **dev-browser** | 持久化会话，复杂工作流 | 多次浏览器操作 |

**核心要点**：
1. **Skill = 专业知识 + 工具**：向代理注入特定领域的最佳实践
2. **组合使用**：`delegate_task(category=..., load_skills=[...])` 实现精确匹配
3. **成本优化**：简单任务使用 `quick` category，避免使用昂贵模型
4. **反模式警告**：每个 Skill 都有明确的"不要做什么"指导

---

## 下一课预告

> 下一课我们学习 **[生命周期钩子](../lifecycle-hooks/)**。
>
> 你会学到：
> - 32 个生命周期钩子的作用和执行顺序
> - 如何自动化上下文注入和错误恢复
> - 常用钩子的配置方法（todo-continuation-enforcer、keyword-detector 等）

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| playwright Skill 定义 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 4-16 |
| agent-browser Skill 定义 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 18-313 |
| frontend-ui-ux Skill 定义 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 315-391 |
| git-master Skill 定义 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 393-1497 |
| dev-browser Skill 定义 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1499-1717 |
| createBuiltinSkills 函数 | [`src/features/builtin-skills/skills.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/skills.ts) | 1723-1729 |
| BuiltinSkill 类型定义 | [`src/features/builtin-skills/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/features/builtin-skills/types.ts) | 3-16 |
| 内置 Skills 加载逻辑 | [`src/index.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/index.ts) | 51, 311-319 |
| 浏览器引擎配置 | [`src/config/schema.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/config/schema.ts) | - |

**关键配置**：
- `browser_automation_engine.provider`: 浏览器自动化引擎（默认 `playwright`，可选 `agent-browser`）
- `disabled_skills`: 禁用的 Skill 列表

**关键函数**：
- `createBuiltinSkills(options)`: 根据浏览器引擎配置返回对应的 Skills 数组

</details>
