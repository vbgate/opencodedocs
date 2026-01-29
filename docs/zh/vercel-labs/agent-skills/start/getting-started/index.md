---
title: "Agent Skills 入门: 扩展 AI 编码代理能力 | Agent Skills"
sidebarTitle: "扩展 AI 能力"
subtitle: "Agent Skills 入门: 扩展 AI 编码代理能力"
description: "学习 Agent Skills 的核心功能和使用方法。了解如何扩展 Claude、Cursor 等 AI 编码代理能力，掌握 React 性能优化、Web 设计指南和一键部署三大技能包。"
tags:
  - "入门"
  - "AI 编码代理"
  - "Claude"
  - "技能包"
order: 10
prerequisite: []
---

# Agent Skills 入门

## 学完你能做什么

- 理解 Agent Skills 是什么，以及它如何扩展 AI 编码代理的能力
- 了解三大核心技能包的功能和使用场景
- 知道什么时候适合使用 Agent Skills 来提升开发效率

## 你现在的困境

你日常使用 Claude、Cursor 或其他 AI 编码代理时，可能会遇到这些问题：
- 希望遵循最佳实践，但不知道该记住哪些规则
- 经常重复类似的部署操作，希望自动化
- AI 生成的代码质量参差不齐，缺少统一标准

## 核心思路

**Agent Skills 是技能包系统**——为 AI 编码代理提供可扩展的「插件」。每个技能包含：

