---
title: "支持的终端：37+ 终端模拟器全收录与自动检测原理完全详解 | opencode-notify 教程"
sidebarTitle: "你的终端支持吗"
subtitle: "支持的终端列表：37+ 终端模拟器全收录"
description: "学习 opencode-notify 支持的 37+ 终端模拟器，包括 macOS、Windows、Linux 平台的完整终端列表。本教程介绍终端自动检测原理、手动指定方法、解决终端识别失败问题，帮助你优化通知体验、启用智能过滤功能、避免通知噪音、减少窗口切换、保持专注工作状态并有效提升工作效率与体验。"
tags:
  - "终端"
  - "终端检测"
  - "平台支持"
prerequisite:
  - "start-quick-start"
order: 60
---

# 支持的终端列表：37+ 终端模拟器全收录

## 学完你能做什么

- 了解 opencode-notify 支持的所有终端模拟器
- 查看你使用的终端是否在支持列表中
- 理解终端自动检测的工作原理
- 学会如何手动指定终端类型

## 你现在的困境

你安装了 opencode-notify,但通知功能不太正常。可能终端识别不到,或者焦点检测失效。你使用的终端是 Alacritty / Windows Terminal / tmux,不确定是否被支持。终端识别失败会导致智能过滤功能失效,影响使用体验。

## 什么时候用这一招

**在以下场景下查看支持的终端列表**:
- 你想知道自己使用的终端是否被支持
- 终端自动检测失败,需要手动配置
- 你在多个终端之间切换,想了解兼容性
- 你想知道终端检测的技术原理

## 核心思路

opencode-notify 使用 `detect-terminal` 库自动识别你使用的终端模拟器,**支持 37+ 终端**。检测成功后,插件可以:
- **启用焦点检测**(仅 macOS): 终端在前台时抑制通知
- **支持点击聚焦**(仅 macOS): 点击通知切换到终端窗口

::: info 为什么终端检测很重要?

终端检测是智能过滤的基础:
- **焦点检测**: 避免你正在查看终端时还弹出通知
- **点击聚焦**: macOS 用户点击通知可以直接回到终端
- **性能优化**: 不同终端可能需要特殊处理

如果检测失败,通知功能仍可用,但智能过滤会失效。
:::

## 支持的终端列表

### macOS 终端

| 终端名称 | 进程名 | 特性 |
|--- | --- | ---|
| **Ghostty** | Ghostty | ✅ 焦点检测 + ✅ 点击聚焦 |
| **iTerm2** | iTerm2 | ✅ 焦点检测 + ✅ 点击聚焦 |
| **Kitty** | kitty | ✅ 焦点检测 + ✅ 点击聚焦 |
| **WezTerm** | WezTerm | ✅ 焦点检测 + ✅ 点击聚焦 |
| **Alacritty** | Alacritty | ✅ 焦点检测 + ✅ 点击聚焦 |
| **Terminal.app** | Terminal | ✅ 焦点检测 + ✅ 点击聚焦 |
| **Hyper** | Hyper | ✅ 焦点检测 + ✅ 点击聚焦 |
| **Warp** | Warp | ✅ 焦点检测 + ✅ 点击聚焦 |
| **VS Code 集成终端** | Code / Code - Insiders | ✅ 焦点检测 + ✅ 点击聚焦 |

::: tip macOS 终端特性
macOS 终端支持完整功能:
- 原生通知(Notification Center)
- 焦点检测(通过 AppleScript)
- 点击通知自动聚焦终端
- 自定义系统音效

所有终端都使用 macOS Notification Center 发送通知。
:::

### Windows 终端

| 终端名称 | 特性 |
|--- | ---|
| **Windows Terminal** | ✅ 原生通知(Toast) |
| **Git Bash** | ✅ 原生通知(Toast) |
| **ConEmu** | ✅ 原生通知(Toast) |
| **Cmder** | ✅ 原生通知(Toast) |
| **PowerShell** | ✅ 原生通知(Toast) |
| **VS Code 集成终端** | ✅ 原生通知(Toast) |
| **其他 Windows 终端** | ✅ 原生通知(Toast) |

