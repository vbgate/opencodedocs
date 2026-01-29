---
title: "macOS 平台特性：焦点检测、点击聚焦和自定义音效 | opencode-notify"
sidebarTitle: "点击通知回到终端"
subtitle: "macOS 平台特性"
description: "学习 opencode-notify 在 macOS 平台的独有功能：智能焦点检测避免重复通知、点击通知自动聚焦终端、12 种内置音效自定义。本教程详细讲解配置方法、可用音效列表和实用技巧，帮你充分利用 macOS 原生通知能力，提升工作效率，减少不必要的窗口切换。"
tags:
  - "平台特性"
  - "macOS"
  - "焦点检测"
prerequisite:
  - "start-quick-start"
order: 30
---

# macOS 平台特性

## 学完你能做什么

- ✅ 配置智能焦点检测，让插件知道你在看终端
- ✅ 点击通知自动聚焦终端窗口
- ✅ 自定义不同事件的通知音效
- ✅ 理解 macOS 平台独有的优势和限制

## 你现在的困境

你使用 OpenCode 时经常切换窗口：AI 在后台运行任务，你切换到浏览器查资料，每过几十秒就得切回去看看：任务完成了吗？出错了？还是在等待你的输入？

如果有个原生的桌面通知就好了，就像收到微信消息那样，AI 完成任务或需要你时提醒你一下。

## 什么时候用这一招

- **你在 macOS 上使用 OpenCode** - 本课内容仅适用于 macOS
- **你希望优化工作流** - 避免频繁切窗口检查 AI 状态
- **你想要更好的通知体验** - 利用 macOS 原生通知的优势

::: info 为什么 macOS 更强大？
macOS 平台提供完整的通知能力：焦点检测、点击聚焦、自定义音效。Windows 和 Linux 目前只支持基础的原生通知功能。
:::

## 🎒 开始前的准备

在开始之前，确保你已经完成：

::: warning 前置检查
- [ ] 已完成[快速开始](../../start/quick-start/)教程
- [ ] 插件已安装并正常工作
- [ ] 使用 macOS 系统
:::

## 核心思路

macOS 平台的完整通知体验建立在三个关键能力上：

### 1. 智能焦点检测

插件知道你当前是否在看终端窗口。如果你正在审查 AI 的输出，就不会再发通知打扰你。只有当你切换到其他应用时，通知才会发送。

**实现原理**：通过 macOS 的 `osascript` 系统服务查询当前前台应用的进程名，与你使用的终端进程名进行对比。

### 2. 点击通知聚焦终端

收到通知后，直接点击通知卡片，终端窗口会自动置顶。你可以立即回到工作状态。

**实现原理**：macOS Notification Center 支持 `activate` 选项，传入应用的 Bundle ID 就能实现点击聚焦。

### 3. 自定义音效

为不同类型的事件设置不同的声音：任务完成用清脆的音效，出错用低沉的音效，让你不看通知也能大致了解情况。

**实现原理**：利用 macOS 系统内置的 14 种标准音效（如 Glass、Basso、Submarine），配置文件的 `sounds` 字段指定即可。

::: tip 三大能力的协作
焦点检测避免打扰 → 点击通知快速回归 → 音效快速区分事件类型
:::

## 跟我做

### 第 1 步：验证自动检测的终端

插件会在启动时自动检测你使用的终端模拟器。让我们检查一下是否识别正确。

**为什么**

插件需要知道你的终端是什么，才能实现焦点检测和点击聚焦功能。

**操作**

1. 打开你的 OpenCode 配置目录：
   ```bash
   ls ~/.config/opencode/
   ```

2. 如果你已经创建过 `kdco-notify.json` 配置文件，查看是否有 `terminal` 字段：
   ```bash
   cat ~/.config/opencode/kdco-notify.json
   ```

3. 如果配置文件中没有 `terminal` 字段，说明插件正在使用自动检测。

**你应该看到**

如果配置文件中没有 `terminal` 字段，插件会自动检测。支持的终端包括：
- **常见终端**：Ghostty、Kitty、iTerm2、WezTerm、Alacritty
- **系统终端**：macOS 自带的 Terminal.app
- **其他终端**：Hyper、Warp、VS Code 集成终端等

::: info 37+ 终端支持
插件使用 `detect-terminal` 库，支持 37+ 终端模拟器。如果你的终端不在常用列表中，也会尝试自动识别。
:::

### 第 2 步：配置自定义音效

macOS 提供了 14 种内置音效，你可以为不同事件分配不同的声音。

