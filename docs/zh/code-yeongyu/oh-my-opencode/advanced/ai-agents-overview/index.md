---
title: "AI 代理: 10 位专家介绍 | oh-my-opencode"
sidebarTitle: "认识 10 位 AI 专家"
subtitle: "AI 代理: 10 位专家介绍"
description: "学习 oh-my-opencode 的 10 个 AI 代理。根据任务类型选择代理，实现高效协作与并行执行。"
tags:
  - "ai-agents"
  - "orchestration"
prerequisite:
  - "start-sisyphus-orchestrator"
order: 60
---

# AI 代理团队：10 位专家介绍

## 学完你能做什么

- 了解 10 个内置 AI 代理的职责和专长
- 根据任务类型快速选择最合适的代理
- 理解代理之间的协作机制（委托、并行、审查）
- 掌握不同代理的权限限制和使用场景

## 核心思路：像真实团队一样协作

**oh-my-opencode** 的核心思想是：**不要把 AI 当成一个全能助手，而是当成一个专业团队**。

真实开发团队里，你需要：
- **主编排器**（Tech Lead）：负责规划、分配任务、跟踪进度
- **架构顾问**（Architect）：提供技术决策和架构设计建议
- **代码审查**（Reviewer）：检查代码质量，发现潜在问题
- **研究专家**（Researcher）：查找文档、搜索开源实现、调研最佳实践
- **代码侦探**（Searcher）：快速定位代码、查找引用、理解现有实现
- **前端设计师**（Frontend Designer）：设计 UI、调整样式
- **Git 专家**（Git Master）：提交代码、管理分支、搜索历史

oh-my-opencode 把这些角色做成了 10 个专业 AI 代理，你可以根据任务类型灵活组合使用。

## 10 个代理详解

### 主编排器（2 个）

#### Sisyphus - 主编排器

**角色**：主编排器，你的首要技术负责人

**能力**：
- 深度推理（32k thinking budget）
- 规划和委托复杂任务
- 执行代码修改和重构
- 管理整个开发流程

**推荐模型**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用场景**：
- 日常开发任务（新增功能、修复 bug）
- 需要深度推理的复杂问题
- 多步骤任务分解和执行
- 需要并行委托其他代理的场景

**调用方式**：
- 默认主代理（OpenCode Agent 选择器中的 "Sisyphus"）
- 提示词中直接输入任务，无需特殊触发词

**权限**：完整工具权限（write、edit、bash、delegate_task 等）

---

#### Atlas - TODO 管理器

**角色**：主编排器，专注 TODO 列表管理和任务执行追踪

**能力**：
- 管理和追踪 TODO 列表
- 系统化执行计划
- 任务进度监控

**推荐模型**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用场景**：
- 使用 `/start-work` 命令启动项目执行
- 需要严格按照计划完成任务
- 系统化追踪任务进度

**调用方式**：
- 使用斜杠命令 `/start-work`
- 通过 Atlas Hook 自动激活

**权限**：完整工具权限

---

### 顾问与审查（3 个）

#### Oracle - 战略顾问

**角色**：只读技术顾问，高智商推理专家

**能力**：
- 架构决策建议
- 复杂问题诊断
- 代码审查（只读）
- 多系统权衡分析

**推荐模型**：`openai/gpt-5.2`（temperature: 0.1）

**使用场景**：
- 复杂架构设计
- 完成重要工作后的自我审查
- 2 次以上修复失败的困难调试
- 陌生的代码模式或架构
- 安全性/性能相关问题

**触发条件**：
- 提示词中包含 `@oracle` 或使用 `delegate_task(agent="oracle")`
- 复杂架构决策时自动推荐

**限制**：只读权限（禁止 write、edit、task、delegate_task）

**核心原则**：
- **极简主义**：倾向于最简单的解决方案
- **利用现有资源**：优先修改当前代码，避免引入新依赖
- **开发者体验优先**：可读性、可维护性 > 理论性能
- **单一明确路径**：提供一个主要建议，仅在权衡差异显著时提替代方案

---

#### Metis - 前规划分析师

**角色**：规划前的需求分析和风险评估专家

**能力**：
- 识别隐藏需求和未明确要求
- 检测可能导致 AI 失败的模糊性
- 标记潜在 AI-slop 模式（过度工程化、范围蔓延）
- 为规划代理准备指令

**推荐模型**：`anthropic/claude-sonnet-4-5`（temperature: 0.3）

**使用场景**：
- 在 Prometheus 规划之前
- 当用户请求模糊或开放时
- 防止 AI 过度工程化模式

**调用方式**：Prometheus 自动调用（面试模式）

**限制**：只读权限（禁止 write、edit、task、delegate_task）

