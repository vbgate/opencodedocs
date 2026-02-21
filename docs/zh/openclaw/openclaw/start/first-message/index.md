---
title: "发送第一条消息 - 与 AI 助手初次对话 | OpenClaw 教程"
sidebarTitle: "发送第一条消息"
subtitle: "发送第一条消息 - 与 AI 助手初次对话"
description: "学习如何通过 CLI 或消息频道与 OpenClaw Agent 进行首次对话，理解消息发送机制和会话管理。"
tags:
  - "入门"
  - "消息发送"
  - "Agent"
  - "CLI"
order: 30
---

# 发送第一条消息 - 与 AI 助手初次对话

## 学完你能做什么

完成本课程后，你将能够：
- 通过 CLI 向 AI 助手发送消息
- 理解 OpenClaw 的消息发送机制和会话管理
- 使用各种参数自定义消息发送行为
- 在不同频道中与 Agent 进行对话

## 你现在的困境

Gateway 服务已经启动，但你可能困惑于：
- 如何与 AI 助手进行实际对话？
- 消息发送有哪些方式？
- 如何管理不同的对话会话？

## 核心思路

OpenClaw 提供了多种与 AI 助手交互的方式：

```
┌─────────────────────────────────────────────────────────────┐
│                    OpenClaw 消息交互                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   CLI 方式                          频道方式                │
│   ┌──────────────┐                  ┌──────────────┐        │
│   │ openclaw     │                  │ WhatsApp     │        │
│   │   agent      │                  │ Telegram     │        │
│   │   message    │                  │ Discord      │        │
│   └──────┬───────┘                  └──────┬───────┘        │
│          │                                  │               │
│          └──────────────┬───────────────────┘               │
│                         │                                   │
│                         ▼                                   │
│              ┌────────────────────┐                        │
│              │   Gateway 服务     │                        │
│              │   会话管理          │                        │
│              └─────────┬──────────┘                        │
│                        │                                   │
│                        ▼                                   │
│              ┌────────────────────┐                        │
│              │   AI Agent (Pi)    │                        │
│              │   处理 & 响应       │                        │
│              └────────────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 会话管理概念

在 OpenClaw 中，每个对话都属于一个**会话(Session)**：
- 会话通过唯一的 `sessionKey` 标识
- 会话状态持久化在 `~/.openclaw/sessions/` 目录
- 支持多会话并行，每个会话独立维护上下文

## 跟我做

### 第 1 步：使用 agent 命令发送消息

**为什么**  
`openclaw agent` 命令是直接与 AI 助手对话的主要方式。

打开终端，输入以下命令：

```bash
# 基础用法 - 向默认 Agent 发送消息
openclaw agent --message "你好，请介绍一下你自己"

# 或者使用简写
openclaw agent -m "你好"
```

**你应该看到**  
AI 助手会处理你的消息并返回响应，类似：

```
┌─────────────────────────────────────┐
│  AI Assistant (claude-3-5-sonnet)   │
├─────────────────────────────────────┤
│  你好！我是你的 AI 助手，可以通过   │
│  各种消息频道与你交互。我可以帮助   │
│  你完成各种任务，包括代码编写、     │
│  文件操作、网页浏览等。             │
└─────────────────────────────────────┘
```

### 第 2 步：指定目标会话

**为什么**  
你可能需要与特定的会话或电话号码对话。

```bash
# 指定电话号码（E.164 格式）
openclaw agent --to "+86138xxxxxxxx" --message "你好"

# 指定会话 ID
openclaw agent --session-id "my-session-001" --message "继续我们刚才的话题"
```

### 第 3 步：调整思考深度

**为什么**  
不同任务需要不同的思考深度。复杂问题可以用更高的思考级别。

```bash
# 关闭思考 - 直接回复
openclaw agent --message "简单问题" --thinking off

# 最小思考 - 非常轻量的推理
openclaw agent --message "快速问题" --thinking minimal

# 低思考深度 - 快速响应
openclaw agent --message "简单问题" --thinking low

# 中等思考深度（默认）
openclaw agent --message "一般问题" --thinking medium

# 高思考深度 - 深度推理
openclaw agent --message "复杂问题" --thinking high
```

**思考级别对比**

| 级别 | 适用场景 | 响应速度 |
|------|----------|----------|
| `off` | 不需要推理的直答 | 最快 |
| `minimal` | 极轻量推理 | 很快 |
| `low` | 简单问答、闲聊 | 快 |
| `medium` | 一般任务 | 中等 |
| `high` | 复杂推理、代码编写 | 较慢 |

### 第 4 步：使用 message 命令发送消息

**为什么**  
`openclaw message` 命令提供了更丰富的消息操作能力。

```bash
# 发送普通消息
openclaw message send --message "你好"

# 发送给特定目标
openclaw message send --to "+86138xxxxxxxx" --message "你好"

# 使用 JSON 输出格式
openclaw message send --message "你好" --json

# 模拟发送（不实际发送）
openclaw message send --message "测试" --dry-run
```

### 第 5 步：传递图片

**为什么**  
AI 可以理解和分析图片内容。

```bash
# 发送带图片的消息
openclaw agent --message "分析这张图片" --images ./photo.png

# 多张图片
openclaw agent --message "比较这两张图" --images ./img1.png --images ./img2.png
```

## 检查点 ✅

运行以下命令验证配置：

```bash
# 检查 Gateway 是否运行
openclaw status

# 应该看到类似输出
┌─────────────────────────────────────┐
│  Gateway Status: running            │
│  Port: 18789                        │
│  Auth: token                        │
└─────────────────────────────────────┘
```

## 踩坑提醒

::: warning 常见错误
1. **Gateway 未启动**  
   错误：`Error: Gateway is not running`  
   解决：先运行 `openclaw gateway run`

2. **电话号码格式错误**  
   错误：`Invalid E.164 format`  
   解决：使用 `+86138xxxxxxxx` 格式，包含国家代码

3. **Agent 不存在**  
   错误：`Unknown agent id "xxx"`  
   解决：运行 `openclaw agents list` 查看可用 Agent

4. **思考级别不支持**  
   错误：`Thinking level "xhigh" is only supported for...`  
   解决：检查当前模型是否支持 xhigh 思考级别
:::

## 本课小结

在本课程中，你学习了：

- ✅ 使用 `openclaw agent` 命令发送消息
- ✅ 指定目标会话和电话号码
- ✅ 调整思考深度控制响应质量
- ✅ 使用 `openclaw message` 发送消息
- ✅ 传递图片给 AI 分析

## 下一课预告

> 下一课我们学习 **[配置基础](../configuration-basics/)**。
>
> 你会学到：
> - `openclaw.json` 配置文件结构
> - 环境变量的使用方法
> - 关键配置项的详细说明

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-02-14

| 功能 | 文件路径 | 行号 |
|------|----------|------|
| Agent 命令实现 | [`src/commands/agent.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/agent.ts) | 64-529 |
| Message 命令实现 | [`src/commands/message.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/message.ts) | 14-67 |
| Pi Agent 嵌入运行 | [`src/agents/pi-embedded.ts`](https://github.com/openclaw/openclaw/blob/main/src/agents/pi-embedded.ts) | - |
| 会话解析逻辑 | [`src/commands/agent/session.ts`](https://github.com/openclaw/openclaw/blob/main/src/commands/agent/session.ts) | - |
| 思考级别处理 | [`src/auto-reply/thinking.ts`](https://github.com/openclaw/openclaw/blob/main/src/auto-reply/thinking.ts) | - |

</details>
