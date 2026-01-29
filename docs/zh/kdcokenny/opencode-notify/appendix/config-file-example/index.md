---
title: "配置文件示例：notifyChildSessions 和 sounds 说明 | opencode-notify 教程"
sidebarTitle: "自定义配置文件"
subtitle: "配置文件示例：notifyChildSessions 和 sounds 说明"
description: "查看 opencode-notify 完整的配置文件示例，学习 notifyChildSessions、sounds、quietHours、terminal 等所有配置字段的详细注释、默认值设置、最小化配置示例、macOS 可用音效完整列表和禁用插件方法，并链接到更新日志以了解版本历史和新功能改进。"
tags:
  - "配置"
  - "示例"
  - "附录"
order: 140
---

# 配置文件示例

## 完整配置示例

将以下内容保存到 `~/.config/opencode/kdco-notify.json`：

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
  },
  "terminal": "Ghostty"
}
```

## 字段说明

### notifyChildSessions

- **类型**：boolean
- **默认值**：`false`
- **说明**：是否通知子会话（子任务）

默认情况下，插件只通知父会话，避免子任务带来的通知噪音。如果你需要追踪所有子任务的完成状态，设置为 `true`。

```json
{
  "notifyChildSessions": false  // 只通知父会话（推荐）
}
```

### sounds

音效配置，只在 macOS 平台生效。

#### sounds.idle

- **类型**：string
- **默认值**：`"Glass"`
- **说明**：任务完成时的音效

当 AI 会话进入空闲状态（任务完成）时播放。

#### sounds.error

- **类型**：string
- **默认值**：`"Basso"`
- **说明**：出错时的音效

当 AI 会话执行出错时播放。

#### sounds.permission

- **类型**：string
- **默认值**：`"Submarine"`
- **说明**：权限请求时的音效

当 AI 需要用户授权执行某操作时播放。

#### sounds.question

- **类型**：string（可选）
- **默认值**：未设置（使用 permission 音效）
- **说明**：问题询问时的音效

当 AI 向用户提问时播放。如果不设置，会使用 `permission` 音效。

### quietHours

静音时段配置，避免在指定时间段内收到通知打扰。

#### quietHours.enabled

- **类型**：boolean
- **默认值**：`false`
- **说明**：是否启用静音时段

#### quietHours.start

- **类型**：string
- **默认值**：`"22:00"`
- **说明**：静音开始时间（24 小时制，HH:MM 格式）

#### quietHours.end

- **类型**：string
- **默认值**：`"08:00"`
- **说明**：静音结束时间（24 小时制，HH:MM 格式）

支持跨午夜时段，例如 `"22:00"` 到 `"08:00"` 表示晚上 10 点到次日早上 8 点不发送通知。

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

### terminal

- **类型**：string（可选）
- **默认值**：未设置（自动检测）
- **说明**：手动指定终端类型，覆盖自动检测结果

如果自动检测失败或需要手动指定，可以设置为你的终端名称。

```json
{
  "terminal": "Ghostty"  // 或 "iTerm", "Kitty", "WezTerm" 等
}
```

## macOS 可用音效列表

以下是 macOS 系统内置的通知音效，可用于 `sounds` 配置：

- Basso
- Blow
- Bottle
- Frog
- Funk
- Glass
- Hero
- Morse
- Ping
- Pop
- Purr
- Sosumi
- Submarine
- Tink

## 最小化配置示例

如果你只想修改少量设置，可以只包含需要修改的字段，其他字段会使用默认值：

```json
{
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

## 禁用插件

要临时禁用插件，删除配置文件即可，插件会恢复到默认配置。

## 下一课预告

> 下一课我们学习 **[更新日志](../changelog/release-notes/)**。
>
> 你会了解：
> - 版本历史和重要变更
> - 新功能和改进记录