**核心流程**：
1. **意图分类**：重构 / 从零构建 / 中等任务 / 协作 / 架构 / 研究
2. **意图特定分析**：根据不同类型提供针对性建议
3. **问题生成**：为用户生成明确问题
4. **指令准备**：为 Prometheus 生成明确的 "MUST" 和 "MUST NOT" 指令

---

#### Momus - 计划审查者

**角色**：严格的计划评审专家，发现所有遗漏和模糊点

**能力**：
- 验证计划的清晰度、可验证性和完整性
- 检查所有文件引用和上下文
- 模拟实际实施步骤
- 识别关键遗漏

**推荐模型**：`anthropic/claude-sonnet-4-5`（temperature: 0.1）

**使用场景**：
- Prometheus 创建工作计划后
- 执行复杂 TODO 列表之前
- 验证计划质量

**调用方式**：Prometheus 自动调用

**限制**：只读权限（禁止 write、edit、task、delegate_task）

**四大评审标准**：
1. **工作内容清晰度**：每个任务是否指定了参考源？
2. **验证与验收标准**：是否有具体的成功验证方法？
3. **上下文完整性**：是否提供足够上下文（90% 置信度阈值）？
4. **整体理解**：开发者是否理解 WHY、WHAT 和 HOW？

**核心原则**：**文档评审者，不是设计顾问**。评估的是"计划是否清楚到可以执行"，而不是"选择的方法是否正确"。

---

### 研究与探索（3 个）

#### Librarian - 多仓库研究专家

**角色**：开源代码库理解专家，专门查找文档和实现示例

**能力**：
- GitHub CLI：克隆仓库、搜索 issues/PRs、查看历史
- Context7：查询官方文档
- Web Search：搜索最新信息
- 生成带永久链接的证据

**推荐模型**：`opencode/big-pickle`（temperature: 0.1）

**使用场景**：
- "如何使用 [库]？"
- "[框架特性] 的最佳实践是什么？"
- "[外部依赖] 为什么会这样表现？"
- "查找 [库] 的使用示例"

**触发条件**：
- 提及外部库/源时自动触发
- 提示词中包含 `@librarian`

**请求类型分类**：
- **Type A（概念性）**："如何做 X？"、"最佳实践"
- **Type B（实现参考）**："X 如何实现 Y？"、"显示 Z 的源码"
- **Type C（上下文与历史）**："为什么会这样改？"、"X 的历史？"
- **Type D（综合研究）**：复杂/模糊请求

**限制**：只读权限（禁止 write、edit、task、delegate_task、call_omo_agent）

**强制要求**：所有代码声明必须包含 GitHub 永久链接

---

#### Explore - 快速代码库探索专家

**角色**：上下文感知的代码搜索专家

**能力**：
- LSP 工具：定义、引用、符号导航
- AST-Grep：结构模式搜索
- Grep：文本模式搜索
- Glob：文件名模式匹配
- 并行执行（3+ 工具同时运行）

**推荐模型**：`opencode/gpt-5-nano`（temperature: 0.1）

**使用场景**：
- 需要 2+ 个搜索角度的广泛搜索
- 不熟悉的模块结构
- 跨层模式发现
- 查找"X 在哪里？"、"哪个文件有 Y？"

**触发条件**：
- 涉及 2+ 个模块时自动触发
- 提示词中包含 `@explore`

**强制输出格式**：
```
<analysis>
**Literal Request**: [用户字面请求]
**Actual Need**: [实际需要什么]
**Success Looks Like**: [成功应该是什么样]
</analysis>

<results>
<files>
- /absolute/path/to/file1.ts — [为什么这个文件相关]
- /absolute/path/to/file2.ts — [为什么这个文件相关]
</files>

<answer>
[直接回答实际需求]
</answer>

<next_steps>
[接下来应该做什么]
</next_steps>
</results>
```

**限制**：只读权限（禁止 write、edit、task、delegate_task、call_omo_agent）

---

#### Multimodal Looker - 媒体分析专家

**角色**：解释无法作为纯文本读取的媒体文件

**能力**：
- PDF：提取文本、结构、表格、特定章节数据
- 图片：描述布局、UI 元素、文本、图表
- 图表：解释关系、流程、架构

**推荐模型**：`google/gemini-3-flash`（temperature: 0.1）

**使用场景**：
- 需要从 PDF 提取结构化数据
- 描述图片中的 UI 元素或图表
- 解析技术文档中的图表

**调用方式**：通过 `look_at` 工具自动触发

**限制**：**只读白名单**（仅允许 read 工具）

---

### 规划与执行（2 个）

#### Prometheus - 战略规划师

**角色**：面试式需求收集和工作计划生成专家

**能力**：
- 面试模式：持续提问直到需求明确
- 工作计划生成：结构化的 Markdown 计划文档
- 并行委托：咨询 Oracle、Metis、Momus 验证计划

