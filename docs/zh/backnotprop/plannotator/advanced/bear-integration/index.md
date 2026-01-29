---
title: "Bear 集成: 自动保存计划 | Plannotator"
sidebarTitle: "计划自动存到 Bear"
subtitle: "Bear 集成: 自动保存批准的计划 | Plannotator"
description: "学习 Plannotator 的 Bear 集成配置方法。通过 x-callback-url 自动保存批准的计划，智能生成标签，实现知识沉淀和计划归档。"
tags:
  - "集成"
  - "Bear"
  - "笔记应用"
  - "知识沉淀"
prerequisite:
  - "installation-claude-code"
  - "platforms-plan-review-basics"
order: 3
---

# Bear 集成：自动保存批准的计划

## 学完你能做什么

启用 Bear 集成后，每次批准计划时，Plannotator 会自动将计划保存到你的 Bear 笔记中，包括：
- 自动生成的标题（从计划提取）
- 智能标签（项目名、关键词、编程语言）
- 完整的计划内容

这样你就能在一个地方管理所有批准的计划，方便后续查阅和知识沉淀。

## 你现在的困境

你可能遇到过这些情况：
- AI 生成的计划很好，但想保存下来以后参考
- 在 Bear 里手动复制粘贴计划太麻烦
- 不同项目的计划混在一起，没有标签管理

有了 Bear 集成，这些问题都能自动解决。

## 什么时候用这一招

- 你使用 Bear 做主要笔记应用
- 需要归档批准的计划做知识库
- 希望通过标签快速检索历史计划