::: details Windows 终端限制
Windows 平台功能相对基础:
- ✅ 原生通知(Windows Toast)
- ✅ 终端检测
- ❌ 焦点检测(系统限制)
- ❌ 点击聚焦(系统限制)

所有 Windows 终端都通过 Windows Toast 发送通知,使用系统默认声音。
:::

### Linux 终端

| 终端名称 | 特性 |
|--- | ---|
|--- | ---|
| **konsole** | ✅ 原生通知(notify-send) |
| **xterm** | ✅ 原生通知(notify-send) |
| **lxterminal** | ✅ 原生通知(notify-send) |
|--- | ---|
|--- | ---|
| **alacritty** | ✅ 原生通知(notify-send) |
| **kitty** | ✅ 原生通知(notify-send) |
| **wezterm** | ✅ 原生通知(notify-send) |
| **VS Code 集成终端** | ✅ 原生通知(notify-send) |
| **其他 Linux 终端** | ✅ 原生通知(notify-send) |

::: details Linux 终端限制
Linux 平台功能相对基础:
- ✅ 原生通知(notify-send)
- ✅ 终端检测
- ❌ 焦点检测(系统限制)
- ❌ 点击聚焦(系统限制)

所有 Linux 终端都通过 notify-send 发送通知,使用桌面环境默认声音。
:::

### 其他支持的终端

`detect-terminal` 库还支持以下终端(可能不完全列出):

**Windows / WSL**:
- WSL 终端
- Windows Command Prompt (cmd)
- PowerShell (pwsh)
- PowerShell Core (pwsh-preview)
- Cygwin Mintty
- MSYS2 MinTTY

**macOS / Linux**:
- tmux(通过环境变量检测)
- screen
- rxvt-unicode (urxvt)
- rxvt
- Eterm
- eterm
- aterm
- wterm
- sakura
- roxterm
- xfce4-terminal
- pantheon-terminal
- lxterminal
- mate-terminal
- terminator
- tilix
- guake
- yakuake
- qterminal
- terminology
- deepin-terminal
- gnome-terminal
- konsole
- xterm
- uxterm
- eterm