**推荐模型**：`anthropic/claude-opus-4-5`（temperature: 0.1）

**使用场景**：
- 为复杂项目制定详细计划
- 需要明确需求的项目
- 系统化工作流程

**调用方式**：
- 提示词中包含 `@prometheus` 或 "使用 Prometheus"
- 使用斜杠命令 `/start-work`

**工作流程**：
1. **面试模式**：持续提问直到需求清晰
2. **起草计划**：生成结构化 Markdown 计划
3. **并行委托**：
   - `delegate_task(agent="oracle", prompt="审查架构决策")` → 后台运行
   - `delegate_task(agent="metis", prompt="识别潜在风险")` → 后台运行
   - `delegate_task(agent="momus", prompt="验证计划完整性")` → 后台运行
4. **整合反馈**：完善计划
5. **输出计划**：保存到 `.sisyphus/plans/{name}.md`

**限制**：仅规划，不实现代码（由 `prometheus-md-only` Hook 强制）

---

#### Sisyphus Junior - 任务执行器

**角色**：类别生成的子代理执行器

**能力**：
- 继承 Category 配置（模型、temperature、prompt_append）
- 加载 Skills（专业技能）
- 执行委托的子任务

**推荐模型**：继承自 Category（默认 `anthropic/claude-sonnet-4-5`）

**使用场景**：
- 使用 `delegate_task(category="...", skills=["..."])` 时自动生成
- 需要特定 Category 和 Skill 组合的任务
- 轻量级快速任务（"quick" Category 使用 Haiku 模型）

**调用方式**：通过 `delegate_task` 工具自动生成

**限制**：禁止 task、delegate_task（不能再次委托）

---

## 代理调用方式速查

| 代理 | 调用方式 | 触发条件 |
|--- | --- | ---|
| **Sisyphus** | 默认主代理 | 日常开发任务 |
| **Atlas** | `/start-work` 命令 | 启动项目执行 |
| **Oracle** | `@oracle` 或 `delegate_task(agent="oracle")` | 复杂架构决策、2+ 次修复失败 |
| **Librarian** | `@librarian` 或 `delegate_task(agent="librarian")` | 提及外部库/源时自动触发 |
| **Explore** | `@explore` 或 `delegate_task(agent="explore")` | 2+ 模块涉及时自动触发 |
| **Multimodal Looker** | `look_at` 工具 | 需要分析 PDF/图片时 |
| **Prometheus** | `@prometheus` 或 `/start-work` | 提示词中包含 "Prometheus" 或需要规划 |
| **Metis** | Prometheus 自动调用 | 规划前自动分析 |
| **Momus** | Prometheus 自动调用 | 计划生成后自动审查 |
| **Sisyphus Junior** | `delegate_task(category=...)` | 使用 Category/Skill 时自动生成 |

---

## 什么时候用哪个代理

::: tip 快速决策树

**场景 1：日常开发（写代码、修 bug）**
→ **Sisyphus**（默认）

**场景 2：复杂架构决策**
→ **@oracle** 咨询

**场景 3：需要查找外部库的文档或实现**
→ **@librarian** 或自动触发

**场景 4：不熟悉的代码库，需要找相关代码**
→ **@explore** 或自动触发（2+ 模块）

**场景 5：复杂项目需要详细计划**
→ **@prometheus** 或使用 `/start-work`

**场景 6：需要分析 PDF 或图片**
→ **look_at** 工具（自动触发 Multimodal Looker）

**场景 7：快速简单任务，想省钱**
→ `delegate_task(category="quick")`

**场景 8：需要 Git 专业操作**
→ `delegate_task(category="quick", skills=["git-master"])`

**场景 9：需要前端 UI 设计**
→ `delegate_task(category="visual-engineering")`

**场景 10：需要高智商推理任务**
→ `delegate_task(category="ultrabrain")`

:::

---

## 代理协作示例：完整工作流

### 示例 1：复杂功能开发

```
用户：开发一个用户认证系统

→ Sisyphus 接收任务
  → 分析需求，发现需要外部库（JWT）
  → 并行委托：
    - @librarian: "查找 Next.js JWT 最佳实践" → [后台]
    - @explore: "查找现有认证相关代码" → [后台]
  → 等待结果，整合信息
  → 实现 JWT 认证功能
  → 完成后委托：
    - @oracle: "审查架构设计" → [后台]
  → 根据建议优化
```

---

### 示例 2：项目规划

