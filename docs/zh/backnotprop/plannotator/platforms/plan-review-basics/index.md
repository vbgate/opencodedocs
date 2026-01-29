---
title: "计划评审: 可视化评审 AI 计划 | Plannotator"
subtitle: "计划评审基础：可视化评审 AI 计划"
description: "学习 Plannotator 计划评审功能。使用可视化界面评审 AI 生成的计划，添加注释批准或拒绝，掌握 Approve 和 Request Changes 的区别。"
sidebarTitle: "5 分钟学会评审计划"
tags:
  - "计划评审"
  - "可视化评审"
  - "注释"
  - "批准"
  - "拒绝"
  - "Claude Code"
  - "OpenCode"
prerequisite:
  - "start-getting-started"
order: 1
---

# 计划评审基础：可视化评审 AI 计划

## 学完你能做什么

- ✅ 使用 Plannotator 可视化界面评审 AI 生成的计划
- ✅ 选中计划文本，添加不同类型的注释（删除、替换、评论）
- ✅ 批准计划，让 AI 继续实施
- ✅ 拒绝计划，将注释作为反馈发送给 AI
- ✅ 理解注释类型的使用场景和区别

## 你现在的困境

**问题 1**：AI 生成的实施计划在终端里阅读，文字量大、结构不清晰，评审起来很累。

**问题 2**：想给 AI 反馈时，只能用文字描述"删除第3段"、"修改这个函数"，沟通成本高，AI 也可能理解错误。

**问题 3**：计划中有些地方不需要修改，有些地方需要替换，有些地方需要评论，但没有工具帮你结构化这些反馈。

**问题 4**：不知道如何让 AI 知道你批准了计划，还是需要修改。

**Plannotator 能帮你**：
- 可视化 UI 替代终端阅读，结构清晰
- 选中文本即可添加注释（删除、替换、评论），精确反馈
- 注释自动转换为结构化数据，AI 准确理解你的意图
- 一键批准或拒绝，AI 立即响应

## 什么时候用这一招

**使用场景**：
- AI Agent 完成计划并调用 `ExitPlanMode`（Claude Code）
- AI Agent 调用 `submit_plan` 工具（OpenCode）
- 需要评审 AI 生成的实施计划
- 需要精确反馈计划的修改意见

**不适用场景**：
- 直接让 AI 实施代码（跳过计划评审）
- 已经批准计划，需要评审实际代码变更（使用代码评审功能）

## 🎒 开始前的准备

**前置条件**：
- ✅ 已安装 Plannotator CLI（详见 [快速开始](../start/getting-started/)）
- ✅ 已配置 Claude Code 或 OpenCode 插件（详见对应安装指南）
- ✅ AI Agent 支持计划评审（Claude Code 2.1.7+，或 OpenCode）

**触发方式**：
- **Claude Code**：AI 完成 plan 后自动调用 `ExitPlanMode`，Plannotator 自动启动
- **OpenCode**：AI 调用 `submit_plan` 工具，Plannotator 自动启动

## 核心思路

### 计划评审是什么

**计划评审**是 Plannotator 的核心功能，用于可视化评审 AI 生成的实施计划。

::: info 为什么需要计划评审？
AI 生成计划后，通常会问"这个计划可以吗？"或"是否开始实施？"。如果没有可视化工具，你只能在终端里阅读纯文本计划，然后回复"可以"、"不行，修改XX"等模糊反馈。Plannotator 让你用可视化界面查看计划，精确选中需要修改的部分，添加结构化注释，AI 更容易理解你的意图。
:::

### 工作流程

```
┌─────────────────┐
│  AI Agent      │
│  (生成计划)    │
└────────┬────────┘
         │
         │ ExitPlanMode / submit_plan
         ▼
┌─────────────────┐
│ Plannotator UI  │  ← 浏览器自动打开
│                 │
│ ┌───────────┐  │
│ │ 计划内容   │  │
│ │ (Markdown) │  │
│ └───────────┘  │
│       │         │
│       │ 选中文本
│       ▼         │
│ ┌───────────┐  │
│ │ 添加注释   │  │
│ │ Delete/    │  │
│ │ Replace/   │  │
│ │ Comment    │  │
│ └───────────┘  │
│       │         │
│       ▼         │
│ ┌───────────┐  │
│ │ 决策      │  │
│ │ Approve/  │  │
│ │ Request   │  │
│ │ Changes   │  │
│ └───────────┘  │
└────────┬────────┘
         │
         │ {"behavior": "allow"} 或
         │ {"behavior": "deny", "message": "..."}
         ▼
┌─────────────────┐
│  AI Agent      │
│  (继续实施)    │
└─────────────────┘
```

### 注释类型

Plannotator 支持四种注释类型，每种都有不同的用途：

| 注释类型 | 用途 | AI 收到的反馈 |
| --------- | ---- | ------------ |
| **Delete** | 删除不需要的内容 | "删除：[选中的文本]" |
| **Replace** | 替换为更好的内容 | "替换：[选中的文本] 为 [你输入的文本]" |
| **Comment** | 评论某段内容，不要求修改 | "评论：[选中的文本]。说明：[你输入的评论]" |
| **Global Comment** | 全局评论，不关联具体文本 | "全局评论：[你输入的评论]" |

