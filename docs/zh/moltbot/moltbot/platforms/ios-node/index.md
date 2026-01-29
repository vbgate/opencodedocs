---
title: "iOS 节点配置：连接 Gateway 与相机 Canvas Voice Wake | Clawdbot 教程"
sidebarTitle: "让 AI 用 iPhone"
subtitle: "iOS 节点配置指南"
description: "学习如何配置 iOS 节点连接到 Gateway，使用相机拍照、Canvas 可视化界面、Voice Wake 语音唤醒、Talk Mode 连续对话、位置获取等设备本地操作功能，通过 Bonjour 和 Tailscale 自动发现，配对认证和安全控制后实现多设备 AI 协同，支持前台后台和权限管理。"
tags:
  - "iOS 节点"
  - "设备节点"
  - "Canvas"
  - "Voice Wake"
prerequisite:
  - "start-gateway-startup"
order: 170
---

# iOS 节点配置指南

## 学完你能做什么

配置 iOS 节点后，你可以：

- ✅ 让 AI 助手调用 iOS 设备的相机拍照或录制视频
- ✅ 在 iOS 设备上渲染 Canvas 可视化界面
- ✅ 使用 Voice Wake 和 Talk Mode 进行语音交互
- ✅ 获取 iOS 设备的位置信息
- ✅ 通过 Gateway 统一管理多个设备节点

## 你现在的困境

你希望在自己的 iOS 设备上扩展 AI 助手的能力，让它能够：

- **调用相机拍照或录制视频**：当你说"拍张照"时，AI 能自动使用 iPhone 拍照
- **显示可视化界面**：在 iPhone 上展示 AI 生成的图表、表单或控制面板
- **语音唤醒和连续对话**：无需动手，直接说"Clawd"就能唤醒助手开始对话
- **获取设备信息**：让 AI 知道你的位置、屏幕状态等信息

## 什么时候用这一招

- **移动场景**：你希望 AI 能使用 iPhone 的相机、屏幕等能力
- **多设备协同**：Gateway 运行在服务器上，但需要调用本地设备功能
- **语音交互**：想要用 iPhone 作为便携式语音助手终端

::: info 什么是 iOS 节点？
iOS 节点是运行在 iPhone/iPad 上的 Companion 应用，通过 WebSocket 连接到 Clawdbot Gateway。它不是 Gateway 本身，而是作为"外设"提供设备本地操作能力。

**与 Gateway 的区别**：
- **Gateway**：运行在服务器/macOS 上，负责消息路由、AI 模型调用、工具分发
- **iOS 节点**：运行在 iPhone 上，负责执行设备本地操作（相机、Canvas、位置等）
:::

---

## 🎒 开始前的准备

::: warning 前置要求

在开始之前，请确认：

1. **Gateway 已启动并运行**
   - 确保 Gateway 在另一台设备上运行（macOS、Linux 或 Windows via WSL2）
   - Gateway 绑定到可访问的网络地址（局域网或 Tailscale）

2. **网络连通性**
   - iOS 设备和 Gateway 在同一局域网（推荐），或通过 Tailscale 连接
   - iOS 设备能访问 Gateway 的 IP 地址和端口（默认 18789）

3. **获取 iOS 应用**
   - iOS 应用目前是**内部预览版**，不公开分发
   - 需要从源码构建或获取 TestFlight 测试版
:::

## 核心思路

iOS 节点的工作流程：

```
[Gateway] ←→ [iOS 节点]
     ↓            ↓
  [AI 模型]   [设备能力]
     ↓            ↓
  [决策执行]   [相机/Canvas/语音]
```

**关键技术点**：

1. **自动发现**：通过 Bonjour（局域网）或 Tailscale（跨网络）自动发现 Gateway
2. **配对认证**：首次连接需要 Gateway 端手动批准，建立信任关系
3. **协议通信**：使用 WebSocket 协议 (`node.invoke`) 发送命令
4. **权限控制**：设备本地命令需要用户授权（相机、位置等）

**架构特点**：

- **安全性**：所有设备操作都需要用户在 iOS 端明确授权
- **隔离性**：节点不运行 Gateway，只执行本地操作
- **灵活性**：支持前台、后台、远程等多种使用场景

---

## 跟我做

### 第 1 步：启动 Gateway

在 Gateway 主机上启动服务：

```bash
clawdbot gateway --port 18789
```

**你应该看到**：

```
✅ Gateway running on ws://0.0.0.0:18789
✅ Bonjour advertisement active: _clawdbot._tcp
```

::: tip 跨网络访问
如果 Gateway 和 iOS 设备不在同一局域网，使用 **Tailscale Serve/Funnel**：

