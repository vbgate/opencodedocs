---
title: "事件类型说明：了解 OpenCode 通知触发时机 | opencode-notify"
sidebarTitle: "通知什么时候发"
subtitle: "事件类型说明：了解 OpenCode 通知触发时机"
description: "学习 opencode-notify 插件监听的 OpenCode 事件类型，掌握 session.idle、session.error、permission.updated 和 tool.execute.before 的触发条件和过滤规则。"
tags:
  - "附录"
  - "事件类型"
  - "OpenCode"
prerequisite: []
order: 130
---

# 事件类型说明：了解 OpenCode 通知触发时机

本页列出 `opencode-notify` 插件监听的 **OpenCode 事件类型** 及其触发条件。插件监听四种事件：session.idle、session.error、permission.updated 和 tool.execute.before。了解这些事件的触发时机和过滤规则，有助于更好地配置通知行为。

## 事件类型概览

| 事件类型 | 触发时机 | 通知标题 | 默认音效 | 是否检查父会话 | 是否检查终端焦点 |
| -------- | -------- | -------- | -------- | -------------- | -------------- |
| `session.idle` | AI 会话进入空闲状态 | "Ready for review" | Glass | ✅ | ✅ |
| `session.error` | AI 会话执行出错 | "Something went wrong" | Basso | ✅ | ✅ |
| `permission.updated` | AI 需要用户授权 | "Waiting for you" | Submarine | ❌ | ✅ |
| `tool.execute.before` | AI 询问问题（question 工具） | "Question for you" | Submarine* | ❌ | ❌ |

> *注：question 事件默认使用 permission 音效，可通过配置自定义

## 事件详细说明

### session.idle

**触发条件**：AI 会话完成任务后进入空闲状态

**通知内容**：
- 标题：`Ready for review`
- 消息：会话标题（最多 50 字符）

**处理逻辑**：
1. 检查是否为父会话（`notifyChildSessions=false` 时）
2. 检查是否在静音时段
3. 检查终端是否聚焦（聚焦时抑制通知）
4. 发送原生通知

**源码位置**：`src/notify.ts:249-284`

---

### session.error

**触发条件**：AI 会话执行过程中出错

**通知内容**：
- 标题：`Something went wrong`
- 消息：错误摘要（最多 100 字符）

**处理逻辑**：
1. 检查是否为父会话（`notifyChildSessions=false` 时）
2. 检查是否在静音时段
3. 检查终端是否聚焦（聚焦时抑制通知）
4. 发送原生通知

**源码位置**：`src/notify.ts:286-313`

---

### permission.updated

**触发条件**：AI 需要用户授权执行某操作

**通知内容**：
- 标题：`Waiting for you`
- 消息：`OpenCode needs your input`

**处理逻辑**：
1. **不检查父会话**（权限请求始终需要人工处理）
2. 检查是否在静音时段
3. 检查终端是否聚焦（聚焦时抑制通知）
4. 发送原生通知

**源码位置**：`src/notify.ts:315-334`

---

### tool.execute.before

**触发条件**：AI 执行工具前，工具名称为 `question` 时

**通知内容**：
- 标题：`Question for you`
- 消息：`OpenCode needs your input`

**处理逻辑**：
1. **不检查父会话**
2. **不检查终端焦点**（支持 tmux 工作流）
3. 检查是否在静音时段
4. 发送原生通知

**特殊说明**：此事件不做焦点检测，以便在 tmux 多窗口工作流中正常收到通知。

**源码位置**：`src/notify.ts:336-351`

## 触发条件和过滤规则

### 父会话检查

默认情况下，插件只通知父会话（根会话），避免子任务产生大量通知。

**检查逻辑**：
- 通过 `client.session.get()` 获取会话信息
- 如果会话有 `parentID`，则跳过通知

**配置选项**：
- `notifyChildSessions: false`（默认）- 只通知父会话
- `notifyChildSessions: true` - 通知所有会话

**适用事件**：
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ❌（不检查）
- `tool.execute.before` ❌（不检查）

### 静音时段检查

在配置的静音时段内，不发送任何通知。

**检查逻辑**：
- 读取 `quietHours.enabled`、`quietHours.start`、`quietHours.end`
- 支持跨午夜时段（如 22:00-08:00）

**适用事件**：
- 所有事件 ✅

### 终端焦点检查

当用户正在查看终端时，抑制通知，避免重复提醒。

**检查逻辑**：
- macOS：通过 `osascript` 获取前台应用名称
- 比较 `frontmostApp` 与终端 `processName`

**适用事件**：
- `session.idle` ✅
- `session.error` ✅
- `permission.updated` ✅
- `tool.execute.before` ❌（不检查，支持 tmux）

## 平台差异

| 功能 | macOS | Windows | Linux |
| ---- | ----- | ------- | ----- |
| 原生通知 | ✅ | ✅ | ✅ |
| 终端焦点检测 | ✅ | ❌ | ❌ |
| 点击通知聚焦终端 | ✅ | ❌ | ❌ |
| 自定义音效 | ✅ | ❌ | ❌ |

## 配置影响

通知行为可通过配置文件自定义：

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine",
    "question": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**相关教程**：
- [配置参考](../../advanced/config-reference/)
- [静音时段详解](../../advanced/quiet-hours/)

---

## 下一课预告

> 下一课我们学习 **[配置文件示例](../config-file-example/)**。
>
> 你会学到：
> - 完整的配置文件模板
> - 所有配置字段的详细注释
> - 配置文件的默认值说明

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 事件类型 | 文件路径 | 行号 | 处理函数 |
| -------- | -------- | ---- | -------- |
| session.idle | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 | `handleSessionIdle` |
| session.error | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 | `handleSessionError` |
| permission.updated | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 | `handlePermissionUpdated` |
| tool.execute.before | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 | `handleQuestionAsked` |
| 事件监听器设置 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L367-L402) | 367-402 | `NotifyPlugin` |

**关键常量**：
- `DEFAULT_CONFIG` (L56-68)：默认配置，包含音效和静音时段设置
- `TERMINAL_PROCESS_NAMES` (L71-84)：终端名称到 macOS 进程名的映射

**关键函数**：
- `sendNotification()` (L227-243)：发送原生通知，处理 macOS 聚焦功能
- `isParentSession()` (L205-214)：检查是否为父会话
- `isQuietHours()` (L181-199)：检查是否在静音时段
- `isTerminalFocused()` (L166-175)：检查终端是否聚焦（仅 macOS）

</details>