::: tip 终端数量统计
opencode-notify 通过 `detect-terminal` 库支持 **37+ 终端模拟器**。
如果你使用的终端不在列表中,可以查看[detect-terminal 完整列表](https://github.com/jonschlinkert/detect-terminal#supported-terminals)。
:::

## 终端检测原理

### 自动检测流程

插件启动时会自动检测终端类型:

```
1. 调用 detect-terminal() 库
    ↓
2. 扫描系统进程,识别当前终端
    ↓
3. 返回终端名称(如 "ghostty", "kitty")
    ↓
4. 查找映射表,获取 macOS 进程名
    ↓
5. macOS: 动态获取 Bundle ID
    ↓
6. 保存终端信息,用于后续通知
```

### macOS 终端映射表

源码中预定义了常用终端的进程名映射:

```typescript
// src/notify.ts:71-84
const TERMINAL_PROCESS_NAMES: Record<string, string> = {
    ghostty: "Ghostty",
    kitty: "kitty",
    iterm: "iTerm2",
    iterm2: "iTerm2",
    wezterm: "WezTerm",
    alacritty: "Alacritty",
    terminal: "Terminal",
    apple_terminal: "Terminal",
    hyper: "Hyper",
    warp: "Warp",
    vscode: "Code",
    "vscode-insiders": "Code - Insiders",
}
```

::: details 检测源码
完整的终端检测逻辑:

```typescript
// src/notify.ts:145-164
async function detectTerminalInfo(config: NotifyConfig): Promise<TerminalInfo> {
    // Use config override if provided
    const terminalName = config.terminal || detectTerminal() || null
    
    if (!terminalName) {
        return { name: null, bundleId: null, processName: null }
    }
    
    // Get process name for focus detection
    const processName = TERMINAL_PROCESS_NAMES[terminalName.toLowerCase()] || terminalName
    
    // Dynamically get bundle ID from macOS (no hardcoding!)
    const bundleId = await getBundleId(processName)
    
    return {
        name: terminalName,
        bundleId,
        processName,
    }
}
```

:::

### macOS 特殊处理

macOS 平台有额外的检测步骤:

1. **获取 Bundle ID**: 通过 `osascript` 动态查询应用的 Bundle ID(如 `com.mitchellh.ghostty`)
2. **焦点检测**: 通过 `osascript` 查询前台应用进程名
3. **点击聚焦**: 通知设置 `activate` 参数,点击时通过 Bundle ID 切换到终端

::: info 动态 Bundle ID 的好处
源码不硬编码 Bundle ID,而是通过 `osascript` 动态查询。这意味着:
- ✅ 支持终端更新(Bundle ID 不变即可)
- ✅ 减少维护成本(不需要手动更新列表)
- ✅ 兼容性更好(任何 macOS 终端理论上都支持)
:::

### tmux 终端支持

tmux 是一个终端复用器,插件通过环境变量检测 tmux 会话:

```bash
# 在 tmux 会话中
echo $TMUX
# 输出: /tmp/tmux-1000/default,1234,0

# 不在 tmux 中
echo $TMUX
# 输出: (空)
```

::: tip tmux 工作流支持
tmux 用户可以正常使用通知功能:
- 自动检测到 tmux 会话
- 通知发送到当前终端窗口
- **不进行焦点检测**(支持 tmux 多窗口工作流)
:::

## 手动指定终端

如果自动检测失败,你可以在配置文件中手动指定终端类型。

### 何时需要手动指定

以下情况需要手动配置:
- 你使用的终端不在 `detect-terminal` 支持列表中
- 你在一个终端中嵌套使用另一个终端(如 tmux + Alacritty)
- 自动检测结果不正确(误识别为其他终端)

### 配置方法

**第 1 步: 打开配置文件**

::: code-group

```bash [macOS/Linux]
nano ~/.config/opencode/kdco-notify.json
```

```powershell [Windows]
notepad $env:USERPROFILE\.config\opencode\kdco-notify.json
```

:::

**第 2 步: 添加 terminal 配置**

```json
{
  "terminal": "ghostty"
}
```

**第 3 步: 保存并重启 OpenCode**

### 可用终端名称

终端名称必须是 `detect-terminal` 库识别的名称。常见名称:

| 终端 | 配置值 |
|--- | ---|
| Ghostty | `"ghostty"` |
| iTerm2 | `"iterm2"` 或 `"iterm"` |
| Kitty | `"kitty"` |
| WezTerm | `"wezterm"` |
| Alacritty | `"alacritty"` |
| macOS Terminal | `"terminal"` 或 `"apple_terminal"` |
| Hyper | `"hyper"` |
| Warp | `"warp"` |
| VS Code | `"vscode"` |
| VS Code Insiders | `"vscode-insiders"` |
| Windows Terminal | `"windows-terminal"` 或 `"Windows Terminal"` |

::: details 完整可用名称
查看[detect-terminal 源码](https://github.com/jonschlinkert/detect-terminal)获取完整列表。
:::

### macOS 终端完整功能示例

```json
{
  "terminal": "ghostty",
  "notifyChildSessions": false,
  "sounds": {
    "idle": "Glass",
    "error": "Basso",
    "permission": "Submarine"
  }
}
```

### Windows/Linux 终端示例

```json
{
  "terminal": "Windows Terminal",
  "notifyChildSessions": false,
  "quietHours": {
    "enabled": true,
    "start": "22:00",
    "end": "08:00"
  }
}
```

::: warning Windows/Linux 配置限制
Windows 和 Linux 不支持 `sounds` 配置项(使用系统默认声音),也不支持焦点检测(系统限制)。
:::

## 检查点 ✅

完成阅读后,请确认:

- [ ] 知道自己使用的终端是否被支持
- [ ] 了解终端自动检测的原理
- [ ] 知道如何手动指定终端类型
- [ ] 理解不同平台的功能差异

## 踩坑提醒

### 常见问题 1: 终端检测失败

**现象**: 通知不显示,或者焦点检测失效。

**原因**: `detect-terminal` 无法识别你的终端。

**解决方法**:

1. 确认你的终端名称是否正确(大小写敏感)
2. 在配置文件中手动指定:

```json
{
  "terminal": "你的终端名称"
}
```

3. 查看[detect-terminal 支持列表](https://github.com/jonschlinkert/detect-terminal#supported-terminals)

### 常见问题 2: macOS 点击聚焦失效

**现象**: 点击通知不能切换到终端窗口。

**原因**: Bundle ID 获取失败,或者终端未在映射表中。

**解决方法**:

1. 检查终端是否在 `TERMINAL_PROCESS_NAMES` 映射表中
2. 如果不在,可以手动指定终端名称

**验证方法**:

```typescript
// 临时调试(在 notify.ts 中添加 console.log)
console.log("Terminal info:", terminalInfo)
// 应该看到 { name: "ghostty", bundleId: "com.mitchellh.ghostty", processName: "Ghostty" }
```

### 常见问题 3: tmux 终端焦点检测不工作

**现象**: 在 tmux 会话中,终端在前台时仍弹出通知。

**原因**: tmux 有自己的会话管理,焦点检测可能不准确。

**说明**: 这是正常现象。tmux 工作流中,焦点检测功能受限,但仍可以正常接收通知。

### 常见问题 4: VS Code 集成终端识别为 Code

**现象**: 配置中 `"vscode"` 和 `"vscode-insiders"` 都有效,但不知道该用哪个。

**说明**:
- 使用 **VS Code Stable** → 配置 `"vscode"`
- 使用 **VS Code Insiders** → 配置 `"vscode-insiders"`

自动检测会根据安装的版本自动选择正确的进程名。

### 常见问题 5: Windows Terminal 识别失败

**现象**: Windows Terminal 使用 "windows-terminal" 名称,但检测不到。

**原因**: Windows Terminal 的进程名可能是 `WindowsTerminal.exe` 或 `Windows Terminal`。

**解决方法**: 尝试不同的配置值:

```json
{
  "terminal": "windows-terminal"  // 或 "Windows Terminal"
}
```

## 本课小结

本课我们了解了:

- ✅ opencode-notify 支持 37+ 终端模拟器
- ✅ macOS 终端支持完整功能(焦点检测 + 点击聚焦)
- ✅ Windows/Linux 终端支持基础通知
- ✅ 终端自动检测的原理和源码实现
- ✅ 如何手动指定终端类型
- ✅ 常见终端识别问题的解决方法

**关键要点**:
1. 终端检测是智能过滤的基础,支持 37+ 终端
2. macOS 终端功能最丰富,Windows/Linux 功能相对基础
3. 自动检测失败时,可以手动配置终端名称
4. tmux 用户可以正常使用通知,但焦点检测受限
5. macOS 的 Bundle ID 动态获取,兼容性更好

## 下一课预告

> 下一课我们学习 **[配置参考](../../advanced/config-reference/)**。
>
> 你会学到:
> - 完整的配置项说明和默认值
> - 音效自定义(macOS)
> - 静音时段配置
> - 子会话通知开关
> - 终端类型覆盖
> - 高级配置技巧

---

## 附录:源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间:2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| 终端映射表 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L71-L84) | 71-84 |
| 终端检测函数 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L145-L164) | 145-164 |
| macOS Bundle ID 获取 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L135-L137) | 135-137 |
| macOS 前台应用检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L139-L143) | 139-143 |
| macOS 焦点检测 | [`src/notify.ts`](https://github.com/kdcokenny/opencode-notify/blob/main/src/notify.ts#L166-L175) | 166-175 |

**关键常量**:
- `TERMINAL_PROCESS_NAMES`: 终端名称到 macOS 进程名的映射表

**关键函数**:
- `detectTerminalInfo()`: 检测终端信息(名称、Bundle ID、进程名)
- `detectTerminal()`: 调用 detect-terminal 库识别终端
- `getBundleId()`: 通过 osascript 动态获取 macOS 应用的 Bundle ID
- `getFrontmostApp()`: 查询当前前台应用名称
- `isTerminalFocused()`: 检测终端是否为前台窗口(仅 macOS)

**外部依赖**:
- [detect-terminal](https://github.com/jonschlinkert/detect-terminal): 终端检测库,支持 37+ 终端

</details>
