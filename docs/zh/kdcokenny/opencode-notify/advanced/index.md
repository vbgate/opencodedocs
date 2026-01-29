---
title: "进阶使用：深入配置与优化 | opencode-notify教程"
sidebarTitle: "定制你的通知体验"
subtitle: "进阶使用：深入配置与优化"
description: "学习 opencode-notify 高级配置：配置参考、静音时段、终端检测和最佳实践。根据个人需求优化通知体验，提升工作效率。"
tags:
  - "进阶"
  - "配置"
  - "优化"
prerequisite:
  - "start-quick-start"
  - "start-how-it-works"
order: 3
---

# 进阶使用：深入配置与优化

本章节帮助你掌握 opencode-notify 的高级功能，深入了解配置选项、优化通知体验，并根据个人需求定制通知行为。

## 学习路径

建议按以下顺序学习本章节内容：

### 1. [配置参考](./config-reference/)

全面了解所有可用的配置选项及其作用。

- 掌握配置文件的结构和语法
- 学习通知音效的自定义方法
- 理解子会话通知开关的使用场景
- 了解终端类型覆盖的配置方法

### 2. [静音时段详解](./quiet-hours/)

学习如何设置静音时段以避免特定时间被打扰。

- 配置静音时段的起止时间
- 处理跨夜的静音时段（如 22:00 - 08:00）
- 在需要时临时禁用静音功能
- 理解静音时段与其他过滤规则的优先级

### 3. [终端检测原理](./terminal-detection/)

深入了解终端自动检测的工作机制。

- 学习插件如何识别 37+ 种终端模拟器
- 了解 macOS 平台的焦点检测实现
- 掌握手动指定终端类型的方法
- 理解检测失败时的默认行为

### 4. [高级用法](./advanced-usage/)

掌握配置技巧和最佳实践。

- 避免通知 spam 的配置策略
- 根据工作流程调整通知行为
- 多窗口和多终端环境下的配置建议
- 性能优化和故障排查技巧

## 前置条件

开始本章节学习前，建议先完成以下基础内容：

- ✅ **快速开始**：完成插件安装和基本配置
- ✅ **工作原理**：理解插件的核心功能和事件监听机制
- ✅ **平台特性**（可选）：了解你所使用平台的特定功能

::: tip 学习建议
如果你只是想自定义通知音效或设置静音时段，可以直接跳到对应的子页面。如果遇到问题，可以随时查阅配置参考章节。
:::

## 下一步

完成本章节学习后，你可以继续探索：

- **[故障排除](../../faq/troubleshooting/)**：解决常见问题和疑难杂症
- **[常见问题](../../faq/common-questions/)**：了解用户关心的热点问题
- **[事件类型说明](../../appendix/event-types/)**：深入学习插件监听的所有事件类型
- **[配置文件示例](../../appendix/config-file-example/)**：查看完整的配置示例和注释

---

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能        | 文件路径                                                                                    | 行号    |
|--- | --- | ---|
| 配置接口定义 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L30-L48) | 30-48   |
| 默认配置    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68   |
| 配置加载    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114  |
| 静音时段检查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| 终端检测    | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L176) | 145-176 |
| 终端进程名映射 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84   |

**关键接口**：
- `NotifyConfig`：配置接口，包含所有可配置项
- `quietHours`：静音时段配置（enabled/start/end）
- `sounds`：音效配置（idle/error/permission）
- `terminal`：终端类型覆盖（可选）

**关键常量**：
- `DEFAULT_CONFIG`：所有配置项的默认值
- `TERMINAL_PROCESS_NAMES`：终端名称到 macOS 进程名的映射表

</details>
