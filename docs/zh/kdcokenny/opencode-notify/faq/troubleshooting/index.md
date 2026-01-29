---
title: "故障排除：通知不显示、焦点检测失效等常见问题 | opencode-notify 教程"
sidebarTitle: "通知不显示怎么办"
subtitle: "故障排除：通知不显示、焦点检测失效等常见问题"
description: "解决 opencode-notify 使用中的常见问题，包括通知不显示、焦点检测失效、配置错误、音效不播放等。学会排查 macOS 通知权限、静音时段设置、终端检测等问题，快速恢复插件正常工作。"
tags:
  - "故障排除"
  - "FAQ"
prerequisite:
  - "start-quick-start"
order: 110
---

# 故障排除：通知不显示、焦点检测失效等常见问题

## 学完你能做什么

- 快速定位通知不显示的原因
- 解决 macOS 通知权限问题
- 排查焦点检测失效的问题
- 修复配置文件格式错误
- 了解平台功能差异

## 你现在的困境

AI 完成了任务，但没有收到通知；或者点击通知后终端没有置顶。不知道哪里出了问题，也不知道该从哪里开始排查。

## 什么时候用这一招

- 安装插件后第一次使用，没有收到任何通知
- 更新插件或系统后，通知突然不工作了
- 想禁用某些通知行为，但配置似乎没生效
- 从 macOS 切换到 Windows/Linux，发现某些功能不可用

## 核心思路

opencode-notify 的工作流程比较简单，但涉及的环节较多：OpenCode SDK → 事件监听 → 过滤逻辑 → 操作系统通知。任何一个环节出问题，都可能导致通知不显示。

排查的关键是**按顺序检查每个环节**，从最可能的原因开始。80% 的问题都可以通过以下 5 类问题解决：

1. **通知不显示** - 最常见的问题
2. **焦点检测失效**（仅 macOS）
3. **配置不生效** - JSON 格式或路径错误
4. **音效不播放**（仅 macOS）
5. **平台差异** - 某些功能不支持

---

## 问题 1：通知不显示

这是最常见的问题，可能的原因有 6 种。按顺序检查：

### 1.1 检查插件是否正确安装

**症状**：OpenCode 正常运行，但从未收到任何通知。

**排查步骤**：

```bash
# 检查插件是否已安装
ls ~/.opencode/plugin/kdco-notify

# 如果不存在，重新安装
ocx add kdco/notify
```

**你应该看到**：`~/.opencode/plugin/kdco-notify` 目录存在，并且包含 `package.json` 和 `src/notify.ts` 等文件。

::: tip 手动安装检查
如果你使用手动安装，确保：
1. 已安装依赖：`npm install node-notifier detect-terminal`
2. 插件文件在正确的位置：`~/.opencode/plugin/`
3. OpenCode 已重启（插件更改需要重启）
:::

### 1.2 检查 macOS 通知权限

**症状**：仅限 macOS 用户，插件已安装，但从未收到通知。

**原因**：macOS 需要明确授权终端应用发送通知的权限。

**排查步骤**：

```bash
# 1. 打开系统设置
# macOS Ventura 及以上：系统设置 → 通知与焦点模式
# macOS 旧版本：系统偏好设置 → 通知

# 2. 找到你的终端应用（如 Ghostty、iTerm2、Terminal.app）
# 3. 确保"允许通知"已开启
# 4. 确保"在锁定屏幕上"和"在屏幕锁定时显示横幅"已开启
```

**你应该看到**：你的终端应用在通知设置中，且"允许通知"开关为绿色。

::: warning 常见错误
OpenCode 本身不会出现在通知设置中，你需要授权的是**终端应用**（Ghostty、iTerm2、Terminal.app 等），不是 OpenCode。
:::

### 1.3 检查静音时段设置

**症状**：特定时间段内没有通知，其他时间段有通知。

**原因**：配置文件中启用了静音时段。

**排查步骤**：

```bash
# 检查配置文件
cat ~/.config/opencode/kdco-notify.json
```

**解决方案**：

```json
{
  "quietHours": {
    "enabled": false,  // 改为 false 禁用静音时段
    "start": "22:00",
    "end": "08:00"
  }
}
```

**你应该看到**：`quietHours.enabled` 为 `false`，或者当前时间不在静音时段内。

::: tip 跨午夜静音时段
静音时段支持跨午夜（如 22:00-08:00），这是正确的行为。如果当前时间是晚上 10 点到次日早上 8 点之间，通知会被抑制。
:::

### 1.4 检查终端窗口焦点

