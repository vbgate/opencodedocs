---
title: "上下文注入: Agent 未卜先知 | opencode-supermemory"
sidebarTitle: "让 Agent 未卜先知"
subtitle: "上下文注入: Agent 未卜先知"
description: "学习 opencode-supermemory 的自动上下文注入机制。了解 Agent 如何在会话开始时获取用户画像和项目知识，掌握关键词触发记忆保存的方法。"
tags:
  - "context"
  - "injection"
  - "prompt"
  - "memory"
prerequisite:
  - "start-getting-started"
order: 1
---

# 自动上下文注入机制：让 Agent "未卜先知"

## 学完你能做什么

学完本课，你将能够：
1.  **理解** 为什么 Agent 一上来就知道你的编码习惯和项目架构。
2.  **掌握** 上下文注入的 "三维模型"（用户画像、项目知识、相关记忆）。
3.  **学会** 使用关键词（如 "Remember this"）主动干预 Agent 的记忆行为。
4.  **配置** 注入的条目数量，平衡上下文长度与信息丰富度。

---

## 核心思路

在没有记忆插件之前，每次开启新会话，Agent 都是一张白纸。你必须重复告诉它："我是用 TypeScript 的"、"这个项目用的是 Next.js"。

**上下文注入（Context Injection）** 解决了这个问题。它就像在 Agent 醒来的一瞬间，把一份 "任务简报" 塞进它的脑子里。

### 触发时机

opencode-supermemory 极其克制，只在 **会话的第一条消息** 时触发自动注入。

- **为什么是第一条？** 因为这是确立会话基调的关键时刻。
- **后续消息呢？** 后续消息不再自动注入，以免干扰对话流，除非你主动触发（见下文 "关键词触发"）。

### 三维注入模型

插件会并行获取三类数据，组合成一个 `[SUPERMEMORY]` 提示块：

| 数据维度 | 来源 | 作用 | 示例 |
| :--- | :--- | :--- | :--- |
| **1. 用户画像** (Profile) | `getProfile` | 你的长期偏好 | "用户喜欢函数式编程"、"偏好箭头函数" |
| **2. 项目知识** (Project) | `listMemories` | 当前项目的全局知识 | "本项目使用 Clean Architecture"、"API 放在 src/api" |
| **3. 相关记忆** (Relevant) | `searchMemories` | 与你第一句话相关的过往经验 | 你问 "怎么修这个 Bug"，它搜出之前的类似修复记录 |

---

## 注入了什么？

当你在 OpenCode 中发送第一条消息时，插件会在后台默默地将以下内容插入到 System Prompt 中。

::: details 点击查看注入内容的真实结构
```text
[SUPERMEMORY]

User Profile:
- User prefers concise responses
- User uses Zod for all validations

Recent Context:
- Working on auth module refactoring

Project Knowledge:
- [100%] Architecture follows MVC pattern
- [100%] Use 'npm run test' for testing

Relevant Memories:
- [85%] Previous fix for hydration error: use useEffect
```
:::

Agent 看到这些信息后，就会表现得像一个在这个项目工作了很久的老员工，而不是新来的实习生。

---

## 关键词触发机制 (Nudge)

除了开头的自动注入，你还可以在对话过程中随时 "唤醒" 记忆功能。

插件内置了一个 **关键词检测器**。只要你的消息中包含特定的触发词，插件就会向 Agent 发送一个 "隐形提示"（Nudge），强制它调用保存工具。

### 默认触发词

- `remember`
- `save this`
- `don't forget`
- `memorize`
- `take note`
- ... (更多见源码配置)

### 交互示例

**你输入**：
> 这里的 API 响应格式变了，**remember** 以后都用 `data.result` 而不是 `data.payload`。

**插件检测到 "remember"**：
> （后台注入提示）：`[MEMORY TRIGGER DETECTED] The user wants you to remember something...`

**Agent 反应**：
> 收到。我会记住这个变更。
> *(后台调用 `supermemory.add` 保存记忆)*

---

## 深度配置

你可以通过修改 `~/.config/opencode/supermemory.jsonc` 来调整注入行为。

### 常用配置项

```jsonc
{
  // 是否注入用户画像（默认 true）
  "injectProfile": true,

  // 每次注入多少条项目记忆（默认 10）
  // 调大能让 Agent 更了解项目，但会消耗更多 Token
  "maxProjectMemories": 10,

  // 每次注入多少条用户画像条目（默认 5）
  "maxProfileItems": 5,

  // 自定义触发词（支持正则）
  "keywordPatterns": [
    "记一下",
    "永久保存"
  ]
}
```

::: tip 提示
配置修改后，需要重启 OpenCode 或重载插件才能生效。
:::

---

## 常见问题

### Q: 注入的信息会占用很多 Token 吗？
**A**: 会占用一部分，但通常可控。默认配置下（10条项目记忆 + 5条画像），大约占用 500-1000 Token。对于现代大模型（如 Claude 3.5 Sonnet）的 200k 上下文来说，这只是九牛一毛。

### Q: 为什么我说了 "remember" 它没反应？
**A**: 
1. 检查是否拼写正确（支持正则匹配）。
2. 确认 API Key 是否配置正确（如果插件未初始化，不会触发）。
3. Agent 可能决定忽略（虽然插件强制提示了，但 Agent 有最终决定权）。

### Q: "相关记忆" 是怎么搜出来的？
**A**: 它是基于你 **第一条消息的内容** 进行语义搜索的。如果你第一句话只说了 "Hi"，可能搜不出什么有用的相关记忆，但 "项目知识" 和 "用户画像" 依然会被注入。

---

## 本课小结

- **自动注入** 仅在会话第一条消息触发。
- **三维模型** 包含用户画像、项目知识和相关记忆。
- **关键词触发** 让你可以随时命令 Agent 保存记忆。
- 通过 **配置文件** 可以控制注入的信息量。

## 下一课预告

> 下一课我们学习 **[工具集详解：教 Agent 记忆](../tools/index.md)**。
>
> 你会学到：
> - 如何手动使用 `add`、`search` 等工具。
> - 如何查看和删除错误的记忆。

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-23

| 功能 | 文件路径 | 行号 |
| :--- | :--- | :--- |
| 注入触发逻辑 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L125-L176) | 125-176 |
| 关键词检测 | [`src/index.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/index.ts#L34-L37) | 34-37 |
| Prompt 格式化 | [`src/services/context.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/services/context.ts#L14-L64) | 14-64 |
| 默认配置 | [`src/config.ts`](https://github.com/supermemoryai/opencode-supermemory/blob/main/src/config.ts#L44-L54) | 44-54 |

**关键函数**：
- `formatContextForPrompt()`: 组装 `[SUPERMEMORY]` 文本块。
- `detectMemoryKeyword()`: 正则匹配用户消息中的触发词。

</details>

## 下一课预告

> 下一课我们学习 **[工具集详解：教 Agent 记忆](../tools/index.md)**。
>
> 你会学到：
> - 掌握 `add`, `search`, `profile` 等 5 种核心工具模式
> - 如何手动干预和修正 Agent 的记忆
> - 使用自然语言触发记忆保存