### Approve vs Request Changes

| 决策类型 | 操作 | AI 收到的反馈 | 适用场景 |
| --------- | ---- | ------------ | -------- |
| **Approve** | 点击 Approve 按钮 | `{"behavior": "allow"}` | 计划没问题，直接批准 |
| **Request Changes** | 点击 Request Changes 按钮 | `{"behavior": "deny", "message": "..."}` | 有需要修改的地方 |

::: tip Claude Code 和 OpenCode 的差异
- **Claude Code**：Approve 时不会发送注释（注释会被忽略）
- **OpenCode**：Approve 时可以发送注释作为备注（可选）

**拒绝计划时**：无论哪个平台，注释都会发送给 AI
:::

## 跟我做

### 第 1 步：触发计划评审

**Claude Code 示例**：

在 Claude Code 中与 AI 对话，让 AI 生成一个实施计划：

```
用户：帮我写一个用户认证模块的实施计划

Claude：好的，这是实施计划：
1. 创建用户模型
2. 实现注册 API
3. 实现登录 API
...
（AI 调用 ExitPlanMode）
```

**OpenCode 示例**：

在 OpenCode 中，AI 会自动调用 `submit_plan` 工具。

**你应该看到**：
1. 浏览器自动打开 Plannotator UI
2. 显示 AI 生成的计划内容（Markdown 格式）
3. 页面底部有"Approve"和"Request Changes"按钮

### 第 2 步：浏览计划内容

在浏览器中查看计划：

- 计划以 Markdown 格式渲染，包括标题、段落、列表、代码块
- 可以滚动查看整个计划
- 支持亮/暗模式切换（点击右上角的主题切换按钮）

### 第 3 步：选中计划文本，添加注释

**添加 Delete 注释**：

1. 用鼠标选中计划中需要删除的文本
2. 在弹出的工具栏中点击 **Delete** 按钮
3. 文本会被标记为删除样式（红色删除线）

**添加 Replace 注释**：

1. 用鼠标选中计划中需要替换的文本
2. 在弹出的工具栏中点击 **Replace** 按钮
3. 在弹出的输入框中输入替换后的内容
4. 按回车或点击确认
5. 原文本会被标记为替换样式（黄色背景），并在下方显示替换内容

**添加 Comment 注释**：

1. 用鼠标选中计划中需要评论的文本
2. 在弹出的工具栏中点击 **Comment** 按钮
3. 在弹出的输入框中输入评论内容
4. 按回车或点击确认
5. 文本会被标记为评论样式（蓝色高亮），并在侧边栏显示评论

**添加 Global Comment**：

1. 点击页面右上角的 **Add Global Comment** 按钮
2. 在弹出的输入框中输入全局评论内容
3. 按回车或点击确认
4. 评论会显示在侧边栏的"Global Comments"部分

**你应该看到**：
- 选中文本后，会立即弹出工具栏（Delete、Replace、Comment）
- 添加注释后，文本会显示相应的样式（删除线、背景色、高亮）
- 侧边栏会显示所有注释列表，可以点击跳转到对应位置
- 可以点击注释旁的 **删除** 按钮移除注释

### 第 4 步：批准计划

**如果计划没有问题**：

点击页面底部的 **Approve** 按钮。

**你应该看到**：
- 浏览器自动关闭（1.5 秒延迟）
- Claude Code/OpenCode 终端中显示计划已批准
- AI 继续实施计划

::: info Approve 的行为
- **Claude Code**：只发送 `{"behavior": "allow"}`，注释被忽略
- **OpenCode**：发送 `{"behavior": "allow"}`，注释可以作为备注发送（可选）
:::

### 第 5 步：拒绝计划（Request Changes）

**如果计划需要修改**：

1. 添加必要的注释（Delete、Replace、Comment）
2. 点击页面底部的 **Request Changes** 按钮
3. 浏览器会显示确认对话框

**你应该看到**：
- 确认对话框显示"Send X annotations to AI?"
- 点击确认后，浏览器自动关闭
- Claude Code/OpenCode 终端中显示反馈内容
- AI 会根据反馈修改计划

::: tip Request Changes 的行为
- **Claude Code** 和 **OpenCode**：都会发送 `{"behavior": "deny", "message": "..."}`
- 注释会被转换为结构化的 Markdown 文本
- AI 会根据注释修改计划并再次调用 ExitPlanMode/submit_plan
:::

### 第 6 步：查看反馈内容（可选）

如果你想查看 Plannotator 发送给 AI 的反馈内容，可以在终端中查看：

**Claude Code**：
```
Plan rejected by user
Please modify the plan based on the following feedback:

[结构化的注释内容]
```

**OpenCode**：
```
<feedback>
[结构化的注释内容]
</feedback>
```

## 检查点 ✅

完成以上步骤后，你应该能够：