```bash
clawdbot gateway --port 18789 --tailscale funnel
```

iOS 设备会通过 Tailscale 自动发现 Gateway。
:::

### 第 2 步：iOS 应用连接

在 iOS 应用中：

1. 打开 **Settings**（设置）
2. 找到 **Gateway** 部分
3. 选择一个自动发现的 Gateway（或在下方启用 **Manual Host** 手动输入主机和端口）

**你应该看到**：

- 应用尝试连接到 Gateway
- 状态显示为 "Connected" 或 "Pairing pending"

::: details 手动配置主机

如果自动发现失败，手动输入 Gateway 地址：

1. 启用 **Manual Host**
2. 输入 Gateway 主机（如 `192.168.1.100`）
3. 输入端口（默认 `18789`）
4. 点击 "Connect"

:::

### 第 3 步：批准配对请求

**在 Gateway 主机上**，批准 iOS 节点的配对请求：

```bash
# 查看待批准的节点
clawdbot nodes pending

# 批准特定节点（替换 <requestId>）
clawdbot nodes approve <requestId>
```

**你应该看到**：

```
✅ Node paired successfully
Node: iPhone (iOS)
ID: node-abc123
```

::: tip 拒绝配对
如果想拒绝某个节点的连接请求：

```bash
clawdbot nodes reject <requestId>
```

:::

**检查点 ✅**：在 Gateway 上验证节点状态

```bash
clawdbot nodes status
```

你应该看到你的 iOS 节点显示为 `paired` 状态。

### 第 4 步：测试节点连接

**从 Gateway 测试节点通信**：

```bash
# 通过 Gateway 调用节点命令
clawdbot gateway call node.list --params "{}"
```

**你应该看到**：

```json
{
  "result": [
    {
      "id": "node-abc123",
      "displayName": "iPhone (iOS)",
      "platform": "ios",
      "capabilities": ["camera", "canvas", "location", "screen", "voicewake"]
    }
  ]
}
```

---

## 使用节点功能

### 相机拍照

iOS 节点支持相机拍照和录制视频：

```bash
# 拍照（默认前置摄像头）
clawdbot nodes camera snap --node "iPhone (iOS)"

# 拍照（后置摄像头，自定义分辨率）
clawdbot nodes camera snap --node "iPhone (iOS)" --facing back --max-width 1920

# 录制视频（5秒）
clawdbot nodes camera clip --node "iPhone (iOS)" --duration 5000
```

**你应该看到**：

```
MEDIA:/tmp/clawdbot-camera-snap-abc123.jpg
```

::: warning 前台要求
相机命令要求 iOS 应用处于**前台**。如果应用在后台，会返回 `NODE_BACKGROUND_UNAVAILABLE` 错误。

:::

**iOS 相机参数**：

| 参数 | 类型 | 默认值 | 说明 |
|--- | --- | --- | ---|
| `facing` | `front\|back` | `front` | 摄像头朝向 |
| `maxWidth` | number | `1600` | 最大宽度（像素） |
| `quality` | `0..1` | `0.9` | JPEG 质量（0-1） |
| `durationMs` | number | `3000` | 视频时长（毫秒） |
| `includeAudio` | boolean | `true` | 是否包含音频 |

### Canvas 可视化界面

iOS 节点可以显示 Canvas 可视化界面：

```bash
# 导航到 URL
clawdbot nodes canvas navigate --node "iPhone (iOS)" --target "https://example.com"

# 执行 JavaScript
clawdbot nodes canvas eval --node "iPhone (iOS)" --js "document.title"

# 截图（保存为 JPEG）
clawdbot nodes canvas snapshot --node "iPhone (iOS)" --format jpeg --max-width 900
```

**你应该看到**：

```
MEDIA:/tmp/clawdbot-canvas-snap-abc123.jpg
```

::: tip A2UI 自动推送
如果 Gateway 配置了 `canvasHost`，iOS 节点会在连接时自动导航到 A2UI 界面。
:::

### Voice Wake 语音唤醒

在 iOS 应用的 **Settings** 中启用 Voice Wake：

1. 打开 **Voice Wake** 开关
2. 设置唤醒词（默认："clawd"、"claude"、"computer"）
3. 确保 iOS 授权了麦克风权限

::: info 全局唤醒词
Clawdbot 的唤醒词是**全局配置**，由 Gateway 管理。所有节点（iOS、Android、macOS）使用同一份唤醒词列表。

修改唤醒词会自动同步到所有设备。
:::

### Talk Mode 连续对话

