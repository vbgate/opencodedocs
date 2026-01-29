---
title: "记忆作用域: 管理生命周期 | opencode-supermemory"
sidebarTitle: "管理记忆生命周期"
subtitle: "记忆作用域: 管理生命周期"
description: "学习 opencode-supermemory 的记忆作用域和生命周期管理。掌握 User 与 Project 作用域的 CRUD 操作，实现跨项目经验复用与项目隔离。"
tags:
  - "memory-management"
  - "scope"
  - "crud"
prerequisite:
  - "core-tools"
order: 3
---

# 记忆作用域与生命周期：管理你的数字大脑

## 学完你能做什么

- **区分作用域**：明白哪些记忆是"跟着你走的"（跨项目），哪些是"跟着项目走的"（项目专用）。
- **管理记忆**：学会手动查看、添加和删除记忆，保持 Agent 认知的整洁。
- **调试 Agent**：当 Agent "记错"东西时，知道去哪里修正。

## 核心思路

opencode-supermemory 将记忆分为两个隔离的**作用域 (Scope)**，类似于编程语言中的全局变量和局部变量。

### 1. 两种作用域

| 作用域 | 标识符 (Scope ID) | 生命周期 | 典型用途 |
|--- | --- | --- | ---|
| **User Scope**<br>(用户作用域) | `user` | **永久跟随你**<br>跨所有项目共享 | • 编码风格偏好 (如 "喜欢 TypeScript")<br>• 个人习惯 (如 "总是写注释")<br>• 通用知识 |
| **Project Scope**<br>(项目作用域) | `project` | **仅限当前项目**<br>切换目录即失效 | • 项目架构设计<br>• 业务逻辑说明<br>• 特定 Bug 的修复方案 |

::: info 作用域是如何生成的？
插件通过 `src/services/tags.ts` 自动生成唯一标签：
- **User Scope**: 基于你的 Git 邮箱哈希 (`opencode_user_{hash}`)。
- **Project Scope**: 基于当前项目路径哈希 (`opencode_project_{hash}`)。
:::

### 2. 记忆的生命周期

1.  **创建 (Add)**: 通过 CLI 初始化或 Agent 对话 (`Remember this...`) 写入。
2.  **激活 (Inject)**: 每次开启新会话时，插件会自动拉取相关的 User 和 Project 记忆注入上下文。
3.  **检索 (Search)**: Agent 在对话过程中可以主动搜索特定记忆。
4.  **遗忘 (Forget)**: 当记忆过时或错误时，通过 ID 删除。

---

## 跟我做：管理你的记忆

我们将通过与 Agent 对话，手动管理这两个作用域的记忆。

### 第 1 步：查看现有记忆

首先，看看 Agent 现在记住了什么。

**操作**：在 OpenCode 聊天框中输入：

```text
请列出当前项目的所有记忆 (List memories in project scope)
```

**你应该看到**：
Agent 调用 `supermemory` 工具的 `list` 模式，并返回一个列表：

```json
// 示例输出
{
  "success": true,
  "scope": "project",
  "count": 3,
  "memories": [
    {
      "id": "mem_123456",
      "content": "项目使用 MVC 架构，Service 层负责业务逻辑",
      "createdAt": "2023-10-01T10:00:00Z"
    }
    // ...
  ]
}
```

### 第 2 步：添加跨项目记忆 (User Scope)

假设你希望 Agent 在**所有**项目中都使用中文回复。这是一条适合 User Scope 的记忆。

**操作**：输入以下指令：

```text
请记住我的个人偏好：无论在哪个项目，都请始终用中文回复我。
请将其保存到 User Scope。
```

**你应该看到**：
Agent 调用 `add` 工具，参数 `scope: "user"`：

```json
{
  "mode": "add",
  "content": "User prefers responses in Chinese across all projects",
  "scope": "user",
  "type": "preference"
}
```

系统确认记忆已添加，并返回一个 `id`。

### 第 3 步：添加项目专用记忆 (Project Scope)

现在，我们为**当前项目**添加一条特定规则。

**操作**：输入以下指令：

```text
请记住：在这个项目中，所有的日期格式必须是 YYYY-MM-DD。
保存到 Project Scope。
```

**你应该看到**：
Agent 调用 `add` 工具，参数 `scope: "project"`（这是默认值，Agent 可能省略）：

```json
{
  "mode": "add",
  "content": "Date format must be YYYY-MM-DD in this project",
  "scope": "project",
  "type": "project-config"
}
```

### 第 4 步：验证隔离性

为了验证作用域是否生效，我们可以尝试搜索。

**操作**：输入：

```text
搜索关于"日期格式"的记忆
```

**你应该看到**：
Agent 调用 `search` 工具。如果它指定了 `scope: "project"` 或进行混合搜索，应该能找到刚才那条记忆。

::: tip 验证跨项目能力
如果你新建一个终端窗口，进入另一个不同的项目目录，再次询问"日期格式"，Agent 应该**找不到**这条记忆（因为它被隔离在原项目的 Project Scope 中）。但如果你问"我希望用什么语言回复"，它应该能从 User Scope 找回"中文回复"的偏好。
:::

### 第 5 步：删除过时记忆

如果项目规范变了，我们需要删除旧记忆。

**操作**：
1. 先执行 **第 1 步** 获取记忆 ID（例如 `mem_987654`）。
2. 输入指令：

```text
请忘记 ID 为 mem_987654 的那条关于日期格式的记忆。
```

**你应该看到**：
Agent 调用 `forget` 工具：

```json
{
  "mode": "forget",
  "memoryId": "mem_987654"
}
```

系统返回 `success: true`。

---

## 常见问题 (FAQ)

### Q: 如果我换了电脑，User Scope 的记忆还在吗？
**A: 取决于你的 Git 配置。**
User Scope 是基于 `git config user.email` 生成的。如果你在两台电脑上使用相同的 Git 邮箱，并且连接到同一个 Supermemory 账号（使用相同的 API Key），那么记忆是**同步**的。

### Q: 为什么我看不到刚才添加的记忆？
**A: 可能是缓存或索引延迟。**
Supermemory 的向量索引通常是秒级的，但在网络波动时可能有短暂延迟。此外，Agent 在会话开始时注入的上下文是**静态**的（快照），新添加的记忆可能需要重启会话（`/clear` 或重启 OpenCode）才能在"自动注入"中生效，但通过 `search` 工具可以立即查到。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| Scope 生成逻辑 | [`src/services/tags.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/tags.ts#L18-L36) | 18-36 |
| 记忆工具定义 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L183-L485) | 183-485 |
| 记忆类型定义 | [`src/types/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/types/index.ts) | - |
| 客户端实现 | [`src/services/client.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/client.ts) | 23-182 |

**关键函数**：
- `getUserTag()`: 基于 Git 邮箱生成用户标签
- `getProjectTag()`: 基于目录路径生成项目标签
- `supermemoryClient.addMemory()`: 添加记忆 API 调用
- `supermemoryClient.deleteMemory()`: 删除记忆 API 调用

</details>

## 下一课预告

> 下一课我们学习 **[抢占式压缩原理](../../advanced/compaction/index.md)**。
>
> 你会学到：
> - 为什么 Agent 会"失忆"（上下文溢出）
> - 插件如何自动检测 Token 使用率
> - 如何在不丢失关键信息的前提下压缩会话