- [ ] 在 AI 触发计划评审后，浏览器自动打开 Plannotator UI
- [ ] 选中计划文本，添加 Delete、Replace、Comment 注释
- [ ] 添加 Global Comment
- [ ] 在侧边栏查看所有注释，并跳转到对应位置
- [ ] 点击 Approve，浏览器关闭，AI 继续实施
- [ ] 点击 Request Changes，浏览器关闭，AI 修改计划

**如果某一步失败**，详见：
- [常见问题](../../faq/common-problems/)
- [Claude Code 安装指南](../../start/installation-claude-code/)
- [OpenCode 安装指南](../../start/installation-opencode/)

## 踩坑提醒

**常见错误 1**：选中文本后，工具栏没有弹出

**原因**：可能是因为选中的是代码块中的文本，或者选中的文本跨多个元素。

**解决**：
- 尽量选中单个段落或列表项中的文本
- 对于代码块，可以使用 Comment 注释，不要跨多行选中

**常见错误 2**：添加 Replace 注释后，替换内容没有显示

**原因**：替换内容输入框可能没有正确提交。

**解决**：
- 输入替换内容后，按回车键或点击确认按钮
- 检查侧边栏中是否显示了替换内容

**常见错误 3**：点击 Approve 或 Request Changes 后，浏览器没有关闭

**原因**：可能是服务器错误或网络问题。

**解决**：
- 检查终端中是否有错误信息
- 手动关闭浏览器
- 如果问题持续，详见 [故障排查](../../faq/troubleshooting/)

**常见错误 4**：AI 收到反馈后，没有按照注释修改

**原因**：AI 可能没有正确理解注释的意图。

**解决**：
- 尝试使用更明确的注释（Replace 比 Comment 更明确）
- 使用 Comment 添加详细说明
- 如果问题持续，可以再次拒绝计划，并调整注释内容

**常见错误 5**：添加多个 Delete 注释后，AI 只删除了部分内容

**原因**：多个 Delete 注释之间可能有重叠或冲突。

**解决**：
- 确保每个 Delete 注释的文本范围不重叠
- 如果需要删除大段内容，可以选中整个段落一次性删除

## 本课小结

计划评审是 Plannotator 的核心功能，让你可以可视化评审 AI 生成的计划：

**核心操作**：
1. **触发**：AI 调用 `ExitPlanMode` 或 `submit_plan`，浏览器自动打开 UI
2. **浏览**：在可视化界面中查看计划内容（Markdown 格式）
3. **注释**：选中文本，添加 Delete、Replace、Comment 或 Global Comment
4. **决策**：点击 Approve（批准）或 Request Changes（拒绝）
5. **反馈**：注释被转换为结构化数据，AI 根据反馈继续或修改计划

**注释类型**：
- **Delete**：删除不需要的内容
- **Replace**：替换为更好的内容
- **Comment**：评论某段内容，不要求修改
- **Global Comment**：全局评论，不关联具体文本

**决策类型**：
- **Approve**：计划没问题，直接批准（Claude Code 会忽略注释）
- **Request Changes**：有需要修改的地方，注释发送给 AI

## 下一课预告

> 下一课我们学习 **[添加计划注释](../plan-review-annotations/)**。
>
> 你会学到：
> - 如何精确使用 Delete、Replace、Comment 注释
> - 如何添加图像标注
> - 如何编辑和删除注释
> - 注释的最佳实践和常见场景

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能              | 文件路径                                                                                              | 行号    |
| ----------------- | ----------------------------------------------------------------------------------------------------- | ------- |
| 计划评审 UI       | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L1-L200)          | 1-200   |
| 注释类型定义      | [`packages/ui/types.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/types.ts#L1-L70)                | 1-70    |
| 计划评审服务器     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L91-L310)            | 91-310  |
| API: 获取计划内容  | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L132-L134)         | 132-134 |
| API: 批准计划     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L201-L277)         | 201-277 |
| API: 拒绝计划     | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L280-L309)         | 280-309 |
| Viewer 组件       | [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L1-L100)   | 1-100   |
| AnnotationPanel 组件 | [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L1-L50) | 1-50    |

**关键类型**：
- `AnnotationType`：注释类型枚举（DELETION、INSERTION、REPLACEMENT、COMMENT、GLOBAL_COMMENT）（`packages/ui/types.ts:1-7`）
- `Annotation`：注释接口（`packages/ui/types.ts:11-33`）
- `Block`：计划块接口（`packages/ui/types.ts:35-44`）

**关键函数**：
- `startPlannotatorServer()`：启动计划评审服务器（`packages/server/index.ts:91`）
- `parseMarkdownToBlocks()`：将 Markdown 解析为 Blocks（`packages/ui/utils/parser.ts`）

**API 路由**：
- `GET /api/plan`：获取计划内容（`packages/server/index.ts:132`）
- `POST /api/approve`：批准计划（`packages/server/index.ts:201`）
- `POST /api/deny`：拒绝计划（`packages/server/index.ts:280`）

**业务规则**：
- Claude Code 批准时不发送注释（`apps/hook/server/index.ts:132`）
- OpenCode 批准时可发送注释作为备注（`apps/opencode-plugin/index.ts:270`）
- 拒绝计划时注释总是发送（`apps/hook/server/index.ts:154`）

</details>