**症状**：当你正在看终端时，没有收到通知。

**原因**：这是**预期行为**，不是 bug。焦点检测机制会在你查看终端时抑制通知，避免重复提醒。

**排查步骤**：

**检查是否聚焦终端**：
1. 切换到其他应用（如浏览器、VS Code）
2. 让 AI 执行一个任务
3. 等待任务完成

**你应该看到**：在其他应用中时，通知正常显示。

::: tip 焦点检测说明
焦点检测是内置行为，无法通过配置禁用。插件默认会抑制终端聚焦时的通知，避免重复提醒。这是设计的预期行为。
:::

### 1.5 检查子会话过滤

**症状**：AI 执行了多个子任务，但没有收到每个子任务的通知。

**原因**：这是**预期行为**。插件默认只通知父会话，不通知子会话，避免通知轰炸。

**排查步骤**：

**理解父会话与子会话**：
- 父会话：你直接让 AI 执行的任务（如"优化代码库"）
- 子会话：AI 自己拆分的子任务（如"优化 src/components"、"优化 src/utils"）

**如果你确实需要子会话通知**：

```json
{
  "notifyChildSessions": true
}
```

**你应该看到**：每个子会话完成时都会收到通知。

::: tip 推荐做法
除非你在监控多个并发任务，否则保持 `notifyChildSessions: false`，只接收父会话通知即可。
:::

### 1.6 检查配置文件是否被删除或重命名

**症状**：之前有通知，突然不显示了。

**排查步骤**：

```bash
# 检查配置文件是否存在
ls -la ~/.config/opencode/kdco-notify.json
```

**解决方案**：

如果配置文件被删除或路径错误，插件会使用默认配置：

**删除配置文件，恢复默认**：

```bash
# 删除配置文件，使用默认设置
rm ~/.config/opencode/kdco-notify.json
```

**你应该看到**：插件重新开始发送通知（使用默认配置）。

---

## 问题 2：焦点检测失效（仅 macOS）

**症状**：你在看终端时，仍然收到通知，焦点检测似乎没有生效。

### 2.1 检查终端是否被正确检测

**原因**：插件使用 `detect-terminal` 库自动识别终端，如果识别失败，焦点检测就无法工作。

**排查步骤**：

```bash
# 检查终端检测是否正常
node -e "console.log(require('detect-terminal')())"
```

**你应该看到**：输出你的终端名称（如 `ghostty`、`iterm2` 等）。

如果输出为空，说明终端检测失败。

### 2.2 手动指定终端类型

**如果自动检测失败，可以手动指定**：

```json
{
  "terminal": "ghostty"  // 替换为你的终端名称
}
```

**支持的终端名称**（小写）：

| 终端 | 名称 | 终端 | 名称 |
|--- | --- | --- | ---|
| Ghostty | `ghostty` | Kitty | `kitty` |
| iTerm2 | `iterm2` 或 `iterm` | WezTerm | `wezterm` |
| Alacritty | `alacritty` | macOS Terminal | `terminal` 或 `apple_terminal` |
| Hyper | `hyper` | Warp | `warp` |
| VS Code 终端 | `vscode` | VS Code Insiders | `vscode-insiders` |

::: tip 进程名映射
插件内部有终端名称到 macOS 进程名的映射表。如果你手动指定了 `terminal`，确保使用映射表中的名称（第 71-84 行）。
:::

---

## 问题 3：配置不生效

**症状**：修改了配置文件，但插件行为没有变化。

### 3.1 检查 JSON 格式是否正确

**常见错误**：

```json
// ❌ 错误：缺少引号
{
  notifyChildSessions: true
}

// ❌ 错误：尾部逗号
{
  "notifyChildSessions": true,
}

// ❌ 错误：注释不支持
{
  "notifyChildSessions": true  // 这会导致 JSON 解析失败
}
```

**正确格式**：

```json
{
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  },
  "quietHours": {
    "enabled": false,
    "start": "22:00",
    "end": "08:00"
  }
}
```

**验证 JSON 格式**：

```bash
# 使用 jq 验证 JSON 格式
cat ~/.config/opencode/kdco-notify.json | jq '.'

# 如果输出格式化的 JSON，说明格式正确
# 如果报错，说明 JSON 有问题
```

### 3.2 检查配置文件路径

**症状**：创建了配置文件，但插件似乎没读取。

**正确路径**：

```
~/.config/opencode/kdco-notify.json
```

**排查步骤**：