- **SKILL.md**：技能定义文件，告诉 AI 代理什么时候激活该技能
- **scripts/**：辅助脚本（如部署脚本），执行具体任务
- **references/**：辅助文档（可选），提供详细参考资料

::: tip 设计理念
技能采用**按需加载**机制：只有技能名称和描述在启动时加载，完整内容在 AI 判断需要时才读取。这样可以减少上下文占用，提高效率。
:::

## 可用的技能包

项目提供三大技能包，每个都针对特定场景：

### react-best-practices

React 和 Next.js 性能优化指南，来自 Vercel Engineering 标准。包含 50+ 条规则，按影响级别排序。

**使用场景**：
- 编写新的 React 组件或 Next.js 页面
- 审查代码性能问题
- 优化包大小或加载时间

**覆盖类别**：
- 消除瀑布（Critical）
- 包大小优化（Critical）
- 服务端性能（High）
- 客户端数据获取（Medium-High）
- Re-render 优化（Medium）
- 渲染性能（Medium）
- JavaScript 微优化（Low-Medium）
- 高级模式（Low）

### web-design-guidelines

Web 界面设计指南审计，检查代码是否符合近百条最佳实践。

**使用场景**：
- 提示词："Review my UI"
- 检查可访问性（Accessibility）
- 审计设计一致性
- 检查性能和 UX

**覆盖类别**：
- 可访问性（aria-labels、语义化 HTML、键盘处理）
- Focus 状态（可见焦点、focus-visible 模式）
- 表单（自动完成、验证、错误处理）
- 动画（prefers-reduced-motion、合成友好的变换）
- 图片（尺寸、懒加载、alt 文本）
- 排版、性能、导航等

### vercel-deploy-claimable

一键部署应用和网站到 Vercel，返回预览链接和所有权转移链接。

**使用场景**：
- 提示词："Deploy my app"
- 快速分享项目预览
- 无需配置，零认证部署

**核心特性**：
- 自动检测 40+ 种框架（Next.js、Vite、Astro 等）
- 返回预览 URL（实时站点）和 claim URL（转移所有权）
- 自动处理静态 HTML 项目
- 上传时排除 `node_modules` 和 `.git`

## 技能的工作原理

当你使用 Claude 或其他 AI 代理时，技能激活流程如下：

```mermaid
graph LR
    A[用户输入任务] --> B[AI 检测关键词<br/>如 Deploy, Review, Optimize]
    B --> C[匹配技能描述]
    C --> D[加载 SKILL.md 完整内容]
    D --> E[执行脚本或应用规则]
    E --> F[输出结果给用户]
```

**示例流程**：

1. **用户输入**："Deploy my app"
2. **AI 检测**：识别关键词 "Deploy"，匹配 `vercel-deploy` 技能
3. **加载技能**：读取 `SKILL.md` 完整内容
4. **执行部署**：
   - 运行 `deploy.sh` 脚本
   - 检测框架（读取 package.json）
   - 打包项目为 tarball
   - 上传到 Vercel API
5. **返回结果**：
   ```json
   {
     "previewUrl": "https://skill-deploy-abc123.vercel.app",
     "claimUrl": "https://vercel.com/claim-deployment?code=..."
   }
   ```

## 什么时候用这一招

使用 Agent Skills 的最佳时机：

| 场景              | 使用的技能              | 触发提示词示例                                       |
|--- | --- | ---|
| 编写 React 组件   | react-best-practices    | "Review this React component for performance issues" |
| 优化 Next.js 页面 | react-best-practices    | "Help me optimize this Next.js page"                 |
| 检查 UI 质量      | web-design-guidelines   | "Check accessibility of my site"                     |
| 部署项目          | vercel-deploy-claimable | "Deploy my app to production"                        |

## 安全模型

::: info 安全说明
- **本地运行**：所有技能在本地执行，无数据上传至第三方服务（Vercel 部署 API 除外）
- **按需激活**：技能仅在 AI 判断相关时加载详细内容，减少隐私泄露风险
- **开源透明**：所有技能和脚本开源可审计
:::

## 踩坑提醒

### 技能未激活

如果技能没有被激活，检查：
- 提示词是否包含足够的关键词（如 "Deploy"、"Review"）
- 技能是否正确安装到 `~/.claude/skills/` 目录
- 如果使用 claude.ai，确认技能已添加到项目知识库

### 网络权限

某些技能需要网络访问：
- `vercel-deploy-claimable` 需要访问 Vercel 部署 API
- `web-design-guidelines` 需要从 GitHub 拉取最新规则

**解决方案**：在 claude.ai/settings/capabilities 中添加所需域名。

## 本课小结

Agent Skills 是为 AI 编码代理设计的技能包系统，提供：
- **react-best-practices**：50+ 条 React/Next.js 性能优化规则
- **web-design-guidelines**：近百条 Web 设计最佳实践
- **vercel-deploy-claimable**：一键部署到 Vercel

技能采用按需加载机制，减少上下文占用。安装后，AI 代理会自动在相关任务中激活对应的技能。

## 下一课预告

> 下一课我们将学习 **[安装 Agent Skills](../installation/)**。
>
> 你将学到：
> - 两种安装方法：Claude Code 和 claude.ai
> - 配置网络权限
> - 验证技能是否正确安装

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-25

| 功能           | 文件路径                                                                                                                                                     | 行号    |
|--- | --- | ---|
| 技能包列表     | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L7-L80)                                                                        | 7-80    |
| 技能结构说明   | [`README.md`](https://github.com/vercel-labs/agent-skills/blob/main/README.md#L103-L110)                                                                     | 103-110 |
| AGENTS.md 规范 | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md)                                                                               | 全文    |
| 技能目录结构   | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L11-L20)                                                                       | 11-20   |
| SKILL.md 格式  | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L29-L68)                                                                       | 29-68   |
| 技能打包命令   | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L93-L96)                                                                       | 93-96   |
| 用户安装方法   | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L98-L110)                                                                      | 98-110  |
| 按需加载机制   | [`AGENTS.md`](https://github.com/vercel-labs/agent-skills/blob/main/AGENTS.md#L72-L78)                                                                       | 72-78   |
| 构建工具脚本   | [`packages/react-best-practices-build/package.json`](https://github.com/vercel-labs/agent-skills/blob/main/packages/react-best-practices-build/package.json) | 全文    |

**关键常量**：
- 无硬编码常量

**关键函数**：
- `build.ts`：构建 AGENTS.md 和测试用例
- `validate.ts`：验证规则文件完整性
- `extract-tests.ts`：从规则中提取测试用例

</details>