启用 Talk Mode 后，AI 会持续通过 TTS 朗读回复，并持续监听语音输入：

1. 在 iOS 应用 **Settings** 中启用 **Talk Mode**
2. AI 回复时会自动朗读
3. 可以通过语音持续对话，无需手动点击

::: warning 后台限制
iOS 可能会挂起后台音频。当应用不在前台时，语音功能是**尽力而为**（best-effort）。
:::

---

## 常见问题

### 配对提示从未出现

**问题**：iOS 应用显示 "Connected"，但 Gateway 没有弹出配对提示。

**解决**：

```bash
# 1. 手动查看待批准节点
clawdbot nodes pending

# 2. 批准节点
clawdbot nodes approve <requestId>

# 3. 验证连接
clawdbot nodes status
```

### 连接失败（重装后）

**问题**：重装 iOS 应用后无法连接到 Gateway。

**原因**：Keychain 中的配对 Token 已被清除。

**解决**：重新执行配对流程（步骤 3）。

### A2UI_HOST_NOT_CONFIGURED

**问题**：Canvas 命令失败，提示 `A2UI_HOST_NOT_CONFIGURED`。

**原因**：Gateway 没有配置 `canvasHost` URL。

**解决**：

在 Gateway 配置中设置 Canvas 主机：

```bash
clawdbot config set canvasHost "http://<gateway-host>:18793/__clawdbot__/canvas/"
```

### NODE_BACKGROUND_UNAVAILABLE

**问题**：相机/Canvas 命令失败，返回 `NODE_BACKGROUND_UNAVAILABLE`。

**原因**：iOS 应用不在前台。

**解决**：将 iOS 应用切换到前台，然后重试命令。

---

## 本课小结

通过本课，你学会了：

✅ iOS 节点的概念和架构
✅ 如何自动发现和连接到 Gateway
✅ 配对认证流程
✅ 使用相机、Canvas、Voice Wake 等功能
✅ 常见问题的排查方法

**核心要点**：

- iOS 节点是设备本地操作能力的提供者，不是 Gateway
- 所有设备操作都需要用户授权和前台状态
- 配对是安全的必要步骤，只信任已批准的节点
- Voice Wake 和 Talk Mode 需要麦克风权限

## 下一课预告

> 下一课我们学习 **[Android 节点配置](../android-node/)**。
>
> 你会学到：
> - 如何配置 Android 节点连接到 Gateway
> - 使用 Android 设备的相机、屏幕录制、Canvas 功能
> - 处理 Android 特有的权限和兼容性问题

---

## 附录：源码参考

<details>
<summary><strong>点击展开查看源码位置</strong></summary>

> 更新时间：2026-01-27

| 功能 | 文件路径 | 行号 |
|--- | --- | ---|
| iOS 应用入口 | [`apps/ios/Sources/ClawdbotApp.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/ClawdbotApp.swift) | 1-30 |
| Canvas 渲染 | [`apps/ios/Sources/RootCanvas.swift`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/RootCanvas.swift) | 1-250 |
| Gateway 连接 | [`apps/ios/Sources/Gateway/`](https://github.com/moltbot/moltbot/blob/main/apps/ios/Sources/Gateway/) | - |
| 节点协议 runner | [`src/node-host/runner.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/runner.ts) | 1-1100 |
| 节点配置 | [`src/node-host/config.ts`](https://github.com/moltbot/moltbot/blob/main/src/node-host/config.ts) | 1-50 |
| iOS 平台文档 | [`docs/platforms/ios.md`](https://github.com/moltbot/moltbot/blob/main/docs/platforms/ios.md) | 1-105 |
| 节点系统文档 | [`docs/nodes/index.md`](https://github.com/moltbot/moltbot/blob/main/docs/nodes/index.md) | 1-306 |

**关键常量**：
- `GATEWAY_DEFAULT_PORT = 18789`：Gateway 默认端口
- `NODE_ROLE = "node"`：节点连接的角色标识

**关键命令**：
- `clawdbot nodes pending`：列出待批准的节点
- `clawdbot nodes approve <requestId>`：批准节点配对
- `clawdbot nodes invoke --node <id> --command <cmd>`：调用节点命令
- `clawdbot nodes camera snap --node <id>`：拍照
- `clawdbot nodes canvas navigate --node <id> --target <url>`：导航 Canvas

**协议方法**：
- `node.invoke.request`：节点命令调用请求
- `node.invoke.result`：节点命令执行结果
- `voicewake.get`：获取唤醒词列表
- `voicewake.set`：设置唤醒词列表
- `voicewake.changed`：唤醒词变更事件

</details>