```bash
# 检查配置文件是否存在
ls -la ~/.config/opencode/kdco-notify.json

# 如果不存在，创建目录和文件
mkdir -p ~/.config/opencode
cat > ~/.config/opencode/kdco-notify.json << 'EOF'
{
  "notifyChildSessions": false
}
EOF
```

### 3.3 重启 OpenCode

**原因**：插件在启动时加载一次配置，修改后需要重启。

**排查步骤**：

```bash
# 完全重启 OpenCode
# 1. 退出 OpenCode
# 2. 重新启动 OpenCode
```

---

## 问题 4：音效不播放（仅 macOS）

**症状**：通知正常显示，但没有播放音效。

### 4.1 检查音效名称是否正确

**支持的 macOS 音效**：

| 音效名称 | 说明 | 音效名称 | 说明 |
|--- | --- | --- | ---|
| Basso | 低音 | Blow | 吹气声 |
| Bottle | 瓶子声 | Frog | 青蛙声 |
| Funk | 放克 | Glass | 玻璃声（默认任务完成） |
| Hero | 英雄 | Morse | 摩尔斯电码 |
| Ping | 叮声 | Pop | 气泡声 |
| Purr | 呼噜声 | Sosumi | Sosumi |
| Submarine | 潜艇（默认权限请求） | Tink | 叮叮声 |

**配置示例**：

```json
{
  "sounds": {
    "idle": "Glass",      // 任务完成音效
    "error": "Basso",    // 错误音效
    "permission": "Submarine",  // 权限请求音效
    "question": "Ping"   // 问题询问音效（可选）
  }
}
```

### 4.2 检查系统音量设置

**排查步骤**：

```bash
# 打开系统设置 → 声音 → 输出音量
# 确保音量未静音，且音量适中
```

### 4.3 其他平台不支持自定义音效

**症状**：Windows 或 Linux 用户，配置了音效但没有声音。

**原因**：自定义音效是 macOS 独有功能，Windows 和 Linux 不支持。

**解决方案**：Windows 和 Linux 用户会收到通知，但音效由系统默认设置控制，无法通过插件配置。

::: tip Windows/Linux 音效
Windows 和 Linux 的通知音效由系统设置控制：
- Windows：设置 → 系统 → 通知 → 选择通知音效
- Linux：桌面环境设置 → 通知 → 音效
:::

---

## 问题 5：点击通知不聚焦（仅 macOS）

**症状**：点击通知后，终端窗口没有置顶。

### 5.1 检查 Bundle ID 是否获取成功

**原因**：点击通知聚焦功能需要获取终端的 Bundle ID（如 `com.ghostty.Ghostty`），如果获取失败，就无法聚焦。

**排查步骤**：

插件会在启动时自动检测终端并获取 Bundle ID。如果失败，点击通知聚焦功能不可用。

**常见原因**：
1. 终端不在映射表中（如自定义终端）
2. `osascript` 执行失败（macOS 权限问题）

**解决方案**：手动指定终端类型（见 2.2 节）。

### 5.2 检查系统辅助功能权限

**原因**：macOS 需要"辅助功能"权限才能控制其他应用的窗口。

**排查步骤**：

```bash
# 打开系统设置 → 隐私与安全性 → 辅助功能
# 确保终端应用有辅助功能权限
```

**你应该看到**：你的终端应用（Ghostty、iTerm2 等）在辅助功能列表中，且开关已开启。

---

## 问题 6：平台功能差异

**症状**：从 macOS 切换到 Windows/Linux，发现某些功能不可用。

### 6.1 功能对比表

| 功能 | macOS | Windows | Linux |
|--- | --- | --- | ---|
| 原生通知 | ✅ | ✅ | ✅ |
| 自定义音效 | ✅ | ❌ | ❌ |
| 焦点检测 | ✅ | ❌ | ❌ |
| 点击通知聚焦 | ✅ | ❌ | ❌ |
| 终端检测 | ✅ | ✅ | ✅ |
| 静音时段 | ✅ | ✅ | ✅ |
| 子会话通知 | ✅ | ✅ | ✅ |

**说明**：
- **Windows/Linux**：只支持基础通知功能，高级功能（焦点检测、点击聚焦、自定义音效）不可用
- **macOS**：支持所有功能

### 6.2 配置文件跨平台兼容性

**问题**：在 macOS 上配置了 `sounds`，切换到 Windows 后音效不生效。

**原因**：`sounds` 配置只在 macOS 上有效。

**解决方案**：配置文件可以跨平台使用，插件会自动忽略不支持的配置项。无需删除 `sounds` 字段，Windows/Linux 会静默忽略。