::: info 关于 Bear
Bear 是一款 macOS 上的 Markdown 笔记应用，支持标签、加密、同步等功能。如果你还没安装，可以访问 [bear.app](https://bear.app/) 了解。
:::

## 🎒 开始前的准备

- 已安装 Plannotator（参见[安装教程](../../start/installation-claude-code/)）
- 已安装 Bear 并能够正常使用
- 了解基本的计划评审流程（参见[计划评审基础](../../platforms/plan-review-basics/)）

## 核心思路

Bear 集成的核心是 **x-callback-url** 协议：

1. 在 Plannotator UI 中启用 Bear 集成（存储在浏览器 localStorage）
2. 批准计划时，Plannotator 发送 `bear://x-callback-url/create` URL
3. 系统使用 `open` 命令自动打开 Bear 创建笔记
4. 计划内容、标题、标签自动填入

**关键特点**：
- 无需配置 vault 路径（不像 Obsidian 需要指定 vault）
- 标签智能生成（最多 7 个）
- 批准计划时自动保存

::: tip 与 Obsidian 的区别
Bear 集成更简单，不需要配置 vault 路径，只需一个开关。但 Obsidian 可以指定保存文件夹和更多定制化。
:::

## 跟我做

### 第 1 步：打开 Plannotator 设置

当 AI Agent 生成计划并打开 Plannotator UI 后，点击右上角的 ⚙️ **Settings** 按钮。

**你应该看到**：设置面板弹出，包含多个配置选项

### 第 2 步：启用 Bear 集成

在设置面板中找到 **Bear Notes** 部分，点击开关按钮。

**为什么**
开关会从灰色（禁用）变为蓝色（启用），同时存储到浏览器的 localStorage 中。

**你应该看到**：
- Bear Notes 开关变蓝
- 描述文字："Auto-save approved plans to Bear"

### 第 3 步：批准计划

完成计划评审后，点击底部的 **Approve** 按钮。

**为什么**
Plannotator 会读取 Bear 设置，如果已启用，会在批准的同时调用 Bear 的 x-callback-url。

**你应该看到**：
- Bear 应用自动打开
- 新建笔记窗口弹出
- 标题和内容已自动填充
- 标签已自动生成（以 `#` 开头）

### 第 4 步：查看保存的笔记

在 Bear 中，检查新建的笔记，确认：
- 标题是否正确（来自计划的 H1）
- 内容是否完整（包含计划全文）
- 标签是否合理（项目名、关键词、编程语言）

**你应该看到**：
类似这样的笔记结构：

```markdown
## User Authentication

[完整的计划内容...]

#plannotator #myproject #authentication #typescript #api
```

## 检查点 ✅

- [ ] Settings 中 Bear Notes 开关已启用
- [ ] 批准计划后 Bear 自动打开
- [ ] 笔记标题与计划的 H1 一致
- [ ] 笔记包含完整的计划内容
- [ ] 标签包含 `#plannotator` 和项目名

## 踩坑提醒

### Bear 没有自动打开

**原因**：系统 `open` 命令失败，可能是：
- Bear 未安装或未从 App Store 下载
- Bear 的 URL scheme 被其他应用劫持

**解决方法**：
1. 确认 Bear 已正常安装
2. 在终端中手动测试：`open "bear://x-callback-url/create?title=test"`

### 标签不符合预期

**原因**：标签是自动生成的，规则如下：
- 必选：`#plannotator`
- 必选：项目名（从 git 仓库名或目录名提取）
- 可选：从 H1 标题提取最多 3 个关键词（排除停用词）
- 可选：从代码块提取编程语言标签（排除 json/yaml/markdown）
- 最多 7 个标签

**解决方法**：
- 标签不符合预期时，可以在 Bear 中手动编辑
- 如果项目名不对，检查 git 仓库配置或目录名

### 批准但没有保存

**原因**：
- Bear 开关未启用（检查 Settings）
- 网络错误或 Bear 响应超时
- 计划内容为空

**解决方法**：
1. 确认 Settings 中开关是蓝色（启用状态）
2. 查看终端是否有错误日志（`[Bear] Save failed:`）
3. 重新批准计划

## 标签生成机制详解

Plannotator 会智能生成标签，让你在 Bear 中快速检索计划。以下是标签的生成规则：

| 标签来源 | 示例 | 优先级 |
|--- | --- | ---|
| 固定标签 | `#plannotator` | 必选 |
| 项目名称 | `#myproject`、`#plannotator` | 必选 |
| H1 关键词 | `#authentication`、`#api` | 可选（最多 3 个） |
| 编程语言 | `#typescript`、`#python` | 可选 |

**停用词列表**（不会作为标签）：
- `the`, `and`, `for`, `with`, `this`, `that`, `from`, `into`
- `plan`, `implementation`, `overview`, `phase`, `step`, `steps`

**编程语言排除**（不会作为标签）：
- `json`, `yaml`, `yml`, `text`, `txt`, `markdown`, `md`

::: details 示例：标签生成过程
假设计划标题为 "Implementation Plan: User Authentication System in TypeScript"，代码块包含 Python 和 JSON：

1. **固定标签**：`#plannotator`
2. **项目名**：`#myproject`（假设 git 仓库名）
3. **H1 关键词**：
   - `implementation` → 排除（停用词）
   - `plan` → 排除（停用词）
   - `user` → 保留 → `#user`
   - `authentication` → 保留 → `#authentication`
   - `system` → 保留 → `#system`
   - `typescript` → 保留 → `#typescript`
4. **编程语言**：
   - `python` → 保留 → `#python`
   - `json` → 排除（排除列表）

最终标签：`#plannotator #myproject #user #authentication #system #typescript #python`（7 个，达到上限）
:::

## 与 Obsidian 集成对比

| 特性 | Bear 集成 | Obsidian 集成 |
|--- | --- | ---|
| 配置复杂度 | 简单（仅开关） | 中等（需要选择 vault 和文件夹） |
| 存储 | Bear 应用内 | 指定 vault 路径 |
| 文件名 | Bear 自动管理 | `Title - Mon D, YYYY H-MMam.md` |
| Frontmatter | 无（Bear 不支持） | 有（created, source, tags） |
| 跨平台 | 仅 macOS | macOS/Windows/Linux |
| x-callback-url | ✅ 使用 | ❌ 直接写文件 |

::: tip 如何选择
- 如果你只用 macOS 且喜欢 Bear：Bear 集成更简单
- 如果需要跨平台或自定义存储路径：Obsidian 集成更灵活
- 如果两者都想用：可以同时启用（批准计划会同时保存到两个地方）
:::

## 本课小结

- Bear 集成通过 x-callback-url 协议工作，配置简单
- 只需在 Settings 中开启开关，无需指定路径
- 批准计划时自动保存到 Bear
- 标签智能生成，包含项目名、关键词、编程语言（最多 7 个）
- 与 Obsidian 集成相比，Bear 更简单但功能较少

## 下一课预告

> 下一课我们学习 **[远程/Devcontainer 模式](../remote-mode/)**。
>
> 你会学到：
> - 如何在远程环境（SSH、devcontainer、WSL）中使用 Plannotator
> - 配置固定端口和端口转发
> - 在远程环境中打开浏览器查看评审页面

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-24

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| Bear 配置接口 | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L18-L20) | 18-20   |
| 保存到 Bear | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L257) | 234-257 |
| 标签提取     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L34-L74) | 34-74   |
| 标题提取     | [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L94-L105) | 94-105  |
| Bear 设置接口 | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L15-L17) | 15-17   |
| 读取 Bear 设置 | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L22-L26) | 22-26   |
| 保存 Bear 设置 | [`packages/ui/utils/bear.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/bear.ts#L31-L33) | 31-33   |
| UI 设置组件 | [`packages/ui/components/Settings.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Settings.tsx#L496-L518) | 496-518 |
| 批准时调用 Bear | [`packages/editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/editor/App.tsx#L512-L514) | 512-514 |
| 服务器处理 Bear | [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L250-L257) | 250-257 |

**关键函数**：
- `saveToBear(config: BearConfig)`：通过 x-callback-url 将计划保存到 Bear
- `extractTags(markdown: string)`：从计划内容智能提取标签（最多 7 个）
- `extractTitle(markdown: string)`：从计划的 H1 标题提取笔记标题
- `getBearSettings()`：从 localStorage 读取 Bear 集成设置
- `saveBearSettings(settings)`：将 Bear 集成设置保存到 localStorage

**关键常量**：
- `STORAGE_KEY_ENABLED = 'plannotator-bear-enabled'`：localStorage 中 Bear 设置的键名

**Bear URL 格式**：
```typescript
bear://x-callback-url/create?title={title}&text={content}&open_note=no
```

</details>