**为什么**

不同的声音让你不看通知就能大致了解发生了什么：任务完成还是出错，AI 在等待还是仅仅完成任务。

**操作**

1. 打开或创建配置文件：
   ```bash
   nano ~/.config/opencode/kdco-notify.json
   ```

2. 添加或修改 `sounds` 配置：

```json
{
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

3. 保存并退出（Ctrl+O，Enter，Ctrl+X）

**你应该看到**

配置文件中 `sounds` 字段有四个选项：

| 字段 | 作用 | 默认值 | 推荐设置 |
|--- | --- | --- | ---|
| `idle` | 任务完成音效 | Glass | Glass（清脆） |
| `error` | 错误通知音效 | Basso | Basso（低沉） |
| `permission` | 权限请求音效 | Submarine | Submarine（提醒） |
| `question` | AI 提问音效（可选） | permission | Purr（柔和） |

::: tip 推荐组合
这个默认组合符合直觉：完成用轻快的声音，出错用警告的声音，权限请求用提醒的声音。
:::

### 第 3 步：了解可用的音效列表

macOS 有 14 种内置音效，你可以随意组合。

**为什么**

了解所有可用的音效，帮你找到最适合自己工作习惯的组合。

**可用音效**

| 音效名 | 听感特点 | 适用场景 |
|--- | --- | ---|
| Glass | 轻快、清脆 | 任务完成 |
| Basso | 低沉、警告 | 错误通知 |
| Submarine | 提醒、柔和 | 权限请求 |
| Blow | 强劲 | 重要事件 |
| Bottle | 清脆 | 子任务完成 |
| Frog | 轻松 | 非正式提醒 |
| Funk | 节奏感 | 多任务完成 |
| Hero | 宏伟 | 里程碑完成 |
| Morse | 摩尔斯电码 | 调试相关 |
| Ping | 清脆 | 轻量级提醒 |
| Pop | 短促 | 快速任务 |
| Purr | 柔和 | 不打扰提醒 |
| Sosumi | 独特 | 特殊事件 |
| Tink | 清亮 | 小任务完成 |

::: tip 听音识意
设置完成后，试试不同音效的组合，找到最适合你工作流程的配置。
:::

### 第 4 步：测试点击聚焦功能

点击通知后，终端窗口会自动置顶。这是 macOS 的独有功能。

**为什么**

当你收到通知时，不需要手动切换到终端并寻找窗口，点击通知直接回到工作状态。

**操作**

1. 确保 OpenCode 正在运行，并启动一个 AI 任务
2. 切换到其他应用（如浏览器）
3. 等待 AI 任务完成，你会收到 "Ready for review" 通知
4. 点击通知卡片

**你应该看到**

- 通知消失
- 终端窗口自动置顶并获得焦点
- 你可以立即审查 AI 的输出

::: info 聚焦原理
插件通过 osascript 动态获取终端应用的 Bundle ID，然后在发送通知时传入 `activate` 选项。macOS Notification Center 收到这个选项后，点击通知就会自动激活对应应用。
:::

### 第 5 步：验证焦点检测功能

当你正在查看终端时，不会收到通知。这样避免重复提醒。

**为什么**

如果你已经在看终端，通知就是多余的。只有当你切换到其他应用时，通知才有意义。

**操作**

1. 打开 OpenCode，启动一个 AI 任务
2. 保持终端窗口在前台（不要切换）
3. 等待任务完成

**你应该看到**

- 没有收到 "Ready for review" 通知
- 终端内显示任务完成

**接着试试**：

1. 启动另一个 AI 任务
2. 切换到浏览器或其他应用
3. 等待任务完成

**你应该看到**

- 收到了 "Ready for review" 通知
- 播放了配置的音效（默认 Glass）

::: tip 焦点检测的智能之处
插件知道你什么时候在看终端，什么时候不在。这样既不会错过重要提醒，也不会被重复通知打扰。
:::

## 检查点 ✅

### 配置检查

- [ ] 配置文件 `~/.config/opencode/kdco-notify.json` 存在
- [ ] `sounds` 字段已配置（至少包含 idle、error、permission）
- [ ] 没有设置 `terminal` 字段（使用自动检测）

### 功能检查

- [ ] AI 任务完成后能收到通知
- [ ] 点击通知后终端窗口置顶
- [ ] 在终端窗口前台时，不会收到重复通知
- [ ] 不同事件类型播放不同的音效

::: danger 焦点检测失效？
如果点击通知后终端没有置顶，可能是：
1. 终端应用没有被正确识别 - 检查配置文件中的 `terminal` 字段
2. Bundle ID 获取失败 - 查看 OpenCode 日志中的错误信息
:::

## 踩坑提醒

### 音效不播放

**问题**：配置了音效，但通知时没有声音

**可能原因**：
1. 系统音量太低或静音
2. macOS 系统偏好设置中禁用了通知声音

**解决方法**：
1. 检查系统音量和通知设置
2. 打开「系统设置 → 通知 → OpenCode」，确保启用了声音

### 点击通知没有聚焦

**问题**：点击通知后，终端窗口没有置顶

**可能原因**：
1. 终端应用没有被自动检测到
2. Bundle ID 获取失败

**解决方法**：
1. 手动指定终端类型：
   ```json
   {
     "terminal": "ghostty"  // 或其他终端名
   }
   ```

2. 确保终端应用名称正确（大小写敏感）

### 焦点检测不工作

**问题**：即使终端在前台，仍然收到通知

**可能原因**：
1. 终端进程名检测失败
2. 终端应用不在自动检测列表中

**解决方法**：
1. 手动指定终端类型：
   ```json
   {
     "terminal": "ghostty"  // 或其他终端名
   }
   ```

2. 确保终端应用名称正确（大小写敏感）
3. 查看日志，确认终端是否被正确识别

## 本课小结

macOS 平台提供了完整的通知体验：

| 功能 | 作用 | 平台支持 |
|--- | --- | ---|
| 原生通知 | 显示系统级通知 | ✅ macOS<br>✅ Windows<br>✅ Linux |
| 自定义音效 | 不同事件不同声音 | ✅ macOS |
| 焦点检测 | 避免重复通知 | ✅ macOS |
| 点击聚焦 | 快速回归工作 | ✅ macOS |

**核心配置**：
```json
{
  "sounds": {
    "idle": "Glass",       // 任务完成
    "error": "Basso",      // 出错
    "permission": "Submarine"  // 权限请求
  }
}
```

**工作流程**：
1. AI 完成任务 → 发送通知 → 播放 Glass 音效
2. 你在浏览器工作 → 收到通知 → 点击
3. 终端自动置顶 → 审查 AI 输出

## 下一课预告

> 下一课我们学习 **[Windows 平台特性](../windows/)**。
>
> 你会学到：
> - Windows 平台支持哪些功能
> - 与 macOS 相比有哪些差异
> - 如何在 Windows 上配置通知

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 焦点检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| 点击聚焦 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L238-L240) | 238-240 |
| Bundle ID 获取 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| 前台应用检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| 终端名称映射 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 默认音效配置 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L59-L61) | 59-61 |
| macOS 音效列表 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L81) | 81 |
| 平台功能对比表 | [`README.md`](https://github.com/kdcokenny/opencode-notify/blob/main/README.md#L54-L62) | 54-62 |

**关键常量**：

- `TERMINAL_PROCESS_NAMES` (行 71-84)：终端名称到 macOS 进程名的映射表
  - `ghostty` → `"Ghostty"`
  - `kitty` → `"kitty"`
  - `iterm` / `iterm2` → `"iTerm2"`
  - `wezterm` → `"WezTerm"`
  - `alacritty` → `"Alacritty"`
  - `terminal` / `apple_terminal` → `"Terminal"`
  - `hyper` → `"Hyper"`
  - `warp` → `"Warp"`
  - `vscode` → `"Code"`
  - `vscode-insiders` → `"Code - Insiders"`

**默认配置**：

- `sounds.idle = "Glass"`：任务完成音效
- `sounds.error = "Basso"`：错误通知音效
- `sounds.permission = "Submarine"`：权限请求音效

**关键函数**：

- `isTerminalFocused(terminalInfo)` (行 166-175)：检测终端是否为前台应用
  - 使用 `osascript` 获取前台应用进程名
  - 与终端的 `processName` 进行对比（不区分大小写）
  - 仅在 macOS 平台启用

- `getBundleId(appName)` (行 135-137)：动态获取应用的 Bundle ID
  - 使用 `osascript` 查询
  - Bundle ID 用于点击通知聚焦功能

- `getFrontmostApp()` (行 139-143)：获取当前前台应用
  - 使用 `osascript` 查询 System Events
  - 返回前台应用的进程名

- `sendNotification(options)` (行 227-243)：发送通知
  - macOS 特性：如果检测到平台为 darwin 且有 `terminalInfo.bundleId`，设置 `activate` 选项实现点击聚焦

</details>