::: tip 最佳实践
使用同一套配置文件在多个平台之间切换，插件会自动处理平台差异。无需为每个平台创建单独的配置文件。
:::

---

## 本课小结

opencode-notify 的故障排查可以归纳为以下 6 类问题：

1. **通知不显示**：检查插件安装、macOS 通知权限、静音时段、终端焦点、子会话过滤、插件是否禁用
2. **焦点检测失效**（macOS）：检查终端是否被正确检测，或手动指定终端类型
3. **配置不生效**：检查 JSON 格式、配置文件路径、重启 OpenCode
4. **音效不播放**（macOS）：检查音效名称是否正确，确认音效只在 macOS 支持
5. **点击通知不聚焦**（macOS）：检查 Bundle ID 获取和辅助功能权限
6. **平台功能差异**：Windows/Linux 只支持基础通知，高级功能仅在 macOS 可用

**快速排查清单**：

```
□ 插件是否正确安装？
□ macOS 通知权限是否授权？
□ 静音时段是否启用？
□ 终端是否聚焦？
□ 子会话过滤是否启用？
□ 配置文件 JSON 格式是否正确？
□ 配置文件路径是否正确？
□ 是否重启了 OpenCode？
□ 音效名称是否在支持列表中（仅 macOS）？
□ Bundle ID 是否获取成功（仅 macOS）？
□ 系统音量是否正常？
```

---

## 下一课预告

> 下一课我们学习 **[常见问题](../common-questions/)**。
>
> 你会学到：
> - opencode-notify 是否会增加对话上下文的开销
> - 会不会收到大量通知轰炸
> - 如何临时禁用通知
> - 性能影响和隐私安全问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 配置加载与错误处理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L90-L114) | 90-114 |
| 终端检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS osascript 执行 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L120-L133) | 120-133 |
| 终端焦点检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |
| 静音时段检查 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L181-L199) | 181-199 |
| 父会话检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L205-L214) | 205-214 |
| 通知发送 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L227-L243) | 227-243 |
| 默认配置 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L56-L68) | 56-68 |
| 终端进程名映射 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 任务完成处理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L249-L284) | 249-284 |
| 错误通知处理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L286-L313) | 286-313 |
| 权限请求处理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L315-L334) | 315-334 |
| 问题询问处理 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L336-L351) | 336-351 |

**关键常量**：

- `DEFAULT_CONFIG`：默认配置（第 56-68 行）
  - `notifyChildSessions: false`：默认不通知子会话
  - `sounds.idle: "Glass"`：任务完成音效
  - `sounds.error: "Basso"`：错误音效
  - `sounds.permission: "Submarine"`：权限请求音效
  - `quietHours.start: "22:00"`、`quietHours.end: "08:00"`：默认静音时段

- `TERMINAL_PROCESS_NAMES`：终端名称到 macOS 进程名的映射（第 71-84 行）

**关键函数**：

- `loadConfig()`：加载并合并配置文件与默认配置，配置文件不存在或无效时使用默认值
- `detectTerminalInfo()`：检测终端信息（名称、Bundle ID、进程名）
- `isTerminalFocused()`：检查终端是否为当前前台应用（macOS）
- `isQuietHours()`：检查当前时间是否在静音时段内
- `isParentSession()`：检查会话是否为父会话
- `sendNotification()`：发送原生通知，支持 macOS 点击聚焦
- `runOsascript()`：执行 AppleScript（macOS），失败时返回 null
- `getBundleId()`：获取应用的 Bundle ID（macOS）

**业务规则**：

- BR-1-1：默认只通知父会话，不通知子会话（`notify.ts:256-259`）
- BR-1-2：终端聚焦时抑制通知（`notify.ts:265`）
- BR-1-3：静音时段内不发送通知（`notify.ts:262`）
- BR-1-4：权限请求始终通知，无需父会话检查（`notify.ts:319`）
- BR-1-5：问题询问不做焦点检查，支持 tmux 工作流（`notify.ts:340`）
- BR-1-6：macOS 支持点击通知聚焦终端（`notify.ts:238-240`）

**异常处理**：

- `loadConfig()`：配置文件不存在或 JSON 解析失败时，使用默认配置（`notify.ts:110-113`）
- `isParentSession()`：会话查询失败时，假设是父会话（通知而非遗漏）（`notify.ts:210-212`）
- `runOsascript()`：osascript 执行失败时返回 null（`notify.ts:120-132`）
- `handleSessionIdle()`：会话信息获取失败时，使用默认标题（`notify.ts:274-276`）

</details>