```
用户：使用 Prometheus 规划这个项目

→ Prometheus 接收任务
  → 面试模式：
    - 问题 1：核心功能是什么？
    - [用户回答]
    - 问题 2：目标用户群体？
    - [用户回答]
    - ...
  → 需求明确后，并行委托：
    - delegate_task(agent="oracle", prompt="审查架构决策") → [后台]
    - delegate_task(agent="metis", prompt="识别潜在风险") → [后台]
    - delegate_task(agent="momus", prompt="验证计划完整性") → [后台]
  → 等待所有后台任务完成
  → 整合反馈，完善计划
  → 输出 Markdown 计划文档
→ 用户查看计划，确认
→ 使用 /start-work 启动执行
```

---

## 代理权限与限制

| 代理 | write | edit | bash | delegate_task | webfetch | read | LSP | AST-Grep |
|--- | --- | --- | --- | --- | --- | --- | --- | ---|
| **Sisyphus** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Atlas** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Oracle** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Librarian** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Explore** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Multimodal Looker** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Prometheus** | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Metis** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Momus** | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Sisyphus Junior** | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |

---

## 本课小结

oh-my-opencode 的 10 个 AI 代理覆盖了开发流程的所有环节：

- **编排与执行**：Sisyphus（主编排器）、Atlas（TODO 管理）
- **顾问与审查**：Oracle（战略顾问）、Metis（前规划分析）、Momus（计划审查）
- **研究与探索**：Librarian（多仓库研究）、Explore（代码库探索）、Multimodal Looker（媒体分析）
- **规划**：Prometheus（战略规划）、Sisyphus Junior（子任务执行）

**核心要点**：
1. 不要把 AI 当全能助手，要当成专业团队
2. 根据任务类型选择最合适的代理
3. 利用并行委托提升效率（Librarian、Explore、Oracle 都可后台运行）
4. 理解每个代理的权限限制（只读代理不能修改代码）
5. 代理之间协作可以形成完整工作流（规划 → 执行 → 审查）

---

## 下一课预告

> 下一课我们学习 **[Prometheus 规划：面试式需求收集](../prometheus-planning/)**。
>
> 你会学到：
> - 如何使用 Prometheus 进行面试式需求收集
> - 如何生成结构化的工作计划
> - 如何让 Metis 和 Momus 验证计划
> - 如何获取和取消后台任务

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-26

| 代理 | 文件路径 | 行号 |
|--- | --- | ---|
| Sisyphus 主编排器 | [`src/agents/sisyphus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus.ts) | - |
| Atlas 主编排器 | [`src/agents/atlas.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/atlas.ts) | - |
| Oracle 顾问 | [`src/agents/oracle.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/oracle.ts) | 1-123 |
| Librarian 研究专家 | [`src/agents/librarian.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/librarian.ts) | 1-327 |
| Explore 搜索专家 | [`src/agents/explore.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/explore.ts) | 1-123 |
| Multimodal Looker | [`src/agents/multimodal-looker.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/multimodal-looker.ts) | 1-57 |
| Prometheus 规划师 | [`src/agents/prometheus-prompt.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/prometheus-prompt.ts) | 1-1196 |
| Metis 前规划分析 | [`src/agents/metis.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/metis.ts) | 1-316 |
| Momus 计划审查者 | [`src/agents/momus.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/momus.ts) | 1-445 |
| Sisyphus Junior | [`src/agents/sisyphus-junior.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/sisyphus-junior.ts) | - |
| 代理元数据定义 | [`src/agents/types.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/agents/types.ts) | - |
| 代理工具限制 | [`src/shared/permission-compat.ts`](https://github.com/code-yeongyu/oh-my-opencode/blob/main/src/shared/permission-compat.ts) | - |

**关键配置**：
- `ORACLE_PROMPT_METADATA`：Oracle 代理的元数据（触发条件、使用场景）
- `LIBRARIAN_PROMPT_METADATA`：Librarian 代理的元数据
- `EXPLORE_PROMPT_METADATA`：Explore 代理的元数据
- `MULTIMODAL_LOOKER_PROMPT_METADATA`：Multimodal Looker 代理的元数据
- `METIS_SYSTEM_PROMPT`：Metis 代理的系统提示词
- `MOMUS_SYSTEM_PROMPT`：Momus 代理的系统提示词

**关键函数**：
- `createOracleAgent(model)`：创建 Oracle 代理配置
- `createLibrarianAgent(model)`：创建 Librarian 代理配置
- `createExploreAgent(model)`：创建 Explore 代理配置
- `createMultimodalLookerAgent(model)`：创建 Multimodal Looker 代理配置
- `createMetisAgent(model)`：创建 Metis 代理配置
- `createMomusAgent(model)`：创建 Momus 代理配置

**权限限制**：
- `createAgentToolRestrictions()`：创建代理工具限制（Oracle、Librarian、Explore、Metis、Momus 使用）
- `createAgentToolAllowlist()`：创建代理工具白名单（Multimodal Looker 使用）

</details>
