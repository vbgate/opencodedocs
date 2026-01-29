---
title: "工具集: 记忆管理 | opencode-supermemory"
sidebarTitle: "教 Agent 记住你的偏好"
subtitle: "工具集: 记忆管理"
description: "学习 supermemory 工具的 5 种核心模式（add, search, profile, list, forget）。通过自然语言指令控制 Agent 的记忆行为，提升开发效率。"
tags:
  - "工具使用"
  - "记忆管理"
  - "核心功能"
prerequisite:
  - "start-getting-started"
order: 2
---

# 工具集详解：教 Agent 记忆

## 学完你能做什么

在这一课，你将掌握 `supermemory` 插件的核心交互方式。虽然 Agent 通常会自动管理记忆，但作为开发者，你经常需要手动干预。

学完本课，你将能够：
1.  使用 `add` 模式手动保存关键技术决策。
2.  使用 `search` 模式验证 Agent 是否记住了你的偏好。
3.  使用 `profile` 查看 Agent 眼中的"你"。
4.  使用 `list` 和 `forget` 清理过时或错误的记忆。

## 核心思路

opencode-supermemory 并不是一个黑盒，它通过标准的 OpenCode Tool 协议与 Agent 交互。这意味着你可以像调用函数一样调用它，也可以用自然语言指挥 Agent 使用它。

插件向 Agent 注册了一个名为 `supermemory` 的工具，它就像一把瑞士军刀，拥有 6 种模式：

| 模式 | 作用 | 典型场景 |
| :--- | :--- | :--- |
| **add** | 添加记忆 | "记住，这个项目必须用 Bun 运行" |
| **search** | 搜索记忆 | "我之前有没有说过怎么处理鉴权？" |
| **profile** | 用户画像 | 查看 Agent 总结的你的编码习惯 |
| **list** | 列出记忆 | 审计最近保存的 10 条记忆 |
| **forget** | 删除记忆 | 删除一条错误的配置记录 |
| **help** | 使用指南 | 查看工具帮助文档 |

::: info 自动触发机制
除了手动调用，插件还会监听你的聊天内容。当你通过自然语言说出 "Remember this" 或 "Save this" 时，插件会自动检测关键词，并强制 Agent 调用 `add` 工具。
:::

## 跟我做：手动管理记忆

虽然我们通常让 Agent 自动操作，但在调试或建立初始记忆时，手动调用工具非常有用。你可以在 OpenCode 的对话框中直接通过自然语言让 Agent 执行这些操作。

### 1. 添加记忆 (Add)

这是最常用的功能。你可以指定记忆的内容、类型和作用域。

**操作**：告诉 Agent 保存一条关于项目架构的记忆。

**输入指令**：
```text
使用 supermemory 工具保存一条记忆：
内容："本项目的所有服务层代码都必须放在 src/services 目录下"
类型：architecture
范围：project
```

**Agent 的内部行为**（源码逻辑）：
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "add",
    "content": "本项目的所有服务层代码都必须放在 src/services 目录下",
    "type": "architecture",
    "scope": "project"
  }
}
```

**你应该看到**：
Agent 返回类似这样的确认信息：
> ✅ Memory added to project scope (ID: mem_12345...)

::: tip 记忆类型 (Type) 的选择
为了让检索更精准，建议使用准确的类型：
- `project-config`: 技术栈、工具链配置
- `architecture`: 架构模式、目录结构
- `preference`: 你的个人编码喜好（如"喜欢箭头函数"）
- `error-solution`: 某个报错的特定解决方案
- `learned-pattern`: Agent 观察到的代码模式
:::

### 2. 搜索记忆 (Search)

当你想确认 Agent 是否"知道"某件事时，可以使用搜索功能。

**操作**：搜索关于"服务层"的记忆。

**输入指令**：
```text
查询 supermemory，关键词是"services"，范围是 project
```

**Agent 的内部行为**：
```json
{
  "tool": "supermemory",
  "args": {
    "mode": "search",
    "query": "services",
    "scope": "project"
  }
}
```

**你应该看到**：
Agent 列出相关的记忆片段及其相似度（Similarity）。

### 3. 查看用户画像 (Profile)

Supermemory 会自动维护一个"用户画像"，包含你的长期偏好。

**操作**：查看你的画像。

**输入指令**：
```text
调用 supermemory 工具的 profile 模式，看看你对我有什么了解
```

**你应该看到**：
返回两类信息：
- **Static**: 静态事实（如"用户是全栈工程师"）
- **Dynamic**: 动态偏好（如"用户最近在关注 Rust"）

### 4. 审计与遗忘 (List & Forget)

如果 Agent 记住了错误的信息（比如一个已经废弃的 API Key），你需要删除它。

**第一步：列出最近记忆**
```text
列出最近的 5 条项目记忆
```
*(Agent 调用 `mode: "list", limit: 5`)*

**第二步：获取 ID 并删除**
假设你看到一条错误的记忆 ID 为 `mem_abc123`。

```text
删除记忆 ID 为 mem_abc123 的记录
```
*(Agent 调用 `mode: "forget", memoryId: "mem_abc123"`)*

**你应该看到**：
> ✅ Memory mem_abc123 removed from project scope

## 进阶：自然语言触发

你不需要每次都详细描述工具参数。插件内置了关键词检测机制。

**试一试**：
在对话中直接说：
> **Remember this**: 所有的日期处理都必须使用 date-fns 库，禁止使用 moment.js。

**发生了什么？**
1.  插件的 `chat.message` 钩子检测到关键词 "Remember this"。
2.  插件向 Agent 注入了一个系统提示：`[MEMORY TRIGGER DETECTED]`。
3.  Agent 收到指令："You MUST use the supermemory tool with mode: 'add'..."。
4.  Agent 自动提取内容并调用工具。

这是一个非常自然的交互方式，让你在编码过程中随时"固化"知识。

## 常见问题 (FAQ)

**Q: `scope` 默认是什么？**
A: 默认为 `project`。如果你想保存跨项目通用的偏好（比如"我总是使用 TypeScript"），请显式指定 `scope: "user"`。

**Q: 为什么我添加的记忆没有立即生效？**
A: `add` 操作是异步的。通常 Agent 会在工具调用成功后立即"知道"这条新记忆，但在某些极端网络延迟下可能需要几秒钟。

**Q: 敏感信息会被上传吗？**
A: 插件会自动脱敏 `<private>` 标签内的内容。但为了安全，建议不要将密码或 API Key 放入记忆中。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| :--- | :--- | :--- |
| 工具定义 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| 关键词检测 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| 触发提示词 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L20-L28) | 20-28 |
| 客户端实现 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 全文 |

**关键类型定义**：
- `MemoryType`: 定义在 [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)
- `MemoryScope`: 定义在 [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts)

</details>

## 下一课预告

> 下一课我们学习 **[记忆作用域与生命周期](../memory-management/index.md)**。
>
> 你会学到：
> - User Scope 和 Project Scope 的底层隔离机制
> - 如何设计高效的记忆分区策略
> - 记忆的生命周期管理
